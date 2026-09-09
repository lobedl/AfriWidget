# AfriWidget SEO Rules & Standards

> **Mandatory reference** — apply these rules to every new `.html` page or tool added to AfriWidget.
> Compliance ensures Google AdSense approval, clean crawling, and strong organic rankings.

---

## 1. Canonical Tags — Zero Duplicates

- Every page must have **exactly one** `<link rel="canonical">` tag.
- Place it immediately after `<meta name="description">`.
- Use the **exact final published URL** — no trailing slash (except the home page), no `www` if not canonical, no `?` query strings.

```html
<link rel="canonical" href="https://afriwidget.com/bmi-calculator" />
```

- **Never** have two canonical tags on the same page — AdSense audits flag this as a crawl issue.
- **Never** let JavaScript or a `<meta http-equiv="refresh">` redirect away from the canonical URL.

---

## 2. Title & Meta Description

| Attribute | Length | Rule |
|-----------|--------|------|
| `<title>` | 50–60 characters | Unique per page; include primary keyword + "– AfriWidget" |
| `<meta name="description">` | 120–160 characters | Unique, descriptive, includes primary keyword and a CTA |

```html
<title>BMI, BMR &amp; TDEE Calculator – AfriWidget</title>
<meta name="description" content="Calculate your Body Mass Index, Basal Metabolic Rate, and Total Daily Energy Expenditure for free with AI-powered health insight cards." />
```

---

## 3. Robots — All Pages Indexable

- **Do NOT** add `<meta name="robots" content="noindex">` or `nofollow` to **any** tool or calculator page.
- All 26+ pages must remain fully indexable.
- `robots.txt` allows all agents: `User-agent: * / Allow: /`

---

## 4. Open Graph Tags (required on every page)

Place these after the canonical tag:

```html
<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://afriwidget.com/PAGE.html" />
<meta property="og:title" content="Page Title – AfriWidget" />
<meta property="og:description" content="120–160 char description." />
<meta property="og:image" content="https://afriwidget.com/og-image.png" />
<meta property="og:site_name" content="AfriWidget" />
```

- `og:url` must match the canonical URL exactly.
- `og:image` should be a 1200×630 px PNG (currently `og-image.png` at the root).

---

## 5. Twitter Card Tags (required on every page)

```html
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@afriwidget" />
<meta name="twitter:title" content="Page Title – AfriWidget" />
<meta name="twitter:description" content="120–160 char description." />
<meta name="twitter:image" content="https://afriwidget.com/og-image.png" />
```

---

## 6. JSON-LD Structured Data

Add **two** `<script type="application/ld+json">` blocks after Twitter tags:

### 6a. Main Schema (choose by page type)

**Calculator / Tool pages → `WebApplication`**
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "BMI, BMR & TDEE Calculator",
  "url": "https://afriwidget.com/bmi-calculator.html",
  "description": "...",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "browserRequirements": "Requires JavaScript",
  "isAccessibleForFree": true,
  "provider": { "@type": "Organization", "name": "AfriWidget", "url": "https://afriwidget.com/" }
}
```

**Valid `applicationCategory` values:**
| Tool type | Category |
|-----------|----------|
| BMI, TDEE | `HealthApplication` |
| Compound Interest, Mortgage, Rent | `FinanceApplication` |
| GPA | `EducationApplication` |
| PayPal Fees, Profit Margin, Hourly-Salary | `BusinessApplication` |
| JSON Formatter | `DeveloperApplication` |
| Password Generator | `SecurityApplication` |
| Word Counter | `UtilitiesApplication` |

**Category pages → `CollectionPage`**
```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Health & Wellness Tools – AfriWidget",
  "url": "https://afriwidget.com/health.html",
  "description": "...",
  "publisher": { "@type": "Organization", "name": "AfriWidget", "url": "https://afriwidget.com/" }
}
```

**Policy / static pages → `WebPage`**
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Privacy Policy – AfriWidget",
  "url": "https://afriwidget.com/privacy-policy.html",
  "description": "...",
  "publisher": { "@type": "Organization", "name": "AfriWidget", "url": "https://afriwidget.com/" }
}
```

**Special types:** `AboutPage` (about.html), `ContactPage` (contact.html), `FAQPage` (faq.html), `WebSite` (index.html only).

