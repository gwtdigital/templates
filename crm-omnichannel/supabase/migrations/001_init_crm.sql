-- ============================================================
-- CRM Omnichannel — Migration inicial
-- Execute no SQL Editor do Supabase (dashboard → SQL Editor)
-- ============================================================

-- Extensões necessárias
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- profiles
-- Espelho da tabela auth.users com dados extras do usuário
-- ------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  avatar_url  text,
  role        text default 'agent',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Cria o perfil automaticamente quando um usuário se cadastra
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------
-- channels
-- Canais de comunicação configurados (WhatsApp, Instagram, etc.)
-- ------------------------------------------------------------
create table public.channels (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  type        text not null check (type in ('whatsapp', 'instagram', 'email', 'website')),
  config      jsonb not null default '{}',
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- contacts
-- Pessoas que interagem com o CRM
-- ------------------------------------------------------------
create table public.contacts (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  email       text,
  phone       text,
  avatar_url  text,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- conversations
-- Cada thread de atendimento (1 contato × 1 canal)
-- ------------------------------------------------------------
create table public.conversations (
  id               uuid primary key default uuid_generate_v4(),
  contact_id       uuid not null references public.contacts(id) on delete cascade,
  channel_id       uuid not null references public.channels(id) on delete restrict,
  status           text not null default 'open' check (status in ('open', 'pending', 'resolved')),
  last_message_at  timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index on public.conversations (last_message_at desc);
create index on public.conversations (contact_id);
create index on public.conversations (channel_id);

-- ------------------------------------------------------------
-- messages
-- Mensagens trocadas dentro de uma conversa
-- ------------------------------------------------------------
create table public.messages (
  id               uuid primary key default uuid_generate_v4(),
  conversation_id  uuid not null references public.conversations(id) on delete cascade,
  content          text not null,
  direction        text not null check (direction in ('inbound', 'outbound')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index on public.messages (conversation_id, created_at);

-- Atualiza last_message_at na conversa a cada nova mensagem
create or replace function public.update_conversation_last_message()
returns trigger language plpgsql as $$
begin
  update public.conversations
  set last_message_at = new.created_at,
      updated_at      = now()
  where id = new.conversation_id;
  return new;
end;
$$;

create trigger on_message_inserted
  after insert on public.messages
  for each row execute procedure public.update_conversation_last_message();

-- ------------------------------------------------------------
-- pipeline_stages
-- Etapas do funil de vendas
-- ------------------------------------------------------------
create table public.pipeline_stages (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  "order"     integer not null default 0,
  color       text,
  created_at  timestamptz not null default now()
);

-- Etapas padrão
insert into public.pipeline_stages (name, "order", color) values
  ('Novo Lead',      1, '#3b82f6'),
  ('Qualificando',   2, '#8b5cf6'),
  ('Proposta',       3, '#f59e0b'),
  ('Negociação',     4, '#f97316'),
  ('Fechado',        5, '#22c55e');

-- ------------------------------------------------------------
-- deals
-- Negócios/oportunidades no pipeline
-- ------------------------------------------------------------
create table public.deals (
  id          uuid primary key default uuid_generate_v4(),
  contact_id  uuid not null references public.contacts(id) on delete cascade,
  stage_id    uuid not null references public.pipeline_stages(id) on delete restrict,
  title       text not null,
  value       numeric(12, 2),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index on public.deals (stage_id);
create index on public.deals (contact_id);

-- ------------------------------------------------------------
-- notes
-- Anotações internas sobre contatos ou conversas
-- ------------------------------------------------------------
create table public.notes (
  id               uuid primary key default uuid_generate_v4(),
  contact_id       uuid references public.contacts(id) on delete cascade,
  conversation_id  uuid references public.conversations(id) on delete cascade,
  content          text not null,
  created_at       timestamptz not null default now()
);

-- ------------------------------------------------------------
-- tags  +  contact_tags
-- ------------------------------------------------------------
create table public.tags (
  id     uuid primary key default uuid_generate_v4(),
  name   text not null unique,
  color  text
);

create table public.contact_tags (
  contact_id  uuid not null references public.contacts(id) on delete cascade,
  tag_id      uuid not null references public.tags(id) on delete cascade,
  primary key (contact_id, tag_id)
);

-- ------------------------------------------------------------
-- custom_field_definitions
-- Campos personalizados por tipo de entidade
-- ------------------------------------------------------------
create table public.custom_field_definitions (
  id           uuid primary key default uuid_generate_v4(),
  entity_type  text not null check (entity_type in ('contact', 'deal', 'conversation')),
  field_name   text not null,
  field_type   text not null check (field_type in ('text', 'number', 'boolean', 'date', 'select')),
  required     boolean not null default false,
  created_at   timestamptz not null default now()
);

-- ------------------------------------------------------------
-- RLS — Row Level Security
-- Usuários autenticados têm acesso total a todas as tabelas
-- ------------------------------------------------------------
alter table public.profiles               enable row level security;
alter table public.channels               enable row level security;
alter table public.contacts               enable row level security;
alter table public.conversations          enable row level security;
alter table public.messages               enable row level security;
alter table public.pipeline_stages        enable row level security;
alter table public.deals                  enable row level security;
alter table public.notes                  enable row level security;
alter table public.tags                   enable row level security;
alter table public.contact_tags           enable row level security;
alter table public.custom_field_definitions enable row level security;

-- Política genérica: acesso total para usuários autenticados
do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles', 'channels', 'contacts', 'conversations', 'messages',
    'pipeline_stages', 'deals', 'notes', 'tags', 'contact_tags',
    'custom_field_definitions'
  ] loop
    execute format(
      'create policy "Acesso total para autenticados" on public.%I
       for all to authenticated using (true) with check (true)',
      t
    );
  end loop;
end;
$$;
