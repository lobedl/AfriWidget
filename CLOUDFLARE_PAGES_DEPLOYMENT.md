# Cloudflare Pages Deployment Guide for AfriWidget

This document details the configuration and GitHub deployment setup for hosting **AfriWidget** on **Cloudflare Pages**.

---

## 🚀 Quick Start: Deploy from GitHub to Cloudflare Pages

### 1. Connect Repository
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Compute (Workers & Pages)** → **Create** → **Pages** → **Connect to Git**.
3. Select your GitHub repository containing the AfriWidget codebase.

### 2. Build Settings Configuration
Because `wrangler.toml` is present in the root directory, Cloudflare Pages will automatically detect your build settings. Verify that the configuration matches:

| Setting | Value | Notes |
| :--- | :--- | :--- |
| **Framework Preset** | `None` | Static site with pre-rendering |
| **Build Command** | `npm run build` (or `bun run build`) | Builds CSS, OG assets, and pre-renders guides |
| **Build Output Directory** | `.` | Root directory containing HTML & static assets |
| **Root Directory** | `/` | Leave default (repository root) |
| **Deploy Command** | *(Leave Empty)* or `npx wrangler pages deploy .` | **CRITICAL**: Do NOT use `npx wrangler deploy` (see Troubleshooting below) |

---

## ⚠️ Troubleshooting: "Missing entry-point to Worker script or to assets directory"

If your build logs show:
```
Executing user deploy command: npx wrangler deploy
▲ [WARNING] It seems that you have run `wrangler deploy` on a Pages project, `wrangler pages deploy` should be used instead.
✘ [ERROR] Missing entry-point to Worker script or to assets directory
```

### Why This Happens
In Cloudflare's new dashboard, when connecting a repository or editing build settings, Cloudflare sometimes auto-fills the **Deploy command** field with `npx wrangler deploy`.
- `npx wrangler deploy` is meant for standalone **Cloudflare Workers** (looking for a `main = "src/index.ts"` entrypoint).
- For **Cloudflare Pages**, Cloudflare automatically deploys the static build output directory (`.`), so a deploy command is **not required**.

### How to Fix (30-Second Fix)
1. In the **Cloudflare Dashboard**, open your **AfriWidget** project.
2. Go to **Settings** → **Builds & deployments** → **Build configuration** (click **Edit**).
3. Look at the **Deploy command** input:
   - **Option A (Recommended)**: Clear the box completely so it is **empty**. Cloudflare Pages will automatically deploy your static assets.
   - **Option B**: If your dashboard requires a command, change it to:
     ```bash
     npx wrangler pages deploy .
     ```
4. Click **Save**.
5. Trigger a new deployment (or push a commit) — the build will now succeed immediately!

### 3. Environment Variables & Secrets
Navigate to **Settings** → **Environment Variables** in your Cloudflare Pages project and add the following:

#### Required for AI Assistant & Tools
- `GROQ_API_KEY`: Primary Groq API key for realtime AI responses.
- `GROQ_KEY_1` .. `GROQ_KEY_5`: (Optional) Fallback Groq API keys for automatic failover.
- `GEMINI_API_KEY`: (Optional) Secondary fallback if Groq keys are exhausted.

#### Required for Contact Form
- `RESEND_API_KEY`: Resend API key for contact form submission.
- `CONTACT_EMAIL`: (Optional) Primary destination email address (defaults to `hello@afriwidget.com`).
- `RESEND_FROM_EMAIL`: (Optional) Verified sender email (defaults to `AfriWidget Contact <contact@afriwidget.com>`).

---

## 📁 Cloudflare Configuration Architecture

### 1. `wrangler.toml` (Repository Root)
Centralized configuration file defining the Pages project name, static build output directory (`.`), Node.js compatibility date, and build command:
```toml
name = "afriwidget"
pages_build_output_dir = "."
compatibility_date = "2024-09-01"
compatibility_flags = ["nodejs_compat"]

[build]
command = "npm run build"
```

### 2. Node Runtime Specification (`.node-version` and `.nvmrc`)
Specifies Node.js 20 LTS for the Cloudflare Pages build environment.

### 3. Edge Functions (`/functions`)
Cloudflare Pages uses file-system-based edge functions running on the Cloudflare Workers V8 runtime:
- `functions/api/groq-proxy.js`: Edge endpoint for AI requests (`/api/groq-proxy`).
- `functions/api/education-ai.js`: Compatibility alias (`/api/education-ai`).
- `functions/api/send-email.js`: Contact email delivery endpoint (`/api/send-email`).
- `functions/_middleware.js`: Intercepts and rewrites any legacy Netlify function calls (`/.netlify/functions/*` → `/api/*`), ensuring 100% backward compatibility for all client scripts.

### 4. Custom Headers (`_headers`)
Cloudflare Pages parses `_headers` to enforce:
- HTTP security headers (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).
- Fast revalidation for HTML, CSS, and JS (`public, max-age=0, must-revalidate`).
- CORS headers (`Access-Control-Allow-Origin: *`) for images and social cards (`/og-image.*`, `/*.png`, `/*.jpg`).
- Non-caching headers for API functions.

### 5. URL Rewriting & Clean Routing (`_redirects`)
Cloudflare Pages parses `_redirects` to execute:
- Canonical 301 redirects for legacy routes and slug migrations.
- Clean extensionless URLs (`/:page /:page.html 200`).
- Seamless proxying for API routes.
