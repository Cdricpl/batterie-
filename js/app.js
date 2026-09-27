/* Assemblage de l'interface : des écrans (accueil, listes, lecteur), navigation par l'adresse (#/…). */
import { INSTRUMENTS, ORDRE, TOUCHES, estNote } from './instruments.js';
import { initAudio, reprendreAudio, jouer, setVolume, setMute, setSolos, setBatterie, VOLUMES_DEFAUT } from './audio.js';
import { dessinerPortee, dessinerGrille, legende, analyser, tranche, dimensions } from './notation.js';
import { GROOVES, FILLS, EXERCICES } from './patterns.js';
import { RUDIMENTS, FAMILLES_RUDIMENTS } from './rudiments.js';
import { MORCEAUX, compilerMorceau } from './songs.js';
import { LECONS, NIVEAUX } from './lessons.js';
import { dessinerKit } from './kit.js';
import { creerVueKit } from './vuekit.js';
import { Lecteur } from './player.js';
import { CATEGORIES, kitNiveau, miniGroove, miniDoigte, miniVinyle } from './illustrations.js';
import * as P from './progress.js';
import { VERSION, DATE_VERSION } from './version.js';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

let motifCourant = null;
let elementCourant = null;     // {liste, item}
let grille = null;
let vueKit = null;              // affichage « Batterie »
let casesParStep = new Map();  // pas → cases de la grille
let actifsGrille = [];
let modeJeu = false;
let solosActifs = new Set();
let jugements = [];
let chronoLecture = null;
const vue = { systemes:[], ligne:-1, dernierStep:-1, actifs:[] };   // lignes de la partition

/* ================= réglages mémorisés ================= */
const CLE_REGLAGES = 'ma-batterie-reglages';
const CLE_DERNIERE = 'ma-batterie-derniere';
const lire = (cle, defaut) => { try { return JSON.parse(localStorage.getItem(cle)) ?? defaut; } catch { return defaut; } };
const ecrire = (cle, v) => { try { localStorage.setItem(cle, JSON.stringify(v)); } catch { /* mode privé */ } };
const reglages = { vue:'staff', decompte:true, boucle:true, clic:false, ...lire(CLE_REGLAGES, {}) };
const sauverReglages = () => ecrire(CLE_REGLAGES, reglages);

/* ================= version ================= */
$('#version').textContent = 'v' + VERSION;
$('#version-detail').textContent = `Version ${VERSION} du ${DATE_VERSION.split('-').reverse().join('/')}`;

/* ================= contenus ================= */
const NOMS_NIVEAUX = ['', 'Débutant', 'Débutant +', 'Intermédiaire', 'Confirmé', 'Avancé', 'Expert'];
const signature = m => `${m.beats ?? 4}/${m.unite ?? 4}`;
const parNiveau = liste => [...liste].sort((a, b) => (a.niveau || 1) - (b.niveau || 1));
const CONSEIL = t => `<div class="tip"><span class="tip-lbl">Conseil</span><p>${t}</p></div>`;
const METHODE = `
  <h3>Méthode d'entraînement</h3>
  <ol>
    <li>Tempo au minimum, métronome allumé.</li>
    <li>8 mesures d'affilée sans aucune erreur.</li>
    <li><b>Tempo progressif</b> (réglages) : +4 BPM toutes les 2 boucles.</li>
    <li>Note le tempo où ça se dégrade : c'est ta limite du jour. Reviens 10 BPM en dessous pendant 5 minutes.</li>
  </ol>`;

/* Couleurs vives, en dégradé (clair → soutenu), une par niveau et par famille */
const NIV_GRAD = [['#34d399', '#059669'], ['#38bdf8', '#2563eb'], ['#fbbf24', '#e8590c'],
                  ['#fb923c', '#dc2626'], ['#f472b6', '#be185d'], ['#a78bfa', '#6d28d9']];
const GRAD_RYTHMES = { rock:['#fb923c', '#e11d48'], funk:['#f472b6', '#a21caf'], urbain:['#818cf8', '#4338ca'],
  monde:['#34d399', '#0f766e'], ternaire:['#38bdf8', '#0369a1'], lourd:['#94a3b8', '#1e293b'], impair:['#fbbf24', '#c2410c'] };
const GRAD_TRAVAIL = { roulements:['#38bdf8', '#1d4ed8'], diddles:['#a78bfa', '#6d28d9'], flams:['#fb7185', '#be123c'],
  drags:['#fbbf24', '#c2410c'], coordination:['#34d399', '#047857'] };
const gradStyle = g => `--c1:${g[0]};--c2:${g[1]}`;

/* Morceaux rangés par genre, puis par niveau dans chaque genre */
const GENRES_MORCEAUX = [
  { id:'rock',    nom:'Rock',               court:'Rock',    styles:['Rock', 'Grunge', 'Pop rock', 'Rock progressif', 'Rock\'n\'roll', 'Punk'], grad:['#fb923c', '#e11d48'] },
  { id:'hard',    nom:'Hard rock & métal',  court:'Métal',   styles:['Hard rock', 'Métal'],                 grad:['#94a3b8', '#1e293b'] },
  { id:'pop',     nom:'Pop',                court:'Pop',     styles:['Pop'],                                grad:['#f472b6', '#be185d'] },
  { id:'funk',    nom:'Funk, soul & disco', court:'Funk',    styles:['Funk', 'Funk rock', 'Disco', 'Soul'], grad:['#fbbf24', '#c2410c'] },
  { id:'urbain',  nom:'Hip-hop & électro',  court:'Électro', styles:['Hip-hop', 'Électro'],                 grad:['#818cf8', '#4338ca'] },
  { id:'variete', nom:'Variété française',  court:'Variété', styles:['Variété'],                            grad:['#38bdf8', '#1d4ed8'] },
  { id:'monde',   nom:'Reggae & latino',    court:'Latino',  styles:['Reggae', 'Latin'],                    grad:['#34d399', '#0f766e'] },
  { id:'jazz',    nom:'Blues & jazz',       court:'Jazz',    styles:['Blues', 'Jazz'],                      grad:['#a78bfa', '#6d28d9'] }
];
const genreDe = m => GENRES_MORCEAUX.find(g => g.styles.includes(m.style)) || GENRES_MORCEAUX[0];
const morceauxDe = g => parNiveau(MORCEAUX.filter(m => genreDe(m) === g));

const FAMILLES_RYTHMES = [
  { id:'rock',     nom:'Rock & pop',        desc:'Le socle : croches, doubles, ballades.',   styles:['Rock', 'Ballade', 'Country'] },
  { id:'funk',     nom:'Funk & soul',       desc:'Ghost notes, Motown, disco.',              styles:['Funk', 'Soul', 'Disco'] },
  { id:'urbain',   nom:'Hip-hop & électro', desc:'Boom bap, trap, drum and bass.',           styles:['Hip-hop', 'Électro', 'Reggaeton'] },
  { id:'monde',    nom:'Reggae & monde',    desc:'One drop, ska, bossa, samba, afro.',       styles:['Reggae', 'Ska', 'Latin', 'Afro'] },
  { id:'ternaire', nom:'Blues & jazz',      desc:'Shuffle, swing, valse, 12/8.',             styles:['Blues', 'Blues/Rock', 'Jazz', 'Traditionnel'] },
  { id:'lourd',    nom:'Punk & métal',      desc:'Vitesse, double pédale, blast beat.',      styles:['Punk', 'Métal'] },
  { id:'impair',   nom:'Mesures impaires',  desc:'5/4, 7/8 : compter autrement.',            styles:['Mesures composées'] }
];
const familleRythme = g => (FAMILLES_RYTHMES.find(f => f.styles.includes(g.style)) || FAMILLES_RYTHMES[0]).id;
const rythmesDe = fam => parNiveau(GROOVES.filter(g => familleRythme(g) === fam));

const DESC_RUDIMENTS = {
  roulements:'Single et double stroke : la base des mains.',
  diddles:'Paradiddles : alterner et doubler.',
  flams:'Deux baguettes presque ensemble.',
  drags:'Deux notes d\'agrément avant la frappe.',
  coordination:'Mains, pieds, tempo : l\'indépendance.'
};
const FAMILLES_TRAVAIL = [
  ...FAMILLES_RUDIMENTS.map(f => ({ ...f, desc:DESC_RUDIMENTS[f.id] || '' })),
  { id:'coordination', nom:'Coordination & tempo', desc:DESC_RUDIMENTS.coordination }
];

/* Chaque liste jouable : ses éléments (pour ‹ ›), son écran de retour, son nom */
const LISTES = {
  lecon:    { nom:'Leçon',    items: () => LECONS,                                     retour: it => '#/parcours/' + it.niveau },
  rythme:   { nom:'Rythme',   items: it => rythmesDe(familleRythme(it)),               retour: it => '#/rythmes/' + familleRythme(it) },
  morceau:  { nom:'Morceau',  items: it => morceauxDe(genreDe(it)),                    retour: it => '#/morceaux/' + genreDe(it).id },
  break:    { nom:'Break',    items: it => FILLS.filter(f => (f.niveau || 1) === (it.niveau || 1)), retour: it => '#/breaks/' + (it.niveau || 1) },
  rudiment: { nom:'Rudiment', items: it => RUDIMENTS.filter(r => r.famille === it.famille), retour: it => '#/rudiments/' + it.famille },
  exercice: { nom:'Exercice', items: () => EXERCICES,                                  retour: () => '#/rudiments/coordination' }
};
const SOURCES = { lecon:LECONS, rythme:GROOVES, morceau:MORCEAUX, break:FILLS, rudiment:RUDIMENTS, exercice:EXERCICES };
const lienJouer = (liste, it) => `#/jouer/${liste}/${encodeURIComponent(it.id)}`;
const prochaineLecon = () => LECONS.find(l => !P.estFaite(l.id)) || LECONS[LECONS.length - 1];

