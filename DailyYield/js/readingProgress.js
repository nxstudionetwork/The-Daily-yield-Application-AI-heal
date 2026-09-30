const ReadingProgress = (() => {
  function init() {
    const bar = Utils.$('#reading-progress');
    if (!bar) return;
    window.addEventListener('scroll', Utils.throttle(() => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      bar.style.width = Math.min(progress, 100) + '%';
      bar.style.display = progress > 0 && progress < 100 ? 'block' : 'none';
    }, 50));
  }

  return { init };
})();
