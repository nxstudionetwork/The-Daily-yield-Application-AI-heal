var NotificationsPage = (() => {
  var activeFilter = 'all';

  function renderNotificationsPage(content) {
    if (!content) return;
    content.innerHTML = `
      <div class="notifications-page fade-in">
        <div class="page-header">
          <h1 class="page-title">Notifications</h1>
          <div class="page-actions">
            <button class="btn btn-ghost btn-sm" id="notif-mark-all">Mark all as read</button>
            <button class="btn btn-ghost btn-sm" id="notif-clear-all">Clear all</button>
          </div>
        </div>

        <section class="section" style="max-width:700px;margin:0 auto">
          <div class="tab-group" id="notif-tabs" style="display:flex;gap:.5rem;margin-bottom:1.25rem">
            <button class="tab-item ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">All</button>
            <button class="tab-item ${activeFilter === 'news' ? 'active' : ''}" data-filter="news">News</button>
            <button class="tab-item ${activeFilter === 'markets' ? 'active' : ''}" data-filter="markets">Markets</button>
            <button class="tab-item ${activeFilter === 'social' ? 'active' : ''}" data-filter="social">Social</button>
          </div>
          <div id="notif-list"></div>
        </section>
      </div>
    `;
    renderNotifications();
    bindTabs();
    bindActions();
    Animations.scrollFade();
  }

  function getNotifications() {
    return [
      { id: 'nf01', type: 'news', icon: '🏦', title: 'Fed Holds Rates Steady', summary: 'The Federal Reserve held interest rates at 4.25%-4.50%. Markets react to Powell\'s September signal.', time: new Date(Date.now() - 15 * 60000).toISOString(), read: false, important: true },
      { id: 'nf02', type: 'markets', icon: '📈', title: 'SENSEX Hits Day Low', summary: 'BSE Sensex drops 342 points (-0.41%) to 82,456. Nifty falls below 25,200.', time: new Date(Date.now() - 25 * 60000).toISOString(), read: false, important: false },
      { id: 'nf03', type: 'social', icon: '💬', title: 'Sarah Mitchell replied to your comment', summary: '"Great analysis! I agree that the rate cut cycle is bullish for tech stocks."', time: new Date(Date.now() - 45 * 60000).toISOString(), read: false, important: false },
      { id: 'nf04', type: 'news', icon: '🚀', title: 'Mars Landing Confirmed', summary: 'SpaceX Starship Horizon has successfully landed four astronauts on Mars.', time: new Date(Date.now() - 90 * 60000).toISOString(), read: true, important: true },
      { id: 'nf05', type: 'markets', icon: '₿', title: 'Bitcoin Surpasses $120,000', summary: 'BTC hits new all-time high. BlackRock ETF inflows reach record $2.1B.', time: new Date(Date.now() - 120 * 60000).toISOString(), read: true, important: false },
      { id: 'nf06', type: 'social', icon: '❤️', title: 'Rajeev Chandrasekhar liked your post', summary: 'Your post about India GDP reaching 7.8% was liked by 12 others.', time: new Date(Date.now() - 180 * 60000).toISOString(), read: true, important: false },
      { id: 'nf07', type: 'news', icon: '🤖', title: 'GPT-5 Released', summary: 'OpenAI unveils GPT-5 with reasoning capabilities rivaling human experts.', time: new Date(Date.now() - 240 * 60000).toISOString(), read: true, important: true },
      { id: 'nf08', type: 'markets', icon: '🪙', title: 'Portfolio Alert: RELIANCE', summary: 'Reliance Industries is up 1.11% today, crossing your alert threshold of ₹2,900.', time: new Date(Date.now() - 300 * 60000).toISOString(), read: true, important: false },
      { id: 'nf09', type: 'social', icon: '💬', title: 'Harsha Bhogle mentioned you', summary: '"@arjunmehta Great point about the cricket economy! The IPL ecosystem is truly transformative."', time: new Date(Date.now() - 360 * 60000).toISOString(), read: true, important: false },
      { id: 'nf10', type: 'news', icon: '🇮🇳', title: 'India GDP Growth: 7.8%', summary: 'India GDP surges to 7.8% in Q1, beating all expectations.', time: new Date(Date.now() - 420 * 60000).toISOString(), read: true, important: false },
      { id: 'nf11', type: 'markets', icon: '📊', title: 'Market Open', summary: 'US markets have opened. S&P 500 futures up 0.3%. NASDAQ up 0.8%.', time: new Date(Date.now() - 600 * 60000).toISOString(), read: true, important: false },
      { id: 'nf12', type: 'social', icon: '👥', title: 'New follower', summary: 'Priya Sharma started following you. She\'s an AI researcher at IIT Bombay.', time: new Date(Date.now() - 720 * 60000).toISOString(), read: true, important: false },
      { id: 'nf13', type: 'news', icon: '⚖️', title: 'Supreme Court AI Ruling', summary: 'Justices rule 6-3 extending Fourth Amendment protections to AI surveillance.', time: new Date(Date.now() - 900 * 60000).toISOString(), read: true, important: false },
      { id: 'nf14', type: 'markets', icon: '🏆', title: 'Watchlist Alert: TATAMOTORS', summary: 'Tata Motors surges 4.84% — your biggest gainer today. EV segment growth +47%.', time: new Date(Date.now() - 1080 * 60000).toISOString(), read: true, important: false },
      { id: 'nf15', type: 'social', icon: '🎯', title: 'Weekly digest ready', summary: 'Your weekly portfolio summary is ready. Total return: +4.2%. Top performer: TATAMOTORS (+12.3%).', time: new Date(Date.now() - 1800 * 60000).toISOString(), read: true, important: false }
    ];
  }

  function renderNotifications() {
    var el = document.getElementById('notif-list');
    if (!el) return;
    var notifications = getNotifications();
    var filtered = activeFilter === 'all' ? notifications : notifications.filter(function(n) { return n.type === activeFilter; });

    if (filtered.length === 0) {
      el.innerHTML = '<div style="text-align:center;padding:3rem 1rem">' +
        '<div style="font-size:2.5rem;margin-bottom:.75rem">🔔</div>' +
        '<h3 style="font-size:1rem;font-weight:600;margin-bottom:.35rem">No notifications</h3>' +
        '<p style="font-size:.85rem;color:var(--text-muted)">You\'re all caught up!</p>' +
      '</div>';
      return;
    }

    el.innerHTML = filtered.map(function(n) {
      var typeColor = n.type === 'news' ? 'var(--blue)' : n.type === 'markets' ? 'var(--gold)' : '#8B5CF6';
      var timeStr = Utils.timeAgo(n.time);
      return '<div class="glass-card" style="padding:1rem 1.25rem;margin-bottom:.5rem;border-left:3px solid ' + (!n.read ? typeColor : 'transparent') + ';opacity:' + (n.read ? '.7' : '1') + ';cursor:pointer;transition:background .2s;border-radius:0 12px 12px 0" ' +
        'onmouseover="this.style.background=\'rgba(255,255,255,.04)\'" onmouseout="this.style.background=\'transparent\'">' +
        '<div style="display:flex;gap:.75rem;align-items:start">' +
          '<div style="width:38px;height:38px;border-radius:10px;background:' + typeColor + '22;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0">' + n.icon + '</div>' +
          '<div style="flex:1;min-width:0">' +
            '<div style="display:flex;justify-content:space-between;align-items:start;gap:.5rem">' +
              '<div style="font-size:.88rem;font-weight:' + (!n.read ? '700' : '500') + '">' + n.title + (n.important ? ' <span style="color:var(--gold);font-size:.7rem">● Important</span>' : '') + '</div>' +
              '<div style="font-size:.7rem;color:var(--text-muted);white-space:nowrap;flex-shrink:0">' + timeStr + '</div>' +
            '</div>' +
            '<div style="font-size:.8rem;color:var(--text-muted);margin-top:.2rem;line-height:1.4">' + n.summary + '</div>' +
            '<div style="display:flex;gap:.75rem;margin-top:.45rem">' +
              '<span style="font-size:.68rem;padding:.12rem .4rem;border-radius:6px;background:' + typeColor + '22;color:' + typeColor + '">' + n.type.charAt(0).toUpperCase() + n.type.slice(1) + '</span>' +
              (!n.read ? '<span style="font-size:.68rem;color:' + typeColor + '">Unread</span>' : '') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function bindTabs() {
    var tabs = document.querySelectorAll('#notif-tabs .tab-item');
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        activeFilter = tab.dataset.filter;
        tabs.forEach(function(t) { t.classList.toggle('active', t.dataset.filter === activeFilter); });
        renderNotifications();
      });
    });
  }

  function bindActions() {
    var markAll = document.getElementById('notif-mark-all');
    var clearAll = document.getElementById('notif-clear-all');
    if (markAll) {
      markAll.addEventListener('click', function() {
        if (typeof Notifications !== 'undefined' && Notifications.showToast) {
          Notifications.showToast('All notifications marked as read', 'success');
        }
        var items = document.querySelectorAll('#notif-list .glass-card');
        items.forEach(function(item) {
          item.style.opacity = '.7';
          var unread = item.querySelector('[style*="Unread"]');
          if (unread) unread.remove();
        });
      });
    }
    if (clearAll) {
      clearAll.addEventListener('click', function() {
        var list = document.getElementById('notif-list');
        if (list) {
          list.innerHTML = '<div style="text-align:center;padding:3rem 1rem">' +
            '<div style="font-size:2.5rem;margin-bottom:.75rem">🔔</div>' +
            '<h3 style="font-size:1rem;font-weight:600;margin-bottom:.35rem">No notifications</h3>' +
            '<p style="font-size:.85rem;color:var(--text-muted)">You\'re all caught up!</p>' +
          '</div>';
        }
        if (typeof Notifications !== 'undefined' && Notifications.showToast) {
          Notifications.showToast('All notifications cleared', 'success');
        }
      });
    }
  }

  return { render: renderNotificationsPage };
})();
