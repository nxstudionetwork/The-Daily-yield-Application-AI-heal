const CommandPalette = (() => {
  let isOpen = false;
  let query = '';
  let selectedIndex = 0;
  let filteredCommands = [];

  const commands = [
    { id: 'nav-home', label: 'Go to Home', category: 'Navigation', shortcut: 'G H', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>', action: () => Router.navigate('/home') },
    { id: 'nav-news', label: 'Go to News', category: 'Navigation', shortcut: 'G N', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/></svg>', action: () => Router.navigate('/news') },
    { id: 'nav-stocks', label: 'Go to Stocks', category: 'Navigation', shortcut: 'G S', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>', action: () => Router.navigate('/stocks') },
    { id: 'nav-dashboard', label: 'Open Investment Dashboard', category: 'Navigation', shortcut: 'G D', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="4"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="14" width="7" height="7"/></svg>', action: () => typeof InvestmentDashboard !== 'undefined' && InvestmentDashboard.open() },
    { id: 'nav-videos', label: 'Go to Videos', category: 'Navigation', shortcut: 'G V', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>', action: () => Router.navigate('/videos') },
    { id: 'nav-ai', label: 'Go to AI Assistant', category: 'Navigation', shortcut: 'G A', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M18 14h.01"/><path d="M6 14h.01"/><rect x="2" y="14" width="20" height="8" rx="2"/></svg>', action: () => Router.navigate('/ai') },
    { id: 'nav-posts', label: 'Go to Community', category: 'Navigation', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>', action: () => Router.navigate('/posts') },
    { id: 'nav-weather', label: 'Go to Weather', category: 'Navigation', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 18a5 5 0 0 0 .88-9.86A6 6 0 1 0 4 14h13z"/></svg>', action: () => Router.navigate('/weather') },
    { id: 'nav-channels', label: 'Go to Channels', category: 'Navigation', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>', action: () => Router.navigate('/channels') },
    { id: 'nav-newspapers', label: 'Go to Newspapers', category: 'Navigation', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/></svg>', action: () => Router.navigate('/newspapers') },
    { id: 'nav-profile', label: 'Go to Profile', category: 'Navigation', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', action: () => Router.navigate('/profile') },
    { id: 'nav-settings', label: 'Go to Settings', category: 'Navigation', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>', action: () => Router.navigate('/settings') },
    { id: 'action-search', label: 'Open Search', category: 'Actions', shortcut: 'Ctrl+K', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>', action: () => Search.open() },
    { id: 'action-notif', label: 'Open Notifications', category: 'Actions', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>', action: () => Notifications.togglePanel() },
    { id: 'action-bookmark', label: 'Open Bookmarks', category: 'Actions', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>', action: () => Router.navigate('/posts') },
    { id: 'action-shortcuts', label: 'Keyboard Shortcuts', category: 'Actions', shortcut: '?', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.001"/><path d="M10 8h.001"/><path d="M14 8h.001"/><path d="M18 8h.001"/><path d="M8 12h.001"/><path d="M12 12h.001"/><path d="M16 12h.001"/><path d="M7 16h10"/></svg>', action: () => KeyboardShortcuts && KeyboardShortcuts.toggle() },
    { id: 'action-focus', label: 'Toggle Focus Mode', category: 'Actions', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/></svg>', action: () => FocusMode && FocusMode.toggle() },
  ];

  function init() {
    setupListeners();
  }

  function setupListeners() {
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggle();
      }
    });

    const panel = Utils.$('#command-palette');
    if (panel) {
      panel.addEventListener('click', e => e.stopPropagation());
    }

    document.addEventListener('click', e => {
      if (isOpen && !e.target.closest('#command-palette')) close();
    });
  }

  function toggle() { isOpen ? close() : open(); }

  function open() {
    isOpen = true;
    query = '';
    selectedIndex = 0;
    const panel = Utils.$('#command-palette');
    if (panel) panel.classList.add('open');
    const input = Utils.$('#cmd-input');
    if (input) { input.value = ''; input.focus(); }
    filteredCommands = [...commands];
    render();
  }

  function close() {
    isOpen = false;
    const panel = Utils.$('#command-palette');
    if (panel) panel.classList.remove('open');
  }

  function handleInput(e) {
    query = e.target.value.trim().toLowerCase();
    selectedIndex = 0;
    if (!query) { filteredCommands = [...commands]; }
    else {
      filteredCommands = commands.filter(c =>
        c.label.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query)
      );
    }
    render();
  }

  function handleKeyNav(e) {
    const items = Utils.$$('#cmd-results .cmd-item');
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); selectedIndex = Math.min(selectedIndex + 1, items.length - 1); updateSelection(items); }
    if (e.key === 'ArrowUp') { e.preventDefault(); selectedIndex = Math.max(selectedIndex - 1, 0); updateSelection(items); }
    if (e.key === 'Enter') { e.preventDefault(); if (items[selectedIndex]) items[selectedIndex].click(); }
  }

  function updateSelection(items) {
    items.forEach((item, i) => item.classList.toggle('selected', i === selectedIndex));
    if (items[selectedIndex]) items[selectedIndex].scrollIntoView({ block: 'nearest' });
  }

  function render() {
    const container = Utils.$('#cmd-results');
    if (!container) return;

    if (filteredCommands.length === 0) {
      container.innerHTML = '<div class="cmd-empty">No commands found</div>';
      return;
    }

    const grouped = {};
    filteredCommands.forEach(cmd => {
      if (!grouped[cmd.category]) grouped[cmd.category] = [];
      grouped[cmd.category].push(cmd);
    });

    let html = '';
    let idx = 0;
    for (const [cat, cmds] of Object.entries(grouped)) {
      html += `<div class="cmd-group"><div class="cmd-group-title">${cat}</div>`;
      cmds.forEach(cmd => {
        const sel = idx === selectedIndex ? 'selected' : '';
        html += `
          <div class="cmd-item ${sel}" data-cmd-id="${cmd.id}" data-idx="${idx}">
            <div class="cmd-icon">${cmd.icon}</div>
            <div class="cmd-label">${cmd.label}</div>
            ${cmd.shortcut ? `<div class="cmd-shortcut"><kbd>${cmd.shortcut}</kbd></div>` : ''}
          </div>
        `;
        idx++;
      });
      html += '</div>';
    }

    container.innerHTML = html;
    container.querySelectorAll('.cmd-item').forEach(item => {
      item.addEventListener('click', () => {
        const cmd = commands.find(c => c.id === item.dataset.cmdId);
        if (cmd) { close(); cmd.action(); }
      });
      item.addEventListener('mouseenter', () => {
        selectedIndex = parseInt(item.dataset.idx);
        container.querySelectorAll('.cmd-item').forEach((el, i) => el.classList.toggle('selected', parseInt(el.dataset.idx) === selectedIndex));
      });
    });
  }

  return { init, open, close, toggle, handleInput, handleKeyNav, commands };
})();
