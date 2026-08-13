const fs = require('fs');

const jsBundles = [
  'academic-tools.js',
  'academic-utilities.js',
  'ai-writing-tools.js',
  'health-tools.js',
  'new-tools.js',
  'productivity-tools.js',
  'random-variety.js',
  'qrcode.js',
  'share-results.js',
  'universal-ai.js'
];

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

let updatedCount = 0;

htmlFiles.forEach(html => {
  let content = fs.readFileSync(html, 'utf8');

  // Find all JS files that match elements or IDs in this HTML
  const requiredJs = [];

  jsBundles.forEach(js => {
    const jsContent = fs.readFileSync(js, 'utf8');
    
    // Check if the JS file explicitly references this page filename or element IDs in this page
    if (js === 'universal-ai.js') {
      // universal-ai handles AI tools or general interactive elements
      if (content.includes('ai-prompt') || content.includes('data-ai') || content.includes('universal-ai')) {
        requiredJs.push(js);
      }
      return;
    }

    if (js === 'share-results.js') {
      // share-results handles share buttons or result copying
      if (content.includes('share-btn') || content.includes('copy-btn') || content.includes('shareResults') || content.includes('downloadPdf')) {
        requiredJs.push(js);
      }
      return;
    }

    if (js === 'qrcode.js') {
      if (content.includes('qrcode') || content.includes('QRCode') || content.includes('qr-code')) {
        requiredJs.push(js);
      }
      return;
    }

    // Extract element IDs from the JS file
    const matches = jsContent.match(/(?:#|getElementById\(['"])([a-zA-Z0-9_-]+)/g) || [];
    const ids = matches.map(m => m.replace('#', '').replace("getElementById('", '').replace('getElementById("', ''));
    
    let hitCount = 0;
    for (const id of new Set(ids)) {
      if (id.length > 2 && !['DOMContentLoaded', 'mobileMenuBtn', 'mobileMenu', 'click', 'open', 'class', 'hidden'].includes(id)) {
        if (content.includes(`id="${id}"`) || content.includes(`id='${id}'`)) {
          hitCount++;
        }
      }
    }
    if (hitCount >= 1) {
      requiredJs.push(js);
    }
  });

  // Ensure requiredJs script tags are present in the HTML file before </head>
  let scriptAdded = false;
  requiredJs.forEach(js => {
    const scriptTag = `<script src="${js}" defer></script>`;
    if (!content.includes(`src="${js}"`) && !content.includes(`src='${js}'`)) {
      // Insert before </head>
      content = content.replace('</head>', `  ${scriptTag}\n</head>`);
      scriptAdded = true;
    }
  });

  if (scriptAdded) {
    fs.writeFileSync(html, content, 'utf8');
    updatedCount++;
    console.log(`Updated ${html} with scripts: ${requiredJs.join(', ')}`);
  }
});

console.log(`Total HTML files restored: ${updatedCount}`);
