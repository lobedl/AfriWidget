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
2. **Pre-rendered HTML:** All headings, intro text, usage guides, and FAQ items MUST sit inside raw HTML markup (no empty root containers, no runtime template fetching for critical text).
3. **Vanilla JS & 100% Client-Side:** Calculations run in vanilla JavaScript with zero framework overhead.
4. **Google Analytics & Privacy Tag:** Include GA tracking and the privacy banner tag: `"⚡ 100% Free • No Signup • Private In-Browser Tool"`.
5. **Site Integration:** Link the tool across homepage categories, category hubs (Health, Finance, Education, Productivity), `sitemap.xml`, and `llms.txt`.

---

## 🚫 4. Strict Prohibition of LaTeX Syntax in Content & Code

- **NO LaTeX Allowed**: Under NO circumstances should any LaTeX syntax (e.g., `$...$`, `\text{...}`, `\frac{...}`, `\left`, `\right`) be used in `.md` guide content files, `.html` pages, or JavaScript scripts.
- **Why**: The site renders markdown directly into clean HTML without KaTeX or MathJax dependencies. LaTeX markup renders as unformatted raw code to visitors.
- **Replacement Standard**: Always use plain text, standard mathematical symbols (`×`, `÷`, `+`, `-`, `=`), bold font weighting for variables, and standard parenthetical math expressions (e.g., `**BMR** = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5`).

