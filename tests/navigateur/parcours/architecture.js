// Parcours de test du module Architecture hospitalière : pour chaque niveau, la suite de gestes qui le réussit sans erreur.
// Lancer : node tests/navigateur/jouer.js architecture [id ...]
"use strict";
const tous = {};

// Chapitres 1 et 2 : l'hôpital et son bloc, zones et flux.
// centre d'une boîte {x, y, w, h}
const mil = (x, y, w, h) => [x + w / 2, y + h / 2];
// appariement : chaque élément de gauche puis son partenaire à droite
const paires = async (a, g, d, bon) => { for (let i = 0; i < bon.length; i++) { await a.svg(g(i)); await a.svg(d(bon[i])); } };
// cases 3 × 3 du niveau flux
const kase = (k) => mil(24 + (k % 3) * 220, 90 + Math.floor(k / 3) * 170, 192, 84);

tous['architecture-hospitaliere'] = async (a) => {
  for (const i of [0, 1, 3, 4, 5, 6, 8, 9, 10, 11, 13, 14]) await a.svg(mil(20 + (i % 3) * 220, 74 + Math.floor(i / 3) * 104, 200, 92));
  await a.suite();
  await a.jetons(['o1', 'o2', 'o3', 'o4', 'o5']); await a.suite();
  await a.choix(1); await a.suite();
  await a.svg([310, 355]); await a.suite();
  await a.choix(1); await a.suite();
};
tous['familles-contraintes'] = async (a) => {
  const m1 = [3, 6, 0, 5, 2, 7, 1, 4];
  await paires(a, (i) => [108, 94 + 66 * i], (k) => [455, 94 + 66 * k], m1.map((_, i) => m1.indexOf(i))); await a.suite();
  for (const i of [3, 4, 6]) await a.svg([340, 99 + 64 * i]);
  await a.suite();
  const m2 = [4, 0, 5, 2, 1, 3];
  await paires(a, (i) => [210, 109 + 82 * i], (k) => [560, 109 + 82 * k], m2.map((_, i) => m2.indexOf(i))); await a.suite();
  await a.svg([340, 392]); await a.choix(0); await a.suite();
};
tous['bloc-definition'] = async (a) => {
  await a.jetons(['a', 'b', 'c']); await a.suite();
  for (const i of [0, 6, 5]) await a.svg([189, 108 + 62 * i]);
  await a.suite();
  await a.svg([500, 315]); await a.choix(1); await a.suite();
  await a.jetons(['f', 't', 's', 'f', 't', 's', 't', 's', 't']); await a.suite();
  await a.choix(1); await a.suite();
};
tous['revision-hopital'] = async (a) => {
  for (const i of [0, 2, 4, 5]) await a.svg([24 + (i % 2) * 320 + 156, 70 + Math.floor(i / 2) * 170 + 75]);
  await a.suite();
  await a.jetons(['h', 'r', 's', 'a']); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
};
tous['boss-hopital'] = async (a) => {
  for (const p of [[312, 384], [508, 322], [540, 100]]) await a.svg(p);
  await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
};
tous.zonage = async (a) => {
  const P = [[20, 56, 640, 50, 1], [20, 116, 150, 104, 1], [180, 116, 140, 104, 1], [480, 116, 180, 104, 2], [20, 230, 640, 56, 2],
    [20, 296, 230, 150, 3], [260, 296, 160, 150, 3], [430, 296, 230, 150, 3], [20, 456, 310, 124, 2], [340, 456, 320, 124, 2]];
  for (const p of P) for (let k = 0; k < p[4]; k++) await a.svg(mil(p[0], p[1], p[2], p[3]));
  await a.bouton('Vérifier'); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(1); await a.suite();
  await a.jetons(['p', 'v', 'r', 's', 'w']); await a.suite();
};
tous.flux = async (a) => {
  for (const k of [5, 7, 3, 1, 2, 6]) await a.svg(kase(k));
  await a.suite();
  await a.choix(1); await a.suite();
  for (const k of [6, 3, 2, 5]) await a.svg(kase(k));
  await a.suite();
  for (const k of [0, 1, 8]) await a.svg(kase(k));
  await a.suite();
  const pos = [4, 0, 2, 1, 3], c = (i) => { const t = -Math.PI / 2 + pos[i] * 2 * Math.PI / 5; return [340 + 210 * Math.cos(t), 330 + 210 * Math.sin(t)]; };
  for (const i of [1, 3, 4, 2, 0]) await a.svg(c(i));
  await a.suite();
};
tous['separation-flux'] = async (a) => {
  await a.choix(0); await a.suite();
  await a.svg([425, 415]); await a.suite();
  await a.jetons(['p', 't', 'o']); await a.suite();
  await a.choix(0); await a.suite();
  await a.jetons(['a', 'b', 'c', 'd']); await a.suite();
};
tous['dechets-stockage'] = async (a) => {
  const bac = (i) => { const x = 20 + (i % 3) * 220 + (i >= 3 ? 110 : 0), y = i < 3 ? 210 : 400; return [x + 100, y + 85]; };
  for (const f of [0, 2, 1, 3, 4]) await a.svg(bac(f));
  await a.suite();
  await a.svg([240, 376]); await a.suite();
  await paires(a, (i) => [210, 122 + 128 * i], (k) => [555, 122 + 128 * k], [2, 0, 3, 1]); await a.suite();
  await a.choix(2); await a.suite();
};
tous['bloc-et-services'] = async (a) => {
  await paires(a, (i) => [200, 266 + 92 * i], (k) => [545, 266 + 92 * k], [1, 3, 2, 0]); await a.suite();
  await a.svg([540, 190]); await a.suite();
  await a.svg([290, 510]); await a.suite();
  await a.choix(0); await a.suite();
};
tous['revision-flux'] = async (a) => {
  await a.svg([300, 300]); await a.suite();
  await a.jetons(['r', 's', 'p', 's']); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
};
tous['boss-flux'] = async (a) => {
  for (const p of [[250, 70, 180, 120], [20, 250, 190, 110], [250, 420, 180, 70], [470, 420, 190, 140]]) await a.svg(mil(...p));
  await a.suite();
  await paires(a, (i) => [185, 122 + 128 * i], (k) => [530, 122 + 128 * k], [1, 3, 2, 0]); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(0); await a.suite();
};

