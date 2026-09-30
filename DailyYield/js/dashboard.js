const InvestmentDashboard = (() => {
  let activeTab = 'overview';
  let authMode = 'login';
  let discoverState = {
    query: '',
    sector: 'All',
    sortBy: 'changeDesc'
  };

  function inr(value, compact) {
    const amount = Number(value || 0);
    const options = {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    };
    if (compact) {
      options.notation = 'compact';
      options.compactDisplay = 'short';
    }
    return new Intl.NumberFormat('en-IN', options).format(amount);
  }

  function number(value) {
    return new Intl.NumberFormat('en-IN').format(Number(value || 0));
  }

  function pct(value) {
    const amount = Number(value || 0);
    return (amount >= 0 ? '+' : '') + amount.toFixed(2) + '%';
  }

  function changeBadge(value) {
    const cls = value >= 0 ? 'positive' : 'negative';
    return `<span class="delta-pill ${cls}">${value >= 0 ? '▲' : '▼'} ${pct(value)}</span>`;
  }

  function init() {
    const button = Utils.$('#header-stocks-btn');
    if (button) {
      button.addEventListener('click', event => {
        event.preventDefault();
        open();
      });
    }
    updateHeaderButton();
  }

  function open() {
    authMode = InvestmentAuth.hasAccount() ? 'login' : 'signup';
    Router.navigate('/dashboard');
  }

  function updateHeaderButton() {
    const button = Utils.$('#header-stocks-btn');
    if (!button) return;
    const authenticated = InvestmentAuth.isAuthenticated();
    const label = button.querySelector('.header-stocks-label');
    const caption = button.querySelector('.header-stocks-caption');
    const icon = button.querySelector('.header-stocks-icon');
    if (label) label.textContent = authenticated ? 'Dashboard' : 'Stocks';
    if (caption) caption.textContent = authenticated ? 'Investment Workspace' : 'Premium Investing';
    if (icon) icon.textContent = authenticated ? '📊' : '🏛';
    const current = String(window.currentRoute || '');
    button.classList.toggle('active', current.indexOf('/dashboard') === 0);
  }

  function render(content) {
    if (!content) return;
    updateHeaderButton();
    if (!InvestmentAuth.isAuthenticated()) {
      authMode = InvestmentAuth.hasAccount() ? authMode === 'signup' ? 'signup' : 'login' : 'signup';
      renderAuth(content);
      return;
    }
    renderDashboard(content);
  }

  function renderAuth(content) {
    const hasAccount = InvestmentAuth.hasAccount();
    content.innerHTML = `
      <div class="dashboard-auth page-fade">
        <div class="dashboard-auth-shell">
          <section class="dashboard-auth-copy">
            <div class="eyebrow">Secure investment workspace</div>
            <h1>Premium stocks dashboard</h1>
            <p>Simulated authentication protects the investment workspace, while all portfolio activity stays frontend-only and persists with LocalStorage.</p>
            <div class="auth-feature-list">
              <div class="auth-feature-card">
                <strong>₹10,00,000 virtual balance</strong>
                <span>Each new account starts funded for mock trading.</span>
              </div>
              <div class="auth-feature-card">
                <strong>Session resets on refresh</strong>
                <span>You must sign in again after every reload for a secure-demo flow.</span>
              </div>
              <div class="auth-feature-card">
                <strong>TradingView-inspired workspace</strong>
                <span>Charts, watchlists, orders, analytics, and AI insights stay available after login.</span>
              </div>
            </div>
          </section>
          <section class="dashboard-auth-card">
            <div class="auth-card-top">
              <div>
                <div class="eyebrow">${hasAccount ? 'Local account detected' : 'Create your workspace'}</div>
                <h2>${authMode === 'signup' ? 'Create Account' : 'Login'}</h2>
              </div>
              ${hasAccount ? `
                <div class="auth-switch">
                  <button class="mini-tab ${authMode === 'login' ? 'active' : ''}" data-action="switch-auth" data-mode="login">Login</button>
                  <button class="mini-tab ${authMode === 'signup' ? 'active' : ''}" data-action="switch-auth" data-mode="signup">Create</button>
                </div>` : ''}
            </div>
            <div class="auth-state-note">Demo only. No backend or real brokerage connection is used.</div>
            ${authMode === 'signup' ? renderSignupForm() : renderLoginForm()}
          </section>
        </div>
      </div>
    `;
    bindAuthEvents(content);
  }

  function renderSignupForm() {
    return `
      <form class="auth-form" id="dashboard-signup-form">
        <label class="field">
          <span>Full Name</span>
          <input type="text" name="fullName" placeholder="Aarav Mehta" required>
        </label>
        <div class="field-grid">
          <label class="field">
            <span>Email</span>
            <input type="email" name="email" placeholder="investor@dailyyield.com" required>
          </label>
          <label class="field">
            <span>Mobile Number</span>
            <input type="tel" name="mobile" placeholder="+91 98765 43210" required>
          </label>
        </div>
        <div class="field-grid">
          <label class="field">
            <span>Country</span>
            <input type="text" name="country" placeholder="India" required>
          </label>
          <label class="field">
            <span>Password</span>
            <input type="password" name="password" placeholder="Minimum 6 characters" required>
          </label>
        </div>
        <label class="field">
          <span>Confirm Password</span>
          <input type="password" name="confirmPassword" placeholder="Re-enter password" required>
        </label>
        <div class="auth-form-actions">
          <button class="btn btn-gold dashboard-cta" type="submit">Create Account</button>
          <p class="auth-footnote">After signup, you’ll be redirected to login before entering the dashboard.</p>
        </div>
      </form>
    `;
  }

  function renderLoginForm() {
    return `
      <form class="auth-form" id="dashboard-login-form">
        <label class="field">
          <span>Email</span>
          <input type="email" name="email" placeholder="investor@dailyyield.com" required>
        </label>
        <label class="field">
          <span>Password</span>
          <input type="password" name="password" placeholder="Your password" required>
        </label>
        <div class="auth-form-actions">
          <button class="btn btn-gold dashboard-cta" type="submit">Login to Dashboard</button>
          <p class="auth-footnote">Authentication is reset every time the site is refreshed.</p>
        </div>
      </form>
    `;
  }

  function bindAuthEvents(content) {
    Utils.$$('[data-action="switch-auth"]', content).forEach(toggle => {
      toggle.addEventListener('click', () => {
        authMode = toggle.dataset.mode;
        renderAuth(content);
      });
    });

    const signupForm = Utils.$('#dashboard-signup-form', content);
    if (signupForm) {
      signupForm.addEventListener('submit', event => {
        event.preventDefault();
        const formData = Object.fromEntries(new FormData(signupForm).entries());
        const result = InvestmentAuth.signUp(formData);
        if (!result.ok) {
          Notifications.showToast(result.error, 'error');
          return;
        }
        authMode = 'login';
        Notifications.showToast('Account created. Please log in to continue.', 'success');
        renderAuth(content);
      });
    }

    const loginForm = Utils.$('#dashboard-login-form', content);
    if (loginForm) {
      loginForm.addEventListener('submit', event => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(loginForm).entries());
        const result = InvestmentAuth.login(data.email, data.password);
        if (!result.ok) {
          Notifications.showToast(result.error, 'error');
          return;
        }
        Utils.storage.set('userName', result.account.fullName);
        const avatar = Utils.$('#profile-avatar');
        if (avatar) avatar.textContent = result.account.fullName.charAt(0).toUpperCase();
        updateHeaderButton();
        Notifications.showToast('Welcome back. Your dashboard is ready.', 'success');
        renderDashboard(content);
      });
    }
  }

  function renderDashboard(content) {
    const state = InvestmentEngine.getState();
    if (!state) {
      renderAuth(content);
      return;
    }

    content.innerHTML = `
      <div class="stocks-dashboard page-fade">
        <section class="dashboard-topbar glass-surface">
          <div>
            <div class="eyebrow">Premium investment workspace</div>
            <h1 class="dashboard-title">Welcome, ${Utils.escapeHtml(state.profile.profile.fullName.split(' ')[0])}</h1>
            <p class="dashboard-subtitle">Professional brokerage-style experience powered entirely by frontend mock data and LocalStorage persistence.</p>
          </div>
          <div class="dashboard-top-actions">
            <button class="btn btn-outline" data-action="open-command">Command Palette</button>
            <button class="btn btn-outline" data-action="logout-dashboard">Logout</button>
          </div>
        </section>

        <nav class="dashboard-tabs glass-surface">
          ${['overview', 'discover', 'portfolio', 'watchlist', 'activity'].map(tab => `
            <button class="dashboard-tab ${activeTab === tab ? 'active' : ''}" data-action="switch-tab" data-tab="${tab}">
              ${Utils.capitalize(tab)}
            </button>
          `).join('')}
        </nav>

        <div class="dashboard-view">
          ${renderTabContent(state)}
        </div>
      </div>
    `;

    bindDashboardEvents(content);
    updateHeaderButton();
  }

  function renderTabContent(state) {
    switch (activeTab) {
      case 'discover':
        return renderDiscoverTab(state);
      case 'portfolio':
        return renderPortfolioTab(state);
      case 'watchlist':
        return renderWatchlistTab(state);
      case 'activity':
        return renderActivityTab(state);
      default:
        return renderOverviewTab(state);
    }
  }

  function renderOverviewTab(state) {
    const topGainers = InvestmentData.getTopGainers(6);
    const topLosers = InvestmentData.getTopLosers(6);
    const recommended = InvestmentData.getRecommended(6);
    return `
      <section class="dashboard-metrics">
        ${[
          { label: 'Portfolio Value', value: inr(state.totalPortfolioValue), helper: 'Cash + holdings' },
          { label: "Today's Gain/Loss", value: inr(state.todayGain), helper: pct(state.holdingsValue ? (state.todayGain / state.holdingsValue) * 100 : 0), tone: state.todayGain >= 0 ? 'positive' : 'negative' },
          { label: 'Available Cash', value: inr(state.cashBalance), helper: 'Ready to deploy' },
          { label: 'Invested Amount', value: inr(state.investedAmount), helper: number(state.holdings.length) + ' active holdings' },
          { label: 'Buying Power', value: inr(state.buyingPower), helper: 'No leverage enabled' },
          { label: 'Total Returns', value: inr(state.totalReturns), helper: pct(state.totalReturnPct), tone: state.totalReturns >= 0 ? 'positive' : 'negative' }
        ].map(card => `
          <article class="metric-card glass-surface">
            <span>${card.label}</span>
            <strong class="${card.tone || ''}">${card.value}</strong>
            <small>${card.helper}</small>
          </article>
        `).join('')}
      </section>

      <section class="dashboard-grid dashboard-grid-overview">
        <article class="dashboard-panel glass-surface dashboard-panel-lg">
          <div class="panel-head">
            <div>
              <h3>Portfolio growth</h3>
              <p>Mock performance curve generated from holdings, cash, and simulated drift.</p>
            </div>
            ${changeBadge(state.totalReturnPct)}
          </div>
          ${renderLineChart(state.performanceSeries)}
        </article>

        <article class="dashboard-panel glass-surface">
          <div class="panel-head">
            <div>
              <h3>Quick trade</h3>
              <p>Instant mock order execution with LocalStorage persistence.</p>
            </div>
          </div>
          <form id="quick-trade-form" class="quick-trade-form">
            <label class="field">
              <span>Ticker</span>
              <input type="text" name="ticker" placeholder="Search or enter ticker" list="dashboard-tickers" required>
            </label>
            <label class="field">
              <span>Quantity</span>
              <input type="number" name="quantity" placeholder="10" min="1" step="1" required>
            </label>
            <div class="quick-trade-actions">
              <button class="btn btn-gold" type="submit" name="tradeType" value="buy">Quick Buy</button>
              <button class="btn btn-outline" type="submit" name="tradeType" value="sell">Quick Sell</button>
            </div>
            <datalist id="dashboard-tickers">
              ${InvestmentData.companies.slice(0, 120).map(company => `<option value="${company.ticker}">${company.companyName}</option>`).join('')}
            </datalist>
          </form>
          <div class="market-status-board">
            <div><span>Market Status</span><strong class="positive">Open · Mock Live</strong></div>
            <div><span>Sentiment</span><strong>Constructive</strong></div>
            <div><span>Watchlist Count</span><strong>${state.watchlist.length}</strong></div>
          </div>
        </article>

        <article class="dashboard-panel glass-surface">
          <div class="panel-head">
            <div>
              <h3>Allocation</h3>
              <p>Sector concentration and asset mix.</p>
            </div>
          </div>
          ${renderDonutChart(state.sectorAllocation)}
        </article>

        <article class="dashboard-panel glass-surface">
          <div class="panel-head">
            <div>
              <h3>Monthly returns</h3>
              <p>Mock rolling performance across the current year.</p>
            </div>
          </div>
          ${renderReturnBars(state.monthlyReturns)}
        </article>

        <article class="dashboard-panel glass-surface dashboard-panel-lg">
          <div class="panel-head">
            <div>
              <h3>Market overview</h3>
              <p>Indices, macro signals, and momentum leaders.</p>
            </div>
          </div>
          <div class="dashboard-market-grid">
            ${InvestmentData.marketOverview.map(item => `
              <div class="market-stat-card">
                <span>${item.label}</span>
                <strong>${item.label === 'USD/INR' ? item.value : number(item.value)}</strong>
                ${changeBadge(item.changePct)}
              </div>
            `).join('')}
          </div>
        </article>

        <article class="dashboard-panel glass-surface">
          <div class="panel-head">
            <div>
              <h3>Trending stocks</h3>
              <p>Most active movers across the premium universe.</p>
            </div>
          </div>
          ${renderCompactCompanyList(topGainers, 'view')}
        </article>

        <article class="dashboard-panel glass-surface">
          <div class="panel-head">
            <div>
              <h3>Top losers</h3>
              <p>Potential reversal names and risk checks.</p>
            </div>
          </div>
          ${renderCompactCompanyList(topLosers, 'view')}
        </article>

        <article class="dashboard-panel glass-surface">
          <div class="panel-head">
            <div>
              <h3>Recommended</h3>
              <p>Mock analyst suggestions based on current universe scoring.</p>
            </div>
          </div>
          ${renderCompactCompanyList(recommended, 'watch')}
        </article>

        <article class="dashboard-panel glass-surface">
          <div class="panel-head">
            <div>
              <h3>AI insights</h3>
              <p>Portfolio health, diversification, and sector cues.</p>
            </div>
          </div>
          <div class="ai-insight-stack">
            ${state.assistantTips.map(item => `
              <div class="insight-chip-card">
                <strong>${item.label}: ${item.value}</strong>
                <p>${item.detail}</p>
              </div>
            `).join('')}
            ${InvestmentData.aiInsights.slice(0, 2).map(item => `
              <div class="insight-chip-card">
                <strong>${item.title}</strong>
                <p>${item.body}</p>
              </div>
            `).join('')}
          </div>
        </article>

        <article class="dashboard-panel glass-surface dashboard-panel-lg">
          <div class="panel-head">
            <div>
              <h3>News impact</h3>
              <p>Front-end generated sentiment drivers tied to tracked companies.</p>
            </div>
          </div>
          <div class="news-impact-list">
            ${InvestmentData.stockNews.slice(0, 8).map(item => `
              <article class="impact-item">
                <div>
                  <strong>${item.title}</strong>
                  <p>${item.summary}</p>
                </div>
                <div class="impact-meta">
                  <span>${item.source}</span>
                  <span>${item.time}</span>
                  <span class="impact-tag ${item.impact.toLowerCase().replace(/\s+/g, '-')}">${item.impact}</span>
                </div>
              </article>
            `).join('')}
          </div>
        </article>

        <article class="dashboard-panel glass-surface">
          <div class="panel-head">
            <div>
              <h3>Watchlist</h3>
              <p>Fast access to saved opportunities.</p>
            </div>
          </div>
          ${state.watchlist.length ? renderCompactCompanyList(state.watchlist.slice(0, 6), 'trade') : `<div class="empty-investment-state">No stocks in your watchlist yet. Use the Discover tab or add one from recommendations.</div>`}
        </article>

        <article class="dashboard-panel glass-surface">
          <div class="panel-head">
            <div>
              <h3>Recently viewed</h3>
              <p>Companies you examined most recently.</p>
            </div>
          </div>
          ${state.recentlyViewed.length ? renderCompactCompanyList(state.recentlyViewed.slice(0, 6), 'trade') : `<div class="empty-investment-state">Your recently viewed companies will appear here.</div>`}
        </article>

        <article class="dashboard-panel glass-surface">
          <div class="panel-head">
            <div>
              <h3>Upcoming earnings</h3>
              <p>Scheduled mock events that may move sectors.</p>
            </div>
          </div>
          <div class="event-list">
            ${InvestmentData.earnings.map(item => `
              <div class="event-item">
                <strong>${item.company}</strong>
                <span>${item.ticker} · ${item.date} · ${item.time}</span>
                <p>${item.expected}</p>
              </div>
            `).join('')}
          </div>
        </article>

        <article class="dashboard-panel glass-surface">
          <div class="panel-head">
            <div>
              <h3>Economic calendar</h3>
              <p>Macro checkpoints for the week ahead.</p>
            </div>
          </div>
          <div class="event-list">
            ${InvestmentData.economicCalendar.map(item => `
              <div class="event-item">
                <strong>${item.title}</strong>
                <span>${item.date} · ${item.impact} impact</span>
                <p>${item.note}</p>
              </div>
            `).join('')}
          </div>
        </article>
      </section>
    `;
  }

  function renderDiscoverTab(state) {
    const companies = InvestmentEngine.getCompanyList(discoverState).slice(0, 90);
    const suggestions = discoverState.query ? InvestmentData.search(discoverState.query).slice(0, 6) : InvestmentData.getTrending(6);
    return `
      <section class="dashboard-panel glass-surface discover-panel">
        <div class="panel-head">
          <div>
            <h3>Search companies</h3>
            <p>300+ dynamically generated listings with instant search, sector filters, and sorting.</p>
          </div>
        </div>
        <div class="discover-toolbar">
          <label class="field">
            <span>Search companies</span>
            <input type="text" id="discover-search" value="${Utils.escapeHtml(discoverState.query)}" placeholder="Ticker, company, sector, industry">
          </label>
          <label class="field">
            <span>Sector</span>
            <select id="discover-sector">
              <option value="All">All sectors</option>
              ${InvestmentData.sectors.map(sector => `<option value="${sector.name}" ${discoverState.sector === sector.name ? 'selected' : ''}>${sector.name}</option>`).join('')}
            </select>
          </label>
          <label class="field">
            <span>Sort by</span>
            <select id="discover-sort">
              <option value="changeDesc" ${discoverState.sortBy === 'changeDesc' ? 'selected' : ''}>Top movers</option>
              <option value="priceDesc" ${discoverState.sortBy === 'priceDesc' ? 'selected' : ''}>Highest price</option>
              <option value="priceAsc" ${discoverState.sortBy === 'priceAsc' ? 'selected' : ''}>Lowest price</option>
              <option value="ratingDesc" ${discoverState.sortBy === 'ratingDesc' ? 'selected' : ''}>Best rating</option>
              <option value="nameAsc" ${discoverState.sortBy === 'nameAsc' ? 'selected' : ''}>Alphabetical</option>
            </select>
          </label>
        </div>

        <div class="discover-supplement">
          <div>
            <span class="support-label">Suggestions</span>
            <div class="chip-row">
              ${suggestions.map(item => `<button class="chip-btn" data-action="view-company" data-ticker="${item.ticker}">${item.ticker}</button>`).join('')}
            </div>
          </div>
          <div>
            <span class="support-label">Recent searches</span>
            <div class="chip-row">
              ${(state.recentSearches.length ? state.recentSearches : ['Technology', 'Banking', 'Momentum']).map(term => `<button class="chip-btn" data-action="reuse-search" data-query="${Utils.escapeHtml(term)}">${Utils.escapeHtml(term)}</button>`).join('')}
            </div>
          </div>
        </div>

        <div class="table-wrap">
          <table class="dashboard-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Sector</th>
                <th>Current Price</th>
                <th>Today's Change</th>
                <th>Rating</th>
                <th>Risk</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${companies.map(company => `
                <tr>
                  <td>
                    <div class="company-cell">
                      <span class="company-logo">${company.logo}</span>
                      <div>
                        <strong>${company.companyName}</strong>
                        <span>${company.ticker} · ${company.industry}</span>
                      </div>
                    </div>
                  </td>
                  <td>${company.sector}</td>
                  <td>${inr(company.currentPrice)}</td>
                  <td>${changeBadge(company.dayChangePct)}</td>
                  <td>${company.rating.toFixed(1)}</td>
                  <td><span class="risk-pill risk-${company.risk.toLowerCase()}">${company.risk}</span></td>
                  <td>
                    <div class="table-actions">
                      <button class="btn btn-xs btn-outline" data-action="view-company" data-ticker="${company.ticker}">View</button>
                      <button class="btn btn-xs btn-outline" data-action="toggle-watchlist" data-ticker="${company.ticker}">${state.watchlist.some(item => item.ticker === company.ticker) ? 'Remove' : 'Watch'}</button>
                      <button class="btn btn-xs btn-gold" data-action="open-trade" data-trade="buy" data-ticker="${company.ticker}">Buy</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  function renderPortfolioTab(state) {
    return `
      <section class="dashboard-grid dashboard-grid-portfolio">
        <article class="dashboard-panel glass-surface dashboard-panel-lg">
          <div class="panel-head">
            <div>
              <h3>Holdings</h3>
              <p>Average price, live value, weight, and unrealized P/L for every position.</p>
            </div>
          </div>
          ${state.holdings.length ? `
            <div class="table-wrap">
              <table class="dashboard-table">
                <thead>
                  <tr>
                    <th>Holding</th>
                    <th>Avg Price</th>
                    <th>Current Price</th>
                    <th>Today's Change</th>
                    <th>Profit/Loss</th>
                    <th>Quantity</th>
                    <th>Current Value</th>
                    <th>Weight</th>
                    <th>Gain %</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${state.holdings.map(holding => `
                    <tr>
                      <td>
                        <div class="company-cell">
                          <span class="company-logo">${(InvestmentData.getByTicker(holding.ticker) || {}).logo || '⬢'}</span>
                          <div>
                            <strong>${holding.companyName}</strong>
                            <span>${holding.ticker} · ${holding.sector}</span>
                          </div>
                        </div>
                      </td>
                      <td>${inr(holding.avgPrice)}</td>
                      <td>${inr(holding.currentPrice)}</td>
                      <td><span class="${holding.todayChange >= 0 ? 'positive' : 'negative'}">${inr(holding.todayChange)}</span></td>
                      <td><span class="${holding.totalGain >= 0 ? 'positive' : 'negative'}">${inr(holding.totalGain)}</span></td>
                      <td>${number(holding.quantity)}</td>
                      <td>${inr(holding.currentValue)}</td>
                      <td>${holding.weight.toFixed(1)}%</td>
                      <td><span class="${holding.gainPct >= 0 ? 'positive' : 'negative'}">${pct(holding.gainPct)}</span></td>
                      <td><button class="btn btn-xs btn-outline" data-action="open-trade" data-trade="sell" data-ticker="${holding.ticker}">Sell</button></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : `<div class="empty-investment-state">No holdings yet. Place your first mock order from the overview or discover tab to populate the portfolio.</div>`}
        </article>

        <article class="dashboard-panel glass-surface">
          <div class="panel-head">
            <div>
              <h3>Portfolio allocation</h3>
              <p>Sector-wise weight across active holdings.</p>
            </div>
          </div>
          ${renderDonutChart(state.sectorAllocation)}
        </article>

        <article class="dashboard-panel glass-surface">
          <div class="panel-head">
            <div>
              <h3>Portfolio health</h3>
              <p>AI assistant summary based on concentration, returns, and holdings breadth.</p>
            </div>
          </div>
          <div class="insight-chip-card is-spacious">
            <strong>${state.portfolioHealth}</strong>
            <p>Use the watchlist and discover screen to simulate diversification, rebalance concentration, and compare sectors before placing new orders.</p>
          </div>
          <div class="ai-insight-stack">
            ${state.assistantTips.map(item => `
              <div class="insight-chip-card">
                <strong>${item.label}</strong>
                <p>${item.value} · ${item.detail}</p>
              </div>
            `).join('')}
          </div>
        </article>
      </section>
    `;
  }

  function renderWatchlistTab(state) {
    const watchItems = state.watchlist.length ? state.watchlist : InvestmentData.getRecommended(8);
    return `
      <section class="dashboard-panel glass-surface">
        <div class="panel-head">
          <div>
            <h3>${state.watchlist.length ? 'Saved watchlist' : 'Suggested watchlist starters'}</h3>
            <p>${state.watchlist.length ? 'Search, sort, and trade directly from saved ideas.' : 'Your watchlist is empty, so here are high-conviction mock names to begin tracking.'}</p>
          </div>
        </div>
        <div class="watchlist-grid">
          ${watchItems.map(company => `
            <article class="watch-card">
              <div class="watch-card-head">
                <div class="company-cell">
                  <span class="company-logo">${company.logo}</span>
                  <div>
                    <strong>${company.companyName}</strong>
                    <span>${company.ticker} · ${company.sector}</span>
                  </div>
                </div>
                ${changeBadge(company.dayChangePct)}
              </div>
              <p>${company.description}</p>
              <div class="watch-card-meta">
                <span>Price ${inr(company.currentPrice)}</span>
                <span>52W ${inr(company.week52Low)} - ${inr(company.week52High)}</span>
              </div>
              <div class="table-actions">
                <button class="btn btn-xs btn-outline" data-action="view-company" data-ticker="${company.ticker}">View</button>
                <button class="btn btn-xs btn-outline" data-action="toggle-watchlist" data-ticker="${company.ticker}">${state.watchlist.some(item => item.ticker === company.ticker) ? 'Remove' : 'Save'}</button>
                <button class="btn btn-xs btn-gold" data-action="open-trade" data-trade="buy" data-ticker="${company.ticker}">Buy</button>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    `;
  }

  function renderActivityTab(state) {
    return `
      <section class="dashboard-grid dashboard-grid-activity">
        <article class="dashboard-panel glass-surface dashboard-panel-lg">
          <div class="panel-head">
            <div>
              <h3>Transaction history</h3>
              <p>Buy history, sell history, timestamps, running balance, and execution status.</p>
            </div>
          </div>
          <div class="table-wrap">
            <table class="dashboard-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Symbol</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th>Running Balance</th>
                </tr>
              </thead>
              <tbody>
                ${state.transactions.map(item => `
                  <tr>
                    <td><span class="risk-pill risk-${item.type === 'BUY' ? 'medium' : item.type === 'SELL' ? 'low' : 'high'}">${item.type}</span></td>
                    <td><strong>${item.ticker}</strong><span class="table-subline">${item.companyName}</span></td>
                    <td>${inr(item.price)}</td>
                    <td>${number(item.quantity)}</td>
                    <td>${inr(item.total)}</td>
                    <td>${item.status}</td>
                    <td>${Utils.formatDate(item.time)}</td>
                    <td>${inr(item.runningBalance)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </article>

        <article class="dashboard-panel glass-surface">
          <div class="panel-head">
            <div>
              <h3>Investment notifications</h3>
              <p>Mock order and watchlist events tied to this workspace.</p>
            </div>
          </div>
          <div class="activity-feed">
            ${state.portfolioNotifications.map(item => `
              <article class="activity-item">
                <strong>${item.title}</strong>
                <p>${item.summary}</p>
                <span>${Utils.timeAgo(item.time)}</span>
              </article>
            `).join('')}
          </div>
        </article>

        <article class="dashboard-panel glass-surface">
          <div class="panel-head">
            <div>
              <h3>Recent activity</h3>
              <p>Recent searches and viewed companies synced to LocalStorage.</p>
            </div>
          </div>
          <div class="ai-insight-stack">
            <div class="insight-chip-card">
              <strong>Recent searches</strong>
              <p>${state.recentSearches.length ? state.recentSearches.join(', ') : 'No recent searches yet.'}</p>
            </div>
            <div class="insight-chip-card">
              <strong>Recently viewed</strong>
              <p>${state.recentlyViewed.length ? state.recentlyViewed.map(item => item.ticker).join(', ') : 'No companies viewed yet.'}</p>
            </div>
          </div>
        </article>
      </section>
    `;
  }

  function renderCompactCompanyList(companies, actionType) {
    const secondaryAction = actionType === 'watch'
      ? { action: 'toggle-watchlist', label: 'Watch' }
      : actionType === 'trade'
        ? { action: 'open-trade', label: 'Trade', trade: 'buy' }
        : { action: 'view-company', label: 'Open' };
    return `
      <div class="compact-company-list">
        ${companies.map(company => `
          <div class="compact-company-item">
            <div class="company-cell">
              <span class="company-logo">${company.logo}</span>
              <div>
                <strong>${company.ticker}</strong>
                <span>${company.companyName}</span>
              </div>
            </div>
            <div class="compact-company-side">
              <strong>${inr(company.currentPrice)}</strong>
              ${changeBadge(company.dayChangePct)}
            </div>
            <div class="table-actions">
              <button class="btn btn-xs btn-outline" data-action="view-company" data-ticker="${company.ticker}">View</button>
              <button class="btn btn-xs ${actionType === 'watch' ? 'btn-outline' : 'btn-gold'}" data-action="${secondaryAction.action}" ${secondaryAction.trade ? 'data-trade="' + secondaryAction.trade + '"' : ''} data-ticker="${company.ticker}">${secondaryAction.label}</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderLineChart(values) {
    const width = 760;
    const height = 280;
    const min = Math.min.apply(null, values);
    const max = Math.max.apply(null, values);
    const range = max - min || 1;
    const points = values.map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 36) - 18;
      return { x, y };
    });
    const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(' ');
    const area = `${path} L ${width},${height} L 0,${height} Z`;
    return `
      <div class="chart-card">
        <svg viewBox="0 0 ${width} ${height}" class="dashboard-line-chart" aria-hidden="true">
          <defs>
            <linearGradient id="portfolio-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="rgba(212,175,55,0.45)"></stop>
              <stop offset="100%" stop-color="rgba(212,175,55,0.03)"></stop>
            </linearGradient>
          </defs>
          ${[0.2, 0.4, 0.6, 0.8].map(step => `<line x1="0" x2="${width}" y1="${height * step}" y2="${height * step}" stroke="rgba(255,255,255,0.07)" stroke-dasharray="6 8"></line>`).join('')}
          <path d="${area}" fill="url(#portfolio-area)"></path>
          <path d="${path}" fill="none" stroke="#D4AF37" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
        <div class="chart-axis-labels">
          <span>18 periods ago</span>
          <span>Now</span>
        </div>
      </div>
    `;
  }

  function renderDonutChart(items) {
    if (!items.length) {
      return `<div class="empty-investment-state">Allocation will appear after you buy your first holdings.</div>`;
    }
    const colors = ['#D4AF37', '#FFC857', '#3B82F6', '#22C55E', '#EF4444', '#8B5CF6', '#14B8A6', '#F97316'];
    let offset = 0;
    const arcs = items.map((item, index) => {
      const dash = (item.pct / 100) * 251.2;
      const stroke = `${dash} ${251.2 - dash}`;
      const currentOffset = offset;
      offset += dash;
      return `<circle r="40" cx="50" cy="50" fill="none" stroke="${colors[index % colors.length]}" stroke-width="12" stroke-dasharray="${stroke}" stroke-dashoffset="${-currentOffset}" transform="rotate(-90 50 50)"></circle>`;
    }).join('');

    return `
      <div class="donut-layout">
        <svg viewBox="0 0 100 100" class="dashboard-donut" aria-hidden="true">
          <circle r="40" cx="50" cy="50" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="12"></circle>
          ${arcs}
        </svg>
        <div class="donut-legend">
          ${items.map((item, index) => `
            <div class="legend-row">
              <span><i style="background:${colors[index % colors.length]}"></i>${item.sector}</span>
              <strong>${item.pct.toFixed(1)}%</strong>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderReturnBars(items) {
    const max = Math.max.apply(null, items.map(item => Math.abs(item.value))) || 1;
    return `
      <div class="return-bars">
        ${items.map(item => `
          <div class="return-bar-item">
            <span>${item.month}</span>
            <div class="return-bar-track">
              <div class="return-bar-fill ${item.value >= 0 ? 'positive' : 'negative'}" style="height:${(Math.abs(item.value) / max) * 100}%"></div>
            </div>
            <strong class="${item.value >= 0 ? 'positive' : 'negative'}">${item.value >= 0 ? '+' : ''}${item.value}%</strong>
          </div>
        `).join('')}
      </div>
    `;
  }

  function bindDashboardEvents(content) {
    const searchInput = Utils.$('#discover-search', content);
    if (searchInput) {
      searchInput.addEventListener('input', Utils.debounce(event => {
        discoverState.query = event.target.value;
        renderDashboard(content);
      }, 180));
    }

    Utils.$('#discover-sector', content)?.addEventListener('change', event => {
      discoverState.sector = event.target.value;
      renderDashboard(content);
    });

    Utils.$('#discover-sort', content)?.addEventListener('change', event => {
      discoverState.sortBy = event.target.value;
      renderDashboard(content);
    });

    Utils.$('#quick-trade-form', content)?.addEventListener('submit', event => {
      event.preventDefault();
      const submitter = event.submitter;
      const data = Object.fromEntries(new FormData(event.currentTarget).entries());
      if (!submitter) return;
      handleTradeAction(data.ticker, data.quantity, submitter.value, content);
    });

    content.addEventListener('click', event => {
      const target = event.target.closest('[data-action]');
      if (!target) return;

      const action = target.dataset.action;
      if (action === 'switch-tab') {
        activeTab = target.dataset.tab;
        renderDashboard(content);
      }
      if (action === 'logout-dashboard') {
        InvestmentAuth.logout();
        updateHeaderButton();
        Notifications.showToast('You have been logged out from the dashboard.', 'info');
        Router.navigate('/home');
      }
      if (action === 'open-command') {
        CommandPalette.open();
      }
      if (action === 'toggle-watchlist') {
        const result = InvestmentEngine.toggleWatchlist(target.dataset.ticker);
        if (!result.ok) Notifications.showToast(result.error, 'error');
        else Notifications.showToast(result.added ? 'Added to watchlist' : 'Removed from watchlist', 'success');
        renderDashboard(content);
      }
      if (action === 'open-trade') {
        openTradeModal(target.dataset.ticker, target.dataset.trade || 'buy', content);
      }
      if (action === 'view-company') {
        openCompanySheet(target.dataset.ticker, content);
      }
      if (action === 'reuse-search') {
        discoverState.query = target.dataset.query;
        activeTab = 'discover';
        renderDashboard(content);
      }
    });
  }

  function handleTradeAction(ticker, quantity, type, content) {
    const action = type === 'sell' ? InvestmentEngine.sell : InvestmentEngine.buy;
    const result = action(ticker, quantity);
    if (!result.ok) {
      Notifications.showToast(result.error, 'error');
      return;
    }
    Notifications.showToast((type === 'sell' ? 'Sell' : 'Buy') + ' order executed successfully.', 'success');
    renderDashboard(content);
  }

  function openTradeModal(ticker, type, content) {
    const company = InvestmentData.getByTicker(ticker);
    if (!company) return;
    const modal = Utils.$('#modal-overlay');
    const modalContent = Utils.$('#modal-content');
    if (!modal || !modalContent) return;
    modalContent.innerHTML = `
      <div class="dashboard-modal">
        <div class="panel-head">
          <div>
            <h3>${type === 'sell' ? 'Sell shares' : 'Buy shares'}</h3>
            <p>${company.companyName} · ${company.ticker}</p>
          </div>
          <button class="icon-btn" data-action="close-dashboard-modal">✕</button>
        </div>
        <form id="trade-modal-form" class="auth-form">
          <label class="field">
            <span>Current Price</span>
            <input type="text" value="${inr(company.currentPrice)}" disabled>
          </label>
          <label class="field">
            <span>Quantity</span>
            <input type="number" name="quantity" min="1" step="1" placeholder="10" required>
          </label>
          <button class="btn ${type === 'sell' ? 'btn-outline' : 'btn-gold'}" type="submit">${type === 'sell' ? 'Confirm Sell' : 'Confirm Buy'}</button>
        </form>
      </div>
    `;
    modal.classList.add('open');

    modal.onclick = event => {
      if (event.target === modal || event.target.closest('[data-action="close-dashboard-modal"]')) {
        modal.classList.remove('open');
      }
    };

    Utils.$('#trade-modal-form', modalContent)?.addEventListener('submit', event => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.currentTarget).entries());
      handleTradeAction(company.ticker, data.quantity, type, content);
      modal.classList.remove('open');
    });
  }

  function openCompanySheet(ticker, content) {
    const company = InvestmentData.getByTicker(ticker);
    if (!company) return;
    InvestmentEngine.addRecentlyViewed(ticker);
    const modal = Utils.$('#modal-overlay');
    const modalContent = Utils.$('#modal-content');
    if (!modal || !modalContent) return;
    modalContent.innerHTML = `
      <div class="dashboard-modal company-modal">
        <div class="panel-head">
          <div class="company-cell">
            <span class="company-logo">${company.logo}</span>
            <div>
              <h3>${company.companyName}</h3>
              <p>${company.ticker} · ${company.sector} · ${company.industry}</p>
            </div>
          </div>
          <button class="icon-btn" data-action="close-dashboard-modal">✕</button>
        </div>
        <div class="company-modal-grid">
          <div class="insight-chip-card is-spacious">
            <strong>${inr(company.currentPrice)} ${changeBadge(company.dayChangePct)}</strong>
            <p>${company.description}</p>
          </div>
          <div class="insight-chip-card">
            <strong>Analyst recommendation</strong>
            <p>${company.analystRecommendation} · Rating ${company.rating.toFixed(1)} · Risk ${company.risk}</p>
          </div>
          <div class="insight-chip-card">
            <strong>Dividend</strong>
            <p>${company.dividend.toFixed(2)}% yield · 52W range ${inr(company.week52Low)} to ${inr(company.week52High)}</p>
          </div>
        </div>
        <div class="event-list">
          ${company.relatedNews.map(item => `<div class="event-item"><strong>${company.ticker} update</strong><p>${item}</p></div>`).join('')}
        </div>
        <div class="table-actions">
          <button class="btn btn-outline" data-action="toggle-watchlist" data-ticker="${company.ticker}">Toggle Watchlist</button>
          <button class="btn btn-gold" data-action="open-trade" data-trade="buy" data-ticker="${company.ticker}">Buy Shares</button>
        </div>
      </div>
    `;
    modal.classList.add('open');
    modal.onclick = event => {
      if (event.target === modal || event.target.closest('[data-action="close-dashboard-modal"]')) {
        modal.classList.remove('open');
        renderDashboard(content);
      }
      const tradeBtn = event.target.closest('[data-action="open-trade"]');
      if (tradeBtn) {
        openTradeModal(tradeBtn.dataset.ticker, tradeBtn.dataset.trade, content);
      }
      const watchBtn = event.target.closest('[data-action="toggle-watchlist"]');
      if (watchBtn) {
        InvestmentEngine.toggleWatchlist(watchBtn.dataset.ticker);
        renderDashboard(content);
      }
    };
  }

  return {
    init,
    open,
    render,
    updateHeaderButton
  };
})();
