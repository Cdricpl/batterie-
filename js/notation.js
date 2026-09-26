/* Rendu de partition batterie en SVG, avec :
 *  - portée 5 lignes, clé de percussion, chiffrage
 *  - hampes, ligatures (croches / doubles-croches / triolets), silences
 *  - accents, ghost notes, charleston ouvert, flams
 *  - comptage sous la portée + tête de lecture qui suit la musique
 */
import { INSTRUMENTS, estNote } from './instruments.js';

const NS = 'http://www.w3.org/2000/svg';

/* ---------- géométrie ---------- */
const G = {
  hauteur: 196,
  yBase: 100,        // y de la position 0 (ligne du bas)
  demi: 5,           // 1 position = 5 px
  margeG: 64,
  padMesure: 14,
  hampe: 30,
  teteRx: 5.1,
  teteRy: 4.0
};
const yPos = p => G.yBase - p * G.demi;
const FONTE_TITRE = "'Big Shoulders Display', Oswald, Impact, 'Arial Narrow', sans-serif";
const FONTE_CHIFFRES = "'IBM Plex Mono', ui-monospace, Menlo, Consolas, monospace";

function el(nom, attrs = {}, parent = null){
  const e = document.createElementNS(NS, nom);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (parent) parent.appendChild(e);
  return e;
}

/* ---------- valeurs de notes ---------- */
// b = durée en temps (noire = 1) ; l = nombre de ligatures ; p = point
const BINAIRE = [
  {b:4,l:0,p:0,r:'ronde'}, {b:3,l:0,p:1,r:'blanche'}, {b:2,l:0,p:0,r:'blanche'},
  {b:1.5,l:0,p:1,r:'noire'}, {b:1,l:0,p:0,r:'noire'},
  {b:0.75,l:1,p:1,r:'croche'}, {b:0.5,l:1,p:0,r:'croche'},
  {b:0.375,l:2,p:1,r:'double'}, {b:0.25,l:2,p:0,r:'double'},
  {b:0.125,l:3,p:0,r:'double'}
];
const TERNAIRE = [
  {b:4,l:0,p:0,r:'ronde'}, {b:2,l:0,p:0,r:'blanche'}, {b:1,l:0,p:0,r:'noire'},
  {b:2/3,l:0,p:0,r:'noire'}, {b:1/3,l:1,p:0,r:'croche'}, {b:1/6,l:2,p:0,r:'double'}
];
const EPS = 1e-6;

/* Syllabes de comptage selon le nombre de pas par temps */
const SYLLABES = {
  1: [''], 2: ['', 'et'], 3: ['', 'la', 'li'], 4: ['', 'e', 'et', 'a'],
  6: ['', '', 'la', '', 'li', ''], 8: ['', '', 'e', '', 'et', '', 'a', '']
};
const SYLLABES_COURTES = {
  2: ['', '+'], 3: ['', 'la', 'li'], 4: ['', 'e', '+', 'a'],
  6: ['', '', 'la', '', 'li', ''], 8: ['', '', 'e', '', '+', '', 'a', '']
};

function table(res){ return (res % 3 === 0 && res !== 6) || res === 3 || res === 6 ? TERNAIRE : BINAIRE; }

/* Quand l'unité de temps est la croche (mesures en x/8), toute la notation
 * descend d'un cran : une pulsation s'écrit en croche et non en noire. */
const SUIVANTE = { ronde:'blanche', blanche:'noire', noire:'croche', croche:'double', double:'double' };
function ajusterUnite(v, unite){
  if (unite !== 8) return v;
  return { b:v.b, p:v.p, l:v.l + 1, r:SUIVANTE[v.r] };
}
function valeurPour(dureeTemps, res, unite){
  const t = table(res);
  for (const v of t) if (v.b <= dureeTemps + EPS) return ajusterUnite(v, unite);
  return ajusterUnite(t[t.length - 1], unite);
}

