(function () {
  "use strict";
  var R = RM, C = R.C;

  /* ---------- Figure : moteur, arbre et courbe C(n) à puissance fixée ---------- */
  (function () {
    var f = R.figure("fig-arbre", {
      largeur: 960, hauteur: 540,
      titre: "Couple sur l'arbre en fonction de la vitesse, à puissance fixée",
      essai: "<strong>Essaie</strong> : déplace la vitesse n, puis change la puissance P. " +
        "<strong>Observe</strong> : à P fixée, le point glisse sur une courbe ; le rectangle coloré change de forme mais garde la même aire (la puissance). Doubler n divise C par deux ; doubler P double C."
    });
    var g = R.el("g", null, f.svg);
    var cP = R.curseur(f.reglages, { nom: "P [W]", min: 20, max: 200, pas: 10, val: 100, surChange: dessiner });
    var cn = R.curseur(f.reglages, { nom: "n [tr/min]", min: 300, max: 6000, pas: 50, val: 3000, surChange: dessiner });
    var b = R.boutons(f.reglages);
    R.bouton(b, "Exemple du cours", function () { cP.set(100); cn.set(3000); dessiner(); });
    R.bouton(b, "n × 2", function () { cn.set(Math.min(6000, cn.v * 2)); dessiner(); });
    var zone = R.h("div", null, "", f.direct);
    var X0 = 520, X1 = 920, Y0 = 470, Y1 = 70, NMAX = 6000, CMAX = 4;
    function px(n) { return X0 + (X1 - X0) * n / NMAX; }
    function py(c) { return Y0 - (Y0 - Y1) * Math.min(c, CMAX * 1.03) / CMAX; }
    function couple(P, n) { return 60 * P / (2 * Math.PI * n); }
    function dessiner() {
      R.vider(g);
      var P = cP.v, n = cn.v, c = couple(P, n);
      // moteur, arbre, palier
      R.el("rect", { x: 30, y: 180, width: 170, height: 150, rx: 16, fill: "#5b6172", stroke: C.fonce, "stroke-width": 2 }, g);
      for (var k = 0; k < 5; k++) R.el("rect", { x: 48 + k * 30, y: 170, width: 14, height: 170, rx: 4, fill: "#7c8394" }, g);
      R.texte(g, "moteur", [115, 255], { couleur: "#fff", italique: false, gras: true, halo: false, taille: 19 });
      MECA.arbre(g, 200, 470, 255, 14);
      R.el("rect", { x: 380, y: 215, width: 56, height: 110, rx: 6, fill: "#c6cbd8", stroke: C.fonce, "stroke-width": 2 }, g);
      R.texte(g, "palier", [408, 350], { italique: false, couleur: C.doux, taille: 16 });
      var ep = Math.max(2.5, Math.min(12, 2 + 3 * c)), xc = 300, ry = 44;
      R.el("path", { d: "M" + xc + " " + (255 + ry) + " A 15 " + ry + " 0 1 1 " + xc + " " + (255 - ry), fill: "none", stroke: C.acc, "stroke-width": ep, "stroke-linecap": "round" }, g);
      R.el("polygon", { points: [xc, 255 - ry - 11, xc + 20, 255 - ry, xc, 255 - ry + 11].join(","), fill: C.acc }, g);
      R.texte(g, "C", [xc + 36, 255 - ry - 6], { couleur: C.acc, gras: true, taille: 24 });
      R.texte(g, "n = " + Math.round(n) + " tr/min", [115, 380], { italique: false, taille: 18 });
      // courbe C(n)
      R.ligne(g, [X0, Y0], [X1 + 10, Y0], { couleur: C.gris, epaisseur: 2 }); R.ligne(g, [X0, Y0], [X0, Y1 - 10], { couleur: C.gris, epaisseur: 2 });
      [0, 1, 2, 3, 4].forEach(function (v) { R.texte(g, String(v), [X0 - 14, py(v)], { italique: false, couleur: C.doux, taille: 15, ancre: "end" }); });
      [0, 2000, 4000, 6000].forEach(function (v) { R.texte(g, String(v), [px(v), Y0 + 20], { italique: false, couleur: C.doux, taille: 15 }); });
      R.texte(g, "C [N·m]", [X0 + 8, Y1 - 24], { italique: false, couleur: C.doux, taille: 16, ancre: "start" });
      R.texte(g, "n [tr/min]", [X1 + 6, Y0 + 44], { italique: false, couleur: C.doux, taille: 16, ancre: "end" });
      var q = [px(n), py(c)];
      R.el("rect", { x: X0, y: q[1], width: q[0] - X0, height: Y0 - q[1], fill: PLATEFORME.teinte(0.16) }, g);
      var l = [], n0 = Math.max(200, 60 * P / (2 * Math.PI * CMAX));
      for (var m = n0; m <= NMAX; m += 40) l.push(px(m).toFixed(1) + "," + py(couple(P, m)).toFixed(1));
      R.el("polyline", { points: l.join(" "), fill: "none", stroke: C.z, "stroke-width": 3.5 }, g);
      R.ligne(g, [q[0], Y0], q, { couleur: C.acc, tirets: "5 4", epaisseur: 2 }); R.ligne(g, [X0, q[1]], q, { couleur: C.acc, tirets: "5 4", epaisseur: 2 });
      R.point(g, q, { couleur: C.acc, r: 8, contour: "#fff" });
      R.texte(g, "P = " + P + " W", [X1, Y1 + 6], { italique: false, couleur: C.z, gras: true, taille: 17, ancre: "end" });
      R.rendre(zone, "\\omega = \\frac{2\\pi \\times " + Math.round(n) + "}{60} = " + R.tn(2 * Math.PI * n / 60, 1) + "\\ \\text{rad/s} \\qquad C = \\frac{60 \\times " + P + "}{2\\pi \\times " + Math.round(n) + "} = " + R.tn(c, 3) + "\\ \\text{N}\\cdot\\text{m}");
    }
    dessiner();
  })();
})();
