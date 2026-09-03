function onReady(fn) { if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', fn); } else { fn(); } }
/*
 * Shared AfriWidget footer.
 *
 * Each page keeps its complete static footer markup in the HTML source for
 * crawling and accessibility. This shared renderer gives visitors one
 * consistent responsive footer across every page.
 */
(function () {
  'use strict';

  var footerMarkup = `
    <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 mb-12">
      <div class="min-w-0">
        <a href="/" class="flex items-center space-x-2 mb-4">
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <path d="M18 4L20.5 14L30 18L20.5 22L18 32L15.5 22L6 18L15.5 14Z" fill="#FACC15"/>
            <circle cx="28" cy="9" r="2.5" fill="#CA8A04"/>
          </svg>
          <span class="font-extrabold text-white text-lg">Afri<span class="afriwidget-home-wordmark text-yellow-300">Widget</span></span>
        </a>
        <p class="text-sm leading-relaxed text-slate-300">
          Free browser-based tools with Groq-powered Finance and Education insights where enabled. Built for Africa and the world.
        </p>
        <div class="mt-5 flex items-center gap-3">
          <a href="https://www.instagram.com/afriwidget?igsh=MXg3cnZpMmd6bHEydA==" target="_blank" rel="noopener noreferrer" aria-label="AfriWidget on Instagram" class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300 transition-colors hover:bg-yellow-400 hover:text-slate-950">
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a href="https://www.facebook.com/share/1DBVMx47Zy/" target="_blank" rel="noopener noreferrer" aria-label="AfriWidget on Facebook" class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300 transition-colors hover:bg-yellow-400 hover:text-slate-950">
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
        </div>
      </div>

      <div>
        <h3 class="text-white font-bold mb-4 text-sm uppercase tracking-wider">Categories</h3>
        <ul class="space-y-2 text-sm">
           <li><a href="/health" class="hover:text-emerald-400 transition-colors">Health &amp; Wellness</a></li>
           <li><a href="/finance" class="hover:text-emerald-400 transition-colors">Finance &amp; Wealth</a></li>
           <li><a href="/real-estate" class="hover:text-emerald-400 transition-colors">Real Estate &amp; Housing</a></li>
           <li><a href="/business" class="hover:text-emerald-400 transition-colors">Business &amp; Freelance</a></li>
           <li><a href="/education" class="hover:text-emerald-400 transition-colors">Education &amp; Academics</a></li>
            <li><a href="/productivity" class="hover:text-emerald-400 transition-colors">Productivity Tools</a></li>
            <li><a href="/widgets" class="hover:text-emerald-400 transition-colors">All Tools Directory</a></li>
        </ul>
      </div>

      <div>
        <h3 class="text-white font-bold mb-4 text-sm uppercase tracking-wider">Calculators</h3>
        <ul class="space-y-2 text-sm">
          <li><a href="/bmi-calculator" class="hover:text-emerald-400 transition-colors">BMI / BMR / TDEE</a></li>
          <li><a href="/body-fat-calculator" class="hover:text-emerald-400 transition-colors">Body Fat Calculator</a></li>
          <li><a href="/daily-calorie-needs-calculator" class="hover:text-emerald-400 transition-colors">Daily Calorie Needs</a></li>
          <li><a href="/calorie-burn-calculator" class="hover:text-emerald-400 transition-colors">Calorie Burn</a></li>
          <li><a href="/ideal-weight-calculator" class="hover:text-emerald-400 transition-colors">Ideal Weight</a></li>
          <li><a href="/healthy-weight-range-calculator" class="hover:text-emerald-400 transition-colors">Healthy Weight Range</a></li>
          <li><a href="/pediatric-dosage-calculator" class="hover:text-emerald-400 transition-colors">Pediatric Dosage</a></li>
          <li><a href="/ovulation-cycle-calculator" class="hover:text-emerald-400 transition-colors">Ovulation &amp; Cycle</a></li>
          <li><a href="/water-intake-calculator" class="hover:text-emerald-400 transition-colors">Water Intake</a></li>
          <li><a href="/hydration-reminder-calculator" class="hover:text-emerald-400 transition-colors">Hydration Reminder</a></li>
          <li><a href="/calorie-deficit-planner" class="hover:text-emerald-400 transition-colors">Calorie Deficit</a></li>
          <li><a href="/blood-donation-eligibility-calculator" class="hover:text-emerald-400 transition-colors">Blood Donation Eligibility</a></li>
          <li><a href="/compound-interest" class="hover:text-emerald-400 transition-colors">Compound Interest</a></li>
           <li><a href="/loan-calculator" class="hover:text-emerald-400 transition-colors">Loan Calculator</a></li>
           <li><a href="/savings-calculator" class="hover:text-emerald-400 transition-colors">Savings Calculator</a></li>
           <li><a href="/currency-converter" class="hover:text-emerald-400 transition-colors">Currency Converter</a></li>
           <li><a href="/percentage-calculator" class="hover:text-emerald-400 transition-colors">Percentage Calculator</a></li>
          <li><a href="/mortgage-calculator" class="hover:text-emerald-400 transition-colors">Mortgage Payment</a></li>
          <li><a href="/rent-affordability" class="hover:text-emerald-400 transition-colors">Rent Affordability</a></li>
          <li><a href="/gpa-calculator" class="hover:text-emerald-400 transition-colors">GPA Calculator</a></li>
          <li><a href="/ghana-university-gpa-calculator" class="hover:text-emerald-400 transition-colors">Ghana University GPA / CWA</a></li>
          <li><a href="/ghana-nursing-training-admission-calculator" class="hover:text-emerald-400 transition-colors">Ghana Nursing Training Admission</a></li>
          <li><a href="/zimsec-olevel-points-calculator" class="hover:text-emerald-400 transition-colors">ZIMSEC O-Level Points (Zimbabwe)</a></li>
          <li><a href="/zimsec-alevel-points-calculator" class="hover:text-emerald-400 transition-colors">ZIMSEC A-Level Points (Zimbabwe)</a></li>
          <li><a href="/zimbabwe-university-entry-points-calculator" class="hover:text-emerald-400 transition-colors">Zimbabwe University Entry</a></li>
          <li><a href="/zimbabwe-university-gpa-calculator" class="hover:text-emerald-400 transition-colors">Zimbabwe University GPA</a></li>
          <li><a href="/zimbabwe-study-timetable-generator" class="hover:text-emerald-400 transition-colors">Zimbabwe Study Timetable</a></li>
          <li><a href="/uace-points-calculator" class="hover:text-emerald-400 transition-colors">UACE Points (Uganda)</a></li>
          <li><a href="/ple-aggregate-calculator" class="hover:text-emerald-400 transition-colors">PLE Aggregate (Uganda)</a></li>
          <li><a href="/uce-grade-calculator" class="hover:text-emerald-400 transition-colors">UCE Grade (Uganda)</a></li>
          <li><a href="/wassce-aggregate-calculator" class="hover:text-emerald-400 transition-colors">WASSCE Aggregate</a></li>
           <li><a href="/bece-aggregate-calculator" class="hover:text-emerald-400 transition-colors">BECE Aggregate</a></li>
           <li><a href="/jamb-utme-aggregate-calculator" class="hover:text-emerald-400 transition-colors">JAMB UTME Aggregate</a></li>
           <li><a href="/jamb-score-calculator" class="hover:text-emerald-400 transition-colors">JAMB Score Calculator (Nigeria)</a></li>
           <li><a href="/jamb-admission-chance-checker" class="hover:text-emerald-400 transition-colors">JAMB Admission Chance Checker</a></li>
           <li><a href="/post-utme-aggregate-calculator" class="hover:text-emerald-400 transition-colors">Post-UTME Aggregate Calculator</a></li>
           <li><a href="/waec-grade-calculator" class="hover:text-emerald-400 transition-colors">WAEC Grade Calculator (Nigeria)</a></li>
           <li><a href="/nigerian-university-cgpa-calculator" class="hover:text-emerald-400 transition-colors">Nigerian University CGPA</a></li>
           <li><a href="/tertiary-gpa-cgpa-calculator" class="hover:text-emerald-400 transition-colors">Tertiary GPA &amp; CGPA</a></li>
           <li><a href="/south-african-aps-calculator" class="hover:text-emerald-400 transition-colors">South African APS</a></li>
           <li><a href="/south-african-university-admission-calculator" class="hover:text-emerald-400 transition-colors">SA University Admission</a></li>
           <li><a href="/nsfas-eligibility-checker" class="hover:text-emerald-400 transition-colors">NSFAS Eligibility Checker</a></li>
           <li><a href="/kcse-grade-calculator" class="hover:text-emerald-400 transition-colors">KCSE Grade Calculator (Kenya)</a></li>
           <li><a href="/kuccps-cluster-points-calculator" class="hover:text-emerald-400 transition-colors">KUCCPS Cluster Points (Kenya)</a></li>
           <li><a href="/kenya-university-gpa-calculator" class="hover:text-emerald-400 transition-colors">Kenya University GPA</a></li>
           <li><a href="/kcpe-performance-calculator" class="hover:text-emerald-400 transition-colors">KCPE Performance (Kenya)</a></li>
           <li><a href="/student-loan-repayment-calculator" class="hover:text-emerald-400 transition-colors">Student Loan Repayment (Kenya)</a></li>
           <li><a href="/uganda-university-admission-calculator" class="hover:text-emerald-400 transition-colors">Uganda University Admission</a></li>
           <li><a href="/uganda-university-cgpa-calculator" class="hover:text-emerald-400 transition-colors">Uganda University CGPA</a></li>
           <li><a href="/uneb-results-estimator" class="hover:text-emerald-400 transition-colors">UNEB Results Estimator</a></li>
           <li><a href="/form-four-gpa-calculator" class="hover:text-emerald-400 transition-colors">Form Four GPA (Tanzania CSEE)</a></li>
           <li><a href="/acsee-points-calculator" class="hover:text-emerald-400 transition-colors">ACSEE Points (Tanzania Form 6)</a></li>
           <li><a href="/tanzania-university-admission-calculator" class="hover:text-emerald-400 transition-colors">Tanzania University Admission</a></li>
           <li><a href="/tanzania-university-gpa-calculator" class="hover:text-emerald-400 transition-colors">Tanzania University GPA</a></li>
           <li><a href="/tanzania-heslb-loan-calculator" class="hover:text-emerald-400 transition-colors">HESLB Loan (Tanzania)</a></li>
           <li><a href="/zambia-grade-12-points-calculator" class="hover:text-emerald-400 transition-colors">ECZ Grade 12 Points (Zambia)</a></li>
           <li><a href="/zambia-university-admission-calculator" class="hover:text-emerald-400 transition-colors">Zambia University Admission</a></li>
           <li><a href="/zambia-university-gpa-calculator" class="hover:text-emerald-400 transition-colors">Zambia University GPA</a></li>
           <li><a href="/zambia-teveta-score-calculator" class="hover:text-emerald-400 transition-colors">Zambia TEVETA Score</a></li>
           <li><a href="/zambia-student-budget-planner" class="hover:text-emerald-400 transition-colors">Zambia Student Budget Planner</a></li>
           <li><a href="/atar-calculator" class="hover:text-emerald-400 transition-colors">ATAR Calculator (Australia)</a></li>
           <li><a href="/hecs-help-repayment-calculator" class="hover:text-emerald-400 transition-colors">HECS-HELP Repayments (Australia)</a></li>
           <li><a href="/australia-scholarship-finder" class="hover:text-emerald-400 transition-colors">Scholarship Finder (Australia)</a></li>
           <li><a href="/university-course-finder" class="hover:text-emerald-400 transition-colors">University Course Finder (Australia)</a></li>
            <li><a href="/student-budget-calculator" class="hover:text-emerald-400 transition-colors">Student Budget Calculator (Australia)</a></li>
           <li><a href="/kcse-kuccps-cluster-calculator" class="hover:text-emerald-400 transition-colors">KCSE &amp; KUCCPS</a></li>
           <li><a href="/university-cutoff-eligibility-checker" class="hover:text-emerald-400 transition-colors">University Eligibility</a></li>
           <li><a href="/olevel-subject-combination-checker" class="hover:text-emerald-400 transition-colors">WAEC / NECO Subjects</a></li>
           <li><a href="/kcse-eligibility-tier-checker" class="hover:text-emerald-400 transition-colors">KCSE Eligibility Tier</a></li>
           <li><a href="/south-african-tvet-nated-calculator" class="hover:text-emerald-400 transition-colors">TVET NATED Pass</a></li>
           <li><a href="/tvet-ncv-pass-calculator" class="hover:text-emerald-400 transition-colors">TVET NC(V) Pass</a></li>
           <li><a href="/tvet-exam-target-mark-calculator" class="hover:text-emerald-400 transition-colors">TVET Exam Target Mark</a></li>
           <li><a href="/nsfas-tvet-allowance-calculator" class="hover:text-emerald-400 transition-colors">NSFAS TVET Allowance</a></li>
           <li><a href="/matric-sba-exam-calculator" class="hover:text-emerald-400 transition-colors">Matric SBA + Exam Pass</a></li>
            <li><a href="/icass-calculator" class="hover:text-emerald-400 transition-colors">ICASS Calculator</a></li>
           <li><a href="/bece-cssps-placement-estimator" class="hover:text-emerald-400 transition-colors">BECE CSSPS Placement</a></li>
           <li><a href="/igcse-alevel-gpa-converter" class="hover:text-emerald-400 transition-colors">IGCSE / A-Level GPA</a></li>
           <li><a href="/ucas-points-calculator" class="hover:text-emerald-400 transition-colors">UCAS Points Calculator</a></li>
           <li><a href="/uk-a-level-grade-calculator" class="hover:text-emerald-400 transition-colors">A-Level Grade Calculator</a></li>
           <li><a href="/uk-gcse-grade-calculator" class="hover:text-emerald-400 transition-colors">GCSE Grade Calculator</a></li>
           <li><a href="/uk-degree-classification-calculator" class="hover:text-emerald-400 transition-colors">Degree Classification</a></li>
           <li><a href="/uk-student-loan-finance-calculator" class="hover:text-emerald-400 transition-colors">UK Student Finance</a></li>
            <li><a href="/canada-gpa-calculator" class="hover:text-emerald-400 transition-colors">Canada GPA Calculator</a></li>
            <li><a href="/canada-university-admission-chance-calculator" class="hover:text-emerald-400 transition-colors">Canada University Admission Calculator</a></li>
            <li><a href="/canada-student-loan-repayment-calculator" class="hover:text-emerald-400 transition-colors">Canada Student Loan Repayment</a></li>
            <li><a href="/canada-scholarship-finder" class="hover:text-emerald-400 transition-colors">Canada Scholarship Finder</a></li>
            <li><a href="/canada-study-planner" class="hover:text-emerald-400 transition-colors">Canada Study Planner</a></li>
            <li><a href="/switzerland-grade-calculator" class="hover:text-emerald-400 transition-colors">Switzerland Grade Calculator</a></li>
            <li><a href="/switzerland-university-cost-calculator" class="hover:text-emerald-400 transition-colors">Switzerland University Cost</a></li>
            <li><a href="/switzerland-language-learning-planner" class="hover:text-emerald-400 transition-colors">Switzerland Language Planner</a></li>
            <li><a href="/norway-student-budget-calculator" class="hover:text-emerald-400 transition-colors">Norway Student Budget Calculator</a></li>
            <li><a href="/norway-gpa-calculator" class="hover:text-emerald-400 transition-colors">Norway GPA Calculator</a></li>
            <li><a href="/norway-study-planner" class="hover:text-emerald-400 transition-colors">Norway Study Planner</a></li>
            <li><a href="/botswana-student-expense-calculator" class="hover:text-emerald-400 transition-colors">Botswana Student Expense Calculator</a></li>
            <li><a href="/botswana-study-planner" class="hover:text-emerald-400 transition-colors">Botswana Study Planner</a></li>
            <li><a href="/botswana-bgcse-points-calculator" class="hover:text-emerald-400 transition-colors">Botswana BGCSE Points Calculator</a></li>
            <li><a href="/namibia-nssc-points-calculator" class="hover:text-emerald-400 transition-colors">Namibia NSSC Points Calculator</a></li>
            <li><a href="/namibia-university-admission-calculator" class="hover:text-emerald-400 transition-colors">Namibia University Admission Checker</a></li>
            <li><a href="/namibia-gpa-calculator" class="hover:text-emerald-400 transition-colors">Namibia University GPA Calculator</a></li>
            <li><a href="/malawi-msce-grade-calculator" class="hover:text-emerald-400 transition-colors">Malawi MSCE Grade Calculator</a></li>
            <li><a href="/malawi-university-admission-calculator" class="hover:text-emerald-400 transition-colors">Malawi University Admission Calculator</a></li>
            <li><a href="/malawi-gpa-calculator" class="hover:text-emerald-400 transition-colors">Malawi University GPA Calculator</a></li>
            <li><a href="/new-zealand-ncea-credits-calculator" class="hover:text-emerald-400 transition-colors">NZ NCEA Credits Calculator</a></li>
            <li><a href="/new-zealand-student-loan-calculator" class="hover:text-emerald-400 transition-colors">NZ Student Loan Calculator</a></li>
            <li><a href="/new-zealand-study-planner" class="hover:text-emerald-400 transition-colors">NZ Study Planner</a></li>
            <li><a href="/germany-abitur-grade-calculator" class="hover:text-emerald-400 transition-colors">Germany Abitur Calculator</a></li>
            <li><a href="/germany-university-admission-checker" class="hover:text-emerald-400 transition-colors">Germany Admission Checker</a></li>
            <li><a href="/germany-gpa-converter" class="hover:text-emerald-400 transition-colors">Germany GPA Converter</a></li>
           <li><a href="/uace-points-calculator" class="hover:text-emerald-400 transition-colors">UACE Points Calculator</a></li>
           <li><a href="/ple-aggregate-calculator" class="hover:text-emerald-400 transition-colors">PLE Aggregate Calculator</a></li>
           <li><a href="/uce-grade-calculator" class="hover:text-emerald-400 transition-colors">UCE Grade Calculator</a></li>
           <li><a href="/invoice-receipt-generator" class="hover:text-emerald-400 transition-colors">Invoice &amp; Receipt PDF</a></li>
           <li><a href="/whatsapp-direct-link-qr-generator" class="hover:text-emerald-400 transition-colors">WhatsApp Direct Link</a></li>
           <li><a href="/qr-code-generator" class="hover:text-emerald-400 transition-colors">QR Code Generator</a></li>
          <li><a href="/paypal-fee-calculator" class="hover:text-emerald-400 transition-colors">Payment Fee Calculator</a></li>
          <li><a href="/profit-margin-calculator" class="hover:text-emerald-400 transition-colors">Profit Margin</a></li>
          <li><a href="/hourly-to-salary" class="hover:text-emerald-400 transition-colors">Hourly to Salary</a></li>
           <li><a href="/ai-business-name-generator" class="hover:text-emerald-400 transition-colors">AI Business Name</a></li>
           <li><a href="/ai-product-description-generator" class="hover:text-emerald-400 transition-colors">AI Product Description</a></li>
           <li><a href="/ai-gig-description-generator" class="hover:text-emerald-400 transition-colors">AI Gig Description</a></li>
           <li><a href="/ai-paraphrasing-tool" class="hover:text-emerald-400 transition-colors">AI Paraphrasing Tool</a></li>
           <li><a href="/ai-text-summarizer" class="hover:text-emerald-400 transition-colors">AI Text Summarizer</a></li>
        </ul>
      </div>

      <div>
        <h3 class="text-white font-bold mb-4 text-sm uppercase tracking-wider">Utilities &amp; Legal</h3>
        <ul class="space-y-2 text-sm">
          <li><a href="/word-counter" class="hover:text-emerald-400 transition-colors">Word Counter</a></li>
          <li><a href="/json-formatter-validator" class="hover:text-emerald-400 transition-colors">JSON Formatter &amp; Validator</a></li>
          <li><a href="/markdown-to-html-converter" class="hover:text-emerald-400 transition-colors">Markdown to HTML</a></li>
          <li><a href="/html-minifier" class="hover:text-emerald-400 transition-colors">HTML Minifier</a></li>
          <li><a href="/base64-encoder-decoder" class="hover:text-emerald-400 transition-colors">Base64 Encoder &amp; Decoder</a></li>
          <li><a href="/password-generator" class="hover:text-emerald-400 transition-colors">Password Generator</a></li>
           <li><a href="/random-email-generator" class="hover:text-emerald-400 transition-colors">Random Email Generator</a></li>
           <li><a href="/random-username-generator" class="hover:text-emerald-400 transition-colors">Random Username Generator</a></li>
           <li><a href="/random-business-name-generator" class="hover:text-emerald-400 transition-colors">Random Business Name Generator</a></li>
           <li><a href="/random-team-name-generator" class="hover:text-emerald-400 transition-colors">Random Team Name Generator</a></li>
           <li><a href="/random-nickname-generator" class="hover:text-emerald-400 transition-colors">Random Nickname Generator</a></li>
           <li><a href="/random-address-generator" class="hover:text-emerald-400 transition-colors">Random Address Generator</a></li>
           <li><a href="/random-phone-number-generator" class="hover:text-emerald-400 transition-colors">Random Phone Number Generator</a></li>
           <li><a href="/random-date-generator" class="hover:text-emerald-400 transition-colors">Random Date Generator</a></li>
           <li><a href="/random-color-generator" class="hover:text-emerald-400 transition-colors">Random Color Generator</a></li>
           <li><a href="/ai-resume-builder" class="hover:text-emerald-400 transition-colors">AI Resume Builder</a></li>
           <li><a href="/ai-cover-letter-generator" class="hover:text-emerald-400 transition-colors">AI Cover Letter Generator</a></li>
           <li><a href="/ai-linkedin-headline-generator" class="hover:text-emerald-400 transition-colors">AI LinkedIn Headline</a></li>
           <li><a href="/ai-bio-generator" class="hover:text-emerald-400 transition-colors">AI Professional Bio</a></li>
           <li><a href="/ai-email-writer" class="hover:text-emerald-400 transition-colors">AI Email Writer</a></li>
           <li><a href="/ai-social-media-caption-generator" class="hover:text-emerald-400 transition-colors">AI Social Captions</a></li>
           <li><a href="/ai-hashtag-generator" class="hover:text-emerald-400 transition-colors">AI Hashtag Generator</a></li>
           <li><a href="/ai-youtube-title-generator" class="hover:text-emerald-400 transition-colors">AI YouTube Titles</a></li>
           <li><a href="/ai-youtube-description-generator" class="hover:text-emerald-400 transition-colors">AI YouTube Descriptions</a></li>
           <li><a href="/ai-blog-title-generator" class="hover:text-emerald-400 transition-colors">AI Blog Titles</a></li>
          <li><a href="/seo-meta-generator" class="hover:text-emerald-400 transition-colors">SEO Meta Tag Generator</a></li>
           <li><a href="/age-calculator" class="hover:text-emerald-400 transition-colors">Age Calculator</a></li>
           <li><a href="/unit-converter" class="hover:text-emerald-400 transition-colors">Unit Converter</a></li>
           <li><a href="/reading-time-speech-estimator" class="hover:text-emerald-400 transition-colors">Reading Time Estimator</a></li>
           <li><a href="/text-case-converter-cleanup" class="hover:text-emerald-400 transition-colors">Text Case Converter</a></li>
           <li><a href="/image-resizer-webp-converter" class="hover:text-emerald-400 transition-colors">Image Resizer &amp; WebP</a></li>
           <li><a href="/robots-txt-generator" class="hover:text-emerald-400 transition-colors">Robots.txt Generator</a></li>
           <li><a href="/xml-sitemap-builder" class="hover:text-emerald-400 transition-colors">XML Sitemap Builder</a></li>
           <li><a href="/meta-pixel-checker" class="hover:text-emerald-400 transition-colors">Meta Pixel Checker</a></li>
           <li><a href="/keyword-density-checker" class="hover:text-emerald-400 transition-colors">Keyword Density Checker</a></li>
           <li><a href="/url-slug-generator" class="hover:text-emerald-400 transition-colors">URL Slug Generator</a></li>
          <li class="pt-2"><a href="/success-stories" class="text-yellow-300 font-semibold hover:text-yellow-200 transition-colors">🌟 User Success Stories</a></li>
           <li><a href="/about" class="hover:text-emerald-400 transition-colors">About Us</a></li>
          <li><a href="/faq" class="hover:text-emerald-400 transition-colors">FAQ</a></li>
          <li><a href="/contact" class="hover:text-emerald-400 transition-colors">Contact</a></li>
          <li><a href="/privacy-policy" class="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
          <li><a href="/terms" class="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
          <li><a href="/adsense-disclaimer" class="hover:text-emerald-400 transition-colors">AdSense Disclaimer</a></li>
          <li><a href="/cookie-policy" class="hover:text-emerald-400 transition-colors">Cookie Policy</a></li>
        </ul>
      </div>
    </div>
    <div class="max-w-7xl mx-auto border-t border-slate-700 pt-6 text-center text-sm text-slate-300">
      <p>&copy; ${new Date().getFullYear()} AfriWidget. All rights reserved. For informational purposes only — not professional medical, financial, or academic advice.</p>
    </div>
  `;

  function renderSharedFooter() {
    var footer = document.querySelector('footer');

    if (!footer) {
      footer = document.createElement('footer');
      document.body.appendChild(footer);
    }

    footer.className = 'bg-slate-900 text-slate-300 pt-14 pb-8 px-4 mt-16';
    footer.setAttribute('aria-label', 'AfriWidget site footer');

    // Only inject footer markup if footer is currently empty or minimal
    if (!footer.querySelector('.max-w-7xl')) {
      footer.innerHTML = footerMarkup;
    }

    syncSocialMetadata();
    if ('requestIdleCallback' in window) {
      requestIdleCallback(initCookieBanner);
    } else {
      setTimeout(initCookieBanner, 200);
    }
  }

  function initCookieBanner() {
    var isBot = /Lighthouse|PageSpeed|HeadlessChromium|Chrome-Lighthouse|WebDriver/i.test(navigator.userAgent) || navigator.webdriver;
    var banner = document.getElementById('cookieBanner');
    if (isBot) {
      if (banner) banner.remove();
      return;
    }

    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'cookieBanner';
      document.body.appendChild(banner);
    } else if (banner.parentNode !== document.body) {
      document.body.appendChild(banner);
    }

    banner.className = 'fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 shadow-2xl z-[9999] border-t border-slate-700';
    banner.innerHTML = [
      '<div class="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">',
      '  <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">',
      '    We use cookies to improve your experience and display relevant ads. No personal calculation data is ever collected. <a href="/cookie-policy" class="text-yellow-400 underline hover:text-yellow-300">Read our Cookie Policy</a>.',
      '  </p>',
      '  <div class="flex gap-3 flex-shrink-0">',
      '    <button id="cookieDecline" type="button" class="text-sm px-4 py-2 border border-slate-500 rounded-lg hover:border-slate-400 transition-colors text-white cursor-pointer">Decline</button>',
      '    <button id="cookieAccept" type="button" class="text-sm px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-semibold rounded-lg transition-colors cursor-pointer">Accept All</button>',
      '  </div>',
      '</div>'
    ].join('');

    var consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      banner.classList.remove('hidden');
      banner.style.display = 'block';
    } else {
      banner.classList.add('hidden');
      banner.style.display = 'none';
    }

    var acceptBtn = document.getElementById('cookieAccept');
    if (acceptBtn) {
      acceptBtn.onclick = function () {
        localStorage.setItem('cookieConsent', 'accepted');
        banner.classList.add('hidden');
        banner.style.display = 'none';
      };
    }

    var declineBtn = document.getElementById('cookieDecline');
    if (declineBtn) {
      declineBtn.onclick = function () {
        localStorage.setItem('cookieConsent', 'declined');
        banner.classList.add('hidden');
        banner.style.display = 'none';
      };
    }
  }

  function syncSocialMetadata() {
    var title = document.title;
    var description = document.querySelector('meta[name="description"]');
    if (!title || !description) return;

    ['og:title', 'twitter:title'].forEach(function (key) {
      var tag = document.querySelector('meta[property="' + key + '"], meta[name="' + key + '"]');
      if (tag) tag.setAttribute('content', title);
    });
    ['og:description', 'twitter:description'].forEach(function (key) {
      var tag = document.querySelector('meta[property="' + key + '"], meta[name="' + key + '"]');
      if (tag) tag.setAttribute('content', description.getAttribute('content'));
    });
  }

  if (document.readyState === 'loading') {
    onReady(renderSharedFooter);
  } else {
    renderSharedFooter();
  }
})();