/* Découpe une durée en une note + les silences qui complètent. */
function decouper(startStep, dureeSteps, res, unite = 4){
  const out = [];
  let pos = startStep, reste = dureeSteps, premier = true;
  let garde = 0;
  while (reste > EPS && garde++ < 32){
    const offset = pos % res;
    // en notation batterie on n'écrit pas de valeur plus longue qu'une noire :
    // une note tenue devient une noire suivie de silences.
    const maxSteps = Math.min(reste, (Math.abs(offset) < EPS) ? res : res - offset);
    const v = valeurPour(maxSteps / res, res, unite);
    const steps = v.b * res * (v.p ? 1 : 1);
    out.push({ step: pos, steps, val: v, silence: !premier });
    pos += steps; reste -= steps; premier = false;
  }
  return out;
}

/* ---------- analyse d'un motif ---------- */
export function analyser(motif){
  const beats = motif.beats ?? 4;
  const res = motif.res ?? 4;
  const bars = motif.bars ?? 1;
  const unite = motif.unite ?? 4;
  const parMesure = beats * res;
  const total = parMesure * bars;

  const pistes = {};
  for (const [id, str] of Object.entries(motif.tracks)){
    const s = (str || '').replace(/[|\s]/g, '');
    pistes[id] = s.padEnd(total, '-').slice(0, total);
  }
  return { beats, res, bars, unite, parMesure, total, pistes };
}

/* Liste des frappes {step, inst, signe} triée */
export function frappes(motif){
  const a = analyser(motif);
  const out = [];
  for (let s = 0; s < a.total; s++){
    for (const [id, str] of Object.entries(a.pistes)){
      const c = str[s];
      if (estNote(c)) out.push({ step: s, inst: id, signe: c });
    }
  }
  out.sort((x, y) => x.step - y.step);
  return out;
}

/* ---------- glyphes ---------- */
function tete(g, x, y, inst, signe){
  const def = INSTRUMENTS[inst];
  const coul = def.couleur;
  if (def.head === 'x'){
    const r = 4.6;
    el('line', {x1:x-r, y1:y-r, x2:x+r, y2:y+r, stroke:coul, 'stroke-width':2.1, 'stroke-linecap':'round'}, g);
    el('line', {x1:x-r, y1:y+r, x2:x+r, y2:y-r, stroke:coul, 'stroke-width':2.1, 'stroke-linecap':'round'}, g);
  } else {
    el('ellipse', {cx:x, cy:y, rx:G.teteRx, ry:G.teteRy, fill:coul,
      transform:`rotate(-18 ${x} ${y})`}, g);
  }
  if (signe === 'g'){ // ghost note : entre parenthèses
    el('text', {class:'txt-faible', x:x-10, y:y+4, fill:'#9aa0a6', 'font-size':13}, g).textContent = '(';
    el('text', {class:'txt-faible', x:x+6, y:y+4, fill:'#9aa0a6', 'font-size':13}, g).textContent = ')';
  }
}

function pointRythme(g, x, y){ el('circle', {class:'ink', cx:x + 10, cy:y - 2, r:1.7, fill:'#e9e4dc'}, g); }

function silence(g, x, y, val){
  const c = '#8d8579';
  const K = 'silence';
  switch (val.r){
    case 'ronde':   el('rect', {class:K, x:x-6, y:y-14, width:12, height:5, fill:c}, g); break;
    case 'blanche': el('rect', {class:K, x:x-6, y:y-5,  width:12, height:5, fill:c}, g); break;
    case 'noire':
      el('path', {class:K, d:`M ${x-3} ${y-12} q 7 5 2 10 q -6 5 1 10 q -6 -3 -3 -8 q -6 3 -1 -4 q 4 -4 -1 -8 z`,
        fill:c}, g); break;
    case 'croche':
      el('path', {class:K, d:`M ${x+3} ${y-11} l -5 14 M ${x+3} ${y-11} q -5 4 -8 1 q 4 5 8 -1`,
        fill:'none', stroke:c, 'stroke-width':1.8, 'stroke-linecap':'round'}, g);
      el('circle', {class:K, cx:x-4, cy:y-10, r:2, fill:c}, g); break;
    default: // double croche
      el('path', {class:K, d:`M ${x+4} ${y-12} l -6 18`, fill:'none', stroke:c, 'stroke-width':1.8, 'stroke-linecap':'round'}, g);
      el('circle', {class:K, cx:x-3, cy:y-9, r:2, fill:c}, g);
      el('circle', {class:K, cx:x-5, cy:y-1, r:2, fill:c}, g);
  }
  if (val.p) pointRythme(g, x, y);
}

