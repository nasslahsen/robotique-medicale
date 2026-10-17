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
