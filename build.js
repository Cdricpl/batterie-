/* Assemble l'application en un seul fichier HTML autonome.
 * Usage : node build.js                 ->  ma-batterie.html (à double-cliquer)
 *         node build.js --site          ->  site/ (à publier, installable sur téléphone)
 *         node build.js <fichier> --artefact  ->  variante pour une page hébergée
 */
const fs = require('fs');

const ORDRE = [
  'js/version.js', 'js/instruments.js', 'js/sons.js', 'js/audio.js', 'js/notation.js', 'js/illustrations.js', 'js/patterns.js',
  'js/rudiments.js', 'js/songs.js',
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

/* Détecte les noms déclarés deux fois : invisible en modules séparés,
 * mais fatal une fois tout réuni dans la même portée. */
function declarations(src){
  const noms = new Set();
  const re = /^(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/gm;
  let m;
  while ((m = re.exec(src))) noms.add(m[1]);
  return noms;
}
const vus = new Map();
const morceaux = ORDRE.map(f => {
  const src = f === 'js/app.js' ? SHIM_P + module(f) : module(f);
  for (const n of declarations(src)){
    if (vus.has(n)){
      console.error(`ERREUR : « ${n} » est déclaré dans ${vus.get(n)} et dans ${f}.`);
      console.error('Renomme l\'un des deux : dans le fichier unique, tout partage la même portée.');
      process.exit(1);
    }
    vus.set(n, f);
  }
  return src;
});
let js = morceaux.join('\n');

/* sw.js (racine) : son cache porte toujours le numéro de version courant */
const numeroVersion = fs.readFileSync('js/version.js', 'utf8').match(/VERSION = '([^']+)'/)[1];
const swSource = fs.readFileSync('sw.js', 'utf8');
const swAJour = swSource.replace(/const VERSION = '[^']*';/, `const VERSION = 'ma-batterie-${numeroVersion}';`);
if (swAJour !== swSource) fs.writeFileSync('sw.js', swAJour);
const css = fs.readFileSync('css/styles.css', 'utf8');

let html = fs.readFileSync('index.html', 'utf8');
/* remplacements par fonction : sinon les motifs $$ / $& du code seraient interprétés */
html = html.replace('<link rel="stylesheet" href="css/styles.css">', () => `<style>\n${css}\n</style>`);
html = html.replace('<script type="module" src="js/app.js"></script>', () => `<script type="module">\n${js}\n</script>`);
html = html.replace('<title>', '<!-- Fichier autonome généré par build.js : ne pas modifier à la main -->\n<title>');

const args = process.argv.slice(2);
const options = new Set(args.filter(a => a.startsWith('--')));
const chemins = args.filter(a => !a.startsWith('--'));

/* Variante « site » : dossier prêt à publier (Netlify, GitHub Pages…), installable
 * sur un téléphone : index.html + manifest + service worker (hors ligne) + icônes. */
if (options.has('--site')){
  const dossier = chemins[0] || 'site';
  fs.rmSync(dossier, { recursive:true, force:true });
  fs.mkdirSync(dossier + '/icons', { recursive:true });
  fs.writeFileSync(dossier + '/index.html', html.replace(/ data-pwa/g, ''));
  fs.copyFileSync('manifest.webmanifest', dossier + '/manifest.webmanifest');
  // le cache hors ligne porte le numéro de version : une nouvelle version = un nouveau cache
  fs.copyFileSync('sw.js', dossier + '/sw.js');
  for (const f of fs.readdirSync('icons')) fs.copyFileSync('icons/' + f, dossier + '/icons/' + f);
  console.log(`${dossier}/ écrit — site installable (${fs.readdirSync(dossier).join(', ')})`);
  process.exit(0);
}

/* Fichier seul : il n'y a ni manifest ni icônes à côté, on retire ces balises. */
html = html.replace(/^.*data-pwa.*\n/gm, '');

const sortie = chemins[0] || 'ma-batterie.html';

/* Variante « artefact » : la page est publiée dans un squelette existant,
 * on ne garde donc que le titre, les polices, le style et le contenu du body. */
if (options.has('--artefact')){
  const titre = html.match(/<title>[\s\S]*?<\/title>/)[0];
  const style = html.match(/<style>[\s\S]*?<\/style>/)[0];
  const corps = html.match(/<body>([\s\S]*)<\/body>/)[1];
  const polices = (html.match(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/) || [''])[0];
  html = `${titre}\n${polices}\n${style}\n${corps.trim()}\n`;
}

fs.writeFileSync(sortie, html);
console.log(sortie, 'écrit —', (html.length / 1024).toFixed(0), 'Ko');
