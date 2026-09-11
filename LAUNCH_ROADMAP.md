# Harbison Standard roadmap

## Phase 1 finalization
Implemented and locally verified: CRM field persistence and validation, general inquiry context, unified HQ view, atomic private visit tracking, single analytics initialization excluding HQ, published-inventory sitemaps, land schema, unavailable-property routing, and IndexNow submission tooling. User confirmed notification emails arrive. Apollo remains unpublished.

Production build and 17 tests pass. Real Supabase integration checks passed and test records were removed. Deployment and final live checks are the current next step.

Owner/account checks still required:
- Production HQ credential alignment: local and supplied values were rejected before deployment. Do not send passwords in chat; update the Production environment and redeploy.
- Verify GA4/GTM reporting in the account and Google Search Console sitemap acceptance. Installed tags and accessible sitemaps do not prove reporting/indexing.
- Verify/claim the existing Google Business Profile using the owner's Google account and the verification method Google offers.

## Phase 2
Choose a currently published property, approve real media/copy, connect a scheduler, distribute tagged links, and follow up through HQ. Social scheduling, paid campaigns and automatic outreach have not been started. IndexNow command can be rerun after approved publication changes; it is not a cron job.

See PROJECT_STATUS.md for evidence and deployment follow-up.