// Chapitres 3 et 4 : la salle d'opération, l'air du bloc.
tous['salle-dimensions'] = async (a) => {
  await a.jetons(['a', 'b', 'c', 'd', 'e']); await a.suite();
  await a.svg([506, 300]); await a.suite();
  await a.curseur(0, 7.5); await a.curseur(1, 7.5); await a.bouton('Vérifier'); await a.suite();
  await a.nombres([56.12]); await a.suite();
  await a.curseur(0, 14); await a.suite();
};
tous.surfaces = async (a) => {
  await a.jetons(['s', 'p', 'm', 's', 'p', 'm']); await a.suite();
  await a.svg([338, 300]); await a.suite();
  for (const q of [[150, 250], [612, 470], [430, 200], [540, 150]]) await a.svg(q);
  await a.suite();
  await a.choix(1); await a.suite();
  await a.curseur(0, 60); await a.attendre(400); await a.choix(0); await a.suite();
};
tous['bloc-hybride'] = async (a) => {
  await a.choix(0); await a.suite();
  for (let k = 0; k < 5; k++) await a.svg([82, 552]);
  await a.choix(0); await a.suite();
  for (const q of [[60, 300], [340, 560], [620, 220], [340, 280], [620, 440], [430, 560]]) await a.svg(q);
  await a.suite();
  await a.choix(1); await a.suite();
};

