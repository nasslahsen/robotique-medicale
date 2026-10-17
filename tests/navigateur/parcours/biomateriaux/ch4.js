// Parcours de test du chapitre 4 (élastomères et caoutchoucs) : les gestes qui réussissent chaque niveau sans erreur.
"use strict";
const tous = {};
tous.elastomeres = async (a) => {
  await a.choix(1); await a.suite();
  await a.jetons(["s", "c", "f", "a"]); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(2); await a.suite();
  await a.svg([185, 447]); await a.suite();
};
tous["elastomere-plastomere"] = async (a) => {
  await a.choix(1); await a.suite();
  await a.curseur(0, 100); await a.choix(1); await a.suite();
  await a.nombres([1000]); await a.suite();
  await a.nombres([55]); await a.suite();
  await a.choix(1); await a.attendre(1300); await a.suite();
  await a.choix(1); await a.suite();
};
tous.vulcanisation = async (a, pg) => {
  const sites = await pg.evaluate(() => essaiJeu.n.sites.map(s => [s.x, (s.y1 + s.y2) / 2]));
  for (const k of [0, 2, 4]) await a.svg(sites[k]);
  await a.suite();
  await a.jetons(["s", "p", "o"]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
  await a.svg([540, 300]); await a.suite();
};
tous.formulation = async (a) => {
  await a.jetons(["c", "p", "a", "d"]); await a.suite();
  await a.choix(3); await a.suite();
  await a.choix(1); await a.suite();
  await a.jetons(["b", "i", "p"]); await a.suite();
  await a.choix(2); await a.suite();
};
tous["revision-elastomeres"] = async (a) => {
  await a.choix(1); await a.suite();
  await a.jetons(["e", "p", "e", "p"]); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([50]); await a.suite();
};
tous["boss-elastomeres"] = async (a) => {
  await a.choix(1); await a.suite();
  await a.jetons(["s", "a", "n", "o"]); await a.suite();
  await a.choix(2); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
};
module.exports = tous;
