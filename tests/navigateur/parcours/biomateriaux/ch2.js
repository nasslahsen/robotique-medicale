// Parcours de test du chapitre 2 (les familles de matériaux).
"use strict";
const tous = {};
tous.liaisons = async (a) => {
  await a.svg([340, 340]); await a.attendre(500); await a.suite();
  await a.jetons(['v', 'h', 'c']); await a.suite();
  await a.nombres([12]); await a.suite();
  await a.choix(0); await a.suite();
  await a.jetons(['q', 'i']); await a.suite();
};
tous.metaux = async (a) => {
  await a.bouton('Appliquer une tension'); await a.attendre(500); await a.choix(1); await a.suite();
  await a.tourner(0, 178); await a.attendre(300); await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
  await a.jetons(['d', 'u']); await a.suite();
  await a.nombres([443, 787]); await a.suite();
};
tous.ceramiques = async (a) => {
  await a.svg([380, 274]); await a.svg([620, 190]); await a.suite();
  await a.jetons(['o', 'n', 'c', 'b']); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.attendre(1200); await a.suite();
  await a.nombres([2.9, 1]); await a.suite();
};
tous['polymeres-organiques'] = async (a) => {
  await a.glisser([521.7, -430], [345, -430]); await a.suite();
  await a.curseur(0, 210); await a.nombres([200]); await a.suite();
  await a.choix(1); await a.suite();
  await a.nombres([20]); await a.attendre(900); await a.suite();
  await a.jetons(['c', 'f']); await a.suite();
};
tous['comparer-familles'] = async (a) => {
  await a.jetons(['m', 'c', 'p', 'k']); await a.suite();
  await a.curseur(0, 8); await a.choix(1); await a.suite();
  await a.jetons(['cp', 'mp', 'cm']); await a.suite();
  await a.choix(1); await a.suite();
  await a.jetons(['v', 'o', 'y', 'a']); await a.suite();
};
tous['revision-familles'] = async (a) => {
  await a.jetons(['c', 'm', 'p']); await a.suite();
  await a.choix(1); await a.suite();
  await a.nombres([100]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
};
tous['boss-familles'] = async (a) => {
  await a.choix(1); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([221.5, 46.4]); await a.suite();
  await a.jetons(['m', 'p', 'c']); await a.suite();
};
module.exports = tous;
