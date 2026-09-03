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
| **Build Command** | `bun run build` (or `npm run build`) | Builds CSS, OG assets, and pre-renders guides |
| **Build Output Directory** | `.` | Root directory containing HTML & static assets |
| **Root Directory** | `/` | Leave default (repository root) |
| **Deploy Command** | `npx wrangler pages deploy . --project-name=afriwidget` | Or leave empty if optional in your dashboard |

---

## ⚠️ Troubleshooting & Deployment Fixes

### Fix 1: "Configuration file for Pages projects does not support 'build'"
- **Cause**: Cloudflare Pages does not allow a `[build]` section inside `wrangler.toml` (unlike Cloudflare Workers).
- **Fix**: The `[build]` section has been removed from `wrangler.toml`. It now purely contains valid Pages keys (`name`, `pages_build_output_dir`, `compatibility_date`, `compatibility_flags`).

### Fix 2: "Deploy command" Requirement in Cloudflare Pages Dashboard
If your Cloudflare dashboard marks the **Deploy command** as a required field:
- Use:
  ```bash
  npx wrangler pages deploy . --project-name=afriwidget
  ```
  *(Replace `afriwidget` with your exact Cloudflare Pages project name if different).*
- **Do NOT use `npx wrangler deploy`**: That command is for Cloudflare Workers scripts and will cause a `Missing entry-point to Worker script` error.
- If your dashboard allows the field to be left blank, leaving it empty is also valid as Cloudflare Pages automatically publishes the build directory (`.`).

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
