// Parcours de test du chapitre 6 (assemblages et fixations) : la suite de gestes qui réussit chaque niveau sans erreur.
"use strict";
const tous = {};
// glisser entre deux points donnés en coordonnées du viewBox de la figure
async function glisserSvg(pg, de, vers, pas = 12) {
  const ecran = (q) => pg.evaluate((q) => { const s = document.getElementById("fig"), p = s.createSVGPoint(); p.x = q[0]; p.y = q[1]; const r = p.matrixTransform(s.getScreenCTM()); return [r.x, r.y]; }, q);
  let p = await ecran(de); await pg.mouse.move(p[0], p[1]); await pg.mouse.down();
  for (let k = 1; k <= pas; k++) { p = await ecran([de[0] + (vers[0] - de[0]) * k / pas, de[1] + (vers[1] - de[1]) * k / pas]); await pg.mouse.move(p[0], p[1]); }
  await pg.mouse.up(); await pg.waitForTimeout(600);
}

tous["fonctions-liaison"] = async (a) => {
  await a.jetons(["SERRER", "POSITIONNER", "TRANSMETTRE", "AXIAL", "DESSERRAGE"]); await a.suite();
  await a.svg([205, 336]); await a.svg([340, 210]); await a.suite();
  await a.svg([389, 400]); await a.choix(0); await a.suite();
  await a.choix(2); await a.suite();
  await a.choix(0); await a.choix(0); await a.suite();
};
tous["assemblage-visse"] = async (a) => {
  await a.choix(0); await a.suite();
  await a.jetons(["assemblage", "pression", "boulon", "goujon"]); await a.suite();
  await a.nombres([4.8]); await a.suite();
  await a.curseur(0, 0.15); await a.nombres([5.33]); await a.suite();
  await a.choix(0); await a.suite();
};
tous.clavette = async (a) => {
  await a.choix(1); await a.suite();
  await a.nombres([1333]); await a.suite();
  await a.nombres([16.7]); await a.suite();
  await a.curseur(0, 40); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([1500, 15.6]); await a.suite();
};
tous["anneaux-goupilles"] = async (a) => {
  await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([8]); await a.suite();
  await a.choix(0); await a.suite();
};
tous.ressorts = async (a, pg) => {
  await glisserSvg(pg, [300, 170], [300, 266]); await a.suite();
  await a.nombres([1]); await a.suite();
  await a.nombres([30]); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(0); await a.attendre(900); await a.suite();
};
tous["revision-assemblages"] = async (a) => {
  await a.choix(0); await a.suite();
  await a.nombres([3]); await a.suite();
  await a.nombres([1000, 27.8]); await a.suite();
  await a.choix(2); await a.suite();
  await a.nombres([1.5]); await a.suite();
};
tous["boss-assemblages"] = async (a) => {
  await a.jetons(["clavette", "epaulement", "anneau"]); await a.suite();
  await a.nombres([1286]); await a.suite();
  await a.choix(2); await a.suite();
  await a.nombres([1.6]); await a.choix(0); await a.suite();
  await a.nombres([3, 30]); await a.suite();
};

module.exports = tous;
