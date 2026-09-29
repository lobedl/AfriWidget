/**
 * AfriWidget Calculation History & Progress Comparison ("My Saved Runs")
 * Professional, fully responsive client-side calculation notebook and progress comparator.
 *
 * Design Constitution:
 * - 100% Client-side privacy (localStorage 'afriwidget_saved_runs').
 * - Zero Emojis (Pure crisp SVG icons).
 * - Zero Tailwind (Clean, self-contained vanilla CSS).
 * - Fully responsive, zero text collision, optimized for 320px to 4K displays.
 * - Strict adherence to AfriWidget Brand System (#000000, #facc15, #fde047, #ffffff, #111827, #e5e5e5).
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'afriwidget_saved_runs';

  // Crisp SVG Icons (Zero Emojis)
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
    chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>`,
    arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    brandMark: `<svg width="20" height="20" viewBox="0 0 36 36" fill="none" aria-hidden="true"><path d="M18 4L20.5 14L30 18L20.5 22L18 32L15.5 22L6 18L15.5 14Z" fill="#FACC15"/><circle cx="28" cy="9" r="2.5" fill="#CA8A04"/><circle cx="9" cy="11" r="1.5" fill="#FACC15" opacity="0.7"/></svg>`
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getPageSlug() {
    return location.pathname.split('/').pop().replace(/\.html$/, '') || 'home';
  }

  function getToolTitle() {
    const heading = $('h1');
    if (heading) {
      const clone = heading.cloneNode(true);
      clone.querySelectorAll('.seo-title-accent, span, small, .subtitle, .tag').forEach(el => el.remove());
      const clean = clone.textContent.replace(/Last Updated.*$/i, '').replace(/\s+/g, ' ').trim();
      if (clean) return clean;
    }
    const panelTitle = $('.calc-panel-title');
    if (panelTitle) {
      const clean = panelTitle.textContent.replace(/Last Updated.*$/i, '').replace(/\s+/g, ' ').trim();
      if (clean && !clean.toLowerCase().includes('enter your') && !clean.toLowerCase().includes('select your')) {
        return clean;
      }
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

  // Storage Operations
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
    runs.unshift(runData);
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

  // Input & Result Capture
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
          const clone = lbl.cloneNode(true);
          clone.querySelectorAll('.hint, small, span').forEach(el => el.remove());
          label = clone.textContent.replace(/Alt [AB].*$/i, '').trim();
        }
      }

      if (!label) {
        const parentField = field.closest('.field, .field-group, .form-group, div');
        const parentLbl = parentField?.querySelector('.field-label, label');
        if (parentLbl) {
          const clone = parentLbl.cloneNode(true);
          clone.querySelectorAll('.hint, small, span').forEach(el => el.remove());
          label = clone.textContent.trim();
        }
      }

      if (!label) {
        label = field.getAttribute('aria-label') || field.name || field.id || `Input ${index + 1}`;
      }

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
          label: label.substring(0, 35),
          value,
          displayValue: displayValue.substring(0, 45)
        });
      }
    });

    return inputs;
  }

  function cleanHeroData(rawEyebrow, rawValue) {
    let label = (rawEyebrow || 'Result')
      .replace(/^(Your\s+(estimated\s+)?|Estimated\s+)/i, '')
      .replace(/result/i, 'Score')
      .trim();
    if (!label) label = 'Score';
    label = label.charAt(0).toUpperCase() + label.slice(1);

    let value = (rawValue || '—').trim();
    return { label, value };
  }

  function captureCurrentSummary() {
    const host = findResultHost() || $('.calc-panel') || document;

    // 1. Primary Hero Result
    let primaryValue = '';
    let primaryLabel = 'Result';
    let primarySub = '';

    const bigElem = host.querySelector(
      '.mean-big, .aggregate-big, .score-big, .gpa-badge, .bmi-badge, #meanGradeValue, #aggregateValue, #pointsValue, #divisionValue, #best5Value, #tcuValue, #totalAmount, #monthlyPayment, #bmiValue, .result-hero-value, .stat-value.accent'
    );

    if (bigElem) {
      const text = bigElem.textContent.trim();
      if (text && text !== '—') {
        primaryValue = text;
        const rawEyebrow = host.querySelector('.results-eyebrow, .results-title, .aggregate-note, .mean-note, .stat-label')?.textContent.trim();
        const cleaned = cleanHeroData(rawEyebrow, text);
        primaryLabel = cleaned.label;

        // Subtitle note
        const note = host.querySelector('.mean-note, .aggregate-note, .results-note, .stat-sub')?.textContent.trim();
        if (note && note.length < 50 && !note.toLowerCase().includes(primaryValue.toLowerCase())) {
          primarySub = note;
        }
      }
    }

    if (!primaryValue) {
      const firstStat = host.querySelector('.stat-value');
      if (firstStat) {
        primaryValue = firstStat.textContent.trim();
        const lbl = firstStat.closest('.stat-card')?.querySelector('.stat-label')?.textContent.trim();
        if (lbl) primaryLabel = lbl;
      }
    }

    if (!primaryValue || primaryValue === '—') {
      primaryValue = 'Calculation Complete';
      primaryLabel = 'Summary';
    }

    // 2. Secondary Metrics (Clean, concise)
    const statCards = $$('.stat-card, .metric-card, .summary-item', host);
    const stats = [];

    statCards.forEach(card => {
      const lbl = card.querySelector('.stat-label, .metric-label, .summary-label')?.textContent.trim();
      const val = card.querySelector('.stat-value, .metric-value, .summary-value')?.textContent.trim();
      if (lbl && val && val !== '—' && val !== primaryValue) {
        stats.push({
          label: lbl.replace(/\s+/g, ' ').trim().substring(0, 28),
          value: val.replace(/\s+/g, ' ').trim().substring(0, 30)
        });
      }
    });

    // 3. Verdict / Interpretation
    let verdict = '';
    const tierElem = host.querySelector('.tier-box, #tierText, #interpretation, #verdict, .verdict-text, .result-desc, p.interpretation, .interpret-text');
    if (tierElem) {
      verdict = tierElem.textContent.replace(/^What this (opens|means|usually means):\s*/i, '').trim();
    }

    return {
      primaryLabel,
      primaryValue,
      primarySub,
      primaryMetric: `${primaryLabel}: ${primaryValue}`,
      stats: stats.slice(0, 4),
      verdict: verdict ? verdict.substring(0, 180) : ''
    };
  }

  // Parse legacy runs saved in previous format
  function parseHeroMetric(summary) {
    if (summary.primaryValue && summary.primaryLabel) {
      return {
        label: summary.primaryLabel,
        value: summary.primaryValue,
        sub: summary.primarySub || ''
      };
    }
    const raw = summary.primaryMetric || 'Result';
    if (raw.includes(':')) {
      const parts = raw.split(':');
      let label = parts[0].replace(/^(Your\s+(estimated\s+)?|Estimated\s+)/i, '').trim();
      label = label.charAt(0).toUpperCase() + label.slice(1);
      const val = parts.slice(1).join(':').trim();
      return { label: label || 'Result', value: val, sub: '' };
    }
    return { label: 'Result', value: raw, sub: '' };
  }

  // Restore inputs
  function restoreInputsFromRun(run) {
    if (!run || !Array.isArray(run.inputs)) return;

    const form = $('form') || $('.calc-panel');
    if (!form) return;

    let restoredCount = 0;

    run.inputs.forEach(({ key, value }) => {
      let el = document.getElementById(key) || form.querySelector(`[name="${CSS.escape(key)}"]`);
      if (!el) {
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

        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        restoredCount++;
      }
    });

    setTimeout(() => {
      const calcBtn = form.querySelector('.btn-calc, button[type="submit"], #calcBtn, #calculateBtn, input[type="submit"]') || form.querySelector('button');
      if (calcBtn) {
        calcBtn.click();
      } else if (typeof form.requestSubmit === 'function') {
        form.requestSubmit();
      }
    }, 120);

    closeRunsDrawer();
    showToast(`Loaded ${restoredCount} input values from "${run.label}".`);
  }

  function showToast(message) {
    let toast = document.getElementById('afriRunsToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'afriRunsToast';
      toast.className = 'afri-runs-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="afri-runs-toast-icon">${ICONS.check}</span><span>${escapeHtml(message)}</span>`;
    toast.classList.add('is-visible');

    if (toast._timer) clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 3600);
  }

  // Format concise date
  function formatRunDate(timestamp, fallbackStr) {
    if (timestamp && typeof timestamp === 'number') {
      const d = new Date(timestamp);
      const day = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `${day}, ${time}`;
    }
    if (fallbackStr) {
      return fallbackStr.replace(/\s+\d{4}\s+/, ', ');
    }
    return 'Recent run';
  }

  // Pure Vanilla CSS - Sleek, Responsive, Anti-Slop, Brand Compliant
  function injectStyles() {
    if (document.getElementById('afriwidget-saved-runs-styles')) return;

    const style = document.createElement('style');
    style.id = 'afriwidget-saved-runs-styles';
    style.textContent = `
      /* Universal Reset & Font Family */
      .afri-runs-bar, .afri-runs-drawer, .afri-runs-modal, .afri-runs-toast {
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        color: #000000;
        -webkit-font-smoothing: antialiased;
      }
      .afri-runs-bar *, .afri-runs-drawer *, .afri-runs-modal *, .afri-runs-toast * {
        box-sizing: border-box;
      }

      /* In-Page Action Bar (Beside Calculator Results) */
      .afri-runs-bar {
        display: block;
        margin: 1.5rem 0;
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-left: 4px solid #facc15;
        border-radius: 0.75rem;
        padding: 1.125rem 1.25rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        width: 100%;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }
      .afri-runs-bar:hover {
        border-color: #d1d5db;
        border-left-color: #facc15;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
      }
      .afri-runs-bar-inner {
        display: flex;
        flex-direction: column;
        gap: 1rem;
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
        align-items: center;
        gap: 0.875rem;
      }
      .afri-runs-bar-icon {
        width: 2.5rem;
        height: 2.5rem;
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
        gap: 0.625rem;
        flex-wrap: wrap;
      }

      /* Unified Button Hierarchy */
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
        margin-left: 0.25rem;
      }

      /* Navigation Topbar Button */
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
        background: rgba(0, 0, 0, 0.65);
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
        max-width: 460px;
        background: #ffffff;
        box-shadow: -10px 0 35px rgba(0, 0, 0, 0.25);
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
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        flex-shrink: 0;
      }
      .afri-runs-header-brand {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .afri-runs-header-title-box {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
      }
      .afri-runs-header-title {
        font-size: 1.0625rem;
        font-weight: 800;
        color: #ffffff;
        margin: 0;
        line-height: 1.2;
      }
      .afri-runs-header-sub {
        font-size: 0.6875rem;
        color: #94a3b8;
        font-weight: 500;
        line-height: 1;
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

      /* Segmented Tabs */
      .afri-runs-tabs-wrap {
        padding: 0.75rem 1rem;
        background: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
        flex-shrink: 0;
      }
      .afri-runs-tabs {
        display: flex;
        background: #e2e8f0;
        padding: 0.25rem;
        border-radius: 0.5rem;
        gap: 0.25rem;
      }
      .afri-runs-tab {
        flex: 1;
        background: transparent;
        border: none;
        padding: 0.5rem 0.75rem;
        font-size: 0.8125rem;
        font-weight: 700;
        color: #64748b;
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
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      }
      .afri-runs-tab-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 0.6875rem;
        font-weight: 800;
        padding: 0.125rem 0.375rem;
        border-radius: 9999px;
        min-width: 1.125rem;
        height: 1.125rem;
        background: #cbd5e1;
        color: #334155;
        line-height: 1;
      }
      .afri-runs-tab.is-active .afri-runs-tab-badge {
        background: #000000;
        color: #facc15;
      }

      /* Drawer Scrollable Body */
      .afri-runs-body {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.875rem;
        background: #f8fafc;
      }

      /* Empty State */
      .afri-runs-empty {
        text-align: center;
        padding: 3.5rem 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .afri-runs-empty-icon {
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 9999px;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        color: #94a3b8;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
      }
      .afri-runs-empty-icon svg {
        width: 1.75rem;
        height: 1.75rem;
      }
      .afri-runs-empty-title {
        font-size: 1rem;
        font-weight: 800;
        color: #0f172a;
        margin: 0 0 0.375rem 0;
      }
      .afri-runs-empty-desc {
        font-size: 0.8125rem;
        color: #64748b;
        margin: 0;
        max-width: 290px;
        line-height: 1.5;
      }

      /* Modernized Professional Run Card */
      .afri-run-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 0.75rem;
        padding: 1rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }
      .afri-run-card:hover {
        border-color: #cbd5e1;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.06);
      }

      /* Card Top Row */
      .afri-run-card-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.625rem;
      }
      .afri-run-tool-tag {
        font-size: 0.6875rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: #854d0e;
        background: #fefce8;
        border: 1px solid #fef08a;
        padding: 0.2rem 0.5rem;
        border-radius: 0.25rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 60%;
      }
      .afri-run-top-meta {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        margin-left: auto;
      }
      .afri-run-time {
        font-size: 0.6875rem;
        color: #94a3b8;
        font-weight: 500;
        white-space: nowrap;
      }
      .afri-run-mini-btn {
        background: transparent;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 0.25rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: color 0.15s ease, background 0.15s ease;
      }
      .afri-run-mini-btn:hover {
        color: #0f172a;
        background: #f1f5f9;
      }
      .afri-run-mini-btn.afri-run-del-btn:hover {
        color: #dc2626;
        background: #fef2f2;
      }
      .afri-run-mini-btn svg {
        width: 0.875rem;
        height: 0.875rem;
      }

      /* Card Title Row */
      .afri-run-label-row {
        margin: 0;
      }
      .afri-run-label-title {
        font-size: 0.9375rem;
        font-weight: 800;
        color: #0f172a;
        margin: 0;
        line-height: 1.3;
        word-break: break-word;
      }

      /* Hero Primary Result Banner (Full Width, Clear, Uncrowded) */
      .afri-run-hero-box {
        background: #000000;
        color: #ffffff;
        border-radius: 0.5rem;
        padding: 0.75rem 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
      }
      .afri-run-hero-left {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
      }
      .afri-run-hero-eyebrow {
        font-size: 0.6875rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #94a3b8;
      }
      .afri-run-hero-val {
        font-size: 1.125rem;
        font-weight: 900;
        color: #facc15;
        letter-spacing: -0.01em;
        line-height: 1.1;
      }
      .afri-run-hero-sub {
        font-size: 0.6875rem;
        color: #cbd5e1;
        font-weight: 500;
        text-align: right;
        max-width: 45%;
        line-height: 1.3;
      }

      /* Secondary Stats Grid */
      .afri-run-stats-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.375rem;
        background: #f8fafc;
        border: 1px solid #f1f5f9;
        padding: 0.625rem;
        border-radius: 0.5rem;
      }
      .afri-run-stat-item {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
        overflow: hidden;
      }
      .afri-run-stat-lbl {
        color: #64748b;
        font-size: 0.6875rem;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .afri-run-stat-val {
        color: #0f172a;
        font-size: 0.8125rem;
        font-weight: 700;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* Verdict Quote Box */
      .afri-run-verdict-box {
        font-size: 0.75rem;
        color: #334155;
        line-height: 1.45;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-left: 3px solid #facc15;
        padding: 0.5rem 0.625rem;
        border-radius: 0.375rem;
      }

      /* Collapsible Inputs Summary */
      .afri-run-inputs-wrap {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .afri-run-inputs-btn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        background: transparent;
        border: 1px dashed #cbd5e1;
        border-radius: 0.375rem;
        padding: 0.375rem 0.625rem;
        font-size: 0.75rem;
        font-weight: 600;
        color: #475569;
        cursor: pointer;
        transition: all 0.15s ease;
        font-family: inherit;
      }
      .afri-run-inputs-btn:hover {
        background: #ffffff;
        border-color: #000000;
        color: #000000;
      }
      .afri-run-inputs-btn svg {
        width: 0.75rem;
        height: 0.75rem;
        transition: transform 0.2s ease;
      }
      .afri-run-inputs-btn.is-open svg {
        transform: rotate(90deg);
      }
      .afri-run-inputs-drawer {
        display: none;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 0.375rem;
        padding: 0.5rem;
        max-height: 150px;
        overflow-y: auto;
        font-size: 0.6875rem;
      }
      .afri-run-inputs-drawer.is-open {
        display: block;
      }
      .afri-run-input-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.25rem 0;
        border-bottom: 1px solid #f1f5f9;
        gap: 0.5rem;
      }
      .afri-run-input-row:last-child {
        border-bottom: none;
      }
      .afri-run-input-lbl {
        color: #64748b;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .afri-run-input-val {
        color: #0f172a;
        font-weight: 700;
        white-space: nowrap;
        text-align: right;
      }

      /* Card Actions */
      .afri-run-actions-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding-top: 0.375rem;
      }
      .afri-run-card-btn {
        flex: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.375rem;
        font-size: 0.75rem;
        font-weight: 700;
        padding: 0.45rem 0.625rem;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: all 0.15s ease;
        line-height: 1;
        font-family: inherit;
        border: 1px solid transparent;
        min-height: 2rem;
      }
      .afri-run-card-btn svg {
        width: 0.8125rem;
        height: 0.8125rem;
      }
      .afri-run-card-btn-load {
        background: #000000;
        color: #ffffff;
      }
      .afri-run-card-btn-load:hover {
        background: #1f2937;
        color: #facc15;
      }
      .afri-run-card-btn-compare {
        background: #ffffff;
        color: #0f172a;
        border-color: #cbd5e1;
      }
      .afri-run-card-btn-compare:hover {
        background: #f8fafc;
        border-color: #000000;
      }

      /* Drawer Footer */
      .afri-runs-footer {
        padding: 0.875rem 1.25rem;
        background: #ffffff;
        border-top: 1px solid #e2e8f0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        flex-shrink: 0;
      }
      .afri-runs-footer-row {
        display: flex;
        align-items: center;
        gap: 0.625rem;
      }
      .afri-runs-privacy-note {
        font-size: 0.6875rem;
        color: #94a3b8;
        text-align: center;
        margin: 0;
      }

      /* Comparison Modal */
      .afri-runs-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
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
        max-width: 500px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.25);
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
        background: #f8fafc;
        border-top: 1px solid #e2e8f0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.625rem;
      }

      /* Modal Form Inputs */
      .afri-runs-form-group {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }
      .afri-runs-form-label {
        font-size: 0.8125rem;
        font-weight: 700;
        color: #0f172a;
      }
      .afri-runs-form-input {
        width: 100%;
        padding: 0.625rem 0.75rem;
        border: 1px solid #cbd5e1;
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
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        padding: 0.875rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .afri-runs-preview-tool {
        font-size: 0.6875rem;
        font-weight: 800;
        color: #ca8a04;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .afri-runs-preview-metric {
        font-size: 1.0625rem;
        font-weight: 900;
        color: #000000;
      }

      /* Compare Modal Layout */
      .afri-compare-modal {
        max-width: 640px;
      }
      .afri-compare-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }
      @media (min-width: 560px) {
        .afri-compare-grid {
          grid-template-columns: 1fr 1fr;
        }
      }
      .afri-compare-column {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 0.625rem;
        padding: 0.875rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .afri-compare-column.is-new {
        border-color: #fde047;
        background: #fffdf5;
      }
      .afri-compare-col-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 0.375rem;
        border-bottom: 1px solid #e2e8f0;
      }
      .afri-compare-tag {
        font-size: 0.6875rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 0.125rem 0.375rem;
        border-radius: 0.25rem;
        background: #e2e8f0;
        color: #334155;
      }
      .afri-compare-column.is-new .afri-compare-tag {
        background: #facc15;
        color: #000000;
      }
      .afri-compare-date {
        font-size: 0.6875rem;
        color: #64748b;
      }
      .afri-compare-label {
        font-size: 0.875rem;
        font-weight: 800;
        color: #0f172a;
        margin: 0;
      }
      .afri-compare-metric-box {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        padding: 0.625rem;
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
        padding: 0.625rem 0.875rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
      }
      .afri-compare-diff-title {
        font-size: 0.75rem;
        font-weight: 700;
        color: #cbd5e1;
      }
      .afri-compare-diff-badge {
        font-size: 0.8125rem;
        font-weight: 800;
        color: #facc15;
      }
      .afri-compare-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.75rem;
      }
      .afri-compare-table th {
        text-align: left;
        padding: 0.45rem;
        background: #f1f5f9;
        color: #475569;
        font-weight: 700;
        border-bottom: 1px solid #e2e8f0;
      }
      .afri-compare-table td {
        padding: 0.45rem;
        border-bottom: 1px solid #f1f5f9;
        color: #0f172a;
      }
      .afri-compare-table tr.is-diff {
        background: #fefce8;
      }
      .afri-compare-table tr.is-diff td {
        font-weight: 600;
      }

      /* Floating Toast */
      .afri-runs-toast {
        position: fixed;
        bottom: 1.5rem;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: #000000;
        color: #ffffff;
        padding: 0.625rem 1.125rem;
        border-radius: 9999px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.8125rem;
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
        width: 1rem;
        height: 1rem;
      }
    `;
    document.head.appendChild(style);
  }

  // Inject Navigation Bar Button
  function injectNavRunsButton() {
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

  // Inject In-Page Action Bar (Beside Calculator Results)
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
            <span class="afri-runs-preview-tool">${escapeHtml(toolTitle)}</span>
            <span class="afri-runs-preview-metric">${escapeHtml(summary.primaryLabel)}: ${escapeHtml(summary.primaryValue)}</span>
            ${summary.verdict ? `<span style="font-size:0.75rem;color:#64748b;">${escapeHtml(summary.verdict.substring(0, 90))}...</span>` : ''}
          </div>

          <div class="afri-runs-form-group">
            <label for="afriRunLabelInput" class="afri-runs-form-label">Run Label / Title</label>
            <input id="afriRunLabelInput" type="text" class="afri-runs-form-input" value="${escapeHtml(defaultLabel)}" placeholder="e.g. Mock Exam 1, Target Plan, First Bank Offer" maxlength="50" autofocus />
          </div>

          <p style="font-size:0.75rem;color:#64748b;margin:0;">
            Saves all ${inputs.length} inputs and resulting metrics securely in your browser to compare or reload later.
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
      showToast(`Saved "${label}" to history.`);
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
          ${ICONS.brandMark}
          <div class="afri-runs-header-title-box">
            <h2 class="afri-runs-header-title">My Saved Runs</h2>
            <span class="afri-runs-header-sub">Calculation history &amp; progress comparison</span>
          </div>
        </div>
        <button id="afriRunsDrawerClose" type="button" class="afri-runs-close-btn" aria-label="Close saved runs">
          ${ICONS.close}
        </button>
      </div>

      <div class="afri-runs-tabs-wrap">
        <div class="afri-runs-tabs">
          <button id="afriTabCurrent" type="button" class="afri-runs-tab is-active">
            <span>This Tool</span>
            <span id="afriTabCurrentBadge" class="afri-runs-tab-badge">0</span>
          </button>
          <button id="afriTabAll" type="button" class="afri-runs-tab">
            <span>All Saved Runs</span>
            <span id="afriTabAllBadge" class="afri-runs-tab-badge">0</span>
          </button>
        </div>
      </div>

      <div id="afriRunsList" class="afri-runs-body"></div>

      <div class="afri-runs-footer">
        <div class="afri-runs-footer-row">
          <button id="afriCompareBtn" type="button" class="afri-runs-btn afri-runs-btn-yellow" style="flex:1;">
            ${ICONS.compare}
            <span>Compare Runs</span>
          </button>
          <button id="afriClearRunsBtn" type="button" class="afri-runs-btn afri-runs-btn-outline" title="Clear saved runs">
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
        ? 'Clear saved runs for this calculator tool?'
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

    list.innerHTML = runsToShow.map((run) => {
      const hero = parseHeroMetric(run.summary);

      // Clean secondary stats
      const statsList = (run.summary.stats || []).map(s => {
        let cleanVal = s.value;
        const parenIdx = cleanVal.indexOf('(');
        if (parenIdx > 0) {
          cleanVal = cleanVal.substring(0, parenIdx).trim();
        }
        return `
          <div class="afri-run-stat-item">
            <span class="afri-run-stat-lbl">${escapeHtml(s.label)}</span>
            <span class="afri-run-stat-val">${escapeHtml(cleanVal)}</span>
          </div>
        `;
      }).join('');

      return `
        <div class="afri-run-card" data-run-id="${run.id}">
          <!-- Top Row: Category tag on left, Date & Quick Icons on right -->
          <div class="afri-run-card-top">
            <span class="afri-run-tool-tag">${escapeHtml(run.toolTitle)}</span>
            <div class="afri-run-top-meta">
              <span class="afri-run-time">${formatRunDate(run.timestamp, run.dateStr)}</span>
              <button class="afri-run-mini-btn afri-run-edit-btn" data-edit-id="${run.id}" title="Rename run" aria-label="Rename">
                ${ICONS.edit}
              </button>
              <button class="afri-run-mini-btn afri-run-del-btn" data-del-id="${run.id}" title="Delete run" aria-label="Delete">
                ${ICONS.trash}
              </button>
            </div>
          </div>

          <!-- Run Label Title (Full width, zero squishing) -->
          <div class="afri-run-label-row">
            <h4 class="afri-run-label-title">${escapeHtml(run.label)}</h4>
          </div>

          <!-- Hero Primary Result Banner (Full Width, Clear, Uncrowded) -->
          <div class="afri-run-hero-box">
            <div class="afri-run-hero-left">
              <span class="afri-run-hero-eyebrow">${escapeHtml(hero.label)}</span>
              <span class="afri-run-hero-val">${escapeHtml(hero.value)}</span>
            </div>
            ${hero.sub ? `<span class="afri-run-hero-sub">${escapeHtml(hero.sub)}</span>` : ''}
          </div>

          <!-- Secondary Stats Grid (Clean 2-Column Key-Values) -->
          ${statsList ? `<div class="afri-run-stats-grid">${statsList}</div>` : ''}

          <!-- Verdict / Assessment Summary -->
          ${run.summary.verdict ? `
            <div class="afri-run-verdict-box">
              ${escapeHtml(run.summary.verdict)}
            </div>
          ` : ''}

          <!-- Collapsible Inputs Summary -->
          <div class="afri-run-inputs-wrap">
            <button type="button" class="afri-run-inputs-btn" data-toggle-inputs="${run.id}">
              <span>View ${run.inputs.length} input values</span>
              ${ICONS.arrowRight}
            </button>
            <div id="inputs_${run.id}" class="afri-run-inputs-drawer">
              ${run.inputs.map(inp => `
                <div class="afri-run-input-row">
                  <span class="afri-run-input-lbl">${escapeHtml(inp.label)}</span>
                  <span class="afri-run-input-val">${escapeHtml(inp.displayValue || inp.value)}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="afri-run-actions-row">
            <button type="button" class="afri-run-card-btn afri-run-card-btn-load" data-load-id="${run.id}">
              ${ICONS.restore}
              <span>Load Inputs</span>
            </button>
            <button type="button" class="afri-run-card-btn afri-run-card-btn-compare" data-compare-id="${run.id}">
              ${ICONS.compare}
              <span>Compare</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Toggle Inputs Accordion
    $$('[data-toggle-inputs]', list).forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-toggle-inputs');
        const box = $(`#inputs_${id}`);
        if (box) {
          const isOpen = box.classList.toggle('is-open');
          btn.classList.toggle('is-open', isOpen);
        }
      });
    });

    // Rename Run
    $$('[data-edit-id]', list).forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-edit-id');
        const run = getAllSavedRuns().find(r => r.id === id);
        if (!run) return;
        const newName = prompt('Enter a new label for this run:', run.label);
        if (newName !== null && newName.trim() !== '') {
          updateRunLabel(id, newName.trim());
          renderDrawerContent();
          showToast(`Renamed to "${newName.trim()}".`);
        }
      });
    });

    // Delete Run
    $$('[data-del-id]', list).forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-del-id');
        deleteRun(id);
        renderDrawerContent();
        showToast('Run removed from history.');
      });
    });

    // Load Run Inputs
    $$('[data-load-id]', list).forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-load-id');
        const run = getAllSavedRuns().find(r => r.id === id);
        if (!run) return;

        const currentSlug = getPageSlug();
        if (run.toolSlug !== currentSlug && run.toolUrl) {
          location.href = run.toolUrl;
          return;
        }

        restoreInputsFromRun(run);
      });
    });

    // Compare Single Run Trigger
    $$('[data-compare-id]', list).forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-compare-id');
        openCompareModal(id);
      });
    });
  }

  // Progress Comparison Modal
  function openCompareModal(preselectedId = null) {
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
      const heroA = parseHeroMetric(runA.summary);
      const heroB = parseHeroMetric(runB.summary);

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
                <label style="font-size:0.75rem;font-weight:700;color:#64748b;display:block;margin-bottom:0.25rem;">Base Run (Earlier Attempt)</label>
                <select id="afriSelectRunA" class="afri-runs-form-input">
                  ${runs.map(r => `<option value="${r.id}" ${r.id === runA.id ? 'selected' : ''}>${escapeHtml(r.label)} (${formatRunDate(r.timestamp, r.dateStr)})</option>`).join('')}
                </select>
              </div>
              <div style="flex:1;min-width:180px;">
                <label style="font-size:0.75rem;font-weight:700;color:#64748b;display:block;margin-bottom:0.25rem;">Comparison Run (Later Attempt)</label>
                <select id="afriSelectRunB" class="afri-runs-form-input">
                  ${runs.map(r => `<option value="${r.id}" ${r.id === runB.id ? 'selected' : ''}>${escapeHtml(r.label)} (${formatRunDate(r.timestamp, r.dateStr)})</option>`).join('')}
                </select>
              </div>
            </div>

            <!-- Side-by-Side Result Cards -->
            <div class="afri-compare-grid">
              <div class="afri-compare-column">
                <div class="afri-compare-col-header">
                  <span class="afri-compare-tag">Base Attempt</span>
                  <span class="afri-compare-date">${formatRunDate(runA.timestamp, runA.dateStr)}</span>
                </div>
                <h4 class="afri-compare-label">${escapeHtml(runA.label)}</h4>
                <div class="afri-compare-metric-box">
                  <div style="font-size:0.6875rem;color:#64748b;font-weight:700;text-transform:uppercase;">${escapeHtml(heroA.label)}</div>
                  <div class="afri-compare-metric-val">${escapeHtml(heroA.value)}</div>
                </div>
              </div>

              <div class="afri-compare-column is-new">
                <div class="afri-compare-col-header">
                  <span class="afri-compare-tag">Comparison Attempt</span>
                  <span class="afri-compare-date">${formatRunDate(runB.timestamp, runB.dateStr)}</span>
                </div>
                <h4 class="afri-compare-label">${escapeHtml(runB.label)}</h4>
                <div class="afri-compare-metric-box">
                  <div style="font-size:0.6875rem;color:#854d0e;font-weight:700;text-transform:uppercase;">${escapeHtml(heroB.label)}</div>
                  <div class="afri-compare-metric-val" style="color:#ca8a04;">${escapeHtml(heroB.value)}</div>
                </div>
              </div>
            </div>

            <!-- Changes Summary Banner -->
            <div class="afri-compare-diff-banner">
              <span class="afri-compare-diff-title">Modified Input Variables</span>
              <span class="afri-compare-diff-badge">${changedCount} of ${allKeys.length} fields changed</span>
            </div>

            <!-- Detailed Breakdown Table -->
            <div style="max-height:220px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:0.5rem;">
              <table class="afri-compare-table">
                <thead>
                  <tr>
                    <th>Input Field</th>
                    <th>Base (${escapeHtml(runA.label.substring(0, 14))})</th>
                    <th>Comparison (${escapeHtml(runB.label.substring(0, 14))})</th>
                  </tr>
                </thead>
                <tbody>
                  ${diffRows.map(r => `
                    <tr class="${r.isDiff ? 'is-diff' : ''}">
                      <td>${escapeHtml(r.label)}</td>
                      <td>${escapeHtml(r.valA)}</td>
                      <td>
                        ${escapeHtml(r.valB)}
                        ${r.isDiff ? '<span style="font-size:0.625rem;background:#facc15;color:#000000;padding:0.1rem 0.3rem;border-radius:0.25rem;font-weight:800;margin-left:0.25rem;">NEW</span>' : ''}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <div class="afri-runs-modal-footer">
            <button id="afriCompareCloseBtn" type="button" class="afri-runs-btn afri-runs-btn-outline">Close</button>
            <button id="afriLoadCompareRunB" type="button" class="afri-runs-btn afri-runs-btn-yellow">
              ${ICONS.restore}
              <span>Load Run B Inputs</span>
            </button>
          </div>
        </div>
      `;

      $('#afriCompareClose')?.addEventListener('click', () => overlay.classList.remove('is-open'));
      $('#afriCompareCloseBtn')?.addEventListener('click', () => overlay.classList.remove('is-open'));
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('is-open');
      });

      $('#afriSelectRunA')?.addEventListener('change', (e) => {
        runA = runs.find(r => r.id === e.target.value) || runA;
        renderCompareModal();
      });

      $('#afriSelectRunB')?.addEventListener('change', (e) => {
        runB = runs.find(r => r.id === e.target.value) || runB;
        renderCompareModal();
      });

      $('#afriLoadCompareRunB')?.addEventListener('click', () => {
        overlay.classList.remove('is-open');
        restoreInputsFromRun(runB);
      });
    }

    renderCompareModal();
    overlay.classList.add('is-open');
  }

  // Observe calculations for showing inline bar
  function setupCalculationObserver() {
    const host = findResultHost();
    if (!host) return;

    function checkVisibility() {
      const isVisible = host.offsetParent !== null ||
        host.classList.contains('visible') ||
        window.getComputedStyle(host).display !== 'none';

      if (isVisible) {
        injectInlineBar();
      }
    }

    const observer = new MutationObserver(() => {
      checkVisibility();
    });

    observer.observe(host, { attributes: true, attributeFilter: ['class', 'style'] });
    checkVisibility();

    $$('button[type="submit"], .btn-calc, #calcBtn, #calculateBtn').forEach(btn => {
      btn.addEventListener('click', () => {
        setTimeout(checkVisibility, 200);
      });
    });
  }

  // Initialize
  function init() {
    injectStyles();
    injectNavRunsButton();
    setupCalculationObserver();
  }

  onReady(init);

  window.AfriWidgetRuns = {
    openDrawer: openRunsDrawer,
    closeDrawer: closeRunsDrawer,
    openSaveModal: openSaveRunModal,
    openCompareModal: openCompareModal,
    getAll: getAllSavedRuns,
    getForCurrent: getRunsForCurrentTool
  };
})();
