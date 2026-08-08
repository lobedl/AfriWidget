---
name: Validated Replit configuration
description: Safe workflow and .replit editing constraints for this static project
---

For AfriWidget, preserve the repository’s existing `.replit` metadata when restoring or changing the preview workflow. Direct `.replit` edits are rejected; write the complete intended TOML to a workspace temp file and replace it through the validated configuration helper.

**Why:** Recreating the static workflow can rewrite `.replit` and silently remove deployment, agent, Nix, and post-merge settings that are unrelated to the app.

**How to apply:** Prefer the existing `AfriWidget` workflow; if it is missing, configure only `npx --yes serve . -p 3000` on port 3000, then restore and validate the full original `.replit` content before finishing.