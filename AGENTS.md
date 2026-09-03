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
6. **Mandatory Homepage & Directory Integration:** ALWAYS and AUTOMATICALLY add the tool to the Homepage (`index.html`) under the correct category section with rich `data-search` tags, the relevant Category Hub page (`education.html`, `finance.html`, `health.html`, or `productivity.html`), the All Tools Directory (`widgets.html`), `footer.js` (and static HTML footer), `sitemap.xml`, `llms.txt`, and `universal-ai.js`. See `NEW_TOOL_INTEGRATION_RULES.md` for the complete standard.
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
        <div class="relative nav-dropdown group">
          <button type="button" class="flex items-center gap-1 transition-colors hover:text-yellow-300 py-1 cursor-pointer focus:outline-none" aria-expanded="false" aria-haspopup="true" aria-label="Legal and policy pages">
            <span>Legal</span>
            <svg class="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div class="nav-dropdown-menu absolute right-0 top-full pt-1.5 w-48 hidden group-hover:block z-50">
            <div class="rounded-xl bg-slate-900 border border-slate-700/90 shadow-2xl py-1.5 backdrop-blur-md">
              <a href="/privacy-policy" class="block px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-yellow-300 transition-colors">Privacy Policy</a>
              <a href="/terms" class="block px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-yellow-300 transition-colors">Terms of Service</a>
              <a href="/cookie-policy" class="block px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-yellow-300 transition-colors">Cookie Policy</a>
              <a href="/adsense-disclaimer" class="block px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-yellow-300 transition-colors">AdSense Disclaimer</a>
              <a href="/about" class="block px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-yellow-300 transition-colors">About Us</a>
              <a href="/contact" class="block px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-yellow-300 transition-colors">Contact</a>
            </div>
          </div>
        </div>
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
    <div class="pt-2.5 mt-2 border-t border-slate-800/80">
      <div class="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-1.5">Legal &amp; Info</div>
      <div class="grid grid-cols-2 gap-1 text-xs font-medium">
        <a href="/privacy-policy" class="py-1.5 px-2 rounded hover:bg-slate-800 hover:text-yellow-300 text-slate-300 transition-colors">Privacy Policy</a>
        <a href="/terms" class="py-1.5 px-2 rounded hover:bg-slate-800 hover:text-yellow-300 text-slate-300 transition-colors">Terms of Service</a>
        <a href="/cookie-policy" class="py-1.5 px-2 rounded hover:bg-slate-800 hover:text-yellow-300 text-slate-300 transition-colors">Cookie Policy</a>
        <a href="/adsense-disclaimer" class="py-1.5 px-2 rounded hover:bg-slate-800 hover:text-yellow-300 text-slate-300 transition-colors">AdSense Disclaimer</a>
        <a href="/about" class="py-1.5 px-2 rounded hover:bg-slate-800 hover:text-yellow-300 text-slate-300 transition-colors">About Us</a>
        <a href="/contact" class="py-1.5 px-2 rounded hover:bg-slate-800 hover:text-yellow-300 text-slate-300 transition-colors">Contact</a>
      </div>
    </div>
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

### 6.3 Strict Breadcrumb Category Alignment Mandate (Zero-Mismatch Policy)
- **STRICT REQUIREMENT**: The intermediate breadcrumb item (`<a href="/...">`) MUST EXACTLY match the tool's true domain category (e.g. an education/exam tool MUST link to `/education` "Education Tools", NEVER `/productivity` or another copied category).
- See **`BREADCRUMB_AND_NAVIGATION_STANDARDS.md`** for the canonical mapping matrix and automated verification script.

---

## 📖 7. Master Known Issues & Solutions Reference

All reported bugs, layout anomalies, build failures, and SEO audit warnings are cataloged in **`KNOWN_ISSUES_AND_SOLUTIONS.md`**. Every agent must review this playbook to prevent regressions on Netlify stylesheets, SVG icon sizing, LaTeX bans, schema classifications, favicon consistency, mobile placeholder cards, and static header preservation.

---

## 🌐 8. Mandatory Homepage & Ecosystem Tool Integration Standard (Zero-Orphan Policy)

