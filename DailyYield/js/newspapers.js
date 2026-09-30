const Newspapers = (() => {
  function render(content) {
    if (!content || typeof NewspapersData === 'undefined') return;
    const newspapers = NewspapersData.newspapers || [];
    const languages = [...new Set(newspapers.map(n => n.language))];
    const countries = [...new Set(newspapers.map(n => n.country))];
    content.innerHTML = `
      <div class="newspapers-page fade-in">
        <div class="page-header">
          <h1 class="page-title gold-text">Newspapers</h1>
          <div class="page-actions" style="display:flex;gap:.5rem;flex-wrap:wrap">
            <select class="input" id="np-lang-filter" style="max-width:160px;font-size:.82rem">
              <option value="all">All Languages</option>
              ${languages.map(l => `<option value="${l}">${l}</option>`).join('')}
            </select>
            <select class="input" id="np-country-filter" style="max-width:160px;font-size:.82rem">
              <option value="all">All Countries</option>
              ${countries.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
          </div>
        </div>
        <div style="display:flex;gap:.5rem;margin-bottom:1.25rem;flex-wrap:wrap">
          <button class="btn btn-sm btn-gold np-cat-btn active" data-cat="all">All</button>
          <button class="btn btn-sm btn-outline np-cat-btn" data-cat="General">General</button>
          <button class="btn btn-sm btn-outline np-cat-btn" data-cat="Business">Business</button>
        </div>
        <div class="newspapers-grid" id="newspapers-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem">
          ${newspapers.map(np => `
            <div class="newspaper-card glass-card card fade-in" data-lang="${np.language}" data-country="${np.country}" data-cat="${np.category}" style="padding:1.25rem;display:flex;flex-direction:column;gap:.6rem">
              <div style="display:flex;align-items:flex-start;justify-content:space-between">
                <div>
                  <h3 style="font-size:.95rem;font-weight:700;margin:0;color:var(--text-primary)">${np.name}</h3>
                  <span style="font-size:.72rem;color:var(--text-muted)">${np.publisher}</span>
                </div>
                <span style="font-size:.7rem;padding:.2rem .5rem;border-radius:12px;background:${np.category === 'Business' ? 'rgba(212,175,55,0.15)' : 'rgba(59,130,246,0.15)'};color:${np.category === 'Business' ? 'var(--gold)' : 'var(--blue)'}">${np.category}</span>
              </div>
              <div style="display:flex;gap:.75rem;font-size:.75rem;color:var(--text-secondary)">
                <span>🌍 ${np.country}</span>
                <span>🗣 ${np.language}</span>
                <span>📅 ${np.frequency}</span>
                <span>⭐ ${np.rating}</span>
              </div>
              <p style="font-size:.8rem;color:var(--text-secondary);margin:0;line-height:1.4">${np.description}</p>
              <div style="display:flex;flex-wrap:wrap;gap:.3rem">
                ${np.editions.map(e => `<span style="font-size:.68rem;padding:.15rem .4rem;border-radius:8px;background:var(--bg-secondary);color:var(--text-muted)">${e}</span>`).join('')}
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-top:.25rem">
                <span style="font-size:.75rem;color:var(--text-muted)">📰 ${np.subscribers} subscribers</span>
                <button class="btn btn-sm ${np.isSubscribed ? 'btn-gold' : 'btn-outline'} np-sub-btn">${np.isSubscribed ? 'Subscribed' : 'Subscribe'}</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    let activeCat = 'all';
    Utils.$('.np-cat-btn')?.parentElement?.querySelectorAll('.np-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCat = btn.dataset.cat;
        btn.parentElement.querySelectorAll('.np-cat-btn').forEach(b => {
          b.className = `btn btn-sm ${b === btn ? 'btn-gold' : 'btn-outline'} np-cat-btn`;
        });
        applyFilters();
      });
    });
    Utils.$('#np-lang-filter')?.addEventListener('change', applyFilters);
    Utils.$('#np-country-filter')?.addEventListener('change', applyFilters);
    function applyFilters() {
      const lang = Utils.$('#np-lang-filter')?.value || 'all';
      const country = Utils.$('#np-country-filter')?.value || 'all';
      Utils.$$('.newspaper-card').forEach(card => {
        const matchLang = lang === 'all' || card.dataset.lang === lang;
        const matchCountry = country === 'all' || card.dataset.country === country;
        const matchCat = activeCat === 'all' || card.dataset.cat === activeCat;
        card.style.display = (matchLang && matchCountry && matchCat) ? '' : 'none';
      });
    }
    Utils.$$('.np-sub-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const isSub = btn.classList.contains('btn-gold');
        btn.className = `btn btn-sm ${isSub ? 'btn-outline' : 'btn-gold'} np-sub-btn`;
        btn.textContent = isSub ? 'Subscribe' : 'Subscribed';
        Notifications.showToast(isSub ? 'Unsubscribed' : 'Subscribed!', 'success');
      });
    });
    Animations.scrollFade();
  }

  return { render };
})();
