import test from 'node:test';
import assert from 'node:assert/strict';
import { captureAttribution } from '../src/attribution.js';
import { trackEvent } from '../src/analytics.js';

test('internal navigation preserves acquisition campaign and landing page', () => {
  const store = new Map();
  globalThis.localStorage = { getItem: k => store.get(k), setItem: (k,v) => store.set(k,v) };
  globalThis.window = { location: new URL('https://example.com/relocate?utm_source=google&utm_campaign=buyers') };
  globalThis.document = { referrer: 'https://www.google.com/' };
  const first = captureAttribution();
  window.location = new URL('https://example.com/property/example');
  document.referrer = 'https://example.com/relocate';
  const next = captureAttribution();
  assert.equal(next.lastLandingPage, first.lastLandingPage);
  assert.equal(next.lastUtmCampaign, 'buyers');
  window.location = new URL('https://example.com/properties?utm_source=facebook');
  const last = captureAttribution();
  assert.equal(last.firstUtmSource, 'google');
  assert.equal(last.lastUtmSource, 'facebook');
  store.set('hs_attribution_first', 'null');
  assert.doesNotThrow(() => captureAttribution());
});

test('one buyer submission produces exactly one Meta Lead and one GA event per hook', () => {
  const meta = [], ga = [], layer = [];
  globalThis.window = {location: {pathname: '/properties'}, fbq: (...x) => meta.push(x), gtag: (...x) => ga.push(x), dataLayer: layer};
  for (const name of ['form_complete','buyer_profile_complete','generate_lead']) trackEvent(name);
  assert.equal(meta.filter(x => x[0] === 'track' && x[1] === 'Lead').length, 1);
  assert.equal(ga.length, 3);
  assert.equal(layer.length, 0);
  window.location.pathname = '/hq';
  trackEvent('generate_lead');
  assert.equal(ga.length, 3);
  window.location.pathname = '/properties';
  window.gtag = () => {throw new Error('provider failure')};
  assert.doesNotThrow(() => trackEvent('generate_lead'));
});
