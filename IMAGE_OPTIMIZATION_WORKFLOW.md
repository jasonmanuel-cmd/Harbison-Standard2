# IMAGE OPTIMIZATION WORKFLOW

**Harbison Standard Real Estate Website**
**Phase 1: Critical Image Compression**
**Date Created:** 2026-09-27
**Status:** READY TO START

---

## OVERVIEW

This document provides step-by-step instructions for compressing images using **squoosh.app** (free, Google's image compression tool). Optimization will reduce site load time by 4-6 MB and increase PageSpeed by 15-20 points.

**Total images to optimize:** 560+ files
**Estimated time:** 3-4 hours (batch processing)
**Expected savings:** 4-6 MB total

---

## PRIORITY BATCH 1: CRITICAL IMAGES (START HERE)

These 4 images have the largest impact on performance:

### 1. apollo/mapview.png
- **Current size:** 572 KB
- **Type:** PNG
- **Target:** 150-200 KB
- **Action:** CONVERT TO WebP
- **Steps:**
  1. Go to https://squoosh.app
  2. Click "Select an image"
  3. Choose: `public/assets/apollo/mapview.png`
  4. Left panel: Click "WebP" dropdown (currently shows PNG)
  5. Quality slider: Set to **75-80**
  6. Right panel: Download as `mapview.webp`
  7. Replace original: `public/assets/apollo/mapview.png` → DELETE, keep only .webp

### 2. sheridan.webp (Past Sales)
- **Current size:** 1.1 MB (LARGEST)
- **Type:** WebP
- **Target:** 300-350 KB
- **Action:** RE-COMPRESS
- **Steps:**
  1. Upload to squoosh.app: `public/assets/sold/sheridan.webp`
  2. Quality slider: Set to **70**
  3. Download as `sheridan.webp`
  4. Replace: Copy to `public/assets/sold/sheridan.webp`

### 3. pellisier.webp (Past Sales)
- **Current size:** 702 KB
- **Type:** WebP
- **Target:** 250-300 KB
- **Action:** RE-COMPRESS
- **Steps:**
  1. Upload: `public/assets/sold/pellisier.webp`
  2. Quality slider: Set to **72**
  3. Download & replace

### 4. woodshawn.webp (Past Sales)
- **Current size:** 446 KB
- **Type:** WebP
- **Target:** 250-300 KB
- **Action:** RE-COMPRESS
- **Steps:**
  1. Upload: `public/assets/sold/woodshawn.webp`
  2. Quality slider: Set to **75**
  3. Download & replace

---

## PRIORITY BATCH 2: PROPERTY IMAGES (28 IMAGES)

All property images are currently JPG format (280-360 KB each). These need to be converted to WebP at quality 70-75%.

### Property Image Directories:
- `public/assets/property/*.jpg` (400+ images)

### Batch Processing Strategy:
1. **Process 5 images at a time** in squoosh.app (upload multiple)
2. **Quality:** 70-75% for all
3. **Format:** Convert JPG → WebP
4. **Target size:** 150-200 KB per image

### Quick Squoosh Batch Process:
```
1. Go to squoosh.app
2. Click "Select an image" → Can upload multiple
3. Select 5 JPG files at once
4. Change format: WebP
5. Set quality: 72
6. Download all
7. Replace originals in public/assets/property/
```

### High-Priority Property Images (Start with these):
- `585-n-wendy-dr-newbury-park-ca*.jpg` (Featured listing) → 4 images
- `2300-weybridge-dr-*.jpg` (Featured listing) → 6 images  
- `2901-summit-cir-*.jpg` (Featured listing) → 5 images
- `28751-gleneagle-ct-*.jpg` (Featured listing) → 6 images

**Total for "Featured" properties:** ~21 images

---

## PRIORITY BATCH 3: HOMEPAGE & MISC IMAGES

### Key Non-Property Images:
| File | Current | Target | Format | Quality |
|------|---------|--------|--------|---------|
| hero.webp | 200-250 KB | 120-150 KB | WebP | 75 |
| mountains.webp | ~150 KB | 100 KB | WebP | 75 |
| house.webp | ~100 KB | 70 KB | WebP | 75 |
| investing.webp | ~100 KB | 70 KB | WebP | 75 |
| development.webp | ~100 KB | 70 KB | WebP | 75 |
| property-front.webp | ~200 KB | 120 KB | WebP | 75 |
| property-one.webp | ~150 KB | 100 KB | WebP | 75 |
| property-two.webp | ~150 KB | 100 KB | WebP | 75 |
| logo.webp | ~50 KB | 30 KB | WebP | 85 |
| headshot.webp | ~80 KB | 50 KB | WebP | 80 |

---

## STEP-BY-STEP SQUOOSH.APP GUIDE

### For Single Image:
```
1. Open https://squoosh.app
2. Click "Select an image"
3. Choose file from your computer
4. Top left: See current format (PNG, JPG, WebP)
5. Bottom left: Click format dropdown → select WebP
6. Right side: Drag quality slider to target number
7. Right side: Download button appears
8. Click "Download" 
9. Save to Downloads folder
10. Verify file size in Downloads folder
11. Move to correct folder in project (replace original)
```

### For Multiple Images (Batch):
```
1. Open https://squoosh.app
2. Click "Select an image"
3. Hold CTRL and select 5 images at once
4. Each image opens in new tab
5. Set format & quality for EACH
6. Download each one
7. Move all to project folder
```

---

## DETAILED WORKFLOW (Day by Day)

### Day 1: CRITICAL BATCH (4 images)
**Time: 30 minutes**

- [ ] apollo/mapview.png → mapview.webp (PNG→WebP, Q:75)
- [ ] sheridan.webp (WebP, re-compress Q:70)
- [ ] pellisier.webp (WebP, re-compress Q:72)
- [ ] woodshawn.webp (WebP, re-compress Q:75)

**Expected savings:** 2.2-2.4 MB

### Day 2-3: FEATURED PROPERTIES (21 images)
**Time: 1.5-2 hours**

Process in batches of 5:

**Batch 2A (5 images):**
- [ ] 585-n-wendy-dr-newbury-park-ca.jpg (JPG→WebP, Q:72)
- [ ] 585-n-wendy-dr-newbury-park-ca-2.jpg (JPG→WebP, Q:72)
- [ ] 585-n-wendy-dr-newbury-park-ca-4.jpg (JPG→WebP, Q:72)
- [ ] bathroom1.jpg (JPG→WebP, Q:72)
- [ ] Diningroomfacingkitchen.jpg (JPG→WebP, Q:72)

**Batch 2B (5 images):**
- [ ] 2300-weybridge-dr-1.jpg (JPG→WebP, Q:72)
- [ ] 2300-weybridge-dr-2.jpg (JPG→WebP, Q:72)
- [ ] 2300-weybridge-dr-3.jpg (JPG→WebP, Q:72)
- [ ] 2300-weybridge-dr-4.jpg (JPG→WebP, Q:72)
- [ ] 2300-weybridge-dr-5.jpg (JPG→WebP, Q:72)

**Batch 2C (5 images):**
- [ ] 2901-summit-cir-1.jpg (JPG→WebP, Q:72)
- [ ] 2901-summit-cir-2.jpg (JPG→WebP, Q:72)
- [ ] 2901-summit-cir-3.jpg (JPG→WebP, Q:72)
- [ ] 28751-gleneagle-ct-1.jpg (JPG→WebP, Q:72)
- [ ] 28751-gleneagle-ct-2.jpg (JPG→WebP, Q:72)

**Batch 2D (6 images):** Continue pattern...

**Expected savings:** 1.8-2.1 MB

### Day 4: REMAINING PROPERTY IMAGES (380+ images)
**Time: 2-3 hours**

Continue with remaining property JPGs in batches of 5-10:
- All remaining `*.jpg` files in `public/assets/property/`
- Quality: 72
- Format: JPG → WebP

**Expected savings:** 1.2-1.8 MB

### Day 5: HOMEPAGE & MISC
**Time: 30 minutes**

- [ ] hero.webp (Q:75)
- [ ] mountains.webp (Q:75)
- [ ] house.webp (Q:75)
- [ ] investing.webp (Q:75)
- [ ] development.webp (Q:75)
- [ ] property-front.webp (Q:75)
- [ ] property-one.webp (Q:75)
- [ ] property-two.webp (Q:75)
- [ ] logo.webp (Q:85)
- [ ] headshot.webp (Q:80)

**Expected savings:** 0.4-0.6 MB

---

## AFTER OPTIMIZATION: DEPLOYMENT CHECKLIST

Once all images are compressed:

### 1. Verify File Sizes
```bash
# Check that optimized files are in target range
# Example: mapview.webp should be 150-200 KB (was 572 KB)
```

### 2. Test Local Build
```bash
npm run build
# Build should complete without errors
```

### 3. Test in Browser
```bash
npm run dev
# Check that images load correctly
# Check no broken images in DevTools Console
```

### 4. Run PageSpeed Test
```
Go to: https://pagespeed.web.dev
Test: https://harbisonstandard.com (production)
Expected: Mobile 75+, Desktop 85+
```

### 5. Commit Changes
```bash
git add public/assets/
git commit -m "Optimize all images: convert JPG→WebP, reduce quality to target sizes

Expected impact: 4-6 MB savings, +15-20 PageSpeed points
- apollo/mapview.png: 572 KB → 180 KB
- sheridan.webp: 1.1 MB → 320 KB
- pellisier.webp: 702 KB → 280 KB
- woodshawn.webp: 446 KB → 280 KB
- 400+ property JPGs: avg 320 KB → 175 KB each

Batch processed via squoosh.app with quality 70-75%
Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

### 6. Push & Deploy
```bash
git push origin main
# Vercel will auto-deploy
```

### 7. Verify Production
```
Check: https://www.harbisonstandard.com
- Images load correctly
- No 404s in DevTools Network tab
- PageSpeed scores improved
```

---

## QUALITY SETTINGS EXPLAINED

| Quality | Use Case | Result |
|---------|----------|--------|
| 95+ | Only for hero/hero images | Minimal savings |
| 85-90 | Logo, very small images | Best appearance |
| 75-80 | Hero image, featured photos | Perfect balance |
| 70-75 | Property photos, homepage | High compression |
| 60-70 | Thumbnails, background images | Maximum compression |

**Our settings:**
- Logo (85): Maintain brand quality
- Hero (75): Large image, quality matters
- Properties (72): Bulk images, compression priority
- Misc (75): Standard balance

---

## TROUBLESHOOTING

### Issue: Downloaded file same size as original
**Solution:** Make sure quality slider is moved BEFORE download

### Issue: Image looks blurry after optimization
**Solution:** Increase quality slider by 5 points

### Issue: Squoosh.app not responding
**Solution:** Close tab, reload https://squoosh.app

### Issue: Can't find saved images
**Solution:** Check Downloads folder, move to project manually

### Issue: Don't know where to put downloaded files
**Solution:** Replace original file in `public/assets/` with same name
- Example: `mapview.png` → `mapview.webp` in `public/assets/apollo/`

---

## EXPECTED RESULTS

| Metric | Before | After | Gain |
|--------|--------|-------|------|
| Total image weight | 12-15 MB | 8-10 MB | -4-6 MB |
| Mobile PageSpeed | 60-70 | 80+ | +10-20 |
| Desktop PageSpeed | 75-85 | 90+ | +5-15 |
| Hero load time | ~800ms | ~200ms | -600ms |
| Property grid load | ~3s | ~1.2s | -1.8s |

---

## TRACKING YOUR PROGRESS

Use this checklist to track batches completed:

- [ ] Critical Batch (4 images) — 30 min
- [ ] Featured Batch 2A (5 images) — 15 min
- [ ] Featured Batch 2B (5 images) — 15 min
- [ ] Featured Batch 2C (5 images) — 15 min
- [ ] Featured Batch 2D (6 images) — 15 min
- [ ] Remaining Properties (380+ images) — 2-3 hours
- [ ] Homepage Images (10 images) — 20 min
- [ ] Verification & Deploy — 30 min

**Total Time Estimate:** 3-4 hours
**Break Points:** Every 15-20 minutes between batches

---

## NEXT STEPS AFTER OPTIMIZATION

1. ✅ Complete image optimization (this guide)
2. ⏭️ Run `npm run build` & test locally
3. ⏭️ Test PageSpeed Insights
4. ⏭️ Commit & push to main
5. ⏭️ Proceed to Phase 2: Technical SEO verification

---

**Document:** IMAGE_OPTIMIZATION_WORKFLOW.md
**Last Updated:** 2026-09-27
**Status:** Ready to execute
