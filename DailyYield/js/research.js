var ResearchPage = (() => {
  function renderResearchPage(content) {
    if (!content) return;
    content.innerHTML = `
      <div class="research-page fade-in">
        <div class="page-header">
          <h1 class="page-title">Research & Analysis</h1>
          <div class="page-actions">
            <div class="input-group" style="max-width:280px">
              <input type="text" class="input" placeholder="Search companies, tickers..." id="research-search" style="font-size:.85rem">
            </div>
          </div>
        </div>

        <section class="section">
          <div class="grid grid-4" style="gap:1rem" id="research-ratings"></div>
        </section>

        <section class="section">
          <h2 class="section-title">Economic Calendar</h2>
          <div id="research-calendar"></div>
        </section>

        <section class="section">
          <h2 class="section-title">Sector Analysis</h2>
          <div class="grid grid-3" id="research-sectors"></div>
        </section>

        <section class="section">
          <h2 class="section-title">Company Research</h2>
          <div id="research-companies"></div>
        </section>

        <section class="section">
          <h2 class="section-title">Latest Research Reports</h2>
          <div id="research-reports"></div>
        </section>
      </div>
    `;
    renderAnalystRatings();
    renderCalendar();
    renderSectors();
    renderCompanies();
    renderReports();
    bindSearch();
    Animations.scrollFade();
  }

  function renderAnalystRatings() {
    var el = document.getElementById('research-ratings');
    if (!el || typeof CompaniesData === 'undefined') return;
    var topCompanies = CompaniesData.getTopByMarketCap(4);
    el.innerHTML = topCompanies.map(function(c) {
      var ratingColor = c.rating === 'BUY' ? 'var(--green)' : c.rating === 'HOLD' ? '#FFC107' : 'var(--red)';
      return '<div class="glass-card card-body" style="padding:1.25rem;text-align:center">' +
        '<div style="font-size:1.5rem;margin-bottom:.25rem">' + c.ticker.charAt(0) + '</div>' +
        '<div style="font-weight:700;font-size:.9rem">' + c.ticker + '</div>' +
        '<div style="font-size:.72rem;color:var(--text-muted);margin:.2rem 0">' + c.sector + '</div>' +
        '<div style="font-size:1.3rem;font-weight:800;margin:.5rem 0">' + c.marketCap + '</div>' +
        '<div style="display:inline-block;padding:.2rem .7rem;border-radius:20px;font-size:.72rem;font-weight:700;color:' + ratingColor + ';border:1px solid ' + ratingColor + '">' + c.rating + '</div>' +
        '<div style="font-size:.7rem;color:var(--text-muted);margin-top:.35rem">' + c.analysts + ' analysts</div>' +
      '</div>';
    }).join('');
  }

  function renderCalendar() {
    var el = document.getElementById('research-calendar');
    if (!el || typeof EventsData === 'undefined') return;
    var events = EventsData.getRecent(12);
    el.innerHTML = '<div class="glass-card" style="border-radius:12px;overflow:hidden">' +
      '<table style="width:100%;border-collapse:collapse;font-size:.82rem">' +
      '<thead><tr style="border-bottom:1px solid rgba(255,255,255,.1)">' +
        '<th style="text-align:left;padding:.65rem 1rem;color:var(--text-muted);font-weight:500">Date</th>' +
        '<th style="text-align:left;padding:.65rem .75rem;color:var(--text-muted);font-weight:500">Event</th>' +
        '<th style="text-align:left;padding:.65rem .75rem;color:var(--text-muted);font-weight:500">Country</th>' +
        '<th style="text-align:right;padding:.65rem .75rem;color:var(--text-muted);font-weight:500">Actual</th>' +
        '<th style="text-align:right;padding:.65rem .75rem;color:var(--text-muted);font-weight:500">Forecast</th>' +
        '<th style="text-align:right;padding:.65rem 1rem;color:var(--text-muted);font-weight:500">Impact</th>' +
      '</tr></thead><tbody>' +
      events.map(function(ev) {
        var impColor = ev.importance === 'high' ? 'var(--gold)' : ev.importance === 'medium' ? '#FFC107' : 'var(--text-muted)';
        var impDots = ev.importance === 'high' ? '●●●' : ev.importance === 'medium' ? '●●○' : '●○○';
        var impactColor = ev.impact === 'Bullish' ? 'var(--green)' : ev.impact === 'Bearish' ? 'var(--red)' : 'var(--text-muted)';
        return '<tr style="border-bottom:1px solid rgba(255,255,255,.05)">' +
          '<td style="padding:.6rem 1rem;color:var(--text-muted);white-space:nowrap">' + ev.date + '</td>' +
          '<td style="padding:.6rem .75rem"><div style="font-weight:600">' + ev.title + '</div><div style="font-size:.7rem;color:var(--text-muted)">' + ev.category + '</div></td>' +
          '<td style="padding:.6rem .75rem;color:var(--text-muted)">' + ev.country + '</td>' +
          '<td style="text-align:right;padding:.6rem .75rem;font-weight:600">' + ev.actual + '</td>' +
          '<td style="text-align:right;padding:.6rem .75rem;color:var(--text-muted)">' + ev.forecast + '</td>' +
          '<td style="text-align:right;padding:.6rem 1rem"><span style="color:' + impColor + ';font-size:.7rem;margin-right:.35rem">' + impDots + '</span><span style="color:' + impactColor + '">' + ev.impact + '</span></td>' +
        '</tr>';
      }).join('') +
      '</tbody></table></div>';
  }

  function renderSectors() {
    var el = document.getElementById('research-sectors');
    if (!el || typeof MarketsData === 'undefined') return;
    el.innerHTML = MarketsData.sectors.map(function(s) {
      var changeColor = s.change >= 0 ? 'var(--green)' : 'var(--red)';
      var ytdColor = s.performance.ytd >= 0 ? 'var(--green)' : 'var(--red)';
      return '<div class="glass-card card-body" style="padding:1.25rem">' +
        '<div style="display:flex;justify-content:space-between;align-items:start">' +
          '<div style="font-weight:700;font-size:.95rem">' + s.name + '</div>' +
          '<span style="font-weight:700;color:' + changeColor + '">' + (s.change >= 0 ? '+' : '') + s.change.toFixed(2) + '%</span>' +
        '</div>' +
        '<div style="font-size:.75rem;color:var(--text-muted);margin-top:.2rem">Market Cap: ' + s.marketCap + '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:.5rem;margin-top:.75rem;font-size:.72rem">' +
          '<div><div style="color:var(--text-muted)">1D</div><div style="font-weight:600;color:' + (s.performance.daily >= 0 ? 'var(--green)' : 'var(--red)') + '">' + (s.performance.daily >= 0 ? '+' : '') + s.performance.daily.toFixed(2) + '%</div></div>' +
          '<div><div style="color:var(--text-muted)">1W</div><div style="font-weight:600;color:' + (s.performance.weekly >= 0 ? 'var(--green)' : 'var(--red)') + '">' + (s.performance.weekly >= 0 ? '+' : '') + s.performance.weekly.toFixed(2) + '%</div></div>' +
          '<div><div style="color:var(--text-muted)">1M</div><div style="font-weight:600;color:' + (s.performance.monthly >= 0 ? 'var(--green)' : 'var(--red)') + '">' + (s.performance.monthly >= 0 ? '+' : '') + s.performance.monthly.toFixed(2) + '%</div></div>' +
          '<div><div style="color:var(--text-muted)">YTD</div><div style="font-weight:600;color:' + ytdColor + '">' + (s.performance.ytd >= 0 ? '+' : '') + s.performance.ytd.toFixed(2) + '%</div></div>' +
        '</div>' +
        '<div style="margin-top:.65rem;font-size:.72rem;color:var(--text-muted)">Leaders: <strong style="color:rgba(255,255,255,.8)">' + s.leaders.join(', ') + '</strong></div>' +
      '</div>';
    }).join('');
  }

  function renderCompanies() {
    var el = document.getElementById('research-companies');
    if (!el || typeof CompaniesData === 'undefined') return;
    var companies = CompaniesData.companies.slice(0, 10);
    el.innerHTML = '<div class="glass-card" style="border-radius:12px;overflow:hidden">' +
      '<table style="width:100%;border-collapse:collapse;font-size:.82rem">' +
      '<thead><tr style="border-bottom:1px solid rgba(255,255,255,.1)">' +
        '<th style="text-align:left;padding:.65rem 1rem;color:var(--text-muted);font-weight:500">Company</th>' +
        '<th style="text-align:left;padding:.65rem .75rem;color:var(--text-muted);font-weight:500">Sector</th>' +
        '<th style="text-align:right;padding:.65rem .75rem;color:var(--text-muted);font-weight:500">Market Cap</th>' +
        '<th style="text-align:right;padding:.65rem .75rem;color:var(--text-muted);font-weight:500">Revenue</th>' +
        '<th style="text-align:right;padding:.65rem .75rem;color:var(--text-muted);font-weight:500">CEO</th>' +
        '<th style="text-align:center;padding:.65rem 1rem;color:var(--text-muted);font-weight:500">Rating</th>' +
      '</tr></thead><tbody>' +
      companies.map(function(c) {
        var ratingColor = c.rating === 'BUY' ? 'var(--green)' : c.rating === 'HOLD' ? '#FFC107' : 'var(--red)';
        return '<tr style="border-bottom:1px solid rgba(255,255,255,.05);cursor:pointer">' +
          '<td style="padding:.65rem 1rem"><div style="font-weight:600">' + c.ticker + '</div><div style="font-size:.7rem;color:var(--text-muted)">' + c.name + '</div></td>' +
          '<td style="padding:.65rem .75rem;color:var(--text-muted)">' + c.sector + '</td>' +
          '<td style="text-align:right;padding:.65rem .75rem;font-weight:600">' + c.marketCap + '</td>' +
          '<td style="text-align:right;padding:.65rem .75rem;color:var(--text-muted)">' + c.revenue + '</td>' +
          '<td style="text-align:right;padding:.65rem .75rem;color:var(--text-muted)">' + c.ceo + '</td>' +
          '<td style="text-align:center;padding:.65rem 1rem"><span style="color:' + ratingColor + ';font-weight:700;font-size:.78rem;padding:.15rem .5rem;border:1px solid ' + ratingColor + ';border-radius:12px">' + c.rating + '</span></td>' +
        '</tr>';
      }).join('') +
      '</tbody></table></div>';
  }

  function renderReports() {
    var el = document.getElementById('research-reports');
    if (!el) return;
    var reports = [
      { title: 'Q2 2026 Earnings Preview: Tech Sector Resilience', firm: 'Goldman Sachs Research', date: 'Jul 10, 2026', rating: 'Overweight', sector: 'Technology', summary: 'We expect tech earnings to grow 18% YoY, driven by AI-related capex and cloud revenue acceleration.' },
      { title: 'India Banking Sector: Rate Cut Cycle Beneficiaries', firm: 'Morgan Stanley', date: 'Jul 9, 2026', rating: 'Overweight', sector: 'Financials', summary: 'RBI rate cuts to boost credit growth. Top picks: HDFC Bank, ICICI Bank, and Bajaj Finance.' },
      { title: 'AI Semiconductor Demand: Beyond the Hype Cycle', firm: 'J.P. Morgan', date: 'Jul 8, 2026', rating: 'Neutral', sector: 'Technology', summary: 'AI chip demand remains robust but valuation multiples suggest limited upside from current levels.' },
      { title: 'Gold & Commodities: Safe Haven Rotation', firm: 'UBS Global Research', date: 'Jul 7, 2026', rating: 'Buy', sector: 'Commodities', summary: 'Central bank buying and geopolitical risks support gold above $3,200. Silver poised for catch-up trade.' },
      { title: 'Indian IT Services: AI Threat or Opportunity?', firm: 'CLSA', date: 'Jul 6, 2026', rating: 'Outperform', sector: 'Technology', summary: 'Indian IT firms are successfully pivoting to AI-first delivery models. Margins expanding, not compressing.' },
      { title: 'Electric Vehicle Transition: Global Market Outlook', firm: 'Credit Suisse', date: 'Jul 5, 2026', rating: 'Market Weight', sector: 'Automobiles', summary: 'EV adoption accelerating faster than expected. China leads, but India emerging as next growth market.' }
    ];
    el.innerHTML = '<div class="grid grid-2" style="gap:1rem">' +
      reports.map(function(r) {
        var ratingColor = r.rating.includes('Buy') || r.rating.includes('Outperform') || r.rating.includes('Overweight') ? 'var(--green)' : r.rating.includes('Neutral') || r.rating.includes('Market') ? '#FFC107' : 'var(--red)';
        return '<div class="glass-card card-body" style="padding:1.25rem">' +
          '<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:.65rem">' +
            '<span class="badge badge-blue" style="font-size:.68rem">' + r.sector + '</span>' +
            '<span style="font-size:.68rem;font-weight:600;color:' + ratingColor + ';padding:.15rem .5rem;border:1px solid ' + ratingColor + ';border-radius:10px">' + r.rating + '</span>' +
          '</div>' +
          '<h4 style="font-size:.92rem;font-weight:700;line-height:1.35;margin-bottom:.5rem">' + r.title + '</h4>' +
          '<p style="font-size:.78rem;color:var(--text-muted);line-height:1.5;margin-bottom:.75rem">' + r.summary + '</p>' +
          '<div style="display:flex;justify-content:space-between;font-size:.7rem;color:var(--text-muted)">' +
            '<span>' + r.firm + '</span>' +
            '<span>' + r.date + '</span>' +
          '</div>' +
        '</div>';
      }).join('') +
    '</div>';
  }

  function bindSearch() {
    var searchEl = document.getElementById('research-search');
    if (!searchEl) return;
    searchEl.addEventListener('input', Utils.debounce(function(e) {
      var q = e.target.value.trim().toLowerCase();
      if (typeof CompaniesData === 'undefined') return;
      var results = q.length > 0 ? CompaniesData.search(q) : CompaniesData.companies.slice(0, 10);
      var tbody = document.querySelector('#research-companies tbody');
      if (tbody) {
        tbody.innerHTML = results.map(function(c) {
          var ratingColor = c.rating === 'BUY' ? 'var(--green)' : c.rating === 'HOLD' ? '#FFC107' : 'var(--red)';
          return '<tr style="border-bottom:1px solid rgba(255,255,255,.05);cursor:pointer">' +
            '<td style="padding:.65rem 1rem"><div style="font-weight:600">' + c.ticker + '</div><div style="font-size:.7rem;color:var(--text-muted)">' + c.name + '</div></td>' +
            '<td style="padding:.65rem .75rem;color:var(--text-muted)">' + c.sector + '</td>' +
            '<td style="text-align:right;padding:.65rem .75rem;font-weight:600">' + c.marketCap + '</td>' +
            '<td style="text-align:right;padding:.65rem .75rem;color:var(--text-muted)">' + c.revenue + '</td>' +
            '<td style="text-align:right;padding:.65rem .75rem;color:var(--text-muted)">' + c.ceo + '</td>' +
            '<td style="text-align:center;padding:.65rem 1rem"><span style="color:' + ratingColor + ';font-weight:700;font-size:.78rem;padding:.15rem .5rem;border:1px solid ' + ratingColor + ';border-radius:12px">' + c.rating + '</span></td>' +
          '</tr>';
        }).join('');
      }
    }, 300));
  }

  return { render: renderResearchPage };
})();
