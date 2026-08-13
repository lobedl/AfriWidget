const fs = require('fs');

const jsFiles = [
  'academic-tools.js',
  'academic-utilities.js',
  'ai-writing-tools.js',
  'health-tools.js',
  'new-tools.js',
  'productivity-tools.js',
  'random-variety.js',
  'universal-ai.js',
  'share-results.js'
];

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const mapping = {};
const unmappedHtml = [];

htmlFiles.forEach(html => {
  const content = fs.readFileSync(html, 'utf8');
  const scriptsInHtml = [];

  // Check script tags currently in HTML
  const scriptTags = content.match(/<script[^>]*src=["']([^"']+)["'][^>]*>/gi) || [];
  const existingSrcs = scriptTags.map(tag => {
    const m = tag.match(/src=["']([^"']+)["']/i);
    return m ? m[1] : '';
  });

  // Find which JS files have element IDs matching this HTML page
  const matchedJs = [];
  jsFiles.forEach(js => {
    const jsContent = fs.readFileSync(js, 'utf8');
    // Extract IDs like $('#xyz') or getElementById('xyz')
    const matches = jsContent.match(/(?:#|getElementById\(['"])([a-zA-Z0-9_-]+)/g) || [];
    const ids = matches.map(m => m.replace('#', '').replace("getElementById('", '').replace('getElementById("', ''));
    
    let hitCount = 0;
    for (const id of new Set(ids)) {
      if (id.length > 2 && !['DOMContentLoaded', 'mobileMenuBtn', 'mobileMenu', 'click', 'open'].includes(id)) {
        if (content.includes(`id="${id}"`) || content.includes(`id='${id}'`)) {
          hitCount++;
        }
      }
    }
    if (hitCount >= 1) {
      matchedJs.push(js);
    }
  });

  // Check inline scripts
  const inlineScriptCount = (content.match(/<script>[\s\S]*?<\/script>/gi) || []).length;

  mapping[html] = {
    existingSrcs,
    matchedJs,
    inlineScriptCount
  };

  if (matchedJs.length === 0 && !content.includes('<script>') && html !== '404.html' && html !== 'about.html' && html !== 'contact.html' && html !== 'faq.html' && html !== 'privacy-policy.html' && html !== 'terms.html' && html !== 'cookie-policy.html' && html !== 'adsense-disclaimer.html' && html !== 'index.html' && html !== 'education.html' && html !== 'finance.html' && html !== 'health.html' && html !== 'productivity.html' && html !== 'business.html' && html !== 'admissions.html' && html !== 'real-estate.html' && html !== 'widgets.html') {
    unmappedHtml.push(html);
  }
});

console.log(JSON.stringify(mapping, null, 2));
console.log('UNMAPPED HTML TOOL PAGES:', unmappedHtml);
