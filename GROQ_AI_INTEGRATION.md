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

## Netlify setup

1. Deploy the repository to Netlify.
2. In Netlify, open **Project configuration → Environment variables**.
3. Add the active key using this preferred name:
   - `GROQ_API_KEY`

   The proxy also supports numbered fallback keys using either naming
   convention:
   - `GROQ_API_KEY_1`
   - `GROQ_API_KEY_2`
   - `GROQ_API_KEY_3`
   - `GROQ_API_KEY_4`
   - `GROQ_API_KEY_5`

   Existing deployments may continue using:
   - `GROQ_KEY_1`
   - `GROQ_KEY_2`
   - `GROQ_KEY_3`
   - `GROQ_KEY_4`
   - `GROQ_KEY_5`
4. Redeploy after changing environment variables.

The function checks `process.env.GROQ_API_KEY` first, then tries configured
numbered keys in order. Blank values are ignored and duplicate values are
deduplicated. If a request fails because of a quota, transient error, or
unavailable key, it quietly tries the next key. On initialization, the
function logs only how many credential sources are configured; it never logs
key values.
Keys are never placed in HTML or browser JavaScript. The proxy uses Groq model
`llama-3.3-70b-versatile` for every category.

## Local preview

The Replit static preview does not run Netlify Functions, so it will show the
same no-key fallback message until the site is deployed with the function and
environment variables. This keeps the static preview safe and functional
without exposing credentials.