/* Bibliothèque de rythmes.
 * Notation des pistes :  x frappe | X accent | g ghost note | o charleston ouvert
 *                        f flam   | - silence      (les | et espaces sont ignorés)
 * res = nombre de pas par temps (1 = noires, 2 = croches, 3 = triolets, 4 = doubles-croches)
 */

const R = (n, c = '-') => c.repeat(n);

/* ============================ RYTHMES CONNUS ============================ */
export const GROOVES = [
  {
    id:'rock-noires', nom:'Rock très lent (noires)', style:'Rock', niveau:1,
    bpm:[50,70,110], beats:4, res:1, bars:1,
    tracks:{ CH:'xxxx', CC:'-x-x', GC:'x-x-' },
    desc:"Le tout premier groove : une frappe par temps au charleston, grosse caisse sur 1 et 3, caisse claire sur 2 et 4.",
    astuce:"Compte à voix haute « 1 – 2 – 3 – 4 » en jouant. Si tu perds le fil, ralentis encore."
  },
  {
    id:'rock-8', nom:'Rock 8 temps (le groove de base)', style:'Rock', niveau:2,
    bpm:[60,90,160], beats:4, res:2, bars:1,
    tracks:{ CH:'xxxxxxxx', CC:'--x---x-', GC:'x---x---' },
    desc:"LE rythme le plus joué au monde : croches au charleston, grosse caisse sur 1 et 3, caisse claire sur 2 et 4.",
    astuce:"Charleston régulier comme une horloge. La caisse claire tombe pile avec la 3e et la 7e croche."
  },
  {
    id:'rock-8-var', nom:'Rock 8 temps — variante grosse caisse', style:'Rock', niveau:2,
    bpm:[60,90,150], beats:4, res:2, bars:1,
    tracks:{ CH:'xxxxxxxx', CC:'--x---x-', GC:'x--xx---' },
    desc:"Même base, mais la grosse caisse joue aussi sur le « et » du 2 : ça pousse le groove vers l'avant.",
    astuce:"Travaille d'abord grosse caisse + charleston seuls, la caisse claire vient après."
  },
  {
    id:'rock-16', nom:'Rock 16 temps', style:'Rock', niveau:3,
    bpm:[55,80,120], beats:4, res:4, bars:1,
    tracks:{ CH:'xxxxxxxxxxxxxxxx', CC:'----x-------x---', GC:'x-------x-x-----' },
    desc:"Charleston en doubles-croches : un son plus dense, très utilisé en pop et en rock lent.",
    astuce:"Une seule main au charleston au début. Si c'est trop rapide, joue les deux mains en alternance."
  },
  {
    id:'stade', nom:'Rythme de stade (boum – boum – tchak)', style:'Rock', niveau:1,
    bpm:[60,84,120], beats:4, res:2, bars:1,
    tracks:{ GC:'x-x-----', CC:'----X---' },
    desc:"Deux coups de grosse caisse, un coup de caisse claire. Tout le monde le reconnaît en une seconde.",
    astuce:"Aucun charleston : concentre-toi sur la puissance et la régularité."
  },
  {
    id:'four-floor', nom:'Four on the floor (disco / house)', style:'Disco', niveau:2,
    bpm:[100,120,132], beats:4, res:2, bars:1,
    tracks:{ CH:'x-o-x-o-', CC:'--x---x-', GC:'x-x-x-x-' },
    desc:"Grosse caisse sur les 4 temps, charleston ouvert sur les contretemps : le rythme des pistes de danse.",
    astuce:"Le charleston s'ouvre juste après le pied, et se referme sur le temps suivant."
  },
  {
    id:'motown', nom:'Motown / soul', style:'Soul', niveau:3,
    bpm:[80,104,140], beats:4, res:4, bars:1,
    tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----X---g---X---', GC:'x-----x---x-----' },
    desc:"Backbeat très marqué, une petite ghost note qui remplit, grosse caisse chaloupée.",
    astuce:"Les ghost notes se jouent très doucement : la baguette rebondit à 1 cm de la peau."
  },
  {
    id:'funk', nom:'Funk classique', style:'Funk', niveau:4,
    bpm:[70,96,120], beats:4, res:4, bars:1,
    tracks:{ CH:'xxxxxxxxxxxxxxxx', CC:'--g-X--g-g-gX--g', GC:'x--x------x---x-' },
    desc:"Le groove funk : charleston en doubles-croches, ghost notes partout, grosse caisse syncopée.",
    astuce:"Commence à 60 BPM. Les accents (>) sur 2 et 4 doivent rester nettement plus forts que les ghosts."
  },
  {
    id:'boom-bap', nom:'Hip-hop boom bap', style:'Hip-hop', niveau:3,
    bpm:[70,88,104], beats:4, res:4, bars:1,
    tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----X-------X---', GC:'x-----x---x-----' },
    desc:"Tempo lent, caisse claire lourde, grosse caisse qui rebondit : la base du hip-hop.",
    astuce:"Joue légèrement « en retard » sur la caisse claire pour un feeling paresseux."
  },
  {
    id:'bo-diddley', nom:'Bo Diddley (clave 3-2)', style:'Rock', niveau:4,
    bpm:[80,110,150], beats:4, res:4, bars:2,
    tracks:{
      CH:'x-x-x-x-x-x-x-x-' + 'x-x-x-x-x-x-x-x-',
      CC:'X--X--X---------' + '----X---X-------',
      GC:'x-------x-------' + 'x-------x-------'
    },
    desc:"Le rythme « shave and a haircut » repris par des centaines de morceaux rock.",
    astuce:"Chante « bou-dou-dou … dou-dou » : la première mesure a 3 coups, la seconde 2."
  },
  {
    id:'shuffle', nom:'Shuffle blues', style:'Blues', niveau:4,
    bpm:[60,88,130], beats:4, res:3, bars:1,
    tracks:{ CH:'x-xx-xx-xx-x', CC:'---x-----x--', GC:'x-----x-----' },
    desc:"Le balancement ternaire du blues : on joue la 1re et la 3e croche de chaque triolet.",
    astuce:"Chante « ta – ta-ta » sur chaque temps. Le charleston fait « tchi-ka tchi-ka »."
  },
  {
    id:'half-shuffle', nom:'Half-time shuffle', style:'Blues/Rock', niveau:5,
    bpm:[60,84,110], beats:4, res:3, bars:1,
    tracks:{ CH:'x-xx-xx-xx-x', CC:'-g--g-X---g-', GC:'x-------x---' },
    desc:"Un shuffle avec la caisse claire seulement sur le 3 : c'est le groove de « Rosanna » ou « Fool in the Rain ».",
    astuce:"Très difficile : isole d'abord charleston + caisse claire accentuée, ajoute les ghosts ensuite."
  },
  {
    id:'reggae-one-drop', nom:'Reggae one drop', style:'Reggae', niveau:3,
    bpm:[60,76,100], beats:4, res:4, bars:1,
    tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'--------X-------', GC:'--------x-------' },
    desc:"Rien sur le 1 ! Grosse caisse et caisse claire tombent ensemble sur le 3.",
    astuce:"Le vide sur le temps 1 fait tout le charme. Compte bien pour ne pas se perdre."
  },
  {
    id:'reggae-steppers', nom:'Reggae steppers', style:'Reggae', niveau:3,
    bpm:[60,80,110], beats:4, res:4, bars:1,
    tracks:{ CH:'x-o-x-o-x-o-x-o-', CC:'--------X-------', GC:'x---x---x---x---' },
    desc:"Grosse caisse sur les 4 temps (« steppers »), charleston ouvert sur les contretemps.",
    astuce:"Garde le pied gauche du charleston bien fermé entre les ouvertures."
  },
  {
    id:'ska', nom:'Ska / rocksteady', style:'Ska', niveau:3,
    bpm:[110,150,200], beats:4, res:2, bars:1,
    tracks:{ CH:'xXxXxXxX', CC:'--x---x-', GC:'x---x---' },
    desc:"Un rock rapide avec les contretemps accentués au charleston.",
    astuce:"Accentue les croches « et » : ce sont elles qui donnent le rebond du ska."
  },
  {
    id:'bossa', nom:'Bossa nova', style:'Latin', niveau:4,
    bpm:[100,132,170], beats:4, res:4, bars:2,
    tracks:{
      CH:'x-x-x-x-x-x-x-x-' + 'x-x-x-x-x-x-x-x-',
      CC:'x--x--x---------' + '----x-----x-----',
      GC:'x-----x-x-----x-' + 'x-----x-x-----x-'
    },
    desc:"La clave brésilienne sur la caisse claire (jouée en cross-stick), le pied en balancier.",
    astuce:"Joue la caisse claire baguette posée sur la peau, en frappant le cercle : son « toc » caractéristique."
  },
  {
    id:'jazz-swing', nom:'Jazz — le rythme de ride', style:'Jazz', niveau:4,
    bpm:[80,120,200], beats:4, res:3, bars:1,
    tracks:{ RD:'x--x-xx--x-x', HP:'---x-----x--' },
    desc:"La cellule de base du jazz : « tching – tching-ka » à la ride, charleston au pied sur 2 et 4.",
    astuce:"Le pied gauche marque 2 et 4 : c'est lui qui tient le tempo dans le jazz."
  },
  {
    id:'train-beat', nom:'Train beat (country)', style:'Country', niveau:4,
    bpm:[90,120,170], beats:4, res:4, bars:1,
    tracks:{ CC:'ggggXgggggggXggg', GC:'x-------x-------' },
    desc:"Un roulement continu de doubles-croches à la caisse claire, accentué sur 2 et 4 : ça imite un train.",
    astuce:"Mains détendues, laisse rebondir. Seuls les accents demandent de l'énergie."
  },
  {
    id:'punk', nom:'Punk rapide', style:'Punk', niveau:3,
    bpm:[130,170,210], beats:4, res:2, bars:1,
    tracks:{ CH:'xxxxxxxx', CC:'--x---x-', GC:'x-x-x-x-' },
    desc:"Grosse caisse sur tous les temps, tempo élevé, énergie maximale.",
    astuce:"Si le bras fatigue au charleston, joue sur la ride ou ouvre légèrement le charleston."
  },
  {
    id:'d-beat', nom:'D-beat (punk hardcore)', style:'Punk', niveau:4,
    bpm:[140,175,210], beats:4, res:4, bars:1,
    tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----X-------X---', GC:'x-----x-x-----x-' },
    desc:"La signature du hardcore : la grosse caisse « galope » juste après la caisse claire.",
    astuce:"Travaille d'abord la cellule pied : 1 … et-de-3."
  },
  {
    id:'metal', nom:'Métal — doubles à la grosse caisse', style:'Métal', niveau:5,
    bpm:[80,110,170], beats:4, res:4, bars:1,
    tracks:{ RD:'--x-x-x-x-x-x-x-', CR:'x---------------', CC:'----X-------X---', GC:'xx--xx--xx--xx--' },
    desc:"Deux coups de grosse caisse par temps, ride ou charleston fermé en croches.",
    astuce:"Talon levé, la jambe rebondit. Commence à 70 BPM et monte de 5 en 5."
  },
  {
    id:'blast', nom:'Blast beat (simplifié)', style:'Métal', niveau:5,
    bpm:[100,150,220], beats:4, res:2, bars:1,
    tracks:{ RD:'xxxxxxxx', CC:'x-x-x-x-', GC:'-x-x-x-x' },
    desc:"Mains et pied alternent en croches : caisse claire / grosse caisse.",
    astuce:"C'est un exercice de coordination avant d'être un rythme : très lent d'abord."
  },
  {
    id:'valse', nom:'Valse (3/4)', style:'Traditionnel', niveau:2,
    bpm:[90,140,200], beats:3, res:2, bars:1,
    tracks:{ CH:'xxxxxx', CC:'--x-x-', GC:'x-----' },
    desc:"Trois temps par mesure : « BOUM – tchak – tchak ».",
    astuce:"Compte 1-2-3, 1-2-3. Le 1 est toujours le plus fort."
  },
  {
    id:'ballade-68', nom:'Ballade en 6/8', style:'Ballade', niveau:3,
    bpm:[90,168,220], beats:6, unite:8, res:1, bars:1,
    tracks:{ CH:'xxxxxx', CC:'---x--', GC:'x-----' },
    desc:"Six croches par mesure, caisse claire au milieu : le balancement des ballades. Ici le tempo compte les croches (168 ≈ noire pointée à 56).",
    astuce:"Pense en deux groupes de trois : 1-2-3 / 4-5-6."
  },
  {
    id:'toms', nom:'Groove aux toms (tribal)', style:'Rock', niveau:3,
    bpm:[70,96,140], beats:4, res:4, bars:1,
    tracks:{ TB:'X-x-X-x-X-x-X-x-', CC:'----X-------X---', GC:'x---------x-----' },
    desc:"On remplace le charleston par le tom basse : un son profond et hypnotique.",
    astuce:"Frappe au centre de la peau pour un son rond, et accentue chaque temps."
  },
  {
    id:'second-line', nom:'Second line (Nouvelle-Orléans, simplifié)', style:'Funk', niveau:5,
    bpm:[70,92,120], beats:4, res:4, bars:1,
    tracks:{ CC:'g-gXg-g-gX-gg-g-', GC:'x--x--x---x--x--', CH:'--------x-------' },
    desc:"Le groove des fanfares de la Nouvelle-Orléans : très syncopé, plein de ghost notes.",
    astuce:"Écoute la ligne de grosse caisse comme un tuba : c'est elle qui dessine le morceau."
  },
  {
    id:'samba', nom:'Samba (très simplifié)', style:'Latin', niveau:5,
    bpm:[80,104,140], beats:4, res:4, bars:1,
    tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'--g-X-g---g-X-g-', GC:'x--x-xx--x-x-x--', HP:'----x-------x---' },
    desc:"Version réduite de la samba : pied continu, ghost notes et accents décalés.",
    astuce:"La grosse caisse joue le rôle du surdo : appuie sur les temps 2 et 4."
  },
  {
    id:'afro', nom:'Afrobeat (simplifié)', style:'Afro', niveau:5,
    bpm:[90,112,140], beats:4, res:4, bars:1,
    tracks:{ CH:'X-xxX-xxX-xxX-xx', CC:'----X---g---X-g-', GC:'x--x--x---x-x---' },
    desc:"Charleston en doubles-croches accentuées, caisse claire décalée : le groove de Tony Allen.",
    astuce:"L'accent du charleston tombe sur chaque temps, le reste reste très léger."
  },
  {
    id:'motown-4', nom:'Motown (caisse claire sur les 4 temps)', style:'Soul', niveau:2,
    bpm:[80,120,160], beats:4, res:2, bars:1,
    tracks:{ CH:'xxxxxxxx', CC:'x-x-x-x-', GC:'x---x---' },
    desc:"La caisse claire frappe chaque temps : le son des tubes Motown des années 60.",
    astuce:"Toutes les frappes de caisse claire au même volume, sans accent sur 2 et 4."
  },
  {
    id:'rock-16-pied', nom:'Rock — grosse caisse en doubles', style:'Rock', niveau:3,
    bpm:[60,90,140], beats:4, res:4, bars:1,
    tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----x-------x---', GC:'x--x--x-x--x----' },
    desc:"La grosse caisse tombe sur des doubles-croches : entre les frappes de charleston.",
    astuce:"Joue lentement et vérifie : chaque coup de pied décalé tombe entre deux charlestons."
  },
  {
    id:'pop-punk', nom:'Pop-punk (skank beat)', style:'Punk', niveau:3,
    bpm:[120,170,220], beats:4, res:2, bars:1,
    tracks:{ RD:'xxxxxxxx', CC:'-x-x-x-x', GC:'x-x-x-x-' },
    desc:"Pied et caisse claire en alternance sur chaque croche : l'énergie du pop-punk.",
    astuce:"Ride ou crash ouverte en croches, et surtout pas de crispation."
  },
  {
    id:'hiphop-16', nom:'Hip-hop syncopé', style:'Hip-hop', niveau:4,
    bpm:[70,90,105], beats:4, res:4, bars:1,
    tracks:{ CH:'xxxxxxxxxxxxxxxx', CC:'----X-------X---', GC:'x-x----x--x---x-' },
    desc:"Charleston en doubles, grosse caisse très syncopée autour d'un backbeat lourd.",
    astuce:"Charleston léger, backbeat fort : c'est le contraste qui fait sonner."
  },
  {
    id:'shuffle-ghost', nom:'Shuffle avec ghost notes', style:'Blues', niveau:5,
    bpm:[60,90,130], beats:4, res:3, bars:1,
    tracks:{ CH:'x-xx-xx-xx-x', CC:'-g-Xg--g-Xg-', GC:'x-----x-----' },
    desc:"Le shuffle avec des ghost notes sur la note du milieu des triolets : le son du blues moderne.",
    astuce:"Les ghosts se jouent main gauche, très bas, pendant que la droite fait le shuffle."
  },
  {
    id:'lineaire', nom:'Groove linéaire', style:'Funk', niveau:5,
    bpm:[60,85,120], beats:4, res:4, bars:1,
    tracks:{ CH:'-xx--xx--xx--x-x', CC:'----X-------X-g-', GC:'x--x---xx--x----' },
    desc:"Une seule frappe à la fois : jamais deux éléments ensemble. Chaque double-croche est occupée.",
    astuce:"Sans unisson, le groove devient une mélodie. Très exigeant pour le placement."
  },
  {
    id:'dnb', nom:"Drum'n'bass", style:'Électro', niveau:4,
    bpm:[140,170,180], beats:4, res:4, bars:1,
    tracks:{ CH:'x-x-x-x-x-x-x-x-', CC:'----X-------X---', GC:'x---------x-----' },
    desc:"Rapide mais aéré : la grosse caisse sur le 1 et le « et » du 3, backbeat sur 2 et 4.",
    astuce:"Ça paraît simple à 90 BPM. À 170, il faut une vraie détente."
  },
  {
    id:'trap', nom:'Trap (roulement de charleston)', style:'Hip-hop', niveau:5,
    bpm:[60,70,85], beats:4, res:8, bars:1,
    tracks:{ CH:'x---x---x---x---x---x---x-x-xxxx', CC:'----------------X---------------', GC:'x-------------x-----x-----------' },
    desc:"Half-time lourd et roulements de charleston en triples-croches à la fin de la mesure.",
    astuce:"Le roulement se joue du bout des doigts, main droite seule ou mains alternées."
  },
  {
    id:'double-pied', nom:'Métal — grosse caisse continue', style:'Métal', niveau:5,
    bpm:[50,80,150], beats:4, res:4, bars:1,
    tracks:{ RD:'x---x---x---x---', CC:'----X-------X---', GC:'xxxxxxxxxxxxxxxx' },
    desc:"Doubles-croches continues au pied sous une ride en noires.",
    astuce:"Avec une seule pédale : talon levé, cheville souple. Monte de 4 BPM en 4 BPM."
  },
  {
    id:'rock-7-8', nom:'Rock en 7/8', style:'Mesures composées', niveau:5,
    bpm:[140,180,220], beats:7, unite:8, res:1, bars:1,
    tracks:{ CH:'xxxxxxx', CC:'--x--x-', GC:'x---x--' },
    desc:"Sept croches par mesure, groupées 2+2+3. Le tempo compte les croches.",
    astuce:"Compte « 1-2, 1-2, 1-2-3 » : les groupes tombent tout seuls."
  },
  {
    id:'rock-5-4', nom:'Rock en 5/4', style:'Mesures composées', niveau:5,
    bpm:[70,110,160], beats:5, res:2, bars:1,
    tracks:{ CH:'xxxxxxxxxx', CC:'----x---x-', GC:'x-----x---' },
    desc:"Cinq temps par mesure, pensés 3 + 2.",
    astuce:"Compte « 1-2-3, 1-2 » et sens la mesure boiter : c'est voulu."
  },
  {
    id:'blues-12-8', nom:'Blues lent en 12/8', style:'Blues', niveau:4,
    bpm:[120,168,210], beats:12, unite:8, res:1, bars:1,
    tracks:{ RD:'xxxxxxxxxxxx', CC:'---x-----x--', GC:'x-----x-----' },
    desc:"Douze croches par mesure en groupes de trois : le vrai blues lent. Le tempo compte les croches.",
    astuce:"Pense en 4 grands temps de 3 croches. Backbeat sur le 2e et le 4e grand temps."
  }
];

