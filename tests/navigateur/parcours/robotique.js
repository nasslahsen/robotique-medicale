// Parcours de test du module Robotique médicale : pour chaque niveau, la suite de gestes qui le réussit sans erreur.
// Lancer : node tests/navigateur/jouer.js robotique [id ...]
"use strict";
const tous = {};

tous.angles = async (a) => {
  await a.tourner(0, 90); await a.suite();
  await a.tourner(0, -45); await a.suite();
  await a.tourner(20, 57); await a.suite();
  await a.choix(1); await a.choix(2); await a.suite();
  await a.tourner(0, 135); await a.suite();
};
tous.cercle = async (a) => {
  await a.tourner(30, 60); await a.suite();
  await a.tourner(60, 90); await a.suite();
  await a.attendre(500); await a.choix(1); await a.attendre(800); await a.suite();
  await a.choix(1); await a.suite();
  await a.attendre(1300); await a.choix(2); await a.suite();
};
tous.triangle = async (a) => {
  await a.choix(1); await a.suite();
  await a.nombres([0.25]); await a.suite();
  await a.attendre(600); await a.glisser([0.6, 0.15], [0.4, 0.3]); await a.suite();
  await a.attendre(600); await a.nombres([1]); await a.suite();
};
tous.signes = async (a) => {
  await a.jetons(['0', '1', '2']); await a.suite();
  await a.toucher([-0.5, 0.5]); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(1); await a.suite();
};
tous.vecteurs = async (a) => {
  await a.glisser([1, 0], [3, 2]); await a.suite();
  await a.glisser([3, 1], [3, 4]); await a.suite();
  await a.choix(1); await a.suite();
  await a.curseur(0, 2); await a.curseur(1, 2); await a.suite();
};
tous.norme = async (a) => {
  await a.choix(1); await a.suite();
  await a.curseur(0, 0.2); await a.suite();
  await a.nombres([3]); await a.suite();
  await a.choix(2); await a.suite();
};
tous['matrice-vecteur'] = async (a) => {
  await a.nombres([10]); await a.suite();
  await a.nombres([15]); await a.suite();
  await a.toucher([-1, 2]); await a.bouton('Vérifier'); await a.attendre(1800); await a.suite();
  await a.nombres([-2, 1, 3]); await a.suite();
};
tous['boss-bases'] = async (a) => {
  await a.tourner(20, 60, 0.4); await a.suite();
  await a.attendre(700); await a.nombres([-0.283, 0.283]); await a.suite();
  await a.nombres([0.26, 0.35]); await a.suite();
  await a.choix(2); await a.suite();
};
tous['matrice-rotation'] = async (a, pg) => {
  await a.tourner(0, 61); await a.attendre(500); await a.suite();
  await a.choix(1); await a.suite();
  await a.jetons(['0', '1', '2']); await a.suite();
  await a.attendre(600); await a.tourner(20, 89); await a.attendre(500); await a.suite();
  await a.attendre(900); await pg.evaluate(() => 0); await a.toucher([1.2, 1.9]); await a.bouton('Vérifier'); await a.attendre(2700); await a.suite();
  await a.attendre(800); await a.cellule(0, 1); await a.suite();
};

tous.repere = async (a) => {
  await a.curseur(0, 1); await a.curseur(1, 2); await a.curseur(2, 1.5); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([5]); await a.suite();
  await a.nombres([3, 4, 0]); await a.suite();
};
tous['produit-scalaire'] = async (a) => {
  await a.tourner(70, 90, 1.4); await a.suite();
  await a.nombres([1]); await a.choix(1); await a.suite();
  await a.jetons(['0', '1', '2', '3']); await a.suite();
  await a.nombres([0.866, 0.5, -0.5]); await a.suite();
};
tous['produit-vectoriel'] = async (a) => {
  await a.choix(0); await a.suite();
  await a.curseur(0, 90); await a.suite();
  await a.nombres([6, -3, 1]); await a.suite();
  await a.choix(1); await a.suite();
};
tous['coordonnees-cylindriques'] = async (a) => {
  await a.nombres([3.54, 3.54]); await a.suite();
  await a.nombres([1.414, 135]); await a.suite();
  await a.choix(2); await a.suite();
  await a.curseur(0, 135); await a.curseur(1, 1.41); await a.curseur(2, 2); await a.suite();
};
tous['position-chasles'] = async (a) => {
  await a.nombres([3.5, 1]); await a.suite();
  await a.choix(2); await a.attendre(1100); await a.suite();
  await a.choix(1); await a.suite();
  await a.attendre(500); await a.glisser([2, 1], [1, 1.5]); await a.suite();
};
tous['boss-espace'] = async (a) => {
  await a.nombres([5]); await a.suite();
  await a.nombres([45]); await a.suite();
  await a.nombres([0, 0, 6]); await a.suite();
  await a.nombres([0, -2, 1]); await a.suite();
  await a.nombres([1, 3, 0]); await a.suite();
};

