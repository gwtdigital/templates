-- ============================================================
-- SalesPro — Planos, empresas (multi-empresa) e assinaturas/trial
-- Execute no SQL Editor do Supabase (dashboard → SQL Editor)
-- ============================================================

-- ------------------------------------------------------------
-- companies (empresa)
-- Cada empresa cliente da plataforma. O onboarding e a
-- assinatura/trial giram em torno dela.
-- ------------------------------------------------------------
create table public.companies (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  owner_id    uuid not null references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index on public.companies (owner_id);

-- Vincula cada perfil a uma empresa e controla o onboarding.
-- (colunas aditivas — não altera o que já existia em profiles)
alter table public.profiles
  add column company_id uuid references public.companies(id) on delete set null,
  add column onboarding_completed_at timestamptz;

create index on public.profiles (company_id);

-- ------------------------------------------------------------
-- plan
-- Planos comerciais exibidos na landing e usados no cadastro
-- de empresas (Master → Nova empresa).
-- ------------------------------------------------------------
create table public.plan (
  id                uuid primary key default uuid_generate_v4(),
  slug              text not null unique,
  nome              text not null,
  descricao         text,
  preco_cents       integer not null,
  moeda             text not null default 'BRL',
  intervalo         text not null default 'month',
  trial_days        integer not null default 3,
  limite_mensagens  integer,
  limite_instancias integer,
  limite_usuarios   integer,
  limite_contatos   integer,
  features          text[] not null default '{}',
  destaque          boolean not null default false,
  ativo             boolean not null default true,
  ordem             integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

insert into public.plan
  (slug, nome, descricao, preco_cents, moeda, intervalo, trial_days,
   limite_instancias, limite_usuarios, limite_mensagens, limite_contatos,
   features, destaque, ativo, ordem)
values
  ('starter', 'Starter', 'Pra autônomo testando a operação.', 9700, 'BRL', 'month', 3,
   1, 1, 1500, 1000,
   array['1 número de WhatsApp', '1 usuário', '1.500 conversas/mês', '1.000 contatos', 'CRM Kanban + IA Gemini', 'Suporte por email'],
   false, true, 1),
  ('pro', 'Pro', 'Pra time que já vende todo dia. O mais escolhido.', 19700, 'BRL', 'month', 3,
   1, 5, 6000, 5000,
   array['1 número de WhatsApp', '5 usuários no painel', '6.000 conversas/mês', '5.000 contatos', 'IA Gemini + GPT + Claude', 'Google Agenda + Relatórios', 'Suporte prioritário'],
   true, true, 2),
  ('business', 'Business', 'Pra operação alta performance e múltiplas equipes.', 49700, 'BRL', 'month', 3,
   1, 20, 30000, 25000,
   array['1 número de WhatsApp', '20 usuários no painel', '30.000 conversas/mês', '25.000 contatos', 'API + Webhooks', 'Onboarding 1:1 + Gerente dedicado', 'SLA 99,9% + Suporte 24/7'],
   false, true, 3)
on conflict (slug) do nothing;

-- ------------------------------------------------------------
-- subscriptions
-- Assinatura/trial de cada empresa. O trial é controlado pela
-- aplicação (não pelo gateway de pagamento externo): é criado
-- automaticamente junto com a empresa, com trial_ends_at =
-- created_at + plan.trial_days.
-- ------------------------------------------------------------
create table public.subscriptions (
  id                    uuid primary key default uuid_generate_v4(),
  company_id            uuid not null references public.companies(id) on delete cascade,
  plan_id               uuid not null references public.plan(id) on delete restrict,
  status                text not null default 'trialing' check (status in ('trialing', 'active', 'past_due', 'canceled')),
  trial_ends_at         timestamptz not null,
  current_period_end    timestamptz,
  checkout_url          text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create unique index on public.subscriptions (company_id);
create index on public.subscriptions (plan_id);

-- ------------------------------------------------------------
-- RLS
-- ------------------------------------------------------------
alter table public.companies     enable row level security;
alter table public.plan          enable row level security;
alter table public.subscriptions enable row level security;

-- plan: leitura pública (preços aparecem na landing para visitantes
-- não autenticados) — sem insert/update/delete via RLS, apenas via
-- service role (painel Master).
create policy "Planos são públicos para leitura" on public.plan
  for select to anon, authenticated using (true);

-- companies: cada usuário só enxerga/edita a própria empresa.
create policy "Dono ou membro vê a própria empresa" on public.companies
  for select to authenticated using (
    owner_id = auth.uid()
    or id in (select company_id from public.profiles where id = auth.uid())
  );

create policy "Dono edita a própria empresa" on public.companies
  for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- subscriptions: leitura restrita aos membros da empresa (para o
-- banner de trial). Escrita apenas via service role (Master / lógica
-- de billing), nunca diretamente pelo usuário final.
create policy "Membros veem a assinatura da própria empresa" on public.subscriptions
  for select to authenticated using (
    company_id in (select company_id from public.profiles where id = auth.uid())
  );

-- ------------------------------------------------------------
-- Para promover o primeiro usuário Master (acesso a /master),
-- rode manualmente (não é aplicado automaticamente por esta
-- migration):
--
--   update public.profiles set role = 'master' where id = '<uuid-do-usuario>';
-- ------------------------------------------------------------
