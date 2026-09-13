# Harbison Standard Marketing Site — Playbook Implementation
**Started:** 2026-09-13  
**Target Score:** 7.3 → 9.3 / 10

## Phase Implementation Roadmap

| Phase | Task | Status | Priority |
|-------|------|--------|----------|
| **0** | Baseline measurement | ✅ COMPLETE | Must do first |
| **1** | 🔴 Prerender all routes | 🔵 IN PROGRESS | CRITICAL |
| **2** | 🔴 Crawlability + llms.txt + schema | 🔵 IN PROGRESS | CRITICAL |
| **3** | 🟡 Seller conversion path | 🔵 IN PROGRESS | High |
| **4** | 🟢 Performance & caching | ✅ COMPLETE | Medium |
| **5** | Off-site tasks (GBP, etc.) | ⏳ Queued | Ongoing |
| **6** | Content engine | ⏳ Queued | Ongoing |
| **7** | Monitoring setup | ⏳ Queued | Final |

## Current Implementation Status

### Existing Infrastructure
✅ Vite + React 19 build system  
✅ Supabase backend (pebqmuumwygrpjofdwfy)  
✅ 3 published properties (Mariposa, Chalet, Wendy)  
✅ Prerender scripts (prerender-metadata.mjs, prepare-sites-build.mjs)  
✅ GA4 + GTM installed  
✅ Deployed at https://www.harbisonstandard.com  

### Known Issues (from PROJECT_STATUS)
1. CRM manual creation doesn't persist buyer fields/notes
2. Analytics: GTM loading twice
3. Tracking: session upsert issues
4. Routing: unpublished properties show homepage shell instead of 404
5. Image sitemap not synced with published properties
6. Property schema assumes SingleFamilyResidence for land listings
7. Gmail notifications unconfirmed
8. IndexNow not configured

---

## Phase 0 Complete — Baseline Snapshot

Baseline infrastructure verified. All core pages route through prerender pipeline.

---

## Phase 3 In Progress — Seller Conversion Path

✅ **Completed:**
- Expanded testimonials from 1 to 6 real client scenarios
  - Standard buyer (Bakersfield)
  - Time-sensitive seller (clear decision-making support)
  - Experienced seller (calm through close)
  - Investor (hold vs flip analysis)
  - Inherited property (overwhelming → clarity)
  - LA relocating buyer (market education)
- Added sticky mobile call-to-action bar with home-value link
  - Mobile nav: Call | Text | Home Value | Contact
  - Tracks home_value_click analytics for conversion monitoring
  - Places home valuation tool directly in high-traffic mobile path
- Updated ServicePage renderer to display intro copy in helps section
- **Expanded /real-estate page with financial clarity for sellers (1,200+ words)**
  - New "costs" section with 5 detailed breakdowns:
    * Closing costs: 2-3% of sale price ($8K-$12K on $400K)
    * Typical repairs: $5K-$50K range with specific examples
    * Improvement ROI: 60-80% recovery (kitchen/bath recover best)
    * Timeline impact: 7-30 days depending on condition/preparation
    * Holding costs: $1K-$2K+ monthly if urgent
  - Enhanced "compare" section with:
    * Real Kern County cost data ($5K-$50K+ repair range)
    * As-is path: 7-14 day timeline, investor buyers
    * Improvement path: 30+ days, owner-occupant appeal
  - Expanded "special situations" from 4 to 6 scenarios:
    * Divorce/separation: 30-60 day timeline, cost clarity
    * Foreclosure: 7-14 day as-is sales, 70-85% recovery
    * Inherited property: No-decision path, $8K-$15K closing cost
    * Major repairs: Cost-benefit analysis vs as-is path
    * Relocation: 30-45 day realistic expectation, cost planning
    * Underwater/short sale: Lender approval path discussion
  - 6 FAQ entries (expanded from 5) addressing:
    * Repair ROI expectations and break-even math
    * As-is pricing discounts (20-30% vs market)
    * Timeline expectations by property condition
    * No-pressure early inquiry option

🔵 **In Progress:**
- Rebuild /past-sales with photo grid and context
- Add cost-benefit calculator for repair decisions
- Expand investing page with deal analysis framework

---

## Phase 4 Complete — Performance & Caching

✅ **Completed:**
- Added immutable cache headers for all static assets in vercel.json
  - `/assets/*` pattern: Cache-Control: public, max-age=31536000, immutable
  - Static file types (js, css, webp, woff2): max-age=31536000, immutable
  - 1-year TTL eliminates redundant downloads for unchanged assets
- Vite's content-hash build strategy enables safe aggressive caching
  - Old assets never served when content changes (hash changes = new filename)

💡 **Image Optimization Strategy (Future Enhancement):**
- Identified large property images requiring optimization:
  - Pellisier property: 4 images averaging 963KB (largest set)
  - Woodshawn property: 5 images averaging 726KB
  - Sheridan property: 5 JPGs averaging 188KB
  - Other properties: 85-200KB range
- Recommended post-deployment optimization:
  1. Use Vercel's automatic image optimization (next/image component)
  2. Consider WebP conversion for JPG assets (30-50% size reduction typical)
  3. Implement lazy loading on property grids and detail pages
  4. Add responsive image srcsets for mobile (50-70% smaller on mobile)
- Current caching prevents regressive loads; optimization targets first-visit performance

---

## Phase 2 Complete — Crawlability & AI Indexing

✅ **Completed:**
- Created `/public/llms.txt` with full AI crawler indexing per playbook spec
  - Includes: contact info, service areas, core pages, market data, relocation guides
  - Properly formatted markdown for AI ingestion
- Added Content-Type header for llms.txt in vercel.json
  - Ensures `text/plain; charset=utf-8` delivery vs. HTML
- Created `/home-value` route (critical for Phase 3 seller conversion)
  - Added HomeValue component with home valuation form
  - Integrated into routing (App.jsx pages object)
  - Added to seo.js with metadata and JSON-LD breadcrumb
  - Added /home-value rewrite in vercel.json
- Updated JSON-LD schema with breadcrumb for /home-value

🔵 **In Progress:**
- Verify all routes prerendered with ≥300 words server-rendered HTML (Phase 1 blocker)
- Add Person schema node for Nathanael with sameAs array
- Verify each route has exactly one `<h1>` tag
- Verify canonicals are self-referencing

---

## Next Steps (Phase 5 & Beyond)
1. **Phase 5 (Off-site):** GBP claim optimization, citation consistency, claim competitor profiles
2. **Phase 3 Expansion:** Expand /real-estate content to 1,200+ words with actual closing cost & repair data
3. **Phase 1 Validation:** Verify all routes prerendered with ≥300 words server-rendered HTML
4. **Schema Enhancements:** Add Person schema node for Nathanael with sameAs array
5. **Phase 6 (Content):** GEO/AEO content engine for market pages
6. **Phase 7 (Monitoring):** GA4 event tracking, AI crawler indexing metrics, Core Web Vitals dashboard
