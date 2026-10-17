/**
 * AfriWidget South African NSC Matric APS "Find My Weaknesses" Diagnostic Engine
 * Pure vanilla JavaScript. Zero dependencies, zero emojis, zero tracking.
 * 100% deterministic marking, localized storage, and targeted weakness practice.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'afriwidget_aps_weakness_history';

  var TOPICS = {
    lo_exclusion_rules: {
      id: 'lo_exclusion_rules',
      name: 'Life Orientation Scoring & University Exclusion Policies',
      shortName: 'Life Orientation Rules'
    },
    nsc_levels_scales: {
      id: 'nsc_levels_scales',
      name: 'NSC 7-Point Achievement Scale & Percentage Conversion',
      shortName: 'NSC Achievement Scale'
    },
    maths_stream_rules: {
      id: 'maths_stream_rules',
      name: 'Mathematics vs Mathematical Literacy & Technical Maths Thresholds',
      shortName: 'Maths vs Math Lit Policies'
    },
    endorsement_minimums: {
      id: 'endorsement_minimums',
      name: 'Bachelor\'s, Diploma & Higher Certificate Endorsement Standards',
      shortName: 'Matric Endorsement Rules'
    },
    faculty_weighting_selection: {
      id: 'faculty_weighting_selection',
      name: 'Faculty-Specific Weighting, Sub-minimums & Quotas',
      shortName: 'Faculty Weightings & Caps'
    }
  };

  var QUESTION_BANK = [
    // --- TOPIC 1: Life Orientation Rules ---
    {
      id: 'aps_lo_1',
      topicId: 'lo_exclusion_rules',
      question: 'How does the University of the Witwatersrand (Wits) officially treat Life Orientation when calculating the general APS for admission?',
      options: [
        'Life Orientation is completely excluded from the primary APS calculation',
        'Life Orientation is counted fully as a normal subject out of 7 points',
        'Life Orientation points are awarded on a halved sliding scale (Level 7 = 3 or 4 points)',
        'Life Orientation is doubled for applicants applying to Health Sciences'
      ],
      correctIndex: 2,
      explanation: 'Wits calculates its baseline APS out of 34 or 42 points using a specialized Life Orientation conversion: scoring 60-69% (Level 5) yields 1 or 2 points, 70-79% (Level 6) yields 3 points, and 80-100% (Level 7) yields 4 points, rather than a full 7 points.'
    },
    {
      id: 'aps_lo_2',
      topicId: 'lo_exclusion_rules',
      question: 'Which of the following South African public universities completely excludes Life Orientation from its standard undergraduate APS calculation?',
      options: [
        'University of Cape Town (UCT)',
        'University of Johannesburg (UJ)',
        'Tshwane University of Technology (TUT)',
        'Walter Sisulu University (WSU)'
      ],
      correctIndex: 0,
      explanation: 'The University of Cape Town (UCT) calculates its Faculty Points Score (FPS) out of 600 based strictly on your six best recognized 20-credit subjects excluding Life Orientation. UJ and TUT include LO, while UCT strictly discards it.'
    },
    {
      id: 'aps_lo_3',
      topicId: 'lo_exclusion_rules',
      question: 'A student achieves Level 7 (85%) in Life Orientation and asks if it can compensate for a Level 2 (38%) in Physical Sciences when applying for BSc Mechanical Engineering. What is the correct rule?',
      options: [
        'Yes, high LO points automatically substitute for deficient STEM points',
        'No, university faculties enforce strict subject-specific minimum thresholds regardless of LO points',
        'Yes, as long as the student\'s overall APS total clears the general faculty cutoff',
        'Only if the student passes an internal department language exam'
      ],
      correctIndex: 1,
      explanation: 'Life Orientation cannot bypass statutory faculty sub-minimums. Engineering faculties uniformly mandate a sub-minimum of at least Level 5 or Level 6 (60-70%+) in both Mathematics and Physical Sciences. High LO scores only contribute to the broad total point pool where accepted.'
    },
    {
      id: 'aps_lo_4',
      topicId: 'lo_exclusion_rules',
      question: 'What is the maximum standard APS obtainable across South African universities that calculate APS out of six subjects excluding Life Orientation?',
      options: [
        '36 points',
        '42 points',
        '49 points',
        '50 points'
      ],
      correctIndex: 1,
      explanation: 'Six subjects each earning a maximum Level 7 (7 points) yield a maximum APS of 6 × 7 = 42 points. When Life Orientation is included as a 7th subject at full point value, the maximum becomes 49 points.'
    },
    {
      id: 'aps_lo_5',
      topicId: 'lo_exclusion_rules',
      question: 'Under what circumstance is Life Orientation considered for National Senior Certificate (NSC) pass endorsement even if a faculty excludes it from the APS?',
      options: [
        'It is never considered for anything if excluded from the APS',
        'It is a mandatory fundamental component of the NSC and must be passed at 40%+ (Level 3) to qualify for certificate endorsement',
        'It can be swapped for an eighth elective if failed',
        'It is only required for students in private independent IEB schools'
      ],
      correctIndex: 1,
      explanation: 'Life Orientation is a compulsory 10-credit fundamental component of the National Senior Certificate. Even though many universities exclude it from the APS admission ranking, Umalusi and the Department of Basic Education require a minimum pass of 40% (Level 3) in LO to achieve the NSC.'
    },
    {
      id: 'aps_lo_6',
      topicId: 'lo_exclusion_rules',
      question: 'At the University of Pretoria (UP), how is Life Orientation counted toward undergraduate degree programmes?',
      options: [
        'Counted at full face value out of 7 points for all faculties',
        'Counted only for Humanities but excluded from all other faculties',
        'Excluded from the calculated APS total across almost all faculties, though required at Level 4+ for endorsement',
        'Given a flat 10 bonus points if passed with distinction'
      ],
      correctIndex: 2,
      explanation: 'University of Pretoria (UP) generally calculates its Admission Point Score on six subjects excluding Life Orientation (maximum 42 points). While an applicant must pass LO to obtain a Bachelor\'s endorsement, its score does not inflate the admission APS.'
    },

    // --- TOPIC 2: NSC Achievement Scale ---
    {
      id: 'aps_scale_1',
      topicId: 'nsc_levels_scales',
      question: 'Under the official Department of Basic Education NSC 7-point scale, what percentage band corresponds to Level 6 (6 APS points)?',
      options: [
        '60% to 69%',
        '65% to 74%',
        '70% to 79%',
        '75% to 84%'
      ],
      correctIndex: 2,
      explanation: 'The NSC achievement rating scale defines Level 7 as 80-100%, Level 6 as 70-79%, Level 5 as 60-69%, Level 4 as 50-59%, Level 3 as 40-49%, Level 2 as 30-39%, and Level 1 as 0-29%.'
    },
    {
      id: 'aps_scale_2',
      topicId: 'nsc_levels_scales',
      question: 'A matric student scores exactly 79% in Accounting and 80% in Economics. How many APS points does the student earn for each?',
      options: [
        'Accounting earns 6 points; Economics earns 7 points',
        'Both earn 7 points because 79% is rounded up',
        'Both earn 6 points because Level 7 begins at 85%',
        'Accounting earns 5 points; Economics earns 6 points'
      ],
      correctIndex: 0,
      explanation: 'NSC marks are categorical floors. 79% sits inside the 70-79% band (Level 6 = 6 points). 80% reaches the 80-100% threshold (Level 7 = 7 points). The 1% difference changes the APS by a full point.'
    },
    {
      id: 'aps_scale_3',
      topicId: 'nsc_levels_scales',
      question: 'How many APS points are awarded for an NSC subject result between 0% and 29% (Level 1)?',
      options: [
        '0 points',
        '1 point',
        '2 points',
        'Negative 1 point'
      ],
      correctIndex: 0,
      explanation: 'Most South African university APS tables award 0 points for Level 1 (0-29%, Not Achieved). Some institutional scales award 1 point, but standard university admission scales treat Level 1 as zero points.'
    },
    {
      id: 'aps_scale_4',
      topicId: 'nsc_levels_scales',
      question: 'What is the key difference between the DBE NSC 7-point scale and the Wits composite percentage APS scale?',
      options: [
        'Wits uses letter grades A through F instead of percentages',
        'Wits awards 8 points for scores of 90% and above in English and Mathematics',
        'Wits multiplies all marks by 1.5',
        'Wits does not allow students to write more than 5 subjects'
      ],
      correctIndex: 1,
      explanation: 'Wits implements an extended APS scale that awards an 8th point for exceptional performance: scoring 90-100% in Mathematics or English yields 8 points rather than the standard 7, acknowledging elite academic attainment.'
    },
    {
      id: 'aps_scale_5',
      topicId: 'nsc_levels_scales',
      question: 'If a candidate scores 49% in Mathematics, what is their NSC Level rating?',
      options: [
        'Level 2 (Elementary Achievement)',
        'Level 3 (Moderate Achievement)',
        'Level 4 (Adequate Achievement)',
        'Level 5 (Substantial Achievement)'
      ],
      correctIndex: 1,
      explanation: '40% to 49% is classified as Level 3 (Moderate Achievement). Level 4 (Adequate Achievement) requires a minimum of 50%. This 1% gap between 49% and 50% often determines university degree eligibility.'
    },
    {
      id: 'aps_scale_6',
      topicId: 'nsc_levels_scales',
      question: 'A student scores 68% in History. What is the achievement description and APS points awarded on the standard NSC scale?',
      options: [
        'Adequate Achievement, 4 points',
        'Substantial Achievement, 5 points',
        'Meritorious Achievement, 6 points',
        'Outstanding Achievement, 7 points'
      ],
      correctIndex: 1,
      explanation: 'The 60-69% range is designated Level 5: Substantial Achievement, which awards exactly 5 APS points in the standard national matrix.'
    },

    // --- TOPIC 3: Maths vs Math Lit Policies ---
    {
      id: 'aps_math_1',
      topicId: 'maths_stream_rules',
      question: 'Can an applicant with Mathematical Literacy be admitted into a Bachelor of Science (BSc) in Actuarial Science or Engineering at a South African university?',
      options: [
        'Yes, provided they score at least 90% in Mathematical Literacy',
        'No, pure Mathematics is a non-negotiable statutory prerequisite for Actuarial Science and Engineering across all public universities',
        'Yes, if they achieve a 45+ overall APS score',
        'Yes, but only if they agree to take a second language module'
      ],
      correctIndex: 1,
      explanation: 'Engineering and Actuarial Science faculties require pure Mathematics (typically Level 6 or Level 7). Mathematical Literacy does not cover the advanced calculus, trigonometry, and analytical geometry necessary for university STEM fields and cannot be substituted.'
    },
    {
      id: 'aps_math_2',
      topicId: 'maths_stream_rules',
      question: 'When a university BCom programme accepts Mathematical Literacy, how does its APS requirement typically compare to the requirement for pure Mathematics?',
      options: [
        'The required Math Lit level is typically 1 to 2 levels higher than pure Mathematics (e.g., Level 7 in Math Lit vs Level 5 in pure Maths)',
        'The required Math Lit level is lower because Math Lit is considered harder',
        'Both subjects require the identical percentage mark',
        'Math Lit applicants receive 5 bonus APS points'
      ],
      correctIndex: 0,
      explanation: 'Faculties that accept Mathematical Literacy (such as BCom General, Law, or Humanities) typically demand a significantly higher achievement level (e.g. Level 6 or 7, 70-80%+) compared to applicants presenting pure Mathematics (who may enter with Level 4 or 5, 50-60%).'
    },
    {
      id: 'aps_math_3',
      topicId: 'maths_stream_rules',
      question: 'What is Technical Mathematics, and how is it evaluated by South African universities compared to standard Mathematics?',
      options: [
        'It is identical to Mathematical Literacy in content and recognition',
        'It is an engineering-focused curriculum recognized primarily by Universities of Technology (UoTs) for Engineering diplomas and BTech/BEng Tech, but often restricted by traditional academic universities',
        'It is only accepted for Law and Arts degrees',
        'It automatically converts to 10 APS points'
      ],
      correctIndex: 1,
      explanation: 'Technical Mathematics is designed for vocational technical high schools. Universities of Technology (CPUT, TUT, VUT, CUT) widely accept Technical Mathematics for engineering diplomas and BEng Tech degrees, whereas research universities like UCT and Wits generally require pure Mathematics for BSc degrees.'
    },
    {
      id: 'aps_math_4',
      topicId: 'maths_stream_rules',
      question: 'If a student takes both pure Mathematics and Mathematical Literacy, what happens during the NSC examination?',
      options: [
        'DBE allows students to register for and write both subjects simultaneously',
        'A candidate cannot register for both; they are mutually exclusive subjects under the NSC curriculum regulations',
        'The candidate writes both and the higher mark is automatically doubled',
        'The school divides the two marks and enters the average'
      ],
      correctIndex: 1,
      explanation: 'Under Department of Basic Education policy, Mathematics and Mathematical Literacy are mutually exclusive. A candidate must choose one or the other as their compulsory mathematical fundamental requirement.'
    },
    {
      id: 'aps_math_5',
      topicId: 'maths_stream_rules',
      question: 'Why does an APS calculator allow students to distinguish between pure Mathematics and Mathematical Literacy?',
      options: [
        'Because Math Lit only earns half APS points on every calculator',
        'Because programme eligibility rules and faculty cutoffs vary dramatically between the two subjects even when the raw points match',
        'Because DBE mandates that calculators report Math Lit in red text',
        'Because Math Lit marks cannot be saved in browser storage'
      ],
      correctIndex: 1,
      explanation: 'While a 70% in Math Lit and 70% in pure Maths both produce 6 raw APS points, the educational pathways they unlock are vastly different. An accurate educational tool must distinguish them so students do not assume 6 points in Math Lit qualifies them for Medicine or Engineering.'
    },
    {
      id: 'aps_math_6',
      topicId: 'maths_stream_rules',
      question: 'A student with an overall APS of 38 applies for Computer Science at a university requiring an APS of 34 and pure Mathematics Level 6 (70%). The student has Mathematical Literacy Level 7 (86%). What will the admissions office decide?',
      options: [
        'Admitted immediately because total APS (38) exceeds the cutoff (34)',
        'Rejected or redirected because the mandatory pure Mathematics sub-minimum prerequisite is not met',
        'Admitted on condition that they retake Life Orientation',
        'Automatically transferred into Medicine'
      ],
      correctIndex: 1,
      explanation: 'Meeting the overall APS cutoff is only the first filter. Specific subject prerequisites (like pure Mathematics for Computer Science) are mandatory gatekeepers. Exceeding the total APS cannot override a missing subject requirement.'
    },

    // --- TOPIC 4: Matric Endorsement Rules ---
    {
      id: 'aps_endorse_1',
      topicId: 'endorsement_minimums',
      question: 'What is the statutory minimum requirement to achieve a Bachelor\'s Degree pass endorsement (Matric Exemption) under Umalusi regulations?',
      options: [
        'An overall average of 75% across all 7 subjects',
        'At least 50% (Level 4) in four recognized 20-credit subjects, 40%+ in Home Language, and 30%+ in two other subjects',
        'Passing all 7 subjects with at least 60%',
        'Scoring an APS of at least 32 points'
      ],
      correctIndex: 1,
      explanation: 'To achieve a Bachelor\'s Degree pass endorsement, a candidate must achieve at least Level 4 (50-59%) in four subjects from the designated list, at least Level 3 (40%) in the official Home Language, and at least Level 2 (30%) in two other subjects.'
    },
    {
      id: 'aps_endorse_2',
      topicId: 'endorsement_minimums',
      question: 'If a student meets the minimum Bachelor\'s endorsement standard, does this guarantee admission into a South African university degree?',
      options: [
        'Yes, South African public universities are legally required to accept all Bachelor\'s endorsed students',
        'No, Bachelor\'s endorsement is only the legal minimum eligibility floor; universities select candidates competitively based on faculty APS cutoffs and limited programme quotas',
        'Yes, but only in their home province',
        'Only if the student is under 21 years of age'
      ],
      correctIndex: 1,
      explanation: 'A Bachelor\'s endorsement is merely the statutory threshold permitting an application to a degree. Due to severe capacity constraints, faculties set competitive APS thresholds (often 30 to 45 points) far higher than the statutory minimum.'
    },
    {
      id: 'aps_endorse_3',
      topicId: 'endorsement_minimums',
      question: 'What are the statutory requirements for a Diploma pass endorsement on the National Senior Certificate?',
      options: [
        'Level 3 (40-49%) in four recognized 20-credit subjects and 40%+ in Home Language',
        'Level 5 in Mathematics and Physical Sciences',
        '30% in all seven subjects',
        'An APS of at least 28 points'
      ],
      correctIndex: 0,
      explanation: 'For a Diploma pass, the candidate must pass their Home Language at 40% (Level 3) or higher, achieve at least Level 3 (40-49%) in four recognized 20-credit subjects, and at least Level 2 (30%) in two other subjects.'
    },
    {
      id: 'aps_endorse_4',
      topicId: 'endorsement_minimums',
      question: 'What happens if a candidate fails their Home Language (scores below 40% / Level 3)?',
      options: [
        'They automatically fail the entire National Senior Certificate and receive no endorsement',
        'They can still receive a Bachelor\'s pass if they pass First Additional Language at 60%',
        'Life Orientation marks are substituted for Home Language',
        'They receive an automatic condoned pass of 10%'
      ],
      correctIndex: 0,
      explanation: 'Home Language is a non-negotiable fundamental subject. Scoring below 40% in Home Language means the candidate fails the NSC requirements and cannot qualify for Higher Certificate, Diploma, or Bachelor\'s endorsements without a re-mark or rewrite.'
    },
    {
      id: 'aps_endorse_5',
      topicId: 'endorsement_minimums',
      question: 'What is a Higher Certificate pass endorsement, and what tertiary qualification does it lead to?',
      options: [
        'It leads to direct entry into master\'s degree programmes',
        'It requires 40%+ in Home Language, 40%+ in two other subjects, and 30%+ in three subjects, qualifying the student for NQF Level 5 Higher Certificate programmes at colleges and universities',
        'It is an award given only to students with 7 distinctions',
        'It is an endorsement reserved for international students'
      ],
      correctIndex: 1,
      explanation: 'A Higher Certificate pass is the foundation tier of the NSC pass levels. It qualifies the student to enrol in NQF Level 5 Higher Certificate qualifications, which can serve as a stepping stone into diplomas and degrees.'
    },
    {
      id: 'aps_endorse_6',
      topicId: 'endorsement_minimums',
      question: 'How many subjects can an NSC matric candidate fail (score below 30%) and still obtain an NSC pass?',
      options: [
        'Zero; every single subject must score above 50%',
        'At most one subject (provided it is not Home Language), and the student must still satisfy the minimum pass criteria in the other six subjects',
        'Three subjects',
        'All subjects except Life Orientation'
      ],
      correctIndex: 1,
      explanation: 'Under Umalusi pass rules, a candidate can fail at most one subject with a mark between 0% and 29% (Level 1), provided they achieve 40%+ in Home Language, 40%+ in two other subjects, and 30%+ in three subjects, plus satisfactory completion of internal CASS.'
    },

    // --- TOPIC 5: Faculty Weightings & Caps ---
    {
      id: 'aps_fac_1',
      topicId: 'faculty_weighting_selection',
      question: 'In health sciences (MBChB / Medicine) selection in South Africa, what other diagnostic assessment often complements the matric APS?',
      options: [
        'The SAT Reasoning Test',
        'The National Benchmark Tests (NBT) consisting of Academic Literacy (AL), Quantitative Literacy (QL), and Mathematics (MAT)',
        'The GMAT exam',
        'An internal driving test'
      ],
      correctIndex: 1,
      explanation: 'Many medical and health science faculties (such as UCT, Wits, UFS, SMU) historically or currently utilize the National Benchmark Tests (NBTs) alongside the matric APS, weighting academic achievement, NBT performance, and contextual biographical scores in a composite index.'
    },
    {
      id: 'aps_fac_2',
      topicId: 'faculty_weighting_selection',
      question: 'What is a "Weighted APS" or "Composite Index" as used by universities like Stellenbosch and UCT?',
      options: [
        'A system where every student receives a flat 40 points',
        'A formula that doubles or assigns higher percentage weights to core prerequisite subjects (e.g., Mathematics and Physical Sciences for Engineering) rather than summing raw level ratings',
        'An APS that counts sports achievements instead of academic marks',
        'A system where private school marks are multiplied by 2'
      ],
      correctIndex: 1,
      explanation: 'Leading universities use weighted indices (e.g. UCT\'s Faculty Points Score or Stellenbosch\'s selection mark) where actual percentages in critical subjects like Mathematics, Chemistry, or Physics are factored directly or doubled, rather than relying solely on the coarse 1-7 level scale.'
    },
    {
      id: 'aps_fac_3',
      topicId: 'faculty_weighting_selection',
      question: 'A student has an APS of 36 and wants to apply for LLB (Law). The university requires an APS of 33 and English Home Language Level 5 (60%) or First Additional Language Level 6 (70%). The student scored 54% in English Home Language (Level 4). What is the outcome?',
      options: [
        'Admitted because the APS of 36 is 3 points above the general cutoff',
        'Disqualified or declined admission because they failed to meet the language sub-minimum prerequisite',
        'Admitted with an automatic waiver',
        'Given a scholarship for high points'
      ],
      correctIndex: 1,
      explanation: 'Law faculties demand rigorous language proficiency. Even with an APS surplus, failing to satisfy the mandatory English sub-minimum (Level 5 Home Language or Level 6 FAL) results in an automatic rejection or redirection to an extended curriculum programme.'
    },
    {
      id: 'aps_fac_4',
      topicId: 'faculty_weighting_selection',
      question: 'What is an "Extended Curriculum Programme" (ECP) or Foundation Programme at South African universities?',
      options: [
        'A programme for students who achieved seven Level 7 distinctions',
        'An alternative pathway that adds an extra foundation year with intensive academic support for students whose APS or subject marks are slightly below standard direct degree entry',
        'A postgraduate qualification for working professionals',
        'A mandatory physical fitness programme'
      ],
      correctIndex: 1,
      explanation: 'Extended Curriculum Programmes (ECPs) offer developmental foundation modules over an additional year (e.g. 4 years for a 3-year degree) to help talented students bridge the gap between high school and university when their APS falls just short of direct entry.'
    },
    {
      id: 'aps_fac_5',
      topicId: 'faculty_weighting_selection',
      question: 'If a student rewrites one or two NSC matric subjects during the May/June Second Chance matric exam, how is the updated APS calculated?',
      options: [
        'The entire matric certificate must be discarded and all 7 subjects rewritten',
        'The Department of Basic Education issues a combined certificate combining the best results from both sittings, allowing an improved APS calculation',
        'Rewritten subjects can only be awarded Level 3 maximum',
        'Universities deduct 10 points for taking a rewrite'
      ],
      correctIndex: 1,
      explanation: 'Through the DBE Second Chance programme, students can rewrite specific subjects. Umalusi then issues a consolidated certificate combining the candidate\'s highest achieved marks across sittings, allowing the student to recalculate a higher APS for university admission.'
    },
    {
      id: 'aps_fac_6',
      topicId: 'faculty_weighting_selection',
      question: 'Why do some university faculties calculate an APS on five subjects while others calculate on six?',
      options: [
        'Because universities are allowed to define their own admission scoring regulations under the Higher Education Act',
        'Because DBE forgot to standardize the number of subjects',
        'Because public universities only count language subjects',
        'Because five-subject calculations are illegal in South Africa'
      ],
      correctIndex: 0,
      explanation: 'Under institutional autonomy granted by the Higher Education Act, university Senates establish their faculty admission criteria. While the national standard counts six 20-credit subjects, institutions define whether LO is included or how core subjects are prioritized.'
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

  function getApsInputsContext() {
    var subInputs = document.querySelectorAll('.aps-subject');
    var filled = 0;
    var totalPct = 0;
    subInputs.forEach(function (inp) {
      var v = parseFloat(inp.value);
      if (!isNaN(v) && v >= 0 && v <= 100) {
        filled++;
        totalPct += v;
      }
    });

    var apsBig = document.getElementById('apsValue');
    var calculatedAps = apsBig ? parseInt(apsBig.textContent, 10) : NaN;

    if (!isNaN(calculatedAps) && calculatedAps > 0) {
      if (calculatedAps >= 38) {
        return {
          status: 'success',
          title: 'High Competitive APS Detected (' + calculatedAps + ' Points)',
          text: 'Your entered score places you in top-tier degree eligibility. Take a diagnostic to verify you meet faculty sub-minimums, language thresholds, and STEM weighting requirements.',
          recommendedTopic: 'faculty_weighting_selection'
        };
      } else if (calculatedAps >= 28) {
        return {
          status: 'neutral',
          title: 'Degree Gateway APS Detected (' + calculatedAps + ' Points)',
          text: 'Your score clears standard Bachelor\'s thresholds, but faculty sub-minimums and Mathematics vs Math Lit choices will determine your placement.',
          recommendedTopic: 'maths_stream_rules'
        };
      } else {
        return {
          status: 'warning',
          title: 'Borderline APS Detected (' + calculatedAps + ' Points)',
          text: 'Your entered score is near Diploma or Higher Certificate thresholds. Diagnose endorsement minimums and second-chance rewrite opportunities.',
          recommendedTopic: 'endorsement_minimums'
        };
      }
    }

    if (filled >= 3) {
      var avg = totalPct / filled;
      return {
        status: 'neutral',
        title: 'Partial Marks Entered (Average: ' + Math.round(avg) + '%)',
        text: 'You have entered marks for ' + filled + ' subjects. Test your understanding of NSC level conversions and Life Orientation scoring policies.',
        recommendedTopic: 'all'
      };
    }

    return {
      status: 'neutral',
      title: 'Comprehensive Matric APS Diagnostic',
      text: 'Evaluate your command of South African NSC scoring scales, Life Orientation exclusion rules, Mathematics gatekeeping, and Bachelor\'s endorsement criteria.',
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
        headline.textContent = 'Outstanding Matric APS & Admission Mastery';
      } else if (attempt.percentage >= 60) {
        headline.textContent = 'Solid Foundation with Targetable Knowledge Gaps';
      } else if (attempt.percentage >= 40) {
        headline.textContent = 'Moderate Risk: Prerequisite Gaps Detected';
      } else {
        headline.textContent = 'Critical Admission & Policy Misconceptions';
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
        '  <strong>Curriculum Standard &amp; Explanation:</strong>',
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
    var form = document.getElementById('apsForm');
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
        '  <h3 class="w-banner-title">Diagnose Your Matric APS Weaknesses</h3>',
        '  <p class="w-banner-desc">Take a personalized 10-question diagnostic based on your entered marks and South African university admission rules.</p>',
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
      '        <h3 class="w-title">Find My Matric APS Weaknesses</h3>',
      '        <button type="button" id="wCloseIntroBtn" class="w-close-btn" aria-label="Close diagnostic">&times;</button>',
      '      </div>',
      '      <p class="w-subtitle">A deterministic 10-question diagnostic evaluating your command of South African NSC scoring scales, Life Orientation exclusion rules, Mathematics gatekeeping, and Bachelor\'s endorsement criteria.</p>',
      '    </div>',
      '    <div id="wContextNotice" class="w-context-card"></div>',
      '    <div class="w-topic-select-wrap">',
      '      <label for="wTopicSelect" class="w-label">Select diagnostic focus:</label>',
      '      <select id="wTopicSelect" class="w-form-select">',
      '        <option value="all" selected>All Topics (Comprehensive 10-Question Balanced Diagnostic)</option>',
      '        <option value="lo_exclusion_rules">Life Orientation Scoring &amp; University Exclusion Policies</option>',
      '        <option value="nsc_levels_scales">NSC 7-Point Achievement Scale &amp; Percentage Conversion</option>',
      '        <option value="maths_stream_rules">Mathematics vs Mathematical Literacy &amp; Technical Maths Thresholds</option>',
      '        <option value="endorsement_minimums">Bachelor\'s, Diploma &amp; Higher Certificate Endorsement Standards</option>',
      '        <option value="faculty_weighting_selection">Faculty-Specific Weighting, Sub-minimums &amp; Quotas</option>',
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
      '        <p>Targeted practice isolates your <strong id="wWeakCount">identified gaps</strong> with fresh questions to build mastery before your matric exams.</p>',
      '      </div>',
      '      <button type="button" id="wPracticeBtn" class="w-practice-btn">',
      '        <span>Practise My Weaknesses</span>',
      '        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
      '      </button>',
      '    </div>',

      '    <div class="w-review-section">',
      '      <div class="w-review-head">',
      '        <h4 class="w-review-title">Step-by-Step Question Review &amp; Explanations</h4>',
      '        <span class="w-review-sub">Review every answer and official policy rationale</span>',
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
    var ctx = getApsInputsContext();

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
