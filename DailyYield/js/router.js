const Router = (() => {
  const routes = {};
  let current = null;

  function register(path, handler) {
    routes[path] = handler;
  }

  function resolve(path) {
    if (routes[path]) return routes[path];
    const segments = path.split('/');
    for (const pattern of Object.keys(routes)) {
      const patternSegs = pattern.split('/');
      if (patternSegs.length !== segments.length) continue;
      const params = {};
      let match = true;
      for (let i = 0; i < patternSegs.length; i++) {
        if (patternSegs[i].startsWith(':')) {
          params[patternSegs[i].slice(1)] = segments[i];
        } else if (patternSegs[i] !== segments[i]) {
          match = false;
          break;
        }
      }
      if (match) return { handler: routes[pattern], params };
    }
    return null;
  }

  function navigate(path) {
    window.location.hash = '#' + path;
  }

  function updateNav(path) {
    Utils.$$('.nav-item').forEach(item => {
      const route = item.dataset.route;
      item.classList.toggle('active', route === path || path.startsWith(route + '/'));
    });
    Utils.$$('.bottom-nav-item').forEach(item => {
      const route = item.dataset.route;
      item.classList.toggle('active', route === path || (route && path.startsWith(route + '/')));
    });
    Utils.$$('[data-route]').forEach(item => {
      if (!item.classList.contains('nav-item') && !item.classList.contains('bottom-nav-item')) {
        item.classList.toggle('active', item.dataset.route === path);
      }
    });
  }

  function getCurrent() { return current; }

  function parseHash() {
    var raw = window.location.hash.slice(1) || '/home';
    var qIdx = raw.indexOf('?');
    var path = qIdx >= 0 ? raw.substring(0, qIdx) : raw;
    var query = {};
    if (qIdx >= 0) {
      raw.substring(qIdx + 1).split('&').forEach(function(pair) {
        var kv = pair.split('=');
        query[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '');
      });
    }
    return { path: path, query: query, raw: raw };
  }

  async function handleRoute() {
    var parsed = parseHash();
    var hash = parsed.path;
    if (parsed.raw === current) return;

    const content = Utils.$('#main-content');
    const oldRoute = current;
    current = parsed.raw;
    window.currentRoute = parsed.raw;
    window.routeQuery = parsed.query;

    if (content) {
      content.style.opacity = '0';
      content.style.transform = 'translateY(8px)';
      await new Promise(r => setTimeout(r, 200));
    }

    const resolved = resolve(hash);
    if (resolved) {
      if (typeof resolved === 'object' && resolved.handler) {
        await resolved.handler(content, resolved.params);
      } else if (typeof resolved === 'function') {
        await resolved(content);
      }
    } else {
      const fallback = routes['/home'] || routes['*'];
      if (fallback) {
        if (typeof fallback === 'function') await fallback(content);
        else if (typeof fallback === 'object' && fallback.handler) await fallback.handler(content);
      } else if (content) {
        content.innerHTML = '<div class="error-page"><h2>404 - Page Not Found</h2><p>The page you\'re looking for doesn\'t exist.</p><button onclick="Router.navigate(\'/home\')" class="btn btn-primary">Go Home</button></div>';
      }
    }

    Utils.$$('.skeleton', content).forEach(s => {
      setTimeout(() => s.classList.add('loaded'), 300);
    });

    if (content) {
      await new Promise(r => setTimeout(r, 50));
      content.style.opacity = '1';
      content.style.transform = 'translateY(0)';
    }

    updateNav(hash);
    closeSidebarOnMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    Animations && Animations.init();
  }

  function closeSidebarOnMobile() {
    if (window.innerWidth <= 768) {
      const sidebar = Utils.$('#sidebar');
      const overlay = Utils.$('#sidebar-overlay');
      if (sidebar) sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
      document.body.classList.remove('sidebar-open');
    }
  }

  function init() {
    window.addEventListener('hashchange', handleRoute);
    document.addEventListener('click', e => {
      const link = e.target.closest('[data-route]');
      if (!link) return;
      e.preventDefault();
      const route = link.dataset.route;
      if (route) navigate(route);
    });
    handleRoute();
  }

  return { register, navigate, resolve, updateNav, getCurrent, init };
})();
