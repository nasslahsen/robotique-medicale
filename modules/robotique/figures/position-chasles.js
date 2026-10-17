(function () {
  "use strict";
  var R = RM, C = R.C, m = R.m;

  var f = R.figure("fig-chasles", {
    hauteur: 440,
    titre: "Repère fixe R0, solide S et son repère Rs, point M du solide",
    essai: "<strong>Essaie</strong> : déplace \\(O_s\\) (point orange), puis fais tourner le solide avec \\(\\alpha_s\\). Tu peux aussi déplacer \\(M\\) sur le solide. " +
      "<strong>Observe</strong> : en tournant, \\(\\overrightarrow{O_s M}\\) garde les mêmes composantes dans \\(R_s\\) (ligne verte), mais pas dans \\(R_0\\) (ligne violette). La somme donne toujours \\(\\overrightarrow{O_0 M}\\)."
  });
  var P = R.plan(52, 385, 82);
  var g = R.el("g", null, f.svg), gp = R.el("g", null, f.svg);
  var ca = R.curseur(f.reglages, { nom: "αs (rotation de S)", min: -180, max: 180, pas: 1, val: 25, unite: "°", surChange: dessiner });
  var Os = [3, 1.6], Ms = [1.6, 0.7];
  var zone = R.h("div", null, "", f.direct);
  var forme = [[-0.7, -0.8], [2.2, -0.8], [2.6, 0], [2.2, 1.1], [-0.7, 1.1], [-1, 0.15]];

  function dessiner() {
    R.vider(g); R.vider(gp);
    var a = ca.v * R.DEG, Rs = [[Math.cos(a), -Math.sin(a)], [Math.sin(a), Math.cos(a)]];
    var versMonde = function (l) { return m.add(Os, [Rs[0][0] * l[0] + Rs[0][1] * l[1], Rs[1][0] * l[0] + Rs[1][1] * l[1]]); };
    R.grille(g, P, f.svg, { pas: 0.5, fort: 2, axes: false });
    R.polygone(g, forme.map(function (l) { return P.p(versMonde(l)); }), { remplissage: "rgba(139,63,217,.10)", couleur: C.v, epaisseur: 2 });
    R.texte(g, "S", P.p(versMonde([-0.45, 0.8])), { couleur: C.v, gras: true, taille: 22 });
    R.repere2D(g, P, [0, 0], [1, 0], [0, 1], { longueur: 1.1, indice: "0" });
    R.texte(g, "O₀", m.add(P.p([0, 0]), [-4, 22]), { italique: true, taille: 18 });
    var ex = [Rs[0][0], Rs[1][0]], ey = [Rs[0][1], Rs[1][1]];
    R.repere2D(g, P, Os, ex, ey, { longueur: 0.9, indice: "s", epaisseur: 2 });
    var M = versMonde(Ms);
    R.fleche(g, P.p([0, 0]), P.p(Os), { couleur: C.z, epaisseur: 3.5 });
    R.fleche(g, P.p(Os), P.p(M), { couleur: C.v, epaisseur: 3.5 });
    R.fleche(g, P.p([0, 0]), P.p(M), { couleur: C.fonce, epaisseur: 2.5, tirets: "8 5" });
    R.texte(g, "O₀Oₛ", m.add(P.p(m.scale(Os, 0.5)), [10, 22]), { couleur: C.z, gras: true, taille: 17 });
    R.texte(g, "M", m.add(P.p(M), [16, -14]), { couleur: C.fonce, gras: true });
    R.texte(g, "Oₛ", m.add(P.p(Os), [16, 26]), { taille: 18 });
    R.poignee(f.svg, gp, P.p(Os), function (q) {
      var w = P.inv(q); Os = [Math.max(1, Math.min(5.4, Math.round(w[0] * 10) / 10)), Math.max(0.8, Math.min(3.6, Math.round(w[1] * 10) / 10))]; dessiner();
    });
    R.poignee(f.svg, gp, P.p(M), function (q) {
      var d = m.sub(P.inv(q), Os); // repasse en coordonnées locales : Rsᵀ d
      var l = [Rs[0][0] * d[0] + Rs[1][0] * d[1], Rs[0][1] * d[0] + Rs[1][1] * d[1]];
      Ms = [Math.max(-0.6, Math.min(2.4, Math.round(l[0] * 10) / 10)), Math.max(-0.7, Math.min(1, Math.round(l[1] * 10) / 10))];
      dessiner();
    }, { couleur: C.v, r: 7 });
    var OsM0 = m.sub(M, Os);
    R.rendre(zone,
      "\\overrightarrow{O_0 O_s}^{\\,0} = " + R.texVec(Os, 1, C.z) +
      "\\qquad \\overrightarrow{O_s M}^{\\,s} = " + R.texVec(Ms, 1, C.y) + "\\ \\text{(constant)}" +
      "\\qquad \\overrightarrow{O_s M}^{\\,0} = " + R.texVec(OsM0, 2, C.v) +
      "\\\\[6pt] \\overrightarrow{O_0 M}^{\\,0} = " + R.texVec(Os, 1, C.z) + " + " + R.texVec(OsM0, 2, C.v) + " = " + R.texVec(M, 2));
  }
  dessiner();
})();
