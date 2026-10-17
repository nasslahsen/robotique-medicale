(function () {
  "use strict";
  var R = RM, C = R.C, m = R.m;

  var f = R.figure("fig-so3", {
    hauteur: 460,
    titre: "Les trois colonnes d'une matrice dessinées comme un repère",
    essai: "<strong>Essaie</strong> : pars d'une rotation, puis clique sur « Perturber » ou modifie un coefficient à la main. " +
      "<strong>Observe</strong> : dès qu'une colonne n'est plus unitaire ou que deux colonnes ne sont plus perpendiculaires, \\(R^T R\\) s'écarte de \\(I\\). Avec « Miroir », tout reste orthonormé mais \\(\\det R = -1\\) : le repère dessiné devient indirect."
  });
  var V = R.vue3D(300, 265, 155, -45 * R.DEG, 24 * R.DEG);
  var g = R.el("g", null, f.svg);
  var grille = R.h("div", { "class": "saisie-matrice" }, "", f.reglages);
  var champs = [];
  for (var i = 0; i < 9; i++) {
    var inp = R.h("input", { type: "text", inputmode: "decimal", "aria-label": "coefficient r" + (Math.floor(i / 3) + 1) + (i % 3 + 1) }, undefined, grille);
    inp.addEventListener("input", function () { lire(); dessiner(); });
    champs.push(inp);
  }
  var b = R.boutons(f.reglages);
  var M = m.Rz(30 * R.DEG);
  R.bouton(b, "Rotation R_z(30°)", function () { ecrire(m.Rz(30 * R.DEG)); });
  R.bouton(b, "Rotation quelconque", function () { ecrire(m.eulerZYX((Math.random() * 2 - 1) * Math.PI, (Math.random() - 0.5) * 2.4, (Math.random() * 2 - 1) * Math.PI)); });
  R.bouton(b, "Perturber", function () { ecrire(M.map(function (l) { return l.map(function (x) { return x + (Math.random() - 0.5) * 0.4; }); })); });
  R.bouton(b, "Miroir (z → −z)", function () { ecrire(M.map(function (l) { return [l[0], l[1], -l[2]]; })); });
  var tourne = R.basculeOrbite(b);
  var zone = R.h("div", null, "", f.direct), verdict = R.h("p", null, "", f.direct);

  function ecrire(N) {
    M = N;
    champs.forEach(function (c, k) { c.value = R.fmt(N[Math.floor(k / 3)][k % 3], 3).replace("−", "-"); });
    dessiner();
  }
  function lire() {
    champs.forEach(function (c, k) { var v = parseFloat(c.value.replace(",", ".").replace("−", "-")); M[Math.floor(k / 3)][k % 3] = isNaN(v) ? 0 : v; });
  }

  function dessiner() {
    R.vider(g);
    var O = [0, 0, 0];
    R.repere3D(g, V, O, m.identite(3), { couleurs: [C.gris, C.gris, C.gris], indice: "0", epaisseur: 1.4, opacite: 0.6, longueur: 1.25 });
    R.repere3D(g, V, O, M, { indice: "", noms: ["col 1", "col 2", "col 3"], epaisseur: 3.2, taille: 16 });
    var cols = [0, 1, 2].map(function (j) { return m.colonne(M, j); });
    var n = cols.map(m.norme), d = [m.dot(cols[0], cols[1]), m.dot(cols[0], cols[2]), m.dot(cols[1], cols[2])];
    var RtR = m.matMul(m.transpose(M), M), det = m.det3(M);
    var ecart = 0; RtR.forEach(function (l, i) { l.forEach(function (x, j) { ecart = Math.max(ecart, Math.abs(x - (i === j ? 1 : 0))); }); });
    R.rendre(zone,
      "R = " + R.texMat(M, 3, { couleursCol: [C.x, C.y, C.z] }) + "\\qquad R^T R = " + R.texMat(RtR, 3) +
      "\\\\[6pt] \\|\\text{col}_1\\| = " + R.tn(n[0], 3) + ",\\ \\|\\text{col}_2\\| = " + R.tn(n[1], 3) + ",\\ \\|\\text{col}_3\\| = " + R.tn(n[2], 3) +
      "\\\\[4pt] \\text{col}_1 \\cdot \\text{col}_2 = " + R.tn(d[0], 3) + ",\\ \\text{col}_1 \\cdot \\text{col}_3 = " + R.tn(d[1], 3) + ",\\ \\text{col}_2 \\cdot \\text{col}_3 = " + R.tn(d[2], 3) +
      "\\\\[4pt] \\det R = " + R.tn(det, 3));
    var ok = ecart < 2e-3;
    verdict.innerHTML = ok && det > 0 ? "Les colonnes sont orthonormées et det R = +1 : c'est une matrice de rotation, et R⁻¹ = Rᵀ."
      : ok ? '<span class="alerte">Colonnes orthonormées mais det R = −1 : c\'est un miroir (repère indirect), pas une rotation.</span>'
      : '<span class="alerte">RᵀR ≠ I (écart ' + R.fmt(ecart, 3) + ") : les colonnes ne forment pas un repère orthonormé. Ce n'est pas une rotation.</span>";
  }
  R.orbite(f.svg, V, dessiner, tourne);
  ecrire(M);
})();