tous['ergonomie-acoustique'] = async (a) => {
  await a.svg([200, 120]); await a.suite();
  for (const q of [[470, 470], [78, 265], [595, 192], [522, 530]]) await a.svg(q);
  await a.suite();
  await a.choix(0); await a.suite();
  const bon = [1, 2, 3, 0];
  for (let i = 0; i < 4; i++) { await a.svg([170, 128 + 124 * i]); await a.svg([520, 128 + 124 * bon[i]]); }
  await a.suite();
};
tous['revision-salle'] = async (a) => {
  await a.nombres([43.2]); await a.choix(1); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.jetons(['a', 'b', 'c']); await a.suite();
};
tous['boss-salle'] = async (a) => {
  await a.nombres([6.64]); await a.suite();
  await a.choix(2); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(1); await a.suite();
  await a.svg([250, 230]); await a.suite();
};
tous['ventilation-objectifs'] = async (a) => {
  const bon = [2, 4, 0, 1, 3];
  for (let i = 0; i < 5; i++) { await a.svg([155, 104 + 106 * i]); await a.svg([495, 104 + 106 * bon[i]]); }
  await a.suite();
  await a.choix(1); await a.suite();
  await a.curseur(0, 50); await a.suite();
  await a.choix(1); await a.suite();
};
tous['pression-cascade'] = async (a) => {
  await a.choix(0); await a.attendre(2800); await a.suite();
  await a.svg([120, 325]); await a.svg([120, 325]); await a.svg([340, 325]);
  await a.bouton('Ouvrir les portes'); await a.attendre(2800); await a.suite();
  await a.attendre(2000); await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
};
tous['renouvellement-air'] = async (a) => {
  await a.jetons(['n', 'f', 'r', 'e']); await a.suite();
  await a.nombres([126]); await a.nombres([15]); await a.suite();
  await a.curseur(0, 2800); await a.suite();
  await a.choix(1); await a.suite();
  await a.svg([124, 220]); await a.attendre(2500); await a.suite();
};
tous['filtration-ucv'] = async (a) => {
  await a.jetons(['p', 'f', 'h']); await a.suite();
  await a.choix(1); await a.suite();
  await a.svg([506, 300]); await a.attendre(2500); await a.suite();
  await a.choix(1); await a.suite();
};
tous['revision-air'] = async (a) => {
  await a.jetons(['a', 'b', 'c']); await a.suite();
  await a.nombres([20]); await a.choix(1); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(2); await a.suite();
};
tous['boss-air'] = async (a) => {
  await a.attendre(2000); await a.choix(0); await a.suite();
  await a.curseur(0, 3000); await a.curseur(1, 2600); await a.bouton('Ouvrir la porte'); await a.attendre(2800); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(1); await a.suite();
};

// Chapitres 5 et 6 : énergie, lumière, fluides et réseaux ; équipements, sécurité et méthode.
// apparier : touche l'élément i à gauche puis son partenaire bon[i] à droite
const apparier = async (a, c) => {
  for (let i = 0; i < c.bon.length; i++) {
    await a.svg([c.xg + c.wg / 2, c.y0 + i * c.pas + c.h / 2]);
    await a.svg([c.xd + c.wd / 2, c.y0 + c.bon[i] * c.pas + c.h / 2]);
  }
};

