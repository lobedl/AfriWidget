const fs = require('node:fs');
const path = require('node:path');

const retiredSlugs = new Set([
  'health',
  'bmi-calculator',
  'body-fat-calculator',
  'calorie-burn-calculator',
  'daily-calorie-needs-calculator',
  'ghana-nursing-training-admission-calculator',
  'healthy-weight-range-calculator',
  'hydration-reminder-calculator',
  'ideal-weight-calculator',
  'ovulation-cycle-calculator',
  'water-intake-calculator'
]);
const topic = /\b(?:health(?:care)?|medical|medicine|nursing|midwifery|pharmacy|pharmacology|clinical|wellness|nutrition|fitness|hydration|ovulation|fertility|calorie|calories|bmi|bmr|tdee|body\s*fat|physiotherapy|dentistry|dentist)\b/i;

function textOnly(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(?:amp|lt|gt|quot|#39|nbsp);/gi, ' ')
    .replace(/\s+/g, ' ');
}

function spansFor(html, tag) {
  const re = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'gi');
  const stack = [];
  const spans = [];
  let match;
  while ((match = re.exec(html))) {
    const closing = /^<\//.test(match[0]);
    if (!closing && !/\/\s*>$/.test(match[0])) {
      stack.push(match.index);
    } else if (closing && stack.length) {
      const start = stack.pop();
      spans.push({ start, end: re.lastIndex, value: html.slice(start, re.lastIndex) });
    }
  }
  return spans;
}

function removeBlocks(html, tag, predicate) {
  const spans = spansFor(html, tag).filter(span => predicate(span.value));
  if (!spans.length) return html;
  spans.sort((a, b) => a.start - b.start || b.end - a.end);
  const merged = [];
  for (const span of spans) {
    const last = merged[merged.length - 1];
    if (last && span.start <= last.end) last.end = Math.max(last.end, span.end);
    else merged.push({ start: span.start, end: span.end });
  }
  for (let i = merged.length - 1; i >= 0; i--) {
    html = html.slice(0, merged[i].start) + html.slice(merged[i].end);
  }
  return html;
}

function routeFromHref(href) {
  try {
    const pathname = new URL(href, 'https://afriwidget.com').pathname;
    return pathname.replace(/\.html$/i, '').replace(/\/+$/, '').toLowerCase() || '/';
  } catch {
    return '';
  }
}

