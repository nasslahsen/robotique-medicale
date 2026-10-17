// Chapitre 0 du module Biomatériaux : réponses attendues des niveaux (calculées avec modules/biomateriaux/calculs.js).
"use strict";
const B = require("../../modules/biomateriaux/calculs.js");
module.exports = ({ test, proche, assert }) => {
  test("biomatériaux, calculs partagés : exemples du cours", () => {
    proche(B.moduleTransversal(70, 3, 0.4), 4.86, 0.005);
    const c = B.contraintesLongitudinales(70e3, 3e3, 0.4, 0.01);
    proche(c.sf, 700, 1e-9); proche(c.sm, 30, 1e-9); proche(c.sc, 298, 1e-9);
    proche(B.densiteCristalline(1.11, 1.07, 0.33), 1.19, 0.005);
    proche(B.densiteSemiCristallin(1.2, 1, 0.5), 1.1, 1e-12);
    proche(B.croissanceAnnuelle(43.5, 69.86, 7), 0.07, 0.001);
    assert.ok(B.logModule(-100, { Tg: -60 }) > 9 && B.logModule(20, { Tg: -60 }) < 6.5);
  });
};

// Réponses attendues des niveaux du chapitre 0 (exemples ajoutés et valeurs du tableau du cours, P p38).
const avant = module.exports;
module.exports = (o) => {
  avant(o);
  const { test, proche } = o;
  test("chapitre 0 du jeu : réponses attendues dans les niveaux", () => {
    // contrainte-deformation, boss-bases
    proche(B.contrainte(4400, 20), 220, 1e-9);
    proche(B.deformation(0.2, 100), 0.002, 1e-12);
    proche(B.moduleElastique(220, 0.002) / 1000, 110, 1e-9);
    proche(B.deformation(0.1, 50), 0.002, 1e-12);
    proche(1171 * 20, 23420, 0);
    proche(4.43 * (50 * 20) / 1000, 4.43, 1e-12);
    proche(B.moduleCisaillement(110, 0.34), 41.04, 0.01);
    // courbe-traction
    proche(B.contrainte(10560, 12), 880, 1e-9);
    // echelle-log
    proche(1e9 / 1e6, 1000, 0); proche(Math.log10(1e9) - Math.log10(1e6), 3, 1e-12);
    proche(Math.pow(10, 9.48) / 1e9, 3, 0.1);
    proche(Math.pow(10, 9 - 6), 1000, 1e-6);
    // masse-volumique
    proche(10 * 10 * 0.1, 10, 1e-12); proche(B.masseVolumique(11, 10), 1.1, 1e-12);
    proche(B.densiteSemiCristallin(1.2, 1.0, 0.75), 1.15, 1e-12);
    proche(B.tauxCristallinite(1.15, 1.0, 1.2), 0.75, 1e-12);
    proche(4.43 * 12, 53.16, 1e-9);
    // revision-bases
    proche(B.contrainte(3000, 0.2 * 100), 150, 1e-9);
    proche(Math.pow(10, 8.5) / 1e9, 0.316, 0.001);
    proche(0.6 * 0.91 + 0.4 * 2.55, 1.566, 1e-9);
    proche(B.moduleElastique(207, 0.001) / 1000, 207, 1e-9);
  });
};
