# 🔍 MANDATORY SEARCH SYSTEM INTEGRATION STANDARD & ZERO-MISSING-SEARCH MANDATE

> **STRICT ZERO-EXCEPTION REQUIREMENT FOR ALL DEVELOPERS AND AI AGENTS:**  
> Every new tool, calculator, converter, or generator built on the **AfriWidget** platform **MUST BE STRICTLY ADDED TO THE SEARCH SYSTEM** in the **same turn and commit**.  
> If a user types the tool's name, country, acronym, or keywords into the site search bar or the global `Ctrl+K` modal, the tool **MUST appear instantly in autocomplete results**.

---

## ⚡ 1. The Core Architecture of AfriWidget Search

The AfriWidget search system is 100% client-side, instant (<1ms search time), typo-tolerant, and dependency-free. It consists of three tightly coupled components:

```
┌──────────────────────────┐     node build-search-engine.js     ┌──────────────────────────┐
│    tools-index.json      │ ─────────────────────────────────>  │     search-engine.js     │
│ (Canonical Tool Catalog) │                                     │  (Compiled Search Asset) │
└──────────────────────────┘                                     └──────────────────────────┘
                                                                               │
                                                                               ▼
                                                                 ┌──────────────────────────┐
                                                                 │   Global Nav & Modals    │
                                                                 │ (Ctrl+K, Inputs, Badges) │
                                                                 └──────────────────────────┘
```

1. **`tools-index.json`**: The single source of truth containing all indexed tools, their slugs, full names, short names, descriptions, categories, clean URLs, and keyword arrays.
2. **`build-search-engine.js`**: The compilation engine that reads `tools-index.json`, injects regional flag icons (`getToolIcon`), embeds typo-tolerant Damerau-Levenshtein distance matching, intent synonyms, and produces `search-engine.js`.
3. **`search-engine.js`**: The high-performance client-side script loaded by `nav.js` on every single page to power header search inputs, hero search boxes, the directory search filter, and the `Ctrl+K` / `Cmd+K` keyboard shortcut modal.

---

## 🚫 2. The Core Problem: Why New Tools Disappear from Search

If an agent creates `my-new-tool.html` and links it in `index.html` and `widgets.html`, but **fails to add it to `tools-index.json` and run `node build-search-engine.js`**:
- The tool exists as an isolated page.
- Visitors searching via the global search bar or `Ctrl+K` cannot find it.
- Autocomplete fails to suggest it.
- The platform breaks user discovery trust.

**Rule**: A tool is **NOT COMPLETE** until it is searchable via `search-engine.js`.

---

## 📋 3. Mandatory 3-Step Search System Integration Workflow

Whenever any new tool is created or modified:

### Step 3.1: Add Entry to `tools-index.json`
Insert the tool into `tools-index.json` in **alphabetical order by `slug`**:

```json
  {
    "slug": "liberia-waec-grade-calculator",
    "name": "Liberia WAEC Grade Calculator (WASSCE Division & 9-Point Scale)",
    "shortName": "Liberia WAEC Grade Calculator",
    "description": "Calculate official WAEC Liberia WASSCE letter grades (A1 to F9), Best 6 aggregate points with compulsory English & Math, credit count, and Division 1, 2, or 3 standing.",
    "category": "Education",
    "url": "/liberia-waec-grade-calculator",
    "keywords": [
      "liberia waec grade calculator",
      "liberia",
      "waec",
      "wassce",
      "grade",
      "calculator",
      "points",
      "aggregate",
      "best 6",
      "division 1",
      "division 2",
      "division 3",
      "credit pass",
      "english",
      "mathematics",
      "mohe",
      "monrovia",
      "senior high school",
      "lshsce",
      "university of liberia",
      "waec liberia",
      "wassce liberia"
    ]
  }
```

#### Required Fields in `tools-index.json`:
- **`slug`**: Exact clean filename without `.html` (e.g. `liberia-waec-grade-calculator`).
- **`name`**: Full official display title including scale/subsystem in parentheses.
- **`shortName`**: Crisp 3–5 word title for mobile dropdown cards.
- **`description`**: 120–160 character description detailing inputs, formulas, and outcomes.
- **`category`**: Capitalized canonical category (`Education`, `Finance`, `Health`, `Productivity`, `Business`, or `Everyday`).
- **`url`**: Root-relative clean extensionless URL (e.g. `/liberia-waec-grade-calculator`).
- **`keywords`**: Minimum of 15–25 comprehensive search terms:
  - Tool full title and exact slug words.
  - Country name (e.g., `liberia`, `liberian`).
  - Governing body / examination board acronyms (e.g., `waec`, `wassce`, `mohe`, `nche`).
  - Major tertiary institutions (e.g., `university of liberia`, `cuttington`).
  - Capital city or primary region (e.g., `monrovia`).
  - Core mathematical or grading terms (e.g., `best 6`, `aggregate`, `credit pass`, `division 1`).

