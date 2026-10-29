-- ============================================================
-- Roleta digital — Ação Parada Certa (/recebermeucarboze/roleta)
-- Rode no SQL Editor. Idempotente.
--
-- Integra com teste_carboze (cadastros) e teste_carboze_codigos
-- (pool dos 40 vouchers). Protegido pela senha do admin.
-- O sorteio em si (cálculo das chances) é feito no servidor do site;
-- aqui ficam: estado dos prêmios, registro atômico do giro e o painel.
-- ============================================================

-- 1) Prêmios ---------------------------------------------------
create table if not exists public.roleta_premios (
  slug            text    primary key,
  nome            text    not null,
  tipo            text    not null,                 -- premio | vale | tente | nada
  estoque_inicial integer,                          -- null para tente/nada
  estoque         integer,                          -- atual (editável)
  chance_base     numeric not null default 0,       -- % no 1º giro
  ordem           integer not null default 0,
  ativo           boolean not null default true
);

insert into public.roleta_premios (slug, nome, tipo, estoque_inicial, estoque, chance_base, ordem) values
  ('bag',        'Bag para motoqueiro',                         'premio',  2,  2,  0.4, 1),
  ('guardasol',  'Guarda-sol de capacete com suporte de celular','premio', 6,  6,  1.1, 2),
  ('bone',       'Boné CarboVapt',                              'premio',  20, 20, 3.6, 3),
  ('vale',       'Vale-combustível 5 L',                        'vale',    40, 40, 7.3, 4),
  ('carboze100', 'CarboZé 100 ml',                              'premio',  50, 50, 9.1, 5),
  ('sache',      'Sachê extra de CarboZé (10 ml)',              'premio',  50, 50, 9.1, 6),
  ('tente',      'Tente outra vez',                             'tente',   null, null, 10,  7),
  ('nada',       'Não foi dessa vez',                           'nada',    null, null, 0,   8)
on conflict (slug) do nothing;

-- 2) Histórico de giros ---------------------------------------
create table if not exists public.roleta_giros (
  id           uuid        primary key default gen_random_uuid(),
  cadastro_id  uuid        not null,
  nome         text        not null,
  telefone     text        not null,
  premio_slug  text        not null,
  premio_nome  text        not null,
  premio_tipo  text        not null,
  giro_extra   boolean     not null default false,
  codigo       text,                                 -- código do voucher, quando vale
  created_at   timestamptz not null default now()
);
create index if not exists idx_roleta_giros_cadastro on public.roleta_giros (cadastro_id);
create index if not exists idx_roleta_giros_criado on public.roleta_giros (created_at);

alter table public.roleta_premios enable row level security;
alter table public.roleta_giros   enable row level security;
-- (sem policies -> acesso só pelas funções security definer)

-- 3) Config extra (flag para ignorar horário em testes) -------
insert into public.parada_certa_config (chave, valor)
values ('roleta_ignorar_horario', 'false')
on conflict (chave) do nothing;

-- Modo de fluxo da roleta: baixo | normal | alto (a equipe escolhe no painel)
insert into public.parada_certa_config (chave, valor)
values ('roleta_modo', 'normal')
on conflict (chave) do nothing;

-- Helper interno: confere a senha do admin
create or replace function public.roleta_auth(p_senha text)
returns boolean language sql security definer set search_path = public as $$
  select coalesce((select p_senha is not null and p_senha = valor
                   from public.parada_certa_config where chave = 'admin_senha'), false);
$$;

-- 4) Buscar cadastro por nome/telefone (autocomplete) ---------
create or replace function public.roleta_buscar(p_termo text, p_senha text)
returns json language plpgsql security definer set search_path = public as $$
declare v_dig text := regexp_replace(coalesce(p_termo,''), '\D', '', 'g');
begin
  if not roleta_auth(p_senha) then return json_build_object('ok', false); end if;
  if length(btrim(coalesce(p_termo,''))) < 2 then
    return json_build_object('ok', true, 'resultados', '[]'::json);
  end if;
  return json_build_object('ok', true, 'resultados', coalesce((
    select json_agg(row_to_json(t))
    from (
      select c.id, c.nome, c.telefone,
             (g.id is not null) as ja_girou,
             g.premio_nome as resultado
      from public.teste_carboze c
      left join lateral (
        select id, premio_nome from public.roleta_giros
        where cadastro_id = c.id and premio_slug <> 'tente'
        order by created_at desc limit 1
      ) g on true
      where (v_dig <> '' and c.telefone like '%' || v_dig || '%')
         or (c.nome ilike '%' || btrim(p_termo) || '%')
      order by c.created_at desc
      limit 8
    ) t
  ), '[]'::json));
end; $$;
grant execute on function public.roleta_buscar(text, text) to anon;

