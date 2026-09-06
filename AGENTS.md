# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

# Website structure and content decisions — September 6, 2026

- Keep the existing Harbison Standard navy, gold, cream, serif typography, and homepage visual direction when extending the site.
- About (`/about`), Properties (`/properties`), and Contact (`/contact`) must be separate linked pages, not homepage-only sections or contact dialogs.
- Use Nathanael Harbison’s Compass profile as the biographical/contact source: https://www.compass.com/agents/nathanael-harbison/ . Phone: (661) 472-7499. Email: nate85.realtor@gmail.com (user explicitly overrides the Compass email). DRE: 02059393.
- Properties should include verified sold transactions from his Compass profile, with matching photos, sold status, factual details, and source links. Do not imply all transactions were seller representation or are currently available.
- Contact needs his name, email, phone, all four social links, and an inquiry funnel; the homepage also needs a funnel.
- User-supplied social links: https://www.facebook.com/nate85.realtor ; https://www.instagram.com/nathanaelharbison ; https://www.youtube.com/@Nathanaelharbison ; https://www.linkedin.com/in/nathanael-harbison .
- No lead delivery service is currently configured. The inquiry flow prepares an email draft with an explicit send-in-email-app step and copy fallback. Never show a successful submission without confirmed delivery from a real service. Automatic lead capture still needs a configured service.

# Service page decisions — September 6, 2026

- The three homepage service cards link to separate pages: `/real-estate`, `/development`, and `/investing`.
- Replace the generic real estate opportunity message with selling a home during life changes, including divorce, bankruptcy, foreclosure, repairs, inheritance, and other circumstances. Use supportive language without promises about legal outcomes, guaranteed sales, or cash offers.
- Development covers having a home built, exploring land, and buying a spec home. User confirmed that “sim home” meant a spec home.
- Investing covers general property investing, inquiries about investing in Harbison Standard, and buying/restoring/flipping one's own homes. Do not invent an active company offering, terms, or returns.
- Each service page has a tailored inquiry funnel using the existing email-draft behavior and Gmail destination.
