# Harbison Standard — current verified status

Reviewed September 10, 2026 against local source, GitHub main, public production responses, and read-only Harbison Supabase access. This replaces earlier chronological status reports; those remain in Git history.

## Repository and hosting
- Repository: https://github.com/jasonmanuel-cmd/Harbison-Standard2
- Local main and remote main both started this review at 33bdef91d05fd7d90370e399d3d91d2485c7679a, with a clean working tree.
- Production: https://www.harbisonstandard.com
- Vercel project: coaiebay-sources-projects/hswebsite.
- GitHub reports a successful Vercel deployment for that commit: https://vercel.com/coaiebay-sources-projects/hswebsite/FGoSsmFPG45HYMAWmLexy6n83q8R
- Direct Vercel dashboard/API access returned 403; CLI could not access the team. Environment settings, runtime logs, and dashboard-only jobs were not inspected. A successful deployment status does not guarantee healthy API execution.

## What is implemented
- React 19 / Vite 6 site, established visual design, real estate and investment scope.
- Separate current properties, past sales, open houses, About, Contact, real estate, investing, and LA-to-Bakersfield pages.
- Correct Supabase project: pebqmuumwygrpjofdwfy. Properties, leads, sessions, and visits tables respond to authenticated reads.
- Published feed currently contains 22208 Mariposa Rd ($40,000), 0 Chalet Dr ($199,000), and 585 N Wendy Dr ($880,000). All three live detail pages include visible content and hydration data in initial HTML.
- User confirmed during this review: Apollo cannot be listed yet. Keep it unpublished and do not use its old campaign links. Its former URL currently returns a 200 app shell, not a published property snapshot.
- Buyer qualification form saves to Supabase, then requests Formspree notification. General forms retain Formspree with a separate CRM write.
- CRM handlers and tracking now use Supabase. Legacy Neon files/dependencies remain, but active handlers no longer select that backend.
- HQ includes status, notes, edit, and manual-entry controls. Some newer controls have implementation gaps listed below.
- GA4 G-2Q59BEZ4MJ and GTM GTM-M5HK83KW are present in production HTML. This proves installation code is present, not correct event collection.
- Live XML sitemap (17 URLs), image sitemap (6 page entries), and robots.txt return 200 with appropriate content types. Google/Bing indexing acceptance is not verified.
- IndexNow and Google Business Profile setup guides exist. No IndexNow key, submitting endpoint, Vercel cron configuration, or GitHub workflow was found in this repository.

## Corrections made during this review
- Fixed a missing closing brace in api/lib/buyer-crm.mjs. Before correction, the module could not parse and production /api/leads and /api/stats returned 500 even without authentication. Corrected local authenticated reads return 200.
- Corrected JSON escaping in generated property/structured data so less-than characters retain their value after parsing.
- Updated property prerender verification to cover actual published pages and assert that Apollo stays out of the sitemap.
- Replaced obsolete status/roadmap/README claims and marked historical audit documents as superseded.

## Remaining issues, in priority order
1. CRM syntax correction is deployed and private endpoints now return 401 instead of 500. Production also rejects the local ADMIN_TOKEN, so verify with the actual production HQ password or reconcile the environment values. Authenticated production reads remain unverified.
2. Finish CRM consolidation: the HQ Buyer/Other selector still points at the same Supabase handlers, while normalization labels every lead Buying and replaces the original general-inquiry message. Manual creation does not persist the buyer fields, status, or notes exposed in the form. Preserve general inquiry context, validate editable fields, and verify create/edit/readback before calling these complete.
3. Analytics: hardcoded scripts and runtime initialization can load GTM twice; the static template loads analytics on private HQ despite the runtime exclusion. Consolidate initialization, exclude HQ, and verify one conversion and the expected page views in GA4/GTM. Container contents and conversion reporting are not verified.
4. Tracking: session upsert resets visits to 1; visit insert failures are ignored while returning success. Confirm accurate counters and failure handling. Tracking SQL does not explicitly enable RLS/revoke public access; anonymous reads returned empty arrays, which does not prove access controls for populated tables. Verify database policies before relying on privacy guarantees.
5. Routing/SEO: unpublished and unknown property URLs should return a deliberate unavailable/404 response instead of the homepage shell. Keep Apollo unpublished. Confirm Search Console/Bing sitemap acceptance independently.
6. Image sitemap is static; keep it synchronized with published properties. Property structured data currently assumes SingleFamilyResidence, including land listings; make it reflect the actual property type.
7. Confirm actual Gmail notification receipt. Earlier Formspree acceptance was verified, but inbox delivery remains unconfirmed. No new email was sent in this review.
8. Configure/verify Google Business Profile, Bing/IndexNow, and social scheduling only when ready. Setup documents and recommended tools are not evidence of completed connections or published campaigns.

## Verification limits
This is a repository and deployment audit with targeted checks, not certification of every browser flow or external account. No property publication, database migration, email, advertisement, or social post was performed during this review. Secrets and private lead contents were not printed. See LAUNCH_ROADMAP.md for the ordered work remaining.

Local verification after corrections: npm run build succeeded; all 11 automated checks passed, including published-property initial HTML, API privacy, attribution, email-failure handling, and Sites packaging. No visual styling was changed.

## Deployment follow-up
- Fix/audit commit 0332531 is on GitHub main and Vercel reports successful deployment: https://vercel.com/coaiebay-sources-projects/hswebsite/CUXpq9HKjKTqixNwNMt7pUumDXZs
- Live /api/leads and /api/stats now return 401 for anonymous requests. They also return 401 with the local ADMIN_TOKEN; local authenticated handlers return 200. Production password/environment alignment needs checking without sharing secrets in chat.
- Apollo public property API returns 404, consistent with the publication hold. All 16 image URLs in the image sitemap return 200.
- Built preview started on port 4183 and queued in the app. Automated browser access timed out; no fresh visual-browser verification is claimed.
