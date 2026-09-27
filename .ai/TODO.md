# TODO

## BLOCKING ISSUES (MUST FIX BEFORE PHASE 2)

### 1. HQ Production Authentication — HIGH PRIORITY
**Status:** Blocked  
**Issue:** Local ADMIN_TOKEN and user-supplied credentials both rejected by production before deployment (commit 0332531). Production env var mismatch.  
**Action:** Do not send passwords in chat. Owner must:
1. Verify actual ADMIN_TOKEN value in Vercel Production environment secrets
2. Update local .env if development/staging uses different token
3. Deploy a build to Vercel
4. Test HQ login at https://www.harbisonstandard.com/hq with correct credentials

**Owner Verification Needed:**
- [ ] Login to Vercel Production project (coaiebay-sources-projects/hswebsite)
- [ ] Check Environment Variables for ADMIN_TOKEN (do not share in chat)
- [ ] Align local .env value or update production if needed
- [ ] Deploy to Vercel
- [ ] Verify /hq access with updated credentials

---

### 2. GA4 / GTM Reporting Verification — HIGH PRIORITY
**Status:** Blocked  
**Issue:** GA4 (G-2Q59BEZ4MJ) and GTM (GTM-M5HK83KW) tags installed in production HTML and src/analytics.js, but actual event collection/reporting unverified. Runtime init may duplicate GA4 loader if static HTML also loads it.  
**Action:** Owner must verify in Google Analytics & GTM accounts:
- [ ] GA4 property is receiving events
- [ ] Custom events (phone_click, property_view, inquiry_submit, etc.) are logged
- [ ] GTM container is deployed and firing tags
- [ ] Conversion tracking for form submissions working
- [ ] Check for duplicate tag loads in gtag debugger

**Code Fix (if consolidation needed):**
- Audit src/analytics.js and index.html for duplicate GA4/GTM loaders
- Move all initialization to src/analytics.js (runtime only)
- Ensure HQ is excluded from tracking

---

### 3. Google Search Console & Bing Sitemap Acceptance — MEDIUM PRIORITY
**Status:** Blocked  
**Issue:** Sitemaps (sitemap.xml, image sitemap) returned 200 at deployment, but indexing acceptance unverified in external accounts.  
**Action:** Owner must:
- [ ] Log into Google Search Console
- [ ] Verify domain ownership (via existing DNS/meta tag)
- [ ] Submit sitemap.xml and image sitemap
- [ ] Monitor Coverage report for crawl errors
- [ ] Log into Bing Webmaster Tools
- [ ] Submit same sitemaps
- [ ] Check indexing progress after 48-72 hours

---

### 4. Google Business Profile — MEDIUM PRIORITY
**Status:** Blocked  
**Issue:** Not claimed or verified in owner's Google account.  
**Action:** Owner must:
- [ ] Search "Harbison Standard Real Estate Bakersfield" on Google Maps
- [ ] Claim business profile if exists, or create if missing
- [ ] Verify ownership via verification method Google offers (postcard, phone, email)
- [ ] Add accurate hours, photos, services, contact info
- [ ] Link to https://www.harbisonstandard.com

---

## PHASE 1 FINALIZATION TASKS (IN PROGRESS)

### 5. Buyer Inquiry Field Consolidation
**Status:** Partial  
**Issue:** HQ manual entry form does not persist buyer preferences, status, or notes. General inquiry message normalization incomplete.  
**Files:** src/Hq.jsx, api/lib/db.mjs  
**Action:**
- [ ] Verify manual HQ entry saves buyer intent (beds, baths, budget, timing)
- [ ] Verify notes field persists when clicking "Save notes" button
- [ ] Test edit/update flow for buyer inquiries
- [ ] Verify general inquiries retain original message (not normalized to "Buying")
- [ ] Test create/readback cycle in staging before verifying in production

---

### 6. Analytics Consolidation Check
**Status:** Partial  
**Issue:** Static index.html may load GA4 tags in addition to runtime init in src/analytics.js.  
**Files:** index.html, src/analytics.js, src/seo.js  
**Action:**
- [ ] Verify index.html does NOT hardcode GA4 loader
- [ ] Verify src/analytics.js loads once and only on non-/hq routes
- [ ] Check browser DevTools → Network for duplicate gtag requests
- [ ] Verify GTM container script loads once
- [ ] Confirm HQ page (localStorage.getItem('isHQ')) excludes analytics

---

### 7. Tracking Accuracy Verification
**Status:** Blocked (needs testing)  
**Issue:** Session upsert may reset visits to 1; visit insert failures ignored but returned as success.  
**Files:** api/track.mjs, supabase/phase1-finalization.sql  
**Action:**
- [ ] Open production browser DevTools → Network
- [ ] Load site, wait 1s, check /api/track requests
- [ ] Reload same page 5+ times in same session
- [ ] Verify session record shows correct visit count (should increment, not reset to 1)
- [ ] Check HQ for session/visit stats; compare to browser behavior
- [ ] Verify tracking does not break page UX on API errors

---

### 8. Apollo Property — Keep Unpublished
**Status:** Active  
**Issue:** Apollo (3304 Apollo St, $299,999.99) was marked "Coming Soon" but user revoked approval. Old campaign URLs exist in history.  
**Files:** src/data.js, src/newListings.js, git history  
**Action:**
- [ ] Verify Apollo does NOT appear in /properties feed
- [ ] Verify /property/apollo returns 404 (not app shell with property data)
- [ ] Do NOT restore Coming Soon status without explicit user authorization
- [ ] Do NOT use old campaign links (they have expired authorization)
- [ ] Keep Apollo property definition in code for future use when authorized

