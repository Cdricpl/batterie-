/* Petites illustrations des cartes (SVG en ligne, aucun fichier à charger).
 * Style volontairement sobre : quelques formes, trois couleurs (laiton, corail, acier). */
import { analyser } from './notation.js';
import { estNote } from './instruments.js';

const LAITON = '#e0a93b', CORAIL = '#e5584b', ACIER = '#8ea9c2', VERT = '#4fb7a0', CLAIR = '#eef1f6';
const svgIllus = (contenu, vb = '0 0 160 110') =>
  `<svg viewBox="${vb}" aria-hidden="true" focusable="false">${contenu}</svg>`;

/* un fût vu légèrement de dessus */
function dessinFut(x, y, rx, ry, h, coul){
  return `<path d="M${x - rx} ${y}v${h}a${rx} ${ry} 0 0 0 ${2 * rx} 0v${-h}" fill="${coul}" opacity=".22"/>
    <path d="M${x - rx} ${y}v${h}a${rx} ${ry} 0 0 0 ${2 * rx} 0v${-h}" fill="none" stroke="${coul}" stroke-width="2.4"/>
    <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#1c212c" stroke="${coul}" stroke-width="2.4"/>`;
}
function dessinCymbale(x, y, rx, coul){
  return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${rx * 0.22}" fill="${coul}" opacity=".3"/>
    <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${rx * 0.22}" fill="none" stroke="${coul}" stroke-width="2.2"/>
    <ellipse cx="${x}" cy="${y - 1}" rx="${rx * 0.18}" ry="${rx * 0.08}" fill="${coul}"/>`;
}
const baguette = (x1, y1, x2, y2) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${CLAIR}" stroke-width="3" stroke-linecap="round"/>
   <circle cx="${x2}" cy="${y2}" r="2.6" fill="${CLAIR}"/>`;

export const CATEGORIES = {
  parcours: svgIllus(`
    <path d="M14 96h28V76h28V56h28V36h28V16" fill="none" stroke="${LAITON}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14 96h132" stroke="#3a4152" stroke-width="2"/>
    ${[[28, 96], [56, 76], [84, 56], [112, 36]].map(([x, y], i) =>
      `<circle cx="${x}" cy="${y - 10}" r="5" fill="${i < 3 ? LAITON : 'none'}" stroke="${LAITON}" stroke-width="2"/>`).join('')}
    <path d="M136 4l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="${CORAIL}"/>`),

  rythmes: svgIllus([0, 1, 2].map(r => [...Array(8)].map((_, c) => {
      const motif = ['xxxxxxxx', '--x---x-', 'x---x-x-'][r];
      const on = motif[c] === 'x';
      const coul = [LAITON, CORAIL, VERT][r];
      return `<rect x="${12 + c * 18}" y="${18 + r * 28}" width="12" height="12" rx="3.5"
        fill="${on ? coul : 'none'}" stroke="${on ? coul : '#3a4152'}" stroke-width="2"/>`;
    }).join('')).join('') + `<line x1="66" y1="8" x2="66" y2="100" stroke="${CLAIR}" stroke-width="2.4" stroke-linecap="round" opacity=".85"/>`),

  morceaux: svgIllus(`
    <circle cx="70" cy="55" r="46" fill="#0d1016" stroke="#3a4152" stroke-width="2"/>
    ${[38, 31, 24].map(r => `<circle cx="70" cy="55" r="${r}" fill="none" stroke="#2a3040" stroke-width="1.5"/>`).join('')}
    <circle cx="70" cy="55" r="15" fill="${CORAIL}"/><circle cx="70" cy="55" r="3" fill="#0d1016"/>
    <path d="M70 13a42 42 0 0 1 36 21" fill="none" stroke="${CLAIR}" stroke-width="2" stroke-linecap="round" opacity=".35"/>
    <path d="M142 14v40" stroke="${ACIER}" stroke-width="3" stroke-linecap="round"/>
    <path d="M142 54l-22 18" stroke="${ACIER}" stroke-width="3" stroke-linecap="round"/>
    <rect x="113" y="68" width="12" height="8" rx="2" transform="rotate(-40 119 72)" fill="${LAITON}"/>`),

  breaks: svgIllus(`
    ${dessinFut(42, 44, 22, 8, 22, ACIER)}${dessinFut(88, 38, 24, 9, 24, ACIER)}${dessinFut(126, 62, 26, 10, 30, ACIER)}
    <path d="M30 20q12-14 26-2M78 12q12-12 24 0M118 34q12-12 22 0" fill="none" stroke="${LAITON}" stroke-width="2.2" stroke-linecap="round"/>
    ${baguette(20, 98, 44, 58)}`),

  rudiments: svgIllus(`
    <ellipse cx="62" cy="62" rx="44" ry="15" fill="#0d1016" stroke="#3a4152" stroke-width="2"/>
    <ellipse cx="62" cy="58" rx="44" ry="15" fill="#262c39" stroke="${ACIER}" stroke-width="2"/>
    <ellipse cx="62" cy="58" rx="26" ry="8.5" fill="#1c212c"/>
    ${baguette(24, 18, 54, 55)}${baguette(104, 16, 72, 55)}
    <text x="62" y="100" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-weight="600" font-size="14" letter-spacing="3">
      <tspan fill="${LAITON}">D</tspan><tspan fill="${CORAIL}">G</tspan><tspan fill="${LAITON}">DD</tspan>
    </text>
    <text x="140" y="44" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-weight="600" font-size="12" fill="${ACIER}">×4</text>`),

  progression: svgIllus(`
    ${[18, 32, 26, 48, 40, 62, 76].map((h, i) =>
      `<rect x="${16 + i * 19}" y="${96 - h}" width="12" height="${h}" rx="3" fill="${i === 6 ? LAITON : '#3a4152'}"/>`).join('')}
    <path d="M22 70L41 58L60 64L79 42L98 50L117 28L136 14" fill="none" stroke="${CORAIL}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="136" cy="14" r="4" fill="${CORAIL}"/>`)
};

/* Batterie vue de face, qui se complète à chaque niveau (1 à 6) */
export function kitNiveau(n){
  const parts = [];
  if (n >= 5) parts.push(dessinCymbale(126, 22, 26, LAITON));          // ride
  if (n >= 4) parts.push(dessinCymbale(34, 16, 22, LAITON));           // crash
  if (n >= 2) parts.push(dessinCymbale(18, 50, 16, LAITON));           // charleston
  if (n >= 4) parts.push(dessinFut(62, 34, 13, 5, 12, ACIER), dessinFut(96, 34, 14, 5, 13, ACIER));
  if (n >= 3) parts.push(`<circle cx="80" cy="76" r="26" fill="#1c212c" stroke="${VERT}" stroke-width="2.6"/>
      <circle cx="80" cy="76" r="18" fill="none" stroke="${VERT}" stroke-width="1.2" opacity=".5"/>`);
  if (n >= 5) parts.push(dessinFut(130, 62, 16, 6, 26, ACIER));         // tom basse
  parts.push(dessinFut(40, 70, 17, 6, 14, CORAIL));                      // caisse claire
  if (n >= 6) parts.push(`<rect x="62" y="100" width="12" height="6" rx="2" fill="${VERT}"/><rect x="86" y="100" width="12" height="6" rx="2" fill="${VERT}"/>`);
  if (n === 1) parts.push(baguette(20, 42, 36, 64), baguette(64, 40, 46, 64));
  return svgIllus(parts.join(''), '0 0 160 110');
}

/* Miniature d'un groove : trois lignes (cymbale, caisse claire, grosse caisse), une mesure */
export function miniGroove(motif, couleur = LAITON){
  const a = analyser(motif);
  const n = a.parMesure;
  const lignes = [
    ['CH', 'RD', 'CR'].map(id => a.pistes[id]).filter(Boolean),
    [a.pistes.CC, a.pistes.T1, a.pistes.T2, a.pistes.TB].filter(Boolean),
    [a.pistes.GC, a.pistes.HP].filter(Boolean)
  ];
  const coul = [couleur, CORAIL, VERT];
  const w = 148 / n;
  const r = Math.min(4.2, w * 0.36);
  let out = '';
  lignes.forEach((pistes, l) => {
    for (let s = 0; s < n; s++){
      const on = pistes.some(p => estNote(p[s]));
      const x = 6 + w * (s + 0.5);
      const y = 22 + l * 24;
      out += on
        ? `<circle cx="${x.toFixed(1)}" cy="${y}" r="${r.toFixed(1)}" fill="${coul[l]}"/>`
        : `<circle cx="${x.toFixed(1)}" cy="${y}" r="1.3" fill="#3a4152"/>`;
    }
  });
  for (let t = 0; t <= n; t += a.res)
    out += `<line x1="${(6 + w * t).toFixed(1)}" y1="10" x2="${(6 + w * t).toFixed(1)}" y2="82" stroke="#2a3040" stroke-width="1"/>`;
  return svgIllus(out, '0 0 160 92');
}

/* Doigté d'un rudiment en lettres : D en laiton, G en corail */
export function miniDoigte(doigte){
  const lettres = doigte.replace(/[\s-]/g, '').slice(0, 8).split('');
  const pas = 148 / Math.max(lettres.length, 4);
  return svgIllus(lettres.map((c, i) => {
    const x = 6 + pas * (i + 0.5);
    const d = c.toUpperCase() === 'D';
    return `<rect x="${(x - pas * 0.36).toFixed(1)}" y="${d ? 22 : 46}" width="${(pas * 0.72).toFixed(1)}" height="24" rx="5"
        fill="${d ? LAITON : CORAIL}" opacity="${c === c.toUpperCase() ? 1 : 0.55}"/>
      <text x="${x.toFixed(1)}" y="${d ? 39 : 63}" text-anchor="middle" font-family="'IBM Plex Mono',monospace"
        font-size="13" font-weight="600" fill="#12151c">${c.toUpperCase()}</text>`;
  }).join(''), '0 0 160 92');
}
