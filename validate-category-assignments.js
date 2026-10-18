import fs from "node:fs";
import path from "node:path";

const categoryPages = {
  Business: "business.html",
  Education: "education.html",
  Finance: "finance.html",
  Productivity: "productivity.html",
};

const catalog = JSON.parse(fs.readFileSync("tools-index.json", "utf8"));
const registryBySlug = new Map();
const listedBySlug = new Map();
const counts = {};
const errors = [];

for (const tool of catalog) {
  if (!tool.slug || !tool.url || !categoryPages[tool.category]) {
    errors.push(`Invalid catalog entry: ${JSON.stringify(tool)}`);
    continue;
  }
  if (registryBySlug.has(tool.slug)) {
    errors.push(`Duplicate catalog record: ${tool.slug}`);
  }
  registryBySlug.set(tool.slug, tool);
}

for (const [category, filename] of Object.entries(categoryPages)) {
  const html = fs.readFileSync(path.join(process.cwd(), filename), "utf8");
  const anchors = html.match(/<a\b[^>]*>/gi) || [];
  const seenOnPage = new Set();
  counts[category] = 0;

  for (const navPattern of [
    /<div class="nav-links">[\s\S]*?<\/div>/i,
    /<div id="mobileMenu" class="mobile-menu">[\s\S]*?<\/div>/i,
  ]) {
    const nav = html.match(navPattern)?.[0] || "";
    for (const route of Object.values(categoryPages).map((page) =>
      page.replace(".html", "")
    )) {
      if (!nav.includes(`href="/${route}"`)) {
        errors.push(`${filename} is missing the ${route} link in a category navigation menu.`);
      }
    }
  }

  for (const anchor of anchors) {
    const classes = anchor.match(/\bclass="([^"]*)"/i)?.[1]?.split(/\s+/) || [];
    if (!classes.includes("tool-card-lg")) continue;

    const href = anchor.match(/\bhref="([^"]+)"/i)?.[1];
    if (!href || !href.startsWith("/")) {
      errors.push(`${filename} has a primary card without a local URL.`);
      continue;
    }

    const slug = href.slice(1).split(/[?#]/)[0].replace(/\.html$/, "");
    counts[category]++;

    if (seenOnPage.has(slug)) {
      errors.push(`${slug} appears more than once in ${category}.`);
    }
    seenOnPage.add(slug);

    if (listedBySlug.has(slug)) {
      errors.push(`${slug} is listed in both ${listedBySlug.get(slug)} and ${category}.`);
    } else {
      listedBySlug.set(slug, category);
    }

    const tool = registryBySlug.get(slug);
    if (!tool) {
      errors.push(`${slug} is listed in ${filename} but missing from tools-index.json.`);
    } else if (tool.category !== category) {
      errors.push(`${slug} is listed in ${category}, but its catalog category is ${tool.category}.`);
    }
  }
}

const homepage = fs.readFileSync("index.html", "utf8");
const homepageAnchors = homepage.match(/<a\b[^>]*>[\s\S]*?<\/a>/gi) || [];
for (const anchor of homepageAnchors) {
  const classes = anchor.match(/\bclass="([^"]*)"/i)?.[1]?.split(/\s+/) || [];
  if (!classes.some((name) => name === "tool-card" || name === "tool-card-lg")) {
    continue;
  }

  const href = anchor.match(/\bhref="\/([^"?#]+)"/i)?.[1];
  const label = anchor.match(
    /<span class="tool-card-cat">([^<]+)<\/span>/i
  )?.[1]?.trim();
  if (!href || !categoryPages[label]) continue;

  const slug = href.replace(/\.html$/, "");
  const tool = registryBySlug.get(slug);
  if (tool && tool.category !== label) {
    errors.push(`Homepage labels ${slug} as ${label}, but its primary category is ${tool.category}.`);
  }
}

for (const slug of registryBySlug.keys()) {
  if (!listedBySlug.has(slug)) {
    errors.push(`${slug} is in tools-index.json but absent from all primary category pages.`);
  }
}

if (errors.length) {
  console.error("Category assignment check failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log("Category assignments are unique and consistent.");
  for (const [category, count] of Object.entries(counts)) {
    console.log(`${category}: ${count}`);
  }
  console.log(`Total unique tools: ${listedBySlug.size}`);
}
