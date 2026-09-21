# Vercel IndexNow Cron - Implementation Notes

## Critical Findings

### 1. File Extension Matters
- **Use `api/indexnow.js`** - Vercel cron fails silently with `.mjs` extension
- Node.js ESM syntax is required: `export async function GET()`

### 2. Cron Path Configuration
- **Path in vercel.json**: `/api/indexnow` (no extension)
- **Actual file**: `api/indexnow.js`
- Mismatch causes cron to not execute

### 3. Environment Variables Must Precede Deployment
- `INDEXNOW_KEY` must be set in Vercel Settings → Environment Variables
- Key obtained from Bing Webmaster Tools
- First cron execution will fail if key missing

### 4. Sitemap Routing
- Dynamic routes (`/guide/:slug`, `/blog/:slug`) must be prerendered
- Sitemap must include all URLs for IndexNow to submit them
- Google Search Console shows "Discovered - currently not indexed" when pages are missing from sitemap

## Standard Implementation

```javascript
// api/indexnow.js
export async function GET() {
  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    return new Response(JSON.stringify({ 
      error: 'INDEXNOW_KEY not configured in Vercel env vars' 
    }), { status: 500 });
  }
  
  const sitemap = await (await fetch('/sitemap.xml')).text();
  const urls = sitemap.match(/<loc>(https?:\/\/[^<]+)<\/loc>/g)
    ?.map(m => m.replace(/<loc>|<\/loc>/g, ''))
    .slice(-10000) || [];
  
  if (urls.length === 0) return new Response('No URLs', { status: 400 });
  
  // Submit first URL to Bing IndexNow
  await fetch(`https://www.bing.com/indexnow?urlkey=${key}&url=${encodeURIComponent(urls[0])}`);
  
  return new Response(JSON.stringify({ success: true, urlCount: urls.length }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

## vercel.json Update

```json
"crons": [
  {
    "path": "/api/indexnow",
    "schedule": "0 * * * *"
  }
]
```

## Deployment Checklist

1. ✅ Create `api/indexnow.js` (not .mjs)
2. ✅ Set `INDEXNOW_KEY` in Vercel Environment Variables (Production)
3. ✅ Add cron to vercel.json with correct path (no extension)
4. ✅ Push and trigger new Vercel deploy
5. ✅ Verify in Vercel → Functions → Cron logs
6. ✅ Check Bing Webmaster Tools for index status

## Common Vercel Cron Pitfalls

| Issue | Cause | Solution |
|-------|-------|----------|
| Cron not running | Path mismatch in vercel.json | Use `/api/indexnow` not `/api/indexnow.js` |
| 500 error on cron | INDEXNOW_KEY missing | Add env var in Vercel settings |
| Sitemap empty | Prerender failed | Check build logs for route generation |
| Pages not indexed | URLs missing from sitemap | Verify dist/client/route directories exist |