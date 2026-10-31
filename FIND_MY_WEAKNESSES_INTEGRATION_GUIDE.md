# AFRIWIDGET "FIND MY WEAKNESSES" DAILY LEARNING QUIZ INTEGRATION GUIDE (v2.0)

This developer guide establishes the current architectural, visual, and curriculum standard for integrating AfriWidget's **"Find My Weaknesses" Daily Subject-Based Learning Quiz** into existing or new education calculators across the platform.

All six live AfriWidget education calculators follow this v2.0 standard:
- **ICASS Calculator** (`icass-calculator.html` + `icass-weakness.js`) — South Africa DHET TVET (NATED & NC(V))
- **TVET NATED Calculator** (`south-african-tvet-nated-calculator.html` + `nated-weakness.js`) — South Africa Report 191 (N1–N6)
- **South African APS Calculator** (`south-african-aps-calculator.html` + `aps-weakness.js`) — South Africa NSC / CAPS Matric
- **KUCCPS & KCSE Calculators** (`kuccps-cluster-points-calculator.html`, `kcse-grade-calculator.html` + `kuccps-weakness.js`) — Kenya KNEC KCSE
- **WASSCE Aggregate Calculator** (`wassce-aggregate-calculator.html` + `wassce-weakness.js`) — West Africa WAEC (Ghana & Nigeria)
- **JAMB UTME Calculators** (`jamb-score-calculator.html`, `jamb-utme-aggregate-calculator.html` + `jamb-weakness.js`) — Nigeria JAMB UTME

---

## 1. Core Principles & Guardrails

Every **"Find My Weaknesses"** implementation must adhere to the following platform guardrails:

