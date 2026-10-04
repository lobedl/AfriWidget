---
name: Browser PDF export boundary
description: How static AfriWidget pages should stage content for reliable client-side PDF generation
---

Client-side PDF exports should render a dedicated, fixed A4 staging document from current page data instead of passing a responsive live card or an off-screen element directly to a canvas exporter. For simple documents, a small self-contained vector PDF generator is more reliable than DOM capture.

**Why:** Responsive preview cards and far off-screen nodes can produce blank or incomplete canvases in browser PDF libraries, especially on mobile-sized layouts. Strictly ASCII PDF output also avoids cross-reference byte-offset mismatches when building a Blob from JavaScript strings.

**How to apply:** Keep a staging document self-contained with an explicit white background, fixed A4-sized width, readable typography, and page-break settings; remove it after export. For invoices and receipts, prefer direct vector PDF commands with escaped text and a valid xref table. Never send form data to a server just to create the file. Optional profile images should be resized locally and embedded only in the exported document.