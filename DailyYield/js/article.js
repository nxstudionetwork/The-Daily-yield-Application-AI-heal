/* =====================================================================
   ARTICLE.JS — Full Article Reader
   ===================================================================== */
const Article = (() => {

  function saveToHistory(article) {
    if (!article) return;
    let history = Utils.storage.get('readHistory', []);
    history = history.filter(a => a.id !== article.id);
    history.unshift({ id: article.id, title: article.title, emoji: article.emoji, category: article.category, publisher: article.publisher ? article.publisher.name : '', readAt: Date.now() });
    if (history.length > 20) history = history.slice(0, 20);
    Utils.storage.set('readHistory', history);
  }

  function getArticleBody(article) {
    const sentences = [
      `${article.title}. This story has been developing throughout the day as sources close to the matter have provided new information to our correspondents.`,
      `According to ${article.publisher ? article.publisher.name : 'our sources'}, the situation began to emerge earlier this week when key stakeholders convened to address the underlying issues. The development has drawn significant attention from industry observers and analysts.`,
      `"This is a significant moment," said one expert familiar with the matter. "The implications could be far-reaching and we are only beginning to understand the full scope of what this means for the sector."`,
      `${article.summary || 'The full details are still emerging.'} Multiple parties are involved and negotiations are ongoing. The final outcome remains uncertain as talks continue behind closed doors.`,
      `Analysts have noted that the timing is particularly significant given the broader context of current market conditions. Several competing interests are at play, making a swift resolution unlikely.`,
      `${article.publisher ? article.publisher.name : 'Our team'} will continue to monitor this situation closely and provide updates as they become available. Readers are encouraged to follow our live blog for real-time developments.`,
      `Background: This story is part of a larger trend that has been building for several months. The groundwork was laid when preliminary discussions began, setting the stage for the current situation.`,
      `Looking ahead, experts suggest that the outcome of this development could set important precedents for the industry. All eyes will be on the next steps taken by the key players involved.`,
    ];
    return sentences.join('\n\n');
  }

  function render(content, articleId) {
    if (!content) return;
    if (!window.NewsData) { content.innerHTML = '<div class="page-header"><h1>Article not found</h1><button class="btn btn-outline" onclick="Router.navigate(\'/news\')">← Back to News</button></div>'; return; }

    const article = window.NewsData.articles.find(a => a.id === articleId || a.id === String(articleId));
    if (!article) {
      content.innerHTML = `<div class="page-header"><h1 class="page-title">Article not found</h1><button class="btn btn-gold" onclick="Router.navigate('/news')">← Back to News</button></div>`;
      return;
    }

    saveToHistory(article);

    const related = window.NewsData.articles.filter(a => a.id !== article.id && a.category === article.category).slice(0, 3);
    const liked     = Utils.storage.get('article_liked_' + article.id, false);
    const bookmarked = Utils.storage.get('article_bm_' + article.id, false);
    const body      = article.content || getArticleBody(article);

    content.innerHTML = `
      <div class="article-page fade-in">
        <div class="reading-progress-bar" id="reading-progress"></div>
        <div class="article-back">
          <button class="btn btn-ghost btn-sm" onclick="history.back()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
        </div>
        <div class="article-layout">
          <article class="article-main">
            <div class="article-hero">${article.emoji || '📰'}</div>
            <div class="article-meta-top">
              <span class="article-category-badge" style="background:var(--accent-dim);color:var(--accent)">${article.category}</span>
              ${article.isBreaking ? '<span class="article-category-badge" style="background:rgba(239,68,68,0.15);color:var(--negative)">BREAKING</span>' : ''}
              ${article.isFeatured ? '<span class="article-category-badge" style="background:var(--accent-dim);color:var(--accent)">FEATURED</span>' : ''}
            </div>
            <h1 class="article-title">${Utils.escapeHtml(article.title)}</h1>
            ${article.subtitle ? `<p class="article-subtitle">${Utils.escapeHtml(article.subtitle)}</p>` : ''}
            <div class="article-byline">
              <div class="article-author-row">
                <div class="article-author-avatar">${article.author ? article.author.avatar || article.author.name.charAt(0) : 'A'}</div>
                <div>
                  <div class="article-author-name">${article.author ? Utils.escapeHtml(article.author.name) : 'Staff Reporter'}${article.author && article.author.verified ? ' ✓' : ''}</div>
                  <div class="article-author-meta">${article.publisher ? Utils.escapeHtml(article.publisher.name) : ''} · ${Utils.timeAgo(article.publishDate)} · ${article.readingTime || 4} min read</div>
                </div>
              </div>
              <div class="article-stats-row">
                <span>👁️ ${Utils.formatNumber(article.views || 0)}</span>
                <span>❤️ ${Utils.formatNumber(article.likes || 0)}</span>
                <span>💬 ${Utils.formatNumber(article.comments || 0)}</span>
              </div>
            </div>
            <div class="article-action-bar">
              <button class="article-action-btn ${liked ? 'active' : ''}" id="article-like-btn" title="Like">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="${liked ? '#EF4444' : 'none'}" stroke="${liked ? '#EF4444' : 'currentColor'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                <span id="article-like-count">${Utils.formatNumber(article.likes || 0)}</span>
              </button>
              <button class="article-action-btn ${bookmarked ? 'active' : ''}" id="article-bm-btn" title="Bookmark">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="${bookmarked ? 'var(--accent)' : 'none'}" stroke="${bookmarked ? 'var(--accent)' : 'currentColor'}" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                ${bookmarked ? 'Saved' : 'Save'}
              </button>
              <button class="article-action-btn" id="article-share-btn" title="Share">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                Share
              </button>
            </div>
            <div class="article-body">
              ${body.split('\n\n').map(p => `<p>${Utils.escapeHtml(p)}</p>`).join('')}
            </div>
            ${article.tags && article.tags.length ? `
              <div class="article-tags">
                ${article.tags.map(t => `<span class="tag tag-gold">#${Utils.escapeHtml(t)}</span>`).join('')}
              </div>` : ''}
          </article>
          <aside class="article-sidebar">
            ${related.length ? `
              <div class="article-related-header">Related Stories</div>
              ${related.map(r => `
                <div class="article-related-card" onclick="Router.navigate('/article/${r.id}')">
                  <div style="font-size:1.75rem;flex-shrink:0">${r.emoji || '📰'}</div>
                  <div>
                    <div class="article-related-title">${Utils.escapeHtml(r.title)}</div>
                    <div class="article-related-meta">${Utils.timeAgo(r.publishDate)} · ${r.readingTime || 3} min</div>
                  </div>
                </div>`).join('')}` : ''}
          </aside>
        </div>
      </div>`;

    bindEvents(article);
    initReadingProgress();
    if (typeof Animations !== 'undefined') Animations.scrollFade();
  }

  function bindEvents(article) {
    const likeBtn = document.getElementById('article-like-btn');
    if (likeBtn) likeBtn.addEventListener('click', () => {
      const was = Utils.storage.get('article_liked_' + article.id, false);
      Utils.storage.set('article_liked_' + article.id, !was);
      const countEl = document.getElementById('article-like-count');
      if (countEl) countEl.textContent = Utils.formatNumber((article.likes || 0) + (!was ? 1 : 0));
      likeBtn.classList.toggle('active', !was);
      const svg = likeBtn.querySelector('svg');
      if (svg) { svg.setAttribute('fill', !was ? '#EF4444' : 'none'); svg.setAttribute('stroke', !was ? '#EF4444' : 'currentColor'); }
      if (typeof Notifications !== 'undefined') Notifications.showToast(!was ? 'Added to liked articles' : 'Removed from liked', 'success');
    });

    const bmBtn = document.getElementById('article-bm-btn');
    if (bmBtn) bmBtn.addEventListener('click', () => {
      const was = Utils.storage.get('article_bm_' + article.id, false);
      Utils.storage.set('article_bm_' + article.id, !was);
      bmBtn.classList.toggle('active', !was);
      bmBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="${!was ? 'var(--accent)' : 'none'}" stroke="${!was ? 'var(--accent)' : 'currentColor'}" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>${!was ? 'Saved' : 'Save'}`;
      if (typeof Notifications !== 'undefined') Notifications.showToast(!was ? 'Article saved!' : 'Removed from saved', 'success');
    });

    const shareBtn = document.getElementById('article-share-btn');
    if (shareBtn) shareBtn.addEventListener('click', () => {
      if (navigator.share) { navigator.share({ title: article.title, url: window.location.href }).catch(() => {}); }
      else { if (typeof Notifications !== 'undefined') Notifications.showToast('Link copied to clipboard!', 'success'); }
    });
  }

  function initReadingProgress() {
    const bar = document.getElementById('reading-progress');
    if (!bar) return;
    const articleMain = document.querySelector('.article-main');
    if (!articleMain) return;
    const onScroll = () => {
      const rect = articleMain.getBoundingClientRect();
      const total = articleMain.offsetHeight;
      const scrolled = Math.max(0, -rect.top);
      const pct = Math.min(100, (scrolled / (total - window.innerHeight)) * 100);
      bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  return { render };
})();
