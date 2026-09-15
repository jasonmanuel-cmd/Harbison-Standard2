# Harbison Standard — Design handoff

Live homepage returned HTTP 200; its linked stylesheet returned HTTP 200 on September 12, 2026. Specifications below were extracted from project CSS, with live CSS included for comparison. Browser computed styles were not captured.

Source: https://www.harbisonstandard.com/ and src/styles.css / public/assets/fonts.css.

## Palette

| Color | Hex | RGB | Role |
|---|---|---|---|
| Navy | #031c2b | 3, 28, 43 | Headers, footer, dark panels; primary brand anchor |
| Gold | #edc66f | 237, 198, 111 | Primary CTA fills, dark-background accents |
| Cream | #f6f5ef | 246, 245, 239 | Default page background |
| Muted gold | #b78b43 | 183, 139, 67 | Light-background heading emphasis and rules |
| Ink | #08142e | 8, 20, 46 | Default body text |
| Secondary text | #52606a | 82, 96, 106 | Page introductions |
| Tinted section | #ecebe2 | 236, 235, 226 | Alternating editorial sections |
| Warm panel | #eae9df | 234, 233, 223 | Featured-property panels and CTA bands |
| Form surface | #fffef9 | 255, 254, 249 | Lead forms |
| Property surface | #faf9f4 | 250, 249, 244 | Listing cards |
| Border | #d5ccba | 213, 204, 186 | Lead-card border |
| Focus | #be8c36 | 190, 140, 54 | Keyboard focus on buttons and links |

## Design direction

Refined, editorial and personal: deep navy fields, warm cream space, restrained gold accents, large serif headlines and compact sans-serif labels. Real estate and investment are the public brand scope. Preserve the existing presentation when extending it; avoid introducing bright accent palettes, oversized rounded cards or a different type system. These are descriptive handoff guidelines, not a new visual redesign.

## Typography

PUBLIC HEADINGS: Georgia, serif. Later stylesheet rules override the original Libre Caslon heading declarations. General H1: 72px, weight 600, line-height .91, tracking -2px; at ≥1200px the general rule is 7.03vw. Route headings override this: clamp(46px, 5.3vw, 78px), weight 400, line-height 1.05, tracking -2.8px. Property H1: clamp(42px, 5.2vw, 70px), line-height 1.02; mobile 44px. H2 base: Georgia 47px, line-height .95, tracking -2px; editorial sections commonly use clamp(34px, 3.4vw, 49px), line-height 1.12, tracking -1.6px. H3 varies by component: typically Georgia 20–28px; service-card labels use uppercase Open Sans.

BODY: Open Sans 400, with bundled 500/600/700. Page lede 16px/1.7; standard descriptions 13–15px/1.7–1.85. Eyebrows 12px/600, uppercase, 1.8px tracking; hero eyebrow 4px tracking on desktop. Nav 10px/600, uppercase, .4px tracking. CTA 12px/700, uppercase, 1px tracking.

ITALICS: H1/H2 emphasis uses Georgia italic; base em elements retain Libre Caslon Text unless overridden. Libre Caslon Display remains in process numbers and private HQ. Never apply the initial Caslon rule alone and expect the current public appearance. Georgia is a system font and is not bundled here.

## Layout and spacing

Page gutters: 6.1% desktop, 6% mobile. The base page-wrap max-width is 1600px; at ≥1600px a later rule removes the max-width and uses max(6.1%, calc((100% - 1400px)/2)) gutters. Header: 92px tall, 4% horizontal padding. Page heading: 66px top / 48px bottom. Common section spacing: about 52–64px vertically. Multi-column editorial sections use 7–9% gaps. Property grid: three columns, 28px row / 23px column gaps.

This implementation uses component-specific spacing, not a strict 8px system. Common values include 9, 10, 14, 16, 18, 20, 22, 23, 24, 26, 28, 30, 34, 36, 42, 48, 58 and 64px. Match the component reference instead of rounding everything to a new scale.

## Logo and imagery

Use the supplied logo.webp asset rather than recreating the lettering. Header logo width: 250px desktop, 215px at narrower widths. Footer logo: 280px desktop, 240px mobile. CRITICAL: the original image contains a retired service tagline. The site hides that portion with clip-path: polygon(0 0, 100% 0, 100% 82%, 32% 82%, 32% 100%, 0 100%). Apply the same crop whenever using this source asset; the preview above does so. A clean vector master is not present in this handoff. No established minimum-size or clear-space specification was found; obtain an approved vector master before defining those rules.

hero.webp: atmospheric hero background, cover crop. mountains.webp: dark closing/community backgrounds. headshot.webp: agent portrait, usually object-fit cover; About portrait aspect 1/1.12 with offset gold frame, contact portrait 72px circular. Property-card photos: aspect 1.5, cover. Featured-property desktop image minimum height 405px; mobile aspect 1.4. Gallery: 2fr 1fr 1fr, 9px gaps, first item spans two rows. Preserve attribution on any attributed media. Apollo remains unpublished and its media is deliberately excluded. Assets are project references; verify usage and font licensing before redistribution beyond the authorized team.

## Buttons, links and navigation

