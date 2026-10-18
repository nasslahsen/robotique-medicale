(function () {
  "use strict";
  var R = RM, C = R.C;

  /* ---------- Figure 1 : arbre tordu, section et contrainte tangentielle ---------- */
  (function () {
    var f = R.figure("fig-torsion", {
      largeur: 960, hauteur: 540,
      titre: "Arbre encastré à gauche, tordu à droite par le moment Mt",
      essai: "<strong>Essaie</strong> : augmente le moment de torsion, puis affiche la contrainte. " +
        "<strong>Observe</strong> : les lignes longitudinales deviennent des hélices, les cercles restent circulaires et les rayons de la section restent droits. La contrainte tangentielle est nulle sur l'axe et maximale à la surface."
    });
    var g = R.el("g", null, f.svg);
    var cM = R.curseur(f.reglages, { nom: "Mt", min: 0, max: 1, pas: 0.05, val: 0.6, surChange: dessiner });
    var bt = R.bascule(f.reglages, "Afficher la contrainte τ", true, dessiner);
    var X0 = 110, X1 = 560, YC = 250, RA = 90, SC = [765, 250], RS = 115;
    function dessiner() {
      R.vider(g);
      var tw = cM.v * 1.6;
      R.el("rect", { x: X0 - 46, y: YC - RA - 50, width: 46, height: 2 * RA + 100, fill: MECA.hachures(g, "#5b6172", { fond: "#fff" }), stroke: C.fonce, "stroke-width": 2 }, g);
      R.el("rect", { x: X0, y: YC - RA, width: X1 - X0, height: 2 * RA, fill: "#e8edf5", stroke: C.fonce, "stroke-width": 2.5 }, g);
      R.el("ellipse", { cx: X1, cy: YC, rx: 22, ry: RA, fill: "#dfe3ea", stroke: C.fonce, "stroke-width": 2.5 }, g);
      for (var k = 0; k < 12; k++) {
        var l = [], phi0 = k * Math.PI / 6;
        for (var i = 0; i <= 40; i++) {
          var x = X0 + (X1 - X0) * i / 40, phi = phi0 + tw * i / 40;
          if (Math.sin(phi) < -0.02) { if (l.length > 1) R.el("polyline", { points: l.join(" "), fill: "none", stroke: C.z, "stroke-width": 2.5 }, g); l = []; continue; }
          l.push(x.toFixed(1) + "," + (YC - RA * Math.cos(phi)).toFixed(1));
        }
        if (l.length > 1) R.el("polyline", { points: l.join(" "), fill: "none", stroke: C.z, "stroke-width": 2.5 }, g);
      }
      for (var c = 1; c < 6; c++) R.el("ellipse", { cx: X0 + (X1 - X0) * c / 6, cy: YC, rx: 16, ry: RA, fill: "none", stroke: C.fonce, "stroke-width": 1.6 }, g);
      if (cM.v > 0.04) {
        var ep = 3 + 6 * cM.v;
        R.el("path", { d: "M" + (X1 + 40) + " " + (YC + RA + 12) + " A 32 " + (RA + 16) + " 0 1 1 " + (X1 + 40) + " " + (YC - RA - 12), fill: "none", stroke: C.acc, "stroke-width": ep, "stroke-linecap": "round" }, g);
        R.el("polygon", { points: [X1 + 36, YC - RA - 26, X1 + 60, YC - RA - 12, X1 + 36, YC - RA + 2].join(","), fill: C.acc }, g);
        R.texte(g, "Mt", [X1 + 82, YC - RA - 30], { couleur: C.acc, gras: true, taille: 22 });
      }
      R.texte(g, "lignes longitudinales : se tordent", [335, YC + RA + 50], { italique: false, couleur: C.z, taille: 17 });
      R.texte(g, "cercles : restent circulaires", [335, YC + RA + 78], { italique: false, couleur: C.fonce, taille: 17 });
      // section
      R.texte(g, "section", [SC[0], SC[1] - RS - 26], { italique: false, couleur: C.doux, taille: 17 });
      R.el("circle", { cx: SC[0], cy: SC[1], r: RS, fill: "#f3f5fa", stroke: C.fonce, "stroke-width": 2.5 }, g);
      for (var r2 = 0; r2 < 8; r2++) { var a = r2 * Math.PI / 4 + cM.v * 0.3; R.ligne(g, SC, [SC[0] + RS * Math.cos(a), SC[1] - RS * Math.sin(a)], { couleur: "#9aa0ad", epaisseur: 2 }); }
      if (bt.checked && cM.v > 0.04) {
        [1, -1].forEach(function (sg) {
          var h = 80 * cM.v + 10, bout = [SC[0] + sg * RS, SC[1] - sg * h];
          R.polygone(g, [SC, [SC[0] + sg * RS, SC[1]], bout], { remplissage: PLATEFORME.teinte(0.14) });
          R.ligne(g, SC, bout, { couleur: C.acc, tirets: "6 4", epaisseur: 2 });
          [0.25, 0.5, 0.75, 1].forEach(function (fr) { var p = [SC[0] + sg * RS * fr, SC[1]]; R.fleche(g, p, [p[0], p[1] - sg * h * fr], { couleur: C.acc, epaisseur: 3, tete: 12 }); });
        });
        R.texte(g, "τmax", [SC[0] + RS + 8, SC[1] - 80 * cM.v - 34], { couleur: C.acc, gras: true, taille: 20 });
        R.texte(g, "τ = 0 sur l'axe", [SC[0], SC[1] + RS + 30], { italique: false, couleur: C.doux, taille: 16 });
      }
      R.point(g, SC, { r: 5 });
    }
    dessiner();
  })();

  /* ---------- Figure 2 : diamètre minimal en fonction du moment ---------- */
  (function () {
    var f = R.figure("fig-diametre", {
      largeur: 960, hauteur: 460,
      titre: "Diamètre minimal d'un arbre plein en fonction du moment de torsion",
      essai: "<strong>Essaie</strong> : règle le moment de torsion et la résistance du matériau. " +
        "<strong>Observe</strong> : la courbe monte de moins en moins vite (racine cubique) ; un matériau plus résistant abaisse toute la courbe. La section dessinée à droite est à l'échelle du diamètre minimal."
    });
    var g = R.el("g", null, f.svg);
    var cM = R.curseur(f.reglages, { nom: "Mt [N·m]", min: 1, max: 100, pas: 1, val: 20, surChange: dessiner });
    var cR = R.curseur(f.reglages, { nom: "R_pg [N/mm²]", min: 20, max: 120, pas: 5, val: 40, surChange: dessiner });
    var zone = R.h("div", null, "", f.direct);
    var X0 = 80, X1 = 620, Y0 = 400, Y1 = 50, DMAX = 30;
    function dmin(Mt, Rpg) { return Math.cbrt(16 * Mt * 1000 / (Math.PI * Rpg)); }
    function dessiner() {
      R.vider(g);
      var px = function (m) { return X0 + (X1 - X0) * m / 100; }, py = function (d) { return Y0 - (Y0 - Y1) * d / DMAX; };
      R.ligne(g, [X0, Y0], [X1 + 10, Y0], { couleur: C.gris, epaisseur: 2 }); R.ligne(g, [X0, Y0], [X0, Y1 - 10], { couleur: C.gris, epaisseur: 2 });
      [0, 10, 20, 30].forEach(function (v) { R.texte(g, String(v), [X0 - 12, py(v)], { italique: false, couleur: C.doux, taille: 15, ancre: "end" }); });
      [0, 25, 50, 75, 100].forEach(function (v) { R.texte(g, String(v), [px(v), Y0 + 20], { italique: false, couleur: C.doux, taille: 15 }); });
      R.texte(g, "d min [mm]", [X0 + 8, Y1 - 24], { italique: false, couleur: C.doux, taille: 16, ancre: "start" });
      R.texte(g, "Mt [N·m]", [X1 + 6, Y0 + 44], { italique: false, couleur: C.doux, taille: 16, ancre: "end" });
      var l = []; for (var m = 0; m <= 100; m += 1) l.push(px(m).toFixed(1) + "," + py(dmin(m, cR.v)).toFixed(1));
      R.el("polyline", { points: l.join(" "), fill: "none", stroke: C.z, "stroke-width": 3.5 }, g);
      R.el("polygon", { points: l.join(" ") + " " + px(100) + "," + py(0) + " " + px(0) + "," + py(0), fill: "rgba(229,72,77,0.06)" }, g);
      R.texte(g, "zone interdite : arbre trop fin", [px(70), py(4)], { italique: false, couleur: C.x, taille: 15 });
      var d = dmin(cM.v, cR.v), q = [px(cM.v), py(d)];
      R.ligne(g, [q[0], Y0], q, { couleur: C.acc, tirets: "5 4", epaisseur: 2 }); R.ligne(g, [X0, q[1]], q, { couleur: C.acc, tirets: "5 4", epaisseur: 2 });
      R.point(g, q, { couleur: C.acc, r: 8, contour: "#fff" });
      // section à l'échelle : 1 mm = 5 px
      var S = [800, 225];
      R.el("circle", { cx: S[0], cy: S[1], r: d * 5 / 2, fill: MECA.hachures(g, "#5b6172", { fond: "#fff" }), stroke: C.fonce, "stroke-width": 2.5 }, g);
      R.texte(g, "section à l'échelle", [S[0], 380], { italique: false, couleur: C.doux, taille: 16 });
      R.texte(g, "d = " + R.fmt(d, 1) + " mm", [S[0], 410], { italique: false, gras: true, taille: 18 });
      R.rendre(zone, "d > \\sqrt[3]{\\frac{16 \\times " + Math.round(cM.v * 1000) + "}{\\pi \\times " + cR.v + "}} = " + R.tn(d, 2) + "\\ \\text{mm} \\qquad (M_t \\text{ en N}\\cdot\\text{mm})");
    }
    dessiner();
  })();
})();
