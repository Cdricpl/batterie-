/* Assemblage de l'interface. */
import { INSTRUMENTS, ORDRE, TOUCHES, estNote } from './instruments.js';
import { initAudio, reprendreAudio, jouer, setVolume, setMute, setSolos, VOLUMES_DEFAUT, ctxAudio } from './audio.js';
import { dessinerPortee, dessinerGrille, legende, analyser, frappes, tranche, dimensions } from './notation.js';
import { GROOVES, FILLS, EXERCICES } from './patterns.js';
import { RUDIMENTS, FAMILLES_RUDIMENTS } from './rudiments.js';
import { MORCEAUX, compilerMorceau } from './songs.js';
import { LECONS, NIVEAUX } from './lessons.js';
import { dessinerKit } from './kit.js';
import { Lecteur } from './player.js';
import * as P from './progress.js';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

let motifCourant = null;
let leconCourante = null;
let portee = null;          // {svg, xDe, notesParStep, teteEl…}
let grille = null;
let casesParStep = new Map();   // pas → cases de la grille
let actifs = [];                // éléments éclairés au pas en cours
let modeJeu = false;
let solosActifs = new Set();
let jugements = [];
let chronoLecture = null;
let demarre = false;        // devient vrai une fois l'appli affichée

/* ================= kit ================= */
const kit = dessinerKit(async id => { await reprendreAudio(); jouer(id, 0, { velo:0.9 }); kit.flash(id); });
$('#kit-diagram').appendChild(kit.svg);

/* ================= lecteur ================= */
const lecteur = new Lecteur({
  onPos: pos => { majTeteLecture(pos); if (scene.ouverte) majScene(pos); },
  onFrappe: notes => {
    masquerDecompte();
    if (!scene.ouverte) for (const n of notes) kit.flash(n.signe === 'o' && n.inst === 'CH' ? 'CH' : n.inst);
  },
  onCompte: n => afficherDecompte(n),
  onBoucle: () => { if (modeJeu) resumerJeu(); if (motifCourant) P.noterTempo(motifCourant.id, lecteur.bpm); },
  onTempo: bpm => { $('#bpm').value = bpm; $('#bpm-num').value = bpm; $('#scene-bpm').textContent = bpm; },
  onFin: () => { majBoutonPlay(false); stopChrono(); masquerDecompte(); }
});

/* ================= chargement d'un motif ================= */
function chargerMotif(motif, { eyebrow = '', titre, sous, badges = [], corps = null, lecon = null } = {}){
  if (lecteur.enLecture) lecteur.arreter();
  motifCourant = motif;
  leconCourante = lecon;
  lecteur.charger(motif);

  const bpm = motif.bpm || [50, 90, 180];
  $('#bpm').min = bpm[0]; $('#bpm').max = bpm[2];
  $('#bpm-num').min = bpm[0]; $('#bpm-num').max = bpm[2];
  lecteur.setTempo(bpm[1]);
  $('#ramp-max').value = Math.min(bpm[2], bpm[1] + 30);

  $('#piece-eyebrow').textContent = eyebrow;
  $('#piece-title').textContent = titre || motif.nom;
  $('#piece-sub').textContent = sous || motif.desc || '';
  $('#piece-badges').innerHTML = badges.map(b => `<span class="badge">${b}</span>`).join('');
  $('#btn-play').disabled = false;
  $('#btn-stop').disabled = false;
  $('#btn-scene').disabled = false;
  $('#score-empty').classList.add('hidden');

  solosActifs.clear();
  setSolos([]);
  rendrePartition();
  majSections(motif);
  majMixer();
  majOptionsClic();
  if (corps) $('#lesson-body').innerHTML = corps;
  $('#practice-score').classList.add('hidden');
  jugements = [];

  const utilises = Object.keys(analyser(motif).pistes).filter(id => INSTRUMENTS[id]);
  kit.surligner(utilises);

  // sur petit écran, la liste est au-dessus du lecteur : on y descend après un choix
  if (demarre && matchMedia('(max-width:1080px)').matches)
    $('.player-card').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' });
}

function rendrePartition(){
  if (!motifCourant) return;
  const wStaff = $('#score-staff');
  wStaff.innerHTML = '';
  portee = dessinerPortee(motifCourant);
  if ($('#opt-names').checked) wStaff.appendChild(legende(motifCourant));
  const scroller = document.createElement('div');
  scroller.className = 'scroll-x';
  scroller.appendChild(creerTete(portee));
  if (motifCourant.doigte){
    const d = document.createElement('div');
    d.className = 'doigte-info';
    d.innerHTML = `<b>Doigté</b> : D = main droite, G = main gauche`;
    wStaff.appendChild(d);
    dessinerDoigte(portee, motifCourant);
  }
  wStaff.appendChild(scroller);

  const wGrid = $('#score-grid');
  wGrid.innerHTML = '';
  grille = dessinerGrille(motifCourant);
  wGrid.appendChild(grille);
  // index pas → cases, pour ne pas fouiller toute la page à chaque note
  casesParStep = new Map();
  grille.querySelectorAll('td[data-step]').forEach(td => {
    const k = +td.dataset.step;
    if (!casesParStep.has(k)) casesParStep.set(k, []);
    casesParStep.get(k).push(td);
  });
  actifs = [];
  majVueScore();
}

/* ---- tête de lecture ----
 * Un simple calque posé sur la partition, déplacé par « transform » : le navigateur
 * le fait glisser sans redessiner la partition, donc à vitesse parfaitement régulière. */
function creerTete(po){
  const cadre = document.createElement('div');
  cadre.className = 'portee-cadre';
  const tete = document.createElement('div');
  tete.className = 'tete-lecture';
  tete.setAttribute('aria-hidden', 'true');
  cadre.append(po.svg, tete);
  po.cadre = cadre; po.teteEl = tete; po.echelle = 0;
  return cadre;
}
function echelleDe(po){
  if (!po.echelle){
    const w = po.svg.getBoundingClientRect().width;
    if (!w) return 0;
    po.echelle = w / po.largeur;
    po.teteEl.style.top = (po.tete.y0 * po.echelle).toFixed(1) + 'px';
    po.teteEl.style.height = ((po.tete.y1 - po.tete.y0) * po.echelle).toFixed(1) + 'px';
  }
  return po.echelle;
}
/* place la tête sur le pas (fractionnaire) donné ; renvoie sa position en pixels */
function placerTete(po, step){
  const k = echelleDe(po);
  if (!k) return 0;
  const px = po.xDe(step) * k;
  po.teteEl.style.transform = `translate3d(${(px - 1.5).toFixed(2)}px,0,0)`;
  po.teteEl.style.opacity = '1';
  return px;
}
function cacherTete(po){ if (po && po.teteEl) po.teteEl.style.opacity = '0'; }

