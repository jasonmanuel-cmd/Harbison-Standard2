# Content Quality Audit — harbisonstandard.com

**Date:** 2026-09-19
**Scope:** 44 URLs from the live `sitemap.xml`, plus source content in `src/content/`
**Framework:** Google Quality Rater Guidelines (Sept 2025), E-E-A-T
**Method:** Raw-HTML fetch of all 44 sitemap URLs + static analysis of 16 markdown articles

---

## Scores

| Metric | Score | Basis |
|---|---:|---|
| **Overall content quality** | **42 / 100** | Strong article volume undermined by delivery, sourcing, and trust defects |
| Experience | 45 / 100 | 20% weight |
| Expertise | 50 / 100 | 25% weight |
| Authoritativeness | 30 / 100 | 25% weight |
| Trustworthiness | 32 / 100 | 30% weight |
| **E-E-A-T weighted** | **39 / 100** | |
| **AI citation readiness** | **34 / 100** | Good `llms.txt`, but no text for non-JS crawlers and zero sourcing |

*Weights are this audit's internal model, not Google's. Google publishes no numeric E-E-A-T weights; it states only that trust is most important.*

---

## 1. Content Strengths

These are real and worth protecting.

1. **No cross-page duplication.** Pairwise 6-gram containment across all 16 articles returned zero pairs above 3%, and no sentence repeats across 3+ files. The body copy is genuinely written per-page, not spun. This is unusual and good.
2. **Metadata is not templated.** `metadata_template.py` across all 44 URLs returns `site_risk: low`, `templated_ratio: 0.0`, and no shared CTA phrases. Descriptions are written per page (see §2.9).
3. **Article volume is adequate against page-type floors.** 14 guides + 2 blog posts, 20,405 words total. 12 of 16 exceed the 800-word service floor; 4 exceed 1,500 words.
4. **`llms.txt` is genuinely well-constructed.** Named agent, license number, contact, response time, service area, and a categorized URL index with a methodology section. Better than most agent sites. (One problem: it makes claims the site does not keep — see §5.)
5. **Article schema is complete and correct.** All 16 articles carry `Article` + `FAQPage` + `BreadcrumbList` + `Person` author. FAQ blocks are present on 16 articles and 5 core pages.
6. **Past-sales transparency.** `/past-sales` labels entries "shown for reference; not currently offered for sale," and `src/data.js:18` carries an internal note not to mislabel transaction sides. That is honest practice.
7. **HTTPS + HSTS**, `max-age=63072000`; HTTP and non-www both 308-redirect. Contact info (phone, email, response-time commitment), DRE license, and Equal Housing notice appear in the footer site-wide.
8. **Readability of the prose that exists is fine.** 13 of 16 articles score Flesch 47–71 on prose-only text. Readability is not this site's problem.

---

## 2. Critical Findings

### 2.1 Hidden text: `display:none` content block on 12 pages — HIGH

`scripts/prerender-metadata.mjs:65` injects:

```js
const contentHtml='<main style="display:none"><h1>'+escape(heading)+'</h1><p>'+escape(content)+'</p></main>';
```

This is live. `https://www.harbisonstandard.com/about` serves exactly one `<h1>` in its HTML — "About Nathanael Harbison" — and that `<h1>` is inside a `<main style="display:none">`. No user ever sees it.

This is text written for crawlers and hidden from users, which is what Google's spam policy calls hidden text. It is made worse by the content itself being generic filler ("Real estate decisions shape your financial future and lifestyle. Nathanael respects that weight...") and by the block carrying a duplicate H1 that conflicts with the React-rendered visible H1.

The code comment claims "Sample content (300+ words)"; actual delivered counts are 78–283 words, so it does not even meet its own stated bar.

Affected: `/about` (239 hidden words), `/open-houses` (283), `/home-value` (244), `/investing` (208), `/moving-from-los-angeles-to-bakersfield` (180), `/past-sales` (175), `/real-estate` (164), `/contact` (134), `/why-tehachapi` (121), `/cheap-land-kern-county` (95), `/tehachapi-home-prices` (79), `/bakersfield-home-prices` (78).

