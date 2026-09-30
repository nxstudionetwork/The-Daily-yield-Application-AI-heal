'use strict';

(function() {
  var sectors = [
    { name: 'Technology', change: 2.34, marketCap: '15.2T', performance: { daily: 2.34, weekly: 4.56, monthly: 8.92, ytd: 22.34 }, leaders: ['NVDA', 'AAPL', 'MSFT'] },
    { name: 'Healthcare', change: 1.12, marketCap: '8.9T', performance: { daily: 1.12, weekly: 2.34, monthly: 3.56, ytd: 12.45 }, leaders: ['UNH', 'JNJ', 'LLY'] },
    { name: 'Financials', change: -0.56, marketCap: '12.4T', performance: { daily: -0.56, weekly: 1.23, monthly: 4.67, ytd: 18.90 }, leaders: ['JPM', 'BAC', 'V'] },
    { name: 'Energy', change: 3.21, marketCap: '4.5T', performance: { daily: 3.21, weekly: -1.23, monthly: 6.78, ytd: -2.34 }, leaders: ['XOM', 'CVX', 'COP'] },
    { name: 'Consumer Discretionary', change: 0.89, marketCap: '7.8T', performance: { daily: 0.89, weekly: 3.45, monthly: 5.67, ytd: 15.67 }, leaders: ['AMZN', 'TSLA', 'HD'] },
    { name: 'Consumer Staples', change: -0.23, marketCap: '5.6T', performance: { daily: -0.23, weekly: 0.56, monthly: 1.89, ytd: 5.67 }, leaders: ['PG', 'KO', 'PEP'] },
    { name: 'Industrials', change: 1.45, marketCap: '6.7T', performance: { daily: 1.45, weekly: 2.78, monthly: 4.23, ytd: 14.56 }, leaders: ['CAT', 'GE', 'UNP'] },
    { name: 'Utilities', change: -0.78, marketCap: '3.4T', performance: { daily: -0.78, weekly: -1.23, monthly: -0.56, ytd: 8.90 }, leaders: ['NEE', 'DUK', 'SO'] },
    { name: 'Real Estate', change: 0.34, marketCap: '3.2T', performance: { daily: 0.34, weekly: 1.56, monthly: 3.45, ytd: 11.23 }, leaders: ['PLD', 'AMT', 'EQIX'] },
    { name: 'Materials', change: 1.67, marketCap: '2.8T', performance: { daily: 1.67, weekly: 2.34, monthly: 5.67, ytd: 16.78 }, leaders: ['LIN', 'APD', 'SHW'] },
    { name: 'Communication Services', change: -1.23, marketCap: '5.4T', performance: { daily: -1.23, weekly: 0.89, monthly: 3.45, ytd: 19.45 }, leaders: ['META', 'GOOG', 'DIS'] }
  ];

  var marketBreadth = {
    advances: 2876, declines: 1845, unchanged: 234,
    newHighs: 189, newLows: 34,
    advanceDeclineRatio: 1.56,
    advanceVolume: '3.2B', declineVolume: '1.8B'
  };

  var sectorHeatmap = sectors.map(function(s) {
    return {
      name: s.name,
      change: s.change,
      weight: Math.round((s.marketCap / sectors.reduce(function(a, b) { return a + parseFloat(b.marketCap); }, 0)) * 100),
      color: s.change > 2 ? '#00C853' : s.change > 0 ? '#66BB6A' : s.change > -1 ? '#EF5350' : '#D32F2F'
    };
  });

  var fearGreedIndex = {
    value: 62,
    label: 'Greed',
    previousClose: 58,
    weekAgo: 55,
    monthAgo: 48,
    yearAgo: 72
  };

  var marketStats = {
    totalMarketCap: '$128.5T',
    spx52wHigh: 5892.45,
    spx52wLow: 4123.67,
    volumeToday: '12.4B',
    avgVolume30d: '10.8B',
    vix: 14.56,
    vixChange: -1.23,
    putCallRatio: 0.87,
    marginDebt: '$892B'
  };

  var trending = [
    { symbol: 'NVDA', reason: 'Record data center revenue', sentiment: 'positive' },
    { symbol: 'TSLA', reason: 'Autopilot recall concerns', sentiment: 'negative' },
    { symbol: 'AAPL', reason: 'Vision Pro 2 launch', sentiment: 'positive' },
    { symbol: 'TATAMOTORS', reason: 'EV segment growth +47%', sentiment: 'positive' },
    { symbol: 'BTC', reason: 'Surpassed $120K', sentiment: 'positive' }
  ];

  window.MarketsData = {
    sectors: sectors,
    marketBreadth: marketBreadth,
    sectorHeatmap: sectorHeatmap,
    fearGreedIndex: fearGreedIndex,
    marketStats: marketStats,
    trending: trending,
    getSectorByName: function(name) { return sectors.find(function(s) { return s.name === name; }); },
    getTopSectors: function(n) {
      n = n || 3;
      return sectors.slice().sort(function(a, b) { return b.change - a.change; }).slice(0, n);
    },
    getWorstSectors: function(n) {
      n = n || 3;
      return sectors.slice().sort(function(a, b) { return a.change - b.change; }).slice(0, n);
    }
  };
})();
