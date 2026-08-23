/* Définition des éléments de la batterie.
 * pos = position sur la portée (0 = ligne du bas, +1 = un demi-interligne vers le haut)
 *       ligne1=0, interligne1=1, ligne2=2, interligne2=3, ligne3=4, interligne3=5,
 *       ligne4=6, interligne4=7, ligne5=8, au-dessus=9, ligne suppl.=10
 * head = forme de la tête de note : 'normal' (ovale plein) ou 'x' (croix)
 * voice = 'up' (hampes en haut : mains) ou 'down' (hampes en bas : pieds)
 */
export const INSTRUMENTS = {
  CR: { id:'CR', nom:'Crash',              court:'Crash', pos:10, head:'x', voice:'up',   couleur:'#f2b134', touche:'e' },
  CH: { id:'CH', nom:'Charleston',         court:'Charley', pos:9, head:'x', voice:'up',  couleur:'#ffd166', touche:'d' },
  RD: { id:'RD', nom:'Ride',               court:'Ride',  pos:8,  head:'x', voice:'up',   couleur:'#e8a33d', touche:'r' },
  T1: { id:'T1', nom:'Tom 1 (alto)',       court:'Tom 1', pos:7,  head:'normal', voice:'up', couleur:'#8ecae6', touche:'i' },
  T2: { id:'T2', nom:'Tom 2 (médium)',     court:'Tom 2', pos:6,  head:'normal', voice:'up', couleur:'#6fb3d2', touche:'o' },
  CC: { id:'CC', nom:'Caisse claire',      court:'Claire', pos:5, head:'normal', voice:'up', couleur:'#ef476f', touche:'f' },
  TB: { id:'TB', nom:'Tom basse',          court:'Tom basse', pos:3, head:'normal', voice:'up', couleur:'#4f8fb0', touche:'p' },
  GC: { id:'GC', nom:'Grosse caisse',      court:'Grosse c.', pos:1, head:'normal', voice:'down', couleur:'#06d6a0', touche:' ' },
  HP: { id:'HP', nom:'Charleston au pied', court:'Charley pied', pos:-2, head:'x', voice:'down', couleur:'#b8b8ff', touche:'a' }
};

/* Ordre d'affichage (grille, mixer) du plus aigu au plus grave */
export const ORDRE = ['CR','CH','RD','T1','T2','CC','TB','GC','HP'];

/* Signes utilisés dans les motifs :
 *  x = frappe normale   X = frappe accentuée   g = ghost note (très faible)
 *  o = charleston ouvert  f = flam   - = silence
 */
export const SIGNES = {
  'x': { velo:0.85, label:'frappe' },
  'X': { velo:1.0,  label:'accent', accent:true },
  'g': { velo:0.28, label:'ghost note', ghost:true },
  'o': { velo:0.9,  label:'ouvert', open:true },
  'f': { velo:0.9,  label:'flam', flam:true }
};

export function estNote(c){ return c && c !== '-' && c !== '.' && c !== ' '; }

/* Correspondance touche clavier -> instrument */
export const TOUCHES = (() => {
  const m = {};
  for (const i of Object.values(INSTRUMENTS)) m[i.touche] = i.id;
  m['j'] = 'CC'; m['k'] = 'CH'; m['s'] = 'CH_OPEN';
  return m;
})();
