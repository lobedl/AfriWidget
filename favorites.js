/**
 * AfriWidget Favourites System
 * Allows users to bookmark/favourite any tool across AfriWidget.
 * Stored in localStorage ('afriwidget_favorites').
 * Pure vanilla CSS (Zero Tailwind, Zero Emojis, 100% Crisp SVG Icons).
 * Matches AfriWidget Brand System (#000000, #facc15, #ffffff, #111827).
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'afriwidget_favorites';

  // Crisp SVG Icons (Zero Emojis)
  const ICONS = {
    starOutline: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    starFilled: `<svg viewBox="0 0 24 24" fill="#facc15" stroke="#ca8a04" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    starFilledDark: `<svg viewBox="0 0 24 24" fill="#000000" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    brandWidget: `<svg viewBox="0 0 36 36" fill="none" aria-hidden="true"><path d="M18 4L20.5 14L30 18L20.5 22L18 32L15.5 22L6 18L15.5 14Z" fill="#FACC15"/><circle cx="28" cy="9" r="2.5" fill="#CA8A04"/><circle cx="9" cy="11" r="1.5" fill="#FACC15" opacity="0.7"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
    arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`
  };

  // Safe localStorage accessor
  function getFavorites() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('AfriWidget Favourites: localStorage read error', e);
      return [];
    }
  }

  function saveFavorites(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('afriwidget_favorites_updated', { detail: { favorites: list } }));
    } catch (e) {
      console.warn('AfriWidget Favourites: localStorage write error', e);
    }
  }

  function isFavorite(url) {
    const norm = normalizeUrl(url);
    const list = getFavorites();
    return list.some(item => normalizeUrl(item.url) === norm);
  }

  function toggleFavorite(toolData) {
    const list = getFavorites();
    const norm = normalizeUrl(toolData.url);
    const existingIndex = list.findIndex(item => normalizeUrl(item.url) === norm);
    let added = false;

    if (existingIndex > -1) {
      list.splice(existingIndex, 1);
      added = false;
    } else {
      list.unshift({
        url: norm,
        title: toolData.title || 'Calculator Tool',
        category: toolData.category || 'General',
        description: toolData.description || '',
        addedAt: Date.now()
      });
      added = true;
    }

    saveFavorites(list);
    showToast(added ? 'Saved to favourite tools' : 'Removed from favourite tools', added);
    updateAllFavoriteTriggers();
    renderHomepageFavoritesShelf();
    return added;
  }

  function removeFavorite(url) {
    const list = getFavorites();
    const norm = normalizeUrl(url);
    const filtered = list.filter(item => normalizeUrl(item.url) !== norm);
    saveFavorites(filtered);
    showToast('Removed from favourite tools', false);
    updateAllFavoriteTriggers();
    renderHomepageFavoritesShelf();
  }

  function clearAllFavorites() {
    saveFavorites([]);
    showToast('All favourite tools cleared', false);
    updateAllFavoriteTriggers();
    renderHomepageFavoritesShelf();
  }

  function normalizeUrl(url) {
    if (!url) return '';
    try {
      const u = new URL(url, window.location.origin);
      let path = u.pathname.replace(/\/$/, '');
      if (path.endsWith('.html')) path = path.slice(0, -5);
      return path || '/';
    } catch (e) {
      let clean = String(url).split('?')[0].split('#')[0].replace(/\/$/, '');
      if (clean.endsWith('.html')) clean = clean.slice(0, -5);
      return clean || '/';
    }
  }

  // Inject Self-Contained Brand Styles (No Tailwind, No External Deps)
  function injectStyles() {
    if (document.getElementById('afriwidget-favorites-styles')) return;
    const style = document.createElement('style');
    style.id = 'afriwidget-favorites-styles';
    style.textContent = `
      /* ==========================================================================
         AfriWidget Favourites Design System
         Zero Tailwind, Zero Emojis, 100% Accessible Pure CSS
         ========================================================================== */

      /* Nav Favourite Button */
      .nav-fav-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        background: transparent;
        color: #cbd5e1;
        font-size: 0.875rem;
        font-weight: 600;
        padding: 0.375rem 0.625rem;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.15s ease;
        line-height: 1;
        font-family: inherit;
      }
      .nav-fav-btn:hover {
        color: #fde047;
        border-color: rgba(250, 204, 21, 0.4);
        background: rgba(255, 255, 255, 0.05);
      }
      .nav-fav-btn svg {
        width: 1rem;
        height: 1rem;
        flex-shrink: 0;
      }
      .nav-fav-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 1.125rem;
        height: 1.125rem;
        padding: 0 0.3rem;
        background: #facc15;
        color: #000000;
        font-size: 0.6875rem;
        font-weight: 800;
        border-radius: 9999px;
        line-height: 1;
        margin-left: 0.125rem;
      }

      /* Mobile Nav Favourite Button */
      .mobile-fav-link {
        display: flex !important;
        align-items: center;
        justify-content: space-between;
        padding: 0.625rem 0.5rem !important;
        font-size: 0.875rem !important;
        font-weight: 600 !important;
        color: #fde047 !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .mobile-fav-link-left {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }
      .mobile-fav-link svg {
        width: 1.125rem;
        height: 1.125rem;
      }

      /* Card Bookmark Toggle Button */
      .tool-card {
        position: relative;
      }
      #afriHomepageFavShelf .tool-card-fav-btn { display: none !important; }
      .tool-card-fav-btn {
        position: absolute;
        top: 0.625rem;
        right: 0.625rem;
        width: 2rem;
        height: 2rem;
        border-radius: 0.375rem;
        background: #ffffff;
        border: 1px solid #e5e5e5;
        color: #9ca3af;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10;
        transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
        box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        padding: 0;
      }
      .tool-card-fav-btn:hover {
        background: #fefce8;
        border-color: #facc15;
        color: #ca8a04;
        transform: scale(1.08);
      }
      .tool-card-fav-btn.is-favorite {
        background: #fef9c3;
        border-color: #facc15;
        color: #ca8a04;
      }
      .tool-card-fav-btn svg {
        width: 1.125rem;
        height: 1.125rem;
      }

      /* Tool Section Heading Wrapper & Favourite Button (Replaces Share Tool) */
      .afri-section-head-row {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 0.75rem !important;
        flex-wrap: wrap !important;
        margin-bottom: 0.375rem !important;
        width: 100% !important;
      }
      .afri-section-head-row .calc-panel-title {
        margin: 0 !important;
        line-height: 1.25 !important;
        flex: 1 1 auto;
      }
      .afri-tool-fav-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.375rem;
        font-size: 0.75rem;
        font-weight: 700;
        color: #374151;
        background: #ffffff;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        padding: 0.375rem 0.625rem;
        cursor: pointer;
        min-height: 32px;
        transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
        line-height: 1;
        font-family: inherit;
        text-decoration: none;
        box-sizing: border-box;
        flex-shrink: 0;
        white-space: nowrap;
      }
      .afri-tool-fav-btn:hover {
        background: #fefce8;
        border-color: #facc15;
        color: #000000;
      }
      .afri-tool-fav-btn:active {
        transform: scale(0.97);
      }
      .afri-tool-fav-btn.is-saved,
      .afri-tool-fav-btn.is-favorite {
        background: #facc15;
        border-color: #eab308;
        color: #000000;
        font-weight: 800;
      }
      .afri-tool-fav-btn.is-saved:hover,
      .afri-tool-fav-btn.is-favorite:hover {
        background: #fde047;
        border-color: #ca8a04;
        color: #000000;
      }
      .afri-tool-fav-btn svg {
        width: 0.875rem;
        height: 0.875rem;
        flex-shrink: 0;
      }

      /* Favourites Modal / Drawer Backdrop */
      .afri-fav-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.65);
        backdrop-filter: blur(2px);
        z-index: 9998;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s ease, visibility 0.2s ease;
      }
      .afri-fav-backdrop.is-open {
        opacity: 1;
        visibility: visible;
      }

      /* Favourites Slide-Over Drawer */
      .afri-fav-drawer {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        max-width: 440px;
        background: #ffffff;
        box-shadow: -10px 0 30px rgba(0, 0, 0, 0.25);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        transform: translateX(100%);
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        color: #000000;
        box-sizing: border-box;
      }
      .afri-fav-drawer *, .afri-fav-drawer *::before, .afri-fav-drawer *::after {
        box-sizing: border-box;
      }
      .afri-fav-drawer.is-open {
        transform: translateX(0);
      }

      /* Drawer Header */
      .afri-fav-header {
        background: #000000;
        color: #ffffff;
        padding: 1.25rem 1.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      .afri-fav-header-brand {
        display: flex;
        align-items: center;
        gap: 0.625rem;
      }
      .afri-fav-header-brand svg {
        width: 1.5rem;
        height: 1.5rem;
      }
      .afri-fav-header-title {
        font-size: 1.125rem;
        font-weight: 800;
        color: #ffffff;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .afri-fav-header-count {
        background: #facc15;
        color: #000000;
        font-size: 0.75rem;
        font-weight: 800;
        padding: 0.125rem 0.5rem;
        border-radius: 9999px;
      }
      .afri-fav-close-btn {
        width: 2rem;
        height: 2rem;
        border-radius: 0.375rem;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: #cbd5e1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.15s, color 0.15s;
        padding: 0;
      }
      .afri-fav-close-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        color: #ffffff;
      }
      .afri-fav-close-btn svg {
        width: 1.125rem;
        height: 1.125rem;
      }

      /* Drawer Search Filter */
      .afri-fav-search-wrap {
        padding: 0.875rem 1.25rem;
        background: #f9fafb;
        border-bottom: 1px solid #e5e5e5;
        position: relative;
      }
      .afri-fav-search-input {
        width: 100%;
        padding: 0.5rem 0.75rem 0.5rem 2.25rem;
        font-size: 0.875rem;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        background: #ffffff;
        color: #000000;
        outline: none;
        transition: border-color 0.15s ease;
      }
      .afri-fav-search-input:focus {
        border-color: #000000;
      }
      .afri-fav-search-icon {
        position: absolute;
        left: 1.875rem;
        top: 50%;
        transform: translateY(-50%);
        color: #9ca3af;
        pointer-events: none;
        display: flex;
        align-items: center;
      }
      .afri-fav-search-icon svg {
        width: 0.875rem;
        height: 0.875rem;
      }

      /* Drawer Body & Items */
      .afri-fav-body {
        flex: 1;
        overflow-y: auto;
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .afri-fav-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-radius: 0.75rem;
        padding: 1rem;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
        position: relative;
      }
      .afri-fav-item:hover {
        border-color: #facc15;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }
      .afri-fav-item-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 0.75rem;
      }
      .afri-fav-item-cat {
        font-size: 0.625rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #ca8a04;
        background: #fefce8;
        padding: 0.2rem 0.5rem;
        border-radius: 0.25rem;
        border: 1px solid #fef08a;
      }
      .afri-fav-item-title {
        font-size: 0.9375rem;
        font-weight: 800;
        color: #000000;
        margin: 0.25rem 0 0.125rem;
        line-height: 1.3;
      }
      .afri-fav-item-desc {
        font-size: 0.75rem;
        color: #6b7280;
        line-height: 1.4;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .afri-fav-item-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 0.25rem;
        padding-top: 0.5rem;
        border-top: 1px solid #f3f4f6;
      }
      .afri-fav-launch-link {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.8125rem;
        font-weight: 700;
        color: #000000;
        text-decoration: none;
        transition: color 0.15s ease;
      }
      .afri-fav-launch-link:hover {
        color: #ca8a04;
      }
      .afri-fav-launch-link svg {
        width: 0.875rem;
        height: 0.875rem;
      }
      .afri-fav-remove-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.75rem;
        font-weight: 600;
        color: #9ca3af;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        transition: color 0.15s, background 0.15s;
      }
      .afri-fav-remove-btn:hover {
        color: #dc2626;
        background: #fee2e2;
      }
      .afri-fav-remove-btn svg {
        width: 0.875rem;
        height: 0.875rem;
      }

      /* Empty State */
      .afri-fav-empty {
        text-align: center;
        padding: 3rem 1.5rem;
        margin: auto 0;
      }
      .afri-fav-empty-icon {
        width: 3.5rem;
        height: 3.5rem;
        margin: 0 auto 1rem;
        color: #ca8a04;
        background: #fefce8;
        border: 2px dashed #fef08a;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .afri-fav-empty-icon svg {
        width: 1.75rem;
        height: 1.75rem;
      }
      .afri-fav-empty-title {
        font-size: 1.125rem;
        font-weight: 800;
        color: #000000;
        margin-bottom: 0.5rem;
      }
      .afri-fav-empty-text {
        font-size: 0.8125rem;
        color: #6b7280;
        line-height: 1.5;
        max-width: 20rem;
        margin: 0 auto 1.5rem;
      }
      .afri-fav-empty-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.625rem 1.25rem;
        font-size: 0.875rem;
        font-weight: 700;
        background: #facc15;
        color: #000000;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        text-decoration: none;
        transition: background 0.15s ease;
      }
      .afri-fav-empty-btn:hover {
        background: #fde047;
      }

      /* Drawer Footer */
      .afri-fav-footer {
        padding: 0.875rem 1.25rem;
        background: #f9fafb;
        border-top: 1px solid #e5e5e5;
        position: relative;
      }
      .afri-fav-footer-default {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
      }
      .afri-fav-clear-btn {
        font-size: 0.75rem;
        font-weight: 600;
        color: #6b7280;
        background: transparent;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        padding: 0.375rem 0.625rem;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .afri-fav-clear-btn:hover:not(:disabled) {
        color: #dc2626;
        border-color: #fca5a5;
        background: #ffffff;
      }
      .afri-fav-clear-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .afri-fav-done-btn {
        font-size: 0.8125rem;
        font-weight: 700;
        color: #000000;
        background: #facc15;
        border: none;
        border-radius: 0.375rem;
        padding: 0.4rem 1rem;
        cursor: pointer;
        transition: background 0.15s ease;
      }
      .afri-fav-done-btn:hover {
        background: #fde047;
      }

      /* In-Drawer Clear Confirmation Box */
      .afri-fav-footer-confirm {
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 0.5rem;
        padding: 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }
      .afri-fav-confirm-title {
        font-size: 0.8125rem;
        font-weight: 800;
        color: #991b1b;
        display: flex;
        align-items: center;
        gap: 0.375rem;
      }
      .afri-fav-confirm-title svg {
        width: 0.875rem;
        height: 0.875rem;
        flex-shrink: 0;
        color: #dc2626;
      }
      .afri-fav-confirm-desc {
        font-size: 0.75rem;
        color: #7f1d1d;
        line-height: 1.35;
        margin: 0;
      }
      .afri-fav-confirm-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 0.375rem;
      }
      .afri-fav-cancel-btn {
        font-size: 0.75rem;
        font-weight: 600;
        color: #4b5563;
        background: #ffffff;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        padding: 0.35rem 0.625rem;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .afri-fav-cancel-btn:hover {
        background: #f3f4f6;
        color: #111827;
      }
      .afri-fav-confirm-delete-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.75rem;
        font-weight: 700;
        color: #ffffff;
        background: #dc2626;
        border: 1px solid #b91c1c;
        border-radius: 0.375rem;
        padding: 0.35rem 0.75rem;
        cursor: pointer;
        transition: background 0.15s ease;
      }
      .afri-fav-confirm-delete-btn:hover {
        background: #b91c1c;
      }
      .afri-fav-confirm-delete-btn svg {
        width: 0.875rem;
        height: 0.875rem;
      }

      /* Homepage Favourites Shelf Section */
      .homepage-fav-section {
        background: #ffffff;
        border-bottom: 1px solid #e5e5e5;
        padding: 2rem 0;
      }
      .homepage-fav-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        font-size: 0.6875rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: #ca8a04;
        margin-bottom: 0.25rem;
      }
      .homepage-fav-badge svg {
        width: 0.875rem;
        height: 0.875rem;
      }

      /* Toast Notification */
      .afri-fav-toast {
        position: fixed;
        bottom: 1.5rem;
        right: 1.5rem;
        background: #000000;
        color: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-left: 4px solid #facc15;
        border-radius: 0.625rem;
        padding: 0.75rem 1rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-size: 0.875rem;
        font-weight: 600;
        transform: translateY(150%);
        opacity: 0;
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
        max-width: calc(100vw - 2rem);
      }
      .afri-fav-toast.is-visible {
        transform: translateY(0);
        opacity: 1;
      }
      .afri-fav-toast-icon {
        color: #facc15;
        display: flex;
        align-items: center;
        flex-shrink: 0;
      }
      .afri-fav-toast-icon svg {
        width: 1.125rem;
        height: 1.125rem;
      }
      .afri-fav-toast-view-btn {
        background: #facc15;
        color: #000000;
        border: none;
        border-radius: 0.25rem;
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
        font-weight: 700;
        cursor: pointer;
        margin-left: 0.25rem;
        transition: background 0.15s ease;
      }
      .afri-fav-toast-view-btn:hover {
        background: #fde047;
      }
    `;
    document.head.appendChild(style);
  }

  // Toast Notification
  let toastTimer = null;
  function showToast(message, isAdded) {
    let toast = document.getElementById('afriFavToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'afriFavToast';
      toast.className = 'afri-fav-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }

    const iconSvg = isAdded ? ICONS.starFilled : ICONS.check;
    toast.innerHTML = `
      <span class="afri-fav-toast-icon">${iconSvg}</span>
      <span>${escapeHtml(message)}</span>
      <button type="button" class="afri-fav-toast-view-btn" id="afriToastViewBtn">View</button>
    `;

    toast.classList.add('is-visible');

    const viewBtn = document.getElementById('afriToastViewBtn');
    viewBtn?.addEventListener('click', () => {
      hideToast();
      openFavoritesDrawer();
    });

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 3500);
  }

  function hideToast() {
    const toast = document.getElementById('afriFavToast');
    if (toast) toast.classList.remove('is-visible');
  }

  // Build Favourites Drawer & Backdrop
  function ensureDrawerMarkup() {
    if (document.getElementById('afriFavDrawer')) return;

    // Backdrop
    const backdrop = document.createElement('div');
    backdrop.id = 'afriFavBackdrop';
    backdrop.className = 'afri-fav-backdrop';
    backdrop.addEventListener('click', closeFavoritesDrawer);
    document.body.appendChild(backdrop);

    // Drawer
    const drawer = document.createElement('div');
    drawer.id = 'afriFavDrawer';
    drawer.className = 'afri-fav-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'My Favourite Tools');
    drawer.innerHTML = `
      <div class="afri-fav-header">
        <div class="afri-fav-header-brand">
          ${ICONS.brandWidget}
          <h2 class="afri-fav-header-title">
            <span>Favourites</span>
            <span id="afriFavDrawerCount" class="afri-fav-header-count">0</span>
          </h2>
        </div>
        <button type="button" id="afriFavCloseBtn" class="afri-fav-close-btn" aria-label="Close favourites">
          ${ICONS.close}
        </button>
      </div>

      <div class="afri-fav-search-wrap" id="afriFavSearchWrap">
        <span class="afri-fav-search-icon">${ICONS.search}</span>
        <input type="search" id="afriFavSearchInput" class="afri-fav-search-input" placeholder="Filter saved tools..." autocomplete="off" spellcheck="false" />
      </div>

      <div class="afri-fav-body" id="afriFavBody">
        <!-- Rendered items or empty state -->
      </div>

      <div class="afri-fav-footer" id="afriFavFooter">
        <div class="afri-fav-footer-default" id="afriFavFooterDefault">
          <button type="button" id="afriFavClearAllBtn" class="afri-fav-clear-btn">Clear all</button>
          <button type="button" id="afriFavDoneBtn" class="afri-fav-done-btn">Done</button>
        </div>
        <div class="afri-fav-footer-confirm" id="afriFavFooterConfirm" style="display: none;">
          <div class="afri-fav-confirm-title">
            ${ICONS.trash}
            <span>Clear all favourite tools?</span>
          </div>
          <p class="afri-fav-confirm-desc">This will remove all your saved calculators from this browser. This action cannot be undone.</p>
          <div class="afri-fav-confirm-actions">
            <button type="button" id="afriFavCancelClearBtn" class="afri-fav-cancel-btn">Cancel</button>
            <button type="button" id="afriFavProceedClearBtn" class="afri-fav-confirm-delete-btn">
              ${ICONS.trash}
              <span>Yes, Clear All</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(drawer);

    document.getElementById('afriFavCloseBtn')?.addEventListener('click', closeFavoritesDrawer);
    document.getElementById('afriFavDoneBtn')?.addEventListener('click', closeFavoritesDrawer);

    document.getElementById('afriFavClearAllBtn')?.addEventListener('click', () => {
      const list = getFavorites();
      if (list.length === 0) return;
      showClearConfirmation();
    });

    document.getElementById('afriFavCancelClearBtn')?.addEventListener('click', () => {
      hideClearConfirmation();
    });

    document.getElementById('afriFavProceedClearBtn')?.addEventListener('click', () => {
      clearAllFavorites();
      hideClearConfirmation();
      renderDrawerItems();
    });

    const searchInput = document.getElementById('afriFavSearchInput');
    searchInput?.addEventListener('input', () => {
      renderDrawerItems(searchInput.value.trim().toLowerCase());
    });

    // Keyboard accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeFavoritesDrawer();
      }
    });
  }

  function showClearConfirmation() {
    const defaultView = document.getElementById('afriFavFooterDefault');
    const confirmView = document.getElementById('afriFavFooterConfirm');
    if (defaultView && confirmView) {
      defaultView.style.display = 'none';
      confirmView.style.display = 'flex';
    }
  }

  function hideClearConfirmation() {
    const defaultView = document.getElementById('afriFavFooterDefault');
    const confirmView = document.getElementById('afriFavFooterConfirm');
    if (defaultView && confirmView) {
      defaultView.style.display = 'flex';
      confirmView.style.display = 'none';
    }
  }

  function openFavoritesDrawer() {
    ensureDrawerMarkup();
    const backdrop = document.getElementById('afriFavBackdrop');
    const drawer = document.getElementById('afriFavDrawer');
    const searchInput = document.getElementById('afriFavSearchInput');
    if (searchInput) searchInput.value = '';

    hideClearConfirmation();
    renderDrawerItems();
    backdrop?.classList.add('is-open');
    drawer?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeFavoritesDrawer() {
    const backdrop = document.getElementById('afriFavBackdrop');
    const drawer = document.getElementById('afriFavDrawer');
    backdrop?.classList.remove('is-open');
    drawer?.classList.remove('is-open');
    document.body.style.overflow = '';
    hideClearConfirmation();
  }

  function renderDrawerItems(filterQuery = '') {
    const body = document.getElementById('afriFavBody');
    const countEl = document.getElementById('afriFavDrawerCount');
    const searchWrap = document.getElementById('afriFavSearchWrap');
    if (!body) return;

    const list = getFavorites();
    if (countEl) countEl.textContent = String(list.length);

    const clearBtn = document.getElementById('afriFavClearAllBtn');
    if (clearBtn) {
      if (list.length === 0) {
        clearBtn.disabled = true;
      } else {
        clearBtn.disabled = false;
      }
    }

    if (searchWrap) {
      searchWrap.style.display = list.length > 3 ? 'block' : 'none';
    }

    if (list.length === 0) {
      hideClearConfirmation();
      body.innerHTML = `
        <div class="afri-fav-empty">
          <div class="afri-fav-empty-icon">${ICONS.starOutline}</div>
          <h3 class="afri-fav-empty-title">No favourite tools yet</h3>
          <p class="afri-fav-empty-text">Click the star button on any calculator or utility card across AfriWidget to save it here for instant access.</p>
          <a href="/" class="afri-fav-empty-btn" id="afriBrowseBtn">Browse popular tools</a>
        </div>
      `;
      document.getElementById('afriBrowseBtn')?.addEventListener('click', () => {
        closeFavoritesDrawer();
      });
      return;
    }

    const filtered = filterQuery
      ? list.filter(item =>
          item.title.toLowerCase().includes(filterQuery) ||
          (item.description && item.description.toLowerCase().includes(filterQuery)) ||
          (item.category && item.category.toLowerCase().includes(filterQuery))
        )
      : list;

    if (filtered.length === 0) {
      body.innerHTML = `
        <div class="afri-fav-empty">
          <h3 class="afri-fav-empty-title">No matches found</h3>
          <p class="afri-fav-empty-text">No saved tools match "${escapeHtml(filterQuery)}".</p>
        </div>
      `;
      return;
    }

    let html = '';
    filtered.forEach(tool => {
      const url = escapeHtml(tool.url);
      const title = escapeHtml(tool.title);
      const category = escapeHtml(tool.category || 'General');
      const desc = escapeHtml(tool.description || '');

      html += `
        <div class="afri-fav-item">
          <div class="afri-fav-item-top">
            <span class="afri-fav-item-cat">${category}</span>
          </div>
          <h4 class="afri-fav-item-title">${title}</h4>
          ${desc ? `<p class="afri-fav-item-desc">${desc}</p>` : ''}
          <div class="afri-fav-item-actions">
            <a href="${url}" class="afri-fav-launch-link">
              <span>Open tool</span>
              ${ICONS.arrowRight}
            </a>
            <button type="button" class="afri-fav-remove-btn" data-remove-url="${url}" aria-label="Remove ${title} from favourites">
              ${ICONS.trash}
              <span>Remove</span>
            </button>
          </div>
        </div>
      `;
    });

    body.innerHTML = html;

    body.querySelectorAll('[data-remove-url]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetUrl = btn.getAttribute('data-remove-url');
        removeFavorite(targetUrl);
        renderDrawerItems(filterQuery);
      });
    });
  }

  // Navigation Bar Integration
  function injectNavFavoritesButton() {
    // 1. Desktop Nav Bar
    const navLinks = document.querySelector('.nav-links');
    if (navLinks && !document.getElementById('afriNavFavBtn')) {
      const favBtn = document.createElement('button');
      favBtn.id = 'afriNavFavBtn';
      favBtn.type = 'button';
      favBtn.className = 'nav-fav-btn';
      favBtn.setAttribute('aria-label', 'Open favourite tools');
      favBtn.innerHTML = `
        ${ICONS.starOutline}
        <span>Favourites</span>
        <span id="afriNavFavBadge" class="nav-fav-badge" style="display:none">0</span>
      `;
      favBtn.addEventListener('click', openFavoritesDrawer);

      // Insert before legal dropdown or at end
      const dropdown = navLinks.querySelector('.nav-dropdown');
      if (dropdown) {
        navLinks.insertBefore(favBtn, dropdown);
      } else {
        navLinks.appendChild(favBtn);
      }
    }

    // 2. Mobile Menu
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu && !document.getElementById('afriMobileFavLink')) {
      const mobileFav = document.createElement('a');
      mobileFav.id = 'afriMobileFavLink';
      mobileFav.href = '#';
      mobileFav.className = 'mobile-fav-link';
      mobileFav.innerHTML = `
        <span class="mobile-fav-link-left">
          ${ICONS.starFilled}
          <span>Favourite Tools</span>
        </span>
        <span id="afriMobileFavBadge" class="nav-fav-badge" style="display:none">0</span>
      `;
      mobileFav.addEventListener('click', (e) => {
        e.preventDefault();
        // Close mobile menu if open
        mobileMenu.classList.remove('open');
        openFavoritesDrawer();
      });

      // Insert at top of mobile menu
      const firstLink = mobileMenu.querySelector('a');
      if (firstLink && firstLink.nextSibling) {
        firstLink.parentNode.insertBefore(mobileFav, firstLink.nextSibling);
      } else {
        mobileMenu.insertBefore(mobileFav, mobileMenu.firstChild);
      }
    }

    updateNavBadge();
  }

  function updateNavBadge() {
    const list = getFavorites();
    const count = list.length;

    const desktopBadge = document.getElementById('afriNavFavBadge');
    if (desktopBadge) {
      desktopBadge.textContent = String(count);
      desktopBadge.style.display = count > 0 ? 'inline-flex' : 'none';
    }

    const mobileBadge = document.getElementById('afriMobileFavBadge');
    if (mobileBadge) {
      mobileBadge.textContent = String(count);
      mobileBadge.style.display = count > 0 ? 'inline-flex' : 'none';
    }

    const navBtn = document.getElementById('afriNavFavBtn');
    if (navBtn) {
      const iconWrap = navBtn.querySelector('svg');
      if (iconWrap) {
        iconWrap.outerHTML = count > 0 ? ICONS.starFilled : ICONS.starOutline;
      }
    }
  }

  // Card Bookmark Toggle Buttons (on homepage, category pages, search results, related tools)
  function attachCardFavoriteButtons(container = document) {
    const cards = container.querySelectorAll('a.tool-card, a.app-card');
    cards.forEach(card => {
      if (card.closest('#afriHomepageFavShelf') || card.querySelector('.tool-card-fav-btn')) return;

      const url = card.getAttribute('href') || '';
      if (!url || url.startsWith('http') || url.startsWith('#') || url === '/') return;

      const isFav = isFavorite(url);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `tool-card-fav-btn ${isFav ? 'is-favorite' : ''}`;
      btn.setAttribute('aria-label', isFav ? 'Remove from favourites' : 'Add to favourites');
      btn.setAttribute('title', isFav ? 'Remove from favourites' : 'Save to favourites');
      btn.innerHTML = isFav ? ICONS.starFilled : ICONS.starOutline;

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const titleEl = card.querySelector('.tool-card-title, h3, h2');
        const catEl = card.querySelector('.tool-card-cat, .featured-label');
        const descEl = card.querySelector('.tool-card-desc, p');

        const title = titleEl ? titleEl.textContent.trim() : 'Tool';
        const category = catEl ? catEl.textContent.trim() : 'General';
        const description = descEl ? descEl.textContent.trim() : '';

        const nowFav = toggleFavorite({ url, title, category, description });
        btn.classList.toggle('is-favorite', nowFav);
        btn.innerHTML = nowFav ? ICONS.starFilled : ICONS.starOutline;
        btn.setAttribute('aria-label', nowFav ? 'Remove from favourites' : 'Add to favourites');
        btn.setAttribute('title', nowFav ? 'Remove from favourites' : 'Save to favourites');
      });

      card.appendChild(btn);
    });
  }

  // Single In-Page Favourite Action on Calculator Detail Pages
  // Replaces the existing "Share Tool" button beside section headings (e.g. "Your Courses")
  function injectDetailPageFavoriteButton() {
    const currentPath = normalizeUrl(window.location.pathname);
    if (!currentPath || currentPath === '/' || currentPath === '/index') return;

    // Check if on a hub page (education, finance, etc) or policy page
    const hubPages = ['/education', '/finance', '/health', '/productivity', '/business', '/use-cases', '/about', '/contact', '/terms', '/privacy-policy', '/cookie-policy', '/adsense-disclaimer', '/404', '/faq'];
    if (hubPages.includes(currentPath)) return;

    // Remove any obsolete legacy duplicate buttons if present in DOM
    document.getElementById('afriToolShareBtn')?.remove();
    document.getElementById('afriBarFavBtn')?.remove();
    document.getElementById('afriBreadcrumbFavBtn')?.remove();

    // If section favourite button already exists, just update state
    if (document.getElementById('afriToolFavBtn')) {
      updateDetailPageFavoriteButton();
      return;
    }

    // Locate section heading (.calc-panel-title or .calc-panel h2)
    const panelTitle = document.querySelector('.calc-panel-title') || document.querySelector('.calc-panel h2');
    if (!panelTitle) return;

    const isFav = isFavorite(currentPath);
    const favBtn = document.createElement('button');
    favBtn.id = 'afriToolFavBtn';
    favBtn.type = 'button';
    favBtn.className = `afri-tool-fav-btn ${isFav ? 'is-saved' : ''}`;
    favBtn.setAttribute('aria-label', isFav ? 'Remove from favourites' : 'Save to favourites');
    favBtn.setAttribute('title', isFav ? 'Remove from favourites' : 'Save to favourites');
    favBtn.innerHTML = `${isFav ? ICONS.starFilledDark : ICONS.starOutline}<span>${isFav ? 'Saved' : 'Save'}</span>`;

    favBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const toolTitle = getPageToolTitle();
      const toolCategory = getPageToolCategory();
      const toolDesc = getPageToolDescription();

      toggleFavorite({
        url: currentPath,
        title: toolTitle,
        category: toolCategory,
        description: toolDesc
      });
    });

    // Clean, non-destructive placement beside section heading
    if (panelTitle.parentElement && panelTitle.parentElement.classList.contains('afri-section-head-row')) {
      panelTitle.parentElement.appendChild(favBtn);
    } else {
      const headRow = document.createElement('div');
      headRow.className = 'afri-section-head-row';
      panelTitle.parentNode.insertBefore(headRow, panelTitle);
      headRow.appendChild(panelTitle);
      headRow.appendChild(favBtn);
    }
  }

  function updateDetailPageFavoriteButton() {
    const favBtn = document.getElementById('afriToolFavBtn');
    if (!favBtn) return;
    const currentPath = normalizeUrl(window.location.pathname);
    const isFav = isFavorite(currentPath);
    favBtn.classList.toggle('is-saved', isFav);
    favBtn.classList.toggle('is-favorite', isFav);
    favBtn.setAttribute('aria-label', isFav ? 'Remove from favourites' : 'Save to favourites');
    favBtn.setAttribute('title', isFav ? 'Remove from favourites' : 'Save to favourites');
    favBtn.innerHTML = `${isFav ? ICONS.starFilledDark : ICONS.starOutline}<span>${isFav ? 'Saved' : 'Save'}</span>`;
  }

  function getPageToolTitle() {
    const h1 = document.querySelector('h1');
    if (h1) {
      const cloned = h1.cloneNode(true);
      cloned.querySelectorAll('span, svg, button').forEach(el => el.remove());
      const txt = cloned.textContent.trim();
      if (txt) return txt;
    }
    return document.title.split('–')[0].split('-')[0].trim() || 'Calculator';
  }

  function getPageToolCategory() {
    const catEl = document.querySelector('.calc-panel-cat, .tool-card-cat, .breadcrumb li:nth-child(3)');
    if (catEl) return catEl.textContent.trim();
    return 'Education';
  }

  function getPageToolDescription() {
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && metaDesc.content) return metaDesc.content.trim();
    const p = document.querySelector('.seo-subtitle, .tool-desc');
    return p ? p.textContent.trim() : '';
  }

  // Update all favorite button states across the page
  function updateAllFavoriteTriggers() {
    updateNavBadge();

    // Update all card buttons
    document.querySelectorAll('.tool-card-fav-btn').forEach(btn => {
      const card = btn.closest('a.tool-card, a.app-card');
      if (!card) return;
      const url = card.getAttribute('href') || '';
      const isFav = isFavorite(url);
      btn.classList.toggle('is-favorite', isFav);
      btn.innerHTML = isFav ? ICONS.starFilled : ICONS.starOutline;
      btn.setAttribute('aria-label', isFav ? 'Remove from favourites' : 'Add to favourites');
      btn.setAttribute('title', isFav ? 'Remove from favourites' : 'Save to favourites');
    });

    // Update single in-page tool favourite button
    updateDetailPageFavoriteButton();
  }

  // Dedicated Favourites Shelf on Homepage (if on index.html)
  function renderHomepageFavoritesShelf() {
    const isHomepage = window.location.pathname === '/' || window.location.pathname === '/index.html' || window.location.pathname === '';
    if (!isHomepage) return;

    let shelf = document.getElementById('afriHomepageFavShelf');
    const list = getFavorites();

    if (list.length === 0) {
      if (shelf) shelf.style.display = 'none';
      return;
    }

    if (!shelf) {
      shelf = document.createElement('section');
      shelf.id = 'afriHomepageFavShelf';
      shelf.className = 'homepage-fav-section';

      // Insert right after the category search section
      const searchSection = document.querySelector('.category-search-section');
      if (searchSection) {
        searchSection.insertAdjacentElement('afterend', shelf);
      } else {
        const firstSection = document.querySelector('main > section');
        if (firstSection) {
          firstSection.insertAdjacentElement('beforebegin', shelf);
        }
      }
    }

    shelf.style.display = 'block';

    let cardsHtml = '';
    list.slice(0, 6).forEach(tool => {
      cardsHtml += `
        <a href="${escapeHtml(tool.url)}" class="tool-card">
          <div class="tool-card-icon">
            ${ICONS.starFilled}
            <span class="tool-card-cat">${escapeHtml(tool.category || 'Favourite')}</span>
          </div>
          <h3 class="tool-card-title">${escapeHtml(tool.title)}</h3>
          <p class="tool-card-desc">${escapeHtml(tool.description || 'Quick access to your saved calculator.')}</p>
        </a>
      `;
    });

    shelf.innerHTML = `
      <div class="container">
        <div class="section-header">
          <div>
            <div class="homepage-fav-badge">
              ${ICONS.starFilled}
              <span>Quick Access</span>
            </div>
            <h2 class="section-title">My Favourite Tools (${list.length})</h2>
          </div>
          <button type="button" id="afriOpenAllFavBtn" class="section-link" style="background:none;border:none;cursor:pointer;font-family:inherit;">
            Manage all favourites →
          </button>
        </div>
        <div class="tool-grid tool-grid-6">
          ${cardsHtml}
        </div>
      </div>
    `;

    document.getElementById('afriOpenAllFavBtn')?.addEventListener('click', openFavoritesDrawer);
    // shelf cards do not show duplicate right-hand star
  }

  function escapeHtml(str) {
    return (str || '').replace(/[&<>"']/g, function (m) {
      switch (m) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#039;';
        default: return m;
      }
    });
  }

  // Observe dynamically created cards (e.g. during live search on index.html or category hubs)
  function observeDynamicCards() {
    const observer = new MutationObserver((mutations) => {
      let needsScan = false;
      mutations.forEach(m => {
        if (m.addedNodes.length > 0) needsScan = true;
      });
      if (needsScan) {
        attachCardFavoriteButtons(document);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Cross-tab Synchronization
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      updateAllFavoriteTriggers();
      renderDrawerItems();
      renderHomepageFavoritesShelf();
    }
  });

  // Initialize
  function init() {
    injectStyles();
    ensureDrawerMarkup();
    injectNavFavoritesButton();
    attachCardFavoriteButtons(document);
    injectDetailPageFavoriteButton();
    renderHomepageFavoritesShelf();
    observeDynamicCards();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export clean global API
  window.AfriWidgetFavorites = {
    get: getFavorites,
    toggle: toggleFavorite,
    remove: removeFavorite,
    clear: clearAllFavorites,
    open: openFavoritesDrawer,
    close: closeFavoritesDrawer,
    isFavorite: isFavorite
  };
})();
