const Home = (() => {
  const CATEGORIES = ['All','Sports','Technology','Politics','Business','Health','Environment','Food','Entertainment','Science','Finance','World'];
  let activeCategory = 'All';
  let trendingPage = 1;
  const PAGE_SIZE = 6;
  let allTrending = [];

  function el(tag, attrs, children) {
    return Utils.el(tag, attrs || {}, children || []);
  }

  function render(content) {
    if (!content) return;
    activeCategory = 'All';
    trendingPage = 1;
    allTrending = [];
    Animations.skeletonGrid(content, 6);
    setTimeout(function() { renderHomePage(content); }, 400);
  }

  function renderHomePage(content) {
    content.innerHTML = `
      <div class="home-page fade-in">
        <section class="hero-section" id="home-hero"></section>

        <section class="section market-ticker-section">
          <div class="section-header">
            <h2 class="section-title">Market Ticker</h2>
            <a href="#/news" class="section-link" data-route="/news">View All →</a>
          </div>
          <div class="market-strip" id="home-ticker"></div>
        </section>

        <section class="section">
          <div class="section-header">
            <h2 class="section-title">Breaking News</h2>
            <a href="#/news" class="section-link" data-route="/news">View All →</a>
          </div>
          <div class="card-grid" id="home-breaking"></div>
        </section>

        <!-- Categories strip -->
        <section class="section" id="home-categories-section">
          <div style="display:flex;gap:0.4rem;overflow-x:auto;padding-bottom:0.35rem;scrollbar-width:none">
            ${CATEGORIES.map(c => `<button class="tab-item${c==='All'?' tab-active':''}" data-cat="${c}" style="flex-shrink:0">${c}</button>`).join('')}
          </div>
        </section>

        <section class="section">
          <div class="section-header">
            <h2 class="section-title">Trending News</h2>
            <a href="#/news" class="section-link" data-route="/news">View All →</a>
          </div>
          <div class="news-list" id="home-trending"></div>
          <div id="trending-sentinel" style="height:1px;margin-top:0.5rem"></div>
        </section>

        <section class="section" id="continue-reading-section" style="display:none">
          <div class="section-header">
            <h2 class="section-title">Continue Reading</h2>
          </div>
          <div class="news-list" id="home-continue-reading"></div>
        </section>

        <section class="section">
          <div class="section-header">
            <h2 class="section-title">Featured Videos</h2>
            <a href="#/videos" class="section-link" data-route="/videos">View All →</a>
          </div>
          <div class="video-scroll" id="home-videos"></div>
        </section>

        <section class="section">
          <div class="section-header">
            <h2 class="section-title">Community Highlights</h2>
            <a href="#/posts" class="section-link" data-route="/posts">View All →</a>
          </div>
          <div class="posts-preview" id="home-posts"></div>
        </section>

        <section class="section">
          <div class="section-header">
            <h2 class="section-title">Quick Market Stats</h2>
          </div>
          <div class="market-stats-grid" id="home-stats"></div>
        </section>

        <section class="section">
          <div class="section-header">
            <h2 class="section-title">Weather & Quick Access</h2>
          </div>
          <div class="home-weather-tools-grid">
            <div class="home-weather-widget" id="home-weather-widget"></div>
            <div class="tools-grid home-tools-compact">
              <a href="#/weather" class="tool-card" data-route="/weather">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 18a5 5 0 0 0 .88-9.86A6 6 0 1 0 4 14h13z"/></svg>
                <span>Weather</span>
              </a>
              <a href="#/ai" class="tool-card" data-route="/ai">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><rect x="2" y="14" width="20" height="8" rx="2"/></svg>
                <span>AI Assistant</span>
              </a>
              <a href="#/newspapers" class="tool-card" data-route="/newspapers">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2z"/></svg>
                <span>Newspapers</span>
              </a>
              <a href="#/premium" class="tool-card" data-route="/premium">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span>Premium</span>
              </a>
            </div>
          </div>
        </section>

        <section class="section">
          <div class="section-header">
            <h2 class="section-title">Top Companies</h2>
            <a href="#/investment" class="section-link" data-route="/investment">View Dashboard →</a>
          </div>
          <div class="home-companies-grid" id="home-companies"></div>
        </section>
      </div>
    `;
    populateHero();
    populateTicker();
    populateBreaking();
    populateTrending();
    populateVideos();
    populatePosts();
    populateStats();
    populateWeather();
    populateCompanies();
    populateContinueReading();
    bindCategoryFilter(content);
    initInfiniteScroll(content);
    Animations.scrollFade();
    Animations.initCounters();
  }

  function bindCategoryFilter(content) {
    Utils.$$('[data-cat]', content).forEach(btn => {
      btn.addEventListener('click', () => {
        Utils.$$('[data-cat]', content).forEach(b => b.classList.remove('tab-active'));
        btn.classList.add('tab-active');
        activeCategory = btn.dataset.cat;
        trendingPage = 1;
        populateTrending();
      });
    });
  }

  function initInfiniteScroll(content) {
    const sentinel = Utils.$('#trending-sentinel', content);
    if (!sentinel) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        loadMoreTrending();
      }
    }, { rootMargin:'200px' });
    obs.observe(sentinel);
  }

  function loadMoreTrending() {
    if (typeof NewsData === 'undefined') return;
    const container = Utils.$('#home-trending');
    if (!container) return;
    const start = trendingPage * PAGE_SIZE;
    const more = allTrending.slice(start, start + 3);
    if (!more.length) return;
    trendingPage++;
    more.forEach(n => {
      const item = document.createElement('div');
      item.className = 'news-list-item fade-in';
      item.dataset.route = '/article/' + n.id;
      item.innerHTML = `<div class="news-list-emoji">${n.emoji||'📰'}</div>
        <div class="news-list-body">
          <h4>${Utils.escapeHtml(n.title)}</h4>
          <p class="news-list-summary">${Utils.escapeHtml(n.summary).substring(0,100)}...</p>
          <div class="news-card-meta">
            <span>${n.publisher.name}</span>
            <span>${Utils.timeAgo(n.publishDate)}</span>
            <span>${Utils.formatNumber(n.views)} views</span>
          </div>
        </div>`;
      item.addEventListener('click', () => Router.navigate('/article/' + n.id));
      container.appendChild(item);
    });
    Animations.stagger(Array.from(container.querySelectorAll('.fade-in')).slice(-3));
  }

  function populateContinueReading() {
    var history = [];
    try { history = JSON.parse(localStorage.getItem('dy_readHistory') || '[]'); } catch(e) {}
    if (!history.length || typeof NewsData === 'undefined') return;
    var section = Utils.$('#continue-reading-section');
    var container = Utils.$('#home-continue-reading');
    if (!section || !container) return;
    var items = history.slice(0, 3).map(function(id) { return NewsData.getById ? NewsData.getById(id) : null; }).filter(Boolean);
    if (!items.length) return;
    section.style.display = '';
    container.innerHTML = items.map(function(n) {
      return '<div class="news-list-item fade-in" data-route="/article/'+n.id+'">' +
        '<div class="news-list-emoji">' + (n.emoji||'📰') + '</div>' +
        '<div class="news-list-body">' +
          '<h4>' + Utils.escapeHtml(n.title) + '</h4>' +
          '<p class="news-list-summary">' + Utils.escapeHtml(n.summary).substring(0,100) + '...</p>' +
          '<div class="news-card-meta">' +
            '<span>📖 Continue Reading</span>' +
            '<span>' + Utils.timeAgo(n.publishDate) + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
    Utils.$$('.news-list-item', container).forEach(function(item) {
      item.addEventListener('click', function() { Router.navigate(item.dataset.route||'/news'); });
    });
  }

  function populateHero() {
    var hero = Utils.$('#home-hero');
    if (!hero || typeof NewsData === 'undefined') return;
    var featured = NewsData.getFeatured();
    if (!featured.length) return;
    var top = featured[0];
    var secondary = featured.slice(1, 4);

    hero.innerHTML = `
      <div class="hero-bg" style="background: linear-gradient(135deg, rgba(10,10,15,0.95), rgba(20,20,30,0.85));">
        <div class="hero-content">
          <div class="hero-badge"><span class="pulse-dot"></span> ${top.isBreaking ? 'BREAKING' : 'FEATURED'}</div>
          <h1 class="hero-title">${Utils.escapeHtml(top.title)}</h1>
          <p class="hero-subtitle">${Utils.escapeHtml(top.summary).substring(0, 180)}...</p>
          <div class="hero-meta">
            <span class="hero-source">${top.emoji || ''} ${top.publisher.name}</span>
            <span class="hero-time">${Utils.timeAgo(top.publishDate)}</span>
            <span class="hero-read">${top.readingTime} min read</span>
          </div>
        </div>
      </div>
      <div class="hero-sidebar">
        ${secondary.map(function(a) {
          return '<div class="hero-side-card fade-in" data-route="/news">' +
            '<span class="hero-side-emoji">' + (a.emoji || '📰') + '</span>' +
            '<div class="hero-side-info">' +
              '<h4>' + Utils.escapeHtml(a.title) + '</h4>' +
              '<span>' + a.publisher.name + ' · ' + Utils.timeAgo(a.publishDate) + '</span>' +
            '</div>' +
          '</div>';
        }).join('')}
      </div>
    `;
  }

  function populateTicker() {
    var ticker = Utils.$('#home-ticker');
    if (!ticker || typeof StocksData === 'undefined') return;
    var items = StocksData.indices || [];
    ticker.innerHTML = items.map(function(idx) {
      var c = Utils.formatChange(idx.change, idx.changePct);
      var isPositive = idx.change >= 0;
      var sparkColor = isPositive ? '#00c853' : '#ff1744';
      var mockSpark = isPositive
        ? [idx.price - 100, idx.price - 80, idx.price - 50, idx.price - 30, idx.price - 15, idx.price - 5, idx.price]
        : [idx.price + 100, idx.price + 80, idx.price + 50, idx.price + 30, idx.price + 15, idx.price + 5, idx.price];
      return '<div class="market-item">' +
        '<div class="market-name">' + idx.name + '</div>' +
        '<div class="market-price">' + idx.price.toLocaleString() + '</div>' +
        '<div class="market-change ' + c.cls + '">' + c.arrow + ' ' + c.text + '</div>' +
        '<svg class="market-sparkline" width="80" height="30" id="spark-home-' + idx.symbol + '"></svg>' +
      '</div>';
    }).join('');

    requestAnimationFrame(function() {
      items.forEach(function(idx) {
        var svg = Utils.$('#spark-home-' + idx.symbol);
        if (svg) {
          var isPositive = idx.change >= 0;
          var mockData = isPositive
            ? [idx.price - 100, idx.price - 80, idx.price - 50, idx.price - 30, idx.price - 15, idx.price - 5, idx.price]
            : [idx.price + 100, idx.price + 80, idx.price + 50, idx.price + 30, idx.price + 15, idx.price + 5, idx.price];
          Animations.drawSparkline(svg, mockData);
        }
      });
    });
    Animations.stagger(Utils.$$('.market-item', ticker));
  }

  function populateBreaking() {
    var container = Utils.$('#home-breaking');
    if (!container || typeof NewsData === 'undefined') return;
    var items = NewsData.getBreaking().slice(0, 4);
    container.innerHTML = items.map(function(n) {
      return '<div class="news-card fade-in" data-route="/news">' +
        '<div class="news-card-img">' +
          '<span class="news-card-emoji">' + (n.emoji || '📰') + '</span>' +
          (n.isBreaking ? '<span class="news-card-badge breaking">BREAKING</span>' : '') +
        '</div>' +
        '<div class="news-card-body">' +
          '<span class="news-card-category">' + n.category + '</span>' +
          '<h3 class="news-card-title">' + Utils.escapeHtml(n.title) + '</h3>' +
          '<p class="news-card-summary">' + Utils.escapeHtml(n.summary).substring(0, 140) + '...</p>' +
          '<div class="news-card-meta">' +
            '<span>' + n.publisher.name + '</span>' +
            '<span>' + Utils.timeAgo(n.publishDate) + '</span>' +
            '<span>' + n.readingTime + ' min read</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
    Animations.stagger(Utils.$$('.news-card', container));
  }

  function populateTrending() {
    var container = Utils.$('#home-trending');
    if (!container || typeof NewsData === 'undefined') return;
    var items;
    if (activeCategory === 'All') {
      items = NewsData.getTrending(30);
    } else {
      items = NewsData.getByCategory ? NewsData.getByCategory(activeCategory) : NewsData.articles.filter(function(a){ return a.category === activeCategory; });
      if (!items.length) items = NewsData.getTrending(30);
    }
    allTrending = items;
    var first = items.slice(0, PAGE_SIZE);
    container.innerHTML = first.map(function(n) {
      return '<div class="news-list-item fade-in" data-route="/article/'+n.id+'">' +
        '<div class="news-list-emoji">' + (n.emoji || '📰') + '</div>' +
        '<div class="news-list-body">' +
          '<h4>' + Utils.escapeHtml(n.title) + '</h4>' +
          '<p class="news-list-summary">' + Utils.escapeHtml(n.summary).substring(0, 100) + '...</p>' +
          '<div class="news-card-meta">' +
            '<span>' + n.publisher.name + '</span>' +
            '<span>' + Utils.timeAgo(n.publishDate) + '</span>' +
            '<span>' + Utils.formatNumber(n.views) + ' views</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
    Utils.$$('.news-list-item', container).forEach(function(item) {
      item.addEventListener('click', function() { Router.navigate(item.dataset.route||'/news'); });
    });
  }

  function populateVideos() {
    var container = Utils.$('#home-videos');
    if (!container || typeof VideosData === 'undefined') return;
    var items = VideosData.getFeatured().slice(0, 6);
    if (!items.length) items = VideosData.getRecent(6);
    container.innerHTML = items.map(function(v) {
      return '<div class="video-card fade-in">' +
        '<div class="video-thumb">' +
          '<span class="video-thumb-emoji">' + (v.thumbnail || '🎬') + '</span>' +
          (v.isLive ? '<span class="video-live-badge">LIVE</span>' : '<span class="video-duration">' + v.duration + '</span>') +
        '</div>' +
        '<div class="video-info">' +
          '<h4 class="video-title">' + Utils.escapeHtml(v.title) + '</h4>' +
          '<span class="video-channel">' + v.channelAvatar + ' ' + v.channel + '</span>' +
          '<span class="video-meta">' + v.views + ' views · ' + Utils.timeAgo(v.uploadDate) + '</span>' +
        '</div>' +
      '</div>';
    }).join('');
    Animations.stagger(Utils.$$('.video-card', container));
  }

  function populatePosts() {
    var container = Utils.$('#home-posts');
    if (!container || typeof PostsData === 'undefined') return;
    var items = PostsData.getMostLiked(3);
    container.innerHTML = items.map(function(p) {
      return '<div class="post-card fade-in">' +
        '<div class="post-header">' +
          '<div class="post-avatar">' + p.author.avatar + '</div>' +
          '<div>' +
            '<div class="post-author">' + Utils.escapeHtml(p.author.name) + '</div>' +
            '<div class="post-time">' + Utils.timeAgo(p.publishDate) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="post-content">' + Utils.escapeHtml(p.content.substring(0, 220)) + (p.content.length > 220 ? '...' : '') + '</div>' +
        (p.tags && p.tags.length ? '<div class="post-tags">' + p.tags.map(function(t) { return '<span class="tag">#' + t + '</span>'; }).join('') + '</div>' : '') +
        '<div class="post-stats">' +
          '<span>\u2764 ' + Utils.formatNumber(p.likes) + '</span>' +
          '<span>\uD83D\uDCAC ' + Utils.formatNumber(p.comments) + '</span>' +
          '<span>\u2197 ' + Utils.formatNumber(p.shares) + '</span>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function populateStats() {
    var container = Utils.$('#home-stats');
    if (!container || typeof StocksData === 'undefined') return;

    var topGainers = StocksData.getTopGainers(3);
    var topLosers = StocksData.getTopLosers(3);

    var btcPrice = '0';
    var ethPrice = '0';
    if (StocksData.crypto && StocksData.crypto.length) {
      var btc = StocksData.getCrypto('BTC');
      var eth = StocksData.getCrypto('ETH');
      if (btc) btcPrice = btc.price.toLocaleString();
      if (eth) ethPrice = eth.price.toLocaleString();
    }

    var html = '<div class="stats-card stats-gainers">' +
      '<h3 class="stats-card-title">Top Gainers</h3>' +
      topGainers.map(function(s) {
        var c = Utils.formatChange(s.change, s.changePct);
        return '<div class="stats-row">' +
          '<span class="stats-symbol">' + s.symbol + '</span>' +
          '<span class="stats-price">' + s.price.toLocaleString() + '</span>' +
          '<span class="stats-change ' + c.cls + '">' + c.arrow + ' +' + s.changePct.toFixed(2) + '%</span>' +
        '</div>';
      }).join('') +
    '</div>';

    html += '<div class="stats-card stats-losers">' +
      '<h3 class="stats-card-title">Top Losers</h3>' +
      topLosers.map(function(s) {
        var c = Utils.formatChange(s.change, s.changePct);
        return '<div class="stats-row">' +
          '<span class="stats-symbol">' + s.symbol + '</span>' +
          '<span class="stats-price">' + s.price.toLocaleString() + '</span>' +
          '<span class="stats-change ' + c.cls + '">' + c.arrow + ' ' + s.changePct.toFixed(2) + '%</span>' +
        '</div>';
      }).join('') +
    '</div>';

    html += '<div class="stats-card stats-crypto">' +
      '<h3 class="stats-card-title">Crypto Snapshot</h3>' +
      '<div class="stats-row"><span class="stats-symbol">BTC</span><span class="stats-price">' + btcPrice + '</span></div>' +
      '<div class="stats-row"><span class="stats-symbol">ETH</span><span class="stats-price">' + ethPrice + '</span></div>' +
    '</div>';

    html += '<div class="stats-card stats-summary">' +
      '<h3 class="stats-card-title">At a Glance</h3>' +
      '<div class="stats-row"><span>Total Articles</span><span data-count="' + (typeof NewsData !== 'undefined' ? NewsData.articles.length : 0) + '">0</span></div>' +
      '<div class="stats-row"><span>Videos</span><span data-count="' + (typeof VideosData !== 'undefined' ? VideosData.videos.length : 0) + '">0</span></div>' +
      '<div class="stats-row"><span>Community Posts</span><span data-count="' + (typeof PostsData !== 'undefined' ? PostsData.posts.length : 0) + '">0</span></div>' +
      '<div class="stats-row"><span>Companies</span><span data-count="' + (typeof CompaniesData !== 'undefined' ? CompaniesData.companies.length : 0) + '">0</span></div>' +
    '</div>';

    container.innerHTML = html;
    Animations.initCounters();
  }

  function populateWeather() {
    var widget = Utils.$('#home-weather-widget');
    if (!widget || typeof WeatherData === 'undefined') return;
    var w = WeatherData.current;
    if (!w) return;
    widget.innerHTML = '<div class="weather-widget-card">' +
      '<div class="weather-widget-main">' +
        '<span class="weather-widget-icon">' + (w.icon || '☀️') + '</span>' +
        '<div class="weather-widget-temp">' + w.temperature + '°</div>' +
        '<div class="weather-widget-info">' +
          '<div class="weather-widget-desc">' + (w.condition || 'Clear') + '</div>' +
          '<div class="weather-widget-location">' + (w.location || 'New Delhi') + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="weather-widget-details">' +
        '<span>💧 ' + (w.humidity || 45) + '%</span>' +
        '<span>💨 ' + (w.windSpeed || 12) + ' km/h</span>' +
        '<span>🌡️ Feels ' + (w.feelsLike || w.temperature) + '°</span>' +
      '</div>' +
    '</div>';
  }

  function populateCompanies() {
    var container = Utils.$('#home-companies');
    if (!container || typeof CompaniesData === 'undefined') return;
    var companies = CompaniesData.getTopGainers(6);
    container.innerHTML = companies.map(function(c) {
      var isUp = c.change >= 0;
      return '<div class="company-mini-card fade-in" data-route="/investment">' +
        '<div class="company-mini-header">' +
          '<span class="company-mini-logo">' + (c.logo || '🏢') + '</span>' +
          '<div>' +
            '<div class="company-mini-ticker">' + c.ticker + '</div>' +
            '<div class="company-mini-name">' + Utils.escapeHtml(c.name).substring(0, 30) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="company-mini-price">' +
          '<span>' + c.currency + ' ' + c.currentPrice.toLocaleString() + '</span>' +
          '<span class="company-mini-change ' + (isUp ? 'positive' : 'negative') + '">' +
            (isUp ? '▲' : '▼') + ' ' + Math.abs(c.changePct).toFixed(2) + '%' +
          '</span>' +
        '</div>' +
        '<div class="company-mini-chart" id="home-company-' + c.id + '"></div>' +
      '</div>';
    }).join('');
    requestAnimationFrame(function() {
      companies.forEach(function(c) {
        var chartEl = Utils.$('#home-company-' + c.id);
        if (chartEl && c.miniChart) {
          var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('width', '100%');
          svg.setAttribute('height', '30');
          svg.setAttribute('viewBox', '0 0 120 30');
          svg.setAttribute('preserveAspectRatio', 'none');
          chartEl.appendChild(svg);
          Animations.drawSparkline(svg, c.miniChart.slice(-12));
        }
      });
    });
    Animations.stagger(Utils.$$('.company-mini-card', container));
  }

  return { render };
})();