function dessinerDoigte(po, motif){
  const a = analyser(motif);
  const d = motif.doigte.replace(/\s/g, '');
  const NS = 'http://www.w3.org/2000/svg';
  for (let s = 0; s < a.total; s++){
    const c = d[s];
    if (!c || c === '-') continue;
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('x', po.xDe(s)); t.setAttribute('y', 172);
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('class', 'doigte');
    t.textContent = c;
    po.racine.appendChild(t);
  }
}

/* ================= tête de lecture ================= */
let dernierStep = -1;
function majTeteLecture(pos){
  if (pos == null){
    cacherTete(portee);
    for (const e of actifs) e.classList.remove('actif');
    actifs = [];
    dernierStep = -1;
    return;
  }
  if (portee){
    const px = placerTete(portee, Math.min(pos, portee.total - 0.001));
    if ($('#opt-follow').checked){
      // quand la tête sort de l'écran, on tourne la page : la mesure en cours
      // se retrouve au début de la vue
      const box = $('#score-staff .scroll-x');
      if (box && box.scrollWidth > box.clientWidth &&
          (px > box.scrollLeft + box.clientWidth - 24 || px < box.scrollLeft + 4)){
        const parMesure = analyser(motifCourant).parMesure;
        const debut = portee.xDe(Math.floor(pos / parMesure) * parMesure) * portee.echelle;
        box.scrollLeft = Math.max(0, debut - 60);
      }
    }
  }
  const step = Math.floor(pos);
  if (step !== dernierStep){
    dernierStep = step;
    for (const e of actifs) e.classList.remove('actif');
    actifs = [...(casesParStep.get(step) || []), ...((portee && portee.notesParStep.get(step)) || [])];
    for (const e of actifs) e.classList.add('actif');
    const g = $('#score-grid .grille');
    if (g && $('#opt-follow').checked && g.scrollWidth > g.clientWidth && !$('#score-grid').classList.contains('hidden')){
      const cel = (casesParStep.get(step) || [])[0];
      const lbl = 90;   // colonne des noms, fixe à gauche
      if (cel && (cel.offsetLeft + cel.offsetWidth > g.scrollLeft + g.clientWidth || cel.offsetLeft < g.scrollLeft + lbl))
        g.scrollLeft = Math.max(0, cel.offsetLeft - lbl - 4);
    }
  }
}

function afficherDecompte(n){
  for (const o of [$('#count-overlay'), $('#scene-compte')]){
    o.classList.remove('hidden');
    o.querySelector('span').textContent = n;
  }
}
function masquerDecompte(){
  $('#count-overlay').classList.add('hidden');
  $('#scene-compte').classList.add('hidden');
}

/* ================= mixer ================= */
function majMixer(){
  const mx = $('#mixer');
  mx.innerHTML = '';
  const utilises = motifCourant ? Object.keys(analyser(motifCourant).pistes) : ORDRE;
  for (const id of ORDRE){
    if (!utilises.includes(id)) continue;
    const def = INSTRUMENTS[id];
    const row = document.createElement('div');
    row.className = 'mix-row';
    row.innerHTML = `
      <button class="mix-mute" data-inst="${id}" aria-pressed="false" aria-label="Couper ${def.nom}" title="Couper">M</button>
      <button class="mix-solo${solosActifs.has(id) ? ' actif' : ''}" data-solo="${id}" aria-pressed="${solosActifs.has(id)}" aria-label="Isoler ${def.nom}" title="N'entendre que cet élément">S</button>
      <span class="mix-nom" style="border-color:${def.couleur}">${def.court}</span>
      <input type="range" min="0" max="1.4" step="0.05" value="${VOLUMES_DEFAUT[id]}" data-vol="${id}" aria-label="Volume ${def.nom}">`;
    mx.appendChild(row);
  }
  mx.querySelectorAll('[data-vol]').forEach(sl => {
    sl.addEventListener('input', () => setVolume(sl.dataset.vol, parseFloat(sl.value)));
  });
  mx.querySelectorAll('.mix-mute').forEach(b => {
    b.addEventListener('click', () => {
      const on = b.classList.toggle('coupe');
      setMute(b.dataset.inst, on);
      b.setAttribute('aria-pressed', on);
    });
  });
  mx.querySelectorAll('.mix-solo').forEach(b => {
    b.addEventListener('click', () => {
      const id = b.dataset.solo;
      solosActifs.has(id) ? solosActifs.delete(id) : solosActifs.add(id);
      b.classList.toggle('actif', solosActifs.has(id));
      b.setAttribute('aria-pressed', solosActifs.has(id));
      setSolos([...solosActifs]);
      $('#mixer').classList.toggle('en-solo', solosActifs.size > 0);
    });
  });
  $('#mixer').classList.toggle('en-solo', solosActifs.size > 0);
}

/* ================= listes ================= */
const CONSEIL = t => `<div class="tip"><span class="tip-lbl">Conseil</span><p>${t}</p></div>`;
const NOMS_NIVEAUX = ['', 'Débutant', 'Débutant +', 'Intermédiaire', 'Confirmé', 'Avancé', 'Expert'];
const signature = m => `${m.beats ?? 4}/${m.unite ?? 4}`;
const METHODE = `
  <h3>Méthode d'entraînement</h3>
  <ol>
    <li>Tempo au minimum, <b>Métronome</b> coché.</li>
    <li>8 mesures d'affilée sans aucune erreur.</li>
    <li><b>Tempo progressif</b> : +4 BPM toutes les 2 boucles.</li>
    <li>Note le tempo où ça se dégrade : c'est ta limite du jour. Reviens 10 BPM en dessous pendant 5 minutes.</li>
  </ol>`;

