// ASCII nebulae and traveling stars with fixed characters and depth lighting.
export function starfield(t) {
  let seed = 7319, seconds = 0;
  const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
  const palette = [[95,115,255], [86,164,255], [100,215,255], [205,120,255], [255,100,215], [255,190,105], [142,240,171], [230,242,255]];
  const stars = Array.from({length: 2000}, () => {
    const z = .15 + random() * .85;
    return {x: (random() - .5) * z, y: (random() - .5) * z, z, age: 2, light: .3 + random() * .7,
      phase: random() * Math.PI * 2, rate: .8 + random() * 1.8, kind: random(), color: palette[Math.floor(random() ** 1.8 * palette.length)]};
  });
  const clouds = Array.from({length: 1200}, (_, i) => {
    const u = (random() + random() + random() - 1.5), v = (random() + random() + random() - 1.5);
    return {x: u * .13 + .035 * Math.sin(v * 5), y: v * .25, side: i % 2 ? 1 : -1, light: Math.exp(-u * u - v * v) * (.4 + random() * .6), char: ':;~='[i % 4]};
  });
  stars.forEach(s => s.char = s.kind < .1 ? '.' : s.kind < .55 ? '*' : s.kind < .82 ? '+' : s.kind < .92 ? 'x' : s.kind < .96 ? 'o' : '+');
  const glyph = (x, y, char, color) => {
    t.push(); t.translate(Math.round(x), Math.round(y)); t.charRotation(0); t.char(char); t.charColor(...color); t.point(); t.pop();
  };
  return delta => {
    seconds += delta;
    const {cols, rows, cellWidth, cellHeight} = t.grid, area = cols * rows * cellWidth * cellHeight;
    t.background(5, 7, 17); t.cellColor(0, 0, 0, 0);
    for (const c of clouds.slice(0, Math.min(clouds.length, Math.round(area / 1100)))) {
      const phase = (seconds * .008 + (c.side > 0 ? .65 : .2)) % 1, zoom = .65 + phase, glow = c.light * Math.min(1, phase * 8, (1-phase) * 8) * (.85 + .15 * Math.sin(seconds * .12 + c.side));
      glyph((c.x + c.side * .27) * cols * zoom, (c.y + c.side * .16) * rows * zoom, c.char, (c.side > 0 ? [59,27,78] : [20,48,67]).map(v => Math.round(v * glow)));
    }
    const count = Math.min(stars.length, Math.max(100, Math.round(area * .07 / 64)));
    for (const s of stars.slice(0, count).sort((a, b) => b.z - a.z)) {
      s.z -= delta * .035; s.age += delta;
      if (s.z < .08 || Math.abs(s.x / s.z) > .53 || Math.abs(s.y / s.z) > .53) { s.z = 1 + random() * .2; s.x = (random() - .5) * .75; s.y = (random() - .5) * .75; s.age = 0; }
      const depth = 1 - Math.min(s.z, 1), pulse = .5 + .5 * Math.sin(seconds * s.rate + s.phase);
      const light = Math.min(1, (s.light + .25 * pulse) * (.35 + .8 * depth ** 2)) * Math.min(1, s.age / 2);
      const color = s.color.map(c => Math.round((c + (255 - c) * .65 * depth ** 3) * light));
      const x = s.x / s.z * cols, y = s.y / s.z * rows, radius = Math.hypot(x, y), tail = s.kind > .8 ? Math.max(0, Math.floor((depth - .7) * 16)) : 0;
      const trailChar = Math.abs(x) > Math.abs(y) * 2 ? '-' : Math.abs(y) > Math.abs(x) * 2 ? '|' : x * y > 0 ? '\\' : '/';
      for (let k = tail; k > 0 && radius > 1; k--) glyph(x-x/radius*k, y-y/radius*k, trailChar, color.map(c => Math.round(c*.65*(1-k/(tail+1)))));
      const bright = s.kind > .96;
      glyph(x, y, s.char, color);
      if (bright) { const glow = color.map(c => Math.round(c * (.3 + pulse * .25))); glyph(x-1,y,'-',glow); glyph(x+1,y,'-',glow); glyph(x,y-1,'|',glow); glyph(x,y+1,'|',glow); }
    }
  };
}
