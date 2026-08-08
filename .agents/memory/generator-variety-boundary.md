---
name: Generator variety boundary
description: How AfriWidget's local random and writing generators should avoid repetitive output
---

Random generators should use multiple composition patterns, sufficiently broad local word pools, and uniqueness checks within each batch. Shared handlers must replace or disable legacy inline handlers before attaching submit and copy behavior.

**Why:** Small fixed vocabularies and one-template combinations made repeated generation feel generic even when `Math.random()` was present. Duplicate event handlers could also replace fresh output or reload the page.

**How to apply:** Keep generator output local and deterministic in structure but varied in phrasing, preserve existing controls and copy actions, prevent native form submission, and use style/type controls where users need meaningful variation.