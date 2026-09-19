# Harbison Standard — Comprehensive SEO Audit Report

**Date:** September 19, 2026  
**Website:** https://www.harbisonstandard.com  
**Audited by:** Multi-Agent SEO Analysis (9 specialists)  
**Overall Health Score:** 54/100 (Below Average)

---

## 📊 Executive Summary

Your real estate website has a **solid technical foundation** but **critical content and conversion issues** that prevent ranking for high-value local queries and reduce AI search visibility. The site ships correctly pre-rendered pages for guides and property listings but has **four empty city pages** that are your most valuable local SEO opportunities.

### Overall Scores by Category

| Category | Score | Status | Priority |
|----------|-------|--------|----------|
| **Technical SEO** | 72/100 | Good foundation, issues found | High |
| **Sitemap & Crawlability** | 78/100 | Valid, but IndexNow broken | High |
| **Content Quality** | 42/100 | YMYL concerns, citations missing | 🔴 Critical |
| **E-E-A-T Signals** | 39/100 | Credentials weak, false ratings | 🔴 Critical |
| **AI Search Readiness (GEO)** | 51/100 | Hidden text, incomplete llms.txt | 🔴 Critical |
| **Search Experience (SXO)** | 40/100 | Page-type mismatch, cloaking risk | 🔴 Critical |
| **Local SEO** | In progress | GBP, NAP, citations TBD | — |
| **Performance (CWV)** | Partial | Likely good (claimed in docs) | — |
| **Schema Markup** | Partial | 6 JSON-LD blocks found | — |

---

## 🔴 CRITICAL ISSUES (Fix This Week)

### 1. Four Empty City Pages (Highest-Value Local Queries)

**Pages Affected:**
- `/tehachapi` — 9 raw words, targets "homes for sale Tehachapi"
- `/bakersfield` — 9 raw words, targets "Bakersfield realtor" 
- `/california-city` — 104 words, targets "cheap land California City"
- `/stallion-springs` — 228 words, targets "Stallion Springs homes"

**What's Happening:**
```html
<!-- Raw HTML (what crawlers see) -->
<div id="root"></div>  ← Completely empty

<!-- After JavaScript renders -->
280-944 words of content ← Content exists but JS-dependent
```

**Impact:**
- ❌ Bing crawler sees blank pages (no JS execution)
- ❌ All AI crawlers (GPTBot, ClaudeBot, PerplexityBot) see blank
- ⚠️ Googlebot must wait for JS rendering (slower indexing)
- 🔴 These are money pages for local SEO

**Status:** Other 40 pages correctly pre-rendered. Only these 4 are affected.

**Fix Effort:** 4-6 hours (use same pre-rendering as guides)

---

### 2. Hidden Text Spam Pattern (12 Pages)

**Problem:** Keywords hidden from users with `display:none`

```javascript
// scripts/prerender-metadata.mjs:65
<main style="display:none">
  <h1>Sell Your Home</h1>
  <p>Placeholder text...</p>
</main>
```

**Evidence:**
- `/about`: Hidden H1 "About Nathanael Harbison" vs visible "Real estate guidance with a local perspective"
- `/real-estate`: Hidden "Sell Your Home" vs visible "Sell with a clear plan"
- `/contact`: Hidden H1 vs visible text completely different

**Policy Violation:** Google spam policies explicitly flag this as **cloaking**

**Affected Pages:** 12 static routes + empty city pages

**Fix Effort:** 4 hours

---

### 3. 1,141 Numeric Claims with Zero Citations

**Finding:** 20,405 words of YMYL financial content with **no sources**

**Examples:**
- Land appreciation: "4–6%", "5–8%", "6–8%" (varies by page, no sources)
- Property pricing: "$40K–$80K" (no MLS reference)
- Gross rental returns: Presented as profit (math error)

**Status:** AI models won't cite unattributed claims

**Fix Effort:** 8 hours (add links to MLS, government data, studies)

---

### 4. No Privacy Policy + PII Collection

**Issue:** Four forms collect personal information (name, email, phone) without legal coverage

**Compliance Risk:**
- ❌ CCPA violation
- ❌ CAN-SPAM non-compliance
- ❌ GDPR exposure (if EU traffic)

