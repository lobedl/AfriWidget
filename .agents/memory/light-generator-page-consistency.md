---
name: Light generator page consistency
description: Shared light content-surface rule for homepage-branded static generator pages
---

Homepage-branded generator pages keep the shared dark/gold navigation, hero, and footer branding, but their body and main content use the same light surface as the established internal tool pages.

**Why:** A dark full-page canvas made the new tools visually inconsistent with the rest of AfriWidget. A light main surface also keeps article copy and form controls readable on mobile.

**How to apply:** When adding or restyling a homepage-branded generator, add the `light-generator` body class. Keep dark brand chrome, and preserve the scoped shared overrides that turn main cards, controls, generated output, borders, and text into light-page equivalents. Long-form writing pages also use their raw article marker as a styling hook because some legacy pages are compressed into single-line HTML.