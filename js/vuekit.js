/* Affichage « Batterie » : le kit en 3D, vu depuis le tabouret (de derrière, un peu au-dessus).
 * Chaque élément garde sa couleur : fûts laqués, cymbales en bronze cerclées de couleur.
 * Avant chaque coup, un anneau se resserre sur l'élément à frapper (un temps d'avance) ;
 * au moment du coup, l'élément s'allume et bouge (la peau rebondit, la cymbale vibre,
 * la batte part vers la peau), avec la main à utiliser (D / G) ou le pied (P).
 * Disposition d'après le kit de la photo : charleston à gauche, caisse claire devant,
 * deux toms sur la grosse caisse, tom basse et ride à droite, crash en hauteur à gauche. */
import { estNote } from './instruments.js';
import { analyser } from './notation.js';

const NS_VUE = 'http://www.w3.org/2000/svg';

/* x, y : centre de la peau (ou de la cymbale) ; rx, ry : ellipse vue en perspective ;
 * h : hauteur visible du fût ; rot : inclinaison de la cymbale ; pied : bas du pied de cymbale */
const PADS = {
  CR:{ forme:'cymbale', x:188, y:80,  rx:66, ry:15, rot:-7, pied:[150, 342], couleur:'#f59e0b', nom:'Crash' },
  RD:{ forme:'cymbale', x:655, y:96,  rx:74, ry:17, rot:6,  pied:[700, 342], couleur:'#d97706', nom:'Ride' },
  CH:{ forme:'charley', x:98,  y:196, rx:52, ry:12, rot:0,  couleur:'#eab308', nom:'Charley' },
  T1:{ forme:'fut', x:318, y:128, rx:46, ry:17, h:40, couleur:'#3b82f6', nom:'Tom 1' },
  T2:{ forme:'fut', x:470, y:124, rx:50, ry:19, h:46, couleur:'#6366f1', nom:'Tom 2' },
  CC:{ forme:'fut', x:232, y:240, rx:58, ry:21, h:30, couleur:'#ef4444', nom:'Claire' },
  TB:{ forme:'fut', x:604, y:236, rx:62, ry:23, h:74, couleur:'#8b5cf6', nom:'Tom basse' },
  GC:{ forme:'gc',  x:400, y:250, rx:76, ry:70, couleur:'#10b981', nom:'Grosse caisse' },
  HP:{ forme:'pedale', x:98, y:336, rx:32, ry:22, couleur:'#ec4899', nom:'Pied charley' }
};

let numeroVue = 0;                 // préfixe unique des dégradés, si deux vues coexistent

function noeud(nom, attrs, parent){
  const e = document.createElementNS(NS_VUE, nom);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (parent) parent.appendChild(e);
  return e;
}

/* éclaircit (f > 0) ou assombrit (f < 0) une couleur #rrggbb */
function nuance(hex, f){
  const n = parseInt(hex.slice(1), 16);
  return '#' + [n >> 16, (n >> 8) & 255, n & 255]
    .map(v => Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f))
    .map(v => v.toString(16).padStart(2, '0')).join('');
}

/* index du premier élément ≥ v dans un tableau trié */
function premierDes(tab, v){
  let a = 0, b = tab.length;
  while (a < b){ const m = (a + b) >> 1; if (tab[m] < v) a = m + 1; else b = m; }
  return a;
}

