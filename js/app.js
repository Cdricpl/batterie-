/* Assemblage de l'interface. */
import { INSTRUMENTS, ORDRE, TOUCHES, estNote } from './instruments.js';
import { initAudio, reprendreAudio, jouer, setVolume, setMute, VOLUMES_DEFAUT, ctxAudio } from './audio.js';
import { dessinerPortee, dessinerGrille, legende, analyser, frappes } from './notation.js';
import { GROOVES, FILLS, EXERCICES } from './patterns.js';
import { LECONS, NIVEAUX } from './lessons.js';
import { dessinerKit } from './kit.js';
import { Lecteur } from './player.js';
import * as P from './progress.js';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

let motifCourant = null;
let leconCourante = null;
let portee = null;          // {svg, xDe, playhead, ...}
let grille = null;
let modeJeu = false;
let jugements = [];
let chronoLecture = null;

/* ================= kit ================= */
const kit = dessinerKit(async id => { await reprendreAudio(); jouer(id, 0, { velo:0.9 }); kit.flash(id); });
$('#kit-diagram').appendChild(kit.svg);

/* ================= lecteur ================= */
const lecteur = new Lecteur({
  onPos: pos => majTeteLecture(pos),
  onFrappe: notes => { masquerDecompte(); for (const n of notes) kit.flash(n.signe === 'o' && n.inst === 'CH' ? 'CH' : n.inst); },
  onCompte: n => afficherDecompte(n),
  onBoucle: () => { if (modeJeu) resumerJeu(); if (motifCourant) P.noterTempo(motifCourant.id, lecteur.bpm); },
  onTempo: bpm => { $('#bpm').value = bpm; $('#bpm-num').value = bpm; },
  onFin: () => { majBoutonPlay(false); stopChrono(); masquerDecompte(); }
});

/* ================= chargement d'un motif ================= */
function chargerMotif(motif, { titre, sous, badges = [], corps = null, lecon = null } = {}){
  if (lecteur.enLecture) lecteur.arreter();
  motifCourant = motif;
  leconCourante = lecon;
  lecteur.charger(motif);

  const bpm = motif.bpm || [50, 90, 180];
  $('#bpm').min = bpm[0]; $('#bpm').max = bpm[2];
  $('#bpm-num').min = bpm[0]; $('#bpm-num').max = bpm[2];
  lecteur.setTempo(bpm[1]);
  $('#ramp-max').value = Math.min(bpm[2], bpm[1] + 30);

  $('#piece-title').textContent = titre || motif.nom;
  $('#piece-sub').textContent = sous || motif.desc || '';
  $('#piece-badges').innerHTML = badges.map(b => `<span class="badge">${b}</span>`).join('');
  $('#btn-play').disabled = false;
  $('#btn-stop').disabled = false;
  $('#score-empty').classList.add('hidden');

  rendrePartition();
  majMixer();
  if (corps) $('#lesson-body').innerHTML = corps;
  $('#practice-score').classList.add('hidden');
  jugements = [];

  const utilises = Object.keys(analyser(motif).pistes).filter(id => INSTRUMENTS[id]);
  kit.surligner(utilises);
}

function rendrePartition(){
  if (!motifCourant) return;
  const wStaff = $('#score-staff');
  wStaff.innerHTML = '';
  portee = dessinerPortee(motifCourant);
  if ($('#opt-names').checked) wStaff.appendChild(legende(motifCourant));
  const scroller = document.createElement('div');
  scroller.className = 'scroll-x';
  scroller.appendChild(portee.svg);
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
  majVueScore();
}

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
    po.svg.appendChild(t);
  }
}

/* ================= tête de lecture ================= */
let dernierStep = -1;
function majTeteLecture(pos){
  if (pos == null){
    if (portee) portee.playhead.setAttribute('opacity', 0);
    $$('.cel.actif').forEach(e => e.classList.remove('actif'));
    $$('.note-grp.actif').forEach(e => e.classList.remove('actif'));
    dernierStep = -1;
    return;
  }
  if (portee){
    const x = portee.xDe(Math.min(pos, portee.total - 0.001));
    portee.playhead.setAttribute('x', x - 1.2);
    portee.playhead.setAttribute('opacity', 1);
    if ($('#opt-follow').checked){
      const box = $('#score-staff .scroll-x');
      if (box && box.scrollWidth > box.clientWidth){
        const cible = x - box.clientWidth * 0.35;
        box.scrollLeft += (cible - box.scrollLeft) * 0.25;
      }
    }
  }
  const step = Math.floor(pos);
  if (step !== dernierStep){
    dernierStep = step;
    $$('.cel.actif').forEach(e => e.classList.remove('actif'));
    $$(`.grille-table [data-step="${step}"]`).forEach(e => e.classList.add('actif'));
    $$('.note-grp.actif').forEach(e => e.classList.remove('actif'));
    if (portee && portee.notesParStep.has(step))
      portee.notesParStep.get(step).forEach(g => g.classList.add('actif'));
    const g = $('#score-grid .grille');
    if (g && $('#opt-follow').checked && g.scrollWidth > g.clientWidth){
      const cel = g.querySelector(`td[data-step="${step}"]`);
      if (cel) g.scrollLeft += (cel.offsetLeft - g.clientWidth * 0.4 - g.scrollLeft) * 0.3;
    }
  }
}