function cleanStructuredData(html, file) {
  return html.replace(/<script\b([^>]*type=["']application\/ld\+json["'][^>]*)>([\s\S]*?)<\/script>/gi, (whole, attrs, body) => {
    try {
      const removeNode = node => {
        if (Array.isArray(node)) return node.map(removeNode).filter(value => value !== undefined);
        if (!node || typeof node !== 'object') return node;
        const nodeText = JSON.stringify(node);
        if (node['@type'] === 'Question' && topic.test(nodeText)) return undefined;
        if (node['@type'] === 'ListItem' && topic.test(nodeText)) return undefined;
        if (node['@type'] === 'ItemList' && topic.test(nodeText)) return undefined;
        for (const key of Object.keys(node)) {
          const value = node[key];
          if (typeof value === 'string' && topic.test(value)) delete node[key];
          else node[key] = removeNode(value);
          if (node[key] === undefined) delete node[key];
        }
        return node;
      };
      const parsed = removeNode(JSON.parse(body));
      return parsed === undefined
        ? ''
        : `<script${attrs}>${JSON.stringify(parsed)}</script>`;
    } catch (error) {
      console.error(`Could not clean JSON-LD in ${file}: ${error.message}`);
      return whole;
    }
  });
}

function cleanMeta(html) {
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || 'AfriWidget tools')
    .replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/["<>]/g, '').trim();
  const description = `Use AfriWidget's ${title} to calculate results and plan your next steps.`;
  return html.replace(/<meta\b[^>]*>/gi, tag => {
    if (!topic.test(tag)) return tag;
    if (!/(?:name|property)=["'](?:description|og:description|twitter:description)["']/i.test(tag)) return '';
    if (/content=["'][^"']*["']/i.test(tag)) {
      return tag.replace(/content=["'][^"']*["']/i, `content="${description}"`);
    }
    return '';
  });
}

function cleanHtml(file, html) {
  html = cleanStructuredData(html, file);

  if (path.basename(file) === 'index.html') {
    html = removeBlocks(html, 'section', block => /health\s*&\s*wellness/i.test(textOnly(block)));
  }

  html = removeBlocks(html, 'li', block => {
    const href = block.match(/\bhref=["']([^"']+)["']/i)?.[1];
    return href && retiredSlugs.has(routeFromHref(href).replace(/^\//, ''));
  });
  html = removeBlocks(html, 'a', block => {
    const href = block.match(/\bhref=["']([^"']+)["']/i)?.[1] || '';
    return retiredSlugs.has(routeFromHref(href).replace(/^\//, '')) || topic.test(textOnly(block));
  });
  html = removeBlocks(html, 'article', block => topic.test(textOnly(block)));
  html = removeBlocks(html, 'tr', block => topic.test(textOnly(block)));
  html = removeBlocks(html, 'option', block => topic.test(textOnly(block)) || /value=["']\/?health["']/i.test(block));
  for (const tag of ['p', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'blockquote', 'summary', 'dt', 'dd', 'label', 'button']) {
    html = removeBlocks(html, tag, block => topic.test(textOnly(block)));
  }
  html = removeBlocks(html, 'div', block => {
    const opening = block.slice(0, block.indexOf('>') + 1);
    return /\b(?:health|wellness)[-_ ]?(?:card|category|section|tool|hub)\b/i.test(opening);
  });
  html = html.replace(/<img\b[^>]*(?:alt|title|src)=["'][^"']*(?:bmi|body.?fat|health|medical|nursing|calorie|hydration|ovulation)[^"']*["'][^>]*>/gi, '');

  if (file === 'university-course-finder.html') {
    html = html.replace(/health\s*:\s*['"]Health,\s*Nursing and Medicine['"]\s*,?/gi, '');
    html = html.replace(/\{[^{}]*field\s*:\s*['"]health['"][^{}]*\}\s*,?/gi, '');
  }
  if (file === 'kuccps-cluster-points-calculator.html') {
    html = html.replace(/([,{])\s*(?:medicine|pharmacy|nursing|midwifery|health)\s*:\s*\{[^{}]*\}\s*,?/gi, '$1');
  }
  if (file === 'about.html') {
    html = html.replace(/\b120\+/g, '100+').replace(/\b5\s+(?:core\s+)?categories\b/gi, '4 categories');
  }
  html = cleanMeta(html);
  return html;
}

const htmlFiles = fs.readdirSync('.').filter(name => name.endsWith('.html'));
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const cleaned = cleanHtml(file, html);
  if (cleaned !== html) fs.writeFileSync(file, cleaned);
}

for (const file of htmlFiles) {
  const slug = path.basename(file, '.html').toLowerCase();
  if (retiredSlugs.has(slug)) fs.rmSync(file, { force: true });
}

for (const file of ['src/assets/images/bmi_composition_guide_1791273392218.jpg', 'src/assets/images/bmi_composition_guide_1791273392218.webp']) {
  fs.rmSync(file, { force: true });
}

const indexPath = 'tools-index.json';
if (fs.existsSync(indexPath)) {
  const entries = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const cleaned = entries.filter(item => !retiredSlugs.has(String(item.slug || '').toLowerCase()));
  for (const item of cleaned) {
    if (Array.isArray(item.keywords)) item.keywords = item.keywords.filter(value => !topic.test(String(value)));
    if (typeof item.description === 'string') {
      item.description = item.description.split(/(?<=[.!?])\s+/).filter(sentence => !topic.test(sentence)).join(' ');
    }
  }
  fs.writeFileSync(indexPath, JSON.stringify(cleaned, null, 2) + '\n');
}

if (fs.existsSync('sitemap.xml')) {
  let sitemap = fs.readFileSync('sitemap.xml', 'utf8');
  sitemap = sitemap.replace(/<url>[\s\S]*?<\/url>/gi, block => /ghana-nursing-training-admission-calculator/i.test(block) ? '' : block);
  fs.writeFileSync('sitemap.xml', sitemap);
}

if (fs.existsSync('llms.txt')) {
  let lines = fs.readFileSync('llms.txt', 'utf8').split(/\r?\n/);
  let skip = false;
  lines = lines.filter(line => {
    if (/^##\s+Health\b/i.test(line)) { skip = true; return false; }
    if (skip && /^##\s+/.test(line)) skip = false;
    if (skip) return false;
    return !topic.test(line) && !/ghana-nursing-training-admission-calculator|\/health\b/i.test(line);
  });
  fs.writeFileSync('llms.txt', lines.join('\n'));
}

if (fs.existsSync('metadata.json')) {
  const metadata = JSON.parse(fs.readFileSync('metadata.json', 'utf8'));
  for (const key of Object.keys(metadata)) {
    if (typeof metadata[key] === 'string' && topic.test(metadata[key])) {
      metadata[key] = 'AfriWidget provides practical education, finance, productivity, and business tools.';
    }
  }
  fs.writeFileSync('metadata.json', JSON.stringify(metadata, null, 2) + '\n');
}

for (const file of ['BREADCRUMB_AND_NAVIGATION_STANDARDS.md', 'RELATED_TOOLS_AND_INTERNAL_LINKING_STANDARDS.md']) {
  if (!fs.existsSync(file)) continue;
  let text = fs.readFileSync(file, 'utf8');
  text = text.replace(/\/health(?:\.html)?\b/gi, '');
  text = text.replace(/\/healthy-weight-range-calculator\b/gi, '');
  fs.writeFileSync(file, text);
}

console.log(`Removed health category content from ${htmlFiles.length} static pages and retired health-only routes.`);
