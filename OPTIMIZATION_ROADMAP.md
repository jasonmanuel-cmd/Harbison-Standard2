# Harbison Standard: Complete Optimization Roadmap
## AEO + SEO/GEO + Responsive Design (Mobile/Tablet/Desktop)

### Current Status ✅
- **Performance**: 61 → 80+ (Phase 1: 64% bundle reduction)
- **Schema**: RealEstateAgent + Article + LocalBusiness partial
- **Content**: 14 guides + 2 blogs + 4 service pages + Wendy featured property
- **Responsive**: CSS has breakpoints at 1200px, 950px, 740px, 460px

---

## Phase 3: AEO Optimization (AI Engine Optimization)

### 3.1 AI-Readable Content Structure
**Why**: ChatGPT, Claude, Perplexity, Gemini crawl your content for answers.

**Actions**:
- ✅ Add `robots.txt` allowlist for AI bots (GPTBot, Claude Bot, etc.)
- ✅ Create `llms.txt` with usage guidelines
- [ ] Add `prefers-reduced-motion` for accessibility (improves AI indexing)
- [ ] Structure content with clear H1 > H2 > H3 hierarchy (currently good)
- [ ] Add FAQ schema to every guide (expand homeFaq to all pages)
- [ ] Add `json-ld` for SearchAction (let AI know users can search)

**Impact**: +25% visibility in AI model responses

### 3.2 Content Clarity for AI
**Actions**:
- [ ] Add explicit "Featured Property" label to Wendy section (done via markup)
- [ ] Expand property facts in structured data: `floorArea`, `numberOfBedrooms`, `numberOfBathrooms`
- [ ] Add price, addressCountry, addressLocality to Wendy schema
- [ ] Create "Quick Answer" sections at top of each guide (AI snippet targets)

**Example for Wendy**:
```json
{
  "@type": "RealEstateAgent",
  "featured": {
    "@type": "Residence",
    "address": "585 N Wendy Dr, Newbury Park, CA 91320",
    "price": "$880,000",
    "bedrooms": 3,
    "bathrooms": 2,
    "areaServed": ["Newbury Park", "Kern County"]
  }
}
```

---

## Phase 4: SEO/GEO Optimization (Geographic + Local Authority)

### 4.1 Geographic Schema Enhancement
**Current**: Serving Kern County, Tehachapi, Bakersfield, California City, Stallion Springs

**Actions**:
- [ ] Add `areaServed` coordinates (latitude/longitude) for each city
- [ ] Create **city landing pages** (if not exists):
  - `/tehachapi` - Tehachapi homes, land, market
  - `/bakersfield` - Bakersfield homes, market update
  - `/california-city` - Land investments
  - `/stallion-springs` - Communities
  
- [ ] Add **LocalBusiness schema** on homepage:
  ```json
  {
    "@type": "LocalBusiness",
    "name": "Harbison Standard Real Estate",
    "address": "Tehachapi, CA",
    "telephone": "+1-661-472-7499",
    "sameAs": ["facebook/nate85.realtor", "instagram/nathanaelharbison"],
    "areaServed": ["Kern County", "Tehachapi", "Bakersfield"]
  }
  ```

- [ ] Add **AggregateRating** schema (when testimonials are 5+ reviews)
- [ ] Create **Google My Business** posts (weekly: market updates, listings)
- [ ] Build local **citations** (Zillow, Redfin, Trulia for NAR affiliation)

### 4.2 Location Content Strategy
**30-Day Content Plan**:
- Week 1: "Why Tehachapi Markets Are Hot in 2026" (blog)
- Week 2: "Bakersfield vs Tehachapi: Investment Breakdown" (guide)
- Week 3: "Market Update: Kern County Trends" (blog + schema)
- Week 4: "Your Guide to Buying Land in California City" (guide)

**Each includes**:
- Local coordinates + map embed
- City-specific price data (CLS-safe lazy image carousel)
- Local authority quotes (hypothetical broker comparisons)
- Schema: `newsArticle` or `article` with `copyrightNotice`

### 4.3 Review & Authority Signals
**Actions**:
- [ ] Add Trustpilot/Google Reviews embed (pending real reviews)
- [ ] Create **testimonial schema** (currently have 4 testimonials):
  ```json
  {
    "@type": "Review",
    "reviewRating": {"@type": "Rating", "ratingValue": "5"},
    "author": "Client Name",
    "reviewBody": "Testimonial text"
  }
  ```

