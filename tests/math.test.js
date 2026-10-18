// Vérifie les calculs des figures et tous les exemples chiffrés des pages.
// Lancer : node tests/math.test.js
"use strict";
const assert = require("assert");
const { m } = require("../commun/js/lib.js");
const D = m.DEG;
const proche = (a, b, tol = 1e-9, msg = "") => assert.ok(Math.abs(a - b) <= tol, `${msg} ${a} != ${b}`);
const procheMat = (A, B, tol = 1e-9) => A.forEach((l, i) => l.forEach((v, j) => proche(v, B[i][j], tol, `[${i}][${j}]`)));
const procheVec = (u, v, tol = 1e-9) => u.forEach((x, i) => proche(x, v[i], tol, `[${i}]`));
let n = 0;
const test = (nom, f) => { f(); n++; console.log("ok -", nom); };

test("Rx, Ry, Rz et compositions appartiennent à SO(3)", () => {
  for (const R of [m.Rz(0.7), m.Ry(-1.1), m.Rx(2.3), m.eulerZYX(0.3, -0.8, 1.9), m.eulerXYZ(1, 0.4, -2)]) {
    proche(m.det3(R), 1);
    procheMat(m.matMul(m.transpose(R), R), m.identite(3));
  }
});

test("matrices élémentaires écrites comme dans le cours", () => {
  const a = 0.4;
  procheMat(m.Rz(a), [[Math.cos(a), -Math.sin(a), 0], [Math.sin(a), Math.cos(a), 0], [0, 0, 1]]);
  procheMat(m.Ry(a), [[Math.cos(a), 0, Math.sin(a)], [0, 1, 0], [-Math.sin(a), 0, Math.cos(a)]]);
  procheMat(m.Rx(a), [[1, 0, 0], [0, Math.cos(a), -Math.sin(a)], [0, Math.sin(a), Math.cos(a)]]);
});

test("repère : distance P1(10;20;5) P2(13;24;5) = 5 mm ; norme (2;-1;2) = 3", () => {
  proche(m.norme(m.sub([13, 24, 5], [10, 20, 5])), 5);
  proche(m.norme([2, -1, 2]), 3);
});

test("produit scalaire : instrument (1;0;1) et os (0;0;1) font 45°", () => {
  const a = [1, 0, 1], b = [0, 0, 1];
  proche(m.dot(a, b), 1);
  proche(Math.acos(m.dot(a, b) / (m.norme(a) * m.norme(b))) / D, 45);
});

test("exercice des deux repères : produits scalaires du corrigé", () => {
  const a = 30 * D, x1 = [1, 0, 0], y1 = [0, 1, 0], z1 = [0, 0, 1];
  const x2 = [Math.cos(a), Math.sin(a), 0], y2 = [-Math.sin(a), Math.cos(a), 0];
  proche(m.dot(x1, x2), Math.cos(a)); proche(m.dot(y1, y2), Math.cos(a));
  proche(m.dot(y1, x2), Math.sin(a)); proche(m.dot(x1, y2), -Math.sin(a));
  proche(m.dot(x1, y1), 0); proche(m.dot(z1, x1), 0);
  proche(m.dot(x1, x2), 0.8660254, 1e-6); proche(m.dot(y1, x2), 0.5); proche(m.dot(x1, y2), -0.5);
});

test("exercice des deux repères : les 11 produits vectoriels du corrigé", () => {
  const a = 0.6, s = Math.sin(a), c = Math.cos(a);
  const x1 = [1, 0, 0], y1 = [0, 1, 0], z1 = [0, 0, 1], z2 = z1;
  const x2 = [c, s, 0], y2 = [-s, c, 0];
  procheVec(m.cross(x1, y1), z1);
  procheVec(m.cross(x1, x2), [0, 0, s]);
  procheVec(m.cross(y1, y2), [0, 0, s]);
  procheVec(m.cross(z2, y1), [-1, 0, 0]);
  procheVec(m.cross(z2, x1), y1);
  procheVec(m.cross(x1, y2), [0, 0, c]);
  procheVec(m.cross(y1, x2), [0, 0, -c]);
  procheVec(m.cross(y2, x1), [0, 0, -c]);
  procheVec(m.cross(y2, y1), [0, 0, -s]);
  procheVec(m.cross(x2, z1), m.scale(y2, -1));
  procheVec(m.cross(x2, x1), [0, 0, -s]);
});

test("produit vectoriel : (1;2;0) ∧ (0;1;3) = (6;-3;1)", () => {
  procheVec(m.cross([1, 2, 0], [0, 1, 3]), [6, -3, 1]);
});

test("cylindriques : (-1;1;2) -> r = √2, θ = 135° ; cible 5 cm à 45°", () => {
  const c = m.versCylindrique(-1, 1, 2);
  proche(c.r, Math.SQRT2); proche(c.theta / D, 135);
  const b = m.versCartesien(c.r, c.theta, c.z); proche(b.x, -1); proche(b.y, 1);
  const p = m.versCartesien(5, 45 * D, 0); proche(p.x, 3.5355, 1e-4); proche(p.y, 3.5355, 1e-4);
  proche(m.versCylindrique(0, -2, 1).theta / D, -90);
});

test("Chasles : Os(2;1), OsM = 1,5 xs, rotation 0° puis 90°", () => {
  procheVec(m.add([2, 1, 0], m.matVec(m.Rz(0), [1.5, 0, 0])), [3.5, 1, 0]);
  procheVec(m.add([2, 1, 0], m.matVec(m.Rz(90 * D), [1.5, 0, 0])), [2, 2.5, 0]);
});

test("matrice de rotation : α = 30°, V¹ = (2;1;0) -> V⁰ = (1,232;1,866;0)", () => {
  procheVec(m.matVec(m.Rz(30 * D), [2, 1, 0]), [1.2320508, 1.8660254, 0], 1e-6);
});

test("SO(3) : miroir de det -1 ; R_z(90°)⁻¹ = R_z(-90°)", () => {
  proche(m.det3([[1, 0, 0], [0, 1, 0], [0, 0, -1]]), -1);
  procheMat(m.transpose(m.Rz(90 * D)), m.Rz(-90 * D));
});

test("rotations élémentaires : Rz(90)Rx(90) et ordre inverse", () => {
  procheMat(m.matMul(m.Rz(90 * D), m.Rx(90 * D)), [[0, 0, 1], [1, 0, 0], [0, 1, 0]]);
  procheMat(m.matMul(m.Rx(90 * D), m.Rz(90 * D)), [[0, -1, 0], [0, 0, -1], [1, 0, 0]]);
  procheMat(m.Ry(90 * D), [[0, 0, 1], [0, 1, 0], [-1, 0, 0]]);
});

test("Euler ZYX (téléphone du cours) : Rz(-90)Ry(90), x2 = -z0", () => {
  procheMat(m.Rz(-90 * D), [[0, 1, 0], [-1, 0, 0], [0, 0, 1]]);
  const R02 = m.matMul(m.Rz(-90 * D), m.Ry(90 * D));
  procheMat(R02, [[0, 1, 0], [0, 0, -1], [-1, 0, 0]]);
  procheVec(m.colonne(R02, 0), [0, 0, -1]);
  procheMat(m.eulerZYX(90 * D, 0, 90 * D), [[0, 0, 1], [1, 0, 0], [0, 1, 0]]);
});

