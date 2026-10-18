// Parcours de test du chapitre 0 (Les bases) du module Biomatériaux.
"use strict";
const tous = {};

tous["contrainte-deformation"] = async (a) => {
  await a.choix(0); await a.suite();
  await a.nombres([220]); await a.suite();
  await a.curseur(0, 0.2); await a.suite();
  await a.nombres([110]); await a.suite();
  await a.jetons(["F", "S", "dl", "l0", "s", "e"]); await a.suite();
};
tous["courbe-traction"] = async (a, pg) => {
  const s6 = await pg.evaluate(() => essaiJeu.n.sig(6));
  await a.glisser([6, s6], [1.5, 880]); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(1); await a.suite();
  await a.nombres([880]); await a.suite();
};
tous["echelle-log"] = async (a) => {
  await a.glisser([1.1, 7], [1.1, 9]); await a.suite();
  await a.nombres([1000, 3]); await a.suite();
  await a.nombres([3]); await a.suite();
  await a.choix(1); await a.suite();
  await a.jetons(["c", "p", "t", "a"]); await a.suite();
};
tous["masse-volumique"] = async (a) => {
  await a.nombres([10]); await a.suite();
  await a.nombres([1.1]); await a.suite();
  await a.curseur(0, 0.75); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([53.16]); await a.suite();
  await a.choix(0); await a.suite();
};
tous["revision-bases"] = async (a) => {
  await a.nombres([150]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([1.566]); await a.suite();
  await a.nombres([207]); await a.suite();
};
tous["boss-bases"] = async (a) => {
  await a.nombres([220]); await a.suite();
  await a.nombres([0.002]); await a.suite();
  await a.nombres([110]); await a.suite();
  await a.nombres([23420]); await a.suite();
  await a.nombres([4.43]); await a.suite();
  await a.nombres([41.04]); await a.suite();
};

module.exports = tous;
