# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

# Website structure and content decisions — September 6, 2026

- Keep the existing Harbison Standard navy, gold, cream, serif typography, and homepage visual direction when extending the site.
- About (`/about`), Properties (`/properties`), and Contact (`/contact`) must be separate linked pages, not homepage-only sections or contact dialogs.
- The brand is Harbison Standard. Do NOT display Compass, "REALTOR® at Compass", or compass.com anywhere on the site (footer, pages, meta descriptions, JSON-LD). Biographical data originated from Nathanael's Compass profile; the profile URL lives only in git history/AGENTS.md: https://www.compass.com/agents/nathanael-harbison/ . Phone: (661) 472-7499. Email: nate85.realtor@gmail.com (user explicitly overrides the Compass email). DRE: 02059393.
- Properties should include verified sold transactions, with matching photos, sold status, factual details, and a disclaimer that they are past sales (no external listing links are shown).
- Contact needs his name, email, phone, all four social links, and an inquiry funnel; the homepage also needs a funnel.
- User-supplied social links: https://www.facebook.com/nate85.realtor ; https://www.instagram.com/nathanaelharbison ; https://www.youtube.com/@Nathanaelharbison ; https://www.linkedin.com/in/nathanael-harbison .
- There is a mild-but-noticeable "Follow Nate's builds on YouTube" CTA on the homepage ("From the ground up" section) and the About page bio, using the standard inline-link styling and the YouTube icon.

# Visual design lock — September 6, 2026

- The current layout, colors (navy #031c2b, gold #edc66f, cream #f6f5ef), typography (Libre Caslon headings, Open Sans body), spacing, component anatomy, and overall look and feel are LOCKED.
- Do not change any visual styling, CSS layout, color palette, fonts, or design direction unless the user explicitly requests it.
- User may change copy/text, content, features, and functionality — but visual presentation stays as-is.

# Lead capture and SEO decisions — September 6, 2026

- All inquiry funnels (homepage, contact page, and the three service pages) submit to Formspree at `https://formspree.io/f/xqpkdwrp`. The multi-step lead form now has real success/error states instead of a fake success message; it keeps "Open in email app" (mailto) and "Copy message" as backup fallbacks.
- The Formspree submission sets `_replyto` to the visitor's email and `_cc` to nate85.realtor@gmail.com so Gmail receives a copy. Confirm the Formspree endpoint's dashboard is also configured to deliver to nate85.realtor@gmail.com.
- SEO/GEO/AEO follows a full technical overhaul: per-page meta title/description, canonical URLs, Open Graph and Twitter cards, JSON-LD structured data (RealEstateAgent, WebPage, BreadcrumbList, FAQPage, Service), plus `public/sitemap.xml` and `public/robots.txt`.
- The live domain is set in ONE place: `src/seo.js` → `siteUrl` (currently `https://www.harbisonstandard.com`); `sitemap.xml`, `robots.txt`, and `index.html` hardcode the same domain and must be updated if the domain changes.

# Service page decisions — September 6, 2026

- The three homepage service cards link to separate pages: `/real-estate`, `/development`, and `/investing`.
- Replace the generic real estate opportunity message with selling a home during life changes, including divorce, bankruptcy, foreclosure, repairs, inheritance, and other circumstances. Use supportive language without promises about legal outcomes, guaranteed sales, or cash offers.
- Development covers having a home built, exploring land, and buying a spec home. User confirmed that “sim home” meant a spec home.
- Investing covers general property investing, inquiries about investing in Harbison Standard, and buying/restoring/flipping one's own homes. Do not invent an active company offering, terms, or returns.
- Each service page has a tailored inquiry funnel using the existing lead form, which submits to Formspree.

# Lead-capture CRM decisions — September 6, 2026

- Option 2 CRM implemented: Neon Postgres (NOT Supabase) + Vercel serverless functions in `api/` + password-protected SPA named **HQ** at `/hq`.
- Formspree remains the primary delivery channel (unchanged). Every lead form ALSO writes a copy to the CRM non-blockingly via `POST /api/lead` (`src/LeadForm.jsx` → `recordLead()`), so the Formspree response still drives the success state and must not be coupled to the CRM.
- `src/track.js` sets a first-party session cookie (`hs_sid`) and beacons page views to `POST /api/track` on every route change (path, referrer, UTM params). Tracking is fire-and-forget and must never break the page.
- Tables `leads`, `sessions`, `visits` auto-create in Neon on first use (`api/lib/db.mjs`). API handlers use the Web `Request`/`Response` API so they run unchanged on Vercel Node functions and the local shim (`npm run dev:api` → `scripts/dev-api.mjs`, Vite proxies `/api` → :8787).
- HQ auth is a bearer token: `ADMIN_TOKEN` env var (SHA-256 + timingSafeEqual in `api/lib/auth.mjs`); the `/hq` SPA keeps it in sessionStorage (`hs_hq`). Login succeeds for an unconfigured backend so the "Not configured yet" screen can explain the missing env vars.
- `/hq` is noindex (dynamic `meta[name="robots"]` set to `noindex, nofollow` via `src/seo.js` route entry + `public/robots.txt` `Disallow: /hq`). It is NEVER shown in the nav, site chrome (header/footer/closing) is not rendered on `/hq`, and it must not be tracked or visible to search engines.
- `vercel.json` rewrites everything except `/api/*` to `/index.html`. `worker/index.js` (OpenAI Sites backup host) does NOT serve `/api/*`; the CRM and `/hq` work on the Vercel primary only. Keep `tests/sites-worker.test.mjs` passing.
- Required env vars (Vercel + optional local `.env` from `.env.example`): `DATABASE_URL` (Neon), `ADMIN_TOKEN`.
- Lead list/detail/stats/status/notes are managed from `/hq` only; no public endpoint exposes lead data.
