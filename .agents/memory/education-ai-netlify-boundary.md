---
name: AI deployment boundary
description: How the site-wide AI assistant behaves across Replit preview and Netlify
---

The site-wide AI client is intentionally safe without a running serverless endpoint: it shows the configured fallback message when the Netlify function or Groq keys are unavailable. The live AI path is the shared Netlify proxy, where Groq keys remain server-side.

**Why:** The existing Replit workflow is a static file server and cannot execute Netlify Functions; treating that as an error would break the static preview or expose credentials.

**How to apply:** Keep the shared browser assistant pointed at the Netlify proxy path, configure `GROQ_KEY_1` through `GROQ_KEY_5` only in Netlify, preserve fallback behavior for local/static previews, and mark AI requests/responses `no-store`. Use one five-question rolling quota across all tool categories; automatic insights never consume it.

AI responses must not be cached: the browser request uses `cache: 'no-store'`, and the proxy sends `Cache-Control: no-store` with legacy no-cache headers.

**Why:** AI output is generated from the current tool inputs and follow-up question; serving an older response would be incorrect and could expose one user's contextual answer to another cache consumer.

**How to apply:** Preserve the no-store settings whenever the AI client or Netlify proxy is refactored. Do not add AI endpoint caching to broad static asset cache rules.

Only the shared realtime assistant may provide AI guidance. Calculator pages and informational copy must not include locally generated, hardcoded, or static-looking AI responses; when the endpoint is unavailable, show an explicit availability message instead.

**Why:** Mixing deterministic calculator prose with live AI output makes it unclear whether a response was generated remotely and undermines the site's realtime-only contract.

**How to apply:** Route automatic insights and follow-up questions through `universal-ai.js` and the Netlify proxy. Keep compatibility scripts inert or remove them, and describe AI features as optional realtime guidance.

Realtime AI responses should explain the displayed result, why it matters, and one or two realistic next steps in warm, plain language. Apply stronger safety boundaries for health, finance, and education instead of giving generic advice.

**Why:** Users need actionable guidance grounded in their actual calculator output, while sensitive categories require careful limits around diagnosis, financial recommendations, and admissions guarantees.

**How to apply:** Keep the response prompt at roughly 3–5 short sentences, use the supplied result and inputs, acknowledge missing context, and tailor safe actions by category.