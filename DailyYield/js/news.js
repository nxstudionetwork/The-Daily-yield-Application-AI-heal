/* ==========================================================================
   NEWS.JS — The Daily Yield · News Page
   ========================================================================== */
const News = (() => {
  let activeCategory = 'Breaking';
  let viewMode = 'list'; // 'grid' | 'list' | 'compact'
  let newsPage = 1;
  const PAGE_SIZE = 10;
  let filteredData = [];
  let searchQuery = '';

  function render(content, category) {
    if (!content) return;
    activeCategory = category || 'Breaking';
    newsPage = 1;
    searchQuery = '';
    filteredData = getNewsData(activeCategory);

    const trending = window.NewsData ? window.NewsData.getTrending(5) : [];

    content.innerHTML = `
      <div class="news-page fade-in">
        <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap">
          <h1 class="page-title gold-text">News</h1>
          <div class="page-actions" style="gap:0.5rem">
            <!-- In-page search -->
            <div style="display:flex;align-items:center;gap:0.35rem;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:var(--radius);padding:0.35rem 0.65rem;min-width:200px">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" id="news-search-input" placeholder="Search articles..." style="background:none;border:none;outline:none;font-size:0.82rem;color:var(--text-primary);width:100%">
            </div>
            <!-- View toggle -->
            <div style="display:flex;gap:0.2rem;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:var(--radius);padding:0.2rem">
              <button class="view-toggle-btn ${viewMode==='grid'?'active':''}" data-view="grid" title="Grid view" style="width:30px;height:28px;border:none;background:${viewMode==='grid'?'var(--accent-dim)':'transparent'};border-radius:4px;cursor:pointer;color:${viewMode==='grid'?'var(--accent)':'var(--text-muted)'}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              </button>
              <button class="view-toggle-btn ${viewMode==='list'?'active':''}" data-view="list" title="List view" style="width:30px;height:28px;border:none;background:${viewMode==='list'?'var(--accent-dim)':'transparent'};border-radius:4px;cursor:pointer;color:${viewMode==='list'?'var(--accent)':'var(--text-muted)'}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              </button>
              <button class="view-toggle-btn ${viewMode==='compact'?'active':''}" data-view="compact" title="Compact view" style="width:30px;height:28px;border:none;background:${viewMode==='compact'?'var(--accent-dim)':'transparent'};border-radius:4px;cursor:pointer;color:${viewMode==='compact'?'var(--accent)':'var(--text-muted)'}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="3" y1="14" x2="21" y2="14"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
            </div>
            <span class="text-muted" style="font-size:0.78rem">${Utils.formatNumber(window.NewsData ? window.NewsData.articles.length : 0)} articles</span>
          </div>
        </div>

        <div class="news-tabs tab-group" style="margin:0.5rem 0 1rem">
          ${renderTabs()}
        </div>

        <div class="news-content" id="news-content">
          ${renderBreakingBanner()}
          <div class="news-layout" style="display:grid;grid-template-columns:1fr 280px;gap:1.25rem;margin-top:1rem">
            <div>
              <div id="news-articles-container">
                ${renderArticlesInMode(filteredData.slice(0, PAGE_SIZE))}
              </div>
              <div id="news-load-more-sentinel" style="height:1px;margin-top:1rem"></div>
            </div>
            <aside>
              <div style="position:sticky;top:calc(var(--header-h) + var(--ticker-h) + 1rem)">
                <div class="glass-card" style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1rem;margin-bottom:1rem">
                  <h3 class="section-title" style="font-size:0.85rem;margin-bottom:0.75rem">Trending</h3>
                  ${renderTrendingSidebar(trending)}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    `;
    bindEvents(content);
    initInfiniteScroll(content);
    Animations.scrollFade();
  }

  function renderTabs() {
    const cats = [
      { id:'Breaking',     label:'Breaking',     dot:'#ff1744' },
      { id:'World',        label:'World',         dot:'#2196f3' },
      { id:'India',        label:'India',         dot:'#ff9800' },
      { id:'Politics',     label:'Politics',      dot:'#9c27b0' },
      { id:'Business',     label:'Business',      dot:'#4caf50' },
      { id:'Technology',   label:'Tech',          dot:'#00bcd4' },
      { id:'AI',           label:'AI',            dot:'#e040fb' },
      { id:'Science',      label:'Science',       dot:'#3f51b5' },
      { id:'Health',       label:'Health',        dot:'#e91e63' },
      { id:'Sports',       label:'Sports',        dot:'#8bc34a' },
      { id:'Entertainment',label:'Entertainment', dot:'#ff5722' },
      { id:'Crypto',       label:'Crypto',        dot:'#ffc107' }
    ];
    return cats.map(c => `
      <a href="#/news/${c.id.toLowerCase()}" class="tab-item ${c.id === activeCategory ? 'tab-active' : ''}" data-cat="${c.id}" data-route="/news/${c.id.toLowerCase()}">
        <span class="tab-dot" style="background:${c.dot}"></span>${c.label}
      </a>
    `).join('');
  }

  function getNewsData(category) {
    if (!window.NewsData) return [];
    if (category === 'Breaking') return window.NewsData.getBreaking();
    return window.NewsData.getByCategory ? window.NewsData.getByCategory(category) : window.NewsData.articles.filter(a => a.category === category);
  }

  function renderBreakingBanner() {
    const featured = window.NewsData ? window.NewsData.getFeatured() : [];
    if (!featured.length) return '';
    const top = featured[0];
    return `
      <div class="glass-card news-list-item fade-in" style="padding:1.25rem;border-left:3px solid var(--negative);cursor:pointer" onclick="Router.navigate('/article/${top.id}')">
        <div style="flex:1">
          <span style="font-size:0.65rem;font-weight:800;background:var(--gradient-gold);color:#000;padding:0.1rem 0.4rem;border-radius:3px;margin-bottom:0.4rem;display:inline-block">FEATURED</span>
          <h2 style="margin:0.35rem 0 0.25rem;font-size:1rem;line-height:1.3;font-weight:700">${Utils.escapeHtml(top.emoji||'')} ${Utils.escapeHtml(top.title)}</h2>
          <p style="color:var(--text-muted);font-size:0.82rem;margin:0 0 0.4rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${Utils.escapeHtml(top.subtitle||top.summary)}</p>
          <div style="display:flex;gap:0.75rem;font-size:0.72rem;color:var(--text-secondary);flex-wrap:wrap">
            <span>${top.publisher.logo||''} ${Utils.escapeHtml(top.publisher.name)}</span>
            <span>${Utils.timeAgo(top.publishDate)}</span>
            <span>${top.readingTime} min read</span>
            <span>${Utils.formatNumber(top.views)} views</span>
          </div>
        </div>
      </div>
    `;
  }

  function renderArticlesInMode(data) {
    if (!data || !data.length) return renderEmptyState();
    if (viewMode === 'grid') return renderGrid(data);
    if (viewMode === 'compact') return renderCompact(data);
    return renderList(data);
  }

  function renderGrid(data) {
    return `<div class="card-grid">${data.map(a => `
      <div class="news-card fade-in" data-id="${a.id}" style="cursor:pointer">
        <div class="news-card-img">
          <span class="news-card-emoji">${a.emoji||'📰'}</span>
          ${a.isBreaking ? '<span class="news-card-badge breaking">BREAKING</span>' : ''}
          ${a.isFeatured ? '<span class="news-card-badge featured">FEATURED</span>' : ''}
        </div>
        <div class="news-card-body">
          <span class="news-card-category">${a.category}</span>
          <h3 class="news-card-title">${Utils.escapeHtml(a.title)}</h3>
          <p class="news-card-summary">${Utils.escapeHtml(a.summary).substring(0,140)}...</p>
          <div class="news-card-meta">
            <span>${a.publisher.name}</span>
            <span>${Utils.timeAgo(a.publishDate)}</span>
            <span>${a.readingTime} min</span>
          </div>
        </div>
      </div>
    `).join('')}</div>`;
  }

  function renderList(data) {
    return `<div class="news-list">${data.map(a => `
      <div class="news-list-item glass-card fade-in" data-id="${a.id}" style="padding:0.9rem;cursor:pointer;border-left:3px solid ${a.sentiment==='positive'?'var(--positive)':a.sentiment==='negative'?'var(--negative)':'var(--border)'}">
        <div class="news-list-emoji">${a.emoji||'📰'}</div>
        <div class="news-list-body">
          <div style="display:flex;gap:0.35rem;flex-wrap:wrap;margin-bottom:0.2rem">
            <span style="font-size:0.65rem;font-weight:700;background:var(--blue-dim);color:var(--blue-light);padding:0.1rem 0.35rem;border-radius:3px">${Utils.escapeHtml(a.category)}</span>
            ${a.isBreaking?'<span style="font-size:0.6rem;font-weight:700;background:var(--negative);color:#fff;padding:0.1rem 0.3rem;border-radius:3px">BREAKING</span>':''}
          </div>
          <h3 style="font-size:0.9rem;font-weight:700;line-height:1.3;margin:0 0 0.2rem">${Utils.escapeHtml(a.title)}</h3>
          <p style="font-size:0.78rem;color:var(--text-muted);margin:0 0 0.4rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${Utils.escapeHtml(a.summary)}</p>
          <div style="display:flex;gap:0.6rem;font-size:0.68rem;color:var(--text-muted);flex-wrap:wrap">
            <span>${a.author.avatar} ${Utils.escapeHtml(a.author.name)}</span>
            <span>${Utils.timeAgo(a.publishDate)}</span>
            <span>${a.readingTime} min</span>
            <span>${Utils.formatNumber(a.views)} views</span>
          </div>
        </div>
      </div>
    `).join('')}</div>`;
  }

  function renderCompact(data) {
    return `<div style="display:flex;flex-direction:column;gap:0.2rem">${data.map((a,i) => `
      <div class="fade-in" data-id="${a.id}" style="display:flex;align-items:center;gap:0.65rem;padding:0.5rem 0.65rem;border-radius:var(--radius-sm);cursor:pointer;border-bottom:1px solid var(--border-subtle);transition:background var(--transition);" onmouseenter="this.style.background='var(--bg-tertiary)'" onmouseleave="this.style.background='transparent'">
        <span style="font-size:0.68rem;font-weight:700;color:var(--text-dim);min-width:20px">${i+1}</span>
        <span style="font-size:1rem">${a.emoji||'📰'}</span>
        <div style="flex:1;min-width:0">
          <div style="font-size:0.82rem;font-weight:600;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${Utils.escapeHtml(a.title)}</div>
          <div style="font-size:0.68rem;color:var(--text-muted)">${a.publisher.name} · ${Utils.timeAgo(a.publishDate)}</div>
        </div>
        <span style="font-size:0.7rem;color:var(--text-muted);flex-shrink:0">${a.readingTime}m</span>
      </div>
    `).join('')}</div>`;
  }

  function renderTrendingSidebar(trending) {
    if (!trending.length) return '<p style="font-size:0.78rem;color:var(--text-muted)">No trending articles</p>';
    return trending.map((a,i) => `
      <div style="display:flex;gap:0.4rem;margin-bottom:0.65rem;cursor:pointer;align-items:flex-start" onclick="Router.navigate('/article/${a.id}')">
        <span style="font-size:0.82rem;font-weight:700;color:var(--accent);min-width:18px">${i+1}</span>
        <div>
          <span style="font-size:0.77rem;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${a.emoji||''} ${Utils.escapeHtml(a.title)}</span>
          <span style="font-size:0.65rem;color:var(--text-muted);display:block;margin-top:2px">${Utils.timeAgo(a.publishDate)} · ${a.readingTime} min</span>
        </div>
      </div>
    `).join('');
  }

  function renderEmptyState() {
    return `<div class="glass-card" style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:3rem;text-align:center">
      <div style="font-size:2rem;margin-bottom:0.75rem">📭</div>
      <p style="color:var(--text-muted)">No articles found for this category</p>
    </div>`;
  }

  function bindEvents(content) {
    // Tab clicks
    Utils.$$('.tab-item[data-cat]', content).forEach(tab => {
      tab.addEventListener('click', e => {
        e.preventDefault();
        activeCategory = tab.dataset.cat;
        newsPage = 1;
        searchQuery = '';
        filteredData = getNewsData(activeCategory);
        const input = Utils.$('#news-search-input', content);
        if (input) input.value = '';
        Utils.$$('.tab-item', content).forEach(t => t.classList.remove('tab-active'));
        tab.classList.add('tab-active');
        refreshArticleContainer(content);
      });
    });

    // View toggle
    Utils.$$('.view-toggle-btn', content).forEach(btn => {
      btn.addEventListener('click', () => {
        viewMode = btn.dataset.view;
        Utils.$$('.view-toggle-btn', content).forEach(b => {
          const isActive = b.dataset.view === viewMode;
          b.style.background = isActive ? 'var(--accent-dim)' : 'transparent';
          b.style.color = isActive ? 'var(--accent)' : 'var(--text-muted)';
        });
        refreshArticleContainer(content);
      });
    });

    // In-page search
    const searchInput = Utils.$('#news-search-input', content);
    if (searchInput) {
      searchInput.addEventListener('input', Utils.debounce(e => {
        searchQuery = e.target.value.trim().toLowerCase();
        newsPage = 1;
        const base = getNewsData(activeCategory);
        filteredData = searchQuery
          ? base.filter(a => a.title.toLowerCase().includes(searchQuery) || (a.summary||'').toLowerCase().includes(searchQuery))
          : base;
        refreshArticleContainer(content);
      }, 300));
    }

    // Article card clicks
    content.addEventListener('click', e => {
      const card = e.target.closest('[data-id]');
      if (card && card.dataset.id) {
        addToReadHistory(card.dataset.id);
        Router.navigate('/article/' + card.dataset.id);
      }
    });
  }

  function refreshArticleContainer(content) {
    const c = Utils.$('#news-articles-container', content);
    if (c) c.innerHTML = renderArticlesInMode(filteredData.slice(0, newsPage * PAGE_SIZE));
    Animations.scrollFade();
  }

  function initInfiniteScroll(content) {
    const sentinel = Utils.$('#news-load-more-sentinel', content);
    if (!sentinel) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && filteredData.length > newsPage * PAGE_SIZE) {
        newsPage++;
        refreshArticleContainer(content);
      }
    }, { rootMargin:'300px' });
    obs.observe(sentinel);
  }

  function addToReadHistory(id) {
    try {
      var hist = JSON.parse(localStorage.getItem('dy_readHistory') || '[]');
      hist = [id, ...hist.filter(x => x !== id)].slice(0, 20);
      localStorage.setItem('dy_readHistory', JSON.stringify(hist));
    } catch(e) {}
  }

  return { render };
})();
