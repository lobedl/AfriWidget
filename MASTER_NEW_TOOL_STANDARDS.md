# 🏆 MASTER PROTOCOL & ARCHITECTURAL STANDARD FOR NEW TOOLS

> **MANDATORY DIRECTIVE FOR ALL AI AGENTS & DEVELOPERS:**  
> This document defines the **immutable, non-negotiable architectural, styling, calculation, AI, sharing, and integration standard** for every new tool, calculator, converter, or utility built on the **AfriWidget** platform.  
> **Never build or deliver a tool without fulfilling every single phase in this protocol.**

---

## 🧭 The 9 Mandatory Phases for Every New Tool

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. Head & Schema        → Multi-path CSS, GA4, E-E-A-T JSON-LD        │
│ 2. Header & Breadcrumb  → Pre-rendered Nav & Zero-Mismatch Breadcrumb │
│ 3. Tool UI & Engine     → User-Action Mandate, Clean Vanilla JS       │
│ 4. Share Results System → share-results.js Adapter, Modal & Bar       │
│ 5. Universal AI Panel   → universal-ai.js, Full-Width 2-Col Grid      │
│ 6. Content & FAQ        → No-LaTeX, No-Tables, Official Citations     │
│ 7. 4-Layer Linking      → Next Steps, In-Text Links, Related Grid     │
│ 8. 8-Point Ecosystem    → index.html, Hub, widgets, footer, sitemap   │
│ 9. Build & Linting      → Dual CSS compile, node --check, PageSpeed   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Phase 1: `<head>` Architecture, Multi-Path CSS & E-E-A-T Schema

Every tool `.html` page MUST include the following in `<head>` in this exact sequence:

### 1.1 Multi-Path Stylesheet Inclusion (Netlify 0ms FOUC Mandate)
```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>[Specific Title Between 50–58 Chars] | AfriWidget</title>
  <meta name="description" content="[Authoritative description between 145–155 characters summarizing inputs, outputs, and regional compliance standards.]" />
  <link rel="canonical" href="https://afriwidget.com/[tool-slug]" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

  <!-- Multi-Path CSS Inclusion for 100% PageSpeed & Instant Cache Hit -->
  <link rel="stylesheet" href="branding.css" />
  <link rel="stylesheet" href="styles.css" />
  <link rel="stylesheet" href="/dist/styles.css" />

  <!-- Google Analytics Tracking -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>
```

### 1.2 E-E-A-T Schema.org Structured Data
```html
  <!-- Rich WebApplication E-E-A-T JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "[Tool Name]",
    "url": "https://afriwidget.com/[tool-slug]",
    "description": "[Tool Description]",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "2.0",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "AfriWidget Academic & Research Board",
      "url": "https://afriwidget.com/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AfriWidget",
      "url": "https://afriwidget.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://afriwidget.com/favicon.svg"
      }
    },
    "reviewedBy": {
      "@type": "Organization",
      "name": "AfriWidget Standards & Verification Committee"
    },
    "citation": [
      "https://official-governing-body-portal.gov"
    ],
    "datePublished": "2025-01-01",
    "dateModified": "2026-08-28"
  }
  </script>
</head>
```

---

## 🧭 Phase 2: Pre-Rendered Global Header & Zero-Mismatch Breadcrumbs

Directly inside `<body class="bg-slate-900 text-slate-100 min-h-screen flex flex-col font-sans antialiased">`:

1. **Pre-rendered `<nav>` header** with inline SVG star logo, desktop navigation links (`Home`, `Education Tools`, `Finance Tools`, `Health Tools`, `Productivity Tools`, `Success Stories`, `All Tools Directory`, and `Legal` dropdown menu).
2. **Visual Breadcrumb Bar** with exact category alignment:
   - Education Tool → `<a href="/education">Education Tools</a>`
   - Finance Tool → `<a href="/finance">Finance Tools</a>`
   - Health Tool → `<a href="/health">Health Tools</a>`
   - Productivity Tool → `<a href="/productivity">Productivity Tools</a>`
   - **STRICT FORBIDDEN**: Never leave copied category breadcrumbs like `/productivity` on an education or finance tool!

