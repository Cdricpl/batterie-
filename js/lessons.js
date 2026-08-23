/* Parcours pédagogique : 25 leçons progressives, de zéro au premier morceau. */

const p = (o) => ({ beats:4, res:4, bars:1, bpm:[50,80,140], ...o });

export const NIVEAUX = [
  { n:1, nom:'Niveau 1 — Les tout premiers pas', couleur:'#06d6a0' },
  { n:2, nom:'Niveau 2 — Les croches et le vrai groove', couleur:'#8ecae6' },
  { n:3, nom:'Niveau 3 — Doubles-croches, nuances, breaks', couleur:'#ffd166' },
  { n:4, nom:'Niveau 4 — Ternaire et styles', couleur:'#f2b134' },
  { n:5, nom:'Niveau 5 — Aller plus loin', couleur:'#ef476f' }
];

export const LECONS = [
{
  id:'l01', niveau:1, titre:'Découvrir ton kit', duree:'10 min',
  objectif:"Nommer chaque élément et savoir où frapper.",
  contenu:`
    <p>Voici ta batterie, telle qu'elle est installée&nbsp;:</p>
    <ul>
      <li><b>Grosse caisse</b> — le gros fût au sol, joué avec la <b>pédale du pied droit</b>. C'est le « boum ».</li>
      <li><b>Caisse claire</b> — à ta gauche, entre les jambes. C'est le « tchak » qui claque.</li>
      <li><b>Charleston</b> (ou « charley ») — les deux cymbales sur pied, à gauche. Main droite dessus, pied gauche sur la pédale.</li>
      <li><b>Toms</b> — devant toi (tom 1, tom 2) et le <b>tom basse</b> à droite. Ils servent surtout dans les breaks.</li>
      <li><b>Crash</b> — la grande cymbale en hauteur : elle sert à marquer un départ, un refrain.</li>
      <li><b>Ride</b> — la grande cymbale à droite : elle remplace le charleston pour un son plus ouvert.</li>
    </ul>
    <p><b>Position&nbsp;:</b> assieds-toi au bord du siège, cuisses légèrement descendantes, talons dans l'axe des pédales.
    Les baguettes se tiennent entre le pouce et la 1re phalange de l'index, les 3 autres doigts posés dessous, sans serrer.</p>
    <p>Appuie sur <b>Écouter</b> : chaque élément est joué l'un après l'autre, et il s'allume sur le schéma du kit.</p>`,
  pattern: p({ id:'l01-p', nom:'Tour du kit', res:1, bars:2, bpm:[40,66,100],
    tracks:{ GC:'x---'+'----', CC:'-x--'+'----', CH:'--x-'+'----', T1:'---x'+'----',
             T2:'----'+'x---', TB:'----'+'-x--', CR:'----'+'--x-', RD:'----'+'---x' } }),
  conseils:["Frappe la caisse claire au centre pour un son plein.",
            "Sur le charleston, tape sur le bord de la cymbale du haut, pas sur la cloche."]
},
{
  id:'l02', niveau:1, titre:'La pulsation et le métronome', duree:'15 min',
  objectif:"Jouer 4 noires régulières en suivant un clic.",
  contenu:`
    <p>La musique avance sur une <b>pulsation</b> régulière, comme les battements d'une horloge. On la compte
    <b>1&nbsp;– 2&nbsp;– 3&nbsp;– 4</b>, puis on recommence : c'est une <b>mesure</b> à 4 temps (le fameux « 4/4 »).</p>
    <p>Le <b>tempo</b> se mesure en BPM (battements par minute). 60&nbsp;BPM = 1 frappe par seconde.</p>
    <p>Exercice : coche <b>Métronome</b> puis lance la lecture. Joue une frappe de charleston sur chaque clic.
    Quand tu es exactement dessus, tu n'entends presque plus le clic — c'est le but !</p>`,
  pattern: p({ id:'l02-p', nom:'Noires au charleston', res:1, bars:2, bpm:[40,70,120],
    tracks:{ CH:'xxxx'.repeat(2) } }),
  conseils:["Commence à 60 BPM. Monte de 10 en 10 seulement quand c'est parfaitement stable.",
            "Compte à voix haute : « 1, 2, 3, 4 ». Ça paraît bête, ça change tout."]
},
{
  id:'l03', niveau:1, titre:'La grosse caisse sur 1 et 3', duree:'15 min',
  objectif:"Coordonner le pied droit avec la main droite.",
  contenu:`
    <p>On garde le charleston en noires, et on ajoute le <b>pied droit</b> sur les temps <b>1</b> et <b>3</b>.</p>
    <p>Sur ces deux temps, la main et le pied tombent <b>exactement ensemble</b> : tu dois entendre <em>un seul</em> son,
    pas un « fla-fla ».</p>
    <p>Deux techniques de pied : <b>talon posé</b> (souple, pour les nuances douces) ou <b>talon levé</b>
    (plus puissant, la jambe entière descend). Pour débuter, talon levé, batte qui reste contre la peau.</p>`,
  pattern: p({ id:'l03-p', nom:'Charleston + grosse caisse', res:1, bars:2, bpm:[45,70,120],
    tracks:{ CH:'xxxx'.repeat(2), GC:'x-x-'.repeat(2) } }),
  conseils:["Si le pied traîne : joue 8 mesures de pied seul, puis rajoute la main."]
},
{
  id:'l04', niveau:1, titre:'La caisse claire sur 2 et 4 — le backbeat', duree:'15 min',
  objectif:"Placer le backbeat, l'accent qui fait bouger la tête.",
  contenu:`
    <p>Dans presque toute la musique populaire, la caisse claire frappe les temps <b>2</b> et <b>4</b>.
    On appelle ça le <b>backbeat</b> : c'est lui qui fait taper du pied.</p>
    <p>Ta <b>main gauche</b> s'occupe de la caisse claire, ta main droite reste au charleston. Au début, tes deux mains
    vont se gêner : c'est normal, ralentis.</p>`,
  pattern: p({ id:'l04-p', nom:'Charleston + caisse claire', res:1, bars:2, bpm:[45,70,120],
    tracks:{ CH:'xxxx'.repeat(2), CC:'-x-x'.repeat(2) } }),
  conseils:["Frappe fort la caisse claire : le backbeat doit être le son le plus présent."]
},
{
  id:'l05', niveau:1, titre:'🎉 Ton premier groove complet', duree:'20 min',
  objectif:"Assembler charleston, grosse caisse et caisse claire.",
  contenu:`
    <p>On réunit tout : charleston en noires, grosse caisse sur <b>1 et 3</b>, caisse claire sur <b>2 et 4</b>.</p>
    <p>Tu joues officiellement de la batterie. Ce motif est la fondation de milliers de morceaux.</p>
    <p><b>Méthode qui marche à tous les coups</b> quand un rythme résiste :</p>
    <ol><li>Joue les deux mains seules (charleston + caisse claire).</li>
        <li>Joue main droite + pied seuls (charleston + grosse caisse).</li>
        <li>Assemble très lentement, 4 mesures d'affilée sans erreur.</li>
        <li>Monte de 5 BPM.</li></ol>`,
  pattern: p({ id:'l05-p', nom:'Premier groove', res:1, bars:2, bpm:[45,70,130],
    tracks:{ CH:'xxxx'.repeat(2), CC:'-x-x'.repeat(2), GC:'x-x-'.repeat(2) } }),
  defi:{ bpm:90, texte:"Tenir 1 minute sans erreur à 90 BPM." },
  conseils:["Active « Tempo progressif » : l'appli augmentera le tempo toute seule à chaque boucle."]
},
{
  id:'l06', niveau:2, titre:'Les croches : jouer entre les temps', duree:'15 min',
  objectif:"Doubler la vitesse du charleston et compter « 1 et 2 et… ».",
  contenu:`
    <p>Une <b>croche</b> vaut la moitié d'une noire : il y en a deux par temps. On compte
    <b>« 1 et 2 et 3 et 4 et »</b>. Les « et » sont les <b>contretemps</b>.</p>
    <p>Sur la partition, les croches sont reliées par une <b>barre horizontale</b> (une ligature).</p>
    <p>Joue-les d'une seule main au charleston, régulières comme une machine à coudre.</p>`,
  pattern: p({ id:'l06-p', nom:'Croches au charleston', res:2, bars:2, bpm:[45,75,140],
    tracks:{ CH:'xxxxxxxx'.repeat(2) } }),
  conseils:["Petit mouvement de poignet, la baguette rebondit. Le bras ne bouge presque pas."]
},
{
  id:'l07', niveau:2, titre:'🎉 Le groove rock 8 temps', duree:'25 min',
  objectif:"Le rythme le plus joué au monde.",
  contenu:`
    <p>Charleston en croches, grosse caisse sur 1 et 3, caisse claire sur 2 et 4.
    C'est <b>le</b> beat rock/pop : il est dans des milliers de tubes.</p>
    <p>Repère bien : la caisse claire tombe sur la <b>3<sup>e</sup></b> et la <b>7<sup>e</sup></b> croche.</p>`,
  pattern: p({ id:'l07-p', nom:'Rock 8 temps', res:2, bars:2, bpm:[50,85,160],
    tracks:{ CH:'xxxxxxxx'.repeat(2), CC:'--x---x-'.repeat(2), GC:'x---x---'.repeat(2) } }),
  defi:{ bpm:110, texte:"Tenir 2 minutes à 110 BPM avec le métronome." },
  conseils:["Quand c'est solide, essaie de chanter un morceau que tu aimes par-dessus."]
},
{
  id:'l08', niveau:2, titre:'Varier la grosse caisse', duree:'25 min',
  objectif:"Sortir du « 1 et 3 » figé.",
  contenu:`
    <p>Le charleston et la caisse claire ne bougent pas : seule la <b>grosse caisse</b> change.
    C'est la façon la plus simple de créer plein de grooves différents.</p>
    <p>Ici : 1, puis le <b>« et » du 2</b>, puis 3. Écoute comme ça pousse en avant.</p>
    <p>Essaie ensuite d'inventer tes propres placements : c'est le début de ton style.</p>`,
  pattern: p({ id:'l08-p', nom:'Variante de grosse caisse', res:2, bars:2, bpm:[50,85,150],
    tracks:{ CH:'xxxxxxxx'.repeat(2), CC:'--x---x-'.repeat(2), GC:'x--xx---'.repeat(2) } }),
  conseils:["Isole grosse caisse + charleston avant d'ajouter la caisse claire."]
},
{
  id:'l09', niveau:2, titre:'La grosse caisse sur le « et » du 3', duree:'20 min',
  objectif:"Jouer une syncope simple.",
  contenu:`
    <p>Quand une note tombe entre deux temps, on parle de <b>syncope</b>. C'est ce qui donne du groove.</p>
    <p>Ici la grosse caisse joue 1, puis le « et » du 3. Ce petit décalage suffit à transformer le rythme.</p>`,
  pattern: p({ id:'l09-p', nom:'Syncope au pied', res:2, bars:2, bpm:[50,85,150],
    tracks:{ CH:'xxxxxxxx'.repeat(2), CC:'--x---x-'.repeat(2), GC:'x----x--'.repeat(2) } }),
  conseils:["Le pied tombe entre deux frappes de charleston, jamais avec."]
},
{
  id:'l10', niveau:2, titre:'Ton premier break', duree:'25 min',
  objectif:"Enchaîner groove → break → groove sans perdre le tempo.",
  contenu:`
    <p>Un <b>break</b> (ou <b>fill</b>) est une phrase courte qui annonce la suite : fin de couplet, entrée du refrain…</p>
    <p>Ici : 1 mesure de groove, puis 1 mesure de break en descendant les fûts (caisse claire → tom 1 → tom 2 → tom basse),
    et on repart. La boucle te fait travailler l'enchaînement.</p>
    <p><b>Règle d'or</b> : un break ne doit ni accélérer ni ralentir. Continue à compter 1-2-3-4 pendant le break.</p>`,
  pattern: p({ id:'l10-p', nom:'Groove + break en noires', res:2, bars:2, bpm:[50,80,140],
    tracks:{ CH:'xxxxxxxx'+'--------', CC:'--x---x-'+'x-------',
             T1:'--------'+'--x-----', T2:'--------'+'----x---', TB:'--------'+'------x-',
             GC:'x---x---'+'--------' } }),
  conseils:["Compte le break à voix haute : 1-2-3-4, puis repars pile sur le 1."]
},
{
  id:'l11', niveau:3, titre:'Les doubles-croches', duree:'20 min',
  objectif:"Quatre frappes par temps, mains alternées.",
  contenu:`
    <p>Une <b>double-croche</b> vaut un quart de temps : 4 par temps. On les compte
    <b>« 1 e et a, 2 e et a… »</b> (ce sont juste des syllabes de repère, très utilisées).</p>
    <p>Sur la partition, elles sont reliées par <b>deux</b> barres.</p>
    <p>On les joue en alternant les mains : <b>D G D G</b>. Regarde la ligne « D/G » sous la portée.</p>`,
  pattern: p({ id:'l11-p', nom:'Doubles-croches à la caisse claire', res:4, bars:2, bpm:[40,60,120],
    tracks:{ CC:'Xxxx'.repeat(8) }, doigte:'DGDGDGDGDGDGDGDG'.repeat(2) }),
  conseils:["Accentue la 1re double de chaque temps : ça t'aide à ne pas te perdre."]
},
{
  id:'l12', niveau:3, titre:'Le charleston ouvert', duree:'20 min',
  objectif:"Ouvrir et refermer le charleston avec le pied gauche.",
  contenu:`
    <p>Le <b>pied gauche</b> contrôle la fermeture du charleston. En relâchant la pression, les deux cymbales
    vibrent librement : c'est le son « tchhh » ouvert, noté avec un <b>petit cercle</b> au-dessus de la note.</p>
    <p>Le geste : on ouvre <b>juste avant</b> la frappe, et on referme sur la frappe suivante. C'est la fermeture
    qui doit être rythmée, pas seulement l'ouverture.</p>`,
  pattern: p({ id:'l12-p', nom:'Ouvertures sur les contretemps', res:2, bars:2, bpm:[50,80,130],
    tracks:{ CH:'x-o-x-o-'.repeat(2), CC:'--x---x-'.repeat(2), GC:'x---x---'.repeat(2) } }),
  conseils:["Écoute : le « tchhh » doit se couper net sur le temps suivant."]
},
{
  id:'l13', niveau:3, titre:'Les ghost notes', duree:'25 min',
  objectif:"Jouer très doucement entre les frappes fortes.",
  contenu:`
    <p>Une <b>ghost note</b> est une frappe de caisse claire quasi inaudible, notée <b>entre parenthèses</b>.
    Elle ne s'entend pas vraiment : elle se <em>sent</em>. C'est le secret du groove funk et soul.</p>
    <p>Objectif de volume : accent = 100 %, frappe normale = 60 %, ghost = 15-20 %.
    Les baguettes restent à 1-2 cm de la peau pour les ghosts.</p>`,
  pattern: p({ id:'l13-p', nom:'Backbeat + ghost notes', res:4, bars:2, bpm:[45,70,120],
    tracks:{ CH:'x-x-x-x-x-x-x-x-'.repeat(2), CC:'--g-X--g--g-X-g-'.repeat(2), GC:'x-----x---x-----'.repeat(2) } }),
  conseils:["Si on entend clairement les ghosts, c'est qu'elles sont trop fortes."]
},
{
  id:'l14', niveau:3, titre:'Groove funk en doubles-croches', duree:'30 min',
  objectif:"Tenir un charleston en doubles-croches sous un groove.",
  contenu:`
    <p>Le charleston joue maintenant <b>4 frappes par temps</b>. C'est fatigant : garde le poignet souple
    et joue petit. Si c'est trop rapide, alterne les deux mains (la gauche vient au charleston et
    revient à la caisse claire pour le backbeat).</p>`,
  pattern: p({ id:'l14-p', nom:'Funk 16 temps', res:4, bars:2, bpm:[45,70,110],
    tracks:{ CH:'xxxxxxxxxxxxxxxx'.repeat(2), CC:'----X-------X---'.repeat(2), GC:'x--x------x---x-'.repeat(2) } }),
  defi:{ bpm:85, texte:"Tenir 1 minute à 85 BPM sans que le charleston ne se déforme." },
  conseils:["Commence à 45 BPM. Vraiment."]
},
{
  id:'l15', niveau:3, titre:'Breaks en doubles-croches', duree:'25 min',
  objectif:"Placer un break d'un temps, puis de deux temps.",
  contenu:`
    <p>Les breaks les plus utiles sont <b>courts</b> : un ou deux temps à la fin d'une mesure.
    Ils annoncent la suite sans casser le groove.</p>
    <p>Ici : 3 temps de groove, puis 4 doubles-croches sur le dernier temps, réparties caisse claire → toms.</p>`,
  pattern: p({ id:'l15-p', nom:'Break d\'un temps', res:4, bars:2, bpm:[45,75,130],
    tracks:{ CH:'x-x-x-x-x-x-----'.repeat(2), CC:'----x-------xx--'.repeat(2),
             T1:'--------------x-'.repeat(2), T2:'---------------x'.repeat(2),
             GC:'x-------x-------'.repeat(2) } }),
  conseils:["Le dernier coup du break tombe sur la dernière double : enchaîne pile sur le 1."]
},
{
  id:'l16', niveau:4, titre:'Le ternaire : le triolet', duree:'20 min',
  objectif:"Sentir 3 notes par temps.",
  contenu:`
    <p>Jusqu'ici on divisait le temps en 2 ou en 4 (<b>binaire</b>). On peut aussi le diviser en <b>3</b> :
    c'est le <b>ternaire</b>. On compte <b>« 1-la-li, 2-la-li »</b>.</p>
    <p>Le ternaire, c'est le blues, le jazz, le gospel, beaucoup de ballades.</p>`,
  pattern: p({ id:'l16-p', nom:'Triolets à la caisse claire', res:3, bars:2, bpm:[40,66,120],
    tracks:{ CC:'Xxx'.repeat(8) }, doigte:'DGD GDG DGD GDG'.replace(/ /g,'').repeat(2) }),
  conseils:["Chante « 1-la-li » à voix haute, sinon tu retomberas en binaire sans t'en rendre compte."]
},
{
  id:'l17', niveau:4, titre:'Le shuffle', duree:'30 min',
  objectif:"Le balancement du blues.",
  contenu:`
    <p>Le <b>shuffle</b> : sur chaque triolet, on joue la 1<sup>re</sup> et la 3<sup>e</sup> note, on saute celle du milieu.
    Ça fait « <b>tchi&nbsp;–&nbsp;ka</b> tchi&nbsp;–&nbsp;ka ».</p>
    <p>Grosse caisse sur 1 et 3, caisse claire sur 2 et 4, comme d'habitude.</p>`,
  pattern: p({ id:'l17-p', nom:'Shuffle', res:3, bars:2, bpm:[50,80,130],
    tracks:{ CH:'x-xx-xx-xx-x'.repeat(2), CC:'---x-----x--'.repeat(2), GC:'x-----x-----'.repeat(2) } }),
  defi:{ bpm:100, texte:"Shuffle à 100 BPM pendant 2 minutes." },
  conseils:["Écoute du blues en jouant : le shuffle s'attrape par l'oreille avant les yeux."]
},
{
  id:'l18', niveau:4, titre:'Reggae : le one drop', duree:'25 min',
  objectif:"Laisser le temps 1 vide.",
  contenu:`
    <p>En reggae, on <b>ne joue rien sur le 1</b> : grosse caisse et caisse claire tombent ensemble sur le <b>3</b>.
    Ça crée cette sensation de flottement.</p>
    <p>La caisse claire se joue souvent en <b>cross-stick</b> : baguette posée à plat sur la peau, on frappe le cercle
    avec le manche. Son « toc » sec.</p>`,
  pattern: p({ id:'l18-p', nom:'One drop', res:4, bars:2, bpm:[50,74,110],
    tracks:{ CH:'x-x-x-x-x-x-x-x-'.repeat(2), CC:'--------X-------'.repeat(2), GC:'--------x-------'.repeat(2) } }),
  conseils:["Compte impérativement : sans repère sur le 1, c'est facile de se perdre."]
},
{
  id:'l19', niveau:4, titre:'Jazz : le rythme de ride', duree:'30 min',
  objectif:"La cellule de base du jazz + charleston au pied.",
  contenu:`
    <p>En jazz, c'est la <b>ride</b> qui tient le rythme : « tching – tching-ka – tching – tching-ka ».
    Le <b>pied gauche</b> ferme le charleston sur les temps <b>2 et 4</b>.</p>
    <p>Le motif est ternaire : la petite note se place sur la 3<sup>e</sup> partie du triolet.</p>`,
  pattern: p({ id:'l19-p', nom:'Ride jazz + charleston au pied', res:3, bars:2, bpm:[60,110,200],
    tracks:{ RD:'x--x-xx--x-x'.repeat(2), HP:'---x-----x--'.repeat(2) } }),
  conseils:["Bras détendu, la baguette rebondit sur la ride. Le son doit être clair, pas écrasé."]
},
{
  id:'l20', niveau:4, titre:'Bossa nova', duree:'30 min',
  objectif:"Jouer une clave sur 2 mesures.",
  contenu:`
    <p>La <b>bossa</b> se joue en douceur : charleston (ou balais) en croches, caisse claire en cross-stick
    qui dessine la <b>clave</b> — un motif de 2 mesures qui ne se répète pas à l'identique.</p>
    <p>Le pied joue un balancement continu, comme un cœur qui bat.</p>`,
  pattern: p({ id:'l20-p', nom:'Bossa nova', res:4, bars:2, bpm:[90,130,170],
    tracks:{ CH:'x-x-x-x-x-x-x-x-'+'x-x-x-x-x-x-x-x-',
             CC:'x--x--x---------'+'----x-----x-----',
             GC:'x-----x-x-----x-'+'x-----x-x-----x-' } }),
  conseils:["Tout doit rester très doux : la bossa, c'est le contraire de la force."]
},
{
  id:'l21', niveau:5, titre:'Doubles à la grosse caisse', duree:'30 min',
  objectif:"Deux coups de pied par temps.",
  contenu:`
    <p>Technique <b>talon levé</b> : la jambe reste haute et la cheville rebondit, ou technique
    <b>heel-toe</b> (pointe puis talon) pour les tempos rapides.</p>
    <p>Objectif : que les deux coups aient <b>le même volume</b>. Enregistre-toi, c'est le meilleur juge.</p>`,
  pattern: p({ id:'l21-p', nom:'Doubles au pied', res:4, bars:2, bpm:[45,70,130],
    tracks:{ CH:'x-x-x-x-x-x-x-x-'.repeat(2), CC:'----X-------X---'.repeat(2), GC:'xx--xx--xx--xx--'.repeat(2) } }),
  conseils:["Si le 2e coup est plus faible : baisse le tempo jusqu'à ce qu'ils soient identiques."]
},
{
  id:'l22', niveau:5, titre:'Le half-time : le groove qui ralentit', duree:'25 min',
  objectif:"Étaler le backbeat sur 2 mesures.",
  contenu:`
    <p>En <b>half-time</b>, la caisse claire ne tombe plus que sur le <b>3</b> : le morceau semble deux fois plus lent
    alors que le tempo n'a pas changé. C'est l'effet « ponts de refrain » de beaucoup de morceaux.</p>`,
  pattern: p({ id:'l22-p', nom:'Half-time', res:4, bars:2, bpm:[60,90,150],
    tracks:{ CH:'x-x-x-x-x-x-x-x-'.repeat(2), CC:'--------X-------'.repeat(2),
             GC:'x-----x---x-----'.repeat(2) } }),
  conseils:["Compare avec le rock 8 temps : même tempo, sensation totalement différente."]
},
{
  id:'l23', niveau:5, titre:'Tempos rapides : punk et métal', duree:'30 min',
  objectif:"Jouer vite sans se crisper.",
  contenu:`
    <p>À grande vitesse, ce n'est plus la force qui compte mais la <b>détente</b>. Baguettes tenues
    légèrement, mouvements minuscules, respiration régulière.</p>
    <p>Si le bras brûle : ralentis. La vitesse vient de la relaxation, jamais de l'effort.</p>`,
  pattern: p({ id:'l23-p', nom:'Punk rapide', res:2, bars:2, bpm:[100,160,210],
    tracks:{ CH:'xxxxxxxx'.repeat(2), CC:'--x---x-'.repeat(2), GC:'x-x-x-x-'.repeat(2) } }),
  defi:{ bpm:170, texte:"Tenir 30 secondes à 170 BPM, épaules relâchées." },
  conseils:["Active « Tempo progressif » : +4 BPM toutes les 2 boucles jusqu'à ta limite."]
},
{
  id:'l24', niveau:5, titre:'Dynamique et nuances', duree:'25 min',
  objectif:"Jouer le même rythme fort, puis doux.",
  contenu:`
    <p>Un bon batteur ne joue pas « fort » : il joue <b>juste ce qu'il faut</b>. Travaille ce groove trois fois :</p>
    <ol><li><b>Piano</b> : baguettes à 2 cm, presque un murmure.</li>
        <li><b>Mezzo</b> : volume de répétition normal.</li>
        <li><b>Forte</b> : concert — mais sans jamais écraser le son.</li></ol>
    <p>Garde exactement le même placement rythmique dans les trois cas.</p>`,
  pattern: p({ id:'l24-p', nom:'Groove à nuancer', res:4, bars:2, bpm:[50,85,140],
    tracks:{ CH:'X-x-X-x-X-x-X-x-'.repeat(2), CC:'----X---g---X---'.repeat(2), GC:'x-----x---x-----'.repeat(2) } }),
  conseils:["L'accent (>) ne veut pas dire « tape plus fort » mais « joue le reste plus doucement »."]
},
{
  id:'l25', niveau:5, titre:'🎉 Construire un morceau', duree:'40 min',
  objectif:"Enchaîner intro, couplet, break et refrain.",
  contenu:`
    <p>Un morceau, c'est une suite de blocs de 4 ou 8 mesures. Voici une structure complète en 4 mesures :</p>
    <ol><li><b>Mesure 1-2 (couplet)</b> : groove simple, charleston fermé.</li>
        <li><b>Mesure 3</b> : on ouvre le charleston, ça monte.</li>
        <li><b>Mesure 4</b> : break de 2 temps → et la boucle repart avec la <b>crash</b> sur le 1.</li></ol>
    <p>Rejoue-le en boucle : tu viens de jouer une vraie partie de batterie complète.</p>`,
  pattern: p({ id:'l25-p', nom:'Morceau en 4 mesures', res:4, bars:4, bpm:[50,90,150],
    tracks:{
      CR:'x---------------'+'----------------'+'----------------'+'----------------',
      CH:'--x-x-x-x-x-x-x-'+'x-x-x-x-x-x-x-x-'+'x-o-x-o-x-o-x-o-'+'x-x-x-x---------',
      CC:'----x-------x---'+'----x-------x-g-'+'----x-------x---'+'----x---xx-xx-x-',
      T1:'----------------'+'----------------'+'----------------'+'-----------x----',
      TB:'----------------'+'----------------'+'----------------'+'---------------x',
      GC:'x-------x-------'+'x-------x---x---'+'x-------x-------'+'x-------x-------'
    } }),
  defi:{ bpm:100, texte:"Enchaîner les 4 mesures 3 fois de suite sans erreur à 100 BPM." },
  conseils:["Bravo : à ce stade tu peux jouer sur la majorité des morceaux pop/rock. La suite : les rythmes connus !"]
}
];

export function leconParId(id){ return LECONS.find(l => l.id === id); }
