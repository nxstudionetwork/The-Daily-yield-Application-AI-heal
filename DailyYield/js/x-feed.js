const XFeed = (() => {
  var articles = (typeof NewsData !== 'undefined') ? NewsData.articles : [];
  var state = {
    view: 'card',
    filter: 'All',
    sort: 'Latest',
    search: '',
    displayCount: 15,
    loadStep: 10
  };

  var categoryMap = {
    'Breaking': { color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
    'Trending': { color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
    'Technology': { color: '#06B6D4', bg: 'rgba(6,182,212,0.15)' },
    'Business': { color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
    'Sports': { color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)' },
    'Politics': { color: '#EC4899', bg: 'rgba(236,72,153,0.15)' },
    'Entertainment': { color: '#F97316', bg: 'rgba(249,115,22,0.15)' },
    'Science': { color: '#6366F1', bg: 'rgba(99,102,241,0.15)' },
    'Health': { color: '#14B8A6', bg: 'rgba(20,184,166,0.15)' },
    'World': { color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
    'AI': { color: '#E040FB', bg: 'rgba(224,64,251,0.15)' },
    'Economy': { color: '#D4AF37', bg: 'rgba(212,175,55,0.15)' },
    'Crypto': { color: '#FFC107', bg: 'rgba(255,193,7,0.15)' },
    'India': { color: '#FF9800', bg: 'rgba(255,152,0,0.15)' },
    'Environment': { color: '#4CAF50', bg: 'rgba(76,175,80,0.15)' }
  };

  var filters = ['All', 'Breaking', 'Trending', 'Technology', 'Business', 'Sports', 'Politics', 'Entertainment', 'Science', 'Health', 'World'];

  var countryFlags = {
    'US': '🇺🇸', 'IN': '🇮🇳', 'GB': '🇬🇧', 'CN': '🇨🇳', 'JP': '🇯🇵',
    'DE': '🇩🇪', 'FR': '🇫🇷', 'AU': '🇦🇺', 'BR': '🇧🇷', 'EU': '🇪🇺'
  };

  function getCategoryStyle(cat) {
    return categoryMap[cat] || { color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' };
  }

  function getCountryFlag(article) {
    if (!article.tags) return '';
    var tagStr = article.tags.join(' ').toLowerCase() + ' ' + (article.title || '').toLowerCase();
    if (tagStr.match(/\bindia\b|\bmumbai\b|\bdelhi\b|\bbangalore\b|\brbi\b|\bmodi\b|\bibro\b|\bipl\b/)) return countryFlags['IN'];
    if (tagStr.match(/\busa\b|\bu\.s\b|\bwashington\b|\bnasdaq\b|\bdow jones\b|\bnyc\b/)) return countryFlags['US'];
    if (tagStr.match(/\buk\b|\blondon\b|\bbritain\b/)) return countryFlags['GB'];
    if (tagStr.match(/\bchina\b|\bbeijing\b|\bshanghai\b/)) return countryFlags['CN'];
    if (tagStr.match(/\bjapan\b|\bnikkei\b|\btoykyo\b/)) return countryFlags['JP'];
    if (tagStr.match(/\bgermany\b|\bberlin\b/)) return countryFlags['DE'];
    if (tagStr.match(/\baustralia\b|\bsydney\b/)) return countryFlags['AU'];
    if (tagStr.match(/\beu\b|\beurope\b|\beuropean\b/)) return countryFlags['EU'];
    return '';
  }

  function getFactCheck(article) {
    if (!article.tags) return null;
    var tagStr = article.tags.join(' ').toLowerCase() + ' ' + (article.title || '').toLowerCase();
    if (tagStr.match(/\bdebunk\b|\bfake\b|\bhoax\b|\bmisleading\b/)) return { status: 'Disputed', color: '#EF4444' };
    if (tagStr.match(/\bverified\b|\bconfirmed\b|\bfact.check\b/)) return { status: 'Verified', color: '#10B981' };
    if (article.publisher && article.publisher.verified) return { status: 'Verified Source', color: '#10B981' };
    return null;
  }

  function getRelatedCount(article) {
    if (!article.tags) return 0;
    return articles.filter(function(a) {
      if (a.id === article.id) return false;
      return a.tags && a.tags.some(function(t) { return article.tags.indexOf(t) !== -1; });
    }).length;
  }

  function getFilteredArticles() {
    var filtered = articles.slice();

    if (state.filter === 'Breaking') {
      filtered = filtered.filter(function(a) { return a.isBreaking; });
    } else if (state.filter === 'Trending') {
      filtered = filtered.filter(function(a) { return a.trendingScore >= 85; });
    } else if (state.filter !== 'All') {
      filtered = filtered.filter(function(a) { return a.category === state.filter; });
    }

    if (state.search) {
      var q = state.search.toLowerCase();
      filtered = filtered.filter(function(a) {
        return (a.title && a.title.toLowerCase().indexOf(q) !== -1) ||
               (a.summary && a.summary.toLowerCase().indexOf(q) !== -1) ||
               (a.tags && a.tags.join(' ').toLowerCase().indexOf(q) !== -1) ||
               (a.publisher && a.publisher.name && a.publisher.name.toLowerCase().indexOf(q) !== -1);
      });
    }

    if (state.sort === 'Latest') {
      filtered.sort(function(a, b) { return new Date(b.publishDate) - new Date(a.publishDate); });
    } else if (state.sort === 'Most Read') {
      filtered.sort(function(a, b) { return b.views - a.views; });
    } else if (state.sort === 'AI Picks') {
      filtered.sort(function(a, b) { return b.trendingScore - a.trendingScore; });
    }

    return filtered;
  }

  function getBreakingArticles() {
    return articles.filter(function(a) { return a.isBreaking; }).sort(function(a, b) {
      return new Date(b.publishDate) - new Date(a.publishDate);
    });
  }

  function getFeaturedArticle() {
    var featured = articles.filter(function(a) { return a.isFeatured; });
    featured.sort(function(a, b) { return b.trendingScore - a.trendingScore; });
    return featured[0] || null;
  }

  function getTrendingTopics() {
    var topicMap = {};
    articles.forEach(function(a) {
      if (a.tags) {
        a.tags.forEach(function(t) {
          if (!topicMap[t]) topicMap[t] = { name: t, count: 0, score: 0 };
          topicMap[t].count++;
          topicMap[t].score += a.trendingScore || 0;
        });
      }
    });
    var topics = Object.values(topicMap);
    topics.sort(function(a, b) { return b.score - a.score; });
    return topics.slice(0, 12);
  }

  function isSaved(id) {
    var saved = Utils.storage.get('xfeed_saved', []);
    return saved.indexOf(id) !== -1;
  }

  function isBookmarked(id) {
    var bm = Utils.storage.get('xfeed_bookmarked', []);
    return bm.indexOf(id) !== -1;
  }

  function toggleSaved(id) {
    var saved = Utils.storage.get('xfeed_saved', []);
    var idx = saved.indexOf(id);
    if (idx !== -1) saved.splice(idx, 1);
    else saved.push(id);
    Utils.storage.set('xfeed_saved', saved);
    refreshActions(id);
  }

  function toggleBookmarked(id) {
    var bm = Utils.storage.get('xfeed_bookmarked', []);
    var idx = bm.indexOf(id);
    if (idx !== -1) bm.splice(idx, 1);
    else bm.push(id);
    Utils.storage.set('xfeed_bookmarked', bm);
    refreshActions(id);
  }

  function getLikeCount(id) {
    var likes = Utils.storage.get('xfeed_likes', {});
    return likes[id] || 0;
  }

  function toggleLike(id) {
    var likes = Utils.storage.get('xfeed_likes', {});
    if (likes[id]) {
      delete likes[id];
    } else {
      var article = articles.find(function(a) { return a.id === id; });
      likes[id] = (article ? article.likes : 0) + 1;
    }
    Utils.storage.set('xfeed_likes', likes);
    refreshActions(id);
  }

  function isLiked(id) {
    var likes = Utils.storage.get('xfeed_likes', {});
    return !!likes[id];
  }

  function refreshActions(id) {
    var el = document.querySelector('[data-article-actions="' + id + '"]');
    if (!el) return;
    var article = articles.find(function(a) { return a.id === id; });
    if (article) el.outerHTML = renderCardActions(article);
  }

  function formatCount(n) {
    return Utils.formatNumber(n);
  }

  function renderBreakingBanner() {
    var breaking = getBreakingArticles();
    if (breaking.length === 0) return '';
    var top = breaking[0];
    var scrollTexts = breaking.slice(0, 5).map(function(a) {
      return a.emoji + ' ' + a.title;
    });
    return '<div class="x-breaking-banner">' +
      '<div class="x-breaking-inner">' +
        '<div class="x-breaking-label">' +
          '<span class="x-breaking-dot"></span>' +
          '<span>BREAKING</span>' +
        '</div>' +
        '<div class="x-breaking-scroll-wrap">' +
          '<div class="x-breaking-scroll" id="x-breaking-scroll">' +
            scrollTexts.map(function(t) {
              return '<span class="x-breaking-item">' + Utils.escapeHtml(t) + '</span>';
            }).join('<span class="x-breaking-sep">•</span>') +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderFeaturedHero() {
    var featured = getFeaturedArticle();
    if (!featured) return '';
    var cs = getCategoryStyle(featured.category);
    var flag = getCountryFlag(featured);
    var readingTime = featured.readingTime || Math.ceil((featured.summary || '').split(' ').length / 200);
    return '<div class="x-featured-card">' +
      '<div class="x-featured-gradient"></div>' +
      '<div class="x-featured-content">' +
        '<div class="x-featured-top">' +
          '<span class="x-featured-badge" style="background:' + cs.color + ';color:#fff">' + Utils.escapeHtml(featured.category) + '</span>' +
          (featured.isBreaking ? '<span class="x-featured-badge" style="background:#EF4444;color:#fff">BREAKING</span>' : '') +
          (flag ? '<span class="x-featured-flag">' + flag + '</span>' : '') +
        '</div>' +
        '<h2 class="x-featured-title">' + Utils.escapeHtml(featured.emoji) + ' ' + Utils.escapeHtml(featured.title) + '</h2>' +
        '<p class="x-featured-summary">' + Utils.escapeHtml(featured.summary || '') + '</p>' +
        '<div class="x-featured-meta">' +
          '<span class="x-featured-source">' + (featured.publisher ? featured.publisher.logo + ' ' + Utils.escapeHtml(featured.publisher.name) : '') + '</span>' +
          '<span>' + Utils.timeAgo(featured.publishDate) + '</span>' +
          '<span>' + readingTime + ' min read</span>' +
          '<span>' + formatCount(featured.views) + ' views</span>' +
        '</div>' +
        '<div class="x-featured-actions">' +
          '<button class="btn btn-ghost btn-sm" onclick="XFeed.openArticle(\'' + featured.id + '\')">Read Full Story</button>' +
          '<button class="btn btn-ghost btn-sm x-action-btn" data-action="like" data-id="' + featured.id + '" onclick="XFeed.toggleLike(\'' + featured.id + '\')">' +
            (isLiked(featured.id) ? '❤️' : '🤍') + ' ' + formatCount(getLikeCount(featured.id) || featured.likes) +
          '</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderTrendingStrip() {
    var topics = getTrendingTopics();
    if (topics.length === 0) return '';
    return '<div class="x-section">' +
      '<div class="x-section-header">' +
        '<h3 class="x-section-title">🔥 Trending Topics</h3>' +
      '</div>' +
      '<div class="x-trending-strip" id="x-trending-strip">' +
        topics.map(function(t) {
          return '<div class="x-trending-card">' +
            '<span class="x-trending-name">#' + Utils.escapeHtml(t.name) + '</span>' +
            '<span class="x-trending-count">' + t.count + ' stories</span>' +
          '</div>';
        }).join('') +
      '</div>' +
    '</div>';
  }

  function renderSortAndControls() {
    return '<div class="x-controls-bar">' +
      '<div class="x-view-toggle">' +
        '<button class="x-view-btn ' + (state.view === 'card' ? 'active' : '') + '" data-view="card" onclick="XFeed.setView(\'card\')">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>' +
          '<span>Card</span>' +
        '</button>' +
        '<button class="x-view-btn ' + (state.view === 'compact' ? 'active' : '') + '" data-view="compact" onclick="XFeed.setView(\'compact\')">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>' +
          '<span>Compact</span>' +
        '</button>' +
      '</div>' +
      '<select class="x-sort-select select-input" onchange="XFeed.setSort(this.value)">' +
        '<option value="Latest"' + (state.sort === 'Latest' ? ' selected' : '') + '>Latest</option>' +
        '<option value="Most Read"' + (state.sort === 'Most Read' ? ' selected' : '') + '>Most Read</option>' +
        '<option value="AI Picks"' + (state.sort === 'AI Picks' ? ' selected' : '') + '>AI Picks</option>' +
      '</select>' +
    '</div>';
  }

  function renderSearchBar() {
    return '<div class="x-search-bar">' +
      '<svg class="x-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
      '<input type="text" class="x-search-input" placeholder="Search headlines, topics, sources..." value="' + Utils.escapeHtml(state.search) + '" oninput="XFeed.onSearch(this.value)" />' +
      (state.search ? '<button class="x-search-clear" onclick="XFeed.onSearch(\'\')">&times;</button>' : '') +
    '</div>';
  }

  function renderFilters() {
    return '<div class="x-filters" id="x-filters">' +
      filters.map(function(f) {
        var active = state.filter === f;
        var dot = '';
        if (f !== 'All') {
          var cs = getCategoryStyle(f);
          dot = '<span class="x-filter-dot" style="background:' + cs.color + '"></span>';
        }
        return '<button class="x-filter-chip ' + (active ? 'active' : '') + '" data-filter="' + f + '" onclick="XFeed.setFilter(\'' + f + '\')">' +
          dot + f +
        '</button>';
      }).join('') +
    '</div>';
  }

  function renderCardView(articleList, startIdx) {
    if (articleList.length === 0) {
      return '<div class="x-empty-state">' +
        '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>' +
        '<p>No headlines match your search</p>' +
      '</div>';
    }
    return '<div class="x-card-view" id="x-card-view">' +
      articleList.map(function(article, i) {
        return renderHeadlineCard(article, startIdx + i);
      }).join('') +
    '</div>';
  }

  function renderCompactView(articleList, startIdx) {
    if (articleList.length === 0) {
      return '<div class="x-empty-state">' +
        '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>' +
        '<p>No headlines match your search</p>' +
      '</div>';
    }
    return '<div class="x-compact-view" id="x-compact-view">' +
      articleList.map(function(article, i) {
        return renderCompactCard(article);
      }).join('') +
    '</div>';
  }

  function renderHeadlineCard(article, idx) {
    var cs = getCategoryStyle(article.category);
    var flag = getCountryFlag(article);
    var factCheck = getFactCheck(article);
    var related = getRelatedCount(article);
    var readingTime = article.readingTime || Math.ceil((article.summary || '').split(' ').length / 200);
    return '<div class="x-headline-card glass-card" data-article-id="' + article.id + '" style="animation-delay:' + (idx * 30) + 'ms">' +
      '<div class="x-card-header">' +
        '<div class="x-card-source">' +
          '<span class="x-card-source-emoji">' + (article.publisher ? article.publisher.logo : '📰') + '</span>' +
          '<span class="x-card-source-name">' + Utils.escapeHtml(article.publisher ? article.publisher.name : 'Unknown') + '</span>' +
          (article.publisher && article.publisher.verified ? '<span class="x-card-verified">✓</span>' : '') +
          '<span class="x-card-time">' + Utils.timeAgo(article.publishDate) + '</span>' +
        '</div>' +
        '<div class="x-card-badges">' +
          '<span class="x-card-category-badge" style="background:' + cs.bg + ';color:' + cs.color + '">' + Utils.escapeHtml(article.category) + '</span>' +
          (article.isBreaking ? '<span class="x-card-breaking-badge">BREAKING</span>' : '') +
          (flag ? '<span class="x-card-flag">' + flag + '</span>' : '') +
        '</div>' +
      '</div>' +
      '<div class="x-card-body" onclick="XFeed.openArticle(\'' + article.id + '\')">' +
        '<h3 class="x-card-headline">' + Utils.escapeHtml(article.emoji || '') + ' ' + Utils.escapeHtml(article.title) + '</h3>' +
        '<p class="x-card-summary">' + Utils.escapeHtml(article.summary || '') + '</p>' +
        (factCheck ? '<div class="x-fact-check" style="color:' + factCheck.color + '">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>' +
          '<span>' + factCheck.status + '</span>' +
        '</div>' : '') +
      '</div>' +
      '<div class="x-card-tags">' +
        (article.tags ? article.tags.slice(0, 3).map(function(t) {
          return '<span class="tag tag-gold">#' + Utils.escapeHtml(t) + '</span>';
        }).join('') : '') +
        (related > 0 ? '<span class="x-related-badge">' + related + ' related</span>' : '') +
      '</div>' +
      '<div class="x-card-stats">' +
        '<span>' + formatCount(article.views) + ' views</span>' +
        '<span>' + formatCount(article.likes) + ' likes</span>' +
        '<span>' + formatCount(article.comments) + ' comments</span>' +
        '<span>' + formatCount(article.shares) + ' shares</span>' +
        '<span class="x-reading-time">' + readingTime + ' min read</span>' +
      '</div>' +
      renderCardActions(article) +
    '</div>';
  }

  function renderCardActions(article) {
    var liked = isLiked(article.id);
    var saved = isSaved(article.id);
    var bm = isBookmarked(article.id);
    var likeCount = getLikeCount(article.id) || article.likes;
    return '<div class="x-card-actions" data-article-actions="' + article.id + '">' +
      '<button class="x-action-btn ' + (saved ? 'active' : '') + '" onclick="event.stopPropagation();XFeed.toggleSaved(\'' + article.id + '\')" title="Save">' +
        (saved ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>' :
                 '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>') +
      '</button>' +
      '<button class="x-action-btn ' + (bm ? 'active' : '') + '" onclick="event.stopPropagation();XFeed.toggleBookmarked(\'' + article.id + '\')" title="Bookmark">' +
        (bm ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="var(--blue)" stroke="var(--blue)" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>' :
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>') +
      '</button>' +
      '<button class="x-action-btn ' + (liked ? 'active' : '') + '" onclick="event.stopPropagation();XFeed.toggleLike(\'' + article.id + '\')" title="Like">' +
        (liked ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="#EF4444" stroke="#EF4444" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' :
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>') +
        ' <span class="x-action-count">' + formatCount(likeCount) + '</span>' +
      '</button>' +
      '<button class="x-action-btn" onclick="event.stopPropagation()" title="Comments">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
        ' <span class="x-action-count">' + formatCount(article.comments) + '</span>' +
      '</button>' +
      '<button class="x-action-btn" onclick="event.stopPropagation()" title="Share">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>' +
        ' <span class="x-action-count">' + formatCount(article.shares) + '</span>' +
      '</button>' +
      '<button class="x-action-btn x-read-btn btn btn-ghost btn-sm" onclick="event.stopPropagation();XFeed.openArticle(\'' + article.id + '\')">' +
        'Read' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>' +
      '</button>' +
    '</div>';
  }

  function renderCompactCard(article) {
    var cs = getCategoryStyle(article.category);
    var saved = isSaved(article.id);
    return '<div class="x-compact-card" data-article-id="' + article.id + '" onclick="XFeed.openArticle(\'' + article.id + '\')">' +
      '<span class="x-compact-emoji">' + (article.emoji || '📰') + '</span>' +
      '<div class="x-compact-body">' +
        '<span class="x-compact-headline">' + Utils.escapeHtml(article.title) + '</span>' +
        '<div class="x-compact-meta">' +
          '<span class="x-compact-dot" style="background:' + cs.color + '"></span>' +
          '<span class="x-compact-category">' + Utils.escapeHtml(article.category) + '</span>' +
          '<span class="x-compact-time">' + Utils.timeAgo(article.publishDate) + '</span>' +
          (article.isBreaking ? '<span class="x-compact-breaking">BREAKING</span>' : '') +
          (article.trendingScore >= 90 ? '<span class="x-compact-trending">🔥 TRENDING</span>' : '') +
        '</div>' +
      '</div>' +
      '<button class="x-compact-save ' + (saved ? 'active' : '') + '" onclick="event.stopPropagation();XFeed.toggleSaved(\'' + article.id + '\')">' +
        (saved ?
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>' :
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>') +
      '</button>' +
    '</div>';
  }

  function renderContent() {
    var filtered = getFilteredArticles();
    var toShow = filtered.slice(0, state.displayCount);
    var hasMore = state.displayCount < filtered.length;

    var html = renderSearchBar() +
      renderFilters() +
      renderSortAndControls() +
      '<div class="x-feed-count text-muted text-sm">' + filtered.length + ' headlines' + (state.filter !== 'All' ? ' in ' + state.filter : '') + (state.search ? ' matching "' + Utils.escapeHtml(state.search) + '"' : '') + '</div>' +
      renderBreakingBanner() +
      renderFeaturedHero() +
      renderTrendingStrip() +
      '<div class="x-section">' +
        '<div class="x-section-header">' +
          '<h3 class="x-section-title">📰 Latest Headlines</h3>' +
        '</div>' +
        (state.view === 'card' ? renderCardView(toShow, 0) : renderCompactView(toShow, 0)) +
      '</div>' +
      (hasMore ? '<div class="x-load-more">' +
        '<button class="btn btn-outline btn-lg" onclick="XFeed.loadMore()">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="7 13 12 18 17 13"/><polyline points="7 6 12 11 17 6"/></svg>' +
          'Load More (' + (filtered.length - state.displayCount) + ' remaining)' +
        '</button>' +
      '</div>' : '') +
      '<div class="x-footer-brand">' +
        '<span class="gold-text" style="font-weight:700">The Daily Yield</span>' +
        '<span class="text-muted"> · Real-time headlines powered by AI</span>' +
      '</div>';

    return html;
  }

  function render(content) {
    if (!content) return;
    content.innerHTML = '<div class="x-feed-page fade-in">' + renderContent() + '</div>';
    bindEvents();
    Animations.scrollFade();
    startBreakingScroll();
  }

  function reRender() {
    var page = document.querySelector('.x-feed-page');
    if (!page) return;
    page.innerHTML = renderContent();
    bindEvents();
    startBreakingScroll();
  }

  function bindEvents() {
    var strip = document.getElementById('x-trending-strip');
    if (strip) {
      var isDown = false, startX, scrollLeft;
      strip.addEventListener('mousedown', function(e) {
        isDown = true;
        startX = e.pageX - strip.offsetLeft;
        scrollLeft = strip.scrollLeft;
        strip.style.cursor = 'grabbing';
      });
      strip.addEventListener('mouseleave', function() { isDown = false; strip.style.cursor = 'grab'; });
      strip.addEventListener('mouseup', function() { isDown = false; strip.style.cursor = 'grab'; });
      strip.addEventListener('mousemove', function(e) {
        if (!isDown) return;
        e.preventDefault();
        var x = e.pageX - strip.offsetLeft;
        strip.scrollLeft = scrollLeft - (x - startX) * 1.5;
      });
    }
  }

  var breakingScrollAnim = null;
  function startBreakingScroll() {
    if (breakingScrollAnim) cancelAnimationFrame(breakingScrollAnim);
    var el = document.getElementById('x-breaking-scroll');
    if (!el) return;
    var pos = el.parentElement.offsetWidth;
    var speed = 0.8;

    function tick() {
      pos -= speed;
      if (pos < -el.offsetWidth) pos = el.parentElement.offsetWidth;
      el.style.transform = 'translateX(' + pos + 'px)';
      breakingScrollAnim = requestAnimationFrame(tick);
    }
    breakingScrollAnim = requestAnimationFrame(tick);
  }

  function setView(view) {
    state.view = view;
    reRender();
  }

  function setFilter(filter) {
    state.filter = filter;
    state.displayCount = 15;
    reRender();
  }

  function setSort(sort) {
    state.sort = sort;
    state.displayCount = 15;
    reRender();
  }

  var searchDebounce = null;
  function onSearch(val) {
    state.search = val;
    state.displayCount = 15;
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(function() { reRender(); }, 250);
    var input = document.querySelector('.x-search-input');
    if (input && document.activeElement !== input) {
      input.focus();
    }
    if (input) {
      var len = input.value.length;
      input.setSelectionRange(len, len);
    }
  }

  function loadMore() {
    state.displayCount += state.loadStep;
    reRender();
  }

  function openArticle(id) {
    var article = articles.find(function(a) { return a.id === id; });
    if (article && typeof Router !== 'undefined') {
      Router.navigate('/article/' + id);
    }
  }

  return {
    render: render,
    setView: setView,
    setFilter: setFilter,
    setSort: setSort,
    onSearch: onSearch,
    loadMore: loadMore,
    toggleSaved: toggleSaved,
    toggleBookmarked: toggleBookmarked,
    toggleLike: toggleLike,
    openArticle: openArticle
  };
})();
