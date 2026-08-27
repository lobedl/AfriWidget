# MANDATORY USER-ACTION & EXPLICIT CALCULATION STANDARD

This document defines the **strict, non-negotiable rule regarding calculation and processing triggers** across the entire **AfriWidget** platform.

---

## 🛑 1. Core Mandate: NO Auto-Generated Calculations

**NO TOOL, CALCULATOR, CONVERTER, OR GENERATOR MAY PROCESS OR DISPLAY RESULTS AUTOMATICALLY WITHOUT EXPLICIT USER ACTION.**

Visitors must intentionally click an explicit action button (e.g., **"Calculate"**, **"Convert"**, **"Generate"**, **"Analyze"**, or **"Submit"**) before any numerical calculation, grading matrix, projection table, or output processing is executed.

---

## 🚫 2. Strictly Forbidden Anti-Patterns

### ❌ Anti-Pattern 1: Auto-Run on Page Load (`DOMContentLoaded` / Script Init)
- **Forbidden**: Calling `calculate()`, `calc()`, `calculateUACE()`, `calculatePLE()`, etc. immediately when the page loads or inside `onReady()`.
- **Reason**: Loads premature or confusing default values before the user has entered their own data.

### ❌ Anti-Pattern 2: Live Auto-Recalculation on `input` or `change`
- **Forbidden**: Attaching `input.addEventListener('input', calculate)` or `select.addEventListener('change', calculate)` that re-evaluates formulas on every single keystroke or option switch.
- **Reason**: Causes distracting visual jumping, layout shifts, premature error flashes while typing incomplete numbers, and unwanted background computation.

### ❌ Anti-Pattern 3: Post-Calculation Reactive Triggers (`hasCalculated = true`)
- **Forbidden**: Setting a flag on first calculation that thereafter causes every subsequent keystroke to trigger recalculation automatically.
- **Reason**: The user must explicitly press the Calculate button whenever they want to re-run the calculation with new numbers.

---

## ✅ 3. The Required User-Initiated Flow

Every single tool and calculator must strictly follow this pattern:

```javascript
// 1. Define the calculation / processing function
function calculate() {
  // Read inputs, validate, compute, and render results to DOM
}

// 2. ONLY attach calculation execution to explicit user button clicks or form submit
document.getElementById('calculateBtn').addEventListener('click', function(e) {
  if (e) e.preventDefault();
  calculate();
  
  // Optional smooth scroll to results container on mobile/desktop
  const resultsEl = document.getElementById('results');
  if (resultsEl) {
    resultsEl.classList.remove('hidden');
    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

// 3. Clear/Reset button resets form and clears results without auto-recalculating
document.getElementById('resetBtn')?.addEventListener('click', function() {
  // Clear inputs and reset results display
  document.querySelectorAll('input').forEach(input => input.value = '');
  const resultsEl = document.getElementById('results');
  if (resultsEl) resultsEl.classList.add('hidden');
});

// 4. DO NOT call calculate() at the end of the script!
```

---

## 📋 4. Form and Generator Checklist

When creating or modifying any tool:
1. **Button Presence:** Verify an explicit `<button type="button" id="...">Calculate [Tool Name]</button>` or `<button type="submit">` is visibly present.
2. **Initial State:** On initial load, the results section should either be hidden (`hidden` class) or display an instructional placeholder (e.g. *"Enter your details above and click Calculate to view your results"*).
3. **No Event Binding to Calculation:** Ensure `addEventListener('input', ...)` or `addEventListener('change', ...)` only update currency symbol labels or dynamic UI styling—**never** the calculation engine.
4. **No Init Execution:** Search the script for trailing function invocations like `calculate();` and remove them.