/* ================= kit (volet d'explications) ================= */
const kit = dessinerKit(async id => { await reprendreAudio(); jouer(id, 0, { velo:0.9 }); kit.flash(id); });
$('#kit-diagram').appendChild(kit.svg);

/* ================= lecteur ================= */
const lecteur = new Lecteur({
  onPos: pos => majTeteLecture(pos),
  onFrappe: (notes, step) => { masquerDecompte(); if (vueKit && reglages.vue === 'kit') vueKit.frappe(notes, step); },
  onCompte: n => afficherDecompte(n),
  onBoucle: () => { if (modeJeu) resumerJeu(); if (motifCourant) P.noterTempo(motifCourant.id, lecteur.bpm); },
  onTempo: bpm => { $('#bpm').value = bpm; $('#bpm-val').textContent = bpm; },
  onFin: () => { majBoutonPlay(false); stopChrono(); masquerDecompte(); }
});
lecteur.options.decompte = reglages.decompte;
lecteur.options.boucle = reglages.boucle;
lecteur.options.clic = reglages.clic;

/* ================= navigation ================= */
function montrer(id){
  for (const e of $$('.ecran')) e.hidden = e.id !== id;
}

function route(){
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  fermerVolets(false);
  $('#toast').hidden = true;
  if (parts[0] !== 'jouer') quitterLecteur();
  switch (parts[0]){
    case 'parcours':    return parts[1] ? ecranNiveau(+parts[1]) : ecranParcours();
    case 'rythmes':     return parts[1] ? ecranFamilleRythmes(parts[1]) : ecranRythmes();
    case 'morceaux':    return parts[1] ? ecranGenre(parts[1]) : ecranMorceaux();
    case 'breaks':      return parts[1] ? ecranNiveauBreaks(+parts[1]) : ecranBreaks();
    case 'rudiments':   return parts[1] ? ecranFamilleTravail(parts[1]) : ecranRudiments();
    case 'progression': return ecranProgression();
    case 'jouer':       if (ouvrir(parts[1], parts[2])) return; break;
  }
  ecranAccueil();
}
window.addEventListener('hashchange', route);

/* ================= accueil ================= */
function ecranAccueil(){
  montrer('ecran-accueil');
  const faites = P.nbFaites();
  const suivante = prochaineLecon();
  const idx = LECONS.indexOf(suivante) + 1;
  $('#parcours-resume').textContent = faites
    ? `${faites} leçon${faites > 1 ? 's' : ''} sur ${LECONS.length} terminée${faites > 1 ? 's' : ''}.`
    : `${LECONS.length} leçons pas à pas, du tout premier coup au niveau avancé.`;
  $('#parcours-jauge').style.width = Math.round(faites / LECONS.length * 100) + '%';
  $('#cta-continuer').href = lienJouer('lecon', suivante);
  $('#cta-texte').innerHTML = `<span class="cta-verbe">${faites ? 'Continuer' : 'Commencer'} · </span>Leçon ${faites ? idx : 1}`;
  $('#compte-rythmes').textContent = `${GROOVES.length} grooves, du rock au 9/8`;
  $('#compte-morceaux').textContent = `${MORCEAUX.length} titres connus à jouer`;
  $('#compte-breaks').textContent = `${FILLS.length} fills pour relier les parties`;
  $('#compte-rudiments').textContent = `${RUDIMENTS.length} rudiments et ${EXERCICES.length} exercices`;
  majStat();

  const nTravail = P.elementsDe('travail').filter(e => SOURCES[e.liste] && SOURCES[e.liste].some(x => x.id === e.id)).length;
  $('#pastille-travail').hidden = !nTravail;
  $('#travail-n').textContent = nTravail;
  $('#pastille-travail').title = `${nTravail} à travailler`;
  const derniere = lire(CLE_DERNIERE, null);
  const it = derniere && SOURCES[derniere.liste] && SOURCES[derniere.liste].find(x => x.id === derniere.id);
  const r = $('#reprendre');
  // les leçons se reprennent avec « Continuer » : ici, le dernier rythme, morceau ou exercice
  if (it && derniere.liste !== 'lecon'){
    r.hidden = false;
    r.href = lienJouer(derniere.liste, it);
    const nom = it.titre || it.nom;
    r.title = 'Reprendre · ' + nom;
    // nom court (sans la précision entre parenthèses) ; s'il ne tient pas, « Reprendre » seul
    const court = nom.replace(/\s*\(.*?\)/g, '').replace(/\s+—.*$/, '').trim();
    const t = $('#reprendre-texte');
    t.textContent = 'Reprendre';
    const n = document.createElement('span');
    n.className = 'reprendre-nom';
    n.textContent = ' · ' + court;
    t.appendChild(n);
    requestAnimationFrame(ajusterReprendre);
  } else r.hidden = true;
}
function ajusterReprendre(){
  const t = $('#reprendre-texte'), n = t.querySelector('.reprendre-nom');
  if (!n || !t.clientWidth) return;
  n.hidden = false;
  if (t.scrollWidth > t.clientWidth + 1) n.hidden = true;
}
if (typeof ResizeObserver !== 'undefined') new ResizeObserver(ajusterReprendre).observe($('#reprendre').closest('.entete'));
function majStat(){
  const s = P.serie();
  $('#streak-text').textContent = `${P.minutesAujourdhui()} min` + (s > 1 ? ` · ${s} j` : '');
}
for (const [id, dessin] of Object.entries(CATEGORIES)){
  const box = $('#illus-' + id);
  if (box) box.innerHTML = dessin;
}

