// Parcours du chapitre 5 (architecture mécanique d'un axe), sous-module « Éléments mécaniques en robotique ».
"use strict";
const tous = {};

tous.nomenclature = async (a) => {
  await a.choix(1); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(1); await a.suite();
  await a.jetons(["rads", "trmin", "nm", "w", "nmrad", "sd"]); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(0); await a.suite();
};
tous["chaine-fonctionnelle"] = async (a, pg) => {
  await a.jetons(["moteur", "reduction", "transmission", "guidage", "bras"]); await a.attendre(1700); await a.suite();
  for (const k of ["actionneur", "energie", "guidage", "transmission", "structure"]) { const c = await pg.evaluate((k) => essaiJeu.n.cibles[k], k); await a.svg(c); }
  await a.suite();
  await a.bouton("Montrer les rotations"); await a.nombres([5]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
};
tous["contraintes-biomedicales"] = async (a, pg) => {
  await a.jetons(["c", "c", "c", "b", "b", "b"]); await a.suite();
  const q = await pg.evaluate(() => essaiJeu.n.poignee);
  const ecran = (v) => pg.evaluate((v) => { const s = document.getElementById("fig"), p = s.createSVGPoint(); p.x = v[0]; p.y = v[1]; const r = p.matrixTransform(s.getScreenCTM()); return [r.x, r.y]; }, v);
  let p0 = await ecran(q); await pg.mouse.move(p0[0], p0[1]); await pg.mouse.down();
  for (let k = 1; k <= 10; k++) { const t = (70 + (14 - 70) * k / 10) * Math.PI / 180; const p = await ecran([180 + 270 * Math.cos(t), 300 - 270 * Math.sin(t)]); await pg.mouse.move(p[0], p[1]); }
  await pg.mouse.up(); await a.attendre(500);
  await a.choix(1); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(1); await a.choix(0); await a.suite();
};
tous["vitesse-couple-puissance"] = async (a) => {
  await a.bouton("Tourner pendant 1 s"); await a.attendre(1500); await a.nombres([6.28]); await a.suite();
  await a.nombres([314.16]); await a.suite();
  await a.curseur(0, 0.32); await a.suite();
  await a.nombres([6.28, 12.8]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
};
tous["rigidite-jeu"] = async (a) => {
  await a.choix(1); await a.suite();
  await a.nombres([3.49, 1.4]); await a.suite();
  await a.curseur(0, 20); await a.nombres([2000]); await a.suite();
  await a.nombres([2]); await a.suite();
  await a.choix(0); await a.suite();
};
tous["revision-axe"] = async (a) => {
  await a.nombres([157.08, 78.54]); await a.suite();
  await a.choix(0); await a.suite();
  await a.nombres([4]); await a.suite();
  await a.nombres([50]); await a.suite();
  await a.choix(0); await a.suite();
};
tous["boss-axe"] = async (a) => {
  await a.nombres([314.16, 3.14]); await a.suite();
  await a.nombres([17.5]); await a.suite();
  await a.nombres([0.26]); await a.suite();
  await a.nombres([1.05]); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
};

module.exports = tous;