**Fix:** delete the `pageContent`/`pageHeadings` injection entirely. Replace it with real server-side rendering of the React component (the build already runs `renderToString` — wire the actual page output into the slot instead of the hidden `<main>`).

### 2.2 Sixteen pages serve zero visible words to non-JS crawlers — HIGH

Raw-HTML visible word count, excluding the hidden block:

| Page | Visible words in HTML | Hidden-block words |
|---|---:|---:|
| `/about` | 0 | 239 |
| `/real-estate` | 0 | 164 |
| `/investing` | 0 | 208 |
| `/contact` | 0 | 134 |
| `/bakersfield-home-prices` | 0 | 78 |
| `/tehachapi-home-prices` | 0 | 79 |
| `/why-tehachapi` | 0 | 121 |
| `/cheap-land-kern-county` | 0 | 95 |
| `/moving-from-los-angeles-to-bakersfield` | 0 | 180 |
| `/past-sales` | 0 | 175 |
| `/open-houses` | 0 | 283 |
| `/home-value` | 0 | 244 |
| `/tehachapi` | 0 | **0** |
| `/bakersfield` | 0 | **0** |
| `/california-city` | 0 | **0** |
| `/stallion-springs` | 0 | **0** |

Every conversion page and every market page is in this list. The four city pages have no text at all in the HTML — only a title tag, a meta description, and a JS bundle.

Googlebot renders JS and will eventually see the React content. **GPTBot, ClaudeBot, and PerplexityBot largely do not.** `robots.txt` explicitly invites all three. What they collect from `/bakersfield-home-prices` today is 78 words of invisible boilerplate. That is the entire AI-citation footprint of the site's flagship market page.

By contrast, `/guide/*` and `/blog/*` and `/` are prerendered correctly (862–1,901 visible words). The infrastructure to fix this already exists in the same build script.

### 2.3 1,141 numeric claims, zero citations — HIGH

Across all 16 articles:

- **1,141** statistics (percentages and dollar figures)
- **0** outbound citations, source attributions, or reference links
- **9** first-person experience signals in 20,405 words

Not one appreciation rate, median price, rent figure, or cap rate is attributed to anything. This is YMYL financial content — investment returns, foreclosure procedure, probate, tax-auction bidding — held to the highest E-E-A-T bar in the September 2025 QRG. Unsourced quantitative financial claims at this density are a Low-quality signal on their own.

### 2.4 Unverifiable 5.0 AggregateRating on ~20 pages — HIGH

`src/seo.js:52-60` and `src/seo.js:278-286` emit:

```
AggregateRating: ratingValue "5.0", ratingCount 6, reviewCount 6
```

This ships on roughly 20 pages, including `/properties`, `/investing`, `/home-value`, and all four city pages — pages that display no reviews at all.

The six backing testimonials (`src/data.js:29-36`) are anonymous: no names, no dates, no platform, no individual ratings, labeled only "Buyer · Bakersfield," "Seller · Kern County." Nothing is verifiable.

Two separate problems: (a) marking up self-serving reviews of your own business and attaching `AggregateRating` to pages with no visible review content is against Google's review-snippet structured data policy and is manual-action territory; (b) a perfect 5.0 from six unattributable quotes is a weak trust signal for a human rater regardless of markup.

### 2.5 Visible `$X` placeholder in production — HIGH

`src/data/MarketPages.jsx:19` renders a section heading as:

```jsx
<h2>What <em>$X buys.</em></h2>
```

Live on `/bakersfield-home-prices`. An unreplaced template variable is visible to users on a primary market page.

Second instance in `src/content/blog/kern-county-market-update-september-2026.md:70`:

> "Price realistically (comps show $X/acre in your area)"

### 2.6 Factual contradictions across pages — HIGH

The site states four different appreciation rates for the same asset class in the same market, all unsourced:

