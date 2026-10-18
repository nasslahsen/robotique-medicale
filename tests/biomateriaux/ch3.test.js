// Chapitre 3 du module Biomatériaux (structure et états des polymères) : réponses attendues (TD 1 et devoir).
"use strict";
const B = require("../../modules/biomateriaux/calculs.js");
module.exports = ({ test, proche, assert }) => {
  test("biomatériaux ch. 3 : taux de cristallinité, TD 1.1, devoir, TD 1.2", () => {
    // TD 1.1 : plaque 10 × 10 × 0,1 cm, X = 0,5, ρa = 1, ρc = 1,2
    const V = 10 * 10 * 0.1, rho = B.densiteSemiCristallin(1.2, 1, 0.5);
    proche(V, 10, 1e-12); proche(rho, 1.1, 1e-12); proche(rho * V, 11, 1e-9);
    proche(B.tauxCristallinite(rho, 1, 1.2), 0.5, 1e-12);
    proche((rho * V) / B.densiteSemiCristallin(1.2, 1, 0), 11, 1e-9); // fondue puis trempée : X = 0
    // devoir, exercice 2 : nylon
    proche(Math.round(B.densiteCristalline(1.11, 1.07, 0.33) * 100) / 100, 1.19, 1e-9);
    proche(B.tauxCristallinite(1.11, 1.07, 1.19), 0.333, 0.01);
    // TD 1.2 f : vitesse de cristallisation maximale
    proche(B.temperatureCristallisationMax(-10, 150), 70, 0);
    // devoir, exercice 1 : polymères impossibles (Tf ≤ Tg, ou amorphe ou fondu à 20 °C pour une fibre)
    const tab = { A: [-120, -75, 0], B: [-120, -75, 0.1], C: [80, 175, 0], D: [175, 175, 0], E: [-20, 175, 0.9], F: [175, -80, 0.9], G: [175, 275, 0], H: [50, 275, 0.9], I: [175, 275, 0.9], J: [75, 275, 0] };
    const possible = (t) => t[1] > t[0] && (20 < t[1] ? t[2] > 0 : t[2] === 0) && t[2] > 0;
    assert.deepStrictEqual(Object.keys(tab).filter(k => possible(tab[k])), ["E", "H", "I"]);
    // ressort qui se relâche entre 150 et 200 °C : fusion de la phase cristalline
    assert.deepStrictEqual(["E", "H", "I"].filter(k => tab[k][1] >= 150 && tab[k][1] <= 200), ["E"]);
    // allure des courbes : plus X est grand, plus la chute à Tg est petite ; masse infinie : jamais liquide
    const chute = (X) => B.logModule(-40, { Tg: -10, Tf: 150, X, Tl: Infinity }) - B.logModule(40, { Tg: -10, Tf: 150, X, Tl: Infinity });
    assert.ok(chute(0.9) < chute(0.5));
    assert.ok(B.logModule(150, { Tg: 40, Tl: Infinity }) > 5.5 && B.logModule(150, { Tg: 40, Tl: 102 }) < 4);
  });
};
