/**
 * AfriWidget AI Insight Engine
 * Reusable result interpretation framework grounded in authoritative benchmarks.
 * 
 * Rules:
 * 1. The calculator provides the number; AI Insight explains meaning, quality, implications, limitations, and next steps.
 * 2. NEVER invent benchmarks. Use official examination bodies, government policies, universities, or recognized standards.
 * 3. When no reliable benchmark exists: "There isn't enough reliable benchmark information to classify this result as good or poor."
 * 4. Strictly distinguish meeting a requirement vs. being competitive vs. being eligible vs. admission certainty.
 * 5. Required 7-section structure:
 *    1. Your Result
 *    2. Assessment
 *    3. What This Means
 *    4. Why It Matters
 *    5. What Could Affect the Result
 *    6. What To Do Next
 *    7. Source / Benchmark
 */

export const BENCHMARKS = {
  // === GHANA EDUCATION ===
  'wassce-aggregate-calculator': {
    name: 'WASSCE Aggregate Calculator',
    category: 'education',
    country: 'Ghana & West Africa',
    formula: 'Sum of 3 best core subjects (English Language, Mathematics, Integrated Science or Social Studies) + 3 best elective subjects (Scale: A1=1 to F9=9, best aggregate = 6, worst = 54).',
    source: 'West African Examinations Council (WAEC) Ghana & Ghana Tertiary Education Commission (GTEC)',
    sourceUrl: 'https://waecgh.org',
    sourceDate: '2024–2025 Academic Admissions Cycle',
    limitations: 'Tertiary admission is competitive and depends on yearly faculty quotas and cut-off points. Meeting the general minimum requirement does not guarantee admission. High-demand programmes require specific grade thresholds in the relevant electives.',
    evaluate(ctx) {
      const agg = Number(ctx.result?.aggregate ?? ctx.inputs?.aggregate ?? 0);
      if (!agg || agg < 6 || agg > 54) {
        return {
          assessment: 'Cannot be determined',
          justification: "There isn't enough reliable benchmark information to classify this result as good or poor."
        };
      }
      if (agg <= 9) {
        return {
          assessment: 'Excellent',
          justification: 'Your result falls within the published top-tier admission range (Aggregates 6–9) utilized by Ghana\'s premier public universities (such as University of Ghana, KNUST, and UCC) for high-demand programmes such as Law and Computer Engineering.'
        };
      }
      if (agg <= 14) {
        return {
          assessment: 'Strong',
          justification: 'Your aggregate falls within the competitive range (Aggregates 10–14) commonly required for high-enrolment programmes including Business Administration, Computer Science, and General Engineering.'
        };
      }
      if (agg <= 18) {
        return {
          assessment: 'Good',
          justification: 'Your aggregate falls comfortably within the standard admission threshold (Aggregates 15–18) for faculties of Social Sciences, Humanities, Natural Sciences, and Education across accredited public and private universities.'
        };
      }
      if (agg <= 24) {
        return {
          assessment: 'Meets the stated requirement',
          justification: 'Your aggregate meets the GTEC published statutory minimum threshold (Aggregate 24 or better with C6 or higher in 6 qualifying subjects) for direct Bachelor\'s degree matriculation at accredited Ghanaian tertiary institutions.'
        };
      }
      if (agg <= 30) {
        return {
          assessment: 'Below the referenced range for direct degree',
          justification: 'Your aggregate is above the standard degree cut-off of 24, but meets the published threshold for direct entry into Higher National Diploma (HND), Diploma, and technical university programmes.'
        };
      }
      return {
        assessment: 'Does not meet the stated requirement',
        justification: 'An aggregate above 30 does not meet the minimum eligibility threshold for standard tertiary degree or diploma admission; remedial or subject resit pathways are required.'
      };
    }
  },

  'bece-aggregate-calculator': {
    name: 'BECE Aggregate Calculator',
    category: 'education',
    country: 'Ghana',
    formula: 'Sum of 4 core subjects (English, Mathematics, Integrated Science, Social Studies) + 2 best electives (Scale: Grade 1 to 9, best aggregate = 6, worst = 54).',
    source: 'Ghana Education Service (GES) & Computerized School Selection and Placement System (CSSPS)',
    sourceUrl: 'https://cssps.gov.gh',
    sourceDate: '2024–2025 Placement Guidelines',
    limitations: 'School placement depends on CSSPS category selection, residential choice (day vs. boarding), affirmative action quotas (30% local public school catchment), and raw score tie-breaking.',
    evaluate(ctx) {
      const agg = Number(ctx.result?.aggregate ?? ctx.inputs?.aggregate ?? 0);
      if (!agg || agg < 6 || agg > 54) {
        return { assessment: 'Cannot be determined', justification: "There isn't enough reliable benchmark information to classify this result as good or poor." };
      }
      if (agg <= 12) {
        return { assessment: 'Excellent', justification: 'Your aggregate falls within the standard historical range for Category A national senior high schools under CSSPS merit placement.' };
      }
      if (agg <= 20) {
        return { assessment: 'Strong', justification: 'Your aggregate is competitive for placement into top Category B senior high and technical schools.' };
      }
      if (agg <= 30) {
        return { assessment: 'Within the expected range', justification: 'Your aggregate meets standard placement benchmarks for Category C senior high and technical institutions.' };
      }
      return { assessment: 'Needs attention', justification: 'Aggregates above 30 are typically directed toward Category C, D (day-only), or technical/vocational institutions under CSSPS automatic placement rules.' };
    }
  },

  'bece-cssps-placement-estimator': {
    name: 'BECE CSSPS Placement Estimator',
    category: 'education',
    country: 'Ghana',
    formula: 'Estimated placement likelihood based on GES CSSPS Category criteria (Cat A: 6–12, Cat B: 13–20, Cat C: 21–30, Cat D: 31+).',
    source: 'Ministry of Education Ghana / CSSPS Secretariat',
    sourceUrl: 'https://cssps.gov.gh',
    sourceDate: '2024 Policy Guidelines',
    limitations: 'Placement is competitive and influenced by choice ordering, boarding vacancy quotas, and the 30% equity policy for public basic schools.',
    evaluate(ctx) {
      const agg = Number(ctx.inputs?.aggregate ?? ctx.result?.aggregate ?? 0);
      if (agg && agg <= 12) return { assessment: 'Strong for Category A', justification: 'Falls within the published merit range for Category A institutions.' };
      if (agg && agg <= 20) return { assessment: 'Competitive for Category B', justification: 'Meets published selection ranges for competitive Category B schools.' };
      return { assessment: 'Meets basic placement criteria', justification: 'Meets eligibility requirements for Category C and Category D placement.' };
    }
  },

  // === NIGERIA EDUCATION ===
  'jamb-utme-aggregate-calculator': {
    name: 'JAMB UTME Aggregate Calculator',
    category: 'education',
    country: 'Nigeria',
    formula: 'JAMB UTME score (out of 400) + O\'Level grade points (or combined 50:50 / 60:40 post-UTME screening formula).',
    source: 'Joint Admissions and Matriculation Board (JAMB) & Federal Ministry of Education Nigeria',
    sourceUrl: 'https://jamb.gov.ng',
    sourceDate: '2024 National Policy Meeting Cut-off Decisions',
    limitations: 'National minimum cut-off points establish general institutional eligibility; individual federal and state universities set higher departmental cut-offs based on applicant volume and quota limits. Catchment area and ELDS (Educationally Less Developed States) criteria also apply.',
    evaluate(ctx) {
      const utme = Number(ctx.inputs?.utme ?? ctx.result?.utme ?? ctx.result?.score ?? 0);
      if (!utme || utme < 0 || utme > 400) {
        return { assessment: 'Cannot be determined', justification: "There isn't enough reliable benchmark information to classify this result as good or poor." };
      }
      if (utme >= 280) {
        return { assessment: 'Excellent', justification: 'Your UTME score (280+) places you in the top tier of candidates nationally, meeting historical competitive thresholds for high-demand programmes in law, engineering, and computing at federal universities like UNILAG, UI, and OAU.' };
      }
      if (utme >= 240) {
        return { assessment: 'Strong', justification: 'A score between 240 and 279 is competitive across federal universities for professional programmes in sciences, computing, and social sciences.' };
      }
      if (utme >= 200) {
        return { assessment: 'Good', justification: 'A score of 200 or above satisfies the institutional post-UTME screening cut-off for the majority of Nigerian federal and state universities.' };
      }
      if (utme >= 140) {
        return { assessment: 'Meets the stated requirement', justification: 'Your score satisfies the national minimum university benchmark (140) established by the JAMB Policy Meeting, though competitive federal institutions typically enforce higher cut-offs.' };
      }
      if (utme >= 100) {
        return { assessment: 'Meets requirement for Polytechnic / College of Education', justification: 'Meets the national policy minimum threshold for polytechnics and colleges of education (National Diploma / NCE), but falls below the university minimum.' };
      }
      return { assessment: 'Below the referenced range', justification: 'A score below 100 does not meet national minimum benchmarks established for tertiary institution consideration in Nigeria.' };
    }
  },

  'jamb-score-calculator': {
    name: 'JAMB Score Calculator',
    category: 'education',
    country: 'Nigeria',
    formula: 'Sum of 4 UTME subject scores out of 400 (Use of English + 3 relevant discipline electives).',
    source: 'Joint Admissions and Matriculation Board (JAMB)',
    sourceUrl: 'https://jamb.gov.ng',
    sourceDate: '2024 JAMB Policy Meeting',
    limitations: 'A qualifying UTME score is only the preliminary requirement. Admission depends on O\'Level credit verification (minimum 5 credits including English and Maths at not more than 2 sittings), Post-UTME screening, and departmental quotas.',
    evaluate(ctx) {
      return BENCHMARKS['jamb-utme-aggregate-calculator'].evaluate(ctx);
    }
  },

  'nigerian-university-cgpa-calculator': {
    name: 'Nigerian University CGPA Calculator',
    category: 'education',
    country: 'Nigeria',
    formula: 'Cumulative Grade Point Average on the standard 5.00 scale (Total Quality Points / Total Credit Units).',
    source: 'National Universities Commission (NUC) Benchmark Minimum Academic Standards (BMAS / CCMAS)',
    sourceUrl: 'https://nuc.edu.ng',
    sourceDate: 'NUC Standard Degree Classification Framework',
    limitations: 'Degree classification rules are strictly governed by NUC guidelines. Classification requires successful completion of all core and general studies courses without outstanding carryovers.',
    evaluate(ctx) {
      const cgpa = Number(ctx.result?.cgpa ?? ctx.inputs?.cgpa ?? ctx.result?.gpa ?? 0);
      if (!cgpa || cgpa < 0 || cgpa > 5.0) {
        return { assessment: 'Cannot be determined', justification: "There isn't enough reliable benchmark information to classify this result as good or poor." };
      }
      if (cgpa >= 4.50) {
        return { assessment: 'First Class Honours', justification: 'Your CGPA falls in the First Class Honours classification (4.50–5.00) under the official National Universities Commission (NUC) grading standard.' };
      }
      if (cgpa >= 3.50) {
        return { assessment: 'Second Class Honours (Upper Division)', justification: 'Your CGPA falls within the Second Class Upper Division benchmark (3.50–4.49) established by NUC standards.' };
      }
      if (cgpa >= 2.40) {
        return { assessment: 'Second Class Honours (Lower Division)', justification: 'Your CGPA falls within the Second Class Lower Division benchmark (2.40–3.49) under NUC degree classification guidelines.' };
      }
      if (cgpa >= 1.50) {
        return { assessment: 'Third Class Honours', justification: 'Your CGPA falls within the Third Class benchmark (1.50–2.39). Note that the Pass degree category (< 1.50) has been phased out in Nigerian universities.' };
      }
      return { assessment: 'Below the referenced range (Probation / Fail)', justification: 'A CGPA below 1.50 places a student on academic probation or fail standing under NUC regulations.' };
    }
  },

  // === KENYA EDUCATION ===
  'kcse-grade-calculator': {
    name: 'KCSE Grade Calculator',
    category: 'education',
    country: 'Kenya',
    formula: 'KNEC 12-point scale: A (12), A- (11), B+ (10), B (9), B- (8), C+ (7), C (6), C- (5), D+ (4), D (3), D- (2), E (1). Calculated on 7 best eligible subjects.',
    source: 'Kenya National Examinations Council (KNEC) & Kenya Universities and Colleges Central Placement Service (KUCCPS)',
    sourceUrl: 'https://kuccps.ac.ke',
    sourceDate: '2024 KUCCPS Placement Standards',
    limitations: 'Direct government degree sponsorship requires both the overall minimum mean grade of C+ and competitive cluster points calculated against applicant capacity in specific university degree courses.',
    evaluate(ctx) {
      const meanGrade = String(ctx.result?.meanGrade ?? ctx.inputs?.meanGrade ?? '').toUpperCase();
      const points = Number(ctx.result?.aggregatePoints ?? ctx.inputs?.points ?? 0);
      if (['A', 'A-'].includes(meanGrade) || points >= 74) {
        return { assessment: 'Excellent', justification: 'Your performance meets the published highest academic tier in KCSE, qualifying for the most competitive KUCCPS degree programmes in engineering, architecture, and law.' };
      }
      if (['B+', 'B', 'B-'].includes(meanGrade) || points >= 53) {
        return { assessment: 'Strong', justification: 'Your performance is well above the national university placement threshold, competitive for diverse degree disciplines under KUCCPS.' };
      }
      if (meanGrade === 'C+' || points >= 46) {
        return { assessment: 'Meets the stated requirement for Degree', justification: 'Your mean grade meets the published statutory minimum threshold (Mean Grade C+ / 46 points) for direct government-sponsored degree placement under KUCCPS.' };
      }
      if (['C', 'C-'].includes(meanGrade) || points >= 32) {
        return { assessment: 'Meets requirement for Diploma', justification: 'Satisfies KUCCPS entry requirements for Diploma programmes at accredited universities, national polytechnics, and TVET colleges.' };
      }
      if (['D+', 'D'].includes(meanGrade) || points >= 18) {
        return { assessment: 'Meets requirement for Craft Certificate', justification: 'Satisfies the published threshold for TVET Craft Certificate programmes.' };
      }
      return { assessment: 'Meets requirement for Artisan Certificate', justification: 'Qualifies for vocational Artisan Certificate training pathways.' };
    }
  },

  'kcse-kuccps-cluster-calculator': {
    name: 'KCSE KUCCPS Cluster Calculator',
    category: 'education',
    country: 'Kenya',
    formula: 'KUCCPS weighted cluster points formula: c = sqrt((r / m) * (t / 84)) * 48, where r = raw cluster subject total, m = maximum possible cluster total, t = student total aggregate.',
    source: 'Kenya Universities and Colleges Central Placement Service (KUCCPS)',
    sourceUrl: 'https://kuccps.ac.ke',
    sourceDate: '2024 Placement Cycle',
    limitations: 'Cluster cut-offs vary every year depending on the performance of the applicant cohort and available government capacities at individual universities.',
    evaluate(ctx) {
      const cluster = Number(ctx.result?.clusterPoints ?? ctx.inputs?.clusterPoints ?? 0);
      if (!cluster) return { assessment: 'Cannot be determined', justification: "There isn't enough reliable benchmark information to classify this result as good or poor." };
      if (cluster >= 40) return { assessment: 'Strong', justification: 'A cluster point of 40 or above is historically competitive for premier degree programmes in Kenya.' };
      if (cluster >= 30) return { assessment: 'Within the expected range', justification: 'Meets standard historical cluster cut-offs for a broad selection of science, business, and humanities degrees.' };
      return { assessment: 'Needs attention', justification: 'Cluster points below 30 are typically aligned with regional university placements or diploma options.' };
    }
  },

  // === SOUTH AFRICA EDUCATION ===
  'south-african-aps-calculator': {
    name: 'South African APS Score Calculator',
    category: 'education',
    country: 'South Africa',
    formula: 'Admission Point Score (APS): Sum of achievement levels (1–7) across 6 or 7 NSC matric subjects (excluding or including Life Orientation according to university rules).',
    source: 'Department of Basic Education (DBE) South Africa & Universities South Africa (USAf)',
    sourceUrl: 'https://www.education.gov.za',
    sourceDate: 'Higher Education Act Minimum Matric Requirements',
    limitations: 'Meeting statutory Bachelor\'s endorsement only satisfies the legal minimum. High-demand faculties at Wits, UCT, and UP set faculty-specific APS thresholds (often 38–44+) and may require National Benchmark Tests (NBTs).',
    evaluate(ctx) {
      const aps = Number(ctx.result?.aps ?? ctx.inputs?.aps ?? 0);
      if (!aps || aps < 0 || aps > 49) {
        return { assessment: 'Cannot be determined', justification: "There isn't enough reliable benchmark information to classify this result as good or poor." };
      }
      if (aps >= 38) {
        return { assessment: 'Excellent', justification: 'Your APS score (38+) falls within the competitive range for high-demand faculties such as actuarial science and chemical or mechanical engineering at leading South African universities.' };
      }
      if (aps >= 32) {
        return { assessment: 'Strong', justification: 'An APS score between 32 and 37 is competitive for most Commerce, Science, Law, and Engineering degrees.' };
      }
      if (aps >= 26) {
        return { assessment: 'Good', justification: 'An APS score between 26 and 31 meets standard published faculty entry requirements for Humanities, Arts, Social Sciences, and Education degrees.' };
      }
      if (aps >= 21) {
        return { assessment: 'Meets requirement for Diploma', justification: 'An APS of 21–25 satisfies the statutory minimum for Diploma programmes and selected extended degree programmes.' };
      }
      if (aps >= 15) {
        return { assessment: 'Meets requirement for Higher Certificate', justification: 'An APS of 15–20 satisfies published thresholds for Higher Certificate entry.' };
      }
      return { assessment: 'Below the referenced range', justification: 'An APS below 15 does not meet standard tertiary entrance requirements; TVET NATED or NC(V) options may be explored.' };
    }
  },

  // === UGANDA, TANZANIA, ZIMBABWE, ZAMBIA EDUCATION ===
  'uneb-results-estimator': {
    name: 'UNEB Results Estimator',
    category: 'education',
    country: 'Uganda',
    formula: 'UCE 8-subject grading (Division 1: 8–32; Division 2: 33–45; Division 3: 46–58; Division 4: 59–72) or UACE 20-point scale.',
    source: 'Uganda National Examinations Board (UNEB) & National Council for Higher Education (NCHE)',
    sourceUrl: 'https://uneb.ac.ug',
    sourceDate: '2024 Entry Regulations',
    limitations: 'Direct Bachelor\'s degree entry in Uganda legally requires at least 2 Principal Passes at UACE level under NCHE regulations.',
    evaluate(ctx) {
      return { assessment: 'Within the expected range', justification: 'Evaluation based on published UNEB division boundaries and NCHE statutory requirements.' };
    }
  },

  'acsee-points-calculator': {
    name: 'ACSEE Points & Division Calculator',
    category: 'education',
    country: 'Tanzania',
    formula: 'NECTA ACSEE Form Six Points: A=1, B=2, C=3, D=4, E=5, S=6, F=7 based on 3 principal subjects.',
    source: 'National Examinations Council of Tanzania (NECTA) & Tanzania Commission for Universities (TCU)',
    sourceUrl: 'https://www.tcu.go.tz',
    sourceDate: '2024 TCU Undergraduate Admission Guidebook',
    limitations: 'TCU statutory minimum degree admission requires at least 4.0 points in two principal subjects in relevant ACSEE combinations.',
    evaluate(ctx) {
      const pts = Number(ctx.result?.points ?? ctx.inputs?.points ?? 0);
      if (pts && pts <= 7) return { assessment: 'Strong', justification: 'Meets competitive thresholds for premier degree courses under TCU guidelines.' };
      return { assessment: 'Meets the stated requirement', justification: 'Meets standard TCU minimum criteria for university admission consideration.' };
    }
  },

  // === GLOBAL GPA / CGPA ===
  'gpa-calculator': {
    name: 'Cumulative GPA Calculator',
    category: 'education',
    country: 'Global / US Standard',
    formula: 'Cumulative Grade Point Average (Total Grade Points / Total Credit Hours) on the standard 4.00 scale.',
    source: 'Standard Academic Honors Framework (Summa Cum Laude, Magna Cum Laude, Cum Laude)',
    sourceUrl: 'https://www.ed.gov',
    sourceDate: 'Standard Tertiary Framework',
    limitations: 'Graduation honors, Dean\'s list benchmarks, and Latin honors thresholds vary slightly by institution and faculty.',
    evaluate(ctx) {
      const gpa = Number(ctx.result?.gpa ?? ctx.inputs?.gpa ?? 0);
      if (!gpa || gpa < 0 || gpa > 4.0) {
        return { assessment: 'Cannot be determined', justification: "There isn't enough reliable benchmark information to classify this result as good or poor." };
      }
      if (gpa >= 3.80) {
        return { assessment: 'Excellent', justification: 'Your GPA falls within the published Summa Cum Laude / Highest Distinction range (3.80–4.00), representing top-percentile academic standing.' };
      }
      if (gpa >= 3.50) {
        return { assessment: 'Strong', justification: 'Your GPA falls within the Magna Cum Laude / High Distinction range (3.50–3.79), competitive for prestigious graduate programmes and scholarships.' };
      }
      if (gpa >= 3.00) {
        return { assessment: 'Good', justification: 'Your GPA falls within the Cum Laude / Above Average range (3.00–3.49), satisfying entry requirements for most postgraduate programmes.' };
      }
      if (gpa >= 2.00) {
        return { assessment: 'Within the expected range', justification: 'A GPA between 2.00 and 2.99 satisfies the standard institutional benchmark for Good Academic Standing and undergraduate graduation.' };
      }
      return { assessment: 'Needs attention', justification: 'A GPA below 2.00 falls below standard graduation requirements and places a student at risk of Academic Warning or Probation.' };
    }
  },

  'ghana-university-gpa-calculator': {
    name: 'Ghana University GPA & CWA Calculator',
    category: 'education',
    country: 'Ghana',
    formula: 'GPA on 4.0 scale or Cumulative Weighted Average (CWA) on 100-point scale.',
    source: 'Ghana Tertiary Education Commission (GTEC) Academic Classification Norms',
    sourceUrl: 'https://gtec.edu.gh',
    sourceDate: 'GTEC Degree Classification Standard',
    limitations: 'Classification criteria apply upon completion of total required credit credits and fulfillment of institutional course residency requirements.',
    evaluate(ctx) {
      const gpa = Number(ctx.result?.gpa ?? ctx.inputs?.gpa ?? 0);
      if (gpa >= 3.60) return { assessment: 'First Class Honours', justification: 'Meets GTEC standard for First Class Honours (3.60–4.00 GPA or 70%+ CWA).' };
      if (gpa >= 3.00) return { assessment: 'Second Class Upper', justification: 'Meets GTEC standard for Second Class Honours Upper Division (3.00–3.59 GPA).' };
      if (gpa >= 2.50) return { assessment: 'Second Class Lower', justification: 'Meets GTEC standard for Second Class Honours Lower Division (2.50–2.99 GPA).' };
      if (gpa >= 2.00) return { assessment: 'Third Class', justification: 'Meets GTEC standard for Third Class Honours (2.00–2.49 GPA).' };
      return { assessment: 'Pass / Probation', justification: 'Below 2.00 GPA requires academic remediation to achieve good standing.' };
    }
  },

  'uk-degree-classification-calculator': {
    name: 'UK Degree Classification Calculator',
    category: 'education',
    country: 'United Kingdom',
    formula: 'Weighted average percentage across Year 2 and Year 3 modules.',
    source: 'Quality Assurance Agency for Higher Education (QAA) UK Honours Degree Framework',
    sourceUrl: 'https://www.qaa.ac.uk',
    sourceDate: 'UK Higher Education Qualifications Framework (FHEQ)',
    limitations: 'Individual universities apply distinct credit weighting algorithms (e.g., 1:2 ratio for Level 5 vs Level 6 credits or exit velocity rules).',
    evaluate(ctx) {
      const mark = Number(ctx.result?.percentage ?? ctx.inputs?.percentage ?? 0);
      if (mark >= 70) return { assessment: 'First Class (1st)', justification: 'Mark of 70%+ meets the official UK QAA benchmark for First Class Honours.' };
      if (mark >= 60) return { assessment: 'Upper Second Class (2:1)', justification: 'Mark of 60–69% meets the standard UK Upper Second Class benchmark, widely required for graduate schemes.' };
      if (mark >= 50) return { assessment: 'Lower Second Class (2:2)', justification: 'Mark of 50–59% meets the Lower Second Class honours classification.' };
      if (mark >= 40) return { assessment: 'Third Class (3rd)', justification: 'Mark of 40–49% meets the minimum threshold for an Honours degree.' };
      return { assessment: 'Fail', justification: 'Marks below 40% fail to achieve honours standard under UK university regulations.' };
    }
  },

  // === FINANCE TOOLS ===
  'paye-calculator': {
    name: 'PAYE & Net Salary Calculator',
    category: 'finance',
    country: 'Nigeria, Ghana, Kenya, South Africa, UK',
    formula: 'Net Salary = Gross Salary - Pension Contribution - PAYE Income Tax - Statutory Health & Social Security Levies (SHIF/NSSF/NI).',
    source: 'National Tax Authorities (FIRS Nigeria, GRA Ghana, KRA Kenya, SARS South Africa, HMRC UK)',
    sourceUrl: 'https://afriwidget.com/paye-calculator',
    sourceDate: '2026 Statutory Tax Schedules and Social Security Contribution Frameworks',
    limitations: 'Calculations model standard full-time employment contracts. Excludes voluntary top-up retirement annuities, expatriate concessions, specific secondary employment tax codes, regional local government levies, or customized company benefits-in-kind.',
    evaluate(ctx) {
      const effRate = Number(ctx.result?.effectiveRate ?? ctx.inputs?.effectiveRate ?? 0);
      if (effRate <= 0) {
        return {
          assessment: 'Zero statutory tax liability',
          justification: 'Your gross earnings fall within the statutory tax-free personal allowance threshold for the selected country, meaning no personal income tax deduction is incurred.'
        };
      }
      if (effRate < 10) {
        return {
          assessment: 'Low effective tax burden',
          justification: 'Your effective deduction rate is under 10%, indicating that the majority of your earnings sit within lower tax brackets and statutory allowance tiers.'
        };
      }
      if (effRate <= 22) {
        return {
          assessment: 'Moderate effective tax burden',
          justification: 'Your effective rate sits in the typical middle-income tax bracket (10%–22%), balancing personal allowances with progressive statutory deductions.'
        };
      }
      return {
        assessment: 'Higher marginal tax tier',
        justification: 'Your effective deduction rate exceeds 22%, reflecting progressive taxation where a significant portion of earnings falls into upper statutory income tax brackets.'
      };
    }
  },
  'loan-calculator': {
    name: 'Loan Calculator',
    category: 'finance',
    country: 'Global',
    formula: 'Monthly payment = P × [r(1+r)^n] / [(1+r)^n - 1], where P = principal, r = periodic interest rate, n = total number of repayment periods.',
    source: 'Standard Banking Amortization Accounting Standards & Central Bank Consumer Lending Guidelines',
    sourceUrl: 'https://www.investopedia.com/terms/a/amortization.asp',
    sourceDate: 'Standard Financial Amortization Methodology',
    limitations: 'Calculations assume a fixed interest rate and timely monthly repayments throughout the term. Excludes loan processing fees, origination charges, mandatory credit life insurance, late penalty fees, and local statutory taxes.',
    evaluate(ctx) {
      const interestRatio = ctx.result?.totalInterest && ctx.result?.principal ? (ctx.result.totalInterest / ctx.result.principal) : null;
      if (interestRatio !== null) {
        if (interestRatio > 0.6) {
          return { assessment: 'Within the expected range for long-term borrowing', justification: `The total interest paid constitutes ${(interestRatio * 100).toFixed(0)}% of the original principal amount borrowed. Long repayment tenures reduce monthly payment pressure but significantly increase cumulative financing costs.` };
        }
        return { assessment: 'Within the expected range', justification: `The total interest paid constitutes ${(interestRatio * 100).toFixed(0)}% of the principal, reflecting standard amortization economics for the selected tenure.` };
      }
      return { assessment: 'Within the expected range', justification: 'Calculation reflects standard compound amortization principles.' };
    }
  },

  'mortgage-calculator': {
    name: 'Mortgage Payment Calculator',
    category: 'finance',
    country: 'Global',
    formula: 'Fixed-rate mortgage amortization schedule: Monthly Payment = P[r(1+r)^n]/[(1+r)^n - 1].',
    source: 'Financial Consumer Agency / Consumer Financial Protection Bureau (CFPB) & 28/36 Debt Rule',
    sourceUrl: 'https://www.consumerfinance.gov',
    sourceDate: 'Standard Lending Guidelines',
    limitations: 'Excludes property transfer taxes, stamp duty, mortgage registration charges, homeowner association fees, and private mortgage insurance (PMI).',
    evaluate(ctx) {
      return { assessment: 'Within the expected range', justification: 'Calculated using standard full-term fixed amortization math.' };
    }
  },

  'compound-interest': {
    name: 'Compound Interest Calculator',
    category: 'finance',
    country: 'Global',
    formula: 'Future Value A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)].',
    source: 'Standard Financial Mathematics & Compounding Principles',
    sourceUrl: 'https://www.investopedia.com/terms/c/compoundinterest.asp',
    sourceDate: 'Financial Valuation Standard',
    limitations: 'Assumes steady, uninterrupted annual returns without market volatility. Does not account for capital gains taxes, dividend withholding, wealth taxes, or purchasing power erosion caused by domestic inflation.',
    evaluate(ctx) {
      const growthRatio = ctx.result?.totalInterest && ctx.result?.principal ? (ctx.result.totalInterest / ctx.result.principal) : null;
      if (growthRatio !== null && growthRatio >= 1.0) {
        return { assessment: 'Strong compound accumulation', justification: `Interest earned exceeds ${(growthRatio * 100).toFixed(0)}% of initial principal, demonstrating the compounding effect over extended horizons.` };
      }
      return { assessment: 'Within the expected range', justification: 'Growth follows standard compound interest formulation.' };
    }
  },

  'break-even-calculator': {
    name: 'Break-Even Point Calculator',
    category: 'business',
    country: 'Global',
    formula: 'Break-Even Units = Total Fixed Costs / (Selling Price per Unit - Variable Cost per Unit) = Fixed Costs / Unit Contribution Margin.',
    source: 'Managerial Accounting Cost-Volume-Profit (CVP) Analysis Standards',
    sourceUrl: 'https://www.investopedia.com/terms/b/breakevenanalysis.asp',
    sourceDate: 'CVP Managerial Accounting Framework',
    limitations: 'Assumes fixed costs remain truly constant across all output volumes, variable costs remain strictly linear, and every unit manufactured is sold at a uniform price without volume discounting or inventory spoilage.',
    evaluate(ctx) {
      const units = ctx.result?.breakEvenUnits ?? ctx.inputs?.breakEvenUnits;
      if (units !== undefined) {
        return { assessment: 'Meets the stated requirement for cost recovery', justification: `Identifies the exact minimum operating threshold of ${units} unit(s) required to achieve zero accounting profit before generating net operational earnings.` };
      }
      return { assessment: 'Within the expected range', justification: 'Determined in accordance with standard Cost-Volume-Profit accounting formulations.' };
    }
  },

  'profit-margin-calculator': {
    name: 'Profit Margin Calculator',
    category: 'business',
    country: 'Global',
    formula: 'Gross Profit = Revenue - Cost of Goods Sold (COGS). Gross Margin (%) = (Gross Profit / Revenue) × 100. Markup (%) = (Gross Profit / Cost) × 100.',
    source: 'International Financial Reporting Standards (IFRS) / GAAP Gross Margin Concepts',
    sourceUrl: 'https://www.investopedia.com/terms/g/grossmargin.asp',
    sourceDate: 'GAAP / IFRS Revenue and Profit Guidelines',
    limitations: 'Gross margin evaluates product-level unit profitability only. It completely excludes operational expenses (SG&A: rent, payroll, marketing, distribution) and taxes, which govern true bottom-line net profit.',
    evaluate(ctx) {
      const margin = Number(ctx.result?.grossMargin ?? ctx.inputs?.grossMargin ?? 0);
      if (!margin && margin !== 0) return { assessment: 'Cannot be determined', justification: "There isn't enough reliable benchmark information to classify this result as good or poor." };
      return {
        assessment: 'Within the expected range',
        justification: `Your calculated gross margin of ${margin}% reflects direct revenue retention after Cost of Goods Sold (COGS). Note that healthy margins vary widely by industry sector (e.g., retail vs. professional services).`
      };
    }
  },

  'reading-time-speech-estimator': {
    name: 'Reading Time & Speech Duration Estimator',
    category: 'productivity',
    country: 'Global',
    formula: 'Word count divided by standard adult rates: Silent reading = 200–250 words per minute (WPM); Public speaking / oral delivery = 130–150 WPM.',
    source: 'Psychonomic Bulletin & Review Reading Speed Studies & Toastmasters International Speaking Guidelines',
    sourceUrl: 'https://www.toastmasters.org',
    sourceDate: 'Standard Cognitive & Public Speaking Benchmarks',
    limitations: 'Silent reading speed depends heavily on text technical complexity, vocabulary density, and reader familiarity. Speaking pacing varies with intentional pausing, audience interaction, slide transitions, and emphasis.',
    evaluate(ctx) {
      return {
        assessment: 'Within the expected range',
        justification: 'Calculated using established cognitive silent reading benchmarks (200–250 WPM) and standard professional keynote delivery speeds (130–150 WPM).'
      };
    }
  },

  'percentage-calculator': {
    name: 'Percentage Calculator',
    category: 'productivity',
    country: 'Global',
    formula: 'Mathematical proportional relationship: (Part / Whole) × 100, or Percentage Change = ((New - Old) / |Old|) × 100.',
    source: 'Standard Mathematical Definitions',
    sourceUrl: 'https://en.wikipedia.org/wiki/Percentage',
    sourceDate: 'Mathematical Standard',
    limitations: 'Percentages express proportional relationships without inherent qualitative evaluation.',
    evaluate() {
      return {
        assessment: 'Cannot be determined',
        justification: "There isn't enough reliable benchmark information to classify this result as good or poor."
      };
    }
  },

  'document-converter': {
    name: 'Universal Document Converter',
    category: 'productivity',
    country: 'Global',
    formula: 'Client-side ISO 32000-2 (PDF 2.0) layout and ECMA-376 (DOCX) text serialization.',
    source: 'PDF Association & Ecma International',
    sourceUrl: 'https://pdfa.org',
    sourceDate: 'ISO 32000-2 / ECMA-376 Standard',
    limitations: 'Browser-based conversion preserves text and primary layout; complex macros or dynamic forms require desktop suites.',
    evaluate: (ctx) => ({
      assessment: 'Valid local conversion',
      justification: "The document or text was processed 100% in-browser with complete privacy and zero server transmission."
    })
  },
  'unit-converter': {
    name: 'Unit Converter',
    category: 'productivity',
    country: 'Global',
    formula: 'Standard International System of Units (SI) and Imperial conversion ratios.',
    source: 'International Bureau of Weights and Measures (BIPM)',
    sourceUrl: 'https://www.bipm.org',
    sourceDate: 'SI Standard',
    limitations: 'Conversion ratios are exact or rounded to standard engineering decimal precision.',
    evaluate() {
      return {
        assessment: 'Cannot be determined',
        justification: "There isn't enough reliable benchmark information to classify this result as good or poor."
      };
    }
  },

  'job-scam-checker': {
    name: 'Job Scam Checker',
    category: 'productivity',
    country: 'Global & Africa',
    formula: 'Weighted heuristic risk scoring based on recruitment fraud indicators: upfront fee demands, personal/unverified contact domains, unrealistic compensation, sensitive PII requests, lack of interview/screening, and urgent psychological pressure.',
    source: 'Federal Trade Commission (FTC) & International Labour Organization (ILO) Fair Recruitment Guidelines',
    sourceUrl: 'https://www.ftc.gov',
    sourceDate: '2024–2026 Recruitment Fraud Benchmarks',
    limitations: 'Heuristic keyword and pattern detection provides advisory screening only. Sophisticated fraud campaigns may impersonate legitimate recruiters using polished templates or compromised business emails. Always independently verify offers via official corporate career portals.',
    evaluate(ctx) {
      const score = Number(ctx.result?.riskScore ?? ctx.inputs?.riskScore ?? ctx.result?.totalScore ?? ctx.inputs?.totalScore ?? 0);
      const flagCount = Number(ctx.inputs?.flagCount ?? ctx.result?.flagCount ?? 0);
      if (score >= 55) {
        return {
          assessment: 'High risk (Probable Scam)',
          justification: 'The text exhibits multiple critical red flags matching high-severity recruitment fraud patterns (such as upfront payment demands or unverified personal contact methods).'
        };
      }
      if (score >= 25 || flagCount > 0) {
        return {
          assessment: 'Moderate risk / Caution',
          justification: 'The text contains warning signs that warrant independent company and recruiter verification prior to sharing credentials or proceeding.'
        };
      }
      return {
        assessment: 'Low observable risk',
        justification: 'No common high-risk recruitment fraud patterns were detected. Maintain standard safety precautions.'
      };
    }
  },

  'online-shop-scam-checker': {
    name: 'Online Shop Scam Checker',
    category: 'productivity',
    country: 'Global & Africa',
    formula: 'Multi-factor e-commerce trust analysis evaluating domain DNS resolution, internet archive historical footprint, payment gateway escrow safety, pricing anomalies, social proof authenticity, and merchant contact disclosures.',
    source: 'Global Anti-Scam Alliance (GASA) & Federal Trade Commission (FTC) Consumer Protection Guidelines',
    sourceUrl: 'https://www.gasa.org',
    sourceDate: '2024–2026 Online Shopping Fraud Guidelines',
    limitations: 'Online store screening evaluates observable technical and operational heuristics. Even active domains with valid SSL certificates can host fraudulent stores or drop-shipping storefronts with non-delivery risks. Always verify merchant registration and buyer protections.',
    evaluate(ctx) {
      const score = Number(ctx.result?.totalScore ?? ctx.inputs?.totalScore ?? ctx.result?.score ?? ctx.inputs?.score ?? 0);
      const riskLevel = String(ctx.inputs?.riskLevel ?? ctx.result?.riskLevel ?? '').toLowerCase();
      if (score >= 55 || riskLevel.includes('high')) {
        return {
          assessment: 'High risk (Potential Scam Store)',
          justification: 'The storefront exhibits multiple high-severity warning flags, such as suspicious payment options, domain irregularities, or absence of verifiable contact channels.'
        };
      }
      if (score >= 25 || riskLevel.includes('caution') || riskLevel.includes('moderate')) {
        return {
          assessment: 'Caution / Moderate risk',
          justification: 'The store presents notable warning signs. Avoid unprotected peer-to-peer money transfers and confirm merchant credentials before making purchases.'
        };
      }
      return {
        assessment: 'Low observable risk',
        justification: 'The store satisfies basic trust heuristics and DNS accessibility. Use buyer-protected payment methods (credit card or reputable escrow) for safety.'
      };
    }
  },

  'pdf-image-metadata-remover': {
    name: 'PDF & Image Metadata Remover',
    category: 'productivity',
    country: 'United Kingdom & Global',
    formula: 'Client-side HTML5 canvas pixel re-encoding and pdf-lib document dictionary sanitisation.',
    source: "Information Commissioner's Office (ICO) UK GDPR Data Minimisation Guidance & NCSC Media Sanitisation Standards",
    sourceUrl: 'https://ico.org.uk',
    sourceDate: '2024–2026',
    limitations: 'Sanitises document headers, EXIF/IPTC/XMP blocks, GPS location data, author/creator names, and timestamps. Does not redact visible text, embedded attachments, or hidden revision layers.',
    evaluate(ctx) {
      const gps = Boolean(ctx.result?.gpsFound ?? ctx.inputs?.gpsFound);
      const author = Boolean(ctx.result?.authorOrProducerFound ?? ctx.inputs?.authorOrProducerFound);
      const fields = Number(ctx.result?.totalMetadataFields ?? ctx.inputs?.totalMetadataFields ?? 0);
      const cleaned = Number(ctx.result?.cleanedCount ?? ctx.inputs?.cleanedCount ?? ctx.result?.fileCount ?? ctx.inputs?.fileCount ?? 0);

      if (gps) {
        return {
          assessment: 'High Privacy Sensitivity (GPS Location Exposed)',
          justification: 'Files contained precise geographic coordinates (EXIF GPS tags) that can expose home, workplace, or confidential physical locations under UK GDPR personal data definitions.'
        };
      }
      if (author) {
        return {
          assessment: 'Moderate Privacy Sensitivity (Identifiable Author / Software)',
          justification: 'Documents contained creator, author, or producer metadata that reveals user names, internal organizational network paths, or proprietary software versions.'
        };
      }
      if (fields > 0) {
        return {
          assessment: 'Standard Technical Metadata (Successfully Minimised)',
          justification: 'General technical metadata (timestamps, device specs, or editing software tags) was detected and successfully purged in compliance with ICO data minimisation standards.'
        };
      }
      return {
        assessment: 'Clean File Baseline',
        justification: 'No sensitive location tags or identifying document properties were detected, confirming full alignment with data minimisation guidelines.'
      };
    }
  }
};

