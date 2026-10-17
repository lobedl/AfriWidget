# "Find My Weaknesses" Diagnostic Engine — Implementation & Integration Guide

This guide documents the architecture, data schemas, visual design system, and step-by-step procedures for implementing the **"Find My Weaknesses"** diagnostic and targeted practice feature across educational tools and calculators on AfriWidget.

Any AI agent or software engineer implementing this feature for another educational tool must follow this document to ensure strict consistency, deterministic marking, 100% client-side privacy, brand alignment, and zero disruption to existing tools.

---

## 1. Core Principles & Guardrails

1. **Zero External Dependencies / Pure Vanilla JS**:
   - Write standard, clean HTML5, CSS3, and ES5/ES6 Vanilla JavaScript.
   - **Never** use React, Next.js, Vue, Tailwind compilation pipelines, or external quiz libraries.
   - **Never** use emojis in code, UI copy, badges, or buttons (use SVG icons or clean semantic typography).
2. **AfriWidget Brand Design System**:
   - **Primary Palette**: Solid pitch black (`#000000`), AfriWidget golden yellow (`#facc15` / `#eab308` / `#ca8a04`), and pure white (`#ffffff`).
   - **Background Mandate**: The diagnostic callout bar and score cards must use **solid pitch black (`#000000`)**, with neutral dark borders (`#262626` or `#333333`). **Never** use slate or deep sea blue hues (`#111827`, `#0f172a`, `#1e293b`).
   - **Text Contrast**: White text (`#ffffff`) or subdued light gray (`#9ca3af` / `#d1d5db`) on dark backgrounds; pitch black text (`#000000`) or charcoal (`#1f2937`) on light backgrounds.
3. **100% Client-Side Privacy (Local-Only Storage)**:
   - All diagnostic runs, scores, weak topics, and attempt timestamps are saved directly in `window.localStorage`.
   - Key format: `afriwidget_<tool_slug>_weakness_history` (e.g., `afriwidget_icass_weakness_history`).
   - Zero user registration, zero cookies, zero analytics beacons, zero backend database overhead.
4. **Preserve Existing Tool Architecture**:
   - The existing calculator must remain 100% functional, responsive, and untouched in core logic.
   - Do not replace, wrap, or break the calculator form or result calculations.
   - Inject the diagnostic engine non-intrusively via an external script (e.g., `<script src="/<tool>-weakness.js" defer></script>`) and complementary scoped CSS.
5. **Domain-Specific, Deterministic Question Banks**:
   - Questions must be 100% relevant to the specific subject, curriculum, or grading standard of the target tool (e.g., WAEC, KNEC, DHET, UNEB, Zimsec, Cambridge, NCEA).
   - Never generate generic high-school math problems unless the tool specifically calculates high-school math.
   - Every question must have an unequivocal single correct answer, verified answer index, and a thorough, educational explanation citing official syllabus policies, formulas, or standards.

---

## 2. Feature Workflow & UI States

The "Find My Weaknesses" feature consists of 4 views and 2 entry points:

```
[ ENTRY POINT 1: Button in Tool Action Row ]      [ ENTRY POINT 2: Solid Black Banner in Results Section ]
                      │                                                   │
                      └─────────────────────────┬─────────────────────────┘
                                                ▼
                         ┌──────────────────────────────────────────────┐
                         │ VIEW 1: Diagnostic Intro & Topic Selection   │
                         │ - Context badge (detects tool inputs/marks)  │
                         │ - Curriculum topic selector (if ambiguous)   │
                         │ - Previous attempt preview & history count   │
                         │ - [ Start 10-Question Diagnostic ] button    │
                         └──────────────────────┬───────────────────────┘
                                                ▼
                         ┌──────────────────────────────────────────────┐
                         │ VIEW 2: Active 10-Question Assessment        │
                         │ - Progress bar (10% to 100%) & Question counter│
                         │ - Topic indicator badge                      │
                         │ - Question stem and 4 distinct options       │
                         │ - [ Previous ] and [ Next / Submit ] buttons │
                         └──────────────────────┬───────────────────────┘
                                                ▼
                         ┌──────────────────────────────────────────────┐
                         │ VIEW 3: Diagnostic Report & Evaluation       │
                         │ - Big percentage score & readiness headline  │
                         │ - Longitudinal Delta Box (vs Previous Test)  │
                         │ - Strongest Topics (≥75% accuracy)           │
                         │ - Identified Weaknesses (<75% accuracy)      │
                         │ - Step-by-Step Question Review & Explanations│
                         │ - [ Practise My Weaknesses ] action button   │
                         │ - [ Retake Full Assessment ] action button   │
                         └──────────────────────┬───────────────────────┘
                                                │
                 When user clicks "Practise My Weaknesses"
                                                ▼
                         ┌──────────────────────────────────────────────┐
                         │ VIEW 4: Targeted Weakness Practice Session   │
                         │ - Generates fresh questions targeting ONLY   │
                         │   the identified weak topic IDs / mistakes   │
                         │ - Evaluates and updates longitudinal history │
                         └──────────────────────────────────────────────┘
```

