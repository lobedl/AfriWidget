/**
 * AfriWidget ICASS Calculator — "Compare Results with a Friend & Get Ahead" Engine
 * Pure vanilla JavaScript. Zero dependencies, zero emojis, zero tracking.
 * 100% deterministic calculations, client-side privacy, Canvas card export,
 * and actionable TVET student improvement analytics.
 */
(function () {
  'use strict';

  function injectCompareStyles() {
    if (document.getElementById('afriwidget-compare-styles')) return;

    var style = document.createElement('style');
    style.id = 'afriwidget-compare-styles';
    style.textContent = [
      '/* AfriWidget ICASS Compare Results — Professional Styles */',
      '.compare-workspace-wrap { margin-top: 2rem; margin-bottom: 2.5rem; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #111827; box-sizing: border-box; }',
      '.compare-workspace-wrap *, .compare-workspace-wrap *::before, .compare-workspace-wrap *::after { box-sizing: border-box; }',

      '/* Redesigned Compare Banner Bar */',
      '.compare-banner-card, .compare-entry-card { margin-top: 1.25rem; margin-bottom: 1.25rem; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.875rem; padding: 1.25rem 1.5rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04); display: flex; flex-direction: column; gap: 1rem; box-sizing: border-box; }',
      '@media (min-width: 640px) { .compare-banner-card, .compare-entry-card { flex-direction: row; align-items: center; justify-content: space-between; padding: 1.25rem 1.75rem; gap: 1.5rem; } }',
      '.compare-banner-content, .compare-entry-content { flex: 1; min-width: 0; }',
      '.compare-banner-title, .compare-entry-title { font-size: 1.0625rem; font-weight: 700; color: #111827; letter-spacing: -0.01em; line-height: 1.3; margin: 0 0 0.25rem 0; }',
      '.compare-banner-desc, .compare-entry-desc { font-size: 0.875rem; color: #4b5563; line-height: 1.5; margin: 0; }',
      '.compare-banner-btn, .compare-entry-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; background: #ffffff; color: #000000; border: 1px solid #000000; font-weight: 700; font-size: 0.9375rem; border-radius: 0.5rem; padding: 0.875rem 1.5rem; min-height: 50px; cursor: pointer; white-space: nowrap; transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.1s ease; flex-shrink: 0; box-sizing: border-box; font-family: inherit; }',
      '.compare-banner-btn:hover, .compare-entry-btn:hover { background: #f9fafb; color: #000000; }',
      '.compare-banner-btn:active, .compare-entry-btn:active { transform: scale(0.99); }',
      '.compare-banner-btn.active, .compare-entry-btn.active { background: #111827; color: #ffffff; border-color: #111827; }',
      '.compare-banner-btn.active svg, .compare-entry-btn.active svg { stroke: #facc15; }',
      '.compare-banner-btn svg, .compare-entry-btn svg { width: 1.125rem; height: 1.125rem; stroke: #f59e0b; flex-shrink: 0; }',
      '@media (max-width: 639px) { .compare-banner-btn, .compare-entry-btn { width: 100%; } }',

      '/* Comparison Workspace Main Container */',
      '.compare-card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.875rem; padding: 1.25rem; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05); margin-bottom: 1.5rem; }',
      '@media (min-width: 640px) { .compare-card { padding: 1.75rem 2rem; } }',
      '.compare-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 1.25rem; margin-bottom: 1.5rem; }',
      '.compare-header-info { flex: 1; min-width: 0; }',
      '.compare-eyebrow { display: inline-block; font-size: 0.6875rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: #ca8a04; margin-bottom: 0.375rem; }',
      '.compare-title { font-size: 1.375rem; font-weight: 900; color: #111827; letter-spacing: -0.02em; line-height: 1.25; margin: 0 0 0.5rem 0; }',
      '@media (min-width: 640px) { .compare-title { font-size: 1.5rem; } }',
      '.compare-subtitle { font-size: 0.875rem; color: #4b5563; line-height: 1.5; margin: 0; }',
      '.compare-close-btn { width: 2.25rem; height: 2.25rem; display: inline-flex; align-items: center; justify-content: center; border-radius: 0.375rem; border: 1px solid #e5e7eb; background: #ffffff; color: #4b5563; font-size: 1.5rem; cursor: pointer; line-height: 1; transition: all 0.15s ease; flex-shrink: 0; }',
      '.compare-close-btn:hover { background: #000000; color: #ffffff; border-color: #000000; }',

      '/* Empty State (when user clicks before calculating) */',
      '.compare-empty-state { text-align: center; padding: 2.5rem 1.5rem; }',
      '.compare-empty-icon { margin: 0 auto 1rem auto; display: flex; justify-content: center; }',
      '.compare-empty-title { font-size: 1.25rem; font-weight: 800; color: #111827; margin: 0 0 0.5rem 0; }',
      '.compare-empty-desc { font-size: 0.875rem; color: #4b5563; max-width: 520px; margin: 0 auto 1.5rem auto; line-height: 1.55; }',
      '.compare-empty-btn { max-width: 280px; margin: 0 auto; }',

      '/* Setup & Inputs Panel */',
      '.compare-setup-panel { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1.25rem; margin-bottom: 1.5rem; }',
      '.compare-section-heading { font-size: 1rem; font-weight: 800; color: #111827; margin: 0 0 1rem 0; }',
      '.compare-meta-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; margin-bottom: 1rem; }',
      '@media (min-width: 640px) { .compare-meta-grid { grid-template-columns: 1fr 1fr; } }',
      '.compare-field-full { grid-column: 1 / -1; }',
      '.compare-meta-grid .field { display: flex; flex-direction: column; gap: 0.375rem; }',
      '.compare-meta-grid .field-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #374151; }',
      '.compare-tabs-wrap { border-top: 1px solid #e5e7eb; padding-top: 1rem; }',
      '.compare-tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; }',
      '.compare-tab { padding: 0.5rem 1rem; font-size: 0.8125rem; font-weight: 700; color: #4b5563; background: #ffffff; border: 1px solid #d1d5db; border-radius: 0.375rem; cursor: pointer; transition: all 0.15s ease; font-family: inherit; }',
      '.compare-tab.active { color: #000000; background: #fef08a; border-color: #facc15; }',
      '.compare-mode-selector-row { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }',
      '@media (min-width: 640px) { .compare-mode-selector-row { flex-direction: row; align-items: center; } }',
      '.compare-mode-label { font-size: 0.8125rem; font-weight: 700; color: #374151; min-width: 170px; }',
      '.compare-mode-pills { display: flex; flex-wrap: wrap; gap: 0.375rem; }',
      '.comp-mode-btn { padding: 0.375rem 0.75rem; font-size: 0.75rem; font-weight: 700; background: #ffffff; border: 1px solid #d1d5db; border-radius: 0.375rem; color: #4b5563; cursor: pointer; transition: all 0.15s ease; font-family: inherit; }',
      '.comp-mode-btn.active { background: #000000; color: #ffffff; border-color: #000000; }',
      '.compare-tasks-entry-grid { display: grid; grid-template-columns: 1fr; gap: 0.75rem; margin-bottom: 1.25rem; }',
      '@media (min-width: 640px) { .compare-tasks-entry-grid { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); } }',
      '.compare-task-input-card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; }',
      '.compare-task-input-head { display: flex; justify-content: space-between; align-items: baseline; gap: 0.5rem; }',
      '.compare-task-name { font-size: 0.8125rem; font-weight: 800; color: #111827; line-height: 1.3; }',
      '.compare-task-weight { font-size: 0.6875rem; font-weight: 700; color: #6b7280; background: #f3f4f6; padding: 0.125rem 0.375rem; border-radius: 0.25rem; white-space: nowrap; }',
      '.input-unit-wrap { position: relative; display: flex; align-items: center; }',
      '.comp-friend-score-input { width: 100%; padding: 0.5rem 2rem 0.5rem 0.75rem; font-size: 0.9375rem; font-weight: 700; border: 1px solid #d1d5db; border-radius: 0.375rem; background: #ffffff; color: #111827; font-family: inherit; box-sizing: border-box; }',
      '.comp-friend-score-input:focus { outline: none; border-color: #facc15; box-shadow: 0 0 0 2px rgba(250, 204, 21, 0.25); }',
      '.input-unit-suffix { position: absolute; right: 0.75rem; font-size: 0.8125rem; font-weight: 700; color: #6b7280; pointer-events: none; }',
      '.compare-actions-row { display: flex; flex-wrap: wrap; gap: 0.625rem; align-items: center; margin-top: 1rem; }',
      '.compare-status-text { font-size: 0.8125rem; color: #dc2626; font-weight: 600; width: 100%; margin-top: 0.5rem; }',
      '.compare-import-desc { font-size: 0.8125rem; color: #4b5563; margin: 0 0 0.75rem 0; line-height: 1.5; }',
      '.compare-import-row { display: flex; flex-direction: column; gap: 0.5rem; }',
      '@media (min-width: 640px) { .compare-import-row { flex-direction: row; } }',
      '.compare-import-error { font-size: 0.8125rem; color: #dc2626; background: #fef2f2; border: 1px solid #fecaca; border-radius: 0.375rem; padding: 0.625rem 0.875rem; margin-top: 0.5rem; }',

      '/* Overall Performance Side-by-Side Cards */',
      '.compare-cards-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; margin-bottom: 1.5rem; }',
      '@media (min-width: 640px) { .compare-cards-grid { grid-template-columns: 1fr 1fr; } }',
      '.compare-student-card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1.25rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04); display: flex; flex-direction: column; gap: 0.75rem; position: relative; }',
      '.compare-card-student { border-top: 4px solid #facc15; }',
      '.compare-card-friend { border-top: 4px solid #1f2937; }',
      '.compare-card-badge { display: inline-block; font-size: 0.6875rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; padding: 0.2rem 0.5rem; border-radius: 0.25rem; width: fit-content; }',
      '.student-badge { background: #fef08a; color: #854d0e; }',
      '.friend-badge { background: #e5e7eb; color: #1f2937; }',
      '.compare-card-name { font-size: 1.25rem; font-weight: 900; color: #111827; margin: 0; line-height: 1.2; }',
      '.compare-card-meta { font-size: 0.75rem; color: #6b7280; }',
      '.compare-card-score-row { display: flex; align-items: baseline; justify-content: space-between; gap: 0.5rem; }',
      '.compare-card-score-big { font-size: 2.25rem; font-weight: 900; line-height: 1; letter-spacing: -0.02em; }',
      '.student-score { color: #000000; }',
      '.friend-score { color: #111827; }',
      '.compare-card-status { font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.625rem; border-radius: 0.375rem; text-align: right; }',
      '.compare-bar-track { width: 100%; height: 10px; background: #e5e7eb; border-radius: 9999px; overflow: hidden; }',
      '.compare-bar-fill { height: 100%; border-radius: 9999px; transition: width 0.3s ease; }',
      '.student-fill { background: #facc15; }',
      '.friend-fill { background: #1f2937; }',
      '.compare-card-footer { font-size: 0.75rem; color: #6b7280; display: flex; justify-content: space-between; }',

      '/* Differential Gap Banner */',
      '.compare-gap-banner { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.625rem; padding: 1rem 1.25rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.875rem; }',
      '.compare-gap-icon { width: 2rem; height: 2rem; border-radius: 50%; background: #ffffff; border: 1px solid #d1d5db; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #ca8a04; }',
      '.compare-gap-text { font-size: 0.875rem; color: #1f2937; line-height: 1.5; }',

      '/* Section Box Layout */',
      '.compare-section-box { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1.25rem; margin-bottom: 1.5rem; }',
      '@media (min-width: 640px) { .compare-section-box { padding: 1.5rem; } }',
      '.compare-section-head-row { display: flex; flex-direction: column; gap: 0.75rem; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; }',
      '@media (min-width: 640px) { .compare-section-head-row { flex-direction: row; align-items: center; } }',
      '.compare-section-sub { font-size: 0.8125rem; color: #4b5563; margin: 0 0 1rem 0; line-height: 1.5; }',
      '.compare-legend { display: flex; gap: 1rem; font-size: 0.75rem; font-weight: 700; color: #4b5563; }',
      '.legend-item { display: inline-flex; align-items: center; gap: 0.375rem; }',
      '.legend-dot { width: 10px; height: 10px; border-radius: 50%; }',
      '.student-dot { background: #facc15; }',
      '.friend-dot { background: #1f2937; }',

      '/* Task-by-Task Component Bars */',
      '.compare-task-bars-list { display: flex; flex-direction: column; gap: 1rem; }',
      '.compare-task-bar-item { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1rem; }',
      '.compare-task-bar-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.625rem; }',
      '.compare-task-bar-title { font-size: 0.875rem; font-weight: 800; color: #111827; }',
      '.compare-task-bar-meta { font-size: 0.75rem; font-weight: 700; color: #6b7280; display: inline-flex; align-items: center; gap: 0.5rem; }',
      '.compare-leader-tag { font-size: 0.6875rem; font-weight: 800; text-transform: uppercase; padding: 0.15rem 0.4rem; border-radius: 0.25rem; }',
      '.leader-student { background: #fef08a; color: #854d0e; }',
      '.leader-friend { background: #e5e7eb; color: #1f2937; }',
      '.leader-tie { background: #f3f4f6; color: #6b7280; }',
      '.compare-bar-dual-row { display: grid; grid-template-columns: 80px 1fr 65px; gap: 0.5rem; align-items: center; margin-bottom: 0.375rem; }',
      '.compare-bar-label { font-size: 0.6875rem; font-weight: 700; color: #4b5563; text-transform: uppercase; letter-spacing: 0.05em; }',
      '.compare-bar-track-wrap { width: 100%; height: 8px; background: #e5e7eb; border-radius: 9999px; overflow: hidden; }',
      '.compare-bar-num { font-size: 0.75rem; font-weight: 800; color: #111827; text-align: right; }',

      '/* Performance Insights Grid */',
      '.compare-insights-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }',
      '@media (min-width: 640px) { .compare-insights-grid { grid-template-columns: 1fr 1fr; } }',
      '.compare-insight-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.625rem; padding: 1.125rem; }',
      '.compare-card-full { grid-column: 1 / -1; }',
      '.insight-head { font-size: 0.8125rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; color: #111827; }',
      '.insight-icon { display: inline-flex; align-items: center; justify-content: center; }',
      '.insight-strength .insight-head { color: #15803d; }',
      '.insight-opportunity .insight-head { color: #b45309; }',
      '.insight-gap .insight-head { color: #000000; }',
      '.insight-text { font-size: 0.8125rem; color: #374151; line-height: 1.5; margin-bottom: 0.5rem; }',
      '.insight-bullets { font-size: 0.8125rem; color: #374151; padding-left: 1.25rem; list-style-type: disc; line-height: 1.5; margin: 0; }',

      '/* How You Can Improve & Lost Marks */',
      '.compare-lost-marks-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.625rem; padding: 1.125rem; margin-bottom: 1.25rem; }',
      '.compare-lost-title { font-size: 0.9375rem; font-weight: 800; color: #111827; margin: 0 0 0.25rem 0; }',
      '.compare-lost-desc { font-size: 0.8125rem; color: #4b5563; margin: 0 0 0.875rem 0; line-height: 1.5; }',
      '.compare-lost-list { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 0.875rem; }',
      '.compare-lost-item { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.375rem; padding: 0.625rem 0.875rem; display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; }',
      '.compare-lost-task { font-size: 0.8125rem; font-weight: 700; color: #111827; display: block; }',
      '.compare-lost-weight { font-size: 0.6875rem; color: #6b7280; display: block; }',
      '.compare-lost-pts { font-size: 0.875rem; font-weight: 800; color: #dc2626; }',
      '.compare-highest-target-box { background: #fefce8; border: 1px solid #fef08a; border-radius: 0.375rem; padding: 0.75rem 1rem; font-size: 0.8125rem; color: #854d0e; line-height: 1.5; }',
      '.compare-plan-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; margin-top: 1rem; }',
      '@media (min-width: 640px) { .compare-plan-grid { grid-template-columns: 1fr 1fr; } }',
      '.compare-plan-card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.625rem; padding: 1.125rem; display: flex; flex-direction: column; gap: 0.375rem; }',
      '.compare-plan-num { width: 1.75rem; height: 1.75rem; border-radius: 50%; background: #000000; color: #ffffff; font-size: 0.75rem; font-weight: 800; display: flex; align-items: center; justify-content: center; margin-bottom: 0.25rem; }',
      '.compare-plan-title { font-size: 0.875rem; font-weight: 800; color: #111827; margin: 0; }',
      '.compare-plan-text { font-size: 0.8125rem; color: #4b5563; line-height: 1.5; margin: 0; }',

      '/* What-If Simulator */',
      '.compare-sim-container { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1.25rem; }',
      '.compare-sim-title { font-size: 0.9375rem; font-weight: 800; color: #111827; margin: 0 0 0.25rem 0; }',
      '.compare-sim-desc { font-size: 0.8125rem; color: #4b5563; margin: 0 0 1rem 0; line-height: 1.5; }',
      '.compare-sim-controls { display: grid; grid-template-columns: 1fr; gap: 1rem; margin-bottom: 1.25rem; }',
      '@media (min-width: 640px) { .compare-sim-controls { grid-template-columns: 1.2fr 1fr; } }',
      '.compare-sim-field { display: flex; flex-direction: column; gap: 0.375rem; }',
      '.compare-sim-slider-label-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.25rem; }',
      '.compare-sim-val { font-size: 0.875rem; font-weight: 800; color: #111827; background: #ffffff; padding: 0.125rem 0.5rem; border: 1px solid #d1d5db; border-radius: 0.25rem; }',
      '.compare-sim-result-card { background: #ffffff; border: 1.5px solid #facc15; border-radius: 0.625rem; padding: 1.125rem 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; }',
      '@media (min-width: 640px) { .compare-sim-result-card { flex-direction: row; align-items: center; justify-content: space-between; } }',
      '.sim-score-box { display: flex; flex-direction: column; gap: 0.25rem; }',
      '.sim-label { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }',
      '.sim-projected-score { font-size: 2rem; font-weight: 900; color: #000000; line-height: 1; }',
      '.sim-meta-row { display: flex; flex-direction: column; gap: 0.25rem; text-align: left; }',
      '@media (min-width: 640px) { .sim-meta-row { text-align: right; } }',
      '.sim-meta-gain { font-size: 0.9375rem; font-weight: 800; }',
      '.sim-meta-gain.pos { color: #16a34a; }',
      '.sim-meta-gain.neg { color: #dc2626; }',
      '.sim-meta-band { font-size: 0.8125rem; font-weight: 700; color: #4b5563; }',

      '/* Shareable Social Canvas Card */',
      '.compare-export-preview-wrap { width: 100%; overflow-x: auto; background: #f3f4f6; border-radius: 0.5rem; padding: 0.5rem; margin-bottom: 1rem; border: 1px solid #e5e7eb; display: flex; justify-content: center; box-sizing: border-box; }',
      '.compare-canvas { max-width: 100%; height: auto; border-radius: 0.375rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); display: block; }',
      '.compare-export-actions { display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; align-items: center; }',
      '.compare-export-actions .btn-primary { width: auto; margin-top: 0; min-height: 44px; padding: 0.625rem 1.25rem; font-size: 0.875rem; }',
      '.compare-export-actions .btn-secondary { width: auto; min-height: 44px; padding: 0.625rem 1.25rem; font-size: 0.875rem; }'
    ].join('\n');

    style.textContent += [
      '',
      '/* AfriWidget gold-and-ink comparison refresh */',
      '.compare-workspace-wrap { --cmp-ink: #111827; --cmp-gold: #facc15; width: 100%; min-width: 0; color: var(--cmp-ink); }',
      '.compare-workspace-wrap button, .compare-workspace-wrap input, .compare-workspace-wrap select { font: inherit; }',
      '.compare-banner-card { position: relative; overflow: hidden; border-color: #f0d875; background: linear-gradient(110deg, #fffbea 0%, #ffffff 72%); box-shadow: 0 8px 24px rgba(17, 24, 39, .055); }',
      '.compare-banner-card::before { content: ""; position: absolute; inset: 0 auto 0 0; width: 5px; background: var(--cmp-gold); }',
      '.compare-banner-title { font-size: 1.125rem; font-weight: 850; letter-spacing: -.025em; }',
      '.compare-banner-btn, .compare-entry-btn { color: #111827; border-color: #111827; background: #facc15; box-shadow: 0 2px 0 #a16207; }',
      '.compare-banner-btn:hover, .compare-entry-btn:hover { background: #fde047; border-color: #111827; color: #111827; }',
      '.compare-banner-btn svg, .compare-entry-btn svg { stroke: #111827; }',
      '.compare-banner-btn.active, .compare-entry-btn.active { background: #111827; border-color: #111827; color: #ffffff; box-shadow: 0 2px 0 #a16207; }',
      '.compare-main-card { padding: 0; overflow: hidden; border-color: #e5e7eb; border-radius: 1rem; box-shadow: 0 12px 34px rgba(17, 24, 39, .07); }',
      '.compare-main-card > .compare-setup-panel, .compare-main-card > .compare-results-section { margin-left: 1.25rem; margin-right: 1.25rem; }',
      '.compare-header { margin: 0 0 1.25rem; padding: 1.5rem 1.25rem; border: 0; border-bottom: 4px solid #facc15; background: linear-gradient(125deg, #111827 0%, #252b35 100%); }',
      '.compare-eyebrow { color: #facc15; letter-spacing: .14em; }',
      '.compare-title { color: #ffffff; letter-spacing: -.035em; }',
      '.compare-subtitle { color: #d1d5db; max-width: 680px; }',
      '.compare-close-btn { color: #ffffff; border-color: rgba(255,255,255,.24); background: rgba(255,255,255,.08); }',
      '.compare-close-btn:hover { color: #111827; background: #facc15; border-color: #facc15; }',
      '.compare-setup-panel { background: #f9fafb; border-color: #e5e7eb; }',
      '.compare-section-heading { font-size: 1rem; letter-spacing: -.015em; }',
      '.compare-meta-grid .form-input, .compare-import-row .form-input, .comp-friend-score-input { min-width: 0; min-height: 46px; border-color: #d1d5db; border-radius: .625rem; }',
      '.compare-meta-grid .form-input:focus, .compare-import-row .form-input:focus, .comp-friend-score-input:focus, .compare-workspace-wrap select:focus { outline: 3px solid rgba(250, 204, 21, .3); outline-offset: 1px; border-color: #ca8a04; box-shadow: none; }',
      '.compare-tabs { padding: 4px; border: 1px solid #e5e7eb; border-radius: .75rem; background: #f3f4f6; }',
      '.compare-tab { flex: 1; min-height: 42px; border-color: transparent; border-radius: .55rem; }',
      '.compare-tab.active { color: #111827; background: #ffffff; border-color: #e5e7eb; box-shadow: 0 1px 3px rgba(17,24,39,.1); }',
      '.comp-mode-btn { min-height: 38px; border-radius: 999px; }',
      '.comp-mode-btn.active { color: #111827; background: #facc15; border-color: #eab308; }',
      '.compare-task-input-card { border-radius: .75rem; padding: .875rem; }',
      '.compare-actions-row { gap: .625rem; }',
      '.compare-actions-row .btn-primary, .compare-actions-row .btn-secondary, .compare-export-actions .btn-primary, .compare-export-actions .btn-secondary { width: auto; min-height: 44px; margin: 0; padding: .65rem 1rem; border-radius: .625rem; font-size: .875rem; }',
      '.compare-actions-row .btn-primary, .compare-export-actions .btn-primary { color: #111827; background: #facc15; box-shadow: inset 0 0 0 1px #eab308; }',
      '.compare-actions-row .btn-primary:hover, .compare-export-actions .btn-primary:hover { background: #fde047; }',
      '.compare-actions-row .btn-secondary, .compare-export-actions .btn-secondary { border-color: #d1d5db; }',
      '.compare-status-text { color: #b42318; }',
      '.compare-cards-grid { gap: .875rem; }',
      '.compare-student-card { min-width: 0; border-color: #e5e7eb; border-radius: .875rem; padding: 1.125rem; box-shadow: 0 4px 14px rgba(17,24,39,.045); }',
      '.compare-card-student { border-top: 4px solid #facc15; }',
      '.compare-card-friend { border-top: 4px solid #374151; }',
      '.compare-empty-icon svg { stroke: #ca8a04; }',
      '.compare-task-bar-top { align-items: flex-start; flex-wrap: wrap; }',
      '.compare-task-bar-meta { flex-wrap: wrap; justify-content: flex-end; max-width: 100%; }',
      '.student-badge { color: #713f12; background: #fef3c7; }',
      '.friend-badge { color: #374151; background: #f3f4f6; }',
      '.compare-card-name { overflow-wrap: anywhere; letter-spacing: -.025em; }',
      '.student-score { color: #111827; }',
      '.compare-bar-track { height: 9px; background: #eef0f3; }',
      '.student-fill { background: #eab308; }',
      '.friend-fill { background: #374151; }',
      '.compare-gap-banner { align-items: flex-start; border-color: #f0d875; background: #fffbeb; border-radius: .75rem; }',
      '.compare-gap-icon { color: #854d0e; border-color: #f0d875; background: #ffffff; }',
      '.compare-section-box { min-width: 0; border-color: #e5e7eb; border-radius: .875rem; box-shadow: 0 3px 12px rgba(17,24,39,.035); }',
      '.compare-task-bar-item, .compare-insight-card, .compare-lost-marks-card, .compare-sim-container { border-radius: .75rem; }',
      '.compare-bar-dual-row { grid-template-columns: minmax(48px, 78px) minmax(0, 1fr) minmax(52px, 62px); gap: .5rem; }',
      '.compare-bar-label { overflow-wrap: anywhere; }',
      '.compare-task-incomplete { border-style: dashed; background: #ffffff; }',
      '.compare-task-incomplete .compare-bar-track-wrap { background: #f3f4f6; }',
      '.compare-workspace-wrap input[aria-invalid="true"] { border-color: #b42318; box-shadow: 0 0 0 2px rgba(180, 35, 24, .12); }',
      '.compare-verdict { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 1rem; margin: 0 0 1rem; padding: 1.125rem 1.25rem; border: 1px solid #303846; border-radius: .875rem; background: linear-gradient(125deg, #111827, #252b35); color: #ffffff; }',
      '.compare-verdict-copy { min-width: 0; }',
      '.compare-verdict-kicker { display: block; margin-bottom: .25rem; color: #facc15; font-size: .6875rem; font-weight: 850; letter-spacing: .13em; text-transform: uppercase; }',
      '.compare-verdict-title { margin: 0; color: #ffffff; font-size: 1.125rem; font-weight: 850; letter-spacing: -.025em; line-height: 1.3; }',
      '.compare-verdict-detail { margin: .3rem 0 0; color: #d1d5db; font-size: .8125rem; line-height: 1.5; }',
      '.compare-verdict-number { color: #facc15; font-size: clamp(1.45rem, 4vw, 2rem); font-weight: 900; line-height: 1; letter-spacing: -.04em; text-align: right; white-space: nowrap; }',
      '.compare-verdict-number small { display: block; margin-top: .35rem; color: #d1d5db; font-size: .65rem; font-weight: 750; letter-spacing: .08em; text-transform: uppercase; }',
      '.compare-verdict.is-tied .compare-verdict-number { color: #ffffff; }',
      '.compare-export-preview-wrap { overflow: hidden; background: #f3f4f6; border-radius: .75rem; }',
      '.compare-canvas { width: 100%; }',
      '.compare-workspace-wrap :focus-visible { outline: 3px solid #ca8a04; outline-offset: 3px; }',
      '@media (max-width: 639px) { .compare-main-card > .compare-setup-panel, .compare-main-card > .compare-results-section { margin-left: .75rem; margin-right: .75rem; } .compare-header { padding: 1.25rem .875rem; } .compare-verdict { grid-template-columns: minmax(0, 1fr); gap: .7rem; } .compare-verdict-number { text-align: left; } .compare-tabs { flex-direction: column; } .compare-tab { width: 100%; } .compare-actions-row .btn-primary, .compare-actions-row .btn-secondary, .compare-export-actions .btn-primary, .compare-export-actions .btn-secondary { flex: 1 1 100%; } .compare-card-footer { flex-wrap: wrap; gap: .35rem .75rem; } }',
      '@media (prefers-reduced-motion: reduce) { .compare-workspace-wrap *, .compare-workspace-wrap *::before, .compare-workspace-wrap *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; animation-duration: .01ms !important; } }'
    ].join('\n');

    document.head.appendChild(style);
  }

  var STORAGE_KEY = 'afriwidget_icass_compare_state';

  // Standard TVET NATED / NC(V) Subjects for quick context selection
  var TVET_POPULAR_MODULES = [
    'Mathematics (N1–N6)',
    'Engineering Science (N1–N4)',
    'Industrial Electronics (N1–N6)',
    'Electrical Trade Theory (N1–N3)',
    'Mechanotechnology (N3)',
    'Electrotechnics (N4–N6)',
    'Power Machines (N5–N6)',
    'Financial Accounting (N4–N6)',
    'Management Communication (N4)',
    'Cost & Management Accounting (N5–N6)',
    'Public Administration (N4–N6)',
    'Computer Practice (N4–N6)',
    'Office Practice (N4–N6)',
    'Entrepreneurship & Business Management (N4–N6)'
  ];

  // Helper: Format percentages cleanly
  function fmtPct(num) {
    if (num === null || num === undefined || !isFinite(num)) return '—';
    return Number(num).toFixed(2) + '%';
  }

  function fmtPts(num) {
    if (num === null || num === undefined || !isFinite(num)) return '—';
    return Number(num).toFixed(2) + ' pts';
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function normalizeTaskName(name) {
    return String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function getTaskComparison(studentTasks, friendTasks) {
    var usedFriendTasks = [];
    var pairs = [];
    var unmatchedStudentTasks = [];

    (studentTasks || []).forEach(function (studentTask) {
      var studentKey = normalizeTaskName(studentTask.name);
      var friendIndex = (friendTasks || []).findIndex(function (friendTask, index) {
        return !usedFriendTasks[index] && studentKey && normalizeTaskName(friendTask.name) === studentKey;
      });

      if (friendIndex === -1) {
        unmatchedStudentTasks.push(studentTask);
        return;
      }

      usedFriendTasks[friendIndex] = true;
      pairs.push({ student: studentTask, friend: friendTasks[friendIndex] });
    });

    return {
      pairs: pairs,
      unmatchedStudentTasks: unmatchedStudentTasks,
      unmatchedFriendTasks: (friendTasks || []).filter(function (_, index) { return !usedFriendTasks[index]; })
    };
  }

  function getBand(score) {
    if (score >= 75) return { name: 'Distinction Band', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' };
    if (score >= 65) return { name: 'Credit Band', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' };
    if (score >= 50) return { name: 'Pass Band', color: '#ca8a04', bg: '#fefce8', border: '#fef08a' };
    if (score >= 40) return { name: 'Exam Entry (40% cleared)', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa' };
    return { name: 'Below 40% Sub-minimum', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' };
  }

  // Retrieve current student calculation context from page (PURE function with zero side effects)
  function getCurrentStudentContext() {
    if (typeof window.getIcassCalculation === 'function') {
      var ctx = window.getIcassCalculation();
      if (ctx && ctx.tasks && ctx.tasks.length > 0 && isFinite(ctx.icassAverage)) {
        return ctx;
      }
    }

    // Fallback: Read values directly from DOM if calculation ran
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

  // Calculate weighted ICASS average for any array of tasks
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
    var avg = (totalWeight > 0) ? (weightedSum / (totalWeight / 100)) : 0;
    return {
      average: Math.round(avg * 100) / 100,
      weightedSum: Math.round(weightedSum * 100) / 100,
      totalWeight: totalWeight,
      filledCount: filledCount,
      eligible: avg >= 40
    };
  }

  // Default tasks for each syllabus mode
  function getDefaultTasks(mode) {
    if (mode === 'trimester') {
      return [
        { id: 'f_trimTest', name: 'Class Test', weight: 30, score: null },
        { id: 'f_trimAssign', name: 'Assignment', weight: 20, score: null },
        { id: 'f_trimExam', name: 'Internal Exam', weight: 50, score: null }
      ];
    }
    if (mode === 'custom') {
      return [
        { id: 'f_custAssign', name: 'Assignment', weight: 25, score: null },
        { id: 'f_custPrac', name: 'Practical', weight: 35, score: null },
        { id: 'f_custTest', name: 'Test', weight: 30, score: null },
        { id: 'f_custAtt', name: 'Attendance / Other', weight: 10, score: null }
      ];
    }
    // Semester standard (default DHET Report 191)
    return [
      { id: 'f_stdTest1', name: 'Class Test 1', weight: 10, score: null },
      { id: 'f_stdAssign1', name: 'Assignment 1', weight: 25, score: null },
      { id: 'f_stdTest2', name: 'Class Test 2', weight: 10, score: null },
      { id: 'f_stdAssign2', name: 'Assignment 2', weight: 25, score: null },
      { id: 'f_stdTrial', name: 'Trial / Preparatory Exam', weight: 30, score: null }
    ];
  }

  // Global Compare state
  var compareState = {
    isOpen: false,
    activeTab: 'manual', // 'manual' or 'import'
    studentName: 'You',
    friendName: 'Classmate',
    moduleName: 'TVET Coursework',
    friendMode: 'standard',
    friendTasks: [],
    hypotheticalTaskIndex: 0,
    hypotheticalScore: 75,
    importUrl: '',
    importError: null,
    friendLoadedFromUrl: false
  };

  // Helper: Build a shareable comparison URL with friend scores pre-encoded
  function buildComparisonShareUrl() {
    try {
      var base = window.location.href.split('?')[0];
      var url = new URL(base);
      url.searchParams.set('compare', '1');
      url.searchParams.set('f_name', compareState.studentName || 'Classmate');
      url.searchParams.set('f_mod', compareState.moduleName || 'TVET Coursework');

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

  // Helper: Parse any AfriWidget URL or query string for friend marks
  function parseFriendUrl(urlStr) {
    try {
      var cleanUrl = (urlStr || '').trim();
      if (!cleanUrl) return { error: 'Please enter a valid result-sharing URL.' };

      var query = '';
      if (cleanUrl.indexOf('?') !== -1) {
        query = cleanUrl.split('?')[1];
      } else if (cleanUrl.indexOf('=') !== -1) {
        query = cleanUrl;
      } else {
        return { error: 'The URL does not contain any query parameters with ICASS scores.' };
      }

      var params = new URLSearchParams(query);
      var mode = params.get('f_mode') || params.get('mode') || 'standard';
      var friendName = params.get('f_name') || params.get('name') || 'Classmate';
      var moduleName = params.get('f_mod') || params.get('subject') || '';
      var tasks = [];

      // Check format A: Specific friend comparison parameters (f_t0, f_t1...)
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
      }
      // Check format B: Standard 5-task AfriWidget params
      else if (params.has('stdTest1') || params.has('stdAssign1') || params.has('stdTrial')) {
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
      }
      // Check format C: Trimester 3-task AfriWidget params
      else if (params.has('trimTest') || params.has('trimAssign') || params.has('trimExam')) {
        mode = 'trimester';
        var tt = parseFloat(params.get('trimTest'));
        var ta = parseFloat(params.get('trimAssign'));
        var te = parseFloat(params.get('trimExam'));

        tasks = [
          { id: 'f_trimTest', name: 'Class Test', weight: 30, score: isFinite(tt) ? tt : null },
          { id: 'f_trimAssign', name: 'Assignment', weight: 20, score: isFinite(ta) ? ta : null },
          { id: 'f_trimExam', name: 'Internal Exam', weight: 50, score: isFinite(te) ? te : null }
        ];
      }
      // Check format D: Custom 4-task AfriWidget params
      else if (params.has('custAssignScore') || params.has('custPracScore') || params.has('custTestScore')) {
        mode = 'custom';
        tasks = [
          { id: 'f_custAssign', name: 'Assignment', weight: parseFloat(params.get('custAssignWeight')) || 25, score: parseFloat(params.get('custAssignScore')) },
          { id: 'f_custPrac', name: 'Practical', weight: parseFloat(params.get('custPracWeight')) || 35, score: parseFloat(params.get('custPracScore')) },
          { id: 'f_custTest', name: 'Test', weight: parseFloat(params.get('custTestWeight')) || 30, score: parseFloat(params.get('custTestScore')) },
          { id: 'f_custAtt', name: 'Attendance / Other', weight: parseFloat(params.get('custAttWeight')) || 10, score: parseFloat(params.get('custAttScore')) }
        ];
      } else {
        return { error: 'No recognizable ICASS task scores were found in this URL. Please verify the link or enter the marks manually.' };
      }

      var filled = tasks.filter(function (t) { return t.score !== null && isFinite(t.score); });
      if (filled.length === 0) {
        return { error: 'The URL contained parameter names, but all score values were empty.' };
      }

      return {
        success: true,
        mode: mode,
        friendName: friendName,
        moduleName: moduleName,
        tasks: tasks,
        count: filled.length
      };
    } catch (e) {
      return { error: 'Could not parse the URL. Error: ' + e.message };
    }
  }

  // Update compare banner button visual state
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

  function updateLiveComparisonDetails() {
    document.querySelectorAll('[data-comparison-name]').forEach(function (label) {
      var identity = label.getAttribute('data-comparison-name');
      var name = identity === 'student' ? compareState.studentName : compareState.friendName;
      label.textContent = name + (label.getAttribute('data-comparison-suffix') || '');
    });
    document.querySelectorAll('[data-comparison-module]').forEach(function (label) {
      label.textContent = compareState.moduleName;
    });
    document.querySelectorAll('[data-comparison-friend-lead]').forEach(function (label) {
      label.textContent = compareState.friendName + ' +' + label.getAttribute('data-comparison-friend-lead') + '%';
    });

    var studentCtx = getCurrentStudentContext();
    var friendCalc = calculateWeightedAverage(compareState.friendTasks);
    if (studentCtx && friendCalc) {
      var scoreDiff = studentCtx.icassAverage - friendCalc.average;
      var verdictTitle = document.getElementById('compareVerdictTitle');
      var gapSummary = document.getElementById('compareGapSummary');

      if (verdictTitle) {
        verdictTitle.textContent = scoreDiff > 0.05
          ? compareState.studentName + ' is currently ahead'
          : (scoreDiff < -0.05 ? compareState.friendName + ' is currently ahead' : 'Your results are level');
      }

      if (gapSummary) {
        if (scoreDiff > 0.05) {
          gapSummary.innerHTML = '<strong>' + escapeHtml(compareState.studentName) + '</strong> is ahead by <strong>' + Math.abs(scoreDiff).toFixed(2) + ' percentage points</strong> on the current ICASS averages.';
        } else if (scoreDiff < -0.05) {
          gapSummary.innerHTML = '<strong>' + escapeHtml(compareState.friendName) + '</strong> is ahead by <strong>' + Math.abs(scoreDiff).toFixed(2) + ' percentage points</strong>. The task breakdown can help you choose where to focus.';
        } else {
          gapSummary.innerHTML = 'Your current averages are effectively level at <strong>' + fmtPct(studentCtx.icassAverage) + '</strong>. Compare individual tasks to spot useful study opportunities.';
        }
      }

      var simLeadSummary = document.getElementById('simLeadSummary');
      var simTask = studentCtx.tasks[compareState.hypotheticalTaskIndex] || studentCtx.tasks[0];
      if (simLeadSummary && simTask) {
        var simOldScore = simTask.score !== null ? simTask.score : 0;
        var simGain = (compareState.hypotheticalScore - simOldScore) * (simTask.weight / 100);
        var simProjected = Math.round((studentCtx.icassAverage + simGain) * 100) / 100;
        var simDiff = simProjected - friendCalc.average;
        simLeadSummary.textContent = simDiff > 0.05
          ? 'You would lead ' + compareState.friendName + ' by ' + simDiff.toFixed(2) + ' points'
          : (simDiff < -0.05
            ? 'You would trail ' + compareState.friendName + ' by ' + Math.abs(simDiff).toFixed(2) + ' points'
            : 'Your projected result would be level with ' + compareState.friendName);
      }
    }

    drawComparisonCanvas();
  }

  // Render the entire Compare feature UI
  function renderCompareUI() {
    var container = document.getElementById('compareWorkspaceSection');
    if (!container) return;

    updateBannerButtonState();

    var studentCtx = getCurrentStudentContext();
    if (!studentCtx) {
      container.innerHTML = [
        '<div class="compare-card compare-empty-state">',
        '  <div class="compare-empty-icon" aria-hidden="true">',
        '    <svg width="32" height="32" fill="none" stroke="#f59e0b" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
        '  </div>',
        '  <h3 class="compare-empty-title">Calculate Your ICASS Marks First</h3>',
        '  <p class="compare-empty-desc">To compare results with a friend, first enter your own task scores in the calculator above and click <strong>Calculate ICASS average</strong>. We will automatically use your real marks to benchmark against your classmate.</p>',
        '  <button type="button" id="compareGoToCalcBtn" class="btn-primary compare-empty-btn">Go to Calculator</button>',
        '</div>'
      ].join('');

      var goToCalcBtn = container.querySelector('#compareGoToCalcBtn') || document.getElementById('compareGoToCalcBtn');
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

    // Sync student mode if friendTasks is uninitialized
    if (compareState.friendTasks.length === 0) {
      compareState.friendMode = studentCtx.mode || 'standard';
      compareState.friendTasks = getDefaultTasks(compareState.friendMode);
    }

    var friendCalc = calculateWeightedAverage(compareState.friendTasks);
    var hasFriendData = friendCalc !== null && friendCalc.filledCount > 0;
    var studentScore = studentCtx.icassAverage;
    var friendScore = hasFriendData ? friendCalc.average : null;
    var scoreDiff = hasFriendData ? (studentScore - friendScore) : 0;
    var diffAbs = Math.abs(scoreDiff).toFixed(2);
    var studentBand = getBand(studentScore);
    var friendBand = hasFriendData ? getBand(friendScore) : null;

    var html = [];

    // Header & Workspace Toggle
    html.push('<div class="compare-card compare-main-card">');
    html.push('  <div class="compare-header">');
    html.push('    <div class="compare-header-info">');
    html.push('      <span class="compare-eyebrow">ICASS RESULT COMPARISON</span>');
    html.push('      <h2 class="compare-title">Compare results with a friend</h2>');
    html.push('      <p class="compare-subtitle">Review both weighted averages, compare matching assessment tasks, and identify practical areas for improvement. Your marks stay in this browser unless you choose to share a link.</p>');
    html.push('    </div>');
    html.push('    <button type="button" id="compareCloseBtn" class="compare-close-btn" aria-label="Close comparison">&times;</button>');
    html.push('  </div>');

    // Section 1: Comparison Setup (Inputs: Names, Module, Friend Tasks or URL)
    html.push('  <div class="compare-setup-panel">');
    html.push('    <h3 class="compare-section-heading">1. Comparison Setup</h3>');
    html.push('    <div class="compare-meta-grid">');
    html.push('      <div class="field">');
    html.push('        <label class="field-label" for="compStudentName">Your Display Name</label>');
    html.push('        <input type="text" id="compStudentName" class="form-input" value="' + escapeHtml(compareState.studentName) + '" placeholder="You" />');
    html.push('      </div>');
    html.push('      <div class="field">');
    html.push('        <label class="field-label" for="compFriendName">Friend\'s Name</label>');
    html.push('        <input type="text" id="compFriendName" class="form-input" value="' + escapeHtml(compareState.friendName) + '" placeholder="Classmate" />');
    html.push('      </div>');
    html.push('      <div class="field compare-field-full">');
    html.push('        <label class="field-label" for="compModuleName">TVET Subject / Module (Optional)</label>');
    html.push('        <input type="text" id="compModuleName" list="compModuleList" class="form-input" value="' + escapeHtml(compareState.moduleName) + '" placeholder="e.g. Mathematics N3, Financial Accounting N4" />');
    html.push('        <datalist id="compModuleList">');
    TVET_POPULAR_MODULES.forEach(function (mod) {
      html.push('          <option value="' + escapeHtml(mod) + '"></option>');
    });
    html.push('        </datalist>');
    html.push('      </div>');
    html.push('    </div>');

    // Tabs: Option A (Manual Entry) vs Option B (URL Import)
    html.push('    <div class="compare-tabs-wrap">');
    html.push('      <div class="compare-tabs" role="tablist">');
    html.push('        <button type="button" id="tabCompManual" class="compare-tab ' + (compareState.activeTab === 'manual' ? 'active' : '') + '" role="tab" aria-controls="compManualPanel" aria-selected="' + (compareState.activeTab === 'manual') + '">Enter Friend\'s Marks Manually</button>');
    html.push('        <button type="button" id="tabCompImport" class="compare-tab ' + (compareState.activeTab === 'import' ? 'active' : '') + '" role="tab" aria-controls="compImportPanel" aria-selected="' + (compareState.activeTab === 'import') + '">Import from Shared Link</button>');
    html.push('      </div>');

    // Tab 1: Manual Marks Panel
    html.push('      <div id="compManualPanel" class="compare-tab-panel" role="tabpanel" aria-labelledby="tabCompManual" style="' + (compareState.activeTab === 'manual' ? 'display:block;' : 'display:none;') + '">');
    html.push('        <div class="compare-mode-selector-row">');
    html.push('          <span class="compare-mode-label">Friend\'s Assessment Format:</span>');
    html.push('          <div class="compare-mode-pills">');
    html.push('            <button type="button" class="comp-mode-btn ' + (compareState.friendMode === 'standard' ? 'active' : '') + '" data-mode="standard" aria-pressed="' + (compareState.friendMode === 'standard') + '">Semester Standard (5 Tasks)</button>');
    html.push('            <button type="button" class="comp-mode-btn ' + (compareState.friendMode === 'trimester' ? 'active' : '') + '" data-mode="trimester" aria-pressed="' + (compareState.friendMode === 'trimester') + '">Trimester (3 Tasks)</button>');
    html.push('            <button type="button" class="comp-mode-btn ' + (compareState.friendMode === 'custom' ? 'active' : '') + '" data-mode="custom" aria-pressed="' + (compareState.friendMode === 'custom') + '">Custom Weights</button>');
    html.push('          </div>');
    html.push('        </div>');

    html.push('        <div class="compare-tasks-entry-grid">');
    for (var i = 0; i < compareState.friendTasks.length; i++) {
      var task = compareState.friendTasks[i];
      var val = (task.score !== null && isFinite(task.score)) ? task.score : '';
      html.push('          <div class="compare-task-input-card">');
      html.push('            <div class="compare-task-input-head">');
      html.push('              <span class="compare-task-name">' + escapeHtml(task.name) + '</span>');
      html.push('              <span class="compare-task-weight">' + task.weight + '% weight</span>');
      html.push('            </div>');
      html.push('            <div class="input-unit-wrap">');
      html.push('              <input type="number" min="0" max="100" step="any" class="comp-friend-score-input" data-task-idx="' + i + '" value="' + val + '" placeholder="0–100" aria-label="' + escapeHtml(task.name) + ' score, from 0 to 100" />');
      html.push('              <span class="input-unit-suffix">%</span>');
      html.push('            </div>');
      html.push('          </div>');
    }
    html.push('        </div>');
    html.push('        <p class="compare-import-desc">Enter marks from 0 to 100. Leave a task blank if your friend has not received that mark yet. The example button uses sample scores for preview only.</p>');

    html.push('        <div class="compare-actions-row">');
    html.push('          <button type="button" id="compCalculateBtn" class="btn-primary">Update Comparison</button>');
    html.push('          <button type="button" id="compSampleFriendBtn" class="btn-secondary">Load example scores</button>');
    html.push('          <button type="button" id="compClearFriendBtn" class="btn-secondary">Clear Marks</button>');
    html.push('        </div>');
    html.push('        <p id="compStatusMessage" class="compare-status-text" aria-live="polite"></p>');
    html.push('      </div>');

    // Tab 2: URL Import Panel
    html.push('      <div id="compImportPanel" class="compare-tab-panel" role="tabpanel" aria-labelledby="tabCompImport" style="' + (compareState.activeTab === 'import' ? 'display:block;' : 'display:none;') + '">');
    html.push('        <p class="compare-import-desc">If your classmate shared their AfriWidget calculation link or result link with you, paste it below to instantly load their marks.</p>');
    html.push('        <div class="compare-import-row">');
    html.push('          <input type="url" id="compImportUrlInput" class="form-input" placeholder="Paste link (e.g. https://afriwidget.com/icass-calculator.html?stdTest1=70...)" />');
    html.push('          <button type="button" id="compDoImportBtn" class="btn-primary">Import &amp; Compare</button>');
    html.push('        </div>');
    html.push('        <div id="compImportError" class="compare-import-error" role="alert" aria-live="assertive" style="display:none;"></div>');
    html.push('      </div>');
    html.push('    </div>');
    html.push('  </div>'); // /compare-setup-panel

    // If friend has data, display Sections 2, 3, 4, 5, 6, 7
    if (hasFriendData) {
      // SECTION 2: RESULTS OVERVIEW: TWO VISUAL STUDENT CARDS
      html.push('  <section class="compare-results-section" id="compareResultsSection" aria-labelledby="compareOverviewHeading">');
      html.push('    <h3 class="compare-section-heading" id="compareOverviewHeading">2. Overall Performance Comparison</h3>');
      var verdictClass = scoreDiff > 0.05 ? 'is-student-ahead' : (scoreDiff < -0.05 ? 'is-friend-ahead' : 'is-tied');
      var verdictTitle = scoreDiff > 0.05
        ? escapeHtml(compareState.studentName) + ' is currently ahead'
        : (scoreDiff < -0.05 ? escapeHtml(compareState.friendName) + ' is currently ahead' : 'Your results are level');
      var verdictDetail = scoreDiff > 0.05
        ? 'Keep building on your lead with a focused study plan.'
        : (scoreDiff < -0.05 ? 'Use the task breakdown below to choose where to focus next.' : 'You are within 0.05 percentage points of each other.');
      html.push('    <div class="compare-verdict ' + verdictClass + '" role="status" aria-live="polite">');
      html.push('      <div class="compare-verdict-copy">');
      html.push('        <span class="compare-verdict-kicker">Overall comparison</span>');
      html.push('        <h4 class="compare-verdict-title" id="compareVerdictTitle">' + verdictTitle + '</h4>');
      html.push('        <p class="compare-verdict-detail">' + verdictDetail + ' Based on the ICASS averages shown below.</p>');
      html.push('      </div>');
      html.push('      <div class="compare-verdict-number">' + Math.abs(scoreDiff).toFixed(2) + '<small>' + (Math.abs(scoreDiff) <= 0.05 ? 'percentage points apart' : 'percentage-point gap') + '</small></div>');
      html.push('    </div>');
      html.push('    <div class="compare-cards-grid">');

      // Card 1: Student (Yellow Accent)
      html.push('      <div class="compare-student-card compare-card-student">');
      html.push('        <div class="compare-card-badge student-badge">YOU</div>');
      html.push('        <h4 class="compare-card-name" data-comparison-name="student">' + escapeHtml(compareState.studentName) + '</h4>');
      html.push('        <div class="compare-card-meta" data-comparison-module>' + escapeHtml(compareState.moduleName) + '</div>');
      html.push('        <div class="compare-card-score-row">');
      html.push('          <span class="compare-card-score-big student-score">' + fmtPct(studentScore) + '</span>');
      html.push('          <span class="compare-card-status" style="color:' + studentBand.color + ';background:' + studentBand.bg + ';border:1px solid ' + studentBand.border + ';">' + studentBand.name + '</span>');
      html.push('        </div>');
      html.push('        <div class="compare-bar-track" role="progressbar" aria-valuenow="' + studentScore + '" aria-valuemin="0" aria-valuemax="100" aria-label="' + escapeHtml(compareState.studentName) + ' ICASS progress">');
      html.push('          <div class="compare-bar-fill student-fill" style="width:' + Math.min(100, Math.max(0, studentScore)) + '%;"></div>');
      html.push('        </div>');
      html.push('        <div class="compare-card-footer">');
      html.push('          <span>DHET 40% Sub-min: <strong>' + (studentScore >= 40 ? 'Cleared (Eligible)' : 'Not cleared') + '</strong></span>');
      html.push('          <span>Tasks: <strong>' + studentCtx.tasks.filter(function (t) { return t.score !== null; }).length + '/' + studentCtx.tasks.length + '</strong></span>');
      html.push('        </div>');
      html.push('      </div>');

      // Card 2: Friend (Dark Neutral Accent)
      html.push('      <div class="compare-student-card compare-card-friend">');
      html.push('        <div class="compare-card-badge friend-badge">FRIEND</div>');
      html.push('        <h4 class="compare-card-name" data-comparison-name="friend">' + escapeHtml(compareState.friendName) + '</h4>');
      html.push('        <div class="compare-card-meta" data-comparison-module>' + escapeHtml(compareState.moduleName) + '</div>');
      html.push('        <div class="compare-card-score-row">');
      html.push('          <span class="compare-card-score-big friend-score">' + fmtPct(friendScore) + '</span>');
      html.push('          <span class="compare-card-status" style="color:' + friendBand.color + ';background:' + friendBand.bg + ';border:1px solid ' + friendBand.border + ';">' + friendBand.name + '</span>');
      html.push('        </div>');
      html.push('        <div class="compare-bar-track" role="progressbar" aria-valuenow="' + friendScore + '" aria-valuemin="0" aria-valuemax="100" aria-label="' + escapeHtml(compareState.friendName) + ' ICASS progress">');
      html.push('          <div class="compare-bar-fill friend-fill" style="width:' + Math.min(100, Math.max(0, friendScore)) + '%;"></div>');
      html.push('        </div>');
      html.push('        <div class="compare-card-footer">');
      html.push('          <span>DHET 40% Sub-min: <strong>' + (friendScore >= 40 ? 'Cleared (Eligible)' : 'Not cleared') + '</strong></span>');
      html.push('          <span>Tasks: <strong>' + friendCalc.filledCount + '/' + compareState.friendTasks.length + '</strong></span>');
      html.push('        </div>');
      html.push('      </div>');
      html.push('    </div>'); // /compare-cards-grid

      // Differential Gap Banner
      var gapSummaryText = '';
      if (scoreDiff > 0.05) {
        gapSummaryText = '<strong>' + escapeHtml(compareState.studentName) + '</strong> is ahead by <strong>' + diffAbs + ' percentage points</strong> on the current ICASS averages.';
      } else if (scoreDiff < -0.05) {
        gapSummaryText = '<strong>' + escapeHtml(compareState.friendName) + '</strong> is ahead by <strong>' + diffAbs + ' percentage points</strong>. The task breakdown can help you choose where to focus.';
      } else {
        gapSummaryText = 'Your current averages are effectively level at <strong>' + fmtPct(studentScore) + '</strong>. Compare individual tasks to spot useful study opportunities.';
      }

      html.push('    <div class="compare-gap-banner">');
      html.push('      <div class="compare-gap-icon">');
      html.push('        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>');
      html.push('      </div>');
      html.push('      <div class="compare-gap-text" id="compareGapSummary">' + gapSummaryText + '</div>');
      html.push('    </div>');

      // SECTION 3: TASK-BY-TASK COMPONENT COMPARISON
      html.push('    <div class="compare-section-box">');
      html.push('      <div class="compare-section-head-row">');
      html.push('        <div>');
      html.push('          <h3 class="compare-section-heading">3. Task-by-Task Component Comparison</h3>');
      html.push('          <p class="compare-section-sub">Only assessment components with matching names are compared, so unrelated tasks are never treated as equivalent.</p>');
      html.push('        </div>');
      html.push('        <div class="compare-legend">');
      html.push('          <span class="legend-item"><span class="legend-dot student-dot"></span> <span data-comparison-name="student" data-comparison-suffix=" (You)">' + escapeHtml(compareState.studentName) + ' (You)</span></span>');
      html.push('          <span class="legend-item"><span class="legend-dot friend-dot"></span> <span data-comparison-name="friend">' + escapeHtml(compareState.friendName) + '</span></span>');
      html.push('        </div>');
      html.push('      </div>');

      if (studentCtx.mode !== compareState.friendMode) {
        html.push('      <div class="compare-mode-warning" style="background:#fffbeb;border:1px solid #fef3c7;border-radius:0.5rem;padding:0.75rem 1rem;font-size:0.8125rem;color:#92400e;margin-bottom:1rem;line-height:1.5;"><strong>Assessment Structure Note:</strong> You are evaluating your marks in <em>' + escapeHtml(studentCtx.mode) + '</em> format while your friend is entered in <em>' + escapeHtml(compareState.friendMode) + '</em> format. Only directly corresponding assessment components are benchmarked below. Differences in component weightings may affect the relative contribution of each task to the overall ICASS average.</div>');
      }

      html.push('      <div class="compare-task-bars-list">');
      var studentTasks = studentCtx.tasks || [];
      var friendTasks = compareState.friendTasks || [];
      var taskComparison = getTaskComparison(studentTasks, friendTasks);
      var pairedTasks = taskComparison.pairs;
      var unmatchedStudentTasks = taskComparison.unmatchedStudentTasks;
      var unmatchedFriendTasks = taskComparison.unmatchedFriendTasks;

      var taskInsights = [];
      var maxGapTask = null;
      var maxGapDiff = -1;
      var comparableTaskCount = 0;

      if (pairedTasks.length === 0) {
        html.push('        <p class="compare-section-sub compare-no-matches">No assessment components have matching names yet. Check the task names or use the same assessment format to see a task-by-task comparison.</p>');
      }

      for (var j = 0; j < pairedTasks.length; j++) {
        var sTask = pairedTasks[j].student;
        var fTask = pairedTasks[j].friend;
        var sVal = (sTask.score !== null && isFinite(sTask.score)) ? sTask.score : null;
        var fVal = (fTask.score !== null && isFinite(fTask.score)) ? fTask.score : null;
        var isComparable = sVal !== null && fVal !== null;
        var tDiff = isComparable ? sVal - fVal : 0;
        var absTDiff = Math.abs(tDiff);
        if (isComparable) comparableTaskCount++;

        if (isComparable && absTDiff > maxGapDiff) {
          maxGapDiff = absTDiff;
          maxGapTask = {
            name: sTask.name,
            weight: sTask.weight,
            diff: absTDiff,
            studentLead: tDiff > 0,
            sVal: sVal,
            fVal: fVal
          };
        }

        var leaderHtml = '';
        if (!isComparable) {
          leaderHtml = '<span class="compare-leader-tag leader-tie">Enter both marks</span>';
        } else if (tDiff > 0.5) {
          leaderHtml = '<span class="compare-leader-tag leader-student">You +' + tDiff.toFixed(1) + '%</span>';
          taskInsights.push({ type: 'student_lead', task: sTask.name, diff: tDiff, weight: sTask.weight, friendWeight: fTask.weight });
        } else if (tDiff < -0.5) {
          leaderHtml = '<span class="compare-leader-tag leader-friend" data-comparison-friend-lead="' + absTDiff.toFixed(1) + '">' + escapeHtml(compareState.friendName) + ' +' + absTDiff.toFixed(1) + '%</span>';
          taskInsights.push({ type: 'friend_lead', task: sTask.name, diff: absTDiff, weight: sTask.weight, friendWeight: fTask.weight });
        } else {
          leaderHtml = '<span class="compare-leader-tag leader-tie">Tied</span>';
        }

        html.push('        <div class="compare-task-bar-item' + (isComparable ? '' : ' compare-task-incomplete') + '">');
        html.push('          <div class="compare-task-bar-top">');
        html.push('            <span class="compare-task-bar-title">' + escapeHtml(sTask.name) + '</span>');
        html.push('            <div class="compare-task-bar-meta">');
        html.push('              <span>' + (sTask.weight === fTask.weight ? sTask.weight + '% weight' : sTask.weight + '% / ' + fTask.weight + '% weights') + '</span>');
        html.push('              ' + leaderHtml);
        html.push('            </div>');
        html.push('          </div>');

        // Student bar
        html.push('          <div class="compare-bar-dual-row">');
        html.push('            <span class="compare-bar-label" data-comparison-name="student">' + escapeHtml(compareState.studentName) + '</span>');
        html.push('            <div class="compare-bar-track-wrap">');
        html.push('              <div class="compare-bar-fill student-fill" style="width:' + (sVal === null ? 0 : Math.min(100, Math.max(0, sVal))) + '%;"></div>');
        html.push('            </div>');
        html.push('            <span class="compare-bar-num">' + fmtPct(sVal) + '</span>');
        html.push('          </div>');

        // Friend bar
        html.push('          <div class="compare-bar-dual-row">');
        html.push('            <span class="compare-bar-label" data-comparison-name="friend">' + escapeHtml(compareState.friendName) + '</span>');
        html.push('            <div class="compare-bar-track-wrap">');
        html.push('              <div class="compare-bar-fill friend-fill" style="width:' + (fVal === null ? 0 : Math.min(100, Math.max(0, fVal))) + '%;"></div>');
        html.push('            </div>');
        html.push('            <span class="compare-bar-num">' + fmtPct(fVal) + '</span>');
        html.push('          </div>');
        html.push('        </div>');
      }

      if (unmatchedStudentTasks.length > 0) {
        html.push('        <div class="compare-unmatched-box" style="margin-top:0.75rem;background:#ffffff;border:1px dashed #d1d5db;border-radius:0.5rem;padding:0.75rem 1rem;font-size:0.8125rem;color:#4b5563;line-height:1.5;">');
        html.push('          <strong style="color:#111827;">Your tasks without a matching name:</strong>');
        for (var k = 0; k < unmatchedStudentTasks.length; k++) {
          var exTask = unmatchedStudentTasks[k];
          html.push('          <div style="margin-top:0.25rem;">• ' + escapeHtml(exTask.name) + ' (' + exTask.weight + '% weight): ' + (exTask.score !== null ? fmtPct(exTask.score) : '—') + '</div>');
        }
        html.push('        </div>');
      }

      if (unmatchedFriendTasks.length > 0) {
        html.push('        <div class="compare-unmatched-box" style="margin-top:0.75rem;background:#ffffff;border:1px dashed #d1d5db;border-radius:0.5rem;padding:0.75rem 1rem;font-size:0.8125rem;color:#4b5563;line-height:1.5;">');
        html.push('          <strong style="color:#111827;">' + escapeHtml(compareState.friendName) + '\'s tasks without a matching name:</strong>');
        for (var m = 0; m < unmatchedFriendTasks.length; m++) {
          var exFTask = unmatchedFriendTasks[m];
          html.push('          <div style="margin-top:0.25rem;">• ' + escapeHtml(exFTask.name) + ' (' + exFTask.weight + '% weight): ' + (exFTask.score !== null ? fmtPct(exFTask.score) : '—') + '</div>');
        }
        html.push('        </div>');
      }

      html.push('      </div>'); // /compare-task-bars-list
      html.push('    </div>'); // /compare-section-box

      // SECTION 4: YOUR PERFORMANCE INSIGHTS
      html.push('    <div class="compare-section-box">');
      html.push('      <h3 class="compare-section-heading">4. Your Performance Insights</h3>');
      html.push('      <p class="compare-section-sub">Objective findings derived from your actual task-by-task marks comparison.</p>');
      html.push('      <div class="compare-insights-grid">');

      // Card A: Strengths
      var studentLeads = taskInsights.filter(function (t) { return t.type === 'student_lead'; });
      html.push('        <div class="compare-insight-card insight-strength">');
      html.push('          <div class="insight-head"><span class="insight-icon"><svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg></span> Where You Hold the Advantage</div>');
      if (studentLeads.length > 0) {
        html.push('          <p class="insight-text">You outperformed your classmate in <strong>' + studentLeads.map(function (l) { return escapeHtml(l.task); }).join(', ') + '</strong>.</p>');
        html.push('          <ul class="insight-bullets">');
        studentLeads.forEach(function (l) {
          var ptsAdv = (l.diff * (l.weight / 100)).toFixed(2);
          html.push('            <li><strong>' + escapeHtml(l.task) + '</strong> (' + l.weight + '%): +' + l.diff.toFixed(1) + '% advantage, securing <strong>+' + ptsAdv + ' weighted points</strong>.</li>');
        });
        html.push('          </ul>');
      } else if (friendLeads.length > 0) {
        html.push('          <p class="insight-text">' + escapeHtml(compareState.friendName) + ' currently leads on the comparable assessment components. Use the breakdown below to identify a focused revision target.</p>');
      } else if (comparableTaskCount > 0) {
        html.push('          <p class="insight-text">You and ' + escapeHtml(compareState.friendName) + ' are closely matched on the comparable assessment components.</p>');
      } else {
        html.push('          <p class="insight-text">There are not enough matching completed assessment components to identify a task-level advantage yet.</p>');
      }
      html.push('        </div>');

      // Card B: Friend's Lead
      var friendLeads = taskInsights.filter(function (t) { return t.type === 'friend_lead'; });
      html.push('        <div class="compare-insight-card insight-opportunity">');
      html.push('          <div class="insight-head"><span class="insight-icon"><svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"/></svg></span> Where Your Friend Leads</div>');
      if (friendLeads.length > 0) {
        html.push('          <p class="insight-text">Your friend gained their highest leverage in <strong>' + friendLeads.map(function (l) { return escapeHtml(l.task); }).join(', ') + '</strong>.</p>');
        html.push('          <ul class="insight-bullets">');
        friendLeads.forEach(function (l) {
          var ptsLoss = (l.diff * (l.weight / 100)).toFixed(2);
          html.push('            <li><strong>' + escapeHtml(l.task) + '</strong> (' + l.weight + '%): Friend is ahead by ' + l.diff.toFixed(1) + '%, creating a <strong>' + ptsLoss + ' point gap</strong>.</li>');
        });
        html.push('          </ul>');
      } else if (studentLeads.length > 0) {
        html.push('          <p class="insight-text">You currently lead on the comparable assessment components. Keep your preparation consistent as you complete the remaining tasks.</p>');
      } else if (comparableTaskCount > 0) {
        html.push('          <p class="insight-text">Neither student has a clear lead on the comparable tasks. Review the marks together and focus on the next assessment.</p>');
      } else {
        html.push('          <p class="insight-text">A task-level comparison will appear once both students have marks for a matching assessment component.</p>');
      }
      html.push('        </div>');

      // Card C: Largest Performance Gap
      html.push('        <div class="compare-insight-card insight-gap compare-card-full">');
      html.push('          <div class="insight-head"><span class="insight-icon"><svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></span> Largest Performance Gap</div>');
      if (maxGapTask) {
        var gapPoints = (maxGapTask.diff * (maxGapTask.weight / 100)).toFixed(2);
        html.push('          <p class="insight-text">The single largest divergence between you and your classmate occurred on <strong>' + escapeHtml(maxGapTask.name) + '</strong> (carrying a <strong>' + maxGapTask.weight + '% weighting</strong>). The gap of <strong>' + maxGapTask.diff.toFixed(1) + ' percentage points</strong> accounts for <strong>' + gapPoints + ' total ICASS marks</strong> on its own.</p>');
      } else {
        html.push('          <p class="insight-text">No task-level gap can be calculated until at least one matching assessment component has marks entered for both students.</p>');
      }
      html.push('        </div>');
      html.push('      </div>'); // /compare-insights-grid
      html.push('    </div>'); // /compare-section-box

      // SECTION 5: HOW YOU CAN IMPROVE & GET AHEAD
      html.push('    <div class="compare-section-box">');
      html.push('      <h3 class="compare-section-heading">5. How You Can Improve</h3>');
      html.push('      <p class="compare-section-sub">Personalized recommendations focused on maximizing your own ICASS coursework average.</p>');

      // Calculate where student lost the most marks
      var lostMarksAnalysis = [];
      studentTasks.forEach(function (t) {
        if (t.score !== null && isFinite(t.score)) {
          var missedPct = 100 - t.score;
          var missedWeightedPts = missedPct * (t.weight / 100);
          lostMarksAnalysis.push({
            name: t.name,
            weight: t.weight,
            score: t.score,
            missedWeightedPts: missedWeightedPts
          });
        }
      });
      lostMarksAnalysis.sort(function (a, b) {
        return b.missedWeightedPts - a.missedWeightedPts;
      });

      var highestLeverageTask = lostMarksAnalysis.length > 0 ? lostMarksAnalysis[0] : null;

      html.push('      <div class="compare-lost-marks-card">');
      html.push('        <h4 class="compare-lost-title">Lost Mark Distribution by Task</h4>');
      html.push('        <p class="compare-lost-desc">Continuous assessment allows you to bank up to 40% of your subject mark before writing the national exam. Here is where your dropped points are concentrated:</p>');
      html.push('        <div class="compare-lost-list">');
      lostMarksAnalysis.forEach(function (item) {
        html.push('          <div class="compare-lost-item">');
        html.push('            <div class="compare-lost-item-left">');
        html.push('              <span class="compare-lost-task">' + escapeHtml(item.name) + '</span>');
        html.push('              <span class="compare-lost-weight">' + item.weight + '% weight • Current score: ' + fmtPct(item.score) + '</span>');
        html.push('            </div>');
        html.push('            <div class="compare-lost-item-right">');
        html.push('              <span class="compare-lost-pts">-' + item.missedWeightedPts.toFixed(2) + ' pts</span>');
        html.push('            </div>');
        html.push('          </div>');
      });
      html.push('        </div>');

      if (highestLeverageTask) {
        html.push('        <div class="compare-highest-target-box">');
        html.push('          <strong>Highest Leverage Target: ' + escapeHtml(highestLeverageTask.name) + '</strong> (' + highestLeverageTask.weight + '% weight). You conceded ' + highestLeverageTask.missedWeightedPts.toFixed(2) + ' weighted points here. Improving this specific component delivers the largest immediate return on your ICASS mark.');
        html.push('        </div>');
      }
      html.push('      </div>'); // /compare-lost-marks-card

      // Strategic TVET Action Plan Cards
      html.push('      <div class="compare-plan-grid">');
      html.push('        <div class="compare-plan-card">');
      html.push('          <div class="compare-plan-num">1</div>');
      html.push('          <h4 class="compare-plan-title">Target High-Weight Past Papers</h4>');
      html.push('          <p class="compare-plan-text">In TVET continuous assessment, internal exams and trial tests carry 30% to 50% of the entire ICASS mark. Work through 3 previous DHET national question papers under timed conditions before the next assessment.</p>');
      html.push('        </div>');

      html.push('        <div class="compare-plan-card">');
      html.push('          <div class="compare-plan-num">2</div>');
      html.push('          <h4 class="compare-plan-title">Verify Continuous Assessment Moderation</h4>');
      html.push('          <p class="compare-plan-text">Before final marks are submitted to DHET for national exam admission, TVET colleges display continuous assessment schedules for student verification. Review your marks for any clerical recording errors during this moderation window.</p>');
      html.push('        </div>');

      html.push('        <div class="compare-plan-card">');
      html.push('          <div class="compare-plan-num">3</div>');
      html.push('          <h4 class="compare-plan-title">Protect Assignment Marks</h4>');
      html.push('          <p class="compare-plan-text">Assignments are take-home or guided assessments where you control the preparation time. Never submit an incomplete assignment, as losing 15% on an assignment drops your overall mark by 3.75 full points.</p>');
      html.push('        </div>');

      html.push('        <div class="compare-plan-card">');
      html.push('          <div class="compare-plan-num">4</div>');
      html.push('          <h4 class="compare-plan-title">Form a Peer Study Partnership</h4>');
      html.push('          <p class="compare-plan-text">Use your classmate\'s areas of strength to cross-review tricky module topics. Teach each other the sections where one of you holds the lead to sharpen both exam scores.</p>');
      html.push('        </div>');
      html.push('      </div>'); // /compare-plan-grid
      html.push('    </div>'); // /compare-section-box

      // SECTION 6: INTERACTIVE WHAT-IF SIMULATOR
      html.push('    <div class="compare-section-box">');
      html.push('      <h3 class="compare-section-heading">6. Interactive What-If Simulator</h3>');
      html.push('      <p class="compare-section-sub">Model how raising your score on any single assessment task would lift your overall ICASS average and shift the lead against your friend.</p>');
      html.push('      <div class="compare-sim-container">');
      html.push('        <div class="compare-sim-controls">');
      html.push('          <div class="compare-sim-field">');
      html.push('            <label class="field-label" for="simTaskSelect">Select Assessment to Improve</label>');
      html.push('            <select id="simTaskSelect" class="form-input">');
      for (var sIdx = 0; sIdx < studentTasks.length; sIdx++) {
        var sT = studentTasks[sIdx];
        var isSelected = (sIdx === compareState.hypotheticalTaskIndex) ? 'selected' : '';
        html.push('              <option value="' + sIdx + '" ' + isSelected + '>' + escapeHtml(sT.name) + ' (' + sT.weight + '% weight)</option>');
      }
      html.push('            </select>');
      html.push('          </div>');
      html.push('          <div class="compare-sim-field">');
      html.push('            <div class="compare-sim-slider-label-row">');
      html.push('              <label class="field-label" for="simScoreSlider">Hypothetical Target Score</label>');
      html.push('              <span id="simScoreVal" class="compare-sim-val">' + compareState.hypotheticalScore + '%</span>');
      html.push('            </div>');
      html.push('            <input type="range" id="simScoreSlider" min="0" max="100" step="1" value="' + compareState.hypotheticalScore + '" class="w-full" style="accent-color:#facc15;cursor:pointer;" />');
      html.push('          </div>');
      html.push('        </div>');

      // Calculate projected outcome
      var simTargetTask = studentTasks[compareState.hypotheticalTaskIndex] || studentTasks[0];
      var simNewScore = compareState.hypotheticalScore;
      var simOldScore = (simTargetTask && simTargetTask.score !== null) ? simTargetTask.score : 0;
      var simDelta = simNewScore - simOldScore;
      var simWeight = simTargetTask ? simTargetTask.weight : 0;
      var simPointsGain = (simDelta * (simWeight / 100));
      var simProjectedAverage = Math.round((studentScore + simPointsGain) * 100) / 100;
      var simNewDiff = simProjectedAverage - friendScore;
      var simProjectedBand = getBand(simProjectedAverage);

      html.push('        <div class="compare-sim-result-card">');
      html.push('          <div class="sim-score-box">');
      html.push('            <span class="sim-label">Projected ICASS Average</span>');
      html.push('            <span class="sim-projected-score">' + fmtPct(simProjectedAverage) + '</span>');
      html.push('          </div>');
      html.push('          <div class="sim-meta-row">');
      var gainSign = simPointsGain >= 0 ? '+' : '';
      var gainClass = simPointsGain >= 0 ? 'pos' : 'neg';
      html.push('            <span class="sim-meta-gain ' + gainClass + '">' + gainSign + simPointsGain.toFixed(2) + ' pts net difference</span>');
      html.push('            <span class="sim-meta-band">Projected Band: <strong>' + simProjectedBand.name + '</strong></span>');
      var leadSummary = simNewDiff > 0.05
        ? 'You would lead ' + escapeHtml(compareState.friendName) + ' by +' + simNewDiff.toFixed(2) + ' points'
        : simNewDiff < -0.05
          ? 'Trailing ' + escapeHtml(compareState.friendName) + ' by ' + Math.abs(simNewDiff).toFixed(2) + ' points'
          : 'Projected result is level with ' + escapeHtml(compareState.friendName);
      html.push('            <span id="simLeadSummary" style="font-size:0.75rem;font-weight:700;color:#374151;" aria-live="polite">' + leadSummary + '</span>');
      html.push('          </div>');
      html.push('        </div>');
      html.push('        <p style="font-size:0.75rem;color:#6b7280;margin:0.75rem 0 0 0;line-height:1.4;">Note: Projections use the DHET weighted formula where 40% of your final subject result is banked from continuous assessment.</p>');
      html.push('      </div>'); // /compare-sim-container
      html.push('    </div>'); // /compare-section-box

      // SECTION 7: SHAREABLE COMPARISON CARD (CANVAS EXPORT)
      html.push('    <div class="compare-section-box">');
      html.push('      <h3 class="compare-section-heading">7. Shareable Comparison Card</h3>');
      html.push('      <p class="compare-section-sub">Generate and download a high-resolution comparison summary card to share with classmates or study groups.</p>');
      html.push('      <div class="compare-export-preview-wrap">');
      html.push('        <canvas id="compareExportCanvas" class="compare-canvas" width="1200" height="630" role="img" aria-label="Shareable ICASS comparison card showing both students’ average and the score difference"></canvas>');
      html.push('      </div>');
      html.push('      <div class="compare-export-actions">');
      html.push('        <button type="button" id="compareDownloadImageBtn" class="btn-primary">');
      html.push('          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>');
      html.push('          <span>Download Card (PNG)</span>');
      html.push('        </button>');
      html.push('        <button type="button" id="compareShareBtn" class="btn-secondary">');
      html.push('          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>');
      html.push('          <span>Share Comparison</span>');
      html.push('        </button>');
      html.push('        <button type="button" id="compareResetAllBtn" class="btn-secondary">Reset Comparison</button>');
      html.push('      </div>');
      html.push('    </div>'); // /compare-section-box
      html.push('  </section>'); // /compare-results-section
    }

    html.push('</div>'); // /compare-main-card

    container.innerHTML = html.join('');
    container.style.display = compareState.isOpen ? 'block' : 'none';

    // Attach all interactive event listeners
    attachCompareEventListeners();

    // If friend has data, render the Canvas graphic
    if (hasFriendData) {
      setTimeout(drawComparisonCanvas, 50);
    }
  }

  // Draw the high-res social card on HTML5 canvas
  function drawComparisonCanvas() {
    var canvas = document.getElementById('compareExportCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var studentCtx = getCurrentStudentContext();
    var friendCalc = calculateWeightedAverage(compareState.friendTasks);
    if (!studentCtx || !friendCalc) return;

    var sScore = studentCtx.icassAverage;
    var fScore = friendCalc.average;
    var sName = compareState.studentName || 'You';
    var fName = compareState.friendName || 'Classmate';
    var modName = compareState.moduleName || 'TVET Coursework';

    // Dimensions: 1200 x 630 (Standard 1.91:1)
    var W = 1200;
    var H = 630;

    // 1. Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    // Header background banner
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, W, 110);

    // Yellow accent stripe
    ctx.fillStyle = '#facc15';
    ctx.fillRect(0, 106, W, 4);

    // Header text
    ctx.fillStyle = '#facc15';
    ctx.font = '800 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('AFRIWIDGET.COM  •  TVET ICASS BENCHMARK', 60, 48);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Results Comparison: ' + modName, 60, 88, 1080);

    // 2. Student Cards (Two side-by-side)
    var cardW = 510;
    var cardH = 220;
    var cardY = 145;

    // Card 1: Student
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(60, cardY, cardW, cardH);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, cardY, cardW, cardH);

    // Yellow top border on student card
    ctx.fillStyle = '#facc15';
    ctx.fillRect(60, cardY, cardW, 6);

    ctx.fillStyle = '#111827';
    ctx.font = '800 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(sName + ' (You)', 85, cardY + 45, cardW - 50);

    ctx.fillStyle = '#4b5563';
    ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(getBand(sScore).name, 85, cardY + 75, cardW - 50);

    ctx.fillStyle = '#000000';
    ctx.font = '900 64px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(fmtPct(sScore), 85, cardY + 150);

    // Progress bar for student
    ctx.fillStyle = '#e5e7eb';
    ctx.fillRect(85, cardY + 175, cardW - 50, 16);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(85, cardY + 175, (cardW - 50) * (Math.min(100, Math.max(0, sScore)) / 100), 16);

    // Card 2: Friend
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(630, cardY, cardW, cardH);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(630, cardY, cardW, cardH);

    // Dark top border on friend card
    ctx.fillStyle = '#111827';
    ctx.fillRect(630, cardY, cardW, 6);

    ctx.fillStyle = '#111827';
    ctx.font = '800 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(fName, 655, cardY + 45, cardW - 50);

    ctx.fillStyle = '#4b5563';
    ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(getBand(fScore).name, 655, cardY + 75, cardW - 50);

    ctx.fillStyle = '#111827';
    ctx.font = '900 64px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(fmtPct(fScore), 655, cardY + 150);

    // Progress bar for friend
    ctx.fillStyle = '#e5e7eb';
    ctx.fillRect(655, cardY + 175, cardW - 50, 16);
    ctx.fillStyle = '#111827';
    ctx.fillRect(655, cardY + 175, (cardW - 50) * (Math.min(100, Math.max(0, fScore)) / 100), 16);

    // 3. Lower Comparison Summary Panel
    var summaryY = 395;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(60, summaryY, 1080, 150);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(60, summaryY, 1080, 150);

    var diff = sScore - fScore;
    var summaryText = '';
    if (diff > 0.05) {
      summaryText = sName + ' leads by ' + Math.abs(diff).toFixed(2) + ' percentage points across continuous assessment tasks.';
    } else if (diff < -0.05) {
      summaryText = fName + ' leads by ' + Math.abs(diff).toFixed(2) + ' percentage points. Review highest-weight tasks to close the gap.';
    } else {
      summaryText = 'Both students are level at ' + fmtPct(sScore) + ' in this module.';
    }

    ctx.fillStyle = '#111827';
    ctx.font = '800 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Key Comparison Takeaway', 85, summaryY + 40);

    ctx.fillStyle = '#4b5563';
    ctx.font = '500 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(summaryText, 85, summaryY + 75, 1030);

    // DHET Sub-minimum statement
    var dhetStatus = (sScore >= 40 && fScore >= 40)
      ? 'Both students qualify for national exam admission (DHET 40% sub-minimum cleared).'
      : 'Note: DHET Report 191 regulations require an ICASS sub-minimum of 40% for exam entry.';

    ctx.fillStyle = '#6b7280';
    ctx.font = 'italic 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(dhetStatus, 85, summaryY + 115, 1030);

    // 4. Footer
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 570, W, 60);

    ctx.fillStyle = '#9ca3af';
    ctx.font = '600 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('AfriWidget.com  •  Free TVET Academic & Coursework Calculators', 60, 606, 710);

    ctx.fillStyle = '#facc15';
    ctx.font = '700 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Compare your results free on AfriWidget.com', 820, 606, 330);
  }

  // Attach all workspace event listeners
  function attachCompareEventListeners() {
    // Close button
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

    // Name & Module inputs
    var sNameInput = document.getElementById('compStudentName');
    if (sNameInput) {
      sNameInput.addEventListener('input', function () {
        compareState.studentName = (this.value || 'You').trim();
        updateLiveComparisonDetails();
      });
    }

    var fNameInput = document.getElementById('compFriendName');
    if (fNameInput) {
      fNameInput.addEventListener('input', function () {
        compareState.friendName = (this.value || 'Classmate').trim();
        updateLiveComparisonDetails();
      });
    }

    var modInput = document.getElementById('compModuleName');
    if (modInput) {
      modInput.addEventListener('input', function () {
        compareState.moduleName = (this.value || 'TVET Coursework').trim();
        updateLiveComparisonDetails();
      });
    }

    // Tab buttons
    var tabManual = document.getElementById('tabCompManual');
    var tabImport = document.getElementById('tabCompImport');
    var panManual = document.getElementById('compManualPanel');
    var panImport = document.getElementById('compImportPanel');

    if (tabManual && tabImport && panManual && panImport) {
      tabManual.addEventListener('click', function () {
        compareState.activeTab = 'manual';
        tabManual.classList.add('active');
        tabManual.setAttribute('aria-selected', 'true');
        tabImport.classList.remove('active');
        tabImport.setAttribute('aria-selected', 'false');
        panManual.style.display = 'block';
        panImport.style.display = 'none';
      });

      tabImport.addEventListener('click', function () {
        compareState.activeTab = 'import';
        tabImport.classList.add('active');
        tabImport.setAttribute('aria-selected', 'true');
        tabManual.classList.remove('active');
        tabManual.setAttribute('aria-selected', 'false');
        panManual.style.display = 'none';
        panImport.style.display = 'block';
      });
    }

    // Friend Mode pills
    var modeBtns = document.querySelectorAll('.comp-mode-btn');
    modeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var m = this.getAttribute('data-mode');
        if (m && m !== compareState.friendMode) {
          compareState.friendMode = m;
          compareState.friendTasks = getDefaultTasks(m);
          renderCompareUI();
        }
      });
    });

    // Score inputs
    var scoreInputs = document.querySelectorAll('.comp-friend-score-input');
    scoreInputs.forEach(function (inp) {
      inp.addEventListener('input', function () {
        var idx = parseInt(this.getAttribute('data-task-idx'), 10);
        var val = parseFloat(this.value);
        var invalid = this.value !== '' && (!isFinite(val) || val < 0 || val > 100);
        this.setCustomValidity(invalid ? 'Enter a score from 0 to 100.' : '');
        this.setAttribute('aria-invalid', invalid ? 'true' : 'false');
        if (compareState.friendTasks[idx]) {
          compareState.friendTasks[idx].score = !invalid && this.value !== '' && isFinite(val) ? val : null;
        }
        var statusMsg = document.getElementById('compStatusMessage');
        if (invalid && statusMsg) statusMsg.textContent = 'Scores must be between 0 and 100. Correct the highlighted value before updating.';
        else if (statusMsg) statusMsg.textContent = '';
      });
    });

    // Update Comparison button
    var calcBtn = document.getElementById('compCalculateBtn');
    if (calcBtn) {
      calcBtn.addEventListener('click', function () {
        var invalidInput = document.querySelector('.comp-friend-score-input:invalid');
        var statusMsg = document.getElementById('compStatusMessage');
        if (invalidInput) {
          if (statusMsg) statusMsg.textContent = 'Scores must be between 0 and 100. Correct the highlighted value before updating.';
          invalidInput.focus();
          return;
        }
        var hasValid = compareState.friendTasks.some(function (t) { return t.score !== null; });
        if (!hasValid && statusMsg) {
          statusMsg.textContent = 'Please enter at least one task score for your friend to calculate the comparison.';
          return;
        }
        if (statusMsg) statusMsg.textContent = '';
        renderCompareUI();
        var resultsSection = document.getElementById('compareResultsSection');
        if (resultsSection && typeof resultsSection.scrollIntoView === 'function') {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    // Sample friend marks button
    var sampleBtn = document.getElementById('compSampleFriendBtn');
    if (sampleBtn) {
      sampleBtn.addEventListener('click', function () {
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
          compareState.friendTasks = [
            { id: 'f_custAssign', name: 'Assignment', weight: 25, score: 72 },
            { id: 'f_custPrac', name: 'Practical', weight: 35, score: 68 },
            { id: 'f_custTest', name: 'Test', weight: 30, score: 64 },
            { id: 'f_custAtt', name: 'Attendance / Other', weight: 10, score: 85 }
          ];
        }
        renderCompareUI();
        var resultsSection = document.getElementById('compareResultsSection');
        if (resultsSection && typeof resultsSection.scrollIntoView === 'function') {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    // Clear friend marks button
    var clearBtn = document.getElementById('compClearFriendBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        compareState.friendTasks = getDefaultTasks(compareState.friendMode);
        renderCompareUI();
      });
    }

    // Reset All button
    var resetAllBtn = document.getElementById('compareResetAllBtn');
    if (resetAllBtn) {
      resetAllBtn.addEventListener('click', function () {
        var studentCtx = getCurrentStudentContext();
        compareState.studentName = 'You';
        compareState.friendName = 'Classmate';
        compareState.moduleName = 'TVET Coursework';
        compareState.friendMode = studentCtx ? (studentCtx.mode || 'standard') : 'standard';
        compareState.friendTasks = getDefaultTasks(compareState.friendMode);
        compareState.activeTab = 'manual';
        compareState.hypotheticalTaskIndex = 0;
        compareState.hypotheticalScore = 75;
        compareState.friendLoadedFromUrl = false;
        renderCompareUI();
        var resetFocusTarget = document.getElementById('compStudentName');
        if (resetFocusTarget) resetFocusTarget.focus();
      });
    }

    // Import from link button
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
        renderCompareUI();
        var resultsSection = document.getElementById('compareResultsSection');
        if (resultsSection && typeof resultsSection.scrollIntoView === 'function') {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    // Simulator select & slider
    var simSelect = document.getElementById('simTaskSelect');
    var simSlider = document.getElementById('simScoreSlider');
    var simScoreVal = document.getElementById('simScoreVal');

    if (simSelect) {
      simSelect.addEventListener('change', function () {
        compareState.hypotheticalTaskIndex = parseInt(this.value, 10);
        renderCompareUI();
      });
    }

    if (simSlider && simScoreVal) {
      simSlider.addEventListener('input', function () {
        compareState.hypotheticalScore = parseInt(this.value, 10);
        simScoreVal.textContent = compareState.hypotheticalScore + '%';

        var studentCtx = getCurrentStudentContext();
        if (studentCtx && studentCtx.tasks) {
          var targetTask = studentCtx.tasks[compareState.hypotheticalTaskIndex] || studentCtx.tasks[0];
          var oldScore = (targetTask && targetTask.score !== null) ? targetTask.score : 0;
          var newScore = compareState.hypotheticalScore;
          var delta = newScore - oldScore;
          var weight = targetTask ? targetTask.weight : 0;
          var pointsGain = (delta * (weight / 100));
          var projectedAvg = Math.round((studentCtx.icassAverage + pointsGain) * 100) / 100;
          var friendCalc = calculateWeightedAverage(compareState.friendTasks);

          var projScoreEl = document.querySelector('.sim-projected-score');
          if (projScoreEl) projScoreEl.textContent = fmtPct(projectedAvg);

          var gainEl = document.querySelector('.sim-meta-gain');
          if (gainEl) {
            var sign = pointsGain >= 0 ? '+' : '';
            gainEl.textContent = sign + pointsGain.toFixed(2) + ' pts net difference';
            gainEl.className = 'sim-meta-gain ' + (pointsGain >= 0 ? 'pos' : 'neg');
          }

          var bandEl = document.querySelector('.sim-meta-band strong');
          if (bandEl) bandEl.textContent = getBand(projectedAvg).name;

          var leadSummaryEl = document.getElementById('simLeadSummary');
          if (leadSummaryEl && friendCalc) {
            var projectedDiff = projectedAvg - friendCalc.average;
            leadSummaryEl.textContent = projectedDiff > 0.05
              ? 'You would lead ' + (compareState.friendName || 'Classmate') + ' by ' + projectedDiff.toFixed(2) + ' points'
              : (projectedDiff < -0.05
                ? 'You would trail ' + (compareState.friendName || 'Classmate') + ' by ' + Math.abs(projectedDiff).toFixed(2) + ' points'
                : 'Your projected result would be level with ' + (compareState.friendName || 'Classmate'));
          }
        }
      });
    }

    // Canvas PNG Download button
    var downloadBtn = document.getElementById('compareDownloadImageBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', function () {
        var canvas = document.getElementById('compareExportCanvas');
        if (!canvas) return;
        try {
          var link = document.createElement('a');
          var filename = 'AfriWidget-ICASS-Comparison-' + (compareState.moduleName.replace(/[^a-zA-Z0-9]/g, '_') || 'TVET') + '.png';
          link.download = filename;
          link.href = canvas.toDataURL('image/png');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (e) {
          alert('Could not download image directly. You can right-click the image preview above and select "Save Image As".');
        }
      });
    }

    // Share Comparison Link button
    var shareBtn = document.getElementById('compareShareBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', async function () {
        var shareUrl = buildComparisonShareUrl();
        try {
          if (navigator.share) {
            await navigator.share({
              title: 'AfriWidget ICASS comparison',
              text: 'Compare ICASS results with a friend',
              url: shareUrl
            });
            if (typeof window.showAfriToast === 'function') {
              window.showAfriToast('Comparison ready to share.');
            }
          } else if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            await navigator.clipboard.writeText(shareUrl);
            if (typeof window.showAfriToast === 'function') {
              window.showAfriToast('Comparison link copied to clipboard!');
            } else {
              alert('Comparison link copied to clipboard!');
            }
          } else {
            prompt('Copy this comparison link to share with your classmate:', shareUrl);
          }
        } catch (e) {
          if (!e || e.name !== 'AbortError') {
            if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
              try {
                await navigator.clipboard.writeText(shareUrl);
                if (typeof window.showAfriToast === 'function') {
                  window.showAfriToast('Comparison link copied to clipboard!');
                } else {
                  alert('Comparison link copied to clipboard!');
                }
              } catch (clipboardError) {
                prompt('Copy this comparison link to share with your classmate:', shareUrl);
              }
            } else {
              prompt('Copy this comparison link to share with your classmate:', shareUrl);
            }
          }
        }
      });
    }
  }

  // Check URL on page load for friend or comparison query parameters
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
          compareState.friendLoadedFromUrl = true;

          // If student context is already computed, open comparison
          var studentCtx = getCurrentStudentContext();
          if (studentCtx) {
            compareState.isOpen = true;
            renderCompareUI();
          }
        }
      }
    } catch (e) {
      // Ignore URL parsing errors
    }
  }

  // Initialize the feature into the DOM
  function initCompareFeature() {
    injectCompareStyles();

    var resultsEl = document.getElementById('results');
    var calcWrap = document.querySelector('.calc-wrap .container-narrow');
    if (!resultsEl || !calcWrap) return;

    // 1. Inject or Update Compare Bar inside #results
    var entryCard = document.getElementById('compareEntryCard');
    if (!entryCard) {
      entryCard = document.createElement('div');
      entryCard.id = 'compareEntryCard';
      entryCard.className = 'compare-banner-card';
      entryCard.innerHTML = [
        '<div class="compare-banner-content">',
        '  <h3 class="compare-banner-title">Compare ICASS results with a friend</h3>',
        '  <p class="compare-banner-desc">Review both weighted averages, compare matching assessment tasks, and find practical areas to improve.</p>',
        '</div>',
        '<button type="button" id="openCompareBtn" class="compare-banner-btn" aria-expanded="false" aria-controls="compareWorkspaceSection">',
        '  <svg width="18" height="18" fill="none" stroke="#f59e0b" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">',
        '    <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>',
        '  </svg>',
        '  <span class="compare-btn-label">Compare with a Friend</span>',
        '</button>'
      ].join('');

      // Insert right after weaknessCalloutBanner or exam-target-panel, before afriShareBar
      var weaknessBanner = document.getElementById('weaknessCalloutBanner');
      var shareBar = document.getElementById('afriShareBar');
      var examTarget = resultsEl.querySelector('.exam-target-panel');

      if (weaknessBanner && weaknessBanner.nextSibling) {
        resultsEl.insertBefore(entryCard, weaknessBanner.nextSibling);
      } else if (shareBar) {
        resultsEl.insertBefore(entryCard, shareBar);
      } else if (examTarget && examTarget.nextSibling) {
        resultsEl.insertBefore(entryCard, examTarget.nextSibling);
      } else {
        resultsEl.appendChild(entryCard);
      }
    } else {
      // Re-apply clean redesigned class and markup if needed
      entryCard.className = 'compare-banner-card';
      entryCard.innerHTML = [
        '<div class="compare-banner-content">',
        '  <h3 class="compare-banner-title">Compare ICASS results with a friend</h3>',
        '  <p class="compare-banner-desc">Review both weighted averages, compare matching assessment tasks, and find practical areas to improve.</p>',
        '</div>',
        '<button type="button" id="openCompareBtn" class="compare-banner-btn" aria-expanded="false" aria-controls="compareWorkspaceSection">',
        '  <svg width="18" height="18" fill="none" stroke="#f59e0b" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">',
        '    <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>',
        '  </svg>',
        '  <span class="compare-btn-label">Compare with a Friend</span>',
        '</button>'
      ].join('');
    }

    // Toggle button handler
    var openBtn = document.getElementById('openCompareBtn');
    if (openBtn) {
      openBtn.onclick = function () {
        var studentCtx = getCurrentStudentContext();
        if (!studentCtx) {
          if (typeof window.showAfriToast === 'function') {
            window.showAfriToast('Please enter your assessment marks and calculate your ICASS average first so we have your results ready to compare.');
          } else {
            alert('Please enter your assessment marks and calculate your ICASS average first so we have your results ready to compare.');
          }
          var form = document.getElementById('icassForm');
          if (form && typeof form.scrollIntoView === 'function') {
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          return;
        }

        // Toggle state
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

    // 2. Inject Workspace Container right after .calc-panel
    var workspaceSection = document.getElementById('compareWorkspaceSection');
    if (!workspaceSection) {
      workspaceSection = document.createElement('section');
      workspaceSection.id = 'compareWorkspaceSection';
      workspaceSection.className = 'compare-workspace-wrap';
      workspaceSection.style.display = 'none';
      calcWrap.appendChild(workspaceSection);
    }

    // 3. Setup single listener for calculator reset
    var calcResetBtn = document.getElementById('resetBtn');
    if (calcResetBtn && !calcResetBtn.hasAttribute('data-compare-reset-bound')) {
      calcResetBtn.setAttribute('data-compare-reset-bound', 'true');
      calcResetBtn.addEventListener('click', function () {
        compareState.isOpen = false;
        var container = document.getElementById('compareWorkspaceSection');
        if (container) container.style.display = 'none';
        updateBannerButtonState();
      });
    }

    // 4. Check for URL parameters
    checkUrlForComparisonData();
  }

  // Re-render when student performs a calculation
  window.addEventListener('icassCalculated', function () {
    if (compareState.isOpen) {
      renderCompareUI();
    } else {
      updateBannerButtonState();
    }
  });

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCompareFeature);
  } else {
    initCompareFeature();
  }
})();
