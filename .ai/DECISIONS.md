# PROJECT DECISIONS

## Decision 001: Brand & Domain Identity

**Date:** September 6, 2026
**Decision:** Brand name is "Harbison Standard"; Compass references explicitly excluded from entire site. Domain is harbisonstandard.com with bare domain redirect to www.
**Reason:** User explicitly separated brand identity from Compass profile. Biographical data originated from Compass profile but agent operates independently.
**Files affected:** src/App.jsx, src/seo.js, public/sitemap.xml, public/robots.txt, index.html, vercel.json
**Status:** Active

---

## Decision 002: Visual Design Lock

**Date:** September 6, 2026
**Decision:** Current layout, colors (navy #031c2b, gold #edc66f, cream #f6f5ef), typography (Libre Caslon headings, Open Sans body), spacing, component anatomy are LOCKED. No visual changes permitted without explicit user request.
**Reason:** Established visual identity; prevent scope creep and unintended design drift during content/feature work.
**Files affected:** src/styles.css, src/Home.jsx, src/PropertyPages.jsx, src/components/*
**Status:** Active — enforced on every task

---

## Decision 003: Service Scope — Real Estate & Investment Only

**Date:** September 10, 2026 (supersedes earlier building/development services)
**Decision:** Remove all building/development/YouTube-build CTA messaging. Harbison Standard now covers real estate and investment property only.
**Reason:** User explicitly removed all building-related content to narrow service focus to Kern County real estate and investment.
**Files affected:** src/Home.jsx, src/serviceData.js, AGENTS.md (records removal)
**Status:** Active

---

## Decision 004: Property Inventory — Three Published, Apollo Unpublished

**Date:** September 10, 2026
**Decision:** Current published inventory: Mariposa Rd ($40k), Chalet Dr ($199k), Wendy Dr ($880k). Apollo (3304 Apollo St, $299,999.99) remains unpublished; do not restore Coming Soon or distribute old campaign links.
**Reason:** User explicitly confirmed Apollo cannot be listed yet; old campaign authorization expired.
**Files affected:** src/data.js, src/newListings.js, scripts/prerender-metadata.mjs, sitemap generation
**Status:** Active

---

## Decision 005: CRM Backend — Supabase Primary, Neon Legacy

**Date:** September 10, 2026 (updated from Sept 6 Neon-only decision)
**Decision:** Supabase (pebqmuumwygrpjofdwfy) is active inquiry/tracking backend. Legacy Neon files retained for backwards compatibility but not actively used.
**Reason:** User corrected Supabase project ID mid-development; Supabase offers better integration with Vercel.
**Files affected:** api/lib/db.mjs, api/buyer-lead.mjs, api/lead.mjs, api/track.mjs, src/LeadForm.jsx
**Status:** Active — Neon deprecated but kept

---

## Decision 006: Lead Form Strategy — Formspree Primary, Supabase Secondary

**Date:** September 6, 2026
**Decision:** Formspree (xqpkdwrp) is primary delivery channel for all forms. Every lead form also writes non-blockingly to CRM via POST /api/lead. Formspree response drives success state; CRM write failures do not break UX.
**Reason:** Email delivery guarantees (Formspree) override API reliability; CRM is for internal tracking, not blocking customer flow.
**Files affected:** src/LeadForm.jsx, src/BuyerIntentForm.jsx, src/QuickForm.jsx, api/buyer-lead.mjs, api/lead.mjs
**Status:** Active

---

## Decision 007: HQ Admin — Vercel Function, Bearer Token Auth, /hq Route

**Date:** September 6, 2026
**Decision:** Password-protected SPA at /hq with ADMIN_TOKEN bearer token auth (SHA-256 + timingSafeEqual). No site chrome rendered on /hq. noindex, nofollow, excluded from tracking and analytics.
**Reason:** Separate concerns: public site remains indexable; admin area is excluded from search and analytics.
**Files affected:** src/Hq.jsx, src/App.jsx, src/seo.js, api/lib/auth.mjs, public/robots.txt, vercel.json
**Status:** Active

---

## Decision 008: SEO — Per-Page Meta, JSON-LD, Structured Data

**Date:** September 6, 2026
**Decision:** Every page has: meta title/description, canonical URL, Open Graph, Twitter cards, JSON-LD schemas (RealEstateAgent, WebPage, BreadcrumbList, FAQPage, etc.). Single source of truth for FAQ: seo.js (homepage) + serviceData.js (services) + Pages.jsx (contact).
**Reason:** Technical SEO overhaul; prevent drift between visible FAQ and schema.
**Files affected:** src/seo.js (31KB), src/serviceData.js, src/Pages.jsx, index.html, scripts/prerender-metadata.mjs
**Status:** Active

---

## Decision 009: Analytics — Single GA4/GTM Init, HQ Excluded

**Date:** September 21, 2026 (refined Sept 10)
**Decision:** Analytics initialization lives in src/analytics.js only. Loads GA4 (G-2Q59BEZ4MJ) and GTM (GTM-M5HK83KW) once per session. HQ is excluded from tracking via runtime checks.
**Reason:** Prevent duplicate loaders; protect admin privacy; accurate user behavior tracking.
**Files affected:** src/analytics.js, src/seo.js, src/App.jsx
**Status:** Active — pending consolidation verification in GA4 account

---

## Decision 010: Property Prerendering — Full React UI at Build Time

**Date:** September 10, 2026 (supersedes metadata-only approach)
**Decision:** Property pages render full existing React UI at build time, not just metadata. Embed normalized public property data and hydrate components in browser. Keep initial content visible if API unavailable.
**Reason:** Crawlability; SEO; graceful fallback if API unreachable.
**Files affected:** scripts/prerender-metadata.mjs, src/PropertyPages.jsx, src/App.jsx
**Status:** Active

---

## Decision 011: Tracking — Atomic Session/Visit Writes, First-Party Cookie

**Date:** September 10, 2026
**Decision:** src/track.js sets first-party session cookie (hs_sid) and beacons page views to POST /api/track on every route change. Session/visit writes are atomic via Supabase stored procedure (record_hs_visit).
**Reason:** Real-time tracking; prevent double-counting concurrent visits; fire-and-forget (never break the page).
**Files affected:** src/track.js, api/track.mjs, supabase/phase1-finalization.sql
**Status:** Active

---

## Decision 012: Content Pages — Markdown-Based System with Dynamic Routes

**Date:** September 21, 2026
**Decision:** 15+ guides and 5+ blog posts in markdown with YAML frontmatter. ContentRouter component renders guides and blogs. Routes auto-generated in vercel.json and sitemap.
**Reason:** Scalable content management without database complexity; leverage existing patterns.
**Files affected:** src/components/ContentRouter.jsx, src/content/guides/*.md, src/content/blog/*.md, vercel.json, scripts/prerender-metadata.mjs
**Status:** Active

---

## Decision 013: Bare Domain & Org Redirects

**Date:** September 10, 2026
**Decision:** Bare domain harbisonstandard.com and .org variants redirect to https://www.harbisonstandard.com (permanent 301).
**Reason:** SEO best practice; single canonical domain.
**Files affected:** vercel.json (redirects section)
**Status:** Active

---

## Decision 014: Site Chrome — Consistent Header/Footer Across All Public Pages

**Date:** September 6, 2026
**Decision:** Header (logo, nav, CTA), footer (address, contact, social links), and mobile contact bar present on all public pages except /hq.
**Reason:** Brand consistency; accessibility; easy navigation.
**Files affected:** src/App.jsx, src/SocialLinks.jsx
**Status:** Active

---

## Decision 015: Open House Integration — Wendy Drive Only

**Date:** September 12, 2026
**Decision:** /api/openhouse form accepts Wendy Dr inquiries; Formspree + Supabase save. Do not invent open-house dates or properties.
**Reason:** User supplied one open-house property; prevent overreach.
**Files affected:** api/openhouse.mjs, api/openhouse-log.mjs, vercel.json rewrites
**Status:** Active

---

## Decision 016: IndexNow Submission — Manual + Cron

**Date:** September 18, 2026
**Decision:** npm run indexnow command submits URLs manually. Hourly cron job at /api/indexnow for automated submission after build/deployment.
**Reason:** Search engine indexing acceleration; property updates reflected quickly.
**Files affected:** api/indexnow.js, scripts/submit-indexnow.mjs, vercel.json (crons)
**Status:** Active — IndexNow key not yet configured in repo

---

## Decision 017: Private Sale & Off-Market Pages

**Date:** September 23, 2026
**Decision:** Separate /private-sale and /off-market-deals pages for non-MLS inventory.
**Reason:** User requested distinct inventory categories.
**Files affected:** src/data/PrivateSale.jsx, src/data/OffMarketDeals.jsx, vercel.json rewrites, App.jsx routes
**Status:** Active

---

## Decision 018: San Diego References Removed

**Date:** September 10, 2026
**Decision:** Remove all San Diego service area and past-sales references. Kern County is service focus.
**Reason:** Geographic scope narrowing; accuracy.
**Files affected:** src/data.js, src/Home.jsx, past-sales data
**Status:** Active

---

## Decision 019: Video & Media Attribution

**Date:** September 10, 2026
**Decision:** Preserve visible attribution on Google Street View and map images. Walkthrough video optional until supplied.
**Reason:** Respect source attribution; avoid legal/ethical issues.
**Files affected:** src/PropertyPages.jsx, src/components/VideoSplash.jsx
**Status:** Active

---

## Decision 020: Hero Video Mobile Fix — 9:16 Aspect Ratio

**Date:** September 22-25, 2026
**Decision:** Mobile hero uses aspect-ratio: 9/16 (vertical); background-size: 100% auto; height: auto; min-height: 480px. Background image URL restored.
**Reason:** User reported fix requested 30+ times; 9:16 aspect ratio fills mobile viewport without crop/letterbox.
**Files affected:** src/styles.css (@media max-width: 740px)
**Status:** Active — deployed commit efcd8eb

---

## Decision 021: Vercel API Compatibility — Web Request/Response

**Date:** September 10, 2026
**Decision:** All API handlers export { fetch: handler } and use Web Request/Response API (not Node.js-specific). Compatible with Vercel Node functions and local shim.
**Reason:** Future-proof against runtime changes; works locally and in production without modification.
**Files affected:** api/*.mjs, scripts/dev-api.mjs, vercel.json
**Status:** Active

---

## Decision 022: Sites Packaging — Intact & Tested

**Date:** September 10, 2026
**Decision:** Keep .openai/hosting.json, worker/index.js, scripts/prepare-sites-build.mjs, tests/sites-worker.test.mjs intact. npm run build and npm run test:sites must pass before Sites handoff.
**Reason:** Allow prototype to be handed to OpenAI Sites without code changes.
**Files affected:** .openai/hosting.json, worker/index.js, scripts/prepare-sites-build.mjs, tests/sites-worker.test.mjs
**Status:** Active — build passes, tests pass

---

## Decision 023: Email Contact & DRE License

**Date:** September 6, 2026
**Decision:** Email is nate85.realtor@gmail.com (user override of Compass email). DRE license is 02059393. Phone: (661) 472-7499. Social: Facebook, Instagram, YouTube, LinkedIn (all linked).
**Reason:** Accurate agent contact; legal compliance.
**Files affected:** src/data.js, vercel.json, public/sitemap.xml
**Status:** Active

---

## Decision 024: Robots.txt — Allow /api/properties, Disallow /api/*, /hq

**Date:** September 10, 2026
**Decision:** robots.txt allows GET /api/properties; disallows /api/*, /hq, and other private endpoints. Property pages crawlable.
**Reason:** SEO for properties; privacy for CRM and admin.
**Files affected:** public/robots.txt (generated)
**Status:** Active

