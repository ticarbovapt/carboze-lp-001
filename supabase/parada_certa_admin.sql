-- ============================================================
-- Ação Parada Certa — painel administrativo (Supabase)
-- Projeto: grupocarbo (wpkfirmapxevzpxjovjr)
--
-- Rode DEPOIS do parada_certa.sql. Idempotente.
--
-- Segurança: a lista de agendamentos (com dados pessoais) só é
-- devolvida por uma função protegida por senha, verificada no
-- servidor. A chave anon sozinha não lê a tabela (RLS).
-- ⚠️ Troque a senha padrão abaixo por uma senha forte.
-- ============================================================

-- 1) Tabela de configuração (guarda a senha do painel) ---------
create table if not exists public.parada_certa_config (
  chave text primary key,
  valor text not null
);

alter table public.parada_certa_config enable row level security;
-- (sem policy -> anon não lê a senha direto)

insert into public.parada_certa_config (chave, valor)
values ('admin_senha', 'TROQUE_ESTA_SENHA')
on conflict (chave) do nothing;

-- 2) Função do painel: devolve os agendamentos se a senha confere
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
  from public.parada_certa_config
  where chave = 'admin_senha';

  if not coalesce(v_ok, false) then
    return json_build_object('ok', false);
  end if;

  return json_build_object(
    'ok', true,
    'agendamentos', coalesce((
      select json_agg(row_to_json(t))
      from (
        select
          nome,
          telefone,
          veiculo,
          ano,
          km,
          to_char(data, 'YYYY-MM-DD')                                    as data,
          horario,
          to_char(created_at at time zone 'America/Recife',
                  'DD/MM/YYYY HH24:MI')                                  as criado_em
        from public.agendamentos_parada_certa
        where status = 'confirmado'
        order by data, horario, created_at
      ) t
    ), '[]'::json)
  );
end;
$$;

grant execute on function public.parada_certa_admin(text) to anon;

-- 3) Para trocar a senha depois:
--    update public.parada_certa_config set valor = 'SUA_SENHA_FORTE'
--    where chave = 'admin_senha';
