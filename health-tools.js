function onReady(fn) { if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', fn); } else { fn(); } }
(function () {
  'use strict';

  var DAY = 24 * 60 * 60 * 1000;

  function byId(id) {
    return document.getElementById(id);
  }

  function numberValue(id) {
    var el = byId(id);
    if (!el) return 0;
    var val = parseFloat(el.value);
    return Number.isFinite(val) ? val : 0;
  }

  function formatNumber(value, decimals) {
    return Number(value).toLocaleString(undefined, {
      maximumFractionDigits: decimals == null ? 1 : decimals
    });
  }

  function localDateFromInput(value) {
    if (!value) return new Date();
    var parts = value.split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function localDateString(date) {
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  }

  function addDays(date, days) {
    return new Date(date.getTime() + days * DAY);
  }

  function formatDate(date) {
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function todayAtMidnight() {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  function show(id, text) {
    var element = byId(id);
    if (element) element.textContent = text;
  }

  function showResult(id) {
    var result = byId(id);
    if (result) result.classList.remove('hidden');
  }

  function setStatus(id, text, tone) {
    var element = byId(id);
    if (!element) return;
    element.textContent = text;
    element.className = 'rounded-2xl border-2 p-5 text-center font-bold ' + (tone === 'good'
      ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
      : tone === 'warn'
        ? 'border-amber-300 bg-amber-50 text-amber-800'
        : 'border-rose-300 bg-rose-50 text-rose-800');
  }

  function initDosage() {
    var form = byId('dosageForm');
    if (!form) return;
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var weight = numberValue('dosageWeight');
      var unitEl = byId('dosageUnit');
      var unit = unitEl ? unitEl.value : 'kg';
      var medEl = byId('medicineType');
      var medicine = medEl ? medEl.value : 'para120';
      if (!(weight > 0)) return setStatus('dosageMessage', 'Enter a child weight greater than zero.', 'bad');
      var kg = unit === 'lb' ? weight / 2.20462 : weight;
      var doseMgPerKg = medicine === 'ibuprofen' ? 10 : 15;
      var concentration = medicine === 'para250' ? 50 : medicine === 'para120' ? 24 : 20;
      var doseMg = kg * doseMgPerKg;
      var doseMl = doseMg / concentration;
      var maxDailyMg = kg * (medicine === 'ibuprofen' ? 40 : 60);
      var maxDailyMl = maxDailyMg / concentration;
      show('doseAmount', formatNumber(doseMl, 1) + ' mL');
      show('doseFrequency', medicine === 'ibuprofen' ? 'Every 6–8 hours if needed' : 'Every 4–6 hours if needed');
      show('doseMaximum', formatNumber(maxDailyMl, 1) + ' mL in 24 hours');
      show('doseBasis', formatNumber(doseMg, 0) + ' mg per dose at ' + formatNumber(kg, 1) + ' kg body weight');
      setStatus('dosageMessage', 'Estimate calculated. Confirm the bottle strength and dose with a doctor or pharmacist before giving medicine.', 'warn');
      showResult('dosageResult');
    });
  }

  function initCycle() {
    var form = byId('cycleForm');
    if (!form) return;
    var dateInput = byId('periodStart');
    if (dateInput && !dateInput.value) {
      dateInput.value = localDateString(todayAtMidnight());
    }
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var startValue = dateInput ? dateInput.value : '';
      var cycleLength = numberValue('cycleLength');
      var periodLength = numberValue('periodLength');
      if (!startValue || cycleLength < 21 || cycleLength > 35 || periodLength < 1 || periodLength > cycleLength) {
        return setStatus('cycleMessage', 'Use a valid period date, a cycle length from 21–35 days, and a period duration shorter than the cycle.', 'bad');
      }
      var start = localDateFromInput(startValue);
      var nextPeriod = addDays(start, cycleLength);
      var ovulation = addDays(start, cycleLength - 14);
      var fertileStart = addDays(ovulation, -5);
      var fertileEnd = addDays(ovulation, 1);
      var earlyLower = addDays(start, periodLength);
      var lateLower = addDays(fertileEnd, 1);
      show('nextPeriod', formatDate(nextPeriod));
      show('fertileWindow', formatDate(fertileStart) + ' – ' + formatDate(fertileEnd));
      show('ovulationPeak', formatDate(ovulation));
      show('lowerRisk', formatDate(earlyLower) + ' – ' + formatDate(addDays(fertileStart, -1)) + ', then ' + formatDate(lateLower) + ' – ' + formatDate(addDays(nextPeriod, -1)));
      setStatus('cycleMessage', 'These are calendar-based estimates, not reliable contraception or a diagnosis.', 'warn');
      showResult('cycleResult');
    });
  }

  function initWater() {
    var form = byId('waterForm');
    if (!form) return;
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var weight = numberValue('waterWeight');
      var exercise = byId('waterExercise') ? numberValue('waterExercise') : numberValue('exerciseMinutes');
      var climateEl = byId('waterClimate') || byId('climate');
      var climateVal = climateEl ? climateEl.value : '0';
      var climateAdj = climateVal === 'hot' ? 0.5 : (parseFloat(climateVal) || 0);
      var errorEl = byId('waterError');

      if (!(weight > 0) || exercise < 0) {
        if (errorEl) errorEl.textContent = 'Please enter a valid weight and exercise duration.';
        setStatus('waterMessage', 'Enter a positive body weight and zero or more exercise minutes.', 'bad');
        return;
      }
      if (errorEl) errorEl.textContent = '';

      var liters = weight * 0.033 + (exercise / 30) * 0.35 + climateAdj;
      show('waterLitres', liters.toFixed(1) + ' L');
      show('waterLiters', liters.toFixed(1) + ' L');
      show('waterMl', Math.round(liters * 1000) + ' mL');
      show('waterMilliliters', Math.round(liters * 1000) + ' mL');
      show('waterBottles', (liters / 0.5).toFixed(1));
      show('waterFormula', 'Starting estimate: 0.033 L/kg + exercise adjustment + climate adjustment.');
      setStatus('waterMessage', 'Use this as a starting estimate and drink according to thirst, medical advice, and your activity conditions.', 'good');
      showResult('waterResults');
      showResult('waterResult');

      var resultsEl = byId('waterResults') || byId('waterResult');
      if (resultsEl) {
        setTimeout(function () {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    });
  }

  function initCalories() {
    var form = byId('calorieForm');
    if (!form) return;
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var genEl = byId('calorieGender');
      var gender = genEl ? genEl.value : 'female';
      var age = numberValue('calorieAge');
      var height = numberValue('calorieHeight');
      var weight = numberValue('calorieWeight');
      var actEl = byId('activityLevel');
      var activity = actEl ? (Number(actEl.value) || 1.2) : 1.2;
      if (!(age > 0) || !(height > 0) || !(weight > 0) || !(activity > 0)) {
        return setStatus('calorieMessage', 'Complete every field with a positive value.', 'bad');
      }
      var bmr = gender === 'male'
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;
      var tdee = bmr * activity;
      var deficit = Math.max(tdee - 500, gender === 'male' ? 1500 : 1200);
      show('calorieBmr', formatNumber(bmr, 0) + ' kcal/day');
      show('calorieTdee', formatNumber(tdee, 0) + ' kcal/day');
      show('calorieMaintenance', formatNumber(tdee, 0) + ' kcal/day');
      show('calorieDeficit', formatNumber(deficit, 0) + ' kcal/day');
      show('calorieFormula', 'Mifflin–St Jeor BMR × activity multiplier ' + activity);
      setStatus('calorieMessage', 'This is a planning estimate. Avoid aggressive restriction and speak with a qualified professional about medical or nutrition needs.', 'warn');
      showResult('calorieResult');
    });
  }

  function initDonation() {
    var form = byId('donationForm');
    if (!form) return;
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var age = numberValue('donorAge');
      var weight = numberValue('donorWeight');
      var lastEl = byId('lastDonation');
      var lastValue = lastEl ? lastEl.value : '';
      var genEl = byId('donorGender');
      var gap = (genEl && genEl.value === 'female') ? 120 : 90;
      var today = todayAtMidnight();
      var dateAllowed = lastValue ? addDays(localDateFromInput(lastValue), gap) : today;
      var basicEligible = age >= 18 && age <= 65 && weight >= 50;
      var eligible = basicEligible && today >= dateAllowed;
      show('earliestDonation', formatDate(dateAllowed));
      show('donationReason', !basicEligible
        ? 'Eligibility requires an age of 18–65 and a body weight of at least 50 kg.'
        : today < dateAllowed
          ? 'The recommended ' + gap + '-day interval since your last donation has not passed.'
          : 'Your supplied age, weight, and donation interval meet this planning screen.');
      setStatus('donationStatus', eligible ? 'Eligible to donate based on these planning inputs' : 'Not eligible yet based on these planning inputs', eligible ? 'good' : 'bad');
      showResult('donationResult');
    });
  }

  onReady(function () {
    initDosage();
    initCycle();
    initWater();
    initCalories();
    initDonation();
  });
})();