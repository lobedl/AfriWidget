# MANDATORY_EDUCATIONAL_CONTENT_AND_WORD_COUNT_STANDARDS.md - AfriWidget Educational Depth Mandate

This document defines the strict, zero-exception standards for educational guide content, word counts, worked student scenarios, and FAQ architecture required for every new or existing tool on the **AfriWidget** platform.

---

## 📜 1. Core Mandate: Minimum 800+ Words of Unique Educational Content

Every tool, calculator, planner, and converter page created on AfriWidget **MUST** contain at least **800+ words of high-quality, unique, authoritative educational text** (typically 1,000–1,500+ words).

### Strict Requirements Checklist:
1. **Minimum Word Count**: At least **800 words** of substantive educational guide text per tool page.
2. **Mandatory 4-Pillar Content Coverage**:
   - **How to Use the Tool**: Step-by-step user interaction guide explaining inputs, options, dropdown selections, parameter meanings, and action triggers.
   - **How the Calculation / Evaluation Works**: Comprehensive mathematical formulas, statutory scoring matrices, official grading tables, policy regulations, and institutional thresholds. (No LaTeX syntax — use plain text symbols like `×`, `÷`, `+`, `-`, `=`).
   - **Step-by-Step Worked Examples**: Real-world realistic student/user profiles and concrete numerical scenarios detailing input scores, calculation steps, and final outcomes.
   - **Frequently Asked Questions (FAQ)**: Distinct, insightful questions answering specific user edge cases, statutory exceptions, and policy nuances.
3. **100% Unique Content (Zero-Duplication Policy)**:
   - All worked examples, student scenarios, calculation numbers, and FAQ questions/answers **MUST BE 100% UNIQUE to that specific tool page**.
   - **STRICT PROHIBITION**: Never copy-paste, clone, or reuse generic worked examples or FAQ items from other tools. Every tool must reflect its own distinct subject matter, country regulations, and institutional policies.
4. **Markdown File in `content/`**:
   - Every tool **MUST** have a corresponding `.md` file in the `/content` directory (e.g., `content/[tool-slug].md`).
   - When `npm run build` runs, `build-prerender.js` automatically renders this markdown into styled HTML with interactive FAQ accordions and injects it into `<article class="...">` in the tool's HTML file.

---

## 🏗️ 2. Canonical Content Structure & Markdown Template

Every tool's markdown guide file (`content/[tool-slug].md`) must strictly adhere to the following architecture:

```markdown
# [Tool Name] ([Official Subtitle / Institutional Scope])

[Opening paragraph: 2-3 sentences summarizing the purpose, governing bodies, regulatory standards, and real-world utility of the tool for students, professionals, or users.]

---

## How to Use the [Tool Name]

[Introductory paragraph explaining the user flow and prerequisites.]

### Step 1: [First Action / Input Parameter Selection]
- [Detailed explanation of dropdowns, course levels, or input fields.]
- [Guidance on mandatory inputs and configuration options.]

### Step 2: [Second Action / Grade or Metric Entry]
- [Details on entry scales, letter grades, percentage inputs, or currency values.]
- [Dynamic row addition guidance if applicable.]

### Step 3: [Execute Calculation and Review Results]
- [Instruction to click the dedicated action button.]
- [Breakdown of each result metric, status banner, breakdown chart, and export option.]

---

## How the [Concept / Examination / Metric] Calculation Works

[Deep theoretical and mathematical explanation of the scoring engine or institutional methodology.]

### 1. [Official Conversion Scale or Matrix]
- **[Rating Level / Grade 1]**: **[Points / Score]** ([Description / Percentage Range])
- **[Rating Level / Grade 2]**: **[Points / Score]** ([Description / Percentage Range])
- **[Rating Level / Grade 3]**: **[Points / Score]** ([Description / Percentage Range])

### 2. The Mathematical Formula
- **[Primary Metric Name]** = [Plain text mathematical formula with ×, ÷, +, -]
- [Step-by-step description of variables, weighting factors, and subminimum criteria.]

### 3. [Statutory Thresholds, Funding Policies, or Faculty Benchmarks]
- [Clear list of statutory benchmarks from official governing bodies.]

---

## Step-by-Step Worked Student Examples

### Example 1: [Specific Realistic Student / User Profile]
- **Profile & Background**: [Target program, institution, or financial situation.]
- **Input Parameters & Subject Scores**:
  - [Subject/Parameter 1]: **[Score/Grade]** ([Points])
  - [Subject/Parameter 2]: **[Score/Grade]** ([Points])
  - [Subject/Parameter 3]: **[Score/Grade]** ([Points])
- **Step-by-Step Calculation**:
  - [Step 1 Math]: [Calculation breakdown]
  - [Step 2 Math]: [Calculation breakdown]
  - **Final Aggregate / Metric**: **[Final Score]**
- **Outcome & Eligibility Verdict**: [Admission standing, funding clearance, or financial forecast.]

### Example 2: [Alternative Distinct Scenario / Edge Case Profile]
- [Distinct profile with different curriculum combinations, boundary marks, or special circumstances.]

### Example 3: [Third Realistic User Profile / Alternative Pathway]
- [Distinct profile illustrating foundation, bridging, or unique status.]

---

## Frequently Asked Questions (FAQ)

### [Unique Specific Question 1]?
[Comprehensive 3-5 sentence answer specific to this tool's domain.]

### [Unique Specific Question 2]?
[Comprehensive 3-5 sentence answer specific to this tool's domain.]

### [Unique Specific Question 3]?
[Comprehensive 3-5 sentence answer specific to this tool's domain.]

### [Unique Specific Question 4]?
[Comprehensive 3-5 sentence answer specific to this tool's domain.]

### [Unique Specific Question 5]?
[Comprehensive 3-5 sentence answer specific to this tool's domain.]

### [Unique Specific Question 6]?
[Comprehensive 3-5 sentence answer specific to this tool's domain.]

---

## Authoritative References & Official Sources

- **[Governing Body / University 1]**: [URL] — [Description of official syllabus, yearbook, or regulation.]
- **[Governing Body / University 2]**: [URL] — [Description of statutory requirements or funding rules.]
```

---

## 🚫 3. Prohibited Patterns in Educational Guides

1. **NO Low-Word-Count Stubs**: Any tool with under 800 words of educational content fails quality audits.
2. **NO Markdown Tables**: Never use `| ... |` table syntax. Always use structured specification lists and bold variable formatting.
3. **NO LaTeX Syntax**: Under NO circumstances use LaTeX delimiters (`$...$`, `\frac`, `\text`). Use plain text mathematical operators (`×`, `÷`, `+`, `-`, `=`).
4. **NO Reused Examples or FAQs**: Every example must feature unique candidate names, distinct subject combinations, and realistic numbers tailored specifically to that tool.
5. **NO Placeholder Text**: Never use placeholder text like "Lorem ipsum", "Coming soon", or generic filler phrases.

---

## 🤖 4. Build Pipeline Integration

- Create the markdown file at `/content/[tool-slug].md`.
- Ensure the tool's HTML file contains `<article class="mt-12 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 space-y-8 text-slate-700 leading-relaxed">`.
- Run `npm run build` to execute `build-prerender.js`, which parses markdown, formats accordion FAQ widgets, and prerenders the content into the HTML page.
