/* Progression sauvegardée dans le navigateur (localStorage). */
const CLE = 'ma-batterie-progres-v1';

const vide = () => ({ leconsFaites:{}, tempos:{}, minutes:{}, derniereLecon:null, total:0 });

export function charger(){
  try {
    const s = localStorage.getItem(CLE);
    return s ? { ...vide(), ...JSON.parse(s) } : vide();
  } catch { return vide(); }
}

let etat = charger();

function sauver(){
  try { localStorage.setItem(CLE, JSON.stringify(etat)); } catch { /* mode privé : on ignore */ }
}

export const jour = () => new Date().toISOString().slice(0, 10);

export function etatActuel(){ return etat; }
export function estFaite(id){ return !!etat.leconsFaites[id]; }
export function marquer(id, fait){
  if (fait) etat.leconsFaites[id] = jour(); else delete etat.leconsFaites[id];
  sauver();
}
export function nbFaites(){ return Object.keys(etat.leconsFaites).length; }
export function noterTempo(id, bpm){
  if (!etat.tempos[id] || bpm > etat.tempos[id]){ etat.tempos[id] = bpm; sauver(); }
}
export function meilleurTempo(id){ return etat.tempos[id] || 0; }
export function ajouterSecondes(s){
  const j = jour();
  etat.minutes[j] = (etat.minutes[j] || 0) + s / 60;
  etat.total = (etat.total || 0) + s / 60;
  sauver();
}
export function minutesAujourdhui(){ return Math.round(etat.minutes[jour()] || 0); }
export function minutesTotal(){ return Math.round(etat.total || 0); }
export function serie(){
  let n = 0;
  const d = new Date();
  for (;;){
    const k = d.toISOString().slice(0, 10);
    if ((etat.minutes[k] || 0) >= 1) n++;
    else if (n > 0 || k !== jour()) break;
    d.setDate(d.getDate() - 1);
    if (n > 400) break;
  }
  return n;
}
export function setDerniereLecon(id){ etat.derniereLecon = id; sauver(); }
export function historique(n = 14){
  const out = [];
  const d = new Date();
  for (let i = 0; i < n; i++){
    const k = d.toISOString().slice(0, 10);
    out.unshift({ jour:k, minutes: Math.round(etat.minutes[k] || 0) });
    d.setDate(d.getDate() - 1);
  }
  return out;
}
export function toutEffacer(){ etat = vide(); sauver(); }
