# AfriWidget AI Assistant

AfriWidget's AI assistant is active site-wide across the tool pages in the
Health, Education, Finance, Productivity, Webmaster/SEO, and general utility
categories. The browser calls the Netlify function at
`/.netlify/functions/groq-proxy`; it never receives a Groq key. The legacy
`/.netlify/functions/education-ai` path remains as a compatibility alias.

## Site-wide behavior

- The AI panel is completely hidden on page load.
- After a valid tool result is generated, the panel reveals itself below the
  result and requests an automatic two-sentence insight.
- Automatic insights are unlimited and never reduce the custom-question quota.
- Follow-up questions are available below the insight.
- A single browser-wide `localStorage` window allows 5 custom questions per
  rolling 24-hour period across every AfriWidget tool.
- The panel shows `X / 5 questions left`, a live reset countdown, and disables
  the input when the quota is reached.
- Health, Education, Finance, Productivity, and General Tools use different
  category context in the server-side system prompt.

The Replit preview remains safe and functional when the Netlify function or
Groq keys are unavailable; it displays **AI insights will be available soon.**

## Netlify setup & Groq API Key Configuration

1. Deploy the repository to Netlify.
2. In Netlify, open **Site configuration → Environment variables** (or **Build & deploy → Environment**).
3. Add your Groq API Key (starts with `gsk_...`).

### Supported Environment Variable Names
The proxy automatically scans Netlify environment variables for any of the following names:
- `GROQ_API_KEY` (Recommended)
- `GROQ_KEY`
- `GROQ_API_TOKEN`
- `GROQ_TOKEN`
- `GROQ_SECRET`
- `GROQ_API_KEY_1` through `GROQ_API_KEY_10`
- `GROQ_KEY_1` through `GROQ_KEY_10`
- Any variable containing `GROQ` in its name (case-insensitive)

### Key Formatting & Resilience
- **Automatic Quote & Space Cleanup**: Surrounding quotes (`"gsk_..."` or `'gsk_...'`) and accidental leading/trailing spaces are automatically stripped during function execution.
- **Deduplication**: Duplicate key values are automatically removed.
- **Model Fallbacks**: The proxy attempts requests with `llama-3.3-70b-versatile` first. If rate-limited or busy, it automatically tries `llama-3.1-8b-instant` and `mixtral-8x7b-32768`.
- **401 Invalid Key Detection**: If a key receives a `401 Unauthorized` response from Groq, it logs a warning in Netlify Function Logs and skips to the next key.

4. **Trigger a New Deploy**:
   After setting or updating your environment variable in Netlify, go to **Deploys → Trigger deploy → Clear cache and deploy site** to ensure Netlify Functions receive the new environment variables.

5. **Verify Netlify Function Logs**:
   In Netlify, navigate to **Logs → Functions → groq-proxy** to inspect live initialization and request status codes.

## Local preview

The Replit static preview does not run Netlify Functions, so it will show the
same no-key fallback message until the site is deployed with the function and
environment variables. This keeps the static preview safe and functional
without exposing credentials.