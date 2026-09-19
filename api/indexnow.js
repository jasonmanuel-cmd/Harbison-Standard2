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
    
    // Send to Bing IndexNow API
    const BingUrl = `https://www.bing.com/indexnow?urlkey=${indexNowKey}&url=${encodeURIComponent(urls[0])}`;
    
    const indexNowResponse = await fetch(BingUrl, { method: 'GET' });
    
    return new Response(JSON.stringify({
      success: true,
      urlCount: urls.length,
      firstUrl: urls[0],
      submittedTo: 'Bing IndexNow',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
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