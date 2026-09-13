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
| **4** | 🟢 Performance & caching | ⏳ Queued | Medium |
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

🔵 **In Progress:**
- Expand /real-estate page content to 1,200+ words with cost data
  - Typical repair costs ($5K-$50K+)
  - Closing cost percentages (2-3%)
  - As-is vs improved ROI data (60-80% recovery typical)
  - Timeline expectations (7-30 days on market)
- Add real cost examples to special situations cards
- Rebuild /past-sales with photo grid and context

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

## Next Steps (Phase 1-2 Completion)
1. Run `npm run build` to verify prerendering works for all routes
2. Measure word counts per route (verify ≥300 words target)
3. Add Person schema node to seo.js for Nathanael Harbison
4. Verify /home-value renders correctly with form
5. Phase 3: Add testimonials, expand /real-estate content, build seller conversion funnel
