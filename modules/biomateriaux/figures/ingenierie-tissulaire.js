(function () {
  "use strict";
  var R = RM, C = R.C;
  var OS = "#f3ead8", BORD = "#b9a77f", TISSU = "#e9d6ae";

  /* ---------- Implant permanent ou échafaudage qui se dégrade ---------- */
  (function () {
    var f = R.figure("fig-echafaudage", {
      largeur: 960, hauteur: 440, titre: "Implant non dégradable et échafaudage biodégradable",
      essai: "<strong>Essaie</strong> : fais avancer le temps. <strong>Observe</strong> : à gauche, l'implant reste tel quel ; à droite, la masse d'échafaudage diminue pendant que le tissu neuf gagne, les cellules (violettes) colonisant les pores. Courbes illustratives."
    });
    var ct = R.curseur(f.reglages, { nom: "Temps", min: 0, max: 100, pas: 1, val: 0, unite: " %", surChange: dessin });
    var g = R.el("g", null, f.svg);
    function os(x0, titre) {
      R.texte(g, titre, [x0 + 130, 40], { italique: false, gras: true, taille: 19 });
      R.el("rect", { x: x0, y: 70, width: 260, height: 300, rx: 26, fill: OS, stroke: BORD, "stroke-width": 3 }, g);
      R.el("rect", { x: x0 + 55, y: 145, width: 150, height: 150, fill: "#fff6f0", stroke: BORD, "stroke-width": 2, "stroke-dasharray": "6 5" }, g);
    }
    function dessin() {
      R.vider(g);
      var t = ct.v / 100;
      os(30, "Biomatériau non dégradable");
      R.el("rect", { x: 92, y: 152, width: 136, height: 136, rx: 10, fill: "#b8c0cc", stroke: C.fonce, "stroke-width": 2.5 }, g);
      R.texte(g, "implant", [160, 220], { italique: false, gras: true, taille: 17, halo: false });
      os(330, "Ingénierie tissulaire");
      var dx = 385, dy = 145, l = 150, e = t * l / 2;
      if (e > 0.5) R.el("path", { d: "M" + dx + " " + dy + " h" + l + " v" + l + " h" + (-l) + " Z M" + (dx + e) + " " + (dy + e) + " v" + (l - 2 * e) + " h" + (l - 2 * e) + " v" + (-(l - 2 * e)) + " Z", fill: TISSU, "fill-rule": "evenodd" }, g);
      var op = Math.max(0, 1 - 1.05 * t);
      for (var i = 0; i < 5; i++) for (var k = 0; k < 5; k++) if (op > 0.02) R.el("circle", { cx: dx + 15 + i * 30, cy: dy + 15 + k * 30, r: 11, fill: "none", stroke: C.acc, "stroke-width": 4, opacity: op }, g);
      for (var c = 0; c < 10; c++) { var a = c * 0.63, r = 50 * (1 - 0.4 * t); R.el("circle", { cx: dx + l / 2 + r * Math.cos(a), cy: dy + l / 2 + r * Math.sin(a), r: 6, fill: C.v }, g); }
      // courbes : masse d'échafaudage, quantité de tissu
      var gx = 650, gy = 360, gl = 280, gh = 250;
      R.ligne(g, [gx, gy], [gx + gl, gy], { couleur: C.fonce, epaisseur: 2.5 }); R.ligne(g, [gx, gy], [gx, gy - gh], { couleur: C.fonce, epaisseur: 2.5 });
      R.texte(g, "temps", [gx + gl, gy + 24], { italique: false, couleur: C.doux, taille: 15, ancre: "end" });
      var pe = [], pt = [];
      for (var s = 0; s <= 50; s++) { var u = s / 50; pe.push([gx + u * gl, gy - gh * Math.max(0, 1 - 1.05 * u)]); pt.push([gx + u * gl, gy - gh * (1 - Math.pow(1 - u, 2))]); }
      R.el("polyline", { points: pe.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: C.acc, "stroke-width": 4 }, g);
      R.el("polyline", { points: pt.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: "#a07c45", "stroke-width": 4 }, g);
      R.texte(g, "échafaudage", [gx + 60, gy - gh + 10], { italique: false, gras: true, couleur: C.acc, taille: 15, ancre: "start" });
      R.texte(g, "tissu neuf", [gx + gl - 10, gy - gh - 14], { italique: false, gras: true, couleur: "#8a6a35", taille: 15, ancre: "end" });
      R.ligne(g, [gx + t * gl, gy], [gx + t * gl, gy - gh], { couleur: "#3b5bdb", epaisseur: 2.5, tirets: "5 4" });
      R.texte(g, t > 0.97 ? "défaut comblé par un tissu naturel" : "", [460, 400], { italique: false, gras: true, couleur: C.y, taille: 16 });
      R.texte(g, "l'implant reste jusqu'à", [160, 396], { italique: false, couleur: C.doux, taille: 15 });
      R.texte(g, "ce qu'il ne fonctionne plus", [160, 418], { italique: false, couleur: C.doux, taille: 15 });
      f.direct.innerHTML = "<p>Temps " + Math.round(t * 100) + " % : échafaudage restant environ " + Math.round(100 * Math.max(0, 1 - 1.05 * t)) + " %, défaut comblé par le tissu neuf à environ " + Math.round(100 * (1 - Math.pow(1 - t, 2))) + " %.</p>";
    }
    dessin();
  })();

  /* ---------- Porosité de l'échafaudage ---------- */
  (function () {
    var f = R.figure("fig-pores", {
      largeur: 960, hauteur: 400, titre: "Porosité et interconnexions d'un échafaudage",
      essai: "<strong>Essaie</strong> : change le volume poreux et le diamètre des interconnexions. <strong>Observe</strong> : des pores plus nombreux et mieux reliés laissent passer cellules et vaisseaux jusqu'au cœur du support ; trop fermés, ils restent vides. Modèle illustratif."
    });
    var cp = R.curseur(f.reglages, { nom: "Volume poreux", min: 20, max: 90, pas: 1, val: 40, unite: " %", surChange: dessin });
    var ci = R.curseur(f.reglages, { nom: "Interconnexions", min: 0, max: 100, pas: 1, val: 30, unite: " %", surChange: dessin });
    var g = R.el("g", null, f.svg);
    function dessin() {
      R.vider(g);
      var p = cp.v / 100, ic = ci.v / 100, N = 7, x0 = 300, y0 = 40, pas = 50;
      R.el("rect", { x: x0 - 20, y: y0 - 20, width: N * pas + 40, height: N * pas - 10, rx: 16, fill: "#e8ddf0", stroke: C.acc, "stroke-width": 3 }, g);
      var r = 8 + 16 * p, prof = Math.round(ic * (N - 1) / 2 + 0.5 + p * 1.5);
      for (var i = 0; i < N; i++) for (var k = 0; k < N - 1; k++) {
        var cx = x0 + i * pas, cy = y0 + k * pas, d = Math.min(i, N - 1 - i, k, N - 2 - k);
        if (i < N - 1 && ic > 0.05) R.ligne(g, [cx, cy], [cx + pas, cy], { couleur: "#fff", epaisseur: 2 + ic * 12 });
        if (k < N - 2 && ic > 0.05) R.ligne(g, [cx, cy], [cx, cy + pas], { couleur: "#fff", epaisseur: 2 + ic * 12 });
        R.el("circle", { cx: cx, cy: cy, r: r, fill: "#fff" }, g);
        if (d < prof) R.el("circle", { cx: cx, cy: cy, r: 6, fill: C.v }, g);
        if (d < prof - 1) R.el("circle", { cx: cx + 4, cy: cy - 4, r: 3, fill: C.x }, g);
      }
      R.texte(g, "cellules", [120, 120], { italique: false, gras: true, couleur: C.v, taille: 17 });
      R.texte(g, "vaisseaux (rouge)", [120, 160], { italique: false, gras: true, couleur: C.x, taille: 17 });
      var cible = Math.ceil((N - 1) / 2);
      f.direct.innerHTML = "<p>" + (prof >= cible ? "Les cellules et les vaisseaux atteignent le cœur de l'échafaudage." : "Le cœur de l'échafaudage reste vide : augmente la porosité ou les interconnexions.") + "</p>";
    }
    dessin();
  })();
})();
