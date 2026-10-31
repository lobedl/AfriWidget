/**
 * AfriWidget ICASS Calculator — Simplified "Compare Your Results with a Friend"
 * Pure vanilla JavaScript. Zero dependencies, zero decorative icons, client-side only.
 * Preserves DHET ICASS weighting formulas and real-time What-If simulation.
 */
(function () {
  'use strict';

  function injectCompareStyles() {
    if (document.getElementById('afriwidget-compare-styles')) return;

    var style = document.createElement('style');
    style.id = 'afriwidget-compare-styles';
    style.textContent = [
      '/* AfriWidget ICASS Compare Results — Clean Lightweight Styles */',
      '.compare-workspace-wrap { margin-top: 1.5rem; margin-bottom: 2rem; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #111827; box-sizing: border-box; }',
      '.compare-workspace-wrap *, .compare-workspace-wrap *::before, .compare-workspace-wrap *::after { box-sizing: border-box; }',

      '/* Entry Banner Card inside #results */',
      '.compare-banner-card, .compare-entry-card { margin-top: 1.25rem; margin-bottom: 1.25rem; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.875rem; padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; box-sizing: border-box; }',
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
      '.compare-card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.875rem; padding: 1.25rem; }',
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
      '@media (min-width: 640px) { .compare-tasks-grid { grid-template-columns: repeat(auto-fit, minmax(132px, 1fr)); gap: 0.75rem; } }',
      '@media (max-width: 379px) { .compare-tasks-grid { grid-template-columns: 1fr; } }',
      '.compare-task-field { display: flex; flex-direction: column; gap: 0.25rem; }',
      '.compare-task-head { display: flex; align-items: baseline; justify-content: space-between; gap: 0.375rem; font-size: 0.75rem; line-height: 1.3; }',
      '.compare-task-name { font-weight: 600; color: #1f2937; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }',
      '.compare-task-wt { color: #6b7280; font-variant-numeric: tabular-nums; flex-shrink: 0; }',
      '.compare-unit-wrap { position: relative; display: flex; align-items: center; }',
      '.comp-friend-score-input { width: 100%; min-height: 42px; padding: 0.5rem 1.75rem 0.5rem 0.625rem; font-size: 16px; font-weight: 600; font-variant-numeric: tabular-nums; border: 1px solid #d1d5db; border-radius: 0.5rem; background: #ffffff; color: #111827; font-family: inherit; }',
      '@media (min-width: 640px) { .comp-friend-score-input { font-size: 0.875rem; } }',
      '.comp-friend-score-input:focus { outline: none; border-color: #eab308; box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.2); }',
      '.compare-unit-suffix { position: absolute; right: 0.625rem; font-size: 0.75rem; font-weight: 600; color: #6b7280; pointer-events: none; }',

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

  function fmtPct(num) {
    if (num === null || num === undefined || !isFinite(num)) return '—';
    return Number(num).toFixed(2) + '%';
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
    return clean.slice(0, maxLen - 1) + '…';
  }

  function getBandLabel(score) {
    if (score >= 75) return 'Distinction';
    if (score >= 65) return 'Credit';
    if (score >= 50) return 'Pass';
    if (score >= 40) return 'Exam entry cleared';
    return 'Below 40% sub-minimum';
  }

  // Retrieve current student calculation context from page (pure, zero side effects)
  function getCurrentStudentContext() {
    if (typeof window.getIcassCalculation === 'function') {
      var ctx = window.getIcassCalculation();
      if (ctx && ctx.tasks && ctx.tasks.length > 0 && isFinite(ctx.icassAverage)) {
        return ctx;
      }
    }

    var resultsEl = document.getElementById('results');
    var icassBigEl = document.getElementById('icassBig');
    if (resultsEl && resultsEl.classList.contains('visible') && icassBigEl) {
      var txt = icassBigEl.textContent.replace('%', '').trim();
      var avg = parseFloat(txt);
      if (isFinite(avg)) {
        var currentMode = 'standard';
        var tabTrimester = document.getElementById('tabTrimester');
        var tabCustom = document.getElementById('tabCustom');
        if (tabTrimester && tabTrimester.classList.contains('active')) currentMode = 'trimester';
        if (tabCustom && tabCustom.classList.contains('active')) currentMode = 'custom';

        var tasks = [];
        if (currentMode === 'standard') {
          tasks = [
            { name: 'Class Test 1', weight: 10, score: parseFloat(document.getElementById('stdTest1').value) },
            { name: 'Assignment 1', weight: 25, score: parseFloat(document.getElementById('stdAssign1').value) },
            { name: 'Class Test 2', weight: 10, score: parseFloat(document.getElementById('stdTest2').value) },
            { name: 'Assignment 2', weight: 25, score: parseFloat(document.getElementById('stdAssign2').value) },
            { name: 'Trial / Preparatory Exam', weight: 30, score: parseFloat(document.getElementById('stdTrial').value) }
          ];
        } else if (currentMode === 'trimester') {
          tasks = [
            { name: 'Class Test', weight: 30, score: parseFloat(document.getElementById('trimTest').value) },
            { name: 'Assignment', weight: 20, score: parseFloat(document.getElementById('trimAssign').value) },
            { name: 'Internal Exam', weight: 50, score: parseFloat(document.getElementById('trimExam').value) }
          ];
        } else {
          tasks = [
            { name: 'Assignment', weight: parseFloat(document.getElementById('custAssignWeight').value) || 25, score: parseFloat(document.getElementById('custAssignScore').value) },
            { name: 'Practical', weight: parseFloat(document.getElementById('custPracWeight').value) || 35, score: parseFloat(document.getElementById('custPracScore').value) },
            { name: 'Test', weight: parseFloat(document.getElementById('custTestWeight').value) || 30, score: parseFloat(document.getElementById('custTestScore').value) },
            { name: 'Attendance / Other', weight: parseFloat(document.getElementById('custAttWeight').value) || 10, score: parseFloat(document.getElementById('custAttScore').value) }
          ];
        }

        var validTasks = tasks.map(function (t) {
          return {
            name: t.name,
            weight: isFinite(t.weight) ? t.weight : 0,
            score: isFinite(t.score) && t.score >= 0 && t.score <= 100 ? t.score : null
          };
        });

        return {
          mode: currentMode,
          icassAverage: avg,
          eligible: avg >= 40,
          tasks: validTasks
        };
      }
    }
    return null;
  }

  // DHET weighted ICASS average calculation
  function calculateWeightedAverage(tasks) {
    if (!tasks || tasks.length === 0) return null;
    var totalWeight = 0;
    var weightedSum = 0;
    var filledCount = 0;

    for (var i = 0; i < tasks.length; i++) {
      var t = tasks[i];
      totalWeight += t.weight;
      if (t.score !== null && isFinite(t.score)) {
        weightedSum += t.score * (t.weight / 100);
        filledCount++;
      }
    }

    if (filledCount === 0) return null;
    var avg = totalWeight > 0 ? (weightedSum / (totalWeight / 100)) : 0;
    return {
      average: Math.round(avg * 100) / 100,
      weightedSum: Math.round(weightedSum * 100) / 100,
      totalWeight: totalWeight,
      filledCount: filledCount,
      eligible: avg >= 40
    };
  }

  function getDefaultTasks(mode, studentCtx) {
    if (mode === 'trimester') {
      return [
        { id: 'f_trimTest', name: 'Class Test', weight: 30, score: null },
        { id: 'f_trimAssign', name: 'Assignment', weight: 20, score: null },
        { id: 'f_trimExam', name: 'Internal Exam', weight: 50, score: null }
      ];
    }
    if (mode === 'custom') {
      if (studentCtx && studentCtx.mode === 'custom' && studentCtx.tasks && studentCtx.tasks.length > 0) {
        return studentCtx.tasks.map(function (t, idx) {
          return { id: 'f_cust_' + idx, name: t.name, weight: t.weight, score: null };
        });
      }
      return [
        { id: 'f_custAssign', name: 'Assignment', weight: 25, score: null },
        { id: 'f_custPrac', name: 'Practical', weight: 35, score: null },
        { id: 'f_custTest', name: 'Test', weight: 30, score: null },
        { id: 'f_custAtt', name: 'Attendance / Other', weight: 10, score: null }
      ];
    }
    return [
      { id: 'f_stdTest1', name: 'Class Test 1', weight: 10, score: null },
      { id: 'f_stdAssign1', name: 'Assignment 1', weight: 25, score: null },
      { id: 'f_stdTest2', name: 'Class Test 2', weight: 10, score: null },
      { id: 'f_stdAssign2', name: 'Assignment 2', weight: 25, score: null },
      { id: 'f_stdTrial', name: 'Trial / Preparatory Exam', weight: 30, score: null }
    ];
  }

  var compareState = {
    isOpen: false,
    activeTab: 'manual',
    studentName: 'You',
    friendName: 'Classmate',
    moduleName: 'TVET Coursework',
    friendMode: 'standard',
    friendTasks: [],
    hypotheticalTaskIndex: 0,
    hypotheticalScore: 75,
    simUserModified: false,
    feedbackMsg: '',
    feedbackOk: false
  };

  function buildComparisonShareUrl() {
    try {
      var base = window.location.href.split('?')[0];
      var url = new URL(base);
      url.searchParams.set('compare', '1');
      url.searchParams.set('f_name', compareState.studentName || 'Classmate');
      if (compareState.moduleName) {
        url.searchParams.set('f_mod', compareState.moduleName);
      }

      var studentCtx = getCurrentStudentContext();
      if (studentCtx && studentCtx.tasks) {
        url.searchParams.set('f_mode', studentCtx.mode || 'standard');
        for (var i = 0; i < studentCtx.tasks.length; i++) {
          var t = studentCtx.tasks[i];
          if (t.score !== null && isFinite(t.score)) {
            url.searchParams.set('f_t' + i, String(t.score));
            url.searchParams.set('f_w' + i, String(t.weight));
            url.searchParams.set('f_n' + i, t.name);
          }
        }
      }
      return url.toString();
    } catch (e) {
      return window.location.href;
    }
  }

  function parseFriendUrl(urlStr) {
    try {
      var cleanUrl = (urlStr || '').trim();
      if (!cleanUrl) return { error: 'Paste a shared AfriWidget result link first.' };

      var query = '';
      if (cleanUrl.indexOf('?') !== -1) {
        query = cleanUrl.split('?')[1];
      } else if (cleanUrl.indexOf('=') !== -1) {
        query = cleanUrl;
      } else {
        return { error: 'No ICASS task scores were found in this link.' };
      }

      var params = new URLSearchParams(query);
      var mode = params.get('f_mode') || params.get('mode') || 'standard';
      var friendName = params.get('f_name') || params.get('name') || 'Classmate';
      var moduleName = params.get('f_mod') || params.get('subject') || '';
      var tasks = [];

      if (params.has('f_t0') || params.has('f_t1')) {
        var idx = 0;
        while (params.has('f_t' + idx)) {
          var sc = parseFloat(params.get('f_t' + idx));
          var wt = parseFloat(params.get('f_w' + idx)) || 20;
          var nm = params.get('f_n' + idx) || ('Task ' + (idx + 1));
          tasks.push({
            id: 'f_custom_' + idx,
            name: nm,
            weight: wt,
            score: isFinite(sc) ? Math.max(0, Math.min(100, sc)) : null
          });
          idx++;
        }
      } else if (params.has('stdTest1') || params.has('stdAssign1') || params.has('stdTrial')) {
        mode = 'standard';
        var t1 = parseFloat(params.get('stdTest1'));
        var a1 = parseFloat(params.get('stdAssign1'));
        var t2 = parseFloat(params.get('stdTest2'));
        var a2 = parseFloat(params.get('stdAssign2'));
        var tr = parseFloat(params.get('stdTrial'));

        tasks = [
          { id: 'f_stdTest1', name: 'Class Test 1', weight: 10, score: isFinite(t1) ? t1 : null },
          { id: 'f_stdAssign1', name: 'Assignment 1', weight: 25, score: isFinite(a1) ? a1 : null },
          { id: 'f_stdTest2', name: 'Class Test 2', weight: 10, score: isFinite(t2) ? t2 : null },
          { id: 'f_stdAssign2', name: 'Assignment 2', weight: 25, score: isFinite(a2) ? a2 : null },
          { id: 'f_stdTrial', name: 'Trial / Preparatory Exam', weight: 30, score: isFinite(tr) ? tr : null }
        ];
      } else if (params.has('trimTest') || params.has('trimAssign') || params.has('trimExam')) {
        mode = 'trimester';
        var tt = parseFloat(params.get('trimTest'));
        var ta = parseFloat(params.get('trimAssign'));
        var te = parseFloat(params.get('trimExam'));

        tasks = [
          { id: 'f_trimTest', name: 'Class Test', weight: 30, score: isFinite(tt) ? tt : null },
          { id: 'f_trimAssign', name: 'Assignment', weight: 20, score: isFinite(ta) ? ta : null },
          { id: 'f_trimExam', name: 'Internal Exam', weight: 50, score: isFinite(te) ? te : null }
        ];
      } else if (params.has('custAssignScore') || params.has('custPracScore') || params.has('custTestScore')) {
        mode = 'custom';
        var ca = parseFloat(params.get('custAssignScore'));
        var cp = parseFloat(params.get('custPracScore'));
        var ct = parseFloat(params.get('custTestScore'));
        var cat = parseFloat(params.get('custAttScore'));
        tasks = [
          { id: 'f_custAssign', name: 'Assignment', weight: parseFloat(params.get('custAssignWeight')) || 25, score: isFinite(ca) ? ca : null },
          { id: 'f_custPrac', name: 'Practical', weight: parseFloat(params.get('custPracWeight')) || 35, score: isFinite(cp) ? cp : null },
          { id: 'f_custTest', name: 'Test', weight: parseFloat(params.get('custTestWeight')) || 30, score: isFinite(ct) ? ct : null },
          { id: 'f_custAtt', name: 'Attendance / Other', weight: parseFloat(params.get('custAttWeight')) || 10, score: isFinite(cat) ? cat : null }
        ];
      } else {
        return { error: 'No recognizable ICASS task scores were found in this link.' };
      }

      var filled = tasks.filter(function (t) { return t.score !== null && isFinite(t.score); });
      if (filled.length === 0) {
        return { error: 'The link did not include any filled task scores.' };
      }

      return {
        success: true,
        mode: mode,
        friendName: friendName,
        moduleName: moduleName,
        tasks: tasks
      };
    } catch (e) {
      return { error: 'Could not read that link. Check the URL or enter marks manually.' };
    }
  }

  // Practical action step tailored to the specific DHET assessment type
  function getPracticalStepForTask(taskName) {
    var lower = String(taskName || '').toLowerCase();
    if (lower.indexOf('trial') !== -1 || lower.indexOf('exam') !== -1) {
      return 'work through two timed past DHET question papers and focus on the highest-mark calculation questions first.';
    }
    if (lower.indexOf('prac') !== -1) {
      return 'check every practical rubric criterion before your workshop session so you do not drop avoidable sign-off marks.';
    }
    if (lower.indexOf('assign') !== -1) {
      return 'cross-check every question against your module outcomes before submission, as guided assignments are the easiest high-weight marks to bank.';
    }
    if (lower.indexOf('test') !== -1) {
      return 'redo the topic exercises where you lost marks under timed conditions before the next class test.';
    }
    return 'confirm all logbook entries and marked scripts are signed and filed in your Portfolio of Evidence.';
  }

  // Compute the single highest-value personalized tip & recommended simulator target
  function computeBestImprovementTip(studentCtx, friendScore, friendName) {
    var tasks = (studentCtx && studentCtx.tasks) ? studentCtx.tasks : [];
    var candidates = [];

    for (var i = 0; i < tasks.length; i++) {
      var t = tasks[i];
      if (!t || !(t.weight > 0)) continue;
      var isUnentered = (t.score === null || !isFinite(t.score));
      var curScore = isUnentered ? 0 : t.score;
      var missedWeightedPts = (100 - curScore) * (t.weight / 100);
      var fTask = compareState.friendTasks[i];
      var fVal = (fTask && fTask.score !== null && isFinite(fTask.score)) ? fTask.score : curScore;

      candidates.push({
        index: i,
        name: t.name,
        weight: t.weight,
        curScore: curScore,
        isUnentered: isUnentered,
        missedWeightedPts: missedWeightedPts,
        friendLeadOnTask: fVal - curScore
      });
    }

    if (candidates.length === 0) {
      return {
        bestIndex: 0,
        suggestedScore: 75,
        html: 'Check your preliminary ICASS sheet during campus verification to confirm all weighted marks are captured accurately.'
      };
    }

    candidates.sort(function (a, b) {
      if (Math.abs(b.missedWeightedPts - a.missedWeightedPts) > 0.05) {
        return b.missedWeightedPts - a.missedWeightedPts;
      }
      if (b.weight !== a.weight) return b.weight - a.weight;
      return b.friendLeadOnTask - a.friendLeadOnTask;
    });

    var best = candidates[0];
    var studentScore = studentCtx.icassAverage;
    var scoreDiff = studentScore - friendScore;
    var curLabel = best.isUnentered ? 'not yet entered (0%)' : (best.curScore.toFixed(0) + '%');
    var stepText = getPracticalStepForTask(best.name);

    // Near-perfect across all tasks
    if (best.missedWeightedPts <= 0.25) {
      return {
        bestIndex: best.index,
        suggestedScore: 100,
        html: 'Your tasks are already near full marks. Next step: verify your printed preliminary ICASS sheet and ensure every marked script is signed inside your Portfolio of Evidence before TVETMIS lock.'
      };
    }

    var target = 75;
    if (studentScore < 40) {
      var needFor40 = 40 - studentScore;
      var req40 = Math.ceil(best.curScore + (needFor40 / (best.weight / 100)));
      target = req40 <= 100 ? Math.max(req40, Math.min(100, Math.round(best.curScore + 15))) : Math.min(95, Math.max(70, Math.round(best.curScore + 25)));
      var gain40 = ((target - best.curScore) * (best.weight / 100)).toFixed(2);
      var clearsEntry = (studentScore + parseFloat(gain40)) >= 40;
      return {
        bestIndex: best.index,
        suggestedScore: target,
        html: '<strong>' + escapeHtml(best.name) + ' (' + best.weight + '% weight, ' + curLabel + ')</strong> is your highest-value task: reaching <strong>' + target + '%</strong> adds <strong>+' + gain40 + ' points</strong>' + (clearsEntry ? ' and clears the 40% DHET exam-entry minimum' : ' toward the 40% DHET exam-entry minimum') + '. Next step: ' + stepText
      };
    }

    if (scoreDiff < -0.05) {
      var neededToPassFriend = Math.ceil(best.curScore + ((Math.abs(scoreDiff) + 0.5) / (best.weight / 100)));
      if (neededToPassFriend > best.curScore && neededToPassFriend <= 92) {
        target = neededToPassFriend;
        var overtakeGain = ((target - best.curScore) * (best.weight / 100)).toFixed(2);
        return {
          bestIndex: best.index,
          suggestedScore: target,
          html: '<strong>' + escapeHtml(best.name) + ' (' + best.weight + '% weight, ' + curLabel + ')</strong> offers your biggest return: lifting it to <strong>' + target + '%</strong> adds <strong>+' + overtakeGain + ' overall points</strong> and moves you ahead of ' + escapeHtml(friendName) + '. Next step: ' + stepText
        };
      }
      target = Math.min(95, Math.max(75, Math.round(best.curScore + 14)));
      if (target <= best.curScore) target = Math.min(100, Math.ceil(best.curScore + 5));
      var closeGain = ((target - best.curScore) * (best.weight / 100)).toFixed(2);
      return {
        bestIndex: best.index,
        suggestedScore: target,
        html: '<strong>' + escapeHtml(best.name) + ' (' + best.weight + '% weight, ' + curLabel + ')</strong> carries your largest upside: raising it to <strong>' + target + '%</strong> adds <strong>+' + closeGain + ' overall points</strong> to cut ' + escapeHtml(friendName) + '\'s lead. Next step: ' + stepText
      };
    }

    target = Math.min(95, Math.max(75, Math.round(best.curScore + 12)));
    if (target <= best.curScore) target = Math.min(100, Math.ceil(best.curScore + 5));
    var boostGain = ((target - best.curScore) * (best.weight / 100)).toFixed(2);
    return {
      bestIndex: best.index,
      suggestedScore: target,
      html: '<strong>' + escapeHtml(best.name) + ' (' + best.weight + '% weight, ' + curLabel + ')</strong> has the most room to lift your mark: raising it to <strong>' + target + '%</strong> banks <strong>+' + boostGain + ' overall ICASS points</strong> and lowers your national exam target. Next step: ' + stepText
    };
  }

  function formatStandingVsFriend(projectedAvg, friendScore, friendName) {
    var diff = projectedAvg - friendScore;
    if (diff > 0.05) {
      return 'Ahead of ' + friendName + ' by ' + diff.toFixed(2) + ' pts';
    }
    if (diff < -0.05) {
      return Math.abs(diff).toFixed(2) + ' pts behind ' + friendName;
    }
    return 'Tied with ' + friendName;
  }

  function renderComparisonSvg(studentName, studentScore, friendName, friendScore) {
    var sClamped = Math.min(100, Math.max(0, studentScore));
    var fClamped = Math.min(100, Math.max(0, friendScore));
    var sBarW = sClamped > 0 && sClamped < 1.5 ? 1.5 : sClamped;
    var fBarW = fClamped > 0 && fClamped < 1.5 ? 1.5 : fClamped;

    var sLabel = escapeHtml(truncateLabel(studentName, 22));
    var fLabel = escapeHtml(truncateLabel(friendName, 22));
    var aria = escapeHtml(studentName + ' ' + fmtPct(studentScore) + ' versus ' + friendName + ' ' + fmtPct(friendScore));

    return [
      '<div class="compare-svg-wrap">',
      '  <svg class="compare-svg" width="100%" height="120" role="img" aria-label="' + aria + '">',
      '    <line x1="40%" y1="18" x2="40%" y2="92" stroke="#9ca3af" stroke-width="1" stroke-dasharray="3,3" />',
      '    <line x1="75%" y1="18" x2="75%" y2="92" stroke="#d1d5db" stroke-width="1" stroke-dasharray="3,3" />',
      '    <text x="0%" y="14" font-size="13" font-weight="700" fill="#111827">' + sLabel + '</text>',
      '    <text x="100%" y="14" text-anchor="end" font-size="13" font-weight="700" fill="#111827" style="font-variant-numeric:tabular-nums;">' + fmtPct(studentScore) + '</text>',
      '    <rect x="0" y="22" width="100%" height="16" rx="4" fill="#f3f4f6" />',
      '    <rect x="0" y="22" width="' + sBarW.toFixed(2) + '%" height="16" rx="4" fill="#facc15" stroke="#eab308" stroke-width="0.75" />',
      '    <text x="0%" y="60" font-size="13" font-weight="600" fill="#374151">' + fLabel + '</text>',
      '    <text x="100%" y="60" text-anchor="end" font-size="13" font-weight="700" fill="#374151" style="font-variant-numeric:tabular-nums;">' + fmtPct(friendScore) + '</text>',
      '    <rect x="0" y="68" width="100%" height="16" rx="4" fill="#f3f4f6" />',
      '    <rect x="0" y="68" width="' + fBarW.toFixed(2) + '%" height="16" rx="4" fill="#374151" />',
      '    <text x="0%" y="110" text-anchor="start" font-size="11" fill="#6b7280">0%</text>',
      '    <text x="40%" y="110" text-anchor="middle" font-size="11" font-weight="600" fill="#4b5563">40% Entry</text>',
      '    <text x="75%" y="110" text-anchor="middle" font-size="11" fill="#6b7280">75% Dist.</text>',
      '    <text x="100%" y="110" text-anchor="end" font-size="11" fill="#6b7280">100%</text>',
      '  </svg>',
      '</div>'
    ].join('');
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

  function renderCompareUI() {
    var container = document.getElementById('compareWorkspaceSection');
    if (!container) return;

    updateBannerButtonState();

    var studentCtx = getCurrentStudentContext();
    if (!studentCtx) {
      container.innerHTML = [
        '<div class="compare-card compare-empty-state">',
        '  <h3 class="compare-empty-title">Calculate Your ICASS Average First</h3>',
        '  <p class="compare-empty-desc">Enter your assessment marks above and calculate your ICASS average to compare against a classmate.</p>',
        '  <button type="button" id="compareGoToCalcBtn" class="comp-btn-primary compare-empty-btn">Go to Calculator</button>',
        '</div>'
      ].join('');

      var goToCalcBtn = document.getElementById('compareGoToCalcBtn');
      if (goToCalcBtn) {
        goToCalcBtn.addEventListener('click', function () {
          var form = document.getElementById('icassForm');
          if (form && typeof form.scrollIntoView === 'function') {
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }
      return;
    }

    if (compareState.friendTasks.length === 0) {
      compareState.friendMode = studentCtx.mode || 'standard';
      compareState.friendTasks = getDefaultTasks(compareState.friendMode, studentCtx);
    }

    var friendCalc = calculateWeightedAverage(compareState.friendTasks);
    var hasFriendData = friendCalc !== null && friendCalc.filledCount > 0;
    var studentScore = studentCtx.icassAverage;
    var friendScore = hasFriendData ? friendCalc.average : null;

    var sName = compareState.studentName || 'You';
    var fName = compareState.friendName || 'Classmate';

    var tipData = null;
    if (hasFriendData) {
      tipData = computeBestImprovementTip(studentCtx, friendScore, fName);
      if (!compareState.simUserModified) {
        compareState.hypotheticalTaskIndex = tipData.bestIndex;
        compareState.hypotheticalScore = tipData.suggestedScore;
      } else if (compareState.hypotheticalTaskIndex >= studentCtx.tasks.length) {
        compareState.hypotheticalTaskIndex = 0;
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

    // Toolbar: Manual vs Link Import + Format selector when manual
    html.push('    <div class="compare-toolbar">');
    html.push('      <div class="compare-seg" role="tablist" aria-label="Friend mark entry method">');
    html.push('        <button type="button" id="tabCompManual" class="compare-seg-btn ' + (compareState.activeTab === 'manual' ? 'active' : '') + '" role="tab" aria-selected="' + (compareState.activeTab === 'manual') + '">Enter Marks</button>');
    html.push('        <button type="button" id="tabCompImport" class="compare-seg-btn ' + (compareState.activeTab === 'import' ? 'active' : '') + '" role="tab" aria-selected="' + (compareState.activeTab === 'import') + '">Paste Link</button>');
    html.push('      </div>');

    html.push('      <div id="compFormatBar" class="compare-seg" style="' + (compareState.activeTab === 'manual' ? 'display:inline-flex;' : 'display:none;') + '" aria-label="Friend assessment format">');
    html.push('        <button type="button" class="compare-seg-btn comp-mode-btn ' + (compareState.friendMode === 'standard' ? 'active' : '') + '" data-mode="standard">Semester (5)</button>');
    html.push('        <button type="button" class="compare-seg-btn comp-mode-btn ' + (compareState.friendMode === 'trimester' ? 'active' : '') + '" data-mode="trimester">Trimester (3)</button>');
    html.push('        <button type="button" class="compare-seg-btn comp-mode-btn ' + (compareState.friendMode === 'custom' ? 'active' : '') + '" data-mode="custom">Custom</button>');
    html.push('      </div>');
    html.push('    </div>');

    // Manual Panel
    html.push('    <div id="compManualPanel" style="' + (compareState.activeTab === 'manual' ? 'display:block;' : 'display:none;') + '">');
    html.push('      <div class="compare-tasks-grid">');
    for (var i = 0; i < compareState.friendTasks.length; i++) {
      var task = compareState.friendTasks[i];
      var val = (task.score !== null && isFinite(task.score)) ? task.score : '';
      html.push('        <div class="compare-task-field">');
      html.push('          <div class="compare-task-head">');
      html.push('            <label class="compare-task-name" for="compTaskInp_' + i + '" title="' + escapeHtml(task.name) + '">' + escapeHtml(task.name) + '</label>');
      html.push('            <span class="compare-task-wt">' + task.weight + '%</span>');
      html.push('          </div>');
      html.push('          <div class="compare-unit-wrap">');
      html.push('            <input type="number" id="compTaskInp_' + i + '" min="0" max="100" step="any" inputmode="decimal" class="comp-friend-score-input" data-task-idx="' + i + '" value="' + val + '" placeholder="0–100" />');
      html.push('            <span class="compare-unit-suffix">%</span>');
      html.push('          </div>');
      html.push('        </div>');
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

    // Results Output: 1) Overall Score vs Friend + 2) Clean SVG Visual + 3) Short Value Tip + 4) Simplified What-If Simulator
    if (hasFriendData) {
      var scoreDiff = studentScore - friendScore;
      var diffAbs = Math.abs(scoreDiff).toFixed(2);
      var verdictHtml = '';
      if (scoreDiff > 0.05) {
        verdictHtml = escapeHtml(sName) + (sName.toLowerCase() === 'you' ? ' are' : ' is') + ' ahead of ' + escapeHtml(fName) + ' by <span class="compare-verdict-pts">' + diffAbs + ' percentage points</span>.';
      } else if (scoreDiff < -0.05) {
        verdictHtml = escapeHtml(fName) + ' is ahead by <span class="compare-verdict-pts">' + diffAbs + ' percentage points</span>.';
      } else {
        verdictHtml = escapeHtml(sName) + ' and ' + escapeHtml(fName) + ' are tied at <span class="compare-verdict-pts">' + fmtPct(studentScore) + '</span>.';
      }

      html.push('  <div class="compare-results-stack" id="compareResultsSection">');

      // 1 & 2. Overall Score Comparison + Single Clean SVG Visual
      html.push('    <div class="compare-summary-box">');
      html.push('      <p class="compare-verdict">' + verdictHtml + '</p>');
      html.push('      <div class="compare-scores-row">');
      html.push('        <div class="compare-score-col">');
      html.push('          <span class="compare-score-person">' + escapeHtml(sName) + '</span>');
      html.push('          <span class="compare-score-val">' + fmtPct(studentScore) + '</span>');
      html.push('          <span class="compare-score-meta">' + escapeHtml(getBandLabel(studentScore)) + '</span>');
      html.push('        </div>');
      html.push('        <div class="compare-score-col">');
      html.push('          <span class="compare-score-person">' + escapeHtml(fName) + '</span>');
      html.push('          <span class="compare-score-val">' + fmtPct(friendScore) + '</span>');
      html.push('          <span class="compare-score-meta">' + escapeHtml(getBandLabel(friendScore)) + '</span>');
      html.push('        </div>');
      html.push('      </div>');
      html.push(renderComparisonSvg(sName, studentScore, fName, friendScore));
      html.push('    </div>');

      // 3. One Short, Personalized Value Tip
      html.push('    <div class="compare-tip-box">');
      html.push('      <span class="compare-tip-kicker">Most Valuable Area to Improve</span>');
      html.push('      <p class="compare-tip-text">' + tipData.html + '</p>');
      html.push('    </div>');

      // 4. Simplified What-If Simulator
      var studentTasks = studentCtx.tasks || [];
      var simTargetTask = studentTasks[compareState.hypotheticalTaskIndex] || studentTasks[0];
      var simNewScore = compareState.hypotheticalScore;
      var simOldScore = (simTargetTask && simTargetTask.score !== null && isFinite(simTargetTask.score)) ? simTargetTask.score : 0;
      var simWeight = simTargetTask ? simTargetTask.weight : 0;
      var simPointsGain = (simNewScore - simOldScore) * (simWeight / 100);
      var simProjectedAverage = Math.round((studentScore + simPointsGain) * 100) / 100;
      var gainSign = simPointsGain >= 0 ? '+' : '';
      var gainClass = simPointsGain > 0.005 ? ' pos' : (simPointsGain < -0.005 ? ' neg' : '');
      var standingText = formatStandingVsFriend(simProjectedAverage, friendScore, fName);

      html.push('    <div class="compare-sim-box">');
      html.push('      <div class="compare-sim-head">');
      html.push('        <h3 class="compare-sim-title">What-If Simulator</h3>');
      html.push('      </div>');
      html.push('      <div class="compare-sim-controls">');
      html.push('        <div class="compare-field">');
      html.push('          <label class="compare-label" for="simTaskSelect">Task</label>');
      html.push('          <select id="simTaskSelect" class="compare-input">');
      for (var sIdx = 0; sIdx < studentTasks.length; sIdx++) {
        var sT = studentTasks[sIdx];
        var curStr = (sT.score !== null && isFinite(sT.score)) ? (sT.score + '%') : '0%';
        var isSelected = (sIdx === compareState.hypotheticalTaskIndex) ? 'selected' : '';
        html.push('            <option value="' + sIdx + '" ' + isSelected + '>' + escapeHtml(sT.name) + ' (' + sT.weight + '% · now ' + curStr + ')</option>');
      }
      html.push('          </select>');
      html.push('        </div>');
      html.push('        <div class="compare-field">');
      html.push('          <div class="compare-sim-slider-head">');
      html.push('            <label class="compare-label" for="simScoreSlider">Target Score</label>');
      html.push('            <span id="simScoreVal" class="compare-sim-val">' + simNewScore + '%</span>');
      html.push('          </div>');
      html.push('          <input type="range" id="simScoreSlider" min="0" max="100" step="1" value="' + simNewScore + '" class="compare-sim-range" />');
      html.push('        </div>');
      html.push('      </div>');

      html.push('      <div class="compare-sim-readout">');
      html.push('        <div class="sim-stat">');
      html.push('          <span class="sim-stat-label">Projected ICASS</span>');
      html.push('          <span id="simProjectedScore" class="sim-stat-val">' + fmtPct(simProjectedAverage) + '</span>');
      html.push('        </div>');
      html.push('        <div class="sim-stat">');
      html.push('          <span class="sim-stat-label">Overall Change</span>');
      html.push('          <span id="simMetaGain" class="sim-stat-val' + gainClass + '">' + gainSign + simPointsGain.toFixed(2) + ' pts</span>');
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

    attachCompareEventListeners();
  }

  function attachCompareEventListeners() {
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
        var friendCalc = calculateWeightedAverage(compareState.friendTasks);
        if (friendCalc && friendCalc.filledCount > 0) renderCompareUI();
      });
    }

    var fNameInput = document.getElementById('compFriendName');
    if (fNameInput) {
      fNameInput.addEventListener('input', function () {
        compareState.friendName = (this.value || 'Classmate').trim();
      });
      fNameInput.addEventListener('change', function () {
        var friendCalc = calculateWeightedAverage(compareState.friendTasks);
        if (friendCalc && friendCalc.filledCount > 0) renderCompareUI();
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

    var modeBtns = document.querySelectorAll('.comp-mode-btn');
    modeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var m = this.getAttribute('data-mode');
        if (m && m !== compareState.friendMode) {
          var studentCtx = getCurrentStudentContext();
          compareState.friendMode = m;
          compareState.friendTasks = getDefaultTasks(m, studentCtx);
          compareState.simUserModified = false;
          renderCompareUI();
        }
      });
    });

    var scoreInputs = document.querySelectorAll('.comp-friend-score-input');
    scoreInputs.forEach(function (inp) {
      inp.addEventListener('input', function () {
        var idx = parseInt(this.getAttribute('data-task-idx'), 10);
        var val = parseFloat(this.value);
        if (compareState.friendTasks[idx]) {
          compareState.friendTasks[idx].score = isFinite(val) ? Math.max(0, Math.min(100, val)) : null;
        }
      });
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          var btn = document.getElementById('compCalculateBtn');
          if (btn) btn.click();
        }
      });
    });

    var calcBtn = document.getElementById('compCalculateBtn');
    if (calcBtn) {
      calcBtn.addEventListener('click', function () {
        var hasValid = compareState.friendTasks.some(function (t) { return t.score !== null && isFinite(t.score); });
        var statusMsg = document.getElementById('compStatusMessage');
        if (!hasValid) {
          if (statusMsg) {
            statusMsg.className = 'compare-feedback';
            statusMsg.textContent = 'Enter at least one task score for your friend first.';
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
        var studentCtx = getCurrentStudentContext();
        if (compareState.friendMode === 'standard') {
          compareState.friendTasks = [
            { id: 'f_stdTest1', name: 'Class Test 1', weight: 10, score: 65 },
            { id: 'f_stdAssign1', name: 'Assignment 1', weight: 25, score: 75 },
            { id: 'f_stdTest2', name: 'Class Test 2', weight: 10, score: 70 },
            { id: 'f_stdAssign2', name: 'Assignment 2', weight: 25, score: 72 },
            { id: 'f_stdTrial', name: 'Trial / Preparatory Exam', weight: 30, score: 60 }
          ];
        } else if (compareState.friendMode === 'trimester') {
          compareState.friendTasks = [
            { id: 'f_trimTest', name: 'Class Test', weight: 30, score: 68 },
            { id: 'f_trimAssign', name: 'Assignment', weight: 20, score: 78 },
            { id: 'f_trimExam', name: 'Internal Exam', weight: 50, score: 64 }
          ];
        } else {
          var baseCustom = getDefaultTasks('custom', studentCtx);
          var sampleScores = [72, 68, 64, 85];
          compareState.friendTasks = baseCustom.map(function (t, idx) {
            return { id: t.id, name: t.name, weight: t.weight, score: sampleScores[idx % sampleScores.length] };
          });
        }
        compareState.simUserModified = false;
        renderCompareUI();
      });
    }

    var clearBtn = document.getElementById('compClearFriendBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        var studentCtx = getCurrentStudentContext();
        compareState.friendTasks = getDefaultTasks(compareState.friendMode, studentCtx);
        compareState.simUserModified = false;
        renderCompareUI();
      });
    }

    var doImportBtn = document.getElementById('compDoImportBtn');
    var urlInput = document.getElementById('compImportUrlInput');
    var importErr = document.getElementById('compImportError');

    if (doImportBtn && urlInput) {
      doImportBtn.addEventListener('click', function () {
        var res = parseFriendUrl(urlInput.value);
        if (res.error) {
          if (importErr) {
            importErr.textContent = res.error;
            importErr.style.display = 'block';
          }
          return;
        }
        if (importErr) importErr.style.display = 'none';
        compareState.friendMode = res.mode;
        compareState.friendTasks = res.tasks;
        if (res.friendName && res.friendName !== 'Classmate') {
          compareState.friendName = res.friendName;
        }
        if (res.moduleName) {
          compareState.moduleName = res.moduleName;
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
        var idx = parseInt(this.value, 10);
        compareState.hypotheticalTaskIndex = isFinite(idx) ? idx : 0;
        compareState.simUserModified = true;

        var studentCtx = getCurrentStudentContext();
        if (studentCtx && studentCtx.tasks && studentCtx.tasks[compareState.hypotheticalTaskIndex]) {
          var chosen = studentCtx.tasks[compareState.hypotheticalTaskIndex];
          var cur = (chosen.score !== null && isFinite(chosen.score)) ? chosen.score : 0;
          compareState.hypotheticalScore = cur < 90 ? Math.min(100, Math.round(cur + 10)) : 100;
        }
        renderCompareUI();
      });
    }

    if (simSlider && simScoreVal) {
      simSlider.addEventListener('input', function () {
        compareState.hypotheticalScore = parseInt(this.value, 10);
        compareState.simUserModified = true;
        simScoreVal.textContent = compareState.hypotheticalScore + '%';

        var studentCtx = getCurrentStudentContext();
        var friendCalc = calculateWeightedAverage(compareState.friendTasks);
        if (studentCtx && studentCtx.tasks && friendCalc) {
          var targetTask = studentCtx.tasks[compareState.hypotheticalTaskIndex] || studentCtx.tasks[0];
          var oldScore = (targetTask && targetTask.score !== null && isFinite(targetTask.score)) ? targetTask.score : 0;
          var weight = targetTask ? targetTask.weight : 0;
          var pointsGain = (compareState.hypotheticalScore - oldScore) * (weight / 100);
          var projectedAvg = Math.round((studentCtx.icassAverage + pointsGain) * 100) / 100;

          var projScoreEl = document.getElementById('simProjectedScore');
          if (projScoreEl) projScoreEl.textContent = fmtPct(projectedAvg);

          var gainEl = document.getElementById('simMetaGain');
          if (gainEl) {
            var sign = pointsGain >= 0 ? '+' : '';
            gainEl.textContent = sign + pointsGain.toFixed(2) + ' pts';
            gainEl.className = 'sim-stat-val' + (pointsGain > 0.005 ? ' pos' : (pointsGain < -0.005 ? ' neg' : ''));
          }

          var vsEl = document.getElementById('simMetaVs');
          if (vsEl) {
            vsEl.textContent = formatStandingVsFriend(projectedAvg, friendCalc.average, compareState.friendName || 'Classmate');
          }
        }
      });
    }

    var shareBtn = document.getElementById('compareShareBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', function () {
        var shareUrl = buildComparisonShareUrl();
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
      if (params.has('compare') || params.has('f_t0') || params.has('f_scores')) {
        var parsed = parseFriendUrl(window.location.href);
        if (parsed.success && parsed.tasks.length > 0) {
          compareState.friendMode = parsed.mode;
          compareState.friendTasks = parsed.tasks;
          if (parsed.friendName) compareState.friendName = parsed.friendName;
          if (parsed.moduleName) compareState.moduleName = parsed.moduleName;

          var studentCtx = getCurrentStudentContext();
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
      '  <p class="compare-banner-desc">See how your overall ICASS average compares with a classmate and get your highest-value next step.</p>',
      '</div>',
      '<button type="button" id="openCompareBtn" class="compare-banner-btn" aria-expanded="false" aria-controls="compareWorkspaceSection">',
      '  <span class="compare-btn-label">Compare with a Friend</span>',
      '</button>'
    ].join('');
  }

  function initCompareFeature() {
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
      if (typeof window.afriEnsureResultSectionsOrder === 'function') {
        window.afriEnsureResultSectionsOrder();
      }
    } else {
      entryCard.className = 'compare-banner-card';
      entryCard.innerHTML = buildEntryCardMarkup();
      if (typeof window.afriEnsureResultSectionsOrder === 'function') {
        window.afriEnsureResultSectionsOrder();
      }
    }

    var openBtn = document.getElementById('openCompareBtn');
    if (openBtn) {
      openBtn.onclick = function () {
        var studentCtx = getCurrentStudentContext();
        if (!studentCtx) {
          var statusEl = document.getElementById('actionStatus');
          if (typeof window.showAfriToast === 'function') {
            window.showAfriToast('Calculate your ICASS average first to compare your results.');
          } else if (statusEl) {
            statusEl.textContent = 'Calculate your ICASS average first to compare your results.';
          }
          var form = document.getElementById('icassForm');
          if (form && typeof form.scrollIntoView === 'function') {
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

    var calcResetBtn = document.getElementById('resetBtn');
    if (calcResetBtn && !calcResetBtn.hasAttribute('data-compare-reset-bound')) {
      calcResetBtn.setAttribute('data-compare-reset-bound', 'true');
      calcResetBtn.addEventListener('click', function () {
        compareState.isOpen = false;
        compareState.simUserModified = false;
        var container = document.getElementById('compareWorkspaceSection');
        if (container) container.style.display = 'none';
        updateBannerButtonState();
      });
    }

    checkUrlForComparisonData();
  }

  window.addEventListener('icassCalculated', function () {
    compareState.simUserModified = false;
    if (compareState.isOpen) {
      renderCompareUI();
    } else {
      updateBannerButtonState();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCompareFeature);
  } else {
    initCompareFeature();
  }
})();
