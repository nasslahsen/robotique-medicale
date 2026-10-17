# Robotique médicale: study site

Study notes for the *Robotique médicale* course (Génie biomédical, UM6SS, Pr. H. El Hansali), built with MkDocs Material. The content is in French and follows the professor's notation.

Live site (after the first deployment): https://nasslahsen.github.io/robotique-medicale/

## Structure

```
docs/
  index.md                      home page
  cours/01-…md … 04-…/          one page per lecture (lecture 4 has three sub-pages)
  rappels.md                    prerequisites (trigonometry, vectors, matrices, derivatives)
  glossaire.md                  French glossary
  assets/css/site.css           styling (light theme only)
  assets/js/widgets.js          interactive figures (plain JavaScript) and their maths
  assets/js/mathjax-config.js   MathJax settings
  assets/vendor/mathjax/        MathJax 3.2.2, vendored so the site works offline
  assets/figures/               the few figures taken from the slides
tests/test_math.js              checks the maths used by the widgets and worked examples
mkdocs.yml                      site configuration and navigation
```

## Preview locally

Requires Python 3.9+ (and Node.js only to run the maths tests).

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
mkdocs serve
```

Open http://127.0.0.1:8000. The page reloads when you save a file.

Before pushing, run the same checks as CI:

```bash
mkdocs build --strict            # fails on broken links or anchors
node tests/test_math.js          # checks rotation matrices, Euler angles, 2-link arm, conversions
```

## Deploy to GitHub Pages

Deployment is automatic: `.github/workflows/deploy.yml` builds the site and publishes it on every push to `main`. Pull requests are built (so errors show up) but not deployed.

One-time setup: in the repository, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**. After the next push to `main`, the site is at `https://<user>.github.io/robotique-medicale/`.

## Add a fifth lecture

1. Create `docs/cours/05-<short-title>.md` (or a folder with an `index.md` and sub-pages, like lecture 4).
2. Follow the layout of the existing pages: for each section, an intuition paragraph, the formal version, then a worked example. Mark them with
   ```markdown
   Intuition
   { .etape }
   ```
   End the page with `## Formules clés` and `## Questions d'auto-évaluation`. Hide answers like this (the indentation matters):
   ```markdown
   1. Question ?

       <details markdown><summary>Réponse</summary>
       Answer, with math \(x = r\cos\theta\) if needed.
       </details>
   ```
3. Add the page to `nav` in `mkdocs.yml`, under `Cours`.
4. Add new terms to `docs/glossaire.md` and, if the lecture needs new prerequisites, a section to `docs/rappels.md`.
5. Run `mkdocs build --strict` and push to `main`.

Writing conventions: French; inline math `\( … \)`, display math `\[ … \]`; decimal comma inside math as `0{,}5`; no emojis, no em dashes, no admonition boxes. Keep the professor's notation (`R^{0,S}`, `T^{0,1}`, `\wedge`, ZYX angles α, β, γ). Mark anything not in the slides with *(complément)*.

To add an interactive figure: write a function `W["name"] = function (root) { … }` in `docs/assets/js/widgets.js` (reuse `cadre`, `curseur`, `toile`, `fleche`, `matHTML`), put any new maths in `RM.math` with a test in `tests/test_math.js`, and place `<div class="widget" data-widget="name"></div>` in the page.

Figures from the slides go in `docs/assets/figures/` (JPEG, about 1600 px wide). Keep them to the few that cannot be redrawn; never commit the original PDFs (`*.pdf` is in `.gitignore`).
