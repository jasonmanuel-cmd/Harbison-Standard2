# Harbison Standard SEO / AEO / GEO audit

Audit performed September 16, 2026 (Pacific). Scope: live HTTP crawl of 31 URLs, local source inspection, content-parser reproduction, and mobile Lighthouse attempt. No production changes made. Raw crawl: `live-crawl.json`.

## Priority findings

## Measured mobile Lighthouse baseline

Live homepage, one mobile lab run, recorded 2026-09-17 06:37 UTC (September 16 Pacific). Raw report: `mobile-lighthouse.json`. Results vary between runs; these are lab measurements, not field Core Web Vitals.

| Category / metric | Result |
| --- | --- |
| Performance | 65 |
| Accessibility | 96 |
| Best Practices | 96 |
| SEO | 100 |
| First Contentful Paint | 1.7 s |
| Largest Contentful Paint | 4.3 s |
| Total Blocking Time | 180 ms |
| Cumulative Layout Shift | 0.172 |
| Speed Index | 13.9 s |
| Total network payload | 3,527 KiB |

Lighthouse estimates 845 KiB image-delivery savings and 323 KiB unused-JavaScript savings. It flags two layout shifts, unsized images, contrast failures, browser console errors, render-blocking requests and LCP request discovery. The SEO category tests a limited homepage checklist; its 100 does not establish full-site indexation or content accuracy. Earlier displayed `+30` and `+25` values were score contributions, not milliseconds or actual CLS measurements.

### P1 — Guides/blog absent from discovery and initial HTML

The live sitemap has 26 URLs, with no guides or blog entries. `/guides`, `/blog`, and `/guide/tehachapi-land-under-50k` return the same 49,994-character homepage HTML, homepage title, homepage H1 and homepage canonical. JavaScript may replace some of these later; this is a confirmed initial-response defect, not proof that Google has excluded the pages. `scripts/prerender-metadata.mjs` does not enumerate markdown content; `vercel.json` falls back to the homepage. Add a shared content manifest, prerender visible articles and index pages, emit unique metadata and include public content in the sitemap. Register index metadata in `src/seo.js` too.

### P1 — Live runtime errors

The Lighthouse browser recorded React error #418 during homepage loading and a 503 response from `/api/track`. Investigate server/client hydration consistency and tracking backend configuration. This audit observed the failing tracking request but did not inspect credentials or submit test leads. The performance result also flags missing high fetch priority on the LCP image preload. Accessibility failures include the Wendy `LUXURY OPPORTUNITY` label at 2.1:1 contrast and several gold-on-cream text elements.

### P1 — Content reliability needs editorial correction

`src/content/blog/kern-county-market-update-september-2026.md` asserts median prices and annual appreciation without supporting sources. Investment and vacation-rental guides assert typical yields and forecast returns without documented evidence. `what-40k-buys-tehachapi-september-2026.md:132` calls a ten-year scenario a 91% annualized return, which needs recalculation. Tax-auction content describes a generic one-year redemption period and purported success stories without supporting records. The as-is guide equates as-is condition with waived contingencies. These claims require source-based review; do not use them as lead-generation promises. Add primary sources, dates, market geography/methodology and genuine author review; clearly label hypothetical calculations. Review all 16 markdown articles before actively promoting them.

### P1 — FAQ frontmatter is not parsed correctly

Direct execution of `parseFrontmatter()` on the Tehachapi land guide produces an object for `faqItems`, not an array, retaining only the final question under `- q`. Answers containing colons are truncated because parsing splits on every colon. `ContentPage.jsx` and `articleSchema()` test `.length`, so FAQs/schema disappear. Replace the custom YAML parser with a tested parser and verify arrays, colons and Windows line endings. Earlier claims of complete FAQ coverage were incorrect.

### P2 — Unknown URLs return a soft-404 response

`/audit-missing-page` returns 200 and homepage metadata/content. Return a genuine 404 with a helpful visible page and noindex. Keep valid content routes working.

### P2 — Both domains serve the site

The bare `.org` redirects to `www.harbisonstandard.org`, which serves HTTP 200, rather than redirecting to `.com`. Its canonical points to `.com`, which is helpful but does not consolidate user-facing domains. Configure permanent host redirects preserving paths to the chosen `.com` origin. Verify both domain properties in Search Console for monitoring; prior advice that `.org` was inactive was incorrect.

### P2 — Markdown semantics and navigation defects

`markdownToHtml()` emits H2 headings without IDs, but the table of contents links to generated IDs. Table markdown has no conversion support. The template emits an H1 and the markdown emits another; the article nests a main landmark inside the application's main. Use a proper markdown renderer, stable heading IDs and one principal heading. `articleSchema()` emits Article and optionally FAQ, but no BreadcrumbList, contrary to earlier completion claims. Guide listings are manually duplicated rather than generated from the actual files.

### P2 — AI-specific crawler groups lose shared exclusions

`public/robots.txt` has separate named-bot groups containing only `Allow: /`; the wildcard `/hq` and `/api/` restrictions are not inherited by those groups. Repeat exclusions or use the shared group where appropriate. Authentication remains the privacy boundary; robots directives do not secure data.

### P2 — Performance improvements were overstated

Moving React/icons into separate eagerly imported chunks does not remove their transfer/execution cost. Prior outputs total approximately 133 KB gzip across the three chunks. App routes remain statically imported. `src/main.jsx` immediately initializes analytics; async provider scripts still compete for resources. Local hero is 426,851 bytes; six TTF files total roughly 747 KB on disk (not necessarily all transferred). Prioritize actual route lazy loading, responsive hero variants, WOFF2/subsets and measured provider costs. Preserve tracking correctness and visible SEO content. Do not promise a score of 100 or infer improvements from chunk filenames.

## AEO/GEO strategy after repairs

Use concise answers to real buyer/seller questions, verified listings, original local observations and clearly identified expert authorship. Add citations for market statistics and legal/tax assertions. Connect About, service-area pages, related guides and available properties with useful internal links. Maintain consistent name, phone, service area and license details across the site and verified business profiles. Do not invent reviews or ratings. Google states ordinary SEO foundations remain relevant to AI search; special AI text files are not a substitute for crawlability and reliable content.

Sources:
- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/blog/2023/08/howto-faq-changes (FAQ rich-result eligibility is restricted; markup does not guarantee a real-estate rich result.)

## Acceptance checks for remediation

1. Each public article has unique initial title, canonical, visible body and valid schema; sitemap lists all intended pages.
2. FAQs survive parsing with complete answers, and visible FAQ content matches structured data.
3. Missing routes return 404; `.org` redirects permanently to corresponding `.com` paths.
4. Every numeric market claim has a source/date or is explicitly hypothetical; legal sections are verified.
5. Repeat mobile Lighthouse after changes, record actual metrics and check contact/property flows.
6. Use Search Console for indexing, queries and impressions. Ahrefs/backlink, Search Console and Business Profile account data were not available through the exposed tools; no ranking, backlink or indexing claims are made here.
