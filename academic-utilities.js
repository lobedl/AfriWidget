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
    course.addEventListener('change', calculate);
    course.addEventListener('input', calculate);
    calculate();
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
    grade.addEventListener('change', calculate);
    grade.addEventListener('input', calculate);
    calculate();
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
    [icass, exam].forEach(input => ['input', 'change'].forEach(event => input.addEventListener(event, calculate)));
    $('#natedCalculate')?.addEventListener('click', calculate);
    calculate();
  }

  const beceBands = {
    A: [
      [6, 10, 'High Chance', 'Category A planning range: aggregates 6–10.'],
      [11, 14, 'Borderline', 'Category A planning range: aggregates 11–14.'],
      [15, 54, 'Low Chance', 'Category A planning range: aggregate 15 or higher.']
    ],
    B: [
      [6, 18, 'High Chance', 'Category B planning range: aggregates 6–18.'],
      [19, 24, 'Borderline', 'Category B planning range: aggregates 19–24.'],
      [25, 54, 'Low Chance', 'Category B planning estimate: aggregate 25 or higher.']
    ],
    C: [
      [6, 30, 'High Chance', 'Category C indicative planning range: aggregates 6–30.'],
      [31, 42, 'Borderline', 'Category C indicative planning range: aggregates 31–42.'],
      [43, 54, 'Low Chance', 'Category C indicative planning estimate: aggregate 43 or higher.']
    ]
  };

  function initBecePlacementEstimator() {
    const aggregate = $('#becePlacementAggregate');
    const category = $('#beceSchoolCategory');
    if (!aggregate || !category) return;
    const calculate = () => {
      const value = Number(aggregate.value);
      const valid = aggregate.value !== '' && Number.isFinite(value) && value >= 6 && value <= 54 && category.value;
      if (!valid) {
        text('#becePlacementResult', 'Enter an aggregate and school category');
        text('#becePlacementMessage', 'Use an aggregate from 6 to 54 and choose Category A, B, or C.');
        return;
      }
      const band = beceBands[category.value].find(item => value >= item[0] && value <= item[1]);
      text('#becePlacementResult', `${band[2]} · Category ${category.value}`);
      text('#becePlacementMessage', `${band[3]} These are planning bands, not official CSSPS placement predictions.`);
      const alternatives = category.value === 'A' ? 'Consider Category B as a practical backup tier.' : category.value === 'B' ? 'Consider Category C or a less competitive Category B school as backup options.' : 'Consider additional Category C schools, day options, or a programme with more available places.';
      text('#becePlacementAlternatives', `Suggested backup plan: ${alternatives}`);
      const card = $('#becePlacementCard');
      if (card) card.dataset.status = band[2].toLowerCase().replace(' ', '-');
    };
    [aggregate, category].forEach(input => ['input', 'change'].forEach(event => input.addEventListener(event, calculate)));
    $('#becePlacementCalculate')?.addEventListener('click', calculate);
    calculate();
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
      $('.igcse-remove', row).addEventListener('click', () => { row.remove(); calculate(); });
      rows.appendChild(row);
      $$('.igcse-subject, .igcse-level, .igcse-grade', row).forEach(input => ['input', 'change'].forEach(event => input.addEventListener(event, calculate)));
    };
    $('#addIgcseSubject')?.addEventListener('click', () => { addRow(); calculate(); });
    addRow();
    addRow();
    calculate();
  }

  document.addEventListener('DOMContentLoaded', () => {
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