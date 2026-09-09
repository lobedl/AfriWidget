import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

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
      html.push('<hr class="my-8 border-slate-200" />');
      paragraph = [];
      return;
    }
    if (/<[a-z1-6]+[\s>]/i.test(text) || /<\/[a-z1-6]+>/i.test(text)) {
      html.push(text);
    } else {
      text = formatInline(text);
      html.push('<p class="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">' + text + '</p>');
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
    var heading = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      var level = heading[1].length;
      var headingText = heading[2];
      if (level === 1) {
        closeFaq();
        html.push('<h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-8 mb-4">' + formatInline(headingText) + '</h2>');
      } else if (level === 2 && /frequently asked questions|faq/i.test(headingText)) {
        closeFaq();
        inFaq = true;
        html.push('<h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 mt-10 mb-6 flex items-center gap-2.5"><svg class="w-6 h-6 text-yellow-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span>' + formatInline(headingText) + '</span></h2>');
      } else if (inFaq && (level === 3 || level === 4)) {
        closeFaq();
        openFaq = true;
        html.push('<details class="group bg-white rounded-xl border border-slate-200/90 shadow-sm mb-3 overflow-hidden transition-all"><summary class="flex items-center justify-between font-bold text-slate-900 p-4 sm:p-5 cursor-pointer hover:bg-slate-50 transition-colors list-none"><span>' + formatInline(headingText) + '</span><svg class="w-5 h-5 text-slate-400 transition-transform duration-200 group-open:rotate-180 shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></summary><div class="px-4 pb-5 sm:px-5 sm:pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">');
      } else if (level === 2) {
        closeFaq();
        html.push('<h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-10 mb-4 pb-2 border-b border-slate-200/80">' + formatInline(headingText) + '</h2>');
      } else if (level === 3) {
        closeFaq();
        html.push('<h3 class="text-lg sm:text-xl font-bold text-slate-800 mt-6 mb-3">' + formatInline(headingText) + '</h3>');
      } else if (level === 4) {
        closeFaq();
        html.push('<h4 class="text-base sm:text-lg font-bold text-slate-800 mt-4 mb-2">' + formatInline(headingText) + '</h4>');
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
        if (listType === 'ol') {
          html.push('<ol class="space-y-2.5 my-4 text-sm sm:text-base text-slate-600 list-decimal list-inside pl-1">');
        } else {
          html.push('<ul class="space-y-2.5 my-4 text-sm sm:text-base text-slate-600 list-disc list-inside pl-1">');
        }
      }
      html.push('<li class="leading-relaxed">' + formatInline(list[2]) + '</li>');
      return;
    }
    if (/^>\s?/.test(trimmed)) {
      flushParagraph();
      closeList();
      html.push('<blockquote class="p-4 my-5 bg-slate-50 border-l-4 border-yellow-400 text-sm text-slate-700 rounded-r-xl italic leading-relaxed">' + formatInline(trimmed.replace(/^>\s?/, '')) + '</blockquote>');
      return;
    }
    paragraph.push(trimmed);
  });

  flushParagraph();
  closeList();
  closeFaq();
  return html.join('');
}

const sharedFooterMarkup = `<footer class="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-12 px-4 sm:px-6 lg:px-8 mt-20" aria-label="AfriWidget site footer">
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
</footer>`;

// Category Mapping for Breadcrumb Generation
const catUrlMap = {
  health: { name: "Health Tools", url: "/health" },
  education: { name: "Education Tools", url: "/education" },
  finance: { name: "Finance Tools", url: "/finance" },
  business: { name: "Business Tools", url: "/business" },
  productivity: { name: "Productivity Tools", url: "/productivity" },
  tech: { name: "Productivity Tools", url: "/productivity" },
  realestate: { name: "Finance Tools", url: "/finance" },
  "real-estate": { name: "Finance Tools", url: "/finance" }
};

// Build category map from tools-index.json
const categoryMap = {};

try {
  const toolsIndexRaw = fs.readFileSync(path.join(process.cwd(), 'tools-index.json'), 'utf8');
  const toolsIndex = JSON.parse(toolsIndexRaw);
  for (const item of toolsIndex) {
    if (item.slug && item.category) {
      const catKey = item.category.toLowerCase().replace(/\s+/g, '-');
      const info = catUrlMap[catKey] || catUrlMap[item.category.toLowerCase()] || { name: `${item.category} Tools`, url: `/${catKey}` };
      categoryMap[item.slug + ".html"] = { category: info.name, categoryUrl: info.url };
    }
  }
} catch (e) {
  console.warn("Could not read tools-index.json for categoryMap:", e.message);
}

