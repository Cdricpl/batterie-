/* Petites illustrations des cartes (SVG en ligne, aucun fichier à charger).
 * Les couleurs viennent du CSS (--ill-1, --ill-2…) : blanches sur les cartes en
 * dégradé, colorées sur les cartes blanches. Le même dessin sert partout. */
import { analyser } from './notation.js';
import { estNote } from './instruments.js';

const C1 = 'var(--ill-1)', C2 = 'var(--ill-2)', C3 = 'var(--ill-3)', FOND = 'var(--ill-fond)', TRAIT = 'var(--ill-trait)', TXT = 'var(--ill-txt)';
const rempli = c => `style="fill:${c}"`;
const trace = (c, l = 2.4) => `style="fill:none;stroke:${c};stroke-width:${l}px;stroke-linecap:round;stroke-linejoin:round"`;
const svgIllus = (contenu, vb = '0 0 160 110') =>
  `<svg viewBox="${vb}" aria-hidden="true" focusable="false">${contenu}</svg>`;

/* un fût vu légèrement de dessus */
function dessinFut(x, y, rx, ry, h, c = C1){
  return `<path d="M${x - rx} ${y}v${h}a${rx} ${ry} 0 0 0 ${2 * rx} 0v${-h}" ${rempli(FOND)}/>
    <path d="M${x - rx} ${y}v${h}a${rx} ${ry} 0 0 0 ${2 * rx} 0v${-h}" ${trace(c)}/>
    <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" ${rempli(FOND)}/>
    <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" ${trace(c)}/>`;
}
function dessinCymbale(x, y, rx, c = C2){
  return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${rx * 0.22}" ${rempli(FOND)}/>
    <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${rx * 0.22}" ${trace(c, 2.2)}/>
    <ellipse cx="${x}" cy="${y - 1}" rx="${rx * 0.18}" ry="${rx * 0.08}" ${rempli(c)}/>`;
}
const baguette = (x1, y1, x2, y2, c = C1) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${trace(c, 3.2)}/><circle cx="${x2}" cy="${y2}" r="2.8" ${rempli(c)}/>`;

export const CATEGORIES = {
  parcours: svgIllus(`
    <path d="M10 100h30V80h30V60h30V40h30V20" ${trace(C1, 4.5)}/>
    ${[[25, 100], [55, 80], [85, 60], [115, 40]].map(([x, y], i) =>
      `<circle cx="${x}" cy="${y - 11}" r="6" style="fill:${i < 3 ? C1 : 'none'};stroke:${C1};stroke-width:2.4px"/>`).join('')}
    <path d="M140 2l3.5 8 8.5 1-6.4 5.6 1.9 8.4-7.5-4.4-7.5 4.4 1.9-8.4-6.4-5.6 8.5-1z" ${rempli(C1)}/>`),

  rythmes: svgIllus([0, 1, 2].map(r => [...Array(8)].map((_, c) => {
      const on = ['xxxxxxxx', '--x---x-', 'x---x-x-'][r][c] === 'x';
      return `<rect x="${10 + c * 18.5}" y="${16 + r * 28}" width="13" height="13" rx="4"
        style="fill:${on ? C1 : FOND};opacity:${on ? [1, 0.85, 0.7][r] : 1}"/>`;
    }).join('')).join('') + `<rect x="63" y="6" width="3" height="96" rx="1.5" ${rempli(C1)}/>`),

  morceaux: svgIllus(`
    <circle cx="68" cy="56" r="47" ${rempli(FOND)}/>
    <circle cx="68" cy="56" r="47" ${trace(C1, 2.6)}/>
    ${[38, 30, 22].map(r => `<circle cx="68" cy="56" r="${r}" ${trace(C3, 1.3)}/>`).join('')}
    <circle cx="68" cy="56" r="13" ${rempli(C1)}/><circle cx="68" cy="56" r="3" ${rempli(TXT)}/>
    <path d="M140 10v44l-22 18" ${trace(C1, 3.4)}/>
    <circle cx="140" cy="10" r="5" ${rempli(C1)}/>`),

  breaks: svgIllus(`
    ${dessinFut(38, 46, 22, 8, 22)}${dessinFut(84, 36, 24, 9, 24)}${dessinFut(126, 60, 26, 10, 30)}
    <path d="M24 20q14-16 28-2M70 10q14-14 28 0M112 32q14-14 28 0" ${trace(C2, 2.6)}/>
    ${baguette(14, 100, 40, 60)}`),

  rudiments: svgIllus(`
    <ellipse cx="62" cy="64" rx="46" ry="15" ${rempli(FOND)}/>
    <ellipse cx="62" cy="60" rx="46" ry="15" ${rempli(FOND)}/>
    <ellipse cx="62" cy="60" rx="46" ry="15" ${trace(C1, 2.6)}/>
    <ellipse cx="62" cy="60" rx="26" ry="8.5" ${trace(C3, 1.6)}/>
    ${baguette(22, 16, 54, 56)}${baguette(106, 14, 72, 56)}
    <text x="62" y="102" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-weight="700" font-size="22" letter-spacing="2" ${rempli(C1)}>DGDD</text>
    <text x="142" y="44" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-weight="700" font-size="22" ${rempli(C2)}>×4</text>`)
};

/* Batterie qui se complète à chaque niveau (1 à 6) */
export function kitNiveau(n){
  const p = [];
  if (n >= 5) p.push(dessinCymbale(128, 22, 26));          // ride
  if (n >= 4) p.push(dessinCymbale(34, 16, 22));           // crash
  if (n >= 2) p.push(dessinCymbale(18, 50, 16));           // charleston
  if (n >= 4) p.push(dessinFut(62, 34, 13, 5, 12), dessinFut(96, 34, 14, 5, 13));
  if (n >= 3) p.push(`<circle cx="80" cy="76" r="26" ${rempli(FOND)}/><circle cx="80" cy="76" r="26" ${trace(C1, 2.8)}/>
      <circle cx="80" cy="76" r="17" ${trace(C3, 1.4)}/>`);
  if (n >= 5) p.push(dessinFut(132, 62, 16, 6, 26));
  p.push(dessinFut(n === 1 ? 80 : 40, 70, 17, 6, 14));          // caisse claire
  if (n >= 6) p.push(`<rect x="62" y="100" width="12" height="6" rx="2" ${rempli(C1)}/><rect x="86" y="100" width="12" height="6" rx="2" ${rempli(C1)}/>`);
  if (n === 1) p.push(baguette(52, 36, 74, 62), baguette(108, 36, 86, 62));
  return svgIllus(p.join(''));
}

/* Miniature d'un groove : cymbales, caisse claire / toms, pieds — une mesure */
export function miniGroove(motif, mesure = 0){
  const a = analyser(motif);
  const n = a.parMesure;
  const d = Math.min(mesure, a.bars - 1) * n;
  const lignes = [
    ['CH', 'RD', 'CR'].map(id => a.pistes[id]).filter(Boolean),
    [a.pistes.CC, a.pistes.T1, a.pistes.T2, a.pistes.TB].filter(Boolean),
    [a.pistes.GC, a.pistes.HP].filter(Boolean)
  ];
  const coul = [C1, C2, C3];
  const w = 148 / n;
  const r = Math.min(4.6, w * 0.38);
  let out = '';
  for (let t = 0; t <= n; t += a.res)
    out += `<rect x="${(6 + w * t - 0.6).toFixed(1)}" y="4" width="1.2" height="56" ${rempli(TRAIT)}/>`;
  lignes.forEach((pistes, l) => {
    for (let s = 0; s < n; s++){
      const on = pistes.some(p => estNote(p[d + s]));
      const x = (6 + w * (s + 0.5)).toFixed(1);
      const y = 12 + l * 20;
      out += `<circle cx="${x}" cy="${y}" r="${on ? r.toFixed(1) : 1.5}" ${rempli(on ? coul[l] : TRAIT)}/>`;
    }
  });
  return svgIllus(out, '0 0 160 64');
}

/* Doigté d'un rudiment en lettres : D en haut, G en bas */
export function miniDoigte(doigte){
  const lettres = doigte.replace(/[\s-]/g, '').slice(0, 8).split('');
  const pas = 148 / Math.max(lettres.length, 4);
  return svgIllus(lettres.map((c, i) => {
    const x = 6 + pas * (i + 0.5);
    const d = c.toUpperCase() === 'D';
    return `<rect x="${(x - pas * 0.38).toFixed(1)}" y="${d ? 4 : 34}" width="${(pas * 0.76).toFixed(1)}" height="26" rx="7" ${rempli(d ? C1 : C2)}/>
      <text x="${x.toFixed(1)}" y="${d ? 22 : 52}" text-anchor="middle" font-family="'IBM Plex Mono',monospace"
        font-size="13.5" font-weight="700" ${rempli(TXT)}>${c.toUpperCase()}</text>`;
  }).join(''), '0 0 160 64');
}

/* Disque pour les cartes de morceaux */
export function miniVinyle(){
  return svgIllus(`
    <circle cx="66" cy="32" r="29" ${rempli(C1)}/>
    ${[23, 18, 13].map(r => `<circle cx="66" cy="32" r="${r}" ${trace(TRAIT, 1)}/>`).join('')}
    <circle cx="66" cy="32" r="8" ${rempli(C2)}/><circle cx="66" cy="32" r="2" ${rempli(TXT)}/>
    <path d="M112 6v28l-14 11" ${trace(C3, 2.6)}/><circle cx="112" cy="6" r="3.5" ${rempli(C3)}/>`, '0 0 160 64');
}
