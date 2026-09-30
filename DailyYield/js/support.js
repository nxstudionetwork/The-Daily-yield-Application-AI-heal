var SupportPage = (() => {
  function renderSupportPage(content) {
    if (!content) return;
    content.innerHTML = `
      <div class="support-page fade-in">
        <div class="page-header" style="text-align:center;padding-bottom:1rem">
          <h1 class="page-title">Help & Support</h1>
          <p style="color:var(--text-muted);margin-top:.35rem">How can we help you today?</p>
        </div>

        <section class="section" style="max-width:600px;margin:0 auto 1.5rem">
          <div class="input-group" style="width:100%">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" style="margin-right:.5rem;flex-shrink:0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" class="input" placeholder="Search help articles..." id="support-search" style="width:100%;font-size:.9rem">
          </div>
        </section>

        <section class="section" style="max-width:960px;margin:0 auto">
          <div class="grid grid-4" style="gap:1rem" id="support-categories"></div>
        </section>

        <section class="section" style="max-width:700px;margin:0 auto">
          <h2 class="section-title">Frequently Asked Questions</h2>
          <div id="support-faq"></div>
        </section>

        <section class="section" style="max-width:700px;margin:0 auto">
          <div class="grid grid-2" style="gap:1.5rem">
            <div>
              <h2 class="section-title">Contact Us</h2>
              <div class="glass-card card-body" style="padding:1.5rem">
                <form id="support-form" onsubmit="return false">
                  <div style="margin-bottom:1rem">
                    <label style="font-size:.82rem;font-weight:600;display:block;margin-bottom:.35rem">Name</label>
                    <input type="text" class="input" placeholder="Your name" style="width:100%;font-size:.85rem">
                  </div>
                  <div style="margin-bottom:1rem">
                    <label style="font-size:.82rem;font-weight:600;display:block;margin-bottom:.35rem">Email</label>
                    <input type="email" class="input" placeholder="your@email.com" style="width:100%;font-size:.85rem">
                  </div>
                  <div style="margin-bottom:1rem">
                    <label style="font-size:.82rem;font-weight:600;display:block;margin-bottom:.35rem">Subject</label>
                    <select class="input" style="width:100%;font-size:.85rem">
                      <option>General Inquiry</option>
                      <option>Billing Issue</option>
                      <option>Technical Problem</option>
                      <option>Feature Request</option>
                      <option>Account Issue</option>
                    </select>
                  </div>
                  <div style="margin-bottom:1.25rem">
                    <label style="font-size:.82rem;font-weight:600;display:block;margin-bottom:.35rem">Message</label>
                    <textarea class="input" rows="4" placeholder="Describe your issue..." style="width:100%;font-size:.85rem;resize:vertical"></textarea>
                  </div>
                  <button type="submit" class="btn btn-gold" style="width:100%" onclick="SupportPage.submitForm()">Send Message</button>
                </form>
              </div>
            </div>

            <div>
              <h2 class="section-title">Other Ways to Reach Us</h2>
              <div class="glass-card card-body" style="padding:1.25rem;margin-bottom:1rem">
                <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:1rem">
                  <div style="width:40px;height:40px;border-radius:10px;background:rgba(0,200,83,.15);display:flex;align-items:center;justify-content:center;font-size:1.2rem">💬</div>
                  <div>
                    <div style="font-weight:600;font-size:.9rem">Live Chat</div>
                    <div style="font-size:.75rem;color:var(--green)">● Available now</div>
                  </div>
                </div>
                <p style="font-size:.82rem;color:var(--text-muted);line-height:1.5">Chat with our support team in real-time. Average response time: 2 minutes.</p>
                <button class="btn btn-gold btn-sm" style="width:100%;margin-top:.75rem" onclick="SupportPage.startChat()">Start Live Chat</button>
              </div>

              <div class="glass-card card-body" style="padding:1.25rem;margin-bottom:1rem">
                <div style="font-weight:600;font-size:.9rem;margin-bottom:.5rem">📧 Email Support</div>
                <p style="font-size:.82rem;color:var(--text-muted)">support@dailyyield.com</p>
                <p style="font-size:.75rem;color:var(--text-muted);margin-top:.25rem">Response within 24 hours</p>
              </div>

              <div class="glass-card card-body" style="padding:1.25rem">
                <div style="font-weight:600;font-size:.9rem;margin-bottom:.5rem">🌍 Community</div>
                <p style="font-size:.82rem;color:var(--text-muted);margin-bottom:.75rem">Join our community of 50,000+ investors and traders.</p>
                <div style="display:flex;gap:.5rem;flex-wrap:wrap">
                  <a href="#" class="btn btn-ghost btn-sm">Twitter/X</a>
                  <a href="#" class="btn btn-ghost btn-sm">Discord</a>
                  <a href="#" class="btn btn-ghost btn-sm">Reddit</a>
                  <a href="#" class="btn btn-ghost btn-sm">Telegram</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
    renderCategories();
    renderFAQ();
    Animations.scrollFade();
  }

  function renderCategories() {
    var el = document.getElementById('support-categories');
    if (!el) return;
    var categories = [
      { icon: '🚀', title: 'Getting Started', count: 12, color: 'var(--blue)' },
      { icon: '💳', title: 'Billing & Plans', count: 8, color: 'var(--gold)' },
      { icon: '📊', title: 'Markets & Data', count: 15, color: 'var(--green)' },
      { icon: '🔧', title: 'Technical Issues', count: 10, color: 'var(--red)' }
    ];
    el.innerHTML = categories.map(function(c) {
      return '<div class="glass-card card-body" style="padding:1.25rem;text-align:center;cursor:pointer;transition:transform .2s" onmouseover="this.style.transform=\'translateY(-3px)\'" onmouseout="this.style.transform=\'translateY(0)\'">' +
        '<div style="font-size:1.8rem;margin-bottom:.5rem">' + c.icon + '</div>' +
        '<div style="font-weight:600;font-size:.9rem;margin-bottom:.2rem">' + c.title + '</div>' +
        '<div style="font-size:.72rem;color:var(--text-muted)">' + c.count + ' articles</div>' +
      '</div>';
    }).join('');
  }

  function renderFAQ() {
    var el = document.getElementById('support-faq');
    if (!el) return;
    var faqs = [
      { q: 'How do I reset my password?', a: 'Click on "Forgot Password" on the login page. Enter your email address and we\'ll send you a link to reset your password. The link expires in 1 hour. If you don\'t receive the email, check your spam folder or contact support.' },
      { q: 'How do I cancel my subscription?', a: 'Go to Settings > Billing > Manage Subscription. Click "Cancel Subscription" and follow the prompts. Your access continues until the end of the current billing period. You can also contact us at support@dailyyield.com.' },
      { q: 'Why is my market data delayed?', a: 'Free accounts receive market data with a 15-minute delay. Upgrade to Pro for real-time data. If you\'re on Pro and still seeing delays, try refreshing the page or clearing your browser cache.' },
      { q: 'How do I enable push notifications?', a: 'Go to Settings > Notifications. Enable the notification types you want (Breaking News, Market Alerts, Portfolio Updates). You can customize quiet hours and delivery preferences. Make sure your browser allows notifications from DailyYield.' },
      { q: 'Can I use DailyYield on multiple devices?', a: 'Yes! Your account works across all devices - web, mobile browser, and tablet. Your settings, portfolio, and bookmarks sync automatically. Pro supports up to 5 simultaneous sessions.' },
      { q: 'How do I add stocks to my watchlist?', a: 'Navigate to Markets, find the stock you want to track, and click the "Add to Watchlist" button (bookmark icon). You can create multiple watchlists in the Portfolio section.' },
      { q: 'How accurate is the market data?', a: 'Our market data comes directly from major exchanges (NSE, BSE, NYSE, NASDAQ, LSE) through licensed data providers. Data is accurate to the millisecond for Pro users. Free accounts receive data with a 15-minute delay.' }
    ];

    el.innerHTML = faqs.map(function(f) {
      return '<div class="glass-card" style="border-radius:12px;margin-bottom:.65rem;overflow:hidden">' +
        '<button class="support-faq-toggle" style="width:100%;text-align:left;padding:1rem 1.25rem;background:none;border:none;color:inherit;cursor:pointer;display:flex;justify-content:space-between;align-items:center" onclick="SupportPage.toggleFAQ(this)">' +
          '<span style="font-size:.88rem;font-weight:600;padding-right:1rem">' + f.q + '</span>' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;transition:transform .3s"><polyline points="6 9 12 15 18 9"/></svg>' +
        '</button>' +
        '<div class="support-faq-answer" style="max-height:0;overflow:hidden;transition:max-height .3s ease">' +
          '<div style="padding:0 1.25rem 1rem;font-size:.84rem;line-height:1.6;color:var(--text-muted)">' + f.a + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function toggleFAQ(btn) {
    var answer = btn.nextElementSibling;
    var isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';
    var svg = btn.querySelector('svg');
    document.querySelectorAll('.support-faq-answer').forEach(function(a) { a.style.maxHeight = '0px'; });
    document.querySelectorAll('.support-faq-toggle svg').forEach(function(s) { s.style.transform = 'rotate(0deg)'; });
    if (!isOpen) {
      answer.style.maxHeight = answer.scrollHeight + 'px';
      if (svg) svg.style.transform = 'rotate(180deg)';
    }
  }

  function submitForm() {
    if (typeof Notifications !== 'undefined' && Notifications.showToast) {
      Notifications.showToast('Message sent successfully! We\'ll respond within 24 hours.', 'success');
    } else {
      alert('Message sent successfully!');
    }
  }

  function startChat() {
    if (typeof Notifications !== 'undefined' && Notifications.showToast) {
      Notifications.showToast('Live chat would open here. This is a demo.', 'info');
    } else {
      alert('Live chat would open here.');
    }
  }

  return { render: renderSupportPage, toggleFAQ: toggleFAQ, submitForm: submitForm, startChat: startChat };
})();
