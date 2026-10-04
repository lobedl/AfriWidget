# Academic Progress Engine — Integration Guide & Standards

This document explains the architecture, data structures, UI components, and exact step-by-step procedures for implementing the **Academic Progress Engine** (`academic-progress.js`) on any educational tool or calculator across AfriWidget.

---

## 1. Overview & Architecture

The Academic Progress Engine provides private, client-side academic attempt tracking, delta trend analysis, strength/weakness discovery, and an interactive pure SVG radar chart for student evaluation tools.

### Core Architecture Principles
- **100% Client-Side Privacy**: Data is stored exclusively in `window.localStorage` under `afriwidget_academic_progress_<toolId>`. Zero accounts, zero server calls, zero database storage.
- **Zero Friction / Automatic Recording**: The student never has to click "Save". Every calculation automatically records progress in the background with a 30-second deduplication guard.
- **Zero Framework / Zero Tailwind CSS**: Scoped, inline-injected CSS adhering strictly to the AfriWidget brand design system (`#000000`, `#facc15`, `#ca8a04`, `#fde047`, `#fef3c7`, slate grays).
- **Responsive & Accessible**: Uses semantic HTML5 `<section>`, ARIA dialog roles, accessible SVG titles, and responsive layouts (single-column mobile, two-column desktop).

---

## 2. Core Components Rendered

When loaded and triggered on an educational tool, the engine injects `<section id="afriAcademicProgress" class="afri-academic-progress">` into `#results` (directly below `.results-head` or before `.ai-section` / `#afriShareBar`).

```
┌────────────────────────────────────────────────────────────────────────┐
│ 🎓 Academic Progress          [View History (3)]                       │
│    Private in-browser history and latest subject performance           │
├──────────────────────────────────┬─────────────────────────────────────┤
│ 🕸️ SUBJECT PERFORMANCE RADAR    │ 📊 PROGRESS SUMMARY                 │
│                                  │ [ Latest Result ] [ Previous Result]│
│   Pure SVG Radar Web (≥3 subs)   │                                     │
│   - Concentric webs (33/66/100%) │ ▲ 2.00 pts improvement trend        │
│   - Golden data polygon          ├─────────────────────────────────────┤
│   - Subject vertex labels        │ ⭐ Strongest Subject: Mathematics   │
│                                  │ 🎯 Focus Area: Physics              │
└──────────────────────────────────┴─────────────────────────────────────┘
```

### 1. Subject Performance Radar Chart
- Generated purely in SVG (`generateRadarSvg(subjects)`).
- Requires at least 3 subjects. If fewer than 3 subjects exist, displays a helpful fallback notice.
- Concentric polygon webs at 33%, 66%, and 100% radii.
- Radial spoke lines radiating from center `(cx: 170, cy: 155, r: 82)`.
- Filled data polygon: `fill="rgba(250, 204, 21, 0.42)"` with stroke `#ca8a04`.
- Subject markers (black dot with `#facc15` rim) and perimeter text with grade tags.

### 2. Progress Summary & Trend Banner
- **Latest Result**: Displays `current.displayValue` and date.
- **Previous Result**: Displays `prev.displayValue` or "No earlier entry".
- **Trend Banner**: Automatically compares current attempt against the immediate previous attempt:
  - Respects `higherIsBetter`:
    - When `true` (GPA, APS, ICASS, KCSE, JAMB): positive delta = `improved` (green ▲), negative delta = `declined` (amber ▼).
    - When `false` (WASSCE, BECE aggregates where 6 is better than 24): lower score = `improved` (`prev.value - current.value`).
  - States: `improved`, `declined`, `neutral`, `baseline` (first calculation).

### 3. Subject Highlights Grid
- **Strongest Subject**: Subject with highest `norm` (green card with star icon).
- **Focus Area (Lowest)**: Subject with lowest `norm` (amber card with target icon).

### 4. Interactive History Modal
- Accessible modal dialog (`#afriProgModalOverlay`).
- Lists up to 15 historical calculation attempts in reverse chronological order.
- Each entry displays attempt number, date/time, trend badge, overall score badge, and individual subject chips.
- Includes a "Clear History" button (with user confirmation) and Escape key listener.

---

## 3. How the Engine Works (Lifecycle)

```
Page Load (DOMContentLoaded)
  │
  ├─► getPageSlug() extracts clean slug from window.location.pathname
  │
  ├─► Looks up matching adapter in adapters[slug]
  │     └─► If none found, exits silently.
  │
  ├─► injectStyles() injects scoped CSS into <head>
  │
  ├─► If previous calculations exist in localStorage, renders UI immediately
  │
  └─► Attaches event listeners:
        ├─► form 'submit' (120ms delay)
        ├─► #calcBtn / .btn-primary click (140ms delay)
        └─► MutationObserver on #results (triggers when .visible is added)
              │
              ▼
        recordAndDisplay(adapter)
          ├─ Calls adapter.extract() to parse DOM inputs & outputs
          ├─ Deduplication check (ignores identical values within 30s)
          ├─ Computes delta trend vs previous attempt
          ├─ Computes strongest and weakest subjects
          ├─ Prepends new record to localStorage (max 15 records)
          └─ Injects/Updates the DOM and re-renders the SVG radar chart
```

