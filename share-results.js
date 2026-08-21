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
      toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-2xl transition-opacity duration-200';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.remove('opacity-0');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.add('opacity-0'), 2400);
  }

  async function copyUrl(url) {
    try {
      await navigator.clipboard.writeText(url);
      showToast('Link copied to clipboard!');
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
      showToast('Link copied to clipboard!');
    }
  }

  function bindShareButton(button, adapterConfig) {
    button.addEventListener('click', async () => {
      const url = shareUrl(adapterConfig);
      const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      if (isMobile && navigator.share) {
        try {
          await navigator.share({
            title: 'My Result',
            text: 'Check out my calculated score on AfriWidget!',
            url
          });
          return;
        } catch (error) {
          if (error?.name === 'AbortError') return;
        }
      }
      copyUrl(url);
    });
  }

  function resultHost() {
    return $('#statusBanner')?.closest('.rounded-2xl, section, div') ||
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
    if (!adapterConfig || $('#shareResultButton')) return;
    const host = resultHost();
    if (!host) return;
    const bar = document.createElement('div');
    bar.id = 'shareResultBar';
    bar.className = 'mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4';
    bar.innerHTML = '<div><p class="font-bold text-emerald-900">Share your result</p><p class="text-sm text-emerald-800">Send this calculation to someone or save a link to reopen it.</p></div><button id="shareResultButton" type="button" class="w-full sm:w-auto rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white shadow-md transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 cursor-pointer">Share Result</button>';

    if (host.id === 'results' && host.firstElementChild) {
      host.firstElementChild.insertAdjacentElement('afterend', bar);
    } else if (host.tagName === 'MAIN' && host.firstElementChild) {
      const target = host.querySelector('section, form, div.grid') || host.firstElementChild;
      target.insertAdjacentElement('afterend', bar);
    } else {
      host.insertAdjacentElement('afterend', bar);
    }

    bindShareButton($('#shareResultButton'), adapterConfig);
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