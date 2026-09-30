const FocusMode = (() => {
  let active = false;

  function init() {
    const saved = Utils.storage.get('focusMode', false);
    if (saved) activate();
  }

  function toggle() {
    active ? deactivate() : activate();
  }

  function activate() {
    active = true;
    document.body.classList.add('focus-mode');
    const header = Utils.$('#header');
    const sidebar = Utils.$('#sidebar');
    const ticker = Utils.$('#ticker-bar');
    const bottomNav = Utils.$('#bottom-nav');
    if (header) header.style.display = 'none';
    if (sidebar) sidebar.style.display = 'none';
    if (ticker) ticker.style.display = 'none';
    if (bottomNav) bottomNav.style.display = 'none';
    const content = Utils.$('#main-content');
    if (content) { content.style.maxWidth = '800px'; content.style.margin = '0 auto'; content.style.padding = '2rem 1.5rem'; }
    Utils.storage.set('focusMode', true);
    Notifications.showToast('Focus mode enabled. Press F to exit.', 'info');
  }

  function deactivate() {
    active = false;
    document.body.classList.remove('focus-mode');
    const header = Utils.$('#header');
    const sidebar = Utils.$('#sidebar');
    const ticker = Utils.$('#ticker-bar');
    const bottomNav = Utils.$('#bottom-nav');
    if (header) header.style.display = '';
    if (sidebar) sidebar.style.display = '';
    if (ticker) ticker.style.display = '';
    if (bottomNav) bottomNav.style.display = '';
    const content = Utils.$('#main-content');
    if (content) { content.style.maxWidth = ''; content.style.margin = ''; content.style.padding = ''; }
    Utils.storage.set('focusMode', false);
    Notifications.showToast('Focus mode disabled', 'info');
  }

  function isActive() { return active; }

  return { init, toggle, isActive };
})();
