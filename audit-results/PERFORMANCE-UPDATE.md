# Performance update — September 17, 2026

Preserved layout, content, source images, fonts and first-visit video.

- Mobile hero: 426,851 → 77,448 bytes; desktop variant 270,120 bytes.
- Logo: 169,452 → 18,844 bytes.
- Fonts: 673,992 bytes of original TTF → 140,296 bytes of Latin WOFF2 subsets (all six combined; not all necessarily load).
- Main JS chunk gzip: 99.92 → 66.28 KB compared with the preceding SEO-fix build. React/icons remain additional initial downloads. HQ and YAML frontmatter now load separately on demand.
- Wendy carousel and service photos use optimized WebP variants; originals remain available for property galleries.
- The video selects the mobile file immediately and no longer resets/reloads its source in an effect.
- Correct image and font preloads replace the invalid CSS-as-font preload.

## Validation

Build successful; six article/FAQ/Sites tests pass; diff whitespace check passes. Homepage verified in browser.

Final single-run mobile Lighthouse against the local production preview:

| Metric | Result |
| --- | --- |
| Performance | 77 |
| Accessibility | 96 |
| Best Practices | 96 |
| SEO | 100 |
| First Contentful Paint | 1.8 s |
| Largest Contentful Paint | 5.7 s |
| Speed Index | 3.8 s |
| Layout shift | 0 |
| Total Blocking Time | 50 ms |
| Total transfer | 2,206 KiB |

Raw report retained locally: mobile-optimized-fonts.json. Earlier live baseline was 65 performance / 3,527 KiB. Local and live environments differ, so this is not a verified production score increase. Local preview has unavailable Vercel analytics/backend requests. The first-visit full-screen video remains and can delay seeing the main page. A production retest is required. No promise of 100 is made. Content accuracy, backend configuration, remaining contrast issues and inventory fallback review are separate outstanding work.

Regenerate images using `node scripts/optimize-assets.mjs`; regenerate fonts using `python scripts/optimize-fonts.py` with fonttools and brotli installed.