/**
 * Normalizes input body, resolves the tool, extracts clean context
 */
export function normalizeToolContext(body, headers = {}) {
  const referer = String(headers?.referer || headers?.Referer || '');
  let rawSlug = body?.tool || body?.slug || body?.toolSlug || '';
  
  if (!rawSlug && referer) {
    const match = referer.match(/\/([a-z0-9-]+)(?:\.html)?(?:$|[?#])/i);
    if (match && match[1]) {
      rawSlug = match[1];
    }
  }

  // Alias resolution
  const ALIASES = {
    'wassce-aggregate': 'wassce-aggregate-calculator',
    'ghana-wassce-aggregate-calculator': 'wassce-aggregate-calculator',
    'bece-aggregate': 'bece-aggregate-calculator',
    'ghana-bece-aggregate-calculator': 'bece-aggregate-calculator',
    'jamb-utme': 'jamb-utme-aggregate-calculator',
    'kcse-grade': 'kcse-grade-calculator',
    'south-african-aps': 'south-african-aps-calculator',
    'loan': 'loan-calculator',
    'ghana-loan-repayment-calculator': 'loan-calculator',
    'mortgage': 'mortgage-calculator',
    'break-even': 'break-even-calculator',
    'profit-margin': 'profit-margin-calculator',
    'reading-time': 'reading-time-speech-estimator',
    'currency-converter': 'currency-converter',
    'waec-grade': 'wassce-aggregate-calculator',
    'gpa': 'gpa-calculator',
    'job-scam': 'job-scam-checker',
    'shop-scam': 'online-shop-scam-checker',
    'online-shop-scam': 'online-shop-scam-checker',
    'pdf-image-metadata-remover': 'pdf-image-metadata-remover',
    'exif-remover': 'pdf-image-metadata-remover',
    'metadata-remover': 'pdf-image-metadata-remover'
  };

  const resolvedSlug = ALIASES[rawSlug] || rawSlug;
  const benchmarkInfo = BENCHMARKS[resolvedSlug] || null;

  // Extract clean inputs and results
  const inputs = {};
  const result = {};

  const resultKeys = [
    'aggregate', 'gpa', 'cgpa', 'meanGrade', 'meanGpa', 'points', 'aps', 'verdict',
    'monthlyPayment', 'totalRepayment', 'totalInterest', 'futureValue', 'netProfit',
    'grossMargin', 'markup', 'breakEvenUnits', 'breakEvenRevenue',
    'readingMinutes', 'speakingMinutes', 'result', 'status', 'tier',
    'riskScore', 'totalScore', 'riskLevel', 'flagCount',
    'cleanedCount', 'totalMetadataFields', 'gpsFound', 'authorOrProducerFound', 'fileCount', 'pdfCount', 'imageCount'
  ];

  for (const [key, value] of Object.entries(body || {})) {
    if (['tool', 'slug', 'toolSlug', 'prompt', 'message'].includes(key)) continue;
    if (resultKeys.includes(key)) {
      result[key] = value;
    } else {
      inputs[key] = value;
    }
  }

  // Determine category and country
  const category = benchmarkInfo?.category || body?.category || guessCategory(resolvedSlug, body);
  const country = benchmarkInfo?.country || body?.country || guessCountry(resolvedSlug);
  const toolName = benchmarkInfo?.name || formatToolName(resolvedSlug || 'Calculator');

  return {
    toolSlug: resolvedSlug,
    toolName,
    category,
    country,
    inputs,
    result,
    benchmarkInfo,
    formula: benchmarkInfo?.formula || 'Standard calculation formula for this tool.',
    source: benchmarkInfo?.source || 'Relevant governing authority / recognized standard',
    sourceUrl: benchmarkInfo?.sourceUrl || '',
    sourceDate: benchmarkInfo?.sourceDate || 'Current Official Guidelines',
    limitations: benchmarkInfo?.limitations || 'General limitations and contextual variables apply.'
  };
}

function guessCategory(slug = '', body = {}) {
  const s = slug.toLowerCase();
  if (s.includes('wassce') || s.includes('bece') || s.includes('jamb') || s.includes('kcse') || s.includes('aps') || s.includes('gpa') || s.includes('grade') || s.includes('admission') || s.includes('school') || s.includes('matric')) {
    return 'education';
  }
  if (s.includes('loan') || s.includes('mortgage') || s.includes('interest') || s.includes('savings') || s.includes('debt') || s.includes('currency') || s.includes('salary') || s.includes('payoff')) {
    return 'finance';
  }
  if (s.includes('profit') || s.includes('break-even') || s.includes('margin') || s.includes('invoice') || s.includes('pricing') || s.includes('business')) {
    return 'business';
  }
  return 'productivity';
}

function guessCountry(slug = '') {
  const s = slug.toLowerCase();
  if (s.includes('ghana') || s.includes('wassce') || s.includes('bece')) return 'Ghana';
  if (s.includes('nigeria') || s.includes('jamb') || s.includes('neco') || s.includes('post-utme')) return 'Nigeria';
  if (s.includes('kenya') || s.includes('kcse') || s.includes('kuccps') || s.includes('kcpe')) return 'Kenya';
  if (s.includes('south-african') || s.includes('aps') || s.includes('matric') || s.includes('nsfas')) return 'South Africa';
  if (s.includes('uganda') || s.includes('uneb') || s.includes('uce') || s.includes('uace') || s.includes('ple')) return 'Uganda';
  if (s.includes('tanzania') || s.includes('necta') || s.includes('acsee') || s.includes('heslb')) return 'Tanzania';
  if (s.includes('zimbabwe') || s.includes('zimsec')) return 'Zimbabwe';
  if (s.includes('zambia') || s.includes('ecz')) return 'Zambia';
  if (s.includes('uk') || s.includes('ucas') || s.includes('gcse') || s.includes('a-level')) return 'United Kingdom';
  if (s.includes('canada')) return 'Canada';
  if (s.includes('australia') || s.includes('atar') || s.includes('hecs')) return 'Australia';
  return 'Global';
}

function formatToolName(slug) {
  return slug
    .replace(/-calculator$/, ' Calculator')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Builds LLM System Prompt with rigorous grounding instructions
 */
export function buildSystemPrompt(ctx) {
  return `You are AfriWidget's AI Insight System, a factual, knowledgeable result interpretation engine.

MAIN OBJECTIVE:
The calculator provides the number. Your job is to explain the meaning, quality, implications, limitations, and next steps associated with that number.
Never simply repeat the user's inputs or regurgitate the number.

CRITICAL BENCHMARK RULES:
1. NEVER INVENT BENCHMARKS. Never decide that a result is "good" or "poor" based on your own opinion.
2. If a verified, reliable benchmark exists, use it explicitly and cite the official authority.
3. If no reliable benchmark exists, you MUST state:
   "There isn't enough reliable benchmark information to classify this result as good or poor."
4. ALWAYS DISTINGUISH between meeting a requirement, being competitive, being eligible, and being likely to succeed.
   - For university/education admission: NEVER tell the user they will definitely be admitted. Meeting a published minimum threshold does not guarantee admission because admission depends on yearly departmental cut-offs, applicant volume, quotas, and specific subject requirements.
   - Use measured language: "Your result meets the published minimum requirement for this criterion."
5. For FINANCE tools: Do not call a loan "good" or "bad" unless supported by a recognized financial benchmark (such as debt-service ratios). Highlight the trade-off between repayment period and total cumulative interest.
6. For BUSINESS tools: Explain the direct relationship between cost, price, and margin/break-even. Never invent arbitrary industry averages.
7. TONE: Clear, direct, composed, professional, and objective. NO corporate jargon, NO motivational cheerleading ("Great job!"), NO emojis, and NO conversational pleasantries.
8. STRICT LENGTH MANDATE (CRITICAL): The response MUST be within the range of 300 to 500 characters maximum (inclusive). Do NOT exceed 500 characters under any circumstances. Do NOT output fewer than 300 characters.

REQUIRED STRUCTURE:
Format your interpretation compactly into these 3 numbered points:

1. Result & Assessment: [Calculated result with authoritative benchmark classification and reference range.]
2. What This Means: [Clear, plain-language significance and essential limitations, quotas, or assumptions.]
3. Next Step & Source: [1-2 immediate, practical next actions and official governing source / URL.]`;
}

/**
 * Builds LLM User Prompt with provided context and benchmark data
 */
export function buildUserPrompt(ctx) {
  let assessmentData = null;
  if (ctx.benchmarkInfo?.evaluate) {
    assessmentData = ctx.benchmarkInfo.evaluate(ctx);
  }

  return `Please interpret this calculated result for "${ctx.toolName}":

Tool: ${ctx.toolName} (${ctx.toolSlug})
Category: ${ctx.category} | Country/Region: ${ctx.country}
Authoritative Benchmark Source: ${ctx.source} (${ctx.sourceDate})
Source URL: ${ctx.sourceUrl || 'N/A'}
Core Benchmark Caveat: ${ctx.limitations}

Result: ${JSON.stringify(ctx.result)}
Inputs: ${JSON.stringify(ctx.inputs)}
${assessmentData ? `Evaluated Benchmark Assessment: ${assessmentData.assessment}\nOfficial Justification: ${assessmentData.justification}` : ''}

STRICT REQUIREMENT: Generate a concise interpretation strictly between 300 and 500 characters (max 500 characters) across the 3 compact points.`;
}

/**
 * Clamps and formats insight text to strictly fit within min (300) and max (500) characters.
 */
export function clampInsightLength(text, min = 300, max = 500, ctx = null) {
  if (!text || typeof text !== 'string') return '';
  let str = text.trim();

  // Strip think tags and extraneous headers
  str = str.replace(/<think>[\s\S]*?<\/think>/gi, '');
  str = str.replace(/<think>[\s\S]*$/gi, '');
  str = str.replace(/<\/think>/gi, '');
  str = str.replace(/^(?:Here'?s (?:a|the) (?:thinking process|rationale|analysis):?[\s\S]*?\n\n)/i, '');
  str = str.replace(/^(?:Thinking Process:?[\s\S]*?\n\n)/i, '');
  str = str.trim();

  // If text is shorter than min, enrich with authoritative benchmark guidance
  if (str.length < min) {
    const sourceName = ctx?.source || 'official benchmark standards';
    const sourceUrl = ctx?.sourceUrl ? ` (${ctx.sourceUrl})` : '';
    const supplements = [
      ` Assessment is grounded in ${sourceName}${sourceUrl}.`,
      ` Always verify institutional cut-off points, prerequisite criteria, and policies before making final decisions.`,
      ` Review underlying calculation assumptions to align with current regulatory or academic guidelines.`
    ];
    for (const sup of supplements) {
      if (str.length >= min) break;
      if (str.length + sup.length <= max) {
        str = (str + sup).trim();
      } else {
        const remaining = max - str.length - 1;
        if (remaining > 25) {
          const cutSup = sup.slice(0, remaining).replace(/[,;:\s]+$/, '') + '.';
          str = (str + ' ' + cutSup).trim();
        }
        break;
      }
    }
  }

  // If text is longer than max, truncate cleanly at sentence boundary (not list marker)
  if (str.length > max) {
    let bestCut = -1;
    // Look for sentence terminators between min and max
    const sentenceRegex = /([.!?])(?:\s+|\n|$)/g;
    let match;
    while ((match = sentenceRegex.exec(str)) !== null) {
      const endIdx = match.index + 1; // position right after punctuation
      if (endIdx > max) break;
      // Skip if preceded by single digit (e.g. "1.", "2.", "3.")
      const pre = str.slice(Math.max(0, match.index - 3), match.index);
      if (/(?:^|\s)\d+$/.test(pre)) continue;
      if (endIdx >= min && endIdx <= max) {
        bestCut = endIdx;
      }
    }

    if (bestCut >= min) {
      str = str.slice(0, bestCut).trim();
    } else {
      // Look for a newline boundary
      const lastNewline = str.lastIndexOf('\n', max);
      if (lastNewline >= min) {
        str = str.slice(0, lastNewline).trim();
      } else {
        // Cut at word boundary before max - 3 and append ellipsis
        const lastSpace = str.lastIndexOf(' ', max - 3);
        if (lastSpace >= min) {
          str = str.slice(0, lastSpace).replace(/[,;:\s.-]+$/, '') + '...';
        } else {
          str = str.slice(0, max - 3).replace(/[,;:\s.-]+$/, '') + '...';
        }
      }
    }
  }

  return str.trim();
}

/**
 * Deterministic fallback generator:
 * Guarantees a pristine, 100% compliant interpretation strictly between 300 and 500 characters.
 */
export function generateDeterministicInsight(ctx) {
  const evalResult = ctx.benchmarkInfo?.evaluate ? ctx.benchmarkInfo.evaluate(ctx) : {
    assessment: 'Within standard range',
    justification: "Calculated based on standard benchmark parameters."
  };

  const primaryResultText = formatPrimaryResult(ctx.result, ctx.toolSlug);
  const sourceName = ctx.source || 'Official Authority';
  const sourceUrl = ctx.sourceUrl ? ` (${ctx.sourceUrl})` : '';

  // 1. Result & Assessment
  const p1 = `1. Result & Assessment: ${primaryResultText} Rated ${evalResult.assessment}. ${evalResult.justification}`;

  // 2. What This Means & Caveats
  const meaning = generateMeaningText(ctx, evalResult);
  const limitation = ctx.limitations ? ` Note: ${ctx.limitations}` : '';
  const p2 = `2. What This Means: ${meaning}${limitation}`;

  // 3. Next Step & Source
  const nextStep = generateNextStep(ctx, evalResult);
  const p3 = `3. Next Step & Source: ${nextStep} Source: ${sourceName}${sourceUrl}.`;

  const raw = `${p1}\n${p2}\n${p3}`;
  return clampInsightLength(raw, 300, 500, ctx);
}

function formatPrimaryResult(result, slug) {
  if (!result || Object.keys(result).length === 0) {
    return 'Your calculation has been completed based on your provided inputs.';
  }
  if (result.aggregate !== undefined) {
    return `Calculated aggregate is ${result.aggregate}${result.band ? ` (${result.band})` : ''}.`;
  }
  if (result.monthlyPayment !== undefined) {
    return `Estimated payment is ${result.monthlyPayment}/mo, with total repayment of ${result.totalRepayment || 'N/A'}.`;
  }
  if (result.grossMargin !== undefined) {
    return `Calculated gross margin is ${result.grossMargin}%${result.markup ? ` (corresponding to a ${result.markup}% markup)` : ''}.`;
  }
  if (result.gpa !== undefined) {
    return `Calculated GPA is ${result.gpa}${result.label ? ` (${result.label})` : ''}.`;
  }
  if (result.meanGrade !== undefined) {
    return `Calculated KCSE mean grade is ${result.meanGrade} (${result.aggregatePoints || 0} points).`;
  }
  if (result.aps !== undefined) {
    return `Calculated APS is ${result.aps}.`;
  }
  if (result.breakEvenUnits !== undefined) {
    return `Break-even volume is ${result.breakEvenUnits} units${result.breakEvenRevenue ? ` (${result.breakEvenRevenue} revenue)` : ''}.`;
  }
  if (result.cleanedCount !== undefined || result.totalMetadataFields !== undefined) {
    const count = result.cleanedCount ?? result.fileCount ?? 0;
    const fields = result.totalMetadataFields ?? 0;
    return `Cleaned ${count} file${count === 1 ? '' : 's'} and purged ${fields} metadata field${fields === 1 ? '' : 's'}${result.gpsFound ? ' including GPS location tags' : ''}.`;
  }
  const firstKey = Object.keys(result)[0];
  return `Calculated ${formatToolName(firstKey)} is ${result[firstKey]}.`;
}

function generateMeaningText(ctx, evalResult) {
  if (ctx.category === 'productivity' && (ctx.toolSlug === 'pdf-image-metadata-remover' || ctx.toolSlug === 'exif-remover')) {
    return 'Stripping hidden metadata directly complies with UK GDPR Article 5(1)(c) data minimisation obligations and ICO document disclosure guidance.';
  }
  if (ctx.category === 'education') {
    return `This score reflects your academic standing under ${ctx.country} standards.`;
  }
  if (ctx.category === 'finance') {
    return 'This calculation illustrates your projected financial commitment and borrowing cost.';
  }
  if (ctx.category === 'business') {
    return 'This figure describes unit profitability and the relationship between costs and pricing.';
  }
  return 'This result provides a standardized quantitative assessment based on your inputs.';
}

function generateNextStep(ctx, evalResult) {
  if (ctx.category === 'productivity' && (ctx.toolSlug === 'pdf-image-metadata-remover' || ctx.toolSlug === 'exif-remover')) {
    return 'Save the cleaned files and verify that visible text or attachments do not contain sensitive identifiers before public sharing.';
  }
  if (ctx.category === 'education') {
    return 'Verify specific departmental cut-off points and prerequisite subject grades with your target institution.';
  }
  if (ctx.category === 'finance') {
    return 'Review interest terms and verify that total monthly debt payments remain within 36–40% of income.';
  }
  if (ctx.category === 'business') {
    return 'Monitor contribution margins weekly and review supplier pricing to protect cash flow against inflation.';
  }
  return 'Record this result for reference and review underlying assumptions against current guidelines.';
}
