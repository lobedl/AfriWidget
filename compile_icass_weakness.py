#!/usr/bin/env python3
"""
Compiles the upgraded TVET Daily Subject-Based Learning Quiz engine into icass-weakness.js.
"""
import json
from tvet_metadata import PROGRAMMES, SUBJECTS
from tvet_questions import QUESTIONS
from tvet_questions_more import MORE_QUESTIONS

ALL_QUESTIONS = QUESTIONS + MORE_QUESTIONS

print(f"Total compiled questions: {len(ALL_QUESTIONS)}")

# Verify all questions
seen_ids = set()
for q in ALL_QUESTIONS:
    if q["id"] in seen_ids:
        raise ValueError(f"Duplicate question ID: {q['id']}")
    seen_ids.add(q["id"])
    if len(q["options"]) != 4:
        raise ValueError(f"Question {q['id']} does not have 4 options")
    if q["correctIndex"] not in (0, 1, 2, 3):
        raise ValueError(f"Question {q['id']} invalid correctIndex {q['correctIndex']}")
    if not q["explanation"] or not q["concept"]:
        raise ValueError(f"Question {q['id']} missing explanation or concept")

print("All questions passed validation suite!")

programmes_json = json.dumps(PROGRAMMES, indent=2)
subjects_json = json.dumps(SUBJECTS, indent=2)
questions_json = json.dumps(ALL_QUESTIONS, indent=2)

