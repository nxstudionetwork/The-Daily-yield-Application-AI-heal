// router.js – simple client‑side router for vanilla UI

// Utility to load HTML fragment into #app
async function loadPage(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    const html = await res.text();
    document.getElementById('app').innerHTML = html;
  } catch (e) {
    console.error(e);
    document.getElementById('app').innerHTML = `<p class=\"text-red-500\">${e.message}</p>`;
  }
}

// Intercept link clicks for internal navigation
function interceptLinks() {
  document.body.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('http')) return; // external links
    e.preventDefault();
    const url = new URL(href, location.origin);
    history.pushState(null, '', url.pathname);
    const pagePath = url.pathname === '/' ? '/pages/home.html' : `/pages${url.pathname}`;
    loadPage(pagePath);
  });
}

// Initial load based on current location
function initRouter() {
  const initialPath = location.pathname === '/' ? '/pages/home.html' : `/pages${location.pathname}`;
  loadPage(initialPath);
  interceptLinks();
  window.addEventListener('popstate', () => {
    const path = location.pathname === '/' ? '/pages/home.html' : `/pages${location.pathname}`;
    loadPage(path);
  });
}

// Expose init function for index.html to call after DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRouter);
} else {
  initRouter();
}
