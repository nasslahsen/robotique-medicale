(function () {
  "use strict";
  var R = RM, C = R.C;

  /* ---------- Norme (Pythagore) et vecteur unitaire ---------- */
  var f = R.figure("fig-norme", {
    largeur: 760, hauteur: 560,
    titre: "Longueur d'un vecteur et vecteur unitaire",
    essai: "<strong>Essaie</strong> : place le bout de \\(\\vec{u}\\) en (5 ; 12)… trop loin : essaie (4 ; 3), puis (−4 ; 3). Coche « Vecteur unitaire ». " +
      "<strong>Observe</strong> : la longueur est l'hypoténuse du triangle : pour (4 ; 3), \\(\\sqrt{4^2 + 3^2} = 5\\), et le signe ne change rien. Diviser par la norme ramène le vecteur sur le cercle de rayon 1, sans changer sa direction."
  });
  var g = R.el("g", null, f.svg);
  var b = R.boutons(f.reglages);
  var unit = R.bascule(b, "Vecteur unitaire u / ‖u‖", false, dessin);
  var P = R.plan(300, 380, 62), u = [4, 3];
  function dessin() {
    R.vider(g);
    R.grille(g, P, f.svg, { pas: 1 });
    var L = Math.hypot(u[0], u[1]);
    R.el("circle", { cx: P.ox, cy: P.oy, r: P.s, fill: PLATEFORME.teinte(0.08), stroke: C.acc, "stroke-width": 3 }, g);
    R.texte(g, "rayon 1", R.m.add(P.p([0, 0]), [-30, 76]), { couleur: C.acc, taille: 16, italique: false });
    if (u[0] && u[1]) {
      R.ligne(g, P.p([0, 0]), P.p([u[0], 0]), { couleur: C.x, epaisseur: 6 });
      R.ligne(g, P.p([u[0], 0]), P.p(u), { couleur: C.y, epaisseur: 6 });
      R.texte(g, "u_x = " + u[0], R.m.add(P.p([u[0] / 2, 0]), [0, u[1] > 0 ? 24 : -24]), { couleur: C.x, taille: 19, italique: false, gras: true });
      R.texte(g, "u_y = " + u[1], R.m.add(P.p([u[0], u[1] / 2]), [u[0] > 0 ? 16 : -16, 0]), { couleur: C.y, taille: 19, italique: false, gras: true, ancre: u[0] > 0 ? "start" : "end" });
    }
    R.fleche(g, P.p([0, 0]), P.p(u), { couleur: C.z, epaisseur: 6, tete: 20 });
    if (L > 0) R.texte(g, "‖u‖ = " + R.fmt(L, 2), R.m.add(P.p([u[0] / 2, u[1] / 2]), [-24 * u[1] / L - 10, -24 * u[0] / L]), { couleur: C.z, taille: 20, italique: false, gras: true, ancre: "end" });
    if (unit.checked && L > 0) {
      R.fleche(g, P.p([0, 0]), P.p([u[0] / L, u[1] / L]), { couleur: C.v, epaisseur: 7, tete: 18 });
      R.texte(g, "u / ‖u‖", R.m.add(P.p([u[0] / L, u[1] / L]), [26, 18]), { couleur: C.v, taille: 19, italique: false, gras: true, ancre: "start" });
    }
    R.poignee(f.svg, g, P.p(u), function (q) {
      var w = P.inv(q); u = [Math.max(-4, Math.min(7, Math.round(w[0]))), Math.max(-5, Math.min(5, Math.round(w[1])))]; dessin();
    }, { couleur: C.z, r: 10 });
    R.rendre(f.direct, "\\|\\vec{u}\\| = \\sqrt{" + R.tc(u[0], 0) + "^2 + " + R.tc(u[1], 0) + "^2} = " + R.tc(L, 3) +
      (L > 0 ? " \\qquad \\frac{\\vec{u}}{\\|\\vec{u}\\|} = (" + R.tn(u[0] / L, 3) + " \\,;\\ " + R.tn(u[1] / L, 3) + ")" : ""));
  }
  dessin();
})();
