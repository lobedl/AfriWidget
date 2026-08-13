import fs from 'fs';
import path from 'path';

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, function (character) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character];
  });
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
         <li><a href="/kcse-kuccps-cluster-calculator" class="hover:text-emerald-400 transition-colors">KCSE &amp; KUCCPS</a></li>
         <li><a href="/university-cutoff-eligibility-checker" class="hover:text-emerald-400 transition-colors">University Eligibility</a></li>
         <li><a href="/olevel-subject-combination-checker" class="hover:text-emerald-400 transition-colors">WAEC / NECO Subjects</a></li>
         <li><a href="/kcse-eligibility-tier-checker" class="hover:text-emerald-400 transition-colors">KCSE Eligibility Tier</a></li>
         <li><a href="/south-african-tvet-nated-calculator" class="hover:text-emerald-400 transition-colors">TVET NATED Pass</a></li>
          <li><a href="/icass-calculator" class="hover:text-emerald-400 transition-colors">ICASS Calculator</a></li>
         <li><a href="/bece-cssps-placement-estimator" class="hover:text-emerald-400 transition-colors">BECE CSSPS Placement</a></li>
         <li><a href="/igcse-alevel-gpa-converter" class="hover:text-emerald-400 transition-colors">IGCSE / A-Level GPA</a></li>
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
  if (guideRegex.test(htmlContent)) {
    htmlContent = htmlContent.replace(guideRegex, (match, p1, p2, p3) => `${p1}${renderedHtml}${p3}`);
    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    console.log(`Successfully updated prerendered guide in ${htmlFile}`);
  }
});

// 2. Prerender complete shared footer into ALL HTML files to eliminate Cumulative Layout Shift (CLS)
const allHtmlFiles = fs.readdirSync(process.cwd()).filter(f => f.endsWith('.html'));
let footersUpdated = 0;

allHtmlFiles.forEach(htmlFile => {
  const htmlPath = path.join(process.cwd(), htmlFile);
  let content = fs.readFileSync(htmlPath, 'utf8');

  const footerRegex = /<footer[^>]*>([\s\S]*?)<\/footer>/i;
  if (footerRegex.test(content)) {
    content = content.replace(footerRegex, sharedFooterMarkup);
    fs.writeFileSync(htmlPath, content, 'utf8');
    footersUpdated++;
  } else if (content.includes('</body>')) {
    // Insert footer right before </body>
    content = content.replace('</body>', `${sharedFooterMarkup}\n</body>`);
    fs.writeFileSync(htmlPath, content, 'utf8');
    footersUpdated++;
  }
});

console.log(`Prerendered complete shared footer in ${footersUpdated} HTML files.`);

