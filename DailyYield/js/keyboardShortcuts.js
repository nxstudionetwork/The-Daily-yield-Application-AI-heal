const KeyboardShortcuts = (() => {
  let overlayOpen = false;
  let waitingFor = null;
  let waitTimeout = null;

  function init() {
    document.addEventListener('keydown', handleGlobal);
    const closeBtn = Utils.$('#shortcuts-close');
    if (closeBtn) closeBtn.addEventListener('click', close);
  }

  function handleGlobal(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
    if (e.ctrlKey || e.metaKey) return;

    if (waitingFor) {
      e.preventDefault();
      clearTimeout(waitTimeout);
      const combo = waitingFor + ' ' + e.key.toLowerCase();
      waitingFor = null;
      executeCombo(combo);
      return;
    }

    if (e.key === '?') { e.preventDefault(); toggle(); return; }
    if (e.key === 'Escape') { close(); return; }
    if (e.key === '/') { e.preventDefault(); Search.open(); return; }
    if (e.key === 'f' || e.key === 'F') { e.preventDefault(); FocusMode.toggle(); return; }
    if (e.key === 'b' || e.key === 'B') { e.preventDefault(); App.toggleSidebar(); return; }

    if (e.key === 'g' || e.key === 'G') {
      e.preventDefault();
      waitingFor = 'g';
      waitTimeout = setTimeout(() => { waitingFor = null; }, 2000);
      return;
    }
  }

  function executeCombo(combo) {
    const map = {
      'g h': () => Router.navigate('/home'),
      'g n': () => Router.navigate('/news'),
      'g s': () => Router.navigate('/stocks'),
      'g d': () => typeof InvestmentDashboard !== 'undefined' && InvestmentDashboard.open(),
      'g v': () => Router.navigate('/videos'),
      'g a': () => Router.navigate('/ai'),
      'g p': () => Router.navigate('/posts'),
      'g w': () => Router.navigate('/weather'),
      'g c': () => Router.navigate('/channels'),
    };
    if (map[combo]) map[combo]();
  }

  function toggle() { overlayOpen ? close() : open(); }

  function open() {
    overlayOpen = true;
    const el = Utils.$('#shortcuts-overlay');
    if (el) el.classList.add('open');
  }

  function close() {
    overlayOpen = false;
    const el = Utils.$('#shortcuts-overlay');
    if (el) el.classList.remove('open');
  }

  return { init, toggle, open, close };
})();
