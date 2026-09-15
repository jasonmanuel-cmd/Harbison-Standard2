> Historical implementation notes. Current verification and outstanding issues are in PROJECT_STATUS.md and LAUNCH_ROADMAP.md. Older completion and infrastructure claims below may be superseded.

# Harbison Standard — Phase 1 audit and implementation

## Existing project
- React 19 + Vite 6 single-page application.
- Manual pathname routing in `src/App.jsx`; no React Router / Next.js.
- Vercel SPA rewrite in `vercel.json`; `/api/*` remains serverless.
- Global visual system in `src/styles.css` using custom local fonts, navy/gold variables, existing property-card/form patterns, responsive breakpoints, and reduced-motion handling.
- Existing routes: `/`, `/about`, `/properties`, `/contact`, `/real-estate`, `/development`, `/investing`, `/hq`.
- Existing `/properties` was static past-sales data from `src/data.js`.
- Existing lead capture: Formspree plus best-effort POST to a Neon-backed `/api/lead` endpoint.
- Existing attribution: session cookie plus referrer and UTM source/medium/campaign to a Neon visits table.
- Existing SEO: client-side title/meta/canonical/OpenGraph/Twitter plus JSON-LD in `src/seo.js`; static sitemap and robots files.
- Existing integrations: Formspree, Neon Postgres, Vercel serverless functions, social links, YouTube. No GA4/GTM IDs were hard-coded.

## Phase 1 implementation
- Added server-only Supabase REST adapter in `api/lib/supabase.mjs`.
- Added `GET /api/properties` and `GET /api/properties?slug=`.
- Added `POST /api/buyer-lead` with buyer qualification and attribution fields.
- Added reusable property client adapter with static development fallback.
- Replaced the rendered `/properties` page with a Supabase-driven property index while retaining existing property-card styles.
- Added dynamic SPA route `/property/[slug]`.
- Added buyer-intent form with all requested fields.
- Added `/moving-from-los-angeles-to-bakersfield` using existing hero/service/card/form classes.
- Added one minimal `Relocate` navigation entry; `Properties` already existed in navigation.
- Added GA4, GTM, Search Console verification hooks with environment variables only; no IDs invented.
- Added generic `generate_lead` event hooks for GTM/Google Ads conversion configuration.
- Added `utm_term` and `utm_content` capture to the browser attribution layer.
- Added landing-page metadata and dynamic property metadata/RealEstateListing JSON-LD.
- Added a non-destructive Supabase compatibility migration.

## Visual-preservation rule followed
No logo, palette, font files, existing imagery, base typography, original page layouts, footer, or global spacing tokens were replaced. New CSS is additive and limited to property-detail/buyer additions.

## Verification status
- Server modules pass `node --check`.
- New API routes were invoked without Supabase credentials and correctly returned controlled 503 `SUPABASE_UNCONFIGURED` responses.
- Browser source scan confirms `SUPABASE_SERVICE_ROLE_KEY` is not referenced under `src/`, `public/`, or `index.html`.
- Full Vite production build could not be executed in this sandbox because dependency installation stalled before the Vite binary was installed. Run `npm ci && npm run build` in the normal project environment/Vercel before deployment.

## Phase 1.1 alignment with Buyer Interception Research
- Added bedrooms and acreage/lot requirements to the buyer profile.
- Added persistent first-touch and last-touch attribution in addition to the immediate landing/referrer/UTM fields.
- Added analytics event hooks for `property_view`, `gallery_view`, `video_start`, `showing_click`, `phone_click`, `sms_click`, `form_start`, `form_complete`, `buyer_profile_complete`, `similar_property_click`, and `generate_lead`.
- Added optional Google Ads and Meta Pixel environment hooks; IDs remain blank until real account values are supplied.
- Expanded dynamic property pages with property story/headline, video CTA, image gallery, property features/location context, showing CTA, and similar opportunities.
- Refocused the LA → Bakersfield page around budget/property comparison, live Bakersfield inventory, and buyer-profile capture instead of generic relocation copy.
- Extended the non-destructive Supabase compatibility migration for all new buyer-intelligence, attribution, and property-detail fields.
