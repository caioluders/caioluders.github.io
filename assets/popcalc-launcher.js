(() => {
  'use strict';
  // One independent draw per page load; no calculator download on the other 80%.
  if (Math.random() >= 0.2) return;
  const delay = 3000 + Math.floor(Math.random() * 12001);
  function schedule() {
    const timer = setTimeout(() => {
      const script = document.createElement('script');
      script.src = 'https://lude.rs/popcalc.js/popcalc.js';
      script.onload = () => {
        if (typeof window.popcalc === 'function') window.popcalc({delay: 0});
      };
      document.head.append(script);
    }, delay);
    window.addEventListener('pagehide', () => clearTimeout(timer), {once: true});
  }
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, {once: true});
})();
