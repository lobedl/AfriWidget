/**
 * AfriWidget Calculation History & Progress Comparison ("My Saved Runs")
 * Allows users to save calculation runs, track progress over time, restore inputs, and compare runs side-by-side.
 *
 * Rules:
 * - 100% Client-side privacy (localStorage 'afriwidget_saved_runs').
 * - Zero Emojis (Pure crisp SVG icons).
 * - Zero Tailwind (Self-contained vanilla CSS).
 * - Fully responsive and touch-optimized.
 * - Matches AfriWidget Brand System (#000000, #facc15, #fde047, #ffffff, #111827, #e5e5e5).
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'afriwidget_saved_runs';

  // SVG Icons (Zero Emojis)
  const ICONS = {
    history: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    bookmark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
    bookmarkFilled: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
    compare: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>`,
    restore: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>`,
    trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
    edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`,
    arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    trendUp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
    brandLogo: `<svg viewBox="0 0 36 36" fill="none" aria-hidden="true"><path d="M18 4L20.5 14L30 18L20.5 22L18 32L15.5 22L6 18L15.5 14Z" fill="#FACC15"/><circle cx="28" cy="9" r="2.5" fill="#CA8A04"/><circle cx="9" cy="11" r="1.5" fill="#FACC15" opacity="0.7"/></svg>`
  };

  // Helper DOM utilities
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function getPageSlug() {
    return location.pathname.split('/').pop().replace(/\.html$/, '') || 'home';
  }

  function getToolTitle() {
    const heading = $('h1') || $('.calc-panel-title') || $('h2');
    if (heading) {
      const text = heading.textContent.replace(/Last Updated.*$/i, '').trim();
      if (text) return text;
    }
    const title = document.title.split('|')[0].split('-')[0].trim();
    return title || 'Calculator Tool';
  }

  function isCalculatorPage() {
    const slug = getPageSlug();
    const hubPages = ['home', '', 'education', 'finance', 'health', 'productivity', 'business', 'use-cases', 'about', 'contact', 'terms', 'privacy-policy', 'cookie-policy', 'adsense-disclaimer', '404', 'faq'];
    if (hubPages.includes(slug)) return false;
    return !!(findResultHost() || $('form') || $('.calc-panel'));
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
      null;
  }

  // Storage Methods
  function getAllSavedRuns() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveAllRuns(runs) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(runs));
      updateNavBadges();
      updateInlineBar();
    } catch (err) {
      console.warn('Could not save runs to localStorage', err);
    }
  }

  function getRunsForCurrentTool() {
    const slug = getPageSlug();
    return getAllSavedRuns().filter(r => r.toolSlug === slug);
  }

  function addRun(runData) {
    const runs = getAllSavedRuns();
    runs.unshift(runData); // prepend
    // Keep max 100 runs overall to protect storage
    if (runs.length > 100) runs.length = 100;
    saveAllRuns(runs);
    return runData;
  }

  function deleteRun(id) {
    const runs = getAllSavedRuns().filter(r => r.id !== id);
    saveAllRuns(runs);
  }

  function updateRunLabel(id, newLabel) {
    const runs = getAllSavedRuns();
    const run = runs.find(r => r.id === id);
    if (run) {
      run.label = newLabel.trim() || run.label;
      saveAllRuns(runs);
    }
  }

  function clearAllRunsForCurrentTool() {
    const slug = getPageSlug();
    const runs = getAllSavedRuns().filter(r => r.toolSlug !== slug);
    saveAllRuns(runs);
  }

  function clearEveryRun() {
    saveAllRuns([]);
  }

  // Capture Inputs and Results from the current page
  function captureCurrentInputs() {
    const form = $('form') || $('.calc-panel') || document;
    const fields = $$(
      'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]), select, textarea',
      form
    );

    const inputs = [];

    fields.forEach((field, index) => {
      const key = field.id || field.name || `field_${index}`;
      let label = '';

      if (field.id) {
        const lbl = $(`label[for="${CSS.escape(field.id)}"]`, form) || $(`label[for="${CSS.escape(field.id)}"]`);
        if (lbl) {
          label = lbl.textContent.replace(/Alt [AB].*$/i, '').trim();
        }
      }

      if (!label) {
        const parentField = field.closest('.field, .field-group, .form-group, div');
        const parentLbl = parentField?.querySelector('.field-label, label');
        if (parentLbl) {
          label = parentLbl.textContent.trim();
        }
      }

      if (!label) {
        label = field.getAttribute('aria-label') || field.name || field.id || `Input ${index + 1}`;
      }

      // Clean label
      label = label.replace(/\s+/g, ' ').trim();

      let value = '';
      let displayValue = '';

      if (field.tagName === 'SELECT') {
        const sel = field;
        value = sel.value;
        if (sel.selectedIndex >= 0) {
          displayValue = sel.options[sel.selectedIndex]?.text.trim() || sel.value;
        }
      } else if (field.type === 'checkbox' || field.type === 'radio') {
        value = field.checked ? field.value || 'true' : '';
        displayValue = field.checked ? 'Selected' : 'Not selected';
      } else {
        value = field.value;
        displayValue = field.value;
      }

      if (value !== '') {
        inputs.push({
          key,
          label: label.substring(0, 40),
          value,
          displayValue: displayValue.substring(0, 60)
        });
      }
    });

    return inputs;
  }

  function captureCurrentSummary() {
    const host = findResultHost() || $('.calc-panel') || document;

    // 1. Primary Big Metric
    let primaryMetric = '';
    const bigElem = host.querySelector(
      '.mean-big, .aggregate-big, .score-big, .gpa-badge, .bmi-badge, #meanGradeValue, #aggregateValue, #pointsValue, #divisionValue, #best5Value, #tcuValue, #totalAmount, #monthlyPayment, #bmiValue, .result-hero-value, .stat-value.accent'
    );

    if (bigElem) {
      const text = bigElem.textContent.trim();
      if (text && text !== '—') {
        const eyebrow = host.querySelector('.results-eyebrow, .aggregate-note, .mean-note, .stat-label')?.textContent.trim();
        primaryMetric = text;
        if (eyebrow && eyebrow.length < 35 && !primaryMetric.toLowerCase().includes(eyebrow.toLowerCase())) {
          primaryMetric = `${eyebrow}: ${text}`;
        }
      }
    }

    if (!primaryMetric) {
      const firstStat = host.querySelector('.stat-value');
      if (firstStat) {
        const lbl = firstStat.closest('.stat-card')?.querySelector('.stat-label')?.textContent.trim();
        primaryMetric = lbl ? `${lbl}: ${firstStat.textContent.trim()}` : firstStat.textContent.trim();
      }
    }

    if (!primaryMetric) {
      primaryMetric = 'Completed Calculation';
    }

    // 2. Secondary Metrics / Stat Grid
    const statCards = $$('.stat-card, .metric-card, .summary-item', host);
    const stats = [];

    statCards.forEach(card => {
      const lbl = card.querySelector('.stat-label, .metric-label, .summary-label')?.textContent.trim();
      const val = card.querySelector('.stat-value, .metric-value, .summary-value')?.textContent.trim();
      const sub = card.querySelector('.stat-sub, .metric-sub')?.textContent.trim();
      if (lbl && val && val !== '—') {
        stats.push({
          label: lbl,
          value: sub ? `${val} (${sub})` : val
        });
      }
    });

    // 3. Verdict or Tier
    let verdict = '';
    const tierElem = host.querySelector('.tier-box, #tierText, #interpretation, #verdict, .verdict-text, .result-desc, p.interpretation');
    if (tierElem) {
      verdict = tierElem.textContent.replace(/^What this opens:\s*/i, '').trim();
    }

    return {
      primaryMetric: primaryMetric.substring(0, 80),
      stats: stats.slice(0, 6),
      verdict: verdict ? verdict.substring(0, 240) : ''
    };
  }

  function restoreInputsFromRun(run) {
    if (!run || !Array.isArray(run.inputs)) return;

    const form = $('form') || $('.calc-panel');
    if (!form) return;

    let restoredCount = 0;

    run.inputs.forEach(({ key, value }) => {
      let el = document.getElementById(key) || form.querySelector(`[name="${CSS.escape(key)}"]`);
      if (!el) {
        // Try radio button match
        const radios = form.querySelectorAll(`input[type="radio"][name="${CSS.escape(key)}"]`);
        if (radios.length) {
          radios.forEach(r => {
            r.checked = (r.value === value);
          });
          restoredCount++;
          return;
        }
      }

      if (el) {
        if (el.type === 'checkbox') {
          el.checked = (value === el.value || value === 'true' || value === 'Selected');
        } else {
          el.value = value;
        }

        // Trigger change & input events
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        restoredCount++;
      }
    });

    // Recalculate
    setTimeout(() => {
      const calcBtn = form.querySelector('.btn-calc, button[type="submit"], #calcBtn, #calculateBtn, input[type="submit"]') || form.querySelector('button');
      if (calcBtn) {
        calcBtn.click();
      } else if (typeof form.requestSubmit === 'function') {
        form.requestSubmit();
      }
    }, 120);

    showToast(`Restored inputs from "${run.label}" (${restoredCount} fields loaded).`);
  }

  // Toast Notification
  function showToast(message) {
    let toast = document.getElementById('afriRunsToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'afriRunsToast';
      toast.className = 'afri-runs-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="afri-runs-toast-icon">${ICONS.check}</span><span>${message}</span>`;
    toast.classList.add('is-visible');

    if (toast._timer) clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 3600);
  }

  // Self-Contained Pure Vanilla CSS (Zero Tailwind, Zero Emojis)
  function injectStyles() {
    if (document.getElementById('afriwidget-saved-runs-styles')) return;

    const style = document.createElement('style');
    style.id = 'afriwidget-saved-runs-styles';
    style.textContent = `
      /* Universal Reset for Saved Runs Components */
      .afri-runs-bar, .afri-runs-drawer, .afri-runs-modal, .afri-runs-toast {
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        color: #000000;
      }
      .afri-runs-bar *, .afri-runs-drawer *, .afri-runs-modal *, .afri-runs-toast * {
        box-sizing: border-box;
      }

      /* In-Page Saved Runs Action Bar */
      .afri-runs-bar {
        display: block;
        margin: 1.25rem 0;
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-left: 4px solid #000000;
        border-radius: 0.75rem;
        padding: 1.125rem 1.25rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        width: 100%;
        transition: border-color 0.15s ease;
      }
      .afri-runs-bar:hover {
        border-color: #d1d5db;
        border-left-color: #facc15;
      }
      .afri-runs-bar-inner {
        display: flex;
        flex-direction: column;
        gap: 0.875rem;
      }
      @media (min-width: 640px) {
        .afri-runs-bar-inner {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 1.25rem;
        }
      }
      .afri-runs-bar-info {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
      }
      .afri-runs-bar-icon {
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 0.5rem;
        background: #000000;
        color: #facc15;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .afri-runs-bar-icon svg {
        width: 1.25rem;
        height: 1.25rem;
      }
      .afri-runs-bar-title {
        font-size: 0.9375rem;
        font-weight: 800;
        color: #000000;
        margin: 0 0 0.125rem 0;
        line-height: 1.3;
      }
      .afri-runs-bar-desc {
        font-size: 0.8125rem;
        color: #6b7280;
        margin: 0;
        line-height: 1.4;
      }
      .afri-runs-bar-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      .afri-runs-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.375rem;
        font-size: 0.8125rem;
        font-weight: 700;
        padding: 0.5rem 0.875rem;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.15s ease;
        line-height: 1;
        font-family: inherit;
        text-decoration: none;
        white-space: nowrap;
        border: 1px solid transparent;
        min-height: 2.25rem;
      }
      .afri-runs-btn svg {
        width: 0.9375rem;
        height: 0.9375rem;
        flex-shrink: 0;
      }
      .afri-runs-btn-yellow {
        background: #facc15;
        color: #000000;
        border-color: #facc15;
      }
      .afri-runs-btn-yellow:hover {
        background: #fde047;
        border-color: #fde047;
        transform: translateY(-1px);
      }
      .afri-runs-btn-outline {
        background: #ffffff;
        color: #111827;
        border-color: #e5e5e5;
      }
      .afri-runs-btn-outline:hover {
        background: #f9fafb;
        border-color: #000000;
        color: #000000;
      }
      .afri-runs-btn-dark {
        background: #000000;
        color: #ffffff;
      }
      .afri-runs-btn-dark:hover {
        background: #1f2937;
        color: #fde047;
      }
      .afri-runs-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #000000;
        color: #facc15;
        font-size: 0.6875rem;
        font-weight: 800;
        padding: 0.125rem 0.375rem;
        border-radius: 9999px;
        min-width: 1.125rem;
        height: 1.125rem;
        margin-left: 0.125rem;
      }
      .afri-runs-btn-yellow .afri-runs-badge {
        background: #000000;
        color: #facc15;
      }

      /* Navigation Bar Runs Button */
      .nav-runs-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        background: transparent;
        color: #cbd5e1;
        font-size: 0.875rem;
        font-weight: 600;
        padding: 0.375rem 0.625rem;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.15s ease;
        line-height: 1;
        font-family: inherit;
      }
      .nav-runs-btn:hover {
        color: #fde047;
        border-color: rgba(250, 204, 21, 0.4);
        background: rgba(255, 255, 255, 0.05);
      }
      .nav-runs-btn svg {
        width: 1rem;
        height: 1rem;
        flex-shrink: 0;
      }
      .nav-runs-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #facc15;
        color: #000000;
        font-size: 0.6875rem;
        font-weight: 800;
        width: 1.125rem;
        height: 1.125rem;
        border-radius: 9999px;
        line-height: 1;
      }

      /* Drawer Backdrop */
      .afri-runs-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(2px);
        z-index: 9998;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s ease, visibility 0.2s ease;
      }
      .afri-runs-backdrop.is-open {
        opacity: 1;
        visibility: visible;
      }

      /* Slide-out Drawer */
      .afri-runs-drawer {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        max-width: 480px;
        background: #ffffff;
        box-shadow: -10px 0 30px rgba(0, 0, 0, 0.25);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        transform: translateX(100%);
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .afri-runs-drawer.is-open {
        transform: translateX(0);
      }

      /* Drawer Header */
      .afri-runs-header {
        background: #000000;
        color: #ffffff;
        padding: 1.125rem 1.25rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      .afri-runs-header-brand {
        display: flex;
        align-items: center;
        gap: 0.625rem;
      }
      .afri-runs-header-brand svg {
        width: 1.375rem;
        height: 1.375rem;
      }
      .afri-runs-header-title {
        font-size: 1.0625rem;
        font-weight: 800;
        color: #ffffff;
        margin: 0;
      }
      .afri-runs-close-btn {
        background: transparent;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        padding: 0.375rem;
        border-radius: 0.375rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.15s ease, background 0.15s ease;
      }
      .afri-runs-close-btn:hover {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.1);
      }
      .afri-runs-close-btn svg {
        width: 1.25rem;
        height: 1.25rem;
      }

      /* Tabs */
      .afri-runs-tabs {
        display: flex;
        background: #f3f4f6;
        padding: 0.375rem;
        gap: 0.375rem;
        border-bottom: 1px solid #e5e5e5;
      }
      .afri-runs-tab {
        flex: 1;
        background: transparent;
        border: none;
        padding: 0.5rem 0.75rem;
        font-size: 0.8125rem;
        font-weight: 700;
        color: #4b5563;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: all 0.15s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.375rem;
        font-family: inherit;
      }
      .afri-runs-tab.is-active {
        background: #ffffff;
        color: #000000;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      }

      /* Drawer Body */
      .afri-runs-body {
        flex: 1;
        overflow-y: auto;
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        background: #fafafa;
      }

      /* Empty State */
      .afri-runs-empty {
        text-align: center;
        padding: 3rem 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #6b7280;
      }
      .afri-runs-empty-icon {
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 9999px;
        background: #e5e7eb;
        color: #9ca3af;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
      }
      .afri-runs-empty-icon svg {
        width: 1.75rem;
        height: 1.75rem;
      }
      .afri-runs-empty-title {
        font-size: 1rem;
        font-weight: 800;
        color: #111827;
        margin: 0 0 0.375rem 0;
      }
      .afri-runs-empty-desc {
        font-size: 0.8125rem;
        color: #6b7280;
        margin: 0;
        max-width: 280px;
        line-height: 1.5;
      }

      /* Run Card */
      .afri-run-card {
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-radius: 0.75rem;
        padding: 1.125rem;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }
      .afri-run-card:hover {
        border-color: #cbd5e1;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
      }
      .afri-run-card-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 0.75rem;
      }
      .afri-run-card-title-wrap {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
        flex: 1;
      }
      .afri-run-card-label {
        font-size: 0.9375rem;
        font-weight: 800;
        color: #000000;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.375rem;
      }
      .afri-run-card-edit-btn {
        background: transparent;
        border: none;
        color: #9ca3af;
        cursor: pointer;
        padding: 0.125rem;
        border-radius: 0.25rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: color 0.15s ease;
      }
      .afri-run-card-edit-btn:hover {
        color: #000000;
      }
      .afri-run-card-edit-btn svg {
        width: 0.8125rem;
        height: 0.8125rem;
      }
      .afri-run-card-meta {
        font-size: 0.75rem;
        color: #6b7280;
        display: flex;
        align-items: center;
        gap: 0.375rem;
      }
      .afri-run-badge-primary {
        background: #fefce8;
        border: 1px solid #fde047;
        color: #854d0e;
        font-size: 0.8125rem;
        font-weight: 800;
        padding: 0.25rem 0.5rem;
        border-radius: 0.375rem;
        display: inline-block;
        line-height: 1.2;
      }
      .afri-run-card-stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.375rem;
        background: #f9fafb;
        padding: 0.625rem;
        border-radius: 0.5rem;
        font-size: 0.75rem;
      }
      .afri-run-stat-item {
        display: flex;
        flex-direction: column;
      }
      .afri-run-stat-lbl {
        color: #6b7280;
        font-size: 0.6875rem;
        font-weight: 500;
      }
      .afri-run-stat-val {
        color: #000000;
        font-weight: 700;
      }
      .afri-run-card-verdict {
        font-size: 0.75rem;
        color: #4b5563;
        line-height: 1.4;
        background: #f3f4f6;
        padding: 0.5rem 0.625rem;
        border-radius: 0.375rem;
        border-left: 2px solid #000000;
      }
      .afri-run-card-inputs-toggle {
        font-size: 0.75rem;
        color: #4b5563;
        background: transparent;
        border: none;
        padding: 0;
        cursor: pointer;
        text-decoration: underline;
        text-align: left;
        font-family: inherit;
      }
      .afri-run-card-inputs-toggle:hover {
        color: #000000;
      }
      .afri-run-card-inputs-box {
        display: none;
        background: #f9fafb;
        border: 1px solid #e5e5e5;
        border-radius: 0.375rem;
        padding: 0.5rem;
        font-size: 0.6875rem;
        max-height: 140px;
        overflow-y: auto;
      }
      .afri-run-card-inputs-box.is-visible {
        display: block;
      }
      .afri-run-input-row {
        display: flex;
        justify-content: space-between;
        padding: 0.125rem 0;
        border-bottom: 1px dashed #e5e5e5;
      }
      .afri-run-input-row:last-child {
        border-bottom: none;
      }
      .afri-run-input-lbl {
        color: #6b7280;
      }
      .afri-run-input-val {
        color: #000000;
        font-weight: 600;
      }

      /* Card Actions */
      .afri-run-card-actions {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        border-top: 1px solid #f3f4f6;
        padding-top: 0.625rem;
        flex-wrap: wrap;
      }
      .afri-run-action-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.75rem;
        font-weight: 700;
        padding: 0.375rem 0.625rem;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: all 0.15s ease;
        line-height: 1;
        font-family: inherit;
        border: 1px solid transparent;
      }
      .afri-run-action-btn svg {
        width: 0.8125rem;
        height: 0.8125rem;
      }
      .afri-run-action-load {
        background: #000000;
        color: #ffffff;
      }
      .afri-run-action-load:hover {
        background: #1f2937;
        color: #fde047;
      }
      .afri-run-action-compare {
        background: #ffffff;
        color: #111827;
        border-color: #d1d5db;
      }
      .afri-run-action-compare:hover {
        background: #f9fafb;
        border-color: #000000;
      }
      .afri-run-action-delete {
        background: transparent;
        color: #9ca3af;
        margin-left: auto;
      }
      .afri-run-action-delete:hover {
        color: #dc2626;
        background: #fef2f2;
      }

      /* Drawer Footer */
      .afri-runs-footer {
        padding: 1rem 1.25rem;
        background: #ffffff;
        border-top: 1px solid #e5e5e5;
        display: flex;
        flex-direction: column;
        gap: 0.625rem;
      }
      .afri-runs-footer-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
      }
      .afri-runs-privacy-note {
        font-size: 0.6875rem;
        color: #9ca3af;
        text-align: center;
        margin: 0;
      }

      /* Modal for Save Run Prompt & Comparison */
      .afri-runs-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.65);
        backdrop-filter: blur(2px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s ease, visibility 0.2s ease;
      }
      .afri-runs-modal-overlay.is-open {
        opacity: 1;
        visibility: visible;
      }
      .afri-runs-modal {
        background: #ffffff;
        border-radius: 0.875rem;
        width: 100%;
        max-width: 520px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        max-height: 90vh;
        overflow: hidden;
        border: 1px solid #e5e5e5;
      }
      .afri-runs-modal-header {
        background: #000000;
        color: #ffffff;
        padding: 1.125rem 1.25rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .afri-runs-modal-title {
        font-size: 1.0625rem;
        font-weight: 800;
        color: #ffffff;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .afri-runs-modal-body {
        padding: 1.25rem;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .afri-runs-modal-footer {
        padding: 0.875rem 1.25rem;
        background: #f9fafb;
        border-top: 1px solid #e5e5e5;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.625rem;
      }

      /* Form elements in Modal */
      .afri-runs-form-group {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }
      .afri-runs-form-label {
        font-size: 0.8125rem;
        font-weight: 700;
        color: #111827;
      }
      .afri-runs-form-input {
        width: 100%;
        padding: 0.625rem 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        font-family: inherit;
        outline: none;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }
      .afri-runs-form-input:focus {
        border-color: #000000;
        box-shadow: 0 0 0 2px rgba(250, 204, 21, 0.5);
      }
      .afri-runs-preview-box {
        background: #f9fafb;
        border: 1px solid #e5e5e5;
        border-radius: 0.5rem;
        padding: 0.875rem;
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }
      .afri-runs-preview-tool {
        font-size: 0.75rem;
        font-weight: 600;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .afri-runs-preview-metric {
        font-size: 1rem;
        font-weight: 800;
        color: #000000;
      }

      /* Comparison Modal Specific */
      .afri-compare-modal {
        max-width: 680px;
      }
      .afri-compare-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.875rem;
      }
      @media (min-width: 600px) {
        .afri-compare-grid {
          grid-template-columns: 1fr 1fr;
        }
      }
      .afri-compare-column {
        background: #f9fafb;
        border: 1px solid #e5e5e5;
        border-radius: 0.625rem;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.625rem;
      }
      .afri-compare-column.is-new {
        border-color: #fde047;
        background: #fffdf5;
      }
      .afri-compare-col-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #e5e5e5;
      }
      .afri-compare-tag {
        font-size: 0.6875rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 0.125rem 0.375rem;
        border-radius: 0.25rem;
        background: #e5e7eb;
        color: #374151;
      }
      .afri-compare-column.is-new .afri-compare-tag {
        background: #facc15;
        color: #000000;
      }
      .afri-compare-date {
        font-size: 0.6875rem;
        color: #6b7280;
      }
      .afri-compare-label {
        font-size: 0.9375rem;
        font-weight: 800;
        color: #000000;
        margin: 0;
      }
      .afri-compare-metric-box {
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-radius: 0.5rem;
        padding: 0.75rem;
        text-align: center;
      }
      .afri-compare-metric-val {
        font-size: 1.125rem;
        font-weight: 900;
        color: #000000;
      }
      .afri-compare-diff-banner {
        background: #000000;
        color: #ffffff;
        border-radius: 0.5rem;
        padding: 0.75rem 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
      }
      .afri-compare-diff-title {
        font-size: 0.8125rem;
        font-weight: 700;
        color: #cbd5e1;
      }
      .afri-compare-diff-badge {
        font-size: 0.875rem;
        font-weight: 800;
        color: #facc15;
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
      }
      .afri-compare-diff-badge svg {
        width: 1rem;
        height: 1rem;
      }
      .afri-compare-table-title {
        font-size: 0.8125rem;
        font-weight: 800;
        color: #111827;
        margin: 0.5rem 0 0.25rem 0;
      }
      .afri-compare-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.75rem;
      }
      .afri-compare-table th {
        text-align: left;
        padding: 0.5rem;
        background: #f3f4f6;
        color: #4b5563;
        font-weight: 700;
        border-bottom: 1px solid #e5e5e5;
      }
      .afri-compare-table td {
        padding: 0.5rem;
        border-bottom: 1px solid #f3f4f6;
        color: #111827;
      }
      .afri-compare-table tr.is-diff {
        background: #fefce8;
      }
      .afri-compare-table tr.is-diff td {
        font-weight: 600;
      }

      /* Toast */
      .afri-runs-toast {
        position: fixed;
        bottom: 1.5rem;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: #000000;
        color: #ffffff;
        padding: 0.75rem 1.25rem;
        border-radius: 9999px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        display: inline-flex;
        align-items: center;
        gap: 0.625rem;
        font-size: 0.875rem;
        font-weight: 600;
        z-index: 10001;
        opacity: 0;
        pointer-events: none;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        border: 1px solid rgba(255, 255, 255, 0.15);
        max-width: 90vw;
        text-align: center;
      }
      .afri-runs-toast.is-visible {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
        pointer-events: auto;
      }
      .afri-runs-toast-icon {
        color: #facc15;
        display: flex;
        align-items: center;
        flex-shrink: 0;
      }
      .afri-runs-toast-icon svg {
        width: 1.125rem;
        height: 1.125rem;
      }
    `;
    document.head.appendChild(style);
  }

  // Inject Navigation Bar Button
  function injectNavRunsButton() {
    // 1. Desktop Nav
    const navLinks = $('.nav-links');
    if (navLinks && !$('#afriNavRunsBtn')) {
      const btn = document.createElement('button');
      btn.id = 'afriNavRunsBtn';
      btn.type = 'button';
      btn.className = 'nav-runs-btn';
      btn.setAttribute('aria-label', 'Open calculation history');
      btn.innerHTML = `
        ${ICONS.history}
        <span>Saved Runs</span>
        <span id="afriNavRunsBadge" class="nav-runs-badge" style="display:none">0</span>
      `;
      btn.addEventListener('click', () => openRunsDrawer());

      // Place next to Favourites or Legal dropdown
      const favBtn = $('#afriNavFavBtn');
      const dropdown = navLinks.querySelector('.nav-dropdown');
      if (favBtn) {
        navLinks.insertBefore(btn, favBtn.nextSibling);
      } else if (dropdown) {
        navLinks.insertBefore(btn, dropdown);
      } else {
        navLinks.appendChild(btn);
      }
    }

    // 2. Mobile Nav Menu
    const mobileMenu = $('#mobileMenu');
    if (mobileMenu && !$('#afriMobileRunsLink')) {
      const link = document.createElement('a');
      link.id = 'afriMobileRunsLink';
      link.href = '#';
      link.className = 'mobile-nav-link';
      link.innerHTML = `
        <span style="display:inline-flex;align-items:center;gap:0.5rem;">
          <span style="display:inline-flex;align-items:center;width:1.25rem;height:1.25rem;color:#facc15;">${ICONS.history}</span>
          <span>My Saved Runs</span>
        </span>
        <span id="afriMobileRunsBadge" class="nav-runs-badge" style="display:none">0</span>
      `;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        mobileMenu.classList.remove('open');
        openRunsDrawer();
      });

      const mobileFav = $('#afriMobileFavLink');
      if (mobileFav) {
        mobileMenu.insertBefore(link, mobileFav.nextSibling);
      } else {
        mobileMenu.appendChild(link);
      }
    }

    updateNavBadges();
  }

  function updateNavBadges() {
    const total = getAllSavedRuns().length;
    const desktopBadge = $('#afriNavRunsBadge');
    if (desktopBadge) {
      if (total > 0) {
        desktopBadge.textContent = total > 99 ? '99+' : total;
        desktopBadge.style.display = 'inline-flex';
      } else {
        desktopBadge.style.display = 'none';
      }
    }

    const mobileBadge = $('#afriMobileRunsBadge');
    if (mobileBadge) {
      if (total > 0) {
        mobileBadge.textContent = total > 99 ? '99+' : total;
        mobileBadge.style.display = 'inline-flex';
      } else {
        mobileBadge.style.display = 'none';
      }
    }
  }

  // Inject In-Page Action Bar (Runs beside results or share bar)
  function injectInlineBar() {
    if (!isCalculatorPage()) return;
    if ($('#afriRunsBar')) return;

    const host = findResultHost();
    if (!host) return;

    const bar = document.createElement('div');
    bar.id = 'afriRunsBar';
    bar.className = 'afri-runs-bar';

    const runsCount = getRunsForCurrentTool().length;

    bar.innerHTML = `
      <div class="afri-runs-bar-inner">
        <div class="afri-runs-bar-info">
          <div class="afri-runs-bar-icon">
            ${ICONS.history}
          </div>
          <div>
            <h3 class="afri-runs-bar-title">Calculation History &amp; Progress Tracking</h3>
            <p class="afri-runs-bar-desc">Save this run to compare with past results or track performance over time.</p>
          </div>
        </div>
        <div class="afri-runs-bar-actions">
          <button id="afriSaveRunBtn" type="button" class="afri-runs-btn afri-runs-btn-yellow">
            ${ICONS.bookmark}
            <span>Save This Run</span>
          </button>
          <button id="afriViewRunsBtn" type="button" class="afri-runs-btn afri-runs-btn-outline">
            ${ICONS.history}
            <span>Saved Runs</span>
            <span id="afriRunsCountBadge" class="afri-runs-badge" style="${runsCount > 0 ? '' : 'display:none;'}">${runsCount}</span>
          </button>
        </div>
      </div>
    `;

    // Smart placement: insert directly above or below share bar or at bottom of results
    const shareBar = $('#afriShareBar');
    if (shareBar) {
      shareBar.parentNode.insertBefore(bar, shareBar);
    } else if (host.id === 'results' || host.id === 'cfResults' || host.classList.contains('results')) {
      host.appendChild(bar);
    } else if (host.classList.contains('calc-panel')) {
      host.insertAdjacentElement('afterend', bar);
    } else {
      host.appendChild(bar);
    }

    $('#afriSaveRunBtn')?.addEventListener('click', openSaveRunModal);
    $('#afriViewRunsBtn')?.addEventListener('click', () => openRunsDrawer('current'));
  }

  function updateInlineBar() {
    const badge = $('#afriRunsCountBadge');
    if (badge) {
      const count = getRunsForCurrentTool().length;
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-flex' : 'none';
    }
  }

  // Save Run Modal
  function openSaveRunModal() {
    const inputs = captureCurrentInputs();
    const summary = captureCurrentSummary();
    const toolTitle = getToolTitle();
    const slug = getPageSlug();
    const toolRuns = getRunsForCurrentTool();
    const runNumber = toolRuns.length + 1;

    const defaultLabel = `Run #${runNumber} • ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;

    let overlay = $('#afriSaveRunModalOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'afriSaveRunModalOverlay';
      overlay.className = 'afri-runs-modal-overlay';
      document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
      <div class="afri-runs-modal" role="dialog" aria-modal="true" aria-labelledby="afriSaveModalTitle">
        <div class="afri-runs-modal-header">
          <h3 id="afriSaveModalTitle" class="afri-runs-modal-title">
            ${ICONS.bookmark}
            <span>Save Calculation Run</span>
          </h3>
          <button id="afriSaveModalClose" type="button" class="afri-runs-close-btn" aria-label="Close modal">
            ${ICONS.close}
          </button>
        </div>
        <div class="afri-runs-modal-body">
          <div class="afri-runs-preview-box">
            <span class="afri-runs-preview-tool">${toolTitle}</span>
            <span class="afri-runs-preview-metric">${summary.primaryMetric}</span>
            ${summary.verdict ? `<span style="font-size:0.75rem;color:#4b5563;">${summary.verdict.substring(0, 100)}...</span>` : ''}
          </div>

          <div class="afri-runs-form-group">
            <label for="afriRunLabelInput" class="afri-runs-form-label">Run Label / Assessment Name</label>
            <input id="afriRunLabelInput" type="text" class="afri-runs-form-input" value="${defaultLabel}" placeholder="e.g. Mock Exam 1, First Quote, Midterm Target" maxlength="50" autofocus />
          </div>

          <p style="font-size:0.75rem;color:#6b7280;margin:0;">
            This run will be saved in your browser history with all ${inputs.length} input values so you can compare or restore them anytime.
          </p>
        </div>
        <div class="afri-runs-modal-footer">
          <button id="afriSaveModalCancel" type="button" class="afri-runs-btn afri-runs-btn-outline">Cancel</button>
          <button id="afriSaveModalConfirm" type="button" class="afri-runs-btn afri-runs-btn-yellow">
            ${ICONS.check}
            <span>Save Run</span>
          </button>
        </div>
      </div>
    `;

    overlay.classList.add('is-open');

    const input = $('#afriRunLabelInput');
    input?.select();

    const closeModal = () => overlay.classList.remove('is-open');
    $('#afriSaveModalClose')?.addEventListener('click', closeModal);
    $('#afriSaveModalCancel')?.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    $('#afriSaveModalConfirm')?.addEventListener('click', () => {
      const label = input?.value.trim() || defaultLabel;
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      addRun({
        id: 'run_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        toolSlug: slug,
        toolTitle,
        toolUrl: location.pathname,
        timestamp: Date.now(),
        dateStr,
        label,
        summary,
        inputs
      });

      closeModal();
      showToast(`Saved "${label}" to calculation history.`);
    });
  }

  // Saved Runs Drawer
  let currentDrawerTab = 'current';

  function createDrawer() {
    if ($('#afriRunsDrawer')) return;

    const backdrop = document.createElement('div');
    backdrop.id = 'afriRunsBackdrop';
    backdrop.className = 'afri-runs-backdrop';
    document.body.appendChild(backdrop);

    const drawer = document.createElement('div');
    drawer.id = 'afriRunsDrawer';
    drawer.className = 'afri-runs-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'My Saved Runs');

    drawer.innerHTML = `
      <div class="afri-runs-header">
        <div class="afri-runs-header-brand">
          ${ICONS.brandLogo}
          <h2 class="afri-runs-header-title">My Saved Runs</h2>
        </div>
        <button id="afriRunsDrawerClose" type="button" class="afri-runs-close-btn" aria-label="Close saved runs">
          ${ICONS.close}
        </button>
      </div>

      <div class="afri-runs-tabs">
        <button id="afriTabCurrent" type="button" class="afri-runs-tab is-active">
          <span>This Tool</span>
          <span id="afriTabCurrentBadge" class="afri-runs-badge">0</span>
        </button>
        <button id="afriTabAll" type="button" class="afri-runs-tab">
          <span>All Saved Runs</span>
          <span id="afriTabAllBadge" class="afri-runs-badge">0</span>
        </button>
      </div>

      <div id="afriRunsList" class="afri-runs-body"></div>

      <div class="afri-runs-footer">
        <div class="afri-runs-footer-row">
          <button id="afriCompareBtn" type="button" class="afri-runs-btn afri-runs-btn-yellow" style="flex:1;">
            ${ICONS.compare}
            <span>Compare Runs</span>
          </button>
          <button id="afriClearRunsBtn" type="button" class="afri-runs-btn afri-runs-btn-outline" title="Clear runs">
            ${ICONS.trash}
            <span>Clear</span>
          </button>
        </div>
        <p class="afri-runs-privacy-note">100% saved locally in your browser &bull; Zero server storage</p>
      </div>
    `;

    document.body.appendChild(drawer);

    backdrop.addEventListener('click', closeRunsDrawer);
    $('#afriRunsDrawerClose')?.addEventListener('click', closeRunsDrawer);

    $('#afriTabCurrent')?.addEventListener('click', () => {
      currentDrawerTab = 'current';
      renderDrawerContent();
    });

    $('#afriTabAll')?.addEventListener('click', () => {
      currentDrawerTab = 'all';
      renderDrawerContent();
    });

    $('#afriCompareBtn')?.addEventListener('click', () => {
      openCompareModal();
    });

    $('#afriClearRunsBtn')?.addEventListener('click', () => {
      const isCurrent = currentDrawerTab === 'current';
      const promptText = isCurrent
        ? 'Clear all saved runs for this calculator tool?'
        : 'Clear all saved runs across all tools?';
      if (confirm(promptText)) {
        if (isCurrent) {
          clearAllRunsForCurrentTool();
        } else {
          clearEveryRun();
        }
        renderDrawerContent();
        showToast('Saved runs cleared.');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeRunsDrawer();
        $('#afriSaveRunModalOverlay')?.classList.remove('is-open');
        $('#afriCompareModalOverlay')?.classList.remove('is-open');
      }
    });
  }

  function openRunsDrawer(preferredTab = 'current') {
    createDrawer();
    currentDrawerTab = preferredTab;
    renderDrawerContent();

    $('#afriRunsBackdrop')?.classList.add('is-open');
    $('#afriRunsDrawer')?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeRunsDrawer() {
    $('#afriRunsBackdrop')?.classList.remove('is-open');
    $('#afriRunsDrawer')?.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function renderDrawerContent() {
    const list = $('#afriRunsList');
    if (!list) return;

    const currentRuns = getRunsForCurrentTool();
    const allRuns = getAllSavedRuns();

    // Update tab counts
    const tabCur = $('#afriTabCurrent');
    const tabAll = $('#afriTabAll');
    const badgeCur = $('#afriTabCurrentBadge');
    const badgeAll = $('#afriTabAllBadge');

    if (badgeCur) badgeCur.textContent = currentRuns.length;
    if (badgeAll) badgeAll.textContent = allRuns.length;

    if (currentDrawerTab === 'current') {
      tabCur?.classList.add('is-active');
      tabAll?.classList.remove('is-active');
    } else {
      tabAll?.classList.add('is-active');
      tabCur?.classList.remove('is-active');
    }

    const runsToShow = currentDrawerTab === 'current' ? currentRuns : allRuns;

    // Enable/disable compare button
    const compareBtn = $('#afriCompareBtn');
    if (compareBtn) {
      compareBtn.disabled = runsToShow.length < 2;
      compareBtn.style.opacity = runsToShow.length < 2 ? '0.5' : '1';
      compareBtn.style.cursor = runsToShow.length < 2 ? 'not-allowed' : 'pointer';
    }

    if (runsToShow.length === 0) {
      list.innerHTML = `
        <div class="afri-runs-empty">
          <div class="afri-runs-empty-icon">${ICONS.history}</div>
          <h3 class="afri-runs-empty-title">No Saved Runs Yet</h3>
          <p class="afri-runs-empty-desc">
            ${currentDrawerTab === 'current'
              ? 'Calculate your score above and tap "Save This Run" to track and compare attempts.'
              : 'Save calculations from any AfriWidget tool to build a personal history timeline.'}
          </p>
        </div>
      `;
      return;
    }

    list.innerHTML = runsToShow.map((run, idx) => `
      <div class="afri-run-card" data-run-id="${run.id}">
        <div class="afri-run-card-header">
          <div class="afri-run-card-title-wrap">
            <h4 class="afri-run-card-label">
              <span>${run.label}</span>
              <button class="afri-run-card-edit-btn" data-edit-id="${run.id}" title="Rename this run" aria-label="Rename">
                ${ICONS.edit}
              </button>
            </h4>
            <div class="afri-run-card-meta">
              <span>${run.toolTitle}</span>
              <span>&bull;</span>
              <span>${run.dateStr}</span>
            </div>
          </div>
          <div class="afri-run-badge-primary">
            ${run.summary.primaryMetric}
          </div>
        </div>

        ${run.summary.stats && run.summary.stats.length ? `
          <div class="afri-run-card-stats">
            ${run.summary.stats.map(s => `
              <div class="afri-run-stat-item">
                <span class="afri-run-stat-lbl">${s.label}</span>
                <span class="afri-run-stat-val">${s.value}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${run.summary.verdict ? `
          <div class="afri-run-card-verdict">${run.summary.verdict}</div>
        ` : ''}

        <div>
          <button type="button" class="afri-run-card-inputs-toggle" data-toggle-inputs="${run.id}">
            View ${run.inputs.length} input values &darr;
          </button>
          <div id="inputs_${run.id}" class="afri-run-card-inputs-box">
            ${run.inputs.map(inp => `
              <div class="afri-run-input-row">
                <span class="afri-run-input-lbl">${inp.label}</span>
                <span class="afri-run-input-val">${inp.displayValue || inp.value}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="afri-run-card-actions">
          <button type="button" class="afri-run-action-btn afri-run-action-load" data-load-id="${run.id}">
            ${ICONS.restore}
            <span>Load Inputs</span>
          </button>
          <button type="button" class="afri-run-action-btn afri-run-action-compare" data-compare-id="${run.id}">
            ${ICONS.compare}
            <span>Compare</span>
          </button>
          <button type="button" class="afri-run-action-btn afri-run-action-delete" data-del-id="${run.id}" title="Delete run">
            ${ICONS.trash}
            <span>Delete</span>
          </button>
        </div>
      </div>
    `).join('');

    // Attach run card listeners
    $$('[data-toggle-inputs]', list).forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-toggle-inputs');
        const box = $(`#inputs_${id}`);
        if (box) {
          box.classList.toggle('is-visible');
          btn.innerHTML = box.classList.contains('is-visible')
            ? `Hide input values &uarr;`
            : `View input values &darr;`;
        }
      });
    });

    $$('[data-load-id]', list).forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-load-id');
        const run = getAllSavedRuns().find(r => r.id === id);
        if (run) {
          // If on a different page, navigate
          if (run.toolSlug !== getPageSlug()) {
            if (confirm(`This run is for "${run.toolTitle}". Navigate there to load inputs?`)) {
              sessionStorage.setItem('afri_restore_run', JSON.stringify(run));
              location.href = run.toolUrl;
            }
          } else {
            closeRunsDrawer();
            restoreInputsFromRun(run);
          }
        }
      });
    });

    $$('[data-compare-id]', list).forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-compare-id');
        openCompareModal(id);
      });
    });

    $$('[data-edit-id]', list).forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-edit-id');
        const run = getAllSavedRuns().find(r => r.id === id);
        if (run) {
          const next = prompt('Rename this calculation run:', run.label);
          if (next && next.trim()) {
            updateRunLabel(id, next);
            renderDrawerContent();
          }
        }
      });
    });

    $$('[data-del-id]', list).forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-del-id');
        if (confirm('Delete this saved run?')) {
          deleteRun(id);
          renderDrawerContent();
          showToast('Run deleted.');
        }
      });
    });
  }

  // Progress Comparison Modal
  function openCompareModal(preselectedId = null) {
    const slug = getPageSlug();
    const runs = getRunsForCurrentTool();

    if (runs.length < 2 && (!preselectedId || runs.length < 1)) {
      alert('You need at least 2 saved runs for this calculator to compare them. Save another run after modifying inputs!');
      return;
    }

    let runA = runs[1] || runs[0];
    let runB = runs[0];

    if (preselectedId) {
      const match = runs.find(r => r.id === preselectedId);
      if (match) {
        runB = match;
        runA = runs.find(r => r.id !== preselectedId) || runs[0];
      }
    }

    let overlay = $('#afriCompareModalOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'afriCompareModalOverlay';
      overlay.className = 'afri-runs-modal-overlay';
      document.body.appendChild(overlay);
    }

    function renderCompareModal() {
      // Find changed inputs between runA and runB
      const inputsA = new Map(runA.inputs.map(i => [i.key, i]));
      const inputsB = new Map(runB.inputs.map(i => [i.key, i]));
      const allKeys = Array.from(new Set([...inputsA.keys(), ...inputsB.keys()]));

      const diffRows = allKeys.map(k => {
        const itemA = inputsA.get(k);
        const itemB = inputsB.get(k);
        const label = itemA?.label || itemB?.label || k;
        const valA = itemA?.displayValue || itemA?.value || '—';
        const valB = itemB?.displayValue || itemB?.value || '—';
        const isDiff = valA !== valB;
        return { label, valA, valB, isDiff };
      });

      const changedCount = diffRows.filter(r => r.isDiff).length;

      overlay.innerHTML = `
        <div class="afri-runs-modal afri-compare-modal" role="dialog" aria-modal="true" aria-labelledby="afriCompareTitle">
          <div class="afri-runs-modal-header">
            <h3 id="afriCompareTitle" class="afri-runs-modal-title">
              ${ICONS.compare}
              <span>Progress &amp; Run Comparison</span>
            </h3>
            <button id="afriCompareClose" type="button" class="afri-runs-close-btn" aria-label="Close comparison">
              ${ICONS.close}
            </button>
          </div>

          <div class="afri-runs-modal-body">
            <!-- Selectors -->
            <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
              <div style="flex:1;min-width:180px;">
                <label style="font-size:0.75rem;font-weight:700;color:#6b7280;display:block;margin-bottom:0.25rem;">Baseline Run (Run A)</label>
                <select id="afriSelectRunA" class="afri-runs-form-input">
                  ${runs.map(r => `<option value="${r.id}" ${r.id === runA.id ? 'selected' : ''}>${r.label} (${r.dateStr.split(' ')[0]})</option>`).join('')}
                </select>
              </div>
              <div style="flex:1;min-width:180px;">
                <label style="font-size:0.75rem;font-weight:700;color:#6b7280;display:block;margin-bottom:0.25rem;">Comparison Run (Run B)</label>
                <select id="afriSelectRunB" class="afri-runs-form-input">
                  ${runs.map(r => `<option value="${r.id}" ${r.id === runB.id ? 'selected' : ''}>${r.label} (${r.dateStr.split(' ')[0]})</option>`).join('')}
                </select>
              </div>
            </div>

            <!-- Comparison Cards Grid -->
            <div class="afri-compare-grid">
              <div class="afri-compare-column">
                <div class="afri-compare-col-header">
                  <span class="afri-compare-tag">Run A &bull; Baseline</span>
                  <span class="afri-compare-date">${runA.dateStr}</span>
                </div>
                <h4 class="afri-compare-label">${runA.label}</h4>
                <div class="afri-compare-metric-box">
                  <span class="afri-compare-metric-val">${runA.summary.primaryMetric}</span>
                </div>
                ${runA.summary.verdict ? `<div style="font-size:0.6875rem;color:#4b5563;">${runA.summary.verdict}</div>` : ''}
              </div>

              <div class="afri-compare-column is-new">
                <div class="afri-compare-col-header">
                  <span class="afri-compare-tag">Run B &bull; Current</span>
                  <span class="afri-compare-date">${runB.dateStr}</span>
                </div>
                <h4 class="afri-compare-label">${runB.label}</h4>
                <div class="afri-compare-metric-box" style="border-color:#fde047;">
                  <span class="afri-compare-metric-val">${runB.summary.primaryMetric}</span>
                </div>
                ${runB.summary.verdict ? `<div style="font-size:0.6875rem;color:#4b5563;">${runB.summary.verdict}</div>` : ''}
              </div>
            </div>

            <!-- Difference Banner -->
            <div class="afri-compare-diff-banner">
              <span class="afri-compare-diff-title">Input Modifications Between Runs</span>
              <span class="afri-compare-diff-badge">
                ${ICONS.trendUp}
                <span>${changedCount} ${changedCount === 1 ? 'subject/input changed' : 'subjects/inputs changed'}</span>
              </span>
            </div>

            <!-- Inputs Diff Table -->
            <div>
              <h5 class="afri-compare-table-title">Subject &amp; Field Breakdown</h5>
              <div style="border:1px solid #e5e5e5;border-radius:0.5rem;overflow:hidden;">
                <table class="afri-compare-table">
                  <thead>
                    <tr>
                      <th style="width:38%;">Subject / Field</th>
                      <th style="width:31%;">Run A</th>
                      <th style="width:31%;">Run B</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${diffRows.map(r => `
                      <tr class="${r.isDiff ? 'is-diff' : ''}">
                        <td>${r.label}</td>
                        <td>${r.valA}</td>
                        <td>${r.valB}${r.isDiff ? ` <span style="color:#ca8a04;font-size:0.625rem;font-weight:800;">[UPDATED]</span>` : ''}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="afri-runs-modal-footer">
            <button id="afriLoadRunABtn" type="button" class="afri-runs-btn afri-runs-btn-outline">
              ${ICONS.restore}
              <span>Load Run A</span>
            </button>
            <button id="afriLoadRunBBtn" type="button" class="afri-runs-btn afri-runs-btn-dark">
              ${ICONS.restore}
              <span>Load Run B</span>
            </button>
            <button id="afriCompareDone" type="button" class="afri-runs-btn afri-runs-btn-yellow">Done</button>
          </div>
        </div>
      `;

      // Select Change Listeners
      $('#afriSelectRunA')?.addEventListener('change', (e) => {
        const selected = runs.find(r => r.id === e.target.value);
        if (selected) {
          runA = selected;
          renderCompareModal();
        }
      });

      $('#afriSelectRunB')?.addEventListener('change', (e) => {
        const selected = runs.find(r => r.id === e.target.value);
        if (selected) {
          runB = selected;
          renderCompareModal();
        }
      });

      const closeCompare = () => overlay.classList.remove('is-open');
      $('#afriCompareClose')?.addEventListener('click', closeCompare);
      $('#afriCompareDone')?.addEventListener('click', closeCompare);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeCompare();
      });

      $('#afriLoadRunABtn')?.addEventListener('click', () => {
        closeCompare();
        closeRunsDrawer();
        restoreInputsFromRun(runA);
      });

      $('#afriLoadRunBBtn')?.addEventListener('click', () => {
        closeCompare();
        closeRunsDrawer();
        restoreInputsFromRun(runB);
      });
    }

    renderCompareModal();
    overlay.classList.add('is-open');
  }

  // Check if navigating back with a pending restore request from another page
  function checkPendingRestore() {
    try {
      const pending = sessionStorage.getItem('afri_restore_run');
      if (pending) {
        sessionStorage.removeItem('afri_restore_run');
        const run = JSON.parse(pending);
        if (run && run.toolSlug === getPageSlug()) {
          setTimeout(() => {
            restoreInputsFromRun(run);
          }, 400);
        }
      }
    } catch {}
  }

  // Observe calculations for showing inline bar
  function observeCalculations() {
    if (!isCalculatorPage()) return;

    // Check periodically or via MutationObserver when results become visible
    const checkVisibility = () => {
      const host = findResultHost();
      if (host) {
        const isVisible = host.classList.contains('visible') ||
          host.style.display === 'block' ||
          window.getComputedStyle(host).display !== 'none';
        if (isVisible) {
          injectInlineBar();
        }
      }
    };

    checkVisibility();

    // Observe result container changes
    const host = findResultHost();
    if (host) {
      const observer = new MutationObserver(checkVisibility);
      observer.observe(host, { attributes: true, childList: true, subtree: true });
    }

    // Also hook on calculate / submit button clicks
    $('form')?.addEventListener('submit', () => {
      setTimeout(checkVisibility, 200);
      setTimeout(checkVisibility, 600);
    });

    $$('.btn-calc, button[type="submit"], #calcBtn, #calculateBtn').forEach(btn => {
      btn.addEventListener('click', () => {
        setTimeout(checkVisibility, 200);
        setTimeout(checkVisibility, 600);
      });
    });
  }

  // Initialize
  function init() {
    injectStyles();
    injectNavRunsButton();
    observeCalculations();
    checkPendingRestore();
  }

  onReady(init);

  // Global API
  window.AfriWidgetSavedRuns = {
    openDrawer: openRunsDrawer,
    openSaveModal: openSaveRunModal,
    openCompare: openCompareModal,
    getRuns: getAllSavedRuns
  };

})();
