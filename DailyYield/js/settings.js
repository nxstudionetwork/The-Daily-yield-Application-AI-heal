/* =====================================================================
   SETTINGS.JS — Comprehensive Settings Page
   ===================================================================== */
const Settings = (() => {
  const SECTIONS = [
    { id:'account',       icon:'👤', label:'Account' },
    { id:'notifications', icon:'🔔', label:'Notifications' },
    { id:'appearance',    icon:'🎨', label:'Appearance' },
    { id:'language',      icon:'🌐', label:'Language & Region' },
    { id:'privacy',       icon:'🔒', label:'Privacy & Security' },
    { id:'downloads',     icon:'📥', label:'Downloads & Storage' },
    { id:'accessibility', icon:'♿', label:'Accessibility' },
    { id:'premium',       icon:'⭐', label:'Premium' },
    { id:'about',         icon:'ℹ️', label:'About' },
    { id:'help',          icon:'💬', label:'Help & Feedback' },
  ];

  let active = 'account';

  function get(key, def) { return Utils.storage.get('settings_' + key, def); }
  function set(key, val) { Utils.storage.set('settings_' + key, val); }

  function render(content) {
    if (!content) return;
    content.innerHTML = `
      <div class="settings-page fade-in">
        <div class="page-header">
          <h1 class="page-title">Settings</h1>
        </div>
        <div class="settings-layout">
          <aside class="settings-sidebar" id="settings-sidebar">
            ${SECTIONS.map(s => `
              <button class="settings-sidebar-item ${s.id===active?'active':''}" data-section="${s.id}">
                <span class="settings-sidebar-icon">${s.icon}</span>
                <span class="settings-sidebar-label">${s.label}</span>
                <svg class="settings-sidebar-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>`).join('')}
          </aside>
          <div class="settings-main" id="settings-main"></div>
        </div>
      </div>`;
    renderSection(active);
    Utils.$$('.settings-sidebar-item').forEach(btn => {
      btn.addEventListener('click', () => {
        active = btn.dataset.section;
        Utils.$$('.settings-sidebar-item').forEach(b => b.classList.toggle('active', b === btn));
        renderSection(active);
        if (window.innerWidth < 900) {
          document.getElementById('settings-main')?.scrollIntoView({ behavior:'smooth' });
        }
      });
    });
    if (typeof Animations !== 'undefined') Animations.scrollFade();
  }

  function renderSection(id) {
    const el = document.getElementById('settings-main');
    if (!el) return;
    const map = {
      account: renderAccount, notifications: renderNotifications,
      appearance: renderAppearance, language: renderLanguage,
      privacy: renderPrivacy, downloads: renderDownloads,
      accessibility: renderAccessibility, premium: renderPremiumSection,
      about: renderAbout, help: renderHelp,
    };
    el.innerHTML = (map[id] || renderAccount)();
    bindSectionEvents(id);
  }

  function sectionWrap(title, content) {
    return `<div class="settings-section-card"><h2 class="settings-section-heading">${title}</h2>${content}</div>`;
  }
  function toggleRow(key, label, desc, def=false) {
    const checked = get(key, def) ? 'checked' : '';
    return `<div class="settings-row"><div class="settings-row-info"><div class="settings-row-label">${label}</div>${desc?`<div class="settings-row-desc">${desc}</div>`:''}</div><label class="toggle"><input type="checkbox" class="settings-toggle" data-key="${key}" ${checked}><span class="toggle-slider"></span></label></div>`;
  }
  function selectRow(key, label, options, def='') {
    const saved = get(key, def);
    return `<div class="settings-row"><div class="settings-row-info"><div class="settings-row-label">${label}</div></div><select class="select-input settings-select" data-key="${key}" style="width:auto;min-width:140px">${options.map(o=>`<option value="${o.value}" ${saved===o.value?'selected':''}>${o.label}</option>`).join('')}</select></div>`;
  }
  function btnRow(id, label, desc, btnLabel, cls='btn-outline') {
    return `<div class="settings-row"><div class="settings-row-info"><div class="settings-row-label">${label}</div>${desc?`<div class="settings-row-desc">${desc}</div>`:''}</div><button class="btn btn-sm ${cls}" id="settings-${id}">${btnLabel}</button></div>`;
  }

  function renderAccount() {
    const name  = Utils.storage.get('userName','User');
    const email = Utils.storage.get('userEmail','user@dailyyield.com');
    return sectionWrap('Account', `
      <div class="settings-profile-preview">
        <div class="settings-avatar">${(name||'U').charAt(0).toUpperCase()}</div>
        <div><div style="font-weight:700;font-size:0.95rem">${name}</div><div style="font-size:0.78rem;color:var(--text-muted)">${email}</div></div>
      </div>
      <div class="settings-form">
        <div class="form-group"><label>Display Name</label><input class="input" type="text" id="settings-name-input" value="${Utils.escapeHtml(name)}" placeholder="Your name"></div>
        <div class="form-group"><label>Email Address</label><input class="input" type="email" id="settings-email-input" value="${Utils.escapeHtml(email)}" placeholder="email@example.com"></div>
        <div class="form-group"><label>Bio</label><textarea class="input" id="settings-bio-input" rows="3" placeholder="Tell us about yourself...">${Utils.escapeHtml(get('bio',''))}</textarea></div>
        <button class="btn btn-gold" id="settings-save-profile">Save Changes</button>
      </div>`);
  }

  function renderNotifications() {
    return sectionWrap('Notifications', `
      ${toggleRow('notif_breaking', 'Breaking News', 'Instant alerts for major breaking stories', true)}
      ${toggleRow('notif_markets', 'Market Alerts', 'Price movements on your watchlist', true)}
      ${toggleRow('notif_ai', 'AI Daily Digest', 'Morning summary powered by AI', true)}
      ${toggleRow('notif_community', 'Community Replies', 'Replies and mentions in community', false)}
      ${toggleRow('notif_email', 'Email Newsletter', 'Weekly newsletter digest', false)}
      ${toggleRow('notif_premium', 'Premium Content', 'New exclusive articles and reports', true)}
      ${toggleRow('notif_push', 'Push Notifications', 'Browser push notifications', false)}
      <div class="settings-divider"></div>
      ${selectRow('notif_frequency', 'Alert Frequency', [{value:'realtime',label:'Real-time'},{value:'hourly',label:'Hourly Digest'},{value:'daily',label:'Daily Digest'}], 'realtime')}
      ${selectRow('notif_quiet_start', 'Quiet Hours Start', ['20:00','21:00','22:00','23:00'].map(t=>({value:t,label:t})), '22:00')}
      ${selectRow('notif_quiet_end', 'Quiet Hours End', ['06:00','07:00','08:00','09:00'].map(t=>({value:t,label:t})), '07:00')}`);
  }

  function renderAppearance() {
    const fs = get('fontSize', 16);
    return sectionWrap('Appearance', `
      <div class="settings-row"><div class="settings-row-info"><div class="settings-row-label">Theme</div><div class="settings-row-desc">Permanent premium dark theme</div></div><span style="padding:0.3rem 0.75rem;background:var(--accent-dim);color:var(--accent);border-radius:var(--radius-full);font-size:0.75rem;font-weight:700">Dark Mode ✓</span></div>
      <div class="settings-divider"></div>
      <div class="settings-row"><div class="settings-row-info"><div class="settings-row-label">Font Size</div><div class="settings-row-desc" id="settings-font-size-label">${fs}px</div></div><div style="display:flex;align-items:center;gap:0.75rem;flex-shrink:0"><span style="font-size:0.7rem;color:var(--text-muted)">A</span><input type="range" class="range-input" id="settings-font-range" min="12" max="20" value="${fs}" style="width:120px"><span style="font-size:1rem;color:var(--text-muted)">A</span></div></div>
      ${selectRow('density', 'Content Density', [{value:'compact',label:'Compact'},{value:'normal',label:'Normal'},{value:'comfortable',label:'Comfortable'}], 'normal')}
      ${toggleRow('animations', 'Animations', 'Enable page and UI animations', true)}
      ${toggleRow('blur_effects', 'Blur Effects', 'Glass blur backgrounds (performance sensitive)', true)}`);
  }

  function renderLanguage() {
    return sectionWrap('Language & Region', `
      ${selectRow('language', 'Display Language', [{value:'en',label:'English'},{value:'hi',label:'Hindi'},{value:'ta',label:'Tamil'},{value:'te',label:'Telugu'},{value:'bn',label:'Bengali'},{value:'mr',label:'Marathi'}], 'en')}
      ${selectRow('number_format', 'Number Format', [{value:'in',label:'Indian (1,00,000)'},{value:'intl',label:'International (100,000)'}], 'in')}
      ${selectRow('date_format', 'Date Format', [{value:'dmy',label:'DD/MM/YYYY'},{value:'mdy',label:'MM/DD/YYYY'},{value:'ymd',label:'YYYY-MM-DD'}], 'dmy')}
      ${selectRow('timezone', 'Timezone', [{value:'IST',label:'IST (UTC+5:30)'},{value:'EST',label:'EST (UTC-5)'},{value:'GMT',label:'GMT (UTC+0)'},{value:'CST',label:'CST (UTC+8)'}], 'IST')}
      ${selectRow('currency', 'Currency Display', [{value:'INR',label:'₹ Indian Rupee'},{value:'USD',label:'$ US Dollar'},{value:'EUR',label:'€ Euro'}], 'INR')}`);
  }

  function renderPrivacy() {
    return sectionWrap('Privacy & Security', `
      ${toggleRow('analytics', 'Usage Analytics', 'Help improve the app with anonymous usage data', true)}
      ${toggleRow('personalization', 'Personalised Feed', 'Tailor content based on your reading habits', true)}
      ${toggleRow('public_profile', 'Public Profile', 'Make your profile visible to other users', false)}
      ${toggleRow('2fa', 'Two-Factor Auth', 'Extra security for your account (simulated)', false)}
      <div class="settings-divider"></div>
      ${btnRow('clear-search', 'Clear Search History', 'Remove all saved search queries', 'Clear History')}
      ${btnRow('clear-cache', 'Clear Cache', 'Free up storage by clearing cached data', 'Clear Cache')}
      ${btnRow('export-data', 'Export Your Data', 'Download a copy of your data', 'Export')}
      ${btnRow('delete-account', 'Delete Account', 'Permanently remove your account and all data', 'Delete Account', 'btn-outline settings-danger-btn')}`);
  }

  function renderDownloads() {
    const cacheSize = (Math.random() * 50 + 10).toFixed(1);
    return sectionWrap('Downloads & Storage', `
      ${toggleRow('offline_reading', 'Offline Reading', 'Save articles for offline access', false)}
      ${toggleRow('auto_download', 'Auto-Download Articles', 'Automatically download top stories on Wi-Fi', false)}
      ${selectRow('image_quality', 'Image Quality', [{value:'low',label:'Low (Save Data)'},{value:'medium',label:'Medium'},{value:'high',label:'High'}], 'medium')}
      <div class="settings-divider"></div>
      <div class="settings-row"><div class="settings-row-info"><div class="settings-row-label">Cache Size</div><div class="settings-row-desc">${cacheSize} MB used</div></div><button class="btn btn-sm btn-outline" id="settings-clear-cache-btn">Clear Cache</button></div>
      <div class="settings-row"><div class="settings-row-info"><div class="settings-row-label">Saved Articles</div><div class="settings-row-desc">12 articles saved offline</div></div><button class="btn btn-sm btn-outline" id="settings-clear-saved-btn">Clear All</button></div>`);
  }

  function renderAccessibility() {
    return sectionWrap('Accessibility', `
      ${toggleRow('high_contrast', 'High Contrast', 'Increase contrast for better readability', false)}
      ${toggleRow('large_text', 'Large Text', 'Increase base font size', false)}
      ${toggleRow('reduce_motion', 'Reduce Motion', 'Minimise animations and transitions', false)}
      ${toggleRow('screen_reader', 'Screen Reader Mode', 'Optimise layout for screen readers', false)}
      ${toggleRow('focus_indicators', 'Focus Indicators', 'Show visible focus rings on all elements', true)}
      ${selectRow('contrast_level', 'Contrast Level', [{value:'normal',label:'Normal'},{value:'medium',label:'Medium'},{value:'high',label:'High'}], 'normal')}`);
  }

  function renderPremiumSection() {
    return sectionWrap('Premium', `
      <div style="text-align:center;padding:1.5rem 0">
        <div style="font-size:3rem;margin-bottom:0.75rem">⭐</div>
        <h3 style="font-size:1.25rem;font-weight:800;margin-bottom:0.5rem">Upgrade to <span class="gold-text">Pro</span></h3>
        <p style="color:var(--text-muted);font-size:0.88rem;max-width:400px;margin:0 auto 1.5rem">Real-time data, ad-free experience, premium research reports, and unlimited access to all features.</p>
        <a href="#/premium" class="btn btn-gold" data-route="/premium" style="font-size:0.95rem;padding:0.65rem 2rem">View Plans →</a>
      </div>
      <div class="settings-divider"></div>
      <div class="settings-row"><div class="settings-row-label">Current Plan</div><span style="color:var(--text-muted);font-size:0.85rem">Free</span></div>
      <div class="settings-row"><div class="settings-row-label">Member Since</div><span style="color:var(--text-muted);font-size:0.85rem">August 2026</span></div>`);
  }

  function renderAbout() {
    return sectionWrap('About', `
      <div class="about-section">
        <div class="about-logo">
          <svg width="64" height="64" viewBox="0 0 40 40"><defs><linearGradient id="about-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#d4a017"/><stop offset="100%" stop-color="#b8860b"/></linearGradient></defs><circle cx="20" cy="20" r="18" fill="url(#about-g)"/><polyline points="12 20 17 25 28 14" fill="none" stroke="#0a0a0a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <h2 style="font-size:1.5rem;font-weight:800;margin-bottom:0.25rem">Daily Yield</h2>
        <p class="about-tagline">One Platform. Unlimited Knowledge.</p>
        <p class="about-version">Version 2.0.0 (Build 2026.08)</p>
        <div class="about-links">
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Changelog</a>
          <a href="#">Licenses</a>
        </div>
        <p class="about-copy">© 2026 Daily Yield. All rights reserved.</p>
      </div>`);
  }

  function renderHelp() {
    return sectionWrap('Help & Feedback', `
      ${btnRow('goto-support', 'Help Centre', 'Browse articles and guides', 'Open Help Centre')}
      ${btnRow('rate-app', 'Rate the App', 'Enjoying Daily Yield? Leave a review', '⭐ Rate App')}
      ${btnRow('send-feedback', 'Send Feedback', 'Report a bug or suggest a feature', 'Send Feedback')}
      ${btnRow('goto-community', 'Join Community', '50,000+ investors and traders', 'Open Community')}
      <div class="settings-divider"></div>
      <div class="settings-row"><div class="settings-row-label">Contact Support</div><span style="color:var(--text-muted);font-size:0.82rem">support@dailyyield.com</span></div>
      <div class="settings-row"><div class="settings-row-label">Response Time</div><span style="color:var(--positive);font-size:0.82rem">Within 24 hours</span></div>`);
  }

  function bindSectionEvents(id) {
    Utils.$$('.settings-toggle').forEach(input => {
      input.addEventListener('change', e => {
        set(e.target.dataset.key, e.target.checked);
        if (e.target.dataset.key === 'high_contrast') document.body.classList.toggle('high-contrast', e.target.checked);
        if (e.target.dataset.key === 'reduce_motion') document.body.classList.toggle('reduce-motion', e.target.checked);
        if (typeof Notifications !== 'undefined') Notifications.showToast('Setting saved', 'success');
      });
    });
    Utils.$$('.settings-select').forEach(sel => {
      sel.addEventListener('change', e => {
        set(e.target.dataset.key, e.target.value);
        if (typeof Notifications !== 'undefined') Notifications.showToast('Setting saved', 'success');
      });
    });
    const fontRange = document.getElementById('settings-font-range');
    if (fontRange) fontRange.addEventListener('input', e => {
      const v = e.target.value;
      set('fontSize', v);
      document.documentElement.style.fontSize = v + 'px';
      const label = document.getElementById('settings-font-size-label');
      if (label) label.textContent = v + 'px';
    });
    const saveProfile = document.getElementById('settings-save-profile');
    if (saveProfile) saveProfile.addEventListener('click', () => {
      const name  = document.getElementById('settings-name-input')?.value.trim();
      const email = document.getElementById('settings-email-input')?.value.trim();
      const bio   = document.getElementById('settings-bio-input')?.value.trim();
      if (name) { Utils.storage.set('userName', name); Utils.storage.set('userEmail', email || ''); set('bio', bio || ''); }
      if (typeof App !== 'undefined') App.initProfile();
      if (typeof Notifications !== 'undefined') Notifications.showToast('Profile updated!', 'success');
    });
    document.getElementById('settings-clear-search')?.addEventListener('click', () => { Utils.storage.remove('searchHistory'); if (typeof Notifications !== 'undefined') Notifications.showToast('Search history cleared', 'success'); });
    document.getElementById('settings-clear-cache')?.addEventListener('click', () => { if (typeof Notifications !== 'undefined') Notifications.showToast('Cache cleared (2.4 MB freed)', 'success'); });
    document.getElementById('settings-clear-cache-btn')?.addEventListener('click', () => { if (typeof Notifications !== 'undefined') Notifications.showToast('Cache cleared', 'success'); });
    document.getElementById('settings-export-data')?.addEventListener('click', () => { if (typeof Notifications !== 'undefined') Notifications.showToast('Data export started — check your email', 'info'); });
    document.getElementById('settings-delete-account')?.addEventListener('click', () => { if (typeof Notifications !== 'undefined') Notifications.showToast('To delete your account, contact support@dailyyield.com', 'warning'); });
    document.getElementById('settings-goto-support')?.addEventListener('click', () => { if (typeof Router !== 'undefined') Router.navigate('/support'); });
    document.getElementById('settings-rate-app')?.addEventListener('click', () => { if (typeof Notifications !== 'undefined') Notifications.showToast('Thank you for your support! ⭐', 'success'); });
    document.getElementById('settings-send-feedback')?.addEventListener('click', () => { if (typeof Notifications !== 'undefined') Notifications.showToast('Feedback form would open here', 'info'); });
    document.getElementById('settings-goto-community')?.addEventListener('click', () => { if (typeof Router !== 'undefined') Router.navigate('/posts'); });
  }

  return { render };
})();