test("Euler XYZ (téléphone du cours) : φ = 90°, θ = 90°, ψ = -90°, repères intermédiaires", () => {
  const R1 = m.Rx(90 * D);
  procheVec(m.colonne(R1, 0), [1, 0, 0]); procheVec(m.colonne(R1, 1), [0, 0, 1]); procheVec(m.colonne(R1, 2), [0, -1, 0]);
  const R2 = m.matMul(R1, m.Ry(90 * D));
  procheVec(m.colonne(R2, 0), [0, 1, 0]); procheVec(m.colonne(R2, 1), [0, 0, 1]); procheVec(m.colonne(R2, 2), [1, 0, 0]);
  const R3 = m.eulerXYZ(90 * D, 90 * D, -90 * D);
  procheVec(m.colonne(R3, 0), [0, 0, -1]); procheVec(m.colonne(R3, 1), [0, 1, 0]); procheVec(m.colonne(R3, 2), [1, 0, 0]);
});

test("changement de repère et matrice homogène : (1;2;0), 90°, (0,5;0;0) -> (1;2,5;0)", () => {
  const T = m.homog(m.Rz(90 * D), [1, 2, 0]);
  procheVec(m.appliquer(T, [0.5, 0, 0]), [1, 2.5, 0]);
  procheVec(m.add([1, 2, 0], m.matVec(m.Rz(90 * D), [0.5, 0, 0])), [1, 2.5, 0]);
  const Ti = m.homogInv(T);
  procheVec(m.blocP(Ti), [-2, 1, 0]);
  procheVec(m.appliquer(Ti, [1, 2.5, 0]), [0.5, 0, 0]);
  procheMat(m.matMul(T, Ti), m.identite(4));
  procheVec(m.add([1, 2, 0], m.matVec(m.Rz(0), [0.5, 0, 0])), [1.5, 2, 0]);
});

test("composition : Rot·Trans et Trans·Rot (α = 90°, d = 1 et d = 2)", () => {
  for (const d of [1, 2]) {
    const Rot = m.homog(m.Rz(90 * D), [0, 0, 0]), Tr = m.homog(m.identite(3), [d, 0, 0]);
    procheVec(m.blocP(m.matMul(Rot, Tr)), [0, d, 0]);
    procheVec(m.blocP(m.matMul(Tr, Rot)), [d, 0, 0]);
    procheMat(m.blocR(m.matMul(Rot, Tr)), m.blocR(m.matMul(Tr, Rot)));
  }
});

test("chaîne plane : T^{0,3} = T^{0,1}T^{1,2}T^{2,3} et position de M", () => {
  const th = [0.5, 0.7, -0.9], L = [1.4, 1.1, 0.8];
  const ch = m.chainePlane(th, L);
  procheMat(ch.T[2].cumul, m.matMul(m.matMul(ch.T[0].local, ch.T[1].local), ch.T[2].local));
  const a1 = th[0], a2 = a1 + th[1], a3 = a2 + th[2];
  procheVec(ch.bout, [L[0] * Math.cos(a1) + L[1] * Math.cos(a2) + L[2] * Math.cos(a3), L[0] * Math.sin(a1) + L[1] * Math.sin(a2) + L[2] * Math.sin(a3), 0]);
});

test("bras 2R : formule directe, T^{0,2} et exemple 0,4 / 0,3 / 30° / 45°", () => {
  for (const [a, b, l1, l2] of [[30, 45, 0.4, 0.3], [-120, 70, 0.5, 0.2], [90, -90, 0.5, 0.5]]) {
    const r = m.bras2R(a * D, b * D, l1, l2);
    proche(r.M[0], l1 * Math.cos(a * D) + l2 * Math.cos((a + b) * D));
    proche(r.M[1], l1 * Math.sin(a * D) + l2 * Math.sin((a + b) * D));
    procheMat(m.blocR(r.T02), m.Rz((a + b) * D));
    procheVec(m.blocP(r.T02), [l1 * Math.cos(a * D), l1 * Math.sin(a * D), 0]);
  }
  const r = m.bras2R(30 * D, 45 * D, 0.4, 0.3);
  proche(r.M[0], 0.4241, 1e-4); proche(r.M[1], 0.4898, 1e-4);
  proche(Math.hypot(r.M[0], r.M[1]), 0.648, 1e-3);
  proche(r.T02[0][0], 0.2588, 1e-4); proche(r.T02[1][0], 0.9659, 1e-4);
  proche(r.T02[0][3], 0.3464, 1e-4); proche(r.T02[1][3], 0.2, 1e-9);
  const q = m.bras2R(90 * D, -90 * D, 0.5, 0.5); procheVec(q.M, [0.5, 0.5, 0]);
  proche(Math.cos(75 * D), Math.cos(30 * D) * Math.cos(45 * D) - Math.sin(30 * D) * Math.sin(45 * D));
});

test("produit matriciel : dimensions", () => {
  assert.throws(() => m.matMul([[1, 2, 3, 4], [5, 6, 7, 8]], [[1, 2], [3, 4], [5, 6]]));
  assert.deepStrictEqual(m.matMul([[1, 2], [3, 4]], [[0, 1], [1, 0]]), [[2, 1], [4, 3]]);
  assert.deepStrictEqual(m.matMul([[0, 1], [1, 0]], [[1, 2], [3, 4]]), [[3, 4], [1, 2]]);
});

test("partie A : temps de cycle du cours, vitesse doublée, question, charge, SCARA, mise à l'échelle", () => {
  const d = [0.30, 0.20, 0.55, 0.15, 0.45, 0.35], mouvement = [true, false, true, false, true, false];
  const T = d.reduce((a, b) => a + b, 0);
  proche(T, 2.00, 1e-12); proche(3600 / T, 1800, 1e-9); proche(60 / T, 30, 1e-9);
  const T2 = d.reduce((a, x, i) => a + (mouvement[i] ? x / 2 : x), 0);
  proche(T2, 1.35, 1e-12); proche(3600 / T2, 2666.67, 0.01);
  const Tq = 0.40 + 0.25 + 0.60 + 0.25 + 0.50 + 0.40;
  proche(Tq, 2.40, 1e-12); proche(3600 / Tq, 1500, 1e-9); proche(60 / Tq, 25, 1e-9);
  proche(1.2 + 2.5 + 0.3, 4.0, 1e-12);
  proche(Math.abs(0.8 - 0.6), 0.2, 1e-12); proche(0.8 + 0.6, 1.4, 1e-12);
  proche(2 * 3, 6); proche(1.5 * 0.3, 0.45, 1e-12);
});

test("chapitre 0 du jeu : réponses attendues dans les niveaux", () => {
  // degrés et radians
  proche(180 / Math.PI, 57.3, 0.01); proche(3 * Math.PI / 4 / D, 135, 1e-9); proche(Math.PI / 6 / D, 30, 1e-9);
  // cercle : cos 60° = 0,5 ; bras de 2 à 30°
  proche(Math.cos(60 * D), 0.5, 1e-12); proche(2 * Math.cos(30 * D), 1.732, 1e-3); proche(2 * Math.sin(30 * D), 1, 1e-12);
  // triangle : 0,5 m à 30°, cible (0,4 ; 0,3), bout (0,6 ; 0,8)
  proche(0.5 * Math.cos(30 * D), 0.433, 1e-3); proche(0.5 * Math.sin(30 * D), 0.25, 1e-12);
  proche(Math.hypot(0.4, 0.3), 0.5, 1e-12); proche(Math.atan2(0.3, 0.4) / D, 36.9, 0.05);
  proche(Math.hypot(0.6, 0.8), 1, 1e-12); proche(Math.atan2(0.8, 0.6) / D, 53.1, 0.05);
  // signes : quart de tour
  proche(Math.cos((30 + 90) * D), -Math.sin(30 * D), 1e-12); proche(Math.sin((30 + 90) * D), Math.cos(30 * D), 1e-12);
  // vecteurs : somme et combinaison
  assert.deepStrictEqual([2 + 1, 1 + 3], [3, 4]); assert.deepStrictEqual([2 * 1 + 2 * -1, 2 * 1 + 2 * 1], [0, 4]);
  // norme
  proche(Math.hypot(3, 4), 5); proche(Math.hypot(1, 2, 2), 3); proche(Math.hypot(0.8, -0.6), 1, 1e-12);
  // matrice fois vecteur
  procheVec(m.matVec([[2, 1], [1, 3]], [3, 4]), [10, 15]);
  procheVec(m.matVec([[0, -1], [1, 0]], [2, 1]), [-1, 2]);
  procheVec(m.matVec(m.Rz(90 * D), [1, 2, 3]), [-2, 1, 3]);
  // boss : bras de 0,4 m
  proche(0.4 * Math.cos(60 * D), 0.2, 1e-12); proche(0.4 * Math.sin(60 * D), 0.3464, 1e-4);
  proche(0.4 * Math.cos(135 * D), -0.283, 1e-3); proche(0.4 * Math.sin(135 * D), 0.283, 1e-3);
  proche(0.3 * Math.cos(30 * D) + 0.2 * Math.cos(90 * D), 0.260, 1e-3); proche(0.3 * Math.sin(30 * D) + 0.2, 0.350, 1e-12);
});

