-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- This creates the sessions and visits tables for tracking

CREATE TABLE IF NOT EXISTS public.sessions (
  id text PRIMARY KEY,
  last_seen timestamptz DEFAULT now(),
  visits integer DEFAULT 1,
  lead_id uuid REFERENCES public.leads(id)
);

CREATE TABLE IF NOT EXISTS public.visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text REFERENCES public.sessions(id),
  path text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS visits_session_id_idx ON public.visits(session_id);

-- Add session_id to leads table for tracking
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS session_id text;
