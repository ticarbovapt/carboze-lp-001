-- ============================================================
-- Ação Parada Certa — estrutura de agendamentos (Supabase)
-- Projeto: grupocarbo (wpkfirmapxevzpxjovjr)
--
-- Rode este script inteiro no SQL Editor do Supabase.
-- Ele é idempotente: pode rodar de novo sem quebrar nada.
--
-- Modelo de segurança:
--   - A tabela NÃO é acessível diretamente pela chave anon (RLS sem policy).
--   - A página pública só enxerga a tabela através de duas funções:
--       parada_certa_disponibilidade() -> devolve só a contagem por horário
--                                          (nunca dados pessoais)
--       parada_certa_agendar()         -> cria o agendamento com trava de
--                                          capacidade (2 por horário)
-- ============================================================

-- 1) Tabela -----------------------------------------------------
create table if not exists public.agendamentos_parada_certa (
  id                   uuid        primary key default gen_random_uuid(),
  nome                 text        not null,
  telefone             text        not null,         -- só dígitos com DDI: 5584999998888
  veiculo              text        not null,         -- modelo do carro
  ano                  text,
  km                   text,
  data                 date        not null,
  horario              text        not null,         -- '09:00', '09:30', ...
  status               text        not null default 'confirmado', -- confirmado | cancelado
  confirmacao_enviada  boolean     not null default false,        -- controle p/ n8n
  lembrete_enviado     boolean     not null default false,        -- controle p/ n8n
  created_at           timestamptz not null default now()
);

-- índice para contar ocupação de cada horário rapidamente
create index if not exists idx_apc_slot
  on public.agendamentos_parada_certa (data, horario)
  where status = 'confirmado';

-- um telefone só pode ter 1 agendamento ativo por dia
create unique index if not exists uq_apc_telefone_dia
  on public.agendamentos_parada_certa (telefone, data)
  where status = 'confirmado';

-- 2) RLS: tranca o acesso direto pela chave anon --------------
alter table public.agendamentos_parada_certa enable row level security;
-- (nenhuma policy criada de propósito -> anon não lê nem escreve direto)

-- 3) Disponibilidade (sem dados pessoais) ----------------------
create or replace function public.parada_certa_disponibilidade(p_data date)
returns table (horario text, ocupadas integer)
language sql
security definer
set search_path = public
as $$
  select horario, count(*)::integer as ocupadas
  from public.agendamentos_parada_certa
  where data = p_data and status = 'confirmado'
  group by horario;
$$;

-- 4) Criar agendamento com trava de capacidade -----------------
create or replace function public.parada_certa_agendar(
  p_nome     text,
  p_telefone text,
  p_veiculo  text,
  p_ano      text,
  p_km       text,
  p_data     date,
  p_horario  text
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_horarios_validos text[] := array['09:00','09:25','09:50','10:15','10:40','11:05','11:30','11:55','12:20','12:45','13:10','13:35'];
  v_tel  text := regexp_replace(coalesce(p_telefone,''), '\D', '', 'g');
  v_nome text := btrim(coalesce(p_nome,''));
  v_count integer;
begin
  -- validações básicas
  if char_length(v_nome) < 3 then
    return json_build_object('ok', false, 'erro', 'nome');
  end if;
  if char_length(v_tel) < 12 or char_length(v_tel) > 13 then
    return json_build_object('ok', false, 'erro', 'telefone');
  end if;
  if btrim(coalesce(p_veiculo,'')) = '' then
    return json_build_object('ok', false, 'erro', 'veiculo');
  end if;
  if not (p_horario = any(v_horarios_validos)) then
    return json_build_object('ok', false, 'erro', 'horario_invalido');
  end if;

  -- serializa as reservas do MESMO horário (evita duas pessoas
  -- pegando a última vaga ao mesmo tempo)
  perform pg_advisory_xact_lock(hashtextextended(p_data::text || '|' || p_horario, 0));

  -- já tem agendamento ativo com esse telefone nesse dia?
  select count(*) into v_count
  from public.agendamentos_parada_certa
  where telefone = v_tel and data = p_data and status = 'confirmado';
  if v_count > 0 then
    return json_build_object('ok', false, 'erro', 'duplicado');
  end if;

  -- capacidade do horário (2 por horário)
  select count(*) into v_count
  from public.agendamentos_parada_certa
  where data = p_data and horario = p_horario and status = 'confirmado';
  if v_count >= 2 then
    return json_build_object('ok', false, 'erro', 'cheio');
  end if;

  insert into public.agendamentos_parada_certa
    (nome, telefone, veiculo, ano, km, data, horario)
  values
    (v_nome, v_tel, btrim(p_veiculo), nullif(btrim(coalesce(p_ano,'')),''),
     nullif(btrim(coalesce(p_km,'')),''), p_data, p_horario);

  return json_build_object('ok', true, 'horario', p_horario, 'data', p_data);
end;
$$;

-- 5) Permissões: a página pública (anon) só pode chamar as funções
grant execute on function public.parada_certa_disponibilidade(date) to anon;
grant execute on function public.parada_certa_agendar(text,text,text,text,text,date,text) to anon;
