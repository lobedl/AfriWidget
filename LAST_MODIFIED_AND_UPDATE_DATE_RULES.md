# AfriWidget Last Modified & Page Update Date Rules

This document defines the strict rule and synchronization mandate for maintaining last-modified dates across all AfriWidget pages, tools, and `sitemap.xml`.

---

## 1. Core Mandate

Whenever **any** tool, utility, category hub, informational page, policy document, or homepage receives **any** update — including:
- Bug fixes, calculation logic improvements, or code modifications
- Educational copy, guide, example, or FAQ additions/corrections
- Schema.org structured data adjustments (JSON-LD)
- Meta tags, titles, OpenGraph, or Twitter Card updates
- Navigation links, breadcrumbs, related tools, or redirect destination updates

**The last update date MUST be updated to the exact date of change (YYYY-MM-DD) both on the page and in `sitemap.xml` strictly.**

---

## 2. Synchronization Requirements

Every page update requires updating three synchronized date layers:

### A. Visible On-Page Timestamp
Every tool page and content article displays a visible update stamp in the header or SEO meta block:
```html
<div class="seo-meta">Last Updated: <span>5 October 2026</span></div>
```
- **Format**: `D Month YYYY` (e.g., `5 October 2026` or `12 November 2026`).
- **Rule**: Must reflect the calendar date on which the file was modified. Never leave a stale historical date when making functional or textual edits.

### B. Schema.org JSON-LD `dateModified`
If the page includes a `dateModified` property in its structured data (`WebPage`, `WebApplication`, `TechArticle`, or `Article`):
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "...",
  "url": "https://afriwidget.com/example-tool",
  "dateModified": "2026-10-05"
}
```
- **Format**: ISO 8601 date `YYYY-MM-DD` (e.g., `2026-10-05`).
- **Rule**: Must match the calendar date of the update and align precisely with the visible on-page date.

### C. XML Sitemap `<lastmod>` Timestamp
In `/sitemap.xml`, locate the corresponding `<url>` block for the page:
```xml
  <url>
    <loc>https://afriwidget.com/example-tool</loc>
    <lastmod>2026-10-05</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
```
- **Format**: W3C Datetime / ISO 8601 date `YYYY-MM-DD` (e.g., `2026-10-05`).
- **Rule**: Update `<lastmod>` to the exact date of change strictly.

---

## 3. Why This Is Mandatory (SEO & Crawl Impact)

1. **Recrawl Prioritization**: Search engines (Googlebot, Bingbot) use `<lastmod>` in XML sitemaps to prioritize recrawling frequency. Stale dates mean search bots delay crawling improvements, bug fixes, and schema corrections.
2. **Single Story of Truth**: Search engines cross-validate the `<lastmod>` tag against on-page visible dates and Schema.org `dateModified`. When the sitemap, structured data, and visible text agree, search engines trust the timestamp and re-index promptly.
3. **No Blanket/Stagnant Uniform Resets**: Do not run a blanket script that sets every URL in `sitemap.xml` to today's date if those pages were not modified. Search engines penalize false blanket updates. Only pages that have genuinely been updated must receive the current revision date. Unmodified pages must keep their valid prior timestamp.

---

## 4. Developer & Agent Workflow Checklist

When modifying any page or tool:

1. [ ] **Implement Changes**: Complete code, styling, content, or schema adjustments.
2. [ ] **Determine Current Date**: Note today's date in `YYYY-MM-DD` and `D Month YYYY`.
3. [ ] **Update On-Page Visible Date**: Change `Last Updated: <span>[date]</span>` to today's date.
4. [ ] **Update JSON-LD `dateModified`**: If present in the `<script type="application/ld+json">`, update `"dateModified": "YYYY-MM-DD"`.
5. [ ] **Update `sitemap.xml`**: Locate `<loc>https://afriwidget.com/[slug]</loc>` and set `<lastmod>YYYY-MM-DD</lastmod>`.
6. [ ] **Validate**:
   - Ensure `sitemap.xml` remains valid XML (no broken tags or malformed dates).
   - Verify served page returns HTTP 200 and renders the updated timestamp.
   - Run `npm run lint` and `npm run build` to verify clean compilation.
