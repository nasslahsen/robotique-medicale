// Parcours de test du chapitre 8 (transmissions de puissance) : la suite de gestes qui réussit chaque niveau sans erreur.
"use strict";
const tous = {};
module.exports = tous;

// glisser dans la figure, en coordonnées du viewBox (680 × 600)
async function glisser(pg, de, vers, pas = 12) {
  const ecran = (q) => pg.evaluate((q) => { const s = document.getElementById("fig"), p = s.createSVGPoint(); p.x = q[0]; p.y = q[1]; const r = p.matrixTransform(s.getScreenCTM()); return [r.x, r.y]; }, q);
  let p = await ecran(de); await pg.mouse.move(p[0], p[1]); await pg.mouse.down();
  for (let k = 1; k <= pas; k++) { p = await ecran([de[0] + (vers[0] - de[0]) * k / pas, de[1] + (vers[1] - de[1]) * k / pas]); await pg.mouse.move(p[0], p[1]); }
  await pg.mouse.up(); await pg.waitForTimeout(600);
}
// tourner une roue de centre c, du point d'angle a0 à a1 (degrés, sens trigo), rayon r (viewBox)
async function tourner(pg, c, r, a0, a1, pas = 24) {
  const ecran = (q) => pg.evaluate((q) => { const s = document.getElementById("fig"), p = s.createSVGPoint(); p.x = q[0]; p.y = q[1]; const r = p.matrixTransform(s.getScreenCTM()); return [r.x, r.y]; }, q);
  const P = (a) => [c[0] + r * Math.cos(a * Math.PI / 180), c[1] - r * Math.sin(a * Math.PI / 180)];
  let p = await ecran(P(a0)); await pg.mouse.move(p[0], p[1]); await pg.mouse.down();
  for (let k = 1; k <= pas; k++) { p = await ecran(P(a0 + (a1 - a0) * k / pas)); await pg.mouse.move(p[0], p[1]); }
  await pg.mouse.up(); await pg.waitForTimeout(700);
}

tous["arbre-couple"] = async (a, pg) => {
  await a.choix(1); await a.suite();
  await a.nombres([0.318]); await a.suite();
  const x = (n) => 110 + 520 * n / 6000, y = (n) => 545 - 215 * (60 * 100 / (2 * Math.PI * n)) / 2;
  await glisser(pg, [x(4000), y(4000)], [x(1000), y(1000)]); await a.suite();
  await a.nombres([73.7]); await a.suite();
  await a.choix(0); await a.suite();
};


tous["arbre-torsion"] = async (a, pg) => {
  await a.curseur(0, 1); await a.choix(0); await a.suite();
  await a.svg([340 + 100, 445]); await a.suite();
  await a.nombres([13.66]); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(0); await a.suite();
};


tous["engrenages"] = async (a, pg) => {
  for (const p of [[530, 175 + 100], [150, 545], [120, 170], [322, 170]]) await a.svg(p);
  await a.suite();
  await a.jetons(["par", "conc", "gau"]); await a.suite();
  await a.jetons(["droit", "heli", "conique", "vis"]); await a.suite();
  await a.choix(0); await a.suite();
  await a.svg([190, 300]); await a.suite();
};

tous["denture"] = async (a, pg) => {
  const y = (r) => 790 - r;
  for (const r of [600, 660, 525]) await a.svg([340, y(r)]);
  await a.suite();
  await a.jetons(["1", "125", "225"]); await a.suite();
  await a.nombres([34, 38, 29]); await a.suite();
  await a.nombres([4.712]); await a.suite();
  await a.nombres([2.62]); await a.choix(1); await a.suite();
  await a.nombres([15]); await a.suite();
};

tous["rapport-engrenage"] = async (a, pg) => {
  const G = await pg.evaluate(() => { const g = essaiJeu.n.geo(); return { c: g.c1, r: g.ra1 * 0.7 }; });
  await tourner(pg, G.c, G.r, 10, 10 + 365, 40);
  await a.choix(0); await a.suite();
  await a.nombres([0.85]); await a.suite();
  await a.jetons(["d", "z"]); await a.suite();
  await a.nombres([34, 40, 37]); await a.suite();
  await a.curseur(0, 45); await a.suite();
};

tous["trains-engrenages"] = async (a, pg) => {
  await a.nombres([100]); await a.suite();
  await a.jetons(["num", "den"]); await a.suite();
  await a.bouton("Intercaler la roue 5"); await a.choix(0); await a.suite();
  await a.nombres([0.9409, 4.23]); await a.suite();
  await a.choix(0); await a.suite();
};

tous["revision-transmissions"] = async (a) => {
  await a.nombres([0.0318]); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([2]); await a.suite();
  await a.nombres([0.333, 54]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
};

tous["boss-transmissions"] = async (a) => {
  await a.nombres([0.0955]); await a.suite();
  await a.nombres([500]); await a.suite();
  await a.nombres([0.9025, 1.034]); await a.suite();
  await a.nombres([54.15]); await a.suite();
  await a.nombres([5.6]); await a.suite();
  await a.choix(0); await a.suite();
};