/* ============================ BREAKS & FILLS ============================ */
const BAR_ROCK = { CH:'x-x-x-x-x-x-x-x-', CC:'----x-------x---', GC:'x-------x-------' };

function avecGroove(id, nom, niveau, fillTracks, desc, astuce, bpm = [55,80,130], doigte = null){
  const ids = new Set([...Object.keys(BAR_ROCK), ...Object.keys(fillTracks)]);
  const tracks = {};
  for (const k of ids) tracks[k] = (BAR_ROCK[k] || R(16)) + (fillTracks[k] || R(16));
  const o = { id, nom, niveau, style:'Fill', bpm, beats:4, res:4, bars:2, tracks, desc, astuce };
  if (doigte) o.doigte = R(16) + doigte;
  return o;
}

export const FILLS = [
  avecGroove('fill-noires', 'Fill en noires (le plus simple)', 1,
    { CC:'x---------------', T1:'----x-----------', T2:'--------x-------', TB:'------------x---', CH:R(16) },
    "Une mesure de groove, puis 4 frappes : caisse claire, tom 1, tom 2, tom basse.",
    "Une frappe par temps seulement : compte 1-2-3-4 et descends les fûts."),
  avecGroove('fill-croches', 'Fill en croches', 2,
    { CC:'x-x-------------', T1:'----x-x---------', T2:'--------x-x-----', TB:'------------x-x-', CH:R(16) },
    "Deux frappes par fût : on double la vitesse du fill précédent.",
    "Alterne les mains : droite-gauche, droite-gauche."),
  avecGroove('fill-1temps', 'Fill d\'un temps (doubles-croches)', 3,
    { CC:'------------xx--', T1:'--------------x-', T2:'---------------x', CH:'x-x-x-x-x-x-----' },
    "Le fill le plus utile : il ne prend que le dernier temps de la mesure.",
    "Parfait pour annoncer un refrain sans casser le groove."),
  avecGroove('fill-2temps', 'Fill de deux temps', 3,
    { CC:'--------xxxx----', T1:'------------xx--', T2:'--------------x-', TB:'---------------x', CH:'x-x-x-x---------' },
    "On démarre le fill au temps 3 : 8 doubles-croches réparties sur les fûts.",
    "Garde le tempo : le fill ne doit ni accélérer ni ralentir."),
  avecGroove('fill-doubles', 'Fill complet en doubles-croches', 4,
    { CC:'xxxx------------', T1:'----xxxx--------', T2:'--------xxxx----', TB:'------------xxxx', CH:R(16) },
    "Une mesure entière : 4 doubles-croches par fût.",
    "Compte « 1 e et a » sur chaque temps, mains alternées D-G-D-G."),
  avecGroove('fill-crash', 'Fill avec retour sur la crash', 2,
    { CC:'--------x-x-----', T1:'------------x---', TB:'--------------x-', CH:'x-x-x-x---------', CR:R(16) },
    "Le fill se termine et la crash marque le 1 de la mesure suivante (écoute la boucle).",
    "La crash se joue toujours avec la grosse caisse : les deux ensemble, sinon ça sonne mou.",
    [55,84,140]),
  avecGroove('fill-ghost', 'Fill funk avec ghost notes', 5,
    { CC:'g-gXg-gXg-gX-g-x', T1:'--------------x-', TB:'---------------x', CH:R(16) },
    "Les ghost notes remplissent, les accents marquent la pulsation.",
    "Différence de volume : ghost ≈ 20 %, accent ≈ 100 %."),
  avecGroove('fill-lineaire', 'Fill linéaire (jamais deux ensemble)', 5,
    { CC:'--------x--x--x-', T1:'---------x------', T2:'------------x---', GC:'x-------'+'-x--x--x'.slice(0,8), CH:'x-x-x-x---------' },
    "Style linéaire : une seule frappe à la fois, mains et pied s'alternent.",
    "Très moderne. Joue-le lentement, l'effet vient de la régularité.")
];

