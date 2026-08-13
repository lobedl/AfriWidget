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

  onReady(() => {
    initJamb();
    initGpa();
    initAps();
    initKcse();
    initEligibility();
  });
})();