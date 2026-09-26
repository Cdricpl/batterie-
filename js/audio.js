/* Moteur audio.
 * Les sons sont de vrais enregistrements de batterie acoustique (Virtuosity Drums,
 * domaine public), intégrés à l'appli : elle fonctionne donc hors ligne. Plusieurs
 * forces de frappe et plusieurs prises par élément évitent l'effet « mitraillette »
 * d'une boîte à rythmes. Tant que les sons ne sont pas décodés (une fraction de
 * seconde au premier démarrage), un son de synthèse prend le relais. */
import { SONS } from './sons.js';

let ctx = null;
let master = null;
let busBatterie = null;    // tous les éléments passent par ici ; le métronome non
let noiseBuf = null;
const gains = {};       // sortie par instrument
const vols  = {};       // volume choisi
const mutes = {};       // éléments coupés
let solos = new Set();  // si non vide, seuls ces éléments sont audibles

export const VOLUMES_DEFAUT = {
  CR: 1, CH: 1, RD: 1, T1: 1, T2: 1, CC: 1, TB: 1, GC: 1, HP: 1
};
/* équilibre des sons de synthèse de secours (les enregistrements ont le leur) */
const EQUILIBRE_SYNTHESE = { CR: 0.55, CH: 0.7, CH_OPEN: 0.7, RD: 0.6, T1: 0.85, T2: 0.85, CC: 0.9, TB: 0.85, GC: 1.0, HP: 0.6 };

/* Place de chaque élément dans l'espace, vu du tabouret (comme sur la photo du kit) */
const PANORAMIQUE = { CH: -0.45, CH_OPEN: -0.45, HP: -0.45, CC: -0.2, CR: -0.3, T1: -0.08, T2: 0.12, TB: 0.4, RD: 0.5, GC: 0 };

export function ctxAudio(){ return ctx; }

export function initAudio(){
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 1;
  // compression légère (colle le kit, l'attaque passe grâce aux 5 ms), remontée du
  // niveau, puis limiteur : ça sonne fort sur un téléphone sans jamais saturer
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18; comp.knee.value = 10; comp.ratio.value = 3;
  comp.attack.value = 0.005; comp.release.value = 0.12;
  const remontee = ctx.createGain();
  remontee.gain.value = 1.6;
  const limiteur = ctx.createDynamicsCompressor();
  limiteur.threshold.value = -1.5; limiteur.knee.value = 0; limiteur.ratio.value = 20;
  limiteur.attack.value = 0.001; limiteur.release.value = 0.08;
  master.connect(comp).connect(remontee).connect(limiteur).connect(ctx.destination);
  busBatterie = ctx.createGain();
  busBatterie.gain.value = batterieAudible ? 1 : 0;
  busBatterie.connect(master);

  for (const [id, v] of Object.entries(VOLUMES_DEFAUT)) {
    const g = ctx.createGain();
    g.gain.value = v;
    g.connect(busBatterie);
    gains[id] = g;
    vols[id] = v;
    mutes[id] = false;
  }
  // bruit blanc réutilisable
  const len = Math.floor(ctx.sampleRate * 2);
  noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  chargerBanque();
  return ctx;
}

/* ================= banque de sons enregistrés ================= */
const banque = {};          // élément → { gain, couches: { couche: [{ buf, debut }] } }
let banquePrete = false;

export function sonsPrets(){ return banquePrete; }

function decoderMp3(b64){
  const bin = atob(b64);
  const octets = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) octets[i] = bin.charCodeAt(i);
  // forme à rappel en plus de la promesse : les anciens Safari ne connaissent que celle-là
  return new Promise((ok, ko) => {
    const p = ctx.decodeAudioData(octets.buffer, ok, ko);
    if (p && p.catch) p.catch(ko);
  });
}

/* Début réel de la frappe dans le son décodé. Selon le navigateur, le décodeur MP3
 * ajoute quelques millisecondes de silence au début : on le saute pour que la
 * frappe tombe exactement sur le temps. */
function debutFrappe(buf){
  const d = buf.getChannelData(0);
  let pic = 0;
  for (let i = 0; i < d.length; i++) { const a = Math.abs(d[i]); if (a > pic) pic = a; }
  const seuil = pic * 0.06;
  for (let i = 0; i < d.length; i++) if (Math.abs(d[i]) > seuil) return Math.max(0, i / buf.sampleRate - 0.0015);
  return 0;
}