/* ============================ EXERCICES ============================ */
export const EXERCICES = [
  {
    id:'ex-noires', nom:'Frappes simples — noires', niveau:1, style:'Mains',
    bpm:[40,70,140], beats:4, res:1, bars:2,
    tracks:{ CC:'xxxx'+'xxxx' }, doigte:'DGDG'+'DGDG',
    desc:"Une frappe par temps, mains alternées (D = droite, G = gauche).",
    astuce:"Baguettes à 5 cm de la peau, poignet souple, même son des deux mains."
  },
  {
    id:'ex-croches', nom:'Frappes simples — croches', niveau:1, style:'Mains',
    bpm:[40,70,140], beats:4, res:2, bars:1,
    tracks:{ CC:'xxxxxxxx' }, doigte:'DGDGDGDG',
    desc:"Deux frappes par temps, toujours en alternant.",
    astuce:"Compte « 1 et 2 et 3 et 4 et » à voix haute."
  },
  {
    id:'ex-doubles', nom:'Frappes simples — doubles-croches', niveau:2, style:'Mains',
    bpm:[40,60,120], beats:4, res:4, bars:1,
    tracks:{ CC:'Xxxx Xxxx Xxxx Xxxx' }, doigte:'DGDGDGDGDGDGDGDG',
    desc:"Quatre frappes par temps. Accentue la première de chaque groupe.",
    astuce:"Si ça se déforme, baisse le tempo de 10 BPM. La régularité prime sur la vitesse."
  },
  {
    id:'ex-gc-croches', nom:'Indépendance — grosse caisse en croches', niveau:2, style:'Coordination',
    bpm:[50,70,120], beats:4, res:2, bars:1,
    tracks:{ CH:'xxxxxxxx', GC:'x-x-x-x-' },
    desc:"Charleston en croches, grosse caisse sur chaque temps : le premier vrai travail de coordination.",
    astuce:"Pied et main droite tombent ensemble sur les temps : écoute qu'il n'y ait qu'un seul son."
  },
  {
    id:'ex-cc-contretemps', nom:'Indépendance — caisse claire sur les « et »', niveau:3, style:'Coordination',
    bpm:[50,70,110], beats:4, res:2, bars:1,
    tracks:{ CH:'xxxxxxxx', CC:'-x-x-x-x', GC:'x---x---' },
    desc:"La caisse claire se place entre les temps : excellent pour sentir les contretemps.",
    astuce:"Chante « et – et – et – et » en jouant."
  },
  {
    id:'ex-gc-doubles', nom:'Grosse caisse — doubles', niveau:4, style:'Pied',
    bpm:[50,70,130], beats:4, res:4, bars:1,
    tracks:{ CH:'x-x-x-x-x-x-x-x-', GC:'xx--xx--xx--xx--' },
    desc:"Deux coups de pied par temps, sous un charleston en croches.",
    astuce:"Technique talon levé : la cheville rebondit, la jambe reste détendue."
  },
  {
    id:'ex-charley-ouvert', nom:'Charleston ouvert / fermé', niveau:3, style:'Coordination',
    bpm:[60,84,130], beats:4, res:2, bars:1,
    tracks:{ CH:'x-o-x-o-', CC:'--x---x-', GC:'x---x---' },
    desc:"Ouvrir le charleston sur les contretemps, le refermer sur le temps suivant.",
    astuce:"Le pied gauche fait tout le travail : lève-le juste avant la frappe, repose-le après."
  },
  {
    id:'ex-metronome', nom:'Tenir le tempo (charleston seul)', niveau:1, style:'Tempo',
    bpm:[40,80,180], beats:4, res:1, bars:4,
    tracks:{ CH:'xxxx'.repeat(4) },
    desc:"Active le métronome et joue les noires : ton but est de couvrir exactement le clic.",
    astuce:"Quand tu joues pile en place, on n'entend presque plus le métronome. C'est le meilleur test."
  }
];

