# 🥁 Ma Batterie — apprendre la batterie pas à pas

Application web pour apprendre la batterie **en partant de zéro**, conçue pour la
configuration de kit suivante : grosse caisse, caisse claire, deux toms, tom basse,
charleston, crash et ride.

👉 **Aucune installation, aucun compte, aucun fichier son à télécharger.**
Il suffit d'ouvrir `index.html` dans un navigateur récent.

---

## Ce que contient l'application

### 📚 Parcours — 25 leçons progressives
Cinq niveaux, dans l'ordre, avec pour chaque leçon un objectif, une explication,
une partition jouable, des conseils et parfois un défi de tempo :

| Niveau | Contenu |
|---|---|
| 1 | Découverte du kit, pulsation, grosse caisse sur 1-3, backbeat, **premier groove complet** |
| 2 | Croches, **groove rock 8 temps**, variantes de grosse caisse, syncope, premier break |
| 3 | Doubles-croches, charleston ouvert, ghost notes, funk 16 temps, breaks courts |
| 4 | Triolets, shuffle, reggae one drop, ride jazz, bossa nova |
| 5 | Doubles au pied, half-time, tempos rapides, nuances, **construire un morceau** |

La progression est enregistrée dans le navigateur, et l'onglet **📈 Ma progression**
en fait le bilan : leçons terminées, pourcentage du parcours, temps de pratique des
trois dernières semaines, jours d'affilée, meilleur tempo atteint sur chaque leçon et
défis réussis. Un clic sur le numéro d'une leçon la rouvre.

### 🎵 Rythmes connus — 28 grooves
Rock, rock 16 temps, rythme de stade, four on the floor, Motown, funk, boom bap,
Bo Diddley, shuffle, half-time shuffle, reggae (one drop et steppers), ska, bossa,
ride jazz, train beat, punk, d-beat, métal, blast beat, valse, 6/8, groove aux toms,
second line, samba, afrobeat…

### 🥁 Breaks & fills — 9 breaks
Chaque break est présenté sous la forme **1 mesure de groove + 1 mesure de break**,
en boucle : c'est l'enchaînement qui se travaille, pas le break tout seul.

### ⏱️ Entraînement — 10 exercices
Frappes simples, doubles frappes, paradiddle (avec le **doigté D/G affiché sous la
portée**), indépendance main/pied, doubles à la grosse caisse, charleston ouvert,
tenue du tempo.

---

## Comment ça marche

- **Les partitions se lisent toutes seules.** Appuie sur *Écouter* : une tête de
  lecture orange avance sur les notes, la partition défile, les notes s'allument et
  le schéma du kit indique quel élément est frappé.
- **Deux affichages** : la vraie **partition** (portée, hampes, ligatures, silences,
  accents, ghost notes, triolets, charleston ouvert…) et une **grille** de type
  boîte à rythmes, beaucoup plus simple pour débuter. Ou les deux à la fois.
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
- **Impression** : le bouton 🖨️ sort la partition seule, en noir sur blanc et en
  paysage, pour la poser sur un pupitre. (Idéal sur 1 ou 2 mesures ; au-delà la
  portée est réduite pour tenir sur une page.)
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
| `-` | silence |

`res` = nombre de pas par temps : `1` noires, `2` croches, `3` triolets,
`4` doubles-croches. `unite:8` pour les mesures en x/8.

Ajouter un rythme = ajouter un objet dans `js/patterns.js`. Ajouter une leçon =
ajouter un objet dans `js/lessons.js`. Rien d'autre à toucher : la partition, la
grille, l'audio et la lecture automatique s'en déduisent.

---

## Organisation des fichiers

```
index.html            interface
css/styles.css        thème sombre « salle de répète »
js/instruments.js     définition des éléments (position sur la portée, couleur, touche)
js/audio.js           synthèse des sons de batterie (Web Audio, aucun échantillon)
js/notation.js        moteur de partition SVG + vue grille
js/player.js          lecture audio planifiée + tête de lecture
js/patterns.js        bibliothèque de rythmes, breaks et exercices
js/lessons.js         les 25 leçons
js/kit.js             schéma du kit
js/progress.js        progression sauvegardée (localStorage)
js/app.js             assemblage de l'interface
build.js              fabrique ma-batterie.html (fichier unique autonome)
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
