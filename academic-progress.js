/**
 * AfriWidget Academic Progress Engine
 * Lightweight, private, client-side tracking and radar chart visualization
 * for high-traffic AfriWidget education tools.
 * 
 * - Zero accounts, zero login, zero cloud storage, 100% private in-browser localStorage.
 * - Zero Tailwind CSS, pure custom scoped AfriWidget brand design system (#000000, #facc15, #ca8a04, #ffffff, #e5e5e5).
 * - Automatic background recording on calculation with zero friction or gating.
 * - Interactive pure SVG radar chart of subject performance.
 * - Comparative summary: Latest, Previous, Improvement/Decline, Strongest, Weakest subjects.
 * - Complete chronological attempt history viewer with self-management & clear option.
 */
(function () {
  'use strict';

  if (typeof window === 'undefined') return;

  var STORAGE_PREFIX = 'afriwidget_academic_progress_';
  var MAX_HISTORY_ITEMS = 15;

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function getPageSlug() {
    var path = window.location.pathname.split('/').pop().replace(/\.html$/, '') || '';
    return path.toLowerCase();
  }

  // Pure vanilla SVG icons (AfriWidget brand style)
  var icons = {
    cap: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
    history: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
    star: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
    target: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="2" r="2"></circle></svg>',
    arrowUp: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>',
    arrowDown: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>',
    equal: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="9" x2="19" y2="9"></line><line x1="5" y1="15" x2="19" y2="15"></line></svg>',
    dot: '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="10"/></svg>',
    close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
    trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>'
  };

  // Inject Self-Contained AfriWidget Scoped CSS (Zero Tailwind, pure AfriWidget styling)
  function injectStyles() {
    if (document.getElementById('afriwidget-academic-progress-styles')) return;
    var style = document.createElement('style');
    style.id = 'afriwidget-academic-progress-styles';
    style.textContent = `
      .afri-academic-progress {
        display: block;
        margin-top: 1.5rem;
        margin-bottom: 1.5rem;
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-radius: 0.875rem;
        padding: 1.25rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        color: #000000;
        box-sizing: border-box;
      }
      .afri-academic-progress *, .afri-academic-progress *::before, .afri-academic-progress *::after {
        box-sizing: border-box;
      }
      @media (min-width: 640px) {
        .afri-academic-progress {
          padding: 1.625rem;
        }
      }
      .afri-prog-header {
        display: flex;
        flex-direction: column;
        gap: 0.875rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #f3f4f6;
      }
      @media (min-width: 640px) {
        .afri-prog-header {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }
      }
      .afri-prog-title-wrap {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .afri-prog-icon-badge {
        width: 2.375rem;
        height: 2.375rem;
        border-radius: 0.625rem;
        background: #fef3c7;
        color: #ca8a04;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .afri-prog-title {
        font-size: 1.125rem;
        font-weight: 900;
        letter-spacing: -0.01em;
        color: #000000;
        margin: 0;
        line-height: 1.25;
      }
      .afri-prog-subtitle {
        font-size: 0.8125rem;
        color: #6b7280;
        margin: 0.125rem 0 0;
        line-height: 1.4;
      }
      .afri-prog-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .afri-prog-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        background: #f9fafb;
        color: #111827;
        border: 1px solid #e5e5e5;
        border-radius: 0.5rem;
        padding: 0.5rem 0.875rem;
        font-size: 0.8125rem;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.15s, border-color 0.15s, color 0.15s;
        min-height: 38px;
        text-decoration: none;
      }
      .afri-prog-btn:hover {
        background: #fefce8;
        border-color: #facc15;
        color: #000000;
      }
      .afri-prog-badge-count {
        background: #000000;
        color: #fde047;
        border-radius: 9999px;
        padding: 0.125rem 0.45rem;
        font-size: 0.6875rem;
        font-weight: 800;
        line-height: 1;
      }
      .afri-prog-body {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.25rem;
        margin-top: 1.25rem;
      }
      @media (min-width: 768px) {
        .afri-prog-body {
          grid-template-columns: 1.05fr 1fr;
          align-items: stretch;
          gap: 1.5rem;
        }
      }
      .afri-radar-card {
        background: #fafaf9;
        border: 1px solid #e7e5e4;
        border-radius: 0.75rem;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      .afri-card-label {
        font-size: 0.6875rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #78716c;
        margin-bottom: 0.5rem;
        width: 100%;
        text-align: left;
      }
      .afri-radar-svg-wrap {
        width: 100%;
        max-width: 320px;
        aspect-ratio: 1 / 1;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: auto;
      }
      .afri-radar-svg {
        width: 100%;
        height: auto;
        display: block;
        overflow: visible;
      }
      .afri-summary-card {
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-radius: 0.75rem;
        padding: 1.125rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .afri-stat-pair-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
        margin-bottom: 0.875rem;
      }
      .afri-stat-box {
        background: #f9fafb;
        border: 1px solid #e5e5e5;
        border-radius: 0.625rem;
        padding: 0.75rem;
        text-align: center;
      }
      .afri-stat-box.highlight {
        background: #fefce8;
        border-color: #fef08a;
      }
      .afri-stat-box-label {
        font-size: 0.6875rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #6b7280;
        display: block;
        margin-bottom: 0.25rem;
      }
      .afri-stat-box.highlight .afri-stat-box-label {
        color: #854d0e;
      }
      .afri-stat-box-val {
        font-size: 1.375rem;
        font-weight: 900;
        color: #000000;
        display: block;
        line-height: 1.15;
      }
      .afri-stat-box-val.accent {
        color: #000000;
      }
      .afri-stat-box-sub {
        font-size: 0.6875rem;
        color: #9ca3af;
        display: block;
        margin-top: 0.25rem;
        line-height: 1.3;
      }
      .afri-stat-box.highlight .afri-stat-box-sub {
        color: #a16207;
      }
      .afri-trend-banner {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 0.875rem;
        border-radius: 0.5rem;
        font-size: 0.8125rem;
        font-weight: 700;
        margin-bottom: 0.875rem;
        line-height: 1.4;
      }
      .afri-trend-banner.improved {
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        color: #166534;
      }
      .afri-trend-banner.declined {
        background: #fffbeb;
        border: 1px solid #fde68a;
        color: #92400e;
      }
      .afri-trend-banner.neutral {
        background: #f3f4f6;
        border: 1px solid #e5e5e5;
        color: #374151;
      }
      .afri-trend-banner.baseline {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        color: #334155;
      }
      .afri-subject-highlights-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.625rem;
      }
      @media (min-width: 500px) {
        .afri-subject-highlights-grid {
          grid-template-columns: 1fr 1fr;
        }
      }
      .afri-subject-highlight {
        display: flex;
        align-items: flex-start;
        gap: 0.625rem;
        border-radius: 0.5rem;
        padding: 0.6875rem 0.75rem;
      }
      .afri-subject-highlight.strongest {
        background: #f0fdf4;
        border: 1px solid #dcfce7;
        border-left: 3px solid #16a34a;
      }
      .afri-subject-highlight.weakest {
        background: #fffbeb;
        border: 1px solid #fef3c7;
        border-left: 3px solid #d97706;
      }
      .afri-highlight-icon {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 0.375rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-top: 0.125rem;
      }
      .afri-subject-highlight.strongest .afri-highlight-icon {
        background: #dcfce7;
        color: #15803d;
      }
      .afri-subject-highlight.weakest .afri-highlight-icon {
        background: #fef3c7;
        color: #b45309;
      }
      .afri-highlight-info {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .afri-highlight-tag {
        font-size: 0.625rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.125rem;
      }
      .afri-subject-highlight.strongest .afri-highlight-tag {
        color: #166534;
      }
      .afri-subject-highlight.weakest .afri-highlight-tag {
        color: #92400e;
      }
      .afri-highlight-name {
        font-size: 0.8125rem;
        font-weight: 800;
        color: #000000;
        line-height: 1.3;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .afri-highlight-score {
        font-size: 0.6875rem;
        font-weight: 600;
        color: #6b7280;
        margin-top: 0.125rem;
      }

      /* Modal Styling */
      .afri-prog-modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: rgba(0, 0, 0, 0.72);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        box-sizing: border-box;
      }
      .afri-prog-modal-overlay.open {
        opacity: 1;
        pointer-events: auto;
      }
      .afri-prog-modal-card {
        position: relative;
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-radius: 0.875rem;
        width: 100%;
        max-width: 560px;
        max-height: 88vh;
        overflow-y: auto;
        padding: 1.5rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.25);
        transform: translateY(10px) scale(0.98);
        transition: transform 0.2s ease;
        box-sizing: border-box;
        text-align: left;
      }
      .afri-prog-modal-overlay.open .afri-prog-modal-card {
        transform: translateY(0) scale(1);
      }
      .afri-prog-modal-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e5e5e5;
        margin-bottom: 1.25rem;
      }
      .afri-prog-modal-title {
        font-size: 1.25rem;
        font-weight: 900;
        color: #000000;
        margin: 0;
        letter-spacing: -0.01em;
      }
      .afri-prog-modal-desc {
        font-size: 0.8125rem;
        color: #6b7280;
        margin: 0.25rem 0 0;
        line-height: 1.45;
      }
      .afri-prog-modal-close {
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 0.375rem;
        border: 1px solid #e5e5e5;
        background: #ffffff;
        color: #4b5563;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.15s, color 0.15s;
        flex-shrink: 0;
      }
      .afri-prog-modal-close:hover {
        background: #f3f4f6;
        color: #000000;
      }
      .afri-history-list {
        display: flex;
        flex-direction: column;
        gap: 0.875rem;
        margin-bottom: 1.5rem;
      }
      .afri-history-item {
        background: #f9fafb;
        border: 1px solid #e5e5e5;
        border-radius: 0.625rem;
        padding: 0.875rem 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .afri-history-item.latest {
        border-color: #facc15;
        background: #fefce8;
      }
      .afri-history-item-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      .afri-history-index-wrap {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .afri-history-num {
        font-size: 0.6875rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #6b7280;
      }
      .afri-history-date {
        font-size: 0.75rem;
        color: #9ca3af;
      }
      .afri-history-score-badge {
        font-size: 0.875rem;
        font-weight: 900;
        color: #000000;
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-radius: 0.375rem;
        padding: 0.25rem 0.5rem;
      }
      .afri-history-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.375rem;
      }
      .afri-history-chip {
        font-size: 0.6875rem;
        font-weight: 600;
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-radius: 0.25rem;
        padding: 0.2rem 0.4rem;
        color: #374151;
      }
      .afri-history-empty {
        text-align: center;
        padding: 2.5rem 1rem;
        color: #6b7280;
        font-size: 0.875rem;
      }
      .afri-prog-modal-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding-top: 1rem;
        border-top: 1px solid #e5e5e5;
      }
      .afri-btn-danger-outline {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        background: transparent;
        color: #dc2626;
        border: 1px solid #fecaca;
        border-radius: 0.375rem;
        padding: 0.5rem 0.75rem;
        font-size: 0.75rem;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.15s;
      }
      .afri-btn-danger-outline:hover {
        background: #fef2f2;
      }
      .afri-btn-modal-done {
        background: #facc15;
        color: #000000;
        border: none;
        border-radius: 0.375rem;
        padding: 0.5rem 1.25rem;
        font-size: 0.8125rem;
        font-weight: 800;
        cursor: pointer;
        transition: background 0.15s;
      }
      .afri-btn-modal-done:hover {
        background: #fde047;
      }
    `;
    document.head.appendChild(style);
  }

  // --- TOOL ADAPTERS ---
  var adapters = {
    // 1. WASSCE Aggregate Calculator
    'wassce-aggregate-calculator': {
      id: 'wassce-aggregate',
      title: 'WASSCE Aggregate Calculator',
      higherIsBetter: false,
      extract: function () {
        var aggEl = document.getElementById('aggregateValue');
        var val = aggEl ? parseInt(aggEl.textContent.trim(), 10) : NaN;
        if (isNaN(val)) return null;

        var ptsMap = { 'A1': 1, 'B2': 2, 'B3': 3, 'C4': 4, 'C5': 5, 'C6': 6, 'D7': 7, 'E8': 8, 'F9': 9 };
        var subjects = [];

        var eng = document.getElementById('coreEnglish')?.value;
        var math = document.getElementById('coreMaths')?.value;
        var sci = document.getElementById('integratedScience')?.value;
        var soc = document.getElementById('socialStudies')?.value;
        var e1 = document.getElementById('elective1')?.value;
        var e2 = document.getElementById('elective2')?.value;
        var e3 = document.getElementById('elective3')?.value;
        var e4 = document.getElementById('elective4')?.value;

        if (eng && ptsMap[eng]) subjects.push({ name: 'English', grade: eng, raw: ptsMap[eng], norm: Math.max(0.12, (10 - ptsMap[eng]) / 9), display: eng + ' (' + ptsMap[eng] + ' pt)' });
        if (math && ptsMap[math]) subjects.push({ name: 'Maths', grade: math, raw: ptsMap[math], norm: Math.max(0.12, (10 - ptsMap[math]) / 9), display: math + ' (' + ptsMap[math] + ' pt)' });
        if (sci && ptsMap[sci]) subjects.push({ name: 'Science', grade: sci, raw: ptsMap[sci], norm: Math.max(0.12, (10 - ptsMap[sci]) / 9), display: sci + ' (' + ptsMap[sci] + ' pt)' });
        if (soc && ptsMap[soc]) subjects.push({ name: 'Social', grade: soc, raw: ptsMap[soc], norm: Math.max(0.12, (10 - ptsMap[soc]) / 9), display: soc + ' (' + ptsMap[soc] + ' pt)' });
        if (e1 && ptsMap[e1]) subjects.push({ name: 'Elective 1', grade: e1, raw: ptsMap[e1], norm: Math.max(0.12, (10 - ptsMap[e1]) / 9), display: e1 + ' (' + ptsMap[e1] + ' pt)' });
        if (e2 && ptsMap[e2]) subjects.push({ name: 'Elective 2', grade: e2, raw: ptsMap[e2], norm: Math.max(0.12, (10 - ptsMap[e2]) / 9), display: e2 + ' (' + ptsMap[e2] + ' pt)' });
        if (e3 && ptsMap[e3]) subjects.push({ name: 'Elective 3', grade: e3, raw: ptsMap[e3], norm: Math.max(0.12, (10 - ptsMap[e3]) / 9), display: e3 + ' (' + ptsMap[e3] + ' pt)' });
        if (e4 && ptsMap[e4]) subjects.push({ name: 'Elective 4', grade: e4, raw: ptsMap[e4], norm: Math.max(0.12, (10 - ptsMap[e4]) / 9), display: e4 + ' (' + ptsMap[e4] + ' pt)' });

        return {
          value: val,
          displayValue: 'Aggregate ' + val,
          subjects: subjects
        };
      }
    },

    // 2. BECE Aggregate Calculator
    'bece-aggregate-calculator': {
      id: 'bece-aggregate',
      title: 'BECE Aggregate Calculator',
      higherIsBetter: false,
      extract: function () {
        var aggEl = document.getElementById('aggregateValue');
        var val = aggEl ? parseInt(aggEl.textContent.trim(), 10) : NaN;
        if (isNaN(val)) return null;

        var subjects = [];
        var eng = document.getElementById('coreEnglish')?.value;
        var math = document.getElementById('coreMaths')?.value;
        var sci = document.getElementById('coreScience')?.value;
        var soc = document.getElementById('coreSocial')?.value;
        var e1 = document.getElementById('elective1')?.value;
        var e2 = document.getElementById('elective2')?.value;
        var e3 = document.getElementById('elective3')?.value;

        var add = function (name, gStr) {
          var g = parseInt(gStr, 10);
          if (!isNaN(g) && g >= 1 && g <= 9) {
            subjects.push({ name: name, grade: 'Grade ' + g, raw: g, norm: Math.max(0.12, (10 - g) / 9), display: 'Grade ' + g });
          }
        };

        add('English', eng);
        add('Maths', math);
        add('Science', sci);
        add('Social', soc);
        add('Elective 1', e1);
        add('Elective 2', e2);
        if (e3) add('Elective 3', e3);

        return {
          value: val,
          displayValue: 'Aggregate ' + val,
          subjects: subjects
        };
      }
    },

    // 3. GPA Calculator
    'gpa-calculator': {
      id: 'gpa-calculator',
      title: 'Cumulative GPA Calculator',
      higherIsBetter: true,
      extract: function () {
        var gpaEl = document.getElementById('gpaValue');
        var val = gpaEl ? parseFloat(gpaEl.textContent.trim()) : NaN;
        if (isNaN(val)) return null;

        var gpaMap = { 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0 };
        var subjects = [];
        var rows = document.querySelectorAll('.course-row');
        rows.forEach(function (row, idx) {
          var nameInput = row.querySelector('input[type="text"]');
          var gradeSel = row.querySelector('select');
          var name = (nameInput && nameInput.value.trim()) || ('Course ' + (idx + 1));
          var grade = gradeSel ? gradeSel.value : '';
          if (grade && gpaMap[grade] !== undefined) {
            var pts = gpaMap[grade];
            subjects.push({
              name: name,
              grade: grade,
              raw: pts,
              norm: Math.max(0.12, pts / 4.0),
              display: grade + ' (' + pts.toFixed(1) + ')'
            });
          }
        });

        return {
          value: val,
          displayValue: val.toFixed(2) + ' GPA',
          subjects: subjects
        };
      }
    },

    // 4. APS Calculator (South Africa)
    'south-african-aps-calculator': {
      id: 'south-african-aps',
      title: 'South African APS Calculator',
      higherIsBetter: true,
      extract: function () {
        var apsEl = document.getElementById('apsValue');
        var val = apsEl ? parseInt(apsEl.textContent.trim(), 10) : NaN;
        if (isNaN(val)) return null;

        var subjects = [];
        var getLevel = function (p) {
          if (p >= 80) return 7;
          if (p >= 70) return 6;
          if (p >= 60) return 5;
          if (p >= 50) return 4;
          if (p >= 40) return 3;
          if (p >= 30) return 2;
          return 1;
        };

        for (var i = 1; i <= 6; i++) {
          var inp = document.getElementById('sub' + i);
          if (inp && inp.value !== '') {
            var p = parseFloat(inp.value);
            if (!isNaN(p)) {
              var lvl = getLevel(p);
              subjects.push({
                name: 'Subject ' + i,
                grade: 'Level ' + lvl,
                raw: p,
                norm: Math.max(0.12, p / 100),
                display: 'L' + lvl + ' (' + Math.round(p) + '%)'
              });
            }
          }
        }

        var loCheck = document.getElementById('includeLO');
        var loInp = document.getElementById('loPercent');
        if (loCheck && loCheck.checked && loInp && loInp.value !== '') {
          var loP = parseFloat(loInp.value);
          if (!isNaN(loP)) {
            var loLvl = getLevel(loP);
            subjects.push({
              name: 'Life Orientation',
              grade: 'Level ' + loLvl,
              raw: loP,
              norm: Math.max(0.12, loP / 100),
              display: 'L' + loLvl + ' (' + Math.round(loP) + '%)'
            });
          }
        }

        return {
          value: val,
          displayValue: val + ' APS Points',
          subjects: subjects
        };
      }
    },

    // 5. ICASS Calculator
    'icass-calculator': {
      id: 'icass-calculator',
      title: 'TVET ICASS Calculator',
      higherIsBetter: true,
      extract: function () {
        var resEl = document.getElementById('icassBig');
        var val = resEl ? parseFloat(resEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;

        var subjects = [];
        var checkTask = function (id, label) {
          var el = document.getElementById(id);
          if (el && el.value !== '') {
            var score = parseFloat(el.value);
            if (!isNaN(score)) {
              subjects.push({
                name: label,
                grade: Math.round(score) + '%',
                raw: score,
                norm: Math.max(0.12, score / 100),
                display: Math.round(score) + '%'
              });
            }
          }
        };

        checkTask('stdTest1', 'Test 1');
        checkTask('stdAssign1', 'Assignment 1');
        checkTask('stdTest2', 'Test 2');
        checkTask('stdAssign2', 'Assignment 2');
        checkTask('stdTrial', 'Trial Exam');

        if (subjects.length === 0) {
          checkTask('trimTest', 'Class Test');
          checkTask('trimAssign', 'Assignment');
          checkTask('trimExam', 'Internal Exam');
        }

        if (subjects.length === 0) {
          checkTask('custTestScore', 'Test');
          checkTask('custAssignScore', 'Assignment');
          checkTask('custPracScore', 'Practical');
          checkTask('custAttScore', 'Attendance');
        }

        return {
          value: val,
          displayValue: val.toFixed(1) + '% ICASS',
          subjects: subjects
        };
      }
    },

    // 6. KCSE Grade Calculator
    'kcse-grade-calculator': {
      id: 'kcse-grade-calculator',
      title: 'KCSE Grade Calculator',
      higherIsBetter: true,
      extract: function () {
        var meanEl = document.getElementById('meanGradeValue');
        var aggEl = document.getElementById('pointsValue');
        var pts = aggEl ? parseInt(aggEl.textContent.trim(), 10) : NaN;
        var mean = meanEl ? meanEl.textContent.trim() : '';
        if (isNaN(pts)) return null;

        var gradeLetters = { 12: 'A', 11: 'A-', 10: 'B+', 9: 'B', 8: 'B-', 7: 'C+', 6: 'C', 5: 'C-', 4: 'D+', 3: 'D', 2: 'D-', 1: 'E' };
        var subjects = [];

        var checkSub = function (id, name) {
          var el = document.getElementById(id);
          if (el && el.value !== '') {
            var p = parseInt(el.value, 10);
            if (!isNaN(p)) {
              subjects.push({
                name: name,
                grade: gradeLetters[p] || (p + ' pts'),
                raw: p,
                norm: Math.max(0.12, p / 12),
                display: (gradeLetters[p] || '') + ' (' + p + ' pts)'
              });
            }
          }
        };

        checkSub('subEnglish', 'English');
        checkSub('subKiswahili', 'Kiswahili');
        checkSub('subMaths', 'Maths');
        checkSub('subBiology', 'Biology');
        checkSub('subChemistry', 'Chemistry');
        checkSub('subPhysics', 'Physics');
        checkSub('subHistory', 'History');
        checkSub('subGeography', 'Geography');
        checkSub('subReligious', 'Religious Ed');
        checkSub('subApplied', 'Applied/Tech');
        checkSub('subLanguage', 'Group V');

        return {
          value: pts,
          displayValue: (mean ? mean + ' · ' : '') + pts + ' pts',
          subjects: subjects
        };
      }
    },

    // 7. KUCCPS Cluster Points Calculator
    'kuccps-cluster-points-calculator': {
      id: 'kuccps-cluster-points',
      title: 'KUCCPS Cluster Points Calculator',
      higherIsBetter: true,
      extract: function () {
        var wcpEl = document.getElementById('wcpValue');
        var val = wcpEl ? parseFloat(wcpEl.textContent.trim()) : NaN;
        if (isNaN(val)) return null;

        var subjects = [];
        var gradeLetters = { 12: 'A', 11: 'A-', 10: 'B+', 9: 'B', 8: 'B-', 7: 'C+', 6: 'C', 5: 'C-', 4: 'D+', 3: 'D', 2: 'D-', 1: 'E' };
        for (var i = 1; i <= 4; i++) {
          var sel = document.getElementById('sub' + i);
          var lbl = document.getElementById('lblSub' + i);
          var name = (lbl && lbl.textContent.trim()) || ('Subject ' + i);
          if (sel && sel.value !== '') {
            var p = parseInt(sel.value, 10);
            if (!isNaN(p)) {
              subjects.push({
                name: name.length > 14 ? name.substring(0, 12) + '…' : name,
                grade: gradeLetters[p] || (p + ' pts'),
                raw: p,
                norm: Math.max(0.12, p / 12),
                display: (gradeLetters[p] || '') + ' (' + p + ' pts)'
              });
            }
          }
        }

        return {
          value: val,
          displayValue: val.toFixed(2) + ' Cluster Pts',
          subjects: subjects
        };
      }
    },

    // 8. KCSE-KUCCPS Cluster Calculator Alias
    'kcse-kuccps-cluster-calculator': {
      id: 'kuccps-cluster-points',
      title: 'KUCCPS Cluster Calculator',
      higherIsBetter: true,
      extract: function () {
        return adapters['kuccps-cluster-points-calculator'].extract();
      }
    },

    // 9. JAMB UTME Aggregate Calculator
    'jamb-utme-aggregate-calculator': {
      id: 'jamb-utme-aggregate',
      title: 'JAMB UTME Aggregate Calculator',
      higherIsBetter: true,
      extract: function () {
        var aggEl = document.getElementById('aggregateValue');
        var val = aggEl ? parseFloat(aggEl.textContent.trim()) : NaN;
        if (isNaN(val)) return null;

        var olevelMap = { 'A1': 10, 'B2': 9, 'B3': 8, 'C4': 7, 'C5': 6, 'C6': 5 };
        var subjects = [];

        var utmeInp = document.getElementById('jambScore');
        if (utmeInp && utmeInp.value !== '') {
          var uVal = parseFloat(utmeInp.value);
          if (!isNaN(uVal)) {
            subjects.push({
              name: 'JAMB UTME',
              grade: uVal + '/400',
              raw: uVal,
              norm: Math.max(0.12, uVal / 400),
              display: uVal + ' / 400'
            });
          }
        }

        for (var i = 1; i <= 5; i++) {
          var sel = document.getElementById('sub' + i);
          if (sel && sel.value && olevelMap[sel.value]) {
            var g = sel.value;
            var pts = olevelMap[g];
            var sLabel = i === 1 ? 'English' : i === 2 ? 'Mathematics' : ('O\'Level ' + i);
            subjects.push({
              name: sLabel,
              grade: g,
              raw: pts,
              norm: Math.max(0.12, pts / 10),
              display: g + ' (' + pts + ' pts)'
            });
          }
        }

        return {
          value: val,
          displayValue: val.toFixed(2) + ' Aggregate',
          subjects: subjects
        };
      }
    },

    // 10. JAMB Score Calculator
    'jamb-score-calculator': {
      id: 'jamb-score-calculator',
      title: 'JAMB Score Calculator',
      higherIsBetter: true,
      extract: function () {
        var totalEl = document.getElementById('totalBig');
        var val = totalEl ? parseInt(totalEl.textContent.trim(), 10) : NaN;
        if (isNaN(val)) return null;

        var subjects = [];
        var eScore = document.getElementById('engScore');
        var s2 = document.getElementById('s2Score');
        var s3 = document.getElementById('s3Score');
        var s4 = document.getElementById('s4Score');

        var l2 = document.getElementById('s2Label')?.textContent?.trim() || 'Subject 2';
        var l3 = document.getElementById('s3Label')?.textContent?.trim() || 'Subject 3';
        var l4 = document.getElementById('s4Label')?.textContent?.trim() || 'Subject 4';

        var clean = function (txt) {
          return txt.replace(/\s*\(.*?\)/, '').trim();
        };

        var add = function (name, el) {
          if (el && el.value !== '') {
            var sc = parseFloat(el.value);
            if (!isNaN(sc)) {
              subjects.push({
                name: name.length > 14 ? name.substring(0, 12) + '…' : name,
                grade: Math.round(sc) + '/100',
                raw: sc,
                norm: Math.max(0.12, sc / 100),
                display: Math.round(sc) + ' marks'
              });
            }
          }
        };

        add('English', eScore);
        add(clean(l2), s2);
        add(clean(l3), s3);
        add(clean(l4), s4);

        return {
          value: val,
          displayValue: val + ' / 400 JAMB',
          subjects: subjects
        };
      }
    },

    // 11. Tertiary GPA / CGPA Calculator
    'tertiary-gpa-cgpa-calculator': {
      id: 'tertiary-gpa-cgpa',
      title: 'Tertiary GPA Calculator',
      higherIsBetter: true,
      extract: function () {
        return adapters['gpa-calculator'].extract();
      }
    }
  };

  function getActiveAdapter() {
    var slug = getPageSlug();
    return adapters[slug] || null;
  }

  // --- LOCAL STORAGE HELPERS ---
  function getHistory(toolId) {
    try {
      var raw = localStorage.getItem(STORAGE_PREFIX + toolId);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveHistory(toolId, history) {
    try {
      localStorage.setItem(STORAGE_PREFIX + toolId, JSON.stringify(history.slice(0, MAX_HISTORY_ITEMS)));
    } catch (e) {}
  }

  function clearHistory(toolId) {
    try {
      localStorage.removeItem(STORAGE_PREFIX + toolId);
    } catch (e) {}
  }

  // --- RADAR CHART SVG GENERATOR ---
  function generateRadarSvg(subjects) {
    var count = subjects.length;
    if (count < 3) {
      return `
        <div style="padding:1.5rem 1rem;color:#78716c;font-size:0.8125rem;">
          Add 3 or more subjects to render the performance radar web.
        </div>
      `;
    }

    var sizeX = 340;
    var sizeY = 310;
    var cx = 170;
    var cy = 155;
    var r = 82;

    // 1. Concentric web polygons
    var levels = [0.33, 0.66, 1.0];
    var gridPolygonsHtml = '';
    levels.forEach(function (lvl) {
      var pts = [];
      for (var i = 0; i < count; i++) {
        var angle = -Math.PI / 2 + (2 * Math.PI * i) / count;
        var x = cx + r * lvl * Math.cos(angle);
        var y = cy + r * lvl * Math.sin(angle);
        pts.push(x.toFixed(1) + ',' + y.toFixed(1));
      }
      var isOuter = lvl === 1.0;
      gridPolygonsHtml += '<polygon points="' + pts.join(' ') + '" fill="' + (isOuter ? '#ffffff' : 'none') + '" stroke="' + (isOuter ? '#d1d5db' : '#e5e7eb') + '" stroke-width="' + (isOuter ? '1.5' : '1') + '" ' + (isOuter ? '' : 'stroke-dasharray="3,3"') + ' />';
    });

    // 2. Radial spokes
    var spokesHtml = '';
    for (var i = 0; i < count; i++) {
      var angle = -Math.PI / 2 + (2 * Math.PI * i) / count;
      var x = cx + r * Math.cos(angle);
      var y = cy + r * Math.sin(angle);
      spokesHtml += '<line x1="' + cx + '" y1="' + cy + '" x2="' + x.toFixed(1) + '" y2="' + y.toFixed(1) + '" stroke="#e5e7eb" stroke-width="1" />';
    }

    // 3. Performance data polygon
    var dataPts = [];
    var pointCircles = [];
    for (var i = 0; i < count; i++) {
      var s = subjects[i];
      var norm = Math.max(0.12, Math.min(1.0, s.norm !== undefined ? s.norm : 0.5));
      var angle = -Math.PI / 2 + (2 * Math.PI * i) / count;
      var px = cx + r * norm * Math.cos(angle);
      var py = cy + r * norm * Math.sin(angle);
      dataPts.push(px.toFixed(1) + ',' + py.toFixed(1));
      pointCircles.push('<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="3.5" fill="#000000" stroke="#facc15" stroke-width="2" />');
    }
    var dataPolyHtml = '<polygon points="' + dataPts.join(' ') + '" fill="rgba(250, 204, 21, 0.42)" stroke="#ca8a04" stroke-width="2.5" stroke-linejoin="round" />';

    // 4. Perimeter labels
    var labelsHtml = '';
    for (var i = 0; i < count; i++) {
      var s = subjects[i];
      var angle = -Math.PI / 2 + (2 * Math.PI * i) / count;
      var labelDist = r + 22;
      var lx = cx + labelDist * Math.cos(angle);
      var ly = cy + labelDist * Math.sin(angle);

      var anchor = 'middle';
      if (Math.cos(angle) > 0.28) anchor = 'start';
      else if (Math.cos(angle) < -0.28) anchor = 'end';

      var dy = '4';
      if (Math.sin(angle) < -0.65) dy = '-4';
      else if (Math.sin(angle) > 0.65) dy = '13';

      var cleanName = s.name.length > 13 ? s.name.substring(0, 11) + '…' : s.name;
      var badge = s.grade ? ' ' + s.grade : '';

      labelsHtml += `
        <text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" dy="${dy}" text-anchor="${anchor}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10.5" font-weight="700" fill="#111827">
          ${cleanName}<tspan fill="#ca8a04" font-weight="800">${badge}</tspan>
        </text>
      `;
    }

    return `
      <svg viewBox="0 0 ${sizeX} ${sizeY}" class="afri-radar-svg" preserveAspectRatio="xMidYMid meet" aria-label="Subject performance radar chart">
        ${gridPolygonsHtml}
        ${spokesHtml}
        ${dataPolyHtml}
        ${pointCircles.join('')}
        ${labelsHtml}
      </svg>
    `;
  }

  // --- ACADEMIC PROGRESS SECTION UI INJECTION ---
  function injectAcademicProgressSection(adapter) {
    if (document.getElementById('afriAcademicProgress')) return;

    var resultsEl = document.getElementById('results');
    if (!resultsEl) return;

    var container = document.createElement('section');
    container.id = 'afriAcademicProgress';
    container.className = 'afri-academic-progress';
    container.setAttribute('aria-label', 'Academic Progress');

    container.innerHTML = `
      <div class="afri-prog-header">
        <div class="afri-prog-title-wrap">
          <div class="afri-prog-icon-badge">
            ${icons.cap}
          </div>
          <div>
            <h3 class="afri-prog-title">Academic Progress</h3>
            <p class="afri-prog-subtitle">Private in-browser history and latest subject performance</p>
          </div>
        </div>
        <div class="afri-prog-actions">
          <button type="button" class="afri-prog-btn" id="afriProgHistoryBtn" aria-label="View calculation history">
            ${icons.history}
            <span>View History</span>
            <span class="afri-prog-badge-count" id="afriProgHistoryBadge">0</span>
          </button>
        </div>
      </div>

      <div class="afri-prog-body">
        <!-- Radar Chart Card -->
        <div class="afri-radar-card">
          <span class="afri-card-label">Subject Performance Radar</span>
          <div class="afri-radar-svg-wrap" id="afriRadarWrap">
            <!-- Dynamic SVG injected here -->
          </div>
        </div>

        <!-- Performance Summary Card -->
        <div class="afri-summary-card">
          <div>
            <span class="afri-card-label">Progress Summary</span>
            <div class="afri-stat-pair-grid">
              <div class="afri-stat-box highlight">
                <span class="afri-stat-box-label">Latest Result</span>
                <span class="afri-stat-box-val accent" id="afriProgLatestVal">—</span>
                <span class="afri-stat-box-sub" id="afriProgLatestSub">Current calculation</span>
              </div>
              <div class="afri-stat-box">
                <span class="afri-stat-box-label">Previous Result</span>
                <span class="afri-stat-box-val" id="afriProgPrevVal">—</span>
                <span class="afri-stat-box-sub" id="afriProgPrevSub">Prior attempt</span>
              </div>
            </div>

            <div class="afri-trend-banner baseline" id="afriProgTrendBanner">
              ${icons.dot}
              <span id="afriProgTrendText">Calculating performance trend…</span>
            </div>
          </div>

          <div class="afri-subject-highlights-grid">
            <div class="afri-subject-highlight strongest">
              <div class="afri-highlight-icon">
                ${icons.star}
              </div>
              <div class="afri-highlight-info">
                <span class="afri-highlight-tag">Strongest Subject</span>
                <span class="afri-highlight-name" id="afriProgStrongestName">—</span>
                <span class="afri-highlight-score" id="afriProgStrongestScore">Top performance</span>
              </div>
            </div>
            <div class="afri-subject-highlight weakest">
              <div class="afri-highlight-icon">
                ${icons.target}
              </div>
              <div class="afri-highlight-info">
                <span class="afri-highlight-tag">Focus Area (Lowest)</span>
                <span class="afri-highlight-name" id="afriProgWeakestName">—</span>
                <span class="afri-highlight-score" id="afriProgWeakestScore">Room for growth</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Placement directly below the main calculator result
    var resultsHead = resultsEl.querySelector('.results-head');
    var aiSec = resultsEl.querySelector('.ai-section');
    var shareBar = resultsEl.querySelector('#afriShareBar');

    if (resultsHead && resultsHead.parentNode) {
      resultsHead.insertAdjacentElement('afterend', container);
    } else if (aiSec && aiSec.parentNode === resultsEl) {
      resultsEl.insertBefore(container, aiSec);
    } else if (shareBar && shareBar.parentNode === resultsEl) {
      resultsEl.insertBefore(container, shareBar);
    } else {
      resultsEl.appendChild(container);
    }

    var historyBtn = document.getElementById('afriProgHistoryBtn');
    if (historyBtn) {
      historyBtn.addEventListener('click', function (e) {
        e.preventDefault();
        openHistoryModal(adapter);
      });
    }
  }

  // --- MODAL DIALOG ---
  function ensureModalOverlay() {
    var overlay = document.getElementById('afriProgModalOverlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'afriProgModalOverlay';
    overlay.className = 'afri-prog-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'afriProgModalTitle');

    overlay.innerHTML = `
      <div class="afri-prog-modal-card">
        <div class="afri-prog-modal-header">
          <div>
            <h3 id="afriProgModalTitle" class="afri-prog-modal-title">Academic Progress History</h3>
            <p class="afri-prog-modal-desc">All calculations are saved privately in your device browser.</p>
          </div>
          <button type="button" class="afri-prog-modal-close" id="afriProgModalCloseBtn" aria-label="Close dialog">
            ${icons.close}
          </button>
        </div>
        <div class="afri-history-list" id="afriProgHistoryList">
          <!-- Dynamic history items -->
        </div>
        <div class="afri-prog-modal-footer">
          <button type="button" class="afri-btn-danger-outline" id="afriProgClearHistoryBtn">
            ${icons.trash}
            <span>Clear History</span>
          </button>
          <button type="button" class="afri-btn-modal-done" id="afriProgModalDoneBtn">Done</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        closeHistoryModal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        closeHistoryModal();
      }
    });

    var closeBtn = overlay.querySelector('#afriProgModalCloseBtn');
    var doneBtn = overlay.querySelector('#afriProgModalDoneBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeHistoryModal);
    if (doneBtn) doneBtn.addEventListener('click', closeHistoryModal);

    return overlay;
  }

  function openHistoryModal(adapter) {
    var overlay = ensureModalOverlay();
    var listEl = document.getElementById('afriProgHistoryList');
    var clearBtn = document.getElementById('afriProgClearHistoryBtn');

    var history = getHistory(adapter.id);
    if (!history.length) {
      listEl.innerHTML = `
        <div class="afri-history-empty">
          <p style="margin:0 0 0.5rem;font-weight:700;color:#111827;">No recorded calculations yet</p>
          <p style="margin:0;font-size:0.8125rem;">Complete a calculation above to automatically record your progress.</p>
        </div>
      `;
    } else {
      var html = '';
      history.forEach(function (item, idx) {
        var isLatest = idx === 0;
        var dateFormatted = item.dateStr || 'Recent';
        var chipsHtml = (item.subjects || []).map(function (s) {
          return '<span class="afri-history-chip">' + s.name + ': ' + (s.grade || s.display || '') + '</span>';
        }).join('');

        var trendBadge = '';
        if (item.trend) {
          var trendColor = item.trend.type === 'improved' ? '#16a34a' : item.trend.type === 'declined' ? '#d97706' : '#6b7280';
          trendBadge = '<span style="font-size:0.75rem;font-weight:700;color:' + trendColor + ';">' + item.trend.label + '</span>';
        }

        html += `
          <div class="afri-history-item ${isLatest ? 'latest' : ''}">
            <div class="afri-history-item-top">
              <div class="afri-history-index-wrap">
                <span class="afri-history-num">Attempt #${history.length - idx} ${isLatest ? '(Latest)' : ''}</span>
                <span class="afri-history-date">&bull; ${dateFormatted}</span>
              </div>
              <div style="display:flex;align-items:center;gap:0.5rem;">
                ${trendBadge}
                <span class="afri-history-score-badge">${item.displayValue}</span>
              </div>
            </div>
            ${chipsHtml ? '<div class="afri-history-chips">' + chipsHtml + '</div>' : ''}
          </div>
        `;
      });
      listEl.innerHTML = html;
    }

    if (clearBtn) {
      clearBtn.onclick = function () {
        if (confirm('Clear your recorded calculation history for this tool? This cannot be undone.')) {
          clearHistory(adapter.id);
          openHistoryModal(adapter);
          updateProgressUI(adapter);
        }
      };
    }

    overlay.classList.add('open');
  }

  function closeHistoryModal() {
    var overlay = document.getElementById('afriProgModalOverlay');
    if (overlay) overlay.classList.remove('open');
  }

  // --- CORE PROGRESS RECORDING & UI UPDATE ---
  function computeStrengths(subjects) {
    if (!subjects || !subjects.length) {
      return { strongest: null, weakest: null };
    }
    // Norm is 0.0 to 1.0 where 1.0 is always best performance
    var sorted = subjects.slice().sort(function (a, b) {
      var normA = a.norm !== undefined ? a.norm : 0.5;
      var normB = b.norm !== undefined ? b.norm : 0.5;
      return normB - normA;
    });

    var strongest = sorted[0];
    var weakest = sorted[sorted.length - 1];

    return { strongest: strongest, weakest: weakest };
  }

  function recordAndDisplay(adapter) {
    var current = adapter.extract();
    if (!current || isNaN(current.value)) return;

    var history = getHistory(adapter.id);
    var prev = history.length > 0 ? history[0] : null;

    // Avoid duplicate rapid recordings if identical inputs/result within 30 seconds
    var now = Date.now();
    var isDuplicate = prev &&
      Math.abs(prev.value - current.value) < 0.001 &&
      (now - (prev.timestamp || 0)) < 30000 &&
      JSON.stringify(prev.subjects) === JSON.stringify(current.subjects);

    var trend = null;
    if (prev) {
      var diff;
      if (adapter.higherIsBetter) {
        diff = current.value - prev.value;
      } else {
        // Lower aggregate = better!
        diff = prev.value - current.value;
      }

      if (diff > 0.001) {
        var diffStr = Number.isInteger(diff) ? diff.toString() : diff.toFixed(2);
        trend = {
          type: 'improved',
          label: '▲ ' + diffStr + ' ' + (adapter.unit || 'pts') + ' improvement',
          desc: 'Improved by ' + diffStr + ' ' + (adapter.unit || 'points') + ' compared to previous calculation'
        };
      } else if (diff < -0.001) {
        var absDiff = Math.abs(diff);
        var diffStr = Number.isInteger(absDiff) ? absDiff.toString() : absDiff.toFixed(2);
        trend = {
          type: 'declined',
          label: '▼ ' + diffStr + ' ' + (adapter.unit || 'pts') + ' decline',
          desc: 'Lower by ' + diffStr + ' ' + (adapter.unit || 'points') + ' compared to previous calculation'
        };
      } else {
        trend = {
          type: 'neutral',
          label: '— No change',
          desc: 'Identical score to your previous calculation'
        };
      }
    } else {
      trend = {
        type: 'baseline',
        label: '● Initial baseline',
        desc: 'Initial calculation recorded · Next attempt will show your progress trend'
      };
    }

    var strengths = computeStrengths(current.subjects);

    if (!isDuplicate) {
      var dateObj = new Date();
      var dateStr = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
        ', ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      var newRecord = {
        id: 'att_' + now,
        timestamp: now,
        dateStr: dateStr,
        value: current.value,
        displayValue: current.displayValue,
        subjects: current.subjects,
        trend: trend,
        strongest: strengths.strongest ? { name: strengths.strongest.name, display: strengths.strongest.display || strengths.strongest.grade } : null,
        weakest: strengths.weakest ? { name: strengths.weakest.name, display: strengths.weakest.display || strengths.weakest.grade } : null
      };

      history.unshift(newRecord);
      saveHistory(adapter.id, history);
    }

    // Ensure section exists in DOM
    injectAcademicProgressSection(adapter);
    updateProgressUI(adapter);
  }

  function updateProgressUI(adapter) {
    var history = getHistory(adapter.id);
    var countBadge = document.getElementById('afriProgHistoryBadge');
    if (countBadge) {
      countBadge.textContent = history.length;
    }

    if (!history.length) {
      var latestEl = document.getElementById('afriProgLatestVal');
      var prevEl = document.getElementById('afriProgPrevVal');
      var trendBanner = document.getElementById('afriProgTrendBanner');
      var radarWrap = document.getElementById('afriRadarWrap');

      if (latestEl) latestEl.textContent = '—';
      if (prevEl) prevEl.textContent = '—';
      if (trendBanner) {
        trendBanner.className = 'afri-trend-banner neutral';
        trendBanner.innerHTML = icons.dot + ' <span>Complete a calculation to record progress</span>';
      }
      if (radarWrap) {
        radarWrap.innerHTML = '<div style="padding:2rem 1rem;color:#78716c;font-size:0.8125rem;">Radar chart will appear after calculation.</div>';
      }
      return;
    }

    var latest = history[0];
    var prev = history.length > 1 ? history[1] : null;

    // Latest Result
    var latestEl = document.getElementById('afriProgLatestVal');
    var latestSub = document.getElementById('afriProgLatestSub');
    if (latestEl) latestEl.textContent = latest.displayValue;
    if (latestSub) latestSub.textContent = latest.dateStr || 'Latest entry';

    // Previous Result
    var prevEl = document.getElementById('afriProgPrevVal');
    var prevSub = document.getElementById('afriProgPrevSub');
    if (prevEl) prevEl.textContent = prev ? prev.displayValue : '—';
    if (prevSub) prevSub.textContent = prev ? (prev.dateStr || 'Prior attempt') : 'No earlier entry';

    // Trend Banner
    var trendBanner = document.getElementById('afriProgTrendBanner');
    if (trendBanner && latest.trend) {
      var icon = latest.trend.type === 'improved' ? icons.arrowUp :
        latest.trend.type === 'declined' ? icons.arrowDown :
        latest.trend.type === 'neutral' ? icons.equal : icons.dot;

      trendBanner.className = 'afri-trend-banner ' + latest.trend.type;
      trendBanner.innerHTML = icon + ' <span>' + latest.trend.desc + '</span>';
    }

    // Highlights
    var strName = document.getElementById('afriProgStrongestName');
    var strScore = document.getElementById('afriProgStrongestScore');
    var weakName = document.getElementById('afriProgWeakestName');
    var weakScore = document.getElementById('afriProgWeakestScore');

    var strengths = computeStrengths(latest.subjects);
    if (strName) strName.textContent = strengths.strongest ? strengths.strongest.name : '—';
    if (strScore) strScore.textContent = strengths.strongest ? (strengths.strongest.display || strengths.strongest.grade || 'Top mark') : '';

    if (weakName) weakName.textContent = strengths.weakest ? strengths.weakest.name : '—';
    if (weakScore) weakScore.textContent = strengths.weakest ? (strengths.weakest.display || strengths.weakest.grade || 'Focus mark') : '';

    // Radar Chart
    var radarWrap = document.getElementById('afriRadarWrap');
    if (radarWrap && latest.subjects) {
      radarWrap.innerHTML = generateRadarSvg(latest.subjects);
    }
  }

  // --- INITIALIZATION & OBSERVERS ---
  function init() {
    var adapter = getActiveAdapter();
    if (!adapter) return;

    injectStyles();

    // If there is existing history and results container exists, pre-inject
    var resultsEl = document.getElementById('results');
    if (resultsEl) {
      injectAcademicProgressSection(adapter);
      updateProgressUI(adapter);
    }

    // Hook into calculation trigger forms and buttons
    var forms = document.querySelectorAll('form');
    forms.forEach(function (form) {
      form.addEventListener('submit', function () {
        setTimeout(function () {
          recordAndDisplay(adapter);
        }, 120);
      });
    });

    var calcButtons = document.querySelectorAll('#calcBtn, .btn-primary, [type="submit"], #sampleBtn');
    calcButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setTimeout(function () {
          recordAndDisplay(adapter);
        }, 140);
      });
    });

    // Observer on results visibility or DOM change
    if (resultsEl) {
      var observer = new MutationObserver(function () {
        if (resultsEl.classList.contains('visible') || window.getComputedStyle(resultsEl).display !== 'none') {
          setTimeout(function () {
            recordAndDisplay(adapter);
          }, 90);
        }
      });
      observer.observe(resultsEl, { attributes: true, attributeFilter: ['class', 'style'], childList: true, subtree: false });
    }
  }

  onReady(init);
})();
