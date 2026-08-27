# CONTENT_FORMATTING_AND_FAQ_STANDARDS.md - AfriWidget Content Architecture & FAQ Rules

This document establishes the mandatory content formatting, typography, structure, and FAQ styling standards for all `.md` guide files and HTML pages across the **AfriWidget** platform.

---

## 🚫 1. Strict Zero-Exception Prohibition of Markdown Tables & ASCII Grids

Under NO circumstances should raw markdown tables (using `| column | column |` and `| :--- | :--- |`) or ASCII box art grids (`+---+---+`) be used in `.md` content files, guide sections, or tool explanations.

### Why Tables are Prohibited:
1. **Broken Mobile UX**: Traditional markdown tables do not wrap gracefully on mobile viewports (< 400px), causing horizontal overflow, cut-off text, or microscopic unreadable columns.
2. **Parser Fragility**: Minimalist or custom markdown renderers (e.g. `renderMarkdown` in `build-prerender.js`) collapse raw table pipes into unformatted paragraph blocks, exposing ugly raw `|` and `---` code to users.
3. **Cognitive Load**: Dense tabular grids increase reading friction for students and mobile visitors compared to clean, rhythmic bulleted specification cards.

---

## ✨ 2. Canonical Replacement Structures

All data comparisons, grade scales, fee breakdowns, and worked examples must use one of the following mobile-optimized, high-contrast structural patterns:

### 2.1 Structured Specification Lists
For scales, rating levels, and parameter lists:
```markdown
## Official South African National Senior Certificate (NSC) 7-Point Rating Scale

- **Level 7 (80% – 100%)**: **7 Points** (Outstanding Achievement / Distinction)
- **Level 6 (70% – 79%)**: **6 Points** (Meritorious Achievement)
- **Level 5 (60% – 69%)**: **5 Points** (Substantial Achievement)
- **Level 4 (50% – 59%)**: **4 Points** (Moderate Achievement — Degree Benchmark)
- **Level 3 (40% – 49%)**: **3 Points** (Adequate Achievement — Diploma Benchmark)
- **Level 2 (30% – 39%)**: **2 Points** (Elementary Achievement — Higher Certificate Benchmark)
- **Level 1 (0% – 29%)**: **1 Point** or 0 points (Not Achieved / Fail)
```

### 2.2 Hierarchical Definition Cards
For multi-attribute tiers (e.g., funding brackets, qualification criteria):
```markdown
- **1. SASSA Beneficiary Fast-Track (Automatic Approval)**:
  - **Income Standard**: Automatic financial clearance with no proof of income required.
  - **Coverage**: 100% Free Government Bursary with zero repayment obligation.
  - **Verification**: Instant real-time database matching with DSD and Home Affairs.

- **2. General Public Undergraduate Bursary (Income <= R350,000 / year)**:
  - **Income Standard**: Combined gross annual household income up to R350,000.
  - **Coverage**: 100% Full Bursary covering tuition, accommodation, and living allowances.
```

### 2.3 Step-by-Step Worked Calculation Examples
For worked examples and student profiles:
```markdown
### Example 1: BCom Accounting Applicant (University of Pretoria)
A matriculant achieves the following examination marks:

- **Matric Subject Breakdown**:
  - English Home Language: **74%** (Level 6 = 6 points)
  - Mathematics: **82%** (Level 7 = 7 points)
  - Accounting: **85%** (Level 7 = 7 points)
  - Economics: **71%** (Level 6 = 6 points)
  - Business Studies: **66%** (Level 5 = 5 points)
  - Afrikaans First Additional: **68%** (Level 5 = 5 points)
  - Life Orientation: **78%** (Level 6 = 6 points — Excluded from 6-subject UP total)
- **Score & Eligibility Audit**:
  - Total APS: **36 Points (out of 42)**
  - Statutory Pass Level: **Bachelor’s Degree Pass**
- **Admission Verdict**:
  - **Direct Admission**: The candidate exceeds the minimum UP BCom Accounting threshold (APS 34 with Maths Level 6).
```

---

## ❓ 3. Professional FAQ Standards & Parsing Architecture

### 3.1 Standard Markdown Syntax
Every FAQ section must strictly adhere to this exact heading structure:
```markdown
## Frequently Asked Questions (FAQ)

### What is the difference between an APS of 42 and an APS of 49?
The standard 42-point APS scale sums your top six 20-credit subjects (each scored from 1 to 7 points), excluding Life Orientation. The 49-point APS scale includes Life Orientation as a seventh subject.

### Can Mathematical Literacy be used for Engineering or Medicine?
No. All South African medical schools (MBChB) and engineering faculties (BEng / BSc Eng) legally require Pure Mathematics and Physical Sciences at Level 5, 6, or 7.
```

### 3.2 Automated Prerendering to HTML
The build script (`build-prerender.js`) identifies `## Frequently Asked Questions (FAQ)` and automatically converts all nested `### [Question]` headings into semantic, interactive accordion tags:
```html
<h2>Frequently Asked Questions (FAQ)</h2>
<details>
  <summary>What is the difference between an APS of 42 and an APS of 49?</summary>
  <div>
    <p>The standard 42-point APS scale sums your top six 20-credit subjects...</p>
  </div>
</details>
```

### 3.3 Accordion UI Styling Specifications
1. **Container (`details`)**: Clean white card, `1px solid #e2e8f0` border, `0.875rem` rounded radius, subtle drop shadow (`box-shadow: 0 1px 3px rgba(15,23,42,0.04)`), smooth transition.
2. **Question Header (`summary`)**: Slate-50 background (`#f8fafc`), dark navy bold font (`#0f172a`, `font-weight: 700`), custom CSS animated chevron (`border-right` + `border-bottom` rotated `45deg` to `-135deg` on open).
3. **Open State (`details[open]`)**: Warm amber border accent (`border-color: #facc15`), warm header background (`background: #fffbeb`), rich text color (`#78350f`).
4. **Answer Body (`details div`)**: Clean white background, slate-700 body text (`#334155`), line height `1.7`, generous padding (`1.2rem 1.35rem`).

---

## 🛠️ 4. Build & Prerender Verification

Whenever editing `.md` content files:
1. Run `node build-prerender.js` to compile markdown into pre-rendered static HTML.
2. Run `npm run build` to compile minified CSS stylesheets.
3. Verify that all headings, lists, worked examples, and FAQ accordions render with zero unformatted raw symbols.
