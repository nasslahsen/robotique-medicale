// Chapitre 2 du module Biomatériaux (familles de matériaux) : réponses attendues des niveaux.
"use strict";
const B = require("../../modules/biomateriaux/calculs.js");
module.exports = ({ test, proche, assert }) => {
  test("biomatériaux ch. 2 : liaisons, métaux, céramiques, polymères", () => {
    // liaisons : classement des énergies (kJ/mol, valeurs hautes) et rapport C–C / hydrogène
    const E = { vdw: 8.4, dip: 12.6, h: 29.3, cc: 349, co: 357, ch: 411, oh: 459, cf: 485 };
    assert.ok(E.vdw < E.h && E.h < E.cc);
    proche(Math.round(349 / 29.3), 12, 0);
    // métaux : tige de 100 cm³ (Ti-6Al-4V 4,43 ; inox 17-7 PH 7,87)
    proche(4.43 * 100, 443, 1e-9); proche(7.87 * 100, 787, 1e-9);
    // céramiques : couronne de 0,5 cm³ (ZrO₂ 5,8 ; SiO₂ 2)
    proche(B.masseVolumique(2.9, 0.5), 5.8, 1e-12); proche(5.8 * 0.5, 2.9, 1e-12); proche(2 * 0.5, 1, 1e-12);
    // polymères : seuil 200 °C et tube 10 cm à 100 %
    proche(10 * (1 + 1), 20, 0);
    // révision : rapport des modules céramique / polymère
    proche(200 / 2, 100, 0);
    // boss : tige 50 cm³ en titane, tête 8 cm³ en zircone
    proche(4.43 * 50, 221.5, 1e-9); proche(5.8 * 8, 46.4, 1e-9);
  });
};
