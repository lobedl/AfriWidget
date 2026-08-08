---
name: Developer utility batch pattern
description: Durable workflow for adding lightweight static developer tools without duplicate routes.
---

Audit filenames, catalog links, sitemap entries, and shared footer links before creating a new utility. If a matching canonical page already exists, enhance that page in place rather than creating a second route. New tools should remain standalone HTML with raw educational content, browser-only transformation logic, copy/download controls where useful, Analytics at the top of the head, and the shared privacy badge.

**Why:** The platform is a static SEO-driven directory, so duplicate concepts split discoverability and create inconsistent tool experiences.

**How to apply:** For each new batch, identify canonical existing pages first, then update those pages and wire only missing routes into the homepage, category hub, All Widgets directory, footer, sitemap, and `llms.txt`.

For HTML minification, remove safe HTML/CSS/JavaScript comments and formatting whitespace, but preserve quoted strings, protected text blocks, JSON-LD, selectors, class names, and CSS property names. Renaming identifiers is obfuscation and needs reference-aware rewriting.

**Why:** Generic identifier renaming can silently break CSS selectors, JavaScript references, templates, and accessibility hooks.

**How to apply:** Keep the inline asset-minification option enabled for comments/whitespace cleanup; use a dedicated build tool for advanced identifier mangling.

The health catalog already uses `bmi-calculator` as the canonical combined BMI/BMR/TDEE page; future BMI or BMR requests should enhance and link that route rather than create separate duplicates unless the product decision explicitly changes.

**Why:** BMI and BMR are intentionally presented together in the existing health experience and sitemap.

**How to apply:** Add new health metrics as separate routes only when the concept is missing, and keep the combined BMI/BMR route discoverable across health catalogs.

The health catalog uses `water-intake-calculator` as the canonical daily water tool; hydration scheduling is a separate concept and belongs on its own reminder route.

**Why:** A water-goal estimator and a time-based reminder schedule serve different user tasks, while a second water estimator would split SEO and maintenance.

**How to apply:** Enhance the existing Water Intake page for calculation improvements, and reserve separate routes for scheduling or notification-oriented workflows.