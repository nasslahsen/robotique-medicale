// Vérifie les calculs des figures et tous les exemples chiffrés des pages.
// Lancer : node tests/math.test.js
"use strict";
const assert = require("assert");
const { m } = require("../assets/js/lib.js");
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

console.log(`${n} tests réussis`);
