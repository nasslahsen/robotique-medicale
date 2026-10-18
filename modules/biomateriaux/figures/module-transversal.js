(function () {
  "use strict";
  var R = RM, C = R.C;
  function ressort(g, x0, x1, y, h, coul, ep, n) {
    var pts = [[x0, y], [x0 + 14, y]];
    for (var i = 0; i < n * 2; i++) pts.push([x0 + 14 + (x1 - x0 - 28) * (i + 0.5) / (n * 2), y + (i % 2 ? h : -h)]);
    pts.push([x1 - 14, y], [x1, y]);
    R.el("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: coul, "stroke-width": ep, "stroke-linejoin": "round", "stroke-linecap": "round" }, g);
  }

  /* ---------- Figure 1 : deux ressorts en série ---------- */
  (function () {
    var f = R.figure("fig-serie", {
      largeur: 960, hauteur: 300,
      titre: "Charge perpendiculaire aux fibres : deux ressorts en série",
      essai: "<strong>Essaie</strong> : augmente la contrainte appliquée, puis change φf. " +
        "<strong>Observe</strong> : la même contrainte traverse les deux ressorts ; la matrice fait presque tout l'allongement. Valeurs de départ : exemple du cours (Ef = 70 GPa, Em = 3 GPa)."
    });
    var g = R.el("g", null, f.svg);
    var cs = R.curseur(f.reglages, { nom: "σCT (MPa)", min: 0, max: 60, pas: 1, val: 30 });
    var cp = R.curseur(f.reglages, { nom: "φf", min: 0.05, max: 0.95, pas: 0.01, val: 0.4, dec: 2 });
    [cs, cp].forEach(function (c) { c.surChange(dessin); });
    var Ef = 70000, Em = 3000;
    function dessin() {
      R.vider(g);
      var s = cs.v, phi = cp.v, ef = s / Ef, em = s / Em, y = 130, x0 = 70, k = 12000;
      var lf = 480 * phi, lm = 480 * (1 - phi), xf = x0 + lf + ef * phi * k, xm = xf + 18 + lm + em * (1 - phi) * k;
      R.el("rect", { x: x0 - 30, y: y - 70, width: 30, height: 140, fill: "#c6cbd8", stroke: C.fonce, "stroke-width": 2 }, g);
      ressort(g, x0, xf, y, 34, C.acc, 9, Math.max(2, Math.round(6 * phi + 1)));
      R.el("rect", { x: xf, y: y - 45, width: 18, height: 90, rx: 4, fill: "#b9c0cc", stroke: C.fonce, "stroke-width": 2 }, g);
      ressort(g, xf + 18, xm, y, 34, C.gris, 4, Math.max(2, Math.round(6 * (1 - phi) + 1)));
      R.el("rect", { x: xm, y: y - 60, width: 22, height: 120, rx: 4, fill: "#b9c0cc", stroke: C.fonce, "stroke-width": 2 }, g);
      if (s > 0) R.fleche(g, [xm + 26, y], [xm + 90, y], { couleur: C.z, epaisseur: 5 });
      R.texte(g, "fibre", [(x0 + xf) / 2, y - 62], { italique: false, taille: 17, gras: true, couleur: C.acc });
      R.texte(g, "matrice", [(xf + 18 + xm) / 2, y - 62], { italique: false, taille: 17, gras: true, couleur: C.doux });
      var dF = ef * phi, dM = em * (1 - phi), tot = dF + dM;
      R.texte(g, "allongement dû à la fibre : " + (tot ? Math.round(100 * dF / tot) : 0) + " %", [x0, 240], { italique: false, taille: 16, ancre: "start", couleur: C.acc });
      R.texte(g, "allongement dû à la matrice : " + (tot ? Math.round(100 * dM / tot) : 0) + " %", [x0, 268], { italique: false, taille: 16, ancre: "start", couleur: C.doux });
      var E = BIO.moduleTransversal(70, 3, phi);
      f.direct.innerHTML = "εCT = εf φf + εm φm = " + R.fmt(tot * 100, 3) + " % ; ECT = σCT / εCT = <strong>" + R.fmt(E, 2) + " GPa</strong>";
    }
    dessin();
  })();

  /* ---------- Figure 2 : ECL et ECT en fonction du taux de fibres ---------- */
  (function () {
    var f = R.figure("fig-courbes", {
      largeur: 960, hauteur: 480,
      titre: "Influence du taux de fibre sur ECL et ECT",
      essai: "<strong>Essaie</strong> : déplace φf, puis augmente Ef. " +
        "<strong>Observe</strong> : ECL est une droite, ECT reste collé près de Em jusqu'à des taux de fibres très élevés ; l'écart grandit avec Ef. Courbe du cours."
    });
    var g = R.el("g", null, f.svg);
    var cp = R.curseur(f.reglages, { nom: "φf", min: 0, max: 1, pas: 0.01, val: 0.4, dec: 2 });
    var cf = R.curseur(f.reglages, { nom: "Ef (GPa)", min: 10, max: 250, pas: 1, val: 70 });
    var cm = R.curseur(f.reglages, { nom: "Em (GPa)", min: 1, max: 10, pas: 0.1, val: 3, dec: 1 });
    [cp, cf, cm].forEach(function (c) { c.surChange(dessin); });
    function dessin() {
      R.vider(g);
      var Ef = cf.v, Em = cm.v, phi = cp.v, O = [110, 430], W = 760, H = 380, P = function (p, e) { return [O[0] + p * W, O[1] - e / Ef * H]; };
      R.fleche(g, O, [O[0] + W + 30, O[1]], { epaisseur: 2.5 }); R.fleche(g, O, [O[0], O[1] - H - 30], { epaisseur: 2.5 });
      R.texte(g, "φf", [O[0] + W + 30, O[1] + 24], { taille: 18 });
      R.texte(g, "0", [O[0], O[1] + 22], { italique: false, taille: 15 }); R.texte(g, "1", [O[0] + W, O[1] + 22], { italique: false, taille: 15 });
      R.texte(g, "Em", [O[0] - 12, P(0, Em)[1]], { taille: 16, ancre: "end" }); R.texte(g, "Ef", [O[0] - 12, P(0, Ef)[1]], { taille: 16, ancre: "end" });
      R.ligne(g, P(0, Ef), P(1, Ef), { couleur: "#d9dde6", tirets: "5 5" }); R.ligne(g, P(0, Em), P(1, Em), { couleur: "#d9dde6", tirets: "5 5" });
      var a = [], b = [];
      for (var p = 0; p <= 1.0001; p += 0.01) { a.push(P(p, BIO.moduleLongitudinal(Ef, Em, p))); b.push(P(p, BIO.moduleTransversal(Ef, Em, Math.min(p, 1)))); }
      R.el("polyline", { points: a.map(function (q) { return q.join(","); }).join(" "), fill: "none", stroke: C.fonce, "stroke-width": 4 }, g);
      R.el("polyline", { points: b.map(function (q) { return q.join(","); }).join(" "), fill: "none", stroke: C.acc, "stroke-width": 5 }, g);
      var EL = BIO.moduleLongitudinal(Ef, Em, phi), ET = BIO.moduleTransversal(Ef, Em, phi);
      R.texte(g, "ECL", P(0.45, BIO.moduleLongitudinal(Ef, Em, 0.45) + Ef * 0.06), { taille: 20, gras: true });
      R.texte(g, "ECT", P(0.8, BIO.moduleTransversal(Ef, Em, 0.8) + Ef * 0.05), { taille: 20, gras: true, couleur: C.acc, ancre: "end" });
      R.ligne(g, P(phi, 0), P(phi, EL), { couleur: C.z, tirets: "4 4" });
      R.el("circle", { cx: P(phi, EL)[0], cy: P(phi, EL)[1], r: 8, fill: C.fonce, stroke: "#fff", "stroke-width": 2.5 }, g);
      R.el("circle", { cx: P(phi, ET)[0], cy: P(phi, ET)[1], r: 8, fill: C.acc, stroke: "#fff", "stroke-width": 2.5 }, g);
      f.direct.innerHTML = "φf = " + R.fmt(phi, 2) + " : ECL = <strong>" + R.fmt(EL, 1) + " GPa</strong>, ECT = <strong>" + R.fmt(ET, 2) + " GPa</strong> (Em / φm = " + (phi < 1 ? R.fmt(Em / (1 - phi), 2) : "∞") + " GPa).";
    }
    dessin();
  })();
})();
