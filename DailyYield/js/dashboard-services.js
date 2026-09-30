const InvestmentAuth = (() => {
  const ACCOUNTS_KEY = 'investment_accounts';
  const PROFILES_KEY = 'investment_profiles';
  let currentEmail = null;

  function getAccounts() {
    return Utils.storage.get(ACCOUNTS_KEY, []);
  }

  function saveAccounts(accounts) {
    Utils.storage.set(ACCOUNTS_KEY, accounts);
  }

  function getProfiles() {
    return Utils.storage.get(PROFILES_KEY, {});
  }

  function saveProfiles(profiles) {
    Utils.storage.set(PROFILES_KEY, profiles);
  }

  function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
  }

  function getAccount(email) {
    const value = normalizeEmail(email);
    return getAccounts().find(account => account.email === value) || null;
  }

  function createProfile(account) {
    const profiles = getProfiles();
    if (profiles[account.email]) return profiles[account.email];

    const initialState = {
      profile: {
        fullName: account.fullName,
        email: account.email,
        mobile: account.mobile,
        country: account.country,
        joinedAt: account.createdAt
      },
      cashBalance: 1000000,
      holdings: [],
      transactions: [
        {
          id: Utils.uid(),
          type: 'FUND',
          ticker: 'CASH',
          companyName: 'Opening Virtual Balance',
          quantity: 1,
          price: 1000000,
          total: 1000000,
          status: 'Completed',
          time: new Date().toISOString(),
          runningBalance: 1000000
        }
      ],
      watchlist: [],
      recentSearches: [],
      recentlyViewed: [],
      notifications: [
        {
          id: Utils.uid(),
          type: 'system',
          title: 'Investment workspace ready',
          summary: 'Your virtual trading balance of ₹10,00,000 has been activated.',
          time: new Date().toISOString()
        }
      ],
      preferences: {
        defaultTab: 'overview',
        compactTable: false,
        notificationCategories: {
          orders: true,
          alerts: true,
          dividends: true,
          insights: true
        }
      }
    };

    profiles[account.email] = initialState;
    saveProfiles(profiles);
    return initialState;
  }

  function hasAccount() {
    return getAccounts().length > 0;
  }

  function signUp(payload) {
    const fullName = String(payload.fullName || '').trim();
    const email = normalizeEmail(payload.email);
    const mobile = String(payload.mobile || '').trim();
    const country = String(payload.country || '').trim();
    const password = String(payload.password || '');
    const confirmPassword = String(payload.confirmPassword || '');

    if (!fullName || !email || !mobile || !country || !password || !confirmPassword) {
      return { ok: false, error: 'Please complete every required field.' };
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return { ok: false, error: 'Enter a valid email address.' };
    }
    if (password.length < 6) {
      return { ok: false, error: 'Password must be at least 6 characters.' };
    }
    if (password !== confirmPassword) {
      return { ok: false, error: 'Passwords do not match.' };
    }
    if (getAccount(email)) {
      return { ok: false, error: 'An account with this email already exists.' };
    }

    const accounts = getAccounts();
    const account = {
      id: Utils.uid(),
      fullName,
      email,
      mobile,
      country,
      password,
      createdAt: new Date().toISOString()
    };

    accounts.push(account);
    saveAccounts(accounts);
    createProfile(account);

    return { ok: true, account };
  }

  function login(email, password) {
    const account = getAccount(email);
    if (!account || account.password !== String(password || '')) {
      return { ok: false, error: 'Invalid email or password.' };
    }
    currentEmail = account.email;
    return { ok: true, account };
  }

  function logout() {
    currentEmail = null;
  }

  function isAuthenticated() {
    return Boolean(currentEmail);
  }

  function getCurrentAccount() {
    return currentEmail ? getAccount(currentEmail) : null;
  }

  function getCurrentProfile() {
    const account = getCurrentAccount();
    if (!account) return null;
    return createProfile(account);
  }

  function saveCurrentProfile(profile) {
    const account = getCurrentAccount();
    if (!account) return;
    const profiles = getProfiles();
    profiles[account.email] = profile;
    saveProfiles(profiles);
  }

  return {
    hasAccount,
    signUp,
    login,
    logout,
    isAuthenticated,
    getCurrentAccount,
    getCurrentProfile,
    saveCurrentProfile
  };
})();