/* --- breaks supplémentaires --- */
FILLS.push(
  avecGroove('fill-deplace', 'Fill décalé (départ sur le « et » du 3)', 4,
    { CH:'x-x-x-x-x-------', CC:'----x-----xx----', T1:'------------xx--', TB:'--------------xx', GC:'x-------x-------' },
    "Le break démarre entre deux temps : plus surprenant, plus musical.",
    "Compte « 3 ET » à voix haute : c'est là que le break part."),
  avecGroove('fill-paradiddle', 'Fill paradiddle sur les toms', 4,
    { CC:'-x--x-xx-x--x-xx', T1:'x-xx-x----------', TB:'--------x-xx-x--', CH:R(16) },
    "Le paradiddle réparti : main droite sur les toms, main gauche sur la caisse claire.",
    "Travaille d'abord le paradiddle seul (onglet Entraînement) jusqu'à 90 BPM.",
    [50,72,120], 'DGDDGDGGDGDDGDGG'),
  avecGroove('fill-six', 'Fill roulement de 6', 5,
    { T1:'X-------X-------', CC:'-xxxx----xxxx---', TB:'-----X-------X--', CH:R(16) },
    "Accents sur les toms, doubles sur la caisse claire : un fill très moderne.",
    "Les notes sur la caisse claire restent douces, seuls les toms ressortent.",
    [50,70,120], 'DGGDDG--DGGDDG--'),
  avecGroove('fill-flams', 'Fill en flams qui descend', 4,
    { CC:'f---------------', T1:'----f-----------', T2:'--------f-------', TB:'------------f---', CH:R(16) },
    "Un flam par temps en descendant les fûts : un son épais et large.",
    "La note d'agrément doit rester très basse, sinon le flam devient une double frappe.")
);

