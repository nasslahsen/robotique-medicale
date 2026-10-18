// Parcours de test du chapitre 7 (guidages rotatifs et linéaires) : la suite de gestes qui réussit chaque niveau sans erreur.
"use strict";
const tous = {};

tous["criteres-guidage"] = async (a) => {
  await a.choix(0); await a.suite();
  await a.nombres([4000]); await a.suite();
  await a.choix(1); await a.suite();
  await a.curseur(0, 120); await a.nombres([120]); await a.suite();
  await a.choix(1); await a.suite();
};
tous.roulements = async (a, pg) => {
  await a.choix(1); await a.suite();
  for (const k of ["exterieure", "interieure", "bille", "cage"]) { const c = await pg.evaluate((k) => essaiJeu.n.cibles[k], k); await a.svg(c); }
  await a.suite();
  await a.choix(0); await a.suite();
  await a.jetons(["rouleaux", "aiguilles", "butee", "oblique"]); await a.suite();
  await a.choix(0); await a.suite();
};
tous["radiaux-butees"] = async (a) => {
  await a.choix(0); await a.suite();
  await a.curseur(0, 45); await a.bouton("Valider"); await a.suite();
  await a.jetons(["R", "B", "R", "B"]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
};
tous["types-roulements"] = async (a) => {
  await a.choix(1); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(0); await a.suite();
  await a.jetons(["1", "2", "3", "4"]); await a.suite();
  await a.jetons(["aig", "bil"]); await a.suite();
};
tous["duree-l10"] = async (a) => {
  await a.nombres([64]); await a.suite();
  await a.nombres([3556]); await a.suite();
  await a.choix(2); await a.attendre(800); await a.suite();
  await a.nombres([101.6]); await a.suite();
  await a.nombres([4.52]); await a.suite();
  await a.choix(0); await a.suite();
};
tous["fixe-libre"] = async (a, pg) => {
  await a.choix(0); await a.attendre(1400); await a.suite();
  const c = await pg.evaluate(() => essaiJeu.n.cibles.De); await a.svg(c); await a.attendre(1400); await a.suite();
  await a.choix(0); await a.attendre(1400); await a.suite();
  await a.choix(0); await a.suite();
  await a.jetons(["jeu", "frein", "pression"]); await a.suite();
};
tous["precharge-roulements"] = async (a) => {
  await a.choix(0); await a.suite();
  await a.curseur(0, 15); await a.bouton("Valider"); await a.suite();
  await a.jetons(["moins", "plus", "plus", "plus", "moins"]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
};
tous["revision-guidages"] = async (a) => {
  await a.nombres([3000]); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([125, 416.7]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
};
tous["boss-guidages"] = async (a) => {
  await a.choix(0); await a.suite();
  await a.nombres([2500]); await a.suite();
  await a.nombres([1.97]); await a.suite();
  await a.jetons(["A", "B"]); await a.suite();
  await a.choix(0); await a.suite();
};

module.exports = tous;
