/* Moteur audio : tous les sons sont synthétisés (aucun fichier à télécharger,
 * l'appli fonctionne donc hors ligne). */

let ctx = null;
let master = null;
let noiseBuf = null;
const gains = {};       // sortie par instrument
const vols  = {};       // volume choisi
const mutes = {};       // éléments coupés
let solos = new Set();  // si non vide, seuls ces éléments sont audibles

export const VOLUMES_DEFAUT = {
  CR: 0.55, CH: 0.7, RD: 0.6, T1: 0.85, T2: 0.85, CC: 0.9, TB: 0.85, GC: 1.0, HP: 0.6
};

export function ctxAudio(){ return ctx; }

export function initAudio(){
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0.9;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -12; comp.knee.value = 20; comp.ratio.value = 4;
  comp.attack.value = 0.003; comp.release.value = 0.2;
  master.connect(comp).connect(ctx.destination);

  for (const [id, v] of Object.entries(VOLUMES_DEFAUT)) {
    const g = ctx.createGain();
    g.gain.value = v;
    g.connect(master);
    gains[id] = g;
    vols[id] = v;
    mutes[id] = false;
  }
  // bruit blanc réutilisable
  const len = Math.floor(ctx.sampleRate * 2);
  noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return ctx;
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
    jouer(id, Math.max(0, when - 0.062), { velo: v * 0.32, ghost:true });
    jouer(id, Math.max(0, when - 0.031), { velo: v * 0.36, ghost:true });
  }
  if (opt.flam) {
    jouer(id, Math.max(0, when - 0.035), { velo: v * 0.45, ghost:true });
  }
}
