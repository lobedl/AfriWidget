/**
 * AfriWidget Health Progress Module (health-progress.js)
 *
 * Dedicated in-browser health and wellness progress tracking for AfriWidget calculators.
 * Provides private biometric history, multi-metric radar balance charts,
 * trend comparisons, and clinical benchmark references.
 *
 * Constraints:
 * - 100% In-Browser & LocalStorage (Zero Server Telemetry)
 * - Zero Emojis (Crisp, Accessible Vector SVGs only)
 * - Zero Tailwind (Scoped Vanilla CSS strictly matching AfriWidget brand tokens)
 */

(function () {
  'use strict';

  // SVG Icons (Zero Emojis)
  var icons = {
    heartPulse: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0zM12 12v3m-3-3h6"/></svg>',
    vitalBadge: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
    history: '<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    target: '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke-width="2"/><circle cx="12" cy="12" r="6" stroke-width="2"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>',
    focus: '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
    trendUp: '<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>',
    trendDown: '<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"/></svg>',
    trendStable: '<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/></svg>',
    check: '<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',
    download: '<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>',
    trash: '<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>',
    close: '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
    alert: '<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>',
    dot: '<svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true"><circle cx="4" cy="4" r="3"/></svg>'
  };

  function getPageSlug() {
    var path = window.location.pathname.replace(/^\/|\/$/g, '');
    if (!path) return '';
    var base = path.split('/').pop().replace(/\.html$/, '');
    return base;
  }

  // Scoped CSS styles matching AfriWidget branding
  function injectStyles() {
    if (document.getElementById('afriwidget-health-progress-styles')) return;
    var style = document.createElement('style');
    style.id = 'afriwidget-health-progress-styles';
    style.textContent = `
      .afri-health-progress {
        display: block;
        margin-top: 1.5rem;
        margin-bottom: 1.5rem;
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-radius: 0.875rem;
        padding: 1.125rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        color: #111827;
        box-sizing: border-box;
      }
      .afri-health-progress *, .afri-health-progress *::before, .afri-health-progress *::after {
        box-sizing: border-box;
      }
      @media (min-width: 640px) {
        .afri-health-progress {
          padding: 1.5rem 1.625rem;
        }
      }
      .afri-health-header {
        display: flex;
        flex-direction: column;
        gap: 0.875rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #f3f4f6;
      }
      @media (min-width: 640px) {
        .afri-health-header {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }
      }
      .afri-health-title-wrap {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .afri-health-icon-badge {
        width: 2.375rem;
        height: 2.375rem;
        border-radius: 0.625rem;
        background: #fefce8;
        border: 1px solid #fef08a;
        color: #ca8a04;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .afri-health-title {
        font-size: 1.0625rem;
        font-weight: 800;
        letter-spacing: -0.01em;
        color: #000000;
        margin: 0;
        line-height: 1.25;
      }
      .afri-health-subtitle {
        font-size: 0.8125rem;
        color: #4b5563;
        margin: 0.15rem 0 0;
        line-height: 1.45;
      }
      .afri-health-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .afri-health-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        background: #f9fafb;
        color: #000000;
        border: 1px solid #e5e5e5;
        border-radius: 0.5rem;
        padding: 0.5rem 0.875rem;
        font-size: 0.8125rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.15s ease;
        line-height: 1;
        font-family: inherit;
        text-decoration: none;
      }
      .afri-health-btn:hover {
        background: #fefce8;
        border-color: #facc15;
        color: #000000;
      }
      .afri-health-btn.confirming {
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
      .afri-health-badge-count {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 1.25rem;
        height: 1.25rem;
        padding: 0 0.35rem;
        border-radius: 9999px;
        background: #fefce8;
        border: 1px solid #fef08a;
        color: #ca8a04;
        font-size: 0.6875rem;
        font-weight: 800;
      }

      /* Body Grid */
      .afri-health-body {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.25rem;
        margin-top: 1.25rem;
      }
      @media (min-width: 860px) {
        .afri-health-body {
          grid-template-columns: 330px 1fr;
          align-items: stretch;
        }
      }

      /* Visualizer Card */
      .afri-health-chart-card {
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-radius: 0.75rem;
        padding: 1.125rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .afri-health-card-label {
        font-size: 0.6875rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #6b7280;
        margin-bottom: 0.625rem;
        display: block;
      }
      .afri-health-svg-wrap {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 220px;
      }
      .afri-health-svg-wrap svg {
        max-width: 100%;
        height: auto;
        overflow: visible;
      }

      /* Summary Card */
      .afri-health-summary-card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 1rem;
      }
      .afri-health-stat-pair-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
      }
      @media (min-width: 480px) {
        .afri-health-stat-pair-grid {
          grid-template-columns: 1fr 1fr;
        }
      }
      .afri-health-stat-box {
        background: #f9fafb;
        border: 1px solid #e5e5e5;
        border-radius: 0.75rem;
        padding: 0.875rem 1rem;
      }
      .afri-health-stat-box.highlight {
        background: #fefce8;
        border-color: #facc15;
        box-shadow: 0 1px 3px rgba(250, 204, 21, 0.15);
      }
      .afri-health-stat-box-label {
        font-size: 0.6875rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #6b7280;
        display: block;
        margin-bottom: 0.25rem;
      }
      .afri-health-stat-box-val {
        font-size: 1.35rem;
        font-weight: 900;
        color: #000000;
        line-height: 1.2;
        display: block;
        overflow-wrap: break-word;
        word-break: normal;
      }
      .afri-health-stat-box-val.accent {
        color: #ca8a04;
      }
      .afri-health-stat-box-sub {
        font-size: 0.75rem;
        color: #4b5563;
        display: block;
        margin-top: 0.25rem;
        line-height: 1.35;
      }

      /* Trend Banner */
      .afri-health-trend-banner {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 0.875rem;
        border-radius: 0.5rem;
        font-size: 0.8125rem;
        font-weight: 700;
        line-height: 1.4;
      }
      .afri-health-trend-banner.optimal {
        background: #fefce8;
        border: 1px solid #fef08a;
        color: #854d0e;
      }
      .afri-health-trend-banner.attention {
        background: #fffbeb;
        border: 1px solid #fde68a;
        color: #92400e;
      }
      .afri-health-trend-banner.baseline {
        background: #f9fafb;
        border: 1px solid #e5e5e5;
        color: #4b5563;
      }
      .afri-health-trend-banner.active {
        background: #fafafa;
        border: 1px solid #e5e5e5;
        color: #111827;
      }

      /* Highlights Grid */
      .afri-health-highlights-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }
      @media (min-width: 540px) {
        .afri-health-highlights-grid {
          grid-template-columns: 1fr 1fr;
        }
      }
      .afri-health-highlight-card {
        border: 1px solid #e5e5e5;
        background: #f9fafb;
        border-radius: 0.625rem;
        padding: 0.75rem 0.875rem;
        display: flex;
        gap: 0.625rem;
        align-items: flex-start;
      }
      .afri-health-highlight-card.target-card {
        border-color: #fef08a;
        background: #fefce8;
      }
      .afri-health-highlight-icon {
        width: 1.875rem;
        height: 1.875rem;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        background: #ffffff;
        color: #ca8a04;
        border: 1px solid #fef08a;
      }
      .afri-health-highlight-card.focus-card .afri-health-highlight-icon {
        color: #000000;
        border-color: #e5e5e5;
      }
      .afri-health-highlight-info {
        flex: 1;
        min-width: 0;
      }
      .afri-health-highlight-tag {
        font-size: 0.6875rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #ca8a04;
        display: block;
        line-height: 1.2;
      }
      .afri-health-highlight-name {
        font-size: 0.875rem;
        font-weight: 800;
        color: #000000;
        margin-top: 0.125rem;
        display: block;
        line-height: 1.35;
      }
      .afri-health-highlight-sub {
        font-size: 0.75rem;
        color: #4b5563;
        margin-top: 0.125rem;
        display: block;
        line-height: 1.4;
      }

      /* Biometrics unboxed text bar */
      .afri-health-meta-bar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem 0.75rem;
        padding-top: 0.875rem;
        margin-top: 0.875rem;
        border-top: 1px solid #f3f4f6;
        font-size: 0.75rem;
        color: #4b5563;
        line-height: 1.5;
      }
      .afri-health-meta-item {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
      }
      .afri-health-meta-val {
        font-weight: 700;
        color: #000000;
      }
      .afri-health-meta-sep {
        color: #d1d5db;
      }

      /* History Modal */
      .afri-health-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.72);
        backdrop-filter: blur(2px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        z-index: 99999;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s ease, visibility 0.2s ease;
      }
      .afri-health-modal-overlay.open {
        opacity: 1;
        visibility: visible;
      }
      .afri-health-modal {
        background: #ffffff;
        border-radius: 1rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 640px;
        max-height: 85vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border: 1px solid #e5e5e5;
        transform: translateY(12px);
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .afri-health-modal-overlay.open .afri-health-modal {
        transform: translateY(0);
      }
      .afri-health-modal-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.125rem 1.375rem;
        border-bottom: 1px solid #f3f4f6;
      }
      .afri-health-modal-title {
        font-size: 1.125rem;
        font-weight: 800;
        color: #000000;
        margin: 0;
      }
      .afri-health-modal-sub {
        font-size: 0.75rem;
        color: #4b5563;
        margin-top: 0.125rem;
      }
      .afri-health-modal-close {
        background: #ffffff;
        border: 1px solid #e5e5e5;
        color: #4b5563;
        cursor: pointer;
        padding: 0.35rem;
        border-radius: 0.375rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s ease;
      }
      .afri-health-modal-close:hover {
        background: #000000;
        color: #ffffff;
      }
      .afri-health-modal-body {
        padding: 1.125rem 1.25rem;
        overflow-y: auto;
        flex: 1;
      }
      .afri-health-history-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5rem;
        margin-bottom: 1rem;
      }
      .afri-health-hstat-box {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        padding: 0.5rem 0.375rem;
        text-align: center;
        min-width: 0;
      }
      .afri-health-hstat-label {
        font-size: 0.625rem;
        font-weight: 700;
        text-transform: uppercase;
        color: #6b7280;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        letter-spacing: 0.03em;
      }
      .afri-health-hstat-val {
        font-size: 1rem;
        font-weight: 900;
        color: #000000;
        margin-top: 0.125rem;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* Mobile-first History Cards */
      .afri-health-cards-wrap {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        box-sizing: border-box;
        width: 100%;
      }
      .afri-health-card-item {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 0.75rem;
        padding: 0.875rem 1rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
        text-align: left;
        box-sizing: border-box;
        word-break: normal;
        overflow-wrap: break-word;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }
      .afri-health-card-item:hover {
        border-color: #facc15;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07);
      }
      .afri-health-card-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
      }
      .afri-health-card-title {
        font-size: 0.9375rem;
        font-weight: 800;
        color: #111827;
        margin: 0;
        line-height: 1.3;
        letter-spacing: -0.01em;
      }
      .afri-health-card-val {
        font-size: 1.5rem;
        font-weight: 900;
        color: #ca8a04;
        line-height: 1.2;
        letter-spacing: -0.02em;
        font-feature-settings: "tnum";
        font-variant-numeric: tabular-nums;
      }
      .afri-health-card-status-badge {
        display: inline-flex;
        align-items: center;
        align-self: flex-start;
        padding: 0.2rem 0.55rem;
        border-radius: 0.375rem;
        font-size: 0.75rem;
        font-weight: 700;
        background: #fef9c3;
        color: #854d0e;
        border: 1px solid #fde047;
        line-height: 1.2;
      }
      .afri-health-card-meta {
        font-size: 0.75rem;
        color: #6b7280;
        font-weight: 500;
        line-height: 1.3;
        display: flex;
        align-items: center;
        gap: 0.375rem;
      }
      .afri-health-card-details {
        background: #f9fafb;
        border: 1px solid #f3f4f6;
        border-radius: 0.5rem;
        padding: 0.5rem 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        margin-top: 0.15rem;
      }
      .afri-health-card-detail-row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        font-size: 0.8125rem;
        gap: 0.75rem;
        line-height: 1.35;
      }
      .afri-health-card-detail-key {
        color: #4b5563;
        font-weight: 600;
        white-space: nowrap;
      }
      .afri-health-card-detail-val {
        color: #111827;
        font-weight: 700;
        text-align: right;
        word-break: normal;
      }

      /* Desktop Table View */
      .afri-health-table-wrap {
        display: none;
      }
      @media (min-width: 641px) {
        .afri-health-cards-wrap {
          display: none;
        }
        .afri-health-table-wrap {
          display: block;
          border: 1px solid #e5e5e5;
          border-radius: 0.625rem;
          overflow-x: auto;
        }
      }
      .afri-health-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.8125rem;
        text-align: left;
      }
      .afri-health-table th {
        background: #f9fafb;
        padding: 0.625rem 0.875rem;
        font-size: 0.6875rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: #4b5563;
        border-bottom: 1px solid #e5e5e5;
      }
      .afri-health-table td {
        padding: 0.625rem 0.875rem;
        border-bottom: 1px solid #f3f4f6;
        color: #111827;
      }
      .afri-health-table tr:last-child td {
        border-bottom: none;
      }
      .afri-health-table td.val-cell {
        font-weight: 800;
        color: #ca8a04;
      }
      .afri-health-empty {
        text-align: center;
        padding: 2.5rem 1rem;
        color: #6b7280;
        font-size: 0.875rem;
      }
      .afri-health-modal-foot {
        padding: 0.875rem 1.25rem;
        border-top: 1px solid #f3f4f6;
        background: #fafafa;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        flex-wrap: wrap;
      }
      .afri-health-modal-foot-actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        align-items: center;
      }
      @media (max-width: 480px) {
        .afri-health-modal-foot {
          flex-direction: column-reverse;
          align-items: stretch;
          gap: 0.5rem;
        }
        .afri-health-modal-foot-actions {
          display: flex;
          gap: 0.5rem;
        }
        .afri-health-modal-foot-actions .afri-health-btn,
        .afri-health-modal-foot > .afri-health-btn {
          flex: 1;
          justify-content: center;
          text-align: center;
        }
      }
      @media (max-width: 640px) {
        .afri-health-progress {
          padding: 1.125rem 1rem;
          margin-top: 1.25rem;
          margin-bottom: 1.25rem;
        }
        .afri-health-title {
          font-size: 1.0625rem;
          line-height: 1.25;
          letter-spacing: -0.01em;
          word-break: normal;
        }
        .afri-health-subtitle {
          font-size: 0.75rem;
          line-height: 1.45;
          color: #4b5563;
          word-break: normal;
        }
        .afri-health-stat-box {
          padding: 0.75rem 0.875rem;
        }
        .afri-health-stat-box-val {
          font-size: 1.1875rem;
          line-height: 1.25;
          word-break: normal;
          overflow-wrap: break-word;
        }
        .afri-health-stat-box-sub {
          font-size: 0.6875rem;
          line-height: 1.35;
        }
        .afri-health-trend-banner {
          font-size: 0.75rem;
          padding: 0.5rem 0.75rem;
          line-height: 1.4;
          word-break: normal;
        }
        .afri-health-highlight-name {
          font-size: 0.8125rem;
          line-height: 1.35;
          word-break: normal;
        }
      }
      @media print {
        .afri-health-progress, #afriHealthProgress, .afri-health-modal-overlay {
          display: none !important;
          visibility: hidden !important;
          height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // 9 Health Adapters
  var adapters = {
    // 1. BMI, BMR & TDEE Calculator
    'bmi-calculator': {
      id: 'bmi-calc',
      title: 'BMI, BMR & TDEE Calculator',
      primaryLabel: 'Body Mass Index',
      unit: 'kg/m²',
      extract: function () {
        var bmiEl = document.getElementById('bmiValue');
        var val = bmiEl ? parseFloat(bmiEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;

        var badgeEl = document.getElementById('bmiBadge');
        var badgeText = badgeEl ? badgeEl.textContent.trim() : '';
        var bmrEl = document.getElementById('bmrValue');
        var tdeeEl = document.getElementById('tdeeValue');
        var healthyEl = document.getElementById('healthyRange');
        var primeEl = document.getElementById('bmiPrime');

        var bmrVal = bmrEl ? parseFloat(bmrEl.textContent.replace(/[^0-9.]/g, '')) || 0 : 0;
        var tdeeVal = tdeeEl ? parseFloat(tdeeEl.textContent.replace(/[^0-9.]/g, '')) || 0 : 0;
        var primeVal = primeEl ? parseFloat(primeEl.textContent.replace(/[^0-9.]/g, '')) || 1.0 : 1.0;

        var normBmi = Math.min(1.0, Math.max(0.2, val < 18.5 ? (val / 18.5) * 0.7 : (val <= 25 ? 0.85 : Math.max(0.3, 1.0 - (val - 25) * 0.04))));

        var metrics = [
          { name: 'BMI Score', value: val.toFixed(1) + ' kg/m²', raw: val, norm: normBmi },
          { name: 'BMI Prime', value: primeVal.toFixed(2), raw: primeVal, norm: Math.min(1.0, Math.max(0.2, 1.0 - Math.abs(1.0 - primeVal))) },
          { name: 'Basal BMR', value: (bmrVal ? bmrVal.toLocaleString() : '1,650') + ' kcal', raw: bmrVal, norm: 0.75 },
          { name: 'Active TDEE', value: (tdeeVal ? tdeeVal.toLocaleString() : '2,200') + ' kcal', raw: tdeeVal, norm: 0.82 },
          { name: 'Healthy Range', value: healthyEl ? healthyEl.textContent.trim() : '18.5 – 24.9', raw: 21.7, norm: 0.90 }
        ];

        return {
          value: val,
          displayValue: val.toFixed(1) + ' kg/m²' + (badgeText ? ' (' + badgeText + ')' : ''),
          status: badgeText || 'Normal Weight',
          target: healthyEl ? healthyEl.textContent.trim() + ' (WHO 18.5–24.9)' : '18.5 – 24.9 kg/m²',
          focus: val < 18.5 ? 'Gradual calorie surplus with strength resistance' : (val > 25 ? 'Moderate 300–500 kcal daily deficit with walking' : 'Maintain balanced energy intake and habitual movement'),
          metrics: metrics
        };
      }
    },

    // 2. Body Fat Calculator (US Navy tape method)
    'body-fat-calculator': {
      id: 'body-fat-calc',
      title: 'Body Fat Calculator',
      primaryLabel: 'Body Fat Percentage',
      unit: '%',
      extract: function () {
        var bfEl = document.getElementById('bfValue');
        var val = bfEl ? parseFloat(bfEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;

        var catEl = document.getElementById('bfCategory');
        var catText = catEl && catEl.textContent !== '—' ? catEl.textContent.trim() : '';
        var whtrEl = document.getElementById('whtrValue');
        var wntrEl = document.getElementById('wntrValue');

        var whtr = whtrEl ? parseFloat(whtrEl.textContent) || 0.46 : 0.46;
        var wntr = wntrEl ? parseFloat(wntrEl.textContent) || 0.42 : 0.42;

        var normBf = Math.min(1.0, Math.max(0.2, val <= 10 ? 0.9 : (val <= 20 ? 0.85 : Math.max(0.25, 1.0 - (val - 20) * 0.03))));

        var metrics = [
          { name: 'Body Fat %', value: val.toFixed(1) + '%', raw: val, norm: normBf },
          { name: 'Waist-to-Height', value: whtr.toFixed(2), raw: whtr, norm: Math.min(1.0, Math.max(0.2, 1.0 - Math.abs(0.48 - whtr))) },
          { name: 'Waist-to-Neck', value: wntr.toFixed(2), raw: wntr, norm: 0.78 },
          { name: 'Body Composition', value: catText || 'Fitness', raw: 1, norm: 0.85 },
          { name: 'Lean Mass Ratio', value: (100 - val).toFixed(1) + '%', raw: (100 - val), norm: Math.min(1.0, (100 - val) / 100) }
        ];

        return {
          value: val,
          displayValue: val.toFixed(1) + '%' + (catText ? ' (' + catText + ')' : ''),
          status: catText || 'Fitness Reference',
          target: '14% – 24% Recommended Range',
          focus: 'Preserve lean muscle tissue with progressive resistance and adequate protein',
          metrics: metrics
        };
      }
    },

    // 3. Daily Calorie Needs Calculator (BMR & TDEE)
    'daily-calorie-needs-calculator': {
      id: 'daily-calorie-needs',
      title: 'Daily Calorie Needs Calculator',
      primaryLabel: 'Maintenance Calories',
      unit: 'kcal/day',
      extract: function () {
        var tdeeEl = document.getElementById('tdeeValue');
        var val = tdeeEl ? parseFloat(tdeeEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;

        var bmrEl = document.getElementById('bmrValue');
        var rangeEl = document.getElementById('rangeValue');
        var bmr = bmrEl ? parseFloat(bmrEl.textContent.replace(/[^0-9.]/g, '')) || 0 : 0;
        var rangeText = rangeEl && rangeEl.textContent !== '—' ? rangeEl.textContent.trim() : '';

        var metrics = [
          { name: 'Maintenance TDEE', value: val.toLocaleString() + ' kcal', raw: val, norm: 0.85 },
          { name: 'Basal BMR', value: (bmr ? bmr.toLocaleString() : '1,620') + ' kcal', raw: bmr, norm: 0.70 },
          { name: 'Gentle Deficit', value: (val > 500 ? (val - 400).toLocaleString() : '—') + ' kcal', raw: val - 400, norm: 0.65 },
          { name: 'Muscle Surplus', value: (val + 300).toLocaleString() + ' kcal', raw: val + 300, norm: 0.78 },
          { name: 'Energy Balance', value: 'Balanced', raw: 1, norm: 0.88 }
        ];

        return {
          value: val,
          displayValue: val.toLocaleString() + ' kcal/day (Maintenance)',
          status: 'Maintenance Baseline',
          target: rangeText ? rangeText + ' (Target Range)' : val.toLocaleString() + ' kcal/day',
          focus: 'Target ~' + (val - 400).toLocaleString() + ' kcal/day for fat loss or ~' + (val + 300).toLocaleString() + ' kcal/day for lean mass gain',
          metrics: metrics
        };
      }
    },

    // 4. Healthy Weight Range Calculator
    'healthy-weight-range-calculator': {
      id: 'healthy-weight-range',
      title: 'Healthy Weight Range Calculator',
      primaryLabel: 'Healthy Weight Span',
      unit: 'Weight',
      extract: function () {
        var rangeEl = document.getElementById('rangeBig');
        var rangeText = rangeEl ? rangeEl.textContent.trim() : '';
        if (!rangeText || rangeText === '—') return null;

        var midEl = document.getElementById('midVal');
        var lowerEl = document.getElementById('lowerVal');
        var upperEl = document.getElementById('upperVal');
        var widthEl = document.getElementById('widthVal');

        var midVal = midEl ? parseFloat(midEl.textContent.replace(/[^0-9.]/g, '')) || 0 : 0;
        var lowerVal = lowerEl ? parseFloat(lowerEl.textContent.replace(/[^0-9.]/g, '')) || 0 : 0;
        var upperVal = upperEl ? parseFloat(upperEl.textContent.replace(/[^0-9.]/g, '')) || 0 : 0;

        var metrics = [
          { name: 'Midpoint (BMI 21.7)', value: midEl ? midEl.textContent.trim() : '66.2 kg', raw: midVal, norm: 0.88 },
          { name: 'Lower (BMI 18.5)', value: lowerEl ? lowerEl.textContent.trim() : '56.4 kg', raw: lowerVal, norm: 0.72 },
          { name: 'Upper (BMI 24.9)', value: upperEl ? upperEl.textContent.trim() : '75.9 kg', raw: upperVal, norm: 0.72 },
          { name: 'Healthy Span', value: widthEl ? widthEl.textContent.trim() : '19.5 kg', raw: upperVal - lowerVal, norm: 0.80 },
          { name: 'Standard', value: 'WHO Adult BMI', raw: 1, norm: 0.90 }
        ];

        return {
          value: midVal || 66.2,
          displayValue: rangeText + ' (Mid: ' + (midEl ? midEl.textContent.trim() : '66.2') + ')',
          status: 'WHO 18.5 – 24.9 BMI Span',
          target: 'Midpoint Stature Reference: ' + (midEl ? midEl.textContent.trim() : 'Midpoint'),
          focus: 'Stabilize body weight within this healthy clinical window for your height',
          metrics: metrics
        };
      }
    },

    // 5. Ideal Weight Calculator
    'ideal-weight-calculator': {
      id: 'ideal-weight-calc',
      title: 'Ideal Weight Calculator',
      primaryLabel: 'Ideal Weight Consensus',
      unit: 'Weight',
      extract: function () {
        var rangeEl = document.getElementById('rangeBig');
        var rangeText = rangeEl ? rangeEl.textContent.trim() : '';
        if (!rangeText || rangeText === '—') return null;

        var devineEl = document.getElementById('devineVal');
        var robinsonEl = document.getElementById('robinsonVal');
        var millerEl = document.getElementById('millerVal');
        var hamwiEl = document.getElementById('hamwiVal');

        var devine = devineEl ? parseFloat(devineEl.textContent.replace(/[^0-9.]/g, '')) || 0 : 0;
        var robinson = robinsonEl ? parseFloat(robinsonEl.textContent.replace(/[^0-9.]/g, '')) || 0 : 0;
        var miller = millerEl ? parseFloat(millerEl.textContent.replace(/[^0-9.]/g, '')) || 0 : 0;
        var hamwi = hamwiEl ? parseFloat(hamwiEl.textContent.replace(/[^0-9.]/g, '')) || 0 : 0;

        var avg = (devine + robinson + miller + hamwi) / (devine ? 4 : 1);

        var metrics = [
          { name: 'Devine Formula', value: devineEl ? devineEl.textContent.trim() : '68.2 kg', raw: devine, norm: 0.85 },
          { name: 'Robinson Formula', value: robinsonEl ? robinsonEl.textContent.trim() : '66.5 kg', raw: robinson, norm: 0.80 },
          { name: 'Miller Formula', value: millerEl ? millerEl.textContent.trim() : '65.2 kg', raw: miller, norm: 0.78 },
          { name: 'Hamwi Formula', value: hamwiEl ? hamwiEl.textContent.trim() : '71.0 kg', raw: hamwi, norm: 0.82 },
          { name: 'Multi-Formula Consensus', value: avg.toFixed(1) + ' kg', raw: avg, norm: 0.90 }
        ];

        return {
          value: avg || devine,
          displayValue: rangeText + ' (Consensus Avg: ' + avg.toFixed(1) + ')',
          status: 'Clinical Formula Consensus',
          target: 'Devine Standard: ' + (devineEl ? devineEl.textContent.trim() : '68.2 kg'),
          focus: 'Consider body frame size, bone density, and athletic muscle percentage',
          metrics: metrics
        };
      }
    },

    // 6. Water Intake Calculator
    'water-intake-calculator': {
      id: 'water-intake-calc',
      title: 'Water Intake Calculator',
      primaryLabel: 'Daily Hydration Goal',
      unit: 'L/day',
      extract: function () {
        var litEl = document.getElementById('litresValue');
        var val = litEl ? parseFloat(litEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;

        var mlEl = document.getElementById('mlValue');
        var bottlesEl = document.getElementById('bottlesValue');
        var mlVal = mlEl ? parseFloat(mlEl.textContent.replace(/[^0-9.]/g, '')) || (val * 1000) : (val * 1000);

        var metrics = [
          { name: 'Daily Litres', value: val.toFixed(1) + ' L', raw: val, norm: Math.min(1.0, val / 3.5) },
          { name: 'Millilitres', value: mlVal.toLocaleString() + ' mL', raw: mlVal, norm: 0.80 },
          { name: '500 mL Bottles', value: bottlesEl ? bottlesEl.textContent.trim() : (val * 2).toFixed(1), raw: val * 2, norm: 0.75 },
          { name: 'Exercise Adjustment', value: 'Included', raw: 1, norm: 0.85 },
          { name: 'Climate Factor', value: 'Adjusted', raw: 1, norm: 0.80 }
        ];

        return {
          value: val,
          displayValue: val.toFixed(1) + ' L / day (' + (bottlesEl ? bottlesEl.textContent.trim() : '') + ')',
          status: 'Optimal Hydration Target',
          target: val.toFixed(1) + ' Litres / Day Baseline',
          focus: 'Pace fluids throughout waking hours and increase intake during exercise or heat',
          metrics: metrics
        };
      }
    },

    // 7. Hydration Reminder Calculator
    'hydration-reminder-calculator': {
      id: 'hydration-reminder-calc',
      title: 'Hydration Reminder Calculator',
      primaryLabel: 'Hydration Pacing Schedule',
      unit: 'Schedule',
      extract: function () {
        var bigEl = document.getElementById('reminderBig');
        var bigText = bigEl ? bigEl.textContent.trim() : '';
        if (!bigText || bigText === '—') return null;

        var countEl = document.getElementById('countVal');
        var servingMlEl = document.getElementById('servingMlVal');
        var windowEl = document.getElementById('windowVal');

        var servings = countEl ? parseFloat(countEl.textContent.replace(/[^0-9.]/g, '')) || 8 : 8;
        var ml = servingMlEl ? parseFloat(servingMlEl.textContent.replace(/[^0-9.]/g, '')) || 250 : 250;

        var metrics = [
          { name: 'Serving Volume', value: servingMlEl ? servingMlEl.textContent.trim() : '250 mL', raw: ml, norm: 0.75 },
          { name: 'Daily Servings', value: countEl ? countEl.textContent.trim() : '8 servings', raw: servings, norm: 0.85 },
          { name: 'Waking Window', value: windowEl ? windowEl.textContent.trim() : '14 hours', raw: 14, norm: 0.80 },
          { name: 'Pacing Frequency', value: bigText, raw: 1, norm: 0.90 }
        ];

        return {
          value: servings,
          displayValue: bigText + ' (' + (countEl ? countEl.textContent.trim() : '') + ')',
          status: 'Structured Pacing Schedule',
          target: (countEl ? countEl.textContent.trim() : '8 servings') + ' of ' + (servingMlEl ? servingMlEl.textContent.trim() : '250 mL'),
          focus: 'Consistent intake prevents mid-day fatigue and optimizes kidney filtration',
          metrics: metrics
        };
      }
    },

    // 8. Ovulation & Cycle Calculator
    'ovulation-cycle-calculator': {
      id: 'ovulation-cycle-calc',
      title: 'Ovulation & Cycle Calculator',
      primaryLabel: 'Cycle Fertility Window',
      unit: 'Cycle',
      extract: function () {
        var peakEl = document.getElementById('ovulationPeak');
        var peakText = peakEl ? peakEl.textContent.trim() : '';
        if (!peakText || peakText === '—') return null;

        var fertileEl = document.getElementById('fertileWindow');
        var nextEl = document.getElementById('nextPeriod');
        var fertileText = fertileEl ? fertileEl.textContent.trim() : '';
        var nextText = nextEl ? nextEl.textContent.trim() : '';

        var cycleLenInp = document.getElementById('cycleLength');
        var cycleLen = cycleLenInp ? parseInt(cycleLenInp.value, 10) || 28 : 28;

        var metrics = [
          { name: 'Cycle Length', value: cycleLen + ' days', raw: cycleLen, norm: 0.80 },
          { name: 'Peak Ovulation', value: peakText, raw: 14, norm: 0.95 },
          { name: 'Fertile Window', value: fertileText, raw: 6, norm: 0.88 },
          { name: 'Next Period', value: nextText, raw: 28, norm: 0.82 }
        ];

        return {
          value: cycleLen,
          displayValue: 'Peak: ' + peakText + ' · Fertile: ' + fertileText,
          status: 'Fertility Window Tracked',
          target: 'Peak Ovulation Date: ' + peakText,
          focus: 'Highest conception probability occurs within the 5 days prior to ovulation and day of peak',
          metrics: metrics
        };
      }
    },

    // 9. Calorie Burn Calculator (MET-based)
    'calorie-burn-calculator': {
      id: 'calorie-burn-calc',
      title: 'Calorie Burn Calculator',
      primaryLabel: 'Exercise Calorie Burn',
      unit: 'kcal',
      extract: function () {
        var totalEl = document.getElementById('totalBurn');
        var val = totalEl ? parseFloat(totalEl.textContent.trim().replace(/[^0-9.]/g, '')) : NaN;
        if (isNaN(val)) return null;

        var rateEl = document.getElementById('rateValue');
        var metEl = document.getElementById('metValue');
        var rateVal = rateEl ? parseFloat(rateEl.textContent.replace(/[^0-9.]/g, '')) || 0 : 0;
        var metVal = metEl ? parseFloat(metEl.textContent.replace(/[^0-9.]/g, '')) || 6.0 : 6.0;

        var metrics = [
          { name: 'Total Burned', value: val.toLocaleString() + ' kcal', raw: val, norm: Math.min(1.0, val / 600) },
          { name: 'Burn Rate', value: (rateVal ? rateVal.toLocaleString() : '500') + ' kcal/hr', raw: rateVal, norm: 0.82 },
          { name: 'MET Intensity', value: (metEl ? metEl.textContent.trim() : '6.0 MET'), raw: metVal, norm: Math.min(1.0, metVal / 12.0) },
          { name: 'Energy Expenditure', value: 'Vigorous', raw: 1, norm: 0.85 }
        ];

        return {
          value: val,
          displayValue: val.toLocaleString() + ' kcal (' + (rateEl ? rateEl.textContent.trim() : '') + ')',
          status: metEl ? metEl.textContent.trim() : 'Active Energy Expenditure',
          target: 'Active Exercise Energy: ' + val.toLocaleString() + ' kcal',
          focus: 'Rehydrate with 500 mL water per hour of vigorous physical activity',
          metrics: metrics
        };
      }
    }
  };

  function getActiveAdapter() {
    var slug = getPageSlug();
    if (adapters[slug]) return adapters[slug];
    for (var key in adapters) {
      if (window.location.pathname.indexOf(key) !== -1) {
        return adapters[key];
      }
    }
    return null;
  }

  // LocalStorage Helpers
  function getHistoryKey(adapterId) {
    return 'afri_health_history_' + adapterId;
  }

  function getHistory(adapterId) {
    try {
      var raw = localStorage.getItem(getHistoryKey(adapterId));
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveHistory(adapterId, history) {
    try {
      localStorage.setItem(getHistoryKey(adapterId), JSON.stringify(history.slice(0, 50)));
    } catch (e) {
      // Storage full or private mode
    }
  }

  function clearHistory(adapterId) {
    try {
      localStorage.removeItem(getHistoryKey(adapterId));
    } catch (e) {}
  }

  // Generate Polished Biometric Dynamic SVG Chart
  function generateBiometricSvg(metrics, adapter) {
    if (!metrics || metrics.length < 3) {
      metrics = [
        { name: 'Biometric Balance', raw: 75, norm: 0.75 },
        { name: 'Clinical Standard', raw: 80, norm: 0.80 },
        { name: 'Target Alignment', raw: 85, norm: 0.85 },
        { name: 'Energy Stability', raw: 70, norm: 0.70 }
      ];
    }

    var sizeX = 320;
    var sizeY = 270;
    var cx = 160;
    var cy = 135;
    var radius = 78;
    var n = metrics.length;
    var angleStep = (2 * Math.PI) / n;

    var rings = [0.33, 0.66, 1.0];
    var gridPaths = rings.map(function (scale) {
      var pts = [];
      for (var i = 0; i < n; i++) {
        var angle = i * angleStep - Math.PI / 2;
        var r = radius * scale;
        var x = (cx + r * Math.cos(angle)).toFixed(1);
        var y = (cy + r * Math.sin(angle)).toFixed(1);
        pts.push(x + ',' + y);
      }
      var isOuter = scale === 1.0;
      return '<polygon points="' + pts.join(' ') + '" fill="' + (isOuter ? '#ffffff' : 'none') + '" stroke="' + (isOuter ? '#d1d5db' : '#e5e7eb') + '" stroke-width="' + (isOuter ? '1.5' : '1') + '" ' + (isOuter ? '' : 'stroke-dasharray="3,3"') + ' />';
    }).join('');

    var axes = [];
    var labels = [];
    var polyPoints = [];

    for (var i = 0; i < n; i++) {
      var angle = i * angleStep - Math.PI / 2;
      var cosA = Math.cos(angle);
      var sinA = Math.sin(angle);

      // Axis line
      var xEnd = (cx + radius * cosA).toFixed(1);
      var yEnd = (cy + radius * sinA).toFixed(1);
      axes.push('<line x1="' + cx + '" y1="' + cy + '" x2="' + xEnd + '" y2="' + yEnd + '" stroke="#e5e7eb" stroke-width="1" />');

      // Value point
      var norm = typeof metrics[i].norm === 'number' ? Math.max(0.18, Math.min(1.0, metrics[i].norm)) : 0.7;
      var valR = radius * norm;
      var px = (cx + valR * cosA).toFixed(1);
      var py = (cy + valR * sinA).toFixed(1);
      polyPoints.push(px + ',' + py);

      // Label positioning
      var labelR = radius + 22;
      var lx = (cx + labelR * cosA).toFixed(1);
      var ly = (cy + labelR * sinA).toFixed(1);
      var textAnchor = 'middle';
      if (cosA > 0.28) textAnchor = 'start';
      else if (cosA < -0.28) textAnchor = 'end';

      var dy = '4';
      if (sinA < -0.65) dy = '-4';
      else if (sinA > 0.65) dy = '12';

      var name = metrics[i].name;
      if (name.length > 15) name = name.substring(0, 13) + '…';

      labels.push('<text x="' + lx + '" y="' + ly + '" dy="' + dy + '" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" font-weight="700" fill="#111827" text-anchor="' + textAnchor + '">' + escapeXml(name) + '</text>');
    }

    var polySvg = '<polygon points="' + polyPoints.join(' ') + '" fill="rgba(250, 204, 21, 0.38)" stroke="#ca8a04" stroke-width="2.4" stroke-linejoin="round" />';

    var circles = polyPoints.map(function (pt) {
      var coords = pt.split(',');
      return '<circle cx="' + coords[0] + '" cy="' + coords[1] + '" r="3.5" fill="#000000" stroke="#facc15" stroke-width="2" />';
    }).join('');

    return `
      <svg viewBox="0 0 ${sizeX} ${sizeY}" width="100%" height="220" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Biometric Target Balance Radar">
        <title>Biometric Balance Visualizer</title>
        ${gridPaths}
        ${axes.join('')}
        ${polySvg}
        ${circles}
        ${labels.join('')}
      </svg>
    `;
  }

  function escapeXml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Ensure Health Progress comes BEFORE the share buttons
  function ensureHealthProgressBeforeShareBar() {
    var healthProg = document.getElementById('afriHealthProgress');
    var shareBar = document.getElementById('afriShareBar');
    var donationCard = document.getElementById('afriDonationCard');
    if (healthProg && shareBar && healthProg.parentNode) {
      if (healthProg.nextElementSibling !== shareBar) {
        healthProg.insertAdjacentElement('afterend', shareBar);
      }
    }
    if (shareBar && donationCard && shareBar.parentNode) {
      if (shareBar.nextElementSibling !== donationCard) {
        shareBar.insertAdjacentElement('afterend', donationCard);
      }
    }
  }

  // Inject the component into the page
  function injectHealthProgressSection(adapter) {
    var existing = document.getElementById('afriHealthProgress');
    if (existing) {
      ensureHealthProgressBeforeShareBar();
      return;
    }

    var resultsEl = document.getElementById('results') || document.querySelector('.results') || document.getElementById('cfResults');
    if (!resultsEl) return;

    var container = document.createElement('section');
    container.id = 'afriHealthProgress';
    container.className = 'afri-health-progress';
    container.setAttribute('aria-label', 'Health & Wellness Progress');
    container.innerHTML = `
      <div class="afri-health-header">
        <div class="afri-health-title-wrap">
          <div class="afri-health-icon-badge">
            ${icons.vitalBadge}
          </div>
          <div>
            <h3 class="afri-health-title">Health Progress</h3>
            <p class="afri-health-subtitle">Private in-browser biometric logs, wellness trends, and healthy targets</p>
          </div>
        </div>
        <div class="afri-health-actions">
          <button type="button" class="afri-health-btn" id="afriHealthHistoryBtn" aria-label="View biometric history">
            ${icons.history}
            <span>View History</span>
            <span class="afri-health-badge-count" id="afriHealthHistoryBadge">0</span>
          </button>
        </div>
      </div>

      <div class="afri-health-body">
        <!-- Visualizer Card -->
        <div class="afri-health-chart-card">
          <span class="afri-health-card-label">Biometric Balance Visualizer</span>
          <div class="afri-health-svg-wrap" id="afriHealthChartWrap">
            <!-- Dynamic SVG injected here -->
          </div>
        </div>

        <!-- Summary Card -->
        <div class="afri-health-summary-card">
          <div>
            <span class="afri-health-card-label">Biometric Progress</span>
            <div class="afri-health-stat-pair-grid">
              <div class="afri-health-stat-box highlight">
                <span class="afri-health-stat-box-label">Latest Logged Reading</span>
                <span class="afri-health-stat-box-val accent" id="afriHealthLatestVal">—</span>
                <span class="afri-health-stat-box-sub" id="afriHealthLatestSub">Current calculation</span>
              </div>
              <div class="afri-health-stat-box">
                <span class="afri-health-stat-box-label">Previous Reading</span>
                <span class="afri-health-stat-box-val" id="afriHealthPrevVal">—</span>
                <span class="afri-health-stat-box-sub" id="afriHealthPrevSub">Prior attempt</span>
              </div>
            </div>

            <div class="afri-health-trend-banner baseline" id="afriHealthTrendBanner">
              ${icons.dot}
              <span id="afriHealthTrendText">Baseline reading recorded</span>
            </div>
          </div>

          <div class="afri-health-highlights-grid">
            <div class="afri-health-highlight-card target-card">
              <div class="afri-health-highlight-icon">
                ${icons.target}
              </div>
              <div class="afri-health-highlight-info">
                <span class="afri-health-highlight-tag">Primary Healthy Target</span>
                <span class="afri-health-highlight-name" id="afriHealthTargetName">—</span>
                <span class="afri-health-highlight-sub" id="afriHealthTargetSub">Clinical benchmark reference</span>
              </div>
            </div>

            <div class="afri-health-highlight-card focus-card">
              <div class="afri-health-highlight-icon">
                ${icons.focus}
              </div>
              <div class="afri-health-highlight-info">
                <span class="afri-health-highlight-tag">Actionable Focus</span>
                <span class="afri-health-highlight-name" id="afriHealthFocusName">—</span>
                <span class="afri-health-highlight-sub" id="afriHealthFocusSub">Personalized lifestyle guidance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Biometric Metadata Bar -->
      <div class="afri-health-meta-bar" id="afriHealthMetaBar" style="display: none;">
        <!-- Clean unboxed metadata items injected here -->
      </div>
    `;

    // In health tools, Health Progress comes BEFORE the share buttons and before .ai-section
    var shareBar = document.getElementById('afriShareBar');
    var aiSec = resultsEl.querySelector('.ai-section');
    if (shareBar && shareBar.parentNode === resultsEl) {
      resultsEl.insertBefore(container, shareBar);
    } else if (aiSec && aiSec.parentNode === resultsEl) {
      resultsEl.insertBefore(container, aiSec);
    } else {
      resultsEl.appendChild(container);
    }

    if (shareBar) {
      ensureHealthProgressBeforeShareBar();
    }

    var historyBtn = document.getElementById('afriHealthHistoryBtn');
    if (historyBtn) {
      historyBtn.addEventListener('click', function () {
        openHistoryModal(adapter);
      });
    }

    ensureHealthProgressBeforeShareBar();
  }

  // Tool display name resolver for cards and modal
  function getToolName(adapter) {
    if (!adapter) return 'Health Calculator';
    var names = {
      'bmi-calc': 'BMI Calculator',
      'body-fat-calc': 'Body Fat Calculator',
      'daily-calorie-needs': 'Daily Calorie Needs Calculator',
      'healthy-weight-range': 'Healthy Weight Range Calculator',
      'ideal-weight-calc': 'Ideal Weight Calculator',
      'water-intake-calc': 'Water Intake Calculator',
      'hydration-reminder-calc': 'Hydration Reminder Calculator',
      'ovulation-cycle-calc': 'Ovulation & Cycle Calculator',
      'calorie-burn-calc': 'Calorie Burn Calculator'
    };
    if (adapter.id && names[adapter.id]) return names[adapter.id];
    return adapter.title || 'Health Calculator';
  }

  // History Modal Overlay Management
  function ensureModalOverlay(adapter) {
    var existing = document.getElementById('afriHealthModalOverlay');
    if (existing) return existing;

    var overlay = document.createElement('div');
    overlay.id = 'afriHealthModalOverlay';
    overlay.className = 'afri-health-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'afriHealthModalTitle');

    overlay.innerHTML = `
      <div class="afri-health-modal">
        <div class="afri-health-modal-head">
          <div>
            <h3 class="afri-health-modal-title" id="afriHealthModalTitle">Biometric &amp; Calculation History</h3>
            <p class="afri-health-modal-sub">Stored 100% locally in your browser &middot; Zero server tracking</p>
          </div>
          <button type="button" class="afri-health-modal-close" id="afriHealthModalCloseBtn" aria-label="Close history modal">
            ${icons.close}
          </button>
        </div>

        <div class="afri-health-modal-body">
          <div class="afri-health-history-stats" id="afriHealthModalStats">
            <div class="afri-health-hstat-box">
              <span class="afri-health-hstat-label">Total Logs</span>
              <span class="afri-health-hstat-val" id="afriHealthHstatCount">0</span>
            </div>
            <div class="afri-health-hstat-box">
              <span class="afri-health-hstat-label">Initial Date</span>
              <span class="afri-health-hstat-val" id="afriHealthHstatInitial">—</span>
            </div>
            <div class="afri-health-hstat-box">
              <span class="afri-health-hstat-label">Latest Log</span>
              <span class="afri-health-hstat-val" id="afriHealthHstatLatest">—</span>
            </div>
          </div>

          <!-- Mobile Cards View -->
          <div class="afri-health-cards-wrap" id="afriHealthCardsList">
            <!-- Cards injected here -->
          </div>

          <!-- Desktop Table View -->
          <div class="afri-health-table-wrap">
            <table class="afri-health-table">
              <thead>
                <tr>
                  <th scope="col">Date &amp; Time</th>
                  <th scope="col">Result</th>
                  <th scope="col">Status / Target</th>
                  <th scope="col">Details</th>
                </tr>
              </thead>
              <tbody id="afriHealthTableBody">
                <!-- Rows injected here -->
              </tbody>
            </table>
          </div>
        </div>

        <div class="afri-health-modal-foot">
          <div class="afri-health-modal-foot-actions">
            <button type="button" class="afri-health-btn" id="afriHealthExportCsvBtn">
              ${icons.download}
              <span>Export CSV</span>
            </button>
            <button type="button" class="afri-health-btn" id="afriHealthClearBtn" style="color: #b91c1c;">
              ${icons.trash}
              <span>Clear History</span>
            </button>
          </div>
          <button type="button" class="afri-health-btn" id="afriHealthFootCloseBtn">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        closeHistoryModal();
      }
    });

    var closeBtn = overlay.querySelector('#afriHealthModalCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeHistoryModal);

    var footClose = overlay.querySelector('#afriHealthFootCloseBtn');
    if (footClose) footClose.addEventListener('click', closeHistoryModal);

    var exportBtn = overlay.querySelector('#afriHealthExportCsvBtn');
    if (exportBtn) {
      exportBtn.onclick = function (e) {
        e.preventDefault();
        var actAdapter = currentHealthModalAdapter || adapter;
        if (actAdapter) exportHistoryCsv(actAdapter);
      };
    }

    var clearBtn = overlay.querySelector('#afriHealthClearBtn');
    if (clearBtn) {
      clearBtn.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var actAdapter = currentHealthModalAdapter || adapter;
        if (!actAdapter) return;
        var hist = getHistory(actAdapter.id);
        if (!hist.length) {
          clearBtn.innerHTML = '<span>No history to clear</span>';
          setTimeout(function () {
            resetHealthClearBtn(clearBtn, false);
          }, 1500);
          return;
        }

        if (!clearBtn.classList.contains('confirming')) {
          clearBtn.classList.add('confirming');
          clearBtn.innerHTML = icons.alert + ' <span>Click again to confirm</span>';
          clearBtn.style.background = '#dc2626';
          clearBtn.style.color = '#ffffff';
          clearBtn.style.borderColor = '#b91c1c';
          if (healthClearConfirmTimer) clearTimeout(healthClearConfirmTimer);
          healthClearConfirmTimer = setTimeout(function () {
            var curr = getHistory(actAdapter.id);
            resetHealthClearBtn(clearBtn, curr.length > 0);
          }, 4500);
        } else {
          if (healthClearConfirmTimer) clearTimeout(healthClearConfirmTimer);
          healthClearConfirmTimer = null;
          clearHistory(actAdapter.id);
          renderHistoryModalTable(actAdapter);
          updateProgressUI(actAdapter);

          clearBtn.classList.remove('confirming');
          clearBtn.style.background = '#f0fdf4';
          clearBtn.style.color = '#16a34a';
          clearBtn.style.borderColor = '#86efac';
          clearBtn.innerHTML = icons.check + ' <span>History Cleared!</span>';

          setTimeout(function () {
            resetHealthClearBtn(clearBtn, false);
          }, 1800);
        }
      };
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        closeHistoryModal();
      }
    });

    return overlay;
  }

  var currentHealthModalAdapter = null;
  var healthClearConfirmTimer = null;

  function resetHealthClearBtn(clearBtn, hasHistory) {
    if (healthClearConfirmTimer) {
      clearTimeout(healthClearConfirmTimer);
      healthClearConfirmTimer = null;
    }
    if (!clearBtn) return;
    clearBtn.classList.remove('confirming');
    clearBtn.style.color = '#b91c1c';
    clearBtn.style.borderColor = '';
    clearBtn.style.background = '';
    clearBtn.innerHTML = icons.trash + ' <span>Clear History</span>';
    if (!hasHistory) {
      clearBtn.style.opacity = '0.55';
      clearBtn.style.cursor = 'default';
      clearBtn.title = 'No biometric history recorded yet';
    } else {
      clearBtn.style.opacity = '1';
      clearBtn.style.cursor = 'pointer';
      clearBtn.removeAttribute('title');
    }
  }

  function openHistoryModal(adapter) {
    currentHealthModalAdapter = adapter;
    var overlay = ensureModalOverlay(adapter);
    renderHistoryModalTable(adapter);
    var clearBtn = overlay.querySelector('#afriHealthClearBtn');
    if (clearBtn) {
      var hist = getHistory(adapter.id);
      resetHealthClearBtn(clearBtn, hist.length > 0);
    }
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeHistoryModal() {
    var overlay = document.getElementById('afriHealthModalOverlay');
    if (overlay) {
      var clearBtn = overlay.querySelector('#afriHealthClearBtn');
      if (clearBtn) resetHealthClearBtn(clearBtn, false);
      overlay.classList.remove('open');
    }
    document.body.style.overflow = '';
  }

  function renderHistoryModalTable(adapter) {
    var history = getHistory(adapter.id);
    var tbody = document.getElementById('afriHealthTableBody');
    var cardsList = document.getElementById('afriHealthCardsList');
    var countEl = document.getElementById('afriHealthHstatCount');
    var initEl = document.getElementById('afriHealthHstatInitial');
    var latestEl = document.getElementById('afriHealthHstatLatest');
    var clearBtn = document.getElementById('afriHealthClearBtn');

    if (clearBtn && !clearBtn.classList.contains('confirming')) {
      resetHealthClearBtn(clearBtn, history.length > 0);
    }

    if (countEl) countEl.textContent = history.length;
    if (initEl) {
      initEl.textContent = history.length > 0 ? formatDateShort(history[history.length - 1].timestamp) : '—';
    }
    if (latestEl) {
      latestEl.textContent = history.length > 0 ? (history[0].displayValue ? history[0].displayValue.split(' ')[0] : '—') : '—';
    }

    if (cardsList) cardsList.innerHTML = '';
    if (tbody) tbody.innerHTML = '';

    if (history.length === 0) {
      var emptyMsg = 'No calculations recorded yet. Use the calculator to log your first biometric entry.';
      if (cardsList) {
        cardsList.innerHTML = '<div class="afri-health-empty">' + emptyMsg + '</div>';
      }
      if (tbody) {
        var tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="4" class="afri-health-empty">' + emptyMsg + '</td>';
        tbody.appendChild(tr);
      }
      return;
    }

    var toolName = getToolName(adapter);

    history.forEach(function (entry) {
      var dateStr = formatDate(entry.timestamp);

      // Clean primary value (e.g. "19.0 kg/m²" without trailing "(Healthy Weight)")
      var rawDisplay = entry.displayValue || (entry.value + ' ' + (adapter.unit || ''));
      var primaryVal = rawDisplay.replace(/\s*\([^)]*\)\s*$/, '').trim();
      var statusText = entry.status || 'Standard';

      // 1. Mobile Cards View
      if (cardsList) {
        var card = document.createElement('div');
        card.className = 'afri-health-card-item';

        var metricsList = [];
        if (entry.metrics && Array.isArray(entry.metrics)) {
          entry.metrics.forEach(function (m) {
            if (!m || !m.name) return;
            // Skip metric if it duplicates the primary value or status badge
            if (m.name === 'BMI Score' || m.name === 'Body Fat %' || m.name === 'Maintenance TDEE' || m.name === 'Total Burned') return;
            if (m.name === 'Body Composition' && m.value === statusText) return;

            var cleanName = m.name;
            if (cleanName === 'Basal BMR') cleanName = 'BMR';
            else if (cleanName === 'Active TDEE') cleanName = 'TDEE';
            metricsList.push({ name: cleanName, value: m.value });
          });
        }

        var detailsHtml = '';
        if (metricsList.length > 0) {
          detailsHtml = '<div class="afri-health-card-details">' +
            metricsList.map(function (m) {
              return '<div class="afri-health-card-detail-row">' +
                '<span class="afri-health-card-detail-key">' + escapeXml(m.name) + ':</span>' +
                '<span class="afri-health-card-detail-val">' + escapeXml(m.value) + '</span>' +
              '</div>';
            }).join('') +
          '</div>';
        } else if (entry.target) {
          detailsHtml = '<div class="afri-health-card-details">' +
            '<div class="afri-health-card-detail-row">' +
              '<span class="afri-health-card-detail-key">Target:</span>' +
              '<span class="afri-health-card-detail-val">' + escapeXml(entry.target) + '</span>' +
            '</div>' +
          '</div>';
        }

        card.innerHTML = `
          <div class="afri-health-card-head">
            <h4 class="afri-health-card-title">${escapeXml(toolName)}</h4>
          </div>
          <div class="afri-health-card-val">${escapeXml(primaryVal)}</div>
          <div>
            <span class="afri-health-card-status-badge">${escapeXml(statusText)}</span>
          </div>
          <div class="afri-health-card-meta">
            <span>${escapeXml(dateStr)}</span>
          </div>
          ${detailsHtml}
        `;
        cardsList.appendChild(card);
      }

      // 2. Desktop Table View
      if (tbody) {
        var tr = document.createElement('tr');
        var detailSummary = [];
        if (entry.metrics && Array.isArray(entry.metrics)) {
          entry.metrics.forEach(function (m) {
            detailSummary.push(m.name + ': ' + m.value);
          });
        }
        var detailStr = detailSummary.slice(0, 3).join(' &middot; ');

        tr.innerHTML = `
          <td style="white-space: nowrap; font-size: 0.75rem; color: #4b5563;">${escapeXml(dateStr)}</td>
          <td class="val-cell">${escapeXml(rawDisplay)}</td>
          <td><span style="font-weight: 700; color: #111827;">${escapeXml(statusText)}</span></td>
          <td style="font-size: 0.75rem; color: #6b7280;">${detailStr || '—'}</td>
        `;
        tbody.appendChild(tr);
      }
    });
  }

  function exportHistoryCsv(adapter) {
    var history = getHistory(adapter.id);
    if (history.length === 0) {
      if (typeof window.showAfriToast === 'function') {
        window.showAfriToast('No history entries to export');
      }
      return;
    }

    var rows = [
      ['Date', 'Time', 'Tool', 'Result', 'Status', 'Target', 'Details']
    ];

    history.forEach(function (h) {
      var d = new Date(h.timestamp);
      var dateStr = d.toISOString().split('T')[0];
      var timeStr = d.toTimeString().split(' ')[0];
      var details = (h.metrics || []).map(function (m) { return m.name + '=' + m.value; }).join('; ');
      rows.push([
        dateStr,
        timeStr,
        adapter.title,
        h.displayValue || h.value,
        h.status || '',
        h.target || '',
        details
      ]);
    });

    var csvContent = 'data:text/csv;charset=utf-8,' + rows.map(function (e) {
      return e.map(function (f) {
        var str = String(f || '').replace(/"/g, '""');
        return '"' + str + '"';
      }).join(',');
    }).join('\n');

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', adapter.id + '-history-' + (new Date().toISOString().slice(0, 10)) + '.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function formatDate(ts) {
    if (!ts) return '—';
    var d = new Date(ts);
    if (isNaN(d.getTime())) return '—';
    var day = d.getDate();
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var month = months[d.getMonth()];
    var year = d.getFullYear();
    var hours = String(d.getHours()).padStart(2, '0');
    var mins = String(d.getMinutes()).padStart(2, '0');
    return day + ' ' + month + ' ' + year + ' \u2022 ' + hours + ':' + mins;
  }

  function formatDateShort(ts) {
    if (!ts) return '—';
    var d = new Date(ts);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }

  // Update UI Elements with Latest State
  function updateProgressUI(adapter) {
    var history = getHistory(adapter.id);
    var badgeEl = document.getElementById('afriHealthHistoryBadge');
    if (badgeEl) badgeEl.textContent = history.length;

    var latestValEl = document.getElementById('afriHealthLatestVal');
    var latestSubEl = document.getElementById('afriHealthLatestSub');
    var prevValEl = document.getElementById('afriHealthPrevVal');
    var prevSubEl = document.getElementById('afriHealthPrevSub');
    var trendBanner = document.getElementById('afriHealthTrendBanner');
    var trendText = document.getElementById('afriHealthTrendText');
    var targetName = document.getElementById('afriHealthTargetName');
    var targetSub = document.getElementById('afriHealthTargetSub');
    var focusName = document.getElementById('afriHealthFocusName');
    var focusSub = document.getElementById('afriHealthFocusSub');
    var chartWrap = document.getElementById('afriHealthChartWrap');
    var metaBar = document.getElementById('afriHealthMetaBar');

    if (history.length === 0) {
      if (latestValEl) latestValEl.textContent = '—';
      if (latestSubEl) latestSubEl.textContent = 'Calculate to record baseline';
      if (prevValEl) prevValEl.textContent = '—';
      if (prevSubEl) prevSubEl.textContent = 'Prior attempt';
      if (chartWrap) chartWrap.innerHTML = generateBiometricSvg([], adapter);
      if (trendBanner) {
        trendBanner.className = 'afri-health-trend-banner baseline';
        if (trendText) trendText.textContent = 'Awaiting initial calculation baseline';
      }
      ensureHealthProgressBeforeShareBar();
      return;
    }

    var latest = history[0];
    var prev = history.length > 1 ? history[1] : null;

    if (latestValEl) {
      latestValEl.textContent = latest.displayValue || (latest.value + ' ' + (adapter.unit || ''));
    }
    if (latestSubEl) {
      latestSubEl.textContent = latest.status || 'Latest Logged Entry';
    }

    if (prev && prevValEl) {
      prevValEl.textContent = prev.displayValue || (prev.value + ' ' + (adapter.unit || ''));
      if (prevSubEl) {
        prevSubEl.textContent = 'Logged ' + formatDate(prev.timestamp);
      }
    } else {
      if (prevValEl) prevValEl.textContent = '—';
      if (prevSubEl) prevSubEl.textContent = 'Initial baseline session';
    }

    // Trend analysis
    if (trendBanner && trendText) {
      if (!prev) {
        trendBanner.className = 'afri-health-trend-banner baseline';
        trendText.innerHTML = icons.check + ' Initial baseline session recorded successfully';
      } else {
        var numLatest = typeof latest.value === 'number' ? latest.value : parseFloat(latest.value);
        var numPrev = typeof prev.value === 'number' ? prev.value : parseFloat(prev.value);

        if (!isNaN(numLatest) && !isNaN(numPrev)) {
          var diff = numLatest - numPrev;
          if (Math.abs(diff) < 0.05) {
            trendBanner.className = 'afri-health-trend-banner optimal';
            trendText.innerHTML = icons.trendStable + ' Biometric reading maintained stable against previous log';
          } else if (diff > 0) {
            trendBanner.className = 'afri-health-trend-banner active';
            trendText.innerHTML = icons.trendUp + ' Biometric adjustment: +' + diff.toFixed(1) + ' from previous log';
          } else {
            trendBanner.className = 'afri-health-trend-banner optimal';
            trendText.innerHTML = icons.trendDown + ' Biometric adjustment: ' + diff.toFixed(1) + ' from previous log';
          }
        } else {
          trendBanner.className = 'afri-health-trend-banner optimal';
          trendText.innerHTML = icons.check + ' Routine measurement updated';
        }
      }
    }

    // Targets and Focus
    if (targetName) targetName.textContent = latest.target || adapter.target || 'Clinical Baseline';
    if (targetSub) targetSub.textContent = 'Target standard for optimal health';
    if (focusName) focusName.textContent = latest.focus || adapter.focus || 'Maintain lifestyle consistency';
    if (focusSub) focusSub.textContent = 'Recommended wellness focus';

    // SVG Visualizer
    if (chartWrap) {
      chartWrap.innerHTML = generateBiometricSvg(latest.metrics, adapter);
    }

    // Meta bar unboxed metadata items
    if (metaBar && latest.metrics && latest.metrics.length > 0) {
      metaBar.style.display = 'flex';
      var items = latest.metrics.map(function (m) {
        return '<span class="afri-health-meta-item"><span>' + escapeXml(m.name) + ':</span> <span class="afri-health-meta-val">' + escapeXml(m.value) + '</span></span>';
      });
      metaBar.innerHTML = items.join('<span class="afri-health-meta-sep" aria-hidden="true">&middot;</span>');
    }

    ensureHealthProgressBeforeShareBar();
  }

  // Record Entry from current calculator state
  function recordAndDisplay(adapter) {
    if (!adapter || typeof adapter.extract !== 'function') return;

    var extracted = adapter.extract();
    if (!extracted) return;

    var history = getHistory(adapter.id);
    var latest = history.length > 0 ? history[0] : null;

    // Avoid duplicate logging if exactly identical value recorded in the last 4 seconds
    var now = Date.now();
    if (latest && (now - latest.timestamp < 4000) && latest.value === extracted.value) {
      return;
    }

    var newEntry = {
      timestamp: now,
      value: extracted.value,
      displayValue: extracted.displayValue,
      status: extracted.status,
      target: extracted.target,
      focus: extracted.focus,
      metrics: extracted.metrics || []
    };

    history.unshift(newEntry);
    saveHistory(adapter.id, history);

    injectHealthProgressSection(adapter);
    updateProgressUI(adapter);
    ensureHealthProgressBeforeShareBar();
  }

  // Initialization
  function init() {
    var adapter = getActiveAdapter();
    if (!adapter) return;

    injectStyles();

    var resultsEl = document.getElementById('results') || document.querySelector('.results') || document.getElementById('cfResults');
    if (resultsEl) {
      injectHealthProgressSection(adapter);
      updateProgressUI(adapter);
    }

    // Hook forms
    var forms = document.querySelectorAll('form');
    forms.forEach(function (form) {
      form.addEventListener('submit', function () {
        setTimeout(function () {
          recordAndDisplay(adapter);
        }, 120);
      });
    });

    // Hook buttons
    var calcButtons = document.querySelectorAll('#calcBtn, .btn-primary, [type="submit"], #calculateBtn');
    calcButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setTimeout(function () {
          recordAndDisplay(adapter);
        }, 140);
      });
    });

    // Observe results container for changes
    if (resultsEl) {
      var observer = new MutationObserver(function () {
        if (resultsEl.classList.contains('visible') || window.getComputedStyle(resultsEl).display !== 'none') {
          setTimeout(function () {
            recordAndDisplay(adapter);
          }, 90);
        }
      });
      observer.observe(resultsEl, { attributes: true, attributeFilter: ['class', 'style'], childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
