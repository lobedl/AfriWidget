---
name: Responsive output safety
description: Mobile layout safeguards for generated values on AfriWidget tool pages
---

Generated tool output must be allowed to wrap at arbitrary characters, especially for long numbers, URLs, JSON, XML, passwords, and identifiers. Keep document-level horizontal overflow hidden, preserve `min-width: 0` on grid/flex children, and make preformatted output wrap instead of forcing a horizontal viewport.

**Why:** Static calculator pages receive unpredictable user-generated values, and one unbroken result can widen the document beyond a phone viewport even when the surrounding layout is responsive.

**How to apply:** Put shared overflow rules in `branding.css`, then add a page-specific override when a tool intentionally renders specialized output. Do not solve a result overflow by adding a page-wide horizontal scrollbar.