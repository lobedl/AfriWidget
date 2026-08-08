---
name: Groq Netlify key handling
description: Groq AI runs through the Netlify function and supports a preferred singular key plus numbered fallbacks
---

The Groq integration is serverless rather than a local Node server. The Netlify function reads `process.env.GROQ_API_KEY` first, then supports numbered `GROQ_API_KEY_1` through `GROQ_API_KEY_5` and legacy `GROQ_KEY_1` through `GROQ_KEY_5`.

**Why:** The Replit preview workflow only serves static files and does not execute Netlify Functions, so its logs cannot prove a live Groq authentication request. Adding dotenv or a local backend would conflict with the static-only architecture.

**How to apply:** Keep credentials in the deployment environment, never in HTML or browser JavaScript. Test the proxy module and fallback behavior without logging key values; verify live authentication after deploying the Netlify function with the environment variable configured.