(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Signal logique (fronts, niveaux) et horloge (période, fréquence) ---------- */
  (function () {
    var f = R.figure("fig-signaux", {
      largeur: 900, hauteur: 440,
      titre: "Signal d'un bouton d'appel et horloge",
      essai: "<strong>Essaie</strong> : coche les fronts montants, puis le niveau bas. Change la fréquence de l'horloge. " +
        "<strong>Observe</strong> : un front est un instant, un niveau dure. Quand la fréquence double, la période est divisée par deux : \\(f = 1/T\\)."
    });
    var g = EMB.el("g", null, f.svg);
    var b = R.boutons(f.reglages);
    var mont = R.bascule(b, "Fronts montants", true, dessin);
    var desc = R.bascule(b, "Fronts descendants", false, dessin);
    var bas = R.bascule(b, "Niveau bas", false, dessin);
    var cf = R.curseur(f.reglages, { nom: "Fréquence de l'horloge (MHz)", min: 1, max: 16, pas: 1, val: 4, dec: 0 });
    cf.surChange(dessin);
    var NIV = [0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0];
    function dessin() {
      EMB.vider(g);
      var x0 = 120, pas = 50, y = 60, h = 90;
      EMB.texte(g, "bouton", [x0 - 26, y + h / 2], { taille: 19, ancre: "end" });
      EMB.texte(g, "1", [x0 - 8, y], { taille: 17, mono: true, coul: C.doux, gras: false, ancre: "end" });
      EMB.texte(g, "0", [x0 - 8, y + h], { taille: 17, mono: true, coul: C.doux, gras: false, ancre: "end" });
      if (bas.checked) NIV.forEach(function (v, k) { if (!v) EMB.el("rect", { x: x0 + k * pas, y: y - 6, width: pas, height: h + 12, fill: "rgba(154,160,173,.22)" }, g); });
      EMB.onde(g, x0, y, pas, h, NIV, { ep: 4 });
      NIV.forEach(function (v, k) {
        if (!k || v === NIV[k - 1]) return;
        var x = x0 + k * pas, m = v === 1;
        if ((m && mont.checked) || (!m && desc.checked)) {
          EMB.fleche(g, [x, m ? y + h + 10 : y - 10], [x, m ? y - 14 : y + h + 14], { coul: m ? C.ok : C.ko, ep: 4 });
        }
      });
      EMB.texte(g, "3,3 V", [x0 + NIV.length * pas + 12, y], { taille: 17, mono: true, coul: C.doux, gras: false, ancre: "start" });
      EMB.texte(g, "0 V", [x0 + NIV.length * pas + 12, y + h], { taille: 17, mono: true, coul: C.doux, gras: false, ancre: "start" });
      // horloge
      var yh = 270, fr = cf.v, T = 1000 / fr, per = 640 / fr, n = Math.floor(700 / per);
      EMB.texte(g, "horloge", [x0 - 26, yh + 35], { taille: 19, ancre: "end" });
      EMB.horloge(g, x0, yh, per, 70, n, { ep: 3.5, coul: C.acc });
      var xa = x0 + per, xb = x0 + 2 * per;
      EMB.fleche(g, [xa, yh + 104], [xb, yh + 104], { double: true, coul: C.v, ep: 2.5 });
      EMB.texte(g, "T", [(xa + xb) / 2, yh + 130], { taille: 22, coul: C.v, italique: true });
      R.rendre(f.direct, "f = " + fr + "\\ \\text{MHz} \\qquad T = \\frac{1}{f} = \\frac{1}{" + fr + " \\times 10^{6}\\ \\text{Hz}} = " + R.tc(T, 1) + "\\ \\text{ns}");
    }
    dessin();
  })();
})();