test("chapitre 2 du jeu : réponses attendues dans les niveaux", () => {
  // repère : distance du cours (exemple ajouté) et glissières
  proche(Math.hypot(13 - 10, 24 - 20, 5 - 5), 5, 1e-12);
  // produit scalaire : instrument et os, deux repères à 30°
  proche(m.dot([1, 0, 1], [0, 0, 1]), 1); proche(Math.acos(1 / Math.SQRT2) / D, 45, 1e-9);
  const R = m.Rz(30 * D), x2 = m.colonne(R, 0), y2 = m.colonne(R, 1);
  proche(m.dot([1, 0, 0], x2), 0.866, 1e-3); proche(m.dot([0, 1, 0], x2), 0.5, 1e-12); proche(m.dot([1, 0, 0], y2), -0.5, 1e-12);
  // produit vectoriel : exemple et deux repères
  procheVec(m.cross([1, 2, 0], [0, 1, 3]), [6, -3, 1]); procheVec(m.cross([1, 0, 0], [0, 1, 0]), [0, 0, 1]);
  procheVec(m.cross([1, 0, 0], x2), [0, 0, Math.sin(30 * D)]);
  // cylindriques
  proche(5 * Math.cos(45 * D), 3.54, 0.005); proche(Math.hypot(-1, 1), 1.414, 1e-3);
  proche(Math.atan2(1, -1) / D, 135, 1e-9); proche(Math.atan2(-1, -1) / D, -135, 1e-9); proche(Math.atan(1) / D, 45, 1e-9);
  // Chasles
  procheVec(m.add([2, 1, 0], m.matVec(m.Rz(0), [1.5, 0, 0])), [3.5, 1, 0]);
  procheVec(m.add([2, 1, 0], m.matVec(m.Rz(90 * D), [1.5, 0, 0])), [2, 2.5, 0]);
  procheVec(m.add([1, 1.5, 0], m.matVec(m.Rz(90 * D), [1.5, 0, 0])), [1, 3, 0]);
  // boss
  proche(Math.hypot(3, 4, 0), 5); procheVec(m.cross([2, 0, 0], [0, 3, 0]), [0, 0, 6]);
  procheVec([2 * Math.cos(-90 * D), 2 * Math.sin(-90 * D), 1], [0, -2, 1]);
  procheVec(m.add([1, 1, 0], m.matVec(m.Rz(90 * D), [2, 0, 0])), [1, 3, 0]);
});

test("chapitre 3 du jeu : réponses attendues dans les niveaux", () => {
  const R30 = m.Rz(30 * D), c1 = m.colonne(R30, 0), c2 = m.colonne(R30, 1);
  proche(m.dot(c1, c1), 1, 1e-12); proche(m.dot(c1, c2), 0, 1e-12);
  proche(m.det3([[1, 0, 0], [0, 1, 0], [0, 0, -1]]), -1); proche(m.det3(m.Rx(90 * D)), 1, 1e-12);
  procheVec(m.transpose(R30)[0], [0.866, 0.5, 0], 1e-3);
  // ordre des rotations : Rz(90°)Rx(90°) et l'inverse
  procheVec(m.colonne(m.matMul(m.Rz(90 * D), m.Rx(90 * D)), 0), [0, 1, 0]);
  procheVec(m.colonne(m.matMul(m.Rx(90 * D), m.Rz(90 * D)), 0), [0, 0, 1]);
  // Ry(30°) : x descend
  procheVec(m.colonne(m.Ry(30 * D), 0), [Math.cos(30 * D), 0, -0.5]);
  // téléphone ZYX et XYZ
  const R02 = m.matMul(m.Rz(-90 * D), m.Ry(90 * D));
  procheVec(m.colonne(R02, 0), [0, 0, -1]);
  const R3 = m.matMul(m.matMul(m.Rx(90 * D), m.Ry(90 * D)), m.Rz(-90 * D));
  procheVec(m.colonne(R3, 2), [1, 0, 0]); procheVec(m.colonne(R3, 0), [0, 0, -1]); procheVec(m.colonne(R3, 1), [0, 1, 0]);
  // boss
  const C = m.Rz(-70 * D); proche(C[0][0], 0.342, 1e-3); proche(C[1][0], -0.940, 1e-3);
  proche(m.det3([[0, 1, 0], [1, 0, 0], [0, 0, 1]]), -1);
  procheVec(m.colonne(m.matMul(m.Rz(90 * D), m.Ry(90 * D)), 0), [0, 0, -1]);
});