---

## 🚫 Phase 3: Interactive Tool Widget & Manual Action Mandate

### 3.1 Strict User-Action Mandate
- **NEVER** calculate or display results on initial page load.
- **NEVER** bind calculation routines directly to live keystroke `input` or `change` events.
- Calculations **MUST ONLY RUN** when the user explicitly clicks a primary action button (e.g. `id="calculateBtn"`, `id="computeScoreBtn"`).
- Initial result container **MUST** start hidden or display an informative placeholder (e.g. *"Enter your details and click Calculate to view results"*).

### 3.2 Mobile-First Touch Targets & High-Contrast Styling
- All input fields, selects, and buttons MUST have minimum height of `44px` (`py-3`, `px-4`, `rounded-xl`).
- Clear error feedback banners with distinct accessible colors (red/rose for errors, amber for warnings, emerald for success).

---

## 🔗 Phase 4: Share Results System & Social Modal (`share-results.js`)

Every tool MUST enable 1-click sharing so users can copy, bookmark, or send their exact inputs and calculation results.

### 4.1 In-Card Share & Copy Actions
Inside the calculation output card (`#resultsCard` / `#results`):
```html
<div class="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
  <button type="button" id="shareResultsBtn" data-share-btn class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer">
    <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
    <span>Share Results</span>
  </button>
  <button type="button" id="copySummaryBtn" class="inline-flex items-center gap-1 text-xs font-bold text-yellow-800 hover:text-yellow-900 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer">
    <span>📋 Copy Summary</span>
  </button>
</div>
```

### 4.2 Adapter Registration in `share-results.js`
Open `share-results.js` and register the tool slug under `TOOL_ADAPTERS`:
```javascript
'my-new-tool': {
  fields: () => [$('#inputField1'), $('#inputField2'), $('#selectOption')],
  calculate: () => $('#calculateBtn')?.click()
}
```

---

## 🤖 Phase 5: Universal AI Assistant & Live Insights (`universal-ai.js`)

Every tool automatically receives the universal AI assistant panel, which renders in a full-width responsive 2-column layout on Desktop and 4K TV displays.

### 5.1 Tool Registration in `universal-ai.js`
Open `universal-ai.js` and register the tool slug in `TOOL_CONFIGS`:
```javascript
'my-new-tool': {
  category: 'education', // or 'finance', 'health', 'productivity'
  resultIds: ['calculatedScore', 'statusBanner', 'breakdownList'],
  host: '#resultsCard'
}
```

### 5.2 Responsive AI Layout Standard
- Automatically injects after the tool grid container.
- **Desktop/TV (`lg:`)**: Spans `max-w-7xl` / `max-w-[88rem]` with a 7-column narrative context card on the left and a 5-column Q&A interactive console on the right.
- **1-Click Quick Chips**: Pre-populates actionable questions with instant submission.
- **Client-Side Fallback**: If Groq API key is unconfigured or rate-limited, provides rich local heuristic synthesis.

---

## 📚 Phase 6: Educational Content, Worked Examples & Trust Signals

Below the interactive tool widget, provide comprehensive, authoritative editorial content:

### 6.1 Strict Prohibition of LaTeX Syntax
- **NEVER use LaTeX notation** (`$...$`, `\frac{...}`, `\text{...}`).
- Always use clean plain text math symbols: `×`, `÷`, `+`, `-`, `=`, `**Bold Variables**`, and standard parenthetical expressions (e.g. `**APS** = Sum of 6 best NSC subject achievement levels`).

### 6.2 Strict Prohibition of Markdown Tables
- **NEVER use Markdown tables (`| ... |`)** because they collapse on mobile viewports.
- Use mobile-optimized **structured definition lists** (`- **Parameter**: Details`) and step-by-step bulleted audits.

