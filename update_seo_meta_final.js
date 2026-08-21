import fs from 'fs';

const descriptionsFinal = {
  "404.html": {
    meta: "The page you are looking for does not exist on AfriWidget. Explore our complete directory of free online calculators, academic tools, and utilities.",
    og: "Page not found on AfriWidget. Browse our directory of 113+ free online calculators and tools."
  },
  "blood-donation-eligibility-calculator.html": {
    meta: "Check your general blood donation eligibility based on age, weight, health conditions, donation intervals, and travel history guidelines.",
    og: "Check your eligibility to donate whole blood, platelets, and plasma safely."
  },
  "break-even-calculator.html": {
    meta: "Calculate your business break-even point in units and sales revenue based on fixed costs, variable costs per unit, and unit selling price.",
    og: "Calculate break-even units and revenue volume needed to cover business operating costs."
  },
  "business.html": {
    meta: "Explore free business and freelance calculators for hourly rates, client project pricing, profit margins, burn rate, and startup costs.",
    og: "Browse free, privacy-first business, startup, and freelance pricing calculators on AfriWidget."
  },
  "calorie-burn-calculator.html": {
    meta: "Calculate calories burned during physical activities, running, cycling, swimming, and strength training using metabolic equivalent (MET) values.",
    og: "Calculate exercise calorie burn based on workout duration, intensity, and body weight."
  },
  "calorie-deficit-planner.html": {
    meta: "Plan your personalized calorie deficit and weight loss timeline based on daily maintenance calories, target weight, and target date.",
    og: "Plan your calorie deficit and visualize your healthy weight loss timeline with target milestones."
  },
  "currency-converter.html": {
    meta: "Convert live exchange rates across USD, EUR, GBP, NGN, KES, ZAR, GHS, and global currencies with instant in-browser rate calculation.",
    og: "Convert foreign currencies with live exchange rates and instant in-browser conversion."
  },
  "daily-calorie-needs-calculator.html": {
    meta: "Calculate your daily calorie needs for weight maintenance, healthy fat loss, or muscle gain based on BMR, age, gender, and activity level.",
    og: "Calculate daily caloric intake targets for weight loss, maintenance, or muscle building."
  },
  "data-file-unit-converter.html": {
    meta: "Convert digital storage and file size units across Bits, Bytes, KB, MB, GB, TB, and PB in binary (1024) and decimal (1000) standards.",
    og: "Convert digital storage data units from bits and bytes to gigabytes and terabytes."
  },
  "finance.html": {
    meta: "Explore free financial calculators for loans, mortgages, compound interest, savings goals, student finance, and debt payoff strategies.",
    og: "Browse free, privacy-first financial calculators for loans, investments, and budgeting."
  },
  "freelance-hourly-rate-pricing-calculator.html": {
    meta: "Calculate your optimal freelance hourly rate and client project pricing based on billable hours, annual income targets, and business expenses.",
    og: "Calculate your freelance hourly rate and project quote estimates to hit annual income goals."
  },
  "freelance-rate-calculator.html": {
    meta: "Determine your freelance hourly and daily billing rate to cover taxes, business overhead, billable hours, and desired annual income.",
    og: "Calculate freelance hourly rates and project fee structures based on required income."
  },
  "health.html": {
    meta: "Explore free health, fitness, and wellness calculators including BMI, BMR, TDEE, macro ratios, hydration targets, and sleep cycles.",
    og: "Browse free, privacy-first health and wellness calculators with instant private results."
  },
  "healthy-weight-range-calculator.html": {
    meta: "Calculate your clinically healthy weight range based on WHO BMI standards and body frame size for both metric and imperial measurements.",
    og: "Calculate your ideal healthy weight range based on height and clinical BMI guidelines."
  },
  "hourly-to-salary.html": {
    meta: "Convert hourly pay rates to annual salary, monthly, biweekly, and weekly gross income based on working hours per week and paid weeks per year.",
    og: "Convert hourly wage to equivalent annual, monthly, and weekly gross income."
  },
  "html-minifier.html": {
    meta: "Minify HTML code online by stripping unnecessary whitespace, comments, and empty lines to optimize website page load speed.",
    og: "Minify HTML markup to reduce page size and improve website PageSpeed performance."
  },
  "hydration-reminder-calculator.html": {
    meta: "Calculate your hourly hydration schedule and water intake reminders based on daily water targets, waking hours, and workout frequency.",
    og: "Create an hourly daily water drinking schedule tailored to your active routine."
  }
};

for (const [file, descObj] of Object.entries(descriptionsFinal)) {
  if (!fs.existsSync(file)) continue;

  let content = fs.readFileSync(file, 'utf8');

  const metaDescRegex = /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i;
  const metaDescRegexAlt = /<meta\s+content=["'][^"']*["']\s+name=["']description["']\s*\/?>/i;

  if (metaDescRegex.test(content)) {
    content = content.replace(metaDescRegex, `<meta name="description" content="${descObj.meta}" />`);
  } else if (metaDescRegexAlt.test(content)) {
    content = content.replace(metaDescRegexAlt, `<meta name="description" content="${descObj.meta}" />`);
  }

  const ogDescRegex = /<meta\s+property=["']og:description["']\s+content=["'][^"']*["']\s*\/?>/i;
  const ogDescRegexAlt = /<meta\s+content=["'][^"']*["']\s+property=["']og:description["']\s*\/?>/i;

  if (ogDescRegex.test(content)) {
    content = content.replace(ogDescRegex, `<meta property="og:description" content="${descObj.og}" />`);
  } else if (ogDescRegexAlt.test(content)) {
    content = content.replace(ogDescRegexAlt, `<meta property="og:description" content="${descObj.og}" />`);
  }

  fs.writeFileSync(file, content, 'utf8');
}

console.log('Final batch completed.');
