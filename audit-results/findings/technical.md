# Technical SEO Audit — harbisonstandard.com

**Audited URL:** https://www.harbisonstandard.com
**Date:** 2026-09-19
**Stack:** React 19 + Vite SPA, per-route pre-rendering, hosted on Vercel
**Method:** Direct HTTP inspection (curl), `sitemap_discovery.py`, and Playwright-based rendering diff (`render_page.py`) via the Claude SEO toolchain.

## Technical Score: 72 / 100

Strong foundation (schema, meta, security transport, sitemap, compression, responsive CSS) undermined by one critical pre-rendering gap that leaves four important local-SEO landing pages functionally blank to any crawler that doesn't execute JavaScript.

---

## Category Summary

| Category | Status | Notes |
|---|---|---|
| Crawlability | PASS | robots.txt valid, sitemap.xml + sitemap-images.xml declared and both validate (200, valid urlset) |
| Indexability | PARTIAL FAIL | 4 pages ship with an empty DOM root (client-render only); duplicate meta descriptions on sold listings |
| Security | PARTIAL FAIL | HTTPS + HSTS present; CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy all missing |
| URL Structure | PASS | Clean, hyphenated, lowercase paths; single 308 redirects for http→https and apex→www (no chains) |
| Mobile | PASS | Correct viewport meta, 10 responsive breakpoints, apple-mobile-web-app tags present |
| Core Web Vitals (source-level) | PARTIAL FAIL | Good preload/font/image strategy site-wide, but the 4 blank-root pages have effectively unbounded LCP/INP until hydration completes |
| Structured Data | PASS | RealEstateAgent, Organization, LocalBusiness, WebSite, WebPage, FAQPage, BreadcrumbList, RealEstateListing all present and consistent; aggregateRating count matches visible testimonials |
| JavaScript Rendering | PARTIAL FAIL | Most routes are correctly pre-rendered server-side; 4 city routes are not |
| IndexNow | PARTIAL FAIL | Cron exists but only submits 1 URL/hour and never confirms the required key-file verification step |

---

## What's Working Well

1. **Pre-rendering works correctly for ~40 of 44 sitemap URLs.** Home, `/properties`, `/about`, all `/guide/*`, all `/blog/*`, all `/property/*` (except the ones noted below), and the market-data pages (`/bakersfield-home-prices`, `/tehachapi-home-prices`, etc.) all serve fully-formed HTML in the raw response — verified by diffing `curl` output against the rendered DOM. No JS execution is required for Google, Bing, or any AI crawler to read this content.
2. **robots.txt is well-built for the AI-crawler era.** Explicit `Allow`/`Disallow` blocks for `GPTBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `anthropic-ai`, and `Google-Extended`, all mirroring the default policy (allow site, block `/api/` except `/api/properties`, block `/hq`). Both sitemaps are declared.
3. **Structured data is thorough and internally consistent.** `RealEstateAgent`, `Organization`/`ProfessionalService`, `LocalBusiness`, `WebSite`, `WebPage`, `FAQPage`, and `BreadcrumbList` on content pages; `RealEstateListing` with `offers` on property pages. The homepage `aggregateRating` (ratingCount: 6) matches the 6 visible testimonials — this avoids a common "hidden reviews" structured-data violation.
4. **Redirects are clean.** `http://` → `https://www` and apex `harbisonstandard.com` → `www.harbisonstandard.com` are both single 308 (permanent) hops with a `Location` header pointing straight at the canonical form. No redirect chains found.
5. **Compression and caching are correctly configured.** Brotli (`Content-Encoding: br`) is served when `Accept-Encoding` is sent; static assets show `Etag`/`Last-Modified` with Vercel edge cache (`X-Vercel-Cache: HIT`).
6. **Performance-conscious head markup site-wide:** responsive `<link rel="preload">` for hero images by breakpoint (`media="(max-width:740px)"` / `(min-width:741px)`), `fetchpriority="high"` on the LCP image, font preloading with `crossorigin`, and `rel="modulepreload"` for JS chunks.
7. **CLS mitigation in CSS.** `.hero` and `.hero--standard` reserve fixed/`vw`-based heights, and card/image containers widely use `aspect-ratio` — this materially reduces layout-shift risk from the hero and image grids.
8. **URL structure is clean:** lowercase, hyphenated, no underscores or query-string identifiers, semantic slugs (`/guide/inherited-house-bakersfield`, `/property/mariposa`).
9. **Mobile basics are correct:** `width=device-width, initial-scale=1.0` viewport, `apple-mobile-web-app-capable`, and 10 distinct CSS breakpoints (`460px` through `1600px`) confirm a genuinely responsive layout rather than a fixed-width desktop page.
10. **Unique, reasonably-scoped meta titles/descriptions** across the city, market-data, and service pages (checked 18 pages; only the "sold" property template repeats — see Critical/High findings).

