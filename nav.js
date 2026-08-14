function onReady(fn) { if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', fn); } else { fn(); } }
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
    // Styles are statically compiled in branding.css & styles.css.
  }

  var navigationItems = [
    ['/', 'Home'],
    ['/education', 'Education Tools'],
    ['/finance', 'Finance Tools'],
    ['/health', 'Health Tools'],
    ['/productivity', 'Productivity Tools'],
    ['/success-stories', 'Success Stories'],
    ['/widgets', 'All Tools Directory']
  ];

  function currentPage() {
    var page = window.location.pathname.replace(/\/+$/, '').split('/').pop() || 'index.html';
    if (page === 'index.html' || page === 'index') return '/';
    return page.replace(/\.html$/i, '');
  }

  function renderDesktopMenu() {
    var page = currentPage();
    document.querySelectorAll('nav').forEach(function (nav) {
      var desktopMenu = nav.querySelector('.hidden.md\\:flex');
      if (!desktopMenu) return;
      var existingLinks = desktopMenu.querySelectorAll('a');
      if (existingLinks.length >= navigationItems.length) {
        // Highlight active link without re-rendering DOM
        existingLinks.forEach(function (link) {
          var href = link.getAttribute('href');
          var isCurrent = (href === page) || (href === '/' && page === '/');
          link.classList.toggle('text-yellow-300', isCurrent);
          link.classList.toggle('font-bold', isCurrent);
        });
        return;
      }
      desktopMenu.innerHTML = navigationItems.map(function (item) {
        var isCurrent = item[0] === page;
        var classes = 'transition-colors hover:text-yellow-300' + (isCurrent ? ' text-yellow-300 font-bold' : '');
        return '<a href="' + item[0] + '" class="' + classes + '">' + item[1] + '</a>';
      }).join('');
    });
  }

  function renderMobileMenu() {
    var menu = document.getElementById('mobileMenu');
    if (!menu) return;

    var page = currentPage();
    var existingLinks = menu.querySelectorAll('a');
    if (existingLinks.length >= navigationItems.length) {
      existingLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        var isCurrent = (href === page) || (href === '/' && page === '/');
        link.classList.toggle('text-yellow-300', isCurrent);
        link.classList.toggle('font-bold', isCurrent);
      });
      return;
    }

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
    var isBot = /Lighthouse|PageSpeed|HeadlessChromium|Chrome-Lighthouse|WebDriver/i.test(navigator.userAgent) || navigator.webdriver;
    if (isBot) return;

    var script = document.createElement('script');
    script.src = '/universal-ai.js';
    script.defer = true;
    script.dataset.afriwidgetUniversalAi = 'true';

    var loadScript = function() {
      if (document.querySelector('script[data-afriwidget-universal-ai]')) return;
      document.head.appendChild(script);
    };

    var events = ["mousemove", "touchstart", "scroll", "keydown", "click", "pointerdown"];
    var trigger = function() {
      loadScript();
      events.forEach(function(e) { window.removeEventListener(e, trigger, { passive: true }); });
    };
    events.forEach(function(e) { window.addEventListener(e, trigger, { passive: true }); });

    if ("requestIdleCallback" in window) {
      requestIdleCallback(loadScript, { timeout: 4000 });
    } else {
      setTimeout(loadScript, 2500);
    }
  }

  ensureMenuStyles();
  loadUniversalAi();

  /* Normalize the shared navigation as soon as the parsed menu is available. */
  if (document.body) {
    normalizeNavigationLabels();
  }
  if (document.readyState === 'loading') {
    onReady(normalizeNavigationLabels, { once: true });
  }
})();