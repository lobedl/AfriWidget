# AGENTS.md - System Rules & Standards for AfriWidget

This document defines the mandatory development, build, deployment, and performance rules for any AI agent or developer working on the **AfriWidget** codebase.

---

## ⚡ 1. Netlify Deployment & CSS Build System Mandate

To guarantee **100% PageSpeed performance** and prevent style breakages upon Netlify deployment:

### 1.1 Multi-Path Stylesheet Inclusion in `<head>`
Every `.html` page in the project **MUST** include the following CSS link tags at the very top of `<head>`:

```html
<head>
  <link rel="stylesheet" href="branding.css" />
  <link rel="stylesheet" href="styles.css" />
  <link rel="stylesheet" href="/dist/styles.css" />
  ...
</head>
```

- **Why:** Netlify serves static files from the publish root (`.`). Linking both `styles.css` (root) and `/dist/styles.css` guarantees that regardless of how assets are served or cached, the minified Tailwind styles are fetched instantly with 0 ms lag.

### 1.2 Dual Output CSS Build Command
The build command in `package.json` must generate compiled output in both `./dist/styles.css` and `./styles.css`:

```json
"scripts": {
  "build:css": "npx @tailwindcss/cli -i ./input.css -o ./dist/styles.css --minify && node -e \"import('fs').then(fs => fs.copyFileSync('./dist/styles.css', './styles.css'))\"",
  "build": "npx @tailwindcss/cli -i ./input.css -o ./dist/styles.css --minify && node -e \"import('fs').then(fs => fs.copyFileSync('./dist/styles.css', './styles.css'))\""
}
```

### 1.3 Unignored CSS Artifacts in `.gitignore`
In `.gitignore`, compiled CSS files **MUST** be explicitly unignored so Netlify receives pre-built styles even if the build environment skips devDependencies:

```gitignore
!dist/styles.css
!styles.css
```

### 1.4 Netlify Configuration & Pretty URLs (`netlify.toml`)
Ensure `netlify.toml` specifies the build command, Node environment, and enables `pretty_urls`:

```toml
[build]
  command = "npm run build"
  publish = "."
  functions = "netlify/functions"

[build.processing]
  skip_processing = false

[build.processing.html]
  pretty_urls = true

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--include=dev"
```

### 1.5 Netlify Clean URL Routing Mandate (`_redirects`)
To prevent "Site not found" 404 errors when navigating clean routes (e.g. `/education`, `/gpa-calculator`):
- `_redirects` **MUST** include clean URL rewrite mapping:
  ```
  # Clean URLs Rewrite: Map clean paths (e.g., /education, /gpa-calculator) to .html files
  /:page            /:page.html     200
  ```
- **NEVER** add invalid wildcard rules like `/*/nav.js` or `/*/*.js` into `_redirects`. Invalid syntax breaks Netlify's routing engine and causes valid pages to return 404.

---


## 🛡️ 2. SVG Icon Fail-Safe Rules

All SVG icons must be bulletproof against unstyled rendering or flash of unstyled content (FOUC):

- Every inline `<svg>` must have explicit width/height fallback classes (e.g. `w-5 h-5` or `w-6 h-6`).
- `branding.css` must maintain fallback CSS rules targeting `svg[class*="w-"]` and `svg[class*="h-"]` to prevent raw SVGs from scaling to 100% viewport width if external CSS is ever delayed.

---

## 🚀 3. PageSpeed & Performance Checklist for New Tools

When adding a new tool or page:
1. **Head CSS Ordering:** Place `<link rel="stylesheet" href="branding.css" />`, `<link rel="stylesheet" href="styles.css" />`, and `<link rel="stylesheet" href="/dist/styles.css" />` immediately under `<head>`.
2. **Pre-rendered Global Header & Breadcrumbs:** Every page MUST include the complete, pre-rendered `<nav>` element (with SVG logo, brand wordmark, desktop navigation, and mobile hamburger menu) followed immediately by the visual breadcrumb bar. Never use empty placeholder containers.
3. **Pre-rendered HTML Content:** All headings, intro text, usage guides, and FAQ items MUST sit inside raw HTML markup (no empty root containers, no runtime template fetching for critical text).
4. **Vanilla JS & 100% Client-Side:** Calculations run in vanilla JavaScript with zero framework overhead.
5. **Google Analytics & Privacy Tag:** Include GA tracking and the privacy banner tag: `"⚡ 100% Free • No Signup • Private In-Browser Tool"`.
6. **Site Integration:** Link the tool across homepage categories, category hubs (Health, Finance, Education, Productivity), `sitemap.xml`, and `llms.txt`.
7. **Nav Script Inclusion:** Include `<script src="/nav.js" defer></script>` before `</body>`.

---

## 🚫 4. Strict Prohibition of LaTeX Syntax in Content & Code

- **NO LaTeX Allowed**: Under NO circumstances should any LaTeX syntax (e.g., `$...$`, `\text{...}`, `\frac{...}`, `\left`, `\right`) be used in `.md` guide content files, `.html` pages, or JavaScript scripts.
- **Why**: The site renders markdown directly into clean HTML without KaTeX or MathJax dependencies. LaTeX markup renders as unformatted raw code to visitors.
- **Replacement Standard**: Always use plain text, standard mathematical symbols (`×`, `÷`, `+`, `-`, `=`), bold font weighting for variables, and standard parenthetical math expressions (e.g., `**BMR** = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5`).

---

## 🏛️ 5. Authority, Citations & E-E-A-T Trust Signals Mandate

