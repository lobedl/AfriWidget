import fs from 'fs';
import path from 'path';

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, function (character) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character];
  });
}

function formatInline(text) {
  if (!text) return '';
  return String(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}

function renderMarkdown(markdown) {
  var lines = String(markdown || '').replace(/\r/g, '').split('\n');
  var html = [];
  var paragraph = [];
  var listType = '';
  var inFaq = false;
  var openFaq = false;

  function flushParagraph() {
    if (!paragraph.length) return;
    var text = paragraph.join(' ').trim();
    if (text === '---') {
      html.push('<hr class="my-6 border-slate-200" />');
      paragraph = [];
      return;
    }
    if (/<[a-z1-6]+[\s>]/i.test(text) || /<\/[a-z1-6]+>/i.test(text)) {
      html.push(text);
    } else {
      text = formatInline(text);
      html.push('<p>' + text + '</p>');
    }
    paragraph = [];
  }

  function closeList() {
    if (listType) {
      html.push('</' + listType + '>');
      listType = '';
    }
  }

  function closeFaq() {
    if (openFaq) {
      html.push('</div></details>');
      openFaq = false;
    }
  }

  lines.forEach(function (line) {
    var trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      closeList();
      return;
    }
    var heading = trimmed.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      if (heading[1].length === 2 && /frequently asked questions|faq/i.test(heading[2])) {
        closeFaq();
        inFaq = true;
        html.push('<h2>' + formatInline(heading[2]) + '</h2>');
      } else if (inFaq && heading[1].length === 3) {
        closeFaq();
        openFaq = true;
        html.push('<details><summary>' + formatInline(heading[2]) + '</summary><div>');
      } else {
        if (heading[1].length === 2) closeFaq();
        html.push('<h' + heading[1].length + '>' + formatInline(heading[2]) + '</h' + heading[1].length + '>');
      }
      return;
    }
    var list = trimmed.match(/^([-*]|\d+\.)\s+(.+)$/);
    if (list) {
      flushParagraph();
      var nextType = /^\d+\./.test(list[1]) ? 'ol' : 'ul';
      if (listType !== nextType) {
        closeList();
        listType = nextType;
        html.push('<' + listType + '>');
      }
      html.push('<li>' + formatInline(list[2]) + '</li>');
      return;
    }
    if (/^>\s?/.test(trimmed)) {
      flushParagraph();
      closeList();
      html.push('<blockquote>' + formatInline(trimmed.replace(/^>\s?/, '')) + '</blockquote>');
      return;
    }
    paragraph.push(trimmed);
  });

  flushParagraph();
  closeList();
  closeFaq();
  return html.join('');
}

const contentDir = path.join(process.cwd(), 'content');
let tools = [
  { htmlFile: 'success-stories.html', mdKey: 'success-stories' }
];

if (fs.existsSync(contentDir)) {
  const mdFiles = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
  mdFiles.forEach(mdFile => {
    const mdKey = mdFile.replace(/\.md$/, '');
    const htmlFile = `${mdKey}.html`;
    tools.push({ htmlFile, mdKey });
  });
}

tools.forEach(({ htmlFile, mdKey }) => {
  const mdPath = path.join(process.cwd(), 'content', `${mdKey}.md`);
  const htmlPath = path.join(process.cwd(), htmlFile);

  if (!fs.existsSync(mdPath) || !fs.existsSync(htmlPath)) {
    console.log(`Skipping ${htmlFile}: file or md missing`);
    return;
  }

  const markdown = fs.readFileSync(mdPath, 'utf8');
  const renderedHtml = renderMarkdown(markdown);
  let htmlContent = fs.readFileSync(htmlPath, 'utf8');

  // Replace content inside <section id="toolGuide"...> ... </section>
  const guideRegex = /(<section\s+id="toolGuide"[^>]*>)([\s\S]*?)(<\/section>)/i;
  if (guideRegex.test(htmlContent)) {
    htmlContent = htmlContent.replace(guideRegex, (match, p1, p2, p3) => `${p1}${renderedHtml}${p3}`);
    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    console.log(`Successfully updated prerendered guide in ${htmlFile}`);
  } else {
    console.log(`Could not find <section id="toolGuide"> in ${htmlFile}`);
  }
});