/* Vrais triolets : une mesure de groove ternaire puis le break en croches de triolet */
FILLS.push({
  id:'fill-triolets', nom:'Fill en triolets', niveau:4, style:'Fill', bpm:[50,72,120],
  beats:4, res:3, bars:2,
  tracks:{
    CH:'x-xx-xx-xx-x' + R(12),
    CC:'---x-----x--' + 'xxx---------',
    T1:R(12)         + '---xxx------',
    T2:R(12)         + '------xxx---',
    TB:R(12)         + '---------xxx',
    GC:'x-----x-----' + R(12)
  },
  doigte: R(12) + 'DGDGDGDGDGDG',
  desc:"Trois frappes par temps, du haut vers le bas des fûts : le fill idéal des shuffles et ballades.",
  astuce:"Compte « 1-la-li 2-la-li » : chaque fût reçoit un groupe de trois."
});
FILLS.push({
  id:'fill-bonham', nom:'Triolets main-main-pied (style Bonham)', niveau:5, style:'Fill', bpm:[50,70,120],
  beats:4, res:3, bars:2,
  tracks:{
    CH:'x-xx-xx-xx-x' + R(12),
    CC:'---x-----x--' + '-x--x-------',
    T1:R(12)         + 'x--x--x--x--',
    TB:R(12)         + '-------x--x-',
    GC:'x-----x-----' + '--x--x--x--x'
  },
  doigte: R(12) + 'DG-DG-DG-DG-',
  desc:"Main droite, main gauche, pied, en boucle : le triolet qui a fait la légende de John Bonham.",
  astuce:"Le pied est une troisième « main ». Commence très lentement, les trois sons doivent être égaux."
});
FILLS.push({
  id:'fill-triples', nom:'Roulement en triples-croches', niveau:5, style:'Fill', bpm:[50,66,100],
  beats:4, res:8, bars:2,
  tracks:{
    CR:'x' + R(31) + R(32),
    CH:'----x---x---x---x---x---x---x---' + 'x---x---x---x---x---x-----------',
    CC:'--------x---------------x-------' + '--------x---------------xxxxxxxx',
    GC:'x---------------x---------------' + 'x---------------x---------------'
  },
  doigte: R(32) + R(24) + 'DGDGDGDG',
  desc:"Huit notes sur le dernier temps (triples-croches), puis la crash : le roulement qui lance un refrain.",
  astuce:"Deux fois plus rapide que des doubles-croches : mains alternées, poignets souples, tempo lent."
});

/* le fill « retour sur la crash » a besoin d'une crash sur le 1 de la mesure de groove */
{
  const f = FILLS.find(x => x.id === 'fill-crash');
  f.tracks.CR = 'x---------------' + R(16);
  f.tracks.CH = '--x-x-x-x-x-x-x-' + 'x-x-x-x---------';
}

export const TOUS = [...GROOVES, ...FILLS, ...EXERCICES];
export function parId(id){ return TOUS.find(p => p.id === id) || LECONS_PATTERNS[id]; }
export const LECONS_PATTERNS = {};
