# Harbison Standard

Harbison Standard is the official website for Nathanael Harbison, a California REALTOR® (DRE 02059393) based in Bakersfield / Tehachapi. Phone (661) 472-7499 · nate85.realtor@gmail.com

## Pages

- **Home** (`/`) — brand hero, "From the ground up" builds CTA (YouTube), inquiry funnel
- **Properties** (`/properties`) — verified sold transactions with disclaimer; no external listing links
- **About** (`/about`) — bio with "Follow Nate's builds on YouTube" CTA
- **Contact** (`/contact`) — name, email, phone, all four social links, inquiry funnel
- **Services** — `/real-estate`, `/development`, `/investing` (each with its own tailored funnel)
- **HQ** (`/hq`) — password-protected lead dashboard (noindex)

## Lead capture

- Every inquiry funnel submits to Formspree (`https://formspree.io/f/xqpkdwrp`), with `_replyto` = visitor email and `_cc` = nate85.realtor@gmail.com.
- A non-blocking local copy is also written to the CRM at `POST /api/lead` (session id, path referrer, UTM params from `src/track.js`).

## CRM (Neon + Vercel + HQ UI)

The lead-capture CRM is a set of Vercel serverless functions under `api/` backed by Neon Postgres:

| Route | Auth | Purpose |
| --- | --- | --- |
| `POST /api/track` | public | record a page view / session |
| `POST /api/lead` | public | save an inquiry (returns 400 if name/email missing) |
| `GET /api/lead?id=` | Bearer | single lead + visit trail |
| `PATCH /api/lead` | Bearer | update status / notes |
| `GET /api/leads` | Bearer | list, filters: `status`, `q`, `limit` |
| `GET /api/stats` | Bearer | totals, top paths, leads by source/status, 14-day trend |

Tables (`leads`, `sessions`, `visits`) are created automatically on first use.

Environment variables (Vercel):
- `DATABASE_URL` — Neon Postgres connection string
- `ADMIN_TOKEN` — bearer password protecting private HQ lead read/update and stats endpoints

`vercel.json` routes named pages to their generated metadata HTML and preserves `/api/` endpoints. HQ at `/hq` signs in with `ADMIN_TOKEN` (stored in sessionStorage) and talks to the API.

## Local development

```
cp .env.example .env        # add DATABASE_URL + ADMIN_TOKEN
npm ci
npm run dev:api             # CRM API on :8787 (Vite proxies /api → :8787)
npm run dev -- --host 0.0.0.0 --port 4173
```

Supabase buyer/property endpoints require `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Legacy tracking and general inquiries require `DATABASE_URL`; private HQ reads require `ADMIN_TOKEN`.

## Build & handoff

```
npm run build        # leaves dist/client/index.html, dist/server/index.js, dist/.openai/hosting.json
npm run test:sites   # OpenAI Sites backup-host tests (worker/ untouched)
```

`worker/index.js` runs the site as a static fallback and does **not** serve `/api/*` or HQ.
## Phase 1 Supabase property + buyer acquisition layer

The visual system remains the existing Harbison Standard design. New functionality is isolated behind reusable API/components:

- `GET /api/properties` — reads the `properties` table from Supabase.
- `GET /api/properties?slug=...` — reads one property by slug.
- `POST /api/buyer-lead` — writes qualified buyer-intent records to the `leads` table.
- `/properties` — database-driven property index (falls back to the verified legacy property data if Supabase is unavailable during local development).
- `/property/[slug]` — dynamic SPA property detail route.
- `/moving-from-los-angeles-to-bakersfield` — first buyer-acquisition landing page.

### Required Supabase environment variables

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are server-only Vercel variables. The service-role key is never referenced from `src/` and therefore cannot enter the browser bundle. `SUPABASE_ANON_KEY` is an optional server-side fallback only.

The buyer lead endpoint expects these columns in `leads`: `name`, `phone`, `email`, `current_city`, `desired_area`, `budget`, `property_type`, `timeline`, `financing_status`, `has_property_to_sell`, `property_id`, `brand`, `landing_page`, `referrer`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`.

The property API normalizes common column names, but `properties.slug` is required for stable `/property/[slug]` URLs.

### Analytics hooks

Set real values only when available: `VITE_GA4_ID`, `VITE_GTM_ID`, and `VITE_GOOGLE_SITE_VERIFICATION`. Buyer submissions emit a `generate_lead` event to `gtag` and/or `dataLayer`, so Google Ads conversion tags can be attached in GTM without hard-coding an advertising ID in the app.

## Phase 1 operations

Production: https://www.harbisonstandard.com (Vercel project coaiebay-sources-projects/hswebsite).

Open /hq with the configured ADMIN_TOKEN password. Buyer inquiries uses Supabase; Other inquiries uses the retained Neon integration. Select an inquiry, update its status, and use Save notes after editing. Buyer inquiries are saved before notification through Formspree; an email failure leaves the saved record available in HQ.

The build reads published Supabase properties to generate page/share metadata and a sitemap. Configure the server variables in the relevant Vercel environment before building. API exports use the Web Standard fetch object; local development invokes the same handlers. Never commit .env, .env.local, or .vercel contents.

Run all regression checks with: node --test tests/buyer-api.test.mjs tests/buyer-tracking.test.mjs tests/sites-worker.test.mjs
