# PHASE 1 & 2 OPTIMIZATION AUDIT & IMPLEMENTATION GUIDE
**Harbison Standard** | React/Vite Site Optimization
**Date:** 2026-09-27

---

## EXECUTIVE SUMMARY

**Current Status:** Good foundation, needs image optimization & minor improvements
**Priority Items:** Image compression (HIGH), HTML caching (DONE), Heading structure audit (MEDIUM)
**Estimated Impact:** 15-25 point PageSpeed increase possible

---

## PHASE 1: PERFORMANCE & SPEED

### 1.1 IMAGE OPTIMIZATION (CRITICAL)

**Current Issues:**
- apollo/mapview.png: 572 KB (PNG format - should be WebP)
- sheridan.webp: 1.1 MB (TOO LARGE - target: 300-400 KB)
- pellisier.webp: 702 KB (TOO LARGE - target: 250-350 KB)
- woodshawn.webp: 446 KB (TOO LARGE - target: 250-350 KB)
- Property images: 280-360 KB each (target: 150-200 KB)

**Action Items:**

**1.1.1 - Convert PNG to WebP**
```bash
# apollo/mapview.png (572 KB) → mapview.webp (est. 150-200 KB)
# Use online tool: https://squoosh.app or cwebp CLI
# Steps:
# 1. Download current image
# 2. Upload to squoosh.app
# 3. Set quality: 75-80%
# 4. Export as WebP
# 5. Replace in public/assets/apollo/
```

**1.1.2 - Re-compress WebP Files**
| File | Current | Target | Method |
|------|---------|--------|--------|
| sheridan.webp | 1.1 MB | 300-350 KB | squoosh (quality 70%) |
| pellisier.webp | 702 KB | 250-300 KB | squoosh (quality 72%) |
| woodshawn.webp | 446 KB | 250-300 KB | squoosh (quality 75%) |

**1.1.3 - Property Images Optimization**
- Current: 280-360 KB per image (28 property images)
- Target: 150-200 KB per image
- Potential savings: 2.5-4.5 MB total
- Process:
  1. Use squoosh.app with quality 70-75%
  2. Batch upload 5 at a time
  3. Download all and replace in public/assets/property/

**Estimated Time:** 2-3 hours
**Estimated Savings:** 4-6 MB page weight reduction
**Impact:** 10-15 point PageSpeed increase

### 1.2 BUILD OPTIMIZATION (DONE)

✅ Vite handles minification automatically
✅ Code splitting is configured
✅ Asset versioning with cache busting enabled

**Verification:**
```bash
npm run build
# Look for asset file sizes in build output
# All JS bundles should be <50KB gzipped
```

### 1.3 CACHING STRATEGY (UPDATED)

**✅ Implemented:**
- Assets (1 year cache): `/assets/*` → `max-age=31536000, immutable`
- Media files (1 year cache): `*.webp, *.mp4` → `max-age=31536000, immutable`
- HTML (1 hour cache, Vercel edge cache 24h): `*.html` → `max-age=3600, s-maxage=86400`
- Homepage (same as HTML): `/` → `max-age=3600, s-maxage=86400`

**Verification:**
```bash
# Check HTTP headers on live site:
curl -I https://www.harbisonstandard.com
# Should show: Cache-Control: public, max-age=3600, s-maxage=86400...
```

### 1.4 CODE OPTIMIZATION (DONE)

✅ Minification: Enabled (Vite)
✅ Lazy loading: Images use React lazy loading
✅ Code splitting: Route-based splitting configured

### 1.5 CURRENT PERFORMANCE BASELINE

**Need to verify with Google PageSpeed Insights:**
```
Go to: https://pagespeed.web.dev
Test: https://www.harbisonstandard.com
Note desktop and mobile scores
```

**Current estimate:** 60-70 mobile / 75-85 desktop
**Target:** 80+ mobile / 90+ desktop
**Requirement:** Fix images to reach target

---

## PHASE 2: TECHNICAL SEO

### 2.1 HEADING STRUCTURE AUDIT (VERIFY)

**Current State:** ✅ Good (from code inspection)

**Audit Checklist:**
- [ ] Homepage: One H1 = "It's not what you do. It's how you do it."
- [ ] Each page has unique H1 with keyword
- [ ] No H2/H3 skip levels
- [ ] No multiple H1s per page

**How to verify:**
1. Install free Chrome extension: "Detailed SEO Extension"
2. Visit each page:
   - https://www.harbisonstandard.com/
   - https://www.harbisonstandard.com/about
   - https://www.harbisonstandard.com/properties
   - https://www.harbisonstandard.com/real-estate
   - https://www.harbisonstandard.com/investing
   - https://www.harbisonstandard.com/contact
3. Click extension > "Headings" tab
4. Verify structure: H1 → H2 → H3 (no skips)

**Issues to Fix:**
```
❌ Multiple H1s on one page → Change extras to H2
❌ H1 → H3 (skip H2) → Add H2
❌ H1 without keywords → Rewrite with target keyword
```

### 2.2 SCHEMA MARKUP (VERIFY)

**Current State:** ✅ Good (from seo.js)

**Audit Checklist:**
- [ ] Organization schema on homepage (RealEstateAgent)
- [ ] LocalBusiness schema with address & phone
- [ ] WebPage schema on each route
- [ ] BreadcrumbList on service pages
- [ ] FAQPage schema for FAQ sections

**How to verify:**
1. Go to: https://schema.org/validator
2. Enter URL: https://www.harbisonstandard.com
3. Check for:
   - ✅ "@type": "RealEstateAgent"
   - ✅ "name": "Harbison Standard"
   - ✅ "areaServed": "Kern County, CA"
   - ✅ "telephone": "+1-661-..." (your phone)
   - ✅ "address": {...full address}