-- 5) Estado para o sorteio (prêmios + horário + elegibilidade) -
create or replace function public.roleta_preparar(p_cadastro_id uuid, p_senha text)
returns json language plpgsql security definer set search_path = public as $$
declare
  v_local timestamp := now() at time zone 'America/Recife';
  v_hora numeric := extract(hour from v_local) + extract(minute from v_local) / 60.0;
  v_ignora boolean := coalesce((select valor = 'true' from public.parada_certa_config where chave = 'roleta_ignorar_horario'), false);
  v_giros int;
  v_ultimo text;
  v_extra boolean := false;
  v_nome text;
begin
  if not roleta_auth(p_senha) then return json_build_object('ok', false, 'erro', 'senha'); end if;

  select nome into v_nome from public.teste_carboze where id = p_cadastro_id;
  if v_nome is null then return json_build_object('ok', false, 'erro', 'nao_encontrado'); end if;

  select count(*) into v_giros from public.roleta_giros where cadastro_id = p_cadastro_id;
  if v_giros = 1 then
    select premio_slug into v_ultimo from public.roleta_giros where cadastro_id = p_cadastro_id;
    if v_ultimo = 'tente' then v_extra := true;
    else return json_build_object('ok', false, 'erro', 'ja_girou'); end if;
  elsif v_giros >= 2 then
    return json_build_object('ok', false, 'erro', 'ja_girou');
  end if;

  if not v_ignora and (v_hora < 9 or v_hora >= 14) then
    return json_build_object('ok', false, 'erro', 'fora_horario');
  end if;

  return json_build_object(
    'ok', true,
    'extra', v_extra,
    'hora', round(v_hora::numeric, 3),
    'modo', coalesce((select valor from public.parada_certa_config where chave = 'roleta_modo'), 'normal'),
    'bag_ganhos', (select count(*) from public.roleta_giros where premio_slug = 'bag'),
    'premios', coalesce((
      select json_agg(row_to_json(p) order by p.ordem)
      from (
        select slug, nome, tipo, estoque, estoque_inicial, chance_base, ordem
        from public.roleta_premios where ativo
      ) p
    ), '[]'::json)
  );
end; $$;
grant execute on function public.roleta_preparar(uuid, text) to anon;

-- 6) Registrar o giro (atômico): valida, grava, baixa estoque,
--    e se for vale assina um código do pool. Retorna o código.
create or replace function public.roleta_registrar(
  p_cadastro_id uuid, p_slug text, p_extra boolean, p_senha text
)
returns json language plpgsql security definer set search_path = public as $$
declare
  v_giros int;
  v_ultimo text;
  v_prem record;
  v_nome text;
  v_tel text;
  v_cod text := null;
begin
  if not roleta_auth(p_senha) then return json_build_object('ok', false, 'erro', 'senha'); end if;

  select nome, telefone into v_nome, v_tel from public.teste_carboze where id = p_cadastro_id for update;
  if v_nome is null then return json_build_object('ok', false, 'erro', 'nao_encontrado'); end if;

  -- revalida elegibilidade
  select count(*) into v_giros from public.roleta_giros where cadastro_id = p_cadastro_id;
  select premio_slug into v_ultimo from public.roleta_giros where cadastro_id = p_cadastro_id order by created_at desc limit 1;
  if v_giros >= 2 or (v_giros = 1 and v_ultimo <> 'tente') then
    return json_build_object('ok', false, 'erro', 'ja_girou');
  end if;

  select * into v_prem from public.roleta_premios where slug = p_slug and ativo for update;
  if v_prem.slug is null then return json_build_object('ok', false, 'erro', 'premio_invalido'); end if;

  -- prêmios reais: precisa de estoque
  if v_prem.tipo in ('premio', 'vale') then
    if coalesce(v_prem.estoque, 0) <= 0 then
      return json_build_object('ok', false, 'erro', 'sem_estoque');
    end if;

    if v_prem.tipo = 'vale' then
      -- assina um código livre do pool
      select codigo into v_cod from public.teste_carboze_codigos
        where usado = false order by codigo limit 1 for update skip locked;
      if v_cod is null then return json_build_object('ok', false, 'erro', 'sem_codigos'); end if;
      update public.teste_carboze_codigos set usado = true, cadastro_id = p_cadastro_id where codigo = v_cod;
      update public.teste_carboze set vale_combustivel = true, codigo = v_cod where id = p_cadastro_id;
    end if;

    update public.roleta_premios set estoque = estoque - 1 where slug = p_slug;
  end if;

  insert into public.roleta_giros (cadastro_id, nome, telefone, premio_slug, premio_nome, premio_tipo, giro_extra, codigo)
  values (p_cadastro_id, v_nome, v_tel, v_prem.slug, v_prem.nome, v_prem.tipo, coalesce(p_extra, false), v_cod);

  return json_build_object(
    'ok', true, 'tipo', v_prem.tipo, 'premio', v_prem.nome,
    'codigo', v_cod, 'nome', v_nome, 'telefone', v_tel
  );
end; $$;
grant execute on function public.roleta_registrar(uuid, text, boolean, text) to anon;

