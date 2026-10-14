-- ============================================================
-- Ação Parada Certa — status de disparos no painel admin
-- Rode DEPOIS dos outros scripts. Idempotente.
--   - Função para marcar a confirmação como enviada
--   - Atualiza parada_certa_admin para devolver os 3 flags
-- ============================================================

-- 1) Marcar confirmação enviada (chamada pela rota de agendamento)
create or replace function public.parada_certa_marcar_confirmacao(
  p_telefone text,
  p_data date,
  p_horario text,
  p_secret text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_secret text;
  v_tel text := regexp_replace(coalesce(p_telefone, ''), '\D', '', 'g');
begin
  select valor into v_secret from public.parada_certa_config where chave = 'cron_secret';
  if p_secret is null or p_secret <> v_secret then
    raise exception 'nao autorizado' using errcode = '28000';
  end if;

  update public.agendamentos_parada_certa
  set confirmacao_enviada = true
  where telefone = v_tel and data = p_data and horario = p_horario;
end;
$$;

grant execute on function public.parada_certa_marcar_confirmacao(text, date, text, text) to anon;

-- 2) Painel admin com os flags de disparo
create or replace function public.parada_certa_admin(p_senha text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ok boolean;
begin
  select (p_senha is not null and p_senha = valor) into v_ok
  from public.parada_certa_config where chave = 'admin_senha';
  if not coalesce(v_ok, false) then
    return json_build_object('ok', false);
  end if;

  return json_build_object('ok', true, 'agendamentos', coalesce((
    select json_agg(row_to_json(t))
    from (
      select
        nome, telefone, veiculo, ano, km,
        to_char(data, 'YYYY-MM-DD') as data, horario,
        confirmacao_enviada, lembrete_24h_enviado, lembrete_1h_enviado,
        to_char(created_at at time zone 'America/Recife', 'DD/MM/YYYY HH24:MI') as criado_em
      from public.agendamentos_parada_certa
      where status = 'confirmado'
      order by data, horario, created_at
    ) t
  ), '[]'::json));
end;
$$;

grant execute on function public.parada_certa_admin(text) to anon;
