/**
 * AfriWidget "Continue Where You Left Off" & Progress Engine
 * 1. Tracks recently visited tools locally in the browser (localStorage: 'afriwidget_recent_tools').
 * 2. Automatically saves and restores user progress & inputs within supported tools (localStorage: 'afriwidget_progress_<url>').
 * Zero accounts, zero login, zero tracking scripts, 100% private.
 * Pure vanilla JavaScript (Zero Tailwind, Zero Emojis, 100% Crisp SVG Icons).
 * Matches AfriWidget Brand System (#000000, #facc15, #ca8a04, #ffffff, #e5e5e5).
 */
(function () {
  'use strict';

  if (typeof window === 'undefined') return;

  var STORAGE_KEY = 'afriwidget_recent_tools';
  var PROGRESS_PREFIX = 'afriwidget_progress_';
  var MAX_ITEMS = 6;
  var EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days expiration
  var REMOVED_TOOL_PATHS = new Set([
    '/bmi-calculator', '/body-fat-calculator', '/calorie-burn-calculator',
    '/daily-calorie-needs-calculator', '/ghana-nursing-training-admission-calculator',
    '/healthy-weight-range-calculator', '/hydration-reminder-calculator',
    '/ideal-weight-calculator', '/ovulation-cycle-calculator', '/water-intake-calculator'
  ]);

  // Pristine Tool Directory Lookup (All 126 AfriWidget Tools)
  var TOOL_MAP = {
  "acsee-points-calculator": {
    "name": "ACSEE Points Calculator",
    "category": "Education",
    "url": "/acsee-points-calculator"
  },
  "ai-business-name-generator": {
    "name": "AI Business Name Generator",
    "category": "Finance",
    "url": "/ai-business-name-generator"
  },
  "ai-gig-description-generator": {
    "name": "AI Gig Description Generator",
    "category": "Finance",
    "url": "/ai-gig-description-generator"
  },
  "ai-paraphrasing-tool": {
    "name": "AI Paraphrasing Tool",
    "category": "Finance",
    "url": "/ai-paraphrasing-tool"
  },
  "ai-product-description-generator": {
    "name": "AI Product Description Generator",
    "category": "Finance",
    "url": "/ai-product-description-generator"
  },
  "ai-text-summarizer": {
    "name": "AI Text Summarizer",
    "category": "Finance",
    "url": "/ai-text-summarizer"
  },
  "atar-calculator": {
    "name": "ATAR Calculator (Australia)",
    "category": "Education",
    "url": "/atar-calculator"
  },
  "australia-scholarship-finder": {
    "name": "Australia Scholarship Finder",
    "category": "Education",
    "url": "/australia-scholarship-finder"
  },
  "base64-encoder-decoder": {
    "name": "Base64 Encoder & Decoder",
    "category": "Productivity",
    "url": "/base64-encoder-decoder"
  },
  "bece-aggregate-calculator": {
    "name": "BECE Aggregate Calculator",
    "category": "Education",
    "url": "/bece-aggregate-calculator"
  },
  "bece-cssps-placement-estimator": {
    "name": "BECE CSSPS Placement Estimator",
    "category": "Education",
    "url": "/bece-cssps-placement-estimator"
  },
  "break-even-calculator": {
    "name": "Break-Even Calculator",
    "category": "Finance",
    "url": "/break-even-calculator"
  },
  "canada-student-loan-repayment-calculator": {
    "name": "Canada Student Loan Repayment",
    "category": "Education",
    "url": "/canada-student-loan-repayment-calculator"
  },
  "canada-study-planner": {
    "name": "Canada Study Planner",
    "category": "Education",
    "url": "/canada-study-planner"
  },
  "canada-university-admission-chance-calculator": {
    "name": "Canada Admission Calculator",
    "category": "Education",
    "url": "/canada-university-admission-chance-calculator"
  },
  "compound-interest": {
    "name": "Compound Interest Calculator",
    "category": "Finance",
    "url": "/compound-interest"
  },
  "currency-converter": {
    "name": "Real-Time Currency Converter",
    "category": "Finance",
    "url": "/currency-converter"
  },
  "data-file-unit-converter": {
    "name": "Data & File Unit Converter",
    "category": "Productivity",
    "url": "/data-file-unit-converter"
  },
  "document-converter": {
    "name": "Universal Document Converter",
    "category": "Productivity",
    "url": "/document-converter"
  },
  "debt-payoff-calculator": {
    "name": "Debt Payoff Calculator",
    "category": "Finance",
    "url": "/debt-payoff-calculator"
  },
  "exif-remover": {
    "name": "Metadata & EXIF Remover",
    "category": "Productivity",
    "url": "/exif-remover"
  },
  "form-four-gpa-calculator": {
    "name": "Form Four GPA Calculator",
    "category": "Education",
    "url": "/form-four-gpa-calculator"
  },
  "freelance-rate-calculator": {
    "name": "Freelance Rate Calculator",
    "category": "Finance",
    "url": "/freelance-rate-calculator"
  },
  "germany-abitur-grade-calculator": {
    "name": "Germany Abitur Grade Calculator",
    "category": "Education",
    "url": "/germany-abitur-grade-calculator"
  },
  "germany-gpa-converter": {
    "name": "Germany GPA Converter",
    "category": "Education",
    "url": "/germany-gpa-converter"
  },
  "gpa-calculator": {
    "name": "GPA & CGPA Calculator",
    "category": "Education",
    "url": "/gpa-calculator"
  },
  "hecs-help-repayment-calculator": {
    "name": "HECS-HELP Repayment Calculator",
    "category": "Education",
    "url": "/hecs-help-repayment-calculator"
  },
  "hourly-to-salary": {
    "name": "Hourly to Salary Converter",
    "category": "Finance",
    "url": "/hourly-to-salary"
  },
  "html-minifier": {
    "name": "HTML Minifier",
    "category": "Productivity",
    "url": "/html-minifier"
  },
  "icass-calculator": {
    "name": "ICASS Calculator",
    "category": "Education",
    "url": "/icass-calculator"
  },
  "igcse-alevel-gpa-converter": {
    "name": "IGCSE / A-Level GPA Converter",
    "category": "Education",
    "url": "/igcse-alevel-gpa-converter"
  },
  "image-resizer-webp-converter": {
    "name": "Image Resizer & WebP Converter",
    "category": "Productivity",
    "url": "/image-resizer-webp-converter"
  },
  "invoice-receipt-generator": {
    "name": "Invoice & Receipt PDF Generator",
    "category": "Business",
    "url": "/invoice-receipt-generator"
  },
  "jamb-admission-chance-checker": {
    "name": "JAMB Admission Chance",
    "category": "Education",
    "url": "/jamb-admission-chance-checker"
  },
  "jamb-score-calculator": {
    "name": "JAMB Score Calculator",
    "category": "Education",
    "url": "/jamb-score-calculator"
  },
  "jamb-utme-aggregate-calculator": {
    "name": "JAMB UTME Aggregate Calculator",
    "category": "Education",
    "url": "/jamb-utme-aggregate-calculator"
  },
  "job-application-tracker": {
    "name": "Job Application Tracker",
    "category": "Productivity",
    "url": "/job-application-tracker"
  },
  "job-scam-checker": {
    "name": "Job Scam Checker",
    "category": "Productivity",
    "url": "/job-scam-checker"
  },
  "json-formatter-validator": {
    "name": "JSON Formatter & Validator",
    "category": "Productivity",
    "url": "/json-formatter-validator"
  },
  "kcpe-performance-calculator": {
    "name": "KCPE Performance Calculator",
    "category": "Education",
    "url": "/kcpe-performance-calculator"
  },
  "kcse-eligibility-tier-checker": {
    "name": "KCSE Eligibility Tier Checker",
    "category": "Education",
    "url": "/kcse-eligibility-tier-checker"
  },
  "kcse-grade-calculator": {
    "name": "KCSE Grade Calculator",
    "category": "Education",
    "url": "/kcse-grade-calculator"
  },
  "kcse-kuccps-cluster-calculator": {
    "name": "KCSE & KUCCPS Cluster Calculator",
    "category": "Education",
    "url": "/kcse-kuccps-cluster-calculator"
  },
  "keyword-density-checker": {
    "name": "Keyword Density Checker",
    "category": "Productivity",
    "url": "/keyword-density-checker"
  },
  "kuccps-cluster-points-calculator": {
    "name": "KUCCPS Cluster Points Calculator",
    "category": "Education",
    "url": "/kuccps-cluster-points-calculator"
  },
  "loan-calculator": {
    "name": "Loan Calculator",
    "category": "Finance",
    "url": "/loan-calculator"
  },
  "markdown-to-html-converter": {
    "name": "Markdown to HTML Converter",
    "category": "Productivity",
    "url": "/markdown-to-html-converter"
  },
  "matric-sba-exam-calculator": {
    "name": "Matric SBA + Exam Pass Calculator",
    "category": "Education",
    "url": "/matric-sba-exam-calculator"
  },
  "meta-pixel-checker": {
    "name": "Meta Title & Description Pixel Checker",
    "category": "Productivity",
    "url": "/meta-pixel-checker"
  },
  "mortgage-calculator": {
    "name": "Mortgage Calculator",
    "category": "Finance",
    "url": "/mortgage-calculator"
  },
  "new-zealand-ncea-credits-calculator": {
    "name": "NZ NCEA Credits Calculator",
    "category": "Education",
    "url": "/new-zealand-ncea-credits-calculator"
  },
  "new-zealand-study-planner": {
    "name": "NZ Study Planner & Timetable",
    "category": "Education",
    "url": "/new-zealand-study-planner"
  },
  "norway-gpa-calculator": {
    "name": "Norway GPA Calculator",
    "category": "Education",
    "url": "/norway-gpa-calculator"
  },
  "nsfas-eligibility-checker": {
    "name": "NSFAS Eligibility Checker",
    "category": "Education",
    "url": "/nsfas-eligibility-checker"
  },
  "nsfas-tvet-allowance-calculator": {
    "name": "NSFAS TVET Allowance Estimator",
    "category": "Education",
    "url": "/nsfas-tvet-allowance-calculator"
  },
  "olevel-subject-combination-checker": {
    "name": "WAEC / NECO Subject Checker",
    "category": "Education",
    "url": "/olevel-subject-combination-checker"
  },
  "online-shop-scam-checker": {
    "name": "Shop Scam Checker",
    "category": "Productivity",
    "url": "/online-shop-scam-checker"
  },
  "password-generator": {
    "name": "Secure Password Generator",
    "category": "Education",
    "url": "/password-generator"
  },
  "paye-calculator": {
    "name": "PAYE & Net Salary Calculator",
    "category": "Finance",
    "url": "/paye-calculator"
  },
  "paypal-fee-calculator": {
    "name": "PayPal Fee Calculator",
    "category": "Finance",
    "url": "/paypal-fee-calculator"
  },
  "percentage-calculator": {
    "name": "Percentage Calculator",
    "category": "Finance",
    "url": "/percentage-calculator"
  },
  "ple-aggregate-calculator": {
    "name": "PLE Aggregate Calculator",
    "category": "Education",
    "url": "/ple-aggregate-calculator"
  },
  "post-utme-aggregate-calculator": {
    "name": "Post-UTME Aggregate Calculator",
    "category": "Education",
    "url": "/post-utme-aggregate-calculator"
  },
  "pricing-calculator": {
    "name": "Pricing Calculator",
    "category": "Finance",
    "url": "/pricing-calculator"
  },
  "profit-margin-calculator": {
    "name": "Profit Margin Calculator",
    "category": "Finance",
    "url": "/profit-margin-calculator"
  },
  "qr-code-generator": {
    "name": "QR Code Generator",
    "category": "Productivity",
    "url": "/qr-code-generator"
  },
  "reading-time-speech-estimator": {
    "name": "Reading Time & Speech Estimator",
    "category": "Productivity",
    "url": "/reading-time-speech-estimator"
  },
  "rent-affordability": {
    "name": "Rent Affordability Calculator",
    "category": "Finance",
    "url": "/rent-affordability"
  },
  "robots-txt-generator": {
    "name": "Robots.txt Generator",
    "category": "Productivity",
    "url": "/robots-txt-generator"
  },
  "roi-calculator": {
    "name": "ROI Calculator",
    "category": "Finance",
    "url": "/roi-calculator"
  },
  "savings-calculator": {
    "name": "Savings Calculator",
    "category": "Finance",
    "url": "/savings-calculator"
  },
  "seo-meta-generator": {
    "name": "SEO Meta Tag Generator & SERP Preview",
    "category": "Education",
    "url": "/seo-meta-generator"
  },
  "south-africa-study-planner": {
    "name": "South Africa Study Planner",
    "category": "Education",
    "url": "/south-africa-study-planner"
  },
  "south-african-aps-calculator": {
    "name": "South African APS Calculator",
    "category": "Education",
    "url": "/south-african-aps-calculator"
  },
  "south-african-tvet-nated-calculator": {
    "name": "TVET NATED Pass Calculator",
    "category": "Education",
    "url": "/south-african-tvet-nated-calculator"
  },
  "south-african-university-admission-calculator": {
    "name": "SA University Admission Calculator",
    "category": "Education",
    "url": "/south-african-university-admission-calculator"
  },
  "startup-cost-calculator": {
    "name": "Startup Cost Calculator",
    "category": "Finance",
    "url": "/startup-cost-calculator"
  },
  "student-loan-repayment-calculator": {
    "name": "Student Loan Repayment (HELB)",
    "category": "Finance",
    "url": "/student-loan-repayment-calculator"
  },
  "switzerland-grade-calculator": {
    "name": "Switzerland Grade Calculator",
    "category": "Education",
    "url": "/switzerland-grade-calculator"
  },
  "switzerland-university-cost-calculator": {
    "name": "Switzerland University Cost Calculator",
    "category": "Education",
    "url": "/switzerland-university-cost-calculator"
  },
  "tanzania-heslb-loan-calculator": {
    "name": "HESLB Student Loan (Tanzania)",
    "category": "Finance",
    "url": "/tanzania-heslb-loan-calculator"
  },
  "tanzania-university-admission-calculator": {
    "name": "Tanzania University Admission",
    "category": "Education",
    "url": "/tanzania-university-admission-calculator"
  },
  "text-case-converter-cleanup": {
    "name": "Text Case & Cleanup",
    "category": "Productivity",
    "url": "/text-case-converter-cleanup"
  },
  "tvet-exam-target-mark-calculator": {
    "name": "TVET Exam Target Mark Calculator",
    "category": "Education",
    "url": "/tvet-exam-target-mark-calculator"
  },
  "tvet-ncv-pass-calculator": {
    "name": "TVET NC(V) Pass & Aggregate",
    "category": "Education",
    "url": "/tvet-ncv-pass-calculator"
  },
  "uace-points-calculator": {
    "name": "UACE Points Calculator",
    "category": "Education",
    "url": "/uace-points-calculator"
  },
  "ucas-points-calculator": {
    "name": "UCAS Points Calculator",
    "category": "Education",
    "url": "/ucas-points-calculator"
  },
  "uce-grade-calculator": {
    "name": "UCE Grade Calculator",
    "category": "Education",
    "url": "/uce-grade-calculator"
  },
  "uganda-university-admission-calculator": {
    "name": "Uganda University Admission",
    "category": "Education",
    "url": "/uganda-university-admission-calculator"
  },
  "uk-a-level-grade-calculator": {
    "name": "A-Level Grade Calculator",
    "category": "Education",
    "url": "/uk-a-level-grade-calculator"
  },
  "uk-degree-classification-calculator": {
    "name": "Degree Classification Calculator",
    "category": "Education",
    "url": "/uk-degree-classification-calculator"
  },
  "uk-gcse-grade-calculator": {
    "name": "GCSE Grade Calculator",
    "category": "Education",
    "url": "/uk-gcse-grade-calculator"
  },
  "uk-student-loan-finance-calculator": {
    "name": "UK Student Finance Calculator",
    "category": "Education",
    "url": "/uk-student-loan-finance-calculator"
  },
  "uneb-results-estimator": {
    "name": "UNEB Results Estimator",
    "category": "Education",
    "url": "/uneb-results-estimator"
  },
  "unit-converter": {
    "name": "Unit Converter",
    "category": "Productivity",
    "url": "/unit-converter"
  },
  "university-course-finder": {
    "name": "University Course Finder (Australia)",
    "category": "Education",
    "url": "/university-course-finder"
  },
  "university-cutoff-eligibility-checker": {
    "name": "University Eligibility Checker",
    "category": "Education",
    "url": "/university-cutoff-eligibility-checker"
  },
  "waec-grade-calculator": {
    "name": "WAEC Grade Calculator",
    "category": "Education",
    "url": "/waec-grade-calculator"
  },
  "wassce-aggregate-calculator": {
    "name": "WASSCE Aggregate Calculator",
    "category": "Education",
    "url": "/wassce-aggregate-calculator"
  },
  "whatsapp-direct-link-qr-generator": {
    "name": "WhatsApp Link & QR Generator",
    "category": "Business",
    "url": "/whatsapp-direct-link-qr-generator"
  },
  "xml-sitemap-builder": {
    "name": "Static Site XML Sitemap Builder",
    "category": "Productivity",
    "url": "/xml-sitemap-builder"
  },
  "zambia-grade-12-points-calculator": {
    "name": "Zambia Grade 12 Points",
    "category": "Education",
    "url": "/zambia-grade-12-points-calculator"
  },
  "zambia-university-admission-calculator": {
    "name": "Zambia University Admission",
    "category": "Education",
    "url": "/zambia-university-admission-calculator"
  },
  "zimbabwe-study-timetable-generator": {
    "name": "Zimbabwe Study Timetable",
    "category": "Education",
    "url": "/zimbabwe-study-timetable-generator"
  },
  "zimbabwe-university-entry-points-calculator": {
    "name": "Zimbabwe University Entry Calculator",
    "category": "Education",
    "url": "/zimbabwe-university-entry-points-calculator"
  },
  "zimsec-alevel-points-calculator": {
    "name": "ZIMSEC A-Level Points Calculator",
    "category": "Education",
    "url": "/zimsec-alevel-points-calculator"
  },
  "zimsec-olevel-points-calculator": {
    "name": "ZIMSEC O-Level Points Calculator",
    "category": "Education",
    "url": "/zimsec-olevel-points-calculator"
  }
};

  // Hub and Non-Tool Pages to Exclude from Tracking
  var HUB_PAGES = [
    '/',
    '/index',
    '/index.html',
    '/education',
    '/finance',
    '/productivity',
    '/business',
    '/use-cases',
    '/about',
    '/contact',
    '/terms',
    '/privacy-policy',
    '/cookie-policy',
    '/adsense-disclaimer',
    '/404',
    '/faq'
  ];

  // Crisp SVG Icons (Zero Emojis, 100% AfriWidget Design System)
  var CATEGORY_ICONS = {
    'Education': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/></svg>',
    'Finance': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 19h16M6 16V8m4 8v-5m4 5V6m4 10V4"/></svg>',
    'Productivity': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6 3h12v18l-3-2-3 2-3-2-3 2V3ZM9 8h6M9 12h6M9 16h3"/></svg>',
    'Business': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>',
    'Tech': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6 3h12v18l-3-2-3 2-3-2-3 2V3ZM9 8h6M9 12h6M9 16h3"/></svg>',
    'WASSCE': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Zm0 0v13a3 3 0 0 0 3 3M9 8h6M9 12h5"/></svg>',
    'KCSE': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="m4 7 8-4 8 4-8 4-8-4Zm3 3v5c3 2 7 2 10 0v-5M12 14v7"/></svg>',
    'JAMB': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M5 5h14v14H5zM8 9h8M8 13h5"/></svg>',
    'Default': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>'
  };

  var CLOCK_ICON = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';

  function normalizeUrl(url) {
    if (!url) return '';
    try {
      var u = new URL(url, window.location.origin);
      var path = u.pathname.replace(/\/$/, '');
      if (path.endsWith('.html')) path = path.slice(0, -5);
      return path || '/';
    } catch (e) {
      var clean = String(url).split('?')[0].split('#')[0].replace(/\/$/, '');
      if (clean.endsWith('.html')) clean = clean.slice(0, -5);
      return clean || '/';
    }
  }

  function isHubPage(path) {
    var norm = normalizeUrl(path);
    return HUB_PAGES.indexOf(norm) !== -1;
  }

  // =========================================================================
  // 1. RECENT TOOLS TRACKING & HOMEPAGE SHELF
  // =========================================================================

  function getRecentTools() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      var now = Date.now();
      var changed = false;
      var valid = parsed.filter(function (item) {
        if (!item || !item.url || !item.name || typeof item.lastVisited !== 'number') {
          changed = true;
          return false;
        }
        if (REMOVED_TOOL_PATHS.has(normalizeUrl(item.url))) {
          changed = true;
          return false;
        }
        // Auto-remove very old entries after reasonable period (30 days)
        if (now - item.lastVisited > EXPIRY_MS) {
          changed = true;
          return false;
        }
        return true;
      });

      // Sort by most recently visited first
      valid.sort(function (a, b) {
        return b.lastVisited - a.lastVisited;
      });

      var trimmed = valid.slice(0, MAX_ITEMS);
      if (changed || trimmed.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      }
      return trimmed;
    } catch (e) {
      console.warn('AfriWidget Recent Tools: localStorage read error', e);
      return [];
    }
  }

  function saveRecentTools(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('afriwidget_recent_updated', { detail: { recent: list } }));
    } catch (e) {
      console.warn('AfriWidget Recent Tools: localStorage write error', e);
    }
  }

  function recordToolVisit(toolData) {
    if (!toolData || !toolData.url) return;
    var normUrl = normalizeUrl(toolData.url);
    if (!normUrl || normUrl === '/' || isHubPage(normUrl)) return;

    var list = getRecentTools();
    var existingIndex = list.findIndex(function (item) {
      return normalizeUrl(item.url) === normUrl;
    });

    var slug = normUrl.replace(/^\//, '');
    var name = (toolData.name || '').trim();
    var category = (toolData.category || '').trim();

    if (TOOL_MAP[slug]) {
      if (!name) name = TOOL_MAP[slug].name;
      if (!category) category = TOOL_MAP[slug].category;
    }

    if (!name) name = getPageToolTitle() || 'Calculator Tool';
    if (!category) category = 'General';

    var updatedEntry = {
      name: name,
      url: normUrl,
      category: category,
      lastVisited: Date.now()
    };

    // Prevent duplicate entries by updating existing item instead of creating a new one
    if (existingIndex > -1) {
      list.splice(existingIndex, 1);
    }

    // Sort by most recently visited first
    list.unshift(updatedEntry);

    // Keep only the most recent 6 tools
    var trimmed = list.slice(0, MAX_ITEMS);
    saveRecentTools(trimmed);
  }

  function clearAllRecentTools() {
    saveRecentTools([]);
    renderRecentToolsSection();
  }

  function getPageToolTitle() {
    var h1 = document.querySelector('h1');
    if (h1) {
      var cloned = h1.cloneNode(true);
      cloned.querySelectorAll('span, svg, button').forEach(function (el) { el.remove(); });
      var txt = cloned.textContent.trim();
      if (txt) return txt;
    }
    return document.title.split('–')[0].split('-')[0].trim() || 'Calculator';
  }

  function getPageToolCategory() {
    var catEl = document.querySelector('.calc-panel-cat, .tool-card-cat, .breadcrumb li:nth-child(3)');
    if (catEl) return catEl.textContent.trim();
    return 'Finance';
  }

  function formatTimeAgo(timestamp) {
    if (!timestamp) return 'Recently';
    var now = Date.now();
    var diffSec = Math.max(0, Math.floor((now - timestamp) / 1000));

    if (diffSec < 45) {
      return 'Just now';
    }
    var diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) {
      return diffMin === 1 ? '1 minute ago' : diffMin + ' minutes ago';
    }
    var diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) {
      return diffHours === 1 ? '1 hour ago' : diffHours + ' hours ago';
    }
    var diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) {
      return 'Yesterday';
    }
    if (diffDays < 7) {
      return diffDays + ' days ago';
    }
    var diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 4) {
      return diffWeeks === 1 ? '1 week ago' : diffWeeks + ' weeks ago';
    }
    var diffMonths = Math.floor(diffDays / 30);
    return diffMonths === 1 ? '1 month ago' : diffMonths + ' months ago';
  }

  function getToolIcon(tool) {
    try {
      var norm = normalizeUrl(tool.url);
      var cards = document.querySelectorAll('a.tool-card:not(.continue-card), a.app-card');
      for (var i = 0; i < cards.length; i++) {
        var c = cards[i];
        if (normalizeUrl(c.getAttribute('href') || '') === norm) {
          var svgEl = c.querySelector('.tool-card-icon svg');
          if (svgEl) {
            return svgEl.outerHTML;
          }
        }
      }
    } catch (e) {}

    var cat = (tool.category || '').trim();
    if (CATEGORY_ICONS[cat]) return CATEGORY_ICONS[cat];
    var catUpper = cat.toUpperCase();
    for (var key in CATEGORY_ICONS) {
      if (catUpper.indexOf(key.toUpperCase()) !== -1) {
        return CATEGORY_ICONS[key];
      }
    }
    return CATEGORY_ICONS['Default'];
  }

  function escapeHtml(str) {
    return (str || '').replace(/[&<>"']/g, function (m) {
      switch (m) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#039;';
        default: return m;
      }
    });
  }

  function renderRecentToolsSection() {
    var container = document.getElementById('continueGridContainer');
    var actionsEl = document.getElementById('continueActions');
    if (!container) return;

    var tools = getRecentTools();

    if (tools.length === 0) {
      if (actionsEl) actionsEl.style.display = 'none';
      container.innerHTML = 
        '<div class="recent-empty-state">' +
          '<div class="recent-empty-icon" aria-hidden="true">' +
            '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' +
          '</div>' +
          '<h3 class="recent-empty-title">No recent tools yet</h3>' +
          '<p class="recent-empty-desc">Use any AfriWidget tool and it will appear here automatically.</p>' +
        '</div>';
      return;
    }

    if (actionsEl) actionsEl.style.display = 'block';

    var html = '<div class="tool-grid tool-grid-6">';
    tools.forEach(function (tool) {
      var iconSvg = getToolIcon(tool);
      var cat = escapeHtml(tool.category || 'General');
      var name = escapeHtml(tool.name);
      var url = escapeHtml(tool.url);
      var continueUrl = url + (url.indexOf('?') === -1 ? '?continue=1' : '&continue=1');
      var timeAgo = escapeHtml(formatTimeAgo(tool.lastVisited));

      html += '<a href="' + continueUrl + '" class="tool-card continue-card" data-recent-url="' + url + '">' +
        '<div class="tool-card-icon">' +
          iconSvg +
          '<span class="tool-card-cat">' + cat + '</span>' +
        '</div>' +
        '<h3 class="tool-card-title">' + name + '</h3>' +
        '<div class="tool-card-time">' +
          CLOCK_ICON +
          '<span>' + timeAgo + '</span>' +
        '</div>' +
        '<span class="tool-card-cta">Continue &rarr;</span>' +
      '</a>';
    });
    html += '</div>';

    container.innerHTML = html;
    initClearButton();

    // Note: Do NOT attach bookmark favorite star buttons to continue cards.
    // Continue cards are dedicated resume actions for returning users.
  }

  // Automatic Tool Visit Tracking on Current Page
  function trackCurrentPageIfTool() {
    var path = normalizeUrl(window.location.pathname);
    if (!path || path === '/' || isHubPage(path)) return;

    var slug = path.replace(/^\//, '');
    var name = '';
    var category = '';

    if (TOOL_MAP[slug]) {
      name = TOOL_MAP[slug].name;
      category = TOOL_MAP[slug].category;
    }

    if (!name) name = getPageToolTitle();
    if (!category) category = getPageToolCategory();

    recordToolVisit({
      url: path,
      name: name,
      category: category
    });
  }

  // Delegated click tracking for tool links across the entire site
  function initClickTracking() {
    document.addEventListener('click', function (e) {
      var card = e.target.closest('a.tool-card, a.app-card');
      if (!card) return;

      if (card.classList.contains('continue-card')) {
        try {
          var targetHref = card.getAttribute('href') || '';
          sessionStorage.setItem('afriwidget_continue_restore', normalizeUrl(targetHref));
        } catch (err) {}
      }

      var href = card.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href === '/' || isHubPage(href)) return;

      var titleEl = card.querySelector('.tool-card-title, h3, h2');
      var catEl = card.querySelector('.tool-card-cat, .featured-label');
      var title = titleEl ? titleEl.textContent.trim() : '';
      var category = catEl ? catEl.textContent.trim() : '';

      recordToolVisit({
        url: href,
        name: title,
        category: category
      });
    });
  }

  // Bind clear history button
  function initClearButton() {
    var clearBtn = document.getElementById('clearRecentBtn');
    if (clearBtn && !clearBtn.dataset.bound) {
      clearBtn.dataset.bound = 'true';
      clearBtn.addEventListener('click', function (e) {
        e.preventDefault();
        clearAllRecentTools();
      });
    }
  }

  // =========================================================================
  // 2. AUTOMATIC USER PROGRESS & INPUTS PERSISTENCE ENGINE
  // =========================================================================

  var saveDebounceTimer = null;
  var isRestoringInProgress = false;

  function queueAutoSave() {
    if (isRestoringInProgress) return;
    if (saveDebounceTimer) clearTimeout(saveDebounceTimer);
    saveDebounceTimer = setTimeout(function () {
      saveCurrentToolProgress();
    }, 250);
  }

  function saveCurrentToolProgress() {
    var path = normalizeUrl(window.location.pathname);
    if (!path || path === '/' || isHubPage(path)) return;

    var toolRoot = document.querySelector('main') || document.querySelector('.calc-panel') || document.querySelector('form') || document.body;
    if (!toolRoot) return;

    var state = {
      url: path,
      updatedAt: Date.now(),
      tabs: [],
      fields: {},
      dynamicRows: []
    };

    var hasAnyValue = false;

    // 1. Capture Active Unit Toggles and Tabs
    var activeTabs = toolRoot.querySelectorAll('.unit-toggle button.active, [role="tab"].active, [role="tab"][aria-selected="true"], .tab-btn.active');
    activeTabs.forEach(function (tab) {
      if (tab.id) {
        state.tabs.push(tab.id);
      } else if (tab.dataset.tab) {
        state.tabs.push('[data-tab="' + tab.dataset.tab + '"]');
      }
    });

    // 2. Capture Dynamic Table Rows (e.g. #courseList, #subjectList, .course-row)
    var dynamicContainers = toolRoot.querySelectorAll('#courseList, #subjectList, .dynamic-list, .courses-container, .subjects-container');
    dynamicContainers.forEach(function (container) {
      var rows = container.querySelectorAll('.course-row, .subject-row, .dynamic-row, .form-row');
      var rowsData = [];
      rows.forEach(function (row) {
        var rowInputs = row.querySelectorAll('input, select, textarea');
        var rowVals = [];
        rowInputs.forEach(function (inp) {
          var val = inp.value;
          rowVals.push({
            type: inp.type || inp.tagName.toLowerCase(),
            value: val
          });
          if (val && String(val).trim() !== '') {
            hasAnyValue = true;
          }
        });
        if (rowVals.length > 0) {
          rowsData.push(rowVals);
        }
      });

      var addBtn = toolRoot.querySelector('#addRowBtn, #addCourseBtn, #addSubjectBtn, .btn-add-row, .btn-add');
      state.dynamicRows.push({
        containerId: container.id || '',
        addBtnId: addBtn ? addBtn.id : '',
        rows: rowsData
      });
    });

    // 3. Capture Standard Form Fields
    var inputs = toolRoot.querySelectorAll('input, select, textarea');
    inputs.forEach(function (inp) {
      if (inp.closest('#mobileMenu, #cookieBanner, .afri-fav-drawer, .category-search-box, .site-nav')) return;
      if (inp.type === 'button' || inp.type === 'submit' || inp.type === 'reset') return;
      if (inp.closest('#courseList, #subjectList, .dynamic-list')) return;

      var key = inp.id || (inp.name ? 'name:' + inp.name : null);
      if (!key) return;

      if (inp.type === 'radio') {
        if (inp.checked) {
          state.fields[key] = {
            type: 'radio',
            value: inp.value,
            checked: true
          };
          hasAnyValue = true;
        }
      } else if (inp.type === 'checkbox') {
        state.fields[key] = {
          type: 'checkbox',
          value: inp.value,
          checked: inp.checked
        };
        if (inp.checked) hasAnyValue = true;
      } else {
        var val = inp.value;
        state.fields[key] = {
          type: inp.type || 'text',
          value: val
        };
        if (val && String(val).trim() !== '') {
          hasAnyValue = true;
        }
      }
    });

    var storageKey = PROGRESS_PREFIX + path;
    if (hasAnyValue) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
        // Keep recent tool timestamp synchronized
        recordToolVisit({ url: path });
      } catch (e) {
        console.warn('AfriWidget Progress: localStorage write error', e);
      }
    } else {
      try {
        localStorage.removeItem(storageKey);
      } catch (e) {}
    }
  }

  function restoreCurrentToolProgress() {
    var path = normalizeUrl(window.location.pathname);
    if (!path || path === '/' || isHubPage(path)) return;

    // Only restore previous inputs if the user pressed the tool from the "Continue Where You Left Off" section
    var params;
    try {
      params = new URLSearchParams(window.location.search);
    } catch (e) {
      params = null;
    }
    var hasContinueParam = params && (params.get('continue') === '1' || params.get('resume') === '1');
    var hasContinueSession = false;
    try {
      if (sessionStorage.getItem('afriwidget_continue_restore') === path) {
        hasContinueSession = true;
        sessionStorage.removeItem('afriwidget_continue_restore');
      }
    } catch (e) {}

    if (!hasContinueParam && !hasContinueSession) {
      // Normal direct visit / navigation - do NOT restore old inputs! Start fresh.
      return;
    }

    // Clean up ?continue=1 from the URL bar so the URL stays pristine after other scripts have read it
    if (hasContinueParam && window.history && typeof window.history.replaceState === 'function') {
      setTimeout(function () {
        try {
          var cleanUrl = new URL(window.location.href);
          cleanUrl.searchParams.delete('continue');
          cleanUrl.searchParams.delete('resume');
          var queryStr = cleanUrl.searchParams.toString();
          window.history.replaceState({}, '', cleanUrl.pathname + (queryStr ? '?' + queryStr : '') + cleanUrl.hash);
        } catch (e) {}
      }, 500);
    }

    var storageKey = PROGRESS_PREFIX + path;
    var raw;
    try {
      raw = localStorage.getItem(storageKey);
    } catch (e) {
      return;
    }
    if (!raw) return;

    var state;
    try {
      state = JSON.parse(raw);
    } catch (e) {
      return;
    }
    if (!state || typeof state !== 'object') return;

    var toolRoot = document.querySelector('main') || document.querySelector('.calc-panel') || document.querySelector('form') || document.body;
    if (!toolRoot) return;

    isRestoringInProgress = true;
    var restoredAny = false;

    try {
      // 1. Restore Active Tabs or Unit Toggles first
      if (Array.isArray(state.tabs)) {
        state.tabs.forEach(function (tabIdentifier) {
          var tabBtn = document.getElementById(tabIdentifier) || document.querySelector(tabIdentifier);
          if (tabBtn && typeof tabBtn.click === 'function') {
            if (!tabBtn.classList.contains('active') && tabBtn.getAttribute('aria-selected') !== 'true') {
              tabBtn.click();
              restoredAny = true;
            }
          }
        });
      }

      // 2. Restore Dynamic Rows (e.g. #courseList, #subjectList)
      if (Array.isArray(state.dynamicRows)) {
        state.dynamicRows.forEach(function (dyn) {
          var container = dyn.containerId ? document.getElementById(dyn.containerId) : document.querySelector('#courseList, #subjectList');
          var addBtn = dyn.addBtnId ? document.getElementById(dyn.addBtnId) : document.querySelector('#addRowBtn, #addCourseBtn, #addSubjectBtn');
          if (!container || !Array.isArray(dyn.rows) || dyn.rows.length === 0) return;

          var existingRows = container.querySelectorAll('.course-row, .subject-row, .dynamic-row, .form-row');
          var needed = dyn.rows.length;

          // If more rows needed than current, click add button
          if (addBtn && typeof addBtn.click === 'function') {
            var diff = needed - existingRows.length;
            for (var i = 0; i < diff; i++) {
              addBtn.click();
            }
          }

          var currentRows = container.querySelectorAll('.course-row, .subject-row, .dynamic-row, .form-row');
          dyn.rows.forEach(function (savedRow, rIdx) {
            if (rIdx >= currentRows.length) return;
            var rowEl = currentRows[rIdx];
            var rowInputs = rowEl.querySelectorAll('input, select, textarea');
            savedRow.forEach(function (savedInp, iIdx) {
              if (iIdx < rowInputs.length) {
                var targetInp = rowInputs[iIdx];
                if (savedInp.value !== undefined && savedInp.value !== null) {
                  targetInp.value = savedInp.value;
                  targetInp.dispatchEvent(new Event('input', { bubbles: true }));
                  targetInp.dispatchEvent(new Event('change', { bubbles: true }));
                  if (savedInp.value !== '') restoredAny = true;
                }
              }
            });
          });
        });
      }

      // 3. Restore Standard Fields
      if (state.fields && typeof state.fields === 'object') {
        Object.keys(state.fields).forEach(function (key) {
          var field = state.fields[key];
          if (!field) return;

          var el;
          if (key.startsWith('name:')) {
            var name = key.slice(5);
            if (field.type === 'radio') {
              el = toolRoot.querySelector('input[type="radio"][name="' + name + '"][value="' + field.value + '"]');
            } else {
              el = toolRoot.querySelector('[name="' + name + '"]');
            }
          } else {
            el = document.getElementById(key);
          }

          if (!el) return;

          if (field.type === 'radio') {
            if (field.checked) {
              el.checked = true;
              el.dispatchEvent(new Event('change', { bubbles: true }));
              restoredAny = true;
            }
          } else if (field.type === 'checkbox') {
            el.checked = Boolean(field.checked);
            el.dispatchEvent(new Event('change', { bubbles: true }));
            restoredAny = true;
          } else {
            if (field.value !== undefined && field.value !== null) {
              el.value = field.value;
              el.dispatchEvent(new Event('input', { bubbles: true }));
              el.dispatchEvent(new Event('change', { bubbles: true }));
              if (field.value !== '') restoredAny = true;
            }
          }
        });
      }
    } catch (err) {
      console.warn('AfriWidget Progress: restore error', err);
    } finally {
      isRestoringInProgress = false;
    }

    // 4. Safely auto-calculate if tool inputs are complete and valid
    if (restoredAny) {
      setTimeout(function () {
        tryAutoCalculate(toolRoot);
      }, 100);
    }
  }

  function tryAutoCalculate(toolRoot) {
    if (!toolRoot) return;
    try {
      var form = toolRoot.querySelector('form') || (toolRoot.tagName.toLowerCase() === 'form' ? toolRoot : null);
      if (form) {
        if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
          return; // Incomplete inputs, do not trigger
        }
        var submitBtn = form.querySelector('button[type="submit"], input[type="submit"], .btn-calc');
        if (submitBtn && typeof submitBtn.click === 'function') {
          submitBtn.click();
        } else {
          form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }
        return;
      }

      // Check for standalone calculation button (e.g. gpa-calculator #calcBtn)
      var calcBtn = toolRoot.querySelector('#calcBtn, .btn-calc');
      if (calcBtn && typeof calcBtn.click === 'function') {
        calcBtn.click();
      }
    } catch (e) {}
  }

  function clearCurrentToolProgress() {
    var path = normalizeUrl(window.location.pathname);
    if (!path) return;
    try {
      localStorage.removeItem(PROGRESS_PREFIX + path);
    } catch (e) {}
  }

  function initProgressListeners() {
    var path = normalizeUrl(window.location.pathname);
    if (!path || path === '/' || isHubPage(path)) return;

    // Listen for inputs and changes
    document.addEventListener('input', function (e) {
      if (e.target.closest('#mobileMenu, #cookieBanner, .afri-fav-drawer, .category-search-box, .site-nav')) return;
      queueAutoSave();
    }, { passive: true });

    document.addEventListener('change', function (e) {
      if (e.target.closest('#mobileMenu, #cookieBanner, .afri-fav-drawer, .category-search-box, .site-nav')) return;
      saveCurrentToolProgress();
    }, { passive: true });

    document.addEventListener('submit', function (e) {
      if (e.target.closest('#mobileMenu, #cookieBanner, .afri-fav-drawer, .category-search-box, .site-nav')) return;
      saveCurrentToolProgress();
    }, { passive: true });

    // Listen for button interactions (tabs, unit toggles, dynamic add/remove, clear)
    document.addEventListener('click', function (e) {
      var target = e.target;
      var btn = target.closest('button, .unit-toggle button, [role="tab"], .btn-remove, .btn-add');
      if (!btn) return;

      // Handle Clear / Reset buttons
      if (btn.id === 'clearBtn' || btn.id === 'resetBtn' || btn.type === 'reset' || btn.classList.contains('btn-clear')) {
        clearCurrentToolProgress();
        return;
      }

      // Handle Unit toggles / Tabs / Dynamic rows
      if (btn.closest('.unit-toggle') || btn.getAttribute('role') === 'tab' || btn.classList.contains('tab-btn') || btn.id === 'addRowBtn' || btn.id === 'addCourseBtn' || btn.id === 'addSubjectBtn' || btn.classList.contains('btn-remove') || btn.classList.contains('course-remove')) {
        setTimeout(function () {
          saveCurrentToolProgress();
        }, 60);
      }
    });

    // Restore on load
    restoreCurrentToolProgress();
  }

  // =========================================================================
  // 3. SYNCHRONIZATION & INITIALIZATION
  // =========================================================================

  function initSync() {
    if (typeof window.addEventListener !== 'function') return;

    window.addEventListener('storage', function (e) {
      if (e.key === STORAGE_KEY) {
        renderRecentToolsSection();
      }
    });

    window.addEventListener('afriwidget_recent_updated', function () {
      renderRecentToolsSection();
    });

    window.addEventListener('pageshow', function () {
      renderRecentToolsSection();
      initClearButton();
      restoreCurrentToolProgress();
    });

    if (typeof document.addEventListener === 'function') {
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') {
          renderRecentToolsSection();
        }
      });
    }

    // Refresh relative times every 60 seconds when tab is active
    setInterval(function () {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        renderRecentToolsSection();
      }
    }, 60000);
  }

  function init() {
    trackCurrentPageIfTool();
    initClickTracking();
    renderRecentToolsSection();
    initClearButton();
    initProgressListeners();
    initSync();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public Global API
  window.AfriWidgetRecentTools = {
    get: getRecentTools,
    add: recordToolVisit,
    clear: clearAllRecentTools,
    render: renderRecentToolsSection,
    formatTimeAgo: formatTimeAgo,
    saveProgress: saveCurrentToolProgress,
    restoreProgress: restoreCurrentToolProgress,
    clearProgress: clearCurrentToolProgress
  };
})();
