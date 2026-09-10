-- Bootstrap for project pebqmuumwygrpjofdwfy.
-- Harbison project only. Inspect existing tables before running.
-- Complete setup, including Phase 1.1 compatibility columns, in one transaction.
begin;
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  address text not null,
  city text not null,
  state text default 'CA',
  zip_code text,
  price numeric,
  status text not null default 'draft',
  bedrooms numeric,
  bathrooms numeric,
  square_feet integer,
  lot_size text,
  property_type text,
  headline text,
  description text,
  hero_image text,
  images jsonb not null default '[]'::jsonb,
  video_url text,
  features jsonb not null default '[]'::jsonb,
  location_context text,
  latitude numeric,
  longitude numeric,
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  property_id uuid references public.properties(id),
  brand text not null default 'harbison_standard',
  source text,
  status text not null default 'new',
  created_at timestamptz default now()
);
alter table public.properties enable row level security;
alter table public.leads enable row level security;
revoke all on public.properties, public.leads from anon, authenticated;
grant select, insert, update, delete on public.properties, public.leads to service_role;


-- Harbison Standard Phase 1.1 compatibility migration.
-- Safe to run against an existing project: only adds missing columns/indexes.
-- Review property_id type if your properties.id is not uuid.

alter table public.leads add column if not exists current_city text;
alter table public.leads add column if not exists source text;
alter table public.leads add column if not exists notes text;
alter table public.leads add column if not exists desired_area text;
alter table public.leads add column if not exists budget text;
alter table public.leads add column if not exists bedrooms integer;
alter table public.leads add column if not exists acreage_requirement text;
alter table public.leads add column if not exists property_type text;
alter table public.leads add column if not exists timeline text;
alter table public.leads add column if not exists financing_status text;
alter table public.leads add column if not exists has_property_to_sell boolean default false;
alter table public.leads add column if not exists property_id uuid;
alter table public.leads add column if not exists brand text default 'harbison_standard';
alter table public.leads add column if not exists landing_page text;
alter table public.leads add column if not exists referrer text;
alter table public.leads add column if not exists utm_source text;
alter table public.leads add column if not exists utm_medium text;
alter table public.leads add column if not exists utm_campaign text;
alter table public.leads add column if not exists utm_term text;
alter table public.leads add column if not exists utm_content text;
alter table public.leads add column if not exists first_landing_page text;
alter table public.leads add column if not exists first_referrer text;
alter table public.leads add column if not exists first_utm_source text;
alter table public.leads add column if not exists first_utm_medium text;
alter table public.leads add column if not exists first_utm_campaign text;
alter table public.leads add column if not exists first_utm_term text;
alter table public.leads add column if not exists first_utm_content text;
alter table public.leads add column if not exists last_landing_page text;
alter table public.leads add column if not exists last_referrer text;
alter table public.leads add column if not exists last_utm_source text;
alter table public.leads add column if not exists last_utm_medium text;
alter table public.leads add column if not exists last_utm_campaign text;
alter table public.leads add column if not exists last_utm_term text;
alter table public.leads add column if not exists last_utm_content text;
alter table public.leads add column if not exists created_at timestamptz default now();

alter table public.properties add column if not exists slug text;
alter table public.properties add column if not exists headline text;
alter table public.properties add column if not exists video_url text;
alter table public.properties add column if not exists features jsonb default '[]'::jsonb;
alter table public.properties add column if not exists location_context text;
alter table public.properties add column if not exists latitude numeric;
alter table public.properties add column if not exists longitude numeric;

create unique index if not exists properties_slug_unique on public.properties (slug) where slug is not null;
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_property_id_idx on public.leads (property_id);
create index if not exists leads_utm_source_idx on public.leads (utm_source);
create index if not exists leads_first_utm_source_idx on public.leads (first_utm_source);
create index if not exists leads_last_utm_source_idx on public.leads (last_utm_source);

commit;
