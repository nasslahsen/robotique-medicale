// Chapitre 7 du module Biomatériaux (procédés de fabrication) : cohérence des nombres utilisés dans les niveaux et figures.
"use strict";
const fs = require("fs"), path = require("path");
const lire = (f) => fs.readFileSync(path.join(__dirname, "../../modules/biomateriaux", f), "utf8");
module.exports = ({ test, proche, assert }) => {
  test("biomatériaux ch7 : charge de la figure de compression (volume constant, bavure seulement moule fermé)", () => {
    const A = 13400, largeur = 180, profondeur = 380 - 310, hauteur0 = 122;
    proche(A / hauteur0, 109.84, 0.01);           // la charge tient dans l'empreinte au départ
    assert.ok(A / hauteur0 < largeur);
    assert.ok(A > largeur * profondeur);          // moule fermé : l'excès déborde (bavure)
    proche(A - largeur * profondeur, 800, 1e-9);
  });
  test("biomatériaux ch7 : étapes du cours (compression 5, compression-transfert 7, thermoformage 5) et noms du TP", () => {
    const comp = lire("cours/compression.html");
    const listes = [...comp.matchAll(/<ol>([\s\S]*?)<\/ol>/g)].map(m => (m[1].match(/<li>/g) || []).length);
    assert.deepStrictEqual(listes, [5, 7]);
    const thermo = lire("figures/rotomoulage-thermoformage.js").match(/var noms = \[([^\]]*)\]/)[1].split('",').length;
    proche(thermo, 6, 0);                         // l'état de départ + 5 étapes
    const tp = lire("cours/choisir-procede.html").match(/Appellation en anglais[\s\S]*?<\/table>/)[0];
    proche((tp.match(/<tr>/g) || []).length, 7, 0);   // la ligne d'en-tête est avant le texte cherché
    // jetons du niveau sur la compression : les 5 étapes attendues
    assert.ok(/\["h", "m", "p", "c", "o"\]/.test(lire("niveaux/compression.js")));
  });
};
