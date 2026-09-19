# SXO Audit — harbisonstandard.com

**Target:** https://www.harbisonstandard.com
**Market:** Kern County, CA (Bakersfield, Tehachapi, California City, Stallion Springs)
**Audit date:** 2026-09-19
**Method:** Playwright-rendered DOM (`render_page.py --mode always`) + live SERP sampling (8 query clusters) + source review of the prerender pipeline

---

## SXO Gap Score: 40 / 100

> This is the **SXO Gap Score**, not an SEO Health Score. It measures how well the site matches what Google actually rewards for its target queries.

| Dimension | Score | Evidence |
|---|---|---|
| Page Type | 5 / 15 | City pages are 228–280-word brochures; every SERP competitor is a live-inventory portal with 300–660 listings |
| Content Depth | 7 / 15 | Guides median 1,006 words (adequate); money pages 104–280 words (critically thin) |
| UX Signals | 7 / 15 | `/bakersfield`, `/tehachapi`, `/about`, `/investing`, `/cheap-land-kern-county` have **zero forms** |
| Schema | 9 / 15 | Broad coverage, but self-serving `AggregateRating` + deprecated `FAQPage` reliance + no listing schema |
| Media | 5 / 15 | City pages ship 0 images in HTML; no video embeds despite an active YouTube channel |
| Authority | 4 / 15 | Site does **not appear** in its own brand SERP; entity conflict with Compass/Encinitas profile |
| Freshness | 3 / 10 | All 14 guides carry identical `published` **and** `updated` dates (2026-09-14); `htmldate` extracted no publication date from any rendered page |

---

## PRIMARY FINDING — CRITICAL: Indexable content is hidden with `display:none`, and the four city money-pages have none at all

This is the lead finding. It is a build-pipeline defect, not a copywriting problem.

**`scripts/prerender-metadata.mjs:65`**

```js
const contentHtml='<main style="display:none"><h1>'+escape(heading)+'</h1><p>'+escape(content)+'</p></main>';
```

Every static route's only server-rendered `<h1>` and body copy is wrapped in an inline `display:none`. That is the exact pattern Google's spam policies name as hidden text. Three compounding problems:

**1. The hidden H1 contradicts the H1 users actually see.** Verified live, raw HTML vs. rendered DOM:

| Route | Prerendered H1 (hidden, what crawlers get first) | Rendered H1 (what users see) |
|---|---|---|
| `/home-value` | Find Your Home's Value | What is your home worth? |
| `/contact` | Let's Connect | Start the conversation here. |
| `/about` | About Nathanael Harbison | Real estate guidance with a local perspective. |
| `/real-estate` | Sell Your Home | Sell with a clear plan and the right perspective. |

Hidden text that differs from visible text is a cloaking signal. It also means the keyword-bearing H1s (`Sell Your Home`, `About Nathanael Harbison`) are the ones Google is told not to show, while the visible H1s are brand-voice phrases with no keyword.

**2. The hidden copy is self-identified placeholder.** Line 37 of the same file: `// Sample content (300+ words) for static routes without React rendering`. The `pageContent` block (lines 38–53) is generic filler with no prices, no dates, no neighborhood names, no sources — and it is the primary text Google sees pre-render.

**3. The four highest-commercial-intent pages were never added to the map.** `pageHeadings` and `pageContent` contain no entries for `/bakersfield`, `/tehachapi`, `/california-city`, or `/stallion-springs`. Confirmed live:

| URL | Raw HTML words | Raw H1 count | Rendered words | `is_spa` |
|---|---|---|---|---|
| `/bakersfield` | **9** | **0** | 280 | true |
| `/tehachapi` | **9** | **0** | 228 | true |

These pages target `Homes for Sale in Bakersfield, CA` and `Homes for Sale in Tehachapi, CA` — the most valuable local terms the site owns — and they deliver nine words and no heading to a non-rendering crawler.

**Severity: CRITICAL.** Fix this before any content work; every other recommendation compounds off it.

---

## 1. SERP Backwards Analysis

Eight query clusters sampled. Page-type consensus across the top 10 of each:

