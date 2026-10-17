(function () {
  "use strict";
  var R = RM, C = R.C;

  /* ---------- Figure 1 : angle de contact ---------- */
  (function () {
    var f = R.figure("fig-angle", {
      largeur: 960, hauteur: 540,
      titre: "Angle de contact α et groupe du roulement",
      essai: "<strong>Essaie</strong> : fais tourner la ligne de contact de 0° à 90°. " +
        "<strong>Observe</strong> : à 0°, les bagues sont l'une au-dessus de l'autre, l'effort passe en travers de l'axe ; à 90°, elles sont côte à côte, l'effort passe le long de l'axe. La frontière est à 45°."
    });
    var g = R.el("g", null, f.svg);
    var cA = R.curseur(f.reglages, { nom: "α", min: 0, max: 90, pas: 1, val: 20, unite: "°", surChange: dessiner });
    var b = R.boutons(f.reglages);
    [0, 30, 45, 60, 90].forEach(function (a) { R.bouton(b, a + "°", function () { cA.set(a); dessiner(); }); });
    var zone = R.h("div", null, "", f.direct);
    function dessiner() {
      R.vider(g);
      var al = cA.v, a = al * Math.PI / 180, c = [360, 270], r = 70, H = MECA.hachures(g, "#5b6172", { fond: "#fff" });
      MECA.traitAxe(g, [60, 510], [660, 510]);
      R.texte(g, "axe du roulement", [70, 490], { italique: false, ancre: "start", couleur: C.doux, taille: 16 });
      [1, -1].forEach(function (s) {
        var gg = R.el("g", { transform: "rotate(" + (-al) + " " + c[0] + " " + c[1] + ")" }, g);
        R.el("rect", { x: c[0] - 120, y: s > 0 ? c[1] - r - 60 : c[1] + r, width: 240, height: 60, fill: H, stroke: C.fonce, "stroke-width": 2.5 }, gg);
      });
      R.el("circle", { cx: c[0], cy: c[1], r: r, fill: "#cfd5df", stroke: C.fonce, "stroke-width": 2.5 }, g);
      var u = [Math.sin(a), -Math.cos(a)];
      R.ligne(g, [c[0] + u[0] * 210, c[1] + u[1] * 210], [c[0] - u[0] * 210, c[1] - u[1] * 210], { couleur: C.v, epaisseur: 3, tirets: "10 6" });
      R.ligne(g, [c[0], c[1] - 230], [c[0], c[1] + 220], { couleur: C.gris, epaisseur: 2, tirets: "4 6" });
      if (al > 0.5) R.arc(g, c, 170, Math.PI / 2 - a, Math.PI / 2, { couleur: C.acc, epaisseur: 4 });
      R.texte(g, "α", [c[0] + 190 * Math.sin(a / 2) + 8, c[1] - 190 * Math.cos(a / 2)], { couleur: C.acc, taille: 26 });
      R.texte(g, "direction radiale", [c[0] + 10, 28], { italique: false, ancre: "start", couleur: C.doux, taille: 15 });
      R.texte(g, "ligne de contact", [c[0] + u[0] * 215 + 10, c[1] + u[1] * 215 + 12], { italique: false, ancre: "start", couleur: C.v, taille: 16 });
      var radial = al <= 45;
      // jauge du groupe
      R.el("rect", { x: 720, y: 140, width: 200, height: 260, rx: 18, fill: radial ? "#e8edff" : "#f3e8ff", stroke: radial ? C.z : C.v, "stroke-width": 3 }, g);
      R.texte(g, radial ? "radial" : "butée", [820, 240], { italique: false, gras: true, couleur: radial ? C.z : C.v, taille: 32 });
      R.texte(g, "α = " + al + "°", [820, 300], { italique: false, couleur: C.fonce, taille: 24 });
      R.rendre(zone, "\\alpha = " + al + "° \\ " + (radial ? "\\le" : ">") + " \\ 45° \\ \\Rightarrow \\ \\text{" + (radial ? "roulement radial" : "butée") + "}");
    }
    dessiner();
  })();

  /* ---------- Figure 2 : qui reprend quoi dans le montage ---------- */
  (function () {
    var f = R.figure("fig-montage", {
      largeur: 960, hauteur: 520,
      titre: "Un arbre, deux roulements radiaux",
      essai: "<strong>Essaie</strong> : règle la charge radiale et la charge axiale. " +
        "<strong>Observe</strong> : la charge radiale (au milieu) se partage entre les deux roulements ; toute la charge axiale passe par le roulement rigide à billes, le roulement à rouleaux cylindriques n'en prend aucune."
    });
    var g = R.el("g", null, f.svg);
    var cR = R.curseur(f.reglages, { nom: "Charge radiale", min: 0, max: 1000, pas: 50, val: 600, unite: " N", surChange: dessiner });
    var cX = R.curseur(f.reglages, { nom: "Charge axiale", min: 0, max: 600, pas: 50, val: 300, unite: " N", surChange: dessiner });
    var zone = R.h("div", null, "", f.direct);
    function dessiner() {
      R.vider(g);
      var Fr = cR.v, Fa = cX.v, yc = 260, r = 46, h = 90, l = 96, xs = [260, 700], H = MECA.hachures(g, "#9aa0ad", { fond: "#fff" });
      xs.forEach(function (x) { [-1, 1].forEach(function (s) { R.el("rect", { x: x - 90, y: s < 0 ? yc - r - h - 40 : yc + r + h, width: 180, height: 40, fill: H, stroke: C.fonce, "stroke-width": 2 }, g); }); });
      MECA.arbre(g, 120, 860, yc, r);
      xs.forEach(function (x, i) { [1, -1].forEach(function (s) { MECA.roulement(g, x, yc - s * r, l, h, { type: i === 0 ? "rouleaux" : "billes", sens: s }); }); });
      if (Fr > 0) { R.fleche(g, [480, yc - r - 30 - Fr * 0.12], [480, yc - r - 4], { couleur: C.x, epaisseur: 6, tete: 20 }); R.texte(g, "charge radiale", [496, yc - r - 30], { italique: false, ancre: "start", couleur: C.x, taille: 17 }); }
      if (Fa > 0) { R.fleche(g, [40, yc], [116, yc], { couleur: C.x, epaisseur: 3 + Fa * 0.012, tete: 18 }); R.texte(g, "charge axiale", [40, yc + 72], { italique: false, ancre: "start", couleur: C.x, taille: 17 }); }
      // réactions : radiale partagée, axiale sur le roulement à billes
      xs.forEach(function (x, i) {
        var y = 470;
        R.texte(g, i === 0 ? "rouleaux cylindriques" : "rigide à billes", [x, y], { italique: false, gras: true, taille: 18 });
        R.texte(g, "radiale " + Math.round(Fr / 2) + " N · axiale " + (i === 0 ? 0 : Fa) + " N", [x, y + 28], { italique: false, couleur: i === 0 || Fa === 0 ? C.doux : C.acc, taille: 17 });
      });
      R.rendre(zone, "\\text{rouleaux : } F_r = " + Math.round(Fr / 2) + "\\ \\text{N},\\ F_a = 0 \\qquad \\text{billes : } F_r = " + Math.round(Fr / 2) + "\\ \\text{N},\\ F_a = " + Fa + "\\ \\text{N}");
    }
    dessiner();
  })();

  /* ---------- Figure 3 : butée pour charge axiale, butée pour charge combinée ---------- */
  (function () {
    var f = R.figure("fig-butees", {
      largeur: 960, hauteur: 460,
      titre: "Deux butées en demi-coupe",
      essai: "<strong>Essaie</strong> : touche « Ajouter une charge radiale ». " +
        "<strong>Observe</strong> : la butée à billes, aux rondelles perpendiculaires à l'axe, ne peut rien reprendre en travers ; la butée à contact incliné reprend une charge combinée."
    });
    var g = R.el("g", null, f.svg), radiale = false;
    var b = R.boutons(f.reglages);
    var bt = R.bouton(b, "Ajouter une charge radiale", function () { radiale = !radiale; bt.textContent = radiale ? "Enlever la charge radiale" : "Ajouter une charge radiale"; dessiner(); });
    function dessiner() {
      R.vider(g);
      var H = MECA.hachures(g, "#5b6172", { fond: "#fff" });
      [[240, 0, "butée pour charge purement axiale"], [720, 35, "butée pour charge combinée"]].forEach(function (p) {
        var cy = 200, yb = 360;
        MECA.traitAxe(g, [p[0] - 200, yb + 30], [p[0] + 200, yb + 30]);
        R.el("rect", { x: p[0] - 200, y: yb, width: 400, height: 30, fill: "#e8edf5", stroke: C.fonce, "stroke-width": 2 }, g);
        var gg = R.el("g", { transform: p[1] ? "rotate(-" + p[1] + " " + p[0] + " " + cy + ")" : null }, g);
        R.el("rect", { x: p[0] - 104, y: cy - 110, width: 40, height: 200, fill: H, stroke: C.fonce, "stroke-width": 2.5 }, gg);
        R.el("rect", { x: p[0] + 64, y: cy - 90, width: 40, height: 200, fill: H, stroke: C.fonce, "stroke-width": 2.5 }, gg);
        if (!p[1]) R.el("circle", { cx: p[0], cy: cy, r: 63, fill: "#cfd5df", stroke: C.fonce, "stroke-width": 2.5 }, gg);
        else R.el("rect", { x: p[0] - 63, y: cy - 66, width: 126, height: 132, rx: 8, fill: "#cfd5df", stroke: C.fonce, "stroke-width": 2.5 }, gg);
        R.fleche(g, [p[0] - 200, cy + 50], [p[0] - 112, cy + 50], { couleur: C.x, epaisseur: 6, tete: 20 });
        if (radiale) {
          R.fleche(g, [p[0], 20], [p[0], cy - 90], { couleur: C.x, epaisseur: 6, tete: 20 });
          R.texte(g, p[1] ? "reprise" : "non reprise", [p[0] + 16, 40], { italique: false, ancre: "start", gras: true, couleur: p[1] ? C.y : C.x, taille: 19 });
        }
        R.texte(g, p[2], [p[0], 430], { italique: false, taille: 18 });
      });
    }
    dessiner();
  })();
})();
