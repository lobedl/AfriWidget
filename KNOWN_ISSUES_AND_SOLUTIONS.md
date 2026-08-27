# KNOWN_ISSUES_AND_SOLUTIONS.md - AfriWidget Engineering & SEO Playbook

> **MANDATORY MASTER REFERENCE FOR ALL AI AGENTS & DEVELOPERS**
> This document logs every major issue, bug, audit flag, and design defect reported across AfriWidget, accompanied by the root-cause analysis and exact copyable solution. Read this before building or updating any page.

---

## 📑 Table of Contents
1. [Issue 1: Authority & Trust Signals / E-E-A-T Audit Warning](#issue-1-authority--trust-signals--e-e-a-t-audit-warning)
2. [Issue 2: Netlify Deployment CSS Lag & Broken Stylesheets](#issue-2-netlify-deployment-css-lag--broken-stylesheets)
3. [Issue 3: Netlify 404s on Clean URLs & Invalid Wildcards in `_redirects`](#issue-3-netlify-404s-on-clean-urls--invalid-wildcards-in-_redirects)
4. [Issue 4: Raw LaTeX Formatting Rendered as Broken Text](#issue-4-raw-latex-formatting-rendered-as-broken-text)
5. [Issue 5: Huge SVG Icons Expanding to 100% Screen Width (FOUC)](#issue-5-huge-svg-icons-expanding-to-100-screen-width-fouc)
6. [Issue 6: Incorrect Schema Application Category & Missing FAQ Schemas](#issue-6-incorrect-schema-application-category--missing-faq-schemas)
7. [Issue 7: Inconsistent Favicons Breaking Google Search Favicon Snippet](#issue-7-inconsistent-favicons-breaking-google-search-favicon-snippet)
8. [Issue 8: Brand Color Inconsistency (Old Emerald Green vs Official Gold/Yellow)](#issue-8-brand-color-inconsistency-old-emerald-green-vs-official-goldyellow)
9. [Issue 9: Empty Result Placeholder Cards Causing Mobile Layout Gaps](#issue-9-empty-result-placeholder-cards-causing-mobile-layout-gaps)
10. [Issue 10: Missing Site Header, Logo, Navigation & Breadcrumbs on New Tools](#issue-10-missing-site-header-logo-navigation--breadcrumbs-on-new-tools)
11. [Issue 11: Breadcrumb Category Mismatch on Copied Templates](#issue-11-breadcrumb-category-mismatch-on-copied-templates)

---

## Issue 1: Authority & Trust Signals / E-E-A-T Audit Warning

### 🚨 The Problem:
Google AdSense and search quality audit flag:
> *"Authority & Trust Signals: Your page shows only limited authority and trust signals. The page includes privacy, disclaimer, and policy statements, but provides no credentials, certifications, awards, press logos, or cited sources."*

### 🔍 Root Cause:
Generic links to `/privacy-policy.html` and simple badges like `"⚡ 100% Free • No Signup"` prove basic user safety, but **fail to provide proof of algorithmic accuracy, editorial credentials, or authoritative sources** required for sensitive topics (YMYL: education, finance, health).

### ✅ The Solution:
Every tool page and category hub must include:
1. **Visible Trust & Review Card**: Highlighting peer-reviewed ISO/IEC 25010 calculation standards, editorial review board contributors, and zero-storage privacy compliance (GDPR/NDPR/POPIA).
2. **Explicit Authoritative Cited Sources**: Direct links and citations to governing bodies (e.g., WAEC, JAMB, KUCCPS, DHET, AACRAO, WHO).
3. **Rich E-E-A-T Schema.org**: JSON-LD with `author`, `publisher`, `reviewedBy`, `citation`, and `dateModified`.

---

## Issue 2: Netlify Deployment CSS Lag & Broken Stylesheets

### 🚨 The Problem:
Upon deploying to Netlify, pages occasionally loaded unstyled for 1–2 seconds (flash of unstyled content) or failed to find `/dist/styles.css`, damaging Google Core Web Vitals and PageSpeed scores.

### 🔍 Root Cause:
Netlify serves static files from the project root. If the HTML page only linked to `/dist/styles.css` and the build script didn't duplicate the compiled stylesheet to `./styles.css`, or if devDependencies were skipped, styles failed.

### ✅ The Solution:
1. **Triple-Link `<head>` Standard**:
   ```html
   <link rel="stylesheet" href="branding.css" />
   <link rel="stylesheet" href="styles.css" />
   <link rel="stylesheet" href="/dist/styles.css" />
   ```
2. **Dual-Output Build Command** in `package.json`:
   ```json
   "build": "npx @tailwindcss/cli -i ./input.css -o ./dist/styles.css --minify && node -e \"import('fs').then(fs => fs.copyFileSync('./dist/styles.css', './styles.css'))\""
   ```
3. **Unignore Compiled CSS** in `.gitignore`:
   ```gitignore
   !dist/styles.css
   !styles.css
   ```

---

## Issue 3: Netlify 404s on Clean URLs & Invalid Wildcards in `_redirects`

### 🚨 The Problem:
Navigating to clean paths like `/education` or `/wassce-aggregate-calculator` returned a "Site not found" 404 error on Netlify.

### 🔍 Root Cause:
Netlify requires an explicit rewrite rule to serve `.html` files for extensionless URLs. Adding invalid wildcards like `/*/nav.js` or `/*/*.js` broke Netlify's routing engine entirely.

### ✅ The Solution:
Maintain clean URL rewrite mapping in `_redirects`:
```
# Clean URLs Rewrite
/:page            /:page.html     200
```
Never insert invalid multi-segment wildcards into `_redirects`.

---

## Issue 4: Raw LaTeX Formatting Rendered as Broken Text

### 🚨 The Problem:
Formulas on calculation pages displayed as unformatted raw code such as:
`$$\text{BMR} = (10 \times \text{weight}) + ...$$`

### 🔍 Root Cause:
AfriWidget is a lightweight static website that does **NOT** load heavy math engines like KaTeX or MathJax. LaTeX macros are never parsed into HTML math typography.

### ✅ The Solution:
**Strictly BAN LaTeX.** Always use clean plain text with standard Unicode operators and bold variable names:
- ❌ Bad: `$$\text{APS} = \sum_{i=1}^6 \text{points}_i$$`
- ✅ Good: `**APS Score** = Sum of points earned across your 6 best subjects`
- Use standard symbols: `×`, `÷`, `+`, `-`, `=`, `≈`, `±`, `√`.

---

## Issue 5: Huge SVG Icons Expanding to 100% Screen Width (FOUC)

### 🚨 The Problem:
When pages loaded, inline SVG icons temporarily expanded to fill the entire viewport width before Tailwind CSS finished initializing.

### 🔍 Root Cause:
SVGs without explicit width and height attributes or fallback CSS classes default to `display: inline; width: 100%` inside flex/grid containers.

### ✅ The Solution:
1. Every `<svg>` MUST have explicit sizing classes: `class="w-5 h-5"` or `class="w-6 h-6"`.
2. `branding.css` enforces fail-safe fallback dimensions:
   ```css
   svg[class*="w-"] { max-width: 100%; }
   svg.w-5 { width: 1.25rem !important; height: 1.25rem !important; }
   svg.w-6 { width: 1.5rem !important; height: 1.5rem !important; }
   ```

---

## Issue 6: Incorrect Schema Application Category & Missing FAQ Schemas

### 🚨 The Problem:
Educational tools (e.g. GPA Calculator, BECE Aggregate Calculator, KCSE Cluster Calculator) were marked with irrelevant schema categories like `HealthApplication` or `BusinessApplication`, and lacked `FAQPage` schema.

### 🔍 Root Cause:
Templates copied from prior tools retained legacy category metadata without updating the JSON-LD `@type` or `applicationCategory`.

### ✅ The Solution:
1. Standardize educational tools to `"applicationCategory": "EducationalApplication"`.
2. Add rich `BreadcrumbList` hierarchy (`Home → Education Tools → [Tool Name]`).
3. Extract all `<details><summary>` FAQ items into a structured `FAQPage` schema block.

---

## Issue 7: Inconsistent Favicons Breaking Google Search Favicon Snippet

### 🚨 The Problem:
Google Search results failed to display the custom AfriWidget icon next to search snippets or showed a default globe icon.

### 🔍 Root Cause:
Different pages used competing favicon formats (inline `data:image/svg+xml`, relative `./favicon.ico` vs `/favicon.ico`, or missing PNG fallbacks).

### ✅ The Solution:
Every `.html` page MUST declare identical, root-relative crawlable favicon tags:
```html
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180.png" />
```

---

## Issue 8: Brand Color Inconsistency (Old Emerald Green vs Official Gold/Yellow)

### 🚨 The Problem:
Older pages used emerald green buttons and green headers, conflicting with the official AfriWidget gold/yellow design system.

### 🔍 Root Cause:
Copying headers and buttons from legacy internal templates rather than `index.html`.

### ✅ The Solution:
- **Logo Mark Accent**: `#FACC15` (Yellow-400) and `#CA8A04` (Yellow-600).
- **CTA Action Buttons**: Bright Yellow (`bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold`).
- **Category Badge/Accents**: Domain-specific badges (e.g. Emerald for verified academic trust cards, Yellow for CTAs).

---

## Issue 9: Empty Result Placeholder Cards Causing Mobile Layout Gaps

### 🚨 The Problem:
On mobile devices, calculation tools displayed large blank rectangular cards with just an icon or empty space before the user pressed "Calculate".

### 🔍 Root Cause:
Hardcoded placeholder cards in HTML that stayed visible with zero content before user calculation input.

### ✅ The Solution:
- Remove empty placeholder containers.
- Wrap result sections in a `hidden` class until the user triggers calculation.
- Display calculation output immediately following the form submission.

---

## Issue 10: Missing Site Header, Logo, Navigation & Breadcrumbs on New Tools

### 🚨 The Problem:
A newly created tool page loaded with the tool hero directly at the top of the viewport, completely missing the AfriWidget SVG logo, site brand name, top category navigation links, mobile hamburger menu, and visual breadcrumb trail.

### 🔍 Root Cause:
The page was created using an empty placeholder tag `<div id="nav-placeholder"></div>` or omitting `<nav>`. Because `build-prerender.js` searches for static `</nav>` tags to inject breadcrumbs, and `nav.js` only binds interactions to existing elements rather than injecting raw markup, the entire header was lost.

### ✅ The Solution:
1. **Never use placeholder divs**: Every `.html` page MUST contain the full static `<nav class="bg-slate-900 ...">` markup with SVG logo, desktop links, and mobile menu pre-rendered directly in HTML.
2. **Visual Breadcrumb Bar**: Pre-render the visual breadcrumb bar immediately beneath `</nav>`.
3. **Nav Script**: Add `<script src="/nav.js" defer></script>` before `</body>`.
4. **Automated Build Guard**: `build-prerender.js` automatically checks all HTML files during `npm run build` and replaces any placeholder with the full pre-rendered navigation header and breadcrumbs.

---

## Issue 11: Breadcrumb Category Mismatch on Copied Templates

### 🚨 The Problem:
A newly added tool page displayed an incorrect parent category in its breadcrumb trail (e.g., displaying `Home > Productivity Tools > ZIMSEC O-Level Points Calculator` or `Home > Productivity Tools > Ghana University GPA & CWA Calculator` instead of `Education Tools`).

### 🔍 Root Cause:
When cloning an existing tool template, the developer or AI agent omitted updating the intermediate breadcrumb link (`<a href="/productivity">Productivity Tools</a>` to `<a href="/education">Education Tools</a>`).

### ✅ The Solution:
1. **Strict Category Matrix**: Always match the intermediate breadcrumb link directly with the tool's subject domain (`/education`, `/finance`, `/health`, `/productivity`, `/business`, `/real-estate`).
2. **Automated Audit**: Before finishing any turn, run the automated verification script defined in `BREADCRUMB_AND_NAVIGATION_STANDARDS.md`.
3. **Canonical Reference**: Follow `BREADCRUMB_AND_NAVIGATION_STANDARDS.md` for all breadcrumb markup standards.

