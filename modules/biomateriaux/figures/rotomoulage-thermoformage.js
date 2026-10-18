(function () {
  "use strict";
  var R = RM, C = R.C;
  var T = function (a) { return PLATEFORME.teinte(a); };
  function txt(g, s, p, o) { o = o || {}; o.italique = false; o.gras = o.gras === undefined ? true : o.gras; return R.texte(g, s, p, o); }
  function resistance(g, y, x0, x1) {
    var d = "M" + x0 + " " + y;
    for (var x = x0; x < x1; x += 20) d += " q5 -14 10 0 q5 14 10 0";
    R.el("path", { d: d, fill: "none", stroke: "#e5484d", "stroke-width": 3 }, g);
  }

  /* ---------- Figure 1 : rotomoulage ---------- */
  (function () {
    var f = R.figure("fig-rotomoulage", {
      largeur: 960, hauteur: 480, titre: "Rotomoulage : poudre dans un moule chauffé qui tourne",
      essai: "<strong>Essaie</strong> : fais tourner le moule avec le curseur (nombre de tours), avec puis sans chauffage. <strong>Observe</strong> : la poudre ne colle à la paroi que si le moule est chaud ; tour après tour, la couche s'épaissit partout à la fois et la pièce reste creuse, d'un seul tenant."
    });
    var g = R.el("g", null, f.svg);
    var c = R.curseur(f.reglages, { nom: "Tours du moule", min: 0, max: 6, pas: 0.1, val: 0, dec: 1 });
    var b = R.boutons(f.reglages);
    var chauffe = R.bascule(b, "Moule chauffé", true, dessiner);
    c.surChange(dessiner);
    function dessiner() {
      R.vider(g);
      var tours = c.v, p = chauffe.checked ? Math.min(1, tours / 5) : 0, a = tours * 360, ctr = [330, 240], Rr = 150;
      if (chauffe.checked) { resistance(g, 50, 160, 500); resistance(g, 430, 160, 500); txt(g, "chauffage", [530, 50], { taille: 16, couleur: "#c03a3e", ancre: "start" }); }
      var pts = [];
      for (var i = 0; i < 6; i++) { var t = (i * 60 + 30 + a) * Math.PI / 180; pts.push([ctr[0] + Rr * Math.cos(t), ctr[1] + Rr * Math.sin(t)]); }
      R.el("path", { d: "M" + pts.map(function (q) { return q.join(" "); }).join(" L") + " Z", fill: "#fff", stroke: "#5b6172", "stroke-width": 16, "stroke-linejoin": "round" }, g);
      if (p > 0) {
        var pi = pts.map(function (q) { return [ctr[0] + (q[0] - ctr[0]) * 0.9, ctr[1] + (q[1] - ctr[1]) * 0.9]; });
        R.el("path", { d: "M" + pi.map(function (q) { return q.join(" "); }).join(" L") + " Z", fill: "none", stroke: T(0.8), "stroke-width": 26 * p, "stroke-linejoin": "round" }, g);
      }
      var reste = 1 - p, rr = BIO.hasard(11);
      for (var k = 0; k < Math.round(90 * reste); k++) R.el("circle", { cx: ctr[0] + (rr() - 0.5) * 170 * Math.sqrt(reste), cy: ctr[1] + 106 - rr() * 46 * reste, r: 4.5, fill: T(0.6) }, g);
      txt(g, "moule", [ctr[0] - Rr - 30, ctr[1]], { taille: 16, couleur: C.doux, ancre: "end" });
      R.el("path", { d: "M600 180 A50 50 0 1 1 600 300", fill: "none", stroke: "#3b5bdb", "stroke-width": 4 }, g);
      R.fleche(g, [606, 296], [592, 302], { couleur: "#3b5bdb", epaisseur: 4 });
      R.el("path", { d: "M590 380 A50 16 0 1 0 690 380", fill: "none", stroke: "#3b5bdb", "stroke-width": 4 }, g);
      R.fleche(g, [682, 386], [692, 376], { couleur: "#3b5bdb", epaisseur: 4 });
      txt(g, "rotations du moule", [640, 340], { taille: 16, couleur: "#3b5bdb" });
      // vue en coupe de la pièce démoulée
      if (p >= 1) {
        R.el("rect", { x: 760, y: 150, width: 170, height: 180, rx: 30, fill: "#fff", stroke: T(0.85), "stroke-width": 20 }, g);
        txt(g, "pièce démoulée (coupe)", [845, 370], { taille: 15, couleur: C.acc });
        txt(g, "creuse, sans soudure", [845, 394], { taille: 15, couleur: C.fonce, gras: false });
      }
      f.direct.innerHTML = !chauffe.checked ? "Moule froid : la poudre roule mais ne colle pas. Le rotomoulage a besoin d'un moule chauffé."
        : p < 1 ? "Après " + R.fmt(tours, 1) + " tour(s) : " + Math.round(100 * p) + " % de la poudre s'est déposée sur la paroi. Le cycle est assez long." : "Toute la poudre est sur la paroi : on refroidit et on démoule une pièce creuse d'un seul tenant (citerne, kayak, réservoir).";
    }
    dessiner();
  })();

  /* ---------- Figure 2 : cycle de thermoformage ---------- */
  (function () {
    var f = R.figure("fig-thermoformage", {
      largeur: 960, hauteur: 500, titre: "Déroulement d'un cycle de thermoformage",
      essai: "<strong>Essaie</strong> : avance étape par étape dans le cycle. <strong>Observe</strong> : la feuille n'est formée que lorsqu'elle est molle et que la pompe à vide retire l'air ; après refroidissement on démoule, puis on découpe au pourtour."
    });
    var g = R.el("g", null, f.svg), k = 0;
    var noms = ["la machine : moule, platine, table, pompe à vide", "1 chauffage", "2 montée du moule", "3 aspiration", "4 refroidissement", "5 démoulage"];
    var et = R.etapes(f.reglages, 5, noms, function (n) { k = n; dessiner(); });
    function dessiner() {
      R.vider(g);
      var cx = 400, cy = 250, haut = k >= 2 && k <= 4, dy = haut ? 0 : 140;
      R.el("rect", { x: 160, y: 430, width: 480, height: 20, fill: "#5b6172" }, g);
      txt(g, "table", [660, 440], { taille: 16, couleur: C.doux, ancre: "start" });
      R.el("rect", { x: cx - 40, y: cy + dy, width: 80, height: 430 - cy - dy, fill: "#9aa0ad", stroke: C.fonce, "stroke-width": 2 }, g);
      R.el("rect", { x: cx - 140, y: cy + dy, width: 280, height: 14, rx: 3, fill: "#c6cbd8", stroke: C.fonce, "stroke-width": 2 }, g);
      txt(g, "platine", [cx - 150, cy + dy + 34], { taille: 16, couleur: C.doux, ancre: "end" });
      var top = cy - 110 + dy;
      R.el("path", { d: "M" + (cx - 115) + " " + (cy + dy) + " L" + (cx - 60) + " " + top + " L" + (cx + 60) + " " + top + " L" + (cx + 115) + " " + (cy + dy) + " Z", fill: "#dfe3ec", stroke: C.fonce, "stroke-width": 3, "stroke-linejoin": "round" }, g);
      txt(g, "moule", [cx, top + 52], { taille: 17, couleur: C.doux });
      var vide = k === 3 || k === 4;
      R.el("path", { d: "M" + cx + " 430 L" + cx + " 480 L700 480", fill: "none", stroke: "#3b5bdb", "stroke-width": 4, "stroke-dasharray": vide ? "8 6" : null }, g);
      R.el("rect", { x: 700, y: 458, width: 150, height: 40, rx: 8, fill: "#fff", stroke: "#3b5bdb", "stroke-width": 3 }, g);
      txt(g, "pompe à vide", [775, 478], { taille: 15, couleur: "#3b5bdb" });
      // feuille dans son cadre
      var formee = k >= 3, fe;
      if (k <= 1) fe = "M200 " + cy + " L600 " + cy;
      else if (k === 2) fe = "M200 " + cy + " L" + (cx - 90) + " " + cy + " L" + (cx - 60) + " " + (cy - 110) + " L" + (cx + 60) + " " + (cy - 110) + " L" + (cx + 90) + " " + cy + " L600 " + cy;
      else fe = "M200 " + cy + " L" + (cx - 115) + " " + cy + " L" + (cx - 60) + " " + (cy - 110) + " L" + (cx + 60) + " " + (cy - 110) + " L" + (cx + 115) + " " + cy + " L600 " + cy;
      var yc = cy;
      R.el("path", { d: fe, fill: "none", stroke: k === 1 ? "#e5484d" : C.acc, "stroke-width": 7, "stroke-linejoin": "round" }, g);
      [190, 600].forEach(function (x) { R.el("rect", { x: x - 8, y: yc - 15, width: 26, height: 30, fill: "#5b6172" }, g); });
      txt(g, "feuille dans son cadre", [110, yc - 34], { taille: 15, couleur: C.acc, ancre: "start" });
      if (k === 1) { R.el("rect", { x: 210, y: cy - 66, width: 380, height: 16, rx: 6, fill: "#e8b931" }, g); R.el("rect", { x: 210, y: cy + 50, width: 380, height: 16, rx: 6, fill: "#e8b931" }, g); txt(g, "éléments chauffants : la feuille ramollit", [cx, cy - 90], { taille: 16, couleur: "#a07c10" }); }
      if (k === 2) R.fleche(g, [cx + 200, 400], [cx + 200, 300], { couleur: C.fonce, epaisseur: 4 });
      if (k === 3) [cx - 100, cx + 100].forEach(function (x) { R.fleche(g, [x + (x < cx ? -10 : 10), cy - 60], [x + (x < cx ? 14 : -14), cy - 14], { couleur: "#3b5bdb", epaisseur: 3 }); });
      if (k === 4) [[cx - 170, 90], [cx + 170, 90]].forEach(function (q) { R.el("circle", { cx: q[0], cy: q[1], r: 22, fill: "#fff", stroke: "#3b5bdb", "stroke-width": 3 }, g); R.fleche(g, [q[0], q[1] + 26], [q[0] + (q[0] < cx ? 40 : -40), q[1] + 70], { couleur: "#3b5bdb", epaisseur: 3 }); txt(g, "ventilation", [q[0], q[1] - 34], { taille: 14, couleur: "#3b5bdb" }); });
      if (k === 5) { [cx - 130, cx + 130].forEach(function (x) { R.ligne(g, [x, yc - 26], [x, yc + 26], { couleur: C.fonce, epaisseur: 2, tirets: "5 4" }); }); txt(g, "découpe au pourtour", [cx + 220, yc - 50], { taille: 15, couleur: C.fonce }); }
      txt(g, noms[k], [480, 30], { taille: 20, couleur: C.fonce });
      f.direct.innerHTML = ["La feuille est tenue par un cadre au-dessus du moule posé sur sa platine.", "La feuille est chauffée : elle se ramollit.", "Le moule monte sous la feuille encore chaude, qui se tend dessus.", "La pompe à vide retire l'air entre le moule et la feuille : la feuille épouse le moule.", "La feuille refroidit sur le moule et garde sa forme.", "Le moule descend : la pièce sort, mince et à coins arrondis ; on la découpe au pourtour."][k];
    }
    et.aller(0);
  })();
})();