### 6b. BreadcrumbList (required on every page)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://afriwidget.com/" },
    { "@type": "ListItem", "position": 2, "name": "Health & Wellness", "item": "https://afriwidget.com/health.html" },
    { "@type": "ListItem", "position": 3, "name": "BMI Calculator", "item": "https://afriwidget.com/bmi-calculator.html" }
  ]
}
```

---

## 7. Site Navigation & Search Sitelinks

- Keep the primary site structure clear in raw HTML links, not only in JavaScript.
- Use descriptive, keyword-aligned anchor text consistently across desktop and mobile navigation:
  - `Health & Wellness Tools`
  - `Finance & Wealth Tools`
  - `Business & Freelance Tools`
  - `Education & Academic Tools`
  - `Tech & Developer Tools`
  - `All Tools & Widgets`
  - `BMI Calculator`
  - `Compound Interest Calculator`
  - `Cumulative GPA Calculator`
- The homepage must link directly to every primary category and priority calculator.
- Every other public page must expose the same primary navigation so no category or tool becomes orphaned.
- Add an `ItemList` containing `SiteNavigationElement` entries to `index.html` for the six categories, the all-tools directory, and the top tools.
- Sitelinks are selected by Google algorithmically; schema and navigation improve clarity but cannot guarantee a specific search-result layout.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "AfriWidget Site Navigation",
  "itemListElement": [
    {
      "@type": "SiteNavigationElement",
      "position": 1,
      "name": "Health & Wellness Tools",
      "url": "https://afriwidget.com/health.html"
    }
  ]
}
</script>
```

---

## 8. `<head>` Block Order (canonical template)

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Title – AfriWidget</title>
  <meta name="description" content="120–160 char description." />
  <link rel="canonical" href="https://afriwidget.com/page.html" />
  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://afriwidget.com/page.html" />
  <meta property="og:title" content="Page Title – AfriWidget" />
  <meta property="og:description" content="120–160 char description." />
  <meta property="og:image" content="https://afriwidget.com/og-image.png" />
  <meta property="og:site_name" content="AfriWidget" />
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@afriwidget" />
  <meta name="twitter:title" content="Page Title – AfriWidget" />
  <meta name="twitter:description" content="120–160 char description." />
  <meta name="twitter:image" content="https://afriwidget.com/og-image.png" />
  <!-- Structured Data -->
  <script type="application/ld+json">{ /* main schema */ }</script>
  <script type="application/ld+json">{ /* BreadcrumbList */ }</script>
  <link rel="icon" ... />
  <script src="https://cdn.tailwindcss.com"></script>
  ...
</head>
```

---

## 9. `sitemap.xml` Maintenance

- File lives at `/sitemap.xml` (root).
- Update `<lastmod>` whenever page content changes.
- **Priority guide:**
  - Home: `1.0`
  - Category pages: `0.9`
  - Tool/calculator pages: `0.9`
  - About/FAQ/Contact: `0.6`–`0.7`
  - Policy pages: `0.3`–`0.4`
- Add every new `.html` page to `sitemap.xml` the moment it is created.

---

## 10. `robots.txt` Rules

```
User-agent: *
Allow: /
Sitemap: https://afriwidget.com/sitemap.xml
```

- Never add `Disallow` rules for public tool or calculator pages.

---

## 11. AdSense-Specific Compliance

- Every page must have **≥ 800 words** of raw HTML body text (≥ 1,200 for `index.html`).
- Text must be visible in **View Page Source** — no SPA shells, no empty `<div id="root">`.
- No `noindex`, no JavaScript redirects, no meta refresh redirects on indexed pages.
- Tailwind CSS loaded via CDN only — no external blocking scripts.
- Scroll-to-top snippet required before `</body>` on every page:
  ```html
  <script>
    window.addEventListener('DOMContentLoaded', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  </script>
  ```

---

## 12. Checklist for New Pages

Before publishing any new `.html` tool or page, verify:

- [ ] Unique `<title>` (50–60 chars)
- [ ] Unique `<meta name="description">` (120–160 chars)
- [ ] Exactly **one** `<link rel="canonical">` with the correct final URL
- [ ] All 5 Open Graph tags present and matching canonical
- [ ] All 5 Twitter Card tags present
- [ ] Main JSON-LD schema (correct type for page)
- [ ] `BreadcrumbList` JSON-LD schema
- [ ] Descriptive primary navigation links are present in raw HTML
- [ ] Page added to `sitemap.xml` with correct priority
- [ ] No `noindex` / `nofollow` / JS redirects
- [ ] Body content ≥ 800 words in raw HTML
- [ ] Scroll-to-top snippet before `</body>`
- [ ] Tailwind via CDN in `<head>`