| Query cluster | Dominant SERP page type | Consensus | Target's page | Mismatch |
|---|---|---|---|---|
| `homes for sale Tehachapi CA` | IDX inventory portal (Zillow 658, Trulia 659, Redfin 570 listings) | 10/10 (100%) | `/tehachapi` — 228-word brochure, 0 listings inline | **CRITICAL** |
| `Tehachapi realtor / real estate agent` | Agent directory (Zillow, Homes.com, RE/MAX, C21, Coldwell, Yelp) + 2 local sites | 8/10 directory (80%) | `/about` — bio page, 0 forms | **HIGH** |
| `Bakersfield realtor best real estate agent` | Ranking/directory (RealTrends, Zillow, Yelp, FastExpert, US News) | 10/10 (100%) | `/about` | **CRITICAL** |
| `sell my house as is Bakersfield` | Cash-buyer conversion LP (Osborne, Kernvestors, Capital House Buyers, Cash for Keys Kern) | 9/10 (90%) | `/guide/sell-home-as-is-kern-county` — 1,698-word article | **HIGH** |
| `Bakersfield housing market home prices 2026` | Data/stat hub with live figures (Zillow, Redfin, Houzeo, Norada) | 9/10 (90%) | `/bakersfield-home-prices` — qualitative ranges, no data | **HIGH** |
| `cheap land Kern County under 50k` | Faceted land marketplace (LandSearch 534, LandWatch 2,079, Trulia 2,325) | 10/10 (100%) | `/cheap-land-kern-county` — 104 raw words | **CRITICAL** |
| `Tehachapi vs Bakersfield` | Comparison guide / cost-of-living calculator | 7/10 (70%) | `/guide/tehachapi-vs-bakersfield` — 1,495 words | **ALIGNED** |
| `moving from Los Angeles to Bakersfield` | Mover-cost calculator + relocation guide | 6/10 (60%) | `/moving-from-los-angeles-to-bakersfield` | **MEDIUM** |

### Search intent breakdown

- **Commercial / transactional** (`homes for sale`, `cheap land`, `sell as-is`, `realtor`): SERP demands either live inventory or an instant-offer conversion mechanism. The site offers neither — it offers prose.
- **Informational** (`Tehachapi vs Bakersfield`, `first time home buyer`, `market update`): the site is genuinely competitive here. This is the only cluster where it can win near-term.
- **Navigational** (brand): **failing outright** — see §5.

### Featured snippet opportunities

Every sampled SERP returned definition-style and numeric answers Google is already extracting from competitors:

- "cost of living in Tehachapi is **2.3% more expensive** than Bakersfield" (bestplaces) — the site's own `/guide/tehachapi-vs-bakersfield` covers this topic but ships no extractable comparison table.
- "$2,186 average cost to move from LA to Bakersfield" (moveBuddha).
- "median $390,000, up 0.78% YoY, **56 days** on market, **1.14-month** supply, **98.67%** of asking" (Bakersfield market).
- "Tehachapi median sale price **$439,450**, up 6% YoY, **90 days** on market" (Redfin).
- "average cheap-land listing **$24,310**, **$3,228/acre**, 534 properties" (LandSearch).

None of these numbers appear on the target site. Snippet capture requires a `<table>` or a 40–55-word direct-answer paragraph immediately under a question-phrased H2.

### Rich results potential

| Type | Status | Note |
|---|---|---|
| `FAQPage` | Present on homepage, `/contact`, and all 14 guides | **Will not render rich results.** Google restricted FAQ rich results to authoritative government/health sites in Aug 2023. This markup is currently inert. |
| `AggregateRating` | `5.0`, `ratingCount: 6`, on `RealEstateAgent` **and** `LocalBusiness` | **Policy risk.** Self-serving review markup on a business's own page is ineligible and is a known structured-data manual-action trigger. Recommend removal or migration to a third-party-sourced source. |
| `BreadcrumbList` | Present sitewide | Working — keep. |
| `Article` | On guides/blog only | Working. |
| `RealEstateListing` / `Residence` / `Offer` | **Absent** | The single biggest rich-result gap. `/properties` and all 8 `/property/*` pages carry a custom `propertySchema` but no listing-specific type mapped to the city pages. |
| `VideoObject` | **Absent** | A YouTube channel is linked in `sameAs` but no video is embedded or marked up anywhere. |
| `Event` | **Absent** | `/open-houses` exists and is the natural home for `Event` markup. |

---

## 2. User Stories (each tied to an observed SERP signal)

