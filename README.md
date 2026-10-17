# Robotique médicale: interactive study site

Study site for a *Robotique médicale* course (biomedical engineering), made for an iPad in landscape. It has two parts, reached from the same top bar:

- **Jeu** (`index.html`): the course as a game. A map of levels in chapters, each level a short series of challenges on an interactive figure, with stars, a review level and a boss per chapter.
- **Cours** (`cours.html`): one page per concept, to reread a notion: intuition, interactive figure, formalisation, worked example, key formulas.

Content is in French and follows the course notation (frames `R_0`, rotation matrices `R^{0,1}`, ZYX Euler angles, homogeneous matrices `T^{0,s}`).

Live site: https://nasslahsen.github.io/robotique-medicale/

Plain static site: HTML, CSS and JavaScript, no build step, no framework. Equations use KaTeX (vendored in `assets/vendor/katex`, so the site works offline).

## Structure

```
index.html                    Jeu tab: the map of levels
jouer.html                    one level, chosen by the hash: jouer.html#<id>
cours.html                    Cours tab: the list of concept pages
concepts/<slug>.html          one course page per concept

jeu/catalogue.js              chapters and levels, in order (cours: true when concepts/<id>.html exists)
jeu/moteur.js                 level engine: stages, feedback, stars, saving, results panel
jeu/moteur-carte.js           the map: path, stars, unlocking, "Prochains chapitres" tile
jeu/dessin.js, jeu/outils.js  drawing (2D plane, 3D scene, dial, drag) and shared maths for levels
jeu/jeu.css                   style of the map and of the level screen
niveaux/<id>.js               one file per level, registering its stages with NIVEAU({...})

assets/css/onglets.css        the shared top bar with the Jeu / Cours tabs
assets/css/site.css           style of the course pages (same look as the game)
assets/js/nav.js              course pages: concept list, top bar, "Jouer le niveau", Précédent / Suivant
assets/js/lib.js              course pages: maths (RM.m), SVG drawing, 2D/3D views, sliders, step buttons
assets/js/pages/<slug>.js     the interactive figures of one course page
assets/vendor/katex/          KaTeX 0.16.11

STYLE.md                      design and writing rules of the game, and how to add a chapter
tests/math.test.js            checks the maths, worked examples and every expected answer of the levels
tests/static-check.js         checks equations (pages and level scripts), links, catalogue, writing rules
.github/workflows/deploy.yml  runs both tests, then deploys to GitHub Pages on push to main
```

## Preview locally

Any static file server works. With Python:

```bash
python3 -m http.server 8000
```

then open http://localhost:8000. (Opening `index.html` directly from the disk also works in most browsers.)

Run the checks (Node.js 18 or later, no dependencies to install):

```bash
node tests/math.test.js
node tests/static-check.js
```

## Deploy

Every push to `main` runs the two checks and publishes the site with GitHub Actions. One-time setting: **Settings → Pages → Build and deployment → Source: GitHub Actions**. Do not add the template workflows GitHub suggests on that page (Jekyll, static HTML): they would publish the repository a second way and overwrite the site.

Pull requests run the checks without deploying.

## Add a chapter

Follow "Adding a chapter" in `STYLE.md`: levels in `jeu/catalogue.js` and `niveaux/`, a review level and a boss, expected answers in `tests/math.test.js`. If the chapter also gets course pages, add them as below and mark its levels `cours: true`.

## Add a course page

1. Copy an existing page, e.g. `concepts/matrice-rotation.html`, to `concepts/<slug>.html` (use the level's id as slug), and its script `assets/js/pages/matrice-rotation.js` to `assets/js/pages/<slug>.js`. Update the `<title>`, the `<h1>` and the last `<script>` tag.
2. Keep the page structure (the static check enforces it): `Intuition`, at least one figure (`<div id="fig-...">`), `Formalisation`, `Exemple`, `Formules clés`. No question section: practice lives in the game. Put any prerequisite refresher on the same page, under `Rappel : ...`.
3. Add the page to the `CONCEPTS` list in `assets/js/nav.js`, at its place in the path, with `pret: true`.
4. Build the figure with the helpers of `lib.js`: `RM.figure(id, {...})`, `RM.curseur`, `RM.bascule`, `RM.bouton`, `RM.etapes`, `RM.plan` (2D) or `RM.vue3D` with `RM.orbite` (3D), `RM.rendre(el, tex)` for live formulas. Add a line "Essaie / Observe" under each figure.
5. Add any new calculation to `RM.m` in `lib.js` and a test in `tests/math.test.js`, then run both checks and push.

Writing rules: French; inline maths `\( ... \)`, display maths `\[ ... \]`; decimal comma written `0{,}5` inside maths; no emojis, no em dashes, no slide images or PDFs in the repository. Mark anything not in the slides as an added example or *(complément)*.