---

## Critical Issues (block indexing / rankings)

### C1. Four high-value local-SEO landing pages are not pre-rendered — they ship an empty `<div id="root"></div>`
Verified by raw `curl` fetch (no JS execution) against all 44 sitemap URLs:

- `/tehachapi` — 7,748 bytes, `<div id="root"></div>` (empty)
- `/bakersfield` — 7,718 bytes, empty root
- `/california-city` — 7,738 bytes, empty root
- `/stallion-springs` — 7,715 bytes, empty root

All four return `HTTP 200`, carry a correct `<title>`, unique meta description, `canonical`, `robots: index, follow`, and full JSON-LD (including `BreadcrumbList`) in `<head>` — but the `<body>` contains **zero visible text, headings, or links**. I confirmed via Playwright-rendered diff (`render_page.py --mode auto`, `is_spa: true`) that the content *does* exist and populates after full client-side hydration (rendered `extracted_text` grew from 0 to 944 characters, content HTML from 7,748 to 20,892 bytes) — so this is not a broken route, it's a **build-time pre-rendering omission**. `Last-Modified` timestamps on `/tehachapi` and `/properties` are within 5 seconds of each other, confirming both were part of the same deploy — ruling out a stale-cache explanation.

By contrast, sibling pages that *are* correctly pre-rendered on the same deploy include `/tehachapi-home-prices`, `/bakersfield-home-prices`, `/why-tehachapi`, and every `/guide/*` and `/property/*` route — meaning the prerender route list used at build time is simply missing these four community pages.

**Impact:**
- Any crawler or bot that does not execute JavaScript (Bing's default crawl pass, most third-party SEO tools, and — per this site's own robots.txt — the explicitly-allowed `GPTBot`, `PerplexityBot`, `ClaudeBot`, `ChatGPT-User`, `anthropic-ai` AI crawlers) sees a blank page with no content to extract, summarize, or cite. These are exactly the "buy a home in Tehachapi/Bakersfield/California City/Stallion Springs" money pages the business most needs surfaced in AI answers.
- Even for Googlebot (which does render JS eventually), this forces reliance on the second-wave rendering queue, delaying indexing and re-indexing of content changes on these specific pages.
- Core Web Vitals on these routes are effectively undefined/poor from a source standpoint: there is nothing for a non-JS measurement to report as LCP, and even with JS the user sees a blank screen until the full bundle (main `~51KB` + React vendor chunk `~185KB`, brotli-compressed in transit) downloads, parses, hydrates, and — if the page fetches data client-side — completes that fetch.
- This directly matches a warning already logged in the codebase's own `docs/vercel-indexnow-notes.md`: *"Dynamic routes (`/guide/:slug`, `/blog/:slug`) must be prerendered... Google Search Console shows 'Discovered - currently not indexed' when pages are missing from sitemap."* The four routes above are in the sitemap but not in the prerender output — the exact failure mode the team already flagged for a related route type.

