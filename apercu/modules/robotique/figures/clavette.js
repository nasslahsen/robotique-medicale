(function () {
  "use strict";
  var R = RM, C = R.C, M = MECA, GR = "#5b6172";
  function txt(g, t, p, o) { o = o || {}; R.texte(g, t, p, { italique: false, taille: o.taille || 18, couleur: o.couleur || C.doux, ancre: o.ancre || "middle", gras: o.gras }); }

  /* ---------- Figure 1 : effort et contrainte dans la clavette ---------- */
  (function () {
    var f = R.figure("fig-clavette", {
      largeur: 960, hauteur: 520,
      titre: "Clavette : du couple à la contrainte de cisaillement",
      essai: "<strong>Essaie</strong> : augmente le couple, puis le diamètre de l'arbre, puis la longueur de la clavette. " +
        "<strong>Observe</strong> : un arbre plus gros réduit F<sub>t</sub> (bras de levier plus long) ; une clavette plus longue ou plus large répartit F<sub>t</sub> sur plus de surface, donc τ baisse."
    });
    var g = R.el("g", null, f.svg);
    var cC = R.curseur(f.reglages, { nom: "C [N·m]", min: 1, max: 40, pas: 1, val: 8, surChange: dessiner });
    var cd = R.curseur(f.reglages, { nom: "d [mm]", min: 8, max: 30, pas: 1, val: 12, surChange: dessiner });
    var cb = R.curseur(f.reglages, { nom: "b [mm]", min: 2, max: 8, pas: 1, val: 4, surChange: dessiner });
    var cL = R.curseur(f.reglages, { nom: "L [mm]", min: 8, max: 40, pas: 1, val: 20, surChange: dessiner });
    R.bouton(R.boutons(f.reglages), "Exemple du cours", function () { cC.set(8); cd.set(12); cb.set(4); cL.set(20); dessiner(); });
    var zone = R.h("div", null, "", f.direct);
    function dessiner() {
      R.vider(g);
      var Cn = cC.v, d = cd.v, b = cb.v, L = cL.v, Ft = 2 * Cn / (d / 1000), tau = Ft / (b * L);
      var O = [230, 280], rA = 3 * d + 50, rM = rA + 60, kb = Math.min(b * 6.5, rA * 0.8);
      R.el("circle", { cx: O[0], cy: O[1], r: rM, fill: M.hachures(g, GR, { fond: "#fff", angle: -45 }), stroke: C.fonce, "stroke-width": 2.5 }, g);
      R.el("circle", { cx: O[0], cy: O[1], r: rA, fill: M.hachures(g, GR, { fond: "#fff", angle: 45, pas: 12 }), stroke: C.fonce, "stroke-width": 2.5 }, g);
      var yJ = O[1] - rA;
      R.el("rect", { x: O[0] - kb / 2, y: yJ - kb / 2, width: kb, height: kb, fill: "#ffe9c7", stroke: C.fonce, "stroke-width": 2.5 }, g);
      R.ligne(g, [O[0] - kb / 2 - 26, yJ], [O[0] + kb / 2 + 26, yJ], { couleur: "#e5484d", epaisseur: 3.5, tirets: "7 5" });
      txt(g, "plan cisaillé", [O[0] + kb / 2 + 32, yJ + 2], { couleur: "#e5484d", ancre: "start", taille: 16 });
      var lf = 40 + Math.min(110, Ft / 40);
      R.fleche(g, [O[0] - kb / 2 - lf, yJ - 30], [O[0] - kb / 2 - 2, yJ - 30], { couleur: C.v, epaisseur: 5 });
      txt(g, "Ft", [O[0] - kb / 2 - lf - 18, yJ - 30], { couleur: C.v, gras: true, taille: 20 });
      R.ligne(g, [O[0], O[1]], [O[0], yJ], { couleur: C.v, epaisseur: 2, tirets: "5 4" });
      txt(g, "d/2", [O[0] + 22, (O[1] + yJ) / 2], { couleur: C.v, taille: 17, ancre: "start" });
      txt(g, "arbre", [O[0], O[1] + 30]); txt(g, "moyeu", [O[0], O[1] + rM + 22]);
      // vue de dessus : aire b × L
      var s = 10, w = L * s, h = Math.max(b * s * 1.5, 24), cx = 700, cy = 230;
      txt(g, "clavette vue de dessus", [cx, 100]);
      R.el("rect", { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: h / 2, fill: PLATEFORME.teinte(0.25), stroke: C.fonce, "stroke-width": 2.5 }, g);
      txt(g, "b × L = " + R.fmt(b * L, 0) + " mm²", [cx, cy + h / 2 + 30], { couleur: C.fonce });
      // jauge τ, limite C45 ≈ 200 MPa
      var gx = 520, gy = 430, W = 380, t = Math.min(tau, 220);
      R.el("rect", { x: gx, y: gy, width: W, height: 26, rx: 8, fill: "#f1f3f7" }, g);
      R.el("rect", { x: gx, y: gy, width: W * t / 220, height: 26, rx: 8, fill: tau > 200 ? "#e5484d" : C.acc }, g);
      R.ligne(g, [gx + W * 200 / 220, gy - 10], [gx + W * 200 / 220, gy + 36], { couleur: C.fonce, epaisseur: 2.5 });
      txt(g, "≈ 200 MPa (C45)", [gx + W * 200 / 220, gy + 56], { taille: 15, ancre: "end" });
      txt(g, "τ ≈ " + R.fmt(tau, 1) + " MPa", [gx, gy - 22], { couleur: C.fonce, gras: true, ancre: "start", taille: 20 });
      R.rendre(zone, "F_t = \\frac{2C}{d} = \\frac{2 \\times " + R.tc(Cn, 0) + "}{" + R.tc(d / 1000, 3) + "} \\approx " + R.tc(Ft, 0) + "\\ \\text{N} \\qquad \\tau \\simeq \\frac{F_t}{bL} = \\frac{" + R.tc(Ft, 0) + "}{" + b + " \\times " + L + "} \\approx " + R.tn(tau, 1) + "\\ \\text{MPa}");
    }
    dessiner();
  })();

  /* ---------- Figure 2 : montage d'une clavette ---------- */
  (function () {
    var f = R.figure("fig-montage", {
      largeur: 960, hauteur: 400,
      titre: "Montage : rainure de l'arbre, clavette, rainure débouchante du moyeu",
      essai: "<strong>Essaie</strong> : avance étape par étape. <strong>Observe</strong> : la rainure du moyeu traverse tout le moyeu (débouchante), c'est ce qui permet de l'enfiler sur la clavette."
    });
    var g = R.el("g", null, f.svg);
    var noms = ["l'arbre et sa rainure", "la clavette posée dans la rainure", "le moyeu glisse sur la clavette", "monté : le couple passe par la clavette"];
    var et = R.etapes(f.reglages, 3, noms, dessiner);
    function dessiner(k) {
      R.vider(g);
      var yc = 220;
      // arbre vu de dessus : rainure borgne à bouts ronds
      R.el("rect", { x: 80, y: yc - 70, width: 640, height: 140, rx: 8, fill: "#e8edf5", stroke: C.fonce, "stroke-width": 2.5 }, g);
      M.traitAxe(g, [60, yc], [740, yc]);
      R.el("rect", { x: 520, y: yc - 22, width: 160, height: 44, rx: 22, fill: "#fff", stroke: C.fonce, "stroke-width": 2.5 }, g);
      txt(g, "rainure dans l'arbre", [600, yc + 100]);
      if (k >= 1) R.el("rect", { x: 522, y: yc - 20, width: 156, height: 40, rx: 20, fill: "#ffe9c7", stroke: C.fonce, "stroke-width": 2.5 }, g);
      if (k >= 1) txt(g, "clavette", [600, yc - 92], { couleur: C.fonce });
      if (k >= 2) {
        var x = k === 2 ? 740 : 500;
        R.el("rect", { x: x, y: yc - 130, width: 200, height: 260, rx: 10, fill: M.hachures(g, GR, { fond: "#fff", angle: 45 }), stroke: C.fonce, "stroke-width": 2.5, opacity: 0.85 }, g);
        R.el("rect", { x: x, y: yc - 70, width: 200, height: 140, fill: "rgba(255,255,255,0.55)", stroke: C.fonce, "stroke-width": 1.5, "stroke-dasharray": "6 4" }, g);
        R.el("rect", { x: x, y: yc - 22, width: 200, height: 44, fill: k === 2 ? "#fff" : "rgba(255,233,199,0.7)", stroke: C.acc, "stroke-width": 3 }, g);
        txt(g, "rainure débouchante dans le moyeu", [600, yc - 156], { couleur: C.acc });
        if (k === 2) R.fleche(g, [x + 180, yc + 160], [x - 60, yc + 160], { couleur: C.v, epaisseur: 4 });
      }
      txt(g, "bout d'arbre : d ≤ 30 mm j6 ; d ≥ 32 mm k6", [200, 360], { taille: 16 });
    }
    et.aller(0);
  })();
})();