**STRICT ZERO-ORPHAN REQUIREMENT**: When any new tool or calculator is created, the agent **MUST** integrate it across all 7 discovery endpoints in the **same turn**:
1. **Homepage (`index.html`)**: Under the correct category section (`education`, `finance`, `health`, `productivity`, `business`, `everyday`) with complete `data-tool-card`, `data-category`, `data-search`, flag/icon, title, description, and link. Also include in the static footer list.
2. **Category Hub (`education.html`, `finance.html`, etc.)**: In the `.category-tool-grid` and relevant guide cards.
3. **Directory (`widgets.html`)**: In the full tools directory grid with appropriate tag chips.
4. **Global Footer (`footer.js`)**: Linked in the relevant category column.
5. **Sitemap (`sitemap.xml`)**: Added with `priority 0.9` and `changefreq weekly`.
6. **LLM Reference (`llms.txt`)**: Documented with markdown link and concise description.
7. **Universal AI (`universal-ai.js`)**: Registered in `TOOL_CONFIGS` with result and host selector mapping.

*Refer to `NEW_TOOL_INTEGRATION_RULES.md` for full implementation details and card templates.*

---

## 🚫 9. Strict Prohibition of Auto-Generated Calculations (User-Initiated Action Mandate)

**STRICT ZERO-EXCEPTION REQUIREMENT**: No tool, calculator, or converter may automatically process, compute, or display results on page load or on raw `input`/`change` events.
1. **Explicit Action Trigger**: Calculations MUST ONLY run when the user explicitly clicks a dedicated button (e.g. `Calculate`, `Convert`, `Generate`, `Analyze`) or submits a form.
2. **No Auto-Run on Page Load**: Never call `calculate()`, `calc()`, or specific calculator functions on script initialization or `DOMContentLoaded`.
3. **No Reactive Keystroke Recalculation**: Do not attach calculation routines to `input` or `change` event listeners.
4. **Initial Result State**: Results should remain hidden or display an informative placeholder (e.g., *"Enter your details and click Calculate to view results"*) until the user takes action.
5. **Reference**: See `MANUAL_CALCULATION_USER_ACTION_MANDATE.md` for complete implementation details and code examples.

---

## 📋 10. Mandatory No-Tables Policy, Content Structure & Professional FAQ Standards

**STRICT ZERO-EXCEPTION REQUIREMENT**: Never use raw Markdown tables (`| ... |`) or ASCII box grids in `.md` educational guide files, HTML pages, or scripts.
1. **No Markdown Tables**: Markdown table syntax breaks mobile responsiveness and collapses into unformatted raw text.
2. **Mobile-Optimized Structural Replacement**:
   - Use structured specification lists (`- **Parameter**: Description`) for ratings, fee tiers, and criteria.
   - Use multi-level definition blocks for multi-attribute tiers.
   - Use step-by-step worked examples (`- **Matric Subject Breakdown**:`, `- **Score & Eligibility Audit**:`, `- **Admission Verdict**:`) for student scenarios.
3. **Professional FAQ Architecture**:
   - FAQ sections MUST start with `## Frequently Asked Questions (FAQ)`.
   - Each FAQ item MUST use `### [Question]?` subheadings with concise answers.
   - FAQ accordions are automatically compiled by `build-prerender.js` into interactive, styled `<details><summary>` cards with smooth rotating chevron animations and warm active accents.
4. **Reference**: See `CONTENT_FORMATTING_AND_FAQ_STANDARDS.md` for the complete guide and code templates.

---

## 🔗 11. Mandatory Related Tools & Internal Linking Standard (Zero-Isolation Policy)

**STRICT ZERO-EXCEPTION REQUIREMENT**: No newly created or modified tool may exist as an isolated island. Every tool MUST implement internal cross-linking across four mandatory layers:
1. **Layer 1 (Post-Result Workflow Recommendation)**: Suggest the next logical calculator/tool within the dynamic calculation results container.
2. **Layer 2 (Contextual In-Article Links)**: Embed natural keyword-rich links within the guide text and worked examples (never use generic "click here").
3. **Layer 3 (Dedicated Related Tools Grid)**: Render a 3-to-4 card grid section before the FAQ/Footer with flags/icons, concise benefits, and direct clean URLs.
4. **Layer 4 (Two-Way Reciprocal Linking)**: Update existing related cluster tools to link back to the newly created tool.
5. **Reference**: See **`RELATED_TOOLS_AND_INTERNAL_LINKING_STANDARDS.md`** for the canonical topic cluster matrix, copyable HTML card templates, and integration checklist.