// Special Hubs and Policy Pages
categoryMap["health.html"] = { isHub: true, title: "Health & Wellness Tools" };
categoryMap["education.html"] = { isHub: true, title: "Education & Academic Tools" };
categoryMap["finance.html"] = { isHub: true, title: "Finance & Wealth Tools" };
categoryMap["productivity.html"] = { isHub: true, title: "Productivity & Utility Tools" };
categoryMap["business.html"] = { isHub: true, title: "Business & Freelance Tools" };
categoryMap["admissions.html"] = { isHub: true, title: "African Admissions Calculators", category: "Education Tools", categoryUrl: "/education" };
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

  const guideRegex = /(<section\s+id=["']toolGuide["'][^>]*>)([\s\S]*?)(<\/section>)/i;
  const guideContentDivRegex = /(<div\s+id=["']guide-content["'][^>]*>)([\s\S]*?)(<\/div>)/i;
  const prerenderedDivRegex = /(<div\s+id=["']prerendered-guide["'][^>]*>)([\s\S]*?)(<\/div>)/i;
  const articleRegex = /(<article\s+class=["'][^"']*(?:max-w-3xl|bg-white|prose|space-y|text-slate)[^"']*["'][^>]*>)([\s\S]*?)(<\/article>)/i;

  let injected = false;
  if (guideContentDivRegex.test(htmlContent)) {
    htmlContent = htmlContent.replace(guideContentDivRegex, (match, p1, p2, p3) => `${p1}\n${renderedHtml}\n${p3}`);
    injected = true;
  } else if (guideRegex.test(htmlContent)) {
    htmlContent = htmlContent.replace(guideRegex, (match, p1, p2, p3) => `${p1}\n${renderedHtml}\n${p3}`);
    injected = true;
  } else if (prerenderedDivRegex.test(htmlContent)) {
    htmlContent = htmlContent.replace(prerenderedDivRegex, (match, p1, p2, p3) => `${p1}\n${renderedHtml}\n${p3}`);
    injected = true;
  } else if (articleRegex.test(htmlContent)) {
    htmlContent = htmlContent.replace(articleRegex, (match, p1, p2, p3) => `${p1}\n${renderedHtml}\n${p3}`);
    injected = true;
  }

  if (injected) {
    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    console.log(`Successfully updated prerendered guide in ${htmlFile}`);
  } else {
    console.warn(`No guide container found in ${htmlFile}`);
  }
});

// 2. Minify branding.css if source exists
if (fs.existsSync('branding.source.css')) {
  try {
    execSync('npx @tailwindcss/cli -i ./branding.source.css -o ./branding.css --minify', { stdio: 'ignore' });
    console.log('Successfully minified branding.css');
  } catch (err) {
    console.warn('Failed to minify branding.css:', err.message);
  }
}

// 3. Prerender complete shared footer, navigation, and breadcrumbs into ALL HTML files
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
  ['/success-stories', 'Success Stories']
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
    headInner = headInner.replace(/<!--\s*High-Performance Lazy-Loaded Google AdSense[\s\S]*?-->/gi, '');
    headInner = headInner.replace(/<!--\s*Resource Preconnects[\s\S]*?-->/gi, '');
    headInner = headInner.replace(/<link\s+rel=["']preconnect["'][^>]*\/?>\s*/gi, '');
    headInner = headInner.replace(/<link\s+rel=["']dns-prefetch["'][^>]*\/?>\s*/gi, '');
    headInner = headInner.replace(/<script[^>]*googletagmanager\.com[\s\S]*?<\/script>/gi, '');
    headInner = headInner.replace(/<script[^>]*pagead2\.googlesyndication\.com[\s\S]*?<\/script>/gi, '');
    headInner = headInner.replace(/<script[^>]*>[\s\S]*?loadAdSense[\s\S]*?<\/script>/gi, '');
    headInner = headInner.replace(/<script[^>]*>[\s\S]*?adSenseLoaded[\s\S]*?<\/script>/gi, '');
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
  <link rel="preconnect" href="https://www.googletagmanager.com" crossorigin />
  <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
  <!-- Google Analytics (GA4) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-6V491CW7H0"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag("js", new Date());
    gtag("config", "G-6V491CW7H0");
  </script>
  <!-- High-Performance Lazy-Loaded Google AdSense (Zero Blocking Time & Zero Layout Shift) -->
  <script>
    (function() {
      var adSenseLoaded = false;
      function loadAdSense() {
        if (adSenseLoaded) return;
        adSenseLoaded = true;
        ['scroll', 'mousemove', 'touchstart', 'click', 'keydown'].forEach(function(evt) {
          window.removeEventListener(evt, loadAdSense, { passive: true });
        });
        var s = document.createElement('script');
        s.async = true;
        s.crossOrigin = 'anonymous';
        s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2239061398283474';
        document.head.appendChild(s);
      }
      ['scroll', 'mousemove', 'touchstart', 'click', 'keydown'].forEach(function(evt) {
        window.addEventListener(evt, loadAdSense, { passive: true, once: true });
      });
      if ('requestIdleCallback' in window) {
        window.addEventListener('load', function() {
          requestIdleCallback(function() {
            setTimeout(loadAdSense, 3500);
          }, { timeout: 4000 });
        });
      } else {
        window.addEventListener('load', function() {
          setTimeout(loadAdSense, 3500);
        });
      }
    })();
  </script>
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
