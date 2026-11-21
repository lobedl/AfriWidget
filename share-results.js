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

  const page = location.pathname.replace(/\/+$/, '').split('/').pop().replace(/\.html$/, '') || 'home';
  const params = new URLSearchParams(location.search);
  const IGNORED_QUERY_RE = /^(?:shared|cmp|compare|f_[a-z0-9_]+|utm_[a-z0-9_]+|fbclid|gclid|msclkid|twclid|mc_cid|mc_eid|_ga|_gl|ref)$/i;
  const hasSharedInputs = Array.from(params.keys()).some(k => !IGNORED_QUERY_RE.test(k));

  // =========================================================================
  // AfriWidget GA4 Custom Event Tracking Engine (Measurement ID: G-6V491CW7H0)
  // Zero PII, zero calculator inputs sent, zero duplicate counting.
  // =========================================================================
  const GA_MEASUREMENT_ID = 'G-6V491CW7H0';
  const GA_NON_TOOL_PAGES = new Set([
    '', 'home', 'index', 'education', 'finance', 'health', 'productivity',
    'business', 'use-cases', 'about', 'contact', 'faq', 'privacy-policy',
    'terms', 'cookie-policy', 'adsense-disclaimer', '404'
  ]);

  // Verified 126-tool canonical directory (name + category)
  const GA_TOOL_META = {
    "acsee-points-calculator":{"n":"ACSEE Points Calculator","c":"Education"},
    "ai-business-name-generator":{"n":"AI Business Name Generator","c":"Business"},
    "ai-gig-description-generator":{"n":"AI Gig Description Generator","c":"Business"},
    "ai-paraphrasing-tool":{"n":"AI Paraphrasing Tool","c":"Productivity"},
    "ai-product-description-generator":{"n":"AI Product Description Generator","c":"Business"},
    "ai-text-summarizer":{"n":"AI Text Summarizer","c":"Productivity"},
    "atar-calculator":{"n":"ATAR Calculator Australia","c":"Education"},
    "australia-scholarship-finder":{"n":"Australia Scholarship Finder","c":"Education"},
    "base64-encoder-decoder":{"n":"Base64 Encoder and Decoder","c":"Productivity"},
    "bece-aggregate-calculator":{"n":"BECE Aggregate Calculator","c":"Education"},
    "bece-cssps-placement-estimator":{"n":"BECE CSSPS Placement Estimator","c":"Education"},
    "bmi-calculator":{"n":"BMI, BMR & TDEE Calculator","c":"Health"},
    "body-fat-calculator":{"n":"Body Fat Calculator","c":"Health"},
    "break-even-calculator":{"n":"Break-Even Point Calculator","c":"Finance"},
    "calorie-burn-calculator":{"n":"Calorie Burn Calculator","c":"Health"},
    "canada-gpa-calculator":{"n":"Canada GPA Calculator","c":"Education"},
    "canada-student-loan-repayment-calculator":{"n":"Canada Student Loan Repayment Calculator","c":"Education"},
    "canada-study-planner":{"n":"Canada Study Planner","c":"Education"},
    "canada-university-admission-chance-calculator":{"n":"Canada University Admission Chance Calculator","c":"Education"},
    "compound-interest":{"n":"Compound Interest Calculator","c":"Finance"},
    "currency-converter":{"n":"Currency Converter","c":"Finance"},
    "daily-calorie-needs-calculator":{"n":"Daily Calorie Needs Calculator","c":"Health"},
    "data-file-unit-converter":{"n":"Data Size & File Unit Converter","c":"Productivity"},
    "debt-payoff-calculator":{"n":"Debt Payoff Calculator","c":"Finance"},
    "document-converter":{"n":"Document Converter","c":"Productivity"},
    "exif-remover":{"n":"Metadata & EXIF Remover","c":"Productivity"},
    "form-four-gpa-calculator":{"n":"Form Four GPA Calculator","c":"Education"},
    "freelance-rate-calculator":{"n":"Freelance Hourly Rate Calculator","c":"Finance"},
    "germany-abitur-grade-calculator":{"n":"Germany Abitur Grade Calculator","c":"Education"},
    "germany-gpa-converter":{"n":"Germany GPA Converter","c":"Education"},
    "ghana-nursing-training-admission-calculator":{"n":"Ghana Nursing Training Admission Calculator","c":"Education"},
    "ghana-university-gpa-calculator":{"n":"Ghana University GPA & CWA Calculator","c":"Education"},
    "gpa-calculator":{"n":"College & University GPA Calculator","c":"Education"},
    "healthy-weight-range-calculator":{"n":"Healthy Weight Range Calculator","c":"Health"},
    "hecs-help-repayment-calculator":{"n":"HECS-HELP Repayment Calculator","c":"Education"},
    "hourly-to-salary":{"n":"Hourly to Salary Converter","c":"Finance"},
    "html-minifier":{"n":"HTML Minifier","c":"Productivity"},
    "hydration-reminder-calculator":{"n":"Hydration Reminder Calculator","c":"Health"},
    "icass-calculator":{"n":"ICASS Calculator","c":"Education"},
    "ideal-weight-calculator":{"n":"Ideal Weight Calculator","c":"Health"},
    "igcse-alevel-gpa-converter":{"n":"IGCSE & A-Level GPA Converter","c":"Education"},
    "image-resizer-webp-converter":{"n":"Image Resizer & WebP Converter","c":"Productivity"},
    "invoice-receipt-generator":{"n":"Invoice & Receipt Generator","c":"Productivity"},
    "jamb-admission-chance-checker":{"n":"JAMB Admission Chance Checker","c":"Education"},
    "jamb-score-calculator":{"n":"JAMB Score Calculator","c":"Education"},
    "jamb-utme-aggregate-calculator":{"n":"JAMB UTME Aggregate Calculator","c":"Education"},
    "job-application-tracker":{"n":"Job Application Tracker","c":"Productivity"},
    "job-scam-checker":{"n":"Job Scam Checker","c":"Productivity"},
    "json-formatter-validator":{"n":"JSON Formatter & Validator","c":"Productivity"},
    "kcpe-performance-calculator":{"n":"KCPE Performance Calculator","c":"Education"},
    "kcse-eligibility-tier-checker":{"n":"KCSE Eligibility Tier Checker","c":"Education"},
    "kcse-grade-calculator":{"n":"KCSE Grade Calculator","c":"Education"},
    "kcse-kuccps-cluster-calculator":{"n":"KCSE KUCCPS Cluster Calculator","c":"Education"},
    "kenya-university-gpa-calculator":{"n":"Kenya University GPA Calculator","c":"Education"},
    "keyword-density-checker":{"n":"Keyword Density Checker","c":"Productivity"},
    "kuccps-cluster-points-calculator":{"n":"KUCCPS Cluster Points Calculator","c":"Education"},
    "loan-calculator":{"n":"Loan Calculator","c":"Finance"},
    "markdown-to-html-converter":{"n":"Markdown to HTML Converter","c":"Productivity"},
    "matric-sba-exam-calculator":{"n":"Matric SBA + Exam Calculator","c":"Education"},
    "meta-pixel-checker":{"n":"Meta Title & Description Pixel Checker","c":"Productivity"},
    "mortgage-calculator":{"n":"Mortgage Calculator","c":"Finance"},
    "new-zealand-ncea-credits-calculator":{"n":"NCEA Credits & Rank Score Calculator","c":"Education"},
    "new-zealand-study-planner":{"n":"New Zealand Study Planner","c":"Education"},
    "nigerian-university-cgpa-calculator":{"n":"Nigerian University CGPA Calculator","c":"Education"},
    "norway-gpa-calculator":{"n":"Norway GPA Calculator","c":"Education"},
    "nsfas-eligibility-checker":{"n":"NSFAS Eligibility Checker","c":"Education"},
    "nsfas-tvet-allowance-calculator":{"n":"NSFAS TVET Allowance Calculator","c":"Education"},
    "olevel-subject-combination-checker":{"n":"WAEC & NECO Subject Combination Checker","c":"Education"},
    "online-shop-scam-checker":{"n":"Online Shop Scam Checker","c":"Productivity"},
    "ovulation-cycle-calculator":{"n":"Ovulation & Cycle Calculator","c":"Health"},
    "password-generator":{"n":"Secure Password Generator","c":"Productivity"},
    "paye-calculator":{"n":"PAYE & Net Salary Calculator","c":"Finance"},
    "paypal-fee-calculator":{"n":"PayPal Fee Calculator","c":"Finance"},
    "percentage-calculator":{"n":"Percentage Calculator","c":"Finance"},
    "ple-aggregate-calculator":{"n":"PLE Aggregate Calculator","c":"Education"},
    "post-utme-aggregate-calculator":{"n":"Post-UTME Aggregate Calculator","c":"Education"},
    "pricing-calculator":{"n":"Pricing Calculator","c":"Finance"},
    "profit-margin-calculator":{"n":"Profit Margin Calculator","c":"Finance"},
    "qr-code-generator":{"n":"QR Code Generator","c":"Productivity"},
    "reading-time-speech-estimator":{"n":"Reading Time & Speech Duration Estimator","c":"Productivity"},
    "rent-affordability":{"n":"Rent Affordability Calculator","c":"Finance"},
    "robots-txt-generator":{"n":"Robots.txt Generator","c":"Productivity"},
    "roi-calculator":{"n":"ROI Calculator","c":"Finance"},
    "savings-calculator":{"n":"Savings Calculator","c":"Finance"},
    "seo-meta-generator":{"n":"SEO Meta Tag Generator","c":"Productivity"},
    "south-africa-study-planner":{"n":"South Africa Study Planner","c":"Education"},
    "south-african-aps-calculator":{"n":"South African APS Calculator","c":"Education"},
    "south-african-tvet-nated-calculator":{"n":"TVET NATED Pass Calculator","c":"Education"},
    "south-african-university-admission-calculator":{"n":"South African University Admission Calculator","c":"Education"},
    "startup-cost-calculator":{"n":"Startup Cost Calculator","c":"Finance"},
    "student-loan-repayment-calculator":{"n":"Student Loan Repayment Calculator","c":"Finance"},
    "switzerland-grade-calculator":{"n":"Switzerland Grade Calculator","c":"Education"},
    "switzerland-university-cost-calculator":{"n":"Switzerland University Cost Calculator","c":"Education"},
    "tanzania-heslb-loan-calculator":{"n":"Tanzania HESLB Loan Calculator","c":"Education"},
    "tanzania-university-admission-calculator":{"n":"Tanzania University Admission Calculator","c":"Education"},
    "tanzania-university-gpa-calculator":{"n":"Tanzania University GPA Calculator","c":"Education"},
    "tertiary-gpa-cgpa-calculator":{"n":"Tertiary GPA & CGPA Calculator","c":"Education"},
    "text-case-converter-cleanup":{"n":"Text Case Converter & Cleanup Tool","c":"Productivity"},
    "tvet-exam-target-mark-calculator":{"n":"TVET Exam Target Mark Calculator","c":"Education"},
    "tvet-ncv-pass-calculator":{"n":"TVET NC(V) Pass Calculator","c":"Education"},
    "uace-points-calculator":{"n":"UACE Points Calculator","c":"Education"},
    "ucas-points-calculator":{"n":"UCAS Points Calculator","c":"Education"},
    "uce-grade-calculator":{"n":"UCE Grade Calculator","c":"Education"},
    "uganda-university-admission-calculator":{"n":"Uganda University Admission Calculator","c":"Education"},
    "uganda-university-cgpa-calculator":{"n":"Uganda University CGPA Calculator","c":"Education"},
    "uk-a-level-grade-calculator":{"n":"A-Level Grade Calculator","c":"Education"},
    "uk-degree-classification-calculator":{"n":"UK Degree Classification Calculator","c":"Education"},
    "uk-gcse-grade-calculator":{"n":"UK GCSE Grade Calculator","c":"Education"},
    "uk-student-loan-finance-calculator":{"n":"UK Student Loan Calculator","c":"Education"},
    "uneb-results-estimator":{"n":"UNEB Results Estimator","c":"Education"},
    "unit-converter":{"n":"Unit Converter","c":"Productivity"},
    "university-course-finder":{"n":"Australian University Course Finder","c":"Education"},
    "university-cutoff-eligibility-checker":{"n":"University Cut-Off & Eligibility Checker","c":"Education"},
    "waec-grade-calculator":{"n":"WAEC Grade Calculator","c":"Education"},
    "wassce-aggregate-calculator":{"n":"WASSCE Aggregate Calculator","c":"Education"},
    "water-intake-calculator":{"n":"Daily Water Intake Calculator","c":"Health"},
    "whatsapp-direct-link-qr-generator":{"n":"WhatsApp Direct Link & QR Code Generator","c":"Productivity"},
    "xml-sitemap-builder":{"n":"XML Sitemap Generator","c":"Productivity"},
    "zambia-grade-12-points-calculator":{"n":"ECZ Grade 12 Points Calculator","c":"Education"},
    "zambia-university-admission-calculator":{"n":"Zambia University Admission Calculator","c":"Education"},
    "zambia-university-gpa-calculator":{"n":"Zambia University GPA Calculator","c":"Education"},
    "zimbabwe-study-timetable-generator":{"n":"Zimbabwe Study Timetable Generator","c":"Education"},
    "zimbabwe-university-entry-points-calculator":{"n":"Zimbabwe University Entry Points Calculator","c":"Education"},
    "zimbabwe-university-gpa-calculator":{"n":"Zimbabwe University GPA Calculator","c":"Education"},
    "zimsec-alevel-points-calculator":{"n":"ZIMSEC A-Level Points Calculator","c":"Education"},
    "zimsec-olevel-points-calculator":{"n":"ZIMSEC O-Level Points Calculator","c":"Education"}
  };

  let gaToolOpenFired = false;
  let gaIsRestoringSharedCalc = false;
  let gaModalShareTrackedForOpen = false;
  let gaLastShareEventTs = 0;
  let gaAiInFlightCount = 0;
  let gaActiveAttempt = null;
  let gaAttemptSeq = 0;
  let gaLastClickTriggerTs = 0;
  let gaLastClickTriggerBtn = null;
  let gaLastClickTriggerForm = null;
  let gaLastNonCalcClickTs = 0;
  let gaResultObserver = null;
  let gaCalcListenersBound = false;

  function isGaToolPage() {
    if (!page || GA_NON_TOOL_PAGES.has(page)) return false;
    return Boolean(GA_TOOL_META[page] || document.querySelector('.calc-panel, .calc-wrap'));
  }

  function getGaToolMeta() {
    const entry = GA_TOOL_META[page];
    let toolName = entry ? entry.n : '';
    let toolCategory = entry ? entry.c : '';

    if (!toolName) {
      const h1 = document.querySelector('h1');
      if (h1) {
        const clone = h1.cloneNode(true);
        clone.querySelectorAll('.seo-title-accent, svg, button').forEach(el => el.remove());
        toolName = (clone.textContent || '').replace(/\s+/g, ' ').trim();
      }
      if (!toolName) {
        toolName = (document.title || page).split(/\s*[–—|-]\s*/)[0].trim() || page;
      }
    }

    if (!toolCategory) {
      const bcLinks = document.querySelectorAll('.breadcrumbs a, .breadcrumb a');
      for (let i = 0; i < bcLinks.length; i++) {
        const href = (bcLinks[i].getAttribute('href') || '').toLowerCase();
        const m = href.match(/\/?(education|finance|health|productivity|business)(?:\.html)?$/);
        if (m) {
          toolCategory = m[1].charAt(0).toUpperCase() + m[1].slice(1);
          break;
        }
      }
      if (!toolCategory) {
        const catEl = document.querySelector('.calc-panel-cat');
        toolCategory = catEl ? catEl.textContent.trim() : 'General';
      }
    }

    return {
      tool_name: String(toolName).slice(0, 100),
      tool_category: String(toolCategory).slice(0, 60),
      tool_slug: String(page).slice(0, 100)
    };
  }

  function trackGaEvent(eventName, extraParams) {
    if (!isGaToolPage()) return;
    try {
      if (typeof window.gtag !== 'function') {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
      }
      const meta = getGaToolMeta();
      const payload = Object.assign({
        tool_name: meta.tool_name,
        tool_category: meta.tool_category,
        tool_slug: meta.tool_slug,
        page_location: window.location.origin + window.location.pathname,
        send_to: GA_MEASUREMENT_ID
      }, extraParams || {});
      window.gtag('event', eventName, payload);
    } catch {
      // Never allow analytics to affect tool functionality
    }
  }

  function trackGaToolOpen() {
    if (gaToolOpenFired || !isGaToolPage()) return;
    gaToolOpenFired = true;
    trackGaEvent('tool_open');
  }

  function trackGaShareClick(method) {
    const now = Date.now();
    if (now - gaLastShareEventTs < 250) return;
    gaLastShareEventTs = now;
    trackGaEvent('share_click', method ? { share_method: String(method).slice(0, 40) } : undefined);
  }

  function safeOverrideWindowMethod(prop, wrapperFn) {
    try {
      const desc = Object.getOwnPropertyDescriptor(window, prop);
      if (!desc || desc.configurable) {
        Object.defineProperty(window, prop, {
          value: wrapperFn,
          configurable: true,
          writable: true,
          enumerable: true
        });
        return window[prop] === wrapperFn;
      }
      if (desc.writable) {
        window[prop] = wrapperFn;
        return window[prop] === wrapperFn;
      }
    } catch {
      // Property is read-only / non-configurable on this host Window
    }
    return false;
  }

  function installGaAlertObserver() {
    if (typeof window.alert !== 'function' || window.alert.__afriGaAlertWrapped) return;
    const origAlert = window.alert;
    const wrappedAlert = function () {
      if (gaActiveAttempt && !gaActiveAttempt.completed) {
        gaActiveAttempt.aborted = true;
        gaActiveAttempt = null;
      }
      return origAlert.apply(this, arguments);
    };
    wrappedAlert.__afriGaAlertWrapped = true;
    safeOverrideWindowMethod('alert', wrappedAlert);
  }

  let gaFetchWrappedActive = false;

  function installGaAiDomFallbackObserver() {
    if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return;
    let pendingAiClick = false;
    let pendingTimer = null;

    const settle = (ok, errType) => {
      if (!pendingAiClick) return;
      pendingAiClick = false;
      clearTimeout(pendingTimer);
      gaAiInFlightCount = Math.max(0, gaAiInFlightCount - 1);
      if (ok) {
        trackGaEvent('ai_response_success');
      } else {
        trackGaEvent('ai_response_error', { error_type: errType || 'request_failed' });
      }
    };

    document.addEventListener('click', (e) => {
      if (!isGaToolPage()) return;
      const trigger = e.target.closest('#aiBtn, #paraBtn, #prodBtn, #sumBtn');
      if (!trigger) return;
      if (trigger.id !== 'aiBtn' && !/\/ai-/.test(window.location.pathname)) return;
      if (pendingAiClick) return;
      pendingAiClick = true;
      gaAiInFlightCount++;
      trackGaEvent('ai_request');
      clearTimeout(pendingTimer);
      pendingTimer = setTimeout(() => settle(false, 'timeout'), 25000);
    }, true);

    onReady(() => {
      const target = document.getElementById('aiOutput') || document.getElementById('outputBody') || document.getElementById('aiOutputBody');
      if (!target) return;
      const obs = new MutationObserver(() => {
        if (!pendingAiClick) return;
        const txt = (target.textContent || '').trim();
        if (!txt) return;
        if (target.classList.contains('error') || /could not reach the ai|unavailable|try again/i.test(txt)) {
          settle(false, 'dom_error');
        } else if (target.classList.contains('visible') || txt.length > 15) {
          settle(true);
        }
      });
      obs.observe(target, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class'] });
    });
  }

  function installGaFetchObserver() {
    if (typeof window.fetch !== 'function' || window.fetch.__afriGaFetchWrapped) return;
    const origFetch = window.fetch;
    const wrappedFetch = function (input) {
      let urlStr = '';
      try {
        if (typeof input === 'string') urlStr = input;
        else if (input && typeof input.url === 'string') urlStr = input.url;
      } catch {}

      if (!/\/api\/ai-insight(?:$|[?#])/i.test(urlStr)) {
        return origFetch.apply(window, arguments);
      }

      if (isGaToolPage()) {
        gaAiInFlightCount++;
        trackGaEvent('ai_request');
      }

      let settled = false;
      const finishSuccess = () => {
        if (settled) return;
        settled = true;
        gaAiInFlightCount = Math.max(0, gaAiInFlightCount - 1);
        trackGaEvent('ai_response_success');
      };
      const finishError = (errType) => {
        if (settled) return;
        settled = true;
        gaAiInFlightCount = Math.max(0, gaAiInFlightCount - 1);
        trackGaEvent('ai_response_error', { error_type: String(errType || 'request_failed').slice(0, 40) });
      };

      try {
        const promise = origFetch.apply(window, arguments);
        if (!promise || typeof promise.then !== 'function') {
          return promise;
        }
        promise.then((res) => {
          if (!res || !res.ok) {
            finishError(res ? ('http_' + res.status) : 'invalid_response');
            return;
          }
          try {
            res.clone().json().then((data) => {
              const text = data && (data.insight || data.text || data.message || data.result);
              if (typeof text === 'string' && text.trim().length > 0) {
                finishSuccess();
              } else {
                finishError('empty_response');
              }
            }).catch(() => {
              finishError('invalid_json');
            });
          } catch {
            finishSuccess();
          }
        }, (err) => {
          const name = (err && err.name === 'AbortError') ? 'aborted' : 'network_error';
          finishError(name);
        });
        return promise;
      } catch (syncErr) {
        finishError('fetch_throw');
        throw syncErr;
      }
    };
    wrappedFetch.__afriGaFetchWrapped = true;
    gaFetchWrappedActive = safeOverrideWindowMethod('fetch', wrappedFetch);
    if (!gaFetchWrappedActive) {
      installGaAiDomFallbackObserver();
    }
  }

  installGaAlertObserver();
  installGaFetchObserver();

  // Inject Self-Contained AfriWidget CSS (Brand styling, zero Tailwind, zero external dependencies)
  function injectShareStyles() {
    if (document.getElementById('afriwidget-share-styles')) return;
    const style = document.createElement('style');
    style.id = 'afriwidget-share-styles';
    style.textContent = `
      .afri-share-bar {
        display: block;
        margin-top: 1.125rem;
        margin-bottom: 1.125rem;
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 0.75rem;
        padding: 1.125rem 1.25rem;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        color: #111827;
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
        gap: 0.875rem;
      }
      @media (min-width: 640px) {
        .afri-share-bar {
          padding: 1.25rem 1.5rem;
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
      .afri-share-title {
        font-size: 1rem;
        font-weight: 700;
        color: #111827;
        letter-spacing: -0.01em;
        line-height: 1.35;
        margin: 0 0 0.25rem 0;
      }
      @media (min-width: 640px) {
        .afri-share-title {
          font-size: 1.0625rem;
        }
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
        gap: 0.5rem;
        align-items: center;
        flex-shrink: 0;
      }
      .afri-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.45rem;
        padding: 0 1rem;
        height: 2.5rem;
        min-height: 40px;
        font-size: 0.8125rem;
        font-weight: 700;
        border-radius: 0.5rem;
        cursor: pointer;
        line-height: 1;
        white-space: nowrap;
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
        width: 0.9375rem;
        height: 0.9375rem;
        flex-shrink: 0;
      }
      .afri-btn-primary {
        background: #facc15;
        color: #111827;
        border-color: #eab308;
      }
      .afri-btn-primary:hover {
        background: #fde047;
        border-color: #eab308;
      }
      .afri-btn-secondary {
        background: #ffffff;
        color: #111827;
        border-color: #d1d5db;
      }
      .afri-btn-secondary:hover {
        background: #f9fafb;
        color: #000000;
        border-color: #9ca3af;
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

      /* Professional Mobile Typography & Writing Standards Across AfriWidget */
      @media (max-width: 640px) {
        .seo-title {
          font-size: clamp(1.5rem, 5.5vw, 1.875rem) !important;
          line-height: 1.2 !important;
          text-wrap: balance !important;
          word-break: normal !important;
          overflow-wrap: break-word !important;
        }
        .seo-title-accent {
          font-size: clamp(1.0625rem, 4vw, 1.35rem) !important;
          line-height: 1.25 !important;
          text-wrap: balance !important;
        }
        .seo-subtitle {
          font-size: 0.9375rem !important;
          line-height: 1.6 !important;
          text-wrap: pretty !important;
          word-break: normal !important;
          overflow-wrap: break-word !important;
        }
        .policy-article h2 {
          font-size: 1.35rem !important;
          line-height: 1.3 !important;
          text-wrap: balance !important;
          word-break: normal !important;
          overflow-wrap: break-word !important;
          margin-top: 2rem !important;
        }
        .policy-article h3 {
          font-size: 1.125rem !important;
          line-height: 1.35 !important;
          text-wrap: balance !important;
          word-break: normal !important;
          overflow-wrap: break-word !important;
        }
        .policy-article p {
          font-size: 0.9375rem !important;
          line-height: 1.7 !important;
          word-break: normal !important;
          overflow-wrap: break-word !important;
        }
        .policy-article ul li, .policy-article ol li {
          font-size: 0.9375rem !important;
          line-height: 1.65 !important;
          word-break: normal !important;
          overflow-wrap: break-word !important;
        }
        .toc {
          padding: 1rem 1.125rem !important;
        }
        .toc ol li {
          font-size: 0.8125rem !important;
          line-height: 1.5 !important;
        }
        .interpret-box {
          padding: 0.875rem 1rem !important;
        }
        .interpret-text {
          font-size: 0.9375rem !important;
          line-height: 1.65 !important;
        }
        .ai-desc {
          font-size: 0.875rem !important;
          line-height: 1.6 !important;
        }
        .stat-card .stat-value {
          font-size: 1.35rem !important;
        }
        /* Global mobile typography fixes */
        h1, h2, h3, h4, h5, h6, p, span, a, label, li, td, th {
          overflow-wrap: break-word !important;
          word-break: normal !important;
          -webkit-hyphens: manual;
          hyphens: manual;
        }
        code, pre, .break-all, a[href^="http"] {
          overflow-wrap: anywhere !important;
          word-break: break-word !important;
        }
        .afri-share-bar, .afri-donation-card {
          padding: 1.125rem 1.25rem !important;
          margin-top: 1.125rem !important;
          margin-bottom: 1.125rem !important;
        }
        .afri-share-title, .afri-donation-title {
          font-size: 1rem !important;
          line-height: 1.35 !important;
          word-break: normal !important;
        }
        .afri-share-desc, .afri-donation-desc {
          font-size: 0.8125rem !important;
          line-height: 1.5 !important;
          word-break: normal !important;
        }
        .calc-panel-title {
          font-size: 1.25rem !important;
          line-height: 1.3 !important;
          letter-spacing: -0.015em !important;
          word-break: normal !important;
        }
        .calc-panel-sub {
          font-size: 0.875rem !important;
          line-height: 1.55 !important;
          word-break: normal !important;
        }
        .field-label {
          font-size: 0.8125rem !important;
          font-weight: 700 !important;
          word-break: normal !important;
        }
        .results-title, .aggregate-big {
          font-size: clamp(1.4rem, 5vw, 1.85rem) !important;
          line-height: 1.2 !important;
          word-break: normal !important;
        }
      }
      @media print {
        .afri-share-bar, #afriShareBar, .afri-donation-card, #afriDonationCard, .afri-modal-overlay, .afri-toast {
          display: none !important;
          visibility: hidden !important;
          height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
        }
      }
    
      /* AfriWidget Donation Card (PayPal NCP) */
      .afri-donation-card {
        display: block;
        margin-top: 1.125rem;
        margin-bottom: 1.125rem;
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 0.75rem;
        padding: 1.125rem 1.25rem;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        color: #111827;
        box-sizing: border-box;
      }
      .afri-donation-card *, .afri-donation-card *::before, .afri-donation-card *::after {
        box-sizing: border-box;
      }
      .afri-donation-inner {
        display: flex;
        flex-direction: column;
        gap: 0.875rem;
      }
      @media (min-width: 640px) {
        .afri-donation-card {
          padding: 1.25rem 1.5rem;
        }
        .afri-donation-inner {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }
      }
      .afri-donation-info {
        flex: 1;
        min-width: 0;
        text-align: left;
      }
      .afri-donation-title {
        font-size: 1rem;
        font-weight: 700;
        color: #111827;
        letter-spacing: -0.01em;
        line-height: 1.35;
        margin: 0 0 0.25rem 0;
      }
      @media (min-width: 640px) {
        .afri-donation-title {
          font-size: 1.0625rem;
        }
      }
      .afri-donation-desc {
        font-size: 0.8125rem;
        color: #4b5563;
        line-height: 1.5;
        margin: 0;
      }
      .afri-donation-action {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-shrink: 0;
      }
      @media (min-width: 640px) {
        .afri-donation-action {
          justify-content: flex-end;
        }
      }
      .afri-paypal-form {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.45rem;
        margin: 0;
        padding: 0;
      }
      @media (min-width: 640px) {
        .afri-paypal-form {
          align-items: flex-end;
        }
      }
      .pp-VXH3B6743NDVE {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        border: 1px solid #eab308;
        border-radius: 0.5rem;
        min-width: 0;
        width: auto;
        padding: 0 1.125rem;
        height: 2.5rem;
        min-height: 40px;
        font-weight: 700;
        background-color: #facc15;
        color: #111827;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 0.8125rem;
        line-height: 1;
        cursor: pointer;
        white-space: nowrap;
        transition: background-color 0.15s ease, transform 0.1s ease, border-color 0.15s ease;
      }
      .pp-VXH3B6743NDVE:hover {
        background-color: #fde047;
        border-color: #eab308;
      }
      .pp-VXH3B6743NDVE:active {
        transform: scale(0.98);
      }
      .afri-paypal-meta {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      .afri-card-icons {
        height: 1.0625rem;
        max-width: 100%;
        display: block;
      }
      .afri-paypal-powered {
        font-size: 0.6875rem;
        color: #6b7280;
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        line-height: 1;
      }
      .afri-paypal-logo {
        height: 0.75rem;
        vertical-align: middle;
        display: inline-block;
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

  // Excluded chrome, result, ad, donation, and friend-comparison containers
  const EXCLUDED_SELECTOR = [
    '.afri-paypal-form',
    '#afriDonationCard',
    '#afriShareBar',
    '#afriwidgetShareModal',
    '#compareEntryCard',
    '#compareWorkspaceSection',
    '.compare-card',
    '#weaknessCalloutBanner',
    '#afriAcademicProgress',
    '#afriHealthProgress',
    '.ai-section',
    '#results',
    '#cfResults',
    '#resultsCard',
    '.results'
  ].join(', ');

  const TAB_BTN_SELECTOR = [
    '[role="tab"]',
    '.mode-tab',
    '.source-tab',
    '.btn-mode',
    '.mode-btn',
    '.tab-btn',
    '#unitMetric',
    '#unitImperial',
    '#typeInvoice',
    '#typeReceipt'
  ].join(', ');

  // Verified dynamic row list configurations across all multi-row calculators & planners
  const DYNAMIC_CONTAINERS = {
    'atar-calculator': [
      { prefix: 'r', container: '#subjectList', row: '.course-row', addBtn: '#addSubjectBtn', removeBtn: '.btn-remove' }
    ],
    'canada-gpa-calculator': [
      { prefix: 'r', container: '#courseList', row: '.course-row', addBtn: '#addCourseBtn', removeBtn: '.btn-remove' }
    ],
    'canada-student-loan-repayment-calculator': [
      { prefix: 'r', container: '#courseList', row: '.course-row', addBtn: '#addCourseBtn', removeBtn: '.btn-remove' }
    ],
    'canada-study-planner': [
      { prefix: 'r', container: '#courseList', row: '.course-row', addBtn: '#addCourseBtn', removeBtn: '.btn-remove' }
    ],
    'debt-payoff-calculator': [
      { prefix: 'r', container: '#debtList', row: '.debt-row', addBtn: '#addDebtBtn', removeBtn: '.btn-remove' }
    ],
    'ghana-university-gpa-calculator': [
      { prefix: 'r', container: '#courseList', row: '.course-row', addBtn: '#addCourseBtn', removeBtn: '.btn-remove' }
    ],
    'gpa-calculator': [
      { prefix: 'gpa', container: '#courseList', row: '.course-row', addBtn: '#addRowBtn', removeBtn: '.btn-remove' }
    ],
    'igcse-alevel-gpa-converter': [
      { prefix: 'r', container: '#subjectRows', row: '.subject-row', addBtn: '#addRowBtn', removeBtn: '.btn-remove' }
    ],
    'invoice-receipt-generator': [
      { prefix: 'r', container: '#itemsList', row: '.item-row', addBtn: '#addItemBtn', removeBtn: '.item-remove, .btn-remove' }
    ],
    'kenya-university-gpa-calculator': [
      { prefix: 'r', container: '#coursesContainer', row: '.course-row', addBtn: '#addCourseBtn', removeBtn: '.btn-remove' }
    ],
    'new-zealand-ncea-credits-calculator': [
      { prefix: 'r', container: '#nceaRowsContainer', row: '.ncea-row', addBtn: '#addRowBtn', removeBtn: '.btn-remove' }
    ],
    'nigerian-university-cgpa-calculator': [
      { prefix: 'r', container: '#coursesContainer', row: '.course-row', addBtn: '#addCourseBtn', removeBtn: '.btn-remove' },
      { prefix: 'r2', container: '#semesterContainer', row: '.semester-row', addBtn: '#addSemesterBtn', removeBtn: '.btn-remove' }
    ],
    'norway-gpa-calculator': [
      { prefix: 'r', container: '#coursesContainer', row: '.course-row', addBtn: '#addCourseBtn', removeBtn: '.btn-remove' }
    ],
    'startup-cost-calculator': [
      { prefix: 'r', container: '#oneTimeList', row: '.cost-row', addBtn: '#addOneTimeBtn', removeBtn: '.cost-row-remove, .btn-remove' },
      { prefix: 'r2', container: '#monthlyList', row: '.cost-row', addBtn: '#addMonthlyBtn', removeBtn: '.cost-row-remove, .btn-remove' }
    ],
    'switzerland-grade-calculator': [
      { prefix: 'r', container: '#courseList', row: '.course-row', addBtn: '#addCourseBtn', removeBtn: '.btn-remove' }
    ],
    'tanzania-university-gpa-calculator': [
      { prefix: 'r', container: '#coursesContainer', row: '.course-row', addBtn: '#addCourseBtn', removeBtn: '.btn-remove' },
      { prefix: 'r2', container: '#coursesContainer2', row: '.course-row', addBtn: '#addCourseBtn2', removeBtn: '.btn-remove' }
    ],
    'tertiary-gpa-cgpa-calculator': [
      { prefix: 'r', container: '#courseList', row: '.course-row', addBtn: '#addCourseBtn', removeBtn: '.btn-remove' }
    ],
    'ucas-points-calculator': [
      { prefix: 'r', container: '#qualList', row: '.qual-row', addBtn: '#addALevel', removeBtn: '.qual-remove, .btn-remove' }
    ],
    'uganda-university-cgpa-calculator': [
      { prefix: 'r', container: '#coursesContainer', row: '.course-row', addBtn: '#addCourseBtn', removeBtn: '.btn-remove' },
      { prefix: 'r2', container: '#coursesContainer2', row: '.course-row', addBtn: '#addCourseBtn2', removeBtn: '.btn-remove' }
    ],
    'uk-a-level-grade-calculator': [
      { prefix: 'r', container: '#componentList', row: '.comp-row', addBtn: '#addComponentBtn', removeBtn: '.btn-remove' },
      { prefix: 'r2', container: '#subjectProfileList', row: '.prof-row', addBtn: '#addProfileSubjectBtn', removeBtn: '.btn-remove' }
    ],
    'uk-degree-classification-calculator': [
      { prefix: 'r', container: '#y2ModulesContainer', row: '.mod-row', addBtn: '#addY2ModuleBtn', removeBtn: '.mod-remove, .btn-remove' },
      { prefix: 'r2', container: '#y3ModulesContainer', row: '.mod-row', addBtn: '#addY3ModuleBtn', removeBtn: '.mod-remove, .btn-remove' }
    ],
    'uk-gcse-grade-calculator': [
      { prefix: 'r', container: '#subjectRowsContainer', row: '.gcse-row', addBtn: '#addSubjectRowBtn', removeBtn: '.btn-remove' },
      { prefix: 'r2', container: '#compRowsContainer', row: '.comp-row', addBtn: '#addCompRowBtn', removeBtn: '.btn-remove' }
    ],
    'zambia-university-gpa-calculator': [
      { prefix: 'r', container: '#courseList', row: '.course-row', addBtn: '#addCourseBtn', removeBtn: '.btn-remove' }
    ],
    'zimbabwe-university-gpa-calculator': [
      { prefix: 'r', container: '#coursesContainer', row: '.course-row', addBtn: '#addCourseBtn', removeBtn: '.btn-remove' }
    ]
  };

  // Track last clicked action button on multi-action tools (e.g. Encode vs Decode, Format vs Minify)
  let lastActionBtnId = '';
  let lastCaseAction = '';
  let lastCleanAction = '';

  function setupActionTrackers() {
    document.addEventListener('click', (e) => {
      const actionBtn = e.target.closest('#encodeBtn, #decodeBtn, #formatBtn, #minifyBtn');
      if (actionBtn && actionBtn.id) {
        lastActionBtnId = actionBtn.id;
      }
      const caseBtn = e.target.closest('.btn-case[data-action]');
      if (caseBtn) {
        lastCaseAction = caseBtn.dataset.action || '';
      }
      const cleanBtn = e.target.closest('.btn-clean[data-clean]');
      if (cleanBtn) {
        lastCleanAction = cleanBtn.dataset.clean || '';
      }
    });
  }

  function getCalcRoot() {
    return $('.calc-wrap') || $('.calc-panel') || $('main') || document.body;
  }

  function isElementVisible(el) {
    let cur = el;
    while (cur && cur !== document.body && cur !== document.documentElement) {
      if (cur.hidden || cur.classList?.contains('hidden') || cur.classList?.contains('field-hidden')) {
        return false;
      }
      if (cur.getAttribute?.('aria-hidden') === 'true') {
        return false;
      }
      const inlineStyle = cur.getAttribute?.('style') || '';
      if (/display\s*:\s*none/i.test(inlineStyle)) {
        return false;
      }
      try {
        if (window.getComputedStyle(cur).display === 'none') {
          return false;
        }
      } catch {
        // Ignore computed style errors on detached elements
      }
      cur = cur.parentElement;
    }
    return true;
  }

  function isEditableField(el) {
    if (!el || el.disabled || el.readOnly) return false;
    const tag = el.tagName.toLowerCase();
    if (tag !== 'input' && tag !== 'select' && tag !== 'textarea') return false;
    if (tag === 'input') {
      const type = (el.getAttribute('type') || 'text').toLowerCase();
      if (['hidden', 'submit', 'button', 'reset', 'file', 'image'].includes(type)) {
        return false;
      }
    }
    return true;
  }

  function isInsideDynamicContainer(el) {
    if (page === 'form-four-gpa-calculator' && el.closest('#subjectList')) {
      return true;
    }
    const cfgs = DYNAMIC_CONTAINERS[page] || [];
    for (let i = 0; i < cfgs.length; i++) {
      if (el.closest(cfgs[i].container)) return true;
    }
    return false;
  }

  function getTabButtons() {
    const root = getCalcRoot();
    return $$(TAB_BTN_SELECTOR, root).filter(btn => !btn.closest(EXCLUDED_SELECTOR));
  }

  function getTabId(btn, idx) {
    return btn.id || btn.dataset.mode || btn.dataset.tab || btn.dataset.type || `t${idx}`;
  }

  // Deterministic static field list in DOM order (outside dynamic row containers and excluded chrome)
  function getStaticFieldDescriptors() {
    const root = getCalcRoot();
    const rawFields = $$('input, select, textarea', root).filter(el => {
      if (!isEditableField(el)) return false;
      if (el.closest(EXCLUDED_SELECTOR)) return false;
      if (isInsideDynamicContainer(el)) return false;
      if (page === 'form-four-gpa-calculator' && el.id === 'extraSubjectSelect') return false;
      if (page === 'job-application-tracker' && (el.id === 'searchInput' || el.id === 'statusFilter')) return false;
      return true;
    });

    const idCounts = {};
    const nameCounts = {};
    rawFields.forEach(el => {
      if (el.id) idCounts[el.id] = (idCounts[el.id] || 0) + 1;
      if (el.name && el.type !== 'radio') nameCounts[el.name] = (nameCounts[el.name] || 0) + 1;
    });

    let unkeyedCounter = 0;
    return rawFields.map(el => {
      let key = '';
      if (el.type === 'radio' && el.name) {
        key = el.name;
      } else if (el.id && idCounts[el.id] === 1) {
        key = el.id;
      } else if (el.name && nameCounts[el.name] === 1) {
        key = el.name;
      } else {
        key = `_u${unkeyedCounter++}`;
      }
      return { el, key };
    });
  }

  function dispatchFieldEvents(el) {
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function setFieldValue(el, rawValue) {
    if (!el) return;
    if (el.type === 'checkbox') {
      const next = rawValue === '1' || rawValue === 'true';
      if (el.checked !== next) {
        el.checked = next;
        dispatchFieldEvents(el);
      }
    } else if (el.type === 'radio') {
      if (el.value === rawValue && !el.checked) {
        el.checked = true;
        dispatchFieldEvents(el);
      }
    } else {
      const strVal = String(rawValue);
      if (el.value !== strVal) {
        el.value = strVal;
        dispatchFieldEvents(el);
      }
    }
  }

  function encodeUtf8Base64Url(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function decodeUtf8Base64Url(b64) {
    const padded = b64.replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(padded);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  function getValues() {
    const values = [];

    // 1. Active tab / mode buttons
    const tabBtns = getTabButtons();
    if (tabBtns.length > 0) {
      const activeTabs = tabBtns
        .map((btn, idx) => ({ btn, id: getTabId(btn, idx) }))
        .filter(({ btn }) => btn.classList.contains('active') || btn.getAttribute('aria-selected') === 'true')
        .map(({ id }) => id);
      if (activeTabs.length > 0) {
        values.push({ key: '_tab', value: activeTabs.join(',') });
      }
    }

    // 2. Multi-action button state (Encode/Decode, Format/Minify, Text Case/Cleanup)
    if (lastActionBtnId) {
      values.push({ key: '_act', value: lastActionBtnId });
    }
    if (page === 'text-case-converter-cleanup') {
      const activeCase = $('.btn-case.active')?.dataset?.action || lastCaseAction;
      const activeClean = $('.btn-clean.active')?.dataset?.clean || lastCleanAction;
      if (activeCase) values.push({ key: '_case', value: activeCase });
      if (activeClean) values.push({ key: '_clean', value: activeClean });
    }

    // 3. Static fields (only emit visible fields when page has tabs/modes so hidden tabs don't pollute URL)
    const hasTabs = tabBtns.length > 0;
    const descriptors = getStaticFieldDescriptors();
    const emittedRadioGroups = new Set();

    descriptors.forEach(({ el, key }) => {
      if (hasTabs && !isElementVisible(el)) return;
      if (page === 'job-application-tracker' && !$('#trackerForm')?.classList.contains('open')) return;

      if (el.type === 'radio') {
        if (!el.checked || emittedRadioGroups.has(key)) return;
        emittedRadioGroups.add(key);
        values.push({ key, value: el.value });
      } else if (el.type === 'checkbox') {
        values.push({ key, value: el.checked ? '1' : '0' });
      } else if (el.value !== undefined && String(el.value).trim() !== '') {
        values.push({ key, value: el.value });
      }
    });

    // 4. Dynamic row containers
    const dynConfigs = DYNAMIC_CONTAINERS[page] || [];
    dynConfigs.forEach(cfg => {
      const containerEl = $(cfg.container);
      if (!containerEl) return;
      if (hasTabs && !isElementVisible(containerEl)) return;

      const rows = $$(cfg.row, containerEl);
      if (!rows.length) return;

      if (cfg.prefix === 'gpa') {
        // Preserve course1Name / course1Grade / course1Credits for academic-compare.js compatibility
        let hasAnyRowVal = false;
        const gpaVals = [];
        rows.forEach((row, rIdx) => {
          const rowFields = $$('input, select, textarea', row).filter(isEditableField);
          const nameVal = rowFields[0]?.value || '';
          const gradeVal = rowFields[1]?.value || '';
          const credVal = rowFields[2]?.value || '';
          if (nameVal || gradeVal || credVal) hasAnyRowVal = true;
          if (nameVal !== '') gpaVals.push({ key: `course${rIdx + 1}Name`, value: nameVal });
          if (gradeVal !== '') gpaVals.push({ key: `course${rIdx + 1}Grade`, value: gradeVal });
          if (credVal !== '') gpaVals.push({ key: `course${rIdx + 1}Credits`, value: credVal });
        });
        if (hasAnyRowVal) {
          values.push({ key: '_rc_gpa', value: String(rows.length) });
          values.push(...gpaVals);
        }
        return;
      }

      const rowEntries = [];
      let hasNonEmpty = false;
      rows.forEach((row, rIdx) => {
        const rowFields = $$('input, select, textarea', row).filter(isEditableField);
        rowFields.forEach((f, cIdx) => {
          const k = `${cfg.prefix}${rIdx}_${cIdx}`;
          if (f.type === 'checkbox') {
            if (f.checked) hasNonEmpty = true;
            rowEntries.push({ key: k, value: f.checked ? '1' : '0' });
          } else if (f.value !== undefined && f.value !== '') {
            hasNonEmpty = true;
            rowEntries.push({ key: k, value: f.value });
          }
        });
      });

      if (hasNonEmpty) {
        values.push({ key: `_rc_${cfg.prefix}`, value: String(rows.length) });
        values.push(...rowEntries);
      }
    });

    // 5. Special tool: Form Four GPA Calculator (subject rows use data-subject + removable extra electives)
    if (page === 'form-four-gpa-calculator') {
      const rows = $$('#subjectList .subject-row');
      const extras = [];
      const gradePairs = [];
      rows.forEach((row, idx) => {
        const subj = row.dataset.subject || '';
        const isRemovable = !!row.querySelector('.btn-remove');
        if (isRemovable && subj) extras.push(subj);
        const g = row.querySelector('.subject-grade')?.value || '';
        if (g) gradePairs.push({ key: `ff_${idx}`, value: g });
      });
      if (extras.length > 0) {
        values.push({ key: '_ffExtra', value: extras.join('|') });
      }
      values.push(...gradePairs);
    }

    // 6. Special tool: Online Shop Scam Checker (.scam-check checkboxes live inside #results)
    if (page === 'online-shop-scam-checker') {
      const checkedIndices = [];
      $$('.scam-check').forEach((cb, idx) => {
        if (cb.checked) checkedIndices.push(idx);
      });
      if (checkedIndices.length > 0) {
        values.push({ key: '_checks', value: checkedIndices.join(',') });
      }
    }

    // 7. Special tool: Job Application Tracker (serialize saved localStorage jobs if present)
    if (page === 'job-application-tracker') {
      try {
        const raw = localStorage.getItem('afriwidgetJobsV1');
        const jobs = raw ? JSON.parse(raw) : [];
        if (Array.isArray(jobs) && jobs.length > 0) {
          const compact = jobs.slice(0, 20).map(j => ({
            id: j.id,
            company: j.company,
            title: j.title,
            location: j.location || '',
            salary: j.salary || '',
            url: j.url || '',
            appliedDate: j.appliedDate || '',
            status: j.status || 'applied',
            interviewDate: j.interviewDate || '',
            followUpDate: j.followUpDate || '',
            notes: (j.notes || '').slice(0, 160)
          }));
          values.push({ key: '_jobs', value: encodeUtf8Base64Url(JSON.stringify(compact)) });
        }
      } catch {
        // Ignore storage read issues
      }
    }

    return values;
  }

  function getShareUrl() {
    const url = new URL(location.href.split('?')[0]);
    url.search = '';
    const vals = getValues();
    vals.forEach(({ key, value }) => {
      url.searchParams.set(key, value);
    });
    if (vals.length > 0) {
      url.searchParams.set('shared', '1');
    }
    return url.toString();
  }

  function getVisibleResultSummary() {
    const host = $('#results') || $('#cfResults') || $('#resultsCard') || $('.results');
    if (!host || !isElementVisible(host)) return '';
    const big = host.querySelector('[class*="-big"], .results-title, #resultHeadline, .bmi-number');
    if (!big) return '';
    const text = (big.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text || text === '—' || text === '-' || text === '0') return '';
    return text.slice(0, 80);
  }

  window.showAfriToast = showToast;
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

    const title = document.title.replace(/\s*[|—–-]\s*AfriWidget.*$/i, '').trim();
    const summary = getVisibleResultSummary();
    const rawShareMsg = summary
      ? `My ${title} result on AfriWidget: ${summary} — `
      : `Check out this calculation on AfriWidget (${title}): `;
    const encodedUrl = encodeURIComponent(url);
    const shareText = encodeURIComponent(rawShareMsg);

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
            <input id="afriShareLinkInput" type="text" readonly class="afri-copy-input" spellcheck="false" />
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
    if (input) {
      input.value = url;
      input.addEventListener('click', () => input.select());
    }

    const copyBtn = overlay.querySelector('#afriModalCopyBtn');
    copyBtn?.addEventListener('click', () => {
      if (!gaModalShareTrackedForOpen) {
        gaModalShareTrackedForOpen = true;
        trackGaShareClick('modal_copy');
      }
      copyToClipboard(url, copyBtn);
    });

    overlay.querySelectorAll('.afri-social-item').forEach(link => {
      link.addEventListener('click', () => {
        if (!gaModalShareTrackedForOpen) {
          gaModalShareTrackedForOpen = true;
          const label = (link.textContent || 'social').trim().toLowerCase().replace(/\s+/g, '_');
          trackGaShareClick(label);
        }
      });
    });

    requestAnimationFrame(() => {
      overlay.classList.add('afri-modal-open');
    });
  }

  function handleShareClick() {
    const url = getShareUrl();
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const title = document.title.replace(/\s*[|—–-]\s*AfriWidget.*$/i, '').trim();
    const summary = getVisibleResultSummary();
    const shareText = summary
      ? `My ${title} result on AfriWidget: ${summary}`
      : `Check out my calculation on AfriWidget (${title}):`;

    if (isMobile && navigator.share) {
      trackGaShareClick('native_share');
      navigator.share({
        title: `${title} – AfriWidget`,
        text: shareText,
        url: url
      }).catch(err => {
        if (err?.name !== 'AbortError') {
          gaModalShareTrackedForOpen = true;
          openShareModal(url);
        }
      });
    } else {
      trackGaShareClick('share_modal');
      gaModalShareTrackedForOpen = true;
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

  function isHealthTool() {
    const healthSlugs = [
      'bmi-calculator',
      'body-fat-calculator',
      'calorie-burn-calculator',
      'daily-calorie-needs-calculator',
      'healthy-weight-range-calculator',
      'hydration-reminder-calculator',
      'ideal-weight-calculator',
      'ovulation-cycle-calculator',
      'water-intake-calculator'
    ];
    const currentSlug = location.pathname.replace(/\/+$/, '').split('/').pop().replace(/\.html$/, '');
    if (healthSlugs.includes(currentSlug)) return true;
    if (document.getElementById('afriHealthProgress')) return true;
    if (document.querySelector('script[src*="health-progress.js"]')) return true;
    return false;
  }

  function injectShareBar() {
    if (document.getElementById('afriShareBar')) return;
    const host = findResultHost();
    const toc = document.querySelector('.toc');
    const isHealth = isHealthTool();
    if (!host && (!isHealth || !toc)) return;

    const bar = document.createElement('div');
    bar.id = 'afriShareBar';
    bar.className = 'afri-share-bar';
    bar.innerHTML = `
      <div class="afri-share-inner">
        <div class="afri-share-info">
          <h3 class="afri-share-title">Save or Share Your Result</h3>
          <p class="afri-share-desc">
            Send this completed calculation to mentors, family, or save a permanent bookmark link.
          </p>
        </div>
        <div class="afri-share-actions">
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

    // Health progress or Academic Progress MUST come BEFORE the share bar
    // And Share bar MUST come BEFORE weaknesses and compare with a friend
    const healthProgressEl = document.getElementById('afriHealthProgress');
    const academicProgressEl = document.getElementById('afriAcademicProgress');
    const weaknessBannerEl = document.getElementById('weaknessCalloutBanner');
    const compareCardEl = document.getElementById('compareEntryCard');

    if (academicProgressEl && academicProgressEl.parentNode) {
      academicProgressEl.insertAdjacentElement('afterend', bar);
    } else if (healthProgressEl && healthProgressEl.parentNode) {
      healthProgressEl.insertAdjacentElement('afterend', bar);
    } else if (weaknessBannerEl && weaknessBannerEl.parentNode) {
      weaknessBannerEl.parentNode.insertBefore(bar, weaknessBannerEl);
    } else if (compareCardEl && compareCardEl.parentNode) {
      compareCardEl.parentNode.insertBefore(bar, compareCardEl);
    } else if (host && (host.id === 'results' || host.id === 'cfResults' || host.classList.contains('results'))) {
      host.appendChild(bar);
    } else if (host && host.classList.contains('calc-panel')) {
      host.insertAdjacentElement('afterend', bar);
    } else if (toc && toc.parentNode) {
      toc.parentNode.insertBefore(bar, toc);
    } else if (host) {
      host.appendChild(bar);
    }

    if (typeof window.afriEnsureResultSectionsOrder === 'function') {
      window.afriEnsureResultSectionsOrder();
    }

    const copyBtn = document.getElementById('afriBarCopyBtn');
    copyBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      trackGaShareClick('copy_link');
      const url = getShareUrl();
      copyToClipboard(url, copyBtn);
    });

    const modalBtn = document.getElementById('afriBarModalBtn');
    modalBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      handleShareClick();
    });

    // Also support any inline share buttons marked with data-share-btn or .share-btn
    $$('[data-share-btn], .share-btn, #shareBtn, #shareResultsBtn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        handleShareClick();
      });
    });
  }

  function injectDonationCard() {
    if (document.getElementById('afriDonationCard')) return;

    const host = findResultHost();
    const toc = document.querySelector('.toc');
    const isHealth = isHealthTool();
    if (!host && (!isHealth || !toc)) return;

    const card = document.createElement('section');
    card.id = 'afriDonationCard';
    card.className = 'afri-donation-card';
    card.setAttribute('aria-label', 'Support AfriWidget');
    card.innerHTML = `
      <div class="afri-donation-inner">
        <div class="afri-donation-info">
          <h3 class="afri-donation-title">Keep AfriWidget Free &amp; Independent</h3>
          <p class="afri-donation-desc">
            AfriWidget provides 100% free educational calculators and everyday tools with zero accounts or subscriptions. If this tool helped you today, your contribution helps us cover server hosting, database maintenance, and continuous improvements.
          </p>
        </div>
        <div class="afri-donation-action">
          <form action="https://www.paypal.com/ncp/payment/VXH3B6743NDVE" method="post" target="_blank" class="afri-paypal-form">
            <input class="pp-VXH3B6743NDVE" type="submit" value="Keep Us Alive" />
            <div class="afri-paypal-meta">
              <img src="https://www.paypalobjects.com/images/Debit_Credit.svg" alt="Debit and Credit Cards" class="afri-card-icons" loading="lazy" />
              <div class="afri-paypal-powered">
                Powered by <img src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-wordmark-color.svg" alt="PayPal" class="afri-paypal-logo" loading="lazy" />
              </div>
            </div>
          </form>
        </div>
      </div>
    `;

    const compareCardEl = document.getElementById('compareEntryCard');
    const weaknessBannerEl = document.getElementById('weaknessCalloutBanner');
    const shareBarEl = document.getElementById('afriShareBar');
    const healthProgressEl = document.getElementById('afriHealthProgress');
    const academicProgressEl = document.getElementById('afriAcademicProgress');

    if (compareCardEl && compareCardEl.parentNode) {
      compareCardEl.insertAdjacentElement('afterend', card);
    } else if (weaknessBannerEl && weaknessBannerEl.parentNode) {
      weaknessBannerEl.insertAdjacentElement('afterend', card);
    } else if (shareBarEl && shareBarEl.parentNode) {
      shareBarEl.insertAdjacentElement('afterend', card);
    } else if (academicProgressEl && academicProgressEl.parentNode) {
      academicProgressEl.insertAdjacentElement('afterend', card);
    } else if (healthProgressEl && healthProgressEl.parentNode) {
      healthProgressEl.insertAdjacentElement('afterend', card);
    } else if (host && (host.id === 'results' || host.id === 'cfResults' || host.classList.contains('results'))) {
      host.appendChild(card);
    } else if (host && host.classList.contains('calc-panel')) {
      host.insertAdjacentElement('afterend', card);
    } else if (toc && toc.parentNode) {
      toc.parentNode.insertBefore(card, toc);
    } else if (host) {
      host.appendChild(card);
    }

    if (typeof window.afriEnsureResultSectionsOrder === 'function') {
      window.afriEnsureResultSectionsOrder();
    }
  }
  window.afriInjectDonationCard = injectDonationCard;

  function reconcileRowCount(containerEl, rowSelector, addBtnSelector, removeBtnSelector, targetCount) {
    if (!containerEl || !isFinite(targetCount) || targetCount < 1) return;
    const capped = Math.min(40, Math.max(1, targetCount));
    const addBtn = addBtnSelector ? $(addBtnSelector) : null;

    let guard = 0;
    while ($$(rowSelector, containerEl).length < capped && addBtn && guard < 45) {
      const before = $$(rowSelector, containerEl).length;
      addBtn.click();
      if ($$(rowSelector, containerEl).length <= before) break;
      guard++;
    }

    guard = 0;
    while ($$(rowSelector, containerEl).length > capped && $$(rowSelector, containerEl).length > 1 && guard < 45) {
      const rows = $$(rowSelector, containerEl);
      const before = rows.length;
      const lastRow = rows[rows.length - 1];
      const remBtn = removeBtnSelector ? $(removeBtnSelector, lastRow) : null;
      if (remBtn) {
        remBtn.click();
      } else {
        break;
      }
      if ($$(rowSelector, containerEl).length >= before) break;
      guard++;
    }
  }

  function triggerCalculation() {
    // Skip auto-submit on file-required tools when no file is present
    if (page === 'exif-remover' || page === 'image-resizer-webp-converter') {
      return;
    }
    if (page === 'document-converter') {
      const ta = $('#textInput');
      const btn = $('#convertBtn');
      if (ta && ta.value.trim() && btn && !btn.disabled) {
        btn.click();
      }
      return;
    }
    if (page === 'job-application-tracker') {
      if (params.has('fCompany') && params.has('fTitle')) {
        const f = $('#trackerForm');
        if (f && f.classList.contains('open')) {
          if (typeof f.requestSubmit === 'function') f.requestSubmit();
          else f.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }
      }
      return;
    }

    // Explicit multi-action button restore
    const actId = params.get('_act');
    if (actId) {
      const actBtn = document.getElementById(actId);
      if (actBtn && !actBtn.disabled) {
        actBtn.click();
        return;
      }
    }

    if (page === 'text-case-converter-cleanup') {
      const esc = (v) => (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') ? CSS.escape(v) : v;
      const caseAct = params.get('_case');
      const cleanAct = params.get('_clean');
      if (caseAct) $(`.btn-case[data-action="${esc(caseAct)}"]`)?.click();
      if (cleanAct) $(`.btn-clean[data-clean="${esc(cleanAct)}"]`)?.click();
      const runBtn = $('#runBtn');
      if (runBtn && !caseAct && !cleanAct) runBtn.click();
      return;
    }

    const root = getCalcRoot();

    // Prefer active/visible <form> inside calculator root
    const visibleForms = $$('form', root).filter(f => !f.closest(EXCLUDED_SELECTOR) && isElementVisible(f));
    if (visibleForms.length > 0) {
      const targetForm = visibleForms[0];
      const submitBtn = $$('.btn-calc, button[type="submit"], input[type="submit"], .btn-primary', targetForm)
        .find(b => !b.disabled && isElementVisible(b));
      if (submitBtn) {
        submitBtn.click();
        return;
      }
      if (typeof targetForm.requestSubmit === 'function') {
        try {
          targetForm.requestSubmit();
          return;
        } catch {
          // Fall through to synthetic submit event
        }
      }
      targetForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      return;
    }

    // No-<form> tools: click primary calculation/action button inside visible calculator panel
    const calcBtn = $$(
      '#calcBtn, #calculateBtn, #convertBtn, #checkBtn, #runBtn, #encodeBtn, #formatBtn, #minifyBtn, .btn-calc, .btn-primary',
      root
    ).find(b => !b.closest(EXCLUDED_SELECTOR) && !b.disabled && isElementVisible(b));
    if (calcBtn) {
      calcBtn.click();
    }
  }

  function restoreInputs() {
    // Ignore Compare-with-a-Friend URLs (?compare=1 / ?cmp=... / ?f_v0=...) handled by icass-compare.js & academic-compare.js
    if (!hasSharedInputs || params.has('cmp') || params.has('compare')) return;

    let didMatchParam = params.get('shared') === '1';

    // 1. Restore active tab / mode buttons first
    const tabParam = params.get('_tab');
    if (tabParam) {
      const desiredIds = new Set(tabParam.split(',').filter(Boolean));
      const tabBtns = getTabButtons();
      tabBtns.forEach((btn, idx) => {
        const id = getTabId(btn, idx);
        if (desiredIds.has(id)) {
          didMatchParam = true;
          const alreadyActive = btn.classList.contains('active') || btn.getAttribute('aria-selected') === 'true';
          if (!alreadyActive) btn.click();
        }
      });
    } else if (params.has('weightLbs') || params.has('heightFeet')) {
      didMatchParam = true;
      $('#unitImperial')?.click();
    } else if (page === 'document-converter' && (params.has('textInput') || params.has('text'))) {
      didMatchParam = true;
      $('#modeTextBtn')?.click();
    }

    if (params.has('_act') || params.has('_case') || params.has('_clean')) {
      didMatchParam = true;
    }

    // Reveal optional toggle panels when their inputs are present in URL
    if (page === 'switzerland-grade-calculator' && (params.has('priorGpa') || params.has('priorEcts'))) {
      didMatchParam = true;
      const priorBlock = $('#priorBlock');
      if (priorBlock && priorBlock.classList.contains('hidden')) {
        $('#priorToggle')?.click();
      }
    }
    if (page === 'job-application-tracker' && params.has('fCompany') && !$('#trackerForm')?.classList.contains('open')) {
      didMatchParam = true;
      $('#addBtn')?.click();
    }

    // Legacy parameter alias support for older shared links
    if (page === 'tertiary-gpa-cgpa-calculator' && params.has('scale') && !params.has('scaleSelect')) {
      params.set('scaleSelect', params.get('scale'));
    }

    // 2. Restore static <select>, checkbox, and radio controls FIRST in DOM order (unlocks cascading dropdowns & conditional sections)
    const staticDescriptors = getStaticFieldDescriptors();
    staticDescriptors.forEach(({ el, key }) => {
      const tag = el.tagName.toLowerCase();
      if (tag === 'select' || el.type === 'checkbox' || el.type === 'radio') {
        if (params.has(key)) {
          didMatchParam = true;
          setFieldValue(el, params.get(key));
        }
      }
    });

    // Re-query static descriptors in case a cascading select / toggle unlocked or updated options, then set all static fields
    getStaticFieldDescriptors().forEach(({ el, key }) => {
      if (params.has(key)) {
        didMatchParam = true;
        setFieldValue(el, params.get(key));
      }
    });

    // 3. Reconcile and populate Dynamic Row Containers
    const dynConfigs = DYNAMIC_CONTAINERS[page] || [];
    dynConfigs.forEach(cfg => {
      const containerEl = $(cfg.container);
      if (!containerEl) return;

      if (cfg.prefix === 'gpa') {
        let maxCourse = parseInt(params.get('_rc_gpa') || '0', 10) || 0;
        params.forEach((_, k) => {
          const m = k.match(/^course(\d+)(?:Name|Grade|Credits)$/);
          if (m) maxCourse = Math.max(maxCourse, parseInt(m[1], 10));
        });
        if (maxCourse > 0) {
          didMatchParam = true;
          reconcileRowCount(containerEl, cfg.row, cfg.addBtn, cfg.removeBtn, maxCourse);
          for (let rIdx = 0; rIdx < maxCourse; rIdx++) {
            const row = $$(cfg.row, containerEl)[rIdx];
            if (!row) continue;
            const rowFields = $$('input, select, textarea', row).filter(isEditableField);
            const nKey = `course${rIdx + 1}Name`;
            const gKey = `course${rIdx + 1}Grade`;
            const cKey = `course${rIdx + 1}Credits`;
            if (params.has(nKey) && rowFields[0]) setFieldValue(rowFields[0], params.get(nKey));
            if (params.has(gKey) && rowFields[1]) setFieldValue(rowFields[1], params.get(gKey));
            if (params.has(cKey) && rowFields[2]) setFieldValue(rowFields[2], params.get(cKey));
          }
        }
        return;
      }

      // Also support legacy course1Name / subject1Name keys on tertiary-gpa-cgpa & igcse-alevel-gpa-converter
      let targetCount = parseInt(params.get(`_rc_${cfg.prefix}`) || '0', 10) || 0;
      const prefixRe = new RegExp(`^${cfg.prefix}(\\d+)_(\\d+)$`);
      params.forEach((_, k) => {
        const m = k.match(prefixRe);
        if (m) targetCount = Math.max(targetCount, parseInt(m[1], 10) + 1);
      });

      if (targetCount > 0) {
        didMatchParam = true;
        reconcileRowCount(containerEl, cfg.row, cfg.addBtn, cfg.removeBtn, targetCount);
        for (let rIdx = 0; rIdx < targetCount; rIdx++) {
          const row = $$(cfg.row, containerEl)[rIdx];
          if (!row) continue;
          const rowFields = $$('input, select, textarea', row).filter(isEditableField);
          rowFields.forEach((_, cIdx) => {
            // Re-query live row & field on each column in case setting col 0 re-rendered row options (e.g. UCAS .q-type -> .q-grade)
            const liveRow = $$(cfg.row, containerEl)[rIdx];
            if (!liveRow) return;
            const liveFields = $$('input, select, textarea', liveRow).filter(isEditableField);
            const k = `${cfg.prefix}${rIdx}_${cIdx}`;
            if (params.has(k) && liveFields[cIdx]) {
              setFieldValue(liveFields[cIdx], params.get(k));
            }
          });
        }
      } else if (page === 'igcse-alevel-gpa-converter' || page === 'tertiary-gpa-cgpa-calculator') {
        // Legacy subject1Name / course1Name fallback
        const legacyRe = page === 'igcse-alevel-gpa-converter'
          ? /^subject(\d+)(Name|Level|Grade)$/
          : /^course(\d+)(Name|Grade|Credits)$/;
        let legacyMax = 0;
        params.forEach((_, k) => {
          const m = k.match(legacyRe);
          if (m) legacyMax = Math.max(legacyMax, parseInt(m[1], 10));
        });
        if (legacyMax > 0) {
          didMatchParam = true;
          reconcileRowCount(containerEl, cfg.row, cfg.addBtn, cfg.removeBtn, legacyMax);
          for (let rIdx = 0; rIdx < legacyMax; rIdx++) {
            const row = $$(cfg.row, containerEl)[rIdx];
            if (!row) continue;
            const rowFields = $$('input, select, textarea', row).filter(isEditableField);
            if (page === 'igcse-alevel-gpa-converter') {
              if (params.has(`subject${rIdx + 1}Name`) && rowFields[0]) setFieldValue(rowFields[0], params.get(`subject${rIdx + 1}Name`));
              if (params.has(`subject${rIdx + 1}Level`) && rowFields[1]) setFieldValue(rowFields[1], params.get(`subject${rIdx + 1}Level`));
              if (params.has(`subject${rIdx + 1}Grade`) && rowFields[2]) setFieldValue(rowFields[2], params.get(`subject${rIdx + 1}Grade`));
            } else {
              if (params.has(`course${rIdx + 1}Name`) && rowFields[0]) setFieldValue(rowFields[0], params.get(`course${rIdx + 1}Name`));
              if (params.has(`course${rIdx + 1}Grade`) && rowFields[1]) setFieldValue(rowFields[1], params.get(`course${rIdx + 1}Grade`));
              if (params.has(`course${rIdx + 1}Credits`) && rowFields[2]) setFieldValue(rowFields[2], params.get(`course${rIdx + 1}Credits`));
            }
          }
        }
      }
    });

    // 4. Special restore: Form Four GPA Calculator
    if (page === 'form-four-gpa-calculator') {
      const extraStr = params.get('_ffExtra');
      if (extraStr) {
        didMatchParam = true;
        const extraSel = $('#extraSubjectSelect');
        const addBtn = $('#addSubjectBtn');
        if (extraSel && addBtn) {
          extraStr.split('|').filter(Boolean).forEach(subjName => {
            extraSel.value = subjName;
            addBtn.click();
          });
        }
      }
      $$('#subjectList .subject-row').forEach((row, idx) => {
        const gKey = `ff_${idx}`;
        if (params.has(gKey)) {
          didMatchParam = true;
          const gSel = row.querySelector('.subject-grade');
          if (gSel) setFieldValue(gSel, params.get(gKey));
        }
      });
    }

    // 5. Special restore: Job Application Tracker (_jobs payload)
    if (page === 'job-application-tracker' && params.has('_jobs')) {
      didMatchParam = true;
      try {
        const decoded = JSON.parse(decodeUtf8Base64Url(params.get('_jobs')));
        if (Array.isArray(decoded) && decoded.length > 0) {
          const existingRaw = localStorage.getItem('afriwidgetJobsV1');
          const existing = existingRaw ? JSON.parse(existingRaw) : [];
          const existingIds = new Set(Array.isArray(existing) ? existing.map(j => j.id) : []);
          const toImport = decoded.filter(j => j && j.company && j.title && (!j.id || !existingIds.has(j.id)));
          if (toImport.length > 0) {
            const importInput = $('#importFile');
            if (importInput && typeof DataTransfer !== 'undefined' && typeof File !== 'undefined') {
              const dt = new DataTransfer();
              dt.items.add(new File([JSON.stringify(toImport)], 'shared-jobs.json', { type: 'application/json' }));
              importInput.files = dt.files;
              importInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }
        }
      } catch {
        // Ignore malformed shared jobs payload
      }
    }

    if (page === 'online-shop-scam-checker' && params.has('_checks')) {
      didMatchParam = true;
    }

    if (!didMatchParam) return;

    // 6. Trigger calculation & post-calculation restores
    setTimeout(() => {
      gaIsRestoringSharedCalc = true;
      try {
        triggerCalculation();
        if (page === 'online-shop-scam-checker' && params.has('_checks')) {
          const wanted = new Set(params.get('_checks').split(',').map(s => parseInt(s, 10)));
          const boxes = $$('.scam-check');
          boxes.forEach((cb, idx) => {
            const next = wanted.has(idx);
            if (cb.checked !== next) {
              cb.checked = next;
              dispatchFieldEvents(cb);
            }
          });
        }
      } catch (err) {
        console.warn('Share auto-calculate notice:', err);
      } finally {
        gaIsRestoringSharedCalc = false;
      }
      showToast('Calculation restored');
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

  function ensureRecentTools() {
    if (window.AfriWidgetRecentTools) return;
    if (!document.querySelector('script[src*="recent-tools.js"]')) {
      const s = document.createElement('script');
      s.src = '/recent-tools.js?v=1';
      s.defer = true;
      document.body.appendChild(s);
    }
  }

  function findGaResultHost() {
    return $('#results') ||
      $('#cfResults') ||
      $('#resultCard') ||
      $('#resultsCard') ||
      $('#eligibilityCard') ||
      $('#jobList') ||
      $('.results');
  }

  function isGaResultHostVisible(host) {
    if (!host) return false;
    if (host.id === 'jobList') return true;
    if (host.classList.contains('visible')) return true;
    return isElementVisible(host);
  }

  function getGaHostSignature(host) {
    if (!host) return '';
    return (host.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 300);
  }

  function getGaStatusElement() {
    return document.getElementById('actionStatus') ||
      document.getElementById('qrStatus') ||
      document.getElementById('status') ||
      document.getElementById('outputStatus');
  }

  function gaLooksLikeValidationError(msg) {
    if (!msg) return false;
    return /^(?:please\b|add at least\b|paste\b|enter\b|choose\b|select\b|upload\b|keep at least\b|nothing to\b|invalid\b|unable to\b|could not\b|failed\b|error\b|mark one\b|calculate first\b|no valid\b|check the\b|target profit must\b|waist must\b)/i.test(msg.trim());
  }

  function gaHasErrorState(host) {
    if (!host) return false;
    const outBody = host.querySelector('#outputBody');
    if (outBody && outBody.classList.contains('error')) return true;
    return false;
  }

  function isGaCalculateTriggerElement(el) {
    if (!el || el.nodeType !== 1) return false;
    if (el.closest('header, footer, nav, #cookieBanner, .toc, .faq-list, .related-tools')) return false;
    if (el.closest(EXCLUDED_SELECTOR)) return false;
    if (el.id === 'aiBtn' || el.closest('#aiBtn')) return false;
    if (el.matches('.pp-VXH3B6743NDVE')) return false;
    const idLower = (el.id || '').toLowerCase();
    if (/^(reset|clear|copy|download|print|export|add|remove|sample|preset|cancel|close)/.test(idLower) ||
        (/(?:reset|clear|copy|download|print|export)$/.test(idLower) && idLower !== 'prodbtn' && idLower !== 'stripbtn')) {
      return false;
    }
    if (el.matches(TAB_BTN_SELECTOR)) return false;
    if (el.matches('#addRowBtn, #addCourseBtn, #addCourseBtn2, #addSubjectBtn, #addSemesterBtn, #addItemBtn, #addDebtBtn, #addOneTimeBtn, #addMonthlyBtn, #addComponentBtn, #addProfileSubjectBtn, #addY2ModuleBtn, #addY3ModuleBtn, #addSubjectRowBtn, #addCompRowBtn, #addALevel, #addBtec, #addTLevel, #addEPQ, #addOther, .btn-remove, .qual-remove, .cost-row-remove, .mod-remove, .item-remove, #cfReset, #cfOpenCompare, #cfClearCompare, #cfCloseCompare, #useAsInputBtn, #changeToneBtn, #addBtn, #closeFormBtn, #cancelBtn, #modeFileBtn, #modeTextBtn, #ucasAlertClose, #importBtn, #exportBtn, #pdfBtn')) {
      return false;
    }
    return el.matches('button[type="submit"], input[type="submit"], .btn-calc, #calcBtn, #calculateBtn, #convertBtn, #stripBtn, #resizeBtn, #checkBtn, #runBtn, #encodeBtn, #decodeBtn, #formatBtn, #minifyBtn, #generateBtn, #paraBtn, #prodBtn, #sumBtn, #findScholarshipsBtn, .btn-case[data-action], .btn-clean[data-clean]');
  }

  function ensureGaResultObserver(host) {
    if (!host || typeof MutationObserver === 'undefined') return;
    if (gaResultObserver && gaResultObserver.__observedHost === host) return;
    if (gaResultObserver) {
      gaResultObserver.disconnect();
    }
    const observer = new MutationObserver(() => {
      if (!gaActiveAttempt || gaActiveAttempt.completed || gaActiveAttempt.aborted) return;
      gaActiveAttempt.domMutated = true;
      scheduleGaAttemptEvaluation(gaActiveAttempt, 50);
    });
    observer.observe(host, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    observer.__observedHost = host;
    gaResultObserver = observer;
  }

  function scheduleGaAttemptEvaluation(attempt, delayMs) {
    if (!attempt || attempt.completed || attempt.aborted) return;
    clearTimeout(attempt.evalTimer);
    attempt.evalTimer = setTimeout(() => {
      evaluateGaAttempt(attempt);
    }, delayMs);
  }

  function evaluateGaAttempt(attempt) {
    if (!attempt || attempt.completed || attempt.aborted || attempt !== gaActiveAttempt) return;

    const host = attempt.host || findGaResultHost();
    const statusEl = getGaStatusElement();
    const afterStatus = statusEl ? statusEl.textContent.trim() : '';
    const nowVisible = host ? isGaResultHostVisible(host) : false;
    const newlyVisible = !attempt.wasVisible && nowVisible;

    if (afterStatus && gaLooksLikeValidationError(afterStatus) && !newlyVisible && !attempt.domMutated) {
      attempt.aborted = true;
      gaActiveAttempt = null;
      return;
    }

    if (gaHasErrorState(host)) {
      attempt.aborted = true;
      gaActiveAttempt = null;
      return;
    }

    // If an AI insight/generation request is still in flight, wait until it settles (up to max timeout)
    if (gaAiInFlightCount > attempt.aiCountAtStart) {
      if (Date.now() - attempt.startedAt < 20000) {
        scheduleGaAttemptEvaluation(attempt, 180);
      } else {
        attempt.aborted = true;
        gaActiveAttempt = null;
      }
      return;
    }

    const afterSig = host ? getGaHostSignature(host) : '';
    const isAsyncTool = (
      page.indexOf('ai-') === 0 ||
      page === 'document-converter' ||
      page === 'exif-remover' ||
      page === 'image-resizer-webp-converter'
    );

    const passed = (
      newlyVisible ||
      (attempt.domMutated && nowVisible) ||
      (afterSig !== attempt.beforeSig && nowVisible) ||
      (page === 'job-application-tracker' && attempt.domMutated) ||
      (!isAsyncTool && attempt.wasVisible && nowVisible && attempt.formSubmitted && !attempt.aborted && !gaLooksLikeValidationError(afterStatus))
    );

    if (passed) {
      attempt.completed = true;
      gaActiveAttempt = null;
      trackGaEvent('calculation_completed');
      return;
    }

    // For async file/AI tools, keep window open cleanly until result finishes or timeout expires
    if (isAsyncTool && (Date.now() - attempt.startedAt < 15000)) {
      scheduleGaAttemptEvaluation(attempt, 220);
      return;
    }

    attempt.aborted = true;
    gaActiveAttempt = null;
  }

  function startGaCalcAttempt(formOrNull, fromSubmit) {
    if (gaActiveAttempt && !gaActiveAttempt.completed) {
      clearTimeout(gaActiveAttempt.evalTimer);
    }
    const host = findGaResultHost();
    if (host) ensureGaResultObserver(host);
    const statusEl = getGaStatusElement();
    const attempt = {
      id: ++gaAttemptSeq,
      startedAt: Date.now(),
      host: host,
      wasVisible: host ? isGaResultHostVisible(host) : false,
      beforeSig: host ? getGaHostSignature(host) : '',
      beforeStatus: statusEl ? statusEl.textContent.trim() : '',
      aiCountAtStart: gaAiInFlightCount,
      formSubmitted: Boolean(fromSubmit),
      domMutated: false,
      completed: false,
      aborted: false,
      evalTimer: null
    };
    gaActiveAttempt = attempt;
    trackGaEvent('calculate_click');
    scheduleGaAttemptEvaluation(attempt, 90);
    return attempt;
  }

  function initGa4CalculateTracking() {
    if (gaCalcListenersBound || !isGaToolPage()) return;
    gaCalcListenersBound = true;

    const initialHost = findGaResultHost();
    if (initialHost) ensureGaResultObserver(initialHost);

    document.addEventListener('click', (e) => {
      if (gaIsRestoringSharedCalc) return;
      const btn = e.target.closest('button, input[type="submit"]');
      if (!btn) return;

      if (!isGaCalculateTriggerElement(btn)) {
        gaLastNonCalcClickTs = Date.now();
        return;
      }

      const now = Date.now();
      if (btn === gaLastClickTriggerBtn && (now - gaLastClickTriggerTs) < 300) {
        return;
      }
      gaLastClickTriggerBtn = btn;
      gaLastClickTriggerTs = now;
      gaLastClickTriggerForm = btn.form || null;

      startGaCalcAttempt(btn.form || null, false);
    }, true);

    document.addEventListener('submit', (e) => {
      if (gaIsRestoringSharedCalc) return;
      const form = e.target;
      if (!form || form.classList.contains('afri-paypal-form')) return;

      const now = Date.now();
      if (now - gaLastNonCalcClickTs < 50) return;

      if (gaActiveAttempt && !gaActiveAttempt.completed && !gaActiveAttempt.aborted &&
          gaLastClickTriggerForm === form && (now - gaLastClickTriggerTs) < 350) {
        gaActiveAttempt.formSubmitted = true;
        return;
      }

      startGaCalcAttempt(form, true);
    }, true);

    document.addEventListener('invalid', () => {
      if (gaActiveAttempt && !gaActiveAttempt.completed && (Date.now() - gaActiveAttempt.startedAt) < 150) {
        clearTimeout(gaActiveAttempt.evalTimer);
        gaActiveAttempt.aborted = true;
        gaActiveAttempt = null;
      }
    }, true);
  }

  function init() {
    ensurePwaMetaTags();
    ensureRecentTools();
    injectShareStyles();
    setupActionTrackers();
    injectShareBar();
    injectDonationCard();
    trackGaToolOpen();
    initGa4CalculateTracking();
    restoreInputs();

    // Re-verify donation card on calculate button click or calculation submission
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-calc, button[type="submit"], #calcBtn, #calculateBtn, input[type="submit"]:not(.pp-VXH3B6743NDVE)');
      if (btn) {
        setTimeout(() => {
          injectShareBar();
          injectDonationCard();
          if (typeof window.afriEnsureResultSectionsOrder === 'function') {
            window.afriEnsureResultSectionsOrder();
          }
        }, 80);
      }
    });

    document.addEventListener('submit', (e) => {
      if (e.target && e.target.classList.contains('afri-paypal-form')) return;
      setTimeout(() => {
        injectShareBar();
        injectDonationCard();
        if (typeof window.afriEnsureResultSectionsOrder === 'function') {
          window.afriEnsureResultSectionsOrder();
        }
      }, 80);
    });
  }

  onReady(init);
})();
