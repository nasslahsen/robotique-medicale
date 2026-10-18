// Chapitre 5 du module Biomatériaux (additifs, charges et renforts) : réponses attendues des niveaux, calculées.
"use strict";
const B = require("../../modules/biomateriaux/calculs.js");
module.exports = ({ test, proche, assert }) => {
  test("biomatériaux ch5 : additifs et renforts, réponses des niveaux", () => {
    // rapport de forme L/D = 15 avec L = 15, D = 1 : aiguille
    proche(B.rapportForme(15, 1), 15, 1e-12);
    assert.strictEqual(B.groupeRenfort("batonnet", 15), "aciculaire");
    assert.strictEqual(B.groupeRenfort("batonnet", 200), "fibrillaire");
    assert.strictEqual(B.groupeRenfort("plaquette", 30), "lamellaire");
    assert.strictEqual(B.groupeRenfort("grain", 1), "granulaire");
    // tableau du PP : E multiplié par 6,5 / 1,7, ordre CaCO3 < talc < FV
    proche(6.5 / 1.7, 3.82, 0.006);
    const PP = [[2.8, 75], [4.2, 97], [6.5, 148]];
    assert.ok(PP[0][0] < PP[1][0] && PP[1][0] < PP[2][0] && PP[0][1] < PP[1][1] && PP[1][1] < PP[2][1]);
    proche(148 - 65, 83, 0);
    // 68 tex : masse de 1 km en grammes
    proche(B.masseFil(68, 1000), 68, 1e-9);
    // tige de carbone de même volume qu'une tige d'acier de 400 g, densité 4 fois plus faible
    proche(400 / 4, 100, 0);
    // fragilité du PVC : 0 °C contre −60 °C au mieux
    proche(0 - (-60), 60, 0);
    // TD 1.5 a : volume de 1,45 g de PVC gonflé à 0,3 g/cm³ (curseur entre 4,74 et 4,93)
    const V = 1.45 / 0.3; proche(V, 4.833, 0.001);
    proche(B.masseVolumique(1.45, 4.85), 0.3, 0.006);
    // boss : 0,1 % de 200 kg en grammes ; rapport des volumes de la mousse
    proche(200000 * 0.001, 200, 1e-9);
    proche(1.45 / 0.3, 4.83, 0.006);
  });
};
