---
name: Homepage performance boundary
description: AfriWidget homepage rules for static crawlability, performance, and URL consistency
---

The homepage must keep its complete navigation, tool matrix, explanatory copy, FAQ, footer, and cookie banner in raw HTML. Homepage JavaScript should only enhance search, filters, accordion behavior, consent, and the mobile menu; it must not inject or replace crawl-critical content. Analytics is non-critical and should load after the page becomes interactive.

**Why:** Replacing static regions after load reduced rendered-content visibility for crawlers and added unnecessary main-thread/network work.

**How to apply:** Preserve source-visible content, avoid adding shared injection scripts to `index.html`, keep internal links on extensionless final URLs, and maintain a direct clean-URL rewrite for deployment.

Static enhancement scripts must remain non-blocking: optional PDF/QR libraries and local enhancement scripts should use deferred loading where their execution order is preserved. Tailwind CDN is the exception and must remain blocking because it generates the page's critical utility CSS before first paint. Netlify should cache versionless static CSS, JavaScript, and favicon assets with stale-while-revalidate.

**Why:** The site has no build pipeline, so network scheduling and browser caching are the safest broad performance levers that do not risk changing raw SEO content or calculator behavior. Deferring Tailwind caused a visible flash of unstyled/raw HTML.

**How to apply:** Keep above-the-fold markup in HTML, do not defer required inline logic ahead of its dependencies, and validate representative routes after changing script loading or cache headers.