**Recommendation (Effort: Medium, 2–4 hrs):** Find the build script that generates the static/prerendered route list (likely a Vite/vite-plugin-ssr or custom prerender script referencing `dist/client/route` per the same notes file) and confirm `/tehachapi`, `/bakersfield`, `/california-city`, and `/stallion-springs` are explicitly included, the same way `/tehachapi-home-prices` etc. are. Re-deploy and re-verify with a raw `curl` (not a browser) that `<div id="root">` contains the full rendered markup. Add a CI/deploy-gate check (e.g., a script that curls every sitemap URL and fails the build if `<div id="root"></div>` matches empty) to prevent regression.

---

## High-Priority Improvements

### H1. Duplicate meta descriptions on "sold" property pages
`/property/sheridan`, `/property/mendiburu`, `/property/alsab`, `/property/windsong` (at minimum) all render the identical meta description: *"Past sale shown for reference; not currently offered for sale."* Titles differ (`{address} | Sold | Harbison Standard`) but body copy is also near-identical templated text ("Past sale shown for reference. This property is not currently offered for sale.") with empty `description` fields in the underlying inventory JSON. This is classic thin/duplicate content across 4+ indexed URLs.

**Recommendation (Effort: Low, 1–2 hrs):** Either (a) write one unique sentence of context per sold property (even just address + sale price + neighborhood, pulled from the data that already exists for active listings), or (b) add `<meta name="robots" content="noindex, follow">` to sold listings and rely on `/past-sales` as the canonical index of past transactions, linking to each sold property from there. Given these are pulled into the sitemap today, option (a) is preferable if the team wants them indexed for long-tail local queries.

### H2. Missing modern security headers
Confirmed via response headers on both static and dynamic-route pages: `Strict-Transport-Security: max-age=63072000` is present (good), but there is no `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, or `Permissions-Policy`. No `vercel.json`/`_headers` file is being served (`404` on direct request), meaning headers are likely coming entirely from Vercel platform defaults rather than an explicit project configuration.

**Recommendation (Effort: Low–Medium, 2–3 hrs):** Add a `headers` block to `vercel.json` (or a `public/_headers` file if using that convention) to set at minimum: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN` (or `frame-ancestors 'self'` via CSP), and a baseline `Content-Security-Policy` scoped to the known third parties in use (`googletagmanager.com`, `formspree.io`, `google-analytics.com`, YouTube embeds if any). This is a ranking-neutral but trust/compliance-relevant fix, and increasingly checked by security-aware AI crawlers and Chrome's own reporting.

### H3. IndexNow implementation only submits one URL per run and doesn't confirm key-file verification
Per `docs/vercel-indexnow-notes.md` (already in-repo) and this audit's own check, the cron (`/api/indexnow`, hourly) submits **`urls[0]`** from the sitemap only — i.e., one URL per hour, meaning full-site coverage of the current 44-URL sitemap would take ~44 hours per cycle, with no logic to prioritize *changed* URLs over already-submitted ones. Separately, IndexNow's standard verification model expects a `<key>.txt` file hosted at the site root (`https://www.harbisonstandard.com/{key}.txt`) — no such file was found at the generic path checked, and the notes file doesn't mention creating one, only setting `INDEXNOW_KEY` as an env var. If the key file isn't deployed, Bing/Yandex/Naver will silently reject submissions after failing key verification.

