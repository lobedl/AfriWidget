import fs from 'fs';
import path from 'path';

/**
 * AfriWidget Tool Date Synchronization Engine
 * Synchronizes visible "Last Updated" dates, Schema.org JSON-LD dateModified metadata,
 * and sitemap.xml <lastmod> timestamps across all tools and pages.
 */

const DISPLAY_DATE = '19 October 2026';
const ISO_DATE = '2026-10-19';

const rootDir = process.cwd();
const files = fs.readdirSync(rootDir);

let htmlUpdatedCount = 0;
let jsonLdUpdatedCount = 0;

for (const file of files) {
  if (!file.endsWith('.html')) continue;

  const filePath = path.join(rootDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let fileModified = false;

  // 1. Update visible "Last Updated: <span>...</span>"
  if (/Last Updated:\s*<span>[^<]+<\/span>/i.test(content)) {
    content = content.replace(
      /Last Updated:\s*<span>[^<]+<\/span>/gi,
      `Last Updated: <span>${DISPLAY_DATE}</span>`
    );
    fileModified = true;
    htmlUpdatedCount++;
  }

  // 2. Synchronize Schema.org JSON-LD "dateModified"
  content = content.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi, (match, jsonStr) => {
    try {
      const data = JSON.parse(jsonStr);
      let entityUpdated = false;

      const updateEntity = (item) => {
        if (!item || typeof item !== 'object') return false;
        const type = item['@type'];
        if (['WebApplication', 'SoftwareApplication', 'WebPage', 'WebSite', 'AboutPage', 'Article'].includes(type)) {
          item.dateModified = ISO_DATE;
          return true;
        }
        return false;
      };

      if (Array.isArray(data)) {
        for (const item of data) {
          if (updateEntity(item)) {
            entityUpdated = true;
            break;
          }
        }
        if (!entityUpdated && data.length > 0 && typeof data[0] === 'object') {
          data[0].dateModified = ISO_DATE;
          entityUpdated = true;
        }
      } else if (typeof data === 'object') {
        data.dateModified = ISO_DATE;
        entityUpdated = true;
      }

      if (entityUpdated) {
        fileModified = true;
        jsonLdUpdatedCount++;
        return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
      }
    } catch (err) {
      // If parsing fails, leave original
    }
    return match;
  });

  if (fileModified) {
    fs.writeFileSync(filePath, content, 'utf-8');
  }
}

// 3. Synchronize sitemap.xml <lastmod>
const sitemapPath = path.join(rootDir, 'sitemap.xml');
let sitemapCount = 0;
if (fs.existsSync(sitemapPath)) {
  let sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  sitemapContent = sitemapContent.replace(/<lastmod>[^<]+<\/lastmod>/g, () => {
    sitemapCount++;
    return `<lastmod>${ISO_DATE}</lastmod>`;
  });
  fs.writeFileSync(sitemapPath, sitemapContent, 'utf-8');
}

console.log(`Synchronization complete:`);
console.log(`- Visible Last Updated dates synchronized in ${htmlUpdatedCount} HTML files -> "${DISPLAY_DATE}"`);
console.log(`- Schema.org dateModified metadata synchronized in ${jsonLdUpdatedCount} files -> "${ISO_DATE}"`);
console.log(`- sitemap.xml synchronized for ${sitemapCount} URLs -> "${ISO_DATE}"`);
