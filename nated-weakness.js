/**
 * AfriWidget TVET NATED (Report 191) "Find My Weaknesses" Diagnostic Engine
 * Pure vanilla JavaScript. Zero dependencies, zero emojis, zero tracking.
 * 100% deterministic marking, localized storage, and targeted weakness practice.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'afriwidget_nated_weakness_history';

  var TOPICS = {
    dhet_subminimum: {
      id: 'dhet_subminimum',
      name: 'DHET 40% Exam Sub-minimum & Subject Pass Thresholds',
      shortName: 'Sub-minimum & Pass Rules'
    },
    icass_mechanics: {
      id: 'icass_mechanics',
      name: 'NATED ICASS Continuous Assessment & Portfolio Composition',
      shortName: 'ICASS Term Work & Tasks'
    },
    exam_weighting_calc: {
      id: 'exam_weighting_calc',
      name: 'Report 191 40:60 Composite Calculation & Mark Formulas',
      shortName: '40:60 Calculation Mechanics'
    },
    rewrite_validity_remark: {
      id: 'rewrite_validity_remark',
      name: 'ICASS 1-Year Validity, Supplementary Rewrites & DHET Remarks',
      shortName: 'Validity & Rewrite Rules'
    },
    diploma_progression: {
      id: 'diploma_progression',
      name: 'N1-N6 Modular Progression, Experiential Training & National N Diploma',
      shortName: 'National N Diploma & In-Service'
    }
  };

  var QUESTION_BANK = [
    // --- TOPIC 1: DHET Sub-minimum & Subject Pass Thresholds ---
    {
      id: 'nat_sub_1',
      topicId: 'dhet_subminimum',
      question: 'According to the Department of Higher Education and Training (DHET) Report 191 regulations, what is the mandatory examination sub-minimum required on the external national question paper to pass a subject?',
      options: ['30%', '40%', '50%', '60%'],
      correctIndex: 1,
      explanation: 'DHET Report 191 policy establishes a mandatory 40% sub-minimum on every external national examination paper. Even if a candidate achieves a very high ICASS score and their weighted composite exceeds 40%, failing to score at least 40% on the examination paper results in an automatic subject fail.'
    },
    {
      id: 'nat_sub_2',
      topicId: 'dhet_subminimum',
      question: 'A NATED Engineering student achieves an ICASS mark of 82% and an external national exam mark of 38%. What will DHET officially record on the student\'s Statement of Results?',
      options: [
        'Pass with Merit (because composite is 55.6%)',
        'Distinction (because ICASS exceeds 80%)',
        'Fail (Examination sub-minimum of 40% not met)',
        'Condoned Pass (automatic 2% uplift)'
      ],
      correctIndex: 2,
      explanation: 'Although the calculated weighted composite is (82 × 0.40) + (38 × 0.60) = 32.8 + 22.8 = 55.6% (which is above 40%), the candidate scored only 38% in the national exam paper. Because the 40% examination sub-minimum was breached, DHET records the outcome as a fail.'
    },
    {
      id: 'nat_sub_3',
      topicId: 'dhet_subminimum',
      question: 'What overall weighted composite percentage must a NATED Report 191 candidate achieve to be awarded a subject Distinction?',
      options: ['70% or higher', '75% or higher', '80% or higher', '85% or higher'],
      correctIndex: 2,
      explanation: 'Under DHET Report 191 classification criteria, distinction standing for an instructional subject requires a final weighted composite mark of 80% or above, provided the 40% examination sub-minimum is met.'
    },
    {
      id: 'nat_sub_4',
      topicId: 'dhet_subminimum',
      question: 'Under what specific circumstances may an examination score between 37% and 39% be considered for a condoned pass concession?',
      options: [
        'Automatically for all students enrolled in public TVET colleges',
        'Only upon formal Academic Board review where the candidate achieved a strong ICASS (typically 65%+) and passed all other subjects in the trimester',
        'Only if the student purchases an exam concession certificate from Umalusi',
        'Condonations are granted automatically if the class average is below 50%'
      ],
      correctIndex: 1,
      explanation: 'Academic concessions or condoned passes for borderline scores (37%-39%) are strictly discretionary. TVET college academic boards only consider condonation where the candidate has demonstrated strong continuous classroom performance (typically an ICASS of 65% or higher) and has passed all other subjects in the examination diet.'
    },
    {
      id: 'nat_sub_5',
      topicId: 'dhet_subminimum',
      question: 'A candidate achieves exactly 40.0% in ICASS and exactly 40.0% in the national examination paper. What is the official outcome for this subject?',
      options: [
        'Fail because the safety margin was not reached',
        'Standard Pass (40.0% final composite score)',
        'Condoned Pass with probationary re-write',
        'Did Not Qualify (DNQ)'
      ],
      correctIndex: 1,
      explanation: 'The weighted composite is (40 × 0.40) + (40 × 0.60) = 16.0 + 24.0 = 40.0%. Because both the 40% examination sub-minimum and the 40% overall composite threshold are met, the candidate earns an accredited subject pass.'
    },
    {
      id: 'nat_sub_6',
      topicId: 'dhet_subminimum',
      question: 'Which quality assurance body is legally mandated in South Africa to quality-assure and certify Report 191 N1 to N3 Engineering qualifications?',
      options: ['QCTO', 'Umalusi', 'SACE', 'CHE'],
      correctIndex: 1,
      explanation: 'Umalusi is the statutory quality assurance council responsible for certifying Report 191 N1-N3 programmes, whereas the Quality Council for Trades and Occupations (QCTO) quality-assures N4-N6 occupational qualifications.'
    },

    // --- TOPIC 2: NATED ICASS Continuous Assessment & Portfolio Composition ---
    {
      id: 'nat_ica_1',
      topicId: 'icass_mechanics',
      question: 'What percentage weighting does the Internal Continuous Assessment (ICASS) contribute toward the final NATED subject result?',
      options: ['20%', '30%', '40%', '50%'],
      correctIndex: 2,
      explanation: 'The DHET NATED Report 191 assessment model assigns a 40% weighting to internal continuous assessment (ICASS) and a 60% weighting to the national external examination paper.'
    },
    {
      id: 'nat_ica_2',
      topicId: 'icass_mechanics',
      question: 'What is the minimum ICASS mark a NATED student must achieve to be granted an examination admission permit to sit the national examination?',
      options: ['30%', '35%', '40%', '50%'],
      correctIndex: 2,
      explanation: 'Under DHET policy, a student must achieve an ICASS mark of at least 40% to be admitted to write the national examination. Achieving below 40% results in a Did Not Qualify (DNQ) status on TVETMIS, barring the student from sitting the exam.'
    },
    {
      id: 'nat_ica_3',
      topicId: 'icass_mechanics',
      question: 'What items are formally compiled into a student\'s NATED ICASS Portfolio of Evidence (PoE)?',
      options: [
        'Only the final external examination script',
        'Class tests, practical/vocational assignments, research tasks, and the internal trial examination',
        'A character reference letter from the campus security office',
        'A record of lecture attendance without written academic assessments'
      ],
      correctIndex: 1,
      explanation: 'The ICASS Portfolio of Evidence (PoE) must contain authenticated formative and summative tasks completed during the trimester or semester: scheduled class tests, vocational assignments or projects, and an internal trial/preparatory examination.'
    },
    {
      id: 'nat_ica_4',
      topicId: 'icass_mechanics',
      question: 'A student misses a scheduled ICASS assessment task without submitting a certified medical certificate or verified bereavement notice within 5 working days. How is this task treated?',
      options: [
        'The lecturer estimates an average mark based on previous performance',
        'The task is assigned a score of 0%, which directly depresses the final ICASS mark',
        'The task is omitted from the denominator so the student is not penalized',
        'The student receives an automatic 40% baseline mark'
      ],
      correctIndex: 1,
      explanation: 'DHET assessment directives state that unexcused absence from an assessment task must be recorded as 0%. Because the total possible marks remain in the denominator, a zero heavily lowers the final ICASS percentage.'
    },
    {
      id: 'nat_ica_5',
      topicId: 'icass_mechanics',
      question: 'A student achieves an ICASS mark of 75.0%. How many marks does this contribute toward their final composite score out of 100?',
      options: ['25.0 marks', '30.0 marks', '37.5 marks', '40.0 marks'],
      correctIndex: 1,
      explanation: 'Because ICASS carries a 40% weight, 75.0% contributes 75 × 0.40 = 30.0 marks directly to the final 100-mark composite. This leaves the student needing only 10 marks from the exam component to reach a 40% composite (though they must still score at least 40% on the exam to satisfy the sub-minimum).'
    },
    {
      id: 'nat_ica_6',
      topicId: 'icass_mechanics',
      question: 'What is the primary objective of DHET and Umalusi regional moderation of college ICASS marks?',
      options: [
        'To adjust all college marks upward to ensure high pass rates',
        'To verify that internal assessment tasks adhere to national cognitive weighting standards, valid memoranda, and authentic student evidence',
        'To convert Report 191 marks into university GPA points',
        'To re-mark every individual student script in South Africa'
      ],
      correctIndex: 1,
      explanation: 'Regional moderation audits Portfolios of Evidence (PoEs) across TVET colleges to verify that internal tests and tasks were set at appropriate cognitive levels, marked consistently against approved national memoranda, and accurately captured on TVETMIS.'
    },

    // --- TOPIC 3: Report 191 40:60 Composite Calculation & Mark Formulas ---
    {
      id: 'nat_calc_1',
      topicId: 'exam_weighting_calc',
      question: 'A candidate achieves an ICASS mark of 60.0% and an external examination mark of 70.0%. What is the exact final composite score?',
      options: ['64.0%', '65.0%', '66.0%', '68.0%'],
      correctIndex: 2,
      explanation: 'Final composite = (ICASS × 0.40) + (Exam × 0.60) = (60.0 × 0.40) + (70.0 × 0.60) = 24.0 + 42.0 = 66.0%.'
    },
    {
      id: 'nat_calc_2',
      topicId: 'exam_weighting_calc',
      question: 'A student enters the exam hall with an ICASS mark of 50.0%. What minimum examination mark must they achieve to reach an overall composite score of 60.0%?',
      options: ['60.0%', '65.0%', '66.7%', '70.0%'],
      correctIndex: 2,
      explanation: 'ICASS contributes 50.0 × 0.40 = 20.0 marks. The marks required from the examination are 60.0 - 20.0 = 40.0 marks. Because the examination carries a 60% weight, the required exam mark is 40.0 ÷ 0.60 = 66.67% (rounded to 67%).'
    },
    {
      id: 'nat_calc_3',
      topicId: 'exam_weighting_calc',
      question: 'How does DHET process decimal composite calculations when issuing official Statements of Results?',
      options: [
        'Decimals are truncated without rounding (e.g. 39.9% becomes 39%)',
        'Results are rounded to the nearest integer (0.50 and above rounds up; 0.49 and below rounds down)',
        'All marks are rounded up to the nearest multiple of 5',
        'The decimal places are printed on the certificate without rounding'
      ],
      correctIndex: 1,
      explanation: 'DHET standard examination software rounds final composite percentages to the nearest whole number. A mark of 39.50% rounds up to 40% (a pass, provided the exam sub-minimum is met), while 39.40% rounds down to 39% (a fail).'
    },
    {
      id: 'nat_calc_4',
      topicId: 'exam_weighting_calc',
      question: 'Candidate 1 has ICASS = 38% and Exam = 75%. Candidate 2 has ICASS = 75% and Exam = 38%. Which statement correctly reflects their official status?',
      options: [
        'Both candidates pass because their average marks are equal',
        'Candidate 1 is disqualified from exam entry (DNQ: ICASS < 40%), while Candidate 2 fails due to the 40% exam sub-minimum',
        'Candidate 2 passes with merit because their ICASS was high',
        'Both candidates receive an automatic distinction'
      ],
      correctIndex: 1,
      explanation: 'Candidate 1 failed the gatekeeping rule (ICASS < 40%), which prohibits examination admission. Candidate 2 wrote the exam but scored 38%, which fails the mandatory 40% examination sub-minimum. Both fail, illustrating why both thresholds must be cleared.'
    },
    {
      id: 'nat_calc_5',
      topicId: 'exam_weighting_calc',
      question: 'A student achieves an ICASS mark of 72.0% and an external exam mark of 45.0%. Does this student pass, and what is their composite score?',
      options: [
        'Fail because the exam mark is below 50%',
        'Pass with a final composite of 55.8% (rounded to 56%)',
        'Fail because the composite is below 40%',
        'Distinction because ICASS is above 70%'
      ],
      correctIndex: 1,
      explanation: '(72.0 × 0.40) + (45.0 × 0.60) = 28.8 + 27.0 = 55.8% (rounds to 56%). Both the 40% exam sub-minimum (45% ≥ 40%) and the 40% composite pass mark are satisfied, resulting in a standard pass.'
    },
    {
      id: 'nat_calc_6',
      topicId: 'exam_weighting_calc',
      question: 'Between ICASS and the National Examination, which component provides greater mathematical leverage to lift a borderline final mark?',
      options: [
        'ICASS, because it spans the entire trimester',
        'The National Examination, because every 10% scored in the exam adds 6.0 marks to the final score (compared to 4.0 marks for ICASS)',
        'Both components exert identical mathematical leverage',
        'Neither component affects the final mark'
      ],
      correctIndex: 1,
      explanation: 'With a 60% weighting, the national examination multiplier is 0.60 versus 0.40 for ICASS. An improvement of 10% in the examination yields a +6.0 mark gain on the composite, making targeted exam revision highly impactful.'
    },

    // --- TOPIC 4: ICASS 1-Year Validity, Supplementary Rewrites & DHET Remarks ---
    {
      id: 'nat_val_1',
      topicId: 'rewrite_validity_remark',
      question: 'How long does an approved NATED ICASS mark remain valid for rewriting the national examination without repeating classroom attendance?',
      options: ['3 months', '6 months', '1 calendar year (covering two consecutive examination cycles)', '3 years'],
      correctIndex: 2,
      explanation: 'DHET Report 191 regulations state that a valid ICASS mark is retained for exactly one calendar year. For trimester-based Engineering studies, this covers the next two consecutive examination cycles.'
    },
    {
      id: 'nat_val_2',
      topicId: 'rewrite_validity_remark',
      question: 'A student fails their November national exam with 34% but holds an ICASS mark of 66%. In the next exam cycle, what are they required to do?',
      options: [
        'They must re-register the subject, re-attend all lectures, and submit a new Portfolio of Evidence',
        'They can register as an exam-only rewrite candidate and carry forward their 66% ICASS mark',
        'They forfeit their ICASS mark and their exam mark is doubled',
        'They must wait one full year before rewriting'
      ],
      correctIndex: 1,
      explanation: 'Because the ICASS mark remains valid for one calendar year, the candidate does not need to repeat lectures. They register for the national examination rewrite only, and their existing 66% ICASS mark is automatically combined with their new exam score on TVETMIS.'
    },
    {
      id: 'nat_val_3',
      topicId: 'rewrite_validity_remark',
      question: 'What happens if a candidate delays rewriting an examination until after the one-year ICASS validity window has expired?',
      options: [
        'The candidate can apply for an administrative extension for a nominal fee',
        'The ICASS mark is expunged, and the candidate must re-enroll for the subject, attend classes, and generate a fresh Portfolio of Evidence',
        'The candidate can write an oral examination instead',
        'The candidate\'s previous exam mark is automatically condoned'
      ],
      correctIndex: 1,
      explanation: 'Once the one-year validity window expires, TVETMIS archives the ICASS mark as inactive. The student cannot register for an exam-only rewrite and must complete the entire instructional trimester or semester anew.'
    },
    {
      id: 'nat_val_4',
      topicId: 'rewrite_validity_remark',
      question: 'When a student lodges a formal request for a DHET national examination re-mark, what rule applies if the re-marked score is lower than the original mark?',
      options: [
        'The student receives the higher of the two marks',
        'The re-marked score becomes the official final mark, even if it is lower than the initial score',
        'The paper is discarded and an average score is awarded',
        'The college principal chooses which mark to submit'
      ],
      correctIndex: 1,
      explanation: 'Under official DHET examination policy, the outcome of an official re-mark supersedes the initial mark completely. If the re-mark yields a lower score, that lower score becomes the candidate\'s official result.'
    },
    {
      id: 'nat_val_5',
      topicId: 'rewrite_validity_remark',
      question: 'What is the most prudent step for a candidate whose national examination result is published as 38% or 39%?',
      options: [
        'Immediately register to repeat the entire course from the beginning',
        'Apply for an official DHET re-mark or re-check within the short window published immediately after result releases',
        'Petition Umalusi for an automatic certificate',
        'Switch from Engineering Studies to Business Studies'
      ],
      correctIndex: 1,
      explanation: 'A score of 38% or 39% is within 1 to 2 marks of the 40% sub-minimum pass mark. Applying for an official re-check or re-mark during the DHET post-results window is the fastest way to potentially clear the subject without having to wait for the next exam cycle.'
    },
    {
      id: 'nat_val_6',
      topicId: 'rewrite_validity_remark',
      question: 'Can a student who passed an examination with 50% re-write the examination paper during the next cycle to achieve a higher mark or distinction using their valid ICASS?',
      options: [
        'No, passing candidates are permanently barred from rewriting',
        'Yes, candidates may register for an examination rewrite within the valid ICASS period to improve their grade',
        'Only with permission from the provincial Premier',
        'Yes, but their previous pass is cancelled as soon as they register'
      ],
      correctIndex: 1,
      explanation: 'Candidates are permitted to rewrite an examination within the valid ICASS window to improve their subject grade (for example, to reach distinction standing or qualify for competitive university or bursary programs).'
    },

    // --- TOPIC 5: N1-N6 Modular Progression, Experiential Training & National N Diploma ---
    {
      id: 'nat_dip_1',
      topicId: 'diploma_progression',
      question: 'How many instructional subjects must a NATED Engineering Studies candidate pass at each level (N1 to N6) to earn the corresponding National Certificate?',
      options: ['2 subjects', '3 subjects', '4 subjects', '6 subjects'],
      correctIndex: 2,
      explanation: 'Under Report 191 regulations, an Engineering Studies candidate must enroll for and pass a minimum of 4 instructional subjects per N-level (e.g. Mathematics, Engineering Science, and two trade-specific electives) to be awarded the National Certificate.'
    },
    {
      id: 'nat_dip_2',
      topicId: 'diploma_progression',
      question: 'In addition to completing all N4, N5, and N6 instructional subjects, what workplace requirement must a Business Studies candidate fulfill to be awarded the National N Diploma (NQF Level 6)?',
      options: [
        '6 months of classroom computer tutorials',
        '18 months (or 2,000 verified hours) of relevant in-service practical workplace experience documented in an official DHET logbook',
        'Passing a secondary school matriculation examination',
        'Completing 50 hours of volunteer community service'
      ],
      correctIndex: 1,
      explanation: 'The National N Diploma in Business Studies requires completion of the N6 National Certificate plus a minimum of 18 months (or 2,000 verified hours) of relevant in-service practical workplace experience documented in a certified DHET logbook.'
    },
    {
      id: 'nat_dip_3',
      topicId: 'diploma_progression',
      question: 'How many months of practical trade or industrial workplace experience are required for an Engineering Studies N6 graduate to qualify for the National N Diploma?',
      options: [
        '12 months',
        '18 months',
        '24 months (or 2,670 verified hours) under certified mentorship',
        '36 months'
      ],
      correctIndex: 2,
      explanation: 'For Engineering Studies, DHET mandates a minimum of 24 months (or 2,670 verified hours) of practical trade or industrial in-service workplace experience under certified mentorship before the National N Diploma can be conferred.'
    },
    {
      id: 'nat_dip_4',
      topicId: 'diploma_progression',
      question: 'How is a candidate\'s workplace experiential training logbook verified before being forwarded to the DHET National Diploma Directorate?',
      options: [
        'The student signs a statutory declaration without external review',
        'The logbook must be verified and signed by the certified employer supervisor and endorsed by the TVET college Work-Integrated Learning (WIL) coordinator',
        'Through an unverified online web portal',
        'By the student\'s class representative'
      ],
      correctIndex: 1,
      explanation: 'The official DHET logbook must be systematically signed and stamped by the qualified workplace supervisor/mentor and formally audited by the TVET college Work-Integrated Learning (WIL) office before submission to DHET.'
    },
    {
      id: 'nat_dip_5',
      topicId: 'diploma_progression',
      question: 'What is the primary structural difference between Report 191 (NATED) and the National Certificate (Vocational) [NC(V)]?',
      options: [
        'NATED is an unaccredited private qualification, while NC(V) is public',
        'NATED is a modular post-matric/technical trimester or semester programme leading to N1-N6 certificates and the National N Diploma, whereas NC(V) is a 3-year vocational qualification spanning NQF Levels 2 to 4',
        'NC(V) does not require written examinations',
        'NATED qualifications do not have an ICASS component'
      ],
      correctIndex: 1,
      explanation: 'NATED Report 191 is a modular vocational stream operating on trimesters (Engineering) or semesters (Business) culminating in N6 certificates and the National N Diploma. NC(V) is a three-year full-time vocational programme equivalent to Grades 10-12 (NQF Levels 2-4).'
    },
    {
      id: 'nat_dip_6',
      topicId: 'diploma_progression',
      question: 'If a NATED candidate passes 3 out of 4 subjects in an N4 examination diet, what happens to the 3 passed subjects?',
      options: [
        'The passed subjects are forfeited because the entire trimester was not cleared',
        'The 3 passed subjects are permanently credited on the candidate\'s DHET record, and only the failed subject must be rewritten or repeated',
        'The student must repeat all 4 subjects from scratch',
        'The student is demoted to N3 level'
      ],
      correctIndex: 1,
      explanation: 'Report 191 is strictly modular. Credits earned for passed instructional subjects never expire and are permanently recorded on the candidate\'s DHET academic record. The student only needs to clear the outstanding subject.'
    }
  ];

  // Assessment State
  var currentQuestions = [];
  var activeQuestionIdx = 0;
  var userAnswers = {};
  var currentAssessmentMeta = {
    mode: 'diagnostic', // 'diagnostic' | 'targeted_practice'
    focusTopic: null,
    targetWeaknessTopicIds: []
  };

  function getNatedInputsContext() {
    var tabSingle = document.getElementById('tabSingle');
    var isSingleMode = tabSingle ? tabSingle.classList.contains('active') : true;

    if (isSingleMode) {
      var icassVal = parseFloat(document.getElementById('icassInput') ? document.getElementById('icassInput').value : '');
      var examVal = parseFloat(document.getElementById('examInput') ? document.getElementById('examInput').value : '');
      var hasIcass = !isNaN(icassVal);
      var hasExam = !isNaN(examVal);

      if (hasIcass && hasExam) {
        var composite = (icassVal * 0.40) + (examVal * 0.60);
        var subMinPass = examVal >= 40.0;
        var icassPass = icassVal >= 40.0;

        if (!icassPass) {
          return {
            status: 'warning',
            title: 'ICASS Gatekeeping Risk Detected',
            text: 'Your entered ICASS mark of ' + icassVal.toFixed(1) + '% is below DHET\'s 40% threshold for examination admission (DNQ). Focus your assessment on ICASS portfolio compliance and formative tasks.',
            recommendedTopic: 'icass_mechanics'
          };
        }
        if (!subMinPass) {
          return {
            status: 'danger',
            title: 'Exam Sub-minimum Risk Detected',
            text: 'Your entered national exam mark of ' + examVal.toFixed(1) + '% breaches the mandatory 40% sub-minimum, causing an automatic fail despite your composite of ' + composite.toFixed(1) + '%. Focus on exam sub-minimum mastery.',
            recommendedTopic: 'dhet_subminimum'
          };
        }
        if (composite >= 80.0) {
          return {
            status: 'success',
            title: 'Distinction Standing Projected',
            text: 'Your entered marks project a distinction composite of ' + composite.toFixed(1) + '%. Verify your mastery across all DHET assessment and diploma progression standards.',
            recommendedTopic: 'all'
          };
        }
        return {
          status: 'info',
          title: 'Entered Marks Detected',
          text: 'Calculated composite: ' + composite.toFixed(1) + '% (Pass). Take this 10-question diagnostic to identify any hidden understanding gaps in Report 191 rules before your exams.',
          recommendedTopic: 'exam_weighting_calc'
        };
      }
    } else {
      // Trimester Mode
      var rows = document.querySelectorAll('#natedSubjectRows .subject-row');
      var subMinFails = [];
      var lowestSubject = null;
      var lowestComp = 101;

      rows.forEach(function (row, idx) {
        var nameInput = row.querySelector('.subject-name');
        var icassEl = row.querySelector('.subject-icass');
        var examEl = row.querySelector('.subject-exam');
        var name = (nameInput && nameInput.value.trim()) || ('Subject ' + (idx + 1));
        var iVal = icassEl ? parseFloat(icassEl.value) : NaN;
        var eVal = examEl ? parseFloat(examEl.value) : NaN;

        if (!isNaN(iVal) && !isNaN(eVal)) {
          var comp = (iVal * 0.40) + (eVal * 0.60);
          if (eVal < 40.0) {
            subMinFails.push({ name: name, exam: eVal, comp: comp });
          }
          if (comp < lowestComp) {
            lowestComp = comp;
            lowestSubject = { name: name, comp: comp, exam: eVal, icass: iVal };
          }
        }
      });

      if (subMinFails.length > 0) {
        return {
          status: 'danger',
          title: 'Sub-minimum Failures in Trimester Load',
          text: 'One or more subjects (' + subMinFails.map(function(s){ return s.name; }).join(', ') + ') breach the 40% exam sub-minimum. Take this diagnostic to master sub-minimum thresholds and rewrite policies.',
          recommendedTopic: 'dhet_subminimum'
        };
      }
      if (lowestSubject) {
        return {
          status: 'info',
          title: 'Trimester Subjects Evaluated',
          text: 'Lowest projected subject: ' + lowestSubject.name + ' (' + lowestSubject.comp.toFixed(1) + '%). Test your understanding to lock in your subject credits.',
          recommendedTopic: 'exam_weighting_calc'
        };
      }
    }

    return {
      status: 'neutral',
      title: 'Ready for Diagnostic',
      text: 'Test your understanding of DHET Report 191 assessment rules, the 40% exam sub-minimum, ICASS validity windows, and National N Diploma requirements.',
      recommendedTopic: 'all'
    };
  }

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
      if (history.length > 20) history = history.slice(0, 20);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {}
  }

  function clearHistory() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      renderHistoryList();
      renderHistoryPreview();
      updateComparisonBox(null, null);
    } catch (e) {}
  }

  function generateQuestions(mode, focusTopic, targetTopicIds) {
    var pool = QUESTION_BANK.slice();
    var selected = [];

    // Targeted Weakness Practice Mode
    if (mode === 'targeted_practice' && targetTopicIds && targetTopicIds.length > 0) {
      var weakPool = pool.filter(function (q) {
        return targetTopicIds.indexOf(q.topicId) !== -1;
      });
      weakPool.sort(function () { return 0.5 - Math.random(); });
      selected = weakPool.slice(0, 10);

      // If fewer than 10 questions in weak topics, backfill
      if (selected.length < 10) {
        var remaining = pool.filter(function (q) {
          return selected.indexOf(q) === -1;
        });
        remaining.sort(function () { return 0.5 - Math.random(); });
        selected = selected.concat(remaining.slice(0, 10 - selected.length));
      }
      return selected;
    }

    // Specific Single Topic Selected
    if (focusTopic && focusTopic !== 'all' && TOPICS[focusTopic]) {
      var topicQ = pool.filter(function (q) { return q.topicId === focusTopic; });
      topicQ.sort(function () { return 0.5 - Math.random(); });
      selected = topicQ.slice(0, 6);

      var others = pool.filter(function (q) { return q.topicId !== focusTopic; });
      others.sort(function () { return 0.5 - Math.random(); });
      return selected.concat(others.slice(0, 10 - selected.length));
    }

    // Default Balanced 10-Question Diagnostic (2 questions per topic across 5 topics)
    var topicKeys = Object.keys(TOPICS);
    topicKeys.forEach(function (tKey) {
      var tPool = pool.filter(function (q) { return q.topicId === tKey; });
      tPool.sort(function () { return 0.5 - Math.random(); });
      selected = selected.concat(tPool.slice(0, 2));
    });

    selected.sort(function () { return 0.5 - Math.random(); });
    return selected.slice(0, 10);
  }

  function initWeaknessUI() {
    var calcWrap = document.querySelector('.calc-wrap .container-narrow');
    if (!calcWrap) return;

    if (document.getElementById('weaknessAssessmentSection')) return;

    if (!document.getElementById('afriwidget-weakness-ui')) {
      var weaknessStyles = document.createElement('link');
      weaknessStyles.id = 'afriwidget-weakness-ui';
      weaknessStyles.rel = 'stylesheet';
      weaknessStyles.href = '/weakness-ui.css';
      document.head.appendChild(weaknessStyles);
    }

    // 1. Add "Find My Weaknesses" button in calculator action row
    var actionRow = document.querySelector('#natedForm .action-row') || document.querySelector('.action-row');
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
        '  <h3 class="w-banner-title">Diagnose Your TVET NATED Weaknesses</h3>',
        '  <p class="w-banner-desc">Take a personalized 10-question diagnostic based on your entered marks and DHET Report 191 pass standards.</p>',
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
      '      <span class="w-eyebrow">AfriWidget Diagnostic Engine</span>',
      '      <div class="w-header-title-row">',
      '        <h3 id="wDiagnosticTitle" class="w-title">Find My NATED Weaknesses</h3>',
      '        <button type="button" id="wCloseIntroBtn" class="w-close-btn" aria-label="Close diagnostic">&times;</button>',
      '      </div>',
      '      <p class="w-subtitle">A deterministic 10-question assessment evaluating your mastery of DHET Report 191 sub-minimums, ICASS continuous assessment weighting, 1-year validity rules, and National N Diploma requirements.</p>',
      '    </div>',
      '    <div id="wContextNotice" class="w-context-card"></div>',
      '    <div class="w-topic-select-wrap">',
      '      <label for="wTopicSelect" class="w-label">Select diagnostic focus:</label>',
      '      <select id="wTopicSelect" class="w-form-select">',
      '        <option value="all" selected>All Topics (Comprehensive 10-Question Balanced Diagnostic)</option>',
      '        <option value="dhet_subminimum">DHET 40% Exam Sub-minimum &amp; Subject Pass Thresholds</option>',
      '        <option value="icass_mechanics">NATED ICASS Continuous Assessment &amp; Portfolio Composition</option>',
      '        <option value="exam_weighting_calc">Report 191 40:60 Composite Calculation &amp; Mark Formulas</option>',
      '        <option value="rewrite_validity_remark">ICASS 1-Year Validity, Supplementary Rewrites &amp; DHET Remarks</option>',
      '        <option value="diploma_progression">N1-N6 Modular Progression, Experiential Training &amp; National N Diploma</option>',
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
      '  <!-- Screen 2: Active Question Assessment -->',
      '  <div id="wQuizView" class="w-view" style="display:none;">',
      '    <div class="w-quiz-top">',
      '      <div class="w-quiz-info">',
      '        <span id="wQuizBadge" class="w-tag">Question</span>',
      '        <span id="wQuizCounter" class="w-quiz-counter" role="status" aria-live="polite">Question <span id="wCurrentQNum">1</span> of <span id="wQuestionTotal">10</span></span>',
      '      </div>',
      '      <div class="w-progress-track">',
      '        <div id="wProgressBar" class="w-progress-fill" role="progressbar" aria-label="Question progress" aria-valuemin="1" aria-valuemax="10" aria-valuenow="1" style="width: 10%;"></div>',
      '      </div>',
      '    </div>',
      '    <div class="w-question-box">',
      '      <span id="wQuestionTopic" class="w-question-topic"></span>',
      '      <h4 id="wQuestionText" class="w-question-title"></h4>',
      '      <div id="wOptionsContainer" class="w-options-grid" role="group" aria-label="Answer options"></div>',
      '    </div>',
      '    <div id="wQuizValidation" class="w-validation-alert" style="display:none;">Please select an option before proceeding.</div>',
      '    <div class="w-quiz-nav">',
      '      <button type="button" id="wPrevBtn" class="btn-secondary" style="visibility:hidden;">Previous</button>',
      '      <button type="button" id="wNextBtn" class="btn-primary">Next Question &rarr;</button>',
      '      <button type="button" id="wSubmitBtn" class="btn-primary" style="display:none;">Submit &amp; View Weaknesses</button>',
      '    </div>',
      '  </div>',
      '  <!-- Screen 3: Diagnostic Report & Targeted Practice -->',
      '  <div id="wResultsView" class="w-view" style="display:none;">',
      '    <div class="w-results-header">',
      '      <div class="w-header-title-row">',
      '        <span class="w-eyebrow">Diagnostic Evaluation</span>',
      '        <button type="button" id="wCloseResultsBtn" class="w-close-btn" aria-label="Close diagnostic">&times;</button>',
      '      </div>',
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
      '          <h4>Strongest Topics (&ge;75%)</h4>',
      '        </div>',
      '        <div id="wStrongTopicsList" class="w-analysis-list"></div>',
      '      </div>',
      '      <div class="w-analysis-card w-card-weak">',
      '        <div class="w-card-head">',
      '          <svg width="20" height="20" fill="none" stroke="#dc2626" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
      '          <h4>Identified Weaknesses (&lt;75%)</h4>',
      '        </div>',
      '        <div id="wWeakTopicsList" class="w-analysis-list"></div>',
      '      </div>',
      '    </div>',
      '    <div id="wPracticeBanner" class="w-practice-banner" style="display:none;">',
      '      <div class="w-practice-banner-text">',
      '        <h4>Targeted Weakness Practice Available</h4>',
      '        <p>Generate a customized 10-question set focused specifically on your identified weak areas to strengthen your understanding before exam day.</p>',
      '      </div>',
      '      <button type="button" id="wPractiseBtn" class="w-practice-btn">',
      '        <span>Practise My Weaknesses</span>',
      '        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>',
      '      </button>',
      '    </div>',
      '    <div class="w-review-section">',
      '      <div class="w-review-head">',
      '        <h4 class="w-review-title">Step-by-Step Question Review</h4>',
      '        <p class="w-review-sub">Review each question, your answer, and the official DHET Report 191 policy explanation.</p>',
      '      </div>',
      '      <div id="wReviewList" class="w-review-list"></div>',
      '    </div>',
      '    <div id="wHistorySection" class="w-history-section">',
      '      <div class="w-history-head">',
      '        <h4 class="w-history-title">Assessment History (Local)</h4>',
      '        <button type="button" id="wClearHistoryBtn" class="w-clear-link">Clear History</button>',
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

    var closeResultsBtn = document.getElementById('wCloseResultsBtn');
    if (closeResultsBtn) closeResultsBtn.addEventListener('click', closeWeaknessSection);

    var startBtn = document.getElementById('wStartBtn');
    if (startBtn) {
      startBtn.addEventListener('click', function () {
        var sel = document.getElementById('wTopicSelect');
        var chosenTopic = sel ? sel.value : 'all';
        startNewAssessment('diagnostic', chosenTopic);
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
        var currentQ = currentQuestions[activeQuestionIdx];
        if (userAnswers[currentQ.id] === undefined) {
          var valAlert = document.getElementById('wQuizValidation');
          if (valAlert) valAlert.style.display = 'block';
          return;
        }
        var valAlert2 = document.getElementById('wQuizValidation');
        if (valAlert2) valAlert2.style.display = 'none';

        if (activeQuestionIdx < currentQuestions.length - 1) {
          activeQuestionIdx++;
          renderActiveQuestion();
        }
      });
    }

    var submitBtn = document.getElementById('wSubmitBtn');
    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        var currentQ = currentQuestions[activeQuestionIdx];
        if (userAnswers[currentQ.id] === undefined) {
          var valAlert = document.getElementById('wQuizValidation');
          if (valAlert) valAlert.style.display = 'block';
          return;
        }
        var valAlert3 = document.getElementById('wQuizValidation');
        if (valAlert3) valAlert3.style.display = 'none';
        evaluateAssessment();
      });
    }

    var retakeBtn = document.getElementById('wRetakeBtn');
    if (retakeBtn) {
      retakeBtn.addEventListener('click', function () {
        switchView('wIntroView');
        updateContextNotice();
        renderHistoryPreview();
        var sec = document.getElementById('weaknessAssessmentSection');
        if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    var practiseBtn = document.getElementById('wPractiseBtn');
    if (practiseBtn) {
      practiseBtn.addEventListener('click', function () {
        startPracticeWeaknesses();
      });
    }

    var clearBtn = document.getElementById('wClearHistoryBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        if (confirm('Are you sure you want to clear your local diagnostic test history?')) {
          clearHistory();
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
    var ctx = getNatedInputsContext();

    var iconSvg = '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
    if (ctx.status === 'danger' || ctx.status === 'warning') {
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

  function startNewAssessment(mode, focusTopic) {
    currentAssessmentMeta.mode = mode || 'diagnostic';
    currentAssessmentMeta.focusTopic = focusTopic || 'all';
    currentQuestions = generateQuestions(currentAssessmentMeta.mode, currentAssessmentMeta.focusTopic);
    activeQuestionIdx = 0;
    userAnswers = {};

    var badge = document.getElementById('wQuizBadge');
    if (badge) {
      if (currentAssessmentMeta.focusTopic !== 'all' && TOPICS[currentAssessmentMeta.focusTopic]) {
        badge.textContent = TOPICS[currentAssessmentMeta.focusTopic].shortName + ' Focus';
      } else {
        badge.textContent = 'Comprehensive Diagnostic';
      }
    }

    switchView('wQuizView');
    renderActiveQuestion();
    var section = document.getElementById('weaknessAssessmentSection');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function startPracticeWeaknesses() {
    if (!currentAssessmentMeta.targetWeaknessTopicIds || currentAssessmentMeta.targetWeaknessTopicIds.length === 0) {
      startNewAssessment('diagnostic', 'all');
      return;
    }
    currentAssessmentMeta.mode = 'targeted_practice';
    currentQuestions = generateQuestions('targeted_practice', null, currentAssessmentMeta.targetWeaknessTopicIds);
    activeQuestionIdx = 0;
    userAnswers = {};

    var badge = document.getElementById('wQuizBadge');
    if (badge) badge.textContent = 'Targeted Weakness Practice';

    switchView('wQuizView');
    renderActiveQuestion();
    var section = document.getElementById('weaknessAssessmentSection');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderActiveQuestion() {
    var q = currentQuestions[activeQuestionIdx];
    if (!q) return;

    var topicMeta = TOPICS[q.topicId] || { name: q.topicId };
    var topicLabel = document.getElementById('wQuestionTopic');
    if (topicLabel) topicLabel.textContent = topicMeta.name;

    var qText = document.getElementById('wQuestionText');
    if (qText) qText.textContent = q.question;

    var curNum = document.getElementById('wCurrentQNum');
    if (curNum) curNum.textContent = String(activeQuestionIdx + 1);

    var bar = document.getElementById('wProgressBar');
    if (bar) {
      var pct = Math.round(((activeQuestionIdx + 1) / currentQuestions.length) * 100);
      bar.style.width = pct + '%';
      bar.setAttribute('aria-valuemax', currentQuestions.length);
      bar.setAttribute('aria-valuenow', activeQuestionIdx + 1);
    }
    var totalEl = document.getElementById('wQuestionTotal');
    if (totalEl) totalEl.textContent = currentQuestions.length;

    var optionsBox = document.getElementById('wOptionsContainer');
    if (optionsBox) {
      optionsBox.innerHTML = '';
      var letters = ['A', 'B', 'C', 'D'];
      q.options.forEach(function (optText, optIdx) {
        var isSelected = userAnswers[q.id] === optIdx;
        var item = document.createElement('button');
        item.type = 'button';
        item.className = 'w-option-item' + (isSelected ? ' selected' : '');
        item.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
        item.innerHTML = [
          '<span class="w-option-letter">' + letters[optIdx] + '</span>',
          '<span class="w-option-text">' + optText + '</span>'
        ].join('');

        item.addEventListener('click', function () {
          selectOption(q.id, optIdx);
        });
        optionsBox.appendChild(item);
      });
    }
    if (qText) {
      qText.setAttribute('tabindex', '-1');
      qText.focus({ preventScroll: true });
    }

    var prevBtn = document.getElementById('wPrevBtn');
    if (prevBtn) {
      prevBtn.style.visibility = activeQuestionIdx === 0 ? 'hidden' : 'visible';
    }

    var nextBtn = document.getElementById('wNextBtn');
    var submitBtn = document.getElementById('wSubmitBtn');
    var isLast = activeQuestionIdx === currentQuestions.length - 1;

    if (nextBtn && submitBtn) {
      nextBtn.style.display = isLast ? 'none' : 'inline-flex';
      submitBtn.style.display = isLast ? 'inline-flex' : 'none';
    }

    var valAlert = document.getElementById('wQuizValidation');
    if (valAlert) valAlert.style.display = 'none';
  }

  function selectOption(qId, optIdx) {
    userAnswers[qId] = optIdx;
    var optionsBox = document.getElementById('wOptionsContainer');
    if (optionsBox) {
      Array.prototype.forEach.call(optionsBox.querySelectorAll('.w-option-item'), function (option, optionIndex) {
        var isSelected = optionIndex === optIdx;
        option.classList.toggle('selected', isSelected);
        option.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      });
    }
    var validation = document.getElementById('wQuizValidation');
    if (validation) validation.style.display = 'none';
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
      var isCorrect = userAns === q.correctIndex;
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
        headline.textContent = 'Exam-Ready Distinction Understanding';
      } else if (attempt.percentage >= 60) {
        headline.textContent = 'Solid Pass Foundation with Specific Gaps';
      } else if (attempt.percentage >= 40) {
        headline.textContent = 'Borderline Sub-minimum Risk Detected';
      } else {
        headline.textContent = 'Critical Regulatory Knowledge Gaps';
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
        strongList.innerHTML = '<div class="w-empty-note">No topics cleared the 75% strength threshold on this attempt. Review the explanations below.</div>';
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
        weakList.innerHTML = '<div class="w-empty-note green">Excellent. All assessed topics scored 75% or higher. Zero critical weaknesses identified.</div>';
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

    var practiceBanner = document.getElementById('wPracticeBanner');
    if (practiceBanner) {
      practiceBanner.style.display = weakTopics.length > 0 ? 'flex' : 'none';
    }

    renderReviewList();
    renderHistoryList();

    var section = document.getElementById('weaknessAssessmentSection');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function updateComparisonBox(currentAttempt, lastAttempt) {
    var compBox = document.getElementById('wComparisonBox');
    if (!compBox) return;

    if (!currentAttempt || !lastAttempt) {
      compBox.innerHTML = [
        '<div class="w-comp-wrap baseline">',
        '  <div class="w-comp-icon">',
        '    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
        '  </div>',
        '  <div class="w-comp-text">',
        '    <span class="w-comp-delta neutral">Baseline Diagnostic Recorded</span>',
        '    <p>This attempt is now stored locally as your baseline benchmark. Run targeted practice sessions or retake the diagnostic to track your score progression over time.</p>',
        '  </div>',
        '</div>'
      ].join('');
      return;
    }

    var delta = currentAttempt.percentage - lastAttempt.percentage;
    var cssClass = delta > 0 ? 'improved' : (delta < 0 ? 'regressed' : 'neutral');
    var sign = delta > 0 ? '+' : '';

    var iconSvg = delta > 0
      ? '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>'
      : (delta < 0
        ? '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"/></svg>'
        : '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/></svg>');

    var deltaText = delta > 0
      ? ('Score improved by ' + sign + delta + '% compared to your previous attempt (' + lastAttempt.percentage + '% on ' + lastAttempt.dateFormatted + ').')
      : (delta < 0
        ? ('Score decreased by ' + Math.abs(delta) + '% compared to your previous attempt (' + lastAttempt.percentage + '% on ' + lastAttempt.dateFormatted + '). Focus on the targeted practice set below.')
        : ('Score unchanged (' + currentAttempt.percentage + '%) compared to your last attempt on ' + lastAttempt.dateFormatted + '.'));

    compBox.innerHTML = [
      '<div class="w-comp-wrap ' + cssClass + '">',
      '  <div class="w-comp-icon">' + iconSvg + '</div>',
      '  <div class="w-comp-text">',
      '    <span class="w-comp-delta ' + cssClass + '">' + (delta !== 0 ? (sign + delta + '% Delta') : '0% Delta') + '</span>',
      '    <p>' + deltaText + '</p>',
      '  </div>',
      '</div>'
    ].join('');
  }

  function renderReviewList() {
    var reviewBox = document.getElementById('wReviewList');
    if (!reviewBox) return;
    reviewBox.innerHTML = '';

    var letters = ['A', 'B', 'C', 'D'];

    currentQuestions.forEach(function (q, idx) {
      var userAns = userAnswers[q.id];
      var isCorrect = userAns === q.correctIndex;
      var card = document.createElement('div');
      card.className = 'w-review-card ' + (isCorrect ? 'correct' : 'incorrect');

      var userLine = '';
      if (userAns !== undefined) {
        userLine = '<div class="w-answer-line user ' + (isCorrect ? 'correct' : 'incorrect') + '"><strong>Your answer:</strong> (' + letters[userAns] + ') ' + q.options[userAns] + '</div>';
      } else {
        userLine = '<div class="w-answer-line user incorrect"><strong>Your answer:</strong> No option selected</div>';
      }

      var correctLine = '';
      if (!isCorrect) {
        correctLine = '<div class="w-answer-line correct"><strong>Correct answer:</strong> (' + letters[q.correctIndex] + ') ' + q.options[q.correctIndex] + '</div>';
      }

      card.innerHTML = [
        '<div class="w-review-card-head">',
        '  <span class="w-review-qnum">Question ' + (idx + 1) + ' &bull; ' + (TOPICS[q.topicId] ? TOPICS[q.topicId].shortName : q.topicId) + '</span>',
        '  <span class="w-verdict ' + (isCorrect ? 'correct' : 'incorrect') + '">' + (isCorrect ? '&check; Correct' : '&cross; Incorrect') + '</span>',
        '</div>',
        '<p class="w-review-prompt">' + q.question + '</p>',
        '<div class="w-review-answers">',
        userLine,
        correctLine,
        '</div>',
        '<div class="w-review-explanation">',
        '  <strong>DHET Policy &amp; Assessment Rationale:</strong>',
        '  <p>' + q.explanation + '</p>',
        '</div>'
      ].join('');

      reviewBox.appendChild(card);
    });
  }

  function renderHistoryList() {
    var histList = document.getElementById('wHistoryList');
    if (!histList) return;
    histList.innerHTML = '';

    var history = getHistory();
    if (history.length === 0) {
      histList.innerHTML = '<div class="w-empty-note">No saved test attempts found. Complete a diagnostic to track your results.</div>';
      return;
    }

    history.forEach(function (att) {
      var item = document.createElement('div');
      item.className = 'w-hist-item';

      var modeLabel = att.mode === 'targeted_practice' ? 'Targeted Weakness Practice' : 'Comprehensive Diagnostic';
      var weakStr = (att.weakTopicNames && att.weakTopicNames.length > 0)
        ? ('Gaps: ' + att.weakTopicNames.join(', '))
        : 'No critical weaknesses';

      var deltaBadge = '';
      if (att.delta !== null && att.delta !== undefined) {
        var dClass = att.delta > 0 ? 'pos' : (att.delta < 0 ? 'neg' : 'zero');
        var dSign = att.delta > 0 ? '+' : '';
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

  // Self-initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWeaknessUI);
  } else {
    initWeaknessUI();
  }
})();
