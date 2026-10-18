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
module.exports = tous;
