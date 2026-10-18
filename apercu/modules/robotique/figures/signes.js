(function () {
  "use strict";
  var R = RM, C = R.C;

  /* ---------- Quadrants et signes ; M′ (angle −α) et N (angle α + 90°) ---------- */
  var f = R.figure("fig-signes", {
    largeur: 760, hauteur: 580,
    titre: "Signes du cosinus et du sinus, quadrant par quadrant",
    essai: "<strong>Essaie</strong> : fais tourner M dans les quatre quadrants. Coche M′ (angle −α), puis N (angle α + 90°). " +
      "<strong>Observe</strong> : M′ est le reflet de M dans l'axe horizontal, seul le sinus change de signe. N échange les coordonnées de M et en change une de signe : \\((-\\sin\\alpha \\,;\\ \\cos\\alpha)\\)."
  });
  var g = R.el("g", null, f.svg);
  var ca = R.curseur(f.reglages, { nom: "Angle α", min: -180, max: 180, pas: 1, val: 30, unite: "°", dec: 0 });
  var b = R.boutons(f.reglages);
  var vM2 = R.bascule(b, "M′ : angle −α", false, dessin);
  var vN = R.bascule(b, "N : angle α + 90°", false, dessin);
  ca.surChange(dessin);
  var P = R.plan(380, 300, 200);
  var Q = [["1", "+", "+", 1, 1], ["2", "−", "+", -1, 1], ["3", "−", "−", -1, -1], ["4", "+", "−", 1, -1]];
  function dessin() {
    R.vider(g);
    var a = ca.v * R.DEG, c = Math.cos(a), s = Math.sin(a), q = c >= 0 ? (s >= 0 ? 0 : 3) : (s >= 0 ? 1 : 2);
    Q.forEach(function (z, k) {
      var x0 = z[3] > 0 ? P.ox : P.ox - 260, y0 = z[4] > 0 ? P.oy - 260 : P.oy;
      R.el("rect", { x: x0, y: y0, width: 260, height: 260, fill: k === q ? PLATEFORME.teinte(0.12) : "#fff" }, g);
      R.texte(g, "quadrant " + z[0], P.p([z[3] * 1.05, z[4] * 1.22]), { couleur: C.doux, taille: 17, italique: false });
      R.texte(g, "cos " + z[1] + "   sin " + z[2], P.p([z[3] * 1.05, z[4] * 1.1]), { couleur: k === q ? C.fonce : C.gris, taille: 18, italique: false, gras: k === q });
    });
    R.fleche(g, [P.ox - 250, P.oy], [P.ox + 255, P.oy], { couleur: "#c3c8d2", epaisseur: 2.5 });
    R.fleche(g, [P.ox, P.oy + 250], [P.ox, P.oy - 255], { couleur: "#c3c8d2", epaisseur: 2.5 });
    R.el("circle", { cx: P.ox, cy: P.oy, r: P.s, fill: "none", stroke: "#9aa0ad", "stroke-width": 2.5 }, g);
    function point(px, py, nom, coul) {
      R.ligne(g, P.p([px, py]), P.p([px, 0]), { couleur: coul, tirets: "5 5", epaisseur: 2 });
      R.ligne(g, P.p([px, py]), P.p([0, py]), { couleur: coul, tirets: "5 5", epaisseur: 2 });
      R.ligne(g, P.p([0, 0]), P.p([px, py]), { couleur: coul, epaisseur: 4 });
      R.el("circle", { cx: P.p([px, py])[0], cy: P.p([px, py])[1], r: 10, fill: coul, stroke: "#fff", "stroke-width": 3 }, g);
      R.texte(g, nom, R.m.add(P.p([px, py]), [px >= 0 ? 24 : -24, py >= 0 ? -20 : 20]), { couleur: coul, taille: 22, gras: true });
    }
    if (vM2.checked) point(c, -s, "M′", C.v);
    if (vN.checked) point(-s, c, "N", C.z);
    point(c, s, "M", C.acc);
    var t = "M = (" + R.tn(c, 3) + " \\,;\\ " + R.tn(s, 3) + ")";
    if (vM2.checked) t += " \\quad M' = (" + R.tn(c, 3) + " \\,;\\ " + R.tn(-s, 3) + ")";
    if (vN.checked) t += " \\quad N = (" + R.tn(-s, 3) + " \\,;\\ " + R.tn(c, 3) + ")";
    R.rendre(f.direct, t);
  }
  dessin();
})();
