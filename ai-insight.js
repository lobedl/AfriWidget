/**
 * AfriWidget AI Insight Client Formatter & Linkifier
 * Automatically formats structured 7-section AI insights into clean, semantic HTML with clickable links.
 */
(function () {
  'use strict';

  // Inject supportive styles for structured sections and links
  var style = document.createElement('style');
  style.setAttribute('data-afriwidget-ai-style', 'true');
  style.textContent = `
    .ai-output { white-space: normal !important; line-height: 1.75 !important; font-size: 0.875rem !important; color: #222222 !important; background: #fef3c7 !important; border: 1px solid #facc15 !important; border-left: 4px solid #facc15 !important; border-radius: 0 0.5rem 0.5rem 0 !important; }
    .ai-output .ai-section { background: transparent !important; border: none !important; border-radius: 0 !important; padding: 0 !important; margin: 0 0 0.65rem 0 !important; box-shadow: none !important; }
    .ai-output .ai-section:last-child { margin-bottom: 0 !important; }
    .ai-output .ai-sec-title { display: inline !important; color: #000000 !important; font-weight: 700 !important; font-size: inherit !important; margin-right: 0.25rem !important; }
    .ai-output p { margin: 0 0 0.5rem 0 !important; font-size: inherit !important; color: inherit !important; line-height: inherit !important; }
    .ai-output p:last-child { margin-bottom: 0 !important; }
    .ai-output a { color: #854d0e !important; text-decoration: underline !important; font-weight: 600 !important; word-break: break-all !important; }
    .ai-output a:hover { color: #000000 !important; }
  `;
  if (document.head) {
    document.head.appendChild(style);
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      document.head.appendChild(style);
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function linkify(text) {
    var urlRegex = /(https?:\/\/[^\s<>"'\)]+)/g;
    return text.replace(urlRegex, function (url) {
      var cleanUrl = url.replace(/[.,;:]+$/, '');
      var trailing = url.slice(cleanUrl.length);
      return '<a href="' + cleanUrl + '" target="_blank" rel="noopener noreferrer">' + cleanUrl + '</a>' + trailing;
    });
  }

  function formatInsightText(rawText) {
    if (!rawText || typeof rawText !== 'string') return '';
    var text = rawText.trim();

    // Check if plain text or already HTML
    if (text.includes('<div class="ai-section">')) return text;

    // Ensure clean separation between numbered sections (e.g. "1. Result...", "2. What This Means...")
    text = text.replace(/([^\n])\n(\d\.\s+)/g, '$1\n\n$2');

    // Split text into paragraphs or blocks by double newline
    var blocks = text.split(/\n\s*\n/);
    var htmlBlocks = [];

    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i].trim();
      if (!block) continue;

      // Check if block starts with a section header (e.g. "1. Result & Assessment:", "2. What This Means:", "**1. Result**")
      var headerMatch = block.match(/^(?:(?:\*\*|__)?(\d\.\s+[^:\n*]+(?::\s*[^\n*]+)?)(?:\*\*|__)?(?::|\n|$))\s*([\s\S]*)$/);
      if (headerMatch) {
        var heading = headerMatch[1].trim();
        var body = (headerMatch[2] || '').trim();

        // Clean markdown bold syntax if remaining
        heading = heading.replace(/^\*\*|\*\*$/g, '');
        body = body.replace(/^\*\*|\*\*$/g, '');

        var safeHeading = escapeHtml(heading);
        var safeBody = escapeHtml(body);
        safeBody = linkify(safeBody);
        safeBody = safeBody.replace(/\n/g, '<br>');

        var blockHtml = '<div class="ai-section"><strong class="ai-sec-title">' + safeHeading + '</strong>';
        if (safeBody) {
          blockHtml += '<p>' + safeBody + '</p>';
        }
        blockHtml += '</div>';
        htmlBlocks.push(blockHtml);
      } else {
        var safe = escapeHtml(block);
        safe = linkify(safe);
        safe = safe.replace(/\n/g, '<br>');
        htmlBlocks.push('<p>' + safe + '</p>');
      }
    }

    return htmlBlocks.join('');
  }

  window.formatAfriWidgetInsight = formatInsightText;

  function enhanceAiOutput(el) {
    if (!el || el.dataset.aiEnhanced === 'true') return;

    var raw = el.innerText || el.textContent || '';
    if (!raw.trim() || raw.includes('Calculating') || raw.includes('Generating') || raw.includes('...') || raw.length < 20) {
      return;
    }

    // Check if text has sections or URLs
    if (/^\s*(?:\d\.\s+|Your\s+Result|Assessment)/m.test(raw) || /https?:\/\//.test(raw)) {
      el.dataset.aiEnhanced = 'true';
      el.innerHTML = formatInsightText(raw);
      el.classList.add('visible');
    }
  }

  function scanAndEnhance() {
    var outputs = document.querySelectorAll('.ai-output');
    for (var i = 0; i < outputs.length; i++) {
      enhanceAiOutput(outputs[i]);
    }
  }

  if (typeof MutationObserver !== 'undefined') {
    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (m.target) {
          if (m.target.classList && m.target.classList.contains('ai-output')) {
            enhanceAiOutput(m.target);
          } else if (m.target.parentElement && m.target.parentElement.classList && m.target.parentElement.classList.contains('ai-output')) {
            enhanceAiOutput(m.target.parentElement);
          }
        }
      }
    });

    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
        scanAndEnhance();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scanAndEnhance);
  } else {
    scanAndEnhance();
  }
})();
