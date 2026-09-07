/**
 * AfriWidget Category Hub Instant Search & Sub-Filter Engine
 * 100% Client-Side • Instant 0ms Latency • Zero Dependencies
 */
(function() {
  'use strict';

  function initCategoryFilter() {
    var searchInput = document.getElementById('categorySearch');
    var clearBtn = document.getElementById('clearCategorySearch');
    var countBadge = document.getElementById('categorySearchCount');
    var headingCount = document.getElementById('categoryHeadingCount');
    var grid = document.querySelector('.category-tool-grid');
    var noResults = document.getElementById('categoryNoResults');
    var resetBtn = document.getElementById('categoryResetBtn');
    var filterBtns = document.querySelectorAll('.category-filter-btn');

    if (!grid) return;

    var cards = Array.from(grid.querySelectorAll('.category-tool-card'));
    var totalTools = cards.length;
    var currentSubFilter = 'all';

    // Index cards for ultra-fast matching
    var cardIndex = cards.map(function(card) {
      var h3 = card.querySelector('h3');
      var p = card.querySelector('p');
      var tag = card.querySelector('.category-tool-tag');
      var titleText = h3 ? h3.textContent.toLowerCase() : '';
      var descText = p ? p.textContent.toLowerCase() : '';
      var tagText = tag ? tag.textContent.toLowerCase() : '';
      var customTags = (card.getAttribute('data-subfilter') || '').toLowerCase();
      var href = (card.getAttribute('href') || '').toLowerCase();

      return {
        el: card,
        title: titleText,
        desc: descText,
        tag: tagText,
        filterGroup: customTags,
        href: href,
        fullText: (titleText + ' ' + descText + ' ' + tagText + ' ' + customTags + ' ' + href)
      };
    });

    function applyFilter() {
      var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
      var visibleCount = 0;

      // Toggle clear button
      if (clearBtn) {
        clearBtn.style.display = query.length > 0 ? 'inline-block' : 'none';
      }

      cardIndex.forEach(function(item) {
        var matchesQuery = true;
        if (query.length > 0) {
          // Check query tokens
          var tokens = query.split(/\s+/).filter(Boolean);
          matchesQuery = tokens.every(function(t) {
            return item.fullText.indexOf(t) !== -1;
          });
        }

        var matchesSubFilter = true;
        if (currentSubFilter && currentSubFilter !== 'all') {
          var targetFilter = currentSubFilter.toLowerCase();
          matchesSubFilter = (
            item.filterGroup.indexOf(targetFilter) !== -1 ||
            item.tag.indexOf(targetFilter) !== -1 ||
            item.title.indexOf(targetFilter) !== -1 ||
            item.desc.indexOf(targetFilter) !== -1 ||
            item.href.indexOf(targetFilter) !== -1
          );
        }

        if (matchesQuery && matchesSubFilter) {
          item.el.style.display = '';
          visibleCount++;
        } else {
          item.el.style.display = 'none';
        }
      });

      // Update counters
      var countText = visibleCount === totalTools 
        ? totalTools + ' Tools' 
        : 'Showing ' + visibleCount + ' of ' + totalTools;

      if (countBadge) countBadge.textContent = countText;
      if (headingCount) headingCount.textContent = countText;

      // Handle zero results
      if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    // Bind search input
    if (searchInput) {
      searchInput.addEventListener('input', applyFilter);
      searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          searchInput.value = '';
          applyFilter();
        }
      });
    }

    // Bind clear button
    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        applyFilter();
      });
    }

    // Bind reset button
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        if (searchInput) searchInput.value = '';
        currentSubFilter = 'all';
        filterBtns.forEach(function(btn) {
          btn.classList.toggle('is-active', (btn.getAttribute('data-subfilter') || 'all') === 'all');
        });
        applyFilter();
        if (searchInput) searchInput.focus();
      });
    }

    // Bind filter pill buttons
    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        filterBtns.forEach(function(b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        currentSubFilter = btn.getAttribute('data-subfilter') || 'all';
        applyFilter();
      });
    });

    // Global Ctrl+K / Cmd+K listener
    window.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        if (searchInput) {
          e.preventDefault();
          searchInput.focus();
          searchInput.select();
        }
      }
    });

    // Initial run to set badges
    applyFilter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCategoryFilter);
  } else {
    initCategoryFilter();
  }
})();
