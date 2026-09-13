# Harbison Standard Marketing Site — Playbook Implementation
**Started:** 2026-09-13  
**Target Score:** 7.3 → 9.3 / 10

## Phase Implementation Roadmap

| Phase | Task | Status | Priority |
|-------|------|--------|----------|
| **0** | Baseline measurement | 🔵 IN PROGRESS | Must do first |
| **1** | 🔴 Prerender all routes | ⏳ Queued | CRITICAL |
| **2** | 🔴 Crawlability + llms.txt + schema | ⏳ Queued | CRITICAL |
| **3** | 🟡 Seller conversion path | ⏳ Queued | High |
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

(Results will be added as testing completes)

---

## Next Steps
1. Test current word count per route (Phase 0)
2. Analyze prerender.metadata.mjs to understand current setup
3. Extend prerender to all routes (Phase 1)
4. Create llms.txt file (Phase 2)
5. Enhance schema with Person node (Phase 2)