test("chapitre 4 du jeu : réponses attendues dans les niveaux", () => {
  const R = m.Rz(90 * D);
  procheVec(m.matVec(R, [0.5, 0, 0]), [0, 0.5, 0]);
  procheVec(m.add([1, 2, 0], m.matVec(R, [0.5, 0, 0])), [1, 2.5, 0]);
  procheVec(m.matVec(m.transpose(R), [0, 1, 0]), [1, 0, 0]);
  // matrice homogène, point (1) et vecteur (0), inverse
  const T = [[0, -1, 0, 1], [1, 0, 0, 2], [0, 0, 1, 0], [0, 0, 0, 1]];
  procheVec(m.matVec(T, [0.5, 0, 0, 1]), [1, 2.5, 0, 1]); procheVec(m.matVec(T, [0.5, 0, 0, 0]), [0, 0.5, 0, 0]);
  procheVec(m.scale(m.matVec(m.transpose(R), [1, 2, 0]), -1), [-2, 1, 0]);
  // composition : Rot·Trans et Trans·Rot
  const Rot = [[0, -1, 0, 0], [1, 0, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]], Tr = [[1, 0, 0, 1], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
  procheVec(m.colonne(m.matMul(Rot, Tr), 3), [0, 1, 0, 1]); procheVec(m.colonne(m.matMul(Tr, Rot), 3), [1, 0, 0, 1]);
  // chaîne à trois segments : une solution à 5° près atteint la cible
  const L = [1, 0.8, 0.5], th = [80, 30, -115]; let p = [0, 0], c = 0;
  th.forEach((t, i) => { c += t; p = [p[0] + L[i] * Math.cos(c * D), p[1] + L[i] * Math.sin(c * D)]; });
  assert.ok(Math.hypot(p[0] - 0.4, p[1] - 1.7) < 0.07);
  // bras 2R : exemple, cible, boss
  const r = m.bras2R(30 * D, 45 * D, 0.4, 0.3); proche(r.M[0], 0.424, 1e-3); proche(r.M[1], 0.490, 1e-3);
  proche(r.T02[0][3], 0.346, 1e-3); proche(r.T02[1][3], 0.2, 1e-9);
  const c2 = m.bras2R(60 * D, 60 * D, 0.4, 0.3); assert.ok(Math.hypot(c2.M[0] - 0.05, c2.M[1] - 0.606) < 0.012);
  const c3 = m.bras2R(45 * D, 30 * D, 0.4, 0.3); assert.ok(Math.hypot(c3.M[0] - 0.36, c3.M[1] - 0.573) < 0.012);
  procheVec(m.bras2R(90 * D, -90 * D, 0.5, 0.5).M, [0.5, 0.5, 0]);
  proche(Math.abs(0.4 - 0.3), 0.1, 1e-12); assert.ok(0.8 > 0.4 + 0.3);
});

test("chapitre 1 du jeu : réponses attendues dans les niveaux", () => {
  const somme = (l) => l.reduce((a, x) => a + x, 0);
  // SCARA 0,8 / 0,6 : anneau entre 0,2 et 1,4
  proche(Math.abs(0.8 - 0.6), 0.2, 1e-12); proche(0.8 + 0.6, 1.4, 1e-12);
  // charge utile : 4,0 kg > 3 kg ; boss : 2,5 kg <= 3 kg
  proche(somme([1.2, 2.5, 0.3]), 4, 1e-12); assert.ok(somme([1.2, 2.5, 0.3]) > 3);
  proche(somme([0.8, 1.5, 0.2]), 2.5, 1e-12); assert.ok(somme([0.8, 1.5, 0.2]) <= 3);
  // temps de cycle et cadence
  const T1 = somme([0.30, 0.20, 0.55, 0.15, 0.45, 0.35]); proche(T1, 2, 1e-12); proche(3600 / T1, 1800, 1e-9);
  const T2 = somme([0.30 / 2, 0.20, 0.55 / 2, 0.15, 0.45 / 2, 0.35]); proche(T2, 1.35, 1e-12); proche(3600 / T2, 2666.67, 0.01);
  const T3 = somme([0.40, 0.25, 0.60, 0.25, 0.50, 0.40]); proche(T3, 2.4, 1e-12); proche(3600 / T3, 1500, 1e-9);
  const T4 = somme([0.4, 0.3, 0.5, 0.3]); proche(T4, 1.5, 1e-12); proche(3600 / T4, 2400, 1e-9);
  // mise à l'échelle 0,3 : 2 cm -> 6 mm, 1,5 cm -> 4,5 mm ; liaison pivot glissant : 2 DDL
  proche(2 * 0.3 * 10, 6, 1e-12); proche(1.5 * 0.3 * 10, 4.5, 1e-12); proche(6 - 4, 2, 0);
});

test("produit de matrices et révisions : réponses attendues", () => {
  const A = [[0, -1, 0], [1, 0, 0], [0, 0, 1]], B = [[2, 0, 0], [0, 1, 0], [0, 0, 1]];
  const AB = m.matMul(A, B), BA = m.matMul(B, A);
  procheVec(AB[0].slice(0, 2), [0, -1]); procheVec(AB[1].slice(0, 2), [2, 0]);
  procheVec(BA[0].slice(0, 2), [0, -2]); procheVec(BA[1].slice(0, 2), [1, 0]);
  procheVec(m.transpose(A)[0].slice(0, 2), [0, 1]); procheVec(m.transpose(A)[1].slice(0, 2), [-1, 0]);
  procheVec(m.matMul(m.transpose(A), A)[0], [1, 0, 0]);
  proche(1 * 5 + 2 * 7, 19, 0); proche(1 * 6 + 2 * 8, 22, 0);
  // révision des bases
  assert.ok(Math.cos(210 * D) < 0 && Math.sin(210 * D) < 0);
  proche(0.5 * Math.cos(120 * D), -0.25, 1e-12); proche(0.5 * Math.sin(120 * D), 0.433, 1e-3);
  proche(3 / 5, 0.6, 1e-12); proche(4 / 5, 0.8, 1e-12);
  procheVec(m.matVec([[1, 0, 0], [0, -1, 0], [0, 0, 1]], [2, 1, 0]), [2, -1, 0]); proche(m.det3([[1, 0, 0], [0, -1, 0], [0, 0, 1]]), -1);
  // révision de l'espace
  assert.ok(m.dot([2, 0, 0], [Math.cos(120 * D), Math.sin(120 * D), 0]) < 0);
  procheVec(m.cross([0, 1, 0], [1, 0, 0]), [0, 0, -1]);
  proche(2 * 3 * Math.sin(30 * D), 3, 1e-12);
  proche(Math.atan2(-1, -1) / D, -135, 1e-9);
  procheVec(m.add([1, 2, 0], m.matVec(m.Rz(90 * D), [2, 0, 0])), [1, 4, 0]);
  // révision des orientations
  procheVec(m.colonne(m.Rz(90 * D), 0), [0, 1, 0]);
  proche(m.Ry(30 * D)[2][0], -0.5, 1e-12);
  procheVec(m.colonne(m.matMul(m.Rz(0), m.Ry(90 * D)), 0), [0, 0, -1]);
  // révision des transformations
  const T = [[0, -1, 0, 1], [1, 0, 0, 0.6], [0, 0, 1, 0], [0, 0, 0, 1]];
  procheVec(m.matVec(T, [1, 0, 0, 0]), [0, 1, 0, 0]); procheVec(m.matVec(T, [0, 0, 0, 1]), [1, 0.6, 0, 1]);
  procheVec(m.bras2R(90 * D, -90 * D, 0.5, 0.3).M, [0.3, 0.5, 0]);
  const dans = (p) => { const r = Math.hypot(p[0], p[1]); return r >= 0.2 - 1e-9 && r <= 0.8 + 1e-9; };
  assert.ok(!dans([0.85, 0]) && !dans([0.1, 0.1]) && dans([0.4, 0.4]));
  // révision du robot : rotule
  proche(6 - 3, 3, 0);
});

test("architecture hospitalière : réponses attendues dans les niveaux", () => {
  const A = require("../modules/architecture/archi.js").calc;
  // renouvellement-air : salle de 7 m × 6 m × 3 m, 1 890 m³/h
  const V = A.volume(7, 6, 3);
  proche(V, 126); proche(A.ach(1890, V), 15);
  proche(A.debitPour(22, V), 2772);
  // revision-air : 8 m × 7 m × 3 m, 3 360 m³/h
  proche(A.volume(8, 7, 3), 168); proche(A.ach(3360, 168), 20);
  // td-calcul : 180 m³, 20 ACH retenus, 3 060 m³/h mesurés
  proche(A.debitPour(20, 180), 3600); proche(A.ach(3060, 180), 17); proche(A.debitPour(20, 180) - 3060, 540);
  // revision-td : 150 m³, 24 ACH, 3 900 m³/h
  proche(A.debitPour(24, 150), 3600); proche(A.ach(3900, 150), 26);
  // salle hybride : FGI 2022 (600 ft², 20 ft)
  proche(A.pi2VersM2(600), 55.74, 0.005); proche(A.piVersM(20), 6.10, 0.005);
  proche(9.2 * 6.1, 56.12, 1e-9); assert.ok(A.hybrideOk(9.2, 6.1));
  proche(7.2 * 6, 43.2, 1e-9); assert.ok(!A.hybrideOk(7.2, 6));
  // boss-salle : longueur 8,40 m -> largeur minimale 6,64 m (arrondi au cm supérieur)
  const lmin = (L) => Math.ceil(55.74 / L * 100 - 1e-9) / 100;
  proche(lmin(8.4), 6.64, 1e-9); assert.ok(A.hybrideOk(8.4, 6.64) && !A.hybrideOk(8.4, 6.63));
  // boss-conception : longueur 9,00 m -> 6,20 m
  proche(lmin(9), 6.20, 1e-9); assert.ok(A.hybrideOk(9, 6.2) && !A.hybrideOk(9, 6.19));
  // pression : l'air va du plus haut vers le plus bas
  assert.strictEqual(A.sensAir(15, 5), 1); assert.strictEqual(A.sensAir(0, 10), -1); assert.strictEqual(A.sensAir(3, 3), 0);
  // eclairage : un foyer est masqué par la tête, trois foyers écartés de 200 éclairent la plaie à 60 % au moins
  const G = { yS: 130, yO: 360, yF: 470, o1: 300, o2: 380 };
  const minPlaie = (k, e) => { let m = 1; for (let x = 320; x <= 360; x += 2) m = Math.min(m, A.lumiere(A.foyers(k, e, 340), x, G)); return m; };
  proche(minPlaie(1, 0), 0); assert.ok(minPlaie(3, 200) >= 0.6);
  procheVec(A.foyers(3, 200, 340), [140, 340, 540]);
});

// Module Systèmes embarqués
test("embarqués, chapitre 0 du jeu : réponses attendues (binaire, hexadécimal, signaux, révision, boss)", () => {
  const bin = (s) => parseInt(s, 2), bits = (v, nb) => v.toString(2).padStart(nb, "0");
  const max = (nb) => Math.pow(2, nb) - 1;
  // binaire
  assert.strictEqual(bits(37, 8), "00100101"); assert.strictEqual(32 + 4 + 1, 37);
  assert.strictEqual(Math.pow(2, 7), 128);
  assert.strictEqual(bin("11001000"), 200);
  assert.strictEqual(max(8), 255); assert.strictEqual(max(10), 1023); assert.strictEqual(max(12), 4095);
  // hexadécimal et registres
  assert.strictEqual(0xA5, 165); assert.strictEqual(bits(0xA5, 8), "10100101");
  assert.strictEqual(bits(0x3C, 8), "00111100"); assert.strictEqual(0x3C, 60);
  assert.strictEqual(0x88 + 0x4 * 3, 0x94); assert.strictEqual(0x88 + 0x4 * 1, 0x8C); assert.strictEqual(0x88 + 0x4 * 2, 0x90);
  const reg = bin("000100000001");
  assert.strictEqual(reg, 0x101); assert.strictEqual((reg >> 7) & 0b111, 2);
  assert.strictEqual(reg | (1 << 2), 0x105);
  assert.strictEqual(16 * 1024, 16384);
  // signaux
  const niv = [0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1];
  let montants = 0; for (let k = 1; k < niv.length; k++) if (niv[k - 1] === 0 && niv[k] === 1) montants++;
  assert.strictEqual(montants, 3);
  proche(1 / 8e6 * 1e9, 125, 1e-9);
  proche(1 / 9600 * 1e6, 104.17, 0.1);
  // révision
  assert.strictEqual(bits(97, 8), "01100001"); assert.strictEqual(97, 0x61);
  assert.strictEqual(0xFF, 255); assert.strictEqual(0x10, 16); assert.strictEqual(0x0A, 10); assert.notStrictEqual(0x1F, 15); assert.strictEqual(0x1F, 31);
  assert.strictEqual(max(16), 65535);
  const sig = [1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1];
  let desc = 0; for (let k = 1; k < sig.length; k++) if (sig[k - 1] === 1 && sig[k] === 0) desc++;
  assert.strictEqual(desc, 3);
  proche(1 / 40e6 * 1e9, 25, 1e-9);
  // boss : STATUS = 0xA1F4
  const st = 0xA1F4;
  assert.strictEqual(bits(st, 16), "1010000111110100");
  assert.strictEqual((st >> 15) & 1, 1); assert.strictEqual((st >> 12) & 0b111, 2); assert.strictEqual(st & 0xFFF, 500);
  proche((st & 0xFFF) * 3.3 / 4095, 0.403, 0.005);
});

test("systèmes embarqués, chapitre 1 : semelle, pilulier", () => {
  // semelle : 80 kg sur 16 capteurs, puis sur les 2 capteurs du talon ; plage 0,5 à 10 kg
  const parCapteur = 80 / 16, talon = 80 / 2;
  proche(parCapteur, 5, 1e-12); assert.ok(parCapteur >= 0.5 && parCapteur <= 10);
  proche(talon, 40, 1e-12); assert.ok(talon > 10);
  // cotes du capteur : deux disques D = 11 mm, entraxe L = 15 mm -> LT = L + D = 26 mm
  proche(15 + 11, 26, 0);
  // pilulier : 2000 mAh / 5 mA = 400 h, soit 16,7 jours (tolérance du niveau 0,05)
  const h = 2000 / 5;
  proche(h, 400, 1e-12); proche(h / 24, 16.7, 0.05);
});

test("chapitre 2 (embarqués) : cycles de bus, ARM2, choix des puces AVR", () => {
  // modèle simple ajouté : chaque instruction est lue puis accède à une donnée
  const vn = (N) => 2 * N, harvard = (N) => N + 1;
  assert.strictEqual(vn(4), 8); assert.strictEqual(harvard(4), 5);
  assert.strictEqual(vn(10), 20); assert.strictEqual(harvard(10), 11);
  assert.strictEqual(vn(6), 12); assert.strictEqual(harvard(6), 7);
  assert.strictEqual(vn(25), 50); assert.strictEqual(harvard(25), 26);
  // ARM2 : 2^24 mots de 32 bits = 64 Mio
  assert.strictEqual(Math.pow(2, 24) * 4 / Math.pow(2, 20), 64);
  // LSL #2 : R0 = R1 + 4 R2
  assert.strictEqual(10 + (3 << 2), 22);
  // CISC / RISC : MULT 6 × 7
  assert.strictEqual(6 * 7, 42);
  // tableau Microchip (diapositive 15) : [nom, flash KB, RAM KB, picoPower, UART, A/D]
  const T = [["ATmega6450", 64, 4, false, 1, 8], ["ATmega1284P", 128, 16, true, 2, 8], ["ATmega128", 128, 4, false, 2, 8], ["ATmega1280", 128, 8, false, 4, 16],
    ["ATmega1281", 128, 8, false, 2, 8], ["ATmega2560", 256, 8, false, 4, 16], ["ATmega2561", 256, 8, false, 2, 8]];
  const max = (l, k) => l.reduce((a, b) => (b[k] > a[k] ? b : a));
  const min = (l, k) => l.reduce((a, b) => (b[k] < a[k] ? b : a));
  assert.strictEqual(max(T.filter(r => r[5] >= 12), 1)[0], "ATmega2560");
  const pico = T.filter(r => r[3]); assert.strictEqual(pico.length, 1); assert.strictEqual(max(pico, 2)[0], "ATmega1284P");
  assert.strictEqual(min(T.filter(r => r[4] >= 4 && r[5] >= 12), 1)[0], "ATmega1280");
  // familles : 450 KB de flash
  const F = [["tinyAVR", 1, 16], ["megaAVR", 4, 256], ["AVR XMEGA", 16, 384], ["AVR32 UC3", 16, 512]];
  assert.deepStrictEqual(F.filter(f => 450 >= f[1] && 450 <= f[2]).map(f => f[0]), ["AVR32 UC3"]);
});

test("chapitre 3 du jeu (bus de communication) : réponses attendues dans les niveaux", () => {
  // bus : une liaison par paire de 7 composants
  proche(7 * 6 / 2, 21, 0);
  // UART : trame d'un octet, bit 0 envoyé en premier, start 0, stop 1
  const trame = (v) => [0].concat([0, 1, 2, 3, 4, 5, 6, 7].map(i => (v >> i) & 1), [1]);
  assert.deepStrictEqual(trame(75), [0, 1, 1, 0, 1, 0, 0, 1, 0, 1]);
  assert.strictEqual(parseInt("01001011", 2), 75);
  const lire = (bits) => bits.slice(1, 9).reduce((s, b, i) => s + b * Math.pow(2, i), 0);
  proche(lire([0, 1, 0, 1, 0, 0, 1, 0, 0, 1]), 37, 0);
  proche(10 / 9600 * 1000, 1.042, 0.005);
  proche(9600 / 10, 960, 0);
  proche(10 / 115200 * 1e6, 86.8, 0.1);
  proche(3 * 10 / 9600 * 1000, 3.125, 1e-9);
  assert.deepStrictEqual(trame(98).join(""), "0010001101");
  // vote 2 sur 3
  assert.strictEqual([1, 0, 1].reduce((s, b) => s + b, 0) >= 2 ? 1 : 0, 1);
  // SPI : anneau du cours (maître décale à gauche, esclave dessiné MSB à droite)
  const coup = (e) => ({ m: e.m.slice(1) + e.s[7], s: e.m[0] + e.s.slice(0, 7) });
  let e = { m: "10101010", s: "11000011" };
  e = coup(e); assert.deepStrictEqual(e, { m: "01010101", s: "11100001" });
  e = coup(e); assert.deepStrictEqual(e, { m: "10101011", s: "01110000" });
  for (let k = 2; k < 8; k++) e = coup(e);
  assert.deepStrictEqual(e, { m: "11000011", s: "01010101" });
  let r = { m: "11110000", s: "00110011" };
  for (let k = 0; k < 8; k++) r = coup(r);
  assert.deepStrictEqual(r, { m: "11001100", s: "00001111" });
  proche(8 / 2e6 * 1e6, 4, 1e-9);
  // SPI multi esclaves : 3 fils partagés + une ligne SS par esclave
  proche(3 + 4, 7, 0); proche(3 + 10, 13, 0);
  // I2C : tableau Bus / Clock du cours, impulsions SCL, adresses
  [[50e3, 800e3], [100e3, 1.6e6], [400e3, 6.4e6], [1000e3, 16e6]].forEach(([b, c]) => proche(c / b, 16, 1e-9));
  proche(3 * (8 + 1), 27, 0); proche(4 * (8 + 1), 36, 0);
  proche(Math.pow(2, 7), 128, 0);
  assert.strictEqual((parseInt("1010111", 2) << 1 | 1).toString(2), "10101111");
});

test("chapitre 4 du jeu (ESP32) : réponses attendues dans les niveaux", () => {
  // nomenclature (diapositive 4) : nombre de cœurs, MB de flash et de PSRAM intégrées
  const decode = (ref) => {
    const r = ref.replace(/^ESP32-/, "").replace(/-V3$/, "");
    return { coeurs: /^[DU]/.test(r) ? 2 : 1, flash: +r.charAt(1), psram: /R.?2/.test(r) ? 2 : 0, q6: /Q6/.test(r) };
  };
  const b = decode("ESP32-D0WDRH2-V3"); proche(b.coeurs, 2, 0); proche(b.psram, 2, 0); proche(b.flash, 0, 0);
  const u = decode("ESP32-U4WDH"); proche(u.coeurs, 2, 0); proche(u.flash, 4, 0);
  assert.ok(decode("ESP32-D0WDQ6-V3").q6 && decode("ESP32-S0WD").coeurs === 1);
  // plage de température : seul l'autoclave (134 °C) sort de −40 … +125 °C
  const dans = (t) => t >= -40 && t <= 125;
  assert.ok(!dans(134) && dans(22) && dans(-30));
  // brochage : quatre broches en entrée seule
  proche(["GPIO36", "GPIO39", "GPIO34", "GPIO35"].length, 4, 0);
  // spécifications : DMIPS par MHz, timers et watchdogs des deux groupes, périodes d'horloge
  proche(600 / 240, 2.5, 1e-12);
  proche(2 * 2, 4, 0); proche(2 * 1, 2, 0);
  proche(1e9 / 160e6, 6.25, 1e-12); proche(1e9 / 240e6, 4.17, 0.01);
  // alimentation : chute du LDO CPU, chute dans la résistance de 6 Ω à 50 mA
  proche(3.3 - 1.1, 2.2, 1e-12); proche(6 * 0.05, 0.3, 1e-12); proche(3.3 - 6 * 0.05, 3.0, 1e-12);
  // DMA : 500 échantillons/s × 2 octets × 10 s
  proche(500 * 2 * 10, 10000, 0);
  // plan d'adressage (diapositive 13)
  const h = (s) => parseInt(s.replace(/0x|_/g, ""), 16);
  const PLAN = [["0x3F40_0000", "0x3F7F_FFFF", "cache"], ["0x3F80_0000", "0x3FBF_FFFF", "cache"], ["0x3FF0_0000", "0x3FF7_FFFF", "periph"],
    ["0x3FF8_0000", "0x3FF8_1FFF", "rtcfast"], ["0x3FF9_0000", "0x3FF9_FFFF", "rom"], ["0x3FFA_E000", "0x3FFF_FFFF", "sram"],
    ["0x4000_0000", "0x4005_FFFF", "rom"], ["0x4007_0000", "0x400B_FFFF", "sram"], ["0x400C_0000", "0x400C_1FFF", "rtcfast"],
    ["0x400C_2000", "0x40BF_FFFF", "cache"], ["0x5000_0000", "0x5000_1FFF", "rtcslow"]];
  const dest = (a) => { const v = h(a), p = PLAN.find((x) => v >= h(x[0]) && v <= h(x[1])); return p ? p[2] : null; };
  assert.strictEqual(dest("0x3FF4_4000"), "periph"); assert.strictEqual(dest("0x4000_8000"), "rom");
  assert.strictEqual(dest("0x3FFB_0000"), "sram"); assert.strictEqual(dest("0x5000_0100"), "rtcslow");
  assert.strictEqual(dest("0x3FC0_1000"), null); assert.strictEqual(dest("0x400C_0100"), "rtcfast");
  assert.strictEqual(dest("0x3FF9_8000"), "rom"); assert.strictEqual(dest("0x3FF8_0800"), "rtcfast"); assert.strictEqual(dest("0x3FFC_0000"), "sram");
});

test("embarqués, chapitre 5 du jeu : périphériques de l'ESP32, réponses attendues", () => {
  // interruptions : 26 interruptions de périphériques par CPU, deux CPU
  proche(2 * 26, 52, 0);
  // registre GPIO_PINn_REG : décalage 0x88 + 0x4·n, valeur des champs
  proche(0x88 + 0x4 * 4, 0x98, 0);
  const valeur = (ena, wake, type, pad) => ena * 2 ** 13 + wake * 2 ** 10 + type * 2 ** 7 + pad * 2 ** 2;
  proche(1 << 2, 4, 0); // INT_ENA : seul le bit2 (PRO CPU interrupt enable)
  proche(valeur(4, 0, 2, 0), 0x8100, 0);
  proche(valeur(4, 0, 2, 0), 33024, 0);
  proche(valeur(4, 0, 2, 1), 0x8104, 0);
  proche(parseInt("010", 2), 2, 0); // INT_TYPE front descendant
  // ADC : ADC_OUT = 4095 × ADC_IN / 3,3
  const adc = (v) => 4095 * v / 3.3, adcInv = (c) => c * 3.3 / 4095;
  proche(adc(1.1), 1365, 1e-9);
  proche(adcInv(2730), 2.2, 1e-9);
  proche(2 ** 10 - 1, 1023, 0);
  proche(adcInv(1638), 1.32, 0.001);
  proche(adc(2.64), 3276, 1e-9);
  // SAR sur 1,1 V : 0, 1, 0, 1 pour les quatre premiers seuils
  let bas = 0, haut = 3.3, bits = "";
  for (let k = 0; k < 4; k++) { const s = (bas + haut) / 2, b = 1.1 >= s ? 1 : 0; bits += b; if (b) bas = s; else haut = s; }
  assert.strictEqual(bits, "0101");
  // DAC : DACn_OUT = VDD3P3_RTC × PDACn_DAC / 255
  const dac = (vdd, p) => vdd * p / 255;
  proche(dac(3.3, 200), 2.588, 0.001);
  assert.ok(Math.abs(dac(3.3, 77) - 1) <= 0.01 && Math.abs(dac(3.3, 76) - 1) > 0.01);
  proche(3300 / 255, 12.9, 0.05);
  proche(dac(3.0, 200), 2.35, 0.005);
  proche(1.65 * 255 / 3.3, 127.5, 1e-9);
  // timers : T_tic = prescaler / f, horloge 80 MHz (exemple ajouté)
  const tic = (p) => p / 80; // en µs
  proche(tic(80), 1, 1e-12);
  proche(2e-3 / (tic(80) * 1e-6), 2000, 1e-6);
  proche(80 / 2, 40, 0);
  proche(60 / (2000000 * tic(80) * 1e-6), 30, 1e-9);
  // watchdog : 2 MWDT + 1 RWDT
  proche(2 + 1, 3, 0);
  // PWM : V_moy = α × 3,3 ; f = 1 / T
  proche(0.3 * 3.3, 0.99, 1e-12);
  proche(0.75 * 3.3, 2.475, 1e-12);
  proche(1 / 0.0005, 2000, 1e-9);
  proche(0.5 * 1e6 / 2000, 250, 1e-9);
  // SPI : trois CS par bus, deux bus
  proche(3 * 2, 6, 0);
});

// Sous-module « Éléments mécaniques en robotique » (chapitres 5 à 8)

// ---------- Éléments mécaniques, chapitre 5 : architecture mécanique d'un axe ----------
const omega = (n) => 2 * Math.PI * n / 60; // (1.1)

test("chapitre 5 : ω = 2πn/60, P = Cω, réducteur Cs ≃ η i Ce", () => {
  proche(omega(60), 2 * Math.PI, 1e-12); proche(omega(60), 6.28, 0.01);
  proche(omega(3000), 314.16, 0.01);
  // viser 100 W à 3000 tr/min : seul C = 0,32 N·m (pas 0,01) tombe à moins de 1,6 W
  const bons = []; for (let c = 0; c <= 0.6001; c += 0.01) if (Math.abs(Math.round(c * 100) / 100 * omega(3000) - 100) <= 1.6) bons.push(Math.round(c * 100) / 100);
  assert.deepStrictEqual(bons, [0.32]);
  proche(omega(3000) / 50, 6.28, 0.02); proche(0.8 * 50 * 0.32, 12.8, 1e-12);
  proche(0.8 * 100 * 0.32, 25.6, 1e-12); proche(omega(3000) / 100, 3.14, 0.01);
  const Pe = 0.32 * omega(3000), Ps = 0.8 * 50 * 0.32 * omega(3000) / 50; proche(Ps / Pe, 0.8, 1e-12); proche(Pe, 100.5, 0.05); proche(Ps, 80.4, 0.05);
});

test("chapitre 5 : rigidité et jeu, exemple du cours L = 0,40 m, Δθ = 0,20°", () => {
  const dth = 0.20 * Math.PI / 180;
  proche(dth, 3.49e-3, 0.005e-3); proche(0.40 * dth * 1000, 1.40, 0.005);
  proche(20 / 0.010, 2000, 1e-9);               // kθ = C/θ
  proche(0.40 * (10 / 2000) * 1000, 2, 1e-12);   // Δx ≃ L C / kθ
});

test("chapitre 5 : révision et boss", () => {
  proche(omega(1500), 157.08, 0.005); proche(0.5 * omega(1500), 78.54, 0.005);
  proche(0.5 * 0.1 * Math.PI / 180 * 1000, 0.87, 0.005);   // l'erreur des degrés : 0,87 mm et non 5 cm
  proche((8 / 1000) / (8 / 4000), 4, 1e-12);
  proche(15 / (0.75 * 0.4), 50, 1e-9);
  proche(omega(3000) / 100, 3.14, 0.01); proche(0.7 * 100 * 0.25, 17.5, 1e-12);
  const jeu = 0.30 * 0.05 * Math.PI / 180 * 1000, tors = 0.30 * 17.5 / 5000 * 1000;
  proche(jeu, 0.26, 0.005); proche(tors, 1.05, 1e-9); assert.ok(tors > jeu);
});
// Chapitre 6 : assemblages et fixations (réponses attendues des niveaux, calculées)
test("assemblage vissé : T = K F0 d (M6, 4 kN, K = 0,20) et F0 avec K = 0,15", () => {
  const T = (K, F0, d) => K * F0 * d;
  proche(T(0.20, 4000, 0.006), 4.8, 1e-12);
  proche(4.8 / (0.15 * 0.006) / 1000, 5.333, 0.02);
  // révision : M5, 3 kN ; boss : M4, 2 kN
  proche(T(0.20, 3000, 0.005), 3, 1e-12);
  proche(T(0.20, 2000, 0.004), 1.6, 1e-12);
});

test("clavette : Ft = 2C/d et τ = Ft/(bL) (cours, cas nouveau, révision, boss)", () => {
  const Ft = (C, dmm) => 2 * C / (dmm / 1000), tau = (F, b, L) => F / (b * L);
  proche(Ft(8, 12), 1333.3, 2); proche(tau(Ft(8, 12), 4, 20), 16.67, 0.1);
  proche(tau(Ft(8, 12), 4, 40), tau(Ft(8, 12), 4, 20) / 2, 1e-9);
  proche(Ft(15, 20), 1500, 2); proche(tau(Ft(15, 20), 6, 16), 15.625, 0.1);
  proche(Ft(5, 10), 1000, 2); proche(tau(Ft(5, 10), 3, 12), 27.78, 0.1);
  const F = Ft(9, 14); proche(F, 1285.7, 3);
  // boss : la plus courte parmi 10, 12, 16, 25 mm qui reste sous 20 MPa (b = 5 mm) est 16 mm
  const ok = [10, 12, 16, 25].filter(L => tau(F, 5, L) <= 20);
  assert.strictEqual(ok[0], 16);
});

test("goupille d'arrêt : d ≈ D/3 ; ressorts : F = kx", () => {
  proche(24 / 3, 8, 1e-12);
  proche(1 * 12, 12, 1e-12); proche(12 / 12, 1, 1e-12); proche(2 * 15, 30, 1e-12);
  proche(6 / 4, 1.5, 1e-12); proche(18 / 6, 3, 1e-12); proche(3 * 10, 30, 1e-12);
});
test("chapitre 7 : raideur k = F/δ (critères, révision, boss)", () => {
  const k = (F, d) => F / d;
  proche(k(200, 0.05), 4000, 1e-9);                 // criteres-guidage, étape 2
  proche(k(200, 0.04), 5000, 1e-9); proche(k(200, 0.01), 20000, 1e-9); assert.ok(k(200, 0.01) > k(200, 0.04)); // étape 3 : B plus raide
  proche(4000 * 0.03, 120, 1e-9);                   // étape 4 : F max = k δ
  proche(k(900, 0.3), 3000, 1e-9);                  // revision-guidages, table
  proche(k(50, 0.02), 2500, 1e-9);                  // boss-guidages, raideur minimale
});

test("chapitre 7 : angle de contact, radial si α ≤ 45°", () => {
  const groupe = (a) => a <= 45 ? "R" : "B";
  assert.deepStrictEqual([15, 60, 40, 90].map(groupe), ["R", "B", "R", "B"]); // radiaux-butees, étape 3
  assert.strictEqual(groupe(45), "R"); assert.strictEqual(groupe(40), "R"); // limite, révision
});

test("chapitre 7 : déversements admissibles rangés du plus petit au plus grand", () => {
  // contact oblique ≈ 0 ; rigide à billes 2' à 10' ; rouleaux à rotule 1° à 2,5° ; billes à rotule 1,5° à 3°
  const max = [0, 10 / 60, 2.5, 3];
  for (let i = 1; i < max.length; i++) assert.ok(max[i] > max[i - 1]);
  assert.ok(2 > 10 / 60 && 2 <= 3 && 2 >= 1.5); // 2° : seule la rotule à billes convient parmi les choix de l'étape 1
});

test("chapitre 7 : durée nominale L10 et L10h (exemple du cours et niveaux)", () => {
  const L10 = (C, P, p) => Math.pow(C / P, p);
  const L10h = (C, P, p, n) => 1e6 / (60 * n) * L10(C, P, p);
  proche(L10(3.2, 0.8, 3), 64, 1e-9);                       // exemple du cours
  proche(L10h(3.2, 0.8, 3, 300), 3555.56, 0.01);            // ≃ 3556 h
  proche(L10(3.2, 0.8, 3) / L10(3.2, 1.6, 3), 8, 1e-9);     // charge doublée : divisée par 8
  proche(L10(3.2, 0.8, 10 / 3), 101.59, 0.01);              // rouleaux, C/P = 4
  const tours = 10000 * 60 * 300 / 1e6; proche(tours, 180, 1e-9);
  proche(0.8 * Math.cbrt(tours), 4.517, 0.001);             // C_req, exemple ajouté
  proche(L10(10, 2, 3), 125, 1e-9); proche(L10h(10, 2, 3, 5000), 416.67, 0.01); // centrifugeuse (révision)
  const t2 = 20000 * 60 * 100 / 1e6; proche(t2, 120, 1e-9); proche(0.4 * Math.cbrt(t2), 1.973, 0.001); // boss
  proche(L10(0.4 * Math.cbrt(t2), 0.4, 3), 120, 1e-9);     // vérification inverse
});

test("chapitre 7 : précharge, le jeu disparaît quand le serrage atteint le décalage", () => {
  const DEC = 15, jeu = (s) => Math.max(0, DEC - s);
  proche(jeu(15), 0, 0); assert.ok(jeu(10) > 0); proche(jeu(40), 0, 0);
});
test("chapitre 8 : arbres, couple C = 60P/(2πn) et torsion", () => {
  const C = (P, n) => 60 * P / (2 * Math.PI * n);
  proche(C(100, 3000), 0.318, 0.002);                       // exemple du cours (4.1)
  proche(C(100, 1000), 0.955, 0.001);                       // niveau : viser 1000 tr/min
  proche(C(15 * 745.7, 1450), 73.7, 0.2);                   // photo du cours, 15 HP (exemple ajouté)
  proche(100 / 3000 / C(100, 3000), 2 * Math.PI / 60, 1e-12); // erreur « C = P/n » : facteur 2π/60
  proche(C(2, 600), 0.0318, 0.0005);                        // révision : pousse-seringue
  const dmin = (Mt, Rpg) => Math.cbrt(16 * Mt / (Math.PI * Rpg)); // d mm, Mt N·mm, Rpg N/mm²
  proche(dmin(20000, 40), 13.66, 0.05);
  proche(dmin(40000, 40) / dmin(20000, 40), Math.cbrt(2), 1e-12); proche(Math.cbrt(2), 1.26, 0.005);
  proche(dmin(20, 40), 1.37, 0.01);                         // l'erreur d'unités du niveau
  proche(dmin(20000, 80) / dmin(20000, 40), 0.79, 0.005);   // révision : R_pg doublée
});

test("chapitre 8 : denture, module, rapport, entraxe", () => {
  const m = 2, Z = 17, d = m * Z;
  proche(d, 34, 1e-12); proche(d + 2 * m, 38, 1e-12); proche(d - 2.5 * m, 29, 1e-12);
  proche(Math.PI * 1.5, 4.712, 0.01);                       // pas p = πm
  const mc = 2.34 * Math.sqrt(1000 / (8 * 100));
  proche(mc, 2.62, 0.01);
  const N = [0.3, 0.5, 0.8, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
  proche(N.filter(x => x >= mc)[0], 3, 0);                  // module normalisé supérieur
  const MAX = { 13: 16, 14: 26, 15: 45, 16: 101, 17: Infinity };
  proche(+Object.keys(MAX).find(z => MAX[z] >= 40), 15, 0); // plus petit pignon pour 40 dents
  assert.ok(MAX[14] < 56 && MAX[15] >= 45);                 // boss : premier étage 14/56 refusé
  proche(17 / 20, 0.85, 1e-12); proche(2 * (17 + 20) / 2, 37, 1e-12);   // exemple du cours (4.2), (4.4)
  proche(15 * 3, 45, 0); proche(2 * (15 + 45) / 2, 60, 1e-12);
  proche(44 / (20 + 2), 2, 1e-12);                          // révision : d_a = m(Z + 2)
  proche(18 / 54, 0.333, 0.002); proche(1.5 * (18 + 54) / 2, 54, 1e-12);
});

test("chapitre 8 : trains, rendement en cascade, réducteur du boss", () => {
  const R41 = (Z1, Z2, Z3, Z4) => (Z3 * Z1) / (Z4 * Z2);
  proche(R41(15, 45, 12, 36), 1 / 9, 1e-12); proche(900 * R41(15, 45, 12, 36), 100, 1e-9);
  const eta = 0.97 * 0.97; proche(eta, 0.9409, 1e-12);
  proche(0.5 * 9 * eta, 4.23, 0.01);                        // C_s ≃ C_m i_tot η_tot, i = ωe/ωs = 9
  proche(0.5 * (1 / 9) * 0.94, 0.052, 0.001);               // l'erreur de convention du niveau
  const Cm = 60 * 60 / (2 * Math.PI * 6000); proche(Cm, 0.0955, 0.0005);
  const R = R41(14, 56, 15, 45); proche(R, 1 / 12, 1e-12); proche(6000 * R, 500, 1e-9);
  const et = 0.95 * 0.95; proche(et, 0.9025, 1e-12);
  const Cs = Cm * 12 * et; proche(Cs, 1.034, 0.01);
  proche(Cs * 2 * Math.PI * 500 / 60, 54.15, 0.01); proche(60 * et, 54.15, 1e-9);
  proche(Math.cbrt(16 * Cs * 1000 / (Math.PI * 30)), 5.6, 0.03);
});

// Module Biomatériaux : un fichier de tests par chapitre (tests/biomateriaux/), mêmes outils.
const dossierBio = require("path").join(__dirname, "biomateriaux");
if (require("fs").existsSync(dossierBio)) for (const f of require("fs").readdirSync(dossierBio).filter(f => f.endsWith(".test.js")).sort()) require("./biomateriaux/" + f)({ test, proche, assert });

console.log(`${n} tests réussis`);
