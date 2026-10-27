-- ============================================================
-- Receba meu CarboZé — vale-combustível com código único (anti-fraude)
-- Rode no SQL Editor. Idempotente.
--   - Pool de 40 códigos
--   - Colunas codigo / retirado / retirado_em em teste_carboze
--   - "Dar vale" (assina um código livre) e "retirar" (valida)
--   - admin devolve codigo/retirado
-- ============================================================

-- 1) Pool de 40 códigos
create table if not exists public.teste_carboze_codigos (
  codigo      text        primary key,
  usado       boolean     not null default false,
  cadastro_id uuid,
  criado_em   timestamptz not null default now()
);

insert into public.teste_carboze_codigos (codigo) values
  ('1DEC8A36'),('4AF6E009'),('E32F43A3'),('F407C0B1'),('569C369F'),
  ('5F105942'),('E7B69BC7'),('AF4BA86F'),('33F5879E'),('2AB5F5C0'),
  ('70725C2F'),('66D2EA2F'),('A86C567F'),('D1257824'),('685AD6B7'),
  ('10F70F1E'),('156C20E5'),('80B8809C'),('EE05530F'),('E9A866A7'),
  ('4DD09F86'),('DCE3A742'),('06B22E0E'),('CBD2755D'),('3E35173D'),
  ('D39D4EC5'),('B4D872D0'),('EEF734CF'),('F1DB138C'),('5BAC299E'),
  ('F1B9FD75'),('0513E99E'),('822521DD'),('A194545F'),('CB8639B1'),
  ('FEF125A1'),('8173DD9A'),('4580D095'),('9DE86DCF'),('76A7DC7B')
on conflict (codigo) do nothing;

-- 2) Colunas em teste_carboze
alter table public.teste_carboze add column if not exists codigo text;
alter table public.teste_carboze add column if not exists retirado boolean not null default false;
alter table public.teste_carboze add column if not exists retirado_em timestamptz;

-- 3) Dar / tirar o vale (assina um código livre do pool)
create or replace function public.teste_carboze_vale(p_id uuid, p_vale boolean, p_senha text)
returns json
language plpgsql security definer set search_path = public
as $$
declare
  v_ok boolean;
  v_cod text;
  v_nome text;
  v_tel text;
begin
  select (p_senha is not null and p_senha = valor) into v_ok
  from public.parada_certa_config where chave = 'admin_senha';
  if not coalesce(v_ok, false) then return json_build_object('ok', false, 'erro', 'senha'); end if;

  if p_vale then
    select codigo into v_cod from public.teste_carboze where id = p_id;
    if v_cod is null then
      -- pega um código livre do pool
      select codigo into v_cod
      from public.teste_carboze_codigos
      where usado = false
      order by codigo
      limit 1
      for update skip locked;
      if v_cod is null then
        return json_build_object('ok', false, 'erro', 'sem_codigos');
      end if;
      update public.teste_carboze_codigos set usado = true, cadastro_id = p_id where codigo = v_cod;
    end if;
    update public.teste_carboze set vale_combustivel = true, codigo = v_cod where id = p_id;
    select nome, telefone into v_nome, v_tel from public.teste_carboze where id = p_id;
    return json_build_object('ok', true, 'codigo', v_cod, 'nome', v_nome, 'telefone', v_tel);
  else
    select codigo into v_cod from public.teste_carboze where id = p_id;
    if v_cod is not null then
      update public.teste_carboze_codigos set usado = false, cadastro_id = null where codigo = v_cod;
    end if;
    update public.teste_carboze
    set vale_combustivel = false, codigo = null, retirado = false, retirado_em = null
    where id = p_id;
    return json_build_object('ok', true);
  end if;
end;
$$;

grant execute on function public.teste_carboze_vale(uuid, boolean, text) to anon;

-- 4) Marcar/desmarcar retirada (validação no posto)
create or replace function public.teste_carboze_marcar_retirado(p_id uuid, p_retirado boolean, p_senha text)
returns json
language plpgsql security definer set search_path = public
as $$
declare v_ok boolean;
begin
  select (p_senha is not null and p_senha = valor) into v_ok
  from public.parada_certa_config where chave = 'admin_senha';
  if not coalesce(v_ok, false) then return json_build_object('ok', false); end if;
  update public.teste_carboze
  set retirado = p_retirado, retirado_em = case when p_retirado then now() else null end
  where id = p_id;
  return json_build_object('ok', true);
end;
$$;

grant execute on function public.teste_carboze_marcar_retirado(uuid, boolean, text) to anon;

-- 5) Admin com codigo / retirado
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
        autoriza_imagem, vale_combustivel, codigo, retirado,
        to_char(retirado_em at time zone 'America/Recife', 'DD/MM/YYYY HH24:MI') as retirado_em,
        to_char(created_at at time zone 'America/Recife', 'DD/MM/YYYY HH24:MI') as criado_em
      from public.teste_carboze
      order by created_at desc
    ) t
  ), '[]'::json));
end;
$$;

grant execute on function public.teste_carboze_admin(text) to anon;
