/**
 * build-search-engine.js
 * Generates the unified, high-performance search-engine.js for AfriWidget
 */
import fs from 'fs';

const tools = JSON.parse(fs.readFileSync('tools-index.json', 'utf8'));

// Generate search-engine.js
const template = `/**
 * AfriWidget Unified Search Engine
 * - 100% Client-Side & Ultra-High Performance (<1ms search time)
 * - Comprehensive index of all 175+ tools on AfriWidget
 * - Typo tolerance via Damerau-Levenshtein edit distance
 * - Word-order independent token matching & intent awareness
 * - Autocomplete dropdown with highlighted text, category badges, & keyboard navigation
 * - Closest matching tools fallback when no exact match is found
 * - Global Ctrl+K / Cmd+K search shortcut across all pages
 * - Zero external dependencies, mobile-responsive, accessible
 */
(function() {
  'use strict';

  // 1. CANONICAL DATABASE OF ALL AFRIWIDGET TOOLS (Deduplicated)
  const AFRIWIDGET_TOOLS = ${JSON.stringify(tools)};

  // Category Theme Badges
  const CATEGORY_STYLES = {
    'Education': {
      border: 'border-l-yellow-400',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      iconBg: 'bg-yellow-100 text-yellow-800',
      defaultIcon: '🎓'
    },
    'Finance': {
      border: 'border-l-emerald-400',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      iconBg: 'bg-emerald-100 text-emerald-800',
      defaultIcon: '💰'
    },
    'Health': {
      border: 'border-l-teal-400',
      badgeBg: 'bg-teal-100 text-teal-800 border-teal-200',
      iconBg: 'bg-teal-100 text-teal-800',
      defaultIcon: '🩺'
    },
    'Productivity': {
      border: 'border-l-indigo-400',
      badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      iconBg: 'bg-indigo-100 text-indigo-800',
      defaultIcon: '⚡'
    },
    'Business': {
      border: 'border-l-slate-400',
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-200',
      iconBg: 'bg-slate-100 text-slate-800',
      defaultIcon: '💼'
    }
  };

  // Flag/Regional Icon Mapping
  function getToolIcon(tool) {
    const s = (tool.slug + ' ' + (tool.keywords || []).join(' ')).toLowerCase();
    if (s.includes('rwanda') || s.includes('nesa') || s.includes('kigali') || s.includes('mineduc') || s.includes('hec rwanda')) return '🇷🇼';
    if (s.includes('cameroon') || s.includes('cgceb') || s.includes('minesup') || s.includes('buea') || s.includes('bamenda')) return '🇨🇲';
    if (s.includes('liberia') || s.includes('monrovia') || s.includes('cuttington')) return '🇱🇷';
    if (s.includes('malawi') || s.includes('maneb') || s.includes('msce') || s.includes('unima') || s.includes('mubas')) return '🇲🇼';
    if (s.includes('namibia') || s.includes('nssc') || s.includes('unam') || s.includes('nust')) return '🇳🇦';
    if (s.includes('botswana') || s.includes('bgcse') || s.includes('biust')) return '🇧🇼';
    if (s.includes('new zealand') || s.includes('new-zealand') || s.includes('ncea') || s.includes('nzqa')) return '🇳🇿';
    if (s.includes('germany') || s.includes('abitur') || s.includes('bavarian') || s.includes('hochschulstart')) return '🇩🇪';
    if (s.includes('norway') || s.includes('lanekassen') || s.includes('samordna')) return '🇳🇴';
    if (s.includes('switzerland') || s.includes('swiss')) return '🇨🇭';
    if (s.includes('kenya') || s.includes('knec') || s.includes('kcse') || s.includes('kcpe') || s.includes('kuccps')) return '🇰🇪';
    if (s.includes('nigeria') || s.includes('jamb') || s.includes('waec') || s.includes('neco') || s.includes('utme') || s.includes('polytechnic')) return '🇳🇬';
    if (s.includes('ghana') || s.includes('bece') || s.includes('wassce') || s.includes('cwa') || s.includes('cssps')) return '🇬🇭';
    if (s.includes('south africa') || s.includes('matric') || s.includes('aps') || s.includes('nsfas') || s.includes('nsc') || s.includes('tvet') || s.includes('icass') || s.includes('nated') || s.includes('sba')) return '🇿🇦';
    if (s.includes('uganda') || s.includes('ple') || s.includes('uce') || s.includes('uace') || s.includes('uneb')) return '🇺🇬';
    if (s.includes('tanzania') || s.includes('necta') || s.includes('csee') || s.includes('acsee') || s.includes('psle')) return '🇹🇿';
    if (s.includes('zimbabwe') || s.includes('zimsec')) return '🇿🇼';
    if (s.includes('rwanda') || s.includes('reb') || s.includes('nesa')) return '🇷🇼';
    if (s.includes('zambia') || s.includes('ecz')) return '🇿🇲';
    if (s.includes('uk ') || s.includes('uk-') || s.includes('gcse') || s.includes('ucas') || s.includes('tariff') || s.includes('student loan')) return '🇬🇧';
    if (s.includes('australia') || s.includes('atar') || s.includes('hecs') || s.includes('help-debt')) return '🇦🇺';
    if (s.includes('canada') || s.includes('ontario') || s.includes('bc-gpa')) return '🇨🇦';
    if (s.includes('us-') || s.includes('gpa-') || s.includes('gpa scale 4.0')) return '🇺🇸';

    const catStyle = CATEGORY_STYLES[tool.category] || CATEGORY_STYLES['Productivity'];
    return catStyle.defaultIcon;
  }

  // 2. NORMALIZATION & STRING DISTANCE (Damerau-Levenshtein)
  function normalize(str) {
    return String(str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\\u0300-\\u036f]/g, '')
      .replace(/[^a-z0-9\\s]/g, ' ')
      .replace(/\\s+/g, ' ')
      .trim();
  }

  function tokenize(str) {
    return normalize(str).split(' ').filter(Boolean);
  }

  // Intent & Synonyms mapping
  const INTENT_SYNONYMS = {
    'calc': ['calculator', 'calculate'],
    'cal': ['calculator'],
    'compute': ['calculator'],
    'eval': ['calculator'],
    'gpa': ['cgpa', 'grade', 'grades', 'transcript', 'academic'],
    'cgpa': ['gpa', 'cumulative', 'transcript'],
    'marks': ['grades', 'score', 'points'],
    'scores': ['score', 'points', 'aggregate'],
    'aggregate': ['points', 'score', 'admission'],
    'admission': ['aggregate', 'cutoff', 'eligibility', 'cluster', 'points'],
    'cutoff': ['admission', 'cluster', 'eligibility', 'points'],
    'cluster': ['points', 'kuccps', 'admission'],
    'points': ['aggregate', 'score', 'aps', 'ucas', 'tariff'],
    'scholarship': ['bursary', 'funding', 'grant', 'allowance', 'nsfas'],
    'bursary': ['scholarship', 'funding', 'nsfas', 'allowance'],
    'loan': ['finance', 'mortgage', 'interest', 'debt', 'student loan'],
    'mortgage': ['loan', 'interest', 'repayment', 'home'],
    'tax': ['salary', 'paye', 'income', 'vat'],
    'salary': ['wage', 'pay', 'hourly', 'income', 'freelance'],
    'freelance': ['hourly', 'rate', 'pricing', 'invoice'],
    'invoice': ['billing', 'receipt', 'freelance'],
    'weight': ['bmi', 'bmr', 'body', 'health', 'calorie'],
    'calorie': ['calories', 'bmr', 'diet', 'macro', 'nutrition'],
    'tvet': ['college', 'icass', 'nated', 'ncv', 'dhet'],
    'college': ['tvet', 'university', 'tertiary'],
    'matric': ['nsc', 'aps', 'sba', 'south africa'],
    'reading': ['words', 'reading time', 'wpm', 'speed'],
    'timer': ['countdown', 'stopwatch', 'pomodoro', 'clock'],
    'convert': ['converter', 'conversion', 'exchange'],
    'formatter': ['validator', 'json', 'beautifier']
  };

  function getExpandedTokens(tokens) {
    const set = new Set(tokens);
    for (const t of tokens) {
      if (INTENT_SYNONYMS[t]) {
        for (const syn of INTENT_SYNONYMS[t]) {
          set.add(syn);
        }
      }
    }
    return Array.from(set);
  }

  function damerauLevenshtein(a, b) {
    if (a === b) return 0;
    const la = a.length;
    const lb = b.length;
    if (!la) return lb;
    if (!lb) return la;

    const d = [];
    for (let i = 0; i <= la; i++) d[i] = [i];
    for (let j = 0; j <= lb; j++) d[0][j] = j;

    for (let i = 1; i <= la; i++) {
      for (let j = 1; j <= lb; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        d[i][j] = Math.min(
          d[i - 1][j] + 1,       // deletion
          d[i][j - 1] + 1,       // insertion
          d[i - 1][j - 1] + cost // substitution
        );
        // Transposition
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
        }
      }
    }
    return d[la][lb];
  }

  // 3. CORE SEARCH ALGORITHM
  function search(rawQuery, options = {}) {
    const query = String(rawQuery || '').trim();
    if (!query) return { results: [], isClosestMatch: false, query: '' };

    const normQ = normalize(query);
    if (!normQ) return { results: [], isClosestMatch: false, query: '' };

    const originalTokens = tokenize(normQ);
    const expandedTokens = getExpandedTokens(originalTokens);
    const categoryFilter = options.category && options.category !== 'all' ? options.category.toLowerCase() : null;
    const limit = options.limit || 12;

    const scored = [];
    const seenSlugs = new Set();

    for (const tool of AFRIWIDGET_TOOLS) {
      if (seenSlugs.has(tool.slug)) continue;

      const normName = normalize(tool.name);
      const normShortName = normalize(tool.shortName || tool.name);
      const normDesc = normalize(tool.description);
      const normCat = normalize(tool.category);
      const normSlug = normalize(tool.slug);
      const kwTokens = (tool.keywords || []).map(normalize);
      const nameTokens = tokenize(normName);
      const descTokens = tokenize(normDesc);

      // Category filter check if specified
      if (categoryFilter) {
        const catKey = categoryFilter.replace('real-estate', 'realestate').replace('tech', 'productivity');
        const toolCatKey = normCat.replace('real-estate', 'realestate');
        if (!toolCatKey.includes(catKey) && !normSlug.includes(catKey)) {
          continue;
        }
      }

      let score = 0;
      let exactPhraseMatch = false;

      // Full phrase matches (Highest priority)
      if (normShortName === normQ || normName === normQ) {
        score += 500;
        exactPhraseMatch = true;
      } else if (normShortName.startsWith(normQ) || normName.startsWith(normQ)) {
        score += 300;
        exactPhraseMatch = true;
      } else if (normName.includes(normQ) || normShortName.includes(normQ)) {
        score += 200;
        exactPhraseMatch = true;
      } else if (normSlug.includes(normQ.replace(/\\s+/g, '-'))) {
        score += 150;
      } else if (normDesc.includes(normQ)) {
        score += 80;
      }

      // Word-Order Independent Token Matching
      let matchedOriginalTokens = 0;
      let tokenScoreAccum = 0;

      for (const qToken of originalTokens) {
        let bestTokenScore = 0;

        // 1. Name tokens check (weight: 3.5)
        for (const nToken of nameTokens) {
          if (nToken === qToken) {
            bestTokenScore = Math.max(bestTokenScore, 100 * 3.5);
          } else if (nToken.startsWith(qToken)) {
            bestTokenScore = Math.max(bestTokenScore, 85 * 3.5);
          } else if (nToken.includes(qToken)) {
            bestTokenScore = Math.max(bestTokenScore, 65 * 3.5);
          } else {
            // Typo / Edit Distance check
            const maxEd = qToken.length >= 8 ? 3 : qToken.length >= 5 ? 2 : qToken.length >= 3 ? 1 : 0;
            if (maxEd > 0) {
              const ed = damerauLevenshtein(qToken, nToken);
              if (ed <= maxEd) {
                const sim = 1 - (ed / Math.max(qToken.length, nToken.length));
                bestTokenScore = Math.max(bestTokenScore, sim * 80 * 3.5);
              }
            }
          }
        }

        // 2. Slug check (weight: 3.0)
        if (normSlug.includes(qToken)) {
          bestTokenScore = Math.max(bestTokenScore, 85 * 3.0);
        } else {
          const slugParts = normSlug.split('-');
          for (const sPart of slugParts) {
            const maxEd = qToken.length >= 8 ? 3 : qToken.length >= 5 ? 2 : qToken.length >= 3 ? 1 : 0;
            if (maxEd > 0) {
              const ed = damerauLevenshtein(qToken, sPart);
              if (ed <= maxEd) {
                const sim = 1 - (ed / Math.max(qToken.length, sPart.length));
                bestTokenScore = Math.max(bestTokenScore, sim * 70 * 3.0);
              }
            }
          }
        }

        // 3. Keywords check (weight: 2.5)
        for (const kw of kwTokens) {
          if (kw === qToken) {
            bestTokenScore = Math.max(bestTokenScore, 95 * 2.5);
          } else if (kw.startsWith(qToken)) {
            bestTokenScore = Math.max(bestTokenScore, 80 * 2.5);
          } else if (kw.includes(qToken)) {
            bestTokenScore = Math.max(bestTokenScore, 60 * 2.5);
          } else {
            const maxEd = qToken.length >= 8 ? 3 : qToken.length >= 5 ? 2 : qToken.length >= 3 ? 1 : 0;
            if (maxEd > 0) {
              const ed = damerauLevenshtein(qToken, kw);
              if (ed <= maxEd) {
                const sim = 1 - (ed / Math.max(qToken.length, kw.length));
                bestTokenScore = Math.max(bestTokenScore, sim * 70 * 2.5);
              }
            }
          }
        }

        // 4. Category check (weight: 2.0)
        if (normCat.includes(qToken)) {
          bestTokenScore = Math.max(bestTokenScore, 85 * 2.0);
        }

        // 5. Description check (weight: 1.0)
        for (const dToken of descTokens) {
          if (dToken === qToken) {
            bestTokenScore = Math.max(bestTokenScore, 60 * 1.0);
            break;
          } else if (dToken.startsWith(qToken)) {
            bestTokenScore = Math.max(bestTokenScore, 40 * 1.0);
          }
        }

        // 6. Intent synonyms check (weight: 1.8)
        if (bestTokenScore < 50) {
          const synonyms = INTENT_SYNONYMS[qToken] || [];
          for (const syn of synonyms) {
            if (normName.includes(syn) || normSlug.includes(syn)) {
              bestTokenScore = Math.max(bestTokenScore, 65 * 1.8);
            } else if (kwTokens.some(k => k.includes(syn))) {
              bestTokenScore = Math.max(bestTokenScore, 50 * 1.8);
            }
          }
        }

        if (bestTokenScore > 0) {
          matchedOriginalTokens++;
          tokenScoreAccum += bestTokenScore;
        }
      }

      // Bonus for complete token coverage (all query words matched)
      if (matchedOriginalTokens > 0) {
        const coverageRatio = matchedOriginalTokens / originalTokens.length;
        if (coverageRatio === 1) {
          score += tokenScoreAccum * 1.5; // Complete match multiplier!
        } else {
          score += tokenScoreAccum * coverageRatio * 0.7;
        }
      }

      if (score >= 35) {
        seenSlugs.add(tool.slug);
        scored.push({
          tool,
          score,
          isClosestMatch: false
        });
      }
    }

    // Sort by relevance score descending
    scored.sort((a, b) => b.score - a.score);

    // If matches found, return top results
    if (scored.length > 0) {
      return {
        results: scored.slice(0, limit),
        isClosestMatch: false,
        query
      };
    }

    // FALLBACK: Closest matching tools when no exact/token match is found
    const closestScored = [];
    for (const tool of AFRIWIDGET_TOOLS) {
      const normName = normalize(tool.shortName || tool.name);
      const normSlug = normalize(tool.slug);
      // Compare query with tool name prefix and slug
      const edName = damerauLevenshtein(normQ, normName.slice(0, Math.max(normQ.length + 4, 12)));
      const edSlug = damerauLevenshtein(normQ, normSlug.slice(0, Math.max(normQ.length + 4, 12)));
      const bestEd = Math.min(edName, edSlug);
      const maxLen = Math.max(normQ.length, normName.length);
      const similarity = 1 - (bestEd / maxLen);

      closestScored.push({
        tool,
        score: similarity,
        isClosestMatch: true
      });
    }

    closestScored.sort((a, b) => b.score - a.score);
    return {
      results: closestScored.slice(0, Math.min(limit, 6)),
      isClosestMatch: true,
      query
    };
  }

  // 4. HIGHLIGHT HELPER
  function highlightMatches(text, query) {
    if (!text || !query) return escapeHtml(text || '');
    const tokens = tokenize(query);
    if (!tokens.length) return escapeHtml(text);

    const escaped = tokens
      .filter(t => t.length >= 2)
      .map(t => t.replace(/[.*+?^$\${}()|[\\]\\\\]/g, '\\\\$&'));
    if (!escaped.length) return escapeHtml(text);

    const regex = new RegExp('(' + escaped.join('|') + ')', 'gi');
    return escapeHtml(text).replace(regex, '<mark class="bg-yellow-200/90 text-slate-950 font-semibold px-0.5 rounded">$1</mark>');
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // 5. TOOL CARD HTML GENERATOR
  function renderToolCard(tool, isClosest = false) {
    const catStyle = CATEGORY_STYLES[tool.category] || CATEGORY_STYLES['Productivity'];
    const icon = getToolIcon(tool);
    const href = tool.url || ('/' + tool.slug);
    const searchData = [tool.slug, tool.name, tool.description, (tool.keywords || []).join(' ')].join(' ').toLowerCase();

    return \`
      <a class="tool-card group rounded-2xl border border-slate-200 \${catStyle.border} border-l-4 bg-white p-5 transition-all hover:shadow-md hover:border-slate-300 flex flex-col justify-between" 
         data-tool-card 
         data-category="\${tool.category.toLowerCase()}" 
         data-search="\${escapeHtml(searchData)}" 
         href="\${href}">
        <div>
          <div class="mb-4 flex items-start justify-between">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl \${catStyle.iconBg}">
              <span class="text-xl">\${icon}</span>
            </span>
            <span class="text-xs font-bold px-2 py-0.5 rounded-full \${catStyle.badgeBg}">
              \${tool.category}
            </span>
          </div>
          <h4 class="text-lg font-extrabold text-slate-950 group-hover:text-yellow-600 transition-colors">
            \${escapeHtml(tool.shortName || tool.name)}
          </h4>
          <p class="mt-2 text-sm leading-6 text-slate-600 line-clamp-3">
            \${escapeHtml(tool.description)}
          </p>
        </div>
        <div class="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span class="inline-flex items-center gap-1.5 text-sm font-extrabold text-slate-950 group-hover:text-yellow-600 transition-colors">
            Launch tool <span aria-hidden="true">→</span>
          </span>
          \${isClosest ? '<span class="text-[10.5px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">Closest Match</span>' : ''}
        </div>
      </a>
    \`;
  }

  // 6. AUTOCOMPLETE DROPDOWN CONTROLLER
  function attachAutocomplete(inputElement, options = {}) {
    if (!inputElement) return;

    let dropdown = document.getElementById(inputElement.id + '-autocomplete');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.id = inputElement.id + '-autocomplete';
      dropdown.className = 'autocomplete-dropdown absolute left-0 right-0 top-full mt-2 w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-[60] hidden transition-all';
      dropdown.setAttribute('role', 'listbox');
      dropdown.setAttribute('aria-label', 'Search suggestions');

      const parent = inputElement.closest('form') || inputElement.parentElement;
      if (parent) {
        if (!parent.classList.contains('relative')) {
          parent.classList.add('relative');
        }
        parent.appendChild(dropdown);
      } else {
        document.body.appendChild(dropdown);
      }
    }

    let activeIndex = -1;
    let currentResults = [];
    let debounceTimer = null;

    function renderDropdown(searchResult) {
      const { results, isClosestMatch, query } = searchResult;
      currentResults = results;
      activeIndex = -1;

      if (!query || results.length === 0) {
        dropdown.classList.add('hidden');
        dropdown.innerHTML = '';
        inputElement.setAttribute('aria-expanded', 'false');
        return;
      }

      let html = '';

      if (isClosestMatch) {
        html += \`
          <div class="px-4 py-2.5 bg-amber-50 border-b border-amber-100 text-xs font-bold text-amber-900 flex items-center justify-between">
            <span class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              No exact match for “\${escapeHtml(query)}”. Closest matching tools:
            </span>
          </div>
        \`;
      } else {
        html += \`
          <div class="px-4 py-2 bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Tools matching “\${escapeHtml(query)}”</span>
            <span class="text-yellow-600 font-extrabold">\${results.length} \${results.length === 1 ? 'result' : 'results'}</span>
          </div>
        \`;
      }

      html += '<div class="max-h-[380px] overflow-y-auto divide-y divide-slate-100 py-1" role="listbox">';
      results.forEach((item, idx) => {
        const tool = item.tool;
        const catStyle = CATEGORY_STYLES[tool.category] || CATEGORY_STYLES['Productivity'];
        const icon = getToolIcon(tool);
        const highlightedTitle = highlightMatches(tool.shortName || tool.name, query);
        const highlightedDesc = highlightMatches(tool.description, query);
        const href = tool.url || ('/' + tool.slug);

        html += \`
          <a href="\${href}" 
             id="search-opt-\${idx}" 
             role="option" 
             aria-selected="false" 
             data-index="\${idx}"
             class="autocomplete-item block px-4 py-3 hover:bg-yellow-50/60 transition-colors cursor-pointer group">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2.5 min-w-0">
                <span class="text-base shrink-0">\${icon}</span>
                <span class="text-sm font-extrabold text-slate-900 group-hover:text-yellow-700 truncate">
                  \${highlightedTitle}
                </span>
              </div>
              <span class="text-[10.5px] font-bold px-2 py-0.5 rounded-full \${catStyle.badgeBg} shrink-0">
                \${tool.category}
              </span>
            </div>
            <p class="mt-1 text-xs text-slate-500 line-clamp-1 group-hover:text-slate-700">
              \${highlightedDesc}
            </p>
          </a>
        \`;
      });
      html += '</div>';

      html += \`
        <div class="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span class="flex items-center gap-1">
            <kbd class="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-600 shadow-2xs">↑</kbd>
            <kbd class="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-600 shadow-2xs">↓</kbd>
            navigate
          </span>
          <span class="flex items-center gap-1">
            <kbd class="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-600 shadow-2xs">Enter</kbd>
            launch
          </span>
          <span class="flex items-center gap-1">
            <kbd class="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-600 shadow-2xs">Esc</kbd>
            close
          </span>
        </div>
      \`;

      dropdown.innerHTML = html;
      dropdown.classList.remove('hidden');
      inputElement.setAttribute('aria-expanded', 'true');

      dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', () => {
          dropdown.classList.add('hidden');
          inputElement.setAttribute('aria-expanded', 'false');
        });
      });
    }

    function updateActiveItem(newIndex) {
      const items = dropdown.querySelectorAll('.autocomplete-item');
      if (!items.length) return;

      if (activeIndex >= 0 && items[activeIndex]) {
        items[activeIndex].classList.remove('bg-yellow-50', 'border-l-4', 'border-yellow-400');
        items[activeIndex].setAttribute('aria-selected', 'false');
      }

      activeIndex = newIndex;

      if (activeIndex >= 0 && items[activeIndex]) {
        const item = items[activeIndex];
        item.classList.add('bg-yellow-50', 'border-l-4', 'border-yellow-400');
        item.setAttribute('aria-selected', 'true');
        item.scrollIntoView({ block: 'nearest' });
      }
    }

    inputElement.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const query = inputElement.value;
        const res = search(query, options);
        renderDropdown(res);
        if (options.onSearch) {
          options.onSearch(res);
        }
      }, 40);
    });

    inputElement.addEventListener('focus', () => {
      if (inputElement.value.trim().length > 0) {
        const res = search(inputElement.value, options);
        renderDropdown(res);
      }
    });

    inputElement.addEventListener('keydown', (e) => {
      const items = dropdown.querySelectorAll('.autocomplete-item');
      if (dropdown.classList.contains('hidden') || !items.length) {
        if (e.key === 'ArrowDown' && inputElement.value.trim()) {
          const res = search(inputElement.value, options);
          renderDropdown(res);
          e.preventDefault();
        }
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = (activeIndex + 1) % items.length;
        updateActiveItem(next);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = (activeIndex - 1 + items.length) % items.length;
        updateActiveItem(prev);
      } else if (e.key === 'Enter') {
        if (activeIndex >= 0 && items[activeIndex]) {
          e.preventDefault();
          items[activeIndex].click();
        }
      } else if (e.key === 'Escape') {
        dropdown.classList.add('hidden');
        inputElement.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('click', (e) => {
      if (!inputElement.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add('hidden');
        inputElement.setAttribute('aria-expanded', 'false');
      }
    });

    return {
      search,
      close: () => {
        dropdown.classList.add('hidden');
        inputElement.setAttribute('aria-expanded', 'false');
      }
    };
  }

  // 7. GLOBAL MODAL SEARCH (Ctrl+K / Cmd+K)
  let globalModalInitialized = false;
  function initGlobalSearchModal() {
    if (globalModalInitialized) return;
    globalModalInitialized = true;

    // Listen for Ctrl+K or Cmd+K
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();

        // If homepage search input exists, focus it
        const hpSearch = document.getElementById('toolSearch');
        if (hpSearch) {
          hpSearch.focus();
          hpSearch.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }

        // If directory search input exists, focus it
        const dirSearch = document.getElementById('directorySearch');
        if (dirSearch) {
          dirSearch.focus();
          dirSearch.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }

        // If category search input exists, focus it
        const catSearch = document.getElementById('categorySearch');
        if (catSearch) {
          catSearch.focus();
          catSearch.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }

        // Otherwise, open global search modal
        openGlobalModal();
      }
    });
  }

  function openGlobalModal() {
    let modal = document.getElementById('afriwidgetGlobalSearchModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'afriwidgetGlobalSearchModal';
      modal.className = 'fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-6 md:p-20 bg-slate-950/70 backdrop-blur-sm transition-opacity';
      modal.innerHTML = \`
        <div class="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden mt-6 sm:mt-10 animate-in fade-in zoom-in-95 duration-150">
          <div class="flex items-center px-4 py-3 border-b border-slate-200">
            <svg class="h-5 w-5 text-slate-400 shrink-0 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke-width="2"/><path stroke-linecap="round" stroke-width="2" d="m20 20-4-4"/></svg>
            <input id="modalSearchInput" type="search" class="w-full bg-transparent text-slate-900 placeholder:text-slate-400 outline-none text-base font-medium" placeholder="Search all 175+ tools (e.g. GPA, BMI, Mortgage, TVET)..." autocomplete="off">
            <kbd class="hidden sm:inline-block text-[11px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded shadow-2xs">Esc</kbd>
          </div>
          <div id="modalSearchResults" class="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-100">
            <div class="p-6 text-center text-slate-400 text-sm">Type to search tools across education, finance, health, and productivity...</div>
          </div>
        </div>
      \`;
      document.body.appendChild(modal);

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });

      const inp = modal.querySelector('#modalSearchInput');
      const resultsCont = modal.querySelector('#modalSearchResults');

      inp.addEventListener('input', () => {
        const q = inp.value.trim();
        if (!q) {
          resultsCont.innerHTML = '<div class="p-6 text-center text-slate-400 text-sm">Type to search tools across education, finance, health, and productivity...</div>';
          return;
        }

        const { results, isClosestMatch } = search(q, { limit: 8 });
        if (results.length === 0) {
          resultsCont.innerHTML = '<div class="p-6 text-center text-slate-500 text-sm font-semibold">No tools found.</div>';
          return;
        }

        let html = '';
        if (isClosestMatch) {
          html += \`<div class="p-2.5 mb-2 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-amber-900">Showing closest matching tools:</div>\`;
        }

        results.forEach(r => {
          const t = r.tool;
          const catStyle = CATEGORY_STYLES[t.category] || CATEGORY_STYLES['Productivity'];
          const icon = getToolIcon(t);
          html += \`
            <a href="\${t.url || '/' + t.slug}" class="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
              <span class="text-xl p-2 rounded-lg \${catStyle.iconBg}">\${icon}</span>
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between gap-2">
                  <h4 class="text-sm font-extrabold text-slate-900 group-hover:text-yellow-600 truncate">\${escapeHtml(t.shortName || t.name)}</h4>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full \${catStyle.badgeBg}">\${t.category}</span>
                </div>
                <p class="text-xs text-slate-500 line-clamp-1 mt-0.5">\${escapeHtml(t.description)}</p>
              </div>
            </a>
          \`;
        });
        resultsCont.innerHTML = html;
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const m = document.getElementById('afriwidgetGlobalSearchModal');
          if (m) m.remove();
        }
      });
    }

    const inp = modal.querySelector('#modalSearchInput');
    if (inp) {
      setTimeout(() => inp.focus(), 50);
    }
  }

  // 8. HOMEPAGE & DIRECTORY AUTO-INTEGRATION
  function initAfriWidgetSearch() {
    initGlobalSearchModal();

    // Category Hub Search Inputs (if any present)
    const catSearch = document.getElementById('categorySearch');
    if (catSearch) {
      attachAutocomplete(catSearch, { limit: 8 });
    }

    // 8.1 HOMEPAGE (index.html) INTEGRATION
    const toolSearch = document.getElementById('toolSearch');
    const toolSearchForm = document.getElementById('toolSearchForm');
    const toolSearchStatus = document.getElementById('toolSearchStatus');
    const toolSections = document.getElementById('toolSections');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const existingCards = Array.from(document.querySelectorAll('[data-tool-card]'));

    if (toolSearch && toolSections) {
      let activeCategory = 'all';

      // Attach autocomplete to homepage search
      attachAutocomplete(toolSearch, {
        limit: 8,
        onSearch: (searchRes) => {
          updateHomepageMatrix(searchRes);
        }
      });

      function updateHomepageMatrix(searchRes) {
        const query = (toolSearch.value || '').trim();
        const { results, isClosestMatch } = searchRes || search(query, { category: activeCategory, limit: 100 });

        // If query is empty, restore normal category view
        if (!query) {
          const dyn = document.getElementById('dynamicSearchResults');
          if (dyn) dyn.remove();

          existingCards.forEach(card => {
            const matchesCat = activeCategory === 'all' || card.dataset.category === activeCategory;
            card.hidden = !matchesCat;
          });

          document.querySelectorAll('[data-category-section]').forEach(sec => {
            const hasVisible = Array.from(sec.querySelectorAll('[data-tool-card]')).some(c => !c.hidden);
            sec.hidden = !hasVisible;
          });

          if (toolSearchStatus) {
            toolSearchStatus.classList.add('hidden');
            toolSearchStatus.textContent = '';
          }
          return;
        }

        // Active search query
        const matchedSlugs = new Set(results.map(r => r.tool.slug));

        // Hide static category sections during active search
        document.querySelectorAll('[data-category-section]').forEach(sec => {
          sec.hidden = true;
        });

        // Render clean unified search results container
        let dynContainer = document.getElementById('dynamicSearchResults');
        if (!dynContainer) {
          dynContainer = document.createElement('div');
          dynContainer.id = 'dynamicSearchResults';
          dynContainer.className = 'mt-6 space-y-6';
          toolSections.parentElement.insertBefore(dynContainer, toolSections);
        }

        let headerHtml = '';
        if (isClosestMatch) {
          headerHtml = \`
            <div class="rounded-2xl bg-amber-50 border border-amber-200 p-4 sm:p-6 mb-6">
              <div class="flex items-center gap-2.5 text-amber-900 font-extrabold text-base sm:text-lg">
                <span class="text-xl">⚡</span>
                <span>No exact match for “\${escapeHtml(query)}”. Here are the closest matching tools:</span>
              </div>
              <p class="mt-1 text-xs sm:text-sm text-amber-700">
                We couldn't find an exact tool named “\${escapeHtml(query)}”, but these related calculators and tools might be what you're looking for:
              </p>
            </div>
          \`;
        } else {
          headerHtml = \`
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-4 mb-6">
              <div>
                <p class="text-xs font-bold uppercase tracking-wider text-yellow-700">Search Results</p>
                <h3 class="text-xl sm:text-2xl font-black text-slate-950">
                  \${results.length} \${results.length === 1 ? 'Tool' : 'Tools'} found for “\${escapeHtml(query)}”
                </h3>
              </div>
              <button type="button" id="clearSearchResultsBtn" class="self-start sm:self-auto text-xs font-bold text-slate-600 hover:text-yellow-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition-colors shadow-2xs">
                Clear search
              </button>
            </div>
          \`;
        }

        let cardsHtml = '<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">';
        results.forEach(item => {
          cardsHtml += renderToolCard(item.tool, isClosestMatch);
        });
        cardsHtml += '</div>';

        dynContainer.innerHTML = headerHtml + cardsHtml;
        dynContainer.hidden = false;

        const clearBtn = document.getElementById('clearSearchResultsBtn');
        if (clearBtn) {
          clearBtn.addEventListener('click', () => {
            toolSearch.value = '';
            updateHomepageMatrix({ results: [], isClosestMatch: false, query: '' });
            toolSearch.focus();
          });
        }

        if (toolSearchStatus) {
          toolSearchStatus.classList.remove('hidden');
          if (isClosestMatch) {
            toolSearchStatus.textContent = \`Showing \${results.length} closest matching tools for “\${query}”.\`;
          } else {
            toolSearchStatus.textContent = \`\${results.length} \${results.length === 1 ? 'tool' : 'tools'} match “\${query}” across all of AfriWidget.\`;
          }
        }
      }

      if (toolSearchForm) {
        toolSearchForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const res = search(toolSearch.value, { category: activeCategory, limit: 60 });
          updateHomepageMatrix(res);
          const matrix = document.getElementById('toolsMatrix');
          if (matrix) {
            matrix.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }

      document.querySelectorAll('[data-quick-search]').forEach(chip => {
        chip.addEventListener('click', (e) => {
          e.preventDefault();
          const query = chip.dataset.quickSearch || chip.textContent.trim();
          toolSearch.value = query;
          activeCategory = 'all';

          categoryFilters.forEach(item => {
            const isAll = item.dataset.filter === 'all';
            item.classList.toggle('bg-slate-950', isAll);
            item.classList.toggle('text-white', isAll);
            item.classList.toggle('border-slate-950', isAll);
            item.classList.toggle('bg-white', !isAll);
            item.classList.toggle('text-slate-700', !isAll);
            item.classList.toggle('border-slate-300', !isAll);
          });

          const res = search(query, { category: 'all', limit: 60 });
          updateHomepageMatrix(res);
          toolSearch.focus();
          const matrix = document.getElementById('toolsMatrix');
          if (matrix) {
            matrix.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });

      categoryFilters.forEach(filter => {
        filter.addEventListener('click', () => {
          activeCategory = filter.dataset.filter || 'all';
          categoryFilters.forEach(item => {
            const isSelected = item === filter;
            item.classList.toggle('bg-slate-950', isSelected);
            item.classList.toggle('text-white', isSelected);
            item.classList.toggle('border-slate-950', isSelected);
            item.classList.toggle('bg-white', !isSelected);
            item.classList.toggle('text-slate-700', !isSelected);
            item.classList.toggle('border-slate-300', !isSelected);
          });

          if (toolSearch.value.trim()) {
            const res = search(toolSearch.value, { category: activeCategory, limit: 60 });
            updateHomepageMatrix(res);
          } else {
            updateHomepageMatrix({ results: [], isClosestMatch: false, query: '' });
          }
        });
      });
    }

    // 8.2 DIRECTORY (widgets.html) INTEGRATION
    const dirSearch = document.getElementById('directorySearch');
    const dirClear = document.getElementById('clearSearchBtn');
    const dirCount = document.getElementById('searchResultCount');
    const dirReset = document.getElementById('resetSearchBtn');
    const dirGrid = document.getElementById('toolGrid');
    const dirFilterBtns = document.querySelectorAll('.cat-filter-btn');

    if (dirSearch && dirGrid) {
      let activeDirCategory = 'all';

      attachAutocomplete(dirSearch, {
        limit: 8,
        onSearch: (searchRes) => {
          updateDirectoryResults(searchRes);
        }
      });

      function updateDirectoryResults(searchRes) {
        const query = (dirSearch.value || '').trim();
        const { results, isClosestMatch } = searchRes || search(query, { category: activeDirCategory, limit: 120 });

        if (dirClear) {
          dirClear.classList.toggle('hidden', !query);
        }

        if (!query) {
          const dyn = document.getElementById('dirSearchResults');
          if (dyn) dyn.remove();

          const cards = dirGrid.querySelectorAll('.tool-card');
          let count = 0;
          cards.forEach(c => {
            const cat = (c.dataset.category || '').toLowerCase();
            const visible = activeDirCategory === 'all' || cat.includes(activeDirCategory.toLowerCase());
            c.classList.toggle('hidden', !visible);
            if (visible) count++;
          });

          dirGrid.querySelectorAll('[id$="-tools"]').forEach(h => {
            let catKey = h.id.replace('-tools', '').toLowerCase();
            if (catKey === 'real-estate') catKey = 'realestate';
            const show = activeDirCategory === 'all' || catKey.includes(activeDirCategory.toLowerCase());
            h.classList.toggle('hidden', !show);
          });

          if (dirCount) {
            dirCount.textContent = (activeDirCategory === 'all' ? AFRIWIDGET_TOOLS.length : count) + ' Tools';
            dirCount.className = 'hidden sm:inline-flex items-center px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg shrink-0';
          }
          return;
        }

        dirGrid.querySelectorAll('.tool-card, [id$="-tools"]').forEach(el => {
          el.classList.add('hidden');
        });

        let dyn = document.getElementById('dirSearchResults');
        if (!dyn) {
          dyn = document.createElement('div');
          dyn.id = 'dirSearchResults';
          dyn.className = 'col-span-full w-full space-y-6';
          dirGrid.insertBefore(dyn, dirGrid.firstChild);
        }

        let headerHtml = '';
        if (isClosestMatch) {
          headerHtml = \`
            <div class="rounded-2xl bg-amber-50 border border-amber-200 p-4 sm:p-6 mb-6">
              <div class="flex items-center gap-2.5 text-amber-900 font-extrabold text-base sm:text-lg">
                <span class="text-xl">⚡</span>
                <span>No exact match for “\${escapeHtml(query)}”. Showing closest matching tools:</span>
              </div>
            </div>
          \`;
        }

        let cardsHtml = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">';
        results.forEach(item => {
          cardsHtml += renderToolCard(item.tool, isClosestMatch);
        });
        cardsHtml += '</div>';

        dyn.innerHTML = headerHtml + cardsHtml;
        dyn.hidden = false;

        if (dirCount) {
          dirCount.textContent = isClosestMatch 
            ? \`\${results.length} Closest Matches\` 
            : \`\${results.length} Tools found\`;
          dirCount.className = 'hidden sm:inline-flex items-center px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-100 rounded-lg shrink-0';
        }
      }

      if (dirClear) {
        dirClear.addEventListener('click', () => {
          dirSearch.value = '';
          updateDirectoryResults({ results: [], isClosestMatch: false, query: '' });
          dirSearch.focus();
        });
      }

      if (dirReset) {
        dirReset.addEventListener('click', () => {
          dirSearch.value = '';
          activeDirCategory = 'all';
          updateActiveFilterButtons();
          updateDirectoryResults({ results: [], isClosestMatch: false, query: '' });
          dirSearch.focus();
        });
      }

      document.querySelectorAll('[data-search-tag]').forEach(tag => {
        tag.addEventListener('click', (e) => {
          e.preventDefault();
          const q = tag.dataset.searchTag || tag.textContent.trim();
          dirSearch.value = q;
          const res = search(q, { category: activeDirCategory, limit: 120 });
          updateDirectoryResults(res);
          dirSearch.focus();
        });
      });

      function updateActiveFilterButtons() {
        dirFilterBtns.forEach(btn => {
          const cat = btn.getAttribute('data-category-filter') || btn.dataset.category || 'all';
          const isSel = (cat === activeDirCategory);
          if (isSel) {
            btn.className = 'cat-filter-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border bg-slate-950 text-white border-slate-950 transition-all shadow-sm';
            const badge = btn.querySelector('span:last-child');
            if (badge) badge.className = 'inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] bg-yellow-400 text-slate-950 font-black';
          } else {
            btn.className = 'cat-filter-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-slate-400 transition-all';
            const badge = btn.querySelector('span:last-child');
            if (badge) badge.className = 'inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600 font-bold';
          }
        });
      }

      dirFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          activeDirCategory = btn.getAttribute('data-category-filter') || btn.dataset.category || 'all';
          updateActiveFilterButtons();
          const res = search(dirSearch.value, { category: activeDirCategory, limit: 120 });
          updateDirectoryResults(res);
        });
      });
    }
  }

  // EXPORT GLOBAL API
  window.AFRIWIDGET_TOOLS = AFRIWIDGET_TOOLS;
  window.AfriWidgetSearch = {
    tools: AFRIWIDGET_TOOLS,
    search: search,
    attachAutocomplete: attachAutocomplete,
    renderToolCard: renderToolCard,
    highlightMatches: highlightMatches
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAfriWidgetSearch);
  } else {
    initAfriWidgetSearch();
  }
})();
`;

fs.writeFileSync('search-engine.js', template, 'utf8');
console.log('Successfully generated search-engine.js! Size:', template.length);
