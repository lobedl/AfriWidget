# AfriWidget Performance & Zero-Flicker Standards

This document establishes the mandatory engineering standards for eliminating page-to-page navigation flashing, UI layout shifts (CLS), scroll freezes, and main-thread CPU stalls across the **AfriWidget** platform.

---

## ⚡ 1. Root Cause Taxonomy: What Causes Flashing & Freezing

When users report that a site "flashes when moving between pages" or "freezes while scrolling", the browser is encountering one or more of the following critical performance defects:

| Defect Symptom | Root Cause Mechanism | Anti-Pattern |
| :--- | :--- | :--- |
| **Header / Menu Flashing** | Client script wipes and rebuilds `<nav>` with `innerHTML` over pre-rendered HTML | `desktopMenu.innerHTML = ...` running on page load |
| **Sudden Content Jump (CLS)** | Dynamic elements (~100px+ height) injected into the middle of the DOM on load without `hidden` class | Unhidden `#shareResultBar` inserted below forms before calculation |
| **Scroll Stutter / Freezing** | Expensive CSS `:has()` parent-to-child selector traversal evaluating on every scroll event | `body:has(main article.prose)` or `div:has(> ins:empty)` |
| **Text Glyph Jitter on Scroll** | Disabling font kerning/subpixel rendering | `text-rendering: optimizeSpeed` disabling antialiasing |
| **CPU Background Thrashing** | Unconditional `setInterval(..., 1000)` running on every page even when inactive | Polling quota timers when AI widget is hidden |

---

## 🛡️ 2. Zero-Flicker Navigation Mandate (`nav.js`)

All AfriWidget pages already include pre-rendered static HTML navigation and breadcrumbs. Scripts **MUST NOT** destroy or re-render these elements at runtime.

### Rule 2.1: Never Wipe Pre-Rendered DOM Elements
- In `nav.js`, inspect existing links first:
  ```javascript
  // ✅ CORRECT: Fast class toggling with 0 ms DOM destruction
  var existingLinks = desktopMenu.querySelectorAll('a');
  if (existingLinks.length > 0) {
    existingLinks.forEach(function (link) {
      var isCurrent = (link.getAttribute('href') === page);
      link.classList.toggle('text-yellow-300', isCurrent);
      link.classList.toggle('font-bold', isCurrent);
    });
    return;
  }
  ```
- **STRICTLY FORBIDDEN**: Calling `desktopMenu.innerHTML = ...` or `mobileMenu.innerHTML = ...` when child links are already present.

---

## 📐 3. Zero-CLS Dynamic Component Injection Mandate

Dynamic assistant components (such as `share-results.js` and `universal-ai.js`) enhance tools with sharing and AI insights. However, they must never shift the layout during page load.

### Rule 3.1: Initialize Injected UI in `hidden` State
- Any dynamically injected bar or container MUST include the `hidden` class in its initial markup:
  ```javascript
  // ✅ CORRECT: Zero layout jump on initial paint
  const bar = document.createElement('div');
  bar.id = 'shareResultBar';
  bar.className = 'hidden mt-8 w-full max-w-7xl mx-auto rounded-3xl ...';
  ```
- The bar is revealed smoothly when the user explicitly triggers a calculation or when shared URL parameters are restored:
  ```javascript
  const revealShareBar = () => {
    if (bar.classList.contains('hidden')) {
      bar.classList.remove('hidden');
    }
  };
  document.addEventListener('submit', () => setTimeout(revealShareBar, 100), true);
  ```

---

## 🚀 4. 60fps Hardware-Accelerated Scroll Standards

To ensure silky-smooth 60fps scrolling on 120Hz mobile displays and desktops:

### Rule 4.1: Ban Expensive `:has()` Selectors on Ancestor Nodes
- Never use `:has()` on `body`, `html`, `main`, or generic `div` tags in global stylesheets.
- Use direct class targeting (e.g. `body.homepage-branding main article.prose` instead of `body.homepage-branding:has(...)`).

### Rule 4.2: Hardware Accelerate Sticky Navigation
- Sticky navigation headers must be promoted to their own GPU compositor layer:
  ```css
  nav.sticky, nav[class*="sticky"] {
    transform: translateZ(0);
    will-change: transform;
    backface-visibility: hidden;
  }
  ```

### Rule 4.3: Professional Anti-Aliased Font Rendering
- Always use legibility-optimized typography smoothing:
  ```css
  html {
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  ```

---

## ⏱️ 5. Idle-Safe Timer & Quota Management

- Continuous intervals (e.g. `setInterval`) must NOT run in the background when the user is simply reading a guide or scrolling a page.
- Timers in `universal-ai.js` must only start when the assistant is actively unhidden (`assistant.classList.contains('hidden') === false`) or when a question is asked.
- All timers must pause when the document is hidden (`document.addEventListener('visibilitychange', ...)`).

---

## 📋 6. Performance Audit Checklist for New Tools

Before committing any new tool or calculator:
- [ ] **No Header Flash**: Navigating to the page does not cause the top navigation to flicker or re-paint.
- [ ] **Zero Page Load CLS**: The page renders immediately without content jumping downwards after 100ms.
- [ ] **Smooth 60fps Scroll**: Scrolling from top to bottom exhibits zero frame drops, stuttering, or layout recalculations.
- [ ] **Idle CPU Efficiency**: Background CPU usage is 0% when the page is resting.
- [ ] **Head CSS Order**: `<link rel="stylesheet" href="branding.css" />`, `<link rel="stylesheet" href="styles.css" />`, and `<link rel="stylesheet" href="/dist/styles.css" />` are present in `<head>`.
