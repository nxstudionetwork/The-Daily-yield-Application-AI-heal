var PremiumPage = (() => {
  function renderPremiumPage(content) {
    if (!content) return;
    content.innerHTML = `
      <div class="premium-page fade-in">
        <section class="hero-section" style="text-align:center;padding:3rem 1rem;background:linear-gradient(135deg,rgba(212,175,55,.12),rgba(59,130,246,.08));border-radius:16px;margin-bottom:2rem">
          <div style="font-size:2.5rem;margin-bottom:.75rem">⭐</div>
          <h1 style="font-size:2.2rem;font-weight:800;margin-bottom:.5rem">
            Unlock the Full <span class="gold-text">Daily Yield</span> Experience
          </h1>
          <p style="font-size:1.05rem;color:var(--text-muted);max-width:560px;margin:0 auto;line-height:1.6">
            Get exclusive market insights, real-time alerts, ad-free browsing, and premium analysis from world-class financial journalists.
          </p>
        </section>

        <section class="section">
          <div class="grid grid-3" style="gap:1.5rem;max-width:960px;margin:0 auto" id="premium-tiers"></div>
        </section>

        <section class="section" style="max-width:960px;margin:0 auto">
          <h2 class="section-title" style="text-align:center">Feature Comparison</h2>
          <div id="premium-comparison"></div>
        </section>

        <section class="section" style="max-width:960px;margin:0 auto">
          <h2 class="section-title" style="text-align:center">What Our Users Say</h2>
          <div id="premium-testimonials"></div>
        </section>

        <section class="section" style="max-width:700px;margin:0 auto">
          <h2 class="section-title" style="text-align:center">Frequently Asked Questions</h2>
          <div id="premium-faq"></div>
        </section>
      </div>
    `;
    renderTiers();
    renderComparison();
    renderTestimonials();
    renderFAQ();
    Animations.scrollFade();
  }

  function renderTiers() {
    var el = document.getElementById('premium-tiers');
    if (!el) return;
    var tiers = [
      {
        name: 'Free',
        price: '$0',
        period: 'forever',
        color: 'var(--text-muted)',
        features: [
          'Access to all news articles',
          'Basic market data (15min delay)',
          'Community posts & polls',
          'Weather updates',
          '5 searches per day'
        ],
        cta: 'Current Plan',
        ctaClass: 'btn-outline',
        popular: false
      },
      {
        name: 'Pro',
        price: '$9.99',
        period: '/month',
        color: 'var(--gold)',
        features: [
          'Everything in Free',
          'Real-time market data & alerts',
          'Ad-free experience',
          'Premium research reports',
          'Portfolio tracking tools',
          'Unlimited searches',
          'Early access to breaking news',
          'Priority customer support'
        ],
        cta: 'Start 14-Day Free Trial',
        ctaClass: 'btn-gold',
        popular: true
      },
      {
        name: 'Enterprise',
        price: '$49.99',
        period: '/month',
        color: 'var(--blue)',
        features: [
          'Everything in Pro',
          'API access (10,000 calls/month)',
          'Custom dashboards & alerts',
          'Team collaboration (up to 10)',
          'Historical data access (10 years)',
          'White-label reports',
          'Dedicated account manager',
          'Custom integrations'
        ],
        cta: 'Contact Sales',
        ctaClass: 'btn-outline',
        popular: false
      }
    ];

    el.innerHTML = tiers.map(function(t) {
      var featuresHtml = t.features.map(function(f) {
        return '<div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.45rem;font-size:.85rem">' +
          '<span style="color:' + t.color + ';font-size:.75rem">✓</span>' +
          '<span>' + f + '</span>' +
        '</div>';
      }).join('');
      return '<div class="glass-card" style="padding:2rem;border-radius:16px;text-align:center;position:relative;border:' + (t.popular ? '2px solid var(--gold)' : '1px solid rgba(255,255,255,.08)') + '">' +
        (t.popular ? '<div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--gold);color:#000;padding:.2rem .85rem;border-radius:20px;font-size:.7rem;font-weight:700">MOST POPULAR</div>' : '') +
        '<div style="font-size:.85rem;font-weight:600;color:' + t.color + ';margin-bottom:.35rem">' + t.name + '</div>' +
        '<div style="margin-bottom:1.25rem"><span style="font-size:2.5rem;font-weight:800">' + t.price + '</span><span style="font-size:.85rem;color:var(--text-muted)">' + t.period + '</span></div>' +
        '<button class="btn ' + t.ctaClass + '" style="width:100%;margin-bottom:1.5rem">' + t.cta + '</button>' +
        '<div style="text-align:left">' + featuresHtml + '</div>' +
      '</div>';
    }).join('');
  }

  function renderComparison() {
    var el = document.getElementById('premium-comparison');
    if (!el) return;
    var features = [
      { name: 'News Articles', free: '✓ Unlimited', pro: '✓ Unlimited', enterprise: '✓ Unlimited' },
      { name: 'Market Data Delay', free: '15 minutes', pro: 'Real-time', enterprise: 'Real-time' },
      { name: 'Ad-Free Experience', free: '—', pro: '✓', enterprise: '✓' },
      { name: 'Breaking News Alerts', free: 'Basic', pro: 'Priority', enterprise: 'Priority + Custom' },
      { name: 'Research Reports', free: '—', pro: '✓ All Reports', enterprise: '✓ All + Custom' },
      { name: 'Portfolio Tracking', free: '1 portfolio', pro: '5 portfolios', enterprise: 'Unlimited' },
      { name: 'Searches Per Day', free: '5', pro: 'Unlimited', enterprise: 'Unlimited + API' },
      { name: 'API Access', free: '—', pro: '—', enterprise: '10,000/month' },
      { name: 'Team Collaboration', free: '—', pro: '—', enterprise: 'Up to 10 users' },
      { name: 'Historical Data', free: '30 days', pro: '2 years', enterprise: '10 years' },
      { name: 'Customer Support', free: 'Community', pro: 'Priority email', enterprise: 'Dedicated manager' },
      { name: 'Custom Dashboards', free: '—', pro: '—', enterprise: '✓' }
    ];

    el.innerHTML = '<div class="glass-card" style="border-radius:12px;overflow:hidden">' +
      '<table style="width:100%;border-collapse:collapse;font-size:.82rem">' +
      '<thead><tr style="border-bottom:1px solid rgba(255,255,255,.1)">' +
        '<th style="text-align:left;padding:.75rem 1rem;color:var(--text-muted);font-weight:500">Feature</th>' +
        '<th style="text-align:center;padding:.75rem .5rem;color:var(--text-muted);font-weight:500">Free</th>' +
        '<th style="text-align:center;padding:.75rem .5rem;color:var(--gold);font-weight:600">Pro</th>' +
        '<th style="text-align:center;padding:.75rem 1rem;color:var(--blue);font-weight:600">Enterprise</th>' +
      '</tr></thead><tbody>' +
      features.map(function(f) {
        return '<tr style="border-bottom:1px solid rgba(255,255,255,.05)">' +
          '<td style="padding:.6rem 1rem;font-weight:500">' + f.name + '</td>' +
          '<td style="text-align:center;padding:.6rem .5rem;color:' + (f.free === '—' ? 'var(--text-muted)' : 'rgba(255,255,255,.8)') + '">' + f.free + '</td>' +
          '<td style="text-align:center;padding:.6rem .5rem;color:' + (f.pro === '—' ? 'var(--text-muted)' : 'var(--gold)') + ';font-weight:' + (f.pro !== '—' ? '600' : '400') + '">' + f.pro + '</td>' +
          '<td style="text-align:center;padding:.6rem 1rem;color:' + (f.enterprise === '—' ? 'var(--text-muted)' : 'var(--blue)') + ';font-weight:' + (f.enterprise !== '—' ? '600' : '400') + '">' + f.enterprise + '</td>' +
        '</tr>';
      }).join('') +
      '</tbody></table></div>';
  }

  function renderTestimonials() {
    var el = document.getElementById('premium-testimonials');
    if (!el) return;
    var testimonials = [
      { name: 'Rajesh Mehta', role: 'Portfolio Manager', avatar: '👨‍💼', text: 'Daily Yield Pro has completely transformed how I track markets. The real-time alerts alone are worth the subscription. I catch market-moving events before my competitors.', rating: 5 },
      { name: 'Priya Sharma', role: 'Tech Analyst at Goldman Sachs', avatar: '👩‍💻', text: 'The research reports are exceptional. The depth of analysis on Indian markets is unmatched. I use it daily for my institutional recommendations.', rating: 5 },
      { name: 'Amit Kumar', role: 'Retail Investor', avatar: '🧑‍💻', text: 'Started with Free, upgraded to Pro within a week. The portfolio tracking and ad-free experience make it a no-brainer for serious investors.', rating: 5 },
      { name: 'Neha Gupta', role: 'Financial Journalist', avatar: '✍️', text: 'As a journalist, I need reliable, fast news. Daily Yield delivers breaking news before anyone else. The premium analysis saves me hours of research.', rating: 4 },
      { name: 'Sanjay Deshmukh', role: 'Fund Manager', avatar: '📊', text: 'The Enterprise API integration with our trading systems has been a game-changer. Real-time data feeds directly into our models.', rating: 5 },
      { name: 'Kavita Reddy', role: 'Crypto Trader', avatar: '🪙', text: 'Best crypto coverage I\'ve found in a news app. The combination of news and market data in one place is incredibly efficient.', rating: 4 }
    ];

    el.innerHTML = '<div class="grid grid-3" style="gap:1rem">' +
      testimonials.map(function(t) {
        var stars = '&#9733;'.repeat(t.rating) + '<span style="opacity:.3">' + '&#9733;'.repeat(5 - t.rating) + '</span>';
        return '<div class="glass-card card-body" style="padding:1.25rem">' +
          '<div style="color:var(--gold);font-size:.85rem;margin-bottom:.5rem">' + stars + '</div>' +
          '<p style="font-size:.85rem;line-height:1.55;color:rgba(255,255,255,.85);margin-bottom:.75rem">"' + t.text + '"</p>' +
          '<div style="display:flex;align-items:center;gap:.5rem">' +
            '<div style="width:36px;height:36px;border-radius:50%;background:var(--glass-bg);display:flex;align-items:center;justify-content:center;font-size:1rem">' + t.avatar + '</div>' +
            '<div>' +
              '<div style="font-size:.82rem;font-weight:600">' + t.name + '</div>' +
              '<div style="font-size:.7rem;color:var(--text-muted)">' + t.role + '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
      }).join('') +
    '</div>';
  }

  function renderFAQ() {
    var el = document.getElementById('premium-faq');
    if (!el) return;
    var faqs = [
      { q: 'Can I cancel my subscription at any time?', a: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period. No questions asked, no cancellation fees.' },
      { q: 'Is there a free trial for Pro?', a: 'Yes! We offer a 14-day free trial for Pro. You can access all Pro features during the trial period. You will not be charged until the trial ends and you choose to continue.' },
      { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, UPI, net banking, and PayPal. Enterprise plans also support wire transfers and purchase orders.' },
      { q: 'Can I switch between plans?', a: 'Absolutely. You can upgrade or downgrade your plan at any time. When upgrading, you\'ll be charged the prorated difference. When downgrading, the change takes effect at the next billing cycle.' },
      { q: 'Is my financial data secure?', a: 'Security is our top priority. We use bank-level 256-bit encryption, are SOC 2 Type II certified, and never share your personal or financial data with third parties. Your portfolio data never leaves our secure servers.' },
      { q: 'Do you offer refunds?', a: 'We offer a full refund within 7 days of purchase if you\'re not satisfied. For annual plans, we offer a prorated refund within the first 30 days.' },
      { q: 'How does the Enterprise API work?', a: 'Enterprise customers get access to our RESTful API with comprehensive documentation. You can pull real-time market data, news feeds, and research reports directly into your applications. Rate limits start at 10,000 calls/month.' }
    ];

    el.innerHTML = faqs.map(function(f, i) {
      return '<div class="glass-card" style="border-radius:12px;margin-bottom:.65rem;overflow:hidden">' +
        '<button class="faq-toggle" style="width:100%;text-align:left;padding:1rem 1.25rem;background:none;border:none;color:inherit;cursor:pointer;display:flex;justify-content:space-between;align-items:center" onclick="PremiumPage.toggleFAQ(this)">' +
          '<span style="font-size:.9rem;font-weight:600;padding-right:1rem">' + f.q + '</span>' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;transition:transform .3s"><polyline points="6 9 12 15 18 9"/></svg>' +
        '</button>' +
        '<div class="faq-answer" style="max-height:0;overflow:hidden;transition:max-height .3s ease">' +
          '<div style="padding:0 1.25rem 1rem;font-size:.85rem;line-height:1.6;color:var(--text-muted)">' + f.a + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function toggleFAQ(btn) {
    var answer = btn.nextElementSibling;
    var isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';
    var svg = btn.querySelector('svg');
    document.querySelectorAll('.faq-answer').forEach(function(a) { a.style.maxHeight = '0px'; });
    document.querySelectorAll('.faq-toggle svg').forEach(function(s) { s.style.transform = 'rotate(0deg)'; });
    if (!isOpen) {
      answer.style.maxHeight = answer.scrollHeight + 'px';
      if (svg) svg.style.transform = 'rotate(180deg)';
    }
  }

  return { render: renderPremiumPage, toggleFAQ: toggleFAQ };
})();