-- 7) Painel da equipe: prêmios (com saídas total/hora) + giros --
create or replace function public.roleta_painel(p_senha text)
returns json language plpgsql security definer set search_path = public as $$
declare v_hini timestamptz := date_trunc('hour', now());
begin
  if not roleta_auth(p_senha) then return json_build_object('ok', false); end if;
  return json_build_object(
    'ok', true,
    'modo', coalesce((select valor from public.parada_certa_config where chave = 'roleta_modo'), 'normal'),
    'premios', coalesce((
      select json_agg(row_to_json(p) order by p.ordem)
      from (
        select pr.slug, pr.nome, pr.tipo, pr.estoque, pr.estoque_inicial, pr.chance_base, pr.ordem,
          (select count(*) from public.roleta_giros g where g.premio_slug = pr.slug) as saidos_total,
          (select count(*) from public.roleta_giros g where g.premio_slug = pr.slug and g.created_at >= v_hini) as saidos_hora
        from public.roleta_premios pr where pr.ativo
      ) p
    ), '[]'::json),
    'total_giros', (select count(*) from public.roleta_giros),
    'giros', coalesce((
      select json_agg(row_to_json(t))
      from (
        select nome, telefone, premio_nome, premio_tipo, giro_extra, codigo,
               to_char(created_at at time zone 'America/Recife', 'DD/MM HH24:MI') as hora
        from public.roleta_giros order by created_at desc limit 200
      ) t
    ), '[]'::json)
  );
end; $$;
grant execute on function public.roleta_painel(text) to anon;

-- 8) Editar estoque de um prêmio ------------------------------
create or replace function public.roleta_set_estoque(p_slug text, p_estoque int, p_senha text)
returns json language plpgsql security definer set search_path = public as $$
begin
  if not roleta_auth(p_senha) then return json_build_object('ok', false); end if;
  update public.roleta_premios set estoque = greatest(0, p_estoque) where slug = p_slug;
  return json_build_object('ok', true);
end; $$;
grant execute on function public.roleta_set_estoque(text, int, text) to anon;

-- 9) Zerar tudo (antes do evento / teste) ---------------------
create or replace function public.roleta_reset(p_senha text)
returns json language plpgsql security definer set search_path = public as $$
begin
  if not roleta_auth(p_senha) then return json_build_object('ok', false); end if;
  delete from public.roleta_giros;
  update public.roleta_premios set estoque = estoque_inicial;
  -- libera os códigos de vale e limpa vínculo dos cadastros
  update public.teste_carboze_codigos set usado = false, cadastro_id = null;
  update public.teste_carboze set vale_combustivel = false, codigo = null, retirado = false, retirado_em = null;
  return json_build_object('ok', true);
end; $$;
grant execute on function public.roleta_reset(text) to anon;

-- 10) Admin dos cadastros: incluir o resultado da roleta -------
-- (redefine teste_carboze_admin somando o giro mais recente — prioriza o
--  prêmio "de verdade" sobre um "tente outra vez" ainda sem giro extra)
create or replace function public.teste_carboze_admin(p_senha text)
returns json language plpgsql security definer set search_path = public as $$
declare v_ok boolean;
begin
  select (p_senha is not null and p_senha = valor) into v_ok
  from public.parada_certa_config where chave = 'admin_senha';
  if not coalesce(v_ok, false) then return json_build_object('ok', false); end if;

  return json_build_object('ok', true, 'cadastros', coalesce((
    select json_agg(row_to_json(t))
    from (
      select
        c.id, c.nome, c.telefone, c.modelo_moto, c.placa, c.instagram,
        c.autoriza_imagem, c.vale_combustivel, c.codigo, c.retirado,
        to_char(c.retirado_em  at time zone 'America/Recife', 'DD/MM/YYYY HH24:MI') as retirado_em,
        to_char(c.created_at   at time zone 'America/Recife', 'DD/MM/YYYY HH24:MI') as criado_em,
        (g.premio_nome is not null)        as roleta_girou,
        g.premio_nome                      as roleta_premio,
        g.premio_tipo                      as roleta_tipo
      from public.teste_carboze c
      left join lateral (
        select premio_nome, premio_tipo
        from public.roleta_giros
        where cadastro_id = c.id
        order by (premio_slug <> 'tente') desc, created_at desc
        limit 1
      ) g on true
      order by c.created_at desc
    ) t
  ), '[]'::json));
end;
$$;
grant execute on function public.teste_carboze_admin(text) to anon;

-- 11) Trocar o modo de fluxo da roleta (baixo | normal | alto) ----
create or replace function public.roleta_set_modo(p_modo text, p_senha text)
returns json language plpgsql security definer set search_path = public as $$
begin
  if not roleta_auth(p_senha) then return json_build_object('ok', false); end if;
  if p_modo not in ('baixo', 'normal', 'alto') then
    return json_build_object('ok', false, 'erro', 'modo_invalido');
  end if;
  update public.parada_certa_config set valor = p_modo where chave = 'roleta_modo';
  if not found then
    insert into public.parada_certa_config (chave, valor) values ('roleta_modo', p_modo);
  end if;
  return json_build_object('ok', true, 'modo', p_modo);
end; $$;
grant execute on function public.roleta_set_modo(text, text) to anon;
