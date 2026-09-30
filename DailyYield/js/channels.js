const Channels = (() => {
  function render(content) {
    if (!content || typeof ChannelsData === 'undefined') return;
    const channels = ChannelsData.channels || [];
    content.innerHTML = `
      <div class="channels-page fade-in">
        <div class="page-header">
          <h1 class="page-title gold-text">Channels</h1>
          <div class="page-actions">
            <input type="text" class="input" id="channel-search" placeholder="Search channels..." style="max-width:260px;font-size:.85rem">
          </div>
        </div>
        <div class="channels-grid" id="channels-grid">
          ${channels.map(c => `
            <div class="channel-card glass-card card fade-in" data-name="${c.name.toLowerCase()}" style="padding:1.25rem;display:flex;flex-direction:column;gap:.75rem">
              <div style="display:flex;align-items:center;gap:.75rem">
                <div style="width:48px;height:48px;border-radius:50%;background:var(--glass-bg);display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0">${c.avatar}</div>
                <div style="flex:1;min-width:0">
                  <h3 style="font-size:.95rem;font-weight:700;margin:0">${c.name} ${c.isVerified ? '<span style="color:var(--gold)">✓</span>' : ''}</h3>
                  <span style="font-size:.75rem;color:var(--text-muted)">${c.category} · ${c.followers} followers</span>
                </div>
              </div>
              <p style="font-size:.82rem;color:var(--text-secondary);margin:0;line-height:1.4">${c.description}</p>
              ${c.lastPost ? `
                <div style="background:var(--bg-secondary);border-radius:var(--radius-sm);padding:.5rem .75rem;font-size:.78rem">
                  <span style="color:var(--gold)">Latest:</span> <span style="color:var(--text-primary)">${c.lastPost.title}</span>
                  <span style="color:var(--text-muted);margin-left:.5rem">${c.lastPost.time}</span>
                </div>
              ` : ''}
              <div style="display:flex;gap:.5rem;align-items:center;margin-top:.25rem">
                <span style="font-size:.75rem;color:var(--text-muted)">${c.postsCount ? Utils.formatNumber(c.postsCount) + ' posts' : ''}</span>
                <span style="flex:1"></span>
                <button class="btn btn-sm ${c.isSubscribed ? 'btn-gold' : 'btn-outline'} channel-follow-btn">${c.isSubscribed ? 'Following' : 'Follow'}</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    Utils.$('#channel-search')?.addEventListener('input', Utils.debounce(e => {
      const q = e.target.value.toLowerCase();
      Utils.$$('.channel-card').forEach(card => {
        card.style.display = card.dataset.name.includes(q) ? '' : 'none';
      });
    }, 200));
    Utils.$$('.channel-follow-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const isFollowing = btn.classList.contains('btn-gold');
        btn.className = `btn btn-sm ${isFollowing ? 'btn-outline' : 'btn-gold'} channel-follow-btn`;
        btn.textContent = isFollowing ? 'Follow' : 'Following';
        Notifications.showToast(isFollowing ? 'Unfollowed' : 'Following!', 'success');
      });
    });
    Animations.scrollFade();
  }

  return { render };
})();
