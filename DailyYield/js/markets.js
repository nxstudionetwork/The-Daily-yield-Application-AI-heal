var MarketsPage = (() => {
  function renderMarketsPage(content) {
    if (!content) return;
    content.innerHTML = `
      <div class="markets-page fade-in">
        <div class="page-header">
          <h1 class="page-title">Market Dashboard</h1>
          <div class="page-actions">
            <span class="market-time">${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            <span class="market-status open">● Market Open</span>
          </div>
        </div>

        <section class="section">
          <h2 class="section-title">Market Overview</h2>
          <div class="grid grid-3" id="markets-indices"></div>
        </section>

        <section class="section">
          <div class="flex-between" style="margin-bottom:1rem">
            <h2 class="section-title">Fear & Greed Index</h2>
          </div>
          <div id="markets-fear-greed"></div>
        </section>

        <section class="section">
          <h2 class="section-title">Sector Heatmap</h2>
          <div class="grid grid-3" id="markets-heatmap"></div>
        </section>

        <section class="section">
          <div class="grid grid-2" style="gap:1.5rem">
            <div>
              <h2 class="section-title" style="color:var(--green)">Top Gainers</h2>
              <div id="markets-gainers"></div>
            </div>
            <div>
              <h2 class="section-title" style="color:var(--red)">Top Losers</h2>
              <div id="markets-losers"></div>
            </div>
          </div>
        </section>

        <section class="section">
          <h2 class="section-title">Market Breadth</h2>
          <div id="markets-breadth"></div>
        </section>

        <section class="section">
          <h2 class="section-title">Market Statistics</h2>
          <div class="grid grid-4" id="markets-stats"></div>
        </section>
      </div>
    `;
    renderIndices();
    renderFearGreed();
    renderHeatmap();
    renderGainersLosers();
    renderBreadth();
    renderMarketStats();
    Animations.scrollFade();
  }

  function renderIndices() {
    var el = document.getElementById('markets-indices');
    if (!el || typeof StocksData === 'undefined') return;
    var indices = StocksData.indices.slice(0, 6);
    el.innerHTML = indices.map(function(idx) {
      var c = Utils.formatChange(idx.change, idx.changePct);
      var sparkData = idx.change >= 0
        ? [idx.price - 120, idx.price - 90, idx.price - 60, idx.price - 35, idx.price - 15, idx.price - 5, idx.price]
        : [idx.price + 120, idx.price + 90, idx.price + 60, idx.price + 35, idx.price + 15, idx.price + 5, idx.price];
      return '<div class="glass-card card-body" style="padding:1.25rem">' +
        '<div style="display:flex;justify-content:space-between;align-items:start">' +
          '<div>' +
            '<div style="font-size:.75rem;color:var(--text-muted)">' + idx.exchange + '</div>' +
            '<div style="font-weight:700;font-size:1rem;margin-top:2px">' + idx.name + '</div>' +
          '</div>' +
          '<span class="badge ' + (idx.change >= 0 ? 'badge-blue' : 'badge-gold') + '">' + idx.symbol + '</span>' +
        '</div>' +
        '<div style="font-size:1.5rem;font-weight:800;margin:.75rem 0 .25rem">' + idx.price.toLocaleString() + '</div>' +
        '<div class="' + c.cls + '" style="font-size:.9rem;font-weight:600">' + c.arrow + ' ' + c.text + '</div>' +
        '<svg class="market-sparkline" width="100%" height="40" id="spark-mkt-' + idx.symbol + '"></svg>' +
      '</div>';
    }).join('');
    requestAnimationFrame(function() {
      indices.forEach(function(idx) {
        var svg = document.getElementById('spark-mkt-' + idx.symbol);
        if (svg && typeof Animations !== 'undefined' && Animations.drawSparkline) {
          var sparkData = idx.change >= 0
            ? [idx.price - 120, idx.price - 90, idx.price - 60, idx.price - 35, idx.price - 15, idx.price - 5, idx.price]
            : [idx.price + 120, idx.price + 90, idx.price + 60, idx.price + 35, idx.price + 15, idx.price + 5, idx.price];
          Animations.drawSparkline(svg, sparkData);
        }
      });
    });
  }

  function renderFearGreed() {
    var el = document.getElementById('markets-fear-greed');
    if (!el || typeof MarketsData === 'undefined') return;
    var fg = MarketsData.fearGreedIndex;
    var angle = (fg.value / 100) * 180 - 90;
    var labelColor = fg.value >= 60 ? 'var(--green)' : fg.value >= 40 ? '#FFC107' : 'var(--red)';
    el.innerHTML = '<div class="glass-card card-body" style="text-align:center;padding:2rem">' +
      '<svg viewBox="0 0 200 120" width="220" height="130" style="margin:0 auto">' +
        '<defs><linearGradient id="fg-grad" x1="0" y1="0" x2="1" y2="0">' +
          '<stop offset="0%" stop-color="#D32F2F"/><stop offset="25%" stop-color="#FF9800"/>' +
          '<stop offset="50%" stop-color="#FFC107"/><stop offset="75%" stop-color="#66BB6A"/>' +
          '<stop offset="100%" stop-color="#00C853"/>' +
        '</linearGradient></defs>' +
        '<path d="M 10 110 A 90 90 0 0 1 190 110" fill="none" stroke="url(#fg-grad)" stroke-width="14" stroke-linecap="round"/>' +
        '<line x1="100" y1="110" x2="' + (100 + 70 * Math.cos(angle * Math.PI / 180)) + '" y2="' + (110 - 70 * Math.sin((angle + 90) * Math.PI / 180)) + '" stroke="' + labelColor + '" stroke-width="3" stroke-linecap="round"/>' +
        '<circle cx="100" cy="110" r="5" fill="' + labelColor + '"/>' +
      '</svg>' +
      '<div style="font-size:2.5rem;font-weight:800;color:' + labelColor + ';margin-top:.5rem">' + fg.value + '</div>' +
      '<div style="font-size:1.1rem;font-weight:600;color:' + labelColor + '">' + fg.label + '</div>' +
      '<div style="display:flex;justify-content:center;gap:2rem;margin-top:1rem;font-size:.8rem;color:var(--text-muted)">' +
        '<span>Yesterday: ' + fg.previousClose + '</span>' +
        '<span>Week Ago: ' + fg.weekAgo + '</span>' +
        '<span>Month Ago: ' + fg.monthAgo + '</span>' +
        '<span>Year Ago: ' + fg.yearAgo + '</span>' +
      '</div>' +
    '</div>';
  }

  function renderHeatmap() {
    var el = document.getElementById('markets-heatmap');
    if (!el || typeof MarketsData === 'undefined') return;
    el.innerHTML = MarketsData.sectorHeatmap.map(function(s) {
      var bg = s.change > 2 ? 'rgba(0,200,83,.25)' : s.change > 1 ? 'rgba(102,187,106,.2)' : s.change > 0 ? 'rgba(102,187,106,.1)' : s.change > -1 ? 'rgba(239,83,80,.1)' : 'rgba(239,83,80,.2)';
      var textColor = s.change >= 0 ? 'var(--green)' : 'var(--red)';
      return '<div class="glass-card card-body" style="background:' + bg + ';padding:1rem;cursor:pointer">' +
        '<div style="font-weight:600;font-size:.9rem">' + s.name + '</div>' +
        '<div style="font-size:1.4rem;font-weight:800;color:' + textColor + ';margin-top:.35rem">' + (s.change >= 0 ? '+' : '') + s.change.toFixed(2) + '%</div>' +
        '<div style="font-size:.7rem;color:var(--text-muted);margin-top:.25rem">Weight: ~' + Math.round(100 / MarketsData.sectorHeatmap.length) + '%</div>' +
      '</div>';
    }).join('');
  }

  function renderGainersLosers() {
    var gEl = document.getElementById('markets-gainers');
    var lEl = document.getElementById('markets-losers');
    if (!gEl || !lEl || typeof StocksData === 'undefined') return;
    var gainers = StocksData.getTopGainers(6);
    var losers = StocksData.getTopLosers(6);

    function renderList(stocks, isGainer) {
      return '<div class="glass-card" style="border-radius:12px;overflow:hidden">' +
        '<table style="width:100%;border-collapse:collapse;font-size:.85rem">' +
        '<thead><tr style="border-bottom:1px solid rgba(255,255,255,.08)">' +
          '<th style="text-align:left;padding:.65rem 1rem;color:var(--text-muted);font-weight:500">Stock</th>' +
          '<th style="text-align:right;padding:.65rem 1rem;color:var(--text-muted);font-weight:500">Price</th>' +
          '<th style="text-align:right;padding:.65rem 1rem;color:var(--text-muted);font-weight:500">Change</th>' +
        '</tr></thead><tbody>' +
        stocks.map(function(s) {
          var stock = StocksData.getStock(s.symbol);
          var price = stock ? stock.price : 0;
          var cls = isGainer ? 'positive' : 'negative';
          var arrow = isGainer ? '&#9650;' : '&#9660;';
          return '<tr style="border-bottom:1px solid rgba(255,255,255,.05)">' +
            '<td style="padding:.6rem 1rem;font-weight:600">' + s.symbol + '</td>' +
            '<td style="text-align:right;padding:.6rem 1rem">' + Utils.formatCurrency(price) + '</td>' +
            '<td style="text-align:right;padding:.6rem 1rem" class="' + cls + '">' + arrow + ' ' + Math.abs(s.changePct).toFixed(2) + '%</td>' +
          '</tr>';
        }).join('') +
        '</tbody></table></div>';
    }

    gEl.innerHTML = renderList(gainers, true);
    lEl.innerHTML = renderList(losers, false);
  }

  function renderBreadth() {
    var el = document.getElementById('markets-breadth');
    if (!el || typeof MarketsData === 'undefined') return;
    var b = MarketsData.marketBreadth;
    var total = b.advances + b.declines + b.unchanged;
    var advPct = ((b.advances / total) * 100).toFixed(1);
    var decPct = ((b.declines / total) * 100).toFixed(1);

    el.innerHTML = '<div class="glass-card card-body" style="padding:1.5rem">' +
      '<div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:1rem">' +
        '<div style="flex:1;min-width:200px">' +
          '<div style="display:flex;justify-content:space-between;margin-bottom:.5rem;font-size:.85rem">' +
            '<span style="color:var(--green)">Advances: <strong>' + b.advances + '</strong> (' + advPct + '%)</span>' +
            '<span style="color:var(--red)">Declines: <strong>' + b.declines + '</strong> (' + decPct + '%)</span>' +
          '</div>' +
          '<div style="height:10px;border-radius:5px;background:rgba(255,255,255,.1);overflow:hidden;display:flex">' +
            '<div style="width:' + advPct + '%;background:var(--green);transition:width .5s"></div>' +
            '<div style="width:' + (b.unchanged / total * 100).toFixed(1) + '%;background:#888;transition:width .5s"></div>' +
            '<div style="width:' + decPct + '%;background:var(--red);transition:width .5s"></div>' +
          '</div>' +
        '</div>' +
        '<div style="display:flex;gap:2rem;font-size:.85rem;color:var(--text-muted);flex-wrap:wrap">' +
          '<div>New Highs: <strong style="color:var(--green)">' + b.newHighs + '</strong></div>' +
          '<div>New Lows: <strong style="color:var(--red)">' + b.newLows + '</strong></div>' +
          '<div>A/D Ratio: <strong style="color:var(--gold)">' + b.advanceDeclineRatio.toFixed(2) + '</strong></div>' +
          '<div>Adv Volume: <strong>' + b.advanceVolume + '</strong></div>' +
          '<div>Dec Volume: <strong>' + b.declineVolume + '</strong></div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderMarketStats() {
    var el = document.getElementById('markets-stats');
    if (!el || typeof MarketsData === 'undefined') return;
    var s = MarketsData.marketStats;
    var items = [
      { label: 'Total Market Cap', value: s.totalMarketCap, icon: '💰' },
      { label: 'S&P 52W Range', value: s.spx52wLow + ' - ' + s.spx52wHigh.toLocaleString(), icon: '📊' },
      { label: 'Volume Today', value: s.volumeToday, icon: '📈' },
      { label: 'Avg Volume (30d)', value: s.avgVolume30d, icon: '📉' },
      { label: 'VIX', value: s.vix.toFixed(2), icon: '⚡', change: s.vixChange },
      { label: 'Put/Call Ratio', value: s.putCallRatio.toFixed(2), icon: '🔄' },
      { label: 'Margin Debt', value: s.marginDebt, icon: '💳' },
      { label: 'Market Status', value: 'Open', icon: '🟢' }
    ];
    el.innerHTML = items.map(function(item) {
      var changeHtml = item.change != null
        ? '<div style="font-size:.75rem;color:' + (item.change < 0 ? 'var(--green)' : 'var(--red)') + '">' + (item.change < 0 ? '&#9660;' : '&#9650;') + ' ' + Math.abs(item.change).toFixed(2) + '</div>'
        : '';
      return '<div class="glass-card card-body" style="padding:1rem;text-align:center">' +
        '<div style="font-size:1.5rem;margin-bottom:.35rem">' + item.icon + '</div>' +
        '<div style="font-size:1.15rem;font-weight:700">' + item.value + '</div>' +
        '<div style="font-size:.75rem;color:var(--text-muted);margin-top:.2rem">' + item.label + '</div>' +
        changeHtml +
      '</div>';
    }).join('');
  }

  return { render: renderMarketsPage };
})();
