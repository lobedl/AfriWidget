/**
 * AfriWidget Kenya KCSE & KUCCPS Cluster "Find My Weaknesses" Diagnostic Engine
 * Pure vanilla JavaScript. Zero dependencies, zero emojis, zero tracking.
 * 100% deterministic marking, localized storage, and targeted weakness practice.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'afriwidget_kuccps_weakness_history';

  var TOPICS = {
    raw_cluster_calc: {
      id: 'raw_cluster_calc',
      name: 'Raw Cluster Metric & Formula Mechanics [W = sqrt((r ÷ 48) × (t ÷ 84)) × 48]',
      shortName: 'Cluster Formula Mechanics'
    },
    cluster_subject_baskets: {
      id: 'cluster_subject_baskets',
      name: 'KUCCPS 23 Cluster Groups & Mandatory Subject Baskets',
      shortName: 'Cluster Subject Baskets'
    },
    cutoff_points_fluctuations: {
      id: 'cutoff_points_fluctuations',
      name: 'University Departmental Weighted Cut-off Points & Demand',
      shortName: 'Cut-off Trends & Capacity'
    },
    mean_grade_subminimums: {
      id: 'mean_grade_subminimums',
      name: 'Overall Mean Grade Floors (C+ baseline) vs Subject Sub-minimums',
      shortName: 'Mean Grade & Sub-minimums'
    },
    inter_institutional_transfer: {
      id: 'inter_institutional_transfer',
      name: 'KUCCPS Revision of Choices & Inter-Institutional Transfers',
      shortName: 'Revision & Transfer Rules'
    }
  };

  var QUESTION_BANK = [
    // --- TOPIC 1: Cluster Formula Mechanics ---
    {
      id: 'kcp_calc_1',
      topicId: 'raw_cluster_calc',
      question: 'In the official KUCCPS weighted cluster points formula W = sqrt((r ÷ 48) × (t ÷ 84)) × 48, what does variable "r" represent?',
      options: [
        'The candidate\'s mean grade converted to a percentage',
        'The sum of points scored in the four specific subject prerequisites for that degree cluster (max 48 points)',
        'The total points across all 7 subjects written in KCSE (max 84 points)',
        'The ranking position of the secondary school nationally'
      ],
      correctIndex: 1,
      explanation: 'In the KUCCPS mathematical formula, "r" represents the raw cluster points earned by summing the candidate\'s points across the 4 specific subjects required for that cluster (each subject max 12 points, so 4 × 12 = 48).'
    },
    {
      id: 'kcp_calc_2',
      topicId: 'raw_cluster_calc',
      question: 'In the KUCCPS weighted cluster points formula, what does variable "t" represent?',
      options: [
        'The total aggregate points earned in the candidate\'s best seven KCSE subjects (max 84 points)',
        'The time taken to complete the KCSE examinations in minutes',
        'The tuition fee payable to the university in thousands of shillings',
        'The number of years since the candidate finished high school'
      ],
      correctIndex: 0,
      explanation: '"t" represents the candidate\'s total KCSE aggregate points earned across their best seven qualifying subjects (each max 12 points, giving a theoretical maximum of 7 × 12 = 84 points).'
    },
    {
      id: 'kcp_calc_3',
      topicId: 'raw_cluster_calc',
      question: 'What is the theoretical maximum Weighted Cluster Point (W) achievable by any student in KUCCPS placement?',
      options: [
        '24.000 points',
        '48.000 points',
        '84.000 points',
        '100.000 points'
      ],
      correctIndex: 1,
      explanation: 'If a candidate achieves straight A grades (12 points each), then r = 48 and t = 84. The formula computes: sqrt((48 ÷ 48) × (84 ÷ 84)) × 48 = sqrt(1 × 1) × 48 = 48.000 points.'
    },
    {
      id: 'kcp_calc_4',
      topicId: 'raw_cluster_calc',
      question: 'Why does the square root function sit at the heart of the KUCCPS weighted cluster formula?',
      options: [
        'To penalize students who took Physics instead of Biology',
        'To generate a geometric mean that moderates extreme score discrepancies between total aggregate and subject cluster performance',
        'To reduce all calculated points by half for public universities',
        'To round off decimal marks to the nearest whole integer'
      ],
      correctIndex: 1,
      explanation: 'The square root geometric mean balances general academic strength (t) with specialized subject competence (r). It ensures that weakness in either dimension meaningfully compresses the final weighted cluster score.'
    },
    {
      id: 'kcp_calc_5',
      topicId: 'raw_cluster_calc',
      question: 'If Student X has r = 36 and t = 70, while Student Y has r = 42 and t = 60, who achieves the higher weighted cluster points?',
      options: [
        'Student X achieves higher points because total aggregate (70) is higher',
        'Student Y achieves higher points because cluster subject points (42) carry higher proportional impact under the formula',
        'Both achieve exactly identical cluster points',
        'Neither qualifies for degree placement'
      ],
      correctIndex: 1,
      explanation: 'For Student X: sqrt((36 ÷ 48) × (70 ÷ 84)) × 48 = sqrt(0.75 × 0.8333) × 48 = sqrt(0.625) × 48 ≈ 37.947 points. For Student Y: sqrt((42 ÷ 48) × (60 ÷ 84)) × 48 = sqrt(0.875 × 0.7143) × 48 = sqrt(0.625) × 48 ≈ 37.947 points. They are virtually identical, demonstrating the interplay between cluster subjects and total points.'
    },
    {
      id: 'kcp_calc_6',
      topicId: 'raw_cluster_calc',
      question: 'How many decimal places does KUCCPS officially report when publishing student weighted cluster points?',
      options: [
        'Zero decimal places (rounded to whole number)',
        'One decimal place',
        'Three decimal places (e.g. 41.238)',
        'Six decimal places'
      ],
      correctIndex: 2,
      explanation: 'KUCCPS calculates and displays Weighted Cluster Points to exactly three decimal places (e.g. 42.175) to resolve competitive departmental ties where multiple candidates compete for a single seat.'
    },

    // --- TOPIC 2: Cluster Subject Baskets ---
    {
      id: 'kcp_bask_1',
      topicId: 'cluster_subject_baskets',
      question: 'For Cluster 13 (Engineering, Technology & Surveying), which two subjects are universally compulsory in the four-subject basket?',
      options: [
        'Mathematics and Physics',
        'Biology and History',
        'Geography and Business Studies',
        'English and Kiswahili'
      ],
      correctIndex: 0,
      explanation: 'Cluster 13 (Engineering) strictly requires Mathematics and Physics as the core quantitative foundation. The remaining two subjects are selected from Chemistry and a technical/humanities subject.'
    },
    {
      id: 'kcp_bask_2',
      topicId: 'cluster_subject_baskets',
      question: 'For Cluster 1 (Law / Legal Studies - LLB), which subject typically carries non-negotiable mandatory weighting?',
      options: [
        'Computer Studies',
        'English or Kiswahili (Language proficiency)',
        'Home Science',
        'Agriculture'
      ],
      correctIndex: 1,
      explanation: 'Law requires high linguistic comprehension and statutory interpretation. KUCCPS Cluster 1 mandates either English or Kiswahili, along with Mathematics or any Group II/III subject, with universities requiring at least B or B+ in English.'
    },
    {
      id: 'kcp_bask_3',
      topicId: 'cluster_subject_baskets',
      question: 'In Cluster 16 (Medicine, Dental Surgery & Pharmacy - MBChB, BDS, B.Pharm), what are the four required subjects in the cluster basket?',
      options: [
        'Biology, Chemistry, Physics or Mathematics, and English or Kiswahili',
        'Physics, Geography, History, and CRE',
        'Mathematics, Business Studies, Agriculture, and French',
        'Art & Design, Music, German, and Computer Studies'
      ],
      correctIndex: 0,
      explanation: 'Medicine (Cluster 16) requires: Subject 1: Biology, Subject 2: Chemistry, Subject 3: Mathematics or Physics, and Subject 4: English or Kiswahili.'
    },
    {
      id: 'kcp_bask_4',
      topicId: 'cluster_subject_baskets',
      question: 'What happens if a student applies for a Bachelor of Architecture (Cluster 14) but did not sit Physics or Art & Design in KCSE?',
      options: [
        'The KUCCPS portal automatically awards 12 points in Physics',
        'The candidate cannot be placed in Architecture because mandatory prerequisite subjects from the cluster basket are missing',
        'The student can substitute Christian Religious Education without penalty',
        'Architecture allows entry with only humanities subjects'
      ],
      correctIndex: 1,
      explanation: 'Architecture requires quantitative and spatial design prerequisites (Mathematics, Physics, plus Chemistry/Biology/Group III/IV). Missing a mandatory cluster subject disqualifies the candidate from that degree cluster.'
    },
    {
      id: 'kcp_bask_5',
      topicId: 'cluster_subject_baskets',
      question: 'How many distinct degree cluster groups are established under the official KUCCPS degree placement framework?',
      options: [
        '5 clusters',
        '10 clusters',
        '23 clusters',
        '50 clusters'
      ],
      correctIndex: 2,
      explanation: 'KUCCPS categorizes all accredited university undergraduate degree programmes across Kenyan universities into 23 distinct Subject Cluster Groups.'
    },
    {
      id: 'kcp_bask_6',
      topicId: 'cluster_subject_baskets',
      question: 'For Cluster 7 (Actuarial Science, Financial Mathematics & Statistics), which subject must serve as Subject 1?',
      options: [
        'History',
        'Mathematics (Alternative A)',
        'General Science',
        'Music'
      ],
      correctIndex: 1,
      explanation: 'Actuarial Science is one of the most mathematically rigorous undergraduate degrees. Mathematics (Alternative A) is compulsory as Subject 1 in Cluster 7.'
    },

    // --- TOPIC 3: Cut-off Trends & Capacity ---
    {
      id: 'kcp_cut_1',
      topicId: 'cutoff_points_fluctuations',
      question: 'What determines the official Weighted Cut-off Point for a degree programme published by KUCCPS each placement cycle?',
      options: [
        'The Vice-Chancellor of each university picks an arbitrary number',
        'The cluster points of the very last student admitted to that programme based on available department declared capacity and applicant demand',
        'A fixed number set in the Kenyan Constitution that never changes',
        'The average high school tuition fee across the county'
      ],
      correctIndex: 1,
      explanation: 'The published cutoff point is not predetermined; it is the weighted cluster score of the lowest-ranked applicant who successfully secured a declared seat in that specific university department during national placement.'
    },
    {
      id: 'kcp_cut_2',
      topicId: 'cutoff_points_fluctuations',
      question: 'Why did cutoff points for Engineering and Medicine at the University of Nairobi (UoN) and JKUAT fluctuate between 2022 and 2025?',
      options: [
        'Because KUCCPS changed the formula from square root to cube root',
        'Because overall national KCSE performance cohorts vary, changing the distribution of A and B grades and applicant competition density',
        'Because universities discontinued teaching Engineering',
        'Because UoN and JKUAT reduced all courses to 1-year certificates'
      ],
      correctIndex: 1,
      explanation: 'Cutoffs rise when national KCSE grades improve or when more top candidates apply for limited seats; cutoffs fall when national performance tightens or when universities expand department capacity.'
    },
    {
      id: 'kcp_cut_3',
      topicId: 'cutoff_points_fluctuations',
      question: 'If Student A has 42.500 cluster points and the previous year\'s cutoff for Medicine at Moi University was 41.800, is admission guaranteed?',
      options: [
        'Yes, exceeding last year\'s cutoff guarantees admission automatically',
        'No, previous cutoffs are historical benchmarks; if the current applicant pool is more competitive, the new cutoff could rise above 42.500',
        'No, Moi University only admits students with 48.000 points',
        'Yes, because KUCCPS laws forbid cutoffs from ever rising'
      ],
      correctIndex: 1,
      explanation: 'Historical cutoffs serve as guides, not statutory guarantees. In any admission cycle, if more candidates with high cluster points apply for the same limited cohort seats, the cutoff point adjusts upward.'
    },
    {
      id: 'kcp_cut_4',
      topicId: 'cutoff_marks_caps',
      question: 'What is the role of the "Similar Programmes" feature on the KUCCPS student portal?',
      options: [
        'To allow students to watch videos of university classes',
        'To show related courses across other universities where the student\'s weighted cluster points clear historical cutoff thresholds',
        'To download pirate software',
        'To pay HELB loan balances early'
      ],
      correctIndex: 1,
      explanation: 'The KUCCPS portal calculates real-time cluster points against every programme, highlighting similar degree offerings at different institutions where the candidate has a strong probability of placement.'
    },
    {
      id: 'kcp_cut_5',
      topicId: 'cutoff_points_fluctuations',
      question: 'How does university location influence cutoff point divergence (e.g. UoN in Nairobi vs universities in rural counties)?',
      options: [
        'All universities in Kenya have identical cutoffs by law',
        'Urban institutions like UoN, Kenyatta University, and JKUAT often experience higher applicant concentration, driving cutoffs significantly higher than identical degrees at newer universities',
        'Rural universities have higher cutoffs because they are smaller',
        'Private universities set the cutoffs for public universities'
      ],
      correctIndex: 1,
      explanation: 'Severe applicant preference for metropolitan universities creates intense competition for seats at UoN, KU, and JKUAT, driving their cutoffs up to 3 to 6 points higher than the identical degree at other public institutions.'
    },
    {
      id: 'kcp_cut_6',
      topicId: 'cutoff_points_fluctuations',
      question: 'What happens if a student only selects highly competitive courses at a single top university and misses all cutoffs?',
      options: [
        'They are automatically given a direct scholarship to Harvard',
        'They are left unplaced during the first selection round and must participate in the First or Second Revision of Choices',
        'They are permanently expelled from Kenya',
        'Their KCSE certificate is cancelled'
      ],
      correctIndex: 1,
      explanation: 'Candidates who fail to clear cutoffs for all their selected choices fall into the unplaced pool. KUCCPS opens the Revision of Choices portal, requiring them to select available courses with unfilled capacities.'
    },

    // --- TOPIC 4: Mean Grade & Sub-minimums ---
    {
      id: 'kcp_min_1',
      topicId: 'mean_grade_subminimums',
      question: 'What is the statutory minimum overall KCSE mean grade required by the Ministry of Education and KUCCPS for degree placement in Kenya?',
      options: [
        'Mean Grade D+ (Plus)',
        'Mean Grade C (Plain)',
        'Mean Grade C+ (Plus)',
        'Mean Grade B (Plain)'
      ],
      correctIndex: 2,
      explanation: 'Under CUE and Ministry of Education regulations, the statutory minimum threshold for admission into any undergraduate degree programme in Kenyan universities is an overall KCSE Mean Grade of C+ (Plus) (aggregate 46+ points).'
    },
    {
      id: 'kcp_min_2',
      topicId: 'mean_grade_subminimums',
      question: 'A candidate scores an overall KCSE Mean Grade of B+ (72 points), but achieves a C- in Mathematics. Can they be admitted for BSc Civil Engineering?',
      options: [
        'Yes, because their overall mean grade is B+, which is well above C+',
        'No, Engineering requires a mandatory subject sub-minimum of at least C+ (often B or higher) in Mathematics and Physics',
        'Yes, if they score an A in History',
        'Yes, but only if they pay in US dollars'
      ],
      correctIndex: 1,
      explanation: 'Meeting the overall C+ mean grade floor is only the first filter. Faculty sub-minimums are compulsory: engineering councils and faculties mandate at least C+ or B in Mathematics and Physics. A C- disqualifies the applicant.'
    },
    {
      id: 'kcp_min_3',
      topicId: 'mean_grade_subminimums',
      question: 'What tertiary placement pathway is available to students who achieve a KCSE Mean Grade of C (Plain) or C- (Minus)?',
      options: [
        'Direct admission into Master of Science programmes',
        'Diploma programmes at national polytechnics, TVET colleges, and universities',
        'No tertiary training of any kind is permitted',
        'Direct admission into Medical School'
      ],
      correctIndex: 1,
      explanation: 'Candidates with KCSE Mean Grades of C (Plain) and C- (Minus) are eligible for government-sponsored Diploma qualifications at National Polytechnics, TVET institutions, and technical colleges under KUCCPS.'
    },
    {
      id: 'kcp_min_4',
      topicId: 'mean_grade_subminimums',
      question: 'What is the minimum overall KCSE mean grade requirement for placement into Artisan Certificate courses through KUCCPS?',
      options: [
        'Mean grade B-',
        'Mean grade C+',
        'Mean grade E and D-',
        'Only students with A grades'
      ],
      correctIndex: 2,
      explanation: 'Artisan certificate courses at vocational training centres (VTCs) and technical institutes provide accessible skills training for candidates scoring grades D-, E, and D.'
    },
    {
      id: 'kcp_min_5',
      topicId: 'mean_grade_subminimums',
      question: 'For admission to Bachelor of Laws (LLB), what subject sub-minimum is enforced by the Council of Legal Education (CLE) in Kenya?',
      options: [
        'At least B (Plain) in English or Kiswahili',
        'At least A in Chemistry',
        'At least C+ in Woodwork',
        'No subject requirements; only high school attendance'
      ],
      correctIndex: 0,
      explanation: 'The Council of Legal Education (CLE) mandates an overall KCSE Mean Grade of at least C+ with a minimum grade of B (Plain) in English or Kiswahili for admission to an accredited LLB programme.'
    },
    {
      id: 'kcp_min_6',
      topicId: 'mean_grade_subminimums',
      question: 'What is the point equivalent of Mean Grade C+ on the official 12-point KCSE scale?',
      options: [
        '4 points',
        '6 points',
        '7 points',
        '10 points'
      ],
      correctIndex: 2,
      explanation: 'The 12-point KCSE scale assigns: A=12, A-=11, B+=10, B=9, B-=8, C+=7, C=6, C-=5, D+=4, D=3, D-=2, E=1. Grade C+ represents exactly 7 points.'
    },

    // --- TOPIC 5: Revision & Transfer Rules ---
    {
      id: 'kcp_rev_1',
      topicId: 'inter_institutional_transfer',
      question: 'When is the KUCCPS "First Revision of Choices" typically opened for applicants?',
      options: [
        'Before KCSE exams are written in secondary schools',
        'After the release of KCSE results by the Cabinet Secretary for Education, allowing candidates to realign choices based on their actual grades',
        'Five years after graduation',
        'Only during the December holidays'
      ],
      correctIndex: 1,
      explanation: 'While students submit initial applications in high school, the First Revision opens after official KCSE results are announced, allowing students to select courses tailored to their actual attained grades and cluster points.'
    },
    {
      id: 'kcp_rev_2',
      topicId: 'inter_institutional_transfer',
      question: 'Under what condition does KUCCPS approve an "Inter-Institutional Transfer" request after placement has been published?',
      options: [
        'The candidate must pay a bribe to the dean',
        'The candidate must meet the receiving university\'s published cutoff point for that programme, and the receiving institution must have an available declared vacancy',
        'The candidate can transfer anywhere without meeting cutoffs',
        'Only students who change their citizenship can transfer'
      ],
      correctIndex: 1,
      explanation: 'KUCCPS inter-institutional transfer regulations require that the applicant\'s weighted cluster points equal or exceed the receiving university\'s published cutoff point for that course, and both universities must endorse the transfer through the portal.'
    },
    {
      id: 'kcp_rev_3',
      topicId: 'inter_institutional_transfer',
      question: 'How many degree course choices is an applicant allowed to submit during the KUCCPS placement application cycle?',
      options: [
        'Only 1 choice',
        'A maximum of six degree programme options (Choice 1a, 1b, 1c for similar course across institutions, plus Choices 2, 3, and 4)',
        'Twenty choices',
        'Unlimited choices'
      ],
      correctIndex: 1,
      explanation: 'The KUCCPS portal structure allows Choice 1 with three sub-options (1a, 1b, 1c) representing the same course at three different universities, followed by Choice 2, Choice 3, and Choice 4 representing alternative degrees.'
    },
    {
      id: 'kcp_rev_4',
      topicId: 'inter_institutional_transfer',
      question: 'What is the role of the Universities Fund (UF) and the Student-Centred Higher Education Funding Model in Kenya?',
      options: [
        'To print graduation gowns for public universities',
        'To allocate government scholarships and HELB loans based on verified family Means Testing Instrument (MTI) vulnerability bands (Bands 1 to 5)',
        'To force all students into vocational polytechnics',
        'To collect high school examination fees'
      ],
      correctIndex: 1,
      explanation: 'Under the funding framework introduced in 2023, placement by KUCCPS is separated from funding. Students apply to the Higher Education Financing (HEF) portal, where scholarships and loans are apportioned based on household financial vulnerability bands.'
    },
    {
      id: 'kcp_rev_5',
      topicId: 'inter_institutional_transfer',
      question: 'What happens if a candidate misses the deadline for both the First and Second Revision of Choices on the KUCCPS portal?',
      options: [
        'They are automatically admitted to medical school',
        'They risk missing government placement for that academic year and may have to apply as a self-sponsored student or wait for the next placement cycle',
        'They are fined 1 million Kenyan shillings',
        'Their KCSE certificate is downgraded'
      ],
      correctIndex: 1,
      explanation: 'Failing to submit choices during revision windows means KUCCPS cannot place the student under government sponsorship, requiring them to seek private/self-sponsored admission or await subsequent placement cycles.'
    },
    {
      id: 'kcp_rev_6',
      topicId: 'inter_institutional_transfer',
      question: 'Can a student transfer from a Degree programme to a Diploma programme through the KUCCPS Inter-Institutional Transfer portal?',
      options: [
        'No, transfers are only permitted between identical degree levels',
        'Yes, students qualified for degree placement may opt to transfer to a diploma programme at a national polytechnic or university',
        'Only if they retake KCSE',
        'Only for business courses'
      ],
      correctIndex: 1,
      explanation: 'KUCCPS allows downward transfers: a student placed in a degree programme can request a transfer to a technical diploma course at a national polytechnic if they prefer a hands-on vocational career pathway.'
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

  function getKuccpsInputsContext() {
    var aggInp = document.getElementById('aggregate');
    var aggVal = aggInp ? parseFloat(aggInp.value) : NaN;
    var wcpEl = document.getElementById('wcpValue');
    var wcpVal = wcpEl ? parseFloat(wcpEl.textContent) : NaN;
    var clusterEl = document.getElementById('cluster');
    var clusterName = clusterEl ? clusterEl.options[clusterEl.selectedIndex].text : '';

    if (!isNaN(wcpVal) && wcpVal > 0) {
      if (wcpVal >= 40.0) {
        return {
          status: 'success',
          title: 'High Competitive Cluster Points (' + wcpVal.toFixed(3) + ' / 48)',
          text: 'Your points put you in contention for premier courses in Medicine, Engineering, Architecture, and Law. Diagnose your knowledge of historical cutoffs, institutional demand, and subject basket rules.',
          recommendedTopic: 'cutoff_points_fluctuations'
        };
      } else if (wcpVal >= 32.0) {
        return {
          status: 'neutral',
          title: 'Strong Placement Range (' + wcpVal.toFixed(3) + ' / 48)',
          text: 'You clear entry thresholds for competitive STEM, Business, and Computing degrees across most public universities. Test your understanding of KUCCPS revision of choices and cluster baskets.',
          recommendedTopic: 'cluster_subject_baskets'
        };
      } else {
        return {
          status: 'warning',
          title: 'Borderline Degree Cluster Points (' + wcpVal.toFixed(3) + ' / 48)',
          text: 'Your cluster points are near departmental floors. Test your understanding of mean grade sub-minimums and alternative placement pathways.',
          recommendedTopic: 'mean_grade_subminimums'
        };
      }
    }

    if (!isNaN(aggVal) && aggVal >= 7 && aggVal <= 84) {
      return {
        status: 'neutral',
        title: 'KCSE Aggregate Points Entered (' + aggVal + ' / 84)',
        text: 'You entered an aggregate of ' + aggVal + ' points. Test your knowledge of the mathematical cluster formula W = sqrt((r ÷ 48) × (t ÷ 84)) × 48 and mandatory subject prerequisites.',
        recommendedTopic: 'raw_cluster_calc'
      };
    }

    return {
      status: 'neutral',
      title: 'Comprehensive KUCCPS & KCSE Diagnostic',
      text: 'Evaluate your command of the 48-point cluster formula, 23 subject cluster baskets, historical cutoff dynamics, and university transfer regulations.',
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
        headline.textContent = 'Outstanding KCSE Cluster & Placement Mastery';
      } else if (attempt.percentage >= 60) {
        headline.textContent = 'Solid Foundation with Targetable Knowledge Gaps';
      } else if (attempt.percentage >= 40) {
        headline.textContent = 'Moderate Risk: Sub-minimum & Cluster Basket Gaps';
      } else {
        headline.textContent = 'Critical KUCCPS Placement Misconceptions';
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
        '  <strong>KUCCPS &amp; CUE Standard &amp; Explanation:</strong>',
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

    var form = document.getElementById('kuccpsForm');
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
        '  <div class="w-banner-badge">Knowledge &amp; Cluster Diagnostic</div>',
        '  <h3 class="w-banner-title">Diagnose Your KCSE &amp; KUCCPS Placement Weaknesses</h3>',
        '  <p class="w-banner-desc">Take a personalized 10-question assessment based on your entered marks and KUCCPS cluster guidelines. Uncover subject prerequisite gaps, review step-by-step solutions, and run targeted practice sets.</p>',
        '</div>',
        '<button type="button" id="launchWeaknessFromResults" class="btn-primary w-banner-btn">',
        '  <span>Find My Weaknesses</span>',
        '  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>',
        '</button>'
      ].join('');
      resultsEl.appendChild(callout);

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
      '        <h3 class="w-title">Find My KUCCPS Cluster Weaknesses</h3>',
      '        <button type="button" id="wCloseIntroBtn" class="w-close-btn" aria-label="Close diagnostic">&times;</button>',
      '      </div>',
      '      <p class="w-subtitle">A deterministic 10-question assessment evaluating your understanding of the 48-point cluster formula, 23 subject cluster baskets, historical cutoff trends, and university transfer regulations.</p>',
      '    </div>',
      '    <div id="wContextNotice" class="w-context-card"></div>',
      '    <div class="w-topic-select-wrap">',
      '      <label for="wTopicSelect" class="w-label">Select diagnostic focus:</label>',
      '      <select id="wTopicSelect" class="w-form-select">',
      '        <option value="all" selected>All Topics (Comprehensive 10-Question Balanced Diagnostic)</option>',
      '        <option value="raw_cluster_calc">Raw Cluster Metric &amp; Formula Mechanics</option>',
      '        <option value="cluster_subject_baskets">KUCCPS 23 Cluster Groups &amp; Mandatory Subject Baskets</option>',
      '        <option value="cutoff_points_fluctuations">University Departmental Weighted Cut-off Points &amp; Demand</option>',
      '        <option value="mean_grade_subminimums">Overall Mean Grade Floors (C+ baseline) vs Subject Sub-minimums</option>',
      '        <option value="inter_institutional_transfer">KUCCPS Revision of Choices &amp; Inter-Institutional Transfers</option>',
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
      '        <p>Targeted practice isolates your <strong id="wWeakCount">identified gaps</strong> with fresh questions to build mastery before university placement.</p>',
      '      </div>',
      '      <button type="button" id="wPracticeBtn" class="w-practice-btn">',
      '        <span>Practise My Weaknesses</span>',
      '        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
      '      </button>',
      '    </div>',

      '    <div class="w-review-section">',
      '      <div class="w-review-head">',
      '        <h4 class="w-review-title">Step-by-Step Question Review &amp; Explanations</h4>',
      '        <span class="w-review-sub">Review every answer and official KUCCPS placement policy rationale</span>',
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
    var ctx = getKuccpsInputsContext();

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