| Claim | Source |
|---|---|
| Tehachapi land 4–6% annually | `blog/kern-county-market-update`, `guides/tehachapi-homes-with-acreage` |
| Tehachapi land 5–8% annually | `guides/cheap-land-california-city-vs-tehachapi` |
| Tehachapi land 6–8% annually | `guides/owner-financing-land-tehachapi` |

Tehachapi land pricing conflicts across three pages published the same day:

| Claim | Source |
|---|---|
| 0.5 acre: $25K–$65K depending on location | `blog/what-40k-buys-tehachapi` |
| 0.5–1 acre: $55K–$85K | `blog/kern-county-market-update` |
| Standard lot (5K–10K sq ft): $40K–$80K | `/tehachapi-home-prices` |

The third is the most damaging: it prices a ~0.15-acre lot at $40K–$80K while another page prices a *full half-acre* at $25K–$40K.

Bakersfield appreciation is also internally inconsistent within a single guide — `bakersfield-homes-under-400k` answers "3–5% annually" in its FAQ, then lists Seven Oaks at 2–3%, Southwest at 3–4%, and Downtown at 4–6% in its body.

An AI system ingesting this site cannot form a consistent answer about Kern County land prices. Contradiction is the single biggest blocker to being cited.

### 2.7 Arithmetic errors in investment guidance — HIGH

`blog/what-40k-buys-tehachapi-september-2026.md`, "Investment Math at $40K":

- **Build-to-rent: "~$187K total return (91% annualized)."** $187K on a $98K investment over 10 years is roughly 11% annualized, not 91%. The figure is wrong by about 8x — most likely "191% total" garbled into "91% annualized."
- The same line treats the $79K appreciation figure as gain, but $79K is the *ending value* of a $48K basis (a $31K gain), so the total double-counts principal.
- "$108K in rent" over 10 years is gross rent presented as profit, with no deduction for taxes, insurance, maintenance, or vacancy — which the site's own `vacation-rental-investment` guide correctly says you must deduct.
- **Flip: "Sell at $55K (after 10% appreciation)."** 10% on $40K is $44K. $55K is 37.5%.

`blog/kern-county-market-update` also claims 4–6% annual appreciation is "better than most stock returns," which is not true of long-run broad equity returns. On YMYL financial content, that is a misleading claim.

### 2.8 Articles are 84% list and table fragments — MEDIUM-HIGH

Word counts clear the minimums, but the content is mostly fragments rather than prose:

| Article | Total words | Prose-sentence words | List/table lines |
|---|---:|---:|---:|
| `tehachapi-vs-bakersfield` | 1,677 | **63** | 82% |
| `kern-county-investment-properties` | 1,123 | **104** | 85% |
| `vacation-rental-investment-kern-county` | 2,029 | **110** | 85% |
| `bakersfield-homes-under-400k` | 807 | **108** | 83% |
| `cheap-land-california-city-vs-tehachapi` | 993 | **129** | 70% |
| **Corpus total** | **20,405** | **3,249 (16%)** | **~72% avg** |

`tehachapi-vs-bakersfield` is a 1,677-word page containing 63 words of actual connected prose. This is the structural signature the Sept 2025 QRG flags as low-quality AI output: specificity replaced by enumeration, no argument, no synthesis, no voice.

### 2.9 Metadata — MEDIUM (templating is NOT a problem here)

Ran `metadata_template.py` across all 44 URLs. **The site passes the templating check cleanly:**

```
site_risk: low   templated_ratio: 0.0   templated_count: 0/44
shared_cta_phrases: {}   site_flags: []
```

Only 3 pages draw any flag at all, each `description-echoes-title` at medium severity: `/contact`, `/investing`, `/moving-from-los-angeles-to-bakersfield`. No page is classified as templated, and there is no shared closing CTA across the site — the strongest single indicator of a bulk metadata job is absent.

Descriptions are written per page. Treat this as a **strength**, consistent with the zero body-copy duplication in §1.

What remains are mechanical length and duplication defects, independent of templating:

- **Three property descriptions are far over length:** `/property/wendy` **1,373 chars**, `/property/mariposa` **818**, `/property/chalet` **783**. These are raw listing remarks piped straight into the meta description field and will be truncated in SERPs.
- **Four identical descriptions** on past-sale property pages (`/property/sheridan`, `/mendiburu`, `/alsab`, `/windsong`): "Past sale shown for reference; not currently offered for sale." Factually correct but non-differentiating.
- **17 titles exceed 60 characters** (max 79: `/moving-from-los-angeles-to-bakersfield` and `/guide/tehachapi-vs-bakersfield`).
- **Six descriptions under 70 chars**, including `/guides` (63) and `/blog` (65).

> *Correction note: an earlier pass of this audit used a looser in-house token-overlap threshold and reported `templated_ratio: 0.64`. That heuristic over-triggered — a description legitimately restating its page's topic is normal writing, not templating. The canonical script's result above supersedes it.*

### 2.10 Bulk-publication freshness signal — MEDIUM

All 16 articles carry `published: 2026-09-14` and `updated: 2026-09-14`. Sixteen articles, one day, and not one has been touched since. No article has an update distinct from its publish date.

This directly contradicts `llms.txt`, which states market pages are "Updated monthly."

---

## 3. E-E-A-T Breakdown

### Experience — 45/100 (weight 20%)
**Present:** Real bio with a specific, non-generic detail (oil-field and service-industry background, `src/Pages.jsx:11`). `/past-sales` with verified transactions. Active YouTube channel linked.
**Missing:** No years in business anywhere. No transaction count or volume. Only **9 first-person experience markers across 20,405 words** — the guides are written in a detached third-person advisory register with no "I walked this parcel," no client stories, no photos from the field. The one page that should carry the most first-hand signal, `/about`, delivers zero words to non-JS crawlers. Guides use "we" throughout for a solo agent, which reads as generic marketing rather than personal experience.

### Expertise — 50/100 (weight 25%)
**Present:** REALTOR® with DRE #02059393 in the footer, `llms.txt`, and `EducationalOccupationalCredential` schema. Topic selection shows genuine local knowledge — preforeclosure/NOD, tax-defaulted auctions, owner financing, inherited property, Stallion Springs. These are the right topics for Kern County.
**Missing:** The demonstration undercuts the credential. 1,141 unsourced figures, the §2.7 arithmetic errors, and the §2.6 contradictions are what a quality rater would find when checking accuracy. No named brokerage or broker of record anywhere on the site — California salespersons must identify their responsible broker; "Harbison Standard" is a marketing name, not a licensed brokerage identification.

### Authoritativeness — 30/100 (weight 25%)
**Present:** Four social profiles (Facebook, Instagram, YouTube, LinkedIn). Consistent NAP.
**Missing:** **Zero outbound citations in the entire content corpus.** No board or association membership shown (CAR, NAR, local Board of REALTORS®). No MLS affiliation identified. No press, awards, or third-party recognition. No named brokerage. Nothing external corroborates any claim on this site. This is the weakest factor and the one with the clearest path to improvement.

### Trustworthiness — 32/100 (weight 30%)
**Present:** HTTPS + HSTS. Phone, email, response-time commitment, Equal Housing Opportunity, DRE number. Honest past-sales disclaimer. Per-page written metadata (§2.9).
**Missing / negative:**
- Hidden `display:none` crawler text (§2.1) — the most serious trust defect on the site.
- Unverifiable 5.0 `AggregateRating` on ~20 pages (§2.4).
- **No privacy policy** — `/privacy`, `/privacy-policy`, `/terms`, `/disclaimer`, `/accessibility` all return 404. The site collects names, emails, phone numbers, budgets, and timelines through four separate lead forms with no privacy policy. That is a CCPA exposure in California, not just an SEO issue.
- **14 of 14 guides carry no legal or tax disclaimer**, while advising on probate, inherited property, tax-defaulted auctions, preforeclosure, and investment returns.
- Visible `$X` placeholder on a market page (§2.5).
- No broker of record identified.