**US-1 — Awareness.** *As someone priced out of LA, I want to know what my money actually buys in Bakersfield so I can decide whether the move is worth it.*
→ Signal: SFGate "LA, SF, and OC residents are fleeing to California's most derided city" ranks top-10; moveBuddha cost-route pages dominate.

**US-2 — Consideration.** *As a buyer choosing between two Kern County towns, I want a side-by-side of climate, cost, commute, and schools.*
→ Signal: bestplaces.net occupies three separate top-10 slots for `Tehachapi vs Bakersfield` with pure comparison-calculator pages.

**US-3 — Decision.** *As a seller with an inherited or damaged property, I want a cash number today without repairs or showings.*
→ Signal: 9 of 10 results for `sell my house as is Bakersfield` are cash-buyer landing pages promising "offer in 24 hours, no fees, we cover closing costs."

**US-4 — Consideration.** *As a budget land investor, I want to browse priced parcels and know whether owner financing is available.*
→ Signal: LandSearch surfaces "534 cheap properties, average $24,310"; Landmodo ranks on "owner financing — no bank, no credit check, from $199/month."

**US-5 — Decision.** *As a first-time buyer, I want to know whether I qualify for down-payment assistance in Kern County.*
→ Signal: CalHFA, GSFA Platinum, MyHome, and Dream For All all rank; a Bakersfield mortgage broker ranks with "CalHFA in Kern County: Why Some First-Time Buyers Get Funded and Others Don't."

**US-6 — Decision.** *As someone hiring an agent, I want third-party proof this person has actually closed deals in my town.*
→ Signal: `Bakersfield realtor` returns 10/10 review-directory results; RealTrends, Zillow, Yelp, FastExpert, US News all rank on verified-review inventory.

---

## 3. Persona Scoring (sorted weakest first — fix in this order)

| # | Persona | Relevance | Clarity | Trust | Action | **Total** |
|---|---|---|---|---|---|---|
| 1 | **Local Market Researcher** | 12 | 11 | 7 | 9 | **39** |
| 2 | **Tehachapi Lifestyle Buyer** | 13 | 10 | 9 | 9 | **41** |
| 3 | **Agent-Selection Shopper** | 12 | 14 | 8 | 10 | **44** |
| 4 | **Budget Land Investor** | 14 | 12 | 9 | 9 | **44** |
| 5 | **LA Relocation Buyer** | 15 | 13 | 11 | 10 | **49** |
| 6 | **Distressed / As-Is Seller** | 18 | 15 | 10 | 8 | **51** |
| 7 | **First-Time Kern County Buyer** | 16 | 15 | 12 | 9 | **52** |

*(25 points available per column.)*

### 1. Local Market Researcher — 39/100 (weakest)
Lands on `/bakersfield-home-prices` or `/tehachapi-home-prices`. Gets qualitative ranges ("entry-level," "premium," "moderate to upscale") with no figure, no date, and no source — while Zillow, Redfin, and Houzeo all publish median price, YoY change, days on market, and months of supply.
**Fix:** Convert both price pages to a dated data table (median, YoY, DOM, months of supply, list-to-sale ratio, by neighborhood), stamp "Updated [month]," and add a "Get the monthly Kern County report" email capture. Cite the MLS/county source explicitly.

### 2. Tehachapi Lifestyle Buyer — 41/100
`/tehachapi` renders 228 words, zero images, zero forms — only two links (`/properties`, `/contact`). The SERP winner for this intent (`bhhsassociated.com` "Ultimate Guide to Living in Tehachapi") is a long-form lifestyle guide with photos.
**Fix:** Rebuild `/tehachapi` as a town hub: photo set, Tehachapi vs. Bakersfield climate/snow data, named school ratings, commute time to Bakersfield (35 mi / 40–45 min), sub-community breakouts (Bear Valley Springs, Golden Hills, Stallion Springs, Alpine Forest Park), then live listings.

### 3. Agent-Selection Shopper — 44/100
`/about` renders 739 words and **zero forms**. Its H1 is "Real estate guidance with a local perspective" — no name, no market, no credential. Worse, the trust check happens off-site (see §5).
**Fix:** H1 → "Nathanael Harbison — REALTOR®, Kern County (DRE #02059393)". Name the brokerage. Add closed-transaction counts by city, individual client reviews with attribution, and an inline contact form.