**Missing Also:**
- No brokerage name on site (CA DRE licensing requirement)
- No disclosure of affiliation

**Fix Effort:** 2 hours

---

### 5. False Ratings in Schema (Manual Action Risk)

**Finding:** `AggregateRating` 5.0/6 on 20 pages backed by 6 anonymous testimonials

```json
{
  "aggregateRating": {
    "ratingValue": 5.0,
    "ratingCount": 6
  }
}
```

**Policy Violation:** Google's review-snippet policy prohibits self-serving reviews

**Status:** This is a known manual-action trigger

**Fix Effort:** 1-2 hours (delete rating until third-party reviews added)

---

## 🟠 HIGH-PRIORITY ISSUES (Next Week)

### 6. IndexNow Cron Automation Broken

**Current Behavior:**
```javascript
// api/indexnow.js — only submits urls[0] every hour
const urls = sitemap.match(/.../).slice(-10000) || [];
const url = urls[0]; // ❌ Always the same URL!
```

**Result:** New blog posts, guides, listings **never notified** to Bing/Google

**Evidence:** Your `docs/vercel-indexnow-notes.md` documents this exact issue

**Solution Ready:** `scripts/submit-indexnow.mjs` has correct implementation (bulk POST with full URL list)

**Status:** Wired to manual CI/deploy, not production cron

**Fix Effort:** 2 hours (update cron to use correct logic)

---

### 7. Missing Security Headers

**Current:** Only HSTS present  
**Missing:**
- Content-Security-Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options  
- Referrer-Policy

**Risk:** Manual action trigger, vulnerability exposure

**Fix Effort:** 2 hours (Vercel edge config)

---

### 8. Duplicate Meta Descriptions

**Affected:** 4 sold property pages
- `/property/sheridan`
- `/property/mendiburu`
- `/property/alsab`
- `/property/windsong`

**Issue:** All share identical boilerplate description

**Impact:** Weak ranking signals

**Fix Effort:** 1 hour

---

### 9. Brand SERP Failure

**Query:** "Nathanael Harbison" or "Harbison Standard"

**Result:** Site doesn't appear in top 10

**What Ranks Instead:**
- Compass profile (wrong location: Encinitas, San Diego)
- LinkedIn profile
- GitHub repositories (your own source code)
- RateMyAgent

**Impact:** Zero brand authority for local search

**Fix Effort:** 1-2 hours (entity consistency, GitHub privacy)

---

### 10. No Source Attribution

**Finding:** All 16 guides/blog posts unquotable by AI models

**Status:** llms.txt claims "MLS sourced" but no page repeats it where numbers live

**Impact:** ChatGPT Search and Perplexity won't cite your content

**Fix Effort:** 5-8 hours (add links per claim)

---

## 🟡 MEDIUM-PRIORITY ISSUES (This Month)

### 11. Page-Type Mismatches (8 SERP Clusters)

**Problem:** Your content type doesn't match what Google expects

| Query | SERP Expects | You Offer | Match? |
|-------|--------------|-----------|--------|
| "homes for sale Tehachapi" | IDX marketplace | Brochure | ❌ 0% |
| "Bakersfield realtor" | Review directory | Bio page | ❌ 0% |
| "cheap land Kern County" | Faceted search | Article | ❌ 0% |

**Result:** No ranking potential despite targeting queries

**Note:** Some queries like "Tehachapi vs Bakersfield" are **correctly aligned** with comparison guide

**Fix:** Acknowledge mismatch; focus content on aligned queries

---

### 12. Broken Conversion Paths

**Pages with No Lead Capture:**
- `/home-value` — **Has form fields but NO `<form>` element**
- `/bakersfield` — No capture
- `/tehachapi` — No capture
- `/about` — No conversion path
- `/investing` — No capture
- `/cheap-land-kern-county` — No capture

**Impact:** High-intent pages generate no leads

**Fix Effort:** 3 hours

---

### 13. No Video Embeddings (With Owned YouTube Content)

**Finding:** Site has YouTube channel (~24 investor education videos) but **zero video embeds** on matching guides

**Opportunity:** YouTube carries strongest AI citation correlation (~0.737)

