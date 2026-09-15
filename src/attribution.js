const FIRST_KEY = 'hs_attribution_first';
const LAST_KEY = 'hs_attribution_last';

function safeRead(key) {
  try { const value = JSON.parse(localStorage.getItem(key) || '{}'); return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; } catch { return {}; }
}
function safeWrite(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
function touchFromLocation() {
  const url = new URL(window.location.href);
  return {
    landingPage: `${window.location.pathname}${window.location.search}`,
    referrer: document.referrer || '',
    utmSource: url.searchParams.get('utm_source') || '',
    utmMedium: url.searchParams.get('utm_medium') || '',
    utmCampaign: url.searchParams.get('utm_campaign') || '',
    utmTerm: url.searchParams.get('utm_term') || '',
    utmContent: url.searchParams.get('utm_content') || '',
  };
}

export function captureAttribution() {
  const current = touchFromLocation();
  const storedFirst = safeRead(FIRST_KEY);
  const first = Object.keys(storedFirst).length ? storedFirst : current;
  let externalReferrer = false;
  try { externalReferrer = Boolean(current.referrer) && new URL(current.referrer).origin !== window.location.origin; } catch {}
  const hasCampaignSignal = Boolean(externalReferrer || current.utmSource || current.utmMedium || current.utmCampaign || current.utmTerm || current.utmContent);
  const previousLast = safeRead(LAST_KEY);
  const last = hasCampaignSignal || !Object.keys(previousLast).length ? current : previousLast;
  safeWrite(FIRST_KEY, first);
  safeWrite(LAST_KEY, last);
  return {
    ...last,
    firstLandingPage: first.landingPage || '',
    firstReferrer: first.referrer || '',
    firstUtmSource: first.utmSource || '',
    firstUtmMedium: first.utmMedium || '',
    firstUtmCampaign: first.utmCampaign || '',
    firstUtmTerm: first.utmTerm || '',
    firstUtmContent: first.utmContent || '',
    lastLandingPage: last.landingPage || '',
    lastReferrer: last.referrer || '',
    lastUtmSource: last.utmSource || '',
    lastUtmMedium: last.utmMedium || '',
    lastUtmCampaign: last.utmCampaign || '',
    lastUtmTerm: last.utmTerm || '',
    lastUtmContent: last.utmContent || '',
  };
}
