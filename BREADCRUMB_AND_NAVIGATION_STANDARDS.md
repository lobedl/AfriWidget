# 🧭 BREADCRUMB & NAVIGATION INTEGRATION STANDARDS (Zero-Mismatch Policy)

This mandatory specification defines the strict, zero-exception rules for breadcrumb navigation across all AfriWidget tool pages and calculators.

---

## 🚫 1. The Core Violation & Prevention

### Root Cause of Past Defect:
When generating new tool pages by copying existing templates, developers or AI agents accidentally retained the parent category from the copied template (e.g. leaving `<a href="/productivity">Productivity Tools</a>` when creating an education calculator like `zimsec-olevel-points-calculator` or `ghana-university-gpa-calculator`).

### Zero-Tolerance Rule:
**Under NO circumstances may a tool page link to an unrelated parent category in its breadcrumb navigation.** Every tool's breadcrumb category **MUST** match:
1. The tool's primary domain (e.g., Education, Finance, Health, Productivity, Business, Real Estate).
2. The category registered in `universal-ai.js` under `TOOL_CONFIGS`.
3. The category hub where the tool is listed (`education.html`, `finance.html`, etc.).
4. The `data-category` attribute on homepage and directory cards.

---

## 📐 2. Canonical Category Breadcrumb Matrix

Use this lookup table to determine the exact path and link label for every tool:

| Tool Domain / Subject Matter | Parent Category Slug | Breadcrumb Intermediate Link Markup |
| :--- | :--- | :--- |
| **Education & Academics**<br>(WASSCE, BECE, GPA, CWA, ZIMSEC, KCSE, JAMB, TVET, UACE, UCE, Nursing Training, Matric, APS) | `/education` | `<a href="/education" class="text-slate-400 hover:text-yellow-300 transition-colors">Education Tools</a>` |
| **Finance & Wealth**<br>(Loan, Mortgage, Compound Interest, Savings, Currency, Debt, Salary) | `/finance` | `<a href="/finance" class="text-slate-400 hover:text-yellow-300 transition-colors">Finance Tools</a>` |
| **Health & Wellness**<br>(Calorie, BMI, BMR, Water Intake, Macro, Ovulation, Pediatric Dosage, Hydration) | `/health` | `<a href="/health" class="text-slate-400 hover:text-yellow-300 transition-colors">Health Tools</a>` |
| **Productivity & Utilities**<br>(QR Code, Password Generator, Minifier, Formatter, Unit Converter, Sitemap, Image Resizer) | `/productivity` | `<a href="/productivity" class="text-slate-400 hover:text-yellow-300 transition-colors">Productivity Tools</a>` |
| **Business & Freelance**<br>(Invoice, Rate Pricing, Profit Margin, Startup Cost, Website Valuation) | `/business` | `<a href="/business" class="text-slate-400 hover:text-yellow-300 transition-colors">Business Tools</a>` |
| **Real Estate & Housing**<br>(Rent Affordability, Property Valuation, Mortgage) | `/real-estate` | `<a href="/real-estate" class="text-slate-400 hover:text-yellow-300 transition-colors">Real Estate Tools</a>` |

---

## 🧩 3. Standard Static Breadcrumb HTML Template

Directly below the static site `<nav>` element and above the Hero `<header>`:

```html
<!-- Visual Breadcrumb Navigation -->
<div class="bg-slate-900 border-b border-slate-800/80">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
    <nav aria-label="Breadcrumb">
      <ol class="flex items-center flex-wrap gap-2 text-xs font-medium text-slate-400">
        <li class="inline-flex items-center">
          <a href="/" class="text-slate-400 hover:text-yellow-300 transition-colors inline-flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span>Home</span>
          </a>
        </li>
        <li class="text-slate-600 inline-flex items-center" aria-hidden="true">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </li>
        <li>
          <a href="/[EXACT_CORRECT_CATEGORY_SLUG]" class="text-slate-400 hover:text-yellow-300 transition-colors">[Exact Category Name] Tools</a>
        </li>
        <li class="text-slate-600 inline-flex items-center" aria-hidden="true">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </li>
        <li class="text-yellow-300 font-semibold truncate max-w-[260px] sm:max-w-none" aria-current="page">[Tool Page Title]</li>
      </ol>
    </nav>
  </div>
</div>
```

---

## 📱 4. Mobile Responsiveness & Truncation Guard

To avoid broken text wrapping on small screens (e.g. mobile devices < 360px width):
1. The `<ol>` container **MUST** contain `flex items-center flex-wrap gap-2 text-xs`.
2. The current active page `<li>` **MUST** include `truncate max-w-[260px] sm:max-w-none text-yellow-300 font-semibold` to prevent long tool names from overflowing or breaking parent containers awkwardly.

---

## 🔍 5. Mandatory Verification Command

Before completing any task that creates or modifies a tool page, the agent **MUST** run this automated verification test in Node.js:

```bash
node -e '
const fs = require("fs");
const uai = fs.readFileSync("universal-ai.js", "utf8");
const match = uai.match(/const TOOL_CONFIGS = \{([\s\S]*?)\n  \};/);
const configs = {};
if (match) {
  const lines = match[1].split("\n");
  for (const l of lines) {
    const km = l.match(/\x27([a-z0-9-]+)\x27:\s*\{\s*category:\s*\x27([a-z-]+)\x27/);
    if (km) configs[km[1]] = km[2];
  }
}
const files = fs.readdirSync(".").filter(f => f.endsWith(".html") && !["index.html", "widgets.html", "education.html", "finance.html", "health.html", "productivity.html", "business.html", "real-estate.html", "contact.html", "faq.html", "privacy-policy.html", "terms.html", "cookie-policy.html", "success-stories.html"].includes(f));
let mismatches = 0;
for (const file of files) {
  const toolSlug = file.replace(".html", "");
  const expectedCat = configs[toolSlug];
  const content = fs.readFileSync(file, "utf8");
  const bcMatch = content.match(/<nav aria-label="Breadcrumb">([\s\S]*?)<\/nav>/);
  if (!bcMatch) { console.error("Missing breadcrumb:", file); mismatches++; continue; }
  if (expectedCat && !bcMatch[1].includes("/" + expectedCat)) {
    console.error("MISMATCH in " + file + ": expected /" + expectedCat); mismatches++;
  }
}
if (mismatches > 0) process.exit(1);
console.log("Breadcrumb audit passed 100% cleanly!");
'
```
