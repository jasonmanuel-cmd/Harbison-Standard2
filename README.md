# Harbison Standard

Responsive React website recreated from the supplied design, with a contact dialog and property inquiry gallery.

- Call: +1 661 472 7499
- Email: nate85.realtor@gmail.com
- Property inquiries include user-supplied photos. Availability is not asserted.
- Social icons open a contact prompt until actual profile URLs are supplied.
- Hero, mountain banner and logo are recreated from the supplied reference; service photos are extracted from that reference. Exact photographic fidelity requires original assets.

## Development

Node.js 22 or newer:

```
npm ci
npm run dev -- --host 0.0.0.0 --port 4173
npm run build
```

Static deployment output is `dist/client`. No database, paid services, or form backend required. Contact links open the visitor's own phone or email application.
