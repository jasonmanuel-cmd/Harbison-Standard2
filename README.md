# Harbison Standard

Harbison Standard is the official website for Nathanael Harbison, a California REALTOR® (DRE 02059393) based in Bakersfield / Tehachapi. Phone (661) 472-7499 · nate85.realtor@gmail.com

## Pages

- **Home** (`/`) — brand hero, "From the ground up" builds CTA (YouTube), inquiry funnel
- **Properties** (`/properties`) — verified sold transactions with disclaimer; no external listing links
- **About** (`/about`) — bio with "Follow Nate's builds on YouTube" CTA
- **Contact** (`/contact`) — name, email, phone, all four social links, inquiry funnel
- **Services** — `/real-estate`, `/development`, `/investing` (each with its own tailored funnel)
- **HQ** (`/hq`) — password-protected lead dashboard (noindex)

## Lead capture

- Every inquiry funnel submits to Formspree (`https://formspree.io/f/xqpkdwrp`), with `_replyto` = visitor email and `_cc` = nate85.realtor@gmail.com.
- A non-blocking local copy is also written to the CRM at `POST /api/lead` (session id, path referrer, UTM params from `src/track.js`).

## CRM (Neon + Vercel + HQ UI)

The lead-capture CRM is a set of Vercel serverless functions under `api/` backed by Neon Postgres:

| Route | Auth | Purpose |
| --- | --- | --- |
| `POST /api/track` | public | record a page view / session |
| `POST /api/lead` | public | save an inquiry (returns 400 if name/email missing) |
| `GET /api/lead?id=` | Bearer | single lead + visit trail |
| `PATCH /api/lead` | Bearer | update status / notes |
| `GET /api/leads` | Bearer | list, filters: `status`, `q`, `limit` |
| `GET /api/stats` | Bearer | totals, top paths, leads by source/status, 14-day trend |

Tables (`leads`, `sessions`, `visits`) are created automatically on first use.

Environment variables (Vercel):
- `DATABASE_URL` — Neon Postgres connection string
- `ADMIN_TOKEN` — bearer password protecting `/hq` and every API endpoint

`vercel.json` rewrites to `/index.html` for everything except `/api/`. HQ at `/hq` signs in with `ADMIN_TOKEN` (stored in sessionStorage) and talks to the API.

## Local development

```
cp .env.example .env        # add DATABASE_URL + ADMIN_TOKEN
npm ci
npm run dev:api             # CRM API on :8787 (Vite proxies /api → :8787)
npm run dev -- --host 0.0.0.0 --port 4173
```

Anything under `/api` returns 503 "CRM not configured" until `.env` has a real `DATABASE_URL`.

## Build & handoff

```
npm run build        # leaves dist/client/index.html, dist/server/index.js, dist/.openai/hosting.json
npm run test:sites   # OpenAI Sites backup-host tests (worker/ untouched)
```

`worker/index.js` runs the site as a static fallback and does **not** serve `/api/*` or HQ.