---

## 4. Thin & Low-Quality Pages

**Tier 1 — zero indexable text (16 pages):** all pages in §2.2. `/tehachapi`, `/bakersfield`, `/california-city`, `/stallion-springs` are worst — nothing at all, and their rendered React source is thin too (`TehachapiBuy.jsx` contains ~149 words of copy, `StalionSpringsCommunities.jsx` ~254).

**Tier 2 — thin in rendered HTML:**

| Page | Visible words | Floor | Gap |
|---|---:|---:|---|
| `/blog` | 122 | — | Index page, 2 posts only |
| `/property/sheridan`, `/mendiburu`, `/alsab`, `/windsong` | 233 each | 300 | Below product-page floor; near-identical structure |
| `/guides` | 274 | — | Index for 14 guides, 274 words |
| `/properties` | 311 | — | Primary listings page |
| `/` (homepage) | 1,049 | 500 | **Passes** |

**Tier 3 — passes word count, fails substance:** the §2.8 articles. `tehachapi-vs-bakersfield` (1,677 words / 63 prose), `kern-county-investment-properties` (1,123 / 104), `vacation-rental-investment-kern-county` (2,029 / 110).

**Note on minimums:** these are topical coverage floors, not targets. Google has confirmed word count is not a direct ranking factor. `/guide/tehachapi-vs-bakersfield` demonstrates why — it clears 1,500 words and is still thin.

---

## 5. Contradiction Detection (AI Citation Blockers)

Beyond §2.6, `llms.txt` makes three claims the site does not honor. Because `llms.txt` is the document AI crawlers read first, these are high-leverage errors:

| `llms.txt` claim | Reality |
|---|---|
| "Market data sourced from local MLS and verified sales records" | 0 citations, 0 MLS attributions in 20,405 words |
| Market pages provide "Median price, days on market, inventory... Updated monthly" | Neither market page contains a median price, a days-on-market figure, or an inventory count — only qualitative bands. Nothing has been updated since 2026-09-14. |
| "Property details and photographs are current as of the stated date" | No stated date appears on property pages |

An AI system that checks `llms.txt` against the pages it describes will find the index overstates the content. That materially damages citation trust.

---

## 6. Readability

**Readability is not a significant problem.** Prose-only Flesch across the 16 articles:

- 13 of 16 score **47–71** (fairly difficult to fairly easy) — appropriate for consumer real estate.
- Best: `what-40k-buys-tehachapi` 70.6, `first-time-homebuyer-kern-county` 68.4, `bakersfield-homes-under-400k` 66.8.
- Two outliers: `vacation-rental-investment-kern-county` **16.0** and `bakersfield-homes-with-shop` **18.4** (avg sentence 19.3 words). Both are dense with dollar figures and multi-clause qualifiers.

**Heading hierarchy is clean.** Every rendered page has exactly one visible H1, and H2/H3 nesting is correct with no skipped levels. The only H1 defect is the duplicate hidden H1 from §2.1.

**Paragraph length is fine where prose exists** — average 12–22 words, and only the property pages exceed 80 words in a single paragraph (`/property/wendy` has a **211-word** paragraph, `/property/chalet` 126, `/property/mariposa` 122 — all unbroken listing remarks).

**Formatting is over-corrected.** The problem is the inverse of the usual one: at ~72% list/table lines, the guides need *more* prose, not more bullets.

---

## 7. Recommendations (priority order)

### P0 — do this week
1. **Remove the `display:none` block.** Delete `pageContent`/`pageHeadings` from `scripts/prerender-metadata.mjs:38-81`. Hidden crawler text is a spam-policy violation and it is the highest-risk item on this site.
2. **Server-render the 16 empty pages.** The build already imports `renderToString`; route the real component output into the HTML slot the way `/guide/*` and `/blog/*` already do. This single change converts 16 zero-word pages into full pages for both Google's first pass and every AI crawler.
3. **Remove `AggregateRating` from `src/seo.js:52` and `:278`** until you have verifiable, attributed reviews on a page that displays them. Then scope it to that page only.
4. **Fix the `$X` placeholders** — `src/data/MarketPages.jsx:19` and `blog/kern-county-market-update-september-2026.md:70`.
5. **Publish a privacy policy.** Four lead forms collect PII with no policy; this is a CCPA issue before it is an SEO issue. Add terms and an accessibility statement at the same time.

