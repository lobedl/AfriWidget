# MANDATORY NEW TOOL INTEGRATION STANDARD & CHECKLIST

This document establishes the **strict, non-negotiable, zero-exception integration standard** for every new tool, calculator, converter, or utility created on the **AfriWidget** platform.

---

## ⚡ Core Principle: The "Zero-Orphan" Policy
**NO TOOL MAY EXIST AS AN ORPHAN PAGE.**
When a new tool is built, it MUST be integrated across the platform ecosystem in the **same turn and commit**.
**Homepage Exception**: New tools should NOT be added to `index.html` (homepage). Instead, every new tool must be placed in its respective category hub page (e.g. `education.html`, `finance.html`, `health.html`, `productivity.html`, `business.html`), can be linked on relevant/complementary tool pages, and must be interconnected via related tools.

---

## 📋 Comprehensive Integration Checklist

Every single new tool (e.g. `my-new-tool.html`) MUST complete the integration steps before task completion:

### 1. Respective Category Hub Integration (`education.html`, `finance.html`, `health.html`, `productivity.html`, `business.html`)
The tool **MUST** be added under its respective category hub page using the standard card structure:
- Add the tool card to the `.category-tool-grid` with SVG icon (no emojis), title, description, and link.
- Use correct category attribution and clean URL path.
- Add thematic deep-dive or regional examination/guide cards within the category hub content where appropriate.
- Include official governing bodies in the JSON-LD `citation` array in the `<head>` of the category page.
- The tool can also be added to other complementary or related topic pages where relevant.
- **Do NOT add to the homepage (`index.html`)**.

### 2. All Tools Catalog (`widgets.html` / Directory)
- Add the tool card to the directory grid under the appropriate category section with:
  - Clean URL link.
  - Proper styling and card structure (no emojis).
  - Relevant tag chips.

### 3. XML Sitemap (`sitemap.xml`) & On-Page Date Synchronization
- Add `<url>` block with `<loc>https://afriwidget.com/[tool-slug]</loc>`, `<lastmod>YYYY-MM-DD</lastmod>`, `<changefreq>weekly</changefreq>`, and `<priority>0.9</priority>`.
- **STRICT MANDATE**: The `<lastmod>` date in `sitemap.xml` MUST match the creation date (or update date) exactly.
- The visible on-page update stamp (`Last Updated: <span>[D Month YYYY]</span>`) and Schema.org `dateModified` MUST strictly match this date.
- Whenever an existing tool is updated, both `sitemap.xml` and the page's update stamp must be updated strictly to the date of change (see `LAST_MODIFIED_AND_UPDATE_DATE_RULES.md`).


### 4. LLM & Search Index Reference (`llms.txt`)
- Add the markdown link and description under the relevant H2 header in `llms.txt`.

### 5. Universal AI Assistant Mapping (`universal-ai.js` / `ai-insight.js`)
- Register the tool slug in `TOOL_CONFIGS` in `universal-ai.js` (or relevant AI script) with category, result DOM element IDs, and prompt context for seamless in-app AI insights.

### 6. Share Results Adapter (`share-results.js`)
- If applicable, register the tool slug under `TOOL_ADAPTERS` in `share-results.js` with input field selectors and the calculate trigger button function.

### 7. 🔍 Search System Integration (`tools-index.json` & `build-search-engine.js`)
- **STRICT MANDATE**: The tool **MUST** be added to `tools-index.json` in alphabetical order by `slug` with:
  - `slug`, `name`, `shortName`, `description`, `category`, `url`.
  - 15+ rich `keywords` including country/region, acronyms, and common query variations.
- Verify icon mapping in `build-search-engine.js`.
- Recompile search engine: `node build-search-engine.js`.
- See `SEARCH_SYSTEM_INTEGRATION_MANDATE.md` for full instructions.

### 8. Static Header & Zero-Mismatch Breadcrumb Bar
- The tool page itself **MUST** contain the static pre-rendered `<nav>` header and a visual breadcrumb bar.
- The intermediate breadcrumb item **MUST** link to the tool's matching parent category (`/education`, `/finance`, `/health`, `/productivity`, `/business`).
- See `BREADCRUMB_AND_NAVIGATION_STANDARDS.md` for full requirements.

### 9. Dedicated Related Tools Section & Reciprocal Cluster Linking
- Every new tool **MUST** include a dedicated "Related Tools" 3-to-4 card grid section before the FAQ/Footer.
- Embed 2+ contextual anchor text links in the educational guide copy.
- Display a next-step recommendation CTA in or after the result calculation state.
- Update existing related tools in the same cluster to link back to the new tool.
- See **`RELATED_TOOLS_AND_INTERNAL_LINKING_STANDARDS.md`** for the complete cluster matrix and templates.

### 10. Design, Branding & Code Standards
- **Brand Palette**: Yellow `#facc15` / `#ca8a04` / `#fde047`, Black `#000000`, White `#ffffff`, and dark slate accents.
- **NO EMOJIS**: Strictly no emoji characters in UI elements, buttons, badges, or headers. Use inline SVG icons where visual indicators are needed.
- **NO TAILWIND**: Do NOT use Tailwind CSS, utility classes, or external CSS frameworks. All styles must be self-contained in a single `<style>` block in the page `<head>`.

---

## 🏆 Master Standard Reference
For the complete protocol covering HTML `<head>` tags, E-E-A-T schemas, no-LaTeX rules, no-tables mobile policies, manual action mandates, and build commands, consult platform documentation.

---

## 🚫 Anti-Patterns (Forbidden Practices)
- ❌ Adding new tools to `index.html` (homepage). Keep homepage curated; new tools belong in their respective category hubs and related tool grids.
- ❌ Forgetting to register the tool in `tools-index.json` and running `node build-search-engine.js`, making the tool invisible in search.
- ❌ Omitting the tool from `sitemap.xml` or `llms.txt`.
- ❌ Leaving mismatched parent category in the breadcrumbs.
- ❌ Building an isolated tool with zero outbound or inbound related tool links.
- ❌ Using emojis anywhere in UI headers, buttons, or result cards.
- ❌ Introducing Tailwind CSS or external CSS framework files.
