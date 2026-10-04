---
name: AI writing tools boundary
description: How AfriWidget writing pages remain useful in static preview without exposing AI credentials
---

Career, Business, and Freelance writing tools should generate an immediate browser-local draft, then optionally replace it with a response from the shared Netlify/Groq proxy. The browser must never receive a provider key, and a failed proxy request must leave the local draft visible with a clear status message. Specialist prompts should preserve supplied facts for product copy, gig descriptions, paraphrasing, and summaries rather than inventing claims.

**Why:** The Replit workflow is a static file server and cannot execute Netlify Functions, while production AI generation must keep provider credentials server-side.

**How to apply:** Keep writing requests on the shared proxy path, use `mode: writing` with the productivity category, preserve `no-store` behavior, and keep every draft editable so users can correct facts before sending or publishing. New writing pages should add a local fallback, specialized form controls, and a tool-specific proxy instruction.