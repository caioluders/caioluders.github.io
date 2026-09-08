import {installCharacterFrame} from './character-frame.js';
import {brasilHour, sampleAt, paintPalette} from './time-palettes.js';
(() => {
  'use strict';
  // Final sizes chosen for P0T-NOoDLE headings and IBM Plex Mono article text.
  const sizes = {heading: 32, body: 17, table: 16};
  let alignFrame;
  function alignGrid() {
    cancelAnimationFrame(alignFrame);
    alignFrame = requestAnimationFrame(() => {
      const scale = devicePixelRatio || 1;
      const body = document.body;
      const baseX = body.getBoundingClientRect().x - (parseFloat(body.style.left) || 0);
      body.style.left = (Math.round(baseX * scale) / scale - baseX) + 'px';
      const table = document.querySelector('table.index');
      if (!table || table.hidden) return;
      const cols = [...table.querySelectorAll('col')];
      if (cols.length === 3 && innerWidth > 640) {
        const gap = parseFloat(getComputedStyle(table).borderSpacing);
        // Measure the container: old fixed column widths can keep the table
        // wider than its parent after a desktop-to-tablet resize.
        const style = getComputedStyle(body);
        const available = body.getBoundingClientRect().width - parseFloat(style.paddingLeft)
          - parseFloat(style.paddingRight) - gap * 4;
        const first = Math.floor(available * .36 * scale) / scale;
        const second = Math.floor(available * .48 * scale) / scale;
        [first, second, available - first - second].forEach((width, i) => { cols[i].style.width = width + 'px'; });
      }
      // Browser table layout quantizes fractional CSS pixels internally.
      // Correct each text origin after layout so that error cannot accumulate
      // down a long table. Moving a wrapper preserves links and table semantics.
      table.querySelectorAll('td, th').forEach(cell => {
        if (!cell.firstChild || cell.querySelector(':scope > .pixel-cell')) return;
        const span = document.createElement('span');
        span.className = 'pixel-cell';
        span.append(...cell.childNodes);
        cell.append(span);
      });
      const offsets = [...table.querySelectorAll('.pixel-cell')].map(span => {
        const rect = span.getBoundingClientRect();
        const x = rect.x - (parseFloat(span.style.left) || 0);
        const y = rect.y - (parseFloat(span.style.top) || 0);
        return [span, Math.round(x * scale) / scale - x, Math.round(y * scale) / scale - y];
      });
      offsets.forEach(([span, left, top]) => { span.style.left = left + 'px'; span.style.top = top + 'px'; });
    });
  }
  function apply() {
    const scale = devicePixelRatio || 1;
    const snap = size => Math.max(16, Math.round(size * scale / 16) * 16) / scale;
    const properties = {
      '--device-pixel': 1 / scale, '--heading-grid': 16 / scale, '--body-grid': 1 / scale,
      '--heading-size': snap(sizes.heading), '--body-size': sizes.body,
      '--table-size': sizes.table, '--mobile-heading-size': snap(sizes.heading * .85),
      '--mobile-body-size': Math.max(14, sizes.body - 2),
      '--table-date-size': Math.min(sizes.table * .875, 16),
    };
    for (const [key, value] of Object.entries(properties)) document.documentElement.style.setProperty(key, value + 'px');
    alignGrid();
  }
  function watchDisplayScale() {
    matchMedia(`(resolution: ${devicePixelRatio || 1}dppx)`).addEventListener('change', () => {
      apply(); watchDisplayScale();
    }, {once: true});
  }
  const updatePalette = () => paintPalette(sampleAt(brasilHour()));
  updatePalette();
  setInterval(() => { if (!document.hidden) updatePalette(); }, 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) updatePalette(); });
  apply(); watchDisplayScale();
  installCharacterFrame();
  window.addEventListener('resize', apply);
  document.fonts.ready.then(alignGrid);
  document.fonts.addEventListener('loadingdone', alignGrid);
  const table = document.querySelector('table.index');
  if (table) new ResizeObserver(alignGrid).observe(table);
})();