### 2.3 META TAGS (VERIFY)

**Current State:** ✅ Implemented

**Audit Checklist by Page:**

| Page | Title | Description | OG Image |
|------|-------|-------------|----------|
| Home | ✅ "Buy, Sell & Invest..." | ✅ "Buy, sell, or invest..." | ✅ hero.webp |
| About | ❓ Need to check | ❓ Need to check | ❓ Need to check |
| Properties | ❓ Need to check | ❓ Need to check | ❓ Need to check |
| Real Estate | ❓ Need to check | ❓ Need to check | ❓ Need to check |
| Investing | ❓ Need to check | ❓ Need to check | ❓ Need to check |
| Contact | ❓ Need to check | ❓ Need to check | ❓ Need to check |

**How to verify:**
```bash
# In browser DevTools, inspect:
# 1. <title> tag
# 2. <meta name="description">
# 3. <meta property="og:title">
# 4. <meta property="og:description">
# 5. <meta property="og:image">
```

**Requirements:**
- Title: 50-60 characters, includes primary keyword
- Description: 150-160 characters, actionable, includes CTA
- OG Image: 1200x630px or larger, relevant to page

### 2.4 ROBOTS.TXT & SITEMAP (VERIFY)

**Current State:** ✅ Well-configured

**Verified Items:**
- ✅ robots.txt correctly structured
- ✅ AI crawler rules (GPTBot, Claude-SearchBot, etc.)
- ✅ Sitemap references
- ✅ /hq disallowed
- ✅ /api/* disallowed except /api/properties

**Sitemap Status:**
- ✅ sitemap.xml generated
- ✅ sitemap-images.xml generated
- ✅ All routes included
- ✅ Proper lastmod dates

**Verification:**
```bash
# Check sitemaps are accessible:
curl https://www.harbisonstandard.com/sitemap.xml | head -30
curl https://www.harbisonstandard.com/sitemap-images.xml | head -30
```

### 2.5 CANONICAL TAGS (VERIFY)

**Current State:** ✅ Implemented

**Audit Checklist:**
- [ ] Every page has canonical tag
- [ ] Canonical points to self (not another version)
- [ ] No canonical conflicts

**How to verify:**
```bash
# Check canonical tag on each page:
curl https://www.harbisonstandard.com/ | grep canonical
curl https://www.harbisonstandard.com/about | grep canonical
curl https://www.harbisonstandard.com/properties | grep canonical
```

**Expected output:**
```html
<link rel="canonical" href="https://www.harbisonstandard.com/">
<link rel="canonical" href="https://www.harbisonstandard.com/about">
<link rel="canonical" href="https://www.harbisonstandard.com/properties">
```

### 2.6 BROKEN LINKS AUDIT (ACTION REQUIRED)

**Tool Options:**
1. **Free:** Screaming Frog (free tier = 500 URLs)
   - Download from: https://www.screamingfrog.co.uk/seo-spider/
   - Steps:
     1. Open Screaming Frog
     2. Enter URL: https://www.harbisonstandard.com
     3. Start crawl (takes 5-10 minutes)
     4. Filter for "Errors" and "Redirects"
     5. Fix any 404s or broken external links

2. **Online:** broken-link-checker.com
   - Go to: https://www.brokenlinkcheck.com/
   - Enter URL, wait for scan

**Action Items if Found:**
- [ ] Fix broken internal links (404s)
- [ ] Update broken external links
- [ ] Add missing rel="external" to outbound links

---

## IMPLEMENTATION TIMELINE

### Week 1 - Phase 1 (Performance)
- **Day 1:** Image optimization (2-3 hours of batch processing)
- **Day 2:** Test PageSpeed Insights
- **Day 3:** Deploy optimized images to production

### Week 1-2 - Phase 2 (Technical SEO)
- **Day 4:** Heading structure audit (30 min)
- **Day 5:** Schema markup verification (30 min)
- **Day 6:** Meta tags audit per page (1 hour)
- **Day 7:** Broken links audit (1-2 hours)
- **Day 8:** Fix any issues found (1-2 hours)

---

## SUCCESS METRICS

**Phase 1 Complete When:**
- ✅ All images < 400 KB (except hero < 500 KB)
- ✅ PageSpeed mobile score > 75
- ✅ PageSpeed desktop score > 85
- ✅ Build completes in < 30 seconds

**Phase 2 Complete When:**
- ✅ All pages have unique H1 with keywords
- ✅ No skipped heading levels
- ✅ Schema markup validates with errors: 0
- ✅ All internal links return 200
- ✅ All page titles & descriptions follow template

---

## COST-BENEFIT ANALYSIS

| Task | Time | Impact | ROI |
|------|------|--------|-----|
| Image optimization | 2-3 hrs | +15 PageSpeed pts | HIGH |
| Caching headers | Done | +5 PageSpeed pts | DONE |
| Heading audit | 30 min | +SEO signal | MEDIUM |
| Schema verification | 30 min | +ranking potential | MEDIUM |
| Meta tags audit | 1 hr | Consistency | MEDIUM |
| Broken links fix | 1-2 hrs | User trust | LOW |

**Total Time:** 5-8 hours over 2 weeks
**Total Impact:** 20-30 point PageSpeed increase + improved SEO signals

---

## NEXT STEPS

1. ✅ **DONE:** Updated vercel.json with HTML caching headers
2. **TODO:** Optimize images (external tool - squoosh.app)
3. **TODO:** Audit heading structure (manual verification)
4. **TODO:** Verify schema markup (validator.schema.org)
5. **TODO:** Deploy changes and re-test PageSpeed

---

**Created:** 2026-09-27
**Updated:** 2026-09-27
**Status:** Ready for Phase 1 implementation
