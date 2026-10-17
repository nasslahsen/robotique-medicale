# Semestre 5 : plateforme d'étude, méthode de construction des modules

Lire ce fichier en entier avant toute tâche dans ce dépôt. Il décrit la plateforme, le style pédagogique retenu
et la méthode complète pour construire un module à partir des PDF de cours. La demande type est :
« construis le module X » après avoir déposé les PDF dans `modules/<id>/sources/`.

Site publié : https://nasslahsen.github.io/robotique-medicale/ (le nom du dépôt reste `robotique-medicale`).
Utilisation : uniquement sur iPad, en paysage, au doigt et parfois à l'Apple Pencil. Pas de version téléphone.

## 1. Structure

```
index.html                 tableau de bord : une carte par module, bandeau « Reprendre »
registre.js                registre central : modules, sous-modules, couleurs, statut
commun/                    système de design partagé (ne pas copier dans les modules)
  css/jeu.css              carte du parcours et écran de niveau
  css/cours.css            pages de cours
  css/barre.css            barre du site (retour au semestre, module, onglets Parcours / Cours)
  css/tableau.css          tableau de bord
  js/plateforme.js         chemins, couleur du module, progression (localStorage « s5-progres »)
  js/nav.js                pages de cours : menu, sommaire, « Jouer le niveau », Précédent / Suivant
  js/lib.js                figures des pages de cours (RM) : calculs, SVG 2D/3D, curseurs, étapes
  js/tableau.js            tableau de bord
  jeu/moteur.js            moteur des niveaux : étapes, retours, étoiles, écran de fin
  jeu/moteur-carte.js      page d'accueil d'un module : parcours groupé par sous-module puis chapitre
  jeu/dessin.js, outils.js dessins des niveaux (D) et outils (E)
  vendor/katex/            KaTeX 0.16.11, servi localement
modules/<id>/              un dossier par module actif
  module.js                ordre des pages : chapitres, niveaux, pages de cours
  index.html               accueil du module (parcours)
  jouer.html               écran de niveau (jouer.html#<niveau>)
  niveaux/<niveau>.js      un fichier par niveau
  cours/index.html         sommaire des pages de cours
  cours/<page>.html        une page de cours par notion
  figures/<page>.js        les figures interactives d'une page de cours
  sources/                 PDF du cours (jamais commités ni publiés, voir .gitignore)
modules/_modele/           modèle à copier pour un nouveau module (non publié)
jouer.html, cours.html, concepts/   redirections des anciennes adresses du site de robotique
tests/math.test.js         calculs et réponses attendues de chaque niveau
tests/static-check.js      registre, module.js, fichiers, équations, liens, règles d'écriture
tests/navigateur/          tests dans Chromium : niveaux joués, pages chargées, figures capturées
```

Le tableau de bord, les accueils de module, les menus et Précédent / Suivant sont générés à partir de
`registre.js` et des `module.js`. Aucune liste n'est écrite ailleurs.

Chaque page d'un module porte `<html lang="fr" data-module="<id>">` et charge dans le `<head>` :
`registre.js`, `commun/js/plateforme.js`, puis `module.js`. La couleur du module est appliquée avant l'affichage.

## 2. Registre et couleurs

Chaque module du registre a : `id`, `titre`, `statut` (`actif` ou `a-venir`), `couleur` (forte : accents, barres,
bandeaux, boutons), `clair` (étiquettes des sous-modules), `texte` (même teinte assombrie pour le petit texte
sur fond blanc, contraste au moins 4,5), `sousModules` (`id`, `titre`, éventuellement `statut: "a-venir"`).
Couleurs : celles du schéma Notion de l'utilisatrice, déjà saisies. Ne jamais en inventer d'autres.

Seule la couleur d'accent change d'un module à l'autre : `--jeu`, `--jeu-pale`, `--jeu-texte` en CSS,
`PLATEFORME.couleur()`, `PLATEFORME.clair()`, `PLATEFORME.teinte(alpha)` en JavaScript (`D.C.jeu`, `RM.C.acc`).
Ne jamais écrire une couleur d'accent en dur dans un niveau ou une figure.

## 3. Progression

Une « page » du tableau de bord est un niveau jouable. Elle compte comme terminée quand ses défis sont finis
(écran de résultats), avec 1 à 3 étoiles (3 sans erreur, 2 avec une ou deux, 1 sinon ; la meilleure est gardée).
Les pages de cours servent à relire : elles ne comptent pas, mais elles sont mémorisées comme dernière page.
« Continuer » ouvre la dernière page ouverte du module (après un niveau fini : le niveau suivant).
Tout passe par `PLATEFORME` (`marquer`, `compte`, `continuer`, `noterDernier`, `tout`, `effacer`).