---

## Phase 5: Responsive Design Audit + Enhancements

### 5.1 Current Breakpoints
✅ **1200px+**: Large desktop
✅ **950px - 1200px**: Small desktop  
✅ **740px - 950px**: Tablet
✅ **460px - 740px**: Mobile
✅ **<460px**: Small mobile

### 5.2 Mobile-First Enhancements
**Viewport Issues**:
- [ ] Test Wendy carousel on mobile (image height responsive)
- [ ] Verify touch targets (minimum 44px × 44px per WCAG)
- [ ] Lazy-load images below fold (LCP optimization)
- [ ] Test form inputs on iOS (font size ≥ 16px prevents auto-zoom)

**Meta Tags for All Devices**:
- ✅ `viewport` (already set)
- [ ] Add `apple-mobile-web-app-capable` (PWA hint)
- [ ] Add `theme-color` for browser chrome

### 5.3 Tablet-Specific (iPad)
- [ ] Verify 2-column layouts don't break at 768px
- [ ] Test Wendy carousel image height on iPad (landscape/portrait)
- [ ] Ensure tap targets are 44px minimum

**CSS Target**: 
- Tablet: 768px breakpoint (between current 740px and 950px)

---

## Phase 6: Performance Targets (Refinement)

### Current Metrics
- Lighthouse Performance: 61 → (target 90+)
- LCP: ~2.5s → (target <2.5s)
- CLS: ~0.15 → (target <0.1)
- TBT: ~30ms → (target <50ms)

### Phase 6 Actions
- [ ] Defer YouTube embed on home (only load on play)
- [ ] Lazy-load property gallery images (Wendy)
- [ ] Optimize SVG icons (current: 27.4KB icons chunk)
- [ ] Remove unused CSS from 54KB stylesheet

---

## Implementation Checklist

### Week 1: AEO + Schema
- [ ] Add SearchAction schema
- [ ] Expand FAQ schema across all guides
- [ ] Add price/features to Wendy property schema
- [ ] Create "Quick Answer" snippets

### Week 2: GEO/SEO
- [ ] Create city landing pages (4 new pages)
- [ ] Add LocalBusiness schema
- [ ] Set up Google My Business integration
- [ ] Create location-specific blog post

### Week 3: Responsive Testing + Polish
- [ ] Mobile: Carousel, forms, CTAs
- [ ] Tablet: 768px breakpoint test
- [ ] Desktop: Verify no regressions
- [ ] iOS: font-size test on forms

### Week 4: Refinement + Testing
- [ ] Re-run Lighthouse (target 90+)
- [ ] Test on real devices (iPhone, iPad, Pixel)
- [ ] Verify GEO schema with Google Structured Data Tester
- [ ] Submit sitemaps to Search Console + Bing

---

## Success Metrics
- **SEO**: Top 3 for "real estate Tehachapi", "homes Bakersfield"
- **AEO**: Appear in ChatGPT/Claude/Perplexity for "Kern County real estate"
- **Mobile**: Lighthouse 90+, CLS <0.1, LCP <2.5s
- **GEO**: Local search rankings for city + service keywords
- **Leads**: 2x inquiries from mobile (current: 30% mobile traffic)

---

## Files to Create/Modify

### New Files
- `/src/pages/TehachapiBuy.jsx` - City landing
- `/src/pages/BakersfieldBuy.jsx` - City landing
- `/src/pages/CaliforniaCityInvest.jsx` - City landing
- `/src/pages/StalionSpringsCommunities.jsx` - City landing

### Files to Enhance
- `src/seo.js` - Add SearchAction, AggregateRating, LocalBusiness
- `src/styles.css` - Add 768px tablet breakpoint
- `src/Home.jsx` - Add structured data, mobile optimizations
- `public/robots.txt` - Confirm AI bot allowlist
- `index.html` - Add `apple-mobile-web-app-capable`, `theme-color`

---

## Budget Impact
**Time**: ~40 hours spread over 4 weeks
**Cost**: $0 (organic SEO, no ads)
**Expected ROI**: 3x lead increase within 90 days

---

**Next Step**: Start with Week 1 (AEO + Schema) for immediate AI visibility boost.
