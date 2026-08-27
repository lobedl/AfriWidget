function onReady(fn) { if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', fn); } else { fn(); } }
(function () {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const set = (selector, value) => { const node = $(selector); if (node) node.textContent = value; };
  const moneyOrNumber = value => Number.isFinite(value) ? value.toFixed(2) : '—';

  function initJamb() {
    const scoreInput = $('#jambScore');
    if (!scoreInput) return;
    const points = { A1: 4, B2: 3.6, B3: 3.2, C4: 2.8, C5: 2.4, C6: 2 };
    const calculate = () => {
      const rawScore = scoreInput.value.trim();
      const grades = $$('.jamb-grade').map(select => select.value);
      if (rawScore === '' || grades.some(grade => !grade)) {
        set('#jambResult', '—');
        set('#jambMessage', 'Enter a JAMB score and choose all five O’Level grades to calculate.');
        return;
      }
      const jamb = Number(rawScore);
      if (!Number.isFinite(jamb) || jamb < 0 || jamb > 400) {
        set('#jambResult', '—');
        set('#jambMessage', 'JAMB UTME scores must be between 0 and 400.');
        return;
      }
      const oLevel = grades.reduce((sum, grade) => sum + points[grade], 0);
      const jambPart = jamb / 8;
      const finalScore = jambPart + oLevel;
      set('#jambResult', moneyOrNumber(finalScore));
      set('#jambMessage', `JAMB component: ${jambPart.toFixed(2)} · O’Level component: ${oLevel.toFixed(1)} · Formula maximum with this scale: 70 points.`);
    };
    $('#jambCalculate')?.addEventListener('click', calculate);
  }

  const gradeScales = {
    4: { A: 4, B: 3, C: 2, D: 1, F: 0 },
    5: { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 }
  };

  function initGpa() {
    const container = $('#courseRows');
    const scaleSelect = $('#gpaScale');
    if (!container || !scaleSelect) return;
    let rowNumber = 0;
    const options = scale => Object.entries(gradeScales[scale]).map(([grade, value]) => `<option value="${grade}">${grade} (${value})</option>`).join('');
    const addRow = (course = '', credits = '', grade = '') => {
      rowNumber += 1;
      const row = document.createElement('div');
      row.className = 'course-row grid grid-cols-12 gap-2 items-center';
      row.innerHTML = `
        <label class="sr-only" for="course-${rowNumber}">Course name</label>
        <input id="course-${rowNumber}" type="text" value="${course}" placeholder="Course name" class="course-name col-span-5 bg-slate-50 border-2 border-slate-200 focus:border-teal-600 px-3 py-2 rounded-lg text-sm outline-none" />
        <label class="sr-only" for="credits-${rowNumber}">Credit units or hours</label>
        <input id="credits-${rowNumber}" type="number" value="${credits}" min="0.5" max="30" step="0.5" placeholder="Credits" class="credit-input col-span-3 bg-slate-50 border-2 border-slate-200 focus:border-teal-600 px-3 py-2 rounded-lg text-sm outline-none" />
        <label class="sr-only" for="grade-${rowNumber}">Grade</label>
        <select id="grade-${rowNumber}" class="grade-select col-span-3 bg-slate-50 border-2 border-slate-200 focus:border-teal-600 px-2 py-2 rounded-lg text-sm outline-none"><option value="">Grade</option>${options(scaleSelect.value)}</select>
        <button type="button" class="remove-row col-span-1 text-slate-400 hover:text-red-500 text-xl" aria-label="Remove course">×</button>`;
      if (grade) $('.grade-select', row).value = grade;
      $('.remove-row', row).addEventListener('click', () => { row.remove(); });
      container.appendChild(row);
    };
    const calculate = () => {
      const scale = Number(scaleSelect.value);
      const scaleData = gradeScales[scale];
      let qualityPoints = 0;
      let creditsTotal = 0;
      let incomplete = false;
      let completed = 0;
      $$('.course-row', container).forEach(row => {
        const creditsRaw = $('.credit-input', row).value.trim();
        const grade = $('.grade-select', row).value;
        if (!creditsRaw && !grade) return;
        if (!creditsRaw || !grade || Number(creditsRaw) <= 0) { incomplete = true; return; }
        const credits = Number(creditsRaw);
        qualityPoints += scaleData[grade] * credits;
        creditsTotal += credits;
        completed += 1;
      });
      if (!completed || incomplete) {
        set('#gpaResult', '—');
        set('#gpaMessage', incomplete ? 'Complete or remove each partially filled course row.' : 'Add at least one course with credit units and a grade.');
        return;
      }
      set('#gpaResult', (qualityPoints / creditsTotal).toFixed(2));
      set('#gpaMessage', `${completed} course${completed === 1 ? '' : 's'} · ${creditsTotal.toFixed(1)} total credits · ${scale.toFixed(1)}-point scale. This entered-course GPA is also your current CGPA estimate.`);
    };
    scaleSelect.addEventListener('change', () => {
      $$('.grade-select', container).forEach(select => {
        const current = select.value;
        select.innerHTML = `<option value="">Grade</option>${options(scaleSelect.value)}`;
        if (gradeScales[scaleSelect.value][current] !== undefined) select.value = current;
      });
    });
    $('#addCourse')?.addEventListener('click', () => addRow());
    for (let i = 0; i < 4; i += 1) addRow();
    $('#gpaCalculate')?.addEventListener('click', calculate);
  }

  function initAps() {
    const first = $('.aps-main');
    if (!first) return;
    const points = percentage => percentage >= 80 ? 7 : percentage >= 70 ? 6 : percentage >= 60 ? 5 : percentage >= 50 ? 4 : percentage >= 40 ? 3 : percentage >= 30 ? 2 : 1;
    const calculate = () => {
      const mainValues = $$('.aps-main').map(input => input.value.trim());
      const loInput = $('#apsLifeOrientation');
      if (mainValues.some(value => value === '')) {
        set('#apsResult', '—');
        set('#apsMessage', 'Enter percentages for all six main subjects.');
        return;
      }
      const percentages = mainValues.map(Number);
      if (percentages.some(value => !Number.isFinite(value) || value < 0 || value > 100)) {
        set('#apsResult', '—');
        set('#apsMessage', 'Subject percentages must be between 0 and 100.');
        return;
      }
      const subjectPoints = percentages.map(points);
      let total = subjectPoints.reduce((sum, value) => sum + value, 0);
      let detail = 'Six main subjects counted (maximum 42 points).';
      if ($('#includeLifeOrientation')?.checked) {
        const loRaw = loInput.value.trim();
        if (loRaw === '') {
          set('#apsResult', '—');
          set('#apsMessage', 'Enter a Life Orientation percentage or untick the inclusion option.');
          return;
        }
        const lo = Number(loRaw);
        if (!Number.isFinite(lo) || lo < 0 || lo > 100) {
          set('#apsResult', '—');
          set('#apsMessage', 'Life Orientation must be between 0 and 100.');
          return;
        }
        total += points(lo);
        detail = `Six main subjects plus Life Orientation counted (maximum 49 points).`;
      }
      set('#apsResult', String(total));
      set('#apsMessage', `${detail} Converted points: ${subjectPoints.join(', ')}${$('#includeLifeOrientation')?.checked ? ` · LO: ${points(Number(loInput.value))}` : ''}.`);
    };
    $('#apsCalculate')?.addEventListener('click', calculate);
  }

  function initKcse() {
    const first = $('.kcse-grade');
    if (!first) return;
    const points = { A: 12, 'A-': 11, 'B+': 10, B: 9, 'B-': 8, 'C+': 7, C: 6, 'C-': 5, 'D+': 4, D: 3, 'D-': 2, E: 1 };
    const meanGrade = total => total >= 81 ? 'A' : total >= 74 ? 'A-' : total >= 67 ? 'B+' : total >= 60 ? 'B' : total >= 53 ? 'B-' : total >= 46 ? 'C+' : total >= 39 ? 'C' : total >= 32 ? 'C-' : total >= 25 ? 'D+' : total >= 18 ? 'D' : total >= 11 ? 'D-' : 'E';
    const calculate = () => {
      const grades = $$('.kcse-grade').map(select => select.value);
      if (grades.some(grade => !grade)) {
        set('#kcseResult', '—');
        set('#kcseMessage', 'Choose all seven KCSE subject grades to calculate the aggregate.');
        return;
      }
      const total = grades.reduce((sum, grade) => sum + points[grade], 0);
      set('#kcseResult', `${total} / 84`);
      set('#kcseMessage', `Estimated overall mean grade: ${meanGrade(total)} · Seven entered subjects counted. Higher aggregate points indicate stronger performance.`);
    };
    $('#kcseCalculate')?.addEventListener('click', calculate);
  }

  /*
   * Eligibility data model
   *
   * The checker deliberately keeps the source, academic year, and confidence
   * beside every institution profile. Admissions thresholds are not permanent:
   * a published minimum, a faculty screening baseline, and a competitive
   * departmental cut-off are different things. The UI therefore calls these
   * planning baselines and links users to the institution's official source.
   */
  const eligibilityCourseCatalog = [
    { id: 'medicine', label: 'Medicine & Surgery (MBChB / MBBS)', category: 'Health', higherOffset: 2, lowerOffset: -2 },
    { id: 'nursing', label: 'Nursing', category: 'Health', higherOffset: -2, lowerOffset: 3 },
    { id: 'pharmacy', label: 'Pharmacy', category: 'Health', higherOffset: 1, lowerOffset: 0 },
    { id: 'medical-laboratory', label: 'Medical Laboratory Science', category: 'Health', higherOffset: -4, lowerOffset: 4 },
    { id: 'dentistry', label: 'Dentistry', category: 'Health', higherOffset: 2, lowerOffset: -1 },
    { id: 'public-health', label: 'Public Health', category: 'Health', higherOffset: -2, lowerOffset: 2 },
    { id: 'computer-science', label: 'Computer Science', category: 'Tech', higherOffset: 0, lowerOffset: 0 },
    { id: 'information-technology', label: 'Information Technology', category: 'Tech', higherOffset: -1, lowerOffset: 1 },
    { id: 'software-engineering', label: 'Software Engineering', category: 'Tech', higherOffset: 1, lowerOffset: 1 },
    { id: 'civil-engineering', label: 'Civil Engineering', category: 'Engineering', higherOffset: 1, lowerOffset: 2 },
    { id: 'mechanical-engineering', label: 'Mechanical Engineering', category: 'Engineering', higherOffset: 0, lowerOffset: 2 },
    { id: 'electrical-engineering', label: 'Electrical Engineering', category: 'Engineering', higherOffset: 1, lowerOffset: 1 },
    { id: 'business-administration', label: 'Business Administration', category: 'Business', higherOffset: 0, lowerOffset: 0 },
    { id: 'finance-accounting', label: 'Finance / Accounting', category: 'Business', higherOffset: 1, lowerOffset: 1 },
    { id: 'economics', label: 'Economics', category: 'Business', higherOffset: 0, lowerOffset: 1 },
    { id: 'marketing', label: 'Marketing', category: 'Business', higherOffset: -1, lowerOffset: 2 },
    { id: 'llb-law', label: 'LLB Law', category: 'Law', higherOffset: 2, lowerOffset: -1 },
    { id: 'actuarial-science', label: 'Actuarial Science', category: 'Humanities & Sciences', higherOffset: 1, lowerOffset: 0 },
    { id: 'architecture', label: 'Architecture', category: 'Humanities & Sciences', higherOffset: 1, lowerOffset: 1 },
    { id: 'agriculture', label: 'Agriculture', category: 'Humanities & Sciences', higherOffset: -2, lowerOffset: 3 },
    { id: 'political-science', label: 'Political Science', category: 'Humanities & Sciences', higherOffset: -1, lowerOffset: 2 },
    { id: 'communications', label: 'Communications', category: 'Humanities & Sciences', higherOffset: -1, lowerOffset: 2 }
  ];

  const officialSources = {
    UG: { label: 'UG 2025/2026 official cut-off table', url: 'https://admissions.ug.edu.gh/undergraduate/cut-off', confidence: 'Official programme cut-off table' },
    KNUST: { label: 'KNUST official undergraduate admissions', url: 'https://www.knust.edu.gh/admissions/prospective/ugadmissions', confidence: 'Official requirements; verify programme cut-off' },
    UCC: { label: 'UCC official programme cut-off points', url: 'https://admissions.ucc.edu.gh/catalogue/programme/cut-off-points', confidence: 'Official programme cut-off table' },
    UENR: { label: 'UENR official admissions', url: 'https://uenr.edu.gh/admissions/', confidence: 'Official requirements; verify programme cut-off' },
    UPSA: { label: 'UPSA official admissions', url: 'https://admissions.upsa.edu.gh/', confidence: 'Official requirements; verify programme cut-off' },
    UMaT: { label: 'UMaT official admissions', url: 'https://umat.edu.gh/index.php/admissions/', confidence: 'Official requirements; verify programme cut-off' },
    UHAS: { label: 'UHAS official undergraduate admissions', url: 'https://uhas.edu.gh/uhas/admission/undergraduate-admissions', confidence: 'Official requirements; verify programme cut-off' },
    UNILAG: { label: 'UNILAG official admissions portal', url: 'https://admissions.unilag.edu.ng/', confidence: 'Official requirements; verify departmental cut-off' },
    UI: { label: 'University of Ibadan official admissions', url: 'https://admissions.ui.edu.ng/', confidence: 'Official requirements; verify departmental cut-off' },
    OAU: { label: 'OAU official admissions portal', url: 'https://eportal.oauife.edu.ng/', confidence: 'Official requirements; verify departmental cut-off' },
    UNN: { label: 'UNN official admissions', url: 'https://admissions.unn.edu.ng/', confidence: 'Official requirements; verify departmental cut-off' },
    ABU: { label: 'ABU official university site', url: 'https://abu.edu.ng/', confidence: 'Official requirements; verify departmental cut-off' },
    FUTA: { label: 'FUTA official university site', url: 'https://futa.edu.ng/', confidence: 'Official requirements; verify departmental cut-off' },
    UNILORIN: { label: 'UNILORIN official admissions portal', url: 'https://uilugportal.unilorin.edu.ng/', confidence: 'Official requirements; verify departmental cut-off' },
    LASU: { label: 'LASU official undergraduate admissions', url: 'https://lasu.edu.ng/home/undergraduate/', confidence: 'Official requirements; verify departmental cut-off' },
    UNIPORT: { label: 'UNIPORT official university site', url: 'https://www.uniport.edu.ng/', confidence: 'Official requirements; verify departmental cut-off' },
    UON: { label: 'University of Nairobi official admissions', url: 'https://www.uonbi.ac.ke/admission', confidence: 'Official requirements; verify programme cluster' },
    KU: { label: 'Kenyatta University official admissions', url: 'https://www.ku.ac.ke/index.php/admissions', confidence: 'Official requirements; verify programme cluster' },
    JKUAT: { label: 'JKUAT official admissions', url: 'https://www.jkuat.ac.ke/admissions/', confidence: 'Official requirements; verify programme cluster' },
    STRATHMORE: { label: 'Strathmore University official admissions', url: 'https://strathmore.edu/admissions/', confidence: 'Official requirements; verify programme cut-off' },
    WITS: { label: 'Wits official undergraduate admissions', url: 'https://www.wits.ac.za/undergraduate/', confidence: 'Official requirements; verify programme APS' },
    UCT: { label: 'UCT official eligibility requirements', url: 'https://www.uct.ac.za/students/applications-admission-requirements/eligibility-admission', confidence: 'Official requirements; verify programme APS' },
    STELLENBOSCH: { label: 'Stellenbosch official applications', url: 'https://www.sun.ac.za/english/maties/apply', confidence: 'Official requirements; verify programme APS' },
    PRETORIA: { label: 'University of Pretoria official applications', url: 'https://www.up.ac.za/online-application', confidence: 'Official requirements; verify programme APS' },
    UJ: { label: 'UJ official application requirements', url: 'https://www.uj.ac.za/about/about/internationalisation/international-students-2/applying-to-uj/', confidence: 'Official requirements; verify programme APS' },
    MAK: { label: 'Makerere official cut-off points', url: 'https://mak.ac.ug/study-mak/cut-points', confidence: 'Official annual cut-off table' },
    UDSM: { label: 'UDSM official undergraduate entry requirements', url: 'https://www.udsm.ac.tz/undergraduate/undergraduate-entry-requirements', confidence: 'Official requirements; verify programme points' }
  };

  function makeInstitution(id, label, country, system, cutoffs, overrides = {}, year = '2025/2026') {
    const source = officialSources[id];
    const courses = Object.fromEntries(eligibilityCourseCatalog.map(course => {
      const offset = system === 'WASSCE' || system === 'ACSEE' ? course.lowerOffset : course.higherOffset;
      const override = overrides[course.id];
      return [course.id, {
        label: course.label,
        category: course.category,
        baseline: override?.baseline ?? Math.max(1, cutoffs[course.category] + offset),
        basis: override ? 'Official programme cut-off' : 'Planning estimate derived from the institution profile'
      }];
    }));
    return { id, label, country, system, year, source, courses };
  }

  const eligibilityData = {
    WASSCE: {
      label: 'WASSCE aggregate',
      direction: 'lower',
      min: 1,
      max: 54,
      unit: 'aggregate points',
      hint: 'Lower aggregates are stronger.',
      institutions: [
        makeInstitution('UG', 'University of Ghana (UG Legon)', 'Ghana', 'WASSCE', { Health: 10, Tech: 12, Engineering: 15, Business: 18, Law: 8, 'Humanities & Sciences': 20 }, {
          medicine: { baseline: 8 },
          dentistry: { baseline: 10 },
          pharmacy: { baseline: 10 },
          nursing: { baseline: 15 },
          'medical-laboratory': { baseline: 12 },
          'computer-science': { baseline: 7 },
          'actuarial-science': { baseline: 11 },
          agriculture: { baseline: 22 },
          'llb-law': { baseline: 7 }
        }),
        makeInstitution('KNUST', 'Kwame Nkrumah University of Science and Technology (KNUST)', 'Ghana', 'WASSCE', { Health: 10, Tech: 14, Engineering: 16, Business: 20, Law: 10, 'Humanities & Sciences': 22 }),
        makeInstitution('UCC', 'University of Cape Coast (UCC)', 'Ghana', 'WASSCE', { Health: 12, Tech: 18, Engineering: 20, Business: 22, Law: 14, 'Humanities & Sciences': 24 }, {
          medicine: { baseline: 8 },
          pharmacy: { baseline: 9 },
          nursing: { baseline: 12 },
          'medical-laboratory': { baseline: 12 },
          'computer-science': { baseline: 15 },
          'actuarial-science': { baseline: 16 },
          agriculture: { baseline: 18 },
          'llb-law': { baseline: 12 },
          communications: { baseline: 17 },
          'finance-accounting': { baseline: 15 },
          marketing: { baseline: 20 },
          economics: { baseline: 16 }
        }),
        makeInstitution('UENR', 'University of Energy and Natural Resources (UENR)', 'Ghana', 'WASSCE', { Health: 16, Tech: 20, Engineering: 18, Business: 24, Law: 20, 'Humanities & Sciences': 26 }),
        makeInstitution('UPSA', 'University of Professional Studies, Accra (UPSA)', 'Ghana', 'WASSCE', { Health: 20, Tech: 22, Engineering: 25, Business: 24, Law: 16, 'Humanities & Sciences': 26 }),
        makeInstitution('UMaT', 'University of Mines and Technology (UMaT)', 'Ghana', 'WASSCE', { Health: 24, Tech: 22, Engineering: 20, Business: 28, Law: 24, 'Humanities & Sciences': 28 }),
        makeInstitution('UHAS', 'University of Health and Allied Sciences (UHAS)', 'Ghana', 'WASSCE', { Health: 12, Tech: 24, Engineering: 26, Business: 28, Law: 25, 'Humanities & Sciences': 30 })
      ]
    },
    JAMB: {
      label: 'JAMB UTME score',
      direction: 'higher',
      min: 0,
      max: 400,
      unit: 'points out of 400',
      hint: 'Higher scores are stronger; 300 points is 75% of 400.',
      institutions: [
        makeInstitution('UNILAG', 'University of Lagos (UNILAG)', 'Nigeria', 'JAMB', { Health: 300, Tech: 270, Engineering: 280, Business: 250, Law: 290, 'Humanities & Sciences': 230 }),
        makeInstitution('UI', 'University of Ibadan (UI)', 'Nigeria', 'JAMB', { Health: 290, Tech: 260, Engineering: 270, Business: 240, Law: 280, 'Humanities & Sciences': 220 }),
        makeInstitution('OAU', 'Obafemi Awolowo University (OAU)', 'Nigeria', 'JAMB', { Health: 290, Tech: 260, Engineering: 270, Business: 240, Law: 275, 'Humanities & Sciences': 220 }),
        makeInstitution('UNN', 'University of Nigeria, Nsukka (UNN)', 'Nigeria', 'JAMB', { Health: 285, Tech: 255, Engineering: 265, Business: 235, Law: 270, 'Humanities & Sciences': 215 }),
        makeInstitution('ABU', 'Ahmadu Bello University, Zaria (ABU)', 'Nigeria', 'JAMB', { Health: 275, Tech: 245, Engineering: 255, Business: 225, Law: 260, 'Humanities & Sciences': 205 }),
        makeInstitution('FUTA', 'Federal University of Technology, Akure (FUTA)', 'Nigeria', 'JAMB', { Health: 265, Tech: 250, Engineering: 260, Business: 220, Law: 220, 'Humanities & Sciences': 200 }),
        makeInstitution('UNILORIN', 'University of Ilorin (UNILORIN)', 'Nigeria', 'JAMB', { Health: 275, Tech: 250, Engineering: 260, Business: 225, Law: 260, 'Humanities & Sciences': 205 }),
        makeInstitution('LASU', 'Lagos State University (LASU)', 'Nigeria', 'JAMB', { Health: 280, Tech: 255, Engineering: 265, Business: 230, Law: 270, 'Humanities & Sciences': 210 }),
        makeInstitution('UNIPORT', 'University of Port Harcourt (UNIPORT)', 'Nigeria', 'JAMB', { Health: 280, Tech: 250, Engineering: 260, Business: 225, Law: 265, 'Humanities & Sciences': 205 })
      ]
    },
    KCSE: {
      label: 'KCSE / programme points',
      direction: 'higher',
      min: 0,
      max: 84,
      unit: 'points out of 84',
      hint: 'Higher KCSE and programme points are stronger; universities use subject clusters.',
      institutions: [
        makeInstitution('UON', 'University of Nairobi', 'Kenya', 'KCSE', { Health: 68, Tech: 62, Engineering: 64, Business: 58, Law: 65, 'Humanities & Sciences': 52 }),
        makeInstitution('KU', 'Kenyatta University', 'Kenya', 'KCSE', { Health: 64, Tech: 58, Engineering: 60, Business: 54, Law: 60, 'Humanities & Sciences': 50 }),
        makeInstitution('JKUAT', 'Jomo Kenyatta University of Agriculture and Technology (JKUAT)', 'Kenya', 'KCSE', { Health: 65, Tech: 60, Engineering: 62, Business: 55, Law: 58, 'Humanities & Sciences': 50 }),
        makeInstitution('STRATHMORE', 'Strathmore University', 'Kenya', 'KCSE', { Health: 60, Tech: 58, Engineering: 58, Business: 55, Law: 58, 'Humanities & Sciences': 50 })
      ]
    },
    APS: {
      label: 'South African APS score',
      direction: 'higher',
      min: 0,
      max: 45,
      unit: 'APS points',
      hint: 'Higher APS is stronger; subject marks and NBT requirements may also apply.',
      institutions: [
        makeInstitution('WITS', 'University of the Witwatersrand (Wits)', 'South Africa', 'APS', { Health: 42, Tech: 38, Engineering: 38, Business: 36, Law: 36, 'Humanities & Sciences': 32 }),
        makeInstitution('UCT', 'University of Cape Town (UCT)', 'South Africa', 'APS', { Health: 42, Tech: 38, Engineering: 38, Business: 36, Law: 38, 'Humanities & Sciences': 34 }),
        makeInstitution('STELLENBOSCH', 'Stellenbosch University', 'South Africa', 'APS', { Health: 41, Tech: 37, Engineering: 37, Business: 35, Law: 35, 'Humanities & Sciences': 31 }),
        makeInstitution('PRETORIA', 'University of Pretoria (UP)', 'South Africa', 'APS', { Health: 40, Tech: 36, Engineering: 36, Business: 34, Law: 34, 'Humanities & Sciences': 30 }),
        makeInstitution('UJ', 'University of Johannesburg (UJ)', 'South Africa', 'APS', { Health: 38, Tech: 34, Engineering: 34, Business: 30, Law: 32, 'Humanities & Sciences': 28 })
      ]
    },
    UACE: {
      label: 'UACE / A-Level points',
      direction: 'higher',
      min: 0,
      max: 20,
      unit: 'A-Level points',
      hint: 'Higher points are stronger; Makerere publishes fresh annual cut-off tables.',
      institutions: [
        makeInstitution('MAK', 'Makerere University', 'Uganda', 'UACE', { Health: 18, Tech: 16, Engineering: 16, Business: 14, Law: 16, 'Humanities & Sciences': 12 })
      ]
    },
    ACSEE: {
      label: 'ACSEE admission points',
      direction: 'lower',
      min: 1,
      max: 20,
      unit: 'admission points',
      hint: 'Lower points are stronger under the displayed planning scale.',
      institutions: [
        makeInstitution('UDSM', 'University of Dar es Salaam (UDSM)', 'Tanzania', 'ACSEE', { Health: 6, Tech: 8, Engineering: 8, Business: 10, Law: 9, 'Humanities & Sciences': 12 })
      ]
    }
  };

  function initEligibility() {
    const system = $('#eligibilitySystem');
    if (!system) return;
    const institutionSelect = $('#eligibilityInstitution');
    const courseSelect = $('#eligibilityCourse');
    const scoreInput = $('#eligibilityScore');
    if (!institutionSelect || !courseSelect) return;

    const replaceWithSearch = (select, listId, placeholder) => {
      const input = document.createElement('input');
      input.id = select.id;
      input.type = 'search';
      input.setAttribute('list', listId);
      input.autocomplete = 'off';
      input.placeholder = placeholder;
      input.className = select.className;
      input.setAttribute('aria-label', select.previousSibling?.textContent?.trim() || placeholder);
      select.replaceWith(input);
      return input;
    };

    const institution = replaceWithSearch(institutionSelect, 'eligibilityInstitutionOptions', 'Type to search universities');
    const course = replaceWithSearch(courseSelect, 'eligibilityCourseOptions', 'Type to search courses');
    const institutionList = document.createElement('datalist');
    institutionList.id = 'eligibilityInstitutionOptions';
    institution.after(institutionList);
    const courseList = document.createElement('datalist');
    courseList.id = 'eligibilityCourseOptions';
    course.after(courseList);

    const courseLabel = course.closest('label');
    if (courseLabel) {
      const categoryLabel = document.createElement('label');
      categoryLabel.className = 'text-sm font-semibold';
      categoryLabel.innerHTML = 'Course category<select id="eligibilityCategory" class="block mt-2 w-full bg-slate-50 border-2 border-slate-200 px-3 py-3 rounded-xl outline-none"><option value="All">All categories</option></select></label>';
      courseLabel.before(categoryLabel);
    }
    const category = $('#eligibilityCategory');
    const detailsHost = $('#eligibilityCard');
    if (detailsHost && !$('#eligibilitySource')) {
      detailsHost.insertAdjacentHTML('beforeend', '<div id="eligibilitySource" class="mt-6 border-t border-slate-200 pt-5 text-sm text-slate-600"></div><div id="eligibilityAlternatives" class="mt-4"></div>');
    }

    const getSystem = () => eligibilityData[system.value];
    const findInstitution = value => getSystem()?.institutions.find(item => item.id === value || item.label.toLowerCase() === value.trim().toLowerCase());
    const legacyCourseAliases = {
      medicine: 'medicine',
      'medicine & surgery': 'medicine',
      mbchb: 'medicine',
      mbbs: 'medicine',
      nursing: 'nursing',
      pharmacy: 'pharmacy',
      dentistry: 'dentistry',
      engineering: 'civil-engineering',
      'business administration': 'business-administration',
      law: 'llb-law',
      'llb law': 'llb-law'
    };
    const findCourse = (institutionData, value) => {
      const normalized = String(value || '').trim().toLowerCase();
      const alias = legacyCourseAliases[normalized];
      return institutionData?.courses[value] ||
        (alias && institutionData?.courses[alias]) ||
        Object.values(institutionData?.courses || {}).find(item => item.label.toLowerCase() === normalized);
    };
    const categories = ['All', ...new Set(eligibilityCourseCatalog.map(item => item.category))];
    category.innerHTML = categories.map(value => `<option value="${value}">${value === 'All' ? 'All categories' : value}</option>`).join('');

    const refreshInstitutions = () => {
      const details = getSystem();
      institutionList.innerHTML = details.institutions.map(item => `<option value="${item.label}"></option>`).join('');
      institution.value = details.institutions[0]?.label || '';
      refreshCourses();
    };
    const refreshCourses = () => {
      const institutionData = findInstitution(institution.value);
      const selectedCategory = category.value || 'All';
      const available = eligibilityCourseCatalog.filter(item => selectedCategory === 'All' || item.category === selectedCategory);
      courseList.innerHTML = available.map(item => `<option value="${item.label}"></option>`).join('');
      if (!available.some(item => item.label === course.value)) course.value = available[0]?.label || '';
      if (institutionData) {
        const selected = findCourse(institutionData, course.value);
        course.value = selected?.label || available[0]?.label || '';
      }
    };
    const renderAlternatives = (details, institutionData, selectedCourse, score) => {
      const easier = Object.values(institutionData.courses)
        .filter(item => item.label !== selectedCourse.label)
        .filter(item => details.direction === 'higher' ? item.baseline <= score : item.baseline >= score)
        .sort((a, b) => details.direction === 'higher' ? a.baseline - b.baseline : b.baseline - a.baseline)
        .slice(0, 3);
      if (!easier.length) {
        set('#eligibilityAlternatives', '');
        return;
      }
      $('#eligibilityAlternatives').innerHTML = `<p class="font-bold text-slate-800">Alternative programmes at this university</p><ul class="mt-2 space-y-1">${easier.map(item => `<li><span class="font-semibold">${item.label}</span> <span class="text-slate-500">(${item.category}; baseline ${item.baseline})</span></li>`).join('')}</ul>`;
    };
    const resetResult = message => {
      set('#eligibilityStatus', 'Enter your score');
      set('#eligibilityMessage', message);
      set('#eligibilitySource', '');
      set('#eligibilityAlternatives', '');
      if (detailsHost) {
        detailsHost.dataset.status = '';
        const statusNode = $('#eligibilityStatus');
        if (statusNode) statusNode.className = 'text-4xl font-extrabold text-slate-900 my-5';
      }
    };
    const calculate = () => {
      const details = getSystem();
      const institutionData = findInstitution(institution.value);
      const selectedCourse = findCourse(institutionData, course.value);
      const raw = scoreInput?.value.trim() || '';
      if (!institutionData || !selectedCourse) return resetResult('Choose a university and course from the search suggestions.');
      if (raw === '') return resetResult(`Enter your ${details.label.toLowerCase()} to compare it with the selected planning baseline.`);
      const score = Number(raw);
      if (!Number.isFinite(score) || score < details.min || score > details.max) {
        return resetResult(`${details.label} must be between ${details.min} and ${details.max} ${details.unit}.`);
      }
      const threshold = selectedCourse.baseline;
      const margin = details.direction === 'higher' ? score - threshold : threshold - score;
      let status;
      let advice;
      if (margin >= 2) {
        status = 'High Admission Chance';
        advice = `Your score exceeds this planning baseline by ${margin} point${margin === 1 ? '' : 's'}. Confirm subject prerequisites, application dates, and the current official cut-off before applying.`;
      } else if (margin >= 0) {
        status = 'Borderline / Highly Competitive';
        advice = `Your score meets the displayed baseline, but the margin is less than 2 points. Cut-offs can move yearly with quotas, demand, and programme capacity.`;
      } else {
        status = 'Below Estimated Cut-off';
        advice = `Your score is ${Math.abs(margin)} point${Math.abs(margin) === 1 ? '' : 's'} weaker than this estimate. Review the alternative programmes below and verify their requirements at the same university.`;
      }
      set('#eligibilityStatus', status);
      set('#eligibilityMessage', `${details.label}: ${score} · ${institutionData.label} · ${selectedCourse.label} baseline: ${threshold}. ${advice}`);
      const source = institutionData.source;
      const sourceNode = $('#eligibilitySource');
      if (sourceNode) sourceNode.innerHTML = `Source: <a class="text-teal-700 underline hover:text-teal-900" href="${source.url}" target="_blank" rel="noopener">${source.label}</a> · ${selectedCourse.basis}; ${source.confidence} · ${institutionData.year}.`;
      renderAlternatives(details, institutionData, selectedCourse, score);
      if (detailsHost) detailsHost.dataset.status = status === 'High Admission Chance' ? 'high-chance' : status === 'Borderline / Highly Competitive' ? 'competitive' : 'below-threshold';
      const statusNode = $('#eligibilityStatus');
      if (statusNode) statusNode.className = `inline-block rounded-xl px-4 py-2 text-2xl sm:text-3xl font-extrabold my-5 ${detailsHost.dataset.status === 'high-chance' ? 'bg-emerald-100 text-emerald-800' : detailsHost.dataset.status === 'competitive' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`;
    };
    system.addEventListener('change', () => { scoreInput?.setAttribute('placeholder', `${getSystem().min}–${getSystem().max}`); refreshInstitutions(); resetResult('Your comparison and next-step advice will appear here.'); });
    institution.addEventListener('input', () => { refreshCourses(); });
    institution.addEventListener('change', () => { refreshCourses(); });
    category.addEventListener('change', () => { refreshCourses(); });
    $('#eligibilityCalculate')?.addEventListener('click', calculate);
    system.value = system.value || 'JAMB';
    refreshInstitutions();
    scoreInput?.setAttribute('min', getSystem().min);
    scoreInput?.setAttribute('max', getSystem().max);
  }

  /* -------------------------------------------------------------------------
   * TVET NC(V) Pass & Aggregate Calculator
   * ------------------------------------------------------------------------- */
  function initNcvCalculator() {
    const calcBtn = $('#ncvCalculate');
    if (!calcBtn) return;

    const calculate = () => {
      const getNum = id => {
        const val = $(id)?.value.trim();
        return val === '' ? null : Number(val);
      };

      const langIcass = getNum('#ncvLangIcass');
      const langExam = getNum('#ncvLangExam');
      const loIcass = getNum('#ncvLoIcass');
      const loExam = getNum('#ncvLoExam');
      const mathIcass = getNum('#ncvMathIcass');
      const mathExam = getNum('#ncvMathExam');

      const vocs = [1, 2, 3, 4].map(num => ({
        name: $(`#ncvVoc${num}Name`)?.value || `Vocational Subject ${num}`,
        icass: getNum(`#ncvVoc${num}Icass`),
        isat: getNum(`#ncvVoc${num}Isat`),
        exam: getNum(`#ncvVoc${num}Exam`)
      }));

      // Validation
      const fundamentalInputs = [langIcass, langExam, loIcass, loExam, mathIcass, mathExam];
      const hasMissingFundamental = fundamentalInputs.some(v => v === null || Number.isNaN(v) || v < 0 || v > 100);
      const hasMissingVoc = vocs.some(v => v.icass === null || v.isat === null || v.exam === null || Number.isNaN(v.icass) || Number.isNaN(v.isat) || Number.isNaN(v.exam) || v.icass < 0 || v.icass > 100 || v.isat < 0 || v.isat > 100 || v.exam < 0 || v.exam > 100);

      if (hasMissingFundamental || hasMissingVoc) {
        set('#ncvResult', 'Incomplete Marks');
        set('#ncvStatusBadge', 'Please fill all fields');
        const badge = $('#ncvStatusBadge');
        if (badge) badge.className = 'inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-100 text-rose-800 mb-4';
        set('#ncvMessage', 'Please provide marks (0–100%) for all 3 fundamental and 4 vocational subjects.');
        return;
      }

      // Calculations
      const langFinal = (langIcass * 0.5) + (langExam * 0.5);
      const loFinal = (loIcass * 0.5) + (loExam * 0.5);
      const mathFinal = (mathIcass * 0.5) + (mathExam * 0.5);

      const langPass = langFinal >= 40;
      const loPass = loFinal >= 40;
      const mathPass = mathFinal >= 30;

      const vocResults = vocs.map(v => {
        const finalMark = (v.icass * 0.25) + (v.isat * 0.25) + (v.exam * 0.5);
        return {
          ...v,
          finalMark,
          passed: finalMark >= 50
        };
      });

      const vocAvg = vocResults.reduce((acc, curr) => acc + curr.finalMark, 0) / 4;
      const passedVocCount = vocResults.filter(v => v.passed).length;
      const allPassed = langPass && loPass && mathPass && passedVocCount === 4;

      const level = $('#ncvLevel')?.value || '4';

      set('#ncvResult', `${allPassed ? 'QUALIFIED (PASS)' : 'INCOMPLETE'}`);
      const badge = $('#ncvStatusBadge');
      if (badge) {
        badge.textContent = allPassed ? `Full NC(V) Level ${level} Pass` : `${7 - ( (langPass?1:0) + (loPass?1:0) + (mathPass?1:0) + passedVocCount )} Subject(s) Need Rewrite`;
        badge.className = `inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-4 ${allPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`;
      }

      // Render breakdown list
      const listEl = $('#ncvBreakdownList');
      if (listEl) {
        listEl.innerHTML = `
          <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <div class="flex justify-between font-bold text-slate-900">
              <span>Vocational Aggregate Average:</span>
              <span class="text-teal-800">${vocAvg.toFixed(1)}%</span>
            </div>
          </div>
          <div class="space-y-1.5 pt-2">
            <div class="flex justify-between p-2 rounded bg-slate-50">
              <span>Language: <strong>${langFinal.toFixed(1)}%</strong> (Min 40%)</span>
              <span class="font-bold ${langPass ? 'text-emerald-600' : 'text-rose-600'}">${langPass ? '✓ PASS' : '✗ FAIL'}</span>
            </div>
            <div class="flex justify-between p-2 rounded bg-slate-50">
              <span>Life Orientation: <strong>${loFinal.toFixed(1)}%</strong> (Min 40%)</span>
              <span class="font-bold ${loPass ? 'text-emerald-600' : 'text-rose-600'}">${loPass ? '✓ PASS' : '✗ FAIL'}</span>
            </div>
            <div class="flex justify-between p-2 rounded bg-slate-50">
              <span>Mathematics: <strong>${mathFinal.toFixed(1)}%</strong> (Min 30%)</span>
              <span class="font-bold ${mathPass ? 'text-emerald-600' : 'text-rose-600'}">${mathPass ? '✓ PASS' : '✗ FAIL'}</span>
            </div>
            ${vocResults.map((v, i) => `
              <div class="flex justify-between p-2 rounded bg-slate-50">
                <span class="truncate max-w-[200px]">${v.name}: <strong>${v.finalMark.toFixed(1)}%</strong> (Min 50%)</span>
                <span class="font-bold ${v.passed ? 'text-emerald-600' : 'text-rose-600'}">${v.passed ? '✓ PASS' : '✗ FAIL'}</span>
              </div>
            `).join('')}
          </div>
        `;
      }

      set('#ncvMessage', allPassed
        ? `Congratulations! You have satisfied all fundamental (Language, LO, Math) and vocational criteria for your NC(V) Level ${level} certificate.`
        : `Under Umalusi guidelines, credits for passed subjects are retained permanently. You only need to rewrite subjects marked as failed.`
      );
    };

    calcBtn.addEventListener('click', calculate);

    $('#ncvReset')?.addEventListener('click', () => {
      $$('.ncv-input').forEach(input => { input.value = ''; });
      set('#ncvResult', 'Enter marks to calculate');
      set('#ncvStatusBadge', 'Awaiting Calculation');
      const badge = $('#ncvStatusBadge');
      if (badge) badge.className = 'inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-600 mb-4';
      set('#ncvBreakdownList', '<p class="text-slate-500">Subject results, vocational aggregate, and certification eligibility will appear here.</p>');
      set('#ncvMessage', 'Enter all 3 fundamental and 4 vocational marks. All calculations are executed privately in your browser memory.');
    });

    $('#ncvShareWhatsApp')?.addEventListener('click', () => {
      const res = $('#ncvResult')?.textContent || '';
      const textToShare = `My South African TVET NC(V) Pass Calculation: ${res}. Calculated on AfriWidget: https://afriwidget.com/tvet-ncv-pass-calculator`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare)}`, '_blank');
    });

    $('#ncvCopyResult')?.addEventListener('click', () => {
      const res = $('#ncvResult')?.textContent || '';
      const msg = $('#ncvMessage')?.textContent || '';
      navigator.clipboard?.writeText(`TVET NC(V) Status: ${res}\n${msg}\nhttps://afriwidget.com/tvet-ncv-pass-calculator`);
      const copyBtn = $('#ncvCopyResult');
      if (copyBtn) {
        const orig = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => { copyBtn.textContent = orig; }, 2000);
      }
    });
  }

  /* -------------------------------------------------------------------------
   * TVET Exam Target Mark Calculator
   * ------------------------------------------------------------------------- */
  function initTargetMarkCalculator() {
    const calcBtn = $('#targetCalculate');
    const streamSel = $('#streamSelect');
    if (!calcBtn || !streamSel) return;

    const toggleIsat = () => {
      const isatWrapper = $('#isatWrapper');
      if (isatWrapper) {
        if (streamSel.value === 'ncv_voc') {
          isatWrapper.classList.remove('hidden');
        } else {
          isatWrapper.classList.add('hidden');
        }
      }
    };

    streamSel.addEventListener('change', toggleIsat);
    toggleIsat();

    const slider = $('#customTarget');
    slider?.addEventListener('input', () => {
      set('#customTargetValue', `${slider.value}% (${Number(slider.value) >= 75 ? 'Distinction' : Number(slider.value) >= 60 ? 'Good Pass' : 'Standard Pass'})`);
    });

    const getFeasibility = (needed, submin = 40) => {
      const effective = Math.max(needed, submin);
      if (effective > 100) return { label: 'Unreachable (>100%)', badge: 'bg-rose-100 text-rose-800' };
      if (effective >= 80) return { label: 'Intense Revision (80-100%)', badge: 'bg-orange-100 text-orange-800' };
      if (effective >= 65) return { label: 'Challenging (65-79%)', badge: 'bg-amber-100 text-amber-800' };
      if (effective >= 50) return { label: 'Realistic (50-64%)', badge: 'bg-emerald-100 text-emerald-800' };
      return { label: 'Highly Achievable (<=49%)', badge: 'bg-emerald-100 text-emerald-800' };
    };

    const calculate = () => {
      const icassRaw = $('#targetIcass')?.value.trim();
      const isatRaw = $('#targetIsat')?.value.trim();
      const stream = streamSel.value;
      const customGoal = Number(slider?.value || 50);

      if (!icassRaw || Number.isNaN(Number(icassRaw))) {
        set('#targetResult', 'Enter ICASS');
        set('#targetMessage', 'Please enter your current ICASS percentage (0–100%).');
        return;
      }

      const icass = Number(icassRaw);
      const isat = isatRaw ? Number(isatRaw) : 0;

      // Tier targets: 40% (or 50% for voc), 50%, 60%, 75%
      const goals = stream === 'ncv_voc'
        ? [ { label: '50% Minimum Pass', target: 50 }, { label: '60% Good Pass', target: 60 }, { label: '70% Merit Pass', target: 70 }, { label: '75% Distinction', target: 75 } ]
        : [ { label: '40% Minimum Pass', target: 40 }, { label: '50% Standard Pass', target: 50 }, { label: '60% Good Pass', target: 60 }, { label: '75% Distinction', target: 75 } ];

      // Compute needed exam for any target
      const getNeeded = (targetVal) => {
        if (stream === 'nated') {
          // target = (icass * 0.4) + (exam * 0.6)
          const needed = (targetVal - (icass * 0.4)) / 0.6;
          return { needed, subminApplied: needed < 40 };
        } else if (stream === 'ncv_voc') {
          // target = (icass * 0.25) + (isat * 0.25) + (exam * 0.5)
          const needed = (targetVal - (icass * 0.25) - (isat * 0.25)) / 0.5;
          return { needed, subminApplied: false };
        } else {
          // 50% icass + 50% exam
          const needed = (targetVal - (icass * 0.5)) / 0.5;
          return { needed, subminApplied: false };
        }
      };

      const customCalc = getNeeded(customGoal);
      const displayCustomNeeded = stream === 'nated' ? Math.max(40, customCalc.needed) : Math.max(0, customCalc.needed);
      const customFeas = getFeasibility(displayCustomNeeded, stream === 'nated' ? 40 : 0);

      set('#targetResult', `${displayCustomNeeded > 100 ? '> 100%' : displayCustomNeeded.toFixed(1) + '%'}`);
      const badge = $('#targetFeasibilityBadge');
      if (badge) {
        badge.textContent = customFeas.label;
        badge.className = `inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-4 ${customFeas.badge}`;
      }

      // Render table
      const tbody = $('#targetTableBody');
      if (tbody) {
        tbody.innerHTML = goals.map(g => {
          const calc = getNeeded(g.target);
          const effective = stream === 'nated' ? Math.max(40, calc.needed) : Math.max(0, calc.needed);
          const feas = getFeasibility(effective, stream === 'nated' ? 40 : 0);
          return `
            <tr>
              <td class="p-2.5 font-bold">${g.label}</td>
              <td class="p-2.5 font-extrabold ${effective > 100 ? 'text-rose-600' : 'text-slate-900'}">
                ${effective > 100 ? 'Unreachable' : effective.toFixed(1) + '%'}
                ${calc.subminApplied ? '<span class="text-[10px] text-amber-600 block">(40% DHET Sub-min)</span>' : ''}
              </td>
              <td class="p-2.5"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${feas.badge}">${feas.label.split(' ')[0]}</span></td>
            </tr>
          `;
        }).join('');
      }

      set('#targetMessage', `For your target of ${customGoal}%, you need at least ${displayCustomNeeded > 100 ? 'over 100% (unreachable)' : displayCustomNeeded.toFixed(1) + '%'} in the national exam. ${stream === 'nated' ? 'Note: The DHET 40% sub-minimum rule is strictly enforced.' : ''}`);
    };

    calcBtn.addEventListener('click', calculate);

    $('#targetReset')?.addEventListener('click', () => {
      $('#targetIcass').value = '';
      if ($('#targetIsat')) $('#targetIsat').value = '';
      set('#targetResult', 'Enter ICASS to see targets');
      set('#targetFeasibilityBadge', 'Awaiting Calculation');
      const badge = $('#targetFeasibilityBadge');
      if (badge) badge.className = 'inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-600 mb-4';
      set('#targetMessage', 'Enter your ICASS mark. The DHET sub-minimum of 40% will automatically be enforced on all examination targets.');
    });

    $('#targetShareWhatsApp')?.addEventListener('click', () => {
      const res = $('#targetResult')?.textContent || '';
      const textToShare = `My DHET TVET Exam Target Mark: ${res}. Plan your exam goals with AfriWidget: https://afriwidget.com/tvet-exam-target-mark-calculator`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare)}`, '_blank');
    });

    $('#targetCopyResult')?.addEventListener('click', () => {
      const res = $('#targetResult')?.textContent || '';
      const msg = $('#targetMessage')?.textContent || '';
      navigator.clipboard?.writeText(`TVET Target Mark: ${res}\n${msg}\nhttps://afriwidget.com/tvet-exam-target-mark-calculator`);
      const copyBtn = $('#targetCopyResult');
      if (copyBtn) {
        const orig = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => { copyBtn.textContent = orig; }, 2000);
      }
    });
  }

  /* -------------------------------------------------------------------------
   * NSFAS TVET Allowance Estimator
   * ------------------------------------------------------------------------- */
  function initNsfasCalculator() {
    const calcBtn = $('#nsfasCalculate');
    if (!calcBtn) return;

    const calculate = () => {
      const instType = $('#nsfasInstType')?.value || 'tvet_ncv';
      const livingType = $('#nsfasLivingType')?.value || 'home';
      const months = Number($('#nsfasMonths')?.value || 10);

      // Rates (annualized / monthly)
      const isUniv = instType === 'university';
      const personalCareMonthly = isUniv ? 1650 : 304.50;
      const personalCareAnnual = personalCareMonthly * months;

      let accomMonthly = 0;
      let travelMonthly = 0;

      if (livingType === 'home') {
        travelMonthly = isUniv ? 1065 : 800;
      } else if (livingType === 'accredited_urban') {
        accomMonthly = isUniv ? 5000 : 4500;
      } else if (livingType === 'accredited_rural') {
        accomMonthly = isUniv ? 4000 : 3600;
      } else if (livingType === 'campus_res') {
        accomMonthly = isUniv ? 4200 : 3800;
      }

      const accomAnnual = accomMonthly * months;
      const travelAnnual = travelMonthly * months;

      const directStudentMonthly = personalCareMonthly + travelMonthly;
      const totalAnnualPackage = personalCareAnnual + accomAnnual + travelAnnual;

      set('#nsfasResult', `R${totalAnnualPackage.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / year`);
      set('#nsfasMonthlyBadge', `Direct Monthly Cash: R${directStudentMonthly.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / month`);

      set('#nsfasPersonalCareVal', `R${personalCareAnnual.toLocaleString('en-ZA', { minimumFractionDigits: 2 })} (R${personalCareMonthly.toFixed(2)}/mo)`);
      set('#nsfasAccomVal', accomAnnual > 0 ? `R${accomAnnual.toLocaleString('en-ZA', { minimumFractionDigits: 2 })} (Capped to Landlord)` : 'R0.00 (Living at Home)');
      set('#nsfasTravelVal', travelAnnual > 0 ? `R${travelAnnual.toLocaleString('en-ZA', { minimumFractionDigits: 2 })} (R${travelMonthly.toFixed(2)}/mo)` : 'R0.00 (In Accommodation)');
      set('#nsfasMaterialsVal', isUniv ? 'R5,460.00 / year' : 'Provided by TVET College');

      set('#nsfasMessage', `Estimated for a ${months}-month cycle. Direct cash to your bank/wallet is R${directStudentMonthly.toFixed(2)}/month. 100% of college tuition is paid directly to your institution.`);
    };

    calcBtn.addEventListener('click', calculate);
    calculate(); // auto-run on load

    $('#nsfasReset')?.addEventListener('click', () => {
      $('#nsfasInstType').value = 'tvet_ncv';
      $('#nsfasLivingType').value = 'home';
      $('#nsfasMonths').value = '10';
      calculate();
    });

    $('#nsfasShareWhatsApp')?.addEventListener('click', () => {
      const res = $('#nsfasResult')?.textContent || '';
      const textToShare = `My Estimated NSFAS Allowance Package: ${res}. Calculate your TVET allowance on AfriWidget: https://afriwidget.com/nsfas-tvet-allowance-calculator`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare)}`, '_blank');
    });

    $('#nsfasCopyResult')?.addEventListener('click', () => {
      const res = $('#nsfasResult')?.textContent || '';
      const msg = $('#nsfasMessage')?.textContent || '';
      navigator.clipboard?.writeText(`NSFAS Allowance Breakdown: ${res}\n${msg}\nhttps://afriwidget.com/nsfas-tvet-allowance-calculator`);
      const copyBtn = $('#nsfasCopyResult');
      if (copyBtn) {
        const orig = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => { copyBtn.textContent = orig; }, 2000);
      }
    });
  }

  /* -------------------------------------------------------------------------
   * Matric SBA + Final Exam Pass Calculator
   * ------------------------------------------------------------------------- */
  function initMatricSbaExamCalculator() {
    const calcBtn = $('#matricCalculate');
    if (!calcBtn) return;

    const getApsPoints = (pct) => {
      if (pct >= 80) return { level: 7, points: 7, label: 'Outstanding' };
      if (pct >= 70) return { level: 6, points: 6, label: 'Meritorious' };
      if (pct >= 60) return { level: 5, points: 5, label: 'Substantial' };
      if (pct >= 50) return { level: 4, points: 4, label: 'Adequate' };
      if (pct >= 40) return { level: 3, points: 3, label: 'Moderate' };
      if (pct >= 30) return { level: 2, points: 2, label: 'Elementary' };
      return { level: 1, points: 1, label: 'Not Achieved' };
    };

    const calculate = () => {
      const getNum = id => {
        const val = $(id)?.value.trim();
        return val === '' ? null : Number(val);
      };

      const hlSba = getNum('#matricHlSba');
      const hlExam = getNum('#matricHlExam');
      const falSba = getNum('#matricFalSba');
      const falExam = getNum('#matricFalExam');
      const mathSba = getNum('#matricMathSba');
      const mathExam = getNum('#matricMathExam');
      const loScore = getNum('#matricLoScore');

      const elec1Name = $('#matricElec1Name')?.value || 'Elective Subject 1';
      const elec1Sba = getNum('#matricElec1Sba');
      const elec1Exam = getNum('#matricElec1Exam');

      const elec2Name = $('#matricElec2Name')?.value || 'Elective Subject 2';
      const elec2Sba = getNum('#matricElec2Sba');
      const elec2Exam = getNum('#matricElec2Exam');

      const elec3Name = $('#matricElec3Name')?.value || 'Elective Subject 3';
      const elec3Sba = getNum('#matricElec3Sba');
      const elec3Exam = getNum('#matricElec3Exam');

      const allInputs = [hlSba, hlExam, falSba, falExam, mathSba, mathExam, loScore, elec1Sba, elec1Exam, elec2Sba, elec2Exam, elec3Sba, elec3Exam];
      if (allInputs.some(v => v === null || Number.isNaN(v) || v < 0 || v > 100)) {
        set('#matricResult', 'Incomplete Marks');
        set('#matricPassBadge', 'Please fill all 7 subjects');
        const badge = $('#matricPassBadge');
        if (badge) badge.className = 'inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-100 text-rose-800 mb-4';
        set('#matricMessage', 'Please provide SBA (25%) and Final Exam (75%) marks for all 7 Grade 12 subjects.');
        return;
      }

      // Compute final marks (25% SBA + 75% Exam)
      const hlFinal = Math.round((hlSba * 0.25) + (hlExam * 0.75));
      const falFinal = Math.round((falSba * 0.25) + (falExam * 0.75));
      const mathFinal = Math.round((mathSba * 0.25) + (mathExam * 0.75));
      const loFinal = Math.round(loScore); // 100% CAT/SBA
      const e1Final = Math.round((elec1Sba * 0.25) + (elec1Exam * 0.75));
      const e2Final = Math.round((elec2Sba * 0.25) + (elec2Exam * 0.75));
      const e3Final = Math.round((elec3Sba * 0.25) + (elec3Exam * 0.75));

      const subjects = [
        { name: 'Home Language', mark: hlFinal, isHl: true, isLo: false },
        { name: 'First Add Language', mark: falFinal, isHl: false, isLo: false },
        { name: 'Mathematics / Math Lit', mark: mathFinal, isHl: false, isLo: false },
        { name: 'Life Orientation', mark: loFinal, isHl: false, isLo: true },
        { name: elec1Name, mark: e1Final, isHl: false, isLo: false },
        { name: elec2Name, mark: e2Final, isHl: false, isLo: false },
        { name: elec3Name, mark: e3Final, isHl: false, isLo: false }
      ].map(s => ({
        ...s,
        aps: getApsPoints(s.mark)
      }));

      // Calculate Total APS (excluding LO or including LO - SA standard counts 6 subjects + LO points)
      const totalAps = subjects.reduce((sum, s) => sum + s.aps.points, 0);

      // Determine Umalusi Pass Level
      // Non-LO subjects
      const nonLo = subjects.filter(s => !s.isLo);
      const countAtOrAbove = (thresh) => nonLo.filter(s => s.mark >= thresh).length;

      let passCategory = 'NSC Not Achieved (Fail)';
      let badgeClass = 'bg-rose-100 text-rose-800';

      const hlPass40 = hlFinal >= 40;
      const count50 = countAtOrAbove(50);
      const count40 = countAtOrAbove(40);
      const count30 = countAtOrAbove(30);

      if (hlPass40 && count50 >= 4 && count30 >= 6) {
        passCategory = "Bachelor's Degree Pass (B.Deg)";
        badgeClass = 'bg-emerald-100 text-emerald-800';
      } else if (hlPass40 && count40 >= 4 && count30 >= 6) {
        passCategory = 'Diploma Pass (Dip)';
        badgeClass = 'bg-teal-100 text-teal-800';
      } else if (hlPass40 && count40 >= 2 && count30 >= 5) {
        passCategory = 'Higher Certificate Pass (HC)';
        badgeClass = 'bg-amber-100 text-amber-800';
      } else if (hlPass40 && count30 >= 4) {
        passCategory = 'Senior Certificate Pass (NSC Standard)';
        badgeClass = 'bg-blue-100 text-blue-800';
      }

      set('#matricResult', passCategory);
      set('#matricApsVal', `${totalAps} APS Points`);

      const badge = $('#matricPassBadge');
      if (badge) {
        badge.textContent = passCategory.split(' (')[0];
        badge.className = `inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-4 ${badgeClass}`;
      }

      // Render subject list
      const listEl = $('#matricSubjectList');
      if (listEl) {
        listEl.innerHTML = subjects.map(s => `
          <div class="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
            <span class="font-medium text-slate-800 truncate max-w-[190px]">${s.name}</span>
            <div class="text-right">
              <span class="font-bold text-slate-900">${s.mark}%</span>
              <span class="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-200 font-bold text-slate-700">L${s.aps.level} (${s.aps.points} pts)</span>
            </div>
          </div>
        `).join('');
      }

      set('#matricMessage', passCategory.includes('Bachelor')
        ? `Outstanding achievement! Your marks qualify for University Bachelor's Degree admission with ${totalAps} cumulative APS points.`
        : `Your marks qualify for ${passCategory}. Check faculty prerequisites and minimum APS cut-offs on individual tertiary portals.`
      );
    };

    calcBtn.addEventListener('click', calculate);

    $('#matricReset')?.addEventListener('click', () => {
      $$('.matric-input').forEach(input => { input.value = ''; });
      set('#matricResult', 'Enter marks to calculate');
      set('#matricPassBadge', 'Awaiting Calculation');
      set('#matricApsVal', '0 Points');
      const badge = $('#matricPassBadge');
      if (badge) badge.className = 'inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-600 mb-4';
      set('#matricSubjectList', '<p class="text-slate-500">Subject final percentages (25% SBA + 75% Exam) and NSC levels will display here.</p>');
      set('#matricMessage', 'Enter your term SBA and predicted/trial exam marks. All data is processed privately in your browser.');
    });

    $('#matricShareWhatsApp')?.addEventListener('click', () => {
      const res = $('#matricResult')?.textContent || '';
      const aps = $('#matricApsVal')?.textContent || '';
      const textToShare = `My Matric SBA + Exam Pass Status: ${res} (${aps}). Calculate your Matric level with AfriWidget: https://afriwidget.com/matric-sba-exam-calculator`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare)}`, '_blank');
    });

    $('#matricCopyResult')?.addEventListener('click', () => {
      const res = $('#matricResult')?.textContent || '';
      const aps = $('#matricApsVal')?.textContent || '';
      const msg = $('#matricMessage')?.textContent || '';
      navigator.clipboard?.writeText(`Matric Result: ${res} (${aps})\n${msg}\nhttps://afriwidget.com/matric-sba-exam-calculator`);
      const copyBtn = $('#matricCopyResult');
      if (copyBtn) {
        const orig = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => { copyBtn.textContent = orig; }, 2000);
      }
    });
  }

  function getApsPointsFromPercentage(mark) {
    if (mark === null || mark === undefined || isNaN(mark)) return 0;
    if (mark >= 80) return 7;
    if (mark >= 70) return 6;
    if (mark >= 60) return 5;
    if (mark >= 50) return 4;
    if (mark >= 40) return 3;
    if (mark >= 30) return 2;
    return mark > 0 ? 1 : 0;
  }

  function initSaUniversityAdmissionCalculator() {
    const checkBtn = $('#saUniCheckBtn');
    if (!checkBtn) return;

    const calculate = () => {
      const targetUni = $('#saUniTarget')?.value || 'all';
      const faculty = $('#saFacultyStream')?.value || 'sci';
      const engType = $('#saSubEnglishType')?.value || 'HL';
      const mathsType = $('#saSubMathsType')?.value || 'MATH';

      const rawEng = $('#saMarkEnglish')?.value.trim();
      const rawMaths = $('#saMarkMaths')?.value.trim();
      const rawPhys = $('#saMarkPhysics')?.value.trim();
      const rawLife = $('#saMarkLifeSci')?.value.trim();
      const rawEl1 = $('#saMarkElective1')?.value.trim();
      const rawEl2 = $('#saMarkElective2')?.value.trim();
      const rawLO = $('#saMarkLO')?.value.trim();

      if (!rawEng || !rawMaths) {
        set('#saApsDisplay', '—');
        set('#saPassLevelBadge', 'Please enter English and Mathematics marks');
        set('#saVerdictSummary', 'Enter your percentage marks for English, Mathematics, and your other NSC subjects to calculate admission chances.');
        return;
      }

      const engMark = Math.min(100, Math.max(0, Number(rawEng) || 0));
      const mathsMark = Math.min(100, Math.max(0, Number(rawMaths) || 0));
      const physMark = rawPhys !== '' ? Math.min(100, Math.max(0, Number(rawPhys) || 0)) : null;
      const lifeMark = rawLife !== '' ? Math.min(100, Math.max(0, Number(rawLife) || 0)) : null;
      const el1Mark = rawEl1 !== '' ? Math.min(100, Math.max(0, Number(rawEl1) || 0)) : null;
      const el2Mark = rawEl2 !== '' ? Math.min(100, Math.max(0, Number(rawEl2) || 0)) : null;
      const loMark = rawLO !== '' ? Math.min(100, Math.max(0, Number(rawLO) || 0)) : null;

      // Compile subject list for 6-subject calculation
      const subjects = [
        { name: 'English', mark: engMark, pts: getApsPointsFromPercentage(engMark) },
        { name: 'Mathematics', mark: mathsMark, pts: getApsPointsFromPercentage(mathsMark) }
      ];

      if (physMark !== null) subjects.push({ name: 'Physical Sciences', mark: physMark, pts: getApsPointsFromPercentage(physMark) });
      if (lifeMark !== null) subjects.push({ name: 'Life Sciences', mark: lifeMark, pts: getApsPointsFromPercentage(lifeMark) });
      if (el1Mark !== null) subjects.push({ name: 'Elective 1', mark: el1Mark, pts: getApsPointsFromPercentage(el1Mark) });
      if (el2Mark !== null) subjects.push({ name: 'Elective 2', mark: el2Mark, pts: getApsPointsFromPercentage(el2Mark) });

      // Sort remaining non-core subjects by highest points
      const core = subjects.slice(0, 2);
      const electives = subjects.slice(2).sort((a, b) => b.pts - a.pts);
      const top6 = core.concat(electives.slice(0, 4));

      const totalAps = top6.reduce((sum, s) => sum + s.pts, 0);

      // Life Orientation points (if university evaluates LO e.g. UJ)
      let loPts = 0;
      if (loMark !== null) {
        if (targetUni === 'uj') {
          if (loMark >= 80) loPts = 4;
          else if (loMark >= 70) loPts = 3;
          else if (loMark >= 60) loPts = 2;
          else if (loMark >= 50) loPts = 1;
        } else if (targetUni !== 'up' && targetUni !== 'su' && targetUni !== 'wits') {
          loPts = getApsPointsFromPercentage(loMark);
        }
      }

      // Check Statutory Pass Level
      const allMarks = [engMark, mathsMark];
      if (physMark !== null) allMarks.push(physMark);
      if (lifeMark !== null) allMarks.push(lifeMark);
      if (el1Mark !== null) allMarks.push(el1Mark);
      if (el2Mark !== null) allMarks.push(el2Mark);
      if (loMark !== null) allMarks.push(loMark);

      const countL4 = allMarks.filter(m => m >= 50).length;
      const countL3 = allMarks.filter(m => m >= 40).length;
      const countL2 = allMarks.filter(m => m >= 30).length;

      let passCategory = 'National Senior Certificate Pass';
      if (engMark >= 40 && countL4 >= 4 && countL2 >= 2) {
        passCategory = "Bachelor's Degree Pass (B.Deg)";
      } else if (engMark >= 40 && countL3 >= 4 && countL2 >= 2) {
        passCategory = 'Diploma Pass (Dip)';
      } else if (engMark >= 40 && countL3 >= 2 && countL2 >= 3) {
        passCategory = 'Higher Certificate Pass (HC)';
      }

      set('#saStatutoryPass', passCategory);

      // Check Faculty Prerequisite Thresholds
      let mathStatus = 'Valid';
      let scienceStatus = 'Satisfied';
      let verdict = '';
      let badgeClass = 'bg-emerald-500 text-slate-950';

      if (faculty === 'health') {
        // MBChB / Pharmacy
        if (mathsType === 'MLIT') {
          mathStatus = '❌ Pure Mathematics Required (Maths Lit Disqualified)';
          scienceStatus = physMark !== null && physMark >= 70 ? 'Physics Valid' : 'Physical Sciences >= 70% Required';
          verdict = 'Ineligible for Medicine (MBChB). Medical faculties strictly require Pure Mathematics (>=70%), Physical Sciences (>=70%), and Life Sciences (>=70%). Consider Health Sciences diplomas or alternative programs.';
          badgeClass = 'bg-red-500 text-white';
        } else if (mathsMark < 70 || (physMark !== null && physMark < 70) || (lifeMark !== null && lifeMark < 70) || engMark < 60) {
          mathStatus = mathsMark >= 70 ? 'Pure Maths >= 70% ✓' : `Pure Maths ${mathsMark}% (Needs >= 70%)`;
          scienceStatus = `Physics: ${physMark || 0}%, Life Sci: ${lifeMark || 0}%`;
          verdict = `Prerequisite marks below standard medical school baselines (typically Pure Maths 70%+, Physics 70%+, Life Sciences 70%+). With an APS of ${totalAps}, consider BSc Biological Sciences or Nursing.`;
          badgeClass = 'bg-amber-500 text-slate-950';
        } else if (totalAps >= 38) {
          mathStatus = `Pure Maths ${mathsMark}% (Exceeds Prereq) ✓`;
          scienceStatus = 'Physics & Life Sciences Satisfied ✓';
          verdict = `Highly Competitive for Medicine & Health Sciences (MBChB, Pharmacy, Physiotherapy). Your APS of ${totalAps} and prerequisite scores satisfy competitive thresholds for UCT, Wits, UP, and Stellenbosch. Ensure NBTs are completed if required.`;
          badgeClass = 'bg-emerald-400 text-slate-950';
        } else {
          mathStatus = `Pure Maths ${mathsMark}% ✓`;
          scienceStatus = 'Prerequisites Met ✓';
          verdict = `Competitive Candidate. Your APS of ${totalAps} is near the MBChB cutoff. Consider listing BSc Medical Science or Biotechnology as a high-probability second choice.`;
          badgeClass = 'bg-emerald-500 text-slate-950';
        }
      } else if (faculty === 'eng') {
        // Engineering
        if (mathsType === 'MLIT') {
          mathStatus = '❌ Pure Maths Required (Maths Lit Disqualified)';
          scienceStatus = physMark !== null && physMark >= 65 ? 'Physics Valid' : 'Physical Sciences Required';
          verdict = 'Ineligible for Engineering (BEng / BSc Eng). All accredited South African engineering faculties require Pure Mathematics (>=70%) and Physical Sciences (>=65%). Consider National Diplomas at Universities of Technology (TUT, DUT, CPUT).';
          badgeClass = 'bg-red-500 text-white';
        } else if (mathsMark < 65 || (physMark !== null && physMark < 65) || engMark < 60) {
          mathStatus = mathsMark >= 65 ? 'Maths Met' : `Pure Maths ${mathsMark}% (Needs >= 65%)`;
          scienceStatus = physMark !== null && physMark >= 65 ? 'Physics Met' : `Physics ${physMark || 0}% (Needs >= 65%)`;
          verdict = `Prerequisite STEM thresholds not fully met for direct BEng entry. With APS ${totalAps}, you are a prime candidate for an Extended Curriculum Programme (ECP 5-year BEng) or National Diploma in Engineering.`;
          badgeClass = 'bg-amber-500 text-slate-950';
        } else if (totalAps >= 35) {
          mathStatus = `Pure Maths ${mathsMark}% (High Standing) ✓`;
          scienceStatus = `Physical Sciences ${physMark}% ✓`;
          verdict = `High Probability Direct Admission for Engineering (BEng Mechanical, Electrical, Civil, Chemical). Your APS of ${totalAps} and strong STEM distinctions qualify for direct placement at UP, Wits, UJ, Stellenbosch, and NWU.`;
          badgeClass = 'bg-emerald-400 text-slate-950';
        } else {
          mathStatus = `Pure Maths ${mathsMark}% ✓`;
          scienceStatus = `Physical Sciences ${physMark || 0}% ✓`;
          verdict = `Eligible Candidate. Your APS of ${totalAps} qualifies for BEng / BSc Eng streams and Extended Curriculum Programmes at major South African universities.`;
          badgeClass = 'bg-emerald-500 text-slate-950';
        }
      } else if (faculty === 'comm') {
        // Commerce & Accounting
        if (mathsType === 'MLIT' && mathsMark < 70) {
          mathStatus = 'Maths Lit accepted for General BCom only (>=70%)';
          scienceStatus = 'Accounting / Economics Recommended';
          verdict = 'Mathematical Literacy qualifies for General BCom (Human Resource Management, Marketing, Public Management) at UJ, UNISA, and UKZN. Pure Mathematics is required for Chartered Accounting (CA stream) and Actuarial Science.';
          badgeClass = 'bg-amber-500 text-slate-950';
        } else if (totalAps >= 34 && (mathsType === 'MATH' && mathsMark >= 60)) {
          mathStatus = `Pure Maths ${mathsMark}% (CA Qualified) ✓`;
          scienceStatus = 'Commerce Electives Valid ✓';
          verdict = `Direct Admission Standing for BCom Accounting / Finance / Economics. Your APS of ${totalAps} and mathematics level satisfy leading commerce faculty benchmarks across SA universities.`;
          badgeClass = 'bg-emerald-400 text-slate-950';
        } else {
          mathStatus = `${mathsType === 'MATH' ? 'Pure Maths' : 'Maths Lit'} ${mathsMark}%`;
          scienceStatus = 'Commercial Subjects Valid';
          verdict = `Eligible for BCom Business Management, Economics, or Extended BCom Curriculum. APS of ${totalAps} meets admission thresholds at UJ, UKZN, NWU, and UNISA.`;
          badgeClass = 'bg-emerald-500 text-slate-950';
        }
      } else if (faculty === 'law') {
        // Law LLB
        if (engMark < 65) {
          mathStatus = 'Maths / Maths Lit Checked';
          scienceStatus = 'Humanities Subjects Valid';
          verdict = `English mark (${engMark}%) is below the preferred 65%–70% benchmark for Law (LLB). With APS ${totalAps}, consider a BA Law or BCom Law pathway to articulate into LLB.`;
          badgeClass = 'bg-amber-500 text-slate-950';
        } else if (totalAps >= 32) {
          mathStatus = `${mathsType} ${mathsMark}% ✓`;
          scienceStatus = 'English Requirement Met ✓';
          verdict = `High Probability for LLB (Bachelor of Laws). Your APS of ${totalAps} and English mark of ${engMark}% exceed the baseline entry criteria for UKZN, UWC, UJ, UP, and UNISA.`;
          badgeClass = 'bg-emerald-400 text-slate-950';
        } else {
          mathStatus = `${mathsType} ${mathsMark}%`;
          scienceStatus = 'English Valid';
          verdict = `Eligible for BA Law, BCom Law, or Law Extended Curriculum Programmes (APS ${totalAps}).`;
          badgeClass = 'bg-emerald-500 text-slate-950';
        }
      } else {
        // General Science, Humanities, Education, TVET
        mathStatus = `${mathsType} ${mathsMark}% ✓`;
        scienceStatus = 'Requirements Evaluated ✓';
        if (totalAps >= 30) {
          verdict = `Direct Admission Standing. Your APS of ${totalAps} satisfies statutory Bachelor's degree and faculty requirements across major South African public universities.`;
          badgeClass = 'bg-emerald-400 text-slate-950';
        } else if (totalAps >= 24) {
          verdict = `Eligible for Diploma, Extended Curriculum (ECP), and Bachelor's programs at universities of technology and comprehensive institutions (APS ${totalAps}).`;
          badgeClass = 'bg-emerald-500 text-slate-950';
        } else {
          verdict = `Eligible for National Diploma or Higher Certificate programs at TVET Colleges and Universities of Technology (APS ${totalAps}).`;
          badgeClass = 'bg-blue-500 text-white';
        }
      }

      set('#saMathCheck', mathStatus);
      set('#saScienceCheck', scienceStatus);
      set('#saApsDisplay', `${totalAps}`);
      set('#saPassLevelBadge', `${passCategory} · ${top6.length} Subjects Evaluated`);
      const badgeEl = $('#saPassLevelBadge');
      if (badgeEl) badgeEl.className = `inline-block text-xs font-bold px-3 py-1 rounded-full ${badgeClass}`;
      set('#saVerdictSummary', verdict);
    };

    checkBtn.addEventListener('click', calculate);
  }

  function initNsfasEligibilityChecker() {
    const checkBtn = $('#nsfasCheckBtn');
    if (!checkBtn) return;

    // Handle income presets
    $$('.income-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-val');
        const input = $('#nsfasIncome');
        if (input && val !== null) {
          input.value = val;
        }
      });
    });

    const calculate = () => {
      const citizen = $('#nsfasCitizen')?.value || 'yes';
      const sassa = $('#nsfasSassa')?.value || 'no';
      const rawIncome = $('#nsfasIncome')?.value.trim();
      const disability = $('#nsfasDisability')?.value || 'no';
      const institution = $('#nsfasInstitution')?.value || 'public_uni';
      const qualification = $('#nsfasQualification')?.value || 'first_undergrad';
      const nRule = $('#nsfasYears')?.value || 'first_year';

      if (citizen === 'no') {
        set('#nsfasVerdictDisplay', 'Funding Ineligible');
        set('#nsfasCategoryBadge', 'Non-Citizen / International Status');
        set('#nsfasFinancialCheck', 'Ineligible (SA Citizens / Permanent Residents Only)');
        set('#nsfasCourseCheck', 'Public Higher Education');
        set('#nsfasNRuleCheck', 'Not Applicable');
        set('#nsfasSummaryText', 'NSFAS funding is exclusively restricted by South African statutory law to South African citizens and verified permanent residents with a valid 13-digit national ID.');
        const badge = $('#nsfasCategoryBadge');
        if (badge) badge.className = 'inline-block text-xs font-bold px-3 py-1 rounded-full bg-red-500 text-white';
        return;
      }

      if (institution === 'private') {
        set('#nsfasVerdictDisplay', 'Institution Ineligible');
        set('#nsfasCategoryBadge', 'Private College (PHEI) Excluded');
        set('#nsfasFinancialCheck', sassa === 'yes' ? 'SASSA Cleared' : 'Income Evaluated');
        set('#nsfasCourseCheck', '❌ Private Institutions Not Funded');
        set('#nsfasNRuleCheck', 'Standard Framework');
        set('#nsfasSummaryText', 'Under DHET legislation, NSFAS funding is exclusively allocated to students enrolled in South Africa\'s 26 Public Universities and 50 Public TVET Colleges. Private colleges (such as Boston, Damelin, Eduvos, Mancosa) are not funded by NSFAS.');
        const badge = $('#nsfasCategoryBadge');
        if (badge) badge.className = 'inline-block text-xs font-bold px-3 py-1 rounded-full bg-red-500 text-white';
        return;
      }

      if (qualification === 'postgrad') {
        set('#nsfasVerdictDisplay', 'Course Level Ineligible');
        set('#nsfasCategoryBadge', 'Postgraduate Excluded');
        set('#nsfasFinancialCheck', 'Financial Criteria Passed');
        set('#nsfasCourseCheck', '❌ Postgraduate (Honours/Masters/PhD)');
        set('#nsfasNRuleCheck', 'First Degree Rule');
        set('#nsfasSummaryText', 'NSFAS only funds a student\'s first undergraduate degree, diploma, or TVET qualification. Postgraduate studies (Honours, Masters, PhD) must apply for postgraduate funding through the National Research Foundation (NRF) or university merit bursaries.');
        const badge = $('#nsfasCategoryBadge');
        if (badge) badge.className = 'inline-block text-xs font-bold px-3 py-1 rounded-full bg-amber-500 text-slate-950';
        return;
      }

      if (nRule === 'exceeded') {
        set('#nsfasVerdictDisplay', 'N+1 Rule Exceeded');
        set('#nsfasCategoryBadge', 'Funded Years Limit Reached');
        set('#nsfasFinancialCheck', 'Financially Eligible');
        set('#nsfasCourseCheck', 'Accredited Public Institution');
        set('#nsfasNRuleCheck', '❌ Exceeded Maximum Allowable Years');
        set('#nsfasSummaryText', 'You have exceeded the statutory N+1 rule (or N+2 for students with disabilities). To continue receiving funding, you must lodge an official academic appeal via the myNSFAS portal with supporting medical or institutional evidence.');
        const badge = $('#nsfasCategoryBadge');
        if (badge) badge.className = 'inline-block text-xs font-bold px-3 py-1 rounded-full bg-red-500 text-white';
        return;
      }

      const income = rawIncome !== '' ? Number(rawIncome) : (sassa === 'yes' ? 0 : null);
      if (sassa === 'no' && (income === null || isNaN(income))) {
        set('#nsfasVerdictDisplay', 'Enter Income');
        set('#nsfasCategoryBadge', 'Income Required');
        set('#nsfasFinancialCheck', 'Awaiting gross household income');
        set('#nsfasSummaryText', 'Please enter your combined annual gross household income or select SASSA beneficiary status to evaluate financial eligibility.');
        return;
      }

      const badge = $('#nsfasCategoryBadge');

      if (sassa === 'yes') {
        // Fast-track SASSA
        set('#nsfasVerdictDisplay', '100% Full Bursary Approved');
        set('#nsfasCategoryBadge', 'SASSA Beneficiary Fast-Track');
        if (badge) badge.className = 'inline-block text-xs font-bold px-3 py-1 rounded-full bg-emerald-400 text-slate-950';
        set('#nsfasFinancialCheck', '✓ SASSA Clearance (Zero Means-Testing)');
        set('#nsfasCourseCheck', `✓ ${institution === 'public_uni' ? 'Public University' : 'Public TVET College'} Approved`);
        set('#nsfasNRuleCheck', '✓ Within Allowable N+ Limit');
        set('#nsfasSummaryText', 'Full Free NSFAS Bursary Awarded! As an active SASSA beneficiary, you receive 100% tuition coverage, accommodation/residence allowance, monthly food stipend (R1,650/mo), personal care, and learning materials/laptop with no repayment required.');
        return;
      }

      // Non-SASSA Financial Assessment
      const effectiveIncome = income || 0;

      if (disability === 'yes') {
        if (effectiveIncome <= 600000) {
          set('#nsfasVerdictDisplay', 'Full Disability Bursary Approved');
          set('#nsfasCategoryBadge', 'Disability Quota (Income <= R600k)');
          if (badge) badge.className = 'inline-block text-xs font-bold px-3 py-1 rounded-full bg-emerald-400 text-slate-950';
          set('#nsfasFinancialCheck', `✓ Gross Income R${effectiveIncome.toLocaleString()} <= R600,000 Cap`);
          set('#nsfasCourseCheck', '✓ Public Higher Education Approved');
          set('#nsfasNRuleCheck', '✓ Funded under N+2 Framework');
          set('#nsfasSummaryText', 'Approved for Full Comprehensive Disability Bursary. Package covers 100% tuition, accommodation, living stipend, medical assistive devices (wheelchairs, hearing aids), scribes, and human support allowance.');
        } else {
          set('#nsfasVerdictDisplay', 'Funding Ineligible');
          set('#nsfasCategoryBadge', 'Exceeds R600,000 Income Cap');
          if (badge) badge.className = 'inline-block text-xs font-bold px-3 py-1 rounded-full bg-red-500 text-white';
          set('#nsfasFinancialCheck', `❌ Income R${effectiveIncome.toLocaleString()} > R600,000 Cap`);
          set('#nsfasCourseCheck', 'Accredited Institution');
          set('#nsfasNRuleCheck', 'Within Duration');
          set('#nsfasSummaryText', 'Your household income exceeds the statutory R600,000 threshold for disability funding. Consider private bursary funds such as ISFAP or commercial student loans.');
        }
        return;
      }

      // Standard Non-Disability
      if (effectiveIncome <= 350000) {
        set('#nsfasVerdictDisplay', '100% Full Bursary Approved');
        set('#nsfasCategoryBadge', `Full Bursary Tier (Income <= R350k)`);
        if (badge) badge.className = 'inline-block text-xs font-bold px-3 py-1 rounded-full bg-emerald-400 text-slate-950';
        set('#nsfasFinancialCheck', `✓ Gross Income R${effectiveIncome.toLocaleString()} <= R350,000 Cap`);
        set('#nsfasCourseCheck', `✓ ${institution === 'public_uni' ? 'Public University' : 'Public TVET College'} Approved`);
        set('#nsfasNRuleCheck', '✓ Within N+1 Rule Limit');
        set('#nsfasSummaryText', 'Full Free NSFAS Bursary Awarded! 100% of your tuition fees, university residence or accredited private accommodation, monthly living allowance (R1,650/mo), and book/laptop allowance are fully covered with zero debt or repayment obligation.');
      } else if (effectiveIncome <= 600000) {
        set('#nsfasVerdictDisplay', 'Missing Middle Loan Scheme');
        set('#nsfasCategoryBadge', 'Missing Middle Tier (R350k – R600k)');
        if (badge) badge.className = 'inline-block text-xs font-bold px-3 py-1 rounded-full bg-blue-400 text-slate-950';
        set('#nsfasFinancialCheck', `✓ Gross Income R${effectiveIncome.toLocaleString()} (Missing Middle Tier)`);
        set('#nsfasCourseCheck', `✓ ${institution === 'public_uni' ? 'Public University' : 'Public TVET College'} Approved`);
        set('#nsfasNRuleCheck', '✓ Within N+1 Rule Limit');
        set('#nsfasSummaryText', 'Eligible for the DHET/NSFAS Missing Middle Comprehensive Loan & Bursary Scheme! Covers 100% tuition fees and accommodation. Up to 70% of the loan automatically converts into a non-repayable bursary if you achieve a >=70% course pass rate.');
      } else {
        set('#nsfasVerdictDisplay', 'Funding Ineligible');
        set('#nsfasCategoryBadge', 'Household Income > R600,000');
        if (badge) badge.className = 'inline-block text-xs font-bold px-3 py-1 rounded-full bg-red-500 text-white';
        set('#nsfasFinancialCheck', `❌ Income R${effectiveIncome.toLocaleString()} > R600,000 Cap`);
        set('#nsfasCourseCheck', 'Accredited Institution');
        set('#nsfasNRuleCheck', 'Within Duration');
        set('#nsfasSummaryText', 'Your combined household income exceeds the NSFAS and Missing Middle maximum threshold of R600,000 per annum. You are encouraged to apply for commercial student loans (Standard Bank, FNB, Absa, Nedbank, Capitec) or corporate bursary programmes.');
      }
    };

    checkBtn.addEventListener('click', calculate);
  }

  onReady(() => {
    initJamb();
    initGpa();
    initAps();
    initKcse();
    initEligibility();
    initNcvCalculator();
    initTargetMarkCalculator();
    initNsfasCalculator();
    initMatricSbaExamCalculator();
    initSaUniversityAdmissionCalculator();
    initNsfasEligibilityChecker();
  });
})();