---

### Step 3.2: Verify Country Flag Mapping in `build-search-engine.js`
In `build-search-engine.js`, verify that the tool's regional flag or icon is mapped inside `getToolIcon(tool)`:

```javascript
  // Regional Flag Mapping in build-search-engine.js
  function getToolIcon(tool) {
    const s = (tool.slug + ' ' + (tool.keywords || []).join(' ')).toLowerCase();
    if (s.includes('liberia') || s.includes('monrovia') || s.includes('cuttington')) return '🇱🇷';
    if (s.includes('malawi') || s.includes('maneb') || s.includes('msce')) return '🇲🇼';
    if (s.includes('namibia') || s.includes('nssc') || s.includes('unam')) return '🇳🇦';
    if (s.includes('botswana') || s.includes('bgcse') || s.includes('biust')) return '🇧🇼';
    if (s.includes('new zealand') || s.includes('ncea') || s.includes('nzqa')) return '🇳🇿';
    if (s.includes('germany') || s.includes('abitur') || s.includes('bavarian')) return '🇩🇪';
    if (s.includes('norway') || s.includes('lanekassen')) return '🇳🇴';
    if (s.includes('switzerland') || s.includes('swiss')) return '🇨🇭';
    if (s.includes('kenya') || s.includes('knec') || s.includes('kcse')) return '🇰🇪';
    if (s.includes('nigeria') || s.includes('jamb') || s.includes('waec')) return '🇳🇬';
    if (s.includes('ghana') || s.includes('wassce')) return '🇬🇭';
    if (s.includes('south africa') || s.includes('matric') || s.includes('aps')) return '🇿🇦';
    ...
  }
```

> **CRITICAL ORDERING RULE**: Specific national keywords (e.g. `liberia`) MUST be checked **before** shared regional exam boards (e.g. `waec` or `wassce`), to prevent Liberia WAEC tools from falsely rendering a Nigerian or Ghanaian flag.

---

### Step 3.3: Recompile the Search Engine
Always run the search build script immediately after modifying `tools-index.json`:

```bash
node build-search-engine.js
```

Or run the full production build pipeline:
```bash
npm run build
```

This compiles the minified database into `search-engine.js`, making the tool available across all pages instantaneously.

---

## 🧪 4. Automated Search Audit & Parity Verification Script

Run this command before submitting or completing any task to guarantee 100% search indexing parity:

```bash
node -e '
const fs = require("fs");
const index = JSON.parse(fs.readFileSync("tools-index.json", "utf8"));
const indexedSlugs = new Set(index.map(t => t.slug));
const ignoredFiles = new Set([
  "index.html", "education.html", "finance.html", "health.html", 
  "productivity.html", "widgets.html", "about.html", "contact.html", 
  "privacy-policy.html", "terms.html", "cookie-policy.html", 
  "adsense-disclaimer.html", "404.html", "success-stories.html", 
  "admissions.html", "faq.html"
]);
const htmlFiles = fs.readdirSync(".").filter(f => f.endsWith(".html") && !ignoredFiles.has(f));
const missing = htmlFiles.map(f => f.replace(".html", "")).filter(slug => !indexedSlugs.has(slug));

if (missing.length > 0) {
  console.error("❌ CRITICAL FAILURE: The following tools are missing from tools-index.json:");
  missing.forEach(slug => console.error("   - " + slug));
  process.exit(1);
} else {
  console.log("✅ SUCCESS: 100% Parity! All " + htmlFiles.length + " tool HTML pages are indexed in tools-index.json.");
}
'
```

If this script prints any missing slugs, add them to `tools-index.json` and re-run `node build-search-engine.js`.

---

## 🏆 5. Complete 9-Point Ecosystem Integration Checklist

Every new tool must be integrated across all 9 discovery endpoints:

1. **Homepage (`index.html`)**: Category section card with `data-search`, flag, description, and link.
2. **Category Hub (`education.html`, `finance.html`, etc.)**: `.category-tool-grid` entry.
3. **All Tools Directory (`widgets.html`)**: Directory card with tags.
4. **Global Footer (`footer.js`)**: Linked in category column.
5. **XML Sitemap (`sitemap.xml`)**: Clean URL with `priority 0.9`.
6. **LLM Documentation (`llms.txt`)**: Documented with markdown link.
7. **Universal AI Assistant (`universal-ai.js`)**: Configured in `TOOL_CONFIGS`.
8. **Share Results System (`share-results.js`)**: Registered in `TOOL_ADAPTERS`.
9. **🔍 Search System (`tools-index.json` & `build-search-engine.js`)**: Added to canonical JSON index and compiled to `search-engine.js`.
