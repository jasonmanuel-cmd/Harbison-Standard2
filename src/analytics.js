export function initAnalytics() {
  if (typeof window === 'undefined' || /^\/hq(?:\/|$)/.test(window.location.pathname)) return;
  if(window.__hsAnalyticsInitialized)return;
  window.__hsAnalyticsInitialized=true;
  const verification = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION;

  if (verification && !document.querySelector('meta[name="google-site-verification"]')) {
    const meta=document.createElement('meta'); meta.name='google-site-verification'; meta.content=verification; document.head.appendChild(meta);
  }

  // Defer analytics scripts to after page interactive
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(() => _loadAnalytics());
  } else {
    setTimeout(() => _loadAnalytics(), 2000);
  }
}

function _loadAnalytics() {
  const gaId = import.meta.env.VITE_GA4_ID || import.meta.env.VITEGA4_ID || 'G-2Q59BEZ4MJ';
  const gtmId = import.meta.env.VITE_GTM_ID || import.meta.env.VITEGTMID || 'GTM-M5HK83KW';
  const googleAdsId = import.meta.env.VITE_GOOGLE_ADS_ID;
  const metaPixelId = import.meta.env.VITE_META_PIXEL_ID;

  if (gtmId) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});
    const script=document.createElement('script'); script.async=true; script.defer=true; script.src=`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`; document.head.appendChild(script);
  }

  if (gaId || googleAdsId) {
    const primaryId=gaId||googleAdsId;
    const script=document.createElement('script'); script.async=true; script.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(primaryId)}`; document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){window.dataLayer.push(arguments)};
    window.gtag('js', new Date());
    if (gaId) window.gtag('config', gaId);
    if (googleAdsId) window.gtag('config', googleAdsId);
  }

  if (metaPixelId && !window.fbq) {
    const fbq=function(){fbq.callMethod?fbq.callMethod.apply(fbq,arguments):fbq.queue.push(arguments)};
    fbq.queue=[];fbq.loaded=true;fbq.version='2.0';window.fbq=fbq;
    const script=document.createElement('script');script.async=true;script.src='https://connect.facebook.net/en_US/fbevents.js';document.head.appendChild(script);
    window.fbq('init',metaPixelId);
    window.fbq('track','PageView');
  }
}

export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined' || /^\/hq(?:\/|$)/.test(window.location.pathname)) return;
  try {
  if (typeof window.gtag === 'function') window.gtag('event', name, params);
  else if (Array.isArray(window.dataLayer)) window.dataLayer.push({event: name, ...params});
  if (typeof window.fbq === 'function') {
    const standard = name === 'generate_lead' ? 'Lead' : null;
    if (standard) window.fbq('track', standard, params);
    else window.fbq('trackCustom', name, params);
  }
  } catch { /* Analytics must never interrupt an inquiry. */ }
}

// High-level tracking for common conversions
export function trackCall(source = 'web') {
  trackEvent('call_click', {source, phone: '(661) 472-7499'});
}

export function trackText(source = 'web') {
  trackEvent('text_click', {source, phone: '(661) 472-7499'});
}

export function trackScheduleClick(propertyId = null, source = 'property') {
  trackEvent('schedule_showing_click', {property_id: propertyId, source});
}

export function trackFormStart(formName, source = 'web') {
  trackEvent('form_start', {form_name: formName, lead_source: source});
}

export function trackFormComplete(formName, source = 'web', metadata = {}) {
  trackEvent('form_complete', {form_name: formName, lead_source: source, ...metadata});
  trackEvent('generate_lead', {form_name: formName, lead_source: source, ...metadata});
}
