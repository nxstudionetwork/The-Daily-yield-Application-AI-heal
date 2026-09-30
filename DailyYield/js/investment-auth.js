const InvestmentAuth = (() => {
  let authenticated = false;
  let currentView = 'login';

  function getUsers() {
    return JSON.parse(localStorage.getItem('dy_users') || '[]');
  }

  function setUsers(users) {
    localStorage.setItem('dy_users', JSON.stringify(users));
  }

  function getSession() {
    try { return JSON.parse(localStorage.getItem('dy_session') || 'null'); } catch { return null; }
  }

  function setSession(session) {
    localStorage.setItem('dy_session', JSON.stringify(session));
  }

  function clearSession() {
    localStorage.removeItem('dy_session');
  }

  function hashPassword(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return 'b64_' + btoa('dy_' + Math.abs(hash).toString(36) + '_' + str.length);
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function hasAccount() {
    return getUsers().length > 0;
  }

  function isAuthenticated() {
    if (authenticated) return true;
    const session = getSession();
    if (session && session.userId && session.token) {
      authenticated = true;
      return true;
    }
    return false;
  }

  function getCurrentUser() {
    const session = getSession();
    if (!session) return null;
    const users = getUsers();
    return users.find(u => u.id === session.userId) || null;
  }

  function logout() {
    authenticated = false;
    clearSession();
    window.location.hash = '#/home';
  }

  function render(content) {
    if (!content) return;
    if (isAuthenticated()) {
      renderDashboard(content);
    } else {
      renderAuth(content);
    }
  }

  function renderAuth(content) {
    currentView = hasAccount() ? 'login' : 'signup';
    content.innerHTML = buildAuthPage();
    bindAuthEvents(content);
  }

  function buildAuthPage() {
    const formMap = {
      login: buildLoginForm(),
      signup: buildSignupForm(),
      forgot: buildForgotForm()
    };
    return `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg-primary);padding:1rem;position:relative;overflow:hidden;">
        <div style="position:absolute;top:-40%;left:-20%;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(212,175,55,0.06) 0%,transparent 70%);pointer-events:none;"></div>
        <div style="position:absolute;bottom:-30%;right:-15%;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(59,130,246,0.04) 0%,transparent 70%);pointer-events:none;"></div>
        <div style="width:100%;max-width:440px;position:relative;z-index:1;">
          <div style="text-align:center;margin-bottom:2rem;">
            <a href="#/home" style="display:inline-flex;align-items:center;gap:.75rem;text-decoration:none;">
              <svg width="40" height="40" viewBox="0 0 40 40"><defs><linearGradient id="auth-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#d4a017"/><stop offset="100%" stop-color="#b8860b"/></linearGradient></defs><circle cx="20" cy="20" r="18" fill="url(#auth-logo-grad)"/><polyline points="12 20 17 25 28 14" fill="none" stroke="#0a0a0a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span style="font-size:1.5rem;font-weight:700;color:var(--text-primary);">Daily Yield</span>
            </a>
            <p style="color:var(--text-muted);margin-top:.5rem;font-size:.9rem;">Investment Dashboard</p>
          </div>
          <div id="auth-form-container" style="background:var(--glass-bg);backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur);border:1px solid var(--glass-border);border-radius:var(--radius-lg);padding:2rem;box-shadow:var(--shadow-xl);transition:all .3s ease;">
            <div id="auth-message" style="display:none;margin-bottom:1rem;padding:.75rem 1rem;border-radius:var(--radius);font-size:.875rem;"></div>
            <div id="auth-form-body">
              ${formMap[currentView]}
            </div>
          </div>
          <p style="text-align:center;margin-top:1.5rem;font-size:.8rem;color:var(--text-dim);">Secured with simulated authentication. Data stored locally.</p>
        </div>
      </div>
    `;
  }

  function buildLoginForm() {
    return `
      <h2 style="font-size:1.35rem;font-weight:700;margin-bottom:.25rem;color:var(--text-primary);">Welcome Back</h2>
      <p style="color:var(--text-muted);font-size:.875rem;margin-bottom:1.5rem;">Sign in to your investment workspace</p>
      <form id="login-form" autocomplete="off">
        <div style="margin-bottom:1rem;">
          <label style="display:block;font-size:.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:.35rem;">Email Address</label>
          <input type="email" id="login-email" placeholder="you@example.com" required style="width:100%;padding:.7rem 1rem;background:var(--input-bg);border:1px solid var(--input-border);border-radius:var(--radius);color:var(--text-primary);font-size:.9rem;transition:border-color .2s;" />
        </div>
        <div style="margin-bottom:1rem;">
          <label style="display:block;font-size:.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:.35rem;">Password</label>
          <div style="position:relative;">
            <input type="password" id="login-password" placeholder="Enter password" required style="width:100%;padding:.7rem 1rem;padding-right:2.5rem;background:var(--input-bg);border:1px solid var(--input-border);border-radius:var(--radius);color:var(--text-primary);font-size:.9rem;transition:border-color .2s;" />
            <button type="button" id="toggle-login-pass" style="position:absolute;right:.75rem;top:50%;transform:translateY(-50%);color:var(--text-muted);font-size:1.1rem;cursor:pointer;background:none;border:none;">&#9673;</button>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
          <label style="display:flex;align-items:center;gap:.5rem;font-size:.825rem;color:var(--text-secondary);cursor:pointer;">
            <input type="checkbox" id="remember-me" style="accent-color:var(--accent);width:1rem;height:1rem;" /> Remember me
          </label>
          <button type="button" id="show-forgot" style="font-size:.825rem;color:var(--accent);cursor:pointer;background:none;border:none;font-weight:500;">Forgot Password?</button>
        </div>
        <button type="submit" id="login-btn" style="width:100%;padding:.75rem;background:linear-gradient(135deg,#D4AF37,#B8860B);color:#0a0a0a;font-weight:700;font-size:.95rem;border:none;border-radius:var(--radius);cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:.5rem;">
          Sign In
        </button>
        <p style="text-align:center;margin-top:1.25rem;font-size:.85rem;color:var(--text-muted);">
          Don't have an account? <button type="button" id="show-signup" style="color:var(--accent);font-weight:600;cursor:pointer;background:none;border:none;font-size:.85rem;">Create Account</button>
        </p>
      </form>
    `;
  }

  function buildSignupForm() {
    const countries = ['India','United States','United Kingdom','Canada','Germany','Japan','Singapore','UAE','Australia','France','South Korea','Brazil','South Africa'];
    const countryOpts = countries.map(c => `<option value="${c}">${c}</option>`).join('');
    return `
      <h2 style="font-size:1.35rem;font-weight:700;margin-bottom:.25rem;color:var(--text-primary);">Create Account</h2>
      <p style="color:var(--text-muted);font-size:.875rem;margin-bottom:1.5rem;">Start your investment journey today</p>
      <form id="signup-form" autocomplete="off">
        <div style="margin-bottom:1rem;">
          <label style="display:block;font-size:.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:.35rem;">Full Name</label>
          <input type="text" id="signup-name" placeholder="John Doe" required style="width:100%;padding:.7rem 1rem;background:var(--input-bg);border:1px solid var(--input-border);border-radius:var(--radius);color:var(--text-primary);font-size:.9rem;" />
        </div>
        <div style="margin-bottom:1rem;">
          <label style="display:block;font-size:.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:.35rem;">Email Address</label>
          <input type="email" id="signup-email" placeholder="you@example.com" required style="width:100%;padding:.7rem 1rem;background:var(--input-bg);border:1px solid var(--input-border);border-radius:var(--radius);color:var(--text-primary);font-size:.9rem;" />
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-bottom:1rem;">
          <div>
            <label style="display:block;font-size:.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:.35rem;">Mobile</label>
            <input type="tel" id="signup-mobile" placeholder="+91 98765 43210" style="width:100%;padding:.7rem 1rem;background:var(--input-bg);border:1px solid var(--input-border);border-radius:var(--radius);color:var(--text-primary);font-size:.9rem;" />
          </div>
          <div>
            <label style="display:block;font-size:.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:.35rem;">Country</label>
            <select id="signup-country" style="width:100%;padding:.7rem 1rem;background:var(--input-bg);border:1px solid var(--input-border);border-radius:var(--radius);color:var(--text-primary);font-size:.9rem;">
              <option value="">Select</option>
              ${countryOpts}
            </select>
          </div>
        </div>
        <div style="margin-bottom:1rem;">
          <label style="display:block;font-size:.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:.35rem;">Password</label>
          <input type="password" id="signup-password" placeholder="Min 6 characters" required minlength="6" style="width:100%;padding:.7rem 1rem;background:var(--input-bg);border:1px solid var(--input-border);border-radius:var(--radius);color:var(--text-primary);font-size:.9rem;" />
        </div>
        <div style="margin-bottom:1.5rem;">
          <label style="display:block;font-size:.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:.35rem;">Confirm Password</label>
          <input type="password" id="signup-confirm" placeholder="Re-enter password" required minlength="6" style="width:100%;padding:.7rem 1rem;background:var(--input-bg);border:1px solid var(--input-border);border-radius:var(--radius);color:var(--text-primary);font-size:.9rem;" />
        </div>
        <button type="submit" id="signup-btn" style="width:100%;padding:.75rem;background:linear-gradient(135deg,#D4AF37,#B8860B);color:#0a0a0a;font-weight:700;font-size:.95rem;border:none;border-radius:var(--radius);cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:.5rem;">
          Create Account
        </button>
        <p style="text-align:center;margin-top:1.25rem;font-size:.85rem;color:var(--text-muted);">
          Already have an account? <button type="button" id="show-login" style="color:var(--accent);font-weight:600;cursor:pointer;background:none;border:none;font-size:.85rem;">Sign In</button>
        </p>
      </form>
    `;
  }

  function buildForgotForm() {
    return `
      <h2 style="font-size:1.35rem;font-weight:700;margin-bottom:.25rem;color:var(--text-primary);">Reset Password</h2>
      <p style="color:var(--text-muted);font-size:.875rem;margin-bottom:1.5rem;">Enter your email and we'll send a reset link</p>
      <form id="forgot-form" autocomplete="off">
        <div style="margin-bottom:1.5rem;">
          <label style="display:block;font-size:.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:.35rem;">Email Address</label>
          <input type="email" id="forgot-email" placeholder="you@example.com" required style="width:100%;padding:.7rem 1rem;background:var(--input-bg);border:1px solid var(--input-border);border-radius:var(--radius);color:var(--text-primary);font-size:.9rem;" />
        </div>
        <button type="submit" id="forgot-btn" style="width:100%;padding:.75rem;background:linear-gradient(135deg,#D4AF37,#B8860B);color:#0a0a0a;font-weight:700;font-size:.95rem;border:none;border-radius:var(--radius);cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:.5rem;">
          Send Reset Link
        </button>
        <p style="text-align:center;margin-top:1.25rem;font-size:.85rem;color:var(--text-muted);">
          Remember your password? <button type="button" id="show-login-back" style="color:var(--accent);font-weight:600;cursor:pointer;background:none;border:none;font-size:.85rem;">Sign In</button>
        </p>
      </form>
    `;
  }

  function showMessage(msg, type) {
    const el = document.getElementById('auth-message');
    if (!el) return;
    el.style.display = 'block';
    el.style.background = type === 'error' ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)';
    el.style.color = type === 'error' ? '#F87171' : '#34D399';
    el.style.border = type === 'error' ? '1px solid rgba(239,68,68,0.25)' : '1px solid rgba(34,197,94,0.25)';
    el.textContent = msg;
  }

  function clearMessage() {
    const el = document.getElementById('auth-message');
    if (el) { el.style.display = 'none'; el.textContent = ''; }
  }

  function setLoading(btn, loading) {
    if (!btn) return;
    if (loading) {
      btn.dataset.origText = btn.innerHTML;
      btn.innerHTML = '<span style="display:inline-block;width:18px;height:18px;border:2.5px solid rgba(10,10,10,0.3);border-top-color:#0a0a0a;border-radius:50%;animation:authSpin .6s linear infinite;"></span> Please wait...';
      btn.disabled = true;
      btn.style.opacity = '0.8';
    } else {
      btn.innerHTML = btn.dataset.origText || btn.innerHTML;
      btn.disabled = false;
      btn.style.opacity = '1';
    }
  }

  function switchView(view) {
    currentView = view;
    clearMessage();
    const body = document.getElementById('auth-form-body');
    if (!body) return;
    body.style.opacity = '0';
    body.style.transform = 'translateY(6px)';
    setTimeout(() => {
      const formMap = { login: buildLoginForm(), signup: buildSignupForm(), forgot: buildForgotForm() };
      body.innerHTML = formMap[view];
      body.style.transition = 'opacity .25s ease, transform .25s ease';
      body.style.opacity = '1';
      body.style.transform = 'translateY(0)';
      bindFormEvents();
    }, 180);
  }

  function bindFormEvents() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const forgotForm = document.getElementById('forgot-form');

    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (signupForm) signupForm.addEventListener('submit', handleSignup);
    if (forgotForm) forgotForm.addEventListener('submit', handleForgot);

    const toggleBtn = document.getElementById('toggle-login-pass');
    if (toggleBtn) toggleBtn.addEventListener('click', () => {
      const inp = document.getElementById('login-password');
      if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
    });

    bindNavButtons();
  }

  function bindNavButtons() {
    const btnMap = {
      'show-signup': 'signup',
      'show-login': 'login',
      'show-login-back': 'login',
      'show-forgot': 'forgot'
    };
    Object.entries(btnMap).forEach(([id, view]) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => switchView(view));
    });
  }

  function bindAuthEvents(content) {
    bindFormEvents();
  }

  function handleLogin(e) {
    e.preventDefault();
    clearMessage();
    const email = (document.getElementById('login-email')?.value || '').trim().toLowerCase();
    const password = document.getElementById('login-password')?.value || '';
    const btn = document.getElementById('login-btn');

    if (!email || !password) {
      showMessage('Please fill in all fields.', 'error');
      return;
    }
    if (!validateEmail(email)) {
      showMessage('Please enter a valid email address.', 'error');
      return;
    }

    setLoading(btn, true);

    setTimeout(() => {
      const users = getUsers();
      const user = users.find(u => u.email === email);
      if (!user) {
        setLoading(btn, false);
        showMessage('No account found with this email.', 'error');
        return;
      }
      if (user.password !== hashPassword(password)) {
        setLoading(btn, false);
        showMessage('Incorrect password. Please try again.', 'error');
        return;
      }

      const session = {
        userId: user.id,
        token: 'tok_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10),
        loginTime: new Date().toISOString()
      };
      setSession(session);
      authenticated = true;

      showMessage('Login successful! Redirecting...', 'success');
      setTimeout(() => {
        window.location.hash = '#/dashboard';
      }, 600);
    }, 800);
  }

  function handleSignup(e) {
    e.preventDefault();
    clearMessage();
    const name = (document.getElementById('signup-name')?.value || '').trim();
    const email = (document.getElementById('signup-email')?.value || '').trim().toLowerCase();
    const mobile = (document.getElementById('signup-mobile')?.value || '').trim();
    const country = document.getElementById('signup-country')?.value || '';
    const password = document.getElementById('signup-password')?.value || '';
    const confirm = document.getElementById('signup-confirm')?.value || '';
    const btn = document.getElementById('signup-btn');

    if (!name || !email || !password || !confirm) {
      showMessage('Please fill in all required fields.', 'error');
      return;
    }
    if (!validateEmail(email)) {
      showMessage('Please enter a valid email address.', 'error');
      return;
    }
    if (password.length < 6) {
      showMessage('Password must be at least 6 characters.', 'error');
      return;
    }
    if (password !== confirm) {
      showMessage('Passwords do not match.', 'error');
      return;
    }

    const users = getUsers();
    if (users.some(u => u.email === email)) {
      showMessage('An account with this email already exists.', 'error');
      return;
    }

    setLoading(btn, true);

    setTimeout(() => {
      const newUser = {
        id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        name: name,
        email: email,
        mobile: mobile,
        country: country,
        password: hashPassword(password),
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      setUsers(users);

      StockEngine.init();

      showMessage('Account created successfully! Signing in...', 'success');
      setTimeout(() => {
        const session = {
          userId: newUser.id,
          token: 'tok_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10),
          loginTime: new Date().toISOString()
        };
        setSession(session);
        authenticated = true;
        window.location.hash = '#/dashboard';
      }, 800);
    }, 1000);
  }

  function handleForgot(e) {
    e.preventDefault();
    clearMessage();
    const email = (document.getElementById('forgot-email')?.value || '').trim().toLowerCase();
    const btn = document.getElementById('forgot-btn');

    if (!email) {
      showMessage('Please enter your email address.', 'error');
      return;
    }
    if (!validateEmail(email)) {
      showMessage('Please enter a valid email address.', 'error');
      return;
    }

    setLoading(btn, true);

    setTimeout(() => {
      const users = getUsers();
      const user = users.find(u => u.email === email);
      setLoading(btn, false);
      if (user) {
        showMessage('Reset link sent! Check your inbox (simulated).', 'success');
      } else {
        showMessage('If an account exists with this email, a reset link has been sent.', 'success');
      }
    }, 1200);
  }

  function renderDashboard(content) {
    if (typeof InvestmentDashboard !== 'undefined') {
      InvestmentDashboard.render(content);
    } else {
      content.innerHTML = `
        <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;">
          <div style="text-align:center;">
            <div style="font-size:3rem;margin-bottom:1rem;">📊</div>
            <h2 style="color:var(--text-primary);margin-bottom:.5rem;">Loading Dashboard...</h2>
            <p style="color:var(--text-muted);">Please wait while we prepare your workspace.</p>
          </div>
        </div>
      `;
      setTimeout(() => renderDashboard(content), 500);
    }
  }

  return { render, hasAccount, isAuthenticated, logout, getCurrentUser, getUsers, hashPassword };
})();
