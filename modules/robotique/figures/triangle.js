(function () {
  "use strict";
  var R = RM, C = R.C;

  /* ---------- Le bras et son triangle rectangle : adjacent L cos θ, opposé L sin θ ---------- */
  var f = R.figure("fig-triangle", {
    largeur: 760, hauteur: 540,
    titre: "Bras de longueur L incliné de θ : le triangle rectangle",
    essai: "<strong>Essaie</strong> : règle L = 0,8 m et θ = 60°. Coche « Partir du bout » et amène le bout en (0,5 ; 0,6). " +
      "<strong>Observe</strong> : le côté rouge, collé à l'angle, vaut \\(L\\cos\\theta\\) ; le vert, en face, vaut \\(L\\sin\\theta\\). Dans l'autre sens, Pythagore donne L et la tangente donne θ."
  });
  var g = R.el("g", null, f.svg);
  var cL = R.curseur(f.reglages, { nom: "Longueur L (m)", min: 0.1, max: 1, pas: 0.05, val: 0.8, dec: 2 });
  var ct = R.curseur(f.reglages, { nom: "Angle θ", min: 5, max: 85, pas: 1, val: 60, unite: "°", dec: 0 });
  var b = R.boutons(f.reglages);
  var inverse = R.bascule(b, "Partir du bout (x ; y)", false, function () { bout = null; dessin(); });
  [cL, ct].forEach(function (c) { c.surChange(function () { bout = null; dessin(); }); });
  var P = R.plan(110, 470, 560), bout = null;
  function dessin() {
    R.vider(g);
    R.grille(g, P, f.svg, { pas: 0.1, fort: 5 });
    var L = cL.v, t = ct.v * R.DEG, x = L * Math.cos(t), y = L * Math.sin(t);
    if (bout) { x = bout[0]; y = bout[1]; L = Math.hypot(x, y); t = Math.atan2(y, x); }
    R.polygone(g, [P.p([0, 0]), P.p([x, 0]), P.p([x, y])], { remplissage: "rgba(59,91,219,.08)" });
    R.ligne(g, P.p([0, 0]), P.p([x, 0]), { couleur: C.x, epaisseur: 8 });
    R.ligne(g, P.p([x, 0]), P.p([x, y]), { couleur: C.y, epaisseur: 8 });
    R.polygone(g, [P.p([x - 0.03, 0]), P.p([x - 0.03, 0.03]), P.p([x, 0.03])], { couleur: C.doux, epaisseur: 2 });
    R.ligne(g, P.p([0, 0]), P.p([x, y]), { couleur: C.fonce, epaisseur: 10 });
    R.el("circle", { cx: P.ox, cy: P.oy, r: 12, fill: C.fonce }, g);
    R.arc(g, P.p([0, 0]), 64, 0, t, { couleur: C.acc, epaisseur: 3 });
    R.texte(g, "θ", R.m.add(P.p([0, 0]), [84 * Math.cos(t / 2), -84 * Math.sin(t / 2)]), { couleur: C.acc, taille: 22 });
    R.texte(g, "adjacent = " + R.fmt(x, 3), R.m.add(P.p([x / 2, 0]), [0, 28]), { couleur: C.x, taille: 19, italique: false, gras: true });
    R.texte(g, "opposé = " + R.fmt(y, 3), R.m.add(P.p([x, y / 2]), [16, 0]), { couleur: C.y, taille: 19, italique: false, gras: true, ancre: "start" });
    R.texte(g, "L = " + R.fmt(L, 3), R.m.add(P.p([x / 2, y / 2]), [-18 * Math.sin(t) - 30, -18 * Math.cos(t) - 6]), { taille: 19, italique: false, gras: true, ancre: "end" });
    if (inverse.checked) {
      R.el("circle", { cx: P.p([0.5, 0.6])[0], cy: P.p([0.5, 0.6])[1], r: 16, fill: "none", stroke: C.v, "stroke-width": 3, "stroke-dasharray": "4 4" }, g);
      R.texte(g, "(0,5 ; 0,6)", R.m.add(P.p([0.5, 0.6]), [0, -30]), { couleur: C.v, taille: 17, italique: false });
      R.poignee(f.svg, g, P.p([x, y]), function (q) {
        var w = P.inv(q); w = [Math.max(0.02, Math.min(1, Math.round(w[0] * 20) / 20)), Math.max(0.02, Math.min(0.8, Math.round(w[1] * 20) / 20))];
        bout = w; dessin();
      }, { couleur: C.acc, r: 11 });
    } else R.el("circle", { cx: P.p([x, y])[0], cy: P.p([x, y])[1], r: 10, fill: C.acc, stroke: "#fff", "stroke-width": 3 }, g);
    R.rendre(f.direct, "\\begin{gathered} x = L\\cos\\theta = " + R.tn(x, 3) + " \\qquad y = L\\sin\\theta = " + R.tn(y, 3) +
      " \\\\ L = \\sqrt{x^2 + y^2} = " + R.tn(L, 3) + " \\quad \\tan\\theta = \\frac{y}{x} = " + R.tn(y / x, 3) + " \\Rightarrow \\theta = " + R.tc(t / R.DEG, 1) + "° \\end{gathered}");
  }
  dessin();
})();