function afficherDecompte(n){
  const o = $('#count-overlay');
  o.classList.remove('hidden');
  o.querySelector('span').textContent = n;
}
function masquerDecompte(){ $('#count-overlay').classList.add('hidden'); }

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
      <button class="mix-mute" data-inst="${id}" title="Couper / rétablir">🔊</button>
      <span class="mix-nom" style="border-color:${def.couleur}">${def.court}</span>
      <input type="range" min="0" max="1.4" step="0.05" value="${VOLUMES_DEFAUT[id]}" data-vol="${id}">`;
    mx.appendChild(row);
  }
  mx.querySelectorAll('[data-vol]').forEach(sl => {
    sl.addEventListener('input', () => setVolume(sl.dataset.vol, parseFloat(sl.value)));
  });
  mx.querySelectorAll('.mix-mute').forEach(b => {
    b.addEventListener('click', () => {
      const on = b.classList.toggle('coupe');
      setMute(b.dataset.inst, on);
      b.textContent = on ? '🔇' : '🔊';
    });
  });
}

/* ================= listes ================= */
function carte(p, extra = ''){
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'item';
  el.innerHTML = `
    <span class="item-main">
      <span class="item-nom">${p.nom}</span>
      <span class="item-meta">${p.style ? p.style + ' · ' : ''}${p.bpm ? p.bpm[1] + ' BPM' : ''}${extra}</span>
    </span>
    <span class="niv niv-${p.niveau || 1}">N${p.niveau || 1}</span>`;
  return el;
}

function listeGrooves(filtre = ''){
  const box = $('#groove-list');
  box.innerHTML = '';
  const f = filtre.trim().toLowerCase();
  for (const g of GROOVES){
    if (f && !(g.nom + ' ' + g.style + ' ' + (g.desc || '')).toLowerCase().includes(f)) continue;
    const el = carte(g);
    el.addEventListener('click', () => {
      selectionner(el, box);
      chargerMotif(g, {
        titre: g.nom, sous: g.desc, badges:[g.style, 'Niveau ' + g.niveau, g.bpm[1] + ' BPM'],
        corps: `<h3>${g.nom}</h3><p>${g.desc}</p>
                <div class="tip"><b>💡 Conseil</b><p>${g.astuce}</p></div>
                <p class="muted small">Astuce : coupe un élément dans le mixer pour travailler les autres séparément.</p>`
      });
    });
    box.appendChild(el);
  }
  if (!box.children.length) box.innerHTML = '<p class="muted small">Aucun rythme ne correspond.</p>';
}

function listeFills(){
  const box = $('#fill-list');
  for (const g of FILLS){
    const el = carte(g);
    el.addEventListener('click', () => {
      selectionner(el, box);
      chargerMotif(g, {
        titre:g.nom, sous:'1 mesure de groove + 1 mesure de break, en boucle',
        badges:['Break', 'Niveau ' + g.niveau],
        corps:`<h3>${g.nom}</h3><p>${g.desc}</p>
               <div class="tip"><b>💡 Conseil</b><p>${g.astuce}</p></div>
               <p class="muted small">La première mesure est un groove rock simple : elle sert à te remettre en place après le break.</p>`
      });
    });
    box.appendChild(el);
  }
}

function listeExercices(){
  const box = $('#drill-list');
  for (const g of EXERCICES){
    const el = carte(g);
    el.addEventListener('click', () => {
      selectionner(el, box);
      chargerMotif(g, {
        titre:g.nom, sous:g.desc, badges:[g.style, 'Niveau ' + g.niveau],
        corps:`<h3>${g.nom}</h3><p>${g.desc}</p>
               <div class="tip"><b>💡 Conseil</b><p>${g.astuce}</p></div>
               <h4>Méthode d'entraînement</h4>
               <ol>
                 <li>Règle le tempo au minimum, coche <b>Métronome</b>.</li>
                 <li>Joue 8 mesures sans aucune erreur.</li>
                 <li>Coche <b>Tempo progressif</b> : +4 BPM toutes les 2 boucles.</li>
                 <li>Note le tempo où ça se dégrade : c'est ta limite du jour. Reviens 10 BPM en dessous et reste-y 5 minutes.</li>
               </ol>`
      });
    });
    box.appendChild(el);
  }
}

function listeLecons(){
  const box = $('#lesson-list');
  box.innerHTML = '';
  for (const niv of NIVEAUX){
    const h = document.createElement('div');
    h.className = 'grp';
    h.innerHTML = `<span class="grp-pt" style="background:${niv.couleur}"></span>${niv.nom}`;
    box.appendChild(h);
    for (const l of LECONS.filter(x => x.niveau === niv.n)){
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'item lecon' + (P.estFaite(l.id) ? ' faite' : '');
      el.dataset.lecon = l.id;
      el.innerHTML = `
        <span class="coche">${P.estFaite(l.id) ? '✓' : ''}</span>
        <span class="item-main">
          <span class="item-nom">${LECONS.indexOf(l) + 1}. ${l.titre}</span>
          <span class="item-meta">${l.duree} · ${l.objectif}</span>
        </span>`;
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
    <h3>${l.titre}</h3>
    <p class="objectif"><b>Objectif :</b> ${l.objectif}</p>
    ${l.contenu}
    ${l.defi ? `<div class="defi"><b>🎯 Défi</b><p>${l.defi.texte}</p>
        ${record ? `<p class="muted small">Ton meilleur tempo sur cette leçon : <b>${record} BPM</b>${record >= l.defi.bpm ? ' — défi réussi ✅' : ''}</p>` : ''}</div>` : ''}
    ${(l.conseils || []).map(c => `<div class="tip"><b>💡</b><p>${c}</p></div>`).join('')}
    <div class="lecon-actions">
      <label class="chk big"><input type="checkbox" id="chk-faite" ${P.estFaite(l.id) ? 'checked' : ''}> Leçon terminée</label>
      ${idx > 0 ? `<button class="btn tiny ghost" data-goto="${LECONS[idx-1].id}">← Précédente</button>` : ''}
      ${idx < LECONS.length - 1 ? `<button class="btn tiny" data-goto="${LECONS[idx+1].id}">Suivante →</button>` : ''}
    </div>`;

  chargerMotif(l.pattern, {
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
}

/* ================= transport ================= */
function majBoutonPlay(enCours){
  $('#play-ico').textContent = enCours ? '■' : '▶';
  $('#play-label').textContent = enCours ? 'Arrêter' : 'Écouter';
  $('#btn-play').classList.toggle('actif', enCours);
}

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

$('#opt-loop').addEventListener('change', e => lecteur.options.boucle = e.target.checked);
$('#opt-count').addEventListener('change', e => lecteur.options.decompte = e.target.checked);
$('#opt-click').addEventListener('change', e => lecteur.options.clic = e.target.checked);
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
  $$('#view-toggle .seg-btn').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
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
  $('#practice-info').textContent = modeJeu
    ? "Mode jeu actif : joue au clavier (touche « Aide clavier » pour les touches)."
    : "Joue sur le clavier en rythme, l'appli note ta précision.";
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
  const longueur = a.total * dur;
  let meilleur = Infinity;
  for (let s = 0; s < a.total; s++){
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
window.addEventListener('keydown', async e => {
  if (e.target.matches('input, textarea, select')) return;
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
  if (e.target.matches('input, textarea, select')) return;
  if (e.key === 'Enter'){ e.preventDefault(); $('#btn-play').click(); }
});

/* ================= onglets ================= */
function basculerVue(nom){
  $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.view === nom));
  $$('.side-panel').forEach(p => p.classList.toggle('hidden', p.dataset.panel !== nom));
  if (nom === 'progression') majProgression();
}
$$('.tab').forEach(t => t.addEventListener('click', () => basculerVue(t.dataset.view)));

$('#btn-help').addEventListener('click', () => $('#help-modal').classList.remove('hidden'));
$('#btn-help-close').addEventListener('click', () => $('#help-modal').classList.add('hidden'));
$('#help-modal').addEventListener('click', e => { if (e.target.id === 'help-modal') e.currentTarget.classList.add('hidden'); });

$('#search-grooves').addEventListener('input', e => listeGrooves(e.target.value));

/* ================= démarrage ================= */
listeLecons();
listeGrooves();
listeFills();
listeExercices();
majProgression();
majRampe();

const derniere = P.etatActuel().derniereLecon;
if (derniere && LECONS.some(l => l.id === derniere)) ouvrirLecon(derniere);
else ouvrirLecon(LECONS[0].id);

document.addEventListener('pointerdown', () => initAudio(), { once:true });
