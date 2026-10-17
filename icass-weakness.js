/**
 * AfriWidget ICASS "Find My Weaknesses" Diagnostic Engine
 * Pure vanilla JavaScript. Zero dependencies, zero emojis, zero tracking.
 * 100% deterministic marking, localized storage, and targeted weakness practice.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'afriwidget_icass_weakness_history';

  // Topic Metadata
  var TOPICS = {
    dhet_subminimum: {
      id: 'dhet_subminimum',
      name: 'DHET 40% Sub-minimum & Exam Admission Rules',
      shortName: 'DHET Sub-minimum'
    },
    weighting_formulas: {
      id: 'weighting_formulas',
      name: 'ICASS Weighting & External Exam Calculation Mastery',
      shortName: 'Weighting Formulas'
    },
    poe_compliance: {
      id: 'poe_compliance',
      name: 'Portfolio of Evidence (PoE) & Formative Assessment',
      shortName: 'PoE Compliance'
    },
    ncv_nated_rules: {
      id: 'ncv_nated_rules',
      name: 'NC(V) vs NATED Qualification Standards',
      shortName: 'NC(V) & NATED Standards'
    },
    moderation_recovery: {
      id: 'moderation_recovery',
      name: 'Mark Moderation, Discrepancies & Score Recovery',
      shortName: 'Moderation & Recovery'
    }
  };

  // Comprehensive, verified question bank (30 questions, 6 per topic)
  var QUESTION_BANK = [
    // --- TOPIC 1: DHET Sub-minimum & Exam Admission Rules ---
    {
      id: 'q1',
      topicId: 'dhet_subminimum',
      question: 'According to the Department of Higher Education and Training (DHET) TVET policy, what is the mandatory minimum continuous assessment (ICASS) percentage required to sit a national examination?',
      options: ['30%', '40%', '50%', '60%'],
      correctIndex: 1,
      explanation: 'DHET policy mandates a strict 40% continuous assessment sub-minimum for exam admission across NATED (Report 191) and NC(V) subjects. Achieving below 40% results in a Did Not Qualify (DNQ) status on TVETMIS.'
    },
    {
      id: 'q2',
      topicId: 'dhet_subminimum',
      question: 'A NATED student scores an ICASS mark of 38.5% at the end of the trimester. Can the college issue an examination admission permit?',
      options: [
        'Yes, if the student submits an appeal letter to the Student Representative Council (SRC)',
        'No, the sub-minimum is strictly 40% and cannot be waived administratively',
        'Yes, provided the student achieved at least 50% in the preparatory trial exam',
        'Yes, upon paying an Umalusi examination concession fee'
      ],
      correctIndex: 1,
      explanation: 'The 40% sub-minimum is non-negotiable under DHET regulations. Colleges cannot issue an examination admission permit to any student who falls short of 40% on their internal continuous assessment.'
    },
    {
      id: 'q3',
      topicId: 'dhet_subminimum',
      question: 'If a student misses a scheduled weighted ICASS test due to medical incapacity, what is required to qualify for an official deferred assessment?',
      options: [
        'A verbal explanation communicated via a classmate',
        'A valid medical certificate issued by a registered medical practitioner submitted within 48 to 72 hours',
        'An affidavit stamped at a police station three weeks later',
        'Automatic 100% placeholder marks are granted without medical documentation'
      ],
      correctIndex: 1,
      explanation: 'Under DHET continuous assessment policy, unexcused absence results in zero (0) for that task. An official medical certificate submitted within the prescribed college window (typically 48 to 72 hours) allows for an approved deferred assessment.'
    },
    {
      id: 'q4',
      topicId: 'dhet_subminimum',
      question: 'Under DHET guidelines, how long can an ICASS mark of 40% or higher remain valid if a student needs to rewrite the external national examination?',
      options: [
        'It expires immediately when the examination session ends',
        'It remains valid for a concession cycle of up to 12 months (two semesters or three trimesters)',
        'It is permanently valid for lifetime rewrites',
        'It is valid only if the student attends all lectures again in the next cycle'
      ],
      correctIndex: 1,
      explanation: 'A passing ICASS mark of 40% or higher is valid for up to 12 months (three trimesters or two semesters), permitting candidates to rewrite the external national summative exam without having to re-complete the internal tasks.'
    },
    {
      id: 'q5',
      topicId: 'dhet_subminimum',
      question: 'What official status is assigned on TVETMIS when a student\'s ICASS portfolio is missing required moderated tasks before the national cutoff?',
      options: [
        'Pass with Distinction',
        'Result Withheld / Incomplete (INC)',
        'Automatic 40% standardized credit',
        'Special Exemption Granted'
      ],
      correctIndex: 1,
      explanation: 'Incomplete continuous assessment portfolios or unsubmitted marks trigger an administrative lock on TVETMIS, causing results to be withheld or flagged as Incomplete (INC) pending college compliance audits.'
    },
    {
      id: 'q6',
      topicId: 'dhet_subminimum',
      question: 'What minimum class attendance rate is officially recommended across public TVET colleges to maintain continuous assessment eligibility?',
      options: ['50%', '65%', '80%', '100%'],
      correctIndex: 2,
      explanation: 'DHET policy guidelines enforce an 80% minimum attendance threshold for lectures and practical workshops. Chronic unexcused absenteeism can invalidate portfolio compliance and prevent exam admission.'
    },

    // --- TOPIC 2: Weighting & Calculation Mechanics ---
    {
      id: 'q7',
      topicId: 'weighting_formulas',
      question: 'In the standard NATED (Report 191) continuous assessment model, how is the final subject mark determined?',
      options: [
        '50% ICASS + 50% National Exam',
        '40% ICASS + 60% National Exam',
        '30% ICASS + 70% National Exam',
        '20% ICASS + 80% National Exam'
      ],
      correctIndex: 1,
      explanation: 'Standard NATED programs calculate the final composite subject mark using 40% continuous assessment (ICASS) and 60% external national examination paper.'
    },
    {
      id: 'q8',
      topicId: 'weighting_formulas',
      question: 'A student enters the national examination with an ICASS average of 65%. What mark must they score in the 60%-weighted national paper to achieve an overall 50% pass?',
      options: ['35.0%', '40.0%', '45.0%', '50.0%'],
      correctIndex: 1,
      explanation: 'ICASS contributes 65% × 0.40 = 26.0 points. To achieve 50.0 composite points, the exam must contribute 50.0 - 26.0 = 24.0 points. Required exam mark is 24.0 / 0.60 = 40.0%.'
    },
    {
      id: 'q9',
      topicId: 'weighting_formulas',
      question: 'If a student achieves an ICASS mark of 55%, what mark do they need in the national exam (60% weight) to attain a final Distinction (75%)?',
      options: ['75.0%', '82.5%', '88.3%', '92.0%'],
      correctIndex: 2,
      explanation: 'ICASS contributes 55% × 0.40 = 22.0 points. Target = 75.0 points. Exam contribution needed = 75.0 - 22.0 = 53.0 points. Required national exam mark = 53.0 / 0.60 = 88.33% (rounds to 88.3%).'
    },
    {
      id: 'q10',
      topicId: 'weighting_formulas',
      question: 'In a Trimester 3-Task structure (Class Test 30%, Assignment 20%, Internal Exam 50%), a student scores 70% in the Test, 80% in the Assignment, and 50% in the Exam. What is their weighted ICASS mark?',
      options: ['62.0%', '65.0%', '67.0%', '70.0%'],
      correctIndex: 0,
      explanation: 'Calculation: (70 × 0.30) + (80 × 0.20) + (50 × 0.50) = 21.0 + 16.0 + 25.0 = 62.0%.'
    },
    {
      id: 'q11',
      topicId: 'weighting_formulas',
      question: 'Which formula correctly determines the required national exam mark (E) given a desired target composite mark (T) and an ICASS score (I) on a 40/60 split?',
      options: [
        'E = (T - 0.4 × I) / 0.6',
        'E = (T - 0.6 × I) / 0.4',
        'E = T - (0.4 × I)',
        'E = (T × 0.6) + (I × 0.4)'
      ],
      correctIndex: 0,
      explanation: 'Since Composite Mark T = (0.4 × I) + (0.6 × E), isolating E yields: E = (T - 0.4 × I) / 0.6.'
    },
    {
      id: 'q12',
      topicId: 'weighting_formulas',
      question: 'A student has an ICASS average of 80%. What is the minimum national exam mark (60% weight) they need to clear the basic 50% composite pass requirement?',
      options: [
        '30.0%',
        '35.0%',
        '40.0%',
        'They need 30.0% mathematically, but must still satisfy any exam sub-minimum'
      ],
      correctIndex: 3,
      explanation: 'Mathematically, 80 × 0.40 = 32.0 points, leaving 50.0 - 32.0 = 18.0 points needed (18.0 / 0.60 = 30.0%). However, candidates must still meet the DHET external examination paper sub-minimum.'
    },

    // --- TOPIC 3: Portfolio of Evidence (PoE) Compliance ---
    {
      id: 'q13',
      topicId: 'poe_compliance',
      question: 'What is the purpose of the Declaration of Authenticity required inside every TVET student Portfolio of Evidence (PoE)?',
      options: [
        'To verify proof of college registration fee payments',
        'To legally certify that all submitted assessment tasks are the student\'s own independent work',
        'To request an automatic exemption from the trial examination',
        'To register the student for graduation ceremonies in advance'
      ],
      correctIndex: 1,
      explanation: 'The Declaration of Authenticity is a mandatory statutory affirmation ensuring academic integrity and confirming that all tasks were produced without unauthorized assistance or plagiarism.'
    },
    {
      id: 'q14',
      topicId: 'poe_compliance',
      question: 'In the Standard 5-Task ICASS portfolio, which task carries the single highest individual percentage weighting?',
      options: [
        'Class Test 1 (10%)',
        'Assignment 1 (25%)',
        'Assignment 2 (25%)',
        'Trial / Preparatory Exam (30%)'
      ],
      correctIndex: 3,
      explanation: 'The Trial / Preparatory Examination carries a 30% weighting, making it the single largest individual contributor in the standard 5-task continuous assessment structure.'
    },
    {
      id: 'q15',
      topicId: 'poe_compliance',
      question: 'Why is pre-moderation conducted on ICASS assessment instruments by an internal college moderator before administration?',
      options: [
        'To grade students scripts before they write the examination',
        'To verify that questions, marking memorandums, and weighting align with DHET syllabus standards and cognitive taxonomy',
        'To change the date of the national examination timetable',
        'To lower the question difficulty for underperforming classes'
      ],
      correctIndex: 1,
      explanation: 'Pre-moderation verifies that the assessment paper is valid, fair, aligned to syllabus learning outcomes, properly weighted, and accompanied by a detailed, accurate marking guide before students write.'
    },
    {
      id: 'q16',
      topicId: 'poe_compliance',
      question: 'What is the regulatory consequence if a TVET student is found guilty of plagiarism or unauthorized copying in an ICASS assignment?',
      options: [
        'The student receives a verbal warning and their score is halved',
        'The student is subject to formal disciplinary action, receives zero (0) for the task, and risks examination debarment',
        'The assignment is ignored and deleted from the portfolio calculations',
        'The lecturer replaces the assignment mark with average attendance'
      ],
      correctIndex: 1,
      explanation: 'Academic dishonesty in continuous assessment is a severe breach of DHET regulations. It results in a zero (0) on the task, disciplinary proceedings, and potential disqualification from writing the national examination.'
    },
    {
      id: 'q17',
      topicId: 'poe_compliance',
      question: 'What is post-moderation in the context of TVET continuous assessment?',
      options: [
        'Printing official examination certificates after graduation',
        'Auditing a sampled cross-section of marked student scripts to ensure marking consistency and adherence to the memorandum',
        'Administering an extra re-test to all students who failed',
        'Calculating college lecture room capacity'
      ],
      correctIndex: 1,
      explanation: 'Post-moderation audits a representative sample of marked student work across high, medium, and low performance bands to ensure marking consistency, accuracy, and fairness.'
    },
    {
      id: 'q18',
      topicId: 'poe_compliance',
      question: 'What records must TVET colleges retain for verification following the completion of an ICASS academic cycle?',
      options: [
        'Only digital payment receipts for tuition fees',
        'Moderated mark schedules, assessment instruments, memorandums, and sampled student Portfolios of Evidence (PoEs)',
        'Student social club membership records',
        'Campus visitor parking logs'
      ],
      correctIndex: 1,
      explanation: 'Colleges are mandated by DHET and Umalusi to archive all moderated mark schedules, assessment tools, memorandums, and sampled student Portfolios of Evidence for audit trails.'
    },

    // --- TOPIC 4: NC(V) vs NATED Qualification Standards ---
    {
      id: 'q19',
      topicId: 'ncv_nated_rules',
      question: 'How is the final composite mark structured for NC(V) Fundamental Subjects (e.g., English, Mathematics, Life Orientation)?',
      options: [
        '40% ICASS and 60% External Examination',
        '50% ICASS and 50% External Examination',
        '25% ICASS and 75% External Examination',
        '100% External Examination'
      ],
      correctIndex: 1,
      explanation: 'In the NC(V) curriculum, fundamental subjects use an equal 50% Internal Continuous Assessment (ICASS) and 50% external examination weighting.'
    },
    {
      id: 'q20',
      topicId: 'ncv_nated_rules',
      question: 'What is the Integrated Summative Assessment Task (ISAT) in NC(V) vocational programs?',
      options: [
        'A theoretical multiple-choice quiz written on a computer',
        'A standardized practical assessment measuring applied vocational skills in a workshop or simulated workplace environment',
        'A language fluency interview conducted at admission',
        'An attendance verification check conducted by campus security'
      ],
      correctIndex: 1,
      explanation: 'The ISAT is a comprehensive practical assessment task designed to test hands-on occupational and technical competence in specialized workshop facilities.'
    },
    {
      id: 'q21',
      topicId: 'ncv_nated_rules',
      question: 'What is the official external examination passing mark for NC(V) Vocational Core subjects?',
      options: ['30%', '40%', '50%', '60%'],
      correctIndex: 2,
      explanation: 'Vocational core subjects in NC(V) require a 50% pass mark on external assessments, reflecting industry-standard trade competency requirements.'
    },
    {
      id: 'q22',
      topicId: 'ncv_nated_rules',
      question: 'Which statutory body provides quality assurance and certification for NC(V) qualifications in South Africa?',
      options: ['SACE', 'Umalusi', 'Council on Higher Education (CHE)', 'Health Professions Council'],
      correctIndex: 1,
      explanation: 'Umalusi is the Council for Quality Assurance in General and Further Education and Training, responsible for accrediting and certifying NC(V) qualifications.'
    },
    {
      id: 'q23',
      topicId: 'ncv_nated_rules',
      question: 'How are NATED (Report 191) Engineering Studies scheduled throughout an academic year?',
      options: [
        'A single 12-month annual academic year',
        'Three distinct 10-week trimesters (April, August, and November exam cycles)',
        'Two 6-month semesters with a single year-end exam',
        'Four quarterly 8-week modules'
      ],
      correctIndex: 1,
      explanation: 'NATED Engineering Studies operates on a trimester schedule comprising three intensive 10-week terms per year with national examination sittings in April, August, and November.'
    },
    {
      id: 'q24',
      topicId: 'ncv_nated_rules',
      question: 'How do NATED Business Studies programs differ in academic scheduling from Engineering Studies?',
      options: [
        'Business Studies operates on a semester model (two 6-month cycles per year with June and November exams)',
        'Business Studies courses have no national examinations',
        'Business Studies uses self-paced monthly open-book modules',
        'Business Studies does not require any continuous assessment'
      ],
      correctIndex: 0,
      explanation: 'NATED Business Studies operates on semesters (Semester 1 and Semester 2) with national examinations administered in June and November.'
    },

    // --- TOPIC 5: Moderation & Score Recovery ---
    {
      id: 'q25',
      topicId: 'moderation_recovery',
      question: 'What is statistical moderation as conducted by Umalusi on TVET college continuous assessment marks?',
      options: [
        'Awarding an automatic 10% bonus to all candidates below the pass line',
        'Comparing internal ICASS score distributions against national examination performance to detect and adjust anomalous or inflated internal marking',
        'Deleting all internal marks and evaluating students solely on exams',
        'Ranking colleges according to fee recovery rates'
      ],
      correctIndex: 1,
      explanation: 'Statistical moderation identifies significant variances between college internal marks and external national exam results, adjusting distorted internal scores to maintain national parity.'
    },
    {
      id: 'q26',
      topicId: 'moderation_recovery',
      question: 'A student has task scores: Test 1 (10%) = 30%, Assignment 1 (25%) = 40%, Test 2 (10%) = 40%, Assignment 2 (25%) = 44%. What mark must they score in their 30%-weighted Trial Exam to reach the 40% DHET entry sub-minimum?',
      options: ['35.0%', '40.0%', '45.0%', '50.0%'],
      correctIndex: 1,
      explanation: 'Points accumulated: (30 × 0.10) + (40 × 0.25) + (40 × 0.10) + (44 × 0.25) = 3.0 + 10.0 + 4.0 + 11.0 = 28.0 points. To hit 40.0 points, Trial Exam must provide 40.0 - 28.0 = 12.0 points. Required Trial Exam score = 12.0 / 0.30 = 40.0%.'
    },
    {
      id: 'q27',
      topicId: 'moderation_recovery',
      question: 'If a student discovers an error in their captured continuous assessment mark on the preliminary college mark schedule, what is the correct procedure?',
      options: [
        'Wait until after national results release before emailing the college',
        'Lodge a formal written dispute with the lecturer and HOD during the official verification window before final TVETMIS upload',
        'Edit the score personally on the campus noticeboard',
        'File an appeal directly with the national cabinet minister'
      ],
      correctIndex: 1,
      explanation: 'Colleges host a strict 3- to 5-day mark verification window where students review marked tasks against entered mark sheets. Rectifications require marked evidence and HOD approval before TVETMIS lockout.'
    },
    {
      id: 'q28',
      topicId: 'moderation_recovery',
      question: 'Which task in the 5-Task ICASS portfolio offers the highest mathematical leverage to recover an at-risk continuous assessment average?',
      options: [
        'Class Test 1 (10%)',
        'Class Test 2 (10%)',
        'Trial / Preparatory Examination (30%)',
        'Class Attendance Record'
      ],
      correctIndex: 2,
      explanation: 'At 30% weighting, every 10% gain in the Trial Examination adds 3.0 full percentage points to the composite ICASS mark—three times the influence of a 10%-weighted class test.'
    },
    {
      id: 'q29',
      topicId: 'moderation_recovery',
      question: 'What happens if a student\'s ICASS mark is finalized as 39.0% on the DHET TVETMIS system after the verification window has closed?',
      options: [
        'The system automatically rounds 39.0% up to 40.0%',
        'The student is granted an exam permit with probationary conditions',
        'The student is locked out from the national examination session for failing the 40% sub-minimum',
        'The student automatically qualifies for the supplementary examination without writing the main paper'
      ],
      correctIndex: 2,
      explanation: 'TVETMIS enforces strict validation rules: marks below 40.0% generate a hard lockout (DNQ) with zero automated rounding, preventing exam permit issuance.'
    },
    {
      id: 'q30',
      topicId: 'moderation_recovery',
      question: 'What is the composite mark threshold required to achieve an overall subject pass with Distinction in DHET TVET qualifications?',
      options: ['70%', '75%', '80%', '85%'],
      correctIndex: 1,
      explanation: 'In DHET and Umalusi grading standards, 75% or higher on the weighted composite mark (ICASS + external exam) is officially recognized as a Distinction.'
    }
  ];

  // Helper: Get user's current ICASS context from the page inputs
  function getIcassInputsContext() {
    var modeEl = document.querySelector('.mode-tab.active');
    var mode = modeEl ? (modeEl.id === 'tabTrimester' ? 'trimester' : (modeEl.id === 'tabCustom' ? 'custom' : 'standard')) : 'standard';

    var tasks = [];
    var std1 = parseFloat(document.getElementById('stdTest1') ? document.getElementById('stdTest1').value : '');
    var stdA1 = parseFloat(document.getElementById('stdAssign1') ? document.getElementById('stdAssign1').value : '');
    var std2 = parseFloat(document.getElementById('stdTest2') ? document.getElementById('stdTest2').value : '');
    var stdA2 = parseFloat(document.getElementById('stdAssign2') ? document.getElementById('stdAssign2').value : '');
    var stdTr = parseFloat(document.getElementById('stdTrial') ? document.getElementById('stdTrial').value : '');

    var trimTest = parseFloat(document.getElementById('trimTest') ? document.getElementById('trimTest').value : '');
    var trimAssign = parseFloat(document.getElementById('trimAssign') ? document.getElementById('trimAssign').value : '');
    var trimExam = parseFloat(document.getElementById('trimExam') ? document.getElementById('trimExam').value : '');

    var lowestTask = null;
    var minScore = 101;

    if (mode === 'standard') {
      var arr = [
        { name: 'Class Test 1', score: std1, weight: 10 },
        { name: 'Assignment 1', score: stdA1, weight: 25 },
        { name: 'Class Test 2', score: std2, weight: 10 },
        { name: 'Assignment 2', score: stdA2, weight: 25 },
        { name: 'Trial Exam', score: stdTr, weight: 30 }
      ];
      arr.forEach(function (t) {
        if (!isNaN(t.score) && t.score >= 0 && t.score <= 100) {
          tasks.push(t);
          if (t.score < minScore) {
            minScore = t.score;
            lowestTask = t;
          }
        }
      });
    } else if (mode === 'trimester') {
      var arr2 = [
        { name: 'Class Test', score: trimTest, weight: 30 },
        { name: 'Assignment', score: trimAssign, weight: 20 },
        { name: 'Internal Exam', score: trimExam, weight: 50 }
      ];
      arr2.forEach(function (t) {
        if (!isNaN(t.score) && t.score >= 0 && t.score <= 100) {
          tasks.push(t);
          if (t.score < minScore) {
            minScore = t.score;
            lowestTask = t;
          }
        }
      });
    }

    // Check if ICASS was already calculated on the page
    var bigEl = document.getElementById('icassBig');
    var calculatedScore = null;
    if (bigEl && bigEl.textContent && bigEl.textContent !== '—') {
      var parsed = parseFloat(bigEl.textContent.replace('%', ''));
      if (!isNaN(parsed)) calculatedScore = parsed;
    }

    return {
      mode: mode,
      tasks: tasks,
      hasInputs: tasks.length > 0,
      lowestTask: lowestTask,
      calculatedScore: calculatedScore
    };
  }

  // LocalStorage Helpers
  function getHistory() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveAttemptToHistory(attempt) {
    try {
      var history = getHistory();
      history.unshift(attempt);
      // Keep up to 20 attempts
      if (history.length > 20) history = history.slice(0, 20);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      // Storage unavailable or full
    }
  }

  function clearHistory() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  // Assessment State
  var currentQuestions = [];
  var userAnswers = {}; // { questionId: selectedOptionIndex }
  var activeQuestionIdx = 0;
  var currentAssessmentMeta = {
    mode: 'diagnostic', // 'diagnostic' or 'practice'
    focusTopic: 'all',
    targetWeaknessTopicIds: []
  };

  /**
   * Generates a 10-question set based on user's topic selection and inputs.
   */
  function generateQuestions(focusTopic, practiceWeaknessTopicIds) {
    var selected = [];
    var pool = QUESTION_BANK.slice();

    // If in Practice Mode targeting identified weaknesses
    if (practiceWeaknessTopicIds && practiceWeaknessTopicIds.length > 0) {
      var weakQuestions = pool.filter(function (q) {
        return practiceWeaknessTopicIds.indexOf(q.topicId) !== -1;
      });

      // Shuffle weak questions
      weakQuestions.sort(function () { return 0.5 - Math.random(); });
      selected = weakQuestions.slice(0, 10);

      // If fewer than 10 questions from weak topics, pad with remaining pool
      if (selected.length < 10) {
        var remainingPool = pool.filter(function (q) {
          return selected.indexOf(q) === -1;
        });
        remainingPool.sort(function () { return 0.5 - Math.random(); });
        selected = selected.concat(remainingPool.slice(0, 10 - selected.length));
      }
      return selected;
    }

    // If a specific topic is selected
    if (focusTopic && focusTopic !== 'all' && TOPICS[focusTopic]) {
      var topicQuestions = pool.filter(function (q) {
        return q.topicId === focusTopic;
      });
      topicQuestions.sort(function () { return 0.5 - Math.random(); });

      // Take all available from that topic (e.g. 6), then pad from others
      selected = topicQuestions.slice(0, 6);
      var others = pool.filter(function (q) {
        return q.topicId !== focusTopic;
      });
      others.sort(function () { return 0.5 - Math.random(); });
      selected = selected.concat(others.slice(0, 10 - selected.length));
      return selected;
    }

    // Default: Comprehensive 10-question assessment
    // Pick 2 questions from each of the 5 topics for balanced coverage
    var topicKeys = Object.keys(TOPICS);
    topicKeys.forEach(function (tKey) {
      var tPool = pool.filter(function (q) { return q.topicId === tKey; });
      tPool.sort(function () { return 0.5 - Math.random(); });
      selected = selected.concat(tPool.slice(0, 2));
    });

    // If user has specific inputs entered, slightly bias order
    var ctx = getIcassInputsContext();
    if (ctx.calculatedScore !== null && ctx.calculatedScore < 40) {
      // Prioritize subminimum & recovery questions
      selected.sort(function (a, b) {
        var aP = (a.topicId === 'dhet_subminimum' || a.topicId === 'moderation_recovery') ? -1 : 1;
        var bP = (b.topicId === 'dhet_subminimum' || b.topicId === 'moderation_recovery') ? -1 : 1;
        return aP - bP;
      });
    }

    return selected.slice(0, 10);
  }

  // DOM Elements Injection and Initialization
  function initWeaknessUI() {
    var calcWrap = document.querySelector('.calc-wrap .container-narrow');
    if (!calcWrap) return;

    // Check if already injected
    if (document.getElementById('weaknessAssessmentSection')) return;

    if (!document.getElementById('afriwidget-weakness-ui')) {
      var weaknessStyles = document.createElement('link');
      weaknessStyles.id = 'afriwidget-weakness-ui';
      weaknessStyles.rel = 'stylesheet';
      weaknessStyles.href = '/weakness-ui.css';
      document.head.appendChild(weaknessStyles);
    }

    // 1. Add "Find My Weaknesses" button in calculator btn-row
    var btnRow = document.querySelector('#icassForm .btn-row');
    if (btnRow) {
      var findBtn = document.createElement('button');
      findBtn.type = 'button';
      findBtn.id = 'findWeaknessesBtn';
      findBtn.className = 'btn-secondary btn-find-weakness';
      findBtn.innerHTML = '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg><span>Find My Weaknesses</span>';
      findBtn.addEventListener('click', function () {
        openWeaknessSection();
      });
      btnRow.appendChild(findBtn);
    }

    // 2. Add Callout Banner in Results Section
    var resultsEl = document.getElementById('results');
    if (resultsEl) {
      var callout = document.createElement('div');
      callout.id = 'weaknessCalloutBanner';
      callout.className = 'weakness-banner-card';
      callout.innerHTML = [
        '<div class="w-banner-content">',
        '  <h3 class="w-banner-title">Diagnose Your TVET ICASS Weaknesses</h3>',
        '  <p class="w-banner-desc">Take a personalized 10-question diagnostic based on your entered marks and DHET continuous assessment standards.</p>',
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
    section.setAttribute('aria-labelledby', 'wDiagnosticTitle');

    section.innerHTML = [
      '<div class="weakness-card">',
      '  <!-- Screen 1: Diagnostic Intro & Topic Selection -->',
      '  <div id="wIntroView" class="w-view">',
      '    <div class="w-header">',
      '      <span class="w-eyebrow">AfriWidget Diagnostic Assessment</span>',
      '      <h2 id="wDiagnosticTitle" class="w-title">Find My TVET Weaknesses</h2>',
      '      <p class="w-subtitle">Evaluate your command of DHET 40% sub-minimums, ICASS continuous assessment weights, national exam crossover calculations, and moderation rules. Answer 10 multiple-choice questions to receive an instant diagnostic breakdown.</p>',
      '    </div>',
      '    <div id="wContextNotice" class="w-context-notice"></div>',
      '    <div class="w-field-group">',
      '      <label class="w-field-label" for="wTopicSelect">Select Assessment Subject or Diagnostic Focus:</label>',
      '      <select id="wTopicSelect" class="form-input w-select">',
      '        <option value="all">Comprehensive TVET Assessment (All 5 Topics - Recommended)</option>',
      '        <option value="dhet_subminimum">DHET 40% Sub-minimum &amp; Exam Admission Rules</option>',
      '        <option value="weighting_formulas">ICASS Weighting &amp; External Exam Calculation Mastery</option>',
      '        <option value="poe_compliance">Portfolio of Evidence (PoE) &amp; Formative Assessment</option>',
      '        <option value="ncv_nated_rules">NC(V) vs NATED Qualification Standards</option>',
      '        <option value="moderation_recovery">Mark Moderation, Discrepancies &amp; Score Recovery</option>',
      '      </select>',
      '    </div>',
      '    <div class="w-intro-meta">',
      '      <div class="w-intro-badge"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> 10 Multiple-Choice Questions</div>',
      '      <div class="w-intro-badge"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Instant Deterministic Scoring</div>',
      '      <div class="w-intro-badge"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Targeted Weakness Practice</div>',
      '    </div>',
      '    <div class="w-btn-row">',
      '      <button type="button" id="wStartBtn" class="btn-primary w-full-btn">Generate Diagnostic Assessment (10 Questions)</button>',
      '      <button type="button" id="wCloseIntroBtn" class="btn-secondary">Close</button>',
      '    </div>',
      '    <div id="wHistoryPreview" class="w-history-preview"></div>',
      '  </div>',

      '  <!-- Screen 2: Active 10-Question Test -->',
      '  <div id="wQuizView" class="w-view" style="display:none;">',
      '    <div class="w-quiz-top">',
      '      <div class="w-quiz-info">',
      '        <span id="wQuizBadge" class="w-tag">Comprehensive Diagnostic</span>',
      '        <span class="w-quiz-counter" role="status" aria-live="polite">Question <strong id="wCurrentQNum">1</strong> of <span id="wQuestionTotal">10</span></span>',
      '      </div>',
      '      <div class="w-progress-track">',
      '        <div id="wProgressBar" class="w-progress-fill" role="progressbar" aria-label="Question progress" aria-valuemin="1" aria-valuemax="10" aria-valuenow="1" style="width: 10%;"></div>',
      '      </div>',
      '    </div>',
      '    <div class="w-question-box">',
      '      <span id="wQuestionTopic" class="w-question-topic">Topic</span>',
      '      <h3 id="wQuestionText" class="w-question-title">Question prompt</h3>',
      '      <div id="wOptionsContainer" class="w-options-grid" role="group" aria-label="Answer options"></div>',
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
      '        <div class="w-results-score-text">',
      '          <h3 id="wScoreHeadline" class="w-score-headline">Performance Summary</h3>',
      '          <p id="wScoreFraction" class="w-score-fraction">0 / 10 Correct</p>',
      '        </div>',
      '      </div>',
      '    </div>',

      '    <!-- Comparison with Previous Attempt -->',
      '    <div id="wComparisonBox" class="w-comparison-card"></div>',

      '    <!-- Strongest Topics vs Weaknesses Grid -->',
      '    <div class="w-analysis-grid">',
      '      <div class="w-analysis-card w-card-strong">',
      '        <div class="w-card-head">',
      '          <svg width="20" height="20" fill="none" stroke="#16a34a" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      '          <h4>Your Strongest Topics</h4>',
      '        </div>',
      '        <div id="wStrongTopicsList" class="w-analysis-list"></div>',
      '      </div>',
      '      <div class="w-analysis-card w-card-weak">',
      '        <div class="w-card-head">',
      '          <svg width="20" height="20" fill="none" stroke="#dc2626" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
      '          <h4>Identified Weaknesses</h4>',
      '        </div>',
      '        <div id="wWeakTopicsList" class="w-analysis-list"></div>',
      '      </div>',
      '    </div>',

      '    <!-- Targeted Action CTA -->',
      '    <div class="w-practice-banner">',
      '      <div class="w-practice-banner-text">',
      '        <h4>Turn Weaknesses into Marks</h4>',
      '        <p>Generate a targeted 10-question practice assessment focused exclusively on the topics where you lost points today.</p>',
      '      </div>',
      '      <button type="button" id="wPractiseBtn" class="btn-primary w-practice-btn">',
      '        <span>Practise My Weaknesses</span>',
      '        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
      '      </button>',
      '    </div>',

      '    <!-- Mistakes & Detailed Explanations Accordion -->',
      '    <div class="w-review-section">',
      '      <div class="w-review-head">',
      '        <h4 class="w-review-title">Step-by-Step Question Explanations &amp; Mistake Audit</h4>',
      '        <span class="w-review-sub">Review every question, verified answers, and DHET policy rationale.</span>',
      '      </div>',
      '      <div id="wReviewList" class="w-review-list"></div>',
      '    </div>',

      '    <!-- LocalStorage History Section -->',
      '    <div class="w-history-section">',
      '      <div class="w-history-head">',
      '        <h4 class="w-history-title">Assessment History (Stored on this Device)</h4>',
      '        <button type="button" id="wClearHistoryBtn" class="w-clear-link">Clear History</button>',
      '      </div>',
      '      <div id="wHistoryList" class="w-history-list"></div>',
      '    </div>',

      '    <div class="w-results-footer">',
      '      <button type="button" id="wRetakeBtn" class="btn-secondary">Take New Assessment</button>',
      '      <button type="button" id="wCloseResultsBtn" class="btn-secondary">Close Assessment</button>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('');

    // Append section after results panel
    calcWrap.appendChild(section);

    // Bind event listeners
    bindEvents();
  }

  function bindEvents() {
    var startBtn = document.getElementById('wStartBtn');
    if (startBtn) {
      startBtn.addEventListener('click', function () {
        var focus = document.getElementById('wTopicSelect').value;
        startNewAssessment(focus);
      });
    }

    var closeIntroBtn = document.getElementById('wCloseIntroBtn');
    if (closeIntroBtn) {
      closeIntroBtn.addEventListener('click', function () {
        closeWeaknessSection();
      });
    }

    var prevBtn = document.getElementById('wPrevBtn');
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        if (activeQuestionIdx > 0) {
          activeQuestionIdx--;
          renderActiveQuestion();
        }
      });
    }

    var nextBtn = document.getElementById('wNextBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        var q = currentQuestions[activeQuestionIdx];
        if (userAnswers[q.id] === undefined) {
          var alertEl = document.getElementById('wQuizValidation');
          alertEl.style.display = 'block';
          return;
        }
        document.getElementById('wQuizValidation').style.display = 'none';
        if (activeQuestionIdx < currentQuestions.length - 1) {
          activeQuestionIdx++;
          renderActiveQuestion();
        }
      });
    }

    var submitBtn = document.getElementById('wSubmitBtn');
    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        var q = currentQuestions[activeQuestionIdx];
        if (userAnswers[q.id] === undefined) {
          var alertEl = document.getElementById('wQuizValidation');
          alertEl.style.display = 'block';
          return;
        }
        document.getElementById('wQuizValidation').style.display = 'none';
        evaluateAssessment();
      });
    }

    var practiseBtn = document.getElementById('wPractiseBtn');
    if (practiseBtn) {
      practiseBtn.addEventListener('click', function () {
        startPracticeWeaknesses();
      });
    }

    var retakeBtn = document.getElementById('wRetakeBtn');
    if (retakeBtn) {
      retakeBtn.addEventListener('click', function () {
        switchView('wIntroView');
        updateContextNotice();
        renderHistoryPreview();
      });
    }

    var closeResultsBtn = document.getElementById('wCloseResultsBtn');
    if (closeResultsBtn) {
      closeResultsBtn.addEventListener('click', function () {
        closeWeaknessSection();
      });
    }

    var clearHistBtn = document.getElementById('wClearHistoryBtn');
    if (clearHistBtn) {
      clearHistBtn.addEventListener('click', function () {
        if (window.confirm('Are you sure you want to clear your saved assessment history from this device?')) {
          clearHistory();
          renderHistoryList();
          renderHistoryPreview();
          updateComparisonBox(null);
        }
      });
    }
  }

  function openWeaknessSection() {
    var section = document.getElementById('weaknessAssessmentSection');
    if (!section) return;

    section.style.display = 'block';
    updateContextNotice();
    renderHistoryPreview();
    switchView('wIntroView');

    setTimeout(function () {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  function closeWeaknessSection() {
    var section = document.getElementById('weaknessAssessmentSection');
    if (section) section.style.display = 'none';
  }

  function switchView(viewId) {
    var views = ['wIntroView', 'wQuizView', 'wResultsView'];
    views.forEach(function (v) {
      var el = document.getElementById(v);
      if (el) el.style.display = (v === viewId) ? 'block' : 'none';
    });
  }

  function updateContextNotice() {
    var noticeEl = document.getElementById('wContextNotice');
    if (!noticeEl) return;

    var ctx = getIcassInputsContext();
    if (ctx.calculatedScore !== null) {
      var bandDesc = ctx.calculatedScore >= 75 ? 'Distinction band' :
                     ctx.calculatedScore >= 65 ? 'Credit band' :
                     ctx.calculatedScore >= 50 ? 'Pass band' :
                     ctx.calculatedScore >= 40 ? 'Borderline exam entry' : 'Sub-minimum risk (DNQ)';

      var lowestInfo = ctx.lowestTask ? ' Your lowest entered task is <strong>' + ctx.lowestTask.name + ' (' + ctx.lowestTask.score + '%)</strong>.' : '';

      noticeEl.innerHTML = [
        '<div class="w-notice-box">',
        '  <span class="w-notice-title">Personalized Diagnostic Context Detected:</span>',
        '  <p>Calculated ICASS Average: <strong>' + ctx.calculatedScore.toFixed(2) + '%</strong> (' + bandDesc + ').' + lowestInfo + ' Your assessment questions will prioritize high-leverage recovery strategies and DHET compliance rules.</p>',
        '</div>'
      ].join('');
      noticeEl.style.display = 'block';
    } else if (ctx.hasInputs) {
      noticeEl.innerHTML = [
        '<div class="w-notice-box">',
        '  <span class="w-notice-title">Assessment Marks Detected:</span>',
        '  <p>You have entered task marks into the calculator. Questions will evaluate your understanding of task weighting, trial exam impact, and DHET exam eligibility.</p>',
        '</div>'
      ].join('');
      noticeEl.style.display = 'block';
    } else {
      noticeEl.innerHTML = [
        '<div class="w-notice-box">',
        '  <span class="w-notice-title">Standard Curriculum Diagnostic:</span>',
        '  <p>Select your preferred focus area below, or proceed with the balanced 10-question assessment covering South African TVET assessment standards.</p>',
        '</div>'
      ].join('');
      noticeEl.style.display = 'block';
    }
  }

  function startNewAssessment(focusTopic) {
    currentAssessmentMeta = {
      mode: 'diagnostic',
      focusTopic: focusTopic,
      targetWeaknessTopicIds: []
    };

    currentQuestions = generateQuestions(focusTopic, null);
    userAnswers = {};
    activeQuestionIdx = 0;

    var badgeText = focusTopic === 'all' ? 'Comprehensive TVET Diagnostic' : (TOPICS[focusTopic] ? TOPICS[focusTopic].shortName : 'Diagnostic');
    document.getElementById('wQuizBadge').textContent = badgeText;

    switchView('wQuizView');
    renderActiveQuestion();

    var section = document.getElementById('weaknessAssessmentSection');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function startPracticeWeaknesses() {
    if (!currentAssessmentMeta.targetWeaknessTopicIds || currentAssessmentMeta.targetWeaknessTopicIds.length === 0) {
      // If user had 100%, run a challenging full practice
      currentAssessmentMeta.targetWeaknessTopicIds = ['weighting_formulas', 'moderation_recovery'];
    }

    currentAssessmentMeta.mode = 'practice';
    currentQuestions = generateQuestions(null, currentAssessmentMeta.targetWeaknessTopicIds);
    userAnswers = {};
    activeQuestionIdx = 0;

    var weakNames = currentAssessmentMeta.targetWeaknessTopicIds.map(function (tid) {
      return TOPICS[tid] ? TOPICS[tid].shortName : tid;
    }).join(', ');

    document.getElementById('wQuizBadge').textContent = 'Weakness Practice: ' + weakNames;

    switchView('wQuizView');
    renderActiveQuestion();

    var section = document.getElementById('weaknessAssessmentSection');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderActiveQuestion() {
    var q = currentQuestions[activeQuestionIdx];
    if (!q) return;

    var topicMeta = TOPICS[q.topicId] || { name: 'General Assessment' };
    document.getElementById('wCurrentQNum').textContent = (activeQuestionIdx + 1);
    var totalEl = document.getElementById('wQuestionTotal');
    if (totalEl) totalEl.textContent = currentQuestions.length;
    var progressBar = document.getElementById('wProgressBar');
    progressBar.style.width = Math.round(((activeQuestionIdx + 1) / currentQuestions.length) * 100) + '%';
    progressBar.setAttribute('aria-valuemax', currentQuestions.length);
    progressBar.setAttribute('aria-valuenow', activeQuestionIdx + 1);
    document.getElementById('wQuestionTopic').textContent = topicMeta.name;
    var questionTitle = document.getElementById('wQuestionText');
    questionTitle.textContent = q.question;

    var optionsBox = document.getElementById('wOptionsContainer');
    optionsBox.innerHTML = '';

    var selectedIdx = userAnswers[q.id];

    q.options.forEach(function (optText, oIdx) {
      var letter = String.fromCharCode(65 + oIdx); // A, B, C, D
      var optBtn = document.createElement('button');
      optBtn.type = 'button';
      optBtn.className = 'w-option-item' + (selectedIdx === oIdx ? ' selected' : '');
      optBtn.setAttribute('aria-pressed', selectedIdx === oIdx ? 'true' : 'false');

      optBtn.innerHTML = [
        '<span class="w-option-letter">' + letter + '</span>',
        '<span class="w-option-text">' + optText + '</span>'
      ].join('');

      function selectOption() {
        userAnswers[q.id] = oIdx;
        Array.prototype.forEach.call(optionsBox.querySelectorAll('.w-option-item'), function (option, optionIndex) {
          var isSelected = optionIndex === oIdx;
          option.classList.toggle('selected', isSelected);
          option.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
        });
        document.getElementById('wQuizValidation').style.display = 'none';
      }

      optBtn.addEventListener('click', selectOption);

      optionsBox.appendChild(optBtn);
    });
    questionTitle.setAttribute('tabindex', '-1');
    questionTitle.focus({ preventScroll: true });

    // Navigation buttons
    var prevBtn = document.getElementById('wPrevBtn');
    var nextBtn = document.getElementById('wNextBtn');
    var submitBtn = document.getElementById('wSubmitBtn');

    prevBtn.disabled = activeQuestionIdx === 0;

    if (activeQuestionIdx === currentQuestions.length - 1) {
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'inline-flex';
    } else {
      nextBtn.style.display = 'inline-flex';
      submitBtn.style.display = 'none';
    }
  }

  function evaluateAssessment() {
    var correctCount = 0;
    var topicStats = {}; // { topicId: { total: 0, correct: 0 } }
    var mistakes = [];

    // Initialize stats
    Object.keys(TOPICS).forEach(function (tKey) {
      topicStats[tKey] = { total: 0, correct: 0 };
    });

    currentQuestions.forEach(function (q) {
      var userAns = userAnswers[q.id];
      var isCorrect = userAns === q.correctIndex;

      if (!topicStats[q.topicId]) topicStats[q.topicId] = { total: 0, correct: 0 };
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

    // Identify Strongest Topics vs Weaknesses
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

    // Sort weak topics ascending (lowest accuracy first)
    weakTopics.sort(function (a, b) { return a.percentage - b.percentage; });
    // Sort strong topics descending
    strongTopics.sort(function (a, b) { return b.percentage - a.percentage; });

    // Store target weakness topic IDs for "Practise My Weaknesses" button
    currentAssessmentMeta.targetWeaknessTopicIds = weakTopics.map(function (w) { return w.topicId; });
    if (currentAssessmentMeta.targetWeaknessTopicIds.length === 0 && mistakes.length > 0) {
      currentAssessmentMeta.targetWeaknessTopicIds = mistakes.map(function (m) { return m.question.topicId; });
    }

    // Compare with previous attempt from localStorage
    var history = getHistory();
    var lastAttempt = history.length > 0 ? history[0] : null;
    var delta = lastAttempt ? (scorePct - lastAttempt.percentage) : null;

    // Save this attempt to localStorage
    var attemptRecord = {
      id: 'att_' + Date.now(),
      timestamp: Date.now(),
      dateFormatted: new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      score: correctCount,
      total: currentQuestions.length,
      percentage: scorePct,
      mode: currentAssessmentMeta.mode,
      focusTopic: currentAssessmentMeta.focusTopic,
      weakTopicNames: weakTopics.map(function (w) { return w.shortName; }),
      delta: delta
    };
    saveAttemptToHistory(attemptRecord);

    // Render results view
    renderResultsView(attemptRecord, lastAttempt, strongTopics, weakTopics, mistakes);
  }

  function renderResultsView(attempt, lastAttempt, strongTopics, weakTopics, mistakes) {
    switchView('wResultsView');

    // Score display
    document.getElementById('wScoreBig').textContent = attempt.percentage + '%';
    document.getElementById('wScoreFraction').textContent = attempt.score + ' of ' + attempt.total + ' Correct';

    var headlineEl = document.getElementById('wScoreHeadline');
    if (attempt.percentage >= 80) {
      headlineEl.textContent = 'Excellent TVET Exam Readiness';
    } else if (attempt.percentage >= 60) {
      headlineEl.textContent = 'Competent with Specific Weak Spots';
    } else if (attempt.percentage >= 40) {
      headlineEl.textContent = 'At-Risk — High Priority Weaknesses Identified';
    } else {
      headlineEl.textContent = 'Critical Gaps — Immediate Revision Required';
    }

    // Comparison Card
    updateComparisonBox(attempt, lastAttempt);

    // Strongest Topics List
    var strongListEl = document.getElementById('wStrongTopicsList');
    strongListEl.innerHTML = '';
    if (strongTopics.length === 0) {
      strongListEl.innerHTML = '<div class="w-empty-note">No topics cleared at distinction level (75%+) yet. Focus on the weaknesses identified below.</div>';
    } else {
      strongTopics.forEach(function (st) {
        var item = document.createElement('div');
        item.className = 'w-topic-badge-row strong';
        item.innerHTML = [
          '<span class="w-topic-name">' + st.name + '</span>',
          '<span class="w-topic-score">' + st.correct + '/' + st.total + ' (' + st.percentage + '%)</span>'
        ].join('');
        strongListEl.appendChild(item);
      });
    }

    // Weak Topics List
    var weakListEl = document.getElementById('wWeakTopicsList');
    weakListEl.innerHTML = '';
    if (weakTopics.length === 0) {
      weakListEl.innerHTML = '<div class="w-empty-note green">Outstanding! Zero weak topics identified. All tested categories scored 75% or higher.</div>';
    } else {
      weakTopics.forEach(function (wt) {
        var item = document.createElement('div');
        item.className = 'w-topic-badge-row weak';
        item.innerHTML = [
          '<span class="w-topic-name">' + wt.name + '</span>',
          '<span class="w-topic-score">' + wt.correct + '/' + wt.total + ' (' + wt.percentage + '%)</span>'
        ].join('');
        weakListEl.appendChild(item);
      });
    }

    // Step-by-Step Explanations Review
    renderReviewList();

    // History log list
    renderHistoryList();

    var section = document.getElementById('weaknessAssessmentSection');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function updateComparisonBox(currentAttempt, lastAttempt) {
    var compBox = document.getElementById('wComparisonBox');
    if (!compBox) return;

    if (!lastAttempt) {
      compBox.innerHTML = [
        '<div class="w-comp-wrap baseline">',
        '  <div class="w-comp-icon"><svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>',
        '  <div class="w-comp-text">',
        '    <strong>Baseline diagnostic recorded.</strong>',
        '    <span> Your score is now saved in local storage. Click "Practise My Weaknesses" to drill your weak areas and measure your score improvement.</span>',
        '  </div>',
        '</div>'
      ].join('');
      return;
    }

    var delta = currentAttempt.percentage - lastAttempt.percentage;
    var sign = delta > 0 ? '+' : '';
    var isPositive = delta > 0;
    var isNeutral = delta === 0;

    var badgeClass = isPositive ? 'improved' : (isNeutral ? 'neutral' : 'regressed');
    var iconSvg = isPositive
      ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>'
      : (isNeutral
        ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/>'
        : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>');

    var message = isPositive
      ? 'Great progress! You improved by <strong>' + sign + delta + '%</strong> compared to your previous attempt (' + lastAttempt.percentage + '% &rarr; ' + currentAttempt.percentage + '%).'
      : (isNeutral
        ? 'Consistent score. You matched your previous attempt at <strong>' + currentAttempt.percentage + '%</strong>.'
        : 'Score dropped by <strong>' + delta + '%</strong> compared to your previous attempt (' + lastAttempt.percentage + '% &rarr; ' + currentAttempt.percentage + '%). Review the explanations below.');

    compBox.innerHTML = [
      '<div class="w-comp-wrap ' + badgeClass + '">',
      '  <div class="w-comp-icon"><svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">' + iconSvg + '</svg></div>',
      '  <div class="w-comp-text">',
      '    <span class="w-comp-delta ' + badgeClass + '">' + sign + delta + '% Improvement Delta</span>',
      '    <p>' + message + '</p>',
      '  </div>',
      '</div>'
    ].join('');
  }

  function renderReviewList() {
    var reviewContainer = document.getElementById('wReviewList');
    if (!reviewContainer) return;
    reviewContainer.innerHTML = '';

    currentQuestions.forEach(function (q, qIdx) {
      var userAns = userAnswers[q.id];
      var isCorrect = userAns === q.correctIndex;
      var topicMeta = TOPICS[q.topicId] || { name: 'General' };

      var card = document.createElement('div');
      card.className = 'w-review-card ' + (isCorrect ? 'correct' : 'incorrect');

      var statusBadge = isCorrect
        ? '<span class="w-verdict correct"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Correct</span>'
        : '<span class="w-verdict incorrect"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg> Mistake Identified</span>';

      var userAnsText = userAns !== undefined ? String.fromCharCode(65 + userAns) + ') ' + q.options[userAns] : 'Not answered';
      var correctAnsText = String.fromCharCode(65 + q.correctIndex) + ') ' + q.options[q.correctIndex];

      card.innerHTML = [
        '<div class="w-review-card-head">',
        '  <span class="w-review-qnum">Question ' + (qIdx + 1) + ' &bull; ' + topicMeta.name + '</span>',
        '  ' + statusBadge,
        '</div>',
        '<h4 class="w-review-prompt">' + q.question + '</h4>',
        '<div class="w-review-answers">',
        '  <div class="w-answer-line user ' + (isCorrect ? 'correct' : 'incorrect') + '">',
        '    <strong>Your Selection:</strong> <span>' + userAnsText + '</span>',
        '  </div>',
        (!isCorrect ? '  <div class="w-answer-line correct"><strong>Correct Answer:</strong> <span>' + correctAnsText + '</span></div>' : ''),
        '</div>',
        '<div class="w-review-explanation">',
        '  <strong>Policy &amp; Calculation Rationale:</strong>',
        '  <p>' + q.explanation + '</p>',
        '</div>'
      ].join('');

      reviewContainer.appendChild(card);
    });
  }

  function renderHistoryList() {
    var listEl = document.getElementById('wHistoryList');
    if (!listEl) return;

    var history = getHistory();
    if (history.length === 0) {
      listEl.innerHTML = '<div class="w-empty-note">No saved assessment history on this device yet.</div>';
      return;
    }

    listEl.innerHTML = history.map(function (item, idx) {
      var deltaBadge = '';
      if (item.delta !== null && item.delta !== undefined) {
        var sign = item.delta > 0 ? '+' : '';
        var dClass = item.delta > 0 ? 'pos' : (item.delta === 0 ? 'zero' : 'neg');
        deltaBadge = '<span class="w-hist-delta ' + dClass + '">' + sign + item.delta + '%</span>';
      }

      var weakStr = (item.weakTopicNames && item.weakTopicNames.length > 0)
        ? '<span class="w-hist-weaks">Targeted: ' + item.weakTopicNames.join(', ') + '</span>'
        : '<span class="w-hist-weaks">All topics proficient</span>';

      var modeLabel = item.mode === 'practice' ? 'Targeted Practice' : 'Diagnostic';

      return [
        '<div class="w-hist-item">',
        '  <div class="w-hist-left">',
        '    <span class="w-hist-date">' + item.dateFormatted + '</span>',
        '    <span class="w-hist-mode">' + modeLabel + '</span>',
        '    ' + weakStr,
        '  </div>',
        '  <div class="w-hist-right">',
        '    <span class="w-hist-score">' + item.percentage + '%</span>',
        '    ' + deltaBadge,
        '  </div>',
        '</div>'
      ].join('');
    }).join('');
  }

  function renderHistoryPreview() {
    var previewEl = document.getElementById('wHistoryPreview');
    if (!previewEl) return;

    var history = getHistory();
    if (history.length === 0) {
      previewEl.innerHTML = '';
      return;
    }

    var latest = history[0];
    previewEl.innerHTML = [
      '<div class="w-hist-mini-banner">',
      '  <span class="w-mini-label">Latest Saved Attempt (' + latest.dateFormatted + '):</span>',
      '  <strong>' + latest.percentage + '% (' + latest.score + '/' + latest.total + ')</strong>',
      '  <span>&bull; ' + (latest.mode === 'practice' ? 'Practice Mode' : 'Diagnostic Mode') + '</span>',
      '</div>'
    ].join('');
  }

  // Self-initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWeaknessUI);
  } else {
    initWeaknessUI();
  }
})();
