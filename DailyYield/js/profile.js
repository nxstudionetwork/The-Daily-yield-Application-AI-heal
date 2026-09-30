const Profile = (() => {
  function render(content) {
    if (!content) return;
    const name = Utils.storage.get('userName', 'User');
    const email = Utils.storage.get('userEmail', 'user@example.com');
    content.innerHTML = `
      <div class="profile-page fade-in">
        <div class="profile-header-card">
          <div class="profile-cover"></div>
          <div class="profile-info">
            <div class="profile-avatar-lg">${name.charAt(0).toUpperCase()}</div>
            <h2 class="profile-name" id="profile-name-display">${name}</h2>
            <p class="profile-email">${email}</p>
          </div>
        </div>
        <div class="profile-stats">
          <div class="profile-stat">
            <span class="stat-value" data-count="156">0</span>
            <span class="stat-label">Articles Read</span>
          </div>
          <div class="profile-stat">
            <span class="stat-value" data-count="42">0</span>
            <span class="stat-label">Bookmarks</span>
          </div>
          <div class="profile-stat">
            <span class="stat-value" data-count="28">0</span>
            <span class="stat-label">Posts</span>
          </div>
          <div class="profile-stat">
            <span class="stat-value" data-count="12">0</span>
            <span class="stat-label">Groups</span>
          </div>
        </div>
        <div class="profile-sections">
          <div class="profile-section">
            <h3>Quick Links</h3>
            <div class="profile-links">
              <a href="#/posts?tab=bookmarks" class="profile-link" data-route="/posts">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                My Bookmarks
              </a>
              <a href="#/posts?tab=groups" class="profile-link" data-route="/posts">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                My Groups
              </a>
              <a href="#/settings" class="profile-link" data-route="/settings">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                Settings
              </a>
            </div>
          </div>
          <div class="profile-section">
            <h3>Edit Profile</h3>
            <form class="profile-form" id="profile-form">
              <div class="form-group">
                <label>Name</label>
                <input type="text" class="form-input" id="profile-name-input" value="${Utils.escapeHtml(name)}">
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" class="form-input" id="profile-email-input" value="${Utils.escapeHtml(email)}">
              </div>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </form>
          </div>
        </div>
      </div>
    `;
    Utils.$('#profile-form')?.addEventListener('submit', e => {
      e.preventDefault();
      const newName = Utils.$('#profile-name-input').value.trim();
      const newEmail = Utils.$('#profile-email-input').value.trim();
      if (newName) {
        Utils.storage.set('userName', newName);
        Utils.storage.set('userEmail', newEmail);
        const display = Utils.$('#profile-name-display');
        if (display) display.textContent = newName;
        const headerAvatar = Utils.$('#profile-avatar');
        if (headerAvatar) headerAvatar.textContent = newName.charAt(0).toUpperCase();
        Notifications.showToast('Profile updated successfully!', 'success');
      }
    });
    Animations.scrollFade();
    Animations.initCounters();
  }

  return { render };
})();
