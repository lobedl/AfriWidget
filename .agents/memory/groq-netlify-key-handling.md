---
name: Groq Netlify key handling
description: Groq AI runs through the Netlify serverless function and supports flexible environment variable naming, quote cleanup, and model fallbacks
---

The Groq integration is serverless (`/.netlify/functions/groq-proxy`). The Netlify function dynamically scans `process.env` for any key matching `GROQ` (e.g. `GROQ_API_KEY`, `GROQ_KEY`, `GROQ_API_TOKEN`, `GROQ_SECRET`, `GROQ_API_KEY_1`..`10`), automatically strips quotes and whitespace, and applies model fallbacks (`llama-3.3-70b-versatile`, `llama-3.1-8b-instant`, `mixtral-8x7b-32768`).

**How to apply:** Keep credentials in Netlify Environment Variables (`GROQ_API_KEY`), never in client HTML/JS. Always trigger a clear-cache redeploy on Netlify after adding or updating keys.
