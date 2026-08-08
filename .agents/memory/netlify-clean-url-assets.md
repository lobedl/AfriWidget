---
name: Netlify clean URL assets
description: Asset loading requirements for static pages served at Netlify clean URLs
---

Netlify clean URLs can be exposed with trailing-slash resolution, causing relative paths such as `nav.js` to request `/page/nav.js` instead of the root asset. Shared scripts and styles must therefore be reachable through root-safe URLs or explicit Netlify rewrites.

**Why:** A page can return successfully while its shared navigation script fails to load, making injected controls such as Back disappear only in production.

**How to apply:** When adding shared static assets to clean-URL pages, use root-safe references or preserve explicit `/*/asset /asset 200` Netlify rewrite rules. Test both the page URL and the nested asset URL before redeploying.