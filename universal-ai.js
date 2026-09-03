function onReady(fn) { if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', fn); } else { fn(); } }
(function () {
  'use strict';

  if (window.AFRIWIDGET_UNIVERSAL_AI_INITIALIZED) return;
  window.AFRIWIDGET_UNIVERSAL_AI_INITIALIZED = true;

  const MAX_CUSTOM_QUESTIONS = 5;
  const WINDOW_MS = 24 * 60 * 60 * 1000;
  const QUOTA_KEY = 'afriwidget-ai-question-window';
  const FALLBACK_MESSAGE = 'Realtime AI is unavailable right now. Please try again later.';
  const endpoint = window.AFRIWIDGET_AI_ENDPOINT || '/.netlify/functions/groq-proxy';

  function cleanClientAIOutput(rawText) {
    if (!rawText || typeof rawText !== 'string') return '';
    let text = rawText;
    // Strip complete <think>...</think> blocks
    text = text.replace(/<think>[\s\S]*?<\/think>/gi, '');
    // Strip unclosed <think> blocks (e.g. if token limit cut off before </think>)
    text = text.replace(/<think>[\s\S]*$/gi, '');
    // Strip stray closing </think> tags
    text = text.replace(/<\/think>/gi, '');
    // Strip common reasoning preambles
    text = text.replace(/^(Here'?s (a|the) (thinking process|rationale|analysis):?[\s\S]*?\n\n)/i, '');
    text = text.replace(/^(Thinking Process:?[\s\S]*?\n\n)/i, '');
    // Clean any accidental LaTeX syntax
    text = text.replace(/\\(?:text|mathrm|mathbf)\{([^}]+)\}/g, '$1');
    text = text.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)');
    text = text.replace(/\\(?:times|cdot)/g, '×');
    text = text.replace(/\\(?:div)/g, '÷');
    text = text.replace(/\\(?:approx)/g, '≈');
    text = text.replace(/\\(?:leq)/g, '≤');
    text = text.replace(/\\(?:geq)/g, '≥');
    text = text.replace(/\$\$([\s\S]*?)\$\$/g, '$1');
    text = text.replace(/\$([^$]+)\$/g, '$1');
    text = text.replace(/\\(?:left|right|big|Big)[()\[\]|.]?/g, '');
    return text.trim() || FALLBACK_MESSAGE;
  }

  const PAGE_CONFIGS = {
    'age-calculator': { category: 'health', result: ['#ageResult', '#ageSummary'], host: '#ageResult' },
    'bece-aggregate-calculator': { category: 'education', result: ['#aggregateResult', '#resultMessage'], host: '#aggregateResult' },
    'bece-cssps-placement-estimator': { category: 'education', result: ['#becePlacementResult', '#becePlacementMessage'], host: '#becePlacementCard' },
    'blood-donation-eligibility-calculator': { category: 'health', result: ['#donationResult', '#donationStatus'], host: '#donationResult' },
    'bmi-calculator': { category: 'health', result: ['#results'], host: '#results' },
    'calorie-deficit-planner': { category: 'health', result: ['#calorieResult', '#calorieMessage'], host: '#calorieResult' },
    'compound-interest': { category: 'finance', result: ['#results'], host: '#results' },
    'currency-converter': { category: 'finance', result: ['#currencyValue', '#currencyMessage'], host: '#currencyResult' },
    'data-file-unit-converter': { category: 'productivity', result: ['#dataValue', '#dataMessage'], host: '#dataResult' },
    'freelance-hourly-rate-pricing-calculator': { category: 'business', result: ['#freelanceHourly', '#freelanceProject'], host: '#freelanceResult' },
    'freelance-rate-calculator': { category: 'business', result: ['#hourlyRateDisplay', '#dayRateDisplay', '#monthlyRetainerDisplay', '#grossRevenueDisplay'], host: '#results' },
    'startup-cost-calculator': { category: 'business', result: ['#totalCapital', '#resOneTime', '#resMonthly', '#resBuffer'], host: '#results' },
    'pricing-calculator': { category: 'business', result: ['#sellingPrice', '#netProfit', '#realMargin', '#realMarkup'], host: '#results' },
    'roi-calculator': { category: 'business', result: ['#roiPct', '#netProfitText', '#netGainEl'], host: '#results' },
    'debt-payoff-calculator': { category: 'finance', result: ['#payoffMonths', '#totalInterest', '#totalPaid'], host: '#results' },
    'break-even-calculator': { category: 'business', result: ['#beUnits', '#beRevenue', '#contribMargin'], host: '#results' },
    'macro-calculator': { category: 'health', result: ['#dailyCalories', '#proteinGrams', '#carbsGrams', '#fatsGrams'], host: '#results' },
    'gpa-calculator': { category: 'education', result: ['#results'], host: '#results' },
    'uk-gcse-grade-calculator': { category: 'education', result: ['#resAverageGrade', '#resAttainment8', '#resPassCount', '#resTopGradeCount'], host: '#results' },
    'uk-degree-classification-calculator': { category: 'education', result: ['#resClassificationTitle', '#resFinalMark', '#resY2Avg', '#resY3Avg'], host: '#results' },
    'ucas-points-calculator': { category: 'education', result: ['#totalPoints', '#resQualCount', '#resProfile', '#resAdmissionsTier'], host: '#results' },
    'uk-a-level-grade-calculator': { category: 'education', result: ['#finalGradeDisplay', '#weightedPercentageDisplay', '#resProfileCombo', '#resProfileTariff'], host: '#results' },
    'uk-student-loan-finance-calculator': { category: 'finance', result: ['#resultMaintenanceTotal', '#resultTermlyPayment', '#resultTotalPackage', '#resultMonthlyRepayment', '#resultAnnualRepayment'], host: '#resultMaintenanceTotal' },
    'hourly-to-salary': { category: 'finance', result: ['#results'], host: '#results' },
    'igcse-alevel-gpa-converter': { category: 'education', result: ['#igcseGpaResult', '#igcseGpaMessage'], host: '#igcseGpaResult' },
    'image-resizer-webp-converter': { category: 'productivity', result: ['#imageStatus', '#imageDimensions'], host: '#imageStatus' },
    'icass-calculator': { category: 'education', result: ['#icassScore', '#icassBand'], host: '#icassResult' },
    'invoice-receipt-generator': { category: 'productivity', result: ['#invoiceGrandTotal', '#invoicePreviewTotal'], host: '#invoicePreview' },
    'jamb-utme-aggregate-calculator': { category: 'education', result: ['#jambResult', '#jambMessage'], host: '#jambResult' },
    'jamb-score-calculator': { category: 'education', result: ['#resTotalScore', '#resPercentage', '#resTierBadge', '#resTierDescription'], host: '#resultsContainer' },
    'jamb-admission-chance-checker': { category: 'education', result: ['#resProbabilityScore', '#resStatusBadge'], host: '#chanceResultsContainer' },
    'post-utme-aggregate-calculator': { category: 'education', result: ['#resTotalAggregate', '#resAggregateBadge'], host: '#postUtmeResultsContainer' },
    'waec-grade-calculator': { category: 'education', result: ['#resTotalCredits', '#resEligibilityBadge'], host: '#waecResultsContainer' },
    'nigerian-university-cgpa-calculator': { category: 'education', result: ['#resCgpaVal', '#resHonoursBadge', '#resGpaVal', '#resTqpVal'], host: '#resultsContainer' },
    'loan-calculator': { category: 'finance', result: ['#loanPayment', '#loanTotal', '#loanInterest'], host: '#loanResult' },
    'json-formatter-validator': { category: 'productivity', result: ['#formatted', '#successBlock', '#errorBlock'], host: '#formatted' },
    'kcse-eligibility-tier-checker': { category: 'education', result: ['#kcseTierResult', '#kcseTierMessage'], host: '#kcseTierResult' },
    'kcse-kuccps-cluster-calculator': { category: 'education', result: ['#kcseResult', '#kcseMessage'], host: '#kcseResult' },
    'meta-pixel-checker': { category: 'productivity', result: ['#pixelStatus', '#serpTitle', '#serpDescription'], host: '#pixelStatus' },
    'mortgage-calculator': { category: 'finance', result: ['#results'], host: '#results' },
    'olevel-subject-combination-checker': { category: 'education', result: ['#olevelResultTitle', '#olevelCritical'], host: '#olevelResultTitle' },
    'ovulation-cycle-calculator': { category: 'health', result: ['#cycleResult', '#cycleMessage'], host: '#cycleResult' },
    'password-generator': { category: 'productivity', result: ['#passwordList', '#results'], host: '#results' },
    'random-email-generator': { category: 'productivity', result: ['#emailOutput'], host: '#emailOutput' },
    'random-business-name-generator': { category: 'productivity', result: ['#businessOutput'], host: '#businessOutput' },
    'random-team-name-generator': { category: 'productivity', result: ['#teamOutput'], host: '#teamOutput' },
    'random-nickname-generator': { category: 'productivity', result: ['#nicknameOutput'], host: '#nicknameOutput' },
    'random-username-generator': { category: 'productivity', result: ['#usernameOutput'], host: '#usernameOutput' },
    'random-address-generator': { category: 'productivity', result: ['#addressOutput', '#addressStatus'], host: '#addressOutput' },
    'random-phone-number-generator': { category: 'productivity', result: ['#phoneOutput', '#phoneStatus'], host: '#phoneOutput' },
    'random-date-generator': { category: 'productivity', result: ['#dateOutput', '#dateStatus'], host: '#dateOutput' },
    'random-color-generator': { category: 'productivity', result: ['#colorOutput', '#colorStatus'], host: '#colorOutput' },
    'paypal-fee-calculator': { category: 'finance', result: ['#results'], host: '#results' },
    'pediatric-dosage-calculator': { category: 'health', result: ['#dosageResult', '#dosageMessage'], host: '#dosageResult' },
    'percentage-calculator': { category: 'finance', result: ['#results'], host: '#results' },
    'profit-margin-calculator': { category: 'finance', result: ['#results'], host: '#results' },
    'reading-time-speech-estimator': { category: 'productivity', result: ['#readingWords', '#silentTime'], host: '#readingWords' },
    'rent-affordability': { category: 'finance', result: ['#maxRent', '#practicalMax', '#leftover', '#rentAdviceContent'], host: '#results' },
    'robots-txt-generator': { category: 'productivity', result: ['#robotsOutput', '#robotsStatus'], host: '#robotsOutput' },
    'seo-meta-generator': { category: 'productivity', result: ['#generatedTags', '#previewStatus'], host: '#generatedTags' },
    'south-african-aps-calculator': { category: 'education', result: ['#apsResult', '#apsMessage'], host: '#apsResult' },
    'south-african-university-admission-calculator': { category: 'education', result: ['#saApsDisplay', '#saVerdictSummary'], host: '#saApsDisplay' },
    'nsfas-eligibility-checker': { category: 'education', result: ['#nsfasVerdictDisplay', '#nsfasSummaryText'], host: '#nsfasVerdictDisplay' },
    'south-african-tvet-nated-calculator': { category: 'education', result: ['#natedResult', '#natedMessage'], host: '#natedResult' },
    'tvet-ncv-pass-calculator': { category: 'education', result: ['#ncvResult', '#ncvStatusBadge', '#ncvMessage'], host: '#ncvCard' },
    'tvet-exam-target-mark-calculator': { category: 'education', result: ['#targetResult', '#targetFeasibilityBadge', '#targetMessage'], host: '#targetCard' },
    'nsfas-tvet-allowance-calculator': { category: 'education', result: ['#nsfasResult', '#nsfasMonthlyBadge', '#nsfasMessage'], host: '#nsfasCard' },
    'matric-sba-exam-calculator': { category: 'education', result: ['#matricResult', '#matricPassBadge', '#matricApsVal', '#matricMessage'], host: '#matricCard' },
    'savings-goal-timeline-calculator': { category: 'finance', result: ['#savingsTime', '#savingsMessage'], host: '#savingsResult' },
    'savings-calculator': { category: 'finance', result: ['#savingsCalcTotal', '#savingsCalcGrowth'], host: '#savingsCalcResult' },
    'tertiary-gpa-cgpa-calculator': { category: 'education', result: ['#gpaResult', '#gpaMessage'], host: '#gpaResult' },
    'uace-points-calculator': { category: 'education', result: ['#uaceRawPoints', '#uaceEligibilityStatus', '#uaceWeightedScore'], host: '#uaceResultCard' },
    'ple-aggregate-calculator': { category: 'education', result: ['#pleAggregate', '#pleDivision', '#pleStatusMessage'], host: '#pleResultCard' },
    'uce-grade-calculator': { category: 'education', result: ['#uceAggregate', '#uceDivision', '#uceStatusMessage'], host: '#uceResultCard' },
    'text-case-converter-cleanup': { category: 'productivity', result: ['#caseStatus', '#caseWords', '#caseChars'], host: '#caseStatus' },
    'unit-converter': { category: 'productivity', result: ['#conversionResult'], host: '#conversionResult' },
    'university-cutoff-eligibility-checker': { category: 'education', result: ['#eligibilityCard', '#eligibilityStatus', '#eligibilityMessage'], host: '#eligibilityCard' },
    'wassce-aggregate-calculator': { category: 'education', result: ['#aggregateResult', '#resultMessage'], host: '#aggregateResult' },
    'water-intake-calculator': { category: 'health', result: ['#waterLitres', '#waterMl', '#waterBottles'], host: '#waterResults' },
    'whatsapp-direct-link-qr-generator': { category: 'productivity', result: ['#whatsappOutput', '#whatsappStatus'], host: '#whatsappOutput' },
    'qr-code-generator': { category: 'productivity', result: ['#qrStatus'], host: '#qrCanvas' },
    'word-counter': { category: 'productivity', result: ['#statWords', '#statChars', '#keywordList'], host: '#keywordList' },
    'work-experience-resume-duration-calculator': { category: 'productivity', result: ['#experienceSummary', '#experienceYears'], host: '#experienceResult' },
    'xml-sitemap-builder': { category: 'productivity', result: ['#sitemapOutput', '#sitemapStatus'], host: '#sitemapOutput' },
    'zimsec-olevel-points-calculator': { category: 'education', result: ['#best5Points', '#totalPoints', '#passCountBadge', '#certificateStatusBadge', '#form5Status'], host: '#olevelResultCard' },
    'zimsec-alevel-points-calculator': { category: 'education', result: ['#alevelPoints', '#principalPassBadge', '#admissionsTierTitle', '#admissionsTierDesc'], host: '#alevelResultCard' },
    'zimbabwe-university-entry-points-calculator': { category: 'education', result: ['#uniPointsDisplay', '#uniTargetHeadline', '#chanceHeading', '#chanceExplanation', '#conventionalStatus', '#parallelStatus'], host: '#uniResultCard' },
    'zimbabwe-university-gpa-calculator': { category: 'education', result: ['#resSemesterGpa', '#resCumulativeCgpa', '#resHonoursTitle', '#resAcademicStanding'], host: '#gpaResultCard' },
    'zimbabwe-study-timetable-generator': { category: 'education', result: ['#resScheduleTitle', '#resWeeklyHours', '#resSubjectsCovered', '#resPastPaperDrills'], host: '#timetableResultCard' },
    'ghana-university-gpa-calculator': { category: 'education', result: ['#valSemesterScore', '#valCumulativeScore', '#titleHonoursClass', '#descHonoursClass', '#valQualityPoints'], host: '#gpaResultCard' },
    'ghana-nursing-training-admission-calculator': { category: 'education', result: ['#valNetAggregate', '#badgeStatusVerdict', '#titleStatusHeading', '#descStatusExplanation', '#checkInterviewProb'], host: '#nursingResultCard' },
    'kcse-grade-calculator': { category: 'education', result: ['#kcseMeanGradeDisplay', '#kcsePointsTotalDisplay', '#kcseGpaDisplay', '#kcseTierDisplay'], host: '#kcseResultCard' },
    'kuccps-cluster-points-calculator': { category: 'education', result: ['#wcpDisplay', '#rawClusterDisplay', '#aggPointsDisplay', '#kuccpsCompetitivenessDisplay'], host: '#kuccpsResultCard' },
    'kenya-university-gpa-calculator': { category: 'education', result: ['#semGpaDisplay', '#cgpaDisplay', '#semQpDisplay', '#honoursClassificationDisplay'], host: '#kenyaGpaResultCard' },
    'kcpe-performance-calculator': { category: 'education', result: ['#kcpeTotalMarksDisplay', '#kcpeMeanGradeDisplay', '#kcpeMeanPercentDisplay', '#kcpePlacementTierDisplay'], host: '#kcpeResultCard' },
    'student-loan-repayment-calculator': { category: 'finance', result: ['#valPayoffDuration', '#valTotalRepayment', '#valTotalInterest', '#valTotalFees', '#valMonthlyDeduction'], host: '#loanResultCard' },
    'uganda-university-admission-calculator': { category: 'education', result: ['#valTotalWeightedPoints', '#valRawUacePoints', '#valPrincipalPassCount', '#valUceWeightedScore', '#valAffirmativePoints'], host: '#ugandaAdmissionResultCard' },
    'uganda-university-cgpa-calculator': { category: 'education', result: ['#valSemesterGpa', '#valCumulativeCgpa', '#valSemesterQp', '#txtHonoursStanding', '#valSemesterCu'], host: '#ugandaGpaResultCard' },
    'uneb-results-estimator': { category: 'education', result: ['#valMainScore', '#valDivisionStanding', '#valTierStanding', '#valAdmissionPathway', '#txtPlacementAdvice'], host: '#unebResultCard' },
    'form-four-gpa-calculator': { category: 'education', result: ['#valNectaGpa', '#valDivisionResult', '#valBest7Points', '#valAlevelStatus'], host: '#formFourResultCard' },
    'acsee-points-calculator': { category: 'education', result: ['#valAcseePointsResult', '#valAcseeDivisionResult', '#valTcuPoints', '#valTcuDegreeStatus'], host: '#acseeResultCard' },
    'tanzania-university-admission-calculator': { category: 'education', result: ['#valTcuScoreDisplay', '#valBenchmarkCutoff', '#valTwoSubjectCore', '#valTcuRuleStatus'], host: '#tanzaniaAdmissionResultCard' },
    'tanzania-heslb-loan-calculator': { category: 'finance', result: ['#res-total-debt', '#res-monthly-deduction', '#res-annual-loan'], host: '#results-card' },
    'tanzania-university-gpa-calculator': { category: 'education', result: ['#res-gpa-value', '#res-degree-class', '#res-final-cgpa'], host: '#results-card' },
    'zambia-grade-12-points-calculator': { category: 'education', result: ['#resBest6Points', '#resBest5Points', '#resCertificateBadge', '#resCreditCount'], host: '#resultsCard' },
    'zambia-university-admission-calculator': { category: 'education', result: ['#resAdmissionPoints', '#resAdmissionStatusBadge', '#resSelectedFacultyTitle'], host: '#resultsCard' },
    'zambia-university-gpa-calculator': { category: 'education', result: ['#resSemesterGpa', '#resCumulativeCgpa', '#resHonoursBadge', '#resTotalQualityPoints'], host: '#resultsCard' },
    'zambia-teveta-score-calculator': { category: 'education', result: ['#resFinalScore', '#resAwardBadge', '#resClassificationText', '#resZaqfLevelText'], host: '#resultsCard' },
    'zambia-student-budget-planner': { category: 'finance', result: ['#resNetBalance', '#resTotalMonthlyIncome', '#resTotalMonthlyCost', '#resBudgetStatusBadge'], host: '#resultsCard' },
    'atar-calculator': { category: 'education', result: ['#resAtarScore', '#resSelectionRank', '#resAggregateScore', '#resUnitsCounted', '#resPercentileText'], host: '#resultsCard' },
    'university-course-finder': { category: 'education', result: ['#resultsCountBadge', '#coursesGridContainer'], host: '#coursesGridContainer' },
    'student-budget-calculator': { category: 'finance', result: ['#resNetWeekly', '#resTotalIncome', '#resTotalExpense', '#resMonthlySummary'], host: '#budgetResultsCard' },
    'hecs-help-repayment-calculator': { category: 'education', result: ['#resAnnualRepayment', '#resRepaymentRateText', '#resPaycheckDeduction', '#resYearsToPayoff'], host: '#resultsCard' },
    'australia-scholarship-finder': { category: 'education', result: ['#resMatchCountBadge', '#resTotalFundingValue', '#resTopCategory'], host: '#resultsCard' },
    'canada-gpa-calculator': { category: 'education', result: ['#resGpaDisplay', '#resHonoursBadge', '#resTermGpa', '#resCumulativeCgpa'], host: '#resultsCard' },
    'canada-university-admission-chance-calculator': { category: 'education', result: ['#resProbabilityScore', '#resTargetHeader', '#resAvgDisplay', '#resStrategyText'], host: '#admissionsResultsCard' },
    'canada-student-loan-repayment-calculator': { category: 'finance', result: ['#resMonthlyDisplay', '#resRapBadge', '#resTotalInterest', '#resPayoffTimeline'], host: '#loanResultsCard' },
    'canada-scholarship-finder': { category: 'education', result: ['#resMatchCountBadge', '#resTotalFundingValue', '#resAverageAward', '#resMatchesList'], host: '#resultsCard' },
    'canada-study-planner': { category: 'education', result: ['#resScheduleTitle', '#resWeeklyHours', '#resDailyPomodoros', '#resTopPriorityCourse', '#resStrategySummary'], host: '#resultsCard' },
    'switzerland-grade-calculator': { category: 'education', result: ['#resultsCard'], host: '#resultsCard' },
    'switzerland-university-cost-calculator': { category: 'education', result: ['#costResultsCard'], host: '#costResultsCard' },
    'switzerland-language-learning-planner': { category: 'education', result: ['#planResultsCard', '#timetableWrapper'], host: '#planResultsCard' },
    'norway-student-budget-calculator': { category: 'finance', result: ['#resTotalIncome', '#resTotalExpenses', '#resNetValue', '#resGrantStatusBadge'], host: '#norwayBudgetResults' },
    'norway-gpa-calculator': { category: 'education', result: ['#resNorGpa', '#resNorLetter', '#resUsGpa', '#resTotalCredits', '#resSkolepoeng', '#resKonkurransepoeng'], host: '#norwayGpaResults' },
    'norway-study-planner': { category: 'education', result: ['#resTotalWeeklyHours', '#resSelfStudyHours', '#resTotalWorkload', '#resDailyTarget', '#resLoadStatus'], host: '#norwayPlannerResults' },
    'botswana-student-expense-calculator': { category: 'finance', result: ['#resTotalIncome', '#resTotalExpenses', '#resNetBalance', '#resSemesterTotal'], host: '#expenseResults' },
    'botswana-study-planner': { category: 'education', result: ['#resTotalWeeklyHours', '#resContactHours', '#resSelfStudyHours', '#resLoadStatus'], host: '#studyResults' },
    'botswana-bgcse-points-calculator': { category: 'education', result: ['#resBest6Points', '#resDtefStatus', '#resTargetChance', '#resOverallSummary'], host: '#bgcseResults' },
    'namibia-nssc-points-calculator': { category: 'education', result: ['#resBest5Points', '#resBest6Points', '#resNsfafStatus', '#resOverallStanding'], host: '#nsscResults' },
    'namibia-university-admission-calculator': { category: 'education', result: ['#resEligibilityTitle', '#resUnamStatus', '#resNustStatus', '#resIumStatus'], host: '#admissionResults' },
    'namibia-gpa-calculator': { category: 'education', result: ['#resClassificationDisplay', '#resWamValue', '#resUsGpa', '#resDeansList'], host: '#gpaResults' },
    'malawi-msce-grade-calculator': { category: 'education', result: ['#resBest6Points', '#resCertificatePass', '#resUniversityEligibility', '#resCreditCount', '#resDistinctionCount'], host: '#msceResults' },
    'malawi-university-admission-calculator': { category: 'education', result: ['#resOverallEligibility', '#resUnimaStatus', '#resMubasStatus', '#resLuanarStatus', '#resMustStatus'], host: '#admissionResults' },
    'malawi-gpa-calculator': { category: 'education', result: ['#resHonoursClassification', '#resSemesterGpa', '#resCumulativeCgpa', '#resTotalCredits', '#resDeansList'], host: '#gpaResults' },
    'new-zealand-ncea-credits-calculator': { category: 'education', result: ['#resRankScore', '#resCertEndorsement', '#resUeStatus', '#resCertCreditsSummary'], host: '#nceaResults' },
    'new-zealand-student-loan-calculator': { category: 'finance', result: ['#resPayoffDuration', '#resFortnightlyRepayment', '#resTotalInterest', '#resNetFortnightly'], host: '#loanResults' },
    'new-zealand-study-planner': { category: 'education', result: ['#resWeeklyAcademicDemand', '#resTotalSemesterHours', '#resSelfStudyDemand', '#resStudyLinkStatus'], host: '#studyResults' },
    'germany-abitur-grade-calculator': { category: 'education', result: ['#resAbiturGrade', '#resAbiturPoints', '#resUsGpa', '#resEctsEquivalent'], host: '#abiturResults' },
    'germany-university-admission-checker': { category: 'education', result: ['#resChanceTitle', '#resVerfahrensnote', '#resBonusTotal', '#resTypicalCutoff'], host: '#admissionResults' },
    'germany-gpa-converter': { category: 'education', result: ['#resGermanGrade', '#resGermanRatingText', '#resEctsGrade', '#resMasterEligible'], host: '#gpaResults' }
  };

  const CATEGORY_NAMES = {
    health: 'Health',
    education: 'Education',
    finance: 'Finance',
    business: 'Business',
    productivity: 'Productivity',
    tools: 'General Tools'
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function pageKey() {
    const page = window.location.pathname.split('/').pop() || 'index';
    return page.replace(/\.html$/i, '') || 'index';
  }

  function getConfig() {
    return PAGE_CONFIGS[pageKey()];
  }

  function readQuota() {
    const now = Date.now();
    try {
      const saved = JSON.parse(localStorage.getItem(QUOTA_KEY) || 'null');
      if (!saved || !Number.isFinite(saved.resetAt) || now >= saved.resetAt) {
        return { count: 0, resetAt: now + WINDOW_MS };
      }
      return {
        count: Math.min(MAX_CUSTOM_QUESTIONS, Math.max(0, Number(saved.count) || 0)),
        resetAt: saved.resetAt
      };
    } catch {
      return { count: 0, resetAt: now + WINDOW_MS };
    }
  }

  function writeQuota(quota) {
    try {
      localStorage.setItem(QUOTA_KEY, JSON.stringify(quota));
    } catch {
      // The assistant remains usable if browser storage is blocked.
    }
  }

  function formatCountdown(resetAt) {
    const remaining = Math.max(0, resetAt - Date.now());
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
    return `Resets in ${hours}h ${minutes}m ${seconds}s`;
  }

  function getInputContext() {
    return $$('input, select, textarea').filter(input => {
      if (input.closest('#ai-live-insight') || input.closest('#cookieBanner')) return false;
      return input.value !== '';
    }).slice(0, 50).map(input => {
      const label = input.getAttribute('aria-label') ||
        input.closest('label')?.textContent?.replace(/\s+/g, ' ').trim() ||
        input.id || input.name || input.tagName.toLowerCase();
      return `${label}: ${input.value}`;
    }).join('\n');
  }

  function visible(element) {
    return element && !element.classList.contains('hidden') &&
      window.getComputedStyle(element).display !== 'none';
  }

  function resultText(config) {
    return config.result.map(selector => {
      const element = $(selector);
      if (!element || (element.id === 'results' && !visible(element))) return '';
      return element.innerText || element.textContent || '';
    }).join(' ').replace(/\s+/g, ' ').trim();
  }

  function hasValidResult(config) {
    const elements = config.result.map(selector => $(selector)).filter(Boolean);
    if (!elements.length) return false;
    const text = resultText(config);
    if (!text) return false;
    const lower = text.toLowerCase();
    const placeholderOnly = [
      '—', 'choose ', 'select ', 'enter ', 'start typing', 'your result will',
      'no result', 'not yet calculated', 'will appear here'
    ];
    if (placeholderOnly.some(value => lower === value || lower.startsWith(value))) return false;
    if (lower.includes('enter a ') && (lower.includes('—') || lower.includes('choose'))) return false;
    if (elements.some(element => element.id === 'results' && visible(element))) return true;
    return !/^(—|choose|select|enter|start typing|no result)/i.test(text);
  }

  function contextFor(config) {
    return {
      tool: document.title.replace(/\s*[|—-]\s*AfriWidget.*$/i, '').trim(),
      category: config.category,
      page: document.title,
      result: resultText(config) || 'No completed result',
      inputs: getInputContext()
    };
  }

  async function askAI(mode, context, question = '') {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, category: context.category, context, question })
      });
      if (!response.ok) return FALLBACK_MESSAGE;
      const payload = await response.json();
      const rawText = payload?.ok && payload.text ? payload.text : (payload?.message || FALLBACK_MESSAGE);
      return cleanClientAIOutput(rawText);
    } catch {
      return FALLBACK_MESSAGE;
    }
  }

  function buildAssistant(config) {
    const assistant = document.createElement('section');
    assistant.id = 'ai-live-insight';
    assistant.className = 'hidden mt-10 w-full max-w-7xl mx-auto rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 lg:p-9 shadow-xl shadow-slate-900/5 text-left transition-all duration-300 relative overflow-hidden';
    const categoryName = CATEGORY_NAMES[config.category] || CATEGORY_NAMES.tools;
    assistant.innerHTML = `
      <!-- Header with Status Badge -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-2xl bg-slate-950 text-amber-300 flex items-center justify-center font-black text-base shadow-lg shadow-slate-950/15 border border-slate-800 flex-shrink-0" aria-hidden="true">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <div>
            <div class="flex items-center gap-2.5 flex-wrap">
              <h2 class="font-black text-slate-950 text-xl sm:text-2xl tracking-tight">AfriWidget AI ${categoryName} Assistant</h2>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-bold shadow-2xs">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live AI Analysis</span>
              </span>
            </div>
            <p class="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">Instant personalized guidance, context explanation, and actionable strategy tailored to your calculation.</p>
          </div>
        </div>
        <div class="flex items-center gap-2 self-start sm:self-auto">
          <span class="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl shadow-2xs">⚡ Private In-Browser AI</span>
        </div>
      </div>

      <!-- Responsive 2-Column Desktop / TV Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Left Column: Primary AI Narrative Insight & Quick Suggestions (7 cols on PC/TV) -->
        <div class="lg:col-span-7 space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-extrabold uppercase tracking-wider text-slate-500">Calculated Context &amp; Key Takeaways</span>
            <span class="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-full" id="aiStatusPill">✓ Instant Synthesis</span>
          </div>
          <div class="relative rounded-2xl bg-slate-50/90 border border-slate-200/90 p-5 sm:p-7 shadow-xs">
            <div class="text-slate-900 leading-relaxed text-base sm:text-lg font-normal" id="universalAiInsight" aria-live="polite">${FALLBACK_MESSAGE}</div>
          </div>
          
          <!-- Quick Prompt Suggestion Chips -->
          <div class="pt-2">
            <span class="block text-xs font-bold text-slate-500 mb-2">💡 One-Click Questions to Ask AI:</span>
            <div class="flex flex-wrap gap-2" id="universalAiQuickChips">
              <button type="button" data-prompt="What are my best next actionable steps based on this calculated result?" class="ai-quick-chip text-xs font-semibold px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-950 shadow-2xs transition-all cursor-pointer">
                🎯 What are my best next steps?
              </button>
              <button type="button" data-prompt="How can I optimize and improve this calculated outcome or score?" class="ai-quick-chip text-xs font-semibold px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-950 shadow-2xs transition-all cursor-pointer">
                📈 How can I optimize this result?
              </button>
              <button type="button" data-prompt="Explain the official criteria, grading standards, or underlying formulas used for this calculation." class="ai-quick-chip text-xs font-semibold px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-950 shadow-2xs transition-all cursor-pointer">
                🔍 Explain official criteria &amp; rules
              </button>
            </div>
          </div>
        </div>

        <!-- Right Column: Interactive Follow-up Question Console (5 cols on PC/TV) -->
        <div class="lg:col-span-5 bg-slate-50/70 border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div>
            <label for="universalAiQuestion" class="block text-sm font-bold text-slate-950 mb-1">Ask a Custom Follow-Up Question</label>
            <p class="text-xs text-slate-500 mb-3">Ask anything about admissions, repayments, budgeting, or criteria.</p>
            <div class="space-y-3">
              <div class="relative">
                <textarea id="universalAiQuestion" rows="3" maxlength="500" class="w-full bg-white border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 p-3.5 rounded-xl outline-none text-slate-900 text-sm font-medium transition-all placeholder:text-slate-400 resize-none shadow-2xs" placeholder="Type your question about this calculation…"></textarea>
              </div>
              <div class="flex items-center justify-between gap-3">
                <div class="text-[11px] font-semibold text-slate-500">
                  <span id="universalAiCounter" class="block">5 / 5 questions remaining</span>
                  <span id="universalAiReset" class="block text-[10px] text-slate-400"></span>
                </div>
                <button id="universalAiAsk" type="button" class="bg-slate-950 hover:bg-slate-800 disabled:bg-slate-300 text-white font-extrabold px-6 py-2.5 rounded-xl transition-all text-sm shadow-md shadow-slate-950/15 cursor-pointer flex items-center gap-1.5 flex-shrink-0 active:scale-[0.99]">
                  <span>Ask AI</span>
                  <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- AI Response Container -->
          <div id="universalAiAnswer" class="hidden rounded-xl bg-slate-950 text-slate-100 p-4 sm:p-5 text-sm leading-relaxed border border-slate-800 shadow-inner space-y-2" aria-live="polite">
          </div>
        </div>
      </div>`;

    let targetElement = null;
    if (config.host) {
      targetElement = $(config.host);
    }
    if (!targetElement) {
      targetElement = $('#resultsCard') || $('#budgetResultsCard') || $('#gpaResultCard') || $('#resultsContainer') || $('#results') || $('#result') || $('#results-card') || $('#calculatorCard') || $('#formFourResultCard') || $('#acseeResultCard');
    }
    if (!targetElement) {
      targetElement = $('main .grid:first-of-type') || $('main form') || $('main > div:first-of-type');
    }

    if (targetElement) {
      // Smart Full-Width Placement: If inside a grid column, place after the entire grid so it spans 100% width on Desktop/TV
      const parentGrid = targetElement.closest('main > .grid, main > div > .grid, .grid');
      if (parentGrid && parentGrid.parentElement) {
        parentGrid.insertAdjacentElement('afterend', assistant);
      } else {
        targetElement.insertAdjacentElement('afterend', assistant);
      }
    } else {
      const mainEl = $('main') || document.body;
      const firstSection = mainEl.querySelector('section, article, div:nth-of-type(2)');
      if (firstSection) {
        firstSection.insertAdjacentElement('beforebegin', assistant);
      } else {
        mainEl.appendChild(assistant);
      }
    }
    return assistant;
  }

  function init(config) {
    if ($('#ai-live-insight')) return;
    const assistant = buildAssistant(config);
    if (!assistant) return;

    const insight = $('#universalAiInsight', assistant);
    const question = $('#universalAiQuestion', assistant);
    const askButton = $('#universalAiAsk', assistant);
    const answer = $('#universalAiAnswer', assistant);
    const counter = $('#universalAiCounter', assistant);
    const reset = $('#universalAiReset', assistant);
    let lastSignature = '';
    let requestVersion = 0;
    let activitySeen = false;
    let scheduled;
    let countdownTimer;

    const updateQuotaUi = () => {
      const quota = readQuota();
      const left = Math.max(0, MAX_CUSTOM_QUESTIONS - quota.count);
      if (counter) counter.textContent = `${left} / ${MAX_CUSTOM_QUESTIONS} questions left`;
      if (reset) reset.textContent = formatCountdown(quota.resetAt);
      const disabled = left === 0;
      if (question) {
        question.disabled = disabled;
        question.placeholder = disabled
          ? 'Your questions will be available after the reset timer.'
          : 'Ask about this result…';
      }
      if (askButton) askButton.disabled = disabled;
      if (disabled && answer) answer.textContent = 'You have reached the five-question limit. Check back after the reset timer.';
    };

    const startCountdown = () => {
      if (countdownTimer) return;
      countdownTimer = window.setInterval(updateQuotaUi, 1000);
    };

    const stopCountdown = () => {
      if (countdownTimer) {
        window.clearInterval(countdownTimer);
        countdownTimer = null;
      }
    };

    const runInsight = async () => {
      if (!activitySeen || !hasValidResult(config)) return;
      const context = contextFor(config);
      const signature = `${context.result}|${context.inputs}`;
      if (signature === lastSignature) return;
      lastSignature = signature;
      const currentRequest = ++requestVersion;
      if (assistant) {
        assistant.classList.remove('hidden');
        startCountdown();
      }
      if (insight) insight.textContent = 'Preparing your AI insight…';
      const text = await askAI('insight', context);
      if (currentRequest === requestVersion && insight) insight.textContent = text;
    };

    const triggerInsightOnClick = () => {
      try {
        activitySeen = true;
        window.clearTimeout(scheduled);
        scheduled = window.setTimeout(() => {
          try {
            if (hasValidResult(config)) {
              runInsight();
            }
          } catch (e) {
            console.error('AI insight error:', e);
          }
        }, 350);
      } catch (e) {
        console.error('Trigger insight error:', e);
      }
    };

    document.addEventListener('click', event => {
      const btn = event.target.closest('button, input[type="submit"], input[type="button"]');
      if (!btn) return;
      if (btn.closest('#ai-live-insight') || btn.closest('#cookieBanner') || btn.id === 'mobileMenuBtn' || btn.id === 'universalAiAsk') return;
      triggerInsightOnClick();
    });

    document.addEventListener('submit', event => {
      if (event.target.closest('#ai-live-insight') || event.target.closest('#cookieBanner')) return;
      triggerInsightOnClick();
    });

    askButton?.addEventListener('click', async () => {
      if (!question || !askButton || !answer) return;
      const prompt = question.value.trim();
      const quota = readQuota();
      if (!prompt || quota.count >= MAX_CUSTOM_QUESTIONS) {
        updateQuotaUi();
        startCountdown();
        return;
      }
      quota.count += 1;
      writeQuota(quota);
      updateQuotaUi();
      startCountdown();
      askButton.disabled = true;
      answer.classList.remove('hidden');
      answer.textContent = 'Thinking through your question…';
      answer.textContent = await askAI('question', contextFor(config), prompt);
      question.value = '';
      updateQuotaUi();
    });

    question?.addEventListener('keydown', event => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        askButton?.click();
      }
    });

    assistant?.addEventListener('click', event => {
      const chip = event.target.closest('.ai-quick-chip');
      if (!chip || !question || !askButton) return;
      const prompt = chip.getAttribute('data-prompt');
      if (prompt) {
        question.value = prompt;
        askButton.click();
      }
    });

    updateQuotaUi();
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopCountdown();
      } else if (assistant && !assistant.classList.contains('hidden')) {
        updateQuotaUi();
        startCountdown();
      }
    });
    window.addEventListener('pagehide', () => {
      stopCountdown();
      window.clearTimeout(scheduled);
    }, { once: true });
  }

  function start() {
    const config = getConfig();
    if (config) init(config);
  }

  if (document.readyState === 'loading') {
    onReady(start, { once: true });
  } else {
    start();
  }
})();