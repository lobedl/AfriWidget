(function () {
  'use strict';

  var STORAGE_KEY = 'afriwidget_saved_runs';
  var RESTORE_KEY = 'afri_restore_run';
  var MAX_RUNS = 100;

  var ICONS = {
    history: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></svg>',
    bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
    bookmarkFilled: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
    compare: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3v18"/><path d="M14 3v18"/><path d="M3 8h7"/><path d="M14 8h7"/><path d="M3 16h7"/><path d="M14 16h7"/></svg>',
    restore: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',
    trendUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 7l-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/></svg>',
    brandLogo: '<svg viewBox="0 0 36 36" fill="none" aria-hidden="true"><path d="M18 4L20.5 14L30 18L20.5 22L18 32L15.5 22L6 18L15.5 14Z" fill="#FACC15"/><circle cx="28" cy="9" r="2.5" fill="#CA8A04"/><circle cx="9" cy="11" r="1.5" fill="#FACC15" opacity="0.7"/></svg>'
  };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function slug() {
    return (location.pathname.split('/').pop() || 'home').replace(/\.html$/, '') || 'home';
  }
  function toolTitle() {
    var h = $('h1') || $('.calc-panel-title') || $('h2');
    if (h) {
      var t = h.textContent.replace(/Last Updated[\s\S]*$/i, '').trim();
      if (t) return t;
    }
    return (document.title.split('|')[0].split('—')[0] || 'Calculator').trim();
  }
  function findResultHost() {
    return $('#results') || $('#cfResults') || $('#resultsCard') || $('#eligibilityCard') ||
      (typeof $('#gpaResult') !== 'undefined' && $('#gpaResult') ? $('#gpaResult').closest('.calc-panel, section, div') : null) ||
      (typeof $('.results') !== 'undefined' && $('.results') ? $('.results') : null);
  }
  function isCalculatorPage() {
    var s = slug();
    var hubs = ['home','','education','finance','health','productivity','business','use-cases','about','contact','terms','privacy-policy','cookie-policy','adsense-disclaimer','404','faq'];
    if (hubs.indexOf(s) !== -1) return false;
    return !!(findResultHost() || $('form') || $('.calc-panel'));
  }

  function getAllRuns() {
    try { var raw = localStorage.getItem(STORAGE_KEY); var arr = raw ? JSON.parse(raw) : []; return Array.isArray(arr) ? arr : []; }
    catch (e) { return []; }
  }
  function setAllRuns(runs) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(runs));
      updateNavBadges();
      updateInlineBadge();
    } catch (e) {}
  }
  function runsForTool() {
    var s = slug();
    return getAllRuns().filter(function (r) { return r.toolSlug === s; });
  }
  function addRun(data) {
    var runs = getAllRuns();
    runs.unshift(data);
    if (runs.length > MAX_RUNS) runs.length = MAX_RUNS;
    setAllRuns(runs);
  }
  function deleteRun(id) {
    setAllRuns(getAllRuns().filter(function (r) { return r.id !== id; }));
  }
  function renameRun(id, label) {
    var runs = getAllRuns();
    var r = runs.find(function (x) { return x.id === id; });
    if (r) { r.label = label.trim() || r.label; setAllRuns(runs); }
  }
  function clearToolRuns() {
    var s = slug();
    setAllRuns(getAllRuns().filter(function (r) { return r.toolSlug !== s; }));
  }
  function clearAllRuns() { setAllRuns([]); }

  function captureInputs() {
    var form = $('form') || $('.calc-panel') || document;
    var fields = $$('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]), select, textarea', form);
    var inputs = [];
    fields.forEach(function (f, i) {
      var key = f.id || f.name || ('field_' + i);
      var label = '';
      if (f.id) {
        var lbl = form.querySelector('label[for="' + CSS.escape(f.id) + '"]') || document.querySelector('label[for="' + CSS.escape(f.id) + '"]');
        if (lbl) label = lbl.textContent.replace(/Alt [AB][\s\S]*$/i, '').trim();
      }
      if (!label) {
        var wrap = f.closest('.field, .field-group, .form-group, div');
        var pl = wrap ? wrap.querySelector('.field-label, label') : null;
        if (pl) label = pl.textContent.trim();
      }
      if (!label) label = f.getAttribute('aria-label') || f.name || f.id || ('Input ' + (i + 1));
      label = label.replace(/\s+/g, ' ').trim();

      var value = '', display = '';
      if (f.tagName === 'SELECT') {
        value = f.value;
        if (f.selectedIndex >= 0) display = (f.options[f.selectedIndex] && f.options[f.selectedIndex].text || '').trim();
      } else if (f.type === 'checkbox' || f.type === 'radio') {
        value = f.checked ? (f.value || 'true') : '';
        display = f.checked ? 'Selected' : 'Not selected';
      } else {
        value = f.value;
        display = f.value;
      }
      if (value !== '') inputs.push({ key: key, label: label.slice(0, 40), value: String(value), displayValue: String(display).slice(0, 60) });
    });
    return inputs;
  }

  function captureSummary() {
    var host = findResultHost() || $('.calc-panel') || document;
    var primary = '';
    var big = host.querySelector('.aggregate-big, .mean-big, .score-big, .gpa-badge, .bmi-badge, #meanGradeValue, #aggregateValue, #pointsValue, #divisionValue, #best5Value, #tcuValue, #totalAmount, #monthlyPayment, #bmiValue, .result-hero-value, .stat-value.accent');
    if (big) {
      var t = big.textContent.trim();
      if (t && t !== '—') {
        var eb = host.querySelector('.results-eyebrow, .aggregate-note, .mean-note, .stat-label');
        var ebT = eb ? eb.textContent.trim() : '';
        primary = (ebT && ebT.length < 35 && t.toLowerCase().indexOf(ebT.toLowerCase()) === -1) ? (ebT + ': ' + t) : t;
      }
    }
    if (!primary) {
      var fs = host.querySelector('.stat-value');
      if (fs) {
        var card = fs.closest('.stat-card');
        var lbl = card ? card.querySelector('.stat-label') : null;
        primary = lbl ? (lbl.textContent.trim() + ': ' + fs.textContent.trim()) : fs.textContent.trim();
      }
    }
    if (!primary) primary = 'Completed calculation';

    var stats = [];
    $$('.stat-card, .metric-card, .summary-item', host).forEach(function (c) {
      var lbl = c.querySelector('.stat-label, .metric-label, .summary-label');
      var val = c.querySelector('.stat-value, .metric-value, .summary-value');
      var sub = c.querySelector('.stat-sub, .metric-sub');
      if (lbl && val && val.textContent.trim() !== '—') {
        stats.push({
          label: lbl.textContent.trim(),
          value: sub ? (val.textContent.trim() + ' · ' + sub.textContent.trim()) : val.textContent.trim()
        });
      }
    });

    var verdict = '';
    var v = host.querySelector('.tier-box, #tierText, #interpretation, #verdict, .verdict-text, .result-desc, p.interpretation, .interpret-text');
    if (v) verdict = v.textContent.replace(/^What this opens:\s*/i, '').trim();

    return {
      primaryMetric: primary.slice(0, 80),
      stats: stats.slice(0, 6),
      verdict: verdict ? verdict.slice(0, 240) : ''
    };
  }

  function restoreRun(run) {
    if (!run || !Array.isArray(run.inputs)) return;
    var form = $('form') || $('.calc-panel');
    if (!form) return;
    var restored = 0;
    run.inputs.forEach(function (inp) {
      var el = document.getElementById(inp.key) || form.querySelector('[name="' + CSS.escape(inp.key) + '"]');
      if (!el) {
        var radios = form.querySelectorAll('input[type="radio"][name="' + CSS.escape(inp.key) + '"]');
        if (radios.length) {
          Array.prototype.forEach.call(radios, function (r) { r.checked = (r.value === inp.value); });
          restored++;
          return;
        }
      }
      if (el) {
        if (el.type === 'checkbox') el.checked = (inp.value === el.value || inp.value === 'true' || inp.value === 'Selected');
        else el.value = inp.value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        restored++;
      }
    });
    setTimeout(function () {
      var btn = form.querySelector('.btn-calc, button[type="submit"], #calcBtn, #calculateBtn, input[type="submit"]') || form.querySelector('button');
      if (btn) btn.click();
      else if (form.requestSubmit) form.requestSubmit();
    }, 120);
    toast('Restored inputs from "' + run.label + '" (' + restored + ' fields).');
  }

  function toast(msg) {
    var t = document.getElementById('afriRunsToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'afriRunsToast';
      t.className = 'afri-runs-toast';
      document.body.appendChild(t);
    }
    t.innerHTML = '<span class="afri-runs-toast-icon">' + ICONS.check + '</span><span>' + esc(msg) + '</span>';
    t.classList.add('is-visible');
    if (t._timer) clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove('is-visible'); }, 3600);
  }

  function injectStyles() {
    if (document.getElementById('afri-saved-runs-css')) return;
    var s = document.createElement('style');
    s.id = 'afri-saved-runs-css';
    s.textContent = [
      '.afri-runs-bar,.afri-runs-drawer,.afri-runs-modal,.afri-runs-toast,.afri-runs-backdrop{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;color:#000}',
      '.afri-runs-bar *,.afri-runs-drawer *,.afri-runs-modal *,.afri-runs-toast *{box-sizing:border-box;margin:0;padding:0}',
      '.afri-runs-bar *:focus-visible,.afri-runs-drawer *:focus-visible,.afri-runs-modal *:focus-visible{outline:2px solid #facc15;outline-offset:2px}',
      '.afri-runs-bar{display:block;margin:1.5rem 0;background:#fff;border:1px solid #e5e5e5;border-radius:1rem;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.04);width:100%}',
      '.afri-runs-bar-inner{display:flex;flex-direction:column;gap:1.25rem;padding:1.375rem 1.5rem}',
      '@media(min-width:720px){.afri-runs-bar-inner{flex-direction:row;align-items:center;justify-content:space-between;gap:1.5rem}}',
      '.afri-runs-bar-info{display:flex;align-items:flex-start;gap:1rem;min-width:0}',
      '.afri-runs-bar-icon{width:2.75rem;height:2.75rem;border-radius:.75rem;background:#000;color:#facc15;display:flex;align-items:center;justify-content:center;flex-shrink:0}',
      '.afri-runs-bar-icon svg{width:1.375rem;height:1.375rem}',
      '.afri-runs-bar-text{min-width:0}',
      '.afri-runs-bar-title{font-size:.9375rem;font-weight:900;color:#000;letter-spacing:-.01em;line-height:1.3;margin-bottom:.25rem}',
      '.afri-runs-bar-desc{font-size:.8125rem;color:#6b7280;line-height:1.55;max-width:36rem}',
      '.afri-runs-bar-actions{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;flex-shrink:0}',
      '.afri-runs-btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;font-size:.8125rem;font-weight:700;padding:.75rem 1.125rem;border-radius:.625rem;cursor:pointer;transition:background .15s ease,color .15s ease,border-color .15s ease,transform .1s ease;line-height:1;font-family:inherit;text-decoration:none;white-space:nowrap;border:1px solid transparent;min-height:44px}',
      '.afri-runs-btn svg{width:1rem;height:1rem;flex-shrink:0}',
      '.afri-runs-btn:active{transform:scale(.98)}',
      '.afri-runs-btn-yellow{background:#facc15;color:#000;border-color:#facc15}',
      '.afri-runs-btn-yellow:hover{background:#fde047;border-color:#fde047}',
      '.afri-runs-btn-outline{background:#fff;color:#000;border-color:#e5e5e5}',
      '.afri-runs-btn-outline:hover{background:#fef3c7;border-color:#facc15}',
      '.afri-runs-btn-dark{background:#000;color:#fde047}',
      '.afri-runs-btn-dark:hover{background:#1a1a1a;color:#facc15}',
      '.afri-runs-btn[disabled]{opacity:.45;cursor:not-allowed;pointer-events:none}',
      '.afri-runs-badge{display:inline-flex;align-items:center;justify-content:center;background:#000;color:#facc15;font-size:.6875rem;font-weight:800;padding:0 .4375rem;border-radius:999px;min-width:1.375rem;height:1.375rem;line-height:1}',
      '.afri-runs-btn-yellow .afri-runs-badge{background:#000;color:#facc15}',
      '.nav-runs-btn{display:inline-flex;align-items:center;gap:.5rem;background:transparent;color:#cbd5e1;font-size:.875rem;font-weight:600;padding:.5rem .75rem;border:1px solid rgba(255,255,255,.15);border-radius:.5rem;cursor:pointer;transition:color .15s ease,border-color .15s ease,background .15s ease;line-height:1;font-family:inherit;min-height:36px}',
      '.nav-runs-btn:hover{color:#fde047;border-color:rgba(250,204,21,.4);background:rgba(255,255,255,.05)}',
      '.nav-runs-btn svg{width:1rem;height:1rem;flex-shrink:0}',
      '.nav-runs-badge{display:inline-flex;align-items:center;justify-content:center;background:#facc15;color:#000;font-size:.6875rem;font-weight:800;min-width:1.25rem;height:1.25rem;padding:0 .375rem;border-radius:999px;line-height:1}',
      '.mobile-runs-link{display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:.5rem 0;font-size:.875rem;font-weight:600;color:#cbd5e1;transition:color .15s ease}',
      '.mobile-runs-link:hover{color:#fde047}',
      '.mobile-runs-link-icon{display:inline-flex;align-items:center;gap:.625rem;min-width:0}',
      '.mobile-runs-link-icon svg{width:1.125rem;height:1.125rem;color:#facc15;flex-shrink:0}',
      '.afri-runs-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.62);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);z-index:9998;opacity:0;visibility:hidden;transition:opacity .22s ease,visibility .22s ease}',
      '.afri-runs-backdrop.is-open{opacity:1;visibility:visible}',
      '.afri-runs-drawer{position:fixed;top:0;right:0;bottom:0;width:100%;max-width:520px;background:#fff;box-shadow:-12px 0 40px rgba(0,0,0,.28);z-index:9999;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .28s cubic-bezier(.16,1,.3,1)}',
      '.afri-runs-drawer.is-open{transform:translateX(0)}',
      '.afri-runs-header{background:#000;color:#fff;padding:1.25rem 1.5rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;border-bottom:1px solid rgba(255,255,255,.1)}',
      '.afri-runs-header-brand{display:flex;align-items:center;gap:.75rem;min-width:0}',
      '.afri-runs-header-brand svg{width:1.5rem;height:1.5rem;flex-shrink:0}',
      '.afri-runs-header-title{font-size:1.0625rem;font-weight:900;color:#fff;letter-spacing:-.01em;line-height:1.2}',
      '.afri-runs-header-sub{font-size:.6875rem;color:#9ca3af;font-weight:600;margin-top:.125rem;letter-spacing:.02em}',
      '.afri-runs-close{background:transparent;border:none;color:#9ca3af;cursor:pointer;padding:.5rem;border-radius:.5rem;display:flex;align-items:center;justify-content:center;transition:color .15s ease,background .15s ease;min-width:40px;min-height:40px}',
      '.afri-runs-close:hover{color:#fff;background:rgba(255,255,255,.1)}',
      '.afri-runs-close svg{width:1.125rem;height:1.125rem}',
      '.afri-runs-tabs{display:flex;background:#f9fafb;padding:.5rem;gap:.375rem;border-bottom:1px solid #e5e5e5}',
      '.afri-runs-tab{flex:1;background:transparent;border:none;padding:.75rem .875rem;font-size:.8125rem;font-weight:700;color:#6b7280;border-radius:.5rem;cursor:pointer;transition:background .15s ease,color .15s ease,box-shadow .15s ease;display:flex;align-items:center;justify-content:center;gap:.5rem;font-family:inherit;min-height:44px}',
      '.afri-runs-tab:hover{color:#000}',
      '.afri-runs-tab.is-active{background:#fff;color:#000;box-shadow:0 1px 3px rgba(0,0,0,.06),0 0 0 1px #e5e5e5}',
      '.afri-runs-tab .afri-runs-badge{background:#f3f4f6;color:#6b7280}',
      '.afri-runs-tab.is-active .afri-runs-badge{background:#000;color:#facc15}',
      '.afri-runs-body{flex:1;overflow-y:auto;padding:1.25rem;display:flex;flex-direction:column;gap:1rem;background:#f9fafb;-webkit-overflow-scrolling:touch}',
      '.afri-runs-empty{text-align:center;padding:3.5rem 1.5rem;display:flex;flex-direction:column;align-items:center;justify-content:center}',
      '.afri-runs-empty-icon{width:4rem;height:4rem;border-radius:50%;background:#fff;border:1px solid #e5e5e5;color:#ca8a04;display:flex;align-items:center;justify-content:center;margin-bottom:1.125rem}',
      '.afri-runs-empty-icon svg{width:1.75rem;height:1.75rem}',
      '.afri-runs-empty-title{font-size:1rem;font-weight:900;color:#000;letter-spacing:-.01em;margin-bottom:.375rem}',
      '.afri-runs-empty-desc{font-size:.8125rem;color:#6b7280;max-width:280px;line-height:1.6}',
      '.afri-run-card{background:#fff;border:1px solid #e5e5e5;border-radius:1rem;padding:1.125rem;display:flex;flex-direction:column;gap:.875rem;transition:border-color .15s ease,box-shadow .15s ease}',
      '.afri-run-card:hover{border-color:#facc15;box-shadow:0 2px 8px rgba(0,0,0,.05)}',
      '.afri-run-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:.75rem}',
      '.afri-run-card-titles{flex:1;min-width:0}',
      '.afri-run-card-label{font-size:.9375rem;font-weight:900;color:#000;letter-spacing:-.01em;line-height:1.3;display:flex;align-items:center;gap:.5rem;margin-bottom:.25rem}',
      '.afri-run-card-label span:first-child{overflow-wrap:break-word;word-break:break-word}',
      '.afri-run-edit{background:transparent;border:none;color:#9ca3af;cursor:pointer;padding:.25rem;border-radius:.375rem;display:inline-flex;align-items:center;justify-content:center;transition:color .15s ease,background .15s ease;flex-shrink:0}',
      '.afri-run-edit:hover{color:#000;background:#f3f4f6}',
      '.afri-run-edit svg{width:.875rem;height:.875rem}',
      '.afri-run-card-meta{font-size:.75rem;color:#6b7280;display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;line-height:1.4}',
      '.afri-run-card-meta-sep{color:#d1d5db}',
      '.afri-run-metric{padding:.625rem .875rem;background:#fef3c7;border:1px solid #facc15;border-radius:.625rem;font-size:.9375rem;font-weight:900;color:#000;line-height:1.2;text-align:center;letter-spacing:-.01em;overflow-wrap:break-word;word-break:break-word}',
      '.afri-run-stats{display:grid;grid-template-columns:1fr 1fr;gap:.5rem}',
      '.afri-run-stat{background:#f9fafb;border:1px solid #f3f4f6;border-radius:.5rem;padding:.625rem .75rem;min-width:0}',
      '.afri-run-stat-lbl{display:block;font-size:.6875rem;color:#6b7280;font-weight:600;line-height:1.3;margin-bottom:.125rem;overflow-wrap:break-word;word-break:break-word}',
      '.afri-run-stat-val{display:block;font-size:.8125rem;color:#000;font-weight:800;line-height:1.3;overflow-wrap:break-word;word-break:break-word}',
      '.afri-run-verdict{font-size:.75rem;color:#222;line-height:1.55;background:#f9fafb;border-left:3px solid #facc15;padding:.625rem .75rem;border-radius:0 .5rem .5rem 0;overflow-wrap:break-word;word-break:break-word}',
      '.afri-run-toggle{align-self:flex-start;background:transparent;border:none;padding:0;font-size:.75rem;font-weight:700;color:#ca8a04;cursor:pointer;text-decoration:underline;text-underline-offset:3px;font-family:inherit}',
      '.afri-run-toggle:hover{color:#000}',
      '.afri-run-inputs{display:none;background:#f9fafb;border:1px solid #e5e5e5;border-radius:.5rem;padding:.75rem;font-size:.75rem;max-height:200px;overflow-y:auto}',
      '.afri-run-inputs.is-visible{display:block}',
      '.afri-run-input-row{display:flex;justify-content:space-between;gap:.75rem;padding:.375rem 0;border-bottom:1px dashed #e5e5e5}',
      '.afri-run-input-row:last-child{border-bottom:none}',
      '.afri-run-input-lbl{color:#6b7280;flex:1;min-width:0;overflow-wrap:break-word;word-break:break-word}',
      '.afri-run-input-val{color:#000;font-weight:700;text-align:right;flex-shrink:0;max-width:55%;overflow-wrap:break-word;word-break:break-word}',
      '.afri-run-actions{display:flex;align-items:center;gap:.375rem;border-top:1px solid #f3f4f6;padding-top:.75rem;flex-wrap:wrap}',
      '.afri-run-act{display:inline-flex;align-items:center;gap:.375rem;font-size:.75rem;font-weight:700;padding:.625rem .875rem;border-radius:.5rem;cursor:pointer;transition:background .15s ease,color .15s ease,border-color .15s ease;line-height:1;font-family:inherit;border:1px solid transparent;min-height:40px}',
      '.afri-run-act svg{width:.875rem;height:.875rem;flex-shrink:0}',
      '.afri-run-act-load{background:#000;color:#fff}',
      '.afri-run-act-load:hover{background:#1a1a1a;color:#fde047}',
      '.afri-run-act-compare{background:#fff;color:#000;border-color:#e5e5e5}',
      '.afri-run-act-compare:hover{background:#fef3c7;border-color:#facc15}',
      '.afri-run-act-del{background:transparent;color:#6b7280;margin-left:auto}',
      '.afri-run-act-del:hover{background:#000;color:#fff}',
      '.afri-runs-footer{padding:1rem 1.25rem;background:#fff;border-top:1px solid #e5e5e5;display:flex;flex-direction:column;gap:.75rem}',
      '.afri-runs-footer-row{display:flex;align-items:stretch;gap:.5rem;flex-wrap:wrap}',
      '.afri-runs-footer-row .afri-runs-btn{flex:1;min-width:0}',
      '.afri-runs-privacy{font-size:.6875rem;color:#9ca3af;text-align:center;line-height:1.5;font-weight:500}',
      '.afri-runs-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.68);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);z-index:10000;display:flex;align-items:center;justify-content:center;padding:1rem;opacity:0;visibility:hidden;transition:opacity .2s ease,visibility .2s ease}',
      '.afri-runs-modal-overlay.is-open{opacity:1;visibility:visible}',
      '.afri-runs-modal{background:#fff;border-radius:1rem;width:100%;max-width:560px;box-shadow:0 24px 48px -12px rgba(0,0,0,.28);display:flex;flex-direction:column;max-height:calc(100vh - 2rem);overflow:hidden;border:1px solid #e5e5e5;transform:translateY(8px);transition:transform .2s ease}',
      '.afri-runs-modal-overlay.is-open .afri-runs-modal{transform:translateY(0)}',
      '.afri-runs-modal.afri-compare-modal{max-width:780px}',
      '.afri-runs-modal-header{background:#000;color:#fff;padding:1.25rem 1.5rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-shrink:0}',
      '.afri-runs-modal-title{font-size:1rem;font-weight:900;color:#fff;letter-spacing:-.01em;display:flex;align-items:center;gap:.625rem;line-height:1.2}',
      '.afri-runs-modal-title svg{width:1.25rem;height:1.25rem;color:#facc15;flex-shrink:0}',
      '.afri-runs-modal-body{padding:1.5rem;overflow-y:auto;display:flex;flex-direction:column;gap:1.25rem;-webkit-overflow-scrolling:touch}',
      '.afri-runs-modal-footer{padding:1rem 1.5rem;background:#f9fafb;border-top:1px solid #e5e5e5;display:flex;align-items:center;justify-content:flex-end;gap:.5rem;flex-wrap:wrap;flex-shrink:0}',
      '.afri-runs-preview{background:#f9fafb;border:1px solid #e5e5e5;border-radius:.75rem;padding:1.125rem;display:flex;flex-direction:column;gap:.375rem}',
      '.afri-runs-preview-tool{font-size:.6875rem;font-weight:800;color:#ca8a04;text-transform:uppercase;letter-spacing:.08em}',
      '.afri-runs-preview-metric{font-size:1.125rem;font-weight:900;color:#000;letter-spacing:-.01em;line-height:1.3;overflow-wrap:break-word;word-break:break-word}',
      '.afri-runs-preview-verdict{font-size:.75rem;color:#4b5563;line-height:1.55}',
      '.afri-runs-form{display:flex;flex-direction:column;gap:.5rem}',
      '.afri-runs-form-label{font-size:.8125rem;font-weight:700;color:#000}',
      '.afri-runs-form-input{width:100%;padding:.75rem .875rem;border:1px solid #e5e5e5;border-radius:.5rem;font-size:16px;font-family:inherit;font-weight:500;color:#000;background:#fff;outline:none;transition:border-color .15s ease,box-shadow .15s ease;min-height:44px}',
      '.afri-runs-form-input:focus{border-color:#facc15;box-shadow:0 0 0 3px rgba(250,204,21,.25)}',
      '.afri-runs-form-input::placeholder{color:#9ca3af;font-weight:400}',
      '.afri-runs-hint{font-size:.75rem;color:#6b7280;line-height:1.55}',
      '.afri-compare-grid{display:grid;grid-template-columns:1fr;gap:.875rem}',
      '@media(min-width:640px){.afri-compare-grid{grid-template-columns:1fr 1fr}}',
      '.afri-compare-col{background:#f9fafb;border:1px solid #e5e5e5;border-radius:.75rem;padding:1rem;display:flex;flex-direction:column;gap:.625rem}',
      '.afri-compare-col.is-new{border-color:#facc15;background:#fef3c7}',
      '.afri-compare-col-head{display:flex;align-items:center;justify-content:space-between;gap:.5rem;padding-bottom:.5rem;border-bottom:1px solid #e5e5e5}',
      '.afri-compare-tag{font-size:.6875rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;padding:.25rem .5rem;border-radius:.375rem;background:#000;color:#facc15;line-height:1}',
      '.afri-compare-col.is-new .afri-compare-tag{background:#facc15;color:#000}',
      '.afri-compare-date{font-size:.6875rem;color:#6b7280;font-weight:600}',
      '.afri-compare-label{font-size:.9375rem;font-weight:900;color:#000;letter-spacing:-.01em;line-height:1.3;overflow-wrap:break-word;word-break:break-word}',
      '.afri-compare-metric{background:#fff;border:1px solid #e5e5e5;border-radius:.5rem;padding:.75rem;text-align:center;font-size:1rem;font-weight:900;color:#000;letter-spacing:-.01em;line-height:1.3;overflow-wrap:break-word;word-break:break-word}',
      '.afri-compare-col.is-new .afri-compare-metric{border-color:#facc15}',
      '.afri-compare-verdict{font-size:.6875rem;color:#4b5563;line-height:1.5;overflow-wrap:break-word;word-break:break-word}',
      '.afri-compare-banner{background:#000;color:#fff;border-radius:.75rem;padding:.875rem 1.125rem;display:flex;align-items:center;justify-content:space-between;gap:.75rem;flex-wrap:wrap}',
      '.afri-compare-banner-title{font-size:.8125rem;font-weight:700;color:#cbd5e1;line-height:1.3}',
      '.afri-compare-banner-badge{font-size:.8125rem;font-weight:900;color:#facc15;display:inline-flex;align-items:center;gap:.375rem;line-height:1}',
      '.afri-compare-banner-badge svg{width:1rem;height:1rem}',
      '.afri-compare-table-title{font-size:.8125rem;font-weight:900;color:#000;letter-spacing:-.01em;margin-bottom:.5rem}',
      '.afri-compare-table-wrap{border:1px solid #e5e5e5;border-radius:.625rem;overflow:hidden}',
      '.afri-compare-table{width:100%;border-collapse:collapse;font-size:.75rem;table-layout:fixed}',
      '.afri-compare-table th{text-align:left;padding:.625rem .75rem;background:#f9fafb;color:#4b5563;font-weight:800;font-size:.6875rem;text-transform:uppercase;letter-spacing:.04em;border-bottom:1px solid #e5e5e5}',
      '.afri-compare-table td{padding:.625rem .75rem;border-bottom:1px solid #f3f4f6;color:#222;line-height:1.5;overflow-wrap:break-word;word-break:break-word;vertical-align:top}',
      '.afri-compare-table tr:last-child td{border-bottom:none}',
      '.afri-compare-table tr.is-diff{background:#fef3c7}',
      '.afri-compare-table tr.is-diff td{color:#000}',
      '.afri-compare-flag{display:inline-block;font-size:.625rem;font-weight:900;color:#ca8a04;letter-spacing:.04em;margin-left:.25rem;vertical-align:middle}',
      '.afri-compare-selectors{display:grid;grid-template-columns:1fr;gap:.75rem}',
      '@media(min-width:640px){.afri-compare-selectors{grid-template-columns:1fr 1fr}}',
      '.afri-compare-selector-label{display:block;font-size:.6875rem;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;margin-bottom:.375rem}',
      '.afri-runs-toast{position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%) translateY(100px);background:#000;color:#fff;padding:.875rem 1.25rem;border-radius:999px;box-shadow:0 12px 32px rgba(0,0,0,.35);display:inline-flex;align-items:center;gap:.625rem;font-size:.8125rem;font-weight:700;z-index:10001;opacity:0;pointer-events:none;transition:transform .28s cubic-bezier(.16,1,.3,1),opacity .28s ease;border:1px solid rgba(255,255,255,.12);max-width:calc(100vw - 2rem);text-align:center}',
      '.afri-runs-toast.is-visible{transform:translateX(-50%) translateY(0);opacity:1;pointer-events:auto}',
      '.afri-runs-toast-icon{color:#facc15;display:flex;align-items:center;flex-shrink:0}',
      '.afri-runs-toast-icon svg{width:1.125rem;height:1.125rem}',
      '@media(max-width:420px){.afri-runs-bar-inner{padding:1.125rem}.afri-runs-bar-actions{width:100%}.afri-runs-bar-actions .afri-runs-btn{flex:1;min-width:0}.afri-runs-footer-row{flex-direction:column}.afri-runs-modal-footer .afri-runs-btn{flex:1}}'
    ].join('');
    document.head.appendChild(s);
  }

  function updateNavBadges() {
    var total = getAllRuns().length;
    var d = $('#afriNavRunsBadge');
    var m = $('#afriMobileRunsBadge');
    if (d) { if (total > 0) { d.textContent = total > 99 ? '99+' : total; d.style.display = 'inline-flex'; } else d.style.display = 'none'; }
    if (m) { if (total > 0) { m.textContent = total > 99 ? '99+' : total; m.style.display = 'inline-flex'; } else m.style.display = 'none'; }
  }

  function injectNav() {
    var navLinks = $('.nav-links');
    if (navLinks && !$('#afriNavRunsBtn')) {
      var btn = document.createElement('button');
      btn.id = 'afriNavRunsBtn';
      btn.type = 'button';
      btn.className = 'nav-runs-btn';
      btn.setAttribute('aria-label', 'Open saved calculations');
      btn.innerHTML = ICONS.history + '<span>Saved Runs</span><span id="afriNavRunsBadge" class="nav-runs-badge" style="display:none">0</span>';
      btn.addEventListener('click', function () { openDrawer(); });
      var fav = $('#afriNavFavBtn');
      var dd = navLinks.querySelector('.nav-dropdown');
      if (fav) navLinks.insertBefore(btn, fav.nextSibling);
      else if (dd) navLinks.insertBefore(btn, dd);
      else navLinks.appendChild(btn);
    }
    var mm = $('#mobileMenu');
    if (mm && !$('#afriMobileRunsLink')) {
      var link = document.createElement('a');
      link.id = 'afriMobileRunsLink';
      link.href = '#';
      link.className = 'mobile-runs-link';
      link.innerHTML = '<span class="mobile-runs-link-icon">' + ICONS.history + '<span>My Saved Runs</span></span><span id="afriMobileRunsBadge" class="nav-runs-badge" style="display:none">0</span>';
      link.addEventListener('click', function (e) { e.preventDefault(); mm.classList.remove('open'); openDrawer(); });
      var mf = $('#afriMobileFavLink');
      if (mf) mm.insertBefore(link, mf.nextSibling);
      else mm.appendChild(link);
    }
    updateNavBadges();
  }

  function injectInlineBar() {
    if (!isCalculatorPage() || $('#afriRunsBar')) return;
    var host = findResultHost();
    if (!host) return;
    var bar = document.createElement('div');
    bar.id = 'afriRunsBar';
    bar.className = 'afri-runs-bar';
    var count = runsForTool().length;
    bar.innerHTML =
      '<div class="afri-runs-bar-inner">' +
        '<div class="afri-runs-bar-info">' +
          '<div class="afri-runs-bar-icon">' + ICONS.history + '</div>' +
          '<div class="afri-runs-bar-text">' +
            '<h3 class="afri-runs-bar-title">Calculation History &amp; Progress Tracking</h3>' +
            '<p class="afri-runs-bar-desc">Save this run to compare with past results or track how your numbers change over time. Everything stays on your device.</p>' +
          '</div>' +
        '</div>' +
        '<div class="afri-runs-bar-actions">' +
          '<button id="afriSaveRunBtn" type="button" class="afri-runs-btn afri-runs-btn-yellow">' + ICONS.bookmark + '<span>Save This Run</span></button>' +
          '<button id="afriViewRunsBtn" type="button" class="afri-runs-btn afri-runs-btn-outline">' + ICONS.history + '<span>Saved Runs</span><span id="afriRunsCountBadge" class="afri-runs-badge" style="' + (count > 0 ? '' : 'display:none;') + '">' + count + '</span></button>' +
        '</div>' +
      '</div>';
    var share = $('#afriShareBar');
    if (share) share.parentNode.insertBefore(bar, share);
    else if (host.id === 'results' || host.id === 'cfResults' || host.classList.contains('results')) host.appendChild(bar);
    else if (host.classList.contains('calc-panel')) host.insertAdjacentElement('afterend', bar);
    else host.appendChild(bar);
    var s = $('#afriSaveRunBtn'); if (s) s.addEventListener('click', openSaveModal);
    var v = $('#afriViewRunsBtn'); if (v) v.addEventListener('click', function () { openDrawer('current'); });
  }

  function updateInlineBadge() {
    var b = $('#afriRunsCountBadge');
    if (!b) return;
    var c = runsForTool().length;
    b.textContent = c;
    b.style.display = c > 0 ? 'inline-flex' : 'none';
  }

  function openSaveModal() {
    var inputs = captureInputs();
    var summary = captureSummary();
    var title = toolTitle();
    var s = slug();
    var num = runsForTool().length + 1;
    var defLabel = 'Run #' + num + ' · ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    var ov = $('#afriSaveModalOverlay');
    if (!ov) {
      ov = document.createElement('div');
      ov.id = 'afriSaveModalOverlay';
      ov.className = 'afri-runs-modal-overlay';
      document.body.appendChild(ov);
    }
    ov.innerHTML =
      '<div class="afri-runs-modal" role="dialog" aria-modal="true" aria-labelledby="afriSaveTitle">' +
        '<div class="afri-runs-modal-header">' +
          '<h3 id="afriSaveTitle" class="afri-runs-modal-title">' + ICONS.bookmark + '<span>Save Calculation Run</span></h3>' +
          '<button id="afriSaveClose" type="button" class="afri-runs-close" aria-label="Close">' + ICONS.close + '</button>' +
        '</div>' +
        '<div class="afri-runs-modal-body">' +
          '<div class="afri-runs-preview">' +
            '<span class="afri-runs-preview-tool">' + esc(title) + '</span>' +
            '<span class="afri-runs-preview-metric">' + esc(summary.primaryMetric) + '</span>' +
            (summary.verdict ? '<span class="afri-runs-preview-verdict">' + esc(summary.verdict.slice(0, 160)) + '</span>' : '') +
          '</div>' +
          '<div class="afri-runs-form">' +
            '<label class="afri-runs-form-label" for="afriRunLabel">Run label</label>' +
            '<input id="afriRunLabel" type="text" class="afri-runs-form-input" value="' + esc(defLabel) + '" placeholder="e.g. Mock Exam 1, First Quote, Midterm Target" maxlength="50" />' +
          '</div>' +
          '<p class="afri-runs-hint">This run will be saved with all ' + inputs.length + ' input values so you can restore or compare it anytime. Nothing leaves your browser.</p>' +
        '</div>' +
        '<div class="afri-runs-modal-footer">' +
          '<button id="afriSaveCancel" type="button" class="afri-runs-btn afri-runs-btn-outline">Cancel</button>' +
          '<button id="afriSaveConfirm" type="button" class="afri-runs-btn afri-runs-btn-yellow">' + ICONS.check + '<span>Save Run</span></button>' +
        '</div>' +
      '</div>';
    ov.classList.add('is-open');
    var input = $('#afriRunLabel');
    if (input) { setTimeout(function () { input.focus(); input.select(); }, 60); }

    function close() { ov.classList.remove('is-open'); }
    $('#afriSaveClose').addEventListener('click', close);
    $('#afriSaveCancel').addEventListener('click', close);
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });

    $('#afriSaveConfirm').addEventListener('click', function () {
      var label = (input && input.value.trim()) || defLabel;
      var now = new Date();
      var ds = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ' · ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      addRun({
        id: 'run_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
        toolSlug: s,
        toolTitle: title,
        toolUrl: location.pathname,
        timestamp: Date.now(),
        dateStr: ds,
        label: label,
        summary: summary,
        inputs: inputs
      });
      close();
      toast('Saved "' + label + '" to your history.');
    });
  }

  var drawerTab = 'current';
  var selectedIds = [];

  function createDrawer() {
    if ($('#afriRunsDrawer')) return;
    var bd = document.createElement('div');
    bd.id = 'afriRunsBackdrop';
    bd.className = 'afri-runs-backdrop';
    document.body.appendChild(bd);

    var dr = document.createElement('div');
    dr.id = 'afriRunsDrawer';
    dr.className = 'afri-runs-drawer';
    dr.setAttribute('role', 'dialog');
    dr.setAttribute('aria-modal', 'true');
    dr.setAttribute('aria-label', 'Saved runs');
    dr.innerHTML =
      '<div class="afri-runs-header">' +
        '<div class="afri-runs-header-brand">' + ICONS.brandLogo +
          '<div><h2 class="afri-runs-header-title">Saved Runs</h2><p class="afri-runs-header-sub">Local history · zero uploads</p></div>' +
        '</div>' +
        '<button id="afriDrawerClose" type="button" class="afri-runs-close" aria-label="Close">' + ICONS.close + '</button>' +
      '</div>' +
      '<div class="afri-runs-tabs" role="tablist">' +
        '<button id="afriTabCurrent" type="button" class="afri-runs-tab is-active" role="tab" aria-selected="true"><span>This Tool</span><span id="afriTabCurrentBadge" class="afri-runs-badge">0</span></button>' +
        '<button id="afriTabAll" type="button" class="afri-runs-tab" role="tab" aria-selected="false"><span>All Saved</span><span id="afriTabAllBadge" class="afri-runs-badge">0</span></button>' +
      '</div>' +
      '<div id="afriRunsList" class="afri-runs-body"></div>' +
      '<div class="afri-runs-footer">' +
        '<div class="afri-runs-footer-row">' +
          '<button id="afriCompareBtn" type="button" class="afri-runs-btn afri-runs-btn-yellow">' + ICONS.compare + '<span>Compare two runs</span></button>' +
          '<button id="afriClearBtn" type="button" class="afri-runs-btn afri-runs-btn-outline" title="Clear saved runs">' + ICONS.trash + '<span>Clear</span></button>' +
        '</div>' +
        '<p class="afri-runs-privacy">Saved 100% locally in your browser. Nothing is ever uploaded.</p>' +
      '</div>';
    document.body.appendChild(dr);

    bd.addEventListener('click', closeDrawer);
    $('#afriDrawerClose').addEventListener('click', closeDrawer);
    $('#afriTabCurrent').addEventListener('click', function () { drawerTab = 'current'; renderDrawer(); });
    $('#afriTabAll').addEventListener('click', function () { drawerTab = 'all'; renderDrawer(); });
    $('#afriCompareBtn').addEventListener('click', function () { openCompare(null); });
    $('#afriClearBtn').addEventListener('click', function () {
      var isCur = drawerTab === 'current';
      var msg = isCur ? 'Clear all saved runs for this calculator?' : 'Clear every saved run across all tools?';
      if (!confirm(msg)) return;
      if (isCur) clearToolRuns(); else clearAllRuns();
      renderDrawer();
      toast('Saved runs cleared.');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      closeDrawer();
      var m1 = $('#afriSaveModalOverlay'); if (m1) m1.classList.remove('is-open');
      var m2 = $('#afriCompareModalOverlay'); if (m2) m2.classList.remove('is-open');
    });
  }

  function openDrawer(tab) {
    createDrawer();
    drawerTab = tab || 'current';
    selectedIds = [];
    renderDrawer();
    $('#afriRunsBackdrop').classList.add('is-open');
    $('#afriRunsDrawer').classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    var b = $('#afriRunsBackdrop'); if (b) b.classList.remove('is-open');
    var d = $('#afriRunsDrawer'); if (d) d.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function renderDrawer() {
    var list = $('#afriRunsList');
    if (!list) return;
    var cur = runsForTool();
    var all = getAllRuns();
    var bc = $('#afriTabCurrentBadge'); if (bc) bc.textContent = cur.length;
    var ba = $('#afriTabAllBadge'); if (ba) ba.textContent = all.length;
    var tc = $('#afriTabCurrent'); var ta = $('#afriTabAll');
    if (drawerTab === 'current') { tc.classList.add('is-active'); ta.classList.remove('is-active'); tc.setAttribute('aria-selected', 'true'); ta.setAttribute('aria-selected', 'false'); }
    else { ta.classList.add('is-active'); tc.classList.remove('is-active'); ta.setAttribute('aria-selected', 'true'); tc.setAttribute('aria-selected', 'false'); }

    var runs = drawerTab === 'current' ? cur : all;
    var cmp = $('#afriCompareBtn');
    if (cmp) {
      var canCompare = runs.length >= 2;
      cmp.disabled = !canCompare;
      cmp.setAttribute('aria-disabled', canCompare ? 'false' : 'true');
    }

    if (runs.length === 0) {
      list.innerHTML =
        '<div class="afri-runs-empty">' +
          '<div class="afri-runs-empty-icon">' + ICONS.history + '</div>' +
          '<h3 class="afri-runs-empty-title">No saved runs yet</h3>' +
          '<p class="afri-runs-empty-desc">' +
            (drawerTab === 'current'
              ? 'Run a calculation above and tap "Save This Run" to start tracking your progress.'
              : 'Save a calculation from any AfriWidget tool to build your personal history.') +
          '</p>' +
        '</div>';
      return;
    }

    var html = '';
    runs.forEach(function (run) {
      var badge = run.summary && run.summary.primaryMetric ? run.summary.primaryMetric : '—';
      var statsHtml = '';
      if (run.summary && run.summary.stats && run.summary.stats.length) {
        statsHtml = '<div class="afri-run-stats">' + run.summary.stats.map(function (st) {
          return '<div class="afri-run-stat"><span class="afri-run-stat-lbl">' + esc(st.label) + '</span><span class="afri-run-stat-val">' + esc(st.value) + '</span></div>';
        }).join('') + '</div>';
      }
      var verdictHtml = (run.summary && run.summary.verdict) ? '<div class="afri-run-verdict">' + esc(run.summary.verdict) + '</div>' : '';
      html +=
        '<div class="afri-run-card" data-run-id="' + esc(run.id) + '">' +
          '<div class="afri-run-card-head">' +
            '<div class="afri-run-card-titles">' +
              '<h4 class="afri-run-card-label"><span>' + esc(run.label) + '</span>' +
                '<button type="button" class="afri-run-edit" data-edit="' + esc(run.id) + '" title="Rename" aria-label="Rename">' + ICONS.edit + '</button>' +
              '</h4>' +
              '<div class="afri-run-card-meta"><span>' + esc(run.toolTitle) + '</span><span class="afri-run-card-meta-sep">·</span><span>' + esc(run.dateStr) + '</span></div>' +
            '</div>' +
          '</div>' +
          '<div class="afri-run-metric">' + esc(badge) + '</div>' +
          statsHtml +
          verdictHtml +
          '<button type="button" class="afri-run-toggle" data-toggle="' + esc(run.id) + '">Show ' + run.inputs.length + ' input' + (run.inputs.length === 1 ? '' : 's') + '</button>' +
          '<div class="afri-run-inputs" id="inputs_' + esc(run.id) + '">' +
            (run.inputs.length ? run.inputs.map(function (inp) {
              return '<div class="afri-run-input-row"><span class="afri-run-input-lbl">' + esc(inp.label) + '</span><span class="afri-run-input-val">' + esc(inp.displayValue || inp.value) + '</span></div>';
            }).join('') : '<div class="afri-run-input-row"><span class="afri-run-input-lbl">No inputs recorded</span></div>') +
          '</div>' +
          '<div class="afri-run-actions">' +
            '<button type="button" class="afri-run-act afri-run-act-load" data-load="' + esc(run.id) + '">' + ICONS.restore + '<span>Load</span></button>' +
            '<button type="button" class="afri-run-act afri-run-act-compare" data-compare="' + esc(run.id) + '">' + ICONS.compare + '<span>Compare</span></button>' +
            '<button type="button" class="afri-run-act afri-run-act-del" data-del="' + esc(run.id) + '" title="Delete" aria-label="Delete">' + ICONS.trash + '<span>Delete</span></button>' +
          '</div>' +
        '</div>';
    });
    list.innerHTML = html;

    $$('[data-toggle]', list).forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-toggle');
        var box = document.getElementById('inputs_' + id);
        if (!box) return;
        var vis = box.classList.toggle('is-visible');
        var run = getAllRuns().find(function (r) { return r.id === id; });
        var n = run ? run.inputs.length : 0;
        b.textContent = vis ? 'Hide ' + n + ' input' + (n === 1 ? '' : 's') : 'Show ' + n + ' input' + (n === 1 ? '' : 's');
      });
    });
    $$('[data-load]', list).forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-load');
        var run = getAllRuns().find(function (r) { return r.id === id; });
        if (!run) return;
        if (run.toolSlug !== slug()) {
          if (confirm('This run is for "' + run.toolTitle + '". Open that tool to load the inputs?')) {
            sessionStorage.setItem(RESTORE_KEY, JSON.stringify(run));
            location.href = run.toolUrl;
          }
        } else {
          closeDrawer();
          restoreRun(run);
        }
      });
    });
    $$('[data-compare]', list).forEach(function (b) {
      b.addEventListener('click', function () { openCompare(b.getAttribute('data-compare')); });
    });
    $$('[data-edit]', list).forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-edit');
        var run = getAllRuns().find(function (r) { return r.id === id; });
        if (!run) return;
        var next = prompt('Rename this run:', run.label);
        if (next && next.trim()) { renameRun(id, next); renderDrawer(); }
      });
    });
    $$('[data-del]', list).forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-del');
        if (!confirm('Delete this saved run?')) return;
        deleteRun(id);
        renderDrawer();
        toast('Run deleted.');
      });
    });
  }

  function openCompare(preselect) {
    var runs = runsForTool();
    if (runs.length < 2) {
      alert('You need at least 2 saved runs for this calculator to compare them.');
      return;
    }
    var runA = runs[1];
    var runB = runs[0];
    if (preselect) {
      var m = runs.find(function (r) { return r.id === preselect; });
      if (m) { runB = m; runA = runs.find(function (r) { return r.id !== preselect; }) || runs[0]; }
    }
    var ov = $('#afriCompareModalOverlay');
    if (!ov) {
      ov = document.createElement('div');
      ov.id = 'afriCompareModalOverlay';
      ov.className = 'afri-runs-modal-overlay';
      document.body.appendChild(ov);
    }

    function render() {
      var aIn = {}; runA.inputs.forEach(function (i) { aIn[i.key] = i; });
      var bIn = {}; runB.inputs.forEach(function (i) { bIn[i.key] = i; });
      var keys = Object.keys(aIn);
      Object.keys(bIn).forEach(function (k) { if (keys.indexOf(k) === -1) keys.push(k); });
      var rows = keys.map(function (k) {
        var a = aIn[k], b = bIn[k];
        var label = (a && a.label) || (b && b.label) || k;
        var va = a ? (a.displayValue || a.value) : '—';
        var vb = b ? (b.displayValue || b.value) : '—';
        return { label: label, a: va, b: vb, diff: va !== vb };
      });
      var changed = rows.filter(function (r) { return r.diff; }).length;

      ov.innerHTML =
        '<div class="afri-runs-modal afri-compare-modal" role="dialog" aria-modal="true" aria-labelledby="afriCompareTitle">' +
          '<div class="afri-runs-modal-header">' +
            '<h3 id="afriCompareTitle" class="afri-runs-modal-title">' + ICONS.compare + '<span>Compare Runs</span></h3>' +
            '<button id="afriCompareClose" type="button" class="afri-runs-close" aria-label="Close">' + ICONS.close + '</button>' +
          '</div>' +
          '<div class="afri-runs-modal-body">' +
            '<div class="afri-compare-selectors">' +
              '<div><label class="afri-compare-selector-label" for="afriSelectA">Baseline (Run A)</label>' +
                '<select id="afriSelectA" class="afri-runs-form-input">' +
                  runs.map(function (r) { return '<option value="' + esc(r.id) + '"' + (r.id === runA.id ? ' selected' : '') + '>' + esc(r.label) + ' · ' + esc(r.dateStr.split('·')[0].trim()) + '</option>'; }).join('') +
                '</select></div>' +
              '<div><label class="afri-compare-selector-label" for="afriSelectB">Current (Run B)</label>' +
                '<select id="afriSelectB" class="afri-runs-form-input">' +
                  runs.map(function (r) { return '<option value="' + esc(r.id) + '"' + (r.id === runB.id ? ' selected' : '') + '>' + esc(r.label) + ' · ' + esc(r.dateStr.split('·')[0].trim()) + '</option>'; }).join('') +
                '</select></div>' +
            '</div>' +
            '<div class="afri-compare-grid">' +
              '<div class="afri-compare-col">' +
                '<div class="afri-compare-col-head"><span class="afri-compare-tag">Run A</span><span class="afri-compare-date">' + esc(runA.dateStr) + '</span></div>' +
                '<div class="afri-compare-label">' + esc(runA.label) + '</div>' +
                '<div class="afri-compare-metric">' + esc(runA.summary.primaryMetric) + '</div>' +
                (runA.summary.verdict ? '<div class="afri-compare-verdict">' + esc(runA.summary.verdict) + '</div>' : '') +
              '</div>' +
              '<div class="afri-compare-col is-new">' +
                '<div class="afri-compare-col-head"><span class="afri-compare-tag">Run B</span><span class="afri-compare-date">' + esc(runB.dateStr) + '</span></div>' +
                '<div class="afri-compare-label">' + esc(runB.label) + '</div>' +
                '<div class="afri-compare-metric">' + esc(runB.summary.primaryMetric) + '</div>' +
                (runB.summary.verdict ? '<div class="afri-compare-verdict">' + esc(runB.summary.verdict) + '</div>' : '') +
              '</div>' +
            '</div>' +
            '<div class="afri-compare-banner">' +
              '<span class="afri-compare-banner-title">Inputs changed between runs</span>' +
              '<span class="afri-compare-banner-badge">' + ICONS.trendUp + '<span>' + changed + ' ' + (changed === 1 ? 'field changed' : 'fields changed') + '</span></span>' +
            '</div>' +
            '<div>' +
              '<h5 class="afri-compare-table-title">Field-by-field breakdown</h5>' +
              '<div class="afri-compare-table-wrap"><table class="afri-compare-table">' +
                '<thead><tr><th style="width:40%">Field</th><th style="width:30%">Run A</th><th style="width:30%">Run B</th></tr></thead>' +
                '<tbody>' + rows.map(function (r) {
                  return '<tr' + (r.diff ? ' class="is-diff"' : '') + '>' +
                    '<td>' + esc(r.label) + '</td>' +
                    '<td>' + esc(r.a) + '</td>' +
                    '<td>' + esc(r.b) + (r.diff ? '<span class="afri-compare-flag">UPDATED</span>' : '') + '</td>' +
                  '</tr>';
                }).join('') + '</tbody>' +
              '</table></div>' +
            '</div>' +
          '</div>' +
          '<div class="afri-runs-modal-footer">' +
            '<button id="afriLoadA" type="button" class="afri-runs-btn afri-runs-btn-outline">' + ICONS.restore + '<span>Load Run A</span></button>' +
            '<button id="afriLoadB" type="button" class="afri-runs-btn afri-runs-btn-dark">' + ICONS.restore + '<span>Load Run B</span></button>' +
            '<button id="afriCompareDone" type="button" class="afri-runs-btn afri-runs-btn-yellow">Done</button>' +
          '</div>' +
        '</div>';

      $('#afriSelectA').addEventListener('change', function (e) {
        var s = runs.find(function (r) { return r.id === e.target.value; });
        if (s) { runA = s; render(); }
      });
      $('#afriSelectB').addEventListener('change', function (e) {
        var s = runs.find(function (r) { return r.id === e.target.value; });
        if (s) { runB = s; render(); }
      });
      function close() { ov.classList.remove('is-open'); }
      $('#afriCompareClose').addEventListener('click', close);
      $('#afriCompareDone').addEventListener('click', close);
      ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
      $('#afriLoadA').addEventListener('click', function () { close(); closeDrawer(); restoreRun(runA); });
      $('#afriLoadB').addEventListener('click', function () { close(); closeDrawer(); restoreRun(runB); });
    }

    render();
    ov.classList.add('is-open');
  }

  function checkPending() {
    try {
      var raw = sessionStorage.getItem(RESTORE_KEY);
      if (!raw) return;
      sessionStorage.removeItem(RESTORE_KEY);
      var run = JSON.parse(raw);
      if (run && run.toolSlug === slug()) setTimeout(function () { restoreRun(run); }, 400);
    } catch (e) {}
  }

  function observe() {
    if (!isCalculatorPage()) return;
    var check = function () {
      var host = findResultHost();
      if (!host) return;
      var visible = host.classList.contains('visible') ||
        host.style.display === 'block' ||
        window.getComputedStyle(host).display !== 'none';
      if (visible) injectInlineBar();
    };
    check();
    var host = findResultHost();
    if (host) new MutationObserver(check).observe(host, { attributes: true, childList: true, subtree: true });
    var f = $('form');
    if (f) f.addEventListener('submit', function () { setTimeout(check, 200); setTimeout(check, 600); });
    $$('.btn-calc, button[type="submit"], #calcBtn, #calculateBtn').forEach(function (b) {
      b.addEventListener('click', function () { setTimeout(check, 200); setTimeout(check, 600); });
    });
  }

  function init() {
    injectStyles();
    injectNav();
    observe();
    checkPending();
  }
  onReady(init);

  window.AfriWidgetSavedRuns = {
    openDrawer: openDrawer,
    openSaveModal: openSaveModal,
    openCompare: openCompare,
    getRuns: getAllRuns
  };
})();
