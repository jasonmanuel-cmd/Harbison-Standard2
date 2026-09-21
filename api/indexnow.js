// IndexNow API endpoint for automatic search engine notifications
// Vercel cron runs this hourly to notify search engines of new URLs

export async function GET() {
  const indexNowKey = process.env.INDEXNOW_KEY;
  
  if (!indexNowKey) {
    return new Response(JSON.stringify({ 
      error: 'INDEXNOW_KEY not configured',
      instructions: 'Add INDEXNOW_KEY environment variable in Vercel'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Fetch the sitemap
    const sitemapUrl = 'https://www.harbisonstandard.com/sitemap.xml';
    const response = await fetch(sitemapUrl);
    
    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch sitemap' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const sitemap = await response.text();
    
    // Extract URLs from sitemap (IndexNow limit: 10,000 URLs per request)
    const urls = sitemap.match(/<loc>(https?:\/\/[^<]+)<\/loc>/g)
      ?.map(match => match.replace(/<loc>|<\/loc>/g, ''))
      .slice(-10000) || [];
    
    if (urls.length === 0) {
      return new Response(JSON.stringify({ error: 'No URLs found in sitemap' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Send to IndexNow API (Bing + Yandex) via POST with bulk URL list
    // Filter out /hq (private admin) and /api (non-indexable routes)
    const filteredUrls = urls.filter(url => !url.includes('/hq') && !url.includes('/api'));

    const payload = {
      host: 'www.harbisonstandard.com',
      key: indexNowKey,
      keyLocation: 'https://www.harbisonstandard.com/indexnow-key.txt',
      urlList: filteredUrls.slice(0, 10000) // IndexNow limit: 10,000 URLs per request
    };

    // POST to IndexNow API (routes to both Bing and Yandex)
    const indexNowResponse = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const indexNowData = await indexNowResponse.json();

    return new Response(JSON.stringify({
      success: indexNowResponse.ok,
      urlCount: filteredUrls.length,
      submittedTo: 'IndexNow API (Bing + Yandex)',
      apiResponse: indexNowData,
      timestamp: new Date().toISOString()
    }), {
      status: indexNowResponse.ok ? 200 : 400,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('[indexnow] Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Unknown error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}