---

## 3. Data Schema & Specifications

### 3.1 Topic Taxonomy Definition
Each tool must define 4 to 6 distinct syllabus or functional topics:

```javascript
var TOPICS = {
  topic_key_1: {
    id: 'topic_key_1',
    name: 'Full Official Topic Name (e.g., DHET 40% Sub-minimum & Exam Rules)',
    shortName: 'Sub-minimum Rules'
  },
  topic_key_2: {
    id: 'topic_key_2',
    name: 'Full Official Topic Name (e.g., Weighting & External Exam Formulas)',
    shortName: 'Weighting Formulas'
  }
  // ... 4-6 topics total
};
```

### 3.2 Question Object Schema
The question bank must contain at least **25 to 30 verified questions** (5 to 6 questions per topic) to allow robust variation between initial diagnostics and practice sessions.

```typescript
interface DiagnosticQuestion {
  id: string;               // Unique ID, e.g. 'q1', 'q2'
  topicId: string;          // Must match a key in TOPICS
  question: string;         // Plain-text question stem (no emojis, no broken LaTeX)
  options: string[];        // Array of 4 plain-text options
  correctIndex: number;     // Zero-based index of correct answer (0, 1, 2, or 3)
  explanation: string;      // Detailed rationale explaining WHY the answer is correct
                            // and citing official grading rules or formula steps
}
```

### 3.3 Assessment History Record Schema
Stored as a JSON array under `localStorage.getItem('afriwidget_<tool>_weakness_history')`:

```typescript
interface AttemptRecord {
  id: string;               // e.g. 'att_1728562300000'
  timestamp: number;        // Epoch milliseconds
  dateFormatted: string;    // Human-readable date string, e.g. '10 Oct 2026, 14:30'
  score: number;            // Number of correct answers (e.g., 7)
  total: number;            // Total questions answered (e.g., 10)
  percentage: number;       // Score in % (e.g., 70)
  mode: 'full' | 'practice';// Mode indicator
  focusTopic: string;       // 'all' or specific topicId
  weakTopicNames: string[]; // List of short names for topics scoring < 75%
  delta: number | null;     // Improvement delta vs previous attempt (+10, -5, null)
}
```

---

## 4. Step-by-Step Implementation Guide for Agents

### Step 1: Inspect the Target Educational Tool
Before writing any code, examine the target tool:
1. Identify the tool's form ID, input fields, and calculation results container (usually `#results` or `.results-container`).
2. Identify the educational jurisdiction and curriculum (e.g., South Africa TVET/CAPS, Nigeria WAEC/JAMB, Kenya KCSE/KUCCPS, Uganda UNEB/UCE, UK GCSE/A-Levels).
3. Find where the primary action buttons live (usually `.btn-row` inside the main form).

### Step 2: Formulate the Curated Question Bank
1. Define 4 to 6 core curriculum topics.
2. Author 25–30 rigorous, deterministic multiple-choice questions.
3. Verify that all 4 choices are distinct, free of typos, and that the `correctIndex` matches the factual correct answer.
4. Write 2–4 sentences per explanation citing exact syllabus rules, conversion formulas, or calculation steps.