export function creerVueKit(motif, surToucher){
  const an = analyser(motif);
  const doigte = (motif.doigte || '').replace(/\s/g, '');
  const pre = `vk${++numeroVue}-`;
  const url = nom => `url(#${pre}${nom})`;
  const svg = noeud('svg', { viewBox:'0 0 760 378', class:'vue-kit', role:'img',
    'aria-label':'Batterie en 3D, vue depuis le tabouret' });

  // coups de chaque élément (pas triés)
  const coups = {};
  for (const [id, piste] of Object.entries(an.pistes)){
    const cle = id === 'CH_OPEN' ? 'CH' : id;
    if (!PADS[cle]) continue;
    const l = coups[cle] || (coups[cle] = []);
    for (let s = 0; s < piste.length; s++) if (estNote(piste[s])) l.push(s);
  }
  for (const l of Object.values(coups)) l.sort((a, b) => a - b);

  /* ---------- matières : chrome, peau, bronze, laque de chaque fût ---------- */
  const defs = noeud('defs', {}, svg);
  function degrade(nom, arrets, attrs = {}, radial = false){
    const d = noeud(radial ? 'radialGradient' : 'linearGradient', { id:pre + nom, ...attrs }, defs);
    for (const [o, c, a] of arrets) noeud('stop', { offset:o, 'stop-color':c, ...(a != null ? { 'stop-opacity':a } : {}) }, d);
  }
  degrade('chrome', [[0, '#6b7480'], [.22, '#f4f6f8'], [.5, '#9aa3ad'], [.78, '#e9edf1'], [1, '#6b7480']]);
  degrade('chrome-v', [[0, '#f4f6f8'], [.5, '#9aa3ad'], [1, '#e9edf1']], { x2:0, y2:1 });
  degrade('peau', [[0, '#ffffff'], [.7, '#f3efe7'], [1, '#e2dccf']], { cx:.42, cy:.36, r:.72 }, true);
  degrade('bronze', [[0, '#f7de98'], [.3, '#c8962e'], [.52, '#f3d58b'], [.76, '#b88428'], [1, '#8f5f17']], { x2:1, y2:1 });
  degrade('bronze-cloche', [[0, '#fff1c4'], [.6, '#d9a441'], [1, '#9a6a1c']], { cx:.4, cy:.3, r:.8 }, true);
  degrade('sol', [[0, '#6366f1', .13], [.7, '#6366f1', .05], [1, '#6366f1', 0]], {}, true);
  degrade('ombre', [[0, '#161c2d', .28], [1, '#161c2d', 0]], {}, true);
  for (const [id, p] of Object.entries(PADS)){
    const c = p.couleur;
    degrade('laque-' + id, [[0, nuance(c, -.5)], [.16, c], [.36, nuance(c, .5)], [.56, c], [1, nuance(c, -.55)]]);
    degrade('fond-' + id, [[0, nuance(c, -.55)], [1, nuance(c, -.2)]], { x2:0, y2:1 });
  }

  // tapis et compteur
  noeud('ellipse', { cx:392, cy:318, rx:372, ry:54, fill:url('sol') }, svg);
  const compteur = noeud('text', { x:380, y:24, 'text-anchor':'middle', class:'kit-compteur' }, svg);

  /* ---------- quincaillerie derrière les éléments : pieds, trépieds ---------- */
  const pieds = noeud('g', { class:'pieds' }, svg);
  const tige = (x1, y1, x2, y2, l = 4) =>
    noeud('line', { x1, y1, x2, y2, stroke:url('chrome-v'), 'stroke-width':l, 'stroke-linecap':'round' }, pieds);
  const ombre = (x, y, rx, ry) => noeud('ellipse', { cx:x, cy:y, rx, ry, fill:url('ombre') }, pieds);
  function trepied(x, y, haut){
    ombre(x, y + 4, 34, 7);
    tige(x, y - haut, x - 26, y + 2, 3); tige(x, y - haut, x + 26, y + 2, 3); tige(x, y - haut, x + 5, y + 9, 3);
  }
  for (const id of ['CR', 'RD']){
    const p = PADS[id];
    tige(p.x, p.y + 4, p.pied[0], p.pied[1] - 20, 5);
    trepied(p.pied[0], p.pied[1], 26);
  }
  { // charleston : tige jusqu'au sol, pédale entre les pieds
    const p = PADS.CH;
    tige(p.x, p.y + 10, p.x, 318, 5);
    trepied(p.x, 318, 22);
  }
  { // caisse claire : trépied sous le fût
    const p = PADS.CC, bas = p.y + p.h + p.ry;
    ombre(p.x, bas + 50, 60, 9);
    tige(p.x, bas - 4, p.x, bas + 22, 5);
    tige(p.x, bas + 18, p.x - 46, bas + 50, 3.5); tige(p.x, bas + 18, p.x + 46, bas + 50, 3.5); tige(p.x, bas + 18, p.x + 6, bas + 58, 3.5);
  }
  { // tom basse : trois pieds
    const p = PADS.TB, bas = p.y + p.h + p.ry;
    ombre(p.x, bas + 12, 78, 10);
    tige(p.x - p.rx + 4, p.y + p.h * .35, p.x - p.rx - 8, bas + 8, 4);
    tige(p.x + p.rx - 4, p.y + p.h * .35, p.x + p.rx + 8, bas + 8, 4);
  }
  ombre(PADS.GC.x, PADS.GC.y + PADS.GC.ry + 6, 96, 12);

  /* ---------- les éléments ---------- */
  const pads = {};
  function nouveauPad(id){
    const p = PADS[id];
    const g = noeud('g', { class:`pad ${p.forme}` + (coups[id] ? '' : ' absent'),
      'data-inst':id, style:`--p:${p.couleur}`, tabindex:'-1' }, svg);
    g.addEventListener('click', e => { e.stopPropagation(); surToucher && surToucher(id); allumer(id, ''); });
    const corps = noeud('g', { class:'corps' }, g);
    return { p, g, corps };
  }
  function finir(id, g, anneau, lettreXY, nomXY, rx, ry){
    const lettre = noeud('text', { x:lettreXY[0], y:lettreXY[1], 'text-anchor':'middle', class:'lettre' }, g);
    const nom = noeud('text', { x:nomXY[0], y:nomXY[1], 'text-anchor':'middle', class:'nom' }, g);
    nom.textContent = PADS[id].nom;
    pads[id] = { g, anneau, lettre, rx, ry, visible:false };
  }

  /* fût vu de trois quarts : peau, cercles chromés, coquilles de tension */
  function fut(id){
    const { p, g, corps } = nouveauPad(id);
    const { x, y, rx, ry, h } = p;
    noeud('path', { d:`M${x - rx},${y} L${x - rx},${y + h} A${rx},${ry} 0 0 0 ${x + rx},${y + h} L${x + rx},${y} Z`,
      fill:url('laque-' + id) }, corps);
    noeud('path', { d:`M${x - rx},${y + h} A${rx},${ry} 0 0 0 ${x + rx},${y + h}`,
      fill:'none', stroke:url('chrome'), 'stroke-width':4 }, corps);
    for (const a of [.3, .85, 1.57, 2.29, 2.84]){
      const lx = x + rx * Math.cos(a), ly = y + ry * Math.sin(a);
      noeud('rect', { x:(lx - 3.5).toFixed(1), y:(ly + h * .2).toFixed(1), width:7, height:Math.max(10, h * .6).toFixed(1),
        rx:3.5, fill:url('chrome-v'), stroke:'rgba(40,46,60,.35)', 'stroke-width':.8 }, corps);
    }
    if (id === 'CC'){           // déclencheur du timbre
      noeud('rect', { x:x + rx * .55, y:y + ry * .8 + h * .15, width:9, height:h * .6, rx:2, fill:'#39404d' }, corps);
    }
    noeud('ellipse', { cx:x, cy:y, rx:rx - 1.5, ry:ry - 1, fill:url('peau'), class:'cible' }, corps);
    noeud('ellipse', { cx:x, cy:y, rx:rx * .3, ry:ry * .3, fill:'rgba(120,110,95,.08)' }, corps);
    noeud('ellipse', { cx:x, cy:y, rx:rx * .92, ry:ry * .9, class:'eclat' }, corps);
    noeud('ellipse', { cx:x, cy:y, rx, ry, fill:'none', stroke:url('chrome'), 'stroke-width':5 }, corps);
    const anneau = noeud('ellipse', { cx:x, cy:y, rx, ry, class:'anneau' }, g);
    const dessous = id === 'CC' || id === 'TB';
    finir(id, g, anneau, [x, y + 10], [x, dessous ? y + h + ry + 17 : y - ry - 9], rx, ry);
  }

  /* une cymbale : dessous, bronze cerclé de couleur, sillons, cloche */
  function disque(parent, x, y, rx, ry, rot, retournee){
    const t = noeud('g', { transform:`rotate(${rot} ${x} ${y})` }, parent);
    noeud('ellipse', { cx:x, cy:y + 3, rx, ry, fill:'#7a5215' }, t);
    noeud('ellipse', { cx:x, cy:y, rx, ry, fill:url('bronze'), class:retournee ? '' : 'cible' }, t);
    for (const k of [.74, .5]) noeud('ellipse', { cx:x, cy:y, rx:rx * k, ry:ry * k, fill:'none', stroke:'rgba(110,70,15,.3)', 'stroke-width':1.2 }, t);
    if (!retournee){
      noeud('ellipse', { cx:x, cy:y - 2, rx:rx * .22, ry:ry * .6, fill:url('bronze-cloche') }, t);
      noeud('rect', { x:x - 3, y:y - ry * .6 - 7, width:6, height:7, rx:1.5, fill:url('chrome-v') }, t);
      noeud('ellipse', { cx:x, cy:y, rx:rx * .95, ry:ry * .9, class:'eclat' }, t);
    }
    noeud('ellipse', { cx:x, cy:y, rx, ry, fill:'none', stroke:'var(--p)', 'stroke-width':3 }, t);
    return t;
  }
  function cymbale(id){
    const { p, g, corps } = nouveauPad(id);
    disque(corps, p.x, p.y, p.rx, p.ry, p.rot);
    const anneau = noeud('ellipse', { cx:p.x, cy:p.y, rx:p.rx, ry:p.ry, class:'anneau', transform:`rotate(${p.rot} ${p.x} ${p.y})` }, g);
    finir(id, g, anneau, [p.x, p.y + 10], [p.x, p.y - p.ry - 12], p.rx, p.ry);
  }
  function charley(id){
    const { p, g, corps } = nouveauPad(id);
    disque(corps, p.x, p.y + 10, p.rx, p.ry, 0, true);
    const dessus = noeud('g', { class:'dessus' }, corps);
    disque(dessus, p.x, p.y, p.rx, p.ry, 0);
    const anneau = noeud('ellipse', { cx:p.x, cy:p.y, rx:p.rx, ry:p.ry, class:'anneau' }, g);
    finir(id, g, anneau, [p.x, p.y + 10], [p.x, p.y - p.ry - 12], p.rx, p.ry);
  }

  /* pédale : semelle chromée, plaque de couleur */
  function semelle(parent, x, y, cible){
    noeud('path', { d:`M${x - 13},${y - 16} L${x + 13},${y - 16} L${x + 18},${y + 20} L${x - 18},${y + 20} Z`,
      fill:'#39404d', stroke:url('chrome'), 'stroke-width':2.5, 'stroke-linejoin':'round' }, parent);
    noeud('path', { d:`M${x - 9},${y - 11} L${x + 9},${y - 11} L${x + 12},${y + 15} L${x - 12},${y + 15} Z`,
      fill:'var(--p)', class:cible ? 'cible plaque' : 'plaque' }, parent);
    noeud('rect', { x:x - 20, y:y + 17, width:40, height:6, rx:3, fill:url('chrome-v') }, parent);
  }
  function pedale(id){
    const { p, g, corps } = nouveauPad(id);
    semelle(corps, p.x, p.y, true);
    const anneau = noeud('ellipse', { cx:p.x, cy:p.y + 2, rx:p.rx, ry:p.ry, class:'anneau' }, g);
    finir(id, g, anneau, [p.x, p.y + 12], [p.x, p.y + 34], p.rx, p.ry);
  }

  /* grosse caisse : vue de derrière, peau de frappe face au batteur, fût qui fuit vers l'avant */
  function grosseCaisse(id){
    const { p, g, corps } = nouveauPad(id);
    const { x, y, rx, ry } = p, prof = 28;
    noeud('ellipse', { cx:x, cy:y - prof, rx, ry, fill:url('fond-' + id), stroke:url('chrome'), 'stroke-width':5 }, corps);
    noeud('rect', { x:x - rx, y:y - prof, width:rx * 2, height:prof, fill:url('laque-' + id) }, corps);
    for (const a of [.45, .95, 1.57, 2.19, 2.69]){
      const lx = x + rx * Math.cos(a), ly = y - ry * Math.sin(a);
      noeud('rect', { x:(lx - 4).toFixed(1), y:(ly - prof + 4).toFixed(1), width:8, height:prof - 8, rx:4,
        fill:url('chrome-v'), stroke:'rgba(40,46,60,.35)', 'stroke-width':.8 }, corps);
    }
    // éperons
    for (const s of [-1, 1]) noeud('line', { x1:x + s * rx * .8, y1:y + ry * .5, x2:x + s * (rx + 18), y2:y + ry + 8,
      stroke:url('chrome-v'), 'stroke-width':4, 'stroke-linecap':'round' }, corps);
    noeud('ellipse', { cx:x, cy:y, rx:rx - 2, ry:ry - 2, fill:url('peau'), class:'cible' }, corps);
    noeud('ellipse', { cx:x, cy:y, rx:rx * .64, ry:ry * .64, fill:'none', stroke:'var(--p)', 'stroke-width':9, opacity:.85 }, corps);
    noeud('ellipse', { cx:x, cy:y, rx:rx * .95, ry:ry * .95, class:'eclat' }, corps);
    noeud('ellipse', { cx:x, cy:y, rx, ry, fill:'none', stroke:url('chrome'), 'stroke-width':8 }, corps);
    // pédale et batte
    semelle(g, x, y + ry + 26, false);
    const batte = noeud('g', { class:'batte' }, g);
    noeud('line', { x1:x, y1:y + ry + 8, x2:x, y2:y + ry * .56, stroke:url('chrome-v'), 'stroke-width':4, 'stroke-linecap':'round' }, batte);
    noeud('ellipse', { cx:x, cy:y + ry * .52, rx:10, ry:8, fill:'#fff', stroke:'#39404d', 'stroke-width':2 }, batte);
    const anneau = noeud('ellipse', { cx:x, cy:y, rx, ry, class:'anneau' }, g);
    finir(id, g, anneau, [x, y + 6], [x, y - ry * .28], rx, ry);
  }

  /* du fond vers l'avant, pour que les éléments proches recouvrent les autres */
  cymbale('CR'); cymbale('RD');
  grosseCaisse('GC');
  { // supports des toms, plantés dans la grosse caisse
    const s = noeud('g', { class:'pieds' }, svg);
    for (const id of ['T1', 'T2']){
      const p = PADS[id], cote = id === 'T1' ? -1 : 1;
      noeud('line', { x1:p.x - cote * p.rx * .3, y1:p.y + p.h + p.ry * .6, x2:PADS.GC.x + cote * 14, y2:PADS.GC.y - PADS.GC.ry - 20,
        stroke:url('chrome-v'), 'stroke-width':6, 'stroke-linecap':'round' }, s);
    }
    noeud('rect', { x:PADS.GC.x - 22, y:PADS.GC.y - PADS.GC.ry - 28, width:44, height:12, rx:4, fill:url('chrome') }, s);
  }
  fut('T1'); fut('T2');
  charley('CH');
  fut('TB'); fut('CC');
  pedale('HP');

  const minuteries = {};
  function allumer(id, texte){
    const pad = pads[id];
    if (!pad) return;
    pad.lettre.textContent = texte;
    pad.g.classList.remove('frappe');
    void pad.g.getBBox();                        // relance l'animation même sur deux coups rapprochés
    pad.g.classList.add('frappe');
    clearTimeout(minuteries[id]);
    minuteries[id] = setTimeout(() => pad.g.classList.remove('frappe'), 300);
  }

  /* un coup vient de tomber (même horloge que le son) */
  function frappe(notes, step){
    for (const n of notes){
      const id = n.inst === 'CH_OPEN' ? 'CH' : n.inst;
      let main = '';
      if (id === 'GC' || id === 'HP') main = 'P';
      else if (doigte[step] === 'D' || doigte[step] === 'G') main = doigte[step];
      allumer(id, main);
    }
  }

  /* à chaque image : les anneaux d'anticipation, sur un temps d'avance */
  let dernierTemps = -1;
  function maj(pos, debut, fin){
    const longueur = fin - debut;
    for (const [id, l] of Object.entries(coups)){
      const pad = pads[id];
      let i = premierDes(l, pos);
      let prochain = l[i];
      if (prochain == null || prochain >= fin){               // on boucle : premier coup de la plage
        const j = premierDes(l, debut);
        prochain = l[j] != null && l[j] < fin ? l[j] + longueur : null;
      }
      const t = prochain == null ? 2 : (prochain - pos) / an.res;   // en temps
      if (t <= 1 && t >= 0){
        const k = 1 + 0.9 * t;
        pad.anneau.setAttribute('rx', (pad.rx * k).toFixed(1));
        pad.anneau.setAttribute('ry', (pad.ry * k).toFixed(1));
        pad.anneau.style.opacity = (0.95 * (1 - t) + 0.05).toFixed(2);
        pad.visible = true;
      } else if (pad.visible){
        pad.anneau.style.opacity = '0';
        pad.visible = false;
      }
    }
    const temps = Math.floor(pos / an.res);
    if (temps !== dernierTemps){
      dernierTemps = temps;
      compteur.textContent = `Mesure ${Math.floor(pos / an.parMesure) + 1} · temps ${temps % an.beats + 1}`;
    }
  }

  function effacer(){
    for (const pad of Object.values(pads)){ pad.anneau.style.opacity = '0'; pad.visible = false; }
    compteur.textContent = '';
    dernierTemps = -1;
  }
  effacer();

  return { svg, maj, frappe, allumer, effacer };
}