js_template = """/**
 * AfriWidget TVET Daily Subject-Based Learning Quiz & Diagnostic Engine
 * Upgraded "Find My Weaknesses" Feature for South African TVET Students (NATED & NC(V))
 * Pure vanilla JavaScript. Zero dependencies, zero emojis, zero tracking.
 * 100% deterministic marking, localized storage, immediate pedagogical feedback,
 * topic-level weakness analysis, and curriculum-aligned study recommendations.
 */
(function () {
  'use strict';

  var STORAGE_HISTORY_KEY = 'afriwidget_tvet_quiz_history_v2';
  var STORAGE_SEEN_KEY = 'afriwidget_tvet_quiz_seen_v2';

  // TVET Programmes Metadata
  var PROGRAMMES = __PROGRAMMES__;

  // TVET Subjects & Topics Metadata
  var SUBJECTS = __SUBJECTS__;

  // Verified TVET Question Bank (DHET Curriculum-Aligned)
  var QUESTIONS = __QUESTIONS__;

  // State Management
  var currentSession = {
    programmeId: 'nated_eng',
    subjectId: 'math',
    difficulty: 'medium',
    mode: 'daily_quiz', // 'daily_quiz' or 'weakness_practice'
    targetWeaknessTopicIds: [],
    questions: [],
    currentIndex: 0,
    userAnswers: {}, // { qId: { selectedIndex: number, confirmed: boolean } }
    startedAt: null
  };

  // Helper: Retrieve ICASS calculator context if marks were entered
  function getIcassInputsContext() {
    try {
      if (typeof window.getIcassCalculation === 'function') {
        var calc = window.getIcassCalculation();
        if (calc && typeof calc.icassAverage === 'number') {
          return {
            calculatedScore: calc.icassAverage,
            band: calc.band,
            eligible: calc.eligible,
            hasInputs: true
          };
        }
      }
    } catch (e) {}
    return { calculatedScore: null, band: null, eligible: null, hasInputs: false };
  }

  // Helper: LocalStorage History
  function getQuizHistory() {
    try {
      var raw = localStorage.getItem(STORAGE_HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {}
    return [];
  }

  function saveQuizAttempt(attempt) {
    try {
      var history = getQuizHistory();
      history.unshift(attempt);
      if (history.length > 30) history = history.slice(0, 30);
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(history));
    } catch (e) {}
  }

  function clearQuizHistory() {
    try {
      localStorage.removeItem(STORAGE_HISTORY_KEY);
    } catch (e) {}
  }

  // Helper: LocalStorage Seen Questions Tracker for daily variety
  function getSeenQuestionIds(subjectId) {
    try {
      var raw = localStorage.getItem(STORAGE_SEEN_KEY);
      var map = raw ? JSON.parse(raw) : {};
      return Array.isArray(map[subjectId]) ? map[subjectId] : [];
    } catch (e) {}
    return [];
  }

  function markQuestionsAsSeen(subjectId, questionIds) {
    try {
      var raw = localStorage.getItem(STORAGE_SEEN_KEY);
      var map = raw ? JSON.parse(raw) : {};
      var seen = Array.isArray(map[subjectId]) ? map[subjectId] : [];
      questionIds.forEach(function (id) {
        if (seen.indexOf(id) === -1) seen.push(id);
      });
      if (seen.length > 60) seen = seen.slice(-40);
      map[subjectId] = seen;
      localStorage.setItem(STORAGE_SEEN_KEY, JSON.stringify(map));
    } catch (e) {}
  }

  // Core Question Selection Algorithm (Guarantees exactly 10 mixed questions)
  function selectQuestionsForSession(subjectId, difficulty, mode, targetTopicIds) {
    var subjectQuestions = QUESTIONS.filter(function (q) {
      return q.subject === subjectId;
    });

    if (subjectQuestions.length === 0) {
      subjectQuestions = QUESTIONS;
    }

    var candidatePool = [];

    if (mode === 'weakness_practice' && targetTopicIds && targetTopicIds.length > 0) {
      candidatePool = subjectQuestions.filter(function (q) {
        return targetTopicIds.indexOf(q.topicId) !== -1;
      });
      if (candidatePool.length < 10) {
        var others = subjectQuestions.filter(function (q) {
          return targetTopicIds.indexOf(q.topicId) === -1;
        });
        candidatePool = candidatePool.concat(others);
      }
    } else {
      var diffMatches = subjectQuestions.filter(function (q) {
        return q.difficulty === difficulty;
      });

      var seenIds = getSeenQuestionIds(subjectId);
      var unseenMatches = diffMatches.filter(function (q) {
        return seenIds.indexOf(q.id) === -1;
      });
      var seenMatches = diffMatches.filter(function (q) {
        return seenIds.indexOf(q.id) !== -1;
      });

      var otherDiffUnseen = subjectQuestions.filter(function (q) {
        return q.difficulty !== difficulty && seenIds.indexOf(q.id) === -1;
      });
      var otherDiffSeen = subjectQuestions.filter(function (q) {
        return q.difficulty !== difficulty && seenIds.indexOf(q.id) !== -1;
      });

      candidatePool = unseenMatches.concat(otherDiffUnseen).concat(seenMatches).concat(otherDiffSeen);
    }

    var subjectMeta = SUBJECTS[subjectId];
    var topicKeys = subjectMeta ? Object.keys(subjectMeta.topics) : [];
    
    var topicBuckets = {};
    topicKeys.forEach(function (t) { topicBuckets[t] = []; });
    candidatePool.forEach(function (q) {
      if (!topicBuckets[q.topicId]) topicBuckets[q.topicId] = [];
      topicBuckets[q.topicId].push(q);
    });

    var selected = [];
    var selectedIds = {};

    var round = 0;
    while (selected.length < 10 && round < 15) {
      var addedInThisRound = false;
      for (var i = 0; i < topicKeys.length; i++) {
        var tKey = topicKeys[i];
        var bucket = topicBuckets[tKey] || [];
        for (var j = 0; j < bucket.length; j++) {
          var candidate = bucket[j];
          if (!selectedIds[candidate.id]) {
            selected.push(candidate);
            selectedIds[candidate.id] = true;
            addedInThisRound = true;
            break;
          }
        }
        if (selected.length >= 10) break;
      }
      round++;
      if (!addedInThisRound) break;
    }

    if (selected.length < 10) {
      for (var k = 0; k < candidatePool.length; k++) {
        var q = candidatePool[k];
        if (!selectedIds[q.id]) {
          selected.push(q);
          selectedIds[q.id] = true;
          if (selected.length >= 10) break;
        }
      }
    }

    var finalIds = selected.map(function (q) { return q.id; });
    markQuestionsAsSeen(subjectId, finalIds);

    return selected.slice(0, 10);
  }

  // DOM Injections and Initialization
  function initWeaknessUI() {
    var calcWrap = document.querySelector('.calc-wrap .container-narrow');
    if (!calcWrap) return;

    if (document.getElementById('weaknessAssessmentSection')) return;

    // 1. Add "Find My Weaknesses" button in calculator btn-row
    var btnRow = document.querySelector('#icassForm .btn-row');
    if (btnRow) {
      var findBtn = document.createElement('button');
      findBtn.type = 'button';
      findBtn.id = 'findWeaknessesBtn';
      findBtn.className = 'btn-secondary btn-find-weakness';
      findBtn.innerHTML = '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg><span>Find My Weaknesses</span>';
      findBtn.addEventListener('click', function () {
        openWeaknessSection();
      });
      btnRow.appendChild(findBtn);
    }

    // 2. Add Callout Banner in Results Section
    var resultsEl = document.getElementById('results');
    if (resultsEl) {
      var callout = document.createElement('div');
      callout.id = 'weaknessCalloutBanner';
      callout.className = 'weakness-banner-card';
      callout.innerHTML = [
        '<div class="w-banner-content">',
        '  <div class="w-banner-badge">TVET Daily Learning Quiz</div>',
        '  <h3 class="w-banner-title">Diagnose Academic Subject Weaknesses</h3>',
        '  <p class="w-banner-desc">Take a daily 10-question curriculum quiz covering Mathematics, Engineering Science, Electrotechnics, Accounting, and Business Management with instant learning feedback.</p>',
        '</div>',
        '<button type="button" id="launchWeaknessFromResults" class="btn-secondary btn-find-weakness w-banner-btn">',
        '  <svg width="18" height="18" fill="none" stroke="#f59e0b" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
        '  <span>Find My Weaknesses</span>',
        '</button>'
      ].join('');

      var shareBar = document.getElementById('afriShareBar');
      var academicProgress = document.getElementById('afriAcademicProgress');
      var compareCard = document.getElementById('compareEntryCard');

      if (compareCard && compareCard.parentNode === resultsEl) {
        resultsEl.insertBefore(callout, compareCard);
      } else if (shareBar && shareBar.parentNode === resultsEl) {
        shareBar.insertAdjacentElement('afterend', callout);
      } else if (academicProgress && academicProgress.parentNode === resultsEl) {
        academicProgress.insertAdjacentElement('afterend', callout);
      } else {
        resultsEl.appendChild(callout);
      }

      if (typeof window.afriEnsureResultSectionsOrder === 'function') {
        window.afriEnsureResultSectionsOrder();
      }

      var launchBtn = document.getElementById('launchWeaknessFromResults');
      if (launchBtn) {
        launchBtn.addEventListener('click', function () {
          openWeaknessSection();
        });
      }
    }

    // 3. Inject Styles for Upgraded Learning Feedback & Review
    var styleEl = document.createElement('style');
    styleEl.id = 'tvetQuizStyles';
    styleEl.textContent = [
      '.w-select-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; margin-bottom: 1.5rem; }',
      '@media (min-width: 640px) { .w-select-grid { grid-template-columns: 1fr 1fr 1fr; } }',
      '.w-option-item.correct { border-color: #16a34a !important; background-color: #f0fdf4 !important; }',
      '.w-option-item.correct .w-option-letter { background-color: #16a34a !important; color: #fff !important; }',
      '.w-option-item.incorrect { border-color: #dc2626 !important; background-color: #fef2f2 !important; }',
      '.w-option-item.incorrect .w-option-letter { background-color: #dc2626 !important; color: #fff !important; }',
      '.w-option-item.locked { cursor: default; }',
      '.w-feedback-card { margin-top: 1.25rem; border-radius: .75rem; padding: 1.25rem 1.5rem; border: 1px solid #e5e7eb; background: #fff; animation: wFadeIn .2s ease; }',
      '@keyframes wFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }',
      '.w-feedback-card.correct { border-left: 5px solid #16a34a; background: #f0fdf4; }',
      '.w-feedback-card.incorrect { border-left: 5px solid #dc2626; background: #fff; }',
      '.w-feedback-status { display: inline-flex; align-items: center; gap: .4rem; font-size: .8125rem; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; margin-bottom: .6rem; }',
      '.w-feedback-status.correct { color: #166534; }',
      '.w-feedback-status.incorrect { color: #991b1b; }',
      '.w-feedback-correct-ans { font-size: .9375rem; font-weight: 700; color: #111827; margin-bottom: .6rem; }',
      '.w-feedback-text { font-size: .875rem; color: #374151; line-height: 1.55; margin-bottom: .75rem; }',
      '.w-concept-box { background: rgba(0,0,0,0.03); border: 1px dashed #cbd5e1; border-radius: .5rem; padding: .75rem 1rem; margin-top: .5rem; }',
      '.w-concept-label { font-size: .75rem; font-weight: 800; text-transform: uppercase; color: #475569; display: block; margin-bottom: .25rem; }',
      '.w-concept-text { font-size: .8125rem; color: #1e293b; line-height: 1.5; margin: 0; }',
      '.w-study-tips-section { margin-bottom: 2rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: .75rem; padding: 1.5rem; }',
      '.w-study-tips-title { font-size: 1.125rem; font-weight: 800; color: #0f172a; margin: 0 0 .5rem 0; display: flex; align-items: center; gap: .5rem; }',
      '.w-study-tips-sub { font-size: .875rem; color: #64748b; margin: 0 0 1rem 0; }',
      '.w-tip-item { display: flex; align-items: flex-start; gap: .75rem; padding: .75rem; background: #fff; border: 1px solid #e2e8f0; border-radius: .5rem; margin-bottom: .5rem; }',
      '.w-tip-icon { color: #0284c7; flex-shrink: 0; margin-top: 2px; }',
      '.w-tip-text strong { display: block; font-size: .875rem; color: #0f172a; margin-bottom: .2rem; }',
      '.w-tip-text p { font-size: .8125rem; color: #475569; line-height: 1.5; margin: 0; }',
      '.w-history-item { display: flex; flex-direction: column; gap: .4rem; padding: 1rem; border: 1px solid #e5e7eb; border-radius: .5rem; background: #fff; margin-bottom: .75rem; }',
      '@media (min-width: 640px) { .w-history-item { flex-direction: row; align-items: center; justify-content: space-between; } }',
      '.w-hist-title { font-size: .875rem; font-weight: 700; color: #111827; }',
      '.w-hist-meta { font-size: .75rem; color: #6b7280; }',
      '.w-hist-score { font-size: 1.125rem; font-weight: 800; color: #000; }'
    ].join('\\n');
    document.head.appendChild(styleEl);

    // 4. Create Main Weakness Assessment Container
    var section = document.createElement('section');
    section.id = 'weaknessAssessmentSection';
    section.className = 'weakness-section';
    section.style.display = 'none';
    section.setAttribute('aria-live', 'polite');

    section.innerHTML = [
      '<div class="weakness-card">',
      '  <!-- Screen 1: Daily Subject Quiz Intro & Selection -->',
      '  <div id="wIntroView" class="w-view">',
      '    <div class="w-header">',
      '      <span class="w-eyebrow">AfriWidget TVET Academic Engine</span>',
      '      <h2 class="w-title">Find My Subject Weaknesses</h2>',
      '      <p class="w-subtitle">A daily subject-based learning quiz for South African TVET students. Select your programme, qualification level, and subject to generate 10 curriculum-aligned questions testing academic understanding, practical application, and problem solving.</p>',
      '    </div>',
      '    <div id="wContextNotice" class="w-context-notice"></div>',
      '    <div class="w-select-grid">',
      '      <div class="w-field-group">',
      '        <label class="w-field-label" for="wProgrammeSelect">TVET Programme Track:</label>',
      '        <select id="wProgrammeSelect" class="form-input w-select">',
      '          <option value="nated_eng">Engineering Studies (NATED N1–N6)</option>',
      '          <option value="nated_bus">Business &amp; Management (NATED N4–N6)</option>',
      '          <option value="ncv_it">IT &amp; Computer Science (NC(V) L2–L4)</option>',
      '        </select>',
      '      </div>',
      '      <div class="w-field-group">',
      '        <label class="w-field-label" for="wSubjectSelect">TVET Subject:</label>',
      '        <select id="wSubjectSelect" class="form-input w-select"></select>',
      '      </div>',
      '      <div class="w-field-group">',
      '        <label class="w-field-label" for="wDifficultySelect">Difficulty Level:</label>',
      '        <select id="wDifficultySelect" class="form-input w-select">',
      '          <option value="easy">Easy (Definitions &amp; Core Formulas)</option>',
      '          <option value="medium" selected>Medium (Applied Problem Solving)</option>',
      '          <option value="difficult">Difficult (Advanced Analysis)</option>',
      '        </select>',
      '      </div>',
      '    </div>',
      '    <div class="w-intro-meta">',
      '      <div class="w-intro-badge"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Exactly 10 Curriculum Questions</div>',
      '      <div class="w-intro-badge"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Immediate Step-by-Step Explanations</div>',
      '      <div class="w-intro-badge"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Weakness Diagnostics &amp; Study Tips</div>',
      '    </div>',
      '    <div class="w-btn-row">',
      '      <button type="button" id="wStartBtn" class="btn-primary w-full-btn">Start Daily Quiz (10 Questions)</button>',
      '      <button type="button" id="wCloseIntroBtn" class="btn-secondary">Close</button>',
      '    </div>',
      '    <div id="wHistoryPreview" class="w-history-preview" style="margin-top:1.5rem;"></div>',
      '  </div>',

      '  <!-- Screen 2: Active 10-Question Test with Immediate Learning Feedback -->',
      '  <div id="wQuizView" class="w-view" style="display:none;">',
      '    <div class="w-quiz-top">',
      '      <div class="w-quiz-info">',
      '        <div>',
      '          <span id="wQuizBadge" class="w-tag">Mathematics (N1–N3)</span>',
      '          <span id="wDifficultyBadge" class="w-intro-badge" style="margin-left:.5rem;padding:.2rem .5rem;font-size:.75rem;">Medium</span>',
      '        </div>',
      '        <span class="w-quiz-counter">Question <strong id="wCurrentQNum">1</strong> of 10</span>',
      '      </div>',
      '      <div class="w-progress-track">',
      '        <div id="wProgressBar" class="w-progress-fill" style="width: 10%;"></div>',
      '      </div>',
      '    </div>',
      '    <div class="w-question-box">',
      '      <span id="wQuestionTopic" class="w-question-topic">Topic</span>',
      '      <h3 id="wQuestionText" class="w-question-title">Question prompt</h3>',
      '      <div id="wOptionsContainer" class="w-options-grid" role="radiogroup" aria-label="Question options"></div>',
      '    </div>',
      '    <div id="wFeedbackContainer" style="display:none;"></div>',
      '    <div id="wQuizValidation" class="w-validation-alert" style="display:none;">Please select an option before confirming.</div>',
      '    <div class="w-quiz-nav">',
      '      <button type="button" id="wPrevBtn" class="btn-secondary" disabled>Previous</button>',
      '      <button type="button" id="wConfirmBtn" class="btn-primary">Confirm Answer</button>',
      '      <button type="button" id="wNextBtn" class="btn-primary" style="display:none;">Next Question &rarr;</button>',
      '      <button type="button" id="wSubmitBtn" class="btn-primary" style="display:none;">View Quiz Results &rarr;</button>',
      '    </div>',
      '  </div>',

      '  <!-- Screen 3: Diagnostic Results, Weaknesses & Study Recommendations -->',
      '  <div id="wResultsView" class="w-view" style="display:none;">',
      '    <div class="w-results-header">',
      '      <span class="w-eyebrow">Academic Diagnostic Results</span>',
      '      <div class="w-results-score-wrap">',
      '        <div class="w-results-score-big" id="wScoreBig">0%</div>',
      '        <div class="w-results-score-text">',
      '          <h3 id="wScoreHeadline" class="w-score-headline">Performance Summary</h3>',
      '          <p id="wScoreFraction" class="w-score-fraction">0 / 10 Correct</p>',
      '        </div>',
      '      </div>',
      '    </div>',

      '    <!-- Comparison with Previous Attempt -->',
      '    <div id="wComparisonBox" class="w-comparison-card"></div>',

      '    <!-- Strongest Topics vs Weaknesses Grid -->',
      '    <div class="w-analysis-grid">',
      '      <div class="w-analysis-card w-card-strong">',
      '        <div class="w-card-head">',
      '          <svg width="20" height="20" fill="none" stroke="#16a34a" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      '          <h4>Demonstrated Strengths</h4>',
      '        </div>',
      '        <div id="wStrongTopicsList" class="w-analysis-list"></div>',
      '      </div>',
      '      <div class="w-analysis-card w-card-weak">',
      '        <div class="w-card-head">',
      '          <svg width="20" height="20" fill="none" stroke="#dc2626" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
      '          <h4>Topics Needing Improvement</h4>',
      '        </div>',
      '        <div id="wWeakTopicsList" class="w-analysis-list"></div>',
      '      </div>',
      '    </div>',

      '    <!-- Specific Study Recommendations -->',
      '    <div class="w-study-tips-section">',
      '      <h4 class="w-study-tips-title">',
      '        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',
      '        Specific Study Recommendations',
      '      </h4>',
      '      <p class="w-study-tips-sub">Targeted guidance based on the curriculum topics where you lost marks in this quiz.</p>',
      '      <div id="wStudyTipsList"></div>',
      '    </div>',

      '    <!-- Targeted Action CTA -->',
      '    <div class="w-practice-banner">',
      '      <div class="w-practice-banner-text">',
      '        <h4>Turn Weaknesses into Marks</h4>',
      '        <p>Generate a targeted 10-question practice assessment focused exclusively on the topics where you lost points today.</p>',
      '      </div>',
      '      <button type="button" id="wPractiseBtn" class="btn-primary w-practice-btn">',
      '        <span>Practise My Weaknesses</span>',
      '        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
      '      </button>',
      '    </div>',

      '    <!-- Mistakes & Detailed Explanations Accordion -->',
      '    <div class="w-review-section">',
      '      <div class="w-review-head">',
      '        <h4 class="w-review-title">Step-by-Step Question Review &amp; Concept Audit</h4>',
      '        <span class="w-review-sub">Review every question, verified answers, explanations, and underlying TVET concepts.</span>',
      '      </div>',
      '      <div id="wReviewList" class="w-review-list"></div>',
      '    </div>',

      '    <!-- LocalStorage History Section -->',
      '    <div class="w-history-section">',
      '      <div class="w-history-head">',
      '        <h4 class="w-history-title">Saved Quiz History (This Device)</h4>',
      '        <button type="button" id="wClearHistoryBtn" class="w-clear-link">Clear History</button>',
      '      </div>',
      '      <div id="wHistoryList" class="w-history-list"></div>',
      '    </div>',

      '    <div class="w-results-footer">',
      '      <button type="button" id="wRetakeBtn" class="btn-primary">Take Another Quiz (Fresh Questions)</button>',
      '      <button type="button" id="wChangeSubjectBtn" class="btn-secondary">Change Subject / Difficulty</button>',
      '      <button type="button" id="wCloseResultsBtn" class="btn-secondary">Close Quiz</button>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('');

    calcWrap.appendChild(section);

    bindEvents();
    populateSubjectDropdown();
  }

  function populateSubjectDropdown() {
    var progSelect = document.getElementById('wProgrammeSelect');
    var subjSelect = document.getElementById('wSubjectSelect');
    if (!progSelect || !subjSelect) return;

    var progId = progSelect.value;
    var progMeta = PROGRAMMES[progId];
    subjSelect.innerHTML = '';

    if (progMeta && progMeta.subjects) {
      progMeta.subjects.forEach(function (sId) {
        var sMeta = SUBJECTS[sId];
        if (sMeta) {
          var opt = document.createElement('option');
          opt.value = sId;
          opt.textContent = sMeta.name;
          subjSelect.appendChild(opt);
        }
      });
    }
  }

  function bindEvents() {
    var progSelect = document.getElementById('wProgrammeSelect');
    if (progSelect) {
      progSelect.addEventListener('change', function () {
        populateSubjectDropdown();
      });
    }

    var startBtn = document.getElementById('wStartBtn');
    if (startBtn) {
      startBtn.addEventListener('click', function () {
        var progId = document.getElementById('wProgrammeSelect').value;
        var subjId = document.getElementById('wSubjectSelect').value;
        var diff = document.getElementById('wDifficultySelect').value;
        startNewQuizSession(progId, subjId, diff, 'daily_quiz', []);
      });
    }

    var closeIntroBtn = document.getElementById('wCloseIntroBtn');
    if (closeIntroBtn) {
      closeIntroBtn.addEventListener('click', function () {
        closeWeaknessSection();
      });
    }

    var prevBtn = document.getElementById('wPrevBtn');
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        if (currentSession.currentIndex > 0) {
          currentSession.currentIndex--;
          renderActiveQuestion();
        }
      });
    }

    var confirmBtn = document.getElementById('wConfirmBtn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', function () {
        confirmActiveAnswer();
      });
    }

    var nextBtn = document.getElementById('wNextBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        if (currentSession.currentIndex < currentSession.questions.length - 1) {
          currentSession.currentIndex++;
          renderActiveQuestion();
        }
      });
    }

    var submitBtn = document.getElementById('wSubmitBtn');
    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        evaluateQuizResults();
      });
    }

    var practiseBtn = document.getElementById('wPractiseBtn');
    if (practiseBtn) {
      practiseBtn.addEventListener('click', function () {
        startWeaknessPracticeSession();
      });
    }

    var retakeBtn = document.getElementById('wRetakeBtn');
    if (retakeBtn) {
      retakeBtn.addEventListener('click', function () {
        startNewQuizSession(
          currentSession.programmeId,
          currentSession.subjectId,
          currentSession.difficulty,
          'daily_quiz',
          []
        );
      });
    }

    var changeSubjectBtn = document.getElementById('wChangeSubjectBtn');
    if (changeSubjectBtn) {
      changeSubjectBtn.addEventListener('click', function () {
        switchView('wIntroView');
        updateContextNotice();
        renderHistoryPreview();
      });
    }

    var closeResultsBtn = document.getElementById('wCloseResultsBtn');
    if (closeResultsBtn) {
      closeResultsBtn.addEventListener('click', function () {
        closeWeaknessSection();
      });
    }

    var clearHistBtn = document.getElementById('wClearHistoryBtn');
    if (clearHistBtn) {
      clearHistBtn.addEventListener('click', function () {
        if (window.confirm('Clear all saved quiz history from this device?')) {
          clearQuizHistory();
          renderHistoryList();
          renderHistoryPreview();
          updateComparisonBox(null);
        }
      });
    }
  }

  function openWeaknessSection() {
    var section = document.getElementById('weaknessAssessmentSection');
    if (!section) return;

    section.style.display = 'block';
    updateContextNotice();
    renderHistoryPreview();
    switchView('wIntroView');

    setTimeout(function () {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  function closeWeaknessSection() {
    var section = document.getElementById('weaknessAssessmentSection');
    if (section) section.style.display = 'none';
  }

  function switchView(viewId) {
    var views = ['wIntroView', 'wQuizView', 'wResultsView'];
    views.forEach(function (v) {
      var el = document.getElementById(v);
      if (el) el.style.display = (v === viewId) ? 'block' : 'none';
    });
  }

  function updateContextNotice() {
    var noticeEl = document.getElementById('wContextNotice');
    if (!noticeEl) return;

    var ctx = getIcassInputsContext();
    if (ctx.calculatedScore !== null) {
      var bandDesc = ctx.calculatedScore >= 75 ? 'Distinction band' :
                     ctx.calculatedScore >= 65 ? 'Credit band' :
                     ctx.calculatedScore >= 50 ? 'Pass band' :
                     ctx.calculatedScore >= 40 ? 'Borderline exam entry' : 'Sub-minimum risk (DNQ)';

      noticeEl.innerHTML = [
        '<div class="w-notice-box">',
        '  <span class="w-notice-title">Calculated ICASS Context Detected:</span>',
        '  <p>Current calculated ICASS average: <strong>' + ctx.calculatedScore.toFixed(2) + '%</strong> (' + bandDesc + '). Use this daily quiz to strengthen your academic subject knowledge before writing your final external DHET examination.</p>',
        '</div>'
      ].join('');
      noticeEl.style.display = 'block';
    } else {
      noticeEl.innerHTML = [
        '<div class="w-notice-box">',
        '  <span class="w-notice-title">Curriculum-Aligned TVET Learning:</span>',
        '  <p>Select your programme track, subject, and difficulty level below. Each daily session generates exactly 10 questions covering authentic syllabus topics with immediate step-by-step learning feedback.</p>',
        '</div>'
      ].join('');
      noticeEl.style.display = 'block';
    }
  }

  function startNewQuizSession(progId, subjId, difficulty, mode, targetTopicIds) {
    var questions = selectQuestionsForSession(subjId, difficulty, mode, targetTopicIds);
    if (!questions || questions.length === 0) return;

    currentSession = {
      programmeId: progId,
      subjectId: subjId,
      difficulty: difficulty,
      mode: mode,
      targetWeaknessTopicIds: targetTopicIds || [],
      questions: questions,
      currentIndex: 0,
      userAnswers: {},
      startedAt: Date.now()
    };

    var subjMeta = SUBJECTS[subjId] || { name: 'Subject Quiz' };
    var badgeText = mode === 'weakness_practice' ?
      'Weakness Practice: ' + subjMeta.name : subjMeta.name;

    document.getElementById('wQuizBadge').textContent = badgeText;
    document.getElementById('wDifficultyBadge').textContent = difficulty.toUpperCase();

    switchView('wQuizView');
    renderActiveQuestion();

    var section = document.getElementById('weaknessAssessmentSection');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function startWeaknessPracticeSession() {
    if (!currentSession.targetWeaknessTopicIds || currentSession.targetWeaknessTopicIds.length === 0) {
      var subjMeta = SUBJECTS[currentSession.subjectId];
      currentSession.targetWeaknessTopicIds = subjMeta ? Object.keys(subjMeta.topics) : [];
    }

    startNewQuizSession(
      currentSession.programmeId,
      currentSession.subjectId,
      currentSession.difficulty,
      'weakness_practice',
      currentSession.targetWeaknessTopicIds
    );
  }

  function renderActiveQuestion() {
    var q = currentSession.questions[currentSession.currentIndex];
    if (!q) return;

    var subjMeta = SUBJECTS[q.subject] || { topics: {} };
    var topicMeta = subjMeta.topics[q.topicId] || { name: 'Curriculum Topic' };

    document.getElementById('wCurrentQNum').textContent = (currentSession.currentIndex + 1);
    document.getElementById('wProgressBar').style.width = ((currentSession.currentIndex + 1) * 10) + '%';
    document.getElementById('wQuestionTopic').textContent = topicMeta.name;
    document.getElementById('wQuestionText').textContent = q.question;

    var optionsBox = document.getElementById('wOptionsContainer');
    optionsBox.innerHTML = '';

    var answerState = currentSession.userAnswers[q.id] || { selectedIndex: undefined, confirmed: false };
    var isConfirmed = answerState.confirmed;
    var selectedIdx = answerState.selectedIndex;

    q.options.forEach(function (optText, oIdx) {
      var letter = String.fromCharCode(65 + oIdx);
      var optBtn = document.createElement('div');
      
      var classes = ['w-option-item'];
      if (selectedIdx === oIdx) classes.push('selected');
      if (isConfirmed) {
        classes.push('locked');
        if (oIdx === q.correctIndex) {
          classes.push('correct');
        } else if (selectedIdx === oIdx && oIdx !== q.correctIndex) {
          classes.push('incorrect');
        }
      }

      optBtn.className = classes.join(' ');
      optBtn.setAttribute('role', 'radio');
      optBtn.setAttribute('aria-checked', selectedIdx === oIdx ? 'true' : 'false');
      optBtn.setAttribute('tabindex', isConfirmed ? '-1' : '0');

      optBtn.innerHTML = [
        '<span class="w-option-letter">' + letter + '</span>',
        '<span class="w-option-text">' + optText + '</span>'
      ].join('');

      function handleSelect() {
        if (isConfirmed) return;
        currentSession.userAnswers[q.id] = {
          selectedIndex: oIdx,
          confirmed: false
        };
        document.getElementById('wQuizValidation').style.display = 'none';
        renderActiveQuestion();
      }

      optBtn.addEventListener('click', handleSelect);
      optBtn.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleSelect();
        }
      });

      optionsBox.appendChild(optBtn);
    });

    // Render Learning Feedback if answer is confirmed
    var feedbackBox = document.getElementById('wFeedbackContainer');
    if (isConfirmed) {
      var isCorrect = selectedIdx === q.correctIndex;
      var statusClass = isCorrect ? 'correct' : 'incorrect';
      var statusTitle = isCorrect ? 'Correct Answer' : 'Incorrect — Let\\'s Review This Concept';
      var correctLetter = String.fromCharCode(65 + q.correctIndex);
      var correctText = q.options[q.correctIndex];

      feedbackBox.className = 'w-feedback-card ' + statusClass;
      feedbackBox.innerHTML = [
        '<div class="w-feedback-status ' + statusClass + '">',
        '  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">',
             isCorrect ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>' :
                         '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>',
        '  </svg>',
        '  <span>' + statusTitle + '</span>',
        '</div>',
        !isCorrect ? '<div class="w-feedback-correct-ans">Correct Answer: <strong>' + correctLetter + '. ' + correctText + '</strong></div>' : '',
        '<div class="w-feedback-text">' + q.explanation + '</div>',
        '<div class="w-concept-box">',
        '  <span class="w-concept-label">Underlying TVET Curriculum Concept:</span>',
        '  <p class="w-concept-text">' + q.concept + '</p>',
        '</div>'
      ].join('');
      feedbackBox.style.display = 'block';
    } else {
      feedbackBox.style.display = 'none';
      feedbackBox.innerHTML = '';
    }

    // Navigation buttons state
    var prevBtn = document.getElementById('wPrevBtn');
    var confirmBtn = document.getElementById('wConfirmBtn');
    var nextBtn = document.getElementById('wNextBtn');
    var submitBtn = document.getElementById('wSubmitBtn');

    prevBtn.disabled = currentSession.currentIndex === 0;

    if (!isConfirmed) {
      confirmBtn.style.display = 'inline-flex';
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'none';
    } else {
      confirmBtn.style.display = 'none';
      if (currentSession.currentIndex === currentSession.questions.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-flex';
      } else {
        nextBtn.style.display = 'inline-flex';
        submitBtn.style.display = 'none';
      }
    }
  }

  function confirmActiveAnswer() {
    var q = currentSession.questions[currentSession.currentIndex];
    var answerState = currentSession.userAnswers[q.id];

    if (!answerState || answerState.selectedIndex === undefined) {
      var alertEl = document.getElementById('wQuizValidation');
      alertEl.style.display = 'block';
      return;
    }

    document.getElementById('wQuizValidation').style.display = 'none';
    answerState.confirmed = true;
    renderActiveQuestion();

    setTimeout(function () {
      var feedbackBox = document.getElementById('wFeedbackContainer');
      if (feedbackBox) {
        feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 50);
  }

  function evaluateQuizResults() {
    var correctCount = 0;
    var topicStats = {};
    var mistakes = [];

    var subjMeta = SUBJECTS[currentSession.subjectId] || { topics: {} };
    Object.keys(subjMeta.topics).forEach(function (tKey) {
      topicStats[tKey] = { total: 0, correct: 0 };
    });

    currentSession.questions.forEach(function (q) {
      var ans = currentSession.userAnswers[q.id];
      var selectedIdx = ans ? ans.selectedIndex : undefined;
      var isCorrect = selectedIdx === q.correctIndex;

      if (!topicStats[q.topicId]) {
        topicStats[q.topicId] = { total: 0, correct: 0 };
      }
      topicStats[q.topicId].total++;

      if (isCorrect) {
        correctCount++;
        topicStats[q.topicId].correct++;
      } else {
        mistakes.push({
          question: q,
          selectedAnswer: selectedIdx,
          correctAnswer: q.correctIndex
        });
      }
    });

    var scorePct = Math.round((correctCount / currentSession.questions.length) * 100);

    var strongTopics = [];
    var weakTopics = [];

    Object.keys(topicStats).forEach(function (tId) {
      var stat = topicStats[tId];
      if (stat.total > 0) {
        var pct = Math.round((stat.correct / stat.total) * 100);
        var meta = subjMeta.topics[tId] || { name: tId, shortName: tId, studyTip: '' };
        var obj = {
          topicId: tId,
          name: meta.name,
          shortName: meta.shortName,
          total: stat.total,
          correct: stat.correct,
          percentage: pct,
          studyTip: meta.studyTip || ''
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

    currentSession.targetWeaknessTopicIds = weakTopics.map(function (w) { return w.topicId; });
    if (currentSession.targetWeaknessTopicIds.length === 0 && mistakes.length > 0) {
      currentSession.targetWeaknessTopicIds = mistakes.map(function (m) { return m.question.topicId; });
    }

    var history = getQuizHistory();
    var lastSubjectAttempt = null;
    for (var h = 0; h < history.length; h++) {
      if (history[h].subjectId === currentSession.subjectId) {
        lastSubjectAttempt = history[h];
        break;
      }
    }
    var delta = lastSubjectAttempt ? (scorePct - lastSubjectAttempt.percentage) : null;

    var record = {
      id: 'quiz_' + Date.now(),
      timestamp: Date.now(),
      dateFormatted: new Date().toLocaleDateString('en-ZA', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      programmeId: currentSession.programmeId,
      subjectId: currentSession.subjectId,
      subjectName: subjMeta.name,
      difficulty: currentSession.difficulty,
      mode: currentSession.mode,
      score: correctCount,
      total: currentSession.questions.length,
      percentage: scorePct,
      weakTopicNames: weakTopics.map(function (w) { return w.shortName; }),
      delta: delta
    };

    saveQuizAttempt(record);

    renderResultsView(record, lastSubjectAttempt, strongTopics, weakTopics, mistakes);
  }

  function renderResultsView(attempt, lastAttempt, strongTopics, weakTopics, mistakes) {
    switchView('wResultsView');

    document.getElementById('wScoreBig').textContent = attempt.percentage + '%';
    document.getElementById('wScoreFraction').textContent = attempt.score + ' of ' + attempt.total + ' Correct (' + attempt.subjectName + ' - ' + attempt.difficulty.toUpperCase() + ')';

    var headlineEl = document.getElementById('wScoreHeadline');
    if (attempt.percentage >= 80) {
      headlineEl.textContent = 'Distinction-Level Mastery (DHET Level 7)';
    } else if (attempt.percentage >= 60) {
      headlineEl.textContent = 'Competent Pass with Target Revision Areas';
    } else if (attempt.percentage >= 40) {
      headlineEl.textContent = 'Borderline Pass — Specific Weaknesses Need Work';
    } else {
      headlineEl.textContent = 'At-Risk — High Priority Revision Required';
    }

    updateComparisonBox(attempt);

    var strongList = document.getElementById('wStrongTopicsList');
    if (strongTopics.length > 0) {
      strongList.innerHTML = strongTopics.map(function (s) {
        return [
          '<div class="w-topic-badge-row strong">',
          '  <span>' + s.name + '</span>',
          '  <span class="w-topic-score">' + s.correct + '/' + s.total + ' (' + s.percentage + '%)</span>',
          '</div>'
        ].join('');
      }).join('');
    } else {
      strongList.innerHTML = '<div class="w-empty-note">No topics cleared the 75% threshold in this session. Review the recommendations below to build mastery.</div>';
    }

    var weakList = document.getElementById('wWeakTopicsList');
    if (weakTopics.length > 0) {
      weakList.innerHTML = weakTopics.map(function (w) {
        return [
          '<div class="w-topic-badge-row weak">',
          '  <span>' + w.name + '</span>',
          '  <span class="w-topic-score">' + w.correct + '/' + w.total + ' (' + w.percentage + '%)</span>',
          '</div>'
        ].join('');
      }).join('');
    } else {
      weakList.innerHTML = '<div class="w-empty-note green">Outstanding! 100% demonstrated accuracy across all assessed topics in this session.</div>';
    }

    var tipsList = document.getElementById('wStudyTipsList');
    var recommendations = [];
    if (weakTopics.length > 0) {
      weakTopics.forEach(function (w) {
        if (w.studyTip) {
          recommendations.push({
            topic: w.name,
            tip: w.studyTip
          });
        }
      });
    } else {
      recommendations.push({
        topic: 'Exam Readiness & Time Management',
        tip: 'Maintain your current study schedule, practice past DHET national examination papers under strict timed exam conditions, and test the "Difficult" quiz setting.'
      });
    }

    tipsList.innerHTML = recommendations.map(function (rec) {
      return [
        '<div class="w-tip-item">',
        '  <div class="w-tip-icon">',
        '    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
        '  </div>',
        '  <div class="w-tip-text">',
        '    <strong>' + rec.topic + '</strong>',
        '    <p>' + rec.tip + '</p>',
        '  </div>',
        '</div>'
      ].join('');
    }).join('');

    renderReviewList();
    renderHistoryList();

    var section = document.getElementById('weaknessAssessmentSection');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function updateComparisonBox(currentAttempt) {
    var box = document.getElementById('wComparisonBox');
    if (!box) return;

    if (!currentAttempt || currentAttempt.delta === null || currentAttempt.delta === undefined) {
      box.innerHTML = [
        '<div class="w-comp-wrap baseline">',
        '  <div class="w-comp-icon"><svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>',
        '  <div class="w-comp-text">',
        '    <span class="w-comp-delta neutral">Baseline Recorded</span>',
        '    <p>This is your first saved session for <strong>' + (currentAttempt ? currentAttempt.subjectName : 'this subject') + '</strong>. Subsequent daily quizzes will benchmark your score trends and diagnostic retention.</p>',
        '  </div>',
        '</div>'
      ].join('');
      return;
    }

    var delta = currentAttempt.delta;
    var improved = delta > 0;
    var regressed = delta < 0;
    var statusClass = improved ? 'improved' : regressed ? 'regressed' : 'neutral';
    var sign = delta > 0 ? '+' : '';

    box.innerHTML = [
      '<div class="w-comp-wrap ' + statusClass + '">',
      '  <div class="w-comp-icon">',
      improved ? '<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>' :
      regressed ? '<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/></svg>' :
      '<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/></svg>',
      '  </div>',
      '  <div class="w-comp-text">',
      '    <span class="w-comp-delta ' + statusClass + '">' + sign + delta + '% vs Previous Attempt</span>',
      '    <p>' + (improved ? 'Excellent progress! Your score improved by ' + delta + ' percentage points compared to your last attempt.' :
                   regressed ? 'Your score was ' + Math.abs(delta) + ' points lower than your previous session. Review the question explanations below to fix knowledge gaps.' :
                   'Your performance is steady at ' + currentAttempt.percentage + '%. Keep testing challenging topics to advance to the distinction band.') + '</p>',
      '  </div>',
      '</div>'
    ].join('');
  }

  function renderReviewList() {
    var listEl = document.getElementById('wReviewList');
    if (!listEl) return;

    var subjMeta = SUBJECTS[currentSession.subjectId] || { topics: {} };

    listEl.innerHTML = currentSession.questions.map(function (q, idx) {
      var ans = currentSession.userAnswers[q.id];
      var selectedIdx = ans ? ans.selectedIndex : undefined;
      var isCorrect = selectedIdx === q.correctIndex;
      var topicMeta = subjMeta.topics[q.topicId] || { name: 'General' };

      var userText = selectedIdx !== undefined ? (String.fromCharCode(65 + selectedIdx) + '. ' + q.options[selectedIdx]) : 'No answer selected';
      var correctText = String.fromCharCode(65 + q.correctIndex) + '. ' + q.options[q.correctIndex];

      return [
        '<div class="w-review-card ' + (isCorrect ? 'correct' : 'incorrect') + '">',
        '  <div class="w-review-card-head">',
        '    <span class="w-review-qnum">Question ' + (idx + 1) + ' &bull; ' + topicMeta.name + '</span>',
        '    <span class="w-verdict ' + (isCorrect ? 'correct' : 'incorrect') + '">',
               isCorrect ? '<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Correct' :
                           '<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg> Incorrect',
        '    </span>',
        '  </div>',
        '  <div class="w-review-question">' + q.question + '</div>',
        '  <div class="w-review-answer-row">',
        '    <div class="w-review-user-ans ' + (isCorrect ? 'green' : 'red') + '">Your Answer: <strong>' + userText + '</strong></div>',
        !isCorrect ? '    <div class="w-review-correct-ans">Correct Answer: <strong>' + correctText + '</strong></div>' : '',
        '  </div>',
        '  <div class="w-review-rationale"><strong>Explanation:</strong> ' + q.explanation + '</div>',
        '  <div class="w-concept-box" style="margin-top:.75rem;">',
        '    <span class="w-concept-label">Underlying Concept:</span>',
        '    <p class="w-concept-text">' + q.concept + '</p>',
        '  </div>',
        '</div>'
      ].join('');
    }).join('');
  }

  function renderHistoryList() {
    var listEl = document.getElementById('wHistoryList');
    if (!listEl) return;

    var history = getQuizHistory();
    if (history.length === 0) {
      listEl.innerHTML = '<div class="w-empty-note">No saved quiz attempts found on this browser.</div>';
      return;
    }

    listEl.innerHTML = history.slice(0, 10).map(function (h) {
      return [
        '<div class="w-history-item">',
        '  <div>',
        '    <div class="w-hist-title">' + (h.subjectName || h.subjectId) + ' (' + (h.difficulty ? h.difficulty.toUpperCase() : 'STANDARD') + ')</div>',
        '    <div class="w-hist-meta">' + h.dateFormatted + ' &bull; ' + (h.mode === 'weakness_practice' ? 'Weakness Practice' : 'Daily Quiz') + '</div>',
        '  </div>',
        '  <div class="w-hist-score">' + h.score + '/' + h.total + ' (' + h.percentage + '%)</div>',
        '</div>'
      ].join('');
    }).join('');
  }

  function renderHistoryPreview() {
    var previewEl = document.getElementById('wHistoryPreview');
    if (!previewEl) return;

    var history = getQuizHistory();
    if (history.length === 0) {
      previewEl.innerHTML = '';
      return;
    }

    var last = history[0];
    previewEl.innerHTML = [
      '<div class="w-notice-box" style="border-left-color: #0284c7;">',
      '  <span class="w-notice-title">Recent Quiz Activity:</span>',
      '  <p>Last attempt: <strong>' + (last.subjectName || last.subjectId) + '</strong> (' + (last.difficulty ? last.difficulty.toUpperCase() : 'STANDARD') + ') &bull; <strong>' + last.score + '/' + last.total + ' (' + last.percentage + '%)</strong> on ' + last.dateFormatted + '.</p>',
      '</div>'
    ].join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWeaknessUI);
  } else {
    initWeaknessUI();
  }

})();
"""

final_js = js_template.replace("__PROGRAMMES__", programmes_json)\
                       .replace("__SUBJECTS__", subjects_json)\
                       .replace("__QUESTIONS__", questions_json)

with open("icass-weakness.js", "w", encoding="utf-8") as f:
    f.write(final_js)

print("icass-weakness.js compiled successfully!")
