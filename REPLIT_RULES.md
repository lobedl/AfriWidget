# CRITICAL PROJECT ARCHITECTURE & BUILD MANDATES FOR AFRIWIDGET

## 1. ZERO DEPENDENCIES & NO FRAMEWORKS
* THIS IS A PURE STATIC WEBSITE. DO NOT USE REACT, VITE, NEXT.JS, VUE, OR MONOREPOS.
* DO NOT INSTALL NPM PACKAGES, CREATE A `package.json`, OR REQUIRE A NODE BACKEND/DATABASE (NO Express, NO PostgreSQL, NO Prisma).
* The entire project must consist solely of standalone `.html`, `.css`, and `.js` files located directly in the root directory.

## 2. RAW HTML PRE-RENDERING (ADSENSE MANDATE)
* To guarantee Google AdSense approval, ALL content text (1,200+ words for `index.html`, 800+ words for Category and Policy pages) MUST sit directly inside the raw `.html` markup.
* DO NOT create client-side single-page applications (SPAs) with empty `<div id="root"></div>` containers. Right-clicking "View Page Source" MUST display all long-form text in plain HTML.

## 3. STYLING & SCRIPTING RULES
* Tailwind CSS must be loaded purely via CDN in the `<head>` of every page:
  `<script src="https://cdn.tailwindcss.com"></script>`
* Interactive calculators (BMI, Compound Interest, GPA) must be written in standard, clean Vanilla JavaScript DOM operations inside inline or local `.js` files.

## 4. STATIC SERVER & WORKFLOW COMMANDS
* To launch the web preview, run ONLY a lightweight static file server:
  `npx --yes serve . -p 3000` or `python3 -m http.server 3000`
* DO NOT run interactive CLI scripts that prompt for user confirmation or time out waiting for terminal inputs.

## 5. NATIVE BACK BUTTON AND SCROLL BEHAVIOR
* Do not add custom Back buttons, custom history stacks, or page-load scroll resets.
* Let the browser/device Back action own navigation and native scroll restoration.
* Keep scrolling only for intentional user actions, such as revealing calculator results or an explicitly selected FAQ section.