function carte(p, { meta } = {}){
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'item';
  el.innerHTML = `
    <span class="item-main">
      <span class="item-nom">${p.nom}</span>
      <span class="item-meta">${meta ?? [p.style, p.bpm ? p.bpm[1] + ' BPM' : ''].filter(Boolean).join(' · ')}</span>
    </span>
    <span class="niv niv-${p.niveau || 1}" title="Niveau ${p.niveau || 1}">N${p.niveau || 1}</span>`;
  return el;
}

function entete(box, texte, couleur){
  const h = document.createElement('div');
  h.className = 'grp';
  h.innerHTML = (couleur ? `<span class="grp-pt" style="background:${couleur}"></span>` : '') + texte;
  box.appendChild(h);
}

/* liste regroupée par niveau, filtrable par recherche */
function listeParNiveau(box, items, filtre, texteDe, fabriquer){
  box.innerHTML = '';
  const f = filtre.trim().toLowerCase();
  const garde = items.filter(it => !f || texteDe(it).toLowerCase().includes(f));
  for (let n = 1; n <= 6; n++){
    const lot = garde.filter(it => (it.niveau || 1) === n);
    if (!lot.length) continue;
    const niv = NIVEAUX.find(x => x.n === n);
    entete(box, `Niveau ${n} · ${NOMS_NIVEAUX[n]}`, niv && niv.couleur);
    for (const it of lot) box.appendChild(fabriquer(it));
  }
  if (!garde.length) box.innerHTML = '<p class="muted small">Rien ne correspond à cette recherche.</p>';
}

function listeGrooves(filtre = ''){
  const box = $('#groove-list');
  listeParNiveau(box, GROOVES, filtre, g => `${g.nom} ${g.style} ${signature(g)} ${g.desc || ''}`, g => {
    const el = carte(g);
    el.addEventListener('click', () => {
      selectionner(el, box);
      chargerMotif(g, {
        eyebrow: g.style, titre: g.nom, sous: g.desc,
        badges:['Niveau ' + g.niveau, g.bpm[1] + ' BPM', signature(g)],
        corps: `<h2>${g.nom}</h2><p>${g.desc}</p>${CONSEIL(g.astuce)}
                <p class="muted small">Isole un élément avec « S » dans le mixeur, ou coupe-le avec « M », pour travailler les autres séparément.</p>`
      });
    });
    return el;
  });
  $('#rythmes-count').textContent = GROOVES.length;
}

function listeMorceaux(filtre = ''){
  const box = $('#song-list');
  listeParNiveau(box, MORCEAUX, filtre, m => `${m.titre} ${m.artiste} ${m.style}`, m => {
    const el = carte({ nom:m.titre, niveau:m.niveau }, { meta:`${m.artiste} · ${m.bpm} BPM` });
    el.addEventListener('click', () => { selectionner(el, box); ouvrirMorceau(m); });
    return el;
  });
  $('#morceaux-count').textContent = MORCEAUX.length;
}

function ouvrirMorceau(m){
  const motif = compilerMorceau(m);
  const origine = m.fidelite === 'origine';
  const structure = motif.sections.map(s => {
    const n = s.fin - s.debut;
    return `<li><b>${s.nom}</b> · ${n} mesure${n > 1 ? 's' : ''}</li>`;
  }).join('');
  chargerMotif(motif, {
    eyebrow: `${m.artiste} · ${m.annee}`,
    titre: m.titre, sous: m.desc,
    badges: [m.style, 'Niveau ' + m.niveau, m.bpm + ' BPM', signature(m)],
    corps: `<h2>${m.titre}</h2>
      <p class="muted">${m.artiste}, ${m.annee}</p>
      <p><span class="badge ${origine ? 'fid-origine' : 'fid-acc'}">${origine ? "Groove d'origine, simplifié" : "Groove d'accompagnement"}</span></p>
      <p>${m.desc}</p>
      ${CONSEIL(m.astuce)}
      <h3>Structure d'entraînement</h3>
      <ol class="structure">${structure}</ol>
      <p class="muted small">${origine
        ? "C'est le groove caractéristique du morceau, simplifié pour être jouable. Les variations et les fills sont à aller chercher à l'oreille."
        : "Ce n'est pas une transcription : c'est un groove qui colle au morceau et à son tempo, pour jouer par-dessus l'enregistrement."}
        La structure est une suite d'entraînement, pas la forme exacte du morceau.</p>
      <h3>Méthode</h3>
      <ol>
        <li>Choisis une section au-dessus de la partition : elle se joue seule, en boucle.</li>
        <li>Commence avec <b>÷2</b>, puis monte avec le <b>Tempo progressif</b>.</li>
        <li>Au tempo du disque, lance l'enregistrement original et joue par-dessus.</li>
      </ol>`
  });
}

/* barre des sections d'un morceau : jouer / boucler une section */
function majSections(motif){
  const bar = $('#sections-bar');
  if (!motif.sections){ bar.classList.add('hidden'); bar.innerHTML = ''; return; }
  bar.classList.remove('hidden');
  const parMesure = (motif.beats ?? 4) * (motif.res ?? 4);
  const choix = [{ nom:'Tout', debut:0, fin:motif.bars, tout:true }, ...motif.sections];
  bar.innerHTML = '<span class="sec-lbl">Sections</span>' + choix.map((c, i) =>
    `<button type="button" class="chip${c.tout ? ' actif' : ''}" data-i="${i}" aria-pressed="${!!c.tout}">${c.nom}${c.fois > 1 ? ` <em>×${c.fois}</em>` : ''}</button>`
  ).join('');
  bar.querySelectorAll('.chip').forEach(b => b.addEventListener('click', async () => {
    const c = choix[+b.dataset.i];
    bar.querySelectorAll('.chip').forEach(x => {
      x.classList.toggle('actif', x === b);
      x.setAttribute('aria-pressed', x === b);
    });
    const relancer = lecteur.enLecture;
    if (relancer) lecteur.arreter();
    lecteur.setPlage(c.tout ? null : c.debut * parMesure, c.fin * parMesure);
    const box = $('#score-staff .scroll-x');
    if (box && portee) box.scrollLeft = Math.max(0, portee.xDe(c.debut * parMesure) - 70);
    if (relancer){ await lecteur.demarrer(); majBoutonPlay(true); startChrono(); }
  }));
}