### 4. Budget Land Investor — 44/100
`/cheap-land-kern-county` ships 104 words of raw HTML against marketplaces listing 43–534 priced parcels. The supporting guides (`tehachapi-land-under-50k` 686 words, `owner-financing-land-tehachapi` 1,030 words) are decent but orphaned from any inventory.
**Fix:** Add a priced parcel table with acreage, zoning, utility access, and legal access. Build an "owner-financed land list" email capture — this directly counters Landmodo's ranking hook.

### 5. LA Relocation Buyer — 49/100
Dedicated page exists (good), but its indexable copy is the hidden generic filler ("40-60% less") with no cited figures. Competitors rank with concrete numbers and named neighborhoods (Rosedale, Seven Oaks).
**Fix:** Add a real cost-comparison table (LA vs. Bakersfield vs. Tehachapi: median price, property tax at ~1.1%, utilities, commute, move cost), plus a downloadable relocation checklist behind an email capture.

### 6. Distressed / As-Is Seller — 51/100
Strongest topical asset (1,698 words, covers inherited/probate/damage/relocation). But it is an *article* competing against *offer forms*. The guide's only CTA is a phone number; the four `<input>` elements on the page are sitewide footer fields, not a seller form.
**Fix:** Keep the article, but prepend an above-the-fold "Get your as-is number" address-capture block. Add a net-proceeds comparison table (cash-buyer offer vs. as-is MLS listing) — that table is the differentiator no cash-buyer LP will ever publish, and it is highly snippet-eligible.

### 7. First-Time Kern County Buyer — 52/100
Deepest asset on the site at 1,875 words.
**Fix:** Add CalHFA / GSFA Platinum / MyHome / Dream For All specifics with 2026 Kern County income limits, plus a lender referral handoff and a DPA eligibility mini-quiz.

---

## 4. Page Alignment & Conversion Path

Measured on the **rendered** DOM:

| Page | Rendered words | Forms | Inputs | `tel:` links | Verdict |
|---|---|---|---|---|---|
| `/` (home) | 1,108 | 0 | 0 | yes | Brand-first; H1 is the slogan "It's not what you do. It's how you do it." — zero keyword value |
| `/bakersfield` | 280 | **0** | **0** | 2 | No conversion path at all |
| `/tehachapi` | 228 | **0** | **0** | 2 | No conversion path at all |
| `/properties` | 237 (raw) | 1 | 12 | yes | Best-converting page; only 2 listings visible |
| `/home-value` | 382 | 0 | 4 | 3 | Highest-intent seller page — **no `<form>` element** |
| `/contact` | 652 | 1 | 8 | 6 | Strongest, correctly built |
| `/about` | 739 | **0** | **0** | — | No capture on the trust page |
| `/real-estate` (sell) | 1,283 | 0 | 4 | — | Good depth, weak capture |
| `/investing` | 214 (raw) | 0 | 0 | — | Thin, no capture |
| `/cheap-land-kern-county` | 104 (raw) | 0 | 0 | — | Thin, no capture |
| `/guides` index | 198 | 0 | 0 | yes | 14 guides linked — good hub |

**Conversion findings:**

1. `/home-value` is the single highest-intent page on a real estate site and it has **no `<form>`**. Four bare inputs with no form wrapper means no native submit, no validation, and likely no analytics event. Fix first.
2. Six of eleven audited pages have zero capture mechanism.
3. Phone is well exposed — `tel:+16614727499` is sitewide. Good.
4. Contact email is `nate85.realtor@gmail.com`. A free-mail address on a licensed professional's site is a measurable trust drag against SERP competitors on branded domains. Move to `nathanael@harbisonstandard.com`.
5. No brokerage is named anywhere on the site or in schema. California DRE advertising rules require it, and its absence is an E-E-A-T gap on every page.

---

## 5. Competitive SERP Positioning

### Brand SERP failure — HIGH severity

Query: `Nathanael Harbison Harbison Standard real estate Kern County`. **harbisonstandard.com does not appear in the top 10.** What ranks instead:

1. Compass agent profile — titled "**Encinitas** Real Estate Agent," describing him as "now San Diego"
2. LinkedIn
3. RateMyAgent
4. Castle Oak Homes member page
5. Compass Kern County and California City directory pages
6. **Two GitHub repositories** (`jasonmanuel-cmd/Harbison-Standard2`, `private-seller-system`) — this site's own source code outranks the site

