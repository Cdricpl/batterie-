/* Schéma du kit, dessiné d'après la photo de l'installation :
 * charleston à gauche, caisse claire devant à gauche, deux toms au centre,
 * tom basse et grande ride à droite, crash en hauteur, grosse caisse au sol. */
import { INSTRUMENTS } from './instruments.js';

const NS = 'http://www.w3.org/2000/svg';

const ELEMENTS = [
  { id:'CR', type:'cymbale', x:195, y:44,  rx:60, ry:15, label:'Crash' },
  { id:'RD', type:'cymbale', x:424, y:86,  rx:68, ry:17, label:'Ride' },
  { id:'CH', type:'cymbale', x:74,  y:104, rx:44, ry:12, label:'Charleston' },
  { id:'T1', type:'fut',     x:207, y:140, rx:41, ry:34, label:'Tom 1' },
  { id:'T2', type:'fut',     x:301, y:148, rx:44, ry:36, label:'Tom 2' },
  { id:'TB', type:'fut',     x:410, y:222, rx:53, ry:44, label:'Tom basse' },
  { id:'CC', type:'fut',     x:116, y:228, rx:45, ry:37, label:'Caisse claire' },
  { id:'GC', type:'fut',     x:248, y:262, rx:88, ry:60, label:'Grosse caisse' },
  { id:'HP', type:'pedale',  x:46,  y:288, rx:23, ry:9,  label:'Pédale charley' }
];

export function dessinerKit(surClic){
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 500 330');
  svg.setAttribute('class', 'kit-svg');

  // pied de charleston + tige
  const tige = (x1,y1,x2,y2) => {
    const l = document.createElementNS(NS, 'line');
    l.setAttribute('x1',x1); l.setAttribute('y1',y1); l.setAttribute('x2',x2); l.setAttribute('y2',y2);
    l.setAttribute('stroke','#5a5247'); l.setAttribute('stroke-width','3');
    svg.appendChild(l);
  };
  tige(74,104,50,280); tige(195,52,205,120); tige(424,94,420,170);

  const map = {};
  for (const e of ELEMENTS){
    const def = INSTRUMENTS[e.id];
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'kit-el kit-' + e.type);
    g.setAttribute('data-inst', e.id);
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', 'button');
    g.setAttribute('aria-label', def.nom);

    if (e.type === 'fut'){
      const corps = document.createElementNS(NS, 'ellipse');
      corps.setAttribute('cx', e.x); corps.setAttribute('cy', e.y);
      corps.setAttribute('rx', e.rx); corps.setAttribute('ry', e.ry);
      corps.setAttribute('class', 'corps');
      corps.setAttribute('fill', '#1f1b17');
      corps.setAttribute('stroke', def.couleur);
      corps.setAttribute('stroke-width', '2.5');
      g.appendChild(corps);
      const peau = document.createElementNS(NS, 'ellipse');
      peau.setAttribute('cx', e.x); peau.setAttribute('cy', e.y);
      peau.setAttribute('rx', e.rx * 0.74); peau.setAttribute('ry', e.ry * 0.72);
      peau.setAttribute('class', 'peau');
      peau.setAttribute('fill', 'rgba(255,255,255,.05)');
      g.appendChild(peau);
    } else if (e.type === 'cymbale'){
      const c = document.createElementNS(NS, 'ellipse');
      c.setAttribute('cx', e.x); c.setAttribute('cy', e.y);
      c.setAttribute('rx', e.rx); c.setAttribute('ry', e.ry);
      c.setAttribute('class', 'corps');
      c.setAttribute('fill', 'rgba(217,164,65,.14)');
      c.setAttribute('stroke', def.couleur);
      c.setAttribute('stroke-width', '2.5');
      g.appendChild(c);
      const cl = document.createElementNS(NS, 'ellipse');
      cl.setAttribute('cx', e.x); cl.setAttribute('cy', e.y);
      cl.setAttribute('rx', e.rx * 0.22); cl.setAttribute('ry', e.ry * 0.35);
      cl.setAttribute('fill', 'none'); cl.setAttribute('stroke', def.couleur);
      cl.setAttribute('stroke-width', '1'); cl.setAttribute('opacity', '.6');
      g.appendChild(cl);
    } else {
      const r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', e.x - e.rx); r.setAttribute('y', e.y - e.ry);
      r.setAttribute('width', e.rx * 2); r.setAttribute('height', e.ry * 2);
      r.setAttribute('rx', 4); r.setAttribute('class', 'corps');
      r.setAttribute('fill', '#1f1b17'); r.setAttribute('stroke', def.couleur);
      r.setAttribute('stroke-width', '2');
      g.appendChild(r);
    }

    const t = document.createElementNS(NS, 'text');
    t.setAttribute('x', e.x);
    t.setAttribute('y', e.y + (e.type === 'fut' ? 5 : e.ry + 15));
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('class', 'kit-label');
    t.textContent = e.label;
    g.appendChild(t);

    g.addEventListener('click', () => surClic && surClic(e.id));
    g.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); surClic && surClic(e.id); } });
    svg.appendChild(g);
    map[e.id] = g;
  }

  const flash = (id) => {
    const g = map[id] || map[id === 'CH_OPEN' ? 'CH' : null];
    if (!g) return;
    g.classList.remove('frappe');
    void g.getBoundingClientRect();
    g.classList.add('frappe');
    setTimeout(() => g.classList.remove('frappe'), 220);
  };

  const surligner = (ids) => {
    for (const [id, g] of Object.entries(map)) g.classList.toggle('utilise', ids.includes(id));
  };

  return { svg, flash, surligner };
}
