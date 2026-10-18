const fs = require('node:fs');
const path = require('node:path');

const topic = /\b(?:health(?:care)?|medical|medicine|nursing|midwifery|pharmacy|pharmacology|clinical|wellness|nutrition|fitness|hydration|ovulation|fertility|calorie|calories|bmi|bmr|tdee|body\s*fat|physiotherapy|dentistry|dentist)\b/i;
const propertyNames = new Set([
  'health', 'health_sci', 'medicine', 'med_surg', 'nursing', 'pharmacy',
  'midwifery', 'dentistry', 'physiotherapy', 'clinical'
]);
const educationPages = new Set([
  'acsee-points-calculator.html', 'atar-calculator.html',
  'canada-university-admission-chance-calculator.html', 'education.html',
  'germany-abitur-grade-calculator.html', 'jamb-admission-chance-checker.html',
  'jamb-score-calculator.html', 'jamb-utme-aggregate-calculator.html',
  'kcse-grade-calculator.html', 'kcse-kuccps-cluster-calculator.html',
  'kuccps-cluster-points-calculator.html', 'norway-gpa-calculator.html',
  'olevel-subject-combination-checker.html', 'post-utme-aggregate-calculator.html',
  'south-african-aps-calculator.html', 'south-african-university-admission-calculator.html',
  'tanzania-university-admission-calculator.html', 'uace-points-calculator.html',
  'uganda-university-admission-calculator.html', 'uk-a-level-grade-calculator.html',
  'university-course-finder.html', 'university-cutoff-eligibility-checker.html',
  'wassce-aggregate-calculator.html', 'zambia-grade-12-points-calculator.html',
  'zambia-university-admission-calculator.html', 'zimbabwe-university-entry-points-calculator.html',
  'zimsec-alevel-points-calculator.html'
]);

function getSpans(html, tag) {
  const re = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'gi');
  const stack = [];
  const spans = [];
  let match;
  while ((match = re.exec(html))) {
    if (/^<\//.test(match[0])) {
      if (stack.length) spans.push({ start: stack.pop(), end: re.lastIndex, value: html.slice(stack[stack.length] ?? 0, re.lastIndex) });
    } else if (!/\/\s*>$/.test(match[0])) {
      stack.push(match.index);
    }
  }
  return spans.map(span => ({ ...span, value: html.slice(span.start, span.end) }));
}

function removeBlocks(html, tag, predicate) {
  const spans = getSpans(html, tag).filter(item => predicate(item.value));
  if (!spans.length) return html;
  spans.sort((a, b) => a.start - b.start || b.end - a.end);
  const intervals = [];
  for (const item of spans) {
    const last = intervals.at(-1);
    if (last && item.start <= last.end) last.end = Math.max(last.end, item.end);
    else intervals.push({ start: item.start, end: item.end });
  }
  for (let i = intervals.length - 1; i >= 0; i--) {
    html = html.slice(0, intervals[i].start) + html.slice(intervals[i].end);
  }
  return html;
}

