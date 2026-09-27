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
},
{
  id:'m-song-for-the-deaf', titre:'Song for the Deaf', artiste:'Queens of the Stone Age', annee:2002,
  niveau:4, style:'Hard rock', bpm:171, beats:4, res:4, fidelite:'accompagnement',
  desc:"Le morceau-titre de l'album, Dave Grohl à la batterie : 171 BPM, une intro à la batterie, des toms qui martèlent comme une transe, puis des couplets lourds et des refrains qui explosent sur la crash.",
  astuce:"À 171 BPM, tout repose sur les croches régulières. Travaille d'abord chaque section à 100–120 BPM, puis monte par paliers. Les toms doivent sonner gros : frappe au centre de la peau, bras détendus.",
  sections:[
    { nom:'Intro aux toms', fois:4, tracks:{
        TB:'x-x-x-x-x-x-x-x-', T1:'--------------xx', CC:'----x-------x---', GC:'x-----x-x-----x-' } },
    { nom:'Couplet', fois:8, tracks:{
        CH:'x-x-x-x-x-x-x-x-', CC:'----x-------x---', GC:'x-----x-x-----x-' } },
    { nom:'Refrain', fois:8, bars:2, tracks:{
        CR:'x-x-x-x-x-x-x-x-'+'x-x-x-x-x-x-x-x-', CC:'----x-------x---'+'----x-------x---',
        GC:'x---x-x-x---x-x-'+'x---x-x-x-x-x-x-' } },
    { nom:'Transe aux toms', fois:8, tracks:{
        TB:'x-x-x-x-x-x-x-x-', T1:'----x-------x---', GC:'x---x---x---x---' } },
    { nom:'Break', fois:1, tracks:{
        CC:'xxxx------------', T1:'----xxxx--------', T2:'--------xxxx----', TB:'------------xxxx', GC:'x---x---x---x---' } },
    { nom:'Refrain final', fois:8, bars:2, tracks:{
        CR:'x-x-x-x-x-x-x-x-'+'x-x-x-x-x-x-x-x-', CC:'----x-------x---'+'----x-------x---',
        GC:'x---x-x-x---x-x-'+'x---x-x-x-x-x-x-' } }
  ]
}
];

/* ======================= MORCEAUX SUPPLÉMENTAIRES =======================
 * Tempos relevés sur SongBPM, GetSongBPM et Tunebat. Sauf mention contraire,
 * ce sont des grooves d'accompagnement (à jouer par-dessus le disque). */
const M8 = { CH:'xxxxxxxx', CC:'--x---x-', GC:'x---x---' };           // rock en croches
const M8_4 = { CH:'xxxxxxxx', CC:'--x---x-', GC:'x-x-x-x-' };         // pied sur les 4 temps
const M16 = { CH:'x-x-x-x-x-x-x-x-', CC:'----x-------x---', GC:'x-------x-------' };
const M_CRASH8 = t => ({ ...t, CR:'x-------', CH:'-' + t.CH.slice(1) });
const M_SHUFFLE = { CH:'x-xx-xx-xx-x', CC:'---x-----x--', GC:'x-----x-----' };
const morceau = o => ({ beats:4, fidelite:'accompagnement', ...o });