---

## 📱 13. Mandatory Responsive Layout, Anti-Cramp Margin & Hero Standards

**STRICT ZERO-EXCEPTION REQUIREMENT**: Every single tool, calculator, and generator page on the AfriWidget platform **MUST** be 100% responsive across all mobile (320px+), tablet, and desktop viewports without cramped margins:

1. **Root-Level Hero Header**:
   - Every page MUST place `<header class="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-10 sm:py-14 px-4 border-b border-slate-800 text-center">` directly under the breadcrumbs at root level.
   - **NEVER** nest `<header>` inside `<main>` or inside white card containers.
2. **Anti-Cramp Main Container**:
   - `<main class="flex-grow w-full max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">`
   - Use `px-3` on mobile (<640px) to maximize usable screen real estate.
   - **NEVER** use `max-w-2xl` or `max-w-xl` on tool pages.
3. **Card & Widget Padding Math**:
   - Major interactive cards MUST use `p-3.5 sm:p-6 lg:p-8` and `rounded-2xl sm:rounded-3xl`.
   - **NEVER** hardcode static unscaled `p-8` or `p-6` on mobile.
4. **Mobile Input Scaling & Stacking**:
   - Parameter grids MUST stack single-column on mobile (`grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4`).
   - Action buttons MUST scale responsively: `py-3.5 sm:py-4 px-6 sm:px-8 text-sm sm:text-base rounded-xl sm:rounded-2xl w-full sm:w-auto min-w-[240px]`.
5. **Reference**: See **`RESPONSIVE_DESIGN_AND_MARGIN_STANDARDS.md`** for the complete architecture and verification scripts.

---

## ⚡ 14. Mandatory Performance, Zero-Flicker & Scroll Standards

**STRICT ZERO-EXCEPTION REQUIREMENT**: To prevent header flashing, layout shifts (CLS), and scroll freezes:
1. **Zero-Flicker Navigation**: `nav.js` MUST NOT overwrite `innerHTML` when static navigation links exist; it must only toggle active CSS classes.
2. **Zero-CLS Injected Components**: Injected assistants (`share-results.js`, `universal-ai.js`) MUST initialize with `hidden` class and only reveal upon explicit calculation.
3. **Zero-Flicker Sticky Header & Scroll Containment**: Sticky navigation headers must use `contain: paint` without transforms. Viewport scrolling uses `overflow-x: clip` on `html` and `overflow-x: hidden` on `body`. Never use `:has()` on root containers.
4. **Idle-Safe Timers**: Pause intervals when tab is hidden or assistant is not active.
5. **Reference**: See **`PERFORMANCE_AND_ZERO_FLICKER_STANDARDS.md`** for complete specifications.

---

## 📚 15. Mandatory 800+ Words Educational Content, Worked Examples & Unique FAQ Standards

**STRICT ZERO-EXCEPTION REQUIREMENT**: Every tool, calculator, planner, and generator page on the AfriWidget platform **MUST** contain at least **800+ words of unique, authoritative educational content**:
1. **Mandatory 4-Pillar Educational Depth**:
   - **How to Use the Tool**: Step-by-step user interaction manual.
   - **How the Calculation Works**: Detailed mathematical formulas (using plain text operators `×`, `÷`, `+`, `-`, `=`), scoring algorithms, and statutory policy standards.
   - **Step-by-Step Worked Examples**: Real-world realistic user/student profiles with concrete calculations and clear verdicts.
   - **Frequently Asked Questions (FAQ)**: Distinct, insightful questions answering specific user edge cases and institutional exceptions.
2. **Zero-Duplication & 100% Unique Policy**:
   - Worked examples and FAQs must be 100% unique to that specific tool/page. Never copy-paste, clone, or reuse generic examples across different tools.
3. **Markdown Guide Integration**:
   - Store content in `/content/[tool-slug].md`. The build prerender pipeline automatically compiles this markdown into interactive styled FAQ accordions and semantic HTML inside `<article class="...">`.
4. **Reference**: See **`MANDATORY_EDUCATIONAL_CONTENT_AND_WORD_COUNT_STANDARDS.md`** for complete specifications and templates.







