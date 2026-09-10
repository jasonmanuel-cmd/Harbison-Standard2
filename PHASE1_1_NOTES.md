# Harbison Standard — Phase 1.1 Buyer Interception Alignment

This pass aligns Phase 1 more closely with the Buyer Interception Research while preserving the existing Harbison Standard design.

## Buyer intelligence
The buyer profile now captures name, phone, email, current city, desired area, budget, minimum bedrooms, acreage/lot requirement, property type, timeline, financing status, and whether another property must be sold.

## Attribution
The browser now records both first-touch and last-touch attribution in local storage. Submitted leads include the immediate landing/referrer/UTM fields plus first- and last-touch landing page, referrer, utm_source, utm_medium, utm_campaign, utm_term, and utm_content.

## Property funnel
Dynamic property pages now support:
- hero image/status/address/price/specs
- property headline/story
- showing/property inquiry CTA
- optional video URL
- multi-image gallery
- optional features and location context
- buyer profile tied to property_id
- similar opportunities

The server-side property normalizer accepts common alternate database column names and exposes headline, video URL, coordinates, features, and location context when present.

## Acquisition funnel
`/moving-from-los-angeles-to-bakersfield` is now structured around the research premise: compare what a buyer's budget can target, show real Bakersfield inventory, explain relocation decision variables, then capture the buyer profile.

## Measurement hooks
Events prepared for GA4/GTM/Google Ads/Meta configuration:
- property_view
- property_select
- gallery_view
- video_start
- showing_click
- phone_click
- sms_click
- form_start
- form_complete
- buyer_profile_complete
- similar_property_click
- generate_lead

No analytics or advertising IDs are invented. Configure real values through `.env`/Vercel environment variables.

## Supabase
Run `supabase/phase1-schema-compatibility.sql` against the NEW Supabase project before testing lead submission. It adds the Phase 1.1 buyer-intelligence, attribution, and property-detail fields without dropping existing columns.

Server-side environment variables:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (preferred for the serverless API only)
- `SUPABASE_ANON_KEY` (optional fallback depending on RLS design)

Never prefix the service-role key with `VITE_`.

## Build verification
Server-side `.mjs` files pass `node --check`, and browser source contains no service-role-key reference. A full Vite build could not be executed in this sandbox because package downloads from npm timed out and the required dependency archive was not present in the local npm cache. Before deployment, run:

```bash
npm ci
npm run build
```

Then test the property API and submit one buyer lead against the real Supabase environment.
