// Parcours de test du chapitre 5 (additifs, charges et renforts) : les gestes qui réussissent chaque niveau sans erreur.
"use strict";
const tous = {};
tous.adjuvants = async (a) => {
  await a.jetons(["s", "a", "c", "i"]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(2); await a.suite();
  await a.jetons(["1", "2", "3", "4"]); await a.suite();
  await a.choix(0); await a.suite();
  await a.jetons(["l", "r", "g", "t"]); await a.suite();
};
tous.plastifiants = async (a) => {
  await a.curseur(0, 40); await a.choix(0); await a.suite();
  await a.jetons(["b", "b", "b"]); await a.suite();
  await a.choix(1); await a.suite();
  await a.nombres([60]); await a.suite();
  await a.choix(1); await a.suite();
};
tous["charges-renforts"] = async (a) => {
  await a.curseur(0, 15); await a.curseur(1, 1); await a.suite();
  await a.jetons(["g", "l", "a", "f"]); await a.suite();
  await a.choix(2); await a.suite();
  await a.jetons(["1", "2", "3"]); await a.attendre(1300); await a.suite();
  await a.nombres([3.82]); await a.suite();
};
tous["fibres-renfort"] = async (a) => {
  await a.jetons(["t", "f", "d", "m"]); await a.suite();
  await a.nombres([68]); await a.suite();
  await a.choix(1); await a.suite();
  await a.nombres([100]); await a.attendre(1000); await a.suite();
  await a.svg([550, 280]); await a.suite();
  await a.jetons(["k", "m", "p", "w"]); await a.suite();
};
tous["revision-additifs"] = async (a) => {
  await a.curseur(0, 4.85); await a.choix(0); await a.suite();
  await a.jetons(["r", "p"]); await a.suite();
  await a.choix(2); await a.suite();
  await a.choix(0); await a.suite();
  await a.jetons(["b", "f", "s", "m"]); await a.suite();
};
tous["boss-additifs"] = async (a) => {
  await a.jetons(["p", "c"]); await a.suite();
  await a.choix(1); await a.suite();
  await a.nombres([200]); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([4.83]); await a.suite();
};
module.exports = tous;
