# September 10, 2026

Reviewed the supplied ChatGPT history and Buyer-Interception-Research.pdf against this React/Vite project. Preserved CSS, fonts, layout and imagery.

Completed: local API routes for properties/buyer inquiries; attribution retention across internal navigation; duplicate Meta conversion fix; HQ exclusion from analytics/attribution; public property response field allowlist and draft exclusion; sold-property disclaimer and similar-home CTA; active-only relocation inventory; fallback property IDs no longer sent into a UUID foreign key; buyer source persistence; six passing regression/Sites tests and successful production build.

Local preview: http://localhost:5173, API: http://localhost:8787.

User confirmed sharing Supabase project rfggwgbbmugrcpmjjvex with the existing trucking application. Read-only API verification succeeded but found no properties/leads tables. No remote tables have been changed. Complete transactional setup is in supabase/setup-harbison.sql; it includes Phase 1.1 columns and locks the new tables to server-side access. Existing trucking tables are untouched.

Pending: execute setup through an authenticated Supabase SQL editor (dashboard was blank in the in-app browser; Chrome connection failed), verify a buyer write and readback, add a verified real available property, configure follow-up delivery/access for Supabase buyers, confirm current production domain and deployment target, supply actual analytics IDs, and deploy when ready. Existing HQ still uses Neon and does not display Supabase buyer leads. Analytics IDs and Neon/HQ environment values are empty. No advertising or deployment has been launched.

Security reference: https://supabase.com/docs/guides/api/securing-your-api

## Project correction
User clarified that Harbison uses pebqmuumwygrpjofdwfy; the previous URL was supplied by mistake. No remote mutations were made. Local .env URL is corrected and wrong-project keys cleared. Need the matching Harbison server key entered locally, then inspect its schema before applying setup. Browser connection still fails before reading any dashboard content.

Verified updated Harbison credentials: REST schema and property handler return HTTP 200. Both original tables exist; available property count is zero. Existing leads.bedrooms is integer and properties.gallery holds gallery media; handlers corrected and mocked regression checks passed. Attribution/source/desired_area/budget columns still need setup SQL. Supabase execute_sql connector returned permission denied; no remote mutations made.

## Database verified after SQL setup
Harbison schema now includes all Phase 1.1 fields. Restarted local API to load correct credentials. Real HTTP POST /api/buyer-lead returned 201; server-side readback verified buyer preferences, integer bedrooms, brand, source, and first/last attribution. Invalid submission returned 400; unauthenticated REST access returned 401/403. Deleted only the disposable test lead and verified absence. Properties table is empty; first real property details/media required. No deployment performed.

Apollo record changed from draft to Coming Soon with anticipated October 1, 2026 launch and exact asking price 299999.99. Public API, current-listing filters, homepage feature, and early-interest form support this status. Build and six tests passed; direct property API verified. No production deployment or social posts sent. Photos and video pending.

September 10 update: Removed public San Diego/Lemon Grove references and corresponding archive examples. Added user-provided Apollo specifications, features, and clearly labelled historical sale. Public API readback verified; build and six regression tests pass. See LAUNCH_ROADMAP.md for current Phase 1 launch gaps, dependencies, estimates, and Phase 2 scope.

## Phase 1 production launch verification
Latest status supersedes earlier pending items above. Correct project pebqmuumwygrpjofdwfy; notes column confirmed. Production https://www.harbisonstandard.com now serves deployment dpl_7trGS5FiwDii114xbJVkUzm1FCbA. Fixed Vercel request-format compatibility using Web Standard fetch exports on all API endpoints. All public route/image/sitemap checks passed. Real production Apollo inquiry saved, Formspree accepted its email, HQ readback/status/notes verified, disposable test deleted. Both Supabase and Neon stats return 200 with authentication; private endpoints reject anonymous requests. Nine automated tests pass. Actual Gmail receipt awaits user confirmation tomorrow morning. Google analytics IDs remain unconfigured. See LAUNCH_ROADMAP.md and TRAFFIC_LINKS.md.

Browser verification update: Agent Browser succeeded after the in-app browser connection failed. Desktop and 390px mobile Apollo rendering verified, with no horizontal overflow or page errors. Real browser inquiry showed success and appeared in HQ. Verified private login and notes persistence; corrected missing Save notes button and HQ mobile overflow. GitHub main is linked to automatic Vercel production builds.

Final verification: GitHub main auto-deployment serves the HQ save/mobile fixes. Live browser notes persisted and both disposable buyer tests were deleted. General inquiry flow reaches its review step; its server validation returns 400 for missing required fields. Apollo loading now reserves viewport space and retains generated property metadata instead of temporarily displaying a not-found title. Local mobile browser layout-shift check improved from approximately 0.588 on the prior production load to 0.00065 after the loading-space correction (lab observations, not field Core Web Vitals).
