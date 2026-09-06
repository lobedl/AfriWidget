# Cloudflare Pages Deployment Postmortem, Error Prevention & Standards

> **MANDATORY NOTICE FOR ALL AI AGENTS & DEVELOPERS:**  
> Read this document before modifying deployment configurations, routing files (`_redirects`), build scripts, or serverless functions (`/functions`, `/netlify/functions`). Following these rules prevents deployment downtime, `ERR_TOO_MANY_REDIRECTS` loops, and Cloudflare Pages function build failures.

---

## 📌 Executive Summary of Resolved Deployment Issues

During deployment to Cloudflare Pages (`afriwidget2.pages.dev`), three distinct issues were identified and resolved:
1. **`ERR_TOO_MANY_REDIRECTS`**: Caused by circular rewriting in `_redirects`.
2. **`Script not found "builder"`**: Caused by a typo in the dashboard build command (`bun run builder` instead of `bun run build`).
3. **`Uncaught ReferenceError: process is not defined`**: Caused by top-level access to Node's `process.env` in Cloudflare Pages Functions' V8 isolate.

---

## 🛑 1. The `ERR_TOO_MANY_REDIRECTS` Loop

### The Symptom
When visiting any page (e.g., `/education`, `/gpa-calculator`), the browser displays:
> **This page isn’t working**  
> `afriwidget2.pages.dev` redirected you too many times.  
> `ERR_TOO_MANY_REDIRECTS`

Search engines also drop or penalize pages caught in redirect loops.

### The Root Cause
Cloudflare Pages has built-in **Asset Serving with Extensionless URLs**:
- When a user visits `/education`, Cloudflare natively checks for an `education.html` file in the build output directory and serves it with status `200 OK`.
- If a user or bot visits `/education.html`, Cloudflare issues an automatic `308 Permanent Redirect` to the clean URL `/education`.

Previously, `_redirects` contained this rewrite rule:
```text
# ❌ NEVER ADD THIS RULE:
/:page    /:page.html    200
```
This created an infinite loop:
1. User requests `/education`.
2. `_redirects` rule matches and rewrites `/education` to `/education.html`.
3. Cloudflare Pages canonical engine detects `.html` and redirects (308) to `/education`.
4. Browser requests `/education` again.
5. Loop repeats until Chrome/Edge/Firefox aborts with `ERR_TOO_MANY_REDIRECTS`.

### The Permanent Rule
- **NEVER** add `/:page /:page.html 200` to `_redirects`.
- Both **Cloudflare Pages** (natively) and **Netlify** (via `pretty_urls = true` in `netlify.toml`) handle extensionless routing automatically.
- `_redirects` must ONLY contain explicit URL migrations (e.g. `301` status redirects from old slugs to new slugs).

---

## 🛑 2. Edge Function `process is not defined` Error

### The Symptom
Cloudflare Pages builds static assets successfully (e.g., `✨ Success! Uploaded 411 files`), but fails at the final step:
```text
Error: Failed to publish your Function. Got error: Uncaught ReferenceError: process is not defined
  at functionsWorker.js:65:5 in configuredGroqKeys
  at functionsWorker.js:223:20 in ../netlify/functions/groq-proxy.js
```

### The Root Cause
- Netlify and standard Node.js environments inject the global `process` object (`process.env`).
- Cloudflare Pages Functions run in a lightweight **V8 Web Worker Isolate**, where `process` is undefined by default.
- If any imported function or helper accesses `process.env` in global module scope or during initial evaluation, the Cloudflare worker compiler throws an uncaught `ReferenceError`.

### The Permanent Rule
1. **Edge-Safe Polyfill**: Every function entry point (`functions/api/*.js`, `functions/_middleware.js`, and shared handlers in `netlify/functions/*.js`) MUST start with:
   ```javascript
   if (typeof globalThis.process === 'undefined') {
     globalThis.process = { env: {} };
   } else if (!globalThis.process.env) {
     globalThis.process.env = {};
   }
   ```
2. **Lazy Initialization**: Never access environment variables at the root module scope (e.g., `const INITIAL_KEYS = configuredGroqKeys();` at file load time). Always read keys lazily inside request handlers when `context.env` or incoming requests trigger them.
3. **Context Bridging**: In `functions/api/groq-proxy.js` and `functions/api/send-email.js`, environment variables passed in Cloudflare's `context.env` are bridged into `globalThis.process.env`:
   ```javascript
   if (context.env) {
     for (const [key, value] of Object.entries(context.env)) {
       if (typeof value === 'string' && value) {
         globalThis.process.env[key] = value;
       }
     }
   }
   ```

---

## 🛑 3. Build Command Dashboard Configuration

### The Symptom
```text
Executing user command: bun run builder
error: Script not found "builder"
Failed: Error while executing user command. Exited with error code: 1
```

### The Root Cause
A typo in the Cloudflare Pages dashboard build settings where `builder` was entered instead of `build`.

### The Canonical Settings
In Cloudflare Dashboard (**Settings** → **Builds & deployments** → **Build configuration**):

| Configuration Field | Correct Value |
| :--- | :--- |
| **Framework preset** | `None` |
| **Build command** | `bun run build` *(or `npm run build`)* |
| **Build output directory** | `.` |
| **Root directory** | `/` |

In `package.json`, the standard build script is:
```json
"scripts": {
  "build": "node generate-og-assets.js && node build-prerender.js && bun x @tailwindcss/cli -i ./input.css -o ./dist/styles.css --minify && node -e \"import('fs').then(fs => fs.copyFileSync('./dist/styles.css', './styles.css'))\""
}
```

---

## 🛡️ 4. `wrangler.toml` Constraints for Cloudflare Pages

### The Rule
`wrangler.toml` at the project root must only contain settings valid for **Cloudflare Pages**:
```toml
name = "afriwidget"
pages_build_output_dir = "."
compatibility_date = "2024-09-01"
compatibility_flags = ["nodejs_compat"]
```

- **NEVER** put a `[build]` block in `wrangler.toml`. Cloudflare Pages will reject the deployment with:  
  `Configuration file for Pages projects does not support 'build'`.

---

## ✅ 5. Verification Checklist for New Agents

Before closing any task involving deployment or routing:
- [x] Run `npm run build` or `bun run build` to confirm all 191 HTML files, OpenGraph images, and Tailwind CSS files compile cleanly.
- [x] Run `npx wrangler pages functions build functions` to ensure edge functions compile into a worker bundle with zero syntax or isolate errors.
- [x] Check `_redirects`: Verify that no wildcards rewrite to `.html` extensions (e.g. no `/:page /:page.html 200`).
- [x] Confirm all tools (calculators, converters, utilities) run 100% in-browser on vanilla JS without requiring external server dependencies.
- [x] Ensure both `dist/styles.css` and `styles.css` exist and are unignored in `.gitignore`.