### Step 3: Extract Context from Tool Inputs
If the student has already entered marks or selected dropdowns in the tool, read those values:
- Detect if any input mark is below a critical pass mark or grade threshold.
- If marks are entered, display a dynamic context badge in the diagnostic intro (e.g., *"Detected Score: 38% — Prioritizing minimum pass rule diagnostic"*).
- If no inputs have been provided, provide a topic selector dropdown so the student can choose a specific area or select "All Topics".

### Step 4: Add the Two Entry Points
1. **Calculator Button Row**:
   Append a secondary button `.btn-find-weakness` to `#<formId> .btn-row`:
   ```html
   <button type="button" id="findWeaknessesBtn" class="btn-secondary btn-find-weakness">
     <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
     </svg>
     <span>Find My Weaknesses</span>
   </button>
   ```
2. **Results Callout Banner**:
   Append a solid pitch-black banner `.weakness-banner-card` inside the tool's `#results` container:
   ```html
   <div class="weakness-banner-card">
     <div class="w-banner-content">
       <div class="w-banner-badge">Knowledge &amp; Exam Diagnostic</div>
       <h3 class="w-banner-title">Diagnose Your Knowledge Gaps Before the Exam</h3>
       <p class="w-banner-desc">Take a personalized 10-question assessment based on your syllabus standards. Pinpoint weaknesses, review step-by-step explanations, and run targeted practice sets.</p>
     </div>
     <button type="button" id="launchWeaknessFromResults" class="btn-primary w-banner-btn">
       <span>Find My Weaknesses</span>
       <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
       </svg>
     </button>
   </div>
   ```

### Step 5: Implement Assessment Logic
1. **Question Selection**:
   - For a full diagnostic: Select 2 questions evenly from each topic (10 questions total). Shuffle the order.
   - For practice mode: Filter the question bank to only include questions matching `targetWeaknessTopicIds`.
2. **Deterministic Evaluation**:
   - Count correct answers out of 10.
   - Calculate percentage: `Math.round((correctCount / total) * 100)`.
   - Calculate accuracy per topic:
     - Topics with **≥ 75%** accuracy = **Strongest Topics**.
     - Topics with **< 75%** accuracy = **Weaknesses**.
3. **Longitudinal Comparison**:
   - Retrieve previous attempt from `localStorage`.
   - Calculate score delta: `current.percentage - lastAttempt.percentage`.
   - Display a delta badge:
     - If delta > 0: `+X% Improvement` (Green banner).
     - If delta < 0: `-X% Drop` (Amber warning banner).
     - If delta === 0: `Score Maintained` (Neutral gray banner).
     - If first attempt: `Baseline Established` notice.
4. **Targeted Practice Generator**:
   - When the user clicks **"Practise My Weaknesses"**, store the list of weak topic IDs.
   - Immediately launch a new 10-question quiz pulling questions specifically from those weak topics.
   - When completed, recalculate performance and update the comparison trend.

---

## 5. CSS Stylesheet & Branding Specification

Add the following CSS to the tool's `<style>` block in `<tool-name>.html` (or in a dedicated stylesheet). 

> **CRITICAL STYLING RULE**: The `.weakness-banner-card` **must have** `background: #000000;` and border `border: 1px solid #262626;`. Never use blue or slate shades.