async function chargerBanque(){
  try {
    const taches = [];
    for (const [inst, def] of Object.entries(SONS)){
      banque[inst] = { gain: def.gain, couches: {} };
      for (const s of def.sons){
        taches.push(decoderMp3(s.mp3).then(buf => {
          (banque[inst].couches[s.couche] ||= []).push({ buf, debut: debutFrappe(buf) });
        }));
      }
    }
    await Promise.all(taches);
    banquePrete = true;
  } catch (e) {
    banquePrete = false;           // décodage impossible : la synthèse reste utilisée
  }
}

/* Choix de la couche (force de frappe) selon l'élément et la dynamique de la note */
function couche(inst, v, opt){
  const fort = v >= 0.97, fantome = opt.ghost || v < 0.4;
  switch (inst){
    case 'GC':  return v >= 0.75 ? ['fort', v] : v >= 0.45 ? ['moyen', 1] : ['doux', 1];
    case 'CC':  return opt.flam ? ['flam', 1] : fantome ? ['ghost', 1] : fort ? ['fort', 1] : ['moyen', v / 0.85];
    // la couche « fort » du charleston est enregistrée beaucoup plus fort (+13 dB) :
    // on la ramène à un accent naturel, 2 à 4 dB au-dessus d'une frappe normale
    case 'CH':  return fantome ? ['ghost', 1] : fort ? ['fort', 0.3] : ['moyen', v / 0.85];
    case 'CHO': return fort ? ['fort', 0.25] : ['moyen', 1];
    case 'HP':  return ['fort', 1];
    case 'RD':  return v < 0.6 ? ['doux', 1] : ['moyen', fort ? 1.2 : 1];
    case 'CR':  return v < 0.6 ? ['moyen', 1] : ['fort', 1];
    default:    return fort ? ['fort', 1] : v < 0.5 ? ['doux', 1] : ['moyen', 1];   // toms
  }
}

const dernierePrise = {};    // pour ne jamais rejouer deux fois de suite la même prise
let charlestonOuvert = null; // son de charleston ouvert en cours, à étouffer

function jouerEnregistrement(id, when, v, opt){
  // le tom 2 n'existe pas dans la banque : c'est le tom 1, accordé un peu plus grave
  const inst = id === 'CH_OPEN' || (id === 'CH' && opt.open) ? 'CHO' : id === 'T2' ? 'T1' : id;
  const b = banque[inst];
  if (!b) return false;
  let [nom, facteur] = couche(inst, v, opt);
  const prises = b.couches[nom] || b.couches.moyen || Object.values(b.couches)[0];
  if (!prises || !prises.length) return false;

  let i = Math.floor(Math.random() * prises.length);
  const cle = inst + nom;
  if (prises.length > 1 && i === dernierePrise[cle]) i = (i + 1) % prises.length;
  dernierePrise[cle] = i;
  const prise = prises[i];

  const src = ctx.createBufferSource();
  src.buffer = prise.buf;
  // micro-variations de hauteur et de volume : deux coups ne sont jamais identiques
  src.playbackRate.value = (id === 'T2' ? 0.86 : 1) * (1 + (Math.random() - 0.5) * 0.012);
  const g = ctx.createGain();
  g.gain.value = b.gain * facteur * (1 + (Math.random() - 0.5) * 0.08);
  let fin = g;
  if (ctx.createStereoPanner){
    const pan = ctx.createStereoPanner();
    pan.pan.value = PANORAMIQUE[id] ?? 0;
    g.connect(pan);
    fin = pan;
  }
  src.connect(g);
  fin.connect(out(id === 'CH_OPEN' ? 'CH' : id));

  // charleston : un coup fermé ou au pied étouffe le charleston ouvert qui sonne encore
  if (inst === 'CH' || inst === 'HP' || inst === 'CHO'){
    if (charlestonOuvert && charlestonOuvert.debut < when){
      const o = charlestonOuvert;
      try {
        o.gain.gain.setTargetAtTime(0, when, 0.015);
        o.src.stop(when + 0.12);
      } catch { /* déjà terminé */ }
    }
    charlestonOuvert = inst === 'CHO' ? { src, gain: g, debut: when } : null;
  }

  src.start(when, prise.debut);
  return true;
}

