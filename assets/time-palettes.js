// Theme: five color stops in Brasília's civil day, independent of the visitor's timezone.
const make = (name, hour, hue, colors, sky, stars) => ({name, hour, hue,
  ...Object.fromEntries(['textColor','headingColor','sectionColor','linkColor','visitedColor','stripeColor'].map((key,i)=>[key,colors[i]])), sky, stars});
export const palettes = [
  make('Midnight violet', 0, 260, ['#e6e2f5','#b5a0ff','#f0a4ed','#aabfff','#c39ce0','#534570'], '#070511', ['#887aff','#afa0ff','#d394ff','#f09cd9','#8bb8ff','#ddd6ff']),
  make('Rose dawn', 6, 345, ['#f3e5e6','#ffb09f','#ffd38f','#ffb9d9','#dba9d0','#794955'], '#12080e', ['#ff91ae','#ffb39a','#ffd387','#f29cda','#baa5ff','#fff0d9']),
  make('Cyan noon', 12, 190, ['#e0eff0','#78eaff','#a6f5cf','#8bdbff','#b5afe8','#365e6c'], '#041015', ['#64dcff','#8eeedb','#b4ffb4','#91b5ff','#d0b0ff','#dcfbff']),
  make('Amber sunset', 17, 25, ['#f3e8dd','#ffc27c','#ff9fbb','#ffd09a','#dda6cb','#784e43'], '#130908', ['#ff9b63','#ffc278','#ffe29e','#ff8ea7','#d29de7','#fff0d5']),
  make('Magenta evening', 21, 305, ['#eee2f2','#f6a2ff','#9bbfff','#e9adff','#c2a7ec','#65436e'], '#0d0515', ['#ed8bff','#ff96d6','#b098ff','#7cbcff','#cf9eea','#f9deff']),
];
export const rgb = hex => [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
const mix = (a,b,t) => '#' + rgb(a).map((v,i)=>Math.round(v+(rgb(b)[i]-v)*t).toString(16).padStart(2,'0')).join('');
const formatter = new Intl.DateTimeFormat('en-GB', {timeZone:'America/Sao_Paulo',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
export function brasilHour(date = new Date()) {
  const parts = Object.fromEntries(formatter.formatToParts(date).map(p=>[p.type,p.value]));
  return Number(parts.hour) + Number(parts.minute)/60 + Number(parts.second)/3600;
}
export function sampleAt(hour) {
  hour = ((hour % 24) + 24) % 24;
  const i = palettes.findLastIndex(p=>p.hour <= hour), a = palettes[i], b = palettes[(i+1)%palettes.length];
  const fraction = (hour-a.hour)/((b.hour || 24)-a.hour), t = fraction*fraction*(3-2*fraction);
  const result = {from:a.name,to:b.name,hue:(a.hue+(((b.hue-a.hue+540)%360)-180)*t+360)%360};
  for (const key of ['textColor','headingColor','sectionColor','linkColor','visitedColor','stripeColor','sky']) result[key] = mix(a[key],b[key],t);
  for (const key of ['stars']) result[key] = a[key].map((color,j)=>mix(color,b[key][j],t));
  return result;
}
export function paintPalette(p) {
  const root = document.documentElement;
  root.dataset.timePalette = 'true';
  for (const key of ['textColor','headingColor','sectionColor','linkColor','visitedColor']) root.style.setProperty('--'+key.replace(/[A-Z]/g,c=>'-'+c.toLowerCase()),p[key]);
  root.style.setProperty('--stripe-rgb',rgb(p.stripeColor).join(', '));
  root.style.setProperty('--sky-color',p.sky);
  root.style.setProperty('--space-hue-shift','0deg');
  window.ludeSpacePalette = {sky:rgb(p.sky),stars:p.stars.map(rgb)};
  window.dispatchEvent(new Event('space-palette-change'));
}
