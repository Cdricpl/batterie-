/* Affichage « Batterie » : le kit vu de dessus, chaque élément dans sa couleur.
 * Avant chaque coup, un anneau se resserre sur l'élément à frapper (un temps d'avance) ;
 * au moment du coup, l'élément s'allume, avec la main à utiliser (D / G) ou le pied (P).
 * Disposition d'après le kit de la photo : charleston à gauche, caisse claire devant,
 * deux toms au centre, tom basse et ride à droite, crash en hauteur à gauche. */
import { estNote } from './instruments.js';
import { analyser } from './notation.js';

const NS_VUE = 'http://www.w3.org/2000/svg';

const PADS = {
  CR:{ x:178, y:74,  r:60, cymbale:true, couleur:'#f59e0b', nom:'Crash' },
  RD:{ x:652, y:88,  r:68, cymbale:true, couleur:'#d97706', nom:'Ride' },
  CH:{ x:92,  y:192, r:50, cymbale:true, couleur:'#eab308', nom:'Charley' },
  T1:{ x:322, y:96,  r:46, couleur:'#3b82f6', nom:'Tom 1' },
  T2:{ x:458, y:96,  r:50, couleur:'#6366f1', nom:'Tom 2' },
  CC:{ x:226, y:222, r:52, couleur:'#ef4444', nom:'Claire' },
  TB:{ x:604, y:232, r:60, couleur:'#8b5cf6', nom:'Tom basse' },
  GC:{ x:414, y:240, r:66, couleur:'#10b981', nom:'Grosse caisse' },
  HP:{ x:92,  y:292, r:22, pedale:true, couleur:'#ec4899', nom:'Pied charley' }
};

function noeud(nom, attrs, parent){
  const e = document.createElementNS(NS_VUE, nom);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (parent) parent.appendChild(e);
  return e;
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
  const svg = noeud('svg', { viewBox:'0 0 760 344', class:'vue-kit', role:'img', 'aria-label':'Batterie vue de dessus' });

  // coups de chaque élément (pas triés)
  const coups = {};
  for (const [id, piste] of Object.entries(an.pistes)){
    const cle = id === 'CH_OPEN' ? 'CH' : id;
    if (!PADS[cle]) continue;
    const l = coups[cle] || (coups[cle] = []);
    for (let s = 0; s < piste.length; s++) if (estNote(piste[s])) l.push(s);
  }
  for (const l of Object.values(coups)) l.sort((a, b) => a - b);

  // compteur : mesure et temps en cours
  const compteur = noeud('text', { x:380, y:26, 'text-anchor':'middle', class:'kit-compteur' }, svg);

  const pads = {};
  const ordre = ['HP', 'GC', 'CC', 'T1', 'T2', 'TB', 'CH', 'CR', 'RD'];   // du bas vers le haut
  for (const id of ordre){
    const p = PADS[id];
    const g = noeud('g', { class:'pad' + (p.cymbale ? ' cymbale' : '') + (p.pedale ? ' pedale' : '') + (coups[id] ? '' : ' absent'),
      'data-inst':id, style:`--p:${p.couleur}`, tabindex:'-1' }, svg);
    if (p.pedale){
      noeud('rect', { x:p.x - 44, y:p.y - p.r, width:88, height:p.r * 2, rx:12, class:'fond' }, g);
      noeud('rect', { x:p.x - 30, y:p.y - p.r * 0.5, width:60, height:p.r, rx:8, class:'point' }, g);
    } else {
      noeud('circle', { cx:p.x, cy:p.y, r:p.r, class:'fond' }, g);
      if (p.cymbale){
        noeud('circle', { cx:p.x, cy:p.y, r:p.r * 0.66, class:'sillon' }, g);
        noeud('circle', { cx:p.x, cy:p.y, r:p.r * 0.36, class:'sillon' }, g);
      }
      noeud('circle', { cx:p.x, cy:p.y, r:p.r * 0.42, class:'point' }, g);
    }
    const anneau = noeud('circle', { cx:p.x, cy:p.y, r:p.r, class:'anneau' }, g);
    const lettre = noeud('text', { x:p.x, y:p.y + 9, 'text-anchor':'middle', class:'lettre' }, g);
    const nom = noeud('text', { x:p.x, y:p.pedale ? p.y + p.r + 17 : p.y + p.r + 17, 'text-anchor':'middle', class:'nom' }, g);
    nom.textContent = p.nom;
    g.addEventListener('click', e => { e.stopPropagation(); surToucher && surToucher(id); allumer(id, ''); });
    pads[id] = { g, anneau, lettre, r:p.pedale ? 28 : p.r, visible:false };
  }

  const minuteries = {};
  function allumer(id, texte){
    const pad = pads[id];
    if (!pad) return;
    pad.lettre.textContent = texte;
    pad.g.classList.remove('frappe');
    void pad.g.getBBox();                        // relance l'animation même sur deux coups rapprochés
    pad.g.classList.add('frappe');
    clearTimeout(minuteries[id]);
    minuteries[id] = setTimeout(() => pad.g.classList.remove('frappe'), 260);
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
        pad.anneau.setAttribute('r', (pad.r * (1 + 0.9 * t)).toFixed(1));
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