tous.so3 = async (a) => {
  await a.nombres([1, 0]); await a.suite();
  await a.choix(1); await a.suite();
  await a.nombres([0.866, 0.5, 0]); await a.suite();
  await a.choix(2); await a.suite();
};
tous['rotations-elementaires'] = async (a) => {
  await a.attendre(1100); await a.choix(1); await a.suite();
  await a.attendre(900); await a.jetons(['c', 'm']); await a.suite();
  await a.attendre(1900); await a.choix(1); await a.suite();
};
tous['angles-euler'] = async (a) => {
  await a.cadran(-90, true); await a.suite();
  await a.cadran(90, false); await a.choix(1); await a.suite();
  await a.curseur(0, 30); await a.choix(0); await a.suite();
  await a.jetons(['z', 'y', 'x']); await a.suite();
  for (let k = 0; k < 3; k++) { await a.attendre(300); await a.bouton(['Rotation 1 : φ = +90° autour de x', 'Rotation 2 : θ = +90° autour du nouvel y', 'Rotation 3 : ψ = −90° autour du nouvel z'][k]); await a.attendre(1100); }
  await a.choix(0); await a.suite();
};
tous['boss-orientations'] = async (a) => {
  await a.cadran(-70, true); await a.suite();
  await a.cellule(1, 0); await a.suite();
  await a.choix(1); await a.suite();
  await a.nombres([0.342, 0.94, 0]); await a.suite();
  await a.nombres([0, 0, -1]); await a.suite();
};