function listeFills(){
  const box = $('#fill-list');
  listeParNiveau(box, FILLS, '', g => g.nom, g => {
    const el = carte(g, { meta: g.res === 3 ? 'Triolets' : g.res === 8 ? 'Triples-croches' : 'Groove + break' });
    el.addEventListener('click', () => {
      selectionner(el, box);
      chargerMotif(g, {
        eyebrow:'Break', titre:g.nom, sous:'Une mesure de groove, une mesure de break, en boucle',
        badges:['Niveau ' + g.niveau],
        corps:`<h2>${g.nom}</h2><p>${g.desc}</p>${CONSEIL(g.astuce)}
               <p class="muted small">La première mesure est un groove simple : elle sert à te remettre en place après le break.</p>`
      });
    });
    return el;
  });
  $('#fills-count').textContent = FILLS.length;
}

function listeExercices(){
  const box = $('#drill-list');
  box.innerHTML = '';
  const fabriquer = (g, type) => {
    const el = carte(g, { meta: type === 'Rudiment' ? (g.doigte ? g.doigte.replace(/-/g, '').slice(0, 8) : '') : g.style });
    el.addEventListener('click', () => {
      selectionner(el, box);
      chargerMotif(g, {
        eyebrow: type, titre:g.nom, sous:g.desc, badges:['Niveau ' + g.niveau],
        corps:`<h2>${g.nom}</h2><p>${g.desc}</p>${CONSEIL(g.astuce)}
               ${type === 'Rudiment' ? '<p class="muted small">D = main droite, G = main gauche. Le doigté est écrit sous la partition.</p>' : ''}
               ${METHODE}`
      });
    });
    return el;
  };
  for (const fam of FAMILLES_RUDIMENTS){
    entete(box, `Rudiments · ${fam.nom}`);
    for (const r of RUDIMENTS.filter(x => x.famille === fam.id)) box.appendChild(fabriquer(r, 'Rudiment'));
  }
  entete(box, 'Coordination et tempo');
  for (const e of EXERCICES) box.appendChild(fabriquer(e, 'Exercice'));
  $('#drills-count').textContent = RUDIMENTS.length + EXERCICES.length;
}

function listeLecons(){
  const box = $('#lesson-list');
  box.innerHTML = '';
  for (const niv of NIVEAUX){
    entete(box, niv.nom, niv.couleur);
    for (const l of LECONS.filter(x => x.niveau === niv.n)){
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'item lecon' + (P.estFaite(l.id) ? ' faite' : '');
      el.dataset.lecon = l.id;
      el.innerHTML = `
        <span class="coche" aria-hidden="true">${P.estFaite(l.id) ? '✓' : ''}</span>
        <span class="item-main">
          <span class="item-nom">${LECONS.indexOf(l) + 1}. ${l.titre}${l.cle ? ' <span class="cle">étape clé</span>' : ''}</span>
          <span class="item-meta">${l.duree} · ${l.objectif}</span>
        </span>`;
      el.setAttribute('aria-label', `Leçon ${LECONS.indexOf(l) + 1} : ${l.titre}${P.estFaite(l.id) ? ' (terminée)' : ''}`);
      el.addEventListener('click', () => ouvrirLecon(l.id));
      box.appendChild(el);
    }
  }
  $('#cours-count').textContent = `${P.nbFaites()}/${LECONS.length}`;
}

function selectionner(el, box){
  box.querySelectorAll('.item.actif').forEach(e => e.classList.remove('actif'));
  el.classList.add('actif');
}

function ouvrirLecon(id){
  const l = LECONS.find(x => x.id === id);
  if (!l) return;
  const box = $('#lesson-list');
  const el = box.querySelector(`[data-lecon="${id}"]`);
  if (el) selectionner(el, box);
  P.setDerniereLecon(id);

  const idx = LECONS.indexOf(l);
  const record = P.meilleurTempo(l.pattern.id);
  const corps = `
    <div class="lecon-head">
      <span class="badge">Leçon ${idx + 1}/${LECONS.length}</span>
      <span class="badge">Niveau ${l.niveau}</span>
      <span class="badge">${l.duree}</span>
    </div>
    <h2>${l.titre}</h2>
    <p class="objectif"><b>Objectif :</b> ${l.objectif}</p>
    ${l.contenu}
    ${l.defi ? `<div class="defi"><span class="tip-lbl">Défi</span><p>${l.defi.texte}</p>
        ${record ? `<p class="muted small">Ton meilleur tempo sur cette leçon : <b>${record} BPM</b>${record >= l.defi.bpm ? ' · défi réussi' : ''}</p>` : ''}</div>` : ''}
    ${(l.conseils || []).map(CONSEIL).join('')}
    <div class="lecon-actions">
      <label class="chk big"><input type="checkbox" id="chk-faite" ${P.estFaite(l.id) ? 'checked' : ''}> Leçon terminée</label>
      ${idx > 0 ? `<button class="btn tiny ghost" data-goto="${LECONS[idx-1].id}">← Précédente</button>` : ''}
      ${idx < LECONS.length - 1 ? `<button class="btn tiny" data-goto="${LECONS[idx+1].id}">Suivante →</button>` : ''}
    </div>`;

  chargerMotif(l.pattern, {
    eyebrow: `Leçon ${idx + 1} · ${NOMS_NIVEAUX[l.niveau]}`,
    titre: l.titre, sous: l.objectif,
    badges:['Leçon ' + (idx + 1), 'Niveau ' + l.niveau],
    corps, lecon: l
  });

  $('#chk-faite').addEventListener('change', e => {
    P.marquer(l.id, e.target.checked);
    listeLecons();
    const it = $(`#lesson-list [data-lecon="${id}"]`);
    if (it) it.classList.add('actif');
    majProgression();
  });
  $$('#lesson-body [data-goto]').forEach(b => b.addEventListener('click', () => ouvrirLecon(b.dataset.goto)));
  basculerVue('cours');
}

