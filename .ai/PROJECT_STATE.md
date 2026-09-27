# PROJECT STATE

Last Updated: 2026-09-25
Current Branch: main
Last Known Good Commit: efcd8eb (Fix hero: resolve leftover merge conflict, restore background image)

## Project

Name: Harbison Standard Real Estate Website
Purpose: Real estate and investment property search/inquiry platform for Nathanael Harbison (Bakersfield, CA area agent)
Production URL: https://www.harbisonstandard.com
Repository: https://github.com/jasonmanuel-cmd/Harbison-Standard2

## Technology

Frontend: React 19, Vite 6, Phosphor Icons, Vercel Analytics & Speed Insights
Backend: Vercel serverless functions (Node.js), Web Request/Response API
Database: Supabase PostgreSQL (primary, pebqmuumwygrpjofdwfy), legacy Neon Postgres (retained for backwards compat)
Hosting: Vercel (coaiebay-sources-projects/hswebsite)
Authentication: Supabase (anon key for properties, service role key server-side only), Bearer token (ADMIN_TOKEN) for HQ
Other services: Formspree (email submissions), Google Analytics 4 (G-2Q59BEZ4MJ), Google Tag Manager (GTM-M5HK83KW), Google Ads (AW-18453840820)

## Current Architecture

**Frontend (React SPA)**
- Single Page App with pre-rendered static HTML snapshots for 20+ routes
- Vite build produces dist/client/ with server code separate
- Pages: Home, About, Contact, Properties (current, past sales, open houses), Service pages (Real Estate, Investing), Location guides (Tehachapi, Bakersfield, California City, Stallion Springs), Content pages (guides, blog), HQ admin, Private Sale, Off-Market
- Real-time route metadata injection: title, description, canonical URL, Open Graph, JSON-LD
- First-time hero video splash screen (localStorage tracked)

**Backend API (Vercel Functions)**
- /api/buyer-lead — Supabase buyer qualification form saves
- /api/lead — General inquiry form CRM write
- /api/leads — HQ: read/edit leads (requires ADMIN_TOKEN)
- /api/stats — HQ: read inquiry stats (requires ADMIN_TOKEN)
- /api/track — Page view and session tracking
- /api/properties — Property list (public, no auth)
- /api/openhouse — Wendy Dr open house form (Formspree fallback)
- /api/openhouse-log — Open house log reads
- /api/indexnow — Hourly cron job for search engine indexing

**Database Schema**
- Supabase tables: properties, leads (inquiries), sessions, visits
- Neon tables: legacy leads, sessions (not actively used)
- All tables auto-created on first use via initializers in api handlers

**Static Generation**
- npm run build produces prerendered property pages with initial HTML snapshots
- SEO metadata and structure data embedded at build time
- Sitemap and robots.txt generated from published property inventory
- Image sitemap updated from property photos

**HQ (Admin SPA)**
- Lazy-loaded, noindex private dashboard at /hq
- Password-protected with ADMIN_TOKEN bearer auth
- Shows unified lead/inquiry list with status, notes, edit capabilities
- Tracks anonymous page views (excluded from analytics)
- SessionStorage keeps auth token (hs_hq)

## Working Features

- ✅ 3 published properties (Mariposa Rd $40k, Chalet Dr $199k, Wendy Dr $880k) with detail pages
- ✅ Buyer qualification form (Supabase direct + Formspree email)
- ✅ General inquiry form (Formspree primary + Supabase CRM copy)
- ✅ Open house registration form (Wendy Dr)
- ✅ CRM inquiry list/detail view (HQ)
- ✅ Hero video 9:16 aspect ratio mobile fix (deployed Sep 24-25)
- ✅ Session and visit tracking (Supabase, atomic writes)
- ✅ Analytics: GA4 and GTM tags installed
- ✅ Property crawlability: XML sitemaps, robots.txt, JSON-LD schemas
- ✅ SEO: per-page meta, canonical URLs, Open Graph, Twitter cards, breadcrumbs
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Private Sale and Off-Market Deals pages
- ✅ Location guides (15+ pages)
- ✅ Blog posts (5+ pages)
- ✅ Home value calculator
- ✅ Guides index and Blog index pages