export async function reprendreAudio(){
  // Safari iOS 16.4+ : sans ça, le son est coupé quand l'iPhone est en mode silencieux
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch { /* ancien navigateur */ }
  initAudio();
  if (ctx.state === 'suspended') await ctx.resume();
  return ctx;
}

function appliquer(id){
  if (!gains[id]) return;
  const etouffe = mutes[id] || (solos.size > 0 && !solos.has(id));
  gains[id].gain.value = etouffe ? 0 : (vols[id] ?? 0.8);
}
export function setVolume(id, v){ vols[id] = v; appliquer(id); }
export function setMute(id, m){ mutes[id] = m; appliquer(id); }
export function setSolos(ids){ solos = new Set(ids); for (const id of Object.keys(gains)) appliquer(id); }
export function estCoupe(id){ return !!mutes[id]; }
export function setMasterVolume(v){ if (master) master.gain.value = v; }
let batterieAudible = true;
/* Batterie coupée : la partition défile et le métronome joue, c'est toi qui joues */
export function setBatterie(oui){
  batterieAudible = oui;
  if (busBatterie) busBatterie.gain.setTargetAtTime(oui ? 1 : 0, ctx.currentTime, 0.01);
}

function noise(t, dur){
  const s = ctx.createBufferSource();
  s.buffer = noiseBuf;
  s.loop = true;
  s.playbackRate.value = 0.8 + Math.random() * 0.4;
  s.start(t);
  s.stop(t + dur + 0.05);
  return s;
}
function env(t, peak, attack, decay){
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  return g;
}
function out(id){ return gains[id] || master; }

/* ---------- sons ---------- */

function grosseCaisse(t, v){
  const o = ctx.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(160, t);
  o.frequency.exponentialRampToValueAtTime(46, t + 0.11);
  const g = env(t, 1.0 * v, 0.002, 0.32);
  o.connect(g).connect(out('GC'));
  o.start(t); o.stop(t + 0.45);
  // clic de batte
  const n = noise(t, 0.03);
  const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1800;
  const ng = env(t, 0.35 * v, 0.001, 0.03);
  n.connect(hp).connect(ng).connect(out('GC'));
}

function caisseClaire(t, v, opt = {}){
  const dur = opt.ghost ? 0.09 : 0.18;
  const n = noise(t, dur + 0.1);
  const bp = ctx.createBiquadFilter(); bp.type = 'highpass'; bp.frequency.value = 1400;
  const ng = env(t, 0.75 * v, 0.001, dur);
  n.connect(bp).connect(ng).connect(out('CC'));

  [190, 278].forEach((f, i) => {
    const o = ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.setValueAtTime(f, t);
    o.frequency.exponentialRampToValueAtTime(f * 0.75, t + 0.09);
    const g = env(t, (i ? 0.22 : 0.35) * v, 0.001, dur * 0.8);
    o.connect(g).connect(out('CC'));
    o.start(t); o.stop(t + dur + 0.1);
  });
}

function charleston(t, v, opt = {}){
  const dur = opt.open ? 0.42 : (opt.pedal ? 0.09 : 0.055);
  const id = opt.pedal ? 'HP' : 'CH';
  const n = noise(t, dur + 0.1);
  const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 7200;
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 9500; bp.Q.value = 0.7;
  const g = env(t, 0.5 * v, 0.001, dur);
  n.connect(hp).connect(bp).connect(g).connect(out(id));
  if (opt.pedal){
    const o = ctx.createOscillator(); o.type='sine';
    o.frequency.setValueAtTime(180, t); o.frequency.exponentialRampToValueAtTime(70, t+0.06);
    const og = env(t, 0.25*v, 0.001, 0.07);
    o.connect(og).connect(out('HP')); o.start(t); o.stop(t+0.15);
  }
}

