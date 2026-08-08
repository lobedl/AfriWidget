  /*
   * Shared primary navigation.
   *
   * The site remains plain static HTML. Every page may carry legacy navigation
   * markup in its source, but the live header is always normalized to this
   * single, category-first menu so individual tools are never duplicated here.
   */
(function () {
  'use strict';

  function ensureMenuStyles() {
    if (document.getElementById('afriwidget-menu-styles')) return;
    var style = document.createElement('style');
    style.id = 'afriwidget-menu-styles';
    style.textContent = [
      '.mobile-menu{display:none!important}',
      '.mobile-menu.open{display:block!important}',
      '@media (min-width:768px){.mobile-menu{display:none!important}}'
    ].join('');
    document.head.appendChild(style);
  }

  var navigationItems = [
    ['/', 'Home'],
    ['education', 'Education Tools'],
    ['finance', 'Finance Tools'],
    ['health', 'Health Tools'],
    ['productivity', 'Productivity Tools'],
    ['widgets', 'All Tools Directory']
  ];

  function currentPage() {
    var page = window.location.pathname.replace(/\/+$/, '').split('/').pop() || 'index.html';
    if (page === 'index.html' || page === 'index') return '/';
    return page.replace(/\.html$/i, '');
  }

  function renderDesktopMenu() {
    document.querySelectorAll('nav').forEach(function (nav) {
      var desktopMenu = nav.querySelector('.hidden.md\\:flex');
      if (!desktopMenu) return;
      desktopMenu.innerHTML = navigationItems.map(function (item) {
        var isCurrent = item[0] === currentPage();
        var classes = 'transition-colors hover:text-yellow-300' + (isCurrent ? ' text-yellow-300 font-bold' : '');
        return '<a href="' + item[0] + '" class="' + classes + '">' + item[1] + '</a>';
      }).join('');
    });
  }

  function renderMobileMenu() {
    var menu = document.getElementById('mobileMenu');
    if (!menu) return;

    var page = currentPage();
    menu.innerHTML = navigationItems.map(function (item) {
      var href = item[0];
      var isCurrent = href === page;
      var classes = 'block py-2 hover:text-yellow-300 transition-colors' + (isCurrent ? ' text-yellow-300 font-bold' : '');
      return '<a href="' + href + '" class="' + classes + '">' + item[1] + '</a>';
    }).join('');
  }

  function bindMobileMenu() {
    var button = document.getElementById('mobileMenuBtn');
    var menu = document.getElementById('mobileMenu');
    if (!button || !menu || button.getAttribute('data-afriwidget-menu-bound') === 'true') return;

    button.setAttribute('data-afriwidget-menu-bound', 'true');
    button.setAttribute('aria-controls', 'mobileMenu');
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', function (event) {
      /*
       * Some older pages still contain their own menu listener. Capture this
       * event first so those legacy listeners cannot toggle the menu twice.
       */
      event.preventDefault();
      event.stopImmediatePropagation();
      var isOpen = menu.classList.toggle('open');
      button.setAttribute('aria-expanded', String(isOpen));
      button.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    }, true);

    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        menu.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function normalizeNavigationLabels() {
    renderDesktopMenu();
    renderMobileMenu();
    bindMobileMenu();
  }

  function loadUniversalAi() {
    if (document.querySelector('script[data-afriwidget-universal-ai]')) return;
    var script = document.createElement('script');
    script.src = '/universal-ai.js';
    script.defer = true;
    script.dataset.afriwidgetUniversalAi = 'true';
    document.head.appendChild(script);
  }

  ensureMenuStyles();
  loadUniversalAi();

  /* Normalize the shared navigation as soon as the parsed menu is available. */
  if (document.body) {
    normalizeNavigationLabels();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', normalizeNavigationLabels, { once: true });
  }
})();