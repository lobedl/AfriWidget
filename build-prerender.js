import fs from 'fs';
import path from 'path';

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, function (character) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character];
  });
}

function unescapeHtml(str) {
  return String(str || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function formatInline(text) {
  if (!text) return '';
  return String(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}

function renderMarkdown(markdown) {
  var lines = String(markdown || '').replace(/\r/g, '').split('\n');
  var html = [];
  var paragraph = [];
  var listType = '';
  var inFaq = false;
  var openFaq = false;

  function flushParagraph() {
    if (!paragraph.length) return;
    var text = paragraph.join(' ').trim();
    if (text === '---') {
      html.push('<hr class="my-6 border-slate-200" />');
      paragraph = [];
      return;
    }
    if (/<[a-z1-6]+[\s>]/i.test(text) || /<\/[a-z1-6]+>/i.test(text)) {
      html.push(text);
    } else {
      text = formatInline(text);
      html.push('<p>' + text + '</p>');
    }
    paragraph = [];
  }

  function closeList() {
    if (listType) {
      html.push('</' + listType + '>');
      listType = '';
    }
  }

  function closeFaq() {
    if (openFaq) {
      html.push('</div></details>');
      openFaq = false;
    }
  }

  lines.forEach(function (line) {
    var trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      closeList();
      return;
    }
    var heading = trimmed.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      if (heading[1].length === 2 && /frequently asked questions|faq/i.test(heading[2])) {
        closeFaq();
        inFaq = true;
        html.push('<h2>' + formatInline(heading[2]) + '</h2>');
      } else if (inFaq && heading[1].length === 3) {
        closeFaq();
        openFaq = true;
        html.push('<details><summary>' + formatInline(heading[2]) + '</summary><div>');
      } else {
        if (heading[1].length === 2) closeFaq();
        html.push('<h' + heading[1].length + '>' + formatInline(heading[2]) + '</h' + heading[1].length + '>');
      }
      return;
    }
    var list = trimmed.match(/^([-*]|\d+\.)\s+(.+)$/);
    if (list) {
      flushParagraph();
      var nextType = /^\d+\./.test(list[1]) ? 'ol' : 'ul';
      if (listType !== nextType) {
        closeList();
        listType = nextType;
        html.push('<' + listType + '>');
      }
      html.push('<li>' + formatInline(list[2]) + '</li>');
      return;
    }
    if (/^>\s?/.test(trimmed)) {
      flushParagraph();
      closeList();
      html.push('<blockquote>' + formatInline(trimmed.replace(/^>\s?/, '')) + '</blockquote>');
      return;
    }
    paragraph.push(trimmed);
  });

  flushParagraph();
  closeList();
  closeFaq();
  return html.join('');
}

const sharedFooterMarkup = `<footer class="bg-slate-900 text-slate-300 pt-14 pb-8 px-4 mt-16" aria-label="AfriWidget site footer">
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
         <li><a href="/wassce-aggregate-calculator" class="hover:text-emerald-400 transition-colors">WASSCE Aggregate</a></li>
         <li><a href="/bece-aggregate-calculator" class="hover:text-emerald-400 transition-colors">BECE Aggregate</a></li>
         <li><a href="/jamb-utme-aggregate-calculator" class="hover:text-emerald-400 transition-colors">JAMB UTME Aggregate</a></li>
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
         <li><a href="/kcse-kuccps-cluster-calculator" class="hover:text-emerald-400 transition-colors">KCSE &amp; KUCCPS</a></li>
         <li><a href="/university-cutoff-eligibility-checker" class="hover:text-emerald-400 transition-colors">University Eligibility</a></li>
         <li><a href="/olevel-subject-combination-checker" class="hover:text-emerald-400 transition-colors">WAEC / NECO Subjects</a></li>
         <li><a href="/kcse-eligibility-tier-checker" class="hover:text-emerald-400 transition-colors">KCSE Eligibility Tier</a></li>
         <li><a href="/south-african-tvet-nated-calculator" class="hover:text-emerald-400 transition-colors">TVET NATED Pass</a></li>
          <li><a href="/icass-calculator" class="hover:text-emerald-400 transition-colors">ICASS Calculator</a></li>
         <li><a href="/bece-cssps-placement-estimator" class="hover:text-emerald-400 transition-colors">BECE CSSPS Placement</a></li>
         <li><a href="/igcse-alevel-gpa-converter" class="hover:text-emerald-400 transition-colors">IGCSE / A-Level GPA</a></li>
         <li><a href="/ucas-points-calculator" class="hover:text-emerald-400 transition-colors">UCAS Points Calculator</a></li>
         <li><a href="/a-level-grade-calculator" class="hover:text-emerald-400 transition-colors">A-Level Grade Calculator</a></li>
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
        <li><a href="/json-formatter" class="hover:text-emerald-400 transition-colors">JSON Formatter</a></li>
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
    <p>&copy; 2026 AfriWidget. All rights reserved. For informational purposes only — not professional medical, financial, or academic advice.</p>
  </div>
</footer>`;

// Category Mapping for Breadcrumb Generation
const catUrlMap = {
  health: { name: "Health Tools", url: "/health" },
  education: { name: "Education Tools", url: "/education" },
  finance: { name: "Finance Tools", url: "/finance" },
  business: { name: "Business Tools", url: "/business" },
  productivity: { name: "Productivity Tools", url: "/productivity" },
  tech: { name: "Productivity Tools", url: "/productivity" },
  realestate: { name: "Real Estate Tools", url: "/real-estate" },
  "real-estate": { name: "Real Estate Tools", url: "/real-estate" }
};

// Build category map from widgets.html data-category attributes
const categoryMap = {};

try {
  const widgetsHtml = fs.readFileSync(path.join(process.cwd(), 'widgets.html'), 'utf8');
  const cardMatches = widgetsHtml.matchAll(/<a[^>]+href=["\x27]\/?([a-z0-9-]+)(?:\.html)?["\x27][^>]*data-category=["\x27]([a-z-]+)["\x27]/g);
  for (const m of cardMatches) {
    const slug = m[1];
    const cat = m[2];
    const info = catUrlMap[cat] || { name: "Productivity Tools", url: "/productivity" };
    categoryMap[slug + ".html"] = { category: info.name, categoryUrl: info.url };
  }
} catch (e) {
  console.warn("Could not read widgets.html for categoryMap:", e.message);
}

// Special Hubs and Policy Pages
categoryMap["health.html"] = { isHub: true, title: "Health & Wellness Tools" };
categoryMap["education.html"] = { isHub: true, title: "Education & Academic Tools" };
categoryMap["finance.html"] = { isHub: true, title: "Finance & Wealth Tools" };
categoryMap["productivity.html"] = { isHub: true, title: "Productivity & Utility Tools" };
categoryMap["business.html"] = { isHub: true, title: "Business & Freelance Tools" };
categoryMap["real-estate.html"] = { isHub: true, title: "Real Estate & Housing Tools" };
categoryMap["admissions.html"] = { isHub: true, title: "African Admissions Calculators", category: "Education Tools", categoryUrl: "/education" };
categoryMap["widgets.html"] = { isHub: true, title: "All Tools Directory" };
categoryMap["success-stories.html"] = { isHub: true, title: "User Success Stories" };

categoryMap["about.html"] = { isHub: true, title: "About AfriWidget" };
categoryMap["contact.html"] = { isHub: true, title: "Contact Us" };
categoryMap["privacy-policy.html"] = { isHub: true, title: "Privacy Policy" };
categoryMap["terms.html"] = { isHub: true, title: "Terms of Service" };
categoryMap["cookie-policy.html"] = { isHub: true, title: "Cookie Policy" };
categoryMap["adsense-disclaimer.html"] = { isHub: true, title: "AdSense & Advertising Disclaimer" };
categoryMap["faq.html"] = { isHub: true, title: "Frequently Asked Questions" };
categoryMap["404.html"] = { isHub: true, title: "Page Not Found (404)" };

categoryMap["index.html"] = { isHome: true, title: "Free Online Tools & Calculators" };

function generateBreadcrumbHtml(filename, content) {
  const slug = filename.replace(/\.html$/, '');
  const config = categoryMap[filename] || { category: "Productivity Tools", categoryUrl: "/productivity" };

  if (config.isHome) {
    return `  <!-- Visual Breadcrumb Navigation -->
  <div class="bg-slate-900 border-b border-slate-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
      <nav aria-label="Breadcrumb">
        <ol class="flex items-center flex-wrap gap-2 text-xs font-medium text-slate-400">
          <li class="inline-flex items-center">
            <span class="text-yellow-300 font-semibold inline-flex items-center gap-1.5" aria-current="page">
              <svg class="w-3.5 h-3.5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
              <span>Home</span>
            </span>
          </li>
          <li class="text-slate-600 inline-flex items-center" aria-hidden="true">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </li>
          <li class="text-slate-400 font-medium truncate max-w-[280px] sm:max-w-none">Free Privacy-First Online Tools &amp; Calculators Directory</li>
        </ol>
      </nav>
    </div>
  </div>`;
  }

  // Extract title
  let title = config.title;
  if (!title) {
    const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1Match) {
      title = unescapeHtml(h1Match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
    }
  }
  if (!title) {
    const titleMatch = content.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (titleMatch) {
      title = unescapeHtml(titleMatch[1].replace(/–.*$/, '').replace(/\|.*$/, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
    }
  }
  if (!title) {
    title = slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  }

  const displayTitle = escapeHtml(title);
  const categoryTitle = config.category ? escapeHtml(config.category) : '';

  if (config.isHub && !config.category) {
    return `  <!-- Visual Breadcrumb Navigation -->
  <div class="bg-slate-900 border-b border-slate-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
      <nav aria-label="Breadcrumb">
        <ol class="flex items-center flex-wrap gap-2 text-xs font-medium text-slate-400">
          <li class="inline-flex items-center">
            <a href="/" class="text-slate-400 hover:text-yellow-300 transition-colors inline-flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
              <span>Home</span>
            </a>
          </li>
          <li class="text-slate-600 inline-flex items-center" aria-hidden="true">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </li>
          <li class="text-yellow-300 font-semibold truncate max-w-[260px] sm:max-w-none" aria-current="page">${displayTitle}</li>
        </ol>
      </nav>
    </div>
  </div>`;
  }

  return `  <!-- Visual Breadcrumb Navigation -->
  <div class="bg-slate-900 border-b border-slate-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
      <nav aria-label="Breadcrumb">
        <ol class="flex items-center flex-wrap gap-2 text-xs font-medium text-slate-400">
          <li class="inline-flex items-center">
            <a href="/" class="text-slate-400 hover:text-yellow-300 transition-colors inline-flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
              <span>Home</span>
            </a>
          </li>
          <li class="text-slate-600 inline-flex items-center" aria-hidden="true">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </li>
          <li>
            <a href="${config.categoryUrl}" class="text-slate-400 hover:text-yellow-300 transition-colors">${categoryTitle}</a>
          </li>
          <li class="text-slate-600 inline-flex items-center" aria-hidden="true">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </li>
          <li class="text-yellow-300 font-semibold truncate max-w-[260px] sm:max-w-none" aria-current="page">${displayTitle}</li>
        </ol>
      </nav>
    </div>
  </div>`;
}

// 1. Process markdown guide content
const contentDir = path.join(process.cwd(), 'content');
let tools = [
  { htmlFile: 'success-stories.html', mdKey: 'success-stories' }
];

if (fs.existsSync(contentDir)) {
  const mdFiles = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
  mdFiles.forEach(mdFile => {
    const mdKey = mdFile.replace(/\.md$/, '');
    const htmlFile = `${mdKey}.html`;
    tools.push({ htmlFile, mdKey });
  });
}

tools.forEach(({ htmlFile, mdKey }) => {
  const mdPath = path.join(process.cwd(), 'content', `${mdKey}.md`);
  const htmlPath = path.join(process.cwd(), htmlFile);

  if (!fs.existsSync(mdPath) || !fs.existsSync(htmlPath)) {
    return;
  }

  const markdown = fs.readFileSync(mdPath, 'utf8');
  const renderedHtml = renderMarkdown(markdown);
  let htmlContent = fs.readFileSync(htmlPath, 'utf8');

  const guideRegex = /(<section\s+id="toolGuide"[^>]*>)([\s\S]*?)(<\/section>)/i;
  const prerenderedDivRegex = /(<div\s+id="prerendered-guide"[^>]*>)([\s\S]*?)(<\/div>)/i;

  if (guideRegex.test(htmlContent)) {
    htmlContent = htmlContent.replace(guideRegex, (match, p1, p2, p3) => `${p1}${renderedHtml}${p3}`);
    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    console.log(`Successfully updated prerendered guide in ${htmlFile}`);
  } else if (prerenderedDivRegex.test(htmlContent)) {
    htmlContent = htmlContent.replace(prerenderedDivRegex, (match, p1, p2, p3) => `${p1}${renderedHtml}${p3}`);
    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    console.log(`Successfully updated prerendered guide in ${htmlFile}`);
  }
});

// 2. Prerender complete shared footer, navigation, and breadcrumbs into ALL HTML files
const allHtmlFiles = fs.readdirSync(process.cwd()).filter(f => f.endsWith('.html'));
let footersUpdated = 0;
let navsUpdated = 0;
let breadcrumbsUpdated = 0;

const navItems = [
  ['/', 'Home'],
  ['/education', 'Education Tools'],
  ['/finance', 'Finance Tools'],
  ['/health', 'Health Tools'],
  ['/productivity', 'Productivity Tools'],
  ['/success-stories', 'Success Stories'],
  ['/widgets', 'All Tools Directory']
];

const legalNavItems = [
  ['/privacy-policy', 'Privacy Policy'],
  ['/terms', 'Terms of Service'],
  ['/cookie-policy', 'Cookie Policy'],
  ['/adsense-disclaimer', 'AdSense Disclaimer'],
  ['/about', 'About Us'],
  ['/contact', 'Contact']
];

allHtmlFiles.forEach(htmlFile => {
  const htmlPath = path.join(process.cwd(), htmlFile);
  let content = fs.readFileSync(htmlPath, 'utf8');
  let updated = false;

  const pageSlug = htmlFile === 'index.html' ? '/' : htmlFile.replace(/\.html$/, '');

  // 1. Remove duplicate or unneeded legacy scripts from non-tool pages
  if (htmlFile !== 'qr-code-generator.html' && htmlFile !== 'whatsapp-direct-link-qr-generator.html') {
    content = content.replace(/\s*<script[^>]*src=["']\/?qrcode\.js["'][^>]*><\/script>/gi, '');
  }

  // 2. Normalize and optimize <head> for 100% PageSpeed Performance & Zero CLS
  const headMatch = content.match(/<head>([\s\S]*?)<\/head>/i);
  if (headMatch) {
    let headInner = headMatch[1];

    // Remove legacy raw GA / AdSense script tags
    headInner = headInner.replace(/<!--\s*Google Analytics[\s\S]*?-->/gi, '');
    headInner = headInner.replace(/<!--\s*Google AdSense[\s\S]*?-->/gi, '');
    headInner = headInner.replace(/<!--\s*Resource Preconnects[\s\S]*?-->/gi, '');
    headInner = headInner.replace(/<link\s+rel=["']preconnect["'][^>]*\/?>\s*/gi, '');
    headInner = headInner.replace(/<link\s+rel=["']dns-prefetch["'][^>]*\/?>\s*/gi, '');
    headInner = headInner.replace(/<script[^>]*googletagmanager\.com[\s\S]*?<\/script>/gi, '');
    headInner = headInner.replace(/<script[^>]*pagead2\.googlesyndication\.com[\s\S]*?<\/script>/gi, '');
    headInner = headInner.replace(/<script[^>]*>[\s\S]*?window\.dataLayer[\s\S]*?<\/script>/gi, '');
    headInner = headInner.replace(/<script[^>]*>[\s\S]*?loadThirdParty[\s\S]*?<\/script>/gi, '');

    // Extract meta charset and viewport if present
    headInner = headInner.replace(/<meta\s+charset=["'][^"']+["']\s*\/?>\s*/gi, '');
    headInner = headInner.replace(/<meta\s+name=["']viewport["'][^>]*\/?>\s*/gi, '');

    // Ensure CSS links are clean
    headInner = headInner.replace(/<!--\s*Multi-Path CSS Inclusion[\s\S]*?-->/gi, '');
    headInner = headInner.replace(/<link\s+rel=["']preload["'][^>]*styles\.css["'][^>]*\/?>\s*/gi, '');
    headInner = headInner.replace(/<link\s+rel=["']stylesheet["']\s+href=["']\/?(?:dist\/)?styles\.css["'][^>]*\/?>\s*/gi, '');
    headInner = headInner.replace(/<link\s+rel=["']stylesheet["']\s+href=["']\/?branding\.css["'][^>]*\/?>\s*/gi, '');
    headInner = headInner.replace(/<link\s+rel=["']stylesheet["']\s+href=["']\/?cards\.css["'][^>]*\/?>\s*/gi, '');
    headInner = headInner.replace(/<link\s+rel=["']stylesheet["']\s+href=["']\/?category-pages\.css["'][^>]*\/?>\s*/gi, '');
    headInner = headInner.replace(/<link\s+rel=["']stylesheet["']\s+href=["']\/?new-tools\.css["'][^>]*\/?>\s*/gi, '');
    headInner = headInner.replace(/<noscript><link\s+rel=["']stylesheet["']\s+href=["']\/dist\/styles\.css["']\s*\/><\/noscript>\s*/gi, '');
    headInner = headInner.replace(/<noscript>\s*<\/noscript>\s*/gi, '');

    const optimizedHeadPrefix = `
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!-- Multi-Path CSS Inclusion for 100% Instant Stylesheet Loading & Zero CLS -->
  <link rel="preload" href="/styles.css" as="style" />
  <link rel="stylesheet" href="branding.css" />
  <link rel="stylesheet" href="styles.css" />
  <link rel="stylesheet" href="/dist/styles.css" />
  <!-- Resource Preconnects for Fast Asset Delivery -->
  <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossorigin />
  <link rel="preconnect" href="https://www.googletagmanager.com" crossorigin />
  <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
  <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
  <!-- Google Analytics (GA4) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-6V491CW7H0"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag("js", new Date());
    gtag("config", "G-6V491CW7H0");
  </script>
  <!-- Google AdSense Official Script Tag -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2239061398283474" crossorigin="anonymous"></script>
`;

    headInner = optimizedHeadPrefix + headInner.trimStart();
    content = content.replace(/<head>[\s\S]*?<\/head>/i, `<head>${headInner}\n</head>`);
    updated = true;
  }

  const isLegalPage = legalNavItems.some(([href]) => href === pageSlug);

  // Pre-render Desktop Navigation Links
  const primaryDesktopLinksHtml = navItems.map(([href, label]) => {
    const isCurrent = href === pageSlug || (href === '/' && pageSlug === '/');
    const classes = 'transition-colors hover:text-yellow-300' + (isCurrent ? ' text-yellow-300 font-bold' : '');
    return `<a href="${href}" class="${classes}">${escapeHtml(label)}</a>`;
  }).join('\n        ');

  const legalDropdownLinksHtml = legalNavItems.map(([href, label]) => {
    const isCurrent = href === pageSlug;
    const classes = 'block px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-yellow-300 transition-colors' + (isCurrent ? ' text-yellow-300 font-bold bg-slate-800/60' : '');
    return `<a href="${href}" class="${classes}">${escapeHtml(label)}</a>`;
  }).join('\n            ');

  const desktopNavInnerHtml = `${primaryDesktopLinksHtml}
        <div class="relative nav-dropdown group">
          <button type="button" class="flex items-center gap-1 transition-colors hover:text-yellow-300 py-1 cursor-pointer focus:outline-none${isLegalPage ? ' text-yellow-300 font-bold' : ''}" aria-expanded="false" aria-haspopup="true" aria-label="Legal and policy pages">
            <span>Legal</span>
            <svg class="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div class="nav-dropdown-menu absolute right-0 top-full pt-1.5 w-48 hidden group-hover:block z-50">
            <div class="rounded-xl bg-slate-900 border border-slate-700/90 shadow-2xl py-1.5 backdrop-blur-md">
            ${legalDropdownLinksHtml}
            </div>
          </div>
        </div>`;

  const primaryMobileLinksHtml = navItems.map(([href, label]) => {
    const isCurrent = href === pageSlug || (href === '/' && pageSlug === '/');
    const classes = 'block py-2 hover:text-yellow-300 transition-colors' + (isCurrent ? ' text-yellow-300 font-bold' : '');
    return `<a href="${href}" class="${classes}">${escapeHtml(label)}</a>`;
  }).join('\n    ');

  const legalMobileLinksHtml = legalNavItems.map(([href, label]) => {
    const isCurrent = href === pageSlug;
    const classes = 'py-1.5 px-2 rounded hover:bg-slate-800 hover:text-yellow-300 text-slate-300 transition-colors' + (isCurrent ? ' text-yellow-300 font-bold bg-slate-800/60' : '');
    return `<a href="${href}" class="${classes}">${escapeHtml(label)}</a>`;
  }).join('\n        ');

  const mobileMenuHtml = `<div id="mobileMenu" class="mobile-menu md:hidden border-t border-slate-800 bg-slate-900 px-4 py-3 space-y-2 text-sm font-semibold">
    ${primaryMobileLinksHtml}
    <div class="pt-2.5 mt-2 border-t border-slate-800/80">
      <div class="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-1.5">Legal &amp; Info</div>
      <div class="grid grid-cols-2 gap-1 text-xs font-medium">
        ${legalMobileLinksHtml}
      </div>
    </div>
  </div>`;

  const fullNavHtml = `  <nav class="bg-slate-900 text-white sticky top-0 z-50 shadow-xl">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <a href="/" class="flex items-center space-x-2">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 4L20.5 14L30 18L20.5 22L18 32L15.5 22L6 18L15.5 14Z" fill="#FACC15"/>
            <circle cx="28" cy="9" r="2.5" fill="#CA8A04"/>
            <circle cx="9" cy="11" r="1.5" fill="#FACC15" opacity="0.7"/>
          </svg>
          <span class="text-xl font-extrabold text-white">Afri<span class="text-yellow-300">Widget</span></span>
        </a>
        <div class="hidden md:flex items-center space-x-6 text-sm font-medium">
        ${desktopNavInnerHtml}
      </div>
        <button id="mobileMenuBtn" class="md:hidden p-2 rounded-md hover:bg-slate-700" aria-label="Open navigation menu">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
    </div>
    ${mobileMenuHtml}
  </nav>`;

  // 1. If nav-placeholder is present, replace with full navigation
  if (content.includes('<div id="nav-placeholder"></div>')) {
    content = content.replace('<div id="nav-placeholder"></div>', fullNavHtml);
    updated = true;
  }

  // 2. If a top-level nav tag exists (excluding breadcrumbs), cleanly replace the entire primary navbar block
  const navBlockRegex = /<nav(?!\s+aria-label=["']Breadcrumb["'])[^>]*>[\s\S]*?<\/nav>/i;
  if (navBlockRegex.test(content)) {
    content = content.replace(navBlockRegex, fullNavHtml);
    updated = true;
  } else if (!content.includes('<nav')) {
    content = content.replace(/(<body[^>]*>)/i, `$1\n${fullNavHtml}`);
    updated = true;
  }

  // Pre-render Shared Breadcrumbs
  const breadcrumbHtml = generateBreadcrumbHtml(htmlFile, content);
  // Robustly remove any existing breadcrumbs (regardless of comment syntax or formatting)
  content = content.replace(/\s*<!--\s*(?:Visual|Pre-rendered|Shared)?\s*Breadcrumb(?:\s*Navigation)?\s*-->[\s\S]*?<nav\s+aria-label=["']Breadcrumb["']>[\s\S]*?<\/nav>\s*<\/div>\s*<\/div>/gi, '');
  content = content.replace(/\s*<div\s+class=["']bg-slate-900\s+border-b\s+border-slate-800\/80["']>[\s\S]*?<nav\s+aria-label=["']Breadcrumb["']>[\s\S]*?<\/nav>\s*<\/div>\s*<\/div>/gi, '');
  content = content.replace(/\s*<!--\s*(?:Visual|Pre-rendered|Shared)?\s*Breadcrumb(?:\s*Navigation)?\s*-->[\s\S]*?<\/div>\s*<\/div>/gi, '');

  const navCloseIndex = content.indexOf('</nav>');
  if (navCloseIndex !== -1) {
    const beforeNav = content.slice(0, navCloseIndex + 6);
    const afterNav = content.slice(navCloseIndex + 6);
    content = beforeNav + '\n' + breadcrumbHtml + afterNav;
    updated = true;
    breadcrumbsUpdated++;
  }

  // Ensure nav.js is included
  if (!content.includes('nav.js')) {
    content = content.replace('</body>', '  <script src="/nav.js" defer></script>\n</body>');
    updated = true;
  }

  // Pre-render Shared Footer
  const footerRegex = /<footer[^>]*>([\s\S]*?)<\/footer>/i;
  if (footerRegex.test(content)) {
    content = content.replace(footerRegex, sharedFooterMarkup);
    updated = true;
    footersUpdated++;
  } else if (content.includes('</body>')) {
    content = content.replace('</body>', `${sharedFooterMarkup}\n</body>`);
    updated = true;
    footersUpdated++;
  }

  if (updated) {
    fs.writeFileSync(htmlPath, content, 'utf8');
    navsUpdated++;
  }
});

console.log(`Prerendered navigation, breadcrumbs (${breadcrumbsUpdated} files), and shared footer in ${navsUpdated} HTML files.`);
