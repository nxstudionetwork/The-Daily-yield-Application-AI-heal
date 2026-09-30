var AboutPage = (() => {
  function renderAboutPage(content) {
    if (!content) return;
    content.innerHTML = `
      <div class="about-page fade-in">
        <section class="hero-section" style="text-align:center;padding:3rem 1rem;background:linear-gradient(135deg,rgba(59,130,246,.1),rgba(212,175,55,.08));border-radius:16px;margin-bottom:2rem">
          <div style="font-size:2.5rem;margin-bottom:.75rem">📰</div>
          <h1 style="font-size:2.2rem;font-weight:800;margin-bottom:.5rem">
            About <span class="gold-text">The Daily Yield</span>
          </h1>
          <p style="font-size:1.05rem;color:var(--text-muted);max-width:600px;margin:0 auto;line-height:1.6">
            The world's most intelligent news platform. Combining real-time market data, expert analysis, and AI-powered insights to keep you ahead of the curve.
          </p>
        </section>

        <section class="section" style="max-width:800px;margin:0 auto">
          <h2 class="section-title" style="text-align:center">Our Mission</h2>
          <div class="glass-card card-body" style="padding:2rem;text-align:center">
            <p style="font-size:1.05rem;line-height:1.8;color:rgba(255,255,255,.85)">
              We believe everyone deserves access to institutional-grade financial information. The Daily Yield was founded in 2022 with a simple mission:
              <strong style="color:var(--gold)"> democratize financial intelligence</strong>. We combine cutting-edge AI technology with
              expert journalism to deliver real-time insights that were once only available to Wall Street professionals.
            </p>
            <p style="font-size:1.05rem;line-height:1.8;color:rgba(255,255,255,.85);margin-top:1rem">
              From breaking news to deep market analysis, from portfolio tracking to AI-powered research — we put the power of
              <strong style="color:var(--blue)">professional-grade tools</strong> in your hands.
            </p>
          </div>
        </section>

        <section class="section" style="max-width:960px;margin:0 auto">
          <h2 class="section-title" style="text-align:center">Our Values</h2>
          <div class="grid grid-3" style="gap:1rem" id="about-values"></div>
        </section>

        <section class="section" style="max-width:960px;margin:0 auto">
          <h2 class="section-title" style="text-align:center">Meet the Team</h2>
          <div class="grid grid-3" style="gap:1.5rem" id="about-team"></div>
        </section>

        <section class="section" style="max-width:800px;margin:0 auto">
          <h2 class="section-title" style="text-align:center">In the Press</h2>
          <div id="about-press"></div>
        </section>

        <section class="section" style="max-width:700px;margin:0 auto;text-align:center">
          <h2 class="section-title">Join Our Team</h2>
          <div class="glass-card card-body" style="padding:2rem">
            <p style="font-size:.95rem;color:var(--text-muted);line-height:1.6;margin-bottom:1.25rem">
              We're always looking for talented people who are passionate about finance, technology, and journalism.
              If you want to help us build the future of financial media, we'd love to hear from you.
            </p>
            <div class="grid grid-2" style="gap:.75rem;margin-bottom:1.25rem">
              <div class="glass-subtle" style="padding:.85rem;border-radius:10px;text-align:left">
                <div style="font-weight:600;font-size:.88rem">Senior Frontend Engineer</div>
                <div style="font-size:.75rem;color:var(--text-muted)">Engineering · Remote · Full-time</div>
              </div>
              <div class="glass-subtle" style="padding:.85rem;border-radius:10px;text-align:left">
                <div style="font-weight:600;font-size:.88rem">Financial Journalist</div>
                <div style="font-size:.75rem;color:var(--text-muted)">Editorial · New York · Full-time</div>
              </div>
              <div class="glass-subtle" style="padding:.85rem;border-radius:10px;text-align:left">
                <div style="font-weight:600;font-size:.88rem">ML Engineer</div>
                <div style="font-size:.75rem;color:var(--text-muted)">AI Team · Remote · Full-time</div>
              </div>
              <div class="glass-subtle" style="padding:.85rem;border-radius:10px;text-align:left">
                <div style="font-weight:600;font-size:.88rem">Product Designer</div>
                <div style="font-size:.75rem;color:var(--text-muted)">Design · Mumbai · Full-time</div>
              </div>
            </div>
            <button class="btn btn-gold">View All Open Positions →</button>
          </div>
        </section>

        <section class="section" style="max-width:700px;margin:0 auto;text-align:center;padding:2rem;background:linear-gradient(135deg,rgba(212,175,55,.08),rgba(59,130,246,.06));border-radius:16px">
          <h3 style="font-size:1.3rem;font-weight:700;margin-bottom:.5rem">Ready to get started?</h3>
          <p style="font-size:.9rem;color:var(--text-muted);margin-bottom:1.25rem">Join 2 million investors and traders who trust The Daily Yield.</p>
          <a href="#/premium" class="btn btn-gold" data-route="/premium">Try Pro Free for 14 Days</a>
        </section>
      </div>
    `;
    renderValues();
    renderTeam();
    renderPress();
    Animations.scrollFade();
  }

  function renderValues() {
    var el = document.getElementById('about-values');
    if (!el) return;
    var values = [
      { icon: '🎯', title: 'Accuracy First', desc: 'Every data point is verified through multiple sources. We never compromise on accuracy — your financial decisions depend on it.' },
      { icon: '⚡', title: 'Speed Matters', desc: 'Markets move fast. We deliver breaking news and real-time data faster than anyone else. Every second counts in finance.' },
      { icon: '🔓', title: 'Transparency', desc: 'No hidden agendas, no pay-to-play coverage. Our editorial independence is non-negotiable. We disclose all conflicts of interest.' },
      { icon: '🤖', title: 'AI-Powered', desc: 'We leverage cutting-edge AI to analyze markets, detect patterns, and surface insights that humans might miss.' },
      { icon: '🌍', title: 'Global Perspective', desc: 'We cover markets across 50+ countries with local journalists and analysts who understand regional nuances.' },
      { icon: '👥', title: 'Community Driven', desc: 'Our community of 2 million investors and traders enriches every discussion with diverse perspectives and real-world experience.' }
    ];
    el.innerHTML = values.map(function(v) {
      return '<div class="glass-card card-body" style="padding:1.5rem;text-align:center">' +
        '<div style="font-size:2rem;margin-bottom:.65rem">' + v.icon + '</div>' +
        '<h3 style="font-size:1rem;font-weight:700;margin-bottom:.4rem">' + v.title + '</h3>' +
        '<p style="font-size:.82rem;color:var(--text-muted);line-height:1.55">' + v.desc + '</p>' +
      '</div>';
    }).join('');
  }

  function renderTeam() {
    var el = document.getElementById('about-team');
    if (!el) return;
    var team = [
      { name: 'Arjun Mehta', role: 'Founder & CEO', avatar: '👨‍💼', bio: 'Former Goldman Sachs VP. Built trading systems processing $2B+ daily. IIT Bombay, Wharton MBA.' },
      { name: 'Sarah Chen', role: 'Chief Technology Officer', avatar: '👩‍💻', bio: 'Ex-Google engineer. Led AI infrastructure at Bloomberg. Stanford CS PhD. 3 patents in NLP.' },
      { name: 'Priya Sharma', role: 'Head of Editorial', avatar: '✍️', bio: 'Former Reuters bureau chief. 15 years covering Asian markets. Peabody Award finalist.' },
      { name: 'David Park', role: 'Head of AI & Data', avatar: '🤖', bio: 'Ex-OpenAI researcher. MIT AI Lab alum. Published 20+ papers on financial NLP and market prediction.' },
      { name: 'Ananya Gupta', role: 'VP of Product', avatar: '🎨', bio: 'Former product lead at Stripe. Passionate about fintech UX. Built products used by 10M+ users.' },
      { name: 'Rahul Verma', role: 'Head of Markets', avatar: '📊', bio: '20-year veteran of Indian equity markets. Former fund manager at Kotak. CFA, FRM certified.' }
    ];
    el.innerHTML = team.map(function(t) {
      return '<div class="glass-card card-body" style="padding:1.5rem;text-align:center">' +
        '<div style="width:64px;height:64px;border-radius:50%;background:var(--glass-bg);display:flex;align-items:center;justify-content:center;font-size:2rem;margin:0 auto .75rem">' + t.avatar + '</div>' +
        '<h3 style="font-size:1rem;font-weight:700">' + t.name + '</h3>' +
        '<div style="font-size:.78rem;color:var(--gold);margin-bottom:.5rem">' + t.role + '</div>' +
        '<p style="font-size:.78rem;color:var(--text-muted);line-height:1.5">' + t.bio + '</p>' +
      '</div>';
    }).join('');
  }

  function renderPress() {
    var el = document.getElementById('about-press');
    if (!el) return;
    var mentions = [
      { outlet: 'The Wall Street Journal', quote: '"Daily Yield is what Bloomberg terminal dreams of being when it grows up — accessible, beautiful, and dangerously addictive."', date: 'March 2026' },
      { outlet: 'TechCrunch', quote: '"The fastest-growing financial news platform in Asia, with 2M MAU and growing 40% month-over-month."', date: 'February 2026' },
      { outlet: 'Forbes', quote: '"One of the Top 10 Fintech Startups to Watch in 2026. Daily Yield is democratizing institutional-grade market intelligence."', date: 'January 2026' },
      { outlet: 'Economic Times', quote: '"The app that every Indian investor has on their phone. Real-time, reliable, and remarkably well-designed."', date: 'December 2025' }
    ];
    el.innerHTML = mentions.map(function(m) {
      return '<div class="glass-card card-body" style="padding:1.25rem;margin-bottom:.75rem">' +
        '<div style="font-size:1.05rem;line-height:1.5;color:rgba(255,255,255,.85);font-style:italic;margin-bottom:.65rem">' + m.quote + '</div>' +
        '<div style="display:flex;justify-content:space-between;align-items:center">' +
          '<span style="font-weight:600;font-size:.85rem;color:var(--gold)">' + m.outlet + '</span>' +
          '<span style="font-size:.75rem;color:var(--text-muted)">' + m.date + '</span>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  return { render: renderAboutPage };
})();