### P1 — this month
6. **Correct the §2.7 math**, especially the "91% annualized" claim, and remove the "better than most stock returns" comparison.
7. **Reconcile the §2.6 contradictions.** Pick one appreciation figure and one land price table per market, source them, and propagate. Publish the numbers in a single data file the pages import, so they cannot drift again.
8. **Cite the 1,141 figures.** Even partial coverage transforms Authoritativeness. Attach Kern County Assessor, California Association of REALTORS® monthly reports, Census ACS, and your own MLS pulls with pull dates.
9. **Add legal/tax disclaimers** to the 14 guides, specifically `inherited-house-bakersfield`, `tax-defaulted-properties-kern-county`, and `preforeclosure-properties-kern-county`.
10. **Name the brokerage and broker of record** in the footer alongside the DRE number.

### P2 — next quarter
11. **Convert lists back to prose.** Target 40–50% prose lines, from the current 16%. Start with `tehachapi-vs-bakersfield` (63 prose words), `kern-county-investment-properties` (104), `vacation-rental-investment` (110).
12. **Inject first-hand experience.** Nine first-person markers in 20,405 words is the core Experience gap. Add deal-specific anecdotes, original photos of parcels walked, and named transaction outcomes. This is also the cheapest defense against being classified as low-quality AI content.
13. **Trim the three oversized property meta descriptions** to 150–160 chars and differentiate the four identical past-sale descriptions. Shorten the 17 over-long titles. Do *not* rewrite descriptions wholesale — the templating check is clean and the current per-page copy is an asset.
14. **De-anonymize testimonials** — first name, last initial, city, month. Then pursue Google Business Profile reviews, which are third-party verifiable and would legitimately support review markup.
15. **Establish a real update cadence.** Set genuine `updated` dates when content actually changes, and either deliver the monthly market-data refresh `llms.txt` promises or amend the claim.
16. **Expand the four city pages** to the 500–600 word location-page floor with unique local substance.

---

## 8. Structured Findings

