---
name: Last-modified and update date synchronization
description: Mandatory rule to strictly synchronize visible page dates, Schema.org dateModified, and sitemap.xml lastmod timestamps whenever a tool or page is updated
---

Whenever any tool, category hub, informational page, policy document, or homepage is modified (code fixes, content updates, schema fixes, meta tags, or redirect updates), its last update date MUST be updated to the exact date of change strictly:

1. **On the Page (Visible)**: Update `<div class="seo-meta">Last Updated: <span>D Month YYYY</span></div>` to the exact date of change.
2. **On the Page (Schema.org)**: Update `"dateModified": "YYYY-MM-DD"` in the JSON-LD block if present.
3. **In `sitemap.xml`**: Update the page's `<lastmod>YYYY-MM-DD</lastmod>` tag for its canonical `<loc>` URL to the exact date of change.

**Why:** Googlebot and Bingbot cross-reference sitemap `<lastmod>` values against on-page visible dates and structured data. Synchronized, accurate timestamps tell search engines a single story of truth, ensuring modified tools and retired paths are prioritized for crawling and indexing without stale caching or uniform date penalties.

**How to apply:** When creating or editing any tool or page, check the current date, update the visible `Last Updated` date and JSON-LD `dateModified`, update the corresponding `<url>` entry in `sitemap.xml`, and verify valid XML and HTTP 200 responses before completing the task.