function removeHealthProperties(code) {
  const re = /([,{])\s*(['"]?)([a-z_]+)\2\s*:/gi;
  const ranges = [];
  let match;
  while ((match = re.exec(code))) {
    if (!propertyNames.has(match[3].toLowerCase())) continue;
    let i = re.lastIndex;
    let quote = '';
    let escaped = false;
    let braces = 0, brackets = 0, parens = 0;
    for (; i < code.length; i++) {
      const c = code[i];
      if (quote) {
        if (escaped) escaped = false;
        else if (c === '\\') escaped = true;
        else if (c === quote) quote = '';
        continue;
      }
      if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
      if (c === '{') braces++;
      else if (c === '}') {
        if (braces === 0 && brackets === 0 && parens === 0) break;
        braces--;
      } else if (c === '[') brackets++;
      else if (c === ']') brackets--;
      else if (c === '(') parens++;
      else if (c === ')') parens--;
      else if (c === ',' && braces === 0 && brackets === 0 && parens === 0) { i++; break; }
    }
    const delimiter = match[1];
    const start = match.index + (delimiter === '{' ? 1 : 0);
    ranges.push({ start, end: i });
    re.lastIndex = Math.max(re.lastIndex, i);
  }
  for (let i = ranges.length - 1; i >= 0; i--) {
    code = code.slice(0, ranges[i].start) + code.slice(ranges[i].end);
  }
  return code;
}

function scrubScriptStrings(code) {
  return code.replace(/(["'`])(?:\\.|(?!\1)[\s\S])*?\1/g, literal => {
    if (!topic.test(literal)) return literal;
    const quote = literal[0];
    let text = literal.slice(1, -1);
    text = text
      .replace(/health\s*,\s*nursing\s*(?:and|&)\s*medicine/gi, 'other fields')
      .replace(/health\s+sciences?\s*\/\s*biomedical science/gi, 'other fields')
      .replace(/medicine\s*&\s*surgery\s*\/\s*dentistry/gi, 'other fields')
      .replace(/medicine\s+and\s+health sciences/gi, 'other fields')
      .replace(/health sciences?/gi, 'other fields')
      .replace(/(?:medicine|nursing|midwifery|pharmacy|pharmacology|clinical|physiotherapy|dentistry|dentist)/gi, 'other fields')
      .replace(/medical/gi, 'admission')
      .replace(/healthcare|health/gi, 'general');
    if (quote === '`' && text.includes('${')) return "''";
    return quote + text + quote;
  });
}

function cleanInlineScripts(html, file) {
  return html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (whole, attrs, code) => {
    if (/application\/ld\+json/i.test(attrs)) return whole;
    if (educationPages.has(path.basename(file))) code = removeHealthProperties(code);
    code = scrubScriptStrings(code);
    return `<script${attrs}>${code}</script>`;
  });
}

function plainText(block) {
  return block.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
}

const targetFiles = new Set([...educationPages, 'index.html']);
for (const file of fs.readdirSync('.').filter(name => name.endsWith('.html') && targetFiles.has(name))) {
  let html = fs.readFileSync(file, 'utf8');
  html = cleanInlineScripts(html, file);
  html = html.replace(/<input\b[^>]*>/gi, tag => {
    if (!topic.test(tag)) return tag;
    if (/placeholder=/i.test(tag)) return tag.replace(/placeholder=["'][^"']*["']/i, 'placeholder="Search by name or keyword"');
    return tag.replace(/\s+(?:title|aria-label|value)=["'][^"']*["']/i, '');
  });
  for (const tag of ['span', 'strong', 'em', 'small']) {
    html = removeBlocks(html, tag, block => topic.test(plainText(block)));
  }
  html = removeBlocks(html, 'div', block => {
    const open = block.slice(0, block.indexOf('>') + 1);
    return topic.test(plainText(block)) &&
      /\b(?:bench-row|faq-item|course-card|faculty-card|program-card|case-study|health-card|category-card)\b/i.test(open);
  });
  if (file === 'index.html') {
    html = html.replace(/Search 120\+ calculators &amp; tools \(e\.g\. GPA, BMI, loan, invoice, WASSCE\.\.\.\)/i, 'Search 100+ calculators &amp; tools (e.g. GPA, loan, invoice, WASSCE...)');
    html = html.replace(/\b120\+/g, '100+');
    html = html.replace(/'Health'\s*:\s*'<svg[^']*'[,]?/i, '');
    html = html.replace(/Use AfriWidget's Free Online Calculators & Utility Tools - AfriWidget to calculate results and plan your next steps\./g,
      'Free education, finance, productivity, and business calculators and tools. Fast, private, and built for everyday use.');
  }
  html = html.replace(/[ \t]+(?=\r?$)/gm, '');
  fs.writeFileSync(file, html);
}

console.log('Removed healthcare program examples from remaining education-tool markup and scripts.');