```json
{
  "category": "Content Quality",
  "score": 42,
  "eeat": {"experience": 45, "expertise": 50, "authoritativeness": 30, "trustworthiness": 32, "weighted": 39},
  "ai_citation_readiness": 34,
  "pages_analyzed": 44,
  "findings": [
    {"id": "hidden-text-prerender", "severity": "high", "count": 12,
     "title": "display:none <main> with duplicate H1 injected into prerendered HTML",
     "evidence": "scripts/prerender-metadata.mjs:65", "pages": ["/about","/real-estate","/investing","/contact","/bakersfield-home-prices","/tehachapi-home-prices","/why-tehachapi","/cheap-land-kern-county","/moving-from-los-angeles-to-bakersfield","/past-sales","/open-houses","/home-value"]},
    {"id": "zero-visible-text-raw-html", "severity": "high", "count": 16,
     "title": "Zero visible words in raw HTML; invisible to non-JS AI crawlers explicitly allowed in robots.txt"},
    {"id": "unsourced-claims", "severity": "high", "metric": {"statistics": 1141, "citations": 0, "first_person_signals": 9, "corpus_words": 20405},
     "title": "1,141 numeric YMYL financial claims with zero citations"},
    {"id": "unverifiable-aggregate-rating", "severity": "high", "count": 20,
     "title": "AggregateRating 5.0/6 on pages with no visible reviews; 6 anonymous testimonials",
     "evidence": "src/seo.js:52, src/seo.js:278, src/data.js:29"},
    {"id": "visible-placeholder", "severity": "high", "count": 2,
     "title": "Unreplaced $X template variable rendered to users",
     "evidence": "src/data/MarketPages.jsx:19, src/content/blog/kern-county-market-update-september-2026.md:70"},
    {"id": "factual-contradictions", "severity": "high", "count": 3,
     "title": "Tehachapi land appreciation stated as 4-6%, 5-8%, and 6-8%; land pricing conflicts across 3 pages"},
    {"id": "arithmetic-errors", "severity": "high", "count": 4,
     "title": "Investment math errors incl. '91% annualized' (actual ~11%)",
     "evidence": "src/content/blog/what-40k-buys-tehachapi-september-2026.md:124-132"},
    {"id": "fragment-heavy-content", "severity": "medium-high", "count": 16,
     "metric": {"prose_ratio": 0.16, "avg_list_ratio": 0.72},
     "title": "Articles are 84% list/table fragments; 3,249 prose words in 20,405"},
    {"id": "missing-legal-pages", "severity": "high",
     "title": "No privacy policy, terms, or disclaimer; 4 PII-collecting lead forms",
     "evidence": "/privacy, /privacy-policy, /terms, /disclaimer, /accessibility all HTTP 404"},
    {"id": "missing-ymyl-disclaimers", "severity": "medium-high", "count": 14,
     "title": "No legal/tax disclaimer on guides covering probate, tax auctions, preforeclosure"},
    {"id": "llms-txt-overstates", "severity": "medium-high", "count": 3,
     "title": "llms.txt claims MLS sourcing, monthly updates, and stated dates that pages do not deliver"},
    {"id": "oversized-meta-descriptions", "severity": "medium", "count": 3,
     "title": "Raw listing remarks in meta description: 1373, 818, 783 chars",
     "pages": ["/property/wendy","/property/mariposa","/property/chalet"]},
    {"id": "duplicate-meta-descriptions", "severity": "medium", "count": 4,
     "title": "Identical past-sale descriptions",
     "pages": ["/property/sheridan","/property/mendiburu","/property/alsab","/property/windsong"]},
    {"id": "bulk-publication", "severity": "medium", "count": 16,
     "title": "All 16 articles published 2026-09-14 with updated == published; never revised"},
    {"id": "thin-pages", "severity": "medium", "count": 7,
     "title": "Below page-type floor in rendered HTML",
     "pages": ["/property/sheridan","/property/mendiburu","/property/alsab","/property/windsong","/guides","/properties","/blog"]},
    {"id": "missing-brokerage-disclosure", "severity": "medium",
     "title": "No brokerage name or broker of record identified site-wide"},
    {"id": "title-length", "severity": "low", "count": 17,
     "title": "Titles exceed 60 characters (max 79)"},
    {"id": "long-paragraphs", "severity": "low", "count": 3,
     "title": "Unbroken listing-remark paragraphs of 211, 126, and 122 words"}
  ],
  "metadata_template_check": {
    "tool": "metadata_template.py", "method": "heuristic",
    "pages_checked": 44, "site_risk": "low", "templated_ratio": 0.0, "templated_count": 0,
    "shared_cta_phrases": {}, "site_flags": [],
    "description_echoes_title": ["/contact","/investing","/moving-from-los-angeles-to-bakersfield"],
    "verdict": "PASS - metadata is written per page, not templated"
  },
  "strengths": [
    "Zero cross-page duplication (6-gram containment <3% on all pairs)",
    "Metadata passes templating check: site_risk low, templated_ratio 0.0, no shared CTA",
    "Well-formed llms.txt with license, contact, and categorized URL index",
    "Complete Article + FAQPage + BreadcrumbList + Person schema on all 16 articles",
    "Clean heading hierarchy, one visible H1 per page, no skipped levels",
    "Prose readability appropriate (Flesch 47-71 on 13 of 16 articles)",
    "HTTPS + HSTS; HTTP and non-www both 308-redirect",
    "Honest past-sales disclosure",
    "Guide/blog/homepage templates already prerender correctly"
  ]
}
```
