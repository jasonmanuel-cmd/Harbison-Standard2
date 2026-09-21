# GEO / AI Search Audit — harbisonstandard.com

Audited 2026-09-19. Method: raw HTML fetch (no JS) of 25 URLs, robots.txt / llms.txt /
sitemap inspection, JSON-LD parsing, passage-level scoring of the 16 markdown source
articles, external entity checks (Wikipedia API, YouTube, social `sameAs` resolution).

## GEO Readiness Score: 51 / 100

| Dimension | Weight | Score | Weighted |
|---|---|---|---|
| Citability | 25% | 52 | 13.0 |
| Structural readability | 20% | 58 | 11.6 |
| Multi-modal content | 15% | 28 | 4.2 |
| Authority & brand signals | 20% | 50 | 10.0 |
| Technical accessibility | 20% | 62 | 12.4 |
| **Total** | | | **51.2** |

The site has an unusually good crawler-policy layer (explicit AI allow-list, valid
llms.txt, rich JSON-LD) sitting on top of a content layer that AI engines largely
cannot use: 15 of 44 sitemap URLs deliver no extractable body text, and every
statistic in the 16-article guide library is unattributed.

---

## 1. AI Crawler Accessibility

robots.txt returns HTTP 200, `text/plain`, and declares seven named groups plus a
wildcard. All named groups are identical: `Allow: /`, `Disallow: /api/`,
`Allow: /api/properties`, `Disallow: /hq`.

| Crawler | What it actually governs | Status | Note |
|---|---|---|---|
| GPTBot | OpenAI **training** only | Allowed (explicit) | Not evidence about ChatGPT Search |
| OAI-SearchBot | **ChatGPT Search** citability | Allowed (via `*`) | Not named — add explicit group |
| ChatGPT-User | ChatGPT user-triggered fetch | Allowed (explicit) | |
| ClaudeBot | Anthropic **training** only | Allowed (explicit) | Not evidence about Claude search |
| Claude-SearchBot | **Claude search** citability | Allowed (via `*`) | Not named — add explicit group |
| Claude-Web / anthropic-ai | Legacy Anthropic agents | Allowed (explicit) | Largely deprecated names |
| PerplexityBot | Perplexity index | Allowed (explicit) | |
| Perplexity-User | Perplexity user fetch | Allowed (via `*`) | Not named |
| Google-Extended | Gemini/Vertex training + grounding | Allowed (explicit) | Never affects Search or AI Overviews |
| Googlebot | Search **and** AI Overviews | Allowed (via `*`) | AIO inclusion follows this, not Google-Extended |
| Bingbot | Bing index + Copilot | Allowed (via `*`) | `<meta name="bingbot" content="index, follow, max-snippet:-1">` present |
| Applebot | Siri/Spotlight/Safari | Allowed (via `*`) | |
| Applebot-Extended | Apple Intelligence training only | Allowed (via `*`) | |
| CCBot, cohere-ai, Amazonbot, Meta-ExternalAgent, Bytespider | Mixed training | Allowed (via `*`) | |

No AI crawler is blocked, and no rate-limit (`Crawl-delay`) directive exists.
Response headers show Vercel CDN with `X-Vercel-Cache: HIT`, no `X-Robots-Tag`,
HSTS enabled — nothing suppresses AI access at the transport layer.

**Gap:** the two crawlers that actually decide ChatGPT-Search and Claude-search
citability (`OAI-SearchBot`, `Claude-SearchBot`) are the only ones *not* named.
They inherit the wildcard group so they are permitted today, but the explicit
groups for GPTBot/ClaudeBot mean the file currently advertises training consent
more loudly than search consent.

**Do not fix by blocking:** the training-only crawlers (GPTBot, ClaudeBot,
Google-Extended, Applebot-Extended, CCBot) are deliberately allowed. For a local
brand trying to enter model memory, that is the correct call.

## 2. llms.txt

Present at `/llms.txt`, HTTP 200, `text/plain`, well-formed against the spec:
H1 title, blockquote-style summary, `## Core Pages` / `## Local Market Data` /
`## Relocation & Lifestyle Guides` / `## Additional Resources` sections with
`- [Title](URL): description` entries, plus a `## Methodology & Verification`
section naming MLS and verified sales records as data sources. Contact, DRE
license, service area, and response time are all in the header block.

Problems:

1. **The highest-value assets are missing.** The file lists 13 URLs. It omits
   `/guides`, `/blog`, all 14 guide pages, and both blog posts — i.e. all 15,919
   words of the actual citable corpus. It also omits `/tehachapi`,
   `/bakersfield`, `/california-city`, `/stallion-springs`, and `/home-value`.
2. **Not discoverable.** No `Llms: https://…/llms.txt` line in robots.txt and no
   `<link rel="llms-txt">` in the document head.
3. **No `/llms-full.txt`** (404). With ~16k words of guide content, a full-text
   variant is cheap and materially improves ingestion.
4. **No usage / commercial terms.** The file has a verification section but no
   attribution request, no commercial-use statement, and no public/private
   separation note (`/hq` is disallowed in robots.txt but unmentioned here).
5. **No RSL 1.0 licensing.** `/.well-known/rsl.xml`, `/rsl.xml`, `/license.xml`
   and `/ai.txt` all 404. No `Licence:` directive in robots.txt. For a site
   explicitly opting into training, a permissive RSL grant with an attribution
   requirement is the only machine-readable way to ask for a citation in return.

## 3. Citability Assessment

### Two-tier problem

**Tier A — guide/blog pages (16 URLs): genuinely citable, genuinely unsourced.**
These are server-rendered via `renderToString` in `scripts/prerender-metadata.mjs`
and arrive fully formed in raw HTML. `tehachapi-vs-bakersfield` delivers 14,801
chars of text, 10 H2s, 21 H3s, a comparison table, and FAQPage + Article +
BreadcrumbList JSON-LD without a single line of JavaScript. That is the right
architecture.

**Tier B — 11 static routes: content exists only inside a hidden element.**
`scripts/prerender-metadata.mjs` injects the SEO body as:

```
'<main style="display:none"><h1>'+escape(heading)+'</h1><p>'+escape(content)+'</p></main>'
```

