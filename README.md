# 🥁 Ma Batterie — apprendre la batterie pas à pas

Application web pour apprendre la batterie **en partant de zéro**, conçue pour la
configuration de kit suivante : grosse caisse, caisse claire, deux toms, tom basse,
charleston, crash et ride.

👉 **Aucune installation, aucun compte, aucun fichier son à télécharger.**
Il suffit d'ouvrir `index.html` dans un navigateur récent.

---

## Ce que contient l'application

### 📚 Parcours — 31 leçons progressives
Six niveaux, dans l'ordre, avec pour chaque leçon un objectif, une explication,
une partition jouable, des conseils et parfois un défi de tempo :

| Niveau | Contenu |
|---|---|
| 1 | Découverte du kit, pulsation, grosse caisse sur 1-3, backbeat, **premier groove complet** |
| 2 | Croches, **groove rock 8 temps**, variantes de grosse caisse, syncope, premier break |
| 3 | Doubles-croches, charleston ouvert, ghost notes, funk 16 temps, breaks courts |
| 4 | Triolets, shuffle, reggae one drop, ride jazz, bossa nova |
| 5 | Doubles au pied, half-time, tempos rapides, nuances, **construire un morceau** |
| 6 | Paradiddle en groove, flams et drags, jeu linéaire, 7/8 et 5/4, 12/8, triples-croches |

La progression est enregistrée dans le navigateur, et l'onglet **📈 Ma progression**
en fait le bilan : leçons terminées, pourcentage du parcours, temps de pratique des
trois dernières semaines, jours d'affilée, meilleur tempo atteint sur chaque leçon et
défis réussis. Un clic sur le numéro d'une leçon la rouvre.

### 🎵 Rythmes — 40 grooves
Rock, rock 16 temps, rythme de stade, four on the floor, Motown, funk, boom bap,
Bo Diddley, shuffle, half-time shuffle, reggae (one drop et steppers), ska, bossa,
ride jazz, train beat, punk, d-beat, métal, blast beat, valse, 6/8, groove aux toms,
second line, samba, afrobeat, drum'n'bass, trap, linéaire, 7/8, 5/4, 12/8…

### 💿 Morceaux connus — 23 titres
We Will Rock You, Seven Nation Army, Billie Jean, Back in Black, Another One Bites
the Dust, Smells Like Teen Spirit, Zombie, Walk This Way, Superstition, Rosanna,
Money (7/4), Take Five (5/4), Alors on danse, Get Lucky…

Chaque morceau est découpé en **sections** (intro, couplet, refrain, break) : un clic
sur une section la joue seule, en boucle. Le tempo est celui du disque (vérifié sur
les bases de tempo publiques). Chaque titre indique honnêtement ce qu'il contient :
**groove d'origine simplifié**, ou **groove d'accompagnement** qui colle au morceau
pour jouer par-dessus l'enregistrement — ce ne sont pas des transcriptions intégrales.

### 🥢 Rudiments — 21
D'après la liste des 40 rudiments de la Percussive Arts Society : roulements (simple,
double, 5, 6, 7, 9…), paradiddles (simple, double, triple, paradiddle-diddle), flams
(flam accent, flam tap, flamacue, flam paradiddle, triolet suisse), drags (drag tap,
ratamacue). Doigté D/G sous chaque note.

### 🥁 Breaks & fills — 15 breaks
Chaque break est présenté sous la forme **1 mesure de groove + 1 mesure de break**,
en boucle : c'est l'enchaînement qui se travaille, pas le break tout seul.

Dont triolets main-main-pied (style Bonham), paradiddle sur les toms, roulement de 6,
triples-croches.

### ⏱️ Exercices — 8
Indépendance main/pied, doubles à la grosse caisse, charleston ouvert, tenue du tempo.

---

## Comment ça marche

- **Les partitions se lisent toutes seules.** Appuie sur *Écouter* : une tête de
  lecture orange avance sur les notes, la partition défile, les notes s'allument et
  le schéma du kit indique quel élément est frappé.
- **Deux affichages** : la vraie **partition** (portée, hampes, ligatures, silences,
  accents, ghost notes, triolets, charleston ouvert…) et une **grille** de type
  boîte à rythmes, beaucoup plus simple pour débuter. Ou les deux à la fois.