tous['changement-repere'] = async (a) => {
  await a.nombres([0, 0.5, 0]); await a.suite();
  await a.nombres([1, 2.5, 0]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
};
tous['matrice-homogene'] = async (a) => {
  await a.jetons(['R', 'P', '0', '1']); await a.suite();
  await a.nombres([1, 2, 0, 1]); await a.suite();
  await a.nombres([1, 2.5, 0, 1]); await a.suite();
  await a.choix(1); await a.suite();
  await a.nombres([-2, 1, 0]); await a.suite();
};
tous.composition = async (a) => {
  await a.choix(1); await a.attendre(1900); await a.suite();
  await a.choix(0); await a.attendre(1900); await a.suite();
  await a.jetons(['01', '12', '23']); await a.suite();
  await a.curseur(0, 80); await a.curseur(1, 30); await a.curseur(2, -115); await a.suite();
};
tous['bras-2r'] = async (a) => {
  await a.choix(1); await a.suite();
  await a.choix(2); await a.suite();
  await a.jetons(['a', 'b']); await a.suite();
  await a.nombres([0.424, 0.49]); await a.suite();
  await a.choix(1); await a.suite();
  await a.curseur(0, 60); await a.curseur(1, 60); await a.suite();
};
tous['boss-transformations'] = async (a) => {
  await a.nombres([0.5, 0.5]); await a.suite();
  await a.choix(0); await a.suite();
  await a.curseur(0, 45); await a.curseur(1, 30); await a.suite();
  await a.choix(1); await a.suite();
  await a.nombres([0.346, 0.2, 0, 1]); await a.suite();
};

tous['robot-systeme'] = async (a) => {
  await a.jetons(['0', '1', '2', '3']); await a.suite();
  await a.jetons(['c', 'a', 'c', 'a']); await a.suite();
  await a.jetons(['i', 'e', 'a', 's']); await a.suite();
  await a.choix(2); await a.suite();
};
tous.anatomie = async (a, pg) => {
  for (const k of ['effecteur', 'poignet', 'articulation', 'segment']) { const c = await pg.evaluate((k) => essaiJeu.n.cibles[k], k); await a.svg(c); }
  await a.suite();
  await a.choix(1); await a.suite();
  await a.jetons(['s', 'a', 't']); await a.suite();
  await a.choix(1); await a.suite();
};
tous['articulations-ddl'] = async (a) => {
  await a.curseur(0, 60); await a.nombres([3]); await a.suite();
  await a.jetons(['1', '2', '3']); await a.suite();
  await a.choix(1); await a.suite();
};
tous.liaisons = async (a) => {
  await a.bascules([3]); await a.bouton('Vérifier'); await a.suite();
  await a.bascules([0]); await a.bouton('Vérifier'); await a.suite();
  await a.bascules([3, 4, 5]); await a.bouton('Vérifier'); await a.suite();
  await a.nombres([2]); await a.suite();
};
tous['schemas-topologies'] = async (a) => {
  await a.choix(1); await a.bouton('Voir la version plane'); await a.attendre(600); await a.suite();
  await a.svg([60 + 320 + 100, 130]); await a.suite();
  await a.jetons(['R', 'R', 'R', 'P']); await a.suite();
};
tous.architectures = async (a) => {
  await a.curseur(0, 90); await a.curseur(1, 120); await a.bouton('Tout balayer'); await a.choix(1); await a.suite();
  await a.nombres([0.2, 1.4]); await a.suite();
  await a.jetons(['c', 'y', 's', 'a']); await a.suite();
  await a.nombres([4]); await a.choix(1); await a.suite();
  await a.choix(1); await a.suite();
};
tous.performances = async (a) => {
  await a.svg([500, 160]); await a.suite();
  await a.choix(1); await a.suite();
  await a.nombres([2, 1800]); await a.suite();
  await a.bouton('Vitesse × 2'); await a.nombres([1.35]); await a.suite();
  await a.nombres([2.4, 1500]); await a.suite();
};
tous['robotique-medicale'] = async (a) => {
  await a.bouton('Piquer'); await a.attendre(1500); await a.bouton('Piquer'); await a.attendre(1500); await a.choix(1); await a.suite();
  await a.choix(1); await a.bouton('Piquer'); await a.attendre(1800); await a.suite();
  await a.curseur(0, 2); await a.nombres([6, 4.5]); await a.suite();
  await a.jetons(['i', 'm', 'i', 'm', 'i', 'm']); await a.suite();
  await a.choix(1); await a.suite();
};
tous['boss-robot'] = async (a) => {
  await a.choix(1); await a.suite();
  await a.nombres([4]); await a.suite();
  await a.jetons(['1', '2', '3', '4']); await a.suite();
  await a.nombres([2.5]); await a.choix(0); await a.suite();
  await a.nombres([1.5, 2400]); await a.suite();
};

tous['produit-matrices'] = async (a) => {
  await a.bouton('Voir A'); await a.attendre(800); await a.bouton('Voir B'); await a.attendre(800); await a.choix(0); await a.suite();
  await a.nombres([0, -1, 2, 0]); await a.attendre(900); await a.suite();
  await a.choix(1); await a.attendre(900); await a.suite();
  await a.nombres([0, 1, -1, 0]); await a.attendre(1100); await a.suite();
  await a.choix(0); await a.nombres([19, 22]); await a.suite();
};
tous['revision-bases'] = async (a) => {
  await a.choix(2); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([-0.25, 0.433]); await a.suite();
  await a.nombres([0.6, 0.8]); await a.suite();
  await a.nombres([2, -1]); await a.choix(1); await a.suite();
};
tous['revision-robot'] = async (a) => {
  await a.jetons(['P', 'P', 'P']); await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([3]); await a.suite();
  await a.bouton('Vitesse × 2'); await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
};
tous['revision-espace'] = async (a) => {
  await a.choix(2); await a.suite();
  await a.choix(1); await a.suite();
  await a.nombres([3]); await a.suite();
  await a.choix(2); await a.suite();
  await a.bouton('Tourner de 90°'); await a.attendre(800); await a.nombres([1, 4]); await a.choix(0); await a.suite();
};
tous['revision-orientations'] = async (a) => {
  await a.attendre(1300); await a.nombres([0, 1, 0]); await a.suite();
  await a.attendre(1000); await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.attendre(1300); await a.choix(0); await a.suite();
  await a.attendre(1300); await a.choix(0); await a.suite();
};
tous['revision-transformations'] = async (a) => {
  await a.choix(0); await a.suite();
  await a.nombres([0, 1, 0]); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([0.3, 0.5]); await a.suite();
  await a.choix(2); await a.suite();
};

module.exports = tous;
