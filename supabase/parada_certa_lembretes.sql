-- ============================================================
-- Ação Parada Certa — lembretes (24h e 1h antes)
-- Projeto: grupocarbo (wpkfirmapxevzpxjovjr)
--
-- Rode DEPOIS do parada_certa.sql e do parada_certa_admin.sql.
-- Idempotente.
--
-- O disparo é feito pelo Vercel Cron, que chama a rota
-- /api/parada-certa/lembretes. A rota lê os pendentes e marca os
-- enviados por estas funções, protegidas por um segredo guardado na
-- tabela parada_certa_config (chave 'cron_secret'), que deve ser
-- IGUAL à variável CRON_SECRET no Vercel.
-- ============================================================

-- 1) Colunas de controle ---------------------------------------
alter table public.agendamentos_parada_certa
  add column if not exists lembrete_24h_enviado boolean not null default false;
alter table public.agendamentos_parada_certa
  add column if not exists lembrete_1h_enviado boolean not null default false;

-- 2) Segredo do cron (⚠️ troque o valor; use o MESMO no Vercel) -
insert into public.parada_certa_config (chave, valor)
values ('cron_secret', 'TROQUE_POR_UM_SEGREDO_FORTE')
on conflict (chave) do nothing;

-- 3) Pendentes de lembrete (por tipo) --------------------------
-- O horário do atendimento = data + horario, no fuso de Natal (America/Recife).
create or replace function public.parada_certa_lembretes_pendentes(
  p_tipo text,
  p_secret text
)
returns table (id uuid, nome text, telefone text, horario text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_secret text;
begin
  select valor into v_secret from public.parada_certa_config where chave = 'cron_secret';
  if p_secret is null or p_secret <> v_secret then
    raise exception 'nao autorizado' using errcode = '28000';
  end if;

  if p_tipo = '24h' then
    return query
      select a.id, a.nome, a.telefone, a.horario
      from public.agendamentos_parada_certa a
      where a.status = 'confirmado'
        and a.lembrete_24h_enviado = false
        and now() >= ((a.data::text || ' ' || a.horario)::timestamp
                       at time zone 'America/Recife') - interval '24 hours'
        and now() <  ((a.data::text || ' ' || a.horario)::timestamp
                       at time zone 'America/Recife') - interval '2 hours'
        and a.created_at < ((a.data::text || ' ' || a.horario)::timestamp
                       at time zone 'America/Recife') - interval '24 hours';
  elsif p_tipo = '1h' then
    return query
      select a.id, a.nome, a.telefone, a.horario
      from public.agendamentos_parada_certa a
      where a.status = 'confirmado'
        and a.lembrete_1h_enviado = false
        and now() >= ((a.data::text || ' ' || a.horario)::timestamp
                       at time zone 'America/Recife') - interval '60 minutes'
        and now() <  ((a.data::text || ' ' || a.horario)::timestamp
                       at time zone 'America/Recife');
  end if;
end;
$$;

-- 4) Marcar lembrete como enviado ------------------------------
create or replace function public.parada_certa_marcar_lembrete(
  p_id uuid,
  p_tipo text,
  p_secret text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_secret text;
begin
  select valor into v_secret from public.parada_certa_config where chave = 'cron_secret';
  if p_secret is null or p_secret <> v_secret then
    raise exception 'nao autorizado' using errcode = '28000';
  end if;

  if p_tipo = '24h' then
    update public.agendamentos_parada_certa set lembrete_24h_enviado = true where id = p_id;
  elsif p_tipo = '1h' then
    update public.agendamentos_parada_certa set lembrete_1h_enviado = true where id = p_id;
  end if;
end;
$$;

grant execute on function public.parada_certa_lembretes_pendentes(text, text) to anon;
grant execute on function public.parada_certa_marcar_lembrete(uuid, text, text) to anon;