/* ================= écrans de liste ================= */
/* Les listes défilent de gauche à droite : une bande de cartes sur toute la hauteur */
function ecranListe({ sur = '', titre, retour = '#/', html, sauts = [] }){
  montrer('ecran-liste');
  $('#liste-sur').textContent = sur;
  $('#liste-titre').textContent = titre;
  $('#liste-retour').href = retour;
  const corps = $('#liste-corps');
  corps.innerHTML = `<div class="bande">${html}</div>`;
  corps.scrollLeft = 0;
  // raccourcis vers un groupe (niveaux des morceaux, des breaks)
  const bar = $('#liste-sauts');
  bar.innerHTML = sauts.map(([id, texte, couleur]) =>
    `<button type="button" class="chip saut" data-cible="${id}" style="--c:${couleur}">${texte}</button>`).join('');
  bar.querySelectorAll('[data-cible]').forEach(b => b.addEventListener('click', () => {
    const cible = document.getElementById(b.dataset.cible);
    if (!cible) return;
    const depart = corps.scrollLeft;
    const aller = () => corps.scrollTo({ left:cible.offsetLeft - corps.offsetLeft - 4,
      behavior:matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' });
    aller();
    // au tout premier toucher, le passage en plein écran peut interrompre le défilement : on relance
    setTimeout(() => { if (corps.scrollLeft === depart) aller(); }, 350);
  }));
  document.title = titre + ' — Ma Batterie';
}
// à la souris, la molette fait aussi défiler la bande de gauche à droite
$('#liste-corps').addEventListener('wheel', e => {
  const corps = e.currentTarget;
  if (Math.abs(e.deltaY) <= Math.abs(e.deltaX) || e.ctrlKey) return;
  const bloc = e.target.closest('.bloc-defile');
  if (bloc && bloc.scrollHeight > bloc.clientHeight) return;   // un bloc qui défile en hauteur garde la molette
  corps.scrollLeft += e.deltaY;
  e.preventDefault();
}, { passive:false });

const points = n => `<span class="niveau-points" aria-label="Niveau ${n}">${[1, 2, 3, 4, 5, 6].map(i => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</span>`;

function tuile({ href, illus = '', titre, texte = '', coin = '', jauge = null, grad }){
  return `<a class="tuile" href="${href}" style="${gradStyle(grad)}">
    ${coin ? `<span class="t-coin">${coin}</span>` : ''}
    <div class="t-illus">${illus}</div>
    <h2>${titre}</h2>
    <p>${texte}</p>
    ${jauge != null ? `<div class="jauge fine"><i style="width:${jauge}%"></i></div>` : ''}
  </a>`;
}

/* pastille de statut : acquis (coche verte), à travailler (drapeau orange), à faire (cercle vide, leçons) */
function marqueStatut(st, aFaire = false){
  if (st === 'acquis') return '<span class="etat acquis" title="Acquis" aria-label="acquis"><svg class="ico"><use href="#i-coche"/></svg></span>';
  if (st === 'travail') return '<span class="etat travail" title="À travailler" aria-label="à travailler"><svg class="ico"><use href="#i-drapeau"/></svg></span>';
  return aFaire ? '<span class="etat" aria-label="à faire"></span>' : '';
}

function itemCarte({ href, num = '', nom, meta = '', niveau = 0, bpm = '', aFaire = false, classe = '', badge = '', illus = '', grad }){
  const [, , liste, id] = href.split('/');               // #/jouer/<liste>/<id>
  const st = P.statut(liste, decodeURIComponent(id || ''));
  const marque = marqueStatut(st, aFaire);
  // la pastille de statut se pose en coin du visuel (carte basse) ou en pied de carte (carte haute)
  const coin = marque.replace('class="etat', 'class="etat etat-vis');
  const visuel = illus ? `<div class="i-vis">${illus}${coin}</div>`
    : num !== '' ? `<div class="i-vis i-vis-num"><span class="i-num">${num}</span>${coin}</div>` : '';
  if (st === 'travail') classe += ' a-travailler';
  // niveau, tempo et état : sous le visuel (carte basse) ou en pied de carte (carte haute)
  const bas = niveau || bpm || marque
    ? `<span class="i-bas">${niveau ? points(niveau) : ''}${bpm ? `<span class="bpm-pastille">${bpm}</span>` : ''}${marque.replace('class="etat', 'class="etat etat-bas')}</span>` : '';
  return `<a class="item-carte ${classe}" href="${href}" style="${gradStyle(grad)}">
    <div class="i-corps">
      ${visuel}
      <div class="i-texte">
        ${badge}
        <span class="i-nom">${nom.replace(/« /g, '«\u00a0').replace(/ »/g, '\u00a0»')}</span>
        ${meta ? `<span class="i-meta">${meta}</span>` : ''}
      </div>
      ${bas}
    </div>
  </a>`;
}

/* un groupe de la bande : une carte-titre, puis ses cartes */
const groupe = (id, n, lot, carte, unite = 'titre') => `<section class="groupe" id="${id}">
    <div class="groupe-tete" style="${gradStyle(NIV_GRAD[n - 1])}"><span class="g-num">${n}</span><b>${NOMS_NIVEAUX[n]}</b><span>${lot.length} ${unite}${lot.length > 1 ? 's' : ''}</span></div>
    <div class="rangee">${lot.map(carte).join('')}</div>
  </section>`;
const sautsNiveaux = (liste, prefixe) => [1, 2, 3, 4, 5, 6]
  .filter(n => liste.some(x => (x.niveau || 1) === n))
  .map(n => [prefixe + n, 'N' + n, NIV_GRAD[n - 1][1]]);

/* --- parcours --- */
function ecranParcours(){
  const suivante = prochaineLecon();
  ecranListe({
    sur:`${P.nbFaites()} / ${LECONS.length} leçons terminées`, titre:'Parcours',
    html:`<div class="rangee tuiles">${NIVEAUX.map(niv => {
      const lot = LECONS.filter(l => l.niveau === niv.n);
      const ok = lot.filter(l => P.estFaite(l.id)).length;
      const [, sous] = niv.nom.split(' — ');
      return tuile({
        href:'#/parcours/' + niv.n, illus:kitNiveau(niv.n),
        titre:NOMS_NIVEAUX[niv.n], texte:sous || niv.nom,
        coin:`${ok}/${lot.length}${lot.includes(suivante) && ok < lot.length ? ' · en cours' : ''}`,
        jauge:Math.round(ok / lot.length * 100), grad:NIV_GRAD[niv.n - 1]
      });
    }).join('')}</div>`
  });
}

function ecranNiveau(n){
  const niv = NIVEAUX.find(x => x.n === n);
  if (!niv) return ecranParcours();
  const suivante = prochaineLecon();
  const lot = LECONS.filter(l => l.niveau === n);
  ecranListe({
    sur:`Niveau ${n} · ${niv.nom.split(' — ')[1] || ''}`, titre:NOMS_NIVEAUX[n], retour:'#/parcours',
    html:`<div class="rangee">${lot.map(l => {
        const fait = P.estFaite(l.id);
        const record = P.meilleurTempo(l.pattern.id);
        return itemCarte({
          href:lienJouer('lecon', l), num:LECONS.indexOf(l) + 1, nom:l.titre,
          meta:`${l.duree}${record ? ` · record ${record} BPM` : ''}`,
          aFaire:true, classe:(fait ? 'faite' : '') + (l === suivante && !fait ? ' prochaine' : ''), grad:NIV_GRAD[n - 1],
          badge:(l === suivante && !fait ? '<span class="i-tag">À toi !</span>' : '') + (l.cle ? '<span class="cle">étape clé</span>' : '')
        });
      }).join('')}</div>`
  });
}

/* --- rythmes --- */
function ecranRythmes(){
  ecranListe({
    sur:`${GROOVES.length} grooves`, titre:'Rythmes',
    html:`<div class="rangee tuiles">${FAMILLES_RYTHMES.map(f => {
      const lot = rythmesDe(f.id);
      return tuile({ href:'#/rythmes/' + f.id, illus:miniGroove(lot[0]), titre:f.nom, texte:f.desc, coin:`${lot.length} rythmes`, grad:GRAD_RYTHMES[f.id] });
    }).join('')}</div>`
  });
}
function ecranFamilleRythmes(id){
  const f = FAMILLES_RYTHMES.find(x => x.id === id);
  if (!f) return ecranRythmes();
  ecranListe({
    sur:'Rythmes', titre:f.nom, retour:'#/rythmes',
    html:`<div class="rangee">${rythmesDe(id).map(g => itemCarte({
      href:lienJouer('rythme', g), nom:g.nom, illus:miniGroove(g),
      meta:`${g.style} · ${signature(g)}`, niveau:g.niveau, bpm:`${g.bpm[1]} BPM`, grad:GRAD_RYTHMES[id]
    })).join('')}</div>`
  });
}

/* --- morceaux --- */
function ecranMorceaux(){
  ecranListe({
    sur:`${MORCEAUX.length} titres · choisis un style`, titre:'Morceaux',
    html:`<div class="rangee tuiles">${GENRES_MORCEAUX.map(g => {
      const lot = morceauxDe(g);
      if (!lot.length) return '';
      const artistes = [...new Set(lot.map(m => m.artiste))].slice(0, 3).join(', ');
      return tuile({ href:'#/morceaux/' + g.id, illus:miniGroove(compilerMorceau(lot[Math.floor(lot.length / 2)])),
        titre:g.nom, texte:artistes + '…', coin:`${lot.length} titres`, grad:g.grad });
    }).join('')}</div>`
  });
}
function ecranGenre(id){
  const g = GENRES_MORCEAUX.find(x => x.id === id);
  if (!g) return ecranMorceaux();
  const lot = morceauxDe(g);
  let html = '';
  for (let n = 1; n <= 6; n++){
    const niv = lot.filter(m => m.niveau === n);
    if (!niv.length) continue;
    html += groupe('m-niv' + n, n, niv, m => itemCarte({
      href:lienJouer('morceau', m), nom:m.titre, meta:`${m.artiste} · ${m.annee}`,
      niveau:m.niveau, bpm:`${m.bpm} BPM`, illus:miniVinyle(), grad:NIV_GRAD[n - 1]
    }));
  }
  ecranListe({ sur:`Morceaux · ${lot.length} titres, par niveau`, titre:g.nom, retour:'#/morceaux', html,
    sauts:sautsNiveaux(lot, 'm-niv') });
}

/* --- breaks --- */
function ecranBreaks(){
  ecranListe({
    sur:`${FILLS.length} breaks · choisis ton niveau`, titre:'Breaks',
    html:`<div class="rangee tuiles">${[1, 2, 3, 4, 5, 6].map(n => {
      const lot = FILLS.filter(f => (f.niveau || 1) === n);
      if (!lot.length) return '';
      return tuile({ href:'#/breaks/' + n, illus:miniGroove(lot[0], 1), titre:NOMS_NIVEAUX[n],
        texte:lot.slice(0, 2).map(f => f.nom.replace(/\s*\(.*\)/, '')).join(', ') + '…',
        coin:`${lot.length} break${lot.length > 1 ? 's' : ''}`, grad:NIV_GRAD[n - 1] });
    }).join('')}</div>`
  });
}
function ecranNiveauBreaks(n){
  const lot = FILLS.filter(f => (f.niveau || 1) === n);
  if (!lot.length) return ecranBreaks();
  ecranListe({
    sur:`Breaks · niveau ${n} · groove + break`, titre:NOMS_NIVEAUX[n], retour:'#/breaks',
    html:`<div class="rangee">${lot.map(f => itemCarte({
      href:lienJouer('break', f), nom:f.nom,
      meta:f.res === 3 ? 'Triolets' : f.res === 6 ? 'Sextolets' : f.res === 8 ? 'Triples-croches' : 'Groove + break',
      niveau:f.niveau, illus:miniGroove(f, 1), grad:NIV_GRAD[n - 1]
    })).join('')}</div>`
  });
}

/* --- rudiments et coordination --- */
function ecranRudiments(){
  ecranListe({
    sur:`${RUDIMENTS.length + EXERCICES.length} exercices`, titre:'Rudiments',
    html:`<div class="rangee tuiles">${FAMILLES_TRAVAIL.map(f => {
      const lot = f.id === 'coordination' ? EXERCICES : RUDIMENTS.filter(r => r.famille === f.id);
      const illus = f.id === 'coordination' ? miniGroove(EXERCICES[3]) : miniDoigte(lot[0].doigte);
      return tuile({ href:'#/rudiments/' + f.id, illus, titre:f.nom.replace(/\s*\(.*\)/, ''), texte:f.desc, coin:`${lot.length} exercices`, grad:GRAD_TRAVAIL[f.id] });
    }).join('')}</div>`
  });
}
function ecranFamilleTravail(id){
  const f = FAMILLES_TRAVAIL.find(x => x.id === id);
  if (!f) return ecranRudiments();
  const coordination = id === 'coordination';
  const lot = coordination ? EXERCICES : RUDIMENTS.filter(r => r.famille === id);
  ecranListe({
    sur:'Rudiments', titre:f.nom.replace(/\s*\(.*\)/, ''), retour:'#/rudiments',
    html:`<div class="rangee">${lot.map(r => itemCarte({
      href:lienJouer(coordination ? 'exercice' : 'rudiment', r), nom:r.nom,
      illus:coordination ? '' : miniDoigte(r.doigte),
      meta:coordination ? r.style : '', niveau:r.niveau, bpm:r.bpm ? `${r.bpm[1]} BPM` : '', grad:GRAD_TRAVAIL[id]
    })).join('')}</div>`
  });
}

/* --- progression --- */
function ecranProgression(){
  const hist = P.historique(21);
  const maxi = Math.max(10, ...hist.map(h => h.minutes));
  const faites = P.nbFaites();
  const jours = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  const niveaux = NIVEAUX.map(niv => {
    const lot = LECONS.filter(l => l.niveau === niv.n);
    const ok = lot.filter(l => P.estFaite(l.id)).length;
    return `<div class="niv-bloc">
      <div class="niv-head"><i style="background:${NIV_GRAD[niv.n - 1][1]}"></i><b>${NOMS_NIVEAUX[niv.n]}</b><span class="muted">${ok}/${lot.length}</span></div>
      <div class="niv-lecons">${lot.map(l => {
        const bpm = P.meilleurTempo(l.pattern.id);
        const defi = l.defi && bpm >= l.defi.bpm;
        return `<a class="pastille${P.estFaite(l.id) ? ' faite' : ''}" href="${lienJouer('lecon', l)}"
          title="${l.titre}${bpm ? ' — meilleur tempo : ' + bpm + ' BPM' : ''}">
          <span>${LECONS.indexOf(l) + 1}</span>${bpm ? `<em>${bpm}</em>` : ''}${defi ? '<i class="defi-ok" aria-label="défi réussi"></i>' : ''}</a>`;
      }).join('')}</div></div>`;
  }).join('');

  const blocStatut = (s, titre, ico, vide) => {
    const l = P.elementsDe(s).map(e => ({ ...e, it:SOURCES[e.liste] && SOURCES[e.liste].find(x => x.id === e.id) })).filter(e => e.it);
    return `<div class="bloc bloc-statut bloc-defile ${s}">
      <h3><svg class="ico" aria-hidden="true"><use href="${ico}"/></svg>${titre} · ${l.length}</h3>
      ${l.length ? `<ul class="liste-statut">${l.map(e => `<li><a href="${lienJouer(e.liste, e.it)}">
          <span class="ls-cat">${LISTES[e.liste].nom}</span><span class="ls-nom">${e.it.titre || e.it.nom}</span></a></li>`).join('')}</ul>`
        : `<p class="muted small">${vide}</p>`}
    </div>`;
  };
  ecranListe({
    sur:'Enregistré sur cet appareil', titre:'Progression',
    html:`
        ${blocStatut('travail', 'À travailler', '#i-drapeau', "Rien pour l'instant. Dans le lecteur, touche le drapeau en haut pour garder un exercice, un rythme ou un morceau sous la main.")}
        ${blocStatut('acquis', 'Acquis', '#i-coche', "Rien pour l'instant. Dans le lecteur, touche la coche quand tu maîtrises un exercice. (Les leçons terminées sont comptées dans le parcours.)")}
        <div class="bloc bloc-stats">
          <h3>En chiffres</h3>
          <div class="stats">
            <div class="stat"><span class="stat-n">${faites}/${LECONS.length}</span><span>leçons terminées</span></div>
            <div class="stat"><span class="stat-n">${P.minutesAujourdhui()} min</span><span>aujourd'hui</span></div>
            <div class="stat"><span class="stat-n">${P.serie()} j</span><span>jours d'affilée</span></div>
            <div class="stat"><span class="stat-n">${P.minutesTotal()} min</span><span>au total</span></div>
          </div>
        </div>
        <div class="bloc bloc-histo">
          <h3>3 dernières semaines</h3>
          <div class="barres">${hist.map(h => {
            const d = new Date(h.jour + 'T12:00:00');
            return `<span class="barre" title="${h.jour} — ${h.minutes} min"><span class="fut">
              <i style="height:${h.minutes ? Math.max(4, Math.round(h.minutes / maxi * 100)) : 0}%"></i></span><u>${jours[d.getDay()]}</u></span>`;
          }).join('')}</div>
        </div>
      <div class="bloc bloc-parcours bloc-defile">
        <h3>Parcours</h3>
        <div class="niveaux">${niveaux}</div>
        <p class="muted small">Le petit nombre est ton meilleur tempo sur la leçon ; le point doré, un défi réussi.</p>
        <button class="btn-plat" id="btn-reset" type="button">Effacer ma progression</button>
      </div>`
  });
  $('#btn-reset').addEventListener('click', () => {
    if (confirm('Effacer toute la progression enregistrée ?')){ P.toutEffacer(); ecranProgression(); }
  });
}

/* ================= lecteur : ouvrir un élément ================= */
function ouvrir(liste, id){
  const def = LISTES[liste];
  const item = def && SOURCES[liste].find(x => x.id === id);
  if (!item) return false;
  const lot = def.items(item);
  const i = lot.indexOf(item);
  const nav = (el, cible) => {
    el.href = cible ? lienJouer(liste, cible) : '#/';
    el.setAttribute('aria-disabled', cible ? 'false' : 'true');
    el.tabIndex = cible ? 0 : -1;
  };
  nav($('#j-prec'), lot[i - 1]);
  nav($('#j-suiv'), lot[i + 1]);
  $('#j-retour').href = def.retour(item);
  elementCourant = { liste, item };
  ecrire(CLE_DERNIERE, { liste, id });

  montrer('ecran-jouer');
  const pos = `${def.nom} ${i + 1}/${lot.length}`;
  let ouvrirAide = false;
  if (liste === 'lecon'){
    P.setDerniereLecon(item.id);
    chargerMotif(item.pattern, { sur:`${pos} · ${NOMS_NIVEAUX[item.niveau]}`, titre:item.titre, aide:corpsLecon(item) });
    ouvrirAide = !P.estFaite(item.id);    // une leçon pas encore faite : on commence par la lire
  } else if (liste === 'morceau'){
    const motif = compilerMorceau(item);
    chargerMotif(motif, { sur:`${item.artiste} · ${item.annee}`, titre:item.titre, aide:corpsMorceau(item, motif) });
  } else {
    const rudiment = liste === 'rudiment';
    const aide = `<h2>${item.nom}</h2>
      <p>${[item.style, 'Niveau ' + (item.niveau || 1), item.bpm ? item.bpm[1] + ' BPM' : '', signature(item)].filter(Boolean).map(b => `<span class="badge">${b}</span>`).join('')}</p>
      <p>${item.desc || ''}</p>${item.astuce ? CONSEIL(item.astuce) : ''}
      ${liste === 'break' ? '<p class="muted small">La première mesure est un groove simple : elle sert à te remettre en place après le break.</p>' : ''}
      ${rudiment ? '<p class="muted small">D = main droite, G = main gauche. Le doigté est écrit sous la partition.</p>' : ''}
      ${liste === 'rythme' ? '<p class="muted small">Dans les réglages, le mixeur isole (S) ou coupe (M) un élément pour travailler les autres séparément.</p>' : ''}
      ${rudiment || liste === 'exercice' ? METHODE : ''}`;
    chargerMotif(item, { sur:pos, titre:item.nom, aide });
  }
  document.title = (item.titre || item.nom) + ' — Ma Batterie';
  if (ouvrirAide) ouvrirVolet('volet-aide', false);
  majStatutBoutons();
  return true;
}

/* ================= statut : à travailler / acquis ================= */
function majStatutBoutons(){
  if (!elementCourant) return;
  const st = P.statut(elementCourant.liste, elementCourant.item.id);
  for (const [b, v] of [[$('#st-travail'), 'travail'], [$('#st-acquis'), 'acquis']]){
    b.classList.toggle('actif', st === v);
    b.setAttribute('aria-pressed', String(st === v));
  }
  const chk = $('#chk-faite');
  if (chk) chk.checked = st === 'acquis';
}
function basculerStatut(v){
  if (!elementCourant) return;
  const { liste, item } = elementCourant;
  const nouveau = P.statut(liste, item.id) === v ? null : v;
  P.setStatut(liste, item.id, nouveau);
  majStatutBoutons();
  annoncer(nouveau === 'acquis' ? 'Acquis ✓ Bravo !' : nouveau === 'travail' ? 'Ajouté à « À travailler »' : 'Statut retiré');
}
$('#st-travail').addEventListener('click', () => basculerStatut('travail'));
$('#st-acquis').addEventListener('click', () => basculerStatut('acquis'));

let minuterieToast = null;
function annoncer(texte){
  const t = $('#toast');
  t.hidden = true; void t.offsetWidth;          // relance l'animation
  t.textContent = texte;
  t.hidden = false;
  clearTimeout(minuterieToast);
  minuterieToast = setTimeout(() => { t.hidden = true; }, 1800);
}

function corpsLecon(l){
  const idx = LECONS.indexOf(l);
  const record = P.meilleurTempo(l.pattern.id);
  const suivante = LECONS[idx + 1];
  return `
    <p><span class="badge">Leçon ${idx + 1}/${LECONS.length}</span><span class="badge">${NOMS_NIVEAUX[l.niveau]}</span><span class="badge">${l.duree}</span></p>
    <h2>${l.titre}</h2>
    <p class="objectif"><b>Objectif :</b> ${l.objectif}</p>
    ${l.contenu}
    ${l.defi ? `<div class="defi"><span class="tip-lbl">Défi</span><p>${l.defi.texte}</p>
        ${record ? `<p class="muted small">Ton meilleur tempo : <b>${record} BPM</b>${record >= l.defi.bpm ? ' · défi réussi' : ''}</p>` : ''}</div>` : ''}
    ${(l.conseils || []).map(CONSEIL).join('')}
    <div class="lecon-fin">
      <label class="inter"><span>Leçon terminée</span><input type="checkbox" id="chk-faite" role="switch" ${P.estFaite(l.id) ? 'checked' : ''}><i></i></label>
      ${suivante ? `<a class="btn-plat accent" href="${lienJouer('lecon', suivante)}">Leçon suivante</a>` : ''}
    </div>`;
}

function corpsMorceau(m, motif){
  const origine = m.fidelite === 'origine';
  const structure = motif.sections.map(s => {
    const n = s.fin - s.debut;
    return `<li><b>${s.nom}</b> · ${n} mesure${n > 1 ? 's' : ''}</li>`;
  }).join('');
  return `<h2>${m.titre}</h2>
    <p class="muted">${m.artiste}, ${m.annee}</p>
    <p>${[m.style, 'Niveau ' + m.niveau, m.bpm + ' BPM', signature(m)].map(b => `<span class="badge">${b}</span>`).join('')}
      <span class="badge ${origine ? 'fid-origine' : 'fid-acc'}">${origine ? "Groove d'origine, simplifié" : "Groove d'accompagnement"}</span></p>
    <p>${m.desc}</p>
    ${CONSEIL(m.astuce)}
    <h3>Structure d'entraînement</h3>
    <ol>${structure}</ol>
    <p class="muted small">${origine
      ? "C'est le groove caractéristique du morceau, simplifié pour être jouable. Les variations et les fills sont à aller chercher à l'oreille."
      : "Ce n'est pas une transcription : c'est un groove qui colle au morceau et à son tempo, pour jouer par-dessus l'enregistrement."}
      La structure est une suite d'entraînement, pas la forme exacte du morceau.</p>
    <h3>Méthode</h3>
    <ol>
      <li>Choisis une section au-dessus de la partition : elle se joue seule, en boucle.</li>
      <li>Commence à tempo réduit, puis active le <b>tempo progressif</b> dans les réglages.</li>
      <li>Au tempo du disque, lance l'enregistrement original et joue par-dessus.</li>
    </ol>`;
}

function chargerMotif(motif, { sur = '', titre, aide = '' }){
  if (lecteur.enLecture) lecteur.arreter();
  motifCourant = motif;
  lecteur.charger(motif);

  const bpm = motif.bpm || [50, 90, 180];
  $('#bpm').min = bpm[0]; $('#bpm').max = bpm[2];
  lecteur.setTempo(bpm[1]);
  $('#ramp-max').value = Math.min(bpm[2], bpm[1] + 30);

  $('#j-sur').textContent = sur;
  $('#j-titre').textContent = titre || motif.nom;

  solosActifs.clear();
  setSolos([]);
  jugements = [];
  $('#practice-score').hidden = !modeJeu;
  if (modeJeu) $('#practice-score').textContent = 'Prêt : lance et joue !';

  majSections(motif);
  rendrePartition();
  majMixer();
  majOptionsClic();

  $('#aide-corps').innerHTML = aide;
  const lg = $('#legende');
  lg.innerHTML = '';
  lg.appendChild(legende(motif));
  kit.surligner(Object.keys(analyser(motif).pistes).filter(id => INSTRUMENTS[id]));
  const chk = $('#chk-faite');
  if (chk) chk.addEventListener('change', e => { P.marquer(elementCourant.item.id, e.target.checked); majStatutBoutons(); });
}

function quitterLecteur(){
  if (lecteur.enLecture){ lecteur.arreter(); majBoutonPlay(false); }
  elementCourant = null;
  document.title = 'Ma Batterie';
}

/* ================= partition ================= */
const VUES = ['staff', 'grid', 'kit'];
const NOMS_VUES = { staff:'Partition', grid:'Grille', kit:'Batterie' };
const ICONES_VUES = { staff:'#i-vue-partition', grid:'#i-vue-grille', kit:'#i-vue-kit' };
if (!VUES.includes(reglages.vue)) reglages.vue = 'staff';

function rendrePartition(){
  if (!motifCourant) return;
  $('#score-staff').hidden = reglages.vue !== 'staff';
  $('#score-grid').hidden = reglages.vue !== 'grid';
  $('#score-kit').hidden = reglages.vue !== 'kit';
  rendreLignes();

  // affichage « Batterie » : le kit vu de dessus ; toucher un élément le fait sonner
  vueKit = creerVueKit(motifCourant, async id => { await reprendreAudio(); jouer(id, 0, { velo:0.9 }); });
  const wKit = $('#score-kit');
  wKit.innerHTML = '';
  wKit.appendChild(vueKit.svg);

  const wGrid = $('#score-grid');
  wGrid.innerHTML = '';
  grille = dessinerGrille(motifCourant);
  wGrid.appendChild(grille);
  casesParStep = new Map();
  grille.querySelectorAll('td[data-step]').forEach(td => {
    const k = +td.dataset.step;
    if (!casesParStep.has(k)) casesParStep.set(k, []);
    casesParStep.get(k).push(td);
  });
  actifsGrille = [];
}

/* Découpe la partition en lignes de 1 à 4 mesures. On montre au moins deux lignes à
 * la fois (celle qu'on joue et la suivante, pour lire en avance), chacune avec autant
 * de mesures que la largeur le permet sans rapetisser les notes. */
function rendreLignes(){
  const box = $('#score-staff');
  box.innerHTML = '';
  vue.systemes = [];
  vue.ligne = -1; vue.dernierStep = -1; vue.actifs = [];
  if (!motifCourant || box.hidden) return;
  const a = analyser(motifCourant);
  const { largeurMesure, marge } = dimensions(motifCourant);
  const W = box.clientWidth - 20;
  const H = box.clientHeight - 8;
  if (W <= 0 || H <= 0) return;
  const ECART = 6;

  // hauteur réelle d'une ligne, sans le blanc autour de la portée (à l'échelle ech, le
  // comptage grossit pour rester lisible : la ligne est alors un peu plus haute)
  const hauteurLigne = ech => {
    const essai = dessinerPortee(tranche(motifCourant, 0, 1), { premiereMesure:0 });
    if (motifCourant.doigte) dessinerDoigte(essai, tranche(motifCourant, 0, 1));
    comptageLisible(essai.svg, ech);
    box.appendChild(essai.svg);
    const bb = essai.svg.getBBox();
    box.removeChild(essai.svg);
    return Math.ceil(bb.height) + 10 + (motifCourant.sections && motifCourant.sections.length && !(motifCourant.sections[0].debut === 0) ? 22 : 0);
  };
  const largeurDe = k => marge + k * largeurMesure;

  function disposer(hRef){
    // a) tout sur une seule ligne, si ça tient
    const mini = H / hRef > 2.2 ? 1.05 : 0.87;
    let n = 1, s = 1;
    for (let k = Math.min(4, a.bars); k >= 1; k--){
      const sk = Math.min(W / largeurDe(k), H / hRef);
      if (sk >= mini || k === 1){ n = k; s = sk; break; }
    }
    // b) sinon, plusieurs lignes visibles : la hauteur fixe la taille des notes, puis on
    //    met sur chaque ligne autant de mesures que la largeur en accepte à cette taille
    if (Math.ceil(a.bars / n) > 1){
      const nbLignes = Math.max(2, Math.min(4, Math.floor(H / (hRef * 1.05))));
      const sH = Math.min(1.7, (H - (nbLignes - 1) * ECART) / (nbLignes * hRef));
      let k = Math.min(4, a.bars);
      while (k > 1 && W / largeurDe(k) < sH * 0.92) k--;
      const s2 = Math.min(sH, W / largeurDe(k));
      if (s2 >= 0.58){ n = k; s = s2; }
    }
    if (n === 3 && a.bars % 3 && a.bars % 2 === 0 && a.bars > 3){ n = 2; s = Math.min(s, W / largeurDe(2)); }
    return { n, s:Math.min(s, 1.7) };
  }
  let { n, s } = disposer(hauteurLigne(1));
  // petite échelle : on remesure avec le comptage grossi, pour que les lignes tiennent
  if (s < 1) ({ n, s } = disposer(hauteurLigne(s * 0.97)));

  for (let b = 0; b < a.bars; b += n){
    const fin = Math.min(a.bars, b + n);
    const t = tranche(motifCourant, b, fin);
    const po = dessinerPortee(t, { premiereMesure:b, barreFinale:fin === a.bars });
    if (t.doigte) dessinerDoigte(po, t);
    comptageLisible(po.svg, s);
    po.svg.classList.add('systeme');
    const cadre = creerTete(po);
    cadre.style.width = (po.largeur * s).toFixed(1) + 'px';
    const ligne = document.createElement('div');
    ligne.className = 'systeme-ligne';
    ligne.appendChild(cadre);
    box.appendChild(ligne);
    rogner(po);
    vue.systemes.push({ po, el:ligne, debut:b * a.parMesure, fin:fin * a.parMesure });
  }
  box.classList.toggle('une-ligne', vue.systemes.length === 1);
  // de la place sous la dernière ligne, pour pouvoir l'amener en haut
  if (vue.systemes.length > 1){
    const fin = document.createElement('div');
    fin.className = 'fin-page';
    box.appendChild(fin);
  }
  allerLigne(Math.max(0, vue.systemes.findIndex(sy => lecteur.debutPlage < sy.fin)));
}

/* Sur un petit écran la portée est réduite : comptage et doigté grossissent
 * d'autant pour rester lisibles (≈ 11 px à l'écran). Les « e, et, a » entre les temps
 * disparaissent s'ils n'ont plus la place ; les numéros de temps restent toujours. */
function comptageLisible(svg, s){
  const pasDe = sel => {
    const l = [...svg.querySelectorAll(sel)].map(t => [+t.getAttribute('data-step'), +t.getAttribute('x')]).filter(([st]) => !isNaN(st));
    let p = Infinity;
    for (let i = 1; i < l.length; i++) if (l[i][0] > l[i - 1][0]) p = Math.min(p, (l[i][1] - l[i - 1][1]) / (l[i][0] - l[i - 1][0]));
    return p;
  };
  const pas = pasDe('.compte');
  const comptes = [...svg.querySelectorAll('.compte')];
  const fort = t => t.getAttribute('font-weight') === '700';
  const tailleDe = t => Math.max(+t.getAttribute('font-size'), (fort(t) ? 12 : 11) / s);
  // toutes les syllabes ou aucune : « 1 e et a », jamais « 1 e a »
  const place = comptes.every(t => fort(t) || tailleDe(t) * 0.62 * t.textContent.length <= pas * 0.92);
  for (const t of comptes){
    if (!fort(t) && !place){ t.setAttribute('display', 'none'); continue; }
    t.setAttribute('font-size', tailleDe(t).toFixed(1));
  }
  for (const t of svg.querySelectorAll('.num-mesure, .nolet')){
    const base = +t.getAttribute('font-size');
    if (base * s < 11) t.setAttribute('font-size', (11 / s).toFixed(1));
  }
  for (const t of svg.querySelectorAll('.doigte')){
    const base = parseFloat(getComputedStyle(t).fontSize) || 11.5;
    if (base * s < 11) t.style.fontSize = (11 / s).toFixed(1) + 'px';
  }
}

/* Recadre la portée sur son contenu : pas de grande marge blanche au-dessus ni dessous */
function rogner(po){
  const bb = po.svg.getBBox();
  if (!bb.height) return;
  const y0 = Math.floor(bb.y) - 5;
  const h = Math.ceil(bb.height) + 10;
  po.svg.setAttribute('viewBox', `0 ${y0} ${po.largeur} ${h}`);
  po.svg.setAttribute('height', h);
  po.rogne = y0; po.hVue = h;
}

function allerLigne(i){
  if (i < 0 || i === vue.ligne || !vue.systemes[i]) return;
  vue.ligne = i;
  vue.systemes.forEach((sy, k) => sy.el.classList.toggle('passee', k < i));
  // saut franc vers la ligne suivante, comme une page qu'on tourne
  const box = $('#score-staff');
  box.scrollTop = vue.systemes[i].el.offsetTop - 4;
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
    const w = po.cadre.clientWidth;       // taille de mise en page : juste même si l'appli est pivotée
    if (!w) return 0;
    po.echelle = w / po.largeur;
    // zone couverte par la tête, ramenée à la partie visible si la portée est recadrée
    const r = po.rogne || 0, hv = po.hVue || po.hauteur;
    const y0 = Math.max(po.tete.y0, r), y1 = Math.min(po.tete.y1, r + hv);
    po.teteEl.style.top = ((y0 - r) * po.echelle).toFixed(1) + 'px';
    po.teteEl.style.height = ((y1 - y0) * po.echelle).toFixed(1) + 'px';
  }
  return po.echelle;
}
function placerTete(po, step){
  const k = echelleDe(po);
  if (!k) return;
  po.teteEl.style.transform = `translate3d(${(po.xDe(step) * k - 1.5).toFixed(2)}px,0,0)`;
  po.teteEl.style.opacity = '1';
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

function majTeteLecture(pos){
  if (pos == null){
    for (const sy of vue.systemes) cacherTete(sy.po);
    for (const e of vue.actifs) e.classList.remove('actif');
    for (const e of actifsGrille) e.classList.remove('actif');
    vue.actifs = []; actifsGrille = [];
    vue.dernierStep = -1;
    if (vueKit) vueKit.effacer();
    return;
  }
  const step = Math.floor(pos);
  if (reglages.vue === 'staff' && vue.systemes.length){
    let i = vue.systemes.findIndex(sy => pos < sy.fin);
    if (i < 0) i = vue.systemes.length - 1;
    if (i !== vue.ligne){
      const avant = vue.systemes[vue.ligne];
      if (avant) cacherTete(avant.po);
      allerLigne(i);
    }
    const sy = vue.systemes[i];
    placerTete(sy.po, Math.min(pos - sy.debut, sy.fin - sy.debut - 0.001));
    if (step !== vue.dernierStep){
      for (const e of vue.actifs) e.classList.remove('actif');
      vue.actifs = sy.po.notesParStep.get(step - sy.debut) || [];
      for (const e of vue.actifs) e.classList.add('actif');
    }
  } else if (reglages.vue === 'kit'){
    if (vueKit) vueKit.maj(pos, lecteur.debutPlage, lecteur.finPlage);
  } else if (step !== vue.dernierStep){
    for (const e of actifsGrille) e.classList.remove('actif');
    actifsGrille = casesParStep.get(step) || [];
    for (const e of actifsGrille) e.classList.add('actif');
    const g = grille;
    const cel = actifsGrille[0];
    const lbl = 96;   // colonne des noms, fixe à gauche
    const box = $('#score-grid');
    if (g && cel && (cel.offsetLeft + cel.offsetWidth > box.scrollLeft + box.clientWidth || cel.offsetLeft < box.scrollLeft + lbl))
      box.scrollLeft = Math.max(0, cel.offsetLeft - lbl - 4);
  }
  vue.dernierStep = step;
}

function afficherDecompte(n){
  const o = $('#count-overlay');
  o.hidden = false;
  const span = o.querySelector('span');
  span.textContent = n;
  span.style.animation = 'none'; void span.offsetWidth; span.style.animation = '';
}
function masquerDecompte(){ $('#count-overlay').hidden = true; }

/* ---- sections d'un morceau : jouer / boucler une partie ---- */
function majSections(motif){
  const bar = $('#sections-bar');
  if (!motif.sections){ bar.hidden = true; bar.innerHTML = ''; return; }
  bar.hidden = false;
  const parMesure = (motif.beats ?? 4) * (motif.res ?? 4);
  const choix = [{ nom:'Tout', debut:0, fin:motif.bars, tout:true }, ...motif.sections];
  bar.innerHTML = choix.map((c, i) =>
    `<button type="button" class="chip${c.tout ? ' actif' : ''}" data-i="${i}" aria-pressed="${!!c.tout}">${c.nom}${c.fois > 1 ? `<em>×${c.fois}</em>` : ''}</button>`
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
    const i = vue.systemes.findIndex(sy => c.debut * parMesure < sy.fin);
    vue.ligne = -1;
    allerLigne(Math.max(0, i));
    if (relancer){ await lecteur.demarrer(); majBoutonPlay(true); startChrono(); }
  }));
}

