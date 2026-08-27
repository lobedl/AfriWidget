function onReady(fn) { if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', fn); } else { fn(); } }
(function () {
  'use strict';

  function byId(id) {
    return document.getElementById(id);
  }

  function number(id) {
    var el = byId(id);
    if (!el) return 0;
    var value = parseFloat(el.value);
    return Number.isFinite(value) ? value : 0;
  }

  function money(value, currency) {
    var symbols = { USD: '$', GHS: 'GH₵', NGN: '₦', KES: 'KSh', ZAR: 'R', EUR: '€', GBP: '£' };
    return (symbols[currency] || currency + ' ') + Number(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function show(id) {
    var element = byId(id);
    if (element) element.classList.remove('hidden');
  }

  function setText(id, text) {
    var element = byId(id);
    if (element) element.textContent = text;
  }

  function setupFreelance() {
    var form = byId('freelanceForm');
    if (!form) return;
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var currency = byId('freelanceCurrency').value;
      var annual = number('annualIncome');
      var hours = number('billableHours');
      var weeksOff = number('weeksOff');
      var overhead = number('overheadRate');
      var tax = number('taxRate');
      var buffer = number('profitBuffer');
      var projectHours = number('projectHours');
      var projectCosts = number('projectCosts');
      if (annual <= 0 || hours <= 0 || weeksOff < 0 || weeksOff >= 52) {
        setText('freelanceMessage', 'Enter an annual income, billable hours, and between 0 and 51 weeks off.');
        show('freelanceMessage');
        return;
      }
      var workingWeeks = 52 - weeksOff;
      var billableHoursYear = hours * workingWeeks;
      var operatingMultiplier = 1 + Math.max(0, overhead) / 100;
      var taxMultiplier = 1 - Math.min(95, Math.max(0, tax)) / 100;
      var bufferMultiplier = 1 + Math.max(0, buffer) / 100;
      var baseRate = annual * operatingMultiplier * bufferMultiplier / (billableHoursYear * taxMultiplier);
      var projectQuote = baseRate * Math.max(0, projectHours) + Math.max(0, projectCosts);
      setText('freelanceHourly', money(baseRate, currency));
      setText('freelanceWeekly', money(baseRate * hours, currency));
      setText('freelanceProject', money(projectQuote, currency));
      setText('freelanceBillable', billableHoursYear.toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' hours/year');
      setText('freelanceMessage', 'This target rate includes your selected overhead, tax allowance, profit buffer, and non-billable weeks.');
      show('freelanceResult');
    });
  }

  function setupData() {
    var form = byId('dataForm');
    if (!form) return;
    var units = {
      bit: ['bits', 1 / 8],
      byte: ['bytes', 1],
      kilobit: ['kilobits', 1000 / 8],
      kilobyte: ['kilobytes', 1000],
      megabit: ['megabits', 1000000 / 8],
      megabyte: ['megabytes', 1000000],
      gigabit: ['gigabits', 1000000000 / 8],
      gigabyte: ['gigabytes', 1000000000],
      terabit: ['terabits', 1000000000000 / 8],
      terabyte: ['terabytes', 1000000000000],
      kibibyte: ['KiB', 1024],
      mebibyte: ['MiB', 1048576],
      gibibyte: ['GiB', 1073741824],
      tebibyte: ['TiB', 1099511627776]
    };
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var amount = number('dataAmount');
      var from = units[byId('dataFrom').value];
      var to = units[byId('dataTo').value];
      if (!Number.isFinite(amount) || amount < 0 || !from || !to) {
        setText('dataMessage', 'Enter a zero or positive data amount and choose both units.');
        show('dataMessage');
        return;
      }
      var output = amount * from[1] / to[1];
      setText('dataValue', output.toLocaleString(undefined, { maximumFractionDigits: 10 }) + ' ' + to[0]);
      setText('dataMessage', amount.toLocaleString() + ' ' + from[0] + ' equals ' + output.toLocaleString(undefined, { maximumFractionDigits: 10 }) + ' ' + to[0] + '.');
      show('dataResult');
    });
  }

  function dateDifference(start, end) {
    var years = end.getFullYear() - start.getFullYear();
    var months = end.getMonth() - start.getMonth();
    var days = end.getDate() - start.getDate();
    if (days < 0) {
      months -= 1;
      days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    return { years: years, months: months, days: days };
  }

  function addDuration(total, duration) {
    total.days += duration.days;
    total.months += duration.months;
    total.years += duration.years;
    total.months += Math.floor(total.days / 30);
    total.days = total.days % 30;
    total.years += Math.floor(total.months / 12);
    total.months = total.months % 12;
  }

  function setupExperience() {
    var form = byId('experienceForm');
    if (!form) return;
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var total = { years: 0, months: 0, days: 0 };
      var valid = 0;
      [1, 2, 3].forEach(function (index) {
        var startEl = byId('jobStart' + index);
        var endEl = byId('jobEnd' + index);
        var curEl = byId('jobCurrent' + index);
        if (!startEl) return;
        var startValue = startEl.value;
        var endValue = endEl ? endEl.value : '';
        if (!startValue) return;
        var start = new Date(startValue + 'T00:00:00');
        var end = (curEl && curEl.checked) ? new Date() : new Date((endValue || startValue) + 'T00:00:00');
        if (end <= start) return;
        addDuration(total, dateDifference(start, end));
        valid += 1;
      });
      if (!valid) {
        setText('experienceMessage', 'Add at least one role with a start date and a later end date.');
        show('experienceMessage');
        return;
      }
      setText('experienceYears', total.years + ' years');
      setText('experienceMonths', total.months + ' months');
      setText('experienceDays', total.days + ' days');
      setText('experienceSummary', 'Across ' + valid + ' role' + (valid === 1 ? '' : 's') + ', your entered experience totals approximately ' + total.years + ' years, ' + total.months + ' months, and ' + total.days + ' days. Overlapping roles are added separately, so review concurrent work before using this for an official application.');
      show('experienceResult');
    });
    [1, 2, 3].forEach(function (index) {
      var curEl = byId('jobCurrent' + index);
      var endEl = byId('jobEnd' + index);
      if (curEl && endEl) {
        curEl.addEventListener('change', function () {
          endEl.disabled = this.checked;
          if (this.checked) endEl.value = '';
        });
      }
    });
  }

  function setupSavings() {
    var form = byId('savingsForm');
    if (!form) return;
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var currency = byId('savingsCurrency').value;
      var target = number('savingsTarget');
      var current = number('savingsCurrent');
      var monthly = number('savingsMonthly');
      var annualRate = Math.max(0, number('savingsRate'));
      if (target <= 0 || current < 0 || monthly <= 0 || current >= target) {
        setText('savingsMessage', 'Enter a target above current savings and a positive monthly contribution.');
        show('savingsMessage');
        return;
      }
      var monthlyRate = annualRate / 100 / 12;
      var balance = current;
      var months = 0;
      while (balance < target && months < 1200) {
        balance = balance * (1 + monthlyRate) + monthly;
        months += 1;
      }
      if (months >= 1200) {
        setText('savingsMessage', 'This target needs more than 100 years at the entered contribution. Increase the monthly amount or review the goal.');
        show('savingsMessage');
        return;
      }
      var years = Math.floor(months / 12);
      var remainingMonths = months % 12;
      var contributions = monthly * months;
      var growth = balance - current - contributions;
      var targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() + months);
      setText('savingsTime', years + ' years, ' + remainingMonths + ' months');
      setText('savingsDate', targetDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long' }));
      setText('savingsContributions', money(contributions, currency));
      setText('savingsGrowth', money(Math.max(0, growth), currency));
      setText('savingsMessage', 'At the entered contribution and estimated rate, you reach the target in ' + months + ' months. Interest is an estimate, not a guaranteed return.');
      show('savingsResult');
    });
  }

  function pageKey() {
    var guide = byId('toolGuide');
    if (guide && guide.dataset && guide.dataset.contentKey) {
      return guide.dataset.contentKey;
    }
    var parts = window.location.pathname.split('/').filter(Boolean);
    var last = parts.pop() || '';
    return last.replace(/\.html$/i, '');
  }

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

  function setupGuide() {
    var guide = byId('toolGuide');
    if (!guide) return;
    var hasPrerendered = guide.querySelector('h2') || guide.children.length > 1;
    if (hasPrerendered) {
      return;
    }
    var key = pageKey();
    if (!key) return;
    fetch('/content/' + key + '.md', { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) throw new Error('Guide unavailable');
        return response.text();
      })
      .then(function (markdown) {
        if (markdown) {
          guide.innerHTML = renderMarkdown(markdown);
        }
      })
      .catch(function () {
        if (!guide.querySelector('h2')) {
          guide.innerHTML = '<p>Guide content is temporarily unavailable. The calculator remains available for private in-browser use.</p>';
        }
      });
  }

  function setupQrGenerator() {
    var form = byId('qrForm');
    if (!form) return;
    var canvas = byId('qrCanvas');
    var type = byId('qrType');
    var output = byId('qrStatus');
    var generateBtn = byId('qrGenerateBtn');
    var downloadBtn = byId('qrDownload');
    var urlInput = byId('qrUrl');
    var textInput = byId('qrPlainText');
    var ssidInput = byId('wifiSsid');
    var passwordInput = byId('wifiPassword');
    var securityInput = byId('wifiSecurity');

    if (urlInput && !urlInput.value) {
      urlInput.value = 'https://afriwidget.com/';
    }

    function fields() {
      var mode = type ? type.value : 'url';
      document.querySelectorAll('[data-qr-mode]').forEach(function (element) {
        element.classList.toggle('hidden', element.dataset.qrMode !== mode);
      });
    }

    function value() {
      var mode = type ? type.value : 'url';
      if (mode === 'wifi') {
        var ssid = ssidInput ? ssidInput.value.trim() : '';
        var password = passwordInput ? passwordInput.value : '';
        var security = securityInput ? securityInput.value : 'WPA';
        if (!ssid) return '';
        return 'WIFI:T:' + security + ';S:' + ssid.replace(/[\\;,"]/g, '\\$&') + ';P:' + password.replace(/[\\;,"]/g, '\\$&') + ';;';
      }
      if (mode === 'text') {
        return textInput ? textInput.value.trim() : '';
      }
      var url = urlInput ? urlInput.value.trim() : '';
      if (url && !/^https?:\/\//i.test(url) && !/^mailto:/i.test(url) && !/^tel:/i.test(url)) {
        url = 'https://' + url;
      }
      return url;
    }

    var drawTimer = null;
    function draw() {
      var text = value();
      if (!text) {
        if (output) output.textContent = 'Enter content to preview your QR code.';
        if (canvas) {
          var ctx = canvas.getContext('2d');
          if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        return;
      }
      var qrLib = window.QRCode || window.qrcode;
      if (!qrLib || typeof qrLib.toCanvas !== 'function') {
        if (output) output.textContent = 'Preparing QR renderer...';
        clearTimeout(drawTimer);
        drawTimer = setTimeout(draw, 100);
        return;
      }
      if (!canvas) return;
      qrLib.toCanvas(canvas, text, {
        width: 280,
        margin: 2,
        color: { dark: '#0f172a', light: '#ffffff' }
      }, function (error) {
        if (output) {
          output.textContent = error ? 'This content is too long for a standard QR code.' : 'Live preview ready. 100% private in-browser generation.';
        }
      });
    }

    function debouncedDraw() {
      clearTimeout(drawTimer);
      drawTimer = setTimeout(draw, 80);
    }

    if (type) {
      type.addEventListener('change', function () {
        fields();
        draw();
      });
    }

    [urlInput, textInput, ssidInput, passwordInput].forEach(function (inp) {
      if (inp) {
        inp.addEventListener('input', debouncedDraw);
        inp.addEventListener('change', draw);
      }
    });

    if (securityInput) {
      securityInput.addEventListener('change', draw);
    }

    if (generateBtn) {
      generateBtn.addEventListener('click', function (e) {
        e.preventDefault();
        draw();
      });
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      draw();
    });

    if (downloadBtn) {
      downloadBtn.addEventListener('click', function () {
        if (!canvas || !canvas.width) return;
        draw();
        setTimeout(function() {
          var link = document.createElement('a');
          link.download = 'afriwidget-qr-code.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
        }, 50);
      });
    }

    fields();
    draw();
  }

  function setupLoanCalculator() {
    var form = byId('loanForm');
    if (!form) return;
    function calculate() {
      var amountInput = byId('loanAmount');
      var rateInput = byId('loanRate');
      var termInput = byId('loanTerm');
      var rawAmount = amountInput ? amountInput.value.trim() : '';
      var rawRate = rateInput ? rateInput.value.trim() : '';
      var rawTerm = termInput ? termInput.value.trim() : '';
      var principal = number('loanAmount');
      var annual = number('loanRate');
      var years = number('loanTerm');
      var currency = byId('loanCurrency').value;
      if (!rawAmount || !rawRate || !rawTerm || principal <= 0 || annual < 0 || years <= 0 || years > 100) {
        setText('loanMessage', 'Enter your loan amount, interest rate, and repayment term to calculate your monthly schedule.');
        show('loanMessage');
        byId('loanResult').classList.add('hidden');
        return;
      }
      byId('loanMessage').classList.add('hidden');
      var months = Math.round(years * 12);
      var monthlyRate = annual / 100 / 12;
      var payment = monthlyRate ? principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1) : principal / months;
      var balance = principal;
      var totalInterest = 0;
      var rows = [];
      for (var month = 1; month <= months; month += 1) {
        var interest = balance * monthlyRate;
        var principalPaid = Math.min(balance, payment - interest);
        balance = Math.max(0, balance - principalPaid);
        totalInterest += interest;
        if (month <= 12 || month === months) {
          rows.push('<tr><td>' + month + '</td><td>' + money(principalPaid, currency) + '</td><td>' + money(interest, currency) + '</td><td>' + money(balance, currency) + '</td></tr>');
        }
      }
      setText('loanPayment', money(payment, currency));
      setText('loanTotal', money(payment * months, currency));
      setText('loanInterest', money(totalInterest, currency));
      byId('loanSchedule').innerHTML = '<tr><th>Month</th><th>Principal</th><th>Interest</th><th>Balance</th></tr>' + rows.join('');
      setText('loanMessage', 'This estimate assumes a fixed rate and equal monthly payments. Fees, insurance, taxes, and lender rules are not included.');
      show('loanResult');
    }
    var loanBtn = byId('loanCalculateBtn');
    if (loanBtn) {
      loanBtn.addEventListener('click', function (e) {
        if (e) e.preventDefault();
        calculate();
      });
    }
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      calculate();
    });
  }

  function setupSavingsCalculator() {
    var form = byId('savingsCalcForm');
    if (!form) return;
    function calculate() {
      var startInput = byId('savingsStart');
      var depositInput = byId('savingsDeposit');
      var yearsInput = byId('savingsYears');
      var rawStart = startInput ? startInput.value.trim() : '';
      var rawDeposit = depositInput ? depositInput.value.trim() : '';
      var rawYears = yearsInput ? yearsInput.value.trim() : '';
      var start = number('savingsStart');
      var monthly = number('savingsDeposit');
      var annual = number('savingsAnnualRate');
      var years = number('savingsYears');
      var currency = byId('savingsCalcCurrency').value;
      if (!rawYears || years <= 0 || years > 100 || (!rawStart && !rawDeposit)) {
        setText('savingsCalcMessage', 'Enter a time horizon (years) and a starting balance or monthly deposit amount.');
        show('savingsCalcMessage');
        byId('savingsCalcResult').classList.add('hidden');
        return;
      }
      byId('savingsCalcMessage').classList.add('hidden');
      var rate = annual / 100 / 12;
      var balance = start;
      var deposits = start;
      var rows = [];
      for (var month = 1; month <= Math.round(years * 12); month += 1) {
        balance = balance * (1 + rate) + monthly;
        deposits += monthly;
        if (month % 12 === 0 || month === Math.round(years * 12)) rows.push('<tr><td>' + Math.ceil(month / 12) + '</td><td>' + money(deposits, currency) + '</td><td>' + money(balance, currency) + '</td><td>' + money(Math.max(0, balance - deposits), currency) + '</td></tr>');
      }
      setText('savingsCalcTotal', money(balance, currency));
      setText('savingsCalcDeposits', money(deposits, currency));
      setText('savingsCalcGrowth', money(Math.max(0, balance - deposits), currency));
      byId('savingsTable').innerHTML = '<tr><th>Year</th><th>Your deposits</th><th>Projected value</th><th>Growth</th></tr>' + rows.join('');
      setText('savingsCalcMessage', 'The projection compounds monthly and assumes the deposit is made at the end of each month. Actual returns vary.');
      show('savingsCalcResult');
    }
    var savingsBtn = byId('savingsCalcBtn');
    if (savingsBtn) {
      savingsBtn.addEventListener('click', function (e) {
        if (e) e.preventDefault();
        calculate();
      });
    }
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      calculate();
    });
  }

  function setupCurrencyConverter() {
    var form = byId('currencyForm');
    if (!form) return;
    var fallback = { USD: 1, EUR: 0.92, GBP: 0.78, GHS: 15.2, NGN: 1550, KES: 129, ZAR: 18.2, CAD: 1.36, AUD: 1.52, INR: 83.5, JPY: 156, AED: 3.67 };
    var rates = Object.assign({}, fallback);
    var source = 'Fallback reference rates';
    function convert() {
      var amountInput = byId('currencyAmount');
      var rawAmount = amountInput ? amountInput.value.trim() : '';
      var amount = number('currencyAmount');
      var from = byId('currencyFrom').value;
      var to = byId('currencyTo').value;
      if (!rawAmount || amount <= 0 || !rates[from] || !rates[to]) {
        setText('currencyMessage', 'Enter an amount above 0 to see the converted estimate.');
        show('currencyMessage');
        byId('currencyResult').classList.add('hidden');
        return;
      }
      byId('currencyMessage').classList.add('hidden');
      var value = amount / rates[from] * rates[to];
      setText('currencyValue', value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) + ' ' + to);
      setText('currencyMessage', amount.toLocaleString() + ' ' + from + ' ≈ ' + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) + ' ' + to + '. ' + source + '.');
      show('currencyResult');
    }
    var convertBtn = byId('currencyConvertBtn');
    if (convertBtn) {
      convertBtn.addEventListener('click', function (e) {
        if (e) e.preventDefault();
        convert();
      });
    }
    form.addEventListener('submit', function (event) { event.preventDefault(); convert(); });
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(function (response) { return response.json(); })
      .then(function (data) {
        if (data && data.rates) {
          rates = Object.assign(rates, data.rates);
          source = 'Live rates refreshed from a public exchange-rate feed';
          setText('currencyRateStatus', '⚡ Live reference rates loaded');
        }
      })
      .catch(function () { setText('currencyRateStatus', 'Live feed unavailable — using fallback rates'); });
  }

  function setupIcassCalculator() {
    var form = byId('icassForm');
    if (!form) return;

    var currentMode = 'standard'; // 'standard', 'trimester', 'custom'

    // Tab buttons
    var tabStandard = byId('tabStandard');
    var tabTrimester = byId('tabTrimester');
    var tabCustom = byId('tabCustom');

    var modeStandard = byId('icassStandardMode');
    var modeTrimester = byId('icassTrimesterMode');
    var modeCustom = byId('icassCustomMode');

    function setTab(mode) {
      currentMode = mode;
      var tabs = [
        { btn: tabStandard, panel: modeStandard, key: 'standard' },
        { btn: tabTrimester, panel: modeTrimester, key: 'trimester' },
        { btn: tabCustom, panel: modeCustom, key: 'custom' }
      ];

      tabs.forEach(function (t) {
        if (!t.btn || !t.panel) return;
        var isActive = t.key === mode;
        if (isActive) {
          t.btn.classList.remove('bg-slate-100', 'text-slate-700');
          t.btn.classList.add('bg-slate-900', 'text-yellow-300', 'shadow-sm');
          t.btn.setAttribute('aria-selected', 'true');
          t.panel.classList.remove('hidden');
        } else {
          t.btn.classList.remove('bg-slate-900', 'text-yellow-300', 'shadow-sm');
          t.btn.classList.add('bg-slate-100', 'text-slate-700');
          t.btn.setAttribute('aria-selected', 'false');
          t.panel.classList.add('hidden');
        }
      });

      var msgEl = byId('icassMessage');
      if (msgEl) msgEl.classList.add('hidden');
    }

    if (tabStandard) tabStandard.addEventListener('click', function () { setTab('standard'); calculate(false); });
    if (tabTrimester) tabTrimester.addEventListener('click', function () { setTab('trimester'); calculate(false); });
    if (tabCustom) tabCustom.addEventListener('click', function () { setTab('custom'); calculate(false); });

    function clearInputErrors() {
      var allInputs = form.querySelectorAll('input');
      allInputs.forEach(function (inp) {
        inp.classList.remove('border-red-500', 'bg-red-50', 'ring-2', 'ring-red-400');
      });
    }

    function markInputError(inputId) {
      var el = byId(inputId);
      if (el) {
        el.classList.add('border-red-500', 'bg-red-50', 'ring-2', 'ring-red-400');
      }
    }

    function showError(htmlMessage, isAmber) {
      var msgEl = byId('icassMessage');
      if (!msgEl) return;
      msgEl.innerHTML = htmlMessage;
      msgEl.className = isAmber
        ? 'mt-6 block rounded-xl border-2 border-amber-500 bg-amber-50 p-4 text-base font-semibold text-amber-950 shadow-lg'
        : 'mt-6 block rounded-xl border-2 border-red-500 bg-red-50 p-4 text-base font-semibold text-red-950 shadow-lg';
      msgEl.classList.remove('hidden');
      var resEl = byId('icassResult');
      if (resEl) resEl.classList.add('hidden');
    }

    function calculate(userTriggered) {
      clearInputErrors();

      var items = [];
      var missing = [];
      var invalid = [];

      if (currentMode === 'standard') {
        // Standard TVET Model: Test 1 (10%), Assign 1 (25%), Test 2 (10%), Assign 2 (25%), Trial Exam (30%)
        var stdConfigs = [
          { id: 'icassTest1Score', name: 'Test 1', weight: 10 },
          { id: 'icassAssign1Score', name: 'Assignment 1', weight: 25 },
          { id: 'icassTest2Score', name: 'Test 2', weight: 10 },
          { id: 'icassAssign2Score', name: 'Assignment 2', weight: 25 },
          { id: 'icassTrialScore', name: 'Trial Exam', weight: 30 }
        ];

        var anyProvided = false;
        stdConfigs.forEach(function (cfg) {
          var inp = byId(cfg.id);
          var val = inp ? inp.value.trim() : '';
          if (val !== '') anyProvided = true;
          if (val === '') {
            missing.push({ id: cfg.id, label: cfg.name });
          } else {
            var num = parseFloat(val);
            if (isNaN(num) || num < 0 || num > 100) {
              invalid.push({ id: cfg.id, label: cfg.name + ' (' + val + '%)' });
            } else {
              items.push({ name: cfg.name, weight: cfg.weight, score: num });
            }
          }
        });

        if (!anyProvided) {
          if (userTriggered) {
            stdConfigs.forEach(function (cfg) { markInputError(cfg.id); });
            showError('<div class="flex items-start gap-3"><span class="text-2xl">⚠️</span><div><p class="text-lg font-black text-red-950">Enter Your Assessment Marks</p><p class="mt-1 text-sm font-bold text-red-900">Please enter your marks (0–100) for Test 1, Assignment 1, Test 2, Assignment 2, and Trial Exam above.</p></div></div>');
          } else {
            var msgEl = byId('icassMessage');
            if (msgEl) msgEl.classList.add('hidden');
            var resEl = byId('icassResult');
            if (resEl) resEl.classList.add('hidden');
          }
          return;
        }

        if (missing.length > 0) {
          if (userTriggered) {
            missing.forEach(function (m) { markInputError(m.id); });
            var missingLabels = missing.map(function (m) { return m.label; }).join(', ');
            showError('<div class="flex items-start gap-3"><span class="text-2xl">⚠️</span><div><p class="text-lg font-black text-red-950">Incomplete Assessment Marks</p><p class="mt-1 text-sm font-bold text-red-900">Please provide marks for: <strong class="underline font-black">' + missingLabels + '</strong>.</p></div></div>');
          }
          return;
        }

        if (invalid.length > 0) {
          invalid.forEach(function (inv) { markInputError(inv.id); });
          var invalidLabels = invalid.map(function (i) { return i.label; }).join(', ');
          showError('<div class="flex items-start gap-3"><span class="text-2xl">⚠️</span><div><p class="text-lg font-black text-red-950">Invalid Score Values</p><p class="mt-1 text-sm font-bold text-red-900">Assessment marks must be between 0% and 100%. Check: <strong class="underline font-black">' + invalidLabels + '</strong>.</p></div></div>');
          return;
        }

      } else if (currentMode === 'trimester') {
        // Trimester 3-task model: Test (30%), Assignment (20%), Trial Exam (50%)
        var triConfigs = [
          { id: 'icassTrimTest', name: 'Class Test', weight: 30 },
          { id: 'icassTrimAssign', name: 'Assignment', weight: 20 },
          { id: 'icassTrimTrial', name: 'Internal Exam', weight: 50 }
        ];

        var anyTriProvided = false;
        triConfigs.forEach(function (cfg) {
          var inp = byId(cfg.id);
          var val = inp ? inp.value.trim() : '';
          if (val !== '') anyTriProvided = true;
          if (val === '') {
            missing.push({ id: cfg.id, label: cfg.name });
          } else {
            var num = parseFloat(val);
            if (isNaN(num) || num < 0 || num > 100) {
              invalid.push({ id: cfg.id, label: cfg.name + ' (' + val + '%)' });
            } else {
              items.push({ name: cfg.name, weight: cfg.weight, score: num });
            }
          }
        });

        if (!anyTriProvided) {
          if (userTriggered) {
            triConfigs.forEach(function (cfg) { markInputError(cfg.id); });
            showError('<div class="flex items-start gap-3"><span class="text-2xl">⚠️</span><div><p class="text-lg font-black text-red-950">Enter Your Assessment Marks</p><p class="mt-1 text-sm font-bold text-red-900">Please enter marks for Test (30%), Assignment (20%), and Internal Exam (50%).</p></div></div>');
          }
          return;
        }

        if (missing.length > 0) {
          if (userTriggered) {
            missing.forEach(function (m) { markInputError(m.id); });
            showError('<div class="flex items-start gap-3"><span class="text-2xl">⚠️</span><div><p class="text-lg font-black text-red-950">Incomplete Marks</p><p class="mt-1 text-sm font-bold text-red-900">Please enter marks for: <strong class="underline font-black">' + missing.map(function(m){return m.label;}).join(', ') + '</strong>.</p></div></div>');
          }
          return;
        }

        if (invalid.length > 0) {
          invalid.forEach(function (inv) { markInputError(inv.id); });
          showError('<div class="flex items-start gap-3"><span class="text-2xl">⚠️</span><div><p class="text-lg font-black text-red-950">Invalid Score Values</p><p class="mt-1 text-sm font-bold text-red-900">Marks must be between 0% and 100%. Check: <strong class="underline font-black">' + invalid.map(function(i){return i.label;}).join(', ') + '</strong>.</p></div></div>');
          return;
        }

      } else {
        // Custom Mode
        var customConfigs = [
          { scoreId: 'icassAssignmentScore', weightId: 'icassAssignmentWeight', name: 'Assignment' },
          { scoreId: 'icassPracticalScore', weightId: 'icassPracticalWeight', name: 'Practical' },
          { scoreId: 'icassTestScore', weightId: 'icassTestWeight', name: 'Test' },
          { scoreId: 'icassAttendanceScore', weightId: 'icassAttendanceWeight', name: 'Attendance' }
        ];

        var anyCustProvided = false;
        var custWeightSum = 0;
        var custMissing = [];
        var custInvalid = [];

        customConfigs.forEach(function (cfg) {
          var sInp = byId(cfg.scoreId);
          var wInp = byId(cfg.weightId);
          var sVal = sInp ? sInp.value.trim() : '';
          var wVal = wInp ? wInp.value.trim() : '';

          if (sVal !== '' || wVal !== '') anyCustProvided = true;

          if (sVal === '') custMissing.push({ id: cfg.scoreId, label: cfg.name + ' score' });
          if (wVal === '') custMissing.push({ id: cfg.weightId, label: cfg.name + ' weight' });

          var sNum = parseFloat(sVal);
          var wNum = parseFloat(wVal);

          if (sVal !== '' && (isNaN(sNum) || sNum < 0 || sNum > 100)) {
            custInvalid.push({ id: cfg.scoreId, label: cfg.name + ' score (' + sVal + '%)' });
          }
          if (wVal !== '' && (isNaN(wNum) || wNum < 0)) {
            custInvalid.push({ id: cfg.weightId, label: cfg.name + ' weight' });
          }

          if (!isNaN(sNum) && !isNaN(wNum) && sNum >= 0 && sNum <= 100 && wNum >= 0) {
            items.push({ name: cfg.name, weight: wNum, score: sNum });
            custWeightSum += wNum;
          }
        });

        if (!anyCustProvided) {
          if (userTriggered) {
            showError('<div class="flex items-start gap-3"><span class="text-2xl">⚠️</span><div><p class="text-lg font-black text-red-950">Enter Custom Assessment Figures</p><p class="mt-1 text-sm font-bold text-red-900">Please enter your scores and percentage weights (totaling 100%).</p></div></div>');
          }
          return;
        }

        if (custMissing.length > 0) {
          if (userTriggered) {
            custMissing.forEach(function (m) { markInputError(m.id); });
            showError('<div class="flex items-start gap-3"><span class="text-2xl">⚠️</span><div><p class="text-lg font-black text-red-950">Incomplete Custom Fields</p><p class="mt-1 text-sm font-bold text-red-900">Please complete: <strong class="underline font-black">' + custMissing.map(function(m){return m.label;}).join(', ') + '</strong>.</p></div></div>');
          }
          return;
        }

        if (custInvalid.length > 0) {
          custInvalid.forEach(function (inv) { markInputError(inv.id); });
          showError('<div class="flex items-start gap-3"><span class="text-2xl">⚠️</span><div><p class="text-lg font-black text-red-950">Invalid Values</p><p class="mt-1 text-sm font-bold text-red-900">Check: <strong class="underline font-black">' + custInvalid.map(function(i){return i.label;}).join(', ') + '</strong>.</p></div></div>');
          return;
        }

        if (Math.abs(custWeightSum - 100) > 0.01) {
          customConfigs.forEach(function (cfg) { markInputError(cfg.weightId); });
          var diff = custWeightSum - 100;
          var diffTxt = diff > 0 ? 'exceeds 100% by ' + diff.toFixed(1) + '%' : 'is short by ' + Math.abs(diff).toFixed(1) + '%';
          showError('<div class="flex items-start gap-3"><span class="text-2xl">⚠️</span><div><p class="text-lg font-black text-amber-950">Weight Total Error (' + custWeightSum.toFixed(1) + '%)</p><p class="mt-1 text-sm font-bold text-amber-900">Component weights must total 100% (currently ' + diffTxt + ').</p></div></div>', true);
          return;
        }
      }

      // Calculate Total Weighted ICASS
      var totalContribution = 0;
      var totalWeight = 0;
      items.forEach(function (it) {
        var contrib = (it.score * it.weight) / 100;
        it.contrib = contrib;
        totalContribution += contrib;
        totalWeight += it.weight;
      });

      var icassResultScore = totalContribution;
      if (totalWeight > 0 && Math.abs(totalWeight - 100) > 0.01) {
        icassResultScore = (totalContribution / totalWeight) * 100;
      }

      var msgEl = byId('icassMessage');
      if (msgEl) msgEl.classList.add('hidden');

      // Update UI Result
      setText('icassScore', icassResultScore.toFixed(2) + '%');

      var bandText = '';
      var bandClass = '';
      var progressColor = 'bg-yellow-500';

      if (icassResultScore >= 75) {
        bandText = '🌟 Outstanding Continuous Assessment (Distinction Level — ' + icassResultScore.toFixed(2) + '%)';
        bandClass = 'text-emerald-700 bg-emerald-50 border-emerald-300';
        progressColor = 'bg-emerald-500';
      } else if (icassResultScore >= 50) {
        bandText = '✅ Good Academic Standing (Passing Range — ' + icassResultScore.toFixed(2) + '%)';
        bandClass = 'text-blue-700 bg-blue-50 border-blue-300';
        progressColor = 'bg-blue-500';
      } else if (icassResultScore >= 40) {
        bandText = '⚠️ Eligible for Final Exam Entry (Sub-minimum 40% met — ' + icassResultScore.toFixed(2) + '%)';
        bandClass = 'text-amber-800 bg-amber-50 border-amber-300';
        progressColor = 'bg-amber-500';
      } else {
        bandText = '🚨 Below Sub-Minimum (< 40%) — Urgent Mark Recovery Recommended Before Exam Admission';
        bandClass = 'text-red-700 bg-red-50 border-red-300';
        progressColor = 'bg-red-500';
      }

      var bandEl = byId('icassBand');
      if (bandEl) {
        bandEl.textContent = bandText;
        bandEl.className = 'mt-2 px-3 py-1.5 rounded-lg border font-bold text-sm inline-block ' + bandClass;
      }

      var progressEl = byId('icassProgressBar');
      if (progressEl) {
        progressEl.style.width = Math.min(100, Math.max(0, icassResultScore)) + '%';
        progressEl.className = 'h-3 rounded-full transition-all duration-500 ' + progressColor;
      }

      // Exam Eligibility Status
      var eligEl = byId('icassEligibility');
      if (eligEl) {
        if (icassResultScore >= 40) {
          eligEl.innerHTML = '<div class="flex items-center gap-2 text-emerald-800 font-extrabold text-sm sm:text-base"><span class="text-xl">✅</span><span><strong>Exam Admission Status: QUALIFIED</strong> (Meets DHET 40% sub-minimum requirement for national exam entry)</span></div>';
        } else {
          var neededPoints = (40 - icassResultScore).toFixed(2);
          eligEl.innerHTML = '<div class="flex items-center gap-2 text-red-800 font-extrabold text-sm sm:text-base"><span class="text-xl">⚠️</span><span><strong>Exam Admission Status: AT RISK</strong> (Short by ' + neededPoints + '% to reach the 40% exam sub-minimum)</span></div>';
        }
      }

      // Populate Contribution Breakdown Table
      var breakdownEl = byId('icassBreakdownTable');
      if (breakdownEl) {
        var rowsHtml = items.map(function (it) {
          return '<tr class="border-b border-slate-100 hover:bg-slate-50">' +
            '<td class="py-2.5 px-3 text-left font-bold text-slate-800">' + it.name + '</td>' +
            '<td class="py-2.5 px-3 text-center font-bold text-slate-600">' + it.weight + '%</td>' +
            '<td class="py-2.5 px-3 text-center font-extrabold text-slate-900">' + it.score.toFixed(1) + '%</td>' +
            '<td class="py-2.5 px-3 text-right font-black text-emerald-700">+' + it.contrib.toFixed(2) + '%</td>' +
          '</tr>';
        }).join('');
        breakdownEl.innerHTML = rowsHtml;
      }

      // Calculate Target Exam Marks (Standard NATED: 40% ICASS + 60% Exam)
      var target50El = byId('icassTarget50');
      var target65El = byId('icassTarget65');
      var target75El = byId('icassTarget75');

      var icassWeightNated = 0.40;
      var examWeightNated = 0.60;
      var currentIcassPoints = icassResultScore * icassWeightNated;

      function calcExamNeeded(targetOverall) {
        var needed = (targetOverall - currentIcassPoints) / examWeightNated;
        if (needed <= 40) return '40.0% (Sub-minimum)';
        if (needed > 100) return 'Impossible (>100%)';
        return needed.toFixed(1) + '%';
      }

      if (target50El) target50El.textContent = calcExamNeeded(50);
      if (target65El) target65El.textContent = calcExamNeeded(65);
      if (target75El) target75El.textContent = calcExamNeeded(75);

      show('icassResult');

      if (userTriggered && byId('icassResult')) {
        byId('icassResult').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // Load sample marks
    var sampleBtn = byId('icassSampleBtn');
    if (sampleBtn) {
      sampleBtn.addEventListener('click', function () {
        if (currentMode === 'standard') {
          if (byId('icassTest1Score')) byId('icassTest1Score').value = 68;
          if (byId('icassAssign1Score')) byId('icassAssign1Score').value = 80;
          if (byId('icassTest2Score')) byId('icassTest2Score').value = 72;
          if (byId('icassAssign2Score')) byId('icassAssign2Score').value = 78;
          if (byId('icassTrialScore')) byId('icassTrialScore').value = 65;
        } else if (currentMode === 'trimester') {
          if (byId('icassTrimTest')) byId('icassTrimTest').value = 65;
          if (byId('icassTrimAssign')) byId('icassTrimAssign').value = 80;
          if (byId('icassTrimTrial')) byId('icassTrimTrial').value = 68;
        } else {
          if (byId('icassAssignmentScore')) byId('icassAssignmentScore').value = 75;
          if (byId('icassAssignmentWeight')) byId('icassAssignmentWeight').value = 25;
          if (byId('icassPracticalScore')) byId('icassPracticalScore').value = 80;
          if (byId('icassPracticalWeight')) byId('icassPracticalWeight').value = 35;
          if (byId('icassTestScore')) byId('icassTestScore').value = 65;
          if (byId('icassTestWeight')) byId('icassTestWeight').value = 30;
          if (byId('icassAttendanceScore')) byId('icassAttendanceScore').value = 90;
          if (byId('icassAttendanceWeight')) byId('icassAttendanceWeight').value = 10;
        }
        calculate(true);
      });
    }

    // Reset button
    var resetBtn = byId('icassResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        var allInputs = form.querySelectorAll('input');
        allInputs.forEach(function (inp) { inp.value = ''; });
        clearInputErrors();
        var msgEl = byId('icassMessage');
        if (msgEl) msgEl.classList.add('hidden');
        var resEl = byId('icassResult');
        if (resEl) resEl.classList.add('hidden');
      });
    }

    // Copy Results
    var copyBtn = byId('icassCopyBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var score = byId('icassScore') ? byId('icassScore').textContent : '';
        var band = byId('icassBand') ? byId('icassBand').textContent : '';
        var summary = '📚 TVET ICASS Mark Calculation Report (AfriWidget)\n' +
          '• Overall ICASS Score: ' + score + '\n' +
          '• Assessment Band: ' + band + '\n' +
          '• Calculator: https://afriwidget.com/icass-calculator';
        navigator.clipboard.writeText(summary).then(function () {
          var original = copyBtn.innerHTML;
          copyBtn.innerHTML = '<span>✅</span> Copied to Clipboard!';
          setTimeout(function () { copyBtn.innerHTML = original; }, 2000);
        }).catch(function () {});
      });
    }

    var calcBtn = byId('icassCalculateBtn');
    if (calcBtn) {
      calcBtn.addEventListener('click', function (e) {
        if (e) e.preventDefault();
        calculate(true);
      });
    }

    // Auto-calculate on input
    form.addEventListener('input', function () {
      calculate(false);
    });

    form.addEventListener('submit', function (event) {
      if (event) event.preventDefault();
      calculate(true);
      return false;
    });
  }

  function setupReverseAdsense() {
    var form = byId('adsenseForm');
    if (!form) return;
    var modeSelect = byId('adsenseMode');
    var rpmGroup = byId('rpmGroup');
    var cpcCtrGroup = byId('cpcCtrGroup');

    if (modeSelect) {
      modeSelect.addEventListener('change', function () {
        if (modeSelect.value === 'cpc_ctr') {
          if (rpmGroup) rpmGroup.classList.add('hidden');
          if (cpcCtrGroup) cpcCtrGroup.classList.remove('hidden');
        } else {
          if (rpmGroup) rpmGroup.classList.remove('hidden');
          if (cpcCtrGroup) cpcCtrGroup.classList.add('hidden');
        }
      });
    }

    form.addEventListener('submit', function (e) {
      if (e) e.preventDefault();
      var target = number('adsenseTarget');
      var pagesPerVisit = number('adsensePageviewsPerVisit') || 1.3;
      var mode = modeSelect ? modeSelect.value : 'rpm';
      var rpm = 0;

      if (mode === 'cpc_ctr') {
        var cpc = number('adsenseCpc');
        var ctr = number('adsenseCtr');
        rpm = cpc * (ctr / 100) * 1000;
      } else {
        rpm = number('adsenseRpm');
      }

      var msg = byId('adsenseMessage');
      if (target <= 0 || rpm <= 0) {
        if (msg) {
          msg.textContent = 'Please enter a valid monthly revenue goal and a positive Page RPM or CPC/CTR rates.';
          msg.classList.remove('hidden');
        }
        return;
      }
      if (msg) msg.classList.add('hidden');

      var monthlyPv = (target / rpm) * 1000;
      var dailyPv = monthlyPv / 30.4167;
      var dailyVisits = dailyPv / Math.max(1, pagesPerVisit);
      var estimatedClicks = monthlyPv * 0.015;

      setText('adsenseMonthlyPv', Math.round(monthlyPv).toLocaleString() + ' PVs');
      setText('adsenseDailyPv', Math.round(dailyPv).toLocaleString() + ' PVs/day');
      setText('adsenseDailyVisits', Math.round(dailyVisits).toLocaleString() + ' visitors/day');
      setText('adsenseClicks', Math.round(estimatedClicks).toLocaleString() + ' clicks/mo');
      show('adsenseResult');
    });
  }

  function setupWebsiteValuation() {
    var form = byId('valuationForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      if (e) e.preventDefault();
      var netProfit = number('valNetProfit');
      var model = (byId('valModel') || {}).value || 'display_ads';
      var age = (byId('valAge') || {}).value || '1_to_3';
      var trend = (byId('valTrend') || {}).value || 'stable';

      var msg = byId('valMessage');
      if (netProfit <= 0) {
        if (msg) {
          msg.textContent = 'Please enter a valid average monthly net profit.';
          msg.classList.remove('hidden');
        }
        return;
      }
      if (msg) msg.classList.add('hidden');

      var baseMultiple = 34;
      if (model === 'saas') baseMultiple = 42;
      else if (model === 'ecommerce') baseMultiple = 38;
      else if (model === 'affiliate') baseMultiple = 33;
      else if (model === 'digital_products') baseMultiple = 31;

      if (age === '3_plus') baseMultiple += 4;
      else if (age === 'under_1') baseMultiple -= 6;

      if (trend === 'growing') baseMultiple += 5;
      else if (trend === 'declining') baseMultiple -= 8;

      baseMultiple = Math.max(18, baseMultiple);
      var conservativeMult = Math.max(15, baseMultiple - 4);
      var premiumMult = baseMultiple + 5;
      var curr = (byId('valCurrency') || {}).value || 'USD';

      setText('valConservative', money(netProfit * conservativeMult, curr));
      setText('valAverage', money(netProfit * baseMultiple, curr));
      setText('valPremium', money(netProfit * premiumMult, curr));
      setText('valMultiple', baseMultiple + 'x SDE (' + (baseMultiple / 12).toFixed(1) + 'x Annual)');
      show('valResult');
    });
  }

  function setupStartupBurnRate() {
    var form = byId('burnForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      if (e) e.preventDefault();
      var cash = number('burnCash');
      var expenses = number('burnExpenses');
      var revenue = number('burnRevenue');
      var curr = (byId('burnCurrency') || {}).value || 'USD';

      var msg = byId('burnMessage');
      if (expenses <= 0 || cash < 0) {
        if (msg) {
          msg.textContent = 'Please enter valid cash reserves and monthly operating expenses.';
          msg.classList.remove('hidden');
        }
        return;
      }
      if (msg) msg.classList.add('hidden');

      var grossBurn = expenses;
      var netBurn = expenses - revenue;

      setText('burnGross', money(grossBurn, curr) + '/mo');
      setText('burnNet', money(netBurn, curr) + '/mo');

      if (netBurn <= 0) {
        setText('burnRunway', 'Infinite (Cash Positive 🎉)');
        setText('burnZeroDate', 'N/A (Profitable)');
      } else {
        var runwayMonths = cash / netBurn;
        setText('burnRunway', runwayMonths.toFixed(1) + ' Months');

        var zeroDate = new Date();
        zeroDate.setMonth(zeroDate.getMonth() + Math.floor(runwayMonths));
        var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        setText('burnZeroDate', monthNames[zeroDate.getMonth()] + ' ' + zeroDate.getFullYear());
      }
      show('burnResult');
    });
  }

  function setupCreatorSponsorship() {
    var form = byId('sponsorshipForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      if (e) e.preventDefault();
      var platform = (byId('creatorPlatform') || {}).value || 'youtube';
      var followers = number('creatorFollowers');
      var views = number('creatorViews');
      var niche = (byId('creatorNiche') || {}).value || 'lifestyle_beauty';
      var curr = (byId('sponsorCurrency') || {}).value || 'USD';

      var msg = byId('sponsorMessage');
      if (followers <= 0 && views <= 0) {
        if (msg) {
          msg.textContent = 'Please enter your follower/subscriber count or average post views.';
          msg.classList.remove('hidden');
        }
        return;
      }
      if (msg) msg.classList.add('hidden');

      var nicheMultiplier = 1.0;
      if (niche === 'finance_tech') nicheMultiplier = 1.6;
      else if (niche === 'fitness') nicheMultiplier = 1.2;
      else if (niche === 'education') nicheMultiplier = 1.1;
      else if (niche === 'gaming') nicheMultiplier = 0.85;

      var dedicated = 0, integrated = 0, story = 0, effectiveCpm = '$25 - $40';

      if (platform === 'youtube') {
        var baseViews = views > 0 ? views : followers * 0.15;
        dedicated = (baseViews / 1000) * 35 * nicheMultiplier;
        integrated = dedicated * 0.45;
        story = dedicated * 0.25;
        effectiveCpm = '$' + Math.round(25 * nicheMultiplier) + ' - $' + Math.round(50 * nicheMultiplier);
      } else if (platform === 'tiktok') {
        var baseViews = views > 0 ? views : followers * 0.10;
        dedicated = (baseViews / 1000) * 12 * nicheMultiplier;
        integrated = dedicated * 0.6;
        story = dedicated * 0.3;
        effectiveCpm = '$' + Math.round(8 * nicheMultiplier) + ' - $' + Math.round(18 * nicheMultiplier);
      } else {
        var baseViews = views > 0 ? views : followers * 0.08;
        dedicated = (followers / 10000) * 150 * nicheMultiplier;
        integrated = dedicated * 0.5;
        story = dedicated * 0.3;
        effectiveCpm = '$' + Math.round(15 * nicheMultiplier) + ' - $' + Math.round(30 * nicheMultiplier);
      }

      setText('sponsorDedicated', money(dedicated, curr));
      setText('sponsorIntegrated', money(integrated, curr));
      setText('sponsorStory', money(story, curr));
      setText('sponsorCpm', effectiveCpm);
      show('sponsorResult');
    });
  }

  function setupRemoteSalary() {
    var form = byId('remoteSalaryForm');
    if (!form) return;

    var colIndices = {
      'San Francisco, US': 100,
      'New York, US': 98,
      'London, UK': 85,
      'Munich, Germany': 72,
      'Toronto, Canada': 74,
      'Dubai, UAE': 70,
      'Cape Town, South Africa': 40,
      'Johannesburg, South Africa': 38,
      'Nairobi, Kenya': 34,
      'Lagos, Nigeria': 30,
      'Accra, Ghana': 32,
      'Bangalore, India': 25
    };

    form.addEventListener('submit', function (e) {
      if (e) e.preventDefault();
      var salary = number('remoteBaseSalary');
      var curr = (byId('remoteCurrency') || {}).value || 'USD';
      var baseLoc = (byId('remoteBaseLocation') || {}).value || 'San Francisco, US';
      var targetLoc = (byId('remoteTargetLocation') || {}).value || 'Nairobi, Kenya';

      var msg = byId('remoteMessage');
      if (salary <= 0) {
        if (msg) {
          msg.textContent = 'Please enter a valid base annual salary.';
          msg.classList.remove('hidden');
        }
        return;
      }
      if (msg) msg.classList.add('hidden');

      var baseIndex = colIndices[baseLoc] || 100;
      var targetIndex = colIndices[targetLoc] || 40;

      var equivalent = salary * (targetIndex / baseIndex);
      var diffPct = ((targetIndex - baseIndex) / baseIndex) * 100;
      var powerMult = baseIndex / targetIndex;

      setText('remoteEquivalentSalary', money(equivalent, curr) + '/yr');
      setText('remoteColDiff', (diffPct > 0 ? '+' : '') + diffPct.toFixed(1) + '% Cost of Living');
      setText('remotePowerMult', powerMult.toFixed(2) + 'x Effective Purchasing Power');
      show('remoteResult');
    });
  }

  var initialized = false;
  function init() {
    if (initialized) return;
    initialized = true;
    setupFreelance();
    setupData();
    setupExperience();
    setupSavings();
    setupGuide();
    setupQrGenerator();
    setupLoanCalculator();
    setupSavingsCalculator();
    setupCurrencyConverter();
    setupIcassCalculator();
    setupReverseAdsense();
    setupWebsiteValuation();
    setupStartupBurnRate();
    setupCreatorSponsorship();
    setupRemoteSalary();
  }

  if (document.readyState === 'loading') {
    onReady(init);
  } else {
    init();
  }
  window.addEventListener('load', init);
}());