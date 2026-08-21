import fs from 'fs';

// Map of high-converting, accurate, keyword-rich meta descriptions tailored to each page (120-158 characters)
const descriptions = {
  // === AI & WRITING TOOLS ===
  "ai-bio-generator.html": {
    meta: "Generate professional bios for LinkedIn, resumes, speaker profiles, and social media with AI. Customize tone and length with free in-browser privacy.",
    og: "Create compelling professional biographies for resumes, websites, and social profiles instantly with AI."
  },
  "ai-blog-title-generator.html": {
    meta: "Generate catchy, SEO-friendly blog post titles and article headlines with AI. Boost your click-through rates with engaging topic ideas and formulas.",
    og: "Generate catchy, viral, and SEO-optimized blog titles and article headlines instantly with AI."
  },
  "ai-business-name-generator.html": {
    meta: "Discover creative, memorable business name ideas and brand names with AI. Generate catchy startup names across tech, retail, consulting, and commerce.",
    og: "Generate creative, catchy business names and brand ideas tailored to your industry with AI."
  },
  "ai-cover-letter-generator.html": {
    meta: "Generate tailored, professional cover letters for job applications with AI. Match your experience to job descriptions with instant, private editing.",
    og: "Create compelling, job-matched cover letters in seconds with our free AI cover letter generator."
  },
  "ai-email-writer.html": {
    meta: "Draft professional business emails, follow-ups, client replies, and sales pitches with AI. Choose tone, purpose, and key points for instant polish.",
    og: "Write clear, persuasive, and professional emails in seconds with our free AI email writer."
  },
  "ai-gig-description-generator.html": {
    meta: "Create high-converting freelance gig descriptions for Fiverr and Upwork with AI. Highlight your skills, deliverables, and packages to win clients.",
    og: "Generate high-ranking Fiverr and Upwork gig descriptions with our free AI freelance tool."
  },
  "ai-hashtag-generator.html": {
    meta: "Generate trending, relevant hashtags for Instagram, TikTok, Twitter, and LinkedIn with AI. Increase social reach and engagement across your niche.",
    og: "Discover trending, high-engagement hashtags for Instagram, TikTok, and LinkedIn with AI."
  },
  "ai-linkedin-headline-generator.html": {
    meta: "Craft impactful LinkedIn headlines that attract recruiters and clients with AI. Highlight your role, value proposition, and keywords effortlessly.",
    og: "Generate high-converting, keyword-rich LinkedIn profile headlines with our free AI tool."
  },
  "ai-paraphrasing-tool.html": {
    meta: "Rewrite sentences, essays, and articles with our free AI paraphrasing tool. Enhance clarity, fix tone, and improve vocabulary with zero signup and 100% privacy.",
    og: "Rewrite text with enhanced clarity and tone using our free, private in-browser AI paraphrasing tool."
  },
  "ai-product-description-generator.html": {
    meta: "Generate persuasive e-commerce product descriptions for Shopify, Amazon, and Etsy with AI. Highlight features and benefits that drive sales conversions.",
    og: "Create persuasive, SEO-friendly e-commerce product descriptions in seconds with AI."
  },
  "ai-resume-builder.html": {
    meta: "Build modern, ATS-friendly resumes and CV bullet points with AI. Structure your work experience and achievements into formatted, ready-to-use resumes.",
    og: "Create tailored, ATS-compliant resumes and professional bullet points with our free AI builder."
  },
  "ai-social-media-caption-generator.html": {
    meta: "Generate engaging captions for Instagram posts, TikTok videos, Facebook, and Threads with AI. Includes call-to-actions and customizable tones.",
    og: "Create viral, engaging social media captions with relevant emojis and hashtags using AI."
  },
  "ai-text-summarizer.html": {
    meta: "Condense long articles, research papers, essays, and meeting notes into concise summaries or bullet points with our free, private in-browser AI summarizer.",
    og: "Summarize long articles, documents, and reports into key takeaways and bullet points with AI."
  },
  "ai-youtube-description-generator.html": {
    meta: "Generate SEO-optimized YouTube video descriptions with timestamps, keywords, and call-to-actions with AI to boost views and subscriber engagement.",
    og: "Create search-optimized YouTube video descriptions with links and timestamps using AI."
  },
  "ai-youtube-title-generator.html": {
    meta: "Create viral, click-worthy YouTube video titles with AI. Generate high-CTR title variations for tutorials, vlogs, reviews, and educational videos.",
    og: "Generate high-CTR, viral YouTube video titles and ideas in seconds with our free AI tool."
  },

  // === DEVELOPER & TEXT UTILITIES ===
  "base64-encoder-decoder.html": {
    meta: "Encode text and files to Base64 or decode Base64 strings back to plain text instantly in your browser. 100% private, client-side data handling.",
    og: "Convert strings and binary data to and from Base64 format with fast, private client-side execution."
  },
  "json-formatter.html": {
    meta: "Format, validate, prettify, and minify JSON data online with instant syntax highlighting and error detection. 100% private in-browser tool.",
    og: "Validate, beautify, format, and minify JSON payloads with syntax error detection."
  },
  "markdown-to-html-converter.html": {
    meta: "Convert Markdown text into clean, semantic HTML markup in real time with live side-by-side preview and one-click code copying. 100% private.",
    og: "Transform Markdown syntax into clean, formatted HTML code with live real-time preview."
  },
  "password-generator.html": {
    meta: "Generate strong, secure, random passwords with custom length, symbols, numbers, and uppercase characters. 100% client-side security with zero logging.",
    og: "Create strong, uncrackable random passwords with custom rules and instant client-side entropy."
  },
  "qr-code-generator.html": {
    meta: "Create custom QR codes for website URLs, Wi-Fi networks, text, and contact cards instantly. Download high-resolution PNG or SVG vector QR codes for free.",
    og: "Generate and download custom QR codes for URLs, text, Wi-Fi, and contact details."
  },
  "random-email-generator.html": {
    meta: "Generate realistic mock email addresses for QA testing, software prototyping, demos, and seed databases. 100% private, instant client-side tool.",
    og: "Create random mock email address lists for software testing, forms validation, and developer demos."
  },
  "text-case-converter-cleanup.html": {
    meta: "Convert text case between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and clean up duplicate whitespace and line breaks instantly.",
    og: "Easily convert text case and clean up formatting, whitespace, and capitalization online."
  },
  "url-slug-generator.html": {
    meta: "Convert titles and text into clean, SEO-friendly URL slugs. Automatically removes special characters, trims punctuation, and handles custom delimiters.",
    og: "Generate clean, human-readable, and SEO-optimized URL slugs from headings and text."
  },
  "whatsapp-direct-link-qr-generator.html": {
    meta: "Create direct WhatsApp click-to-chat links and scannable QR codes with pre-filled custom messages. Start chats without saving phone numbers.",
    og: "Generate WhatsApp click-to-chat links and QR codes with custom pre-filled greeting text."
  },
  "word-counter.html": {
    meta: "Count words, characters, sentences, and paragraphs in real time with estimated reading time and speaking speed analysis. Free and 100% private.",
    og: "Real-time word counter, character counter, sentence analyzer, and reading time estimator."
  },

  // === STATIC, POLICY & INFO PAGES ===
  "about.html": {
    meta: "Learn about AfriWidget — a privacy-first platform providing fast, free, browser-based calculators and AI utilities for students, creators, and professionals.",
    og: "Discover the story, mission, and privacy-first design principles behind the AfriWidget platform."
  },
  "contact.html": {
    meta: "Get in touch with the AfriWidget team for support, feature requests, partnership inquiries, or feedback. We welcome your questions and suggestions.",
    og: "Contact AfriWidget support for questions, tool requests, bug reports, and partnership inquiries."
  },
  "faq.html": {
    meta: "Find answers to frequently asked questions about AfriWidget tools, zero-signup privacy, client-side data security, and calculation accuracy.",
    og: "Frequently asked questions about AfriWidget features, data privacy, and online tools."
  },
  "terms.html": {
    meta: "Read the AfriWidget Terms of Service. Review our usage policies, intellectual property terms, and conditions for accessing our free web utilities.",
    og: "AfriWidget Terms of Service, usage agreements, and online tool access policies."
  },
  "privacy.html": {
    meta: "Read the AfriWidget Privacy Policy. Learn how our client-side, in-memory tools protect your privacy with zero data logging and zero tracking.",
    og: "Learn how AfriWidget guarantees user privacy with 100% client-side computing and zero server storage."
  },
  "cookie.html": {
    meta: "Learn about AfriWidget's cookie policy, analytics usage, and how we respect your browser preferences while keeping our free tools accessible to all.",
    og: "AfriWidget cookie policy and transparency regarding browser storage and analytics."
  },
  "disclaimer.html": {
    meta: "Read the AfriWidget disclaimer regarding educational, financial, legal, and health calculators. Calculations are for informational purposes only.",
    og: "Legal, medical, and financial disclaimer for AfriWidget calculations and estimation tools."
  },

  // === FINANCIAL CALCULATORS ===
  "auto-loan-calculator.html": {
    meta: "Calculate monthly car loan payments, total interest, and vehicle amortization schedules based on vehicle price, down payment, trade-in, and loan APR.",
    og: "Calculate monthly auto loan payments, interest costs, and amortization schedules."
  },
  "compound-interest.html": {
    meta: "Calculate compound interest growth on investments and savings. Model regular monthly deposits, annual interest rates, and multi-year compounding periods.",
    og: "Simulate compound interest growth with periodic contributions, annual compounding, and visual charts."
  },
  "debt-payoff-calculator.html": {
    meta: "Compare Debt Avalanche vs. Debt Snowball strategies. Calculate debt payoff dates, total interest saved, and build a monthly debt-free repayment plan.",
    og: "Compare debt snowball and avalanche repayment methods to find your fastest path to becoming debt-free."
  },
  "discount-calculator.html": {
    meta: "Calculate final sale prices, discount savings, and stacked percentage markdowns instantly with sales tax inclusion. Perfect for shopping and budgeting.",
    og: "Calculate discount amounts, final shopping prices, and stacked percentage savings instantly."
  },
  "emergency-fund-calculator.html": {
    meta: "Calculate how much money you need in an emergency savings fund based on your essential monthly living expenses, debt obligations, and target safety months.",
    og: "Determine your ideal emergency fund safety buffer based on monthly expenses and lifestyle needs."
  },
  "estate-inheritance-calculator.html": {
    meta: "Estimate estate distribution and inheritance shares among surviving spouses, children, and heirs based on statutory succession and estate valuations.",
    og: "Calculate inheritance allocations and estate asset distributions across surviving heirs."
  },
  "freelance-hourly-rate-calculator.html": {
    meta: "Calculate your target freelance hourly rate based on desired annual salary, billable hours, business overhead expenses, taxes, and vacation time.",
    og: "Determine the exact freelance hourly and day rate needed to meet your annual income goals."
  },
  "fuel-trip-cost-calculator.html": {
    meta: "Estimate fuel costs and petrol expenses for road trips and commutes based on trip distance, vehicle fuel efficiency (MPG or L/100km), and fuel price.",
    og: "Calculate total trip fuel costs, fuel volume needed, and split travel expenses per passenger."
  },
  "inflation-purchasing-power-calculator.html": {
    meta: "Calculate historical inflation impact and future purchasing power depreciation based on average inflation rates and compound time horizons.",
    og: "Measure how inflation erodes purchasing power over time and calculate real future money value."
  },
  "investment-returns-calculator.html": {
    meta: "Calculate expected investment returns, capital gains, and future portfolio balances with recurring contributions, dividend reinvestment, and ROI.",
    og: "Forecast investment growth and future wealth across stocks, ETFs, mutual funds, and bonds."
  },
  "invoice-generator.html": {
    meta: "Create, customize, and download professional PDF invoices online for free. Add line items, taxes, currency symbols, and discounts with zero signup.",
    og: "Generate and download sleek, professional PDF invoices for clients and freelance projects."
  },
  "loan-repayment-calculator.html": {
    meta: "Calculate personal loan repayments, monthly installments, total interest charges, and loan amortization schedules with extra repayment modeling.",
    og: "Calculate monthly loan installments, total repayment costs, and principal payoff timelines."
  },
  "mortgage-calculator.html": {
    meta: "Calculate monthly mortgage payments (P&I), property taxes, homeowners insurance, and total interest over 15 or 30-year home loan terms.",
    og: "Estimate monthly home mortgage repayments, amortization schedules, and total borrowing costs."
  },
  "net-worth-calculator.html": {
    meta: "Calculate your total net worth by aggregating assets (cash, investments, real estate) and liabilities (mortgages, loans, cards). Track financial health.",
    og: "Calculate your personal net worth and visualize your asset-to-liability financial ratio."
  },
  "overtime-pay-calculator.html": {
    meta: "Calculate overtime earnings, time-and-a-half (1.5x), and double-time (2.0x) pay based on regular hourly wages and extra hours worked per pay period.",
    og: "Calculate time-and-a-half overtime pay, total gross paycheck amounts, and extra hour earnings."
  },
  "percentage-calculator.html": {
    meta: "Calculate percentage increase, percentage decrease, percentage change, and proportions with our versatile, easy-to-use online percentage calculator.",
    og: "Quickly calculate percentage increases, decreases, fractions, and percentage differences."
  },
  "roi-calculator.html": {
    meta: "Calculate Return on Investment (ROI), annualized ROI, and net profit margins across business ventures, real estate deals, and marketing campaigns.",
    og: "Calculate ROI percentage, net profit, and annualized returns on capital investments."
  },
  "salary-tax-calculator.html": {
    meta: "Estimate your net take-home pay from gross annual or hourly salary after income tax, social security contributions, and statutory payroll deductions.",
    og: "Calculate net take-home salary after income taxes, payroll deductions, and national contributions."
  },
  "sales-tax-vat-calculator.html": {
    meta: "Calculate sales tax, VAT, and gross totals. Add or remove tax percentages from net prices instantly with multi-rate calculation options.",
    og: "Add or remove Sales Tax and VAT from prices with instant gross and net breakdowns."
  },
  "savings-goal-calculator.html": {
    meta: "Calculate how much you need to save each month to reach your target savings goal, factoring in initial balance, timeline, and interest rate.",
    og: "Determine required monthly savings contributions to achieve your financial milestones on time."
  },
  "stock-average-calculator.html": {
    meta: "Calculate your average share price when buying stocks or crypto in multiple tranches. Determine dollar-cost averaging (DCA) cost basis accurately.",
    og: "Calculate weighted average purchase price when scaling into stock or crypto positions."
  },
  "tip-split-calculator.html": {
    meta: "Calculate restaurant tip amounts and split bill totals evenly among friends or party members with custom tip percentages and rounding options.",
    og: "Calculate bill tips and split dining costs per person quickly and accurately."
  },
  "website-valuation-calculator.html": {
    meta: "Estimate the market value of your website or online business based on monthly net profit, revenue streams, traffic volume, and industry multiples.",
    og: "Estimate website and digital asset market valuation using revenue and multiple baselines."
  },

  // === HEALTH & WELLNESS CALCULATORS ===
  "bmr-calculator.html": {
    meta: "Calculate your Basal Metabolic Rate (BMR) using Mifflin-St Jeor and Harris-Benedict formulas to find the calories your body burns at complete rest.",
    og: "Calculate daily baseline calories burned at rest using accurate scientific BMR formulas."
  },
  "body-fat-calculator.html": {
    meta: "Estimate your body fat percentage using the US Navy tape measurement method based on waist, neck, hip, and height measurements. Free & private.",
    og: "Estimate body fat percentage and lean body mass using the scientifically validated US Navy formula."
  },
  "calorie-deficit-calculator.html": {
    meta: "Calculate your target daily calorie deficit for healthy, sustainable weight loss based on your maintenance calories, timeline, and target goal.",
    og: "Calculate optimal daily calorie intake and deficit targets for steady weight loss."
  },
  "macro-calculator.html": {
    meta: "Calculate your daily macronutrient targets (protein, carbohydrates, and fats in grams) tailored to muscle building, fat loss, or athletic maintenance.",
    og: "Determine your ideal daily protein, carb, and fat gram ratios based on fitness goals."
  },
  "ovulation-fertility-calculator.html": {
    meta: "Calculate your most fertile days and estimated ovulation window based on your menstrual cycle length. Track peak fertility and cycle phases.",
    og: "Track your fertile window, ovulation date, and conception probabilities based on cycle data."
  },
  "pace-calculator.html": {
    meta: "Calculate running pace, race finish time, or distance for 5K, 10K, half marathon, and full marathon events in minutes per km or minutes per mile.",
    og: "Calculate running splits, target race paces, and estimated finish times across standard distances."
  },
  "pregnancy-due-date-calculator.html": {
    meta: "Calculate your estimated baby due date and pregnancy timeline using your last menstrual period (LMP), conception date, or IVF transfer date.",
    og: "Calculate your baby's estimated delivery date and track key trimester milestones."
  },
  "sleep-calculator.html": {
    meta: "Calculate optimal sleep and wake-up times based on natural 90-minute sleep cycles. Wake up refreshed by timing sleep intervals perfectly.",
    og: "Calculate the best times to fall asleep or wake up aligned with natural 90-minute sleep cycles."
  },
  "tdee-calculator.html": {
    meta: "Calculate your Total Daily Energy Expenditure (TDEE) based on your activity level and BMR. Discover exact daily calorie maintenance needs.",
    og: "Calculate your daily calorie expenditure (TDEE) based on activity level and metabolic rate."
  },
  "water-intake-calculator.html": {
    meta: "Calculate your recommended daily water intake in liters and cups based on body weight, daily exercise duration, and climate conditions.",
    og: "Calculate personalized daily hydration targets based on body weight and activity levels."
  },

  // === EDUCATION, TRADE & UTILITY CALCULATORS ===
  "age-calculator.html": {
    meta: "Calculate exact age in years, months, weeks, days, hours, and minutes from date of birth. Includes countdown to your next birthday.",
    og: "Calculate your precise age in years, months, and days with next birthday countdown."
  },
  "aspect-ratio-calculator.html": {
    meta: "Calculate display aspect ratios (16:9, 4:3, 21:9, 1:1) and resize image and video dimensions proportionally without distortion.",
    og: "Calculate image and video aspect ratios and scale dimensions with locked proportions."
  },
  "bece-aggregate-calculator.html": {
    meta: "Calculate Ghanaian BECE aggregate scores from core and elective subject grades (1-9) for CSSPS Senior High School (SHS) placement.",
    og: "Calculate BECE aggregate points and determine Senior High School placement eligibility."
  },
  "bece-raw-score-converter.html": {
    meta: "Convert BECE raw exam marks into official WAEC 1–9 stanine letter grades and aggregate points for Junior High School students.",
    og: "Convert raw junior high examination marks into WAEC 9-point grading stanines."
  },
  "screen-dpi-calculator.html": {
    meta: "Calculate screen pixel density (PPI / DPI), dot pitch, and aspect ratio from screen resolution and physical diagonal monitor dimensions.",
    og: "Calculate monitor pixel density (PPI/DPI) and display resolution metrics."
  },
  "stair-stringer-calculator.html": {
    meta: "Calculate stair rise, run, stringer length, number of steps, and incline angle conforming to standard residential building codes.",
    og: "Calculate stair stringer dimensions, step rise and run, and code compliance for construction."
  },
  "tile-flooring-calculator.html": {
    meta: "Calculate tile quantities and box counts needed for flooring and wall projects, factoring in room square footage, tile sizes, and waste margins.",
    og: "Calculate total floor tiles, square footage, and extra waste boxes for home renovation."
  },
  "unit-converter.html": {
    meta: "Convert units of length, weight, temperature, area, volume, speed, and time with instant live conversion across metric and imperial systems.",
    og: "Comprehensive unit converter for length, mass, temperature, speed, area, and volume."
  },
  "waec-wassce-grade-calculator.html": {
    meta: "Calculate WASSCE grade points, best-6 aggregate scores, and admission eligibility across WAEC subjects for university entry.",
    og: "Calculate WAEC / WASSCE aggregate scores and grade points for university admissions."
  }
};

let updatedCount = 0;

for (const [file, descObj] of Object.entries(descriptions)) {
  if (!fs.existsSync(file)) {
    console.log(`Warning: ${file} does not exist.`);
    continue;
  }

  let content = fs.readFileSync(file, 'utf8');

  // Replace <meta name="description" content="..." />
  const metaDescRegex = /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i;
  const metaDescRegexAlt = /<meta\s+content=["'][^"']*["']\s+name=["']description["']\s*\/?>/i;

  if (metaDescRegex.test(content)) {
    content = content.replace(metaDescRegex, `<meta name="description" content="${descObj.meta}" />`);
  } else if (metaDescRegexAlt.test(content)) {
    content = content.replace(metaDescRegexAlt, `<meta name="description" content="${descObj.meta}" />`);
  } else {
    // If not found in head, inject under head
    content = content.replace(/<head>/i, `<head>\n  <meta name="description" content="${descObj.meta}" />`);
  }

  // Replace <meta property="og:description" content="..." />
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
  updatedCount++;
}

console.log(`Successfully updated ${updatedCount} pages with high-ranking, bespoke SEO meta descriptions.`);
