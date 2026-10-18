(function () {
  "use strict";
  var R = RM, C = R.C;

  /* ---------- M V : ligne par ligne, ou combinaison des colonnes de M ---------- */
  var f = R.figure("fig-matrice-vecteur", {
    largeur: 760, hauteur: 560,
    titre: "Produit d'une matrice par un vecteur, lu colonne par colonne",
    essai: "<strong>Essaie</strong> : choisis une matrice, puis règle \\(v_1\\) et \\(v_2\\). " +
      "<strong>Observe</strong> : \\(MV\\) s'obtient en mettant bout à bout \\(v_1\\) fois la colonne 1 (rouge) et \\(v_2\\) fois la colonne 2 (verte). Avec la matrice du quart de tour, tout vecteur tourne de 90°."
  });
  var g = R.el("g", null, f.svg);
  var MATS = [["M = (2 1 ; 1 3)", [[2, 1], [1, 3]]], ["Quart de tour", [[0, -1], [1, 0]]], ["Étirement ×2 selon x", [[2, 0], [0, 1]]]];
  var M = MATS[1][1], b = R.boutons(f.reglages), bts = [];
  MATS.forEach(function (x) { bts.push(R.bouton(b, x[0], function () { M = x[1]; dessin(); })); });
  var c1 = R.curseur(f.reglages, { nom: "v₁", min: -3, max: 3, pas: 0.5, val: 3, dec: 1 });
  var c2 = R.curseur(f.reglages, { nom: "v₂", min: -3, max: 3, pas: 0.5, val: 1, dec: 1 });
  [c1, c2].forEach(function (c) { c.surChange(dessin); });
  function dessin() {
    R.vider(g);
    bts.forEach(function (bt, i) { bt.classList.toggle("actif", MATS[i][1] === M); });
    var V = [c1.v, c2.v], k1 = [M[0][0], M[1][0]], k2 = [M[0][1], M[1][1]];
    var MV = [M[0][0] * V[0] + M[0][1] * V[1], M[1][0] * V[0] + M[1][1] * V[1]];
    var pts = [[0, 0], k1, k2, V, MV, [V[0] * k1[0], V[0] * k1[1]]], xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; });
    var xa = Math.min.apply(null, xs) - 1, xb = Math.max.apply(null, xs) + 1, ya = Math.min.apply(null, ys) - 1, yb = Math.max.apply(null, ys) + 1;
    var s = Math.min(720 / (xb - xa), 520 / (yb - ya), 90);
    var P = R.plan(380 - s * (xa + xb) / 2, 280 + s * (ya + yb) / 2, s);
    R.grille(g, P, f.svg, { pas: 1 });
    R.fleche(g, P.p([0, 0]), P.p(V), { couleur: C.gris, epaisseur: 4, tete: 16 });
    R.texte(g, "V", R.m.add(P.p(V), [16, -12]), { couleur: C.doux, taille: 20, gras: true });
    var a = [V[0] * k1[0], V[0] * k1[1]];
    R.fleche(g, P.p([0, 0]), P.p(k1), { couleur: C.x, epaisseur: 3, tete: 14, opacite: 0.5 });
    R.fleche(g, P.p([0, 0]), P.p(k2), { couleur: C.y, epaisseur: 3, tete: 14, opacite: 0.5 });
    R.fleche(g, P.p([0, 0]), P.p(a), { couleur: C.x, epaisseur: 6, tete: 18 });
    R.fleche(g, P.p(a), P.p(MV), { couleur: C.y, epaisseur: 6, tete: 18 });
    R.fleche(g, P.p([0, 0]), P.p(MV), { couleur: C.z, epaisseur: 4, tete: 18, tirets: "9 6" });
    R.texte(g, "MV", R.m.add(P.p(MV), [22, -16]), { couleur: C.z, taille: 22, gras: true });
    R.texte(g, "colonne 1", R.m.add(P.p(k1), [k1[0] >= 0 ? 50 : -50, 0]), { couleur: C.x, taille: 17, italique: false });
    R.texte(g, "colonne 2", R.m.add(P.p(k2), [0, k2[1] >= 0 ? -22 : 22]), { couleur: C.y, taille: 17, italique: false });
    var tm = R.texMat(M, 0).replace(/\{,\}0+/g, ""), tv = "\\begin{pmatrix}" + R.tc(V[0], 1) + "\\\\" + R.tc(V[1], 1) + "\\end{pmatrix}";
    R.rendre(f.direct, tm + tv + " = " + R.tc(V[0], 1) + "\\textcolor{" + C.x + "}{\\begin{pmatrix}" + k1[0] + "\\\\" + k1[1] + "\\end{pmatrix}} + " + R.tc(V[1], 1) +
      "\\textcolor{" + C.y + "}{\\begin{pmatrix}" + k2[0] + "\\\\" + k2[1] + "\\end{pmatrix}} = \\begin{pmatrix}" + R.tc(MV[0], 1) + "\\\\" + R.tc(MV[1], 1) + "\\end{pmatrix}");
  }
  dessin();
})();