Confirmed live on `/about`, `/bakersfield-home-prices`, `/tehachapi-home-prices`,
`/why-tehachapi`, `/cheap-land-kern-county`, `/real-estate`, `/investing`,
`/contact`, `/home-value`, `/past-sales`,
`/moving-from-los-angeles-to-bakersfield`. Each ships a single H1 and one
undifferentiated `<p>` of 88–255 words of generic filler ("Market fundamentals
support prices across multiple buyer profiles"), hidden from users, with no
headings, no numbers, and no correspondence to what the React app actually
renders. This is text served to crawlers and hidden from humans — a hidden-text
quality violation in Google's terms, and for AI extraction it produces a page
whose only harvestable content is vague and unquotable.

**Tier C — 4 city pages in the sitemap with zero body text.** `/tehachapi`,
`/bakersfield`, `/california-city`, `/stallion-springs` return 9–11 words of raw
HTML (title only). Correct titles, descriptions, canonicals and org-level JSON-LD
are present, but no prerender entry exists in `pageHeadings`/`pageContent`, so
they are pure CSR shells. These are the four highest-intent local queries on the
site and they are invisible to every AI crawler that does not execute JavaScript.

### Passage-level scoring (16 source articles, 15,919 words total)

| Page | Words | H2 | Question headings | Sections in 134–167w band | Stats | Tables | Ext. sources | Citability |
|---|---|---|---|---|---|---|---|---|
| tehachapi-vs-bakersfield | 1,321 | 10 | 1/31 | 4/10 | 118 | 1 | 0 | 72 |
| vacation-rental-investment-kern-county | 1,560 | 10 | 1/29 | 5/10 | 177 | 2 | 0 | 70 |
| sell-home-as-is-kern-county | 1,553 | 9 | 1/33 | 4/9 | 114 | 2 | 0 | 68 |
| bakersfield-homes-with-shop | 1,313 | 11 | 3/31 | 8/11 | 87 | 2 | 0 | 68 |
| first-time-homebuyer-kern-county | 1,667 | 9 | 3/35 | 3/9 | 82 | 3 | 0 | 64 |
| owner-financing-land-tehachapi | 1,015 | 9 | 2/9 | 6/9 | 46 | 0 | 0 | 62 |
| kern-county-investment-properties | 848 | 10 | 0/10 | 3/10 | 97 | 1 | 0 | 58 |
| what-40k-buys-tehachapi (blog) | 801 | 8 | 0/8 | 5/8 | 85 | 0 | 0 | 58 |
| inherited-house-bakersfield | 974 | 8 | 0/11 | 2/8 | 39 | 0 | 0 | 55 |
| cheap-land-california-city-vs-tehachapi | 744 | 7 | 1/13 | 3/7 | 35 | 1 | 0 | 55 |
| tax-defaulted-properties-kern-county | 852 | 10 | 2/10 | 3/10 | 37 | 0 | 0 | 54 |
| preforeclosure-properties-kern-county | 859 | 10 | 1/10 | 2/10 | 36 | 0 | 0 | 52 |
| tehachapi-land-under-50k | 702 | 7 | 2/7 | 3/7 | 31 | 0 | 0 | 52 |
| bakersfield-homes-under-400k | 572 | 7 | 1/7 | 1/7 | 68 | 0 | 0 | 48 |
| tehachapi-homes-with-acreage | 637 | 9 | 2/9 | 0/9 | 61 | 0 | 0 | 44 |
| kern-county-market-update-sep-2026 (blog) | 501 | 7 | 3/7 | 0/7 | 28 | 0 | 0 | 42 |
| **11 hidden-`<main>` static routes** | 88–255 | 0 | 0 | 0 | ~0 | 0 | 0 | **15** |
| **4 city pages** (`/tehachapi` etc.) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **5** |

Cross-cutting issues:

- **Zero source attribution site-wide.** Across all 16 articles there are 0
  outbound links and 0 named sources, against ~1,130 numeric claims ("$15K–$40K
  per acre", "4–6% annually", "cap rate 5–7%"). llms.txt claims MLS sourcing but
  no page repeats that claim where the numbers live. Unsourced specificity is the
  single biggest suppressor of Perplexity and ChatGPT-Search citation.
- **Passage length below the band.** Only 52 of 148 H2 sections fall in the
  134–167-word range. Mean section length is 66–203 words, with market-update and
  acreage pages averaging 66–68 words — too thin to stand alone as an extracted
  answer.
- **No 40–60-word direct answer openers.** Sections open with context ("Both
  Tehachapi and Bakersfield are thriving real estate markets…") rather than the
  answer. FAQ answers in frontmatter *do* follow this pattern well and are the
  strongest citable units on the site.
- **Uniform dates.** All 16 articles carry `published: 2026-09-14` and
  `updated: 2026-09-14`. A 16-piece same-day corpus reads as a bulk publish and
  gives no freshness differentiation for a market-update post.
- **Contradiction risk.** `/tehachapi-home-prices` (hidden main) says Tehachapi
  "commands premium pricing", while the tehachapi-vs-bakersfield table puts
  Tehachapi median at $320K–$450K vs Bakersfield $280K–$350K with Bakersfield
  marked "Winner (lower starting)". Directionally consistent but the hidden page
  offers no numbers to reconcile against, so an extractor sees an unsupported
  superlative.
- **H1 pollution.** Article H1s render the full frontmatter title including the
  `| Harbison Standard` suffix — e.g. `Tehachapi vs Bakersfield: Where Should You
  Buy Real Estate? | Harbison Standard`. The brand suffix belongs in `<title>`
  only; it degrades the heading as an extractable question.
- **No visible byline.** Author appears in Article JSON-LD (`Person`,
  `url: /about`, `sameAs` socials) but no human-visible "By Nathanael Harbison,
  REALTOR® DRE #02059393" line appears on any article. Only "Published September
  14, 2026" is rendered.

## 4. AI Overviews Optimization

Working in your favor:

- FAQPage schema on the homepage (5 Q&As) and on 15 of 16 articles (5 each) —
  roughly 80 pre-formatted question/answer pairs, the most AIO-ready asset here.
- BreadcrumbList + Article + Person author on every guide and blog post.
- Comparison tables on 6 guides in semantic `<table>` markup.
- `max-snippet:-1` and `max-image-preview:large` set for both googlebot and
  bingbot.
- Server-rendered guide HTML, so Googlebot's render queue is not a dependency.

Working against you:

- The hidden-`<main>` pattern on 11 routes is a direct quality risk. Even setting
  the policy question aside, hidden content is a weak AIO extraction candidate.
- 4 sitemap URLs with zero content invite thin-content classification and burn
  crawl trust.
- Only 23 of 148 headings are question-formatted (~16%). AIO passage selection
  favors question headings followed by a direct answer.
- No "key takeaways" / summary block on any long guide.
- No definition blocks for the specialist terms the site trades on (cap rate,
  as-is sale, tax-defaulted auction, owner financing, pre-foreclosure) — these are
  high-frequency AIO definitional queries the guides already half-answer.

### E-E-A-T

Strong: DRE #02059393 surfaced in HTML, JSON-LD `hasCredential`, and llms.txt;
`memberOf` NAR; RealEstateAgent + LocalBusiness + Organization graph with `@id`
cross-references; four resolving `sameAs` profiles; a methodology statement.

Risk: `aggregateRating` of `5.0` from `reviewCount: 6` (src/seo.js:52-59, 278-286)
is attached to the business's own `LocalBusiness`/`RealEstateAgent` nodes and
backed only by six anonymous first-party testimonials ("Buyer — Bakersfield",
"Seller — Inherited property") with no `Review` items and no named authors. Google
does not permit self-serving reviews for LocalBusiness rich results; this is the
most likely source of a structured-data manual action on the site, and a perfect
5.0 with 6 anonymous reviews reads as a low-trust signal to LLM evaluators too.

## 5. Platform-Specific Scores

| Platform | Score | Driver |
|---|---|---|
| Google AI Overviews | 48 | Googlebot allowed, FAQ/Article schema strong; hidden-text pattern and 4 empty city pages are the ceiling |
| ChatGPT Search | 55 | OAI-SearchBot permitted, GPTBot explicitly allowed, tables extract cleanly; unsourced stats and no entity footprint limit selection |
| Perplexity | 50 | PerplexityBot explicitly allowed and comparison tables suit it; zero outbound citations is disqualifying for a citation-graph engine |
| Bing Copilot | 45 | Bingbot allowed with generous snippet directives; thin external link profile and young domain mean shallow Bing index coverage |
| Claude search | 52 | Claude-SearchBot permitted via wildcard; llms.txt methodology and license disclosure align well; lack of verifiable sourcing caps it |

Only ~11% of domains get cited by both ChatGPT and Google AIO, so treat these as
separate programs: fix the hidden/empty pages for Google, fix source attribution
for Perplexity and ChatGPT.

## 6. Brand Mention Signals

| Signal | Correlation with AI citation | Status |
|---|---|---|
| YouTube | ~0.737 (strongest) | Channel `@Nathanaelharbison` live, ~24 items, description targets investor education. **Zero videos embedded anywhere on the site.** |
| Reddit | High | No detectable presence for "Harbison Standard" or "Nathanael Harbison" (Reddit search API blocked the automated check; no organic references surfaced) |
| Wikipedia entity | High | 0 results from the Wikipedia search API for either term. No entity, expected at this scale |
| LinkedIn | Moderate | Profile in `sameAs`; returned HTTP 999 (LinkedIn bot rejection), so existence unverified by this audit |
| Domain Rating / backlinks | ~0.266 (weak) | Not measured; low priority |

On-site brand consistency is good: "Nathanael Harbison" and "Harbison Standard"
appear in llms.txt header, homepage FAQ ("Who is Nathanael Harbison?"), Person
author schema, and the `/about` copy. The entity is *defined* clearly; it is just
not *corroborated* anywhere off-site except four social profiles. Google Business
Profile is absent from `sameAs` — for a local real estate entity that is the
single most important missing corroboration.

Thought-leadership signal is weak: 16 pieces published on one day, no visible
author byline, no external expert citations, no media mentions, no original data
release.

## 7. Top 5 Highest-Impact Changes

**1. Remove `display:none` from the prerendered `<main>` and replace filler with real content (High impact / Medium effort — 4–6 h)**
In `scripts/prerender-metadata.mjs`, drop the inline `style="display:none"` and
render the same route components through `renderToString` that guides already use,
so the 11 static routes ship their real visible content. At minimum, split each
`pageContent` string into 3–4 H2 sections of 134–167 words each with real numbers.
This removes a hidden-text policy risk and converts 11 dead URLs into citable
pages.

**2. Prerender or de-list the 4 city pages (High / Low — 2 h)**
`/tehachapi`, `/bakersfield`, `/california-city`, `/stallion-springs` ship 9 words.
Add them to `pageHeadings`/`pageContent` with 600+ words each (median price, DOM,
inventory, neighborhoods, school access, commute) or remove them from sitemap.xml
until they have content. These are the highest-intent local queries on the site.

**3. Add source attribution to every statistic (High / Medium — 5–8 h)**
Add a `sources:` frontmatter field and a rendered "Data & Methodology" block per
article: name the MLS, the date range, the sample size, and link Kern County
Assessor / CAR / county recorder where applicable. This is the single change most
likely to move Perplexity and ChatGPT-Search citation rates, and it makes the
llms.txt methodology claim verifiable.

**4. Fix the review/rating exposure (High / Low — 1–2 h)**
Remove `aggregateRating` from `src/seo.js` (lines 52-59, 278-286, 310) until
reviews are third-party and attributable, or migrate to Google Business Profile
reviews and reference them there. Replace the six anonymous testimonials with
named, dated, verifiable ones. Removes manual-action risk and raises trust signal.

**5. Rebuild llms.txt around the guide corpus and add discovery + licensing (Medium / Low — 2 h)**
Add all 16 guide/blog URLs with one-line descriptions, add `/guides` and `/blog`
hubs, add the 4 city pages, generate `/llms-full.txt` from the markdown at build
time, add `Llms: https://www.harbisonstandard.com/llms.txt` to robots.txt plus a
`<link rel="llms-txt">` tag, and add an attribution-required usage clause. Publish
an RSL 1.0 grant at `/.well-known/rsl.xml` with a `Licence:` pointer in robots.txt.

### Secondary (next tier)

6. Add explicit `OAI-SearchBot`, `Claude-SearchBot`, and `Perplexity-User` groups
   to robots.txt (15 min) so search consent is as explicit as training consent.
7. Strip the `| Harbison Standard` suffix from rendered article H1s (30 min).
8. Add a visible byline — "By Nathanael Harbison, REALTOR® DRE #02059393" linked
   to `/about` — plus a visible "Updated" date, and stagger `updated:` dates as
   content is genuinely revised (1–2 h).
9. Convert ~60% of H2s to question form and open each with a 40–60-word direct
   answer (4–6 h across 16 files).
10. Embed the relevant YouTube video on each matching guide and add VideoObject
    schema (2–3 h) — this converts the strongest external correlation signal
    (~0.737) into an on-site multi-modal asset. Multi-modal is the weakest
    dimension at 28/100: 0 images and 0 video across all 16 articles.
11. Add a "Key takeaways" block (4–6 bullets) to the top of each 1,000+ word guide
    (2 h) — highly extractable, directly targets AIO passage selection.
12. Add definition blocks for cap rate, as-is sale, tax-defaulted auction, owner
    financing, and pre-foreclosure, with `DefinedTerm` schema (3 h).
13. Seed off-site corroboration: claim/verify Google Business Profile and add it
    to `sameAs`; answer Kern County / Bakersfield / Tehachapi housing questions on
    r/bakersfield and r/RealEstate under a named profile linking back.

## Appendix — Evidence

- robots.txt: 7 named AI crawler groups, all `Allow: /`; `Disallow: /hq`, `/api/`
  with `/api/properties` re-allowed; 2 sitemaps declared. No `Crawl-delay`.
- llms.txt: 13 URLs listed; 0 of 16 guide/blog URLs included.
- sitemap.xml: 44 URLs. 15 return ≤255 words of raw text (11 hidden-main + 4 empty).
- Raw-HTML text volume: `/` 7,041 chars · `tehachapi-vs-bakersfield` 14,801 ·
  `kern-county-market-update` 8,339 · `/about` 1,927 (hidden) ·
  `/bakersfield-home-prices` 696 (hidden) · `/tehachapi` 51.
- JSON-LD types present: RealEstateAgent, Organization+ProfessionalService,
  LocalBusiness, WebSite, WebPage, FAQPage, Article, Person, BreadcrumbList,
  EducationalOccupationalCredential, AggregateRating, Brand, PostalAddress.
  Absent: VideoObject, Review, DefinedTerm, HowTo, ItemList, Place/GeoCoordinates.
- Multi-modal: 0 images and 0 video embeds in 16 articles; 6 of 16 have tables;
  8/8 homepage images carry alt text; image sitemap present.
- External checks: Wikipedia API 0 hits; YouTube channel 200 with ~24 items;
  Facebook 200; Instagram 200; LinkedIn 999 (bot-blocked, inconclusive).
- No `/llms-full.txt`, `/ai.txt`, `/rsl.xml`, `/.well-known/rsl.xml`,
  `/license.xml` (all 404).