/* ================= progression ================= */
function majProgression(){
  const side = $('#progress-side');
  const hist = P.historique(14);
  const maxi = Math.max(10, ...hist.map(h => h.minutes));
  side.innerHTML = `
    <div class="stat"><span class="stat-n">${P.nbFaites()}/${LECONS.length}</span><span>leçons terminées</span></div>
    <div class="stat"><span class="stat-n">${P.minutesAujourdhui()} min</span><span>aujourd'hui</span></div>
    <div class="stat"><span class="stat-n">${P.serie()} j</span><span>jours d'affilée</span></div>
    <div class="stat"><span class="stat-n">${P.minutesTotal()} min</span><span>au total</span></div>
    <h4 class="mini-h">14 derniers jours</h4>
    <div class="bars">${hist.map(h => `
      <span class="bar" title="${h.jour} — ${h.minutes} min">
        <i style="height:${Math.round(h.minutes / maxi * 46) + 2}px"></i>
      </span>`).join('')}</div>
    <button class="btn tiny ghost" id="btn-reset">Réinitialiser ma progression</button>`;
  const b = $('#btn-reset');
  if (b) b.addEventListener('click', () => {
    if (confirm('Effacer toute la progression enregistrée ?')){ P.toutEffacer(); listeLecons(); majProgression(); }
  });
  $('#streak-text').textContent = `${P.minutesAujourdhui()} min aujourd'hui`;
  $('#cours-count').textContent = `${P.nbFaites()}/${LECONS.length}`;
  majCarteProgression();
}

function majCarteProgression(){
  const box = $('#progress-card');
  if (!box) return;
  const hist = P.historique(21);
  const maxi = Math.max(10, ...hist.map(h => h.minutes));
  const faites = P.nbFaites();
  const pct = Math.round(faites / LECONS.length * 100);
  const prochaine = LECONS.find(l => !P.estFaite(l.id)) || LECONS[LECONS.length - 1];
  const jours = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  const niveaux = NIVEAUX.map(niv => {
    const lot = LECONS.filter(l => l.niveau === niv.n);
    const ok = lot.filter(l => P.estFaite(l.id)).length;
    return `
      <div class="niv-bloc">
        <div class="niv-head">
          <span class="grp-pt" style="background:${niv.couleur}"></span>
          <b>${niv.nom}</b>
          <span class="muted small">${ok}/${lot.length}</span>
        </div>
        <div class="niv-lecons">${lot.map(l => {
          const bpm = P.meilleurTempo(l.pattern.id);
          const fait = P.estFaite(l.id);
          const defi = l.defi && bpm >= l.defi.bpm;
          return `<button type="button" class="pastille${fait ? ' faite' : ''}" data-ouvrir="${l.id}"
            title="${l.titre}${bpm ? ' — meilleur tempo : ' + bpm + ' BPM' : ''}">
            <span>${LECONS.indexOf(l) + 1}</span>
            ${bpm ? `<em>${bpm}</em>` : ''}${defi ? '<i class="defi-ok" aria-label="défi réussi"></i>' : ''}
          </button>`;
        }).join('')}</div>
      </div>`;
  }).join('');

  box.innerHTML = `
    <div class="card-head"><h3>Ma progression</h3>
      <span class="muted small">tout est enregistré dans ce navigateur</span></div>

    <div class="stats-grid">
      <div class="stat"><span class="stat-n">${faites}/${LECONS.length}</span><span>leçons terminées</span></div>
      <div class="stat"><span class="stat-n">${P.minutesAujourdhui()} min</span><span>aujourd'hui</span></div>
      <div class="stat"><span class="stat-n">${P.serie()} j</span><span>jours d'affilée</span></div>
      <div class="stat"><span class="stat-n">${P.minutesTotal()} min</span><span>au total</span></div>
    </div>

    <div class="jauge"><i style="width:${pct}%"></i><span>${pct} % du parcours</span></div>

    <h4 class="mini-h">Temps de pratique — 3 dernières semaines</h4>
    <div class="bars grand">${hist.map(h => {
      const d = new Date(h.jour + 'T12:00:00');
      return `<span class="bar" title="${h.jour} — ${h.minutes} min">
        <span class="piste"><i class="${h.minutes ? 'plein' : ''}"
          style="height:${h.minutes ? Math.max(4, Math.round(h.minutes / maxi * 70)) : 0}px"></i></span>
        <u>${jours[d.getDay()]}</u></span>`;
    }).join('')}</div>

    <h4 class="mini-h">Parcours — clique sur un numéro pour ouvrir la leçon</h4>
    ${niveaux}
    <p class="muted small">Le petit nombre sous la pastille est le meilleur tempo atteint sur cette leçon ; le point doré signale un défi réussi.</p>

    <div class="lecon-actions">
      <span class="muted small">Prochaine étape : <b>${LECONS.indexOf(prochaine) + 1}. ${prochaine.titre}</b></span>
      <button class="btn" id="btn-reprendre">Reprendre l'entraînement →</button>
    </div>`;

  box.querySelectorAll('[data-ouvrir]').forEach(b =>
    b.addEventListener('click', () => ouvrirLecon(b.dataset.ouvrir)));
  const r = $('#btn-reprendre');
  if (r) r.addEventListener('click', () => ouvrirLecon(prochaine.id));
}

/* ================= transport ================= */
function majBoutonPlay(enCours){
  $('#play-ico').setAttribute('href', enCours ? '#i-stop' : '#i-play');
  $('#play-label').textContent = enCours ? 'Arrêter' : 'Écouter';
  $('#btn-play').classList.toggle('actif', enCours);
  $('#scene-play-ico').setAttribute('href', enCours ? '#i-stop' : '#i-play');
  $('#scene-play-label').textContent = enCours ? 'Arrêter' : 'Jouer';
  $('#scene-play').classList.toggle('actif', enCours);
  garderEcranAllume(enCours);
}

/* Le téléphone posé sur le pupitre ne doit pas se mettre en veille pendant qu'on joue */
let verrouEcran = null;
async function garderEcranAllume(oui){
  try {
    if (oui && !verrouEcran && 'wakeLock' in navigator){
      verrouEcran = await navigator.wakeLock.request('screen');
      verrouEcran.addEventListener('release', () => { verrouEcran = null; });
    } else if (!oui && verrouEcran){
      await verrouEcran.release();
      verrouEcran = null;
    }
  } catch { /* refusé (économie d'énergie) ou non pris en charge */ }
}
// le verrou saute quand on change d'appli : on le reprend au retour si ça joue encore
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && lecteur.enLecture) garderEcranAllume(true);
});

