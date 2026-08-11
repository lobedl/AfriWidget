# NO_LATEX_RULES.md - Mandatory Rules Against LaTeX Usage

## 🚨 CRITICAL DIRECTIVE: NO LATEX SYNTAX ALLOWED IN THIS CODEBASE

Every AI agent, developer, and automated workflow working on **AfriWidget** MUST adhere to this strict rule:

### 1. Zero LaTeX Syntax
**DO NOT** use LaTeX math formatting anywhere in this repository, including:
- Markdown files in `/content/*.md`
- HTML files (`*.html`)
- JavaScript / TypeScript source files (`*.js`, `*.ts`)
- Documentation files

**Banned Syntax Examples:**
- `$$ ... $$`
- `\text{...}`
- `\frac{...}{...}`
- `\left( ... \right)`
- `\sum`, `\int`, `\times` (LaTeX macros)

---

### 2. Why LaTeX Is Banned
1. **No External Math Libraries**: AfriWidget operates as a 100% lightweight, dependency-free vanilla JS static site.
2. **Unrendered Raw Text**: Pages do NOT load KaTeX or MathJax. Any LaTeX syntax like `$$\text{BMR} = ...$$` gets prerendered or served as ugly, unparsed raw code to visitors.
3. **SEO & Accessibility Failure**: Search engine crawlers and screen readers struggle to parse raw LaTeX markup, harming search indexing and accessibility scores.

---

### 3. Required Replacement Standard
When presenting formulas, equations, or mathematical steps:
- Use **plain readable text** with **bold variable labels**.
- Use **standard Unicode mathematical symbols**:
  - Multiplication: `×`
  - Division: `÷`
  - Plus / Minus: `+`, `-`, `±`
  - Equals / Approximation: `=`, `≈`
- Format fractions using parentheses and division symbols: `(Numerator ÷ Denominator) × 100`.

#### Examples:
❌ **BAD (LaTeX):**
```markdown
$$\text{Break-Even Units} = \frac{\text{Total Fixed Costs}}{\text{Contribution Margin Per Unit}}$$
```

✅ **GOOD (Readable Plain Text):**
```markdown
- **Break-Even Units** = Total Fixed Costs ÷ Contribution Margin Per Unit
```

❌ **BAD (LaTeX):**
```markdown
$$\text{BMR} = (10 \times \text{weight in kg}) + (6.25 \times \text{height in cm}) - (5 \times \text{age in years}) + 5$$
```

✅ **GOOD (Readable Plain Text):**
```markdown
- **BMR** = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
```