tous.electricite = async (a) => {
  await a.bouton('Couper le réseau'); await a.attendre(2200); await a.choix(0); await a.suite();
  await a.svg([419, 533]); await a.choix(0); await a.suite();
  await apparier(a, { bon: [2, 3, 1, 0], xg: 20, wg: 340, xd: 400, wd: 260, y0: 70, h: 100, pas: 124 }); await a.suite();
  await a.choix(1); await a.suite();
};
tous.eclairage = async (a) => {
  await a.jetons(['g', 'o', 'g', 'o', 'g', 'o']); await a.suite();
  await a.curseur(0, 3); await a.curseur(1, 200); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(2); await a.suite();
};
tous['fluides-medicaux'] = async (a) => {
  await apparier(a, { bon: [3, 2, 4, 1, 0], xg: 20, wg: 250, xd: 310, wd: 350, y0: 60, h: 88, pas: 106 }); await a.suite();
  await a.svg([480, 210]); await a.suite();
  await a.jetons(['u', 'p', 'u', 'p', 'u', 'p', 'p']); await a.suite();
  await a.choix(2); await a.suite();
};
tous['reseaux-plafond'] = async (a, pg) => {
  await apparier(a, { bon: [4, 2, 3, 0, 1], xg: 20, wg: 230, xd: 290, wd: 370, y0: 60, h: 88, pas: 106 }); await a.suite();
  await a.jetons(['a', 'b', 'c', 'd']); await a.suite();
  // les éléments restants se recalent après chaque pose : on touche toujours le premier bon élément restant
  const ok = [true, true, true, false, true, true, true, true, false, true];
  const pose = ok.map(() => false);
  for (let t = 0; t < 8; t++) {
    const rest = ok.map((v, i) => i).filter(i => !pose[i]);
    const i = rest.find(i => ok[i]), k = rest.indexOf(i);
    await a.svg([24 + (k % 3) * 214 + 100, 300 + Math.floor(k / 3) * 74 + 30]);
    pose[i] = true;
  }
  await a.suite();
  await a.choix(1); await a.suite();
};
tous['revision-technique'] = async (a) => {
  await a.jetons(['n', 's', 'u']); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
};
tous['boss-technique'] = async (a) => {
  await a.jetons(['a', 'b', 'c', 'd']); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await apparier(a, { bon: [2, 3, 0, 1], xg: 40, wg: 240, xd: 380, wd: 260, y0: 90, h: 90, pas: 120 }); await a.suite();
};
tous['integration-biomedicale'] = async (a) => {
  await a.jetons(['p', 'd', 't', 'i', 'm', 'a']); await a.suite();
  await a.choix(0); await a.suite();
  for (const c of [[272, 105], [468, 305], [110, 380], [340, 540]]) await a.svg(c);
  await a.suite();
  await a.choix(0); await a.suite();
};
tous.securite = async (a) => {
  await a.jetons(['d', 'c', 'c', 's', 's', 'i', 'i']); await a.suite();
  await a.choix(0); await a.suite();
  await apparier(a, { bon: [2, 4, 0, 3, 1], xg: 20, wg: 340, xd: 400, wd: 260, y0: 60, h: 90, pas: 106 }); await a.suite();
  await a.choix(0); await a.suite();
};
tous.normes = async (a) => {
  await a.choix(0); await a.suite();
  await apparier(a, { bon: [2, 3, 1, 0], xg: 20, wg: 230, xd: 300, wd: 360, y0: 80, h: 96, pas: 124 }); await a.suite();
  await apparier(a, { bon: [1, 2, 0], xg: 20, wg: 220, xd: 290, wd: 370, y0: 120, h: 110, pas: 140 }); await a.suite();
  await apparier(a, { bon: [2, 3, 0, 1], xg: 20, wg: 230, xd: 300, wd: 360, y0: 80, h: 96, pas: 124 }); await a.suite();
};
tous['methode-conception'] = async (a) => {
  const PLACE = [6, 2, 9, 0, 4, 7, 1, 8, 3, 5];
  for (const k of PLACE) await a.svg([30 + (k % 2) * 330 + 145, 50 + Math.floor(k / 2) * 106 + 37]);
  await a.suite();
  await apparier(a, { bon: [2, 4, 0, 3, 1], xg: 20, wg: 240, xd: 300, wd: 360, y0: 60, h: 92, pas: 106 }); await a.suite();
  await a.jetons(['cvc', 'elec', 'gaz', 'bio', 'hyg', 'elec', 'gaz']); await a.suite();
  await a.choix(0); await a.suite();
};
tous['ingenieur-erreurs'] = async (a) => {
  await a.svg([100, 330]); await a.suite();
  await a.jetons(['c', 'c', 'c', 'r', 'r', 'e', 'e']); await a.suite();
  await apparier(a, { bon: [2, 4, 3, 0, 1], xg: 20, wg: 330, xd: 380, wd: 280, y0: 50, h: 96, pas: 108 }); await a.suite();
  await a.choix(2); await a.suite();
};
tous['revision-conception'] = async (a) => {
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(2); await a.suite();
  await a.choix(0); await a.suite();
};
tous['boss-conception'] = async (a) => {
  await a.choix(1); await a.suite();
  await apparier(a, { bon: [2, 4, 5, 3, 0, 1], xg: 30, wg: 220, xd: 300, wd: 350, y0: 50, h: 76, pas: 90 }); await a.suite();
  await a.nombres([6.2]); await a.suite();
  await a.choix(1); await a.suite();
  await a.jetons(['a', 'b', 'c']); await a.suite();
};

