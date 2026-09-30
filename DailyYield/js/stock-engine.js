const StockEngine = (() => {
  const KEYS = {
    portfolio: 'dy_portfolio',
    holdings: 'dy_holdings',
    transactions: 'dy_transactions',
    watchlist: 'dy_watchlist',
    alerts: 'dy_alerts',
    goals: 'dy_goals'
  };

  function load(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v !== null ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  }

  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }

  function getAllCompanies() {
    const a = (typeof InvestmentData !== 'undefined' && InvestmentData.companies) ? InvestmentData.companies : [];
    const b = (typeof CompaniesData !== 'undefined' && CompaniesData.companies) ? CompaniesData.companies : [];
    const map = new Map();
    b.forEach(c => map.set(c.id, c));
    a.forEach(c => map.set(c.id, c));
    return [...map.values()];
  }

  function findCompany(companyId) {
    const all = getAllCompanies();
    return all.find(c => c.id === companyId) || null;
  }

  function getCurrentPrice(companyId) {
    const c = findCompany(companyId);
    return c ? c.currentPrice : 0;
  }

  function init() {
    if (!load(KEYS.portfolio, null)) {
      save(KEYS.portfolio, { cashBalance: 1000000, investedAmount: 0, totalValue: 1000000 });
    }
    if (!load(KEYS.holdings, null)) {
      save(KEYS.holdings, []);
    }
    if (!load(KEYS.transactions, null)) {
      save(KEYS.transactions, []);
    }
    if (!load(KEYS.watchlist, null)) {
      save(KEYS.watchlist, []);
    }
    if (!load(KEYS.alerts, null)) {
      save(KEYS.alerts, []);
    }
    if (!load(KEYS.goals, null)) {
      save(KEYS.goals, []);
    }
  }

  function getPortfolio() {
    return load(KEYS.portfolio, { cashBalance: 1000000, investedAmount: 0, totalValue: 1000000 });
  }

  function updatePortfolio() {
    const portfolio = getPortfolio();
    const holdings = getHoldings();
    let totalHoldingsValue = 0;
    let totalInvested = 0;
    holdings.forEach(h => {
      totalHoldingsValue += h.quantity * h.currentPrice;
      totalInvested += h.quantity * h.avgPrice;
    });
    portfolio.investedAmount = totalInvested;
    portfolio.totalValue = portfolio.cashBalance + totalHoldingsValue;
    save(KEYS.portfolio, portfolio);
    return portfolio;
  }

  function getHoldings() {
    const holdings = load(KEYS.holdings, []);
    return holdings.map(h => {
      const price = getCurrentPrice(h.companyId);
      return { ...h, currentPrice: price || h.currentPrice };
    });
  }

  function getTransactions() {
    return load(KEYS.transactions, []);
  }

  function getWatchlist() {
    const ids = load(KEYS.watchlist, []);
    return ids.map(id => findCompany(id)).filter(Boolean);
  }

  function getWatchlistIds() {
    return load(KEYS.watchlist, []);
  }

  function addToWatchlist(companyId) {
    const ids = getWatchlistIds();
    if (!ids.includes(companyId)) {
      ids.push(companyId);
      save(KEYS.watchlist, ids);
      return true;
    }
    return false;
  }

  function removeFromWatchlist(companyId) {
    let ids = getWatchlistIds();
    ids = ids.filter(id => id !== companyId);
    save(KEYS.watchlist, ids);
    return true;
  }

  function isWatchlisted(companyId) {
    return getWatchlistIds().includes(companyId);
  }

  function buyShares(companyId, quantity) {
    const company = findCompany(companyId);
    if (!company) return { success: false, error: 'Company not found.' };
    if (!quantity || quantity <= 0) return { success: false, error: 'Invalid quantity.' };

    const price = company.currentPrice;
    const totalCost = quantity * price;
    const portfolio = getPortfolio();

    if (totalCost > portfolio.cashBalance) {
      return { success: false, error: 'Insufficient cash balance. Need ' + formatCurr(totalCost) + ' but have ' + formatCurr(portfolio.cashBalance) + '.' };
    }

    portfolio.cashBalance -= totalCost;

    const holdings = load(KEYS.holdings, []);
    const existing = holdings.find(h => h.companyId === companyId);

    if (existing) {
      const totalQty = existing.quantity + quantity;
      existing.avgPrice = ((existing.quantity * existing.avgPrice) + (quantity * price)) / totalQty;
      existing.quantity = totalQty;
      existing.currentPrice = price;
    } else {
      holdings.push({
        companyId: companyId,
        quantity: quantity,
        avgPrice: price,
        currentPrice: price
      });
    }

    save(KEYS.holdings, holdings);

    const transactions = getTransactions();
    const tx = {
      id: 'tx_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      companyId: companyId,
      type: 'buy',
      quantity: quantity,
      price: price,
      total: totalCost,
      timestamp: new Date().toISOString(),
      status: 'completed',
      runningBalance: portfolio.cashBalance
    };
    transactions.unshift(tx);
    save(KEYS.transactions, transactions);

    updatePortfolio();
    return { success: true, transaction: tx, remainingBalance: portfolio.cashBalance };
  }

  function sellShares(companyId, quantity) {
    const company = findCompany(companyId);
    if (!company) return { success: false, error: 'Company not found.' };
    if (!quantity || quantity <= 0) return { success: false, error: 'Invalid quantity.' };

    const holdings = load(KEYS.holdings, []);
    const existing = holdings.find(h => h.companyId === companyId);
    if (!existing) return { success: false, error: 'You do not hold shares of this company.' };
    if (quantity > existing.quantity) return { success: false, error: 'Insufficient shares. You have ' + existing.quantity + '.' };

    const price = company.currentPrice;
    const proceeds = quantity * price;
    const portfolio = getPortfolio();
    portfolio.cashBalance += proceeds;

    existing.quantity -= quantity;
    existing.currentPrice = price;

    if (existing.quantity <= 0) {
      const idx = holdings.indexOf(existing);
      holdings.splice(idx, 1);
    }

    save(KEYS.holdings, holdings);

    const transactions = getTransactions();
    const tx = {
      id: 'tx_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      companyId: companyId,
      type: 'sell',
      quantity: quantity,
      price: price,
      total: proceeds,
      timestamp: new Date().toISOString(),
      status: 'completed',
      runningBalance: portfolio.cashBalance
    };
    transactions.unshift(tx);
    save(KEYS.transactions, transactions);

    updatePortfolio();
    return { success: true, transaction: tx, remainingBalance: portfolio.cashBalance };
  }

  function getHolding(companyId) {
    const holdings = getHoldings();
    return holdings.find(h => h.companyId === companyId) || null;
  }

  function getTotalValue() {
    const portfolio = getPortfolio();
    const holdings = getHoldings();
    let hv = 0;
    holdings.forEach(h => hv += h.quantity * h.currentPrice);
    return portfolio.cashBalance + hv;
  }

  function getDayGain() {
    const holdings = getHoldings();
    let dayGain = 0;
    let dayGainPct = 0;
    let prevTotal = 0;
    holdings.forEach(h => {
      const company = findCompany(h.companyId);
      if (company) {
        const prevClose = company.previousClose || h.currentPrice;
        const dayChange = (h.currentPrice - prevClose) * h.quantity;
        dayGain += dayChange;
        prevTotal += prevClose * h.quantity;
      }
    });
    if (prevTotal > 0) dayGainPct = (dayGain / prevTotal) * 100;
    return { amount: dayGain, percentage: dayGainPct };
  }

  function getTotalReturn() {
    const portfolio = getPortfolio();
    if (portfolio.investedAmount <= 0) return { amount: 0, percentage: 0 };
    const totalValue = getTotalValue();
    const totalInvested = portfolio.investedAmount;
    const ret = totalValue - 1000000;
    const retPct = ((totalValue - 1000000) / 1000000) * 100;
    return { amount: ret, percentage: retPct };
  }

  function getSectorAllocation() {
    const holdings = getHoldings();
    const sectors = {};
    let totalValue = 0;
    holdings.forEach(h => {
      const company = findCompany(h.companyId);
      if (company) {
        const val = h.quantity * h.currentPrice;
        totalValue += val;
        const sector = company.sector || 'Other';
        sectors[sector] = (sectors[sector] || 0) + val;
      }
    });
    if (totalValue === 0) return [];
    return Object.entries(sectors).map(([sector, value]) => ({
      sector, value, percentage: (value / totalValue) * 100
    })).sort((a, b) => b.value - a.value);
  }

  function searchCompanies(query) {
    const all = getAllCompanies();
    const q = (query || '').trim().toLowerCase();
    if (!q) return all.slice(0, 50);
    return all.filter(c =>
      (c.companyName || c.name || '').toLowerCase().includes(q) ||
      (c.ticker || '').toLowerCase().includes(q) ||
      (c.sector || '').toLowerCase().includes(q) ||
      (c.industry || '').toLowerCase().includes(q)
    );
  }

  function addAlert(companyId, type, targetPrice) {
    const alerts = load(KEYS.alerts, []);
    const alert = {
      id: 'alert_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      companyId: companyId,
      type: type,
      targetPrice: targetPrice,
      triggered: false,
      createdAt: new Date().toISOString()
    };
    alerts.unshift(alert);
    save(KEYS.alerts, alerts);
    return alert;
  }

  function getAlerts() {
    const alerts = load(KEYS.alerts, []);
    return alerts.map(a => {
      const company = findCompany(a.companyId);
      return { ...a, company };
    });
  }

  function removeAlert(alertId) {
    let alerts = load(KEYS.alerts, []);
    alerts = alerts.filter(a => a.id !== alertId);
    save(KEYS.alerts, alerts);
  }

  function addGoal(name, targetAmount, deadline) {
    const goals = load(KEYS.goals, []);
    const goal = {
      id: 'goal_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      name: name,
      targetAmount: targetAmount,
      currentAmount: 0,
      deadline: deadline,
      createdAt: new Date().toISOString()
    };
    goals.push(goal);
    save(KEYS.goals, goals);
    return goal;
  }

  function getGoals() {
    return load(KEYS.goals, []);
  }

  function updateGoalAmount(goalId, amount) {
    const goals = load(KEYS.goals, []);
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      goal.currentAmount = amount;
      save(KEYS.goals, goals);
    }
    return goal;
  }

  function removeGoal(goalId) {
    let goals = load(KEYS.goals, []);
    goals = goals.filter(g => g.id !== goalId);
    save(KEYS.goals, goals);
  }

  function resetAccount() {
    save(KEYS.portfolio, { cashBalance: 1000000, investedAmount: 0, totalValue: 1000000 });
    save(KEYS.holdings, []);
    save(KEYS.transactions, []);
    save(KEYS.watchlist, []);
    save(KEYS.alerts, []);
    save(KEYS.goals, []);
  }

  function formatCurr(n) {
    try { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n); }
    catch { return '₹' + Math.round(n).toLocaleString(); }
  }

  init();

  return {
    init,
    getPortfolio,
    getHoldings,
    getTransactions,
    getWatchlist,
    getWatchlistIds,
    addToWatchlist,
    removeFromWatchlist,
    isWatchlisted,
    buyShares,
    sellShares,
    getHolding,
    getTotalValue,
    getDayGain,
    getTotalReturn,
    getSectorAllocation,
    searchCompanies,
    addAlert,
    getAlerts,
    removeAlert,
    addGoal,
    getGoals,
    updateGoalAmount,
    removeGoal,
    resetAccount,
    getAllCompanies,
    findCompany,
    formatCurr
  };
})();
