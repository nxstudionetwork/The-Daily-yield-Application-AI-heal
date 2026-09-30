var VideoPlayerPage = (() => {
  function renderVideoPlayerPage(content) {
    if (!content) return;
    var videoId = extractVideoId();
    var video = getVideo(videoId);
    if (!video) {
      content.innerHTML = '<div class="error-page" style="text-align:center;padding:4rem 1rem">' +
        '<div style="font-size:3rem;margin-bottom:1rem">🎬</div>' +
        '<h2>Video Not Found</h2>' +
        '<p style="color:var(--text-muted);margin-top:.5rem">The video you\'re looking for doesn\'t exist.</p>' +
        '<a href="#/videos" class="btn btn-gold" style="margin-top:1rem" data-route="/videos">Browse Videos</a>' +
      '</div>';
      return;
    }

    content.innerHTML = `
      <div class="video-player-page fade-in" style="max-width:1100px;margin:0 auto">
        <div style="margin-bottom:1rem">
          <a href="#/videos" class="btn btn-ghost btn-sm" data-route="/videos" style="color:var(--text-muted)">
            ← Back to Videos
          </a>
        </div>

        <div style="display:grid;grid-template-columns:1fr 340px;gap:1.5rem;align-items:start">
          <div>
            <div class="glass-card" style="border-radius:12px;overflow:hidden;margin-bottom:1.25rem">
              <div style="position:relative;width:100%;padding-top:56.25%;background:#000">
                <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1rem">
                  <div style="width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .3s" onmouseover="this.style.background='rgba(212,175,55,.3)';this.style.transform='scale(1.1)'" onmouseout="this.style.background='rgba(255,255,255,.15)';this.style.transform='scale(1)'">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="white"><polygon points="8,5 19,12 8,19"/></svg>
                  </div>
                  ${video.isLive ? '<span class="badge badge-live" style="font-size:.85rem;padding:.35rem .85rem">LIVE</span>' : '<span style="font-size:.85rem;color:var(--text-muted)">' + video.duration + '</span>'}
                </div>
                <div style="position:absolute;top:1rem;left:1rem;display:flex;gap:.5rem">
                  ${video.isLive ? '<span class="badge badge-live">LIVE NOW</span>' : ''}
                  <span class="badge badge-blue">${video.category}</span>
                </div>
              </div>
            </div>

            <h1 style="font-size:1.4rem;font-weight:700;line-height:1.35;margin-bottom:.75rem">${Utils.escapeHtml(video.title)}</h1>

            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.75rem;margin-bottom:1rem;padding-bottom:1rem;border-bottom:1px solid rgba(255,255,255,.08)">
              <div style="display:flex;align-items:center;gap:.75rem">
                <div style="width:40px;height:40px;border-radius:50%;background:var(--glass-bg);display:flex;align-items:center;justify-content:center;font-size:1.2rem">${video.channelAvatar}</div>
                <div>
                  <div style="font-weight:600;font-size:.9rem">${video.channel}</div>
                  <div style="font-size:.75rem;color:var(--text-muted)">${video.channelSubs} subscribers</div>
                </div>
                <button class="btn btn-gold btn-sm">Subscribe</button>
              </div>
              <div style="display:flex;gap:.5rem">
                <button class="btn btn-ghost btn-sm">❤️ ${video.likes}</button>
                <button class="btn btn-ghost btn-sm">↗️ Share</button>
                <button class="btn btn-ghost btn-sm">🔖 Save</button>
              </div>
            </div>

            <div class="glass-card card-body" style="padding:1rem;margin-bottom:1.25rem">
              <div style="font-size:.82rem;color:var(--text-muted);margin-bottom:.5rem">${video.views} views · ${Utils.timeAgo(video.uploadDate)}</div>
              <div style="font-size:.88rem;line-height:1.6;color:rgba(255,255,255,.85)">${Utils.escapeHtml(video.description)}</div>
              <div style="display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.75rem">
                ${(video.tags || []).map(t => '<span class="tag">#' + Utils.escapeHtml(t) + '</span>').join('')}
              </div>
            </div>

            <div style="margin-top:1.5rem">
              <h3 style="font-size:1rem;font-weight:600;margin-bottom:1rem">Comments</h3>
              <div id="vp-comments"></div>
            </div>
          </div>

          <aside>
            <h3 style="font-size:.9rem;font-weight:600;margin-bottom:.75rem">Up Next</h3>
            <div id="vp-related"></div>
          </aside>
        </div>
      </div>
    `;
    renderRelated(video);
    renderComments();
    Animations.scrollFade();
  }

  function extractVideoId() {
    var hash = window.location.hash || '';
    var parts = hash.split('/');
    var last = parts[parts.length - 1];
    if (last && last.indexOf('?') !== -1) last = last.split('?')[0];
    if (last && last.length > 2) return last;
    return 'v001';
  }

  function getVideo(id) {
    if (typeof VideosData !== 'undefined' && VideosData.getById) {
      var found = VideosData.getById(id);
      if (found) return found;
    }
    if (typeof VideosData !== 'undefined' && VideosData.videos && VideosData.videos.length) {
      return VideosData.videos[0];
    }
    return null;
  }

  function renderRelated(currentVideo) {
    var el = document.getElementById('vp-related');
    if (!el || typeof VideosData === 'undefined') return;
    var related = VideosData.videos.filter(function(v) { return v.id !== currentVideo.id; }).slice(0, 12);
    el.innerHTML = related.map(function(v) {
      return '<div style="display:flex;gap:.65rem;margin-bottom:.85rem;cursor:pointer" onclick="Router.navigate(\'/videos\')">' +
        '<div style="width:120px;height:68px;border-radius:8px;background:var(--glass-bg);display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0;position:relative">' +
          (v.thumbnail || '🎬') +
          '<span style="position:absolute;bottom:4px;right:4px;background:rgba(0,0,0,.8);color:#fff;font-size:.6rem;padding:1px 4px;border-radius:3px">' + v.duration + '</span>' +
        '</div>' +
        '<div style="flex:1;min-width:0">' +
          '<div style="font-size:.78rem;font-weight:600;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">' + Utils.escapeHtml(v.title) + '</div>' +
          '<div style="font-size:.7rem;color:var(--text-muted);margin-top:3px">' + v.channel + '</div>' +
          '<div style="font-size:.7rem;color:var(--text-muted)">' + v.views + ' views · ' + Utils.timeAgo(v.uploadDate) + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function renderComments() {
    var el = document.getElementById('vp-comments');
    if (!el) return;
    var mockComments = [
      { author: 'FinanceGuru', avatar: '📈', time: '1h ago', text: 'Great breakdown! This really helped me understand the market implications.', likes: 234 },
      { author: 'CryptoNerd', avatar: '🪙', time: '2h ago', text: 'Can you do a follow-up video on how this affects crypto markets specifically?', likes: 89 },
      { author: 'NewsJunkie', avatar: '📰', time: '3h ago', text: 'Best coverage I\'ve seen on this topic. Shared with my entire network.', likes: 56 },
      { author: 'InvestorPro', avatar: '💹', time: '5h ago', text: 'The analysis is spot on. I\'m adjusting my portfolio based on these insights.', likes: 123 },
      { author: 'StudentEcon', avatar: '🎓', time: '6h ago', text: 'As an economics student, this is exactly the kind of real-world analysis we need in classrooms.', likes: 45 }
    ];
    el.innerHTML = mockComments.map(function(c) {
      return '<div style="display:flex;gap:.65rem;padding:.75rem 0;border-bottom:1px solid rgba(255,255,255,.05)">' +
        '<div style="width:32px;height:32px;border-radius:50%;background:var(--glass-bg);display:flex;align-items:center;justify-content:center;font-size:.9rem;flex-shrink:0">' + c.avatar + '</div>' +
        '<div>' +
          '<div style="display:flex;align-items:center;gap:.4rem">' +
            '<span style="font-size:.78rem;font-weight:600">' + c.author + '</span>' +
            '<span style="font-size:.68rem;color:var(--text-muted)">' + c.time + '</span>' +
          '</div>' +
          '<div style="font-size:.82rem;margin-top:.25rem;color:rgba(255,255,255,.8)">' + c.text + '</div>' +
          '<div style="margin-top:.3rem;font-size:.72rem;color:var(--text-muted)">❤️ ' + c.likes + ' · Reply</div>' +
        '</div>' +
      '</div>';
    }).join('') +
    '<div style="display:flex;gap:.65rem;margin-top:.75rem">' +
      '<div style="width:32px;height:32px;border-radius:50%;background:var(--glass-bg);display:flex;align-items:center;justify-content:center;font-size:.9rem;flex-shrink:0">🧑‍💼</div>' +
      '<input type="text" class="input" placeholder="Add a comment..." style="flex:1;font-size:.82rem">' +
    '</div>';
  }

  return { render: renderVideoPlayerPage };
})();
