const InvestmentDashboard = (() => {
  let currentPage = 'dashboard';
  let sidebarOpen = false;

  const COLORS = {
    gold: '#D4AF37',
    green: '#22c55e',
    red: '#ef4444',
    blue: '#3B82F6',
    purple: '#a855f7',
    orange: '#f97316',
    cyan: '#06b6d4',
    bgPrimary: '#050505',
    bgSecondary: '#0a0a0a',
    bgTertiary: '#111111',
    bgCard: '#141414',
    border: '#2a2a2a',
    textPrimary: '#ffffff',
    textSecondary: '#a0a0a0',
    textMuted: '#6b6b6b'
  };

  const SECTOR_COLORS = ['#D4AF37','#3B82F6','#22c55e','#ef4444','#a855f7','#f97316','#06b6d4','#ec4899','#84cc16','#f59e0b','#6366f1','#14b8a6'];

  function hideMainApp() {
    const h = document.getElementById('header');
    const t = document.getElementById('ticker-bar');
    const s = document.getElementById('sidebar');
    const o = document.getElementById('sidebar-overlay');
    const b = document.getElementById('bottom-nav');
    if (h) h.style.display = 'none';
    if (t) t.style.display = 'none';
    if (s) s.style.display = 'none';
    if (o) o.style.display = 'none';
    if (b) b.style.display = 'none';
  }

  function showMainApp() {
    const h = document.getElementById('header');
    const t = document.getElementById('ticker-bar');
    const s = document.getElementById('sidebar');
    const b = document.getElementById('bottom-nav');
    if (h) h.style.display = '';
    if (t) t.style.display = '';
    if (s) s.style.display = '';
    if (b) b.style.display = '';
  }

  function fmt(n, dec) {
    if (n == null) return '0';
    if (dec !== undefined) return Number(n).toFixed(dec);
    if (Math.abs(n) >= 1e12) return (n / 1e12).toFixed(2) + 'T';
    if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (Math.abs(n) >= 1e7) return (n / 1e7).toFixed(2) + 'Cr';
    if (Math.abs(n) >= 1e5) return (n / 1e5).toFixed(2) + 'L';
    return Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  }

  function fmtCur(n) {
    try { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n); }
    catch { return '₹' + Number(n).toFixed(2); }
  }

  function changeHTML(change, pct) {
    const cls = change >= 0 ? 'positive' : 'negative';
    const sign = change >= 0 ? '+' : '';
    const arrow = change >= 0 ? '▲' : '▼';
    return `<span style="color:var(--${cls})">${arrow} ${sign}${Number(change).toFixed(2)} (${sign}${Number(pct).toFixed(2)}%)</span>`;
  }

  function miniSparklineSVG(data, w, h, color) {
    if (!data || data.length < 2) return '';
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const pts = data.map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h * 0.8 - h * 0.1;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const fillColor = color || (data[data.length - 1] >= data[0] ? COLORS.green : COLORS.red);
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block;"><defs><linearGradient id="sg_${color ? color.replace('#','') : 'def'}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${fillColor}" stop-opacity="0.3"/><stop offset="100%" stop-color="${fillColor}" stop-opacity="0"/></linearGradient></defs><polygon points="0,${h} ${pts.join(' ')} ${w},${h}" fill="url(#sg_${color ? color.replace('#','') : 'def'})"/><polyline points="${pts.join(' ')}" fill="none" stroke="${fillColor}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  function render(content) {
    if (!content) return;
    hideMainApp();
    StockEngine.init();
    content.innerHTML = buildLayout();
    bindSidebar();
    navigateTo('dashboard');
    window.removeEventListener('hashchange', onHashChange);
    window.addEventListener('hashchange', onHashChange);
  }

  function buildLayout() {
    const user = InvestmentAuth.getCurrentUser();
    const userName = user ? user.name.split(' ')[0] : 'Investor';
    const navItems = [
      { id: 'dashboard', icon: '📊', label: 'Dashboard' },
      { id: 'markets', icon: '📈', label: 'Markets' },
      { id: 'trading', icon: '💹', label: 'Trading' },
      { id: 'portfolio', icon: '💼', label: 'Portfolio' },
      { id: 'watchlist', icon: '⭐', label: 'Watchlist' },
      { id: 'transactions', icon: '📜', label: 'Transactions' },
      { id: 'analytics', icon: '📈', label: 'Analytics' },
      { id: 'research', icon: '📚', label: 'Research' },
      { id: 'ai-analyst', icon: '🤖', label: 'AI Analyst' },
      { id: 'screener', icon: '🔍', label: 'Stock Screener' },
      { id: 'calendar', icon: '📅', label: 'Calendar' },
      { id: 'goals', icon: '🎯', label: 'Goals' },
      { id: 'alerts', icon: '🔔', label: 'Alerts' },
      { id: 'settings', icon: '⚙', label: 'Settings' }
    ];

    const navHTML = navItems.map(item => `
      <button class="inv-nav-item ${item.id === 'dashboard' ? 'active' : ''}" data-page="${item.id}">
        <span class="inv-nav-icon">${item.icon}</span>
        <span class="inv-nav-label">${item.label}</span>
      </button>
    `).join('');

    return `
      <style>
        .inv-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:998}
        .inv-overlay.active{display:block}
        @keyframes invSpin{to{transform:rotate(360deg)}}
        .inv-layout{display:flex;height:100vh;overflow:hidden;background:var(--bg-primary)}
        .inv-sidebar{width:260px;min-width:260px;background:var(--bg-secondary);border-right:1px solid var(--border);display:flex;flex-direction:column;z-index:999;transition:transform .3s ease}
        .inv-sidebar-header{padding:1.25rem 1rem;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:.75rem}
        .inv-sidebar-nav{flex:1;overflow-y:auto;padding:.5rem}
        .inv-nav-item{width:100%;display:flex;align-items:center;gap:.75rem;padding:.7rem 1rem;border-radius:var(--radius);cursor:pointer;font-size:.875rem;color:var(--text-secondary);background:none;border:none;text-align:left;transition:all .15s ease;font-family:inherit;margin-bottom:2px}
        .inv-nav-item:hover{background:var(--bg-tertiary);color:var(--text-primary)}
        .inv-nav-item.active{background:rgba(212,175,55,0.1);color:var(--gold);font-weight:600}
        .inv-nav-icon{font-size:1.1rem;width:24px;text-align:center;flex-shrink:0}
        .inv-nav-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .inv-sidebar-footer{padding:1rem;border-top:1px solid var(--border)}
        .inv-main{flex:1;overflow-y:auto;overflow-x:hidden;display:flex;flex-direction:column}
        .inv-topbar{height:56px;min-height:56px;border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 1.25rem;gap:1rem;background:var(--bg-secondary)}
        .inv-content{flex:1;padding:1.5rem;overflow-y:auto}
        .inv-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.25rem;transition:border-color .2s}
        .inv-card:hover{border-color:var(--border-light)}
        .inv-card-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem}
        .inv-card-title{font-size:.9rem;font-weight:600;color:var(--text-primary)}
        .inv-card-subtitle{font-size:.75rem;color:var(--text-muted)}
        .inv-btn{padding:.5rem 1rem;border-radius:var(--radius);font-size:.8rem;font-weight:600;cursor:pointer;border:none;transition:all .15s;font-family:inherit}
        .inv-btn-gold{background:linear-gradient(135deg,#D4AF37,#B8860B);color:#0a0a0a}
        .inv-btn-gold:hover{opacity:.9;transform:translateY(-1px)}
        .inv-btn-sm{padding:.35rem .75rem;font-size:.75rem}
        .inv-btn-outline{background:transparent;border:1px solid var(--border);color:var(--text-secondary)}
        .inv-btn-outline:hover{border-color:var(--gold);color:var(--gold)}
        .inv-btn-danger{background:rgba(239,68,68,0.15);color:#ef4444;border:1px solid rgba(239,68,68,0.25)}
        .inv-btn-green{background:rgba(34,197,94,0.15);color:#22c55e;border:1px solid rgba(34,197,94,0.25)}
        .inv-input{width:100%;padding:.6rem .85rem;background:var(--input-bg);border:1px solid var(--input-border);border-radius:var(--radius);color:var(--text-primary);font-size:.875rem;font-family:inherit}
        .inv-input:focus{outline:none;border-color:var(--gold)}
        .inv-select{width:100%;padding:.6rem .85rem;background:var(--input-bg);border:1px solid var(--input-border);border-radius:var(--radius);color:var(--text-primary);font-size:.875rem;font-family:inherit}
        .inv-table{width:100%;border-collapse:collapse;font-size:.85rem}
        .inv-table th{text-align:left;padding:.65rem .75rem;color:var(--text-muted);font-weight:600;font-size:.75rem;text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid var(--border);white-space:nowrap}
        .inv-table td{padding:.65rem .75rem;border-bottom:1px solid rgba(42,42,42,0.5);white-space:nowrap;color:var(--text-secondary)}
        .inv-table tr:hover td{background:rgba(255,255,255,0.02)}
        .inv-chip{display:inline-flex;align-items:center;padding:.3rem .75rem;border-radius:var(--radius-full);font-size:.75rem;font-weight:500;cursor:pointer;border:1px solid var(--border);color:var(--text-secondary);transition:all .15s;background:transparent}
        .inv-chip.active,.inv-chip:hover{border-color:var(--gold);color:var(--gold);background:rgba(212,175,55,0.08)}
        .inv-stat-label{font-size:.75rem;color:var(--text-muted);margin-bottom:.25rem}
        .inv-stat-value{font-size:1.5rem;font-weight:700;color:var(--text-primary)}
        .inv-stat-value.gold{color:var(--gold)}
        .inv-section-title{font-size:1.1rem;font-weight:700;color:var(--text-primary);margin-bottom:1rem}
        .inv-progress-bar{width:100%;height:8px;background:var(--bg-tertiary);border-radius:var(--radius-full);overflow:hidden}
        .inv-progress-fill{height:100%;border-radius:var(--radius-full);transition:width .5s ease}
        .inv-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:3rem 1rem;color:var(--text-muted);text-align:center}
        .inv-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:1000;display:none;align-items:center;justify-content:center}
        .inv-modal-overlay.active{display:flex}
        .inv-modal{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.5rem;max-width:480px;width:90%;max-height:80vh;overflow-y:auto}
        @media(max-width:768px){
          .inv-sidebar{position:fixed;left:0;top:0;bottom:0;transform:translateX(-100%)}
          .inv-sidebar.open{transform:translateX(0)}
          .inv-content{padding:1rem}
          .inv-stat-value{font-size:1.2rem}
          .inv-grid-2{grid-template-columns:1fr !important}
          .inv-grid-3{grid-template-columns:1fr !important}
          .inv-grid-4{grid-template-columns:1fr !important}
        }
      </style>
      <div class="inv-layout" id="inv-layout">
        <div class="inv-overlay" id="inv-overlay"></div>
        <aside class="inv-sidebar" id="inv-sidebar">
          <div class="inv-sidebar-header">
            <svg width="28" height="28" viewBox="0 0 40 40"><defs><linearGradient id="inv-logo-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#d4a017"/><stop offset="100%" stop-color="#b8860b"/></linearGradient></defs><circle cx="20" cy="20" r="18" fill="url(#inv-logo-g)"/><polyline points="12 20 17 25 28 14" fill="none" stroke="#0a0a0a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <div>
              <div style="font-weight:700;font-size:.95rem;color:var(--text-primary)">Investment</div>
              <div style="font-size:.7rem;color:var(--text-muted)">Dashboard</div>
            </div>
          </div>
          <nav class="inv-sidebar-nav">${navHTML}</nav>
          <div class="inv-sidebar-footer">
            <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.75rem">
              <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#D4AF37,#B8860B);display:flex;align-items:center;justify-content:center;color:#0a0a0a;font-weight:700;font-size:.8rem">${userName.charAt(0).toUpperCase()}</div>
              <div>
                <div style="font-size:.85rem;font-weight:600;color:var(--text-primary)">${userName}</div>
                <div style="font-size:.7rem;color:var(--text-muted)">${user ? user.email : ''}</div>
              </div>
            </div>
            <div style="display:flex;gap:.5rem">
              <a href="#/home" class="inv-btn inv-btn-outline inv-btn-sm" style="flex:1;text-align:center;text-decoration:none" onclick="window.__invGoingHome=true">🏠 Daily Yield</a>
              <button class="inv-btn inv-btn-danger inv-btn-sm" id="inv-logout-btn" style="flex:0 0 auto;padding:.35rem .65rem">⏻</button>
            </div>
          </div>
        </aside>
        <div class="inv-main" id="inv-main">
          <div class="inv-topbar" id="inv-topbar">
            <button id="inv-menu-btn" class="inv-btn inv-btn-outline inv-btn-sm" style="display:none;padding:.4rem .6rem">☰</button>
            <div style="flex:1">
              <h2 id="inv-page-title" style="font-size:1.1rem;font-weight:700;color:var(--text-primary)">Dashboard</h2>
            </div>
            <div style="display:flex;align-items:center;gap:.75rem">
              <div style="position:relative">
                <input type="text" class="inv-input" id="inv-global-search" placeholder="Search companies..." style="width:220px;padding:.45rem .75rem;padding-left:2rem;font-size:.8rem" />
                <svg style="position:absolute;left:.65rem;top:50%;transform:translateY(-50%);color:var(--text-muted)" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <div id="inv-search-results" style="display:none;position:absolute;top:100%;left:0;right:0;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);margin-top:4px;max-height:300px;overflow-y:auto;z-index:100;box-shadow:var(--shadow-lg)"></div>
              </div>
            </div>
          </div>
          <div class="inv-content" id="inv-content"></div>
        </div>
      </div>
      <div class="inv-modal-overlay" id="inv-modal-overlay">
        <div class="inv-modal" id="inv-modal"></div>
      </div>
    `;
  }

  function bindSidebar() {
    const items = document.querySelectorAll('.inv-nav-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        navigateTo(item.dataset.page);
        if (window.innerWidth <= 768) closeSidebarMobile();
      });
    });

    const overlay = document.getElementById('inv-overlay');
    if (overlay) overlay.addEventListener('click', closeSidebarMobile);

    const menuBtn = document.getElementById('inv-menu-btn');
    if (menuBtn && window.innerWidth <= 768) {
      menuBtn.style.display = 'block';
      menuBtn.addEventListener('click', openSidebarMobile);
    }

    const logoutBtn = document.getElementById('inv-logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => {
      InvestmentAuth.logout();
    });

    const homeLink = document.querySelector('a[href="#/home"]');
    if (homeLink) {
      homeLink.addEventListener('click', () => { showMainApp(); });
    }

    initGlobalSearch();

    window.addEventListener('resize', () => {
      const btn = document.getElementById('inv-menu-btn');
      if (btn) btn.style.display = window.innerWidth <= 768 ? 'block' : 'none';
    });
  }

  function openSidebarMobile() {
    const sidebar = document.getElementById('inv-sidebar');
    const overlay = document.getElementById('inv-overlay');
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('active');
  }

  function closeSidebarMobile() {
    const sidebar = document.getElementById('inv-sidebar');
    const overlay = document.getElementById('inv-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
  }

  function navigateTo(page) {
    currentPage = page;
    document.querySelectorAll('.inv-nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });
    const titleEl = document.getElementById('inv-page-title');
    const titles = {
      dashboard: 'Dashboard', markets: 'Markets', trading: 'Trading', portfolio: 'Portfolio',
      watchlist: 'Watchlist', transactions: 'Transactions', analytics: 'Analytics',
      research: 'Research', 'ai-analyst': 'AI Analyst', screener: 'Stock Screener',
      calendar: 'Calendar', goals: 'Goals', alerts: 'Alerts', settings: 'Settings'
    };
    if (titleEl) titleEl.textContent = titles[page] || 'Dashboard';

    const container = document.getElementById('inv-content');
    if (!container) return;
    container.scrollTop = 0;

    const pages = {
      dashboard: renderDashboard,
      markets: renderMarkets,
      trading: renderTrading,
      portfolio: renderPortfolio,
      watchlist: renderWatchlist,
      transactions: renderTransactions,
      analytics: renderAnalytics,
      research: renderResearch,
      'ai-analyst': renderAIAnalyst,
      screener: renderScreener,
      calendar: renderCalendar,
      goals: renderGoals,
      alerts: renderAlerts,
      settings: renderSettings
    };

    if (pages[page]) pages[page](container);
  }

  function onHashChange() {
    const hash = window.location.hash.slice(1);
    // If navigating to dashboard or investment while authenticated, stay
    if (hash === '/dashboard' || hash === '/investment') return;
    // Otherwise restore main app chrome and let the router handle it
    showMainApp();
    window.removeEventListener('hashchange', onHashChange);
  }

  function initGlobalSearch() {
    const input = document.getElementById('inv-global-search');
    const results = document.getElementById('inv-search-results');
    if (!input || !results) return;

    input.addEventListener('input', Utils.debounce(() => {
      const q = input.value.trim();
      if (!q) { results.style.display = 'none'; return; }
      const found = StockEngine.searchCompanies(q).slice(0, 8);
      if (found.length === 0) { results.style.display = 'none'; return; }
      results.style.display = 'block';
      results.innerHTML = found.map(c => `
        <div class="inv-search-item" data-id="${c.id}" style="padding:.6rem .75rem;cursor:pointer;display:flex;align-items:center;gap:.75rem;border-bottom:1px solid var(--border);transition:background .15s">
          <span style="font-size:1.1rem">${c.logo || '📊'}</span>
          <div style="flex:1;min-width:0">
            <div style="font-size:.8rem;font-weight:600;color:var(--text-primary)">${c.ticker}</div>
            <div style="font-size:.7rem;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.companyName || c.name}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:.8rem;font-weight:600;color:var(--text-primary)">${fmtCur(c.currentPrice)}</div>
            <div style="font-size:.7rem;color:${c.dayChangePct >= 0 ? COLORS.green : COLORS.red}">${c.dayChangePct >= 0 ? '+' : ''}${Number(c.dayChangePct).toFixed(2)}%</div>
          </div>
        </div>
      `).join('');

      results.querySelectorAll('.inv-search-item').forEach(item => {
        item.addEventListener('mouseenter', () => item.style.background = 'var(--bg-tertiary)');
        item.addEventListener('mouseleave', () => item.style.background = 'transparent');
        item.addEventListener('click', () => {
          results.style.display = 'none';
          input.value = '';
          navigateTo('trading');
          setTimeout(() => selectCompanyForTrading(item.dataset.id), 100);
        });
      });
    }, 250));

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !results.contains(e.target)) {
        results.style.display = 'none';
      }
    });
  }

  let tradingSelectedCompany = null;

  function selectCompanyForTrading(companyId) {
    tradingSelectedCompany = StockEngine.findCompany(companyId);
    renderTrading(document.getElementById('inv-content'));
  }

  function showModal(html) {
    const overlay = document.getElementById('inv-modal-overlay');
    const modal = document.getElementById('inv-modal');
    if (overlay) overlay.classList.add('active');
    if (modal) modal.innerHTML = html;
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
      }, { once: true });
    }
  }

  function closeModal() {
    const overlay = document.getElementById('inv-modal-overlay');
    if (overlay) overlay.classList.remove('active');
  }

  // =========================== DASHBOARD PAGE ===========================
  function renderDashboard(container) {
    const portfolio = StockEngine.getPortfolio();
    const holdings = StockEngine.getHoldings();
    const totalValue = StockEngine.getTotalValue();
    const dayGain = StockEngine.getDayGain();
    const totalReturn = StockEngine.getTotalReturn();
    const transactions = StockEngine.getTransactions();
    const watchlist = StockEngine.getWatchlist();
    const user = InvestmentAuth.getCurrentUser();
    const userName = user ? user.name.split(' ')[0] : 'Investor';
    const mktData = (typeof InvestmentData !== 'undefined' && InvestmentData.marketOverview) ? InvestmentData.marketOverview : [];
    const gainers = (typeof InvestmentData !== 'undefined' && InvestmentData.getTopGainers) ? InvestmentData.getTopGainers(3) : [];
    const losers = (typeof InvestmentData !== 'undefined' && InvestmentData.getTopLosers) ? InvestmentData.getTopLosers(3) : [];

    const sparkData = holdings.slice(0, 10).map(h => h.quantity * h.currentPrice);
    if (sparkData.length < 2) {
      for (let i = sparkData.length; i < 12; i++) sparkData.push(1000000 + Math.random() * 50000);
    }

    const topHoldingsHTML = holdings.slice(0, 5).map(h => {
      const c = StockEngine.findCompany(h.companyId);
      if (!c) return '';
      const value = h.quantity * h.currentPrice;
      const pnl = (h.currentPrice - h.avgPrice) * h.quantity;
      const pnlPct = ((h.currentPrice - h.avgPrice) / h.avgPrice) * 100;
      return `
        <tr>
          <td><span style="margin-right:.5rem">${c.logo || '📊'}</span> <strong style="color:var(--text-primary)">${c.ticker}</strong><br><span style="font-size:.7rem;color:var(--text-muted)">${c.companyName || c.name}</span></td>
          <td style="text-align:right">${h.quantity}</td>
          <td style="text-align:right">${fmtCur(value)}</td>
          <td style="text-align:right;color:${pnl >= 0 ? COLORS.green : COLORS.red}">${pnl >= 0 ? '+' : ''}${fmtCur(pnl)}<br><span style="font-size:.7rem">${pnlPct >= 0 ? '+' : ''}${pnlPct.toFixed(2)}%</span></td>
        </tr>`;
    }).join('');

    const indicesHTML = mktData.slice(0, 4).map(idx => `
      <div style="padding:.75rem;background:var(--bg-tertiary);border-radius:var(--radius);border:1px solid var(--border)">
        <div style="font-size:.7rem;color:var(--text-muted)">${idx.label}</div>
        <div style="font-size:1rem;font-weight:700;color:var(--text-primary)">${fmt(idx.value, 2)}</div>
        <div style="font-size:.75rem;color:${idx.changePct >= 0 ? COLORS.green : COLORS.red}">${idx.changePct >= 0 ? '+' : ''}${idx.changePct.toFixed(2)}%</div>
      </div>
    `).join('');

    const gainersHTML = gainers.map(c => `
      <div style="padding:.75rem;background:var(--bg-tertiary);border-radius:var(--radius);border:1px solid var(--border);cursor:pointer" onclick="document.querySelector('[data-page=trading]').click()">
        <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem">
          <span>${c.logo || '📊'}</span>
          <span style="font-size:.8rem;font-weight:600;color:var(--text-primary)">${c.ticker}</span>
        </div>
        <div style="font-size:.9rem;font-weight:700">${fmtCur(c.currentPrice)}</div>
        <div style="font-size:.75rem;color:${COLORS.green}">▲ +${Number(c.dayChangePct).toFixed(2)}%</div>
      </div>
    `).join('');

    const losersHTML = losers.map(c => `
      <div style="padding:.75rem;background:var(--bg-tertiary);border-radius:var(--radius);border:1px solid var(--border);cursor:pointer" onclick="document.querySelector('[data-page=trading]').click()">
        <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem">
          <span>${c.logo || '📊'}</span>
          <span style="font-size:.8rem;font-weight:600;color:var(--text-primary)">${c.ticker}</span>
        </div>
        <div style="font-size:.9rem;font-weight:700">${fmtCur(c.currentPrice)}</div>
        <div style="font-size:.75rem;color:${COLORS.red}">▼ ${Number(c.dayChangePct).toFixed(2)}%</div>
      </div>
    `).join('');

    const recentTxHTML = transactions.slice(0, 5).map(tx => {
      const c = StockEngine.findCompany(tx.companyId);
      return `
        <tr>
          <td style="font-size:.75rem">${new Date(tx.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</td>
          <td><span style="padding:.15rem .5rem;border-radius:var(--radius-full);font-size:.7rem;font-weight:600;background:${tx.type === 'buy' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)'};color:${tx.type === 'buy' ? COLORS.green : COLORS.red}">${tx.type.toUpperCase()}</span></td>
          <td style="font-weight:600;color:var(--text-primary)">${c ? c.ticker : '—'}</td>
          <td>${tx.quantity}</td>
          <td style="text-align:right">${fmtCur(tx.total)}</td>
        </tr>`;
    }).join('');

    const wlHTML = watchlist.slice(0, 4).map(c => `
      <div style="display:flex;align-items:center;gap:.6rem;padding:.5rem .6rem;background:var(--bg-tertiary);border-radius:var(--radius);border:1px solid var(--border)">
        <span>${c.logo || '📊'}</span>
        <div style="flex:1;min-width:0">
          <div style="font-size:.8rem;font-weight:600;color:var(--text-primary)">${c.ticker}</div>
          <div style="font-size:.7rem;color:var(--text-muted)">${fmtCur(c.currentPrice)}</div>
        </div>
        <span style="font-size:.75rem;color:${c.dayChangePct >= 0 ? COLORS.green : COLORS.red}">${c.dayChangePct >= 0 ? '+' : ''}${Number(c.dayChangePct).toFixed(2)}%</span>
      </div>
    `).join('');

    container.innerHTML = `
      <div style="margin-bottom:1.5rem">
        <h2 style="font-size:1.5rem;font-weight:700;color:var(--text-primary);margin-bottom:.25rem">Welcome back, ${userName}</h2>
        <p style="color:var(--text-muted);font-size:.9rem">Here's your portfolio overview</p>
      </div>

      <div class="inv-grid-4" style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.5rem">
        <div class="inv-card" style="grid-column:span 2">
          <div class="inv-stat-label">Portfolio Value</div>
          <div class="inv-stat-value gold">${fmtCur(totalValue)}</div>
          <div style="margin-top:.5rem">${changeHTML(dayGain.amount, dayGain.percentage)}</div>
        </div>
        <div class="inv-card">
          <div class="inv-stat-label">Available Cash</div>
          <div class="inv-stat-value">${fmtCur(portfolio.cashBalance)}</div>
          <div style="margin-top:.35rem;font-size:.75rem;color:var(--text-muted)">Buying Power</div>
        </div>
        <div class="inv-card">
          <div class="inv-stat-label">Total Return</div>
          <div class="inv-stat-value" style="color:${totalReturn.percentage >= 0 ? COLORS.green : COLORS.red}">${totalReturn.percentage >= 0 ? '+' : ''}${totalReturn.percentage.toFixed(2)}%</div>
          <div style="margin-top:.35rem;font-size:.75rem;color:var(--text-muted)">${fmtCur(totalReturn.amount)}</div>
        </div>
      </div>

      <div class="inv-grid-2" style="display:grid;grid-template-columns:2fr 1fr;gap:1rem;margin-bottom:1.5rem">
        <div class="inv-card">
          <div class="inv-card-header">
            <span class="inv-card-title">Portfolio Chart</span>
          </div>
          <div style="height:180px">${miniSparklineSVG(sparkData, 500, 180, COLORS.gold)}</div>
        </div>
        <div class="inv-card">
          <div class="inv-card-header">
            <span class="inv-card-title">Quick Stats</span>
          </div>
          <div style="display:grid;gap:.75rem">
            <div style="display:flex;justify-content:space-between"><span style="color:var(--text-muted);font-size:.8rem">Invested</span><span style="font-weight:600;font-size:.85rem">${fmtCur(portfolio.investedAmount)}</span></div>
            <div style="display:flex;justify-content:space-between"><span style="color:var(--text-muted);font-size:.8rem">Holdings</span><span style="font-weight:600;font-size:.85rem">${holdings.length} stocks</span></div>
            <div style="display:flex;justify-content:space-between"><span style="color:var(--text-muted);font-size:.8rem">Day Gain</span><span style="font-weight:600;font-size:.85rem;color:${dayGain.amount >= 0 ? COLORS.green : COLORS.red}">${dayGain.amount >= 0 ? '+' : ''}${fmtCur(dayGain.amount)}</span></div>
            <div style="display:flex;justify-content:space-between"><span style="color:var(--text-muted);font-size:.8rem">Transactions</span><span style="font-weight:600;font-size:.85rem">${transactions.length}</span></div>
          </div>
        </div>
      </div>

      <div class="inv-grid-2" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem">
        <div class="inv-card" style="grid-column:span 2">
          <div class="inv-card-header"><span class="inv-card-title">Top Holdings</span></div>
          ${holdings.length > 0 ? `
            <div style="overflow-x:auto">
              <table class="inv-table">
                <thead><tr><th>Company</th><th style="text-align:right">Qty</th><th style="text-align:right">Value</th><th style="text-align:right">P/L</th></tr></thead>
                <tbody>${topHoldingsHTML}</tbody>
              </table>
            </div>` : `<div class="inv-empty" style="padding:2rem"><p style="color:var(--text-muted)">No holdings yet. Start trading!</p></div>`
          }
        </div>
      </div>

      <div style="margin-bottom:1.5rem">
        <div class="inv-card-header"><span class="inv-card-title">Market Indices</span></div>
        <div class="inv-grid-4" style="display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem">${indicesHTML}</div>
      </div>

      <div class="inv-grid-3" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1.5rem">
        <div class="inv-card">
          <div class="inv-card-header"><span class="inv-card-title" style="color:${COLORS.green}">Top Gainers</span></div>
          <div style="display:grid;gap:.5rem">${gainersHTML}</div>
        </div>
        <div class="inv-card">
          <div class="inv-card-header"><span class="inv-card-title" style="color:${COLORS.red}">Top Losers</span></div>
          <div style="display:grid;gap:.5rem">${losersHTML}</div>
        </div>
        <div class="inv-card">
          <div class="inv-card-header"><span class="inv-card-title">Recent Trades</span></div>
          ${transactions.length > 0 ? `
            <div style="overflow-x:auto">
              <table class="inv-table">${recentTxHTML}</table>
            </div>` : `<div class="inv-empty" style="padding:1.5rem"><p>No trades yet</p></div>`
          }
        </div>
      </div>

      <div class="inv-grid-2" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem">
        <div class="inv-card">
          <div class="inv-card-header"><span class="inv-card-title">Watchlist</span></div>
          ${watchlist.length > 0 ? `<div style="display:grid;gap:.5rem">${wlHTML}</div>` : `<div class="inv-empty"><p style="font-size:.85rem">Your watchlist is empty</p></div>`}
        </div>
        <div class="inv-card">
          <div class="inv-card-header"><span class="inv-card-title">AI Insight</span></div>
          <div style="padding:.5rem;background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.15);border-radius:var(--radius)">
            <div style="font-size:.75rem;font-weight:600;color:var(--gold);margin-bottom:.35rem">🤖 Market Intelligence</div>
            <p style="font-size:.8rem;color:var(--text-secondary);line-height:1.55">${holdings.length > 0
              ? 'Your portfolio is diversified across ' + StockEngine.getSectorAllocation().length + ' sectors. Consider reviewing allocation balance and setting stop-losses on high-beta positions.'
              : 'Start building your portfolio today. Our AI can help identify opportunities based on your risk appetite and investment goals.'
            }</p>
          </div>
        </div>
      </div>
    `;
  }

  // =========================== MARKETS PAGE ===========================
  function renderMarkets(container) {
    const allCompanies = StockEngine.getAllCompanies();
    const mktData = (typeof InvestmentData !== 'undefined' && InvestmentData.marketOverview) ? InvestmentData.marketOverview : [];
    const sectors = ['All', ...new Set(allCompanies.map(c => c.sector))];

    container.innerHTML = `
      <div style="margin-bottom:1.25rem;display:flex;flex-wrap:wrap;gap:1rem;align-items:center">
        <input type="text" class="inv-input" id="mkt-search" placeholder="Search by name, ticker, sector..." style="max-width:350px" />
        <div id="mkt-filters" style="display:flex;flex-wrap:wrap;gap:.4rem">
          ${sectors.slice(0, 10).map((s, i) => `<button class="inv-chip ${i === 0 ? 'active' : ''}" data-filter="${s}">${s}</button>`).join('')}
        </div>
        <div style="margin-left:auto;display:flex;gap:.5rem">
          <select class="inv-select" id="mkt-sort" style="width:auto;padding:.4rem .6rem;font-size:.8rem">
            <option value="name">Sort: Name</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="change-desc">Change: Best</option>
            <option value="change-asc">Change: Worst</option>
            <option value="volume-desc">Volume: Highest</option>
          </select>
        </div>
      </div>

      <div class="inv-grid-4" style="display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem;margin-bottom:1.5rem">
        ${mktData.map(idx => `
          <div class="inv-card" style="padding:1rem">
            <div style="font-size:.7rem;color:var(--text-muted)">${idx.label}</div>
            <div style="font-size:1.1rem;font-weight:700;color:var(--text-primary)">${fmt(idx.value, 2)}</div>
            <div style="font-size:.8rem;color:${idx.changePct >= 0 ? COLORS.green : COLORS.red}">${idx.changePct >= 0 ? '+' : ''}${Number(idx.change).toFixed(2)} (${idx.changePct >= 0 ? '+' : ''}${idx.changePct.toFixed(2)}%)</div>
          </div>
        `).join('')}
      </div>

      <div class="inv-card">
        <div style="overflow-x:auto">
          <table class="inv-table" id="mkt-table">
            <thead>
              <tr>
                <th>Company</th>
                <th style="text-align:right">Price</th>
                <th style="text-align:right">Change</th>
                <th style="text-align:right">Volume</th>
                <th style="text-align:right">Mkt Cap</th>
                <th style="text-align:center">Watch</th>
                <th style="text-align:center">Trade</th>
              </tr>
            </thead>
            <tbody id="mkt-tbody"></tbody>
          </table>
        </div>
      </div>
    `;

    let currentFilter = 'All';
    let currentSort = 'name';

    function renderTable() {
      let list = [...allCompanies];
      if (currentFilter !== 'All') list = list.filter(c => c.sector === currentFilter);

      const q = (document.getElementById('mkt-search')?.value || '').trim().toLowerCase();
      if (q) list = list.filter(c => (c.companyName || c.name || '').toLowerCase().includes(q) || (c.ticker || '').toLowerCase().includes(q));

      switch (currentSort) {
        case 'price-desc': list.sort((a, b) => b.currentPrice - a.currentPrice); break;
        case 'price-asc': list.sort((a, b) => a.currentPrice - b.currentPrice); break;
        case 'change-desc': list.sort((a, b) => b.dayChangePct - a.dayChangePct); break;
        case 'change-asc': list.sort((a, b) => a.dayChangePct - b.dayChangePct); break;
        case 'volume-desc': list.sort((a, b) => (b.volume || 0) - (a.volume || 0)); break;
        default: list.sort((a, b) => (a.companyName || a.name || '').localeCompare(b.companyName || b.name || ''));
      }

      const display = list.slice(0, 100);
      const tbody = document.getElementById('mkt-tbody');
      if (!tbody) return;
      tbody.innerHTML = display.map(c => {
        const isWL = StockEngine.isWatchlisted(c.id);
        return `
          <tr>
            <td>
              <div style="display:flex;align-items:center;gap:.6rem">
                <span style="font-size:1.2rem">${c.logo || '📊'}</span>
                <div>
                  <strong style="color:var(--text-primary)">${c.ticker}</strong><br>
                  <span style="font-size:.7rem;color:var(--text-muted)">${c.companyName || c.name}</span>
                </div>
              </div>
            </td>
            <td style="text-align:right;font-weight:600;color:var(--text-primary)">${fmtCur(c.currentPrice)}</td>
            <td style="text-align:right">${changeHTML(c.dayChange || c.dayChangePct * c.currentPrice / 100, c.dayChangePct)}</td>
            <td style="text-align:right">${fmt(c.volume)}</td>
            <td style="text-align:right">${c.marketCap ? (typeof c.marketCap === 'number' ? fmt(c.marketCap) : c.marketCap) : '—'}</td>
            <td style="text-align:center">
              <button class="inv-btn inv-btn-sm ${isWL ? 'inv-btn-gold' : 'inv-btn-outline'}" onclick="InvestmentDashboard._toggleWatchlist('${c.id}')">${isWL ? '★' : '☆'}</button>
            </td>
            <td style="text-align:center">
              <button class="inv-btn inv-btn-sm inv-btn-gold" onclick="InvestmentDashboard._goTrade('${c.id}')">Trade</button>
            </td>
          </tr>`;
      }).join('');

      if (display.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--text-muted)">No companies match your search</td></tr>`;
      }
    }

    document.getElementById('mkt-search')?.addEventListener('input', Utils.debounce(renderTable, 300));
    document.getElementById('mkt-sort')?.addEventListener('change', (e) => { currentSort = e.target.value; renderTable(); });
    document.querySelectorAll('#mkt-filters .inv-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#mkt-filters .inv-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentFilter = chip.dataset.filter;
        renderTable();
      });
    });

    renderTable();
  }

  // =========================== TRADING PAGE ===========================
  function renderTrading(container) {
    const c = tradingSelectedCompany;
    const holdings = StockEngine.getHoldings();
    const portfolio = StockEngine.getPortfolio();

    container.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem">
        <div>
          <div class="inv-card" style="margin-bottom:1rem">
            <div class="inv-card-header"><span class="inv-card-title">Select Company</span></div>
            <input type="text" class="inv-input" id="trade-search" placeholder="Search ticker or company name..." />
            <div id="trade-search-results" style="max-height:200px;overflow-y:auto;margin-top:.5rem"></div>
          </div>
          ${c ? `
            <div class="inv-card">
              <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem">
                <span style="font-size:2rem">${c.logo || '📊'}</span>
                <div>
                  <div style="font-size:1.1rem;font-weight:700;color:var(--text-primary)">${c.ticker}</div>
                  <div style="font-size:.8rem;color:var(--text-muted)">${c.companyName || c.name}</div>
                </div>
                <div style="margin-left:auto;text-align:right">
                  <div style="font-size:1.3rem;font-weight:700;color:var(--text-primary)">${fmtCur(c.currentPrice)}</div>
                  ${changeHTML(c.dayChange || 0, c.dayChangePct || 0)}
                </div>
              </div>
              <div style="height:120px;margin-bottom:1rem">${miniSparklineSVG(c.miniChart || [], 400, 120)}</div>
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.75rem">
                <div><div style="font-size:.7rem;color:var(--text-muted)">Open</div><div style="font-size:.85rem;font-weight:600">${fmtCur(c.open || c.previousClose)}</div></div>
                <div><div style="font-size:.7rem;color:var(--text-muted)">High</div><div style="font-size:.85rem;font-weight:600">${fmtCur(c.high || c.week52High)}</div></div>
                <div><div style="font-size:.7rem;color:var(--text-muted)">Low</div><div style="font-size:.85rem;font-weight:600">${fmtCur(c.low || c.week52Low)}</div></div>
                <div><div style="font-size:.7rem;color:var(--text-muted)">Volume</div><div style="font-size:.85rem;font-weight:600">${fmt(c.volume)}</div></div>
                <div><div style="font-size:.7rem;color:var(--text-muted)">P/E</div><div style="font-size:.85rem;font-weight:600">${c.pe || '—'}</div></div>
                <div><div style="font-size:.7rem;color:var(--text-muted)">Rating</div><div style="font-size:.85rem;font-weight:600;color:var(--gold)">${c.rating || c.analystRecommendation || '—'}</div></div>
              </div>
            </div>
          ` : `
            <div class="inv-card">
              <div class="inv-empty"><p>Select a company to start trading</p></div>
            </div>
          `}
        </div>
        <div>
          <div class="inv-card">
            <div class="inv-card-header"><span class="inv-card-title">Place Order</span></div>
            <div style="display:flex;gap:.5rem;margin-bottom:1rem">
              <button class="inv-btn" id="trade-buy-btn" style="flex:1;background:${COLORS.green};color:#fff;font-weight:700">BUY</button>
              <button class="inv-btn" id="trade-sell-btn" style="flex:1;background:rgba(239,68,68,0.2);color:${COLORS.red};border:1px solid rgba(239,68,68,0.3)">SELL</button>
            </div>
            <div style="margin-bottom:1rem">
              <label style="font-size:.8rem;color:var(--text-muted);display:block;margin-bottom:.35rem">Quantity</label>
              <input type="number" class="inv-input" id="trade-qty" min="1" value="1" placeholder="Number of shares" />
            </div>
            <div style="margin-bottom:1rem">
              <label style="font-size:.8rem;color:var(--text-muted);display:block;margin-bottom:.35rem">Order Type</label>
              <select class="inv-select" id="trade-type">
                <option value="market">Market Order</option>
                <option value="limit">Limit Order (mock)</option>
              </select>
            </div>
            <div style="padding:1rem;background:var(--bg-tertiary);border-radius:var(--radius);margin-bottom:1rem">
              <div style="display:flex;justify-content:space-between;margin-bottom:.35rem"><span style="font-size:.8rem;color:var(--text-muted)">Price</span><span style="font-size:.85rem;font-weight:600" id="trade-price">${c ? fmtCur(c.currentPrice) : '—'}</span></div>
              <div style="display:flex;justify-content:space-between;margin-bottom:.35rem"><span style="font-size:.8rem;color:var(--text-muted)">Quantity</span><span style="font-size:.85rem;font-weight:600" id="trade-disp-qty">1</span></div>
              <div style="border-top:1px solid var(--border);padding-top:.5rem;display:flex;justify-content:space-between"><span style="font-size:.85rem;font-weight:600;color:var(--text-primary)">Total</span><span style="font-size:1rem;font-weight:700;color:var(--gold)" id="trade-total">${c ? fmtCur(c.currentPrice) : '—'}</span></div>
            </div>
            <button class="inv-btn inv-btn-gold" id="trade-confirm" style="width:100%;padding:.75rem;font-size:.95rem" ${!c ? 'disabled style="width:100%;padding:.75rem;font-size:.95rem;opacity:.5;cursor:not-allowed"' : ''}>Confirm Order</button>
            <div id="trade-msg" style="margin-top:.75rem;font-size:.85rem;display:none"></div>
          </div>

          <div class="inv-card" style="margin-top:1rem">
            <div class="inv-card-header"><span class="inv-card-title">Your Holdings</span></div>
            ${holdings.length > 0 ? holdings.map(h => {
              const hc = StockEngine.findCompany(h.companyId);
              return `
                <div style="display:flex;align-items:center;gap:.75rem;padding:.6rem 0;border-bottom:1px solid var(--border);cursor:pointer" onclick="InvestmentDashboard._goTrade('${h.companyId}')">
                  <span>${hc ? hc.logo || '📊' : '📊'}</span>
                  <div style="flex:1"><strong style="color:var(--text-primary)">${hc ? hc.ticker : '—'}</strong><br><span style="font-size:.7rem;color:var(--text-muted)">${h.quantity} shares</span></div>
                  <div style="text-align:right"><div style="font-size:.85rem;font-weight:600">${fmtCur(h.quantity * h.currentPrice)}</div></div>
                </div>`;
            }).join('') : '<p style="color:var(--text-muted);font-size:.85rem;padding:.5rem 0">No holdings</p>'}
          </div>
        </div>
      </div>
    `;

    let orderSide = 'buy';
    const buyBtn = document.getElementById('trade-buy-btn');
    const sellBtn = document.getElementById('trade-sell-btn');
    const qtyInput = document.getElementById('trade-qty');
    const priceEl = document.getElementById('trade-price');
    const qtyDisp = document.getElementById('trade-disp-qty');
    const totalEl = document.getElementById('trade-total');
    const confirmBtn = document.getElementById('trade-confirm');
    const msgEl = document.getElementById('trade-msg');

    function updateTotal() {
      if (!c) return;
      const qty = parseInt(qtyInput.value) || 0;
      priceEl.textContent = fmtCur(c.currentPrice);
      qtyDisp.textContent = qty;
      totalEl.textContent = fmtCur(qty * c.currentPrice);
    }

    if (buyBtn) buyBtn.addEventListener('click', () => {
      orderSide = 'buy';
      buyBtn.style.background = COLORS.green;
      buyBtn.style.color = '#fff';
      sellBtn.style.background = 'rgba(239,68,68,0.2)';
      sellBtn.style.color = COLORS.red;
      if (confirmBtn) { confirmBtn.textContent = 'Confirm Buy'; confirmBtn.style.background = `linear-gradient(135deg,${COLORS.green},#16a34a)`; confirmBtn.style.color = '#fff'; }
    });

    if (sellBtn) sellBtn.addEventListener('click', () => {
      orderSide = 'sell';
      sellBtn.style.background = COLORS.red;
      sellBtn.style.color = '#fff';
      buyBtn.style.background = 'rgba(34,197,94,0.12)';
      buyBtn.style.color = COLORS.green;
      if (confirmBtn) { confirmBtn.textContent = 'Confirm Sell'; confirmBtn.style.background = `linear-gradient(135deg,${COLORS.red},#dc2626)`; confirmBtn.style.color = '#fff'; }
    });

    if (qtyInput) qtyInput.addEventListener('input', updateTotal);

    if (confirmBtn) confirmBtn.addEventListener('click', () => {
      if (!c) return;
      const qty = parseInt(qtyInput.value) || 0;
      let result;
      if (orderSide === 'buy') {
        result = StockEngine.buyShares(c.id, qty);
      } else {
        result = StockEngine.sellShares(c.id, qty);
      }
      if (msgEl) {
        msgEl.style.display = 'block';
        if (result.success) {
          msgEl.style.color = COLORS.green;
          msgEl.textContent = `✓ ${orderSide === 'buy' ? 'Bought' : 'Sold'} ${qty} shares of ${c.ticker} successfully!`;
          setTimeout(() => { renderTrading(container); }, 1500);
        } else {
          msgEl.style.color = COLORS.red;
          msgEl.textContent = '✗ ' + result.error;
        }
      }
    });

    const searchInput = document.getElementById('trade-search');
    const searchResults = document.getElementById('trade-search-results');
    if (searchInput && searchResults) {
      searchInput.addEventListener('input', Utils.debounce(() => {
        const q = searchInput.value.trim();
        if (!q) { searchResults.innerHTML = ''; return; }
        const found = StockEngine.searchCompanies(q).slice(0, 6);
        searchResults.innerHTML = found.map(fc => `
          <div style="display:flex;align-items:center;gap:.6rem;padding:.5rem;cursor:pointer;border-radius:var(--radius);transition:background .15s" class="trade-search-item" data-id="${fc.id}">
            <span>${fc.logo || '📊'}</span>
            <div><strong style="font-size:.85rem;color:var(--text-primary)">${fc.ticker}</strong><br><span style="font-size:.7rem;color:var(--text-muted)">${fc.companyName || fc.name}</span></div>
            <span style="margin-left:auto;font-size:.85rem;font-weight:600">${fmtCur(fc.currentPrice)}</span>
          </div>
        `).join('');
        searchResults.querySelectorAll('.trade-search-item').forEach(item => {
          item.addEventListener('mouseenter', () => item.style.background = 'var(--bg-tertiary)');
          item.addEventListener('mouseleave', () => item.style.background = 'transparent');
          item.addEventListener('click', () => {
            tradingSelectedCompany = StockEngine.findCompany(item.dataset.id);
            renderTrading(container);
          });
        });
      }, 250));
    }
  }

  // =========================== PORTFOLIO PAGE ===========================
  function renderPortfolio(container) {
    const portfolio = StockEngine.getPortfolio();
    const holdings = StockEngine.getHoldings();
    const totalValue = StockEngine.getTotalValue();
    const sectorAlloc = StockEngine.getSectorAllocation();
    const dayGain = StockEngine.getDayGain();
    const totalReturn = StockEngine.getTotalReturn();

    const holdingsHTML = holdings.map(h => {
      const c = StockEngine.findCompany(h.companyId);
      if (!c) return '';
      const value = h.quantity * h.currentPrice;
      const invested = h.quantity * h.avgPrice;
      const pnl = value - invested;
      const pnlPct = invested > 0 ? (pnl / invested) * 100 : 0;
      const weight = totalValue > 0 ? (value / totalValue) * 100 : 0;
      return `
        <tr>
          <td><span style="margin-right:.5rem">${c.logo || '📊'}</span><strong style="color:var(--text-primary)">${c.ticker}</strong><br><span style="font-size:.7rem;color:var(--text-muted)">${c.companyName || c.name}</span></td>
          <td style="text-align:right">${h.quantity}</td>
          <td style="text-align:right">${fmtCur(h.avgPrice)}</td>
          <td style="text-align:right">${fmtCur(h.currentPrice)}</td>
          <td style="text-align:right;color:${pnl >= 0 ? COLORS.green : COLORS.red}">${pnl >= 0 ? '+' : ''}${fmtCur(pnl)}<br><span style="font-size:.7rem">${pnlPct >= 0 ? '+' : ''}${pnlPct.toFixed(2)}%</span></td>
          <td style="text-align:right">${fmtCur(value)}</td>
          <td style="text-align:right">${weight.toFixed(1)}%</td>
        </tr>`;
    }).join('');

    let pieGradient = 'conic-gradient(';
    if (sectorAlloc.length === 0) {
      pieGradient += '#333 0deg 360deg';
    } else {
      let angle = 0;
      sectorAlloc.forEach((s, i) => {
        const endAngle = angle + (s.percentage / 100) * 360;
        pieGradient += `${SECTOR_COLORS[i % SECTOR_COLORS.length]} ${angle}deg ${endAngle}deg`;
        if (i < sectorAlloc.length - 1) pieGradient += ', ';
        angle = endAngle;
      });
    }
    pieGradient += ')';

    const allocLegend = sectorAlloc.map((s, i) => `
      <div style="display:flex;align-items:center;gap:.5rem;font-size:.8rem">
        <span style="width:10px;height:10px;border-radius:50%;background:${SECTOR_COLORS[i % SECTOR_COLORS.length]};flex-shrink:0"></span>
        <span style="color:var(--text-secondary);flex:1">${s.sector}</span>
        <span style="font-weight:600;color:var(--text-primary)">${s.percentage.toFixed(1)}%</span>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="inv-grid-4" style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.5rem">
        <div class="inv-card"><div class="inv-stat-label">Total Value</div><div class="inv-stat-value gold">${fmtCur(totalValue)}</div></div>
        <div class="inv-card"><div class="inv-stat-label">Cash Balance</div><div class="inv-stat-value">${fmtCur(portfolio.cashBalance)}</div></div>
        <div class="inv-card"><div class="inv-stat-label">Invested Amount</div><div class="inv-stat-value">${fmtCur(portfolio.investedAmount)}</div></div>
        <div class="inv-card"><div class="inv-stat-label">Day Gain/Loss</div><div class="inv-stat-value" style="color:${dayGain.amount >= 0 ? COLORS.green : COLORS.red}">${dayGain.amount >= 0 ? '+' : ''}${fmtCur(dayGain.amount)}</div></div>
      </div>

      <div class="inv-grid-2" style="display:grid;grid-template-columns:2fr 1fr;gap:1rem;margin-bottom:1.5rem">
        <div class="inv-card">
          <div class="inv-card-header"><span class="inv-card-title">Holdings</span></div>
          ${holdings.length > 0 ? `
            <div style="overflow-x:auto">
              <table class="inv-table">
                <thead><tr><th>Company</th><th style="text-align:right">Qty</th><th style="text-align:right">Avg Price</th><th style="text-align:right">Current</th><th style="text-align:right">P/L</th><th style="text-align:right">Value</th><th style="text-align:right">Weight</th></tr></thead>
                <tbody>${holdingsHTML}</tbody>
              </table>
            </div>` : '<div class="inv-empty" style="padding:2rem"><p>No holdings in portfolio</p></div>'
          }
        </div>
        <div class="inv-card">
          <div class="inv-card-header"><span class="inv-card-title">Sector Allocation</span></div>
          ${sectorAlloc.length > 0 ? `
            <div style="width:180px;height:180px;border-radius:50%;background:${pieGradient};margin:0 auto 1rem;box-shadow:0 0 20px rgba(0,0,0,0.3)"></div>
            <div style="display:grid;gap:.4rem">${allocLegend}</div>
          ` : '<div class="inv-empty"><p>No holdings to show allocation</p></div>'}
        </div>
      </div>
    `;
  }

  // =========================== WATCHLIST PAGE ===========================
  function renderWatchlist(container) {
    const watchlist = StockEngine.getWatchlist();

    container.innerHTML = `
      <div style="margin-bottom:1.25rem;display:flex;gap:1rem;align-items:center;flex-wrap:wrap">
        <input type="text" class="inv-input" id="wl-search" placeholder="Add company to watchlist..." style="max-width:350px" />
        <div id="wl-search-results" style="position:relative;flex:1;max-width:400px"></div>
      </div>
      <div id="wl-list">
        ${watchlist.length > 0 ? `
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem">
            ${watchlist.map(c => `
              <div class="inv-card" style="position:relative">
                <button onclick="InvestmentDashboard._removeWatchlist('${c.id}')" style="position:absolute;top:.75rem;right:.75rem;background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:1rem" title="Remove">✕</button>
                <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.75rem;cursor:pointer" onclick="InvestmentDashboard._goTrade('${c.id}')">
                  <span style="font-size:1.5rem">${c.logo || '📊'}</span>
                  <div>
                    <div style="font-size:1rem;font-weight:700;color:var(--text-primary)">${c.ticker}</div>
                    <div style="font-size:.75rem;color:var(--text-muted)">${c.companyName || c.name}</div>
                  </div>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:flex-end">
                  <div>
                    <div style="font-size:1.1rem;font-weight:700;color:var(--text-primary)">${fmtCur(c.currentPrice)}</div>
                    <div style="font-size:.8rem">${changeHTML(c.dayChange || 0, c.dayChangePct)}</div>
                  </div>
                  <div style="width:80px;height:40px">${miniSparklineSVG(c.miniChart || [], 80, 40)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : '<div class="inv-empty" style="padding:3rem"><div style="font-size:3rem;margin-bottom:1rem">⭐</div><h3 style="color:var(--text-primary);margin-bottom:.5rem">Watchlist is Empty</h3><p style="color:var(--text-muted)">Search and add companies to track them here</p></div>'}
      </div>
    `;

    const searchInput = document.getElementById('wl-search');
    const searchResults = document.getElementById('wl-search-results');
    if (searchInput && searchResults) {
      searchInput.addEventListener('input', Utils.debounce(() => {
        const q = searchInput.value.trim();
        if (!q) { searchResults.innerHTML = ''; return; }
        const found = StockEngine.searchCompanies(q).slice(0, 6);
        searchResults.innerHTML = `<div style="position:absolute;top:0;left:0;right:0;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);z-index:10;max-height:250px;overflow-y:auto;box-shadow:var(--shadow-lg)">
          ${found.map(fc => `
            <div style="display:flex;align-items:center;gap:.6rem;padding:.6rem .75rem;cursor:pointer;border-bottom:1px solid var(--border);transition:background .15s" class="wl-add-item" data-id="${fc.id}">
              <span>${fc.logo || '📊'}</span>
              <div style="flex:1"><strong style="font-size:.85rem;color:var(--text-primary)">${fc.ticker}</strong> <span style="font-size:.7rem;color:var(--text-muted)">${fc.companyName || fc.name}</span></div>
              <span style="font-size:.75rem;padding:.2rem .5rem;background:rgba(212,175,55,0.1);color:var(--gold);border-radius:var(--radius-full)">+ Add</span>
            </div>
          `).join('')}
        </div>`;
        searchResults.querySelectorAll('.wl-add-item').forEach(item => {
          item.addEventListener('mouseenter', () => item.style.background = 'var(--bg-tertiary)');
          item.addEventListener('mouseleave', () => item.style.background = 'transparent');
          item.addEventListener('click', () => {
            StockEngine.addToWatchlist(item.dataset.id);
            searchInput.value = '';
            searchResults.innerHTML = '';
            renderWatchlist(container);
          });
        });
      }, 250));
    }
  }

  // =========================== TRANSACTIONS PAGE ===========================
  function renderTransactions(container) {
    const transactions = StockEngine.getTransactions();
    let filter = 'all';

    container.innerHTML = `
      <div style="margin-bottom:1.25rem;display:flex;gap:.75rem;flex-wrap:wrap">
        <button class="inv-chip active" data-tx-filter="all">All</button>
        <button class="inv-chip" data-tx-filter="buy">Buys</button>
        <button class="inv-chip" data-tx-filter="sell">Sells</button>
      </div>
      <div class="inv-card">
        <div style="overflow-x:auto">
          <table class="inv-table" id="tx-table">
            <thead><tr><th>Date</th><th>Type</th><th>Company</th><th style="text-align:right">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Total</th><th style="text-align:right">Balance</th><th>Status</th></tr></thead>
            <tbody id="tx-tbody"></tbody>
          </table>
        </div>
      </div>
    `;

    function renderTxTable() {
      let list = transactions;
      if (filter !== 'all') list = list.filter(t => t.type === filter);
      const tbody = document.getElementById('tx-tbody');
      if (!tbody) return;
      if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--text-muted)">No transactions found</td></tr>';
        return;
      }
      tbody.innerHTML = list.map(tx => {
        const c = StockEngine.findCompany(tx.companyId);
        return `
          <tr>
            <td style="font-size:.8rem">${new Date(tx.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
            <td><span style="padding:.15rem .5rem;border-radius:var(--radius-full);font-size:.7rem;font-weight:600;background:${tx.type === 'buy' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)'};color:${tx.type === 'buy' ? COLORS.green : COLORS.red}">${tx.type.toUpperCase()}</span></td>
            <td><strong style="color:var(--text-primary)">${c ? c.ticker : '—'}</strong></td>
            <td style="text-align:right">${tx.quantity}</td>
            <td style="text-align:right">${fmtCur(tx.price)}</td>
            <td style="text-align:right;font-weight:600">${fmtCur(tx.total)}</td>
            <td style="text-align:right">${fmtCur(tx.runningBalance)}</td>
            <td><span style="color:${COLORS.green};font-size:.75rem">✓ ${tx.status}</span></td>
          </tr>`;
      }).join('');
    }

    document.querySelectorAll('[data-tx-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-tx-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filter = btn.dataset.txFilter;
        renderTxTable();
      });
    });

    renderTxTable();
  }

  // =========================== ANALYTICS PAGE ===========================
  function renderAnalytics(container) {
    const totalValue = StockEngine.getTotalValue();
    const sectorAlloc = StockEngine.getSectorAllocation();
    const holdings = StockEngine.getHoldings();
    const dayGain = StockEngine.getDayGain();
    const totalReturn = StockEngine.getTotalReturn();

    const riskScore = holdings.length === 0 ? 0 : Math.min(10, Math.round(3 + holdings.length * 0.5 + Math.random() * 2));
    const divScore = Math.min(100, Math.round(sectorAlloc.length * 15 + holdings.length * 3));

    const monthlyReturns = [];
    for (let i = 0; i < 6; i++) {
      monthlyReturns.push({ label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i], value: (Math.random() - 0.3) * 15 });
    }

    const barChartHTML = monthlyReturns.map(m => {
      const h = Math.abs(m.value) * 5;
      const isPos = m.value >= 0;
      return `
        <div style="display:flex;flex-direction:column;align-items:center;gap:.25rem;flex:1">
          <span style="font-size:.7rem;color:${isPos ? COLORS.green : COLORS.red}">${m.value >= 0 ? '+' : ''}${m.value.toFixed(1)}%</span>
          <div style="width:100%;max-width:40px;height:${h}px;background:${isPos ? COLORS.green : COLORS.red};border-radius:var(--radius-sm) ${var_radius_sm(isPos)} ${var_radius_sm(!isPos)} ${var_radius_sm(!isPos)};opacity:.7"></div>
          <span style="font-size:.7rem;color:var(--text-muted)">${m.label}</span>
        </div>`;
    }).join('');

    let pieGradient = 'conic-gradient(';
    if (sectorAlloc.length === 0) {
      pieGradient += '#333 0deg 360deg';
    } else {
      let angle = 0;
      sectorAlloc.forEach((s, i) => {
        const endAngle = angle + (s.percentage / 100) * 360;
        pieGradient += `${SECTOR_COLORS[i % SECTOR_COLORS.length]} ${angle}deg ${endAngle}deg`;
        if (i < sectorAlloc.length - 1) pieGradient += ', ';
        angle = endAngle;
      });
    }
    pieGradient += ')';

    container.innerHTML = `
      <div class="inv-grid-4" style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.5rem">
        <div class="inv-card"><div class="inv-stat-label">Portfolio Value</div><div class="inv-stat-value gold">${fmtCur(totalValue)}</div></div>
        <div class="inv-card"><div class="inv-stat-label">Total Return</div><div class="inv-stat-value" style="color:${totalReturn.percentage >= 0 ? COLORS.green : COLORS.red}">${totalReturn.percentage >= 0 ? '+' : ''}${totalReturn.percentage.toFixed(2)}%</div></div>
        <div class="inv-card"><div class="inv-stat-label">Day Gain</div><div class="inv-stat-value" style="color:${dayGain.amount >= 0 ? COLORS.green : COLORS.red}">${dayGain.amount >= 0 ? '+' : ''}${fmtCur(dayGain.amount)}</div></div>
        <div class="inv-card"><div class="inv-stat-label">Holdings</div><div class="inv-stat-value">${holdings.length}</div></div>
      </div>

      <div class="inv-grid-2" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem">
        <div class="inv-card">
          <div class="inv-card-header"><span class="inv-card-title">Sector Allocation</span></div>
          ${sectorAlloc.length > 0 ? `
            <div style="width:200px;height:200px;border-radius:50%;background:${pieGradient};margin:0 auto 1rem;box-shadow:0 0 20px rgba(0,0,0,0.3)"></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:.4rem">
              ${sectorAlloc.map((s, i) => `
                <div style="display:flex;align-items:center;gap:.4rem;font-size:.75rem">
                  <span style="width:8px;height:8px;border-radius:50%;background:${SECTOR_COLORS[i % SECTOR_COLORS.length]}"></span>
                  <span style="color:var(--text-secondary)">${s.sector}</span>
                  <span style="margin-left:auto;font-weight:600;color:var(--text-primary)">${s.percentage.toFixed(1)}%</span>
                </div>
              `).join('')}
            </div>` : '<div class="inv-empty"><p>Add holdings to see allocation</p></div>'}
        </div>
        <div class="inv-card">
          <div class="inv-card-header"><span class="inv-card-title">Monthly Returns</span></div>
          <div style="display:flex;align-items:flex-end;gap:.5rem;height:160px;padding-top:1rem">${barChartHTML}</div>
        </div>
      </div>

      <div class="inv-grid-2" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem">
        <div class="inv-card">
          <div class="inv-card-header"><span class="inv-card-title">Risk Assessment</span></div>
          <div style="text-align:center;padding:1.5rem">
            <div style="width:160px;height:80px;position:relative;margin:0 auto 1rem">
              <svg width="160" height="80" viewBox="0 0 160 80">
                <path d="M 10 75 A 70 70 0 0 1 150 75" fill="none" stroke="#2a2a2a" stroke-width="12" stroke-linecap="round"/>
                <path d="M 10 75 A 70 70 0 0 1 150 75" fill="none" stroke="${riskScore <= 3 ? COLORS.green : riskScore <= 6 ? COLORS.gold : COLORS.red}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${riskScore * 22} 220"/>
              </svg>
              <div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);font-size:1.5rem;font-weight:700;color:var(--text-primary)">${riskScore}/10</div>
            </div>
            <div style="font-size:.85rem;color:${riskScore <= 3 ? COLORS.green : riskScore <= 6 ? COLORS.gold : COLORS.red};font-weight:600">${riskScore <= 3 ? 'Low Risk' : riskScore <= 6 ? 'Medium Risk' : 'High Risk'}</div>
          </div>
        </div>
        <div class="inv-card">
          <div class="inv-card-header"><span class="inv-card-title">Diversification Score</span></div>
          <div style="text-align:center;padding:1.5rem">
            <div style="width:120px;height:120px;border-radius:50%;border:8px solid var(--border);border-top-color:var(--gold);border-right-color:${divScore > 50 ? COLORS.green : COLORS.red};margin:0 auto 1rem;display:flex;align-items:center;justify-content:center">
              <span style="font-size:1.75rem;font-weight:700;color:var(--text-primary)">${divScore}</span>
            </div>
            <div style="font-size:.85rem;color:${divScore >= 60 ? COLORS.green : COLORS.gold};font-weight:600">${divScore >= 60 ? 'Well Diversified' : 'Needs Diversification'}</div>
            <p style="font-size:.8rem;color:var(--text-muted);margin-top:.5rem">${sectorAlloc.length} sectors · ${holdings.length} holdings</p>
          </div>
        </div>
      </div>
    `;
  }

  function var_radius_sm(condition) { return condition ? '4px' : '4px'; }

  // =========================== RESEARCH PAGE ===========================
  function renderResearch(container) {
    const allCompanies = StockEngine.getAllCompanies().slice(0, 50);
    const recommended = (typeof InvestmentData !== 'undefined' && InvestmentData.getRecommended) ? InvestmentData.getRecommended(8) : allCompanies.slice(0, 8);

    container.innerHTML = `
      <div style="margin-bottom:1.25rem">
        <input type="text" class="inv-input" id="research-search" placeholder="Search companies for research..." style="max-width:400px" />
      </div>

      <div style="margin-bottom:1.5rem">
        <h3 class="inv-section-title">Recommended</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1rem">
          ${recommended.map(c => `
            <div class="inv-card" style="cursor:pointer" onclick="InvestmentDashboard._goTrade('${c.id}')">
              <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:.75rem">
                <span style="font-size:1.5rem">${c.logo || '📊'}</span>
                <div>
                  <div style="font-weight:700;color:var(--text-primary)">${c.ticker}</div>
                  <div style="font-size:.7rem;color:var(--text-muted)">${c.companyName || c.name}</div>
                </div>
              </div>
              <div style="font-size:1rem;font-weight:700;margin-bottom:.35rem">${fmtCur(c.currentPrice)}</div>
              ${changeHTML(c.dayChange || 0, c.dayChangePct)}
              <div style="margin-top:.5rem;font-size:.75rem;color:var(--text-muted)">${c.analystRecommendation || c.rating || '—'}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div id="research-results"></div>
    `;

    const searchInput = document.getElementById('research-search');
    if (searchInput) {
      searchInput.addEventListener('input', Utils.debounce(() => {
        const q = searchInput.value.trim();
        const resultsEl = document.getElementById('research-results');
        if (!resultsEl) return;
        if (!q) { resultsEl.innerHTML = ''; return; }
        const found = StockEngine.searchCompanies(q).slice(0, 20);
        resultsEl.innerHTML = `
          <h3 class="inv-section-title">Search Results (${found.length})</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1rem">
            ${found.map(c => `
              <div class="inv-card" style="cursor:pointer" onclick="InvestmentDashboard._goTrade('${c.id}')">
                <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:.5rem">
                  <span style="font-size:1.2rem">${c.logo || '📊'}</span>
                  <div><strong style="color:var(--text-primary)">${c.ticker}</strong><br><span style="font-size:.7rem;color:var(--text-muted)">${c.sector}</span></div>
                </div>
                <div style="font-weight:700">${fmtCur(c.currentPrice)}</div>
                ${changeHTML(c.dayChange || 0, c.dayChangePct)}
              </div>
            `).join('')}
          </div>`;
      }, 300));
    }
  }

  // =========================== AI ANALYST PAGE ===========================
  function renderAIAnalyst(container) {
    const insights = (typeof InvestmentData !== 'undefined' && InvestmentData.aiInsights) ? InvestmentData.aiInsights : [];
    const portfolio = StockEngine.getPortfolio();
    const holdings = StockEngine.getHoldings();
    const sectorAlloc = StockEngine.getSectorAllocation();

    const aiMessages = [
      { role: 'ai', text: 'Welcome to your AI Investment Analyst. I can help analyze your portfolio, assess risk, and identify opportunities.' },
      { role: 'ai', text: holdings.length > 0
        ? `Your portfolio has ${holdings.length} holdings across ${sectorAlloc.length} sectors. Total value: ${fmtCur(StockEngine.getTotalValue())}.`
        : 'Your portfolio is empty. Start by buying some shares in the Trading section.' },
      ...insights.map(i => ({ role: 'ai', text: `[${i.tone}] ${i.title}: ${i.body}` }))
    ];

    const suggestions = [
      'Analyze my portfolio risk',
      'Suggest diversification improvements',
      'What are the top sectors to invest in?',
      'How can I improve my returns?'
    ];

    container.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 300px;gap:1rem;height:calc(100vh - 140px)">
        <div class="inv-card" style="display:flex;flex-direction:column;overflow:hidden">
          <div class="inv-card-header"><span class="inv-card-title">🤖 AI Analyst</span></div>
          <div id="ai-chat" style="flex:1;overflow-y:auto;padding:1rem;background:var(--bg-tertiary);border-radius:var(--radius);margin-bottom:1rem">
            ${aiMessages.map(m => `
              <div style="margin-bottom:1rem;display:flex;gap:.75rem">
                <div style="width:28px;height:28px;border-radius:50%;background:${COLORS.gold};display:flex;align-items:center;justify-content:center;font-size:.8rem;flex-shrink:0;color:#0a0a0a;font-weight:700">AI</div>
                <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:.75rem 1rem;font-size:.85rem;color:var(--text-secondary);line-height:1.6;max-width:85%">${m.text}</div>
              </div>
            `).join('')}
          </div>
          <div style="display:flex;gap:.5rem">
            <input type="text" class="inv-input" id="ai-input" placeholder="Ask about your portfolio..." style="flex:1" />
            <button class="inv-btn inv-btn-gold" id="ai-send">Send</button>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:1rem">
          <div class="inv-card">
            <div class="inv-card-header"><span class="inv-card-title">Suggested Questions</span></div>
            <div style="display:grid;gap:.5rem">
              ${suggestions.map(s => `
                <button class="inv-btn inv-btn-outline" style="text-align:left;font-size:.8rem;padding:.6rem" onclick="document.getElementById('ai-input').value='${s}';document.getElementById('ai-send').click()">${s}</button>
              `).join('')}
            </div>
          </div>
          <div class="inv-card">
            <div class="inv-card-header"><span class="inv-card-title">Portfolio Health</span></div>
            <div style="display:grid;gap:.5rem;font-size:.8rem">
              <div style="display:flex;justify-content:space-between"><span style="color:var(--text-muted)">Holdings</span><span style="font-weight:600;color:var(--text-primary)">${holdings.length}</span></div>
              <div style="display:flex;justify-content:space-between"><span style="color:var(--text-muted)">Sectors</span><span style="font-weight:600;color:var(--text-primary)">${sectorAlloc.length}</span></div>
              <div style="display:flex;justify-content:space-between"><span style="color:var(--text-muted)">Cash %</span><span style="font-weight:600;color:var(--text-primary)">${StockEngine.getTotalValue() > 0 ? ((portfolio.cashBalance / StockEngine.getTotalValue()) * 100).toFixed(1) : 100}%</span></div>
              <div style="display:flex;justify-content:space-between"><span style="color:var(--text-muted)">Score</span><span style="font-weight:600;color:${COLORS.gold}">${holdings.length === 0 ? 'N/A' : Math.min(100, sectorAlloc.length * 12 + holdings.length * 5)}</span></div>
            </div>
          </div>
        </div>
      </div>
    `;

    const aiSend = document.getElementById('ai-send');
    const aiInput = document.getElementById('ai-input');
    const aiChat = document.getElementById('ai-chat');

    function addAIMessage(text) {
      if (!aiChat) return;
      const div = document.createElement('div');
      div.style.cssText = 'margin-bottom:1rem;display:flex;gap:.75rem;justify-content:flex-end';
      div.innerHTML = `
        <div style="background:rgba(212,175,55,0.1);border:1px solid rgba(212,175,55,0.2);border-radius:var(--radius);padding:.75rem 1rem;font-size:.85rem;color:var(--text-secondary);line-height:1.6;max-width:85%">${text}</div>
        <div style="width:28px;height:28px;border-radius:50%;background:var(--bg-tertiary);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:.8rem;flex-shrink:0;font-weight:700">U</div>
      `;
      aiChat.appendChild(div);

      setTimeout(() => {
        const response = generateAIResponse(text);
        const aiDiv = document.createElement('div');
        aiDiv.style.cssText = 'margin-bottom:1rem;display:flex;gap:.75rem';
        aiDiv.innerHTML = `
          <div style="width:28px;height:28px;border-radius:50%;background:${COLORS.gold};display:flex;align-items:center;justify-content:center;font-size:.8rem;flex-shrink:0;color:#0a0a0a;font-weight:700">AI</div>
          <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:.75rem 1rem;font-size:.85rem;color:var(--text-secondary);line-height:1.6;max-width:85%">${response}</div>
        `;
        aiChat.appendChild(aiDiv);
        aiChat.scrollTop = aiChat.scrollHeight;
      }, 800);

      aiChat.scrollTop = aiChat.scrollHeight;
    }

    function generateAIResponse(query) {
      const q = query.toLowerCase();
      if (q.includes('risk') || q.includes('safe')) {
        return `Based on your current holdings, your portfolio risk is ${holdings.length === 0 ? 'minimal as you have no positions' : 'moderate'}. ${sectorAlloc.length > 3 ? 'Your sector diversification helps reduce concentration risk.' : 'Consider diversifying across more sectors to reduce risk.'} Always maintain adequate cash reserves for opportunities.`;
      }
      if (q.includes('diversif')) {
        return `Your portfolio spans ${sectorAlloc.length} sectors. ${sectorAlloc.length < 3 ? 'Consider adding exposure to Healthcare, Technology, or Consumer sectors for better diversification.' : 'Good sector spread. Ensure no single sector exceeds 30% of your portfolio.'} A well-diversified portfolio typically has 5-8 sector exposures.`;
      }
      if (q.includes('sector') || q.includes('invest')) {
        return `Current market data suggests Technology and Energy sectors are showing strength. Defensive sectors like Healthcare and Consumer Staples can provide stability. Consider a balanced approach with 40% growth sectors, 30% value sectors, and 30% defensive sectors based on your risk tolerance.`;
      }
      if (q.includes('return') || q.includes('profit')) {
        const totalReturn = StockEngine.getTotalReturn();
        return `Your portfolio has returned ${totalReturn.percentage.toFixed(2)}% since inception. ${totalReturn.percentage >= 0 ? 'This is a positive return.' : 'Consider reviewing your positions.'} To improve returns, focus on: (1) Dollar-cost averaging into quality stocks, (2) Cutting losers early, (3) Letting winners run. Rebalancing quarterly can also help.`;
      }
      return `That's a great question. Based on current market conditions and your portfolio of ${holdings.length} holdings, I'd recommend maintaining a disciplined approach. Focus on quality companies with strong fundamentals, and ensure your portfolio is aligned with your investment goals and risk tolerance. Would you like me to analyze any specific aspect?`;
    }

    if (aiSend && aiInput) {
      aiSend.addEventListener('click', () => {
        const msg = aiInput.value.trim();
        if (!msg) return;
        aiInput.value = '';
        addAIMessage(msg);
      });
      aiInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') aiSend.click();
      });
    }
  }

  // =========================== STOCK SCREENER PAGE ===========================
  function renderScreener(container) {
    const allCompanies = StockEngine.getAllCompanies();
    const sectors = ['All', ...new Set(allCompanies.map(c => c.sector))];
    let filters = { sector: 'All', minPrice: '', maxPrice: '', rating: '' };

    container.innerHTML = `
      <div class="inv-card" style="margin-bottom:1.5rem">
        <div class="inv-card-header"><span class="inv-card-title">Screen Companies</span></div>
        <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:flex-end">
          <div>
            <label style="font-size:.75rem;color:var(--text-muted);display:block;margin-bottom:.25rem">Sector</label>
            <select class="inv-select" id="sc-sector" style="width:180px">
              ${sectors.map(s => `<option value="${s}">${s}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="font-size:.75rem;color:var(--text-muted);display:block;margin-bottom:.25rem">Min Price</label>
            <input type="number" class="inv-input" id="sc-min-price" style="width:120px" placeholder="0" />
          </div>
          <div>
            <label style="font-size:.75rem;color:var(--text-muted);display:block;margin-bottom:.25rem">Max Price</label>
            <input type="number" class="inv-input" id="sc-max-price" style="width:120px" placeholder="99999" />
          </div>
          <div>
            <label style="font-size:.75rem;color:var(--text-muted);display:block;margin-bottom:.25rem">Rating</label>
            <select class="inv-select" id="sc-rating" style="width:150px">
              <option value="">All</option>
              <option value="Buy">Buy</option>
              <option value="Strong Buy">Strong Buy</option>
              <option value="Hold">Hold</option>
            </select>
          </div>
          <button class="inv-btn inv-btn-gold" id="sc-filter">Apply Filters</button>
        </div>
      </div>
      <div class="inv-card">
        <div class="inv-card-header"><span class="inv-card-title" id="sc-count">Results (0)</span></div>
        <div style="overflow-x:auto">
          <table class="inv-table">
            <thead><tr><th>Company</th><th style="text-align:right">Price</th><th style="text-align:right">Change%</th><th style="text-align:right">Volume</th><th>Sector</th><th>Rating</th><th style="text-align:center">Action</th></tr></thead>
            <tbody id="sc-tbody"></tbody>
          </table>
        </div>
      </div>
    `;

    function applyFilters() {
      filters.sector = document.getElementById('sc-sector')?.value || 'All';
      filters.minPrice = parseFloat(document.getElementById('sc-min-price')?.value) || 0;
      filters.maxPrice = parseFloat(document.getElementById('sc-max-price')?.value) || Infinity;
      filters.rating = document.getElementById('sc-rating')?.value || '';

      let list = [...allCompanies];
      if (filters.sector !== 'All') list = list.filter(c => c.sector === filters.sector);
      list = list.filter(c => c.currentPrice >= filters.minPrice && c.currentPrice <= filters.maxPrice);
      if (filters.rating) list = list.filter(c => (c.rating || c.analystRecommendation || '') === filters.rating);

      const countEl = document.getElementById('sc-count');
      if (countEl) countEl.textContent = `Results (${list.length})`;

      const tbody = document.getElementById('sc-tbody');
      if (!tbody) return;
      tbody.innerHTML = list.slice(0, 50).map(c => `
        <tr>
          <td><span style="margin-right:.4rem">${c.logo || '📊'}</span><strong style="color:var(--text-primary)">${c.ticker}</strong><br><span style="font-size:.7rem;color:var(--text-muted)">${c.companyName || c.name}</span></td>
          <td style="text-align:right;font-weight:600">${fmtCur(c.currentPrice)}</td>
          <td style="text-align:right;color:${c.dayChangePct >= 0 ? COLORS.green : COLORS.red}">${c.dayChangePct >= 0 ? '+' : ''}${Number(c.dayChangePct).toFixed(2)}%</td>
          <td style="text-align:right">${fmt(c.volume)}</td>
          <td><span style="font-size:.75rem;color:var(--text-muted)">${c.sector}</span></td>
          <td><span style="font-size:.75rem;color:var(--gold)">${c.rating || c.analystRecommendation || '—'}</span></td>
          <td style="text-align:center"><button class="inv-btn inv-btn-sm inv-btn-gold" onclick="InvestmentDashboard._goTrade('${c.id}')">Trade</button></td>
        </tr>
      `).join('');
    }

    document.getElementById('sc-filter')?.addEventListener('click', applyFilters);
    applyFilters();
  }

  // =========================== CALENDAR PAGE ===========================
  function renderCalendar(container) {
    const earnings = (typeof InvestmentData !== 'undefined' && InvestmentData.earnings) ? InvestmentData.earnings : [];
    const econEvents = (typeof InvestmentData !== 'undefined' && InvestmentData.economicCalendar) ? InvestmentData.economicCalendar : [];
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    let calHTML = '';
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    calHTML += dayLabels.map(d => `<div style="text-align:center;font-size:.75rem;font-weight:600;color:var(--text-muted);padding:.5rem">${d}</div>`).join('');

    for (let i = 0; i < firstDay; i++) calHTML += '<div></div>';
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === now.getDate();
      calHTML += `<div style="text-align:center;padding:.5rem;border-radius:var(--radius);font-size:.85rem;cursor:pointer;${isToday ? 'background:var(--gold);color:#0a0a0a;font-weight:700' : 'color:var(--text-secondary)'}">${d}</div>`;
    }

    container.innerHTML = `
      <div class="inv-grid-2" style="display:grid;grid-template-columns:1.5fr 1fr;gap:1.5rem">
        <div class="inv-card">
          <div class="inv-card-header"><span class="inv-card-title">📅 ${monthName}</span></div>
          <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px">${calHTML}</div>
        </div>
        <div>
          <div class="inv-card" style="margin-bottom:1rem">
            <div class="inv-card-header"><span class="inv-card-title">Economic Events</span></div>
            ${econEvents.map(e => `
              <div style="padding:.6rem 0;border-bottom:1px solid var(--border)">
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <span style="font-size:.85rem;font-weight:600;color:var(--text-primary)">${e.title}</span>
                  <span style="font-size:.7rem;padding:.15rem .5rem;border-radius:var(--radius-full);background:${e.impact === 'High' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)'};color:${e.impact === 'High' ? COLORS.red : COLORS.gold}">${e.impact}</span>
                </div>
                <div style="font-size:.75rem;color:var(--text-muted)">${e.date} · ${e.note}</div>
              </div>
            `).join('')}
          </div>
          <div class="inv-card">
            <div class="inv-card-header"><span class="inv-card-title">Upcoming Earnings</span></div>
            ${earnings.map(e => `
              <div style="padding:.6rem 0;border-bottom:1px solid var(--border)">
                <div style="font-size:.85rem;font-weight:600;color:var(--text-primary)">${e.company}</div>
                <div style="font-size:.75rem;color:var(--text-muted)">${e.ticker} · ${e.date} · ${e.time}</div>
                <div style="font-size:.75rem;color:var(--text-secondary)">${e.expected}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // =========================== GOALS PAGE ===========================
  function renderGoals(container) {
    const goals = StockEngine.getGoals();
    const totalValue = StockEngine.getTotalValue();

    container.innerHTML = `
      <div class="inv-card" style="margin-bottom:1.5rem">
        <div class="inv-card-header"><span class="inv-card-title">Add Investment Goal</span></div>
        <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:flex-end">
          <div style="flex:1;min-width:200px">
            <label style="font-size:.75rem;color:var(--text-muted);display:block;margin-bottom:.25rem">Goal Name</label>
            <input type="text" class="inv-input" id="goal-name" placeholder="e.g., Retirement Fund" />
          </div>
          <div style="flex:1;min-width:150px">
            <label style="font-size:.75rem;color:var(--text-muted);display:block;margin-bottom:.25rem">Target Amount (₹)</label>
            <input type="number" class="inv-input" id="goal-target" placeholder="5000000" />
          </div>
          <div style="flex:1;min-width:150px">
            <label style="font-size:.75rem;color:var(--text-muted);display:block;margin-bottom:.25rem">Deadline</label>
            <input type="date" class="inv-input" id="goal-deadline" />
          </div>
          <button class="inv-btn inv-btn-gold" id="goal-add">Add Goal</button>
        </div>
      </div>

      <div id="goals-list">
        ${goals.length > 0 ? goals.map(g => {
          const pct = g.targetAmount > 0 ? Math.min(100, (totalValue / g.targetAmount) * 100) : 0;
          const daysLeft = g.deadline ? Math.max(0, Math.ceil((new Date(g.deadline) - new Date()) / (1000 * 60 * 60 * 24))) : null;
          return `
            <div class="inv-card" style="margin-bottom:1rem">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.75rem">
                <div>
                  <div style="font-size:1rem;font-weight:700;color:var(--text-primary)">${g.name}</div>
                  <div style="font-size:.8rem;color:var(--text-muted)">Target: ${fmtCur(g.targetAmount)} ${daysLeft !== null ? `· ${daysLeft} days left` : ''}</div>
                </div>
                <button class="inv-btn inv-btn-sm inv-btn-danger" onclick="StockEngine.removeGoal('${g.id}');InvestmentDashboard._refreshGoals()">✕</button>
              </div>
              <div class="inv-progress-bar">
                <div class="inv-progress-fill" style="width:${pct}%;background:${pct >= 75 ? COLORS.green : pct >= 40 ? COLORS.gold : COLORS.blue}"></div>
              </div>
              <div style="display:flex;justify-content:space-between;margin-top:.35rem">
                <span style="font-size:.75rem;color:var(--text-muted)">${fmtCur(totalValue)} of ${fmtCur(g.targetAmount)}</span>
                <span style="font-size:.75rem;font-weight:600;color:${pct >= 75 ? COLORS.green : pct >= 40 ? COLORS.gold : COLORS.blue}">${pct.toFixed(1)}%</span>
              </div>
            </div>`;
        }).join('') : '<div class="inv-empty" style="padding:3rem"><div style="font-size:3rem;margin-bottom:1rem">🎯</div><h3 style="color:var(--text-primary);margin-bottom:.5rem">No Goals Set</h3><p style="color:var(--text-muted)">Create investment goals to track your progress</p></div>'}
      </div>
    `;

    const addBtn = document.getElementById('goal-add');
    if (addBtn) addBtn.addEventListener('click', () => {
      const name = (document.getElementById('goal-name')?.value || '').trim();
      const target = parseFloat(document.getElementById('goal-target')?.value) || 0;
      const deadline = document.getElementById('goal-deadline')?.value || '';
      if (!name || target <= 0) return;
      StockEngine.addGoal(name, target, deadline);
      renderGoals(container);
    });
  }

  // =========================== ALERTS PAGE ===========================
  function renderAlerts(container) {
    const alerts = StockEngine.getAlerts();

    container.innerHTML = `
      <div class="inv-card" style="margin-bottom:1.5rem">
        <div class="inv-card-header"><span class="inv-card-title">Create Price Alert</span></div>
        <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:flex-end">
          <div style="flex:1;min-width:200px">
            <label style="font-size:.75rem;color:var(--text-muted);display:block;margin-bottom:.25rem">Company</label>
            <input type="text" class="inv-input" id="alert-search" placeholder="Search ticker..." />
            <div id="alert-search-results" style="position:relative"></div>
          </div>
          <div style="flex:1;min-width:120px">
            <label style="font-size:.75rem;color:var(--text-muted);display:block;margin-bottom:.25rem">Alert Type</label>
            <select class="inv-select" id="alert-type">
              <option value="price_above">Price Above</option>
              <option value="price_below">Price Below</option>
            </select>
          </div>
          <div style="flex:1;min-width:120px">
            <label style="font-size:.75rem;color:var(--text-muted);display:block;margin-bottom:.25rem">Target Price (₹)</label>
            <input type="number" class="inv-input" id="alert-price" placeholder="0.00" />
          </div>
          <button class="inv-btn inv-btn-gold" id="alert-add">Add Alert</button>
        </div>
      </div>

      <div class="inv-card">
        <div class="inv-card-header"><span class="inv-card-title">Active Alerts (${alerts.length})</span></div>
        ${alerts.length > 0 ? alerts.map(a => `
          <div style="display:flex;align-items:center;gap:1rem;padding:.75rem 0;border-bottom:1px solid var(--border)">
            <span style="font-size:1.2rem">${a.company ? a.company.logo || '📊' : '📊'}</span>
            <div style="flex:1">
              <div style="font-weight:600;color:var(--text-primary)">${a.company ? a.company.ticker : '—'} <span style="font-weight:400;font-size:.8rem;color:var(--text-muted)">${a.type === 'price_above' ? 'Above' : 'Below'}</span></div>
              <div style="font-size:.8rem;color:var(--text-muted)">Target: ${fmtCur(a.targetPrice)}</div>
            </div>
            <span style="font-size:.75rem;padding:.2rem .6rem;border-radius:var(--radius-full);${a.triggered ? 'background:rgba(34,197,94,0.12);color:' + COLORS.green : 'background:rgba(245,158,11,0.12);color:' + COLORS.gold}">${a.triggered ? 'Triggered' : 'Active'}</span>
            <button class="inv-btn inv-btn-sm inv-btn-danger" onclick="StockEngine.removeAlert('${a.id}');InvestmentDashboard._refreshAlerts()">✕</button>
          </div>
        `).join('') : '<div class="inv-empty"><p>No alerts configured</p></div>'}
      </div>
    `;

    let selectedCompanyId = null;
    const searchInput = document.getElementById('alert-search');
    const searchResults = document.getElementById('alert-search-results');
    if (searchInput && searchResults) {
      searchInput.addEventListener('input', Utils.debounce(() => {
        const q = searchInput.value.trim();
        if (!q) { searchResults.innerHTML = ''; return; }
        const found = StockEngine.searchCompanies(q).slice(0, 5);
        searchResults.innerHTML = `<div style="position:absolute;top:0;left:0;right:0;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);z-index:10;max-height:200px;overflow-y:auto;box-shadow:var(--shadow-lg)">
          ${found.map(fc => `
            <div style="padding:.5rem .75rem;cursor:pointer;border-bottom:1px solid var(--border);font-size:.85rem" class="alert-search-item" data-id="${fc.id}" data-ticker="${fc.ticker}">
              <strong>${fc.ticker}</strong> <span style="color:var(--text-muted)">${fmtCur(fc.currentPrice)}</span>
            </div>
          `).join('')}
        </div>`;
        searchResults.querySelectorAll('.alert-search-item').forEach(item => {
          item.addEventListener('click', () => {
            selectedCompanyId = item.dataset.id;
            searchInput.value = item.dataset.ticker;
            searchResults.innerHTML = '';
          });
        });
      }, 250));
    }

    const addBtn = document.getElementById('alert-add');
    if (addBtn) addBtn.addEventListener('click', () => {
      if (!selectedCompanyId) return;
      const type = document.getElementById('alert-type')?.value || 'price_above';
      const price = parseFloat(document.getElementById('alert-price')?.value) || 0;
      if (price <= 0) return;
      StockEngine.addAlert(selectedCompanyId, type, price);
      selectedCompanyId = null;
      renderAlerts(container);
    });
  }

  // =========================== SETTINGS PAGE ===========================
  function renderSettings(container) {
    const user = InvestmentAuth.getCurrentUser();

    container.innerHTML = `
      <div class="inv-card" style="margin-bottom:1.5rem">
        <div class="inv-card-header"><span class="inv-card-title">Account</span></div>
        <div style="display:grid;gap:.75rem">
          <div style="display:flex;justify-content:space-between;padding:.5rem 0;border-bottom:1px solid var(--border)">
            <span style="color:var(--text-muted);font-size:.85rem">Name</span>
            <span style="font-weight:600;color:var(--text-primary)">${user ? user.name : '—'}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:.5rem 0;border-bottom:1px solid var(--border)">
            <span style="color:var(--text-muted);font-size:.85rem">Email</span>
            <span style="font-weight:600;color:var(--text-primary)">${user ? user.email : '—'}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:.5rem 0;border-bottom:1px solid var(--border)">
            <span style="color:var(--text-muted);font-size:.85rem">Country</span>
            <span style="font-weight:600;color:var(--text-primary)">${user && user.country ? user.country : '—'}</span>
          </div>
        </div>
      </div>

      <div class="inv-card" style="margin-bottom:1.5rem">
        <div class="inv-card-header"><span class="inv-card-title">Notification Preferences</span></div>
        <div style="display:grid;gap:.75rem">
          <div style="display:flex;justify-content:space-between;align-items:center;padding:.5rem 0;border-bottom:1px solid var(--border)">
            <span style="font-size:.85rem;color:var(--text-secondary)">Price Alerts</span>
            <label style="position:relative;display:inline-block;width:44px;height:24px;cursor:pointer"><input type="checkbox" checked style="opacity:0;width:0;height:0"><span style="position:absolute;inset:0;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:12px;transition:.2s"></span><span style="position:absolute;left:2px;top:2px;width:20px;height:20px;background:var(--text-muted);border-radius:50%;transition:.2s"></span></label>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;padding:.5rem 0;border-bottom:1px solid var(--border)">
            <span style="font-size:.85rem;color:var(--text-secondary)">Portfolio Updates</span>
            <label style="position:relative;display:inline-block;width:44px;height:24px;cursor:pointer"><input type="checkbox" checked style="opacity:0;width:0;height:0"><span style="position:absolute;inset:0;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:12px;transition:.2s"></span><span style="position:absolute;left:2px;top:2px;width:20px;height:20px;background:var(--text-muted);border-radius:50%;transition:.2s"></span></label>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;padding:.5rem 0">
            <span style="font-size:.85rem;color:var(--text-secondary)">Market News</span>
            <label style="position:relative;display:inline-block;width:44px;height:24px;cursor:pointer"><input type="checkbox" style="opacity:0;width:0;height:0"><span style="position:absolute;inset:0;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:12px;transition:.2s"></span><span style="position:absolute;left:2px;top:2px;width:20px;height:20px;background:var(--text-muted);border-radius:50%;transition:.2s"></span></label>
          </div>
        </div>
      </div>

      <div class="inv-card" style="margin-bottom:1.5rem">
        <div class="inv-card-header"><span class="inv-card-title">Display</span></div>
        <div style="display:grid;gap:.75rem">
          <div style="display:flex;justify-content:space-between;align-items:center;padding:.5rem 0;border-bottom:1px solid var(--border)">
            <span style="font-size:.85rem;color:var(--text-secondary)">Currency</span>
            <select class="inv-select" style="width:auto;padding:.35rem .6rem;font-size:.8rem"><option>INR (₹)</option><option>USD ($)</option></select>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;padding:.5rem 0">
            <span style="font-size:.85rem;color:var(--text-secondary)">Number Format</span>
            <select class="inv-select" style="width:auto;padding:.35rem .6rem;font-size:.8rem"><option>Indian (Lakhs/Crores)</option><option>International (K/M/B)</option></select>
          </div>
        </div>
      </div>

      <div class="inv-card" style="border-color:rgba(239,68,68,0.3)">
        <div class="inv-card-header"><span class="inv-card-title" style="color:${COLORS.red}">Danger Zone</span></div>
        <p style="font-size:.85rem;color:var(--text-muted);margin-bottom:1rem">Reset all investment data including portfolio, holdings, transactions, watchlist, alerts, and goals. This action cannot be undone.</p>
        <button class="inv-btn inv-btn-danger" id="settings-reset">Reset All Investment Data</button>
      </div>
    `;

    const resetBtn = document.getElementById('settings-reset');
    if (resetBtn) resetBtn.addEventListener('click', () => {
      showModal(`
        <h3 style="font-size:1.1rem;font-weight:700;color:var(--text-primary);margin-bottom:.75rem">⚠ Confirm Reset</h3>
        <p style="font-size:.85rem;color:var(--text-muted);margin-bottom:1.5rem">This will permanently delete all your investment data. This cannot be undone.</p>
        <div style="display:flex;gap:.75rem;justify-content:flex-end">
          <button class="inv-btn inv-btn-outline" onclick="InvestmentDashboard._closeModal()">Cancel</button>
          <button class="inv-btn inv-btn-danger" onclick="StockEngine.resetAccount();InvestmentDashboard._closeModal();InvestmentDashboard._navigateTo('dashboard')">Reset Everything</button>
        </div>
      `);
    });
  }

  function _refreshGoals() { renderGoals(document.getElementById('inv-content')); }
  function _refreshAlerts() { renderAlerts(document.getElementById('inv-content')); }
  function _closeModal() { closeModal(); }
  function _navigateTo(page) { navigateTo(page); }

  function _toggleWatchlist(companyId) {
    if (StockEngine.isWatchlisted(companyId)) {
      StockEngine.removeFromWatchlist(companyId);
    } else {
      StockEngine.addToWatchlist(companyId);
    }
    if (currentPage === 'markets') renderMarkets(document.getElementById('inv-content'));
    if (currentPage === 'watchlist') renderWatchlist(document.getElementById('inv-content'));
  }

  function _goTrade(companyId) {
    tradingSelectedCompany = StockEngine.findCompany(companyId);
    navigateTo('trading');
  }

  function init() {}
  function updateHeaderButton() {}

  return {
    init,
    render,
    updateHeaderButton,
    _toggleWatchlist,
    _goTrade,
    _removeWatchlist: (id) => { StockEngine.removeFromWatchlist(id); renderWatchlist(document.getElementById('inv-content')); },
    _refreshGoals,
    _refreshAlerts,
    _closeModal,
    _navigateTo
  };
})();
