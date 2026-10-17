/**
 * AfriWidget Academic Progress Engine
 * Lightweight, private, client-side result history for AfriWidget education tools.
 * 
 * - Zero accounts, zero login, zero cloud storage, 100% private in-browser localStorage.
 * - Zero Tailwind CSS, pure custom scoped AfriWidget brand design system (#000000, #facc15, #ca8a04, #ffffff, #e5e5e5).
 * - Automatic background recording on calculation with zero friction or gating.
 * - Clear subject results, latest and previous scores, and simple progress trends.
 * - Comparative summary: Latest, Previous, Improvement/Decline, Strongest, Weakest subjects.
 * - Complete chronological attempt history viewer with self-management & clear option.
 */
(function () {
  'use strict';

  if (typeof window === 'undefined') return;

  var STORAGE_PREFIX = 'afriwidget_academic_progress_';
  var MAX_HISTORY_ITEMS = 15;
  var recordTimer = null;

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function scheduleRecord(adapter) {
    if (recordTimer) clearTimeout(recordTimer);
    recordTimer = setTimeout(function () {
      recordTimer = null;
      recordAndDisplay(adapter);
    }, 180);
  }

  function isResultsVisible(resultsEl) {
    if (!resultsEl) return false;
    if (resultsEl.classList.contains('visible')) return true;
    var style = window.getComputedStyle(resultsEl);
    return style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      Number(style.opacity || 1) > 0.01;
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
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    alert: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
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
        transition: all 0.15s ease;
      }
      .afri-btn-danger-outline:hover {
        background: #fef2f2;
      }
      .afri-btn-danger-outline.confirming {
        background: #dc2626 !important;
        color: #ffffff !important;
        border-color: #b91c1c !important;
        box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.25) !important;
        animation: afriPulseConfirm 1.2s infinite ease-in-out;
      }
      @keyframes afriPulseConfirm {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.82; }
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

      /* Calm, readable progress dashboard in the AfriWidget brand palette */
      .afri-academic-progress {
        margin-top: 1.5rem;
        padding: 1.25rem;
        border: 1px solid #e5e7eb;
        border-top: 3px solid #facc15;
        border-radius: 0.875rem;
        box-shadow: 0 4px 18px rgba(17, 24, 39, 0.045);
        font-family: inherit;
        color: #111827;
      }
      .afri-prog-header {
        gap: 1rem;
        padding-bottom: 1.125rem;
        border-color: #e5e7eb;
      }
      .afri-prog-title-wrap { gap: 0.875rem; }
      .afri-prog-icon-badge {
        width: 2.625rem;
        height: 2.625rem;
        border: 1px solid #f3e8a1;
        border-radius: 0.75rem;
        background: #fffdf0;
        color: #6b5900;
      }
      .afri-prog-title {
        font-size: 1.125rem;
        font-weight: 750;
        letter-spacing: -0.02em;
        color: #111827;
      }
      .afri-prog-subtitle {
        margin-top: 0.25rem;
        color: #5b6472;
        font-size: 0.875rem;
      }
      .afri-prog-btn {
        min-height: 42px;
        border-color: #e5e7eb;
        border-radius: 0.625rem;
        background: #fff;
        padding: 0.55rem 0.8rem;
        font-weight: 650;
      }
      .afri-prog-btn:hover {
        border-color: #d4b20b;
        background: #fffdf0;
      }
      .afri-prog-badge-count {
        background: #111827;
        color: #fff;
        padding: 0.2rem 0.45rem;
        font-size: 0.7rem;
      }
      .afri-prog-notice {
        display: none;
        margin: 0.875rem 0 0;
        padding: 0.7rem 0.85rem;
        border: 1px solid #fde68a;
        border-radius: 0.625rem;
        background: #fffbeb;
        color: #713f12;
        font-size: 0.8125rem;
        line-height: 1.5;
      }
      .afri-prog-notice[data-visible="true"] { display: block; }
      .afri-prog-body {
        grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
        gap: 1rem;
        margin-top: 1.125rem;
      }
      .afri-subject-results-card,
      .afri-summary-card {
        min-width: 0;
        border: 1px solid #e5e7eb;
        border-radius: 0.75rem;
        background: #fff;
        padding: 1.125rem;
      }
      .afri-subject-results-card { background: #fafafa; }
      .afri-card-label {
        margin-bottom: 0.75rem;
        color: #374151;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0;
        text-transform: none;
      }
      .afri-subject-results-list {
        display: flex;
        flex-direction: column;
        max-height: 360px;
        overflow-y: auto;
        border-top: 1px solid #e5e7eb;
      }
      .afri-subject-result-row {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.7rem 0.125rem;
        border-bottom: 1px solid #e5e7eb;
      }
      .afri-subject-result-name {
        min-width: 0;
        color: #374151;
        font-size: 0.8125rem;
        line-height: 1.4;
        overflow-wrap: anywhere;
      }
      .afri-subject-result-value {
        flex: 0 0 auto;
        color: #111827;
        font-size: 0.8125rem;
        font-weight: 700;
        text-align: right;
      }
      .afri-subject-results-empty {
        margin: 0;
        padding: 1.125rem 0;
        color: #667085;
        font-size: 0.8125rem;
        line-height: 1.5;
      }
      .afri-summary-card { gap: 1rem; }
      .afri-stat-pair-grid { gap: 0.625rem; }
      .afri-stat-box {
        border-color: #e5e7eb;
        border-radius: 0.625rem;
        padding: 0.875rem 0.75rem;
      }
      .afri-stat-box.highlight {
        border-color: #f3e8a1;
        background: #fffdf0;
      }
      .afri-stat-box-label {
        color: #596273;
        font-size: 0.7rem;
        font-weight: 650;
        letter-spacing: 0;
        text-transform: none;
      }
      .afri-stat-box.highlight .afri-stat-box-label { color: #5f5010; }
      .afri-stat-box-val {
        font-size: clamp(1.05rem, 2vw, 1.375rem);
        font-weight: 750;
        overflow-wrap: anywhere;
      }
      .afri-stat-box-sub {
        color: #667085;
        font-size: 0.7rem;
        overflow-wrap: anywhere;
      }
      .afri-trend-banner {
        align-items: flex-start;
        border-radius: 0.625rem;
        padding: 0.75rem 0.8rem;
        font-size: 0.8125rem;
        font-weight: 600;
      }
      .afri-subject-highlights-grid { gap: 0.625rem; }
      .afri-subject-highlight {
        min-width: 0;
        border-radius: 0.625rem;
        padding: 0.75rem;
      }
      .afri-subject-highlight.strongest {
        border-color: #dce9d8;
        border-left-color: #52815c;
        background: #f7faf6;
      }
      .afri-subject-highlight.weakest {
        border-color: #e5e7eb;
        border-left-color: #c5a62b;
        background: #fafafa;
      }
      .afri-subject-highlight.strongest .afri-highlight-icon {
        background: #e8f0e5;
        color: #315e3b;
      }
      .afri-subject-highlight.weakest .afri-highlight-icon {
        background: #f7f1d8;
        color: #705d13;
      }
      .afri-highlight-tag {
        color: #596273;
        font-size: 0.6875rem;
        font-weight: 650;
        letter-spacing: 0;
        text-transform: none;
      }
      .afri-subject-highlight.strongest .afri-highlight-tag,
      .afri-subject-highlight.weakest .afri-highlight-tag { color: #596273; }
      .afri-highlight-name { font-weight: 700; }
      .afri-highlight-score { color: #667085; font-weight: 500; }
      .afri-academic-progress button:focus-visible,
      .afri-prog-modal-overlay button:focus-visible {
        outline: 3px solid #b49100;
        outline-offset: 2px;
      }
      .afri-prog-modal-overlay {
        visibility: hidden;
        background: rgba(17, 24, 39, 0.58);
        font-family: inherit;
      }
      .afri-prog-modal-overlay.open { visibility: visible; }
      .afri-prog-modal-card {
        border-color: #e5e7eb;
        border-radius: 1rem;
        box-shadow: 0 24px 60px rgba(17, 24, 39, 0.2);
      }
      .afri-prog-modal-title { font-size: 1.2rem; font-weight: 750; }
      .afri-history-item {
        gap: 0.625rem;
        border-radius: 0.75rem;
        background: #fff;
      }
      .afri-history-item.latest {
        border-color: #e8d366;
        background: #fffdf4;
      }
      .afri-history-empty-title {
        margin: 0 0 0.375rem;
        color: #111827;
        font-size: 0.9375rem;
        font-weight: 700;
      }
      .afri-history-empty-copy {
        margin: 0;
        color: #667085;
        font-size: 0.8125rem;
        line-height: 1.5;
      }
      .afri-history-num {
        color: #374151;
        font-size: 0.75rem;
        letter-spacing: 0;
        text-transform: none;
      }
      .afri-history-date { color: #667085; }
      .afri-history-score-badge {
        border-radius: 0.5rem;
        font-weight: 750;
        overflow-wrap: anywhere;
      }
      .afri-history-chip { overflow-wrap: anywhere; }
      .afri-btn-danger-outline:disabled {
        color: #667085;
        border-color: #e5e7eb;
        opacity: 0.65;
        cursor: not-allowed;
      }
      .afri-btn-danger-outline.confirming { animation: none; }
      @media (min-width: 640px) {
        .afri-academic-progress { padding: 1.5rem; }
      }
      @media (max-width: 767px) {
        .afri-prog-body { grid-template-columns: minmax(0, 1fr); }
      }
      @media (max-width: 520px) {
        .afri-prog-header { align-items: flex-start; }
        .afri-prog-actions, .afri-prog-btn { width: 100%; }
        .afri-prog-btn { justify-content: center; }
        .afri-prog-modal-card { padding: 1rem; }
        .afri-prog-modal-footer {
          flex-direction: column-reverse;
          align-items: stretch;
        }
        .afri-btn-danger-outline, .afri-btn-modal-done { justify-content: center; }
      }
      @media (prefers-reduced-motion: reduce) {
        .afri-prog-modal-overlay,
        .afri-prog-modal-card { transition: none; }
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
      title: 'Tertiary GPA / CGPA Calculator',
      higherIsBetter: true,
      unit: 'GPA',
      extract: function () {
        var semEl = document.getElementById('semesterGpa');
        var cumEl = document.getElementById('cumulativeGpa');
        var val = NaN;
        var displayLabel = '';

        var cumVal = cumEl ? parseFloat(cumEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        var semVal = semEl ? parseFloat(semEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;

        if (!isNaN(cumVal)) {
          val = cumVal;
          displayLabel = val.toFixed(2) + ' CGPA';
        } else if (!isNaN(semVal)) {
          val = semVal;
          displayLabel = val.toFixed(2) + ' GPA';
        }

        if (isNaN(val)) return null;

        var scaleEl = document.getElementById('scaleSelect');
        var scaleVal = scaleEl ? scaleEl.value : '5';
        var maxScale = scaleVal === '4' ? 4.0 : 5.0;

        var subjects = [];
        var rows = document.querySelectorAll('#courseList .course-row, .course-row');
        var pts5 = { 'A': 5.0, 'B': 4.0, 'C': 3.0, 'D': 2.0, 'E': 1.0, 'F': 0.0 };
        var pts4 = { 'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0 };
        var ptsMap = scaleVal === '4' ? pts4 : pts5;

        rows.forEach(function (row, idx) {
          var nameInput = row.querySelector('.course-name-input, input[type="text"]');
          var gradeSel = row.querySelector('.course-grade-select, select');
          var creditSel = row.querySelector('.course-credit-select');

          var rawName = (nameInput && nameInput.value.trim()) || ('Course ' + (idx + 1));
          var grade = gradeSel ? gradeSel.value : '';
          var credits = creditSel ? parseFloat(creditSel.value) : NaN;

          if (grade && ptsMap[grade] !== undefined) {
            var pts = ptsMap[grade];
            var credText = (!isNaN(credits) && credits > 0) ? (' (' + credits + ' CU)') : '';
            subjects.push({
              name: rawName.length > 15 ? rawName.substring(0, 13) + '…' : rawName,
              grade: grade,
              raw: pts,
              norm: Math.max(0.12, Math.min(1.0, pts / maxScale)),
              display: 'Grade ' + grade + credText
            });
          }
        });

        return {
          value: val,
          displayValue: displayLabel,
          subjects: subjects
        };
      }
    },

    // 12. WAEC Grade Calculator
    'waec-grade-calculator': {
      id: 'waec-grade',
      title: 'WAEC Grade Calculator',
      higherIsBetter: true,
      unit: '%',
      extract: function () {
        var aggEl = document.getElementById('aggregateScore');
        var val = aggEl ? parseFloat(aggEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;

        var subjects = [];
        var rows = document.querySelectorAll('#subjectRowsContainer .subject-row');
        rows.forEach(function (row, idx) {
          var nameInp = row.querySelector('.subj-name');
          var markInp = row.querySelector('.subj-mark');
          var name = (nameInp && nameInp.value.trim()) || ('Subject ' + (idx + 1));
          var mark = markInp && markInp.value !== '' ? parseFloat(markInp.value) : NaN;
          if (!isNaN(mark) && mark >= 0 && mark <= 100) {
            var g = mark >= 75 ? 'A1' : mark >= 70 ? 'B2' : mark >= 65 ? 'B3' :
                    mark >= 60 ? 'C4' : mark >= 55 ? 'C5' : mark >= 50 ? 'C6' :
                    mark >= 45 ? 'D7' : mark >= 40 ? 'E8' : 'F9';
            subjects.push({
              name: name.length > 14 ? name.substring(0, 12) + '…' : name,
              grade: g,
              raw: mark,
              norm: Math.max(0.12, mark / 100),
              display: g + ' (' + Math.round(mark) + '%)'
            });
          }
        });

        return {
          value: val,
          displayValue: val.toFixed(1) + '% Average',
          subjects: subjects
        };
      }
    },

    // 13. Nigerian University CGPA Calculator
    'nigerian-university-cgpa-calculator': {
      id: 'nigerian-university-cgpa',
      title: 'Nigerian University CGPA Calculator',
      higherIsBetter: true,
      unit: 'CGPA',
      extract: function () {
        var cgpaEl = document.getElementById('statCgpa');
        var val = cgpaEl ? parseFloat(cgpaEl.textContent.trim()) : NaN;
        if (isNaN(val)) return null;

        var scaleEl = document.getElementById('gradingScale');
        var isScale4 = scaleEl && scaleEl.value === '4.0';
        var maxScale = isScale4 ? 4.0 : 5.0;
        var ptsMap5 = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1, 'F': 0 };
        var ptsMap4 = { 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'E': 0, 'F': 0 };
        var map = isScale4 ? ptsMap4 : ptsMap5;

        var subjects = [];
        var rows = document.querySelectorAll('#coursesContainer .course-row');
        rows.forEach(function (row, idx) {
          var nameInp = row.querySelector('.course-name');
          var gradeSel = row.querySelector('.course-grade');
          var name = (nameInp && nameInp.value.trim()) || ('Course ' + (idx + 1));
          var grade = gradeSel ? gradeSel.value : '';
          if (grade && map[grade] !== undefined) {
            var pts = map[grade];
            subjects.push({
              name: name.length > 14 ? name.substring(0, 12) + '…' : name,
              grade: grade,
              raw: pts,
              norm: Math.max(0.12, pts / maxScale),
              display: grade + ' (' + pts.toFixed(1) + ' pts)'
            });
          }
        });

        return {
          value: val,
          displayValue: val.toFixed(2) + ' CGPA',
          subjects: subjects
        };
      }
    },

    // 14. ZIMSEC O-Level Points Calculator
    'zimsec-olevel-points-calculator': {
      id: 'zimsec-olevel-points',
      title: 'ZIMSEC O-Level Points Calculator',
      higherIsBetter: true,
      unit: 'pts',
      extract: function () {
        var b5El = document.getElementById('best5Out');
        var val = b5El ? parseInt(b5El.textContent.trim(), 10) : NaN;
        if (isNaN(val)) return null;

        var ptsMap = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1, 'U': 0 };
        var subLabels = [
          'English', 'Maths', 'Combined Science', 'Heritage/Lang',
          'Subject 5', 'Subject 6', 'Subject 7', 'Subject 8'
        ];
        var subjects = [];
        for (var i = 1; i <= 8; i++) {
          var sel = document.getElementById('sub' + i + 'Grade');
          if (sel && sel.value && ptsMap[sel.value] !== undefined) {
            var g = sel.value;
            var pts = ptsMap[g];
            var sName = subLabels[i - 1] || ('Subject ' + i);
            subjects.push({
              name: sName,
              grade: g,
              raw: pts,
              norm: Math.max(0.12, pts / 5),
              display: g + ' (' + pts + ' pts)'
            });
          }
        }

        return {
          value: val,
          displayValue: val + ' / 25 Best 5',
          subjects: subjects
        };
      }
    },

    // 15. ZIMSEC A-Level Points Calculator
    'zimsec-alevel-points-calculator': {
      id: 'zimsec-alevel-points',
      title: 'ZIMSEC A-Level Points Calculator',
      higherIsBetter: true,
      unit: 'pts',
      extract: function () {
        var ptsEl = document.getElementById('pointsOut');
        var val = ptsEl ? parseInt(ptsEl.textContent.trim(), 10) : NaN;
        if (isNaN(val)) return null;

        var ptsMap = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1, 'O': 0, 'F': 0 };
        var subjects = [];
        for (var i = 1; i <= 4; i++) {
          var nameInp = document.getElementById('sub' + i + 'Name');
          var gradeSel = document.getElementById('sub' + i + 'Grade');
          var sName = (nameInp && nameInp.value.trim()) || ('Subject ' + i);
          if (gradeSel && gradeSel.value && ptsMap[gradeSel.value] !== undefined) {
            var g = gradeSel.value;
            var pts = ptsMap[g];
            subjects.push({
              name: sName.length > 14 ? sName.substring(0, 12) + '…' : sName,
              grade: g,
              raw: pts,
              norm: Math.max(0.12, pts / 5),
              display: g + ' (' + pts + ' pts)'
            });
          }
        }

        return {
          value: val,
          displayValue: val + ' A-Level Pts',
          subjects: subjects
        };
      }
    },

    // 16. ECZ Grade 12 Points Calculator
    'zambia-grade-12-points-calculator': {
      id: 'zambia-grade-12-points',
      title: 'ECZ Grade 12 Points Calculator',
      higherIsBetter: false,
      unit: 'pts',
      extract: function () {
        var b6El = document.getElementById('best6Value');
        var val = b6El ? parseInt(b6El.textContent.trim(), 10) : NaN;
        if (isNaN(val)) return null;

        var subjects = [];
        for (var i = 1; i <= 9; i++) {
          var sInp = document.getElementById('subj' + i);
          var gSel = document.getElementById('grade' + i);
          var sName = (sInp && sInp.value.trim()) || (i === 1 ? 'English' : 'Subject ' + i);
          if (gSel && gSel.value !== '') {
            var g = parseInt(gSel.value, 10);
            if (!isNaN(g) && g >= 1 && g <= 9) {
              subjects.push({
                name: sName.length > 14 ? sName.substring(0, 12) + '…' : sName,
                grade: 'Grade ' + g,
                raw: g,
                norm: Math.max(0.12, (10 - g) / 9),
                display: 'Grade ' + g
              });
            }
          }
        }

        return {
          value: val,
          displayValue: val + ' Best-6 Pts',
          subjects: subjects
        };
      }
    },

    // 17. UCE Grade & Aggregate Calculator
    'uce-grade-calculator': {
      id: 'uce-grade-calculator',
      title: 'UCE Grade & Aggregate Calculator',
      higherIsBetter: false,
      unit: 'agg',
      extract: function () {
        var aggEl = document.getElementById('aggregateScore');
        var val = aggEl ? parseInt(aggEl.textContent.trim(), 10) : NaN;
        if (isNaN(val)) return null;

        var subConfig = [
          { id: 'uceEnglish', name: 'English' },
          { id: 'uceMath', name: 'Maths' },
          { id: 'uceBiology', name: 'Biology' },
          { id: 'uceChemistry', name: 'Chemistry' },
          { id: 'ucePhysics', name: 'Physics' },
          { id: 'uceGeography', name: 'Geography' },
          { id: 'uceHistory', name: 'History' },
          { id: 'uceCre', name: 'Rel. Ed' },
          { id: 'uceElective1', name: 'Elective 1' },
          { id: 'uceElective2', name: 'Elective 2' }
        ];

        var gradeLetters = { 1: 'D1', 2: 'D2', 3: 'C3', 4: 'C4', 5: 'C5', 6: 'C6', 7: 'P7', 8: 'P8', 9: 'F9' };
        var subjects = [];
        subConfig.forEach(function (item) {
          var sel = document.getElementById(item.id);
          if (sel && sel.value !== '') {
            var g = parseInt(sel.value, 10);
            if (!isNaN(g) && g >= 1 && g <= 9) {
              var code = gradeLetters[g] || ('G' + g);
              subjects.push({
                name: item.name,
                grade: code,
                raw: g,
                norm: Math.max(0.12, (10 - g) / 9),
                display: code + ' (' + g + ' pt)'
              });
            }
          }
        });

        return {
          value: val,
          displayValue: 'Aggregate ' + val,
          subjects: subjects
        };
      }
    },

    // 18. UACE Points Calculator
    'uace-points-calculator': {
      id: 'uace-points-calculator',
      title: 'UACE Points Calculator',
      higherIsBetter: true,
      unit: 'pts',
      extract: function () {
        var rawEl = document.getElementById('rawScore');
        var val = rawEl ? parseInt(rawEl.textContent.trim(), 10) : NaN;
        if (isNaN(val)) return null;

        var ptsMap = { 'A': 6, 'B': 5, 'C': 4, 'D': 3, 'E': 2, 'O': 1, 'F': 0 };
        var subjects = [];

        var addPrinc = function (nameId, gradeId, fallbackName) {
          var nInp = document.getElementById(nameId);
          var gSel = document.getElementById(gradeId);
          var sName = (nInp && nInp.value.trim()) || fallbackName;
          if (gSel && gSel.value && ptsMap[gSel.value] !== undefined) {
            var g = gSel.value;
            var pts = ptsMap[g];
            subjects.push({
              name: sName.length > 14 ? sName.substring(0, 12) + '…' : sName,
              grade: g,
              raw: pts,
              norm: Math.max(0.12, pts / 6),
              display: g + ' (' + pts + ' pts)'
            });
          }
        };

        addPrinc('p1Name', 'p1Grade', 'Principal 1');
        addPrinc('p2Name', 'p2Grade', 'Principal 2');
        addPrinc('p3Name', 'p3Grade', 'Principal 3');

        var gpSel = document.getElementById('gpGrade');
        if (gpSel && gpSel.value !== '') {
          var gpPts = gpSel.value === 'pass' ? 1 : 0;
          subjects.push({
            name: 'General Paper',
            grade: gpPts ? 'Pass (1 pt)' : 'Fail (0 pt)',
            raw: gpPts,
            norm: gpPts ? 1.0 : 0.12,
            display: gpPts ? 'Pass (1 pt)' : 'Fail (0 pt)'
          });
        }

        var smSel = document.getElementById('subMathIctGrade');
        if (smSel && smSel.value !== '') {
          var smPts = smSel.value === 'pass' ? 1 : 0;
          subjects.push({
            name: 'Sub-Math/ICT',
            grade: smPts ? 'Pass (1 pt)' : 'Fail (0 pt)',
            raw: smPts,
            norm: smPts ? 1.0 : 0.12,
            display: smPts ? 'Pass (1 pt)' : 'Fail (0 pt)'
          });
        }

        return {
          value: val,
          displayValue: val + ' / 20 Points',
          subjects: subjects
        };
      }
    },

    // 19. Matric SBA & Final Exam Calculator
    'matric-sba-exam-calculator': {
      id: 'matric-sba-exam',
      title: 'Matric SBA & Final Exam Calculator',
      higherIsBetter: true,
      unit: 'APS',
      extract: function () {
        var apsEl = document.getElementById('apsTotal');
        var val = apsEl ? parseInt(apsEl.textContent.trim(), 10) : NaN;
        if (isNaN(val)) {
          var avgEl = document.getElementById('avgMark');
          val = avgEl ? parseFloat(avgEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        }
        if (isNaN(val)) return null;

        var subjects = [];
        var rows = document.querySelectorAll('#subjectList .subject-row');
        rows.forEach(function (row, idx) {
          var nameInp = row.querySelector('.subject-name');
          var sbaInp = row.querySelector('.subject-sba');
          var examInp = row.querySelector('.subject-exam');
          var sName = (nameInp && (nameInp.value.trim() || nameInp.placeholder)) || ('Subject ' + (idx + 1));
          var sba = sbaInp && sbaInp.value !== '' ? parseFloat(sbaInp.value) : NaN;
          var exam = examInp && examInp.value !== '' ? parseFloat(examInp.value) : NaN;
          if (!isNaN(sba) && !isNaN(exam)) {
            var isLo = /life orientation/i.test(sName);
            var finalMark = isLo ? Math.round(0.5 * sba + 0.5 * exam) : Math.round(0.25 * sba + 0.75 * exam);
            var lvl = finalMark >= 80 ? 7 : finalMark >= 70 ? 6 : finalMark >= 60 ? 5 :
                      finalMark >= 50 ? 4 : finalMark >= 40 ? 3 : finalMark >= 30 ? 2 : 1;
            subjects.push({
              name: sName.length > 14 ? sName.substring(0, 12) + '…' : sName,
              grade: 'L' + lvl,
              raw: finalMark,
              norm: Math.max(0.12, finalMark / 100),
              display: 'L' + lvl + ' (' + finalMark + '%)'
            });
          }
        });

        return {
          value: val,
          displayValue: val + ' APS Points',
          subjects: subjects
        };
      }
    },

    // 20. ACSEE Form Six Points Calculator
    'acsee-points-calculator': {
      id: 'acsee-points-calculator',
      title: 'ACSEE Form Six Points Calculator',
      higherIsBetter: true,
      unit: 'pts',
      extract: function () {
        var tcuEl = document.getElementById('tcuValue');
        var val = tcuEl ? parseFloat(tcuEl.textContent.trim()) : NaN;
        if (isNaN(val)) {
          var nectaEl = document.getElementById('nectaPointsValue');
          val = nectaEl ? parseFloat(nectaEl.textContent.trim()) : NaN;
        }
        if (isNaN(val)) return null;

        var ptsMap = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1, 'S': 0.5, 'F': 0 };
        var subjects = [];

        var addSub = function (nameId, gradeId, fallbackName) {
          var nInp = document.getElementById(nameId);
          var gSel = document.getElementById(gradeId);
          var sName = (nInp && (nInp.value.trim() || nInp.placeholder)) || fallbackName;
          if (gSel && gSel.value && ptsMap[gSel.value] !== undefined) {
            var g = gSel.value;
            var pts = ptsMap[g];
            subjects.push({
              name: sName.length > 14 ? sName.substring(0, 12) + '…' : sName,
              grade: g,
              raw: pts,
              norm: Math.max(0.12, pts / 5),
              display: g + ' (' + pts + ' pts)'
            });
          }
        };

        addSub('prin1Name', 'prin1Grade', 'Principal 1');
        addSub('prin2Name', 'prin2Grade', 'Principal 2');
        addSub('prin3Name', 'prin3Grade', 'Principal 3');

        var gsSel = document.getElementById('subGS');
        if (gsSel && gsSel.value && ptsMap[gsSel.value] !== undefined) {
          var gPts = ptsMap[gsSel.value];
          subjects.push({
            name: 'General Studies',
            grade: gsSel.value,
            raw: gPts,
            norm: Math.max(0.12, gPts / 5),
            display: gsSel.value + ' (' + gPts + ' pts)'
          });
        }

        addSub('sub2Name', 'sub2Grade', 'Subsidiary 2');

        return {
          value: val,
          displayValue: val.toFixed(1) + ' TCU Pts',
          subjects: subjects
        };
      }
    },

    // 21. Ghana University GPA & CWA Calculator
    'ghana-university-gpa-calculator': {
      id: 'ghana-university-gpa',
      title: 'Ghana University GPA Calculator',
      higherIsBetter: true,
      unit: 'GPA',
      extract: function () {
        var resEl = document.getElementById('semesterScore');
        var val = resEl ? parseFloat(resEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;

        var sysEl = document.getElementById('systemSelect');
        var isCwa = sysEl && sysEl.value === 'cwa';

        var gpaMap = { 'A': 4.0, 'B+': 3.5, 'B': 3.0, 'C+': 2.5, 'C': 2.0, 'D+': 1.5, 'D': 1.0, 'E': 0.0, 'F': 0.0 };
        var subjects = [];
        var rows = document.querySelectorAll('#courseList .course-row');
        rows.forEach(function (row, idx) {
          var nameInp = row.querySelector('.course-name-input') || row.querySelector('.course-name input');
          var sName = (nameInp && nameInp.value && nameInp.value.trim()) || ('Course ' + (idx + 1));
          var gradeInp = row.querySelector('.course-grade-input') || row.querySelector('.course-grade select, .course-grade input');
          if (gradeInp && gradeInp.value && gradeInp.value !== '') {
            if (isCwa) {
              var mark = parseFloat(gradeInp.value);
              if (!isNaN(mark) && mark >= 0 && mark <= 100) {
                subjects.push({
                  name: sName.length > 14 ? sName.substring(0, 12) + '…' : sName,
                  grade: Math.round(mark) + '%',
                  raw: mark,
                  norm: Math.max(0.12, mark / 100),
                  display: Math.round(mark) + '%'
                });
              }
            } else {
              var g = gradeInp.value.toUpperCase();
              if (gpaMap[g] !== undefined) {
                var pts = gpaMap[g];
                subjects.push({
                  name: sName.length > 14 ? sName.substring(0, 12) + '…' : sName,
                  grade: g,
                  raw: pts,
                  norm: Math.max(0.12, pts / 4.0),
                  display: g + ' (' + pts.toFixed(1) + ')'
                });
              }
            }
          }
        });

        return {
          value: val,
          displayValue: val.toFixed(2) + (isCwa ? '% CWA' : ' GPA'),
          subjects: subjects
        };
      }
    },

    // 22. Post-UTME Aggregate Screening Calculator
    'post-utme-aggregate-calculator': {
      id: 'post-utme-aggregate',
      title: 'Post-UTME Aggregate Calculator',
      higherIsBetter: true,
      unit: '%',
      extract: function () {
        var resEl = document.getElementById('aggregateScore');
        var val = resEl ? parseFloat(resEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;

        var subjects = [];
        var jambInp = document.getElementById('jambInput');
        var jambVal = jambInp ? parseFloat(jambInp.value) : NaN;
        if (!isNaN(jambVal) && jambVal >= 0 && jambVal <= 400) {
          subjects.push({
            name: 'JAMB UTME',
            grade: Math.round(jambVal) + '/400',
            raw: jambVal,
            norm: Math.max(0.12, jambVal / 400),
            display: Math.round(jambVal) + ' / 400'
          });
        }

        var cbtInp = document.getElementById('postUtmeInput');
        var cbtVal = cbtInp ? parseFloat(cbtInp.value) : NaN;
        if (!isNaN(cbtVal) && cbtVal >= 0 && cbtVal <= 100) {
          subjects.push({
            name: 'Post-UTME CBT',
            grade: Math.round(cbtVal) + '%',
            raw: cbtVal,
            norm: Math.max(0.12, cbtVal / 100),
            display: Math.round(cbtVal) + '%'
          });
        }

        var olevelRows = document.querySelectorAll('#olevelGroup .subject-row');
        var olevelPts = { 'A1': 1.0, 'B2': 0.88, 'B3': 0.76, 'C4': 0.64, 'C5': 0.52, 'C6': 0.40 };
        olevelRows.forEach(function (row, idx) {
          var nameInp = row.querySelector('.form-input');
          var gradeSel = row.querySelector('.olevel-grade');
          var sName = (nameInp && nameInp.value.trim()) || ('O\x27Level ' + (idx + 1));
          if (gradeSel && gradeSel.value && olevelPts[gradeSel.value] !== undefined) {
            var g = gradeSel.value;
            subjects.push({
              name: sName.length > 14 ? sName.substring(0, 12) + '…' : sName,
              grade: g,
              raw: olevelPts[g] * 100,
              norm: olevelPts[g],
              display: g
            });
          }
        });

        return {
          value: val,
          displayValue: val.toFixed(2) + '% Composite',
          subjects: subjects
        };
      }
    },

    // 23. Kenya University GPA Calculator
    'kenya-university-gpa-calculator': {
      id: 'kenya-university-gpa',
      title: 'Kenya University GPA Calculator',
      higherIsBetter: true,
      unit: 'GPA',
      extract: function () {
        var headEl = document.getElementById('gpaHeadline');
        var text = headEl ? headEl.textContent.trim() : '';
        var isWam = text.indexOf('%') !== -1;
        var val = parseFloat(text.replace(/[^0-9.]/g, ''));
        if (isNaN(val)) return null;

        var subjects = [];
        var rows = document.querySelectorAll('#coursesContainer .course-row');
        rows.forEach(function (row, idx) {
          var nameInp = row.querySelector('.course-name');
          var sName = (nameInp && nameInp.value.trim()) || ('Unit ' + (idx + 1));
          var gradeSel = row.querySelector('.course-grade-select');
          var gradeInp = row.querySelector('.course-grade-input');
          if (isWam && gradeInp && gradeInp.value !== '') {
            var mark = parseFloat(gradeInp.value);
            if (!isNaN(mark) && mark >= 0 && mark <= 100) {
              subjects.push({
                name: sName.length > 14 ? sName.substring(0, 12) + '…' : sName,
                grade: Math.round(mark) + '%',
                raw: mark,
                norm: Math.max(0.12, mark / 100),
                display: Math.round(mark) + '%'
              });
            }
          } else if (gradeSel && gradeSel.value !== '') {
            var gp = parseFloat(gradeSel.value);
            var optText = gradeSel.options[gradeSel.selectedIndex] ? gradeSel.options[gradeSel.selectedIndex].text.split(' - ')[0] : (gp.toFixed(1) + ' pts');
            if (!isNaN(gp) && gp >= 0) {
              subjects.push({
                name: sName.length > 14 ? sName.substring(0, 12) + '…' : sName,
                grade: optText,
                raw: gp,
                norm: Math.max(0.12, gp / 4.0),
                display: optText + ' (' + gp.toFixed(1) + ')'
              });
            }
          }
        });

        return {
          value: val,
          displayValue: val.toFixed(2) + (isWam ? '% WAM' : ' GPA'),
          subjects: subjects
        };
      }
    },

    // 24. Tanzania University GPA Calculator
    'tanzania-university-gpa-calculator': {
      id: 'tanzania-university-gpa',
      title: 'Tanzania University GPA Calculator',
      higherIsBetter: true,
      unit: 'GPA',
      extract: function () {
        var headEl = document.getElementById('headline');
        var val = headEl ? parseFloat(headEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;

        var subjects = [];
        var rows = document.querySelectorAll('#coursesContainer .course-row, #coursesContainer2 .course-row');
        rows.forEach(function (row, idx) {
          var nameInp = row.querySelector('.course-name');
          var sName = (nameInp && nameInp.value.trim()) || ('Course ' + (idx + 1));
          var gradeSel = row.querySelector('.course-grade');
          if (gradeSel && gradeSel.value !== '') {
            var gp = parseFloat(gradeSel.value);
            var optText = gradeSel.options[gradeSel.selectedIndex] ? gradeSel.options[gradeSel.selectedIndex].text.split(' ')[0] : (gp.toFixed(1) + ' pts');
            if (!isNaN(gp) && gp >= 0) {
              subjects.push({
                name: sName.length > 14 ? sName.substring(0, 12) + '…' : sName,
                grade: optText,
                raw: gp,
                norm: Math.max(0.12, gp / 5.0),
                display: optText + ' (' + gp.toFixed(1) + ')'
              });
            }
          }
        });

        return {
          value: val,
          displayValue: val.toFixed(2) + ' TCU GPA',
          subjects: subjects
        };
      }
    },

    // 25. Uganda University CGPA Calculator
    'uganda-university-cgpa-calculator': {
      id: 'uganda-university-cgpa',
      title: 'Uganda University CGPA Calculator',
      higherIsBetter: true,
      unit: 'CGPA',
      extract: function () {
        var headEl = document.getElementById('headline');
        var val = headEl ? parseFloat(headEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;

        var subjects = [];
        var rows = document.querySelectorAll('#coursesContainer .course-row, #coursesContainer2 .course-row');
        rows.forEach(function (row, idx) {
          var nameInp = row.querySelector('.course-name');
          var sName = (nameInp && nameInp.value.trim()) || ('Course ' + (idx + 1));
          var gradeSel = row.querySelector('.course-grade');
          if (gradeSel && gradeSel.value !== '') {
            var gp = parseFloat(gradeSel.value);
            var optText = gradeSel.options[gradeSel.selectedIndex] ? gradeSel.options[gradeSel.selectedIndex].text.split(' ')[0] : (gp.toFixed(1) + ' pts');
            if (!isNaN(gp) && gp >= 0) {
              subjects.push({
                name: sName.length > 14 ? sName.substring(0, 12) + '…' : sName,
                grade: optText,
                raw: gp,
                norm: Math.max(0.12, gp / 5.0),
                display: optText + ' (' + gp.toFixed(1) + ')'
              });
            }
          }
        });

        return {
          value: val,
          displayValue: val.toFixed(2) + ' NCHE CGPA',
          subjects: subjects
        };
      }
    },

    // 26. Zambia University GPA Calculator
    'zambia-university-gpa-calculator': {
      id: 'zambia-university-gpa',
      title: 'Zambia University GPA Calculator',
      higherIsBetter: true,
      unit: 'GPA',
      extract: function () {
        var resEl = document.getElementById('semesterGpaValue') || document.getElementById('cgpaValue');
        var val = resEl ? parseFloat(resEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;

        var scaleSel = document.getElementById('gpaScale');
        var maxScale = scaleSel && scaleSel.value === 'cbu4' ? 4.0 : 5.0;

        var subjects = [];
        var rows = document.querySelectorAll('#courseList .course-row');
        rows.forEach(function (row, idx) {
          var nameInp = row.querySelector('.course-name');
          var sName = (nameInp && nameInp.value.trim()) || ('Course ' + (idx + 1));
          var gradeSel = row.querySelector('.course-grade');
          if (gradeSel && gradeSel.value !== '') {
            var gp = parseFloat(gradeSel.value);
            var optText = gradeSel.options[gradeSel.selectedIndex] ? gradeSel.options[gradeSel.selectedIndex].text.split(' ')[0] : (gp.toFixed(1) + ' pts');
            if (!isNaN(gp) && gp >= 0) {
              subjects.push({
                name: sName.length > 14 ? sName.substring(0, 12) + '…' : sName,
                grade: optText,
                raw: gp,
                norm: Math.max(0.12, gp / maxScale),
                display: optText + ' (' + gp.toFixed(1) + ')'
              });
            }
          }
        });

        return {
          value: val,
          displayValue: val.toFixed(2) + ' GPA',
          subjects: subjects
        };
      }
    },

    // 27. Zimbabwe University GPA Calculator
    'zimbabwe-university-gpa-calculator': {
      id: 'zimbabwe-university-gpa',
      title: 'Zimbabwe University GPA Calculator',
      higherIsBetter: true,
      unit: 'GPA',
      extract: function () {
        var headEl = document.getElementById('headline');
        var text = headEl ? headEl.textContent.trim() : '';
        var isWam = text.indexOf('%') !== -1;
        var val = parseFloat(text.replace(/[^0-9.]/g, ''));
        if (isNaN(val)) return null;

        var subjects = [];
        var rows = document.querySelectorAll('#coursesContainer .course-row');
        rows.forEach(function (row, idx) {
          var nameInp = row.querySelector('.course-name');
          var sName = (nameInp && nameInp.value.trim()) || ('Unit ' + (idx + 1));
          var markInp = row.querySelector('.course-mark');
          if (markInp && markInp.value !== '') {
            var mark = parseFloat(markInp.value);
            if (!isNaN(mark) && mark >= 0 && mark <= 100) {
              subjects.push({
                name: sName.length > 14 ? sName.substring(0, 12) + '…' : sName,
                grade: Math.round(mark) + '%',
                raw: mark,
                norm: Math.max(0.12, mark / 100),
                display: Math.round(mark) + '%'
              });
            }
          }
        });

        return {
          value: val,
          displayValue: val.toFixed(2) + (isWam ? '% WAM' : ' GPA'),
          subjects: subjects
        };
      }
    },

    // 28. Form Four GPA Calculator (Tanzania CSEE)
    'form-four-gpa-calculator': {
      id: 'form-four-gpa',
      title: 'Form Four GPA Calculator',
      higherIsBetter: false,
      unit: 'pts',
      extract: function () {
        var ptsEl = document.getElementById('pointsValue');
        var val = ptsEl ? parseInt(ptsEl.textContent.trim().replace(/[^0-9]/g, ''), 10) : NaN;
        if (isNaN(val)) {
          var gpaEl = document.getElementById('gpaValue');
          val = gpaEl ? parseFloat(gpaEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        }
        if (isNaN(val)) return null;

        var ptsMap = { 'A': 1, 'B': 2, 'C': 3, 'D': 4, 'F': 5 };
        var subjects = [];
        var rows = document.querySelectorAll('#subjectList .subject-row');
        rows.forEach(function (row, idx) {
          var sName = row.dataset.subject || (row.querySelector('.subject-label') ? row.querySelector('.subject-label').textContent.trim() : ('Subject ' + (idx + 1)));
          var gradeSel = row.querySelector('.subject-grade');
          if (gradeSel && gradeSel.value && ptsMap[gradeSel.value] !== undefined) {
            var g = gradeSel.value;
            var pt = ptsMap[g];
            subjects.push({
              name: sName.length > 14 ? sName.substring(0, 12) + '…' : sName,
              grade: g,
              raw: pt,
              norm: Math.max(0.12, (6 - pt) / 5),
              display: g + ' (' + pt + ' pt)'
            });
          }
        });

        return {
          value: val,
          displayValue: val + ' Points (CSEE)',
          subjects: subjects
        };
      }
    },

    // 29. PLE Aggregate Calculator (Uganda UNEB)
    'ple-aggregate-calculator': {
      id: 'ple-aggregate',
      title: 'PLE Aggregate Calculator',
      higherIsBetter: false,
      unit: 'Aggregate',
      extract: function () {
        var aggEl = document.getElementById('aggBig');
        var val = aggEl ? parseInt(aggEl.textContent.trim(), 10) : NaN;
        if (isNaN(val)) return null;

        var subConfig = [
          { id: 'pleEnglish', name: 'English' },
          { id: 'pleMath', name: 'Maths' },
          { id: 'pleScience', name: 'Science' },
          { id: 'pleSst', name: 'Social Studies' }
        ];

        var gradeLetters = { 1: 'D1', 2: 'D2', 3: 'C3', 4: 'C4', 5: 'C5', 6: 'C6', 7: 'P7', 8: 'P8', 9: 'F9' };
        var subjects = [];
        subConfig.forEach(function (item) {
          var sel = document.getElementById(item.id);
          if (sel && sel.value !== '') {
            var pt = parseInt(sel.value, 10);
            if (!isNaN(pt) && pt >= 1 && pt <= 9) {
              var code = gradeLetters[pt] || ('G' + pt);
              subjects.push({
                name: item.name,
                grade: code,
                raw: pt,
                norm: Math.max(0.12, (10 - pt) / 9),
                display: code + ' (' + pt + ' pt)'
              });
            }
          }
        });

        return {
          value: val,
          displayValue: 'Aggregate ' + val + ' (PLE)',
          subjects: subjects
        };
      }
    },

    // 30. TVET NC(V) Pass Calculator
    'tvet-ncv-pass-calculator': {
      id: 'tvet-ncv-pass',
      title: 'TVET NC(V) Pass Calculator',
      higherIsBetter: true,
      unit: '%',
      extract: function () {
        var resEl = document.getElementById('vocAggregate') || document.getElementById('fundAggregate');
        var val = resEl ? parseFloat(resEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;

        var subjects = [];

        var addFund = function (icassId, examId, name) {
          var icassEl = document.getElementById(icassId);
          var examEl = document.getElementById(examId);
          var i = icassEl && icassEl.value !== '' ? parseFloat(icassEl.value) : NaN;
          var x = examEl && examEl.value !== '' ? parseFloat(examEl.value) : NaN;
          if (!isNaN(i) && !isNaN(x)) {
            var finalMark = Math.round(i * 0.5 + x * 0.5);
            subjects.push({
              name: name,
              grade: finalMark + '%',
              raw: finalMark,
              norm: Math.max(0.12, finalMark / 100),
              display: finalMark + '%'
            });
          }
        };

        addFund('langIcass', 'langExam', 'Language');
        addFund('loIcass', 'loExam', 'Life Orientation');
        addFund('mathIcass', 'mathExam', 'Mathematics');

        for (var idx = 1; idx <= 4; idx++) {
          var nameEl = document.getElementById('voc' + idx + 'Name');
          var icassEl = document.getElementById('voc' + idx + 'Icass');
          var isatEl = document.getElementById('voc' + idx + 'Isat');
          var examEl = document.getElementById('voc' + idx + 'Exam');
          var sName = (nameEl && nameEl.value.trim()) || ('Vocational ' + idx);
          var i = icassEl && icassEl.value !== '' ? parseFloat(icassEl.value) : NaN;
          var p = isatEl && isatEl.value !== '' ? parseFloat(isatEl.value) : NaN;
          var x = examEl && examEl.value !== '' ? parseFloat(examEl.value) : NaN;
          if (!isNaN(i) && !isNaN(p) && !isNaN(x)) {
            var finalMark = Math.round(i * 0.25 + p * 0.25 + x * 0.50);
            subjects.push({
              name: sName.length > 14 ? sName.substring(0, 12) + '…' : sName,
              grade: finalMark + '%',
              raw: finalMark,
              norm: Math.max(0.12, finalMark / 100),
              display: finalMark + '%'
            });
          }
        }

        return {
          value: val,
          displayValue: val.toFixed(1) + '% Aggregate',
          subjects: subjects
        };
      }
    },

    // 31. IGCSE & A-Level GPA Converter
    'igcse-alevel-gpa-converter': {
      id: 'igcse-alevel-gpa',
      title: 'IGCSE & A-Level GPA Converter',
      higherIsBetter: true,
      unit: 'GPA',
      extract: function () {
        var gpaEl = document.getElementById('gpaBig');
        var val = gpaEl ? parseFloat(gpaEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;

        var gpaMap = { 'A*': 4.0, 'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'E': 0.0, 'U': 0.0 };
        var subjects = [];
        var rows = document.querySelectorAll('#rowsWrap .subject-row, .subject-row');
        rows.forEach(function (row, idx) {
          var nameInp = row.querySelector('.subject-name');
          var sName = (nameInp && nameInp.value.trim()) || ('Subject ' + (idx + 1));
          var gradeSel = row.querySelector('.subject-grade');
          if (gradeSel && gradeSel.value) {
            var g = gradeSel.value.toUpperCase();
            var pts = gpaMap[g] !== undefined ? gpaMap[g] : 0;
            subjects.push({
              name: sName.length > 14 ? sName.substring(0, 12) + '…' : sName,
              grade: g,
              raw: pts,
              norm: Math.max(0.12, pts / 4.0),
              display: g + ' (' + pts.toFixed(1) + ')'
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

    // 32. UK Degree Classification Calculator
    'uk-degree-classification-calculator': {
      id: 'uk-degree-classification',
      title: 'UK Degree Classification Calculator',
      higherIsBetter: true,
      unit: '% Honours',
      extract: function () {
        var finalEl = document.getElementById('finalScore');
        var val = finalEl ? parseFloat(finalEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;

        var classEl = document.getElementById('classificationOut');
        var band = (classEl && classEl.textContent !== '—') ? classEl.textContent.trim() : 'Honours';

        var subjects = [];
        var rows = document.querySelectorAll('#y2ModulesContainer .mod-row, #y3ModulesContainer .mod-row');
        rows.forEach(function (row, idx) {
          var nameInp = row.querySelector('.mod-name');
          var markInp = row.querySelector('.mod-mark');
          var sName = (nameInp && nameInp.value.trim()) || ('Module ' + (idx + 1));
          if (markInp && markInp.value !== '') {
            var mark = parseFloat(markInp.value);
            if (!isNaN(mark) && mark >= 0 && mark <= 100) {
              subjects.push({
                name: sName.length > 14 ? sName.substring(0, 12) + '…' : sName,
                grade: Math.round(mark) + '%',
                raw: mark,
                norm: Math.max(0.12, mark / 100),
                display: mark.toFixed(1) + '%'
              });
            }
          }
        });

        return {
          value: val,
          displayValue: val.toFixed(1) + '% (' + band + ')',
          subjects: subjects
        };
      }
    },

    // 33. UK GCSE Grade Calculator
    'uk-gcse-grade-calculator': {
      id: 'uk-gcse-grade',
      title: 'UK GCSE Grade Calculator',
      higherIsBetter: true,
      unit: 'Avg Grade',
      extract: function () {
        var aggEl = document.getElementById('aggregateScore');
        var val = aggEl ? parseFloat(aggEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;

        var a8El = document.getElementById('statAValue');
        var a8Str = (a8El && a8El.textContent !== '—') ? a8El.textContent.trim() : '';

        var subjects = [];
        var rows = document.querySelectorAll('#subjectRowsContainer .gcse-row');
        rows.forEach(function (row, idx) {
          var nameInp = row.querySelector('.subj-name');
          var gradeSel = row.querySelector('.subj-grade');
          var sName = (nameInp && nameInp.value.trim()) || ('Subject ' + (idx + 1));
          if (gradeSel && gradeSel.value !== '') {
            var g = gradeSel.value;
            var num = parseFloat(g);
            var pts = !isNaN(num) ? num : (g.toUpperCase() === 'U' ? 0 : 0);
            subjects.push({
              name: sName.length > 14 ? sName.substring(0, 12) + '…' : sName,
              grade: 'Grade ' + g,
              raw: pts,
              norm: Math.max(0.12, pts / 9.0),
              display: 'Grade ' + g + ' (' + pts + ' pts)'
            });
          }
        });

        return {
          value: val,
          displayValue: val.toFixed(2) + ' Avg Grade' + (a8Str ? ' (A8: ' + a8Str + ')' : ''),
          subjects: subjects
        };
      }
    },

    // 34. UK A-Level Grade Calculator
    'uk-a-level-grade-calculator': {
      id: 'uk-a-level-grade',
      title: 'A-Level Grade Calculator',
      higherIsBetter: true,
      unit: 'Grade',
      extract: function () {
        var resSubject = document.getElementById('resSubjectCard');
        var resProfile = document.getElementById('resProfileCard');
        var isProfile = resProfile && !resProfile.classList.contains('hidden');

        if (isProfile) {
          var tariffEl = document.getElementById('resProfileTariff');
          var comboEl = document.getElementById('resProfileCombo');
          var tariffVal = tariffEl ? parseFloat(tariffEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
          if (isNaN(tariffVal)) return null;

          var subjects = [];
          var rows = document.querySelectorAll('.prof-row');
          var TARIFF_MAP = { 'A*': 56, 'A': 48, 'B': 40, 'C': 32, 'D': 24, 'E': 16 };
          rows.forEach(function (r, idx) {
            var nameInp = r.querySelector('.prof-name');
            var gradeSel = r.querySelector('.prof-grade');
            var sName = (nameInp && nameInp.value.trim()) || ('Subject ' + (idx + 1));
            var g = gradeSel ? gradeSel.value : '';
            if (g) {
              var pts = TARIFF_MAP[g] || 0;
              subjects.push({
                name: sName.length > 14 ? sName.substring(0, 12) + '…' : sName,
                grade: g,
                raw: pts,
                norm: Math.max(0.15, pts / 56.0),
                display: g + ' (' + pts + ' pts)'
              });
            }
          });

          return {
            value: tariffVal,
            displayValue: (comboEl ? comboEl.textContent.trim() + ' • ' : '') + tariffVal + ' pts',
            subjects: subjects
          };
        } else {
          var gradeEl = document.getElementById('finalGradeDisplay');
          var pctEl = document.getElementById('weightedPercentageDisplay');
          if (!gradeEl || gradeEl.textContent === '—') return null;

          var pctVal = pctEl ? parseFloat(pctEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
          var numVal = !isNaN(pctVal) ? pctVal : 0;

          var subjects = [];
          var cRows = document.querySelectorAll('#componentList .course-row');
          cRows.forEach(function (r, idx) {
            var nameInp = r.querySelector('.comp-name');
            var sName = (nameInp && nameInp.value.trim()) || ('Paper ' + (idx + 1));
            var scoreInp = r.querySelector('.comp-score');
            var maxInp = r.querySelector('.comp-max');
            var sVal = scoreInp ? parseFloat(scoreInp.value) : NaN;
            var mVal = maxInp ? parseFloat(maxInp.value) : 100;
            if (!isNaN(sVal) && mVal > 0) {
              var ratio = Math.min(1.0, Math.max(0, sVal / mVal));
              subjects.push({
                name: sName.length > 14 ? sName.substring(0, 12) + '…' : sName,
                grade: Math.round(ratio * 100) + '%',
                raw: ratio * 100,
                norm: Math.max(0.12, ratio),
                display: sVal + '/' + mVal + ' (' + Math.round(ratio * 100) + '%)'
              });
            }
          });

          return {
            value: numVal,
            displayValue: 'Grade ' + gradeEl.textContent.trim() + ' (' + numVal.toFixed(1) + '%)',
            subjects: subjects
          };
        }
      }
    },

    // 35. UCAS Points Calculator
    'ucas-points-calculator': {
      id: 'ucas-points',
      title: 'UCAS Points Calculator',
      higherIsBetter: true,
      unit: 'Points',
      extract: function () {
        var totalEl = document.getElementById('totalPoints');
        var val = totalEl ? parseFloat(totalEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val) || val <= 0) return null;

        var subjects = [];
        var rows = document.querySelectorAll('#qualList .qual-row');
        rows.forEach(function (r, idx) {
          var subInp = r.querySelector('.q-subject');
          var typeSel = r.querySelector('.q-type');
          var gradeSel = r.querySelector('.q-grade');
          var sName = (subInp && subInp.value.trim()) || (typeSel && typeSel.selectedOptions[0] ? typeSel.selectedOptions[0].textContent : 'Qualification ' + (idx + 1));
          var gText = gradeSel && gradeSel.selectedOptions[0] ? gradeSel.selectedOptions[0].textContent : '';
          var gMatch = gText.match(/^([^(]+)(?:\((\d+)\s*pts\))?/);
          var gName = gMatch ? gMatch[1].trim() : (gradeSel ? gradeSel.value : '');
          var pts = gMatch && gMatch[2] ? parseFloat(gMatch[2]) : (gradeSel ? parseFloat(gradeSel.value) || 0 : 0);

          if (gName) {
            subjects.push({
              name: sName.length > 14 ? sName.substring(0, 12) + '…' : sName,
              grade: gName,
              raw: pts,
              norm: Math.max(0.15, Math.min(1.0, pts / 56.0)),
              display: gName + ' (' + pts + ' pts)'
            });
          }
        });

        return {
          value: val,
          displayValue: val + ' UCAS Tariff Points',
          subjects: subjects
        };
      }
    },

    // 36. Canada GPA Calculator
    'canada-gpa-calculator': {
      id: 'canada-gpa',
      title: 'Canada GPA Calculator',
      higherIsBetter: true,
      unit: 'GPA',
      extract: function () {
        var gpaEl = document.getElementById('gpaBig');
        var val = gpaEl ? parseFloat(gpaEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;

        var cgpaEl = document.getElementById('cgpaValue');
        var cgpaStr = cgpaEl && cgpaEl.textContent !== '—' ? cgpaEl.textContent.trim() : '';

        var subjects = [];
        var rows = document.querySelectorAll('#courseList .course-row');
        var letterMap = { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0 };

        rows.forEach(function (r, idx) {
          var nameInp = r.querySelector('.course-name');
          var sName = (nameInp && nameInp.value.trim()) || ('Course ' + (idx + 1));
          var gradeInp = r.querySelector('.course-grade');
          var credInp = r.querySelector('.course-credit');
          var gVal = gradeInp ? gradeInp.value.trim() : '';
          var cr = credInp ? parseFloat(credInp.value) || 3 : 3;

          if (gVal) {
            var numG = parseFloat(gVal);
            var normVal = !isNaN(numG) ? (numG > 4.5 ? numG / 100 : numG / 4.0) : 0.75;
            if (letterMap[gVal.toUpperCase()] !== undefined) {
              normVal = letterMap[gVal.toUpperCase()] / 4.0;
            }
            subjects.push({
              name: sName.length > 14 ? sName.substring(0, 12) + '…' : sName,
              grade: gVal,
              raw: normVal * 4.0,
              norm: Math.max(0.12, Math.min(1.0, normVal)),
              display: gVal + ' (' + cr + ' cr)'
            });
          }
        });

        return {
          value: val,
          displayValue: val.toFixed(2) + ' GPA' + (cgpaStr ? ' (CGPA ' + cgpaStr + ')' : ''),
          subjects: subjects
        };
      }
    },

    // 37. Australian ATAR Calculator
    'atar-calculator': {
      id: 'atar-calc',
      title: 'ATAR Calculator',
      higherIsBetter: true,
      unit: 'ATAR',
      extract: function () {
        var atarEl = document.getElementById('atarBig');
        var val = atarEl ? parseFloat(atarEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;

        var subjects = [];
        var rows = document.querySelectorAll('#courseList .course-row');
        rows.forEach(function (r, idx) {
          var nameInp = r.querySelector('.subject-name, .course-name');
          var scoreInp = r.querySelector('.subject-score, .course-grade');
          var unitsSel = r.querySelector('.subject-units');
          var sName = (nameInp && nameInp.value.trim()) || ('Subject ' + (idx + 1));
          var sVal = scoreInp ? parseFloat(scoreInp.value) : NaN;
          var uVal = unitsSel ? unitsSel.value : '2';

          if (!isNaN(sVal)) {
            var normVal = Math.min(1.0, Math.max(0.12, sVal / 50.0));
            subjects.push({
              name: sName.length > 14 ? sName.substring(0, 12) + '…' : sName,
              grade: sVal.toFixed(1),
              raw: sVal,
              norm: normVal,
              display: sVal.toFixed(1) + ' (' + uVal + 'u)'
            });
          }
        });

        return {
          value: val,
          displayValue: val.toFixed(2) + ' ATAR',
          subjects: subjects
        };
      }
    },

    // 38. KCPE Performance Calculator
    'kcpe-performance-calculator': {
      id: 'kcpe-performance',
      title: 'KCPE Performance Calculator',
      higherIsBetter: true,
      unit: 'Marks',
      extract: function () {
        var totalEl = document.getElementById('totalValue');
        var val = totalEl ? parseFloat(totalEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;

        var meanEl = document.getElementById('meanValue');
        var gradeEl = document.getElementById('gradeValue');
        var meanStr = meanEl ? meanEl.textContent.trim() : '';
        var gradeStr = gradeEl ? gradeEl.textContent.trim() : '';

        var subjects = [];
        var papers = [
          { id: 'english', name: 'English' },
          { id: 'kiswahili', name: 'Kiswahili' },
          { id: 'maths', name: 'Mathematics' },
          { id: 'science', name: 'Science' },
          { id: 'social', name: 'Social Studies' }
        ];

        papers.forEach(function (p) {
          var el = document.getElementById(p.id);
          var m = el ? parseFloat(el.value) : NaN;
          if (!isNaN(m)) {
            subjects.push({
              name: p.name,
              grade: Math.round(m) + '%',
              raw: m,
              norm: Math.max(0.12, Math.min(1.0, m / 100.0)),
              display: Math.round(m) + ' / 100'
            });
          }
        });

        return {
          value: val,
          displayValue: val + ' / 500 (' + (gradeStr || meanStr) + ')',
          subjects: subjects
        };
      }
    },

    // 39. Germany Abitur Grade Calculator
    'germany-abitur-grade-calculator': {
      id: 'germany-abitur-grade',
      title: 'Germany Abitur Grade Calculator',
      higherIsBetter: false, // 1.0 is top grade, 4.0 is pass mark
      unit: 'Abiturnote',
      extract: function () {
        var headlineEl = document.getElementById('headline');
        if (!headlineEl || headlineEl.textContent.trim() === 'Fail' || headlineEl.textContent.trim() === '—') return null;

        var val = parseFloat(headlineEl.textContent.trim().replace(/[^0-9.]/g, ''));
        if (isNaN(val)) return null;

        var statTotal = document.getElementById('statTotal');
        var ptsStr = statTotal && statTotal.textContent !== '—' ? statTotal.textContent.trim() + ' pts' : '';

        var subjects = [];
        var pFields = [
          { id: 'p1Grade', name: 'P1 Written' },
          { id: 'p2Grade', name: 'P2 Written' },
          { id: 'p3Grade', name: 'P3 Written' },
          { id: 'p4Grade', name: 'P4 Oral' }
        ];

        pFields.forEach(function (f) {
          var el = document.getElementById(f.id);
          var pts = el ? parseFloat(el.value) : NaN;
          if (!isNaN(pts) && pts >= 0 && pts <= 15) {
            subjects.push({
              name: f.name,
              grade: pts + ' pts',
              raw: pts,
              norm: Math.max(0.12, pts / 15.0),
              display: pts + ' / 15'
            });
          }
        });

        var lkEl = document.getElementById('compLkAverage');
        if (lkEl && !isNaN(parseFloat(lkEl.value))) {
          var lkPts = parseFloat(lkEl.value);
          subjects.unshift({
            name: 'LK Courses',
            grade: lkPts.toFixed(1) + ' pts',
            raw: lkPts,
            norm: Math.max(0.12, lkPts / 15.0),
            display: lkPts.toFixed(1) + ' / 15'
          });
        }

        var gkEl = document.getElementById('compGkAverage');
        if (gkEl && !isNaN(parseFloat(gkEl.value))) {
          var gkPts = parseFloat(gkEl.value);
          subjects.unshift({
            name: 'GK Courses',
            grade: gkPts.toFixed(1) + ' pts',
            raw: gkPts,
            norm: Math.max(0.12, gkPts / 15.0),
            display: gkPts.toFixed(1) + ' / 15'
          });
        }

        return {
          value: val,
          displayValue: val.toFixed(1) + ' Note' + (ptsStr ? ' (' + ptsStr + ')' : ''),
          subjects: subjects
        };
      }
    },

    // 40. Germany GPA Converter (Bavarian Formula)
    'germany-gpa-converter': {
      id: 'germany-gpa-converter',
      title: 'Germany GPA Converter',
      higherIsBetter: false, // 1.0 is best in Germany
      unit: 'German Grade',
      extract: function () {
        var gEl = document.getElementById('germanGrade');
        var val = gEl ? parseFloat(gEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;

        var ratingEl = document.getElementById('germanRating');
        var rText = ratingEl ? ratingEl.textContent.split('•')[0].trim() : '';

        var inputNd = document.getElementById('inputNd');
        var inputNmax = document.getElementById('inputNmax');
        var inVal = inputNd ? parseFloat(inputNd.value) : NaN;
        var maxVal = inputNmax ? parseFloat(inputNmax.value) : 4.0;

        var subjects = [];
        if (!isNaN(inVal) && maxVal > 0) {
          var normVal = Math.max(0.12, Math.min(1.0, inVal / maxVal));
          subjects.push({
            name: 'Original Grade',
            grade: inVal.toString(),
            raw: inVal,
            norm: normVal,
            display: inVal + ' / ' + maxVal
          });
          var gerNorm = Math.max(0.12, (4.0 - val) / 3.0);
          subjects.push({
            name: 'Converted Grade',
            grade: val.toFixed(1),
            raw: val,
            norm: Math.max(0.12, Math.min(1.0, gerNorm)),
            display: val.toFixed(1) + ' German'
          });
          var ectsEl = document.getElementById('statEcts');
          if (ectsEl && ectsEl.textContent !== '—') {
            subjects.push({
              name: 'ECTS Band',
              grade: ectsEl.textContent.trim(),
              raw: 1,
              norm: 0.8,
              display: 'Band ' + ectsEl.textContent.trim()
            });
          }
        }

        return {
          value: val,
          displayValue: val.toFixed(1) + ' (' + (rText || 'German Grade') + ')',
          subjects: subjects
        };
      }
    },

    // 41. New Zealand NCEA Credits Calculator
    'new-zealand-ncea-credits-calculator': {
      id: 'nz-ncea-credits',
      title: 'NCEA Credits & Rank Score Calculator',
      higherIsBetter: true,
      unit: 'Rank Score',
      extract: function () {
        var rankEl = document.getElementById('rankScoreOut');
        var val = rankEl ? parseFloat(rankEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;

        var certEl = document.getElementById('certCredits');
        var certStr = certEl && certEl.textContent !== '—' ? certEl.textContent.trim() + ' cr' : '';

        var subjects = [];
        var rows = document.querySelectorAll('#nceaRowsContainer .ncea-row');
        var gradeWeights = { 'E': 4, 'M': 3, 'A': 2, 'N': 0 };
        rows.forEach(function (r, idx) {
          var nameInp = r.querySelector('.std-name');
          var credInp = r.querySelector('.std-credits');
          var gradeSel = r.querySelector('.std-grade');
          var sName = (nameInp && nameInp.value.trim()) || ('Standard ' + (idx + 1));
          var cr = credInp ? parseFloat(credInp.value) : NaN;
          var g = gradeSel ? gradeSel.value : '';

          if (!isNaN(cr) && g) {
            var pts = gradeWeights[g] || 0;
            subjects.push({
              name: sName.length > 14 ? sName.substring(0, 12) + '…' : sName,
              grade: g + ' (' + cr + 'cr)',
              raw: pts,
              norm: Math.max(0.12, pts / 4.0),
              display: g + ' • ' + cr + ' credits'
            });
          }
        });

        return {
          value: val,
          displayValue: val + ' Rank Score' + (certStr ? ' (' + certStr + ')' : ''),
          subjects: subjects
        };
      }
    },

    // 42. Norway GPA Calculator
    'norway-gpa-calculator': {
      id: 'norway-gpa',
      title: 'Norway GPA Calculator',
      higherIsBetter: true,
      unit: 'GPA',
      extract: function () {
        var hEl = document.getElementById('headline');
        var val = hEl ? parseFloat(hEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;

        var lblEl = document.getElementById('headlineLabel');
        var isUni = !lblEl || lblEl.textContent.indexOf('ECTS') !== -1;

        var subjects = [];
        var rows = document.querySelectorAll('#coursesContainer .course-row');
        var letterMap = { 'A': 5.0, 'B': 4.0, 'C': 3.0, 'D': 2.0, 'E': 1.0, 'F': 0.0 };
        rows.forEach(function (r, idx) {
          var nameInp = r.querySelector('.course-name');
          var gradeSel = r.querySelector('.course-grade');
          var ectsInp = r.querySelector('.course-ects');
          var sName = (nameInp && nameInp.value.trim()) || ('Course ' + (idx + 1));
          var g = gradeSel ? gradeSel.value : '';
          var ects = ectsInp ? parseFloat(ectsInp.value) || 7.5 : 7.5;

          if (g && letterMap[g] !== undefined) {
            var pts = letterMap[g];
            subjects.push({
              name: sName.length > 14 ? sName.substring(0, 12) + '…' : sName,
              grade: g,
              raw: pts,
              norm: Math.max(0.12, pts / 5.0),
              display: g + ' (' + ects + ' ECTS)'
            });
          }
        });

        return {
          value: val,
          displayValue: isUni ? val.toFixed(2) + ' ECTS GPA' : val.toFixed(1) + ' Samordna Points',
          subjects: subjects
        };
      }
    },

    // 43. Switzerland Grade Calculator
    'switzerland-grade-calculator': {
      id: 'switzerland-grade',
      title: 'Switzerland Grade Calculator',
      higherIsBetter: true, // 6.0 is highest grade in Switzerland, 4.0 is pass
      unit: 'Swiss Note',
      extract: function () {
        var aggEl = document.getElementById('aggregateBig');
        var val = aggEl ? parseFloat(aggEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;

        var usEl = document.getElementById('usGpaValue');
        var usStr = usEl && usEl.textContent !== '—' ? usEl.textContent.trim() : '';

        var subjects = [];
        var rows = document.querySelectorAll('#courseList .course-row');
        rows.forEach(function (r, idx) {
          var nameInp = r.querySelector('.course-name');
          var gradeInp = r.querySelector('.course-grade');
          var ectsInp = r.querySelector('.course-ects');
          var sName = (nameInp && nameInp.value.trim()) || ('Course ' + (idx + 1));
          var g = gradeInp ? parseFloat(gradeInp.value) : NaN;
          var ects = ectsInp ? parseFloat(ectsInp.value) || 3 : 3;

          if (!isNaN(g) && g >= 1.0 && g <= 6.0) {
            subjects.push({
              name: sName.length > 14 ? sName.substring(0, 12) + '…' : sName,
              grade: g.toFixed(1),
              raw: g,
              norm: Math.max(0.12, (g - 1.0) / 5.0),
              display: g.toFixed(2) + ' (' + ects + ' ECTS)'
            });
          }
        });

        return {
          value: val,
          displayValue: val.toFixed(2) + ' / 6.00' + (usStr ? ' (US ' + usStr + ')' : ''),
          subjects: subjects
        };
      }
    },

    // 44. SA TVET NATED Pass Calculator
    'south-african-tvet-nated-calculator': {
      id: 'sa-tvet-nated',
      title: 'TVET NATED Pass Calculator',
      higherIsBetter: true,
      unit: '%',
      extract: function () {
        // 1. Check for Trimester / Multi-Subject Mode
        var triRows = document.querySelectorAll('#natedSubjectRows .subject-row');
        var isTrimesterTab = document.getElementById('tabTrimester') && document.getElementById('tabTrimester').classList.contains('active');
        if (isTrimesterTab && triRows && triRows.length >= 3) {
          var triSubjects = [];
          var totalComp = 0;
          var validCount = 0;
          var passedCount = 0;

          triRows.forEach(function (row, idx) {
            var nameInp = row.querySelector('.subject-name');
            var icassInp = row.querySelector('.subject-icass');
            var examInp = row.querySelector('.subject-exam');
            var sName = (nameInp && nameInp.value.trim()) || (nameInp && nameInp.placeholder ? nameInp.placeholder.replace(/^e\.g\.\s*/i, '') : ('Subject ' + (idx + 1)));
            var iVal = icassInp && icassInp.value !== '' ? parseFloat(icassInp.value) : NaN;
            var eVal = examInp && examInp.value !== '' ? parseFloat(examInp.value) : NaN;

            if (!isNaN(iVal) && !isNaN(eVal)) {
              var sComp = (iVal * 0.40) + (eVal * 0.60);
              sComp = Math.min(100, Math.max(0, sComp));
              var eMet = eVal >= 40.0;
              var isPass = sComp >= 40.0 && eMet;
              var isDist = sComp >= 75.0 && eMet;
              if (isPass) passedCount++;

              var badge = isDist ? 'Distinction' : (isPass ? 'Pass' : (eMet ? 'Fail' : 'Sub-min Fail'));
              triSubjects.push({
                name: sName.length > 13 ? sName.substring(0, 11) + '…' : sName,
                grade: sComp.toFixed(1) + '%',
                raw: sComp,
                norm: Math.min(1.0, Math.max(0.1, sComp / 100)),
                display: sComp.toFixed(1) + '% • ' + badge
              });
              totalComp += sComp;
              validCount++;
            }
          });

          if (triSubjects.length >= 3) {
            var triAvg = validCount > 0 ? (totalComp / validCount) : 0;
            return {
              value: triAvg,
              displayValue: triAvg.toFixed(1) + '% Trimester Average (' + passedCount + '/' + validCount + ' Passed)',
              subjects: triSubjects
            };
          }
        }

        // 2. Single Subject Mode (5 Core NATED Assessment Dimensions)
        var scoreEl = document.getElementById('finalScore');
        var val = scoreEl ? parseFloat(scoreEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;

        var classificationEl = document.getElementById('classification');
        var classification = classificationEl && classificationEl.textContent !== '—' ? classificationEl.textContent.trim() : '';
        var icassInp = document.getElementById('icassInput');
        var examInp = document.getElementById('examInput');
        var icass = icassInp && icassInp.value !== '' ? parseFloat(icassInp.value) || 0 : 0;
        var exam = examInp && examInp.value !== '' ? parseFloat(examInp.value) || 0 : 0;

        var subMinNorm = exam >= 40
          ? Math.min(1.0, 0.40 + ((exam - 40) / 60) * 0.60)
          : Math.max(0.08, (exam / 40) * 0.35);

        var distinctionNorm = Math.min(1.0, Math.max(0.1, val / 75));

        var subjects = [
          {
            name: 'ICASS Mark (40%)',
            grade: icass.toFixed(1) + '%',
            raw: icass,
            norm: Math.min(1.0, Math.max(0.1, icass / 100)),
            display: icass.toFixed(1) + '% (Term Mark)'
          },
          {
            name: 'National Exam (60%)',
            grade: exam.toFixed(1) + '%',
            raw: exam,
            norm: Math.min(1.0, Math.max(0.1, exam / 100)),
            display: exam.toFixed(1) + '% (Exam Paper)'
          },
          {
            name: 'Final Composite',
            grade: val.toFixed(1) + '%',
            raw: val,
            norm: Math.min(1.0, Math.max(0.1, val / 100)),
            display: val.toFixed(1) + '% Combined'
          },
          {
            name: 'Exam Sub-Min (40%)',
            grade: exam >= 40 ? '+' + (exam - 40).toFixed(1) + '%' : '-' + (40 - exam).toFixed(1) + '%',
            raw: exam,
            norm: subMinNorm,
            display: exam >= 40 ? 'Cleared (+ ' + (exam - 40).toFixed(1) + '% margin)' : 'Sub-minimum Failed'
          },
          {
            name: 'Distinction Index',
            grade: val >= 75 ? 'Distinction' : val.toFixed(1) + '% / 75%',
            raw: val,
            norm: distinctionNorm,
            display: val >= 75 ? 'Distinction Met (75%+)' : (75 - val).toFixed(1) + '% to Distinction'
          }
        ];

        return {
          value: val,
          displayValue: val.toFixed(1) + '%' + (classification ? ' (' + classification + ')' : ''),
          subjects: subjects
        };
      }
    },

    // 45. TVET Exam Target Mark Calculator
    'tvet-exam-target-mark-calculator': {
      id: 'tvet-exam-target',
      title: 'TVET Exam Target Mark Calculator',
      higherIsBetter: true,
      unit: '%',
      extract: function () {
        var examEl = document.getElementById('headlineExam');
        var val = examEl ? parseFloat(examEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;
        var icassInp = document.getElementById('icassInput');
        var targetInp = document.getElementById('targetInput');
        var icass = icassInp ? parseFloat(icassInp.value) || 0 : 0;
        var target = targetInp ? parseFloat(targetInp.value) || 50 : 50;
        var subjects = [
          {
            name: 'Current ICASS Assessment',
            grade: icass.toFixed(1) + '%',
            raw: icass,
            norm: Math.min(1.0, Math.max(0.1, icass / 100)),
            display: icass.toFixed(1) + '%'
          },
          {
            name: 'Final Mark Goal Target',
            grade: target.toFixed(1) + '%',
            raw: target,
            norm: Math.min(1.0, Math.max(0.1, target / 100)),
            display: target.toFixed(1) + '%'
          },
          {
            name: 'Required Examination Target',
            grade: val.toFixed(1) + '%',
            raw: val,
            norm: Math.min(1.0, Math.max(0.1, Math.min(100, val) / 100)),
            display: val.toFixed(1) + '%'
          }
        ];
        return {
          value: val,
          displayValue: val.toFixed(1) + '% Target Exam Mark (Goal: ' + target.toFixed(0) + '%)',
          subjects: subjects
        };
      }
    },

    // 46. UNEB Results Estimator (PLE, UCE, UACE)
    'uneb-results-estimator': {
      id: 'uneb-results',
      title: 'UNEB Results Estimator',
      higherIsBetter: false, // For PLE and UCE aggregates, lower aggregate is superior
      unit: 'Aggregate',
      extract: function () {
        var aggEl = document.getElementById('aggregateScore');
        var text = aggEl ? aggEl.textContent.trim() : '';
        if (!text || text === '—') return null;
        var val = parseFloat(text.replace(/[^0-9.]/g, ''));
        if (isNaN(val)) return null;
        var divEl = document.getElementById('statAValue');
        var divStr = divEl && divEl.textContent !== '—' ? divEl.textContent.trim() : '';
        var isUace = text.indexOf('/ 20') !== -1;
        var subjects = [];

        var pleInputs = [
          { id: 'pleEnglish', name: 'English Language' },
          { id: 'pleMath', name: 'Mathematics' },
          { id: 'pleScience', name: 'Integrated Science' },
          { id: 'pleSst', name: 'Social Studies & RE' }
        ];
        var foundPle = false;
        pleInputs.forEach(function (sub) {
          var sel = document.getElementById(sub.id);
          if (sel && sel.value) {
            foundPle = true;
            var pt = parseInt(sel.value, 10);
            subjects.push({
              name: sub.name,
              grade: 'D' + pt,
              raw: pt,
              norm: Math.max(0.1, (10 - pt) / 9),
              display: 'Point ' + pt
            });
          }
        });

        if (!foundPle) {
          var allSelects = document.querySelectorAll('#unebForm select');
          allSelects.forEach(function (sel) {
            if (sel.value && sel.id && !sel.id.startsWith('ple')) {
              var fieldEl = sel.closest('.field');
              var labelEl = fieldEl ? fieldEl.querySelector('.field-label') : null;
              var label = labelEl ? labelEl.textContent.trim() : sel.id;
              var pt = parseFloat(sel.value) || 0;
              subjects.push({
                name: label.length > 20 ? label.substring(0, 18) + '…' : label,
                grade: String(sel.value),
                raw: pt,
                norm: isUace ? Math.min(1.0, Math.max(0.1, pt / 6)) : Math.max(0.1, (10 - pt) / 9),
                display: 'Grade ' + sel.value
              });
            }
          });
        }

        return {
          value: val,
          displayValue: text + (divStr ? ' (' + divStr + ')' : ''),
          subjects: subjects
        };
      }
    },

    // 47. Ghana Nursing Training Admission Calculator
    'ghana-nursing-training-admission-calculator': {
      id: 'ghana-nursing-training',
      title: 'Ghana Nursing Training Admission Calculator',
      higherIsBetter: false, // WASSCE aggregate, 6 is top, lower is better
      unit: 'Aggregate',
      extract: function () {
        var aggEl = document.getElementById('aggValue');
        var val = aggEl ? parseFloat(aggEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;
        var coreEl = document.getElementById('coreValue');
        var elecEl = document.getElementById('elecValue');
        var coreStr = coreEl && coreEl.textContent !== '—' ? coreEl.textContent.trim() : '';
        var elecStr = elecEl && elecEl.textContent !== '—' ? elecEl.textContent.trim() : '';

        var subjects = [];
        var gradeNames = { 1: 'A1', 2: 'B2', 3: 'B3', 4: 'C4', 5: 'C5', 6: 'C6', 7: 'D7', 8: 'E8', 9: 'F9' };
        var fields = [
          { id: 'ghEnglish', name: 'Core English Language' },
          { id: 'ghMaths', name: 'Core Mathematics' },
          { id: 'ghScience', name: 'Core Integrated Science' },
          { id: 'ghElec1Grade', name: 'Elective Subject 1' },
          { id: 'ghElec2Grade', name: 'Elective Subject 2' },
          { id: 'ghElec3Grade', name: 'Elective Subject 3' }
        ];
        fields.forEach(function (f) {
          var sel = document.getElementById(f.id);
          if (sel && sel.value) {
            var gNum = parseInt(sel.value, 10);
            var gName = gradeNames[gNum] || ('Grade ' + gNum);
            subjects.push({
              name: f.name,
              grade: gName,
              raw: gNum,
              norm: Math.max(0.1, (10 - gNum) / 9),
              display: gName + ' (Point ' + gNum + ')'
            });
          }
        });

        return {
          value: val,
          displayValue: 'Aggregate ' + val + (coreStr ? ' (Core ' + coreStr + ' + Elec ' + elecStr + ')' : ''),
          subjects: subjects
        };
      }
    },

    // 48. South African University Admission Calculator (APS)
    'south-african-university-admission-calculator': {
      id: 'sa-uni-admission',
      title: 'South African University Admission Calculator',
      higherIsBetter: true,
      unit: 'APS',
      extract: function () {
        var apsEl = document.getElementById('apsValue');
        var val = apsEl ? parseFloat(apsEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;
        var passEl = document.getElementById('passLevel');
        var passStr = passEl && passEl.textContent !== '—' ? passEl.textContent.trim() : '';
        var benchEl = document.getElementById('benchmarkValue');
        var benchStr = benchEl && benchEl.textContent !== '—' ? benchEl.textContent.trim() : '';

        var subjects = [];
        var inputs = [
          { id: 'saMarkEnglish', name: 'English Language' },
          { id: 'saMarkMaths', name: 'Mathematics' },
          { id: 'saMarkPhysSci', name: 'Physical Sciences' },
          { id: 'saMarkLifeSci', name: 'Life Sciences' },
          { id: 'saMarkElective1', name: 'Elective 1' },
          { id: 'saMarkElective2', name: 'Elective 2' },
          { id: 'saMarkLO', name: 'Life Orientation' }
        ];
        inputs.forEach(function (inp) {
          var el = document.getElementById(inp.id);
          if (el && el.value !== '') {
            var m = parseFloat(el.value);
            if (!isNaN(m)) {
              subjects.push({
                name: inp.name,
                grade: m.toFixed(0) + '%',
                raw: m,
                norm: Math.min(1.0, Math.max(0.1, m / 100)),
                display: m.toFixed(0) + '%'
              });
            }
          }
        });

        return {
          value: val,
          displayValue: val + ' APS' + (passStr ? ' (' + passStr + ')' : '') + (benchStr ? ' [Target: ' + benchStr + ']' : ''),
          subjects: subjects
        };
      }
    },

    // 49. Zimbabwe University Entry Points Calculator
    'zimbabwe-university-entry-points-calculator': {
      id: 'zim-uni-entry',
      title: 'Zimbabwe University Entry Points Calculator',
      higherIsBetter: true,
      unit: 'Points',
      extract: function () {
        var ptsEl = document.getElementById('pointsOut');
        var val = ptsEl ? parseFloat(ptsEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;
        var passesEl = document.getElementById('principalPasses');
        var passesStr = passesEl && passesEl.textContent !== '—' ? passesEl.textContent.trim() : '';
        var cutoffEl = document.getElementById('cutoffBand');
        var cutoffStr = cutoffEl && cutoffEl.textContent !== '—' ? cutoffEl.textContent.trim() : '';

        var gradeWeights = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1, 'O': 0, 'F': 0 };
        var subjects = [];
        ['sub1', 'sub2', 'sub3'].forEach(function (subId, idx) {
          var sel = document.getElementById(subId);
          if (sel && sel.value) {
            var g = sel.value.toUpperCase();
            var pts = gradeWeights[g] !== undefined ? gradeWeights[g] : 0;
            subjects.push({
              name: 'Principal Subject ' + (idx + 1),
              grade: 'Grade ' + g,
              raw: pts,
              norm: Math.max(0.1, pts / 5),
              display: 'Grade ' + g + ' (' + pts + ' pts)'
            });
          }
        });

        return {
          value: val,
          displayValue: val + ' Points' + (passesStr ? ' (' + passesStr + ' Passes)' : '') + (cutoffStr ? ' [' + cutoffStr + ']' : ''),
          subjects: subjects
        };
      }
    },

    // 50. Canada University Admission Chance Calculator
    'canada-university-admission-chance-calculator': {
      id: 'canada-admission-chance',
      title: 'Canada University Admission Calculator',
      higherIsBetter: true,
      unit: '%',
      extract: function () {
        var avgEl = document.getElementById('avgVal');
        var val = avgEl ? parseFloat(avgEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;
        var probEl = document.getElementById('probBig');
        var probStr = probEl && probEl.textContent !== '—' ? probEl.textContent.trim() : '';

        var subjects = [];
        var subLabels = [
          'Adv Functions / Pre-Calculus',
          'Calculus & Vectors / Math 12',
          'English 12 / ENG4U',
          'Physics / Chem / Science 12',
          'Grade 12 Elective 1',
          'Grade 12 Elective 2'
        ];
        for (var i = 1; i <= 6; i++) {
          var inp = document.getElementById('subj' + i);
          if (inp && inp.value !== '') {
            var m = parseFloat(inp.value);
            if (!isNaN(m)) {
              subjects.push({
                name: subLabels[i - 1] || ('Subject ' + i),
                grade: m.toFixed(1) + '%',
                raw: m,
                norm: Math.min(1.0, Math.max(0.1, m / 100)),
                display: m.toFixed(1) + '%'
              });
            }
          }
        }

        return {
          value: val,
          displayValue: val.toFixed(1) + '% Top-6 Average' + (probStr ? ' (' + probStr + ' Odds)' : ''),
          subjects: subjects
        };
      }
    },

    // 51. Tanzania University Admission Calculator (TCU)
    'tanzania-university-admission-calculator': {
      id: 'tz-uni-admission',
      title: 'Tanzania University Admission Calculator',
      higherIsBetter: true,
      unit: 'Points',
      extract: function () {
        var tcuEl = document.getElementById('tcuValue');
        var val = tcuEl ? parseFloat(tcuEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;
        var coreEl = document.getElementById('coreTwoValue');
        var coreStr = coreEl && coreEl.textContent !== '—' ? coreEl.textContent.trim() : '';
        var benchEl = document.getElementById('benchValue');
        var benchStr = benchEl && benchEl.textContent !== '—' ? benchEl.textContent.trim() : '';

        var gradeWeights = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1, 'S': 0.5, 'F': 0 };
        var subjects = [];
        ['tzSub1', 'tzSub2', 'tzSub3'].forEach(function (subId, idx) {
          var sel = document.getElementById(subId);
          if (sel && sel.value) {
            var g = sel.value.toUpperCase();
            var pts = gradeWeights[g] !== undefined ? gradeWeights[g] : 0;
            subjects.push({
              name: 'ACSEE Subject ' + (idx + 1),
              grade: 'Grade ' + g,
              raw: pts,
              norm: Math.max(0.1, pts / 5),
              display: 'Grade ' + g + ' (' + pts + ' pts)'
            });
          }
        });

        return {
          value: val,
          displayValue: val.toFixed(1) + ' TCU Points' + (coreStr ? ' (Core Pair: ' + coreStr + ')' : '') + (benchStr ? ' [Cut-off: ' + benchStr + ']' : ''),
          subjects: subjects
        };
      }
    },

    // 52. Zambia University Admission Calculator
    'zambia-university-admission-calculator': {
      id: 'zm-uni-admission',
      title: 'Zambia University Admission Calculator',
      higherIsBetter: false, // Zambian Grade 12 Best 5 Aggregate: 5 is best (Distinctions), lower is better
      unit: 'Aggregate',
      extract: function () {
        var bestEl = document.getElementById('best5Value');
        var val = bestEl ? parseFloat(bestEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;
        var creditEl = document.getElementById('creditValue');
        var creditStr = creditEl && creditEl.textContent !== '—' ? creditEl.textContent.trim() : '';
        var benchEl = document.getElementById('benchValue');
        var benchStr = benchEl && benchEl.textContent !== '—' ? benchEl.textContent.trim() : '';

        var subjects = [];
        var inputs = [
          { id: 'zmEnglish', name: 'English Language' },
          { id: 'zmMaths', name: 'Mathematics' },
          { id: 'zmBiology', name: 'Biology' },
          { id: 'zmScience', name: 'Physical Science' },
          { id: 'zmSubj5', name: 'Best Elective 1' },
          { id: 'zmSubj6', name: 'Best Elective 2' },
          { id: 'zmSubj7', name: 'Best Elective 3' }
        ];
        inputs.forEach(function (inp) {
          var sel = document.getElementById(inp.id);
          if (sel && sel.value) {
            var g = parseInt(sel.value, 10);
            if (!isNaN(g)) {
              subjects.push({
                name: inp.name,
                grade: 'Grade ' + g,
                raw: g,
                norm: Math.max(0.1, (10 - g) / 9),
                display: 'Grade ' + g
              });
            }
          }
        });

        return {
          value: val,
          displayValue: 'Aggregate ' + val + (creditStr ? ' (' + creditStr + ' Credits)' : '') + (benchStr ? ' [Cut-off: ' + benchStr + ']' : ''),
          subjects: subjects
        };
      }
    },

    // 53. JAMB Admission Chance Checker
    'jamb-admission-chance-checker': {
      id: 'jamb-admission-chance',
      title: 'JAMB Admission Chance Checker',
      higherIsBetter: true,
      unit: '%',
      extract: function () {
        var probEl = document.getElementById('probHeadline');
        var val = probEl ? parseFloat(probEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;
        var jambScoreInp = document.getElementById('jambScore');
        var postUtmeInp = document.getElementById('postUtme');
        var jambScore = jambScoreInp ? parseFloat(jambScoreInp.value) || 0 : 0;
        var postUtme = postUtmeInp ? parseFloat(postUtmeInp.value) || 0 : 0;
        var aggEl = document.getElementById('aggregateValue');
        var aggStr = aggEl && aggEl.textContent !== '—' ? aggEl.textContent.trim() : '';

        var subjects = [
          {
            name: 'JAMB UTME Score',
            grade: jambScore + ' / 400',
            raw: jambScore,
            norm: Math.min(1.0, Math.max(0.1, jambScore / 400)),
            display: jambScore + ' / 400 (' + ((jambScore / 400) * 100).toFixed(1) + '%)'
          }
        ];
        if (postUtme > 0) {
          subjects.push({
            name: 'Post-UTME Screening Mark',
            grade: postUtme + '%',
            raw: postUtme,
            norm: Math.min(1.0, Math.max(0.1, postUtme / 100)),
            display: postUtme + '%'
          });
        }
        var courseSel = document.getElementById('courseSelect');
        var courseText = courseSel && courseSel.selectedIndex >= 0 ? courseSel.options[courseSel.selectedIndex].text.split('(')[0].trim() : '';
        if (courseText) {
          subjects.push({
            name: 'Target Course Profile',
            grade: val.toFixed(0) + '%',
            raw: val,
            norm: Math.min(1.0, Math.max(0.1, val / 100)),
            display: val.toFixed(0) + '% Chance (' + courseText + ')'
          });
        }

        return {
          value: val,
          displayValue: val.toFixed(0) + '% Estimated Odds' + (aggStr ? ' (Composite: ' + aggStr + ')' : ''),
          subjects: subjects
        };
      }
    }
  };

  function getActiveAdapter() {
    var slug = getPageSlug();
    return adapters[slug] || null;
  }

  // --- LOCAL STORAGE HELPERS ---
  var memoryHistory = {};

  function getHistory(toolId) {
    if (Object.prototype.hasOwnProperty.call(memoryHistory, toolId)) {
      return memoryHistory[toolId];
    }
    try {
      var raw = localStorage.getItem(STORAGE_PREFIX + toolId);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(function (item) {
        return item && typeof item === 'object' &&
          Number.isFinite(Number(item.value)) &&
          Array.isArray(item.subjects);
      }).slice(0, MAX_HISTORY_ITEMS);
    } catch (e) {
      return memoryHistory[toolId] || [];
    }
  }

  function saveHistory(toolId, history) {
    memoryHistory[toolId] = history.slice(0, MAX_HISTORY_ITEMS);
    try {
      localStorage.setItem(STORAGE_PREFIX + toolId, JSON.stringify(memoryHistory[toolId]));
      return true;
    } catch (e) {
      return false;
    }
  }

  function clearHistory(toolId) {
    memoryHistory[toolId] = [];
    try {
      localStorage.removeItem(STORAGE_PREFIX + toolId);
      return true;
    } catch (e) {}
    return false;
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  // Show the subjects actually entered; never add synthetic benchmarks to a result.
  function generateSubjectResultsHtml(subjects) {
    if (!subjects || !subjects.length) {
      return '<p class="afri-subject-results-empty">Subject details are not available for this result.</p>';
    }

    return subjects.map(function (subject) {
      var name = escapeHtml(subject.name || 'Subject');
      var result = escapeHtml(subject.display || subject.grade || 'Recorded');
      return '<div class="afri-subject-result-row" role="listitem">' +
        '<span class="afri-subject-result-name">' + name + '</span>' +
        '<span class="afri-subject-result-value">' + result + '</span>' +
        '</div>';
    }).join('');
  }

  // --- ACADEMIC PROGRESS SECTION UI INJECTION ---
  function injectAcademicProgressSection(adapter) {
    if (document.getElementById('afriAcademicProgress')) return;

    var resultsEl = document.getElementById('results');
    if (!resultsEl) return;

    var container = document.createElement('section');
    container.id = 'afriAcademicProgress';
    container.className = 'afri-academic-progress';
    container.setAttribute('aria-labelledby', 'afriProgTitle');

    container.innerHTML = `
      <div class="afri-prog-header">
        <div class="afri-prog-title-wrap">
          <div class="afri-prog-icon-badge">
            ${icons.cap}
          </div>
          <div>
            <h3 class="afri-prog-title" id="afriProgTitle">Academic Progress</h3>
            <p class="afri-prog-subtitle">Your results stay on this device. Run another calculation whenever you’re ready to compare.</p>
          </div>
        </div>
        <div class="afri-prog-actions">
          <button type="button" class="afri-prog-btn" id="afriProgHistoryBtn" aria-label="View saved calculation history">
            ${icons.history}
            <span>View history</span>
            <span class="afri-prog-badge-count" id="afriProgHistoryBadge">0</span>
          </button>
        </div>
      </div>

      <p class="afri-prog-notice" id="afriProgSaveStatus" role="status" aria-live="polite"></p>

      <div class="afri-prog-body">
        <div class="afri-subject-results-card">
          <span class="afri-card-label">Subjects in this result</span>
          <div class="afri-subject-results-list" id="afriSubjectResultsList" role="list" aria-label="Latest subject results"></div>
        </div>

        <div class="afri-summary-card">
          <div>
            <span class="afri-card-label">Your results over time</span>
            <div class="afri-stat-pair-grid">
              <div class="afri-stat-box highlight">
                <span class="afri-stat-box-label">Latest result</span>
                <span class="afri-stat-box-val accent" id="afriProgLatestVal">—</span>
                <span class="afri-stat-box-sub" id="afriProgLatestSub">This calculation</span>
              </div>
              <div class="afri-stat-box">
                <span class="afri-stat-box-label">Previous result</span>
                <span class="afri-stat-box-val" id="afriProgPrevVal">—</span>
                <span class="afri-stat-box-sub" id="afriProgPrevSub">No earlier result yet</span>
              </div>
            </div>

            <div class="afri-trend-banner baseline" id="afriProgTrendBanner">
              ${icons.dot}
              <span id="afriProgTrendText">Your first result is saved. Complete another calculation to compare.</span>
            </div>
          </div>

          <div class="afri-subject-highlights-grid">
            <div class="afri-subject-highlight strongest">
              <div class="afri-highlight-icon">
                ${icons.star}
              </div>
              <div class="afri-highlight-info">
                  <span class="afri-highlight-tag">Strong subject</span>
                <span class="afri-highlight-name" id="afriProgStrongestName">—</span>
                  <span class="afri-highlight-score" id="afriProgStrongestScore">A good place to build from</span>
              </div>
            </div>
            <div class="afri-subject-highlight weakest">
              <div class="afri-highlight-icon">
                ${icons.target}
              </div>
              <div class="afri-highlight-info">
                  <span class="afri-highlight-tag">Focus for next time</span>
                <span class="afri-highlight-name" id="afriProgWeakestName">—</span>
                  <span class="afri-highlight-score" id="afriProgWeakestScore">A useful place to focus</span>
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
  var historyReturnFocus = null;
  var bodyOverflowBeforeHistory = '';
  var activeHistoryAdapter = null;

  function ensureModalOverlay() {
    var overlay = document.getElementById('afriProgModalOverlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'afriProgModalOverlay';
    overlay.className = 'afri-prog-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'afriProgModalTitle');
    overlay.setAttribute('aria-hidden', 'true');

    overlay.innerHTML = `
      <div class="afri-prog-modal-card">
        <div class="afri-prog-modal-header">
          <div>
            <h3 id="afriProgModalTitle" class="afri-prog-modal-title">Academic Progress History</h3>
            <p class="afri-prog-modal-desc">Saved results stay in this browser on this device.</p>
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
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeHistoryModal();
        return;
      }
      if (e.key === 'Tab') {
        var focusable = Array.prototype.slice.call(overlay.querySelectorAll(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ));
        if (!focusable.length) {
          e.preventDefault();
          return;
        }
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (!overlay.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    var closeBtn = overlay.querySelector('#afriProgModalCloseBtn');
    var doneBtn = overlay.querySelector('#afriProgModalDoneBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeHistoryModal);
    if (doneBtn) doneBtn.addEventListener('click', closeHistoryModal);

    return overlay;
  }

  var clearConfirmTimer = null;

  function resetAcademicClearBtn(clearBtn, hasHistory) {
    if (clearConfirmTimer) {
      clearTimeout(clearConfirmTimer);
      clearConfirmTimer = null;
    }
    if (!clearBtn) return;
    clearBtn.classList.remove('confirming');
    clearBtn.disabled = !hasHistory;
    clearBtn.style.color = '';
    clearBtn.style.borderColor = '';
    clearBtn.style.background = '';
    clearBtn.innerHTML = icons.trash + ' <span>Clear History</span>';
    if (!hasHistory) {
      clearBtn.title = 'No calculation history recorded yet';
    } else {
      clearBtn.removeAttribute('title');
    }
  }

  function openHistoryModal(adapter) {
    var overlay = ensureModalOverlay();
    var listEl = document.getElementById('afriProgHistoryList');
    var clearBtn = document.getElementById('afriProgClearHistoryBtn');
    activeHistoryAdapter = adapter;
    historyReturnFocus = document.activeElement;

    function renderModalList() {
        var history = getHistory(adapter.id);
      resetAcademicClearBtn(clearBtn, history.length > 0);

      if (!history.length) {
        listEl.innerHTML = `
          <div class="afri-history-empty">
            <p class="afri-history-empty-title">No saved results yet</p>
            <p class="afri-history-empty-copy">Complete a calculation above and it will be saved here on this device.</p>
          </div>
        `;
      } else {
        var html = '';
        history.forEach(function (item, idx) {
          var isLatest = idx === 0;
          var dateFormatted = item.dateStr || 'Recent';
          var chipsHtml = (Array.isArray(item.subjects) ? item.subjects : []).map(function (s) {
            return '<span class="afri-history-chip">' + escapeHtml(s.name || 'Subject') + ': ' + escapeHtml(s.display || s.grade || '') + '</span>';
          }).join('');

          var trendBadge = '';
          if (item.trend) {
            var trendColor = item.trend.type === 'improved' ? '#16a34a' : item.trend.type === 'declined' ? '#d97706' : '#6b7280';
            trendBadge = '<span style="font-size:0.75rem;font-weight:700;color:' + trendColor + ';">' + escapeHtml(item.trend.label) + '</span>';
          }

          html += `
            <div class="afri-history-item ${isLatest ? 'latest' : ''}">
              <div class="afri-history-item-top">
                <div class="afri-history-index-wrap">
                  <span class="afri-history-num">Attempt #${history.length - idx} ${isLatest ? '(Latest)' : ''}</span>
                  <span class="afri-history-date">&bull; ${escapeHtml(dateFormatted)}</span>
                </div>
                <div style="display:flex;align-items:center;gap:0.5rem;">
                  ${trendBadge}
                  <span class="afri-history-score-badge">${escapeHtml(item.displayValue)}</span>
                </div>
              </div>
              ${chipsHtml ? '<div class="afri-history-chips">' + chipsHtml + '</div>' : ''}
            </div>
          `;
        });
        listEl.innerHTML = html;
      }
    }

    renderModalList();

    if (clearBtn) {
      clearBtn.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var currentItems = getHistory(adapter.id);
        if (!currentItems.length) {
          clearBtn.innerHTML = '<span>No history to clear</span>';
          setTimeout(function () {
            resetAcademicClearBtn(clearBtn, false);
          }, 1500);
          return;
        }

        if (!clearBtn.classList.contains('confirming')) {
          clearBtn.classList.add('confirming');
          clearBtn.innerHTML = icons.alert + ' <span>Click again to confirm</span>';
          clearBtn.style.background = '#dc2626';
          clearBtn.style.color = '#ffffff';
          clearBtn.style.borderColor = '#b91c1c';
          if (clearConfirmTimer) clearTimeout(clearConfirmTimer);
          clearConfirmTimer = setTimeout(function () {
            resetAcademicClearBtn(clearBtn, getHistory(adapter.id).length > 0);
          }, 4500);
        } else {
          if (clearConfirmTimer) clearTimeout(clearConfirmTimer);
          clearConfirmTimer = null;
          var wasCleared = clearHistory(adapter.id);
          renderModalList();
          updateProgressUI(adapter);
          var saveStatus = document.getElementById('afriProgSaveStatus');
          if (saveStatus) {
            saveStatus.textContent = wasCleared
              ? ''
              : 'History is cleared for this visit, but your browser could not remove the saved copy.';
            saveStatus.setAttribute('data-visible', wasCleared ? 'false' : 'true');
          }

          clearBtn.classList.remove('confirming');
          clearBtn.disabled = true;
          clearBtn.style.background = '#f7faf6';
          clearBtn.style.color = '#315e3b';
          clearBtn.style.borderColor = '#dce9d8';
          clearBtn.innerHTML = icons.check + ' <span>' + (wasCleared ? 'History cleared' : 'Cleared for this visit') + '</span>';

          setTimeout(function () {
            resetAcademicClearBtn(clearBtn, false);
          }, 1800);
        }
      };
    }

    bodyOverflowBeforeHistory = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('open');
    var closeBtn = document.getElementById('afriProgModalCloseBtn');
    if (closeBtn) closeBtn.focus();
  }

  function closeHistoryModal() {
    var overlay = document.getElementById('afriProgModalOverlay');
    var clearBtn = document.getElementById('afriProgClearHistoryBtn');
    if (clearBtn) {
      var history = activeHistoryAdapter ? getHistory(activeHistoryAdapter.id) : [];
      resetAcademicClearBtn(clearBtn, history.length > 0);
    }
    if (overlay) {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = bodyOverflowBeforeHistory;
    if (historyReturnFocus && typeof historyReturnFocus.focus === 'function') {
      historyReturnFocus.focus();
    }
    historyReturnFocus = null;
  }

  // --- CORE PROGRESS RECORDING & UI UPDATE ---
  function computeStrengths(subjects) {
    if (!subjects || !subjects.length) {
      return { strongest: null, weakest: null };
    }
    if (subjects.length === 1) {
      return { strongest: subjects[0], weakest: null };
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
    if (!isResultsVisible(document.getElementById('results'))) return;
    var current = adapter.extract();
    if (!current || isNaN(current.value)) return;

    injectAcademicProgressSection(adapter);
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
        // Many admission aggregates are stronger when the score is lower.
        diff = prev.value - current.value;
      }

      if (diff > 0.001) {
        var diffStr = Number.isInteger(diff) ? diff.toString() : diff.toFixed(2);
        trend = {
          type: 'improved',
          label: 'Improved by ' + diffStr + ' ' + (adapter.unit || 'pts'),
          desc: 'Your result is ' + diffStr + ' ' + (adapter.unit || 'points') +
            (adapter.higherIsBetter ? ' higher' : ' lower') + ' than your previous calculation.'
        };
      } else if (diff < -0.001) {
        var absDiff = Math.abs(diff);
        var diffStr = Number.isInteger(absDiff) ? absDiff.toString() : absDiff.toFixed(2);
        trend = {
          type: 'declined',
          label: (adapter.higherIsBetter ? 'Down by ' : 'Up by ') + diffStr + ' ' + (adapter.unit || 'pts'),
          desc: 'Your result is ' + diffStr + ' ' + (adapter.unit || 'points') +
            (adapter.higherIsBetter
              ? ' lower than your previous calculation.'
              : ' higher than before; lower values are stronger for this tool.')
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
          label: 'Starting point',
          desc: 'Your first result is saved. Complete another calculation to compare.'
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
      var saveStatus = document.getElementById('afriProgSaveStatus');
      if (!saveHistory(adapter.id, history)) {
        if (saveStatus) {
          saveStatus.textContent = 'This result is ready, but your browser did not allow us to save your history. It will remain available until you leave this page.';
          saveStatus.setAttribute('data-visible', 'true');
        }
      } else if (saveStatus) {
        saveStatus.textContent = '';
        saveStatus.setAttribute('data-visible', 'false');
      }
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

    var latestEl = document.getElementById('afriProgLatestVal');
    var latestSub = document.getElementById('afriProgLatestSub');
    var prevEl = document.getElementById('afriProgPrevVal');
    var prevSub = document.getElementById('afriProgPrevSub');
    var trendBanner = document.getElementById('afriProgTrendBanner');
    var subjectList = document.getElementById('afriSubjectResultsList');
    var strName = document.getElementById('afriProgStrongestName');
    var strScore = document.getElementById('afriProgStrongestScore');
    var weakName = document.getElementById('afriProgWeakestName');
    var weakScore = document.getElementById('afriProgWeakestScore');

    if (!history.length) {
      if (latestEl) latestEl.textContent = '—';
      if (latestSub) latestSub.textContent = 'Complete a calculation to begin';
      if (prevEl) prevEl.textContent = '—';
      if (prevSub) prevSub.textContent = 'No earlier result yet';
      if (trendBanner) {
        trendBanner.className = 'afri-trend-banner baseline';
        trendBanner.innerHTML = icons.dot + '<span id="afriProgTrendText"></span>';
        var emptyTrendText = document.getElementById('afriProgTrendText');
        if (emptyTrendText) emptyTrendText.textContent = 'Complete a calculation to start tracking your results.';
      }
      if (subjectList) subjectList.innerHTML = generateSubjectResultsHtml([]);
      if (strName) strName.textContent = '—';
      if (strScore) strScore.textContent = 'Complete a calculation to see your subjects.';
      if (weakName) weakName.textContent = '—';
      if (weakScore) weakScore.textContent = 'Add at least two subjects to compare.';
      return;
    }

    var latest = history[0];
    var prev = history.length > 1 ? history[1] : null;

    if (latestEl) latestEl.textContent = latest.displayValue || '—';
    if (latestSub) latestSub.textContent = latest.dateStr || 'Latest saved result';
    if (prevEl) prevEl.textContent = prev ? (prev.displayValue || '—') : '—';
    if (prevSub) prevSub.textContent = prev ? (prev.dateStr || 'Previous result') : 'Your next calculation will appear here';

    var trendBanner = document.getElementById('afriProgTrendBanner');
    if (trendBanner && latest.trend) {
      var allowedTrendTypes = ['improved', 'declined', 'neutral', 'baseline'];
      var trendType = allowedTrendTypes.indexOf(latest.trend.type) === -1 ? 'baseline' : latest.trend.type;
      var icon = latest.trend.type === 'improved' ? icons.arrowUp :
        latest.trend.type === 'declined' ? icons.arrowDown :
        latest.trend.type === 'neutral' ? icons.equal : icons.dot;

      trendBanner.className = 'afri-trend-banner ' + trendType;
      trendBanner.innerHTML = icon + '<span id="afriProgTrendText"></span>';
      var trendText = document.getElementById('afriProgTrendText');
      if (trendText) trendText.textContent = latest.trend.desc || 'Your latest result is saved.';
    }

    var strengths = computeStrengths(latest.subjects);
    if (strName) strName.textContent = strengths.strongest ? strengths.strongest.name : '—';
    if (strScore) strScore.textContent = strengths.strongest
      ? (strengths.strongest.display || strengths.strongest.grade || 'A good place to build from')
      : 'No subject details were recorded.';
    if (weakName) weakName.textContent = strengths.weakest ? strengths.weakest.name : 'Compare more subjects';
    if (weakScore) weakScore.textContent = strengths.weakest
      ? (strengths.weakest.display || strengths.weakest.grade || 'A useful place to focus')
      : 'Add at least two subjects to see a focus area.';
    if (subjectList) subjectList.innerHTML = generateSubjectResultsHtml(latest.subjects);
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
        scheduleRecord(adapter);
      });
    });

    var calcButtons = document.querySelectorAll('#calcBtn, .btn-primary, [type="submit"], #sampleBtn');
    calcButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        scheduleRecord(adapter);
      });
    });

    // Observer on results visibility or DOM change
    if (resultsEl) {
      var observer = new MutationObserver(function () {
        if (isResultsVisible(resultsEl)) scheduleRecord(adapter);
      });
      observer.observe(resultsEl, { attributes: true, attributeFilter: ['class', 'style'], childList: true, subtree: false });
    }
  }

  onReady(init);
})();
