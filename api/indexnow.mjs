import { json } from './lib/auth.mjs';

// IndexNow API endpoint for automatic search engine notifications
// Deploy as Vercel cron: https://docs.vercel.com/guides/deploying-indexnow
// Add to vercel.json: "crons": [{"path": "/api/indexnow.mjs", "schedule": "0 * * * *"}]

async function handler(request) {
  if (request.method !== 'GET') return json({ error: 'Method not allowed' }, { status: 405 });
  
  const indexNowKey = process.env.INDEXNOW_KEY;
  if (!indexNowKey) {
    return json({ error: 'INDEXNOW_KEY not configured in Vercel environment' }, { status: 500 });
  }

  try {
    // Get sitemap URLs
    const baseUrl = 'https://www.harbisonstandard.com';
    const sitemapUrl = `${baseUrl}/sitemap.xml`;
    
    const response = await fetch(sitemapUrl);
    if (!response.ok) {
      return json({ error: 'Failed to fetch sitemap', status: 500 });
    }
    
    const sitemap = await response.text();
    
    // Extract URLs from sitemap (limit to 10,000 for IndexNow)
    const urls = sitemap.match(/<loc>(https?:\/\/[^<]+)<\/loc>/g)
      ?.map(match => match.replace(/<loc>|<\/loc>/g, ''))
      .slice(-10000) || [];
    
    // Send to Bing IndexNow API
    const indexNowResponse = await fetch(
      `https://api.bing.com/indexnow?urlkey=${encodeURIComponent(indexNowKey)}&url=${encodeURIComponent(urls[0] || baseUrl)}`,
      { method: 'GET' }
    );
    
    return json({
      success: true,
      urlCount: urls.length,
      submittedTo: 'Bing IndexNow',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[indexnow] Error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}

// Vercel Web Standard handler; local development uses the same fetch function.
export default {fetch: handler};