// Chapitre 7 : TD 1.
const centre = (b) => [b.x + b.w / 2, b.y + b.h / 2];
const touches = async (a, pts) => { for (const p of pts) await a.svg(p); };

tous.td1 = async (a) => {
  await touches(a, [0, 1, 3, 4, 5, 7, 8, 9].map(i => [30 + (i % 2) * 320 + 150, 40 + Math.floor(i / 2) * 106 + 45])); await a.suite();
  const nd = [{ x: 380, y: 360, w: 240, h: 90 }, { x: 60, y: 60, w: 240, h: 90 }, { x: 60, y: 460, w: 240, h: 90 }, { x: 380, y: 200, w: 240, h: 90 }, { x: 380, y: 40, w: 240, h: 90 }];
  await touches(a, [1, 4, 3, 0, 2].map(i => centre(nd[i]))); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
};
tous['td-qcm-1'] = async (a) => { for (const k of [1, 1, 1, 1, 0]) { await a.choix(k); await a.suite(); } };
tous['td-qcm-2'] = async (a) => { for (const k of [1, 1, 1, 0, 1]) { await a.choix(k); await a.suite(); } };
tous['td-calcul'] = async (a) => {
  await a.nombres([3600]); await a.suite();
  await a.nombres([17]); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(1); await a.suite();
};
tous['td-cas-flux'] = async (a) => {
  await touches(a, [[340, 262], [146, 214], [480, 290], [610, 262], [636, 492]]); await a.suite();
  await a.choix(0); await a.suite();
  await a.jetons(['a', 'a', 'a', 'o', 'o']); await a.suite();
  await a.choix(0); await a.suite();
};
tous['td-cas-air'] = async (a) => {
  await a.choix(0); await a.suite();
  await a.jetons(['e1', 'e2', 'e3', 'e4']); await a.suite();
  await a.choix(1); await a.suite();
  await a.choix(0); await a.suite();
};
tous['td-cas-hybride'] = async (a) => {
  await touches(a, [0, 1, 2, 3, 5, 6].map(i => [30 + (i % 2) * 320 + 150, 74 + Math.floor(i / 2) * 120 + 50])); await a.suite();
  const bon = [1, 3, 4, 2, 0];
  for (let i = 0; i < 5; i++) { await a.svg([155, 60 + i * 106 + 44]); await a.svg([495, 60 + bon[i] * 106 + 44]); }
  await a.suite();
  await a.curseur(0, 100); await a.suite();
  await a.choix(3); await a.suite();
};
tous['td-cas-equipement'] = async (a) => { for (const k of [0, 0, 3]) { await a.choix(k); await a.suite(); } };
tous['revision-td'] = async (a) => {
  await a.nombres([3600]); await a.suite();
  await a.nombres([26]); await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
  await a.choix(0); await a.suite();
};
tous['boss-td'] = async (a) => {
  // nombre de touches pour passer de « à classer » à la bonne zone (publique 1, semi 2, restreinte 3)
  const P = [[20, 40, 200, 110, 1], [460, 40, 200, 110, 2], [20, 170, 640, 70, 2], [20, 260, 300, 160, 3], [340, 260, 150, 160, 2], [510, 260, 150, 160, 2]];
  for (const p of P) for (let k = 0; k < p[4]; k++) await a.svg([p[0] + p[2] / 2, p[1] + p[3] / 2]);
  await a.bouton('Vérifier'); await a.suite();
  const nd = [{ x: 380, y: 60, w: 260, h: 90 }, { x: 40, y: 440, w: 260, h: 90 }, { x: 40, y: 60, w: 260, h: 90 }, { x: 380, y: 300, w: 260, h: 90 }, { x: 40, y: 250, w: 260, h: 90 }];
  await touches(a, [2, 4, 0, 3, 1].map(i => centre(nd[i]))); await a.suite();
  await a.choix(3); await a.suite();
  await a.jetons(['n', 'r', 'l', 'n']); await a.suite();
};

module.exports = tous;
