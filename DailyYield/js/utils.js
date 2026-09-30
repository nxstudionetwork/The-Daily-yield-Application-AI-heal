const Utils = (() => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function el(tag, attrs = {}, children = []) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'className') e.className = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
      else if (k === 'dataset' && typeof v === 'object') Object.assign(e.dataset, v);
      else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === 'html') e.innerHTML = v;
      else if (k === 'text') e.textContent = v;
      else e.setAttribute(k, v);
    }
    for (const child of children) {
      if (typeof child === 'string') e.appendChild(document.createTextNode(child));
      else if (child instanceof Node) e.appendChild(child);
    }
    return e;
  }

  function formatNumber(n) {
    if (n == null) return '0';
    if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(1) + 'B';
    if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return n.toLocaleString();
  }

  function formatCurrency(n, currency = 'USD', compact = false) {
    if (n == null) return '$0.00';
    const opts = { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 };
    if (compact && Math.abs(n) >= 1e6) {
      opts.notation = 'compact';
      opts.compactDisplay = 'short';
    }
    try {
      return new Intl.NumberFormat('en-US', opts).format(n);
    } catch {
      return '$' + Number(n).toFixed(2);
    }
  }

  function formatChange(change, pct) {
    if (change == null) return { text: '0.00', cls: 'neutral', arrow: '' };
    const num = Number(change);
    const sign = num >= 0 ? '+' : '';
    const pctStr = pct != null ? ` (${sign}${Number(pct).toFixed(2)}%)` : '';
    return {
      text: `${sign}${num.toFixed(2)}${pctStr}`,
      cls: num > 0 ? 'positive' : num < 0 ? 'negative' : 'neutral',
      arrow: num > 0 ? '▲' : num < 0 ? '▼' : '●'
    };
  }

  function timeAgo(date) {
    const now = Date.now();
    const d = date instanceof Date ? date : new Date(date);
    const diff = (now - d.getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
    if (diff < 2592000) return Math.floor(diff / 604800) + 'w ago';
    if (diff < 31536000) return Math.floor(diff / 2592000) + 'mo ago';
    return Math.floor(diff / 31536000) + 'y ago';
  }

  function formatDate(date, opts = {}) {
    const d = date instanceof Date ? date : new Date(date);
    const defaults = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return d.toLocaleDateString('en-US', { ...defaults, ...opts });
  }

  const storage = {
    get(key, fallback = null) {
      try {
        const v = localStorage.getItem('dy_' + key);
        return v !== null ? JSON.parse(v) : fallback;
      } catch { return fallback; }
    },
    set(key, val) {
      try { localStorage.setItem('dy_' + key, JSON.stringify(val)); } catch {}
    },
    remove(key) {
      try { localStorage.removeItem('dy_' + key); } catch {}
    }
  };

  function debounce(fn, ms = 300) {
    let t;
    return function (...args) { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), ms); };
  }

  function throttle(fn, ms = 100) {
    let last = 0, t;
    return function (...args) {
      const now = Date.now();
      if (now - last >= ms) { last = now; fn.apply(this, args); }
      else { clearTimeout(t); t = setTimeout(() => { last = Date.now(); fn.apply(this, args); }, ms - (now - last)); }
    };
  }

  function addRipple(e, targetEl) {
    const target = targetEl || e.currentTarget;
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const ripple = Utils.el('span', { className: 'ripple', style: { width: size + 'px', height: size + 'px', left: x + 'px', top: y + 'px' } });
    target.style.position = 'relative';
    target.style.overflow = 'hidden';
    target.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }

  function animateCounter(el, target, duration = 1500) {
    const start = parseFloat(el.textContent) || 0;
    const diff = target - start;
    const startTime = performance.now();
    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (start + diff * eased).toFixed(target % 1 ? 2 : 0);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function onVisible(el, callback, opts = {}) {
    if (!el) return () => {};
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { callback(entry); if (!opts.repeat) observer.disconnect(); }
    }, { threshold: opts.threshold || 0.1, rootMargin: opts.rootMargin || '0px' });
    observer.observe(el);
    return () => observer.disconnect();
  }

  function placeholderImg(w = 400, h = 250, text = '') {
    return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect fill="%23111" width="${w}" height="${h}"/><text fill="%23444" font-family="sans-serif" font-size="14" text-anchor="middle" x="${w/2}" y="${h/2}">${text || w+'×'+h}</text></svg>`)}`;
  }

  function pick(obj, keys) {
    const out = {};
    for (const k of keys) if (k in obj) out[k] = obj[k];
    return out;
  }

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  return { $, $$, el, formatNumber, formatCurrency, formatChange, timeAgo, formatDate, storage, debounce, throttle, addRipple, animateCounter, onVisible, placeholderImg, pick, clamp, uid, capitalize, escapeHtml };
})();
