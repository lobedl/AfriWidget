# AfriWidget Mandatory Tool Development Rules

Any AI agent working on AfriWidget must read and follow these rules before building any new tool.

## Mandatory Tool Development Rules

### 1. Direct Linking and No Redirects

- All internal links in headers, footers, category cards, and homepages must point directly to the final clean page path.
- Never use internal redirect rules or trailing-slash bounces.

### 2. Exclusivity Check: Skip Duplicates

- Before building a requested tool, check whether a tool with the same function already exists on AfriWidget.
- If the tool already exists, skip it completely and notify the user.

### 3. Branding and Design System

- Every new page must strictly follow the site's branding: slate dark background theme, yellow accent action buttons, and inline SVG icons. Do not use casual emojis.
- Use the standardized clean six-link header and mobile navigation menu.

### 4. Tool-First Layout and Unique SEO Content

- The interactive tool widget must be placed at the top of the page, above the fold.
- Below the tool, write rich, unique content rather than generic or duplicate text. Cover:
  - About the Tool
  - Why It Was Created
  - How to Use
  - Real-World Technical Examples
  - Frequently Asked Questions in accordion style
- Title tags must follow SEO rules and remain strictly between 50 and 58 characters.

### 5. Automatic Groq AI Panel Integration

- Every new tool page must automatically include the Groq AI panel beneath the tool output.
- Include automatic, unlimited live insights upon calculation and the five-question daily Q&A limit widget, following `GROQ_AI_INTEGRATION.md`.

### 6. Google Analytics Integration

- Automatically embed the standard Google Analytics tracking script in the `<head>` of every newly created tool page.

### 7. Automatic Site Integration and Counts

- Add the new tool card to the homepage under its correct category section.
- Add the tool card to its dedicated category hub page: Health, Finance, Education, or Productivity.
- Update the total tool-count numbers displayed across the homepage and directory pages.
- Append the new page path to `sitemap.xml` and `llms.txt`.