// Parcours de test du chapitre 3 (structure et états des polymères).
"use strict";
const tous = {};
tous.macromolecules = async (a) => {
  await a.jetons(['tp', 'el', 'td']); await a.suite();
  await a.curseur(0, 200); await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.jetons(['tp', 'td', 'el', 'tp', 'td']); await a.suite();
  await a.svg([460, 280]); await a.suite();
};
tous['masse-moleculaire'] = async (a) => {
  await a.bouton('Tirer'); await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.curseur(0, 2); await a.curseur(0, 3); await a.curseur(0, 4); await a.attendre(300); await a.suite();
  await a.choix(0); await a.suite();
  await a.svg([400, 400]); await a.suite();
};
tous['etats-amorphe'] = async (a) => {
  await a.jetons(['0', '1', '2', '3', '4']); await a.suite();
  await a.glisser([140.8, -460], [385.4, -460]); await a.suite();
  await a.choix(0); await a.suite();
  await a.bouton('Étirer et maintenir'); await a.choix(0); await a.attendre(1500); await a.suite();
  await a.jetons(['v', 'c']); await a.suite();
};
tous['semi-cristallins'] = async (a) => {
  await a.curseur(0, 0.5); await a.curseur(0, 0.9); await a.attendre(300); await a.suite();
  await a.choix(0); await a.suite();
  await a.curseur(0, 70); await a.choix(2); await a.suite();
  await a.jetons(['v', 'f', 'v']); await a.suite();
  await a.nombres([70]); await a.suite();
};
tous['taux-cristallinite'] = async (a) => {
  await a.jetons(['c', 'a', 'u']); await a.suite();
  await a.nombres([1.1, 11]); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([11]); await a.suite();
  await a.nombres([1.19]); await a.suite();
  await a.choix(0); await a.suite();
};
tous['historique-polymeres'] = async (a) => {
  await a.jetons(['0', '1', '2', '3']); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.jetons(['s', 'c', 'z']); await a.suite();
};
tous['revision-polymeres'] = async (a) => {
  await a.jetons(['f', 'f', 'v', 'f', 'v']); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(2); await a.suite();
  await a.nombres([0.33]); await a.suite();
  await a.choix(0); await a.suite();
};
tous['boss-polymeres'] = async (a, pg) => {
  await a.choix(0); await a.suite();
  await a.nombres([11, 11]); await a.suite();
  for (const k of ['A', 'B', 'C', 'D', 'F', 'G', 'J']) await pg.click(`.etape:not(.sortie) button >> text="${k}"`);
  await a.bouton('Vérifier'); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
};
module.exports = tous;
