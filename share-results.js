(function () {
  'use strict';

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const page = location.pathname.split('/').pop().replace(/\.html$/, '') || 'home';
  const params = new URLSearchParams(location.search);
  const hasSharedInputs = Array.from(params.keys()).some(k => k !== 'shared');

  // Inject Self-Contained AfriWidget CSS (Brand styling, zero Tailwind, zero external dependencies)
  function injectShareStyles() {
    if (document.getElementById('afriwidget-share-styles')) return;
    const style = document.createElement('style');
    style.id = 'afriwidget-share-styles';
    style.textContent = `
      .afri-share-bar {
        display: block;
        margin-top: 1.25rem;
        margin-bottom: 1.25rem;
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-left: 4px solid #facc15;
        border-radius: 0.75rem;
        padding: 1.25rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        color: #000000;
        box-sizing: border-box;
      }
      .afri-share-bar *, .afri-share-bar *::before, .afri-share-bar *::after {
        box-sizing: border-box;
      }
      .afri-share-bar.afri-share-hidden {
        display: none !important;
      }
      .afri-share-inner {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      @media (min-width: 640px) {
        .afri-share-bar {
          padding: 1.5rem;
        }
        .afri-share-inner {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }
      }
      .afri-share-info {
        flex: 1;
        min-width: 0;
      }
      .afri-share-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        font-size: 0.6875rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: #ca8a04;
        margin-bottom: 0.375rem;
      }
      .afri-share-eyebrow svg {
        width: 0.875rem;
        height: 0.875rem;
        flex-shrink: 0;
      }
      .afri-share-title {
        font-size: 1.125rem;
        font-weight: 900;
        color: #000000;
        letter-spacing: -0.01em;
        line-height: 1.3;
        margin: 0 0 0.25rem 0;
      }
      .afri-share-desc {
        font-size: 0.8125rem;
        color: #4b5563;
        line-height: 1.5;
        margin: 0;
      }
      .afri-share-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.625rem;
        align-items: center;
        flex-shrink: 0;
        width: 100%;
      }
      @media (min-width: 640px) {
        .afri-share-actions {
          width: auto;
        }
      }
      .afri-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.625rem 1.125rem;
        font-size: 0.875rem;
        font-weight: 700;
        border-radius: 0.5rem;
        cursor: pointer;
        min-height: 44px;
        line-height: 1;
        text-decoration: none;
        border: 1px solid transparent;
        transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
        font-family: inherit;
        box-sizing: border-box;
      }
      .afri-btn:active {
        transform: scale(0.98);
      }
      .afri-btn svg {
        width: 1rem;
        height: 1rem;
        flex-shrink: 0;
      }
      .afri-btn-primary {
        background: #facc15;
        color: #000000;
        border-color: #facc15;
        flex: 1;
      }
      .afri-btn-primary:hover {
        background: #fde047;
        border-color: #fde047;
      }
      .afri-btn-secondary {
        background: #000000;
        color: #ffffff;
        border-color: #000000;
        flex: 1;
      }
      .afri-btn-secondary:hover {
        background: #1f2937;
        color: #fde047;
        border-color: #1f2937;
      }
      @media (min-width: 640px) {
        .afri-btn-primary, .afri-btn-secondary {
          flex: initial;
        }
      }

      /* Compact Tool Header Share Button */
      .afri-header-share-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        font-size: 0.75rem;
        font-weight: 700;
        color: #4b5563;
        background: #f9fafb;
        border: 1px solid #e5e5e5;
        border-radius: 0.375rem;
        padding: 0.375rem 0.625rem;
        cursor: pointer;
        min-height: 32px;
        transition: background 0.15s, color 0.15s, border-color 0.15s;
        text-decoration: none;
        box-sizing: border-box;
      }
      .afri-header-share-btn:hover {
        background: #fef3c7;
        color: #000000;
        border-color: #facc15;
      }
      .afri-header-share-btn svg {
        width: 0.875rem;
        height: 0.875rem;
        flex-shrink: 0;
      }

      /* Share Modal Dialog */
      .afri-modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
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
      .afri-modal-overlay.afri-modal-open {
        opacity: 1;
        pointer-events: auto;
      }
      .afri-modal-card {
        position: relative;
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-radius: 0.875rem;
        width: 100%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        padding: 1.5rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.15);
        transform: translateY(12px) scale(0.98);
        transition: transform 0.2s ease;
        box-sizing: border-box;
        text-align: left;
      }
      .afri-modal-open .afri-modal-card {
        transform: translateY(0) scale(1);
      }
      @media (min-width: 640px) {
        .afri-modal-card {
          padding: 1.75rem 2rem;
        }
      }
      .afri-modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        width: 2.25rem;
        height: 2.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.375rem;
        border: 1px solid #e5e5e5;
        background: #ffffff;
        color: #4b5563;
        cursor: pointer;
        transition: background 0.15s ease, color 0.15s ease;
      }
      .afri-modal-close:hover {
        background: #000000;
        color: #ffffff;
      }
      .afri-modal-close svg {
        width: 1.125rem;
        height: 1.125rem;
      }
      .afri-modal-eyebrow {
        display: inline-block;
        font-size: 0.6875rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: #ca8a04;
        margin-bottom: 0.375rem;
      }
      .afri-modal-title {
        font-size: 1.375rem;
        font-weight: 900;
        color: #000000;
        letter-spacing: -0.02em;
        line-height: 1.25;
        margin: 0 0 0.5rem 0;
        padding-right: 2rem;
      }
      .afri-modal-desc {
        font-size: 0.875rem;
        color: #4b5563;
        line-height: 1.55;
        margin: 0 0 1.25rem 0;
      }
      .afri-copy-box {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
      }
      .afri-copy-box-row {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      @media (min-width: 480px) {
        .afri-copy-box-row {
          flex-direction: row;
          align-items: center;
        }
      }
      .afri-copy-label {
        font-size: 0.75rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #000000;
        display: block;
      }
      .afri-copy-input {
        width: 100%;
        padding: 0.625rem 0.875rem;
        font-size: 0.8125rem;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        color: #000000;
        background: #f9fafb;
        border: 1px solid #e5e5e5;
        border-radius: 0.5rem;
        min-height: 44px;
        box-sizing: border-box;
      }
      .afri-copy-input:focus {
        outline: none;
        border-color: #facc15;
        box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.25);
      }
      .afri-copy-btn {
        background: #facc15;
        color: #000000;
        font-weight: 700;
        font-size: 0.875rem;
        padding: 0.625rem 1.125rem;
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
        min-height: 44px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.375rem;
        flex-shrink: 0;
        transition: background 0.15s ease;
        width: 100%;
        box-sizing: border-box;
      }
      @media (min-width: 480px) {
        .afri-copy-btn {
          width: auto;
        }
      }
      .afri-copy-btn:hover {
        background: #fde047;
      }
      .afri-copy-btn svg {
        width: 1rem;
        height: 1rem;
      }
      .afri-social-label {
        font-size: 0.75rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #000000;
        margin-bottom: 0.5rem;
        display: block;
      }
      .afri-social-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem;
      }
      @media (min-width: 480px) {
        .afri-social-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      .afri-social-item {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.625rem 0.75rem;
        background: #f9fafb;
        border: 1px solid #e5e5e5;
        border-radius: 0.5rem;
        color: #000000;
        font-size: 0.8125rem;
        font-weight: 700;
        text-decoration: none;
        min-height: 44px;
        transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
        box-sizing: border-box;
      }
      .afri-social-item:hover {
        background: #fef3c7;
        border-color: #facc15;
        color: #000000;
      }
      .afri-social-item svg {
        width: 1rem;
        height: 1rem;
        flex-shrink: 0;
      }

      /* AfriWidget Toast */
      .afri-toast {
        position: fixed;
        bottom: 1.5rem;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        z-index: 10000;
        background: #000000;
        color: #ffffff;
        padding: 0.75rem 1.25rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 700;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        border: 1px solid #374151;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease, transform 0.25s ease;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        box-sizing: border-box;
        max-width: 90vw;
        text-align: center;
      }
      .afri-toast.afri-toast-show {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
        pointer-events: auto;
      }
      .afri-toast svg {
        width: 1.125rem;
        height: 1.125rem;
        color: #facc15;
        flex-shrink: 0;
      }
    `;
    document.head.appendChild(style);
  }

  // Pure SVG Icons (No Emojis)
  const icons = {
    brandLogo: `<svg viewBox="0 0 36 36" fill="none" aria-hidden="true"><path d="M18 4L20.5 14L30 18L20.5 22L18 32L15.5 22L6 18L15.5 14Z" fill="#FACC15"/><circle cx="28" cy="9" r="2.5" fill="#CA8A04"/><circle cx="9" cy="11" r="1.5" fill="#FACC15" opacity="0.7"/></svg>`,
    share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
    copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    whatsapp: `<svg viewBox="0 0 24 24" fill="#25D366"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15ZM16.57 14.36C16.32 14.24 15.1 13.64 14.87 13.56C14.65 13.47 14.48 13.43 14.32 13.68C14.15 13.92 13.68 14.48 13.53 14.64C13.39 14.81 13.24 14.83 12.99 14.71C12.74 14.58 11.95 14.32 11.01 13.48C10.27 12.83 9.77 12.02 9.63 11.77C9.48 11.53 9.61 11.39 9.74 11.27C9.85 11.16 9.99 10.98 10.12 10.83C10.24 10.69 10.29 10.58 10.37 10.42C10.45 10.25 10.41 10.11 10.35 9.98C10.29 9.86 9.79 8.64 9.59 8.13C9.39 7.64 9.18 7.71 9.03 7.7C8.88 7.69 8.72 7.69 8.55 7.69C8.38 7.69 8.12 7.75 7.89 8C7.67 8.25 7.03 8.84 7.03 10.06C7.03 11.27 7.92 12.45 8.04 12.61C8.17 12.78 9.77 15.24 12.23 16.3C12.82 16.55 13.27 16.7 13.63 16.82C14.22 17 14.75 16.98 15.18 16.91C15.65 16.84 16.63 16.32 16.83 15.75C17.04 15.17 17.04 14.68 16.98 14.58C16.92 14.48 16.82 14.48 16.57 14.36Z"/></svg>`,
    x: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    facebook: `<svg viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24" fill="#0A66C2"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.62 1.62 0 1 0 0-3.24 1.62 1.62 0 0 0 0 3.24M5.07 18.5h2.78v-8.37H5.07v8.37z"/></svg>`,
    telegram: `<svg viewBox="0 0 24 24" fill="#229ED9"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>`,
    email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`
  };

  // Dedicated Tool Adapters (for complex multi-row and non-standard forms)
  const adapters = {
    'jamb-utme-aggregate-calculator': {
      fields: () => [$('#jambScore'), ...$$('.jamb-grade')],
      calculate: () => $('#jambCalculate')?.click()
    },
    'tertiary-gpa-cgpa-calculator': {
      fields: () => [$('#gpaScale'), ...$$('.course-row input, .course-row select')].filter(Boolean),
      restore(values) {
        const rows = values.filter(item => item.key.startsWith('course'));
        const scaleEl = $('#gpaScale');
        if (scaleEl) {
          scaleEl.value = values.find(item => item.key === 'scale')?.value || scaleEl.value;
        }
        if (!rows.length) return;
        const grouped = {};
        rows.forEach(item => {
          const match = item.key.match(/^course(\d+)(Name|Credits|Grade)$/);
          if (match) (grouped[match[1]] ||= {})[match[2]] = item.value;
        });
        const add = $('#addCourse');
        Object.keys(grouped).sort((a, b) => Number(a) - Number(b)).forEach((number, index) => {
          const row = $$('.course-row')[index] || (add ? (add.click(), $$('.course-row').at(-1)) : null);
          if (!row) return;
          const nameEl = $('.course-name', row);
          const credEl = $('.credit-input', row);
          const gradeEl = $('.grade-select', row);
          if (nameEl) nameEl.value = grouped[number].Name || '';
          if (credEl) credEl.value = grouped[number].Credits || '';
          if (gradeEl) gradeEl.value = grouped[number].Grade || '';
        });
      },
      calculate: () => $('#gpaCalculate')?.click()
    },
    'gpa-calculator': {
      fields: () => $$('.course-row input, .course-row select'),
      restore(values) {
        const rows = values.filter(item => item.key.startsWith('course'));
        if (!rows.length) return;
        const grouped = {};
        rows.forEach(item => {
          const match = item.key.match(/^course(\d+)(Name|Grade|Credits)$/);
          if (match) (grouped[match[1]] ||= {})[match[2]] = item.value;
        });
        const add = $('#addRowBtn');
        Object.keys(grouped).sort((a, b) => Number(a) - Number(b)).forEach((number, index) => {
          const row = $$('.course-row')[index] || (add ? (add.click(), $$('.course-row').at(-1)) : null);
          if (!row) return;
          const nameEl = $('.course-name', row);
          const credEl = $('.credit-input', row);
          const gradeEl = $('.grade-select', row);
          if (nameEl) nameEl.value = grouped[number].Name || '';
          if (credEl) credEl.value = grouped[number].Credits || '';
          if (gradeEl) gradeEl.value = grouped[number].Grade || '';
        });
      },
      calculate: () => $('#calcBtn')?.click()
    },
    'south-african-aps-calculator': {
      fields: () => [...$$('.aps-main'), $('#includeLifeOrientation'), $('#apsLifeOrientation')],
      calculate: () => $('#apsCalculate')?.click()
    },
    'kcse-kuccps-cluster-calculator': {
      fields: () => $$('.kcse-grade'),
      calculate: () => $('#kcseCalculate')?.click()
    },
    'university-cutoff-eligibility-checker': {
      fields: () => [$('#eligibilitySystem'), $('#eligibilityScore'), $('#eligibilityInstitution'), $('#eligibilityCourse')],
      calculate: () => $('#eligibilityCalculate')?.click(),
      restore() {
        const system = params.get('eligibilitySystem');
        if (system && $('#eligibilitySystem')) {
          $('#eligibilitySystem').value = system;
          $('#eligibilitySystem').dispatchEvent(new Event('change', { bubbles: true }));
        }
        const institution = params.get('eligibilityInstitution');
        if (institution && $('#eligibilityInstitution')) {
          $('#eligibilityInstitution').value = institution;
          $('#eligibilityInstitution').dispatchEvent(new Event('change', { bubbles: true }));
        }
        const course = params.get('eligibilityCourse');
        if (course && $('#eligibilityCourse')) $('#eligibilityCourse').value = course;
      }
    },
    'percentage-calculator': {
      fields: () => $$('#ofForm input, #isForm input, #changeForm input'),
      calculate: () => ['ofForm', 'isForm', 'changeForm'].forEach(id => document.getElementById(id)?.requestSubmit())
    },
    'age-calculator': {
      fields: () => [$('#birthDate')],
      calculate: () => $('#ageBtn')?.click()
    },
    'unit-converter': {
      fields: () => [$('#category'), $('#amount'), $('#fromUnit'), $('#toUnit')],
      restore() {
        const category = params.get('category');
        if (category && $('#category')) {
          $('#category').value = category;
          $('#category').dispatchEvent(new Event('change', { bubbles: true }));
        }
      },
      calculate: () => $('#convertBtn')?.click()
    },
    'wassce-aggregate-calculator': {
      fields: () => $$('.grade-input'),
      calculate: () => $('#calculateBtn')?.click()
    },
    'bece-aggregate-calculator': {
      fields: () => $$('.grade-input'),
      calculate: () => $('#calculateBtn')?.click()
    },
    'olevel-subject-combination-checker': {
      fields: () => [$('#olevelCourse')],
      calculate: () => $('#olevelCourse')?.dispatchEvent(new Event('change', { bubbles: true }))
    },
    'kcse-eligibility-tier-checker': {
      fields: () => [$('#kcseMeanGrade')],
      calculate: () => $('#kcseMeanGrade')?.dispatchEvent(new Event('change', { bubbles: true }))
    },
    'south-african-tvet-nated-calculator': {
      fields: () => [$('#natedIcass'), $('#natedExam')],
      calculate: () => $('#natedCalculate')?.click()
    },
    'bece-cssps-placement-estimator': {
      fields: () => [$('#becePlacementAggregate'), $('#beceSchoolCategory')],
      calculate: () => $('#becePlacementCalculate')?.click()
    },
    'tvet-ncv-pass-calculator': {
      fields: () => [$('#ncvLevel'), ...$$('.ncv-input')],
      calculate: () => $('#ncvCalculate')?.click()
    },
    'tvet-exam-target-mark-calculator': {
      fields: () => [$('#streamSelect'), $('#targetIcass'), $('#targetIsat'), $('#customTarget')],
      calculate: () => $('#targetCalculate')?.click()
    },
    'nsfas-tvet-allowance-calculator': {
      fields: () => [$('#nsfasInstType'), $('#nsfasLivingType'), $('#nsfasMonths')],
      calculate: () => $('#nsfasCalculate')?.click()
    },
    'matric-sba-exam-calculator': {
      fields: () => $$('.matric-input'),
      calculate: () => $('#matricCalculate')?.click()
    },
    'atar-calculator': {
      fields: () => [$('#adjustmentScheme'), $('#customAdjInput'), ...$$('.subject-score-input, .subject-units-select, .subject-state-select')],
      calculate: () => $('#calculateAtarBtn')?.click()
    },
    'hecs-help-repayment-calculator': {
      fields: () => [$('#repaymentIncome'), $('#hecsDebtBalance'), $('#indexationRate'), $('#voluntaryRepayment'), $('#incomeFrequency')],
      calculate: () => $('#calculateHecsBtn')?.click()
    },
    'australia-scholarship-finder': {
      fields: () => [$('#userState'), $('#userStudyArea'), $('#userDegreeLevel'), $('#userAtarScore'), $('#userStudyMode'), $('#userCitizenship'), $('#equityFinancial'), $('#equityRural'), $('#equityIndigenous'), $('#equityFirstGen'), $('#equityDisability'), $('#meritLeadership')],
      calculate: () => $('#filterScholarshipsBtn')?.click()
    },
    'university-course-finder': {
      fields: () => [$('#filterState'), $('#filterArea'), $('#filterDegreeLevel'), $('#filterMaxAtar'), $('#filterInstitutionType'), $('#courseSearchInput')],
      calculate: () => $('#applyFiltersBtn')?.click()
    },
    'igcse-alevel-gpa-converter': {
      fields: () => $$('.igcse-row input, .igcse-row select'),
      restore(values) {
        const rows = values.filter(item => item.key.startsWith('subject'));
        if (!rows.length) return;
        const grouped = {};
        rows.forEach(item => {
          const match = item.key.match(/^subject(\d+)(Name|Level|Grade)$/);
          if (match) (grouped[match[1]] ||= {})[match[2]] = item.value;
        });
        const add = $('#addIgcseSubject');
        Object.keys(grouped).sort((a, b) => Number(a) - Number(b)).forEach((number, index) => {
          const row = $$('.igcse-row')[index] || (add ? (add.click(), $$('.igcse-row').at(-1)) : null);
          if (!row) return;
          const subEl = $('.igcse-subject', row);
          const lvlEl = $('.igcse-level', row);
          const grdEl = $('.igcse-grade', row);
          if (subEl) subEl.value = grouped[number].Name || '';
          if (lvlEl) lvlEl.value = grouped[number].Level || '';
          if (grdEl) grdEl.value = grouped[number].Grade || '';
        });
      },
      calculate: () => $$('.igcse-row input, .igcse-row select').forEach(field => field.dispatchEvent(new Event('input', { bubbles: true })))
    },
    'canada-gpa-calculator': {
      fields: () => [$('#priorCgpaInput'), $('#priorCreditsInput'), ...$$('.course-row input, .course-row select')],
      calculate: () => $('#calculateGpaBtn')?.click()
    },
    'canada-university-admission-chance-calculator': {
      fields: () => [$('#targetUniversity'), $('#targetProgram'), $('#suppTier'), $('#adjFactor'), ...$$('.subj-input')],
      calculate: () => $('#calcAdmissionsBtn')?.click()
    },
    'canada-student-loan-repayment-calculator': {
      fields: () => [$('#totalLoanBalance'), $('#provincialProgram'), $('#repaymentTerm'), $('#extraMonthlyPayment'), $('#annualGrossIncome'), $('#familySize')],
      calculate: () => $('#calcLoanBtn')?.click()
    }
  };

  // Universal fallback adapter for all 100+ standard form & calculator tools
  function standardAdapter() {
    const form = $('form') || $('.calc-panel');
    if (!form) return null;
    return {
      fields: () => $$('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea', form),
      calculate: () => {
        const btn = form.querySelector('.btn-calc, button[type="submit"], #calcBtn, #calculateBtn, input[type="submit"]') || form.querySelector('button');
        if (btn) {
          btn.click();
        } else if (form.tagName === 'FORM' && typeof form.requestSubmit === 'function') {
          try {
            form.requestSubmit();
          } catch {
            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          }
        }
      }
    };
  }

  function getAdapter() {
    return adapters[page] || standardAdapter();
  }

  function fieldKey(field, index) {
    if (field.id) return field.id;
    if (field.name) return field.name;
    const label = field.getAttribute('aria-label');
    if (label) return `f_${label.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
    return `f_${index}`;
  }

  function getValues(adapterConfig) {
    if (page === 'igcse-alevel-gpa-converter') {
      return $$('.igcse-row').flatMap((row, index) => [
        { key: `subject${index + 1}Name`, value: $('.igcse-subject', row)?.value || '' },
        { key: `subject${index + 1}Level`, value: $('.igcse-level', row)?.value || '' },
        { key: `subject${index + 1}Grade`, value: $('.igcse-grade', row)?.value || '' }
      ]).filter(item => item.value !== '');
    }
    if (page === 'gpa-calculator') {
      return $$('.course-row').flatMap((row, index) => [
        { key: `course${index + 1}Name`, value: $('.course-name', row)?.value || '' },
        { key: `course${index + 1}Grade`, value: $('.grade-select', row)?.value || '' },
        { key: `course${index + 1}Credits`, value: $('.credit-input', row)?.value || '' }
      ]).filter(item => item.value !== '');
    }
    if (page === 'tertiary-gpa-cgpa-calculator') {
      const rows = $$('.course-row');
      return [
        { key: 'scale', value: $('#gpaScale')?.value || '' },
        ...rows.flatMap((row, index) => [
          { key: `course${index + 1}Name`, value: $('.course-name', row)?.value || '' },
          { key: `course${index + 1}Credits`, value: $('.credit-input', row)?.value || '' },
          { key: `course${index + 1}Grade`, value: $('.grade-select', row)?.value || '' }
        ]).filter(item => item.value !== '')
      ];
    }

    const fields = adapterConfig?.fields?.() || [];
    const values = [];
    fields.forEach((field, index) => {
      if (!field) return;
      if (field.type === 'radio' && !field.checked) return;
      const key = fieldKey(field, index);
      if (field.type === 'checkbox') {
        values.push({ key, value: field.checked ? '1' : '0' });
      } else if (field.value !== undefined && field.value !== '') {
        values.push({ key, value: field.value });
      }
    });
    return values;
  }

  function getShareUrl(adapterConfig) {
    const url = new URL(location.href.split('?')[0]);
    url.search = '';
    const vals = getValues(adapterConfig);
    vals.forEach(({ key, value }) => {
      url.searchParams.set(key, value);
    });
    if (vals.length > 0) {
      url.searchParams.set('shared', '1');
    }
    return url.toString();
  }

  function showToast(message) {
    let toast = document.getElementById('afriwidgetToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'afriwidgetToast';
      toast.className = 'afri-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `${icons.check}<span>${message}</span>`;
    toast.classList.add('afri-toast-show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('afri-toast-show');
    }, 2800);
  }

  async function copyToClipboard(text, btnElement) {
    let copied = false;
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      copied = document.execCommand('copy');
      ta.remove();
    }

    if (copied) {
      showToast('Link copied to clipboard');
      if (btnElement) {
        const originalHtml = btnElement.innerHTML;
        btnElement.innerHTML = `${icons.check}<span>Copied</span>`;
        setTimeout(() => {
          btnElement.innerHTML = originalHtml;
        }, 2200);
      }
    }
  }

  function openShareModal(url) {
    let overlay = document.getElementById('afriwidgetShareModal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'afriwidgetShareModal';
      overlay.className = 'afri-modal-overlay';
      document.body.appendChild(overlay);

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('afri-modal-open');
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('afri-modal-open')) {
          overlay.classList.remove('afri-modal-open');
        }
      });
    }

    const title = document.title.replace(/\s*[|—-]\s*AfriWidget.*$/i, '').trim();
    const encodedUrl = encodeURIComponent(url);
    const shareText = encodeURIComponent(`Check out this calculation on AfriWidget (${title}): `);

    overlay.innerHTML = `
      <div class="afri-modal-card" role="dialog" aria-modal="true" aria-labelledby="afriShareModalTitle">
        <button id="afriModalCloseBtn" type="button" class="afri-modal-close" aria-label="Close dialog">
          ${icons.close}
        </button>
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;padding-right:2.5rem;">
          <div style="width:42px;height:42px;border-radius:0.5rem;background:#000000;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <div style="width:26px;height:26px;display:flex;align-items:center;justify-content:center;">
              ${icons.brandLogo}
            </div>
          </div>
          <div>
            <span class="afri-modal-eyebrow" style="margin-bottom:0.125rem;">AfriWidget • Free Tools</span>
            <h2 id="afriShareModalTitle" class="afri-modal-title" style="margin:0;font-size:1.25rem;">Share Your Result</h2>
          </div>
        </div>
        <p class="afri-modal-desc">
          Anyone opening this link will see your exact inputs and computed calculations loaded in their browser.
        </p>

        <div class="afri-copy-box">
          <label for="afriShareLinkInput" class="afri-copy-label">Direct Shareable Link</label>
          <div class="afri-copy-box-row">
            <input id="afriShareLinkInput" type="text" readonly value="${url}" class="afri-copy-input" spellcheck="false" />
            <button id="afriModalCopyBtn" type="button" class="afri-copy-btn">
              ${icons.copy}
              <span>Copy</span>
            </button>
          </div>
        </div>

        <div>
          <span class="afri-social-label">Share Directly Via</span>
          <div class="afri-social-grid">
            <a href="https://api.whatsapp.com/send?text=${shareText}${encodedUrl}" target="_blank" rel="noopener noreferrer" class="afri-social-item">
              ${icons.whatsapp}
              <span>WhatsApp</span>
            </a>
            <a href="https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}" target="_blank" rel="noopener noreferrer" class="afri-social-item">
              ${icons.x}
              <span>X</span>
            </a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" rel="noopener noreferrer" class="afri-social-item">
              ${icons.facebook}
              <span>Facebook</span>
            </a>
            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}" target="_blank" rel="noopener noreferrer" class="afri-social-item">
              ${icons.linkedin}
              <span>LinkedIn</span>
            </a>
            <a href="https://t.me/share/url?url=${encodedUrl}&text=${shareText}" target="_blank" rel="noopener noreferrer" class="afri-social-item">
              ${icons.telegram}
              <span>Telegram</span>
            </a>
            <a href="mailto:?subject=${encodeURIComponent(title + ' – AfriWidget')}&body=${shareText}${encodedUrl}" class="afri-social-item">
              ${icons.email}
              <span>Email</span>
            </a>
          </div>
        </div>
      </div>
    `;

    const closeBtn = overlay.querySelector('#afriModalCloseBtn');
    closeBtn?.addEventListener('click', () => overlay.classList.remove('afri-modal-open'));

    const input = overlay.querySelector('#afriShareLinkInput');
    input?.addEventListener('click', () => input.select());

    const copyBtn = overlay.querySelector('#afriModalCopyBtn');
    copyBtn?.addEventListener('click', () => {
      copyToClipboard(url, copyBtn);
    });

    requestAnimationFrame(() => {
      overlay.classList.add('afri-modal-open');
    });
  }

  function handleShareClick(adapterConfig, triggerButton) {
    const url = getShareUrl(adapterConfig);
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const title = document.title.replace(/\s*[|—-]\s*AfriWidget.*$/i, '').trim();

    if (isMobile && navigator.share) {
      navigator.share({
        title: `${title} – AfriWidget`,
        text: `Check out my calculation on AfriWidget (${title}):`,
        url: url
      }).catch(err => {
        if (err?.name !== 'AbortError') {
          openShareModal(url);
        }
      });
    } else {
      openShareModal(url);
    }
  }

  function findResultHost() {
    return $('#results') ||
      $('#cfResults') ||
      $('#resultsCard') ||
      $('#gpaResult')?.closest('.calc-panel, section, div') ||
      $('#jambResult')?.closest('.calc-panel, section, div') ||
      $('#apsResult')?.closest('.calc-panel, section, div') ||
      $('#kcseResult')?.closest('.calc-panel, section, div') ||
      $('#aggregateResult')?.closest('.calc-panel, section, div') ||
      $('#eligibilityCard') ||
      $('.results') ||
      $('.calc-panel');
  }

  function injectShareBar(adapterConfig) {
    if (document.getElementById('afriShareBar')) return;
    const host = findResultHost();
    if (!host) return;

    const bar = document.createElement('div');
    bar.id = 'afriShareBar';
    bar.className = 'afri-share-bar';
    bar.innerHTML = `
      <div class="afri-share-inner">
        <div class="afri-share-info">
          <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.375rem;">
            <div style="width:20px;height:20px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              ${icons.brandLogo}
            </div>
            <span class="afri-share-eyebrow" style="margin-bottom:0;">Share Calculation</span>
          </div>
          <h3 class="afri-share-title">Save or Share Your Result</h3>
          <p class="afri-share-desc">
            Send this completed calculation to mentors, family, or save a permanent bookmark link.
          </p>
        </div>
        <div class="afri-share-actions">
          <button id="afriBarWhatIfBtn" type="button" class="afri-btn afri-btn-secondary" style="border: 1px solid #facc15; color: #facc15;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1rem;height:1rem;flex-shrink:0;"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
            <span>What-If Target</span>
          </button>
          <button id="afriBarCopyBtn" type="button" class="afri-btn afri-btn-primary">
            ${icons.copy}
            <span>Copy Link</span>
          </button>
          <button id="afriBarModalBtn" type="button" class="afri-btn afri-btn-secondary">
            ${icons.share}
            <span>Share</span>
          </button>
        </div>
      </div>
    `;

    // Smart insertion:
    if (host.id === 'results' || host.id === 'cfResults' || host.classList.contains('results')) {
      host.appendChild(bar);
    } else if (host.classList.contains('calc-panel')) {
      host.insertAdjacentElement('afterend', bar);
    } else {
      host.appendChild(bar);
    }

    const copyBtn = document.getElementById('afriBarCopyBtn');
    copyBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      const url = getShareUrl(adapterConfig);
      copyToClipboard(url, copyBtn);
    });

    const modalBtn = document.getElementById('afriBarModalBtn');
    modalBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      handleShareClick(adapterConfig, modalBtn);
    });

    const whatIfBtn = document.getElementById('afriBarWhatIfBtn');
    whatIfBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      const root = document.getElementById('afriwidget-whatif-root');
      if (root) {
        root.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // Also support any inline share buttons marked with data-share-btn or .share-btn
    $$('[data-share-btn], .share-btn, #shareBtn, #shareResultsBtn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        handleShareClick(adapterConfig, btn);
      });
    });
  }

  function restoreInputs(adapterConfig) {
    if (!hasSharedInputs) return;

    const values = Array.from(params.entries())
      .filter(([key]) => key !== 'shared')
      .map(([key, value]) => ({ key, value }));

    if (adapterConfig && typeof adapterConfig.restore === 'function') {
      adapterConfig.restore(values);
    } else {
      const form = $('form') || $('.calc-panel');
      if (form) {
        // Handle unit toggle if imperial values exist
        if (params.has('weightLbs') || params.has('heightFeet')) {
          $('#unitImperial')?.click();
        }

        values.forEach(({ key, value }) => {
          let el = document.getElementById(key) || form.querySelector(`[name="${CSS.escape(key)}"]`);
          if (!el) {
            const radios = form.querySelectorAll(`input[type="radio"][name="${CSS.escape(key)}"]`);
            radios.forEach(r => {
              if (r.value === value) {
                r.checked = true;
                r.dispatchEvent(new Event('change', { bubbles: true }));
              }
            });
            return;
          }

          if (el.type === 'checkbox') {
            el.checked = value === '1' || value === 'true';
            el.dispatchEvent(new Event('change', { bubbles: true }));
          } else if (el.type === 'radio') {
            el.checked = el.value === value;
            el.dispatchEvent(new Event('change', { bubbles: true }));
          } else {
            el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
      }
    }

    // Trigger calculation
    setTimeout(() => {
      try {
        adapterConfig?.calculate?.();
      } catch (err) {
        console.warn('Share auto-calculate notice:', err);
      }
      showToast('Calculation restored from shared link');
    }, 150);
  }

  function ensurePwaMetaTags() {
    if (!document.querySelector('link[rel="manifest"]')) {
      const manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = '/manifest.json';
      document.head.appendChild(manifestLink);
    }
    if (!document.querySelector('link[rel="icon"][sizes="192x192"]')) {
      const icon192 = document.createElement('link');
      icon192.rel = 'icon';
      icon192.type = 'image/png';
      icon192.sizes = '192x192';
      icon192.href = '/favicon-192.png';
      document.head.appendChild(icon192);
    }
    if (!document.querySelector('link[rel="icon"][sizes="512x512"]')) {
      const icon512 = document.createElement('link');
      icon512.rel = 'icon';
      icon512.type = 'image/png';
      icon512.sizes = '512x512';
      icon512.href = '/favicon-512.png';
      document.head.appendChild(icon512);
    }
    if (!document.querySelector('meta[name="theme-color"]')) {
      const themeColor = document.createElement('meta');
      themeColor.name = 'theme-color';
      themeColor.content = '#000000';
      document.head.appendChild(themeColor);
    }
  }

  function ensureWhatIfSimulator() {
    if (!document.querySelector('script[src*="what-if-simulator.js"]')) {
      const s = document.createElement('script');
      s.src = '/what-if-simulator.js';
      s.defer = true;
      document.body.appendChild(s);
    }
  }

  function init() {
    ensurePwaMetaTags();
    injectShareStyles();
    const config = getAdapter();
    injectShareBar(config);
    restoreInputs(config);
    ensureWhatIfSimulator();
  }

  onReady(init);
})();
