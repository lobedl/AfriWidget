# MANDATORY NEW TOOL INTEGRATION STANDARD & CHECKLIST

This document establishes the **strict, non-negotiable, zero-exception integration standard** for every new tool, calculator, converter, or utility created on the **AfriWidget** platform.

---

## ⚡ Core Principle: The "Zero-Orphan" Policy
**NO TOOL MAY EXIST AS AN ORPHAN PAGE.**
When a new tool is built, it MUST be integrated across the entire platform ecosystem in the **same turn and commit**. A developer or AI agent must NEVER require user prompting or reminders to add a tool to the Homepage or directory catalogs.

---

## 📋 Comprehensive 7-Point Integration Checklist

Every single new tool (e.g. `my-new-tool.html`) MUST complete all 7 integration steps before task completion:

### 1. Homepage Category Matrix Integration (`index.html`)
The tool **MUST** be added under its respective category section in `index.html` (Education, Finance, Health, Productivity/Business, Everyday) using the standard card structure:
- Correct `data-category` attribute (e.g., `education`, `finance`, `health`, `productivity`, `business`, `everyday`).
- Rich `data-search` attribute with relevant keywords, aliases, regional descriptors, and search queries.
- Official regional flag / thematic SVG icon.
- Clear title, 2-line description, and explicit action CTA (`Launch tool →` or `Calculate [X] →`).
- Also add to the static HTML footer list in `index.html`.

#### Example Homepage Card Template:
```html
<a class="tool-card group rounded-2xl border border-slate-200 border-l-4 border-l-yellow-300 bg-white p-5" 
   data-tool-card 
   data-category="education" 
   data-search="uace points calculator uneb a level makerere pujab uganda principal passes" 
   href="uace-points-calculator">
  <div class="mb-5 flex items-start justify-between">
    <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-yellow-800">
      <span class="text-sm font-black">🇺🇬</span>
    </span>
    <span class="text-xs font-bold text-slate-400">Uganda UNEB</span>
  </div>
  <h4 class="text-lg font-extrabold text-slate-950">UACE Points Calculator</h4>
  <p class="mt-2 min-h-12 text-sm leading-6 text-slate-600">Calculate UNEB A-Level points (out of 20), Principal Passes, and Makerere PUJAB university cut-off weights.</p>
  <span class="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-slate-950 group-hover:text-yellow-700">Calculate UACE Points <span aria-hidden="true">→</span></span>
</a>
```

---

### 2. Category Hub Integration (`education.html`, `finance.html`, `health.html`, `productivity.html`)
- Add the tool card to the `.category-tool-grid` with SVG icon, title, description, and link.
- Add thematic deep-dive or regional examination/guide cards within the category hub content where appropriate.
- Include official governing bodies in the JSON-LD `citation` array in the `<head>` of the category page.

---

### 3. All Tools Catalog (`widgets.html`)
- Add the tool card to the directory grid under the appropriate category section with:
  - `data-category="[category]"`
  - Proper border accent and hover animations.
  - Tag chips (e.g. `20-Point Scale`, `PUJAB Weights`).

---

### 4. Global Footer Script (`footer.js`)
- Add the direct link to the respective column in `footer.js` so all dynamic pages render the link in their footer.

---

### 5. XML Sitemap (`sitemap.xml`)
- Add `<url>` block with `<loc>https://afriwidget.com/[tool-slug]</loc>`, `<lastmod>YYYY-MM-DD</lastmod>`, `<changefreq>weekly</changefreq>`, and `<priority>0.9</priority>`.

---

### 6. LLM & Search Index Reference (`llms.txt`)
- Add the markdown link and description under the relevant H2 header in `llms.txt`.

---

### 7. Universal AI Assistant Mapping (`universal-ai.js`)
- Register the tool slug in `TOOL_CONFIGS` in `universal-ai.js` with category, result DOM element IDs, and host card ID for seamless Groq/Gemini in-app AI insights.

---

### 8. Static Header & Zero-Mismatch Breadcrumb Bar
- The tool page itself **MUST** contain the static pre-rendered `<nav>` header and a visual breadcrumb bar.
- The intermediate breadcrumb item **MUST** link to the tool's matching parent category (`/education`, `/finance`, `/health`, `/productivity`, `/business`, `/real-estate`). Never leave a copied category slug like `/productivity` on an education or finance tool.
- See `BREADCRUMB_AND_NAVIGATION_STANDARDS.md` for full requirements and the automated audit script.

---

### 9. Dedicated Related Tools Section & Reciprocal Cluster Linking
- Every new tool **MUST** include a dedicated "Related Tools" 3-to-4 card grid section before the FAQ/Footer.
- Embed 2+ contextual anchor text links in the educational guide copy.
- Display a next-step recommendation CTA in or after the result calculation state.
- Update existing related tools in the same cluster to link back to the new tool.
- See **`RELATED_TOOLS_AND_INTERNAL_LINKING_STANDARDS.md`** for the complete cluster matrix and copyable HTML templates.

---

## 🚫 Anti-Patterns (Forbidden Practices)
- ❌ Creating a tool `.html` page and finishing without touching `index.html`.
- ❌ Putting a tool on `widgets.html` but forgetting `index.html` (Homepage).
- ❌ Adding a card with generic or missing `data-search` attributes, which breaks homepage live search filtering.
- ❌ Leaving a mismatched parent category in the breadcrumbs (e.g. `Productivity Tools` on an education calculator).
- ❌ Building an isolated tool with zero outbound or inbound related tool links.
- ❌ Relying on user feedback to discover unlinked or orphan tools.
