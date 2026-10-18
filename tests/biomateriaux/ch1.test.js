// Chapitre 1 du module Biomatériaux : réponses attendues des niveaux et chiffres des pages (calculés).
"use strict";
const B = require("../../modules/biomateriaux/calculs.js");
module.exports = ({ test, proche, assert }) => {
  test("biomatériaux ch. 1 : taux de croissance du marché (cours)", () => {
    proche(Math.round(B.croissanceAnnuelle(43.5, 69.86, 7) * 1000) / 10, 7, 0.3);      // TCAC 7 %
    proche(B.croissanceAnnuelle(48, 62, 2), 0.14, 0.01);                                 // environ 14 % (2013-2015)
    proche(B.croissanceAnnuelle(32, 135, 6), 0.27, 0.005);                               // 27 % (2018-2024)
    proche(Math.round(B.croissanceAnnuelle(17, 27.3, 2) * 100), 27, 0);                  // révision
    proche(B.croissanceAnnuelle(52.52, 151.14, 7), 0.163, 0.002);                        // polymères : 16,3 %
  });
  test("biomatériaux ch. 1 : projection 2015 -> 2021 et part de l'Amérique du Nord", () => {
    // curseur de 0,5 en 0,5 : 15,5 % et 16 % tombent à 3 milliards près de 149,17, 15 % et 16,5 % non
    const ok = (t) => Math.abs(B.projection(62.07, t / 100, 6) - 149.17) <= 3;
    assert.ok(ok(16) && ok(15.5) && !ok(15) && !ok(16.5));
    proche(Math.round(22.75 / 62.07 * 100), 37, 0);
    proche(Math.round(B.projection(43.5, 0.07, 4) * 10) / 10, 57, 0.05);                 // boss : 2027
    proche(B.projection(43.5, 0.07, 7), 69.86, 0.05);                                    // cohérence 2030
  });
  test("biomatériaux ch. 1 : échelle des nanomètres", () => {
    const nano = (nm) => nm >= 1 && nm <= 100;
    assert.ok(nano(50) && nano(20) && nano(2) && !nano(7000));
  });
};