function drapeau(g, x, y, nb, versLeHaut){
  const s = versLeHaut ? 1 : -1;
  for (let i = 0; i < nb; i++){
    const yy = y + s * i * 7;
    el('path', {class:'hampe', d:`M ${x} ${yy} q 9 4 8 13`, fill:'none', stroke:'#e9e4dc', 'stroke-width':2.4,
      'stroke-linecap':'round', transform: versLeHaut ? '' : `scale(1,-1) translate(0,${-2*yy})`}, g);
  }
}

/* ---------- rendu principal ---------- */
export function dessinerPortee(motif, opts = {}){
  const a = analyser(motif);
  const { beats, res, bars, unite, parMesure, total } = a;
  // en 6/8, 9/8… on ligature par groupes de trois croches
  const groupe = (unite === 8 && beats % 3 === 0) ? res * 3 : res;

  const stepW = res >= 8 ? 15 : res === 6 ? 19 : res >= 4 ? 24 : res === 3 ? 30 : res === 2 ? 38 : 56;
  const largeurMesure = parMesure * stepW + G.padMesure * 2;
  const largeur = G.margeG + largeurMesure * bars + 26;

  const sections = motif.sections || [];
  const decalY = sections.length ? 22 : 0;
  const hauteur = G.hauteur + decalY;
  const svg = el('svg', {
    class: 'portee', width: largeur, height: hauteur,
    viewBox: `0 0 ${largeur} ${hauteur}`, xmlns: NS
  });
  const racine = el('g', { transform: `translate(0 ${decalY})` }, svg);

  const xDe = (stepFlottant) => {
    const b = Math.min(bars - 1, Math.floor(stepFlottant / parMesure));
    const dans = stepFlottant - b * parMesure;
    return G.margeG + b * largeurMesure + G.padMesure + dans * stepW;
  };

  /* portée */
  const fond = el('g', {}, racine);
  for (let p = 0; p <= 8; p += 2){
    el('line', {class:'ligne', x1:20, y1:yPos(p), x2:largeur - 14, y2:yPos(p), stroke:'#7a7062', 'stroke-width':1}, fond);
  }
  // clé de percussion
  el('rect', {class:'ink', x:30, y:yPos(7), width:4, height:yPos(1)-yPos(7), fill:'#e9e4dc'}, fond);
  el('rect', {class:'ink', x:38, y:yPos(7), width:4, height:yPos(1)-yPos(7), fill:'#e9e4dc'}, fond);
  // chiffrage
  const sig = el('text', {class:'ink', x:G.margeG - 14, y:yPos(6)+4, fill:'#e9e4dc', 'font-size':21, 'font-weight':800,
    'text-anchor':'middle', 'font-family':FONTE_TITRE}, fond);
  sig.textContent = String(motif.beats ?? 4);
  const sig2 = el('text', {class:'ink', x:G.margeG - 14, y:yPos(2)+4, fill:'#e9e4dc', 'font-size':21, 'font-weight':800,
    'text-anchor':'middle', 'font-family':FONTE_TITRE}, fond);
  sig2.textContent = String(motif.unite ?? 4);

  // barres de mesure + numéros
  for (let b = 0; b <= bars; b++){
    const x = G.margeG + b * largeurMesure - 6;
    if (b > 0) el('line', {class:'ligne', x1:x, y1:yPos(8), x2:x, y2:yPos(0), stroke:'#8a806f', 'stroke-width':1.4}, fond);
    if (b < bars){
      const n = el('text', {class:'txt-faible', x:x + 8, y:yPos(8) - 26, fill:'#a39884', 'font-size':10, 'font-weight':600}, fond);
      n.textContent = String(b + 1 + (opts.premiereMesure || 0));
    }
  }
  // double barre finale
  const xf = G.margeG + bars * largeurMesure - 6;
  if (opts.barreFinale !== false)
    el('line', {class:'ligne', x1:xf + 4, y1:yPos(8), x2:xf + 4, y2:yPos(0), stroke:'#8a806f', 'stroke-width':3.5}, fond);

  /* ---- construction des voix ---- */
  const voix = { up: new Map(), down: new Map() };
  for (const [id, str] of Object.entries(a.pistes)){
    const def = INSTRUMENTS[id]; if (!def) continue;
    for (let s = 0; s < total; s++){
      const c = str[s];
      if (!estNote(c)) continue;
      const m = voix[def.voice];
      if (!m.has(s)) m.set(s, []);
      m.get(s).push({ inst:id, signe:c, pos:def.pos });
    }
  }

  const notesParStep = new Map();  // step -> [<g>]
  const gNotes = el('g', {}, racine);

  for (const sens of ['up', 'down']){
    const versLeHaut = sens === 'up';
    const steps = [...voix[sens].keys()].sort((x, y) => x - y);
    if (!steps.length) continue;

    // événements avec durée (jamais à cheval sur une barre de mesure)
    const evts = steps.map((s, i) => {
      const mesure = Math.floor(s / parMesure);
      const finMesure = (mesure + 1) * parMesure;
      const suivant = i + 1 < steps.length ? steps[i + 1] : Infinity;
      return { step:s, duree: Math.min(suivant, finMesure) - s, notes: voix[sens].get(s) };
    });

    // éléments à dessiner (notes + silences)
    const items = [];
    let curseur = 0;
    for (const e of evts){
      if (e.step > curseur){
        for (const r of decouper(curseur, e.step - curseur, res, unite)) items.push({...r, silence:true});
      }
      const parts = decouper(e.step, e.duree, res, unite);
      items.push({ ...parts[0], silence:false, notes:e.notes });
      for (let k = 1; k < parts.length; k++) items.push({ ...parts[k], silence:true });
      curseur = e.step + e.duree;
    }
    if (curseur < total){
      for (const r of decouper(curseur, total - curseur, res, unite)) items.push({...r, silence:true});
    }

    // groupes de ligature : notes ligaturables consécutives dans le même temps
    const groupes = [];
    let g = [];
    let temps = -1;
    for (const it of items){
      const tp = Math.floor(it.step / groupe);
      const ok = !it.silence && it.val.l > 0;
      if (!ok || tp !== temps){ if (g.length) groupes.push(g); g = []; }
      if (ok){ temps = tp; g.push(it); }
      else temps = -1;
    }
    if (g.length) groupes.push(g);
    const dansGroupe = new Map();
    groupes.forEach((grp, i) => { if (grp.length > 1) grp.forEach(it => dansGroupe.set(it, i)); });

    // y de ligature par groupe
    const beamY = groupes.map(grp => {
      if (grp.length < 2) return null;
      const ys = grp.map(it => {
        const ps = it.notes.map(n => n.pos);
        return versLeHaut ? yPos(Math.max(...ps)) : yPos(Math.min(...ps));
      });
      return versLeHaut ? Math.min(...ys) - G.hampe : Math.max(...ys) + G.hampe;
    });

    for (const it of items){
      const x = xDe(it.step);
      const grp = el('g', { class:'note-grp', 'data-step': it.step }, gNotes);

      if (it.silence){
        silence(grp, x, versLeHaut ? yPos(6) : yPos(2), it.val);
        continue;
      }

      const positions = it.notes.map(n => n.pos);
      const pHaut = Math.max(...positions), pBas = Math.min(...positions);

      // lignes supplémentaires
      for (const p of positions){
        if (p >= 10) el('line', {class:'ligne', x1:x-9, y1:yPos(10), x2:x+9, y2:yPos(10), stroke:'#7a7062', 'stroke-width':1}, grp);
        if (p <= -2) el('line', {class:'ligne', x1:x-9, y1:yPos(-2), x2:x+9, y2:yPos(-2), stroke:'#7a7062', 'stroke-width':1}, grp);
      }

      // hampe
      const gi = dansGroupe.get(it);
      const yA = versLeHaut ? yPos(pBas) : yPos(pHaut);
      let yB = (gi !== undefined && beamY[gi] != null)
        ? beamY[gi]
        : (versLeHaut ? yPos(pHaut) - G.hampe : yPos(pBas) + G.hampe);
      const xh = versLeHaut ? x + G.teteRx - 0.4 : x - G.teteRx + 0.4;
      if (it.val.b < 4 - EPS){
        el('line', {class:'hampe', x1:xh, y1:yA, x2:xh, y2:yB, stroke:'#e9e4dc', 'stroke-width':1.7, 'stroke-linecap':'round'}, grp);
      }
      // drapeau si non ligaturée
      if (it.val.l > 0 && gi === undefined) drapeau(grp, xh, yB, it.val.l, versLeHaut);

      // têtes de notes + signes
      for (const n of it.notes){
        const y = yPos(n.pos);
        tete(grp, x, y, n.inst, n.signe);
        if (n.signe === 'o'){ // charleston ouvert
          el('circle', {cx:x, cy:y - 11, r:3.4, fill:'none', stroke:INSTRUMENTS[n.inst].couleur, 'stroke-width':1.5}, grp);
        }
        if (n.signe === 'd'){ // drag : deux petites notes d'agrément
          for (const dx of [-17, -11]){
            el('ellipse', {class:'ink', cx:x+dx, cy:y+2, rx:2.6, ry:2.1, fill:'#c9c2b6', transform:`rotate(-18 ${x+dx} ${y+2})`}, grp);
            el('line', {class:'hampe', x1:x+dx+2.4, y1:y+2, x2:x+dx+2.4, y2:y-11, stroke:'#c9c2b6', 'stroke-width':1.1}, grp);
          }
          el('line', {class:'hampe', x1:x-14.6, y1:y-11, x2:x-6.6, y2:y-11, stroke:'#c9c2b6', 'stroke-width':1.6}, grp);
          el('line', {class:'hampe', x1:x-14.6, y1:y-8, x2:x-6.6, y2:y-8, stroke:'#c9c2b6', 'stroke-width':1.6}, grp);
        }
        if (n.signe === 'f'){ // flam : petite note d'agrément
          el('ellipse', {class:'ink', cx:x-11, cy:y+2, rx:3, ry:2.4, fill:'#c9c2b6', transform:`rotate(-18 ${x-11} ${y+2})`}, grp);
          el('line', {class:'hampe', x1:x-8.2, y1:y+2, x2:x-8.2, y2:y-13, stroke:'#c9c2b6', 'stroke-width':1.2}, grp);
          el('line', {class:'hampe', x1:x-13, y1:y-6, x2:x-4, y2:y-11, stroke:'#c9c2b6', 'stroke-width':1.2}, grp);
        }
      }
      if (it.val.p) pointRythme(grp, x, yPos(pHaut));
      // accent
      if (it.notes.some(n => n.signe === 'X')){
        const yAcc = versLeHaut ? Math.min(yB, yPos(pHaut)) - 10 : yPos(pHaut) - 12;
        el('path', {class:'accent', d:`M ${x-6} ${yAcc-4} L ${x+6} ${yAcc} L ${x-6} ${yAcc+4}`, fill:'none',
          stroke:'#f0c969', 'stroke-width':1.8, 'stroke-linecap':'round'}, grp);
      }

      if (!notesParStep.has(it.step)) notesParStep.set(it.step, []);
      notesParStep.get(it.step).push(grp);
    }

    // ligatures
    groupes.forEach((grp, i) => {
      if (grp.length < 2) return;
      const y = beamY[i];
      const ep = 4.2, ecart = versLeHaut ? 6.5 : -6.5;
      const maxL = Math.max(...grp.map(it => it.val.l));
      for (let niveau = 1; niveau <= maxL; niveau++){
        let run = [];
        const flush = () => {
          if (!run.length) return;
          const x1 = xDe(run[0].step) + (versLeHaut ? G.teteRx - 1.2 : -G.teteRx - 0.4);
          let x2 = xDe(run[run.length - 1].step) + (versLeHaut ? G.teteRx + 0.5 : -G.teteRx + 1.6);
          if (run.length === 1) x2 = x1 + 9;   // ligature partielle
          const yy = y + (niveau - 1) * ecart - (versLeHaut ? ep : 0);
          el('rect', {class:'ligature', x:Math.min(x1,x2), y:yy, width:Math.abs(x2-x1), height:ep, fill:'#e9e4dc', rx:1}, gNotes);
          run = [];
        };
        for (const it of grp){
          if (it.val.l >= niveau) run.push(it);
          else flush();
        }
        flush();
      }
    });
  }

  /* indication des triolets (ternaire) */
  if (res % 3 === 0){
    const gT = el('g', {}, racine);
    const nbTemps = beats * bars;
    for (let t = 0; t < nbTemps; t++){
      const s0 = t * res;
      let aDesNotes = false;
      for (const str of Object.values(a.pistes))
        for (let k = 0; k < res; k++) if (estNote(str[s0 + k])) aDesNotes = true;
      if (!aDesNotes) continue;
      const x1 = xDe(s0) - 5, x2 = xDe(s0 + res - 1) + 6;
      const y = 16;
      el('path', {d:`M ${x1} ${y+5} L ${x1} ${y} L ${(x1+x2)/2 - 6} ${y} M ${(x1+x2)/2 + 6} ${y} L ${x2} ${y} L ${x2} ${y+5}`,
        fill:'none', stroke:'#8a806f', 'stroke-width':1, class:'ligne'}, gT);
      const tx = el('text', {class:'txt-faible', x:(x1+x2)/2, y:y + 4, 'text-anchor':'middle', 'font-size':11,
        'font-style':'italic', fill:'#a49a8c'}, gT);
      tx.textContent = '3';
    }
  }

  /* comptage sous la portée */
  if (opts.comptage !== false){
    const gC = el('g', {}, racine);
    const syll = SYLLABES[res] || [''];
    for (let s = 0; s < total; s++){
      const dansMesure = s % parMesure;
      const sub = dansMesure % res;
      const t = Math.floor(dansMesure / res) + 1;
      const txt = sub === 0 ? String(t) : syll[sub] ?? '';
      if (!txt) continue;
      const e = el('text', {x:xDe(s), y:yPos(0) + 52, 'text-anchor':'middle',
        'font-size': sub === 0 ? 12 : 10, 'font-weight': sub === 0 ? 700 : 400,
        fill: sub === 0 ? '#e9e4dc' : '#a39884', class:'compte', 'data-step':s,
        'font-family':FONTE_CHIFFRES}, gC);
      e.textContent = txt;
    }
  }

  /* tête de lecture */
  /* repères de section (morceaux) */
  if (sections.length){
    const gS = el('g', { class:'sections' }, svg);
    for (const sec of sections){
      const x = G.margeG + sec.debut * largeurMesure - 6;
      const lbl = sec.nom + (sec.fois > 1 ? `  ×${sec.fois}` : '');
      const w = Math.max(44, lbl.length * 6.2 + 16);
      el('rect', { class:'sec-boite', x, y:3, width:w, height:17, rx:3,
        fill:'#2a241d', stroke:'#d9a441', 'stroke-width':1 }, gS);
      const t = el('text', { class:'sec-txt', x:x + 7, y:15.5, 'font-size':12, 'font-weight':800,
        fill:'#f0d9a0', 'letter-spacing':'.06em', 'font-family':FONTE_TITRE }, gS);
      t.textContent = lbl.toUpperCase();
      // double barre au début de chaque section (sauf la première)
      if (sec.debut > 0){
        el('line', { class:'ligne', x1:x - 3, y1:yPos(8) + decalY, x2:x - 3, y2:yPos(0) + decalY,
          stroke:'#8a806f', 'stroke-width':1.4 }, gS);
      }
    }
  }

  const tete0 = el('rect', {x:0, y:yPos(10) - 22, width:2.5, height: yPos(0) - yPos(10) + 86,
    fill:'#e5584b', rx:1.2, class:'playhead', opacity:0}, racine);

  return { svg, racine, xDe, largeur, total, notesParStep, playhead: tete0 };
}