Two compounding problems:

- **Entity conflict.** Google's strongest signal about this person says Encinitas/San Diego; the site says Tehachapi/Kern County. That contradiction suppresses local relevance for every Kern County query.
- **Entity leakage.** A separate "Harbison Standard Private Sale Program" concept surfaced from third-party sources and is not represented on the site at all — the brand's own definition is being written elsewhere.

**Fix:** Align the Compass profile to Kern County; add `sameAs` links to Compass, RateMyAgent, and the Zillow profile in the `RealEstateAgent` schema; make the GitHub repositories private; publish a Private Sale Program page on the site so the brand owns its own concept.

### Competitive structure by cluster

| Cluster | Who owns it | Can a solo agent site win? |
|---|---|---|
| `homes for sale [city]` | Zillow / Redfin / Trulia / Homes.com / Movoto | No — not without IDX inventory |
| `[city] realtor` | Zillow, Homes.com, RE/MAX, C21, Coldwell, Yelp | **Partially** — `theresamannco.com` and `tehachapirealestate.com` both rank top-10 for `Tehachapi realtor`. Proof of concept. |
| `[city] home prices` | Zillow, Redfin, Houzeo, Norada, a local mortgage broker's blog | **Yes** — a local mortgage broker ranks twice on pure content. Beatable. |
| `sell as-is` | Local cash-buyer LPs | **Yes** — all competitors are thin LPs; a 1,698-word guide + offer form should win |
| `cheap land` | LandSearch, LandWatch, Land.com, Landmodo | No head terms; **yes** on owner-financing and parcel-specific long-tail |
| `[city A] vs [city B]` | bestplaces, brokerage blogs, mentorsmoving | **Yes** — already competitive |

### Content gaps (present in top-10 competitors, absent on target)

- Live, filterable inventory with photos, beds/baths, price, and map
- Any dated market statistic whatsoever
- Named neighborhood pages (Rosedale, Seven Oaks, Westchester, Laurelwood, Ming Ave, Bear Valley Springs, Golden Hills, Alpine Forest Park) — the first five are *mentioned* as H3s on `/bakersfield` but have no destination pages
- Third-party-verified review inventory
- Cost-of-living and commute calculators
- School ratings
- Property-tax and closing-cost breakdowns (Kern is ~1.1% + $1.10/$1,000 transfer tax)
- Video — a linked YouTube channel with zero on-site embeds

### Format differentiation opportunities

Every competitor is either a database or a thin LP. Formats none of them ship, all of which suit a solo agent:

1. **Net-proceeds comparison calculator** (cash offer vs. MLS listing) — cash buyers will never publish this
2. **Property walkthrough video** embedded on `/property/*` with `VideoObject` markup
3. **Dated monthly Kern County market report** with a consistent URL and email list
4. **Sub-community deep-dives** at a granularity the portals do not template

---

## 6. Search Intent Coverage Map

| Intent | Coverage | Gap |
|---|---|---|
| **Informational** | Strong — 14 guides, median 1,006 words, all with FAQ blocks | No visuals, no data, no update cadence |
| **Commercial investigation** | Weak — `/real-estate`, `/investing`, `/home-value` | `/investing` 214 words; `/home-value` has no form |
| **Transactional** | Very weak — 8 properties total vs. 570–659 per competitor | No IDX/MLS feed |
| **Navigational** | **Failing** — own site absent from own brand SERP | Entity conflict, no `sameAs` breadth |
| **Local** | Partial — 4 city pages exist but render 228–280 words with no raw-HTML H1 | No `streetAddress` in schema, no GBP signal detected, no neighborhood pages |

---

## 7. Quick Wins (≤ 1 week, ordered by impact/effort)

