# AfriWidget AI Insights — Cloudflare Pages & Groq Setup

AfriWidget provides automatic, real-time AI explanations for tool calculations. The endpoint is natively served by Cloudflare Pages at `/api/ai-insight` via `functions/api/ai-insight.js`.

---

## 1. How It Works

- **Endpoint**: `/api/ai-insight`
- **Method**: `POST`
- **Inference Engine**: Groq API using high-performance models (`groq/compound-mini`, `qwen/qwen3.8-27b`, with automatic fallback)
- **Origin Support**: Processes requests from `https://afriwidget.com`, subdomain staging, Cloudflare Pages (`*.pages.dev`), and dev preview environments.
- **Silent Key Rotation**: Sequentially cycles through `GROQ_API_KEY_1`, `GROQ_API_KEY_2`, `GROQ_API_KEY_3`, or `GROQ_API_KEY`. If any key or model experiences an error or rate limit, the service immediately falls back without displaying error codes to the visitor.
- **Output Guidelines**: Short, single/double-sentence explanation (under 500 characters) specifically explaining what the user's calculated numbers mean, with zero generic fluff or disclaimers.

---

## 2. Cloudflare Pages Environment Setup

Add your Groq keys in your Cloudflare Pages dashboard:

1. Open **Workers & Pages** $\rightarrow$ select your project.
2. Go to **Settings** $\rightarrow$ **Environment variables**.
3. Add:
   - `GROQ_API_KEY_1` = `gsk_...`
   - `GROQ_API_KEY_2` = `gsk_...`
   - `GROQ_API_KEY_3` = `gsk_...`
4. Trigger a new deployment (or push a commit) to activate the variables.
