---
name: Groq Netlify key handling
description: Groq AI runs through the Netlify serverless function and supports flexible environment variable naming, quote cleanup, and model fallbacks
---

The Groq integration is serverless (`/.netlify/functions/groq-proxy`). The Netlify function dynamically scans `process.env` for any key matching `GROQ` (e.g. `GROQ_API_KEY`, `GROQ_KEY`, `GROQ_API_TOKEN`, `GROQ_SECRET`, `GROQ_API_KEY_1`..`10`), automatically strips quotes and whitespace, dynamically discovers active models via the Groq models API (`/openai/v1/models`), and uses production model fallbacks (`openai/gpt-oss-120b`, `openai/gpt-oss-20b`, `qwen/qwen3.6-27b`, `groq/compound`, etc.).

**How to apply:** Keep credentials in Netlify Environment Variables (`GROQ_API_KEY`), never in client HTML/JS. Always trigger a clear-cache redeploy on Netlify after adding or updating keys.
