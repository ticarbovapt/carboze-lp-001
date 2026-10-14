-- ============================================================
-- Cadastro "Teste o CarboZé" (/quero-testar)
-- Projeto: grupocarbo (wpkfirmapxevzpxjovjr)
-- Rode no SQL Editor. Idempotente.
--
-- Segurança: a página pública só pode INSERIR (não lê a tabela).
-- A leitura dos cadastros é feita pelo painel do Supabase / service_role.
-- ============================================================

create table if not exists public.teste_carboze (
  id               uuid        primary key default gen_random_uuid(),
  nome             text        not null,
  telefone         text        not null,     -- dígitos com DDI: 5584999998888
  modelo_moto      text        not null,
  instagram        text,
  autoriza_imagem  boolean     not null default false,
  created_at       timestamptz not null default now()
);

alter table public.teste_carboze enable row level security;

-- anon pode inserir (cadastro público), mas não pode ler
drop policy if exists "anon insere teste_carboze" on public.teste_carboze;
create policy "anon insere teste_carboze"
  on public.teste_carboze
  for insert
  to anon
  with check (true);

grant insert on table public.teste_carboze to anon;