PRIMARY CTA: gold #edc66f fill, #07131c text, 2px radius, 11px 22px padding, min-height 42px, min-width 176px, 15px icon gap. Subtle inset glow: 0 0 18px #ffeba65c. Header CTA minimum 149×38px. Mobile base button: min-width 145px, padding 12px 15px, 11px type. Buttons brighten to 1.12 on hover.

INLINE LINK: 12px/600, .4px tracking, 10px icon gap, 6px vertical padding, bottom border 1px #b78b4380; hover #a58445. Nav active state: gold text and 2px gold underline; mobile omits underline. Filter buttons: transparent fill, 1px #c5c3b7 border, 2px radius, padding 11px 17px; selected uses navy fill and gold text. Preserve real links for navigation and buttons for actions.

## Cards and forms

PROPERTY CARD: #faf9f4 fill, 1px #dcd8cc border, mostly square edges. Body padding 23px. Price Georgia 25px/400. Address heading 21px, line-height 1.2, tracking -.4px. Status badge navy with #f0cd7c lettering, 10px/600 uppercase, 1.8px tracking, 9px 15px padding; inset 18px from top and left.

LEAD CARD: #fffef9, 1px #d5ccba, 30px padding, very soft 0 8px 30px #122f3f05 shadow. Heading Georgia 28px/400, line-height 1.2, tracking -.8px. Fields: two columns / 16px gap; label 11px/600; input 13px, min-height 43px, padding 12px 10px, 2px radius, #cccabd border, #10232f text. Focus: 2px #b38d48 outline with 1px offset. Selected goal option: #f6f1e4 fill and #a37d39 border.

Document and design all states: default, selected, focus, validation error, sending, success, saved-with-email-fallback. Sending controls use .65 opacity and progress cursor. Error notice: #f7e3e0 fill, #dd9999 border, #7a2323 text. Success icon: #7b9e4b. Do not rely on color alone: retain text, labels and icons.

## Responsive behavior

≥1200px: fluid large hero typography; standard hero minimum height 50.6vw. ≥1600px: wide-screen gutter rule described above. ≤1050px: tighter contact layout and card padding; expertise grid reduces to two columns. ≤950px: narrower header/nav spacing. ≤740px: 80px header, hamburger navigation, header CTA hidden; editorial split layouts stack; page headings generally 46px with route-specific overrides; property cards remain TWO columns, gap 16px. Gallery becomes two columns with the first image full width. Mobile fixed contact bar provides Call, Text and Contact; preserve body bottom clearance of 64px. ≤460px: property cards and form fields become one column; lead-card padding 21px 18px. Private HQ also has a 900px breakpoint.

For handoff review, recommended artboards are 1440, 1024, 768, 390 and 320px. These artboard widths are review recommendations, not additional implemented breakpoints.

## Icons, motion and accessibility

Icons come from @phosphor-icons/react. Service icons explicitly use thin weight; trust-bar icons use fill; utility icons follow their component defaults. Typical utility sizes 20–24px, service icons 49px, social icons 23px. Maintain consistent stroke weight within each component.

Property images transition transform over .25s; card hover scale 1.025; gallery hover 1.018. Reduced-motion CSS disables relevant transitions and smooth scrolling. No new motion system is implied. Keyboard focus: 3px #be8c36 outline / 5px offset on links and buttons. Preserve skip navigation, meaningful image alt text, form labels, aria states and keyboard controls.

Gold works especially well on navy. Bright gold on cream has low contrast and should be treated as decoration, not small body text. Existing small type and muted-gold combinations are not a blanket accessibility certification. For any new design, verify each text/background pair and aim for at least 44px touch targets; the current header CTA is shorter.

## Content and brand rules

Write clear, supportive, specific real-estate copy. Use Harbison Standard and Nathanael Harbison, DRE 02059393. Public contact: (661) 472-7499 and nate85.realtor@gmail.com. Do not introduce Compass branding, San Diego service messaging, or building/development services. Keep property facts factual and status explicit; do not invent offers, dates, returns or guarantees. Apollo must stay unpublished until newly authorized. Page families: Home, About, Real Estate, Investing, Properties, Past Sales, Open Houses, Contact, relocation landing page and individual property pages. HQ is a private operational interface and is not part of public navigation.

## Developer and designer handoff

Included: this visual card; DESIGN-SPEC.md; design-tokens.json; the full source stylesheet snapshot; brand/background/portrait assets; six bundled font files with a relative-path font stylesheet. If successfully fetched, live-styles-reference.css records the public stylesheet.

Font mapping: font-0.ttf = Libre Caslon Display 400 normal; font-1.ttf = Libre Caslon Text 400 italic; font-2.ttf = Open Sans 400; font-3.ttf = Open Sans 500; font-4.ttf = Open Sans 600; font-5.ttf = Open Sans 700. Georgia relies on the platform; confirm typography on the target device.

Build Figma color styles from the supplied hex values and text styles from the component-specific specs. Use the full stylesheet for cascade and breakpoint exceptions. The token JSON is a normalized reference export, not an existing runtime token API. CSS pixels and sRGB hex/RGB values are specified; no unverified Pantone or CMYK matches are provided. Private HQ uses Caslon headings, white 6px-radius cards and compact operational controls; keep it separate from public marketing components. This card does not change the website.