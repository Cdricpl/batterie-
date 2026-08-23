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

La progression (leçons terminées, temps de pratique, meilleurs tempos) est
enregistrée dans le navigateur.

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
- **Tempo progressif** : +N BPM toutes les X boucles jusqu'à un maximum — la
  meilleure méthode pour gagner en vitesse sans se dégrader.
- **Mixer** : couper ou baisser un élément pour travailler les autres séparément
  (par exemple couper le charleston pour n'entendre que pied + caisse claire).
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

**Le plus simple** : double-cliquer sur `index.html`.

Si le navigateur bloque les modules JavaScript en `file://`, lance un petit serveur
local depuis le dossier du projet :

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
```

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
