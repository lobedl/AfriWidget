---
name: Google favicon consistency
description: Durable favicon markup convention for AfriWidget search appearance
---

Every public HTML page should expose the same externally hosted square favicon assets, including `/favicon.ico` and a 32×32 PNG. Avoid inline data-URI favicon declarations or page-specific competing icons.

**Why:** Search engines need a stable, crawlable favicon URL and can choose unpredictably when pages have missing, inline, or conflicting favicon declarations.

**How to apply:** When adding or editing a page head, preserve the shared external favicon set and verify the declared asset URLs return successfully from the deployed site.