- **Plein écran** : la partition en grand, découpée en lignes de 1 à 4 mesures selon
  la taille de l'écran. Pendant la lecture, **la partition tourne la page** : quand la
  phrase est finie, elle saute à la ligne suivante. Un toucher sur la partition lance
  ou arrête la lecture ; l'écran ne se met pas en veille pendant qu'on joue.
- **Comptage affiché** sous chaque note (`1 e et a`, `1 la li`…).
- **Métronome**, **décompte** d'une mesure, **boucle**, **tap tempo**.
- **Métronome à la noire, aux croches ou aux doubles-croches** (aux triolets sur les
  rythmes ternaires) : le clic s'adapte au rythme affiché, avec un son plus fort sur
  le premier temps.
- **÷2 / ×2** : passer en demi-tempo pour déchiffrer, puis revenir, en un clic.
- **Tempo progressif** : +N BPM toutes les X boucles jusqu'à un maximum — la
  meilleure méthode pour gagner en vitesse sans se dégrader.
- **Mixer avec solo et mute** : couper un élément, ou n'en garder qu'un seul
  (« S ») pour travailler un membre à la fois — par exemple n'entendre que la
  grosse caisse sous le charleston.
- **Impression** : le bouton « Imprimer » sort la partition seule, en noir sur blanc,
  en paysage et **découpée en lignes de 4 mesures** avec les repères de sections,
  pour la poser sur un pupitre.
- **Mode jeu** : joue la partition au clavier, l'appli mesure ton écart en
  millisecondes et te donne un pourcentage « en place » à chaque boucle.

### Touches du clavier

| Touche | Élément |
|---|---|
| `Espace` | Grosse caisse |
| `F` / `J` | Caisse claire |
| `D` / `K` | Charleston |
| `S` | Charleston ouvert |
| `A` | Charleston au pied |
| `I` / `O` / `P` | Tom 1 / Tom 2 / Tom basse |
| `E` / `R` | Crash / Ride |
| `Entrée` | Lecture / arrêt |

---

## Installer sur un téléphone

Le dossier `site/` (généré par `node build.js --site`) est une **application web
installable** : icône sur l'écran d'accueil, plein écran, et fonctionnement **hors
connexion** grâce à un service worker. Il doit être publié en HTTPS (Netlify,
GitHub Pages…) — `netlify.toml` est prêt pour Netlify.

Une fois le site ouvert sur le téléphone :

- **Android (Chrome)** : bouton **Installer** en haut de l'appli, ou menu ⋮ →
  *Installer l'application*.
- **iPhone (Safari)** : bouton **Installer** en haut de l'appli, qui explique :
  *Partager* → *Sur l'écran d'accueil* → *Ajouter*.

Sur iPhone, le son est joué même quand le téléphone est en mode silencieux.

## Lancer l'application

**Le plus simple** : double-cliquer sur **`ma-batterie.html`** — tout est dedans, ça
marche sans serveur et sans connexion.

Pour travailler sur les sources (`index.html` + `js/` + `css/`), il faut un serveur
local : les navigateurs bloquent les modules JavaScript ouverts en `file://`.

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

**Publication en ligne** : le projet est 100 % statique, il peut être publié tel quel
avec GitHub Pages (Settings → Pages → Branch : cette branche, dossier `/`).

---

## Notation utilisée dans le code

Les rythmes sont écrits sous forme de chaînes de caractères, un caractère par pas :

```js
{ beats:4, res:4, bars:1,              // 4 temps, 4 pas par temps (doubles-croches)
  tracks:{
    CH:'xxxxxxxxxxxxxxxx',             // charleston en doubles-croches
    CC:'--g-X--g-g-gX--g',             // caisse claire : ghosts + accents
    GC:'x--x------x---x-'              // grosse caisse
  } }
```

