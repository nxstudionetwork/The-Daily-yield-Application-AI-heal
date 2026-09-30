const Theme = (() => {
  function init() {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.style.colorScheme = 'dark';
  }
  function toggle() { /* no-op */ }
  function getCurrent() { return 'dark'; }
  return { init, apply: init, toggle, getCurrent, getThemeIcon: () => '🌙', updateUI: () => {}, themes: { dark: {} } };
})();
