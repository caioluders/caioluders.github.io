// Forward flight: perspective depth, fixed ASCII glyphs, and velocity-based trails.
export function starfield(t, getPalette = () => null) {
  let seed = 7319, seconds = 0, stars;
  const speed = .16, far = 2.4, random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
  const palette = [[95,115,255], [86,164,255], [100,215,255], [205,120,255], [255,100,215], [255,190,105], [142,240,171], [230,242,255]];
  const makeStars = (initialCols, initialRows, cw, ch, focal) => Array.from({length: 1800}, () => {
    const z = .2 + random() * (far - .2), kind = random();
    return {x: (random() - .5) * initialCols * cw / focal * z, y: (random() - .5) * initialRows * ch / focal * z, z, age: 2,
      light: .45 + random() * .55, phase: random() * Math.PI * 2, kind, color: Math.floor(random() ** 1.8 * palette.length),
      char: kind < .07 ? '.' : kind < .53 ? '*' : kind < .78 ? '+' : kind < .91 ? 'x' : kind < .97 ? 'o' : '+'};
  });
  const cross = [[-1,0,'-'],[1,0,'-'],[0,-1,'|'],[0,1,'|']], diagonal = [[-1,-1,'\\'],[1,-1,'/'],[-1,1,'/'],[1,1,'\\']];
  const glyph = (x, y, char, color) => {
    t.push(); t.translate(Math.round(x), Math.round(y)); t.charRotation(0); t.char(char); t.charColor(...color); t.point(); t.pop();
  };
  return delta => {
    seconds += delta;
    const theme = getPalette(), {cols, rows, cellWidth, cellHeight} = t.grid, area = cols * rows * cellWidth * cellHeight;
    const lens = Math.min(cols * cellWidth, rows * cellHeight) * .8, fx = lens / cellWidth, fy = lens / cellHeight;
    stars ||= makeStars(cols, rows, cellWidth, cellHeight, lens);
    t.background(...(theme?.sky || [5, 7, 17])); t.cellColor(0, 0, 0, 0);
    const count = Math.min(stars.length, Math.max(100, Math.round(area * .045 / 64)));
    for (const s of stars.slice(0, count).sort((a, b) => b.z - a.z)) {
      s.z -= delta * speed; s.age += delta;
      if (s.z < .1 || Math.abs(s.x / s.z * fx) > cols / 2 + 8 || Math.abs(s.y / s.z * fy) > rows / 2 + 8) {
        s.z = far; s.x = (random() - .5) * cols / fx * 1.2; s.y = (random() - .5) * rows / fy * 1.2; s.age = 0;
      }
      const depth = 1 - Math.min(s.z / far, 1), pulse = .94 + .06 * Math.sin(seconds * .7 + s.phase);
      const light = Math.min(1, s.light * (.23 + 1.15 * depth ** 2) * pulse) * Math.min(1, s.age / .8);
      const color = (theme ? theme.stars[s.color % theme.stars.length] : palette[s.color]).map(c => Math.round((c + (255 - c) * .45 * depth ** 3) * light));
      const x = s.x / s.z * fx, y = s.y / s.z * fy, radius = Math.hypot(x, y), tail = s.kind > .53 ? Math.min(6, Math.floor(radius * speed * .12 / (s.z + speed * .12))) : 0;
      const trailChar = Math.abs(x) > Math.abs(y) * 2 ? '-' : Math.abs(y) > Math.abs(x) * 2 ? '|' : x * y > 0 ? '\\' : '/';
      for (let k = tail; k > 0 && radius > 1; k--) glyph(x-x/radius*k, y-y/radius*k, trailChar, color.map(c => Math.round(c*.55*(1-k/(tail+1)))));
      glyph(x, y, s.char, color);
      for (let ring = 1; ring <= 2 && s.char !== '.'; ring++) {
        const glow = Math.min(1, Math.max(0, (depth - (ring === 1 ? .5 : .82)) / .16)) * .6;
        if (glow > 0) for (const [dx,dy,char] of s.char === 'x' ? diagonal : cross) glyph(x+dx*ring,y+dy*ring,char,color.map(c => Math.round(c * glow)));
      }
    }
  };
}
