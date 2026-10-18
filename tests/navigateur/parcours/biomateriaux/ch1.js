// Parcours de test du chapitre 1 (biomatériaux et dispositifs médicaux) : gestes qui réussissent chaque niveau sans erreur.
"use strict";
// glisser dans la figure, en coordonnées du viewBox (680 × 600)
async function glisserSVG(pg, de, vers, pas = 12) {
  const ecran = (q) => pg.evaluate((q) => { const s = document.getElementById("fig"), p = s.createSVGPoint(); p.x = q[0]; p.y = q[1]; const r = p.matrixTransform(s.getScreenCTM()); return [r.x, r.y]; }, q);
  let p = await ecran(de); await pg.mouse.move(p[0], p[1]); await pg.mouse.down();
  for (let k = 1; k <= pas; k++) { p = await ecran([de[0] + (vers[0] - de[0]) * k / pas, de[1] + (vers[1] - de[1]) * k / pas]); await pg.mouse.move(p[0], p[1]); }
  await pg.mouse.up(); await pg.waitForTimeout(700);
}
const tous = {};
tous["definitions-biomateriau"] = async (a) => {
  await a.jetons(["sfb", "esb", "ius"]); await a.suite();
  await a.choix(2); await a.suite();
  await a.choix(1); await a.suite();
  await a.jetons(["mat", "meca", "fonc"]); await a.suite();
  await a.choix(1); await a.suite();
};
tous.generations = async (a, pg) => {
  await a.jetons(["1", "2", "3", "4"]); await a.suite();
  await a.choix(1); await a.suite();
  await glisserSVG(pg, [150, 300], [600, 300]); await a.suite();
  await a.choix(2); await a.suite();
};
tous["dispositif-medical"] = async (a) => {
  await a.jetons(["dm", "med", "dm", "med", "dm", "med"]); await a.suite();
  await a.choix(1); await a.suite();
  await a.jetons(["mal", "hand", "ana"]); await a.suite();
  await a.choix(1); await a.suite();
};
tous["classes-risque"] = async (a) => {
  await a.svg([275, 400]); await a.suite();
  await a.jetons(["1", "2a", "2b", "3"]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
  await a.nombres([18]); await a.suite();
};
tous.vocabulaire = async (a) => {
  await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(1); await a.suite();
  await a.jetons(["imp", "pro", "oa", "hyb"]); await a.suite();
  await a.jetons(["t", "p", "p"]); await a.suite();
};
tous["ingenierie-tissulaire"] = async (a) => {
  await a.curseur(0, 100); await a.suite();
  await a.jetons(["e", "c", "f"]); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([27]); await a.suite();
};
tous.nanomedecine = async (a, pg) => {
  await glisserSVG(pg, [433, 440], [312, 440]); await a.suite();
  await a.choix(2); await a.suite();
  await a.jetons(["p", "d", "t", "p", "d", "t"]); await a.suite();
  await a.choix(1); await a.suite();
};
tous.marche = async (a) => {
  await a.nombres([7]); await a.suite();
  await a.curseur(0, 16); await a.suite();
  await a.nombres([37]); await a.suite();
  await a.jetons(["c", "o", "y", "a"]); await a.suite();
  await a.choix(0); await a.suite();
};
tous["revision-biomateriaux"] = async (a) => {
  await a.choix(1); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([27]); await a.suite();
  await a.choix(0); await a.suite();
  await a.jetons(["a", "r", "d"]); await a.suite();
};
tous["boss-biomateriaux"] = async (a) => {
  await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(2); await a.suite();
  await a.jetons(["e", "ce", "fda"]); await a.suite();
  await a.nombres([57]); await a.suite();
};
module.exports = tous;