MORCEAUX.push(
/* ------------------------------ rock ------------------------------ */
morceau({ id:'m-another-brick', titre:'Another Brick in the Wall (Part 2)', artiste:'Pink Floyd', annee:1979,
  niveau:1, style:'Rock', bpm:104, res:2,
  desc:"Un groove disco-rock d'une régularité parfaite, sans aucun break : idéal pour tenir la distance.",
  astuce:"Le charleston reste léger, grosse caisse et caisse claire font tout le travail.",
  sections:[ { nom:'Couplet', fois:8, tracks:M8 }, { nom:'Refrain', fois:8, tracks:M8_4 } ] }),
morceau({ id:'m-come-as-you-are', titre:'Come as You Are', artiste:'Nirvana', annee:1991,
  niveau:2, style:'Grunge', bpm:120, res:2,
  desc:"Un couplet posé, un refrain qui s'ouvre sur les cymbales, un petit fill pour relancer.",
  astuce:"Au refrain, joue la crash sur les temps 1 et 3, pas plus : sinon ça devient brouillon.",
  sections:[
    { nom:'Couplet', fois:8, tracks:{ CH:'xxxxxxxx', CC:'--x---x-', GC:'x---x-x-' } },
    { nom:'Refrain', fois:4, tracks:{ CR:'x---x---', CC:'--x---x-', GC:'x---x-x-' } },
    { nom:'Fill', fois:1, tracks:{ CC:'xx------', T1:'--xx----', T2:'----xx--', TB:'------xx' } } ] }),
morceau({ id:'m-should-i-stay', titre:'Should I Stay or Should I Go', artiste:'The Clash', annee:1982,
  niveau:2, style:'Rock', bpm:113, res:2,
  desc:"Un rock carré avec des arrêts francs : parfait pour travailler les départs et les silences.",
  astuce:"Après l'arrêt, le groupe repart ensemble : le compte doit être dans ta tête, pas dans tes bras.",
  sections:[ { nom:'Couplet', fois:8, tracks:M8 }, { nom:'Refrain', fois:4, tracks:M8_4 },
    { nom:'Arrêt', fois:1, tracks:{ CR:'x-------', GC:'x-------' } } ] }),
morceau({ id:'m-sunshine', titre:'Sunshine of Your Love', artiste:'Cream', annee:1967,
  niveau:3, style:'Rock', bpm:116, res:2,
  desc:"Ginger Baker remplace le backbeat par les toms : un groove tribal sous le riff de guitare.",
  astuce:"Tom et grosse caisse tombent ensemble sur les temps : cherche un seul son, grave et rond.",
  sections:[
    { nom:'Riff (toms)', fois:8, tracks:{ CH:'xxxxxxxx', T1:'--x---x-', TB:'x---x---', GC:'x---x---' } },
    { nom:'Refrain', fois:4, tracks:M_CRASH8(M8) } ] }),
morceau({ id:'m-rock-and-roll', titre:'Rock and Roll', artiste:'Led Zeppelin', annee:1971,
  niveau:3, style:'Rock', bpm:170, res:2,
  desc:"Un rock très rapide en croches, avec une grosse caisse qui rebondit sur les « et ».",
  astuce:"À ce tempo, le charleston se joue en noires si les croches se crispent.",
  sections:[ { nom:'Groove', fois:8, tracks:{ CH:'xxxxxxxx', CC:'--x---x-', GC:'x--x-x--' } },
    { nom:'Final (crash)', fois:2, tracks:{ CR:'x---x---', CC:'--x---x-', GC:'x---x---' } } ] }),
morceau({ id:'m-johnny-b-goode', titre:'Johnny B. Goode', artiste:'Chuck Berry', annee:1958,
  niveau:3, style:'Rock\'n\'roll', bpm:168, res:2,
  desc:"Le rock'n'roll des origines : caisse claire en croches continues, backbeat accentué.",
  astuce:"Les croches à la caisse claire se jouent main à main, les accents tombent sur 2 et 4.",
  sections:[ { nom:'Couplet', fois:8, tracks:{ CC:'xxXxxxXx', GC:'x---x---', HP:'--x---x-' } },
    { nom:'Refrain', fois:4, tracks:M8 } ] }),
morceau({ id:'m-wonderwall', titre:'Wonderwall', artiste:'Oasis', annee:1995,
  niveau:3, style:'Rock', bpm:87, res:4,
  desc:"Charleston en doubles-croches et grosse caisse syncopée : un groove souple sous les guitares acoustiques.",
  astuce:"Les doubles au charleston se jouent d'une seule main, légères, en bougeant l'avant-bras.",
  sections:[
    { nom:'Couplet', fois:8, tracks:{ CH:'xxxxxxxxxxxxxxxx', CC:'----x-------x---', GC:'x-----x-x-------' } },
    { nom:'Refrain', fois:4, tracks:{ CR:'x---------------', CH:'-xxxxxxxxxxxxxxx', CC:'----x-------x---', GC:'x-----x-x-----x-' } } ] }),
morceau({ id:'m-mr-brightside', titre:'Mr. Brightside', artiste:'The Killers', annee:2003,
  niveau:3, style:'Rock', bpm:148, res:2,
  desc:"Un rock nerveux : couplet syncopé au pied, refrain avec la grosse caisse sur tous les temps.",
  astuce:"Au refrain, la crash et le pied tombent ensemble sur le 1 : un seul gros son.",
  sections:[ { nom:'Couplet', fois:8, tracks:{ CH:'xxxxxxxx', CC:'--x---x-', GC:'x-xx-x--' } },
    { nom:'Refrain', fois:8, tracks:M_CRASH8(M8_4) } ] }),
morceau({ id:'m-everlong', titre:'Everlong', artiste:'Foo Fighters', annee:1997,
  niveau:4, style:'Rock', bpm:158, res:2,
  desc:"Un rock rapide et puissant, avec un refrain où la crash et la grosse caisse ne s'arrêtent jamais.",
  astuce:"Garde de l'énergie pour le refrain : le couplet se joue plus retenu.",
  sections:[ { nom:'Couplet', fois:8, tracks:{ CH:'xxxxxxxx', CC:'--x---x-', GC:'x-xx--x-' } },
    { nom:'Refrain', fois:8, tracks:{ CR:'x---x---', CC:'--x---x-', GC:'xx-xx-x-' } } ] }),
morceau({ id:'m-the-pretender', titre:'The Pretender', artiste:'Foo Fighters', annee:2007,
  niveau:4, style:'Rock', bpm:173, res:2,
  desc:"Très rapide et très direct : une montée en croches à la caisse claire, puis un refrain à la ride.",
  astuce:"À 173 BPM, reste détendu : les croches viennent des poignets, pas des épaules.",
  sections:[ { nom:'Couplet', fois:8, tracks:M8 },
    { nom:'Montée', fois:2, tracks:{ CC:'xxxxxxxx', GC:'x-x-x-x-' } },
    { nom:'Refrain', fois:8, tracks:{ RD:'xxxxxxxx', CC:'--x---x-', GC:'x-x-x-x-' } } ] }),
morceau({ id:'m-blitzkrieg-bop', titre:'Blitzkrieg Bop', artiste:'Ramones', annee:1976,
  niveau:3, style:'Punk', bpm:177, res:2,
  desc:"« Hey! Ho! Let's go! » : un intro au tom basse, puis des croches à fond, sans jamais ralentir.",
  astuce:"Endurance avant tout : joue tout le morceau d'une traite, sans pause.",
  sections:[ { nom:'Intro (tom basse)', fois:4, tracks:{ TB:'x-x-x-x-', GC:'x-x-x-x-' } },
    { nom:'Groove', fois:16, tracks:M8_4 } ] }),
morceau({ id:'m-basket-case', titre:'Basket Case', artiste:'Green Day', annee:1994,
  niveau:4, style:'Punk', bpm:175, res:2,
  desc:"Un punk-pop rapide : couplet syncopé, refrain avec crash et pied sur les temps.",
  astuce:"Si 175 BPM est trop rapide, travaille-le à 88 BPM en doubles-croches : c'est le même geste.",
  sections:[ { nom:'Couplet', fois:8, tracks:{ CH:'xxxxxxxx', CC:'--x---x-', GC:'x--xx-x-' } },
    { nom:'Refrain', fois:8, tracks:M_CRASH8(M8_4) } ] }),

/* ------------------------- hard rock & métal ------------------------- */
morceau({ id:'m-thunderstruck', titre:'Thunderstruck', artiste:'AC/DC', annee:1990,
  niveau:2, style:'Hard rock', bpm:134, res:2,
  desc:"La batterie entre sur une montée au tom basse, puis un rock en croches d'une efficacité totale.",
  astuce:"Pendant la montée, le tom basse est régulier comme un métronome : c'est lui qui crée la tension.",
  sections:[ { nom:'Montée', fois:4, tracks:{ TB:'x-x-x-x-' } }, { nom:'Couplet', fois:8, tracks:M8 },
    { nom:'Refrain', fois:4, tracks:M_CRASH8(M8) } ] }),
morceau({ id:'m-you-shook-me', titre:'You Shook Me All Night Long', artiste:'AC/DC', annee:1980,
  niveau:2, style:'Hard rock', bpm:127, res:2,
  desc:"Le groove rock parfait : simple, lourd, avec une petite ouverture de charleston au refrain.",
  astuce:"Phil Rudd ne joue presque rien de plus que le groove de base : tout est dans la régularité.",
  sections:[ { nom:'Couplet', fois:8, tracks:M8 },
    { nom:'Refrain', fois:8, tracks:{ CH:'xxxxxxxo', CC:'--x---x-', GC:'x---x---' } } ] }),
morceau({ id:'m-paranoid', titre:'Paranoid', artiste:'Black Sabbath', annee:1970,
  niveau:3, style:'Hard rock', bpm:163, res:2,
  desc:"Un hard rock rapide et sans répit, la grosse caisse qui pousse sous le riff.",
  astuce:"Le pied joue « 1, 2-et, 3 » : garde-le léger pour tenir le tempo.",
  sections:[ { nom:'Groove', fois:16, tracks:{ CH:'xxxxxxxx', CC:'--x---x-', GC:'x--xx---' } },
    { nom:'Final', fois:2, tracks:{ CR:'x---x---', CC:'--x---x-', GC:'x-x-x-x-' } } ] }),
morceau({ id:'m-crazy-train', titre:'Crazy Train', artiste:'Ozzy Osbourne', annee:1980,
  niveau:3, style:'Métal', bpm:138, res:2,
  desc:"Pied sur les quatre temps au couplet, refrain à la crash avec la grosse caisse qui galope.",
  astuce:"Le galop du refrain (« boum-boum-boum . ») se prépare au pied seul.",
  sections:[ { nom:'Couplet', fois:8, tracks:M8_4 },
    { nom:'Refrain', fois:4, tracks:{ CR:'x---x---', CC:'--x---x-', GC:'xxx-xxx-' } } ] }),
morceau({ id:'m-killing-in-the-name', titre:'Killing in the Name', artiste:'Rage Against the Machine', annee:1992,
  niveau:3, style:'Hard rock', bpm:88, res:4,
  desc:"Un groove lourd et funky en doubles, puis des coups de crash qui suivent le riff.",
  astuce:"Sur le riff, la grosse caisse suit exactement la guitare : écoute le disque et cale-toi dessus.",
  sections:[
    { nom:'Couplet', fois:8, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----x-------x---', GC:'x-x-----x-x-----' } },
    { nom:'Riff', fois:4, tracks:{ CR:'x-------x-------', CC:'----x-------x---', GC:'x--x--x-x--x--x-' } } ] }),
morceau({ id:'m-master-of-puppets', titre:'Master of Puppets', artiste:'Metallica', annee:1986,
  niveau:5, style:'Métal', bpm:212, res:2,
  desc:"Le thrash à pleine vitesse : caisse claire sur tous les contretemps, grosse caisse sur tous les temps.",
  astuce:"Commence à 120 BPM avec le tempo progressif. Le secret : des mains basses et détendues.",
  sections:[ { nom:'Riff (skank)', fois:8, tracks:{ CH:'xxxxxxxx', CC:'-x-x-x-x', GC:'x-x-x-x-' } },
    { nom:'Couplet', fois:8, tracks:{ CH:'xxxxxxxx', CC:'--x---x-', GC:'x-xxx-xx' } } ] }),

/* ------------------------------ pop ------------------------------ */
morceau({ id:'m-beat-it', titre:'Beat It', artiste:'Michael Jackson', annee:1982,
  niveau:2, style:'Pop', bpm:139, res:2,
  desc:"Une pop-rock qui avance : grosse caisse relancée au couplet, sur tous les temps au refrain.",
  astuce:"Le groove doit rester sec et précis, comme une boîte à rythmes.",
  sections:[ { nom:'Couplet', fois:8, tracks:{ CH:'xxxxxxxx', CC:'--x---x-', GC:'x--xx---' } },
    { nom:'Refrain', fois:8, tracks:M8_4 } ] }),
morceau({ id:'m-every-breath', titre:'Every Breath You Take', artiste:'The Police', annee:1983,
  niveau:2, style:'Pop', bpm:117, res:2,
  desc:"Un groove épuré, où chaque note compte : Stewart Copeland joue très peu, très juste.",
  astuce:"Joue doucement : la chanson est calme, la batterie accompagne sans pousser.",
  sections:[ { nom:'Couplet', fois:8, tracks:{ CH:'xxxxxxxx', CC:'--x---x-', GC:'x---x-x-' } },
    { nom:'Pont', fois:4, tracks:M_CRASH8(M8) } ] }),
morceau({ id:'m-rolling-in-the-deep', titre:'Rolling in the Deep', artiste:'Adele', annee:2010,
  niveau:2, style:'Pop', bpm:105, res:2,
  desc:"Un couplet porté par la grosse caisse sur chaque temps, puis un refrain complet et puissant.",
  astuce:"Au couplet, pas de charleston : pied et caisse claire, comme des pas et des claps.",
  sections:[ { nom:'Couplet', fois:8, tracks:{ CC:'--x---x-', GC:'x-x-x-x-' } },
    { nom:'Refrain', fois:8, tracks:M8_4 } ] }),
morceau({ id:'m-blinding-lights', titre:'Blinding Lights', artiste:'The Weeknd', annee:2019,
  niveau:3, style:'Pop', bpm:171, res:2,
  desc:"Une boîte à rythmes façon années 80 : pied sur chaque temps, charleston entre les temps, très rapide.",
  astuce:"Si 171 BPM est trop rapide, pense-le à 86 BPM en doubles-croches.",
  sections:[ { nom:'Groove', fois:16, tracks:{ GC:'x-x-x-x-', CC:'--x---x-', CH:'-x-x-x-x' } } ] }),
morceau({ id:'m-dont-stop-me-now', titre:'Don\'t Stop Me Now', artiste:'Queen', annee:1978,
  niveau:3, style:'Pop rock', bpm:156, res:2,
  desc:"Un couplet au piano, puis la batterie arrive et ne lâche plus : pied sur tous les temps au refrain.",
  astuce:"Tempo vif et joyeux : souris en jouant, ça s'entend (vraiment).",
  sections:[ { nom:'Couplet', fois:8, tracks:{ CH:'xxxxxxxx', CC:'--x---x-', GC:'x---x-x-' } },
    { nom:'Refrain', fois:8, tracks:M_CRASH8(M8_4) } ] }),

/* ------------------------ funk, soul, disco ------------------------ */
morceau({ id:'m-stayin-alive', titre:'Stayin\' Alive', artiste:'Bee Gees', annee:1977,
  niveau:2, style:'Disco', bpm:104, res:4, fidelite:'origine',
  desc:"Le disco par excellence : grosse caisse sur chaque temps, backbeat, charleston qui s'ouvre au refrain.",
  astuce:"Le tempo sert de référence aux secouristes pour le massage cardiaque : il doit être parfaitement stable.",
  sections:[
    { nom:'Couplet', fois:8, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----x-------x---', GC:'x---x---x---x---' } },
    { nom:'Refrain', fois:8, tracks:{ CH:'x-o-x-o-x-o-x-o-', CC:'----x-------x---', GC:'x---x---x---x---' } } ] }),
morceau({ id:'m-le-freak', titre:'Le Freak', artiste:'Chic', annee:1978,
  niveau:3, style:'Disco', bpm:118, res:4,
  desc:"Charleston en doubles avec une ouverture sur chaque « et » : le son de Chic.",
  astuce:"L'ouverture est très courte : pied gauche qui se lève et se repose sur la double suivante.",
  sections:[ { nom:'Groove', fois:16, tracks:{ CH:'xxoxxxoxxxoxxxox', CC:'----x-------x---', GC:'x---x---x---x---' } } ] }),
morceau({ id:'m-september', titre:'September', artiste:'Earth, Wind & Fire', annee:1978,
  niveau:3, style:'Funk', bpm:126, res:4,
  desc:"Un funk dansant : couplet en croches, refrain avec ouvertures de charleston et une ghost note.",
  astuce:"La ghost note avant le 3 se joue à peine : elle se sent plus qu'elle ne s'entend.",
  sections:[
    { nom:'Couplet', fois:8, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----x-------x---', GC:'x---x---x---x---' } },
    { nom:'Refrain', fois:8, tracks:{ CH:'x-o-x-o-x-o-x-o-', CC:'----x--g----x---', GC:'x---x---x---x---' } } ] }),
morceau({ id:'m-i-want-you-back', titre:'I Want You Back', artiste:'The Jackson 5', annee:1969,
  niveau:3, style:'Soul', bpm:103, res:4,
  desc:"La soul Motown : backbeat puissant, grosse caisse qui chaloupe, et des coups d'arrêt pour le break.",
  astuce:"Au break, compte bien les silences : les coups de caisse claire répondent au chant.",
  sections:[
    { nom:'Groove', fois:8, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----X-------X---', GC:'x-------x-x-----' } },
    { nom:'Break', fois:2, tracks:{ CC:'----X---X-X-X---', GC:'x---------------' } } ] }),

/* ----------------------- hip-hop & électro ----------------------- */
morceau({ id:'m-lose-yourself', titre:'Lose Yourself', artiste:'Eminem', annee:2002,
  niveau:2, style:'Hip-hop', bpm:86, res:4,
  desc:"Un hip-hop tendu : caisse claire lourde, grosse caisse qui relance à la fin de chaque mesure.",
  astuce:"Le morceau est souvent noté 171 BPM : ici on le joue à 86, en doubles-croches, c'est pareil.",
  sections:[
    { nom:'Couplet', fois:8, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----x-------x---', GC:'x-------x-x-----' } },
    { nom:'Refrain', fois:8, tracks:{ CR:'x---------------', CH:'--x-x-x-x-x-x-x-', CC:'----x-------x---', GC:'x-----x-x-x-----' } } ] }),
morceau({ id:'m-in-da-club', titre:'In da Club', artiste:'50 Cent', annee:2003,
  niveau:2, style:'Hip-hop', bpm:90, res:4,
  desc:"Un beat hip-hop rebondissant : la grosse caisse joue un petit motif syncopé.",
  astuce:"Joue en retrait, sans forcer : le hip-hop se joue « derrière » le temps.",
  sections:[ { nom:'Groove', fois:16, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----x-------x---', GC:'x--x----x-xx----' } } ] }),
morceau({ id:'m-around-the-world', titre:'Around the World', artiste:'Daft Punk', annee:1997,
  niveau:1, style:'Électro', bpm:121, res:2,
  desc:"La house filtrée de Daft Punk : pied sur chaque temps, charleston ouvert entre les temps.",
  astuce:"Le morceau répète la même boucle 7 minutes : défi d'endurance et de régularité.",
  sections:[ { nom:'Boucle', fois:16, tracks:{ GC:'x-x-x-x-', CH:'-o-o-o-o', CC:'--x---x-' } } ] }),
morceau({ id:'m-one-more-time', titre:'One More Time', artiste:'Daft Punk', annee:2000,
  niveau:1, style:'Électro', bpm:123, res:2,
  desc:"Un four on the floor joyeux, et un long pont où il ne reste que la grosse caisse.",
  astuce:"Pendant le pont, garde le pied parfaitement régulier : tout le monde danse dessus.",
  sections:[ { nom:'Couplet', fois:8, tracks:{ GC:'x-x-x-x-', CC:'--x---x-', CH:'-x-x-x-x' } },
    { nom:'Pont (pied seul)', fois:4, tracks:{ GC:'x-x-x-x-' } } ] }),
morceau({ id:'m-papaoutai', titre:'Papaoutai', artiste:'Stromae', annee:2013,
  niveau:2, style:'Électro', bpm:116, res:4,
  desc:"Un couplet hip-hop léger, puis un refrain dansant avec la grosse caisse sur chaque temps.",
  astuce:"Au refrain, le charleston s'ouvre sur les « et » : un balancier « boum-tsss ».",
  sections:[
    { nom:'Couplet', fois:8, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----x-------x---', GC:'x-----x---x-----' } },
    { nom:'Refrain', fois:8, tracks:{ CH:'x-o-x-o-x-o-x-o-', CC:'----x-------x---', GC:'x---x---x---x---' } } ] }),

/* ------------------------- variété française ------------------------- */
morceau({ id:'m-ca-plane-pour-moi', titre:'Ça plane pour moi', artiste:'Plastic Bertrand', annee:1977,
  niveau:3, style:'Variété', bpm:166, res:2,
  desc:"Le punk version belge : un rock en croches très rapide et un refrain à la crash.",
  astuce:"Pense en demi-tempo (83 BPM) si ça va trop vite : le pied reste sur 1 et 3.",
  sections:[ { nom:'Couplet', fois:8, tracks:M8 }, { nom:'Refrain', fois:8, tracks:M_CRASH8(M8_4) } ] }),
morceau({ id:'m-l-aventurier', titre:'L\'Aventurier', artiste:'Indochine', annee:1982,
  niveau:3, style:'Variété', bpm:167, res:2,
  desc:"La new wave d'Indochine : grosse caisse sur tous les temps, charleston qui s'ouvre en fin de mesure.",
  astuce:"Le groove est très rapide mais très simple : garde les bras relâchés.",
  sections:[ { nom:'Couplet', fois:8, tracks:M8_4 },
    { nom:'Refrain', fois:8, tracks:{ CH:'xxxxxxxo', CC:'--x---x-', GC:'x-x-x-x-' } } ] }),
morceau({ id:'m-derniere-danse', titre:'Dernière danse', artiste:'Indila', annee:2013,
  niveau:2, style:'Variété', bpm:116, res:4,
  desc:"Une pop française dramatique : couplet retenu, refrain qui s'emballe avec le pied sur chaque temps.",
  astuce:"Joue le couplet doucement et garde de l'énergie pour le refrain.",
  sections:[ { nom:'Couplet', fois:8, tracks:M16 },
    { nom:'Refrain', fois:8, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----x-------x---', GC:'x---x---x---x---' } } ] }),

/* -------------------------- reggae & latino -------------------------- */
morceau({ id:'m-could-you-be-loved', titre:'Could You Be Loved', artiste:'Bob Marley & The Wailers', annee:1980,
  niveau:2, style:'Reggae', bpm:103, res:4,
  desc:"Un reggae dansant : grosse caisse sur chaque temps (steppers), charleston léger.",
  astuce:"Main droite souple : le charleston doit « danser » et non marteler.",
  sections:[ { nom:'Groove', fois:16, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----x-------x---', GC:'x---x---x---x---' } } ] }),
morceau({ id:'m-despacito', titre:'Despacito', artiste:'Luis Fonsi feat. Daddy Yankee', annee:2017,
  niveau:2, style:'Latin', bpm:89, res:4,
  desc:"Le reggaeton : grosse caisse sur chaque temps et la caisse claire « dembow » qui boite.",
  astuce:"Compte « 1 e et A 2 e ET a » : la caisse claire tombe sur le A et sur le ET.",
  sections:[ { nom:'Groove', fois:16, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'---x--x----x--x-', GC:'x---x---x---x---' } } ] }),
morceau({ id:'m-smooth', titre:'Smooth', artiste:'Santana feat. Rob Thomas', annee:1999,
  niveau:3, style:'Latin', bpm:116, res:4,
  desc:"Un rock latin : grosse caisse qui dessine un motif latin sous un backbeat bien rock.",
  astuce:"Le pied suit le motif « 1 . . A . . 3 . e . . A » : chante-le avant de le jouer.",
  sections:[
    { nom:'Couplet', fois:8, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----x-------x---', GC:'x--x--x---x--x--' } },
    { nom:'Refrain', fois:8, tracks:{ RD:'x-x-x-x-x-x-x-x-', CC:'----x-------x---', GC:'x--x--x---x--x--' } } ] }),
morceau({ id:'m-oye-como-va', titre:'Oye Como Va', artiste:'Santana', annee:1970,
  niveau:3, style:'Latin', bpm:128, res:4,
  desc:"Le cha-cha-cha de Tito Puente, version Santana : la ride remplace la cloche, la caisse claire joue « cha-cha » sur le 4.",
  astuce:"Le « cha-cha » (4 et) est léger et sec, jamais appuyé.",
  sections:[ { nom:'Cha-cha', fois:16, tracks:{ RD:'x-x-x-x-x-x-x-x-', CC:'------------x-x-', GC:'x-------x-------' } } ] }),

/* --------------------------- blues & jazz --------------------------- */
morceau({ id:'m-pride-and-joy', titre:'Pride and Joy', artiste:'Stevie Ray Vaughan', annee:1983,
  niveau:3, style:'Blues', bpm:126, res:3,
  desc:"Le shuffle texan de Double Trouble : balancement ternaire, backbeat solide.",
  astuce:"Le shuffle est « long-court » : la première note du triolet dure deux fois plus que la seconde.",
  sections:[ { nom:'Shuffle', fois:12, tracks:M_SHUFFLE }, { nom:'Fin', fois:1, tracks:{ CR:'x-----------', GC:'x-----------' } } ] }),
morceau({ id:'m-la-grange', titre:'La Grange', artiste:'ZZ Top', annee:1973,
  niveau:4, style:'Blues', bpm:162, res:3,
  desc:"Un boogie qui démarre au charleston seul, puis un shuffle rapide avec le pied sur chaque temps.",
  astuce:"Rapide et ternaire : laisse les baguettes rebondir, ne force pas les triolets.",
  sections:[ { nom:'Intro (charleston)', fois:4, tracks:{ CH:'x-xx-xx-xx-x' } },
    { nom:'Boogie', fois:8, tracks:{ CH:'x-xx-xx-xx-x', CC:'---x-----x--', GC:'x--x--x--x--' } } ] }),
morceau({ id:'m-fly-me-to-the-moon', titre:'Fly Me to the Moon', artiste:'Frank Sinatra & Count Basie', annee:1964,
  niveau:4, style:'Jazz', bpm:120, res:3,
  desc:"Le swing d'un grand orchestre : ride « ding ding-ga », charleston au pied sur 2 et 4, grosse caisse effleurée.",
  astuce:"La ride mène tout. La grosse caisse sur les 4 temps doit être à peine audible.",
  sections:[ { nom:'Swing', fois:16, tracks:{ RD:'x--x-xx--x-x', HP:'---x-----x--', GC:'x--x--x--x--' } } ] })
);

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
