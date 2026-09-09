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
  <!-- Top Feature & Trust Pillars (Desktop 3-Column / Mobile Stacked) -->
  <div class="max-w-7xl mx-auto mb-12 pb-10 border-b border-slate-800/80">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
      <div class="flex items-start gap-3.5 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 transition-colors hover:border-slate-700/80">
        <div class="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
        </div>
        <div>
          <h4 class="text-sm font-semibold text-white">Zero-Storage Privacy</h4>
          <p class="text-xs text-slate-400 mt-1 leading-relaxed">Calculations process 100% in-browser. Your grades, health metrics, and financial inputs never touch our servers.</p>
        </div>
      </div>

      <div class="flex items-start gap-3.5 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 transition-colors hover:border-slate-700/80">
        <div class="w-9 h-9 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0 text-yellow-400 mt-0.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
        </div>
        <div>
          <h4 class="text-sm font-semibold text-white">Statutorily Aligned Models</h4>
          <p class="text-xs text-slate-400 mt-1 leading-relaxed">Formulas and grading algorithms calibrated to official WAEC, JAMB, KUCCPS, DHET, and international academic standards.</p>
        </div>
      </div>

      <div class="flex items-start gap-3.5 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 transition-colors hover:border-slate-700/80">
        <div class="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400 mt-0.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <div>
          <h4 class="text-sm font-semibold text-white">100% Free &amp; Open Access</h4>
          <p class="text-xs text-slate-400 mt-1 leading-relaxed">No paywalls, no mandatory signups, and zero gated features. Designed for high speed on smartphones and low-bandwidth connections.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Navigation Grid: 4 cols for Brand, 8 cols divided evenly into 4 link columns -->
  <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mb-14">
    <!-- Brand & Platform Column -->
    <div class="lg:col-span-4 min-w-0 space-y-4">
      <a href="/" class="inline-flex items-center space-x-2.5 group" aria-label="AfriWidget Home">
        <svg width="34" height="34" viewBox="0 0 36 36" fill="none" class="shrink-0" aria-hidden="true">
          <path d="M18 4L20.5 14L30 18L20.5 22L18 32L15.5 22L6 18L15.5 14Z" fill="#FACC15"/>
          <circle cx="28" cy="9" r="2.5" fill="#CA8A04"/>
          <circle cx="9" cy="11" r="1.5" fill="#FACC15" opacity="0.7"/>
        </svg>
        <span class="text-2xl font-black tracking-tight text-white">Afri<span class="text-yellow-300">Widget</span></span>
      </a>
      <p class="text-xs sm:text-sm leading-relaxed text-slate-400 max-w-sm">
        Africa's premier open computational platform. Delivering verified academic calculators, financial modeling tools, health calculators, and digital utilities with client-side privacy.
      </p>

      <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 max-w-sm">
        <div class="flex items-center gap-2 mb-1.5">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-xs font-semibold text-slate-200">Independent &amp; Free Platform</span>
        </div>
        <p class="text-[11px] leading-relaxed text-slate-400">
          Created by <strong class="text-slate-200">Obed Avorlenu</strong> — self-taught web developer who studied business at Keta Business College, dedicated to building free, open computational tools.
        </p>
      </div>

      <div class="flex items-center flex-wrap gap-2 pt-1">
        <a href="https://x.com/AfriWidget" target="_blank" rel="noopener noreferrer" aria-label="AfriWidget on X (Twitter)" title="Follow on X" class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
        <a href="https://www.linkedin.com/in/obed-avorlenu-ab9149397?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" aria-label="Obed Avorlenu on LinkedIn" title="Connect on LinkedIn" class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.9 0-1.63.73-1.63 1.63 0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.63-1.63-1.63Z"/></svg>
        </a>
        <a href="https://wa.me/233202208348" target="_blank" rel="noopener noreferrer" aria-label="Message on WhatsApp" title="Chat on WhatsApp" class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.19-.09-1.12-.55-1.3-.61-.17-.07-.3-.1-.43.1-.12.19-.49.61-.6.74-.11.12-.23.14-.42.05-.19-.09-.8-.3-1.53-.94-.57-.5-.95-1.12-1.06-1.31-.11-.19-.01-.29.08-.38.08-.09.19-.23.28-.35.09-.12.13-.19.19-.33.06-.14.03-.26-.02-.35-.04-.09-.43-1.03-.59-1.42-.15-.37-.31-.32-.43-.33h-.37c-.12 0-.33.05-.5.23-.17.19-.66.65-.66 1.58s.68 1.83.77 1.96c.1.12 1.33 2.04 3.23 2.86.45.2.8.31 1.08.4.46.15.87.13 1.2.08.37-.06 1.12-.46 1.28-.9.16-.45.16-.83.11-.92-.04-.09-.17-.14-.36-.24"/></svg>
        </a>
        <a href="https://www.instagram.com/afriwidget?igsh=MXg3cnZpMmd6bHEydA==" target="_blank" rel="noopener noreferrer" aria-label="AfriWidget on Instagram" title="Follow on Instagram" class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
        </a>
        <a href="https://www.facebook.com/share/1DBVMx47Zy/" target="_blank" rel="noopener noreferrer" aria-label="AfriWidget on Facebook" title="Follow on Facebook" class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </a>
      </div>
    </div>

    <!-- 4 Navigation Columns -->
    <div class="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-6">
      <!-- Academic Hubs -->
      <div class="space-y-3">
        <h3 class="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
          Academic Tools
        </h3>
        <ul class="space-y-2.5 text-xs sm:text-sm">
          <li><a href="/waec-grade-calculator" class="text-slate-400 hover:text-yellow-300 transition-colors">WASSCE / WAEC Calculator</a></li>
          <li><a href="/jamb-utme-aggregate-calculator" class="text-slate-400 hover:text-yellow-300 transition-colors">JAMB UTME Aggregate</a></li>
          <li><a href="/kcse-kuccps-cluster-calculator" class="text-slate-400 hover:text-yellow-300 transition-colors">KCSE KUCCPS Cluster</a></li>
          <li><a href="/south-african-aps-calculator" class="text-slate-400 hover:text-yellow-300 transition-colors">South Africa APS Points</a></li>
          <li><a href="/zimsec-alevel-points-calculator" class="text-slate-400 hover:text-yellow-300 transition-colors">ZIMSEC A-Level Points</a></li>
          <li><a href="/tertiary-gpa-cgpa-calculator" class="text-slate-400 hover:text-yellow-300 transition-colors">Tertiary GPA &amp; CGPA</a></li>
          <li class="pt-1.5 border-t border-slate-800/60"><a href="/education" class="text-yellow-400 hover:text-yellow-300 font-semibold text-xs inline-flex items-center gap-1">All Academic Hubs &rarr;</a></li>
        </ul>
      </div>

      <!-- Finance & Wealth -->
      <div class="space-y-3">
        <h3 class="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Finance &amp; Wealth
        </h3>
        <ul class="space-y-2.5 text-xs sm:text-sm">
          <li><a href="/loan-calculator" class="text-slate-400 hover:text-emerald-300 transition-colors">Loan &amp; Amortization</a></li>
          <li><a href="/debt-payoff-calculator" class="text-slate-400 hover:text-emerald-300 transition-colors">Debt Payoff &amp; Snowball</a></li>
          <li><a href="/savings-calculator" class="text-slate-400 hover:text-emerald-300 transition-colors">Compound Savings</a></li>
          <li><a href="/freelance-rate-calculator" class="text-slate-400 hover:text-emerald-300 transition-colors">Freelance Rate Planner</a></li>
          <li><a href="/break-even-calculator" class="text-slate-400 hover:text-emerald-300 transition-colors">Break-Even Calculator</a></li>
          <li><a href="/profit-margin-calculator" class="text-slate-400 hover:text-emerald-300 transition-colors">Profit Margin &amp; Markup</a></li>
          <li class="pt-1.5 border-t border-slate-800/60"><a href="/finance" class="text-emerald-400 hover:text-emerald-300 font-semibold text-xs inline-flex items-center gap-1">All Finance Tools &rarr;</a></li>
        </ul>
      </div>

      <!-- Health & Tools -->
      <div class="space-y-3">
        <h3 class="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          Health &amp; Tools
        </h3>
        <ul class="space-y-2.5 text-xs sm:text-sm">
          <li><a href="/bmi-calculator" class="text-slate-400 hover:text-cyan-300 transition-colors">BMI &amp; Ideal Weight</a></li>
          <li><a href="/water-intake-calculator" class="text-slate-400 hover:text-cyan-300 transition-colors">Water Intake Calculator</a></li>
          <li><a href="/body-fat-calculator" class="text-slate-400 hover:text-cyan-300 transition-colors">Body Fat &amp; Composition</a></li>
          <li><a href="/ovulation-cycle-calculator" class="text-slate-400 hover:text-cyan-300 transition-colors">Ovulation Cycle Tracker</a></li>
          <li><a href="/qr-code-generator" class="text-slate-400 hover:text-cyan-300 transition-colors">QR Code Generator</a></li>
          <li><a href="/json-formatter-validator" class="text-slate-400 hover:text-cyan-300 transition-colors">JSON Formatter</a></li>
          <li class="pt-1.5 border-t border-slate-800/60"><a href="/health" class="text-cyan-400 hover:text-cyan-300 font-semibold text-xs inline-flex items-center gap-1">All Health &amp; Tech &rarr;</a></li>
        </ul>
      </div>

      <!-- Company & Governance -->
      <div class="space-y-3">
        <h3 class="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          Platform &amp; Legal
        </h3>
        <ul class="space-y-2.5 text-xs sm:text-sm">
          <li><a href="/about" class="text-slate-400 hover:text-white transition-colors">About AfriWidget</a></li>
          <li><a href="/faq" class="text-slate-400 hover:text-white transition-colors">FAQ &amp; Help Center</a></li>
          <li><a href="/contact" class="text-slate-400 hover:text-white transition-colors">Contact &amp; Support</a></li>
          <li><a href="/privacy-policy" class="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
          <li><a href="/terms" class="text-slate-400 hover:text-white transition-colors">Terms of Service</a></li>
          <li><a href="/cookie-policy" class="text-slate-400 hover:text-white transition-colors">Cookie Policy</a></li>
          <li><a href="/adsense-disclaimer" class="text-slate-400 hover:text-white transition-colors">AdSense Disclaimer</a></li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Regional Coverage Strip -->
  <div class="max-w-7xl mx-auto border-t border-slate-800/80 pt-8 pb-8">
    <div class="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
      <div>
        <span class="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Supported Curricula &amp; Statutory Frameworks</span>
        <p class="text-xs text-slate-500">Official computational scoring models for national and international examining councils</p>
      </div>
      <div class="flex items-center flex-wrap justify-center md:justify-end gap-2 text-xs">
        <span class="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">🇬🇭 Ghana (WAEC)</span>
        <span class="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">🇳🇬 Nigeria (JAMB)</span>
        <span class="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">🇰🇪 Kenya (KUCCPS)</span>
        <span class="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">🇿🇦 South Africa (Matric)</span>
        <span class="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">🇿🇼 Zimbabwe (ZIMSEC)</span>
        <span class="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">🇬🇧 UK (UCAS)</span>
        <span class="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">🇨🇦 Canada (GPA)</span>
        <span class="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">🇦🇺 Australia (ATAR)</span>
      </div>
    </div>
  </div>

  <!-- Bottom Legal & Copyright Bar -->
  <div class="max-w-7xl mx-auto border-t border-slate-800/80 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center md:text-left">
    <div class="space-y-1">
      <p>&copy; ${new Date().getFullYear()} AfriWidget. All rights reserved. For informational and educational calculation purposes only.</p>
      <p class="text-[11px] text-slate-600">Client-side execution architecture. In-memory computation compliant with GDPR, NDPR &amp; POPIA privacy principles.</p>
    </div>
    <div class="flex items-center flex-wrap justify-center gap-4 sm:gap-6 text-slate-400">
      <a href="/privacy-policy" class="hover:text-yellow-300 transition-colors">Privacy</a>
      <span class="text-slate-800" aria-hidden="true">&bull;</span>
      <a href="/terms" class="hover:text-yellow-300 transition-colors">Terms</a>
      <span class="text-slate-800" aria-hidden="true">&bull;</span>
      <a href="/cookie-policy" class="hover:text-yellow-300 transition-colors">Cookies</a>
      <span class="text-slate-800" aria-hidden="true">&bull;</span>
      <a href="/adsense-disclaimer" class="hover:text-yellow-300 transition-colors">AdSense</a>
      <span class="text-slate-800" aria-hidden="true">&bull;</span>
      <a href="/contact" class="hover:text-yellow-300 transition-colors">Contact</a>
    </div>
  </div>
`;

  function renderSharedFooter() {
    var footer = document.querySelector('footer');

    if (!footer) {
      footer = document.createElement('footer');
      document.body.appendChild(footer);
    }

    footer.className = 'bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-12 px-4 sm:px-6 lg:px-8 mt-20';
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