```css
/* ==========================================================
   AFRIWIDGET "FIND MY WEAKNESSES" DIAGNOSTIC COMPONENT
   ========================================================== */
.btn-find-weakness {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #ffffff;
  color: #000000;
  border: 1px solid #000000;
  font-weight: 700;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  padding: 1rem 1.25rem;
  min-height: 52px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-find-weakness:hover {
  background: #000000;
  color: #facc15;
  border-color: #000000;
}
.btn-find-weakness svg {
  color: #ca8a04;
  flex-shrink: 0;
}
.btn-find-weakness:hover svg {
  color: #facc15;
}

/* SIMPLIFIED LITE CTA BANNER (PROFESSIONAL AFRIWIDGET STYLING) */
.weakness-banner-card {
  margin-top: 1.5rem;
  padding: 1.25rem 1.5rem;
  background: #ffffff;
  color: #111827;
  border-radius: 0.875rem;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
@media (min-width: 640px) {
  .weakness-banner-card {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 1.75rem 2rem;
  }
}
.w-banner-content {
  flex: 1;
}
.w-banner-badge {
  display: inline-block;
  background: #facc15;
  color: #000000;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  margin-bottom: 0.5rem;
}
.w-banner-title {
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
  margin: 0 0 0.5rem;
}
.w-banner-desc {
  color: #d1d5db;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}
.w-banner-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #facc15;
  color: #000000;
  font-weight: 700;
  font-size: 0.875rem;
  padding: 0.875rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease;
  min-height: 48px;
}
.w-banner-btn:hover {
  background: #eab308;
}

/* DIAGNOSTIC CONTAINER & MODAL CARD */
.weakness-section {
  margin-top: 2.5rem;
}
.weakness-card {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}
@media (min-width: 640px) {
  .weakness-card {
    padding: 2.25rem;
  }
}

/* HEADINGS & BADGES */
.w-header {
  margin-bottom: 1.5rem;
}
.w-eyebrow {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #ca8a04;
  margin-bottom: 0.375rem;
}
.w-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #000000;
  margin: 0 0 0.5rem;
}
.w-subtitle {
  color: #4b5563;
  font-size: 0.9375rem;
  line-height: 1.5;
  margin: 0;
}

/* PROGRESS BAR */
.w-quiz-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.w-prog-bar-bg {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}
.w-prog-bar-fill {
  height: 100%;
  background: #facc15;
  transition: width 0.25s ease;
}
.w-prog-counter {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #4b5563;
  white-space: nowrap;
}

/* QUIZ OPTIONS */
.w-options-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1.5rem 0;
}
.w-opt-btn {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  text-align: left;
  background: #f9fafb;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.625rem;
  padding: 1rem 1.25rem;
  cursor: pointer;
  font-size: 0.9375rem;
  color: #111827;
  transition: all 0.15s ease;
  width: 100%;
}
.w-opt-btn:hover {
  background: #fefce8;
  border-color: #facc15;
}
.w-opt-btn.selected {
  background: #fef9c3;
  border-color: #ca8a04;
  font-weight: 600;
}
.w-opt-circle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #9ca3af;
  flex-shrink: 0;
  margin-top: 1px;
}
.w-opt-btn.selected .w-opt-circle {
  border-color: #ca8a04;
  background: #ca8a04;
}

/* RESULTS & SCORE HERO */
.w-results-score-wrap {
  background: #000000;
  color: #ffffff;
  padding: 2rem;
  border-radius: 0.875rem;
  text-align: center;
  margin-bottom: 2rem;
}
.w-results-score-num {
  font-size: 3.5rem;
  font-weight: 900;
  color: #facc15;
  line-height: 1;
}
.w-results-fraction {
  font-size: 1rem;
  color: #d1d5db;
  margin-top: 0.5rem;
}
.w-results-headline {
  font-size: 1.25rem;
  font-weight: 700;
  margin-top: 0.75rem;
}

/* COMPARISON / DELTA CARD */
.w-comparison-card {
  padding: 1rem 1.25rem;
  border-radius: 0.625rem;
  margin-bottom: 1.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
}
.w-comparison-card.improved {
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #065f46;
}
.w-comparison-card.declined {
  background: #fffbeb;
  border: 1px solid #fde68a;
  color: #92400e;
}
.w-comparison-card.neutral {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #374151;
}

/* TOPIC GRIDS & BADGES */
.w-topics-split-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}
@media (min-width: 640px) {
  .w-topics-split-grid {
    grid-template-columns: 1fr 1fr;
  }
}
.w-topic-column {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.25rem;
}
.w-topic-badge-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}
.w-topic-badge-row.strong {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #d1fae5;
}
.w-topic-badge-row.weak {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fee2e2;
}

/* STEP-BY-STEP EXPLANATION REVIEW CARDS */
.w-review-item {
  border: 1px solid #e5e7eb;
  border-radius: 0.625rem;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
}
.w-review-item.incorrect {
  border-left: 4px solid #ef4444;
  background: #fffafa;
}
.w-review-item.correct {
  border-left: 4px solid #10b981;
  background: #f9fdfa;
}
.w-review-explanation {
  background: #f3f4f6;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: #1f2937;
  margin-top: 0.5rem;
}

/* TARGETED PRACTICE ACTION BAR */
.w-practice-card {
  background: #000000;
  color: #ffffff;
  padding: 1.5rem;
  border-radius: 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}
@media (min-width: 640px) {
  .w-practice-card {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
.w-practice-btn {
  background: #facc15;
  color: #000000;
  font-weight: 800;
  border: none;
  border-radius: 0.5rem;
  padding: 0.875rem 1.5rem;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease;
}
.w-practice-btn:hover {
  background: #eab308;
}
```

