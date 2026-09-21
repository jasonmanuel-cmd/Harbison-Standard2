# Harbison Standard — Complete Codebase Overview

**Last Updated:** September 19, 2026  
**Repository:** https://github.com/jasonmanuel-cmd/Harbison-Standard2  
**Production:** https://www.harbisonstandard.com  
**Hosting:** Vercel (coaiebay-sources-projects/hswebsite)

---

## 📊 Executive Summary

**Harbison Standard** is a modern real estate and investment website built for Nathanael Harbison, a California REALTOR® (DRE #02059393) serving Kern County. The site combines:
- **React 19 + Vite 6** SPA with pre-rendering
- **Supabase + PostgreSQL** backend for property & lead data
- **Vercel Serverless** API routes for integrations
- **Comprehensive SEO + Analytics** infrastructure
- **Multi-channel lead tracking** (Formspree, Supabase, Google Ads)

**Current Status:**
- ✅ Phase 1 (Technical SEO): 95% Complete
- 🔄 Phase 3 (Content System): 60% Complete
- ✅ Phase 5 (Performance): Complete
- ⏳ Phase 6 (Authority + Conversion Tracking): In Progress
- 📝 Google Ads tracking: Just implemented (Sept 19)

---

## 📁 Project Structure

```
Harbison-Standard2/
├── .claude/                          # Claude Code configuration
├── .agents/                          # Claude agent skills
│   └── skills/                       # Neon database agent skills
├── .openai/                          # OpenAI Sites deployment config
├── .vercel/                          # Vercel project config
├── api/                              # Vercel API routes (serverless functions)
│   ├── lib/                          # Shared utilities
│   ├── openhouse-log/                # Open house registration endpoint
│   └── [other API routes]
├── lib/                              # Shared backend utilities
├── public/                           # Static assets & public files
│   ├── .well-known/                  # AI.txt, security.txt
│   ├── assets/                       # Images, logos, optimized media
│   │   ├── apollo/                   # Apollo campaign assets
│   │   ├── optimized/                # Compressed images
│   │   ├── property/                 # Property photos
│   │   └── sold/                     # Sold property archives
│   ├── robots.txt                    # Search engine crawling rules
│   ├── sitemap.xml                   # Auto-generated XML sitemap
│   └── llms.txt                      # AI model usage guidelines
├── src/                              # React application source
│   ├── components/                   # React UI components
│   │   ├── ContentPage.jsx           # Markdown content renderer
│   │   ├── QuickForm.jsx             # Lead capture form
│   │   ├── LeadForm.jsx              # Detailed lead form
│   │   ├── PropertyPages.jsx         # Property listing & detail pages
│   │   ├── OpenHousesPage.jsx        # Open house listings
│   │   ├── PastSalesPage.jsx         # Sold property showcase
│   │   ├── Hq.jsx                    # Private admin panel (/hq)
│   │   ├── ServicePage.jsx           # Dynamic service pages
│   │   ├── SocialLinks.jsx           # Social media links
│   │   └── [others]
│   ├── content/                      # Markdown content files
│   │   ├── blog/                     # Blog posts (5+ files)
│   │   └── guides/                   # Educational guides (3+ files)
│   ├── data/                         # Content & data definitions
│   │   ├── ContentPages.jsx          # Dynamic page routing
│   │   ├── MarketPages.jsx           # Market analysis pages
│   │   ├── index.jsx                 # Agent & company data
│   │   └── [other data]
│   ├── schemas/                      # JSON-LD schema definitions
│   ├── utilities/                    # Helper functions
│   │   ├── imageUtils.js             # Image alt text & optimization
│   │   └── linkingUtils.js           # Internal linking helpers
│   ├── utils/                        # Utilities
│   │   ├── contentLoader.js          # Markdown parser
│   │   └── [other utils]
│   ├── hooks/                        # React custom hooks
│   ├── App.jsx                       # Root React component
│   ├── Pages.jsx                     # Page components
│   ├── main.jsx                      # Entry point
│   ├── analytics.js                  # Analytics initialization (GTM, GA4, Google Ads, Meta Pixel)
│   ├── seo.js                        # SEO utilities & schema generators
│   ├── styles.css                    # Main stylesheet
│   └── [other components]
├── scripts/                          # Build & automation scripts
│   ├── prepare-sites-build.mjs       # OpenAI Sites build prep
│   ├── prerender-metadata.mjs        # Schema metadata prerendering
│   ├── submit-indexnow.mjs           # IndexNow submission
│   ├── dev-api.mjs                   # Local API shim
│   └── [other scripts]
├── tests/                            # Test files
│   └── sites-worker.test.mjs         # OpenAI Sites worker tests
├── deliverables/                     # Design handoff & documentation
│   └── harbison-design-handoff/
├── docs/                             # Additional documentation
├── audit-results/                    # Audit reports
├── index.html                        # HTML template (Vite entry point)
├── vite.config.mjs                   # Vite build configuration
├── package.json                      # Dependencies & scripts
├── IMPLEMENTATION_STATUS.md          # SEO roadmap & phase status
├── PHASE_3_COMPLETION.md             # Phase 3 details
├── PLAYBOOK_IMPLEMENTATION.md        # Implementation tracking
├── LAUNCH_ROADMAP.md                 # Remaining work
├── PROJECT_STATUS.md                 # Known issues & status
├── GOOGLE_ADS_TRACKING_IMPLEMENTATION.md  # New: Analytics setup
├── AGENTS.md                         # Claude agent documentation
└── README.md                         # Project documentation

```

---

## 🔧 Technology Stack

### Frontend
| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 19.2.0 | Component-based UI |
| **Build Tool** | Vite 6.4.2 | Fast bundling & HMR |
| **Styling** | CSS-in-JS + Vanilla CSS | Responsive design |
| **Icons** | @phosphor-icons/react | UI iconography |
| **Content** | Markdown with YAML frontmatter | Blog & guide management |

### Backend
| Service | Purpose | Status |
|---------|---------|--------|
| **Vercel Serverless** | API routes & functions | ✅ Active |
| **Supabase PostgreSQL** | Property, lead, inquiry storage | ✅ Active |
| **Formspree** | Email notification channel | ✅ Active |
| **Neon (Legacy)** | Retained for compatibility | ⚠️ Not in use |

### Analytics & Tracking
| Platform | Purpose | Status |
|----------|---------|--------|
| **Google Tag Manager (GTM)** | Event tracking hub | ✅ ID: GTM-M5HK83KW |
| **Google Analytics 4 (GA4)** | Traffic & behavior analytics | ✅ ID: G-2Q59BEZ4MJ |
| **Google Ads Conversion Tracking** | Conversion measurement | ✅ ID: AW-18453840820 (NEW) |
| **Meta Pixel (Facebook)** | Retargeting & conversion tracking | ✅ Configured |
| **Vercel Web Analytics** | Performance & uptime monitoring | ✅ Active |
| **Vercel Speed Insights** | Core Web Vitals monitoring | ✅ Active |

### Deployment & Infrastructure
| Component | Details |
|-----------|---------|
| **Primary Host** | Vercel (US) |
| **Fallback Host** | OpenAI Sites (backup) |
| **Database** | Supabase (PostgreSQL) |
| **DNS** | Vercel managed |
| **SSL/TLS** | Automatic (Let's Encrypt) |
| **CDN** | Vercel Edge Network |

---

## 📄 Key Features & Pages

### Core Pages
| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `Home.jsx` | Hero, featured properties, value props |
| `/properties` | `PropertiesPage.jsx` | Active listings grid |
| `/property/:slug` | `PropertyDetailPage.jsx` | Individual property detail |
| `/past-sales` | `PastSalesPage.jsx` | Photo grid of sold properties |
| `/open-houses` | `OpenHousesPage.jsx` | Upcoming open house events |
| `/about` | `About.jsx` | Agent background & credentials |
| `/contact` | `Contact.jsx` | Contact form & agency info |
| `/home-value` | `HomeValue.jsx` | Home valuation calculator |

### Service Pages (Dynamic)
| Route | Purpose |
|-------|---------|
| `/real-estate` | General real estate guidance |
| `/investing` | Investment property focus |
| `/why-tehachapi` | Market education - Tehachapi |

### Content Pages (Dynamic Markdown-based)
| Route | Type | Purpose |
|-------|------|---------|
| `/cheap-land-kern-county` | Guide | Under-50k land opportunities |
| `/bakersfield-home-prices` | Market | Market pricing analysis |
| `/tehachapi-home-prices` | Market | Market pricing analysis |
| `/moving-from-los-angeles-to-bakersfield` | Guide | Relocation guidance |

### Admin & Special Pages
| Route | Purpose | Access |
|-------|---------|--------|
| `/hq` | Admin dashboard | ADMIN_TOKEN required |
| `/private-sale` | Private off-market deals | Public (SEO optimized) |

---

## 🔐 Environment Configuration

### Required (Production)
```env
SUPABASE_URL=https://[project].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
ADMIN_TOKEN=[secure-token]
```

### Analytics & Tracking (Optional but Configured)
```env
VITE_GA4_ID=G-2Q59BEZ4MJ
VITE_GTM_ID=GTM-M5HK83KW
VITE_GOOGLE_ADS_ID=AW-18453840820
VITE_META_PIXEL_ID=[meta-pixel-id]
VITE_GOOGLE_SITE_VERIFICATION=[verification-code]
```

### Fallback Support (Legacy)
```env
DATABASE_URL=[legacy-neon-database-url]
SUPABASE_ANON_KEY=[optional-anon-key]
```

### Important Notes
- ⚠️ **Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser code** (no `VITE_` prefix)
- ⚠️ **Never commit `.env` files** to Git
- ✅ Use `.env.example` for documentation
- ✅ Use `.env.production.example` for production config reference

---

## 📊 SEO Implementation Status

### Phase 1: Technical SEO ✅ (95% Complete)

**Core Setup:**
- ✅ XML Sitemap (`/public/sitemap.xml`) - auto-generated
- ✅ robots.txt - GPTBot, PerplexityBot, Claude-Web, Google-Extended allowed
- ✅ AI usage guidelines (`/.well-known/ai.txt`)
- ✅ Security contact (`/.well-known/security.txt`)
- ✅ llms.txt - AI content usage guidelines

**Schema Markup:**
- ✅ RealEstateAgent schema
- ✅ Organization schema
- ✅ WebSite schema
- ✅ LocalBusiness schema
- ✅ Article/Blog schemas
- ✅ VideoObject schema
- ✅ FormAction schema
- ✅ FAQPage schema
- ✅ Breadcrumb navigation schema
- ✅ Review/Rating schema (for properties)

**On-Page Elements:**
- ✅ Meta tags (description, OG, Twitter, viewport)
- ✅ Canonical URLs
- ✅ Open Graph images
- ✅ Mobile optimization (viewport, responsive)

### Phase 3: Content System 🔄 (60% Complete)

**Implemented:**
- ✅ Markdown parser with YAML frontmatter
- ✅ 5 content files (3 guides + 2 blog posts)
- ✅ Dynamic content routing
- ✅ Table of Contents generation
- ✅ Reading time calculation
- ✅ Related content suggestions
- ✅ CTA integration (forms + contact buttons)

**In Progress:**
- 📝 10 additional guides (to reach 15 total)
- 📝 Blog content expansion
- 📝 Monthly market reports

### Phases 4-6: Performance & Authority ✅ (Partial)

**Phase 4: Performance & Caching ✅**
- ✅ Image optimization & lazy loading
- ✅ Font preloading strategy
- ✅ Cache headers for assets
- ✅ Code splitting

**Phase 5: Performance Optimization ✅**
- ✅ Core Web Vitals optimization
- ✅ Mobile rendering
- ✅ Video splash screen optimization
- ✅ Payload reduction (images & fonts)

**Phase 6: Authority + Conversion 🔄**
- ✅ Google Ads conversion tracking (NEW - Sept 19)
- ✅ GA4 event tracking
- ✅ Form submission tracking
- ✅ Lead attribution system
- 📝 Internal linking expansion
- 📝 Backlink strategy

---

## 🎯 Lead Capture & CRM Integration

### Lead Channels
| Source | Handler | Destination |
|--------|---------|-------------|
| Quick Form (Homepage) | `QuickForm.jsx` | Supabase + Formspree |
| Detailed Lead Form | `LeadForm.jsx` | Supabase + Formspree + Google Ads |
| Contact Form | `Contact.jsx` | Formspree |
| Open House Registration | API endpoint | Supabase |
| Phone Call | Click-to-call | (External) |

### CRM Integration
- **Primary:** Supabase PostgreSQL (all lead records)
- **Notification:** Formspree (email alerts)
- **Fallback:** CRM field mirroring if Formspree fails
- **Tracking:** Google Ads pixel firing on submission
- **Attribution:** UTM parameters + source tracking

### Lead Data Schema
```sql
-- inquiries table
id, name, email, phone, message, property_id, 
created_at, source, utm_source, utm_medium, utm_campaign

-- open_house_registrations table
id, name, email, phone, property_id, 
registered_at, attended, notes

-- buyer_intents table
id, name, email, phone, criteria, 
timeline, budget, created_at
```

---

## 🚀 Build & Deployment Process

### Local Development
```bash
# Install dependencies
npm ci

# Run local API shim (port 8787)
npm run dev:api

# Run frontend with hot reload (Vite)
npm run dev

# Frontend proxies /api to local shim
```

### Production Build
```bash
npm run build
# Runs:
# 1. vite build (compiles React to dist/client/)
# 2. scripts/prerender-metadata.mjs (injects schema)
# 3. scripts/prepare-sites-build.mjs (prepares Sites backup)
```

### Deployment Platforms
| Target | Method | Status |
|--------|--------|--------|
| **Vercel (Primary)** | Git push to main | ✅ Auto-deploy |
| **OpenAI Sites (Backup)** | Manual build output | ⚠️ Fallback only |

### Important: Build Artifacts
- ✅ Preserve `dist/client/index.html`
- ✅ Preserve `dist/server/index.js`
- ✅ Preserve `dist/.openai/hosting.json`
- ✅ Keep `scripts/prepare-sites-build.mjs` intact
- ✅ Keep `.openai/hosting.json` intact

---

## 📈 Performance Metrics

### Current Status (Latest Audit)
| Metric | Status | Target |
|--------|--------|--------|
| **Lighthouse Score** | 92+ | 90+ |
| **Core Web Vitals (LCP)** | < 2.5s | ✅ Pass |
| **Core Web Vitals (FID)** | < 100ms | ✅ Pass |
| **Core Web Vitals (CLS)** | < 0.1 | ✅ Pass |
| **First Contentful Paint** | < 1.8s | ✅ Pass |
| **Time to Interactive** | < 3.5s | ✅ Pass |

### Monitoring Tools
- Vercel Web Analytics (real user monitoring)
- Vercel Speed Insights (CWV tracking)
- Google Search Console (indexing & coverage)
- Google Analytics 4 (traffic & behavior)

---

## 🔍 Verification Checklist

### Pre-Launch Verification
- ✅ Search Console verification
- ✅ Analytics tracking confirmed
- ✅ Sitemap submission
- ✅ robots.txt allows indexing
- ✅ Schema validation passes
- ✅ Mobile optimization verified
- ✅ 404 error handling
- ✅ HTTPS/SSL active

### Production Monitoring
- ✅ Error tracking (Vercel)
- ✅ Performance monitoring (Vercel + Google)
- ✅ Uptime monitoring
- ✅ Lead capture logging
- ✅ Form submission tracking
- ✅ Conversion tracking

---

## 📝 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview |
| `IMPLEMENTATION_STATUS.md` | SEO roadmap & phase status |
| `PHASE_3_COMPLETION.md` | Content system details |
| `PLAYBOOK_IMPLEMENTATION.md` | Implementation tracking |
| `PROJECT_STATUS.md` | Known issues & blockers |
| `LAUNCH_ROADMAP.md` | Remaining work |
| `GOOGLE_ADS_TRACKING_IMPLEMENTATION.md` | Analytics setup guide |
| `AGENTS.md` | Claude agent documentation |
| `AGENT_HANDOFF_FOR_CLAUDE_HERMES.md` | Agent handoff guide |
| `CODEBASE_OVERVIEW.md` | This file |

---

## 🔄 Git History & Recent Changes

### Latest Commits (Top 10)
```
6c34084 Fix: Image handling for better Core Web Vitals
373753b Remove deprecated indexnow.mjs
a85eb92 Fix: Vercel-compatible IndexNow API, fix cron path
906ebec Fix: Vercel API format for IndexNow cron job
96decca Fix: Review schema validation + IndexNow cron job
006fa11 Add Google Ads conversion tracking (AW-18453840820) ← NEW
bdf3f3a Reduce homepage image and font payloads
5f43eb3 Fix content crawlability, FAQ parsing, canonical routing
52f6c1b Fix: Dynamically update video source on device detection
b9c3e8a Optimize video splash for mobile, tablet, desktop
```

### Branch Structure
```
main (primary)
  ↓
origin/main (GitHub)
  ↓
Vercel auto-deployment on push
```

---

## 🎓 Key Code Examples

### Analytics Initialization (src/analytics.js)
```javascript
// Automatically loads GTM, GA4, Google Ads, Meta Pixel
initAnalytics();

// Custom event tracking
trackEvent('lead_submitted', {
  property_type: 'land',
  price_range: '20000-50000'
});
```

### Content Page Rendering (src/components/ContentPage.jsx)
```javascript
// Markdown files automatically rendered with:
// - Breadcrumbs
// - Table of Contents
// - FAQ schema
// - Related content
// - CTA forms
<ContentPage slug="cheap-land-kern-county" />
```

### Property Page Data (src/PropertyPages.jsx)
```javascript
// Pre-rendered with SSR-compatible React
// Hydrates with public Supabase property data
// Generates unique schema per property
<PropertyDetailPage slug="wendy-drive-bakersfield" />
```

### SEO Schema Generation (src/seo.js)
```javascript
// Dynamic schema injection for every page
const schemas = jsonLdFor(pathname);
// Returns: RealEstateAgent, Organization, LocalBusiness, etc.
```

---

## 🚨 Known Issues & Limitations

### Current (Production)
- ⚠️ Apollo campaign material not yet published (awaiting approval)
- ⚠️ Legacy Neon database code retained for backwards compatibility
- ⚠️ HQ requires manual entry (no bulk import yet)

### Backlog
- 📋 10 additional content guides needed
- 📋 Backlink strategy implementation
- 📋 Internal link expansion
- 📋 Blog content expansion (1-2 posts/month)

### Not in Scope
- ❌ Building/development content (per user guidance)
- ❌ San Diego market messaging
- ❌ Advertising/social posting automation

---

## 👥 Team & Contact

**Developer:** Claude (Haiku 4.5)  
**Project Owner:** Jason Manuel / Nathanael Harbison  
**GitHub:** https://github.com/jasonmanuel-cmd  
**Email:** coaiebay@gmail.com  

---

## 📚 Resources & References

- [Project README](README.md)
- [GitHub Repository](https://github.com/jasonmanuel-cmd/Harbison-Standard2)
- [Vercel Dashboard](https://vercel.com)
- [Supabase Console](https://app.supabase.com)
- [Google Search Console](https://search.google.com/search-console)
- [Google Analytics 4](https://analytics.google.com)

---

**Last Updated:** September 19, 2026  
**Status:** Production Ready ✅  
**Next Phase:** Phase 3 Content Expansion (Guides)