## 4. Construire un module à partir des PDF

1. **Lire tous les PDF** de `modules/<id>/sources/` en entier (pages, formules, exemples, exercices, notations).
   Noter la notation exacte du professeur, les exemples numériques et les exercices corrigés : ils deviennent
   des défis. Rien d'autre ne sert de source, sauf des références réelles et précises.
2. **Plan** : découper en chapitres, rattacher chaque chapitre à un sous-module du registre. Si l'appartenance d'une
   partie à un sous-module n'est pas claire, demander. Ajouter un chapitre 0 « Les bases » quand le module
   suppose des prérequis (mathématiques, physique) que le cours ne rappelle pas.
   Présenter ce plan à l'utilisatrice avant d'écrire, sauf si elle a dit de tout faire d'un coup.
3. **Créer le dossier** : copier `modules/_modele/` en `modules/<id>/`, remplacer `_modele` par `<id>`
   (dans `module.js` et `data-module` de chaque page), supprimer les exemples, passer le module en
   `statut: "actif"` dans `registre.js`.
4. **Écrire les niveaux** (section 5), un fichier `niveaux/<niveau>.js` par notion, puis pour chaque chapitre
   un niveau de révision (`revision: true`) et un boss (`boss: true`). Les ajouter dans `module.js` avec `pret: true`.
5. **Écrire les pages de cours** (section 6), une par notion importante, avec `cours: true` sur le niveau du même id.
6. **Tests** : les réponses attendues de chaque niveau dans `tests/math.test.js` (calculées, jamais recopiées) ;
   un parcours par niveau dans `tests/navigateur/parcours/<id>.js`.
7. **Vérifier** (section 9) et corriger jusqu'à ce que tout passe et que chaque capture soit propre.
8. **Publier** (section 10).

## 5. Style pédagogique : les niveaux

Le cours devient un jeu. On apprend en faisant : une situation d'abord, un défi, un retour immédiat, puis
seulement une explication courte. La formule est la réponse à ce qu'on vient de faire.

**Un niveau** = 3 à 6 étapes courtes qui se débloquent l'une après l'autre, autour d'une figure.
**Une étape** :
1. une situation concrète et une question en une ou deux lignes (« La pince doit viser le flacon : quel angle ? ») ;
2. on agit tout de suite sur la figure ou les commandes : glisser, tourner, toucher, choisir, taper un nombre, poser des jetons ;
3. retour immédiat : une erreur secoue et donne une aide qui montre où regarder ; une bonne réponse coche en vert ;
4. ensuite seulement deux ou trois phrases d'explication et la formule (`j.expliquer`) ;
5. « Continuer ».

**Varier les formats** d'une étape à l'autre : prédire puis révéler, trouver la valeur, construire (jetons à placer),
trouver l'erreur dans une réponse rédigée, comparer deux cas, viser une cible, « pourquoi ? » avec des raisons
pour options, la même idée sur un cas jamais vu. Comprendre, pas réciter.

**Fin de chapitre** : une révision (« RÉV ») qui mélange les idées du chapitre dans des situations nouvelles,
puis un boss plus dur, sans aide avant le premier essai.

**Aides** : chaque mauvaise option a une `aide` qui pointe ce qu'il faut regarder, jamais la réponse brute.

**API d'un niveau** (`NIVEAU({ id, init(fig) → n, etapes: [{ nom, jouer(j, n) }] })`) :
- `fig` : `svg` (viewBox 680 × 600), `bande(html)` (bande de nombres sous la figure), `chip(texte)`, `astuce(texte)`, `coin`.
- `j` : `titre`, `consigne`, `texte`, `zone(classe, html)`, `choix(options, {colonnes, ok})`,
  `nombre({avant, apres, cases: [{attendu, tol}], ligne, colonnes, aide(k), ok})`,
  `jetons({trous, jetons: [{id, html|tex}], aide, ok})`, `curseur({nom, min, max, pas, val, unite, dec, change})`,
  `erreur(html)` (compte une erreur), `info`, `bravo(html, pointSVG)`, `expliquer(html)`, `suite()`, `nettoyer(f)`, `el`.
- `D` (dessin) : `D.plan(svg, O, u)` (`P`, `U`, `grille`, `vec`, `arc`, `secteur`), `D.scene(svg, {...})` (3D : `sol`,
  `repere`, `pave`, `cylindre`, `fleche`, `segment`, `point`, `texte`, `orbite`), `D.glisser`, `D.cadran`,
  `D.fleche`, `D.texte`, `D.ligne`, `D.rond`, `D.poignee`, couleurs `D.C`.
