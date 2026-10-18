// Parcours de test du chapitre 6 (composites) du module Biomatériaux.
"use strict";
const tous = {};

tous.composites = async (a) => {
  await a.jetons(["r", "m", "r", "m", "r", "m"]); await a.suite();
  await a.choix(1); await a.suite();
  await a.jetons(["g", "h", "g", "h"]); await a.suite();
  await a.nombres([131.9]); await a.suite();
  await a.choix(0); await a.suite();
};
tous["isotrope-orthotrope"] = async (a) => {
  await a.curseur(0, 0); await a.suite();
  await a.jetons(["L", "T", "3"]); await a.suite();
  await a.nombres([2, 9, 4]); await a.suite();
  await a.nombres([0.25]); await a.suite();
  await a.choix(0); await a.suite();
};
tous["loi-melanges"] = async (a) => {
  await a.choix(0); await a.suite();
  await a.nombres([700, 30]); await a.suite();
  await a.nombres([298]); await a.suite();
  await a.curseur(0, 0.6); await a.suite();
  await a.jetons(["Ef", "pf", "Em", "pm"]); await a.suite();
  await a.choix(0); await a.suite();
};
tous["module-transversal"] = async (a) => {
  await a.choix(0); await a.suite();
  await a.nombres([4.86]); await a.suite();
  await a.choix(0); await a.suite();
  await a.curseur(0, 0.52); await a.suite();
  await a.choix(0); await a.suite();
};
tous["orientation-fibres"] = async (a) => {
  await a.curseur(0, 45); await a.suite();
  await a.nombres([0.5]); await a.suite();
  await a.nombres([0.375]); await a.suite();
  await a.nombres([12.3]); await a.suite();
  await a.choix(0); await a.suite();
};
tous["revision-composites"] = async (a) => {
  await a.nombres([0.421]); await a.suite();
  await a.nombres([32.6]); await a.suite();
  await a.nombres([115, 2.76]); await a.suite();
  await a.nombres([3.05]); await a.suite();
  await a.choix(0); await a.suite();
};
tous["boss-composites"] = async (a) => {
  await a.nombres([139.4]); await a.suite();
  await a.nombres([8.55]); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([0.75]); await a.suite();
  await a.nombres([104.9]); await a.suite();
  await a.nombres([1.56]); await a.suite();
};

module.exports = tous;