function startChrono(){
  stopChrono();
  chronoLecture = setInterval(() => P.ajouterSecondes(5), 5000);
}
function stopChrono(){ clearInterval(chronoLecture); chronoLecture = null; majProgression(); }

$('#btn-play').addEventListener('click', async () => {
  if (!motifCourant) return;
  if (lecteur.enLecture){ lecteur.arreter(); majBoutonPlay(false); }
  else {
    await lecteur.demarrer();
    majBoutonPlay(true);
    startChrono();
  }
});
$('#btn-stop').addEventListener('click', () => { lecteur.arreter(); majBoutonPlay(false); });

/* ================= mode scène : plein écran, ligne par ligne ================= */
const scene = { ouverte:false, systemes:[], ligne:-1, natif:false, dernierStep:-1, actifs:[] };

/* Découpe la partition en lignes de 1 à 4 mesures, selon la largeur de l'écran,
 * en gardant des notes au moins aussi grandes qu'à l'écran normal. */
function rendreScene(){
  const box = $('#scene-partition');
  box.innerHTML = '';
  scene.systemes = [];
  if (!motifCourant) return;
  const a = analyser(motifCourant);
  const { largeurMesure, marge } = dimensions(motifCourant);
  const largeur = box.clientWidth - 12;
  const n = Math.max(1, Math.min(4, Math.floor((largeur / 1.15 - marge) / largeurMesure)));
  for (let b = 0; b < a.bars; b += n){
    const fin = Math.min(a.bars, b + n);
    const t = tranche(motifCourant, b, fin);
    const po = dessinerPortee(t, { premiereMesure: b, barreFinale: fin === a.bars });
    if (t.doigte) dessinerDoigte(po, t);
    po.svg.classList.add('systeme');
    const cadre = creerTete(po);
    // une ligne incomplète garde la même échelle que les autres
    cadre.style.width = ((marge + (fin - b) * largeurMesure) / (marge + n * largeurMesure) * 100) + '%';
    const ligne = document.createElement('div');
    ligne.className = 'scene-systeme';
    ligne.appendChild(cadre);
    box.appendChild(ligne);
    scene.systemes.push({ po, el: ligne, debut: b * a.parMesure, fin: fin * a.parMesure });
  }
  scene.ligne = -1;
  scene.dernierStep = -1;
  scene.actifs = [];
  allerLigne(Math.max(0, scene.systemes.findIndex(sy => lecteur.debutPlage < sy.fin)));
  // en portrait sur téléphone : conseiller de tourner l'écran
  $('#scene-astuce').classList.toggle('hidden', !(n === 1 && innerHeight > innerWidth && innerWidth < 700));
}

function allerLigne(i){
  if (i < 0 || i === scene.ligne) return;
  scene.ligne = i;
  scene.systemes.forEach((sy, k) => {
    sy.el.classList.toggle('courante', k === i);
    sy.el.classList.toggle('passee', k < i);
  });
  // saut franc vers la ligne suivante, comme une page qu'on tourne
  $('#scene-partition').scrollTop = scene.systemes[i].el.offsetTop - 6;
  $('#scene-ligne-info').textContent = `Ligne ${i + 1} / ${scene.systemes.length}`;
}

function majScene(pos){
  if (pos == null){
    for (const sy of scene.systemes) cacherTete(sy.po);
    for (const e of scene.actifs) e.classList.remove('actif');
    scene.actifs = [];
    scene.dernierStep = -1;
    return;
  }
  let i = scene.systemes.findIndex(sy => pos < sy.fin);
  if (i < 0) i = scene.systemes.length - 1;
  if (i !== scene.ligne){
    const avant = scene.systemes[scene.ligne];
    if (avant) cacherTete(avant.po);
    allerLigne(i);
  }
  const sy = scene.systemes[i];
  placerTete(sy.po, Math.min(pos - sy.debut, sy.fin - sy.debut - 0.001));
  const step = Math.floor(pos);
  if (step !== scene.dernierStep){
    scene.dernierStep = step;
    for (const e of scene.actifs) e.classList.remove('actif');
    scene.actifs = sy.po.notesParStep.get(step - sy.debut) || [];
    for (const e of scene.actifs) e.classList.add('actif');
  }
}

async function ouvrirScene(){
  if (!motifCourant) return;
  scene.ouverte = true;
  $('#scene').classList.remove('hidden');
  document.body.classList.add('en-scene');
  $('#scene-titre').textContent = $('#piece-title').textContent;
  $('#scene-bpm').textContent = lecteur.bpm;
  // vrai plein écran quand le navigateur le permet (Android, ordinateur)
  const racine = document.documentElement;
  if (racine.requestFullscreen && !document.fullscreenElement){
    try { await racine.requestFullscreen({ navigationUI:'hide' }); scene.natif = true; } catch { scene.natif = false; }
  }
  rendreScene();
  $('#scene-play').focus();
}

function fermerScene(){
  if (!scene.ouverte) return;
  scene.ouverte = false;
  $('#scene').classList.add('hidden');
  document.body.classList.remove('en-scene');
  if (scene.natif && document.fullscreenElement) document.exitFullscreen().catch(() => {});
  scene.natif = false;
  $('#btn-scene').focus();
}

$('#btn-scene').addEventListener('click', ouvrirScene);
$('#scene-fermer').addEventListener('click', fermerScene);
$('#scene-play').addEventListener('click', () => $('#btn-play').click());
$('#scene-moins').addEventListener('click', () => lecteur.setTempo(Math.max(+$('#bpm').min, lecteur.bpm - 5)));
$('#scene-plus').addEventListener('click', () => lecteur.setTempo(Math.min(+$('#bpm').max, lecteur.bpm + 5)));
// un toucher sur la partition lance ou arrête la lecture : pratique baguettes en main
$('#scene-partition').addEventListener('click', () => $('#btn-play').click());
document.addEventListener('fullscreenchange', () => {
  // sortie du plein écran par le système (bouton retour d'Android, Échap) : on quitte la scène
  if (!document.fullscreenElement && scene.natif) { scene.natif = false; fermerScene(); }
});
window.addEventListener('keydown', e => { if (e.key === 'Escape' && scene.ouverte) fermerScene(); });
let minuterieScene = null;
window.addEventListener('resize', () => {
  if (portee) portee.echelle = 0;
  if (!scene.ouverte) return;
  clearTimeout(minuterieScene);
  minuterieScene = setTimeout(() => {
    const ligne = scene.ligne;
    rendreScene();
    if (ligne >= 0 && ligne < scene.systemes.length){ scene.ligne = -1; allerLigne(ligne); }
  }, 180);
});

