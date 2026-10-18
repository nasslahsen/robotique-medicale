(function () {
  "use strict";
  var R = RM, C = R.C;

  /* ---------- Le cercle de rayon 1 : M = (cos θ ; sin θ), puis x = r cos θ, y = r sin θ ---------- */
  var f = R.figure("fig-cercle", {
    largeur: 760, hauteur: 580,
    titre: "Point M sur le cercle : cosinus et sinus comme ombres sur les axes",
    essai: "<strong>Essaie</strong> : fais glisser M, ou règle θ. Mets θ = 60°, puis 90°, puis 180°. Change ensuite la longueur r du bras. " +
      "<strong>Observe</strong> : la barre rouge (ombre sur l'axe horizontal) est \\(\\cos\\theta\\), la verte est \\(\\sin\\theta\\). Leur somme des carrés reste 1. Avec un bras de longueur r, tout est multiplié par r."
  });
  var g = R.el("g", null, f.svg);
  var ct = R.curseur(f.reglages, { nom: "Angle θ", min: -180, max: 180, pas: 1, val: 30, unite: "°", dec: 0 });
  var cr = R.curseur(f.reglages, { nom: "Longueur du bras r", min: 0.5, max: 2, pas: 0.5, val: 1, dec: 1 });
  [ct, cr].forEach(function (c) { c.surChange(dessin); });
  function dessin() {
    R.vider(g);
    var P = R.plan(380, 290, 230 / Math.max(1, cr.v));
    R.grille(g, P, f.svg, { pas: 0.5, fort: 2 });
    var t = ct.v * R.DEG, r = cr.v, c = Math.cos(t), s = Math.sin(t);
    R.el("circle", { cx: P.ox, cy: P.oy, r: P.s, fill: "none", stroke: "#9aa0ad", "stroke-width": 2.5 }, g);
    if (r !== 1) R.el("circle", { cx: P.ox, cy: P.oy, r: P.s * r, fill: "none", stroke: C.v, "stroke-width": 2, "stroke-dasharray": "6 6" }, g);
    // triangle et ombres
    R.polygone(g, [P.p([0, 0]), P.p([c, 0]), P.p([c, s])], { remplissage: "rgba(59,91,219,.10)" });
    R.ligne(g, P.p([c, s]), P.p([c, 0]), { couleur: C.gris, tirets: "5 5", epaisseur: 2 });
    R.ligne(g, P.p([c, s]), P.p([0, s]), { couleur: C.gris, tirets: "5 5", epaisseur: 2 });
    R.ligne(g, P.p([0, 0]), P.p([c, 0]), { couleur: C.x, epaisseur: 9 });
    R.ligne(g, P.p([0, 0]), P.p([0, s]), { couleur: C.y, epaisseur: 9 });
    R.texte(g, "cos θ", R.m.add(P.p([c / 2, 0]), [0, s >= 0 ? 24 : -24]), { couleur: C.x, taille: 20, italique: false, gras: true });
    R.texte(g, "sin θ", R.m.add(P.p([0, s / 2]), [c >= 0 ? -46 : 46, 0]), { couleur: C.y, taille: 20, italique: false, gras: true });
    R.arc(g, P.p([0, 0]), 40, 0, t, { couleur: C.acc, epaisseur: 3 });
    R.texte(g, "θ", R.m.add(P.p([0, 0]), [58 * Math.cos(t / 2), -58 * Math.sin(t / 2)]), { couleur: C.acc, taille: 21 });
    R.ligne(g, P.p([0, 0]), P.p([c, s]), { couleur: C.fonce, epaisseur: 4 });
    if (r !== 1) {
      R.ligne(g, P.p([c, s]), P.p([r * c, r * s]), { couleur: C.v, epaisseur: 5 });
      R.point(g, P.p([r * c, r * s]), { r: 8, couleur: C.v });
      R.texte(g, "bout du bras", R.m.add(P.p([r * c, r * s]), [0, -22]), { couleur: C.v, taille: 17, italique: false });
    }
    R.texte(g, "1", P.p([1.1, -0.12]), { couleur: C.doux, taille: 17, italique: false });
    R.poignee(f.svg, g, P.p([c, s]), function (q) {
      var w = P.inv(q); ct.set(Math.round(Math.atan2(w[1], w[0]) / R.DEG)); dessin();
    }, { couleur: C.acc, r: 11 });
    R.texte(g, "M", R.m.add(P.p([c, s]), [c >= 0 ? 22 : -22, s >= 0 ? -20 : 20]), { taille: 22, gras: true });
    R.rendre(f.direct, "M = (\\cos\\theta \\,;\\ \\sin\\theta) = (" + R.tn(c, 3) + " \\,;\\ " + R.tn(s, 3) + ") \\qquad \\cos^2\\theta + \\sin^2\\theta = 1" +
      (r !== 1 ? " \\qquad (r\\cos\\theta \\,;\\ r\\sin\\theta) = (" + R.tn(r * c, 3) + " \\,;\\ " + R.tn(r * s, 3) + ")" : ""));
  }
  dessin();
})();
