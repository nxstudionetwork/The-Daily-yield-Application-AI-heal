var SearchPage = (() => {
  var activeFilter = 'all';

  function renderSearchPage(content) {
    if (!content) return;
    var query = getQuery();
    content.innerHTML = `
      <div class="search-page fade-in">
        <div class="page-header">
          <h1 class="page-title">Search</h1>
        </div>

        <section class="section" style="max-width:700px;margin:0 auto 1.5rem">
          <div class="input-group" style="width:100%;position:relative">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" style="position:absolute;left:1rem;flex-shrink:0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" class="input" placeholder="Search news, markets, videos, posts..." id="search-page-input" value="${Utils.escapeHtml(query)}" style="width:100%;font-size:.95rem;padding-left:2.75rem">
          </div>
        </section>

        <section class="section" style="max-width:960px;margin:0 auto">
          <div class="tab-group" id="search-page-tabs" style="display:flex;gap:.5rem;margin-bottom:1.25rem;justify-content:center">
            <button class="tab-item ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">All</button>
            <button class="tab-item ${activeFilter === 'news' ? 'active' : ''}" data-filter="news">News</button>
            <button class="tab-item ${activeFilter === 'markets' ? 'active' : ''}" data-filter="markets">Markets</button>
            <button class="tab-item ${activeFilter === 'videos' ? 'active' : ''}" data-filter="videos">Videos</button>
            <button class="tab-item ${activeFilter === 'posts' ? 'active' : ''}" data-filter="posts">Posts</button>
          </div>
          <div id="search-page-results"></div>
        </section>
      </div>
    `;
    bindTabs();
    bindSearchInput();
    if (query.length > 0) {
      performSearch(query);
    } else {
      renderDefaultResults();
    }
    Animations.scrollFade();
  }

  function getQuery() {
    var hash = window.location.hash || '';
    var qIdx = hash.indexOf('?q=');
    if (qIdx !== -1) return decodeURIComponent(hash.substring(qIdx + 3));
    qIdx = hash.indexOf('q=');
    if (qIdx !== -1) return decodeURIComponent(hash.substring(qIdx + 2));
    return '';
  }

  function bindTabs() {
    var tabs = document.querySelectorAll('#search-page-tabs .tab-item');
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        activeFilter = tab.dataset.filter;
        tabs.forEach(function(t) { t.classList.toggle('active', t.dataset.filter === activeFilter); });
        var input = document.getElementById('search-page-input');
        var q = input ? input.value.trim() : '';
        if (q.length > 0) performSearch(q);
        else renderDefaultResults();
      });
    });
  }

  function bindSearchInput() {
    var input = document.getElementById('search-page-input');
    if (!input) return;
    input.addEventListener('input', Utils.debounce(function(e) {
      var q = e.target.value.trim();
      if (q.length > 0) performSearch(q);
      else renderDefaultResults();
    }, 300));
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        var q = e.target.value.trim();
        if (q.length > 0) performSearch(q);
      }
    });
  }

  function performSearch(query) {
    var results = { news: [], markets: [], videos: [], posts: [] };

    if (typeof NewsData !== 'undefined' && NewsData.search) {
      results.news = NewsData.search(query);
    }
    if (typeof CompaniesData !== 'undefined' && CompaniesData.search) {
      results.markets = CompaniesData.search(query);
    }
    if (typeof VideosData !== 'undefined' && VideosData.videos) {
      var qLower = query.toLowerCase();
      results.videos = VideosData.videos.filter(function(v) {
        return v.title.toLowerCase().indexOf(qLower) !== -1 ||
               (v.tags && v.tags.some(function(t) { return t.toLowerCase().indexOf(qLower) !== -1; }));
      });
    }
    if (typeof PostsData !== 'undefined' && PostsData.posts) {
      var qLower2 = query.toLowerCase();
      results.posts = PostsData.posts.filter(function(p) {
        return p.content.toLowerCase().indexOf(qLower2) !== -1 ||
               (p.tags && p.tags.some(function(t) { return t.toLowerCase().indexOf(qLower2) !== -1; }));
      });
    }

    renderResults(results, query);
  }

  function renderResults(results, query) {
    var el = document.getElementById('search-page-results');
    if (!el) return;
    var totalResults = results.news.length + results.markets.length + results.videos.length + results.posts.length;

    if (totalResults === 0) {
      el.innerHTML = '<div style="text-align:center;padding:3rem 1rem">' +
        '<div style="font-size:3rem;margin-bottom:1rem">🔍</div>' +
        '<h3 style="font-size:1.1rem;font-weight:600;margin-bottom:.35rem">No results found</h3>' +
        '<p style="font-size:.88rem;color:var(--text-muted)">Try different keywords or check your spelling.</p>' +
      '</div>';
      return;
    }

    var html = '<div style="font-size:.82rem;color:var(--text-muted);margin-bottom:1rem">' +
      'Found <strong style="color:var(--gold)">' + totalResults + '</strong> results for "<strong>' + Utils.escapeHtml(query) + '</strong>"' +
    '</div>';

    if (activeFilter === 'all' || activeFilter === 'news') {
      if (results.news.length > 0) {
        html += '<h3 style="font-size:.95rem;font-weight:600;margin-bottom:.75rem;color:var(--blue)">📰 News (' + results.news.length + ')</h3>';
        html += '<div class="grid grid-2" style="gap:.75rem;margin-bottom:1.5rem">';
        html += results.news.slice(0, activeFilter === 'all' ? 6 : 20).map(function(a) {
          return '<div class="glass-card card-body" style="padding:1rem;cursor:pointer" onclick="Router.navigate(\'/news\')">' +
            '<div style="display:flex;gap:.65rem">' +
              '<div style="width:48px;height:48px;border-radius:8px;background:var(--glass-bg);display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0">' + (a.emoji || '📰') + '</div>' +
              '<div style="flex:1;min-width:0">' +
                '<div style="font-size:.78rem;font-weight:600;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">' + Utils.escapeHtml(a.title) + '</div>' +
                '<div style="font-size:.7rem;color:var(--text-muted);margin-top:2px">' + a.publisher.name + ' · ' + Utils.timeAgo(a.publishDate) + '</div>' +
              '</div>' +
            '</div>' +
          '</div>';
        }).join('');
        html += '</div>';
      }
    }

    if (activeFilter === 'all' || activeFilter === 'markets') {
      if (results.markets.length > 0) {
        html += '<h3 style="font-size:.95rem;font-weight:600;margin-bottom:.75rem;color:var(--gold)">📊 Markets (' + results.markets.length + ')</h3>';
        html += '<div class="grid grid-2" style="gap:.75rem;margin-bottom:1.5rem">';
        html += results.markets.slice(0, activeFilter === 'all' ? 6 : 20).map(function(c) {
          var ratingColor = c.rating === 'BUY' ? 'var(--green)' : c.rating === 'HOLD' ? '#FFC107' : 'var(--red)';
          return '<div class="glass-card card-body" style="padding:1rem">' +
            '<div style="display:flex;justify-content:space-between;align-items:start">' +
              '<div>' +
                '<div style="font-weight:700;font-size:.9rem">' + c.ticker + '</div>' +
                '<div style="font-size:.75rem;color:var(--text-muted)">' + c.name + '</div>' +
              '</div>' +
              '<span style="font-size:.7rem;padding:.15rem .5rem;border:1px solid ' + ratingColor + ';border-radius:10px;color:' + ratingColor + ';font-weight:600">' + c.rating + '</span>' +
            '</div>' +
            '<div style="font-size:.78rem;color:var(--text-muted);margin-top:.5rem">' + c.marketCap + ' · ' + c.sector + '</div>' +
          '</div>';
        }).join('');
        html += '</div>';
      }
    }

    if (activeFilter === 'all' || activeFilter === 'videos') {
      if (results.videos.length > 0) {
        html += '<h3 style="font-size:.95rem;font-weight:600;margin-bottom:.75rem;color:var(--green)">🎬 Videos (' + results.videos.length + ')</h3>';
        html += '<div class="grid grid-2" style="gap:.75rem;margin-bottom:1.5rem">';
        html += results.videos.slice(0, activeFilter === 'all' ? 4 : 20).map(function(v) {
          return '<div class="glass-card card-body" style="padding:1rem;cursor:pointer" onclick="Router.navigate(\'/videos\')">' +
            '<div style="display:flex;gap:.65rem">' +
              '<div style="width:80px;height:45px;border-radius:6px;background:var(--glass-bg);display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;position:relative">' +
                (v.thumbnail || '🎬') +
                '<span style="position:absolute;bottom:2px;right:2px;background:rgba(0,0,0,.8);color:#fff;font-size:.55rem;padding:1px 3px;border-radius:2px">' + v.duration + '</span>' +
              '</div>' +
              '<div style="flex:1;min-width:0">' +
                '<div style="font-size:.78rem;font-weight:600;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">' + Utils.escapeHtml(v.title) + '</div>' +
                '<div style="font-size:.7rem;color:var(--text-muted);margin-top:2px">' + v.channel + ' · ' + v.views + ' views</div>' +
              '</div>' +
            '</div>' +
          '</div>';
        }).join('');
        html += '</div>';
      }
    }

    if (activeFilter === 'all' || activeFilter === 'posts') {
      if (results.posts.length > 0) {
        html += '<h3 style="font-size:.95rem;font-weight:600;margin-bottom:.75rem;color:#8B5CF6">💬 Posts (' + results.posts.length + ')</h3>';
        html += '<div class="grid grid-2" style="gap:.75rem;margin-bottom:1.5rem">';
        html += results.posts.slice(0, activeFilter === 'all' ? 4 : 20).map(function(p) {
          return '<div class="glass-card card-body" style="padding:1rem">' +
            '<div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem">' +
              '<span style="font-size:1.1rem">' + p.author.avatar + '</span>' +
              '<span style="font-size:.82rem;font-weight:600">' + p.author.name + '</span>' +
            '</div>' +
            '<div style="font-size:.82rem;color:rgba(255,255,255,.8);line-height:1.5;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">' + Utils.escapeHtml(p.content) + '</div>' +
            '<div style="font-size:.7rem;color:var(--text-muted);margin-top:.5rem">❤️ ' + Utils.formatNumber(p.likes) + ' · 💬 ' + Utils.formatNumber(p.comments) + '</div>' +
          '</div>';
        }).join('');
        html += '</div>';
      }
    }

    el.innerHTML = html;
  }

  function renderDefaultResults() {
    var el = document.getElementById('search-page-results');
    if (!el) return;
    el.innerHTML = '<div style="text-align:center;padding:2rem 1rem">' +
      '<div style="font-size:2.5rem;margin-bottom:.75rem">🔍</div>' +
      '<h3 style="font-size:1.05rem;font-weight:600;margin-bottom:.35rem">Search Daily Yield</h3>' +
      '<p style="font-size:.85rem;color:var(--text-muted);margin-bottom:1.5rem">Find news, market data, videos, and community posts</p>' +
      '<div style="display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center">' +
        ['Federal Reserve', 'Bitcoin', 'Sensex', 'AI', 'IPL', 'Gold', 'SpaceX', 'India GDP'].map(function(t) {
          return '<button class="btn btn-ghost btn-sm search-page-suggestion" style="font-size:.8rem">' + t + '</button>';
        }).join('') +
      '</div>' +
    '</div>';
    document.querySelectorAll('.search-page-suggestion').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var input = document.getElementById('search-page-input');
        if (input) {
          input.value = btn.textContent;
          performSearch(btn.textContent);
        }
      });
    });
  }

  return { render: renderSearchPage };
})();
