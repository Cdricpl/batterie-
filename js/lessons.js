/* Parcours pédagogique : 50 leçons progressives, du tout premier coup à l'improvisation. */

const p = (o) => ({ beats:4, res:4, bars:1, bpm:[50,80,140], ...o });

export const NIVEAUX = [
  { n:1, nom:'Niveau 1 — Les tout premiers pas', couleur:'#5cc8a8' },
  { n:2, nom:'Niveau 2 — Les croches et le vrai groove', couleur:'#8eabbf' },
  { n:3, nom:'Niveau 3 — Doubles-croches, nuances, breaks', couleur:'#d9a441' },
  { n:4, nom:'Niveau 4 — Ternaire et styles', couleur:'#e58a3f' },
  { n:5, nom:'Niveau 5 — Aller plus loin', couleur:'#e5584b' },
  { n:6, nom:'Niveau 6 — Avancé', couleur:'#aaa0c6' }
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
  id:'l05', niveau:1, cle:true, titre:'Ton premier groove complet', duree:'20 min',
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
  id:'l07', niveau:2, cle:true, titre:'Le groove rock 8 temps', duree:'25 min',
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
  id:'l25', niveau:5, cle:true, titre:'Construire un morceau', duree:'40 min',
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
},
{
  id:'l26', niveau:6, titre:'Le paradiddle devient un groove', duree:'30 min',
  objectif:"Transformer un rudiment en rythme.",
  contenu:`
    <p>Joue le paradiddle (D-G-D-D / G-D-G-G) avec la <b>main droite au charleston</b> et la
    <b>main gauche à la caisse claire</b>. Surprise : les deux accents de caisse claire tombent pile sur
    <b>2 et 4</b>. Les autres coups de main gauche deviennent des ghost notes.</p>
    <p>C'est comme ça que les batteurs funk construisent leurs grooves : un rudiment réparti sur le kit.</p>
    <p>Prérequis : le paradiddle à 80 BPM (onglet <b>Entraînement → Rudiments</b>).</p>`,
  pattern: p({ id:'l26-p', nom:'Groove paradiddle', res:4, bars:2, bpm:[45,70,110],
    tracks:{ CH:'x-xx-x--x-xx-x--'.repeat(2), CC:'-g--X-gg-g--X-gg'.repeat(2), GC:'x-------x-------'.repeat(2) },
    doigte:'DGDDGDGGDGDDGDGG'.repeat(2) }),
  conseils:["Les ghost notes doivent être presque inaudibles : seuls 2 et 4 claquent."]
},
{
  id:'l27', niveau:6, titre:'Flams et drags dans le jeu', duree:'30 min',
  objectif:"Épaissir le son avec les notes d'agrément.",
  contenu:`
    <p>Le <b>flam</b> (une note d'agrément) et le <b>drag</b> (deux notes d'agrément rebondies) donnent de
    l'épaisseur à une frappe. Ici, un <b>flam accent</b> en triolets : un flam sur chaque temps, en alternant
    la main qui fait le flam.</p>
    <p>La règle d'or : la main de l'agrément part de <b>très bas</b> (2 cm), la main principale de haut (15 cm).
    Elles tombent presque ensemble, mais pas tout à fait.</p>`,
  pattern: p({ id:'l27-p', nom:'Flam accent', res:3, bars:2, bpm:[40,60,110],
    tracks:{ CC:'fxxfxxfxxfxx'.repeat(2), GC:'x-----x-----'.repeat(2) }, doigte:'DGDGDGDGDGDG'.repeat(2) }),
  conseils:["Si tu entends « fla-fla » (deux notes égales), la note d'agrément est trop haute."]
},
{
  id:'l28', niveau:6, titre:'Le jeu linéaire', duree:'35 min',
  objectif:"Ne jamais jouer deux éléments en même temps.",
  contenu:`
    <p>Dans un groove <b>linéaire</b>, chaque double-croche est jouée par un seul élément : charleston,
    caisse claire ou grosse caisse, jamais deux à la fois. Le groove devient une mélodie de timbres.</p>
    <p>Regarde la grille : chaque colonne ne contient qu'une seule case pleine.</p>`,
  pattern: p({ id:'l28-p', nom:'Groove linéaire', res:4, bars:2, bpm:[50,75,115],
    tracks:{ CH:'-xx--xx--xx--x-x'.repeat(2), CC:'----X-------X-g-'.repeat(2), GC:'x--x---xx--x----'.repeat(2) } }),
  defi:{ bpm:95, texte:"Tenir 1 minute à 95 BPM, sans jamais doubler une note." },
  conseils:["Passe en vue « Grille » : on y voit immédiatement l'enchaînement."]
},
{
  id:'l29', niveau:6, titre:'Mesures composées : 7/8 et 5/4', duree:'40 min',
  objectif:"Jouer en dehors du 4/4.",
  contenu:`
    <p>Une mesure en <b>7/8</b> contient sept croches. On ne les compte pas une par une : on les
    <b>groupe</b>, ici 2 + 2 + 3 (« 1-2, 1-2, 1-2-3 »). La grosse caisse marque le début de chaque grand groupe.</p>
    <p>Même principe pour le <b>5/4</b> (3 + 2) : essaie le « Rock en 5/4 » et le morceau <b>Money</b> (7/4)
    dans les onglets Rythmes et Morceaux.</p>`,
  pattern: p({ id:'l29-p', nom:'Rock en 7/8', beats:7, unite:8, res:1, bars:2, bpm:[120,168,220],
    tracks:{ CH:'xxxxxxx'.repeat(2), CC:'--x--x-'.repeat(2), GC:'x---x--'.repeat(2) } }),
  conseils:["Le tempo compte les croches. Chante les groupes à voix haute avant de jouer."]
},
{
  id:'l30', niveau:6, titre:'Le 12/8 : le blues lent', duree:'30 min',
  objectif:"Sentir quatre grands temps de trois croches.",
  contenu:`
    <p>Le <b>12/8</b> regroupe douze croches en quatre groupes de trois. On sent 4 grands temps,
    chacun divisé en 3 : c'est un ternaire écrit autrement.</p>
    <p>La ride joue toutes les croches, la caisse claire marque le 2<sup>e</sup> et le 4<sup>e</sup> grand temps.</p>`,
  pattern: p({ id:'l30-p', nom:'Blues en 12/8', beats:12, unite:8, res:1, bars:2, bpm:[120,168,210],
    tracks:{ RD:'xxxxxxxxxxxx'.repeat(2), CC:'---x-----x--'.repeat(2), GC:'x-----x-----'.repeat(2) } }),
  conseils:["Accentue légèrement la 1re croche de chaque groupe de trois à la ride."]
},
{
  id:'l31', niveau:6, cle:true, titre:'Triples-croches et roulements', duree:'40 min',
  objectif:"Jouer huit notes dans un temps.",
  contenu:`
    <p>Une <b>triple-croche</b> vaut la moitié d'une double : <b>8 par temps</b>, notées avec trois barres.
    On les utilise pour les roulements qui lancent un refrain.</p>
    <p>Mains alternées, poignets très souples, mouvements minuscules. Travaille-les d'abord à 50 BPM.</p>
    <p>Encore quelques leçons et tu auras fini le parcours. Travaille aussi les <b>morceaux</b> et les <b>rudiments</b>.</p>`,
  pattern: p({ id:'l31-p', nom:'Groove + roulement', res:8, bars:2, bpm:[45,60,95],
    tracks:{
      CR:'x' + '-'.repeat(31) + '-'.repeat(32),
      CH:'----x---x---x---x---x---x---x---' + 'x---x---x---x---x---x-----------',
      CC:'--------x---------------x-------' + '--------x---------------xxxxxxxx',
      GC:'x---------------x---------------' + 'x---------------x---------------' },
    doigte:'-'.repeat(56) + 'DGDGDGDG' }),
  defi:{ bpm:72, texte:"Roulement régulier à 72 BPM, et retour pile sur la crash." },
  conseils:["Si les triples-croches se tassent, reviens aux doubles-croches au même tempo × 2."]
}
];

