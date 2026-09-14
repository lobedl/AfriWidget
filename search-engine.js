/**
 * AfriWidget Unified Search Engine
 * - 100% Client-Side & Ultra-High Performance (<1ms search time)
 * - Comprehensive index of all 120+ tools on AfriWidget
 * - Typo tolerance via Damerau-Levenshtein edit distance
 * - Word-order independent token matching & intent awareness
 * - Autocomplete dropdown with highlighted text, category badges, & keyboard navigation
 * - Closest matching tools fallback when no exact match is found
 * - Global Ctrl+K / Cmd+K search shortcut across all pages
 * - Zero external dependencies, mobile-responsive, accessible
 */
(function() {
  'use strict';

  // 1. CANONICAL DATABASE OF ALL AFRIWIDGET TOOLS (Deduplicated)
  const AFRIWIDGET_TOOLS = [{"slug":"acsee-points-calculator","name":"ACSEE Points & Division Calculator","shortName":"ACSEE Points Calculator","description":"Calculate your Tanzania NECTA Form 6 (ACSEE) points, Division standing (I, II, III, IV, 0), Principal Passes count, and TCU undergraduate degree eligibility.","category":"Education","url":"/acsee-points-calculator","keywords":["acsee points calculator","education","acsee","points","calculator","necta","form","six","tanzania","advanced","level","principal","passes","tcu","admission","combinations","pcm","pcb","hgl","hge","3 principals","form 6 points","tcu entry"]},{"slug":"ai-business-name-generator","name":"AI Business Name Generator","shortName":"AI Business Name Generator","description":"Discover creative, memorable business name ideas and brand names with AI. Generate catchy startup names across tech, retail, consulting, and commerce.","category":"Finance","url":"/ai-business-name-generator","keywords":["ai business name generator","education","business","company","brand","name","generator","industry","audience","style","startup"]},{"slug":"ai-gig-description-generator","name":"AI Gig Description Generator","shortName":"AI Gig Description Generator","description":"Create high-converting freelance gig descriptions for Fiverr and Upwork with AI. Highlight your skills, deliverables, and packages to win clients.","category":"Finance","url":"/ai-gig-description-generator","keywords":["ai gig description generator","education","freelance","gig","service","description","generator","fiverr","upwork","deliverables","buyer","niche"]},{"slug":"ai-paraphrasing-tool","name":"AI Paraphrasing Tool","shortName":"AI Paraphrasing Tool","description":"Rewrite sentences, essays, and articles with our free AI paraphrasing tool. Enhance clarity, fix tone, and improve vocabulary with zero signup and 100% privacy.","category":"Finance","url":"/ai-paraphrasing-tool","keywords":["ai paraphrasing tool","education","paraphrasing","tool","rewrite","text","sentence","paragraph","clarity","tone","reading","level"]},{"slug":"ai-product-description-generator","name":"AI Product Description Generator","shortName":"AI Product Description Generator","description":"Generate persuasive e-commerce product descriptions for Shopify, Amazon, and Etsy with AI. Highlight features and benefits that drive sales conversions.","category":"Finance","url":"/ai-product-description-generator","keywords":["ai product description generator","education","product","description","generator","ecommerce","shop","marketplace","copy","features","benefits"]},{"slug":"ai-text-summarizer","name":"AI Text Summarizer","shortName":"AI Text Summarizer","description":"Condense long articles, research papers, essays, and meeting notes into concise summaries or bullet points with our free, private in-browser AI summarizer.","category":"Finance","url":"/ai-text-summarizer","keywords":["ai text summarizer","education","text","summarizer","articles","reports","notes","key","points","briefing","action","items"]},{"slug":"atar-calculator","name":"ATAR Calculator Australia","shortName":"ATAR Calculator (Australia)","description":"Calculate your estimated Australian Tertiary Admission Rank (ATAR) for NSW HSC, VIC VCE, QLD QCE, WA WACE, and SA SACE. Includes subject scaling, aggregate breakdowns, and university cutoffs.","category":"Education","url":"/atar-calculator","keywords":["atar calculator","education","atar","calculator","australia","uac","vtac","qtac","sace","wace","scaled","aggregate","distribution","ranking","atar 0-99.95","state scaling","aggregates"]},{"slug":"australia-scholarship-finder","name":"Australia Scholarship Finder & Eligibility Search","shortName":"Australia Scholarship Finder","description":"Find and calculate Australian university scholarships, merit grants, equity bursaries, Tertiary Access Payments (TAP), and Women in STEM funding based on your ATAR and background.","category":"Education","url":"/australia-scholarship-finder","keywords":["australia scholarship finder","education","australia","scholarship","finder","tertiary","access","payment","tap","university","merit","awards","equity","bursaries","women","stem","unimelb","usyd","unsw","monash","uac","vtac","qtac","grants","merit grants","tap $5k","women in stem","merit & equity","tap relocation"]},{"slug":"base64-encoder-decoder","name":"Base64 Encoder & Decoder","shortName":"Base64 Encoder & Decoder","description":"Encode text and files to Base64 or decode Base64 strings back to plain text instantly in your browser. 100% private, client-side data handling.","category":"Tech","url":"/base64-encoder-decoder","keywords":["base64 encoder decoder","education","base64","encoder","decoder","unicode","bytes","api","developer"]},{"slug":"bece-aggregate-calculator","name":"BECE Aggregate Calculator","shortName":"BECE Aggregate Calculator","description":"Calculate Ghanaian BECE aggregate scores from core and elective subject grades (1-9) for CSSPS Senior High School (SHS) placement.","category":"Education","url":"/bece-aggregate-calculator","keywords":["bece aggregate calculator","education","bece","aggregate","basic","certificate","ghana","best 2 optional","scale 6–54","calculator"]},{"slug":"bece-cssps-placement-estimator","name":"BECE CSSPS School Placement Estimator","shortName":"BECE CSSPS Placement Estimator","description":"Estimate Senior High School (SHS) Category A, B, and C placement chances in Ghana using your BECE aggregate score. Free CSSPS placement planning tool.","category":"Education","url":"/bece-cssps-placement-estimator","keywords":["bece cssps placement estimator","education","bece","cssps","placement","estimator","school","ghana"]},{"slug":"bmi-calculator","name":"BMI, BMR & TDEE Calculator","shortName":"BMI / BMR / TDEE Calculator","description":"Calculate Body Mass Index (BMI), BMI Prime, BMR (Mifflin-St Jeor), TDEE, and healthy weight ranges for adults using metric and imperial units. 100% private.","category":"Health","url":"/bmi-calculator","keywords":["bmi calculator","education","bmi","bmr","tdee","body","mass","index","health","calculator"]},{"slug":"body-fat-calculator","name":"Body Fat Calculator","shortName":"Body Fat Calculator","description":"Estimate your body fat percentage using the US Navy tape measurement method based on waist, neck, hip, and height measurements. Free & private.","category":"Health","url":"/body-fat-calculator","keywords":["body fat calculator","education","body","fat","percentage","navy","circumference","waist","neck","hips","health","composition","body composition","calculator"]},{"slug":"break-even-calculator","name":"Break-Even Point Calculator","shortName":"Break-Even Calculator","description":"Calculate your business break-even point in units and sales revenue based on fixed costs, variable costs per unit, and unit selling price.","category":"Finance","url":"/break-even-calculator","keywords":["break even calculator","education","break","even","calculator","volume","sales","revenue","contribution","margin","ratio","target","profit","fixed","costs","break-even volume","margin %"]},{"slug":"calorie-burn-calculator","name":"Calorie Burn Calculator","shortName":"Calorie Burn Calculator","description":"Calculate calories burned during physical activities, running, cycling, swimming, and strength training using metabolic equivalent (MET) values.","category":"Health","url":"/calorie-burn-calculator","keywords":["calorie burn calculator","education","calorie","burn","exercise","activity","met","walking","running","cycling","sports","energy","calculator"]},{"slug":"canada-gpa-calculator","name":"Canada University GPA Calculator","shortName":"Canada GPA Calculator","description":"Calculate your Canadian university GPA and CGPA across OMSAS 4.0, UBC/SFU 4.33, York 9.0, McMaster 12.0, and percentage scales. Free, instant, and private.","category":"Education","url":"/canada-gpa-calculator","keywords":["canada gpa calculator","education","canada","gpa","calculator","university","omsas","4.0","ubc","mcgill","4.33","york","9.0","mcmaster","12.0","semester","cgpa","credit","hours","honours","standing","letter","grade","convert","omsas 4.0","4.33 scale","york 9.0"]},{"slug":"canada-student-loan-repayment-calculator","name":"Canada Student Loan Repayment Calculator","shortName":"Canada Student Loan Repayment","description":"Calculate your Canada Student Loan (CSLP), OSAP, and StudentAid BC monthly payments with permanent 0% federal interest and RAP zero-payment relief rules.","category":"Education","url":"/canada-student-loan-repayment-calculator","keywords":["canada student loan repayment calculator","education","canada","student","loan","repayment","calculator","cslp","csfa","osap","ontario","studentaid","alberta","aid","permanent","federal","interest","rap","assistance","plan","monthly","payment","0% federal rate","rap relief","osap / bc / ab"]},{"slug":"canada-study-planner","name":"Canada Study Planner & Timetable Generator","shortName":"Canada Study Planner","description":"Generate a customized, spaced-repetition study schedule for Canadian High School (Grade 11/12 OSSD, BC Dogwood, Alberta 30-level), CEGEP, and University terms.","category":"Education","url":"/canada-study-planner","keywords":["canada study planner","education","canada","study","planner","timetable","generator","exam","revision","spaced","repetition","pomodoro","high","school","ossd","dogwood","alberta","cegep","university","semester","schedule","spaced repetition","pomodoro blocks","exam countdown"]},{"slug":"canada-university-admission-chance-calculator","name":"Canada University Admission Chance Calculator","shortName":"Canada Admission Calculator","description":"Calculate your admission chances for top Canadian universities including UofT, UBC, McGill, Waterloo, and McMaster. Evaluates Top 6 averages and AIF ratings.","category":"Education","url":"/canada-university-admission-chance-calculator","keywords":["canada university admission chance calculator","education","canada","university","admission","chance","calculator","top","grade","average","ubc","waterloo","mcgill","mcmaster","queens","high","school","adjustment","factor","aif","video","interview","competitiveness","top 6 average","adjustment factor","u of t / ubc / uw"]},{"slug":"compound-interest","name":"Compound Interest Calculator","shortName":"Compound Interest Calculator","description":"Calculate compound interest growth on investments and savings. Model regular monthly deposits, annual interest rates, and multi-year compounding periods.","category":"Finance","url":"/compound-interest","keywords":["compound interest","education","compound","interest","investment","savings","growth","roi"]},{"slug":"currency-converter","name":"Real-Time AI Currency Converter","shortName":"Real-Time Currency Converter","description":"Convert live exchange rates across USD, EUR, GBP, NGN, KES, ZAR, GHS, and global currencies with instant in-browser rate calculation.","category":"Finance","url":"/currency-converter","keywords":["currency converter","education","currency","converter","exchange","rates","african","global","currencies","real","time"]},{"slug":"daily-calorie-needs-calculator","name":"Daily Calorie Needs Calculator","shortName":"Daily Calorie Needs Calculator","description":"Calculate your daily calorie needs for weight maintenance, healthy fat loss, or muscle gain based on BMR, age, gender, and activity level.","category":"Health","url":"/daily-calorie-needs-calculator","keywords":["daily calorie needs calculator","education","daily","calorie","needs","maintenance","calories","bmr","tdee","energy","nutrition","energy needs","calculator"]},{"slug":"data-file-unit-converter","name":"Data & File Unit Converter","shortName":"Data & File Unit Converter","description":"Convert digital storage and file size units across Bits, Bytes, KB, MB, GB, TB, and PB in binary (1024) and decimal (1000) standards.","category":"Tech","url":"/data-file-unit-converter","keywords":["data file unit converter","education","data","file","storage","bytes","bits","gigabyte","megabyte","binary","converter","unit"]},{"slug":"debt-payoff-calculator","name":"Debt Payoff Calculator","shortName":"Debt Payoff Calculator","description":"Compare Debt Avalanche vs. Debt Snowball strategies. Calculate debt payoff dates, total interest saved, and build a monthly debt-free repayment plan.","category":"Finance","url":"/debt-payoff-calculator","keywords":["debt payoff calculator","education","debt","payoff","calculator","snowball","avalanche","interest","repayment","date","interest saved"]},{"slug":"form-four-gpa-calculator","name":"Form Four GPA & Division Calculator","shortName":"Form Four GPA Calculator","description":"Calculate your Tanzania NECTA Form Four CSEE GPA, Best 7 aggregate points, Division standing (I, II, III, IV, 0), and Form 5 A-Level combination eligibility.","category":"Education","url":"/form-four-gpa-calculator","keywords":["form four gpa calculator","education","form","four","gpa","calculator","csee","necta","tanzania","level","division","best","subjects","certificate","pass","best 7 subjects","division i-iv","csee gpa"]},{"slug":"freelance-rate-calculator","name":"Freelance Rate Calculator","shortName":"Freelance Rate Calculator","description":"Determine your freelance hourly and daily billing rate to cover taxes, business overhead, billable hours, and desired annual income.","category":"Finance","url":"/freelance-rate-calculator","keywords":["freelance rate calculator","education","freelance","rate","calculator","hourly","day","retainer","project","pricing","tax","billable","hours","hourly rate","day rate"]},{"slug":"germany-abitur-grade-calculator","name":"Germany Abitur Grade Calculator","shortName":"Germany Abitur Grade Calculator","description":"Calculate your German Abitur grade (Abiturnote 1.0 to 4.0) from total points (300 to 900) across Block I coursework and Block II Abiturprüfungen with KMK standards.","category":"Education","url":"/germany-abitur-grade-calculator","keywords":["germany abitur grade calculator","education","germany","abitur","grade","calculator","abiturnote","rechner","kmk","points","900","300","600","oberstufe","gpa","ects","kmk formula","1.0–4.0 scale"]},{"slug":"germany-gpa-converter","name":"Germany GPA Converter","shortName":"Germany GPA Converter","description":"Convert your US, UK, Indian, Nigerian, or international GPA to the German 1.0–4.0 grading scale using the official Modified Bavarian Formula (Bayerische Formel).","category":"Education","url":"/germany-gpa-converter","keywords":["germany gpa converter","education","germany","gpa","converter","modified","bavarian","formula","bayerische","formel","uni-assist","daad","4.0","india","cgpa","nigeria","5.0","bavarian formula"]},{"slug":"germany-university-admission-checker","name":"Germany University Admission Checker","shortName":"Germany University Admission","description":"Check your admission chances for German universities across Medicine, Law, CS, Psychology & Business. Calculate TMS bonus, AdH scores, and NC quotas.","category":"Education","url":"/germany-university-admission-checker","keywords":["germany university admission checker","education","germany","university","admission","checker","numerus","clausus","hochschulstart","dosv","tms","medicine","law","business","verfahrensnote","nc cut-offs"]},{"slug":"ghana-nursing-training-admission-calculator","name":"Ghana Nursing Training Admission Calculator","shortName":"Ghana Nursing Admission","description":"Calculate your Ghana Nursing and Midwifery Training College (NMTC) admission aggregate, check Ministry of Health (MoH) cut-offs, and verify RGN, RM, CHN, and NAC eligibility.","category":"Education","url":"/ghana-nursing-training-admission-calculator","keywords":["ghana nursing training admission calculator","education","ghana","nursing","training","admission","calculator","moh","nmtc","cut","off","aggregate","rgn","midwifery","chn","nac","nap","korle","kumasi","cape","coast","wassce","moh aggregate","diploma & cert"]},{"slug":"ghana-university-gpa-calculator","name":"Ghana University GPA & CWA Calculator","shortName":"Ghana University GPA & CWA","description":"Calculate your Semester GPA, Cumulative CGPA (4.0 scale), or CWA percentage for Ghanaian universities including UG Legon, KNUST, UCC, UPSA, and UDS. Free transcript planner.","category":"Education","url":"/ghana-university-gpa-calculator","keywords":["ghana university gpa calculator","education","ghana","university","gpa","calculator","cwa","legon","knust","ucc","upsa","uds","first","class","second","upper","4.0","scale","credit","hours","4.0 gpa & cwa","degree class"]},{"slug":"gpa-calculator","name":"Cumulative GPA Calculator","shortName":"Cumulative GPA Calculator","description":"Free cumulative GPA calculator for college and university students. Calculate weighted GPA on a 4.0 scale with credit hours and letter grade points.","category":"Education","url":"/gpa-calculator","keywords":["gpa calculator","education","gpa","cumulative","grade","point","average","academic","credits","scholarships","calculator"]},{"slug":"healthy-weight-range-calculator","name":"Healthy Weight Range Calculator","shortName":"Healthy Weight Range Calculator","description":"Calculate your clinically healthy weight range based on WHO BMI standards and body frame size for both metric and imperial measurements.","category":"Health","url":"/healthy-weight-range-calculator","keywords":["healthy weight range calculator","education","healthy","weight","range","bmi","height","adult","reference","bmi range","calculator"]},{"slug":"hecs-help-repayment-calculator","name":"HECS-HELP Repayment Calculator Australia","shortName":"HECS-HELP Repayment Calculator","description":"Calculate your Australian HECS-HELP student loan compulsory repayments, weekly/fortnightly paycheck deductions, CPI/WPI indexation, and multi-year payoff timeline under official ATO thresholds.","category":"Education","url":"/hecs-help-repayment-calculator","keywords":["hecs help repayment calculator","education","hecs","help","repayment","calculator","australia","ato","studyassist","compulsory","threshold","indexation","student","loan","payg","withholding","voluntary","payments","cpi","wpi","cap","ato brackets","indexation cap","paycheck payg"]},{"slug":"hourly-to-salary","name":"Hourly Rate to Annual Salary Converter","shortName":"Hourly to Salary Converter","description":"Convert hourly pay rates to annual salary, monthly, biweekly, and weekly gross income based on working hours per week and paid weeks per year.","category":"Finance","url":"/hourly-to-salary","keywords":["hourly to salary","education","hourly","salary","annual","income","freelance","rate"]},{"slug":"html-minifier","name":"HTML Minifier","shortName":"HTML Minifier","description":"Minify HTML code online by stripping unnecessary whitespace, comments, and empty lines to optimize website page load speed.","category":"Tech","url":"/html-minifier","keywords":["html minifier","education","html","minifier","minify","whitespace","comments","optimize","code"]},{"slug":"hydration-reminder-calculator","name":"Hydration Reminder Calculator","shortName":"Hydration Reminder Calculator","description":"Calculate your hourly hydration schedule and water intake reminders based on daily water targets, waking hours, and workout frequency.","category":"Health","url":"/hydration-reminder-calculator","keywords":["hydration reminder calculator","education","hydration","reminder","water","schedule","drinking","wake","bedtime","interval","calculator"]},{"slug":"icass-calculator","name":"ICASS Score Calculator for TVET Students","shortName":"ICASS Calculator","description":"Calculate weighted Internal Continuous Assessment (ICASS) scores for South Africa TVET college courses (N1–N6 and NC(V)). Free, instant, and private in-browser tool.","category":"Education","url":"/icass-calculator","keywords":["icass calculator","education","icass","calculator","tvet","south","africa","internal","continuous","assessment"]},{"slug":"ideal-weight-calculator","name":"Ideal Weight Calculator","shortName":"Ideal Weight Calculator","description":"Calculate your ideal body weight using Devine, Robinson, Miller, and Hamwi formulas based on your height, gender, and frame size.","category":"Health","url":"/ideal-weight-calculator","keywords":["ideal weight calculator","education","ideal","weight","healthy","range","devine","robinson","miller","hamwi","height","weight range","calculator"]},{"slug":"igcse-alevel-gpa-converter","name":"IGCSE & A-Level GPA Converter","shortName":"IGCSE / A-Level GPA Converter","description":"Convert Cambridge IGCSE, O-Level, and A-Level examination grades to standard US 4.0 GPA values for college and university admissions.","category":"Education","url":"/igcse-alevel-gpa-converter","keywords":["igcse alevel gpa converter","education","igcse","level","gpa","converter","international","alevel"]},{"slug":"image-resizer-webp-converter","name":"Image Resizer & WebP Converter","shortName":"Image Resizer & WebP Converter","description":"Resize images and convert JPG, PNG, and GIF files to modern, compressed WebP format in your browser with zero quality loss and no server uploads.","category":"Tech","url":"/image-resizer-webp-converter","keywords":["image resizer webp converter","education","image","resizer","webp","converter","canvas","compress"]},{"slug":"invoice-receipt-generator","name":"Free Invoice & Receipt Generator","shortName":"Invoice & Receipt PDF Generator","description":"Create and download clean, professional sales receipts and invoices for customers and clients. Add tax rates, discounts, and payment terms.","category":"Business","url":"/invoice-receipt-generator","keywords":["invoice receipt generator","education","invoice","receipt","pdf","generator","business","tax"]},{"slug":"jamb-admission-chance-checker","name":"JAMB Admission Chance Checker","shortName":"JAMB Admission Chance","description":"Check your admission probability into Nigerian Federal, State, and Private universities based on JAMB UTME score, O","category":"Education","url":"/jamb-admission-chance-checker","keywords":["jamb admission chance checker","education","jamb","admission","chance","checker","probability","university","quota","merit","catchment","elds","caps","nigerian","cutoffs"]},{"slug":"jamb-score-calculator","name":"JAMB Score Calculator","shortName":"JAMB Score Calculator","description":"Calculate your official JAMB UTME score out of 400 across 4 subjects. Free Nigerian university cutoff simulator, target planner, and performance breakdown.","category":"Education","url":"/jamb-score-calculator","keywords":["jamb score calculator","education","jamb","score","calculator","utme","nigeria","university","admission","cut","off","post","unilorin","unilag","abu","oau","unn"]},{"slug":"jamb-utme-aggregate-calculator","name":"JAMB UTME Aggregate Calculator","shortName":"JAMB UTME Aggregate Calculator","description":"Calculate Nigerian university admission screening aggregate points from JAMB UTME scores and WAEC / NECO O’Level grades. Free Post-UTME screening calculator.","category":"Education","url":"/jamb-utme-aggregate-calculator","keywords":["jamb utme aggregate calculator","education","jamb","utme","aggregate","nigeria","level","admission","calculator"]},{"slug":"json-formatter-validator","name":"JSON Formatter & Validator","shortName":"JSON Formatter & Validator","description":"Format, validate, prettify, and minify JSON data online with instant syntax highlighting and error detection. 100% private in-browser tool.","category":"Tech","url":"/json-formatter-validator","keywords":["json formatter validator","education","json","formatter","validator","minifier","developer","api","data","format","validate","minify"]},{"slug":"kcpe-performance-calculator","name":"KCPE Performance Calculator","shortName":"KCPE Performance Calculator","description":"Calculate your 5-subject KCPE total marks (out of 500), mean percentage, official KNEC letter grade, and secondary school category placement tier in Kenya.","category":"Education","url":"/kcpe-performance-calculator","keywords":["kcpe performance calculator","education","kcpe","performance","calculator","kenya","knec","primary","marks","500","mean","percentage","secondary","placement","national","extra","county","sub","500 marks","mean %","school placement"]},{"slug":"kcse-eligibility-tier-checker","name":"KCSE Eligibility Tier Checker","shortName":"KCSE Eligibility Tier Checker","description":"Map your Kenyan KCSE mean grade to higher education study pathways: Degree (C+ and above), Diploma, Certificate, or Artisan TVET programs.","category":"Education","url":"/kcse-eligibility-tier-checker","keywords":["kcse eligibility tier checker","education","kcse","eligibility","tier","checker","kenya"]},{"slug":"kcse-grade-calculator","name":"KCSE Grade Calculator","shortName":"KCSE Grade Calculator","description":"Calculate your 7-subject KCSE aggregate points (out of 84), official KNEC mean grade (A to E), average point score, and tertiary placement eligibility tier in Kenya.","category":"Education","url":"/kcse-grade-calculator","keywords":["kcse grade calculator","education","kcse","grade","calculator","kenya","knec","mean","subjects","844","cbc","points","scale","kuccps","7 subjects","84 points","mean grade"]},{"slug":"kcse-kuccps-cluster-calculator","name":"KCSE Grade & KUCCPS Cluster Calculator","shortName":"KCSE & KUCCPS Cluster Calculator","description":"Calculate seven-subject KCSE aggregate points, mean grade, and KUCCPS weighted cluster points for Kenyan university degree and diploma placement.","category":"Education","url":"/kcse-kuccps-cluster-calculator","keywords":["kcse kuccps cluster calculator","education","kcse","kuccps","cluster","kenya","aggregate","points","mean","grade","calculator"]},{"slug":"kenya-university-gpa-calculator","name":"Kenya University GPA Calculator","shortName":"Kenya University GPA Calculator","description":"Calculate your semester GPA, cumulative CGPA, quality points, and Degree Honours classification for Kenyan universities including UoN, KU, JKUAT, Strathmore, and USIU-Africa.","category":"Education","url":"/kenya-university-gpa-calculator","keywords":["kenya university gpa calculator","education","kenya","university","gpa","calculator","cue","4.0","5.0","cgpa","semester","quality","points","uon","jkuat","egerton","moi","first","class","honours","4.0 & 5.0 gpa","quality points","degree class"]},{"slug":"keyword-density-checker","name":"Keyword Density Checker","shortName":"Keyword Density Checker","description":"Analyze keyword frequency, one-word, two-word, and three-word phrase density to optimize web content for SEO without keyword stuffing.","category":"Tech","url":"/keyword-density-checker","keywords":["keyword density checker","education","keyword","density","checker","seo","content","word","phrase","frequency","percentage","writing"]},{"slug":"kuccps-cluster-points-calculator","name":"KUCCPS Cluster Points Calculator","shortName":"KUCCPS Cluster Points Calculator","description":"Calculate your official KUCCPS Weighted Cluster Points (out of 48) for Kenyan university degree courses including Medicine, Engineering, Law, Computer Science, and Nursing.","category":"Education","url":"/kuccps-cluster-points-calculator","keywords":["kuccps cluster points calculator","education","kuccps","cluster","points","calculator","kenya","weighted","wcp","raw","subject","aggregate","degree","admission","cut","off","wcp formula","4 key subjects","degree cut-offs"]},{"slug":"loan-calculator","name":"Loan Calculator","shortName":"Loan Calculator","description":"Calculate monthly personal, business, or auto loan payments with amortization schedules, total interest costs, and accelerated payoff comparisons.","category":"Finance","url":"/loan-calculator","keywords":["loan calculator","education","loan","calculator","repayment","monthly","payment","interest","amortization","borrowing"]},{"slug":"markdown-to-html-converter","name":"Markdown to HTML Converter","shortName":"Markdown to HTML Converter","description":"Convert Markdown text into clean, semantic HTML markup in real time with live side-by-side preview and one-click code copying. 100% private.","category":"Tech","url":"/markdown-to-html-converter","keywords":["markdown to html converter","education","markdown","html","converter","documentation","blog","readme"]},{"slug":"matric-sba-exam-calculator","name":"Matric SBA + Final Exam Pass Calculator","shortName":"Matric SBA + Exam Pass Calculator","description":"Calculate your final Matric marks from School-Based Assessment (25%) and Final Exam (75%) with official Bachelor","category":"Education","url":"/matric-sba-exam-calculator","keywords":["matric sba exam calculator","education","matric","sba","exam","pass","calculator","south","africa","nsc","aps","bachelor","diploma"]},{"slug":"meta-pixel-checker","name":"Meta Title & Description Pixel Checker","shortName":"Meta Title & Description Pixel Checker","description":"Preview and check Google SERP snippet title and meta description pixel widths to prevent search result truncation on desktop and mobile screens.","category":"Tech","url":"/meta-pixel-checker","keywords":["meta pixel checker","education","meta","title","description","pixel","checker","serp","google","truncation"]},{"slug":"mortgage-calculator","name":"Mortgage Payment Calculator","shortName":"Mortgage Calculator","description":"Calculate monthly mortgage payments (P&I), property taxes, homeowners insurance, and total interest over 15 or 30-year home loan terms.","category":"Finance","url":"/mortgage-calculator","keywords":["mortgage calculator","education","mortgage","home","loan","payment","interest","property","amortisation","calculator"]},{"slug":"new-zealand-ncea-credits-calculator","name":"New Zealand NCEA Credits & Rank Score Calculator","shortName":"NZ NCEA Credits Calculator","description":"Calculate your NCEA Level 1, 2, and 3 credits, Certificate & Course Endorsements (Merit / Excellence), University Entrance (UE) status, and NZ University Rank Score (0–320 points).","category":"Education","url":"/new-zealand-ncea-credits-calculator","keywords":["new zealand ncea credits calculator","education","new","zealand","ncea","credits","calculator","level","merit","excellence","endorsement","university","entrance","rank","score","320","points","nzqa","auckland","otago","victoria","canterbury","aut","level 1-3 credits","ue status","rank score (320)"]},{"slug":"new-zealand-student-loan-calculator","name":"New Zealand Student Loan & Repayment Calculator","shortName":"NZ Student Loan Calculator","description":"Calculate your New Zealand student loan repayments, 12% IRD paycheck deductions over the $24,128 threshold, StudyLink borrowing, 0% interest payoff timeline, and overseas interest.","category":"Finance","url":"/new-zealand-student-loan-calculator","keywords":["new zealand student loan calculator","education","new","zealand","student","loan","calculator","ird","inland","revenue","percent","repayment","threshold","24128","studylink","zero","interest","overseas","rates","payoff","timeline","fortnightly","deduction","12% ird rate","$24,128 threshold","0% nz interest"]},{"slug":"new-zealand-study-planner","name":"New Zealand Study Planner & Workload Timetable","shortName":"NZ Study Planner & Timetable","description":"Calculate your NZ university study workload (15 points = 150 hours), generate a weekly time-block timetable, and verify StudyLink 0.8 EFTS full-time compliance.","category":"Education","url":"/new-zealand-study-planner","keywords":["new zealand study planner","education","new","zealand","study","planner","efts","workload","timetable","nzqa","credit","hours","per","studylink","full","time","0.8","university","weekly","schedule","lectures","tutorials","labs","nzqa workload","studylink efts","weekly routine"]},{"slug":"nigerian-university-cgpa-calculator","name":"Nigerian University CGPA Calculator","shortName":"Nigerian University CGPA Calculator","description":"Calculate Nigerian university and polytechnic GPA/CGPA on the official NUC 5.0 CCMAS and NBTE 4.0 scales. Check degree honours classification, carryover impact, and target CGPA.","category":"Education","url":"/nigerian-university-cgpa-calculator","keywords":["nigerian university cgpa calculator","education","nigerian","university","cgpa","calculator","nuc","5.0","scale","nbte","4.0","first","class","honours","2:1","transcript","carryover","semester","gpa"]},{"slug":"norway-gpa-calculator","name":"Norway GPA Calculator","shortName":"Norway GPA Calculator","description":"Calculate your Norwegian university GPA (A–F scale), ECTS credit weighting, US 4.0 conversion, and Samordna opptak VGS admission points with science bonus points.","category":"Education","url":"/norway-gpa-calculator","keywords":["norway gpa calculator","education","norway","gpa","calculator","university","ects","credits","scale","pass","grade","master","degree","admission","samordna","opptak","skolepoeng","konkurransepoeng","vgs","uio","ntnu","uib","nhh","nmbu","a-f ects scale","master admission","samordna opptak"]},{"slug":"norway-study-planner","name":"Norway Study Planner","shortName":"Norway Study Planner","description":"Generate your weekly Norwegian university study timetable based on ECTS credits (30 ECTS = 40h/week), track mandatory assignments (arbeidskrav), and plan exam revision.","category":"Education","url":"/norway-study-planner","keywords":["norway study planner","education","norway","study","planner","ects","workload","timetable","generator","university","weekly","schedule","lectures","pensum","self","arbeidskrav","inspera","digital","exam","countdown","30 ects workload","inspera exams"]},{"slug":"nsfas-eligibility-checker","name":"NSFAS Eligibility Checker","shortName":"NSFAS Eligibility Checker","description":"Check your NSFAS bursary eligibility under the latest DHET guidelines. Verify SASSA status, household income caps, university or TVET funding, and the N+1 rule.","category":"Education","url":"/nsfas-eligibility-checker","keywords":["nsfas eligibility checker","education","nsfas","eligibility","checker","south","africa","bursary","sassa","missing","middle","loan","dhet","tvet","university"]},{"slug":"nsfas-tvet-allowance-calculator","name":"NSFAS TVET Allowance & Accommodation Estimator","shortName":"NSFAS TVET Allowance Estimator","description":"Estimate your South African NSFAS student allowance, monthly living stipend, accommodation cap, and travel allowances for TVET college students.","category":"Education","url":"/nsfas-tvet-allowance-calculator","keywords":["nsfas tvet allowance calculator","education","nsfas","tvet","allowance","estimator","financial","aid","accommodation","transport","personal","care","calculator"]},{"slug":"olevel-subject-combination-checker","name":"WAEC / NECO O’Level Subject Combination Checker","shortName":"WAEC / NECO Subject Checker","description":"Verify required O’Level subject combinations for university, polytechnic, and college courses across Medicine, Engineering, Law, and Sciences.","category":"Education","url":"/olevel-subject-combination-checker","keywords":["olevel subject combination checker","education","waec","neco","level","subject","combination","checker","olevel"]},{"slug":"ovulation-cycle-calculator","name":"Ovulation & Cycle Calculator","shortName":"Ovulation & Cycle Calculator","description":"Calculate your ovulation cycle, peak fertility dates, and next period forecast based on average menstrual cycle duration and luteal phase length.","category":"Health","url":"/ovulation-cycle-calculator","keywords":["ovulation cycle calculator","education","ovulation","cycle","fertile","window","period","calculator"]},{"slug":"password-generator","name":"Secure Password Generator","shortName":"Secure Password Generator","description":"Generate strong, secure, random passwords with custom length, symbols, numbers, and uppercase characters. 100% client-side security with zero logging.","category":"Education","url":"/password-generator","keywords":["password generator","education","crypto","private","password","generator"]},{"slug":"paypal-fee-calculator","name":"PayPal & Payment Processor Fee Calculator","shortName":"PayPal Fee Calculator","description":"PayPal & Payment Processor Fee Calculator tool on AfriWidget. Compute results instantly in your browser with zero signup required and 100% private execution.","category":"Finance","url":"/paypal-fee-calculator","keywords":["paypal fee calculator","education","paypal","fee","payment","processor","transaction","stripe","square","calculator"]},{"slug":"percentage-calculator","name":"Percentage Calculator","shortName":"Percentage Calculator","description":"Calculate percentage increase, percentage decrease, percentage change, and proportions with our versatile, easy-to-use online percentage calculator.","category":"Finance","url":"/percentage-calculator","keywords":["percentage calculator","education","percentage","discount","markup","change","everyday","discounts","calculator"]},{"slug":"ple-aggregate-calculator","name":"PLE Aggregate Calculator","shortName":"PLE Aggregate Calculator","description":"Calculate UNEB PLE aggregate scores and Senior 1 Division placement from English, Math, Science, and Social Studies (SST) Primary 7 grades.","category":"Education","url":"/ple-aggregate-calculator","keywords":["ple aggregate calculator","education","ple","aggregate","calculator","uneb","primary","leaving","examination","uganda","senior","division","four","subjects","4 subjects","divisions 1–4"]},{"slug":"post-utme-aggregate-calculator","name":"Post-UTME Aggregate Calculator","shortName":"Post-UTME Aggregate Calculator","description":"Calculate your Post-UTME admission screening aggregate for UNILAG, UI, UNIBEN, LASU, OAU, FUTO and Nigerian universities. Combine JAMB, Post-UTME CBT, and O","category":"Education","url":"/post-utme-aggregate-calculator","keywords":["post utme aggregate calculator","education","post","utme","aggregate","calculator","screening","formula","unilag","uniben","lasu","oau","futo","jamb","cbt","level","points","nigeria"]},{"slug":"pricing-calculator","name":"Product & Service Pricing Calculator","shortName":"Pricing Calculator","description":"Calculate optimal product and service pricing using cost-plus, value-based, and competitor markup models to maximize gross profit margins.","category":"Finance","url":"/pricing-calculator","keywords":["pricing calculator","education","pricing","calculator","selling","price","target","margin","markup","fee","cost","product","selling price","fees"]},{"slug":"profit-margin-calculator","name":"Profit Margin Calculator","shortName":"Profit Margin Calculator","description":"Calculate gross profit margin, net profit margin, and percentage markup from cost and selling price with comprehensive revenue breakdowns.","category":"Finance","url":"/profit-margin-calculator","keywords":["profit margin calculator","education","profit","margin","markup","business","sales","cost","gross","net","pricing","calculator"]},{"slug":"qr-code-generator","name":"QR Code Generator","shortName":"QR Code Generator","description":"Create custom QR codes for website URLs, Wi-Fi networks, text, and contact cards instantly. Download high-resolution PNG or SVG vector QR codes for free.","category":"Tech","url":"/qr-code-generator","keywords":["qr code generator","education","code","generator","url","text","wifi","credentials","canvas","download","canvas qr"]},{"slug":"reading-time-speech-estimator","name":"Reading Time & Speech Duration Estimator","shortName":"Reading Time & Speech Estimator","description":"Estimate reading time and speaking speech duration from word count with customizable words-per-minute (WPM) speed settings.","category":"Tech","url":"/reading-time-speech-estimator","keywords":["reading time speech estimator","education","reading","time","speech","presentation","words","estimator"]},{"slug":"rent-affordability","name":"Rent Affordability Calculator","shortName":"Rent Affordability Calculator","description":"Calculate how much rent you can afford based on the 30% rule and 40x gross monthly income benchmark, factoring in taxes and debt.","category":"Finance","url":"/rent-affordability","keywords":["rent affordability","education","rent","affordability","housing","percent","income","30% rule","dti"]},{"slug":"robots-txt-generator","name":"Robots.txt File Generator","shortName":"Robots.txt Generator","description":"Create custom robots.txt files with crawl rules for Googlebot, Bingbot, search engines, and AI scrapers. Download formatted robots.txt instantly.","category":"Tech","url":"/robots-txt-generator","keywords":["robots txt generator","education","robots","txt","generator","crawler","bot","seo","webmaster"]},{"slug":"roi-calculator","name":"Return on Investment (ROI) Calculator","shortName":"ROI Calculator","description":"Calculate Return on Investment (ROI), annualized ROI, and net profit margins across business ventures, real estate deals, and marketing campaigns.","category":"Finance","url":"/roi-calculator","keywords":["roi calculator","education","roi","calculator","return","investment","annualized","cagr","profit","gain","loss","marketing","capital","roi %","net return"]},{"slug":"savings-calculator","name":"Savings Calculator","shortName":"Savings Calculator","description":"Calculate total savings growth with initial deposits, regular monthly contributions, and compounding interest over custom time horizons.","category":"Finance","url":"/savings-calculator","keywords":["savings calculator","education","savings","calculator","compound","interest","deposits","projected","growth","investment"]},{"slug":"seo-meta-generator","name":"SEO Meta Tag Generator & SERP Preview","shortName":"SEO Meta Tag Generator & SERP Preview","description":"Generate optimized HTML meta tags, Open Graph cards, and Twitter Cards with live desktop and mobile Google SERP preview.","category":"Education","url":"/seo-meta-generator","keywords":["seo meta generator","education","serp preview","meta tags","seo","meta","generator"]},{"slug":"south-african-aps-calculator","name":"South African APS Score Calculator","shortName":"South African APS Calculator","description":"Convert Matric and National Senior Certificate (NSC) percentages into Admission Point Score (APS) points for South African university applications.","category":"Education","url":"/south-african-aps-calculator","keywords":["south african aps calculator","education","south","africa","aps","matric","nsc","score","african","calculator"]},{"slug":"south-african-tvet-nated-calculator","name":"South African TVET NATED Pass Calculator","shortName":"TVET NATED Pass Calculator","description":"Calculate NATED pass status by combining TVET ICASS term mark (40%) and national examination score (60%) with DHET minimum sub-minimum pass criteria.","category":"Education","url":"/south-african-tvet-nated-calculator","keywords":["south african tvet nated calculator","education","south","african","tvet","nated","pass","calculator"]},{"slug":"south-african-university-admission-calculator","name":"South African University Admission Calculator","shortName":"SA University Admission Calculator","description":"Calculate your South African university admission chances. Compare your Matric NSC APS score against UCT, Wits, UP, Stellenbosch, UJ, UKZN, and UNISA faculty cut-offs.","category":"Education","url":"/south-african-university-admission-calculator","keywords":["south african university admission calculator","education","south","africa","university","admission","calculator","uct","wits","stellenbosch","faculty","aps","points","african"]},{"slug":"startup-cost-calculator","name":"Startup Cost Calculator","shortName":"Startup Cost Calculator","description":"Calculate one-time startup capital expenses and recurring monthly operating costs to estimate total funding needed to launch your business.","category":"Finance","url":"/startup-cost-calculator","keywords":["startup cost calculator","education","startup","cost","calculator","business","launch","capital","expenses","runway","working","buffer","budget"]},{"slug":"student-loan-repayment-calculator","name":"Student Loan Repayment Calculator","shortName":"Student Loan Repayment (HELB)","description":"Calculate your Kenya HELB student loan monthly repayment, statutory employer salary deduction, total interest at 4% p.a., ledger fees, and payoff timeline.","category":"Finance","url":"/student-loan-repayment-calculator","keywords":["student loan repayment calculator","education","student","loan","repayment","calculator","kenya","helb","ufm","higher","loans","board","monthly","salary","deduction","interest","ledger","fee","debt","payoff","helb loan","4.0% interest","monthly deduction"]},{"slug":"switzerland-grade-calculator","name":"Switzerland Grade Conversion Calculator","shortName":"Switzerland Grade Calculator","description":"Calculate your Swiss university semester GPA, ECTS credit-weighted averages, ETH Zurich/EPFL Basisprüfung blocks, and convert Swiss 1.0–6.0 grades to US 4.0 GPA, German grades, and ECTS.","category":"Education","url":"/switzerland-grade-calculator","keywords":["switzerland grade calculator","education","switzerland","grade","calculator","conversion","scale","6.0","ects","gpa","4.0","percentage","eth","zurich","epfl","unige","uzh","unibas","unil","pass","mark","weighted","average","1.0-6.0 scale","ects weighted","us 4.0 / german"]},{"slug":"switzerland-language-learning-planner","name":"Switzerland Language Learning Planner","shortName":"Switzerland Language Learning Planner","description":"Plan your Swiss language study schedule for German (Goethe C1 for ETH/UZH), French (DELF B2 for EPFL), and the Swiss Fide test for Permit B/C residence.","category":"Education","url":"/switzerland-language-learning-planner","keywords":["switzerland language learning planner","education","switzerland","language","learning","planner","cefr","german","french","italian","romansh","fide","test","certification","study","timetable","goethe c1","delf b2","fide test"]},{"slug":"switzerland-university-cost-calculator","name":"Switzerland University Cost Calculator","shortName":"Switzerland University Cost Calculator","description":"Calculate Swiss university tuition fees, WG student room rent in Zurich and Geneva, health insurance exemption packages, SBB Halbtax transit, and Permit B financial solvency proof.","category":"Education","url":"/switzerland-university-cost-calculator","keywords":["switzerland university cost calculator","education","switzerland","university","cost","calculator","chf","tuition","fees","living","expenses","eth","zurich","epfl","uzh","unige","unibas","health","insurance","accommodation","cantonal","budget","tuition & rent","permit b proof","health exemption"]},{"slug":"tanzania-heslb-loan-calculator","name":"Tanzania HESLB Student Loan Calculator","shortName":"HESLB Student Loan (Tanzania)","description":"Calculate your Tanzania HESLB student loan allocation, cumulative university debt, 6% Value Retention Fee (VRF), and 15% monthly salary repayment deduction.","category":"Finance","url":"/tanzania-heslb-loan-calculator","keywords":["tanzania heslb loan calculator","education","tanzania","heslb","loan","calculator","student","higher","students","loans","board","repayment","vrf","salary","deduction","tzs","heslb loan","6% vrf","15% salary"]},{"slug":"tanzania-university-admission-calculator","name":"Tanzania University Admission Calculator","shortName":"Tanzania University Admission","description":"Calculate your Tanzania Commission for Universities (TCU) admission points, check undergraduate degree cut-off eligibility for UDSM, MUHAS, SUA, UDOM, and evaluate direct ACSEE or diploma entry.","category":"Education","url":"/tanzania-university-admission-calculator","keywords":["tanzania university admission calculator","education","tanzania","university","admission","calculator","tcu","cut","off","points","udsm","muhas","sua","udom","mzumbe","ifm","direct","acsee","diploma","entry","bachelor","degree","tcu cut-offs","acsee & diploma","prerequisites"]},{"slug":"tanzania-university-gpa-calculator","name":"Tanzania University GPA & CGPA Calculator","shortName":"Tanzania University GPA","description":"Calculate semester GPA and Cumulative CGPA on the official Tanzania 5.0 grading scale. Check First Class, Upper Second classifications across UDSM, UDOM, SUA, and TCU.","category":"Education","url":"/tanzania-university-gpa-calculator","keywords":["tanzania university gpa calculator","education","tanzania","university","gpa","calculator","tcu","cgpa","semester","grade","point","average","udsm","muhas","sua","udom","mzumbe","classification","5.0 scale","tcu honours","udsm / sua"]},{"slug":"tertiary-gpa-cgpa-calculator","name":"Tertiary GPA & CGPA Calculator","shortName":"Tertiary GPA & CGPA Calculator","description":"Calculate university GPA and cumulative CGPA on 4.0 and 5.0 grading scales. Instant weighted credit calculation for Nigerian, Ghanaian, and global tertiary students.","category":"Education","url":"/tertiary-gpa-cgpa-calculator","keywords":["tertiary gpa cgpa calculator","education","tertiary","gpa","cgpa","university","grade","point","scale","calculator"]},{"slug":"text-case-converter-cleanup","name":"Text Case Converter & Cleanup Tool","shortName":"Text Case & Cleanup","description":"Convert text case between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and clean up duplicate whitespace and line breaks instantly.","category":"Tech","url":"/text-case-converter-cleanup","keywords":["text case converter cleanup","education","text","case","converter","cleanup","uppercase","lowercase","html"]},{"slug":"tvet-exam-target-mark-calculator","name":"TVET Exam Target Mark Calculator","shortName":"TVET Exam Target Mark Calculator","description":"Calculate what mark you need in the DHET national TVET exam to pass (40%/50%) or get a distinction (75%) based on your current ICASS score.","category":"Education","url":"/tvet-exam-target-mark-calculator","keywords":["tvet exam target mark calculator","education","tvet","exam","target","mark","calculator","icass","required","score","pass","distinction"]},{"slug":"tvet-ncv-pass-calculator","name":"TVET NC(V) Pass & Aggregate Calculator","shortName":"TVET NC(V) Pass & Aggregate","description":"Calculate South African TVET NC(V) Level 2–4 pass status, ICASS (25%), ISAT (25%), and Exam (50%) scores with DHET and Umalusi certification criteria.","category":"Education","url":"/tvet-ncv-pass-calculator","keywords":["tvet ncv pass calculator","education","tvet","ncv","pass","aggregate","calculator","south","africa","level","vocational"]},{"slug":"uace-points-calculator","name":"UACE Points Calculator","shortName":"UACE Points Calculator","description":"Calculate UNEB UACE points and Makerere PUJAB university admissions weighting from your Principal and Subsidiary A-Level subject grades.","category":"Education","url":"/uace-points-calculator","keywords":["uace points calculator","education","uace","points","calculator","uneb","level","makerere","pujab","cut","off","uganda","principal","passes","weightings","direct","admissions","20-point scale","pujab weights"]},{"slug":"ucas-points-calculator","name":"UCAS Points Calculator","shortName":"UCAS Points Calculator","description":"Calculate your total UCAS Tariff points for UK university entry from A-Levels, BTECs, T-Levels, IB, EPQ, and Scottish Highers. Compare with university entry bands.","category":"Education","url":"/ucas-points-calculator","keywords":["ucas points calculator","education","ucas","points","calculator","tariff","level","btec","scottish","highers","admissions","university"]},{"slug":"uce-grade-calculator","name":"UCE Grade Calculator","shortName":"UCE Grade Calculator","description":"Calculate UNEB UCE aggregates, Division (1–4), and A-Level combination eligibility from best 8 Senior 4 Ordinary Level subject grades.","category":"Education","url":"/uce-grade-calculator","keywords":["uce grade calculator","education","uce","grade","calculator","uneb","level","senior","best","aggregates","division","uganda","subject","combination","eligibility","best 8","distinctions & credits"]},{"slug":"uganda-university-admission-calculator","name":"Uganda University Admission Calculator","shortName":"Uganda University Admission","description":"Calculate your Uganda public universities PUJAB weighted cut-off points for Makerere, Kyambogo, MUBS, MUST, and Gulu from UACE A-Level grades and UCE O-Level scores.","category":"Education","url":"/uganda-university-admission-calculator","keywords":["uganda university admission calculator","education","uganda","university","admission","calculator","makerere","kyambogo","mubs","pujab","cut","off","points","uace","level","uce","weighting","essential","relevant","desirable","female","affirmative","pujab formula","uace & uce"]},{"slug":"uganda-university-cgpa-calculator","name":"Uganda University CGPA Calculator","shortName":"Uganda University CGPA","description":"Calculate your semester GPA, cumulative CGPA, Credit Units (CU), and Degree Honours classification on the official Uganda 5.0 scale for Makerere, Kyambogo, MUBS, UCU, and MUST.","category":"Education","url":"/uganda-university-cgpa-calculator","keywords":["uganda university cgpa calculator","education","uganda","university","cgpa","calculator","gpa","makerere","kyambogo","mubs","ucu","must","nche","5.0","scale","credit","units","honours","class","retake","5.0 scale","honours class"]},{"slug":"uk-a-level-grade-calculator","name":"A-Level Grade Calculator","shortName":"A-Level Grade Calculator","description":"Calculate weighted A-Level grades from exam components and papers (Cambridge CAIE, Edexcel, AQA, OCR). Forecast marks needed for an A* or A and convert to UCAS points.","category":"Education","url":"/uk-a-level-grade-calculator","keywords":["uk a level grade calculator","education","level","grade","calculator","cambridge","edexcel","aqa","component","weight","raw","mark","target"]},{"slug":"uk-degree-classification-calculator","name":"Degree Classification Calculator","shortName":"Degree Classification Calculator","description":"Calculate your UK university undergraduate degree classification (1st, 2:1, 2:2, 3rd) across Year 2 and Year 3 weightings (1:2, 1:3, 50:50). Forecast required final year marks.","category":"Education","url":"/uk-degree-classification-calculator","keywords":["uk degree classification calculator","education","degree","classification","calculator","university","first","upper","second","third","modular","weighting"]},{"slug":"uk-gcse-grade-calculator","name":"GCSE Grade Calculator","shortName":"GCSE Grade Calculator","description":"Calculate your GCSE average grade, Attainment 8 score, EBacc points, and Sixth Form / College admission eligibility under the official UK 9-1 grading system.","category":"Education","url":"/uk-gcse-grade-calculator","keywords":["uk gcse grade calculator","education","gcse","grade","calculator","attainment","average","progress","sixth","form","admissions","scale"]},{"slug":"uk-student-loan-finance-calculator","name":"UK Student Finance & Maintenance Loan Calculator","shortName":"UK Student Finance Calculator","description":"Calculate your UK student maintenance loan entitlement and estimate monthly student loan repayments for Plan 5 (2023+ starters), Plan 2, Plan 1, and Postgraduate loans. Free, instant, and 100% private.","category":"Education","url":"/uk-student-loan-finance-calculator","keywords":["uk student loan finance calculator","education","student","finance","calculator","maintenance","loan","repayment","plan","postgraduate","slc","loans","company","sfe","university","tuition"]},{"slug":"uneb-results-estimator","name":"UNEB Results Estimator","shortName":"UNEB Results Estimator","description":"Estimate your expected UNEB PLE aggregates (4–36), UCE O-Level Best 8 division (1–4), and UACE A-Level points (out of 20) from mock exam scores and continuous assessment.","category":"Education","url":"/uneb-results-estimator","keywords":["uneb results estimator","education","uneb","results","estimator","ple","uce","uace","aggregates","points","predictor","mock","score","division","senior","university","makerere","ple / uce / uace","mock predictor"]},{"slug":"unit-converter","name":"Unit Converter","shortName":"Unit Converter","description":"Convert units of length, weight, temperature, area, volume, speed, and time with instant live conversion across metric and imperial systems.","category":"Everyday","url":"/unit-converter","keywords":["unit converter","education","unit","converter","length","weight","temperature","area","volume"]},{"slug":"university-course-finder","name":"Australian University Course Finder","shortName":"University Course Finder (Australia)","description":"Search and compare 60+ Australian university degrees, 2026 ATAR selection rank cutoffs, CSP tuition fees, prerequisites, and graduate salaries across Go8 and ATN institutions.","category":"Education","url":"/university-course-finder","keywords":["university course finder","education","university","course","finder","australia","atar","cutoff","bachelor","degree","go8","selection","rank","unimelb","usyd","unsw","monash","uwa","anu","adelaide","go8 & regional","atar cutoffs","degree finder"]},{"slug":"university-cutoff-eligibility-checker","name":"University Cut-Off & Eligibility Checker","shortName":"University Eligibility Checker","description":"Check your admission chances by comparing JAMB, WASSCE, or KCSE scores against course cut-off baselines and prerequisite requirements.","category":"Education","url":"/university-cutoff-eligibility-checker","keywords":["university cutoff eligibility checker","education","university","cutoff","eligibility","jamb","wassce","course","checker"]},{"slug":"url-slug-generator","name":"URL Slug Generator","shortName":"URL Slug Generator","description":"Convert titles and text into clean, SEO-friendly URL slugs. Automatically removes special characters, trims punctuation, and handles custom delimiters.","category":"Tech","url":"/url-slug-generator","keywords":["url slug generator","education","url","slug","generator","permalink","seo","title","rewrite"]},{"slug":"waec-grade-calculator","name":"WAEC Grade Calculator","shortName":"WAEC Grade Calculator","description":"Calculate your official WAEC letter grades (A1 to F9) from percentage marks across 9 subjects. Verify 5-credit Nigerian university admission eligibility instantly.","category":"Education","url":"/waec-grade-calculator","keywords":["waec grade calculator","education","waec","grade","calculator","wassce","marks","point","grading","scale","credits","eligibility","nigeria"]},{"slug":"wassce-aggregate-calculator","name":"WASSCE Aggregate Calculator","shortName":"WASSCE Aggregate Calculator","description":"Calculate your WASSCE aggregate score from WAEC core and elective grades (A1-F9). Free tertiary admission aggregate calculator for Ghana and Nigeria.","category":"Education","url":"/wassce-aggregate-calculator","keywords":["wassce aggregate calculator","education","wassce","aggregate","west","african","senior","school","certificate","best 3 electives","scale 6–54","calculator"]},{"slug":"water-intake-calculator","name":"Daily Water Intake Calculator","shortName":"Water Intake Calculator","description":"Calculate your recommended daily water intake in liters and cups based on body weight, daily exercise duration, and climate conditions.","category":"Health","url":"/water-intake-calculator","keywords":["water intake calculator","education","water","intake","hydration","weight","exercise","climate","calculator"]},{"slug":"whatsapp-direct-link-qr-generator","name":"WhatsApp Direct Link & QR Code Generator","shortName":"WhatsApp Link & QR Generator","description":"Create direct WhatsApp click-to-chat links and scannable QR codes with pre-filled custom messages. Start chats without saving phone numbers.","category":"Business","url":"/whatsapp-direct-link-qr-generator","keywords":["whatsapp direct link qr generator","education","whatsapp","direct","link","code","generator","chat"]},{"slug":"word-counter","name":"Word & Character Counter","shortName":"Word Counter","description":"Count words, characters, sentences, and paragraphs in real time with estimated reading time and speaking speed analysis. Free and 100% private.","category":"Everyday","url":"/word-counter","keywords":["word counter","education","word","counter","words","characters","sentences","reading","writing","reading time"]},{"slug":"work-experience-resume-duration-calculator","name":"Work Experience & Resume Duration","shortName":"Work Experience & Resume Duration","description":"Calculate total cumulative work experience in years and months across multiple overlapping job positions for resumes and job applications.","category":"Tech","url":"/work-experience-resume-duration-calculator","keywords":["work experience resume duration calculator","education","work","experience","resume","duration","employment","dates","years","months","days","calculator"]},{"slug":"xml-sitemap-builder","name":"XML Sitemap Generator for Static Sites","shortName":"Static Site XML Sitemap Builder","description":"Build standard XML sitemaps with custom URL priorities, change frequencies, and last modification dates for search engine indexing.","category":"Tech","url":"/xml-sitemap-builder","keywords":["xml sitemap builder","education","xml","sitemap","builder","static","site","seo","urls"]},{"slug":"zambia-grade-12-points-calculator","name":"ECZ Grade 12 Points Calculator","shortName":"Zambia Grade 12 Points","description":"Calculate your official ECZ Grade 12 School Certificate points (Best 6) and university admission points (Best 5) in Zambia. Check credits, distinctions, and pass status.","category":"Education","url":"/zambia-grade-12-points-calculator","keywords":["zambia grade 12 points calculator","education","zambia","grade","points","calculator","ecz","school","certificate","best","subjects","unza","cbu","distinctions","credits","pass","best 6 & 5","ecz scale 1-9","school cert"]},{"slug":"zambia-university-admission-calculator","name":"Zambia University Admission Calculator","shortName":"Zambia University Admission","description":"Calculate your university admission points for UNZA, CBU, Mulungushi, and LMMU in Zambia. Verify prerequisite subjects, cut-off cutoffs, and faculty eligibility.","category":"Education","url":"/zambia-university-admission-calculator","keywords":["zambia university admission calculator","education","zambia","university","admission","calculator","unza","cbu","mulungushi","lmmu","cut","off","points","ecz","quota","merit","unza / cbu","ecz cut-offs","prerequisites"]},{"slug":"zambia-university-gpa-calculator","name":"Zambia University GPA Calculator","shortName":"Zambia University GPA","description":"Calculate semester GPA and Cumulative CGPA for UNZA, CBU, Mulungushi, Cavendish, and Eden University in Zambia. Check Distinction, Merit, Credit, and Pass classifications.","category":"Education","url":"/zambia-university-gpa-calculator","keywords":["zambia university gpa calculator","education","zambia","university","gpa","calculator","unza","cbu","mulungushi","cavendish","eden","cgpa","semester","quality","points","honours","distinction","merit","credit","5.0 & 4.0 scales","unza / cbu"]},{"slug":"zimbabwe-study-timetable-generator","name":"Zimbabwe Study Timetable Generator","shortName":"Zimbabwe Study Timetable","description":"Generate a customized, spaced-repetition study timetable for ZIMSEC Form 4 O-Level, Form 6 A-Level, and University students in Zimbabwe. Balance subjects, past papers, and rest.","category":"Education","url":"/zimbabwe-study-timetable-generator","keywords":["zimbabwe study timetable generator","education","zimbabwe","study","timetable","generator","zimsec","level","university","revision","schedule","planner","exam","preparation","past","papers","zimsec o/a-level","spaced repetition"]},{"slug":"zimbabwe-university-entry-points-calculator","name":"Zimbabwe University Entry Points Calculator","shortName":"Zimbabwe University Entry Calculator","description":"Calculate your university entry points and check admissions cut-offs for UZ, NUST, MSU, CUT, and HIT undergraduate degree programs.","category":"Education","url":"/zimbabwe-university-entry-points-calculator","keywords":["zimbabwe university entry points calculator","education","zimbabwe","university","entry","points","calculator","nust","msu","cut","hit","off","conventional","parallel","admission","uz / nust / msu","cut-off points"]},{"slug":"zimbabwe-university-gpa-calculator","name":"Zimbabwe University GPA Calculator","shortName":"Zimbabwe University GPA","description":"Calculate semester GPA and cumulative CGPA on official Zimbabwe university scales for UZ, NUST, MSU, CUT, HIT, and GZU. Predict First Class, 2.1, 2.2, and Pass degree honours.","category":"Education","url":"/zimbabwe-university-gpa-calculator","keywords":["zimbabwe university gpa calculator","education","zimbabwe","university","gpa","calculator","nust","msu","cut","hit","gzu","cgpa","semester","degree","class","first","upper","second","pass","wam","uz / nust / msu","degree classification"]},{"slug":"zimsec-alevel-points-calculator","name":"ZIMSEC A-Level Points Calculator","shortName":"ZIMSEC A-Level Points Calculator","description":"Calculate your ZIMSEC A-Level points (15-point scale), principal passes, and university degree eligibility from your Advanced Level grades.","category":"Education","url":"/zimsec-alevel-points-calculator","keywords":["zimsec alevel points calculator","education","zimsec","level","points","calculator","zimbabwe","form","advanced","principal","passes","university","15 points","principal passes","alevel"]},{"slug":"zimsec-olevel-points-calculator","name":"ZIMSEC O-Level Points Calculator","shortName":"ZIMSEC O-Level Points Calculator","description":"Calculate your ZIMSEC O-Level points, total subject passes, and Form 5 A-Level combination eligibility from your Ordinary Level grades.","category":"Education","url":"/zimsec-olevel-points-calculator","keywords":["zimsec olevel points calculator","education","zimsec","level","points","calculator","zimbabwe","form","best","subjects","passes","english","maths","lower","sixth","best 5","form 5 eligibility","olevel"]}];

  // Category Theme Badges
  const CATEGORY_STYLES = {
    'Education': {
      border: 'border-l-yellow-400',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      iconBg: 'bg-yellow-100 text-yellow-800',
      defaultIcon: '🎓'
    },
    'Finance': {
      border: 'border-l-emerald-400',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      iconBg: 'bg-emerald-100 text-emerald-800',
      defaultIcon: '💰'
    },
    'Health': {
      border: 'border-l-teal-400',
      badgeBg: 'bg-teal-100 text-teal-800 border-teal-200',
      iconBg: 'bg-teal-100 text-teal-800',
      defaultIcon: '🩺'
    },
    'Productivity': {
      border: 'border-l-indigo-400',
      badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      iconBg: 'bg-indigo-100 text-indigo-800',
      defaultIcon: '⚡'
    },
    'Business': {
      border: 'border-l-slate-400',
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-200',
      iconBg: 'bg-slate-100 text-slate-800',
      defaultIcon: '💼'
    }
  };

  // Flag/Regional Icon Mapping
  function getToolIcon(tool) {
    const s = (tool.slug + ' ' + (tool.keywords || []).join(' ')).toLowerCase();
    if (s.includes('rwanda') || s.includes('nesa') || s.includes('kigali') || s.includes('mineduc') || s.includes('hec rwanda')) return '🇷🇼';
    if (s.includes('cameroon') || s.includes('cgceb') || s.includes('minesup') || s.includes('buea') || s.includes('bamenda')) return '🇨🇲';
    if (s.includes('liberia') || s.includes('monrovia') || s.includes('cuttington')) return '🇱🇷';
    if (s.includes('malawi') || s.includes('maneb') || s.includes('msce') || s.includes('unima') || s.includes('mubas')) return '🇲🇼';
    if (s.includes('namibia') || s.includes('nssc') || s.includes('unam') || s.includes('nust')) return '🇳🇦';
    if (s.includes('botswana') || s.includes('bgcse') || s.includes('biust')) return '🇧🇼';
    if (s.includes('new zealand') || s.includes('new-zealand') || s.includes('ncea') || s.includes('nzqa')) return '🇳🇿';
    if (s.includes('germany') || s.includes('abitur') || s.includes('bavarian') || s.includes('hochschulstart')) return '🇩🇪';
    if (s.includes('norway') || s.includes('lanekassen') || s.includes('samordna')) return '🇳🇴';
    if (s.includes('switzerland') || s.includes('swiss')) return '🇨🇭';
    if (s.includes('kenya') || s.includes('knec') || s.includes('kcse') || s.includes('kcpe') || s.includes('kuccps')) return '🇰🇪';
    if (s.includes('nigeria') || s.includes('jamb') || s.includes('waec') || s.includes('neco') || s.includes('utme') || s.includes('polytechnic')) return '🇳🇬';
    if (s.includes('ghana') || s.includes('bece') || s.includes('wassce') || s.includes('cwa') || s.includes('cssps')) return '🇬🇭';
    if (s.includes('south africa') || s.includes('matric') || s.includes('aps') || s.includes('nsfas') || s.includes('nsc') || s.includes('tvet') || s.includes('icass') || s.includes('nated') || s.includes('sba')) return '🇿🇦';
    if (s.includes('uganda') || s.includes('ple') || s.includes('uce') || s.includes('uace') || s.includes('uneb')) return '🇺🇬';
    if (s.includes('tanzania') || s.includes('necta') || s.includes('csee') || s.includes('acsee') || s.includes('psle')) return '🇹🇿';
    if (s.includes('zimbabwe') || s.includes('zimsec')) return '🇿🇼';
    if (s.includes('rwanda') || s.includes('reb') || s.includes('nesa')) return '🇷🇼';
    if (s.includes('zambia') || s.includes('ecz')) return '🇿🇲';
    if (s.includes('uk ') || s.includes('uk-') || s.includes('gcse') || s.includes('ucas') || s.includes('tariff') || s.includes('student loan')) return '🇬🇧';
    if (s.includes('australia') || s.includes('atar') || s.includes('hecs') || s.includes('help-debt')) return '🇦🇺';
    if (s.includes('canada') || s.includes('ontario') || s.includes('bc-gpa')) return '🇨🇦';
    if (s.includes('us-') || s.includes('gpa-') || s.includes('gpa scale 4.0')) return '🇺🇸';

    const catStyle = CATEGORY_STYLES[tool.category] || CATEGORY_STYLES['Productivity'];
    return catStyle.defaultIcon;
  }

  // 2. NORMALIZATION & STRING DISTANCE (Damerau-Levenshtein)
  function normalize(str) {
    return String(str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function tokenize(str) {
    return normalize(str).split(' ').filter(Boolean);
  }

  // Intent & Synonyms mapping
  const INTENT_SYNONYMS = {
    'calc': ['calculator', 'calculate'],
    'cal': ['calculator'],
    'compute': ['calculator'],
    'eval': ['calculator'],
    'gpa': ['cgpa', 'grade', 'grades', 'transcript', 'academic'],
    'cgpa': ['gpa', 'cumulative', 'transcript'],
    'marks': ['grades', 'score', 'points'],
    'scores': ['score', 'points', 'aggregate'],
    'aggregate': ['points', 'score', 'admission'],
    'admission': ['aggregate', 'cutoff', 'eligibility', 'cluster', 'points'],
    'cutoff': ['admission', 'cluster', 'eligibility', 'points'],
    'cluster': ['points', 'kuccps', 'admission'],
    'points': ['aggregate', 'score', 'aps', 'ucas', 'tariff'],
    'scholarship': ['bursary', 'funding', 'grant', 'allowance', 'nsfas'],
    'bursary': ['scholarship', 'funding', 'nsfas', 'allowance'],
    'loan': ['finance', 'mortgage', 'interest', 'debt', 'student loan'],
    'mortgage': ['loan', 'interest', 'repayment', 'home'],
    'tax': ['salary', 'paye', 'income', 'vat'],
    'salary': ['wage', 'pay', 'hourly', 'income', 'freelance'],
    'freelance': ['hourly', 'rate', 'pricing', 'invoice'],
    'invoice': ['billing', 'receipt', 'freelance'],
    'weight': ['bmi', 'bmr', 'body', 'health', 'calorie'],
    'calorie': ['calories', 'bmr', 'diet', 'macro', 'nutrition'],
    'tvet': ['college', 'icass', 'nated', 'ncv', 'dhet'],
    'college': ['tvet', 'university', 'tertiary'],
    'matric': ['nsc', 'aps', 'sba', 'south africa'],
    'reading': ['words', 'reading time', 'wpm', 'speed'],
    'timer': ['countdown', 'stopwatch', 'pomodoro', 'clock'],
    'convert': ['converter', 'conversion', 'exchange'],
    'formatter': ['validator', 'json', 'beautifier']
  };

  function getExpandedTokens(tokens) {
    const set = new Set(tokens);
    for (const t of tokens) {
      if (INTENT_SYNONYMS[t]) {
        for (const syn of INTENT_SYNONYMS[t]) {
          set.add(syn);
        }
      }
    }
    return Array.from(set);
  }

  function damerauLevenshtein(a, b) {
    if (a === b) return 0;
    const la = a.length;
    const lb = b.length;
    if (!la) return lb;
    if (!lb) return la;

    const d = [];
    for (let i = 0; i <= la; i++) d[i] = [i];
    for (let j = 0; j <= lb; j++) d[0][j] = j;

    for (let i = 1; i <= la; i++) {
      for (let j = 1; j <= lb; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        d[i][j] = Math.min(
          d[i - 1][j] + 1,       // deletion
          d[i][j - 1] + 1,       // insertion
          d[i - 1][j - 1] + cost // substitution
        );
        // Transposition
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
        }
      }
    }
    return d[la][lb];
  }

  // 3. CORE SEARCH ALGORITHM
  function search(rawQuery, options = {}) {
    const query = String(rawQuery || '').trim();
    if (!query) return { results: [], isClosestMatch: false, query: '' };

    const normQ = normalize(query);
    if (!normQ) return { results: [], isClosestMatch: false, query: '' };

    const originalTokens = tokenize(normQ);
    const expandedTokens = getExpandedTokens(originalTokens);
    const categoryFilter = options.category && options.category !== 'all' ? options.category.toLowerCase() : null;
    const limit = options.limit || 12;

    const scored = [];
    const seenSlugs = new Set();

    for (const tool of AFRIWIDGET_TOOLS) {
      if (seenSlugs.has(tool.slug)) continue;

      const normName = normalize(tool.name);
      const normShortName = normalize(tool.shortName || tool.name);
      const normDesc = normalize(tool.description);
      const normCat = normalize(tool.category);
      const normSlug = normalize(tool.slug);
      const kwTokens = (tool.keywords || []).map(normalize);
      const nameTokens = tokenize(normName);
      const descTokens = tokenize(normDesc);

      // Category filter check if specified
      if (categoryFilter) {
        const catKey = categoryFilter.replace('real-estate', 'realestate').replace('tech', 'productivity');
        const toolCatKey = normCat.replace('real-estate', 'realestate');
        if (!toolCatKey.includes(catKey) && !normSlug.includes(catKey)) {
          continue;
        }
      }

      let score = 0;
      let exactPhraseMatch = false;

      // Full phrase matches (Highest priority)
      if (normShortName === normQ || normName === normQ) {
        score += 500;
        exactPhraseMatch = true;
      } else if (normShortName.startsWith(normQ) || normName.startsWith(normQ)) {
        score += 300;
        exactPhraseMatch = true;
      } else if (normName.includes(normQ) || normShortName.includes(normQ)) {
        score += 200;
        exactPhraseMatch = true;
      } else if (normSlug.includes(normQ.replace(/\s+/g, '-'))) {
        score += 150;
      } else if (normDesc.includes(normQ)) {
        score += 80;
      }

      // Word-Order Independent Token Matching
      let matchedOriginalTokens = 0;
      let tokenScoreAccum = 0;

      for (const qToken of originalTokens) {
        let bestTokenScore = 0;

        // 1. Name tokens check (weight: 3.5)
        for (const nToken of nameTokens) {
          if (nToken === qToken) {
            bestTokenScore = Math.max(bestTokenScore, 100 * 3.5);
          } else if (nToken.startsWith(qToken)) {
            bestTokenScore = Math.max(bestTokenScore, 85 * 3.5);
          } else if (nToken.includes(qToken)) {
            bestTokenScore = Math.max(bestTokenScore, 65 * 3.5);
          } else {
            // Typo / Edit Distance check
            const maxEd = qToken.length >= 8 ? 3 : qToken.length >= 5 ? 2 : qToken.length >= 3 ? 1 : 0;
            if (maxEd > 0) {
              const ed = damerauLevenshtein(qToken, nToken);
              if (ed <= maxEd) {
                const sim = 1 - (ed / Math.max(qToken.length, nToken.length));
                bestTokenScore = Math.max(bestTokenScore, sim * 80 * 3.5);
              }
            }
          }
        }

        // 2. Slug check (weight: 3.0)
        if (normSlug.includes(qToken)) {
          bestTokenScore = Math.max(bestTokenScore, 85 * 3.0);
        } else {
          const slugParts = normSlug.split('-');
          for (const sPart of slugParts) {
            const maxEd = qToken.length >= 8 ? 3 : qToken.length >= 5 ? 2 : qToken.length >= 3 ? 1 : 0;
            if (maxEd > 0) {
              const ed = damerauLevenshtein(qToken, sPart);
              if (ed <= maxEd) {
                const sim = 1 - (ed / Math.max(qToken.length, sPart.length));
                bestTokenScore = Math.max(bestTokenScore, sim * 70 * 3.0);
              }
            }
          }
        }

        // 3. Keywords check (weight: 2.5)
        for (const kw of kwTokens) {
          if (kw === qToken) {
            bestTokenScore = Math.max(bestTokenScore, 95 * 2.5);
          } else if (kw.startsWith(qToken)) {
            bestTokenScore = Math.max(bestTokenScore, 80 * 2.5);
          } else if (kw.includes(qToken)) {
            bestTokenScore = Math.max(bestTokenScore, 60 * 2.5);
          } else {
            const maxEd = qToken.length >= 8 ? 3 : qToken.length >= 5 ? 2 : qToken.length >= 3 ? 1 : 0;
            if (maxEd > 0) {
              const ed = damerauLevenshtein(qToken, kw);
              if (ed <= maxEd) {
                const sim = 1 - (ed / Math.max(qToken.length, kw.length));
                bestTokenScore = Math.max(bestTokenScore, sim * 70 * 2.5);
              }
            }
          }
        }

        // 4. Category check (weight: 2.0)
        if (normCat.includes(qToken)) {
          bestTokenScore = Math.max(bestTokenScore, 85 * 2.0);
        }

        // 5. Description check (weight: 1.0)
        for (const dToken of descTokens) {
          if (dToken === qToken) {
            bestTokenScore = Math.max(bestTokenScore, 60 * 1.0);
            break;
          } else if (dToken.startsWith(qToken)) {
            bestTokenScore = Math.max(bestTokenScore, 40 * 1.0);
          }
        }

        // 6. Intent synonyms check (weight: 1.8)
        if (bestTokenScore < 50) {
          const synonyms = INTENT_SYNONYMS[qToken] || [];
          for (const syn of synonyms) {
            if (normName.includes(syn) || normSlug.includes(syn)) {
              bestTokenScore = Math.max(bestTokenScore, 65 * 1.8);
            } else if (kwTokens.some(k => k.includes(syn))) {
              bestTokenScore = Math.max(bestTokenScore, 50 * 1.8);
            }
          }
        }

        if (bestTokenScore > 0) {
          matchedOriginalTokens++;
          tokenScoreAccum += bestTokenScore;
        }
      }

      // Bonus for complete token coverage (all query words matched)
      if (matchedOriginalTokens > 0) {
        const coverageRatio = matchedOriginalTokens / originalTokens.length;
        if (coverageRatio === 1) {
          score += tokenScoreAccum * 1.5; // Complete match multiplier!
        } else {
          score += tokenScoreAccum * coverageRatio * 0.7;
        }
      }

      if (score >= 35) {
        seenSlugs.add(tool.slug);
        scored.push({
          tool,
          score,
          isClosestMatch: false
        });
      }
    }

    // Sort by relevance score descending
    scored.sort((a, b) => b.score - a.score);

    // If matches found, return top results
    if (scored.length > 0) {
      return {
        results: scored.slice(0, limit),
        isClosestMatch: false,
        query
      };
    }

    // FALLBACK: Closest matching tools when no exact/token match is found
    const closestScored = [];
    for (const tool of AFRIWIDGET_TOOLS) {
      const normName = normalize(tool.shortName || tool.name);
      const normSlug = normalize(tool.slug);
      // Compare query with tool name prefix and slug
      const edName = damerauLevenshtein(normQ, normName.slice(0, Math.max(normQ.length + 4, 12)));
      const edSlug = damerauLevenshtein(normQ, normSlug.slice(0, Math.max(normQ.length + 4, 12)));
      const bestEd = Math.min(edName, edSlug);
      const maxLen = Math.max(normQ.length, normName.length);
      const similarity = 1 - (bestEd / maxLen);

      closestScored.push({
        tool,
        score: similarity,
        isClosestMatch: true
      });
    }

    closestScored.sort((a, b) => b.score - a.score);
    return {
      results: closestScored.slice(0, Math.min(limit, 6)),
      isClosestMatch: true,
      query
    };
  }

  // 4. HIGHLIGHT HELPER
  function highlightMatches(text, query) {
    if (!text || !query) return escapeHtml(text || '');
    const tokens = tokenize(query);
    if (!tokens.length) return escapeHtml(text);

    const escaped = tokens
      .filter(t => t.length >= 2)
      .map(t => t.replace(/[.*+?^$${}()|[\]\\]/g, '\\$&'));
    if (!escaped.length) return escapeHtml(text);

    const regex = new RegExp('(' + escaped.join('|') + ')', 'gi');
    return escapeHtml(text).replace(regex, '<mark class="bg-yellow-200/90 text-slate-950 font-semibold px-0.5 rounded">$1</mark>');
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // 5. TOOL CARD HTML GENERATOR
  function renderToolCard(tool, isClosest = false) {
    const catStyle = CATEGORY_STYLES[tool.category] || CATEGORY_STYLES['Productivity'];
    const icon = getToolIcon(tool);
    const href = tool.url || ('/' + tool.slug);
    const searchData = [tool.slug, tool.name, tool.description, (tool.keywords || []).join(' ')].join(' ').toLowerCase();

    return `
      <a class="tool-card group rounded-2xl border border-slate-200 ${catStyle.border} border-l-4 bg-white p-5 transition-all hover:shadow-md hover:border-slate-300 flex flex-col justify-between" 
         data-tool-card 
         data-category="${tool.category.toLowerCase()}" 
         data-search="${escapeHtml(searchData)}" 
         href="${href}">
        <div>
          <div class="mb-4 flex items-start justify-between">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl ${catStyle.iconBg}">
              <span class="text-xl">${icon}</span>
            </span>
            <span class="text-xs font-bold px-2 py-0.5 rounded-full ${catStyle.badgeBg}">
              ${tool.category}
            </span>
          </div>
          <h4 class="text-lg font-extrabold text-slate-950 group-hover:text-yellow-600 transition-colors">
            ${escapeHtml(tool.shortName || tool.name)}
          </h4>
          <p class="mt-2 text-sm leading-6 text-slate-600 line-clamp-3">
            ${escapeHtml(tool.description)}
          </p>
        </div>
        <div class="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span class="inline-flex items-center gap-1.5 text-sm font-extrabold text-slate-950 group-hover:text-yellow-600 transition-colors">
            Launch tool <span aria-hidden="true">→</span>
          </span>
          ${isClosest ? '<span class="text-[10.5px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">Closest Match</span>' : ''}
        </div>
      </a>
    `;
  }

  // 6. AUTOCOMPLETE DROPDOWN CONTROLLER
  function attachAutocomplete(inputElement, options = {}) {
    if (!inputElement) return;

    let dropdown = document.getElementById(inputElement.id + '-autocomplete');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.id = inputElement.id + '-autocomplete';
      dropdown.className = 'autocomplete-dropdown absolute left-0 right-0 top-full mt-2 w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-[60] hidden transition-all';
      dropdown.setAttribute('role', 'listbox');
      dropdown.setAttribute('aria-label', 'Search suggestions');

      const parent = inputElement.closest('form') || inputElement.parentElement;
      if (parent) {
        if (!parent.classList.contains('relative')) {
          parent.classList.add('relative');
        }
        parent.appendChild(dropdown);
      } else {
        document.body.appendChild(dropdown);
      }
    }

    let activeIndex = -1;
    let currentResults = [];
    let debounceTimer = null;

    function renderDropdown(searchResult) {
      const { results, isClosestMatch, query } = searchResult;
      currentResults = results;
      activeIndex = -1;

      if (!query || results.length === 0) {
        dropdown.classList.add('hidden');
        dropdown.innerHTML = '';
        inputElement.setAttribute('aria-expanded', 'false');
        return;
      }

      let html = '';

      if (isClosestMatch) {
        html += `
          <div class="px-4 py-2.5 bg-amber-50 border-b border-amber-100 text-xs font-bold text-amber-900 flex items-center justify-between">
            <span class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              No exact match for “${escapeHtml(query)}”. Closest matching tools:
            </span>
          </div>
        `;
      } else {
        html += `
          <div class="px-4 py-2 bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Tools matching “${escapeHtml(query)}”</span>
            <span class="text-yellow-600 font-extrabold">${results.length} ${results.length === 1 ? 'result' : 'results'}</span>
          </div>
        `;
      }

      html += '<div class="max-h-[380px] overflow-y-auto divide-y divide-slate-100 py-1" role="listbox">';
      results.forEach((item, idx) => {
        const tool = item.tool;
        const catStyle = CATEGORY_STYLES[tool.category] || CATEGORY_STYLES['Productivity'];
        const icon = getToolIcon(tool);
        const highlightedTitle = highlightMatches(tool.shortName || tool.name, query);
        const highlightedDesc = highlightMatches(tool.description, query);
        const href = tool.url || ('/' + tool.slug);

        html += `
          <a href="${href}" 
             id="search-opt-${idx}" 
             role="option" 
             aria-selected="false" 
             data-index="${idx}"
             class="autocomplete-item block px-4 py-3 hover:bg-yellow-50/60 transition-colors cursor-pointer group">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2.5 min-w-0">
                <span class="text-base shrink-0">${icon}</span>
                <span class="text-sm font-extrabold text-slate-900 group-hover:text-yellow-700 truncate">
                  ${highlightedTitle}
                </span>
              </div>
              <span class="text-[10.5px] font-bold px-2 py-0.5 rounded-full ${catStyle.badgeBg} shrink-0">
                ${tool.category}
              </span>
            </div>
            <p class="mt-1 text-xs text-slate-500 line-clamp-1 group-hover:text-slate-700">
              ${highlightedDesc}
            </p>
          </a>
        `;
      });
      html += '</div>';

      html += `
        <div class="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span class="flex items-center gap-1">
            <kbd class="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-600 shadow-2xs">↑</kbd>
            <kbd class="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-600 shadow-2xs">↓</kbd>
            navigate
          </span>
          <span class="flex items-center gap-1">
            <kbd class="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-600 shadow-2xs">Enter</kbd>
            launch
          </span>
          <span class="flex items-center gap-1">
            <kbd class="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-600 shadow-2xs">Esc</kbd>
            close
          </span>
        </div>
      `;

      dropdown.innerHTML = html;
      dropdown.classList.remove('hidden');
      inputElement.setAttribute('aria-expanded', 'true');

      dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', () => {
          dropdown.classList.add('hidden');
          inputElement.setAttribute('aria-expanded', 'false');
        });
      });
    }

    function updateActiveItem(newIndex) {
      const items = dropdown.querySelectorAll('.autocomplete-item');
      if (!items.length) return;

      if (activeIndex >= 0 && items[activeIndex]) {
        items[activeIndex].classList.remove('bg-yellow-50', 'border-l-4', 'border-yellow-400');
        items[activeIndex].setAttribute('aria-selected', 'false');
      }

      activeIndex = newIndex;

      if (activeIndex >= 0 && items[activeIndex]) {
        const item = items[activeIndex];
        item.classList.add('bg-yellow-50', 'border-l-4', 'border-yellow-400');
        item.setAttribute('aria-selected', 'true');
        item.scrollIntoView({ block: 'nearest' });
      }
    }

    inputElement.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const query = inputElement.value;
        const res = search(query, options);
        renderDropdown(res);
        if (options.onSearch) {
          options.onSearch(res);
        }
      }, 40);
    });

    inputElement.addEventListener('focus', () => {
      if (inputElement.value.trim().length > 0) {
        const res = search(inputElement.value, options);
        renderDropdown(res);
      }
    });

    inputElement.addEventListener('keydown', (e) => {
      const items = dropdown.querySelectorAll('.autocomplete-item');
      if (dropdown.classList.contains('hidden') || !items.length) {
        if (e.key === 'ArrowDown' && inputElement.value.trim()) {
          const res = search(inputElement.value, options);
          renderDropdown(res);
          e.preventDefault();
        }
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = (activeIndex + 1) % items.length;
        updateActiveItem(next);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = (activeIndex - 1 + items.length) % items.length;
        updateActiveItem(prev);
      } else if (e.key === 'Enter') {
        if (activeIndex >= 0 && items[activeIndex]) {
          e.preventDefault();
          items[activeIndex].click();
        }
      } else if (e.key === 'Escape') {
        dropdown.classList.add('hidden');
        inputElement.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('click', (e) => {
      if (!inputElement.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add('hidden');
        inputElement.setAttribute('aria-expanded', 'false');
      }
    });

    return {
      search,
      close: () => {
        dropdown.classList.add('hidden');
        inputElement.setAttribute('aria-expanded', 'false');
      }
    };
  }

  // 7. GLOBAL MODAL SEARCH (Ctrl+K / Cmd+K)
  let globalModalInitialized = false;
  function initGlobalSearchModal() {
    if (globalModalInitialized) return;
    globalModalInitialized = true;

    // Listen for Ctrl+K or Cmd+K
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();

        // If homepage search input exists, focus it
        const hpSearch = document.getElementById('toolSearch');
        if (hpSearch) {
          hpSearch.focus();
          hpSearch.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }

        // If directory search input exists, focus it
        const dirSearch = document.getElementById('directorySearch');
        if (dirSearch) {
          dirSearch.focus();
          dirSearch.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }

        // If category search input exists, focus it
        const catSearch = document.getElementById('categorySearch');
        if (catSearch) {
          catSearch.focus();
          catSearch.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }

        // Otherwise, open global search modal
        openGlobalModal();
      }
    });
  }

  function openGlobalModal() {
    let modal = document.getElementById('afriwidgetGlobalSearchModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'afriwidgetGlobalSearchModal';
      modal.className = 'fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-6 md:p-20 bg-slate-950/70 backdrop-blur-sm transition-opacity';
      modal.innerHTML = `
        <div class="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden mt-6 sm:mt-10 animate-in fade-in zoom-in-95 duration-150">
          <div class="flex items-center px-4 py-3 border-b border-slate-200">
            <svg class="h-5 w-5 text-slate-400 shrink-0 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke-width="2"/><path stroke-linecap="round" stroke-width="2" d="m20 20-4-4"/></svg>
            <input id="modalSearchInput" type="search" class="w-full bg-transparent text-slate-900 placeholder:text-slate-400 outline-none text-base font-medium" placeholder="Search all 120+ tools (e.g. GPA, BMI, Mortgage, TVET)..." autocomplete="off">
            <kbd class="hidden sm:inline-block text-[11px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded shadow-2xs">Esc</kbd>
          </div>
          <div id="modalSearchResults" class="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-100">
            <div class="p-6 text-center text-slate-400 text-sm">Type to search tools across education, finance, health, and productivity...</div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });

      const inp = modal.querySelector('#modalSearchInput');
      const resultsCont = modal.querySelector('#modalSearchResults');

      inp.addEventListener('input', () => {
        const q = inp.value.trim();
        if (!q) {
          resultsCont.innerHTML = '<div class="p-6 text-center text-slate-400 text-sm">Type to search tools across education, finance, health, and productivity...</div>';
          return;
        }

        const { results, isClosestMatch } = search(q, { limit: 8 });
        if (results.length === 0) {
          resultsCont.innerHTML = '<div class="p-6 text-center text-slate-500 text-sm font-semibold">No tools found.</div>';
          return;
        }

        let html = '';
        if (isClosestMatch) {
          html += `<div class="p-2.5 mb-2 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-amber-900">Showing closest matching tools:</div>`;
        }

        results.forEach(r => {
          const t = r.tool;
          const catStyle = CATEGORY_STYLES[t.category] || CATEGORY_STYLES['Productivity'];
          const icon = getToolIcon(t);
          html += `
            <a href="${t.url || '/' + t.slug}" class="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
              <span class="text-xl p-2 rounded-lg ${catStyle.iconBg}">${icon}</span>
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between gap-2">
                  <h4 class="text-sm font-extrabold text-slate-900 group-hover:text-yellow-600 truncate">${escapeHtml(t.shortName || t.name)}</h4>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${catStyle.badgeBg}">${t.category}</span>
                </div>
                <p class="text-xs text-slate-500 line-clamp-1 mt-0.5">${escapeHtml(t.description)}</p>
              </div>
            </a>
          `;
        });
        resultsCont.innerHTML = html;
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const m = document.getElementById('afriwidgetGlobalSearchModal');
          if (m) m.remove();
        }
      });
    }

    const inp = modal.querySelector('#modalSearchInput');
    if (inp) {
      setTimeout(() => inp.focus(), 50);
    }
  }

  // 8. HOMEPAGE & DIRECTORY AUTO-INTEGRATION
  function initAfriWidgetSearch() {
    initGlobalSearchModal();

    // Category Hub Search Inputs (if any present)
    const catSearch = document.getElementById('categorySearch');
    if (catSearch) {
      attachAutocomplete(catSearch, { limit: 8 });
    }

    // 8.1 HOMEPAGE (index.html) INTEGRATION
    const toolSearch = document.getElementById('toolSearch');
    const toolSearchForm = document.getElementById('toolSearchForm');
    const toolSearchStatus = document.getElementById('toolSearchStatus');
    const toolSections = document.getElementById('toolSections');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const existingCards = Array.from(document.querySelectorAll('[data-tool-card]'));

    if (toolSearch && toolSections) {
      let activeCategory = 'all';

      // Attach autocomplete to homepage search
      attachAutocomplete(toolSearch, {
        limit: 8,
        onSearch: (searchRes) => {
          updateHomepageMatrix(searchRes);
        }
      });

      function updateHomepageMatrix(searchRes) {
        const query = (toolSearch.value || '').trim();
        const { results, isClosestMatch } = searchRes || search(query, { category: activeCategory, limit: 100 });

        // If query is empty, restore normal category view
        if (!query) {
          const dyn = document.getElementById('dynamicSearchResults');
          if (dyn) dyn.remove();

          existingCards.forEach(card => {
            const matchesCat = activeCategory === 'all' || card.dataset.category === activeCategory;
            card.hidden = !matchesCat;
          });

          document.querySelectorAll('[data-category-section]').forEach(sec => {
            const hasVisible = Array.from(sec.querySelectorAll('[data-tool-card]')).some(c => !c.hidden);
            sec.hidden = !hasVisible;
          });

          if (toolSearchStatus) {
            toolSearchStatus.classList.add('hidden');
            toolSearchStatus.textContent = '';
          }
          return;
        }

        // Active search query
        const matchedSlugs = new Set(results.map(r => r.tool.slug));

        // Hide static category sections during active search
        document.querySelectorAll('[data-category-section]').forEach(sec => {
          sec.hidden = true;
        });

        // Render clean unified search results container
        let dynContainer = document.getElementById('dynamicSearchResults');
        if (!dynContainer) {
          dynContainer = document.createElement('div');
          dynContainer.id = 'dynamicSearchResults';
          dynContainer.className = 'mt-6 space-y-6';
          toolSections.parentElement.insertBefore(dynContainer, toolSections);
        }

        let headerHtml = '';
        if (isClosestMatch) {
          headerHtml = `
            <div class="rounded-2xl bg-amber-50 border border-amber-200 p-4 sm:p-6 mb-6">
              <div class="flex items-center gap-2.5 text-amber-900 font-extrabold text-base sm:text-lg">
                <span class="text-xl">⚡</span>
                <span>No exact match for “${escapeHtml(query)}”. Here are the closest matching tools:</span>
              </div>
              <p class="mt-1 text-xs sm:text-sm text-amber-700">
                We couldn't find an exact tool named “${escapeHtml(query)}”, but these related calculators and tools might be what you're looking for:
              </p>
            </div>
          `;
        } else {
          headerHtml = `
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-4 mb-6">
              <div>
                <p class="text-xs font-bold uppercase tracking-wider text-yellow-700">Search Results</p>
                <h3 class="text-xl sm:text-2xl font-black text-slate-950">
                  ${results.length} ${results.length === 1 ? 'Tool' : 'Tools'} found for “${escapeHtml(query)}”
                </h3>
              </div>
              <button type="button" id="clearSearchResultsBtn" class="self-start sm:self-auto text-xs font-bold text-slate-600 hover:text-yellow-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition-colors shadow-2xs">
                Clear search
              </button>
            </div>
          `;
        }

        let cardsHtml = '<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">';
        results.forEach(item => {
          cardsHtml += renderToolCard(item.tool, isClosestMatch);
        });
        cardsHtml += '</div>';

        dynContainer.innerHTML = headerHtml + cardsHtml;
        dynContainer.hidden = false;

        const clearBtn = document.getElementById('clearSearchResultsBtn');
        if (clearBtn) {
          clearBtn.addEventListener('click', () => {
            toolSearch.value = '';
            updateHomepageMatrix({ results: [], isClosestMatch: false, query: '' });
            toolSearch.focus();
          });
        }

        if (toolSearchStatus) {
          toolSearchStatus.classList.remove('hidden');
          if (isClosestMatch) {
            toolSearchStatus.textContent = `Showing ${results.length} closest matching tools for “${query}”.`;
          } else {
            toolSearchStatus.textContent = `${results.length} ${results.length === 1 ? 'tool' : 'tools'} match “${query}” across all of AfriWidget.`;
          }
        }
      }

      if (toolSearchForm) {
        toolSearchForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const res = search(toolSearch.value, { category: activeCategory, limit: 60 });
          updateHomepageMatrix(res);
          const matrix = document.getElementById('toolsMatrix');
          if (matrix) {
            matrix.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }

      document.querySelectorAll('[data-quick-search]').forEach(chip => {
        chip.addEventListener('click', (e) => {
          e.preventDefault();
          const query = chip.dataset.quickSearch || chip.textContent.trim();
          toolSearch.value = query;
          activeCategory = 'all';

          categoryFilters.forEach(item => {
            const isAll = item.dataset.filter === 'all';
            item.classList.toggle('bg-slate-950', isAll);
            item.classList.toggle('text-white', isAll);
            item.classList.toggle('border-slate-950', isAll);
            item.classList.toggle('bg-white', !isAll);
            item.classList.toggle('text-slate-700', !isAll);
            item.classList.toggle('border-slate-300', !isAll);
          });

          const res = search(query, { category: 'all', limit: 60 });
          updateHomepageMatrix(res);
          toolSearch.focus();
          const matrix = document.getElementById('toolsMatrix');
          if (matrix) {
            matrix.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });

      categoryFilters.forEach(filter => {
        filter.addEventListener('click', () => {
          activeCategory = filter.dataset.filter || 'all';
          categoryFilters.forEach(item => {
            const isSelected = item === filter;
            item.classList.toggle('bg-slate-950', isSelected);
            item.classList.toggle('text-white', isSelected);
            item.classList.toggle('border-slate-950', isSelected);
            item.classList.toggle('bg-white', !isSelected);
            item.classList.toggle('text-slate-700', !isSelected);
            item.classList.toggle('border-slate-300', !isSelected);
          });

          if (toolSearch.value.trim()) {
            const res = search(toolSearch.value, { category: activeCategory, limit: 60 });
            updateHomepageMatrix(res);
          } else {
            updateHomepageMatrix({ results: [], isClosestMatch: false, query: '' });
          }
        });
      });
    }

    // 8.2 DIRECTORY SEARCH INTEGRATION
    const dirSearch = document.getElementById('directorySearch');
    const dirClear = document.getElementById('clearSearchBtn');
    const dirCount = document.getElementById('searchResultCount');
    const dirReset = document.getElementById('resetSearchBtn');
    const dirGrid = document.getElementById('toolGrid');
    const dirFilterBtns = document.querySelectorAll('.cat-filter-btn');

    if (dirSearch && dirGrid) {
      let activeDirCategory = 'all';

      attachAutocomplete(dirSearch, {
        limit: 8,
        onSearch: (searchRes) => {
          updateDirectoryResults(searchRes);
        }
      });

      function updateDirectoryResults(searchRes) {
        const query = (dirSearch.value || '').trim();
        const { results, isClosestMatch } = searchRes || search(query, { category: activeDirCategory, limit: 120 });

        if (dirClear) {
          dirClear.classList.toggle('hidden', !query);
        }

        if (!query) {
          const dyn = document.getElementById('dirSearchResults');
          if (dyn) dyn.remove();

          const cards = dirGrid.querySelectorAll('.tool-card');
          let count = 0;
          cards.forEach(c => {
            const cat = (c.dataset.category || '').toLowerCase();
            const visible = activeDirCategory === 'all' || cat.includes(activeDirCategory.toLowerCase());
            c.classList.toggle('hidden', !visible);
            if (visible) count++;
          });

          dirGrid.querySelectorAll('[id$="-tools"]').forEach(h => {
            let catKey = h.id.replace('-tools', '').toLowerCase();
            if (catKey === 'real-estate') catKey = 'realestate';
            const show = activeDirCategory === 'all' || catKey.includes(activeDirCategory.toLowerCase());
            h.classList.toggle('hidden', !show);
          });

          if (dirCount) {
            dirCount.textContent = (activeDirCategory === 'all' ? AFRIWIDGET_TOOLS.length : count) + ' Tools';
            dirCount.className = 'hidden sm:inline-flex items-center px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg shrink-0';
          }
          return;
        }

        dirGrid.querySelectorAll('.tool-card, [id$="-tools"]').forEach(el => {
          el.classList.add('hidden');
        });

        let dyn = document.getElementById('dirSearchResults');
        if (!dyn) {
          dyn = document.createElement('div');
          dyn.id = 'dirSearchResults';
          dyn.className = 'col-span-full w-full space-y-6';
          dirGrid.insertBefore(dyn, dirGrid.firstChild);
        }

        let headerHtml = '';
        if (isClosestMatch) {
          headerHtml = `
            <div class="rounded-2xl bg-amber-50 border border-amber-200 p-4 sm:p-6 mb-6">
              <div class="flex items-center gap-2.5 text-amber-900 font-extrabold text-base sm:text-lg">
                <span class="text-xl">⚡</span>
                <span>No exact match for “${escapeHtml(query)}”. Showing closest matching tools:</span>
              </div>
            </div>
          `;
        }

        let cardsHtml = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">';
        results.forEach(item => {
          cardsHtml += renderToolCard(item.tool, isClosestMatch);
        });
        cardsHtml += '</div>';

        dyn.innerHTML = headerHtml + cardsHtml;
        dyn.hidden = false;

        if (dirCount) {
          dirCount.textContent = isClosestMatch 
            ? `${results.length} Closest Matches` 
            : `${results.length} Tools found`;
          dirCount.className = 'hidden sm:inline-flex items-center px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-100 rounded-lg shrink-0';
        }
      }

      if (dirClear) {
        dirClear.addEventListener('click', () => {
          dirSearch.value = '';
          updateDirectoryResults({ results: [], isClosestMatch: false, query: '' });
          dirSearch.focus();
        });
      }

      if (dirReset) {
        dirReset.addEventListener('click', () => {
          dirSearch.value = '';
          activeDirCategory = 'all';
          updateActiveFilterButtons();
          updateDirectoryResults({ results: [], isClosestMatch: false, query: '' });
          dirSearch.focus();
        });
      }

      document.querySelectorAll('[data-search-tag]').forEach(tag => {
        tag.addEventListener('click', (e) => {
          e.preventDefault();
          const q = tag.dataset.searchTag || tag.textContent.trim();
          dirSearch.value = q;
          const res = search(q, { category: activeDirCategory, limit: 120 });
          updateDirectoryResults(res);
          dirSearch.focus();
        });
      });

      function updateActiveFilterButtons() {
        dirFilterBtns.forEach(btn => {
          const cat = btn.getAttribute('data-category-filter') || btn.dataset.category || 'all';
          const isSel = (cat === activeDirCategory);
          if (isSel) {
            btn.className = 'cat-filter-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border bg-slate-950 text-white border-slate-950 transition-all shadow-sm';
            const badge = btn.querySelector('span:last-child');
            if (badge) badge.className = 'inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] bg-yellow-400 text-slate-950 font-black';
          } else {
            btn.className = 'cat-filter-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-slate-400 transition-all';
            const badge = btn.querySelector('span:last-child');
            if (badge) badge.className = 'inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600 font-bold';
          }
        });
      }

      dirFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          activeDirCategory = btn.getAttribute('data-category-filter') || btn.dataset.category || 'all';
          updateActiveFilterButtons();
          const res = search(dirSearch.value, { category: activeDirCategory, limit: 120 });
          updateDirectoryResults(res);
        });
      });
    }
  }

  // EXPORT GLOBAL API
  window.AFRIWIDGET_TOOLS = AFRIWIDGET_TOOLS;
  window.AfriWidgetSearch = {
    tools: AFRIWIDGET_TOOLS,
    search: search,
    attachAutocomplete: attachAutocomplete,
    renderToolCard: renderToolCard,
    highlightMatches: highlightMatches
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAfriWidgetSearch);
  } else {
    initAfriWidgetSearch();
  }
})();
