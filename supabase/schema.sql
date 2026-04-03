create extension if not exists pgcrypto;

create table if not exists content_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  dedupe_key text not null unique,
  external_id text not null,
  title text not null,
  summary text not null,
  summary_zh text not null,
  category text not null check (category in ('paper', 'project', 'dataset', 'code', 'conference', 'lab')),
  source_type text not null check (source_type in ('arxiv', 'huggingface', 'github', 'lab', 'conference', 'other')),
  merged_source_types text[] not null default '{}',
  primary_url text not null,
  source_links jsonb not null default '[]'::jsonb,
  authors jsonb not null default '[]'::jsonb,
  keywords text[] not null default '{}',
  tags text[] not null default '{}',
  relevance_score numeric(4,3) not null default 0,
  trust_score numeric(4,3) not null default 0,
  published_at timestamptz not null,
  raw jsonb not null default '{}'::jsonb,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_content_items_published_at on content_items (published_at desc);
create index if not exists idx_content_items_category on content_items (category);
create index if not exists idx_content_items_tags on content_items using gin (tags);
create index if not exists idx_content_items_keywords on content_items using gin (keywords);
create index if not exists idx_content_items_title_summary on content_items using gin (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(summary_zh, '')));

create table if not exists ingest_runs (
  id uuid primary key default gen_random_uuid(),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null check (status in ('running', 'success', 'partial', 'failed')),
  source text not null,
  fetched_count integer not null default 0,
  inserted_count integer not null default 0,
  merged_count integer not null default 0,
  error_message text,
  meta jsonb not null default '{}'::jsonb
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  channel text not null,
  endpoint text not null,
  status text not null default 'pending',
  filters jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_content_items_updated_at on content_items;
create trigger trg_content_items_updated_at
before update on content_items
for each row execute function set_updated_at();
