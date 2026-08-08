---
name: Compressed legacy HTML editing
description: Safe editing constraint for older AfriWidget pages stored as one-line HTML documents
---

When editing a legacy tool page whose main document is compressed onto one physical line, preserve `<!DOCTYPE html>` as the first token and use exact, page-specific replacements rather than broad rewrites. Re-run raw HTML word counts and structural checks after inserting content.

**Why:** Broad or line-oriented patches can place new sections before the doctype or fail to match the compressed article boundary, while the browser may still appear to render the result.

**How to apply:** Prefer a unique nearby text boundary, keep existing calculator scripts and closing tags unchanged, then verify doctype position, word count, route status, and rendered output.

When an exact article-line patch does not match, use a stable document boundary such as the closing `main` or a unique section marker instead of rewriting the compressed page. Keep new prose structurally separate from the existing script tail.

**Why:** Long compressed lines are easy to mismatch, while boundary-based inserts preserve the working generator and make the resulting HTML easier to audit.

**How to apply:** Add content immediately before the stable boundary, then re-run the raw word count, `node --check` on the inline script, and the clean-route HTTP check.

Template expressions placed directly in a legacy HTML body are emitted literally; they are not evaluated by the browser. For generated controls, use a stable container and populate it from the page script before binding events. If an old page already contains the literal expression, detect that legacy container and replace its contents during initialization.

**Why:** The KCSE page exposed `${Array.from(...)}` as visible text because interpolation was used outside a JavaScript template literal.

**How to apply:** Keep HTML responsible for the container and JavaScript responsible for generated markup. Verify the generated control count and event bindings after initialization.