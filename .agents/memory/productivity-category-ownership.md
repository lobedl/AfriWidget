---
name: Productivity category ownership
description: The newer yellow Productivity hub owns both productivity and developer utilities
---

The yellow `/productivity` page is the single public category hub for work, writing, SEO, developer, file, and communication utilities. The former `/tech-tools` and `/tech-tool` category routes are legacy aliases that redirect to `/productivity`.

`tools-index.json` is the primary-category registry. Every registry tool must appear exactly once as a `tool-card-lg` on its matching static category page. Homepage features, search, favorites, and related recommendations may still link across categories, but any displayed category label must match the registry.

**Why:** Static HTML and the search catalog mirror the same tools; keeping one primary assignment prevents duplicate hub listings and inconsistent category counts.

**How to apply:** Update the registry and one matching category page together, then run `npm run validate:categories` (also called by the build and deploy scripts). Add new browser utility tools to `/productivity`. Do not recreate a separate tech category or add `/tech-tools` back to sitemap, LLM discovery, footer categories, or homepage sections.