function tom(t, v, from, to, dur, id){
  const o = ctx.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(from, t);
  o.frequency.exponentialRampToValueAtTime(to, t + dur * 0.9);
  const g = env(t, 0.9 * v, 0.002, dur);
  o.connect(g).connect(out(id));
  o.start(t); o.stop(t + dur + 0.1);

  const o2 = ctx.createOscillator();
  o2.type = 'triangle';
  o2.frequency.setValueAtTime(from * 1.5, t);
  o2.frequency.exponentialRampToValueAtTime(to * 1.4, t + dur * 0.5);
  const g2 = env(t, 0.18 * v, 0.002, dur * 0.5);
  o2.connect(g2).connect(out(id));
  o2.start(t); o2.stop(t + dur + 0.1);

  const n = noise(t, 0.04);
  const hp = ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=1200;
  const ng = env(t, 0.18*v, 0.001, 0.04);
  n.connect(hp).connect(ng).connect(out(id));
}

function cymbale(t, v, id){
  const long = id === 'CR' ? 2.2 : 1.1;
  const n = noise(t, long + 0.2);
  const hp = ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value = id === 'CR' ? 3800 : 5200;
  const g = env(t, (id === 'CR' ? 0.5 : 0.3) * v, id === 'CR' ? 0.01 : 0.002, long);
  n.connect(hp).connect(g).connect(out(id));
  if (id === 'RD'){ // le "ping" de la ride
    const o = ctx.createOscillator(); o.type='triangle'; o.frequency.value = 820;
    const og = env(t, 0.3*v, 0.001, 0.35);
    o.connect(og).connect(out('RD')); o.start(t); o.stop(t+0.5);
  }
}

/* niveau : 2 = premier temps, 1 = temps, 0 = subdivision */
export function clic(t, niveau = 1){
  if (!ctx) return;
  const n = niveau === true ? 2 : niveau === false ? 1 : niveau;
  const o = ctx.createOscillator();
  o.type = 'square';
  o.frequency.value = n >= 2 ? 1600 : n === 1 ? 1050 : 760;
  const g = env(t, n >= 2 ? 0.28 : n === 1 ? 0.16 : 0.07, 0.001, 0.035);
  o.connect(g).connect(master);
  o.start(t); o.stop(t + 0.09);
}

/* Joue un élément à l'instant t (horloge audio). */
export function jouer(id, t = 0, opt = {}){
  if (!ctx) return;
  const when = t || ctx.currentTime;
  const v = opt.velo ?? 0.85;

  if (banquePrete){
    // flam sur la caisse claire : la banque contient de vrais flams enregistrés
    const flamEnregistre = opt.flam && id === 'CC';
    if (!flamEnregistre){
      if (opt.drag){
        jouerEnregistrement(id, Math.max(0, when - 0.062), 0.3, { ghost:true });
        jouerEnregistrement(id, Math.max(0, when - 0.031), 0.34, { ghost:true });
      }
      if (opt.flam) jouerEnregistrement(id, Math.max(0, when - 0.03), 0.35, { ghost:true });
    }
    if (jouerEnregistrement(id, when, v, { ...opt, flam: flamEnregistre })) return;
  }
  jouerSynthese(id, when, v * (EQUILIBRE_SYNTHESE[id] ?? 1), opt);
}

/* Sons de synthèse : secours tant que la banque n'est pas prête */
function jouerSynthese(id, when, v, opt){
  switch (id){
    case 'GC': grosseCaisse(when, v); break;
    case 'CC': caisseClaire(when, v, opt); break;
    case 'CH': charleston(when, v, opt); break;
    case 'CH_OPEN': charleston(when, v, {open:true}); break;
    case 'HP': charleston(when, v, {pedal:true}); break;
    case 'T1': tom(when, v, 300, 150, 0.34, 'T1'); break;
    case 'T2': tom(when, v, 230, 115, 0.40, 'T2'); break;
    case 'TB': tom(when, v, 155, 78, 0.55, 'TB'); break;
    case 'CR': cymbale(when, v, 'CR'); break;
    case 'RD': cymbale(when, v, 'RD'); break;
  }
  // notes d'agrément, sur le même élément, jouées juste avant la note principale
  if (opt.drag) {
    jouerSynthese(id, Math.max(0, when - 0.062), v * 0.32, { ghost:true });
    jouerSynthese(id, Math.max(0, when - 0.031), v * 0.36, { ghost:true });
  }
  if (opt.flam) {
    jouerSynthese(id, Math.max(0, when - 0.035), v * 0.45, { ghost:true });
  }
}
