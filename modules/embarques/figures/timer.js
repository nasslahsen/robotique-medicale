(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure : prescaler, compteur 64 bits, alarme ---------- */
  (function () {
    var f = R.figure("fig-timer", {
      largeur: 960, hauteur: 470,
      titre: "Un timer de l'ESP32 sur 10 ms",
      essai: "<strong>Essaie</strong> : change le prescaler et l'alarme, coche le rechargement automatique, passe en décompte. <strong>Observe</strong> : le prescaler change la pente du compteur, l'alarme la hauteur à atteindre ; sans rechargement, il n'y a qu'une alarme.",
      direct: true
    });
    var cP = R.curseur(f.reglages, { nom: "Prescaler", min: 2, max: 400, pas: 2, val: 80, surChange: dessiner });
    var cA = R.curseur(f.reglages, { nom: "Alarme", min: 200, max: 6000, pas: 100, val: 2000, surChange: dessiner });
    var b = R.boutons(f.reglages);
    var rec = R.bascule(b, "Rechargement automatique à l'alarme", true, dessiner);
    var dec = R.bascule(b, "Décompter", false, dessiner);
    var g = EMB.el("g", null, f.svg);
    function dessiner() {
      EMB.vider(g);
      var P = cP.v, A = cA.v, tic = P / 80, T = 10000, x0 = 90, x1 = 930, yb = 420, yh = 170, max = A * 1.4;
      EMB.bloc(g, 40, 30, 170, 70, "Horloge 80 MHz", { taille: 16, fill: C.fond });
      EMB.bloc(g, 260, 30, 190, 70, "Prescaler ÷ " + P, { taille: 17, actif: true });
      EMB.bloc(g, 500, 30, 190, 70, "Compteur 64 bits\n" + (dec.checked ? "décompte" : "compte"), { taille: 16, actif: true });
      EMB.bloc(g, 740, 30, 180, 70, "Alarme = " + A, { taille: 17 });
      EMB.fleche(g, [210, 65], [260, 65], { ep: 2.5 }); EMB.fleche(g, [450, 65], [500, 65], { ep: 2.5 }); EMB.fleche(g, [690, 65], [740, 65], { ep: 2.5 });
      EMB.texte(g, "1 tic = " + EMB.virgule(tic, 3).replace(/,?0+$/, "") + " µs", [355, 122], { taille: 15, coul: C.acc });
      function X(t) { return x0 + t / T * (x1 - x0); }
      function Y(v) { return yb - Math.min(v, max) / max * (yb - yh); }
      EMB.el("line", { x1: x0, y1: yb, x2: x1, y2: yb, stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.el("line", { x1: x0, y1: yb, x2: x0, y2: yh - 10, stroke: C.encre, "stroke-width": 2.5 }, g);
      for (var ms = 0; ms <= 10; ms += 2) EMB.texte(g, ms + " ms", [X(ms * 1000), yb + 20], { taille: 14, mono: true, gras: false });
      EMB.el("line", { x1: x0, y1: Y(A), x2: x1, y2: Y(A), stroke: C.v, "stroke-width": 2.5, "stroke-dasharray": "8 6" }, g);
      EMB.texte(g, "alarme", [x0 + 8, Y(A) - 14], { taille: 14, coul: C.v, ancre: "start" });
      var depart = dec.checked ? A : 0, v = depart, d = "M" + X(0) + " " + Y(v), pas = 10, al = [], fini = false;
      for (var t = pas; t <= T && !fini; t += pas) {
        v += (dec.checked ? -1 : 1) * pas / tic;
        var atteint = dec.checked ? v <= 0 : v >= A;
        if (atteint && (rec.checked || !al.length)) { al.push(t); if (rec.checked) { d += " L" + X(t) + " " + Y(dec.checked ? 0 : A); v = depart; } }
        if (v < 0) v = 0;
        if (v > max) { d += " L" + X(t - (v - max) * tic) + " " + Y(max); fini = true; break; }
        d += " L" + X(t) + " " + Y(v);
      }
      EMB.el("path", { d: d, fill: "none", stroke: C.acc, "stroke-width": 3.5, "stroke-linejoin": "round" }, g);
      al.forEach(function (ta) { EMB.el("circle", { cx: X(ta), cy: yb, r: 7, fill: C.v }, g); });
      var Ta = A * tic;
      R.rendre(f.direct, "T_{tic} = \\frac{" + P + "}{80\\ \\text{MHz}} = " + R.tc(tic, 3) + "\\ \\mu\\text{s} \\qquad T_{alarme} = " + A + " \\times " + R.tc(tic, 3) + "\\ \\mu\\text{s} = " + R.tc(Ta / 1000, 3) + "\\ \\text{ms} \\qquad " + (rec.checked ? "f = " + R.tc(1e6 / Ta, 1) + "\\ \\text{Hz}" : "\\text{une seule alarme}"));
    }
    dessiner();
  })();
})();
