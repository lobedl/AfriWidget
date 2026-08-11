(function () {
  'use strict';

  if (window.AFRIWIDGET_UNIVERSAL_AI_INITIALIZED) return;
  window.AFRIWIDGET_UNIVERSAL_AI_INITIALIZED = true;

  const MAX_CUSTOM_QUESTIONS = 5;
  const WINDOW_MS = 24 * 60 * 60 * 1000;
  const QUOTA_KEY = 'afriwidget-ai-question-window';
  const FALLBACK_MESSAGE = 'Realtime AI is unavailable right now. Please try again later.';
  const endpoint = window.AFRIWIDGET_AI_ENDPOINT || '/.netlify/functions/groq-proxy';

  const PAGE_CONFIGS = {
    'age-calculator': { category: 'health', result: ['#ageResult', '#ageSummary'], host: '#ageResult' },
    'bece-aggregate-calculator': { category: 'education', result: ['#aggregateResult', '#resultMessage'], host: '#aggregateResult' },
    'bece-cssps-placement-estimator': { category: 'education', result: ['#becePlacementResult', '#becePlacementMessage'], host: '#becePlacementCard' },
    'blood-donation-eligibility-calculator': { category: 'health', result: ['#donationResult', '#donationStatus'], host: '#donationResult' },
    'bmi-calculator': { category: 'health', result: ['#results'], host: '#results' },
    'calorie-deficit-planner': { category: 'health', result: ['#calorieResult', '#calorieMessage'], host: '#calorieResult' },
    'compound-interest': { category: 'finance', result: ['#results'], host: '#results' },
    'currency-converter': { category: 'finance', result: ['#currencyValue', '#currencyMessage'], host: '#currencyResult' },
    'data-file-unit-converter': { category: 'productivity', result: ['#dataValue', '#dataMessage'], host: '#dataResult' },
    'freelance-hourly-rate-pricing-calculator': { category: 'business', result: ['#freelanceHourly', '#freelanceProject'], host: '#freelanceResult' },
    'freelance-rate-calculator': { category: 'business', result: ['#hourlyRateDisplay', '#dayRateDisplay', '#monthlyRetainerDisplay', '#grossRevenueDisplay'], host: '#results' },
    'startup-cost-calculator': { category: 'business', result: ['#totalCapital', '#resOneTime', '#resMonthly', '#resBuffer'], host: '#results' },
    'pricing-calculator': { category: 'business', result: ['#sellingPrice', '#netProfit', '#realMargin', '#realMarkup'], host: '#results' },
    'roi-calculator': { category: 'business', result: ['#roiPct', '#netProfitText', '#netGainEl'], host: '#results' },
    'debt-payoff-calculator': { category: 'finance', result: ['#payoffMonths', '#totalInterest', '#totalPaid'], host: '#results' },
    'break-even-calculator': { category: 'business', result: ['#beUnits', '#beRevenue', '#contribMargin'], host: '#results' },
    'macro-calculator': { category: 'health', result: ['#dailyCalories', '#proteinGrams', '#carbsGrams', '#fatsGrams'], host: '#results' },
    'gpa-calculator': { category: 'education', result: ['#results'], host: '#results' },
    'hourly-to-salary': { category: 'finance', result: ['#results'], host: '#results' },
    'igcse-alevel-gpa-converter': { category: 'education', result: ['#igcseGpaResult', '#igcseGpaMessage'], host: '#igcseGpaResult' },
    'image-resizer-webp-converter': { category: 'productivity', result: ['#imageStatus', '#imageDimensions'], host: '#imageStatus' },
    'icass-calculator': { category: 'education', result: ['#icassScore', '#icassBand'], host: '#icassResult' },
    'invoice-receipt-generator': { category: 'productivity', result: ['#invoiceGrandTotal', '#invoicePreviewTotal'], host: '#invoicePreview' },
    'jamb-utme-aggregate-calculator': { category: 'education', result: ['#jambResult', '#jambMessage'], host: '#jambResult' },
    'loan-calculator': { category: 'finance', result: ['#loanPayment', '#loanTotal', '#loanInterest'], host: '#loanResult' },
    'json-formatter': { category: 'productivity', result: ['#formatted', '#successBlock', '#errorBlock'], host: '#formatted' },
    'kcse-eligibility-tier-checker': { category: 'education', result: ['#kcseTierResult', '#kcseTierMessage'], host: '#kcseTierResult' },
    'kcse-kuccps-cluster-calculator': { category: 'education', result: ['#kcseResult', '#kcseMessage'], host: '#kcseResult' },
    'meta-pixel-checker': { category: 'productivity', result: ['#pixelStatus', '#serpTitle', '#serpDescription'], host: '#pixelStatus' },
    'mortgage-calculator': { category: 'finance', result: ['#results'], host: '#results' },
    'olevel-subject-combination-checker': { category: 'education', result: ['#olevelResultTitle', '#olevelCritical'], host: '#olevelResultTitle' },
    'ovulation-cycle-calculator': { category: 'health', result: ['#cycleResult', '#cycleMessage'], host: '#cycleResult' },
    'password-generator': { category: 'productivity', result: ['#results', '#passwordOutput'], host: '#results' },
    'random-email-generator': { category: 'productivity', result: ['#emailOutput'], host: '#emailOutput' },
    'random-business-name-generator': { category: 'productivity', result: ['#businessOutput'], host: '#businessOutput' },
    'random-team-name-generator': { category: 'productivity', result: ['#teamOutput'], host: '#teamOutput' },
    'random-nickname-generator': { category: 'productivity', result: ['#nicknameOutput'], host: '#nicknameOutput' },
    'random-username-generator': { category: 'productivity', result: ['#usernameOutput'], host: '#usernameOutput' },
    'random-address-generator': { category: 'productivity', result: ['#addressOutput', '#addressStatus'], host: '#addressOutput' },
    'random-phone-number-generator': { category: 'productivity', result: ['#phoneOutput', '#phoneStatus'], host: '#phoneOutput' },
    'random-date-generator': { category: 'productivity', result: ['#dateOutput', '#dateStatus'], host: '#dateOutput' },
    'random-color-generator': { category: 'productivity', result: ['#colorOutput', '#colorStatus'], host: '#colorOutput' },
    'paypal-fee-calculator': { category: 'finance', result: ['#results'], host: '#results' },
    'pediatric-dosage-calculator': { category: 'health', result: ['#dosageResult', '#dosageMessage'], host: '#dosageResult' },
    'percentage-calculator': { category: 'finance', result: ['#results'], host: '#results' },
    'profit-margin-calculator': { category: 'finance', result: ['#results'], host: '#results' },
    'reading-time-speech-estimator': { category: 'productivity', result: ['#readingWords', '#silentTime'], host: '#readingWords' },
    'rent-affordability': { category: 'finance', result: ['#results'], host: '#results' },
    'robots-txt-generator': { category: 'productivity', result: ['#robotsOutput', '#robotsStatus'], host: '#robotsOutput' },
    'seo-meta-generator': { category: 'productivity', result: ['#generatedTags', '#previewStatus'], host: '#generatedTags' },
    'south-african-aps-calculator': { category: 'education', result: ['#apsResult', '#apsMessage'], host: '#apsResult' },
    'south-african-tvet-nated-calculator': { category: 'education', result: ['#natedResult', '#natedMessage'], host: '#natedResult' },
    'savings-goal-timeline-calculator': { category: 'finance', result: ['#savingsTime', '#savingsMessage'], host: '#savingsResult' },
    'savings-calculator': { category: 'finance', result: ['#savingsCalcTotal', '#savingsCalcGrowth'], host: '#savingsCalcResult' },
    'tertiary-gpa-cgpa-calculator': { category: 'education', result: ['#gpaResult', '#gpaMessage'], host: '#gpaResult' },
    'text-case-converter-cleanup': { category: 'productivity', result: ['#caseStatus', '#caseWords', '#caseChars'], host: '#caseStatus' },
    'unit-converter': { category: 'productivity', result: ['#conversionResult'], host: '#conversionResult' },
    'university-cutoff-eligibility-checker': { category: 'education', result: ['#eligibilityCard', '#eligibilityStatus', '#eligibilityMessage'], host: '#eligibilityCard' },
    'wassce-aggregate-calculator': { category: 'education', result: ['#aggregateResult', '#resultMessage'], host: '#aggregateResult' },
    'water-intake-calculator': { category: 'health', result: ['#waterResult', '#waterMessage'], host: '#waterResult' },
    'whatsapp-direct-link-qr-generator': { category: 'productivity', result: ['#whatsappOutput', '#whatsappStatus'], host: '#whatsappOutput' },
    'qr-code-generator': { category: 'productivity', result: ['#qrStatus'], host: '#qrCanvas' },
    'word-counter': { category: 'productivity', result: ['#statWords', '#statChars', '#keywordList'], host: '#keywordList' },
    'work-experience-resume-duration-calculator': { category: 'productivity', result: ['#experienceSummary', '#experienceYears'], host: '#experienceResult' },
    'xml-sitemap-builder': { category: 'productivity', result: ['#sitemapOutput', '#sitemapStatus'], host: '#sitemapOutput' }
  };

  const CATEGORY_NAMES = {
    health: 'Health',
    education: 'Education',
    finance: 'Finance',
    business: 'Business',
    productivity: 'Productivity',
    tools: 'General Tools'
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function pageKey() {
    const page = window.location.pathname.split('/').pop() || 'index';
    return page.replace(/\.html$/i, '') || 'index';
  }

  function getConfig() {
    return PAGE_CONFIGS[pageKey()];
  }

  function readQuota() {
    const now = Date.now();
    try {
      const saved = JSON.parse(localStorage.getItem(QUOTA_KEY) || 'null');
      if (!saved || !Number.isFinite(saved.resetAt) || now >= saved.resetAt) {
        return { count: 0, resetAt: now + WINDOW_MS };
      }
      return {
        count: Math.min(MAX_CUSTOM_QUESTIONS, Math.max(0, Number(saved.count) || 0)),
        resetAt: saved.resetAt
      };
    } catch {
      return { count: 0, resetAt: now + WINDOW_MS };
    }
  }

  function writeQuota(quota) {
    try {
      localStorage.setItem(QUOTA_KEY, JSON.stringify(quota));
    } catch {
      // The assistant remains usable if browser storage is blocked.
    }
  }

  function formatCountdown(resetAt) {
    const remaining = Math.max(0, resetAt - Date.now());
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
    return `Resets in ${hours}h ${minutes}m ${seconds}s`;
  }

  function getInputContext() {
    return $$('input, select, textarea').filter(input => {
      if (input.closest('#ai-live-insight') || input.closest('#cookieBanner')) return false;
      return input.value !== '';
    }).slice(0, 50).map(input => {
      const label = input.getAttribute('aria-label') ||
        input.closest('label')?.textContent?.replace(/\s+/g, ' ').trim() ||
        input.id || input.name || input.tagName.toLowerCase();
      return `${label}: ${input.value}`;
    }).join('\n');
  }

  function visible(element) {
    return element && !element.classList.contains('hidden') &&
      window.getComputedStyle(element).display !== 'none';
  }

  function resultText(config) {
    return config.result.map(selector => {
      const element = $(selector);
      if (!element || (element.id === 'results' && !visible(element))) return '';
      return element.innerText || element.textContent || '';
    }).join(' ').replace(/\s+/g, ' ').trim();
  }

  function hasValidResult(config) {
    const elements = config.result.map(selector => $(selector)).filter(Boolean);
    if (!elements.length) return false;
    const text = resultText(config);
    if (!text) return false;
    const lower = text.toLowerCase();
    const placeholderOnly = [
      '—', 'choose ', 'select ', 'enter ', 'start typing', 'your result will',
      'no result', 'not yet calculated', 'will appear here'
    ];
    if (placeholderOnly.some(value => lower === value || lower.startsWith(value))) return false;
    if (lower.includes('enter a ') && (lower.includes('—') || lower.includes('choose'))) return false;
    if (elements.some(element => element.id === 'results' && visible(element))) return true;
    return !/^(—|choose|select|enter|start typing|no result)/i.test(text);
  }

  function contextFor(config) {
    return {
      tool: document.title.replace(/\s*[|—-]\s*AfriWidget.*$/i, '').trim(),
      category: config.category,
      page: document.title,
      result: resultText(config) || 'No completed result',
      inputs: getInputContext()
    };
  }

  async function askAI(mode, context, question = '') {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, category: context.category, context, question })
      });
      if (!response.ok) return FALLBACK_MESSAGE;
      const payload = await response.json();
      return payload?.ok && payload.text ? payload.text : (payload?.message || FALLBACK_MESSAGE);
    } catch {
      return FALLBACK_MESSAGE;
    }
  }

  function buildAssistant(config) {
    const assistant = document.createElement('section');
    assistant.id = 'ai-live-insight';
    assistant.className = 'hidden mt-6 rounded-2xl border border-emerald-200 bg-white p-5 sm:p-6 shadow-sm';
    const categoryName = CATEGORY_NAMES[config.category] || CATEGORY_NAMES.tools;
    assistant.innerHTML = `
      <div class="flex items-center gap-3 mb-3">
        <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold" aria-hidden="true">AI</div>
        <div>
          <h2 class="font-bold text-slate-900">AfriWidget AI ${categoryName} Assistant</h2>
          <p class="text-xs text-slate-500">Friendly, practical guidance based on this result</p>
        </div>
      </div>
      <p id="universalAiInsight" class="text-slate-700 leading-relaxed" aria-live="polite">${FALLBACK_MESSAGE}</p>
      <div class="mt-5 pt-5 border-t border-slate-200">
        <label for="universalAiQuestion" class="block text-sm font-semibold text-slate-800 mb-2">Ask a follow-up question</label>
        <div class="flex flex-col sm:flex-row gap-2">
          <input id="universalAiQuestion" type="text" maxlength="500" class="flex-1 bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 px-3 py-2.5 rounded-xl outline-none" placeholder="Ask about this result…" />
          <button id="universalAiAsk" type="button" class="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold px-5 py-2.5 rounded-xl">Ask AI</button>
        </div>
        <div class="mt-2 flex flex-wrap justify-between gap-2 text-xs text-slate-500">
          <span id="universalAiCounter"></span>
          <span id="universalAiReset"></span>
        </div>
        <p id="universalAiAnswer" class="hidden mt-4 rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-sm text-emerald-950 leading-relaxed" aria-live="polite"></p>
      </div>`;

    const host = $(config.host) || $('main');
    if (host) host.insertAdjacentElement('afterend', assistant);
    return assistant;
  }

  function init(config) {
    if ($('#ai-live-insight')) return;
    const assistant = buildAssistant(config);
    if (!assistant) return;

    const insight = $('#universalAiInsight', assistant);
    const question = $('#universalAiQuestion', assistant);
    const askButton = $('#universalAiAsk', assistant);
    const answer = $('#universalAiAnswer', assistant);
    const counter = $('#universalAiCounter', assistant);
    const reset = $('#universalAiReset', assistant);
    let lastSignature = '';
    let requestVersion = 0;
    let activitySeen = false;
    let scheduled;
    let countdownTimer;

    const updateQuotaUi = () => {
      const quota = readQuota();
      const left = Math.max(0, MAX_CUSTOM_QUESTIONS - quota.count);
      counter.textContent = `${left} / ${MAX_CUSTOM_QUESTIONS} questions left`;
      reset.textContent = formatCountdown(quota.resetAt);
      const disabled = left === 0;
      question.disabled = disabled;
      askButton.disabled = disabled;
      question.placeholder = disabled
        ? 'Your questions will be available after the reset timer.'
        : 'Ask about this result…';
      if (disabled) answer.textContent = 'You have reached the five-question limit. Check back after the reset timer.';
    };

    const runInsight = async () => {
      if (!activitySeen || !hasValidResult(config)) return;
      const context = contextFor(config);
      const signature = `${context.result}|${context.inputs}`;
      if (signature === lastSignature) return;
      lastSignature = signature;
      const currentRequest = ++requestVersion;
      assistant.classList.remove('hidden');
      insight.textContent = 'Preparing your AI insight…';
      const text = await askAI('insight', context);
      if (currentRequest === requestVersion) insight.textContent = text;
    };

    const scheduleInsight = () => {
      window.clearTimeout(scheduled);
      scheduled = window.setTimeout(runInsight, 450);
    };

    const markActivity = event => {
      if (event.target.closest('#ai-live-insight') || event.target.closest('#cookieBanner')) return;
      activitySeen = true;
      scheduleInsight();
    };

    document.addEventListener('input', markActivity, true);
    document.addEventListener('change', markActivity, true);
    document.addEventListener('click', event => {
      if (event.target.closest('#ai-live-insight') || event.target.closest('#cookieBanner')) return;
      if (event.target.closest('button, [role="button"], summary')) markActivity(event);
    }, true);
    document.addEventListener('submit', markActivity, true);

    const observer = new MutationObserver(() => {
      if (activitySeen) scheduleInsight();
    });
    observer.observe(document.body, { childList: true, characterData: true, subtree: true });

    askButton.addEventListener('click', async () => {
      const prompt = question.value.trim();
      const quota = readQuota();
      if (!prompt || quota.count >= MAX_CUSTOM_QUESTIONS) {
        updateQuotaUi();
        return;
      }
      quota.count += 1;
      writeQuota(quota);
      updateQuotaUi();
      askButton.disabled = true;
      answer.classList.remove('hidden');
      answer.textContent = 'Thinking through your question…';
      answer.textContent = await askAI('question', contextFor(config), prompt);
      question.value = '';
      updateQuotaUi();
    });

    question.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        askButton.click();
      }
    });

    updateQuotaUi();
    countdownTimer = window.setInterval(updateQuotaUi, 1000);
    window.addEventListener('pagehide', () => {
      window.clearInterval(countdownTimer);
      window.clearTimeout(scheduled);
      observer.disconnect();
    }, { once: true });
  }

  function start() {
    const config = getConfig();
    if (config) init(config);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();