$('#bpm').addEventListener('input', e => { lecteur.setTempo(+e.target.value); });
$('#bpm-num').addEventListener('change', e => { lecteur.setTempo(+e.target.value); });

let taps = [];
$('#btn-tap').addEventListener('click', () => {
  const t = performance.now();
  taps = taps.filter(x => t - x < 2500);
  taps.push(t);
  if (taps.length >= 2){
    const ecarts = taps.slice(1).map((x, i) => x - taps[i]);
    const moy = ecarts.reduce((a, b) => a + b, 0) / ecarts.length;
    lecteur.setTempo(Math.round(60000 / moy));
  }
});

function majOptionsClic(){
  const sel = $('#click-sub');
  const res = motifCourant ? (motifCourant.res ?? 4) : 4;
  const choix = res % 3 === 0
    ? [[1, 'à la noire'], [res, 'aux triolets']]
    : [[1, 'à la noire'], [2, 'aux croches'], [4, 'aux doubles']].filter(c => res % c[0] === 0);
  sel.innerHTML = choix.map(([v, t]) => `<option value="${v}">${t}</option>`).join('');
  sel.value = '1';
  lecteur.options.clicSub = 1;
}
$('#click-sub').addEventListener('change', e => lecteur.options.clicSub = +e.target.value);

/* ---- demi-tempo / tempo doublé ---- */
function tempoRelatif(facteur){
  const min = +$('#bpm').min, max = +$('#bpm').max;
  lecteur.setTempo(Math.max(min, Math.min(max, Math.round(lecteur.bpm * facteur))));
}
$('#btn-half').addEventListener('click', () => tempoRelatif(0.5));
$('#btn-double').addEventListener('click', () => tempoRelatif(2));

/* ---- impression ---- */
/* À l'impression, une longue partition est découpée en lignes de quelques mesures */
function preparerImpression(){
  const box = $('#score-print');
  box.innerHTML = '';
  if (!motifCourant) return;
  const a = analyser(motifCourant);
  const parLigne = a.parMesure > 16 ? 2 : 4;
  for (let b = 0; b < a.bars; b += parLigne){
    const fin = Math.min(a.bars, b + parLigne);
    const t = tranche(motifCourant, b, fin);
    const po = dessinerPortee(t, { premiereMesure: b, barreFinale: fin === a.bars });
    if (t.doigte) dessinerDoigte(po, t);
    po.svg.classList.add('systeme');
    // largeur proportionnelle au nombre de mesures : la dernière ligne n'est pas étirée
    po.svg.style.width = (fin - b) / parLigne * 100 + '%';
    box.appendChild(po.svg);
  }
}
$('#btn-print').addEventListener('click', () => {
  if (lecteur.enLecture) { lecteur.arreter(); majBoutonPlay(false); }
  preparerImpression();
  window.print();
});
window.addEventListener('beforeprint', preparerImpression);

$('#opt-loop').addEventListener('change', e => lecteur.options.boucle = e.target.checked);
$('#opt-count').addEventListener('change', e => lecteur.options.decompte = e.target.checked);
$('#opt-click').addEventListener('change', e => {
  lecteur.options.clic = e.target.checked;
  $('#click-sub').disabled = !e.target.checked;
});
$('#opt-ramp').addEventListener('change', e => {
  $('#ramp-row').classList.toggle('hidden', !e.target.checked);
  majRampe();
});
['#ramp-step', '#ramp-every', '#ramp-max'].forEach(s => $(s).addEventListener('change', majRampe));
function majRampe(){
  lecteur.options.rampe = $('#opt-ramp').checked ? {
    pas: +$('#ramp-step').value, chaque: +$('#ramp-every').value, max: +$('#ramp-max').value
  } : null;
}

$('#opt-names').addEventListener('change', rendrePartition);
$('#opt-follow').addEventListener('change', () => {});

$$('#view-toggle .seg-btn').forEach(b => b.addEventListener('click', () => {
  $$('#view-toggle .seg-btn').forEach(x => { x.classList.remove('active'); x.setAttribute('aria-pressed', 'false'); });
  b.classList.add('active');
  b.setAttribute('aria-pressed', 'true');
  majVueScore();
}));
function majVueScore(){
  const v = $('#view-toggle .seg-btn.active').dataset.score;
  $('#score-staff').classList.toggle('hidden', v === 'grid');
  $('#score-grid').classList.toggle('hidden', v === 'staff');
}

/* ================= mode jeu (clavier) ================= */
$('#btn-practice').addEventListener('click', () => {
  modeJeu = !modeJeu;
  $('#btn-practice').classList.toggle('actif', modeJeu);
  $('#btn-practice').setAttribute('aria-pressed', modeJeu);
  $('#practice-info').textContent = modeJeu
    ? "Mode jeu actif : joue au clavier (bouton « Clavier » pour la liste des touches)."
    : "Joue au clavier en rythme : l'appli mesure ta précision.";
  jugements = [];
  $('#practice-score').classList.toggle('hidden', !modeJeu);
  if (modeJeu) $('#practice-score').textContent = 'Prêt — lance la lecture et joue !';
});

function juger(inst, tempsJoue){
  if (!motifCourant || !lecteur.enLecture) return;
  const a = analyser(motifCourant);
  const piste = a.pistes[inst];
  if (!piste) return;
  const dur = lecteur.dureeStep;
  const d0 = lecteur.debutPlage, d1 = lecteur.finPlage;
  const longueur = (d1 - d0) * dur;
  let meilleur = Infinity;
  for (let s = d0; s < d1; s++){
    if (!estNote(piste[s])) continue;
    for (const dec of [-longueur, 0, longueur]){
      const d = tempsJoue - (lecteur.tempsDuStep(s) + dec);
      if (Math.abs(d) < Math.abs(meilleur)) meilleur = d;
    }
  }
  if (meilleur === Infinity) return;
  jugements.push(meilleur);
  const ms = Math.round(meilleur * 1000);
  const q = Math.abs(ms) < 30 ? ['Parfait', 'ok'] : Math.abs(ms) < 70 ? ['Bien', 'ok']
          : Math.abs(ms) < 140 ? [(ms < 0 ? 'Un peu tôt' : 'Un peu tard'), 'moyen']
          : [(ms < 0 ? 'Trop tôt' : 'Trop tard'), 'rate'];
  const el = $('#practice-score');
  el.classList.remove('hidden', 'ok', 'moyen', 'rate');
  el.classList.add(q[1]);
  el.textContent = `${q[0]} (${ms > 0 ? '+' : ''}${ms} ms)`;
}