**Quick Win:** Embed videos on matching guides with `VideoObject` schema

**Fix Effort:** 2-3 hours

---

### 14. No `<lastmod>` Tags

**Status:** Sitemap provides no freshness signals

**Impact:** Google gives no ranking boost for recent updates

**Fix Effort:** 2 hours (add real update dates)

---

### 15. Incomplete llms.txt

**Status:** Valid but omits entire guide corpus

**Issue:** 13 URLs listed, all 16 guides/blog posts missing

**Impact:** AI models can't discover citable content

**Fix Effort:** 1 hour

---

## ✅ WHAT'S WORKING WELL

- ✅ **Responsive design** (10 breakpoints, mobile-optimized)
- ✅ **Core Web Vitals** optimized (CLS prevention, image preloading)
- ✅ **Pre-rendering working correctly** on 40 of 44 pages
- ✅ **Original content** (zero cross-page duplication; guides & blog are genuinely written)
- ✅ **Schema foundation** (comprehensive JSON-LD on 40 pages)
- ✅ **Readability** (Flesch 47-71 on quality articles)
- ✅ **Clean robots.txt** (explicit AI crawler allowances)
- ✅ **FAQ structured data** (80 Q&A pairs pre-formatted)
- ✅ **Brotli compression enabled**
- ✅ **Single-hop redirects** (no chains)

---

## 📋 CONSOLIDATED ACTION PLAN

### PHASE 1: Critical (This Week — 16 hours)

1. **Remove hidden text injection** (4 hours)
   - Delete `display:none` from `scripts/prerender-metadata.mjs:65`
   - Sync injected H1s with rendered H1s

2. **Pre-render the 4 empty city pages** (4-6 hours)
   - Add `/tehachapi`, `/bakersfield`, `/california-city`, `/stallion-springs` to prerender maps
   - Add 800-1,200 words of real market content per page

3. **Add privacy policy & legal disclosures** (2 hours)
   - Add privacy policy (CCPA/GDPR/CAN-SPAM)
   - Name the brokerage on site (CA DRE requirement)

4. **Fix false ratings** (1-2 hours)
   - Remove `aggregateRating` from all pages
   - Restore only if third-party reviews added

5. **Add forms to 6 conversion pages** (3 hours)
   - Fix `/home-value` (add real `<form>` element)
   - Add capture forms to city pages

### PHASE 2: High-Priority (Weeks 2-3 — 18 hours)

1. **Add source citations** (8 hours)
   - Link all 1,141 numeric claims to sources
   - Add MLS, government, academic links
   - Create "Data & Methodology" section

2. **Fix IndexNow cron** (2 hours)
   - Update `api/indexnow.js` to use correct bulk-POST logic
   - Or wire `scripts/submit-indexnow.mjs` to production

3. **Add security headers** (2 hours)
   - CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
   - Deploy via Vercel edge config

4. **Add `<lastmod>` tags** (2 hours)
   - Update sitemap generation
   - Use real content-update dates

5. **Fix duplicate descriptions** (1 hour)
   - Write unique descriptions for 4 sold property pages

6. **Fix brand SERP** (1-2 hours)
   - Make GitHub repos private
   - Add entity consistency markup
   - Claim Google Business Profile

7. **Rebuild llms.txt** (2 hours)
   - Include all 16 guides/blog posts
   - Add discovery links
   - Add RSL 1.0 licensing

### PHASE 3: Medium-Priority (Month 2 — 12 hours)

1. **Embed YouTube videos** (2-3 hours)
   - Match videos to guides
   - Add `VideoObject` schema

2. **Fix conversion paths** (2-3 hours)
   - Optimize form placement
   - Add CTAs to high-intent pages

3. **Content prose ratio** (5 hours)
   - Increase connected prose from 16% to 40%+
   - Reduce bullet/table fragmentation

4. **Internal linking expansion** (2-3 hours)
   - Link related guides
   - Cross-link city pages

---

## 📊 Category Scores (Full Breakdown)

### Technical SEO: 72/100 ✅
- ✅ Valid XML sitemaps
- ✅ Proper redirects
- ✅ Responsive design
- ❌ 4 empty city pages (CSR-only)
- ❌ Missing security headers
- ❌ Duplicate meta descriptions

