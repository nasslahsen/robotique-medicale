# Semestre 5 : plateforme d'étude

Site d'étude pour les modules du semestre 5 (génie biomédical), pensé pour un iPad en paysage.
Chaque module est un parcours de niveaux à jouer (défis sur des figures interactives, étoiles, révisions, boss)
accompagné de pages de cours pour relire. Le tableau de bord montre chaque module, sa progression et un bouton
« Continuer ».

Site : https://nasslahsen.github.io/robotique-medicale/

Module actif : Robotique médicale. Les autres modules apparaissent « À venir » jusqu'à ce que leurs cours soient ajoutés.

Tout est décrit dans [`CLAUDE.md`](CLAUDE.md) : structure, registre, progression, style pédagogique, règles de design
et d'écriture, et la méthode pour construire un module à partir des PDF de cours (dossier modèle : `modules/_modele/`).

Site statique (HTML, CSS, JavaScript, sans étape de construction). Vérifications :

```bash
node tests/math.test.js
node tests/static-check.js
```

Chaque push sur `main` lance ces vérifications puis publie le site avec GitHub Actions.
