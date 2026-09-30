const Search = (() => {
  let isOpen = false;
  let query = '';
  let results = [];
  let history = [];
  let selectedIndex = -1;

  const trending = [
    { text: 'Nifty 50 today', type: 'trending', icon: '🔥' },
    { text: 'Apple stock price', type: 'trending', icon: '🔥' },
    { text: 'Budget 2026 highlights', type: 'trending', icon: '📰' },
    { text: 'Bitcoin price INR', type: 'trending', icon: '📈' },
    { text: 'IPL 2026 schedule', type: 'trending', icon: '🏏' },
    { text: 'AI news today', type: 'trending', icon: '🤖' },
    { text: 'Weather Delhi', type: 'trending', icon: '🌤' },
    { text: 'ISRO launches', type: 'trending', icon: '🚀' }
  ];

  function init() {
    history = Utils.storage.get('searchHistory', []);
    setupListeners();
  }

  function setupListeners() {
    Utils.$$('.search-trigger').forEach(btn => {
      btn.addEventListener('click', open);
    });

    const input = Utils.$('#search-input');
    if (input) {
      input.addEventListener('input', Utils.debounce(handleInput, 250));
      input.addEventListener('keydown', handleKeyNav);
    }

    const panel = Utils.$('#search-panel');
    if (panel) {
      panel.addEventListener('click', e => e.stopPropagation());
    }

    document.addEventListener('click', e => {
      if (isOpen && !e.target.closest('#search-panel') && !e.target.closest('.search-trigger')) {
        close();
      }
    });
  }

  function open() {
    isOpen = true;
    const panel = Utils.$('#search-panel');
    if (panel) panel.classList.add('open');
    const input = Utils.$('#search-input');
    if (input) { input.value = ''; input.focus(); }
    query = '';
    selectedIndex = -1;
    renderDefault();
  }

  function close() {
    isOpen = false;
    const panel = Utils.$('#search-panel');
    if (panel) panel.classList.remove('open');
  }

  function handleInput(e) {
    query = e.target.value.trim();
    selectedIndex = -1;
    if (query.length === 0) { renderDefault(); return; }
    if (query.length < 2) return;
    performSearch(query);
  }

  function handleKeyNav(e) {
    const items = Utils.$$('#search-results .search-result-item');
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); selectedIndex = Math.min(selectedIndex + 1, items.length - 1); updateSelection(items); }
    if (e.key === 'ArrowUp') { e.preventDefault(); selectedIndex = Math.max(selectedIndex - 1, -1); updateSelection(items); }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && items[selectedIndex]) items[selectedIndex].click();
      else if (query) addToHistory(query);
    }
  }

  function updateSelection(items) {
    items.forEach((item, i) => item.classList.toggle('selected', i === selectedIndex));
    if (selectedIndex >= 0 && items[selectedIndex]) items[selectedIndex].scrollIntoView({ block: 'nearest' });
  }

  function performSearch(q) {
    const allItems = getAllSearchableItems();
    const lower = q.toLowerCase();
    results = allItems.filter(item =>
      item.title.toLowerCase().includes(lower) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(lower)))
    ).slice(0, 12);
    renderResults();
  }

  function getAllSearchableItems() {
    const items = [];
    const sections = [
      { category: 'News', items: ['Breaking News', 'World News', 'India News', 'Politics', 'Business News', 'Tech News', 'Science News', 'Health News', 'Sports News', 'Entertainment'] },
      { category: 'Markets', items: ['Nifty 50', 'Sensex', 'S&P 500', 'NASDAQ', 'Bitcoin', 'Ethereum', 'Gold Price', 'USD/INR', 'Top Gainers', 'Top Losers'] },
      { category: 'Media', items: ['Videos', 'Live TV', 'Podcasts', 'Shorts', 'Channels', 'Newspapers'] },
      { category: 'Tools', items: ['AI Assistant', 'Weather', 'Currency Converter', 'Economic Calendar', 'Settings'] }
    ];
    sections.forEach(s => {
      s.items.forEach(title => {
        items.push({ title, category: s.category, tags: title.toLowerCase().split(' ') });
      });
    });
    return items;
  }

  function addToHistory(q) {
    history = [q, ...history.filter(h => h !== q)].slice(0, 15);
    Utils.storage.set('searchHistory', history);
  }

  function renderDefault() {
    const container = Utils.$('#search-results');
    if (!container) return;

    let html = '';
    if (history.length > 0) {
      html += '<div class="search-section"><div class="search-section-title">Recent Searches</div>';
      html += history.slice(0, 5).map(h => `
        <div class="search-result-item recent" data-query="${Utils.escapeHtml(h)}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>${Utils.escapeHtml(h)}</span>
          <button class="search-remove" data-remove="${Utils.escapeHtml(h)}">&times;</button>
        </div>
      `).join('');
      html += '</div>';
    }

    html += '<div class="search-section"><div class="search-section-title">Trending</div>';
    html += trending.map(t => `
      <div class="search-result-item trending" data-query="${Utils.escapeHtml(t.text)}">
        <span class="trend-icon">${t.icon}</span>
        <span>${Utils.escapeHtml(t.text)}</span>
      </div>
    `).join('');
    html += '</div>';

    container.innerHTML = html;
    bindResultClicks(container);
  }

  function renderResults() {
    const container = Utils.$('#search-results');
    if (!container) return;

    if (results.length === 0) {
      container.innerHTML = `<div class="search-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <p>No results for "${Utils.escapeHtml(query)}"</p>
        <span class="search-empty-hint">Try different keywords</span>
      </div>`;
      return;
    }

    const grouped = {};
    results.forEach(r => {
      if (!grouped[r.category]) grouped[r.category] = [];
      grouped[r.category].push(r);
    });

    let html = '';
    for (const [cat, items] of Object.entries(grouped)) {
      html += `<div class="search-section"><div class="search-section-title">${cat}</div>`;
      items.forEach(item => {
        html += `
          <div class="search-result-item" data-query="${Utils.escapeHtml(item.title)}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span>${Utils.escapeHtml(item.title)}</span>
          </div>
        `;
      });
      html += '</div>';
    }

    container.innerHTML = html;
    bindResultClicks(container);
  }

  function bindResultClicks(container) {
    container.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const q = item.dataset.query;
        if (q) {
          addToHistory(q);
          close();
          Router.navigate('/news');
          Notifications.showToast(`Searching for "${q}"`, 'info');
        }
      });
    });
    container.querySelectorAll('.search-remove').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const rm = btn.dataset.remove;
        history = history.filter(h => h !== rm);
        Utils.storage.set('searchHistory', history);
        renderDefault();
      });
    });
  }

  return { init, open, close };
})();
