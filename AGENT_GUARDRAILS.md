# AfriWidget Agent Guardrails

Read this file before changing shared page markup or calculator result layouts.

## 1. Keep favicon markup consistent

Every public `.html` page must use the same crawlable favicon assets:

```html
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
```

When adding or editing a page:

- Keep the favicon URLs root-relative so they work on clean URLs.
- Do not add inline `data:image/svg+xml` favicon declarations.
- Do not add page-specific or competing favicon declarations.
- Check all root-level HTML pages, not only the page being edited.
- Confirm `/favicon.ico` and `/favicon-32.png` return successfully from the running site.

Why: inconsistent, missing, inline, or competing favicon declarations can prevent Google from selecting the intended site favicon in search results.

## 2. Use homepage branding as the source of truth for new tools

The homepage and newly added generator pages use a yellow/gold brand treatment. New tool pages must copy this treatment instead of the older emerald internal-page logo:

- Header logo mark: `#FACC15`
- Header logo secondary dot: `#CA8A04`
- Header `Widget` wordmark: yellow/gold, not emerald green
- Footer logo mark: the same yellow/gold colors

Use the homepage header in `index.html` as the visual reference. If CSS recolors emerald utility classes, verify inline SVG `fill` values separately because CSS cannot override hardcoded SVG presentation attributes reliably.

Why: the homepage palette is the current AfriWidget brand direction, and copying older internal-page markup caused newly added tools to look inconsistent.

## 3. Do not leave empty result cards

Calculator result sections must contain useful visible content. Do not add or preserve a styled card that contains only an icon, empty spacing, or an empty container.

Before finishing a calculator UI change:

- Inspect the full result flow on mobile as well as desktop.
- Remove any unused placeholder, insight, tip, or lightbulb card.
- Make sure the main result flows directly into the next meaningful section, such as the amortisation schedule.
- Preserve real result sections and calculator logic while removing only the unused card.
- Verify the served page, not just the source file, after restarting the static workflow.

Why: an empty card creates unexplained whitespace and makes the mobile results page look broken, even when the calculator itself works.

## Final checks

For changes covered by these guardrails:

1. Run `git diff --check`.
2. Restart the `AfriWidget` workflow after markup changes.
3. Check the relevant page through the running static server.
4. Confirm the intended content remains and the unwanted markup is absent.