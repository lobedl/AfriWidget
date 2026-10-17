/**
 * AfriWidget WASSCE (WAEC) "Find My Weaknesses" Diagnostic Engine
 * Pure vanilla JavaScript. Zero dependencies, zero emojis, zero tracking.
 * 100% deterministic marking, localized storage, and targeted weakness practice.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'afriwidget_wassce_weakness_history';

  var TOPICS = {
    grade_points_mapping: {
      id: 'grade_points_mapping',
      name: 'WASSCE 9-Point Numerical Scale & Grade Mapping',
      shortName: '9-Point Grade Mapping'
    },
    core_electives_rule: {
      id: 'core_electives_rule',
      name: 'The "Best 6 Subjects" Rule & Mandatory Core Requirements',
      shortName: 'Core & Elective Selection'
    },
    credit_pass_threshold: {
      id: 'credit_pass_threshold',
      name: 'The C6 (50%) Credit Pass Benchmark for Tertiary Admission',
      shortName: 'Credit Benchmark & C6 Rule'
    },
    stream_elective_rules: {
      id: 'stream_elective_rules',
      name: 'Subject Combinations by Academic Faculty Streams',
      shortName: 'Faculty Subject Streams'
    },
    transcripts_combining_sittings: {
      id: 'transcripts_combining_sittings',
      name: 'Combining Two Sittings & WAEC Verification Regulations',
      shortName: 'Sittings & Verification Rules'
    }
  };

  var QUESTION_BANK = [
    // --- TOPIC 1: 9-Point Grade Mapping ---
    {
      id: 'was_map_1',
      topicId: 'grade_points_mapping',
      question: 'In the West African Examinations Council (WAEC) grading system, what numerical point is assigned to grade A1?',
      options: [
        '1 point',
        '4 points',
        '7 points',
        '10 points'
      ],
      correctIndex: 0,
      explanation: 'WASSCE uses an inverse numerical point scale running from 1 (best) to 9 (worst). A1 is the highest possible grade and carries exactly 1 point.'
    },
    {
      id: 'was_map_2',
      topicId: 'grade_points_mapping',
      question: 'Under standard WASSCE aggregate calculations in Ghana, why is an aggregate score of 08 considered superior to an aggregate score of 24?',
      options: [
        'Because higher numerical aggregates represent failing scores',
        'Because WASSCE aggregates sum numerical grade points where A1=1 and F9=9, making a lower numerical aggregate indicative of higher academic performance',
        'Because 08 means the student wrote 8 subjects',
        'Because the exam board rounds all single-digit scores down'
      ],
      correctIndex: 1,
      explanation: 'The WASSCE aggregate is calculated by adding the numerical points of the best six qualifying subjects. Because A1=1, B2=2, B3=3, etc., an aggregate of 6 (6 × A1) represents perfection, while higher totals indicate lower grades.'
    },
    {
      id: 'was_map_3',
      topicId: 'grade_points_mapping',
      question: 'Which percentage band typically corresponds to grade B2 (Very Good, 2 points) under standard WAEC marking schemes?',
      options: [
        '60% to 64%',
        '65% to 69%',
        '70% to 74%',
        '75% to 79%'
      ],
      correctIndex: 2,
      explanation: 'Under standard WAEC raw mark distributions, A1 is 75-100%, B2 is 70-74%, B3 is 65-69%, C4 is 60-64%, C5 is 55-59%, C6 is 50-54%, D7 is 45-49%, E8 is 40-44%, and F9 is 0-39%.'
    },
    {
      id: 'was_map_4',
      topicId: 'grade_points_mapping',
      question: 'What is the numerical point value of grade C5 on the WASSCE scale?',
      options: [
        '3 points',
        '4 points',
        '5 points',
        '6 points'
      ],
      correctIndex: 2,
      explanation: 'Each letter-number grade maps directly to its numerical suffix on the WASSCE scale: C4 is 4 points, C5 is 5 points, and C6 is 6 points.'
    },
    {
      id: 'was_map_5',
      topicId: 'grade_points_mapping',
      question: 'What is the theoretical best (lowest) aggregate achievable across six qualifying WASSCE subjects?',
      options: [
        '00',
        '06',
        '10',
        '12'
      ],
      correctIndex: 1,
      explanation: 'A candidate who achieves grade A1 (1 point) across three mandatory core subjects and three best elective subjects scores 1 + 1 + 1 + 1 + 1 + 1 = 6 (Aggregate 06), the pinnacle of WASSCE academic achievement.'
    },
    {
      id: 'was_map_6',
      topicId: 'grade_points_mapping',
      question: 'How many points are assigned to grade F9 in the WAEC grading system, and what is its classification?',
      options: [
        '0 points, Incomplete',
        '9 points, Fail',
        '10 points, Withdrawn',
        '5 points, Condoned'
      ],
      correctIndex: 1,
      explanation: 'Grade F9 represents a Fail (0-39% raw score) and is assigned the maximum penalty value of 9 numerical points in aggregate computations.'
    },

    // --- TOPIC 2: Core & Elective Selection ---
    {
      id: 'was_core_1',
      topicId: 'core_electives_rule',
      question: 'Which three core subjects are universally non-negotiable and mandatory in standard Ghanaian university WASSCE aggregate calculations?',
      options: [
        'Core English, Core Mathematics, and either Integrated Science or Social Studies',
        'Core English, French, and Physical Education',
        'Core Mathematics, Elective Mathematics, and Physics',
        'Any three subjects with the highest marks'
      ],
      correctIndex: 0,
      explanation: 'In Ghana tertiary admissions, the core requirement comprises three subjects: Core English, Core Mathematics, and the better grade between Integrated Science and Social Studies (science faculties universally mandate Integrated Science).'
    },
    {
      id: 'was_core_2',
      topicId: 'core_electives_rule',
      question: 'A student achieves A1 in four elective subjects, but scores D7 in Core English. Can the fourth elective be substituted for Core English in calculating the university admission aggregate?',
      options: [
        'Yes, universities always drop the lowest score regardless of whether it is core or elective',
        'No, Core English is a mandatory structural pillar that cannot be substituted by any elective subject',
        'Yes, if the student pays a waiver fee during admissions',
        'Only if the student is applying to a private university'
      ],
      correctIndex: 1,
      explanation: 'Core English cannot be substituted. The WASSCE admission formula strictly mandates three core subjects + three electives. A surplus elective cannot replace a deficient compulsory core subject.'
    },
    {
      id: 'was_core_3',
      topicId: 'core_electives_rule',
      question: 'When calculating the third core subject for an applicant applying to BSc Civil Engineering or Medicine at KNUST or UG Legon, which subject must be used?',
      options: [
        'Social Studies only',
        'Integrated Science only (Social Studies is not accepted as the core science for STEM faculties)',
        'Either subject, whichever has the higher letter grade',
        'General Knowledge in Art'
      ],
      correctIndex: 1,
      explanation: 'STEM and Health Science faculties at Ghanaian public universities (KNUST, UG, UCC) explicitly require Integrated Science as the third core subject. Social Studies cannot be used as the core science prerequisite for STEM admissions.'
    },
    {
      id: 'was_core_4',
      topicId: 'core_electives_rule',
      question: 'How many elective subjects are included in the standard WASSCE aggregate computation for tertiary admission?',
      options: [
        'Exactly two electives',
        'The candidate\'s best three qualifying elective subjects',
        'All four electives written by the candidate',
        'Only one elective directly matching the programme title'
      ],
      correctIndex: 1,
      explanation: 'Tertiary admission aggregates are computed on a total of six subjects: the three mandatory core subjects plus the student\'s best three qualifying elective subjects from their designated stream.'
    },
    {
      id: 'was_core_5',
      topicId: 'core_electives_rule',
      question: 'A Business student writes four electives: Accounting (B2), Costing (B3), Economics (C4), and Business Management (A1). Which three electives are counted in the aggregate?',
      options: [
        'Accounting (2), Costing (3), and Economics (4)',
        'Business Management (1), Accounting (2), and Costing (3)',
        'All four electives are averaged',
        'Only Business Management and Accounting'
      ],
      correctIndex: 1,
      explanation: 'The algorithm selects the three best (lowest point) electives: Business Management (A1 = 1 point), Accounting (B2 = 2 points), and Costing (B3 = 3 points), yielding 1 + 2 + 3 = 6 elective points, safely discarding Economics (C4 = 4 points).'
    },
    {
      id: 'was_core_6',
      topicId: 'core_electives_rule',
      question: 'What happens if a student fails (F9) in one elective but passes the remaining three electives with A1?',
      options: [
        'The student is automatically disqualified from tertiary education',
        'The failed elective is discarded and the three passed electives are used to compute the aggregate',
        'The F9 is averaged into the core score',
        'The student must sit the entire WASSCE exam again'
      ],
      correctIndex: 1,
      explanation: 'Because high school students generally sit four electives while university admission aggregates require only the best three, one poor or failed elective grade is discarded without penalty, provided three clean qualifying electives remain.'
    },

    // --- TOPIC 3: Credit Benchmark & C6 Rule ---
    {
      id: 'was_cred_1',
      topicId: 'credit_pass_threshold',
      question: 'What is the statutory minimum grade required in each of the six qualifying subjects for direct degree admission at public universities in Ghana and Nigeria?',
      options: [
        'Grade D7 (Pass)',
        'Grade C6 (Credit Pass)',
        'Grade B3 (Good)',
        'Grade E8 (Pass)'
      ],
      correctIndex: 1,
      explanation: 'Under GTEC (Ghana) and NUC (Nigeria) regulations, direct degree admission mandates credit passes (grades A1 to C6) in at least six (or five in Nigeria) relevant subjects. Grades D7 and E8 are classified as passes, not credits, and disqualify candidates from direct degree entry.'
    },
    {
      id: 'was_cred_2',
      topicId: 'credit_pass_threshold',
      question: 'A Ghanaian applicant achieves an aggregate of 20 with grades: Core English C4, Core Maths C5, Integrated Science C6, Elective 1 A1, Elective 2 B2, and Elective 3 D7. Can they be admitted to a degree programme?',
      options: [
        'Yes, because Aggregate 20 is below the competitive cutoff of 24',
        'No, because Elective 3 is a D7, which is a weak pass that breaches the mandatory C6 credit sub-minimum for degree programmes',
        'Yes, because A1 in Elective 1 condones the D7',
        'Only if the student registers for evening classes'
      ],
      correctIndex: 1,
      explanation: 'Even when the total aggregate number appears competitive, every counted subject must achieve at least grade C6. A D7 breaches the credit sub-minimum and makes the applicant ineligible for direct undergraduate degree admission.'
    },
    {
      id: 'was_cred_3',
      topicId: 'credit_pass_threshold',
      question: 'What tertiary education pathways are open to a Ghanaian WASSCE candidate who obtains passes in D7 or E8 in some subjects?',
      options: [
        'Direct entry into medical and law schools',
        'Diploma, Higher National Diploma (HND), or university access / foundation programmes',
        'No post-secondary education of any kind is permitted',
        'Automatic conversion to a master\'s degree'
      ],
      correctIndex: 1,
      explanation: 'Technical universities and polytechnics accept D7/E8 passes for Higher National Diploma (HND) and Diploma programmes. Furthermore, many universities offer Access or Pre-degree foundation courses leading into degree programmes upon completion.'
    },
    {
      id: 'was_cred_4',
      topicId: 'credit_pass_threshold',
      question: 'In Nigeria, what is the mandatory WASSCE O\'Level requirement for entry into any accredited university undergraduate programme?',
      options: [
        'At least five credit passes (A1-C6) in relevant subjects, including English Language and Mathematics, in not more than two sittings',
        'Passing three subjects with distinctions',
        'A score of 75% in every paper',
        'Passing only English Language'
      ],
      correctIndex: 0,
      explanation: 'National Universities Commission (NUC) regulations mandate that all candidates possess at least 5 O\'Level credit passes (grades A1 through C6), with compulsory credits in English Language and Mathematics, obtained in a maximum of two examination sittings.'
    },
    {
      id: 'was_cred_5',
      topicId: 'credit_pass_threshold',
      question: 'What is the percentage mark difference between grade C6 and grade D7 on the official WAEC scale?',
      options: [
        'C6 begins at 50%, whereas D7 falls below 50% into the 45-49% bracket',
        'C6 is 70% and D7 is 30%',
        'There is no percentage difference; they are identical',
        'C6 requires an oral interview while D7 does not'
      ],
      correctIndex: 0,
      explanation: 'The critical boundary between credit and pass lies at 50%: 50-54% awards C6 (credit pass), while 45-49% awards D7 (pass). A difference of just 1% (49% vs 50%) determines whether a student satisfies degree admission regulations.'
    },
    {
      id: 'was_cred_6',
      topicId: 'credit_pass_threshold',
      question: 'If a candidate is awarded a "Withheld" or "Held" result in one subject by WAEC, can that subject be used to calculate an aggregate?',
      options: [
        'Yes, by assigning an assumed grade of C6',
        'No, a withheld result has no official grade and cannot be evaluated until investigated and officially released by the National Examinations Committee (NEC)',
        'Yes, if the candidate signs an affidavit',
        'Only if the subject is an elective'
      ],
      correctIndex: 1,
      explanation: 'Withheld results indicate alleged examination malpractice under investigation. Until the WAEC National Examinations Committee formally releases the grade, it cannot be used for aggregate calculations or university admission processing.'
    },

    // --- TOPIC 4: Faculty Subject Streams ---
    {
      id: 'was_stream_1',
      topicId: 'stream_elective_rules',
      question: 'Which elective subject combination is universally required for admission into Bachelor of Pharmacy or Medicine (MBChB) in Ghana?',
      options: [
        'Physics, Chemistry, Biology, and Elective Mathematics',
        'Government, History, Literature-in-English, and Economics',
        'Accounting, Business Management, Costing, and Economics',
        'General Knowledge in Art, Textiles, and Graphic Design'
      ],
      correctIndex: 0,
      explanation: 'Medical and pharmaceutical programmes require the General Science elective stream: Chemistry, Biology, Physics, and Elective Mathematics, with credit passes (A1 to C6) in all components.'
    },
    {
      id: 'was_stream_2',
      topicId: 'stream_elective_rules',
      question: 'Can a General Arts student who studied Literature, Government, and History apply directly for BSc Computer Science at a Ghanaian public university?',
      options: [
        'Yes, without any restrictions',
        'Generally no, because Computer Science faculties mandate Elective Mathematics and Physics as compulsory prerequisite electives',
        'Yes, provided their aggregate is 06',
        'Only if they have an A1 in Social Studies'
      ],
      correctIndex: 1,
      explanation: 'Computer Science is rooted in discrete mathematics and computational theory. Public universities require Elective Mathematics and usually Physics. Core Mathematics alone is insufficient for computer science faculty admission.'
    },
    {
      id: 'was_stream_3',
      topicId: 'stream_elective_rules',
      question: 'For entry into BSc Administration / Accounting at the University of Ghana Business School (UGBS), what elective prerequisite rule applies?',
      options: [
        'Only students who took Business in senior high school can apply',
        'Both Business and General Science students are eligible, but an elective credit pass in Elective Mathematics or Accounting is required',
        'No mathematics of any kind is required',
        'Only applicants with Visual Arts electives are admitted'
      ],
      correctIndex: 1,
      explanation: 'UGBS welcomes diverse streams (Business, General Science, and General Arts), but candidates must satisfy strict quantitative prerequisites, typically demanding strong passes in Elective Mathematics or Financial Accounting.'
    },
    {
      id: 'was_stream_4',
      topicId: 'stream_elective_rules',
      question: 'What is the primary role of "Elective Mathematics" compared to "Core Mathematics" in West African secondary education?',
      options: [
        'They are identical courses with different exam dates',
        'Elective Mathematics covers advanced calculus, coordinate geometry, matrices, and statistics required for Engineering, Science, and Economics',
        'Elective Mathematics is an easier version for students struggling with Core Maths',
        'Elective Mathematics is only written by students in Nigeria'
      ],
      correctIndex: 1,
      explanation: 'Elective Mathematics is an advanced curriculum covering differential and integral calculus, complex numbers, vectors, mechanics, and probability. It is the non-negotiable gateway for university STEM, Actuarial Science, and quantitative economics.'
    },
    {
      id: 'was_stream_5',
      topicId: 'stream_elective_rules',
      question: 'Which elective stream includes subjects such as Picture Making, Ceramics, Sculpture, and Graphic Design?',
      options: [
        'Home Economics',
        'Visual Arts',
        'General Science',
        'Agricultural Science'
      ],
      correctIndex: 1,
      explanation: 'The Visual Arts stream includes General Knowledge in Art (GKA), Picture Making, Graphic Design, Textiles, Sculpture, and Ceramics, qualifying candidates for Architecture, Industrial Art, Communication Design, and Fine Arts.'
    },
    {
      id: 'was_stream_6',
      topicId: 'stream_elective_rules',
      question: 'Why do universities publish "Cut-off Aggregates" for each degree programme each academic year?',
      options: [
        'Because WAEC changes the point value of A1 every year',
        'Because cut-off aggregates reflect competitive applicant supply and departmental seat quotas, with highly demanded courses requiring lower (better) aggregates',
        'Because all applicants with aggregate 24 must be rejected',
        'Because the Ministry of Education sets a random number'
      ],
      correctIndex: 1,
      explanation: 'University cut-off aggregates are determined by supply and demand. If a medical school has 150 seats and 3,000 qualified candidates apply, the cut-off may settle at Aggregate 07. Less subscribed programmes may admit candidates up to Aggregate 24.'
    },

    // --- TOPIC 5: Sittings & Verification Rules ---
    {
      id: 'was_sit_1',
      topicId: 'transcripts_combining_sittings',
      question: 'Can a student combine results from May/June WASSCE (School Candidates) and Nov/Dec WASSCE (Private Candidates / GCE) for university admission?',
      options: [
        'No, results from different sittings can never be merged',
        'Yes, almost all public and private universities in Ghana and Nigeria allow candidates to combine results from a maximum of two sittings',
        'Only if both sittings took place in the same calendar month',
        'Yes, but only if the student pays double tuition fees'
      ],
      correctIndex: 1,
      explanation: 'Universities across Ghana and Nigeria permit the combination of results from two sittings (e.g. May/June and Nov/Dec) to satisfy both core and elective credit requirements, provided all subjects achieve at least grade C6.'
    },
    {
      id: 'was_sit_2',
      topicId: 'transcripts_combining_sittings',
      question: 'When combining two WASSCE sittings, which grade is selected if a student wrote Core Mathematics in both exams?',
      options: [
        'The exam written most recently must be used',
        'The better of the two grades (the one carrying the lower numerical point) is officially selected',
        'The two marks are averaged together',
        'The candidate loses 2 penalty points for retaking'
      ],
      correctIndex: 1,
      explanation: 'Admissions portals allow candidates to submit the highest achieved grade from either sitting for each subject (e.g., if a student earned D7 in June and B3 in Nov/Dec, the B3 is utilized).'
    },
    {
      id: 'was_sit_3',
      topicId: 'transcripts_combining_sittings',
      question: 'What is a WAEC Scratch Card / Result Checker PIN used for during university admissions?',
      options: [
        'To register for varsity sports',
        'To enable university admissions boards to independently authenticate and verify online results directly from WAEC databases',
        'To pay tuition fees directly to the university',
        'To request an immediate re-mark of all examination papers'
      ],
      correctIndex: 1,
      explanation: 'Universities require candidates to upload their Serial Number and PIN so admissions officers can query WAEC servers directly and verify that uploaded result slips are authentic and untampered.'
    },
    {
      id: 'was_sit_4',
      topicId: 'transcripts_combining_sittings',
      question: 'What is the official deadline window for a candidate to apply for a WAEC paper re-mark or enquiry on results?',
      options: [
        'Within 60 days of the official release of the examination results',
        'Up to five years after completing secondary school',
        'On the morning of the exam only',
        'Any time before graduating from university'
      ],
      correctIndex: 0,
      explanation: 'Under WAEC regulations, applications for review of scripts or re-marking must be formally submitted through the candidate\'s school or zonal office within 60 days of the official release of results, accompanied by the prescribed review fee.'
    },
    {
      id: 'was_sit_5',
      topicId: 'transcripts_combining_sittings',
      question: 'What is the consequence if an applicant submits a forged or falsified WASSCE result slip to a university?',
      options: [
        'A small fine of 100 cedis or naira',
        'Immediate disqualification, withdrawal of admission at any point during the degree, blacklisting, and referral for criminal prosecution',
        'The student is asked to retake only the forged subject',
        'The student is given an automatic distinction'
      ],
      correctIndex: 1,
      explanation: 'Result forgery is a serious criminal offence under examination malpractice statutes. Universities regularly audit matriculation files; discovery of forged WASSCE results triggers instant expulsion (even in final year) and criminal referral.'
    },
    {
      id: 'was_sit_6',
      topicId: 'transcripts_combining_sittings',
      question: 'In Nigeria, can a candidate combine a WASSCE result with a NECO (National Examinations Council) SSCE result?',
      options: [
        'No, JAMB strictly prohibits mixing WAEC and NECO',
        'Yes, virtually all Nigerian federal, state, and private universities accept a combination of WAEC and NECO across two sittings',
        'Only if both exams were written in the same secondary school',
        'Only for candidates over 30 years old'
      ],
      correctIndex: 1,
      explanation: 'JAMB and Nigerian universities recognize both WAEC and NECO as equivalent national examination bodies. Candidates are permitted to combine credit passes from WAEC and NECO across two sittings to complete their required 5 O\'Level credits.'
    }
  ];

  // State Management
  var currentQuestions = [];
  var currentQuestionIndex = 0;
  var userAnswers = {};
  var currentAssessmentMeta = {
    mode: 'diagnostic',
    focusTopic: 'all',
    targetWeaknessTopicIds: []
  };

  function getHistory() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveAttemptToHistory(attempt) {
    try {
      var history = getHistory();
      history.unshift(attempt);
      if (history.length > 20) history = history.slice(0, 20);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {}
  }

  function clearHistory() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      renderHistoryList();
      renderHistoryPreview();
      updateComparisonBox(null, null);
    } catch (e) {}
  }

  function getWassceInputsContext() {
    var eng = document.getElementById('coreEnglish');
    var math = document.getElementById('coreMaths');
    var aggEl = document.getElementById('aggregateValue');
    var aggVal = aggEl ? parseInt(aggEl.textContent, 10) : NaN;

    if (!isNaN(aggVal) && aggVal >= 6) {
      if (aggVal <= 12) {
        return {
          status: 'success',
          title: 'Elite WASSCE Aggregate Detected (Aggregate ' + (aggVal < 10 ? ('0' + aggVal) : aggVal) + ')',
          text: 'Your aggregate qualifies you for competitive high-demand faculties like Medicine, Pharmacy, Law, and Engineering. Test your understanding of faculty elective streams and university cutoff dynamics.',
          recommendedTopic: 'stream_elective_rules'
        };
      } else if (aggVal <= 24) {
        return {
          status: 'neutral',
          title: 'Degree Admission Range Detected (Aggregate ' + aggVal + ')',
          text: 'Your aggregate is within standard degree entry range. Verify that all 6 counted subjects achieve at least C6 and meet stream-specific prerequisites.',
          recommendedTopic: 'credit_pass_threshold'
        };
      } else {
        return {
          status: 'warning',
          title: 'High Aggregate Detected (Aggregate ' + aggVal + ')',
          text: 'Your aggregate is near diploma or access programme thresholds. Diagnose credit pass benchmarks (C6 rule) and strategies for combining two sittings.',
          recommendedTopic: 'transcripts_combining_sittings'
        };
      }
    }

    if (eng && math && eng.value && math.value) {
      return {
        status: 'neutral',
        title: 'Core Grades Configured (' + eng.value + ' & ' + math.value + ')',
        text: 'You have entered core English and Mathematics. Test your knowledge of how core subjects and the best 3 electives form your official aggregate.',
        recommendedTopic: 'core_electives_rule'
      };
    }

    return {
      status: 'neutral',
      title: 'Comprehensive WASSCE Diagnostic',
      text: 'Evaluate your command of WASSCE 9-point grading, core subject mandatory rules, the C6 credit benchmark, and faculty subject stream combinations.',
      recommendedTopic: 'all'
    };
  }

  function selectQuestionsForAssessment(mode, focusTopic) {
    var pool = QUESTION_BANK.slice();

    if (mode === 'targeted_weakness' && currentAssessmentMeta.targetWeaknessTopicIds && currentAssessmentMeta.targetWeaknessTopicIds.length > 0) {
      var weakTargetIds = currentAssessmentMeta.targetWeaknessTopicIds;
      var weakQ = pool.filter(function (q) {
        return weakTargetIds.indexOf(q.topicId) !== -1;
      });
      weakQ.sort(function () { return 0.5 - Math.random(); });
      var selected = weakQ.slice(0, 10);
      if (selected.length < 10) {
        var remaining = pool.filter(function (q) { return selected.indexOf(q) === -1; });
        remaining.sort(function () { return 0.5 - Math.random(); });
        selected = selected.concat(remaining.slice(0, 10 - selected.length));
      }
      return selected;
    }

    if (focusTopic && focusTopic !== 'all' && TOPICS[focusTopic]) {
      var topicQ = pool.filter(function (q) { return q.topicId === focusTopic; });
      topicQ.sort(function () { return 0.5 - Math.random(); });
      var pickedTopic = topicQ.slice(0, 6);
      var otherQ = pool.filter(function (q) { return q.topicId !== focusTopic; });
      otherQ.sort(function () { return 0.5 - Math.random(); });
      return pickedTopic.concat(otherQ.slice(0, 10 - pickedTopic.length));
    }

    // Default balanced 10-question set across all 5 topics (2 per topic)
    var balanced = [];
    Object.keys(TOPICS).forEach(function (tKey) {
      var tPool = pool.filter(function (q) { return q.topicId === tKey; });
      tPool.sort(function () { return 0.5 - Math.random(); });
      balanced = balanced.concat(tPool.slice(0, 2));
    });
    balanced.sort(function () { return 0.5 - Math.random(); });
    return balanced.slice(0, 10);
  }

  function switchView(viewId) {
    ['wIntroView', 'wQuizView', 'wResultsView'].forEach(function (v) {
      var el = document.getElementById(v);
      if (el) el.style.display = (v === viewId) ? 'block' : 'none';
    });
    var sec = document.getElementById('weaknessAssessmentSection');
    if (sec && sec.style.display === 'none') {
      sec.style.display = 'block';
    }
  }

  function startNewAssessment(mode, topicKey) {
    currentAssessmentMeta.mode = mode || 'diagnostic';
    currentAssessmentMeta.focusTopic = topicKey || 'all';
    currentQuestions = selectQuestionsForAssessment(currentAssessmentMeta.mode, currentAssessmentMeta.focusTopic);
    currentQuestionIndex = 0;
    userAnswers = {};

    switchView('wQuizView');

    var badgeEl = document.getElementById('wQuizBadge');
    if (badgeEl) {
      if (currentAssessmentMeta.mode === 'targeted_weakness') {
        badgeEl.textContent = 'Targeted Weakness Practice';
      } else if (currentAssessmentMeta.focusTopic !== 'all' && TOPICS[currentAssessmentMeta.focusTopic]) {
        badgeEl.textContent = TOPICS[currentAssessmentMeta.focusTopic].shortName + ' Focus';
      } else {
        badgeEl.textContent = 'Comprehensive Diagnostic';
      }
    }

    renderCurrentQuestion();
    var sec = document.getElementById('weaknessAssessmentSection');
    if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderCurrentQuestion() {
    var q = currentQuestions[currentQuestionIndex];
    if (!q) return;

    var numEl = document.getElementById('wCurrentQNum');
    if (numEl) numEl.textContent = (currentQuestionIndex + 1);

    var progBar = document.getElementById('wProgressBar');
    if (progBar) {
      var pct = Math.round(((currentQuestionIndex + 1) / currentQuestions.length) * 100);
      progBar.style.width = pct + '%';
    }

    var topicMeta = TOPICS[q.topicId] || { name: 'Curriculum Standard' };
    var topicLabel = document.getElementById('wQuestionTopic');
    if (topicLabel) topicLabel.textContent = topicMeta.name;

    var titleEl = document.getElementById('wQuestionText');
    if (titleEl) titleEl.textContent = q.question;

    var container = document.getElementById('wOptionsContainer');
    if (container) {
      container.innerHTML = '';
      var selectedIdx = userAnswers[q.id];

      var letters = ['A', 'B', 'C', 'D'];
      q.options.forEach(function (optText, idx) {
        var optDiv = document.createElement('div');
        optDiv.className = 'w-option-item' + (selectedIdx === idx ? ' selected' : '');
        optDiv.setAttribute('role', 'radio');
        optDiv.setAttribute('aria-checked', selectedIdx === idx ? 'true' : 'false');
        optDiv.setAttribute('tabindex', '0');

        optDiv.innerHTML = [
          '<span class="w-option-letter">' + letters[idx] + '</span>',
          '<span class="w-option-text">' + optText + '</span>'
        ].join('');

        function pick() {
          userAnswers[q.id] = idx;
          var alertBox = document.getElementById('wQuizValidation');
          if (alertBox) alertBox.style.display = 'none';
          renderCurrentQuestion();
        }

        optDiv.addEventListener('click', pick);
        optDiv.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            pick();
          }
        });

        container.appendChild(optDiv);
      });
    }

    var prevBtn = document.getElementById('wPrevBtn');
    if (prevBtn) prevBtn.disabled = (currentQuestionIndex === 0);

    var nextBtn = document.getElementById('wNextBtn');
    var submitBtn = document.getElementById('wSubmitBtn');
    var isLast = (currentQuestionIndex === currentQuestions.length - 1);

    if (nextBtn) nextBtn.style.display = isLast ? 'none' : 'inline-flex';
    if (submitBtn) submitBtn.style.display = isLast ? 'inline-flex' : 'none';

    var valAlert = document.getElementById('wQuizValidation');
    if (valAlert) valAlert.style.display = 'none';
  }

  function advanceQuestion() {
    var q = currentQuestions[currentQuestionIndex];
    if (userAnswers[q.id] === undefined) {
      var valAlert = document.getElementById('wQuizValidation');
      if (valAlert) valAlert.style.display = 'block';
      return;
    }
    if (currentQuestionIndex < currentQuestions.length - 1) {
      currentQuestionIndex++;
      renderCurrentQuestion();
    }
  }

  function retreatQuestion() {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      renderCurrentQuestion();
    }
  }

  function submitAssessment() {
    var q = currentQuestions[currentQuestionIndex];
    if (userAnswers[q.id] === undefined) {
      var valAlert = document.getElementById('wQuizValidation');
      if (valAlert) valAlert.style.display = 'block';
      return;
    }
    evaluateAssessment();
  }

  function evaluateAssessment() {
    var correctCount = 0;
    var topicStats = {};
    var mistakes = [];

    Object.keys(TOPICS).forEach(function (tKey) {
      topicStats[tKey] = { total: 0, correct: 0 };
    });

    currentQuestions.forEach(function (q) {
      var userAns = userAnswers[q.id];
      var isCorrect = (userAns === q.correctIndex);

      if (!topicStats[q.topicId]) {
        topicStats[q.topicId] = { total: 0, correct: 0 };
      }
      topicStats[q.topicId].total++;

      if (isCorrect) {
        correctCount++;
        topicStats[q.topicId].correct++;
      } else {
        mistakes.push({
          question: q,
          selectedAnswer: userAns,
          correctAnswer: q.correctIndex
        });
      }
    });

    var scorePct = Math.round((correctCount / currentQuestions.length) * 100);
    var strongTopics = [];
    var weakTopics = [];

    Object.keys(topicStats).forEach(function (tId) {
      var stat = topicStats[tId];
      if (stat.total > 0) {
        var pct = Math.round((stat.correct / stat.total) * 100);
        var meta = TOPICS[tId] || { name: tId, shortName: tId };
        var obj = {
          topicId: tId,
          name: meta.name,
          shortName: meta.shortName,
          total: stat.total,
          correct: stat.correct,
          percentage: pct
        };
        if (pct >= 75) {
          strongTopics.push(obj);
        } else {
          weakTopics.push(obj);
        }
      }
    });

    weakTopics.sort(function (a, b) { return a.percentage - b.percentage; });
    strongTopics.sort(function (a, b) { return b.percentage - a.percentage; });

    currentAssessmentMeta.targetWeaknessTopicIds = weakTopics.map(function (w) { return w.topicId; });
    if (currentAssessmentMeta.targetWeaknessTopicIds.length === 0 && mistakes.length > 0) {
      currentAssessmentMeta.targetWeaknessTopicIds = mistakes.map(function (m) { return m.question.topicId; });
    }

    var history = getHistory();
    var lastAttempt = history.length > 0 ? history[0] : null;
    var delta = lastAttempt ? (scorePct - lastAttempt.percentage) : null;

    var attemptRecord = {
      id: 'att_' + Date.now(),
      timestamp: Date.now(),
      dateFormatted: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      score: correctCount,
      total: currentQuestions.length,
      percentage: scorePct,
      mode: currentAssessmentMeta.mode,
      focusTopic: currentAssessmentMeta.focusTopic,
      weakTopicNames: weakTopics.map(function (w) { return w.shortName; }),
      delta: delta
    };

    saveAttemptToHistory(attemptRecord);
    renderResultsView(attemptRecord, lastAttempt, strongTopics, weakTopics, mistakes);
  }

  function renderResultsView(attempt, lastAttempt, strongTopics, weakTopics, mistakes) {
    switchView('wResultsView');

    var scoreBig = document.getElementById('wScoreBig');
    if (scoreBig) scoreBig.textContent = attempt.percentage + '%';

    var headline = document.getElementById('wScoreHeadline');
    if (headline) {
      if (attempt.percentage >= 80) {
        headline.textContent = 'Outstanding WASSCE Policy & Admission Mastery';
      } else if (attempt.percentage >= 60) {
        headline.textContent = 'Solid Foundation with Targetable Knowledge Gaps';
      } else if (attempt.percentage >= 40) {
        headline.textContent = 'Moderate Risk: Credit Pass & Stream Gaps';
      } else {
        headline.textContent = 'Critical Admission & Aggregate Misconceptions';
      }
    }

    var frac = document.getElementById('wScoreFraction');
    if (frac) {
      frac.textContent = 'You answered ' + attempt.score + ' of ' + attempt.total + ' questions correctly.';
    }

    updateComparisonBox(attempt, lastAttempt);

    var strongList = document.getElementById('wStrongTopicsList');
    if (strongList) {
      strongList.innerHTML = '';
      if (strongTopics.length === 0) {
        strongList.innerHTML = '<div class="w-empty-note">No topics cleared the 75% strength threshold on this attempt. Review the step-by-step explanations below.</div>';
      } else {
        strongTopics.forEach(function (st) {
          var row = document.createElement('div');
          row.className = 'w-topic-badge-row strong';
          row.innerHTML = [
            '<span>' + st.name + '</span>',
            '<span class="w-topic-score">' + st.correct + '/' + st.total + ' (' + st.percentage + '%)' + '</span>'
          ].join('');
          strongList.appendChild(row);
        });
      }
    }

    var weakList = document.getElementById('wWeakTopicsList');
    if (weakList) {
      weakList.innerHTML = '';
      if (weakTopics.length === 0) {
        weakList.innerHTML = '<div class="w-empty-note green">Excellent. All assessed topics scored 75% or higher. Zero critical weaknesses detected!</div>';
      } else {
        weakTopics.forEach(function (wt) {
          var row = document.createElement('div');
          row.className = 'w-topic-badge-row weak';
          row.innerHTML = [
            '<span>' + wt.name + '</span>',
            '<span class="w-topic-score">' + wt.correct + '/' + wt.total + ' (' + wt.percentage + '%)' + '</span>'
          ].join('');
          weakList.appendChild(row);
        });
      }
    }

    var practiceCard = document.getElementById('wPracticeBanner');
    var practiceCount = document.getElementById('wWeakCount');
    if (practiceCard) {
      if (weakTopics.length > 0) {
        practiceCard.style.display = 'flex';
        if (practiceCount) {
          practiceCount.textContent = weakTopics.length + ' identified area' + (weakTopics.length > 1 ? 's' : '');
        }
      } else {
        practiceCard.style.display = 'none';
      }
    }

    renderReviewList();
    renderHistoryList();
    renderHistoryPreview();

    var sec = document.getElementById('weaknessAssessmentSection');
    if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function updateComparisonBox(currentAttempt, lastAttempt) {
    var compBox = document.getElementById('wComparisonBox');
    if (!compBox) return;

    if (!currentAttempt || !lastAttempt || currentAttempt.delta === null) {
      compBox.innerHTML = [
        '<div class="w-comp-wrap baseline">',
        '  <div class="w-comp-icon">',
        '    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
        '  </div>',
        '  <div class="w-comp-text">',
        '    <span class="w-comp-delta neutral">Initial Baseline Established</span>',
        '    <p>This diagnostic serves as your baseline. Practice your weak areas or retake the diagnostic later to measure your score improvement.</p>',
        '  </div>',
        '</div>'
      ].join('');
      return;
    }

    var delta = currentAttempt.delta;
    var statusClass = (delta > 0) ? 'improved' : ((delta < 0) ? 'regressed' : 'neutral');
    var deltaBadgeText = (delta > 0) ? ('+' + delta + '% Score Gain') : ((delta < 0) ? (delta + '% Score Shift') : 'Score Maintained (0%)');

    var explanation = '';
    if (delta > 0) {
      explanation = 'Impressive progress. You gained ' + delta + ' percentage points compared to your last attempt on ' + lastAttempt.dateFormatted + ' (' + lastAttempt.percentage + '%).';
    } else if (delta < 0) {
      explanation = 'Your score shifted down by ' + Math.abs(delta) + ' percentage points from your previous attempt on ' + lastAttempt.dateFormatted + ' (' + lastAttempt.percentage + '%). Focus on your identified weak areas below.';
    } else {
      explanation = 'You maintained the exact same score (' + currentAttempt.percentage + '%) as your prior test on ' + lastAttempt.dateFormatted + '.';
    }

    compBox.innerHTML = [
      '<div class="w-comp-wrap ' + statusClass + '">',
      '  <div class="w-comp-icon">',
      (delta > 0
        ? '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>'
        : (delta < 0
          ? '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"/></svg>'
          : '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/></svg>'
        )),
      '  </div>',
      '  <div class="w-comp-text">',
      '    <span class="w-comp-delta ' + statusClass + '">' + deltaBadgeText + '</span>',
      '    <p>' + explanation + '</p>',
      '  </div>',
      '</div>'
    ].join('');
  }

  function renderReviewList() {
    var reviewContainer = document.getElementById('wReviewList');
    if (!reviewContainer) return;
    reviewContainer.innerHTML = '';

    var letters = ['A', 'B', 'C', 'D'];
    currentQuestions.forEach(function (q, idx) {
      var userAns = userAnswers[q.id];
      var isCorrect = (userAns === q.correctIndex);

      var card = document.createElement('div');
      card.className = 'w-review-card ' + (isCorrect ? 'correct' : 'incorrect');

      var topicMeta = TOPICS[q.topicId] || { shortName: 'Curriculum' };

      var answerLines = [];
      if (isCorrect) {
        answerLines.push(
          '<div class="w-answer-line user correct">' +
          '  <strong>Your Answer (' + letters[userAns] + '):</strong> ' + q.options[userAns] +
          '</div>'
        );
      } else {
        answerLines.push(
          '<div class="w-answer-line user incorrect">' +
          '  <strong>Your Answer (' + (userAns !== undefined ? letters[userAns] : 'None') + '):</strong> ' +
          (userAns !== undefined ? q.options[userAns] : 'Skipped') +
          '</div>'
        );
        answerLines.push(
          '<div class="w-answer-line correct">' +
          '  <strong>Correct Answer (' + letters[q.correctIndex] + '):</strong> ' + q.options[q.correctIndex] +
          '</div>'
        );
      }

      card.innerHTML = [
        '<div class="w-review-card-head">',
        '  <span class="w-review-qnum">Question ' + (idx + 1) + ' &bull; ' + topicMeta.shortName + '</span>',
        '  <span class="w-verdict ' + (isCorrect ? 'correct' : 'incorrect') + '">' +
        (isCorrect ? 'Correct' : 'Incorrect') +
        '  </span>',
        '</div>',
        '<h4 class="w-review-prompt">' + q.question + '</h4>',
        '<div class="w-review-answers">' + answerLines.join('') + '</div>',
        '<div class="w-review-explanation">',
        '  <strong>WAEC Standard &amp; Explanation:</strong>',
        '  <p>' + q.explanation + '</p>',
        '</div>'
      ].join('');

      reviewContainer.appendChild(card);
    });
  }

  function renderHistoryList() {
    var histList = document.getElementById('wHistoryList');
    if (!histList) return;
    var history = getHistory();

    if (history.length === 0) {
      histList.innerHTML = '<div class="w-empty-note">No saved diagnostic runs yet.</div>';
      return;
    }

    histList.innerHTML = '';
    history.forEach(function (att) {
      var item = document.createElement('div');
      item.className = 'w-hist-item';

      var modeLabel = (att.mode === 'targeted_weakness')
        ? 'Targeted Weakness Practice'
        : ((att.focusTopic && att.focusTopic !== 'all' && TOPICS[att.focusTopic])
          ? TOPICS[att.focusTopic].shortName + ' Focus'
          : 'Comprehensive 10-Question Diagnostic');

      var weakStr = (att.weakTopicNames && att.weakTopicNames.length > 0)
        ? ('Gaps: ' + att.weakTopicNames.join(', '))
        : 'Zero critical weaknesses';

      var deltaBadge = '';
      if (att.delta !== null && att.delta !== undefined) {
        var dSign = (att.delta > 0) ? '+' : '';
        var dClass = (att.delta > 0) ? 'pos' : ((att.delta < 0) ? 'neg' : 'zero');
        deltaBadge = '<span class="w-hist-delta ' + dClass + '">' + dSign + att.delta + '%</span>';
      }

      item.innerHTML = [
        '<div class="w-hist-left">',
        '  <span class="w-hist-date">' + att.dateFormatted + '</span>',
        '  <span class="w-hist-mode">' + modeLabel + '</span>',
        '  <span class="w-hist-weaks">' + weakStr + '</span>',
        '</div>',
        '<div class="w-hist-right">',
        '  <span class="w-hist-score">' + att.percentage + '%</span>',
        deltaBadge,
        '</div>'
      ].join('');

      histList.appendChild(item);
    });
  }

  function renderHistoryPreview() {
    var previewBox = document.getElementById('wHistoryPreview');
    if (!previewBox) return;
    var history = getHistory();
    if (history.length === 0) {
      previewBox.innerHTML = '';
      return;
    }
    var last = history[0];
    previewBox.innerHTML = [
      '<div class="w-hist-mini-banner">',
      '  <span class="w-mini-label">Latest Diagnostic:</span>',
      '  <strong>' + last.percentage + '%</strong> (' + last.score + '/' + last.total + ')',
      '  <span class="w-mini-date">on ' + last.dateFormatted + '</span>',
      (last.weakTopicNames && last.weakTopicNames.length > 0 ? (' &bull; Gaps: ' + last.weakTopicNames.join(', ')) : ''),
      '</div>'
    ].join('');
  }

  function initWeaknessUI() {
    var calcWrap = document.querySelector('.calc-wrap .container-narrow');
    if (!calcWrap) return;
    if (document.getElementById('weaknessAssessmentSection')) return;

    // 1. Add "Find My Weaknesses" button to form action row
    var form = document.getElementById('wassceForm');
    var actionRow = form ? (form.querySelector('.action-row') || form.querySelector('button[type="submit"]').parentElement) : document.querySelector('.action-row');
    if (actionRow && !document.getElementById('findWeaknessesBtn')) {
      var findBtn = document.createElement('button');
      findBtn.type = 'button';
      findBtn.id = 'findWeaknessesBtn';
      findBtn.className = 'btn-secondary btn-find-weakness';
      findBtn.innerHTML = '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg><span>Find My Weaknesses</span>';
      findBtn.addEventListener('click', function () {
        openWeaknessSection();
      });
      actionRow.appendChild(findBtn);
    }

    // 2. Add Callout Banner in Results Section
    var resultsEl = document.getElementById('results');
    if (resultsEl && !document.getElementById('weaknessCalloutBanner')) {
      var callout = document.createElement('div');
      callout.id = 'weaknessCalloutBanner';
      callout.className = 'weakness-banner-card';
      callout.innerHTML = [
        '<div class="w-banner-content">',
        '  <h3 class="w-banner-title">Diagnose Your WASSCE Weaknesses</h3>',
        '  <p class="w-banner-desc">Take a personalized 10-question diagnostic based on your entered grades to discover knowledge gaps before tertiary admissions.</p>',
        '</div>',
        '<button type="button" id="launchWeaknessFromResults" class="btn-secondary btn-find-weakness w-banner-btn">',
        '  <svg width="18" height="18" fill="none" stroke="#f59e0b" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
        '  <span>Find My Weaknesses</span>',
        '</button>'
      ].join('');;
      resultsEl.appendChild(callout);

      document.getElementById('launchWeaknessFromResults').addEventListener('click', function () {
        openWeaknessSection();
      });
    }

    // 3. Create Main Weakness Assessment Container
    var section = document.createElement('section');
    section.id = 'weaknessAssessmentSection';
    section.className = 'weakness-section';
    section.style.display = 'none';
    section.setAttribute('aria-live', 'polite');

    section.innerHTML = [
      '<div class="weakness-card">',
      '  <!-- Screen 1: Diagnostic Intro & Topic Selection -->',
      '  <div id="wIntroView" class="w-view">',
      '    <div class="w-header">',
      '      <span class="w-eyebrow">AfriWidget Diagnostic Engine</span>',
      '      <div class="w-header-title-row">',
      '        <h3 class="w-title">Find My WASSCE Weaknesses</h3>',
      '        <button type="button" id="wCloseIntroBtn" class="w-close-btn" aria-label="Close diagnostic">&times;</button>',
      '      </div>',
      '      <p class="w-subtitle">A deterministic 10-question assessment testing your understanding of WAEC 9-point grading, core subject mandatory rules, the C6 credit benchmark, and faculty subject stream prerequisites.</p>',
      '    </div>',
      '    <div id="wContextNotice" class="w-context-card"></div>',
      '    <div class="w-topic-select-wrap">',
      '      <label for="wTopicSelect" class="w-label">Select diagnostic focus:</label>',
      '      <select id="wTopicSelect" class="w-form-select">',
      '        <option value="all" selected>All Topics (Comprehensive 10-Question Balanced Diagnostic)</option>',
      '        <option value="grade_points_mapping">WASSCE 9-Point Numerical Scale &amp; Grade Mapping</option>',
      '        <option value="core_electives_rule">The "Best 6 Subjects" Rule &amp; Mandatory Core Requirements</option>',
      '        <option value="credit_pass_threshold">The C6 (50%) Credit Pass Benchmark for Tertiary Admission</option>',
      '        <option value="stream_elective_rules">Subject Combinations by Academic Faculty Streams</option>',
      '        <option value="transcripts_combining_sittings">Combining Two Sittings &amp; WAEC Verification Regulations</option>',
      '      </select>',
      '    </div>',
      '    <div id="wHistoryPreview" class="w-history-preview"></div>',
      '    <div class="w-btn-row">',
      '      <button type="button" id="wStartBtn" class="btn-primary w-full-btn">',
      '        <span>Start 10-Question Diagnostic</span>',
      '        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>',
      '      </button>',
      '    </div>',
      '  </div>',

      '  <!-- Screen 2: Active 10-Question Assessment -->',
      '  <div id="wQuizView" class="w-view" style="display:none;">',
      '    <div class="w-quiz-top">',
      '      <div class="w-quiz-info">',
      '        <span id="wQuizBadge" class="w-tag">Comprehensive Diagnostic</span>',
      '        <span class="w-quiz-counter">Question <strong id="wCurrentQNum">1</strong> of 10</span>',
      '      </div>',
      '      <div class="w-progress-track">',
      '        <div id="wProgressBar" class="w-progress-fill" style="width: 10%;"></div>',
      '      </div>',
      '    </div>',
      '    <div class="w-question-box">',
      '      <span id="wQuestionTopic" class="w-question-topic">Topic</span>',
      '      <h4 id="wQuestionText" class="w-question-title">Question prompt</h4>',
      '      <div id="wOptionsContainer" class="w-options-grid" role="radiogroup" aria-label="Question options"></div>',
      '    </div>',
      '    <div id="wQuizValidation" class="w-validation-alert" style="display:none;">Please select an option before continuing.</div>',
      '    <div class="w-quiz-nav">',
      '      <button type="button" id="wPrevBtn" class="btn-secondary" disabled>Previous</button>',
      '      <button type="button" id="wNextBtn" class="btn-primary">Next Question</button>',
      '      <button type="button" id="wSubmitBtn" class="btn-primary" style="display:none;">Submit Assessment</button>',
      '    </div>',
      '  </div>',

      '  <!-- Screen 3: Results, Weaknesses & Explanations Dashboard -->',
      '  <div id="wResultsView" class="w-view" style="display:none;">',
      '    <div class="w-results-header">',
      '      <span class="w-eyebrow">Diagnostic Assessment Results</span>',
      '      <div class="w-results-score-wrap">',
      '        <div class="w-results-score-big" id="wScoreBig">0%</div>',
      '        <div class="w-score-meta">',
      '          <h3 id="wScoreHeadline" class="w-score-headline"></h3>',
      '          <p id="wScoreFraction" class="w-score-fraction"></p>',
      '        </div>',
      '      </div>',
      '    </div>',

      '    <div id="wComparisonBox" class="w-comparison-card"></div>',

      '    <div class="w-analysis-grid">',
      '      <div class="w-analysis-card w-card-strong">',
      '        <div class="w-card-head">',
      '          <svg width="20" height="20" fill="none" stroke="#16a34a" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      '          <h4>Strongest Topics (&ge;75% Accuracy)</h4>',
      '        </div>',
      '        <div id="wStrongTopicsList" class="w-analysis-list"></div>',
      '      </div>',
      '      <div class="w-analysis-card w-card-weak">',
      '        <div class="w-card-head">',
      '          <svg width="20" height="20" fill="none" stroke="#dc2626" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
      '          <h4>Identified Weaknesses (&lt;75% Accuracy)</h4>',
      '        </div>',
      '        <div id="wWeakTopicsList" class="w-analysis-list"></div>',
      '      </div>',
      '    </div>',

      '    <div id="wPracticeBanner" class="w-practice-banner">',
      '      <div class="w-practice-banner-text">',
      '        <h4>Focus on Your Weak Areas</h4>',
      '        <p>Targeted practice isolates your <strong id="wWeakCount">identified gaps</strong> with fresh questions to build mastery before tertiary applications.</p>',
      '      </div>',
      '      <button type="button" id="wPracticeBtn" class="w-practice-btn">',
      '        <span>Practise My Weaknesses</span>',
      '        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
      '      </button>',
      '    </div>',

      '    <div class="w-review-section">',
      '      <div class="w-review-head">',
      '        <h4 class="w-review-title">Step-by-Step Question Review &amp; Explanations</h4>',
      '        <span class="w-review-sub">Review every answer and official WAEC grading policy rationale</span>',
      '      </div>',
      '      <div id="wReviewList" class="w-review-list"></div>',
      '    </div>',

      '    <div class="w-history-section">',
      '      <div class="w-history-head">',
      '        <h4 class="w-history-title">Assessment History &amp; Progress</h4>',
      '        <button type="button" id="wClearHistBtn" class="w-clear-link">Clear History</button>',
      '      </div>',
      '      <div id="wHistoryList" class="w-history-list"></div>',
      '    </div>',

      '    <div class="w-results-footer">',
      '      <button type="button" id="wRetakeBtn" class="btn-secondary">Retake Full Diagnostic</button>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('');

    calcWrap.appendChild(section);
    bindEvents();
    renderHistoryPreview();
  }

  function bindEvents() {
    var closeIntroBtn = document.getElementById('wCloseIntroBtn');
    if (closeIntroBtn) closeIntroBtn.addEventListener('click', closeWeaknessSection);

    var startBtn = document.getElementById('wStartBtn');
    if (startBtn) {
      startBtn.addEventListener('click', function () {
        var sel = document.getElementById('wTopicSelect');
        var focus = sel ? sel.value : 'all';
        startNewAssessment('diagnostic', focus);
      });
    }

    var nextBtn = document.getElementById('wNextBtn');
    if (nextBtn) nextBtn.addEventListener('click', advanceQuestion);

    var prevBtn = document.getElementById('wPrevBtn');
    if (prevBtn) prevBtn.addEventListener('click', retreatQuestion);

    var submitBtn = document.getElementById('wSubmitBtn');
    if (submitBtn) submitBtn.addEventListener('click', submitAssessment);

    var practiceBtn = document.getElementById('wPracticeBtn');
    if (practiceBtn) {
      practiceBtn.addEventListener('click', function () {
        startNewAssessment('targeted_weakness', 'all');
      });
    }

    var retakeBtn = document.getElementById('wRetakeBtn');
    if (retakeBtn) {
      retakeBtn.addEventListener('click', function () {
        switchView('wIntroView');
        updateContextNotice();
        var sec = document.getElementById('weaknessAssessmentSection');
        if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    var clearBtn = document.getElementById('wClearHistBtn');
    if (clearBtn) clearBtn.addEventListener('click', clearHistory);
  }

  function openWeaknessSection() {
    var sec = document.getElementById('weaknessAssessmentSection');
    if (sec) {
      sec.style.display = 'block';
      switchView('wIntroView');
      updateContextNotice();
      renderHistoryPreview();
      sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function closeWeaknessSection() {
    var sec = document.getElementById('weaknessAssessmentSection');
    if (sec) sec.style.display = 'none';
  }

  function updateContextNotice() {
    var noticeEl = document.getElementById('wContextNotice');
    if (!noticeEl) return;
    var ctx = getWassceInputsContext();

    var iconSvg = '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
    if (ctx.status === 'warning' || ctx.status === 'danger') {
      iconSvg = '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>';
    } else if (ctx.status === 'success') {
      iconSvg = '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
    }

    noticeEl.className = 'w-context-card ' + ctx.status;
    noticeEl.innerHTML = [
      '<div class="w-context-head">',
      iconSvg,
      '  <strong>' + ctx.title + '</strong>',
      '</div>',
      '<p class="w-context-desc">' + ctx.text + '</p>'
    ].join('');

    var sel = document.getElementById('wTopicSelect');
    if (sel && ctx.recommendedTopic && ctx.recommendedTopic !== 'all') {
      sel.value = ctx.recommendedTopic;
    }
  }

  // Self initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWeaknessUI);
  } else {
    initWeaknessUI();
  }
})();
