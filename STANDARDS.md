# AfriWidget Development Standards

This document describes the architecture, design system, and content rules for AfriWidget. Every page must follow these standards.

## 1. Architecture

Every HTML page is self-contained and standalone. All CSS lives in a single `<style>` block in the `<head>`. No external CSS files. No external JavaScript files. No CDN dependencies for styling. No Tailwind, no utility classes, no frameworks.

Pages may load JavaScript only from these sources:
- Inline `<script>` blocks in the page
- QR code generation library (window.QRCode or window.qrcode)
- Google Analytics
- AdSense

## 2. Colours

Palette:
- Black: #000000
- White: #ffffff
- Yellow: #facc15
- Dark yellow (accent): #ca8a04
- Light yellow: #fde047
- Very light yellow: #fef3c7

Slate grays for supporting elements:
- #0f172a (darkest slate)
- #1e293b, #334155, #475569, #64748b (mid-range)
- #cbd5e1, #e2e8f0, #f1f5f9, #f8fafc (light)

No gradients. No off-brand colours. No emojis in the UI.

## 3. Typography

System font stack only. No Google Fonts, no custom fonts.

```
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
```

Headings: bold or black weight (font-weight 700 or 900) with tight letter-spacing (-0.05em or tighter).

Body text: regular weight (400) with line-height 1.5 to 1.75.

## 4. Required Head Elements

Every page must include:

- `<meta charset="utf-8" />`
- `<meta name="viewport" content="width=device-width, initial-scale=1" />`
- `<meta name="impact-site-verification" content="..." />` (check existing pages)
- `<title>` with keyword-focused, 50-60 character title
- `<meta name="description" content="..." />` (120-160 characters)
- `<link rel="canonical" href="..." />`
- `<link rel="icon" href="/favicon.ico" />` or appropriate favicon
- Open Graph tags: og:title, og:description, og:url, og:type, og:image
- Twitter Card tags: twitter:card, twitter:title, twitter:description
- Google Analytics GA4: `G-6V491CW7H0`
- AdSense (`<head>` script): `ca-pub-2239061398283474`
- JSON-LD block containing:
  - WebApplication schema
  - BreadcrumbList schema
  - FAQPage schema (if applicable)
  - citation array with at least 3 authoritative sources

## 5. Page Structure

Standard layout order:

1. Sticky black navigation bar with white text
2. Black breadcrumb trail (semantic nav > ol > li)
3. White SEO header (h1, description, metadata)
4. Tool section (calculator, form, or interactive element)
5. Long-form article with table of contents (TOC)
6. FAQ accordion using `<details>` / `<summary>` elements
7. Related tools grid (4 columns on desktop, 2 on tablet, 1 on mobile)
8. Black call-to-action section
9. Black four-column footer with legal links
10. Cookie consent banner (bottom, dismissible)

## 6. Class Naming

Use a single set of reusable semantic class names across all pages:

`.site-nav` – sticky navigation bar
`.brand-text` – branded text or logo
`.breadcrumb` – breadcrumb navigation
`.breadcrumb li` – breadcrumb item
`.seo-title` – main page title (h1)
`.tool-card` – individual tool in grid
`.policy-article` – long-form article section
`.toc` – table of contents container
`.faq-item` – FAQ accordion item (details element)
`.stat-card` – statistic or metric card
`.btn-yellow` – yellow action button
`.btn-black` – black action button
`.cookie-banner` – cookie consent footer
`.footer-column` – footer column container
`.related-tools` – grid of related tool cards

## 7. AI Insight

Press-to-generate only. Nothing transmits until the user clicks. All payloads are anonymous. Endpoint: `/api/ai-insight`.

Users get 5 custom questions per 24-hour window. Quick-suggestion chips are pre-loaded. No session data, no user tracking, no cookies.

## 8. Content Rules

Every word is human-written. No AI-generated filler, no jargon, no invented outcomes.

Do not use:
- Success stories or testimonials
- Invented user quotes
- "Our server" or similar personification
- Stock phrases like "seamless", "cutting-edge", "industry-leading"
- Placeholder content

All content must be AdSense-safe (no violent, sexual, or hateful material).

## 9. Responsive Design

Mobile-first. Breakpoints:
- 640px: small tablets
- 768px: standard tablets
- 1024px: desktop

Touch targets: minimum 44px x 44px.
Input fields: 16px font on mobile (prevents iOS auto-zoom).
No horizontal scroll at any viewport width.

## 10. What Not to Do

- Do not use Tailwind, utility classes, or any CSS framework.
- Do not create external CSS or JS files unless explicitly requested.
- Do not add gradients to backgrounds.
- Do not use colours outside the approved palette.
- Do not add emojis to the UI.
- Do not include placeholder content.
- Do not reformat files unless explicitly asked.
- Do not regenerate entire files when a small edit will suffice.
- Do not add dependencies or CDN scripts without approval.
- Do not deviate from the class naming convention.

## 11. Last Modified and Update Date Synchronization

Whenever any tool, page, category hub, or policy document is created or updated:
- The visible on-page update date (`Last Updated: <span>...</span>`) must be updated strictly to the date of the change (`D Month YYYY`).
- Any Schema.org JSON-LD `dateModified` property must be updated strictly to the date of the change (`YYYY-MM-DD`).
- The page's `<lastmod>` entry in `sitemap.xml` must be updated strictly to the date of the change (`YYYY-MM-DD`).
- Unmodified pages must never receive blanket timestamp updates; only changed pages receive the updated date.
- See `LAST_MODIFIED_AND_UPDATE_DATE_RULES.md` for full requirements and validation procedures.