**Recommendation (Effort: Low, 1–2 hrs):**
1. Confirm `https://www.harbisonstandard.com/<INDEXNOW_KEY-value>.txt` is deployed and returns the raw key as plaintext (this is the #1 cause of "IndexNow submits succeed but nothing happens").
2. Switch the cron from single-URL GET submission to the bulk POST endpoint (`POST https://api.indexnow.org/indexnow` with a JSON body containing `host`, `key`, `keyLocation`, and a `urlList` array of up to 10,000 URLs) so a full-site resubmission happens in one run instead of 44 hourly ticks.
3. Trigger submission on deploy (via a Vercel deploy hook or the existing cron immediately after build) rather than only on a fixed hourly schedule, so new/changed pages (e.g., new property listings) get submitted the same day they go live.

---

## Medium-Priority Improvements

### M1. Sitemap has no `<lastmod>` on any of the 44 URLs
`sitemap.xml` uses only bare `<loc>` entries. Adding `<lastmod>` (accurate to actual content-change dates, not a blanket "today" stamp) helps crawlers prioritize re-crawl of updated pages, particularly the market-data and blog pages that are date-sensitive (e.g., `/blog/kern-county-market-update-september-2026`).
**Effort:** Low (1 hr) — most static-site sitemap generators support this via file mtime or a CMS/content-date field.

### M2. Sold listings remain in the primary sitemap alongside active listings
`/property/pellisier`, `/property/sheridan`, `/property/mendiburu`, `/property/alsab`, `/property/windsong` (status: "Sold" in the embedded inventory JSON) are mixed into `sitemap.xml` with the same weight as active listings like `/property/mariposa` and `/property/wendy`. Combined with H1 above, this dilutes crawl budget toward low-value pages.
**Recommendation:** Either split into a secondary `sitemap-past-sales.xml` (referenced from `/past-sales`) or drop from the sitemap and rely on internal links from `/past-sales`, per the noindex option in H1.

### M3. Case-sensitive routing produces unnecessary 404s
`/Properties` (capitalized) returns `HTTP 404` while `/properties` returns `200`. This is standard for static-file hosting on Vercel (each pre-rendered route is an exact-match file) but is worth a defensive check: confirm no internal links, backlinks, or ad UTM-tagged URLs anywhere use mixed case, and consider a Vercel rewrite rule to lowercase-normalize incoming paths if this has ever been an issue in Search Console's "Page indexing" report (404 URLs).
**Effort:** Low (config-only if pursued).

### M4. No explicit `X-Robots-Tag` header redundancy check for `/api/properties`
`/api/properties` is explicitly allowed in robots.txt (carved out from the `/api/` disallow) and returns raw JSON with `Cache-Control: no-store`. This is likely intentional (to let AI agents/answer engines fetch structured property data directly), but confirm this is a deliberate decision — exposing a live, uncached JSON feed to any crawler has no HTML wrapper, no meta-robots control, and will appear in some crawler logs as a distinct "page." If it's meant purely for client-side app use, consider `Disallow: /api/properties` and instead exposing an intentional, cached, documented feed (e.g., a proper `properties.json` under a designated `/data/` path) for agentic consumption.
**Effort:** Low (decision + config, <1 hr).

---

## Low-Priority / Polish

- **L1.** A handful of meta descriptions run to 203–209 characters (home, `/investing`, `/home-value`, `/moving-from-los-angeles-to-bakersfield`). Google typically truncates around 155–160 characters on desktop SERPs; trim these for cleaner snippet display. (Effort: trivial, batch copy edit.)
- **L2.** `robots.txt` disallows `/hq`, a path that currently 404s — harmless, but confirm this isn't a leftover reference to a since-removed or not-yet-built admin route; clean up if obsolete.
- **L3.** Consider adding `Server-Timing` or at least confirming real-world CWV via Google Search Console's Core Web Vitals report / CrUX, since this audit's CWV findings are source-level (static analysis) rather than field data — no PageSpeed Insights/CrUX API run was available in this session.

---

## Core Web Vitals — Source-Level Assessment

No live Lighthouse/PageSpeed/CrUX run was performed in this session (field data should be pulled separately via Search Console or the `pagespeed_check.py` tool with API access). Based on source inspection:

| Metric | Pre-rendered pages (40/44) | Blank-root pages (4/44: tehachapi, bakersfield, california-city, stallion-springs) |
|---|---|---|
| **LCP** | Likely Good–Needs Improvement. Hero image is preloaded with `fetchpriority="high"` and responsive `media` breakpoints; largest content element is present in the initial HTML. | Likely Poor. No content exists to paint until the ~236KB (main + React vendor, brotli-compressed) JS bundle downloads, parses, executes, and hydrates — and if these pages fetch listing data client-side, LCP waits on that fetch too. |
| **CLS** | Likely Good. `.hero`/`.hero--standard` use fixed/`vw` heights; image containers widely use `aspect-ratio`; explicit `width`/`height` attributes present on key images (e.g., 1400×1000 on the featured listing image). | Same JS bundle applies once rendered; risk is elevated because content injection happens all-at-once post-hydration rather than progressively, but no direct evidence of shift once rendered. |
| **INP** | No direct measurement; React 19 + modest bundle size (51KB app code) is a reasonable baseline. Multi-step lead form (`/#inquiry`) uses client-side state — worth spot-checking on real devices. | Same code path; not meaningfully different once hydrated. |

**Recommendation:** Once C1 is fixed, run `pagespeed_check.py` (or PageSpeed Insights directly) against all four previously-blank routes plus 2–3 control pages to get real LCP/INP/CLS numbers and confirm the fix closed the gap.

---

## JavaScript Rendering Summary

- **Architecture confirmed:** React 19 + Vite SPA with per-route static pre-rendering deployed to Vercel (not a Node/Edge SSR server — files are served as static HTML with `X-Vercel-Cache: HIT`/`Etag`, consistent with a build-time prerender step, not request-time rendering).
- **40 of 44 sitemap routes** correctly ship complete server-rendered HTML — verified content matches what a non-JS client would see.
- **4 of 44 routes** (`/tehachapi`, `/bakersfield`, `/california-city`, `/stallion-springs`) fall back to a pure client-side render — confirmed via Playwright diff (`is_spa: true`, content grows from 7.7KB/0 extracted text to 20.9KB/944 characters of extracted text after full render).
- Client-side routing (React Router or similar) is used for in-app navigation once hydrated; this is standard and not itself a problem since direct-load/deep-link requests are what matters for SEO, and those are handled per-route by the static file server.

---

## Prioritized Action List

| Priority | Issue | Effort | Impact |
|---|---|---|---|
| Critical | C1 — Fix pre-rendering for `/tehachapi`, `/bakersfield`, `/california-city`, `/stallion-springs` | Medium (2–4 hrs) | Restores indexability + AI-crawler visibility + CWV for 4 core local-SEO pages |
| High | H1 — De-duplicate sold-listing meta descriptions / noindex them | Low (1–2 hrs) | Removes duplicate-content signal across 4+ URLs |
| High | H2 — Add CSP / X-Frame-Options / X-Content-Type-Options / Referrer-Policy headers | Low–Medium (2–3 hrs) | Security posture, trust signals |
| High | H3 — Fix IndexNow key-file verification + switch to bulk submission | Low (1–2 hrs) | Faster Bing/Yandex/Naver indexing of new/changed pages |
| Medium | M1 — Add `<lastmod>` to sitemap.xml | Low (1 hr) | Better crawl prioritization |
| Medium | M2 — Separate sold listings from primary sitemap | Low (1 hr) | Crawl-budget efficiency |
| Medium | M3 — Confirm no mixed-case internal links (avoid 404s) | Low (audit only) | Prevents avoidable 404s |
| Medium | M4 — Decide intentional policy on `/api/properties` crawl access | Low (<1 hr) | Clean, deliberate agentic-access policy |
| Low | L1 — Trim long meta descriptions to ~155–160 chars | Trivial | SERP snippet display |
| Low | L2 — Clean up obsolete `/hq` robots.txt entry if unused | Trivial | Housekeeping |
| Low | L3 — Pull real CrUX/PageSpeed field data post-fix | Low | Validates C1 fix impact |
