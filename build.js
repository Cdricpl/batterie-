/* Assemble l'application en un seul fichier HTML autonome.
 * Usage : node build.js   ->  ma-batterie.html
 */
const fs = require('fs');

const ORDRE = [
  'js/instruments.js', 'js/audio.js', 'js/notation.js', 'js/patterns.js',
  'js/lessons.js', 'js/kit.js', 'js/player.js', 'js/progress.js', 'js/app.js'
];

/* app.js fait « import * as P from './progress.js' » : on reconstruit l'objet. */
const SHIM_P = `
/* --- espace de noms de progress.js --- */
const P = { charger, etatActuel, estFaite, marquer, nbFaites, noterTempo, meilleurTempo,
  ajouterSecondes, minutesAujourdhui, minutesTotal, serie, setDerniereLecon,
  historique, toutEffacer, jour };
`;

function module(chemin){
  let src = fs.readFileSync(chemin, 'utf8');
  src = src.replace(/^import[^\n]*;\s*$/gm, '');   // les imports disparaissent
  src = src.replace(/^export\s+/gm, '');           // tout vit dans la même portée
  if (chemin === 'js/kit.js') src = src.replace(/\bNS\b/g, 'NS_KIT'); // évite la collision
  return `\n/* ================= ${chemin} ================= */\n` + src.trim() + '\n';
}

let js = ORDRE.map(f => f === 'js/app.js' ? SHIM_P + module(f) : module(f)).join('\n');
const css = fs.readFileSync('css/styles.css', 'utf8');

let html = fs.readFileSync('index.html', 'utf8');
/* remplacements par fonction : sinon les motifs $$ / $& du code seraient interprétés */
html = html.replace('<link rel="stylesheet" href="css/styles.css">', () => `<style>\n${css}\n</style>`);
html = html.replace('<script type="module" src="js/app.js"></script>', () => `<script type="module">\n${js}\n</script>`);
html = html.replace('<title>', '<!-- Fichier autonome généré par build.js : ne pas modifier à la main -->\n<title>');

const sortie = process.argv[2] || 'ma-batterie.html';

/* Variante « artefact » : la page est publiée dans un squelette existant,
 * on ne garde donc que le titre, le style et le contenu du body. */
if (process.argv.includes('--artefact')){
  const titre = html.match(/<title>[\s\S]*?<\/title>/)[0];
  const style = html.match(/<style>[\s\S]*?<\/style>/)[0];
  const corps = html.match(/<body>([\s\S]*)<\/body>/)[1];
  html = `${titre}\n${style}\n${corps.trim()}\n`;
}

fs.writeFileSync(sortie, html);
console.log(sortie, 'écrit —', (html.length / 1024).toFixed(0), 'Ko');
