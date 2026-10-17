# Style spec: the course as a game

Chosen from the three prototypes in `essais/`: the structure of A (short stages that unlock, figure beside the challenge) with the game feel of B (missions, dial, live dashboard, success panel). Built for iPad in landscape, touch and Apple Pencil. Everything on screen is in French, with the course's notation.

## Structure

- **Map** (`index.html`): the whole course as a path of levels grouped in chapters. A finished level shows its stars, the next one pulses, later ones are locked. Each chapter ends with a boss level. Progress is saved in the browser of the iPad (`localStorage`); "Tout débloquer" opens every level.
- **Level** (`jouer.html#<id>`): 3 to 6 stages. A stage is one challenge; the next stage unlocks when it is solved. A level ends on a results panel with 1 to 3 stars.
- **Stars**: 3 stars with no mistake, 2 with one or two, 1 otherwise. Replaying keeps the best score.
- **Boss**: a harder level at the end of each chapter, mixing what the chapter taught, with no hints before the first try.
- **Chapters**: 0 Les bases (angles, trigonometry, vectors, matrix times vector, from scratch), 1 Le robot et sa description, 2 Repères et vecteurs dans l'espace, 3 Orientations, 4 Transformations.

## A stage

1. A concrete situation and a question, in one or two lines ("La pince doit viser le flacon : quel angle ?").
2. The learner acts straight away on the figure: drag, turn the dial, tap, choose, type a number.
3. Instant feedback: a wrong answer shakes and gives a hint pointing at the figure; a right one draws a green check.
4. Only then a short explanation (two or three sentences) and the formula, as the answer to what was just done.
5. "Continuer".

Formats rotate across stages: prediction then reveal, find the value, build it (drag pieces), spot the mistake, compare two cases, aim at a target.

## Screen

- Left, about 58 %: the figure, as large as possible, with the live values strip under it (matrix, coordinates) when the stage needs one. Optional dial in a corner of the figure.
- Right: the stage card (kicker "Étape 2 sur 5", question, controls, feedback, explanation).
- Top bar: back to the map, level title, stage segments.
- No sidebars, no table of contents, no page scroll on the level screen (the right card scrolls if needed).

## Look

- White background. Headings in Bricolage Grotesque (800), text in Inter, numbers in the live strip in JetBrains Mono.
- Colours: ink `#15171f`, accent blue `#3b5bdb` (interaction, progress), game orange `#ff5a1f` (stars, boss, level labels), success `#12a26b`, error `#e5484d`. Axes: x red, y green, z blue, extra vectors violet.
- Game buttons have an ink outline and a hard offset shadow (B); figure cards have soft borders (A).
- Motion: stage cards slide in, checks draw themselves, stars pop one by one, the success ring expands. Nothing loops except the pulsing next level and drag handles.
- Touch targets at least 48 px; drag handles have a 60 px hit zone.

## Writing

- Tutoiement, short sentences, no paragraph that does not explain the figure.
- No em dashes, no emojis, no callout boxes. Decimal comma; non-breaking space before `:` `;` `?` `!`.
- Never invent course content; examples added for practice say so only when they could be confused with the course's.

## Code

- `jeu/moteur.js`: the level engine (stages, feedback, stars, saving, results panel).
- `jeu/dessin.js`: 2D plane, 3D scene with orbit, dial, drag handles.
- `jeu/catalogue.js`: chapters and levels, in order.
- `niveaux/<id>.js`: one file per level, registering its stages with `NIVEAU({...})`.
- Tests: `tests/math.test.js` for the numbers, `tests/static-check.js` for equations (including those written inside level scripts), links and writing rules.
