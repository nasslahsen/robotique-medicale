(function () {
  "use strict";
  var R = RM, C = R.C;
  var T = function (a) { return PLATEFORME.teinte(a); };
  function txt(g, s, p, o) { o = o || {}; o.italique = false; o.gras = o.gras === undefined ? true : o.gras; return R.texte(g, s, p, o); }

  /* ---------- Figure 1 : compression, charge écrasée et bavure ---------- */
  (function () {
    var f = R.figure("fig-compression", {
      largeur: 960, hauteur: 480, titre: "Moulage par compression : charge, rainures de débordement, bavure",
      essai: "<strong>Essaie</strong> : descends le demi-moule supérieur avec le curseur. <strong>Observe</strong> : la charge, de volume constant, s'aplatit et s'élargit ; quand l'empreinte est pleine, l'excès passe dans les rainures de débordement et forme la bavure."
    });
    var g = R.el("g", null, f.svg);
    var c = R.curseur(f.reglages, { nom: "Fermeture du moule", min: 0, max: 100, pas: 1, val: 0, unite: " %" });
    c.surChange(dessiner);
    var CAV = [[230, 410], [550, 730]];
    function dessiner() {
      R.vider(g);
      var z = c.v / 100, yp = 130 + 180 * z, plein = false, bav = 0;
      var d = "M150 310 L" + (CAV[0][0] - 14) + " 310 L" + (CAV[0][0] - 14) + " 320 L" + CAV[0][0] + " 320 L" + CAV[0][0] + " 380 L" + CAV[0][1] + " 380 L" + CAV[0][1] + " 320 L" + (CAV[0][1] + 14) + " 320 L" + (CAV[0][1] + 14) + " 310 L" + (CAV[1][0] - 14) + " 310 L" + (CAV[1][0] - 14) + " 320 L" + CAV[1][0] + " 320 L" + CAV[1][0] + " 380 L" + CAV[1][1] + " 380 L" + CAV[1][1] + " 320 L" + (CAV[1][1] + 14) + " 320 L" + (CAV[1][1] + 14) + " 310 L810 310 L810 450 L150 450 Z";
      R.el("path", { d: d, fill: "#cfd5e1", stroke: C.fonce, "stroke-width": 3, "stroke-linejoin": "round" }, g);
      CAV.forEach(function (cv) {
        var largeur = cv[1] - cv[0], A = 13400, cx = (cv[0] + cv[1]) / 2;
        var h = Math.min(122, 380 - yp), w = A / h;
        if (w > largeur) { w = largeur; plein = true; }
        var hh = Math.min(h, A / w);
        R.el("rect", { x: cx - w / 2, y: 380 - hh, width: w, height: hh, fill: T(0.72), stroke: C.acc, "stroke-width": 2 }, g);
        if (plein && yp >= 309) { bav = 1; R.el("rect", { x: cv[0] - 14, y: 310, width: 14, height: 10, fill: C.acc }, g); R.el("rect", { x: cv[1], y: 310, width: 14, height: 10, fill: C.acc }, g); }
        [cx - 50, cx + 38].forEach(function (ex) { R.el("rect", { x: ex, y: 380, width: 12, height: 90, fill: "#9aa0ad", stroke: C.fonce, "stroke-width": 2 }, g); });
      });
      var up = "M150 " + (yp - 120) + " L810 " + (yp - 120) + " L810 " + (yp - 60) + " L" + (CAV[1][1] - 4) + " " + (yp - 60) + " L" + (CAV[1][1] - 4) + " " + yp + " L" + (CAV[1][0] + 4) + " " + yp + " L" + (CAV[1][0] + 4) + " " + (yp - 60) + " L" + (CAV[0][1] - 4) + " " + (yp - 60) + " L" + (CAV[0][1] - 4) + " " + yp + " L" + (CAV[0][0] + 4) + " " + yp + " L" + (CAV[0][0] + 4) + " " + (yp - 60) + " L150 " + (yp - 60) + " Z";
      R.el("path", { d: up, fill: "#dfe3ec", stroke: C.fonce, "stroke-width": 3, "stroke-linejoin": "round" }, g);
      R.fleche(g, [860, yp - 110], [860, yp - 40], { couleur: C.fonce, epaisseur: 5 });
      txt(g, "v, F", [880, yp - 75], { taille: 18, ancre: "start" });
      txt(g, "charge", [205, 290], { taille: 16, couleur: C.acc, ancre: "end" });
      R.ligne(g, [480, 462], [538, 318], { couleur: C.doux, epaisseur: 1.5 }); R.ligne(g, [480, 462], [422, 318], { couleur: C.doux, epaisseur: 1.5 });
      txt(g, "rainures de débordement", [480, 470], { taille: 15, couleur: C.doux });
      txt(g, "éjecteurs", [870, 440], { taille: 16, couleur: C.doux });
      if (bav) { txt(g, "bavure", [870, 300], { taille: 16, couleur: C.acc }); R.ligne(g, [845, 302], [748, 314], { couleur: C.acc, epaisseur: 1.5 }); }
      f.direct.innerHTML = bav ? "Moule fermé : l'empreinte est pleine et l'excès forme la bavure. On maintient chauffe et pression jusqu'à la fin de la cuisson (réticulation)." : plein ? "L'empreinte est presque pleine : encore un peu de pression et l'excès va déborder." : "La charge est pressée : elle s'aplatit et s'élargit (son volume ne change pas).";
    }
    dessiner();
  })();

  /* ---------- Figure 2 : compression-transfert en sept étapes ---------- */
  (function () {
    var f = R.figure("fig-transfert", {
      largeur: 960, hauteur: 480, titre: "Moulage par compression-transfert : pot, poinçon, canaux",
      essai: "<strong>Essaie</strong> : suis les sept étapes du cours. <strong>Observe</strong> : la matière est ramollie dans la cavité d'attente (le pot) avant d'entrer dans le moule ; c'est le poinçon qui la transfère, à travers les canaux, dans le moule déjà fermé et chaud."
    });
    var g = R.el("g", null, f.svg), k = 0;
    var noms = ["moule et matière froids", "1 préchauffage du moule", "2 préchauffage de la matière", "3 matière ramollie dans la cavité d'attente", "4 transfert par le poinçon à travers un canal", "5 maintien de la chauffe : cuisson", "6 refroidissement du moule", "7 ouverture, récupération de la pièce"];
    var et = R.etapes(f.reglages, 7, noms, function (n) { k = n; dessiner(); });
    function dessiner() {
      R.vider(g);
      var chaud = k >= 1 && k <= 5, cx = 480, ouvert = k === 7 ? 60 : 0;
      var remp = k < 4 ? 0 : 1, dans = k === 3 ? 1 : k >= 4 ? 0.12 : 0;
      R.el("rect", { x: 200, y: 280, width: 560, height: 90, rx: 6, fill: chaud ? "#ecd6d8" : "#dfe3ec", stroke: C.fonce, "stroke-width": 3 }, g);
      R.el("rect", { x: 200, y: 370 + ouvert, width: 560, height: 80, rx: 6, fill: chaud ? "#e3c9cc" : "#cfd5e1", stroke: C.fonce, "stroke-width": 3 }, g);
      // pot
      R.el("rect", { x: cx - 90, y: 190, width: 180, height: 90, rx: 4, fill: chaud ? "#ecd6d8" : "#dfe3ec", stroke: C.fonce, "stroke-width": 3 }, g);
      R.el("rect", { x: cx - 62, y: 200, width: 124, height: 80, fill: "#fff", stroke: C.fonce, "stroke-width": 2 }, g);
      var hm = 60 * dans;
      if (hm > 0) R.el("rect", { x: cx - 61, y: 280 - hm, width: 122, height: hm, fill: T(0.75) }, g);
      // poinçon
      var yb = k >= 4 ? 280 - hm - 1 : 200;
      R.el("rect", { x: cx - 56, y: yb - 150, width: 112, height: 150, fill: "#9aa0ad", stroke: C.fonce, "stroke-width": 3 }, g);
      if (k === 4) R.fleche(g, [cx + 110, 70], [cx + 110, 140], { couleur: C.fonce, epaisseur: 5 });
      // canaux et empreintes
      [[-1, 300], [1, 660]].forEach(function (q) {
        var x0 = cx + q[0] * 40, x1 = q[1] + q[0] * -50;
        R.el("path", { d: "M" + x0 + " 280 L" + x0 + " 320 L" + x1 + " 320", fill: "none", stroke: "#fff", "stroke-width": 14 }, g);
        if (remp) R.el("path", { d: "M" + x0 + " 280 L" + x0 + " 320 L" + x1 + " 320", fill: "none", stroke: T(0.8), "stroke-width": 10 }, g);
        var dy = k === 7 ? 30 : 0;
        R.el("rect", { x: q[1] - 60, y: 300 + dy, width: 120, height: 70, fill: remp ? T(k >= 5 ? 0.95 : 0.75) : "#fff", stroke: C.fonce, "stroke-width": 2.5 }, g);
        R.el("rect", { x: q[1] - 40, y: 370 + ouvert, width: 12, height: 100 - ouvert, fill: "#9aa0ad", stroke: C.fonce, "stroke-width": 2 }, g);
      });
      if (k === 2 || k === 3) { R.el("rect", { x: 760, y: 120, width: 120, height: 50, rx: 10, fill: T(0.75), stroke: C.acc, "stroke-width": 2 }, g); txt(g, "matière ramollie", [820, 100], { taille: 15, couleur: C.acc }); if (k === 3) R.fleche(g, [760, 160], [cx + 70, 220], { couleur: C.acc, epaisseur: 3 }); }
      if (k === 6) txt(g, "refroidissement", [cx, 470], { taille: 16, couleur: "#3b5bdb" });
      if (k === 5) txt(g, "cuisson (réticulation)", [cx, 470], { taille: 16, couleur: "#c03a3e" });
      txt(g, "poinçon (piston)", [cx - 70, yb - 120], { taille: 15, couleur: C.doux, ancre: "end" });
      txt(g, "cavité d'attente (pot)", [cx - 100, 240], { taille: 15, couleur: C.doux, ancre: "end" });
      txt(g, "canal", [395, 346], { taille: 15, couleur: C.doux });
      txt(g, "empreinte", [190, 335], { taille: 15, couleur: C.doux, ancre: "end" });
      txt(g, "éjecteurs", [820, 440], { taille: 15, couleur: C.doux });
      txt(g, noms[k], [480, 30], { taille: 19, couleur: C.fonce });
      f.direct.innerHTML = "Étape " + k + " sur 7 : " + noms[k].replace(/^\d /, "") + ".";
    }
    et.aller(0);
  })();
})();