---

## 4. The Adapter Contract & Schema

Every supported tool is registered in the `adapters` dictionary inside `/academic-progress.js`.

### Adapter Specification
```javascript
'tool-slug-name': {
  // Unique string used as localStorage key prefix: afriwidget_academic_progress_<id>
  id: 'tool-slug-id',

  // Human-readable tool title
  title: 'Sample Grade Calculator',

  // true if higher numbers are better (GPA, %, points); false if lower numbers are better (WASSCE/BECE aggregates)
  higherIsBetter: true,

  // Optional unit string used in trend banner (e.g. 'pts', '%', 'GPA')
  unit: 'pts',

  // Extraction function: reads DOM and returns the standardized data object or null if incomplete
  extract: function () {
    // 1. Read overall score element from results
    var resEl = document.getElementById('overallResultValue');
    var val = resEl ? parseFloat(resEl.textContent.trim()) : NaN;
    if (isNaN(val)) return null;

    // 2. Read individual subject inputs/selects
    var subjects = [
      {
        name: 'Mathematics',           // Subject display name
        grade: 'A',                    // Grade string or percentage
        raw: 85,                       // Raw numeric value
        norm: 0.85,                    // Float between 0.12 and 1.0 (1.0 = best possible)
        display: 'A (85%)'             // Human-readable tag
      }
      // ... more subjects
    ];

    // 3. Return payload
    return {
      value: val,                      // Numeric value for mathematical delta/trend comparison
      displayValue: val + ' Pts',      // Formatted string shown in summary cards
      subjects: subjects               // Array of normalized subjects for radar chart
    };
  }
}
```

### Critical Rule for `norm` (Normalized Score for Radar Chart)
The radar chart and strength engine rely on `norm` having a value between `0.12` and `1.0`:
- **1.0**: Absolute highest possible achievement (e.g. A1, Grade 1, 4.0 GPA, 100%).
- **0.12**: Baseline minimum ring (prevents SVG polygon from collapsing to a single invisible center point `0,0`).
- **Standard Ascending Formula** (Higher is better, e.g. 0 to 100%):
  ```javascript
  norm: Math.max(0.12, score / 100)
  ```
- **GPA 4.0 Scale Formula**:
  ```javascript
  norm: Math.max(0.12, gpaPoints / 4.0)
  ```
- **Descending Aggregate Formula** (Lower is better, e.g. WASSCE/BECE 1 to 9):
  ```javascript
  // 1 is best (norm = 1.0), 9 is worst (norm = 0.12)
  norm: Math.max(0.12, (10 - gradeNum) / 9)
  ```
- **Points Scale Formula** (e.g. KCSE 1 to 12 points):
  ```javascript
  norm: Math.max(0.12, points / 12)
  ```

---

## 5. Step-by-Step Guide: Adding a New Educational Tool

Follow these exact steps when asked to implement academic progress for another educational tool.

### Step 1: Inspect the Target Tool Page
Open the tool's HTML file (e.g. `zimsec-olevel-points-calculator.html` or `matric-sba-exam-calculator.html`):
1. **Find the Results Container**: Confirm `<div id="results" class="results">` exists.
2. **Find the Output Element**: Identify the element where the main calculation is rendered (e.g. `<span id="pointsValue">`, `<div id="gpaBig">`).
3. **Find the Subject Inputs**: Identify the form inputs or select dropdowns where individual subject scores are chosen.

### Step 2: Determine Scoring Logic
- **Is higher better?**
  - Yes (GPA, marks, APS, matric points, KCSE) -> `higherIsBetter: true`
  - No (WASSCE, BECE, Cambridge aggregate where 1 is top) -> `higherIsBetter: false`
- **What is the normalization formula?**
  - Calculate `norm` so top grade = `1.0` and minimum passing/failing grade sits near `0.12`.

### Step 3: Add the Adapter to `/academic-progress.js`
Open `/academic-progress.js` and add a new entry to the `adapters` object matching the HTML page filename (without `.html`):

```javascript
// Example: New adapter for ZIMSEC O-Level Calculator
'zimsec-olevel-points-calculator': {
  id: 'zimsec-olevel-points',
  title: 'ZIMSEC O-Level Points Calculator',
  higherIsBetter: true,
  unit: 'pts',
  extract: function () {
    var resEl = document.getElementById('pointsValue');
    var val = resEl ? parseInt(resEl.textContent.trim(), 10) : NaN;
    if (isNaN(val)) return null;

    var gradePts = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1, 'U': 0 };
    var subjects = [];

    // Loop through subject selects
    for (var i = 1; i <= 6; i++) {
      var sel = document.getElementById('grade' + i);
      var nameInp = document.getElementById('sub' + i);
      var sName = (nameInp && nameInp.value.trim()) || ('Subject ' + i);
      if (sel && sel.value && gradePts[sel.value] !== undefined) {
        var p = gradePts[sel.value];
        subjects.push({
          name: sName,
          grade: sel.value,
          raw: p,
          norm: Math.max(0.12, p / 5), // 5 is max grade points (A)
          display: sel.value + ' (' + p + ' pts)'
        });
      }
    }

    return {
      value: val,
      displayValue: val + ' Points',
      subjects: subjects
    };
  }
},
```