- `E` (outils) : `Rz, Ry, Rx, mm, mv, col, fmt, k (KaTeX), rendre, s (SVG), h (HTML), anime, vider`.
- Toujours garder un garde dans les gestes (`if (!n.libre) return;`) pour qu'un doigt qui bouge encore
  après la réussite ne défasse pas la réponse.
- Le modèle `modules/_modele/niveaux/exemple.js` montre les trois formats de base.

## 6. Pages de cours

Une page par notion, pour relire. Structure (vérifiée par `tests/static-check.js`) :
titre, `chapeau` (la situation qui rend la notion nécessaire), **Intuition**, au moins une figure
(`<div id="fig-...">`), **Formalisation**, **Exemple**, **Formules clés**. Un rappel de prérequis va sur la page,
sous « Rappel : ... ». Pas de section de questions : l'entraînement est dans le jeu.

Figures (`figures/<page>.js`, bibliothèque `RM` de `commun/js/lib.js`) : `R.figure(id, {largeur, hauteur, titre, essai})`
crée le dessin et ses panneaux ; `R.plan`, `R.grille` (quadrillage plein), `R.vue3D` avec `R.orbite` et
`R.basculeOrbite`, `R.curseur`, `R.bouton`, `R.bascule`, `R.etapes`, `R.poignee`, `R.rendre(zone, tex)` pour les
formules en direct. Sous chaque figure : une ligne « Essaie : … Observe : … ». Format large conseillé (960 × 540).

## 7. Design

- iPad paysage (1180 × 820) ; zones tactiles d'au moins 48 px, poignées avec une zone de 60 px.
- Fond blanc. Titres en Bricolage Grotesque 800, texte en Inter, nombres en JetBrains Mono.
- Encre `#15171f`, interaction `#3b5bdb`, réussite `#12a26b`, erreur `#e5484d`, accent = couleur du module.
  Axes : x rouge, y vert, z bleu, vecteurs supplémentaires violet.
- Boutons de jeu : contour encre et ombre décalée nette ; cartes de figure : bords doux, coins arrondis.
- Écran de niveau : figure à gauche (environ 58 %), carte de l'étape à droite, pas de défilement de page.
- Dessins qui remplissent le cadre, traits épais, étiquettes qui ne se chevauchent pas (halo blanc).
- Pas de barre latérale, pas de table des matières, pas de décoration sans rôle.

## 8. Contenu et écriture

- Tout en français, tutoiement, phrases courtes, comme un bon étudiant ingénieur, pas comme une IA.
- La notation du professeur, telle quelle. Ne jamais inventer de contenu de cours, de résultat ou de citation.
  Un exemple ajouté pour s'entraîner est marqué « Exemple ajouté » quand il pourrait passer pour celui du cours.
- Jamais d'image de diapositive, jamais de PDF dans le dépôt, pas d'emoji, pas de tiret cadratin (—),
  pas d'encadré (callout). Tiret demi-cadratin seulement pour les intervalles (2026–2027).
- Virgule décimale (`0{,}5` dans les formules) ; espace insécable avant `:` `;` `?` `!` ; guillemets « ».
- Formules en KaTeX : `\( … \)` en ligne, `\[ … \]` isolées (dans une chaîne JavaScript : `\\( … \\)`).
- Pas de gras dans le texte courant, sauf le terme défini.

## 9. Vérifier

```bash
node tests/math.test.js
node tests/static-check.js
python3 -m http.server 8765 &                 # à la racine du dépôt
npm install --no-save playwright-core         # si absent
node tests/navigateur/jouer.js <id>           # chaque niveau joué jusqu'à 3 étoiles, sans erreur
node tests/navigateur/pages.js <id>           # tableau de bord et pages du module sans erreur
node tests/navigateur/figures.js <id>         # une capture par figure de cours
python3 tests/navigateur/planche.py tests/navigateur/captures/<id>/figures planche
```

Avec `CAPTURES=1`, `jouer.js` garde une capture par étape. Relire **chaque** capture (figures et étapes) :
dessin centré et assez grand, rien de coupé, pas de chevauchement, couleurs du module. Un module est terminé
quand les deux tests Node passent, que chaque niveau finit à 3 étoiles sans erreur, que chaque page charge
sans erreur et que chaque capture a été relue.

## 10. Publier

- Travailler sur une branche, ouvrir une pull request en brouillon, attendre que l'intégration continue
  (`.github/workflows/deploy.yml`) soit verte, puis fusionner en « merge » (pas « squash ») : le site se déploie.
- Messages de commit sans ligne `Co-Authored-By`.
- Ne pas changer le contenu ni le style d'un module existant sans demande explicite.