const R16 = () => '-'.repeat(16);

/* ======================= LEÇONS SUPPLÉMENTAIRES =======================
 * Rangées dans leur niveau au moment du tri, à la fin de ce fichier. */
LECONS.push(
/* ---------------------------- niveau 1 ---------------------------- */
{
  id:'l32', niveau:1, titre:'Tenir les baguettes et laisser rebondir', duree:'10 min',
  objectif:"Frapper sans crispation, en laissant la baguette rebondir.",
  contenu:`
    <p>La baguette se tient au <b>point d'équilibre</b>, à environ un tiers de son extrémité : c'est là qu'elle rebondit le mieux.
    Pouce et index pincent, les trois autres doigts accompagnent sans serrer.</p>
    <p>Le geste : la baguette part du haut, frappe, et <b>remonte toute seule</b> grâce au rebond. Tu ne « tapes » pas,
    tu lâches la baguette et tu la rattrapes.</p>
    <p>Joue des noires à la caisse claire, mains alternées (D = droite, G = gauche).</p>`,
  pattern: p({ id:'l32-p', nom:'Noires main à main', res:1, bars:2, bpm:[40,60,100],
    tracks:{ CC:'xxxx'.repeat(2) }, doigte:'DGDG'.repeat(2) }),
  conseils:["Si tes mains fatiguent vite, tu serres trop : desserre les trois derniers doigts.",
            "Regarde tes deux baguettes : elles doivent monter à la même hauteur."]
},
{
  id:'l33', niveau:1, titre:'Compter les silences', duree:'15 min',
  objectif:"Jouer des noires et des soupirs (silences) au bon moment.",
  contenu:`
    <p>Un <b>soupir</b> est un silence d'un temps. Il se compte exactement comme une note : on ne le joue pas, mais il occupe sa place.</p>
    <p>Compte à voix haute « 1 – 2 – 3 – 4 » et ne frappe que là où il y a une note. Les silences sont le vrai exercice.</p>`,
  pattern: p({ id:'l33-p', nom:'Noires et silences', res:1, bars:2, bpm:[40,60,100],
    tracks:{ CC:'x-x-' + 'xx-x', CH:'xxxx' + 'xxxx' } }),
  conseils:["Tape du pied sur chaque temps pendant les silences : ton corps garde le compte.",
            "Passe en vue « Grille » pour voir les cases vides."]
},
{
  id:'l34', niveau:1, titre:'La crash pour marquer le départ', duree:'15 min',
  objectif:"Frapper la crash avec la grosse caisse sur le 1.",
  contenu:`
    <p>La <b>crash</b> sert à marquer un départ : le début d'un refrain, la fin d'un break. Elle se joue <b>toujours avec la grosse caisse</b>
    pour que le son soit plein.</p>
    <p>Ici : le groove de base pendant deux mesures, avec la crash (et le pied) sur le 1 de la première.</p>`,
  pattern: p({ id:'l34-p', nom:'Groove + crash', res:1, bars:2, bpm:[45,70,120],
    tracks:{ CR:'x---' + '----', CH:'-xxx' + 'xxxx', CC:'-x-x' + '-x-x', GC:'x-x-' + 'x-x-' } }),
  conseils:["La main droite quitte le charleston pour la crash, puis revient aussitôt : prépare le trajet.",
            "Frappe la crash en glissant sur le bord, sans l'écraser."]
},
/* ---------------------------- niveau 2 ---------------------------- */
{
  id:'l35', niveau:2, titre:'Les croches main à main', duree:'15 min',
  objectif:"Jouer des croches régulières à la caisse claire, en alternant.",
  contenu:`
    <p>Deux notes par temps, mains alternées. Compte « <b>1 et 2 et 3 et 4 et</b> » : la main droite joue les chiffres, la gauche les « et ».</p>
    <p>Les deux mains doivent sonner pareil : même hauteur, même endroit sur la peau.</p>`,
  pattern: p({ id:'l35-p', nom:'Croches alternées', res:2, bars:2, bpm:[45,70,140],
    tracks:{ CC:'xxxxxxxx'.repeat(2) }, doigte:'DGDGDGDG'.repeat(2) }),
  conseils:["Enregistre-toi avec le téléphone : la main faible s'entend tout de suite."]
},
{
  id:'l36', niveau:2, titre:'La grosse caisse sur le « et »', duree:'20 min',
  objectif:"Placer un coup de pied entre deux temps.",
  contenu:`
    <p>Jusqu'ici, la grosse caisse jouait sur les temps. On ajoute un coup sur le <b>« et » du 2</b> : le groove prend de l'élan.</p>
    <p>Ce coup tombe <b>avec une croche du charleston</b> : main droite et pied ensemble, sans caisse claire.</p>`,
  pattern: p({ id:'l36-p', nom:'Rock avec pied sur le « et »', res:2, bars:2, bpm:[50,80,140],
    tracks:{ CH:'xxxxxxxx'.repeat(2), CC:'--x---x-'.repeat(2), GC:'x--xx---'.repeat(2) } }),
  defi:{ bpm:100, texte:"Tenir 1 minute à 100 BPM, sans que le pied du « et » ne se décale." },
  conseils:["Joue d'abord charleston + pied seuls, sans la caisse claire."]
},
{
  id:'l37', niveau:2, titre:'Le rock à la ride', duree:'15 min',
  objectif:"Passer du charleston à la ride pour changer de couleur.",
  contenu:`
    <p>La <b>ride</b> (grande cymbale à droite) remplace le charleston dans les refrains : le son s'ouvre et grossit.</p>
    <p>Joue une mesure au charleston, une mesure à la ride : la main droite fait l'aller-retour sans perdre une croche.</p>`,
  pattern: p({ id:'l37-p', nom:'Charleston puis ride', res:2, bars:2, bpm:[50,80,140],
    tracks:{ CH:'xxxxxxxx' + '--------', RD:'--------' + 'xxxxxxxx', CC:'--x---x-'.repeat(2), GC:'x---x---'.repeat(2) } }),
  conseils:["Frappe la ride avec la pointe de la baguette, à mi-chemin entre le bord et la cloche."]
},
/* ---------------------------- niveau 3 ---------------------------- */
{
  id:'l38', niveau:3, titre:'Le charleston au pied', duree:'20 min',
  objectif:"Fermer le charleston au pied sur 2 et 4 pendant que la main joue la ride.",
  contenu:`
    <p>Le pied gauche n'est pas qu'un support : en fermant le charleston, il produit un « <b>tchk</b> » sec.
    Sur 2 et 4, il double le backbeat.</p>
    <p>Talon au sol, la pointe du pied appuie d'un coup sec, puis remonte.</p>`,
  pattern: p({ id:'l38-p', nom:'Ride + charleston au pied', res:2, bars:2, bpm:[50,80,140],
    tracks:{ RD:'xxxxxxxx'.repeat(2), CC:'--x---x-'.repeat(2), GC:'x---x---'.repeat(2), HP:'--x---x-'.repeat(2) } }),
  conseils:["Travaille d'abord les deux pieds seuls : droit sur 1 et 3, gauche sur 2 et 4."]
},
{
  id:'l39', niveau:3, titre:'Les accents dans les doubles-croches', duree:'20 min',
  objectif:"Faire ressortir une note sur quatre sans accélérer.",
  contenu:`
    <p>Un <b>accent</b> (&gt;) est une note plus forte. Ici, la première double-croche de chaque temps est accentuée,
    les trois autres restent douces.</p>
    <p>Le secret : <b>la hauteur de la baguette</b>. Haute pour l'accent, basse pour les autres. Pas de force en plus.</p>`,
  pattern: p({ id:'l39-p', nom:'Accents sur les temps', res:4, bars:2, bpm:[45,65,110],
    tracks:{ CC:'XxxxXxxxXxxxXxxx'.repeat(2), GC:'x---x---x---x---'.repeat(2) }, doigte:'DGDGDGDGDGDGDGDG'.repeat(2) }),
  conseils:["Après l'accent, la baguette doit s'arrêter bas : c'est le « coup arrêté » (downstroke)."]
},
{
  id:'l40', niveau:3, cle:true, titre:'Le fill en situation', duree:'25 min',
  objectif:"Enchaîner trois mesures de groove et une mesure de break, sans perdre le tempo.",
  contenu:`
    <p>Dans une chanson, les breaks arrivent <b>toutes les 4 ou 8 mesures</b>. Il faut compter les mesures en jouant.</p>
    <p>Ici : trois mesures de groove, puis un fill d'un temps à la fin de la 4<sup>e</sup>, et la crash sur le 1 qui suit (écoute la boucle).</p>
    <p>Compte « <b>1</b>-2-3-4, <b>2</b>-2-3-4, <b>3</b>-2-3-4, <b>4</b>-2-3-FILL ».</p>`,
  pattern: p({ id:'l40-p', nom:'3 mesures + fill', res:4, bars:4, bpm:[50,80,130],
    tracks:{
      CR:'x---------------' + R16() + R16() + R16(),
      CH:'--x-x-x-x-x-x-x-' + 'x-x-x-x-x-x-x-x-' + 'x-x-x-x-x-x-x-x-' + 'x-x-x-x-x-x-----',
      CC:'----x-------x---' + '----x-------x---' + '----x-------x---' + '----x-------xx--',
      T1:R16() + R16() + R16() + '--------------x-',
      TB:R16() + R16() + R16() + '---------------x',
      GC:'x-------x-------' + 'x-------x-------' + 'x-------x-------' + 'x-------x-------' } }),
  defi:{ bpm:100, texte:"Enchaîner 4 cycles complets à 100 BPM, crash pile sur le 1 à chaque fois." },
  conseils:["Le fill ne doit ni accélérer ni ralentir : c'est l'erreur la plus fréquente."]
},
/* ---------------------------- niveau 4 ---------------------------- */
{
  id:'l41', niveau:4, titre:'Le shuffle', duree:'25 min',
  objectif:"Jouer le balancement « long-court » du blues.",
  contenu:`
    <p>Le <b>shuffle</b> découpe chaque temps en triolet, mais ne joue que la 1<sup>re</sup> et la 3<sup>e</sup> note :
    « <b>DOUM</b>-da <b>DOUM</b>-da ». On obtient un balancement long-court.</p>
    <p>Le charleston joue ce balancement, la caisse claire le backbeat sur 2 et 4, le pied sur 1 et 3.</p>`,
  pattern: p({ id:'l41-p', nom:'Shuffle', res:3, bars:2, bpm:[60,90,140],
    tracks:{ CH:'x-xx-xx-xx-x'.repeat(2), CC:'---x-----x--'.repeat(2), GC:'x-----x-----'.repeat(2) } }),
  conseils:["Chante « DOUM-da DOUM-da » en jouant : le balancement vient de la voix."]
},
{
  id:'l42', niveau:4, titre:'Le reggae : le one drop', duree:'25 min',
  objectif:"Jouer le groove où le 1 est vide.",
  contenu:`
    <p>En reggae <b>one drop</b>, il n'y a <b>rien sur le 1</b> : grosse caisse et caisse claire tombent ensemble sur le <b>3</b>.
    C'est ce trou qui donne l'impression de flotter.</p>
    <p>Le charleston joue des croches légères, parfois en balancement ternaire.</p>`,
  pattern: p({ id:'l42-p', nom:'One drop', res:2, bars:2, bpm:[60,72,90],
    tracks:{ CH:'xxxxxxxx'.repeat(2), CC:'----x---'.repeat(2), GC:'----x---'.repeat(2) } }),
  conseils:["Résiste à l'envie de jouer le 1 : écoute le vide, c'est lui qui groove."]
},
{
  id:'l43', niveau:4, titre:'La bossa nova', duree:'30 min',
  objectif:"Jouer le motif brésilien avec les deux mains et le pied.",
  contenu:`
    <p>La <b>bossa nova</b> repose sur un pied qui joue « <b>1 . . et 2</b> » en boucle (comme un cœur qui bat),
    un charleston en croches régulières, et la main gauche qui joue la « clave » à la caisse claire (souvent en cross-stick).</p>
    <p>Joue doucement : c'est une musique feutrée.</p>`,
  pattern: p({ id:'l43-p', nom:'Bossa nova', res:4, bars:2, bpm:[60,80,120],
    tracks:{
      CH:'x-x-x-x-x-x-x-x-'.repeat(2),
      CC:'x--x--x---x--x--' + '--x--x--x--x----',
      GC:'x--xx--xx--xx--x'.repeat(2) } }),
  conseils:["Travaille le pied seul pendant 2 minutes avant d'ajouter les mains."]
},
/* ---------------------------- niveau 5 ---------------------------- */
{
  id:'l44', niveau:5, titre:'Le half-time', duree:'25 min',
  objectif:"Donner l'impression que le tempo ralentit de moitié, sans ralentir.",
  contenu:`
    <p>En <b>half-time</b>, la caisse claire ne joue plus que sur le <b>3</b>. Le tempo n'a pas changé, mais la musique paraît deux fois plus lente.</p>
    <p>C'est l'effet idéal pour un pont ou un refrain lourd. Le charleston garde les croches : c'est lui qui tient le vrai tempo.</p>`,
  pattern: p({ id:'l44-p', nom:'Normal puis half-time', res:2, bars:2, bpm:[60,90,140],
    tracks:{ CH:'xxxxxxxx'.repeat(2), CC:'--x---x-' + '----x---', GC:'x---x---' + 'x-----x-' } }),
  conseils:["Joue 4 mesures normales, 4 mesures half-time, en boucle."]
},
{
  id:'l45', niveau:5, titre:'Le double-time', duree:'25 min',
  objectif:"Doubler l'énergie en jouant la caisse claire sur tous les contretemps.",
  contenu:`
    <p>En <b>double-time</b>, la caisse claire joue deux fois plus souvent : sur chaque « et ». Le tempo reste le même,
    mais la musique paraît deux fois plus rapide. C'est le moteur du punk et du thrash.</p>`,
  pattern: p({ id:'l45-p', nom:'Normal puis double-time', res:2, bars:2, bpm:[60,100,160],
    tracks:{ CH:'xxxxxxxx'.repeat(2), CC:'--x---x-' + '-x-x-x-x', GC:'x---x---' + 'x-x-x-x-' } }),
  conseils:["En double-time, allège la main droite : c'est la caisse claire qui porte l'énergie."]
},
{
  id:'l46', niveau:5, titre:'Les ouvertures de charleston en doubles', duree:'30 min',
  objectif:"Ouvrir et fermer le charleston au rythme des doubles-croches.",
  contenu:`
    <p>En disco et en funk, le charleston s'<b>ouvre sur les « et »</b> et se referme aussitôt. Le pied gauche travaille sur des doubles-croches :
    il se lève juste avant l'ouverture et se repose sur la note suivante.</p>`,
  pattern: p({ id:'l46-p', nom:'Ouvertures sur les « et »', res:4, bars:2, bpm:[60,90,120],
    tracks:{ CH:'xxoxxxoxxxoxxxox'.repeat(2), CC:'----x-------x---'.repeat(2), GC:'x---x---x---x---'.repeat(2) } }),
  defi:{ bpm:112, texte:"Tenir 1 minute à 112 BPM avec des ouvertures toutes égales." },
  conseils:["Pied gauche seul d'abord : « haut-bas » sur chaque « et », sans les mains."]
},
/* ---------------------------- niveau 6 ---------------------------- */
{
  id:'l47', niveau:6, titre:'Les doubles au pied', duree:'35 min',
  objectif:"Jouer deux coups de grosse caisse rapides, réguliers et égaux.",
  contenu:`
    <p>Deux doubles-croches au pied : le premier coup vient de la jambe, le second de la <b>cheville</b> qui rebondit
    (technique « heel-toe » ou « slide » selon les batteurs).</p>
    <p>Les deux coups doivent avoir le même volume : c'est le second qui est souvent trop faible.</p>`,
  pattern: p({ id:'l47-p', nom:'Doubles au pied', res:4, bars:2, bpm:[50,70,110],
    tracks:{ CH:'x-x-x-x-x-x-x-x-'.repeat(2), CC:'----x-------x---'.repeat(2), GC:'xx----xxxx------'.repeat(2) } }),
  conseils:["Batte proche de la peau au repos : moins de trajet, plus de vitesse."]
},
{
  id:'l48', niveau:6, titre:'Le polyrythme 3 contre 2', duree:'35 min',
  objectif:"Jouer trois notes d'un côté pendant que l'autre en joue deux.",
  contenu:`
    <p>Un <b>polyrythme</b> superpose deux découpages du temps. Ici, la main droite joue des triolets (3 notes par temps)
    à la ride, la main gauche des croches (2 notes par temps) à la caisse claire.</p>
    <p>Les deux mains ne tombent ensemble que sur le temps. Entre deux temps : ride, caisse claire, ride.</p>`,
  pattern: p({ id:'l48-p', nom:'3 contre 2', res:6, bars:2, bpm:[40,55,90],
    tracks:{ RD:'x-x-x-'.repeat(8), CC:'x--x--'.repeat(8), GC:'x-----'.repeat(8) } }),
  conseils:["Commence à 40 BPM, en disant « en-sem-ble – ri-de – claire – ri-de »."]
},
{
  id:'l49', niveau:6, titre:'Déplacer le backbeat', duree:'35 min',
  objectif:"Décaler le groove d'une double-croche pour surprendre l'oreille.",
  contenu:`
    <p>Le <b>déplacement</b> consiste à jouer un groove connu, mais une double-croche plus tard (ou plus tôt).
    Le même motif sonne tout à coup complètement différent.</p>
    <p>Mesure 1 : le groove normal. Mesure 2 : la caisse claire et la grosse caisse décalées d'une double-croche.</p>`,
  pattern: p({ id:'l49-p', nom:'Groove puis groove décalé', res:4, bars:2, bpm:[50,75,110],
    tracks:{ CH:'x-x-x-x-x-x-x-x-'.repeat(2), CC:'----x-------x---' + '-----x-------x--', GC:'x-------x-------' + '-x-------x------' } }),
  conseils:["Garde le charleston absolument fixe : c'est ta seule référence."]
},
{
  id:'l50', niveau:6, cle:true, titre:'Improviser : échanger quatre mesures', duree:'40 min',
  objectif:"Alterner groove et solo sans jamais perdre la forme.",
  contenu:`
    <p>En jazz comme en rock, on « <b>échange des quatre</b> » : 4 mesures de groove, puis 4 mesures de solo.
    Ici, la partition te donne un exemple : 2 mesures de groove, 2 mesures de solo sur les toms.</p>
    <p>Une fois à l'aise, coupe la batterie (bouton en bas à gauche), garde le métronome, et <b>invente ton propre solo</b>
    pendant les mesures 3 et 4. Le seul impératif : retomber sur le 1.</p>
    <p>Tu as fini le parcours. La suite : les morceaux, les 40 rudiments… et tes propres idées.</p>`,
  pattern: p({ id:'l50-p', nom:'Groove + solo', res:4, bars:4, bpm:[60,90,130],
    tracks:{
      CR:'x---------------' + R16() + R16() + R16(),
      CH:'--x-x-x-x-x-x-x-' + 'x-x-x-x-x-x-x-x-' + R16() + R16(),
      CC:'----x-------x---' + '----x-------x---' + 'x-x-X---xxxx----' + 'X--X--X-xxxx----',
      T1:R16() + R16() + '----x-x-----x-x-' + '------------xx--',
      TB:R16() + R16() + '--------------xx' + '--------------xx',
      GC:'x-------x-------' + 'x-------x-------' + 'x-------x-------' + 'x--x--x---------' } }),
  defi:{ bpm:110, texte:"Improviser 4 cycles complets à 110 BPM, en retombant toujours sur la crash." },
  conseils:["Un bon solo raconte une histoire : commence simple, monte en intensité, termine clairement."]
}
);

/* Les leçons ajoutées se rangent dans leur niveau (tri stable : l'ordre d'origine est conservé) */
LECONS.sort((a, b) => a.niveau - b.niveau);

export function leconParId(id){ return LECONS.find(l => l.id === id); }
