# Harbison Standard

Real estate and investment website for Nathanael Harbison. Production: https://www.harbisonstandard.com

Current verified state and known issues: [PROJECT_STATUS.md](PROJECT_STATUS.md). Ordered remaining work: [LAUNCH_ROADMAP.md](LAUNCH_ROADMAP.md).

## Architecture
React 19 and Vite 6, with application UI in src/. Vercel Web Standard API handlers are under api/ and export an object with a fetch handler. Published property pages render initial React HTML at build time and hydrate with normalized public data. Other routes receive generated metadata.

Active property, inquiry, and visit handlers use Harbison Supabase project pebqmuumwygrpjofdwfy. Legacy Neon files remain in the repository but are not selected by the current CRM routes. Formspree remains the notification channel. Buyer submissions save first; notification failure does not discard the saved lead. General forms send to Formspree and attempt a separate CRM copy.

Private HQ is /hq and requires ADMIN_TOKEN. Manual entry and editing persist validated fields. HQ shows All inquiries from Supabase. See the status report for the remaining production password and external account checks.

## Configuration
Server: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_TOKEN. SUPABASE_ANON_KEY is an optional server fallback. Never expose server secrets under browser environment prefixes or commit .env files. DATABASE_URL belongs to retained legacy code.

Runtime analytics accepts VITE_GA4_ID / VITE_GTM_ID and the older VITEGA4_ID / VITEGTMID aliases, falling back to the confirmed public measurement IDs. Loaders are centralized in src/analytics.js, run once, and exclude HQ. Keep the direct GA4 tag out of GTM to avoid double counting. Optional hooks include VITE_GOOGLE_SITE_VERIFICATION, VITE_GOOGLE_ADS_ID, and VITE_META_PIXEL_ID.

## Commands
- npm ci
- npm run dev:api — local API shim on port 8787
- npm run dev — Vite frontend, proxies /api to the shim
- npm run build — requires readable published Supabase properties
- node --test tests/*.test.mjs — run after building
- npm run test:sites — Sites fallback host checks

The build preserves dist/client/index.html, dist/server/index.js, and dist/.openai/hosting.json. Keep worker/index.js, scripts/prepare-sites-build.mjs, tests/sites-worker.test.mjs, and .openai/hosting.json intact. The Sites backup host does not provide the Vercel API backend.

## Publishing and operations
GitHub main: https://github.com/jasonmanuel-cmd/Harbison-Standard2
Vercel: coaiebay-sources-projects/hswebsite, output dist/client.

Published database property edits require a deployment to refresh initial HTML and the generated sitemap. Apollo is intentionally unpublished pending user approval; historical Apollo campaign material must not be used yet. The three published listings at the latest audit are Mariposa Road, Chalet Drive, and Wendy Drive.

Maintain the existing visual design. Current scope excludes building/development and San Diego messaging. No advertising or social posting is implied by a code deployment.
