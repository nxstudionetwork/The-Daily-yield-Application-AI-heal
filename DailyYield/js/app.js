/* =====================================================================
   APP.JS — Daily Yield · Master Application Controller
   ===================================================================== */
const App = (() => {

  // ── Sidebar ──────────────────────────────────────────────────────────
  function initSidebar() {
    const sidebar  = Utils.$('#sidebar');
    const overlay  = Utils.$('#sidebar-overlay');
    const menuBtn  = Utils.$('#menu-btn');
    const closeBtn = Utils.$('#sidebar-close');

    if (menuBtn)  menuBtn.addEventListener('click', toggleSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlay)  overlay.addEventListener('click', closeSidebar);

    // Close on mobile nav-item click
    Utils.$$('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth < 1280) closeSidebar();
      });
    });

    // On ≥1280 the sidebar is always visible (CSS handles it)
  }

  function toggleSidebar() {
    const sidebar = Utils.$('#sidebar');
    const overlay = Utils.$('#sidebar-overlay');
    const open    = sidebar && sidebar.classList.contains('open');
    if (open) {
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
      document.body.classList.remove('sidebar-open');
    } else {
      if (sidebar) sidebar.classList.add('open');
      if (overlay) overlay.classList.add('active');
      document.body.classList.add('sidebar-open');
    }
  }

  function openSidebar() {
    const sidebar = Utils.$('#sidebar');
    const overlay = Utils.$('#sidebar-overlay');
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.classList.add('sidebar-open');
  }

  function closeSidebar() {
    const sidebar = Utils.$('#sidebar');
    const overlay = Utils.$('#sidebar-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.classList.remove('sidebar-open');
  }

  // ── Profile dropdown ─────────────────────────────────────────────────
  function initProfileDropdown() {
    const wrap   = Utils.$('#profile-dropdown-wrap');
    const btn    = Utils.$('#profile-avatar');
    const menu   = Utils.$('#profile-dropdown');
    const logout = Utils.$('#header-logout-btn');

    if (!btn || !menu) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.contains('open');
      closeAllDropdowns();
      if (!isOpen) {
        menu.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    // Close when any dropdown item is clicked
    Utils.$$('.profile-dropdown-item', menu).forEach(item => {
      item.addEventListener('click', () => {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });

    if (logout) {
      logout.addEventListener('click', () => {
        menu.classList.remove('open');
        Utils.storage.remove('userName');
        Utils.storage.remove('userEmail');
        Notifications.showToast('Signed out successfully', 'success');
        Router.navigate('/home');
      });
    }

    document.addEventListener('click', (e) => {
      if (wrap && !wrap.contains(e.target)) {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllDropdowns();
    });
  }

  function closeAllDropdowns() {
    const menu = Utils.$('#profile-dropdown');
    const btn  = Utils.$('#profile-avatar');
    if (menu) menu.classList.remove('open');
    if (btn)  btn.setAttribute('aria-expanded', 'false');
  }

  // ── Route registration ────────────────────────────────────────────────
  function registerRoutes() {
    Router.register('/home', (content) => {
      if (typeof Home !== 'undefined') Home.render(content);
    });

    // News with optional sub-category
    Router.register('/news', (content) => {
      if (typeof News !== 'undefined') News.render(content, 'Breaking');
    });
    Router.register('/news/:cat', (content, params) => {
      if (typeof News !== 'undefined') {
        const cat = params && params.cat
          ? params.cat.charAt(0).toUpperCase() + params.cat.slice(1)
          : 'Breaking';
        News.render(content, cat);
      }
    });

    Router.register('/x', (content) => {
      if (typeof XFeed !== 'undefined') XFeed.render(content);
    });

    Router.register('/ai', (content) => {
      if (typeof AI !== 'undefined') AI.render(content);
    });

    Router.register('/videos', (content) => {
      if (typeof Videos !== 'undefined') Videos.render(content);
    });

    Router.register('/posts', (content) => {
      if (typeof Posts !== 'undefined') Posts.render(content);
    });

    Router.register('/weather', (content) => {
      if (typeof Weather !== 'undefined') Weather.render(content);
    });

    Router.register('/newspapers', (content) => {
      if (typeof Newspapers !== 'undefined') Newspapers.render(content);
    });

    Router.register('/premium', (content) => {
      if (typeof PremiumPage !== 'undefined') PremiumPage.render(content);
    });

    Router.register('/settings', (content) => {
      if (typeof Settings !== 'undefined') Settings.render(content);
    });

    Router.register('/support', (content) => {
      if (typeof SupportPage !== 'undefined') SupportPage.render(content);
    });

    Router.register('/profile', (content) => {
      if (typeof Profile !== 'undefined') Profile.render(content);
    });

    // Investment / Stocks Dashboard  (both /investment and /dashboard)
    const investHandler = (content) => {
      if (typeof InvestmentAuth !== 'undefined') InvestmentAuth.render(content);
    };
    Router.register('/investment', investHandler);
    Router.register('/dashboard',  investHandler);

    // Article viewer
    Router.register('/article/:id', (content, params) => {
      if (typeof Article !== 'undefined' && params) {
        Article.render(content, params.id);
      } else {
        Router.navigate('/news');
      }
    });

    // Markets page (standalone, separate from stocks)
    Router.register('/markets', (content) => {
      if (typeof Markets !== 'undefined') Markets.render(content);
    });

    // About page
    Router.register('/about', (content) => {
      if (typeof AboutPage !== 'undefined') AboutPage.render(content);
    });

    // Channels
    Router.register('/channels', (content) => {
      if (typeof Channels !== 'undefined') Channels.render(content);
    });

    // Portfolio
    Router.register('/portfolio', (content) => {
      if (typeof Portfolio !== 'undefined') Portfolio.render(content);
    });

    // Research
    Router.register('/research', (content) => {
      if (typeof Research !== 'undefined') Research.render(content);
    });

    // Notifications page
    Router.register('/notifications', (content) => {
      if (typeof NotificationsPage !== 'undefined') NotificationsPage.render(content);
    });
  }

  // ── Breaking-news ticker ──────────────────────────────────────────────
  function initTicker() {
    const ticker = Utils.$('#breaking-ticker-text');
    const headlines = [
      'Markets hit all-time highs as global trade tensions ease · Sensex crosses 82,000 · Nifty at record 25,200',
      'ISRO announces Chandrayaan-4 mission timeline for 2027 · Budget approved by Parliament',
      'Federal Reserve signals potential rate cuts in Q3 2026 · Dollar weakens against major currencies',
      'Apple unveils next-generation M5 chip at WWDC 2026 · New AR headset announced',
      'India GDP growth accelerates to 7.2% in latest quarter · Fastest growing major economy',
      'Bitcoin surges past $95,000 amid institutional buying · ETF inflows hit record high',
      'WHO announces breakthrough in malaria vaccine development · 94% efficacy in trials',
      'SpaceX completes 200th successful Starship landing · Lunar mission preparations underway',
      'G7 leaders agree on framework for AI regulation · Historic accord signed in Rome',
      'India wins T20 World Cup · Virat Kohli named Player of the Tournament',
    ];
    if (!ticker) return;
    let idx = 0;

    function updateHeadline() {
      ticker.style.opacity = '0';
      ticker.style.transform = 'translateY(-8px)';
      setTimeout(() => {
        ticker.textContent = headlines[idx];
        ticker.style.opacity = '1';
        ticker.style.transform = 'translateY(0)';
        idx = (idx + 1) % headlines.length;
      }, 300);
    }

    updateHeadline();
    setInterval(updateHeadline, 7000);
  }

  // ── Profile avatar & dropdown info ───────────────────────────────────
  function initProfile() {
    const name  = Utils.storage.get('userName', 'User');
    const email = Utils.storage.get('userEmail', 'user@dailyyield.com');
    const init  = (name || 'U').charAt(0).toUpperCase();

    // Header avatar
    const avatar = Utils.$('#profile-avatar');
    if (avatar) avatar.textContent = init;

    // Dropdown fields
    const dName  = Utils.$('#dropdown-user-name');
    const dEmail = Utils.$('#dropdown-user-email');
    const dInit  = Utils.$('#dropdown-avatar-initials');
    if (dName)  dName.textContent  = name  || 'User';
    if (dEmail) dEmail.textContent = email || 'user@dailyyield.com';
    if (dInit)  dInit.textContent  = init;

    // Sidebar footer
    const sName  = Utils.$('#sidebar-footer-name');
    const sAv    = Utils.$('#sidebar-footer-avatar');
    if (sName) sName.textContent = name || 'User';
    if (sAv)   sAv.textContent   = init;
  }

  // ── Keyboard shortcuts ────────────────────────────────────────────────
  function initKeyboardShortcuts() {
    const shortcuts = Utils.$('#shortcuts-overlay');
    const closeBtn  = Utils.$('#shortcuts-close');
    if (closeBtn) closeBtn.addEventListener('click', () => shortcuts && shortcuts.classList.remove('open'));

    let gMode = false, gTimer;
    document.addEventListener('keydown', (e) => {
      const tag = (e.target.tagName || '').toLowerCase();
      const isInput = ['input', 'textarea', 'select'].includes(tag);

      if (e.key === 'Escape') {
        closeAllDropdowns();
        if (shortcuts) shortcuts.classList.remove('open');
        return;
      }

      if (isInput) return;

      if (e.key === '?' && !e.shiftKey) {
        e.preventDefault();
        if (shortcuts) shortcuts.classList.toggle('open');
        return;
      }

      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        toggleSidebar();
        return;
      }

      // G-then-X shortcuts
      if (e.key === 'g' || e.key === 'G') {
        gMode = true;
        clearTimeout(gTimer);
        gTimer = setTimeout(() => { gMode = false; }, 1500);
        return;
      }
      if (gMode) {
        const map = { h: '/home', n: '/news', s: '/investment', d: '/investment', v: '/videos', a: '/ai', w: '/weather', x: '/x', p: '/posts' };
        const route = map[e.key.toLowerCase()];
        if (route) { e.preventDefault(); Router.navigate(route); gMode = false; }
      }
    });
  }

  // ── Mobile bottom-nav "more" state ───────────────────────────────────
  function initBottomNav() {
    // Keep bottom nav in sync with route
    window.addEventListener('hashchange', () => {
      const path = (window.location.hash || '#/home').slice(1);
      Utils.$$('.bottom-nav-item').forEach(item => {
        const r = item.dataset.route || '';
        item.classList.toggle('active', path === r || path.startsWith(r + '/'));
      });
    });
  }

  // ── Ripple on interactive elements ───────────────────────────────────
  function initRipples() {
    document.addEventListener('click', (e) => {
      const el = e.target.closest('.btn, .nav-item, .bottom-nav-item, .tool-card, .ripple-target');
      if (el) Utils.addRipple(e, el);
    });
  }

  // ── Resize handler ────────────────────────────────────────────────────
  function initResize() {
    window.addEventListener('resize', Utils.debounce(() => {
      // On desktop width, close the overlay sidebar
      if (window.innerWidth >= 1280) {
        closeSidebar();
      }
    }, 200));
  }

  // ── Header scroll shadow ──────────────────────────────────────────────
  function initHeaderScroll() {
    const header = Utils.$('#header');
    if (!header) return;
    window.addEventListener('scroll', Utils.throttle(() => {
      header.classList.toggle('scrolled', window.scrollY > 4);
    }, 50));
  }

  // ── init ──────────────────────────────────────────────────────────────
  function init() {
    Theme.init();
    registerRoutes();
    Router.init();
    initSidebar();
    initProfileDropdown();
    Notifications.init();
    Search.init();
    initTicker();
    initProfile();
    Animations.init();
    CommandPalette.init();
    initKeyboardShortcuts();
    initBottomNav();
    initRipples();
    initResize();
    initHeaderScroll();
  }

  return { init, toggleSidebar, openSidebar, closeSidebar, initProfile };
})();

document.addEventListener('DOMContentLoaded', () => App.init());
