-- ============================================================
-- Isolamento multi-empresa dos dados do CRM
-- Execute no SQL Editor do Supabase (dashboard → SQL Editor)
--
-- Contexto: a migration 001 criou contacts/conversations/messages/
-- channels/deals/notes/tags/custom_field_definitions/pipeline_stages
-- sem nenhum conceito de empresa, e com RLS "using (true)" liberando
-- qualquer usuário autenticado a ver os dados de qualquer empresa.
-- A 002 introduziu `companies`, mas essas tabelas continuaram globais.
-- Esta migration fecha essa lacuna.
--
-- ATENÇÃO — pré-requisito: esta migration assume que contacts,
-- conversations, messages, channels, deals, notes, tags e
-- custom_field_definitions ainda estão vazias (nenhuma empresa existia
-- antes da 002). Se o projeto já tiver dados reais nessas tabelas, os
-- ALTER TABLE abaixo vão falhar ao tentar preencher `company_id`
-- (NOT NULL sem valor resolvível fora de uma sessão autenticada) — o
-- que é o comportamento esperado: rode um backfill manual atribuindo
-- cada linha a uma empresa antes de aplicar esta migration.
-- ============================================================

-- ------------------------------------------------------------
-- current_company_id()
-- Empresa do usuário autenticado. security definer pra poder ser
-- usada em políticas de RLS sem causar recursão, e como DEFAULT das
-- novas colunas company_id (preenche automaticamente em inserts
-- feitos pelo próprio usuário, sem precisar mudar o código existente).
-- ------------------------------------------------------------
create or replace function public.current_company_id()
returns uuid
language sql stable security definer set search_path = public as $$
  select company_id from public.profiles where id = auth.uid()
$$;

-- ------------------------------------------------------------
-- pipeline_stages
-- Os 5 estágios seedados pela 001 eram globais (sem empresa). Cada
-- empresa passa a ter seu próprio funil, criado automaticamente no
-- cadastro (ver app/master/nova-empresa/actions.ts). Removemos aqui
-- apenas as linhas exatas seedadas pela 001 — se alguma delas tiver
-- deals vinculados, o delete falha (RESTRICT) e precisa de atenção
-- manual antes de prosseguir.
-- ------------------------------------------------------------
delete from public.pipeline_stages
where (name, "order") in (
  ('Novo Lead', 1), ('Qualificando', 2), ('Proposta', 3), ('Negociação', 4), ('Fechado', 5)
);

alter table public.pipeline_stages
  add column company_id uuid not null default public.current_company_id()
    references public.companies(id) on delete cascade;

alter table public.channels
  add column company_id uuid not null default public.current_company_id()
    references public.companies(id) on delete cascade;

alter table public.contacts
  add column company_id uuid not null default public.current_company_id()
    references public.companies(id) on delete cascade;

alter table public.conversations
  add column company_id uuid not null default public.current_company_id()
    references public.companies(id) on delete cascade;

alter table public.messages
  add column company_id uuid not null default public.current_company_id()
    references public.companies(id) on delete cascade;

alter table public.deals
  add column company_id uuid not null default public.current_company_id()
    references public.companies(id) on delete cascade;

alter table public.notes
  add column company_id uuid not null default public.current_company_id()
    references public.companies(id) on delete cascade;

alter table public.tags
  add column company_id uuid not null default public.current_company_id()
    references public.companies(id) on delete cascade;

alter table public.custom_field_definitions
  add column company_id uuid not null default public.current_company_id()
    references public.companies(id) on delete cascade;

create index on public.pipeline_stages (company_id);
create index on public.channels (company_id);
create index on public.contacts (company_id);
create index on public.conversations (company_id);
create index on public.messages (company_id);
create index on public.deals (company_id);
create index on public.notes (company_id);
create index on public.tags (company_id);
create index on public.custom_field_definitions (company_id);

-- Nome de tag deixa de ser único globalmente e passa a ser único por
-- empresa (duas empresas podem ter uma tag "VIP", por exemplo).
alter table public.tags drop constraint tags_name_key;
alter table public.tags add constraint tags_company_name_key unique (company_id, name);

-- ------------------------------------------------------------
-- RLS — substitui a política "Acesso total para autenticados" por
-- acesso restrito à própria empresa em cada tabela de dados do CRM.
-- (profiles NÃO é alterada aqui — mantém a política existente.)
-- ------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'channels', 'contacts', 'conversations', 'messages',
    'pipeline_stages', 'deals', 'notes', 'tags', 'contact_tags',
    'custom_field_definitions'
  ] loop
    execute format('drop policy if exists "Acesso total para autenticados" on public.%I', t);
  end loop;
end;
$$;

create policy "Empresa acessa seus canais" on public.channels
  for all to authenticated using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "Empresa acessa seus contatos" on public.contacts
  for all to authenticated using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "Empresa acessa suas conversas" on public.conversations
  for all to authenticated using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "Empresa acessa suas mensagens" on public.messages
  for all to authenticated using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "Empresa acessa seu funil" on public.pipeline_stages
  for all to authenticated using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "Empresa acessa seus negócios" on public.deals
  for all to authenticated using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "Empresa acessa suas notas" on public.notes
  for all to authenticated using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "Empresa acessa suas tags" on public.tags
  for all to authenticated using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "Empresa acessa seus campos personalizados" on public.custom_field_definitions
  for all to authenticated using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

-- contact_tags não tem company_id próprio — o acesso é derivado do
-- contato ao qual a tag está associada.
create policy "Empresa acessa seus contact_tags" on public.contact_tags
  for all to authenticated using (
    exists (select 1 from public.contacts c where c.id = contact_id and c.company_id = public.current_company_id())
  ) with check (
    exists (select 1 from public.contacts c where c.id = contact_id and c.company_id = public.current_company_id())
  );
