// Chapitre 6 du module Biomatériaux (composites) : réponses attendues des niveaux, recalculées avec calculs.js.
"use strict";
const B = require("../../modules/biomateriaux/calculs.js");
module.exports = ({ test, proche, assert }) => {
  test("chapitre 6 du jeu : composites, loi des mélanges, module transversal, orientation", () => {
    // composites : module spécifique (tableau P p38)
    proche(215 / 1.63, 131.9, 0.06); proche(207 / 7.87, 26.3, 0.05); proche(110 / 4.43, 24.8, 0.05);
    // isotrope-orthotrope : ν = E / (2G) − 1
    proche(200 / (2 * 80) - 1, 0.25, 1e-12); proche(B.moduleCisaillement(200, 0.25), 80, 1e-9);
    // loi des mélanges : exemple du cours (P p52)
    const c = B.contraintesLongitudinales(70e3, 3e3, 0.4, 0.01);
    proche(c.sf, 700, 1e-9); proche(c.sm, 30, 1e-9); proche(c.sc, 298, 1e-9);
    proche(c.sf * 0.4, 280, 1e-9); proche(c.sm * 0.6, 18, 1e-9); proche(c.partFibres, 0.94, 0.005);
    proche(B.moduleLongitudinal(70, 3, 0.6), 43.2, 1e-9); proche(B.moduleLongitudinal(70, 3, 0.4), 29.8, 1e-9);
    // module transversal (P p53)
    proche(B.moduleTransversal(70, 3, 0.4), 4.86, 0.005); proche(3 / 0.6, 5, 1e-12);
    assert.ok(Math.abs(B.moduleTransversal(70, 3, 0.52) - 6) < 0.1);
    assert.ok(Math.abs(B.moduleTransversal(70, 3, 0.51) - 6) >= 0.1 || Math.abs(B.moduleTransversal(70, 3, 0.53) - 6) < 0.1);
    for (let p = 0.05; p < 1; p += 0.05) assert.ok(B.moduleLongitudinal(70, 3, p) > B.moduleTransversal(70, 3, p));
    // orientation (P p42, p54)
    proche(B.coefOrientation([{ a: 1, theta: 0 }]), 1, 1e-12);
    proche(B.coefOrientation([{ a: 1, theta: 90 }]), 0, 1e-12);
    proche(B.coefOrientation([{ a: 1, theta: 45 }]), 0.25, 1e-12);
    proche(B.coefOrientation([{ a: 0.5, theta: 0 }, { a: 0.5, theta: 90 }]), 0.5, 1e-12);
    proche(B.coefOrientation([{ a: 0.25, theta: 0 }, { a: 0.25, theta: 90 }, { a: 0.25, theta: 45 }, { a: 0.25, theta: -45 }]), 0.375, 1e-12);
    proche(B.moduleOriente(0.375, 70, 3, 0.4), 12.3, 1e-9);
    // révision : TD 1.6
    const phi = B.fractionFibres(1.6, 2.55, 0.91);
    proche(phi, 0.421, 0.001);
    const r = B.repartitionSousCharge(75, 1.8, phi, 50);
    proche(r.E, 32.6, 0.05); proche(r.sf, 115, 1); proche(r.sm, 2.76, 0.03);
    proche(B.moduleTransversal(75, 1.8, phi), 3.05, 0.02);
    // boss : lame en carbone-époxy (exemple ajouté)
    proche(B.moduleLongitudinal(230, 3.5, 0.6), 139.4, 1e-9);
    proche(B.moduleTransversal(230, 3.5, 0.6), 8.55, 0.005);
    const Ko = B.coefOrientation([{ a: 0.7, theta: 0 }, { a: 0.1, theta: 45 }, { a: 0.1, theta: -45 }, { a: 0.1, theta: 90 }]);
    proche(Ko, 0.75, 1e-12); proche(B.moduleOriente(Ko, 230, 3.5, 0.6), 104.9, 1e-9);
    proche(B.densiteSemiCristallin(1.8, 1.2, 0.6), 1.56, 1e-12); proche(104.9 / 1.56, 67.2, 0.1);
  });
};
