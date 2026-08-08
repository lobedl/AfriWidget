---
name: Mobile navigation state
description: Durable constraint for AfriWidget’s static mobile navigation behavior
---

Every page’s mobile navigation must be closed on initial render and open only after the hamburger control is activated.

**Why:** AfriWidget has many standalone HTML pages with inconsistent page-level menu styles and legacy click handlers. A page can otherwise expose the full menu over the page before any user interaction.

**How to apply:** Keep the shared navigation script’s closed-by-default CSS safeguard and accessible toggle behavior in place when adding or editing pages. Do not assume every page has the same inline `.mobile-menu` rule.