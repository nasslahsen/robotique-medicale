// Vérifie les calculs utilisés par les widgets et les exemples chiffrés du site.
// Lancer : node tests/test_math.js
const assert = require("assert");
const { math: M } = require("../docs/assets/js/widgets.js");
const D = M.DEG;
const near = (a, b, tol = 1e-9, msg = "") => assert.ok(Math.abs(a - b) < tol, `${msg} ${a} != ${b}`);
const nearMat = (A, B, tol = 1e-9) => A.forEach((r, i) => r.forEach((v, j) => near(v, B[i][j], tol, `[${i}][${j}]`)));
let n = 0; const t = (name, f) => { f(); n++; console.log("ok -", name); };

t("Rz, Ry, Rx dans SO(3)", () => {
  for (const R of [M.Rz(0.7), M.Ry(-1.1), M.Rx(2.3), M.eulerZYX(0.3, -0.8, 1.9)]) {
    near(M.det3(R), 1);
    nearMat(M.matMul(M.transpose(R), R), [[1,0,0],[0,1,0],[0,0,1]]);
  }
});

t("colonnes de Rz(α) = axes de R1 dans R0 (cours 3, projections)", () => {
  const a = 30 * D, R = M.Rz(a);
  near(R[0][0], Math.cos(a)); near(R[1][0], Math.sin(a));   // x2 = cos α x1 + sin α y1
  near(R[0][1], -Math.sin(a)); near(R[1][1], Math.cos(a));  // y2 = −sin α x1 + cos α y1
});

t("produits vectoriels du corrigé (cours 3)", () => {
  const a = 0.6, x1 = [1,0,0], y1 = [0,1,0], z1 = [0,0,1];
  const x2 = [Math.cos(a), Math.sin(a), 0], y2 = [-Math.sin(a), Math.cos(a), 0];
  const chk = (v, w) => v.forEach((c, i) => near(c, w[i]));
  chk(M.cross(x1, y1), z1);
  chk(M.cross(x1, x2), [0, 0, Math.sin(a)]);
  chk(M.cross(y1, y2), [0, 0, Math.sin(a)]);
  chk(M.cross(z1, y1), [-1, 0, 0]);
  chk(M.cross(z1, x1), [0, 1, 0]);
  chk(M.cross(x1, y2), [0, 0, Math.cos(a)]);
  chk(M.cross(y1, x2), [0, 0, -Math.cos(a)]);
  chk(M.cross(y2, x1), [0, 0, -Math.cos(a)]);
  chk(M.cross(y2, y1), [0, 0, -Math.sin(a)]);
  chk(M.cross(x2, z1), y2.map(c => -c));
  chk(M.cross(x2, x1), [0, 0, -Math.sin(a)]);
  near(M.dot(y1, x2), Math.sin(a)); near(M.dot(x1, y2), -Math.sin(a));
});

t("ZYX : β = 90° aligne x2 sur −z0 (téléphone du cours)", () => {
  const R12 = M.matMul(M.Rz(-90 * D), M.Ry(90 * D));
  const x2 = [R12[0][0], R12[1][0], R12[2][0]];
  near(x2[0], 0); near(x2[1], 0); near(x2[2], -1);
});

t("XYZ du cours : φ = 90°, θ = 90°, ψ = −90°", () => {
  const R = M.eulerXYZ(-90 * D, 90 * D, 90 * D); // eulerXYZ(α=ψ autour de z, β=θ, γ=φ)
  const col = j => [R[0][j], R[1][j], R[2][j]];
  const chk = (v, w) => v.forEach((c, i) => near(c, w[i]));
  chk(col(0), [0, 0, -1]); // x3 = −z0
  chk(col(1), [0, 1, 0]);  // y3 = y0
  chk(col(2), [1, 0, 0]);  // z3 = x0
});

t("bras 2R : T^{0,2} = T^{0,1}T^{1,2} et formule directe", () => {
  for (const [a, b, l1, l2] of [[30, 45, 0.4, 0.3], [-120, 70, 1, 0.5], [0, 0, 0.4, 0.3], [90, -90, 0.5, 0.5]]) {
    const r = M.bras2R(a * D, b * D, l1, l2);
    near(r.M[0], l1 * Math.cos(a * D) + l2 * Math.cos((a + b) * D));
    near(r.M[1], l1 * Math.sin(a * D) + l2 * Math.sin((a + b) * D));
    nearMat(r.T02.slice(0, 3).map(row => row.slice(0, 3)), M.Rz((a + b) * D));
    near(r.T02[0][3], l1 * Math.cos(a * D)); near(r.T02[1][3], l1 * Math.sin(a * D));
  }
  const r = M.bras2R(30 * D, 45 * D, 0.4, 0.3);   // exemple chiffré de la page 4.3
  near(r.M[0], 0.4241, 1e-4); near(r.M[1], 0.4898, 1e-4);
});

t("conversions cartésien <-> cylindrique", () => {
  const c = M.versCylindrique(-1, 1, 2);
  near(c.r, Math.SQRT2); near(c.theta, 135 * D);
  const b = M.versCartesien(c.r, c.theta, c.z);
  near(b.x, -1); near(b.y, 1); near(b.z, 2);
});

t("produit matriciel : dimensions", () => {
  assert.throws(() => M.matMul([[1, 2, 3, 4], [5, 6, 7, 8]], [[1, 2], [3, 4], [5, 6]]));
  const C = M.matMul([[1, 2], [3, 4], [5, 6]], [[1, 0, 2, 1], [0, 1, 1, 3]]);
  assert.deepStrictEqual(C, [[1, 2, 4, 7], [3, 4, 10, 15], [5, 6, 16, 23]]);
});

console.log(`${n} tests réussis`);
