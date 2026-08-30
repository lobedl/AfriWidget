# Responsive Design, Margin & Anti-Cramp Layout Standards for AfriWidget

This document defines the mandatory **Responsive Architecture & Anti-Cramp Margin Rules** for all tools, calculators, and content pages on the AfriWidget platform. Every AI agent and developer MUST adhere to these rules without exception.

---

## ⚡ 1. The Core Problem: Why Cramped Margins Happen

On mobile screens (320px – 414px viewport width), every single pixel of horizontal padding counts:
- If `<main>` has `px-6` (48px total padding), and an inner card has hardcoded `p-8` (64px total padding), **112px of a 360px screen is wasted on empty margins alone**—leaving only 248px for input fields, buttons, and text.
- If `<header>` is placed inside `<main>` instead of at the root level, it inherits inner container bounds and CSS card resets, leading to collapsed widths and dark-on-dark illegibility.
- If `<main>` is restricted with arbitrary `max-w-2xl` or `max-w-xl`, it limits layout fluidity on tablets and desktop monitors while adding artificial constriction.

---

## 📐 2. The Standard 5-Tier Root Layout Hierarchy

Every `.html` page on AfriWidget MUST follow this exact 5-tier vertical DOM structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Multi-Path CSS & Meta Tags -->
  <link rel="stylesheet" href="branding.css" />
  <link rel="stylesheet" href="styles.css" />
  <link rel="stylesheet" href="/dist/styles.css" />
  ...
</head>
<body class="bg-slate-50 text-slate-900 font-sans min-h-screen flex flex-col antialiased">

  <!-- TIER 1: Pre-rendered Global Sticky Navigation -->
  <nav class="bg-slate-900 text-white sticky top-0 z-50 shadow-xl">
    ...
  </nav>

  <!-- TIER 2: Visual Breadcrumb Navigation Bar -->
  <div class="bg-slate-900 border-b border-slate-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
      <nav aria-label="Breadcrumb">
        <ol class="flex items-center flex-wrap gap-2 text-xs font-medium text-slate-400">
          ...
        </ol>
      </nav>
    </div>
  </div>

  <!-- TIER 3: Pre-rendered Full-Width Dark Hero Header (ROOT LEVEL - NEVER INSIDE <main>) -->
  <header class="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-10 sm:py-14 px-4 border-b border-slate-800 text-center">
    <div class="max-w-4xl mx-auto text-center">
      <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-yellow-300 text-xs font-semibold mb-3 shadow-inner">
        <span>[Category / Authority Badge]</span>
      </div>
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3">
        [Tool Page Title]
      </h1>
      <p class="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
        [Tool Description & Purpose]
      </p>
      <div class="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-emerald-400">
        <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>⚡ 100% Free • No Signup • Private In-Browser Tool</span>
      </div>
    </div>
  </header>

  <!-- TIER 4: Responsive Main Content Container -->
  <main class="flex-grow w-full max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
    <div class="w-full">
      <!-- Calculator / Tool Interactive Card -->
      <section class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 p-3.5 sm:p-6 lg:p-8 mb-8 sm:mb-10">
        ...
      </section>

      <!-- Educational Guides, FAQs, AI Assistant, Related Tools -->
      ...
    </div>
  </main>

  <!-- TIER 5: Pre-rendered Footer -->
  <div id="footer-placeholder"></div>
  <script src="/footer.js" defer></script>
  <script src="/nav.js" defer></script>
</body>
</html>
```

---

## 🛡️ 3. Anti-Cramp Margin & Responsive Rules

### Rule 3.1: Responsive Container Padding Math
- **Main Container**: `<main class="flex-grow w-full max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">`
  - Mobile (`<640px`): `px-3` (12px padding per side) leaves **336px** of usable space on a 360px screen.
  - Tablet (`≥640px`): `sm:px-6` (24px padding per side).
  - Desktop (`≥1024px`): `lg:px-8` (32px padding per side).
- **Interactive Tool Cards**:
  - **MANDATORY**: `p-3.5 sm:p-6 lg:p-8` and `rounded-2xl sm:rounded-3xl`.
  - **PROHIBITED**: Never use static unscaled `p-8` or `p-6` on major interactive containers.

### Rule 3.2: Grid Stacking & Input Responsiveness
- **Form Parameter Grids**: Always mobile-first stackable:
  ```html
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
  ```
- **Form Inputs & Selects**:
  ```html
  <input class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400" />
  ```
- **Primary Action Buttons**:
  ```html
  <button type="button" class="w-full sm:w-auto min-w-[240px] px-8 py-3.5 sm:py-4 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold text-sm sm:text-base rounded-xl sm:rounded-2xl shadow-lg transition-all active:scale-98 cursor-pointer">
    ⚡ Action Button Label
  </button>
  ```

### Rule 3.3: Metric Counter Cards (Results Panel)
When rendering calculation outputs (e.g. GPA, monthly payment, admissions score):
- Use compact 2-column or 4-column responsive grids:
  ```html
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 my-4 sm:my-6">
    <div class="bg-slate-800/80 border border-slate-700/80 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl text-center">
      <span class="block text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase">Metric Label</span>
      <span class="text-base sm:text-xl font-black text-white mt-1 block">Value</span>
    </div>
  </div>
  ```

### Rule 3.4: Touch Target Accessibility (WCAG 2.2 AA)
- All interactive controls (buttons, tabs, selects, checkboxes, delete icons) MUST maintain a minimum tap target of **44px × 44px** on mobile viewports.

---

## 🚫 4. Strict Layout Prohibitions Checklist

1. **NO Nested Headers**: Never put `<header>` inside `<main>` or inside `.bg-white` cards.
2. **NO Hardcoded `p-8`**: Any card with `p-8` must be converted to `p-3.5 sm:p-6 lg:p-8` or `p-4 sm:p-6 lg:p-8`.
3. **NO Arbitrary `max-w-2xl` on Tools**: Calculator pages must use `max-w-4xl` (or `max-w-5xl` for 2-column dashboards) to give ample space for inputs, tables, and amortisation grids.
4. **NO Hardcoded Multi-Column Grids**: Never use `grid-cols-2`, `grid-cols-3`, or `grid-cols-4` on mobile without `sm:` or `md:` breakpoints (except for compact metric counters using `grid-cols-2 sm:grid-cols-4`).
5. **NO Unscrollable Tables**: Any tabular data MUST be wrapped in `<div class="overflow-x-auto">` or rendered as responsive structured definition blocks.

---

## 🔍 5. Rapid Verification Script

Run this command to check for unscaled padding or narrow main containers:
```bash
python3 -c "
import glob, re
for f in sorted(glob.glob('*.html')):
    c = open(f).read()
    if re.search(r'<main[^>]*max-w-(?:2xl|xl)', c):
        print(f'{f}: narrow max-w on main')
    if re.search(r'class=\"[^\"]*\bp-8\b(?![^\"]*(?:sm:|md:|lg:))', c):
        print(f'{f}: static unscaled p-8')
"
```
