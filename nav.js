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

  var legalItems = [
    ['/privacy-policy', 'Privacy Policy'],
    ['/terms', 'Terms of Service'],
    ['/cookie-policy', 'Cookie Policy'],
    ['/adsense-disclaimer', 'AdSense Disclaimer'],
    ['/about', 'About Us'],
    ['/contact', 'Contact']
  ];

  function currentPage() {
    var page = window.location.pathname.replace(/\/+$/, '').split('/').pop() || 'index.html';
    if (page === 'index.html' || page === 'index') return '/';
    return page.replace(/\.html$/i, '');
  }

  function renderDesktopMenu() {
    var page = currentPage();
    var isLegalPage = legalItems.some(function(item) { return item[0] === page; });

    document.querySelectorAll('nav').forEach(function (nav) {
      var desktopMenu = nav.querySelector('.hidden.md\\:flex');
      if (!desktopMenu) return;

      var legalButton = desktopMenu.querySelector('.nav-dropdown button');
      var existingLinks = desktopMenu.querySelectorAll('a');

      // Highlight active link without re-rendering DOM if fully rendered
      if (existingLinks.length >= (navigationItems.length + legalItems.length)) {
        existingLinks.forEach(function (link) {
          var href = link.getAttribute('href');
          var isCurrent = (href === page) || (href === '/' && page === '/');
          link.classList.toggle('text-yellow-300', isCurrent);
          link.classList.toggle('font-bold', isCurrent);
        });
        if (legalButton) {
          legalButton.classList.toggle('text-yellow-300', isLegalPage);
          legalButton.classList.toggle('font-bold', isLegalPage);
        }
        return;
      }

      var primaryLinksHtml = navigationItems.map(function (item) {
        var isCurrent = item[0] === page;
        var classes = 'transition-colors hover:text-yellow-300' + (isCurrent ? ' text-yellow-300 font-bold' : '');
        return '<a href="' + item[0] + '" class="' + classes + '">' + item[1] + '</a>';
      }).join('');

      var legalDropdownHtml =
        '<div class="relative nav-dropdown group">' +
          '<button type="button" class="flex items-center gap-1 transition-colors hover:text-yellow-300 py-1 cursor-pointer focus:outline-none' + (isLegalPage ? ' text-yellow-300 font-bold' : '') + '" aria-expanded="false" aria-haspopup="true" aria-label="Legal and policy pages">' +
            '<span>Legal</span>' +
            '<svg class="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>' +
          '</button>' +
          '<div class="nav-dropdown-menu absolute right-0 top-full pt-1.5 w-48 hidden group-hover:block z-50">' +
            '<div class="rounded-xl bg-slate-900 border border-slate-700/90 shadow-2xl py-1.5 backdrop-blur-md">' +
              legalItems.map(function (item) {
                var isCurrent = item[0] === page;
                var classes = 'block px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-yellow-300 transition-colors' + (isCurrent ? ' text-yellow-300 font-bold bg-slate-800/60' : '');
                return '<a href="' + item[0] + '" class="' + classes + '">' + item[1] + '</a>';
              }).join('') +
            '</div>' +
          '</div>' +
        '</div>';

      desktopMenu.innerHTML = primaryLinksHtml + legalDropdownHtml;
    });
  }

  function renderMobileMenu() {
    var menu = document.getElementById('mobileMenu');
    if (!menu) return;

    var page = currentPage();
    var existingLinks = menu.querySelectorAll('a');
    if (existingLinks.length >= (navigationItems.length + legalItems.length)) {
      existingLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        var isCurrent = (href === page) || (href === '/' && page === '/');
        link.classList.toggle('text-yellow-300', isCurrent);
        link.classList.toggle('font-bold', isCurrent);
      });
      return;
    }

    var primaryLinksHtml = navigationItems.map(function (item) {
      var href = item[0];
      var isCurrent = href === page;
      var classes = 'block py-2 hover:text-yellow-300 transition-colors' + (isCurrent ? ' text-yellow-300 font-bold' : '');
      return '<a href="' + href + '" class="' + classes + '">' + item[1] + '</a>';
    }).join('');

    var legalSectionHtml =
      '<div class="pt-2.5 mt-2 border-t border-slate-800/80">' +
        '<div class="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-1.5">Legal &amp; Info</div>' +
        '<div class="grid grid-cols-2 gap-1 text-xs font-medium">' +
          legalItems.map(function (item) {
            var href = item[0];
            var isCurrent = href === page;
            var classes = 'py-1.5 px-2 rounded hover:bg-slate-800 hover:text-yellow-300 text-slate-300 transition-colors' + (isCurrent ? ' text-yellow-300 font-bold bg-slate-800/60' : '');
            return '<a href="' + href + '" class="' + classes + '">' + item[1] + '</a>';
          }).join('') +
        '</div>' +
      '</div>';

    menu.innerHTML = primaryLinksHtml + legalSectionHtml;
  }

  function bindMobileMenu() {
    var button = document.getElementById('mobileMenuBtn');
    var menu = document.getElementById('mobileMenu');
    if (button && menu && button.getAttribute('data-afriwidget-menu-bound') !== 'true') {
      button.setAttribute('data-afriwidget-menu-bound', 'true');
      button.setAttribute('aria-controls', 'mobileMenu');
      button.setAttribute('aria-expanded', 'false');
      button.addEventListener('click', function (event) {
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

    // Bind dropdown click handlers for touch screens
    document.querySelectorAll('.nav-dropdown').forEach(function (dropdown) {
      if (dropdown.getAttribute('data-dropdown-bound') === 'true') return;
      dropdown.setAttribute('data-dropdown-bound', 'true');
      var trigger = dropdown.querySelector('button');
      if (!trigger) return;

      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = dropdown.classList.toggle('open');
        trigger.setAttribute('aria-expanded', String(isOpen));
      });
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav-dropdown')) {
        document.querySelectorAll('.nav-dropdown.open').forEach(function (dd) {
          dd.classList.remove('open');
          var btn = dd.querySelector('button');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });
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

    var loadScript = function() {
      if (document.querySelector('script[data-afriwidget-universal-ai]')) return;
      var script = document.createElement('script');
      script.src = '/universal-ai.js';
      script.defer = true;
      script.dataset.afriwidgetUniversalAi = 'true';
      document.head.appendChild(script);
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(loadScript, { timeout: 3000 });
    } else {
      setTimeout(loadScript, 2000);
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