function onReady(fn) { if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', fn); } else { fn(); } }
(function () {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const text = (selector, value) => { const node = $(selector); if (node) node.textContent = value; };

  const oLevelRequirements = {
    medicine: {
      name: 'Medicine',
      core: ['English Language', 'Mathematics', 'Biology', 'Chemistry', 'Physics'],
      electives: ['Biology', 'Chemistry', 'Physics'],
      critical: 'Mathematics, Chemistry, Biology, and Physics are mandatory planning subjects for Medicine.'
    },
    law: {
      name: 'Law',
      core: ['English Language', 'Mathematics'],
      electives: ['Government / History', 'Literature in English', 'Economics'],
      critical: 'English Language is the critical mandatory subject; confirm the institution-specific Literature, Government, or History rule.'
    },
    computerScience: {
      name: 'Computer Science',
      core: ['English Language', 'Mathematics'],
      electives: ['Physics', 'Chemistry', 'Further Mathematics / ICT'],
      critical: 'Mathematics is mandatory for Computer Science; many institutions also expect Physics or a related science.'
    },
    accounting: {
      name: 'Accounting',
      core: ['English Language', 'Mathematics'],
      electives: ['Economics', 'Financial Accounting', 'Business Studies'],
      critical: 'Mathematics is mandatory for Accounting; Economics or Financial Accounting is commonly required or strongly preferred.'
    },
    nursing: {
      name: 'Nursing',
      core: ['English Language', 'Mathematics', 'Biology'],
      electives: ['Chemistry', 'Physics', 'Integrated Science'],
      critical: 'Biology and Chemistry are critical planning subjects for Nursing, with English and Mathematics also required.'
    },
    pharmacy: {
      name: 'Pharmacy',
      core: ['English Language', 'Mathematics', 'Biology', 'Chemistry'],
      electives: ['Physics', 'Biology', 'Chemistry'],
      critical: 'Chemistry and Biology are mandatory planning subjects for Pharmacy, alongside English and Mathematics.'
    },
    engineering: {
      name: 'Engineering',
      core: ['English Language', 'Mathematics', 'Physics'],
      electives: ['Chemistry', 'Further Mathematics', 'Technical Drawing'],
      critical: 'Mathematics and Physics are mandatory planning subjects for Engineering; verify the branch-specific third subject.'
    }
  };

  function initOLevelChecker() {
    const course = $('#olevelCourse');
    if (!course) return;
    const calculate = () => {
      const selected = oLevelRequirements[course.value];
      if (!selected) {
        text('#olevelResultTitle', 'Choose a course');
        text('#olevelCore', 'Your mandatory core subjects will appear here.');
        text('#olevelElectives', 'Your recommended elective subjects will appear here.');
        text('#olevelCritical', 'Select a target course to see the subject combination.');
        return;
      }
      text('#olevelResultTitle', `${selected.name} subject combination`);
      text('#olevelCore', selected.core.join(' · '));
      text('#olevelElectives', selected.electives.join(' · '));
      text('#olevelCritical', selected.critical);
    };
    $('#olevelCheck')?.addEventListener('click', calculate);
  }

  const kcseTiers = {
    A: ['High Chance for Public/Private University Degree Placement (KUCCPS)', 'Degree placement planning is available at this grade level. Confirm programme subject clusters and the current KUCCPS cycle.'],
    'A-': ['High Chance for Public/Private University Degree Placement (KUCCPS)', 'Degree placement planning is available at this grade level. Confirm programme subject clusters and the current KUCCPS cycle.'],
    'B+': ['High Chance for Public/Private University Degree Placement (KUCCPS)', 'Degree placement planning is available at this grade level. Confirm programme subject clusters and the current KUCCPS cycle.'],
    B: ['High Chance for Public/Private University Degree Placement (KUCCPS)', 'Degree placement planning is available at this grade level. Confirm programme subject clusters and the current KUCCPS cycle.'],
    'B-': ['High Chance for Public/Private University Degree Placement (KUCCPS)', 'Degree placement planning is available at this grade level. Confirm programme subject clusters and the current KUCCPS cycle.'],
    'C+': ['High Chance for Public/Private University Degree Placement (KUCCPS)', 'A C+ mean grade is the standard degree-entry planning threshold, subject to programme and placement rules.'],
    C: ['Qualified for Diploma Programs in TVET Colleges', 'Diploma-level planning is available. Check the specific TVET college, course requirements, and application dates.'],
    'C-': ['Qualified for Diploma Programs in TVET Colleges', 'Diploma-level planning is available. Check the specific TVET college, course requirements, and application dates.'],
    'D+': ['Qualified for Craft Certificate Programs', 'Craft certificate planning is available. Confirm the institution and course-specific minimum subjects.'],
    D: ['Qualified for Craft Certificate Programs', 'Craft certificate planning is available. Confirm the institution and course-specific minimum subjects.'],
    'D-': ['Qualified for Artisan Certificate Programs', 'Artisan certificate planning is available. Confirm the institution, trade, and current admission requirements.'],
    E: ['Qualified for Artisan Certificate Programs', 'Artisan certificate planning is available. Confirm the institution, trade, and current admission requirements.']
  };

  function initKcseTierChecker() {
    const grade = $('#kcseMeanGrade');
    if (!grade) return;
    const calculate = () => {
      const result = kcseTiers[grade.value];
      text('#kcseTierResult', result ? result[0] : 'Choose your KCSE mean grade');
      text('#kcseTierMessage', result ? result[1] : 'Select a grade to see the planning tier.');
    };
    $('#kcseTierCheck')?.addEventListener('click', calculate);
  }

  function initNatedCalculator() {
    const icass = $('#natedIcass');
    const exam = $('#natedExam');
    if (!icass || !exam) return;
    const calculate = () => {
      const icassValue = Number(icass.value);
      const examValue = Number(exam.value);
      const valid = icass.value !== '' && exam.value !== '' &&
        Number.isFinite(icassValue) && Number.isFinite(examValue) &&
        icassValue >= 0 && icassValue <= 100 && examValue >= 0 && examValue <= 100;
      if (!valid) {
        text('#natedResult', 'Enter both marks');
        text('#natedMessage', 'Enter ICASS and final examination marks from 0 to 100.');
        return;
      }
      const total = (icassValue * 0.4) + (examValue * 0.6);
      const passed = total >= 40 && examValue >= 40;
      text('#natedResult', `${total.toFixed(1)}% · ${passed ? 'PASS' : 'NOT YET PASSED'}`);
      text('#natedMessage', `ICASS contribution: ${(icassValue * 0.4).toFixed(1)} points · Exam contribution: ${(examValue * 0.6).toFixed(1)} points. ${examValue < 40 ? 'The exam sub-minimum of 40% was not met.' : 'The exam sub-minimum was met.'}`);
      const card = $('#natedCard');
      if (card) card.dataset.status = passed ? 'pass' : 'fail';
    };
    $('#natedCalculate')?.addEventListener('click', calculate);
  }

  const beceData = {
    A: {
      high: {
        range: [6, 10],
        title: 'High Placement Chance',
        statusKey: 'high-chance',
        badgeClass: 'text-emerald-800 bg-emerald-100 border-emerald-300',
        reason: 'In BECE, lower aggregates mean better grades (Aggregate 6 is the best). Category A national schools are Ghana\'s top-tier institutions. They typically admit students with aggregates between 6 and 10. Your aggregate puts you in the top candidate pool.',
        strategy: '<strong>Recommended Form Strategy:</strong> You can confidently place Category A schools as your top choices on your CSSPS form. Always list strong Category B schools as your 2nd or 3rd choices as safe backups.'
      },
      borderline: {
        range: [11, 14],
        title: 'Borderline / Competitive',
        statusKey: 'borderline',
        badgeClass: 'text-amber-800 bg-amber-100 border-amber-300',
        reason: 'Your aggregate is good, but Category A schools are extremely competitive across Ghana. Most admitted students score aggregates between 6 and 10. Admission is possible depending on programme demand and regional quotas, but competition is fierce.',
        strategy: '<strong>Recommended Form Strategy:</strong> You can select 1 Category A school as your first choice, but make sure your 2nd, 3rd, and 4th choices are solid Category B schools so you get placed smoothly.'
      },
      low: {
        range: [15, 54],
        title: 'Low Placement Chance',
        statusKey: 'low-chance',
        badgeClass: 'text-rose-800 bg-rose-100 border-rose-300',
        reason: 'Category A schools (top national schools like Wesley Girls, Prempeh, Achimota, etc.) fill virtually all available places with students who scored aggregates 6 to 12. Because lower aggregates get selected first, an aggregate of {AGG} has a low probability of securing a Category A spot.',
        strategy: '<strong>Recommended Form Strategy:</strong> Avoid using multiple choices on Category A schools. Focus your choices on Category B and Category C schools where your aggregate has a much higher placement chance.'
      }
    },
    B: {
      high: {
        range: [6, 18],
        title: 'High Placement Chance',
        statusKey: 'high-chance',
        badgeClass: 'text-emerald-800 bg-emerald-100 border-emerald-300',
        reason: 'Strong result for Category B regional schools! Aggregates from 6 to 18 give you a solid qualification for premier Category B institutions across Ghana.',
        strategy: '<strong>Recommended Form Strategy:</strong> Select your preferred Category B schools confidently, while adding Category C schools as safe backups.'
      },
      borderline: {
        range: [19, 24],
        title: 'Borderline / Competitive',
        statusKey: 'borderline',
        badgeClass: 'text-amber-800 bg-amber-100 border-amber-300',
        reason: 'Your aggregate is in the middle range for Category B. Highly competitive courses like Science in top Category B schools fill up with lower aggregates (6–18), while General Arts, Home Economics, or Technical courses may accept up to aggregate 24.',
        strategy: '<strong>Recommended Form Strategy:</strong> Pair your Category B choices with 2 or 3 reliable Category C schools on your CSSPS form to guarantee placement.'
      },
      low: {
        range: [25, 54],
        title: 'Low Placement Chance',
        statusKey: 'low-chance',
        badgeClass: 'text-rose-800 bg-rose-100 border-rose-300',
        reason: 'Category B regional schools fill most of their available seats with students scoring aggregates between 6 and 18 (and up to 24 for less crowded programmes). With an aggregate of {AGG}, applicants with lower (better) grades take available places first.',
        strategy: '<strong>Recommended Form Strategy:</strong> Select Category C schools, local district day schools, or Technical/Vocational (TVET) institutes as your primary CSSPS choices to guarantee a spot.'
      }
    },
    C: {
      high: {
        range: [6, 30],
        title: 'High Placement Chance',
        statusKey: 'high-chance',
        badgeClass: 'text-emerald-800 bg-emerald-100 border-emerald-300',
        reason: 'Very strong qualification for Category C schools! Your aggregate is well within the typical placement threshold for Category C institutions and district high schools.',
        strategy: '<strong>Recommended Form Strategy:</strong> You have a very high chance of placement in Category C. Choose preferred district or regional schools on your form.'
      },
      borderline: {
        range: [31, 42],
        title: 'Borderline / Competitive',
        statusKey: 'borderline',
        badgeClass: 'text-amber-800 bg-amber-100 border-amber-300',
        reason: 'Aggregates between 31 and 42 qualify for Category C, but placement depends on school capacity and local applicant demand. Choosing public day schools in your district increases your placement likelihood.',
        strategy: '<strong>Recommended Form Strategy:</strong> Choose local day schools in your district and include TVET / technical options on your CSSPS form.'
      },
      low: {
        range: [43, 54],
        title: 'Low Placement Chance',
        statusKey: 'low-chance',
        badgeClass: 'text-rose-800 bg-rose-100 border-rose-300',
        reason: 'An aggregate of {AGG} is higher than the standard cutoff for general Category C academic Senior High Schools. Places in Category C are typically taken by students scoring aggregates 30 to 40.',
        strategy: '<strong>Recommended Form Strategy:</strong> Select local community day schools, district TVET institutes, or private high school options to ensure continued schooling without delay.'
      }
    }
  };

  function initBecePlacementEstimator() {
    const aggregate = $('#becePlacementAggregate');
    const category = $('#beceSchoolCategory');
    if (!aggregate || !category) return;
    const calculate = () => {
      const value = Number(aggregate.value);
      const valid = aggregate.value !== '' && Number.isFinite(value) && value >= 6 && value <= 54 && category.value;
      const resEl = $('#becePlacementResult');
      const msgEl = $('#becePlacementMessage');
      const altEl = $('#becePlacementAlternatives');
      const cardEl = $('#becePlacementCard');

      if (!valid) {
        if (resEl) resEl.textContent = 'Enter an aggregate and school category';
        if (msgEl) msgEl.textContent = 'Use an aggregate from 6 to 54 and choose Category A, B, or C to see your placement estimate and clear reasons.';
        if (altEl) altEl.classList.add('hidden');
        return;
      }

      const catData = beceData[category.value];
      let band = catData.high;
      if (value >= catData.low.range[0]) {
        band = catData.low;
      } else if (value >= catData.borderline.range[0]) {
        band = catData.borderline;
      }

      if (resEl) {
        resEl.innerHTML = `<span class="inline-block px-3 py-1 rounded-lg border font-extrabold text-xs uppercase tracking-wider mb-2 ${band.badgeClass}">${band.title}</span><div class="text-2xl font-black text-slate-900">Category ${category.value} School Placement</div>`;
      }

      const reasonText = band.reason.replace('{AGG}', value);
      if (msgEl) {
        msgEl.innerHTML = `<div class="font-bold text-slate-900 mb-1.5 text-base">Why this result?</div><p class="text-slate-700 leading-relaxed">${reasonText}</p>`;
      }

      if (altEl) {
        altEl.classList.remove('hidden');
        altEl.innerHTML = `<div class="font-bold text-slate-900 mb-1 text-xs uppercase tracking-wider text-amber-900">Form Strategy</div><p class="text-slate-800 leading-relaxed">${band.strategy}</p>`;
      }

      if (cardEl) {
        cardEl.dataset.status = band.statusKey;
      }
    };
    $('#becePlacementCalculate')?.addEventListener('click', calculate);
  }

  const conversionPoints = { 'A*': 4, A: 4, B: 3, C: 2, D: 1, E: 0 };

  function initIgGpaConverter() {
    const rows = $('#igcseRows');
    if (!rows) return;
    let rowNumber = 0;
    const levels = ['A-Level', 'AS-Level', 'IGCSE'];
    const grades = ['A*', 'A', 'B', 'C', 'D', 'E'];
    const options = (values, placeholder) => `<option value="">${placeholder}</option>${values.map(value => `<option value="${value}">${value}</option>`).join('')}`;
    const calculate = () => {
      const entries = $$('.igcse-row', rows).map(row => ({
        name: $('.igcse-subject', row).value.trim(),
        level: $('.igcse-level', row).value,
        grade: $('.igcse-grade', row).value
      }));
      if (!entries.length || entries.some(entry => !entry.level || !entry.grade)) {
        text('#igcseGpaResult', '—');
        text('#igcseGpaMessage', 'Add at least one subject and choose a level and grade for every row.');
        return;
      }
      const weightedPoints = entries.map(entry => conversionPoints[entry.grade] + (entry.level === 'A-Level' ? 0.5 : 0));
      const gpa = weightedPoints.reduce((sum, value) => sum + value, 0) / weightedPoints.length;
      text('#igcseGpaResult', gpa.toFixed(2));
      text('#igcseGpaMessage', `${entries.length} subject${entries.length === 1 ? '' : 's'} counted · Weighted points: ${weightedPoints.map(value => value.toFixed(1)).join(', ')} · A-Level rows receive the +0.5 AP-equivalent weighting.`);
    };
    const addRow = () => {
      rowNumber += 1;
      const row = document.createElement('div');
      row.className = 'igcse-row grid grid-cols-12 gap-2 items-center';
      row.innerHTML = `<label class="sr-only" for="igcseSubject${rowNumber}">Subject name</label><input id="igcseSubject${rowNumber}" class="igcse-subject col-span-5 bg-slate-50 border-2 border-slate-200 px-3 py-2 rounded-lg" placeholder="Subject name" /><label class="sr-only" for="igcseLevel${rowNumber}">Level</label><select id="igcseLevel${rowNumber}" class="igcse-level col-span-3 bg-slate-50 border-2 border-slate-200 px-2 py-2 rounded-lg">${options(levels, 'Level')}</select><label class="sr-only" for="igcseGrade${rowNumber}">Grade</label><select id="igcseGrade${rowNumber}" class="igcse-grade col-span-3 bg-slate-50 border-2 border-slate-200 px-2 py-2 rounded-lg">${options(grades, 'Grade')}</select><button type="button" class="igcse-remove col-span-1 text-slate-400 hover:text-rose-600 text-xl" aria-label="Remove subject">×</button>`;
      $('.igcse-remove', row).addEventListener('click', () => { row.remove(); });
      rows.appendChild(row);
    };
    $('#addIgcseSubject')?.addEventListener('click', () => { addRow(); });
    $('#igcseCalculate')?.addEventListener('click', calculate);
    addRow();
    addRow();
  }

  onReady(() => {
    const mobileMenuButton = $('#mobileMenuBtn');
    const mobileMenu = $('#mobileMenu');
    if (mobileMenuButton && mobileMenu) mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    initOLevelChecker();
    initKcseTierChecker();
    initNatedCalculator();
    initBecePlacementEstimator();
    initIgGpaConverter();
  });
})();