### 6.3 Mandatory Content Sections
1. **About the Tool & Governing Framework**: Regulatory backdrop, target audience, and accredited syllabus standards.
2. **Official Calculation Methodology & Formulas**: Clear breakdown of formulas in plain text math.
3. **2 Realistic Worked Examples**:
   - *Worked Example 1*: High-achieving candidate scenario with itemized breakdown and admissions verdict.
   - *Worked Example 2*: Balanced pass / average scenario with recovery guidance.
4. **Official Authoritative Sources & Citations**: Live external links to official portals (e.g. WAEC, JAMB, KUCCPS, DHET, AACRAO, ATO, WHO, CDC).
5. **Interactive FAQ Accordion (`<details><summary>`)**: 4 to 6 comprehensive, realistic questions with authoritative answers.

---

## 🔗 Phase 7: 4-Layer Related Tools & Internal Linking (Zero-Isolation)

Every new tool MUST implement the 4-layer internal linking framework:

- **Layer 1 (Post-Result Workflow CTA)**: In-result card suggesting the next logical calculator in the journey.
- **Layer 2 (In-Article Contextual Links)**: 2+ natural keyword-rich links inside the guide copy.
- **Layer 3 (Dedicated Related Tools Grid)**: 3-to-4 card grid before FAQ/Footer with flags/icons, concise benefits, and direct clean URLs.
- **Layer 4 (Two-Way Reciprocal Linking)**: Update existing tools in the same cluster to link back to the new tool.

---

## 🌐 Phase 8: Complete 8-Point Ecosystem Integration (Zero-Orphan Mandate)

When a new tool is created, the developer/agent **MUST integrate it across all 8 endpoints in the same turn**:

| # | Endpoint | Required Action |
|---|---|---|
| **1** | **Homepage (`index.html`)** | Add tool card under correct category section with rich `data-search` tags, flag/icon, title, and description. Also add to static footer list. |
| **2** | **Category Hub (`education.html`, etc.)** | Add to `.category-tool-grid` and relevant deep-dive guide cards. |
| **3** | **Tools Directory (`widgets.html`)** | Add to the directory grid with category filter attributes and tag chips. |
| **4** | **Global Footer (`footer.js`)** | Add link to the relevant category column array. |
| **5** | **Sitemap (`sitemap.xml`)** | Add `<url>` entry with `priority 0.9` and `changefreq weekly`. |
| **6** | **LLM Documentation (`llms.txt`)** | Document under relevant H2 category header with clean markdown link. |
| **7** | **Universal AI (`universal-ai.js`)** | Register tool slug in `TOOL_CONFIGS`. |
| **8** | **Share Results (`share-results.js`)** | Register tool slug and field selectors in `TOOL_ADAPTERS`. |

---

## 🛠️ Phase 9: Verification, Build & Quality Assurance

Before concluding any work, execute and verify:

1. **Dual CSS Output Build**:
   ```bash
   npm run build:css
   ```
   *(Compiles `./input.css` into both `./dist/styles.css` and `./styles.css`)*

2. **JavaScript Syntax Verification**:
   ```bash
   npm run lint
   ```
   *(Executes `node --check server.js academic-tools.js universal-ai.js share-results.js footer.js new-tools.js`)*

3. **Production Build Confirmation**:
   ```bash
   npm run build
   ```

4. **100% PageSpeed Audit Verification**:
   - Zero FOUC: `<link rel="stylesheet" href="branding.css" />`, `styles.css`, `/dist/styles.css` in `<head>`.
   - All inline SVG icons have explicit `w-5 h-5` / `w-6 h-6` dimensions.
   - All interactive controls have min-44px touch targets.
   - Zero console errors on calculation and sharing.

---

**AfriWidget Engineering Quality Assurance Standard • Zero Orphans • Zero Breakages • 100% Performance**
