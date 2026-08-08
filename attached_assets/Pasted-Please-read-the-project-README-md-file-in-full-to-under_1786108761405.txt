Please read the project README.md file in full to understand site conventions before taking any action. 

Build 5 lightweight, client-side utility tools to expand the AfriWidget platform:

TOOLS TO BUILD:
1. QR Code Generator (supports URLs, plain text, and Wi-Fi credentials with live canvas render & PNG download)
2. Loan Calculator (calculates monthly payments, total interest, and loan amortization preview)
3. Savings Calculator (calculates compound interest, total deposits, and projected growth over time)
4. Real-Time AI Currency Converter (supports global fiat currencies with instant conversion and fallback rates)
5. ICASS Calculator (calculates weighted Internal Continuous Assessment scores for TVET/vocational students)

DYNAMIC CONTENT & AI ARCHITECTURE:
- DO NOT hardcode static educational text directly into HTML files. 
- For each tool, store the text content in a separate, unique Markdown (.md) file (e.g., /content/qr-generator.md) and load/render it dynamically via JavaScript at runtime.
- Content in each .md file must be 100% unique, well-structured, and tailor-written for that specific tool.

DESIGN & TECHNICAL STANDARDS:
- BACKGROUND: Use a clean light or slate theme. DO NOT use a solid black background.
- UI ACCENTS: Use bright yellow CTA buttons ("Generate", "Calculate", "Convert", "Download") and subtle borders.
- PRIVACY BADGE: Include header tag "⚡ 100% Free • No Signup • Private In-Browser Tool".
- EXECUTION: 100% client-side execution with Vanilla JavaScript. Zero page reloads or server backend dependencies.
- ANALYTICS & ADSENSE: Ensure BOTH the standard Google Analytics script tag AND the Google AdSense code snippet are present inside the <head> section on all 5 new pages and verified across existing pages.

ADSENSE & SEO RULES:
- WORD COUNT: Each tool's corresponding .md content file must contain 800+ words of helpful educational guide content, detailed usage steps, financial/academic explanations, and an FAQ accordion section.
- NO DUPLICATES: Audit existing site files and sitemaps first to confirm these exact filenames and tool concepts do not duplicate any existing tools on the platform.

INTEGRATION & HOMEPAGE PLACEMENT:
- Place each tool card into its appropriate category section on the homepage (e.g., Financial Tools, Productivity, Education).
- Wire all completed pages into the main tools directory, category hubs, footer, sitemap.xml, and llms.txt.
