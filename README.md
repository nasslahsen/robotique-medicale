# Robotique médicale: interactive study site

Study site for the *Robotique médicale* course (Génie biomédical, UM6SS, Pr. H. El Hansali). The course content is reorganised as one progressive path of concepts, one concept per page, each built around interactive figures. Content is in French and follows the professor's notation (frames `R_0`, rotation matrices `R^{0,1}`, ZYX Euler angles, homogeneous matrices `T^{0,s}`).

Live site: https://nasslahsen.github.io/robotique-medicale/

Plain static site: HTML, CSS and JavaScript, no build step, no framework. Equations use KaTeX (vendored in `assets/vendor/katex`, so the site works offline).

## Structure

```
index.html                    home page and the list of concepts
concepts/<slug>.html          one page per concept
assets/css/site.css           the only stylesheet (light theme, single column)
assets/js/nav.js              ordered list of concepts, top menu, Précédent / Suivant buttons
assets/js/lib.js              shared maths (RM.m), number formatting, SVG drawing, 2D/3D views, sliders, step buttons
assets/js/pages/<slug>.js     the interactive figures of one page
assets/vendor/katex/          KaTeX 0.16.11
tests/math.test.js            checks the maths and every worked example
tests/static-check.js         checks every equation compiles, links, page list, writing rules
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

## Add a page (for example, new content from a fifth lecture)

1. Copy an existing page, e.g. `concepts/matrice-rotation.html`, to `concepts/<new-slug>.html`, and its script `assets/js/pages/matrice-rotation.js` to `assets/js/pages/<new-slug>.js`. Update the `<title>`, the `<h1>` and the last `<script>` tag.
2. Keep the page structure (the static check enforces it): `Intuition`, at least one figure (`<div id="fig-...">`), `Formalisation`, `Exemple`, `Formules clés`, `Questions` with answers in `<details>`. Put any prerequisite refresher on the same page, under `Rappel : ...`.
3. Add the page to the `CONCEPTS` list in `assets/js/nav.js`, at its place in the path, with `pret: true`. Numbering, the menu and the Précédent / Suivant buttons follow automatically.
4. Build the figure with the helpers of `lib.js`: `RM.figure(id, {...})` creates the drawing and its panels, `RM.curseur`, `RM.bascule`, `RM.bouton`, `RM.etapes` add controls, `RM.plan` (2D) or `RM.vue3D` with `RM.orbite` (3D) draw, `RM.rendre(el, tex)` shows live formulas. Add a line "Essaie / Observe" under each figure. In 3D views, keep `RM.basculeOrbite`, so that on a phone a swipe scrolls the page unless the user turns the view on.
5. Add any new calculation to `RM.m` in `lib.js` and a test (with the page's worked example) in `tests/math.test.js`.
6. Run both checks and push.

Writing rules: French; inline maths `\( ... \)`, display maths `\[ ... \]`; decimal comma written `0{,}5` inside maths; no emojis, no em dashes, no slide images or PDFs in the repository. Mark anything not in the slides as an added example or *(complément)*.
