-- ============================================================
-- Receba meu CarboZé — placa + vale-combustível
-- Rode no SQL Editor. Idempotente.
--   - Colunas placa e vale_combustivel na tabela teste_carboze
--   - Função para marcar/desmarcar o vale (protegida pela senha do admin)
--   - Atualiza teste_carboze_admin para devolver id, placa e vale
-- ============================================================

alter table public.teste_carboze add column if not exists placa text;
alter table public.teste_carboze
  add column if not exists vale_combustivel boolean not null default false;

-- Marcar/desmarcar vale-combustível (admin)
create or replace function public.teste_carboze_vale(p_id uuid, p_vale boolean, p_senha text)
returns json
language plpgsql security definer set search_path = public
as $$
declare v_ok boolean;
begin
  select (p_senha is not null and p_senha = valor) into v_ok
  from public.parada_certa_config where chave = 'admin_senha';
  if not coalesce(v_ok, false) then return json_build_object('ok', false); end if;
  update public.teste_carboze set vale_combustivel = p_vale where id = p_id;
  return json_build_object('ok', true);
end;
$$;

grant execute on function public.teste_carboze_vale(uuid, boolean, text) to anon;

-- Admin com id, placa e vale
create or replace function public.teste_carboze_admin(p_senha text)
returns json
language plpgsql security definer set search_path = public
as $$
declare v_ok boolean;
begin
  select (p_senha is not null and p_senha = valor) into v_ok
  from public.parada_certa_config where chave = 'admin_senha';
  if not coalesce(v_ok, false) then return json_build_object('ok', false); end if;

  return json_build_object('ok', true, 'cadastros', coalesce((
    select json_agg(row_to_json(t))
    from (
      select
        id, nome, telefone, modelo_moto, placa, instagram,
        autoriza_imagem, vale_combustivel,
        to_char(created_at at time zone 'America/Recife', 'DD/MM/YYYY HH24:MI') as criado_em
      from public.teste_carboze
      order by created_at desc
    ) t
  ), '[]'::json));
end;
$$;

grant execute on function public.teste_carboze_admin(text) to anon;
