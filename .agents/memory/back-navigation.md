---
name: Native browser back behavior
description: AfriWidget delegates Back navigation and scroll restoration to the browser or device
---

Do not add a custom Back link, custom history stack, scroll-position store, or page-load scroll-to-top handler. Let browser/device history own navigation and native scroll restoration.

**Why:** Visitors expect the device or browser Back action to return them to the exact prior page position, and competing JavaScript restoration systems can reset that position or create flicker.

**How to apply:** Keep navigation links focused on moving forward through the site. Preserve only intentional user-triggered scrolling, such as scrolling to a calculator result or an explicitly selected section.