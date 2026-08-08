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
        <p class="text-sm leading-relaxed text-slate-400">
          Free browser-based tools with Groq-powered Finance and Education insights where enabled. Built for Africa and the world.
        </p>
      </div>

      <div>
        <h4 class="text-white font-bold mb-4 text-sm uppercase tracking-wider">Categories</h4>
        <ul class="space-y-2 text-sm">
           <li><a href="health" class="hover:text-emerald-400 transition-colors">Health &amp; Wellness</a></li>
           <li><a href="finance" class="hover:text-emerald-400 transition-colors">Finance &amp; Wealth</a></li>
           <li><a href="real-estate" class="hover:text-emerald-400 transition-colors">Real Estate &amp; Housing</a></li>
           <li><a href="business" class="hover:text-emerald-400 transition-colors">Business &amp; Freelance</a></li>
           <li><a href="education" class="hover:text-emerald-400 transition-colors">Education &amp; Academics</a></li>
            <li><a href="productivity" class="hover:text-emerald-400 transition-colors">Productivity Tools</a></li>
            <li><a href="widgets" class="hover:text-emerald-400 transition-colors">All Tools Directory</a></li>
        </ul>
      </div>

      <div>
        <h4 class="text-white font-bold mb-4 text-sm uppercase tracking-wider">Calculators</h4>
        <ul class="space-y-2 text-sm">
          <li><a href="bmi-calculator" class="hover:text-emerald-400 transition-colors">BMI / BMR / TDEE</a></li>
          <li><a href="body-fat-calculator" class="hover:text-emerald-400 transition-colors">Body Fat Calculator</a></li>
          <li><a href="daily-calorie-needs-calculator" class="hover:text-emerald-400 transition-colors">Daily Calorie Needs</a></li>
          <li><a href="calorie-burn-calculator" class="hover:text-emerald-400 transition-colors">Calorie Burn</a></li>
          <li><a href="ideal-weight-calculator" class="hover:text-emerald-400 transition-colors">Ideal Weight</a></li>
          <li><a href="healthy-weight-range-calculator" class="hover:text-emerald-400 transition-colors">Healthy Weight Range</a></li>
          <li><a href="pediatric-dosage-calculator" class="hover:text-emerald-400 transition-colors">Pediatric Dosage</a></li>
          <li><a href="ovulation-cycle-calculator" class="hover:text-emerald-400 transition-colors">Ovulation &amp; Cycle</a></li>
          <li><a href="water-intake-calculator" class="hover:text-emerald-400 transition-colors">Water Intake</a></li>
          <li><a href="hydration-reminder-calculator" class="hover:text-emerald-400 transition-colors">Hydration Reminder</a></li>
          <li><a href="calorie-deficit-planner" class="hover:text-emerald-400 transition-colors">Calorie Deficit</a></li>
          <li><a href="blood-donation-eligibility-calculator" class="hover:text-emerald-400 transition-colors">Blood Donation Eligibility</a></li>
          <li><a href="compound-interest" class="hover:text-emerald-400 transition-colors">Compound Interest</a></li>
           <li><a href="loan-calculator" class="hover:text-emerald-400 transition-colors">Loan Calculator</a></li>
           <li><a href="savings-calculator" class="hover:text-emerald-400 transition-colors">Savings Calculator</a></li>
           <li><a href="currency-converter" class="hover:text-emerald-400 transition-colors">Currency Converter</a></li>
           <li><a href="percentage-calculator" class="hover:text-emerald-400 transition-colors">Percentage Calculator</a></li>
          <li><a href="mortgage-calculator" class="hover:text-emerald-400 transition-colors">Mortgage Payment</a></li>
          <li><a href="rent-affordability" class="hover:text-emerald-400 transition-colors">Rent Affordability</a></li>
          <li><a href="gpa-calculator" class="hover:text-emerald-400 transition-colors">GPA Calculator</a></li>
           <li><a href="wassce-aggregate-calculator" class="hover:text-emerald-400 transition-colors">WASSCE Aggregate</a></li>
           <li><a href="bece-aggregate-calculator" class="hover:text-emerald-400 transition-colors">BECE Aggregate</a></li>
           <li><a href="jamb-utme-aggregate-calculator" class="hover:text-emerald-400 transition-colors">JAMB UTME Aggregate</a></li>
           <li><a href="tertiary-gpa-cgpa-calculator" class="hover:text-emerald-400 transition-colors">Tertiary GPA &amp; CGPA</a></li>
           <li><a href="south-african-aps-calculator" class="hover:text-emerald-400 transition-colors">South African APS</a></li>
           <li><a href="kcse-kuccps-cluster-calculator" class="hover:text-emerald-400 transition-colors">KCSE &amp; KUCCPS</a></li>
           <li><a href="university-cutoff-eligibility-checker" class="hover:text-emerald-400 transition-colors">University Eligibility</a></li>
           <li><a href="olevel-subject-combination-checker" class="hover:text-emerald-400 transition-colors">WAEC / NECO Subjects</a></li>
           <li><a href="kcse-eligibility-tier-checker" class="hover:text-emerald-400 transition-colors">KCSE Eligibility Tier</a></li>
           <li><a href="south-african-tvet-nated-calculator" class="hover:text-emerald-400 transition-colors">TVET NATED Pass</a></li>
            <li><a href="icass-calculator" class="hover:text-emerald-400 transition-colors">ICASS Calculator</a></li>
           <li><a href="bece-cssps-placement-estimator" class="hover:text-emerald-400 transition-colors">BECE CSSPS Placement</a></li>
           <li><a href="igcse-alevel-gpa-converter" class="hover:text-emerald-400 transition-colors">IGCSE / A-Level GPA</a></li>
           <li><a href="invoice-receipt-generator" class="hover:text-emerald-400 transition-colors">Invoice &amp; Receipt PDF</a></li>
           <li><a href="whatsapp-direct-link-qr-generator" class="hover:text-emerald-400 transition-colors">WhatsApp Direct Link</a></li>
           <li><a href="qr-code-generator" class="hover:text-emerald-400 transition-colors">QR Code Generator</a></li>
          <li><a href="paypal-fee-calculator" class="hover:text-emerald-400 transition-colors">Payment Fee Calculator</a></li>
          <li><a href="profit-margin-calculator" class="hover:text-emerald-400 transition-colors">Profit Margin</a></li>
          <li><a href="hourly-to-salary" class="hover:text-emerald-400 transition-colors">Hourly to Salary</a></li>
           <li><a href="ai-business-name-generator" class="hover:text-emerald-400 transition-colors">AI Business Name</a></li>
           <li><a href="ai-product-description-generator" class="hover:text-emerald-400 transition-colors">AI Product Description</a></li>
           <li><a href="ai-gig-description-generator" class="hover:text-emerald-400 transition-colors">AI Gig Description</a></li>
           <li><a href="ai-paraphrasing-tool" class="hover:text-emerald-400 transition-colors">AI Paraphrasing Tool</a></li>
           <li><a href="ai-text-summarizer" class="hover:text-emerald-400 transition-colors">AI Text Summarizer</a></li>
        </ul>
      </div>

      <div>
        <h4 class="text-white font-bold mb-4 text-sm uppercase tracking-wider">Utilities &amp; Legal</h4>
        <ul class="space-y-2 text-sm">
          <li><a href="word-counter" class="hover:text-emerald-400 transition-colors">Word Counter</a></li>
          <li><a href="json-formatter" class="hover:text-emerald-400 transition-colors">JSON Formatter</a></li>
          <li><a href="markdown-to-html-converter" class="hover:text-emerald-400 transition-colors">Markdown to HTML</a></li>
          <li><a href="html-minifier" class="hover:text-emerald-400 transition-colors">HTML Minifier</a></li>
          <li><a href="base64-encoder-decoder" class="hover:text-emerald-400 transition-colors">Base64 Encoder &amp; Decoder</a></li>
          <li><a href="password-generator" class="hover:text-emerald-400 transition-colors">Password Generator</a></li>
           <li><a href="random-email-generator" class="hover:text-emerald-400 transition-colors">Random Email Generator</a></li>
           <li><a href="random-username-generator" class="hover:text-emerald-400 transition-colors">Random Username Generator</a></li>
           <li><a href="random-business-name-generator" class="hover:text-emerald-400 transition-colors">Random Business Name Generator</a></li>
           <li><a href="random-team-name-generator" class="hover:text-emerald-400 transition-colors">Random Team Name Generator</a></li>
           <li><a href="random-nickname-generator" class="hover:text-emerald-400 transition-colors">Random Nickname Generator</a></li>
           <li><a href="random-address-generator" class="hover:text-emerald-400 transition-colors">Random Address Generator</a></li>
           <li><a href="random-phone-number-generator" class="hover:text-emerald-400 transition-colors">Random Phone Number Generator</a></li>
           <li><a href="random-date-generator" class="hover:text-emerald-400 transition-colors">Random Date Generator</a></li>
           <li><a href="random-color-generator" class="hover:text-emerald-400 transition-colors">Random Color Generator</a></li>
           <li><a href="ai-resume-builder" class="hover:text-emerald-400 transition-colors">AI Resume Builder</a></li>
           <li><a href="ai-cover-letter-generator" class="hover:text-emerald-400 transition-colors">AI Cover Letter Generator</a></li>
           <li><a href="ai-linkedin-headline-generator" class="hover:text-emerald-400 transition-colors">AI LinkedIn Headline</a></li>
           <li><a href="ai-bio-generator" class="hover:text-emerald-400 transition-colors">AI Professional Bio</a></li>
           <li><a href="ai-email-writer" class="hover:text-emerald-400 transition-colors">AI Email Writer</a></li>
           <li><a href="ai-social-media-caption-generator" class="hover:text-emerald-400 transition-colors">AI Social Captions</a></li>
           <li><a href="ai-hashtag-generator" class="hover:text-emerald-400 transition-colors">AI Hashtag Generator</a></li>
           <li><a href="ai-youtube-title-generator" class="hover:text-emerald-400 transition-colors">AI YouTube Titles</a></li>
           <li><a href="ai-youtube-description-generator" class="hover:text-emerald-400 transition-colors">AI YouTube Descriptions</a></li>
           <li><a href="ai-blog-title-generator" class="hover:text-emerald-400 transition-colors">AI Blog Titles</a></li>
          <li><a href="seo-meta-generator" class="hover:text-emerald-400 transition-colors">SEO Meta Tag Generator</a></li>
           <li><a href="age-calculator" class="hover:text-emerald-400 transition-colors">Age Calculator</a></li>
           <li><a href="unit-converter" class="hover:text-emerald-400 transition-colors">Unit Converter</a></li>
           <li><a href="reading-time-speech-estimator" class="hover:text-emerald-400 transition-colors">Reading Time Estimator</a></li>
           <li><a href="text-case-converter-cleanup" class="hover:text-emerald-400 transition-colors">Text Case Converter</a></li>
           <li><a href="image-resizer-webp-converter" class="hover:text-emerald-400 transition-colors">Image Resizer &amp; WebP</a></li>
           <li><a href="robots-txt-generator" class="hover:text-emerald-400 transition-colors">Robots.txt Generator</a></li>
           <li><a href="xml-sitemap-builder" class="hover:text-emerald-400 transition-colors">XML Sitemap Builder</a></li>
           <li><a href="meta-pixel-checker" class="hover:text-emerald-400 transition-colors">Meta Pixel Checker</a></li>
           <li><a href="keyword-density-checker" class="hover:text-emerald-400 transition-colors">Keyword Density Checker</a></li>
           <li><a href="url-slug-generator" class="hover:text-emerald-400 transition-colors">URL Slug Generator</a></li>
          <li class="pt-2"><a href="about" class="hover:text-emerald-400 transition-colors">About Us</a></li>
          <li><a href="faq" class="hover:text-emerald-400 transition-colors">FAQ</a></li>
          <li><a href="contact" class="hover:text-emerald-400 transition-colors">Contact</a></li>
          <li><a href="privacy-policy" class="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
          <li><a href="terms" class="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
          <li><a href="adsense-disclaimer" class="hover:text-emerald-400 transition-colors">AdSense Disclaimer</a></li>
          <li><a href="cookie-policy" class="hover:text-emerald-400 transition-colors">Cookie Policy</a></li>
        </ul>
      </div>
    </div>
    <div class="max-w-7xl mx-auto border-t border-slate-700 pt-6 text-center text-sm text-slate-500">
      <p>&copy; 2025 AfriWidget. All rights reserved. For informational purposes only — not professional medical, financial, or academic advice.</p>
    </div>
  `;

  function renderSharedFooter() {
    var footer = document.querySelector('footer');
    if (!footer) return;

    footer.className = 'bg-slate-900 text-slate-300 pt-14 pb-8 px-4 mt-16';
    footer.setAttribute('aria-label', 'AfriWidget site footer');
    footer.innerHTML = footerMarkup;

    syncSocialMetadata();
    enhanceToolTrust();
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

  function enhanceToolTrust() {
    /*
     * Tool pages identify themselves with the WebApplication schema. Keeping
     * this enhancement here means every static tool gets the same trust
     * treatment without duplicating markup or adding a framework.
     */
    var hasToolSchema = Array.prototype.some.call(
      document.querySelectorAll('script[type="application/ld+json"]'),
      function (script) {
        return script.textContent.indexOf('"WebApplication"') !== -1;
      }
    );
    var main = document.querySelector('main');
    if (!hasToolSchema || !main) return;

    if (!document.getElementById('afriwidget-trust-badge-styles')) {
      var styles = document.createElement('style');
      styles.id = 'afriwidget-trust-badge-styles';
      styles.textContent = [
        '.afriwidget-trust-badge{display:inline-flex;align-items:center;gap:.35rem;margin:0 0 .75rem;padding:.35rem .7rem;border:1px solid #a7f3d0;border-radius:9999px;background:#ecfdf5;color:#047857;font-size:.75rem;font-weight:700;letter-spacing:.01em;line-height:1.25}',
        '.afriwidget-trust-badge::first-letter{font-size:.9rem}'
      ].join('');
      document.head.appendChild(styles);
    }

    var primaryCtas = Array.prototype.filter.call(
      main.querySelectorAll('button'),
      function (button) {
        var label = button.textContent.trim();
        if (!label || /mobile|menu|add |clear|copy|accept|decline|uppercase|lowercase|title case|sentence case|camelcase|url slug|remove /i.test(label)) return false;
        return /calculate|compute|convert|generate|estimate|check|create|format|validate|minif|resize|download|count|score|metrics|growth|fees|margin|affordability|password|link|age/i.test(label) || button.type === 'submit';
      }
    );
    var headings = main.querySelectorAll('h2, h3');
    headings.forEach(function (heading) {
      if (heading.closest('article') || heading.previousElementSibling && heading.previousElementSibling.classList.contains('afriwidget-trust-badge')) return;
      var card = heading.closest('form, section, [class*="rounded-2xl"], [class*="rounded-xl"], [class*="rounded-lg"]');
      if (!card || !card.querySelector('button, input, select, textarea')) return;
      var badge = document.createElement('div');
      badge.className = 'afriwidget-trust-badge';
      badge.setAttribute('aria-label', '100% free tool with no signup required');
       badge.textContent = '100% Free • No Signup Required';
      heading.parentNode.insertBefore(badge, heading);
    });

    primaryCtas.forEach(function (cta) {
      var originalLabel = cta.textContent.trim();
      if (!originalLabel || /no account needed/i.test(originalLabel)) return;
      var action = 'Use Instantly';
      if (/calculate|compute|score|gpa|aggregate|metrics|age|margin|interest|payment|percentage|salary|affordability|eligibility|pass/i.test(originalLabel)) action = 'Calculate Instantly';
      else if (/convert|resize/i.test(originalLabel)) action = 'Convert Instantly';
      else if (/generate|create|invoice|receipt|password|link|qr/i.test(originalLabel)) action = 'Create Instantly';
      else if (/format|validate|minif/i.test(originalLabel)) action = 'Format Instantly';
      else if (/check|estimate/i.test(originalLabel)) action = 'Check Instantly';
      else if (/count/i.test(originalLabel)) action = 'Count Instantly';
      cta.textContent = action + ' · No Account Needed';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderSharedFooter);
  } else {
    renderSharedFooter();
  }
})();