1. **Pure Vanilla JavaScript, HTML & CSS (Zero Dependencies)**:
   - Use standalone, ES5/ES6 browser-native JavaScript wrapped in an Immediately Invoked Function Expression (`(function () { 'use strict'; ... })();`).
   - Do not use React, Vue, Tailwind CSS, external icon fonts, or runtime npm libraries.
   - Inject component styles cleanly via a single `<style id="[toolSlug]QuizStyles">` block (or inside the host page's `<style>` block).
   - Never call `window.alert()`, `window.confirm()`, or `window.open()` (restricted in embedded preview frames). Use inline two-step button confirmation for destructive actions such as clearing history.

2. **Current AfriWidget Visual Design Standard**:
   - **Surface & Card Palette**: Prefer crisp white (`#ffffff`) and subtle neutral (`#fafafa` / `#f9fafb`) backgrounds, dark text (`#000000`, `#111827`, `#4b5563`), and light grey `1px solid` borders (`#e5e7eb` / `#e5e5e5`).
   - **Restrained Brand Accents**: Use AfriWidget yellow (`#facc15`, hover `#fde047`) for primary action buttons (`Start Quiz`, `Check Answer`, `Next Question`) and the progress bar fill, with amber (`#f59e0b` / `#ca8a04`) for subtle inline SVG icons and section kickers.
   - **No Heavy Black Callout Banners**: The post-calculation **Find My Weaknesses** callout card (`.weakness-banner-card`) inside `#results` MUST use the clean ICASS white-card design (`background: #ffffff; border: 1px solid #e5e7eb;`) paired with a crisp outlined button (`.w-banner-btn`: white background, `1px solid #000000` border, `#000000` bold label, and `#f59e0b` shield-check SVG icon). Never use a heavy solid-black callout card or solid-yellow banner button inside `#results`.
   - **No Coloured Vertical or Horizontal Edge Strips**: Never use `border-left: 4px solid ...` or thick coloured top strips on cards, notices, topic rows, or question review items. Use uniform `1px solid` borders (`#e5e7eb` / `#e5e5e5`) and clear typographic status labels instead.
   - **Zero Emojis**: Do not place emoji characters in headings, buttons, verdicts, or recommendations. Use crisp inline `<svg>` icons only where functional.

3. **Curriculum-Authentic Subject Knowledge (Not Calculator Rules)**:
   - Each session delivers **exactly 10 mixed multiple-choice questions** testing actual syllabus concepts, problem-solving, and subject application (e.g., Quadratic Equations, Stoichiometry, Newton's Laws, Comprehension & Grammar, Financial Statements).
   - Never ask questions about how the host calculator computes APS points, WASSCE aggregates, or KUCCPS cluster formulas.
   - Verify every answer and explanation carefully against the relevant national syllabus (CAPS/NSC, KNEC KCSE, WAEC WASSCE, JAMB UTME, DHET Report 191/NC(V)). Never invent syllabus facts or claim unverified practice questions are official past examination questions.

4. **100% Client-Side Privacy & Variety Tracking**:
   - All session history and unseen-question tracking run locally inside `localStorage`:
     - `afriwidget_[tool_slug]_quiz_history_v2`: Stores up to 25–30 completed attempt summaries for longitudinal progress comparison.
     - `afriwidget_[tool_slug]_quiz_seen_v2`: Tracks recently attempted question IDs per subject so subsequent daily quizzes prioritize fresh, unseen questions.
   - Wrap all `localStorage` reads and writes in `try { ... } catch (e) {}` so private-browsing modes never throw errors.

5. **Non-Intrusive Host Calculator Integration**:
   - Never alter or overwrite the host calculator's formulas, grade weightings, form reset handlers, share adapters, or existing result outputs.
   - Read host calculator state passively from the DOM (or saved calculation state) only to pre-populate a helpful 1–2 sentence study recommendation on the setup screen.

---

## 2. Feature Workflow & 3-Screen Architecture

### Entry Points
Students can launch the quiz from two non-intrusive entry points:

1. **Calculator Form Button Row (`.btn-row`)**:
   - Appends `#findWeaknessesBtn` (`.btn-secondary.btn-find-weakness`) alongside the primary Calculate / Reset buttons so students can jump straight into subject practice even before calculating marks.
2. **Post-Calculation Results Callout Card (`#weaknessCalloutBanner.weakness-banner-card`)**:
   - Injected inside `#results` after `#afriShareBar` (and kept in canonical order via `window.afriEnsureResultSectionsOrder()` if present).
   - Uses the standardized white card + outlined shield button design matching ICASS:
     - Heading (`.w-banner-title`): Concise action title (e.g., *Diagnose Academic Subject Weaknesses*).
     - Description (`.w-banner-desc`): One short sentence describing the 10-question curriculum quiz and instant concept feedback.
     - Action Button (`.w-banner-btn`): White background, `1px solid #000000` border, `#f59e0b` shield-check SVG icon, and label `Find My Weaknesses`.

---

### View 1: Simplified Initial Setup Screen (`#wIntroView`)
The setup screen before starting a quiz MUST remain lightweight, compact, and scannable on mobile without scrolling past bulky text blocks:

1. **Compact Top Bar (`.w-intro-top-bar`)**:
   - Left: Short heading `Practice Quiz` (`.w-intro-heading`).
   - Right: Clean square close button `&times;` (`#wCloseIntroBtn.w-intro-close`, `38px × 38px` / `44px` touch comfort) to collapse `#weaknessAssessmentSection`.
2. **Personalized 1–2 Sentence Recommendation First (`#wContextNotice.w-intro-rec`)**:
   - **When calculator results exist**: Briefly state the student's calculated score/lowest subject and recommend the subject + difficulty to practise (1–2 short sentences max). Automatically pre-select that subject and difficulty unless the student has already manually chosen another option.
   - **When no calculator results exist yet**: Invite the student in one short sentence to pick a subject and difficulty for a 10-question practice quiz.
3. **Compact Subject & Context Selectors (`.w-intro-field` / `.w-intro-row-two`)**:
   - Compact `<select>` dropdown (or compact multi-subject selector where curriculum requires multi-subject mixing) allowing students to accept the recommended subject or switch immediately.
   - Keep country (e.g., Ghana / Nigeria), qualification (e.g., NATED / NC(V)), or target programme/cluster selectors compact alongside Subject in `.w-intro-row-two` **only** where needed for accurate curriculum alignment.
4. **Compact Difficulty Selector (`#wDifficultyGrid.w-intro-diff-grid`)**:
   - Three clean, equal-width buttons (`Easy`, `Medium`, `Difficult`) with `role="radiogroup"` and minimal text (`.w-intro-diff-btn`, active state `.selected` / `.active` using `#000000` fill and `#facc15` label).
5. **Single Prominent Yellow Start Button (`#wStartQuizBtn.w-intro-start-btn`)**:
   - Full-width `#facc15` button labelled **`Start Quiz`**.
6. **Zero Setup Clutter**:
   - Do **not** include lengthy introductions, repeated explanations, curriculum disclaimers, badge strips, or past-attempt tables on `#wIntroView`.

---

### View 2: Active 10-Question Learning Quiz (`#wQuizView`)
1. **Progress Header (`.w-quiz-top`)**:
   - Displays current subject/programme tag, difficulty, question counter (`Question X of 10`), and a `6px–8px` progress track with `#facc15` fill.
2. **Question & Answer Options (`.w-question-box`)**:
   - Topic kicker (`.w-question-kicker`, e.g., `Mathematics • Quadratic Equations & Inequalities • Medium`).
   - Clear question stem (`.w-question-title`) and 4 selectable option cards (`A`, `B`, `C`, `D` via `.w-option-item`).
3. **Two-Step Instant Teaching Feedback Flow**:
   - **Step A — Confirm Answer**: Selecting an option highlights it (`.selected`). Clicking **`Check Answer`** locks the options (`.locked`), marks the correct option green (`.correct`) and any wrong choice red (`.incorrect`), and reveals `.w-feedback-card`.
   - **Step B — Concept Teaching (`.w-feedback-card`)**:
     - Verdict header (`Correct` or `Incorrect`).
     - Verified correct option (`Correct Answer: B — ...`).
     - Step-by-step worked `explanation` showing why the answer is right.
     - Highlighted **Key Concept** box (`.w-concept-box`) summarizing the underlying principle or formula so the student learns before moving on.
   - **Step C — Advance**: Primary button switches to **`Next Question`** (or **`View Quiz Results`** on Question 10). Includes a `Previous` button to inspect earlier answered questions in the session and a `Restart` / `Quit` control.
4. **Scroll-Jump Prevention**:
   - Advancing via **`Next Question`** must keep the new question stem and all 4 answer options smoothly positioned below the sticky `.site-nav` header without overscrolling or browser scroll-anchoring jumps (see Section 4.4).

---

### View 3: Results, Strengths & Study Plan (`#wResultsView`)
1. **Score & Percentage Summary**:
   - Displays percentage (`0%–100%`), raw score (`X / 10`), subject/difficulty summary, and mastery headline.
2. **Progress Comparison (`#wComparisonBox`)**:
   - Compares current percentage against the student's previous local attempt in the same subject (`+X% improvement`, `steady`, or `-X%`), if prior history exists.
3. **Strengths vs. Topics Needing Improvement (`.w-analysis-grid`)**:
   - **Demonstrated Strengths**: Syllabus topics scoring `>= 75%`.
   - **Topics Needing Improvement**: Syllabus topics scoring `< 75%`, sorted lowest-first.
4. **Actionable Study Recommendations (`.w-study-section`)**:
   - Renders targeted, syllabus-specific revision advice (`studyTip`) for each weak topic identified in the session.
5. **Targeted Weak-Topic Drill CTA**:
   - When `< 75%` topics exist, provides a **`Practise Weak Topics`** button that immediately launches a fresh 10-question session focused on those weak `topicId`s.
6. **10-Question Answer & Concept Review (`.w-review-list`)**:
   - Clean white cards (`.w-review-item` with `border: 1px solid #e5e5e5;`, **no** `border-left` coloured strips) showing each question, the student's answer, the correct answer, the worked explanation, and the concept takeaway.
7. **Local Attempt History & Non-Blocking Clear**:
   - Lists recent attempts stored in `localStorage` with an inline two-click **`Clear History` $\to$ `Confirm Clear?`** button (`.w-clear-btn.armed`).
8. **Educational Disclaimer (`.w-disclaimer-note`)**:
   - Clarifies that practice questions are independent curriculum-aligned revision items created for study support and are not official examination papers.

---

## 3. Data Schemas & Specifications

### 3.1 Subject & Topic Dictionary (`SUBJECTS`)
Each subject maps to human-readable metadata and 4–6 core syllabus topics, each carrying a concrete `studyTip`:

```javascript
var SUBJECTS = {
  mathematics: {
    id: 'mathematics',
    label: 'Mathematics',
    topics: {
      algebra_quadratics: {
        label: 'Algebra, Surds & Quadratic Equations',
        studyTip: 'Practise completing the square, testing the discriminant (b^2 - 4ac), and sketching sign tables for quadratic inequalities.'
      },
      calculus_functions: {
        label: 'Functions, Graphs & Differential Calculus',
        studyTip: 'Differentiate from first principles and set f\'(x) = 0 to locate stationary points and intervals of increase or decrease.'
      },
      trigonometry: {
        label: 'Trigonometry & Identities',
        studyTip: 'Revise compound-angle reductions, special angles (30°, 45°, 60°), and general solutions within restricted intervals.'
      },
      statistics_probability: {
        label: 'Statistics, Regression & Probability',
        studyTip: 'Distinguish mutually exclusive from independent events and practise calculating standard deviation and quartiles.'
      }
    }
  }
  // Additional curriculum subjects...
};
```

### 3.2 Question Bank Item Schema (`QUESTIONS`)
Maintain **at least 24–36 verified questions per subject** distributed across `easy`, `medium`, and `difficult` tiers and all `topicId`s so 10-question sessions stay varied across repeat visits:

```javascript
{
  id: 'math_alg_m1',                 // Globally unique, stable ID (used by STORAGE_SEEN_KEY)
  subject: 'mathematics',            // Key in SUBJECTS
  topicId: 'algebra_quadratics',     // Key in SUBJECTS[subject].topics
  difficulty: 'medium',              // 'easy' | 'medium' | 'difficult'
  programmes: ['all'],               // Optional filter for country / qualification / cluster
  question: 'Solve for x if 2x² - 5x - 3 = 0.',
  options: [
    'x = -1/2 or x = 3',
    'x = 1/2 or x = -3',
    'x = -1 or x = 3/2',
    'x = 2 or x = -3'
  ],
  correctIndex: 0,                   // Zero-based index (0..3) verified against worked math
  explanation: 'Factorising the quadratic gives (2x + 1)(x - 3) = 0. Setting each factor to zero yields 2x + 1 = 0 -> x = -1/2, or x - 3 = 0 -> x = 3.',
  concept: 'A quadratic equation ax² + bx + c = 0 can be solved by factorisation when two integers multiply to ac (-6) and sum to b (-5).'
}
```

### 3.3 `localStorage` Schemas
1. **Seen Question Tracker (`afriwidget_[tool_slug]_quiz_seen_v2`)**:
   ```json
   {
     "mathematics": ["math_alg_e1", "math_calc_m2", "math_trig_m1"],
     "physical_sciences": ["phys_mech_e2", "phys_elec_d1"]
   }
   ```
   *(Cap per-subject array to the last ~40–60 IDs or reset automatically once all questions in a subject/difficulty pool have been seen).*

2. **Completed Attempt History (`afriwidget_[tool_slug]_quiz_history_v2`)**:
   ```json
   [
     {
       "timestamp": 1761868800000,
       "subjectId": "mathematics",
       "subjectLabel": "Mathematics",
       "difficulty": "medium",
       "score": 8,
       "total": 10,
       "percentage": 80,
       "weakTopics": ["Trigonometry & Identities"]
     }
   ]
   ```

---

## 4. Step-by-Step Implementation & Scroll-Safety Guide

### 4.1 Reading Host Calculator Results for Setup Recommendations
Inspect the host calculator's visible `#results` DOM or saved calculation state passively:
- Extract the overall score (APS, aggregate, cluster points, or ICASS average) and identify the lowest-scoring entered subject or task.
- Build a **1–2 sentence plain-language recommendation** inside `#wContextNotice.w-intro-rec`, e.g.:
  > *"Your calculated APS is 31, with Physical Sciences (52%) as your lowest subject. Practising Medium Physical Sciences questions can help lift your admission score."*
- Track a boolean `userChangedSetup` flag so recalculating or re-opening only auto-selects the recommended subject/difficulty if the student hasn't manually chosen another subject.

### 4.2 Ordering the Results Callout Card
When injecting `#weaknessCalloutBanner` inside `#results`:
1. Place it after `#afriShareBar` (or before `#compareEntryCard` if the Compare tool is present).
2. Always invoke `if (typeof window.afriEnsureResultSectionsOrder === 'function') window.afriEnsureResultSectionsOrder();` immediately after insertion so all post-result cards maintain consistent platform ordering.

### 4.3 Balanced 10-Question Unseen Selection Algorithm
`selectQuestionsForSession(subjectId, difficulty, mode, weakTopicIds)` must:
1. Filter `QUESTIONS` by `subjectId` (and optional country/programme filter).
2. Partition candidates in priority order:
   - Unseen questions matching `difficulty`
   - Unseen questions from adjacent difficulties (fallback if pool < 10)
   - Previously seen questions matching `difficulty`
   - Remaining subject questions
3. Shuffle within each priority tier, group into `topicId` buckets, and pick round-robin across topics until **exactly 10 unique questions** are selected.
4. Record the 10 selected `id`s in `STORAGE_SEEN_KEY` so the next session serves fresh questions.

### 4.4 Mandatory Scroll-Positioning & Anti-Jump Pattern
To prevent the page from jumping downward when clicking **`Next Question`** or **`Check Answer`** on mobile and desktop:

1. **Disable Browser Scroll Anchoring Inside the Quiz Container**:
   ```css
   #weaknessAssessmentSection {
     scroll-margin-top: 5rem;
     overflow-anchor: none;
   }
   #weaknessAssessmentSection * {
     overflow-anchor: none;
   }
   ```
2. **Prevent Focus-Triggered Jumps & Restore Scroll Position During DOM Re-render**:
   - Before replacing `.w-options-grid` innerHTML, blur any focused button inside `#weaknessAssessmentSection` (`activeEl.blur()`) and capture `var savedScrollY = getScrollY();`.
   - When moving keyboard focus programmatically, always pass `{ preventScroll: true }`.
   - Immediately after updating the question DOM, restore `setScrollYInstant(savedScrollY)` (temporarily setting `document.documentElement.style.scrollBehavior = 'auto'`), then call `ensureQuizQuestionVisible()` which smoothly scrolls **only** if `.w-quiz-top` is hidden above the sticky `.site-nav` header or below the viewport fold:

   ```javascript
   function getStickyHeaderOffset() {
     var nav = document.querySelector('.site-nav');
     var navHeight = nav ? nav.getBoundingClientRect().height : 64;
     return Math.ceil(navHeight + 16);
   }

   function ensureQuizQuestionVisible() {
     var anchor = document.querySelector('#wQuizView .w-quiz-top') || document.getElementById('wQuestionTitle');
     if (!anchor) return;
     var rect = anchor.getBoundingClientRect();
     var headerOffset = getStickyHeaderOffset();
     var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 800;
     if (rect.top < headerOffset - 4 || rect.top > viewportHeight * 0.42) {
       smoothScrollToY(getScrollY() + rect.top - headerOffset);
     }
   }
   ```

---

## 5. Official Current CSS Stylesheet Specification

Inject the following scoped CSS inside your `[tool-slug]-weakness.js` engine (or host `<style>` block). Notice the clean white `.weakness-banner-card`, outlined `.w-banner-btn`, compact `#wIntroView` rules, uniform `1px` borders with zero coloured left strips, and `overflow-anchor: none`:

```css
/* ==========================================================
   AFRIWIDGET "FIND MY WEAKNESSES" DAILY LEARNING QUIZ (v2.0)
   ========================================================== */
#weaknessAssessmentSection {
  scroll-margin-top: 5rem;
  overflow-anchor: none;
}
#weaknessAssessmentSection * {
  overflow-anchor: none;
}

/* Form Entry Button */
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
  padding: 0.875rem 1.25rem;
  min-height: 52px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}
.btn-find-weakness:hover {
  background: #000000;
  color: #facc15;
  border-color: #000000;
}
.btn-find-weakness svg {
  color: #f59e0b;
  flex-shrink: 0;
}
.btn-find-weakness:hover svg {
  color: #facc15;
}

/* Post-Results Callout Card (Exact ICASS White-Card Standard) */
.weakness-banner-card {
  margin-top: 1.5rem;
  padding: 1.25rem 1.5rem;
  background: #ffffff;
  color: #111827;
  border-radius: 0.875rem;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
@media (min-width: 640px) {
  .weakness-banner-card {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.75rem;
    gap: 1.5rem;
  }
}
.w-banner-content {
  flex: 1;
}
.w-banner-badge {
  display: none;
}
.w-banner-title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.01em;
}
.w-banner-desc {
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.5;
  margin: 0;
}
.weakness-banner-card .w-banner-btn,
.w-banner-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #ffffff;
  color: #000000;
  border: 1px solid #000000;
  font-weight: 700;
  font-size: 0.9375rem;
  border-radius: 0.5rem;
  padding: 0.875rem 1.5rem;
  min-height: 50px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease, transform 0.1s ease;
  flex-shrink: 0;
}
.weakness-banner-card .w-banner-btn:hover,
.w-banner-btn:hover {
  background: #f9fafb;
  color: #000000;
  border-color: #000000;
}
.weakness-banner-card .w-banner-btn:active,
.w-banner-btn:active {
  transform: scale(0.99);
}
.weakness-banner-card .w-banner-btn svg,
.w-banner-btn svg {
  width: 1.125rem;
  height: 1.125rem;
  stroke: #f59e0b;
  color: #f59e0b;
  flex-shrink: 0;
}
@media (max-width: 639px) {
  .weakness-banner-card .w-banner-btn,
  .w-banner-btn {
    width: 100%;
  }
}

/* Main Quiz Card Container */
.weakness-section {
  margin-top: 2rem;
}
.weakness-card {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 0.875rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
@media (min-width: 640px) {
  .weakness-card {
    padding: 2rem;
  }
}

/* Simplified Initial Setup Screen (#wIntroView) */
#wIntroView .w-intro-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}
#wIntroView .w-intro-heading {
  font-size: 1.125rem;
  font-weight: 800;
  color: #000000;
  margin: 0;
  letter-spacing: -0.01em;
}
#wIntroView .w-intro-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 0.5rem;
  border: 1px solid #e5e5e5;
  background: #ffffff;
  color: #171717;
  font-size: 1.375rem;
  line-height: 1;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
}
#wIntroView .w-intro-close:hover {
  border-color: #000000;
  background: #fafafa;
}
#wIntroView .w-intro-rec {
  font-size: 0.9375rem;
  line-height: 1.5;
  color: #171717;
  background: #fafafa;
  border: 1px solid #e5e5e5;
  border-radius: 0.5rem;
  padding: 0.75rem 0.875rem;
  margin: 0 0 1rem 0;
}
#wIntroView .w-intro-field {
  margin-bottom: 0.875rem;
}
#wIntroView .w-intro-row-two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 0.875rem;
}
@media (max-width: 479px) {
  #wIntroView .w-intro-row-two {
    grid-template-columns: 1fr;
  }
}
#wIntroView .w-intro-label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #171717;
  margin-bottom: 0.35rem;
}
.w-select {
  width: 100%;
  min-height: 44px;
  padding: 0.625rem 0.875rem;
  border: 1px solid #d4d4d4;
  border-radius: 0.5rem;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  background: #ffffff;
}
.w-select:focus {
  outline: none;
  border-color: #000000;
}
#wIntroView .w-intro-diff-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}
#wIntroView .w-intro-diff-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0.5rem;
  background: #ffffff;
  color: #171717;
  border: 1.5px solid #d4d4d4;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
}
#wIntroView .w-intro-diff-btn:hover {
  border-color: #000000;
}
#wIntroView .w-intro-diff-btn.selected {
  background: #000000;
  border-color: #000000;
  color: #facc15;
}
#wIntroView .w-intro-start-btn {
  width: 100%;
  min-height: 48px;
  margin-top: 0.25rem;
  padding: 0.75rem 1.25rem;
  background: #facc15;
  color: #000000;
  border: 1.5px solid #facc15;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}
#wIntroView .w-intro-start-btn:hover {
  background: #fde047;
  border-color: #fde047;
}

/* Active Quiz View (#wQuizView) */
.w-quiz-top {
  margin-bottom: 1.25rem;
}
.w-quiz-meta-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.625rem;
}
.w-progress-track {
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}
.w-progress-fill {
  height: 100%;
  background: #facc15;
  transition: width 0.25s ease;
}
.w-question-box {
  margin-bottom: 1.25rem;
}
.w-question-kicker {
  display: block;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #ca8a04;
  margin-bottom: 0.5rem;
}
.w-question-title {
  font-size: 1.0625rem;
  font-weight: 800;
  color: #000000;
  line-height: 1.55;
  margin: 0 0 1.125rem 0;
  white-space: pre-line;
}
@media (min-width: 640px) {
  .w-question-title {
    font-size: 1.125rem;
  }
}
.w-options-grid {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}
.w-option-item {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  width: 100%;
  min-height: 52px;
  padding: 0.875rem 1rem;
  background: #ffffff;
  border: 1.5px solid #d4d4d4;
  border-radius: 0.625rem;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
}
.w-option-item:hover:not(.locked) {
  border-color: #000000;
  background: #fafafa;
}
.w-option-item.selected:not(.locked) {
  border-color: #000000;
  background: #fefce8;
}
.w-option-letter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 0.375rem;
  background: #f5f5f5;
  color: #000000;
  font-weight: 800;
  font-size: 0.8125rem;
  flex-shrink: 0;
  margin-top: 1px;
}
.w-option-item.selected:not(.locked) .w-option-letter {
  background: #000000;
  color: #facc15;
}
.w-option-item.correct {
  border-color: #16a34a;
  background: #f0fdf4;
}
.w-option-item.correct .w-option-letter {
  background: #16a34a;
  color: #ffffff;
}
.w-option-item.incorrect {
  border-color: #dc2626;
  background: #fef2f2;
}
.w-option-item.incorrect .w-option-letter {
  background: #dc2626;
  color: #ffffff;
}
.w-option-item.locked {
  cursor: default;
}
.w-option-text {
  font-size: 0.9375rem;
  color: #111827;
  line-height: 1.5;
  font-weight: 600;
  padding-top: 2px;
}
.w-validation-alert {
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  font-weight: 700;
  font-size: 0.8125rem;
  border-radius: 0.5rem;
  margin-top: 0.875rem;
}

/* Instant Feedback & Concept Teaching Card */
.w-feedback-card {
  margin-top: 1.125rem;
  border-radius: 0.75rem;
  padding: 1.125rem 1.25rem;
  border: 1px solid #e5e7eb;
  background: #fafafa;
}
.w-feedback-card.correct {
  background: #f0fdf4;
  border-color: #bbf7d0;
}
.w-feedback-card.incorrect {
  background: #fef2f2;
  border-color: #fecaca;
}
.w-feedback-status {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.8125rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}
.w-feedback-status.correct {
  color: #166534;
}
.w-feedback-status.incorrect {
  color: #991b1b;
}
.w-feedback-ans {
  font-size: 0.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
  line-height: 1.5;
}
.w-feedback-exp {
  font-size: 0.875rem;
  color: #1f2937;
  line-height: 1.6;
  margin: 0 0 0.75rem 0;
}
.w-concept-box {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem 0.875rem;
}
.w-concept-label {
  display: block;
  font-size: 0.6875rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #ca8a04;
  margin-bottom: 0.25rem;
}
.w-concept-text {
  font-size: 0.8125rem;
  color: #111827;
  line-height: 1.55;
  margin: 0;
}
.w-quiz-nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}
@media (max-width: 639px) {
  .w-quiz-nav button {
    width: 100%;
  }
}

/* Results View (#wResultsView) — Clean White & Neutral Cards */
.w-results-hero {
  background: #fafafa;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-radius: 0.875rem;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
@media (min-width: 640px) {
  .w-results-hero {
    flex-direction: row;
    align-items: center;
    gap: 1.5rem;
  }
}
.w-results-score-big {
  font-size: 2.5rem;
  font-weight: 900;
  line-height: 1;
  color: #111827;
}
.w-score-headline {
  font-size: 1.125rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 0.25rem 0;
}
.w-score-sub {
  font-size: 0.875rem;
  color: #4b5563;
  margin: 0;
  line-height: 1.5;
}
.w-comp-card {
  padding: 0.875rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.625rem;
  background: #ffffff;
  margin-bottom: 1.25rem;
  font-size: 0.8125rem;
  color: #374151;
  line-height: 1.55;
}
.w-analysis-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
@media (min-width: 640px) {
  .w-analysis-grid {
    grid-template-columns: 1fr 1fr;
  }
}
.w-analysis-card {
  padding: 1.125rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
}
.w-analysis-card h4 {
  font-size: 0.9375rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 0.75rem 0;
}
.w-topic-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.8125rem;
}
.w-topic-row:last-child {
  border-bottom: none;
}
.w-topic-stat-strong {
  font-weight: 800;
  color: #166534;
  white-space: nowrap;
}
.w-topic-stat-weak {
  font-weight: 800;
  color: #991b1b;
  white-space: nowrap;
}
.w-study-section {
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  background: #fafafa;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
}
.w-tip-card {
  padding: 0.875rem 1rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin-bottom: 0.625rem;
}
.w-tip-card:last-child {
  margin-bottom: 0;
}
.w-practice-cta {
  padding: 1.25rem 1.5rem;
  background: #fafafa;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-radius: 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
@media (min-width: 640px) {
  .w-practice-cta {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
.w-practice-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  min-height: 46px;
  background: #facc15;
  color: #000000;
  font-weight: 800;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  border: 1px solid #facc15;
  cursor: pointer;
  white-space: nowrap;
}
.w-practice-btn:hover {
  background: #fde047;
  border-color: #fde047;
}
.w-review-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
/* Uniform 1px border — NEVER use coloured border-left strips */
.w-review-item {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.625rem;
  background: #ffffff;
}
.w-review-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
}
.w-review-verdict-ok {
  font-weight: 800;
  color: #166534;
}
.w-review-verdict-err {
  font-weight: 800;
  color: #991b1b;
}
.w-history-section {
  padding-top: 1.25rem;
  border-top: 1px solid #e5e7eb;
  margin-bottom: 1.25rem;
}
.w-clear-btn {
  background: none;
  border: 1px solid transparent;
  color: #525252;
  font-size: 0.75rem;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
  padding: 0.4rem 0.625rem;
  min-height: 40px;
  border-radius: 0.375rem;
}
.w-clear-btn.armed {
  background: #fef2f2;
  border-color: #fecaca;
  color: #991b1b;
  text-decoration: none;
}
.w-results-footer {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
@media (min-width: 640px) {
  .w-results-footer {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
.w-disclaimer-note {
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.55;
}
```

---

## 6. Complete Reusable JavaScript Engine Template (v2.0)

Create `/[tool-slug]-weakness.js` and load it right before `</body>` in the host HTML file (`<script src="/[tool-slug]-weakness.js"></script>`):

```javascript
/**
 * AfriWidget "Find My Weaknesses" Daily Subject-Based Learning Quiz (v2.0)
 * Pure Vanilla JS — Zero External Dependencies
 */
(function () {
  'use strict';

  var STORAGE_HISTORY_KEY = 'afriwidget_sample_quiz_history_v2';
  var STORAGE_SEEN_KEY = 'afriwidget_sample_quiz_seen_v2';
  var QUESTIONS_PER_SESSION = 10;

  var SUBJECTS = {
    mathematics: {
      id: 'mathematics',
      label: 'Mathematics',
      topics: {
        algebra: {
          label: 'Algebra & Equations',
          studyTip: 'Practise factorising quadratics, testing roots by substitution, and checking sign reversals in inequalities.'
        },
        calculus: {
          label: 'Functions & Calculus',
          studyTip: 'Revise power-rule differentiation and set f\'(x) = 0 to determine stationary points and tangents.'
        }
      }
    }
  };

  var QUESTIONS = [
    {
      id: 'sample_math_alg_e1',
      subject: 'mathematics',
      topicId: 'algebra',
      difficulty: 'easy',
      question: 'Solve for x: 3x - 7 = 11.',
      options: ['x = 6', 'x = 4', 'x = 18', 'x = -6'],
      correctIndex: 0,
      explanation: 'Add 7 to both sides to obtain 3x = 18, then divide both sides by 3 to get x = 6.',
      concept: 'Isolate a linear variable by applying inverse operations equally to both sides of the equation.'
    }
    // Populate 24–36+ verified syllabus questions per subject across easy, medium, and difficult...
  ];

  var state = {
    selectedSubject: 'mathematics',
    selectedDifficulty: 'medium',
    userChangedSetup: false,
    mode: 'daily', // 'daily' | 'weakness_practice'
    weakTopicIds: [],
    questions: [],
    currentIndex: 0,
    answers: [],
    confirmed: [],
    clearArmed: false
  };

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getScrollY() {
    return window.pageYOffset !== undefined
      ? window.pageYOffset
      : document.documentElement.scrollTop || 0;
  }

  function setScrollYInstant(y) {
    var htmlEl = document.documentElement;
    var prev = htmlEl.style.scrollBehavior;
    htmlEl.style.scrollBehavior = 'auto';
    window.scrollTo(0, Math.max(0, Math.round(y)));
    htmlEl.style.scrollBehavior = prev;
  }

  function smoothScrollToY(y) {
    var target = Math.max(0, Math.round(y));
    if (Math.abs(target - getScrollY()) <= 4) return;
    try {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } catch (e) {
      window.scrollTo(0, target);
    }
  }

  function getStickyHeaderOffset() {
    var nav = document.querySelector('.site-nav');
    var navH = nav ? nav.getBoundingClientRect().height : 64;
    return Math.ceil(navH + 16);
  }

  function blurActiveQuizControl() {
    var section = document.getElementById('weaknessAssessmentSection');
    var active = document.activeElement;
    if (section && active && section.contains(active) && typeof active.blur === 'function') {
      active.blur();
    }
  }

  function scrollWeaknessSectionIntoView() {
    var section = document.getElementById('weaknessAssessmentSection');
    if (!section) return;
    var rect = section.getBoundingClientRect();
    smoothScrollToY(getScrollY() + rect.top - getStickyHeaderOffset());
  }

  function ensureQuizQuestionVisible() {
    var anchor = document.querySelector('#wQuizView .w-quiz-top') || document.getElementById('wQuestionTitle');
    if (!anchor) return;
    var rect = anchor.getBoundingClientRect();
    var offset = getStickyHeaderOffset();
    var vh = window.innerHeight || document.documentElement.clientHeight || 800;
    if (rect.top < offset - 4 || rect.top > vh * 0.42) {
      smoothScrollToY(getScrollY() + rect.top - offset);
    }
  }

  function getSeenIds(subjectId) {
    try {
      var map = JSON.parse(localStorage.getItem(STORAGE_SEEN_KEY) || '{}');
      return Array.isArray(map[subjectId]) ? map[subjectId] : [];
    } catch (e) {
      return [];
    }
  }

  function markSeenIds(subjectId, ids) {
    try {
      var map = JSON.parse(localStorage.getItem(STORAGE_SEEN_KEY) || '{}');
      var list = Array.isArray(map[subjectId]) ? map[subjectId] : [];
      ids.forEach(function (id) {
        if (list.indexOf(id) === -1) list.push(id);
      });
      if (list.length > 60) list = list.slice(-40);
      map[subjectId] = list;
      localStorage.setItem(STORAGE_SEEN_KEY, JSON.stringify(map));
    } catch (e) {}
  }

  function getHistory() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_HISTORY_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveHistoryAttempt(entry) {
    try {
      var list = getHistory();
      list.unshift(entry);
      if (list.length > 25) list = list.slice(0, 25);
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  function detectCalculatorContext() {
    var resultsEl = document.getElementById('results');
    if (resultsEl && resultsEl.classList.contains('visible')) {
      var scoreEl = document.getElementById('aggregateScore');
      var scoreText = scoreEl ? scoreEl.textContent.trim() : '';
      if (scoreText) {
        return {
          hasResult: true,
          recommendedSubject: 'mathematics',
          recommendedDifficulty: 'medium',
          message: 'Your latest result is ' + scoreText + '. Practise 10 Mathematics questions at Medium difficulty to strengthen key exam topics.'
        };
      }
    }
    return {
      hasResult: false,
      recommendedSubject: 'mathematics',
      recommendedDifficulty: 'medium',
      message: 'Choose a subject and difficulty below to start a 10-question practice quiz with instant explanations.'
    };
  }

  function selectQuestionsForSession(subjectId, difficulty, mode, weakTopicIds) {
    var pool = QUESTIONS.filter(function (q) { return q.subject === subjectId; });
    if (!pool.length) pool = QUESTIONS.slice();

    if (mode === 'weakness_practice' && weakTopicIds && weakTopicIds.length) {
      var weakPool = pool.filter(function (q) { return weakTopicIds.indexOf(q.topicId) !== -1; });
      var restPool = pool.filter(function (q) { return weakTopicIds.indexOf(q.topicId) === -1; });
      pool = weakPool.concat(restPool);
    } else {
      var seen = getSeenIds(subjectId);
      var exactUnseen = pool.filter(function (q) { return q.difficulty === difficulty && seen.indexOf(q.id) === -1; });
      var otherUnseen = pool.filter(function (q) { return q.difficulty !== difficulty && seen.indexOf(q.id) === -1; });
      var exactSeen = pool.filter(function (q) { return q.difficulty === difficulty && seen.indexOf(q.id) !== -1; });
      var otherSeen = pool.filter(function (q) { return q.difficulty !== difficulty && seen.indexOf(q.id) !== -1; });
      pool = exactUnseen.concat(otherUnseen, exactSeen, otherSeen);
    }

    var selected = pool.slice(0, QUESTIONS_PER_SESSION);
    markSeenIds(subjectId, selected.map(function (q) { return q.id; }));
    return selected;
  }

  function initWeaknessUI() {
    var calcWrap = document.querySelector('.calc-wrap .container-narrow');
    if (!calcWrap || document.getElementById('weaknessAssessmentSection')) return;

    // 1. Form Button Row Entry Point
    var btnRow = document.querySelector('form .btn-row');
    if (btnRow) {
      var formBtn = document.createElement('button');
      formBtn.type = 'button';
      formBtn.id = 'findWeaknessesBtn';
      formBtn.className = 'btn-secondary btn-find-weakness';
      formBtn.innerHTML =
        '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">' +
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>' +
        '</svg><span>Find My Weaknesses</span>';
      formBtn.addEventListener('click', openWeaknessSection);
      btnRow.appendChild(formBtn);
    }

    // 2. Clean White Post-Calculation Callout Card inside #results
    var resultsEl = document.getElementById('results');
    if (resultsEl) {
      var callout = document.createElement('div');
      callout.id = 'weaknessCalloutBanner';
      callout.className = 'weakness-banner-card';
      callout.innerHTML = [
        '<div class="w-banner-content">',
        '  <h3 class="w-banner-title">Diagnose Academic Subject Weaknesses</h3>',
        '  <p class="w-banner-desc">Take a daily 10-question curriculum quiz across your core subjects with instant concept explanations.</p>',
        '</div>',
        '<button type="button" id="launchWeaknessFromResults" class="btn-secondary btn-find-weakness w-banner-btn">',
        '  <svg width="18" height="18" fill="none" stroke="#f59e0b" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">',
        '    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>',
        '  </svg>',
        '  <span>Find My Weaknesses</span>',
        '</button>'
      ].join('');

      var shareBar = document.getElementById('afriShareBar');
      if (shareBar && shareBar.parentNode === resultsEl) {
        shareBar.insertAdjacentElement('afterend', callout);
      } else {
        resultsEl.appendChild(callout);
      }

      if (typeof window.afriEnsureResultSectionsOrder === 'function') {
        window.afriEnsureResultSectionsOrder();
      }

      document.getElementById('launchWeaknessFromResults').addEventListener('click', openWeaknessSection);
    }

    // 3. Main Quiz Section (Simplified Setup + Active Quiz + Results)
    var subjectOptionsHtml = Object.keys(SUBJECTS).map(function (key) {
      return '<option value="' + escapeHtml(key) + '">' + escapeHtml(SUBJECTS[key].label) + '</option>';
    }).join('');

    var section = document.createElement('section');
    section.id = 'weaknessAssessmentSection';
    section.className = 'weakness-section';
    section.style.display = 'none';
    section.setAttribute('aria-label', 'Subject Practice Quiz');
    section.innerHTML = [
      '<div class="weakness-card">',
      '  <div id="wIntroView">',
      '    <div class="w-intro-top-bar">',
      '      <h2 class="w-intro-heading">Practice Quiz</h2>',
      '      <button type="button" id="wCloseIntroBtn" class="w-intro-close" aria-label="Close quiz">&times;</button>',
      '    </div>',
      '    <p id="wContextNotice" class="w-intro-rec"></p>',
      '    <div class="w-intro-field">',
      '      <label for="wSubjectSelect" class="w-intro-label">Subject</label>',
      '      <select id="wSubjectSelect" class="w-select">' + subjectOptionsHtml + '</select>',
      '    </div>',
      '    <div class="w-intro-field">',
      '      <span class="w-intro-label" id="wDiffLabel">Difficulty</span>',
      '      <div id="wDifficultyGrid" class="w-intro-diff-grid" role="radiogroup" aria-labelledby="wDiffLabel">',
      '        <button type="button" class="w-intro-diff-btn" data-diff="easy" role="radio" aria-checked="false">Easy</button>',
      '        <button type="button" class="w-intro-diff-btn selected" data-diff="medium" role="radio" aria-checked="true">Medium</button>',
      '        <button type="button" class="w-intro-diff-btn" data-diff="difficult" role="radio" aria-checked="false">Difficult</button>',
      '      </div>',
      '    </div>',
      '    <button type="button" id="wStartQuizBtn" class="w-intro-start-btn">Start Quiz</button>',
      '  </div>',
      '  <div id="wQuizView" style="display:none;">',
      '    <div class="w-quiz-top">',
      '      <div class="w-quiz-meta-bar">',
      '        <span id="wQuizSubjectTag"></span>',
      '        <span id="wQuizCounter">Question 1 of 10</span>',
      '      </div>',
      '      <div class="w-progress-track"><div id="wProgressBar" class="w-progress-fill" style="width:10%;"></div></div>',
      '    </div>',
      '    <div class="w-question-box">',
      '      <span id="wQuestionTopic" class="w-question-kicker"></span>',
      '      <h3 id="wQuestionTitle" class="w-question-title"></h3>',
      '      <div id="wOptionsContainer" class="w-options-grid" role="radiogroup"></div>',
      '      <div id="wValidationAlert" class="w-validation-alert" style="display:none;" role="alert">Please select an answer option first.</div>',
      '      <div id="wFeedbackContainer" style="display:none;" aria-live="polite"></div>',
      '    </div>',
      '    <div class="w-quiz-nav">',
      '      <button type="button" id="wPrevBtn" class="btn-secondary">Previous</button>',
      '      <button type="button" id="wActionBtn" class="btn-primary">Check Answer</button>',
      '    </div>',
      '  </div>',
      '  <div id="wResultsView" style="display:none;"></div>',
      '</div>'
    ].join('');

    calcWrap.appendChild(section);
    bindEvents();
  }

  function openWeaknessSection() {
    var section = document.getElementById('weaknessAssessmentSection');
    if (!section) return;
    section.style.display = 'block';
    showIntroView();
    requestAnimationFrame(scrollWeaknessSectionIntoView);
  }

  function showIntroView() {
    document.getElementById('wIntroView').style.display = 'block';
    document.getElementById('wQuizView').style.display = 'none';
    document.getElementById('wResultsView').style.display = 'none';

    var ctx = detectCalculatorContext();
    document.getElementById('wContextNotice').textContent = ctx.message;

    if (!state.userChangedSetup) {
      state.selectedSubject = ctx.recommendedSubject;
      state.selectedDifficulty = ctx.recommendedDifficulty;
      document.getElementById('wSubjectSelect').value = state.selectedSubject;
      syncDifficultyButtons();
    }
  }

  function syncDifficultyButtons() {
    var btns = document.querySelectorAll('#wDifficultyGrid .w-intro-diff-btn');
    Array.prototype.forEach.call(btns, function (btn) {
      var active = btn.getAttribute('data-diff') === state.selectedDifficulty;
      btn.classList.toggle('selected', active);
      btn.setAttribute('aria-checked', active ? 'true' : 'false');
    });
  }

  function startSession(mode, weakTopicIds) {
    state.mode = mode || 'daily';
    state.weakTopicIds = weakTopicIds || [];
    state.questions = selectQuestionsForSession(
      state.selectedSubject,
      state.selectedDifficulty,
      state.mode,
      state.weakTopicIds
    );
    state.currentIndex = 0;
    state.answers = new Array(state.questions.length).fill(null);
    state.confirmed = new Array(state.questions.length).fill(false);

    document.getElementById('wIntroView').style.display = 'none';
    document.getElementById('wResultsView').style.display = 'none';
    document.getElementById('wQuizView').style.display = 'block';
    renderActiveQuestion(true);
  }

  function renderActiveQuestion(shouldScroll) {
    blurActiveQuizControl();
    var savedScrollY = getScrollY();

    var q = state.questions[state.currentIndex];
    var total = state.questions.length;
    var subjMeta = SUBJECTS[q.subject] || { label: q.subject, topics: {} };
    var topicMeta = (subjMeta.topics && subjMeta.topics[q.topicId]) || { label: q.topicId };
    var isConfirmed = state.confirmed[state.currentIndex];
    var chosen = state.answers[state.currentIndex];

    document.getElementById('wQuizSubjectTag').textContent =
      subjMeta.label + ' • ' + state.selectedDifficulty.charAt(0).toUpperCase() + state.selectedDifficulty.slice(1);
    document.getElementById('wQuizCounter').textContent = 'Question ' + (state.currentIndex + 1) + ' of ' + total;
    document.getElementById('wProgressBar').style.width = (((state.currentIndex + 1) / total) * 100) + '%';
    document.getElementById('wQuestionTopic').textContent = topicMeta.label;
    document.getElementById('wQuestionTitle').textContent = q.question;
    document.getElementById('wValidationAlert').style.display = 'none';

    var letters = ['A', 'B', 'C', 'D'];
    var container = document.getElementById('wOptionsContainer');
    container.innerHTML = q.options.map(function (opt, idx) {
      var cls = 'w-option-item';
      if (isConfirmed) {
        cls += ' locked';
        if (idx === q.correctIndex) cls += ' correct';
        else if (idx === chosen) cls += ' incorrect';
      } else if (idx === chosen) {
        cls += ' selected';
      }
      return (
        '<button type="button" class="' + cls + '" data-idx="' + idx + '">' +
        '  <span class="w-option-letter">' + letters[idx] + '</span>' +
        '  <span class="w-option-text">' + escapeHtml(opt) + '</span>' +
        '</button>'
      );
    }).join('');

    if (!isConfirmed) {
      Array.prototype.forEach.call(container.querySelectorAll('.w-option-item'), function (btn) {
        btn.addEventListener('click', function () {
          state.answers[state.currentIndex] = parseInt(btn.getAttribute('data-idx'), 10);
          renderActiveQuestion(false);
        });
      });
    }

    var fb = document.getElementById('wFeedbackContainer');
    if (isConfirmed) {
      var ok = chosen === q.correctIndex;
      fb.style.display = 'block';
      fb.innerHTML = [
        '<div class="w-feedback-card ' + (ok ? 'correct' : 'incorrect') + '">',
        '  <div class="w-feedback-status ' + (ok ? 'correct' : 'incorrect') + '">' + (ok ? 'Correct' : 'Incorrect') + '</div>',
        '  <p class="w-feedback-ans">Correct Answer: ' + letters[q.correctIndex] + ' — ' + escapeHtml(q.options[q.correctIndex]) + '</p>',
        '  <p class="w-feedback-exp">' + escapeHtml(q.explanation) + '</p>',
        '  <div class="w-concept-box">',
        '    <span class="w-concept-label">Key Concept</span>',
        '    <p class="w-concept-text">' + escapeHtml(q.concept) + '</p>',
        '  </div>',
        '</div>'
      ].join('');
    } else {
      fb.style.display = 'none';
      fb.innerHTML = '';
    }

    document.getElementById('wPrevBtn').disabled = state.currentIndex === 0;
    var actionBtn = document.getElementById('wActionBtn');
    if (!isConfirmed) {
      actionBtn.textContent = 'Check Answer';
    } else {
      actionBtn.textContent = state.currentIndex === total - 1 ? 'View Quiz Results' : 'Next Question';
    }

    setScrollYInstant(savedScrollY);
    if (shouldScroll) {
      requestAnimationFrame(ensureQuizQuestionVisible);
    }
  }

  function bindEvents() {
    document.getElementById('wCloseIntroBtn').addEventListener('click', function () {
      document.getElementById('weaknessAssessmentSection').style.display = 'none';
    });

    document.getElementById('wSubjectSelect').addEventListener('change', function (e) {
      state.selectedSubject = e.target.value;
      state.userChangedSetup = true;
    });

    Array.prototype.forEach.call(document.querySelectorAll('#wDifficultyGrid .w-intro-diff-btn'), function (btn) {
      btn.addEventListener('click', function () {
        state.selectedDifficulty = btn.getAttribute('data-diff');
        state.userChangedSetup = true;
        syncDifficultyButtons();
      });
    });

    document.getElementById('wStartQuizBtn').addEventListener('click', function () {
      startSession('daily', []);
    });

    document.getElementById('wPrevBtn').addEventListener('click', function () {
      if (state.currentIndex > 0) {
        state.currentIndex--;
        renderActiveQuestion(true);
      }
    });

    document.getElementById('wActionBtn').addEventListener('click', function () {
      if (!state.confirmed[state.currentIndex]) {
        if (state.answers[state.currentIndex] === null) {
          document.getElementById('wValidationAlert').style.display = 'block';
          return;
        }
        state.confirmed[state.currentIndex] = true;
        renderActiveQuestion(false);
      } else if (state.currentIndex < state.questions.length - 1) {
        state.currentIndex++;
        renderActiveQuestion(true);
      } else {
        renderResults();
      }
    });
  }

  function renderResults() {
    // Score session, compute topic strengths (>=75%) & weak topics (<75%),
    // save attempt to STORAGE_HISTORY_KEY, render studyTips, Practise Weak Topics CTA,
    // 10-question review cards (uniform 1px border, no border-left strips), and two-step Clear History.
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWeaknessUI);
  } else {
    initWeaknessUI();
  }
})();
```

---

## 7. Verification & QA Checklist

Before shipping or updating any **"Find My Weaknesses"** engine on AfriWidget, verify every item below:

- [ ] **Exact ICASS White Callout Banner**: `.weakness-banner-card` inside `#results` has a white background (`#ffffff`), `1px solid #e5e7eb` border, dark text (`#111827`), hidden `.w-banner-badge`, and an outlined `.w-banner-btn` (`background: #ffffff; border: 1px solid #000000;`) with the `#f59e0b` shield SVG icon and `Find My Weaknesses` label.
- [ ] **Zero Coloured Edge Strips**: No card, notice, topic row, or `.w-review-item` uses `border-left: 4px solid ...` or heavy horizontal colour strips.
- [ ] **Simplified Initial Setup Screen (`#wIntroView`)**: Shows only `Practice Quiz` + close `&times;`, a 1–2 sentence recommendation (`#wContextNotice.w-intro-rec`), compact Subject (+ required country/programme) selector, compact `Easy | Medium | Difficult` buttons, and one yellow `Start Quiz` button.
- [ ] **Curriculum Accuracy & 10-Question Mixing**: Delivers 10 mixed subject-knowledge questions per session across syllabus topics, tracks seen question IDs in `localStorage` for variety across sessions, and never tests calculator point/aggregate rules.
- [ ] **Instant Concept Teaching**: Every question checks the answer first, locks options, explains why the correct answer holds, and highlights the underlying concept before moving to the next question.
- [ ] **Scroll Stability on Mobile & Desktop**: `#weaknessAssessmentSection` sets `overflow-anchor: none` and clicking `Next Question` repeatedly keeps the active question stem and options cleanly visible below `.site-nav` without jumping downward.
- [ ] **No Blocking Browser Dialogs or Emojis**: Zero `window.alert()`, `window.confirm()`, `window.open()`, or emoji characters anywhere in JS or HTML.
- [ ] **Host Calculator Integrity & Build Checks**: Host calculator calculations, reset button, `share-results.js`, and `afriEnsureResultSectionsOrder()` work untouched, and `node --check [tool-slug]-weakness.js` passes cleanly.
