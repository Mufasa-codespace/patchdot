/* Standalone, no dependencies. Safe for a Webflow custom-code footer. */
(() => {
  'use strict';
  const initialize = () => {
    const threads = [...document.querySelectorAll('[data-thread-motion]')].filter(el => el.dataset.threadInitialized !== 'true');
    if (!threads.length) return;
    threads.forEach(el => { el.dataset.threadInitialized = 'true'; });
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const visible = new Set(threads);
    const clamp = value => Math.max(0, Math.min(1, value));
    let frame = 0;
    const draw = () => {
      frame = 0;
      if (reduced.matches) return;
      const height = window.innerHeight || document.documentElement.clientHeight;
      const states = [...visible].map(el => {
        const bounds = el.getBoundingClientRect();
        const progress = clamp((height * 0.84 - bounds.top) / (height * 0.64 + bounds.height));
        return [el, 1 - clamp(progress / 0.72), (1 - clamp((progress - 0.68) / 0.32)) * 100];
      });
      states.forEach(([el, dash, hidden]) => {
        el.style.setProperty('--thread-dash', dash.toFixed(4));
        el.style.setProperty('--stitch-hidden', hidden.toFixed(2) + '%');
        el.classList.add('motion-ready');
      });
    };
    const schedule = () => { if (!frame && !reduced.matches) frame = window.requestAnimationFrame(draw); };
    const preferenceChanged = () => {
      if (frame) { window.cancelAnimationFrame(frame); frame = 0; }
      if (reduced.matches) {
        threads.forEach(el => { el.classList.remove('motion-ready'); el.style.removeProperty('--thread-dash'); el.style.removeProperty('--stitch-hidden'); });
      } else {
        draw();
      }
    };
    preferenceChanged();
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) visible.add(entry.target); else visible.delete(entry.target); });
        schedule();
      }, { rootMargin: '120px 0px' });
      threads.forEach(el => observer.observe(el));
    }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('pageshow', schedule);
    window.addEventListener('pagehide', () => { if (frame) window.cancelAnimationFrame(frame); frame = 0; });
    if (reduced.addEventListener) reduced.addEventListener('change', preferenceChanged);
    else reduced.addListener(preferenceChanged);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
