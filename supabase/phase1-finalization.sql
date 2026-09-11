-- Harbison only: pebqmuumwygrpjofdwfy. Safe to rerun; retains existing records.
BEGIN;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS goal text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS interest text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS message text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS timing text;
ALTER TABLE public.visits ADD COLUMN IF NOT EXISTS utm_term text;
ALTER TABLE public.visits ADD COLUMN IF NOT EXISTS utm_content text;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.leads, public.sessions, public.visits FROM anon, authenticated;
GRANT ALL ON public.leads, public.sessions, public.visits TO service_role;

CREATE OR REPLACE FUNCTION public.record_hs_visit(
  p_session_id text, p_path text, p_referrer text DEFAULT '',
  p_utm_source text DEFAULT '', p_utm_medium text DEFAULT '',
  p_utm_campaign text DEFAULT '', p_utm_term text DEFAULT '', p_utm_content text DEFAULT ''
) RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN
  IF p_session_id IS NULL OR length(p_session_id) NOT BETWEEN 1 AND 100
     OR p_path IS NULL OR p_path NOT LIKE '/%' OR p_path LIKE '/hq%' THEN
    RAISE EXCEPTION 'Invalid visit';
  END IF;
  INSERT INTO public.sessions (id, last_seen, visits)
    VALUES (p_session_id, now(), 1)
    ON CONFLICT (id) DO UPDATE SET last_seen = now(), visits = public.sessions.visits + 1;
  INSERT INTO public.visits (session_id, path, referrer, utm_source, utm_medium, utm_campaign, utm_term, utm_content)
    VALUES (p_session_id, p_path, p_referrer, p_utm_source, p_utm_medium, p_utm_campaign, p_utm_term, p_utm_content);
END;
$$;
REVOKE ALL ON FUNCTION public.record_hs_visit(text,text,text,text,text,text,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_hs_visit(text,text,text,text,text,text,text,text) TO service_role;
-- Repair counters left by the former upsert implementation.
UPDATE public.sessions s SET visits = (SELECT count(*) FROM public.visits v WHERE v.session_id = s.id);
NOTIFY pgrst, 'reload schema';
COMMIT;