const InvestmentEngine = (() => {
  function getCompany(ticker) {
    return typeof InvestmentData !== 'undefined' ? InvestmentData.getByTicker(ticker) : null;
  }

  function pushNotification(profile, title, summary, type) {
    profile.notifications.unshift({
      id: Utils.uid(),
      type: type || 'portfolio',
      title,
      summary,
      time: new Date().toISOString()
    });
    profile.notifications = profile.notifications.slice(0, 60);
    if (typeof Notifications !== 'undefined') {
      Notifications.addNotification({
        type: 'personal',
        title,
        summary,
        icon: type === 'alert' ? '🚨' : type === 'watchlist' ? '⭐' : '📊'
      });
    }
  }

  function persist(profile) {
    InvestmentAuth.saveCurrentProfile(profile);
  }

  function getProfile() {
    return InvestmentAuth.getCurrentProfile();
  }

  function addRecentSearch(profile, query) {
    const value = String(query || '').trim();
    if (!value) return;
    profile.recentSearches = [value].concat(profile.recentSearches.filter(item => item !== value)).slice(0, 8);
  }

  function addRecentlyViewed(profile, ticker) {
    profile.recentlyViewed = [ticker].concat(profile.recentlyViewed.filter(item => item !== ticker)).slice(0, 10);
  }

  function toggleWatchlist(ticker) {
    const profile = getProfile();
    if (!profile) return { ok: false, error: 'Please log in to continue.' };
    const exists = profile.watchlist.indexOf(ticker) >= 0;
    profile.watchlist = exists
      ? profile.watchlist.filter(item => item !== ticker)
      : [ticker].concat(profile.watchlist).slice(0, 40);
    pushNotification(
      profile,
      exists ? 'Removed from watchlist' : 'Stock added to watchlist',
      ticker + (exists ? ' was removed from your premium watchlist.' : ' is now tracked in your premium watchlist.'),
      'watchlist'
    );
    persist(profile);
    return { ok: true, added: !exists };
  }

  function buy(ticker, quantity) {
    const profile = getProfile();
    const company = getCompany(ticker);
    const qty = Number(quantity);
    if (!profile) return { ok: false, error: 'Please log in to continue.' };
    if (!company) return { ok: false, error: 'Selected company is unavailable.' };
    if (!Number.isFinite(qty) || qty <= 0) return { ok: false, error: 'Enter a valid share quantity.' };

    const total = company.currentPrice * qty;
    if (total > profile.cashBalance) {
      return { ok: false, error: 'Insufficient virtual balance for this order.' };
    }

    const existing = profile.holdings.find(item => item.ticker === ticker);
    if (existing) {
      const newQuantity = existing.quantity + qty;
      existing.avgPrice = ((existing.avgPrice * existing.quantity) + total) / newQuantity;
      existing.quantity = newQuantity;
      existing.updatedAt = new Date().toISOString();
    } else {
      profile.holdings.push({
        ticker: ticker,
        companyName: company.companyName,
        quantity: qty,
        avgPrice: company.currentPrice,
        firstBoughtAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    profile.cashBalance -= total;
    addRecentlyViewed(profile, ticker);
    profile.transactions.unshift({
      id: Utils.uid(),
      type: 'BUY',
      ticker: ticker,
      companyName: company.companyName,
      quantity: qty,
      price: company.currentPrice,
      total: total,
      status: 'Executed',
      time: new Date().toISOString(),
      runningBalance: profile.cashBalance
    });
    pushNotification(profile, 'Order executed', 'Bought ' + qty + ' shares of ' + ticker + ' at ₹' + company.currentPrice.toFixed(2) + '.', 'order');
    persist(profile);
    return { ok: true };
  }

  function sell(ticker, quantity) {
    const profile = getProfile();
    const company = getCompany(ticker);
    const qty = Number(quantity);
    if (!profile) return { ok: false, error: 'Please log in to continue.' };
    if (!company) return { ok: false, error: 'Selected company is unavailable.' };
    if (!Number.isFinite(qty) || qty <= 0) return { ok: false, error: 'Enter a valid share quantity.' };

    const holding = profile.holdings.find(item => item.ticker === ticker);
    if (!holding || holding.quantity < qty) {
      return { ok: false, error: 'You do not hold enough shares to sell.' };
    }

    const total = company.currentPrice * qty;
    holding.quantity -= qty;
    holding.updatedAt = new Date().toISOString();
    if (holding.quantity <= 0) {
      profile.holdings = profile.holdings.filter(item => item.ticker !== ticker);
    }

    profile.cashBalance += total;
    addRecentlyViewed(profile, ticker);
    profile.transactions.unshift({
      id: Utils.uid(),
      type: 'SELL',
      ticker: ticker,
      companyName: company.companyName,
      quantity: qty,
      price: company.currentPrice,
      total: total,
      status: 'Executed',
      time: new Date().toISOString(),
      runningBalance: profile.cashBalance
    });
    pushNotification(profile, 'Order executed', 'Sold ' + qty + ' shares of ' + ticker + ' at ₹' + company.currentPrice.toFixed(2) + '.', 'order');
    persist(profile);
    return { ok: true };
  }

  function getCompanyList(options) {
    const query = options && options.query ? options.query : '';
    const sector = options && options.sector ? options.sector : 'All';
    const sortBy = options && options.sortBy ? options.sortBy : 'changeDesc';
    const profile = getProfile();
    let items = typeof InvestmentData !== 'undefined' ? InvestmentData.search(query) : [];

    if (sector && sector !== 'All') {
      items = items.filter(company => company.sector === sector);
    }

    const sorters = {
      changeDesc: (a, b) => b.dayChangePct - a.dayChangePct,
      priceDesc: (a, b) => b.currentPrice - a.currentPrice,
      priceAsc: (a, b) => a.currentPrice - b.currentPrice,
      ratingDesc: (a, b) => b.rating - a.rating,
      nameAsc: (a, b) => a.companyName.localeCompare(b.companyName)
    };
    items = items.slice().sort(sorters[sortBy] || sorters.changeDesc);

    if (profile && query) {
      addRecentSearch(profile, query);
      persist(profile);
    }

    return items;
  }

  function buildMonthlyReturns() {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => ({
      month,
      value: Math.round(((Math.sin(index / 1.6) * 4.5) + (index % 3) * 1.15 - 0.9) * 10) / 10
    }));
  }

  function buildPortfolioState() {
    const profile = getProfile();
    if (!profile) return null;

    const holdings = profile.holdings.map(item => {
      const company = getCompany(item.ticker);
      const currentPrice = company ? company.currentPrice : item.avgPrice;
      const previousClose = company ? company.previousClose : currentPrice;
      const currentValue = currentPrice * item.quantity;
      const costBasis = item.avgPrice * item.quantity;
      const totalGain = currentValue - costBasis;
      const todayChange = (currentPrice - previousClose) * item.quantity;
      return {
        ticker: item.ticker,
        companyName: item.companyName,
        quantity: item.quantity,
        avgPrice: item.avgPrice,
        currentPrice,
        todayChange,
        todayChangePct: previousClose ? ((currentPrice - previousClose) / previousClose) * 100 : 0,
        currentValue,
        weight: 0,
        totalGain,
        gainPct: costBasis ? (totalGain / costBasis) * 100 : 0,
        sector: company ? company.sector : 'Other',
        risk: company ? company.risk : 'Medium'
      };
    });

    const investedAmount = holdings.reduce((sum, holding) => sum + holding.avgPrice * holding.quantity, 0);
    const holdingsValue = holdings.reduce((sum, holding) => sum + holding.currentValue, 0);
    const totalPortfolioValue = profile.cashBalance + holdingsValue;
    const todayGain = holdings.reduce((sum, holding) => sum + holding.todayChange, 0);
    const totalReturns = holdingsValue - investedAmount;

    holdings.forEach(holding => {
      holding.weight = holdingsValue ? (holding.currentValue / holdingsValue) * 100 : 0;
    });

    const sectorAllocationMap = {};
    holdings.forEach(holding => {
      sectorAllocationMap[holding.sector] = (sectorAllocationMap[holding.sector] || 0) + holding.currentValue;
    });

    const sectorAllocation = Object.keys(sectorAllocationMap).map(sector => ({
      sector,
      value: sectorAllocationMap[sector],
      pct: holdingsValue ? (sectorAllocationMap[sector] / holdingsValue) * 100 : 0
    })).sort((a, b) => b.value - a.value);

    const profileHealth = holdings.length === 0
      ? 'Capital preserved. Portfolio awaits first allocation.'
      : sectorAllocation.length > 0 && sectorAllocation[0].pct > 45
        ? 'Concentration risk elevated. Consider diversifying beyond your largest sector.'
        : totalReturns >= 0
          ? 'Portfolio health is strong with positive unrealized returns and balanced exposure.'
          : 'Portfolio remains investable, but recent mark-to-market performance suggests selective rebalancing.';

    const seriesBase = totalPortfolioValue || 1000000;
    const history = new Array(18).fill(null).map((_, index) => {
      const wave = Math.sin(index / 2.2) * seriesBase * 0.015;
      const trend = index * seriesBase * 0.0025;
      return Math.round(seriesBase * 0.88 + trend + wave);
    });
    history[history.length - 1] = Math.round(totalPortfolioValue || 1000000);

    return {
      profile,
      holdings,
      holdingsValue,
      investedAmount,
      cashBalance: profile.cashBalance,
      buyingPower: profile.cashBalance,
      totalPortfolioValue,
      todayGain,
      totalReturns,
      totalReturnPct: investedAmount ? (totalReturns / investedAmount) * 100 : 0,
      watchlist: profile.watchlist.map(getCompany).filter(Boolean),
      recentSearches: profile.recentSearches,
      recentlyViewed: profile.recentlyViewed.map(getCompany).filter(Boolean),
      transactions: profile.transactions.slice().sort((a, b) => new Date(b.time) - new Date(a.time)),
      portfolioNotifications: profile.notifications.slice(0, 8),
      sectorAllocation,
      monthlyReturns: buildMonthlyReturns(),
      performanceSeries: history,
      portfolioHealth,
      assistantTips: buildAssistantTips(holdings, totalReturns, sectorAllocation)
    };
  }

  function buildAssistantTips(holdings, totalReturns, sectorAllocation) {
    const tips = [];
    tips.push({
      label: 'Risk level',
      value: holdings.length > 6 ? 'Moderate' : holdings.length > 0 ? 'Focused' : 'Conservative',
      detail: holdings.length > 6 ? 'Exposure is distributed across several positions.' : 'A broader basket could reduce single-name volatility.'
    });
    tips.push({
      label: 'Diversification',
      value: sectorAllocation.length >= 4 ? 'Healthy' : 'Improve',
      detail: sectorAllocation.length >= 4 ? 'Sector spread looks balanced enough for a mock multi-asset book.' : 'Add 2-3 sectors to smooth cyclical drawdowns.'
    });
    tips.push({
      label: 'Sentiment',
      value: totalReturns >= 0 ? 'Constructive' : 'Watchful',
      detail: totalReturns >= 0 ? 'Momentum remains supportive, but keep fresh cash for pullbacks.' : 'Favor quality names and stagger entries while volatility cools.'
    });
    return tips;
  }

  return {
    getState: buildPortfolioState,
    buy,
    sell,
    toggleWatchlist,
    getCompanyList,
    addRecentlyViewed: function(ticker) {
      const profile = getProfile();
      if (!profile) return;
      addRecentlyViewed(profile, ticker);
      persist(profile);
    }
  };
})();
