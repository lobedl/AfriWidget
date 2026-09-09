# AfriWidget

Free, privacy-first calculators and utility tools for health, finance, and education. Designed for Africa and the world. 100% static — no backend, no database, no build step.

## Run & Operate

- **Start the server:** the `AfriWidget` workflow runs automatically (`npx --yes serve . -p 3000`)
- **Edit content:** open any `.html` file directly in the root directory

## Stack

- Pure HTML + Tailwind CSS (via CDN: `https://cdn.tailwindcss.com`)
- Vanilla JavaScript (inline `<script>` in each page)
- Static file server: `serve` (via npx, no install required)

## Pages

| File | URL |
|------|-----|
| `index.html` | `/` — Home page (1,200+ words) |
| `health.html` | `/health.html` — Health & Wellness category |
| `finance.html` | `/finance.html` — Finance & Wealth category |
| `education.html` | `/education.html` — Education & Academics category |
| `bmi-calculator.html` | `/bmi-calculator.html` — BMI / BMR / TDEE calculator |
| `compound-interest.html` | `/compound-interest.html` — Compound interest calculator |
| `gpa-calculator.html` | `/gpa-calculator.html` — GPA calculator |
| `about.html` | `/about.html` — About page |
| `contact.html` | `/contact.html` — Contact page |
| `privacy-policy.html` | `/privacy-policy.html` — Privacy policy |
| `terms.html` | `/terms.html` — Terms of service |
| `adsense-disclaimer.html` | `/adsense-disclaimer.html` — AdSense disclaimer |
| `cookie-policy.html` | `/cookie-policy.html` — Cookie policy |

## Architecture

- No build step, no dependencies, no package.json
- Tailwind CSS loaded from CDN in the `<head>` of every page
- All calculator logic is inline vanilla JS
- Cookie consent stored in `localStorage`
- Most calculations run client-side. Every tool page can use the site-wide AI assistant through the Netlify Groq proxy documented in `GROQ_AI_INTEGRATION.md`; the Replit static preview safely falls back when that function is unavailable, and the browser never receives a Groq key.

## User preferences

- Static-only: never add a backend, database, or build pipeline
- All pages must include Tailwind CSS via CDN
- Content lives directly in raw HTML markup (no templates, no SSG)
- New homepage-branded generators keep the dark/gold navigation, hero, and footer while using the shared light internal-page content surface for consistency
- See **`REPLIT_RULES.md`** in the project root for the full mandatory architecture spec (AdSense, word counts, scroll-to-top, server command, etc.)
- See **`AGENT_GUARDRAILS.md`** before changing shared page markup or calculator result layouts.
