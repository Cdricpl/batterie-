/* Lecteur : planification audio précise (lookahead) + tête de lecture fluide. */
import { reprendreAudio, ctxAudio, jouer, clic } from './audio.js';
import { analyser } from './notation.js';
import { SIGNES, estNote } from './instruments.js';

const LOOKAHEAD = 0.12;   // secondes planifiées à l'avance
const TICK = 25;          // ms entre deux réveils du planificateur

export class Lecteur {
  constructor(cb = {}){
    this.cb = cb;                 // {onPos, onFrappe, onBoucle, onFin, onCompte, onTempo}
    this.motif = null;
    this.bpm = 80;
    this.enLecture = false;
    this.options = { boucle:true, decompte:true, clic:false, clicSub:1, rampe:null };
    this.file = [];
    this.boucles = 0;
    this.debutBoucle = 0;
    this.timer = null;
    this.raf = null;
  }

  charger(motif){
    this.motif = motif;
    this.plage = null;              // {debut, fin} en pas : boucler une partie seulement
    this.a = analyser(motif);
    this.total = this.a.total;
    this.frappesParStep = [];
    for (let s = 0; s < this.total; s++){
      const l = [];
      for (const [id, str] of Object.entries(this.a.pistes)){
        const c = str[s];
        if (estNote(c)) l.push({ inst:id, signe:c });
      }
      this.frappesParStep.push(l);
    }
  }

  get debutPlage(){ return this.plage ? this.plage.debut : 0; }
  get finPlage(){ return this.plage ? this.plage.fin : this.total; }

  /* Limite la lecture (et la boucle) à [debut, fin[ — ex. une section d'un morceau */
  setPlage(debut, fin){
    this.plage = (debut == null) ? null
      : { debut:Math.max(0, debut), fin:Math.min(this.total, fin) };
  }

  get dureeStep(){ return 60 / this.bpm / this.a.res; }
  get dureeTemps(){ return 60 / this.bpm; }

  setTempo(bpm){
    this.bpm = Math.max(30, Math.min(260, Math.round(bpm)));
    this.cb.onTempo && this.cb.onTempo(this.bpm);
  }

  async basculer(){ this.enLecture ? this.arreter() : await this.demarrer(); }

  async demarrer(){
    if (!this.motif || this.enLecture) return;
    const ctx = await reprendreAudio();
    this.enLecture = true;
    this.boucles = 0;
    this.step = this.debutPlage;
    this.file = [];
    this._dernier = null;
    this.compteRestant = this.options.decompte ? (this.motif.beats ?? 4) : 0;
    this.prochain = ctx.currentTime + 0.12;
    this.debutBoucle = this.prochain + this.compteRestant * this.dureeTemps;
    this.timer = setInterval(() => this._planifier(), TICK);
    this._planifier();
    this._suivre();
  }

  arreter(){
    this.enLecture = false;
    clearInterval(this.timer); this.timer = null;
    cancelAnimationFrame(this.raf); this.raf = null;
    this.file = [];
    this.cb.onPos && this.cb.onPos(null);
    this.cb.onFin && this.cb.onFin();
  }

  _planifier(){
    const ctx = ctxAudio();
    if (!ctx || !this.enLecture) return;
    const limite = ctx.currentTime + LOOKAHEAD;

    while (this.prochain < limite){
      if (this.compteRestant > 0){
        const n = (this.motif.beats ?? 4) - this.compteRestant + 1;
        clic(this.prochain, n === 1 ? 2 : 1);
        this.file.push({ compte:n, temps:this.prochain });
        this.prochain += this.dureeTemps;
        this.compteRestant--;
        if (this.compteRestant === 0) this.debutBoucle = this.prochain;
        continue;
      }

      const s = this.step;
      if (s === this.debutPlage) this.debutBoucle = this.prochain;

      for (const f of this.frappesParStep[s]){
        const sg = SIGNES[f.signe] || SIGNES.x;
        const id = (f.inst === 'CH' && sg.open) ? 'CH_OPEN' : f.inst;
        jouer(id, this.prochain, { velo:sg.velo, ghost:sg.ghost, open:sg.open, flam:sg.flam, drag:sg.drag });
      }
      if (this.options.clic){
        const sub = this.options.clicSub || 1;
        const pas = Number.isInteger(this.a.res / sub) ? this.a.res / sub : this.a.res;
        if (s % pas === 0){
          const niveau = (s % this.a.parMesure) === 0 ? 2 : (s % this.a.res) === 0 ? 1 : 0;
          clic(this.prochain, niveau);
        }
      }
      this.file.push({ step:s, temps:this.prochain, notes:this.frappesParStep[s], duree:this.dureeStep });

      this.prochain += this.dureeStep;
      this.step++;

      if (this.step >= this.finPlage){
        this.step = this.debutPlage;
        this.boucles++;
        const r = this.options.rampe;
        if (r && this.boucles % r.chaque === 0 && this.bpm < r.max){
          this.setTempo(Math.min(r.max, this.bpm + r.pas));
        }
        if (!this.options.boucle){
          this.file.push({ fin:true, temps:this.prochain });
          clearInterval(this.timer); this.timer = null;
          return;
        }
      }
    }
  }

  _suivre(){
    const boucle = () => {
      const ctx = ctxAudio();
      if (!ctx || !this.enLecture) return;
      const now = ctx.currentTime;
      let courant = null;
      while (this.file.length && this.file[0].temps <= now){
        courant = this.file.shift();
        if (courant.fin){ this.arreter(); return; }
        if (courant.compte){ this.cb.onCompte && this.cb.onCompte(courant.compte); }
        else {
          if (courant.step === this.debutPlage) this.cb.onBoucle && this.cb.onBoucle(this.boucles);
          this.cb.onFrappe && this.cb.onFrappe(courant.notes, courant.step);
          this._dernier = courant;
        }
      }
      if (this._dernier){
        const pos = this._dernier.step + (now - this._dernier.temps) / this._dernier.duree;
        this.cb.onPos && this.cb.onPos(Math.min(pos, this.finPlage));
      }
      this.raf = requestAnimationFrame(boucle);
    };
    this.raf = requestAnimationFrame(boucle);
  }

  /* Instant théorique (horloge audio) du pas s dans la boucle en cours */
  tempsDuStep(s){ return this.debutBoucle + (s - this.debutPlage) * this.dureeStep; }
}