*Note: If the tool has aliases (e.g. `zimsec-olevel-calculator`), add both slug keys pointing to the same extraction logic.*

### Step 4: Include the Script Tag in the Tool HTML
Open the target tool HTML file. Locate the closing `</body>` tag at the bottom and ensure `<script src="/academic-progress.js" defer></script>` is included:

```html
    <script src="/share-results.js" defer></script>
    <script src="/recent-tools.js?v=1" defer></script>
    <script src="/academic-progress.js" defer></script>
    <script src="/favorites.js?v=2" defer></script>
  </body>
</html>
```

### Step 5: Verification & Quality Assurance
1. **Lint Check**: Run `npm run lint` or `node --check academic-progress.js` to ensure zero syntax errors.
2. **Calculation Test**: Enter valid marks and trigger the calculation. Confirm:
   - The `#afriAcademicProgress` card renders smoothly below results.
   - The SVG radar chart renders all subject vertices and labels.
   - The "Latest Result" stat box populates.
   - The trend banner displays "Initial baseline" on the first run, and accurate ▲/▼ delta on subsequent calculations.
   - Strongest and Weakest subject cards show the correct subjects.
3. **History Modal Test**: Click "View History". Verify the attempt list, badge count, close button, and "Clear History" confirmation.

---

## 6. Currently Integrated Tools (Reference List)

| Tool File Slug | Adapter ID | Higher Is Better? | Metric / Unit |
|---|---|---|---|
| `wassce-aggregate-calculator` | `wassce-aggregate` | `false` | Aggregate (Lower is better) |
| `bece-aggregate-calculator` | `bece-aggregate` | `false` | Aggregate (Lower is better) |
| `gpa-calculator` | `gpa-calculator` | `true` | GPA (0.00 – 4.00) |
| `tertiary-gpa-cgpa-calculator` | `tertiary-gpa-cgpa` | `true` | GPA (0.00 – 4.00) |
| `south-african-aps-calculator` | `south-african-aps` | `true` | APS Points |
| `icass-calculator` | `icass-calculator` | `true` | ICASS Percentage (%) |
| `kcse-grade-calculator` | `kcse-grade-calculator` | `true` | Points / Mean Grade |
| `kuccps-cluster-points-calculator` | `kuccps-cluster-points` | `true` | Cluster Points |
| `kcse-kuccps-cluster-calculator` | `kuccps-cluster-points` | `true` | Cluster Points |
| `jamb-utme-aggregate-calculator` | `jamb-utme-aggregate` | `true` | Aggregate Score |
| `jamb-score-calculator` | `jamb-score-calculator` | `true` | JAMB Marks (/400) |
| `waec-grade-calculator` | `waec-grade` | `true` | WAEC Average (%) |
| `nigerian-university-cgpa-calculator` | `nigerian-university-cgpa` | `true` | CGPA (5.0 / 4.0 Scale) |
| `zimsec-olevel-points-calculator` | `zimsec-olevel-points` | `true` | ZIMSEC O-Level Best-5 (pts) |
| `zimsec-alevel-points-calculator` | `zimsec-alevel-points` | `true` | ZIMSEC A-Level Points (pts) |
| `zambia-grade-12-points-calculator` | `zambia-grade-12-points` | `false` | ECZ Best-6 Points (Lower is better) |
| `uce-grade-calculator` | `uce-grade-calculator` | `false` | UCE Best-8 Aggregate (Lower is better) |
| `uace-points-calculator` | `uace-points-calculator` | `true` | UACE Principal + Sub Points (/20) |
| `matric-sba-exam-calculator` | `matric-sba-exam` | `true` | South Africa Matric APS Points |
| `acsee-points-calculator` | `acsee-points-calculator` | `true` | Tanzania ACSEE TCU Points |
| `ghana-university-gpa-calculator` | `ghana-university-gpa` | `true` | Ghana Tertiary GPA / CWA |

---

## 7. Troubleshooting & Common Pitfalls

1. **Radar Chart Shows Message "Add 3 or more subjects..."**:
   - The radar polygon requires at least 3 vertices to form a 2D web. If the user only selected 1 or 2 subjects, this message is expected. Ensure default forms have 3+ filled subjects in sample mode.
2. **Trend Banner Shows "Decline" When Score Increased**:
   - Check `higherIsBetter`. If the tool uses an aggregate system (like WASSCE where aggregate 6 is first class and 24 is poor), `higherIsBetter` MUST be `false`.
3. **Duplicate Calculations Stored on Every Click**:
   - The engine automatically includes a deduplication guard (checks if timestamp < 30s and values are identical). Do not remove or bypass `isDuplicate`.
4. **Adapter Fails to Extract Value**:
   - Confirm the element ID queried in `adapter.extract()` matches the exact DOM ID in the HTML file. Educational tools often calculate asynchronously or inside `setTimeout`; the engine's built-in observer and delays accommodate this.
