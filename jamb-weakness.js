/**
 * AfriWidget Nigerian JAMB UTME & University Aggregate "Find My Weaknesses" Diagnostic Engine
 * Pure vanilla JavaScript. Zero dependencies, zero emojis, zero tracking.
 * 100% deterministic marking, localized storage, and targeted weakness practice.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'afriwidget_jamb_weakness_history';

  var TOPICS = {
    utme_scoring_mechanics: {
      id: 'utme_scoring_mechanics',
      name: 'JAMB UTME 400-Mark Scale & Sectional Weighting',
      shortName: 'UTME 400 Scale'
    },
    aggregate_formula_models: {
      id: 'aggregate_formula_models',
      name: 'Institutional Screening & Aggregate Calculation Models',
      shortName: 'Aggregate Formulas & Models'
    },
    cutoff_marks_caps: {
      id: 'cutoff_marks_caps',
      name: 'JAMB National Cutoff, CAPS & Departmental Benchmarks',
      shortName: 'Cutoffs & CAPS Portal'
    },
    olevel_sitting_penalties: {
      id: 'olevel_sitting_penalties',
      name: 'O\'Level Prerequisites, Combinations & Sitting Policies',
      shortName: 'O\'Level & Sitting Rules'
    },
    catchment_elds_quotas: {
      id: 'catchment_elds_quotas',
      name: 'Merit List, Catchment Area & ELDS Quota Dynamics',
      shortName: 'Quotas & Catchment Areas'
    }
  };

  var QUESTION_BANK = [
    // --- TOPIC 1: UTME 400 Scale ---
    {
      id: 'jmb_utme_1',
      topicId: 'utme_scoring_mechanics',
      question: 'What is the total maximum attainable score on the Joint Admissions and Matriculation Board (JAMB) Unified Tertiary Matriculation Examination (UTME)?',
      options: [
        '100 marks',
        '300 marks',
        '400 marks',
        '500 marks'
      ],
      correctIndex: 2,
      explanation: 'The standard JAMB UTME examination consists of four subjects (Use of English plus three relevant subjects), each contributing to a cumulative maximum score of 400 marks.'
    },
    {
      id: 'jmb_utme_2',
      topicId: 'utme_scoring_mechanics',
      question: 'In the JAMB UTME Computer-Based Test (CBT), how is the Use of English paper structured compared to the other three subjects?',
      options: [
        'Use of English contains 60 questions, while each of the other three subjects contains 40 questions',
        'All four subjects have exactly 50 questions each',
        'Use of English contains 100 questions, and the other three subjects have 20 questions each',
        'Use of English is an essay test with no multiple-choice questions'
      ],
      correctIndex: 0,
      explanation: 'Under JAMB CBT structure, Use of English comprises 60 questions (comprehension, cloze passages, lexis and structure, and prescribed literature), whereas the three chosen subject papers comprise 40 questions each, totaling 180 questions across 2 hours.'
    },
    {
      id: 'jmb_utme_3',
      topicId: 'utme_scoring_mechanics',
      question: 'Does JAMB apply negative marking (deducting marks for incorrect answers) on the UTME CBT?',
      options: [
        'Yes, half a mark is deducted for every wrong answer',
        'No, there is zero negative marking; incorrect answers simply receive zero marks without penalty',
        'Only in Mathematics and Physics',
        'Only for candidates who finish early'
      ],
      correctIndex: 1,
      explanation: 'JAMB does not penalize incorrect guesses with negative marks. Raw scores are computed on correct responses and scaled statistically using psychometric item response calibrations.'
    },
    {
      id: 'jmb_utme_4',
      topicId: 'utme_scoring_mechanics',
      question: 'What is the validity period of a standard JAMB UTME result for university admission?',
      options: [
        'One academic admission cycle (one year)',
        'Three academic years',
        'Five academic years',
        'Permanent for life like WAEC'
      ],
      correctIndex: 0,
      explanation: 'Under current legislation, a JAMB UTME result is valid solely for the single academic admission year in which it was written. If an applicant is not admitted, they must register for and write the subsequent UTME.'
    },
    {
      id: 'jmb_utme_5',
      topicId: 'utme_scoring_mechanics',
      question: 'If a candidate selects an incorrect UTME subject combination for their desired course (e.g. Commerce instead of Chemistry for Nursing Science), what will occur during admission?',
      options: [
        'The university will automatically replace the Commerce score with 50 marks in Chemistry',
        'The candidate will be automatically disqualified from Nursing Science by JAMB CAPS because the statutory subject combination was breached',
        'The candidate is given an automatic admission into Law',
        'JAMB will waive the prerequisite if the total UTME score is above 300'
      ],
      correctIndex: 1,
      explanation: 'JAMB Central Admissions Processing System (CAPS) enforces rigid subject combination rules. Nursing requires English, Physics, Chemistry, and Biology. Choosing a non-compliant subject results in automated disqualification on the portal.'
    },
    {
      id: 'jmb_utme_6',
      topicId: 'utme_scoring_mechanics',
      question: 'How does JAMB calculate the national percentile ranking published alongside the UTME score?',
      options: [
        'By dividing the candidate\'s score by the highest score in the country',
        'By measuring the percentage of all test-takers across the federation who scored below that candidate\'s mark',
        'By averaging the candidate\'s high school terminal exams',
        'By ranking candidates solely by their birth month'
      ],
      correctIndex: 1,
      explanation: 'Percentile ranking represents the proportion of the entire national candidate pool that scored lower than the specific test-taker, demonstrating relative competitive standing regardless of raw score difficulty.'
    },

    // --- TOPIC 2: Aggregate Formulas & Models ---
    {
      id: 'jmb_agg_1',
      topicId: 'aggregate_formula_models',
      question: 'In the popular University of Lagos (UNILAG) 50:30:20 composite aggregate formula, what do the three percentage weights represent?',
      options: [
        '50% UTME, 30% Post-UTME, and 20% Five O\'Level Credits',
        '50% O\'Level, 30% UTME, and 20% Oral Interview',
        '50% Post-UTME, 30% UTME, and 20% State Quota',
        '50% First Choice, 30% Second Choice, and 20% Remedial'
      ],
      correctIndex: 0,
      explanation: 'UNILAG computes a 100% composite score: UTME score divided by 8 (max 50%), Post-UTME test out of 30%, and Five O\'Level credits mapped to points (max 20%: A1=4.0, B2=3.6, B3=3.2, C4=2.8, C5=2.4, C6=2.0 points).'
    },
    {
      id: 'jmb_agg_2',
      topicId: 'aggregate_formula_models',
      question: 'A student scores 280 in JAMB UTME. What is their UTME score scaled to a 50-point basis in a 50:50 screening model?',
      options: [
        '28.0 points',
        '35.0 points',
        '40.0 points',
        '42.5 points'
      ],
      correctIndex: 1,
      explanation: 'To scale a 400-point UTME score to 50 points, divide the UTME score by 8 (or multiply by 50 ÷ 400 = 0.125). 280 ÷ 8 = 35.0 points.'
    },
    {
      id: 'jmb_agg_3',
      topicId: 'aggregate_formula_models',
      question: 'In universities that do not conduct a physical Post-UTME test (screening solely with UTME and O\'Level grades), how are O\'Level grades typically graded into points?',
      options: [
        'A1 is awarded 100 points and C6 is awarded 10 points',
        'A sliding grade point scale (e.g. A1=4 or 6 points, B2=3.6 or 5 points, down to C6=2 points) across five relevant subjects',
        'All credits from A1 to C6 receive the identical flat 10 points',
        'Only English Language receives points; other subjects are ignored'
      ],
      correctIndex: 1,
      explanation: 'Institutions using O\'Level screening convert the best five relevant subjects into numerical points. High grades (A1, B2) provide a critical point buffer against competitors who achieved mostly C6 passes.'
    },
    {
      id: 'jmb_agg_4',
      topicId: 'aggregate_formula_models',
      question: 'If a university uses a 50:50 model (50% UTME and 50% Post-UTME) and a candidate scores 320 in UTME and 64% in Post-UTME, what is the composite aggregate score?',
      options: [
        '68.0%',
        '72.0%',
        '75.0%',
        '80.0%'
      ],
      correctIndex: 1,
      explanation: 'UTME contribution = 320 ÷ 8 = 40.0 points. Post-UTME contribution = 64 ÷ 2 = 32.0 points. Total composite = 40.0 + 32.0 = 72.0%.'
    },
    {
      id: 'jmb_agg_5',
      topicId: 'aggregate_formula_models',
      question: 'Why do composite aggregate calculators provide such valuable insight to Nigerian tertiary applicants?',
      options: [
        'Because JAMB requires all candidates to print aggregate calculations on green paper',
        'Because having a high UTME score does not guarantee admission if an applicant underperforms in Post-UTME or has weak O\'Level points',
        'Because calculators automatically submit the applicant\'s banking details to the university',
        'Because aggregate calculators can alter marks in the JAMB database'
      ],
      correctIndex: 1,
      explanation: 'Final admission cutoffs are decided on composite aggregate scores, not UTME alone. A candidate with 290 UTME can be overtaken by a candidate with 260 UTME who scores 85% in Post-UTME and has straight A1s in O\'Level.'
    },
    {
      id: 'jmb_agg_6',
      topicId: 'aggregate_formula_models',
      question: 'In the University of Ibadan (UI) admission screening model, how is the composite aggregate calculated?',
      options: [
        'UTME is divided by 8 (50 marks) and added directly to the Post-UTME score (50 marks), totaling 100 marks',
        'Only O\'Level results are scored; UTME is discarded',
        'Post-UTME counts for 90% and UTME counts for 10%',
        'Candidates are ranked purely by secondary school fees paid'
      ],
      correctIndex: 0,
      explanation: 'The University of Ibadan (UI) employs an equal 50:50 weighting: UTME score is divided by 8 (50%) and the UI Post-UTME test score is scaled out of 50%, producing a total composite out of 100%.'
    },

    // --- TOPIC 3: Cutoffs & CAPS Portal ---
    {
      id: 'jmb_cut_1',
      topicId: 'cutoff_marks_caps',
      question: 'What is the critical distinction between the JAMB National Minimum Benchmark and an Institutional / Departmental Cutoff Mark?',
      options: [
        'There is no difference; they are always the exact same number',
        'The JAMB benchmark is merely the lowest floor allowing an institution to consider an applicant (e.g. 140), whereas departmental cutoffs (e.g. 250 for Medicine) reflect the actual competitive score needed for selection',
        'The JAMB benchmark applies only to private universities',
        'Departmental cutoffs are decided by the federal Ministry of Finance'
      ],
      correctIndex: 1,
      explanation: 'JAMB sets a regulatory baseline (e.g., 140 for universities). However, individual universities and competitive departments (Medicine, Law, Nursing, Engineering) establish much higher internal departmental cutoffs to match capacity.'
    },
    {
      id: 'jmb_cut_2',
      topicId: 'cutoff_marks_caps',
      question: 'On the JAMB Central Admissions Processing System (CAPS) portal, what action must a candidate take when offered admission?',
      options: [
        'They must physically travel to JAMB headquarters in Bwari, Abuja',
        'They must log in to CAPS and click Accept or Reject within the prescribed deadline window',
        'No action is required; admission is finalized automatically after 1 hour',
        'They must write another examination'
      ],
      correctIndex: 1,
      explanation: 'When a university recommends an applicant and JAMB approves it, the offer appears on CAPS. The candidate must explicitly click Accept to lock in the admission and generate the formal JAMB Admission Letter.'
    },
    {
      id: 'jmb_cut_3',
      topicId: 'cutoff_marks_caps',
      question: 'What is the Marketplace feature on the JAMB CAPS portal?',
      options: [
        'An online store where students buy textbooks and laptops',
        'A platform where institutions with unfilled quotas can browse and propose admission offers to qualified candidates who were not admitted by their first choice',
        'A forum where students bid money for exam grades',
        'A job recruitment portal for university graduates'
      ],
      correctIndex: 1,
      explanation: 'The CAPS Marketplace enables universities, polytechnics, and colleges that have surplus seats to identify and make offers to unplaced candidates whose subject combinations and scores meet their criteria.'
    },
    {
      id: 'jmb_cut_4',
      topicId: 'cutoff_marks_caps',
      question: 'If a candidate is offered a programme different from the one they initially applied for (e.g. offered Biochemistry instead of Medicine), what must they do before accepting on CAPS?',
      options: [
        'Accept immediately without doing anything else',
        'Process an official Change of Course / Programme on the JAMB portal so their admission record matches the new programme',
        'Refuse to matriculate and demand an appeal in court',
        'Pay for a second UTME registration form'
      ],
      correctIndex: 1,
      explanation: 'Before accepting an alternative course offered via CAPS Transfer Approval, the student must execute an official Change of Course on the JAMB portal so the JAMB Admission Letter reflects the actual degree programme.'
    },
    {
      id: 'jmb_cut_5',
      topicId: 'cutoff_marks_caps',
      question: 'What happens if an admission offer on JAMB CAPS is ignored and neither accepted nor rejected?',
      options: [
        'The offer stays active forever',
        'After a designated grace period, the offer expires and is returned to the pool, preventing the student from receiving a JAMB Admission Letter',
        'The candidate is awarded a national prize',
        'The university changes the degree to a PhD'
      ],
      correctIndex: 1,
      explanation: 'Offers on CAPS carry expiration windows. Failing to accept an offer within the stipulated period results in forfeiture, and the seat is reallocated to another candidate on the waiting list.'
    },
    {
      id: 'jmb_cut_6',
      topicId: 'cutoff_marks_caps',
      question: 'Why is uploading O\'Level results to the JAMB portal mandatory for CAPS consideration?',
      options: [
        'It is optional and only recommended for international students',
        'CAPS will not propose or clear any applicant for admission if verified O\'Level results are not confirmed on their central JAMB profile',
        'It is only used to send SMS birthday greetings',
        'Because JAMB sells the certificates to third parties'
      ],
      correctIndex: 1,
      explanation: 'Statutory policy mandates that candidates have their O\'Level results uploaded and verified by accredited CBT centres. An applicant with Awaiting Result (AR) status cannot be processed or offered admission on CAPS.'
    },

    // --- TOPIC 4: O'Level & Sitting Rules ---
    {
      id: 'jmb_olevel_1',
      topicId: 'olevel_sitting_penalties',
      question: 'What is the standard minimum O\'Level requirement for university degree admission across Nigerian institutions?',
      options: [
        'Five credit passes (A1-C6) in relevant subjects, including English Language and Mathematics, in not more than two sittings',
        'Passing all subjects in one sitting with distinctions',
        'Three passes in any subject',
        'A pass in English Language only'
      ],
      correctIndex: 0,
      explanation: 'The statutory NUC baseline mandates five credit passes (A1 to C6) in subjects directly relevant to the discipline, with compulsory credits in English Language and Mathematics (with rare exceptions for pure indigenous languages).'
    },
    {
      id: 'jmb_olevel_2',
      topicId: 'olevel_sitting_penalties',
      question: 'Do universities like the University of Ibadan (UI) or UNILAG apply point penalties to candidates presenting two sittings of O\'Level?',
      options: [
        'No, two sittings always receive the exact same points as one sitting everywhere',
        'Yes, some institutions award bonus points for a single sitting or apply point deductions / require single-sitting compliance for elite faculties like Medicine',
        'Two sittings are illegal across all universities in Nigeria',
        'Two sittings are awarded double points'
      ],
      correctIndex: 1,
      explanation: 'In competitive screening formulas (e.g. at UI, UNILAG, or LASU), one sitting often yields higher composite points (e.g., maximum points awarded only if all credits were obtained in one sitting, or requiring one sitting for MBChB).'
    },
    {
      id: 'jmb_olevel_3',
      topicId: 'olevel_sitting_penalties',
      question: 'Which of the following examination bodies can be combined for O\'Level credit verification at Nigerian universities?',
      options: [
        'WAEC and NECO, or WAEC and NABTEB (where accepted by faculty)',
        'Only WAEC can ever be used',
        'NECO is not recognized by federal universities',
        'Only primary school leaving certificates can be combined'
      ],
      correctIndex: 0,
      explanation: 'Almost all Nigerian universities permit the combination of results from WAEC (WASSCE) and NECO (SSCE). NABTEB is widely accepted for technical, vocational, and science courses, but occasionally restricted by certain faculties of law.'
    },
    {
      id: 'jmb_olevel_4',
      topicId: 'olevel_sitting_penalties',
      question: 'If an applicant achieves A1 in four subjects but scores D7 in Mathematics when applying for B.Sc. Economics, what is their status?',
      options: [
        'Admitted because Economics is in the Social Sciences, not Science',
        'Disqualified because Mathematics is a compulsory prerequisite subject for Economics requiring a minimum credit pass (C6)',
        'Admitted with an automatic waiver',
        'Admitted if they pass an internal sports trial'
      ],
      correctIndex: 1,
      explanation: 'Economics is heavily quantitative (microeconomics, macroeconomics, econometrics). Faculties of Social Science mandate at least a credit pass (C6) in O\'Level Mathematics. A D7 pass is insufficient for admission.'
    },
    {
      id: 'jmb_olevel_5',
      topicId: 'olevel_sitting_penalties',
      question: 'Can a candidate register for UTME while awaiting their O\'Level results (Awaiting Result - AR)?',
      options: [
        'No, candidates cannot register for UTME without certificates in hand',
        'Yes, candidates can register with AR status, but they must upload their verified results to CAPS immediately upon release to be considered for admission',
        'Yes, but they are only allowed to apply for diplomas',
        'Yes, but they cannot score higher than 200 in UTME'
      ],
      correctIndex: 1,
      explanation: 'JAMB allows candidates to write UTME with Awaiting Result (AR). However, the candidate must upload their released results onto the JAMB portal before their chosen institution concludes its admission screening exercises.'
    },
    {
      id: 'jmb_olevel_6',
      topicId: 'olevel_sitting_penalties',
      question: 'What is the numerical point difference between an A1 (4.0 points) and a C6 (2.0 points) in a standard 5-subject O\'Level screening matrix?',
      options: [
        '0.5 points',
        '2.0 points per subject, meaning straight A1s provide a 10-point advantage over straight C6s',
        '5.0 points per subject',
        'No difference; all passes count equally'
      ],
      correctIndex: 1,
      explanation: 'Under a standard 4.0-to-2.0 point scale, an A1 provides 4.0 points and a C6 provides 2.0 points. Over five subjects, a student with 5 A1s achieves 20 points, whereas a student with 5 C6s achieves 10 points—a massive 10-point spread.'
    },

    // --- TOPIC 5: Quotas & Catchment Areas ---
    {
      id: 'jmb_quota_1',
      topicId: 'catchment_elds_quotas',
      question: 'What is the official Federal Government quota policy formula for admission into federal universities in Nigeria?',
      options: [
        '70% Merit, 20% Catchment, 10% Discretionary',
        '45% National Merit, 35% Catchment Area, and 20% Educationally Less Developed States (ELDS)',
        '50% State of Origin, 50% High School',
        '100% pure lottery'
      ],
      correctIndex: 1,
      explanation: 'Federal universities operate under the statutory 45:35:20 admission policy: 45% of seats are reserved strictly for National Merit (highest scores regardless of origin), 35% for Catchment Area states, and 20% for ELDS states.'
    },
    {
      id: 'jmb_quota_2',
      topicId: 'catchment_elds_quotas',
      question: 'How does a university\'s Catchment Area cutoff compare to its National Merit cutoff for the same degree programme?',
      options: [
        'Catchment cutoffs are always higher than National Merit cutoffs',
        'Catchment cutoffs are typically lower than National Merit cutoffs, giving indigenous applicants from geographically contiguous states a slight concession',
        'Catchment cutoffs are illegal and never published',
        'They are identical numbers for every single department'
      ],
      correctIndex: 1,
      explanation: 'National Merit cutoffs are the highest benchmarks because they compete across the entire country. Catchment area benchmarks are moderately lower, allowing qualified candidates from the host region to be admitted with lower aggregates.'
    },
    {
      id: 'jmb_quota_3',
      topicId: 'catchment_elds_quotas',
      question: 'What states are typically classified under the Educationally Less Developed States (ELDS) category in Nigerian tertiary admissions?',
      options: [
        'Lagos, Ogun, and Oyo States',
        'Northern states (e.g. Sokoto, Kebbi, Zamfara, Yobe, Borno, Bauchi) and certain southern states (e.g. Bayelsa, Ebonyi)',
        'Only foreign countries',
        'Federal Capital Territory only'
      ],
      correctIndex: 1,
      explanation: 'ELDS states include 23 states historically identified as having lower tertiary enrollment numbers (including Adamawa, Bauchi, Bayelsa, Benue, Borno, Cross River, Ebonyi, Gombe, Jigawa, Kano, Katsina, Kebbi, Kogi, Kwara, Nasarawa, Niger, Plateau, Rivers, Sokoto, Taraba, Yobe, and Zamfara).'
    },
    {
      id: 'jmb_quota_4',
      topicId: 'catchment_elds_quotas',
      question: 'If a candidate has a composite score high enough to make the National Merit cutoff, does their state of origin matter?',
      options: [
        'Yes, they are disqualified if they are not from the catchment area',
        'No, National Merit is 100% blind to state of origin, religion, or geopolitical zone; any candidate who hits the merit cutoff is admitted',
        'Yes, they must pay a non-indigene fee',
        'Only if they studied in a public school'
      ],
      correctIndex: 1,
      explanation: 'The 45% National Merit tier is strictly blind to geography. Any candidate who clears the merit benchmark is admitted on their academic strength, regardless of what state they come from.'
    },
    {
      id: 'jmb_quota_5',
      topicId: 'catchment_elds_quotas',
      question: 'How does a state-owned university (such as LASU, OOU, or DELSU) treat candidates from outside their home state?',
      options: [
        'They are legally prohibited from admitting any non-indigenes',
        'They typically allocate a large percentage (e.g. 70-80%) to state indigenes, while reserving a smaller quota (20-30%) for non-indigenes with higher competitive cutoffs',
        'Non-indigenes are admitted for free',
        'Non-indigenes cannot write Post-UTME'
      ],
      correctIndex: 1,
      explanation: 'State universities are funded by state taxpayers, so their admission policies give substantial priority to indigenes, typically maintaining an 70:30 or 80:20 indigene-to-non-indigene ratio with higher cutoffs for non-indigenes.'
    },
    {
      id: 'jmb_quota_6',
      topicId: 'catchment_elds_quotas',
      question: 'What document must a candidate present during physical university screening to prove eligibility for Catchment or State Quotas?',
      options: [
        'A receipt from a local grocery store',
        'An official Certificate of State of Origin or Local Government Identification Letter signed by their LGA authority',
        'A secondary school football certificate',
        'A high school library card'
      ],
      correctIndex: 1,
      explanation: 'To claim catchment or indigene quotas, universities require candidates to provide an authentic Local Government Area (LGA) Identification Certificate or State of Origin Certificate during physical verification.'
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

  function getJambInputsContext() {
    var jInp = document.getElementById('jambScore');
    var jVal = jInp ? parseFloat(jInp.value) : NaN;

    if (!isNaN(jVal) && jVal >= 0 && jVal <= 400) {
      if (jVal >= 280) {
        return {
          status: 'success',
          title: 'High Competitive UTME Score Detected (' + jVal + '/400)',
          text: 'Your UTME score puts you in contention for top-tier courses like Medicine, Law, Pharmacy, and Engineering. Test your understanding of institutional aggregate models, merit cutoffs, and catchment policies.',
          recommendedTopic: 'aggregate_formula_models'
        };
      } else if (jVal >= 200) {
        return {
          status: 'neutral',
          title: 'Competitive Gateway Score Detected (' + jVal + '/400)',
          text: 'You clear general federal university cutoff benchmarks. Focus on departmental cutoffs, O\'Level sitting point values, and CAPS admission workflows.',
          recommendedTopic: 'cutoff_marks_caps'
        };
      } else {
        return {
          status: 'warning',
          title: 'Borderline UTME Score Detected (' + jVal + '/400)',
          text: 'Your score is close to the minimum benchmark for state universities and polytechnics. Learn about CAPS Marketplace transfers and O\'Level point maximization.',
          recommendedTopic: 'olevel_sitting_penalties'
        };
      }
    }

    return {
      status: 'neutral',
      title: 'Comprehensive JAMB & Admission Screening Diagnostic',
      text: 'Evaluate your command of the UTME 400 scale, composite aggregate screening formulas (50:50 / 50:30:20), JAMB CAPS transfer mechanics, and federal quota rules.',
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
        headline.textContent = 'Outstanding UTME & Screening Aggregate Mastery';
      } else if (attempt.percentage >= 60) {
        headline.textContent = 'Solid Foundation with Targetable Knowledge Gaps';
      } else if (attempt.percentage >= 40) {
        headline.textContent = 'Moderate Risk: Cutoff & Quota Gaps Detected';
      } else {
        headline.textContent = 'Critical Admission & CAPS Misconceptions';
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
            '<span class="w-topic-score">' + st.correct + '/' + st.total + ' (' + st.percentage + '%)</span>'
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
            '<span class="w-topic-score">' + wt.correct + '/' + wt.total + ' (' + wt.percentage + '%)</span>'
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
        '  <strong>JAMB &amp; NUC Standard &amp; Explanation:</strong>',
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

    var form = document.getElementById('jambForm');
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

    var resultsEl = document.getElementById('results');
    if (resultsEl && !document.getElementById('weaknessCalloutBanner')) {
      var callout = document.createElement('div');
      callout.id = 'weaknessCalloutBanner';
      callout.className = 'weakness-banner-card';
      callout.innerHTML = [
        '<div class="w-banner-content">',
        '  <h3 class="w-banner-title">Diagnose Your JAMB &amp; Screening Weaknesses</h3>',
        '  <p class="w-banner-desc">Take a personalized 10-question diagnostic based on your entered scores and university screening formulas.</p>',
        '</div>',
        '<button type="button" id="launchWeaknessFromResults" class="btn-secondary btn-find-weakness w-banner-btn">',
        '  <svg width="18" height="18" fill="none" stroke="#f59e0b" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
        '  <span>Find My Weaknesses</span>',
      ].join('');
      var shareBar = document.getElementById('afriShareBar');
      var academicProgress = document.getElementById('afriAcademicProgress');
      var compareCard = document.getElementById('compareEntryCard');

      if (compareCard && compareCard.parentNode === resultsEl) {
        resultsEl.insertBefore(callout, compareCard);
      } else if (shareBar && shareBar.parentNode === resultsEl) {
        shareBar.insertAdjacentElement('afterend', callout);
      } else if (academicProgress && academicProgress.parentNode === resultsEl) {
        academicProgress.insertAdjacentElement('afterend', callout);
      } else {
        resultsEl.appendChild(callout);
      }
      if (typeof window.afriEnsureResultSectionsOrder === 'function') {
        window.afriEnsureResultSectionsOrder();
      }

      document.getElementById('launchWeaknessFromResults').addEventListener('click', function () {
        openWeaknessSection();
      });
    }

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
      '        <h3 class="w-title">Find My JAMB UTME Weaknesses</h3>',
      '        <button type="button" id="wCloseIntroBtn" class="w-close-btn" aria-label="Close diagnostic">&times;</button>',
      '      </div>',
      '      <p class="w-subtitle">A deterministic 10-question assessment testing your command of the UTME 400 scale, composite screening formulas (50:50, 60:40), JAMB CAPS transfer mechanics, and federal quota dynamics.</p>',
      '    </div>',
      '    <div id="wContextNotice" class="w-context-card"></div>',
      '    <div class="w-topic-select-wrap">',
      '      <label for="wTopicSelect" class="w-label">Select diagnostic focus:</label>',
      '      <select id="wTopicSelect" class="w-form-select">',
      '        <option value="all" selected>All Topics (Comprehensive 10-Question Balanced Diagnostic)</option>',
      '        <option value="utme_scoring_mechanics">JAMB UTME 400-Mark Scale &amp; Sectional Weighting</option>',
      '        <option value="aggregate_formula_models">Institutional Screening &amp; Aggregate Calculation Models</option>',
      '        <option value="cutoff_marks_caps">JAMB National Cutoff, CAPS &amp; Departmental Benchmarks</option>',
      '        <option value="olevel_sitting_penalties">O\'Level Prerequisites, Combinations &amp; Sitting Policies</option>',
      '        <option value="catchment_elds_quotas">Merit List, Catchment Area &amp; ELDS Quota Dynamics</option>',
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
      '        <p>Targeted practice isolates your <strong id="wWeakCount">identified gaps</strong> with fresh questions to build mastery before university screening.</p>',
      '      </div>',
      '      <button type="button" id="wPracticeBtn" class="w-practice-btn">',
      '        <span>Practise My Weaknesses</span>',
      '        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
      '      </button>',
      '    </div>',

      '    <div class="w-review-section">',
      '      <div class="w-review-head">',
      '        <h4 class="w-review-title">Step-by-Step Question Review &amp; Explanations</h4>',
      '        <span class="w-review-sub">Review every answer and official screening policy rationale</span>',
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
    var ctx = getJambInputsContext();

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