---

## 6. Complete Reusable JavaScript Engine Template

Below is the complete, self-contained template. To deploy on a new tool:
1. Save as `<tool-name>-weakness.js` (e.g. `matric-sba-weakness.js`).
2. Update `CONFIG`, `TOPICS`, and `QUESTION_BANK`.
3. Add `<script src="/<tool-name>-weakness.js" defer></script>` before `</body>` in `<tool-name>.html`.

```javascript
/**
 * AfriWidget "Find My Weaknesses" Diagnostic Engine Template
 * 100% Vanilla JS, zero dependencies, zero tracking, localized storage.
 */
(function () {
  'use strict';

  // 1. TOOL SPECIFIC CONFIGURATION
  var CONFIG = {
    toolSlug: 'example_tool', // Replace with tool slug (e.g. 'matric_sba')
    storageKey: 'afriwidget_example_tool_weakness_history',
    formId: 'calculatorForm', // ID of target calculator form
    btnRowSelector: '#calculatorForm .btn-row',
    resultsId: 'results',
    contextInputs: [
      { id: 'mathScore', label: 'Mathematics Mark' }
      // Add key inputs to extract context
    ]
  };

  // 2. CURRICULUM TOPICS TAXONOMY
  var TOPICS = {
    topic_1: { id: 'topic_1', name: 'Curriculum Topic 1 Full Name', shortName: 'Topic 1' },
    topic_2: { id: 'topic_2', name: 'Curriculum Topic 2 Full Name', shortName: 'Topic 2' },
    topic_3: { id: 'topic_3', name: 'Curriculum Topic 3 Full Name', shortName: 'Topic 3' },
    topic_4: { id: 'topic_4', name: 'Curriculum Topic 4 Full Name', shortName: 'Topic 4' }
  };

  // 3. VERIFIED QUESTION BANK (Minimum 25-30 questions, 5-6 per topic)
  var QUESTION_BANK = [
    {
      id: 'q1',
      topicId: 'topic_1',
      question: 'Official question stem according to syllabus standards?',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctIndex: 1, // 0-based
      explanation: 'Detailed explanation citing syllabus rules or calculation steps.'
    }
    // ... add remaining questions
  ];

  // 4. RUNTIME STATE
  var currentQuestions = [];
  var userAnswers = {}; // { qId: selectedIndex }
  var activeQuestionIdx = 0;
  var currentAssessmentMeta = {
    mode: 'full', // 'full' or 'practice'
    focusTopic: 'all',
    targetWeaknessTopicIds: []
  };

  // 5. LOCALSTORAGE HELPERS
  function getHistory() {
    try {
      var raw = localStorage.getItem(CONFIG.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveAttemptToHistory(attempt) {
    try {
      var history = getHistory();
      history.unshift(attempt);
      if (history.length > 20) history = history.slice(0, 20);
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(history));
    } catch (e) {
      console.warn('Unable to persist weakness history:', e);
    }
  }

  // 6. QUESTION GENERATOR
  function generateQuestions(focusTopic, practiceTopicIds) {
    var pool = QUESTION_BANK.slice();
    var selected = [];

    // Practice Mode: exclusively focus on weak topics
    if (practiceTopicIds && practiceTopicIds.length > 0) {
      var weakQuestions = pool.filter(function (q) {
        return practiceTopicIds.indexOf(q.topicId) !== -1;
      });
      weakQuestions.sort(function () { return 0.5 - Math.random(); });
      selected = weakQuestions.slice(0, 10);
      if (selected.length < 10) {
        var remaining = pool.filter(function (q) { return selected.indexOf(q) === -1; });
        remaining.sort(function () { return 0.5 - Math.random(); });
        selected = selected.concat(remaining.slice(0, 10 - selected.length));
      }
      return selected;
    }

    // Single Topic Selected
    if (focusTopic && focusTopic !== 'all' && TOPICS[focusTopic]) {
      var topicQ = pool.filter(function (q) { return q.topicId === focusTopic; });
      topicQ.sort(function () { return 0.5 - Math.random(); });
      selected = topicQ.slice(0, 6);
      var others = pool.filter(function (q) { return q.topicId !== focusTopic; });
      others.sort(function () { return 0.5 - Math.random(); });
      return selected.concat(others.slice(0, 10 - selected.length));
    }

    // Default Balanced 10-Question Diagnostic
    var topicKeys = Object.keys(TOPICS);
    topicKeys.forEach(function (tKey) {
      var tPool = pool.filter(function (q) { return q.topicId === tKey; });
      tPool.sort(function () { return 0.5 - Math.random(); });
      selected = selected.concat(tPool.slice(0, 2));
    });

    selected.sort(function () { return 0.5 - Math.random(); });
    return selected.slice(0, 10);
  }

  // 7. EVALUATION ENGINE
  function evaluateAssessment() {
    var correctCount = 0;
    var topicStats = {};
    var mistakes = [];

    Object.keys(TOPICS).forEach(function (tKey) {
      topicStats[tKey] = { total: 0, correct: 0 };
    });

    currentQuestions.forEach(function (q) {
      var userAns = userAnswers[q.id];
      var isCorrect = userAns === q.correctIndex;
      if (!topicStats[q.topicId]) topicStats[q.topicId] = { total: 0, correct: 0 };
      topicStats[q.topicId].total++;

      if (isCorrect) {
        correctCount++;
        topicStats[q.topicId].correct++;
      } else {
        mistakes.push({
          question: q,
          selectedAnswer: userAns,
          correctAnswer: q.correctIndex
        });
      }
    });

    var scorePct = Math.round((correctCount / currentQuestions.length) * 100);
    var strongTopics = [];
    var weakTopics = [];

    Object.keys(topicStats).forEach(function (tId) {
      var stat = topicStats[tId];
      if (stat.total > 0) {
        var pct = Math.round((stat.correct / stat.total) * 100);
        var meta = TOPICS[tId] || { name: tId, shortName: tId };
        var obj = {
          topicId: tId,
          name: meta.name,
          shortName: meta.shortName,
          total: stat.total,
          correct: stat.correct,
          percentage: pct
        };
        if (pct >= 75) {
          strongTopics.push(obj);
        } else {
          weakTopics.push(obj);
        }
      }
    });

    weakTopics.sort(function (a, b) { return a.percentage - b.percentage; });
    strongTopics.sort(function (a, b) { return b.percentage - a.percentage; });

    currentAssessmentMeta.targetWeaknessTopicIds = weakTopics.map(function (w) { return w.topicId; });
    if (currentAssessmentMeta.targetWeaknessTopicIds.length === 0 && mistakes.length > 0) {
      currentAssessmentMeta.targetWeaknessTopicIds = mistakes.map(function (m) { return m.question.topicId; });
    }

    var history = getHistory();
    var lastAttempt = history.length > 0 ? history[0] : null;
    var delta = lastAttempt ? (scorePct - lastAttempt.percentage) : null;

    var attemptRecord = {
      id: 'att_' + Date.now(),
      timestamp: Date.now(),
      dateFormatted: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      score: correctCount,
      total: currentQuestions.length,
      percentage: scorePct,
      mode: currentAssessmentMeta.mode,
      focusTopic: currentAssessmentMeta.focusTopic,
      weakTopicNames: weakTopics.map(function (w) { return w.shortName; }),
      delta: delta
    };

    saveAttemptToHistory(attemptRecord);
    renderResultsView(attemptRecord, lastAttempt, strongTopics, weakTopics, mistakes);
  }

  // 8. DOM INITIALIZATION
  function initWeaknessUI() {
    var resultsEl = document.getElementById(CONFIG.resultsId);
    var btnRow = document.querySelector(CONFIG.btnRowSelector);

    // 1. Add "Find My Weaknesses" button to form btn-row
    if (btnRow && !document.getElementById('findWeaknessesBtn')) {
      var findBtn = document.createElement('button');
      findBtn.type = 'button';
      findBtn.id = 'findWeaknessesBtn';
      findBtn.className = 'btn-secondary btn-find-weakness';
      findBtn.innerHTML = '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg><span>Find My Weaknesses</span>';
      findBtn.addEventListener('click', openWeaknessSection);
      btnRow.appendChild(findBtn);
    }

    // 2. Add Solid Pitch-Black Callout Banner in Results Section
    if (resultsEl && !document.getElementById('weaknessCalloutBanner')) {
      var banner = document.createElement('div');
      banner.id = 'weaknessCalloutBanner';
      banner.className = 'weakness-banner-card';
      banner.innerHTML = [
        '<div class="w-banner-content">',
        '  <div class="w-banner-badge">Knowledge &amp; Exam Diagnostic</div>',
        '  <h3 class="w-banner-title">Diagnose Your Knowledge Gaps Before the Exam</h3>',
        '  <p class="w-banner-desc">Take a personalized 10-question assessment based on your entered marks and curriculum standards. Discover exactly where you risk losing marks, review explanations, and practice weaknesses.</p>',
        '</div>',
        '<button type="button" id="launchWeaknessFromResults" class="btn-primary w-banner-btn">',
        '  <span>Find My Weaknesses</span>',
        '  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>',
        '</button>'
      ].join('');
      resultsEl.appendChild(banner);
      document.getElementById('launchWeaknessFromResults').addEventListener('click', openWeaknessSection);
    }
  }

  function openWeaknessSection() {
    var sec = document.getElementById('weaknessAssessmentSection');
    if (sec) {
      sec.style.display = 'block';
      sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Auto-init on DOMContentLoaded or immediate execution
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWeaknessUI);
  } else {
    initWeaknessUI();
  }
})();
```