## In Progress / Partially Complete

- Buyer inquiry field consolidation in HQ (notes, status, preferences persist but create/manual-entry gaps exist)
- IndexNow submission tooling (command exists, cron config in place, no repeated scheduling yet)
- Analytics consolidation (runtime loads GTM once, but static HTML may load duplicate GA4; HQ is excluded from tracking)

## Known Problems

1. **HQ Production Credential Mismatch** — Local and supplied ADMIN_TOKEN were rejected by production before deployment. Environment var alignment needed without sharing passwords.
2. **Buyer Inquiry Fields** — HQ manual creation does not persist buyer preferences, status, or notes yet. General inquiry message normalization not complete.
3. **Analytics Consolidation** — Static index.html and runtime initialization may load GA4 twice; GTM container contents and conversion reporting unverified in GA4 account.
4. **Tracking Accuracy** — Session upsert resets visits to 1; visit insert failures ignored (returned as success). Private database access controls not explicitly verified (policies exist but live RLS enforcement not tested).
5. **Apollo Property** — Remains unpublished. Older campaign links still exist but must not be used; page returns app shell (200), not property snapshot.
6. **Search Console / Bing** — Sitemaps submitted, but indexing acceptance unverified in external accounts.

## Important Files

- `/src/App.jsx` — Main SPA routing (20+ pages defined inline)
- `/src/seo.js` — Meta, canonical, schemas, analytics init (31KB)
- `/src/data.js` — Agent info, service copy (20KB)
- `/src/Home.jsx` — Homepage with hero video (17KB)
- `/src/PropertyPages.jsx` — Property listing and detail pages (17KB)
- `/src/Hq.jsx` — Admin SPA (17KB)
- `/src/LeadForm.jsx` — Multi-step buyer inquiry form (9KB)
- `/src/analytics.js` — GA4/GTM initialization (2.7KB)
- `/api/lib/db.mjs` — Supabase/Neon connection and auto-create (auto-creates tables)
- `/api/lib/auth.mjs` — Bearer token auth for HQ
- `/vercel.json` — Rewrites (20+ routes), redirects, crons, headers
- `/vite.config.mjs` — Build config, preview routing, dev proxy
- `/public/sitemap.xml` — Property URL list (generated)
- `/public/robots.txt` — Crawl directives (generated)
- `/scripts/prerender-metadata.mjs` — Generates property snapshots at build time

## Environment

Required env vars (Vercel Production + local .env):
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Server-side Supabase auth (never browser-exposed)
- `SUPABASE_ANON_KEY` — Optional Supabase anon key (used for RLS tests)
- `ADMIN_TOKEN` — Bearer token for /hq (SHA-256 checked with timingSafeEqual)
- `DATABASE_URL` — Legacy Neon connection string (optional, retained for backwards compat)
- `VITE_GA4_ID` — GA4 measurement ID (G-2Q59BEZ4MJ)
- `VITE_GTM_ID` — Google Tag Manager ID (GTM-M5HK83KW)
- `VITE_GOOGLE_ADS_ID` — Google Ads conversion ID (AW-18453840820)
- `VITE_GOOGLE_SITE_VERIFICATION` — GSC verification token (optional)
- `VITE_META_PIXEL_ID` — Meta Pixel ID (optional)

No secrets, API keys, tokens, or database credentials should be recorded in this file.

## Current Objective

Maintain stable production deployment. Complete Phase 1 finalization:
1. Verify production HQ authentication after env var alignment
2. Verify GA4/GTM reporting in Google accounts
3. Verify Google Search Console/Bing sitemap acceptance
4. Complete buyer inquiry field consolidation in HQ
5. Plan Phase 2: social scheduling and paid campaigns for current properties
