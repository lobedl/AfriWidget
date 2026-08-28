function onReady(fn) { if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', fn); } else { fn(); } }
(function () {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const page = location.pathname.split('/').pop().replace(/\.html$/, '') || 'home';
  const params = new URLSearchParams(location.search);
  const hasSharedInputs = Array.from(params.keys()).some(key => key !== 'shared');
  let restoredFromUrl = false;
  let syncTimer;

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
    'student-budget-calculator': {
      fields: () => [$('#livingCity'), $('#housingType'), $('#incomeYouthAllowance'), $('#incomeJob'), $('#incomeFamily'), $('#incomeScholarship'), $('#costRent'), $('#costGroceries'), $('#costUtilities'), $('#costTransport'), $('#costPhone'), $('#costAcademic'), $('#costPersonal')],
      calculate: () => $('#calcBudgetBtn')?.click()
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
    }
  };

  function standardAdapter() {
    const form = $('form');
    if (!form) return null;
    return {
      fields: () => $$('input, select, textarea', form),
      calculate: () => form.requestSubmit()
    };
  }

  function adapter() {
    return adapters[page] || standardAdapter();
  }

  function fieldKey(field, index) {
    if (field.id) return field.id;
    if (field.name) return field.name;
    const label = field.getAttribute('aria-label');
    if (label) return `field${index}_${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    return `field${index}`;
  }

  function valuesFor(adapterConfig) {
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
    const fields = adapterConfig?.fields?.() || [];
    const values = [];
    fields.forEach((field, index) => {
      if (!field) return;
      if (field.type === 'radio' && !field.checked) return;
      const key = fieldKey(field, index);
      if (field.type === 'checkbox') {
        values.push({ key, value: field.checked ? '1' : '0' });
      } else if (field.value !== '') {
        values.push({ key, value: field.value });
      }
    });
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
    return values;
  }

  function shareUrl(adapterConfig) {
    const url = new URL(location.href);
    url.search = '';
    valuesFor(adapterConfig).forEach(({ key, value }) => url.searchParams.set(key, value));
    url.searchParams.set('shared', '1');
    return url.toString();
  }

  function showToast(message) {
    let toast = $('#shareToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'shareToast';
      toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[120] flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-2xl transition-all duration-300 border border-slate-700/80';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg><span>${message}</span>`;
    toast.classList.remove('opacity-0', 'translate-y-4');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-4');
    }, 2800);
  }

  async function copyUrl(url) {
    try {
      await navigator.clipboard.writeText(url);
      showToast('Shareable calculation link copied to clipboard!');
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
      showToast('Shareable calculation link copied to clipboard!');
    }
  }

  function openShareModal(url, adapterConfig) {
    let modal = $('#afriwidgetShareModal');
    if (modal) modal.remove();

    const title = document.title.replace(/\s*[|—-]\s*AfriWidget.*$/i, '').trim();
    const encodedUrl = encodeURIComponent(url);
    const shareText = encodeURIComponent(`Check out my calculation on AfriWidget (${title}): `);

    modal = document.createElement('div');
    modal.id = 'afriwidgetShareModal';
    modal.className = 'fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-200';
    modal.innerHTML = `
      <div class="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 text-left animate-in fade-in zoom-in-95 duration-150">
        <button id="closeShareModal" type="button" class="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" aria-label="Close share dialog">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold mb-2">
            <span>⚡ Share &amp; Save Calculation</span>
          </div>
          <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Share Your Result</h3>
          <p class="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Anyone opening this link will see your exact inputs and computed results loaded instantly in their browser.
          </p>
        </div>

        <!-- Copy Link Box -->
        <div class="space-y-2">
          <label for="shareLinkInput" class="block text-xs font-bold uppercase tracking-wider text-slate-500">Direct Shareable Link</label>
          <div class="flex items-center gap-2">
            <input id="shareLinkInput" type="text" readonly value="${url}" class="flex-1 bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-xs sm:text-sm text-slate-800 font-mono select-all focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <button id="modalCopyBtn" type="button" class="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold px-5 py-3 rounded-xl transition-all text-xs sm:text-sm shadow-sm flex items-center gap-1.5 flex-shrink-0 cursor-pointer">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              <span>Copy</span>
            </button>
          </div>
        </div>

        <!-- 1-Click Social Sharing -->
        <div class="space-y-2 pt-2 border-t border-slate-100">
          <span class="block text-xs font-bold uppercase tracking-wider text-slate-500">Share Directly To:</span>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <a href="https://api.whatsapp.com/send?text=${shareText}${encodedUrl}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold transition-all">
              <span>💬 WhatsApp</span>
            </a>
            <a href="https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all">
              <span>✖ Post on X</span>
            </a>
            <a href="mailto:?subject=${encodeURIComponent(title)}&body=${shareText}${encodedUrl}" class="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all">
              <span>✉ Email</span>
            </a>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = $('#closeShareModal', modal);
    closeBtn?.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    const copyBtn = $('#modalCopyBtn', modal);
    copyBtn?.addEventListener('click', () => {
      copyUrl(url);
    });
  }

  function bindShareButton(button, adapterConfig) {
    if (!button) return;
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      const url = shareUrl(adapterConfig);
      const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      if (isMobile && navigator.share) {
        try {
          await navigator.share({
            title: document.title.replace(/\s*[|—-]\s*AfriWidget.*$/i, '').trim(),
            text: 'Check out my calculated score on AfriWidget!',
            url
          });
          return;
        } catch (error) {
          if (error?.name === 'AbortError') return;
        }
      }
      openShareModal(url, adapterConfig);
    });
  }

  function resultHost() {
    return $('#resultsCard') ||
      $('#statusBanner')?.closest('.rounded-2xl, section, div') ||
      $('#gpaResult')?.closest('.bg-white, .rounded-2xl, section') ||
      $('#jambResult')?.closest('.bg-white, .rounded-2xl, section') ||
      $('#apsResult')?.closest('.bg-white, .rounded-2xl, section') ||
      $('#kcseResult')?.closest('.bg-white, .rounded-2xl, section') ||
      $('#aggregateResult')?.closest('.bg-white, .rounded-2xl, section') ||
      $('#eligibilityCard') ||
      $('#conversionResult')?.closest('.bg-white, .rounded-2xl, section') ||
      $('#ageResult')?.closest('.bg-white, .rounded-2xl, section') ||
      $('#olevelResult')?.closest('.bg-white, .rounded-2xl, section') ||
      $('#kcseTierResult')?.closest('.bg-white, .rounded-2xl, section') ||
      $('#natedCard') ||
      $('#becePlacementCard') ||
      $('#igcseGpaResult')?.closest('.bg-white, .rounded-2xl, section') ||
      $('#results') ||
      (page === 'percentage-calculator' ? $('#changeForm')?.closest('section') : null) ||
      $('main');
  }

  function injectShareControl(adapterConfig) {
    if (!adapterConfig || $('#shareResultButton') || $('#shareResultBar')) return;
    const host = resultHost();
    if (!host) return;

    const bar = document.createElement('div');
    bar.id = 'shareResultBar';
    bar.className = 'mt-8 w-full max-w-7xl mx-auto rounded-3xl border border-emerald-200/90 bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-emerald-50/90 p-5 sm:p-6 lg:p-7 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5 transition-all text-left';
    bar.innerHTML = `
      <div class="flex items-center gap-3.5 w-full md:w-auto">
        <div class="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm flex-shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
        </div>
        <div>
          <h3 class="font-extrabold text-slate-900 text-base sm:text-lg">Share &amp; Save Calculation</h3>
          <p class="text-xs sm:text-sm text-slate-600">Send this completed result to mentors, family, or save a permanent bookmark link.</p>
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
        <button id="shareResultButton" type="button" class="flex-1 sm:flex-initial rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 px-5 py-3 font-extrabold text-white text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
          <span>Copy Shareable Link</span>
        </button>
        <button id="shareModalButton" type="button" class="flex-1 sm:flex-initial rounded-xl bg-white hover:bg-slate-50 active:scale-95 border border-slate-200 px-4 py-3 font-bold text-slate-700 text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer">
          <span>More Options…</span>
        </button>
      </div>
    `;

    // Smart full-width responsive insertion:
    const parentGrid = host.closest('.grid');
    if (parentGrid && parentGrid.parentElement) {
      parentGrid.insertAdjacentElement('afterend', bar);
    } else if (host.id === 'results' && host.firstElementChild) {
      host.firstElementChild.insertAdjacentElement('afterend', bar);
    } else if (host.tagName === 'MAIN' && host.firstElementChild) {
      const target = host.querySelector('section, form, div.grid') || host.firstElementChild;
      target.insertAdjacentElement('afterend', bar);
    } else {
      host.insertAdjacentElement('afterend', bar);
    }

    bindShareButton($('#shareResultButton'), adapterConfig);
    bindShareButton($('#shareModalButton'), adapterConfig);
    
    // Also bind any other share buttons on the page (e.g. data-share-btn or #shareResultsBtn)
    $$('[data-share-btn], #shareResultsBtn, .share-btn').forEach(btn => {
      bindShareButton(btn, adapterConfig);
    });
  }

  function restoreField(field, value) {
    if (!field) return;
    if (field.type === 'checkbox') field.checked = value === '1' || value === 'true';
    else if (field.type === 'radio') field.checked = field.value === value;
    else field.value = value;
  }

  function restore(adapterConfig) {
    if (!hasSharedInputs || !adapterConfig) return;
    const values = Array.from(params.entries()).filter(([key]) => key !== 'shared').map(([key, value]) => ({ key, value }));
    adapterConfig.restore?.(values);
    const fields = adapterConfig.fields?.() || [];
    values.forEach(({ key, value }) => {
      const matchingFields = fields.filter((candidate, index) => candidate && fieldKey(candidate, index) === key);
      if (matchingFields[0]?.type === 'radio') {
        matchingFields.forEach(field => { field.checked = field.value === value; });
      } else if (matchingFields[0]) {
        restoreField(matchingFields[0], value);
      }
    });
    restoredFromUrl = true;
    setTimeout(() => adapterConfig.calculate?.(), 80);
  }

  function syncUrl(adapterConfig) {
    if (!adapterConfig || !valuesFor(adapterConfig).length) return;
    const url = shareUrl(adapterConfig);
    history.replaceState(history.state || {}, '', url);
  }

  function initialize() {
    const config = adapter();
    if (!config) return;
    injectShareControl(config);
    restore(config);
    document.addEventListener('submit', () => {
      clearTimeout(syncTimer);
      syncTimer = setTimeout(() => syncUrl(config), 80);
    }, true);
    document.addEventListener('input', () => {
      clearTimeout(syncTimer);
      syncTimer = setTimeout(() => syncUrl(config), 120);
    }, true);
    document.addEventListener('change', () => {
      clearTimeout(syncTimer);
      syncTimer = setTimeout(() => syncUrl(config), 120);
    }, true);
    if (restoredFromUrl) showToast('Shared inputs restored.');
  }

  onReady(initialize);
})();