---

## 7. Verification & Quality Assurance Checklist

Every agent must perform and verify all items before completing the implementation:

- [ ] **Pure Black Banner Verification**: The `.weakness-banner-card` background is `#000000` with border `#262626` (no slate `#111827` or `#0f172a`).
- [ ] **Two Visible Entry Points**:
  - Button exists in calculator form button row (`.btn-find-weakness`).
  - Black banner card appears inside the `#results` container.
- [ ] **Accurate Question Bank**: Contains at least 25 questions across 4–6 verified syllabus topics with zero emojis and 100% deterministic marking.
- [ ] **Inputs Context Integration**: Reads available student inputs or provides an accessible topic picker if fields are empty.
- [ ] **Deterministic Evaluation**:
  - Computes score percentage accurately out of 10.
  - Distinguishes **Strongest Topics** (≥75%) from **Weaknesses** (<75%).
  - Renders step-by-step explanations for all questions, highlighting mistakes.
- [ ] **Targeted Practice Loop**: Clicking **"Practise My Weaknesses"** immediately spins up a new 10-question quiz focused on the identified weak topics.
- [ ] **Longitudinal Improvement Tracking**: Subsequent attempts compare scores against the previous test, displaying delta percentages and trend badges.
- [ ] **LocalStorage Privacy**: Test records save to `afriwidget_<tool>_weakness_history`. No remote network requests or tracking calls.
- [ ] **Preservation of Existing Tool**: The original calculator form, calculation engine, and existing results remain completely functional.
- [ ] **Compilation & Lint Cleanliness**: `compile_applet` and `lint_applet` pass with 0 errors.
