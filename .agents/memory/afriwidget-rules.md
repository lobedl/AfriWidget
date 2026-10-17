---
name: AfriWidget architecture mandates
description: Hard rules the user has written down for AfriWidget — must be respected on every change
---

`AGENT_GUARDRAILS.md` is the current repository guardrail file; do not rely on the older `REPLIT_RULES.md` reference, which is not present. The project-wide constraints recorded here remain in force:

1. **Zero dependencies** — no React, Vite, Next.js, npm packages, package.json, Express, PostgreSQL, or Prisma. Root contains only `.html`, `.css`, `.js` files.
2. **Raw HTML content** — `index.html` ≥ 1,200 words, every category/policy/tool page ≥ 800 words, all in plain markup (no SPA shell). Validate word counts after stripping tags and scripts; View Page Source must show full text.
3. **Tailwind via CDN only** — `<script src="https://cdn.tailwindcss.com"></script>` in every `<head>`. Calculators use vanilla JS DOM.
4. **Static server only** — `npx --yes serve . -p 3000` or `python3 -m http.server 3000`. Never a prompting/interactive CLI.
5. **Scroll-to-top on every page** — `window.addEventListener('DOMContentLoaded', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });` before `</body>`.

6. **SEO_RULES.md** — every new page must follow the canonical template in `SEO_RULES.md`: exactly one canonical, OG tags, Twitter Card tags, two JSON-LD blocks (main schema + BreadcrumbList), added to `sitemap.xml`.
7. **og-image.png** — referenced by all 26 pages; does not exist yet (placeholder).
8. **Navigation and sitelinks** — primary category/tool anchors should use descriptive raw HTML labels consistently; homepage carries the `SiteNavigationElement` map.
9. **Tool-page content depth** — calculator and utility pages should explain their own inputs, method, example, interpretation, limitations, and FAQs; shared footer/legal copy is acceptable repetition.
10. **Homepage branding is the source of truth for new tools** — use the gold/yellow logo mark (`#FACC15`), secondary dot (`#CA8A04`), and `Widget` wordmark on newly added generator pages and their shared footer.

**Why:** Google AdSense approval requires pre-rendered text in raw HTML; no framework can intercept that requirement.
**How to apply:** Check these rules before adding any file, package, or workflow change to AfriWidget.

For dropdown-based calculators, validate that a selection is non-empty before numeric conversion; JavaScript `Number('')` becomes `0` and can incorrectly look like a valid result.

**Why:** Aggregate calculators initially treated untouched select fields as zero-point grades until the empty-value guard was added.

**How to apply:** Filter `input.value !== ''` before mapping grade or option values to numbers in any new static calculator.

AfriWidget should use a broad-library plus focused-hub strategy: keep general calculators for reach, while making African admissions and academic planning the strongest internal-link cluster.

**Why:** The site can capture broad utility searches without losing differentiation or topical authority around WASSCE, BECE, GPA, and school-admission planning.

**How to apply:** Add new academic/admissions tools to the admissions hub, Education page, homepage, All Tools directory, footer, navigation, and sitemap; do not remove unrelated utility categories solely for positioning.

Country-specific admission scores must be presented as planning estimates unless the current official institution formula is verified.

**Why:** JAMB, WASSCE, APS, KCSE, and KUCCPS rules can differ by institution, programme, and application cycle; a transparent supplied formula should not be presented as a guaranteed official result.

**How to apply:** Show the exact formula and comparison direction, reject incomplete inputs, label sample cut-offs and eligibility statuses as estimates, and direct users to current official requirements.

Client-side result sharing should use query parameters and a shared adapter module, not persistence or a backend.

**Why:** AfriWidget is intentionally dependency-free and static; share links must recreate inputs and calculations entirely in the browser.

**How to apply:** Add the shared script to each calculator, serialize inputs into the URL, restore and recalculate on load, use Web Share on mobile, and use clipboard plus a toast on desktop.

Brand structured data should identify AfriWidget through a linked Organization and WebSite entity, without personal identity metadata.

**Why:** Search engines need a stable publisher identity while the project intentionally avoids personal developer names and profile links.

**How to apply:** Keep the homepage Organization `@id` and WebSite `publisher` relationship aligned, use only confirmed official brand channels in `sameAs`, and scan all HTML for author, Person, or Founder markup after SEO changes.

Static crawler guidance belongs in root-level text files.

**Why:** The static server exposes root files directly, allowing AI crawlers and search crawlers to discover site summaries without application code.

**How to apply:** Keep `llms.txt` plain Markdown at `/llms.txt`, include primary tool URLs and concise descriptions, and reference it from `robots.txt` alongside the sitemap.

Heading hierarchy should follow meaningful document structure rather than forcing every page to contain H4. Each page should have one H1, major sections should use H2, subsections H3, and deeper headings only when content is genuinely nested. Shared footer navigation headings are a separate landmark and do not need to be promoted or padded.

**Why:** An audit found that artificial H4 headings would add noise, while a small number of H1-to-H3 jumps were genuine semantic errors worth fixing.

**How to apply:** Audit the main document content after SEO edits, excluding scripts, styles, and the footer; fix real level jumps and preserve useful compact page structures.

Eligibility baselines must carry provenance and confidence: use exact programme-level values when an official table publishes them, and label generated or institution-level values as dated planning estimates with a source link.

**Why:** African universities publish a mix of programme cut-offs, minimum entry requirements, subject clusters, and annual selection lists; presenting all of them as permanent official departmental thresholds would be misleading.

**How to apply:** Keep academic-year context and official source URLs beside each institution profile, show the basis in the result, and never promise a universal accuracy percentage without current programme-level evidence.

Productivity utilities should be discoverable from the relevant category hub, homepage, All Tools directory, shared navigation/footer, `llms.txt`, and sitemap, not only from their standalone pages.

**Why:** AfriWidget’s static architecture has no dynamic discovery layer; internal links are the crawlable product directory and the main route for returning users.

**How to apply:** When adding a utility page, add descriptive raw-HTML links to the appropriate hub and homepage/tool directory, then update shared labels and crawler files in the same change.
