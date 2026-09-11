# Harbison Standard launch roadmap

Updated September 10, 2026. Current audit evidence: PROJECT_STATUS.md.

## Phase 1 — stabilize the current site
The public website and three published property pages are live. Phase 1 is not yet fully verified because the audit found CRM and measurement regressions.

1. CRM syntax correction is deployed; anonymous requests correctly return 401. Verify production HQ access: the local ADMIN_TOKEN is rejected by production, so authenticated live reads remain unverified.
2. Complete the Supabase CRM transition: preserve seller/investor messages, resolve the obsolete backend selector, and make manual entry/edit controls save all supported fields correctly.
3. Consolidate GA4/GTM initialization, exclude HQ, verify conversion counts and source attribution. Repair visit persistence/counters and check tracking-table privacy policies.
4. Keep Apollo unpublished until explicit release approval. Repair unavailable-property HTTP behavior; confirm current sitemap processing with Google and Bing.
5. Confirm Gmail receipt and repeat a controlled end-to-end inquiry after CRM changes. Verify mobile HQ and public forms.

## Already present
- Live domain and GitHub-to-Vercel deployment integration.
- Real estate/investment pages, current listings, past sales, open houses, relocation landing page.
- Three published properties with photos: Mariposa Road, Chalet Drive, Wendy Drive.
- Public property API, buyer qualification and attribution, Supabase storage, Formspree notification path, private HQ interface.
- Initial HTML property content, metadata, XML/image sitemaps, robots directives.
- GA4/GTM installation code; reporting accuracy still needs verification.

## Phase 2 — acquire and follow up with buyers
- Choose the property and approved facts for each campaign; Apollo is on hold.
- Record real footage and create platform-specific posts with reviewed copy.
- Connect the selected scheduler; recommendation is Metricool Starter with inexpensive AI drafting, or Buffer Free to start. No subscription or connection has been created by this review.
- Use tagged links to the relevant property page; report inquiries, appointments, and qualified buyers by source.
- Establish daily follow-up in HQ, then consider automation after the manual process works reliably.
- Complete Google Business Profile and Bing/IndexNow setup. The existing guides do not mean these services are configured.

Timing depends on fixing and testing the regressions and gaining access to external dashboards. Search indexing and email receipt cannot be guaranteed on a fixed deadline.