To prevent Google / AdSense / Search Console flags regarding *"limited authority and trust signals"* or missing credentials/cited sources:

1. **Explicit Authoritative Cited Sources**: Every tool and category hub MUST cite official governing bodies (e.g., WAEC, JAMB, KUCCPS, DHET, AACRAO, WHO, CDC) with live external links to official portals.
2. **Academic & Professional Review Board**: Every page must highlight editorial oversight, psychometrics review, and ISO/IEC 25010 software accuracy standards.
3. **Zero-Storage Privacy Certification**: Emphasize GDPR, NDPR, and POPIA compliant client-side in-memory computation.
4. **Rich E-E-A-T Schema.org Structured Data**: All `WebApplication` JSON-LD schemas MUST include `author`, `publisher`, `reviewedBy`, `citation`, and `dateModified` properties.
5. **Detailed Reference**: See `AUTHORITY_AND_TRUST_SIGNALS_GUIDELINES.md` for complete copyable templates and source tables.

---

## 🧭 6. Mandatory Global Header, Logo, Navigation & Breadcrumbs Standard

**STRICT ZERO-EXCEPTION REQUIREMENT**: Every single `.html` page on the AfriWidget platform without exception **MUST** contain the complete, pre-rendered static site header and visual breadcrumb navigation at the very top of `<body>`.

### 6.1 Required Static Header & Logo Structure
Directly under `<body ...>`:
```html
<nav class="bg-slate-900 text-white sticky top-0 z-50 shadow-xl">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <a href="/" class="flex items-center space-x-2">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 4L20.5 14L30 18L20.5 22L18 32L15.5 22L6 18L15.5 14Z" fill="#FACC15"/>
          <circle cx="28" cy="9" r="2.5" fill="#CA8A04"/>
          <circle cx="9" cy="11" r="1.5" fill="#FACC15" opacity="0.7"/>
        </svg>
        <span class="text-xl font-extrabold text-white">Afri<span class="text-yellow-300">Widget</span></span>
      </a>
      <div class="hidden md:flex items-center space-x-6 text-sm font-medium">
        <a href="/" class="transition-colors hover:text-yellow-300">Home</a>
        <a href="/education" class="transition-colors hover:text-yellow-300">Education Tools</a>
        <a href="/finance" class="transition-colors hover:text-yellow-300">Finance Tools</a>
        <a href="/health" class="transition-colors hover:text-yellow-300">Health Tools</a>
        <a href="/productivity" class="transition-colors hover:text-yellow-300">Productivity Tools</a>
        <a href="/success-stories" class="transition-colors hover:text-yellow-300">Success Stories</a>
        <a href="/widgets" class="transition-colors hover:text-yellow-300">All Tools Directory</a>
      </div>
      <button id="mobileMenuBtn" class="md:hidden p-2 rounded-md hover:bg-slate-700" aria-label="Open navigation menu">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
  </div>
  <div id="mobileMenu" class="mobile-menu md:hidden border-t border-slate-800 bg-slate-900 px-4 py-3 space-y-2 text-sm font-semibold">
    <a href="/" class="block py-2 hover:text-yellow-300 transition-colors">Home</a>
    <a href="/education" class="block py-2 hover:text-yellow-300 transition-colors">Education Tools</a>
    <a href="/finance" class="block py-2 hover:text-yellow-300 transition-colors">Finance Tools</a>
    <a href="/health" class="block py-2 hover:text-yellow-300 transition-colors">Health Tools</a>
    <a href="/productivity" class="block py-2 hover:text-yellow-300 transition-colors">Productivity Tools</a>
    <a href="/success-stories" class="block py-2 hover:text-yellow-300 transition-colors">Success Stories</a>
    <a href="/widgets" class="block py-2 hover:text-yellow-300 transition-colors">All Tools Directory</a>
  </div>
</nav>

<!-- Visual Breadcrumb Navigation -->
<div class="bg-slate-900 border-b border-slate-800/80">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
    <nav aria-label="Breadcrumb">
      <ol class="flex items-center flex-wrap gap-2 text-xs font-medium text-slate-400">
        <li class="inline-flex items-center">
          <a href="/" class="text-slate-400 hover:text-yellow-300 transition-colors inline-flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            <span>Home</span>
          </a>
        </li>
        <li class="text-slate-600 inline-flex items-center" aria-hidden="true">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </li>
        <li>
          <a href="/education" class="text-slate-400 hover:text-yellow-300 transition-colors">Education Tools</a>
        </li>
        <li class="text-slate-600 inline-flex items-center" aria-hidden="true">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </li>
        <li class="text-yellow-300 font-semibold truncate max-w-[260px] sm:max-w-none" aria-current="page">[Tool Page Title]</li>
      </ol>
    </nav>
  </div>
</div>
```

### 6.2 Never Use Placeholder Divs
- **NEVER** use `<div id="nav-placeholder"></div>` or omit the `<nav>` markup.
- All navigation and breadcrumbs must be statically present in raw HTML for instant rendering with 0 ms FOUC.
- Include `<script src="/nav.js" defer></script>` before `</body>` to bind mobile menu controls and active route states.

---

## 📖 7. Master Known Issues & Solutions Reference

All reported bugs, layout anomalies, build failures, and SEO audit warnings are cataloged in **`KNOWN_ISSUES_AND_SOLUTIONS.md`**. Every agent must review this playbook to prevent regressions on Netlify stylesheets, SVG icon sizing, LaTeX bans, schema classifications, favicon consistency, mobile placeholder cards, and static header preservation.

