(function () {
  "use strict";
  var R = RM, C = R.C, DEG = Math.PI / 180;
  function carre(g, cx, cy, s, angles, id) {
    R.el("rect", { x: cx - s / 2, y: cy - s / 2, width: s, height: s, rx: 10, fill: "#f6efe0", stroke: C.fonce, "stroke-width": 2 }, g);
    var cp = R.el("clipPath", { id: id }, R.el("defs", null, g));
    R.el("rect", { x: cx - s / 2 + 3, y: cy - s / 2 + 3, width: s - 6, height: s - 6 }, cp);
    var gg = R.el("g", { "clip-path": "url(#" + id + ")" }, g);
    angles.forEach(function (t) {
      var a = t * DEG, u = [Math.cos(a), -Math.sin(a)], v = [-u[1], u[0]];
      for (var k = -10; k <= 10; k++) { var c = [cx + v[0] * k * s / 14, cy + v[1] * k * s / 14]; R.ligne(gg, [c[0] - u[0] * s, c[1] - u[1] * s], [c[0] + u[0] * s, c[1] + u[1] * s], { couleur: C.acc, epaisseur: 3 }); }
    });
  }

  /* ---------- Figure 1 : une famille de fibres à l'angle θ ---------- */
  (function () {
    var f = R.figure("fig-ko", {
      largeur: 960, hauteur: 420,
      titre: "Contribution d'une fibre inclinée : cos⁴θ",
      essai: "<strong>Essaie</strong> : tourne les fibres de 0° à 90°. " +
        "<strong>Observe</strong> : cos⁴θ chute très vite ; à 45° la fibre ne compte plus que pour un quart, à 90° plus du tout."
    });
    var g = R.el("g", null, f.svg);
    var c = R.curseur(f.reglages, { nom: "θ", min: 0, max: 90, pas: 1, val: 30, unite: "°" });
    c.surChange(dessin);
    function dessin() {
      R.vider(g);
      var t = c.v;
      R.fleche(g, [40, 40], [180, 40], { couleur: C.z, epaisseur: 5 }); R.texte(g, "charge", [196, 40], { italique: false, taille: 17, couleur: C.z, ancre: "start", gras: true });
      carre(g, 200, 230, 300, [t], "ko1");
      var O = [480, 360], W = 420, H = 280, P = function (a, v) { return [O[0] + a / 90 * W, O[1] - v * H]; };
      R.fleche(g, O, [O[0] + W + 20, O[1]], { epaisseur: 2.5 }); R.fleche(g, O, [O[0], O[1] - H - 20], { epaisseur: 2.5 });
      [0, 45, 90].forEach(function (a) { R.texte(g, a + "°", [P(a, 0)[0], O[1] + 22], { italique: false, taille: 15 }); });
      [0.25, 0.5, 1].forEach(function (v) { R.texte(g, R.fmt(v, 2), [O[0] - 10, P(0, v)[1]], { italique: false, taille: 14, ancre: "end" }); R.ligne(g, P(0, v), P(90, v), { couleur: "#eef0f5" }); });
      R.texte(g, "cos⁴θ", [O[0] + 10, O[1] - H - 26], { italique: false, taille: 17, ancre: "start", gras: true });
      R.texte(g, "θ", [O[0] + W + 18, O[1] + 22], { taille: 18 });
      var pts = []; for (var a = 0; a <= 90; a += 1) pts.push(P(a, Math.pow(Math.cos(a * DEG), 4)));
      R.el("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: C.acc, "stroke-width": 4 }, g);
      var v = Math.pow(Math.cos(t * DEG), 4), q = P(t, v);
      R.ligne(g, [q[0], O[1]], q, { couleur: C.z, tirets: "4 4" });
      R.el("circle", { cx: q[0], cy: q[1], r: 8, fill: C.z, stroke: "#fff", "stroke-width": 2.5 }, g);
      f.direct.innerHTML = "θ = " + t + "° : cos θ = " + R.fmt(Math.cos(t * DEG), 3) + ", contribution cos⁴θ = <strong>" + R.fmt(v, 3) + "</strong>";
    }
    dessin();
  })();

  /* ---------- Figure 2 : composer un renfort et calculer Ko ---------- */
  (function () {
    var f = R.figure("fig-stratifie-ko", {
      largeur: 960, hauteur: 420,
      titre: "Coefficient d'orientation d'un renfort et module ECL",
      essai: "<strong>Essaie</strong> : choisis chaque cas du cours, puis compose ton propre renfort avec les quatre curseurs (les parts sont ramenées à 100 %). " +
        "<strong>Observe</strong> : Ko et ECL ; les fibres à 90° ne comptent pas, celles à ±45° comptent pour un quart. Fibres et résine de l'exemple du cours."
    });
    var g = R.el("g", null, f.svg);
    var b = R.boutons(f.reglages);
    var parts = [1, 0, 0, 0], CAS = [["Alignées", [1, 0, 0, 0]], ["Perpendiculaires", [0, 1, 0, 0]], ["0/90", [1, 1, 0, 0]], ["±45", [0, 0, 1, 1]], ["0/90/±45", [1, 1, 1, 1]]];
    var cs = ["0°", "90°", "+45°", "−45°"].map(function (nom, i) { var c = R.curseur(f.reglages, { nom: "part à " + nom, min: 0, max: 4, pas: 1, val: parts[i] }); c.surChange(function () { parts[i] = c.v; dessin(); }); return c; });
    CAS.forEach(function (k) { R.bouton(b, k[0], function () { parts = k[1].slice(); cs.forEach(function (c, i) { c.set(parts[i]); }); dessin(); }); });
    var aleat = R.bouton(b, "Aléatoire (mat)", function () { parts = null; dessin(); });
    function dessin() {
      R.vider(g);
      R.fleche(g, [40, 40], [180, 40], { couleur: C.z, epaisseur: 5 }); R.texte(g, "charge", [196, 40], { italique: false, taille: 17, couleur: C.z, ancre: "start", gras: true });
      var Ko, plis = [];
      if (!parts) {
        var r = BIO.hasard(9);
        R.el("rect", { x: 50, y: 80, width: 300, height: 300, rx: 10, fill: "#f6efe0", stroke: C.fonce, "stroke-width": 2 }, g);
        for (var i = 0; i < 90; i++) { var cx = 70 + r() * 240, cy = 100 + r() * 240, a = r() * Math.PI; R.ligne(g, [cx, cy], [cx + 40 * Math.cos(a), cy + 40 * Math.sin(a)], { couleur: C.acc, epaisseur: 3 }); }
        Ko = 0.375;
      } else {
        var tot = parts.reduce(function (s, x) { return s + x; }, 0) || 1, ang = [0, 90, 45, -45];
        plis = parts.map(function (p, i) { return { a: p / tot, theta: ang[i] }; }).filter(function (p) { return p.a > 0; });
        carre(g, 200, 230, 300, plis.map(function (p) { return p.theta; }), "ko2");
        Ko = BIO.coefOrientation(plis);
      }
      var E = BIO.moduleOriente(Ko, 70, 3, 0.4);
      R.texte(g, "Ko = " + R.fmt(Ko, 3), [640, 120], { italique: false, taille: 32, gras: true });
      R.texte(g, parts ? plis.map(function (p) { return Math.round(p.a * 100) + " % à " + p.theta + "°"; }).join(" · ") : "aléatoire dans le plan : valeur de la diapo", [640, 170], { italique: false, taille: 16, couleur: C.doux });
      var x0 = 440, w = 440;
      R.texte(g, "ECL = Ko × 70 × 0,4 + 3 × 0,6", [640, 240], { italique: false, taille: 18 });
      R.el("rect", { x: x0, y: 270, width: w, height: 34, rx: 8, fill: "#eef0f5" }, g);
      R.el("rect", { x: x0, y: 270, width: w * E / 29.8, height: 34, rx: 8, fill: C.acc }, g);
      R.texte(g, R.fmt(E, 1) + " GPa", [640, 340], { italique: false, taille: 22, gras: true });
      R.texte(g, "barre pleine : 29,8 GPa (fibres alignées)", [640, 372], { italique: false, taille: 14, couleur: C.doux });
      f.direct.innerHTML = "Ko = " + R.fmt(Ko, 3) + " → ECL = <strong>" + R.fmt(E, 1) + " GPa</strong> au lieu de 29,8 GPa si toutes les fibres étaient alignées.";
    }
    dessin();
  })();
})();
