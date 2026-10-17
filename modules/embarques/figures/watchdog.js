(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure : où sont les chiens de garde, et comment ils agissent ---------- */
  (function () {
    var f = R.figure("fig-wdt", {
      largeur: 960, hauteur: 560,
      titre: "Les trois chiens de garde et leur fonctionnement",
      essai: "<strong>Essaie</strong> : bloque ou débloque le programme, change l'instant du blocage et la limite du chien. <strong>Observe</strong> : tant que le programme le nourrit, le compteur retombe avant la limite ; dès que le programme se bloque, le compteur monte jusqu'à la limite et la puce redémarre, une limite plus tard.",
      direct: true
    });
    var b = R.boutons(f.reglages);
    var bloque = R.bascule(b, "Programme bloqué", true, dessiner);
    var cT = R.curseur(f.reglages, { nom: "Blocage à [s]", min: 0.5, max: 3, pas: 0.25, val: 2, dec: 2, surChange: dessiner });
    var cL = R.curseur(f.reglages, { nom: "Limite du chien [s]", min: 0.75, max: 1.5, pas: 0.25, val: 1, dec: 2, surChange: dessiner });
    var g = EMB.el("g", null, f.svg);
    function dessiner() {
      EMB.vider(g);
      // carte des chiens de garde
      [["Timer Group 0", 30, "MWDT"], ["Timer Group 1", 340, "MWDT"], ["RTC", 650, "RWDT"]].forEach(function (m) {
        EMB.el("rect", { x: m[1], y: 20, width: 280, height: 150, rx: 16, fill: C.fond, stroke: C.pale, "stroke-width": 2 }, g);
        EMB.texte(g, m[0], [m[1] + 140, 44], { taille: 17 });
        if (m[2] === "MWDT") { EMB.bloc(g, m[1] + 15, 64, 120, 40, "timer 64 bits", { taille: 13 }); EMB.bloc(g, m[1] + 145, 64, 120, 40, "timer 64 bits", { taille: 13 }); }
        else EMB.bloc(g, m[1] + 80, 64, 120, 40, "RTC timer", { taille: 13 });
        EMB.bloc(g, m[1] + 40, 114, 200, 44, m[2], { taille: 17, actif: true });
      });
      // chronologie
      var x0 = 90, x1 = 930, yb = 470, yh = 250, T = 4, L = cL.v, tb = bloque.checked ? cT.v : 99;
      function X(t) { return x0 + t / T * (x1 - x0); }
      function Y(c) { return yb - c / (L * 1.1) * (yb - yh); }
      EMB.el("line", { x1: x0, y1: yb, x2: x1, y2: yb, stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.el("line", { x1: x0, y1: yb, x2: x0, y2: yh - 10, stroke: C.encre, "stroke-width": 2.5 }, g);
      for (var s = 0; s <= 4; s++) EMB.texte(g, s + " s", [X(s), yb + 20], { taille: 14, mono: true, gras: false });
      EMB.el("line", { x1: x0, y1: Y(L), x2: x1, y2: Y(L), stroke: C.ko, "stroke-width": 2.5, "stroke-dasharray": "8 6" }, g);
      EMB.texte(g, "limite", [x1, Y(L) - 14], { taille: 14, coul: C.ko, ancre: "end" });
      EMB.texte(g, "compteur du chien", [x0 + 8, yh - 18], { taille: 15, coul: C.doux, ancre: "start" });
      var d = "M" + X(0) + " " + Y(0), dernier = 0, reset = null;
      for (var t = 0.5; t <= T + 1e-9; t += 0.5) {
        if (t <= tb) { d += " L" + X(t) + " " + Y(t - dernier) + " L" + X(t) + " " + Y(0); dernier = t; EMB.el("circle", { cx: X(t), cy: yb, r: 5, fill: C.ok }, g); }
      }
      if (bloque.checked) {
        var tr = dernier + L;
        if (tr <= T) { d += " L" + X(tr) + " " + Y(L); reset = tr; } else d += " L" + X(T) + " " + Y(T - dernier);
        EMB.el("rect", { x: X(tb), y: yh - 10, width: X(Math.min(reset || T, T)) - X(tb), height: yb - yh + 10, fill: "rgba(229,72,77,0.08)" }, g);
        EMB.texte(g, "bloqué", [X(tb) + 8, yh + 8], { taille: 14, coul: C.ko, ancre: "start" });
      }
      EMB.el("path", { d: d, fill: "none", stroke: C.acc, "stroke-width": 3.5, "stroke-linejoin": "round" }, g);
      if (reset !== null) {
        EMB.el("line", { x1: X(reset), y1: yh - 10, x2: X(reset), y2: yb, stroke: C.ko, "stroke-width": 3 }, g);
        EMB.texte(g, "redémarrage", [X(reset), 525], { taille: 15, coul: C.ko });
      }
      EMB.texte(g, "point vert : le programme nourrit le chien", [x1, 545], { taille: 13, coul: C.doux, gras: false, ancre: "end" });
      f.direct.innerHTML = "<p>" + (!bloque.checked ? "Le programme nourrit le chien toutes les 0,5 s : le compteur ne dépasse jamais 0,5 s, sous la limite de " + EMB.virgule(L) + " s. Rien ne se passe." :
        "Dernière remise à zéro à " + EMB.virgule(dernier) + " s. " + (reset !== null ? "Le chien atteint sa limite à " + EMB.virgule(dernier) + " + " + EMB.virgule(L) + " = " + EMB.virgule(reset) + " s et redémarre la puce." : "La limite tombe après la fin de la fenêtre affichée.")) + "</p>";
    }
    dessiner();
  })();
})();
