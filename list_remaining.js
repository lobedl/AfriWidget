import fs from 'fs';

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && !f.includes('node_modules'));

const boilerplateFiles = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');

  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  const metaDescMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)
    || content.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
  const metaDesc = metaDescMatch ? metaDescMatch[1].trim() : '';

  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ') : '';

  if (metaDesc.includes('zero signup') || metaDesc.includes('Calculate instantly in your browser') || metaDesc.startsWith('Free online') && metaDesc.includes('tool.')) {
    boilerplateFiles.push({ file, title, h1, metaDesc });
  }
});

console.log(`Total remaining boilerplate files: ${boilerplateFiles.length}`);
console.log(JSON.stringify(boilerplateFiles, null, 2));
