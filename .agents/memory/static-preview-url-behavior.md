---
name: Static preview URL behavior
description: Local preview routing behavior for the static server
---

The configured static server and Netlify deployment serve extensionless clean URLs directly from matching HTML files. Netlify also carries explicit permanent redirects for the deleted legacy Technology routes (`/tech-tool` and `/tech-tools`, with and without `.html`) to `/productivity`; the local `serve` preview does not interpret `_redirects`, so those paths return local 404s.

**Why:** A successful page check can look empty if a client does not follow the redirect, even though the preview is healthy and the content is served at the redirected URL.

**How to apply:** When validating served HTML, use `/` for the homepage or clean `/page` routes and expect direct `200` responses. Keep canonicals, sitemap entries, LLM links, structured data, raw HTML links, and new internal links extensionless. Do not restore `.html` aliases, trailing-slash rules, or clean-to-`.html` rewrites. Treat legacy Technology redirects as a Netlify-only production behavior.

**Why:** Netlify Pretty URLs already resolve `/page` to `page.html`; the explicit legacy redirects preserve old inbound links without reintroducing duplicate 200 pages. The local static server ignores `_redirects`, so production and preview results differ for those retired aliases.