# IndexNow

The repository includes a hosted verification file at public/indexnow-key.txt and a submission script. After a successful production deployment, run npm run indexnow. It verifies the hosted key, reads only the production sitemap, excludes private routes, and submits those public URLs to IndexNow.

No paid service or recurring job is required. This is an explicit submission command, not a configured cron job. Repeat after publishing changes. Apollo stays excluded while unpublished. HTTP 200 means received; HTTP 202 means key verification pending. Neither guarantees indexing.

Protocol: https://www.indexnow.org/documentation
