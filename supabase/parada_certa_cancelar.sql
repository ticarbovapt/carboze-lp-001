-- ============================================================
-- Ação Parada Certa — cancelar agendamento (libera a vaga)
-- Rode no SQL Editor. Idempotente.
--   - Função de cancelamento (protegida pela senha do admin)
--   - Atualiza parada_certa_admin para devolver também o id
-- ============================================================

-- 1) Cancelar: muda o status para 'cancelado'. Como a disponibilidade e
--    a capacidade só contam status='confirmado', a vaga volta a ficar livre.
create or replace function public.parada_certa_cancelar(p_id uuid, p_senha text)
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

  update public.agendamentos_parada_certa
  set status = 'cancelado'
  where id = p_id;

  return json_build_object('ok', true);
end;
$$;

grant execute on function public.parada_certa_cancelar(uuid, text) to anon;

-- 2) Admin agora devolve o id (necessário para cancelar)
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
        id, nome, telefone, veiculo, ano, km,
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