function resumerJeu(){
  if (!jugements.length) return;
  const abs = jugements.map(Math.abs);
  const moy = Math.round(abs.reduce((a, b) => a + b, 0) / abs.length * 1000);
  const bons = abs.filter(x => x < 0.07).length;
  const pct = Math.round(bons / abs.length * 100);
  const el = $('#practice-score');
  el.classList.remove('hidden', 'ok', 'moyen', 'rate');
  el.classList.add(pct > 80 ? 'ok' : pct > 50 ? 'moyen' : 'rate');
  el.textContent = `Boucle : ${pct}% en place · écart moyen ${moy} ms`;
  jugements = [];
}

const enfoncees = new Set();
const INTERACTIF = 'button, a, summary, [role="button"], [role="tab"], [tabindex]';
window.addEventListener('keydown', async e => {
  if (e.target.matches('input, textarea, select')) return;
  if ((e.key === ' ' || e.key === 'Enter') && e.target.closest(INTERACTIF)) return;
  if (!$('#help-modal').classList.contains('hidden')) return;
  const k = e.key === ' ' ? ' ' : e.key.toLowerCase();
  if (k === ' ') e.preventDefault();
  if (enfoncees.has(k)) return;
  const id = TOUCHES[k];
  if (!id) return;
  enfoncees.add(k);
  const ctx = await reprendreAudio();
  jouer(id, 0, { velo: e.shiftKey ? 1 : 0.85 });
  kit.flash(id === 'CH_OPEN' ? 'CH' : id);
  if (modeJeu) juger(id === 'CH_OPEN' ? 'CH' : id, ctx.currentTime);
});
window.addEventListener('keyup', e => enfoncees.delete(e.key === ' ' ? ' ' : e.key.toLowerCase()));

/* Espace = lecture quand on n'est pas en mode jeu -> on préfère la grosse caisse.
   Raccourci lecture : touche Entrée. */
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !$('#help-modal').classList.contains('hidden')){ fermerAide(); return; }
  if (e.target.matches('input, textarea, select') || e.target.closest(INTERACTIF)) return;
  if (e.key === 'Enter'){ e.preventDefault(); $('#btn-play').click(); }
});

/* ================= onglets ================= */
function basculerVue(nom){
  const bilan = nom === 'progression';
  $$('.tab').forEach(t => {
    t.classList.toggle('active', t.dataset.view === nom);
    t.setAttribute('aria-selected', t.dataset.view === nom);
  });
  $$('.side-panel').forEach(p => p.classList.toggle('hidden', p.dataset.panel !== nom));
  $('.player-card').classList.toggle('hidden', bilan);
  $('.two-col').classList.toggle('hidden', bilan);
  $('#progress-card').classList.toggle('hidden', !bilan);
  if (bilan){ if (lecteur.enLecture){ lecteur.arreter(); majBoutonPlay(false); } majProgression(); }
}
$$('.tab').forEach(t => t.addEventListener('click', () => basculerVue(t.dataset.view)));

/* fenêtre d'aide : focus dedans à l'ouverture, retour au bouton à la fermeture */
function ouvrirAide(){
  $('#help-modal').classList.remove('hidden');
  $('#btn-help-close').focus();
}
function fermerAide(){
  $('#help-modal').classList.add('hidden');
  $('#btn-help').focus();
}
$('#btn-help').addEventListener('click', ouvrirAide);
$('#btn-help-close').addEventListener('click', fermerAide);
$('#help-modal').addEventListener('click', e => { if (e.target.id === 'help-modal') fermerAide(); });

$('#search-grooves').addEventListener('input', e => listeGrooves(e.target.value));
$('#search-songs').addEventListener('input', e => listeMorceaux(e.target.value));

/* ================= démarrage ================= */
listeLecons();
listeGrooves();
listeMorceaux();
listeFills();
listeExercices();
majProgression();
majRampe();

const derniere = P.etatActuel().derniereLecon;
if (derniere && LECONS.some(l => l.id === derniere)) ouvrirLecon(derniere);
else ouvrirLecon(LECONS[0].id);

document.addEventListener('pointerdown', () => initAudio(), { once:true });

/* ================= installation sur le téléphone ================= */
const enApp = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const surIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
  || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
// seulement sur le site publié (le fichier ouvert en local ou la page hébergée n'ont pas de manifest)
const installable = !!document.querySelector('link[rel="manifest"]') && /^https?:$/.test(location.protocol);

if (installable && 'serviceWorker' in navigator){
  navigator.serviceWorker.register('sw.js').catch(() => { /* hors ligne ou non pris en charge */ });
}

let demandeInstallation = null;
window.addEventListener('beforeinstallprompt', e => {      // Android, Chrome, Edge
  e.preventDefault();
  demandeInstallation = e;
  if (!enApp) $('#btn-installer').hidden = false;
});
window.addEventListener('appinstalled', () => { $('#btn-installer').hidden = true; });
if (installable && surIOS && !enApp) $('#btn-installer').hidden = false;   // iPhone : on explique

$('#btn-installer').addEventListener('click', async () => {
  if (demandeInstallation){
    demandeInstallation.prompt();
    await demandeInstallation.userChoice;
    demandeInstallation = null;
    $('#btn-installer').hidden = true;
  } else {
    $('#ios-modal').classList.remove('hidden');
    $('#btn-ios-close').focus();
  }
});
const fermerIOS = () => { $('#ios-modal').classList.add('hidden'); $('#btn-installer').focus(); };
$('#btn-ios-close').addEventListener('click', fermerIOS);
$('#ios-modal').addEventListener('click', e => { if (e.target.id === 'ios-modal') fermerIOS(); });
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !$('#ios-modal').classList.contains('hidden')) fermerIOS();
});
demarre = true;
