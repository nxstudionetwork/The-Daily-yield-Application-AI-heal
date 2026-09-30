var PortfolioPage = (() => {
  var mockHoldings = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', qty: 15, avgPrice: 2650.00, sector: 'Energy' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', qty: 8, avgPrice: 3800.00, sector: 'Technology' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', qty: 22, avgPrice: 1480.00, sector: 'Banking' },
    { symbol: 'NVDA', name: 'NVIDIA Corp', qty: 12, avgPrice: 150.00, sector: 'Technology' },
    { symbol: 'BTC', name: 'Bitcoin', qty: 0.5, avgPrice: 85000.00, sector: 'Crypto' },
    { symbol: 'GOLD', name: 'Gold ETF', qty: 20, avgPrice: 2800.00, sector: 'Commodities' },
    { symbol: 'TATAMOTORS', name: 'Tata Motors', qty: 30, avgPrice: 720.00, sector: 'Automobile' },
    { symbol: 'BAJFINANCE', name: 'Bajaj Finance', qty: 5, avgPrice: 6500.00, sector: 'Finance' }
  ];

  var mockTransactions = [
    { type: 'BUY', symbol: 'RELIANCE', qty: 5, price: 2920.00, date: new Date(Date.now() - 86400000 * 2).toISOString() },
    { type: 'SELL', symbol: 'INFY', qty: 10, price: 1850.00, date: new Date(Date.now() - 86400000 * 5).toISOString() },
    { type: 'BUY', symbol: 'BTC', qty: 0.1, price: 118000.00, date: new Date(Date.now() - 86400000 * 7).toISOString() },
    { type: 'BUY', symbol: 'GOLD', qty: 5, price: 3100.00, date: new Date(Date.now() - 86400000 * 10).toISOString() },
    { type: 'DIVIDEND', symbol: 'HDFCBANK', qty: 0, price: 0, amount: 324.50, date: new Date(Date.now() - 86400000 * 12).toISOString() },
    { type: 'BUY', symbol: 'NVDA', qty: 4, price: 135.00, date: new Date(Date.now() - 86400000 * 14).toISOString() },
    { type: 'SELL', symbol: 'TITAN', qty: 8, price: 3600.00, date: new Date(Date.now() - 86400000 * 18).toISOString() },
    { type: 'BUY', symbol: 'TATAMOTORS', qty: 10, price: 850.00, date: new Date(Date.now() - 86400000 * 21).toISOString() }
  ];

  var sectorColors = {
    'Technology': '#3B82F6',
    'Banking': '#10B981',
    'Energy': '#F59E0B',
    'Crypto': '#8B5CF6',
    'Commodities': '#D4AF37',
    'Automobile': '#EF4444',
    'Finance': '#06B6D4'
  };

  function renderPortfolioPage(content) {
    if (!content) return;
    var portfolio = calculatePortfolio();
    content.innerHTML = `
      <div class="portfolio-page fade-in">
        <div class="page-header">
          <h1 class="page-title">My Portfolio</h1>
          <div class="page-actions">
            <button class="btn btn-outline btn-sm" onclick="PortfolioPage.refresh()">Refresh</button>
            <button class="btn btn-gold btn-sm">+ Add Holding</button>
          </div>
        </div>

        <section class="section">
          <div class="grid grid-3" style="gap:1rem" id="portfolio-summary"></div>
        </section>

        <section class="section">
          <div class="grid grid-2" style="gap:1.5rem">
            <div>
              <h2 class="section-title">Holdings</h2>
              <div id="portfolio-holdings"></div>
            </div>
            <div>
              <h2 class="section-title">Allocation</h2>
              <div id="portfolio-allocation"></div>
            </div>
          </div>
        </section>

        <section class="section">
          <h2 class="section-title">Recent Transactions</h2>
          <div id="portfolio-transactions"></div>
        </section>
      </div>
    `;
    renderSummary(portfolio);
    renderHoldings(portfolio);
    renderAllocation(portfolio);
    renderTransactions();
    Animations.scrollFade();
  }

  function calculatePortfolio() {
    var totalValue = 0;
    var totalCost = 0;
    var holdings = mockHoldings.map(function(h) {
      var currentPrice = getCurrentPrice(h.symbol);
      var value = currentPrice * h.qty;
      var cost = h.avgPrice * h.qty;
      var dayChange = value * (Math.random() * 0.04 - 0.02);
      totalValue += value;
      totalCost += cost;
      return {
        symbol: h.symbol,
        name: h.name,
        qty: h.qty,
        avgPrice: h.avgPrice,
        currentPrice: currentPrice,
        value: value,
        cost: cost,
        gain: value - cost,
        gainPct: ((value - cost) / cost) * 100,
        dayChange: dayChange,
        dayChangePct: (dayChange / value) * 100,
        sector: h.sector
      };
    });
    holdings.sort(function(a, b) { return b.value - a.value; });
    return {
      holdings: holdings,
      totalValue: totalValue,
      totalCost: totalCost,
      totalReturn: totalValue - totalCost,
      totalReturnPct: ((totalValue - totalCost) / totalCost) * 100,
      dayChange: holdings.reduce(function(sum, h) { return sum + h.dayChange; }, 0)
    };
  }

  function getCurrentPrice(symbol) {
    if (typeof StocksData !== 'undefined') {
      var stock = StocksData.getStock(symbol);
      if (stock) return stock.price;
      var crypto = StocksData.getCrypto(symbol);
      if (crypto) return crypto.price;
      var commodity = StocksData.getCommodity(symbol);
      if (commodity) return commodity.price;
    }
    var fallbackPrices = { 'NVDA': 198.50, 'GOLD': 3245.60, 'BTC': 121456.78 };
    return fallbackPrices[symbol] || 100;
  }

  function renderSummary(portfolio) {
    var el = document.getElementById('portfolio-summary');
    if (!el) return;
    var dayPct = (portfolio.dayChange / portfolio.totalValue) * 100;
    var dayCls = portfolio.dayChange >= 0 ? 'positive' : 'negative';
    var returnCls = portfolio.totalReturn >= 0 ? 'positive' : 'negative';

    el.innerHTML =
      '<div class="glass-card card-body" style="padding:1.5rem;text-align:center">' +
        '<div style="font-size:.8rem;color:var(--text-muted)">Total Portfolio Value</div>' +
        '<div style="font-size:2rem;font-weight:800;margin-top:.35rem">' + Utils.formatCurrency(portfolio.totalValue) + '</div>' +
      '</div>' +
      '<div class="glass-card card-body" style="padding:1.5rem;text-align:center">' +
        '<div style="font-size:.8rem;color:var(--text-muted)">Day Change</div>' +
        '<div style="font-size:1.6rem;font-weight:700;margin-top:.35rem" class="' + dayCls + '">' +
          (portfolio.dayChange >= 0 ? '+' : '') + Utils.formatCurrency(portfolio.dayChange) +
          ' (' + (dayPct >= 0 ? '+' : '') + dayPct.toFixed(2) + '%)' +
        '</div>' +
      '</div>' +
      '<div class="glass-card card-body" style="padding:1.5rem;text-align:center">' +
        '<div style="font-size:.8rem;color:var(--text-muted)">Total Return</div>' +
        '<div style="font-size:1.6rem;font-weight:700;margin-top:.35rem" class="' + returnCls + '">' +
          (portfolio.totalReturn >= 0 ? '+' : '') + Utils.formatCurrency(portfolio.totalReturn) +
          ' (' + (portfolio.totalReturnPct >= 0 ? '+' : '') + portfolio.totalReturnPct.toFixed(2) + '%)' +
        '</div>' +
      '</div>';
  }

  function renderHoldings(portfolio) {
    var el = document.getElementById('portfolio-holdings');
    if (!el) return;
    el.innerHTML = '<div class="glass-card" style="border-radius:12px;overflow:hidden">' +
      '<table style="width:100%;border-collapse:collapse;font-size:.82rem">' +
      '<thead><tr style="border-bottom:1px solid rgba(255,255,255,.1)">' +
        '<th style="text-align:left;padding:.6rem 1rem;color:var(--text-muted);font-weight:500">Stock</th>' +
        '<th style="text-align:right;padding:.6rem .75rem;color:var(--text-muted);font-weight:500">Qty</th>' +
        '<th style="text-align:right;padding:.6rem .75rem;color:var(--text-muted);font-weight:500">Avg</th>' +
        '<th style="text-align:right;padding:.6rem .75rem;color:var(--text-muted);font-weight:500">Current</th>' +
        '<th style="text-align:right;padding:.6rem .75rem;color:var(--text-muted);font-weight:500">Value</th>' +
        '<th style="text-align:right;padding:.6rem 1rem;color:var(--text-muted);font-weight:500">Return</th>' +
      '</tr></thead><tbody>' +
      portfolio.holdings.map(function(h) {
        var retCls = h.gain >= 0 ? 'positive' : 'negative';
        return '<tr style="border-bottom:1px solid rgba(255,255,255,.05)">' +
          '<td style="padding:.6rem 1rem"><div style="font-weight:600">' + h.symbol + '</div><div style="font-size:.7rem;color:var(--text-muted)">' + h.name + '</div></td>' +
          '<td style="text-align:right;padding:.6rem .75rem">' + h.qty + '</td>' +
          '<td style="text-align:right;padding:.6rem .75rem">' + Utils.formatCurrency(h.avgPrice) + '</td>' +
          '<td style="text-align:right;padding:.6rem .75rem;font-weight:600">' + Utils.formatCurrency(h.currentPrice) + '</td>' +
          '<td style="text-align:right;padding:.6rem .75rem;font-weight:600">' + Utils.formatCurrency(h.value, 'USD', true) + '</td>' +
          '<td style="text-align:right;padding:.6rem 1rem" class="' + retCls + '">' + (h.gain >= 0 ? '+' : '') + h.gainPct.toFixed(2) + '%</td>' +
        '</tr>';
      }).join('') +
      '</tbody></table></div>';
  }

  function renderAllocation(portfolio) {
    var el = document.getElementById('portfolio-allocation');
    if (!el) return;
    var sectorTotals = {};
    portfolio.holdings.forEach(function(h) {
      sectorTotals[h.sector] = (sectorTotals[h.sector] || 0) + h.value;
    });
    var sectors = Object.keys(sectorTotals).sort(function(a, b) { return sectorTotals[b] - sectorTotals[a]; });
    var total = portfolio.totalValue;
    var startAngle = 0;

    var gradStops = [];
    var cumulative = 0;
    sectors.forEach(function(s, i) {
      var pct = sectorTotals[s] / total * 100;
      gradStops.push({ sector: s, pct: pct, start: cumulative, color: sectorColors[s] || '#888' });
      cumulative += pct;
    });

    el.innerHTML = '<div class="glass-card card-body" style="padding:1.5rem;text-align:center">' +
      '<div style="position:relative;width:200px;height:200px;margin:0 auto">' +
        '<svg viewBox="0 0 100 100" width="200" height="200">' +
        gradStops.map(function(g) {
          var radius = 40;
          var cx = 50, cy = 50;
          var startA = (g.start / 100) * 360 - 90;
          var endA = ((g.start + g.pct) / 100) * 360 - 90;
          var startRad = startA * Math.PI / 180;
          var endRad = endA * Math.PI / 180;
          var largeArc = g.pct > 50 ? 1 : 0;
          var x1 = cx + radius * Math.cos(startRad);
          var y1 = cy + radius * Math.sin(startRad);
          var x2 = cx + radius * Math.cos(endRad);
          var y2 = cy + radius * Math.sin(endRad);
          var innerR = 22;
          var ix1 = cx + innerR * Math.cos(startRad);
          var iy1 = cy + innerR * Math.sin(startRad);
          var ix2 = cx + innerR * Math.cos(endRad);
          var iy2 = cy + innerR * Math.sin(endRad);
          if (g.pct >= 99.9) {
            return '<circle cx="50" cy="50" r="' + radius + '" fill="none" stroke="' + g.color + '" stroke-width="' + (radius - innerR) + '"/>';
          }
          return '<path d="M ' + x1 + ' ' + y1 + ' A ' + radius + ' ' + radius + ' 0 ' + largeArc + ' 1 ' + x2 + ' ' + y2 +
            ' L ' + ix2 + ' ' + iy2 + ' A ' + innerR + ' ' + innerR + ' 0 ' + largeArc + ' 0 ' + ix1 + ' ' + iy1 + ' Z" fill="' + g.color + '" opacity="0.85"/>';
        }).join('') +
        '</svg>' +
        '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center">' +
          '<div style="font-size:.65rem;color:var(--text-muted)">Total</div>' +
          '<div style="font-size:.9rem;font-weight:700">' + Utils.formatCurrency(total, 'USD', true) + '</div>' +
        '</div>' +
      '</div>' +
      '<div style="margin-top:1rem;text-align:left">' +
        sectors.map(function(s) {
          var pct = (sectorTotals[s] / total * 100).toFixed(1);
          return '<div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.35rem;font-size:.8rem">' +
            '<span style="width:10px;height:10px;border-radius:50%;background:' + (sectorColors[s] || '#888') + ';flex-shrink:0"></span>' +
            '<span style="flex:1">' + s + '</span>' +
            '<span style="font-weight:600">' + pct + '%</span>' +
          '</div>';
        }).join('') +
      '</div>' +
    '</div>';
  }

  function renderTransactions() {
    var el = document.getElementById('portfolio-transactions');
    if (!el) return;
    el.innerHTML = '<div class="glass-card" style="border-radius:12px;overflow:hidden">' +
      '<table style="width:100%;border-collapse:collapse;font-size:.82rem">' +
      '<thead><tr style="border-bottom:1px solid rgba(255,255,255,.1)">' +
        '<th style="text-align:left;padding:.6rem 1rem;color:var(--text-muted);font-weight:500">Type</th>' +
        '<th style="text-align:left;padding:.6rem .75rem;color:var(--text-muted);font-weight:500">Symbol</th>' +
        '<th style="text-align:right;padding:.6rem .75rem;color:var(--text-muted);font-weight:500">Qty</th>' +
        '<th style="text-align:right;padding:.6rem .75rem;color:var(--text-muted);font-weight:500">Price</th>' +
        '<th style="text-align:right;padding:.6rem .75rem;color:var(--text-muted);font-weight:500">Total</th>' +
        '<th style="text-align:right;padding:.6rem 1rem;color:var(--text-muted);font-weight:500">Date</th>' +
      '</tr></thead><tbody>' +
      mockTransactions.map(function(t) {
        var typeColor = t.type === 'BUY' ? 'var(--green)' : t.type === 'SELL' ? 'var(--red)' : 'var(--gold)';
        var total = t.type === 'DIVIDEND' ? t.amount : t.qty * t.price;
        return '<tr style="border-bottom:1px solid rgba(255,255,255,.05)">' +
          '<td style="padding:.6rem 1rem"><span style="color:' + typeColor + ';font-weight:600">' + t.type + '</span></td>' +
          '<td style="padding:.6rem .75rem;font-weight:600">' + t.symbol + '</td>' +
          '<td style="text-align:right;padding:.6rem .75rem">' + (t.type === 'DIVIDEND' ? '-' : t.qty) + '</td>' +
          '<td style="text-align:right;padding:.6rem .75rem">' + (t.type === 'DIVIDEND' ? '-' : Utils.formatCurrency(t.price)) + '</td>' +
          '<td style="text-align:right;padding:.6rem .75rem;font-weight:600">' + Utils.formatCurrency(total) + '</td>' +
          '<td style="text-align:right;padding:.6rem 1rem;color:var(--text-muted)">' + Utils.formatDate(t.date, { month: 'short', day: 'numeric' }) + '</td>' +
        '</tr>';
      }).join('') +
      '</tbody></table></div>';
  }

  function refresh() {
    var content = document.getElementById('main-content');
    if (content) renderPortfolioPage(content);
  }

  return { render: renderPortfolioPage, refresh: refresh };
})();