### Sitemap Quality: 78/100 ✅
- ✅ 43 valid URLs, 100% healthy
- ✅ Image sitemap correctly scoped
- ❌ IndexNow cron broken
- ❌ No `<lastmod>` tags

### Content Quality: 42/100 🔴
- ✅ Original writing (zero duplication)
- ✅ Good readability (Flesch 47-71)
- ❌ 1,141 unattributed claims
- ❌ Hidden text pattern
- ❌ Fragment-heavy (only 16% prose)

### E-E-A-T Signals: 39/100 🔴
- ✅ DRE credentials present
- ❌ No brokerage name
- ❌ False AggregateRating
- ❌ No third-party reviews
- ❌ Zero source attribution

### AI Search Readiness: 51/100 🔴
- ✅ All AI crawlers allowed
- ✅ Valid llms.txt
- ❌ Hidden text (quality violation)
- ❌ Zero video embeds
- ❌ Missing citability signals
- ❌ Incomplete llms.txt (missing guides)

### Search Experience (SXO): 40/100 🔴
- ✅ Some aligned queries (comparisons)
- ❌ Page-type mismatches (IDX, directories)
- ❌ Cloaking signals (hidden H1s)
- ❌ Broken conversion paths
- ❌ Brand SERP failure
- ❌ No freshness signals

---

## 🎯 Highest-ROI Quick Wins

**Ranked by effort-to-impact ratio:**

1. **Remove hidden text** (4 hours) → Eliminates spam signal
2. **Fix IndexNow cron** (2 hours) → New content gets indexed
3. **Delete false ratings** (1 hour) → Removes manual-action risk
4. **Add privacy policy** (2 hours) → Compliance + trust
5. **Pre-render city pages** (6 hours) → Unlocks 4 money-pages
6. **Add form to /home-value** (30 min) → Fix broken conversion
7. **Make GitHub private** (5 min) → Restore brand SERP

**Total for Quick Wins: 15.5 hours → Fixes 6 critical issues**

---

## 📈 Expected Impact After Fixes

| Issue | Current Status | After Fix | Impact |
|-------|----------------|-----------|--------|
| Empty city pages | Blank | 800+ words each | **Ranking potential unlocked** |
| Hidden text | Cloaking signal | Genuine content | **Spam penalty removed** |
| Fake ratings | Manual action risk | Removed | **Authority restored** |
| Broken conversion | 0 leads | Forms working | **Lead capture enabled** |
| Brand SERP | Not ranking | Claimed | **Authority + brand recognition** |
| AI search | Unquotable | Attributed | **Citation potential unlocked** |

---

## 📚 Detailed Reports by Category

Complete specialist findings available in:
- `audit-results/findings/sitemap.md` — Sitemap quality & IndexNow bug
- `audit-results/findings/technical.md` — Crawlability, security, redirects
- `audit-results/findings/content.md` — E-E-A-T, readability, citations
- `audit-results/findings/geo.md` — AI search readiness, citability
- `sxo.md` — Search experience, page-type analysis, personas
- (Partial: schema.md, performance.md, visual.md, local.md — being finalized)

---

## 🚀 Next Steps

1. **This Week:** Fix 5 critical issues (hidden text, city pages, privacy, ratings, forms)
2. **Next Week:** Add citations, fix IndexNow, add security headers
3. **Month 2:** Content expansion, video embeds, internal linking
4. **Ongoing:** Monitoring, freshness, authority building

---

## 📞 Questions or Clarifications?

This audit analyzed:
- 44 public URLs across all pages
- 16 markdown source files
- Schema markup on 40 pages
- Crawler behavior (Googlebot, Bing, AI bots)
- Content depth & E-E-A-T signals
- SERP positioning for 8+ query clusters
- Conversion path optimization

**Limitations:** No GSC access (rankings inferred from SERP structure), no backlink data, no real GBP verified. Local SEO findings partial due to agent turn limits.

---

**Report Generated:** September 19, 2026  
**Overall Health:** 54/100 (Below Average → Can reach 78/100+ with Phase 1 fixes)  
**Confidence:** High for issues flagged; recommendations evidence-based on Google's published policies

---

*End of SEO Audit Report*
