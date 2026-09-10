# Harbison Standard launch roadmap
Updated September 10, 2026.

## Phase 1: live acquisition website
Production: https://www.harbisonstandard.com
Apollo: https://www.harbisonstandard.com/property/3304-apollo-st-bakersfield-ca
Private lead management: https://www.harbisonstandard.com/hq

Implemented and deployed:
- Existing visual identity, real estate/investment scope, and Kern County focus.
- Current Listings, Past Sales, Open Houses, About, Contact, Real Estate, Investing, LA-to-Bakersfield, and individual property pages.
- Apollo Coming Soon with anticipated October 1, 2026 launch; asking price $299,999.99 and supplied property facts.
- Temporary supplied street-view photograph and location map, with source context and attribution preserved.
- Supabase buyer capture, property association, preferences, and first/last campaign attribution.
- Formspree buyer notifications after saving. Failed notification does not discard the saved lead.
- Private HQ buyer list, details, statuses, and explicit Save notes. Existing Neon Other inquiries remains available.
- Vercel Web Standard API handlers and generated route/share metadata, sitemap, and HQ noindex.

Verified on production:
- Published Apollo API returns expected price and facts.
- Test inquiry returned 201, persisted with Apollo association and normalized bedrooms, and Formspree accepted the notification.
- HQ authenticated readback, status change, notes update, and both backend stats returned successful responses.
- Invalid inquiry returns 400; unauthenticated private API requests return 401.
- All checked public routes, past-sale detail, images, robots.txt, and sitemap return 200.
- Bare domain redirects to www over HTTPS.
- Disposable Supabase test record was removed.
- Nine regression tests pass; Vercel production build succeeds.

Outstanding verification:
- Actual Gmail receipt: user will confirm in the morning; Formspree acceptance is verified, inbox receipt is not.
- Browser visual/interactivity verification is being completed separately; HTTP checks do not prove responsive layout.
- Google Analytics/GTM and Search Console IDs are not configured. Campaign fields are saved with inquiries; do not claim Google conversion reporting is active.

## Phase 2: traffic and follow-up
1. Use tagged Apollo links for Facebook, Instagram, YouTube, and QR codes; see TRAFFIC_LINKS.md.
2. Create approved property posts and videos. No advertising, outreach, or social posting has been launched.
3. Work incoming leads in HQ: New, Contacted, Qualified, Closed. Add notes and agree showing arrangements directly.
4. Connect Google Analytics and Search Console, verify conversions, and report visits, inquiries, appointments, and lead quality.
5. Add confirmed showing/open-house dates and approved photos/video when supplied.
6. Expand relocation/search content and matching/follow-up automation after the manual process is reliable.

A single-property inquiry site does not require an MLS feed. Professional media and a walkthrough can follow launch.
