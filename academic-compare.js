/**
 * AfriWidget Educational Calculators — Simplified "Compare Your Results with a Friend"
 * Exact ICASS visual design & UX across 40 flagship educational tools.
 * Pure vanilla JavaScript & scoped CSS. Zero dependencies, zero emojis, zero Tailwind.
 */
(function () {
  'use strict';

  function injectCompareStyles() {
    if (document.getElementById('afriwidget-compare-styles')) return;

    var style = document.createElement('style');
    style.id = 'afriwidget-compare-styles';
    style.textContent = [
      '/* AfriWidget Compare Results — Clean Lightweight Styles (Exact ICASS Design) */',
      '.compare-workspace-wrap { margin-top: 1.5rem; margin-bottom: 2rem; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #111827; box-sizing: border-box; }',
      '.compare-workspace-wrap *, .compare-workspace-wrap *::before, .compare-workspace-wrap *::after { box-sizing: border-box; }',

      '/* Entry Banner Card inside #results */',
      '.compare-banner-card, .compare-entry-card { margin-top: 1.25rem; margin-bottom: 1.25rem; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.875rem; padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; box-sizing: border-box; text-align: left; }',
      '@media (min-width: 640px) { .compare-banner-card, .compare-entry-card { flex-direction: row; align-items: center; justify-content: space-between; padding: 1.25rem 1.75rem; gap: 1.5rem; } }',
      '.compare-banner-content, .compare-entry-content { flex: 1; min-width: 0; }',
      '.compare-banner-title, .compare-entry-title { font-size: 1.0625rem; font-weight: 700; color: #111827; letter-spacing: -0.01em; line-height: 1.3; margin: 0 0 0.25rem 0; }',
      '.compare-banner-desc, .compare-entry-desc { font-size: 0.875rem; color: #4b5563; line-height: 1.5; margin: 0; }',
      '.compare-banner-btn, .compare-entry-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; background: #ffffff; color: #111827; border: 1px solid #111827; font-weight: 700; font-size: 0.9375rem; border-radius: 0.5rem; padding: 0.75rem 1.375rem; min-height: 48px; cursor: pointer; white-space: nowrap; transition: background 0.15s ease, border-color 0.15s ease, transform 0.1s ease; flex-shrink: 0; font-family: inherit; }',
      '.compare-banner-btn:hover, .compare-entry-btn:hover { background: #f9fafb; border-color: #000000; }',
      '.compare-banner-btn:active, .compare-entry-btn:active { transform: scale(0.99); }',
      '.compare-banner-btn.active, .compare-entry-btn.active { background: #f9fafb; color: #111827; border-color: #eab308; }',
      '@media (max-width: 639px) { .compare-banner-btn, .compare-entry-btn { width: 100%; } }',

      '/* Main Comparison Card */',
      '.compare-card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.875rem; padding: 1.25rem; text-align: left; }',
      '@media (min-width: 640px) { .compare-card { padding: 1.75rem; } }',
      '.compare-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding-bottom: 1rem; margin-bottom: 1.25rem; border-bottom: 1px solid #f3f4f6; }',
      '.compare-title { font-size: 1.25rem; font-weight: 800; color: #111827; letter-spacing: -0.015em; line-height: 1.25; margin: 0; }',
      '@media (min-width: 640px) { .compare-title { font-size: 1.375rem; } }',
      '.compare-close-btn { width: 2.25rem; height: 2.25rem; display: inline-flex; align-items: center; justify-content: center; border-radius: 0.5rem; border: 1px solid #e5e7eb; background: #ffffff; color: #4b5563; font-size: 1.375rem; cursor: pointer; line-height: 1; transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease; flex-shrink: 0; }',
      '.compare-close-btn:hover { background: #f9fafb; color: #111827; border-color: #d1d5db; }',

      '/* Empty State */',
      '.compare-empty-state { text-align: center; padding: 2rem 1.25rem; }',
      '.compare-empty-title { font-size: 1.125rem; font-weight: 700; color: #111827; margin: 0 0 0.375rem 0; }',
      '.compare-empty-desc { font-size: 0.875rem; color: #4b5563; max-width: 440px; margin: 0 auto 1.25rem auto; line-height: 1.5; }',
      '.compare-empty-btn { max-width: 220px; margin: 0 auto; min-height: 44px; padding: 0.75rem 1.25rem; font-size: 0.9375rem; }',

      '/* Compact Friend Marks Setup */',
      '.compare-setup { padding-bottom: 1.25rem; margin-bottom: 1.25rem; border-bottom: 1px solid #f3f4f6; }',
      '.compare-setup-last { padding-bottom: 0; margin-bottom: 0; border-bottom: none; }',
      '.compare-names-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem; }',
      '@media (max-width: 479px) { .compare-names-grid { grid-template-columns: 1fr; } }',
      '.compare-field { display: flex; flex-direction: column; gap: 0.3rem; }',
      '.compare-label { font-size: 0.8125rem; font-weight: 600; color: #374151; }',
      '.compare-input { width: 100%; min-height: 42px; padding: 0.5rem 0.75rem; font-size: 16px; font-weight: 500; color: #111827; background: #ffffff; border: 1px solid #d1d5db; border-radius: 0.5rem; font-family: inherit; transition: border-color 0.15s ease, box-shadow 0.15s ease; }',
      '@media (min-width: 640px) { .compare-input { font-size: 0.875rem; } }',
      '.compare-input:focus { outline: none; border-color: #eab308; box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.2); }',

      '/* Segmented Controls (Entry Mode & Assessment Format) */',
      '.compare-toolbar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.625rem; margin-bottom: 0.875rem; }',
      '.compare-seg { display: inline-flex; background: #f3f4f6; padding: 0.2rem; border-radius: 0.5rem; gap: 0.2rem; max-width: 100%; flex-wrap: wrap; }',
      '.compare-seg-btn { padding: 0.4rem 0.75rem; font-size: 0.8125rem; font-weight: 600; color: #4b5563; background: transparent; border: none; border-radius: 0.375rem; cursor: pointer; white-space: nowrap; transition: background 0.15s ease, color 0.15s ease; font-family: inherit; min-height: 34px; }',
      '.compare-seg-btn:hover { color: #111827; }',
      '.compare-seg-btn.active { background: #ffffff; color: #111827; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06); }',

      '/* Friend Task Inputs Grid */',
      '.compare-tasks-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.625rem; margin-bottom: 1rem; }',
      '@media (min-width: 640px) { .compare-tasks-grid { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem; } }',
      '@media (max-width: 379px) { .compare-tasks-grid { grid-template-columns: 1fr; } }',
      '.compare-tasks-grid.compare-tasks-grid-wide { grid-template-columns: 1fr; }',
      '@media (min-width: 540px) { .compare-tasks-grid.compare-tasks-grid-wide { grid-template-columns: repeat(2, 1fr); } }',
      '.compare-task-field { display: flex; flex-direction: column; gap: 0.25rem; min-width: 0; }',
      '.compare-task-head { display: flex; align-items: baseline; justify-content: space-between; gap: 0.375rem; font-size: 0.75rem; line-height: 1.3; }',
      '.compare-task-name { font-weight: 600; color: #1f2937; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }',
      '.compare-task-wt { color: #6b7280; font-variant-numeric: tabular-nums; flex-shrink: 0; }',
      '.compare-unit-wrap { position: relative; display: flex; align-items: center; }',
      '.comp-friend-score-input { width: 100%; min-height: 42px; padding: 0.5rem 1.75rem 0.5rem 0.625rem; font-size: 16px; font-weight: 600; font-variant-numeric: tabular-nums; border: 1px solid #d1d5db; border-radius: 0.5rem; background: #ffffff; color: #111827; font-family: inherit; }',
      '.comp-friend-score-input.no-suffix { padding-right: 0.625rem; }',
      '.comp-friend-select { width: 100%; min-height: 42px; padding: 0.5rem 0.625rem; font-size: 16px; font-weight: 600; font-variant-numeric: tabular-nums; border: 1px solid #d1d5db; border-radius: 0.5rem; background: #ffffff; color: #111827; font-family: inherit; cursor: pointer; }',
      '@media (min-width: 640px) { .comp-friend-score-input, .comp-friend-select { font-size: 0.875rem; } }',
      '.comp-friend-score-input:focus, .comp-friend-select:focus { outline: none; border-color: #eab308; box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.2); }',
      '.compare-unit-suffix { position: absolute; right: 0.625rem; font-size: 0.75rem; font-weight: 600; color: #6b7280; pointer-events: none; }',
      '.compare-dual-wrap { display: grid; grid-template-columns: 1.25fr 0.85fr; gap: 0.375rem; align-items: center; }',

      '/* Buttons */',
      '.compare-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; }',
      '.comp-btn-primary { display: inline-flex; align-items: center; justify-content: center; padding: 0.625rem 1.125rem; min-height: 42px; background: #facc15; color: #111827; font-weight: 700; font-size: 0.875rem; border-radius: 0.5rem; border: 1px solid #eab308; cursor: pointer; white-space: nowrap; transition: background 0.15s ease; font-family: inherit; }',
      '.comp-btn-primary:hover { background: #fde047; }',
      '.comp-btn-secondary { display: inline-flex; align-items: center; justify-content: center; padding: 0.625rem 0.9375rem; min-height: 42px; background: #ffffff; color: #374151; font-weight: 600; font-size: 0.8125rem; border-radius: 0.5rem; border: 1px solid #e5e7eb; cursor: pointer; white-space: nowrap; transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease; font-family: inherit; }',
      '.comp-btn-secondary:hover { background: #f9fafb; border-color: #d1d5db; color: #111827; }',
      '.compare-feedback { font-size: 0.8125rem; font-weight: 500; color: #b91c1c; margin: 0.5rem 0 0 0; min-height: 0; }',
      '.compare-feedback.ok { color: #15803d; }',

      '/* Link Import Row */',
      '.compare-import-row { display: flex; flex-direction: column; gap: 0.5rem; }',
      '@media (min-width: 640px) { .compare-import-row { flex-direction: row; } }',
      '.compare-import-error { font-size: 0.8125rem; color: #b91c1c; margin-top: 0.5rem; }',

      '/* Results Stack */',
      '.compare-results-stack { display: flex; flex-direction: column; gap: 1rem; }',

      '/* 1 & 2. Overall Score Comparison + SVG Visual */',
      '.compare-summary-box { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1.125rem 1.25rem; }',
      '@media (min-width: 640px) { .compare-summary-box { padding: 1.375rem 1.5rem; } }',
      '.compare-verdict { font-size: 1rem; font-weight: 700; color: #111827; line-height: 1.4; margin: 0 0 1rem 0; }',
      '.compare-verdict-pts { color: #a16207; font-variant-numeric: tabular-nums; }',
      '.compare-scores-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.875rem; padding-bottom: 1.125rem; margin-bottom: 1rem; border-bottom: 1px solid #f3f4f6; }',
      '@media (max-width: 379px) { .compare-scores-row { grid-template-columns: 1fr; } }',
      '.compare-score-col { display: flex; flex-direction: column; gap: 0.2rem; min-width: 0; }',
      '.compare-score-person { font-size: 0.8125rem; font-weight: 600; color: #4b5563; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }',
      '.compare-score-val { font-size: 1.875rem; font-weight: 800; color: #111827; line-height: 1.1; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }',
      '@media (min-width: 640px) { .compare-score-val { font-size: 2.125rem; } }',
      '.compare-score-meta { font-size: 0.75rem; color: #6b7280; line-height: 1.4; }',
      '.compare-svg-wrap { width: 100%; overflow: hidden; }',
      '.compare-svg { width: 100%; height: 120px; display: block; overflow: visible; }',

      '/* 3. Personalized Value Tip */',
      '.compare-tip-box { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1.125rem 1.25rem; }',
      '@media (min-width: 640px) { .compare-tip-box { padding: 1.25rem 1.5rem; } }',
      '.compare-tip-kicker { display: block; font-size: 0.75rem; font-weight: 700; color: #a16207; margin: 0 0 0.35rem 0; }',
      '.compare-tip-text { font-size: 0.9375rem; color: #1f2937; line-height: 1.55; margin: 0; font-variant-numeric: tabular-nums; }',
      '.compare-tip-text strong { color: #111827; font-weight: 700; }',

      '/* 4. Simplified What-If Simulator */',
      '.compare-sim-box { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1.125rem 1.25rem; }',
      '@media (min-width: 640px) { .compare-sim-box { padding: 1.25rem 1.5rem; } }',
      '.compare-sim-head { display: flex; align-items: baseline; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.875rem; }',
      '.compare-sim-title { font-size: 0.9375rem; font-weight: 700; color: #111827; margin: 0; }',
      '.compare-sim-controls { display: grid; grid-template-columns: 1fr; gap: 0.875rem; margin-bottom: 1rem; }',
      '@media (min-width: 640px) { .compare-sim-controls { grid-template-columns: 1.15fr 1fr; align-items: end; } }',
      '.compare-sim-slider-head { display: flex; justify-content: space-between; align-items: baseline; gap: 0.5rem; }',
      '.compare-sim-val { font-size: 0.875rem; font-weight: 700; color: #111827; font-variant-numeric: tabular-nums; }',
      '.compare-sim-range { width: 100%; height: 36px; margin: 0; accent-color: #eab308; cursor: pointer; background: transparent; }',
      '.compare-sim-readout { background: #fafafa; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 0.875rem 1rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }',
      '@media (min-width: 640px) { .compare-sim-readout { grid-template-columns: 1fr 1fr 1.2fr; } }',
      '.sim-stat { display: flex; flex-direction: column; gap: 0.15rem; min-width: 0; }',
      '.sim-stat-full { grid-column: 1 / -1; }',
      '@media (min-width: 640px) { .sim-stat-full { grid-column: auto; } }',
      '.sim-stat-label { font-size: 0.75rem; color: #6b7280; font-weight: 500; }',
      '.sim-stat-val { font-size: 1.125rem; font-weight: 800; color: #111827; line-height: 1.25; font-variant-numeric: tabular-nums; }',
      '.sim-stat-val.pos { color: #15803d; }',
      '.sim-stat-val.neg { color: #b91c1c; }',
      '.sim-stat-standing { font-size: 0.875rem; font-weight: 700; color: #1f2937; line-height: 1.35; font-variant-numeric: tabular-nums; }'
    ].join('\n');

    document.head.appendChild(style);
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function truncateLabel(str, maxLen) {
    var clean = String(str || '').trim();
    if (clean.length <= maxLen) return clean;
    return clean.slice(0, maxLen - 1) + '...';
  }

  function clampNum(val, min, max) {
    return Math.min(max, Math.max(min, val));
  }

  function isResultsVisible() {
    var r = document.getElementById('results');
    return !!(r && r.classList.contains('visible'));
  }

  function detectToolSlug() {
    var path = (window.location.pathname || '').replace(/\/+$/, '').replace(/^\//, '').replace(/\.html$/i, '');
    if (ADAPTERS[path]) return path;
    // Fallback DOM signature detection
    if (document.getElementById('apsForm') && document.getElementById('apsValue')) return 'south-african-aps-calculator';
    if (document.getElementById('natedForm') && document.getElementById('finalScore')) return 'south-african-tvet-nated-calculator';
    if (document.getElementById('matricForm') && document.getElementById('passLevelBig')) return 'matric-sba-exam-calculator';
    if (document.getElementById('wassceForm') && document.getElementById('aggregateValue')) return 'wassce-aggregate-calculator';
    if (document.getElementById('beceForm') && document.getElementById('aggregateValue')) return 'bece-aggregate-calculator';
    if (document.getElementById('kuccpsForm') && document.getElementById('wcpValue')) return 'kuccps-cluster-points-calculator';
    if (document.getElementById('kcseForm') && document.getElementById('meanGradeValue')) return 'kcse-grade-calculator';
    if (document.getElementById('jambForm') && document.getElementById('totalBig')) return 'jamb-score-calculator';
    if (document.getElementById('jambForm') && document.getElementById('olevelValue')) return 'jamb-utme-aggregate-calculator';
    if (document.getElementById('courseList') && document.getElementById('gpaValue')) return 'gpa-calculator';
    if (document.getElementById('gpaForm') && document.getElementById('scaleSelect') && document.getElementById('semesterGpa')) return 'tertiary-gpa-cgpa-calculator';
    if (document.getElementById('waecForm') && document.getElementById('subjectRowsContainer')) return 'waec-grade-calculator';
    if (document.getElementById('cgpaForm') && document.getElementById('gradingScale')) return 'nigerian-university-cgpa-calculator';
    if (document.getElementById('putmeForm') && document.getElementById('modelSelect')) return 'post-utme-aggregate-calculator';
    if (document.getElementById('ncvForm') && document.getElementById('vocAggregate')) return 'tvet-ncv-pass-calculator';
    if (document.getElementById('gpaForm') && document.getElementById('systemSelect')) return 'ghana-university-gpa-calculator';
    if (document.getElementById('qualList') && document.getElementById('totalPoints')) return 'ucas-points-calculator';
    if (document.getElementById('uaceForm') && document.getElementById('rawScore')) return 'uace-points-calculator';
    if (document.getElementById('alevelForm') && document.getElementById('pointsOut')) return 'zimsec-alevel-points-calculator';
    if (document.getElementById('saForm') && document.getElementById('saInstitution')) return 'south-african-university-admission-calculator';
    if (document.getElementById('olevelForm') && document.getElementById('best5Out')) return 'zimsec-olevel-points-calculator';
    if (document.getElementById('eczForm') && document.getElementById('best6Value')) return 'zambia-grade-12-points-calculator';
    if (document.getElementById('pleForm') && document.getElementById('aggBig')) return 'ple-aggregate-calculator';
    if (document.getElementById('uceForm') && document.getElementById('aggregateScore')) return 'uce-grade-calculator';
    if (document.getElementById('formFourForm') && document.getElementById('divisionBig')) return 'form-four-gpa-calculator';
    if (document.getElementById('acseeForm') && document.getElementById('nectaPointsValue')) return 'acsee-points-calculator';
    if (document.getElementById('gpaForm') && document.getElementById('gradingSystem') && document.getElementById('gpaHeadline')) return 'kenya-university-gpa-calculator';
    if (document.getElementById('gpaForm') && document.getElementById('tanzanianCourseCodes')) return 'tanzania-university-gpa-calculator';
    if (document.getElementById('gpaForm') && document.getElementById('coursesContainer2') && document.getElementById('tabCgpa')) return 'uganda-university-cgpa-calculator';
    if (document.getElementById('ghForm') && document.getElementById('ghProgram')) return 'ghana-nursing-training-admission-calculator';
    if (document.getElementById('gpaForm') && document.getElementById('gradingScale') && document.getElementById('statHonours')) return 'zimbabwe-university-gpa-calculator';
    if (document.getElementById('gpaForm') && document.getElementById('gpaScale') && document.getElementById('semesterGpaValue')) return 'zambia-university-gpa-calculator';
    if (document.getElementById('uniForm') && document.getElementById('targetUniversity') && document.getElementById('targetFaculty')) return 'zimbabwe-university-entry-points-calculator';
    if (document.getElementById('zmForm') && document.getElementById('zmInstitution') && document.getElementById('best5Value')) return 'zambia-university-admission-calculator';
    if (document.getElementById('tzForm') && document.getElementById('tcuValue')) return 'tanzania-university-admission-calculator';
    if (document.getElementById('kcpeForm') && document.getElementById('totalValue') && document.getElementById('tierValue')) return 'kcpe-performance-calculator';
    if (document.getElementById('estForm') && document.getElementById('chanceValue') && document.getElementById('statAggregate')) return 'bece-cssps-placement-estimator';
    if (document.getElementById('portfolioForm') && document.getElementById('ukGcseSubjects')) return 'uk-gcse-grade-calculator';
    if (document.getElementById('degreeForm') && document.getElementById('weightingModelSelect') && document.getElementById('y2ModulesContainer')) return 'uk-degree-classification-calculator';
    return '';
  }

  /* =========================================================================
   * SHARED GRADING TABLES & CURRICULUM HELPERS
   * ========================================================================= */

  function apsLevelFromPct(pct) {
    if (!isFinite(pct) || pct < 0) return 0;
    if (pct >= 80) return 7;
    if (pct >= 70) return 6;
    if (pct >= 60) return 5;
    if (pct >= 50) return 4;
    if (pct >= 40) return 3;
    if (pct >= 30) return 2;
    return 0;
  }

  function matricLevelFromPct(pct) {
    if (!isFinite(pct) || pct < 0) return 1;
    if (pct >= 80) return 7;
    if (pct >= 70) return 6;
    if (pct >= 60) return 5;
    if (pct >= 50) return 4;
    if (pct >= 40) return 3;
    if (pct >= 30) return 2;
    return 1;
  }

  function matricPassLevel(subjects) {
    var academic = subjects.filter(function (s) { return !s.isLO; });
    var hl = subjects[0];
    var hlOK = hl && isFinite(hl.final) && hl.final >= 40;
    var p50Ac = academic.filter(function (s) { return s.final >= 50; }).length;
    var p40Ac = academic.filter(function (s) { return s.final >= 40; }).length;
    var p40All = subjects.filter(function (s) { return s.final >= 40; }).length;
    var p30All = subjects.filter(function (s) { return s.final >= 30; }).length;
    var p20All = subjects.filter(function (s) { return s.final >= 20; }).length;

    if (hlOK && p50Ac >= 4 && p30All >= 6) return "Bachelor's Pass";
    if (hlOK && p40Ac >= 4 && p30All >= 6) return 'Diploma Pass';
    if (hlOK && p40All >= 2 && p30All >= 5) return 'Higher Certificate Pass';
    if (p40All >= 3 && p30All >= 5 && p20All >= 6) return 'NSC Pass';
    return 'Not yet qualified';
  }

  function matricComputeAPS(subjects) {
    var academic = subjects.filter(function (s) { return !s.isLO; }).slice(0, 6);
    var sum = 0;
    for (var i = 0; i < academic.length; i++) {
      sum += matricLevelFromPct(academic[i].final);
    }
    return sum;
  }

  var WASSCE_GRADES = [
    { grade: 'A1', pts: 1 },
    { grade: 'B2', pts: 2 },
    { grade: 'B3', pts: 3 },
    { grade: 'C4', pts: 4 },
    { grade: 'C5', pts: 5 },
    { grade: 'C6', pts: 6 },
    { grade: 'D7', pts: 7 },
    { grade: 'E8', pts: 8 },
    { grade: 'F9', pts: 9 }
  ];
  var WASSCE_PTS = { A1: 1, B2: 2, B3: 3, C4: 4, C5: 5, C6: 6, D7: 7, E8: 8, F9: 9 };
  var WASSCE_SLIDER_ORDER = ['F9', 'E8', 'D7', 'C6', 'C5', 'C4', 'B3', 'B2', 'A1'];

  function wassceBand(agg) {
    if (agg <= 9) return 'Top tier';
    if (agg <= 13) return 'Very strong';
    if (agg <= 17) return 'Solid';
    if (agg <= 22) return 'Workable';
    return 'Below most cut-offs';
  }

  function beceBand(agg) {
    if (agg <= 9) return 'Top tier (Cat A)';
    if (agg <= 14) return 'Very strong (Cat A/B)';
    if (agg <= 19) return 'Solid (Cat B/C)';
    if (agg <= 25) return 'Workable';
    if (agg <= 30) return 'Day / TVET range';
    return 'Limited placement range';
  }

  var KCSE_GRADES = [
    { pts: 12, label: 'A (12)' },
    { pts: 11, label: 'A- (11)' },
    { pts: 10, label: 'B+ (10)' },
    { pts: 9, label: 'B (9)' },
    { pts: 8, label: 'B- (8)' },
    { pts: 7, label: 'C+ (7)' },
    { pts: 6, label: 'C (6)' },
    { pts: 5, label: 'C- (5)' },
    { pts: 4, label: 'D+ (4)' },
    { pts: 3, label: 'D (3)' },
    { pts: 2, label: 'D- (2)' },
    { pts: 1, label: 'E (1)' }
  ];
  var KCSE_PT_TO_LETTER = { 12: 'A', 11: 'A-', 10: 'B+', 9: 'B', 8: 'B-', 7: 'C+', 6: 'C', 5: 'C-', 4: 'D+', 3: 'D', 2: 'D-', 1: 'E' };

  function kcseMeanLetter(points) {
    if (points >= 81) return 'A';
    if (points >= 74) return 'A-';
    if (points >= 67) return 'B+';
    if (points >= 60) return 'B';
    if (points >= 53) return 'B-';
    if (points >= 46) return 'C+';
    if (points >= 39) return 'C';
    if (points >= 32) return 'C-';
    if (points >= 25) return 'D+';
    if (points >= 18) return 'D';
    if (points >= 11) return 'D-';
    return 'E';
  }

  var OLEVEL_JAMB_GRADES = [
    { grade: 'A1', pts: 4.0 },
    { grade: 'B2', pts: 3.6 },
    { grade: 'B3', pts: 3.2 },
    { grade: 'C4', pts: 2.8 },
    { grade: 'C5', pts: 2.4 },
    { grade: 'C6', pts: 2.0 }
  ];
  var OLEVEL_JAMB_PTS = { A1: 4.0, B2: 3.6, B3: 3.2, C4: 2.8, C5: 2.4, C6: 2.0 };
  var OLEVEL_SLIDER_ORDER = ['C6', 'C5', 'C4', 'B3', 'B2', 'A1'];

  var GPA_GRADES = [
    { grade: 'A', pts: 4.0 },
    { grade: 'A-', pts: 3.7 },
    { grade: 'B+', pts: 3.3 },
    { grade: 'B', pts: 3.0 },
    { grade: 'B-', pts: 2.7 },
    { grade: 'C+', pts: 2.3 },
    { grade: 'C', pts: 2.0 },
    { grade: 'C-', pts: 1.7 },
    { grade: 'D+', pts: 1.3 },
    { grade: 'D', pts: 1.0 },
    { grade: 'D-', pts: 0.7 },
    { grade: 'F', pts: 0.0 }
  ];
  var GPA_PTS = { 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'D-': 0.7, 'F': 0.0 };
  var GPA_SLIDER_ORDER = ['F', 'D-', 'D', 'D+', 'C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A'];

  function gpaStandingLabel(gpa) {
    if (gpa >= 3.9) return 'Summa cum laude range';
    if (gpa >= 3.7) return "Dean's list range";
    if (gpa >= 3.5) return 'High honours range';
    if (gpa >= 3.0) return 'Good standing';
    if (gpa >= 2.0) return 'Satisfactory';
    return 'Below 2.00 standing';
  }

  var TERTIARY_P5 = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
  var TERTIARY_P4 = { A: 4, B: 3, C: 2, D: 1, F: 0 };
  var TERTIARY_ORDER_5 = ['F', 'E', 'D', 'C', 'B', 'A'];
  var TERTIARY_ORDER_4 = ['F', 'D', 'C', 'B', 'A'];

  function tertiaryClassify(scaleVal, gpa) {
    if (scaleVal === '5') {
      if (gpa >= 4.5) return 'First Class';
      if (gpa >= 3.5) return 'Second Class Upper';
      if (gpa >= 2.4) return 'Second Class Lower';
      if (gpa >= 1.5) return 'Third Class';
      if (gpa >= 1.0) return 'Pass';
      return 'Below Pass';
    }
    if (gpa >= 3.6) return 'First Class';
    if (gpa >= 3.0) return 'Second Class Upper';
    if (gpa >= 2.0) return 'Second Class Lower';
    if (gpa >= 1.5) return 'Third Class';
    if (gpa >= 1.0) return 'Pass';
    return 'Below Pass';
  }

  var NUC_POINTS_5 = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
  var NBTE_POINTS_4 = { A: 4, AB: 3.5, B: 3, BC: 2.5, C: 2, F: 0 };
  var NBTE_ORDER_4 = ['F', 'C', 'BC', 'B', 'AB', 'A'];

  function nucClassify(scaleVal, cgpa) {
    if (scaleVal === '4.0') {
      if (cgpa >= 3.5) return 'Distinction';
      if (cgpa >= 3.0) return 'Upper Credit';
      if (cgpa >= 2.5) return 'Lower Credit';
      if (cgpa >= 2.0) return 'Pass';
      return 'Probation Range';
    }
    if (cgpa >= 4.5) return 'First Class Honours';
    if (cgpa >= 3.5) return 'Second Class Upper';
    if (cgpa >= 2.4) return 'Second Class Lower';
    if (cgpa >= 1.5) return 'Third Class';
    if (cgpa >= 1.0) return 'Pass Degree';
    return 'Probation Range';
  }

  function waecGradeFromMark(mark) {
    if (mark >= 75) return { grade: 'A1', type: 'distinction', pts: 4.0 };
    if (mark >= 70) return { grade: 'B2', type: 'distinction', pts: 3.6 };
    if (mark >= 65) return { grade: 'B3', type: 'distinction', pts: 3.2 };
    if (mark >= 60) return { grade: 'C4', type: 'credit', pts: 2.8 };
    if (mark >= 55) return { grade: 'C5', type: 'credit', pts: 2.4 };
    if (mark >= 50) return { grade: 'C6', type: 'credit', pts: 2.0 };
    if (mark >= 45) return { grade: 'D7', type: 'pass', pts: 1.0 };
    if (mark >= 40) return { grade: 'E8', type: 'pass', pts: 0.5 };
    return { grade: 'F9', type: 'fail', pts: 0.0 };
  }

  var OLEVEL_PUTME_10 = { A1: 10, B2: 9, B3: 8, C4: 7, C5: 6, C6: 5 };

  var GHANA_GPA_PTS = { 'A': 4.0, 'B+': 3.5, 'B': 3.0, 'C+': 2.5, 'C': 2.0, 'D+': 1.5, 'D': 1.0, 'E': 0.5, 'F': 0.0 };
  var GHANA_GPA_ORDER = ['F', 'E', 'D', 'D+', 'C', 'C+', 'B', 'B+', 'A'];

  function ghanaClassify(mode, score) {
    if (mode === 'cwa') {
      if (score >= 70) return 'First Class (CWA)';
      if (score >= 60) return 'Second Class Upper (CWA)';
      if (score >= 50) return 'Second Class Lower (CWA)';
      if (score >= 45) return 'Third Class (CWA)';
      if (score >= 40) return 'Pass (CWA)';
      return 'Below Pass';
    }
    if (score >= 3.6) return 'First Class';
    if (score >= 3.0) return 'Second Class Upper';
    if (score >= 2.0) return 'Second Class Lower';
    if (score >= 1.5) return 'Third Class';
    if (score >= 1.0) return 'Pass';
    return 'Below Pass';
  }

  var UCAS_TARIFF = {
    alevel: { name: 'A-Level', grades: { 'A*': 56, 'A': 48, 'B': 40, 'C': 32, 'D': 24, 'E': 16 } },
    aslevel: { name: 'AS-Level', grades: { 'A': 20, 'B': 16, 'C': 12, 'D': 10, 'E': 6 } },
    epq: { name: 'EPQ', grades: { 'A*': 28, 'A': 24, 'B': 20, 'C': 16, 'D': 12, 'E': 8 } },
    core_maths: { name: 'Core Maths', grades: { 'A': 20, 'B': 16, 'C': 12, 'D': 10, 'E': 6 } },
    tlevel: { name: 'T-Level', grades: { 'Distinction*': 168, 'Distinction': 144, 'Merit': 120, 'Pass (C+)': 96, 'Pass (D/E)': 72 } },
    btec_ext_dip: { name: 'BTEC Extended Diploma', grades: { 'D*D*D*': 168, 'D*D*D': 160, 'D*DD': 152, 'DDD': 144, 'DDM': 128, 'DMM': 112, 'MMM': 96, 'MMP': 80, 'MPP': 64, 'PPP': 48 } },
    btec_dip: { name: 'BTEC Diploma', grades: { 'D*D*': 112, 'D*D': 104, 'DD': 96, 'DM': 80, 'MM': 64, 'MP': 48, 'PP': 32 } },
    btec_ext_cert: { name: 'BTEC Extended Certificate', grades: { 'D*': 56, 'D': 48, 'M': 32, 'P': 16 } },
    ib_hl: { name: 'IB Higher Level', grades: { 'Grade 7': 56, 'Grade 6': 48, 'Grade 5': 32, 'Grade 4': 24, 'Grade 3': 12 } },
    ib_sl: { name: 'IB Standard Level', grades: { 'Grade 7': 28, 'Grade 6': 24, 'Grade 5': 16, 'Grade 4': 12, 'Grade 3': 6 } },
    ib_core: { name: 'IB TOK/EE', grades: { 'A': 12, 'B': 10, 'C': 8, 'D': 6 } },
    scottish_adv: { name: 'Scottish Advanced Higher', grades: { 'A': 56, 'B': 48, 'C': 40, 'D': 32 } },
    scottish_higher: { name: 'Scottish Higher', grades: { 'A': 33, 'B': 27, 'C': 21, 'D': 15 } }
  };

  function ucasTierLabel(total) {
    if (total >= 152) return 'Russell Group (Top Tier)';
    if (total >= 120) return 'Selective Research Range';
    if (total >= 96) return 'Mid-Tier University Range';
    if (total >= 64) return 'Modern / Foundation Range';
    return 'Access / Foundation Entry';
  }

  var UACE_PRINCIPAL_GRADES = [
    { pts: 6, letter: 'A', label: 'A (6 pts)' },
    { pts: 5, letter: 'B', label: 'B (5 pts)' },
    { pts: 4, letter: 'C', label: 'C (4 pts)' },
    { pts: 3, letter: 'D', label: 'D (3 pts)' },
    { pts: 2, letter: 'E', label: 'E (2 pts)' },
    { pts: 1, letter: 'O', label: 'O (1 pt)' },
    { pts: 0, letter: 'F', label: 'F (0 pts)' }
  ];
  var UACE_PT_LETTER = { 6: 'A', 5: 'B', 4: 'C', 3: 'D', 2: 'E', 1: 'O', 0: 'F' };

  var ZIMSEC_PTS = { A: 5, B: 4, C: 3, D: 2, E: 1, O: 0, F: 0 };
  var ZIMSEC_ORDER = ['F', 'O', 'E', 'D', 'C', 'B', 'A'];
  var ZIMSEC_GRADES = [
    { grade: 'A', pts: 5, label: 'A (5 pts)' },
    { grade: 'B', pts: 4, label: 'B (4 pts)' },
    { grade: 'C', pts: 3, label: 'C (3 pts)' },
    { grade: 'D', pts: 2, label: 'D (2 pts)' },
    { grade: 'E', pts: 1, label: 'E (1 pt)' },
    { grade: 'O', pts: 0, label: 'O (0 pts)' },
    { grade: 'F', pts: 0, label: 'F (0 pts)' }
  ];

  var SA_ADM_LO_RULES = {
    generic: 'exclude', uct: 'exclude', wits: 'reduced', up: 'exclude', su: 'exclude',
    uj: 'reduced', ukzn: 'reduced', nwu: 'exclude', unisa: 'include', uot: 'exclude'
  };

  function saAdmLevelFromMark(m) {
    if (!isFinite(m) || m < 20) return 0;
    if (m >= 80) return 7;
    if (m >= 70) return 6;
    if (m >= 60) return 5;
    if (m >= 50) return 4;
    if (m >= 40) return 3;
    if (m >= 30) return 2;
    return 1;
  }

  function saAdmComputeAps(academicSubjects, loMark, loRule) {
    if (!academicSubjects || academicSubjects.length < 6) return null;
    var sorted = academicSubjects.slice().sort(function (a, b) { return b.mark - a.mark; });
    var topSix = sorted.slice(0, 6);
    var apsBase = 0;
    for (var i = 0; i < topSix.length; i++) {
      apsBase += saAdmLevelFromMark(topSix[i].mark);
    }
    var loPts = 0;
    if (loMark !== null && isFinite(loMark)) {
      var loLvl = saAdmLevelFromMark(loMark);
      if (loRule === 'reduced') {
        loPts = loLvl >= 5 ? Math.min(4, loLvl - 2) : 0;
      } else if (loRule === 'include') {
        loPts = loLvl;
      }
    }
    var engSub = academicSubjects[0];
    var engMark = engSub ? engSub.mark : 0;
    var four50 = academicSubjects.filter(function (s) { return s.mark >= 50; }).length;
    var four40 = academicSubjects.filter(function (s) { return s.mark >= 40; }).length;
    var pass = 'Below NSC Pass';
    if (engMark >= 40 && four50 >= 4) pass = "Bachelor's Pass";
    else if (engMark >= 40 && four40 >= 4) pass = 'Diploma Pass';
    else if (engMark >= 40) pass = 'Higher Certificate Pass';
    return {
      aps: apsBase + loPts,
      maxAps: loRule === 'include' ? 49 : 42,
      pass: pass,
      topSix: topSix
    };
  }

  var ZIMSEC_OL_PTS = { A: 5, B: 4, C: 3, D: 2, E: 1, U: 0 };
  var ZIMSEC_OL_ORDER = ['U', 'E', 'D', 'C', 'B', 'A'];

  var ECZ_GRADES = [
    { value: '1', pts: 1, label: '1 - Distinction (1 pt)' },
    { value: '2', pts: 2, label: '2 - Distinction (2 pts)' },
    { value: '3', pts: 3, label: '3 - Merit (3 pts)' },
    { value: '4', pts: 4, label: '4 - Merit (4 pts)' },
    { value: '5', pts: 5, label: '5 - Credit (5 pts)' },
    { value: '6', pts: 6, label: '6 - Credit (6 pts)' },
    { value: '7', pts: 7, label: '7 - Satisfactory (7 pts)' },
    { value: '8', pts: 8, label: '8 - Satisfactory (8 pts)' },
    { value: '9', pts: 9, label: '9 - Unsatisfactory (9 pts)' }
  ];
  var ECZ_SLIDER_ORDER = [9, 8, 7, 6, 5, 4, 3, 2, 1];

  var UNEB_GRADES = [
    { value: '1', code: 'D1', pts: 1, label: 'D1 (1 pt)' },
    { value: '2', code: 'D2', pts: 2, label: 'D2 (2 pts)' },
    { value: '3', code: 'C3', pts: 3, label: 'C3 (3 pts)' },
    { value: '4', code: 'C4', pts: 4, label: 'C4 (4 pts)' },
    { value: '5', code: 'C5', pts: 5, label: 'C5 (5 pts)' },
    { value: '6', code: 'C6', pts: 6, label: 'C6 (6 pts)' },
    { value: '7', code: 'P7', pts: 7, label: 'P7 (7 pts)' },
    { value: '8', code: 'P8', pts: 8, label: 'P8 (8 pts)' },
    { value: '9', code: 'F9', pts: 9, label: 'F9 (9 pts)' }
  ];
  var UNEB_CODE_MAP = { 1: 'D1', 2: 'D2', 3: 'C3', 4: 'C4', 5: 'C5', 6: 'C6', 7: 'P7', 8: 'P8', 9: 'F9' };
  var UNEB_SLIDER_ORDER = [9, 8, 7, 6, 5, 4, 3, 2, 1];

  function unebPleDivision(total, grades) {
    var eng = grades[0];
    var math = grades[1];
    var fails = grades.filter(function (g) { return g === 9; }).length;
    if (total >= 4 && total <= 12 && eng !== 9 && math !== 9 && fails === 0) return 'Division 1';
    if (total <= 22) return 'Division 2';
    if (total <= 28) return 'Division 3';
    if (total <= 34) return 'Division 4';
    return 'Division U';
  }

  function unebUceDivision(agg, eng, math, counted) {
    var creditOrBetter = counted.filter(function (r) { return r.pts <= 6; }).length;
    var hasSciCredit = counted.some(function (r) { return r.isSci && r.pts <= 6; });
    var engPass = eng <= 8;
    var mathPass = math <= 8;
    if (agg <= 32 && engPass && mathPass && hasSciCredit && creditOrBetter >= 7) return 'Division 1';
    if (agg <= 45) return 'Division 2';
    if (agg <= 58) return 'Division 3';
    if (agg <= 68) return 'Division 4';
    return 'Ungraded';
  }

  var NECTA_CSEE_PTS = { A: 1, B: 2, C: 3, D: 4, F: 5 };
  var NECTA_CSEE_SLIDER = ['F', 'D', 'C', 'B', 'A'];

  function nectaCseeDivision(points, subjects) {
    var credits = subjects.filter(function (s) { return s.grade === 'A' || s.grade === 'B' || s.grade === 'C'; }).length;
    var passes = subjects.filter(function (s) { return s.grade !== 'F'; }).length;
    if (points <= 17 && credits >= 3) return 'Division I';
    if (points <= 21 && credits >= 2) return 'Division II';
    if (points <= 25 && passes >= 3) return 'Division III';
    if (points <= 33 && (passes >= 2 || credits >= 1)) return 'Division IV';
    return 'Division 0';
  }

  var NECTA_ACSEE_PTS = { A: 1, B: 2, C: 3, D: 4, E: 5, S: 6, F: 7 };
  var TCU_ACSEE_PTS = { A: 5, B: 4, C: 3, D: 2, E: 1, S: 0.5, F: 0 };
  var NECTA_ACSEE_SLIDER = ['F', 'S', 'E', 'D', 'C', 'B', 'A'];

  function nectaAcseeDivision(total, grades) {
    var prinPasses = grades.filter(function (g) {
      return g === 'A' || g === 'B' || g === 'C' || g === 'D' || g === 'E';
    }).length;
    if (total <= 9 && prinPasses >= 2) return 'Division I';
    if (total <= 12 && prinPasses >= 2) return 'Division II';
    if (total <= 17 && prinPasses >= 1) return 'Division III';
    if (total <= 19) return 'Division IV';
    return 'Division 0';
  }

  var KENYA_PUBLIC_GRADES = [
    { value: '4.0', code: 'A', pts: 4.0, label: 'A (4.0)' },
    { value: '3.0', code: 'B', pts: 3.0, label: 'B (3.0)' },
    { value: '2.0', code: 'C', pts: 2.0, label: 'C (2.0)' },
    { value: '1.0', code: 'D', pts: 1.0, label: 'D (1.0)' },
    { value: '0.0', code: 'E/F', pts: 0.0, label: 'E/F (0.0)' }
  ];
  var KENYA_PRIVATE_GRADES = [
    { value: '4.0', code: 'A', pts: 4.0, label: 'A (4.00)' },
    { value: '3.7', code: 'A-', pts: 3.7, label: 'A- (3.70)' },
    { value: '3.3', code: 'B+', pts: 3.3, label: 'B+ (3.30)' },
    { value: '3.0', code: 'B', pts: 3.0, label: 'B (3.00)' },
    { value: '2.7', code: 'B-', pts: 2.7, label: 'B- (2.70)' },
    { value: '2.3', code: 'C+', pts: 2.3, label: 'C+ (2.30)' },
    { value: '2.0', code: 'C', pts: 2.0, label: 'C (2.00)' },
    { value: '1.7', code: 'C-', pts: 1.7, label: 'C- (1.70)' },
    { value: '1.3', code: 'D+', pts: 1.3, label: 'D+ (1.30)' },
    { value: '1.0', code: 'D', pts: 1.0, label: 'D (1.00)' },
    { value: '0.0', code: 'F', pts: 0.0, label: 'F (0.00)' }
  ];

  function kenyaHonoursBand(val, isWam) {
    if (isWam) {
      if (val >= 70) return 'First Class Honours';
      if (val >= 60) return 'Second Class Upper';
      if (val >= 50) return 'Second Class Lower';
      if (val >= 40) return 'Pass Degree';
      return 'Below Pass (< 40%)';
    }
    if (val >= 3.70) return 'First Class Honours';
    if (val >= 3.00) return 'Second Class Upper';
    if (val >= 2.00) return 'Second Class Lower';
    if (val >= 1.00) return 'Pass Degree';
    return 'Below Pass (< 1.00)';
  }

  var UGANDA_NCHE_GRADES = [
    { value: '5.0', code: 'A', pts: 5.0, label: 'A (5.0)' },
    { value: '4.5', code: 'B+', pts: 4.5, label: 'B+ (4.5)' },
    { value: '4.0', code: 'B', pts: 4.0, label: 'B (4.0)' },
    { value: '3.5', code: 'C+', pts: 3.5, label: 'C+ (3.5)' },
    { value: '3.0', code: 'C', pts: 3.0, label: 'C (3.0)' },
    { value: '2.5', code: 'D+', pts: 2.5, label: 'D+ (2.5)' },
    { value: '2.0', code: 'D', pts: 2.0, label: 'D (2.0)' },
    { value: '1.5', code: 'E', pts: 1.5, label: 'E (1.5)' },
    { value: '0.0', code: 'F', pts: 0.0, label: 'F (0.0)' }
  ];

  function ugandaNcheBand(gpa) {
    if (gpa >= 4.40) return 'First Class Honours';
    if (gpa >= 3.60) return 'Second Class Upper';
    if (gpa >= 2.80) return 'Second Class Lower';
    if (gpa >= 2.00) return 'Pass Degree';
    return 'Probationary (< 2.00)';
  }

  var GH_NURSING_PROGS = {
    rgn: { label: 'RGN Diploma', tier: 'diploma', threshold: 24 },
    rm: { label: 'Midwifery Diploma', tier: 'diploma', threshold: 24 },
    chn: { label: 'CHN Diploma', tier: 'diploma', threshold: 24 },
    rmn: { label: 'RMN Diploma', tier: 'diploma', threshold: 24 },
    nac: { label: 'NAC Certificate', tier: 'certificate', threshold: 36 },
    nap: { label: 'NAP Certificate', tier: 'certificate', threshold: 36 },
    degree: { label: 'B.Sc Nursing', tier: 'degree', threshold: 20 }
  };
  var GH_NURSING_CODE = { 1: 'A1', 2: 'B2', 3: 'B3', 4: 'C4', 5: 'C5', 6: 'C6', 7: 'D7', 8: 'E8', 9: 'F9' };
  var GH_NURSING_SLIDER = [9, 8, 7, 6, 5, 4, 3, 2, 1];

  function ghNursingEligibility(agg, grades, progKey) {
    var p = GH_NURSING_PROGS[progKey] || GH_NURSING_PROGS.rgn;
    var allC6 = grades.every(function (g) { return g <= 6; });
    var allE8 = grades.every(function (g) { return g <= 8; });
    if (p.tier === 'certificate') {
      return (agg <= p.threshold && allE8) ? (p.label + ' Eligible') : 'Below ' + p.label + ' Cut-off';
    }
    if (p.tier === 'degree') {
      return (agg <= p.threshold && allC6) ? 'B.Sc Competitive Band' : (allC6 && agg <= 24 ? 'Diploma Alternative Band' : 'Below Degree Cut-off');
    }
    return (agg <= p.threshold && allC6) ? (p.label + ' Eligible') : (agg <= 36 && allE8 ? 'Certificate Alternative Band' : 'Below MoH Cut-off');
  }

  function zwGpaPointFromMark(mark, scaleKey) {
    if (scaleKey === 'gpa_5_0') {
      if (mark >= 80) return 5.0;
      if (mark >= 70) return 4.0;
      if (mark >= 60) return 3.0;
      if (mark >= 50) return 2.0;
      if (mark >= 40) return 1.0;
      return 0.0;
    }
    if (scaleKey === 'percentage_wam') {
      return mark;
    }
    if (mark >= 80) return 4.0;
    if (mark >= 75) return 3.5;
    if (mark >= 70) return 3.0;
    if (mark >= 65) return 2.5;
    if (mark >= 60) return 2.0;
    if (mark >= 50) return 1.0;
    return 0.0;
  }

  function zwGpaHonoursBand(val, scaleKey) {
    if (scaleKey === 'percentage_wam') {
      if (val >= 80) return 'First Class (1)';
      if (val >= 70) return 'Upper Second (2.1)';
      if (val >= 60) return 'Lower Second (2.2)';
      if (val >= 50) return 'Third Class (3)';
      return 'Below Pass (< 50%)';
    }
    if (scaleKey === 'gpa_5_0') {
      if (val >= 4.50) return 'First Class (1)';
      if (val >= 3.80) return 'Upper Second (2.1)';
      if (val >= 3.00) return 'Lower Second (2.2)';
      if (val >= 2.00) return 'Third Class (3)';
      return 'Probation (< 2.00)';
    }
    if (val >= 3.75) return 'First Class (1)';
    if (val >= 3.00) return 'Upper Second (2.1)';
    if (val >= 2.00) return 'Lower Second (2.2)';
    if (val >= 1.00) return 'Third Class (3)';
    return 'Below Pass (< 1.00)';
  }

  var ZM_UNZA5_GRADES = [
    { value: '5.0', code: 'A+', pts: 5.0, label: 'A+ Distinction (5.0)' },
    { value: '4.0', code: 'A', pts: 4.0, label: 'A Distinction (4.0)' },
    { value: '3.0', code: 'B+', pts: 3.0, label: 'B+ Meritorious (3.0)' },
    { value: '2.5', code: 'B', pts: 2.5, label: 'B Very Satisfactory (2.5)' },
    { value: '2.0', code: 'C+', pts: 2.0, label: 'C+ Definite Pass (2.0)' },
    { value: '1.5', code: 'C', pts: 1.5, label: 'C Bare Pass (1.5)' },
    { value: '1.0', code: 'D+', pts: 1.0, label: 'D+ Supp (1.0)' },
    { value: '0.0', code: 'D', pts: 0.0, label: 'D Fail (0.0)' }
  ];

  var ZM_STD4_GRADES = [
    { value: '4.0', code: 'A', pts: 4.0, label: 'A Distinction (4.0)' },
    { value: '3.5', code: 'B+', pts: 3.5, label: 'B+ Merit (3.5)' },
    { value: '3.0', code: 'B', pts: 3.0, label: 'B Credit (3.0)' },
    { value: '2.5', code: 'C+', pts: 2.5, label: 'C+ Pass Plus (2.5)' },
    { value: '2.0', code: 'C', pts: 2.0, label: 'C Pass (2.0)' },
    { value: '1.0', code: 'D', pts: 1.0, label: 'D Supp (1.0)' },
    { value: '0.0', code: 'F', pts: 0.0, label: 'F Fail (0.0)' }
  ];

  function zmGpaClassBand(gpa, scaleKey) {
    if (scaleKey === 'std4') {
      if (gpa >= 3.70) return 'Distinction';
      if (gpa >= 3.30) return 'Merit';
      if (gpa >= 2.70) return 'Credit';
      if (gpa >= 2.00) return 'Pass';
      return 'Academic Probation';
    }
    if (gpa >= 4.50) return 'Distinction';
    if (gpa >= 3.75) return 'Merit';
    if (gpa >= 2.75) return 'Credit';
    if (gpa >= 2.00) return 'Pass';
    return 'Academic Probation';
  }

  var TZ_TCU_GPA_GRADES = [
    { value: '5.0', code: 'A', pts: 5.0, label: 'A (5.0 pts)' },
    { value: '4.0', code: 'B+', pts: 4.0, label: 'B+ (4.0 pts)' },
    { value: '3.0', code: 'B', pts: 3.0, label: 'B (3.0 pts)' },
    { value: '2.0', code: 'C', pts: 2.0, label: 'C Pass (2.0 pts)' },
    { value: '1.0', code: 'D', pts: 1.0, label: 'D Supp (1.0 pt)' },
    { value: '0.0', code: 'E', pts: 0.0, label: 'E Fail (0.0 pts)' }
  ];

  function tzTcuGpaBand(gpa) {
    if (gpa >= 4.40) return 'First Class Honours';
    if (gpa >= 3.50) return 'Upper Second Class';
    if (gpa >= 2.70) return 'Lower Second Class';
    if (gpa >= 2.00) return 'Pass Degree';
    return 'Discontinue / Probation (< 2.00)';
  }

  var ZW_UNI_FACULTIES = {
    medicine: { name: 'Medicine & Health Sciences', min: 14, ideal: 15, par: 12 },
    law: { name: 'Law (LLB)', min: 13, ideal: 15, par: 11 },
    engineering: { name: 'Engineering & Built Env.', min: 12, ideal: 14, par: 9 },
    computers: { name: 'Computer Science & SE', min: 11, ideal: 13, par: 8 },
    commerce: { name: 'Commerce & Finance', min: 10, ideal: 12, par: 7 },
    science: { name: 'Applied Sciences', min: 8, ideal: 10, par: 6 },
    agriculture: { name: 'Agriculture & Env.', min: 6, ideal: 8, par: 4 },
    humanities: { name: 'Social Sciences & Humanities', min: 7, ideal: 9, par: 5 },
    education: { name: 'Education & Pedagogy', min: 5, ideal: 7, par: 3 }
  };
  var ZW_ALEVEL_PTS = { A: 5, B: 4, C: 3, D: 2, E: 1, O: 0, F: 0 };
  var ZW_ALEVEL_GRADES = [
    { value: 'A', pts: 5, label: 'Grade A (5 pts)' },
    { value: 'B', pts: 4, label: 'Grade B (4 pts)' },
    { value: 'C', pts: 3, label: 'Grade C (3 pts)' },
    { value: 'D', pts: 2, label: 'Grade D (2 pts)' },
    { value: 'E', pts: 1, label: 'Grade E (1 pt)' },
    { value: 'O', pts: 0, label: 'Subsidiary O (0 pts)' },
    { value: 'F', pts: 0, label: 'Fail F (0 pts)' }
  ];

  function zwUniRouteBand(pts, passes, statutoryOk, fac) {
    if (!statutoryOk || passes < 2) return 'Below ZCHE Statutory Minimum';
    if (pts >= fac.ideal) return 'Strong Conventional Intake';
    if (pts >= fac.min) return 'Conventional Intake Competitive';
    if (pts >= fac.par) return 'Parallel / Block-Release Route';
    return 'Below Faculty Cut-off (' + fac.par + '+ pts)';
  }

  var ZM_ECZ_GRADES = [
    { value: '1', pts: 1, label: 'Grade 1 - Distinction (1 pt)' },
    { value: '2', pts: 2, label: 'Grade 2 - Distinction (2 pts)' },
    { value: '3', pts: 3, label: 'Grade 3 - Merit (3 pts)' },
    { value: '4', pts: 4, label: 'Grade 4 - Merit (4 pts)' },
    { value: '5', pts: 5, label: 'Grade 5 - Credit (5 pts)' },
    { value: '6', pts: 6, label: 'Grade 6 - Credit (6 pts)' },
    { value: '7', pts: 7, label: 'Grade 7 - Satisfactory (7 pts)' },
    { value: '8', pts: 8, label: 'Grade 8 - Pass (8 pts)' },
    { value: '9', pts: 9, label: 'Grade 9 - Fail (9 pts)' }
  ];

  function zmAdmissionBand(best5, creditsCount, engGrade) {
    if (creditsCount < 5 || engGrade > 6) return 'Below 5-Credit / English Rule';
    if (best5 <= 10) return 'Highly Competitive (Medicine / Eng)';
    if (best5 <= 14) return 'Strong UNZA / CBU Merit Band';
    if (best5 <= 18) return 'Competitive Degree Entry';
    if (best5 <= 24) return 'Standard Degree / Parallel Band';
    return 'Diploma / Foundation Route';
  }

  var TZ_ACSEE_ADM_PTS = { A: 5.0, B: 4.0, C: 3.0, D: 2.0, E: 1.0, S: 0.5, F: 0.0 };
  var TZ_ACSEE_ADM_GRADES = [
    { value: 'A', pts: 5.0, label: 'Grade A (5.0 pts)' },
    { value: 'B', pts: 4.0, label: 'Grade B (4.0 pts)' },
    { value: 'C', pts: 3.0, label: 'Grade C (3.0 pts)' },
    { value: 'D', pts: 2.0, label: 'Grade D (2.0 pts)' },
    { value: 'E', pts: 1.0, label: 'Grade E (1.0 pt)' },
    { value: 'S', pts: 0.5, label: 'Subsidiary S (0.5 pt)' },
    { value: 'F', pts: 0.0, label: 'Fail F (0.0 pts)' }
  ];

  function tzAdmissionAcseeBand(totalPts, ptsArr, facCode) {
    var prinPasses = ptsArr.filter(function (p) { return p >= 1.0; }).length;
    var sorted = ptsArr.slice().sort(function (a, b) { return b - a; });
    var bestTwo = (sorted[0] || 0) + (sorted[1] || 0);
    if (prinPasses < 2 || bestTwo < 4.0) return 'Below TCU 4.0 Two-Principal Rule';
    if (facCode === 'MED' && totalPts < 8.0) return 'Below Medicine Competitive Band';
    if (totalPts >= 11.0) return 'Highly Competitive (UDSM / MUHAS)';
    if (totalPts >= 7.0) return 'Competitive TCU Degree Band';
    return 'Eligible TCU Degree Minimum (4.0+)';
  }

  function tzAdmissionDiplomaBand(gpa) {
    if (gpa >= 4.0) return 'Highly Competitive NACTVET Band';
    if (gpa >= 3.5) return 'Strong TCU Degree Transfer Band';
    if (gpa >= 3.0) return 'Meets TCU 3.00 Second-Class Rule';
    return 'Below TCU 3.00 Diploma Minimum';
  }

  function kcpePlacementBand(total) {
    var pct = (total / 500) * 100;
    var gr = pct >= 80 ? 'A' : pct >= 75 ? 'A-' : pct >= 70 ? 'B+' : pct >= 65 ? 'B' : pct >= 60 ? 'B-' : pct >= 55 ? 'C+' : pct >= 50 ? 'C' : pct >= 45 ? 'C-' : pct >= 40 ? 'D+' : pct >= 35 ? 'D' : pct >= 30 ? 'D-' : 'E';
    if (total >= 400) return 'Grade ' + gr + ' - National School Tier';
    if (total >= 350) return 'Grade ' + gr + ' - Extra-County Tier';
    if (total >= 300) return 'Grade ' + gr + ' - County School Tier';
    return 'Grade ' + gr + ' - Sub-County Tier';
  }

  function beceCsspsBand(agg, cat) {
    var b = cat === 'B' ? { hi: 18, mid: 24 } : (cat === 'C' ? { hi: 30, mid: 36 } : { hi: 10, mid: 14 });
    if (agg <= b.hi) return 'High Chance (Category ' + cat + ')';
    if (agg <= b.mid) return 'Borderline (Category ' + cat + ')';
    return 'Low Chance for Cat ' + cat + ' (Add Backup)';
  }

  var UK_GCSE_GRADES = [
    { value: '9', pts: 9, label: 'Grade 9 (A*+)' },
    { value: '8', pts: 8, label: 'Grade 8 (A*)' },
    { value: '7', pts: 7, label: 'Grade 7 (A)' },
    { value: '6', pts: 6, label: 'Grade 6 (High B)' },
    { value: '5', pts: 5, label: 'Grade 5 (Strong Pass)' },
    { value: '4', pts: 4, label: 'Grade 4 (Standard Pass)' },
    { value: '3', pts: 3, label: 'Grade 3 (D)' },
    { value: '2', pts: 2, label: 'Grade 2 (E)' },
    { value: '1', pts: 1, label: 'Grade 1 (F/G)' },
    { value: 'U', pts: 0, label: 'U (Ungraded)' }
  ];

  function ukGcseGradeFromPct(pct) {
    if (pct >= 84) return '9';
    if (pct >= 77) return '8';
    if (pct >= 70) return '7';
    if (pct >= 61) return '6';
    if (pct >= 52) return '5';
    if (pct >= 43) return '4';
    if (pct >= 32) return '3';
    if (pct >= 21) return '2';
    if (pct >= 10) return '1';
    return 'U';
  }

  function ukGcsePortfolioBand(avg) {
    if (avg >= 7.5) return 'Selective Russell Group / Oxbridge Profile';
    if (avg >= 6.0) return 'Academic Sixth Form A-Level Entry';
    if (avg >= 4.5) return 'Standard Sixth Form / T-Level Entry';
    if (avg >= 4.0) return 'Level 3 College Standard Pass';
    return 'Level 2 / Resit Foundation Route';
  }

  var UK_DEGREE_MODELS = {
    '1:2': { w2: 1 / 3, w3: 2 / 3, label: '1:2 Ratio' },
    '1:3': { w2: 0.25, w3: 0.75, label: '1:3 Ratio' },
    '1:1': { w2: 0.50, w3: 0.50, label: '50:50 Ratio' },
    '100_final': { w2: 0, w3: 1.0, label: 'Final Year Only' },
    '4year_master': { w2: 1 / 3, w3: 2 / 3, label: 'Integrated Master\'s' }
  };

  function ukDegreeYearAvg(mods, dropLowest) {
    var working = mods.slice();
    if (dropLowest && working.length > 1) {
      working.sort(function (a, b) { return a.mark - b.mark; });
      working.shift();
    }
    var sum = 0;
    var cr = 0;
    for (var i = 0; i < working.length; i++) {
      sum += working[i].mark * working[i].credits;
      cr += working[i].credits;
    }
    return { avg: cr > 0 ? (sum / cr) : 0, credits: cr };
  }

  function ukDegreeHonoursBand(mark) {
    if (mark >= 70) return 'First-Class Honours (1st)';
    if (mark >= 60) return 'Upper Second-Class (2:1)';
    if (mark >= 50) return 'Lower Second-Class (2:2)';
    if (mark >= 40) return 'Third-Class Honours (3rd)';
    return 'Below Honours (< 40%)';
  }

  /* =========================================================================
   * 40 CURRICULUM-ACCURATE EDUCATIONAL TOOL ADAPTERS
   * ========================================================================= */

  var ADAPTERS = {

    /* 1. SOUTH AFRICAN APS CALCULATOR */
    'south-african-aps-calculator': {
      formId: 'apsForm',
      resetIds: ['resetBtn'],
      bannerDesc: 'See how your overall APS compares with a classmate and find the fastest subject to lift your university score.',
      emptyTitle: 'Calculate Your APS First',
      emptyDesc: 'Enter your subject percentages above and calculate your APS to compare against a classmate.',
      projectedLabel: 'Projected APS',
      higherIsBetter: true,
      tieEpsilon: 0.05,
      modes: [
        { id: 'standard', label: '6 Subjects (Max 42)' },
        { id: 'extended', label: 'With LO (Max 49)' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var subjects = [];
        for (var i = 1; i <= 6; i++) {
          var el = document.getElementById('sub' + i);
          var v = el ? parseFloat(el.value) : NaN;
          if (!isFinite(v) || v < 0 || v > 100) return null;
          subjects.push({ id: 'sub' + i, name: 'Subject ' + i, pct: v, level: apsLevelFromPct(v), isLO: false });
        }
        var incEl = document.getElementById('includeLO');
        var loEl = document.getElementById('loPercent');
        var includeLO = !!(incEl && incEl.checked);
        var loPct = loEl ? parseFloat(loEl.value) : NaN;
        if (includeLO && isFinite(loPct) && loPct >= 0 && loPct <= 100) {
          subjects.push({ id: 'loPercent', name: 'Life Orientation', pct: loPct, level: apsLevelFromPct(loPct), isLO: true });
        } else {
          includeLO = false;
        }
        var total = subjects.reduce(function (s, x) { return s + x.level; }, 0);
        var maxPts = includeLO ? 49 : 42;
        var band = total >= 36 ? 'Competitive Degree Range' : total >= 26 ? "Bachelor's Degree Range" : total >= 19 ? 'Diploma Range' : total >= 15 ? 'Higher Certificate Range' : 'Below Admission Minimums';
        return {
          mode: includeLO ? 'extended' : 'standard',
          score: total,
          maxScore: maxPts,
          band: band + ' (out of ' + maxPts + ')',
          subjects: subjects
        };
      },
      getDefaultFriendItems: function (mode) {
        var list = [];
        for (var i = 1; i <= 6; i++) {
          list.push({ id: 'f_sub' + i, name: 'Subject ' + i, tag: 'L0-L7', type: 'number', min: 0, max: 100, suffix: '%', placeholder: '0-100', val: null });
        }
        if (mode === 'extended') {
          list.push({ id: 'f_lo', name: 'Life Orientation', tag: 'LO', type: 'number', min: 0, max: 100, suffix: '%', placeholder: '0-100', val: null });
        }
        return list;
      },
      getSampleFriendItems: function (mode) {
        var samples = [68, 74, 62, 58, 71, 65];
        var items = this.getDefaultFriendItems(mode);
        for (var i = 0; i < items.length; i++) {
          items[i].val = i < 6 ? samples[i] : 76;
        }
        return items;
      },
      getComparableStudentScore: function (studentCtx, friendMode) {
        if (friendMode === 'standard') {
          var sum6 = studentCtx.subjects.filter(function (s) { return !s.isLO; }).reduce(function (a, b) { return a + b.level; }, 0);
          var b6 = sum6 >= 36 ? 'Competitive Degree Range' : sum6 >= 26 ? "Bachelor's Degree Range" : sum6 >= 19 ? 'Diploma Range' : sum6 >= 15 ? 'Higher Certificate Range' : 'Below Admission Minimums';
          return { score: sum6, maxScore: 42, band: b6 + ' (out of 42)' };
        }
        return { score: studentCtx.score, maxScore: studentCtx.maxScore, band: studentCtx.band };
      },
      calculateFriend: function (items, mode) {
        var filled = items.filter(function (it) { return it.val !== null && isFinite(it.val); });
        if (filled.length < 6) return null;
        var sum = 0;
        var limit = mode === 'extended' ? Math.min(7, items.length) : 6;
        for (var i = 0; i < limit; i++) {
          if (items[i].val === null || !isFinite(items[i].val)) return null;
          sum += apsLevelFromPct(items[i].val);
        }
        var maxPts = mode === 'extended' ? 49 : 42;
        var band = sum >= 36 ? 'Competitive Degree Range' : sum >= 26 ? "Bachelor's Degree Range" : sum >= 19 ? 'Diploma Range' : sum >= 15 ? 'Higher Certificate Range' : 'Below Admission Minimums';
        return { score: sum, maxScore: maxPts, band: band + ' (out of ' + maxPts + ')', filledCount: filled.length };
      },
      validateMessage: 'Enter valid percentages (0-100%) for all 6 subjects for your friend.',
      formatScore: function (score) { return Math.round(score) + ' APS'; },
      formatDiff: function (absDiff) {
        var pts = Math.round(absDiff);
        return pts + (pts === 1 ? ' APS point' : ' APS points');
      },
      getSvgConfig: function (mode, studentComp) {
        var maxPts = studentComp.maxScore || (mode === 'extended' ? 49 : 42);
        return {
          min: 0,
          max: maxPts,
          invert: false,
          leftLabel: '0',
          rightLabel: maxPts + ' Max',
          guides: [
            { pct: (19 / maxPts) * 100, label: '19 Diploma', strong: true },
            { pct: (28 / maxPts) * 100, label: '28 Degree', strong: false }
          ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName, studentComp) {
        var subs = studentCtx.subjects.filter(function (s) { return friendCalc.maxScore === 49 || !s.isLO; });
        var thresholds = [30, 40, 50, 60, 70, 80];
        var bestIdx = 0;
        var bestDist = 999;
        var bestNextThreshold = 80;

        for (var i = 0; i < subs.length; i++) {
          var p = subs[i].pct;
          if (p >= 80) continue;
          for (var t = 0; t < thresholds.length; t++) {
            if (thresholds[t] > p) {
              var dist = thresholds[t] - p;
              if (dist < bestDist) {
                bestDist = dist;
                bestIdx = i;
                bestNextThreshold = thresholds[t];
              }
              break;
            }
          }
        }

        var chosen = subs[bestIdx] || subs[0];
        if (chosen.pct >= 80 && bestDist === 999) {
          return {
            bestIndex: 0,
            suggestedSimVal: Math.max(85, Math.round(chosen.pct)),
            html: 'All of your counted subjects already sit in NSC Level 7 (80%+). Next step: check specific faculty subject prerequisites and National Benchmark Test (NBT) dates for your target university.'
          };
        }

        var gainLevels = apsLevelFromPct(bestNextThreshold) - chosen.level;
        var gapToFriend = friendCalc.score - studentComp.score;
        var extraNote = (gapToFriend === 1 && gainLevels >= 1) ? ' and ties ' + escapeHtml(friendName) : (gapToFriend <= 0 ? ' to widen your lead' : ' toward ' + escapeHtml(friendName) + "'s total");
        return {
          bestIndex: bestIdx,
          suggestedSimVal: bestNextThreshold,
          html: '<strong>' + escapeHtml(chosen.name) + ' (' + chosen.pct.toFixed(0) + '%, Level ' + chosen.level + ')</strong> is your fastest APS win: adding just <strong>+' + Math.ceil(bestDist) + '%</strong> to reach <strong>' + bestNextThreshold + '%</strong> unlocks <strong>+' + gainLevels + ' APS point' + (gainLevels > 1 ? 's' : '') + '</strong>' + extraNote + '. Next step: drill two timed DBE past Exam Papers 1 and 2 on your weakest topic in ' + escapeHtml(chosen.name) + '.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex, friendCalc) {
        var subs = studentCtx.subjects.filter(function (s) { return friendCalc.maxScore === 49 || !s.isLO; });
        var idx = clampNum(itemIndex, 0, subs.length - 1);
        var chosen = subs[idx];
        var baseScore = subs.reduce(function (a, b) { return a + b.level; }, 0);
        return {
          selectLabel: 'Subject',
          options: subs.map(function (s, i) {
            return { index: i, label: s.name + ' (now ' + s.pct.toFixed(0) + '% - L' + s.level + ')' };
          }),
          sliderLabel: 'Target Mark',
          min: 0,
          max: 100,
          step: 1,
          defaultVal: Math.min(100, Math.max(chosen.pct + 8, 70)),
          formatSliderVal: function (v) { return v + '% (L' + apsLevelFromPct(v) + ')'; },
          simulate: function (v) {
            var newLvl = apsLevelFromPct(v);
            var delta = newLvl - chosen.level;
            var proj = baseScore + delta;
            return {
              projectedScore: proj,
              projectedDisplay: proj + ' APS',
              changeDisplay: (delta >= 0 ? '+' : '') + delta + ' APS',
              changeState: delta > 0 ? 'pos' : (delta < 0 ? 'neg' : '')
            };
          }
        };
      },
      parseUrlItems: function (params, mode) {
        if (params.has('sub1') && params.has('sub2')) {
          var useExt = params.get('includeLO') === '1' || params.get('includeLO') === 'true' || params.has('loPercent');
          var m = useExt ? 'extended' : mode;
          var items = this.getDefaultFriendItems(m);
          for (var i = 0; i < 6; i++) {
            var v = parseFloat(params.get('sub' + (i + 1)));
            items[i].val = isFinite(v) ? clampNum(v, 0, 100) : null;
          }
          if (m === 'extended' && items[6]) {
            var lv = parseFloat(params.get('loPercent'));
            items[6].val = isFinite(lv) ? clampNum(lv, 0, 100) : null;
          }
          return { mode: m, items: items };
        }
        return null;
      }
    },

    /* 2. SOUTH AFRICAN TVET NATED CALCULATOR */
    'south-african-tvet-nated-calculator': {
      formId: 'natedForm',
      resetIds: ['resetBtn'],
      bannerDesc: 'See how your NATED 40/60 composite mark compares with a classmate and get your highest-value next step.',
      emptyTitle: 'Calculate Your NATED Mark First',
      emptyDesc: 'Enter your ICASS and national exam marks above to compare your result with a classmate.',
      projectedLabel: 'Projected NATED',
      higherIsBetter: true,
      tieEpsilon: 0.05,
      modes: [
        { id: 'single', label: 'Single Subject' },
        { id: 'trimester', label: '4-Subject Trimester' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var tabTrim = document.getElementById('tabTrimester');
        var isTrim = !!(tabTrim && tabTrim.classList.contains('active'));
        if (!isTrim) {
          var icass = parseFloat((document.getElementById('icassInput') || {}).value);
          var exam = parseFloat((document.getElementById('examInput') || {}).value);
          if (!isFinite(icass) || !isFinite(exam)) return null;
          var comp = clampNum(icass * 0.40 + exam * 0.60, 0, 100);
          var examMet = exam >= 40;
          var band = !examMet ? 'Sub-minimum Fail (<40% Exam)' : comp >= 75 ? 'Distinction' : comp >= 50 ? 'Standard Pass' : comp >= 40 ? 'Condoned Pass' : 'Below 40% Pass';
          return {
            mode: 'single',
            score: Math.round(comp * 100) / 100,
            band: band,
            components: [
              { name: 'ICASS Mark', weight: 40, score: icass, isExam: false },
              { name: 'National Exam', weight: 60, score: exam, isExam: true }
            ]
          };
        }
        var rows = document.querySelectorAll('#natedSubjectRows .subject-row');
        var comps = [];
        var total = 0;
        var passed = 0;
        rows.forEach(function (row, idx) {
          var nEl = row.querySelector('.subject-name');
          var iEl = row.querySelector('.subject-icass');
          var eEl = row.querySelector('.subject-exam');
          var nm = (nEl && nEl.value.trim()) || ('Subject ' + (idx + 1));
          var iv = iEl ? parseFloat(iEl.value) : NaN;
          var ev = eEl ? parseFloat(eEl.value) : NaN;
          if (isFinite(iv) && isFinite(ev)) {
            var c = clampNum(iv * 0.40 + ev * 0.60, 0, 100);
            if (c >= 40 && ev >= 40) passed++;
            comps.push({ name: nm, icass: iv, exam: ev, score: c, weight: 25 });
            total += c;
          }
        });
        if (comps.length < 4) return null;
        var avg = Math.round((total / comps.length) * 100) / 100;
        return {
          mode: 'trimester',
          score: avg,
          band: passed + ' / 4 Subjects Passed',
          components: comps
        };
      },
      getDefaultFriendItems: function (mode, studentCtx) {
        if (mode === 'trimester') {
          var names = (studentCtx && studentCtx.mode === 'trimester')
            ? studentCtx.components.map(function (c) { return c.name; })
            : ['Subject 1', 'Subject 2', 'Subject 3', 'Subject 4'];
          return names.map(function (nm, i) {
            return { id: 'f_tri_' + i, name: nm, tag: '40/60%', type: 'number', min: 0, max: 100, suffix: '%', placeholder: 'Final %', val: null };
          });
        }
        return [
          { id: 'f_icass', name: 'ICASS Mark', tag: '40%', type: 'number', min: 0, max: 100, suffix: '%', placeholder: '0-100', val: null },
          { id: 'f_exam', name: 'National Exam', tag: '60%', type: 'number', min: 0, max: 100, suffix: '%', placeholder: '0-100', val: null }
        ];
      },
      getSampleFriendItems: function (mode, studentCtx) {
        var items = this.getDefaultFriendItems(mode, studentCtx);
        var samples = mode === 'trimester' ? [66, 72, 58, 64] : [68, 62];
        for (var i = 0; i < items.length; i++) items[i].val = samples[i % samples.length];
        return items;
      },
      calculateFriend: function (items, mode) {
        if (mode === 'trimester') {
          var valid = items.filter(function (it) { return it.val !== null && isFinite(it.val); });
          if (valid.length === 0) return null;
          var sum = valid.reduce(function (a, b) { return a + b.val; }, 0);
          var avg = Math.round((sum / valid.length) * 100) / 100;
          var b = avg >= 75 ? 'Distinction Average' : avg >= 50 ? 'Standard Pass Average' : avg >= 40 ? 'Condoned Range' : 'Below 40% Pass';
          return { score: avg, band: b, filledCount: valid.length };
        }
        var ic = items[0] ? items[0].val : null;
        var ex = items[1] ? items[1].val : null;
        if (ic === null || !isFinite(ic) || ex === null || !isFinite(ex)) return null;
        var comp = Math.round(clampNum(ic * 0.40 + ex * 0.60, 0, 100) * 100) / 100;
        var met = ex >= 40;
        var band = !met ? 'Sub-minimum Fail (<40% Exam)' : comp >= 75 ? 'Distinction' : comp >= 50 ? 'Standard Pass' : comp >= 40 ? 'Condoned Pass' : 'Below 40% Pass';
        return { score: comp, band: band, filledCount: 2 };
      },
      validateMessage: 'Enter both ICASS and National Exam marks (0-100%) for your friend.',
      formatScore: function (score) { return Number(score).toFixed(2) + '%'; },
      formatDiff: function (absDiff) { return absDiff.toFixed(2) + ' percentage points'; },
      getSvgConfig: function () {
        return {
          min: 0,
          max: 100,
          invert: false,
          leftLabel: '0%',
          rightLabel: '100%',
          guides: [
            { pct: 40, label: '40% Pass', strong: true },
            { pct: 75, label: '75% Dist.', strong: false }
          ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName) {
        if (studentCtx.mode === 'single') {
          var ic = studentCtx.components[0];
          var ex = studentCtx.components[1];
          if (ex.score < 40) {
            var targetEx = Math.max(45, Math.ceil(ex.score + 10));
            var gainSub = ((targetEx - ex.score) * 0.60).toFixed(2);
            return {
              bestIndex: 1,
              suggestedSimVal: targetEx,
              html: '<strong>National Exam (60% weight, ' + ex.score.toFixed(0) + '%)</strong> is below the mandatory 40% DHET sub-minimum: lifting it to <strong>' + targetEx + '%</strong> adds <strong>+' + gainSub + ' composite points</strong> and validates your subject credit. Next step: drill past DHET 3-hour NATED question papers under timed conditions.'
            };
          }
          var missedIc = (100 - ic.score) * 0.40;
          var missedEx = (100 - ex.score) * 0.60;
          var pickIdx = missedEx >= missedIc ? 1 : 0;
          var pick = studentCtx.components[pickIdx];
          var target = Math.min(95, Math.max(75, Math.round(pick.score + 12)));
          if (target <= pick.score) target = Math.min(100, Math.ceil(pick.score + 4));
          var wt = pickIdx === 1 ? 0.60 : 0.40;
          var gain = ((target - pick.score) * wt).toFixed(2);
          var diff = studentCtx.score - friendCalc.score;
          var tail = diff < -0.05 ? ' to close ' + escapeHtml(friendName) + "'s lead" : ' toward the 75% Distinction band';
          return {
            bestIndex: pickIdx,
            suggestedSimVal: target,
            html: '<strong>' + escapeHtml(pick.name) + ' (' + pick.weight + '% weight, ' + pick.score.toFixed(0) + '%)</strong> carries your biggest upside: raising it to <strong>' + target + '%</strong> adds <strong>+' + gain + ' composite points</strong>' + tail + '. Next step: ' + (pickIdx === 1 ? 'complete two full past DHET national exam papers focusing on high-mark calculation sections.' : 'maximize your internal test and assignment scripts before campus TVETMIS lock.')
          };
        }
        // Trimester mode: find lowest exam/composite subject
        var lowestIdx = 0;
        for (var i = 1; i < studentCtx.components.length; i++) {
          if (studentCtx.components[i].score < studentCtx.components[lowestIdx].score) lowestIdx = i;
        }
        var sub = studentCtx.components[lowestIdx];
        var tgtExam = Math.min(95, Math.max(65, Math.round(sub.exam + 15)));
        var overallGain = (((tgtExam - sub.exam) * 0.60) / 4).toFixed(2);
        return {
          bestIndex: lowestIdx,
          suggestedSimVal: tgtExam,
          html: '<strong>' + escapeHtml(sub.name) + ' (' + sub.score.toFixed(1) + '% composite, ' + sub.exam.toFixed(0) + '% exam)</strong> is your highest-leverage trimester subject: raising its national exam mark to <strong>' + tgtExam + '%</strong> lifts your trimester average by <strong>+' + overallGain + ' points</strong>. Next step: prioritize past DHET marking memos for ' + escapeHtml(sub.name) + '.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        if (studentCtx.mode === 'single') {
          var idx = clampNum(itemIndex, 0, 1);
          var chosen = studentCtx.components[idx];
          var wt = idx === 1 ? 0.60 : 0.40;
          return {
            selectLabel: 'Component',
            options: studentCtx.components.map(function (c, i) {
              return { index: i, label: c.name + ' (' + c.weight + '% - now ' + c.score.toFixed(0) + '%)' };
            }),
            sliderLabel: 'Target Score',
            min: 0,
            max: 100,
            step: 1,
            defaultVal: Math.min(100, Math.round(chosen.score + 12)),
            formatSliderVal: function (v) { return v + '%'; },
            simulate: function (v) {
              var gain = (v - chosen.score) * wt;
              var proj = clampNum(Math.round((studentCtx.score + gain) * 100) / 100, 0, 100);
              return {
                projectedScore: proj,
                projectedDisplay: proj.toFixed(2) + '%',
                changeDisplay: (gain >= 0 ? '+' : '') + gain.toFixed(2) + ' pts',
                changeState: gain > 0.005 ? 'pos' : (gain < -0.005 ? 'neg' : '')
              };
            }
          };
        }
        var tIdx = clampNum(itemIndex, 0, studentCtx.components.length - 1);
        var tSub = studentCtx.components[tIdx];
        return {
          selectLabel: 'Subject Exam (60%)',
          options: studentCtx.components.map(function (c, i) {
            return { index: i, label: c.name + ' (Exam now ' + c.exam.toFixed(0) + '%)' };
          }),
          sliderLabel: 'Target Exam Mark',
          min: 0,
          max: 100,
          step: 1,
          defaultVal: Math.min(100, Math.round(tSub.exam + 12)),
          formatSliderVal: function (v) { return v + '%'; },
          simulate: function (v) {
            var gain = ((v - tSub.exam) * 0.60) / studentCtx.components.length;
            var proj = clampNum(Math.round((studentCtx.score + gain) * 100) / 100, 0, 100);
            return {
              projectedScore: proj,
              projectedDisplay: proj.toFixed(2) + '%',
              changeDisplay: (gain >= 0 ? '+' : '') + gain.toFixed(2) + ' pts',
              changeState: gain > 0.005 ? 'pos' : (gain < -0.005 ? 'neg' : '')
            };
          }
        };
      },
      parseUrlItems: function (params) {
        var ic = parseFloat(params.get('icassInput') || params.get('natedIcass'));
        var ex = parseFloat(params.get('examInput') || params.get('natedExam'));
        if (isFinite(ic) && isFinite(ex)) {
          var items = this.getDefaultFriendItems('single');
          items[0].val = clampNum(ic, 0, 100);
          items[1].val = clampNum(ex, 0, 100);
          return { mode: 'single', items: items };
        }
        return null;
      }
    },

    /* 3. MATRIC SBA + FINAL EXAM CALCULATOR */
    'matric-sba-exam-calculator': {
      formId: 'matricForm',
      resetIds: ['resetBtn', 'clearBtn'],
      bannerDesc: 'See how your overall Matric average and NSC pass level compare with a classmate.',
      emptyTitle: 'Calculate Your Matric Results First',
      emptyDesc: 'Enter your SBA and exam marks above and calculate your pass level to compare with a classmate.',
      projectedLabel: 'Projected Average',
      higherIsBetter: true,
      tieEpsilon: 0.05,
      modes: [],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var rows = document.querySelectorAll('.subject-row');
        var subjects = [];
        rows.forEach(function (row, idx) {
          var nameEl = row.querySelector('.subject-name');
          var sbaEl = row.querySelector('.subject-sba');
          var examEl = row.querySelector('.subject-exam');
          var defName = nameEl ? (nameEl.getAttribute('data-default-name') || '') : '';
          var name = (nameEl ? nameEl.value : '').trim() || defName || ('Subject ' + (idx + 1));
          var sba = sbaEl ? parseFloat(sbaEl.value) : NaN;
          var exam = examEl ? parseFloat(examEl.value) : NaN;
          var isLO = row.classList.contains('subject-row-lo');
          if (!isFinite(sba)) return;
          sba = clampNum(sba, 0, 100);
          var fin;
          if (isLO) {
            fin = sba;
          } else {
            if (!isFinite(exam)) return;
            exam = clampNum(exam, 0, 100);
            fin = sba * 0.25 + exam * 0.75;
          }
          subjects.push({
            name: name,
            sba: sba,
            exam: isLO ? null : exam,
            final: fin,
            level: matricLevelFromPct(fin),
            isLO: isLO
          });
        });
        if (subjects.length < 2) return null;
        var sum = subjects.reduce(function (a, b) { return a + b.final; }, 0);
        var avg = Math.round((sum / subjects.length) * 100) / 100;
        var passLvl = matricPassLevel(subjects);
        var aps = matricComputeAPS(subjects);
        return {
          mode: 'standard',
          score: avg,
          aps: aps,
          band: passLvl + ' - APS ' + aps,
          subjects: subjects
        };
      },
      getDefaultFriendItems: function (mode, studentCtx) {
        var subs = (studentCtx && studentCtx.subjects && studentCtx.subjects.length >= 2)
          ? studentCtx.subjects
          : [
              { name: 'Home Language', isLO: false },
              { name: 'First Add. Language', isLO: false },
              { name: 'Mathematics', isLO: false },
              { name: 'Life Orientation', isLO: true },
              { name: 'Subject 5', isLO: false },
              { name: 'Subject 6', isLO: false },
              { name: 'Subject 7', isLO: false }
            ];
        return subs.map(function (s, idx) {
          return {
            id: 'f_mat_' + idx,
            name: s.name,
            tag: s.isLO ? 'LO' : 'Final',
            isLO: !!s.isLO,
            type: 'number',
            min: 0,
            max: 100,
            suffix: '%',
            placeholder: '0-100',
            val: null
          };
        });
      },
      getSampleFriendItems: function (mode, studentCtx) {
        var items = this.getDefaultFriendItems(mode, studentCtx);
        var sampleScores = [66, 68, 59, 78, 63, 70, 61];
        for (var i = 0; i < items.length; i++) items[i].val = sampleScores[i % sampleScores.length];
        return items;
      },
      calculateFriend: function (items) {
        var filled = items.filter(function (it) { return it.val !== null && isFinite(it.val); });
        if (filled.length < 2) return null;
        var subs = filled.map(function (it) {
          return { name: it.name, final: it.val, level: matricLevelFromPct(it.val), isLO: !!it.isLO };
        });
        var avg = Math.round((subs.reduce(function (a, b) { return a + b.final; }, 0) / subs.length) * 100) / 100;
        var passLvl = matricPassLevel(subs);
        var aps = matricComputeAPS(subs);
        return { score: avg, band: passLvl + ' - APS ' + aps, filledCount: filled.length };
      },
      validateMessage: 'Enter at least 2 final subject percentages (0-100%) for your friend.',
      formatScore: function (score) { return Number(score).toFixed(1) + '%'; },
      formatDiff: function (absDiff) { return absDiff.toFixed(1) + ' percentage points'; },
      getSvgConfig: function () {
        return {
          min: 0,
          max: 100,
          invert: false,
          leftLabel: '0%',
          rightLabel: '100%',
          guides: [
            { pct: 50, label: '50% Bachelor', strong: true },
            { pct: 80, label: '80% Dist.', strong: false }
          ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName) {
        var subs = studentCtx.subjects;
        var bestIdx = 0;
        var bestNeed = 999;
        var bestTargetExam = 75;
        var thresholds = [40, 50, 60, 70, 80];

        for (var i = 0; i < subs.length; i++) {
          var s = subs[i];
          if (s.isLO || s.final >= 80) continue;
          for (var t = 0; t < thresholds.length; t++) {
            if (thresholds[t] > s.final) {
              var reqExam = Math.ceil((thresholds[t] - 0.25 * s.sba) / 0.75);
              var deltaExam = reqExam - s.exam;
              if (reqExam <= 100 && deltaExam > 0 && deltaExam < bestNeed) {
                bestNeed = deltaExam;
                bestIdx = i;
                bestTargetExam = reqExam;
              }
              break;
            }
          }
        }

        var pick = subs[bestIdx];
        if (!pick || pick.isLO || bestNeed === 999) {
          var nonLoIdx = subs.findIndex(function (x) { return !x.isLO; });
          if (nonLoIdx === -1) nonLoIdx = 0;
          pick = subs[nonLoIdx];
          var fallbackTarget = Math.min(100, Math.round((pick.isLO ? pick.sba : pick.exam) + 8));
          return {
            bestIndex: nonLoIdx,
            suggestedSimVal: fallbackTarget,
            html: 'Your academic subjects are already in strong NSC bands. Next step: focus on timed DBE November past papers in <strong>' + escapeHtml(pick.name) + '</strong> to protect your 75% final exam weighting.'
          };
        }

        var newFinal = 0.25 * pick.sba + 0.75 * bestTargetExam;
        var avgGain = ((newFinal - pick.final) / subs.length).toFixed(2);
        var newLvl = matricLevelFromPct(newFinal);
        return {
          bestIndex: bestIdx,
          suggestedSimVal: bestTargetExam,
          html: '<strong>' + escapeHtml(pick.name) + ' (' + pick.final.toFixed(1) + '% final, ' + pick.exam.toFixed(0) + '% exam)</strong> is your highest-return paper: lifting its 75%-weighted exam mark to <strong>' + bestTargetExam + '%</strong> unlocks <strong>NSC Level ' + newLvl + ' (+1 APS)</strong> and adds <strong>+' + avgGain + '%</strong> to your overall average. Next step: practise full DBE past exam papers for ' + escapeHtml(pick.name) + '.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var subs = studentCtx.subjects;
        var idx = clampNum(itemIndex, 0, subs.length - 1);
        var chosen = subs[idx];
        var curInput = chosen.isLO ? chosen.sba : chosen.exam;
        return {
          selectLabel: 'Subject',
          options: subs.map(function (s, i) {
            var curTxt = s.isLO ? ('SBA ' + s.sba.toFixed(0) + '%') : ('Exam ' + s.exam.toFixed(0) + '%');
            return { index: i, label: s.name + ' (' + curTxt + ' - L' + s.level + ')' };
          }),
          sliderLabel: chosen.isLO ? 'Target SBA Mark' : 'Target Exam Mark (75%)',
          min: 0,
          max: 100,
          step: 1,
          defaultVal: Math.min(100, Math.round(curInput + 10)),
          formatSliderVal: function (v) { return v + '%'; },
          simulate: function (v) {
            var newSubFinal = chosen.isLO ? v : (0.25 * chosen.sba + 0.75 * v);
            var deltaAvg = (newSubFinal - chosen.final) / subs.length;
            var projAvg = clampNum(Math.round((studentCtx.score + deltaAvg) * 100) / 100, 0, 100);
            var cloneSubs = subs.map(function (s, i) {
              return i === idx ? { name: s.name, final: newSubFinal, level: matricLevelFromPct(newSubFinal), isLO: s.isLO } : s;
            });
            var newAps = matricComputeAPS(cloneSubs);
            var apsDiff = newAps - studentCtx.aps;
            var apsSuffix = apsDiff !== 0 ? (' (' + (apsDiff > 0 ? '+' : '') + apsDiff + ' APS)') : '';
            return {
              projectedScore: projAvg,
              projectedDisplay: projAvg.toFixed(1) + '%',
              changeDisplay: (deltaAvg >= 0 ? '+' : '') + deltaAvg.toFixed(1) + '%' + apsSuffix,
              changeState: deltaAvg > 0.02 ? 'pos' : (deltaAvg < -0.02 ? 'neg' : '')
            };
          }
        };
      },
      parseUrlItems: function () { return null; }
    },

    /* 4. WASSCE AGGREGATE CALCULATOR (LOWER IS BETTER: 6 to 54) */
    'wassce-aggregate-calculator': {
      formId: 'wassceForm',
      resetIds: ['resetBtn'],
      bannerDesc: 'Compare your WASSCE Best-Six aggregate with a classmate and see which single grade upgrade cuts the most points.',
      emptyTitle: 'Calculate Your WASSCE Aggregate First',
      emptyDesc: 'Select your Core and Elective WAEC grades above and calculate your aggregate to compare with a classmate.',
      projectedLabel: 'Projected Aggregate',
      higherIsBetter: false,
      tieEpsilon: 0.05,
      modes: [],
      computeAggregateFromGrades: function (gMap) {
        var eng = WASSCE_PTS[gMap.coreEnglish];
        var mat = WASSCE_PTS[gMap.coreMaths];
        var sci = WASSCE_PTS[gMap.integratedScience];
        var soc = WASSCE_PTS[gMap.socialStudies];
        if (!eng || !mat || (!sci && !soc)) return null;
        var elePts = ['elective1', 'elective2', 'elective3', 'elective4']
          .map(function (k) { return WASSCE_PTS[gMap[k]]; })
          .filter(function (v) { return !!v; });
        if (elePts.length < 3) return null;
        var sciSoc = (sci && soc) ? Math.min(sci, soc) : (sci || soc);
        var sortedEle = elePts.slice().sort(function (a, b) { return a - b; });
        var coreSub = eng + mat + sciSoc;
        var eleSub = sortedEle[0] + sortedEle[1] + sortedEle[2];
        var agg = coreSub + eleSub;
        return { aggregate: agg, coreSubtotal: coreSub, electiveSubtotal: eleSub, band: wassceBand(agg) };
      },
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var keys = [
          { id: 'coreEnglish', name: 'Core English', tag: 'Core' },
          { id: 'coreMaths', name: 'Core Mathematics', tag: 'Core' },
          { id: 'integratedScience', name: 'Integrated Science', tag: 'Core' },
          { id: 'socialStudies', name: 'Social Studies', tag: 'Core' },
          { id: 'elective1', name: 'Elective 1', tag: 'Elective' },
          { id: 'elective2', name: 'Elective 2', tag: 'Elective' },
          { id: 'elective3', name: 'Elective 3', tag: 'Elective' },
          { id: 'elective4', name: 'Elective 4', tag: 'Elective' }
        ];
        var gMap = {};
        var entries = [];
        for (var i = 0; i < keys.length; i++) {
          var el = document.getElementById(keys[i].id);
          var g = el ? el.value : '';
          gMap[keys[i].id] = g;
          if (g && WASSCE_PTS[g]) {
            entries.push({ id: keys[i].id, name: keys[i].name, tag: keys[i].tag, grade: g, pts: WASSCE_PTS[g] });
          }
        }
        var calc = this.computeAggregateFromGrades(gMap);
        if (!calc) return null;
        return {
          mode: 'standard',
          score: calc.aggregate,
          band: calc.band + ' (Core ' + calc.coreSubtotal + ' + Electives ' + calc.electiveSubtotal + ')',
          gradeMap: gMap,
          entries: entries
        };
      },
      getDefaultFriendItems: function () {
        var opts = [{ value: '', label: 'Select' }].concat(WASSCE_GRADES.map(function (g) {
          return { value: g.grade, label: g.grade + ' (' + g.pts + ')' };
        }));
        var defs = [
          { id: 'coreEnglish', name: 'Core English', tag: 'Core' },
          { id: 'coreMaths', name: 'Core Mathematics', tag: 'Core' },
          { id: 'integratedScience', name: 'Integrated Science', tag: 'Core' },
          { id: 'socialStudies', name: 'Social Studies', tag: 'Core' },
          { id: 'elective1', name: 'Elective 1', tag: 'Elective' },
          { id: 'elective2', name: 'Elective 2', tag: 'Elective' },
          { id: 'elective3', name: 'Elective 3', tag: 'Elective' },
          { id: 'elective4', name: 'Elective 4 (Opt.)', tag: 'Elective' }
        ];
        return defs.map(function (d) {
          return { id: d.id, name: d.name, tag: d.tag, type: 'select', options: opts, val: '' };
        });
      },
      getSampleFriendItems: function () {
        var items = this.getDefaultFriendItems();
        var sample = ['B3', 'B2', 'B3', 'C4', 'B2', 'B3', 'C4', 'C5'];
        for (var i = 0; i < items.length; i++) items[i].val = sample[i];
        return items;
      },
      calculateFriend: function (items) {
        var gMap = {};
        var filled = 0;
        for (var i = 0; i < items.length; i++) {
          gMap[items[i].id] = items[i].val || '';
          if (items[i].val) filled++;
        }
        var calc = ADAPTERS['wassce-aggregate-calculator'].computeAggregateFromGrades(gMap);
        if (!calc) return null;
        return {
          score: calc.aggregate,
          band: calc.band + ' (Core ' + calc.coreSubtotal + ' + Electives ' + calc.electiveSubtotal + ')',
          filledCount: filled
        };
      },
      validateMessage: 'Select Core English, Core Maths, Science/Social Studies, and at least 3 Electives for your friend.',
      formatScore: function (score) { return 'Agg ' + Math.round(score); },
      formatDiff: function (absDiff) {
        var pts = Math.round(absDiff);
        return pts + (pts === 1 ? ' aggregate point' : ' aggregate points');
      },
      getSvgConfig: function () {
        return {
          min: 6,
          max: 54,
          invert: true,
          leftLabel: '54 Weak',
          rightLabel: '6 Best',
          guides: [
            { pct: ((54 - 24) / 48) * 100, label: '24 Cutoff', strong: true },
            { pct: ((54 - 12) / 48) * 100, label: '12 Strong', strong: false }
          ]
        };
      },
      computeTip: function (studentCtx) {
        var adapter = ADAPTERS['wassce-aggregate-calculator'];
        var bestIdx = 0;
        var bestDrop = 0;
        var bestTargetGrade = 'B2';

        for (var i = 0; i < studentCtx.entries.length; i++) {
          var entry = studentCtx.entries[i];
          if (entry.pts <= 1) continue;
          var targetPts = Math.max(1, entry.pts <= 3 ? 1 : entry.pts - 3);
          var targetGrade = WASSCE_GRADES[targetPts - 1].grade;
          var testMap = Object.assign({}, studentCtx.gradeMap);
          testMap[entry.id] = targetGrade;
          var sim = adapter.computeAggregateFromGrades(testMap);
          if (sim) {
            var drop = studentCtx.score - sim.aggregate;
            // Prioritize mandatory Core English & Core Maths on ties because C6+ is required for tertiary admission
            var bonus = (entry.id === 'coreEnglish' || entry.id === 'coreMaths') ? 0.25 : 0;
            if (drop + bonus > bestDrop) {
              bestDrop = drop;
              bestIdx = i;
              bestTargetGrade = targetGrade;
            }
          }
        }

        var chosen = studentCtx.entries[bestIdx] || studentCtx.entries[0];
        var realTest = Object.assign({}, studentCtx.gradeMap);
        realTest[chosen.id] = bestTargetGrade;
        var realSim = adapter.computeAggregateFromGrades(realTest);
        var actualDrop = realSim ? (studentCtx.score - realSim.aggregate) : 0;
        var sliderPos = WASSCE_SLIDER_ORDER.indexOf(bestTargetGrade);

        if (actualDrop <= 0) {
          return {
            bestIndex: 0,
            suggestedSimVal: 8,
            html: 'Your Best-Six WASSCE subjects are already at A1. Next step: verify programme-specific elective combinations for your first-choice university.'
          };
        }

        var creditWarning = (chosen.pts >= 7 && (chosen.id === 'coreEnglish' || chosen.id === 'coreMaths'))
          ? ' and clears the mandatory C6 credit bar for university entry'
          : ' (lower WASSCE aggregate is stronger)';

        return {
          bestIndex: bestIdx,
          suggestedSimVal: sliderPos !== -1 ? sliderPos : 7,
          html: '<strong>' + escapeHtml(chosen.name) + ' (' + chosen.grade + ' - ' + chosen.pts + ' pts)</strong> is your highest-value upgrade: improving it to <strong>' + bestTargetGrade + '</strong> cuts <strong>' + actualDrop + ' point' + (actualDrop > 1 ? 's' : '') + '</strong> off your aggregate to <strong>Aggregate ' + realSim.aggregate + '</strong>' + creditWarning + '. Next step: practise timed WAEC Paper 2 structured theory questions in ' + escapeHtml(chosen.name) + '.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var adapter = ADAPTERS['wassce-aggregate-calculator'];
        var entries = studentCtx.entries;
        var idx = clampNum(itemIndex, 0, entries.length - 1);
        var chosen = entries[idx];
        var curSlider = WASSCE_SLIDER_ORDER.indexOf(chosen.grade);
        return {
          selectLabel: 'Subject',
          options: entries.map(function (e, i) {
            return { index: i, label: e.name + ' (now ' + e.grade + ' - ' + e.pts + ' pts)' };
          }),
          sliderLabel: 'Target WAEC Grade',
          min: 0,
          max: 8,
          step: 1,
          defaultVal: Math.min(8, Math.max(0, curSlider + 2)),
          formatSliderVal: function (v) {
            var g = WASSCE_SLIDER_ORDER[v] || 'B2';
            return g + ' (' + WASSCE_PTS[g] + ' pt' + (WASSCE_PTS[g] > 1 ? 's' : '') + ')';
          },
          simulate: function (v) {
            var newG = WASSCE_SLIDER_ORDER[v] || chosen.grade;
            var testMap = Object.assign({}, studentCtx.gradeMap);
            testMap[chosen.id] = newG;
            var res = adapter.computeAggregateFromGrades(testMap);
            var proj = res ? res.aggregate : studentCtx.score;
            var diff = proj - studentCtx.score; // Negative diff = better (lower aggregate)
            return {
              projectedScore: proj,
              projectedDisplay: 'Agg ' + proj,
              changeDisplay: (diff > 0 ? '+' : '') + diff + ' pts',
              changeState: diff < 0 ? 'pos' : (diff > 0 ? 'neg' : '')
            };
          }
        };
      },
      parseUrlItems: function (params) {
        if (params.has('coreEnglish') && params.has('coreMaths')) {
          var items = this.getDefaultFriendItems();
          for (var i = 0; i < items.length; i++) {
            var v = params.get(items[i].id);
            if (v && WASSCE_PTS[v]) items[i].val = v;
          }
          return { mode: 'standard', items: items };
        }
        return null;
      }
    },

    /* 5. BECE AGGREGATE CALCULATOR (LOWER IS BETTER: 6 to 54) */
    'bece-aggregate-calculator': {
      formId: 'beceForm',
      resetIds: ['resetBtn'],
      bannerDesc: 'Compare your BECE Best-Six aggregate with a classmate and see which subject upgrade strengthens your SHS placement.',
      emptyTitle: 'Calculate Your BECE Aggregate First',
      emptyDesc: 'Select your four Core and Elective BECE grades above to compare your aggregate with a classmate.',
      projectedLabel: 'Projected Aggregate',
      higherIsBetter: false,
      tieEpsilon: 0.05,
      modes: [],
      computeBece: function (gMap) {
        var c1 = parseInt(gMap.coreEnglish, 10);
        var c2 = parseInt(gMap.coreMaths, 10);
        var c3 = parseInt(gMap.coreScience, 10);
        var c4 = parseInt(gMap.coreSocial, 10);
        if (!isFinite(c1) || !isFinite(c2) || !isFinite(c3) || !isFinite(c4)) return null;
        var eles = ['elective1', 'elective2', 'elective3']
          .map(function (k) { return parseInt(gMap[k], 10); })
          .filter(function (v) { return isFinite(v) && v >= 1 && v <= 9; });
        if (eles.length < 2) return null;
        eles.sort(function (a, b) { return a - b; });
        var coreSub = c1 + c2 + c3 + c4;
        var eleSub = eles[0] + eles[1];
        var agg = coreSub + eleSub;
        return { aggregate: agg, coreSubtotal: coreSub, electiveSubtotal: eleSub, band: beceBand(agg) };
      },
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var defs = [
          { id: 'coreEnglish', name: 'English Language', tag: 'Core' },
          { id: 'coreMaths', name: 'Mathematics', tag: 'Core' },
          { id: 'coreScience', name: 'Integrated Science', tag: 'Core' },
          { id: 'coreSocial', name: 'Social Studies', tag: 'Core' },
          { id: 'elective1', name: 'Elective 1', tag: 'Elective' },
          { id: 'elective2', name: 'Elective 2', tag: 'Elective' },
          { id: 'elective3', name: 'Elective 3', tag: 'Elective' }
        ];
        var gMap = {};
        var entries = [];
        for (var i = 0; i < defs.length; i++) {
          var el = document.getElementById(defs[i].id);
          var raw = el ? el.value : '';
          var num = parseInt(raw, 10);
          gMap[defs[i].id] = raw;
          if (isFinite(num) && num >= 1 && num <= 9) {
            entries.push({ id: defs[i].id, name: defs[i].name, tag: defs[i].tag, pts: num });
          }
        }
        var calc = this.computeBece(gMap);
        if (!calc) return null;
        return {
          mode: 'standard',
          score: calc.aggregate,
          band: calc.band + ' (Core ' + calc.coreSubtotal + ' + Electives ' + calc.electiveSubtotal + ')',
          gradeMap: gMap,
          entries: entries
        };
      },
      getDefaultFriendItems: function () {
        var opts = [{ value: '', label: 'Select' }];
        for (var g = 1; g <= 9; g++) opts.push({ value: String(g), label: 'Grade ' + g });
        var defs = [
          { id: 'coreEnglish', name: 'English Language', tag: 'Core' },
          { id: 'coreMaths', name: 'Mathematics', tag: 'Core' },
          { id: 'coreScience', name: 'Integrated Science', tag: 'Core' },
          { id: 'coreSocial', name: 'Social Studies', tag: 'Core' },
          { id: 'elective1', name: 'Elective 1', tag: 'Elective' },
          { id: 'elective2', name: 'Elective 2', tag: 'Elective' },
          { id: 'elective3', name: 'Elective 3 (Opt.)', tag: 'Elective' }
        ];
        return defs.map(function (d) {
          return { id: d.id, name: d.name, tag: d.tag, type: 'select', options: opts, val: '' };
        });
      },
      getSampleFriendItems: function () {
        var items = this.getDefaultFriendItems();
        var sample = ['2', '3', '2', '3', '2', '3', '4'];
        for (var i = 0; i < items.length; i++) items[i].val = sample[i];
        return items;
      },
      calculateFriend: function (items) {
        var gMap = {};
        var filled = 0;
        for (var i = 0; i < items.length; i++) {
          gMap[items[i].id] = items[i].val || '';
          if (items[i].val) filled++;
        }
        var calc = ADAPTERS['bece-aggregate-calculator'].computeBece(gMap);
        if (!calc) return null;
        return {
          score: calc.aggregate,
          band: calc.band + ' (Core ' + calc.coreSubtotal + ' + Electives ' + calc.electiveSubtotal + ')',
          filledCount: filled
        };
      },
      validateMessage: 'Select grades for all 4 Core subjects and at least 2 Electives for your friend.',
      formatScore: function (score) { return 'Agg ' + Math.round(score); },
      formatDiff: function (absDiff) {
        var pts = Math.round(absDiff);
        return pts + (pts === 1 ? ' aggregate point' : ' aggregate points');
      },
      getSvgConfig: function () {
        return {
          min: 6,
          max: 54,
          invert: true,
          leftLabel: '54 Weak',
          rightLabel: '6 Best',
          guides: [
            { pct: ((54 - 25) / 48) * 100, label: '25 Workable', strong: true },
            { pct: ((54 - 14) / 48) * 100, label: '14 Cat A/B', strong: false }
          ]
        };
      },
      computeTip: function (studentCtx) {
        var adapter = ADAPTERS['bece-aggregate-calculator'];
        var bestIdx = 0;
        var bestDrop = 0;
        var bestTarget = 2;

        for (var i = 0; i < studentCtx.entries.length; i++) {
          var e = studentCtx.entries[i];
          if (e.pts <= 1) continue;
          var tgt = Math.max(1, e.pts <= 3 ? 1 : e.pts - 3);
          var testMap = Object.assign({}, studentCtx.gradeMap);
          testMap[e.id] = String(tgt);
          var sim = adapter.computeBece(testMap);
          if (sim) {
            var drop = studentCtx.score - sim.aggregate;
            var bonus = e.tag === 'Core' ? 0.25 : 0;
            if (drop + bonus > bestDrop) {
              bestDrop = drop;
              bestIdx = i;
              bestTarget = tgt;
            }
          }
        }

        var chosen = studentCtx.entries[bestIdx] || studentCtx.entries[0];
        var realMap = Object.assign({}, studentCtx.gradeMap);
        realMap[chosen.id] = String(bestTarget);
        var realSim = adapter.computeBece(realMap);
        var actualDrop = realSim ? (studentCtx.score - realSim.aggregate) : 0;

        if (actualDrop <= 0) {
          return {
            bestIndex: 0,
            suggestedSimVal: 8,
            html: 'Your counted BECE subjects are already at Grade 1. Next step: review your CSSPS Category A school and programme order carefully with your JHS coordinator.'
          };
        }

        return {
          bestIndex: bestIdx,
          suggestedSimVal: 9 - bestTarget, // slider 0=Grade 9 .. 8=Grade 1
          html: '<strong>' + escapeHtml(chosen.name) + ' (Grade ' + chosen.pts + ')</strong> offers your biggest CSSPS placement gain: improving it to <strong>Grade ' + bestTarget + '</strong> lowers your aggregate by <strong>' + actualDrop + ' point' + (actualDrop > 1 ? 's' : '') + '</strong> to <strong>Aggregate ' + realSim.aggregate + '</strong>. Next step: work through past WAEC BECE Section B structured papers in ' + escapeHtml(chosen.name) + '.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var adapter = ADAPTERS['bece-aggregate-calculator'];
        var entries = studentCtx.entries;
        var idx = clampNum(itemIndex, 0, entries.length - 1);
        var chosen = entries[idx];
        var curSlider = 9 - chosen.pts; // 0 = Grade 9, 8 = Grade 1
        return {
          selectLabel: 'Subject',
          options: entries.map(function (e, i) {
            return { index: i, label: e.name + ' (now Grade ' + e.pts + ')' };
          }),
          sliderLabel: 'Target BECE Grade',
          min: 0,
          max: 8,
          step: 1,
          defaultVal: clampNum(curSlider + 2, 0, 8),
          formatSliderVal: function (v) { return 'Grade ' + (9 - v); },
          simulate: function (v) {
            var newGrade = 9 - v;
            var testMap = Object.assign({}, studentCtx.gradeMap);
            testMap[chosen.id] = String(newGrade);
            var res = adapter.computeBece(testMap);
            var proj = res ? res.aggregate : studentCtx.score;
            var diff = proj - studentCtx.score;
            return {
              projectedScore: proj,
              projectedDisplay: 'Agg ' + proj,
              changeDisplay: (diff > 0 ? '+' : '') + diff + ' pts',
              changeState: diff < 0 ? 'pos' : (diff > 0 ? 'neg' : '')
            };
          }
        };
      },
      parseUrlItems: function (params) {
        if (params.has('coreEnglish') && params.has('coreMaths') && params.has('coreScience')) {
          var items = this.getDefaultFriendItems();
          for (var i = 0; i < items.length; i++) {
            var v = params.get(items[i].id);
            if (v) items[i].val = v;
          }
          return { mode: 'standard', items: items };
        }
        return null;
      }
    },

    /* 6. KUCCPS CLUSTER POINTS CALCULATOR */
    'kuccps-cluster-points-calculator': {
      formId: 'kuccpsForm',
      resetIds: ['resetBtn'],
      bannerDesc: 'Compare your KUCCPS weighted cluster points (out of 48.000) with a classmate and pinpoint your highest-leverage prerequisite.',
      emptyTitle: 'Calculate Your Cluster Points First',
      emptyDesc: 'Enter your KCSE aggregate and 4 cluster subject grades above to compare against a classmate.',
      projectedLabel: 'Projected Cluster',
      higherIsBetter: true,
      tieEpsilon: 0.005,
      modes: [],
      computeWcp: function (r, t) {
        return Math.sqrt((r / 48) * (t / 84)) * 48;
      },
      getTier: function (wcp) {
        if (wcp >= 45) return 'Top tier';
        if (wcp >= 41) return 'Highly competitive';
        if (wcp >= 36) return 'Competitive degree range';
        if (wcp >= 30) return 'Moderate degree range';
        return 'Selective placement range';
      },
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var tVal = parseFloat(document.getElementById('aggregate').value);
        if (!isFinite(tVal) || tVal < 7 || tVal > 84) return null;
        var prereqs = [];
        var r = 0;
        for (var i = 1; i <= 4; i++) {
          var sEl = document.getElementById('sub' + i);
          var lblEl = document.getElementById('lblSub' + i);
          var pts = sEl ? parseInt(sEl.value, 10) : NaN;
          if (!isFinite(pts) || pts < 1 || pts > 12) return null;
          var cleanName = lblEl ? lblEl.textContent.replace(/^Subject\s*\d+:\s*/i, '').trim() : ('Cluster Subject ' + i);
          cleanName = truncateLabel(cleanName, 26);
          prereqs.push({ id: 'sub' + i, name: cleanName, pts: pts, letter: KCSE_PT_TO_LETTER[pts] });
          r += pts;
        }
        var wcp = Math.round(this.computeWcp(r, tVal) * 1000) / 1000;
        return {
          mode: 'standard',
          score: wcp,
          rawCluster: r,
          aggregate: tVal,
          band: this.getTier(wcp) + ' (Raw ' + r + '/48, KCSE ' + tVal + '/84)',
          prereqs: prereqs
        };
      },
      getDefaultFriendItems: function (mode, studentCtx) {
        var opts = [{ value: '', label: 'Grade' }].concat(KCSE_GRADES.map(function (g) {
          return { value: String(g.pts), label: g.label };
        }));
        var pNames = (studentCtx && studentCtx.prereqs)
          ? studentCtx.prereqs.map(function (p) { return p.name; })
          : ['Subject 1', 'Subject 2', 'Subject 3', 'Subject 4'];
        var list = [
          { id: 'aggregate', name: 'KCSE Aggregate', tag: '7-84', type: 'number', min: 7, max: 84, suffix: 'pts', placeholder: '7-84', val: null }
        ];
        for (var i = 0; i < 4; i++) {
          list.push({ id: 'sub' + (i + 1), name: pNames[i], tag: 'Cluster ' + (i + 1), type: 'select', options: opts, val: '' });
        }
        return list;
      },
      getSampleFriendItems: function (mode, studentCtx) {
        var items = this.getDefaultFriendItems(mode, studentCtx);
        items[0].val = 66;
        var sampleGrades = ['10', '9', '10', '9'];
        for (var i = 1; i <= 4; i++) items[i].val = sampleGrades[i - 1];
        return items;
      },
      calculateFriend: function (items) {
        var t = items[0] ? items[0].val : null;
        if (t === null || !isFinite(t) || t < 7 || t > 84) return null;
        var r = 0;
        for (var i = 1; i <= 4; i++) {
          var p = items[i] ? parseInt(items[i].val, 10) : NaN;
          if (!isFinite(p) || p < 1 || p > 12) return null;
          r += p;
        }
        var adapter = ADAPTERS['kuccps-cluster-points-calculator'];
        var wcp = Math.round(adapter.computeWcp(r, t) * 1000) / 1000;
        return {
          score: wcp,
          band: adapter.getTier(wcp) + ' (Raw ' + r + '/48, KCSE ' + t + '/84)',
          filledCount: 5
        };
      },
      validateMessage: 'Enter your friend\'s KCSE Aggregate (7-84) and all 4 cluster prerequisite grades.',
      formatScore: function (score) { return Number(score).toFixed(3); },
      formatDiff: function (absDiff) { return absDiff.toFixed(3) + ' cluster points'; },
      getSvgConfig: function () {
        return {
          min: 0,
          max: 48,
          invert: false,
          leftLabel: '0',
          rightLabel: '48.0 Max',
          guides: [
            { pct: (32 / 48) * 100, label: '32 Degree', strong: true },
            { pct: (42 / 48) * 100, label: '42 Top Tier', strong: false }
          ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName) {
        var lowestIdx = 0;
        for (var i = 1; i < studentCtx.prereqs.length; i++) {
          if (studentCtx.prereqs[i].pts < studentCtx.prereqs[lowestIdx].pts) lowestIdx = i;
        }
        var weak = studentCtx.prereqs[lowestIdx];
        if (weak.pts >= 12) {
          return {
            bestIndex: 0,
            suggestedSimVal: 12,
            html: 'All four of your cluster prerequisites are already at Grade A (12 pts). Next step: focus on maintaining high marks across your remaining KCSE Best-Seven subjects so your /84 aggregate stays near the ceiling.'
          };
        }
        var targetPts = Math.min(12, weak.pts + 2);
        var delta = targetPts - weak.pts;
        var newR = studentCtx.rawCluster + delta;
        var newT = Math.min(84, studentCtx.aggregate + delta);
        var newWcp = this.computeWcp(newR, newT);
        var gain = (newWcp - studentCtx.score).toFixed(3);
        var diff = studentCtx.score - friendCalc.score;
        var note = (diff < 0 && newWcp > friendCalc.score) ? ' and moves you ahead of ' + escapeHtml(friendName) : '';
        return {
          bestIndex: lowestIdx,
          suggestedSimVal: targetPts,
          html: '<strong>' + escapeHtml(weak.name) + ' (' + weak.letter + ' - ' + weak.pts + ' pts)</strong> carries triple per-subject weight inside the KUCCPS square-root formula: raising it to <strong>' + KCSE_PT_TO_LETTER[targetPts] + ' (' + targetPts + ' pts)</strong> adds <strong>+' + gain + ' cluster points</strong>' + note + '. Next step: prioritize KNEC Paper 1 and Paper 2 past papers in ' + escapeHtml(weak.name) + '.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var adapter = ADAPTERS['kuccps-cluster-points-calculator'];
        var idx = clampNum(itemIndex, 0, studentCtx.prereqs.length - 1);
        var chosen = studentCtx.prereqs[idx];
        return {
          selectLabel: 'Cluster Prerequisite',
          options: studentCtx.prereqs.map(function (p, i) {
            return { index: i, label: p.name + ' (now ' + p.letter + ' - ' + p.pts + ' pts)' };
          }),
          sliderLabel: 'Target KCSE Grade',
          min: 1,
          max: 12,
          step: 1,
          defaultVal: Math.min(12, chosen.pts + 2),
          formatSliderVal: function (v) { return KCSE_PT_TO_LETTER[v] + ' (' + v + ' pts)'; },
          simulate: function (v) {
            var delta = v - chosen.pts;
            var newR = clampNum(studentCtx.rawCluster + delta, 4, 48);
            var newT = clampNum(studentCtx.aggregate + delta, 7, 84);
            var proj = Math.round(adapter.computeWcp(newR, newT) * 1000) / 1000;
            var diff = proj - studentCtx.score;
            return {
              projectedScore: proj,
              projectedDisplay: proj.toFixed(3),
              changeDisplay: (diff >= 0 ? '+' : '') + diff.toFixed(3) + ' pts',
              changeState: diff > 0.002 ? 'pos' : (diff < -0.002 ? 'neg' : '')
            };
          }
        };
      },
      parseUrlItems: function (params, mode, studentCtx) {
        if (params.has('aggregate') && params.has('sub1')) {
          var items = this.getDefaultFriendItems(mode, studentCtx);
          var agg = parseFloat(params.get('aggregate'));
          if (isFinite(agg)) items[0].val = clampNum(agg, 7, 84);
          for (var i = 1; i <= 4; i++) {
            var sv = params.get('sub' + i);
            if (sv) items[i].val = sv;
          }
          return { mode: 'standard', items: items };
        }
        return null;
      }
    },

    /* 7. KCSE GRADE CALCULATOR */
    'kcse-grade-calculator': {
      formId: 'kcseForm',
      resetIds: ['resetBtn'],
      bannerDesc: 'Compare your KCSE Best-Seven aggregate (out of 84) and mean grade with a classmate.',
      emptyTitle: 'Calculate Your KCSE Mean Grade First',
      emptyDesc: 'Select your KNEC subject grades above and calculate your mean grade to compare with a classmate.',
      projectedLabel: 'Projected KCSE',
      higherIsBetter: true,
      tieEpsilon: 0.05,
      modes: [],
      computeKcseBest7: function (gMap) {
        var eng = parseInt(gMap.subEnglish, 10);
        var kis = parseInt(gMap.subKiswahili, 10);
        var mat = parseInt(gMap.subMaths, 10);
        if (isNaN(eng) || isNaN(kis) || isNaN(mat)) return null;
        var sciPool = [];
        if (!isNaN(parseInt(gMap.subBiology, 10))) sciPool.push({ id: 'subBiology', name: 'Biology', pts: parseInt(gMap.subBiology, 10) });
        if (!isNaN(parseInt(gMap.subChemistry, 10))) sciPool.push({ id: 'subChemistry', name: 'Chemistry', pts: parseInt(gMap.subChemistry, 10) });
        if (!isNaN(parseInt(gMap.subPhysics, 10))) sciPool.push({ id: 'subPhysics', name: 'Physics', pts: parseInt(gMap.subPhysics, 10) });
        if (sciPool.length < 2) return null;
        sciPool.sort(function (a, b) { return b.pts - a.pts; });
        var countedSci = sciPool.slice(0, 2);
        var remSci = sciPool.slice(2);

        var humPool = [];
        if (!isNaN(parseInt(gMap.subHistory, 10))) humPool.push({ id: 'subHistory', name: 'History & Govt', pts: parseInt(gMap.subHistory, 10) });
        if (!isNaN(parseInt(gMap.subGeography, 10))) humPool.push({ id: 'subGeography', name: 'Geography', pts: parseInt(gMap.subGeography, 10) });
        if (!isNaN(parseInt(gMap.subReligious, 10))) humPool.push({ id: 'subReligious', name: 'CRE / IRE / HRE', pts: parseInt(gMap.subReligious, 10) });
        if (humPool.length < 1) return null;
        humPool.sort(function (a, b) { return b.pts - a.pts; });
        var countedHum = humPool.slice(0, 1);
        var remHum = humPool.slice(1);

        var remPool = remSci.concat(remHum);
        if (!isNaN(parseInt(gMap.subApplied, 10))) remPool.push({ id: 'subApplied', name: 'Applied Subject', pts: parseInt(gMap.subApplied, 10) });
        if (!isNaN(parseInt(gMap.subLanguage, 10))) remPool.push({ id: 'subLanguage', name: 'Other Elective', pts: parseInt(gMap.subLanguage, 10) });
        if (remPool.length < 1) return null;
        remPool.sort(function (a, b) { return b.pts - a.pts; });

        var counted = [
          { id: 'subEnglish', name: 'English', tag: 'Core', pts: eng },
          { id: 'subKiswahili', name: 'Kiswahili', tag: 'Core', pts: kis },
          { id: 'subMaths', name: 'Mathematics', tag: 'Core', pts: mat },
          { id: countedSci[0].id, name: countedSci[0].name, tag: 'Science', pts: countedSci[0].pts },
          { id: countedSci[1].id, name: countedSci[1].name, tag: 'Science', pts: countedSci[1].pts },
          { id: countedHum[0].id, name: countedHum[0].name, tag: 'Humanity', pts: countedHum[0].pts },
          { id: remPool[0].id, name: remPool[0].name, tag: '7th Slot', pts: remPool[0].pts }
        ];
        var total = counted.reduce(function (s, x) { return s + x.pts; }, 0);
        return { total: total, letter: kcseMeanLetter(total), counted: counted };
      },
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var ids = ['subEnglish', 'subKiswahili', 'subMaths', 'subBiology', 'subChemistry', 'subPhysics', 'subHistory', 'subGeography', 'subReligious', 'subApplied', 'subLanguage'];
        var gMap = {};
        for (var i = 0; i < ids.length; i++) {
          var el = document.getElementById(ids[i]);
          gMap[ids[i]] = el ? el.value : '';
        }
        var calc = this.computeKcseBest7(gMap);
        if (!calc) return null;
        return {
          mode: 'standard',
          score: calc.total,
          letter: calc.letter,
          band: 'Mean Grade ' + calc.letter + ' (' + calc.total + ' / 84 pts)',
          gradeMap: gMap,
          counted: calc.counted
        };
      },
      getDefaultFriendItems: function () {
        var opts = [{ value: '', label: 'Grade' }].concat(KCSE_GRADES.map(function (g) {
          return { value: String(g.pts), label: g.label };
        }));
        var slots = [
          { id: 'f_s1', name: 'English', tag: 'Core' },
          { id: 'f_s2', name: 'Kiswahili', tag: 'Core' },
          { id: 'f_s3', name: 'Mathematics', tag: 'Core' },
          { id: 'f_s4', name: 'Best Science 1', tag: 'Group II' },
          { id: 'f_s5', name: 'Best Science 2', tag: 'Group II' },
          { id: 'f_s6', name: 'Best Humanity', tag: 'Group III' },
          { id: 'f_s7', name: 'Seventh Subject', tag: '7th Slot' }
        ];
        return slots.map(function (s) {
          return { id: s.id, name: s.name, tag: s.tag, type: 'select', options: opts, val: '' };
        });
      },
      getSampleFriendItems: function () {
        var items = this.getDefaultFriendItems();
        var sample = ['9', '9', '8', '9', '8', '10', '9'];
        for (var i = 0; i < items.length; i++) items[i].val = sample[i];
        return items;
      },
      calculateFriend: function (items) {
        var pts = items.map(function (it) { return parseInt(it.val, 10); }).filter(function (v) { return !isNaN(v) && v >= 1 && v <= 12; });
        if (pts.length < 7) return null;
        var sum = pts.slice(0, 7).reduce(function (a, b) { return a + b; }, 0);
        var letter = kcseMeanLetter(sum);
        return { score: sum, band: 'Mean Grade ' + letter + ' (' + sum + ' / 84 pts)', filledCount: 7 };
      },
      validateMessage: 'Select all 7 counted KCSE subject grades for your friend.',
      formatScore: function (score) { return Math.round(score) + ' / 84'; },
      formatDiff: function (absDiff) {
        var p = Math.round(absDiff);
        return p + (p === 1 ? ' KCSE point' : ' KCSE points');
      },
      getSvgConfig: function () {
        return {
          min: 0,
          max: 84,
          invert: false,
          leftLabel: '0',
          rightLabel: '84 Max (A)',
          guides: [
            { pct: (46 / 84) * 100, label: '46 C+ Univ.', strong: true },
            { pct: (67 / 84) * 100, label: '67 B+', strong: false }
          ]
        };
      },
      computeTip: function (studentCtx) {
        var counted = studentCtx.counted;
        var lowestIdx = 0;
        for (var i = 1; i < counted.length; i++) {
          var cur = counted[i];
          var best = counted[lowestIdx];
          if (cur.pts < best.pts || (cur.pts === best.pts && cur.tag === 'Core' && best.tag !== 'Core')) {
            lowestIdx = i;
          }
        }
        var weak = counted[lowestIdx];
        if (weak.pts >= 12) {
          return {
            bestIndex: 0,
            suggestedSimVal: 12,
            html: 'All 7 of your counted KCSE subjects are already at Grade A (84/84). Next step: check specific KUCCPS cluster subject weightings for your first-choice degree.'
          };
        }
        var thresholds = [11, 18, 25, 32, 39, 46, 53, 60, 67, 74, 81];
        var nextBoundary = 81;
        for (var b = 0; b < thresholds.length; b++) {
          if (thresholds[b] > studentCtx.score) {
            nextBoundary = thresholds[b];
            break;
          }
        }
        var needed = nextBoundary - studentCtx.score;
        var targetPts = Math.min(12, Math.max(weak.pts + 2, weak.pts + needed));
        var newTotal = studentCtx.score + (targetPts - weak.pts);
        var newLetter = kcseMeanLetter(newTotal);
        var coreNote = weak.tag === 'Core' ? ' (compulsory Group I subject that is always counted)' : '';
        return {
          bestIndex: lowestIdx,
          suggestedSimVal: targetPts,
          html: '<strong>' + escapeHtml(weak.name) + ' (' + KCSE_PT_TO_LETTER[weak.pts] + ' - ' + weak.pts + ' pts)' + coreNote + '</strong> is your biggest drag: lifting it to <strong>' + KCSE_PT_TO_LETTER[targetPts] + ' (' + targetPts + ' pts)</strong> raises your aggregate to <strong>' + newTotal + '/84 (Mean Grade ' + newLetter + ')</strong>. Next step: work through timed KNEC past papers in ' + escapeHtml(weak.name) + '.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var adapter = ADAPTERS['kcse-grade-calculator'];
        var counted = studentCtx.counted;
        var idx = clampNum(itemIndex, 0, counted.length - 1);
        var chosen = counted[idx];
        return {
          selectLabel: 'Counted Subject',
          options: counted.map(function (c, i) {
            return { index: i, label: c.name + ' (now ' + KCSE_PT_TO_LETTER[c.pts] + ' - ' + c.pts + ' pts)' };
          }),
          sliderLabel: 'Target KCSE Grade',
          min: 1,
          max: 12,
          step: 1,
          defaultVal: Math.min(12, chosen.pts + 2),
          formatSliderVal: function (v) { return KCSE_PT_TO_LETTER[v] + ' (' + v + ' pts)'; },
          simulate: function (v) {
            var testMap = Object.assign({}, studentCtx.gradeMap);
            testMap[chosen.id] = String(v);
            var res = adapter.computeKcseBest7(testMap);
            var proj = res ? res.total : (studentCtx.score + (v - chosen.pts));
            var letter = kcseMeanLetter(proj);
            var diff = proj - studentCtx.score;
            return {
              projectedScore: proj,
              projectedDisplay: proj + ' (' + letter + ')',
              changeDisplay: (diff >= 0 ? '+' : '') + diff + ' pts',
              changeState: diff > 0 ? 'pos' : (diff < 0 ? 'neg' : '')
            };
          }
        };
      },
      parseUrlItems: function (params) {
        if (params.has('subEnglish') && params.has('subKiswahili') && params.has('subMaths')) {
          var gMap = {};
          var ids = ['subEnglish', 'subKiswahili', 'subMaths', 'subBiology', 'subChemistry', 'subPhysics', 'subHistory', 'subGeography', 'subReligious', 'subApplied', 'subLanguage'];
          ids.forEach(function (k) { gMap[k] = params.get(k) || ''; });
          var calc = ADAPTERS['kcse-grade-calculator'].computeKcseBest7(gMap);
          if (calc) {
            var items = this.getDefaultFriendItems();
            for (var i = 0; i < 7; i++) {
              items[i].name = calc.counted[i].name;
              items[i].val = String(calc.counted[i].pts);
            }
            return { mode: 'standard', items: items };
          }
        }
        return null;
      }
    },

    /* 8. JAMB UTME SCORE CALCULATOR (0 to 400) */
    'jamb-score-calculator': {
      formId: 'jambForm',
      resetIds: ['resetBtn'],
      bannerDesc: 'Compare your JAMB UTME score out of 400 with a classmate and see which paper gives you the biggest lift.',
      emptyTitle: 'Calculate Your JAMB UTME Score First',
      emptyDesc: 'Enter your four UTME subject scores above and calculate your total to compare with a classmate.',
      projectedLabel: 'Projected UTME',
      higherIsBetter: true,
      tieEpsilon: 0.5,
      modes: [],
      bandForTotal: function (total) {
        if (total >= 300) return 'Elite (300+)';
        if (total >= 240) return 'Strong Federal Range';
        if (total >= 200) return 'Solid Degree Range';
        if (total >= 160) return 'State / Moderate Cutoff';
        if (total >= 140) return 'Minimum Degree Cutoff';
        return 'ND / NCE Range';
      },
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var tabQ = document.getElementById('tabQuestions');
        var isQ = !!(tabQ && tabQ.classList.contains('active'));
        var eRaw = parseFloat(document.getElementById('engScore').value);
        var s2Raw = parseFloat(document.getElementById('s2Score').value);
        var s3Raw = parseFloat(document.getElementById('s3Score').value);
        var s4Raw = parseFloat(document.getElementById('s4Score').value);
        if (!isFinite(eRaw) || !isFinite(s2Raw) || !isFinite(s3Raw) || !isFinite(s4Raw)) return null;

        var eScaled = isQ ? Math.round((eRaw / 60) * 100) : Math.round(eRaw);
        var s2Scaled = isQ ? Math.round((s2Raw / 40) * 100) : Math.round(s2Raw);
        var s3Scaled = isQ ? Math.round((s3Raw / 40) * 100) : Math.round(s3Raw);
        var s4Scaled = isQ ? Math.round((s4Raw / 40) * 100) : Math.round(s4Raw);

        var n2 = (document.getElementById('s2Name') && document.getElementById('s2Name').value.trim()) || 'Subject 2';
        var n3 = (document.getElementById('s3Name') && document.getElementById('s3Name').value.trim()) || 'Subject 3';
        var n4 = (document.getElementById('s4Name') && document.getElementById('s4Name').value.trim()) || 'Subject 4';

        var papers = [
          { id: 'engScore', name: 'Use of English', score: clampNum(eScaled, 0, 100), qCount: 60 },
          { id: 's2Score', name: n2, score: clampNum(s2Scaled, 0, 100), qCount: 40 },
          { id: 's3Score', name: n3, score: clampNum(s3Scaled, 0, 100), qCount: 40 },
          { id: 's4Score', name: n4, score: clampNum(s4Scaled, 0, 100), qCount: 40 }
        ];
        var total = papers[0].score + papers[1].score + papers[2].score + papers[3].score;
        return {
          mode: 'standard',
          score: total,
          band: this.bandForTotal(total) + ' - Avg ' + (total / 4).toFixed(1) + '%',
          papers: papers
        };
      },
      getDefaultFriendItems: function (mode, studentCtx) {
        var names = (studentCtx && studentCtx.papers)
          ? studentCtx.papers.map(function (p) { return p.name; })
          : ['Use of English', 'Subject 2', 'Subject 3', 'Subject 4'];
        return names.map(function (nm, i) {
          return { id: 'f_jamb_' + i, name: nm, tag: '/100', type: 'number', min: 0, max: 100, suffix: '', noSuffix: true, placeholder: '0-100', val: null };
        });
      },
      getSampleFriendItems: function (mode, studentCtx) {
        var items = this.getDefaultFriendItems(mode, studentCtx);
        var sample = [66, 72, 68, 64];
        for (var i = 0; i < items.length; i++) items[i].val = sample[i];
        return items;
      },
      calculateFriend: function (items) {
        var valid = items.filter(function (it) { return it.val !== null && isFinite(it.val); });
        if (valid.length < 4) return null;
        var sum = Math.round(valid.reduce(function (a, b) { return a + clampNum(b.val, 0, 100); }, 0));
        var adapter = ADAPTERS['jamb-score-calculator'];
        return {
          score: sum,
          band: adapter.bandForTotal(sum) + ' - Avg ' + (sum / 4).toFixed(1) + '%',
          filledCount: 4
        };
      },
      validateMessage: 'Enter all 4 scaled JAMB subject marks (0-100) for your friend.',
      formatScore: function (score) { return Math.round(score) + ' / 400'; },
      formatDiff: function (absDiff) {
        var p = Math.round(absDiff);
        return p + (p === 1 ? ' UTME mark' : ' UTME marks');
      },
      getSvgConfig: function () {
        return {
          min: 0,
          max: 400,
          invert: false,
          leftLabel: '0',
          rightLabel: '400 Max',
          guides: [
            { pct: (160 / 400) * 100, label: '160 Cutoff', strong: true },
            { pct: (250 / 400) * 100, label: '250 Strong', strong: false }
          ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName) {
        var lowestIdx = 0;
        for (var i = 1; i < studentCtx.papers.length; i++) {
          if (studentCtx.papers[i].score < studentCtx.papers[lowestIdx].score) lowestIdx = i;
        }
        var weak = studentCtx.papers[lowestIdx];
        if (weak.score >= 96) {
          return {
            bestIndex: 0,
            suggestedSimVal: 98,
            html: 'Your four UTME papers are already in the elite 95+ band. Next step: verify that your five O\'Level credits match the exact JAMB IBASS brochure prerequisites for your department.'
          };
        }
        var diff = studentCtx.score - friendCalc.score;
        var target = Math.min(92, Math.max(72, weak.score + 15));
        if (diff < 0 && weak.score + Math.abs(diff) + 2 <= 92) {
          target = Math.round(weak.score + Math.abs(diff) + 2);
        }
        if (target <= weak.score) target = Math.min(100, weak.score + 6);
        var gain = target - weak.score;
        var extraCorrect = weak.qCount === 40 ? Math.ceil(gain / 2.5) : Math.ceil(gain / (100 / 60));
        var outcome = (diff < 0 && studentCtx.score + gain > friendCalc.score)
          ? ' and moves you ahead of ' + escapeHtml(friendName)
          : ' to lift your total to <strong>' + (studentCtx.score + gain) + ' / 400</strong>';
        return {
          bestIndex: lowestIdx,
          suggestedSimVal: target,
          html: '<strong>' + escapeHtml(weak.name) + ' (' + weak.score + '/100)</strong> has your biggest margin for improvement: getting just <strong>' + extraCorrect + ' more CBT questions right</strong> lifts it to <strong>' + target + '/100 (+' + gain + ' marks)</strong>' + outcome + '. Next step: drill timed JAMB past CBT questions on high-frequency syllabus topics in ' + escapeHtml(weak.name) + '.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var idx = clampNum(itemIndex, 0, studentCtx.papers.length - 1);
        var chosen = studentCtx.papers[idx];
        return {
          selectLabel: 'UTME Paper',
          options: studentCtx.papers.map(function (p, i) {
            return { index: i, label: p.name + ' (now ' + p.score + ' / 100)' };
          }),
          sliderLabel: 'Target Subject Score',
          min: 0,
          max: 100,
          step: 1,
          defaultVal: Math.min(100, chosen.score + 14),
          formatSliderVal: function (v) { return v + ' / 100'; },
          simulate: function (v) {
            var gain = v - chosen.score;
            var proj = clampNum(studentCtx.score + gain, 0, 400);
            return {
              projectedScore: proj,
              projectedDisplay: proj + ' / 400',
              changeDisplay: (gain >= 0 ? '+' : '') + gain + ' marks',
              changeState: gain > 0 ? 'pos' : (gain < 0 ? 'neg' : '')
            };
          }
        };
      },
      parseUrlItems: function (params, mode, studentCtx) {
        if (params.has('engScore') && params.has('s2Score')) {
          var items = this.getDefaultFriendItems(mode, studentCtx);
          var keys = ['engScore', 's2Score', 's3Score', 's4Score'];
          for (var i = 0; i < 4; i++) {
            var v = parseFloat(params.get(keys[i]));
            if (isFinite(v)) items[i].val = clampNum(v, 0, 100);
          }
          return { mode: 'standard', items: items };
        }
        return null;
      }
    },

    /* 9. JAMB UTME + O'LEVEL COMPOSITE AGGREGATE CALCULATOR (out of 70) */
    'jamb-utme-aggregate-calculator': {
      formId: 'jambForm',
      resetIds: ['resetBtn'],
      bannerDesc: 'Compare your composite admission screening aggregate (out of 70.00) with a classmate.',
      emptyTitle: 'Calculate Your Screening Aggregate First',
      emptyDesc: 'Enter your JAMB UTME score and five O\'Level grades above to compare your composite score with a classmate.',
      projectedLabel: 'Projected Aggregate',
      higherIsBetter: true,
      tieEpsilon: 0.05,
      modes: [],
      bandForComposite: function (agg) {
        if (agg >= 60) return 'Top Merit Range (60+/70)';
        if (agg >= 50) return 'Strong Federal Range';
        if (agg >= 44) return 'Workable Screening Band';
        return 'Below Typical Cutoffs';
      },
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var utme = parseFloat(document.getElementById('jambScore').value);
        if (!isFinite(utme) || utme < 0 || utme > 400) return null;
        var labels = ['English Language', 'Mathematics', 'Subject 3', 'Subject 4', 'Subject 5'];
        var olevels = [];
        var oSum = 0;
        for (var i = 1; i <= 5; i++) {
          var gEl = document.getElementById('sub' + i);
          var g = gEl ? gEl.value : '';
          if (!g || !OLEVEL_JAMB_PTS[g]) return null;
          olevels.push({ id: 'sub' + i, name: labels[i - 1], grade: g, pts: OLEVEL_JAMB_PTS[g] });
          oSum += OLEVEL_JAMB_PTS[g];
        }
        var utmePart = utme / 8;
        var agg = Math.round((utmePart + oSum) * 100) / 100;
        return {
          mode: 'standard',
          score: agg,
          utme: utme,
          utmePart: utmePart,
          olevelPart: oSum,
          band: this.bandForComposite(agg) + ' (' + ((agg / 70) * 100).toFixed(1) + '%)',
          olevels: olevels
        };
      },
      getDefaultFriendItems: function () {
        var opts = [{ value: '', label: 'Grade' }].concat(OLEVEL_JAMB_GRADES.map(function (g) {
          return { value: g.grade, label: g.grade + ' (' + g.pts.toFixed(1) + ')' };
        }));
        return [
          { id: 'jambScore', name: 'JAMB UTME', tag: '/400', type: 'number', min: 0, max: 400, suffix: '', noSuffix: true, placeholder: '0-400', val: null },
          { id: 'sub1', name: 'English Language', tag: "O'Level", type: 'select', options: opts, val: '' },
          { id: 'sub2', name: 'Mathematics', tag: "O'Level", type: 'select', options: opts, val: '' },
          { id: 'sub3', name: 'Subject 3', tag: "O'Level", type: 'select', options: opts, val: '' },
          { id: 'sub4', name: 'Subject 4', tag: "O'Level", type: 'select', options: opts, val: '' },
          { id: 'sub5', name: 'Subject 5', tag: "O'Level", type: 'select', options: opts, val: '' }
        ];
      },
      getSampleFriendItems: function () {
        var items = this.getDefaultFriendItems();
        items[0].val = 264;
        var gs = ['B3', 'B2', 'B3', 'C4', 'B3'];
        for (var i = 1; i <= 5; i++) items[i].val = gs[i - 1];
        return items;
      },
      calculateFriend: function (items) {
        var utme = items[0] ? items[0].val : null;
        if (utme === null || !isFinite(utme) || utme < 0 || utme > 400) return null;
        var oSum = 0;
        for (var i = 1; i <= 5; i++) {
          var g = items[i] ? items[i].val : '';
          if (!g || !OLEVEL_JAMB_PTS[g]) return null;
          oSum += OLEVEL_JAMB_PTS[g];
        }
        var agg = Math.round(((utme / 8) + oSum) * 100) / 100;
        var adapter = ADAPTERS['jamb-utme-aggregate-calculator'];
        return {
          score: agg,
          band: adapter.bandForComposite(agg) + ' (' + ((agg / 70) * 100).toFixed(1) + '%)',
          filledCount: 6
        };
      },
      validateMessage: 'Enter your friend\'s JAMB UTME score (0-400) and all 5 O\'Level grades.',
      formatScore: function (score) { return Number(score).toFixed(2) + ' / 70'; },
      formatDiff: function (absDiff) { return absDiff.toFixed(2) + ' composite points'; },
      getSvgConfig: function () {
        return {
          min: 0,
          max: 70,
          invert: false,
          leftLabel: '0',
          rightLabel: '70 Max',
          guides: [
            { pct: (44 / 70) * 100, label: '44 Workable', strong: true },
            { pct: (55 / 70) * 100, label: '55 Strong', strong: false }
          ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName) {
        var utmeHeadroom = (400 - studentCtx.utme) / 8;
        var lowestOIdx = 0;
        for (var i = 1; i < studentCtx.olevels.length; i++) {
          if (studentCtx.olevels[i].pts < studentCtx.olevels[lowestOIdx].pts) lowestOIdx = i;
        }
        var weakO = studentCtx.olevels[lowestOIdx];
        var oHeadroom = 4.0 - weakO.pts;

        if (utmeHeadroom >= 4.0 && studentCtx.utme < 320) {
          var targetUtme = Math.min(360, Math.round(studentCtx.utme + 32));
          var uGain = ((targetUtme - studentCtx.utme) / 8).toFixed(2);
          return {
            bestIndex: 0,
            suggestedSimVal: targetUtme,
            html: '<strong>JAMB UTME (' + studentCtx.utme + '/400, contributing ' + studentCtx.utmePart.toFixed(2) + '/50 pts)</strong> carries 71% of the 70-point composite scale: adding <strong>+' + (targetUtme - studentCtx.utme) + ' UTME marks</strong> to reach <strong>' + targetUtme + '</strong> banks <strong>+' + uGain + ' composite points</strong>. Next step: target your lowest UTME paper with timed CBT practice.'
          };
        }

        if (oHeadroom > 0.1) {
          var tgtGrade = weakO.pts <= 2.8 ? 'B2' : 'A1';
          var oGain = (OLEVEL_JAMB_PTS[tgtGrade] - weakO.pts).toFixed(2);
          var simSlider = OLEVEL_SLIDER_ORDER.indexOf(tgtGrade);
          return {
            bestIndex: lowestOIdx + 1,
            suggestedSimVal: simSlider !== -1 ? simSlider : 5,
            html: '<strong>O\'Level ' + escapeHtml(weakO.name) + ' (' + weakO.grade + ' - ' + weakO.pts.toFixed(1) + ' pts)</strong> is your highest-value credit to upgrade: lifting it to <strong>' + tgtGrade + '</strong> adds <strong>+' + oGain + ' screening points</strong>' + (studentCtx.score < friendCalc.score ? ' toward ' + escapeHtml(friendName) + "'s composite" : '') + '. Next step: consider a WAEC/NECO GCE upgrade sitting if departmental cutoffs are tight.'
          };
        }

        return {
          bestIndex: 0,
          suggestedSimVal: Math.min(400, studentCtx.utme + 12),
          html: 'Your UTME and five O\'Level credits are already near the top of the 70-point screening table. Next step: monitor your first-choice institution\'s CAPS cutoff release closely.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var options = [{ index: 0, label: 'JAMB UTME (now ' + studentCtx.utme + ' / 400)' }];
        for (var i = 0; i < studentCtx.olevels.length; i++) {
          var o = studentCtx.olevels[i];
          options.push({ index: i + 1, label: "O'Level " + o.name + ' (now ' + o.grade + ' - ' + o.pts.toFixed(1) + ')' });
        }
        var idx = clampNum(itemIndex, 0, options.length - 1);
        if (idx === 0) {
          return {
            selectLabel: 'Screening Component',
            options: options,
            sliderLabel: 'Target JAMB UTME',
            min: 0,
            max: 400,
            step: 4,
            defaultVal: Math.min(400, Math.round(studentCtx.utme + 24)),
            formatSliderVal: function (v) { return v + ' / 400'; },
            simulate: function (v) {
              var gain = (v - studentCtx.utme) / 8;
              var proj = clampNum(Math.round((studentCtx.score + gain) * 100) / 100, 0, 70);
              return {
                projectedScore: proj,
                projectedDisplay: proj.toFixed(2) + ' / 70',
                changeDisplay: (gain >= 0 ? '+' : '') + gain.toFixed(2) + ' pts',
                changeState: gain > 0.01 ? 'pos' : (gain < -0.01 ? 'neg' : '')
              };
            }
          };
        }
        var chosenO = studentCtx.olevels[idx - 1];
        var curPos = OLEVEL_SLIDER_ORDER.indexOf(chosenO.grade);
        return {
          selectLabel: 'Screening Component',
          options: options,
          sliderLabel: "Target O'Level Grade",
          min: 0,
          max: 5,
          step: 1,
          defaultVal: clampNum(curPos + 2, 0, 5),
          formatSliderVal: function (v) {
            var g = OLEVEL_SLIDER_ORDER[v] || 'A1';
            return g + ' (' + OLEVEL_JAMB_PTS[g].toFixed(1) + ' pts)';
          },
          simulate: function (v) {
            var g = OLEVEL_SLIDER_ORDER[v] || chosenO.grade;
            var gain = OLEVEL_JAMB_PTS[g] - chosenO.pts;
            var proj = clampNum(Math.round((studentCtx.score + gain) * 100) / 100, 0, 70);
            return {
              projectedScore: proj,
              projectedDisplay: proj.toFixed(2) + ' / 70',
              changeDisplay: (gain >= 0 ? '+' : '') + gain.toFixed(2) + ' pts',
              changeState: gain > 0.01 ? 'pos' : (gain < -0.01 ? 'neg' : '')
            };
          }
        };
      },
      parseUrlItems: function (params) {
        if (params.has('jambScore') && params.has('sub1')) {
          var items = this.getDefaultFriendItems();
          var u = parseFloat(params.get('jambScore'));
          if (isFinite(u)) items[0].val = clampNum(u, 0, 400);
          for (var i = 1; i <= 5; i++) {
            var g = params.get('sub' + i);
            if (g && OLEVEL_JAMB_PTS[g]) items[i].val = g;
          }
          return { mode: 'standard', items: items };
        }
        return null;
      }
    },

    /* 10. UNIVERSITY / COLLEGE GPA CALCULATOR (4.00 Scale) */
    'gpa-calculator': {
      formId: 'courseList',
      resetIds: ['clearBtn'],
      wideGrid: true,
      bannerDesc: 'Compare your GPA (4.00 scale) with a classmate and see which high-credit course boosts your standing most.',
      emptyTitle: 'Calculate Your GPA First',
      emptyDesc: 'Add your courses, grades, and credit hours above and calculate your GPA to compare with a classmate.',
      projectedLabel: 'Projected GPA',
      higherIsBetter: true,
      tieEpsilon: 0.005,
      modes: [],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var rows = document.querySelectorAll('#courseList .course-row');
        var courses = [];
        var totalQuality = 0;
        var totalCredits = 0;
        rows.forEach(function (row, idx) {
          var nEl = row.querySelector('.course-name');
          var gEl = row.querySelector('select');
          var cEl = row.querySelector('input[type="number"]');
          var g = gEl ? gEl.value : '';
          var cr = cEl ? parseFloat(cEl.value) : NaN;
          if (g && GPA_PTS[g] !== undefined && isFinite(cr) && cr > 0) {
            var nm = (nEl && nEl.value.trim()) || ('Course ' + (courses.length + 1));
            courses.push({
              id: 'course_' + idx,
              name: nm,
              grade: g,
              pts: GPA_PTS[g],
              credits: cr
            });
            totalQuality += GPA_PTS[g] * cr;
            totalCredits += cr;
          }
        });
        if (courses.length === 0 || totalCredits <= 0) return null;
        var gpa = Math.round((totalQuality / totalCredits) * 100) / 100;
        return {
          mode: 'standard',
          score: gpa,
          rawGpa: totalQuality / totalCredits,
          totalQuality: totalQuality,
          totalCredits: totalCredits,
          band: gpaStandingLabel(gpa) + ' (' + totalCredits + ' credits)',
          courses: courses
        };
      },
      getDefaultFriendItems: function (mode, studentCtx) {
        var opts = [{ value: '', label: 'Grade' }].concat(GPA_GRADES.map(function (g) {
          return { value: g.grade, label: g.grade + ' (' + g.pts.toFixed(1) + ')' };
        }));
        var baseCourses = (studentCtx && studentCtx.courses && studentCtx.courses.length > 0)
          ? studentCtx.courses
          : [
              { name: 'Course 1', credits: 3 },
              { name: 'Course 2', credits: 3 },
              { name: 'Course 3', credits: 3 },
              { name: 'Course 4', credits: 3 }
            ];
        return baseCourses.map(function (c, i) {
          return {
            id: 'f_gpa_' + i,
            name: c.name,
            tag: c.credits + ' cr',
            type: 'dual-gpa',
            options: opts,
            val: '',
            aux: c.credits
          };
        });
      },
      getSampleFriendItems: function (mode, studentCtx) {
        var items = this.getDefaultFriendItems(mode, studentCtx);
        var sampleGrades = ['B+', 'A-', 'B', 'B+', 'A', 'B-'];
        for (var i = 0; i < items.length; i++) {
          items[i].val = sampleGrades[i % sampleGrades.length];
          if (!items[i].aux || !isFinite(items[i].aux)) items[i].aux = 3;
        }
        return items;
      },
      calculateFriend: function (items) {
        var tQual = 0;
        var tCred = 0;
        var count = 0;
        for (var i = 0; i < items.length; i++) {
          var g = items[i].val;
          var cr = parseFloat(items[i].aux);
          if (g && GPA_PTS[g] !== undefined && isFinite(cr) && cr > 0) {
            tQual += GPA_PTS[g] * cr;
            tCred += cr;
            count++;
          }
        }
        if (count === 0 || tCred <= 0) return null;
        var gpa = Math.round((tQual / tCred) * 100) / 100;
        return {
          score: gpa,
          band: gpaStandingLabel(gpa) + ' (' + tCred + ' credits)',
          filledCount: count
        };
      },
      validateMessage: 'Select at least one course grade and credit hours for your friend.',
      formatScore: function (score) { return Number(score).toFixed(2); },
      formatDiff: function (absDiff) { return absDiff.toFixed(2) + ' GPA points'; },
      getSvgConfig: function () {
        return {
          min: 0,
          max: 4.0,
          invert: false,
          leftLabel: '0.00',
          rightLabel: '4.00 Max',
          guides: [
            { pct: 50, label: '2.00 Standing', strong: true },
            { pct: 87.5, label: '3.50 Honours', strong: false }
          ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName) {
        var bestIdx = 0;
        var bestUpside = -1;
        for (var i = 0; i < studentCtx.courses.length; i++) {
          var c = studentCtx.courses[i];
          var upside = (4.0 - c.pts) * (c.credits / studentCtx.totalCredits);
          if (upside > bestUpside) {
            bestUpside = upside;
            bestIdx = i;
          }
        }
        var chosen = studentCtx.courses[bestIdx] || studentCtx.courses[0];
        if (bestUpside <= 0.01) {
          return {
            bestIndex: 0,
            suggestedSimVal: 11,
            html: 'Your courses are already at A (4.00). Next step: protect your study hours on your highest-credit modules to maintain summa cum laude standing.'
          };
        }
        var curPos = GPA_SLIDER_ORDER.indexOf(chosen.grade);
        var tgtPos = clampNum(curPos + 3, 0, 11);
        var tgtGrade = GPA_SLIDER_ORDER[tgtPos];
        var gain = ((GPA_PTS[tgtGrade] - chosen.pts) * chosen.credits) / studentCtx.totalCredits;
        var newGpa = Math.round((studentCtx.rawGpa + gain) * 100) / 100;
        var tail = (studentCtx.score < friendCalc.score && newGpa >= friendCalc.score)
          ? ' and moves you ahead of ' + escapeHtml(friendName)
          : ' to lift your GPA to <strong>' + newGpa.toFixed(2) + '</strong>';
        return {
          bestIndex: bestIdx,
          suggestedSimVal: tgtPos,
          html: '<strong>' + escapeHtml(chosen.name) + ' (' + chosen.credits + ' credits, Grade ' + chosen.grade + ')</strong> carries your largest GPA leverage: raising it to <strong>' + tgtGrade + '</strong> adds <strong>+' + gain.toFixed(2) + ' GPA points</strong>' + tail + '. Next step: allocate extra weekly problem-set and past-exam practice to high-credit modules first.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var courses = studentCtx.courses;
        var idx = clampNum(itemIndex, 0, courses.length - 1);
        var chosen = courses[idx];
        var curPos = GPA_SLIDER_ORDER.indexOf(chosen.grade);
        return {
          selectLabel: 'Course',
          options: courses.map(function (c, i) {
            return { index: i, label: c.name + ' (' + c.credits + ' cr - now ' + c.grade + ')' };
          }),
          sliderLabel: 'Target Course Grade',
          min: 0,
          max: 11,
          step: 1,
          defaultVal: clampNum(curPos + 2, 0, 11),
          formatSliderVal: function (v) {
            var g = GPA_SLIDER_ORDER[v] || 'A';
            return g + ' (' + GPA_PTS[g].toFixed(1) + ')';
          },
          simulate: function (v) {
            var g = GPA_SLIDER_ORDER[v] || chosen.grade;
            var newPts = GPA_PTS[g];
            var delta = ((newPts - chosen.pts) * chosen.credits) / studentCtx.totalCredits;
            var proj = clampNum(Math.round((studentCtx.rawGpa + delta) * 100) / 100, 0, 4.0);
            return {
              projectedScore: proj,
              projectedDisplay: proj.toFixed(2),
              changeDisplay: (delta >= 0 ? '+' : '') + delta.toFixed(2) + ' GPA',
              changeState: delta > 0.004 ? 'pos' : (delta < -0.004 ? 'neg' : '')
            };
          }
        };
      },
      parseUrlItems: function (params, mode, studentCtx) {
        if (params.has('course1Grade') || params.has('course0Grade')) {
          var items = [];
          var opts = [{ value: '', label: 'Grade' }].concat(GPA_GRADES.map(function (g) {
            return { value: g.grade, label: g.grade + ' (' + g.pts.toFixed(1) + ')' };
          }));
          for (var n = 0; n <= 12; n++) {
            var gr = params.get('course' + n + 'Grade');
            var cr = parseFloat(params.get('course' + n + 'Credits'));
            var nm = params.get('course' + n + 'Name') || ('Course ' + (items.length + 1));
            if (gr && GPA_PTS[gr] !== undefined) {
              var cVal = isFinite(cr) && cr > 0 ? cr : 3;
              items.push({ id: 'f_gpa_' + items.length, name: nm, tag: cVal + ' cr', type: 'dual-gpa', options: opts, val: gr, aux: cVal });
            }
          }
          if (items.length > 0) return { mode: 'standard', items: items };
        }
        return null;
      }
    },

    /* 11. TERTIARY GPA & CGPA CALCULATOR (5.0 & 4.0 SCALES) */
    'tertiary-gpa-cgpa-calculator': {
      formId: 'gpaForm',
      resetIds: ['resetBtn'],
      wideGrid: true,
      bannerDesc: 'Compare your semester GPA or cumulative CGPA with a classmate on the same grading scale and identify the highest-leverage course to improve.',
      emptyTitle: 'Calculate Your GPA First',
      emptyDesc: 'Select your course grades and credit units above, then calculate your GPA to compare with a classmate.',
      projectedLabel: 'Projected GPA',
      higherIsBetter: true,
      tieEpsilon: 0.015,
      modes: [
        { id: 'standard', label: 'Course Grades' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var scaleEl = document.getElementById('scaleSelect');
        var scaleVal = (scaleEl && scaleEl.value === '4') ? '4' : '5';
        var ptsMap = scaleVal === '5' ? TERTIARY_P5 : TERTIARY_P4;
        var maxScale = scaleVal === '5' ? 5.0 : 4.0;
        var rows = document.querySelectorAll('#courseList .course-row');
        var courses = [];
        var semCr = 0;
        var semQp = 0;
        for (var i = 0; i < rows.length; i++) {
          var r = rows[i];
          var nameEl = r.querySelector('.course-name-input');
          var gEl = r.querySelector('.course-grade-select');
          var cEl = r.querySelector('.course-credit-select');
          var g = gEl ? gEl.value : '';
          var c = cEl ? parseFloat(cEl.value) : NaN;
          if (!g || !isFinite(c) || c <= 0 || ptsMap[g] === undefined) continue;
          var nm = (nameEl && nameEl.value.trim()) ? nameEl.value.trim() : ('Course ' + (courses.length + 1));
          courses.push({ name: nm, grade: g, pts: ptsMap[g], credits: c });
          semCr += c;
          semQp += c * ptsMap[g];
        }
        if (courses.length === 0 || semCr <= 0) return null;
        var prevCrEl = document.getElementById('prevCredits');
        var prevCgEl = document.getElementById('prevCgpa');
        var pc = prevCrEl ? parseFloat(prevCrEl.value) : NaN;
        var pg = prevCgEl ? parseFloat(prevCgEl.value) : NaN;
        var totalCr = semCr;
        var totalQp = semQp;
        var isCum = false;
        if (isFinite(pc) && pc > 0 && isFinite(pg) && pg >= 0 && pg <= maxScale) {
          totalCr = semCr + pc;
          totalQp = semQp + (pc * pg);
          isCum = true;
        }
        var gpa = totalQp / totalCr;
        var rounded = Math.round(gpa * 100) / 100;
        return {
          mode: 'standard',
          scaleVal: scaleVal,
          maxScore: maxScale,
          isCum: isCum,
          score: rounded,
          rawGpa: gpa,
          totalCredits: totalCr,
          band: tertiaryClassify(scaleVal, rounded) + ' (' + scaleVal + '.0 scale)',
          courses: courses
        };
      },
      getDefaultFriendItems: function (mode, studentCtx) {
        var scaleVal = (studentCtx && studentCtx.scaleVal) ? studentCtx.scaleVal : '5';
        var order = scaleVal === '5' ? TERTIARY_ORDER_5 : TERTIARY_ORDER_4;
        var ptsMap = scaleVal === '5' ? TERTIARY_P5 : TERTIARY_P4;
        var opts = [{ value: '', label: 'Grade' }].concat(order.slice().reverse().map(function (g) {
          return { value: g, label: g + ' (' + ptsMap[g].toFixed(1) + ')' };
        }));
        var count = (studentCtx && studentCtx.courses.length) ? Math.max(4, studentCtx.courses.length) : 4;
        var list = [];
        for (var i = 0; i < count; i++) {
          var nm = (studentCtx && studentCtx.courses[i]) ? studentCtx.courses[i].name : ('Course ' + (i + 1));
          var cr = (studentCtx && studentCtx.courses[i]) ? studentCtx.courses[i].credits : 3;
          list.push({ id: 'f_tgpa_' + i, name: nm, tag: cr + ' cr', type: 'dual-gpa', options: opts, val: '', aux: cr });
        }
        return list;
      },
      getSampleFriendItems: function (mode, studentCtx) {
        var items = this.getDefaultFriendItems(mode, studentCtx);
        var samp5 = ['A', 'B', 'B', 'C', 'A', 'B', 'B', 'C'];
        var samp4 = ['A', 'B', 'B', 'C', 'A', 'B', 'B', 'C'];
        var samp = (studentCtx && studentCtx.scaleVal === '4') ? samp4 : samp5;
        for (var i = 0; i < items.length; i++) {
          items[i].val = samp[i % samp.length];
          if (!items[i].aux) items[i].aux = 3;
        }
        return items;
      },
      calculateFriend: function (items, mode, studentCtx) {
        var scaleVal = (studentCtx && studentCtx.scaleVal) ? studentCtx.scaleVal : '5';
        var ptsMap = scaleVal === '5' ? TERTIARY_P5 : TERTIARY_P4;
        var cr = 0;
        var qp = 0;
        var count = 0;
        for (var i = 0; i < items.length; i++) {
          var g = items[i].val;
          var c = (items[i].aux !== null && isFinite(items[i].aux) && items[i].aux > 0) ? items[i].aux : 3;
          if (g && ptsMap[g] !== undefined) {
            cr += c;
            qp += ptsMap[g] * c;
            count++;
          }
        }
        if (count === 0 || cr <= 0) return null;
        var gpa = Math.round((qp / cr) * 100) / 100;
        return {
          score: gpa,
          maxScore: scaleVal === '5' ? 5.0 : 4.0,
          filledCount: count,
          band: tertiaryClassify(scaleVal, gpa) + ' (' + cr + ' units)'
        };
      },
      validateMessage: 'Select at least one course grade for your friend to compare GPAs.',
      formatScore: function (val) { return val.toFixed(2); },
      formatDiff: function (absDiff) { return absDiff.toFixed(2) + ' GPA points'; },
      getSvgConfig: function (mode, studentComp) {
        var is4 = studentComp && studentComp.maxScore === 4;
        return {
          min: 0,
          max: is4 ? 4.0 : 5.0,
          invert: false,
          leftLabel: '0.00',
          rightLabel: is4 ? '4.00 Max' : '5.00 Max',
          guides: is4
            ? [
                { pct: 75, label: '3.00 2:1', strong: true },
                { pct: 90, label: '3.60 1st', strong: false }
              ]
            : [
                { pct: 70, label: '3.50 2:1', strong: true },
                { pct: 90, label: '4.50 1st', strong: false }
              ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName) {
        var maxPts = studentCtx.maxScore;
        var order = studentCtx.scaleVal === '5' ? TERTIARY_ORDER_5 : TERTIARY_ORDER_4;
        var ptsMap = studentCtx.scaleVal === '5' ? TERTIARY_P5 : TERTIARY_P4;
        var bestIdx = 0;
        var bestUpside = -1;
        for (var i = 0; i < studentCtx.courses.length; i++) {
          var c = studentCtx.courses[i];
          var upside = (maxPts - c.pts) * (c.credits / studentCtx.totalCredits);
          if (upside > bestUpside) {
            bestUpside = upside;
            bestIdx = i;
          }
        }
        var chosen = studentCtx.courses[bestIdx] || studentCtx.courses[0];
        if (bestUpside <= 0.005) {
          return {
            bestIndex: 0,
            suggestedSimVal: order.length - 1,
            html: 'Every semester course is already at Grade A (' + maxPts.toFixed(1) + '). Next step: defend your continuous assessment marks in high-credit modules to keep First Class standing.'
          };
        }
        var curPos = order.indexOf(chosen.grade);
        var tgtPos = clampNum(curPos + 1, 0, order.length - 1);
        if (tgtPos === curPos && curPos < order.length - 1) tgtPos = order.length - 1;
        var tgtGrade = order[tgtPos];
        var gain = ((ptsMap[tgtGrade] - chosen.pts) * chosen.credits) / studentCtx.totalCredits;
        var newGpa = Math.round((studentCtx.rawGpa + gain) * 100) / 100;
        var tail = (studentCtx.score < friendCalc.score && newGpa >= friendCalc.score)
          ? ' and moves you ahead of ' + escapeHtml(friendName)
          : ' to reach <strong>' + newGpa.toFixed(2) + '</strong>';
        return {
          bestIndex: bestIdx,
          suggestedSimVal: tgtPos,
          html: '<strong>' + escapeHtml(chosen.name) + ' (' + chosen.credits + ' credits, Grade ' + chosen.grade + ')</strong> has the largest impact on your record: lifting it to <strong>' + tgtGrade + '</strong> adds <strong>+' + gain.toFixed(2) + ' GPA points</strong>' + tail + '. Next step: prioritize continuous assessment tests and past papers for your highest-credit courses.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var order = studentCtx.scaleVal === '5' ? TERTIARY_ORDER_5 : TERTIARY_ORDER_4;
        var ptsMap = studentCtx.scaleVal === '5' ? TERTIARY_P5 : TERTIARY_P4;
        var idx = clampNum(itemIndex, 0, studentCtx.courses.length - 1);
        var chosen = studentCtx.courses[idx];
        var curPos = Math.max(0, order.indexOf(chosen.grade));
        var maxIdx = order.length - 1;
        return {
          selectLabel: 'Semester Course',
          options: studentCtx.courses.map(function (c, i) {
            return { index: i, label: c.name + ' (' + c.credits + ' cr - now ' + c.grade + ')' };
          }),
          sliderLabel: 'Target Course Grade',
          min: 0,
          max: maxIdx,
          step: 1,
          defaultVal: clampNum(curPos + 1, 0, maxIdx),
          formatSliderVal: function (v) {
            var g = order[v] || 'A';
            return g + ' (' + ptsMap[g].toFixed(1) + ')';
          },
          simulate: function (v) {
            var g = order[v] || chosen.grade;
            var delta = ((ptsMap[g] - chosen.pts) * chosen.credits) / studentCtx.totalCredits;
            var proj = clampNum(Math.round((studentCtx.rawGpa + delta) * 100) / 100, 0, studentCtx.maxScore);
            return {
              projectedScore: proj,
              projectedDisplay: proj.toFixed(2),
              changeDisplay: (delta >= 0 ? '+' : '') + delta.toFixed(2) + ' GPA',
              changeState: delta > 0.004 ? 'pos' : (delta < -0.004 ? 'neg' : '')
            };
          }
        };
      }
    },

    /* 12. WAEC GRADE & AVERAGE MARK CALCULATOR */
    'waec-grade-calculator': {
      formId: 'waecForm',
      resetIds: ['resetBtn'],
      bannerDesc: 'Compare your WASSCE percentage average and credit profile with a classmate and pinpoint the best subject to boost your university eligibility.',
      emptyTitle: 'Calculate Your WAEC Grades First',
      emptyDesc: 'Enter at least five WAEC subjects and percentage marks above, then click Calculate to compare with a friend.',
      projectedLabel: 'Projected Average',
      higherIsBetter: true,
      tieEpsilon: 0.05,
      modes: [
        { id: 'standard', label: 'Subject Marks (%)' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var rows = document.querySelectorAll('#subjectRowsContainer .subject-row');
        var subjects = [];
        for (var i = 0; i < rows.length; i++) {
          var nEl = rows[i].querySelector('.subj-name');
          var mEl = rows[i].querySelector('.subj-mark');
          var nm = nEl ? nEl.value.trim() : '';
          var mk = mEl ? parseFloat(mEl.value) : NaN;
          if (nm && isFinite(mk) && mk >= 0 && mk <= 100) {
            subjects.push({ name: nm, mark: mk, info: waecGradeFromMark(mk) });
          }
        }
        if (subjects.length < 5) return null;
        var sum = subjects.reduce(function (a, b) { return a + b.mark; }, 0);
        var avg = sum / subjects.length;
        var credits = subjects.filter(function (s) { return s.info.pts >= 2.0; }).length;
        var distinctions = subjects.filter(function (s) { return s.info.type === 'distinction'; }).length;
        return {
          mode: 'standard',
          score: Math.round(avg * 10) / 10,
          rawAvg: avg,
          maxScore: 100,
          band: credits + ' credits, ' + distinctions + ' distinctions (' + subjects.length + ' subjects)',
          subjects: subjects
        };
      },
      getDefaultFriendItems: function (mode, studentCtx) {
        var count = (studentCtx && studentCtx.subjects.length) ? studentCtx.subjects.length : 8;
        var defaults = ['English Language', 'General Mathematics', 'Biology', 'Chemistry', 'Physics', 'Economics', 'Civic Education', 'Further Mathematics', 'Geography'];
        var list = [];
        for (var i = 0; i < count; i++) {
          var nm = (studentCtx && studentCtx.subjects[i]) ? studentCtx.subjects[i].name : (defaults[i] || ('Subject ' + (i + 1)));
          list.push({ id: 'f_waec_' + i, name: nm, tag: '0-100%', type: 'number', min: 0, max: 100, suffix: '%', placeholder: '0-100', val: null });
        }
        return list;
      },
      getSampleFriendItems: function (mode, studentCtx) {
        var items = this.getDefaultFriendItems(mode, studentCtx);
        var samp = [66, 71, 64, 69, 62, 74, 68, 60, 65];
        for (var i = 0; i < items.length; i++) {
          items[i].val = samp[i % samp.length];
        }
        return items;
      },
      calculateFriend: function (items) {
        var valid = items.filter(function (it) { return it.val !== null && isFinite(it.val); });
        if (valid.length < 5) return null;
        var sum = valid.reduce(function (a, b) { return a + b.val; }, 0);
        var avg = Math.round((sum / valid.length) * 10) / 10;
        var credits = valid.filter(function (it) { return it.val >= 50; }).length;
        var distinctions = valid.filter(function (it) { return it.val >= 65; }).length;
        return {
          score: avg,
          maxScore: 100,
          filledCount: valid.length,
          band: credits + ' credits, ' + distinctions + ' distinctions'
        };
      },
      validateMessage: 'Enter at least 5 subject marks (0-100%) for your friend to compare WAEC averages.',
      formatScore: function (val) { return val.toFixed(1) + '%'; },
      formatDiff: function (absDiff) { return absDiff.toFixed(1) + ' percentage points'; },
      getSvgConfig: function () {
        return {
          min: 0,
          max: 100,
          invert: false,
          leftLabel: '0%',
          rightLabel: '100%',
          guides: [
            { pct: 50, label: '50% C6 Credit', strong: true },
            { pct: 75, label: '75% A1', strong: false }
          ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName) {
        var subs = studentCtx.subjects;
        var bestIdx = 0;
        // Priority 1: Compulsory English or Maths below 50% C6 credit
        var coreIdx = -1;
        for (var i = 0; i < subs.length; i++) {
          var lowName = subs[i].name.toLowerCase();
          if ((lowName.indexOf('english') !== -1 || lowName.indexOf('math') !== -1) && subs[i].mark < 50) {
            coreIdx = i;
            break;
          }
        }
        if (coreIdx !== -1) {
          bestIdx = coreIdx;
        } else {
          var minMark = 101;
          for (var j = 0; j < subs.length; j++) {
            if (subs[j].mark < minMark) {
              minMark = subs[j].mark;
              bestIdx = j;
            }
          }
        }
        var chosen = subs[bestIdx];
        if (chosen.mark >= 95) {
          return {
            bestIndex: bestIdx,
            suggestedSimVal: 98,
            html: 'All entered subjects are already at A1 distinction level. Next step: maintain timed WAEC past-paper practice across Paper 1 objectives and Paper 2 theory.'
          };
        }
        var tgt = chosen.mark < 50 ? 55 : clampNum(Math.round(chosen.mark + 12), 50, 92);
        var newGrade = waecGradeFromMark(tgt).grade;
        var gain = (tgt - chosen.mark) / subs.length;
        var newAvg = Math.round((studentCtx.rawAvg + gain) * 10) / 10;
        var reason = chosen.mark < 50
          ? 'clears the mandatory C6 (50%) university credit threshold and '
          : 'upgrades it from ' + chosen.info.grade + ' to <strong>' + newGrade + '</strong> and ';
        var tail = (studentCtx.score < friendCalc.score && newAvg >= friendCalc.score)
          ? 'moves you ahead of ' + escapeHtml(friendName)
          : 'lifts your average to <strong>' + newAvg.toFixed(1) + '%</strong>';
        return {
          bestIndex: bestIdx,
          suggestedSimVal: tgt,
          html: 'Raising <strong>' + escapeHtml(chosen.name) + '</strong> from ' + chosen.mark.toFixed(0) + '% (' + chosen.info.grade + ') to <strong>' + tgt + '%</strong> ' + reason + tail + '. Next step: drill WAEC chief-examiner marking schemes on high-frequency theory questions in ' + escapeHtml(chosen.name) + '.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var subs = studentCtx.subjects;
        var idx = clampNum(itemIndex, 0, subs.length - 1);
        var chosen = subs[idx];
        return {
          selectLabel: 'WAEC Subject',
          options: subs.map(function (s, i) {
            return { index: i, label: s.name + ' (Now ' + s.mark.toFixed(0) + '% / ' + s.info.grade + ')' };
          }),
          sliderLabel: 'Hypothetical Subject Mark',
          min: 0,
          max: 100,
          step: 1,
          defaultVal: clampNum(Math.round(chosen.mark + 10), 0, 100),
          formatSliderVal: function (v) {
            return Math.round(v) + '% (' + waecGradeFromMark(v).grade + ')';
          },
          simulate: function (v) {
            var delta = (v - chosen.mark) / subs.length;
            var proj = clampNum(Math.round((studentCtx.rawAvg + delta) * 10) / 10, 0, 100);
            return {
              projectedScore: proj,
              projectedDisplay: proj.toFixed(1) + '%',
              changeDisplay: (delta >= 0 ? '+' : '') + delta.toFixed(1) + '%',
              changeState: delta > 0.05 ? 'pos' : (delta < -0.05 ? 'neg' : '')
            };
          }
        };
      }
    },

    /* 13. NIGERIAN UNIVERSITY CGPA CALCULATOR (NUC 5.0 & NBTE 4.0) */
    'nigerian-university-cgpa-calculator': {
      formId: 'cgpaForm',
      resetIds: ['resetBtn'],
      wideGrid: true,
      bannerDesc: 'Benchmark your NUC 5.0 or NBTE 4.0 CGPA against a coursemate and find which high-unit course adds the most quality points.',
      emptyTitle: 'Calculate Your GPA or CGPA First',
      emptyDesc: 'Enter your semester courses or completed semesters above and click Calculate to compare with a coursemate.',
      projectedLabel: 'Projected CGPA',
      higherIsBetter: true,
      tieEpsilon: 0.015,
      modes: [
        { id: 'standard', label: 'Course Grades' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var scaleEl = document.getElementById('gradingScale');
        var scaleVal = (scaleEl && scaleEl.value === '4.0') ? '4.0' : '5.0';
        var maxScale = scaleVal === '4.0' ? 4.0 : 5.0;
        var map = scaleVal === '4.0' ? NBTE_POINTS_4 : NUC_POINTS_5;

        var tabCum = document.getElementById('tabCumulative');
        var tabTgt = document.getElementById('tabTarget');
        var isMultiSem = !!(tabCum && tabCum.classList.contains('active'));
        var isTarget = !!(tabTgt && tabTgt.classList.contains('active'));

        var items = [];
        var totalUnits = 0;
        var totalQp = 0;

        if (isMultiSem) {
          var sRows = document.querySelectorAll('#semesterContainer .semester-row');
          for (var s = 0; s < sRows.length; s++) {
            var su = parseFloat(sRows[s].querySelector('.sem-units').value) || 0;
            var sg = parseFloat(sRows[s].querySelector('.sem-gpa').value);
            if (su > 0 && isFinite(sg) && sg >= 0) {
              var clampedSg = clampNum(sg, 0, maxScale);
              items.push({ name: 'Semester ' + (s + 1), credits: su, pts: clampedSg, grade: clampedSg.toFixed(2), isSem: true });
              totalUnits += su;
              totalQp += su * clampedSg;
            }
          }
        } else if (isTarget) {
          var curCg = parseFloat((document.getElementById('currentCgpa') || {}).value);
          var compU = parseFloat((document.getElementById('completedUnits') || {}).value);
          var remU = parseFloat((document.getElementById('remainingUnits') || {}).value);
          if (!isFinite(curCg) || !isFinite(compU) || compU <= 0) return null;
          totalUnits = compU;
          totalQp = curCg * compU;
          items.push({ name: 'Remaining Credits', credits: isFinite(remU) && remU > 0 ? remU : 18, pts: curCg, grade: curCg.toFixed(2), isSem: true, isFuture: true });
        } else {
          var cRows = document.querySelectorAll('#coursesContainer .course-row');
          for (var i = 0; i < cRows.length; i++) {
            var u = parseFloat(cRows[i].querySelector('.course-units').value) || 0;
            var g = cRows[i].querySelector('.course-grade').value;
            if (u > 0 && g && map[g] !== undefined) {
              var nmEl = cRows[i].querySelector('.course-name');
              var nm = (nmEl && nmEl.value.trim()) ? nmEl.value.trim() : ('Course ' + (items.length + 1));
              items.push({ name: nm, credits: u, pts: map[g], grade: g, isSem: false });
              totalUnits += u;
              totalQp += u * map[g];
            }
          }
          var prevU = parseFloat((document.getElementById('prevUnits') || {}).value) || 0;
          var prevP = parseFloat((document.getElementById('prevPoints') || {}).value) || 0;
          if (prevU > 0 && prevP >= 0) {
            totalUnits += prevU;
            totalQp += prevP;
          }
        }

        if (items.length === 0 || totalUnits <= 0) return null;
        var cgpa = totalQp / totalUnits;
        var rounded = Math.round(cgpa * 100) / 100;
        return {
          mode: 'standard',
          scaleVal: scaleVal,
          maxScore: maxScale,
          score: rounded,
          rawCgpa: cgpa,
          totalUnits: totalUnits,
          totalQp: totalQp,
          band: nucClassify(scaleVal, rounded) + ' (' + (scaleVal === '4.0' ? 'NBTE 4.0' : 'NUC 5.0') + ')',
          courses: items
        };
      },
      getDefaultFriendItems: function (mode, studentCtx) {
        var scaleVal = (studentCtx && studentCtx.scaleVal) ? studentCtx.scaleVal : '5.0';
        var order = scaleVal === '4.0' ? NBTE_ORDER_4 : TERTIARY_ORDER_5;
        var map = scaleVal === '4.0' ? NBTE_POINTS_4 : NUC_POINTS_5;
        var opts = [{ value: '', label: 'Grade' }].concat(order.slice().reverse().map(function (g) {
          return { value: g, label: g + ' (' + map[g].toFixed(1) + ')' };
        }));
        var useStudentCourses = studentCtx && studentCtx.courses && !studentCtx.courses[0].isSem;
        var count = useStudentCourses ? Math.max(4, studentCtx.courses.length) : 5;
        var defaults = ['GST 111', 'MTH 101', 'PHY 101', 'CHM 101', 'CSC 101', 'BIO 101'];
        var list = [];
        for (var i = 0; i < count; i++) {
          var nm = (useStudentCourses && studentCtx.courses[i]) ? studentCtx.courses[i].name : (defaults[i] || ('Course ' + (i + 1)));
          var cr = (useStudentCourses && studentCtx.courses[i]) ? studentCtx.courses[i].credits : 3;
          list.push({ id: 'f_nuc_' + i, name: nm, tag: cr + ' u', type: 'dual-gpa', options: opts, val: '', aux: cr });
        }
        return list;
      },
      getSampleFriendItems: function (mode, studentCtx) {
        var items = this.getDefaultFriendItems(mode, studentCtx);
        var samp5 = ['A', 'B', 'A', 'C', 'B', 'A', 'B'];
        var samp4 = ['A', 'AB', 'B', 'BC', 'A', 'B'];
        var samp = (studentCtx && studentCtx.scaleVal === '4.0') ? samp4 : samp5;
        for (var i = 0; i < items.length; i++) {
          items[i].val = samp[i % samp.length];
          if (!items[i].aux) items[i].aux = 3;
        }
        return items;
      },
      calculateFriend: function (items, mode, studentCtx) {
        var scaleVal = (studentCtx && studentCtx.scaleVal) ? studentCtx.scaleVal : '5.0';
        var map = scaleVal === '4.0' ? NBTE_POINTS_4 : NUC_POINTS_5;
        var units = 0;
        var qp = 0;
        var count = 0;
        for (var i = 0; i < items.length; i++) {
          var g = items[i].val;
          var u = (items[i].aux !== null && isFinite(items[i].aux) && items[i].aux > 0) ? items[i].aux : 3;
          if (g && map[g] !== undefined) {
            units += u;
            qp += map[g] * u;
            count++;
          }
        }
        if (count === 0 || units <= 0) return null;
        var cgpa = Math.round((qp / units) * 100) / 100;
        return {
          score: cgpa,
          maxScore: scaleVal === '4.0' ? 4.0 : 5.0,
          filledCount: count,
          band: nucClassify(scaleVal, cgpa) + ' (' + units + ' units)'
        };
      },
      validateMessage: 'Select at least one course grade for your coursemate to compare CGPAs.',
      formatScore: function (val) { return val.toFixed(2); },
      formatDiff: function (absDiff) { return absDiff.toFixed(2) + ' CGPA points'; },
      getSvgConfig: function (mode, studentComp) {
        var is4 = studentComp && studentComp.maxScore === 4;
        return {
          min: 0,
          max: is4 ? 4.0 : 5.0,
          invert: false,
          leftLabel: '0.00',
          rightLabel: is4 ? '4.00 Max' : '5.00 Max',
          guides: is4
            ? [
                { pct: 75, label: '3.00 Upper', strong: true },
                { pct: 87.5, label: '3.50 Dist.', strong: false }
              ]
            : [
                { pct: 70, label: '3.50 2:1', strong: true },
                { pct: 90, label: '4.50 1st Class', strong: false }
              ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName) {
        var maxPts = studentCtx.maxScore;
        var courses = studentCtx.courses;
        var bestIdx = 0;
        var bestUpside = -1;
        for (var i = 0; i < courses.length; i++) {
          var c = courses[i];
          var denom = c.isFuture ? (studentCtx.totalUnits + c.credits) : studentCtx.totalUnits;
          var upside = (maxPts - c.pts) * (c.credits / denom);
          if (upside > bestUpside) {
            bestUpside = upside;
            bestIdx = i;
          }
        }
        var chosen = courses[bestIdx] || courses[0];
        if (chosen.isSem) {
          var tgtGpa = clampNum(Math.round((chosen.pts + 0.6) * 10) / 10, 0, maxPts);
          var newTotQp = chosen.isFuture ? (studentCtx.totalQp + tgtGpa * chosen.credits) : (studentCtx.totalQp + (tgtGpa - chosen.pts) * chosen.credits);
          var newDenom = chosen.isFuture ? (studentCtx.totalUnits + chosen.credits) : studentCtx.totalUnits;
          var projCg = Math.round((newTotQp / newDenom) * 100) / 100;
          var deltaCg = Math.max(0, projCg - studentCtx.score);
          return {
            bestIndex: bestIdx,
            suggestedSimVal: tgtGpa,
            html: 'Scoring <strong>' + tgtGpa.toFixed(2) + ' GPA</strong> across <strong>' + escapeHtml(chosen.name) + ' (' + chosen.credits + ' units)</strong> moves your cumulative CGPA to <strong>' + projCg.toFixed(2) + ' (+' + deltaCg.toFixed(2) + ')</strong>. Next step: secure at least 24/30 in Continuous Assessment (CA) on 3-unit and 4-unit departmental courses.'
          };
        }
        var order = studentCtx.scaleVal === '4.0' ? NBTE_ORDER_4 : TERTIARY_ORDER_5;
        var map = studentCtx.scaleVal === '4.0' ? NBTE_POINTS_4 : NUC_POINTS_5;
        if (bestUpside <= 0.005) {
          return {
            bestIndex: 0,
            suggestedSimVal: order.length - 1,
            html: 'Your registered courses are already at maximum Grade A (' + maxPts.toFixed(1) + ' GP). Next step: protect your Continuous Assessment (CA) scores on high-unit core courses.'
          };
        }
        var curPos = Math.max(0, order.indexOf(chosen.grade));
        var tgtPos = clampNum(curPos + 1, 0, order.length - 1);
        var tgtGrade = order[tgtPos];
        var gain = ((map[tgtGrade] - chosen.pts) * chosen.credits) / studentCtx.totalUnits;
        var newCgpa = Math.round((studentCtx.rawCgpa + gain) * 100) / 100;
        var tail = (studentCtx.score < friendCalc.score && newCgpa >= friendCalc.score)
          ? ' and moves you ahead of ' + escapeHtml(friendName)
          : ' to reach <strong>' + newCgpa.toFixed(2) + '</strong>';
        return {
          bestIndex: bestIdx,
          suggestedSimVal: tgtPos,
          html: '<strong>' + escapeHtml(chosen.name) + ' (' + chosen.credits + ' units, Grade ' + chosen.grade + ')</strong> carries your largest CGPA leverage: raising it to <strong>' + tgtGrade + '</strong> adds <strong>+' + gain.toFixed(2) + ' CGPA points</strong>' + tail + '. Next step: target 25/30+ in CA tests and lab practicals so you need under 45/70 on the semester exam for an A.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var courses = studentCtx.courses;
        var idx = clampNum(itemIndex, 0, courses.length - 1);
        var chosen = courses[idx];
        if (chosen.isSem) {
          return {
            selectLabel: 'Semester Block',
            options: courses.map(function (c, i) {
              return { index: i, label: c.name + ' (' + c.credits + ' units - now ' + c.pts.toFixed(2) + ')' };
            }),
            sliderLabel: 'Target Semester GPA',
            min: 0,
            max: studentCtx.maxScore,
            step: 0.05,
            defaultVal: clampNum(Math.round((chosen.pts + 0.5) * 20) / 20, 0, studentCtx.maxScore),
            formatSliderVal: function (v) { return Number(v).toFixed(2) + ' GPA'; },
            simulate: function (v) {
              var newQp = chosen.isFuture ? (studentCtx.totalQp + v * chosen.credits) : (studentCtx.totalQp + (v - chosen.pts) * chosen.credits);
              var denom = chosen.isFuture ? (studentCtx.totalUnits + chosen.credits) : studentCtx.totalUnits;
              var proj = clampNum(Math.round((newQp / denom) * 100) / 100, 0, studentCtx.maxScore);
              var delta = proj - studentCtx.score;
              return {
                projectedScore: proj,
                projectedDisplay: proj.toFixed(2),
                changeDisplay: (delta >= 0 ? '+' : '') + delta.toFixed(2) + ' CGPA',
                changeState: delta > 0.004 ? 'pos' : (delta < -0.004 ? 'neg' : '')
              };
            }
          };
        }
        var order = studentCtx.scaleVal === '4.0' ? NBTE_ORDER_4 : TERTIARY_ORDER_5;
        var map = studentCtx.scaleVal === '4.0' ? NBTE_POINTS_4 : NUC_POINTS_5;
        var curPos = Math.max(0, order.indexOf(chosen.grade));
        var maxIdx = order.length - 1;
        return {
          selectLabel: 'Course Code',
          options: courses.map(function (c, i) {
            return { index: i, label: c.name + ' (' + c.credits + ' u - now ' + c.grade + ')' };
          }),
          sliderLabel: 'Target Grade',
          min: 0,
          max: maxIdx,
          step: 1,
          defaultVal: clampNum(curPos + 1, 0, maxIdx),
          formatSliderVal: function (v) {
            var g = order[v] || 'A';
            return g + ' (' + map[g].toFixed(1) + ' GP)';
          },
          simulate: function (v) {
            var g = order[v] || chosen.grade;
            var delta = ((map[g] - chosen.pts) * chosen.credits) / studentCtx.totalUnits;
            var proj = clampNum(Math.round((studentCtx.rawCgpa + delta) * 100) / 100, 0, studentCtx.maxScore);
            return {
              projectedScore: proj,
              projectedDisplay: proj.toFixed(2),
              changeDisplay: (delta >= 0 ? '+' : '') + delta.toFixed(2) + ' CGPA',
              changeState: delta > 0.004 ? 'pos' : (delta < -0.004 ? 'neg' : '')
            };
          }
        };
      }
    },

    /* 14. POST-UTME SCREENING AGGREGATE CALCULATOR */
    'post-utme-aggregate-calculator': {
      formId: 'putmeForm',
      resetIds: ['resetBtn'],
      bannerDesc: 'Compare your composite Post-UTME screening score with another applicant under the exact same university weighting formula.',
      emptyTitle: 'Calculate Your Post-UTME Aggregate First',
      emptyDesc: 'Enter your JAMB UTME, Post-UTME CBT, and O-Level grades above to compare your composite score with a friend.',
      projectedLabel: 'Projected Aggregate',
      higherIsBetter: true,
      tieEpsilon: 0.03,
      modes: [
        { id: 'standard', label: 'Screening Aggregate (/100)' }
      ],
      computeComposite: function (model, jamb, cbt, grades, sitting) {
        var jambPart = 0;
        var cbtPart = 0;
        var olevelPart = 0;
        if (model === '50_30_20') {
          jambPart = jamb / 8;
          cbtPart = (cbt / 100) * 30;
          olevelPart = grades.reduce(function (s, g) { return s + (OLEVEL_JAMB_PTS[g] || 0); }, 0);
          if (sitting === '2') olevelPart = Math.max(0, olevelPart - 1);
        } else if (model === '50_50') {
          jambPart = jamb / 8;
          cbtPart = cbt / 2;
        } else if (model === 'lasu_point') {
          jambPart = jamb / 8;
          olevelPart = grades.reduce(function (s, g) { return s + (OLEVEL_PUTME_10[g] || 0); }, 0);
        } else if (model === 'custom_60_40') {
          jambPart = (jamb / 400) * 60;
          cbtPart = (cbt / 100) * 40;
        } else if (model === 'jamb_o_level') {
          jambPart = jamb / 8;
          var rawO = grades.reduce(function (s, g) { return s + (OLEVEL_JAMB_PTS[g] || 0); }, 0);
          olevelPart = (rawO / 20) * 50;
        }
        return clampNum(jambPart + cbtPart + olevelPart, 0, 100);
      },
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var modelEl = document.getElementById('modelSelect');
        var jambEl = document.getElementById('jambInput');
        var cbtEl = document.getElementById('postUtmeInput');
        var sitEl = document.getElementById('sittingSelect');
        var model = modelEl ? modelEl.value : '50_30_20';
        var sitting = sitEl ? sitEl.value : '1';
        var jamb = jambEl ? parseFloat(jambEl.value) : NaN;
        if (!isFinite(jamb) || jamb < 0 || jamb > 400) return null;

        var usesCbt = (model !== 'lasu_point' && model !== 'jamb_o_level');
        var usesOlevel = (model === '50_30_20' || model === 'lasu_point' || model === 'jamb_o_level');
        var cbt = usesCbt && cbtEl ? parseFloat(cbtEl.value) : 0;
        if (usesCbt && (!isFinite(cbt) || cbt < 0 || cbt > 100)) return null;

        var gEls = document.querySelectorAll('.olevel-grade');
        var grades = [];
        for (var i = 0; i < gEls.length; i++) {
          if (gEls[i].value) grades.push(gEls[i].value);
        }
        if (usesOlevel && grades.length < 5) return null;

        var total = ADAPTERS['post-utme-aggregate-calculator'].computeComposite(model, jamb, cbt, grades, sitting);
        var rounded = Math.round(total * 100) / 100;
        var band = rounded >= 75 ? 'First Merit Range' : rounded >= 65 ? 'Competitive Merit / Catchment' : rounded >= 50 ? 'Above 50% University Minimum' : 'Below 50% Minimum';
        return {
          mode: 'standard',
          model: model,
          sitting: sitting,
          usesCbt: usesCbt,
          usesOlevel: usesOlevel,
          jamb: jamb,
          cbt: cbt,
          grades: grades.slice(0, 5),
          score: rounded,
          rawScore: total,
          maxScore: 100,
          band: band
        };
      },
      getDefaultFriendItems: function (mode, studentCtx) {
        var model = (studentCtx && studentCtx.model) ? studentCtx.model : '50_30_20';
        var usesCbt = (model !== 'lasu_point' && model !== 'jamb_o_level');
        var usesOlevel = (model === '50_30_20' || model === 'lasu_point' || model === 'jamb_o_level');
        var jambWt = model === 'custom_60_40' ? '60%' : '50%';
        var cbtWt = model === '50_50' ? '50%' : (model === 'custom_60_40' ? '40%' : '30%');

        var list = [
          { id: 'f_jamb', name: 'JAMB UTME Score', tag: jambWt + ' (/400)', type: 'number', min: 0, max: 400, noSuffix: true, placeholder: '0-400', val: null }
        ];
        if (usesCbt) {
          list.push({ id: 'f_cbt', name: 'Post-UTME CBT', tag: cbtWt + ' (/100)', type: 'number', min: 0, max: 100, suffix: '%', placeholder: '0-100', val: null });
        }
        if (usesOlevel) {
          var oNames = ['English Language', 'Mathematics', 'Core Subject 3', 'Core Subject 4', 'Core Subject 5'];
          var opts = [{ value: '', label: 'Select grade...' }].concat(OLEVEL_JAMB_GRADES.map(function (g) {
            var p = model === 'lasu_point' ? OLEVEL_PUTME_10[g.grade] : g.pts;
            return { value: g.grade, label: g.grade + ' (' + p + ' pts)' };
          }));
          for (var i = 0; i < 5; i++) {
            list.push({ id: 'f_ol' + (i + 1), name: oNames[i], tag: "O'Level", type: 'select', options: opts, val: '' });
          }
        }
        return list;
      },
      getSampleFriendItems: function (mode, studentCtx) {
        var items = this.getDefaultFriendItems(mode, studentCtx);
        var gSamp = ['B2', 'B3', 'A1', 'C4', 'B3'];
        var gIdx = 0;
        for (var i = 0; i < items.length; i++) {
          if (items[i].id === 'f_jamb') items[i].val = 276;
          else if (items[i].id === 'f_cbt') items[i].val = 70;
          else { items[i].val = gSamp[gIdx % gSamp.length]; gIdx++; }
        }
        return items;
      },
      calculateFriend: function (items, mode, studentCtx) {
        var model = (studentCtx && studentCtx.model) ? studentCtx.model : '50_30_20';
        var sitting = (studentCtx && studentCtx.sitting) ? studentCtx.sitting : '1';
        var usesCbt = (model !== 'lasu_point' && model !== 'jamb_o_level');
        var usesOlevel = (model === '50_30_20' || model === 'lasu_point' || model === 'jamb_o_level');

        var jambItem = items[0];
        if (!jambItem || jambItem.val === null || !isFinite(jambItem.val)) return null;
        var cbtVal = 0;
        var idx = 1;
        if (usesCbt) {
          if (!items[idx] || items[idx].val === null || !isFinite(items[idx].val)) return null;
          cbtVal = items[idx].val;
          idx++;
        }
        var grades = [];
        if (usesOlevel) {
          for (var k = idx; k < idx + 5; k++) {
            if (!items[k] || !items[k].val) return null;
            grades.push(items[k].val);
          }
        }
        var total = Math.round(ADAPTERS['post-utme-aggregate-calculator'].computeComposite(model, jambItem.val, cbtVal, grades, sitting) * 100) / 100;
        var band = total >= 75 ? 'First Merit Range' : total >= 65 ? 'Competitive Merit / Catchment' : total >= 50 ? 'Above 50% Minimum' : 'Below 50% Minimum';
        return {
          score: total,
          maxScore: 100,
          filledCount: items.length,
          band: band
        };
      },
      validateMessage: "Enter your friend's JAMB UTME score and required screening components to compare aggregates.",
      formatScore: function (val) { return val.toFixed(2) + '%'; },
      formatDiff: function (absDiff) { return absDiff.toFixed(2) + ' aggregate points'; },
      getSvgConfig: function () {
        return {
          min: 0,
          max: 100,
          invert: false,
          leftLabel: '0%',
          rightLabel: '100%',
          guides: [
            { pct: 50, label: '50% Min', strong: false },
            { pct: 70, label: '70% Merit', strong: true }
          ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName) {
        var cbtFactor = studentCtx.model === '50_50' ? 0.50 : (studentCtx.model === 'custom_60_40' ? 0.40 : (studentCtx.usesCbt ? 0.30 : 0));
        var jambFactor = studentCtx.model === 'custom_60_40' ? (60 / 400) : (50 / 400);
        var jambHeadroom = (400 - studentCtx.jamb) * jambFactor;
        var cbtHeadroom = studentCtx.usesCbt ? (100 - studentCtx.cbt) * cbtFactor : -1;

        var worstOIdx = 0;
        var oHeadroom = -1;
        if (studentCtx.usesOlevel && studentCtx.grades.length === 5) {
          for (var i = 0; i < 5; i++) {
            var g = studentCtx.grades[i];
            var singleUp = 0;
            if (studentCtx.model === 'lasu_point') singleUp = 10 - (OLEVEL_PUTME_10[g] || 0);
            else if (studentCtx.model === 'jamb_o_level') singleUp = ((4.0 - (OLEVEL_JAMB_PTS[g] || 0)) / 20) * 50;
            else singleUp = 4.0 - (OLEVEL_JAMB_PTS[g] || 0);
            if (singleUp > oHeadroom) {
              oHeadroom = singleUp;
              worstOIdx = i;
            }
          }
        }

        if (studentCtx.usesCbt && cbtHeadroom >= jambHeadroom && cbtHeadroom >= oHeadroom && cbtHeadroom > 0.5) {
          var tgtCbt = clampNum(Math.round(studentCtx.cbt + 14), 0, 100);
          var gainC = (tgtCbt - studentCtx.cbt) * cbtFactor;
          var newC = Math.round((studentCtx.rawScore + gainC) * 100) / 100;
          return {
            bestIndex: 1,
            suggestedSimVal: tgtCbt,
            html: 'Your <strong>Post-UTME CBT (' + studentCtx.cbt + '%)</strong> offers fast screening gains: lifting it to <strong>' + tgtCbt + '%</strong> adds <strong>+' + gainC.toFixed(2) + ' aggregate points</strong> to reach <strong>' + newC.toFixed(2) + '%</strong>. Next step: practise university-specific Post-UTME CBT past questions under strict 30-minute timing.'
          };
        }

        if (jambHeadroom >= oHeadroom && jambHeadroom > 0.5) {
          var tgtJamb = clampNum(Math.round((studentCtx.jamb + 28) / 5) * 5, 0, 400);
          var gainJ = (tgtJamb - studentCtx.jamb) * jambFactor;
          var newJ = Math.round((studentCtx.rawScore + gainJ) * 100) / 100;
          var tailJ = (studentCtx.score < friendCalc.score && newJ >= friendCalc.score)
            ? ' and moves you ahead of ' + escapeHtml(friendName)
            : ' to reach <strong>' + newJ.toFixed(2) + '%</strong>';
          return {
            bestIndex: 0,
            suggestedSimVal: tgtJamb,
            html: 'Your <strong>JAMB UTME (' + studentCtx.jamb + '/400)</strong> carries the largest composite headroom: reaching <strong>' + tgtJamb + '/400</strong> adds <strong>+' + gainJ.toFixed(2) + ' points</strong>' + tailJ + '. Next step: target +8 to +10 raw marks in your lowest UTME paper.'
          };
        }

        var oSimIdx = (studentCtx.usesCbt ? 2 : 1) + worstOIdx;
        var curG = studentCtx.grades[worstOIdx] || 'C6';
        var tgtPos = clampNum(OLEVEL_SLIDER_ORDER.indexOf(curG) + 2, 0, 5);
        var tgtG = OLEVEL_SLIDER_ORDER[tgtPos];
        var newGrades = studentCtx.grades.slice();
        newGrades[worstOIdx] = tgtG;
        var projO = ADAPTERS['post-utme-aggregate-calculator'].computeComposite(studentCtx.model, studentCtx.jamb, studentCtx.cbt, newGrades, studentCtx.sitting);
        var gainO = Math.max(0, projO - studentCtx.rawScore);
        return {
          bestIndex: oSimIdx,
          suggestedSimVal: tgtPos,
          html: "Upgrading <strong>O'Level Subject " + (worstOIdx + 1) + ' (' + curG + ')</strong> to <strong>' + tgtG + '</strong> adds <strong>+' + gainO.toFixed(2) + ' composite points</strong> to reach <strong>' + projO.toFixed(2) + '%</strong>. Next step: verify your strongest 5 relevant credits are uploaded accurately on JAMB CAPS.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var opts = [{ index: 0, kind: 'jamb', label: 'JAMB UTME (Now ' + studentCtx.jamb + '/400)' }];
        if (studentCtx.usesCbt) {
          opts.push({ index: 1, kind: 'cbt', label: 'Post-UTME CBT (Now ' + studentCtx.cbt + '%)' });
        }
        if (studentCtx.usesOlevel) {
          for (var i = 0; i < studentCtx.grades.length; i++) {
            opts.push({ index: opts.length, kind: 'ol', olIdx: i, label: "O'Level Subject " + (i + 1) + ' (Now ' + studentCtx.grades[i] + ')' });
          }
        }
        var idx = clampNum(itemIndex, 0, opts.length - 1);
        var sel = opts[idx];
        var compFn = ADAPTERS['post-utme-aggregate-calculator'].computeComposite;

        if (sel.kind === 'jamb') {
          return {
            selectLabel: 'Screening Component',
            options: opts,
            sliderLabel: 'Hypothetical JAMB Score',
            min: 120,
            max: 400,
            step: 5,
            defaultVal: clampNum(Math.round((studentCtx.jamb + 25) / 5) * 5, 120, 400),
            formatSliderVal: function (v) { return Math.round(v) + ' / 400'; },
            simulate: function (v) {
              var proj = Math.round(compFn(studentCtx.model, v, studentCtx.cbt, studentCtx.grades, studentCtx.sitting) * 100) / 100;
              var d = proj - studentCtx.score;
              return {
                projectedScore: proj,
                projectedDisplay: proj.toFixed(2) + '%',
                changeDisplay: (d >= 0 ? '+' : '') + d.toFixed(2) + ' pts',
                changeState: d > 0.02 ? 'pos' : (d < -0.02 ? 'neg' : '')
              };
            }
          };
        }
        if (sel.kind === 'cbt') {
          return {
            selectLabel: 'Screening Component',
            options: opts,
            sliderLabel: 'Hypothetical Post-UTME CBT',
            min: 0,
            max: 100,
            step: 1,
            defaultVal: clampNum(Math.round(studentCtx.cbt + 12), 0, 100),
            formatSliderVal: function (v) { return Math.round(v) + '%'; },
            simulate: function (v) {
              var proj = Math.round(compFn(studentCtx.model, studentCtx.jamb, v, studentCtx.grades, studentCtx.sitting) * 100) / 100;
              var d = proj - studentCtx.score;
              return {
                projectedScore: proj,
                projectedDisplay: proj.toFixed(2) + '%',
                changeDisplay: (d >= 0 ? '+' : '') + d.toFixed(2) + ' pts',
                changeState: d > 0.02 ? 'pos' : (d < -0.02 ? 'neg' : '')
              };
            }
          };
        }
        var curGrade = studentCtx.grades[sel.olIdx] || 'C6';
        return {
          selectLabel: 'Screening Component',
          options: opts,
          sliderLabel: "Target O'Level Grade",
          min: 0,
          max: 5,
          step: 1,
          defaultVal: clampNum(OLEVEL_SLIDER_ORDER.indexOf(curGrade) + 1, 0, 5),
          formatSliderVal: function (v) { return OLEVEL_SLIDER_ORDER[v] || 'A1'; },
          simulate: function (v) {
            var gCopy = studentCtx.grades.slice();
            gCopy[sel.olIdx] = OLEVEL_SLIDER_ORDER[v] || curGrade;
            var proj = Math.round(compFn(studentCtx.model, studentCtx.jamb, studentCtx.cbt, gCopy, studentCtx.sitting) * 100) / 100;
            var d = proj - studentCtx.score;
            return {
              projectedScore: proj,
              projectedDisplay: proj.toFixed(2) + '%',
              changeDisplay: (d >= 0 ? '+' : '') + d.toFixed(2) + ' pts',
              changeState: d > 0.02 ? 'pos' : (d < -0.02 ? 'neg' : '')
            };
          }
        };
      }
    },

    /* 15. SOUTH AFRICAN TVET NC(V) PASS & AGGREGATE CALCULATOR */
    'tvet-ncv-pass-calculator': {
      formId: 'ncvForm',
      resetIds: ['resetBtn'],
      bannerDesc: 'Compare your 7-subject NC(V) final average and certificate pass standing with a classmate and test how higher exam marks lift your aggregate.',
      emptyTitle: 'Calculate Your NC(V) Standing First',
      emptyDesc: 'Enter your Fundamental and Vocational ICASS, ISAT, and Exam marks above, then click Calculate to compare with a friend.',
      projectedLabel: 'Projected NC(V) Avg',
      higherIsBetter: true,
      tieEpsilon: 0.05,
      modes: [
        { id: 'standard', label: '7-Subject Final Marks (%)' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var fundDefs = [
          { id: 'lang', label: 'Official Language', icassId: 'langIcass', examId: 'langExam', threshold: 40 },
          { id: 'lo', label: 'Life Orientation', icassId: 'loIcass', examId: 'loExam', threshold: 40 },
          { id: 'math', label: 'Mathematics / Maths Lit', icassId: 'mathIcass', examId: 'mathExam', threshold: 30 }
        ];
        var vocDefs = [
          { id: 'voc1', nameId: 'voc1Name', icassId: 'voc1Icass', isatId: 'voc1Isat', examId: 'voc1Exam' },
          { id: 'voc2', nameId: 'voc2Name', icassId: 'voc2Icass', isatId: 'voc2Isat', examId: 'voc2Exam' },
          { id: 'voc3', nameId: 'voc3Name', icassId: 'voc3Icass', isatId: 'voc3Isat', examId: 'voc3Exam' },
          { id: 'voc4', nameId: 'voc4Name', icassId: 'voc4Icass', isatId: 'voc4Isat', examId: 'voc4Exam' }
        ];
        var subjects = [];
        for (var f = 0; f < fundDefs.length; f++) {
          var fd = fundDefs[f];
          var fi = parseFloat((document.getElementById(fd.icassId) || {}).value);
          var fx = parseFloat((document.getElementById(fd.examId) || {}).value);
          if (!isFinite(fi) || !isFinite(fx)) return null;
          fi = clampNum(fi, 0, 100);
          fx = clampNum(fx, 0, 100);
          var fFinal = fi * 0.50 + fx * 0.50;
          subjects.push({ id: fd.id, name: fd.label, isVoc: false, icass: fi, isat: null, exam: fx, final: fFinal, threshold: fd.threshold, passed: fFinal >= fd.threshold });
        }
        for (var v = 0; v < vocDefs.length; v++) {
          var vd = vocDefs[v];
          var vi = parseFloat((document.getElementById(vd.icassId) || {}).value);
          var vp = parseFloat((document.getElementById(vd.isatId) || {}).value);
          var vx = parseFloat((document.getElementById(vd.examId) || {}).value);
          if (!isFinite(vi) || !isFinite(vp) || !isFinite(vx)) return null;
          vi = clampNum(vi, 0, 100);
          vp = clampNum(vp, 0, 100);
          vx = clampNum(vx, 0, 100);
          var nmEl = document.getElementById(vd.nameId);
          var vName = (nmEl && nmEl.value.trim()) ? nmEl.value.trim() : ('Vocational ' + (v + 1));
          var vFinal = vi * 0.25 + vp * 0.25 + vx * 0.50;
          subjects.push({ id: vd.id, name: vName, isVoc: true, icass: vi, isat: vp, exam: vx, final: vFinal, threshold: 50, passed: vFinal >= 50 });
        }
        var avg = subjects.reduce(function (s, r) { return s + r.final; }, 0) / 7;
        var passedCount = subjects.filter(function (r) { return r.passed; }).length;
        var lvlEl = document.getElementById('levelSelect');
        var lvl = lvlEl ? lvlEl.value : '4';
        var rounded = Math.round(avg * 10) / 10;
        return {
          mode: 'standard',
          score: rounded,
          rawAvg: avg,
          maxScore: 100,
          passedCount: passedCount,
          band: (passedCount === 7 ? 'Certificate Cleared' : (passedCount + '/7 Subjects Passed')) + ' (Level ' + lvl + ')',
          subjects: subjects
        };
      },
      getDefaultFriendItems: function (mode, studentCtx) {
        var defaults = [
          { name: 'Official Language', tag: 'Pass 40%', threshold: 40 },
          { name: 'Life Orientation', tag: 'Pass 40%', threshold: 40 },
          { name: 'Mathematics / Maths Lit', tag: 'Pass 30%', threshold: 30 },
          { name: 'Vocational 1', tag: 'Pass 50%', threshold: 50 },
          { name: 'Vocational 2', tag: 'Pass 50%', threshold: 50 },
          { name: 'Vocational 3', tag: 'Pass 50%', threshold: 50 },
          { name: 'Vocational 4', tag: 'Pass 50%', threshold: 50 }
        ];
        return defaults.map(function (d, i) {
          var nm = (studentCtx && studentCtx.subjects[i]) ? studentCtx.subjects[i].name : d.name;
          return { id: 'f_ncv_' + i, name: nm, tag: d.tag, threshold: d.threshold, type: 'number', min: 0, max: 100, suffix: '%', placeholder: 'Final %', val: null };
        });
      },
      getSampleFriendItems: function (mode, studentCtx) {
        var items = this.getDefaultFriendItems(mode, studentCtx);
        var samp = [62, 70, 56, 64, 59, 68, 61];
        for (var i = 0; i < items.length; i++) items[i].val = samp[i];
        return items;
      },
      calculateFriend: function (items) {
        if (items.length < 7) return null;
        var thresholds = [40, 40, 30, 50, 50, 50, 50];
        var sum = 0;
        var passed = 0;
        for (var i = 0; i < 7; i++) {
          if (items[i].val === null || !isFinite(items[i].val)) return null;
          sum += items[i].val;
          if (items[i].val >= thresholds[i]) passed++;
        }
        var avg = Math.round((sum / 7) * 10) / 10;
        return {
          score: avg,
          maxScore: 100,
          filledCount: 7,
          band: passed === 7 ? 'Certificate Cleared (7/7)' : (passed + '/7 Subjects Passed')
        };
      },
      validateMessage: "Enter all 7 final subject marks (0-100%) for your friend to compare NC(V) results.",
      formatScore: function (val) { return val.toFixed(1) + '%'; },
      formatDiff: function (absDiff) { return absDiff.toFixed(1) + ' percentage points'; },
      getSvgConfig: function () {
        return {
          min: 0,
          max: 100,
          invert: false,
          leftLabel: '0%',
          rightLabel: '100%',
          guides: [
            { pct: 50, label: '50% Voc Pass', strong: true },
            { pct: 80, label: '80% Dist.', strong: false }
          ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName) {
        var subs = studentCtx.subjects;
        var bestIdx = 0;
        // Priority 1: Any subject currently failing its Umalusi pass threshold
        var failIdx = -1;
        for (var i = 0; i < subs.length; i++) {
          if (!subs[i].passed) { failIdx = i; break; }
        }
        if (failIdx !== -1) {
          bestIdx = failIdx;
        } else {
          // Priority 2: Subject with lowest External Exam mark (50% weight across all 7 NC(V) subjects)
          var lowestExam = 101;
          for (var j = 0; j < subs.length; j++) {
            if (subs[j].exam < lowestExam) {
              lowestExam = subs[j].exam;
              bestIdx = j;
            }
          }
        }
        var chosen = subs[bestIdx];
        if (chosen.exam >= 96) {
          return {
            bestIndex: bestIdx,
            suggestedSimVal: 98,
            html: 'Your NC(V) external exam marks are already at distinction level. Next step: keep your ISAT practical portfolio and ICASS tasks above 80%.'
          };
        }
        var minExamForPass = chosen.isVoc
          ? Math.ceil((chosen.threshold - (chosen.icass * 0.25 + chosen.isat * 0.25)) / 0.50)
          : Math.ceil((chosen.threshold - chosen.icass * 0.50) / 0.50);
        var tgtExam = !chosen.passed
          ? clampNum(Math.max(minExamForPass + 4, Math.round(chosen.exam + 14)), 0, 100)
          : clampNum(Math.round(chosen.exam + 14), 0, 95);
        var newSubFinal = chosen.isVoc
          ? (chosen.icass * 0.25 + chosen.isat * 0.25 + tgtExam * 0.50)
          : (chosen.icass * 0.50 + tgtExam * 0.50);
        var avgGain = (newSubFinal - chosen.final) / 7;
        var newAvg = Math.round((studentCtx.rawAvg + avgGain) * 10) / 10;
        var passNote = (!chosen.passed && newSubFinal >= chosen.threshold)
          ? 'clears the ' + chosen.threshold + '% pass threshold (' + newSubFinal.toFixed(1) + '% final) and '
          : 'lifts the subject to <strong>' + newSubFinal.toFixed(1) + '%</strong> and ';
        var tail = (studentCtx.score < friendCalc.score && newAvg >= friendCalc.score)
          ? 'moves you ahead of ' + escapeHtml(friendName)
          : 'raises your 7-subject average to <strong>' + newAvg.toFixed(1) + '%</strong>';
        return {
          bestIndex: bestIdx,
          suggestedSimVal: tgtExam,
          html: 'In <strong>' + escapeHtml(chosen.name) + '</strong>, raising the External Exam (50% weight) from ' + chosen.exam.toFixed(0) + '% to <strong>' + tgtExam + '%</strong> ' + passNote + tail + '. Next step: work through DHET national NC(V) past examination papers and marking guidelines.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var subs = studentCtx.subjects;
        var idx = clampNum(itemIndex, 0, subs.length - 1);
        var chosen = subs[idx];
        return {
          selectLabel: 'NC(V) Subject (50% Exam)',
          options: subs.map(function (s, i) {
            return { index: i, label: s.name + ' (Exam ' + s.exam.toFixed(0) + '% -> Final ' + s.final.toFixed(1) + '%)' };
          }),
          sliderLabel: 'Hypothetical Exam Mark',
          min: 0,
          max: 100,
          step: 1,
          defaultVal: clampNum(Math.round(chosen.exam + 12), 0, 100),
          formatSliderVal: function (v) { return Math.round(v) + '%'; },
          simulate: function (v) {
            var newFinal = chosen.isVoc
              ? (chosen.icass * 0.25 + chosen.isat * 0.25 + v * 0.50)
              : (chosen.icass * 0.50 + v * 0.50);
            var delta = (newFinal - chosen.final) / 7;
            var proj = clampNum(Math.round((studentCtx.rawAvg + delta) * 10) / 10, 0, 100);
            return {
              projectedScore: proj,
              projectedDisplay: proj.toFixed(1) + '%',
              changeDisplay: (delta >= 0 ? '+' : '') + delta.toFixed(1) + '%',
              changeState: delta > 0.05 ? 'pos' : (delta < -0.05 ? 'neg' : '')
            };
          }
        };
      }
    },

    /* 16. GHANA UNIVERSITY GPA & CWA CALCULATOR */
    'ghana-university-gpa-calculator': {
      formId: 'gpaForm',
      resetIds: ['resetBtn'],
      wideGrid: true,
      bannerDesc: 'Compare your 4.0 GPA or KNUST CWA with a coursemate using the same credit-hour weighting and find your highest-leverage module.',
      emptyTitle: 'Calculate Your GPA or CWA First',
      emptyDesc: 'Enter your course grades (or percentage marks) and credit hours above, then click Calculate to compare with a friend.',
      projectedLabel: 'Projected Score',
      higherIsBetter: true,
      tieEpsilon: 0.02,
      modes: [
        { id: 'standard', label: 'Course Grades & Credits' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var sysEl = document.getElementById('systemSelect');
        var sys = (sysEl && sysEl.value === 'cwa') ? 'cwa' : 'gpa4';
        var rows = document.querySelectorAll('#courseList .course-row');
        var courses = [];
        var semCr = 0;
        var semPts = 0;
        for (var i = 0; i < rows.length; i++) {
          var r = rows[i];
          var nameEl = r.querySelector('.course-name-input');
          var gradeEl = r.querySelector('.course-grade-input, .course-grade select, .course-grade input');
          var creditEl = r.querySelector('.course-credit-select');
          var cr = creditEl ? parseFloat(creditEl.value) : NaN;
          var gv = gradeEl ? gradeEl.value.trim() : '';
          if (!gv || !isFinite(cr) || cr <= 0) continue;
          var nm = (nameEl && nameEl.value.trim()) ? nameEl.value.trim() : ('Course ' + (courses.length + 1));
          if (sys === 'gpa4') {
            if (GHANA_GPA_PTS[gv] === undefined) continue;
            courses.push({ name: nm, credits: cr, grade: gv, valNum: GHANA_GPA_PTS[gv] });
            semCr += cr;
            semPts += cr * GHANA_GPA_PTS[gv];
          } else {
            var mk = parseFloat(gv);
            if (!isFinite(mk)) continue;
            mk = clampNum(mk, 0, 100);
            courses.push({ name: nm, credits: cr, grade: mk.toFixed(1) + '%', valNum: mk });
            semCr += cr;
            semPts += cr * mk;
          }
        }
        if (courses.length === 0 || semCr <= 0) return null;

        var totalCr = semCr;
        var totalPts = semPts;
        var incCum = document.getElementById('includeCumulative');
        if (incCum && incCum.checked) {
          var prevCr = parseFloat((document.getElementById('prevCredits') || {}).value);
          var prevSc = parseFloat((document.getElementById('prevScore') || {}).value);
          if (isFinite(prevCr) && prevCr > 0 && isFinite(prevSc) && prevSc >= 0) {
            totalCr += prevCr;
            totalPts += prevCr * prevSc;
          }
        }
        var raw = totalPts / totalCr;
        var rounded = sys === 'cwa' ? (Math.round(raw * 10) / 10) : (Math.round(raw * 100) / 100);
        return {
          mode: 'standard',
          sys: sys,
          score: rounded,
          rawScore: raw,
          maxScore: sys === 'cwa' ? 100 : 4.0,
          totalCredits: totalCr,
          band: ghanaClassify(sys, rounded),
          courses: courses
        };
      },
      getDefaultFriendItems: function (mode, studentCtx) {
        var sys = (studentCtx && studentCtx.sys) ? studentCtx.sys : 'gpa4';
        var count = (studentCtx && studentCtx.courses.length) ? Math.max(4, studentCtx.courses.length) : 4;
        var opts = [{ value: '', label: 'Grade' }].concat(GHANA_GPA_ORDER.slice().reverse().map(function (g) {
          return { value: g, label: g + ' (' + GHANA_GPA_PTS[g].toFixed(1) + ')' };
        }));
        var list = [];
        for (var i = 0; i < count; i++) {
          var nm = (studentCtx && studentCtx.courses[i]) ? studentCtx.courses[i].name : ('Course ' + (i + 1));
          var cr = (studentCtx && studentCtx.courses[i]) ? studentCtx.courses[i].credits : 3;
          if (sys === 'cwa') {
            list.push({ id: 'f_gh_' + i, name: nm, tag: cr + ' cr', type: 'dual-num', min: 0, max: 100, suffix: '%', placeholder: '0-100', val: null, aux: cr });
          } else {
            list.push({ id: 'f_gh_' + i, name: nm, tag: cr + ' cr', type: 'dual-gpa', options: opts, val: '', aux: cr });
          }
        }
        return list;
      },
      getSampleFriendItems: function (mode, studentCtx) {
        var items = this.getDefaultFriendItems(mode, studentCtx);
        var sys = (studentCtx && studentCtx.sys) ? studentCtx.sys : 'gpa4';
        var gSamp = ['A', 'B+', 'B', 'C+', 'A', 'B'];
        var mSamp = [74, 68, 71, 63, 76, 66];
        for (var i = 0; i < items.length; i++) {
          items[i].val = sys === 'cwa' ? mSamp[i % mSamp.length] : gSamp[i % gSamp.length];
          if (!items[i].aux) items[i].aux = 3;
        }
        return items;
      },
      calculateFriend: function (items, mode, studentCtx) {
        var sys = (studentCtx && studentCtx.sys) ? studentCtx.sys : 'gpa4';
        var cr = 0;
        var pts = 0;
        var count = 0;
        for (var i = 0; i < items.length; i++) {
          var u = (items[i].aux !== null && isFinite(items[i].aux) && items[i].aux > 0) ? items[i].aux : 3;
          if (sys === 'cwa') {
            if (items[i].val !== null && isFinite(items[i].val)) {
              cr += u;
              pts += u * items[i].val;
              count++;
            }
          } else {
            var g = items[i].val;
            if (g && GHANA_GPA_PTS[g] !== undefined) {
              cr += u;
              pts += u * GHANA_GPA_PTS[g];
              count++;
            }
          }
        }
        if (count === 0 || cr <= 0) return null;
        var raw = pts / cr;
        var sc = sys === 'cwa' ? (Math.round(raw * 10) / 10) : (Math.round(raw * 100) / 100);
        return {
          score: sc,
          maxScore: sys === 'cwa' ? 100 : 4.0,
          filledCount: count,
          band: ghanaClassify(sys, sc) + ' (' + cr + ' cr)'
        };
      },
      validateMessage: "Enter at least one course grade (or mark) for your friend to compare results.",
      formatScore: function (val) {
        var sysEl = document.getElementById('systemSelect');
        var isCwa = sysEl && sysEl.value === 'cwa';
        return isCwa ? (val.toFixed(1) + '%') : val.toFixed(2);
      },
      formatDiff: function (absDiff) {
        var sysEl = document.getElementById('systemSelect');
        var isCwa = sysEl && sysEl.value === 'cwa';
        return isCwa ? (absDiff.toFixed(1) + ' CWA points') : (absDiff.toFixed(2) + ' GPA points');
      },
      getSvgConfig: function (mode, studentComp) {
        var isCwa = studentComp && studentComp.maxScore === 100;
        return {
          min: 0,
          max: isCwa ? 100 : 4.0,
          invert: false,
          leftLabel: isCwa ? '0%' : '0.00',
          rightLabel: isCwa ? '100% CWA' : '4.00 GPA',
          guides: isCwa
            ? [
                { pct: 60, label: '60% 2:1', strong: true },
                { pct: 70, label: '70% 1st Class', strong: false }
              ]
            : [
                { pct: 75, label: '3.00 2:1', strong: true },
                { pct: 90, label: '3.60 1st Class', strong: false }
              ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName) {
        var maxV = studentCtx.maxScore;
        var bestIdx = 0;
        var bestUp = -1;
        for (var i = 0; i < studentCtx.courses.length; i++) {
          var c = studentCtx.courses[i];
          var up = (maxV - c.valNum) * (c.credits / studentCtx.totalCredits);
          if (up > bestUp) {
            bestUp = up;
            bestIdx = i;
          }
        }
        var chosen = studentCtx.courses[bestIdx] || studentCtx.courses[0];
        if (studentCtx.sys === 'cwa') {
          if (chosen.valNum >= 95) {
            return {
              bestIndex: bestIdx,
              suggestedSimVal: 98,
              html: 'Your course marks are already in the First Class CWA tier (70%+). Next step: keep continuous assessment quizzes and mid-semester exams high on 3-credit and 4-credit courses.'
            };
          }
          var tgtMk = clampNum(Math.round(chosen.valNum + 12), 50, 92);
          var gainM = ((tgtMk - chosen.valNum) * chosen.credits) / studentCtx.totalCredits;
          var newCwa = Math.round((studentCtx.rawScore + gainM) * 10) / 10;
          return {
            bestIndex: bestIdx,
            suggestedSimVal: tgtMk,
            html: '<strong>' + escapeHtml(chosen.name) + ' (' + chosen.credits + ' credits, ' + chosen.valNum.toFixed(1) + '%)</strong> carries your highest CWA leverage: raising it to <strong>' + tgtMk + '%</strong> adds <strong>+' + gainM.toFixed(1) + ' CWA points</strong> to reach <strong>' + newCwa.toFixed(1) + '%</strong>. Next step: secure strong mid-semester continuous assessment marks before the end-of-semester paper.'
          };
        }

        if (bestUp <= 0.005) {
          return {
            bestIndex: 0,
            suggestedSimVal: GHANA_GPA_ORDER.length - 1,
            html: 'All entered courses are already at Grade A (4.0). Next step: protect your 3-credit and 4-credit core modules to stay comfortably above the 3.60 First Class benchmark.'
          };
        }
        var curPos = Math.max(0, GHANA_GPA_ORDER.indexOf(chosen.grade));
        var tgtPos = clampNum(curPos + 2, 0, GHANA_GPA_ORDER.length - 1);
        var tgtGrade = GHANA_GPA_ORDER[tgtPos];
        var gainG = ((GHANA_GPA_PTS[tgtGrade] - chosen.valNum) * chosen.credits) / studentCtx.totalCredits;
        var newGpa = Math.round((studentCtx.rawScore + gainG) * 100) / 100;
        var tail = (studentCtx.score < friendCalc.score && newGpa >= friendCalc.score)
          ? ' and moves you ahead of ' + escapeHtml(friendName)
          : ' to reach <strong>' + newGpa.toFixed(2) + '</strong>';
        return {
          bestIndex: bestIdx,
          suggestedSimVal: tgtPos,
          html: '<strong>' + escapeHtml(chosen.name) + ' (' + chosen.credits + ' credits, Grade ' + chosen.grade + ')</strong> offers your biggest GPA gain: lifting it to <strong>' + tgtGrade + '</strong> adds <strong>+' + gainG.toFixed(2) + ' GPA points</strong>' + tail + '. Next step: focus revision hours on 3-credit and 4-credit departmental courses where each half-grade step moves your GPA furthest.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var courses = studentCtx.courses;
        var idx = clampNum(itemIndex, 0, courses.length - 1);
        var chosen = courses[idx];
        if (studentCtx.sys === 'cwa') {
          return {
            selectLabel: 'Course Unit',
            options: courses.map(function (c, i) {
              return { index: i, label: c.name + ' (' + c.credits + ' cr - now ' + c.valNum.toFixed(1) + '%)' };
            }),
            sliderLabel: 'Hypothetical Course Mark',
            min: 0,
            max: 100,
            step: 1,
            defaultVal: clampNum(Math.round(chosen.valNum + 10), 0, 100),
            formatSliderVal: function (v) { return Math.round(v) + '%'; },
            simulate: function (v) {
              var delta = ((v - chosen.valNum) * chosen.credits) / studentCtx.totalCredits;
              var proj = clampNum(Math.round((studentCtx.rawScore + delta) * 10) / 10, 0, 100);
              return {
                projectedScore: proj,
                projectedDisplay: proj.toFixed(1) + '%',
                changeDisplay: (delta >= 0 ? '+' : '') + delta.toFixed(1) + '%',
                changeState: delta > 0.05 ? 'pos' : (delta < -0.05 ? 'neg' : '')
              };
            }
          };
        }
        var curPos = Math.max(0, GHANA_GPA_ORDER.indexOf(chosen.grade));
        var maxIdx = GHANA_GPA_ORDER.length - 1;
        return {
          selectLabel: 'Course Unit',
          options: courses.map(function (c, i) {
            return { index: i, label: c.name + ' (' + c.credits + ' cr - now ' + c.grade + ')' };
          }),
          sliderLabel: 'Target Course Grade',
          min: 0,
          max: maxIdx,
          step: 1,
          defaultVal: clampNum(curPos + 2, 0, maxIdx),
          formatSliderVal: function (v) {
            var g = GHANA_GPA_ORDER[v] || 'A';
            return g + ' (' + GHANA_GPA_PTS[g].toFixed(1) + ')';
          },
          simulate: function (v) {
            var g = GHANA_GPA_ORDER[v] || chosen.grade;
            var delta = ((GHANA_GPA_PTS[g] - chosen.valNum) * chosen.credits) / studentCtx.totalCredits;
            var proj = clampNum(Math.round((studentCtx.rawScore + delta) * 100) / 100, 0, 4.0);
            return {
              projectedScore: proj,
              projectedDisplay: proj.toFixed(2),
              changeDisplay: (delta >= 0 ? '+' : '') + delta.toFixed(2) + ' GPA',
              changeState: delta > 0.004 ? 'pos' : (delta < -0.004 ? 'neg' : '')
            };
          }
        };
      }
    },

    /* 17. UCAS TARIFF POINTS CALCULATOR */
    'ucas-points-calculator': {
      formId: 'qualList',
      resetIds: ['resetQuals'],
      bannerDesc: 'Compare your total UCAS Tariff points with a friend and test how a single grade step changes your UK university offer standing.',
      emptyTitle: 'Calculate Your UCAS Points First',
      emptyDesc: 'Select your qualifications and grades above and click Calculate UCAS Points to compare with a friend.',
      projectedLabel: 'Projected UCAS Tariff',
      higherIsBetter: true,
      tieEpsilon: 0.5,
      modes: [
        { id: 'standard', label: 'UCAS Qualifications' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var rows = document.querySelectorAll('#qualList .qual-row');
        if (!rows.length) return null;
        var quals = [];
        var total = 0;
        for (var i = 0; i < rows.length; i++) {
          var tEl = rows[i].querySelector('.q-type');
          var sEl = rows[i].querySelector('.q-subject');
          var gEl = rows[i].querySelector('.q-grade');
          var tKey = (tEl && UCAS_TARIFF[tEl.value]) ? tEl.value : 'alevel';
          var tObj = UCAS_TARIFF[tKey];
          var gVal = gEl ? gEl.value : '';
          if (!gVal || tObj.grades[gVal] === undefined) continue;
          var pts = tObj.grades[gVal];
          var subj = (sEl && sEl.value.trim()) ? sEl.value.trim() : (tObj.name + ' ' + (quals.length + 1));
          total += pts;
          quals.push({ typeKey: tKey, typeName: tObj.name, subject: subj, grade: gVal, pts: pts });
        }
        if (quals.length === 0) return null;
        return {
          mode: 'standard',
          score: total,
          maxScore: Math.max(168, quals.length * 56),
          band: ucasTierLabel(total) + ' (' + quals.map(function (q) { return q.grade; }).join(', ') + ')',
          quals: quals
        };
      },
      getDefaultFriendItems: function (mode, studentCtx) {
        var quals = (studentCtx && studentCtx.quals && studentCtx.quals.length) ? studentCtx.quals : [
          { typeKey: 'alevel', subject: 'A-Level Subject 1' },
          { typeKey: 'alevel', subject: 'A-Level Subject 2' },
          { typeKey: 'alevel', subject: 'A-Level Subject 3' }
        ];
        return quals.map(function (q, idx) {
          var tKey = UCAS_TARIFF[q.typeKey] ? q.typeKey : 'alevel';
          var tObj = UCAS_TARIFF[tKey];
          var keys = Object.keys(tObj.grades);
          var opts = [{ value: '', label: 'Select grade...' }].concat(keys.map(function (k) {
            return { value: k, label: k + ' (' + tObj.grades[k] + ' pts)' };
          }));
          return { id: 'f_ucas_' + idx, typeKey: tKey, name: q.subject, tag: tObj.name, type: 'select', options: opts, val: '' };
        });
      },
      getSampleFriendItems: function (mode, studentCtx) {
        var items = this.getDefaultFriendItems(mode, studentCtx);
        for (var i = 0; i < items.length; i++) {
          var opts = items[i].options;
          // Pick second or third top grade (e.g. A or B)
          var pickIdx = Math.min(opts.length - 1, (i % 2 === 0) ? 2 : 3);
          items[i].val = opts[pickIdx] ? opts[pickIdx].value : (opts[1] ? opts[1].value : '');
        }
        return items;
      },
      calculateFriend: function (items) {
        var total = 0;
        var grades = [];
        for (var i = 0; i < items.length; i++) {
          var tKey = items[i].typeKey || 'alevel';
          var g = items[i].val;
          if (g && UCAS_TARIFF[tKey] && UCAS_TARIFF[tKey].grades[g] !== undefined) {
            total += UCAS_TARIFF[tKey].grades[g];
            grades.push(g);
          }
        }
        if (grades.length === 0) return null;
        return {
          score: total,
          maxScore: Math.max(168, grades.length * 56),
          filledCount: grades.length,
          band: ucasTierLabel(total) + ' (' + grades.join(', ') + ')'
        };
      },
      validateMessage: 'Select at least one qualification grade for your friend to compare UCAS Tariff points.',
      formatScore: function (val) { return Math.round(val) + ' pts'; },
      formatDiff: function (absDiff) { return Math.round(absDiff) + ' UCAS points'; },
      getSvgConfig: function (mode, studentComp) {
        var maxV = Math.max(168, studentComp ? studentComp.maxScore : 168);
        return {
          min: 0,
          max: maxV,
          invert: false,
          leftLabel: '0 pts',
          rightLabel: maxV + ' pts',
          guides: [
            { pct: (112 / maxV) * 100, label: '112 BBC', strong: false },
            { pct: (144 / maxV) * 100, label: '144 AAA', strong: true }
          ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName) {
        var quals = studentCtx.quals;
        var bestIdx = 0;
        var bestGain = -1;
        for (var i = 0; i < quals.length; i++) {
          var q = quals[i];
          var tObj = UCAS_TARIFF[q.typeKey];
          var keys = Object.keys(tObj.grades); // descending order (A*, A, B...)
          var maxPts = tObj.grades[keys[0]];
          var headroom = maxPts - q.pts;
          if (headroom > bestGain) {
            bestGain = headroom;
            bestIdx = i;
          }
        }
        var chosen = quals[bestIdx];
        var cObj = UCAS_TARIFF[chosen.typeKey];
        var ascKeys = Object.keys(cObj.grades).slice().reverse();
        var curPos = Math.max(0, ascKeys.indexOf(chosen.grade));
        if (bestGain <= 0) {
          return {
            bestIndex: bestIdx,
            suggestedSimVal: ascKeys.length - 1,
            html: 'Your qualifications are already at top UCAS Tariff grades. Next step: verify subject-specific entry requirements (such as A-Level Mathematics or Chemistry) for your firm UCAS choice.'
          };
        }
        var tgtPos = clampNum(curPos + 1, 0, ascKeys.length - 1);
        var tgtGrade = ascKeys[tgtPos];
        var gain = cObj.grades[tgtGrade] - chosen.pts;
        var newTot = studentCtx.score + gain;
        var tail = (studentCtx.score < friendCalc.score && newTot >= friendCalc.score)
          ? ' and moves you ahead of ' + escapeHtml(friendName)
          : ' to reach <strong>' + newTot + ' UCAS points</strong>';
        return {
          bestIndex: bestIdx,
          suggestedSimVal: tgtPos,
          html: 'Raising <strong>' + escapeHtml(chosen.subject) + ' (' + chosen.typeName + ')</strong> by one grade from ' + chosen.grade + ' to <strong>' + tgtGrade + '</strong> adds <strong>+' + gain + ' UCAS points</strong>' + tail + '. Next step: target high-mark exam synthesis questions and examiner mark-scheme phrasing in ' + escapeHtml(chosen.subject) + '.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var quals = studentCtx.quals;
        var idx = clampNum(itemIndex, 0, quals.length - 1);
        var chosen = quals[idx];
        var cObj = UCAS_TARIFF[chosen.typeKey];
        var ascKeys = Object.keys(cObj.grades).slice().reverse();
        var curPos = Math.max(0, ascKeys.indexOf(chosen.grade));
        var maxIdx = ascKeys.length - 1;
        return {
          selectLabel: 'Qualification',
          options: quals.map(function (q, i) {
            return { index: i, label: q.subject + ' (Now ' + q.grade + ' / ' + q.pts + ' pts)' };
          }),
          sliderLabel: 'Target Grade',
          min: 0,
          max: maxIdx,
          step: 1,
          defaultVal: clampNum(curPos + 1, 0, maxIdx),
          formatSliderVal: function (v) {
            var g = ascKeys[v] || chosen.grade;
            return g + ' (' + cObj.grades[g] + ' pts)';
          },
          simulate: function (v) {
            var g = ascKeys[v] || chosen.grade;
            var delta = cObj.grades[g] - chosen.pts;
            var proj = studentCtx.score + delta;
            return {
              projectedScore: proj,
              projectedDisplay: proj + ' pts',
              changeDisplay: (delta >= 0 ? '+' : '') + delta + ' pts',
              changeState: delta > 0 ? 'pos' : (delta < 0 ? 'neg' : '')
            };
          }
        };
      }
    },

    /* 18. UGANDA UNEB UACE POINTS CALCULATOR */
    'uace-points-calculator': {
      formId: 'uaceForm',
      resetIds: ['resetBtn'],
      bannerDesc: 'Compare your UNEB UACE raw points or PUJAB weighted admission score with a classmate and see which Principal subject adds the most weight.',
      emptyTitle: 'Calculate Your UACE Points First',
      emptyDesc: 'Select grades for your three Principal subjects, General Paper, and Subsidiary above to compare with a classmate.',
      projectedLabel: 'Projected UACE Score',
      higherIsBetter: true,
      tieEpsilon: 0.05,
      modes: [
        { id: 'raw', label: 'Raw Points (/20)' },
        { id: 'weighted', label: 'PUJAB Weighted' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var p1El = document.getElementById('p1Grade');
        var p2El = document.getElementById('p2Grade');
        var p3El = document.getElementById('p3Grade');
        var gpEl = document.getElementById('gpGrade');
        var sbEl = document.getElementById('subMathIctGrade');
        if (!p1El || !p2El || !p3El || !gpEl || !sbEl) return null;
        if (p1El.value === '' || p2El.value === '' || p3El.value === '' || gpEl.value === '' || sbEl.value === '') return null;

        var p1 = parseInt(p1El.value, 10);
        var p2 = parseInt(p2El.value, 10);
        var p3 = parseInt(p3El.value, 10);
        var gp = parseInt(gpEl.value, 10);
        var sb = parseInt(sbEl.value, 10);
        if (!isFinite(p1) || !isFinite(p2) || !isFinite(p3) || !isFinite(gp) || !isFinite(sb)) return null;

        var n1 = ((document.getElementById('p1Name') || {}).value || '').trim() || 'Essential Principal 1';
        var n2 = ((document.getElementById('p2Name') || {}).value || '').trim() || 'Essential Principal 2';
        var n3 = ((document.getElementById('p3Name') || {}).value || '').trim() || 'Relevant Principal 3';

        var rawTotal = p1 + p2 + p3 + gp + sb;
        var passes = (p1 >= 2 ? 1 : 0) + (p2 >= 2 ? 1 : 0) + (p3 >= 2 ? 1 : 0);
        var dist = parseInt(((document.getElementById('uceDistinctions') || {}).value || '0'), 10) || 0;
        var cred = parseInt(((document.getElementById('uceCredits') || {}).value || '0'), 10) || 0;
        var fem = !!((document.getElementById('femaleAffirmative') || {}).checked);
        var bonus = clampNum(dist, 0, 10) * 0.3 + clampNum(cred, 0, 10) * 0.2 + (fem ? 1.5 : 0);
        var weightedTotal = Math.round((p1 * 3 + p2 * 3 + p3 * 2 + gp + sb + bonus) * 10) / 10;
        var pathway = passes >= 2 ? 'Direct Degree Eligible' : (passes === 1 ? 'Diploma Route (1 Principal Pass)' : 'Certificate Route');

        return {
          mode: 'raw',
          score: rawTotal,
          rawTotal: rawTotal,
          weightedTotal: weightedTotal,
          bonus: bonus,
          maxScore: 20,
          band: pathway + ' (' + passes + '/3 Principal Passes)',
          principals: [
            { name: n1, pts: p1, wt: 3 },
            { name: n2, pts: p2, wt: 3 },
            { name: n3, pts: p3, wt: 2 }
          ],
          gp: gp,
          sb: sb
        };
      },
      getComparableStudentScore: function (studentCtx, friendMode) {
        if (friendMode === 'weighted') {
          return {
            score: studentCtx.weightedTotal,
            maxScore: 54.5,
            band: 'PUJAB Weighted (' + studentCtx.band + ')'
          };
        }
        return {
          score: studentCtx.rawTotal,
          maxScore: 20,
          band: studentCtx.band
        };
      },
      getDefaultFriendItems: function (mode, studentCtx) {
        var pOpts = [{ value: '', label: 'Select grade...' }].concat(UACE_PRINCIPAL_GRADES.map(function (g) {
          return { value: String(g.pts), label: g.label };
        }));
        var subOpts = [
          { value: '', label: 'Select...' },
          { value: '1', label: 'Pass (1 pt)' },
          { value: '0', label: 'Fail (0 pts)' }
        ];
        var n1 = (studentCtx && studentCtx.principals[0]) ? studentCtx.principals[0].name : 'Principal 1 (Essential)';
        var n2 = (studentCtx && studentCtx.principals[1]) ? studentCtx.principals[1].name : 'Principal 2 (Essential)';
        var n3 = (studentCtx && studentCtx.principals[2]) ? studentCtx.principals[2].name : 'Principal 3 (Relevant)';
        return [
          { id: 'f_p1', name: n1, tag: mode === 'weighted' ? 'x3 Wt' : 'Max 6', type: 'select', options: pOpts, val: '' },
          { id: 'f_p2', name: n2, tag: mode === 'weighted' ? 'x3 Wt' : 'Max 6', type: 'select', options: pOpts, val: '' },
          { id: 'f_p3', name: n3, tag: mode === 'weighted' ? 'x2 Wt' : 'Max 6', type: 'select', options: pOpts, val: '' },
          { id: 'f_gp', name: 'General Paper', tag: '1 pt', type: 'select', options: subOpts, val: '' },
          { id: 'f_sb', name: 'Subsidiary Maths / ICT', tag: '1 pt', type: 'select', options: subOpts, val: '' }
        ];
      },
      getSampleFriendItems: function (mode, studentCtx) {
        var items = this.getDefaultFriendItems(mode, studentCtx);
        var vals = ['5', '4', '4', '1', '1'];
        for (var i = 0; i < items.length; i++) items[i].val = vals[i];
        return items;
      },
      calculateFriend: function (items, mode, studentCtx) {
        if (items.length < 5) return null;
        var vals = [];
        for (var i = 0; i < 5; i++) {
          var v = parseInt(items[i].val, 10);
          if (!isFinite(v)) return null;
          vals.push(v);
        }
        var passes = (vals[0] >= 2 ? 1 : 0) + (vals[1] >= 2 ? 1 : 0) + (vals[2] >= 2 ? 1 : 0);
        var pathway = passes >= 2 ? 'Direct Degree Eligible' : (passes === 1 ? 'Diploma Route' : 'Certificate Route');
        if (mode === 'weighted') {
          var bonus = studentCtx ? studentCtx.bonus : 0;
          var wt = Math.round((vals[0] * 3 + vals[1] * 3 + vals[2] * 2 + vals[3] + vals[4] + bonus) * 10) / 10;
          return {
            score: wt,
            maxScore: 54.5,
            filledCount: 5,
            band: 'PUJAB Weighted - ' + pathway
          };
        }
        var raw = vals[0] + vals[1] + vals[2] + vals[3] + vals[4];
        return {
          score: raw,
          maxScore: 20,
          filledCount: 5,
          band: pathway + ' (' + passes + '/3 Principal Passes)'
        };
      },
      validateMessage: "Select your friend's 3 Principal grades, General Paper, and Subsidiary result to compare UACE scores.",
      formatScore: function (val) {
        return compareState.friendMode === 'weighted' ? (val.toFixed(1) + ' wt') : (Math.round(val) + ' / 20');
      },
      formatDiff: function (absDiff) {
        return compareState.friendMode === 'weighted'
          ? (absDiff.toFixed(1) + ' weighted points')
          : (Math.round(absDiff) + (Math.round(absDiff) === 1 ? ' UACE point' : ' UACE points'));
      },
      getSvgConfig: function (mode) {
        if (mode === 'weighted') {
          return {
            min: 0,
            max: 54.5,
            invert: false,
            leftLabel: '0',
            rightLabel: '54.5 Max',
            guides: [
              { pct: (32 / 54.5) * 100, label: '32 Degree', strong: false },
              { pct: (44 / 54.5) * 100, label: '44 Merit', strong: true }
            ]
          };
        }
        return {
          min: 0,
          max: 20,
          invert: false,
          leftLabel: '0 pts',
          rightLabel: '20 pts',
          guides: [
            { pct: 50, label: '10 pts', strong: false },
            { pct: 75, label: '15 Competitive', strong: true }
          ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName, studentComp) {
        var isWt = compareState.friendMode === 'weighted';
        var bestIdx = 0;
        var bestGain = -1;
        for (var i = 0; i < 3; i++) {
          var p = studentCtx.principals[i];
          var mult = isWt ? p.wt : 1;
          var headroom = (6 - p.pts) * mult;
          if (headroom > bestGain) {
            bestGain = headroom;
            bestIdx = i;
          }
        }
        var chosen = studentCtx.principals[bestIdx];
        if (chosen.pts >= 6) {
          return {
            bestIndex: bestIdx,
            suggestedSimVal: 6,
            html: 'Your Principal subjects are already at Grade A (6 points). Next step: ensure you pass both General Paper and Subsidiary Maths/ICT to collect all 20 raw points.'
          };
        }
        var tgtPts = clampNum(chosen.pts + 1, 2, 6);
        var multVal = isWt ? chosen.wt : 1;
        var gain = (tgtPts - chosen.pts) * multVal;
        var newScore = studentComp.score + gain;
        var wtLabel = isWt ? (' (x' + chosen.wt + ' PUJAB weight)') : '';
        return {
          bestIndex: bestIdx,
          suggestedSimVal: tgtPts,
          html: 'Raising <strong>' + escapeHtml(chosen.name) + wtLabel + '</strong> from ' + UACE_PT_LETTER[chosen.pts] + ' to <strong>' + UACE_PT_LETTER[tgtPts] + '</strong> adds <strong>+' + (isWt ? gain.toFixed(1) : gain) + ' points</strong> to reach <strong>' + (isWt ? newScore.toFixed(1) : (newScore + '/20')) + '</strong>. Next step: focus UNEB Paper 1 & Paper 2 past-paper practice on Essential Principals first because they carry 3x PUJAB university weight.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var isWt = compareState.friendMode === 'weighted';
        var idx = clampNum(itemIndex, 0, 2);
        var chosen = studentCtx.principals[idx];
        var baseScore = isWt ? studentCtx.weightedTotal : studentCtx.rawTotal;
        return {
          selectLabel: 'Principal Subject',
          options: studentCtx.principals.map(function (p, i) {
            return { index: i, label: p.name + ' (Now ' + UACE_PT_LETTER[p.pts] + ' / ' + p.pts + ' pts)' };
          }),
          sliderLabel: 'Target UNEB Grade',
          min: 0,
          max: 6,
          step: 1,
          defaultVal: clampNum(chosen.pts + 1, 0, 6),
          formatSliderVal: function (v) { return UACE_PT_LETTER[v] + ' (' + v + ' pts)'; },
          simulate: function (v) {
            var mult = isWt ? chosen.wt : 1;
            var delta = (v - chosen.pts) * mult;
            var proj = baseScore + delta;
            return {
              projectedScore: proj,
              projectedDisplay: isWt ? (proj.toFixed(1) + ' wt') : (proj + ' / 20'),
              changeDisplay: (delta >= 0 ? '+' : '') + (isWt ? delta.toFixed(1) : delta) + ' pts',
              changeState: delta > 0 ? 'pos' : (delta < 0 ? 'neg' : '')
            };
          }
        };
      }
    },

    /* 19. ZIMSEC A-LEVEL POINTS CALCULATOR */
    'zimsec-alevel-points-calculator': {
      formId: 'alevelForm',
      resetIds: ['resetBtn'],
      bannerDesc: 'Compare your ZIMSEC A-Level points and university admission tier with a classmate across 3 or 4 Principal subjects.',
      emptyTitle: 'Calculate Your ZIMSEC Points First',
      emptyDesc: 'Select grades for your three required A-Level Principal subjects above to compare with a classmate.',
      projectedLabel: 'Projected Points',
      higherIsBetter: true,
      tieEpsilon: 0.05,
      modes: [
        { id: '3sub', label: '3 Principals (Max 15)' },
        { id: '4sub', label: '4 Principals (Max 20)' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var g1 = (document.getElementById('sub1Grade') || {}).value || '';
        var g2 = (document.getElementById('sub2Grade') || {}).value || '';
        var g3 = (document.getElementById('sub3Grade') || {}).value || '';
        var g4 = (document.getElementById('sub4Grade') || {}).value || '';
        if (!g1 || !g2 || !g3 || ZIMSEC_PTS[g1] === undefined || ZIMSEC_PTS[g2] === undefined || ZIMSEC_PTS[g3] === undefined) return null;

        var n1 = ((document.getElementById('sub1Name') || {}).value || '').trim() || 'Subject 1';
        var n2 = ((document.getElementById('sub2Name') || {}).value || '').trim() || 'Subject 2';
        var n3 = ((document.getElementById('sub3Name') || {}).value || '').trim() || 'Subject 3';
        var n4 = ((document.getElementById('sub4Name') || {}).value || '').trim() || 'Subject 4';

        var subjects = [
          { name: n1, grade: g1, pts: ZIMSEC_PTS[g1] },
          { name: n2, grade: g2, pts: ZIMSEC_PTS[g2] },
          { name: n3, grade: g3, pts: ZIMSEC_PTS[g3] }
        ];
        var hasFourth = !!(g4 && ZIMSEC_PTS[g4] !== undefined);
        if (hasFourth) {
          subjects.push({ name: n4, grade: g4, pts: ZIMSEC_PTS[g4] });
        }
        var total = subjects.reduce(function (s, x) { return s + x.pts; }, 0);
        var passes = subjects.filter(function (x) { return x.pts >= 1; }).length;
        var tier = passes < 2 ? 'Below 2-Pass Minimum' : total >= 14 ? 'Tier 1 (Elite Competitive)' : total >= 10 ? 'Tier 2 (Competitive STEM/Commerce)' : total >= 6 ? 'Tier 3 (Standard Degree)' : 'Minimum Degree Pass';
        return {
          mode: hasFourth ? '4sub' : '3sub',
          score: total,
          maxScore: hasFourth ? 20 : 15,
          band: tier + ' (' + subjects.map(function (s) { return s.grade; }).join('-') + ')',
          subjects: subjects
        };
      },
      getComparableStudentScore: function (studentCtx, friendMode) {
        if (friendMode === '3sub' && studentCtx.subjects.length === 4) {
          var sub3 = studentCtx.subjects.slice(0, 3);
          var sum3 = sub3.reduce(function (a, b) { return a + b.pts; }, 0);
          var p3 = sub3.filter(function (x) { return x.pts >= 1; }).length;
          var t3 = p3 < 2 ? 'Below 2-Pass Minimum' : sum3 >= 14 ? 'Tier 1 (Elite)' : sum3 >= 10 ? 'Tier 2 (Competitive)' : sum3 >= 6 ? 'Tier 3 (Standard)' : 'Minimum Pass';
          return { score: sum3, maxScore: 15, band: t3 + ' (' + sub3.map(function (s) { return s.grade; }).join('-') + ')' };
        }
        return { score: studentCtx.score, maxScore: friendMode === '4sub' ? 20 : 15, band: studentCtx.band };
      },
      getDefaultFriendItems: function (mode, studentCtx) {
        var count = mode === '4sub' ? 4 : 3;
        var opts = [{ value: '', label: 'Select grade...' }].concat(ZIMSEC_GRADES.map(function (g) {
          return { value: g.grade, label: g.label };
        }));
        var list = [];
        for (var i = 0; i < count; i++) {
          var nm = (studentCtx && studentCtx.subjects[i]) ? studentCtx.subjects[i].name : ('Subject ' + (i + 1));
          list.push({ id: 'f_zim_' + i, name: nm, tag: 'Max 5', type: 'select', options: opts, val: '' });
        }
        return list;
      },
      getSampleFriendItems: function (mode, studentCtx) {
        var items = this.getDefaultFriendItems(mode, studentCtx);
        var samp = ['B', 'B', 'C', 'C'];
        for (var i = 0; i < items.length; i++) items[i].val = samp[i];
        return items;
      },
      calculateFriend: function (items, mode) {
        var req = mode === '4sub' ? 4 : 3;
        if (items.length < req) return null;
        var sum = 0;
        var passes = 0;
        var letters = [];
        for (var i = 0; i < req; i++) {
          var g = items[i].val;
          if (!g || ZIMSEC_PTS[g] === undefined) return null;
          sum += ZIMSEC_PTS[g];
          if (ZIMSEC_PTS[g] >= 1) passes++;
          letters.push(g);
        }
        var tier = passes < 2 ? 'Below 2-Pass Minimum' : sum >= 14 ? 'Tier 1 (Elite Competitive)' : sum >= 10 ? 'Tier 2 (Competitive)' : sum >= 6 ? 'Tier 3 (Standard Degree)' : 'Minimum Degree Pass';
        return {
          score: sum,
          maxScore: mode === '4sub' ? 20 : 15,
          filledCount: req,
          band: tier + ' (' + letters.join('-') + ')'
        };
      },
      validateMessage: "Select all Principal subject grades for your friend to compare ZIMSEC A-Level points.",
      formatScore: function (val) {
        var maxP = compareState.friendMode === '4sub' ? 20 : 15;
        return Math.round(val) + ' / ' + maxP;
      },
      formatDiff: function (absDiff) {
        var d = Math.round(absDiff);
        return d + (d === 1 ? ' A-Level point' : ' A-Level points');
      },
      getSvgConfig: function (mode) {
        var maxV = mode === '4sub' ? 20 : 15;
        return {
          min: 0,
          max: maxV,
          invert: false,
          leftLabel: '0 pts',
          rightLabel: maxV + ' Max',
          guides: [
            { pct: (10 / maxV) * 100, label: '10 Tier 2', strong: false },
            { pct: (14 / maxV) * 100, label: '14 Tier 1', strong: true }
          ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName, studentComp) {
        var limit = compareState.friendMode === '3sub' ? Math.min(3, studentCtx.subjects.length) : studentCtx.subjects.length;
        var bestIdx = 0;
        var lowestPts = 6;
        for (var i = 0; i < limit; i++) {
          if (studentCtx.subjects[i].pts < lowestPts) {
            lowestPts = studentCtx.subjects[i].pts;
            bestIdx = i;
          }
        }
        var chosen = studentCtx.subjects[bestIdx];
        if (chosen.pts >= 5) {
          return {
            bestIndex: bestIdx,
            suggestedSimVal: 6,
            html: 'Your Principal subjects are already at Grade A (5 points each). Next step: confirm faculty-specific subject prerequisites at UZ, NUST, or MSU.'
          };
        }
        var curPos = Math.max(0, ZIMSEC_ORDER.indexOf(chosen.grade));
        var tgtPos = clampNum(Math.max(2, curPos + 1), 2, 6);
        var tgtGrade = ZIMSEC_ORDER[tgtPos];
        var gain = ZIMSEC_PTS[tgtGrade] - chosen.pts;
        var newTot = studentComp.score + gain;
        var tail = (studentComp.score < friendCalc.score && newTot >= friendCalc.score)
          ? ' and moves you ahead of ' + escapeHtml(friendName)
          : ' to reach <strong>' + newTot + ' / ' + studentComp.maxScore + ' points</strong>';
        return {
          bestIndex: bestIdx,
          suggestedSimVal: tgtPos,
          html: 'Lifting <strong>' + escapeHtml(chosen.name) + '</strong> from Grade ' + chosen.grade + ' (' + chosen.pts + ' pts) to <strong>Grade ' + tgtGrade + ' (' + ZIMSEC_PTS[tgtGrade] + ' pts)</strong> adds <strong>+' + gain + (gain === 1 ? ' point' : ' points') + '</strong>' + tail + '. Next step: practise ZIMSEC structured essay and practical paper mark schemes in ' + escapeHtml(chosen.name) + '.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var subs = studentCtx.subjects;
        var idx = clampNum(itemIndex, 0, subs.length - 1);
        var chosen = subs[idx];
        var curPos = Math.max(0, ZIMSEC_ORDER.indexOf(chosen.grade));
        var compBase = compareState.friendMode === '3sub' && subs.length === 4
          ? subs.slice(0, 3).reduce(function (a, b) { return a + b.pts; }, 0)
          : studentCtx.score;
        var maxOut = compareState.friendMode === '4sub' ? 20 : 15;
        return {
          selectLabel: 'Principal Subject',
          options: subs.map(function (s, i) {
            return { index: i, label: s.name + ' (Now Grade ' + s.grade + ' / ' + s.pts + ' pts)' };
          }),
          sliderLabel: 'Target ZIMSEC Grade',
          min: 0,
          max: 6,
          step: 1,
          defaultVal: clampNum(Math.max(2, curPos + 1), 0, 6),
          formatSliderVal: function (v) {
            var g = ZIMSEC_ORDER[v] || 'A';
            return 'Grade ' + g + ' (' + ZIMSEC_PTS[g] + ' pts)';
          },
          simulate: function (v) {
            var g = ZIMSEC_ORDER[v] || chosen.grade;
            var counted = !(compareState.friendMode === '3sub' && idx === 3);
            var delta = counted ? (ZIMSEC_PTS[g] - chosen.pts) : 0;
            var proj = compBase + delta;
            return {
              projectedScore: proj,
              projectedDisplay: proj + ' / ' + maxOut,
              changeDisplay: (delta >= 0 ? '+' : '') + delta + ' pts',
              changeState: delta > 0 ? 'pos' : (delta < 0 ? 'neg' : '')
            };
          }
        };
      }
    },

    /* 21. SOUTH AFRICAN UNIVERSITY ADMISSION CALCULATOR */
    'south-african-university-admission-calculator': {
      formId: 'saForm',
      resetIds: [],
      bannerDesc: 'Compare your institution-specific APS and NSC pass level with a classmate targeting the same South African university.',
      emptyTitle: 'Calculate Your Admission Standing First',
      emptyDesc: 'Enter your NSC subject percentages above and calculate your institution APS to compare with a friend.',
      projectedLabel: 'Projected Institution APS',
      higherIsBetter: true,
      tieEpsilon: 0.5,
      modes: [
        { id: 'standard', label: 'NSC Subject Marks' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var fields = [
          { id: 'saMarkEnglish', name: 'English', tag: 'Language' },
          { id: 'saMarkMaths', name: 'Mathematics / Maths Lit', tag: 'Core' },
          { id: 'saMarkPhysSci', name: 'Physical Sciences', tag: 'Science' },
          { id: 'saMarkLifeSci', name: 'Life Sciences', tag: 'Science' },
          { id: 'saMarkElective1', name: 'Elective 1', tag: 'Elective' },
          { id: 'saMarkElective2', name: 'Elective 2', tag: 'Elective' },
          { id: 'saMarkElective3', name: 'Elective 3', tag: 'Elective' }
        ];
        var academic = [];
        for (var i = 0; i < fields.length; i++) {
          var el = document.getElementById(fields[i].id);
          var v = el ? parseFloat(el.value) : NaN;
          if (isFinite(v) && v >= 0 && v <= 100) {
            academic.push({ id: fields[i].id, name: fields[i].name, tag: fields[i].tag, mark: v, level: saAdmLevelFromMark(v), isLO: false });
          }
        }
        if (academic.length < 6) return null;
        var loEl = document.getElementById('saMarkLO');
        var loVal = loEl ? parseFloat(loEl.value) : NaN;
        var loMark = (isFinite(loVal) && loVal >= 0 && loVal <= 100) ? loVal : null;
        var instEl = document.getElementById('saInstitution');
        var instKey = (instEl && SA_ADM_LO_RULES[instEl.value]) ? instEl.value : 'generic';
        var loRule = SA_ADM_LO_RULES[instKey];
        var calc = saAdmComputeAps(academic, loMark, loRule);
        if (!calc) return null;
        var allSubjects = academic.slice();
        if (loRule !== 'exclude') {
          allSubjects.push({ id: 'saMarkLO', name: 'Life Orientation', tag: loRule === 'reduced' ? 'Reduced LO' : 'Full LO', mark: loMark !== null ? loMark : 65, level: saAdmLevelFromMark(loMark !== null ? loMark : 65), isLO: true });
        }
        return {
          mode: 'standard',
          score: calc.aps,
          maxScore: calc.maxAps,
          band: calc.pass + ' (' + calc.aps + ' / ' + calc.maxAps + ' APS)',
          loRule: loRule,
          loMark: loMark,
          academic: academic,
          allSubjects: allSubjects
        };
      },
      getDefaultFriendItems: function (mode, studentCtx) {
        var subs = (studentCtx && studentCtx.allSubjects && studentCtx.allSubjects.length) ? studentCtx.allSubjects : [
          { name: 'English', tag: 'Language', isLO: false },
          { name: 'Mathematics', tag: 'Core', isLO: false },
          { name: 'Physical Sciences', tag: 'Science', isLO: false },
          { name: 'Life Sciences', tag: 'Science', isLO: false },
          { name: 'Elective 1', tag: 'Elective', isLO: false },
          { name: 'Elective 2', tag: 'Elective', isLO: false }
        ];
        return subs.map(function (s, idx) {
          return {
            id: 'f_sa_' + idx,
            name: s.name,
            tag: s.tag,
            isLO: !!s.isLO,
            type: 'number',
            min: 0,
            max: 100,
            suffix: '%',
            placeholder: '0-100',
            val: null
          };
        });
      },
      getSampleFriendItems: function (mode, studentCtx) {
        var items = this.getDefaultFriendItems(mode, studentCtx);
        var sample = [68, 72, 66, 71, 64, 69, 62, 74];
        for (var i = 0; i < items.length; i++) {
          items[i].val = sample[i % sample.length];
        }
        return items;
      },
      calculateFriend: function (items, mode, studentCtx) {
        var loRule = (studentCtx && studentCtx.loRule) ? studentCtx.loRule : 'exclude';
        var ac = [];
        var loMark = null;
        var filled = 0;
        for (var i = 0; i < items.length; i++) {
          if (items[i].val !== null && isFinite(items[i].val)) {
            filled++;
            if (items[i].isLO) loMark = items[i].val;
            else ac.push({ name: items[i].name, mark: items[i].val });
          }
        }
        if (ac.length < 6) return null;
        var calc = saAdmComputeAps(ac, loMark, loRule);
        if (!calc) return null;
        return {
          score: calc.aps,
          maxScore: calc.maxAps,
          filledCount: filled,
          band: calc.pass + ' (' + calc.aps + ' / ' + calc.maxAps + ' APS)'
        };
      },
      validateMessage: 'Enter at least 6 NSC academic subject percentages (0 to 100%) for your friend.',
      formatScore: function (val) { return Math.round(val) + ' APS'; },
      formatDiff: function (absDiff) {
        var p = Math.round(absDiff);
        return p + ' APS ' + (p === 1 ? 'point' : 'points');
      },
      getSvgConfig: function (mode, studentComp) {
        var maxAps = (studentComp && studentComp.maxScore) ? studentComp.maxScore : 42;
        return {
          min: 0,
          max: maxAps,
          invert: false,
          leftLabel: '0 APS',
          rightLabel: maxAps + ' Max',
          guides: [
            { pct: (26 / maxAps) * 100, label: '26 Deg', strong: false },
            { pct: (36 / maxAps) * 100, label: '36 Comp', strong: true }
          ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName) {
        var ac = studentCtx.academic;
        var bestIdx = 0;
        var bestDist = 999;
        var bestNextFloor = 80;
        for (var i = 0; i < ac.length; i++) {
          if (ac[i].mark >= 80) continue;
          var nextBrk = ac[i].mark < 30 ? 30 : (Math.floor(ac[i].mark / 10) + 1) * 10;
          var dist = nextBrk - ac[i].mark;
          // Prioritize English & Mathematics slightly on ties since faculty minimums depend on them
          var tieBonus = (i <= 1) ? -0.4 : 0;
          if (dist + tieBonus < bestDist) {
            bestDist = dist + tieBonus;
            bestIdx = i;
            bestNextFloor = nextBrk;
          }
        }
        var chosen = ac[bestIdx];
        if (chosen.mark >= 80) {
          return {
            bestIndex: 0,
            suggestedSimVal: Math.min(100, Math.round(ac[0].mark)),
            html: 'Your top academic subjects already sit in NSC Level 7 (80%+). Next step: protect your Mathematics and English percentages in final NSC Paper 1 and Paper 2 sittings to clear competitive faculty cut-offs.'
          };
        }
        var needed = Math.max(1, Math.ceil(bestNextFloor - chosen.mark));
        var newAc = ac.map(function (s, idx) {
          return { name: s.name, mark: idx === bestIdx ? bestNextFloor : s.mark };
        });
        var simCalc = saAdmComputeAps(newAc, studentCtx.loMark, studentCtx.loRule);
        var projAps = simCalc ? simCalc.aps : (studentCtx.score + 1);
        var gain = Math.max(1, projAps - studentCtx.score);
        var vsNote = (studentCtx.score < friendCalc.score && projAps >= friendCalc.score)
          ? ' and catches ' + escapeHtml(friendName)
          : ' to reach <strong>' + projAps + ' APS</strong>';
        return {
          bestIndex: bestIdx,
          suggestedSimVal: bestNextFloor,
          html: '<strong>' + escapeHtml(chosen.name) + ' (' + Math.round(chosen.mark) + '%, Level ' + chosen.level + ')</strong> is only <strong>' + needed + '%</strong> below the <strong>' + bestNextFloor + '%</strong> NSC bracket: crossing it adds <strong>+' + gain + ' APS</strong>' + vsNote + '. Next step: drill past DBE NSC November Paper 1 and Paper 2 exam sections in ' + escapeHtml(chosen.name) + '.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var subs = studentCtx.allSubjects;
        var idx = clampNum(itemIndex, 0, subs.length - 1);
        var chosen = subs[idx];
        return {
          selectLabel: 'NSC Subject',
          options: subs.map(function (s, i) {
            return { index: i, label: s.name + ' (now ' + Math.round(s.mark) + '% - Lvl ' + s.level + ')' };
          }),
          sliderLabel: 'Hypothetical Subject Mark',
          min: 0,
          max: 100,
          step: 1,
          defaultVal: clampNum(Math.round(chosen.mark + 8), 0, 100),
          formatSliderVal: function (v) { return Math.round(v) + '% (Lvl ' + saAdmLevelFromMark(v) + ')'; },
          simulate: function (v) {
            var newAc = [];
            var newLo = studentCtx.loMark;
            for (var i = 0; i < subs.length; i++) {
              var mk = (i === idx) ? v : subs[i].mark;
              if (subs[i].isLO) newLo = mk;
              else newAc.push({ name: subs[i].name, mark: mk });
            }
            var c = saAdmComputeAps(newAc, newLo, studentCtx.loRule);
            var proj = c ? c.aps : studentCtx.score;
            var delta = proj - studentCtx.score;
            return {
              projectedScore: proj,
              projectedDisplay: proj + ' / ' + studentCtx.maxScore + ' APS',
              changeDisplay: (delta >= 0 ? '+' : '') + delta + ' APS',
              changeState: delta > 0 ? 'pos' : (delta < 0 ? 'neg' : '')
            };
          }
        };
      }
    },

    /* 22. ZIMSEC O-LEVEL POINTS CALCULATOR */
    'zimsec-olevel-points-calculator': {
      formId: 'olevelForm',
      resetIds: ['resetBtn'],
      bannerDesc: 'Compare your ZIMSEC O-Level Best 5 points and 5-credit Lower Sixth eligibility with a classmate.',
      emptyTitle: 'Calculate Your O-Level Standing First',
      emptyDesc: 'Select at least five ZIMSEC O-Level subject grades including English Language above to compare with a friend.',
      projectedLabel: 'Projected Best 5 Points',
      higherIsBetter: true,
      tieEpsilon: 0.5,
      modes: [
        { id: 'standard', label: 'Best 5 Points (Max 25)' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var defs = [
          { id: 'sub1Grade', name: 'English Language', tag: 'Compulsory' },
          { id: 'sub2Grade', name: 'Mathematics', tag: 'Core' },
          { id: 'sub3Grade', name: 'Combined Science', tag: 'Science' },
          { id: 'sub4Grade', name: 'Subject 4', tag: 'O-Level' },
          { id: 'sub5Grade', name: 'Subject 5', tag: 'O-Level' },
          { id: 'sub6Grade', name: 'Subject 6', tag: 'O-Level' },
          { id: 'sub7Grade', name: 'Subject 7', tag: 'O-Level' },
          { id: 'sub8Grade', name: 'Subject 8', tag: 'O-Level' }
        ];
        var subjects = [];
        for (var i = 0; i < defs.length; i++) {
          var el = document.getElementById(defs[i].id);
          var g = el ? el.value : '';
          if (g && ZIMSEC_OL_PTS[g] !== undefined) {
            subjects.push({ id: defs[i].id, name: defs[i].name, tag: defs[i].tag, grade: g, pts: ZIMSEC_OL_PTS[g] });
          }
        }
        if (subjects.length < 5 || subjects[0].id !== 'sub1Grade') return null;
        var sortedPts = subjects.map(function (s) { return s.pts; }).sort(function (a, b) { return b - a; });
        var best5 = sortedPts.slice(0, 5).reduce(function (a, b) { return a + b; }, 0);
        var credits = subjects.filter(function (s) { return s.pts >= 3; }).length;
        var engPass = subjects[0].pts >= 3;
        var route = !engPass ? 'English < C (Not Eligible)' : credits < 5 ? (credits + ' Credits (< 5 Min)') : best5 >= 20 ? 'Competitive Form 5 (' + credits + ' Cr)' : best5 >= 16 ? 'Qualified Form 5 (' + credits + ' Cr)' : 'Bridging / Poly (' + credits + ' Cr)';
        return {
          mode: 'standard',
          score: best5,
          maxScore: 25,
          band: route,
          credits: credits,
          engPass: engPass,
          subjects: subjects
        };
      },
      getDefaultFriendItems: function (mode, studentCtx) {
        var opts = [
          { value: '', label: 'Select grade...' },
          { value: 'A', label: 'A (5 pts - Distinction)' },
          { value: 'B', label: 'B (4 pts - Credit)' },
          { value: 'C', label: 'C (3 pts - Credit)' },
          { value: 'D', label: 'D (2 pts - Pass)' },
          { value: 'E', label: 'E (1 pt - Below Pass)' },
          { value: 'U', label: 'U (0 pts - Ungraded)' }
        ];
        var subs = (studentCtx && studentCtx.subjects && studentCtx.subjects.length >= 5) ? studentCtx.subjects : [
          { name: 'English Language', tag: 'Compulsory' },
          { name: 'Mathematics', tag: 'Core' },
          { name: 'Combined Science', tag: 'Science' },
          { name: 'Subject 4', tag: 'O-Level' },
          { name: 'Subject 5', tag: 'O-Level' },
          { name: 'Subject 6', tag: 'O-Level' }
        ];
        return subs.map(function (s, idx) {
          return { id: 'f_zol_' + idx, name: s.name, tag: s.tag, type: 'select', options: opts, val: '' };
        });
      },
      getSampleFriendItems: function (mode, studentCtx) {
        var items = this.getDefaultFriendItems(mode, studentCtx);
        var sample = ['B', 'B', 'A', 'B', 'C', 'C', 'B', 'C'];
        for (var i = 0; i < items.length; i++) items[i].val = sample[i % sample.length];
        return items;
      },
      calculateFriend: function (items) {
        var subs = [];
        for (var i = 0; i < items.length; i++) {
          var g = items[i].val;
          if (g && ZIMSEC_OL_PTS[g] !== undefined) {
            subs.push({ idx: i, grade: g, pts: ZIMSEC_OL_PTS[g] });
          }
        }
        if (subs.length < 5) return null;
        var sorted = subs.map(function (s) { return s.pts; }).sort(function (a, b) { return b - a; });
        var best5 = sorted.slice(0, 5).reduce(function (a, b) { return a + b; }, 0);
        var credits = subs.filter(function (s) { return s.pts >= 3; }).length;
        var engPass = items[0] && items[0].val && ZIMSEC_OL_PTS[items[0].val] >= 3;
        var route = !engPass ? 'English < C (Not Eligible)' : credits < 5 ? (credits + ' Credits (< 5 Min)') : best5 >= 20 ? 'Competitive Form 5 (' + credits + ' Cr)' : best5 >= 16 ? 'Qualified Form 5 (' + credits + ' Cr)' : 'Bridging / Poly (' + credits + ' Cr)';
        return {
          score: best5,
          maxScore: 25,
          filledCount: subs.length,
          band: route
        };
      },
      validateMessage: 'Select at least 5 ZIMSEC O-Level subject grades (including English Language) for your friend.',
      formatScore: function (val) { return Math.round(val) + ' / 25'; },
      formatDiff: function (absDiff) {
        var p = Math.round(absDiff);
        return p + ' Best-5 ' + (p === 1 ? 'point' : 'points');
      },
      getSvgConfig: function () {
        return {
          min: 0,
          max: 25,
          invert: false,
          leftLabel: '0 pts',
          rightLabel: '25 Max (5 As)',
          guides: [
            { pct: (15 / 25) * 100, label: '15 (5 Cs)', strong: false },
            { pct: (20 / 25) * 100, label: '20 Boarding', strong: true }
          ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName) {
        var subs = studentCtx.subjects;
        // Priority 1: Compulsory English below Grade C
        if (!studentCtx.engPass) {
          return {
            bestIndex: 0,
            suggestedSimVal: 3, // Grade C
            html: '<strong>English Language (Grade ' + subs[0].grade + ')</strong> is your most critical priority: ZIMSEC Form 5 A-Level and tertiary entry require at least <strong>Grade C (3 pts)</strong> in English regardless of your Best 5 total. Next step: prioritise Paper 1 composition structure and Paper 2 summary comprehension.'
          };
        }
        // Find lowest subject within top 5 or non-credit subject if credits < 5
        var indexed = subs.map(function (s, idx) { return { idx: idx, name: s.name, grade: s.grade, pts: s.pts }; });
        indexed.sort(function (a, b) { return b.pts - a.pts; });
        var top5Weakest = indexed[Math.min(4, indexed.length - 1)];
        var bestIdx = top5Weakest.idx;
        var chosen = subs[bestIdx];
        if (chosen.pts >= 5) {
          return {
            bestIndex: 0,
            suggestedSimVal: 5,
            html: 'Your Best 5 ZIMSEC subjects are already at maximum Grade A (25 / 25). Next step: keep your prospective Lower Sixth combination subjects sharp for A-Level stream selection.'
          };
        }
        var curOrderIdx = Math.max(0, ZIMSEC_OL_ORDER.indexOf(chosen.grade));
        var nextIdx = Math.min(5, curOrderIdx + 1);
        var tgtGrade = ZIMSEC_OL_ORDER[nextIdx];
        var newScore = studentCtx.score + (ZIMSEC_OL_PTS[tgtGrade] - chosen.pts);
        var vsNote = (studentCtx.score < friendCalc.score && newScore >= friendCalc.score)
          ? ' and catches ' + escapeHtml(friendName)
          : ' to reach <strong>' + newScore + ' / 25</strong>';
        return {
          bestIndex: bestIdx,
          suggestedSimVal: nextIdx,
          html: '<strong>' + escapeHtml(chosen.name) + ' (Grade ' + chosen.grade + ', ' + chosen.pts + ' pts)</strong> is the weakest paper inside your Best 5: raising it by one grade to <strong>Grade ' + tgtGrade + '</strong> adds <strong>+1 point</strong>' + vsNote + '. Next step: practise ZIMSEC November structured Paper 2 past papers in ' + escapeHtml(chosen.name) + '.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var subs = studentCtx.subjects;
        var idx = clampNum(itemIndex, 0, subs.length - 1);
        var chosen = subs[idx];
        var curPos = Math.max(0, ZIMSEC_OL_ORDER.indexOf(chosen.grade));
        return {
          selectLabel: 'O-Level Subject',
          options: subs.map(function (s, i) {
            return { index: i, label: s.name + ' (now Grade ' + s.grade + ' - ' + s.pts + ' pts)' };
          }),
          sliderLabel: 'Target ZIMSEC Grade',
          min: 0,
          max: 5,
          step: 1,
          defaultVal: Math.min(5, curPos + 1),
          formatSliderVal: function (v) {
            var g = ZIMSEC_OL_ORDER[v] || 'C';
            return 'Grade ' + g + ' (' + ZIMSEC_OL_PTS[g] + ' pts)';
          },
          simulate: function (v) {
            var g = ZIMSEC_OL_ORDER[v] || chosen.grade;
            var ptsArr = subs.map(function (s, i) { return i === idx ? ZIMSEC_OL_PTS[g] : s.pts; });
            ptsArr.sort(function (a, b) { return b - a; });
            var proj = ptsArr.slice(0, 5).reduce(function (a, b) { return a + b; }, 0);
            var delta = proj - studentCtx.score;
            return {
              projectedScore: proj,
              projectedDisplay: proj + ' / 25',
              changeDisplay: (delta >= 0 ? '+' : '') + delta + ' pts',
              changeState: delta > 0 ? 'pos' : (delta < 0 ? 'neg' : '')
            };
          }
        };
      }
    },

    /* 23. ZAMBIA ECZ GRADE 12 POINTS CALCULATOR */
    'zambia-grade-12-points-calculator': {
      formId: 'eczForm',
      resetIds: ['eczReset'],
      bannerDesc: 'Compare your ECZ Grade 12 Best 6 (including English) or Best 5 aggregate points with a classmate (lower points = stronger result).',
      emptyTitle: 'Calculate Your ECZ Points First',
      emptyDesc: 'Enter at least six Grade 12 subjects including English Language above and calculate your ECZ points to compare.',
      projectedLabel: 'Projected ECZ Aggregate',
      higherIsBetter: false,
      tieEpsilon: 0.5,
      modes: [
        { id: 'best6', label: 'Best 6 incl. English (6-54)' },
        { id: 'best5', label: 'Best 5 Overall (5-45)' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var subjects = [];
        for (var i = 1; i <= 9; i++) {
          var nEl = document.getElementById('subj' + i);
          var gEl = document.getElementById('grade' + i);
          if (!nEl || !gEl || !gEl.value) continue;
          var g = parseInt(gEl.value, 10);
          if (!isFinite(g) || g < 1 || g > 9) continue;
          var nm = nEl.value.trim() || ('Subject ' + i);
          subjects.push({ slot: i, name: nm, grade: g, isEnglish: nm.toLowerCase().indexOf('english') !== -1 });
        }
        var eng = null;
        for (var e = 0; e < subjects.length; e++) {
          if (subjects[e].isEnglish) { eng = subjects[e]; break; }
        }
        if (subjects.length < 6 || !eng) return null;
        var others = subjects.filter(function (s) { return s !== eng; }).sort(function (a, b) { return a.grade - b.grade; });
        var best6 = eng.grade + others.slice(0, 5).reduce(function (sum, s) { return sum + s.grade; }, 0);
        var best5 = subjects.slice().sort(function (a, b) { return a.grade - b.grade; }).slice(0, 5).reduce(function (sum, s) { return sum + s.grade; }, 0);
        var credits = subjects.filter(function (s) { return s.grade <= 6; }).length;
        var cert = (eng.grade <= 8 && credits >= 1) ? 'School Certificate (' + credits + ' Credits)' : 'GCE Statement';
        return {
          mode: 'best6',
          score: best6,
          maxScore: 54,
          best6: best6,
          best5: best5,
          band: cert,
          subjects: subjects
        };
      },
      getComparableStudentScore: function (studentCtx, mode) {
        if (mode === 'best5') {
          return { score: studentCtx.best5, maxScore: 45, band: 'Best 5 Total (' + studentCtx.band + ')' };
        }
        return { score: studentCtx.best6, maxScore: 54, band: 'Best 6 incl. English (' + studentCtx.band + ')' };
      },
      getDefaultFriendItems: function (mode, studentCtx) {
        var opts = [{ value: '', label: 'Select ECZ grade...' }].concat(ECZ_GRADES);
        var subs = (studentCtx && studentCtx.subjects && studentCtx.subjects.length >= 6) ? studentCtx.subjects : [
          { name: 'English Language', isEnglish: true },
          { name: 'Mathematics', isEnglish: false },
          { name: 'Biology', isEnglish: false },
          { name: 'Science / Chemistry', isEnglish: false },
          { name: 'Civic Education', isEnglish: false },
          { name: 'Subject 6', isEnglish: false }
        ];
        return subs.map(function (s, idx) {
          return {
            id: 'f_ecz_' + idx,
            name: s.name,
            isEnglish: !!s.isEnglish,
            tag: s.isEnglish ? 'Compulsory' : 'ECZ Subject',
            type: 'select',
            options: opts,
            val: ''
          };
        });
      },
      getSampleFriendItems: function (mode, studentCtx) {
        var items = this.getDefaultFriendItems(mode, studentCtx);
        var sample = ['3', '2', '3', '4', '2', '4', '5', '4', '5'];
        for (var i = 0; i < items.length; i++) items[i].val = sample[i % sample.length];
        return items;
      },
      calculateFriend: function (items, mode) {
        var subs = [];
        var eng = null;
        for (var i = 0; i < items.length; i++) {
          var v = parseInt(items[i].val, 10);
          if (isFinite(v) && v >= 1 && v <= 9) {
            var isE = !!items[i].isEnglish || items[i].name.toLowerCase().indexOf('english') !== -1 || i === 0;
            var obj = { name: items[i].name, grade: v, isEnglish: isE };
            subs.push(obj);
            if (!eng && isE) eng = obj;
          }
        }
        var minNeeded = mode === 'best5' ? 5 : 6;
        if (subs.length < minNeeded) return null;
        if (mode === 'best5') {
          var b5 = subs.slice().sort(function (a, b) { return a.grade - b.grade; }).slice(0, 5).reduce(function (s, x) { return s + x.grade; }, 0);
          var cr5 = subs.filter(function (s) { return s.grade <= 6; }).length;
          return { score: b5, maxScore: 45, filledCount: subs.length, band: 'Best 5 (' + cr5 + ' Credits)' };
        }
        if (!eng) eng = subs[0];
        var others = subs.filter(function (s) { return s !== eng; }).sort(function (a, b) { return a.grade - b.grade; });
        if (others.length < 5) return null;
        var b6 = eng.grade + others.slice(0, 5).reduce(function (s, x) { return s + x.grade; }, 0);
        var cr6 = subs.filter(function (s) { return s.grade <= 6; }).length;
        var cert = (eng.grade <= 8 && cr6 >= 1) ? 'School Certificate (' + cr6 + ' Credits)' : 'GCE Statement';
        return { score: b6, maxScore: 54, filledCount: subs.length, band: 'Best 6 incl. English (' + cert + ')' };
      },
      validateMessage: 'Select at least 6 ECZ subject grades (including English) for your friend.',
      formatScore: function (val) { return Math.round(val) + ' pts'; },
      formatDiff: function (absDiff) {
        var p = Math.round(absDiff);
        return p + ' ECZ ' + (p === 1 ? 'point' : 'points');
      },
      getSvgConfig: function (mode) {
        if (mode === 'best5') {
          return {
            min: 5,
            max: 45,
            invert: true,
            leftLabel: '45 Weak',
            rightLabel: '5 Best',
            guides: [
              { pct: ((45 - 20) / 40) * 100, label: '20 Credit', strong: false },
              { pct: ((45 - 10) / 40) * 100, label: '10 Strong', strong: true }
            ]
          };
        }
        return {
          min: 6,
          max: 54,
          invert: true,
          leftLabel: '54 Weak',
          rightLabel: '6 Best',
          guides: [
            { pct: ((54 - 24) / 48) * 100, label: '24 Credit', strong: false },
            { pct: ((54 - 12) / 48) * 100, label: '12 UNZA/CBU', strong: true }
          ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName, studentComp) {
        var subs = studentCtx.subjects;
        var useBest5 = compareState.friendMode === 'best5';
        var baseScore = studentComp ? studentComp.score : studentCtx.best6;
        // Identify counted subjects and pick the highest-numbered (weakest) grade
        var bestIdx = 0;
        var worstGrade = 0;
        for (var i = 0; i < subs.length; i++) {
          if (subs[i].grade <= 1) continue;
          // Test improving this subject by 2 ECZ grades
          var testGrade = Math.max(1, subs[i].grade - 2);
          var simSubs = subs.map(function (s, idx) {
            return { grade: idx === i ? testGrade : s.grade, isEnglish: s.isEnglish };
          });
          var proj;
          if (useBest5) {
            proj = simSubs.slice().sort(function (a, b) { return a.grade - b.grade; }).slice(0, 5).reduce(function (a, b) { return a + b.grade; }, 0);
          } else {
            var engObj = simSubs.find(function (s) { return s.isEnglish; }) || simSubs[0];
            var oth = simSubs.filter(function (s) { return s !== engObj; }).sort(function (a, b) { return a.grade - b.grade; });
            proj = engObj.grade + oth.slice(0, 5).reduce(function (a, b) { return a + b.grade; }, 0);
          }
          var drop = baseScore - proj;
          var scoreMetric = drop * 10 + subs[i].grade + (subs[i].isEnglish ? 0.5 : 0);
          if (drop > 0 && scoreMetric > worstGrade) {
            worstGrade = scoreMetric;
            bestIdx = i;
          }
        }
        var chosen = subs[bestIdx];
        if (chosen.grade <= 1) {
          return {
            bestIndex: 0,
            suggestedSimVal: 8,
            html: 'Your counted ECZ subjects are already at Grade 1 Distinction. Next step: maintain consistent Paper 1 and Paper 2 accuracy across English, Mathematics, and Sciences for UNZA/CBU merit quotas.'
          };
        }
        var tgtGrade = Math.max(1, chosen.grade - 2);
        var sliderIdx = ECZ_SLIDER_ORDER.indexOf(tgtGrade);
        var actualDrop = chosen.grade - tgtGrade;
        var newAgg = baseScore - actualDrop;
        var roleNote = (!useBest5 && chosen.isEnglish) ? ' because English Language is mandatory in the ECZ Best 6' : '';
        return {
          bestIndex: bestIdx,
          suggestedSimVal: sliderIdx !== -1 ? sliderIdx : 6,
          html: '<strong>' + escapeHtml(chosen.name) + ' (Grade ' + chosen.grade + ')</strong> is your highest-impact subject' + roleNote + ': improving it to <strong>Grade ' + tgtGrade + '</strong> lowers your aggregate by <strong>' + actualDrop + ' point' + (actualDrop === 1 ? '' : 's') + '</strong> to <strong>' + newAgg + ' points</strong>. Next step: work timed ECZ past papers in ' + escapeHtml(chosen.name) + '.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var subs = studentCtx.subjects;
        var idx = clampNum(itemIndex, 0, subs.length - 1);
        var chosen = subs[idx];
        var useBest5 = compareState.friendMode === 'best5';
        var baseScore = useBest5 ? studentCtx.best5 : studentCtx.best6;
        var curPos = Math.max(0, ECZ_SLIDER_ORDER.indexOf(chosen.grade));
        return {
          selectLabel: 'ECZ Subject',
          options: subs.map(function (s, i) {
            return { index: i, label: s.name + ' (now Grade ' + s.grade + ')' };
          }),
          sliderLabel: 'Target ECZ Grade',
          min: 0,
          max: 8,
          step: 1,
          defaultVal: Math.min(8, curPos + 2),
          formatSliderVal: function (v) {
            var g = ECZ_SLIDER_ORDER[v] || 1;
            return 'Grade ' + g + ' (' + g + ' pt' + (g === 1 ? '' : 's') + ')';
          },
          simulate: function (v) {
            var newG = ECZ_SLIDER_ORDER[v] || chosen.grade;
            var simSubs = subs.map(function (s, i) {
              return { grade: i === idx ? newG : s.grade, isEnglish: s.isEnglish };
            });
            var proj;
            if (useBest5) {
              proj = simSubs.slice().sort(function (a, b) { return a.grade - b.grade; }).slice(0, 5).reduce(function (a, b) { return a + b.grade; }, 0);
            } else {
              var engObj = simSubs.find(function (s) { return s.isEnglish; }) || simSubs[0];
              var oth = simSubs.filter(function (s) { return s !== engObj; }).sort(function (a, b) { return a.grade - b.grade; });
              proj = engObj.grade + oth.slice(0, 5).reduce(function (a, b) { return a + b.grade; }, 0);
            }
            var diff = proj - baseScore;
            return {
              projectedScore: proj,
              projectedDisplay: proj + ' pts',
              changeDisplay: (diff > 0 ? '+' : '') + diff + ' pts',
              changeState: diff < 0 ? 'pos' : (diff > 0 ? 'neg' : '')
            };
          }
        };
      }
    },

    /* 24. UGANDA PLE AGGREGATE CALCULATOR */
    'ple-aggregate-calculator': {
      formId: 'pleForm',
      resetIds: ['resetBtn', 'clearBtn'],
      bannerDesc: 'Compare your 4-subject UNEB PLE aggregate and Division with a classmate (lower aggregate from 4 to 36 is stronger).',
      emptyTitle: 'Calculate Your PLE Aggregate First',
      emptyDesc: 'Select grades for English, Mathematics, Integrated Science, and Social Studies above to compare with a friend.',
      projectedLabel: 'Projected PLE Aggregate',
      higherIsBetter: false,
      tieEpsilon: 0.5,
      modes: [
        { id: 'standard', label: '4 PLE Subjects (4-36)' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var defs = [
          { id: 'pleEnglish', name: 'English Language', tag: 'Core' },
          { id: 'pleMath', name: 'Mathematics', tag: 'Core' },
          { id: 'pleScience', name: 'Integrated Basic Science', tag: 'Science' },
          { id: 'pleSst', name: 'Social Studies & RE', tag: 'SST' }
        ];
        var papers = [];
        var grades = [];
        for (var i = 0; i < defs.length; i++) {
          var el = document.getElementById(defs[i].id);
          var g = el ? parseInt(el.value, 10) : NaN;
          if (!isFinite(g) || g < 1 || g > 9) return null;
          papers.push({ id: defs[i].id, name: defs[i].name, tag: defs[i].tag, pts: g, code: UNEB_CODE_MAP[g] });
          grades.push(g);
        }
        var total = grades.reduce(function (a, b) { return a + b; }, 0);
        var div = unebPleDivision(total, grades);
        return {
          mode: 'standard',
          score: total,
          maxScore: 36,
          band: div + ' (' + papers.map(function (p) { return p.code; }).join(', ') + ')',
          papers: papers,
          grades: grades
        };
      },
      getDefaultFriendItems: function () {
        var opts = [{ value: '', label: 'Select grade...' }].concat(UNEB_GRADES);
        return [
          { id: 'pleEnglish', name: 'English Language', tag: 'Core', type: 'select', options: opts, val: '' },
          { id: 'pleMath', name: 'Mathematics', tag: 'Core', type: 'select', options: opts, val: '' },
          { id: 'pleScience', name: 'Integrated Basic Science', tag: 'Science', type: 'select', options: opts, val: '' },
          { id: 'pleSst', name: 'Social Studies & RE', tag: 'SST', type: 'select', options: opts, val: '' }
        ];
      },
      getSampleFriendItems: function () {
        var items = this.getDefaultFriendItems();
        var sample = ['2', '3', '2', '3'];
        for (var i = 0; i < items.length; i++) items[i].val = sample[i];
        return items;
      },
      calculateFriend: function (items) {
        var grades = [];
        var codes = [];
        for (var i = 0; i < items.length; i++) {
          var g = parseInt(items[i].val, 10);
          if (!isFinite(g) || g < 1 || g > 9) return null;
          grades.push(g);
          codes.push(UNEB_CODE_MAP[g]);
        }
        if (grades.length < 4) return null;
        var total = grades.reduce(function (a, b) { return a + b; }, 0);
        var div = unebPleDivision(total, grades);
        return {
          score: total,
          maxScore: 36,
          filledCount: 4,
          band: div + ' (' + codes.join(', ') + ')'
        };
      },
      validateMessage: 'Select all 4 UNEB PLE subject grades (D1 to F9) for your friend.',
      formatScore: function (val) { return 'Agg ' + Math.round(val); },
      formatDiff: function (absDiff) {
        var p = Math.round(absDiff);
        return p + ' aggregate ' + (p === 1 ? 'point' : 'points');
      },
      getSvgConfig: function () {
        return {
          min: 4,
          max: 36,
          invert: true,
          leftLabel: '36 (Div U)',
          rightLabel: '4 (4 D1s)',
          guides: [
            { pct: ((36 - 22) / 32) * 100, label: '22 Div 2', strong: false },
            { pct: ((36 - 12) / 32) * 100, label: '12 Div 1', strong: true }
          ]
        };
      },
      computeTip: function (studentCtx) {
        var papers = studentCtx.papers;
        var bestIdx = 0;
        var worstWeight = -1;
        for (var i = 0; i < papers.length; i++) {
          var wt = papers[i].pts + (papers[i].pts === 9 ? 5 : 0) + (i <= 1 ? 0.25 : 0);
          if (wt > worstWeight) {
            worstWeight = wt;
            bestIdx = i;
          }
        }
        var chosen = papers[bestIdx];
        if (chosen.pts <= 1) {
          return {
            bestIndex: 0,
            suggestedSimVal: 8,
            html: 'All four PLE papers are already at Distinction 1 (Aggregate 4). Next step: keep timed UNEB Section B structured answers neat and complete ahead of Senior One selection.'
          };
        }
        var tgtPts = Math.max(1, chosen.pts <= 3 ? 1 : chosen.pts - 2);
        var drop = chosen.pts - tgtPts;
        var newGrades = studentCtx.grades.map(function (g, idx) { return idx === bestIdx ? tgtPts : g; });
        var newAgg = studentCtx.score - drop;
        var newDiv = unebPleDivision(newAgg, newGrades);
        var sliderPos = UNEB_SLIDER_ORDER.indexOf(tgtPts);
        return {
          bestIndex: bestIdx,
          suggestedSimVal: sliderPos !== -1 ? sliderPos : 7,
          html: '<strong>' + escapeHtml(chosen.name) + ' (' + chosen.code + ', ' + chosen.pts + ' pts)</strong> carries every point directly into your 4-subject PLE total: improving it to <strong>' + UNEB_CODE_MAP[tgtPts] + '</strong> trims <strong>' + drop + ' point' + (drop === 1 ? '' : 's') + '</strong> to reach <strong>Aggregate ' + newAgg + ' (' + newDiv + ')</strong>. Next step: practise UNEB Section B structured questions in ' + escapeHtml(chosen.name) + '.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var papers = studentCtx.papers;
        var idx = clampNum(itemIndex, 0, papers.length - 1);
        var chosen = papers[idx];
        var curPos = Math.max(0, UNEB_SLIDER_ORDER.indexOf(chosen.pts));
        return {
          selectLabel: 'PLE Subject',
          options: papers.map(function (p, i) {
            return { index: i, label: p.name + ' (now ' + p.code + ' - ' + p.pts + ' pts)' };
          }),
          sliderLabel: 'Target UNEB Grade',
          min: 0,
          max: 8,
          step: 1,
          defaultVal: Math.min(8, curPos + 2),
          formatSliderVal: function (v) {
            var pts = UNEB_SLIDER_ORDER[v] || 1;
            return UNEB_CODE_MAP[pts] + ' (' + pts + ' pt' + (pts === 1 ? '' : 's') + ')';
          },
          simulate: function (v) {
            var pts = UNEB_SLIDER_ORDER[v] || chosen.pts;
            var newGrades = studentCtx.grades.map(function (g, i) { return i === idx ? pts : g; });
            var proj = newGrades.reduce(function (a, b) { return a + b; }, 0);
            var div = unebPleDivision(proj, newGrades);
            var diff = proj - studentCtx.score;
            return {
              projectedScore: proj,
              projectedDisplay: 'Agg ' + proj + ' (' + div + ')',
              changeDisplay: (diff > 0 ? '+' : '') + diff + ' pts',
              changeState: diff < 0 ? 'pos' : (diff > 0 ? 'neg' : '')
            };
          }
        };
      }
    },

    /* 25. UGANDA UCE GRADE CALCULATOR (BEST 8 AGGREGATE) */
    'uce-grade-calculator': {
      formId: 'uceForm',
      resetIds: ['resetBtn'],
      bannerDesc: 'Compare your UNEB UCE Best 8 aggregate and Division standing with a classmate (lower aggregate from 8 to 72 is stronger).',
      emptyTitle: 'Calculate Your UCE Best 8 First',
      emptyDesc: 'Select grades for English, Mathematics, and at least six other UCE subjects above to compare with a friend.',
      projectedLabel: 'Projected UCE Aggregate',
      higherIsBetter: false,
      tieEpsilon: 0.5,
      modes: [
        { id: 'standard', label: 'Best 8 Subjects (8-72)' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var meta = [
          { id: 'uceEnglish', name: 'English Language', compulsory: true, isSci: false },
          { id: 'uceMath', name: 'Mathematics', compulsory: true, isSci: false },
          { id: 'uceBiology', name: 'Biology', compulsory: false, isSci: true },
          { id: 'uceChemistry', name: 'Chemistry', compulsory: false, isSci: true },
          { id: 'ucePhysics', name: 'Physics', compulsory: false, isSci: true },
          { id: 'uceGeography', name: 'Geography', compulsory: false, isSci: false },
          { id: 'uceHistory', name: 'History', compulsory: false, isSci: false },
          { id: 'uceCre', name: 'CRE / IRE', compulsory: false, isSci: false },
          { id: 'uceElective1', name: 'Elective 1', compulsory: false, isSci: false },
          { id: 'uceElective2', name: 'Elective 2', compulsory: false, isSci: false }
        ];
        var subjects = [];
        for (var i = 0; i < meta.length; i++) {
          var el = document.getElementById(meta[i].id);
          var g = el ? parseInt(el.value, 10) : NaN;
          if (isFinite(g) && g >= 1 && g <= 9) {
            subjects.push({ id: meta[i].id, name: meta[i].name, compulsory: meta[i].compulsory, isSci: meta[i].isSci, pts: g, code: UNEB_CODE_MAP[g] });
          }
        }
        var eng = subjects.find(function (s) { return s.id === 'uceEnglish'; });
        var math = subjects.find(function (s) { return s.id === 'uceMath'; });
        var electives = subjects.filter(function (s) { return !s.compulsory; });
        if (!eng || !math || electives.length < 6) return null;
        var best6 = electives.slice().sort(function (a, b) { return a.pts - b.pts; }).slice(0, 6);
        var counted = [eng, math].concat(best6);
        var agg = counted.reduce(function (s, r) { return s + r.pts; }, 0);
        var div = unebUceDivision(agg, eng.pts, math.pts, counted);
        return {
          mode: 'standard',
          score: agg,
          maxScore: 72,
          band: div + ' (' + agg + ' / 72)',
          subjects: subjects
        };
      },
      getDefaultFriendItems: function (mode, studentCtx) {
        var opts = [{ value: '', label: 'Select grade...' }].concat(UNEB_GRADES);
        var subs = (studentCtx && studentCtx.subjects && studentCtx.subjects.length >= 8) ? studentCtx.subjects : [
          { id: 'uceEnglish', name: 'English Language', compulsory: true, isSci: false },
          { id: 'uceMath', name: 'Mathematics', compulsory: true, isSci: false },
          { id: 'uceBiology', name: 'Biology', compulsory: false, isSci: true },
          { id: 'uceChemistry', name: 'Chemistry', compulsory: false, isSci: true },
          { id: 'ucePhysics', name: 'Physics', compulsory: false, isSci: true },
          { id: 'uceGeography', name: 'Geography', compulsory: false, isSci: false },
          { id: 'uceHistory', name: 'History', compulsory: false, isSci: false },
          { id: 'uceCre', name: 'CRE / IRE', compulsory: false, isSci: false }
        ];
        return subs.map(function (s, idx) {
          return {
            id: 'f_uce_' + idx,
            name: s.name,
            compulsory: !!s.compulsory,
            isSci: !!s.isSci,
            tag: s.compulsory ? 'Compulsory' : (s.isSci ? 'Science' : 'Elective'),
            type: 'select',
            options: opts,
            val: ''
          };
        });
      },
      getSampleFriendItems: function (mode, studentCtx) {
        var items = this.getDefaultFriendItems(mode, studentCtx);
        var sample = ['3', '3', '4', '4', '5', '3', '3', '4', '5', '5'];
        for (var i = 0; i < items.length; i++) items[i].val = sample[i % sample.length];
        return items;
      },
      calculateFriend: function (items) {
        var comp = [];
        var elec = [];
        for (var i = 0; i < items.length; i++) {
          var g = parseInt(items[i].val, 10);
          if (isFinite(g) && g >= 1 && g <= 9) {
            var obj = { pts: g, compulsory: !!items[i].compulsory || i < 2, isSci: !!items[i].isSci };
            if (obj.compulsory && comp.length < 2) comp.push(obj);
            else elec.push(obj);
          }
        }
        if (comp.length < 2 || elec.length < 6) return null;
        var best6 = elec.slice().sort(function (a, b) { return a.pts - b.pts; }).slice(0, 6);
        var counted = comp.concat(best6);
        var agg = counted.reduce(function (s, r) { return s + r.pts; }, 0);
        var div = unebUceDivision(agg, comp[0].pts, comp[1].pts, counted);
        return {
          score: agg,
          maxScore: 72,
          filledCount: comp.length + elec.length,
          band: div + ' (' + agg + ' / 72)'
        };
      },
      validateMessage: 'Select English, Mathematics, and at least 6 other UCE subject grades for your friend.',
      formatScore: function (val) { return 'Agg ' + Math.round(val); },
      formatDiff: function (absDiff) {
        var p = Math.round(absDiff);
        return p + ' aggregate ' + (p === 1 ? 'point' : 'points');
      },
      getSvgConfig: function () {
        return {
          min: 8,
          max: 72,
          invert: true,
          leftLabel: '72 Ungraded',
          rightLabel: '8 Best',
          guides: [
            { pct: ((72 - 45) / 64) * 100, label: '45 Div 2', strong: false },
            { pct: ((72 - 32) / 64) * 100, label: '32 Div 1', strong: true }
          ]
        };
      },
      computeTip: function (studentCtx) {
        var subs = studentCtx.subjects;
        var bestIdx = 0;
        var bestScore = -1;
        for (var i = 0; i < subs.length; i++) {
          if (subs[i].pts <= 1) continue;
          var tgt = Math.max(1, subs[i].pts - 2);
          var simSubs = subs.map(function (s, idx) {
            return { pts: idx === i ? tgt : s.pts, compulsory: s.compulsory, isSci: s.isSci };
          });
          var comp = simSubs.filter(function (s) { return s.compulsory; });
          var elec = simSubs.filter(function (s) { return !s.compulsory; }).sort(function (a, b) { return a.pts - b.pts; }).slice(0, 6);
          var proj = comp.concat(elec).reduce(function (a, b) { return a + b.pts; }, 0);
          var drop = studentCtx.score - proj;
          var metric = drop * 10 + subs[i].pts + (subs[i].compulsory ? 0.5 : (subs[i].isSci ? 0.25 : 0));
          if (drop > 0 && metric > bestScore) {
            bestScore = metric;
            bestIdx = i;
          }
        }
        var chosen = subs[bestIdx];
        if (chosen.pts <= 1) {
          return {
            bestIndex: 0,
            suggestedSimVal: 8,
            html: 'Your counted UCE Best 8 papers are already at Distinction 1 (Aggregate 8). Next step: keep at least one strong science credit to keep every Senior Five A-Level combination open.'
          };
        }
        var tgtPts = Math.max(1, chosen.pts - 2);
        var actualDrop = chosen.pts - tgtPts;
        var newAgg = studentCtx.score - actualDrop;
        var sliderPos = UNEB_SLIDER_ORDER.indexOf(tgtPts);
        return {
          bestIndex: bestIdx,
          suggestedSimVal: sliderPos !== -1 ? sliderPos : 6,
          html: '<strong>' + escapeHtml(chosen.name) + ' (' + chosen.code + ', ' + chosen.pts + ' pts)</strong> is your highest-value Best 8 upgrade: improving it to <strong>' + UNEB_CODE_MAP[tgtPts] + '</strong> cuts <strong>' + actualDrop + ' point' + (actualDrop === 1 ? '' : 's') + '</strong> off your aggregate to <strong>Aggregate ' + newAgg + '</strong>. Next step: focus revision on compulsory papers and at least one Science credit for UNEB Division 1.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var subs = studentCtx.subjects;
        var idx = clampNum(itemIndex, 0, subs.length - 1);
        var chosen = subs[idx];
        var curPos = Math.max(0, UNEB_SLIDER_ORDER.indexOf(chosen.pts));
        return {
          selectLabel: 'UCE Subject',
          options: subs.map(function (s, i) {
            return { index: i, label: s.name + ' (now ' + s.code + ' - ' + s.pts + ' pts)' };
          }),
          sliderLabel: 'Target UNEB Grade',
          min: 0,
          max: 8,
          step: 1,
          defaultVal: Math.min(8, curPos + 2),
          formatSliderVal: function (v) {
            var p = UNEB_SLIDER_ORDER[v] || 1;
            return UNEB_CODE_MAP[p] + ' (' + p + ' pt' + (p === 1 ? '' : 's') + ')';
          },
          simulate: function (v) {
            var p = UNEB_SLIDER_ORDER[v] || chosen.pts;
            var simSubs = subs.map(function (s, i) {
              return { pts: i === idx ? p : s.pts, compulsory: s.compulsory, isSci: s.isSci };
            });
            var comp = simSubs.filter(function (s) { return s.compulsory; });
            var elec = simSubs.filter(function (s) { return !s.compulsory; }).sort(function (a, b) { return a.pts - b.pts; }).slice(0, 6);
            var counted = comp.concat(elec);
            var proj = counted.reduce(function (a, b) { return a + b.pts; }, 0);
            var div = unebUceDivision(proj, comp[0].pts, comp[1].pts, counted);
            var diff = proj - studentCtx.score;
            return {
              projectedScore: proj,
              projectedDisplay: 'Agg ' + proj + ' (' + div + ')',
              changeDisplay: (diff > 0 ? '+' : '') + diff + ' pts',
              changeState: diff < 0 ? 'pos' : (diff > 0 ? 'neg' : '')
            };
          }
        };
      }
    },

    /* 26. TANZANIA FORM FOUR (CSEE) GPA & DIVISION CALCULATOR */
    'form-four-gpa-calculator': {
      formId: 'formFourForm',
      resetIds: ['resetBtn'],
      bannerDesc: 'Compare your NECTA CSEE Form Four Best 7 Division points with a classmate (7 to 35 scale — lower points is stronger).',
      emptyTitle: 'Calculate Your Form Four Division First',
      emptyDesc: 'Select grades for at least seven NECTA CSEE subjects above and calculate your Division to compare with a friend.',
      projectedLabel: 'Projected Best 7 Points',
      higherIsBetter: false,
      tieEpsilon: 0.5,
      modes: [
        { id: 'standard', label: 'NECTA Best 7 Points (7-35)' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var rows = document.querySelectorAll('#subjectList .subject-row');
        var subjects = [];
        for (var i = 0; i < rows.length; i++) {
          var nm = rows[i].getAttribute('data-subject') || ('Subject ' + (i + 1));
          var sel = rows[i].querySelector('.subject-grade');
          var g = sel ? sel.value : '';
          if (g && NECTA_CSEE_PTS[g] !== undefined) {
            subjects.push({ name: nm, grade: g, pts: NECTA_CSEE_PTS[g] });
          }
        }
        if (subjects.length < 7) return null;
        var sorted = subjects.slice().sort(function (a, b) { return a.pts - b.pts; });
        var best7 = sorted.slice(0, 7).reduce(function (s, x) { return s + x.pts; }, 0);
        var div = nectaCseeDivision(best7, subjects);
        return {
          mode: 'standard',
          score: best7,
          maxScore: 35,
          band: div + ' (GPA ' + (best7 / 7).toFixed(2) + ')',
          subjects: subjects
        };
      },
      getDefaultFriendItems: function (mode, studentCtx) {
        var opts = [
          { value: '', label: 'Select grade...' },
          { value: 'A', label: 'A (1 pt - Excellent)' },
          { value: 'B', label: 'B (2 pts - Very Good)' },
          { value: 'C', label: 'C (3 pts - Good / Credit)' },
          { value: 'D', label: 'D (4 pts - Satisfactory)' },
          { value: 'F', label: 'F (5 pts - Fail)' }
        ];
        var subs = (studentCtx && studentCtx.subjects && studentCtx.subjects.length >= 7) ? studentCtx.subjects : [
          { name: 'Civics' }, { name: 'History' }, { name: 'Geography' },
          { name: 'Kiswahili' }, { name: 'English Language' }, { name: 'Basic Mathematics' }, { name: 'Biology' }
        ];
        return subs.map(function (s, idx) {
          return { id: 'f_csee_' + idx, name: s.name, tag: 'NECTA', type: 'select', options: opts, val: '' };
        });
      },
      getSampleFriendItems: function (mode, studentCtx) {
        var items = this.getDefaultFriendItems(mode, studentCtx);
        var sample = ['B', 'B', 'C', 'B', 'B', 'C', 'B', 'C', 'C'];
        for (var i = 0; i < items.length; i++) items[i].val = sample[i % sample.length];
        return items;
      },
      calculateFriend: function (items) {
        var subs = [];
        for (var i = 0; i < items.length; i++) {
          var g = items[i].val;
          if (g && NECTA_CSEE_PTS[g] !== undefined) {
            subs.push({ name: items[i].name, grade: g, pts: NECTA_CSEE_PTS[g] });
          }
        }
        if (subs.length < 7) return null;
        var best7 = subs.slice().sort(function (a, b) { return a.pts - b.pts; }).slice(0, 7).reduce(function (s, x) { return s + x.pts; }, 0);
        var div = nectaCseeDivision(best7, subs);
        return {
          score: best7,
          maxScore: 35,
          filledCount: subs.length,
          band: div + ' (GPA ' + (best7 / 7).toFixed(2) + ')'
        };
      },
      validateMessage: 'Select at least 7 NECTA CSEE subject grades (A to F) for your friend.',
      formatScore: function (val) { return Math.round(val) + ' pts'; },
      formatDiff: function (absDiff) {
        var p = Math.round(absDiff);
        return p + ' Division ' + (p === 1 ? 'point' : 'points');
      },
      getSvgConfig: function () {
        return {
          min: 7,
          max: 35,
          invert: true,
          leftLabel: '35 (Div 0)',
          rightLabel: '7 (7 As)',
          guides: [
            { pct: ((35 - 21) / 28) * 100, label: '21 Div II', strong: false },
            { pct: ((35 - 17) / 28) * 100, label: '17 Div I', strong: true }
          ]
        };
      },
      computeTip: function (studentCtx) {
        var subs = studentCtx.subjects;
        var indexed = subs.map(function (s, i) { return { idx: i, name: s.name, grade: s.grade, pts: s.pts }; });
        indexed.sort(function (a, b) { return a.pts - b.pts; });
        var weakestCounted = indexed[Math.min(6, indexed.length - 1)];
        var bestIdx = weakestCounted.idx;
        var chosen = subs[bestIdx];
        if (chosen.pts <= 1) {
          return {
            bestIndex: 0,
            suggestedSimVal: 4,
            html: 'Your Best 7 CSEE subjects are already at Grade A (7 Division points, Division I). Next step: keep Grade C or better in all three subjects of your target Form Five combination.'
          };
        }
        var curPos = Math.max(0, NECTA_CSEE_SLIDER.indexOf(chosen.grade));
        var nextPos = Math.min(4, curPos + 1);
        var tgtGrade = NECTA_CSEE_SLIDER[nextPos];
        var drop = chosen.pts - NECTA_CSEE_PTS[tgtGrade];
        var newPts = studentCtx.score - drop;
        return {
          bestIndex: bestIdx,
          suggestedSimVal: nextPos,
          html: '<strong>' + escapeHtml(chosen.name) + ' (Grade ' + chosen.grade + ', ' + chosen.pts + ' pts)</strong> is the weakest subject counted in your Best 7: raising it to <strong>Grade ' + tgtGrade + '</strong> lowers your total by <strong>' + drop + ' point' + (drop === 1 ? '' : 's') + '</strong> to <strong>' + newPts + ' points</strong>. Next step: practise NECTA CSEE structured questions in ' + escapeHtml(chosen.name) + ' to secure A-Level combination credits.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var subs = studentCtx.subjects;
        var idx = clampNum(itemIndex, 0, subs.length - 1);
        var chosen = subs[idx];
        var curPos = Math.max(0, NECTA_CSEE_SLIDER.indexOf(chosen.grade));
        return {
          selectLabel: 'Form Four Subject',
          options: subs.map(function (s, i) {
            return { index: i, label: s.name + ' (now Grade ' + s.grade + ' - ' + s.pts + ' pts)' };
          }),
          sliderLabel: 'Target NECTA Grade',
          min: 0,
          max: 4,
          step: 1,
          defaultVal: Math.min(4, curPos + 1),
          formatSliderVal: function (v) {
            var g = NECTA_CSEE_SLIDER[v] || 'A';
            return 'Grade ' + g + ' (' + NECTA_CSEE_PTS[g] + ' pt' + (NECTA_CSEE_PTS[g] === 1 ? '' : 's') + ')';
          },
          simulate: function (v) {
            var g = NECTA_CSEE_SLIDER[v] || chosen.grade;
            var simSubs = subs.map(function (s, i) {
              var gr = i === idx ? g : s.grade;
              return { name: s.name, grade: gr, pts: NECTA_CSEE_PTS[gr] };
            });
            var proj = simSubs.slice().sort(function (a, b) { return a.pts - b.pts; }).slice(0, 7).reduce(function (a, b) { return a + b.pts; }, 0);
            var div = nectaCseeDivision(proj, simSubs);
            var diff = proj - studentCtx.score;
            return {
              projectedScore: proj,
              projectedDisplay: proj + ' pts (' + div + ')',
              changeDisplay: (diff > 0 ? '+' : '') + diff + ' pts',
              changeState: diff < 0 ? 'pos' : (diff > 0 ? 'neg' : '')
            };
          }
        };
      }
    },

    /* 27. TANZANIA ACSEE (FORM SIX) & TCU POINTS CALCULATOR */
    'acsee-points-calculator': {
      formId: 'acseeForm',
      resetIds: ['acseeReset'],
      bannerDesc: 'Compare your 3-Principal NECTA ACSEE Division points and TCU university admission points with a classmate (lower NECTA points = stronger Division).',
      emptyTitle: 'Calculate Your ACSEE Points First',
      emptyDesc: 'Select grades for all three Form Six principal subjects above and calculate your standing to compare with a friend.',
      projectedLabel: 'Projected ACSEE Points',
      higherIsBetter: false,
      tieEpsilon: 0.5,
      modes: [
        { id: 'standard', label: '3 Principal Subjects (3-21)' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var g1 = (document.getElementById('prin1Grade') || {}).value || '';
        var g2 = (document.getElementById('prin2Grade') || {}).value || '';
        var g3 = (document.getElementById('prin3Grade') || {}).value || '';
        if (!NECTA_ACSEE_PTS[g1] || !NECTA_ACSEE_PTS[g2] || !NECTA_ACSEE_PTS[g3]) return null;
        var n1 = ((document.getElementById('prin1Name') || {}).value || '').trim() || 'Principal 1';
        var n2 = ((document.getElementById('prin2Name') || {}).value || '').trim() || 'Principal 2';
        var n3 = ((document.getElementById('prin3Name') || {}).value || '').trim() || 'Principal 3';
        var principals = [
          { name: n1, grade: g1, pts: NECTA_ACSEE_PTS[g1], tcu: TCU_ACSEE_PTS[g1] },
          { name: n2, grade: g2, pts: NECTA_ACSEE_PTS[g2], tcu: TCU_ACSEE_PTS[g2] },
          { name: n3, grade: g3, pts: NECTA_ACSEE_PTS[g3], tcu: TCU_ACSEE_PTS[g3] }
        ];
        var total = principals[0].pts + principals[1].pts + principals[2].pts;
        var tcuAll = principals[0].tcu + principals[1].tcu + principals[2].tcu;
        var div = nectaAcseeDivision(total, [g1, g2, g3]);
        return {
          mode: 'standard',
          score: total,
          maxScore: 21,
          tcuAll: tcuAll,
          band: div + ' (' + tcuAll + ' TCU pts)',
          principals: principals
        };
      },
      getDefaultFriendItems: function (mode, studentCtx) {
        var opts = [
          { value: '', label: 'Select grade...' },
          { value: 'A', label: 'A (1 NECTA / 5 TCU)' },
          { value: 'B', label: 'B (2 NECTA / 4 TCU)' },
          { value: 'C', label: 'C (3 NECTA / 3 TCU)' },
          { value: 'D', label: 'D (4 NECTA / 2 TCU)' },
          { value: 'E', label: 'E (5 NECTA / 1 TCU)' },
          { value: 'S', label: 'S (6 NECTA / 0.5 TCU)' },
          { value: 'F', label: 'F (7 NECTA / 0 TCU)' }
        ];
        var p = (studentCtx && studentCtx.principals) ? studentCtx.principals : [
          { name: 'Principal 1' }, { name: 'Principal 2' }, { name: 'Principal 3' }
        ];
        return p.map(function (pr, idx) {
          return { id: 'f_acsee_' + idx, name: pr.name, tag: 'Principal', type: 'select', options: opts, val: '' };
        });
      },
      getSampleFriendItems: function (mode, studentCtx) {
        var items = this.getDefaultFriendItems(mode, studentCtx);
        var sample = ['B', 'C', 'B'];
        for (var i = 0; i < items.length; i++) items[i].val = sample[i % sample.length];
        return items;
      },
      calculateFriend: function (items) {
        if (!items || items.length < 3) return null;
        var g1 = items[0].val;
        var g2 = items[1].val;
        var g3 = items[2].val;
        if (!NECTA_ACSEE_PTS[g1] || !NECTA_ACSEE_PTS[g2] || !NECTA_ACSEE_PTS[g3]) return null;
        var total = NECTA_ACSEE_PTS[g1] + NECTA_ACSEE_PTS[g2] + NECTA_ACSEE_PTS[g3];
        var tcuAll = TCU_ACSEE_PTS[g1] + TCU_ACSEE_PTS[g2] + TCU_ACSEE_PTS[g3];
        var div = nectaAcseeDivision(total, [g1, g2, g3]);
        return {
          score: total,
          maxScore: 21,
          filledCount: 3,
          band: div + ' (' + tcuAll + ' TCU pts)'
        };
      },
      validateMessage: 'Select all 3 ACSEE principal subject grades (A to F) for your friend.',
      formatScore: function (val) { return Math.round(val) + ' pts'; },
      formatDiff: function (absDiff) {
        var p = Math.round(absDiff);
        return p + ' NECTA ' + (p === 1 ? 'point' : 'points');
      },
      getSvgConfig: function () {
        return {
          min: 3,
          max: 21,
          invert: true,
          leftLabel: '21 (3 Fs)',
          rightLabel: '3 (3 As)',
          guides: [
            { pct: ((21 - 12) / 18) * 100, label: '12 Div II', strong: false },
            { pct: ((21 - 9) / 18) * 100, label: '9 Div I', strong: true }
          ]
        };
      },
      computeTip: function (studentCtx) {
        var p = studentCtx.principals;
        var bestIdx = 0;
        for (var i = 1; i < p.length; i++) {
          if (p[i].pts > p[bestIdx].pts) bestIdx = i;
        }
        var chosen = p[bestIdx];
        if (chosen.pts <= 1) {
          return {
            bestIndex: 0,
            suggestedSimVal: 6,
            html: 'All three ACSEE principal subjects are already at Grade A (3 NECTA points, 15.0 TCU points). Next step: ensure a pass in General Studies and Basic Applied Mathematics where required by TCU degree programmes.'
          };
        }
        var curPos = Math.max(0, NECTA_ACSEE_SLIDER.indexOf(chosen.grade));
        var nextPos = Math.min(6, curPos + 1);
        var tgtGrade = NECTA_ACSEE_SLIDER[nextPos];
        var drop = chosen.pts - NECTA_ACSEE_PTS[tgtGrade];
        var tcuGain = TCU_ACSEE_PTS[tgtGrade] - chosen.tcu;
        var newTotal = studentCtx.score - drop;
        return {
          bestIndex: bestIdx,
          suggestedSimVal: nextPos,
          html: '<strong>' + escapeHtml(chosen.name) + ' (Grade ' + chosen.grade + ')</strong> is your weakest principal paper: raising it by one step to <strong>Grade ' + tgtGrade + '</strong> lowers your NECTA total to <strong>' + newTotal + ' points</strong> and adds <strong>+' + tcuGain + ' TCU point' + (tcuGain === 1 ? '' : 's') + '</strong> for university selection. Next step: focus timed Paper 1 and Paper 2 revision on ' + escapeHtml(chosen.name) + '.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var p = studentCtx.principals;
        var idx = clampNum(itemIndex, 0, p.length - 1);
        var chosen = p[idx];
        var curPos = Math.max(0, NECTA_ACSEE_SLIDER.indexOf(chosen.grade));
        return {
          selectLabel: 'Principal Subject',
          options: p.map(function (pr, i) {
            return { index: i, label: pr.name + ' (now Grade ' + pr.grade + ' - ' + pr.pts + ' NECTA / ' + pr.tcu + ' TCU)' };
          }),
          sliderLabel: 'Target ACSEE Grade',
          min: 0,
          max: 6,
          step: 1,
          defaultVal: Math.min(6, curPos + 1),
          formatSliderVal: function (v) {
            var g = NECTA_ACSEE_SLIDER[v] || 'A';
            return 'Grade ' + g + ' (' + NECTA_ACSEE_PTS[g] + ' NECTA / ' + TCU_ACSEE_PTS[g] + ' TCU)';
          },
          simulate: function (v) {
            var g = NECTA_ACSEE_SLIDER[v] || chosen.grade;
            var grades = p.map(function (pr, i) { return i === idx ? g : pr.grade; });
            var proj = NECTA_ACSEE_PTS[grades[0]] + NECTA_ACSEE_PTS[grades[1]] + NECTA_ACSEE_PTS[grades[2]];
            var div = nectaAcseeDivision(proj, grades);
            var diff = proj - studentCtx.score;
            return {
              projectedScore: proj,
              projectedDisplay: proj + ' pts (' + div + ')',
              changeDisplay: (diff > 0 ? '+' : '') + diff + ' pts',
              changeState: diff < 0 ? 'pos' : (diff > 0 ? 'neg' : '')
            };
          }
        };
      }
    },

    /* 28. KENYA UNIVERSITY GPA & HONOURS CALCULATOR */
    'kenya-university-gpa-calculator': {
      formId: 'gpaForm',
      resetIds: ['resetBtn'],
      wideGrid: true,
      bannerDesc: 'Compare your Kenyan university GPA or Weighted Average Mark (WAM) and CUE Honours classification with a course mate.',
      emptyTitle: 'Calculate Your University GPA First',
      emptyDesc: 'Enter your course units, credit hours, and grades above and calculate your GPA to compare with a classmate.',
      projectedLabel: 'Projected GPA / WAM',
      higherIsBetter: true,
      tieEpsilon: 0.02,
      modes: [
        { id: 'standard', label: 'Course Units' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var sysEl = document.getElementById('gradingSystem');
        var sys = sysEl ? sysEl.value : 'public_5tier';
        var isWam = sys === 'percentage_wam';
        var rows = document.querySelectorAll('#coursesContainer .course-row');
        var courses = [];
        var totCr = 0;
        var totWeighted = 0;
        for (var i = 0; i < rows.length; i++) {
          var nEl = rows[i].querySelector('.course-name');
          var crEl = rows[i].querySelector('.course-credits');
          var cr = crEl ? parseFloat(crEl.value) : NaN;
          if (!isFinite(cr) || cr <= 0) continue;
          var nm = (nEl && nEl.value.trim()) ? nEl.value.trim() : ('Unit ' + (i + 1));
          if (isWam) {
            var mEl = rows[i].querySelector('.course-grade-input');
            var mk = mEl ? parseFloat(mEl.value) : NaN;
            if (!isFinite(mk) || mk < 0 || mk > 100) continue;
            totCr += cr;
            totWeighted += mk * cr;
            courses.push({ name: nm, credits: cr, valNum: mk, rawVal: String(mk) });
          } else {
            var gEl = rows[i].querySelector('.course-grade-select');
            var gv = gEl ? gEl.value : '';
            var gp = parseFloat(gv);
            if (gv === '' || !isFinite(gp)) continue;
            totCr += cr;
            totWeighted += gp * cr;
            courses.push({ name: nm, credits: cr, valNum: gp, rawVal: gv });
          }
        }
        if (!courses.length || totCr <= 0) return null;
        var raw = totWeighted / totCr;
        var score = Math.round(raw * 100) / 100;
        return {
          mode: 'standard',
          sys: sys,
          isWam: isWam,
          rawScore: raw,
          score: score,
          maxScore: isWam ? 100 : 4.0,
          totalCredits: totCr,
          band: kenyaHonoursBand(score, isWam) + ' (' + totCr + ' cr)',
          courses: courses
        };
      },
      getDefaultFriendItems: function (mode, studentCtx) {
        var sys = (studentCtx && studentCtx.sys) ? studentCtx.sys : 'public_5tier';
        var isWam = sys === 'percentage_wam';
        var src = (studentCtx && studentCtx.courses && studentCtx.courses.length) ? studentCtx.courses : [
          { name: 'Unit 1', credits: 3 }, { name: 'Unit 2', credits: 3 },
          { name: 'Unit 3', credits: 3 }, { name: 'Unit 4', credits: 3 }
        ];
        if (isWam) {
          return src.map(function (c, idx) {
            return {
              id: 'f_ke_' + idx,
              name: c.name,
              tag: 'WAM %',
              type: 'dual-num',
              min: 0,
              max: 100,
              suffix: '%',
              placeholder: '0-100',
              val: null,
              aux: c.credits
            };
          });
        }
        var scaleList = sys === 'private_plusminus' ? KENYA_PRIVATE_GRADES : KENYA_PUBLIC_GRADES;
        var opts = [{ value: '', label: 'Grade...' }].concat(scaleList.map(function (g) {
          return { value: g.value, label: g.label };
        }));
        return src.map(function (c, idx) {
          return {
            id: 'f_ke_' + idx,
            name: c.name,
            tag: '4.0 GPA',
            type: 'dual-gpa',
            options: opts,
            val: '',
            aux: c.credits
          };
        });
      },
      getSampleFriendItems: function (mode, studentCtx) {
        var items = this.getDefaultFriendItems(mode, studentCtx);
        var isWam = !!(studentCtx && studentCtx.isWam);
        var wamSamples = [68, 72, 64, 71, 66, 74];
        var gpaSamples = ['3.0', '4.0', '3.0', '3.0', '4.0', '2.0'];
        for (var i = 0; i < items.length; i++) {
          items[i].val = isWam ? wamSamples[i % wamSamples.length] : gpaSamples[i % gpaSamples.length];
          if (!items[i].aux) items[i].aux = 3;
        }
        return items;
      },
      calculateFriend: function (items, mode, studentCtx) {
        var isWam = !!(studentCtx && studentCtx.isWam);
        var totCr = 0;
        var totW = 0;
        var filled = 0;
        for (var i = 0; i < items.length; i++) {
          var cr = (items[i].aux && isFinite(items[i].aux) && items[i].aux > 0) ? items[i].aux : 3;
          if (isWam) {
            if (items[i].val !== null && isFinite(items[i].val)) {
              totCr += cr;
              totW += items[i].val * cr;
              filled++;
            }
          } else {
            var gp = parseFloat(items[i].val);
            if (items[i].val !== '' && isFinite(gp)) {
              totCr += cr;
              totW += gp * cr;
              filled++;
            }
          }
        }
        if (!filled || totCr <= 0) return null;
        var sc = Math.round((totW / totCr) * 100) / 100;
        return {
          score: sc,
          maxScore: isWam ? 100 : 4.0,
          filledCount: filled,
          band: kenyaHonoursBand(sc, isWam) + ' (' + totCr + ' cr)'
        };
      },
      validateMessage: 'Enter at least one course unit grade and credit weighting for your friend.',
      formatScore: function (val) {
        var ctx = ADAPTERS['kenya-university-gpa-calculator'].getStudentContext();
        return (ctx && ctx.isWam) ? val.toFixed(2) + '%' : val.toFixed(2) + ' / 4.00';
      },
      formatDiff: function (absDiff) {
        var ctx = ADAPTERS['kenya-university-gpa-calculator'].getStudentContext();
        return (ctx && ctx.isWam) ? absDiff.toFixed(2) + ' percentage points' : absDiff.toFixed(2) + ' GPA points';
      },
      getSvgConfig: function (mode, studentComp) {
        var isWam = studentComp && studentComp.maxScore === 100;
        if (isWam) {
          return {
            min: 0,
            max: 100,
            invert: false,
            leftLabel: '0%',
            rightLabel: '100%',
            guides: [
              { pct: 60, label: '60% 2:1', strong: false },
              { pct: 70, label: '70% 1st', strong: true }
            ]
          };
        }
        return {
          min: 0,
          max: 4.0,
          invert: false,
          leftLabel: '0.00',
          rightLabel: '4.00 Max',
          guides: [
            { pct: (3.0 / 4.0) * 100, label: '3.00 2:1', strong: false },
            { pct: (3.7 / 4.0) * 100, label: '3.70 1st', strong: true }
          ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName) {
        var courses = studentCtx.courses;
        var bestIdx = 0;
        var bestPot = -1;
        var cap = studentCtx.isWam ? 100 : 4.0;
        for (var i = 0; i < courses.length; i++) {
          var pot = (cap - courses[i].valNum) * courses[i].credits;
          if (pot > bestPot) {
            bestPot = pot;
            bestIdx = i;
          }
        }
        var chosen = courses[bestIdx];
        if (studentCtx.isWam) {
          var tgtM = clampNum(Math.round(chosen.valNum + 10), 0, 100);
          var gainM = ((tgtM - chosen.valNum) * chosen.credits) / studentCtx.totalCredits;
          var projM = Math.round((studentCtx.rawScore + gainM) * 100) / 100;
          return {
            bestIndex: bestIdx,
            suggestedSimVal: tgtM,
            html: '<strong>' + escapeHtml(chosen.name) + ' (' + chosen.credits + ' credits, ' + Math.round(chosen.valNum) + '%)</strong> carries your greatest WAM leverage: lifting it to <strong>' + tgtM + '%</strong> adds <strong>+' + gainM.toFixed(2) + '%</strong> to reach <strong>' + projM.toFixed(2) + '%</strong>. Next step: secure strong CATs (30%) before the 70% end-of-semester university examination.'
          };
        }
        var scaleList = studentCtx.sys === 'private_plusminus' ? KENYA_PRIVATE_GRADES.slice().reverse() : KENYA_PUBLIC_GRADES.slice().reverse();
        if (bestPot <= 0.01) {
          return {
            bestIndex: 0,
            suggestedSimVal: scaleList.length - 1,
            html: 'Every entered unit is already at Grade A (4.00). Next step: protect your 3-credit and 4-credit core units to remain above the 3.70 First Class Honours mark.'
          };
        }
        var curPos = 0;
        for (var k = 0; k < scaleList.length; k++) {
          if (Math.abs(scaleList[k].pts - chosen.valNum) < 0.05) curPos = k;
        }
        var tgtPos = Math.min(scaleList.length - 1, curPos + (studentCtx.sys === 'private_plusminus' ? 2 : 1));
        var tgtObj = scaleList[tgtPos];
        var gainG = ((tgtObj.pts - chosen.valNum) * chosen.credits) / studentCtx.totalCredits;
        var projG = Math.round((studentCtx.rawScore + gainG) * 100) / 100;
        var vsNote = (studentCtx.score < friendCalc.score && projG >= friendCalc.score)
          ? ' and moves you ahead of ' + escapeHtml(friendName)
          : ' to reach <strong>' + projG.toFixed(2) + ' / 4.00</strong>';
        return {
          bestIndex: bestIdx,
          suggestedSimVal: tgtPos,
          html: '<strong>' + escapeHtml(chosen.name) + ' (' + chosen.credits + ' credits, ' + chosen.valNum.toFixed(1) + ' pts)</strong> offers your biggest GPA jump: raising it to <strong>Grade ' + tgtObj.code + ' (' + tgtObj.pts.toFixed(1) + ')</strong> adds <strong>+' + gainG.toFixed(2) + ' GPA points</strong>' + vsNote + '. Next step: prioritise high-credit units where crossing 60% (B) or 70% (A) adds a full quality point per credit.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var courses = studentCtx.courses;
        var idx = clampNum(itemIndex, 0, courses.length - 1);
        var chosen = courses[idx];
        if (studentCtx.isWam) {
          return {
            selectLabel: 'Course Unit',
            options: courses.map(function (c, i) {
              return { index: i, label: c.name + ' (' + c.credits + ' cr - now ' + Math.round(c.valNum) + '%)' };
            }),
            sliderLabel: 'Hypothetical Unit Mark',
            min: 0,
            max: 100,
            step: 1,
            defaultVal: clampNum(Math.round(chosen.valNum + 10), 0, 100),
            formatSliderVal: function (v) { return Math.round(v) + '%'; },
            simulate: function (v) {
              var delta = ((v - chosen.valNum) * chosen.credits) / studentCtx.totalCredits;
              var proj = clampNum(Math.round((studentCtx.rawScore + delta) * 100) / 100, 0, 100);
              return {
                projectedScore: proj,
                projectedDisplay: proj.toFixed(2) + '%',
                changeDisplay: (delta >= 0 ? '+' : '') + delta.toFixed(2) + '%',
                changeState: delta > 0.02 ? 'pos' : (delta < -0.02 ? 'neg' : '')
              };
            }
          };
        }
        var scaleList = studentCtx.sys === 'private_plusminus' ? KENYA_PRIVATE_GRADES.slice().reverse() : KENYA_PUBLIC_GRADES.slice().reverse();
        var curPos = 0;
        for (var k = 0; k < scaleList.length; k++) {
          if (Math.abs(scaleList[k].pts - chosen.valNum) < 0.05) curPos = k;
        }
        var maxIdx = scaleList.length - 1;
        return {
          selectLabel: 'Course Unit',
          options: courses.map(function (c, i) {
            return { index: i, label: c.name + ' (' + c.credits + ' cr - now ' + c.valNum.toFixed(1) + ' pts)' };
          }),
          sliderLabel: 'Target Unit Grade',
          min: 0,
          max: maxIdx,
          step: 1,
          defaultVal: Math.min(maxIdx, curPos + 1),
          formatSliderVal: function (v) {
            var item = scaleList[v] || scaleList[maxIdx];
            return 'Grade ' + item.code + ' (' + item.pts.toFixed(2) + ')';
          },
          simulate: function (v) {
            var item = scaleList[v] || scaleList[curPos];
            var delta = ((item.pts - chosen.valNum) * chosen.credits) / studentCtx.totalCredits;
            var proj = clampNum(Math.round((studentCtx.rawScore + delta) * 100) / 100, 0, 4.0);
            return {
              projectedScore: proj,
              projectedDisplay: proj.toFixed(2) + ' / 4.00',
              changeDisplay: (delta >= 0 ? '+' : '') + delta.toFixed(2) + ' GPA',
              changeState: delta > 0.005 ? 'pos' : (delta < -0.005 ? 'neg' : '')
            };
          }
        };
      }
    },

    /* 29. UGANDA UNIVERSITY 5.0 CGPA CALCULATOR (NCHE) */
    'uganda-university-cgpa-calculator': {
      formId: 'gpaForm',
      resetIds: ['resetBtn', 'tabSemester', 'tabCgpa'],
      wideGrid: true,
      bannerDesc: 'Compare your Uganda NCHE 5.0 university GPA and degree Honours classification with a course mate.',
      emptyTitle: 'Calculate Your Uganda University GPA First',
      emptyDesc: 'Select credit units and grades for your courses above and calculate your GPA to compare with a classmate.',
      projectedLabel: 'Projected NCHE GPA',
      higherIsBetter: true,
      tieEpsilon: 0.02,
      modes: [
        { id: 'standard', label: 'NCHE 5.0 Scale' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var tabCgpa = document.getElementById('tabCgpa');
        var isCgpaTab = !!(tabCgpa && tabCgpa.classList.contains('active'));
        var container = document.getElementById(isCgpaTab ? 'coursesContainer2' : 'coursesContainer');
        if (!container) return null;
        var rows = container.querySelectorAll('.course-row');
        var courses = [];
        var totCr = 0;
        var totQp = 0;
        for (var i = 0; i < rows.length; i++) {
          var nEl = rows[i].querySelector('.course-name');
          var crEl = rows[i].querySelector('.course-credits');
          var gEl = rows[i].querySelector('.course-grade');
          var cr = crEl ? parseFloat(crEl.value) : NaN;
          var gv = gEl ? gEl.value : '';
          var gp = parseFloat(gv);
          if (!isFinite(cr) || cr <= 0 || gv === '' || !isFinite(gp)) continue;
          var nm = (nEl && nEl.value.trim()) ? nEl.value.trim() : ('Unit ' + (courses.length + 1));
          totCr += cr;
          totQp += cr * gp;
          courses.push({ name: nm, credits: cr, gp: gp, rawVal: gv });
        }
        if (isCgpaTab) {
          var prevGpaEl = document.getElementById('prevCgpa');
          var prevCrEl = document.getElementById('prevCredits');
          var pGpa = prevGpaEl ? parseFloat(prevGpaEl.value) : NaN;
          var pCr = prevCrEl ? parseFloat(prevCrEl.value) : NaN;
          if (isFinite(pGpa) && pGpa >= 0 && pGpa <= 5.0 && isFinite(pCr) && pCr > 0) {
            totCr += pCr;
            totQp += pGpa * pCr;
          }
        }
        if (!courses.length || totCr <= 0) return null;
        var raw = totQp / totCr;
        var score = Math.round(raw * 100) / 100;
        return {
          mode: 'standard',
          rawScore: raw,
          score: score,
          maxScore: 5.0,
          totalCredits: totCr,
          band: ugandaNcheBand(score) + ' (' + totCr + ' CU)',
          courses: courses
        };
      },
      getDefaultFriendItems: function (mode, studentCtx) {
        var opts = [{ value: '', label: 'Grade...' }].concat(UGANDA_NCHE_GRADES.map(function (g) {
          return { value: g.value, label: g.label };
        }));
        var src = (studentCtx && studentCtx.courses && studentCtx.courses.length) ? studentCtx.courses : [
          { name: 'Unit 1', credits: 4 }, { name: 'Unit 2', credits: 4 },
          { name: 'Unit 3', credits: 3 }, { name: 'Unit 4', credits: 3 }
        ];
        return src.map(function (c, idx) {
          return {
            id: 'f_ug_' + idx,
            name: c.name,
            tag: 'NCHE 5.0',
            type: 'dual-gpa',
            options: opts,
            val: '',
            aux: c.credits
          };
        });
      },
      getSampleFriendItems: function (mode, studentCtx) {
        var items = this.getDefaultFriendItems(mode, studentCtx);
        var sample = ['4.0', '4.5', '3.5', '4.0', '4.5', '3.5'];
        for (var i = 0; i < items.length; i++) {
          items[i].val = sample[i % sample.length];
          if (!items[i].aux) items[i].aux = 4;
        }
        return items;
      },
      calculateFriend: function (items) {
        var totCr = 0;
        var totQp = 0;
        var filled = 0;
        for (var i = 0; i < items.length; i++) {
          var gp = parseFloat(items[i].val);
          var cr = (items[i].aux && isFinite(items[i].aux) && items[i].aux > 0) ? items[i].aux : 4;
          if (items[i].val !== '' && isFinite(gp)) {
            totCr += cr;
            totQp += gp * cr;
            filled++;
          }
        }
        if (!filled || totCr <= 0) return null;
        var sc = Math.round((totQp / totCr) * 100) / 100;
        return {
          score: sc,
          maxScore: 5.0,
          filledCount: filled,
          band: ugandaNcheBand(sc) + ' (' + totCr + ' CU)'
        };
      },
      validateMessage: 'Select at least one course unit grade and credit unit (CU) value for your friend.',
      formatScore: function (val) { return val.toFixed(2) + ' / 5.00'; },
      formatDiff: function (absDiff) { return absDiff.toFixed(2) + ' GPA points'; },
      getSvgConfig: function () {
        return {
          min: 0,
          max: 5.0,
          invert: false,
          leftLabel: '0.00',
          rightLabel: '5.00 Max',
          guides: [
            { pct: (3.60 / 5.0) * 100, label: '3.60 2:1', strong: false },
            { pct: (4.40 / 5.0) * 100, label: '4.40 1st', strong: true }
          ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName) {
        var courses = studentCtx.courses;
        var asc = UGANDA_NCHE_GRADES.slice().reverse();
        var bestIdx = 0;
        var bestPot = -1;
        for (var i = 0; i < courses.length; i++) {
          var pot = (5.0 - courses[i].gp) * courses[i].credits;
          if (pot > bestPot) {
            bestPot = pot;
            bestIdx = i;
          }
        }
        var chosen = courses[bestIdx];
        if (bestPot <= 0.01) {
          return {
            bestIndex: 0,
            suggestedSimVal: asc.length - 1,
            html: 'All entered course units are already at Grade A (5.00). Next step: protect your 4-CU and 5-CU core units to stay comfortably above the 4.40 NCHE First Class Honours line.'
          };
        }
        var curPos = 0;
        for (var k = 0; k < asc.length; k++) {
          if (Math.abs(asc[k].pts - chosen.gp) < 0.05) curPos = k;
        }
        var tgtPos = Math.min(asc.length - 1, curPos + 2);
        var tgtObj = asc[tgtPos];
        var gain = ((tgtObj.pts - chosen.gp) * chosen.credits) / studentCtx.totalCredits;
        var proj = Math.round((studentCtx.rawScore + gain) * 100) / 100;
        var vsNote = (studentCtx.score < friendCalc.score && proj >= friendCalc.score)
          ? ' and moves you ahead of ' + escapeHtml(friendName)
          : ' to reach <strong>' + proj.toFixed(2) + ' / 5.00</strong>';
        return {
          bestIndex: bestIdx,
          suggestedSimVal: tgtPos,
          html: '<strong>' + escapeHtml(chosen.name) + ' (' + chosen.credits + ' CU, ' + chosen.gp.toFixed(1) + ' pts)</strong> carries your strongest NCHE GPA leverage: raising it to <strong>' + tgtObj.code + ' (' + tgtObj.pts.toFixed(1) + ')</strong> adds <strong>+' + gain.toFixed(2) + ' GPA points</strong>' + vsNote + '. Next step: prioritise coursework and tests in 4-CU and 5-CU units before final exams.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var courses = studentCtx.courses;
        var idx = clampNum(itemIndex, 0, courses.length - 1);
        var chosen = courses[idx];
        var asc = UGANDA_NCHE_GRADES.slice().reverse();
        var curPos = 0;
        for (var k = 0; k < asc.length; k++) {
          if (Math.abs(asc[k].pts - chosen.gp) < 0.05) curPos = k;
        }
        var maxIdx = asc.length - 1;
        return {
          selectLabel: 'Course Unit',
          options: courses.map(function (c, i) {
            return { index: i, label: c.name + ' (' + c.credits + ' CU - now ' + c.gp.toFixed(1) + ' pts)' };
          }),
          sliderLabel: 'Target NCHE Grade',
          min: 0,
          max: maxIdx,
          step: 1,
          defaultVal: Math.min(maxIdx, curPos + 2),
          formatSliderVal: function (v) {
            var item = asc[v] || asc[maxIdx];
            return item.code + ' (' + item.pts.toFixed(1) + ' pts)';
          },
          simulate: function (v) {
            var item = asc[v] || asc[curPos];
            var delta = ((item.pts - chosen.gp) * chosen.credits) / studentCtx.totalCredits;
            var proj = clampNum(Math.round((studentCtx.rawScore + delta) * 100) / 100, 0, 5.0);
            return {
              projectedScore: proj,
              projectedDisplay: proj.toFixed(2) + ' / 5.00',
              changeDisplay: (delta >= 0 ? '+' : '') + delta.toFixed(2) + ' GPA',
              changeState: delta > 0.005 ? 'pos' : (delta < -0.005 ? 'neg' : '')
            };
          }
        };
      }
    },

    /* 30. GHANA NURSING TRAINING ADMISSION AGGREGATE CALCULATOR */
    'ghana-nursing-training-admission-calculator': {
      formId: 'ghForm',
      resetIds: [],
      bannerDesc: 'Compare your 6-subject Ghana Ministry of Health Nursing Training WASSCE aggregate and interview band with a friend (lower aggregate is stronger).',
      emptyTitle: 'Calculate Your Nursing Aggregate First',
      emptyDesc: 'Select grades for all three Core and three Elective WASSCE subjects above to compare your MoH Nursing aggregate with a friend.',
      projectedLabel: 'Projected MoH Aggregate',
      higherIsBetter: false,
      tieEpsilon: 0.5,
      modes: [
        { id: 'standard', label: '6 Nursing Subjects (6-54)' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var defs = [
          { id: 'ghEnglish', name: 'Core English', tag: 'Core' },
          { id: 'ghMaths', name: 'Core Mathematics', tag: 'Core' },
          { id: 'ghScience', name: 'Integrated Science', tag: 'Core' },
          { id: 'ghElec1Grade', name: 'Elective 1', tag: 'Elective' },
          { id: 'ghElec2Grade', name: 'Elective 2', tag: 'Elective' },
          { id: 'ghElec3Grade', name: 'Elective 3', tag: 'Elective' }
        ];
        var subjects = [];
        var grades = [];
        for (var i = 0; i < defs.length; i++) {
          var el = document.getElementById(defs[i].id);
          var g = el ? parseInt(el.value, 10) : NaN;
          if (!isFinite(g) || g < 1 || g > 9) return null;
          subjects.push({ id: defs[i].id, name: defs[i].name, tag: defs[i].tag, pts: g, code: GH_NURSING_CODE[g] });
          grades.push(g);
        }
        var agg = grades.reduce(function (a, b) { return a + b; }, 0);
        var progEl = document.getElementById('ghProgram');
        var progKey = (progEl && GH_NURSING_PROGS[progEl.value]) ? progEl.value : 'rgn';
        return {
          mode: 'standard',
          progKey: progKey,
          score: agg,
          maxScore: 54,
          band: ghNursingEligibility(agg, grades, progKey),
          subjects: subjects,
          grades: grades
        };
      },
      getDefaultFriendItems: function () {
        var opts = [{ value: '', label: 'Select grade...' }].concat([1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (n) {
          return { value: String(n), label: GH_NURSING_CODE[n] + ' (' + n + ' pt' + (n === 1 ? '' : 's') + ')' };
        }));
        var defs = [
          { id: 'ghEnglish', name: 'Core English', tag: 'Core' },
          { id: 'ghMaths', name: 'Core Mathematics', tag: 'Core' },
          { id: 'ghScience', name: 'Integrated Science', tag: 'Core' },
          { id: 'ghElec1Grade', name: 'Elective 1', tag: 'Elective' },
          { id: 'ghElec2Grade', name: 'Elective 2', tag: 'Elective' },
          { id: 'ghElec3Grade', name: 'Elective 3', tag: 'Elective' }
        ];
        return defs.map(function (d) {
          return { id: d.id, name: d.name, tag: d.tag, type: 'select', options: opts, val: '' };
        });
      },
      getSampleFriendItems: function () {
        var items = this.getDefaultFriendItems();
        var sample = ['3', '4', '3', '3', '4', '3'];
        for (var i = 0; i < items.length; i++) items[i].val = sample[i];
        return items;
      },
      calculateFriend: function (items, mode, studentCtx) {
        var grades = [];
        for (var i = 0; i < items.length; i++) {
          var g = parseInt(items[i].val, 10);
          if (!isFinite(g) || g < 1 || g > 9) return null;
          grades.push(g);
        }
        if (grades.length < 6) return null;
        var agg = grades.reduce(function (a, b) { return a + b; }, 0);
        var progKey = (studentCtx && studentCtx.progKey) ? studentCtx.progKey : 'rgn';
        return {
          score: agg,
          maxScore: 54,
          filledCount: 6,
          band: ghNursingEligibility(agg, grades, progKey)
        };
      },
      validateMessage: 'Select all 6 WASSCE subject grades (3 Core + 3 Electives) for your friend.',
      formatScore: function (val) { return 'Agg ' + Math.round(val); },
      formatDiff: function (absDiff) {
        var p = Math.round(absDiff);
        return p + ' aggregate ' + (p === 1 ? 'point' : 'points');
      },
      getSvgConfig: function () {
        return {
          min: 6,
          max: 54,
          invert: true,
          leftLabel: '54 Weak',
          rightLabel: '6 Best',
          guides: [
            { pct: ((54 - 36) / 48) * 100, label: '36 Cert', strong: false },
            { pct: ((54 - 24) / 48) * 100, label: '24 Diploma', strong: true }
          ]
        };
      },
      computeTip: function (studentCtx) {
        var subs = studentCtx.subjects;
        var bestIdx = 0;
        var worstMetric = -1;
        for (var i = 0; i < subs.length; i++) {
          // Prioritize D7/E8/F9 subjects that block C6 Diploma rule
          var m = subs[i].pts + (subs[i].pts > 6 ? 4 : 0) + (i < 3 ? 0.25 : 0);
          if (m > worstMetric) {
            worstMetric = m;
            bestIdx = i;
          }
        }
        var chosen = subs[bestIdx];
        if (chosen.pts <= 1) {
          return {
            bestIndex: 0,
            suggestedSimVal: 8,
            html: 'All six Nursing subjects are already at A1 (Aggregate 6). Next step: prepare early for the Ministry of Health aptitude interview and clinical motivation questions.'
          };
        }
        var tgtPts = chosen.pts > 6 ? 6 : Math.max(1, chosen.pts - 2);
        var drop = chosen.pts - tgtPts;
        var newAgg = studentCtx.score - drop;
        var newGrades = studentCtx.grades.map(function (g, idx) { return idx === bestIdx ? tgtPts : g; });
        var newElig = ghNursingEligibility(newAgg, newGrades, studentCtx.progKey);
        var sliderPos = GH_NURSING_SLIDER.indexOf(tgtPts);
        var c6Note = chosen.pts > 6 ? ' and clears the mandatory C6 credit bar for MoH Nursing Diploma programmes' : '';
        return {
          bestIndex: bestIdx,
          suggestedSimVal: sliderPos !== -1 ? sliderPos : 6,
          html: '<strong>' + escapeHtml(chosen.name) + ' (' + chosen.code + ', ' + chosen.pts + ' pts)</strong> is your top upgrade: improving it to <strong>' + GH_NURSING_CODE[tgtPts] + '</strong> cuts <strong>' + drop + ' point' + (drop === 1 ? '' : 's') + '</strong> off your total to <strong>Aggregate ' + newAgg + ' (' + escapeHtml(newElig) + ')</strong>' + c6Note + '. Next step: sit NOVDEC or drill WAEC Paper 2 questions in ' + escapeHtml(chosen.name) + '.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var subs = studentCtx.subjects;
        var idx = clampNum(itemIndex, 0, subs.length - 1);
        var chosen = subs[idx];
        var curPos = Math.max(0, GH_NURSING_SLIDER.indexOf(chosen.pts));
        return {
          selectLabel: 'WASSCE Subject',
          options: subs.map(function (s, i) {
            return { index: i, label: s.name + ' (now ' + s.code + ' - ' + s.pts + ' pts)' };
          }),
          sliderLabel: 'Target WASSCE Grade',
          min: 0,
          max: 8,
          step: 1,
          defaultVal: Math.min(8, curPos + 2),
          formatSliderVal: function (v) {
            var p = GH_NURSING_SLIDER[v] || 1;
            return GH_NURSING_CODE[p] + ' (' + p + ' pt' + (p === 1 ? '' : 's') + ')';
          },
          simulate: function (v) {
            var p = GH_NURSING_SLIDER[v] || chosen.pts;
            var newGrades = studentCtx.grades.map(function (g, i) { return i === idx ? p : g; });
            var proj = newGrades.reduce(function (a, b) { return a + b; }, 0);
            var elig = ghNursingEligibility(proj, newGrades, studentCtx.progKey);
            var diff = proj - studentCtx.score;
            return {
              projectedScore: proj,
              projectedDisplay: 'Agg ' + proj + ' (' + elig + ')',
              changeDisplay: (diff > 0 ? '+' : '') + diff + ' pts',
              changeState: diff < 0 ? 'pos' : (diff > 0 ? 'neg' : '')
            };
          }
        };
      }
    },

    /* 31. ZIMBABWE UNIVERSITY GPA & DEGREE CLASSIFICATION CALCULATOR */
    'zimbabwe-university-gpa-calculator': {
      formId: 'gpaForm',
      resetIds: ['resetBtn'],
      bannerDesc: 'Compare your Zimbabwe university GPA or weighted degree mark and ZCHE Honours classification with a classmate.',
      emptyTitle: 'Calculate Your Zimbabwe GPA First',
      emptyDesc: 'Enter your module marks and credits above and calculate your GPA to compare against a classmate.',
      projectedLabel: 'Projected GPA / WAM',
      higherIsBetter: true,
      tieEpsilon: 0.03,
      modes: [
        { id: 'standard', label: 'Module Marks & Credits' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var scaleEl = document.getElementById('gradingScale');
        var scaleKey = (scaleEl && scaleEl.value) ? scaleEl.value : 'division_4';
        var isWam = scaleKey === 'percentage_wam';
        var maxScale = isWam ? 100 : (scaleKey === 'gpa_5_0' ? 5.0 : 4.0);
        var rows = document.querySelectorAll('#coursesContainer .course-row');
        var courses = [];
        var semCr = 0;
        var semWeighted = 0;
        for (var i = 0; i < rows.length; i++) {
          var nEl = rows[i].querySelector('.course-name');
          var cEl = rows[i].querySelector('.course-credits');
          var mEl = rows[i].querySelector('.course-mark');
          var cr = cEl ? parseFloat(cEl.value) : NaN;
          var mk = mEl ? parseFloat(mEl.value) : NaN;
          if (!isFinite(cr) || cr <= 0 || !isFinite(mk) || mk < 0 || mk > 100) continue;
          var nm = (nEl && nEl.value.trim()) ? nEl.value.trim() : ('Module ' + (courses.length + 1));
          var pt = zwGpaPointFromMark(mk, scaleKey);
          semCr += cr;
          semWeighted += cr * pt;
          courses.push({ name: nm, credits: cr, mark: mk, gp: pt });
        }
        if (!courses.length || semCr <= 0) return null;
        var totCr = semCr;
        var totWeighted = semWeighted;
        var pCgpaEl = document.getElementById('priorCgpa');
        var pCrEl = document.getElementById('priorCredits');
        var pCgpa = pCgpaEl ? parseFloat(pCgpaEl.value) : NaN;
        var pCr = pCrEl ? parseFloat(pCrEl.value) : NaN;
        if (isFinite(pCr) && pCr > 0 && isFinite(pCgpa) && pCgpa >= 0 && pCgpa <= maxScale) {
          totCr += pCr;
          totWeighted += pCgpa * pCr;
        }
        var raw = totWeighted / totCr;
        var score = isWam ? (Math.round(raw * 10) / 10) : (Math.round(raw * 100) / 100);
        return {
          mode: 'standard',
          scaleKey: scaleKey,
          isWam: isWam,
          rawScore: raw,
          score: score,
          maxScore: maxScale,
          totalCredits: totCr,
          band: zwGpaHonoursBand(raw, scaleKey) + ' (' + totCr + ' cr)',
          courses: courses
        };
      },
      getDefaultFriendItems: function (mode, studentCtx) {
        var src = (studentCtx && studentCtx.courses && studentCtx.courses.length) ? studentCtx.courses : [
          { name: 'Module 1', credits: 12 }, { name: 'Module 2', credits: 12 },
          { name: 'Module 3', credits: 12 }, { name: 'Module 4', credits: 12 }
        ];
        return src.map(function (c, idx) {
          return {
            id: 'f_zwgpa_' + idx,
            name: c.name,
            tag: 'Mark %',
            type: 'dual-num',
            min: 0,
            max: 100,
            suffix: '%',
            placeholder: '0-100',
            val: null,
            aux: c.credits
          };
        });
      },
      getSampleFriendItems: function (mode, studentCtx) {
        var items = this.getDefaultFriendItems(mode, studentCtx);
        var sample = [76, 68, 74, 81, 65, 72];
        for (var i = 0; i < items.length; i++) {
          items[i].val = sample[i % sample.length];
          if (!items[i].aux) items[i].aux = 12;
        }
        return items;
      },
      calculateFriend: function (items, mode, studentCtx) {
        var scaleEl = document.getElementById('gradingScale');
        var scaleKey = (studentCtx && studentCtx.scaleKey) || (scaleEl && scaleEl.value) || 'division_4';
        var isWam = scaleKey === 'percentage_wam';
        var maxScale = isWam ? 100 : (scaleKey === 'gpa_5_0' ? 5.0 : 4.0);
        var totCr = 0;
        var totWeighted = 0;
        var filled = 0;
        for (var i = 0; i < items.length; i++) {
          var mk = items[i].val;
          var cr = (items[i].aux && isFinite(items[i].aux) && items[i].aux > 0) ? items[i].aux : 12;
          if (mk !== null && isFinite(mk)) {
            totCr += cr;
            totWeighted += zwGpaPointFromMark(mk, scaleKey) * cr;
            filled++;
          }
        }
        if (!filled || totCr <= 0) return null;
        var raw = totWeighted / totCr;
        var sc = isWam ? (Math.round(raw * 10) / 10) : (Math.round(raw * 100) / 100);
        return {
          score: sc,
          maxScore: maxScale,
          filledCount: filled,
          band: zwGpaHonoursBand(raw, scaleKey) + ' (' + totCr + ' cr)'
        };
      },
      validateMessage: 'Enter at least one module mark (0-100%) and credit weight for your friend.',
      formatScore: function (val) {
        var scaleEl = document.getElementById('gradingScale');
        var sk = (scaleEl && scaleEl.value) || 'division_4';
        if (sk === 'percentage_wam') return val.toFixed(1) + '%';
        if (sk === 'gpa_5_0') return val.toFixed(2) + ' / 5.00';
        return val.toFixed(2) + ' / 4.00';
      },
      formatDiff: function (absDiff) {
        var scaleEl = document.getElementById('gradingScale');
        var sk = (scaleEl && scaleEl.value) || 'division_4';
        if (sk === 'percentage_wam') return absDiff.toFixed(1) + ' percentage points';
        return absDiff.toFixed(2) + ' GPA points';
      },
      getSvgConfig: function (mode, studentComp) {
        var scaleEl = document.getElementById('gradingScale');
        var sk = (scaleEl && scaleEl.value) || (studentComp && studentComp.maxScore === 100 ? 'percentage_wam' : 'division_4');
        if (sk === 'percentage_wam') {
          return {
            min: 0, max: 100, invert: false, leftLabel: '0%', rightLabel: '100% Max',
            guides: [
              { pct: 70, label: '70% 2.1', strong: false },
              { pct: 80, label: '80% 1st', strong: true }
            ]
          };
        }
        if (sk === 'gpa_5_0') {
          return {
            min: 0, max: 5.0, invert: false, leftLabel: '0.00', rightLabel: '5.00 Max',
            guides: [
              { pct: (3.80 / 5.0) * 100, label: '3.80 2.1', strong: false },
              { pct: (4.50 / 5.0) * 100, label: '4.50 1st', strong: true }
            ]
          };
        }
        return {
          min: 0, max: 4.0, invert: false, leftLabel: '0.00', rightLabel: '4.00 Max',
          guides: [
            { pct: (3.00 / 4.0) * 100, label: '3.00 2.1', strong: false },
            { pct: (3.75 / 4.0) * 100, label: '3.75 1st', strong: true }
          ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName) {
        var courses = studentCtx.courses;
        var maxPt = studentCtx.maxScore;
        var bestIdx = 0;
        var bestPot = -1;
        for (var i = 0; i < courses.length; i++) {
          var pot = (maxPt - courses[i].gp) * courses[i].credits;
          if (pot > bestPot) {
            bestPot = pot;
            bestIdx = i;
          }
        }
        var chosen = courses[bestIdx];
        if (bestPot <= 0.01) {
          return {
            bestIndex: 0,
            suggestedSimVal: Math.max(85, Math.round(chosen.mark)),
            html: 'Every entered module is already in the top ZCHE Distinction band. Next step: maintain 80%+ marks in high-credit core modules and your final-year dissertation.'
          };
        }
        var targetMark = chosen.mark < 60 ? 65 : (chosen.mark < 70 ? 75 : (chosen.mark < 80 ? 82 : Math.min(100, Math.round(chosen.mark + 8))));
        var newPt = zwGpaPointFromMark(targetMark, studentCtx.scaleKey);
        var gain = ((newPt - chosen.gp) * chosen.credits) / studentCtx.totalCredits;
        var proj = studentCtx.isWam ? (Math.round((studentCtx.rawScore + gain) * 10) / 10) : (Math.round((studentCtx.rawScore + gain) * 100) / 100);
        var gainTxt = studentCtx.isWam ? ('+' + gain.toFixed(1) + '%') : ('+' + gain.toFixed(2) + ' GPA points');
        var vsNote = (studentCtx.score < friendCalc.score && proj >= friendCalc.score)
          ? ' and moves you ahead of ' + escapeHtml(friendName)
          : ' toward <strong>' + escapeHtml(this.formatScore(proj)) + '</strong>';
        return {
          bestIndex: bestIdx,
          suggestedSimVal: targetMark,
          html: '<strong>' + escapeHtml(chosen.name) + ' (' + chosen.credits + ' cr, ' + Math.round(chosen.mark) + '%)</strong> offers your strongest ZCHE degree boost: lifting it to <strong>' + targetMark + '%</strong> adds <strong>' + gainTxt + '</strong>' + vsNote + '. Next step: target continuous assessment coursework and past exam papers in this high-credit module.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var courses = studentCtx.courses;
        var idx = clampNum(itemIndex, 0, courses.length - 1);
        var chosen = courses[idx];
        var self = this;
        return {
          selectLabel: 'University Module',
          options: courses.map(function (c, i) {
            return { index: i, label: c.name + ' (' + c.credits + ' cr - now ' + Math.round(c.mark) + '%)' };
          }),
          sliderLabel: 'Simulated Module Mark',
          min: 0,
          max: 100,
          step: 1,
          defaultVal: Math.min(100, Math.max(Math.round(chosen.mark) + 8, 75)),
          formatSliderVal: function (v) { return Math.round(v) + '%'; },
          simulate: function (v) {
            var newPt = zwGpaPointFromMark(v, studentCtx.scaleKey);
            var delta = ((newPt - chosen.gp) * chosen.credits) / studentCtx.totalCredits;
            var rawProj = clampNum(studentCtx.rawScore + delta, 0, studentCtx.maxScore);
            var proj = studentCtx.isWam ? (Math.round(rawProj * 10) / 10) : (Math.round(rawProj * 100) / 100);
            var chg = studentCtx.isWam ? ((delta >= 0 ? '+' : '') + delta.toFixed(1) + '%') : ((delta >= 0 ? '+' : '') + delta.toFixed(2) + ' GPA');
            return {
              projectedScore: proj,
              projectedDisplay: self.formatScore(proj) + ' (' + zwGpaHonoursBand(rawProj, studentCtx.scaleKey) + ')',
              changeDisplay: chg,
              changeState: delta > 0.005 ? 'pos' : (delta < -0.005 ? 'neg' : '')
            };
          }
        };
      }
    },

    /* 32. ZAMBIA UNIVERSITY GPA CALCULATOR (UNZA / CBU / MULUNGUSHI) */
    'zambia-university-gpa-calculator': {
      formId: 'gpaForm',
      resetIds: ['gpaReset'],
      bannerDesc: 'Compare your UNZA, CBU, or Mulungushi university GPA and degree classification with a classmate.',
      emptyTitle: 'Calculate Your Zambia University GPA First',
      emptyDesc: 'Enter your course credits and grades above and calculate your GPA to compare with a classmate.',
      projectedLabel: 'Projected GPA',
      higherIsBetter: true,
      tieEpsilon: 0.03,
      modes: [
        { id: 'standard', label: 'Course Grades & Credits' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var scaleEl = document.getElementById('gpaScale');
        var scaleKey = (scaleEl && scaleEl.value === 'std4') ? 'std4' : 'unza5';
        var maxScale = scaleKey === 'std4' ? 4.0 : 5.0;
        var rows = document.querySelectorAll('#courseList .course-row');
        var courses = [];
        var semCr = 0;
        var semQp = 0;
        for (var i = 0; i < rows.length; i++) {
          var nEl = rows[i].querySelector('.course-name');
          var cEl = rows[i].querySelector('.course-credits');
          var gEl = rows[i].querySelector('.course-grade');
          var cr = cEl ? parseFloat(cEl.value) : NaN;
          var gp = (gEl && gEl.value !== '') ? parseFloat(gEl.value) : NaN;
          if (!isFinite(cr) || cr <= 0 || !isFinite(gp) || gp < 0) continue;
          var nm = (nEl && nEl.value.trim()) ? nEl.value.trim() : ('Course ' + (courses.length + 1));
          semCr += cr;
          semQp += cr * gp;
          courses.push({ name: nm, credits: cr, gp: gp, rawVal: gEl.value });
        }
        if (!courses.length || semCr <= 0) return null;
        var totCr = semCr;
        var totQp = semQp;
        var pCgpaEl = document.getElementById('priorCgpa');
        var pCrEl = document.getElementById('priorCredits');
        var pCgpa = pCgpaEl ? parseFloat(pCgpaEl.value) : NaN;
        var pCr = pCrEl ? parseFloat(pCrEl.value) : NaN;
        if (isFinite(pCr) && pCr > 0 && isFinite(pCgpa) && pCgpa >= 0 && pCgpa <= maxScale) {
          totCr += pCr;
          totQp += pCgpa * pCr;
        }
        var raw = totQp / totCr;
        var score = Math.round(raw * 100) / 100;
        return {
          mode: 'standard',
          scaleKey: scaleKey,
          rawScore: raw,
          score: score,
          maxScore: maxScale,
          totalCredits: totCr,
          band: zmGpaClassBand(raw, scaleKey) + ' (' + totCr + ' cr)',
          courses: courses
        };
      },
      getDefaultFriendItems: function (mode, studentCtx) {
        var scaleEl = document.getElementById('gpaScale');
        var sk = (studentCtx && studentCtx.scaleKey) || (scaleEl && scaleEl.value === 'std4' ? 'std4' : 'unza5');
        var gradeList = sk === 'std4' ? ZM_STD4_GRADES : ZM_UNZA5_GRADES;
        var opts = [{ value: '', label: 'Grade...' }].concat(gradeList.map(function (g) {
          return { value: g.value, label: g.label };
        }));
        var src = (studentCtx && studentCtx.courses && studentCtx.courses.length) ? studentCtx.courses : [
          { name: 'Course 1', credits: 4 }, { name: 'Course 2', credits: 4 },
          { name: 'Course 3', credits: 3 }, { name: 'Course 4', credits: 3 }
        ];
        return src.map(function (c, idx) {
          return {
            id: 'f_zmgpa_' + idx,
            name: c.name,
            tag: sk === 'std4' ? '4.0 Scale' : 'UNZA 5.0',
            type: 'dual-gpa',
            options: opts,
            val: '',
            aux: c.credits
          };
        });
      },
      getSampleFriendItems: function (mode, studentCtx) {
        var items = this.getDefaultFriendItems(mode, studentCtx);
        var sk = (studentCtx && studentCtx.scaleKey) || 'unza5';
        var sample = sk === 'std4' ? ['3.5', '3.0', '4.0', '3.0', '3.5'] : ['4.0', '3.0', '5.0', '3.0', '4.0'];
        for (var i = 0; i < items.length; i++) {
          items[i].val = sample[i % sample.length];
          if (!items[i].aux) items[i].aux = 4;
        }
        return items;
      },
      calculateFriend: function (items, mode, studentCtx) {
        var scaleEl = document.getElementById('gpaScale');
        var sk = (studentCtx && studentCtx.scaleKey) || (scaleEl && scaleEl.value === 'std4' ? 'std4' : 'unza5');
        var maxScale = sk === 'std4' ? 4.0 : 5.0;
        var totCr = 0;
        var totQp = 0;
        var filled = 0;
        for (var i = 0; i < items.length; i++) {
          var gp = parseFloat(items[i].val);
          var cr = (items[i].aux && isFinite(items[i].aux) && items[i].aux > 0) ? items[i].aux : 4;
          if (items[i].val !== '' && isFinite(gp)) {
            totCr += cr;
            totQp += gp * cr;
            filled++;
          }
        }
        if (!filled || totCr <= 0) return null;
        var raw = totQp / totCr;
        var sc = Math.round(raw * 100) / 100;
        return {
          score: sc,
          maxScore: maxScale,
          filledCount: filled,
          band: zmGpaClassBand(raw, sk) + ' (' + totCr + ' cr)'
        };
      },
      validateMessage: 'Select at least one course grade and credit value for your friend.',
      formatScore: function (val) {
        var scaleEl = document.getElementById('gpaScale');
        var maxS = (scaleEl && scaleEl.value === 'std4') ? '4.00' : '5.00';
        return val.toFixed(2) + ' / ' + maxS;
      },
      formatDiff: function (absDiff) { return absDiff.toFixed(2) + ' GPA points'; },
      getSvgConfig: function () {
        var scaleEl = document.getElementById('gpaScale');
        if (scaleEl && scaleEl.value === 'std4') {
          return {
            min: 0, max: 4.0, invert: false, leftLabel: '0.00', rightLabel: '4.00 Max',
            guides: [
              { pct: (3.30 / 4.0) * 100, label: '3.30 Merit', strong: false },
              { pct: (3.70 / 4.0) * 100, label: '3.70 Dist.', strong: true }
            ]
          };
        }
        return {
          min: 0, max: 5.0, invert: false, leftLabel: '0.00', rightLabel: '5.00 Max',
          guides: [
            { pct: (3.75 / 5.0) * 100, label: '3.75 Merit', strong: false },
            { pct: (4.50 / 5.0) * 100, label: '4.50 Dist.', strong: true }
          ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName) {
        var courses = studentCtx.courses;
        var gradeList = studentCtx.scaleKey === 'std4' ? ZM_STD4_GRADES : ZM_UNZA5_GRADES;
        var asc = gradeList.slice().reverse();
        var maxPt = studentCtx.maxScore;
        var bestIdx = 0;
        var bestPot = -1;
        for (var i = 0; i < courses.length; i++) {
          var pot = (maxPt - courses[i].gp) * courses[i].credits;
          if (pot > bestPot) {
            bestPot = pot;
            bestIdx = i;
          }
        }
        var chosen = courses[bestIdx];
        if (bestPot <= 0.01) {
          return {
            bestIndex: 0,
            suggestedSimVal: asc.length - 1,
            html: 'All entered courses are already at the maximum A+ grade point. Next step: sustain high continuous assessment (CA) marks in 4-credit full-year courses.'
          };
        }
        var curPos = 0;
        for (var k = 0; k < asc.length; k++) {
          if (Math.abs(asc[k].pts - chosen.gp) < 0.05) curPos = k;
        }
        var tgtPos = Math.min(asc.length - 1, curPos + 2);
        var tgtObj = asc[tgtPos];
        var gain = ((tgtObj.pts - chosen.gp) * chosen.credits) / studentCtx.totalCredits;
        var proj = Math.round((studentCtx.rawScore + gain) * 100) / 100;
        var vsNote = (studentCtx.score < friendCalc.score && proj >= friendCalc.score)
          ? ' and moves you ahead of ' + escapeHtml(friendName)
          : ' to reach <strong>' + escapeHtml(this.formatScore(proj)) + '</strong>';
        return {
          bestIndex: bestIdx,
          suggestedSimVal: tgtPos,
          html: '<strong>' + escapeHtml(chosen.name) + ' (' + chosen.credits + ' cr, ' + chosen.gp.toFixed(1) + ' pts)</strong> has your highest GPA leverage: raising it to <strong>' + tgtObj.code + ' (' + tgtObj.pts.toFixed(1) + ')</strong> adds <strong>+' + gain.toFixed(2) + ' GPA points</strong>' + vsNote + '. Next step: focus CA tests and lab reports on your highest-credit UNZA/CBU courses.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var courses = studentCtx.courses;
        var idx = clampNum(itemIndex, 0, courses.length - 1);
        var chosen = courses[idx];
        var gradeList = studentCtx.scaleKey === 'std4' ? ZM_STD4_GRADES : ZM_UNZA5_GRADES;
        var asc = gradeList.slice().reverse();
        var curPos = 0;
        for (var k = 0; k < asc.length; k++) {
          if (Math.abs(asc[k].pts - chosen.gp) < 0.05) curPos = k;
        }
        var maxIdx = asc.length - 1;
        var self = this;
        return {
          selectLabel: 'University Course',
          options: courses.map(function (c, i) {
            return { index: i, label: c.name + ' (' + c.credits + ' cr - now ' + c.gp.toFixed(1) + ' pts)' };
          }),
          sliderLabel: 'Target Course Grade',
          min: 0,
          max: maxIdx,
          step: 1,
          defaultVal: Math.min(maxIdx, curPos + 2),
          formatSliderVal: function (v) {
            var item = asc[v] || asc[maxIdx];
            return item.code + ' (' + item.pts.toFixed(1) + ' pts)';
          },
          simulate: function (v) {
            var item = asc[v] || asc[curPos];
            var delta = ((item.pts - chosen.gp) * chosen.credits) / studentCtx.totalCredits;
            var rawProj = clampNum(studentCtx.rawScore + delta, 0, studentCtx.maxScore);
            var proj = Math.round(rawProj * 100) / 100;
            return {
              projectedScore: proj,
              projectedDisplay: self.formatScore(proj) + ' (' + zmGpaClassBand(rawProj, studentCtx.scaleKey) + ')',
              changeDisplay: (delta >= 0 ? '+' : '') + delta.toFixed(2) + ' GPA',
              changeState: delta > 0.005 ? 'pos' : (delta < -0.005 ? 'neg' : '')
            };
          }
        };
      }
    },

    /* 33. TANZANIA UNIVERSITY GPA & CGPA CALCULATOR (TCU 5.0 SCALE) */
    'tanzania-university-gpa-calculator': {
      formId: 'gpaForm',
      resetIds: ['resetBtn', 'tabSemester', 'tabCgpa'],
      bannerDesc: 'Compare your TCU 5.0 university GPA or cumulative GPA and Honours degree class with a classmate.',
      emptyTitle: 'Calculate Your TCU University GPA First',
      emptyDesc: 'Enter your course credits and TCU grades above and calculate your GPA to compare with a classmate.',
      projectedLabel: 'Projected TCU GPA',
      higherIsBetter: true,
      tieEpsilon: 0.03,
      modes: [
        { id: 'standard', label: 'TCU 5.0 Course Grades' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var tabCgpa = document.getElementById('tabCgpa');
        var isCgpaTab = !!(tabCgpa && tabCgpa.classList.contains('active'));
        var containerSel = isCgpaTab ? '#coursesContainer2 .course-row' : '#coursesContainer .course-row';
        var rows = document.querySelectorAll(containerSel);
        var courses = [];
        var totCr = 0;
        var totQp = 0;
        for (var i = 0; i < rows.length; i++) {
          var nEl = rows[i].querySelector('.course-name');
          var cEl = rows[i].querySelector('.course-credits');
          var gEl = rows[i].querySelector('.course-grade');
          var cr = cEl ? parseFloat(cEl.value) : NaN;
          var gp = (gEl && gEl.value !== '') ? parseFloat(gEl.value) : NaN;
          if (!isFinite(cr) || cr <= 0 || !isFinite(gp) || gp < 0) continue;
          var nm = (nEl && nEl.value.trim()) ? nEl.value.trim() : ('Course ' + (courses.length + 1));
          totCr += cr;
          totQp += cr * gp;
          courses.push({ name: nm, credits: cr, gp: gp, rawVal: gEl.value });
        }
        if (isCgpaTab) {
          var pGpaEl = document.getElementById('prevCgpa');
          var pCrEl = document.getElementById('prevCredits');
          var pGpa = pGpaEl ? parseFloat(pGpaEl.value) : NaN;
          var pCr = pCrEl ? parseFloat(pCrEl.value) : NaN;
          if (isFinite(pGpa) && pGpa >= 0 && pGpa <= 5.0 && isFinite(pCr) && pCr > 0) {
            totCr += pCr;
            totQp += pGpa * pCr;
          }
        }
        if (!courses.length || totCr <= 0) return null;
        var raw = totQp / totCr;
        var score = Math.round(raw * 100) / 100;
        return {
          mode: 'standard',
          rawScore: raw,
          score: score,
          maxScore: 5.0,
          totalCredits: totCr,
          band: tzTcuGpaBand(raw) + ' (' + totCr + ' cr)',
          courses: courses
        };
      },
      getDefaultFriendItems: function (mode, studentCtx) {
        var opts = [{ value: '', label: 'Grade...' }].concat(TZ_TCU_GPA_GRADES.map(function (g) {
          return { value: g.value, label: g.label };
        }));
        var src = (studentCtx && studentCtx.courses && studentCtx.courses.length) ? studentCtx.courses : [
          { name: 'Course 1', credits: 12 }, { name: 'Course 2', credits: 12 },
          { name: 'Course 3', credits: 12 }, { name: 'Course 4', credits: 12 }
        ];
        return src.map(function (c, idx) {
          return {
            id: 'f_tzgpa_' + idx,
            name: c.name,
            tag: 'TCU 5.0',
            type: 'dual-gpa',
            options: opts,
            val: '',
            aux: c.credits
          };
        });
      },
      getSampleFriendItems: function (mode, studentCtx) {
        var items = this.getDefaultFriendItems(mode, studentCtx);
        var sample = ['4.0', '5.0', '3.0', '4.0', '4.0', '3.0'];
        for (var i = 0; i < items.length; i++) {
          items[i].val = sample[i % sample.length];
          if (!items[i].aux) items[i].aux = 12;
        }
        return items;
      },
      calculateFriend: function (items) {
        var totCr = 0;
        var totQp = 0;
        var filled = 0;
        for (var i = 0; i < items.length; i++) {
          var gp = parseFloat(items[i].val);
          var cr = (items[i].aux && isFinite(items[i].aux) && items[i].aux > 0) ? items[i].aux : 12;
          if (items[i].val !== '' && isFinite(gp)) {
            totCr += cr;
            totQp += gp * cr;
            filled++;
          }
        }
        if (!filled || totCr <= 0) return null;
        var raw = totQp / totCr;
        var sc = Math.round(raw * 100) / 100;
        return {
          score: sc,
          maxScore: 5.0,
          filledCount: filled,
          band: tzTcuGpaBand(raw) + ' (' + totCr + ' cr)'
        };
      },
      validateMessage: 'Select at least one TCU course grade and credit weight for your friend.',
      formatScore: function (val) { return val.toFixed(2) + ' / 5.00'; },
      formatDiff: function (absDiff) { return absDiff.toFixed(2) + ' GPA points'; },
      getSvgConfig: function () {
        return {
          min: 0, max: 5.0, invert: false, leftLabel: '0.00', rightLabel: '5.00 Max',
          guides: [
            { pct: (3.50 / 5.0) * 100, label: '3.50 2:1', strong: false },
            { pct: (4.40 / 5.0) * 100, label: '4.40 1st', strong: true }
          ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName) {
        var courses = studentCtx.courses;
        var asc = TZ_TCU_GPA_GRADES.slice().reverse();
        var bestIdx = 0;
        var bestPot = -1;
        for (var i = 0; i < courses.length; i++) {
          var pot = (5.0 - courses[i].gp) * courses[i].credits;
          if (pot > bestPot) {
            bestPot = pot;
            bestIdx = i;
          }
        }
        var chosen = courses[bestIdx];
        if (bestPot <= 0.01) {
          return {
            bestIndex: 0,
            suggestedSimVal: asc.length - 1,
            html: 'Every entered TCU module is already at Grade A (5.00). Next step: keep your coursework (40%) and University Examination (60%) above 70% across core modules.'
          };
        }
        var curPos = 0;
        for (var k = 0; k < asc.length; k++) {
          if (Math.abs(asc[k].pts - chosen.gp) < 0.05) curPos = k;
        }
        var tgtPos = Math.min(asc.length - 1, curPos + 1);
        var tgtObj = asc[tgtPos];
        var gain = ((tgtObj.pts - chosen.gp) * chosen.credits) / studentCtx.totalCredits;
        var proj = Math.round((studentCtx.rawScore + gain) * 100) / 100;
        var vsNote = (studentCtx.score < friendCalc.score && proj >= friendCalc.score)
          ? ' and moves you ahead of ' + escapeHtml(friendName)
          : ' to reach <strong>' + proj.toFixed(2) + ' / 5.00</strong>';
        return {
          bestIndex: bestIdx,
          suggestedSimVal: tgtPos,
          html: '<strong>' + escapeHtml(chosen.name) + ' (' + chosen.credits + ' cr, ' + chosen.gp.toFixed(1) + ' pts)</strong> carries your largest TCU GPA upside: lifting it to <strong>' + tgtObj.code + ' (' + tgtObj.pts.toFixed(1) + ')</strong> adds <strong>+' + gain.toFixed(2) + ' GPA points</strong>' + vsNote + '. Next step: aim for 28+/40 in coursework before sitting the 60-mark UE paper.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var courses = studentCtx.courses;
        var idx = clampNum(itemIndex, 0, courses.length - 1);
        var chosen = courses[idx];
        var asc = TZ_TCU_GPA_GRADES.slice().reverse();
        var curPos = 0;
        for (var k = 0; k < asc.length; k++) {
          if (Math.abs(asc[k].pts - chosen.gp) < 0.05) curPos = k;
        }
        var maxIdx = asc.length - 1;
        return {
          selectLabel: 'TCU Course Module',
          options: courses.map(function (c, i) {
            return { index: i, label: c.name + ' (' + c.credits + ' cr - now ' + c.gp.toFixed(1) + ' pts)' };
          }),
          sliderLabel: 'Target TCU Grade',
          min: 0,
          max: maxIdx,
          step: 1,
          defaultVal: Math.min(maxIdx, curPos + 1),
          formatSliderVal: function (v) {
            var item = asc[v] || asc[maxIdx];
            return item.code + ' (' + item.pts.toFixed(1) + ' pts)';
          },
          simulate: function (v) {
            var item = asc[v] || asc[curPos];
            var delta = ((item.pts - chosen.gp) * chosen.credits) / studentCtx.totalCredits;
            var rawProj = clampNum(studentCtx.rawScore + delta, 0, 5.0);
            var proj = Math.round(rawProj * 100) / 100;
            return {
              projectedScore: proj,
              projectedDisplay: proj.toFixed(2) + ' / 5.00 (' + tzTcuGpaBand(rawProj) + ')',
              changeDisplay: (delta >= 0 ? '+' : '') + delta.toFixed(2) + ' GPA',
              changeState: delta > 0.005 ? 'pos' : (delta < -0.005 ? 'neg' : '')
            };
          }
        };
      }
    },

    /* 34. ZIMBABWE UNIVERSITY ENTRY POINTS CALCULATOR (UZ / NUST / MSU / HIT) */
    'zimbabwe-university-entry-points-calculator': {
      formId: 'uniForm',
      resetIds: ['resetBtn'],
      bannerDesc: 'Compare your 3-subject ZIMSEC / Cambridge A-Level entry points (out of 15) and Conventional vs Parallel admission standing with a friend.',
      emptyTitle: 'Calculate Your Entry Points First',
      emptyDesc: 'Select your target Zimbabwe university, faculty, and three A-Level grades above to compare with a friend.',
      projectedLabel: 'Projected Entry Points',
      higherIsBetter: true,
      tieEpsilon: 0.1,
      modes: [
        { id: 'standard', label: '3 A-Level Principal Subjects' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var facEl = document.getElementById('targetFaculty');
        var facKey = (facEl && ZW_UNI_FACULTIES[facEl.value]) ? facEl.value : 'commerce';
        var fac = ZW_UNI_FACULTIES[facKey];
        var ids = ['sub1', 'sub2', 'sub3'];
        var subjects = [];
        var total = 0;
        var passes = 0;
        for (var i = 0; i < ids.length; i++) {
          var el = document.getElementById(ids[i]);
          var g = (el && ZW_ALEVEL_PTS[el.value] !== undefined) ? el.value : 'C';
          var p = ZW_ALEVEL_PTS[g];
          total += p;
          if (p >= 1) passes++;
          subjects.push({ id: ids[i], name: 'Principal Subject ' + (i + 1), grade: g, pts: p });
        }
        var chkEng = document.getElementById('chkEng');
        var chk5 = document.getElementById('chk5');
        var statutoryOk = passes >= 2 && (!chkEng || chkEng.checked) && (!chk5 || chk5.checked);
        return {
          mode: 'standard',
          facKey: facKey,
          fac: fac,
          statutoryOk: statutoryOk,
          score: total,
          maxScore: 15,
          band: zwUniRouteBand(total, passes, statutoryOk, fac),
          subjects: subjects
        };
      },
      getDefaultFriendItems: function () {
        var opts = [{ value: '', label: 'Select A-Level grade...' }].concat(ZW_ALEVEL_GRADES.map(function (g) {
          return { value: g.value, label: g.label };
        }));
        return [0, 1, 2].map(function (idx) {
          return {
            id: 'f_zwuni_' + idx,
            name: 'Principal Subject ' + (idx + 1),
            tag: 'Max 5 pts',
            type: 'select',
            options: opts,
            val: ''
          };
        });
      },
      getSampleFriendItems: function () {
        var items = this.getDefaultFriendItems();
        var sample = ['B', 'B', 'C'];
        for (var i = 0; i < items.length; i++) items[i].val = sample[i];
        return items;
      },
      calculateFriend: function (items, mode, studentCtx) {
        var facEl = document.getElementById('targetFaculty');
        var facKey = (studentCtx && studentCtx.facKey) || (facEl && ZW_UNI_FACULTIES[facEl.value] ? facEl.value : 'commerce');
        var fac = ZW_UNI_FACULTIES[facKey];
        var tot = 0;
        var passes = 0;
        var filled = 0;
        for (var i = 0; i < items.length; i++) {
          var g = items[i].val;
          if (g && ZW_ALEVEL_PTS[g] !== undefined) {
            var p = ZW_ALEVEL_PTS[g];
            tot += p;
            if (p >= 1) passes++;
            filled++;
          }
        }
        if (filled < 3) return null;
        return {
          score: tot,
          maxScore: 15,
          filledCount: filled,
          band: zwUniRouteBand(tot, passes, passes >= 2, fac)
        };
      },
      validateMessage: 'Select all three A-Level Principal Subject grades for your friend.',
      formatScore: function (val) { return Math.round(val) + ' / 15 pts'; },
      formatDiff: function (absDiff) {
        var d = Math.round(absDiff);
        return d + (d === 1 ? ' point' : ' points');
      },
      getSvgConfig: function () {
        var facEl = document.getElementById('targetFaculty');
        var facKey = (facEl && ZW_UNI_FACULTIES[facEl.value]) ? facEl.value : 'commerce';
        var fac = ZW_UNI_FACULTIES[facKey];
        return {
          min: 0, max: 15, invert: false, leftLabel: '0 pts', rightLabel: '15 pts Max',
          guides: [
            { pct: (fac.par / 15) * 100, label: fac.par + ' Parallel', strong: false },
            { pct: (fac.min / 15) * 100, label: fac.min + ' Conv.', strong: true }
          ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName) {
        var subs = studentCtx.subjects;
        var asc = ZW_ALEVEL_GRADES.slice().reverse();
        var bestIdx = 0;
        var minPts = 99;
        for (var i = 0; i < subs.length; i++) {
          if (subs[i].pts < minPts) {
            minPts = subs[i].pts;
            bestIdx = i;
          }
        }
        var chosen = subs[bestIdx];
        if (chosen.pts >= 5) {
          return {
            bestIndex: 0,
            suggestedSimVal: asc.length - 1,
            html: 'You already hold the maximum 15/15 A-Level points (AAA). Next step: confirm O-Level English, Mathematics, and faculty subject prerequisites before submitting your Conventional intake application.'
          };
        }
        var curPos = 0;
        for (var k = 0; k < asc.length; k++) {
          if (asc[k].value === chosen.grade) curPos = k;
        }
        var tgtPos = Math.min(asc.length - 1, curPos + 1);
        if (asc[tgtPos].pts <= chosen.pts && tgtPos < asc.length - 1) tgtPos++;
        var tgtObj = asc[tgtPos];
        var gain = tgtObj.pts - chosen.pts;
        var proj = studentCtx.score + gain;
        var routeNote = (studentCtx.score < studentCtx.fac.min && proj >= studentCtx.fac.min)
          ? ' and qualifies you for <strong>' + escapeHtml(studentCtx.fac.name) + ' Conventional intake (' + studentCtx.fac.min + ' pts)</strong>'
          : ((studentCtx.score < friendCalc.score && proj >= friendCalc.score)
            ? ' and moves you ahead of ' + escapeHtml(friendName)
            : ' to reach <strong>' + proj + ' / 15 pts</strong>');
        return {
          bestIndex: bestIdx,
          suggestedSimVal: tgtPos,
          html: '<strong>' + escapeHtml(chosen.name) + ' (Grade ' + chosen.grade + ', ' + chosen.pts + ' pts)</strong> has your widest A-Level points upside: lifting it to <strong>Grade ' + tgtObj.value + ' (' + tgtObj.pts + ' pts)</strong> adds <strong>+' + gain + (gain === 1 ? ' point' : ' points') + '</strong>' + routeNote + '. Next step: drill ZIMSEC structured Paper 2 and practical questions in this principal subject.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var subs = studentCtx.subjects;
        var idx = clampNum(itemIndex, 0, subs.length - 1);
        var chosen = subs[idx];
        var asc = ZW_ALEVEL_GRADES.slice().reverse();
        var curPos = 0;
        for (var k = 0; k < asc.length; k++) {
          if (asc[k].value === chosen.grade) curPos = k;
        }
        var maxIdx = asc.length - 1;
        return {
          selectLabel: 'A-Level Principal Subject',
          options: subs.map(function (s, i) {
            return { index: i, label: s.name + ' (now Grade ' + s.grade + ' - ' + s.pts + ' pts)' };
          }),
          sliderLabel: 'Simulated A-Level Grade',
          min: 0,
          max: maxIdx,
          step: 1,
          defaultVal: Math.min(maxIdx, curPos + 1),
          formatSliderVal: function (v) {
            var item = asc[v] || asc[maxIdx];
            return 'Grade ' + item.value + ' (' + item.pts + ' pts)';
          },
          simulate: function (v) {
            var item = asc[v] || asc[curPos];
            var delta = item.pts - chosen.pts;
            var proj = studentCtx.score + delta;
            var passes = 0;
            for (var j = 0; j < subs.length; j++) {
              var p = (j === idx) ? item.pts : subs[j].pts;
              if (p >= 1) passes++;
            }
            var band = zwUniRouteBand(proj, passes, passes >= 2 && studentCtx.statutoryOk, studentCtx.fac);
            return {
              projectedScore: proj,
              projectedDisplay: proj + ' / 15 pts (' + band + ')',
              changeDisplay: (delta >= 0 ? '+' : '') + delta + ' pts',
              changeState: delta > 0 ? 'pos' : (delta < 0 ? 'neg' : '')
            };
          }
        };
      }
    },

    /* 35. ZAMBIA UNIVERSITY ADMISSION POINTS CALCULATOR (ECZ BEST 5, LOWER IS BETTER) */
    'zambia-university-admission-calculator': {
      formId: 'zmForm',
      resetIds: ['zmReset'],
      bannerDesc: 'Compare your ECZ Grade 12 Best-5 university admission points (5 to 45, lower is stronger) and UNZA / CBU cut-off standing with a friend.',
      emptyTitle: 'Calculate Your ECZ Best-5 Points First',
      emptyDesc: 'Enter your Grade 12 ECZ subject grades above and calculate your admission points to compare with a friend.',
      projectedLabel: 'Projected Best-5 Points',
      higherIsBetter: false,
      tieEpsilon: 0.1,
      modes: [
        { id: 'subjects', label: 'ECZ Subject Grades (1-9)' },
        { id: 'aggregate', label: 'Direct Best-5 Points (5-45)' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var defs = [
          { id: 'zmEnglish', name: 'English Language', req: true },
          { id: 'zmMaths', name: 'Mathematics', req: true },
          { id: 'zmBiology', name: 'Biology / Agric Science', req: false },
          { id: 'zmScience', name: 'Science (Phys / Chem)', req: false },
          { id: 'zmSubj5', name: 'Subject 5', req: false },
          { id: 'zmSubj6', name: 'Subject 6', req: false },
          { id: 'zmSubj7', name: 'Subject 7', req: false }
        ];
        var subjects = [];
        for (var i = 0; i < defs.length; i++) {
          var el = document.getElementById(defs[i].id);
          if (!el || !el.value) continue;
          var g = parseInt(el.value, 10);
          if (isFinite(g) && g >= 1 && g <= 9) {
            subjects.push({ id: defs[i].id, name: defs[i].name, grade: g });
          }
        }
        if (subjects.length < 5) return null;
        var engObj = subjects[0];
        var rest = subjects.slice(1).map(function (s) { return s.grade; }).sort(function (a, b) { return a - b; });
        var best5 = engObj.grade + rest[0] + rest[1] + rest[2] + rest[3];
        var creditsCount = subjects.filter(function (s) { return s.grade <= 6; }).length;
        return {
          mode: 'subjects',
          score: best5,
          maxScore: 45,
          creditsCount: creditsCount,
          band: zmAdmissionBand(best5, creditsCount, engObj.grade),
          subjects: subjects
        };
      },
      getDefaultFriendItems: function (mode, studentCtx) {
        if (mode === 'aggregate') {
          return [{
            id: 'f_zmadm_agg',
            name: 'ECZ Best-5 Points',
            tag: '5 best - 45',
            type: 'number',
            min: 5,
            max: 45,
            suffix: 'pts',
            placeholder: 'e.g. 12',
            val: null
          }];
        }
        var opts = [{ value: '', label: 'ECZ Grade...' }].concat(ZM_ECZ_GRADES.map(function (g) {
          return { value: g.value, label: g.label };
        }));
        var src = (studentCtx && studentCtx.subjects && studentCtx.subjects.length >= 5) ? studentCtx.subjects : [
          { name: 'English Language' }, { name: 'Mathematics' }, { name: 'Biology / Agric Science' },
          { name: 'Science (Phys / Chem)' }, { name: 'Subject 5' }, { name: 'Subject 6' }
        ];
        return src.map(function (s, idx) {
          return {
            id: 'f_zmadm_' + idx,
            name: s.name,
            tag: idx === 0 ? 'Compulsory' : '1-9 Scale',
            type: 'select',
            options: opts,
            val: ''
          };
        });
      },
      getSampleFriendItems: function (mode, studentCtx) {
        var items = this.getDefaultFriendItems(mode, studentCtx);
        if (mode === 'aggregate') {
          items[0].val = 12;
          return items;
        }
        var sample = ['2', '2', '3', '2', '3', '4', '4'];
        for (var i = 0; i < items.length; i++) items[i].val = sample[i % sample.length];
        return items;
      },
      calculateFriend: function (items, mode) {
        if (mode === 'aggregate') {
          var v = items[0] ? items[0].val : null;
          if (v === null || !isFinite(v)) return null;
          var agg = Math.round(clampNum(v, 5, 45));
          return {
            score: agg,
            maxScore: 45,
            filledCount: 1,
            band: zmAdmissionBand(agg, agg <= 30 ? 5 : 4, agg <= 30 ? 4 : 7)
          };
        }
        var grades = [];
        var engG = null;
        for (var i = 0; i < items.length; i++) {
          var g = parseInt(items[i].val, 10);
          if (isFinite(g) && g >= 1 && g <= 9) {
            if (i === 0) engG = g;
            grades.push(g);
          }
        }
        if (grades.length < 5) return null;
        var compEng = engG !== null ? engG : grades[0];
        var others = (engG !== null ? grades.slice(1) : grades.slice(1)).sort(function (a, b) { return a - b; });
        var best5 = compEng + others[0] + others[1] + others[2] + others[3];
        var crCount = grades.filter(function (x) { return x <= 6; }).length;
        return {
          score: best5,
          maxScore: 45,
          filledCount: grades.length,
          band: zmAdmissionBand(best5, crCount, compEng)
        };
      },
      validateMessage: 'Enter at least 5 ECZ subject grades (including English) or a direct Best-5 points total (5-45).',
      formatScore: function (val) { return Math.round(val) + ' pts'; },
      formatDiff: function (absDiff) {
        var d = Math.round(absDiff);
        return d + (d === 1 ? ' point' : ' points');
      },
      getSvgConfig: function () {
        return {
          min: 5,
          max: 45,
          invert: true,
          leftLabel: '45 Weakest',
          rightLabel: '5 Best (Five 1s)',
          guides: [
            { pct: ((45 - 18) / 40) * 100, label: '18 Degree', strong: false },
            { pct: ((45 - 12) / 40) * 100, label: '12 UNZA STEM', strong: true }
          ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName) {
        var subs = studentCtx.subjects;
        // Compute actual Best-5 reduction for improving each subject to Grade 1
        var bestIdx = 0;
        var bestDrop = -1;
        for (var i = 0; i < subs.length; i++) {
          var testGrades = subs.map(function (s, idx) { return idx === i ? 1 : s.grade; });
          var testOthers = testGrades.slice(1).sort(function (a, b) { return a - b; });
          var testBest5 = testGrades[0] + testOthers[0] + testOthers[1] + testOthers[2] + testOthers[3];
          var drop = studentCtx.score - testBest5 + (i === 0 ? 0.25 : 0);
          if (drop > bestDrop) {
            bestDrop = drop;
            bestIdx = i;
          }
        }
        var chosen = subs[bestIdx];
        if (studentCtx.score <= 5) {
          return {
            bestIndex: 0,
            suggestedSimVal: 8,
            html: 'Your Best-5 total is already 5 points (five Distinction 1s) — the maximum UNZA / CBU score. Next step: apply early for HELSB student loans and first-choice quota programmes.'
          };
        }
        var tgtGrade = Math.max(1, chosen.grade - 2);
        var simGrades = subs.map(function (s, idx) { return idx === bestIdx ? tgtGrade : s.grade; });
        var simOthers = simGrades.slice(1).sort(function (a, b) { return a - b; });
        var newBest5 = simGrades[0] + simOthers[0] + simOthers[1] + simOthers[2] + simOthers[3];
        var saved = studentCtx.score - newBest5;
        var sliderVal = ECZ_SLIDER_ORDER.indexOf(tgtGrade);
        var vsNote = (studentCtx.score > friendCalc.score && newBest5 <= friendCalc.score)
          ? ' and moves you ahead of ' + escapeHtml(friendName)
          : ' to reach <strong>' + newBest5 + ' Best-5 points</strong>';
        return {
          bestIndex: bestIdx,
          suggestedSimVal: sliderVal !== -1 ? sliderVal : 7,
          html: '<strong>' + escapeHtml(chosen.name) + ' (Grade ' + chosen.grade + ')</strong> gives your biggest Best-5 reduction: improving it to <strong>Grade ' + tgtGrade + '</strong> cuts <strong>' + saved + (saved === 1 ? ' point' : ' points') + '</strong>' + vsNote + '. Next step: prioritise ECZ past-paper structured sections in ' + escapeHtml(chosen.name) + '.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var subs = studentCtx.subjects;
        var idx = clampNum(itemIndex, 0, subs.length - 1);
        var chosen = subs[idx];
        var curPos = Math.max(0, ECZ_SLIDER_ORDER.indexOf(chosen.grade));
        return {
          selectLabel: 'ECZ Grade 12 Subject',
          options: subs.map(function (s, i) {
            return { index: i, label: s.name + ' (now Grade ' + s.grade + ')' };
          }),
          sliderLabel: 'Simulated ECZ Grade (9 to 1)',
          min: 0,
          max: 8,
          step: 1,
          defaultVal: Math.min(8, curPos + 2),
          formatSliderVal: function (v) {
            var g = ECZ_SLIDER_ORDER[v] || 1;
            return 'Grade ' + g + ' (' + g + (g === 1 ? ' pt)' : ' pts)');
          },
          simulate: function (v) {
            var g = ECZ_SLIDER_ORDER[v] || chosen.grade;
            var newGrades = subs.map(function (s, i) { return i === idx ? g : s.grade; });
            var others = newGrades.slice(1).sort(function (a, b) { return a - b; });
            var proj = newGrades[0] + others[0] + others[1] + others[2] + others[3];
            var crCount = newGrades.filter(function (x) { return x <= 6; }).length;
            var diff = proj - studentCtx.score;
            return {
              projectedScore: proj,
              projectedDisplay: proj + ' pts (' + zmAdmissionBand(proj, crCount, newGrades[0]) + ')',
              changeDisplay: (diff > 0 ? '+' : '') + diff + ' pts',
              changeState: diff < 0 ? 'pos' : (diff > 0 ? 'neg' : '')
            };
          }
        };
      }
    },

    /* 36. TANZANIA UNIVERSITY ADMISSION POINTS CALCULATOR (TCU ACSEE & NACTVET DIPLOMA) */
    'tanzania-university-admission-calculator': {
      formId: 'tzForm',
      resetIds: ['modeAcsee', 'modeDiploma'],
      bannerDesc: 'Compare your TCU Form Six (ACSEE) admission points (out of 15.0) or NACTVET Diploma GPA (out of 5.00) and degree eligibility with a friend.',
      emptyTitle: 'Calculate Your TCU Admission Standing First',
      emptyDesc: 'Select your Form Six ACSEE grades or NACTVET Diploma GPA above and calculate to compare with a friend.',
      projectedLabel: 'Projected TCU Standing',
      higherIsBetter: true,
      tieEpsilon: 0.05,
      modes: [
        { id: 'acsee', label: 'Form Six ACSEE (0-15 pts)' },
        { id: 'diploma', label: 'Diploma Route (0-5.0 GPA)' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var dipBtn = document.getElementById('modeDiploma');
        var isDiploma = !!(dipBtn && dipBtn.classList.contains('active'));
        var facEl = document.getElementById('tzFaculty');
        var facCode = (facEl && facEl.value) ? facEl.value : 'ENG';
        if (isDiploma) {
          var gpaEl = document.getElementById('tzDipGpa');
          var gpa = gpaEl ? parseFloat(gpaEl.value) : NaN;
          if (!isFinite(gpa) || gpa < 0 || gpa > 5.0) return null;
          var scGpa = Math.round(gpa * 100) / 100;
          return {
            mode: 'diploma',
            facCode: facCode,
            dipGpa: scGpa,
            score: scGpa,
            maxScore: 5.0,
            band: tzAdmissionDiplomaBand(scGpa)
          };
        }
        var ids = ['tzSub1', 'tzSub2', 'tzSub3'];
        var subjects = [];
        var total = 0;
        var ptsArr = [];
        for (var i = 0; i < ids.length; i++) {
          var el = document.getElementById(ids[i]);
          var g = (el && TZ_ACSEE_ADM_PTS[el.value] !== undefined) ? el.value : 'C';
          var p = TZ_ACSEE_ADM_PTS[g];
          total += p;
          ptsArr.push(p);
          subjects.push({ id: ids[i], name: 'Principal Subject ' + (i + 1), grade: g, pts: p });
        }
        var scPts = Math.round(total * 10) / 10;
        return {
          mode: 'acsee',
          facCode: facCode,
          score: scPts,
          maxScore: 15.0,
          band: tzAdmissionAcseeBand(scPts, ptsArr, facCode),
          subjects: subjects
        };
      },
      getComparableStudentScore: function (studentCtx, friendMode) {
        if (studentCtx.mode === friendMode) {
          return { score: studentCtx.score, maxScore: studentCtx.maxScore, band: studentCtx.band };
        }
        if (friendMode === 'diploma') {
          var eqGpa = Math.round((studentCtx.score / 3.0) * 100) / 100;
          return { score: eqGpa, maxScore: 5.0, band: studentCtx.band };
        }
        var eqPts = Math.round(studentCtx.score * 3.0 * 10) / 10;
        return { score: eqPts, maxScore: 15.0, band: studentCtx.band };
      },
      getDefaultFriendItems: function (mode) {
        if (mode === 'diploma') {
          return [{
            id: 'f_tz_dip',
            name: 'NACTVET Diploma GPA',
            tag: 'TCU 3.00+ min',
            type: 'number',
            min: 0,
            max: 5.0,
            suffix: '/5.0',
            placeholder: 'e.g. 3.60',
            val: null
          }];
        }
        var opts = [{ value: '', label: 'Select ACSEE grade...' }].concat(TZ_ACSEE_ADM_GRADES.map(function (g) {
          return { value: g.value, label: g.label };
        }));
        return [0, 1, 2].map(function (idx) {
          return {
            id: 'f_tz_sub' + idx,
            name: 'Principal Subject ' + (idx + 1),
            tag: 'Max 5.0 pts',
            type: 'select',
            options: opts,
            val: ''
          };
        });
      },
      getSampleFriendItems: function (mode) {
        var items = this.getDefaultFriendItems(mode);
        if (mode === 'diploma') {
          items[0].val = 3.65;
          return items;
        }
        var sample = ['B', 'B', 'C'];
        for (var i = 0; i < items.length; i++) items[i].val = sample[i];
        return items;
      },
      calculateFriend: function (items, mode, studentCtx) {
        var facCode = (studentCtx && studentCtx.facCode) ? studentCtx.facCode : 'ENG';
        if (mode === 'diploma') {
          var v = items[0] ? items[0].val : null;
          if (v === null || !isFinite(v)) return null;
          var gpa = Math.round(clampNum(v, 0, 5.0) * 100) / 100;
          return {
            score: gpa,
            maxScore: 5.0,
            filledCount: 1,
            band: tzAdmissionDiplomaBand(gpa)
          };
        }
        var tot = 0;
        var ptsArr = [];
        var filled = 0;
        for (var i = 0; i < items.length; i++) {
          var g = items[i].val;
          if (g && TZ_ACSEE_ADM_PTS[g] !== undefined) {
            var p = TZ_ACSEE_ADM_PTS[g];
            tot += p;
            ptsArr.push(p);
            filled++;
          }
        }
        if (filled < 3) return null;
        var sc = Math.round(tot * 10) / 10;
        return {
          score: sc,
          maxScore: 15.0,
          filledCount: filled,
          band: tzAdmissionAcseeBand(sc, ptsArr, facCode)
        };
      },
      validateMessage: 'Select all 3 Form Six ACSEE grades (or enter a NACTVET Diploma GPA) for your friend.',
      formatScore: function (val) {
        if (compareState.friendMode === 'diploma') return val.toFixed(2) + ' GPA';
        return val.toFixed(1) + ' / 15.0 pts';
      },
      formatDiff: function (absDiff) {
        if (compareState.friendMode === 'diploma') return absDiff.toFixed(2) + ' GPA points';
        return absDiff.toFixed(1) + ' TCU points';
      },
      getSvgConfig: function (mode) {
        if (mode === 'diploma') {
          return {
            min: 0, max: 5.0, invert: false, leftLabel: '0.00', rightLabel: '5.00 Max',
            guides: [
              { pct: (3.0 / 5.0) * 100, label: '3.00 TCU Min', strong: true },
              { pct: (4.0 / 5.0) * 100, label: '4.00 Strong', strong: false }
            ]
          };
        }
        return {
          min: 0, max: 15.0, invert: false, leftLabel: '0.0 pts', rightLabel: '15.0 Max',
          guides: [
            { pct: (4.0 / 15.0) * 100, label: '4.0 TCU Min', strong: false },
            { pct: (10.0 / 15.0) * 100, label: '10.0 UDSM', strong: true }
          ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName, studentComp) {
        if (studentCtx.mode === 'diploma') {
          var cur = studentCtx.dipGpa;
          if (cur >= 4.9) {
            return {
              bestIndex: 0,
              suggestedSimVal: 5.0,
              html: 'Your NACTVET Diploma GPA is already near the 5.00 ceiling. Next step: verify your NACTVET Award Verification Number (AVN) early before the TCU Round 1 application window opens.'
            };
          }
          var tgt = Math.min(5.0, Math.round((cur < 3.0 ? 3.20 : cur + 0.40) * 100) / 100);
          var gain = tgt - cur;
          return {
            bestIndex: 0,
            suggestedSimVal: tgt,
            html: 'Raising your <strong>NACTVET Diploma GPA (' + cur.toFixed(2) + ')</strong> to <strong>' + tgt.toFixed(2) + '</strong> adds <strong>+' + gain.toFixed(2) + ' GPA points</strong> toward TCU degree selection (minimum 3.00 Second Class, 3.80+ for high-demand UDSM/MUHAS programmes). Next step: prioritise final-semester project and core NTA Level 6 modules.'
          };
        }
        var subs = studentCtx.subjects;
        var asc = TZ_ACSEE_ADM_GRADES.slice().reverse();
        var bestIdx = 0;
        var minP = 99;
        for (var i = 0; i < subs.length; i++) {
          if (subs[i].pts < minP) {
            minP = subs[i].pts;
            bestIdx = i;
          }
        }
        var chosen = subs[bestIdx];
        if (chosen.pts >= 5.0) {
          return {
            bestIndex: 0,
            suggestedSimVal: asc.length - 1,
            html: 'You already hold the maximum 15.0 TCU points (AAA). Next step: submit high-priority UDSM/MUHAS programme codes in Round 1 and confirm HESLB loan documentation.'
          };
        }
        var curPos = 0;
        for (var k = 0; k < asc.length; k++) {
          if (asc[k].value === chosen.grade) curPos = k;
        }
        var tgtPos = Math.min(asc.length - 1, curPos + 1);
        var tgtObj = asc[tgtPos];
        var gainPts = tgtObj.pts - chosen.pts;
        var projPts = studentCtx.score + gainPts;
        var vsNote = (studentComp.score < friendCalc.score && (compareState.friendMode === 'diploma' ? projPts / 3.0 : projPts) >= friendCalc.score)
          ? ' and moves you ahead of ' + escapeHtml(friendName)
          : ' to reach <strong>' + projPts.toFixed(1) + ' / 15.0 TCU points</strong>';
        return {
          bestIndex: bestIdx,
          suggestedSimVal: tgtPos,
          html: '<strong>' + escapeHtml(chosen.name) + ' (Grade ' + chosen.grade + ', ' + chosen.pts.toFixed(1) + ' pts)</strong> is your highest-value ACSEE subject to lift: reaching <strong>Grade ' + tgtObj.value + ' (' + tgtObj.pts.toFixed(1) + ' pts)</strong> adds <strong>+' + gainPts.toFixed(1) + ' TCU points</strong>' + vsNote + '. Next step: focus revision on NECTA Paper 1 & 2 high-frequency topics.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        if (studentCtx.mode === 'diploma') {
          var cur = studentCtx.dipGpa;
          return {
            selectLabel: 'Qualification Track',
            options: [{ index: 0, label: 'NACTVET Diploma GPA (now ' + cur.toFixed(2) + ')' }],
            sliderLabel: 'Simulated Diploma GPA',
            min: 2.0,
            max: 5.0,
            step: 0.05,
            defaultVal: Math.min(5.0, Math.max(3.2, Math.round((cur + 0.35) * 20) / 20)),
            formatSliderVal: function (v) { return v.toFixed(2) + ' GPA'; },
            simulate: function (v) {
              var proj = Math.round(v * 100) / 100;
              var diff = proj - cur;
              var compProj = compareState.friendMode === 'acsee' ? proj * 3.0 : proj;
              return {
                projectedScore: compProj,
                projectedDisplay: proj.toFixed(2) + ' GPA (' + tzAdmissionDiplomaBand(proj) + ')',
                changeDisplay: (diff >= 0 ? '+' : '') + diff.toFixed(2) + ' GPA',
                changeState: diff > 0.005 ? 'pos' : (diff < -0.005 ? 'neg' : '')
              };
            }
          };
        }
        var subs = studentCtx.subjects;
        var idx = clampNum(itemIndex, 0, subs.length - 1);
        var chosen = subs[idx];
        var asc = TZ_ACSEE_ADM_GRADES.slice().reverse();
        var curPos = 0;
        for (var k = 0; k < asc.length; k++) {
          if (asc[k].value === chosen.grade) curPos = k;
        }
        var maxIdx = asc.length - 1;
        return {
          selectLabel: 'ACSEE Principal Subject',
          options: subs.map(function (s, i) {
            return { index: i, label: s.name + ' (now Grade ' + s.grade + ' - ' + s.pts.toFixed(1) + ' pts)' };
          }),
          sliderLabel: 'Simulated NECTA Grade',
          min: 0,
          max: maxIdx,
          step: 1,
          defaultVal: Math.min(maxIdx, curPos + 1),
          formatSliderVal: function (v) {
            var item = asc[v] || asc[maxIdx];
            return 'Grade ' + item.value + ' (' + item.pts.toFixed(1) + ' pts)';
          },
          simulate: function (v) {
            var item = asc[v] || asc[curPos];
            var delta = item.pts - chosen.pts;
            var proj = studentCtx.score + delta;
            var ptsArr = subs.map(function (s, i) { return i === idx ? item.pts : s.pts; });
            var band = tzAdmissionAcseeBand(proj, ptsArr, studentCtx.facCode);
            var compProj = compareState.friendMode === 'diploma' ? (proj / 3.0) : proj;
            return {
              projectedScore: compProj,
              projectedDisplay: proj.toFixed(1) + ' / 15.0 pts (' + band + ')',
              changeDisplay: (delta >= 0 ? '+' : '') + delta.toFixed(1) + ' pts',
              changeState: delta > 0.01 ? 'pos' : (delta < -0.01 ? 'neg' : '')
            };
          }
        };
      }
    },

    /* 37. KCPE PERFORMANCE & SECONDARY PLACEMENT CALCULATOR (OUT OF 500) */
    'kcpe-performance-calculator': {
      formId: 'kcpeForm',
      resetIds: [],
      bannerDesc: 'Compare your 5-paper KCPE total out of 500, KNEC mean grade, and secondary school placement tier with a classmate.',
      emptyTitle: 'Calculate Your KCPE Score First',
      emptyDesc: 'Enter your marks across all five KCPE papers above and calculate your score to compare with a classmate.',
      projectedLabel: 'Projected KCPE Total',
      higherIsBetter: true,
      tieEpsilon: 0.5,
      modes: [
        { id: 'subjects', label: '5 KCPE Subject Marks' },
        { id: 'total', label: 'Direct Total (/500)' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var defs = [
          { id: 'english', name: 'English' },
          { id: 'kiswahili', name: 'Kiswahili' },
          { id: 'maths', name: 'Mathematics' },
          { id: 'science', name: 'Science' },
          { id: 'social', name: 'Social Studies & RE' }
        ];
        var subjects = [];
        var total = 0;
        for (var i = 0; i < defs.length; i++) {
          var el = document.getElementById(defs[i].id);
          var mk = el ? parseFloat(el.value) : NaN;
          if (!isFinite(mk) || mk < 0 || mk > 100) return null;
          var rounded = Math.round(mk);
          total += rounded;
          subjects.push({ id: defs[i].id, name: defs[i].name, mark: rounded });
        }
        return {
          mode: 'subjects',
          score: total,
          maxScore: 500,
          band: kcpePlacementBand(total),
          subjects: subjects
        };
      },
      getDefaultFriendItems: function (mode) {
        if (mode === 'total') {
          return [{
            id: 'f_kcpe_tot',
            name: 'KCPE Total Marks',
            tag: 'Out of 500',
            type: 'number',
            min: 0,
            max: 500,
            suffix: '/500',
            placeholder: 'e.g. 375',
            val: null
          }];
        }
        var names = ['English', 'Kiswahili', 'Mathematics', 'Science', 'Social Studies & RE'];
        return names.map(function (nm, idx) {
          return {
            id: 'f_kcpe_' + idx,
            name: nm,
            tag: '0-100',
            type: 'number',
            min: 0,
            max: 100,
            suffix: '/100',
            placeholder: '0-100',
            val: null
          };
        });
      },
      getSampleFriendItems: function (mode) {
        var items = this.getDefaultFriendItems(mode);
        if (mode === 'total') {
          items[0].val = 372;
          return items;
        }
        var sample = [76, 72, 78, 74, 72];
        for (var i = 0; i < items.length; i++) items[i].val = sample[i];
        return items;
      },
      calculateFriend: function (items, mode) {
        if (mode === 'total') {
          var v = items[0] ? items[0].val : null;
          if (v === null || !isFinite(v)) return null;
          var tot = Math.round(clampNum(v, 0, 500));
          return {
            score: tot,
            maxScore: 500,
            filledCount: 1,
            band: kcpePlacementBand(tot)
          };
        }
        var sum = 0;
        var filled = 0;
        for (var i = 0; i < items.length; i++) {
          var mk = items[i].val;
          if (mk !== null && isFinite(mk)) {
            sum += Math.round(clampNum(mk, 0, 100));
            filled++;
          }
        }
        if (filled < 5) return null;
        return {
          score: sum,
          maxScore: 500,
          filledCount: filled,
          band: kcpePlacementBand(sum)
        };
      },
      validateMessage: 'Enter all 5 KCPE paper marks (or a direct total out of 500) for your friend.',
      formatScore: function (val) { return Math.round(val) + ' / 500'; },
      formatDiff: function (absDiff) {
        var d = Math.round(absDiff);
        return d + (d === 1 ? ' mark' : ' marks');
      },
      getSvgConfig: function () {
        return {
          min: 0, max: 500, invert: false, leftLabel: '0', rightLabel: '500 Max',
          guides: [
            { pct: (350 / 500) * 100, label: '350 Extra-County', strong: false },
            { pct: (400 / 500) * 100, label: '400 National', strong: true }
          ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName) {
        var subs = studentCtx.subjects;
        var bestIdx = 0;
        var minMk = 101;
        for (var i = 0; i < subs.length; i++) {
          if (subs[i].mark < minMk) {
            minMk = subs[i].mark;
            bestIdx = i;
          }
        }
        var chosen = subs[bestIdx];
        if (chosen.mark >= 98) {
          return {
            bestIndex: 0,
            suggestedSimVal: 100,
            html: 'All five KCPE papers are already near 100/100 in the National School tier (400+). Next step: maintain speed and accuracy in English Insha/Composition and Mathematics problem-solving.'
          };
        }
        var tgt = Math.min(100, chosen.mark + 12);
        var gain = tgt - chosen.mark;
        var proj = studentCtx.score + gain;
        var tierNote = (studentCtx.score < 400 && proj >= 400)
          ? ' and pushes you into the <strong>400+ National School tier</strong>'
          : ((studentCtx.score < 350 && proj >= 350)
            ? ' and lifts you into the <strong>350+ Extra-County tier</strong>'
            : ((studentCtx.score < friendCalc.score && proj >= friendCalc.score)
              ? ' and moves you ahead of ' + escapeHtml(friendName)
              : ' to reach <strong>' + proj + ' / 500</strong>'));
        return {
          bestIndex: bestIdx,
          suggestedSimVal: tgt,
          html: '<strong>' + escapeHtml(chosen.name) + ' (' + chosen.mark + '/100)</strong> has your largest mark headroom across the 5 equal-weight papers: raising it to <strong>' + tgt + '/100</strong> adds <strong>+' + gain + ' marks</strong>' + tierNote + '. Next step: complete timed KNEC past-paper drills and error reviews in ' + escapeHtml(chosen.name) + '.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var subs = studentCtx.subjects;
        var idx = clampNum(itemIndex, 0, subs.length - 1);
        var chosen = subs[idx];
        return {
          selectLabel: 'KCPE Subject Paper',
          options: subs.map(function (s, i) {
            return { index: i, label: s.name + ' (now ' + s.mark + '/100)' };
          }),
          sliderLabel: 'Simulated Paper Score',
          min: 0,
          max: 100,
          step: 1,
          defaultVal: Math.min(100, chosen.mark + 12),
          formatSliderVal: function (v) { return Math.round(v) + ' / 100'; },
          simulate: function (v) {
            var mk = Math.round(v);
            var delta = mk - chosen.mark;
            var proj = studentCtx.score + delta;
            return {
              projectedScore: proj,
              projectedDisplay: proj + ' / 500 (' + kcpePlacementBand(proj) + ')',
              changeDisplay: (delta >= 0 ? '+' : '') + delta + ' marks',
              changeState: delta > 0 ? 'pos' : (delta < 0 ? 'neg' : '')
            };
          }
        };
      }
    },

    /* 38. GHANA BECE CSSPS SHS PLACEMENT ESTIMATOR (AGGREGATE 6-54, LOWER IS BETTER) */
    'bece-cssps-placement-estimator': {
      formId: 'estForm',
      resetIds: [],
      bannerDesc: 'Compare your Ghana BECE aggregate (6 to 54, lower is stronger) and GES CSSPS Category A, B, or C SHS placement chance with a friend.',
      emptyTitle: 'Estimate Your CSSPS Placement First',
      emptyDesc: 'Enter your BECE aggregate (6-54) and target SHS category above to compare your CSSPS placement standing with a friend.',
      projectedLabel: 'Projected BECE Aggregate',
      higherIsBetter: false,
      tieEpsilon: 0.5,
      modes: [
        { id: 'aggregate', label: 'Direct BECE Aggregate (6-54)' },
        { id: 'subjects', label: '6 BECE Subjects (Grades 1-9)' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var aggEl = document.getElementById('aggregate');
        var catEl = document.getElementById('category');
        var agg = aggEl ? parseInt(aggEl.value, 10) : NaN;
        if (!isFinite(agg) || agg < 6 || agg > 54) return null;
        var cat = (catEl && (catEl.value === 'A' || catEl.value === 'B' || catEl.value === 'C')) ? catEl.value : 'A';
        return {
          mode: 'aggregate',
          cat: cat,
          score: agg,
          maxScore: 54,
          band: beceCsspsBand(agg, cat)
        };
      },
      getDefaultFriendItems: function (mode) {
        if (mode === 'subjects') {
          var opts = [{ value: '', label: 'Grade 1-9...' }];
          for (var g = 1; g <= 9; g++) {
            opts.push({ value: String(g), label: 'Grade ' + g + (g === 1 ? ' (Highest)' : (g === 9 ? ' (Lowest)' : '')) });
          }
          var names = ['English Language', 'Mathematics', 'Integrated Science', 'Social Studies', 'Best Elective 1', 'Best Elective 2'];
          return names.map(function (nm, idx) {
            return {
              id: 'f_cssps_s' + idx,
              name: nm,
              tag: idx < 4 ? 'Core' : 'Elective',
              type: 'select',
              options: opts,
              val: ''
            };
          });
        }
        return [{
          id: 'f_cssps_agg',
          name: 'Friend BECE Aggregate',
          tag: '6 best - 54',
          type: 'number',
          min: 6,
          max: 54,
          suffix: 'agg',
          placeholder: 'e.g. 12',
          val: null
        }];
      },
      getSampleFriendItems: function (mode) {
        var items = this.getDefaultFriendItems(mode);
        if (mode === 'subjects') {
          var sample = ['2', '2', '2', '2', '2', '2'];
          for (var i = 0; i < items.length; i++) items[i].val = sample[i];
          return items;
        }
        items[0].val = 12;
        return items;
      },
      calculateFriend: function (items, mode, studentCtx) {
        var cat = (studentCtx && studentCtx.cat) ? studentCtx.cat : 'A';
        if (mode === 'subjects') {
          var sum = 0;
          var filled = 0;
          for (var i = 0; i < items.length; i++) {
            var g = parseInt(items[i].val, 10);
            if (isFinite(g) && g >= 1 && g <= 9) {
              sum += g;
              filled++;
            }
          }
          if (filled < 6) return null;
          return {
            score: sum,
            maxScore: 54,
            filledCount: filled,
            band: beceCsspsBand(sum, cat)
          };
        }
        var v = items[0] ? items[0].val : null;
        if (v === null || !isFinite(v)) return null;
        var agg = Math.round(clampNum(v, 6, 54));
        return {
          score: agg,
          maxScore: 54,
          filledCount: 1,
          band: beceCsspsBand(agg, cat)
        };
      },
      validateMessage: 'Enter a valid BECE aggregate (6 to 54) or all 6 BECE subject grades for your friend.',
      formatScore: function (val) { return 'Aggregate ' + Math.round(val); },
      formatDiff: function (absDiff) {
        var d = Math.round(absDiff);
        return d + (d === 1 ? ' aggregate point' : ' aggregate points');
      },
      getSvgConfig: function () {
        var catEl = document.getElementById('category');
        var cat = (catEl && catEl.value) || 'A';
        var hiCut = cat === 'A' ? 10 : (cat === 'B' ? 18 : 30);
        var midCut = cat === 'A' ? 14 : (cat === 'B' ? 24 : 36);
        return {
          min: 6,
          max: 54,
          invert: true,
          leftLabel: '54 Weakest',
          rightLabel: '6 Best (Six 1s)',
          guides: [
            { pct: ((54 - midCut) / 48) * 100, label: midCut + ' Borderline', strong: false },
            { pct: ((54 - hiCut) / 48) * 100, label: hiCut + ' Cat ' + cat + ' High', strong: true }
          ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName) {
        var agg = studentCtx.score;
        var cat = studentCtx.cat;
        var hiCut = cat === 'A' ? 10 : (cat === 'B' ? 18 : 30);
        if (agg <= 6) {
          return {
            bestIndex: 0,
            suggestedSimVal: 6,
            html: 'Your BECE Aggregate 6 is the strongest possible WAEC score in Ghana. Next step: balance your CSSPS Category A first-choice SHS with required Category B/C backup selections.'
          };
        }
        var tgt = agg > hiCut ? Math.max(6, Math.min(agg - 3, hiCut)) : Math.max(6, agg - 2);
        var drop = agg - tgt;
        var catNote = (agg > hiCut && tgt <= hiCut)
          ? ' and places you into the <strong>High-Chance Category ' + cat + ' band (Aggregate ' + hiCut + ' or better)</strong>'
          : ((agg > friendCalc.score && tgt <= friendCalc.score)
            ? ' and moves you ahead of ' + escapeHtml(friendName)
            : ' to reach <strong>Aggregate ' + tgt + '</strong>');
        return {
          bestIndex: 0,
          suggestedSimVal: tgt,
          html: 'All <strong>4 Core subjects (English, Maths, Integrated Science, Social Studies)</strong> count mandatorily in CSSPS: trimming <strong>' + drop + (drop === 1 ? ' aggregate point' : ' aggregate points') + '</strong> across your weakest Core papers lowers your score' + catNote + '. Next step: prioritise Core Mathematics and Science raw-score tie-breakers alongside a safe Category B/C backup school.'
        };
      },
      getSimConfig: function (studentCtx) {
        var cur = studentCtx.score;
        var cat = studentCtx.cat;
        var hiCut = cat === 'A' ? 10 : (cat === 'B' ? 18 : 30);
        return {
          selectLabel: 'Target SHS Category',
          options: [
            { index: 0, label: 'Category ' + cat + ' Placement (now Aggregate ' + cur + ')' }
          ],
          sliderLabel: 'Simulated BECE Aggregate (6 Best - 54)',
          min: 6,
          max: 54,
          step: 1,
          defaultVal: cur > hiCut ? Math.max(6, Math.min(cur - 3, hiCut)) : Math.max(6, cur - 2),
          formatSliderVal: function (v) { return 'Aggregate ' + Math.round(v); },
          simulate: function (v) {
            var proj = Math.round(v);
            var diff = proj - cur;
            return {
              projectedScore: proj,
              projectedDisplay: 'Agg ' + proj + ' (' + beceCsspsBand(proj, cat) + ')',
              changeDisplay: (diff > 0 ? '+' : '') + diff + ' pts',
              changeState: diff < 0 ? 'pos' : (diff > 0 ? 'neg' : '')
            };
          }
        };
      }
    },

    /* 39. UK GCSE GRADE & ATTAINMENT 8 CALCULATOR (9-1 PORTFOLIO & PAPER WEIGHTS) */
    'uk-gcse-grade-calculator': {
      formId: 'portfolioForm',
      extraFormIds: ['componentsForm'],
      resetIds: ['resetPortfolioBtn', 'resetCompBtn', 'tabSubjectsBtn', 'tabComponentsBtn'],
      bannerDesc: 'Compare your GCSE 9-1 average grade (plus Attainment 8) or weighted exam-paper percentage against a classmate.',
      emptyTitle: 'Calculate Your GCSE Results First',
      emptyDesc: 'Enter at least 2 GCSE subjects (or single-subject exam components) above and calculate your grade to compare with a classmate.',
      projectedLabel: 'Projected GCSE Standing',
      higherIsBetter: true,
      tieEpsilon: 0.05,
      modes: [
        { id: 'portfolio', label: 'GCSE Subjects (9-1 Avg)' },
        { id: 'components', label: 'Single-Subject Papers (%)' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var viewComp = document.getElementById('viewComponents');
        var isComp = !!(viewComp && !viewComp.classList.contains('hidden'));
        if (isComp) {
          var cRows = document.querySelectorAll('#compRowsContainer .comp-row');
          var comps = [];
          var rawWeightSum = 0;
          for (var c = 0; c < cRows.length; c++) {
            var cnEl = cRows[c].querySelector('.comp-name');
            var cmEl = cRows[c].querySelector('.comp-mark');
            var cxEl = cRows[c].querySelector('.comp-max');
            var cwEl = cRows[c].querySelector('.comp-weight');
            var mk = cmEl ? parseFloat(cmEl.value) : NaN;
            var mx = cxEl ? parseFloat(cxEl.value) : NaN;
            var wt = cwEl ? parseFloat(cwEl.value) : NaN;
            if (!isFinite(mk) || !isFinite(mx) || mx <= 0 || mk < 0 || mk > mx || !isFinite(wt) || wt <= 0) continue;
            var pct = (mk / mx) * 100;
            rawWeightSum += wt;
            comps.push({
              name: (cnEl && cnEl.value.trim()) ? cnEl.value.trim() : ('Paper ' + (comps.length + 1)),
              mark: mk,
              max: mx,
              pct: pct,
              rawWeight: wt
            });
          }
          if (!comps.length || rawWeightSum <= 0) return null;
          var weightedPct = 0;
          for (var j = 0; j < comps.length; j++) {
            comps[j].normWeight = (comps[j].rawWeight / rawWeightSum) * 100;
            weightedPct += comps[j].pct * (comps[j].normWeight / 100);
          }
          var scPct = Math.round(weightedPct * 10) / 10;
          return {
            mode: 'components',
            rawScore: weightedPct,
            score: scPct,
            maxScore: 100,
            band: 'Predicted Grade ' + ukGcseGradeFromPct(weightedPct) + ' (' + comps.length + ' papers)',
            comps: comps
          };
        }
        var sRows = document.querySelectorAll('#subjectRowsContainer .gcse-row');
        var subjects = [];
        var sumPts = 0;
        for (var i = 0; i < sRows.length; i++) {
          var snEl = sRows[i].querySelector('.subj-name');
          var sgEl = sRows[i].querySelector('.subj-grade');
          if (!sgEl || !sgEl.value) continue;
          var gStr = sgEl.value;
          var pts = gStr === 'U' ? 0 : parseInt(gStr, 10);
          if (!isFinite(pts) || pts < 0 || pts > 9) continue;
          var nm = (snEl && snEl.value.trim()) ? snEl.value.trim() : ('GCSE Subject ' + (subjects.length + 1));
          sumPts += pts;
          subjects.push({ name: nm, grade: gStr, pts: pts });
        }
        if (subjects.length < 2) return null;
        var rawAvg = sumPts / subjects.length;
        var avg = Math.round(rawAvg * 100) / 100;
        var a8El = document.getElementById('statAValue');
        var a8Txt = (a8El && a8El.textContent.trim() && a8El.textContent.trim() !== '0.0') ? ('A8: ' + a8El.textContent.trim() + '/90 - ') : '';
        return {
          mode: 'portfolio',
          rawScore: rawAvg,
          score: avg,
          maxScore: 9.0,
          band: a8Txt + ukGcsePortfolioBand(rawAvg),
          subjects: subjects
        };
      },
      getComparableStudentScore: function (studentCtx, friendMode) {
        if (studentCtx.mode === friendMode) {
          return { score: studentCtx.score, maxScore: studentCtx.maxScore, band: studentCtx.band };
        }
        if (friendMode === 'components') {
          var eqPct = Math.round((studentCtx.score / 9.0) * 1000) / 10;
          return { score: eqPct, maxScore: 100, band: studentCtx.band };
        }
        var eqGr = Math.round((studentCtx.score / 100) * 900) / 100;
        return { score: eqGr, maxScore: 9.0, band: studentCtx.band };
      },
      getDefaultFriendItems: function (mode, studentCtx) {
        if (mode === 'components') {
          var cSrc = (studentCtx && studentCtx.comps && studentCtx.comps.length) ? studentCtx.comps : [
            { name: 'Paper 1', normWeight: 50 },
            { name: 'Paper 2', normWeight: 50 }
          ];
          return cSrc.map(function (c, idx) {
            return {
              id: 'f_gcse_c' + idx,
              name: c.name,
              tag: Math.round(c.normWeight) + '% wt',
              type: 'number',
              min: 0,
              max: 100,
              suffix: '%',
              placeholder: '0-100',
              val: null,
              aux: Math.round(c.normWeight * 10) / 10
            };
          });
        }
        var opts = [{ value: '', label: 'GCSE Grade...' }].concat(UK_GCSE_GRADES.map(function (g) {
          return { value: g.value, label: g.label };
        }));
        var src = (studentCtx && studentCtx.subjects && studentCtx.subjects.length) ? studentCtx.subjects : [
          { name: 'English Language' }, { name: 'Mathematics' }, { name: 'Biology' },
          { name: 'Chemistry' }, { name: 'Physics' }, { name: 'History' },
          { name: 'Geography' }, { name: 'French' }
        ];
        return src.map(function (s, idx) {
          return {
            id: 'f_gcse_s' + idx,
            name: s.name,
            tag: '9-1 Scale',
            type: 'select',
            options: opts,
            val: ''
          };
        });
      },
      getSampleFriendItems: function (mode, studentCtx) {
        var items = this.getDefaultFriendItems(mode, studentCtx);
        if (mode === 'components') {
          var cSample = [72, 68, 76, 70];
          for (var c = 0; c < items.length; c++) items[c].val = cSample[c % cSample.length];
          return items;
        }
        var sSample = ['7', '7', '6', '7', '6', '8', '6', '7'];
        for (var i = 0; i < items.length; i++) items[i].val = sSample[i % sSample.length];
        return items;
      },
      calculateFriend: function (items, mode) {
        if (mode === 'components') {
          var wSum = 0;
          var pSum = 0;
          var filledC = 0;
          for (var c = 0; c < items.length; c++) {
            var v = items[c].val;
            var w = (items[c].aux && isFinite(items[c].aux) && items[c].aux > 0) ? items[c].aux : (100 / items.length);
            if (v !== null && isFinite(v)) {
              wSum += w;
              pSum += clampNum(v, 0, 100) * w;
              filledC++;
            }
          }
          if (!filledC || wSum <= 0) return null;
          var rawPct = pSum / wSum;
          var scPct = Math.round(rawPct * 10) / 10;
          return {
            score: scPct,
            maxScore: 100,
            filledCount: filledC,
            band: 'Predicted Grade ' + ukGcseGradeFromPct(rawPct)
          };
        }
        var sum = 0;
        var filled = 0;
        for (var i = 0; i < items.length; i++) {
          var gStr = items[i].val;
          if (!gStr) continue;
          var pts = gStr === 'U' ? 0 : parseInt(gStr, 10);
          if (isFinite(pts) && pts >= 0 && pts <= 9) {
            sum += pts;
            filled++;
          }
        }
        if (filled < 2) return null;
        var rawAvg = sum / filled;
        var avg = Math.round(rawAvg * 100) / 100;
        return {
          score: avg,
          maxScore: 9.0,
          filledCount: filled,
          band: ukGcsePortfolioBand(rawAvg) + ' (' + filled + ' GCSEs)'
        };
      },
      validateMessage: 'Enter at least 2 GCSE grades (or paper percentages in Single-Subject mode) for your friend.',
      formatScore: function (val) {
        if (compareState.friendMode === 'components') return val.toFixed(1) + '%';
        return 'Grade ' + val.toFixed(2);
      },
      formatDiff: function (absDiff) {
        if (compareState.friendMode === 'components') return absDiff.toFixed(1) + ' percentage points';
        return absDiff.toFixed(2) + ' GCSE grade points';
      },
      getSvgConfig: function (mode) {
        if (mode === 'components') {
          return {
            min: 0, max: 100, invert: false, leftLabel: '0%', rightLabel: '100% Max',
            guides: [
              { pct: 54, label: '54% Gr 6', strong: false },
              { pct: 70, label: '70% Gr 7', strong: true }
            ]
          };
        }
        return {
          min: 0, max: 9.0, invert: false, leftLabel: 'U (0.0)', rightLabel: 'Grade 9.0 Max',
          guides: [
            { pct: (5.0 / 9.0) * 100, label: '5.0 Strong Pass', strong: false },
            { pct: (7.0 / 9.0) * 100, label: '7.0 Grade A', strong: true }
          ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName, studentComp) {
        if (studentCtx.mode === 'components') {
          var comps = studentCtx.comps;
          var bestC = 0;
          var maxLost = -1;
          for (var c = 0; c < comps.length; c++) {
            var lost = (100 - comps[c].pct) * (comps[c].normWeight / 100);
            if (lost > maxLost) {
              maxLost = lost;
              bestC = c;
            }
          }
          var chC = comps[bestC];
          if (maxLost <= 0.2) {
            return {
              bestIndex: 0,
              suggestedSimVal: 100,
              html: 'All GCSE exam papers are already in the Grade 9 boundary zone. Next step: practise extended-response mark schemes to protect every weighted mark.'
            };
          }
          var tgtPct = Math.min(100, Math.round(chC.pct + 12));
          var gainPct = (tgtPct - chC.pct) * (chC.normWeight / 100);
          var projPct = Math.round((studentCtx.rawScore + gainPct) * 10) / 10;
          return {
            bestIndex: bestC,
            suggestedSimVal: tgtPct,
            html: '<strong>' + escapeHtml(chC.name) + ' (' + Math.round(chC.normWeight) + '% weight, now ' + chC.pct.toFixed(1) + '%)</strong> holds your biggest GCSE boundary gain: lifting it to <strong>' + tgtPct + '%</strong> adds <strong>+' + gainPct.toFixed(1) + '% overall</strong> to reach <strong>' + projPct.toFixed(1) + '% (Grade ' + ukGcseGradeFromPct(projPct) + ')</strong>. Next step: target high-tariff 6-mark and 8-mark questions in this paper.'
          };
        }
        var subs = studentCtx.subjects;
        var bestIdx = 0;
        var bestValue = -1;
        for (var i = 0; i < subs.length; i++) {
          var isDouble = /english|math/i.test(subs[i].name) ? 1.35 : 1.0;
          var valScore = (9 - subs[i].pts) * isDouble;
          if (valScore > bestValue) {
            bestValue = valScore;
            bestIdx = i;
          }
        }
        var chosen = subs[bestIdx];
        if (chosen.pts >= 9) {
          return {
            bestIndex: 0,
            suggestedSimVal: 9,
            html: 'Every entered GCSE is already at Grade 9. Next step: maintain timed past-paper accuracy across double-weighted English and Mathematics.'
          };
        }
        var tgtGr = Math.min(9, chosen.pts + 2);
        var avgGain = (tgtGr - chosen.pts) / subs.length;
        var projAvg = Math.round((studentCtx.rawScore + avgGain) * 100) / 100;
        var a8Note = /english|math/i.test(chosen.name) ? ' (and double-counts in DfE Attainment 8)' : '';
        var vsNote = (studentComp.score < friendCalc.score && projAvg >= friendCalc.score)
          ? ' and moves you ahead of ' + escapeHtml(friendName)
          : ' to reach <strong>Grade ' + projAvg.toFixed(2) + '</strong>';
        return {
          bestIndex: bestIdx,
          suggestedSimVal: tgtGr,
          html: '<strong>' + escapeHtml(chosen.name) + ' (Grade ' + chosen.grade + ')' + a8Note + '</strong> is your highest-leverage GCSE to improve: raising it to <strong>Grade ' + tgtGr + '</strong> adds <strong>+' + avgGain.toFixed(2) + ' average grade points</strong>' + vsNote + '. Next step: focus examiner mark-scheme practice on ' + escapeHtml(chosen.name) + ' before mock exams.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        if (studentCtx.mode === 'components') {
          var comps = studentCtx.comps;
          var cIdx = clampNum(itemIndex, 0, comps.length - 1);
          var chC = comps[cIdx];
          return {
            selectLabel: 'GCSE Paper / Component',
            options: comps.map(function (c, i) {
              return { index: i, label: c.name + ' (' + Math.round(c.normWeight) + '% wt - now ' + c.pct.toFixed(1) + '%)' };
            }),
            sliderLabel: 'Simulated Paper Score',
            min: 0,
            max: 100,
            step: 1,
            defaultVal: Math.min(100, Math.round(chC.pct + 12)),
            formatSliderVal: function (v) { return Math.round(v) + '%'; },
            simulate: function (v) {
              var delta = (v - chC.pct) * (chC.normWeight / 100);
              var rawProj = clampNum(studentCtx.rawScore + delta, 0, 100);
              var proj = Math.round(rawProj * 10) / 10;
              var compProj = compareState.friendMode === 'portfolio' ? (proj / 100) * 9.0 : proj;
              return {
                projectedScore: compProj,
                projectedDisplay: proj.toFixed(1) + '% (Grade ' + ukGcseGradeFromPct(rawProj) + ')',
                changeDisplay: (delta >= 0 ? '+' : '') + delta.toFixed(1) + '%',
                changeState: delta > 0.05 ? 'pos' : (delta < -0.05 ? 'neg' : '')
              };
            }
          };
        }
        var subs = studentCtx.subjects;
        var idx = clampNum(itemIndex, 0, subs.length - 1);
        var chosen = subs[idx];
        return {
          selectLabel: 'GCSE Subject',
          options: subs.map(function (s, i) {
            return { index: i, label: s.name + ' (now Grade ' + s.grade + ')' };
          }),
          sliderLabel: 'Simulated GCSE Grade (U to 9)',
          min: 0,
          max: 9,
          step: 1,
          defaultVal: Math.min(9, chosen.pts + 2),
          formatSliderVal: function (v) {
            var g = Math.round(v);
            return g === 0 ? 'Grade U (0)' : ('Grade ' + g);
          },
          simulate: function (v) {
            var g = Math.round(v);
            var delta = (g - chosen.pts) / subs.length;
            var rawProj = clampNum(studentCtx.rawScore + delta, 0, 9.0);
            var proj = Math.round(rawProj * 100) / 100;
            var compProj = compareState.friendMode === 'components' ? (proj / 9.0) * 100 : proj;
            return {
              projectedScore: compProj,
              projectedDisplay: 'Grade ' + proj.toFixed(2) + ' (' + ukGcsePortfolioBand(rawProj) + ')',
              changeDisplay: (delta >= 0 ? '+' : '') + delta.toFixed(2) + ' avg',
              changeState: delta > 0.005 ? 'pos' : (delta < -0.005 ? 'neg' : '')
            };
          }
        };
      }
    },

    /* 40. UK UNIVERSITY DEGREE CLASSIFICATION CALCULATOR (1ST / 2:1 / 2:2 HONOURS) */
    'uk-degree-classification-calculator': {
      formId: 'degreeForm',
      resetIds: ['resetBtn'],
      bannerDesc: 'Compare your weighted UK Honours degree percentage and classification (1st, 2:1, 2:2) against a coursemate.',
      emptyTitle: 'Calculate Your UK Degree Classification First',
      emptyDesc: 'Enter your Year 2 and Final Year module credits and marks above to compare your Honours classification with a coursemate.',
      projectedLabel: 'Projected Honours Average',
      higherIsBetter: true,
      tieEpsilon: 0.05,
      modes: [
        { id: 'years', label: 'Year 2 & Year 3 Averages (%)' },
        { id: 'overall', label: 'Overall Honours %' }
      ],
      getStudentContext: function () {
        if (!isResultsVisible()) return null;
        var modelEl = document.getElementById('weightingModelSelect');
        var modelKey = (modelEl && UK_DEGREE_MODELS[modelEl.value]) ? modelEl.value : '1:2';
        var weights = UK_DEGREE_MODELS[modelKey];
        var dropEl = document.getElementById('optDropLowest');
        var dropLowest = !!(dropEl && dropEl.checked);

        function readMods(sel, yrTag, yrWeight) {
          var rows = document.querySelectorAll(sel);
          var list = [];
          var entered = 0;
          for (var i = 0; i < rows.length; i++) {
            var nEl = rows[i].querySelector('.mod-name');
            var cEl = rows[i].querySelector('.mod-credits');
            var mEl = rows[i].querySelector('.mod-mark');
            var cr = cEl ? parseFloat(cEl.value) : 0;
            var rawStr = mEl ? mEl.value.trim() : '';
            if (rawStr !== '') entered++;
            var mk = rawStr === '' ? 0 : parseFloat(rawStr);
            if (!isFinite(cr) || cr <= 0 || !isFinite(mk) || mk < 0 || mk > 100) continue;
            list.push({
              name: (nEl && nEl.value.trim()) ? nEl.value.trim() : (yrTag + ' Module ' + (list.length + 1)),
              yearTag: yrTag,
              yearWeight: yrWeight,
              credits: cr,
              mark: mk
            });
          }
          return { list: list, entered: entered };
        }

        var y2Data = readMods('#y2ModulesContainer .mod-row', 'Year 2', weights.w2);
        var y3Data = readMods('#y3ModulesContainer .mod-row', 'Year 3', weights.w3);
        if (y3Data.entered === 0 || (weights.w2 > 0 && y2Data.entered === 0)) return null;

        var y2Stats = ukDegreeYearAvg(y2Data.list, dropLowest);
        var y3Stats = ukDegreeYearAvg(y3Data.list, dropLowest);
        if (y3Stats.credits <= 0 || (weights.w2 > 0 && y2Stats.credits <= 0)) return null;

        var composite = (weights.w2 === 0) ? y3Stats.avg : (y2Stats.avg * weights.w2 + y3Stats.avg * weights.w3);
        var score = Math.round(composite * 100) / 100;
        var simModules = [];
        if (weights.w2 > 0) {
          for (var a = 0; a < y2Data.list.length; a++) {
            simModules.push({ yr: 2, localIdx: a, mod: y2Data.list[a], effWeight: weights.w2 * (y2Data.list[a].credits / y2Stats.credits) });
          }
        }
        for (var b = 0; b < y3Data.list.length; b++) {
          simModules.push({ yr: 3, localIdx: b, mod: y3Data.list[b], effWeight: weights.w3 * (y3Data.list[b].credits / y3Stats.credits) });
        }
        if (!simModules.length) return null;

        return {
          mode: 'years',
          modelKey: modelKey,
          weights: weights,
          dropLowest: dropLowest,
          y2List: y2Data.list,
          y3List: y3Data.list,
          y2Avg: Math.round(y2Stats.avg * 10) / 10,
          y3Avg: Math.round(y3Stats.avg * 10) / 10,
          rawScore: composite,
          score: score,
          maxScore: 100,
          band: ukDegreeHonoursBand(composite) + ' (' + weights.label + ')',
          simModules: simModules
        };
      },
      getDefaultFriendItems: function (mode, studentCtx) {
        var modelEl = document.getElementById('weightingModelSelect');
        var mk = (studentCtx && studentCtx.modelKey) || (modelEl && UK_DEGREE_MODELS[modelEl.value] ? modelEl.value : '1:2');
        var w = UK_DEGREE_MODELS[mk];
        if (mode === 'overall' || w.w2 === 0) {
          return [{
            id: 'f_ukdeg_ov',
            name: w.w2 === 0 ? 'Final Year (Level 6) Average' : 'Overall Weighted Honours %',
            tag: '0-100%',
            type: 'number',
            min: 0,
            max: 100,
            suffix: '%',
            placeholder: 'e.g. 66.5',
            val: null
          }];
        }
        return [
          {
            id: 'f_ukdeg_y2',
            name: 'Year 2 (Level 5) Average',
            tag: Math.round(w.w2 * 100) + '% wt',
            type: 'number',
            min: 0,
            max: 100,
            suffix: '%',
            placeholder: 'e.g. 63',
            val: null
          },
          {
            id: 'f_ukdeg_y3',
            name: 'Final Year (Level 6) Average',
            tag: Math.round(w.w3 * 100) + '% wt',
            type: 'number',
            min: 0,
            max: 100,
            suffix: '%',
            placeholder: 'e.g. 68',
            val: null
          }
        ];
      },
      getSampleFriendItems: function (mode, studentCtx) {
        var items = this.getDefaultFriendItems(mode, studentCtx);
        if (items.length === 1) {
          items[0].val = 66.5;
          return items;
        }
        items[0].val = 63.0;
        items[1].val = 68.0;
        return items;
      },
      calculateFriend: function (items, mode, studentCtx) {
        var modelEl = document.getElementById('weightingModelSelect');
        var mk = (studentCtx && studentCtx.modelKey) || (modelEl && UK_DEGREE_MODELS[modelEl.value] ? modelEl.value : '1:2');
        var w = UK_DEGREE_MODELS[mk];
        if (mode === 'overall' || items.length === 1 || w.w2 === 0) {
          var ov = items[0] ? items[0].val : null;
          if (ov === null || !isFinite(ov)) return null;
          var scOv = Math.round(clampNum(ov, 0, 100) * 100) / 100;
          return {
            score: scOv,
            maxScore: 100,
            filledCount: 1,
            band: ukDegreeHonoursBand(scOv) + ' (' + w.label + ')'
          };
        }
        var v2 = items[0] ? items[0].val : null;
        var v3 = items[1] ? items[1].val : null;
        if (v2 === null || !isFinite(v2) || v3 === null || !isFinite(v3)) return null;
        var comp = clampNum(v2, 0, 100) * w.w2 + clampNum(v3, 0, 100) * w.w3;
        var sc = Math.round(comp * 100) / 100;
        return {
          score: sc,
          maxScore: 100,
          filledCount: 2,
          band: ukDegreeHonoursBand(comp) + ' (' + w.label + ')'
        };
      },
      validateMessage: 'Enter your coursemate\'s Year 2 and Final Year averages (or overall Honours percentage).',
      formatScore: function (val) { return val.toFixed(2) + '%'; },
      formatDiff: function (absDiff) { return absDiff.toFixed(2) + ' percentage points'; },
      getSvgConfig: function () {
        return {
          min: 0, max: 100, invert: false, leftLabel: '0%', rightLabel: '100% Max',
          guides: [
            { pct: 60, label: '60% 2:1', strong: false },
            { pct: 70, label: '70% 1st', strong: true }
          ]
        };
      },
      computeTip: function (studentCtx, friendCalc, friendName) {
        var sims = studentCtx.simModules;
        var bestIdx = 0;
        var bestGainPot = -1;
        for (var i = 0; i < sims.length; i++) {
          var pot = (100 - sims[i].mod.mark) * sims[i].effWeight;
          if (pot > bestGainPot) {
            bestGainPot = pot;
            bestIdx = i;
          }
        }
        var chosen = sims[bestIdx];
        if (bestGainPot <= 0.25) {
          return {
            bestIndex: 0,
            suggestedSimVal: Math.max(80, Math.round(chosen.mod.mark)),
            html: 'Your Honours profile is already firmly in the First-Class (70%+) band. Next step: protect your Final Year dissertation and high-credit Level 6 modules.'
          };
        }
        var tgtMk = chosen.mod.mark < 60 ? 66 : (chosen.mod.mark < 70 ? 72 : Math.min(100, Math.round(chosen.mod.mark + 8)));
        var simCfg = this.getSimConfig(studentCtx, bestIdx);
        var simOut = simCfg.simulate(tgtMk);
        var gain = simOut.projectedScore - studentCtx.score;
        var boundaryNote = (studentCtx.score < 70 && simOut.projectedScore >= 70)
          ? ' and crosses the <strong>70% First-Class Honours boundary</strong>'
          : ((studentCtx.score < 60 && simOut.projectedScore >= 60)
            ? ' and crosses the <strong>60% Upper Second (2:1) boundary</strong>'
            : ((studentCtx.score < friendCalc.score && simOut.projectedScore >= friendCalc.score)
              ? ' and moves you ahead of ' + escapeHtml(friendName)
              : ' to reach <strong>' + simOut.projectedScore.toFixed(2) + '%</strong>'));
        return {
          bestIndex: bestIdx,
          suggestedSimVal: tgtMk,
          html: '<strong>' + escapeHtml(chosen.mod.name) + ' (' + chosen.mod.yearTag + ', ' + chosen.mod.credits + ' cr, ' + chosen.mod.mark.toFixed(0) + '%)</strong> carries your highest Honours weighting: lifting it to <strong>' + tgtMk + '%</strong> adds <strong>+' + Math.max(0.05, gain).toFixed(2) + '% overall</strong>' + boundaryNote + '. Next step: prioritise coursework rubrics and supervisor feedback in this high-tariff module.'
        };
      },
      getSimConfig: function (studentCtx, itemIndex) {
        var sims = studentCtx.simModules;
        var idx = clampNum(itemIndex, 0, sims.length - 1);
        var chosen = sims[idx];
        return {
          selectLabel: 'Degree Module (' + studentCtx.weights.label + ')',
          options: sims.map(function (entry, i) {
            return {
              index: i,
              label: entry.mod.yearTag + ': ' + entry.mod.name + ' (' + entry.mod.credits + ' cr - now ' + Math.round(entry.mod.mark) + '%)'
            };
          }),
          sliderLabel: 'Simulated Module Mark',
          min: 0,
          max: 100,
          step: 1,
          defaultVal: Math.min(100, Math.max(Math.round(chosen.mod.mark) + 8, 70)),
          formatSliderVal: function (v) { return Math.round(v) + '%'; },
          simulate: function (v) {
            var y2Clone = studentCtx.y2List.map(function (m, k) {
              return { credits: m.credits, mark: (chosen.yr === 2 && chosen.localIdx === k) ? v : m.mark };
            });
            var y3Clone = studentCtx.y3List.map(function (m, k) {
              return { credits: m.credits, mark: (chosen.yr === 3 && chosen.localIdx === k) ? v : m.mark };
            });
            var s2 = ukDegreeYearAvg(y2Clone, studentCtx.dropLowest);
            var s3 = ukDegreeYearAvg(y3Clone, studentCtx.dropLowest);
            var comp = (studentCtx.weights.w2 === 0) ? s3.avg : (s2.avg * studentCtx.weights.w2 + s3.avg * studentCtx.weights.w3);
            var proj = Math.round(comp * 100) / 100;
            var diff = proj - studentCtx.score;
            return {
              projectedScore: proj,
              projectedDisplay: proj.toFixed(2) + '% (' + ukDegreeHonoursBand(comp) + ')',
              changeDisplay: (diff >= 0 ? '+' : '') + diff.toFixed(2) + '%',
              changeState: diff > 0.02 ? 'pos' : (diff < -0.02 ? 'neg' : '')
            };
          }
        };
      }
    }
  };

  /* 20. KCSE KUCCPS CLUSTER CALCULATOR (shares exact KUCCPS formula & DOM with #6) */
  ADAPTERS['kcse-kuccps-cluster-calculator'] = ADAPTERS['kuccps-cluster-points-calculator'];

  /* =========================================================================
   * RUNTIME STATE & SHARED ICASS UI ENGINE
   * ========================================================================= */

  var activeSlug = '';
  var activeAdapter = null;

  var compareState = {
    isOpen: false,
    activeTab: 'manual',
    studentName: 'You',
    friendName: 'Classmate',
    friendMode: 'standard',
    friendItems: [],
    hypotheticalIndex: 0,
    hypotheticalVal: 75,
    simUserModified: false,
    feedbackMsg: '',
    feedbackOk: false
  };

  function getComparableStudent(studentCtx) {
    if (activeAdapter && typeof activeAdapter.getComparableStudentScore === 'function') {
      return activeAdapter.getComparableStudentScore(studentCtx, compareState.friendMode);
    }
    return { score: studentCtx.score, maxScore: studentCtx.maxScore, band: studentCtx.band };
  }

  function formatStandingVsFriend(projectedScore, friendScore, friendName) {
    var eps = activeAdapter.tieEpsilon || 0.05;
    var adv = activeAdapter.higherIsBetter ? (projectedScore - friendScore) : (friendScore - projectedScore);
    var absAdv = Math.abs(adv);
    if (adv > eps) {
      return 'Ahead of ' + friendName + ' by ' + activeAdapter.formatDiff(absAdv);
    }
    if (adv < -eps) {
      return activeAdapter.formatDiff(absAdv) + ' behind ' + friendName;
    }
    return 'Tied with ' + friendName;
  }

  function renderComparisonSvg(studentName, studentScore, friendName, friendScore, svgCfg) {
    var span = (svgCfg.max - svgCfg.min) || 100;
    var sNorm = svgCfg.invert
      ? ((svgCfg.max - studentScore) / span) * 100
      : ((studentScore - svgCfg.min) / span) * 100;
    var fNorm = svgCfg.invert
      ? ((svgCfg.max - friendScore) / span) * 100
      : ((friendScore - svgCfg.min) / span) * 100;

    var sClamped = clampNum(sNorm, 0, 100);
    var fClamped = clampNum(fNorm, 0, 100);
    var minVisible = svgCfg.invert ? 3.0 : 1.5;
    var sBarW = (sClamped > 0 || svgCfg.invert) && sClamped < minVisible ? minVisible : sClamped;
    var fBarW = (fClamped > 0 || svgCfg.invert) && fClamped < minVisible ? minVisible : fClamped;

    var sLabel = escapeHtml(truncateLabel(studentName, 22));
    var fLabel = escapeHtml(truncateLabel(friendName, 22));
    var sValStr = escapeHtml(activeAdapter.formatScore(studentScore));
    var fValStr = escapeHtml(activeAdapter.formatScore(friendScore));
    var aria = escapeHtml(studentName + ' ' + activeAdapter.formatScore(studentScore) + ' versus ' + friendName + ' ' + activeAdapter.formatScore(friendScore));

    var out = [];
    out.push('<div class="compare-svg-wrap">');
    out.push('  <svg class="compare-svg" width="100%" height="120" role="img" aria-label="' + aria + '">');

    var guides = svgCfg.guides || [];
    for (var g = 0; g < guides.length; g++) {
      var gd = guides[g];
      var gp = clampNum(gd.pct, 5, 95).toFixed(2) + '%';
      var stroke = gd.strong ? '#9ca3af' : '#d1d5db';
      out.push('    <line x1="' + gp + '" y1="18" x2="' + gp + '" y2="92" stroke="' + stroke + '" stroke-width="1" stroke-dasharray="3,3" />');
    }

    out.push('    <text x="0%" y="14" font-size="13" font-weight="700" fill="#111827">' + sLabel + '</text>');
    out.push('    <text x="100%" y="14" text-anchor="end" font-size="13" font-weight="700" fill="#111827" style="font-variant-numeric:tabular-nums;">' + sValStr + '</text>');
    out.push('    <rect x="0" y="22" width="100%" height="16" rx="4" fill="#f3f4f6" />');
    out.push('    <rect x="0" y="22" width="' + sBarW.toFixed(2) + '%" height="16" rx="4" fill="#facc15" stroke="#eab308" stroke-width="0.75" />');

    out.push('    <text x="0%" y="60" font-size="13" font-weight="600" fill="#374151">' + fLabel + '</text>');
    out.push('    <text x="100%" y="60" text-anchor="end" font-size="13" font-weight="700" fill="#374151" style="font-variant-numeric:tabular-nums;">' + fValStr + '</text>');
    out.push('    <rect x="0" y="68" width="100%" height="16" rx="4" fill="#f3f4f6" />');
    out.push('    <rect x="0" y="68" width="' + fBarW.toFixed(2) + '%" height="16" rx="4" fill="#374151" />');

    out.push('    <text x="0%" y="110" text-anchor="start" font-size="11" fill="#6b7280">' + escapeHtml(svgCfg.leftLabel) + '</text>');
    for (var k = 0; k < guides.length; k++) {
      var gk = guides[k];
      var gkp = clampNum(gk.pct, 12, 88).toFixed(2) + '%';
      var fw = gk.strong ? ' font-weight="600" fill="#4b5563"' : ' fill="#6b7280"';
      out.push('    <text x="' + gkp + '" y="110" text-anchor="middle" font-size="11"' + fw + '>' + escapeHtml(gk.label) + '</text>');
    }
    out.push('    <text x="100%" y="110" text-anchor="end" font-size="11" fill="#6b7280">' + escapeHtml(svgCfg.rightLabel) + '</text>');
    out.push('  </svg>');
    out.push('</div>');
    return out.join('');
  }

  function buildComparisonShareUrl(studentCtx) {
    try {
      var base = window.location.href.split('?')[0];
      var url = new URL(base);
      url.searchParams.set('compare', '1');
      url.searchParams.set('f_tool', activeSlug);
      url.searchParams.set('f_name', compareState.studentName || 'Classmate');
      url.searchParams.set('f_mode', studentCtx.mode || 'standard');

      // Encode current student's marks as the friend payload for whoever opens the link
      var myAsFriend = exportStudentAsFriendItems(studentCtx);
      for (var i = 0; i < myAsFriend.length; i++) {
        var it = myAsFriend[i];
        if (it.val !== null && it.val !== undefined && it.val !== '') {
          url.searchParams.set('f_v' + i, String(it.val));
          url.searchParams.set('f_n' + i, it.name);
          if (it.aux !== undefined && it.aux !== null) {
            url.searchParams.set('f_a' + i, String(it.aux));
          }
        }
      }
      return url.toString();
    } catch (e) {
      return window.location.href;
    }
  }

  function exportStudentAsFriendItems(studentCtx) {
    var mode = studentCtx.mode || 'standard';
    var items = activeAdapter.getDefaultFriendItems(mode, studentCtx);

    if (activeSlug === 'south-african-aps-calculator') {
      for (var i = 0; i < studentCtx.subjects.length && i < items.length; i++) {
        items[i].val = studentCtx.subjects[i].pct;
      }
    } else if (activeSlug === 'south-african-tvet-nated-calculator') {
      for (var n = 0; n < studentCtx.components.length && n < items.length; n++) {
        items[n].val = studentCtx.components[n].score;
      }
    } else if (activeSlug === 'matric-sba-exam-calculator') {
      for (var m = 0; m < studentCtx.subjects.length && m < items.length; m++) {
        items[m].val = Math.round(studentCtx.subjects[m].final * 10) / 10;
      }
    } else if (activeSlug === 'wassce-aggregate-calculator' || activeSlug === 'bece-aggregate-calculator') {
      for (var w = 0; w < items.length; w++) {
        items[w].val = studentCtx.gradeMap[items[w].id] || '';
      }
    } else if (activeSlug === 'kuccps-cluster-points-calculator' || activeSlug === 'kcse-kuccps-cluster-calculator') {
      items[0].val = studentCtx.aggregate;
      for (var k = 0; k < studentCtx.prereqs.length; k++) {
        if (items[k + 1]) items[k + 1].val = String(studentCtx.prereqs[k].pts);
      }
    } else if (activeSlug === 'kcse-grade-calculator') {
      for (var c = 0; c < studentCtx.counted.length && c < items.length; c++) {
        items[c].name = studentCtx.counted[c].name;
        items[c].val = String(studentCtx.counted[c].pts);
      }
    } else if (activeSlug === 'jamb-score-calculator') {
      for (var j = 0; j < studentCtx.papers.length && j < items.length; j++) {
        items[j].val = studentCtx.papers[j].score;
      }
    } else if (activeSlug === 'jamb-utme-aggregate-calculator') {
      items[0].val = studentCtx.utme;
      for (var o = 0; o < studentCtx.olevels.length; o++) {
        if (items[o + 1]) items[o + 1].val = studentCtx.olevels[o].grade;
      }
    } else if (activeSlug === 'gpa-calculator' || activeSlug === 'tertiary-gpa-cgpa-calculator') {
      for (var g = 0; g < studentCtx.courses.length && g < items.length; g++) {
        items[g].name = studentCtx.courses[g].name;
        items[g].val = studentCtx.courses[g].grade;
        items[g].aux = studentCtx.courses[g].credits;
      }
    } else if (activeSlug === 'waec-grade-calculator') {
      for (var wg = 0; wg < studentCtx.subjects.length && wg < items.length; wg++) {
        items[wg].name = studentCtx.subjects[wg].name;
        items[wg].val = studentCtx.subjects[wg].mark;
      }
    } else if (activeSlug === 'nigerian-university-cgpa-calculator') {
      if (studentCtx.courses && studentCtx.courses[0] && !studentCtx.courses[0].isSem) {
        for (var ng = 0; ng < studentCtx.courses.length && ng < items.length; ng++) {
          items[ng].name = studentCtx.courses[ng].name;
          items[ng].val = studentCtx.courses[ng].grade;
          items[ng].aux = studentCtx.courses[ng].credits;
        }
      }
    } else if (activeSlug === 'post-utme-aggregate-calculator') {
      var pIdx = 0;
      if (items[pIdx]) { items[pIdx].val = studentCtx.jamb; pIdx++; }
      if (studentCtx.usesCbt && items[pIdx]) { items[pIdx].val = studentCtx.cbt; pIdx++; }
      if (studentCtx.usesOlevel) {
        for (var po = 0; po < studentCtx.grades.length; po++) {
          if (items[pIdx + po]) items[pIdx + po].val = studentCtx.grades[po];
        }
      }
    } else if (activeSlug === 'tvet-ncv-pass-calculator') {
      for (var nv = 0; nv < studentCtx.subjects.length && nv < items.length; nv++) {
        items[nv].name = studentCtx.subjects[nv].name;
        items[nv].val = Math.round(studentCtx.subjects[nv].final * 10) / 10;
      }
    } else if (activeSlug === 'ghana-university-gpa-calculator') {
      for (var gh = 0; gh < studentCtx.courses.length && gh < items.length; gh++) {
        items[gh].name = studentCtx.courses[gh].name;
        items[gh].val = studentCtx.sys === 'cwa' ? studentCtx.courses[gh].valNum : studentCtx.courses[gh].grade;
        items[gh].aux = studentCtx.courses[gh].credits;
      }
    } else if (activeSlug === 'ucas-points-calculator') {
      for (var uc = 0; uc < studentCtx.quals.length && uc < items.length; uc++) {
        items[uc].name = studentCtx.quals[uc].subject;
        items[uc].val = studentCtx.quals[uc].grade;
      }
    } else if (activeSlug === 'uace-points-calculator') {
      if (items.length >= 5) {
        items[0].val = String(studentCtx.principals[0].pts);
        items[1].val = String(studentCtx.principals[1].pts);
        items[2].val = String(studentCtx.principals[2].pts);
        items[3].val = String(studentCtx.gp);
        items[4].val = String(studentCtx.sb);
      }
    } else if (activeSlug === 'zimsec-alevel-points-calculator') {
      for (var zm = 0; zm < studentCtx.subjects.length && zm < items.length; zm++) {
        items[zm].name = studentCtx.subjects[zm].name;
        items[zm].val = studentCtx.subjects[zm].grade;
      }
    } else if (activeSlug === 'south-african-university-admission-calculator') {
      for (var sa = 0; sa < studentCtx.allSubjects.length && sa < items.length; sa++) {
        items[sa].name = studentCtx.allSubjects[sa].name;
        items[sa].val = studentCtx.allSubjects[sa].mark;
      }
    } else if (activeSlug === 'zimsec-olevel-points-calculator' || activeSlug === 'form-four-gpa-calculator') {
      for (var zo = 0; zo < studentCtx.subjects.length && zo < items.length; zo++) {
        items[zo].name = studentCtx.subjects[zo].name;
        items[zo].val = studentCtx.subjects[zo].grade;
      }
    } else if (activeSlug === 'zambia-grade-12-points-calculator') {
      for (var ez = 0; ez < studentCtx.subjects.length && ez < items.length; ez++) {
        items[ez].name = studentCtx.subjects[ez].name;
        items[ez].val = String(studentCtx.subjects[ez].grade);
      }
    } else if (activeSlug === 'ple-aggregate-calculator') {
      for (var pl = 0; pl < studentCtx.papers.length && pl < items.length; pl++) {
        items[pl].val = String(studentCtx.papers[pl].pts);
      }
    } else if (activeSlug === 'uce-grade-calculator' || activeSlug === 'ghana-nursing-training-admission-calculator') {
      for (var ug = 0; ug < studentCtx.subjects.length && ug < items.length; ug++) {
        items[ug].name = studentCtx.subjects[ug].name;
        items[ug].val = String(studentCtx.subjects[ug].pts);
      }
    } else if (activeSlug === 'acsee-points-calculator') {
      for (var ac = 0; ac < studentCtx.principals.length && ac < items.length; ac++) {
        items[ac].name = studentCtx.principals[ac].name;
        items[ac].val = studentCtx.principals[ac].grade;
      }
    } else if (activeSlug === 'kenya-university-gpa-calculator') {
      for (var ke = 0; ke < studentCtx.courses.length && ke < items.length; ke++) {
        items[ke].name = studentCtx.courses[ke].name;
        items[ke].val = studentCtx.isWam ? studentCtx.courses[ke].valNum : studentCtx.courses[ke].rawVal;
        items[ke].aux = studentCtx.courses[ke].credits;
      }
    } else if (activeSlug === 'uganda-university-cgpa-calculator' || activeSlug === 'zambia-university-gpa-calculator' || activeSlug === 'tanzania-university-gpa-calculator') {
      for (var ucg = 0; ucg < studentCtx.courses.length && ucg < items.length; ucg++) {
        items[ucg].name = studentCtx.courses[ucg].name;
        items[ucg].val = studentCtx.courses[ucg].rawVal;
        items[ucg].aux = studentCtx.courses[ucg].credits;
      }
    } else if (activeSlug === 'zimbabwe-university-gpa-calculator') {
      for (var zwg = 0; zwg < studentCtx.courses.length && zwg < items.length; zwg++) {
        items[zwg].name = studentCtx.courses[zwg].name;
        items[zwg].val = Math.round(studentCtx.courses[zwg].mark * 10) / 10;
        items[zwg].aux = studentCtx.courses[zwg].credits;
      }
    } else if (activeSlug === 'zimbabwe-university-entry-points-calculator') {
      for (var zwe = 0; zwe < studentCtx.subjects.length && zwe < items.length; zwe++) {
        items[zwe].name = studentCtx.subjects[zwe].name;
        items[zwe].val = studentCtx.subjects[zwe].grade;
      }
    } else if (activeSlug === 'zambia-university-admission-calculator') {
      for (var zma = 0; zma < studentCtx.subjects.length && zma < items.length; zma++) {
        items[zma].name = studentCtx.subjects[zma].name;
        items[zma].val = String(studentCtx.subjects[zma].grade);
      }
    } else if (activeSlug === 'tanzania-university-admission-calculator') {
      if (studentCtx.mode === 'diploma') {
        if (items[0]) items[0].val = studentCtx.dipGpa;
      } else {
        for (var tza = 0; tza < studentCtx.subjects.length && tza < items.length; tza++) {
          items[tza].name = studentCtx.subjects[tza].name;
          items[tza].val = studentCtx.subjects[tza].grade;
        }
      }
    } else if (activeSlug === 'kcpe-performance-calculator') {
      for (var kcp = 0; kcp < studentCtx.subjects.length && kcp < items.length; kcp++) {
        items[kcp].name = studentCtx.subjects[kcp].name;
        items[kcp].val = studentCtx.subjects[kcp].mark;
      }
    } else if (activeSlug === 'bece-cssps-placement-estimator') {
      if (items[0]) items[0].val = studentCtx.score;
    } else if (activeSlug === 'uk-gcse-grade-calculator') {
      if (studentCtx.mode === 'components') {
        for (var gcc = 0; gcc < studentCtx.comps.length && gcc < items.length; gcc++) {
          items[gcc].name = studentCtx.comps[gcc].name;
          items[gcc].val = Math.round(studentCtx.comps[gcc].pct * 10) / 10;
          items[gcc].aux = Math.round(studentCtx.comps[gcc].normWeight * 10) / 10;
        }
      } else {
        for (var gcs = 0; gcs < studentCtx.subjects.length && gcs < items.length; gcs++) {
          items[gcs].name = studentCtx.subjects[gcs].name;
          items[gcs].val = studentCtx.subjects[gcs].grade;
        }
      }
    } else if (activeSlug === 'uk-degree-classification-calculator') {
      if (items.length === 1) {
        items[0].val = studentCtx.score;
      } else if (items.length >= 2) {
        items[0].val = studentCtx.y2Avg;
        items[1].val = studentCtx.y3Avg;
      }
    }
    return items;
  }

  function parseFriendUrl(urlStr, studentCtx) {
    try {
      var cleanUrl = (urlStr || '').trim();
      if (!cleanUrl) return { error: 'Paste a shared AfriWidget result link first.' };

      var query = '';
      if (cleanUrl.indexOf('?') !== -1) {
        query = cleanUrl.split('?')[1];
      } else if (cleanUrl.indexOf('=') !== -1) {
        query = cleanUrl;
      } else {
        return { error: 'No result scores were found in this link.' };
      }

      var params = new URLSearchParams(query);
      if (params.has('f_tool') && params.get('f_tool') !== activeSlug) {
        return { error: 'That comparison link belongs to a different AfriWidget calculator.' };
      }

      var friendName = params.get('f_name') || params.get('name') || 'Classmate';
      var mode = params.get('f_mode') || (studentCtx ? studentCtx.mode : 'standard') || 'standard';

      if (params.has('f_v0') || params.has('f_v1')) {
        var baseItems = activeAdapter.getDefaultFriendItems(mode, studentCtx);
        // Expand dynamic lists (Matric / GPA) if link has more courses/subjects
        var maxIdx = baseItems.length - 1;
        params.forEach(function (_, key) {
          var m = key.match(/^f_v(\d+)$/);
          if (m) maxIdx = Math.max(maxIdx, parseInt(m[1], 10));
        });
        while (baseItems.length <= maxIdx && baseItems.length > 0) {
          var tmpl = Object.assign({}, baseItems[baseItems.length - 1]);
          tmpl.id = 'f_extra_' + baseItems.length;
          baseItems.push(tmpl);
        }
        for (var i = 0; i < baseItems.length; i++) {
          if (params.has('f_v' + i)) {
            var rawV = params.get('f_v' + i);
            if (baseItems[i].type === 'number' || baseItems[i].type === 'dual-num') {
              var numV = parseFloat(rawV);
              baseItems[i].val = isFinite(numV) ? clampNum(numV, baseItems[i].min, baseItems[i].max) : null;
            } else {
              baseItems[i].val = rawV;
            }
          }
          if (params.has('f_n' + i)) {
            baseItems[i].name = params.get('f_n' + i);
          }
          if (params.has('f_a' + i)) {
            var auxNum = parseFloat(params.get('f_a' + i));
            if (isFinite(auxNum)) baseItems[i].aux = auxNum;
          }
        }
        var check = activeAdapter.calculateFriend(baseItems, mode, studentCtx);
        if (!check) return { error: 'The link did not include enough marks to complete a comparison.' };
        return { success: true, mode: mode, friendName: friendName, items: baseItems };
      }

      if (typeof activeAdapter.parseUrlItems === 'function') {
        var nativeParsed = activeAdapter.parseUrlItems(params, mode, studentCtx);
        if (nativeParsed && nativeParsed.items) {
          var nativeCheck = activeAdapter.calculateFriend(nativeParsed.items, nativeParsed.mode, studentCtx);
          if (nativeCheck) {
            return {
              success: true,
              mode: nativeParsed.mode,
              friendName: friendName,
              items: nativeParsed.items
            };
          }
        }
      }

      return { error: 'No recognizable marks for this calculator were found in that link.' };
    } catch (e) {
      return { error: 'Could not read that link. Check the URL or enter marks manually.' };
    }
  }

  function updateBannerButtonState() {
    var openBtn = document.getElementById('openCompareBtn');
    if (!openBtn) return;
    var labelEl = openBtn.querySelector('.compare-btn-label') || openBtn.querySelector('span');
    if (compareState.isOpen) {
      openBtn.classList.add('active');
      openBtn.setAttribute('aria-expanded', 'true');
      if (labelEl) labelEl.textContent = 'Hide Comparison';
    } else {
      openBtn.classList.remove('active');
      openBtn.setAttribute('aria-expanded', 'false');
      if (labelEl) labelEl.textContent = 'Compare with a Friend';
    }
  }

  function renderFriendInputField(item, index) {
    var out = [];
    out.push('<div class="compare-task-field">');
    out.push('  <div class="compare-task-head">');
    out.push('    <label class="compare-task-name" for="compTaskInp_' + index + '" title="' + escapeHtml(item.name) + '">' + escapeHtml(item.name) + '</label>');
    if (item.tag) {
      out.push('    <span class="compare-task-wt">' + escapeHtml(item.tag) + '</span>');
    }
    out.push('  </div>');

    if (item.type === 'select') {
      out.push('  <select id="compTaskInp_' + index + '" class="comp-friend-select" data-task-idx="' + index + '">');
      for (var o = 0; o < item.options.length; o++) {
        var opt = item.options[o];
        var sel = String(item.val) === String(opt.value) ? ' selected' : '';
        out.push('    <option value="' + escapeHtml(opt.value) + '"' + sel + '>' + escapeHtml(opt.label) + '</option>');
      }
      out.push('  </select>');
    } else if (item.type === 'dual-gpa') {
      out.push('  <div class="compare-dual-wrap">');
      out.push('    <select id="compTaskInp_' + index + '" class="comp-friend-select" data-task-idx="' + index + '" aria-label="' + escapeHtml(item.name) + ' Grade">');
      for (var g = 0; g < item.options.length; g++) {
        var gOpt = item.options[g];
        var gSel = String(item.val) === String(gOpt.value) ? ' selected' : '';
        out.push('      <option value="' + escapeHtml(gOpt.value) + '"' + gSel + '>' + escapeHtml(gOpt.label) + '</option>');
      }
      out.push('    </select>');
      out.push('    <div class="compare-unit-wrap">');
      var crVal = (item.aux !== null && isFinite(item.aux)) ? item.aux : '';
      out.push('      <input type="number" min="0.5" max="30" step="0.5" inputmode="decimal" class="comp-friend-score-input comp-friend-aux-input" data-task-idx="' + index + '" value="' + crVal + '" placeholder="Cr" aria-label="' + escapeHtml(item.name) + ' Credits" />');
      out.push('      <span class="compare-unit-suffix">cr</span>');
      out.push('    </div>');
      out.push('  </div>');
    } else if (item.type === 'dual-num') {
      var dnVal = (item.val !== null && isFinite(item.val)) ? item.val : '';
      var dnCr = (item.aux !== null && isFinite(item.aux)) ? item.aux : '';
      out.push('  <div class="compare-dual-wrap">');
      out.push('    <div class="compare-unit-wrap">');
      out.push('      <input type="number" id="compTaskInp_' + index + '" min="' + item.min + '" max="' + item.max + '" step="any" inputmode="decimal" class="comp-friend-score-input" data-task-idx="' + index + '" value="' + dnVal + '" placeholder="' + escapeHtml(item.placeholder || '') + '" />');
      if (item.suffix) {
        out.push('      <span class="compare-unit-suffix">' + escapeHtml(item.suffix) + '</span>');
      }
      out.push('    </div>');
      out.push('    <div class="compare-unit-wrap">');
      out.push('      <input type="number" min="0.5" max="30" step="0.5" inputmode="decimal" class="comp-friend-score-input comp-friend-aux-input" data-task-idx="' + index + '" value="' + dnCr + '" placeholder="Cr" aria-label="' + escapeHtml(item.name) + ' Credits" />');
      out.push('      <span class="compare-unit-suffix">cr</span>');
      out.push('    </div>');
      out.push('  </div>');
    } else {
      var valStr = (item.val !== null && isFinite(item.val)) ? item.val : '';
      var cls = 'comp-friend-score-input' + (item.noSuffix ? ' no-suffix' : '');
      out.push('  <div class="compare-unit-wrap">');
      out.push('    <input type="number" id="compTaskInp_' + index + '" min="' + item.min + '" max="' + item.max + '" step="any" inputmode="decimal" class="' + cls + '" data-task-idx="' + index + '" value="' + valStr + '" placeholder="' + escapeHtml(item.placeholder || '') + '" />');
      if (!item.noSuffix && item.suffix) {
        out.push('    <span class="compare-unit-suffix">' + escapeHtml(item.suffix) + '</span>');
      }
      out.push('  </div>');
    }

    out.push('</div>');
    return out.join('');
  }

  function renderCompareUI() {
    var container = document.getElementById('compareWorkspaceSection');
    if (!container || !activeAdapter) return;

    updateBannerButtonState();

    var studentCtx = activeAdapter.getStudentContext();
    if (!studentCtx) {
      container.innerHTML = [
        '<div class="compare-card compare-empty-state">',
        '  <h3 class="compare-empty-title">' + escapeHtml(activeAdapter.emptyTitle) + '</h3>',
        '  <p class="compare-empty-desc">' + escapeHtml(activeAdapter.emptyDesc) + '</p>',
        '  <button type="button" id="compareGoToCalcBtn" class="comp-btn-primary compare-empty-btn">Go to Calculator</button>',
        '</div>'
      ].join('');

      var goBtn = document.getElementById('compareGoToCalcBtn');
      if (goBtn) {
        goBtn.addEventListener('click', function () {
          var formEl = document.getElementById(activeAdapter.formId);
          if (formEl && typeof formEl.scrollIntoView === 'function') {
            formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }
      return;
    }

    if (compareState.friendItems.length === 0) {
      compareState.friendMode = studentCtx.mode || 'standard';
      compareState.friendItems = activeAdapter.getDefaultFriendItems(compareState.friendMode, studentCtx);
    }

    var friendCalc = activeAdapter.calculateFriend(compareState.friendItems, compareState.friendMode, studentCtx);
    var hasFriendData = friendCalc !== null && friendCalc.filledCount > 0;
    var studentComp = getComparableStudent(studentCtx);
    var studentScore = studentComp.score;
    var friendScore = hasFriendData ? friendCalc.score : null;

    var sName = compareState.studentName || 'You';
    var fName = compareState.friendName || 'Classmate';

    var tipData = null;
    if (hasFriendData) {
      tipData = activeAdapter.computeTip(studentCtx, friendCalc, fName, studentComp);
      if (!compareState.simUserModified) {
        compareState.hypotheticalIndex = tipData.bestIndex;
        compareState.hypotheticalVal = tipData.suggestedSimVal;
      }
    }

    var html = [];
    html.push('<div class="compare-card">');

    // Header
    html.push('  <div class="compare-header">');
    html.push('    <h2 class="compare-title">Compare Results with a Friend</h2>');
    html.push('    <button type="button" id="compareCloseBtn" class="compare-close-btn" aria-label="Close comparison">&times;</button>');
    html.push('  </div>');

    // Setup Panel
    html.push('  <div class="compare-setup ' + (hasFriendData ? '' : 'compare-setup-last') + '">');
    html.push('    <div class="compare-names-grid">');
    html.push('      <div class="compare-field">');
    html.push('        <label class="compare-label" for="compStudentName">Your Name</label>');
    html.push('        <input type="text" id="compStudentName" class="compare-input" value="' + escapeHtml(compareState.studentName) + '" placeholder="You" />');
    html.push('      </div>');
    html.push('      <div class="compare-field">');
    html.push('        <label class="compare-label" for="compFriendName">Friend\'s Name</label>');
    html.push('        <input type="text" id="compFriendName" class="compare-input" value="' + escapeHtml(compareState.friendName) + '" placeholder="Classmate" />');
    html.push('      </div>');
    html.push('    </div>');

    // Toolbar
    html.push('    <div class="compare-toolbar">');
    html.push('      <div class="compare-seg" role="tablist" aria-label="Friend mark entry method">');
    html.push('        <button type="button" id="tabCompManual" class="compare-seg-btn ' + (compareState.activeTab === 'manual' ? 'active' : '') + '" role="tab" aria-selected="' + (compareState.activeTab === 'manual') + '">Enter Marks</button>');
    html.push('        <button type="button" id="tabCompImport" class="compare-seg-btn ' + (compareState.activeTab === 'import' ? 'active' : '') + '" role="tab" aria-selected="' + (compareState.activeTab === 'import') + '">Paste Link</button>');
    html.push('      </div>');

    if (activeAdapter.modes && activeAdapter.modes.length > 1) {
      html.push('      <div id="compFormatBar" class="compare-seg" style="' + (compareState.activeTab === 'manual' ? 'display:inline-flex;' : 'display:none;') + '" aria-label="Comparison format">');
      for (var mIdx = 0; mIdx < activeAdapter.modes.length; mIdx++) {
        var mObj = activeAdapter.modes[mIdx];
        html.push('        <button type="button" class="compare-seg-btn comp-mode-btn ' + (compareState.friendMode === mObj.id ? 'active' : '') + '" data-mode="' + escapeHtml(mObj.id) + '">' + escapeHtml(mObj.label) + '</button>');
      }
      html.push('      </div>');
    }
    html.push('    </div>');

    // Manual Panel
    var gridCls = 'compare-tasks-grid' + (activeAdapter.wideGrid ? ' compare-tasks-grid-wide' : '');
    html.push('    <div id="compManualPanel" style="' + (compareState.activeTab === 'manual' ? 'display:block;' : 'display:none;') + '">');
    html.push('      <div class="' + gridCls + '">');
    for (var i = 0; i < compareState.friendItems.length; i++) {
      html.push(renderFriendInputField(compareState.friendItems[i], i));
    }
    html.push('      </div>');

    html.push('      <div class="compare-actions">');
    html.push('        <button type="button" id="compCalculateBtn" class="comp-btn-primary">' + (hasFriendData ? 'Update Comparison' : 'Compare Scores') + '</button>');
    html.push('        <button type="button" id="compSampleFriendBtn" class="comp-btn-secondary">Sample Marks</button>');
    if (hasFriendData) {
      html.push('        <button type="button" id="compareShareBtn" class="comp-btn-secondary">Copy Link</button>');
      html.push('        <button type="button" id="compClearFriendBtn" class="comp-btn-secondary">Reset</button>');
    }
    html.push('      </div>');
    html.push('      <p id="compStatusMessage" class="compare-feedback' + (compareState.feedbackOk ? ' ok' : '') + '" aria-live="polite">' + escapeHtml(compareState.feedbackMsg) + '</p>');
    html.push('    </div>');

    // Import Panel
    html.push('    <div id="compImportPanel" style="' + (compareState.activeTab === 'import' ? 'display:block;' : 'display:none;') + '">');
    html.push('      <div class="compare-import-row">');
    html.push('        <input type="url" id="compImportUrlInput" class="compare-input" placeholder="Paste your friend\'s shared AfriWidget link..." />');
    html.push('        <button type="button" id="compDoImportBtn" class="comp-btn-primary">Load Marks</button>');
    html.push('      </div>');
    html.push('      <div id="compImportError" class="compare-import-error" style="display:none;"></div>');
    html.push('    </div>');
    html.push('  </div>');

    // Results Stack: 1) Overall Score vs Friend + 2) Clean SVG Visual + 3) Short Value Tip + 4) Simplified What-If Simulator
    if (hasFriendData) {
      var eps = activeAdapter.tieEpsilon || 0.05;
      var adv = activeAdapter.higherIsBetter ? (studentScore - friendScore) : (friendScore - studentScore);
      var diffText = activeAdapter.formatDiff(Math.abs(adv));
      var lowerNote = activeAdapter.higherIsBetter ? '' : ' (lower aggregate is stronger)';
      var verdictHtml = '';

      if (adv > eps) {
        verdictHtml = escapeHtml(sName) + (sName.toLowerCase() === 'you' ? ' are' : ' is') + ' ahead of ' + escapeHtml(fName) + ' by <span class="compare-verdict-pts">' + escapeHtml(diffText) + '</span>' + lowerNote + '.';
      } else if (adv < -eps) {
        verdictHtml = escapeHtml(fName) + ' is ahead by <span class="compare-verdict-pts">' + escapeHtml(diffText) + '</span>' + lowerNote + '.';
      } else {
        verdictHtml = escapeHtml(sName) + ' and ' + escapeHtml(fName) + ' are tied at <span class="compare-verdict-pts">' + escapeHtml(activeAdapter.formatScore(studentScore)) + '</span>.';
      }

      var svgCfg = activeAdapter.getSvgConfig(compareState.friendMode, studentComp);

      html.push('  <div class="compare-results-stack" id="compareResultsSection">');

      // 1 & 2. Overall Score Comparison + Single Clean SVG Visual
      html.push('    <div class="compare-summary-box">');
      html.push('      <p class="compare-verdict">' + verdictHtml + '</p>');
      html.push('      <div class="compare-scores-row">');
      html.push('        <div class="compare-score-col">');
      html.push('          <span class="compare-score-person">' + escapeHtml(sName) + '</span>');
      html.push('          <span class="compare-score-val">' + escapeHtml(activeAdapter.formatScore(studentScore)) + '</span>');
      html.push('          <span class="compare-score-meta">' + escapeHtml(studentComp.band) + '</span>');
      html.push('        </div>');
      html.push('        <div class="compare-score-col">');
      html.push('          <span class="compare-score-person">' + escapeHtml(fName) + '</span>');
      html.push('          <span class="compare-score-val">' + escapeHtml(activeAdapter.formatScore(friendScore)) + '</span>');
      html.push('          <span class="compare-score-meta">' + escapeHtml(friendCalc.band) + '</span>');
      html.push('        </div>');
      html.push('      </div>');
      html.push(renderComparisonSvg(sName, studentScore, fName, friendScore, svgCfg));
      html.push('    </div>');

      // 3. One Short, Personalized Value Tip
      html.push('    <div class="compare-tip-box">');
      html.push('      <span class="compare-tip-kicker">Most Valuable Area to Improve</span>');
      html.push('      <p class="compare-tip-text">' + tipData.html + '</p>');
      html.push('    </div>');

      // 4. Simplified What-If Simulator
      var simCfg = activeAdapter.getSimConfig(studentCtx, compareState.hypotheticalIndex, friendCalc);
      var clampedVal = clampNum(compareState.hypotheticalVal, simCfg.min, simCfg.max);
      compareState.hypotheticalVal = clampedVal;
      var simOut = simCfg.simulate(clampedVal);
      var standingText = formatStandingVsFriend(simOut.projectedScore, friendScore, fName);
      var gainClass = simOut.changeState ? (' ' + simOut.changeState) : '';

      html.push('    <div class="compare-sim-box">');
      html.push('      <div class="compare-sim-head">');
      html.push('        <h3 class="compare-sim-title">What-If Simulator</h3>');
      html.push('      </div>');
      html.push('      <div class="compare-sim-controls">');
      html.push('        <div class="compare-field">');
      html.push('          <label class="compare-label" for="simTaskSelect">' + escapeHtml(simCfg.selectLabel) + '</label>');
      html.push('          <select id="simTaskSelect" class="compare-input">');
      for (var sIdx = 0; sIdx < simCfg.options.length; sIdx++) {
        var sOpt = simCfg.options[sIdx];
        var isSel = (sOpt.index === clampNum(compareState.hypotheticalIndex, 0, simCfg.options.length - 1)) ? 'selected' : '';
        html.push('            <option value="' + sOpt.index + '" ' + isSel + '>' + escapeHtml(sOpt.label) + '</option>');
      }
      html.push('          </select>');
      html.push('        </div>');
      html.push('        <div class="compare-field">');
      html.push('          <div class="compare-sim-slider-head">');
      html.push('            <label class="compare-label" for="simScoreSlider">' + escapeHtml(simCfg.sliderLabel) + '</label>');
      html.push('            <span id="simScoreVal" class="compare-sim-val">' + escapeHtml(simCfg.formatSliderVal(clampedVal)) + '</span>');
      html.push('          </div>');
      html.push('          <input type="range" id="simScoreSlider" min="' + simCfg.min + '" max="' + simCfg.max + '" step="' + simCfg.step + '" value="' + clampedVal + '" class="compare-sim-range" />');
      html.push('        </div>');
      html.push('      </div>');

      html.push('      <div class="compare-sim-readout">');
      html.push('        <div class="sim-stat">');
      html.push('          <span class="sim-stat-label">' + escapeHtml(activeAdapter.projectedLabel) + '</span>');
      html.push('          <span id="simProjectedScore" class="sim-stat-val">' + escapeHtml(simOut.projectedDisplay) + '</span>');
      html.push('        </div>');
      html.push('        <div class="sim-stat">');
      html.push('          <span class="sim-stat-label">Overall Change</span>');
      html.push('          <span id="simMetaGain" class="sim-stat-val' + gainClass + '">' + escapeHtml(simOut.changeDisplay) + '</span>');
      html.push('        </div>');
      html.push('        <div class="sim-stat sim-stat-full">');
      html.push('          <span class="sim-stat-label">Projected Standing</span>');
      html.push('          <span id="simMetaVs" class="sim-stat-standing">' + escapeHtml(standingText) + '</span>');
      html.push('        </div>');
      html.push('      </div>');
      html.push('    </div>');

      html.push('  </div>');
    }

    html.push('</div>');

    container.innerHTML = html.join('');
    container.style.display = compareState.isOpen ? 'block' : 'none';
    compareState.feedbackMsg = '';
    compareState.feedbackOk = false;

    attachCompareEventListeners(studentCtx);
  }

  function attachCompareEventListeners(studentCtx) {
    var closeBtn = document.getElementById('compareCloseBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        compareState.isOpen = false;
        var container = document.getElementById('compareWorkspaceSection');
        if (container) container.style.display = 'none';
        updateBannerButtonState();

        var entryCard = document.getElementById('compareEntryCard');
        if (entryCard && typeof entryCard.scrollIntoView === 'function') {
          entryCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }

    var sNameInput = document.getElementById('compStudentName');
    if (sNameInput) {
      sNameInput.addEventListener('input', function () {
        compareState.studentName = (this.value || 'You').trim();
      });
      sNameInput.addEventListener('change', function () {
        var fc = activeAdapter.calculateFriend(compareState.friendItems, compareState.friendMode, studentCtx);
        if (fc && fc.filledCount > 0) renderCompareUI();
      });
    }

    var fNameInput = document.getElementById('compFriendName');
    if (fNameInput) {
      fNameInput.addEventListener('input', function () {
        compareState.friendName = (this.value || 'Classmate').trim();
      });
      fNameInput.addEventListener('change', function () {
        var fc = activeAdapter.calculateFriend(compareState.friendItems, compareState.friendMode, studentCtx);
        if (fc && fc.filledCount > 0) renderCompareUI();
      });
    }

    var tabManual = document.getElementById('tabCompManual');
    var tabImport = document.getElementById('tabCompImport');
    var panManual = document.getElementById('compManualPanel');
    var panImport = document.getElementById('compImportPanel');
    var formatBar = document.getElementById('compFormatBar');

    if (tabManual && tabImport && panManual && panImport) {
      tabManual.addEventListener('click', function () {
        compareState.activeTab = 'manual';
        tabManual.classList.add('active');
        tabManual.setAttribute('aria-selected', 'true');
        tabImport.classList.remove('active');
        tabImport.setAttribute('aria-selected', 'false');
        panManual.style.display = 'block';
        panImport.style.display = 'none';
        if (formatBar) formatBar.style.display = 'inline-flex';
      });

      tabImport.addEventListener('click', function () {
        compareState.activeTab = 'import';
        tabImport.classList.add('active');
        tabImport.setAttribute('aria-selected', 'true');
        tabManual.classList.remove('active');
        tabManual.setAttribute('aria-selected', 'false');
        panManual.style.display = 'none';
        panImport.style.display = 'block';
        if (formatBar) formatBar.style.display = 'none';
      });
    }

    var modeBtns = document.querySelectorAll('#compareWorkspaceSection .comp-mode-btn');
    modeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var m = this.getAttribute('data-mode');
        if (m && m !== compareState.friendMode) {
          var freshCtx = activeAdapter.getStudentContext();
          compareState.friendMode = m;
          compareState.friendItems = activeAdapter.getDefaultFriendItems(m, freshCtx);
          compareState.simUserModified = false;
          renderCompareUI();
        }
      });
    });

    var numInputs = document.querySelectorAll('#compareWorkspaceSection .comp-friend-score-input:not(.comp-friend-aux-input)');
    numInputs.forEach(function (inp) {
      inp.addEventListener('input', function () {
        var idx = parseInt(this.getAttribute('data-task-idx'), 10);
        var item = compareState.friendItems[idx];
        if (!item) return;
        var val = parseFloat(this.value);
        item.val = isFinite(val) ? clampNum(val, item.min, item.max) : null;
      });
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          var btn = document.getElementById('compCalculateBtn');
          if (btn) btn.click();
        }
      });
    });

    var selInputs = document.querySelectorAll('#compareWorkspaceSection .comp-friend-select');
    selInputs.forEach(function (sel) {
      sel.addEventListener('change', function () {
        var idx = parseInt(this.getAttribute('data-task-idx'), 10);
        if (compareState.friendItems[idx]) {
          compareState.friendItems[idx].val = this.value;
        }
      });
    });

    var auxInputs = document.querySelectorAll('#compareWorkspaceSection .comp-friend-aux-input');
    auxInputs.forEach(function (aux) {
      aux.addEventListener('input', function () {
        var idx = parseInt(this.getAttribute('data-task-idx'), 10);
        var val = parseFloat(this.value);
        if (compareState.friendItems[idx]) {
          compareState.friendItems[idx].aux = isFinite(val) && val > 0 ? clampNum(val, 0.5, 30) : null;
        }
      });
    });

    var calcBtn = document.getElementById('compCalculateBtn');
    if (calcBtn) {
      calcBtn.addEventListener('click', function () {
        var freshCtx = activeAdapter.getStudentContext();
        var fc = activeAdapter.calculateFriend(compareState.friendItems, compareState.friendMode, freshCtx);
        var statusMsg = document.getElementById('compStatusMessage');
        if (!fc || !fc.filledCount) {
          if (statusMsg) {
            statusMsg.className = 'compare-feedback';
            statusMsg.textContent = activeAdapter.validateMessage;
          }
          return;
        }
        compareState.simUserModified = false;
        renderCompareUI();
        var resultsSection = document.getElementById('compareResultsSection');
        if (resultsSection && typeof resultsSection.scrollIntoView === 'function') {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    }

    var sampleBtn = document.getElementById('compSampleFriendBtn');
    if (sampleBtn) {
      sampleBtn.addEventListener('click', function () {
        var freshCtx = activeAdapter.getStudentContext();
        compareState.friendItems = activeAdapter.getSampleFriendItems(compareState.friendMode, freshCtx);
        compareState.simUserModified = false;
        renderCompareUI();
      });
    }

    var clearBtn = document.getElementById('compClearFriendBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        var freshCtx = activeAdapter.getStudentContext();
        compareState.friendItems = activeAdapter.getDefaultFriendItems(compareState.friendMode, freshCtx);
        compareState.simUserModified = false;
        renderCompareUI();
      });
    }

    var doImportBtn = document.getElementById('compDoImportBtn');
    var urlInput = document.getElementById('compImportUrlInput');
    var importErr = document.getElementById('compImportError');
    if (doImportBtn && urlInput) {
      doImportBtn.addEventListener('click', function () {
        var freshCtx = activeAdapter.getStudentContext();
        var res = parseFriendUrl(urlInput.value, freshCtx);
        if (res.error) {
          if (importErr) {
            importErr.textContent = res.error;
            importErr.style.display = 'block';
          }
          return;
        }
        if (importErr) importErr.style.display = 'none';
        compareState.friendMode = res.mode;
        compareState.friendItems = res.items;
        if (res.friendName && res.friendName !== 'Classmate') {
          compareState.friendName = res.friendName;
        }
        compareState.activeTab = 'manual';
        compareState.simUserModified = false;
        renderCompareUI();
      });
    }

    // What-If Simulator Controls
    var simSelect = document.getElementById('simTaskSelect');
    var simSlider = document.getElementById('simScoreSlider');
    var simScoreVal = document.getElementById('simScoreVal');

    if (simSelect) {
      simSelect.addEventListener('change', function () {
        var idx = parseInt(simSelect.value, 10);
        compareState.hypotheticalIndex = isFinite(idx) ? idx : 0;
        compareState.simUserModified = true;
        var freshCtx = activeAdapter.getStudentContext();
        var fc = activeAdapter.calculateFriend(compareState.friendItems, compareState.friendMode, freshCtx);
        if (freshCtx && fc) {
          var nextSim = activeAdapter.getSimConfig(freshCtx, compareState.hypotheticalIndex, fc);
          compareState.hypotheticalVal = nextSim.defaultVal;
        }
        renderCompareUI();
      });
    }

    if (simSlider && simScoreVal) {
      simSlider.addEventListener('input', function () {
        var rawV = parseFloat(simSlider.value);
        if (!isFinite(rawV)) return;
        compareState.hypotheticalVal = rawV;
        compareState.simUserModified = true;

        var freshCtx = activeAdapter.getStudentContext();
        var fc = activeAdapter.calculateFriend(compareState.friendItems, compareState.friendMode, freshCtx);
        if (!freshCtx || !fc) return;

        var simCfg = activeAdapter.getSimConfig(freshCtx, compareState.hypotheticalIndex, fc);
        simScoreVal.textContent = simCfg.formatSliderVal(rawV);
        var simOut = simCfg.simulate(rawV);

        var projScoreEl = document.getElementById('simProjectedScore');
        if (projScoreEl) projScoreEl.textContent = simOut.projectedDisplay;

        var gainEl = document.getElementById('simMetaGain');
        if (gainEl) {
          gainEl.textContent = simOut.changeDisplay;
          gainEl.className = 'sim-stat-val' + (simOut.changeState ? (' ' + simOut.changeState) : '');
        }

        var vsEl = document.getElementById('simMetaVs');
        if (vsEl) {
          vsEl.textContent = formatStandingVsFriend(simOut.projectedScore, fc.score, compareState.friendName || 'Classmate');
        }
      });
    }

    var shareBtn = document.getElementById('compareShareBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', function () {
        var freshCtx = activeAdapter.getStudentContext();
        var shareUrl = buildComparisonShareUrl(freshCtx || studentCtx);
        var statusMsg = document.getElementById('compStatusMessage');
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          navigator.clipboard.writeText(shareUrl).then(function () {
            if (typeof window.showAfriToast === 'function') {
              window.showAfriToast('Comparison link copied to clipboard.');
            } else if (statusMsg) {
              statusMsg.className = 'compare-feedback ok';
              statusMsg.textContent = 'Comparison link copied to clipboard.';
            }
          }).catch(function () {
            if (statusMsg) {
              statusMsg.className = 'compare-feedback';
              statusMsg.textContent = shareUrl;
            }
          });
        } else if (statusMsg) {
          statusMsg.className = 'compare-feedback ok';
          statusMsg.textContent = shareUrl;
        }
      });
    }
  }

  function checkUrlForComparisonData() {
    try {
      var query = window.location.search;
      if (!query) return;
      var params = new URLSearchParams(query);
      if (params.has('compare') || params.has('f_v0')) {
        var studentCtx = activeAdapter.getStudentContext();
        var parsed = parseFriendUrl(window.location.href, studentCtx);
        if (parsed.success && parsed.items && parsed.items.length > 0) {
          compareState.friendMode = parsed.mode;
          compareState.friendItems = parsed.items;
          if (parsed.friendName) compareState.friendName = parsed.friendName;
          if (studentCtx) {
            compareState.isOpen = true;
            renderCompareUI();
          }
        }
      }
    } catch (e) {
      // Ignore malformed URL parameters
    }
  }

  function buildEntryCardMarkup() {
    return [
      '<div class="compare-banner-content">',
      '  <h3 class="compare-banner-title">Compare Your Results with a Friend</h3>',
      '  <p class="compare-banner-desc">' + escapeHtml(activeAdapter.bannerDesc) + '</p>',
      '</div>',
      '<button type="button" id="openCompareBtn" class="compare-banner-btn" aria-expanded="false" aria-controls="compareWorkspaceSection">',
      '  <span class="compare-btn-label">Compare with a Friend</span>',
      '</button>'
    ].join('');
  }

  function handleStudentRecalculated() {
    var studentCtx = activeAdapter.getStudentContext();
    if (!studentCtx) return;

    compareState.simUserModified = false;
    // Sync friend input template count/mode if user hasn't entered friend marks yet
    var existingCalc = activeAdapter.calculateFriend(compareState.friendItems, compareState.friendMode, studentCtx);
    if (!existingCalc || existingCalc.filledCount === 0) {
      compareState.friendMode = studentCtx.mode || 'standard';
      compareState.friendItems = activeAdapter.getDefaultFriendItems(compareState.friendMode, studentCtx);
    }

    if (typeof window.afriEnsureResultSectionsOrder === 'function') {
      window.afriEnsureResultSectionsOrder();
    }

    if (compareState.isOpen) {
      renderCompareUI();
    } else {
      updateBannerButtonState();
    }
  }

  function initCompareFeature() {
    activeSlug = detectToolSlug();
    activeAdapter = ADAPTERS[activeSlug];
    if (!activeAdapter) return;

    injectCompareStyles();

    var resultsEl = document.getElementById('results');
    var calcWrap = document.querySelector('.calc-wrap .container-narrow');
    if (!resultsEl || !calcWrap) return;

    var entryCard = document.getElementById('compareEntryCard');
    if (!entryCard) {
      entryCard = document.createElement('div');
      entryCard.id = 'compareEntryCard';
      entryCard.className = 'compare-banner-card';
      entryCard.innerHTML = buildEntryCardMarkup();

      var weaknessBanner = document.getElementById('weaknessCalloutBanner');
      var shareBar = document.getElementById('afriShareBar');
      var academicProgress = document.getElementById('afriAcademicProgress');

      if (weaknessBanner && weaknessBanner.parentNode === resultsEl) {
        weaknessBanner.insertAdjacentElement('afterend', entryCard);
      } else if (shareBar && shareBar.parentNode === resultsEl) {
        shareBar.insertAdjacentElement('afterend', entryCard);
      } else if (academicProgress && academicProgress.parentNode === resultsEl) {
        academicProgress.insertAdjacentElement('afterend', entryCard);
      } else {
        resultsEl.appendChild(entryCard);
      }
    } else {
      entryCard.className = 'compare-banner-card';
      entryCard.innerHTML = buildEntryCardMarkup();
    }

    if (typeof window.afriEnsureResultSectionsOrder === 'function') {
      window.afriEnsureResultSectionsOrder();
    }

    var openBtn = document.getElementById('openCompareBtn');
    if (openBtn) {
      openBtn.onclick = function () {
        var studentCtx = activeAdapter.getStudentContext();
        if (!studentCtx) {
          var statusEl = document.getElementById('actionStatus');
          if (typeof window.showAfriToast === 'function') {
            window.showAfriToast('Calculate your results first to compare with a friend.');
          } else if (statusEl) {
            statusEl.textContent = 'Calculate your results first to compare with a friend.';
          }
          var formEl = document.getElementById(activeAdapter.formId);
          if (formEl && typeof formEl.scrollIntoView === 'function') {
            formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          return;
        }

        compareState.isOpen = !compareState.isOpen;
        renderCompareUI();

        var workspace = document.getElementById('compareWorkspaceSection');
        if (workspace) {
          workspace.style.display = compareState.isOpen ? 'block' : 'none';
          if (compareState.isOpen && typeof workspace.scrollIntoView === 'function') {
            workspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      };
    }

    var workspaceSection = document.getElementById('compareWorkspaceSection');
    if (!workspaceSection) {
      workspaceSection = document.createElement('section');
      workspaceSection.id = 'compareWorkspaceSection';
      workspaceSection.className = 'compare-workspace-wrap';
      workspaceSection.style.display = 'none';
      calcWrap.appendChild(workspaceSection);
    }

    // Bind reset / clear buttons to hide comparison cleanly
    var resetIds = activeAdapter.resetIds || [];
    for (var r = 0; r < resetIds.length; r++) {
      var rBtn = document.getElementById(resetIds[r]);
      if (rBtn && !rBtn.hasAttribute('data-compare-reset-bound')) {
        rBtn.setAttribute('data-compare-reset-bound', 'true');
        rBtn.addEventListener('click', function () {
          compareState.isOpen = false;
          compareState.simUserModified = false;
          var container = document.getElementById('compareWorkspaceSection');
          if (container) container.style.display = 'none';
          updateBannerButtonState();
        });
      }
    }

    // Listen to form calculation & button click to auto-sync live student context
    var formIdsToBind = [activeAdapter.formId].concat(activeAdapter.extraFormIds || []);
    for (var fIdx = 0; fIdx < formIdsToBind.length; fIdx++) {
      var hostForm = formIdsToBind[fIdx] ? document.getElementById(formIdsToBind[fIdx]) : null;
      if (hostForm && hostForm.tagName === 'FORM') {
        hostForm.addEventListener('submit', function () {
          setTimeout(handleStudentRecalculated, 30);
        });
      }
    }
    var calcTriggerBtn = document.getElementById('calcBtn');
    if (calcTriggerBtn) {
      calcTriggerBtn.addEventListener('click', function () {
        setTimeout(handleStudentRecalculated, 30);
      });
    }

    // Also observe #results visibility change (covers share-results.js auto-restore)
    if (typeof MutationObserver !== 'undefined') {
      var obs = new MutationObserver(function () {
        if (resultsEl.classList.contains('visible')) {
          handleStudentRecalculated();
        }
      });
      obs.observe(resultsEl, { attributes: true, attributeFilter: ['class'] });
    }

    checkUrlForComparisonData();
    // Re-check once after deferred scripts (e.g. share-results.js) restore URL marks
    setTimeout(function () {
      if (typeof window.afriEnsureResultSectionsOrder === 'function') {
        window.afriEnsureResultSectionsOrder();
      }
      checkUrlForComparisonData();
    }, 180);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCompareFeature);
  } else {
    initCompareFeature();
  }
})();
