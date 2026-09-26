/* Morceaux connus.
 *
 * Chaque morceau est une suite de sections (intro, couplet, refrain, break…)
 * répétées un certain nombre de fois. Le tempo est celui de l'enregistrement
 * d'origine (vérifié sur les bases de tempo publiques).
 *
 * Deux niveaux de fidélité, affichés dans l'appli pour rester honnête :
 *  - 'origine'        : le groove caractéristique du morceau, simplifié
 *  - 'accompagnement' : un groove qui colle au morceau et à son tempo,
 *                       à jouer par-dessus l'enregistrement (pas une transcription)
 *
 * La structure (nombre de répétitions) est une suite d'entraînement,
 * pas la forme exacte du morceau.
 */

const SILENCE = (n) => '-'.repeat(n);

export const MORCEAUX = [
/* ---------------------------- Niveau 1-2 ---------------------------- */
{
  id:'m-we-will-rock-you', titre:'We Will Rock You', artiste:'Queen', annee:1977,
  niveau:1, style:'Rock', bpm:81, beats:4, res:2, fidelite:'origine',
  desc:"Le motif « pied-pied-main » du stade. Sur le disque ce sont des pas et des claps : à la batterie, grosse caisse et caisse claire.",
  astuce:"Laisse bien sonner le silence de la fin de mesure : il fait partie du rythme.",
  sections:[
    { nom:'Motif', fois:8, tracks:{ GC:'x-x-----', CC:'----X---' } },
    { nom:'Final (crash)', fois:2, tracks:{ GC:'x-x-----', CC:'----X---', CR:'----x---' } }
  ]
},
{
  id:'m-seven-nation-army', titre:'Seven Nation Army', artiste:'The White Stripes', annee:2003,
  niveau:1, style:'Rock', bpm:124, beats:4, res:2, fidelite:'origine',
  desc:"Un couplet porté presque uniquement par la grosse caisse sur les 4 temps, puis un refrain qui explose.",
  astuce:"Au couplet, le pied doit être régulier comme une horloge : c'est tout ce qu'on entend.",
  sections:[
    { nom:'Couplet', fois:8, tracks:{ GC:'x-x-x-x-' } },
    { nom:'Montée', fois:2, tracks:{ GC:'x-x-x-x-', CC:'--x---x-' } },
    { nom:'Refrain', fois:4, tracks:{ CR:'x---x---', CC:'--x---x-', GC:'x-x-x-x-' } }
  ]
},
{
  id:'m-alors-on-danse', titre:'Alors on danse', artiste:'Stromae', annee:2010,
  niveau:1, style:'Électro', bpm:120, beats:4, res:2, fidelite:'accompagnement',
  desc:"Le « four on the floor » de l'électro : grosse caisse sur chaque temps, charleston entre les temps.",
  astuce:"Le charleston tombe pile entre deux coups de pied : écoute le balancier « boum-tss-boum-tss ».",
  sections:[
    { nom:'Couplet', fois:8, tracks:{ GC:'x-x-x-x-', CC:'--x---x-', CH:'-x-x-x-x' } },
    { nom:'Refrain', fois:8, tracks:{ GC:'x-x-x-x-', CC:'--x---x-', CH:'-o-o-o-o' } }
  ]
},
{
  id:'m-billie-jean', titre:'Billie Jean', artiste:'Michael Jackson', annee:1982,
  niveau:2, style:'Pop', bpm:117, beats:4, res:4, fidelite:'origine',
  desc:"Le groove le plus régulier de la pop : le même motif du début à la fin, joué avec une précision de boîte à rythmes.",
  astuce:"Rien ne change pendant 5 minutes : tout est dans la régularité et l'égalité des frappes.",
  sections:[
    { nom:'Intro', fois:4, tracks:{ CH:'x-x-x-x-x-x-x-x-', GC:'x-------x-------' } },
    { nom:'Groove', fois:8, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----x-------x---', GC:'x-------x-------' } }
  ]
},
{
  id:'m-back-in-black', titre:'Back in Black', artiste:'AC/DC', annee:1980,
  niveau:2, style:'Hard rock', bpm:94, beats:4, res:2, fidelite:'origine',
  desc:"Le morceau démarre sur le charleston seul, puis le groove rock le plus solide qui soit, avec des arrêts à compter.",
  astuce:"Pendant l'arrêt, continue de compter dans ta tête : la reprise doit tomber pile sur le 1.",
  sections:[
    { nom:'Intro charleston', fois:2, tracks:{ CH:'xxxxxxxx' } },
    { nom:'Couplet', fois:4, tracks:{ CH:'xxxxxxxx', CC:'--x---x-', GC:'x---x---' } },
    { nom:'Arrêt', fois:1, tracks:{ CR:'x-------', GC:'x-------' } },
    { nom:'Refrain', fois:4, bars:2, tracks:{
        CR:'x-------'+SILENCE(8), CH:'-xxxxxxx'+'xxxxxxxx', CC:'--x---x-'+'--x---x-', GC:'x---x---'+'x---x-x-' } }
  ]
},
{
  id:'m-another-one', titre:'Another One Bites the Dust', artiste:'Queen', annee:1980,
  niveau:2, style:'Funk rock', bpm:112, beats:4, res:2, fidelite:'origine',
  desc:"Grosse caisse sur les 4 temps, caisse claire sur 2 et 4, et le charleston qui s'ouvre à la fin de la mesure.",
  astuce:"Le charleston ouvert se referme exactement sur le 1 suivant, avec le pied.",
  sections:[
    { nom:'Groove', fois:8, tracks:{ GC:'x-x-x-x-', CC:'--x---x-', CH:'xxxxxxxo' } },
    { nom:'Break', fois:1, tracks:{ CC:'x-x-x-xx', GC:'x-------' } }
  ]
},
{
  id:'m-highway-to-hell', titre:'Highway to Hell', artiste:'AC/DC', annee:1979,
  niveau:2, style:'Hard rock', bpm:116, beats:4, res:2, fidelite:'accompagnement',
  desc:"Rock direct : charleston en croches au couplet, crash au refrain. Idéal pour travailler l'endurance.",
  astuce:"Au refrain, frappe la crash avec la grosse caisse sur le 1 de chaque groupe de 2 mesures.",
  sections:[
    { nom:'Couplet', fois:4, tracks:{ CH:'xxxxxxxx', CC:'--x---x-', GC:'x---x---' } },
    { nom:'Refrain', fois:4, bars:2, tracks:{
        CR:'x-------'+SILENCE(8), CH:'-xxxxxxx'+'xxxxxxxx', CC:'--x---x-'+'--x---x-', GC:'x---x---'+'x---x---' } }
  ]
},
{
  id:'m-smoke-water', titre:'Smoke on the Water', artiste:'Deep Purple', annee:1972,
  niveau:2, style:'Hard rock', bpm:114, beats:4, res:2, fidelite:'accompagnement',
  desc:"La batterie entre au charleston seul pendant le riff, puis la caisse claire, puis tout le kit.",
  astuce:"Entrer progressivement est un classique : chaque élément ajouté doit s'intégrer sans changer le tempo.",
  sections:[
    { nom:'Entrée charleston', fois:4, tracks:{ CH:'xxxxxxxx' } },
    { nom:'+ caisse claire', fois:4, tracks:{ CH:'xxxxxxxx', CC:'--x---x-' } },
    { nom:'Groove complet', fois:8, tracks:{ CH:'xxxxxxxx', CC:'--x---x-', GC:'x---x-x-' } }
  ]
},
{
  id:'m-get-lucky', titre:'Get Lucky', artiste:'Daft Punk', annee:2013,
  niveau:2, style:'Disco', bpm:116, beats:4, res:4, fidelite:'accompagnement',
  desc:"Disco moderne : grosse caisse sur chaque temps et charleston qui s'ouvre sur les contretemps.",
  astuce:"Le son « tsss » ouvert donne tout le rebond. Garde les ouvertures courtes.",
  sections:[
    { nom:'Couplet', fois:8, tracks:{ GC:'x---x---x---x---', CC:'----x-------x---', CH:'x-o-x-o-x-o-x-o-' } },
    { nom:'Refrain', fois:8, tracks:{ GC:'x---x---x---x---', CC:'----x-------x---', CH:'xxoxxxoxxxoxxxox' } }
  ]
},
{
  id:'m-livin-prayer', titre:"Livin' on a Prayer", artiste:'Bon Jovi', annee:1986,
  niveau:2, style:'Rock', bpm:123, beats:4, res:2, fidelite:'accompagnement',
  desc:"Rock des années 80 : couplet retenu, refrain grand ouvert avec la crash.",
  astuce:"La différence couplet/refrain vient du volume et des cymbales, pas du tempo.",
  sections:[
    { nom:'Couplet', fois:4, tracks:{ CH:'xxxxxxxx', CC:'--x---x-', GC:'x---x-x-' } },
    { nom:'Refrain', fois:4, bars:2, tracks:{
        CR:'x-------'+SILENCE(8), CH:'-oxoxoxo'+'xoxoxoxo', CC:'--X---X-'+'--X---X-', GC:'x---x-x-'+'x---x-x-' } }
  ]
},

/* ---------------------------- Niveau 3 ---------------------------- */
{
  id:'m-teen-spirit', titre:'Smells Like Teen Spirit', artiste:'Nirvana', annee:1991,
  niveau:3, style:'Grunge', bpm:117, beats:4, res:4, fidelite:'origine',
  desc:"L'intro en flams sur la caisse claire avec la grosse caisse entre les temps, un couplet « boum-boum-tchak », un refrain déchaîné.",
  astuce:"Dans l'intro, la grosse caisse joue sur les « e » et les « a » : entre les flams. Commence à 70 BPM.",
  sections:[
    { nom:'Intro', fois:1, tracks:{ CH:'--o---o---o-----', CC:'f---f---f---f---', GC:'-x-x-x-x-x-x--x-' } },
    { nom:'Couplet', fois:4, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----x-------x---', GC:'x-x-----x-x-----' } },
    { nom:'Refrain', fois:4, tracks:{ CR:'x---------------', CH:'--o-o-o-o-o-o-o-', CC:'----X-------X---', GC:'x-x-----x-x-----' } }
  ]
},
{
  id:'m-zombie', titre:'Zombie', artiste:'The Cranberries', annee:1994,
  niveau:3, style:'Rock', bpm:84, beats:4, res:4, fidelite:'accompagnement',
  desc:"Tempo lent et lourd : un groove qui laisse de la place, avec des toms pour faire monter la tension.",
  astuce:"Plus c'est lent, plus c'est dur : chaque note doit tomber exactement à sa place.",
  sections:[
    { nom:'Couplet', fois:4, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----x-------x---', GC:'x-----x-x-------' } },
    { nom:'Montée toms', fois:1, tracks:{ T1:'x-x-x-x---------', TB:'--------x-x-x-x-', GC:'x-------x-------' } },
    { nom:'Refrain', fois:4, bars:2, tracks:{
        CR:'x---------------'+SILENCE(16), RD:'--x-x-x-x-x-x-x-'+'x-x-x-x-x-x-x-x-',
        CC:'----X-------X---'+'----X-------X---', GC:'x-----x-x-------'+'x-----x-x-----x-' } }
  ]
},
{
  id:'m-sweet-child', titre:"Sweet Child O' Mine", artiste:"Guns N' Roses", annee:1987,
  niveau:3, style:'Hard rock', bpm:125, beats:4, res:4, fidelite:'accompagnement',
  desc:"Rock carré avec une grosse caisse qui rebondit après le backbeat.",
  astuce:"Le coup de pied sur le « et » du 2 doit être léger, il relance juste le groove.",
  sections:[
    { nom:'Couplet', fois:4, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----x-------x---', GC:'x-----x-x-------' } },
    { nom:'Refrain', fois:4, bars:2, tracks:{
        CR:'x---------------'+SILENCE(16), RD:'--x-x-x-x-x-x-x-'+'x-x-x-x-x-x-x-x-',
        CC:'----X-------X---'+'----X-------X---', GC:'x-----x-x-------'+'x-----x-x-x-----' } },
    { nom:'Break', fois:1, tracks:{ CC:'x-x-x-x-xxxx----', T1:'------------xx--', TB:'--------------xx' } }
  ]
},
{
  id:'m-enter-sandman', titre:'Enter Sandman', artiste:'Metallica', annee:1991,
  niveau:3, style:'Métal', bpm:123, beats:4, res:4, fidelite:'accompagnement',
  desc:"Métal mid-tempo : un groove lourd avec des doublés de grosse caisse.",
  astuce:"Les deux coups de pied rapprochés (doubles-croches) doivent avoir le même volume.",
  sections:[
    { nom:'Intro toms', fois:2, tracks:{ TB:'x---x---x---x---', GC:'x-------x-------' } },
    { nom:'Couplet', fois:4, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----X-------X---', GC:'x-----xxx-------' } },
    { nom:'Refrain', fois:4, bars:2, tracks:{
        CR:'x-------x-------'+'x-------x-------', CC:'----X-------X---'+'----X-------X---',
        GC:'x-----xxx-----x-'+'x-----xxx-x-----' } }
  ]
},
{
  id:'m-walk-this-way', titre:'Walk This Way', artiste:'Aerosmith', annee:1975,
  niveau:3, style:'Funk rock', bpm:108, beats:4, res:4, fidelite:'accompagnement',
  desc:"Un rock funky : charleston qui s'ouvre, grosse caisse syncopée. Le morceau commence par la batterie seule.",
  astuce:"Joue l'intro seul, sans rien d'autre : c'est exactement comme ça que le morceau démarre.",
  sections:[
    { nom:'Intro batterie', fois:2, tracks:{ CH:'x-x-x-o-x-x-x-o-', CC:'----X-------X---', GC:'x--x---xx-x-----' } },
    { nom:'Groove', fois:8, tracks:{ CH:'x-x-x-o-x-x-x-o-', CC:'----X-------X---', GC:'x--x---xx-x-----' } }
  ]
},
{
  id:'m-uptown-funk', titre:'Uptown Funk', artiste:'Mark Ronson ft. Bruno Mars', annee:2014,
  niveau:3, style:'Funk', bpm:115, beats:4, res:4, fidelite:'accompagnement',
  desc:"Funk moderne : charleston en doubles-croches, grosse caisse syncopée, backbeat puissant.",
  astuce:"Charleston souple et léger, caisse claire très présente : c'est le contraste qui fait le funk.",
  sections:[
    { nom:'Couplet', fois:4, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----X-------X---', GC:'x--x--x---x-----' } },
    { nom:'Refrain', fois:4, tracks:{ CH:'xxxxxxxxxxxxxxxx', CC:'----X--g-g--X---', GC:'x--x--x---x--x--' } },
    { nom:'Break', fois:1, tracks:{ CC:'X--X--X---X-X---', GC:'X--X--X---X-X---' } }
  ]
},
{
  id:'m-sunday-bloody', titre:'Sunday Bloody Sunday', artiste:'U2', annee:1983,
  niveau:3, style:'Rock', bpm:100, beats:4, res:4, fidelite:'accompagnement',
  desc:"Un groove martial : grosse caisse en croches continues et caisse claire qui marche au pas.",
  astuce:"La grosse caisse ne s'arrête jamais : c'est elle qui donne le côté militaire.",
  sections:[
    { nom:'Marche', fois:4, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----X-------X-xx', GC:'x-x-x-x-x-x-x-x-' } },
    { nom:'Refrain', fois:4, tracks:{ CR:'x---------------', CH:'--x-x-x-x-x-x-x-', CC:'----X-------X-xx', GC:'x-x-x-x-x-x-x-x-' } }
  ]
},
{
  id:'m-air-tonight', titre:'In the Air Tonight', artiste:'Phil Collins', annee:1981,
  niveau:3, style:'Pop', bpm:94, beats:4, res:4, fidelite:'accompagnement',
  desc:"Le morceau est célèbre pour son break de toms qui arrive après une longue attente. Ici : l'attente, le break, puis le groove.",
  astuce:"Le break en doubles-croches descend sur les toms : prépare les bras pendant les deux premiers temps de silence.",
  sections:[
    { nom:'Attente', fois:2, tracks:{ HP:'x---x---x---x---' } },
    { nom:'Break de toms', fois:1, tracks:{ T1:'--------xxxx----', T2:'------------xx--', TB:'--------------xx' } },
    { nom:'Groove', fois:8, tracks:{ CR:'x---------------', CH:'--x-x-x-x-x-x-x-', CC:'----X-------X---', GC:'x-----x-x-------' } }
  ]
},
{
  id:'m-levee', titre:'When the Levee Breaks', artiste:'Led Zeppelin', annee:1971,
  niveau:3, style:'Hard rock', bpm:71, beats:4, res:4, fidelite:'accompagnement',
  desc:"Tempo très lent, son énorme : un groove lourd qui laisse respirer chaque coup.",
  astuce:"Frappe fort mais sans te précipiter : à 71 BPM, la tentation d'accélérer est permanente.",
  sections:[
    { nom:'Groove', fois:8, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----X-------X---', GC:'x-x-----x--x--x-' } }
  ]
},

/* ---------------------------- Niveau 4-5 ---------------------------- */
{
  id:'m-superstition', titre:'Superstition', artiste:'Stevie Wonder', annee:1972,
  niveau:4, style:'Funk', bpm:100, beats:4, res:4, fidelite:'accompagnement',
  desc:"Le morceau commence par la batterie seule : charleston en doubles-croches, ouvertures, grosse caisse syncopée.",
  astuce:"Les accents du charleston tombent sur les temps, les ouvertures juste avant le backbeat.",
  sections:[
    { nom:'Intro batterie', fois:4, tracks:{ CH:'X-x-X-xoX-x-X-xo', CC:'----X-------X---', GC:'x--x--x-x-----x-' } },
    { nom:'Groove', fois:8, tracks:{ CH:'X-x-X-xoX-x-X-xo', CC:'----X--g----X---', GC:'x--x--x-x-----x-' } }
  ]
},
{
  id:'m-rosanna', titre:'Rosanna', artiste:'Toto', annee:1982,
  niveau:5, style:'Pop rock', bpm:172, beats:4, res:3, fidelite:'origine',
  desc:"LE half-time shuffle : backbeat seulement sur le 3, ghost notes dans les triolets. Ici écrit en croches ternaires (≈172, soit 86 en demi-tempo).",
  astuce:"Des semaines de travail, pas des jours. Isole charleston + caisse claire, ajoute le pied en dernier.",
  sections:[
    { nom:'Groove', fois:8, tracks:{ CH:'x-xx-xx-xx-x', CC:'-g--g-X-g-g-', GC:'x----x----x-' } },
    { nom:'Break', fois:1, tracks:{ CC:'xxxxxx------', T1:'------xxx---', TB:'---------xxx' } }
  ]
},
{
  id:'m-money', titre:'Money', artiste:'Pink Floyd', annee:1973,
  niveau:5, style:'Rock progressif', bpm:120, beats:7, res:2, fidelite:'accompagnement',
  desc:"Un rock en 7/4 : sept temps par mesure. On compte 1-2-3-4 / 1-2-3.",
  astuce:"Pense la mesure en deux morceaux (4 + 3) plutôt qu'en sept temps d'affilée.",
  sections:[
    { nom:'Couplet 7/4', fois:8, tracks:{ CH:'xxxxxxxxxxxxxx', CC:'----x-----x---', GC:'x-------x-----' } }
  ]
},
{
  id:'m-take-five', titre:'Take Five', artiste:'The Dave Brubeck Quartet', annee:1959,
  niveau:5, style:'Jazz', bpm:173, beats:5, res:3, fidelite:'accompagnement',
  desc:"Le standard de jazz en 5/4 : rythme de ride swing sur cinq temps. On compte 1-2-3 / 4-5.",
  astuce:"Le charleston au pied sur 2 et 4 aide à ne pas perdre la mesure. La ride reste légère.",
  sections:[
    { nom:'Groove 5/4', fois:8, tracks:{ RD:'x--x-xx--x-xx--', HP:'---x-----x-----', GC:'x--------------' } }
  ]
}
];

/* Transforme un morceau en un motif unique (sections dépliées) que le
 * lecteur, la partition et la grille savent afficher. */
export function compilerMorceau(m){
  const parMesure = m.beats * m.res;
  const ids = new Set();
  for (const s of m.sections) Object.keys(s.tracks).forEach(k => ids.add(k));

  const tracks = {};
  for (const id of ids) tracks[id] = '';
  const sections = [];
  let mesure = 0;

  for (const s of m.sections){
    const bars = s.bars || 1;
    const len = parMesure * bars;
    const debut = mesure;
    for (let f = 0; f < s.fois; f++){
      for (const id of ids){
        const brut = (s.tracks[id] || '').replace(/[|\s]/g, '');
        tracks[id] += brut.padEnd(len, '-').slice(0, len);
      }
      mesure += bars;
    }
    sections.push({ nom:s.nom, fois:s.fois, debut, fin:mesure });
  }

  return {
    id: m.id, nom: m.titre, style: m.style, niveau: m.niveau,
    beats: m.beats, res: m.res, unite: m.unite, bars: mesure,
    bpm: [Math.max(40, Math.round(m.bpm * 0.5)), m.bpm, Math.min(260, Math.round(m.bpm * 1.1))],
    tracks, sections, morceau: m
  };
}