| Signe | Sens |
|---|---|
| `x` | frappe normale |
| `X` | frappe accentuée (`>` sur la partition) |
| `g` | ghost note (notée entre parenthèses) |
| `o` | charleston ouvert (petit cercle) |
| `f` | flam (petite note d'agrément) |
| `d` | drag (deux notes d'agrément) |
| `-` | silence |

`res` = nombre de pas par temps : `1` noires, `2` croches, `3` triolets,
`4` doubles-croches, `6` sextolets, `8` triples-croches. `unite:8` pour les mesures
en x/8.

Un morceau (`js/songs.js`) est une suite de sections `{ nom, fois, bars, tracks }` ;
`compilerMorceau()` les déplie en un seul motif.

Ajouter un rythme = ajouter un objet dans `js/patterns.js`. Ajouter une leçon =
ajouter un objet dans `js/lessons.js`. Rien d'autre à toucher : la partition, la
grille, l'audio et la lecture automatique s'en déduisent.

---

## Version

Le numéro de version est affiché en haut de l'écran, à côté du nom. Il est défini à
un seul endroit, `js/version.js` : l'augmenter à chaque livraison. Le site installable
s'en sert pour son cache hors ligne, ce qui oblige les téléphones à prendre la nouvelle
version.

## Organisation des fichiers

```
index.html            interface
css/styles.css        thème « salle de répète » (voir plus bas)
js/instruments.js     définition des éléments (position sur la portée, couleur, touche)
js/audio.js           synthèse des sons de batterie (Web Audio, aucun échantillon)
js/notation.js        moteur de partition SVG + vue grille
js/player.js          lecture audio planifiée + tête de lecture
js/patterns.js        bibliothèque de rythmes, breaks et exercices
js/rudiments.js       les rudiments
js/songs.js           les morceaux connus et leur découpage en sections
js/lessons.js         les 31 leçons
js/kit.js             schéma du kit
js/progress.js        progression sauvegardée (localStorage)
js/app.js             assemblage de l'interface
build.js              fabrique ma-batterie.html (fichier unique) et site/ (installable)
manifest.webmanifest  description de l'application pour l'installation
sw.js                 service worker : fonctionnement hors connexion
icons/                icônes de l'application
netlify.toml          publication sur Netlify
ma-batterie.html      l'application entière en un seul fichier — à double-cliquer
```

`node build.js` régénère le fichier unique après chaque modification. Comme tout se
retrouve alors dans la même portée JavaScript, le script refuse de produire un fichier
où deux modules déclarent le même nom, et indique lequel renommer.

Tous les sons sont **synthétisés** en Web Audio (grosse caisse, caisse claire,
charleston, toms, cymbales) : l'application fonctionne hors ligne et pèse quelques
dizaines de kilo-octets.

---

## Conseils d'utilisation

1. Fais les leçons **dans l'ordre**, même celles qui semblent trop faciles.
2. Toujours **avec le métronome**, toujours **plus lentement que tu ne le voudrais**.
3. Une leçon est acquise quand tu tiens **une minute sans erreur**, pas quand tu l'as
   réussie une fois.
4. 15 minutes tous les jours valent mieux que 2 heures le dimanche — l'onglet
   *Ma progression* te montre ta régularité.

---

## Design et accessibilité

Le thème reprend la pièce de répétition : fond **mousse acoustique**, surfaces
**chrome**, accent **laiton** des cymbales, rouge du **tapis** pour la lecture en
cours. Titres en *Big Shoulders* (lettrage de flight-case), texte en *Atkinson
Hyperlegible* (lisible à un mètre de l'écran), chiffres en *IBM Plex Mono*. Hors
connexion, les polices de secours du système prennent le relais.

- Contrastes vérifiés : texte ≥ 4,5:1, éléments graphiques de la partition ≥ 3:1.
- Navigation complète au clavier, focus visible, onglets et boutons annoncés aux
  lecteurs d'écran, fenêtre d'aide qui se ferme avec Échap.
- `prefers-reduced-motion` respecté ; cibles tactiles agrandies sur écran tactile.

Sources des tempos et de la liste des rudiments : [Percussive Arts Society](https://pas.org/rudiments/),
[Vic Firth — 40 Essential Rudiments](https://ae.vicfirth.com/education/40-essential-rudiments/),
[SongBPM](https://songbpm.com), [GetSongBPM](https://getsongbpm.com), [Tunebat](https://tunebat.com).
