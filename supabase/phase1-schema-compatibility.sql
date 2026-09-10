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
