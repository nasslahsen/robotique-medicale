(function () {
  "use strict";
  var R = RM, C = R.C;

  /* ---------- Produit de matrices : appliquer B puis A, l'ordre compte ; transposée ---------- */
  var f = R.figure("fig-produit-matrices", {
    largeur: 760, hauteur: 560,
    titre: "La lettre F transformée par A (quart de tour) et D (étirement)",
    essai: "<strong>Essaie</strong> : compare « AD » et « DA », puis essaie « A puis Aᵀ ». " +
      "<strong>Observe</strong> : \\(AD\\) applique d'abord \\(D\\) (celle de droite), puis \\(A\\) ; \\(DA\\) donne une autre lettre. \\(A^T A\\) ramène la lettre à sa place : pour une rotation, la transposée est l'inverse."
  });
  var g = R.el("g", null, f.svg);
  var A = [[0, -1], [1, 0]], B = [[1, 0], [0, 3]], I = [[1, 0], [0, 1]];
  function mul(X, Y) { return [0, 1].map(function (i) { return [0, 1].map(function (j) { return X[i][0] * Y[0][j] + X[i][1] * Y[1][j]; }); }); }
  function tr(X) { return [[X[0][0], X[1][0]], [X[0][1], X[1][1]]]; }
  var CAS = [["A", A, "A"], ["D", B, "D"], ["AD : D puis A", mul(A, B), "AD"], ["DA : A puis D", mul(B, A), "DA"], ["Aᵀ", tr(A), "A^T"], ["A puis Aᵀ", mul(tr(A), A), "A^T A"]];
  var k = 2, b = R.boutons(f.reglages), bts = [];
  CAS.forEach(function (x, i) { bts.push(R.bouton(b, x[0], function () { k = i; dessin(); })); });
  var F = [[[0, 0], [0, 1.2]], [[0, 1.2], [0.7, 1.2]], [[0, 0.6], [0.5, 0.6]]];
  var P = R.plan(470, 300, 100);
  function mv(M, p) { return [M[0][0] * p[0] + M[0][1] * p[1], M[1][0] * p[0] + M[1][1] * p[1]]; }
  function lettre(M, coul, ep) { F.forEach(function (s) { R.ligne(g, P.p(mv(M, s[0])), P.p(mv(M, s[1])), { couleur: coul, epaisseur: ep }); }); }
  function dessin() {
    R.vider(g);
    bts.forEach(function (bt, i) { bt.classList.toggle("actif", i === k); });
    R.grille(g, P, f.svg, { pas: 0.5, fort: 2 });
    var M = CAS[k][1];
    lettre(I, "#d9dde6", 12);
    lettre(M, C.acc, 13);
    R.fleche(g, P.p([0, 0]), P.p([M[0][0], M[1][0]]), { couleur: C.x, epaisseur: 5, tete: 16 });
    R.fleche(g, P.p([0, 0]), P.p([M[0][1], M[1][1]]), { couleur: C.y, epaisseur: 5, tete: 16 });
    R.texte(g, "colonne 1", R.m.add(P.p([M[0][0], M[1][0]]), [M[0][0] >= 0 ? 52 : -52, 18]), { couleur: C.x, taille: 17, italique: false });
    R.texte(g, "colonne 2", R.m.add(P.p([M[0][1], M[1][1]]), [M[0][1] > 0 ? 52 : M[0][1] < 0 ? 10 : 52, M[0][1] < 0 ? -24 : -18]), { couleur: C.y, taille: 17, italique: false });
    R.texte(g, "lettre d'origine en gris", [30, 30], { couleur: C.doux, taille: 16, italique: false, ancre: "start" });
    function m(X) { return R.texMat(X, 0).replace(/\{,\}0+/g, ""); }
    R.rendre(f.direct, CAS[k][2] + " = " + m(M) + (k === 2 ? " \\neq DA = " + m(mul(B, A)) : k === 3 ? " \\neq AD = " + m(mul(A, B)) : k === 5 ? " = I" : ""));
  }
  dessin();
})();
