(function () {
  "use strict";
  var R = RM, C = R.C;

  /* ---------- Figure 1 : essai de traction, éprouvette et courbe ---------- */
  (function () {
    var f = R.figure("fig-traction", {
      largeur: 960, hauteur: 540,
      titre: "Essai de traction : éprouvette et courbe contrainte-déformation",
      essai: "<strong>Essaie</strong> : fais avancer l'allongement, puis appuie sur « Relâcher la charge » avant et après le point A. Coche « Matériau fragile ». " +
        "<strong>Observe</strong> : avant A, l'éprouvette revient à sa longueur ; après A, il reste un allongement permanent. Le fragile casse au bout de sa droite : sa surface (ténacité) est minuscule. Allure du cours, valeurs illustratives (le début de l'axe ε est dilaté)."
    });
    var g = R.el("g", null, f.svg);
    var c = R.curseur(f.reglages, { nom: "Allongement", min: 0, max: 20, pas: 0.1, val: 6, dec: 1 });
    var b = R.boutons(f.reglages);
    var relache = null;
    R.bouton(b, "Relâcher la charge", function () { relache = c.v; dessin(); });
    R.bouton(b, "Recharger", function () { relache = null; dessin(); });
    var fragile = R.bascule(b, "Matériau fragile", false, dessin);
    var aire = R.bascule(b, "Montrer l'aire (ténacité)", false, dessin);
    c.surChange(function () { relache = null; dessin(); });
    var A = [1.5, 880], B = [2.1, 850], Cm = [13, 1000], Dr = [20, 820];
    function sig(e) {
      if (e <= A[0]) return A[1] * e / A[0];
      if (e <= B[0]) return A[1] + (B[1] - A[1]) * (e - A[0]) / (B[0] - A[0]);
      if (e <= Cm[0]) { var u = (Cm[0] - e) / (Cm[0] - B[0]); return B[1] + (Cm[1] - B[1]) * (1 - u * u); }
      var w = (e - Cm[0]) / (Dr[0] - Cm[0]); return Cm[1] - (Cm[1] - Dr[1]) * w * w;
    }
    var O = [440, 470], ux = 23.5, uy = 0.38;
    function P(e, s) { return [O[0] + e * ux, O[1] - s * uy]; }
    function poly(pts, o) { return R.el("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), fill: o.fill || "none", stroke: o.stroke || "none", "stroke-width": o.ep || 0, "stroke-linejoin": "round" }, g); }
    function dessin() {
      R.vider(g);
      var e = c.v, efr = 1.6, casse = fragile.checked && e > efr, s = fragile.checked ? (e <= efr ? 940 * e / efr : 0) : sig(e);
      var eRes = relache !== null && relache > A[0] && !fragile.checked ? relache - sig(relache) * A[0] / A[1] : 0;
      var eAff = relache !== null ? eRes : e;
      // éprouvette verticale, allongement exagéré
      var L = 190 + eAff * 5, x = 190, y0 = 60;
      R.el("rect", { x: x - 60, y: y0, width: 120, height: 40, rx: 8, fill: "#c6cbd8", stroke: C.fonce, "stroke-width": 2 }, g);
      R.el("rect", { x: x - 32, y: y0 + 40, width: 64, height: 50, fill: "#b9c0cc", stroke: C.fonce, "stroke-width": 2 }, g);
      var wPart = 30 - Math.max(0, eAff - 13) * 1.5;
      if (casse || (!fragile.checked && e >= Dr[0] && relache === null)) {
        R.el("rect", { x: x - 15, y: y0 + 90, width: 30, height: L / 2 - 6, fill: "#d5dae3", stroke: C.fonce, "stroke-width": 2 }, g);
        R.el("rect", { x: x - 15, y: y0 + 90 + L / 2 + 10, width: 30, height: L / 2 - 4, fill: "#d5dae3", stroke: C.fonce, "stroke-width": 2 }, g);
        R.texte(g, "rupture", [x + 40, y0 + 90 + L / 2 + 2], { italique: false, couleur: C.x, taille: 18, gras: true, ancre: "start" });
      } else R.el("path", { d: "M" + (x - 15) + " " + (y0 + 90) + " L" + (x + 15) + " " + (y0 + 90) + " Q" + (x + wPart / 2) + " " + (y0 + 90 + L / 2) + " " + (x + 15) + " " + (y0 + 90 + L) + " L" + (x - 15) + " " + (y0 + 90 + L) + " Q" + (x - wPart / 2) + " " + (y0 + 90 + L / 2) + " " + (x - 15) + " " + (y0 + 90) + " Z", fill: "#d5dae3", stroke: C.fonce, "stroke-width": 2 }, g);
      R.el("rect", { x: x - 32, y: y0 + 90 + L, width: 64, height: 50, fill: "#b9c0cc", stroke: C.fonce, "stroke-width": 2 }, g);
      R.el("rect", { x: x - 60, y: y0 + 140 + L, width: 120, height: 40, rx: 8, fill: "#c6cbd8", stroke: C.fonce, "stroke-width": 2 }, g);
      if (relache === null && s > 0) {
        R.fleche(g, [x, y0], [x, y0 - 40], { couleur: C.z, epaisseur: 4 });
        R.texte(g, "F", [x + 22, y0 - 26], { couleur: C.z, gras: true, taille: 22 });
      }
      R.ligne(g, [x - 80, y0 + 90], [x - 80, y0 + 90 + L], { couleur: C.acc, epaisseur: 3 });
      R.texte(g, "l0 + Δl", [x - 92, y0 + 90 + L / 2], { couleur: C.acc, ancre: "end", taille: 19, italique: false });
      // courbe
      R.fleche(g, P(0, 0), P(21.5, 0), { couleur: C.fonce, epaisseur: 2.5 });
      R.fleche(g, P(0, 0), P(0, 1150), { couleur: C.fonce, epaisseur: 2.5 });
      R.texte(g, "σ = F / S0 (MPa)", [O[0] + 14, 22], { italique: false, ancre: "start", taille: 18 });
      R.texte(g, "ε = Δl / l0", P(21.5, -62), { italique: false, taille: 18, ancre: "end" });
      [250, 500, 750, 1000].forEach(function (v) { R.ligne(g, P(0, v), P(-0.4, v), { epaisseur: 2 }); R.texte(g, String(v), [O[0] - 14, P(0, v)[1]], { italique: false, ancre: "end", taille: 15, couleur: C.doux }); });
      var pts = [], k;
      for (k = 0; k <= Dr[0] + 1e-9; k += 0.1) pts.push(P(k, sig(k)));
      if (aire.checked) {
        poly([P(0, 0)].concat(pts, [P(Dr[0], 0)]), { fill: PLATEFORME.teinte(0.16) });
        if (fragile.checked) poly([P(0, 0), P(efr, 940), P(efr, 0)], { fill: "rgba(229,72,77,0.3)" });
      }
      poly(pts, { stroke: fragile.checked ? "#d9c8e6" : C.acc, ep: 5 });
      if (fragile.checked) { R.ligne(g, P(0, 0), P(efr, 940), { couleur: C.x, epaisseur: 5 }); R.texte(g, "×", P(efr, 940), { italique: false, couleur: C.x, taille: 28 }); R.texte(g, "fragile", [P(efr, 940)[0] + 18, P(efr, 940)[1] - 26], { italique: false, couleur: C.x, taille: 17, ancre: "start", gras: true }); }
      R.texte(g, "×", P(Dr[0], Dr[1]), { italique: false, taille: 28 });
      [["A", A, [-18, -20], "Re"], ["C", Cm, [0, -24], "Rmax"], ["D", Dr, [10, -26], "Rr"]].forEach(function (l) {
        var p = P(l[1][0], l[1][1]); R.point(g, p, { r: 6 }); R.texte(g, l[0] + " (" + l[3] + ")", [p[0] + l[2][0], p[1] + l[2][1]], { italique: false, taille: 17, gras: true, ancre: l[0] === "A" ? "start" : "middle" });
      });
      if (relache !== null && !fragile.checked) {
        var pr = P(relache, sig(relache));
        R.ligne(g, pr, P(eRes, 0), { couleur: C.z, epaisseur: 3.5, tirets: "8 6" });
        if (eRes > 0.05) { R.ligne(g, P(0, -35), P(eRes, -35), { couleur: C.v, epaisseur: 4 }); R.texte(g, "déformation permanente", [P(eRes, -35)[0] + 8, P(0, -35)[1] + 1], { italique: false, couleur: C.v, taille: 15, ancre: "start" }); }
      }
      if (!casse) { var pc = P(e, s); R.el("circle", { cx: pc[0], cy: pc[1], r: 9, fill: C.z, stroke: "#fff", "stroke-width": 3 }, g); }
      var zone = fragile.checked ? (casse ? "rompu, presque sans déformation permanente" : "domaine élastique") : e <= A[0] ? "domaine élastique (droite de Hooke)" : e < Dr[0] ? "domaine de déformation permanente" : "rupture";
      f.direct.innerHTML = relache !== null && !fragile.checked
        ? (eRes > 0.05 ? "Charge relâchée après A : il reste un allongement permanent." : "Charge relâchée avant A : l'éprouvette revient à sa longueur initiale.")
        : "σ = <strong>" + R.fmt(casse ? 0 : s, 0) + " MPa</strong> · " + zone + ".";
    }
    dessin();
  })();
})();
