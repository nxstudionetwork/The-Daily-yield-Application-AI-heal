const Animations = (() => {
  function scrollFade() {
    Utils.$$('.fade-in').forEach(el => {
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          obs.disconnect();
        }
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
      obs.observe(el);
    });
  }

  function showSkeleton(container, type = 'card') {
    if (!container) return;
    const templates = {
      card: '<div class="skeleton skeleton-card"><div class="skeleton-img"></div><div class="skeleton-text w80"></div><div class="skeleton-text w60"></div><div class="skeleton-text w40"></div></div>',
      list: '<div class="skeleton skeleton-list"><div class="skeleton-avatar"></div><div class="skeleton-lines"><div class="skeleton-text w80"></div><div class="skeleton-text w50"></div></div></div>',
      chart: '<div class="skeleton skeleton-chart"><div class="skeleton-text w40"></div><div class="skeleton-area"></div></div>',
      header: '<div class="skeleton skeleton-header"><div class="skeleton-text w60"></div><div class="skeleton-text w30"></div></div>',
      grid: '<div class="skeleton-grid">' + '<div class="skeleton skeleton-card"><div class="skeleton-img"></div><div class="skeleton-text w80"></div><div class="skeleton-text w50"></div></div>'.repeat(6) + '</div>'
    };
    const existing = container.innerHTML;
    container.dataset.prevContent = existing;
    container.innerHTML = templates[type] || templates.card;
    container.classList.add('skeleton-active');
  }

  function hideSkeleton(container) {
    if (!container) return;
    container.classList.remove('skeleton-active');
    if (container.dataset.prevContent) {
      container.innerHTML = container.dataset.prevContent;
      delete container.dataset.prevContent;
    }
  }

  function pageTransition(content, renderFn) {
    return new Promise(async resolve => {
      if (content) {
        content.style.opacity = '0';
        content.style.transform = 'translateY(12px) scale(0.99)';
        await new Promise(r => setTimeout(r, 250));
      }
      if (renderFn) await renderFn();
      if (content) {
        await new Promise(r => requestAnimationFrame(() => r()));
        content.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        content.style.opacity = '1';
        content.style.transform = 'translateY(0) scale(1)';
        setTimeout(() => { content.style.transition = ''; }, 400);
      }
      resolve();
    });
  }

  function initCounters() {
    Utils.$$('[data-count]').forEach(el => {
      const target = parseFloat(el.dataset.count);
      if (isNaN(target)) return;
      Utils.onVisible(el, () => Utils.animateCounter(el, target));
    });
  }

  function initRipples() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('.btn, .nav-item, .bottom-nav-item, .ripple-target');
      if (btn) Utils.addRipple(e, btn);
    });
  }

  function initCardTilt() {
    Utils.$$('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.01)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(600px) rotateY(0) rotateX(0) scale(1)';
        card.style.transition = 'transform 0.4s ease';
        setTimeout(() => { card.style.transition = ''; }, 400);
      });
    });
  }

  function animateProgress(bar, target, duration = 1200) {
    if (!bar) return;
    const start = parseFloat(bar.style.width) || 0;
    const diff = target - start;
    const startTime = performance.now();
    function step(now) {
      const elapsed = now - startTime;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      bar.style.width = (start + diff * eased) + '%';
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function stagger(items, delay = 60) {
    if (!items || !items.length) return;
    items.forEach((item, i) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(16px)';
      item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, i * delay);
    });
  }

  function drawSparkline(svgEl, data, color = '#d4a017', fillColor) {
    if (!svgEl || !data || data.length < 2) return;
    const w = svgEl.clientWidth || 200;
    const h = svgEl.clientHeight || 60;
    const pad = 4;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const step = (w - pad * 2) / (data.length - 1);

    const points = data.map((v, i) => {
      const x = pad + i * step;
      const y = pad + (1 - (v - min) / range) * (h - pad * 2);
      return { x, y };
    });

    const pathD = points.map((p, i) => (i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ');
    const fillD = pathD + ` L${points[points.length - 1].x.toFixed(1)},${h} L${points[0].x.toFixed(1)},${h} Z`;

    const isPositive = data[data.length - 1] >= data[0];
    const stroke = color || (isPositive ? 'var(--positive)' : 'var(--negative)');
    const fill = fillColor || (isPositive ? 'rgba(0,200,83,0.1)' : 'rgba(255,23,68,0.1)');

    svgEl.innerHTML = `
      <defs>
        <linearGradient id="sg-${svgEl.id || Date.now()}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${stroke}" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="${stroke}" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="${fillD}" fill="url(#sg-${svgEl.id || Date.now()})" opacity="0.6"/>
      <path d="${pathD}" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${points[points.length - 1].x}" cy="${points[points.length - 1].y}" r="2.5" fill="${stroke}"/>
    `;
  }

  function init() {
    scrollFade();
    initCounters();
    initRipples();
    initCardTilt();
  }

  function skeletonNews(container, count) {
    if (!container) return;
    const items = Array.from({ length: count || 4 }, () => `
      <div class="skeleton-card" style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1rem;overflow:hidden">
        <div class="skeleton-block skeleton-img" style="height:140px;border-radius:var(--radius);margin-bottom:0.75rem;background:linear-gradient(90deg,var(--bg-tertiary) 25%,var(--bg-elevated) 50%,var(--bg-tertiary) 75%);background-size:400px 100%;animation:skeleton-shimmer 1.5s ease-in-out infinite"></div>
        <div class="skeleton-block skeleton-text w80" style="height:12px;width:80%;margin-bottom:0.5rem;border-radius:4px;background:linear-gradient(90deg,var(--bg-tertiary) 25%,var(--bg-elevated) 50%,var(--bg-tertiary) 75%);background-size:400px 100%;animation:skeleton-shimmer 1.5s ease-in-out infinite"></div>
        <div class="skeleton-block skeleton-text w60" style="height:12px;width:60%;margin-bottom:0.5rem;border-radius:4px;background:linear-gradient(90deg,var(--bg-tertiary) 25%,var(--bg-elevated) 50%,var(--bg-tertiary) 75%);background-size:400px 100%;animation:skeleton-shimmer 1.5s ease-in-out infinite"></div>
        <div class="skeleton-block skeleton-text w40" style="height:10px;width:40%;border-radius:4px;background:linear-gradient(90deg,var(--bg-tertiary) 25%,var(--bg-elevated) 50%,var(--bg-tertiary) 75%);background-size:400px 100%;animation:skeleton-shimmer 1.5s ease-in-out infinite"></div>
      </div>
    `).join('');
    container.innerHTML = `<div class="card-grid" style="padding:1rem">${items}</div>`;
  }

  function skeletonGrid(container, count) {
    if (!container) return;
    const items = Array.from({ length: count || 6 }, () => `
      <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1rem;overflow:hidden">
        <div style="height:100px;border-radius:var(--radius);margin-bottom:0.75rem;background:linear-gradient(90deg,var(--bg-tertiary) 25%,var(--bg-elevated) 50%,var(--bg-tertiary) 75%);background-size:400px 100%;animation:skeleton-shimmer 1.5s ease-in-out infinite"></div>
        <div style="height:12px;width:75%;margin-bottom:0.5rem;border-radius:4px;background:linear-gradient(90deg,var(--bg-tertiary) 25%,var(--bg-elevated) 50%,var(--bg-tertiary) 75%);background-size:400px 100%;animation:skeleton-shimmer 1.5s ease-in-out infinite"></div>
        <div style="height:10px;width:50%;border-radius:4px;background:linear-gradient(90deg,var(--bg-tertiary) 25%,var(--bg-elevated) 50%,var(--bg-tertiary) 75%);background-size:400px 100%;animation:skeleton-shimmer 1.5s ease-in-out infinite"></div>
      </div>
    `).join('');
    container.innerHTML = `<div class="card-grid" style="padding:1rem">${items}</div>`;
  }

  return { scrollFade, showSkeleton, hideSkeleton, pageTransition, initCounters, initRipples, initCardTilt, animateProgress, stagger, drawSparkline, init, skeletonNews, skeletonGrid };
})();
