import fs from 'fs';

const descriptions2 = {
  "app-revenue-calculator.html": {
    meta: "Calculate mobile app revenue from in-app purchases, subscriptions, and ad impressions (eCPM) with app store platform fee deductions.",
    og: "Estimate mobile app earnings, subscription MRR, and ad revenue with platform fee deductions."
  },
  "blood-pressure-tracker.html": {
    meta: "Track and categorize systolic and diastolic blood pressure readings according to AHA and WHO guidelines with mean arterial pressure (MAP) analysis.",
    og: "Track blood pressure readings, check hypertension stages, and calculate Mean Arterial Pressure."
  },
  "bmi-calculator.html": {
    meta: "Calculate Body Mass Index (BMI), prime index, and healthy weight ranges for adults using metric (kg/cm) and imperial (lbs/inches) units.",
    og: "Calculate your Body Mass Index (BMI) and discover your ideal healthy weight range."
  },
  "cltv-cac-ratio-calculator.html": {
    meta: "Calculate Customer Lifetime Value (CLTV), Customer Acquisition Cost (CAC), and your SaaS LTV:CAC health ratio with payback period forecasting.",
    og: "Calculate CLTV to CAC ratios, payback periods, and SaaS unit economics health metrics."
  },
  "content-readability-analyzer.html": {
    meta: "Analyze text readability with Flesch Reading Ease, Flesch-Kincaid Grade Level, Gunning Fog, and Coleman-Liau scores to improve writing clarity.",
    og: "Measure text readability and grade reading level scores to improve writing clarity and engagement."
  },
  "creator-sponsorship-calculator.html": {
    meta: "Calculate creator sponsorship rates and brand deal pricing for YouTube integrations, TikTok posts, Instagram reels, and newsletter shoutouts.",
    og: "Calculate fair brand sponsorship rates and rate cards for YouTube, TikTok, and Instagram."
  },
  "css-box-shadow-generator.html": {
    meta: "Design custom CSS box shadows with live visual controls for horizontal offset, vertical blur, spread radius, color opacity, and inset shadow codes.",
    og: "Generate smooth, multi-layered CSS box shadows with live visual preview and copyable code."
  },
  "css-gradient-generator.html": {
    meta: "Create beautiful linear and radial CSS gradients with multi-color stops, custom angles, opacity, and one-click CSS code generation.",
    og: "Create and customize linear and radial CSS color gradients with instant code export."
  },
  "freelance-project-quote-estimator.html": {
    meta: "Estimate freelance project costs, milestone pricing, revisions buffer, and value-based client quotes based on scope, hours, and market rates.",
    og: "Calculate professional freelance client project quotes, milestone budgets, and buffer margins."
  },
  "gpa-cgpa-converter.html": {
    meta: "Convert GPA and CGPA between 4.0, 5.0, 7.0, and 10.0 grading scales and percentage marks for university admissions and global scholarships.",
    og: "Convert grade point averages across 4.0, 5.0, 7.0, and 10.0 global GPA grading scales."
  },
  "hash-generator.html": {
    meta: "Generate cryptographic hashes including MD5, SHA-1, SHA-256, and SHA-512 from text strings instantly in your browser. 100% private execution.",
    og: "Generate secure MD5, SHA-1, SHA-256, and SHA-512 cryptographic hashes client-side."
  },
  "ideal-weight-calculator.html": {
    meta: "Calculate your ideal body weight using Devine, Robinson, Miller, and Hamwi formulas based on your height, gender, and frame size.",
    og: "Calculate ideal body weight ranges using clinically validated Devine, Robinson, and Hamwi equations."
  },
  "image-resizer-webp-converter.html": {
    meta: "Resize images and convert JPG, PNG, and GIF files to modern, compressed WebP format in your browser with zero quality loss and no server uploads.",
    og: "Resize image dimensions and convert pictures to fast WebP format with 100% private in-browser processing."
  },
  "invoice-receipt-generator.html": {
    meta: "Create and download clean, professional sales receipts and invoices for customers and clients. Add tax rates, discounts, and payment terms.",
    og: "Generate customizable receipts and sales invoices instantly with PDF export and print formatting."
  },
  "keyword-density-checker.html": {
    meta: "Analyze keyword frequency, one-word, two-word, and three-word phrase density to optimize web content for SEO without keyword stuffing.",
    og: "Check keyword frequency, word counts, and phrase density to optimize content for search engines."
  },
  "loan-calculator.html": {
    meta: "Calculate monthly personal, business, or auto loan payments with amortization schedules, total interest costs, and accelerated payoff comparisons.",
    og: "Calculate monthly loan payments, interest charges, and payoff schedules with custom interest rates."
  },
  "meta-pixel-checker.html": {
    meta: "Preview and check Google SERP snippet title and meta description pixel widths to prevent search result truncation on desktop and mobile screens.",
    og: "Check Google search snippet title and description pixel widths to prevent SERP truncation."
  },
  "ovulation-cycle-calculator.html": {
    meta: "Calculate your ovulation cycle, peak fertility dates, and next period forecast based on average menstrual cycle duration and luteal phase length.",
    og: "Calculate ovulation dates, fertile conception windows, and future menstrual cycle timelines."
  },
  "pediatric-dosage-calculator.html": {
    meta: "Calculate pediatric medication dosages based on child body weight (mg/kg), liquid concentration, and daily dosing frequency guidelines.",
    og: "Estimate pediatric liquid medication dosages based on child weight (mg/kg) and concentrations."
  },
  "pricing-calculator.html": {
    meta: "Calculate optimal product and service pricing using cost-plus, value-based, and competitor markup models to maximize gross profit margins.",
    og: "Determine profitable product and service pricing based on costs, target margins, and markups."
  },
  "productivity.html": {
    meta: "Explore free, privacy-first productivity utilities and developer tools including text cleanup, QR generators, JSON formatters, and word counters.",
    og: "Browse free, fast, and 100% private productivity calculators and developer utilities."
  },
  "profit-margin-calculator.html": {
    meta: "Calculate gross profit margin, net profit margin, and percentage markup from cost and selling price with comprehensive revenue breakdowns.",
    og: "Calculate gross profit margins, net margins, and selling price markups for business profitability."
  },
  "random-address-generator.html": {
    meta: "Generate realistic mock street addresses, postal codes, and city data for software testing, form validation, and database seeding.",
    og: "Create random mock street addresses and postal coordinates for developer testing."
  },
  "random-business-name-generator.html": {
    meta: "Generate unique, catchy business name ideas across technology, retail, creative, and consulting niches with customizable keywords.",
    og: "Generate random, creative business names and brand ideas for new ventures and projects."
  },
  "random-color-generator.html": {
    meta: "Generate random vibrant colors, HEX codes, RGB, HSL values, and complementary color palettes with one-click clipboard copying.",
    og: "Generate random colors, HEX/RGB codes, and harmonious color palettes instantly."
  },
  "random-date-generator.html": {
    meta: "Generate random dates within custom date ranges, years, and timeframes for developer test data, mock logs, and simulation models.",
    og: "Create random dates and timestamps within custom start and end intervals for testing."
  },
  "random-nickname-generator.html": {
    meta: "Generate fun, creative nicknames and gaming handles for Discord, gamer tags, social media profiles, and creative character names.",
    og: "Create unique, creative nicknames and gamer tags tailored to your personal style."
  },
  "random-phone-number-generator.html": {
    meta: "Generate valid-format mock phone numbers with international country codes for QA testing, UI mockups, and form verification.",
    og: "Generate random formatted test phone numbers for software testing and form validation."
  },
  "random-team-name-generator.html": {
    meta: "Generate creative, cool, and funny team names for sports leagues, trivia nights, hackathons, workplace squads, and esports competitions.",
    og: "Discover awesome team names for sports, corporate squads, hackathons, and pub trivia."
  },
  "random-username-generator.html": {
    meta: "Generate unique, memorable usernames and handles for Instagram, TikTok, Reddit, YouTube, Twitch, and gaming platforms.",
    og: "Generate cool, available-style usernames and handles for social media and gaming."
  },
  "reading-time-speech-estimator.html": {
    meta: "Estimate reading time and speaking speech duration from word count with customizable words-per-minute (WPM) speed settings.",
    og: "Calculate estimated reading time and presentation speech duration for articles and scripts."
  },
  "real-estate.html": {
    meta: "Explore free real estate calculators for mortgages, rental yield, rent affordability, and property investment cash flow analysis.",
    og: "Browse free online real estate and property investment calculators with instant private results."
  },
  "reddit-video-downloader.html": {
    meta: "Extract direct MP4 video stream URLs with synced audio from public Reddit video posts directly in your browser. 100% private and fast.",
    og: "Extract direct MP4 video download streams with audio from public Reddit posts in your browser."
  },
  "remote-salary-converter.html": {
    meta: "Compare international remote salaries with live currency conversions and Cost of Living (CoL) purchasing power adjustments.",
    og: "Compare remote job offers across countries with currency exchange and Cost of Living adjustments."
  },
  "rent-affordability.html": {
    meta: "Calculate how much rent you can afford based on the 30% rule and 40x gross monthly income benchmark, factoring in taxes and debt.",
    og: "Determine maximum affordable monthly rent based on your income, taxes, and debt obligations."
  },
  "reverse-adsense-calculator.html": {
    meta: "Calculate required website traffic, pageviews, and click-through rates needed to hit your target monthly Google AdSense earnings.",
    og: "Determine how many daily and monthly website pageviews you need to hit your target AdSense income."
  },
  "robots-txt-generator.html": {
    meta: "Create custom robots.txt files with crawl rules for Googlebot, Bingbot, search engines, and AI scrapers. Download formatted robots.txt instantly.",
    og: "Generate and download custom robots.txt directives for search engine crawler management."
  },
  "savings-calculator.html": {
    meta: "Calculate total savings growth with initial deposits, regular monthly contributions, and compounding interest over custom time horizons.",
    og: "Calculate your savings growth over time with monthly contributions and compound interest."
  },
  "savings-goal-timeline-calculator.html": {
    meta: "Calculate the exact timeline needed to reach your savings target or determine the required monthly savings contribution for future goals.",
    og: "Calculate how long it will take to achieve your savings goal with interest and recurring deposits."
  },
  "seo-meta-generator.html": {
    meta: "Generate optimized HTML meta tags, Open Graph cards, and Twitter Cards with live desktop and mobile Google SERP preview.",
    og: "Create search-engine-ready meta title, description tags, and social Open Graph tags with live SERP preview."
  },
  "startup-burn-rate-calculator.html": {
    meta: "Calculate gross and net monthly cash burn rates and forecast runway months to determine your startup cash exhaustion milestone date.",
    og: "Calculate startup cash burn rate, runway months remaining, and zero-cash date forecasting."
  },
  "startup-cost-calculator.html": {
    meta: "Calculate one-time startup capital expenses and recurring monthly operating costs to estimate total funding needed to launch your business.",
    og: "Estimate total initial capital expenses and recurring operating costs needed to launch a business."
  },
  "work-experience-resume-duration-calculator.html": {
    meta: "Calculate total cumulative work experience in years and months across multiple overlapping job positions for resumes and job applications.",
    og: "Calculate total years and months of professional work experience across multiple employment periods."
  },
  "xml-sitemap-builder.html": {
    meta: "Build standard XML sitemaps with custom URL priorities, change frequencies, and last modification dates for search engine indexing.",
    og: "Generate and download valid XML sitemaps for Google Search Console and Bing Webmaster Tools."
  }
};

