// Parcours de test du chapitre 7 (procédés de fabrication des plastiques).
"use strict";
const tous = {};
tous.extrusion = async (a) => {
  await a.jetons(["t", "v", "f", "l"]); await a.suite();
  await a.choix(1); await a.suite();
  await a.svg([265, 510]); await a.attendre(1400); await a.suite();
  await a.choix(1); await a.attendre(1700); await a.suite();
  await a.choix(0); await a.suite();
};
tous.injection = async (a) => {
  await a.jetons(["c", "d", "i", "r", "e"]); await a.suite();
  await a.curseur(0, 100); await a.suite();
  await a.svg([205, 362]); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(0); await a.suite();
};
tous.soufflage = async (a) => {
  await a.curseur(0, 100); await a.suite();
  await a.jetons(["t", "m", "a", "o"]); await a.attendre(1800); await a.suite();
  await a.svg([490, 330]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
};
tous["rotomoulage-thermoformage"] = async (a) => {
  await a.choix(1); await a.attendre(2500); await a.suite();
  await a.choix(0); await a.suite();
  await a.curseur(0, 100); await a.suite();
  await a.jetons(["c", "m", "a", "r", "d"]); await a.attendre(2400); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
};
module.exports = tous;
