# Performance Optimization Report - Harbison Standard

## Lighthouse Scores (Sep 19, 2026)

| Metric | Desktop | Mobile |
|--------|---------|--------|
| Performance | 76 | 63 ❌ |
| LCP | 1.3s | 9.5s ❌ |
| TBT | 270ms | 130ms |
| CLS | 0 | 0 |
| Accessibility | 96 | 96 |
| Best Practices | 96 | 96 |
| SEO | 100 | 100 |

## Core Issues

### 1. Largest Contentful Paint (Mobile) - 9.5s
**Root Cause**: Hero images not properly optimized for mobile

**Fix**: 
- Add `width` and `height` attributes to `<img>` tags
- Implement responsive image `srcset`
- Add `loading="lazy"` to non-critical images

### 2. Network Payload - 2,793 KiB (Mobile)
**Root Cause**: Entire React/App bundle loads on every page

**Fix**:
- Code-split routes into separate chunks
- Lazy-load non-essential components
- Compress images to WebP with proper sizing

### 3. Reduce Unused JavaScript - 386 KiB
**Root Cause**: Full bundle loads on all pages

**Fix**:
- Route-based code splitting (already configured in Vite)
- Remove unused imports from `src/app/` components

## Schema Validation Status

**Structured data is valid** on homepage.

**Google Search Console errors** on guide pages may be due to:
1. Missing `ratingValue` field in some contexts
2. Schema reference issues between RealEstateAgent and LocalBusiness

## Immediate Actions

1. ✅ **Add image dimensions** - Fix "Image elements do not have explicit width and height"
2. ✅ **Preload critical images** - Hero images with `fetchpriority="high"`
3. ⏳ **Code splitting** - Already partially done via Vite dynamic imports
4. ⏳ **Image optimization** - Generate properly sized WebP variants

## Technical Debt

- 30+ JS chunks being generated but all loaded on homepage
- Consider implementing route-level chunks
- Add bundle analyzer to CI/CD

## Next Steps

1. Run Lighthouse after Vercel deploy with IndexNow key set
2. Monitor Core Web Vitals in Search Console
3. Request indexing for all guide pages after deploy
4. Verify schema validation passes for all pages