---

## PHASE 2 ROADMAP (POST-LAUNCH)

### 9. Social Scheduling & Content Distribution
**Status:** Not started  
**Issue:** No social media scheduler configured or authorized.  
**Action:**
- [ ] Choose 1 published property (recommendation: start with Wendy Dr $880k, has known buyer interest)
- [ ] Get user approval for property copy/media/messaging
- [ ] Select social scheduler (Buffer, Later, Hootsuite, or manual scheduling)
- [ ] Create tagged links with UTM params (utm_source=social, utm_medium=facebook, utm_campaign=wendy_dr)
- [ ] Schedule posts to Facebook, Instagram, LinkedIn
- [ ] Track clicks/inquiries in HQ
- [ ] Follow up with interested buyers

---

### 10. Paid Media Campaigns
**Status:** Not started  
**Issue:** Google Ads account and Meta Pixel set up but no campaigns active.  
**Action:**
- [ ] Verify Google Ads account (AW-18453840820) linked to Vercel tracking
- [ ] Verify Meta Pixel (VITE_META_PIXEL_ID when configured) installed
- [ ] Create Google Search Ads targeting property addresses and keywords
- [ ] Create Facebook/Instagram lead ads for top property
- [ ] Monitor conversion tracking through analytics + HQ leads
- [ ] Adjust targeting and budget based on results

---

### 11. Open House Scheduling & Management
**Status:** Not started  
**Issue:** Open house form exists for Wendy Dr; no additional open houses scheduled.  
**Action:**
- [ ] Schedule open house dates/times (when properties available)
- [ ] Add to /open-houses page
- [ ] Promote via email, social, Formspree
- [ ] Collect RSVPs through /api/openhouse form
- [ ] Follow up with attendees

---

### 12. Email Marketing Setup
**Status:** Not started  
**Issue:** Formspree handles inquiry notifications; no nurture/follow-up sequence.  
**Action:**
- [ ] Confirm Formspree is delivering to nate85.realtor@gmail.com
- [ ] Set up email automation for lead qualification (optional: Mailchimp, ConvertKit, etc.)
- [ ] Create follow-up sequences for buyers/sellers/investors
- [ ] Monitor response rates and adjust messaging

---

## TECHNICAL DEBT & OPTIMIZATIONS

### 13. SEO Expansion — 15+ New Content Pages (OPTIONAL, Phase 3+)
**Status:** Not started  
**Scope:** Add location guides (Bakersfield, California City, Stallion Springs), buyer intent pages, market reports  
**Files:** src/content/guides/*.md, src/content/blog/*.md  
**Effort:** 4-6 hours  
**Priority:** Low (current 20+ pages cover core needs; can add incrementally)

---

### 14. Image Optimization & CDN Caching
**Status:** Partial  
**Issue:** npm run images exists but force optimization not tested in CI.  
**Files:** scripts/optimize-assets.mjs, vite.config.mjs  
**Action:**
- [ ] Verify WebP/AVIF formats generated for property photos
- [ ] Test cache headers on Vercel (31536000s for /assets/*)
- [ ] Monitor Core Web Vitals (LCP, FID, CLS) in PageSpeed Insights
- [ ] Profile image loading on 4G mobile network

---

### 15. IDX Integration (OPTIONAL, Phase 5+)
**Status:** Not started  
**Scope:** Connect MLS listing feed (Showcase IDX or similar) for 100+ live listings  
**Effort:** 4-8 hours depending on broker integration  
**Priority:** Low (3 published properties sufficient for Phase 1; scale if needed)

---

## DOCUMENTATION & HANDOFF

### 16. Update AGENTS.md with Recent Decisions
**Status:** Pending  
**Action:**
- [ ] Record hero video 9:16 fix (already done Sep 22)
- [ ] Record Phase 1 finalization decisions
- [ ] Remove or update outdated Phase 3/4 notes

---

### 17. Deploy & Verify Checklist
**Status:** Pending  
**Action Before Next Deployment:**
- [ ] npm run build → dist/client/index.html exists
- [ ] npm run test:sites → all tests pass
- [ ] npm run test → all integration tests pass
- [ ] git status → clean working tree
- [ ] git log → commit messages clear
- [ ] Vercel deployment succeeds (check dashboard)
- [ ] https://www.harbisonstandard.com loads (homepage visible)
- [ ] /properties, /about, /contact pages load
- [ ] /hq requires password
- [ ] /api/properties returns JSON
- [ ] Sitemaps at /sitemap.xml and /sitemap-images.xml return 200

---

## NEXT IMMEDIATE STEPS

1. **Owner Verifies HQ Credentials** (Decision 007) → Unblock production HQ access
2. **Owner Verifies GA4 Event Collection** (Decision 009) → Confirm analytics working
3. **Owner Verifies Google Search Console & GBP** (Decisions 024, Section 3) → Enable organic search
4. **Choose First Social Media Property** (Phase 2, Step 9) → Begin Phase 2 launch
5. **Monitor Production Performance** → Track engagement, leads, conversions

---

## BLOCKED UNTIL OWNER VERIFICATION

🔴 **HQ Production Access** — Awaiting ADMIN_TOKEN alignment  
🔴 **GA4 Reporting** — Awaiting Google Analytics account check  
🔴 **Search Console Indexing** — Awaiting owner's sitemap acceptance  
🔴 **GBP Verification** — Awaiting owner's Google Business Profile claim  

All code is deployed and ready. No code changes required until these are verified.
