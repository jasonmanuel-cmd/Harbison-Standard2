// IndexNow API endpoint for automatic search engine notifications
// Deployed as Vercel cron job (runs hourly: "0 * * * *")

import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  const indexNowKey = process.env.INDEXNOW_KEY;
  
  if (!indexNowKey) {
    return NextResponse.json({ error: 'INDEXNOW_KEY not configured' }, { status: 500 });
  }

  // Get sitemap URLs
  const baseUrl = 'https://www.harbisonstandard.com';
  const sitemapUrl = `${baseUrl}/sitemap.xml`;
  
  try {
    const response = await fetch(sitemapUrl);
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch sitemap' }, { status: 500 });
    }
    
    const sitemap = await response.text();
    
    // Extract URLs from sitemap
    const urls = sitemap.match(/<loc>(https?:\/\/[^<]+)<\/loc>/g)
      ?.map(match => match.replace(/<loc>|<\/loc>/g, ''))
      || [];
    
    // Filter to last 10,000 URLs (IndexNow limit)
    const urlsToSend = urls.slice(-10000);
    
    // Send to Bing IndexNow endpoint
    const indexNowResponse = await fetch(
      `https://api.bing.com/indexnow(urls)`
    );
    
    return NextResponse.json({
      indexed: urlsToSend.length,
      submittedTo: 'Bing IndexNow',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}