# Prototype Instructions

## September 10, 2026 continuation

- User corrected the Supabase project: Harbison uses `pebqmuumwygrpjofdwfy`. The earlier `rfggwgbbmugrcpmjjvex` URL was supplied by mistake and belongs to a completely separate application. Do not modify that other project. Inspect the correct Harbison schema before applying setup.
- Phase 1.1 buyer inquiries use Supabase; preserve existing Formspree and Neon/HQ code. This supersedes the earlier Neon-only decision for the buyer acquisition system.
- Keep the existing visual design locked. The research PDF is background for the property-to-buyer-capture funnel, not authorization to launch advertising or create the Aspen website.

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
- This lock applies to EVERY task regardless of what is being asked — never introduce color, style, or layout changes as a side effect of content, feature, or functionality work. Only change visuals if the user explicitly asks for a visual change.
- User may change copy/text, content, features, and functionality — but visual presentation stays as-is.

# Lead capture and SEO decisions — September 6, 2026

- All inquiry funnels (homepage, contact page, and the three service pages) submit to Formspree at `https://formspree.io/f/xqpkdwrp`. The multi-step lead form now has real success/error states instead of a fake success message; it keeps "Open in email app" (mailto) and "Copy message" as backup fallbacks.
- The Formspree submission sets `_replyto` to the visitor's email and `_cc` to nate85.realtor@gmail.com so Gmail receives a copy. Confirm the Formspree endpoint's dashboard is also configured to deliver to nate85.realtor@gmail.com.
- SEO/GEO/AEO follows a full technical overhaul: per-page meta title/description, canonical URLs, Open Graph and Twitter cards, JSON-LD structured data (RealEstateAgent, WebPage, BreadcrumbList, FAQPage, Service, ProfessionalService, Website, ProfilePage, ContactPage, ItemList), plus `public/sitemap.xml` and `public/robots.txt`.
- FAQ copy has ONE source of truth so visible content and FAQPage JSON-LD never drift: homepage = `src/seo.js` → `homeFaq` (rendered by `Home.jsx`), service pages = `src/serviceData.js` → `page.faq.items` (rendered by `ServicePage.jsx` and read by `src/seo.js` `serviceFaqFor`), contact = `src/seo.js` → `contactFaq` (rendered by `Pages.jsx`). Change FAQ text in those files only; never duplicate it in both a renderer and schema.
- Static entity JSON-LD (RealEstateAgent / Organization / WebSite) lives in `index.html` so non-JS crawlers and answer engines can read the agent entity; the SPA injects per-route JSON-LD at runtime.
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

## September 10: real estate and investment scope
- User explicitly removed all building/development messaging from the entire public website. Harbison Standard now covers real estate and investment only; this supersedes prior building service, biography, tagline, and YouTube-build CTA decisions. Preserve the established visual style.
- Properties shows current listings newest first; Past Sales and Open Houses are separate pages. Do not invent open-house dates.
- User supplied 3304 Apollo St, Bakersfield CA 93306 and asking price $299,999.99. Video/media and current listing status need confirmation before publication.

- Apollo is the only new listing (Guadalupe was a transcription error). User approved Coming Soon through October 1, 2026, at $299,999.99. Use early-information inquiries, not binding bids or deposits. Feature it and send social/video traffic to its individual page; photos/video still pending.

- User removed all San Diego references from the public website, including service areas and past-sales examples; Kern County is the service focus. This supersedes older San Diego decisions. Apollo facts: 3 bedrooms, 2 full bathrooms, 1305 living sq ft, 6664 sq ft lot, single story, 1962, R-1 zoning, evaporative cooling, electric heating. Historical 1978 sale: 52600 dollars; historical 40 dollars/sq ft must never be presented as current asking price/sq ft. Preserve the editorial page style.

## September 10: Phase 1 launch
- User approved the supplied Google street-view and map images as temporary Apollo media. Preserve their visible attribution; a walkthrough video is optional until supplied.
- Production domain is https://www.harbisonstandard.com with the bare domain redirecting to www. Vercel project is coaiebay-sources-projects/hswebsite. User authorized deployment and pushing this project to https://github.com/jasonmanuel-cmd/Harbison-Standard2.git while preserving its history.
- Buyer inquiries save to Harbison Supabase first and notify Nathanael through the existing Formspree endpoint. Failure to send the email must not turn a saved inquiry into a submission failure; show a clear contact fallback.
- HQ defaults to Supabase Buyer inquiries and retains Other inquiries for the existing Neon integration. Both require ADMIN_TOKEN. Buyer notes use the notes column confirmed present in Supabase. Notes have an explicit Save notes button.
- Vercel API entry points export the Web Standard object `{fetch:handler}`. A default function receives Node requests on Vercel and is incompatible with this code's Web Request APIs. Local shim and prerendering call `.fetch` on the same exports.
- Build generates static route metadata, property previews, and sitemap entries, including past-sale fallbacks. This is metadata prerendering, not full visible-content SSR. Keep the Sites packaging files intact.

## September 10: property crawlability correction
- Property pages now render their full existing React UI at build time, not just metadata. Embed only the normalized public property data and hydrate the same components in the browser. Keep initial content visible if the API is unavailable. This supersedes the metadata-only implementation above; no public design change is intended.
- robots.txt allows /api/properties specifically while retaining Disallow /api/ and /hq for private endpoints. Public property content must not depend on a crawler-blocked request.
- Run npm run build before node --test tests/property-prerender.test.mjs to verify initial HTML content and crawl directives. Published property edits require a new deployment to refresh the initial HTML snapshot.

## September 10: current inventory and status review
- User explicitly confirmed Apollo cannot be listed yet. Keep it unpublished; do not restore Coming Soon publication or distribute its historical campaign links without new authorization. This supersedes the earlier Apollo launch approval.
- Current published inventory observed during audit: Mariposa Road, Chalet Drive, Wendy Drive. Preserve current records and supplied photos.
- PROJECT_STATUS.md and LAUNCH_ROADMAP.md contain the latest verified audit. Active CRM handlers have moved to Supabase; legacy Neon files remain, and HQ consolidation is incomplete. Do not describe the older two-backend design as verified current behavior.
