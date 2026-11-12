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
  desc:"Le fill d'entrée de Dave Grohl : deux flams, la grosse caisse qui se glisse entre, le charleston mi-ouvert sur 2, 3 et 4, et le « da-da-doum-doum » du temps 3 ; puis le riff sur la crash, un couplet « boum-boum-tchak », un refrain déchaîné.",
  astuce:"Le fill d'entrée se chante avant de se jouer : « PA… PA-da da-doum-doum PA doum ». Compte « 1 … 2 … a / e-et-a / 4-et » et commence à 70 BPM.",
  sections:[
    { nom:'Fill d\'entrée', fois:1, tracks:{ CH:'----o---o---o---', CC:'f---f--x-x--x---', GC:'---x----x-xx--x-' } },
    { nom:'Riff (crash)', fois:4, tracks:{ CR:'x---------------', CH:'--o-o-o-o-o-o-o-', CC:'----X-------X---', GC:'x-x-----x-x-----' } },
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
  niveau:5, style:'Pop rock', bpm:86, beats:4, res:3, fidelite:'origine',
  desc:"LE half-time shuffle de Jeff Porcaro : backbeat seulement sur le 3, ghost notes dans les triolets. Les bases de tempo le notent souvent 172 (pulsation à la croche) : à la noire, c'est 86.",
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

/* ======================= TROISIÈME SÉRIE =======================
 * Tempos de référence des enregistrements d'origine (bases de tempo publiques).
 * Mêmes conventions : groove d'accompagnement sauf mention 'origine'. */
const M16_ROCK = { CH:'x-x-x-x-x-x-x-x-', CC:'----x-------x---', GC:'x-----x-x-------' };   // le « rock 16 » le plus courant
const M_CRASH16 = t => ({ ...t, CR:'x' + SILENCE(15), CH:'-' + t.CH.slice(1) });
const QUATRE_SOL = { GC:'x-x-x-x-', CC:'--x---x-', CH:'-x-x-x-x' };                         // four on the floor électro

MORCEAUX.push(
/* ------------------------------ rock ------------------------------ */
morceau({ id:'m-sweet-dreams', titre:'Sweet Dreams (Are Made of This)', artiste:'Eurythmics', annee:1983,
  niveau:1, style:'Pop', bpm:125, res:2, fidelite:'origine',
  desc:"Une boîte à rythmes implacable : grosse caisse sur chaque temps, caisse claire sur 2 et 4, charleston en croches. Rien d'autre, du début à la fin.",
  astuce:"Le défi n'est pas la difficulté mais la régularité : joue-le comme une machine, sans accent, sans accélérer.",
  sections:[ { nom:'Groove', fois:16, tracks:{ GC:'x-x-x-x-', CC:'--x---x-', CH:'xxxxxxxx' } } ] }),
morceau({ id:'m-song-2', titre:'Song 2', artiste:'Blur', annee:1997,
  niveau:2, style:'Rock', bpm:130, res:2,
  desc:"Un couplet retenu au charleston, puis le « Woo-hoo ! » : crash sur chaque temps et grosse caisse qui pousse.",
  astuce:"Le refrain se joue fort mais court : deux minutes de morceau, pas une de plus. Garde les bras souples.",
  sections:[ { nom:'Couplet', fois:8, tracks:{ CH:'xxxxxxxx', CC:'--x---x-', GC:'x---x-x-' } },
    { nom:'Refrain « Woo-hoo »', fois:8, tracks:{ CR:'x-x-x-x-', CC:'--x---x-', GC:'x---x-x-' } } ] }),
morceau({ id:'m-creep', titre:'Creep', artiste:'Radiohead', annee:1993,
  niveau:2, style:'Rock', bpm:92, res:4,
  desc:"Un tempo lent et posé : couplet en croches au charleston, refrain qui s'ouvre sur la crash et la ride.",
  astuce:"Lent, donc exposé : chaque coup s'entend. Vise la justesse du placement plutôt que la puissance.",
  sections:[ { nom:'Couplet', fois:8, tracks:M16_ROCK },
    { nom:'Refrain', fois:8, tracks:{ CR:'x---------------', RD:'--x-x-x-x-x-x-x-', CC:'----X-------X---', GC:'x-----x-x-----x-' } } ] }),
morceau({ id:'m-satisfaction', titre:"(I Can't Get No) Satisfaction", artiste:'The Rolling Stones', annee:1965,
  niveau:2, style:'Rock', bpm:136, res:2,
  desc:"Charlie Watts, sobre et carré : un rock en croches qui ne bouge pas d'un cheveu, sous le riff le plus connu du monde.",
  astuce:"Le riff fait tout : la batterie reste derrière, simple et stable. Pas de fioriture.",
  sections:[ { nom:'Riff', fois:8, tracks:M8 }, { nom:'Refrain', fois:8, tracks:M8_4 },
    { nom:'Montée', fois:2, tracks:{ CC:'xxxxxxxx', GC:'x-x-x-x-' } } ] }),
morceau({ id:'m-start-me-up', titre:'Start Me Up', artiste:'The Rolling Stones', annee:1981,
  niveau:2, style:'Rock', bpm:122, res:2,
  desc:"Le riff démarre seul, la batterie répond par de grands coups de crash, puis un rock en croches bien assis.",
  astuce:"Les coups de crash de l'intro tombent avec la grosse caisse : un seul son, large. Compte les silences.",
  sections:[ { nom:'Intro (réponses)', fois:4, tracks:{ CR:'x-------', GC:'x-------' } },
    { nom:'Couplet', fois:8, tracks:M8 }, { nom:'Refrain', fois:8, tracks:M_CRASH8(M8_4) } ] }),
morceau({ id:'m-fortunate-son', titre:'Fortunate Son', artiste:'Creedence Clearwater Revival', annee:1969,
  niveau:2, style:'Rock', bpm:132, res:2,
  desc:"L'intro à la grosse caisse et au tom basse, puis un rock sans fioriture qui avance tout seul.",
  astuce:"Dans l'intro, grosse caisse et tom basse tombent ensemble : vise un seul coup, grave et sec.",
  sections:[ { nom:'Intro (tom basse)', fois:4, tracks:{ TB:'x-x-x-x-', GC:'x-x-x-x-' } },
    { nom:'Couplet', fois:8, tracks:{ CH:'xxxxxxxx', CC:'--x---x-', GC:'x--x--x-' } },
    { nom:'Refrain', fois:8, tracks:M_CRASH8({ CH:'xxxxxxxx', CC:'--x---x-', GC:'x--x--x-' }) } ] }),
morceau({ id:'m-in-the-end', titre:'In the End', artiste:'Linkin Park', annee:2000,
  niveau:2, style:'Rock', bpm:105, res:4,
  desc:"Un couplet hip-hop (caisse claire lourde, grosse caisse qui rebondit), un refrain rock qui s'ouvre sur la crash.",
  astuce:"Même tempo, deux énergies : joue le couplet en retrait, puis frappe franchement au refrain.",
  sections:[ { nom:'Couplet', fois:8, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----X-------X---', GC:'x-----x-x-------' } },
    { nom:'Refrain', fois:8, tracks:{ CR:'x---------------', CH:'--x-x-x-x-x-x-x-', CC:'----X-------X---', GC:'x-----x-x-x-----' } } ] }),
morceau({ id:'m-boulevard', titre:'Boulevard of Broken Dreams', artiste:'Green Day', annee:2004,
  niveau:2, style:'Rock', bpm:84, res:4,
  desc:"Un mid-tempo lourd : charleston en croches, grosse caisse qui relance sur la fin de mesure, refrain à la crash.",
  astuce:"Souvent noté 167 BPM : ici on le compte à 84, en doubles-croches, c'est le même morceau.",
  sections:[ { nom:'Couplet', fois:8, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----x-------x---', GC:'x-------x-x-----' } },
    { nom:'Refrain', fois:8, tracks:{ CR:'x-------x-------', CH:'--x-x-x---x-x-x-', CC:'----X-------X---', GC:'x-----x-x-x-----' } } ] }),
morceau({ id:'m-radioactive', titre:'Radioactive', artiste:'Imagine Dragons', annee:2012,
  niveau:2, style:'Rock', bpm:136, res:2,
  desc:"Un half-time géant : caisse claire seulement sur le 3, grosse caisse énorme. Peu de notes, beaucoup de son.",
  astuce:"Frappe la caisse claire au centre, avec tout le bras : c'est le seul coup de la mesure, il doit peser.",
  sections:[ { nom:'Couplet', fois:8, tracks:{ CH:'xxxxxxxx', CC:'----X---', GC:'x-----x-' } },
    { nom:'Refrain', fois:8, tracks:{ CR:'x---x---', CC:'----X---', GC:'x-x---x-' } } ] }),
morceau({ id:'m-viva-la-vida', titre:'Viva la Vida', artiste:'Coldplay', annee:2008,
  niveau:2, style:'Pop rock', bpm:138, res:2,
  desc:"Pas de charleston : une grosse caisse qui marche sur les quatre temps comme une timbale, et le tom basse qui répond.",
  astuce:"Le pied est une marche, pas une course : chaque coup identique, du premier au dernier.",
  sections:[ { nom:'Couplet', fois:8, tracks:{ GC:'x-x-x-x-', TB:'--x---x-' } },
    { nom:'Refrain', fois:8, tracks:{ CR:'x-------', GC:'x-x-x-x-', CC:'--x---x-', TB:'------x-' } } ] }),
morceau({ id:'m-hotel-california', titre:'Hotel California', artiste:'Eagles', annee:1977,
  niveau:3, style:'Rock', bpm:74, res:4,
  desc:"Un tempo très lent, une grosse caisse qui se glisse avant le 1 : tout le charme du groove de Don Henley.",
  astuce:"Le coup de pied sur le « a » du 4 prépare le 1 suivant : il doit être léger, presque une anacrouse.",
  sections:[ { nom:'Couplet', fois:8, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----x-------x---', GC:'x-----x-x-----x-' } },
    { nom:'Refrain', fois:8, tracks:{ RD:'x-x-x-x-x-x-x-x-', CC:'----X-------X---', GC:'x-----x-x-----x-' } } ] }),
morceau({ id:'m-come-together', titre:'Come Together', artiste:'The Beatles', annee:1969,
  niveau:3, style:'Rock', bpm:82, res:4,
  desc:"Le groove de Ringo : un charleston qui chuchote, puis le petit roulement de toms « ba-doum-doum » qui répond au « shoot me ».",
  astuce:"Les toms se jouent doucement, comme une phrase parlée : c'est un motif, pas un fill.",
  sections:[ { nom:'Groove', fois:8, tracks:{ CH:'x-x-x-x---------', T1:'----------xx----', T2:'------------x-x-', GC:'x-------x-------' } },
    { nom:'Refrain', fois:4, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----X-------X---', GC:'x-------x-x-----' } } ] }),
morceau({ id:'m-believer', titre:'Believer', artiste:'Imagine Dragons', annee:2017,
  niveau:3, style:'Pop rock', bpm:125, res:4,
  desc:"Des toms qui martèlent comme des percussions de stade, et un refrain où la caisse claire claque à l'unisson des toms.",
  astuce:"Alterne droite sur le tom basse et gauche sur le tom 1 : les deux doivent sonner aussi fort.",
  sections:[ { nom:'Couplet (toms)', fois:8, tracks:{ TB:'x-x-----x-x-----', T1:'----x-------x---', GC:'x-x-----x-x-----' } },
    { nom:'Refrain', fois:8, tracks:{ CR:'x---------------', CH:'--x-x-x-x-x-x-x-', CC:'----X-------X---', TB:'----x-------x---', GC:'x-x-----x-x-----' } } ] }),
morceau({ id:'m-immigrant-song', titre:'Immigrant Song', artiste:'Led Zeppelin', annee:1970,
  niveau:4, style:'Hard rock', bpm:112, res:4,
  desc:"Le galop du riff au pied : Bonham colle la grosse caisse au « da-da-DAM » de la guitare, charleston et caisse claire par-dessus.",
  astuce:"Chante le riff en jouant le pied seul, puis ajoute les mains. Le galop ne doit jamais traîner.",
  sections:[ { nom:'Riff', fois:8, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----X-------X---', GC:'x--xx---x--xx---' } },
    { nom:'Couplet', fois:8, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----X-------X---', GC:'x-------x-x-----' } } ] }),
morceau({ id:'m-wipe-out', titre:'Wipe Out', artiste:'The Surfaris', annee:1963,
  niveau:4, style:'Rock\'n\'roll', bpm:160, res:4, fidelite:'origine',
  desc:"LE solo de batterie que tout le monde a essayé : des doubles-croches à la caisse claire, un accent sur chaque temps, puis le même roulement qui descend sur les toms.",
  astuce:"Commence à 90 BPM avec le tempo progressif. Mains alternées D-G-D-G, les accents tombent toujours sur la main droite.",
  sections:[ { nom:'Groove surf', fois:4, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----x-------x---', GC:'x---x---x---x---' } },
    { nom:'Roulement', fois:3, tracks:{ CC:'XxxxXxxxXxxxXxxx', GC:'x---x---x---x---' } },
    { nom:'Roulement sur les toms', fois:1, tracks:{ CC:'XxxxXxxx--------', T1:'--------Xxxx----', TB:'------------Xxxx', GC:'x---x---x---x---' } },
    { nom:'Groove surf (crash)', fois:4, tracks:{ CR:'x---------------', CH:'--x-x-x-x-x-x-x-', CC:'----x-------x---', GC:'x---x---x---x---' } } ] }),

/* ------------------------- hard rock & métal ------------------------- */
morceau({ id:'m-iron-man', titre:'Iron Man', artiste:'Black Sabbath', annee:1970,
  niveau:2, style:'Hard rock', bpm:76, res:4,
  desc:"Le riff le plus lourd des années 70, à un tempo de géant qui marche : la grosse caisse suit les pas du riff.",
  astuce:"À 76 BPM, chaque coup doit être énorme et parfaitement en place : pense « lourd », pas « lent ».",
  sections:[ { nom:'Riff', fois:8, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----X-------X---', GC:'x---x---x-x-x---' } },
    { nom:'Couplet', fois:8, tracks:{ RD:'x-x-x-x-x-x-x-x-', CC:'----X-------X---', GC:'x-------x-x-----' } } ] }),
morceau({ id:'m-rock-you-hurricane', titre:'Rock You Like a Hurricane', artiste:'Scorpions', annee:1984,
  niveau:2, style:'Hard rock', bpm:126, res:2,
  desc:"Le hard rock des stades : un rock en croches carré au couplet, la crash et la grosse caisse sur tous les temps au refrain.",
  astuce:"Au refrain, la crash se joue sur le bord, en frappe glissée : sinon elle couvre tout.",
  sections:[ { nom:'Couplet', fois:8, tracks:M8 }, { nom:'Refrain', fois:8, tracks:M_CRASH8(M8_4) } ] }),
morceau({ id:'m-du-hast', titre:'Du Hast', artiste:'Rammstein', annee:1997,
  niveau:2, style:'Métal', bpm:128, res:2,
  desc:"Du métal industriel : grosse caisse sur chaque temps comme une machine, caisse claire qui claque, refrain à la ride.",
  astuce:"Le groove doit être mécanique : aucune variation de volume, aucun rubato. Joue avec le métronome fort.",
  sections:[ { nom:'Couplet', fois:8, tracks:{ CH:'xxxxxxxx', CC:'--X---X-', GC:'x-x-x-x-' } },
    { nom:'Refrain', fois:8, tracks:{ RD:'xxxxxxxx', CC:'--X---X-', GC:'x-x-x-x-' } },
    { nom:'Arrêt', fois:1, tracks:{ CR:'x---x---', GC:'x---x---' } } ] }),
morceau({ id:'m-whole-lotta-love', titre:'Whole Lotta Love', artiste:'Led Zeppelin', annee:1969,
  niveau:3, style:'Hard rock', bpm:90, res:4,
  desc:"Le riff en « da-da-DAM » et la batterie qui l'appuie : grosse caisse collée à la guitare, caisse claire qui claque sur 2 et 4.",
  astuce:"Bonham joue fort mais détendu : la puissance vient de la vitesse de la baguette, pas de la crispation.",
  sections:[ { nom:'Riff', fois:8, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----X-------X---', GC:'x--x----x--x----' } },
    { nom:'Refrain', fois:8, tracks:{ CR:'x---------------', RD:'--x-x-x-x-x-x-x-', CC:'----X-------X---', GC:'x--x----x--x--x-' } } ] }),
morceau({ id:'m-sad-but-true', titre:'Sad but True', artiste:'Metallica', annee:1991,
  niveau:3, style:'Métal', bpm:90, res:4,
  desc:"Le métal au ralenti : un groove massif à 90 BPM, avec des doublés de grosse caisse qui suivent le riff accordé bas.",
  astuce:"Les deux coups de pied rapprochés se jouent talon levé, en « glissé » : le premier léger, le second franc.",
  sections:[ { nom:'Riff', fois:8, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----X-------X---', GC:'x-----xxx-----x-' } },
    { nom:'Refrain', fois:8, tracks:{ CR:'x-------x-------', CC:'----X-------X---', GC:'x-----xxx-----xx' } } ] }),
morceau({ id:'m-ace-of-spades', titre:'Ace of Spades', artiste:'Motörhead', annee:1980,
  niveau:4, style:'Métal', bpm:140, res:2,
  desc:"La grosse caisse en croches continues sous un rock à toute allure : le « double pied » de Philthy Animal Taylor, avec un seul pied.",
  astuce:"Les croches au pied se jouent talon levé, cheville souple. Si ça se crispe, redescends à 100 BPM.",
  sections:[ { nom:'Couplet', fois:8, tracks:{ CH:'xxxxxxxx', CC:'--X---X-', GC:'xxxxxxxx' } },
    { nom:'Refrain', fois:8, tracks:{ CR:'x---x---', CH:'-xxx-xxx', CC:'--X---X-', GC:'xxxxxxxx' } } ] }),

/* ------------------------------ pop ------------------------------ */
morceau({ id:'m-dancing-queen', titre:'Dancing Queen', artiste:'ABBA', annee:1976,
  niveau:2, style:'Pop', bpm:101, res:4,
  desc:"Une pop disco à tempo moyen : grosse caisse chaloupée, charleston qui s'ouvre au refrain.",
  astuce:"Souple et léger : le morceau est une danse, pas une marche.",
  sections:[ { nom:'Couplet', fois:8, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----x-------x---', GC:'x-----x-x-----x-' } },
    { nom:'Refrain', fois:8, tracks:{ CH:'x-o-x-o-x-o-x-o-', CC:'----x-------x---', GC:'x---x---x---x---' } } ] }),
morceau({ id:'m-somebody', titre:'Somebody That I Used to Know', artiste:'Gotye', annee:2011,
  niveau:2, style:'Pop', bpm:129, res:2,
  desc:"Un groove minimaliste : grosse caisse qui rebondit, caisse claire sèche (en cross-stick sur le disque), charleston discret.",
  astuce:"Joue la caisse claire tout doucement, en posant la baguette : le morceau est feutré jusqu'au refrain.",
  sections:[ { nom:'Couplet', fois:8, tracks:{ CH:'xxxxxxxx', CC:'--x---x-', GC:'x--x-x--' } },
    { nom:'Refrain', fois:8, tracks:{ CH:'xxxxxxxx', CC:'--X---X-', GC:'x--xx-x-' } } ] }),
morceau({ id:'m-shape-of-you', titre:'Shape of You', artiste:'Ed Sheeran', annee:2017,
  niveau:2, style:'Pop', bpm:96, res:4,
  desc:"Le rythme « tresillo » (3-3-2) à la grosse caisse, hérité du dancehall, sous une caisse claire sur 2 et 4.",
  astuce:"Compte « 1 . . 2 . . 3 . » pour le pied : trois, trois, deux. Le reste suit.",
  sections:[ { nom:'Groove', fois:16, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----x-------x---', GC:'x--x--x-x--x--x-' } } ] }),
morceau({ id:'m-take-on-me', titre:'Take On Me', artiste:'a-ha', annee:1985,
  niveau:3, style:'Pop', bpm:169, res:2,
  desc:"Une boîte à rythmes des années 80 à toute vitesse : grosse caisse sur les temps, charleston sur les contretemps.",
  astuce:"À 169 BPM, ne cherche pas la force : des petits gestes, une cheville légère. Pense-le à 85 si besoin.",
  sections:[ { nom:'Couplet', fois:8, tracks:QUATRE_SOL }, { nom:'Refrain', fois:8, tracks:{ ...QUATRE_SOL, CH:'-o-o-o-o' } } ] }),

/* ------------------------ funk, soul, disco ------------------------ */
morceau({ id:'m-respect', titre:'Respect', artiste:'Aretha Franklin', annee:1967,
  niveau:2, style:'Soul', bpm:115, res:2,
  desc:"La soul de Muscle Shoals : un backbeat qui claque, une grosse caisse qui pousse sur le « et » du 2.",
  astuce:"Caisse claire bien au centre, baguette à plat : c'est le son « rimshot » de la soul.",
  sections:[ { nom:'Couplet', fois:8, tracks:{ CH:'xxxxxxxx', CC:'--X---X-', GC:'x--xx---' } },
    { nom:'Refrain (R-E-S-P-E-C-T)', fois:8, tracks:{ CH:'xxxxxxxx', CC:'--X---X-', GC:'x--xx-x-' } } ] }),
morceau({ id:'m-play-that-funky-music', titre:'Play That Funky Music', artiste:'Wild Cherry', annee:1976,
  niveau:3, style:'Funk', bpm:109, res:4,
  desc:"Du funk blanc des années 70 : grosse caisse syncopée, ouverture de charleston en fin de mesure, backbeat lourd.",
  astuce:"L'ouverture du charleston sur le « et » du 4 relance la mesure suivante : ferme-la pile sur le 1.",
  sections:[ { nom:'Couplet', fois:8, tracks:{ CH:'x-x-x-x-x-x-x-o-', CC:'----X-------X---', GC:'x--x--x-x-----x-' } },
    { nom:'Refrain', fois:8, tracks:{ CH:'x-x-x-x-x-x-x-o-', CC:'----X--g----X---', GC:'x--x--x-x--x--x-' } } ] }),
morceau({ id:'m-good-times', titre:'Good Times', artiste:'Chic', annee:1979,
  niveau:3, style:'Disco', bpm:110, res:4,
  desc:"Le disco de Tony Thompson, samplé par le hip-hop entier : grosse caisse sur chaque temps, charleston ouvert sur les « et ».",
  astuce:"L'ouverture est brève et égale à chaque fois : pied gauche souple, qui referme sur le temps.",
  sections:[ { nom:'Groove', fois:16, tracks:{ CH:'x-o-x-o-x-o-x-o-', CC:'----X-------X---', GC:'x---x---x---x---' } },
    { nom:'Break (pied seul)', fois:2, tracks:{ GC:'x---x---x---x---' } } ] }),
morceau({ id:'m-amen-brother', titre:'Amen, Brother', artiste:'The Winstons', annee:1969,
  niveau:4, style:'Soul', bpm:136, res:4, fidelite:'origine',
  desc:"Le « Amen break » de G. C. Coleman : quatre mesures de batterie seule, les plus samplées de l'histoire (hip-hop, jungle, drum'n'bass). Ride en croches, ghost notes, caisse claire décalée sur la fin.",
  astuce:"Les deux premières mesures sont identiques ; la 3e déplace la dernière caisse claire, la 4e démarre par la crash. Travaille d'abord à 90 BPM.",
  sections:[
    { nom:'Mesures 1-2', fois:2, tracks:{ RD:'x-x-x-x-x-x-x-x-', CC:'----X--g-g--X--g', GC:'x-x-------xx----' } },
    { nom:'Mesure 3', fois:1, tracks:{ RD:'x-x-x-x-x-x-x-x-', CC:'----X--g-g----X-', GC:'x-x-------xx----' } },
    { nom:'Mesure 4', fois:1, tracks:{ CR:'--x-------------', RD:'x-x---x-x-x-x-x-', CC:'----X--g-g----X-', GC:'--x-------xx----' } },
    { nom:'Le break entier', fois:1, bars:4, tracks:{
        CR:SILENCE(48)+'--x-------------',
        RD:'x-x-x-x-x-x-x-x-'+'x-x-x-x-x-x-x-x-'+'x-x-x-x-x-x-x-x-'+'x-x---x-x-x-x-x-',
        CC:'----X--g-g--X--g'+'----X--g-g--X--g'+'----X--g-g----X-'+'----X--g-g----X-',
        GC:'x-x-------xx----'+'x-x-------xx----'+'x-x-------xx----'+'--x-------xx----' } } ] }),
morceau({ id:'m-funky-drummer', titre:'Funky Drummer', artiste:'James Brown', annee:1970,
  niveau:5, style:'Funk', bpm:101, res:4, fidelite:'origine',
  desc:"Le break de Clyde Stubblefield, l'un des plus samplés au monde : charleston en croches avec une ouverture, caisse claire pleine de ghost notes, grosse caisse syncopée.",
  astuce:"Le secret est dans les nuances : accents sur 2 et 4 à 100 %, ghost notes à 20 %. Travaille mains seules, puis ajoute le pied.",
  sections:[ { nom:'Groove', fois:8, tracks:{ CH:'x-x-x-x-x-x-x-o-', CC:'----X--g-g--X--g', GC:'x-----x-x-x-----' } },
    { nom:'Le break (batterie seule)', fois:8, tracks:{ CH:'x-x-x-x-x-x-x-o-', CC:'----X--g-g--X-gg', GC:'x-----x-x-x-----' } } ] }),
morceau({ id:'m-cissy-strut', titre:'Cissy Strut', artiste:'The Meters', annee:1969,
  niveau:4, style:'Funk', bpm:90, res:4,
  desc:"Le funk de La Nouvelle-Orléans, Zigaboo Modeliste aux baguettes : une grosse caisse qui parle, une caisse claire qui répond à côté des temps.",
  astuce:"Rien n'est martelé : tout se joue en retenue, légèrement en arrière du temps. Écoute le disque avant de jouer.",
  sections:[ { nom:'Thème', fois:8, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----X--x----X-x-', GC:'x--x--x---x-----' } },
    { nom:'Solo de guitare', fois:8, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----X-g-g---X--g', GC:'x--x--x-x-x-----' } } ] }),
morceau({ id:'m-chameleon', titre:'Chameleon', artiste:'Herbie Hancock', annee:1973,
  niveau:4, style:'Funk', bpm:94, res:4,
  desc:"Le jazz-funk des Headhunters : charleston en doubles-croches, grosse caisse qui colle à la basse, ghost notes sous le backbeat.",
  astuce:"Les doubles au charleston se jouent d'une main, légères ; les accents sur les temps viennent du poignet.",
  sections:[ { nom:'Riff de basse', fois:8, tracks:{ CH:'X-x-X-x-X-x-X-x-', CC:'----X-------X---', GC:'x--x--x---x--x--' } },
    { nom:'Thème', fois:8, tracks:{ CH:'XxxxXxxxXxxxXxxx', CC:'----X--g-g--X--g', GC:'x--x--x---x--x--' } } ] }),

/* ----------------------- hip-hop & électro ----------------------- */
morceau({ id:'m-sandstorm', titre:'Sandstorm', artiste:'Darude', annee:1999,
  niveau:1, style:'Électro', bpm:136, res:2,
  desc:"La trance des années 2000 : grosse caisse sur chaque temps, charleston ouvert entre, et un pont où il ne reste que le pied.",
  astuce:"Le charleston ouvert fait « tsss » exactement entre deux coups de pied : écoute le balancier.",
  sections:[ { nom:'Boucle', fois:8, tracks:{ GC:'x-x-x-x-', CC:'--x---x-', CH:'-o-o-o-o' } },
    { nom:'Pont (pied seul)', fois:4, tracks:{ GC:'x-x-x-x-' } },
    { nom:'Montée', fois:2, tracks:{ CC:'xxxxxxxx', GC:'x-x-x-x-' } } ] }),
morceau({ id:'m-levels', titre:'Levels', artiste:'Avicii', annee:2011,
  niveau:1, style:'Électro', bpm:126, res:2,
  desc:"La house de festival : four on the floor, montée à la caisse claire, et le « drop » où tout repart.",
  astuce:"Pendant la montée, le crescendo se fait au volume, jamais au tempo : le métronome garde raison.",
  sections:[ { nom:'Couplet', fois:8, tracks:QUATRE_SOL },
    { nom:'Montée', fois:2, tracks:{ CC:'xxxxxxxx' } },
    { nom:'Drop', fois:8, tracks:{ ...QUATRE_SOL, CH:'-o-o-o-o', CR:'x-------' } } ] }),
morceau({ id:'m-gangstas-paradise', titre:"Gangsta's Paradise", artiste:'Coolio', annee:1995,
  niveau:2, style:'Hip-hop', bpm:80, res:4,
  desc:"Un hip-hop lent et sombre : caisse claire lourde sur 2 et 4, grosse caisse qui pousse sur la fin de mesure.",
  astuce:"Le tempo est lent : résiste à l'envie d'accélérer, laisse chaque temps s'installer.",
  sections:[ { nom:'Groove', fois:16, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----X-------X---', GC:'x--x----x-x-----' } } ] }),
morceau({ id:'m-still-dre', titre:'Still D.R.E.', artiste:'Dr. Dre feat. Snoop Dogg', annee:1999,
  niveau:2, style:'Hip-hop', bpm:93, res:4,
  desc:"Le G-funk : un beat sec, grosse caisse en « 1 … a … et » sous le piano le plus célèbre du rap.",
  astuce:"Joue en retrait, derrière le temps : la caisse claire tombe une fraction de seconde après le clic.",
  sections:[ { nom:'Groove', fois:16, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----X-------X---', GC:'x--x----x--x----' } } ] }),

/* ------------------------- variété française ------------------------- */
morceau({ id:'m-le-vent', titre:'Le vent nous portera', artiste:'Noir Désir', annee:2001,
  niveau:2, style:'Variété', bpm:108, res:4,
  desc:"Un groove rock souple et tranquille, qui avance sans jamais forcer, sous la guitare de Manu Chao.",
  astuce:"Charleston doux, caisse claire ronde : la chanson est une balade, la batterie marche à côté.",
  sections:[ { nom:'Couplet', fois:8, tracks:M16_ROCK },
    { nom:'Refrain', fois:8, tracks:{ RD:'x-x-x-x-x-x-x-x-', CC:'----x-------x---', GC:'x-----x-x-----x-' } } ] }),
morceau({ id:'m-desenchantee', titre:'Désenchantée', artiste:'Mylène Farmer', annee:1991,
  niveau:2, style:'Variété', bpm:127, res:2,
  desc:"La dance française des années 90 : grosse caisse sur chaque temps, charleston qui s'ouvre au refrain.",
  astuce:"Les ouvertures du refrain sont courtes et régulières : comme un « tsss » à chaque contretemps.",
  sections:[ { nom:'Couplet', fois:8, tracks:QUATRE_SOL }, { nom:'Refrain', fois:8, tracks:{ ...QUATRE_SOL, CH:'-o-o-o-o' } } ] }),
morceau({ id:'m-djadja', titre:'Djadja', artiste:'Aya Nakamura', annee:2018,
  niveau:2, style:'Variété', bpm:100, res:4,
  desc:"L'afro-pop : une grosse caisse en 3-3-2 qui fait danser, caisse claire sur 2 et 4, charleston léger.",
  astuce:"Le pied joue le « tresillo » : 1, le « a » du 1, le « et » du 2… Chante-le avant de le jouer.",
  sections:[ { nom:'Groove', fois:16, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----x-------x---', GC:'x--x--x---x--x--' } } ] }),

/* -------------------------- reggae & latino -------------------------- */
morceau({ id:'m-three-little-birds', titre:'Three Little Birds', artiste:'Bob Marley & The Wailers', annee:1977,
  niveau:2, style:'Reggae', bpm:74, res:4,
  desc:"Le one drop le plus doux qui soit : rien sur le 1, grosse caisse et caisse claire ensemble sur le 3.",
  astuce:"Le vide sur le 1 déstabilise au début : compte « UN » à voix haute sans rien jouer.",
  sections:[ { nom:'One drop', fois:16, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'--------X-------', GC:'--------x-------' } } ] }),
morceau({ id:'m-no-woman-no-cry', titre:'No Woman, No Cry', artiste:'Bob Marley & The Wailers', annee:1975,
  niveau:3, style:'Reggae', bpm:78, res:4,
  desc:"Le one drop de Carlton Barrett, avec le charleston qui s'ouvre avant le 3 et de petites relances à la caisse claire.",
  astuce:"L'ouverture du charleston juste avant le 3 est la signature du reggae : courte, et refermée sur le coup.",
  sections:[ { nom:'Couplet', fois:8, tracks:{ CH:'x-x-x-o-x-x-x-x-', CC:'--------X-------', GC:'--------x-------' } },
    { nom:'Refrain', fois:8, tracks:{ CH:'x-x-x-o-x-x-x-o-', CC:'--------X-----x-', GC:'--------x-------' } } ] }),
morceau({ id:'m-gasolina', titre:'Gasolina', artiste:'Daddy Yankee', annee:2004,
  niveau:2, style:'Latin', bpm:96, res:4,
  desc:"Le reggaeton qui a tout lancé : grosse caisse sur les quatre temps, caisse claire « dembow » qui boite.",
  astuce:"Compte « 1 e et A 2 e ET a » : la caisse claire tombe sur le A puis sur le ET, toujours au même endroit.",
  sections:[ { nom:'Dembow', fois:16, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'---x--x----x--x-', GC:'x---x---x---x---' } } ] }),
morceau({ id:'m-girl-from-ipanema', titre:'The Girl from Ipanema', artiste:'Stan Getz & João Gilberto', annee:1964,
  niveau:4, style:'Latin', bpm:130, res:2,
  desc:"La bossa nova : charleston en croches, grosse caisse « 1 . . a 2 . 3 . . a 4 », et la clave jouée en cross-stick sur deux mesures.",
  astuce:"Tout est léger : la bossa se murmure. La clave au cross-stick se pose, elle ne se frappe pas.",
  sections:[ { nom:'Bossa', fois:8, bars:2, tracks:{ CH:'xxxxxxxx'+'xxxxxxxx', CC:'x--x--x-'+'-x--x---', GC:'x--xx--x'+'x--xx--x' } } ] }),

/* --------------------------- blues & jazz --------------------------- */
morceau({ id:'m-thrill-is-gone', titre:'The Thrill Is Gone', artiste:'B.B. King', annee:1969,
  niveau:3, style:'Blues', bpm:90, res:4,
  desc:"Un blues mineur en binaire, lent et élégant : grosse caisse qui pousse sur le « a » du 1, caisse claire ronde.",
  astuce:"Le blues lent se joue avec les épaules basses : chaque coup est posé, jamais lancé.",
  sections:[ { nom:'Couplet', fois:12, tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----X-------X---', GC:'x--x----x-x-----' } },
    { nom:'Solo (ride)', fois:12, tracks:{ RD:'x-x-x-x-x-x-x-x-', CC:'----X-------X---', GC:'x--x----x-x-----' } } ] }),
morceau({ id:'m-sing-sing-sing', titre:'Sing, Sing, Sing', artiste:'Benny Goodman', annee:1937,
  niveau:4, style:'Jazz', bpm:110, res:3, fidelite:'origine',
  desc:"Gene Krupa, le premier batteur star : le rythme de swing joué au tom basse, grosse caisse sur les quatre temps, qui ouvre et porte tout le morceau.",
  astuce:"Le motif « doum … doum-da-doum » est celui de la ride, descendu sur le tom basse. Frappe au centre, bras souple.",
  sections:[ { nom:'Intro (tom basse)', fois:8, tracks:{ TB:'x--x-xx--x-x', GC:'x--x--x--x--' } },
    { nom:'Thème', fois:8, tracks:{ TB:'x--x-xx--x-x', CC:'---x-----x--', GC:'x--x--x--x--', HP:'---x-----x--' } } ] }),
morceau({ id:'m-so-what', titre:'So What', artiste:'Miles Davis', annee:1959,
  niveau:4, style:'Jazz', bpm:136, res:3,
  desc:"Le swing médium de Jimmy Cobb sur « Kind of Blue » : ride qui chante, charleston au pied sur 2 et 4, grosse caisse effleurée.",
  astuce:"La ride mène. La caisse claire ne fait que ponctuer, très doucement, comme une conversation.",
  sections:[ { nom:'Thème', fois:8, tracks:{ RD:'x--x-xx--x-x', HP:'---x-----x--', GC:'x--x--x--x--' } },
    { nom:'Solo (comping)', fois:8, tracks:{ RD:'x--x-xx--x-x', HP:'---x-----x--', CC:'-----g----g-', GC:'x--x--x--x--' } } ] })
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
