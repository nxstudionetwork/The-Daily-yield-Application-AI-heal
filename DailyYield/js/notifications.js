const Notifications = (() => {
  let notifications = [];
  let activeTab = 'all';

  const mockNotifications = [
    { id: '1', type: 'news', title: 'Breaking: Global markets surge amid trade deal optimism', summary: 'Major indices hit new highs as US-China trade talks show progress', time: Date.now() - 300000, read: false, icon: '📰' },
    { id: '2', type: 'market', title: 'AAPL +3.2% — Apple reports record quarterly revenue', summary: 'Stock hits all-time high on strong iPhone sales', time: Date.now() - 900000, read: false, icon: '📈' },
    { id: '3', type: 'news', title: 'ISRO launches Chandrayaan-4 mission successfully', summary: 'India\'s lunar exploration program reaches new milestone', time: Date.now() - 1800000, read: false, icon: '🚀' },
    { id: '4', type: 'market', title: 'Crypto market cap exceeds $4 trillion', summary: 'Bitcoin crosses $95,000 milestone', time: Date.now() - 3600000, read: true, icon: '💰' },
    { id: '5', type: 'personal', title: 'Your watchlist stock TSLA moved +5.1%', summary: 'Price alert triggered for Tesla Inc.', time: Date.now() - 7200000, read: true, icon: '🔔' },
    { id: '6', type: 'news', title: 'AI breakthrough: New model achieves human-level reasoning', summary: 'Researchers demonstrate general reasoning capabilities', time: Date.now() - 14400000, read: true, icon: '🤖' },
    { id: '7', type: 'market', title: 'Fed signals rate pause in upcoming meeting', summary: 'Markets react positively to dovish commentary', time: Date.now() - 28800000, read: true, icon: '🏦' },
    { id: '8', type: 'personal', title: 'New article saved to your reading list', summary: '"Future of Quantum Computing" has been added', time: Date.now() - 43200000, read: true, icon: '📑' }
  ];

  function init() {
    notifications = Utils.storage.get('notifications', mockNotifications);
    updateBadge();
    setupListeners();
    renderPanel();
  }

  function setupListeners() {
    const bell = Utils.$('#notifications-bell');
    if (bell) {
      bell.addEventListener('click', e => {
        e.stopPropagation();
        togglePanel();
      });
    }

    const panel = Utils.$('#notifications-panel');
    if (panel) {
      panel.addEventListener('click', e => e.stopPropagation());
    }

    document.addEventListener('click', () => closePanel());

    Utils.$$('.notif-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        activeTab = tab.dataset.tab;
        Utils.$$('.notif-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === activeTab));
        renderPanel();
      });
    });
  }

  function togglePanel() {
    const panel = Utils.$('#notifications-panel');
    if (panel) panel.classList.toggle('open');
  }

  function closePanel() {
    const panel = Utils.$('#notifications-panel');
    if (panel) panel.classList.remove('open');
  }

  function showToast(message, type = 'info', duration = 4000) {
    const container = Utils.$('#toast-container');
    if (!container) return;

    const icons = {
      success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--positive)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      error: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--negative)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      warning: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };

    const toast = Utils.el('div', { className: `toast toast-${type}` }, []);
    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-content"><span class="toast-msg">${message}</span></div>
      <button class="toast-close" onclick="this.closest('.toast').remove()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }

  function markRead(id) {
    notifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    Utils.storage.set('notifications', notifications);
    updateBadge();
    renderPanel();
  }

  function markAllRead() {
    notifications = notifications.map(n => ({ ...n, read: true }));
    Utils.storage.set('notifications', notifications);
    updateBadge();
    renderPanel();
    showToast('All notifications marked as read', 'success');
  }

  function updateBadge() {
    const badge = Utils.$('#notif-badge');
    const unread = notifications.filter(n => !n.read).length;
    if (badge) {
      badge.textContent = unread;
      badge.style.display = unread > 0 ? 'flex' : 'none';
    }
  }

  function getFiltered() {
    if (activeTab === 'all') return notifications;
    const typeMap = { news: 'news', markets: 'market', personal: 'personal' };
    return notifications.filter(n => n.type === typeMap[activeTab]);
  }

  function renderPanel() {
    const list = Utils.$('#notifications-list');
    if (!list) return;

    const filtered = getFiltered();
    if (filtered.length === 0) {
      list.innerHTML = '<div class="notif-empty"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg><p>No notifications here</p></div>';
      return;
    }

    list.innerHTML = filtered.map(n => `
      <div class="notif-item ${n.read ? '' : 'unread'}" data-id="${n.id}">
        <div class="notif-icon">${n.icon}</div>
        <div class="notif-body">
          <div class="notif-title">${n.title}</div>
          <div class="notif-summary">${n.summary}</div>
          <div class="notif-time">${Utils.timeAgo(n.time)}</div>
        </div>
        ${!n.read ? '<div class="notif-dot"></div>' : ''}
      </div>
    `).join('');

    list.querySelectorAll('.notif-item').forEach(item => {
      item.addEventListener('click', () => markRead(item.dataset.id));
    });
  }

  function addNotification(notif) {
    notifications.unshift({ id: Utils.uid(), read: false, time: Date.now(), ...notif });
    Utils.storage.set('notifications', notifications);
    updateBadge();
    renderPanel();
  }

  return { init, showToast, markRead, markAllRead, togglePanel, closePanel, updateBadge, addNotification, notifications };
})();