let count = 0;
for (const [file, descObj] of Object.entries(descriptions2)) {
  if (!fs.existsSync(file)) {
    console.log(`Warning: ${file} does not exist.`);
    continue;
  }

  let content = fs.readFileSync(file, 'utf8');

  // Replace <meta name="description" ... />
  const metaDescRegex = /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i;
  const metaDescRegexAlt = /<meta\s+content=["'][^"']*["']\s+name=["']description["']\s*\/?>/i;

  if (metaDescRegex.test(content)) {
    content = content.replace(metaDescRegex, `<meta name="description" content="${descObj.meta}" />`);
  } else if (metaDescRegexAlt.test(content)) {
    content = content.replace(metaDescRegexAlt, `<meta name="description" content="${descObj.meta}" />`);
  } else {
    content = content.replace(/<head>/i, `<head>\n  <meta name="description" content="${descObj.meta}" />`);
  }

  // Replace <meta property="og:description" ... />
  const ogDescRegex = /<meta\s+property=["']og:description["']\s+content=["'][^"']*["']\s*\/?>/i;
  const ogDescRegexAlt = /<meta\s+content=["'][^"']*["']\s+property=["']og:description["']\s*\/?>/i;

  if (ogDescRegex.test(content)) {
    content = content.replace(ogDescRegex, `<meta property="og:description" content="${descObj.og}" />`);
  } else if (ogDescRegexAlt.test(content)) {
    content = content.replace(ogDescRegexAlt, `<meta property="og:description" content="${descObj.og}" />`);
  }

  // Replace twitter:description if present
  const twDescRegex = /<meta\s+name=["']twitter:description["']\s+content=["'][^"']*["']\s*\/?>/i;
  const twDescRegexAlt = /<meta\s+content=["'][^"']*["']\s+name=["']twitter:description["']\s*\/?>/i;

  if (twDescRegex.test(content)) {
    content = content.replace(twDescRegex, `<meta name="twitter:description" content="${descObj.og}" />`);
  } else if (twDescRegexAlt.test(content)) {
    content = content.replace(twDescRegexAlt, `<meta name="twitter:description" content="${descObj.og}" />`);
  }

  fs.writeFileSync(file, content, 'utf8');
  count++;
}

console.log(`Successfully updated batch 2: ${count} pages.`);
