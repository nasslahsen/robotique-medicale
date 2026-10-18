(function () {
  "use strict";
  var R = RM, C = R.C;

  /* ---------- Figure 3 : masse volumique d'un mélange ---------- */
  (function () {
    var f = R.figure("fig-melange", {
      largeur: 960, hauteur: 260,
      titre: "Masse volumique d'un mélange de deux phases",
      essai: "<strong>Essaie</strong> : change la fraction de volume de la phase 2, puis les deux masses volumiques. " +
        "<strong>Observe</strong> : ρ du mélange se place entre ρ1 et ρ2, plus près de la phase qui occupe le plus de volume ; la moyenne simple n'est juste qu'à 50 %."
    });
    var g = R.el("g", null, f.svg);
    var cv = R.curseur(f.reglages, { nom: "Fraction de volume de la phase 2", min: 0, max: 1, pas: 0.01, val: 0.75, dec: 2 });
    var c1 = R.curseur(f.reglages, { nom: "ρ1 (g/cm³)", min: 0.8, max: 3, pas: 0.01, val: 1.0, dec: 2 });
    var c2 = R.curseur(f.reglages, { nom: "ρ2 (g/cm³)", min: 0.8, max: 3, pas: 0.01, val: 1.2, dec: 2 });
    [cv, c1, c2].forEach(function (c) { c.surChange(dessin); });
    function dessin() {
      R.vider(g);
      var v2 = cv.v, x0 = 80, L = 800, l2 = L * v2, y = 60, h = 100;
      R.el("rect", { x: x0, y: y, width: L - l2, height: h, fill: "#f3f5fa", stroke: C.fonce, "stroke-width": 2 }, g);
      R.el("rect", { x: x0 + L - l2, y: y, width: l2, height: h, fill: PLATEFORME.teinte(0.35), stroke: C.fonce, "stroke-width": 2 }, g);
      if (L - l2 > 110) R.texte(g, "phase 1 : " + Math.round((1 - v2) * 100) + " %", [x0 + (L - l2) / 2, y + h / 2], { italique: false, taille: 18 });
      if (l2 > 110) R.texte(g, "phase 2 : " + Math.round(v2 * 100) + " %", [x0 + L - l2 / 2, y + h / 2], { italique: false, taille: 18 });
      var rho = c1.v * (1 - v2) + c2.v * v2, moy = (c1.v + c2.v) / 2;
      R.texte(g, "fractions de volume", [x0, y - 20], { italique: false, taille: 15, couleur: C.doux, ancre: "start" });
      R.texte(g, "ρ = " + R.fmt(c1.v, 2) + " × " + R.fmt(1 - v2, 2) + " + " + R.fmt(c2.v, 2) + " × " + R.fmt(v2, 2) + " = " + R.fmt(rho, 3) + " g/cm³", [480, 210], { italique: false, taille: 22, gras: true });
      f.direct.innerHTML = "Moyenne pondérée : <strong>" + R.fmt(rho, 3) + " g/cm³</strong> ; moyenne simple (fausse sauf à 50 %) : " + R.fmt(moy, 3) + " g/cm³.";
    }
    dessin();
  })();
})();
