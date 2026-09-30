const Posts = (() => {
  let activeTab = 'trending';

  function render(content) {
    if (!content || typeof PostsData === 'undefined') return;
    content.innerHTML = `
      <div class="posts-page fade-in">
        <div class="page-header">
          <h1 class="page-title gold-text">Community</h1>
          <button class="btn btn-gold" id="new-post-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Post
          </button>
        </div>
        <div class="posts-tabs" style="display:flex;gap:.5rem;margin-bottom:1.25rem;flex-wrap:wrap">
          <button class="btn btn-sm btn-gold tab-item" data-tab="trending">🔥 Trending</button>
          <button class="btn btn-sm btn-outline tab-item" data-tab="recent">🕐 Recent</button>
          <button class="btn btn-sm btn-outline tab-item" data-tab="polls">📊 Polls</button>
          <button class="btn btn-sm btn-outline tab-item" data-tab="bookmarks">🔖 Bookmarks</button>
        </div>
        <div class="posts-content" id="posts-content"></div>
      </div>
    `;
    renderTab(activeTab);
    Utils.$$('.posts-tabs .tab-item').forEach(tab => {
      tab.addEventListener('click', () => {
        activeTab = tab.dataset.tab;
        Utils.$$('.posts-tabs .tab-item').forEach(t => {
          t.className = `btn btn-sm ${t.dataset.tab === activeTab ? 'btn-gold' : 'btn-outline'} tab-item`;
        });
        renderTab(activeTab);
      });
    });
    Utils.$('#new-post-btn')?.addEventListener('click', () => Notifications.showToast('Create a post!', 'info'));
  }

  function renderTab(tab) {
    const el = Utils.$('#posts-content');
    if (!el) return;
    switch (tab) {
      case 'trending': renderTrending(el); break;
      case 'recent': renderRecent(el); break;
      case 'polls': renderPolls(el); break;
      case 'bookmarks': renderBookmarks(el); break;
    }
    Animations.scrollFade();
  }

  function renderPostCard(p) {
    const authorName = p.author ? p.author.name : 'Anonymous';
    const authorAvatar = p.author ? p.author.avatar : '👤';
    const verified = p.author && p.author.verified;
    const time = Utils.timeAgo(p.publishDate);
    return `
      <div class="post-card glass-card card fade-in" style="padding:1.25rem;margin-bottom:1rem">
        <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.75rem">
          <div style="width:40px;height:40px;border-radius:50%;background:var(--glass-bg);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0">${authorAvatar}</div>
          <div style="flex:1">
            <div style="font-weight:600;font-size:.88rem">${authorName} ${verified ? '<span style="color:var(--gold);font-size:.75rem">✓</span>' : ''}</div>
            <div style="font-size:.72rem;color:var(--text-muted)">${time}</div>
          </div>
          ${p.type === 'poll' ? '<span style="font-size:.7rem;padding:.15rem .4rem;border-radius:8px;background:rgba(212,175,55,0.15);color:var(--gold)">Poll</span>' : ''}
        </div>
        <div style="font-size:.88rem;line-height:1.6;color:var(--text-primary);margin-bottom:.75rem">${p.content}</div>
        ${p.poll ? renderPoll(p.poll) : ''}
        ${p.tags && p.tags.length > 0 ? `
          <div style="display:flex;flex-wrap:wrap;gap:.3rem;margin-bottom:.75rem">
            ${p.tags.map(t => `<span class="tag" style="font-size:.72rem">#${t}</span>`).join('')}
          </div>
        ` : ''}
        <div style="display:flex;gap:1rem;padding-top:.5rem;border-top:1px solid var(--border)">
          <button class="btn btn-ghost btn-sm post-like-btn" style="font-size:.78rem;color:var(--text-secondary)">
            ❤️ ${Utils.formatNumber(p.likes)}
          </button>
          <button class="btn btn-ghost btn-sm" style="font-size:.78rem;color:var(--text-secondary)">
            💬 ${Utils.formatNumber(p.comments)}
          </button>
          <button class="btn btn-ghost btn-sm" style="font-size:.78rem;color:var(--text-secondary)">
            🔄 ${Utils.formatNumber(p.shares)}
          </button>
          <span style="flex:1"></span>
          <button class="btn btn-ghost btn-sm post-bookmark-btn" style="font-size:.78rem;color:${p.bookmarked ? 'var(--gold)' : 'var(--text-muted)'}">
            ${p.bookmarked ? '🔖' : '📑'}
          </button>
        </div>
      </div>
    `;
  }

  function renderPoll(poll) {
    const totalVotes = poll.options.reduce((s, o) => s + o.votes, 0);
    return `
      <div style="background:var(--bg-secondary);border-radius:var(--radius-md);padding:.75rem;margin-bottom:.75rem">
        ${poll.options.map(o => {
          const pct = totalVotes > 0 ? Math.round((o.votes / totalVotes) * 100) : 0;
          return `
            <div style="margin-bottom:.5rem">
              <div style="display:flex;justify-content:space-between;font-size:.8rem;margin-bottom:.2rem">
                <span>${o.text}</span>
                <span style="color:var(--gold)">${pct}%</span>
              </div>
              <div style="height:6px;background:var(--bg-tertiary);border-radius:3px;overflow:hidden">
                <div style="height:100%;width:${pct}%;background:var(--gold);border-radius:3px;transition:width 0.5s ease"></div>
              </div>
            </div>
          `;
        }).join('')}
        <div style="font-size:.72rem;color:var(--text-muted);margin-top:.25rem">${Utils.formatNumber(totalVotes)} votes</div>
      </div>
    `;
  }

  function renderTrending(el) {
    const posts = PostsData.getMostLiked(15);
    el.innerHTML = posts.map(p => renderPostCard(p)).join('');
    bindInteractions(el);
  }

  function renderRecent(el) {
    const posts = PostsData.getRecent(15);
    el.innerHTML = posts.map(p => renderPostCard(p)).join('');
    bindInteractions(el);
  }

  function renderPolls(el) {
    const polls = PostsData.getPolls();
    if (polls.length === 0) {
      const allPosts = PostsData.posts.filter(p => p.poll);
      if (allPosts.length === 0) {
        el.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--text-muted)">No polls yet. Create one!</div>';
        return;
      }
      el.innerHTML = allPosts.map(p => renderPostCard(p)).join('');
    } else {
      el.innerHTML = polls.map(p => renderPostCard(p)).join('');
    }
    bindInteractions(el);
  }

  function renderBookmarks(el) {
    const bookmarked = PostsData.posts.filter(p => p.bookmarked);
    if (bookmarked.length === 0) {
      el.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--text-muted)"><p style="font-size:1.2rem;margin-bottom:.5rem">No bookmarks yet</p><p style="font-size:.85rem">Save posts to read later!</p></div>';
      return;
    }
    el.innerHTML = bookmarked.map(p => renderPostCard(p)).join('');
    bindInteractions(el);
  }

  function bindInteractions(el) {
    el.querySelectorAll('.post-like-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.style.color = btn.style.color === 'rgb(212, 175, 55)' ? 'var(--text-secondary)' : 'var(--gold)';
        Notifications.showToast('Liked!', 'success');
      });
    });
    el.querySelectorAll('.post-bookmark-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const isBookmarked = btn.textContent.trim() === '🔖';
        btn.textContent = isBookmarked ? '📑' : '🔖';
        btn.style.color = isBookmarked ? 'var(--text-muted)' : 'var(--gold)';
        Notifications.showToast(isBookmarked ? 'Bookmark removed' : 'Bookmarked!', 'success');
      });
    });
  }

  return { render };
})();