/* ================= mixeur ================= */
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
      <button class="mix-mute" type="button" data-inst="${id}" aria-pressed="false" aria-label="Couper ${def.nom}">M</button>
      <button class="mix-solo" type="button" data-solo="${id}" aria-pressed="false" aria-label="Isoler ${def.nom}">S</button>
      <span class="mix-nom" style="border-color:${def.couleur}">${def.court}</span>
      <input type="range" min="0" max="1.4" step="0.05" value="${VOLUMES_DEFAUT[id]}" data-vol="${id}" aria-label="Volume ${def.nom}">`;
    mx.appendChild(row);
    setMute(id, false);
  }
  mx.querySelectorAll('[data-vol]').forEach(sl => {
    setVolume(sl.dataset.vol, parseFloat(sl.value));
    sl.addEventListener('input', () => setVolume(sl.dataset.vol, parseFloat(sl.value)));
  });
  mx.querySelectorAll('.mix-mute').forEach(b => b.addEventListener('click', () => {
    const on = b.classList.toggle('coupe');
    setMute(b.dataset.inst, on);
    b.setAttribute('aria-pressed', on);
  }));
  mx.querySelectorAll('.mix-solo').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.solo;
    solosActifs.has(id) ? solosActifs.delete(id) : solosActifs.add(id);
    b.classList.toggle('actif', solosActifs.has(id));
    b.setAttribute('aria-pressed', solosActifs.has(id));
    setSolos([...solosActifs]);
    mx.classList.toggle('en-solo', solosActifs.size > 0);
  }));
  mx.classList.remove('en-solo');
}

/* ================= transport ================= */
function majBoutonPlay(enCours){
  $('#play-ico').setAttribute('href', enCours ? '#i-stop' : '#i-play');
  $('#btn-play').setAttribute('aria-label', enCours ? 'Arrêter' : 'Lecture');
  $('#btn-play').classList.toggle('actif', enCours);
  garderEcranAllume(enCours);
}

async function basculerLecture(){
  if (!motifCourant) return;
  if (lecteur.enLecture){ lecteur.arreter(); majBoutonPlay(false); }
  else {
    // on repart du début de la ligne affichée si la lecture est à l'arrêt
    await lecteur.demarrer();
    majBoutonPlay(true);
    startChrono();
  }
}
$('#btn-play').addEventListener('click', basculerLecture);
// un toucher sur la partition lance ou arrête la lecture : pratique baguettes en main
$('#papier').addEventListener('click', basculerLecture);

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
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && lecteur.enLecture) garderEcranAllume(true);
});

function startChrono(){
  stopChrono(false);
  chronoLecture = setInterval(() => P.ajouterSecondes(5), 5000);
}
function stopChrono(maj = true){
  clearInterval(chronoLecture); chronoLecture = null;
  if (maj) majStat();
}

/* --- tempo --- */
const bornes = () => [+$('#bpm').min, +$('#bpm').max];
const tempoBorne = v => { const [a, b] = bornes(); return Math.max(a, Math.min(b, Math.round(v))); };
$('#bpm').addEventListener('input', e => lecteur.setTempo(+e.target.value));
$('#tempo-moins').addEventListener('click', () => lecteur.setTempo(tempoBorne(lecteur.bpm - 5)));
$('#tempo-plus').addEventListener('click', () => lecteur.setTempo(tempoBorne(lecteur.bpm + 5)));
$('#tempo-reset').addEventListener('click', () => { if (motifCourant) lecteur.setTempo((motifCourant.bpm || [0, 90])[1]); });
$('#btn-half').addEventListener('click', () => lecteur.setTempo(tempoBorne(lecteur.bpm * 0.5)));
$('#btn-double').addEventListener('click', () => lecteur.setTempo(tempoBorne(lecteur.bpm * 2)));
let taps = [];
$('#btn-tap').addEventListener('click', () => {
  const t = performance.now();
  taps = taps.filter(x => t - x < 2500);
  taps.push(t);
  if (taps.length >= 2){
    const ecarts = taps.slice(1).map((x, i) => x - taps[i]);
    lecteur.setTempo(60000 / (ecarts.reduce((a, b) => a + b, 0) / ecarts.length));
  }
});

/* --- métronome et batterie --- */
function majBascule(el, on){ el.classList.toggle('actif', on); el.setAttribute('aria-pressed', on); }
majBascule($('#opt-click'), reglages.clic);
$('#opt-click').addEventListener('click', () => {
  reglages.clic = lecteur.options.clic = !lecteur.options.clic;
  majBascule($('#opt-click'), reglages.clic);
  sauverReglages();
});
let batterieOn = true;
$('#opt-kit').addEventListener('click', () => {
  batterieOn = !batterieOn;
  setBatterie(batterieOn);
  majBascule($('#opt-kit'), batterieOn);
  // sans la batterie, il faut au moins le métronome pour jouer seul
  if (!batterieOn && !lecteur.options.clic) $('#opt-click').click();
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

/* --- options de lecture --- */
$('#opt-count').checked = reglages.decompte;
$('#opt-loop').checked = reglages.boucle;
$('#opt-count').addEventListener('change', e => { reglages.decompte = lecteur.options.decompte = e.target.checked; sauverReglages(); });
$('#opt-loop').addEventListener('change', e => { reglages.boucle = lecteur.options.boucle = e.target.checked; sauverReglages(); });
$('#opt-ramp').addEventListener('change', e => { $('#ramp-row').hidden = !e.target.checked; majRampe(); });
['#ramp-step', '#ramp-every', '#ramp-max'].forEach(s => $(s).addEventListener('change', majRampe));
function majRampe(){
  lecteur.options.rampe = $('#opt-ramp').checked ? {
    pas:+$('#ramp-step').value, chaque:+$('#ramp-every').value, max:+$('#ramp-max').value
  } : null;
}

/* --- partition ou grille --- */
function majVueBoutons(){
  $$('#view-toggle .seg-btn').forEach(b => {
    const on = b.dataset.score === reglages.vue;
    b.classList.toggle('actif', on);
    b.setAttribute('aria-pressed', on);
  });
  $('#opt-vue-ico').setAttribute('href', ICONES_VUES[reglages.vue]);
  $('#opt-vue-txt').textContent = NOMS_VUES[reglages.vue];
  $('#opt-vue').setAttribute('aria-label', 'Affichage : ' + NOMS_VUES[reglages.vue]);
}
function changerVue(v){
  reglages.vue = v;
  sauverReglages();
  majVueBoutons();
  majTeteLecture(null);
  rendrePartition();
}
majVueBoutons();
$$('#view-toggle .seg-btn').forEach(b => b.addEventListener('click', () => changerVue(b.dataset.score)));
$('#opt-vue').addEventListener('click', () => changerVue(VUES[(VUES.indexOf(reglages.vue) + 1) % VUES.length]));

/* --- impression --- */
function preparerImpression(){
  const box = $('#score-print');
  box.innerHTML = '';
  if (!motifCourant) return;
  $('#imp-titre').textContent = $('#j-titre').textContent;
  $('#imp-sous').textContent = $('#j-sur').textContent;
  const a = analyser(motifCourant);
  const parLigne = a.parMesure > 16 ? 2 : 4;
  for (let b = 0; b < a.bars; b += parLigne){
    const fin = Math.min(a.bars, b + parLigne);
    const t = tranche(motifCourant, b, fin);
    const po = dessinerPortee(t, { premiereMesure:b, barreFinale:fin === a.bars });
    if (t.doigte) dessinerDoigte(po, t);
    comptageLisible(po.svg, s);
    po.svg.classList.add('systeme');
    // largeur proportionnelle au nombre de mesures : la dernière ligne n'est pas étirée
    po.svg.style.width = (fin - b) / parLigne * 100 + '%';
    box.appendChild(po.svg);
  }
}
$('#btn-print').addEventListener('click', () => {
  if (lecteur.enLecture){ lecteur.arreter(); majBoutonPlay(false); }
  fermerVolets(false);
  preparerImpression();
  window.print();
});
window.addEventListener('beforeprint', preparerImpression);

/* ================= volets ================= */
let voletOuvert = null;
function ouvrirVolet(id, focus = true){
  fermerVolets(false);
  voletOuvert = $('#' + id);
  voletOuvert.hidden = false;
  $('#voile').hidden = false;
  voletOuvert.querySelector('.volet-corps').scrollTop = 0;
  if (focus) voletOuvert.querySelector('[data-fermer]').focus();
}
function fermerVolets(rendreFocus = true){
  if (!voletOuvert) return;
  const id = voletOuvert.id;
  voletOuvert.hidden = true;
  $('#voile').hidden = true;
  voletOuvert = null;
  if (rendreFocus) (id === 'volet-aide' ? $('#j-aide') : $('#j-reglages')).focus();
}
$('#j-aide').addEventListener('click', () => ouvrirVolet('volet-aide'));
$('#j-reglages').addEventListener('click', () => ouvrirVolet('volet-reglages'));
$('#voile').addEventListener('click', () => fermerVolets());
$$('[data-fermer]').forEach(b => b.addEventListener('click', () => fermerVolets()));

/* ================= mode jeu (clavier) ================= */
$('#btn-practice').addEventListener('change', e => {
  modeJeu = e.target.checked;
  jugements = [];
  $('#practice-score').hidden = !modeJeu;
  $('#practice-score').className = 'note-jeu';
  if (modeJeu) $('#practice-score').textContent = 'Prêt : lance et joue !';
});

function juger(inst, tempsJoue){
  if (!motifCourant || !lecteur.enLecture) return;
  const a = analyser(motifCourant);
  const piste = a.pistes[inst];
  if (!piste) return;
  const d0 = lecteur.debutPlage, d1 = lecteur.finPlage;
  const longueur = (d1 - d0) * lecteur.dureeStep;
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
  el.hidden = false;
  el.className = 'note-jeu ' + q[1];
  el.textContent = `${q[0]} ${ms > 0 ? '+' : ''}${ms} ms`;
}

function resumerJeu(){
  if (!jugements.length) return;
  const abs = jugements.map(Math.abs);
  const moy = Math.round(abs.reduce((a, b) => a + b, 0) / abs.length * 1000);
  const pct = Math.round(abs.filter(x => x < 0.07).length / abs.length * 100);
  const el = $('#practice-score');
  el.className = 'note-jeu ' + (pct > 80 ? 'ok' : pct > 50 ? 'moyen' : 'rate');
  el.textContent = `${pct} % en place · ±${moy} ms`;
  jugements = [];
}

/* ================= clavier ================= */
const enLecteur = () => !$('#ecran-jouer').hidden;
const enfoncees = new Set();
const INTERACTIF = 'button, a, summary, select, [role="button"], [role="tab"], [tabindex]';
window.addEventListener('keydown', async e => {
  if (e.key === 'Escape'){
    if (!$('#install-modal').hidden){ fermerInstallation(); return; }
    if (voletOuvert){ fermerVolets(); return; }
  }
  if (!enLecteur() || voletOuvert || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.target.matches('input, textarea, select')) return;
  if (e.key === 'Enter' && !e.target.closest(INTERACTIF)){ e.preventDefault(); basculerLecture(); return; }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight'){
    const lien = $(e.key === 'ArrowLeft' ? '#j-prec' : '#j-suiv');
    if (lien.getAttribute('aria-disabled') !== 'true') location.hash = lien.getAttribute('href');
    return;
  }
  if ((e.key === ' ' || e.key === 'Enter') && e.target.closest(INTERACTIF)) return;
  const k = e.key === ' ' ? ' ' : e.key.toLowerCase();
  const id = TOUCHES[k];
  if (!id) return;
  if (k === ' ') e.preventDefault();
  if (enfoncees.has(k)) return;
  enfoncees.add(k);
  const ctx = await reprendreAudio();
  jouer(id, 0, { velo: e.shiftKey ? 1 : 0.85 });
  kit.flash(id === 'CH_OPEN' ? 'CH' : id);
  if (modeJeu) juger(id === 'CH_OPEN' ? 'CH' : id, ctx.currentTime);
});
window.addEventListener('keyup', e => enfoncees.delete(e.key === ' ' ? ' ' : e.key.toLowerCase()));

/* ================= taille de l'écran ================= */
/* Titre trop long pour sa place : on réduit la police (jusqu'à un minimum lisible) plutôt
 * que de le couper. Réajusté quand le texte change et quand la barre change de taille. */
function titreAjuste(el, cadre, min, deuxLignes = false){
  const ajuster = () => {
    el.style.fontSize = '';
    el.classList.remove('deux-lignes');
    if (!el.clientWidth) return;
    let t = parseFloat(getComputedStyle(el).fontSize);
    while (el.scrollWidth > el.clientWidth + 1 && t > min){ t -= 1; el.style.fontSize = t + 'px'; }
    // toujours trop long à la taille minimale : sur deux lignes plutôt que coupé
    if (deuxLignes && el.scrollWidth > el.clientWidth + 1) el.classList.add('deux-lignes');
  };
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(ajuster).observe(cadre);
  new MutationObserver(ajuster).observe(el, { childList:true, characterData:true, subtree:true });
}
titreAjuste($('#j-titre'), $('#j-titre').closest('.barre-jeu'), 15, true);
titreAjuste($('#liste-titre'), $('#liste-titre').closest('.entete'), 18);
titreAjuste($('#liste-sur'), $('#liste-sur').closest('.entete'), 11);
for (const h of document.querySelectorAll('.carte-cat h2')) titreAjuste(h, h.closest('.carte-cat'), 18);

let minuterieTaille = null;
window.addEventListener('resize', () => {
  clearTimeout(minuterieTaille);
  minuterieTaille = setTimeout(() => {
    if (!enLecteur() || !motifCourant) return;
    const ligne = vue.ligne;
    rendreLignes();
    if (ligne >= 0 && ligne < vue.systemes.length){ vue.ligne = -1; allerLigne(ligne); }
  }, 160);
});

/* ================= plein écran horizontal (téléphone) =================
 * Aucun message : au premier toucher, l'appli passe en plein écran et se verrouille à
 * l'horizontale quand le navigateur le permet (Android). Sinon (iPhone), la feuille de style
 * fait pivoter l'appli d'un quart de tour tant que le téléphone est tenu droit. */
const enApp = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const tactile = matchMedia('(pointer:coarse)').matches;
async function pleinEcranPaysage(){
  try {
    if (!enApp && !document.fullscreenElement && document.documentElement.requestFullscreen)
      await document.documentElement.requestFullscreen({ navigationUI:'hide' });
    if (screen.orientation && screen.orientation.lock) await screen.orientation.lock('landscape');
  } catch { /* refusé ou non pris en charge : l'appli pivote d'elle-même (CSS) */ }
}
if (tactile){
  // appli installée : le verrouillage ne demande pas de geste
  if (enApp && screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => {});
  const auPremierToucher = e => {
    if (e.target.closest('#install-modal')) return;       // pas pendant la proposition d'installation
    document.removeEventListener('pointerup', auPremierToucher);
    pleinEcranPaysage();
  };
  document.addEventListener('pointerup', auPremierToucher);
}

document.addEventListener('pointerdown', () => initAudio(), { once:true });

/* Appli pivotée (téléphone tenu droit) : le navigateur fait défiler dans le sens de l'écran,
 * plus dans celui du contenu. On traduit donc nous-mêmes le glissé du doigt vers la zone qui
 * défile, avec l'élan à la fin du geste, comme un défilement normal. */
const pivotee = matchMedia('(orientation: portrait) and (pointer: coarse)');
function zoneDefilante(el, horizontal){
  for (let n = el; n && n.id !== 'appli'; n = n.parentElement){
    const st = getComputedStyle(n);
    const ok = horizontal
      ? /(auto|scroll)/.test(st.overflowX) && n.scrollWidth > n.clientWidth + 1
      : /(auto|scroll)/.test(st.overflowY) && n.scrollHeight > n.clientHeight + 1;
    if (ok) return n;
  }
  return null;
}
let glisse = null, elan = null, ignorerClic = 0;
document.addEventListener('touchstart', e => {
  cancelAnimationFrame(elan);
  glisse = null;
  if (!pivotee.matches || e.touches.length !== 1 || e.target.closest('input[type=range], select')) return;
  const t = e.touches[0];
  glisse = { x:t.clientX, y:t.clientY, temps:performance.now(), cible:e.target, zone:null, v:0 };
}, { passive:true });
document.addEventListener('touchmove', e => {
  if (!glisse) return;
  const t = e.touches[0];
  // rotation d'un quart de tour : x du contenu = y de l'écran, y du contenu = −x de l'écran
  const dx = t.clientY - glisse.y, dy = -(t.clientX - glisse.x);
  if (!glisse.zone){
    if (Math.hypot(dx, dy) < 8) return;
    glisse.horizontal = Math.abs(dx) >= Math.abs(dy);
    glisse.zone = zoneDefilante(glisse.cible, glisse.horizontal);
    if (!glisse.zone){ glisse = null; return; }
  }
  e.preventDefault();
  const d = glisse.horizontal ? dx : dy;
  if (glisse.horizontal) glisse.zone.scrollLeft -= d; else glisse.zone.scrollTop -= d;
  const maintenant = performance.now();
  glisse.v = glisse.v * 0.6 + (d / Math.max(1, maintenant - glisse.temps)) * 0.4;   // vitesse lissée (px/ms)
  glisse.x = t.clientX; glisse.y = t.clientY; glisse.temps = maintenant;
}, { passive:false });
document.addEventListener('touchend', () => {
  if (!glisse || !glisse.zone) { glisse = null; return; }
  ignorerClic = performance.now();              // un glissé n'est pas un toucher sur une carte
  const { zone, horizontal } = glisse;
  let v = glisse.v * 16;                         // px par image
  glisse = null;
  const pas = () => {
    if (Math.abs(v) < 0.4) return;
    if (horizontal) zone.scrollLeft -= v; else zone.scrollTop -= v;
    v *= 0.94;
    elan = requestAnimationFrame(pas);
  };
  elan = requestAnimationFrame(pas);
});
document.addEventListener('click', e => {
  if (performance.now() - ignorerClic < 350){ e.preventDefault(); e.stopPropagation(); }
}, true);

/* ================= installation sur le téléphone ================= */
const surIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
  || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
// seulement sur le site publié (le fichier ouvert en local ou la page hébergée n'ont pas de manifest)
const installable = !!document.querySelector('link[rel="manifest"]') && /^https?:$/.test(location.protocol);

if (installable && 'serviceWorker' in navigator){
  const avaitDejaUneVersion = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register('sw.js', { updateViaCache:'none' })
    .then(reg => {
      reg.update();                                   // chercher une nouvelle version à chaque ouverture
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') reg.update();   // …et au retour dans l'appli
      });
    })
    .catch(() => { /* hors ligne ou non pris en charge */ });
  // une nouvelle version vient de s'installer : on recharge une fois pour l'afficher
  let recharge = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!avaitDejaUneVersion || recharge || lecteur.enLecture) return;   // jamais en pleine lecture
    recharge = true;
    location.reload();
  });
}

/* Proposition d'installation : une fois, au premier démarrage ; ensuite, le bouton
 * « Installer » de l'accueil reste disponible. */
const CLE_INSTALLATION = 'ma-batterie-installation-proposee';
let demandeInstallation = null;

function majInstallation(){
  // Android / Chrome : un vrai bouton « Installer » ; iPhone : les étapes ; autres : le menu
  $('#install-oui').hidden = !demandeInstallation;
  $('#install-ios').hidden = !!demandeInstallation || !surIOS;
  $('#install-autre').hidden = !!demandeInstallation || surIOS;
  $('#install-non').textContent = demandeInstallation ? 'Plus tard' : 'Compris';
}
function proposerInstallation(){
  if (enApp || !installable) return;
  majInstallation();
  $('#install-modal').hidden = false;
  if (!tactile) ($('#install-oui').hidden ? $('#install-non') : $('#install-oui')).focus();
}
function fermerInstallation(){ $('#install-modal').hidden = true; }
function premiereProposition(){
  if (enApp || !installable || lire(CLE_INSTALLATION, false)) return;
  ecrire(CLE_INSTALLATION, true);
  proposerInstallation();
}

window.addEventListener('beforeinstallprompt', e => {      // Android, Chrome, Edge
  e.preventDefault();
  demandeInstallation = e;
  if (enApp) return;
  $('#btn-installer').hidden = false;
  if (!$('#install-modal').hidden) majInstallation();       // la fenêtre est ouverte : on passe au vrai bouton
  else premiereProposition();
});
window.addEventListener('appinstalled', () => { $('#btn-installer').hidden = true; fermerInstallation(); });
if (installable && !enApp){
  if (surIOS) $('#btn-installer').hidden = false;           // iPhone : on explique la marche à suivre
  // si le navigateur ne propose rien de lui-même, on explique quand même au premier démarrage
  setTimeout(premiereProposition, surIOS ? 1200 : 3000);
}

$('#btn-installer').addEventListener('click', proposerInstallation);
$('#install-oui').addEventListener('click', async () => {
  if (!demandeInstallation) return;
  demandeInstallation.prompt();
  const choix = await demandeInstallation.userChoice;
  demandeInstallation = null;
  fermerInstallation();
  if (choix && choix.outcome === 'accepted') $('#btn-installer').hidden = true;
});
$('#install-non').addEventListener('click', fermerInstallation);
$('#install-modal').addEventListener('click', e => { if (e.target.id === 'install-modal') fermerInstallation(); });

/* ================= démarrage ================= */
majRampe();
route();