1. **Delete `style="display:none"`** at `prerender-metadata.mjs:65`. One-line change, removes a hidden-text risk across 14 routes.
2. **Add `/bakersfield`, `/tehachapi`, `/california-city`, `/stallion-springs`** to `pageHeadings` and `pageContent` (lines 20–53) so they stop shipping 9 words and no H1.
3. **Make the prerendered H1 identical to the React H1** on every route — eliminates the content divergence in the §Primary Finding table.
4. **Wrap `/home-value`'s four inputs in a real `<form>`** with a submit handler and a conversion event.
5. **Remove the self-serving `AggregateRating`** (5.0 / 6 reviews) from `RealEstateAgent` and `LocalBusiness`, or replace with a third-party-sourced rating.
6. **Add `streetAddress`** to `PostalAddress`, and name the brokerage in schema and in the footer.
7. **Replace `nate85.realtor@gmail.com`** with a domain email sitewide and in schema.
8. **Fix the homepage H1** — "It's not what you do. It's how you do it." → a keyword-bearing H1 that keeps the slogan as an H2 or eyebrow.
9. **Make the GitHub repos private** so the site's source stops outranking the site.
10. **Add one dated statistic** to `/bakersfield-home-prices` and `/tehachapi-home-prices` with an "Updated [month]" stamp.
11. **Embed one YouTube walkthrough** on `/properties` with `VideoObject` markup.
12. **Stagger the guide `updated` dates** and start a real revision cadence — 14 identical `published`+`updated` timestamps reads as bulk generation.

---

## 8. Long-Tail Opportunities

Derived from gaps between what SERP competitors answer and what this site covers. All are low-competition and match existing assets.

**Relocation**
- `cost to move from Los Angeles to Bakersfield` (moveBuddha owns with "$2,186")
- `is Bakersfield cheaper than Los Angeles 2026`
- `Tehachapi commute to Bakersfield time`

**Market data**
- `Bakersfield days on market` / `Kern County months of inventory`
- `Bakersfield list to sale price ratio`
- `Tehachapi median home price 2026`
- `Kern County property tax rate` (~1.1% + $1.10/$1,000 transfer tax)

**First-time buyer**
- `CalHFA Kern County income limits 2026`
- `GSFA Platinum Bakersfield`
- `MyHome assistance program Kern County`
- `Dream For All first generation buyer California`

**Land / investor**
- `owner financing land Tehachapi no credit check`
- `Alpine Forest Park Tehachapi land for sale`
- `Bear Valley Springs vs Stallion Springs`
- `cheapest acre California City`
- `Kern County tax defaulted land auction dates`
- `Kern County gross rent multiplier` / `cash on cash return Bakersfield`

**Seller**
- `cash offer vs realtor Bakersfield net proceeds`
- `probate sale Bakersfield timeline`
- `as-is disclosure requirements California seller`
- `cost to sell a house in Kern County`

**Lifestyle**
- `does it snow in Tehachapi`
- `Tehachapi school ratings`
- `Rosedale Bakersfield neighborhood guide` / `Seven Oaks Bakersfield`

---

## Cross-Skill Referrals

- **E-E-A-T gaps** (no brokerage disclosure, gmail contact, entity conflict with Compass) → run `/seo content`
- **Missing `RealEstateListing`, `Residence`, `Event`, `VideoObject`; self-serving `AggregateRating`** → run `/seo schema`
- **Local intent across four city pages, no `streetAddress`, no GBP signal detected** → run `/seo local`
- **Thin pages** (`/cheap-land-kern-county` 104 words, `/investing` 214, `/tehachapi` 228, `/bakersfield` 280) → run `/seo page`

---

## Limitations

What this audit could **not** assess:

- **Actual rankings and impressions.** No Google Search Console or analytics access. All ranking statements describe competitive structure observed in live SERPs, not this site's measured positions.
- **Keyword volume and difficulty.** No paid keyword tool connected; long-tail suggestions are derived from SERP composition, not from volume data.
- **Index coverage.** Whether Google has actually rendered and indexed the JS-dependent city pages is unverifiable without GSC URL Inspection. The 9-word raw HTML is confirmed; the indexing consequence is inferred.
- **Google Business Profile.** No GBP was located for "Harbison Standard." Local pack presence, review count, and NAP consistency are unassessed — this materially affects every local query in §6.
- **Core Web Vitals / field data.** No PageSpeed or CrUX run; UX scoring is structural (forms, CTAs, headings), not performance-based.
- **Backlink profile.** Not measured, so the Authority score reflects only on-SERP entity signals.
- **SERP features.** WebSearch returns organic results; presence of AI Overviews, People Also Ask blocks, local packs, and ads could not be directly observed and is inferred from result composition.
- **`/investing`, `/cheap-land-kern-county`, `/guides`** word counts are from raw HTML only (not Playwright-rendered), so their true rendered depth is likely higher.

---

*Generate a PDF report? Use `/seo google report`.*
