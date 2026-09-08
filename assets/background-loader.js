import {starfield} from './background.js';

(async () => {
  const host = document.querySelector('#background');
  if (!host) return;
  const probe = document.createElement('canvas').getContext('webgl2');
  if (!probe) return;
  probe.getExtension('WEBGL_lose_context')?.loseContext();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const size = () => ({width: Math.min(innerWidth, 1920), height: Math.min(innerHeight, 1200)});
  let t, resizeTimer, skipDelta = true, disposed = false;
  const paused = () => reduced.matches || document.hidden;
  function syncMotion() {
    if (!t || disposed) return;
    skipDelta = true;
    if (paused()) { t.noLoop(); t.redraw(); } else t.loop();
  }
  const recolor = () => { if (t && !disposed && paused()) t.redraw(); };
  function resize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const {width, height} = size();
      t.resizeCanvas(width, height);
      if (paused()) t.redraw();
    }, 180);
  }
  function dispose() {
    if (disposed) return;
    disposed = true;
    clearTimeout(resizeTimer);
    window.removeEventListener('space-palette-change', recolor);
    reduced.removeEventListener('change', syncMotion);
    document.removeEventListener('visibilitychange', syncMotion);
    window.removeEventListener('resize', resize);
    if (t) t.destroy();
    host.replaceChildren();
  }
  try {
    if (!window.textmode) await new Promise((resolve, reject) => {
      const library = document.createElement('script');
      library.src = '/assets/vendor/textmode-0.18.0.umd.js';
      library.onload = resolve; library.onerror = reject;
      document.head.append(library);
    });
    // The built-in 8px glyphs change sampled pixels when downscaled to 6px.
    t = textmode.create({...size(), fontSize: 8, frameRate: 30, pixelDensity: 1});
    await t.setup(() => {
      host.append(t.canvas);
      t.canvas.setAttribute('aria-hidden', 'true');
      t.canvas.tabIndex = -1;
    });
    const draw = starfield(t, () => window.ludeSpacePalette);
    t.draw(() => {
      const delta = paused() || skipDelta ? 0 : Math.min(t.deltaTime() / 1000, .15);
      skipDelta = false;
      draw(delta);
    });
    syncMotion();
    window.addEventListener('space-palette-change', recolor);
    reduced.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncMotion);
    window.addEventListener('resize', resize);
    t.canvas.addEventListener('webglcontextlost', dispose, {once: true});
  } catch (error) {
    dispose();
    console.warn('Textmode background unavailable:', error);
  }
})();
