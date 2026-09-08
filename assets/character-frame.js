// Original ASCII ornament, measured in P0T-NOoDLE cells after the font loads.
// The headings stay real, selectable HTML; only the surrounding ink is decorative.
export function installCharacterFrame() {
  if (document.querySelector('.character-frame')) return;
  const frame = document.createElement('div');
  frame.className = 'character-frame';
  frame.setAttribute('aria-hidden', 'true');
  for (const edge of ['top', 'bottom', 'left', 'right']) {
    const span = document.createElement('span');
    span.className = `frame-${edge}`;
    frame.append(span);
  }
  document.body.append(frame);
  const [top, bottom, left, right] = frame.children;
  const bands = [...document.querySelectorAll('body > h2')].map(heading => {
    const label = document.createElement('span');
    label.className = 'heading-label';
    label.append(...heading.childNodes);
    const rule = document.createElement('span');
    rule.className = 'heading-separator section-divider';
    rule.setAttribute('aria-hidden', 'true');
    heading.classList.add('framed-heading', 'framed-section');
    heading.append(label, rule);
    return {heading, label, rule};
  });
  // Keep the ends intact on small screens; only the connecting runs change length.
  function line(columns, start, end, fill = '_') {
    return start + fill.repeat(Math.max(0, columns - start.length - end.length)) + end;
  }
  const measure = document.createElement('canvas').getContext('2d');
  let pending;
  function layout() {
    cancelAnimationFrame(pending);
    pending = requestAnimationFrame(() => {
      const size = parseFloat(getComputedStyle(frame).fontSize);
      measure.font = `${size}px "P0T-NOoDLE"`;
      const cell = measure.measureText('-').width;
      if (!cell) return;
      const body = document.body.getBoundingClientRect();
      const columns = Math.max(12, Math.floor(body.width / cell));
      const scale = devicePixelRatio || 1;
      const inset = Math.round((body.width - columns * cell) / 2 * scale) / scale;
      frame.style.left = inset + 'px';
      frame.style.width = columns * cell + 'px';
      frame.style.setProperty('--frame-cell', cell + 'px');
      top.textContent = [line(columns, '    .___', '__.    '), line(columns, ' ._/ /__', '__\\ \\_. '), line(columns, '/__/    ', '    \\__\\', ' ')].join('\n');
      bottom.textContent = [line(columns, '|  \\__', '__/  |'), line(columns, '\\__. /_', '_\\ .__/', '_'), line(columns, '   \\___', '___/   ', ':')].join('\n');
      // Sparse rails: detail lives at the joints, not at every line of prose.
      const rows = Array.from({length: Math.ceil(body.height / size)}, (_, i) => i % 24 === 20 ? ': ' : '| ');
      left.textContent = rows.join('\n');
      right.textContent = rows.map(row => [...row].reverse().join('')).join('\n');
      for (const {heading, label, rule} of bands) {
        const bounds = heading.getBoundingClientRect(), text = label.getBoundingClientRect();
        rule.style.left = (body.left + inset - bounds.left) + 'px';
        rule.style.width = columns * cell + 'px';
        const count = Math.ceil(bounds.height / size);
        const grid = Array.from({length: count}, () => Array(columns).fill(' '));
        const put = (row, start, value) => {
          if (!grid[row]) return;
          for (let i = 0; i < value.length; i++) if (start + i >= 0 && start + i < columns) grid[row][start + i] = value[i];
        };
        put(0, 0, line(columns, '|___ /', '\\ ___|'));
        put(count - 1, 0, line(columns, '|___ \\_', '_/ ___|'));
        // The title interrupts the band; a short dotted tail picks it up again.
        const row = Math.floor(count / 2);
        put(row, 0, '| /');
        const tail = Math.ceil((text.right - body.left - inset) / cell) + 2;
        if (tail < columns - 7) put(row, tail, line(columns - tail, '. . ', '/ |', '.'));
        else put(row, columns - 3, '\\ |');
        rule.textContent = grid.map(row => row.join('')).join('\n');
      }
    });
  }
  const observer = new ResizeObserver(layout);
  observer.observe(document.body);
  bands.forEach(({heading, label}) => { observer.observe(heading); observer.observe(label); });
  document.fonts.ready.then(layout);
  document.fonts.addEventListener('loadingdone', layout);
  window.addEventListener('resize', layout);
  layout();
}
