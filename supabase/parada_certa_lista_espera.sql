-- ============================================================
-- Ação Parada Certa — lista de espera
-- Rode no SQL Editor. Idempotente.
--   - Tabela da lista de espera (anon só insere, não lê)
--   - Função para marcar "contatado" (protegida pela senha do admin)
--   - Atualiza parada_certa_admin para devolver também a lista de espera
-- ============================================================

-- 1) Tabela
create table if not exists public.parada_certa_lista_espera (
  id         uuid        primary key default gen_random_uuid(),
  nome       text        not null,
  telefone   text        not null,
  veiculo    text        not null,
  contatado  boolean     not null default false,
  created_at timestamptz not null default now()
);

alter table public.parada_certa_lista_espera enable row level security;

drop policy if exists "anon insere lista_espera" on public.parada_certa_lista_espera;
create policy "anon insere lista_espera"
  on public.parada_certa_lista_espera for insert to anon with check (true);

grant insert on table public.parada_certa_lista_espera to anon;

-- 2) Marcar contatado / não contatado (admin)
create or replace function public.parada_certa_espera_contatar(
  p_id uuid, p_contatado boolean, p_senha text
)
returns json
language plpgsql security definer set search_path = public
as $$
declare v_ok boolean;
begin
  select (p_senha is not null and p_senha = valor) into v_ok
  from public.parada_certa_config where chave = 'admin_senha';
  if not coalesce(v_ok, false) then return json_build_object('ok', false); end if;
  update public.parada_certa_lista_espera set contatado = p_contatado where id = p_id;
  return json_build_object('ok', true);
end;
$$;

grant execute on function public.parada_certa_espera_contatar(uuid, boolean, text) to anon;

-- 3) Admin: agendamentos + lista de espera
create or replace function public.parada_certa_admin(p_senha text)
returns json
language plpgsql security definer set search_path = public
as $$
declare v_ok boolean;
begin
  select (p_senha is not null and p_senha = valor) into v_ok
  from public.parada_certa_config where chave = 'admin_senha';
  if not coalesce(v_ok, false) then return json_build_object('ok', false); end if;

  return json_build_object(
    'ok', true,
    'agendamentos', coalesce((
      select json_agg(row_to_json(t))
      from (
        select id, nome, telefone, veiculo, ano, km,
               to_char(data,'YYYY-MM-DD') as data, horario,
               confirmacao_enviada, lembrete_24h_enviado, lembrete_1h_enviado,
               to_char(created_at at time zone 'America/Recife','DD/MM/YYYY HH24:MI') as criado_em
        from public.agendamentos_parada_certa
        where status = 'confirmado'
        order by data, horario, created_at
      ) t
    ), '[]'::json),
    'lista_espera', coalesce((
      select json_agg(row_to_json(e))
      from (
        select id, nome, telefone, veiculo, contatado,
               to_char(created_at at time zone 'America/Recife','DD/MM/YYYY HH24:MI') as criado_em
        from public.parada_certa_lista_espera
        order by created_at
      ) e
    ), '[]'::json)
  );
end;
$$;

grant execute on function public.parada_certa_admin(text) to anon;
