const Videos = (() => {
  let activeTab = 'featured';

  function render(content) {
    if (!content || typeof VideosData === 'undefined') return;
    content.innerHTML = `
      <div class="videos-page fade-in">
        <div class="page-header">
          <h1 class="page-title gold-text">Videos</h1>
        </div>
        <div class="videos-tabs" style="display:flex;gap:.5rem;margin-bottom:1.25rem;flex-wrap:wrap">
          <button class="btn btn-sm btn-gold tab-item" data-tab="featured">⭐ Featured</button>
          <button class="btn btn-sm btn-outline tab-item" data-tab="recent">🕐 Recent</button>
          <button class="btn btn-sm btn-outline tab-item" data-tab="live">🔴 Live</button>
          <button class="btn btn-sm btn-outline tab-item" data-tab="shorts">📱 Shorts</button>
        </div>
        <div class="videos-content" id="videos-content"></div>
      </div>
    `;
    renderTab(activeTab);
    Utils.$$('.videos-tabs .tab-item').forEach(tab => {
      tab.addEventListener('click', () => {
        activeTab = tab.dataset.tab;
        Utils.$$('.videos-tabs .tab-item').forEach(t => {
          t.className = `btn btn-sm ${t.dataset.tab === activeTab ? 'btn-gold' : 'btn-outline'} tab-item`;
        });
        renderTab(activeTab);
      });
    });
  }

  function renderTab(tab) {
    const el = Utils.$('#videos-content');
    if (!el) return;
    switch (tab) {
      case 'featured': renderFeatured(el); break;
      case 'recent': renderRecent(el); break;
      case 'live': renderLive(el); break;
      case 'shorts': renderShorts(el); break;
    }
    Animations.scrollFade();
  }

  function renderVideoCard(v) {
    const views = typeof v.views === 'string' ? v.views : Utils.formatNumber(v.views || 0);
    const time = Utils.timeAgo(v.uploadDate);
    return `
      <a href="#/video/${v.id}" class="video-card glass-card card fade-in" data-route="/video/${v.id}" style="padding:0;overflow:hidden;text-decoration:none;display:block">
        <div style="position:relative;background:var(--bg-secondary);height:180px;display:flex;align-items:center;justify-content:center;font-size:3rem">
          ${v.thumbnail}
          <span style="position:absolute;bottom:8px;right:8px;background:rgba(0,0,0,0.8);padding:.15rem .4rem;border-radius:4px;font-size:.72rem;color:#fff">${v.duration}</span>
          ${v.isLive ? '<span style="position:absolute;top:8px;left:8px;background:#e53e3e;padding:.15rem .5rem;border-radius:4px;font-size:.7rem;color:#fff;font-weight:600">● LIVE</span>' : ''}
        </div>
        <div style="padding:.75rem 1rem 1rem">
          <h3 style="font-size:.88rem;font-weight:600;margin:0 0 .4rem;line-height:1.3;color:var(--text-primary);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${v.title}</h3>
          <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.3rem">
            <span style="font-size:1rem">${v.channelAvatar}</span>
            <span style="font-size:.78rem;color:var(--text-secondary)">${v.channel}</span>
          </div>
          <div style="font-size:.72rem;color:var(--text-muted)">${views} views · ${time}</div>
        </div>
      </a>
    `;
  }

  function renderFeatured(el) {
    const videos = VideosData.getFeatured();
    el.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem">
      ${videos.map(v => renderVideoCard(v)).join('')}
    </div>`;
    Animations.stagger(Utils.$$('.video-card', el));
  }

  function renderRecent(el) {
    const videos = VideosData.getRecent(20);
    el.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem">
      ${videos.map(v => renderVideoCard(v)).join('')}
    </div>`;
    Animations.stagger(Utils.$$('.video-card', el));
  }

  function renderLive(el) {
    const live = VideosData.getLive();
    if (live.length === 0) {
      el.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--text-muted)"><p style="font-size:1.1rem">No live streams right now</p><p style="font-size:.85rem">Check back later!</p></div>';
      return;
    }
    el.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem">
      ${live.map(v => renderVideoCard(v)).join('')}
    </div>`;
  }

  function renderShorts(el) {
    const shorts = VideosData.getShorts();
    if (shorts.length === 0) {
      el.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--text-muted)"><p style="font-size:1.1rem">No shorts available</p></div>';
      return;
    }
    el.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:1rem">
      ${shorts.map(v => `
        <a href="#/video/${v.id}" class="fade-in" data-route="/video/${v.id}" style="text-decoration:none;display:block;border-radius:var(--radius-md);overflow:hidden;background:var(--bg-tertiary)">
          <div style="height:320px;background:var(--bg-secondary);display:flex;align-items:center;justify-content:center;font-size:3rem">${v.thumbnail}</div>
          <div style="padding:.5rem .75rem">
            <div style="font-size:.82rem;font-weight:600;color:var(--text-primary);margin-bottom:.2rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${v.title}</div>
            <div style="font-size:.72rem;color:var(--text-muted)">${v.views} views</div>
          </div>
        </a>
      `).join('')}
    </div>`;
  }

  return { render };
})();
