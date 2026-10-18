// Chapitre 4 du module Biomatériaux (élastomères) : réponses attendues des niveaux, calculées.
"use strict";
const B = require("../../modules/biomateriaux/calculs.js");
module.exports = ({ test, proche, assert }) => {
  test("biomatériaux ch4 : élastomères, réponses des niveaux", () => {
    // élastomère ou plastomère : Tv sous ou au-dessus de 20 °C
    const classe = (Tv) => (Tv < 20 ? "e" : "p");
    assert.deepStrictEqual([-70, -45, 100, 60, -60, 95].map(classe), ["e", "e", "p", "p", "e", "p"]);
    // 1 GPa / 1 MPa
    proche(1e9 / 1e6, 1000, 0);
    // bande de 5 cm étirée de 1000 % : L = l0 (1 + ε)
    proche(5 * (1 + 1000 / 100), 55, 1e-12);
    // élastomère de 1 MPa sous 0,5 MPa : ε en %
    proche(B.deformation(0.5, 1) * 100, 50, 1e-12);
    // courbes du niveau : à 20 °C, caoutchouc naturel (Tv = −60) caoutchouteux, polystyrène (Tv = 100) vitreux
    assert.ok(B.logModule(20, { Tg: -60, Tl: Infinity }) < 6.5 && B.logModule(20, { Tg: 100, Tl: Infinity }) > 9);
    // brut (Tl fini) qui coule à 80 °C, vulcanisé non
    assert.ok(B.logModule(80, { Tg: -60, Tl: 45 }) < 4.5 && B.logModule(80, { Tg: -60, Tl: Infinity }) > 5.5);
    // vulcanisation : modèle des courbes 0, 2, 10, 30 % de soufre (Tg = −60 + 3,4 s)
    const courbe = (T, s) => (s === 0 ? B.logModule(T, { Tg: -60, Tl: 30 }) : B.logModule(T, { Tg: -60 + 3.4 * s, caout: 6 + 0.025 * s, Tl: Infinity }));
    assert.ok(courbe(60, 10) > courbe(60, 2) && courbe(60, 30) > courbe(60, 10));
    // boss : à 20 °C, 10 % est caoutchouteux (plateau, module > à 2 %), 30 % encore vitreux
    assert.ok(courbe(20, 10) < 7 && courbe(20, 10) > courbe(20, 2) && courbe(20, 30) > 8.5);
  });
};
