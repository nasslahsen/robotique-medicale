(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure : rapport cyclique, fréquence et valeur moyenne ---------- */
  (function () {
    var f = R.figure("fig-pwm", {
      largeur: 960, hauteur: 440,
      titre: "Signal PWM sur une broche",
      essai: "<strong>Essaie</strong> : change le rapport cyclique, puis la fréquence. <strong>Observe</strong> : la valeur moyenne (pointillés) et l'éclat de la LED suivent le rapport cyclique ; la fréquence resserre les impulsions sans changer la moyenne.",
      direct: true
    });
    var cA = R.curseur(f.reglages, { nom: "Rapport cyclique [%]", min: 0, max: 100, pas: 5, val: 30, surChange: dessiner });
    var cF = R.curseur(f.reglages, { nom: "Fréquence [Hz]", min: 500, max: 4000, pas: 500, val: 2000, surChange: dessiner });
    var g = EMB.el("g", null, f.svg);
    function dessiner() {
      EMB.vider(g);
      var a = cA.v / 100, F = cF.v, T = 1 / F, fen = 0.002, x0 = 90, L = 660, yH = 90, yB = 330;
      function X(t) { return x0 + t / fen * L; }
      EMB.texte(g, "3,3 V", [x0 - 12, yH], { taille: 15, ancre: "end", mono: true, gras: false });
      EMB.texte(g, "0 V", [x0 - 12, yB], { taille: 15, ancre: "end", mono: true, gras: false });
      EMB.el("line", { x1: x0, y1: yB, x2: x0 + L, y2: yB, stroke: C.pale, "stroke-width": 2 }, g);
      for (var ms = 0; ms <= 2; ms += 0.5) EMB.texte(g, EMB.virgule(ms) + " ms", [X(ms / 1000), yB + 26], { taille: 14, mono: true, gras: false });
      var d = "M" + x0 + " " + yB;
      for (var k = 0; k * T < fen - 1e-12; k++) {
        var t0 = k * T, t1 = Math.min(fen, t0 + a * T), t2 = Math.min(fen, t0 + T);
        if (a > 0) { d += " L" + X(t0) + " " + yH + " L" + X(t1) + " " + yH; EMB.el("rect", { x: X(t0), y: yH, width: X(t1) - X(t0), height: yB - yH, fill: EMB.teinte(0.12) }, g); }
        d += " L" + X(t1) + " " + yB + " L" + X(t2) + " " + yB;
      }
      EMB.el("path", { d: d, fill: "none", stroke: C.acc, "stroke-width": 4, "stroke-linejoin": "round" }, g);
      var ym = yB - a * (yB - yH);
      EMB.el("line", { x1: x0, y1: ym, x2: x0 + L, y2: ym, stroke: C.v, "stroke-width": 3, "stroke-dasharray": "10 6" }, g);
      EMB.texte(g, "moyenne\n" + EMB.virgule(a * 3.3, 3) + " V", [x0 + L + 12, ym], { taille: 16, coul: C.v, ancre: "start" });
      EMB.fleche(g, [X(0), 395], [X(T), 395], { double: true, ep: 2 });
      EMB.texte(g, "T = " + EMB.virgule(T * 1000, 3).replace(/,?0+$/, "") + " ms", [X(T / 2), 418], { taille: 14, coul: C.doux });
      EMB.el("circle", { cx: 870, cy: 60, r: 26, fill: "rgba(255, 196, 0," + (0.08 + 0.92 * a).toFixed(2) + ")", stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.texte(g, "LED", [870, 102], { taille: 14, coul: C.doux });
      R.rendre(f.direct, "T = \\frac{1}{" + F + "} = " + R.tc(T * 1000, 3) + "\\ \\text{ms} \\qquad t_{haut} = " + R.tc(a, 2) + " \\times " + R.tc(T * 1000, 3) + " = " + R.tc(a * T * 1000, 4) + "\\ \\text{ms} \\qquad V_{moy} = " + R.tc(a, 2) + " \\times 3{,}3 = " + R.tn(a * 3.3, 3) + "\\ \\text{V}");
    }
    dessiner();
  })();
})();
