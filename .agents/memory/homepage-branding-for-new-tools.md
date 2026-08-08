---
name: Homepage branding for new tools
description: Branding source of truth for newly added AfriWidget generator and utility pages
---

Newly added tool pages should copy the homepage’s gold/yellow AfriWidget branding: `#FACC15` for the logo mark and `Widget` wordmark, with `#CA8A04` for the secondary logo dot. Apply the same treatment to the shared footer on those pages.

**Why:** The homepage is the current brand reference. Reusing older internal-page emerald logo markup made newly added generator pages look inconsistent even when their functional UI used the newer yellow action palette.

**How to apply:** Before adding a tool page, inspect the header and footer logo markup in `index.html`; do not copy the emerald logo literals from legacy calculator pages. Add a page-specific gold override when the shared footer is rendered dynamically.