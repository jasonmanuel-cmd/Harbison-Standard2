# Open-house registration

POST JSON to `https://www.harbisonstandard.com/hq/api/openhouse`.
Vercel rewrites this to `api/openhouse.mjs`; the local Vite/API servers expose the same route.

Required string fields match the supplied CRM_INTEGRATION_GUIDE.md: name, email, phone, property, location, source, date_time, submission_date. Email must be valid; submission_date must be a parseable date. Success returns `{"success":true,"message":"Registration recorded"}`.

Registrations enter the existing Harbison Supabase leads table, with goal Open house, new status, source, property in interest, and location. The message preserves all eight original fields as JSON, visible in authenticated HQ. No schema migration or private read endpoint was added.

If Supabase fails, the endpoint attempts Formspree and identifies backup delivery in the response. If the entire endpoint fails, the corrected standalone forms attempt Formspree directly. HTTP errors, network errors, timeouts, and invalid JSON responses trigger that fallback. If both services fail, forms retain inputs and show a retry error; this is not a guarantee against every possible data-loss scenario. Backup submissions require retrieval from Formspree; there is no automatic replay into Supabase.

`public/openhouse-submit.js` contains the reusable submission logic. `scripts/update-openhouse-forms.mjs` embeds it into the original supplied index.html and openhouse.html, without changing styling. Both files in `C:/Users/blunts/Downloads/585 n wendy dr` were updated. Their external hosting location still needs confirmation; a backend deployment does not publish those Downloads files.

Validation: `npm run build`, `npm test`, and `node --env-file=.env scripts/test-openhouse-live.mjs [endpoint URL]`. The latter uses cURL, verifies all fields in the correct Harbison database, and deletes its unique disposable record. Do not use production credentials in browser code or documentation.