/* ---------- vue "grille" (plus simple pour débuter) ---------- */
export function dessinerGrille(motif){
  const a = analyser(motif);
  const { res, parMesure, total } = a;
  const ids = Object.keys(a.pistes).filter(id => INSTRUMENTS[id]);
  ids.sort((x, y) => INSTRUMENTS[y].pos - INSTRUMENTS[x].pos);

  const div = document.createElement('div');
  div.className = 'grille';
  const table = document.createElement('table');
  table.className = 'grille-table';

  const thead = document.createElement('thead');
  const trh = document.createElement('tr');
  trh.innerHTML = '<th class="lbl"></th>';
  for (let s = 0; s < total; s++){
    const th = document.createElement('th');
    const sub = (s % parMesure) % res;
    th.className = 'cel' + (sub === 0 ? ' temps' : '') + (s % parMesure === 0 ? ' mesure' : '');
    th.textContent = sub === 0 ? String(Math.floor((s % parMesure) / res) + 1)
      : ((SYLLABES_COURTES[res] || [])[sub] || '');
    trh.appendChild(th);
  }
  thead.appendChild(trh); table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (const id of ids){
    const def = INSTRUMENTS[id];
    const tr = document.createElement('tr');
    const th = document.createElement('th');
    th.className = 'lbl';
    th.innerHTML = `<span class="dot" style="background:${def.couleur}"></span>${def.court}`;
    tr.appendChild(th);
    for (let s = 0; s < total; s++){
      const td = document.createElement('td');
      const c = a.pistes[id][s];
      const sub = (s % parMesure) % res;
      td.className = 'cel' + (sub === 0 ? ' temps' : '') + (s % parMesure === 0 ? ' mesure' : '');
      td.dataset.step = s;
      td.dataset.inst = id;
      if (estNote(c)){
        const b = document.createElement('span');
        b.className = 'hit s-' + c;
        b.style.background = def.couleur;
        b.title = def.nom;
        if (c === 'o') b.textContent = 'o';
        if (c === 'X') b.textContent = '>';
        if (c === 'g') b.textContent = 'g';
        if (c === 'f') b.textContent = 'fl';
        td.appendChild(b);
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  div.appendChild(table);
  return div;
}

/* Légende des éléments présents dans le motif */
export function legende(motif){
  const a = analyser(motif);
  const ids = Object.keys(a.pistes).filter(id => INSTRUMENTS[id] && [...a.pistes[id]].some(estNote));
  ids.sort((x, y) => INSTRUMENTS[y].pos - INSTRUMENTS[x].pos);
  const d = document.createElement('div');
  d.className = 'legende';
  d.innerHTML = ids.map(id => {
    const i = INSTRUMENTS[id];
    const forme = i.head === 'x' ? '✕' : '●';
    return `<span class="lg"><span class="lg-sym" style="color:${i.couleur}">${forme}</span>${i.nom}</span>`;
  }).join('');
  return d;
}

/* Extrait les mesures [b0, b1[ d'un motif : sert à imprimer une longue partition
 * en plusieurs lignes, comme sur papier. */
export function tranche(motif, b0, b1){
  const a = analyser(motif);
  const d = b0 * a.parMesure, f = b1 * a.parMesure;
  const tracks = {};
  for (const [id, str] of Object.entries(a.pistes)) tracks[id] = str.slice(d, f);
  const t = { ...motif, bars: b1 - b0, tracks };
  if (motif.doigte) t.doigte = motif.doigte.replace(/\s/g, '').slice(d, f);
  if (motif.sections) t.sections = motif.sections
    .filter(sec => sec.debut >= b0 && sec.debut < b1)
    .map(sec => ({ ...sec, debut: sec.debut - b0, fin: Math.min(sec.fin, b1) - b0 }));
  return t;
}
