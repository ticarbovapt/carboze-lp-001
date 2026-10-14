-- ============================================================
-- Painel admin dos cadastros "Teste o CarboZé" (/recebermeucarboze/admin)
-- Projeto: grupocarbo (wpkfirmapxevzpxjovjr)
-- Rode DEPOIS do teste_carboze.sql. Idempotente.
--
-- Reutiliza a senha de admin já existente (parada_certa_config.admin_senha).
-- A tabela teste_carboze tem RLS (anon não lê); esta função devolve os
-- cadastros apenas com a senha correta.
-- ============================================================

create or replace function public.teste_carboze_admin(p_senha text)
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

  return json_build_object('ok', true, 'cadastros', coalesce((
    select json_agg(row_to_json(t))
    from (
      select
        nome, telefone, modelo_moto, instagram, autoriza_imagem,
        to_char(created_at at time zone 'America/Recife', 'DD/MM/YYYY HH24:MI') as criado_em
      from public.teste_carboze
      order by created_at desc
    ) t
  ), '[]'::json));
end;
$$;

grant execute on function public.teste_carboze_admin(text) to anon;
