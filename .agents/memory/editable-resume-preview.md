---
name: Editable resume preview boundary
description: How the resume builder presents drafts without breaking editing, copy, or PDF export
---

The resume builder should present drafts as a wide, structured, editable paper-style document rather than a raw text block. Render sections through DOM text nodes for safe content, and derive a normalized line-preserving plain-text version for copy and PDF export. PDF headers must stack the name, role, and contact rows with dedicated vertical space; never place contact text on the name baseline.

**Why:** A plain editable `<pre>` made even a well-written resume feel unfinished, while a narrow preview squeezed content. The original PDF header also placed contact content beside the name, allowing long names or photo layouts to collide visually.

**How to apply:** Keep the underlying draft text as the source of truth, use the wider result column and paper surface, recognize resume section headings, give the header and sections clear visual hierarchy, preserve responsive wrapping on narrow screens, and reserve a separate PDF row for contact details.