const Stocks = (() => {
  let activeTab = 'indices';

  function render(content) {
    if (!content || typeof StocksData === 'undefined') return;
    content.innerHTML = `
      <div class="stocks-page fade-in">
        <div class="page-header">
          <h1 class="page-title">Markets</h1>
          <div class="page-actions">
            <span class="market-time">${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            <span class="market-status open">● Market Open</span>
          </div>
        </div>
        <div class="stocks-tabs">
          ${renderTabs()}
        </div>
        <div class="stocks-content" id="stocks-content"></div>
      </div>
    `;
    renderTabContent(activeTab);
    bindTabs();
  }

  function renderTabs() {
    const tabs = [
      { id: 'indices', label: 'Indices' },
      { id: 'stocks', label: 'Stocks' },
      { id: 'crypto', label: 'Crypto' },
      { id: 'forex', label: 'Forex' },
      { id: 'commodities', label: 'Commodities' }
    ];
    return tabs.map(t => `<button class="tab-item ${t.id === activeTab ? 'active' : ''}" data-tab="${t.id}">${t.label}</button>`).join('');
  }

  function bindTabs() {
    Utils.$$('.stocks-tabs .tab-item').forEach(tab => {
      tab.addEventListener('click', () => {
        activeTab = tab.dataset.tab;
        Utils.$$('.stocks-tabs .tab-item').forEach(t => t.classList.toggle('active', t.dataset.tab === activeTab));
        renderTabContent(activeTab);
      });
    });
  }

  function renderTabContent(tab) {
    const container = Utils.$('#stocks-content');
    if (!container) return;
    switch (tab) {
      case 'indices': renderIndices(container); break;
      case 'stocks': renderStocks(container); break;
      case 'crypto': renderCrypto(container); break;
      case 'forex': renderForex(container); break;
      case 'commodities': renderCommodities(container); break;
    }
    Animations.scrollFade();
  }

  function renderIndices(container) {
    container.innerHTML = `
      <div class="index-grid">
        ${StocksData.indices.map(idx => {
          const c = Utils.formatChange(idx.change, idx.changePct);
          return `
            <div class="index-card">
              <div class="index-name">${idx.name}</div>
              <div class="index-symbol">${idx.symbol}</div>
              <div class="index-price">${idx.price.toLocaleString()}</div>
              <div class="index-change ${c.cls}">${c.arrow} ${c.text}</div>
              <svg class="index-sparkline" width="100%" height="50" id="spark-${idx.symbol}"></svg>
            </div>
          `;
        }).join('')}
      </div>
      <div class="section" style="margin-top:1.5rem">
        <h3 class="section-title">Top Gainers</h3>
        <div class="stock-list">
          ${StocksData.topGainers.map(s => renderStockRow(s, true)).join('')}
        </div>
      </div>
      <div class="section" style="margin-top:1.5rem">
        <h3 class="section-title">Top Losers</h3>
        <div class="stock-list">
          ${StocksData.topLosers.map(s => renderStockRow(s, false)).join('')}
        </div>
      </div>
    `;
    requestAnimationFrame(() => {
      StocksData.indices.forEach(idx => {
        const svg = Utils.$(`#spark-${idx.symbol}`);
        if (svg) Animations.drawSparkline(svg, idx.sparkline);
      });
    });
  }

  function renderStocks(container) {
    container.innerHTML = `
      <div class="stock-list-header">
        <span>Symbol</span><span>Price</span><span>Change</span><span>Volume</span><span>Market Cap</span><span>Chart</span>
      </div>
      <div class="stock-list">
        ${StocksData.stocks.map(s => {
          const c = Utils.formatChange(s.change, s.changePct);
          return `
            <div class="stock-row">
              <div class="stock-symbol-cell">
                <span class="stock-symbol">${s.symbol}</span>
                <span class="stock-name">${s.name}</span>
              </div>
              <span class="stock-price">${Utils.formatCurrency(s.price)}</span>
              <span class="stock-change ${c.cls}">${c.arrow} ${c.text}</span>
              <span class="stock-volume">${s.volume}</span>
              <span class="stock-mcap">${s.marketCap}</span>
              <svg class="stock-sparkline" width="80" height="30" id="spark-stk-${s.symbol}"></svg>
            </div>
          `;
        }).join('')}
      </div>
    `;
    requestAnimationFrame(() => {
      StocksData.stocks.forEach(s => {
        const svg = Utils.$(`#spark-stk-${s.symbol}`);
        if (svg) Animations.drawSparkline(svg, s.sparkline);
      });
    });
  }

  function renderCrypto(container) {
    container.innerHTML = `
      <div class="stock-list-header">
        <span>Asset</span><span>Price</span><span>24h Change</span><span>Chart</span>
      </div>
      <div class="stock-list">
        ${StocksData.crypto.map(c => {
          const ch = Utils.formatChange(c.change, c.changePct);
          return `
            <div class="stock-row">
              <div class="stock-symbol-cell">
                <span class="stock-symbol">${c.symbol}</span>
                <span class="stock-name">${c.name}</span>
              </div>
              <span class="stock-price">${Utils.formatCurrency(c.price)}</span>
              <span class="stock-change ${ch.cls}">${ch.arrow} ${ch.text}</span>
              <svg class="stock-sparkline" width="100" height="30" id="spark-crypto-${c.symbol}"></svg>
            </div>
          `;
        }).join('')}
      </div>
    `;
    requestAnimationFrame(() => {
      StocksData.crypto.forEach(c => {
        const svg = Utils.$(`#spark-crypto-${c.symbol}`);
        if (svg) Animations.drawSparkline(svg, c.sparkline);
      });
    });
  }

  function renderForex(container) {
    container.innerHTML = `
      <div class="stock-list-header"><span>Pair</span><span>Rate</span><span>Change</span></div>
      <div class="stock-list">
        ${StocksData.forex.map(f => {
          const ch = Utils.formatChange(f.change, f.changePct);
          return `
            <div class="stock-row">
              <div class="stock-symbol-cell"><span class="stock-symbol">${f.symbol}</span><span class="stock-name">${f.name}</span></div>
              <span class="stock-price">${f.price.toFixed(2)}</span>
              <span class="stock-change ${ch.cls}">${ch.arrow} ${ch.text}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderCommodities(container) {
    container.innerHTML = `
      <div class="stock-list-header"><span>Commodity</span><span>Price</span><span>Change</span></div>
      <div class="stock-list">
        ${StocksData.commodities.map(c => {
          const ch = Utils.formatChange(c.change, c.changePct);
          return `
            <div class="stock-row">
              <div class="stock-symbol-cell"><span class="stock-symbol">${c.symbol}</span><span class="stock-name">${c.name}</span></div>
              <span class="stock-price">${Utils.formatCurrency(c.price)}</span>
              <span class="stock-change ${ch.cls}">${ch.arrow} ${ch.text}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderStockRow(s, isGainer) {
    const stock = StocksData.stocks.find(st => st.symbol === s.symbol);
    const crypto = StocksData.crypto.find(c => c.symbol === s.symbol);
    const price = stock ? stock.price : crypto ? crypto.price : 0;
    return `
      <div class="stock-row-mini">
        <span class="stock-symbol">${s.symbol}</span>
        <span class="stock-price">${Utils.formatCurrency(price)}</span>
        <span class="stock-change ${isGainer ? 'positive' : 'negative'}">${isGainer ? '▲' : '▼'} ${Math.abs(s.changePct).toFixed(2)}%</span>
      </div>
    `;
  }

  return { render };
})();
