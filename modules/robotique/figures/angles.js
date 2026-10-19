(function () {
  "use strict";
  var R = RM, C = R.C;

  // α en fraction de π, quand c'est un multiple de 15° (sinon null)
  function enPi(a) {
    if (a % 15) return null;
    var p = a / 15, q = 12, pgcd = function (x, y) { return y ? pgcd(y, x % y) : Math.abs(x); }, d = pgcd(p, q);
    p /= d; q /= d;
    if (!p) return "0";
    var s = p < 0 ? "-" : "", ap = Math.abs(p);
    return s + (q === 1 ? (ap === 1 ? "" : ap) + "\\pi" : "\\dfrac{" + (ap === 1 ? "" : ap) + "\\pi}{" + q + "}");
  }

  /* ---------- Une aiguille qui tourne : degrés, radians, sens trigonométrique ---------- */
  var f = R.figure("fig-angles", {
    largeur: 760, hauteur: 580,
    titre: "Angle d'une aiguille autour d'un centre, en degrés et en radians",
    essai: "<strong>Essaie</strong> : mets α à 90°, puis à −45°. Coche « Arc et rayon » et cherche l'angle où l'arc est aussi long que le rayon. Passe les graduations en radians. " +
      "<strong>Observe</strong> : un angle positif tourne dans le sens inverse des aiguilles d'une montre. L'arc égale le rayon pour 1 rad, environ 57,3°."
  });
  var g = R.el("g", null, f.svg);
  var ca = R.curseur(f.reglages, { nom: "Angle α", min: -180, max: 360, pas: 1, val: 60, unite: "°", dec: 0 });
  var b = R.boutons(f.reglages);
  var rad = R.bascule(b, "Graduations en radians", false, dessin);
  var arcRayon = R.bascule(b, "Arc et rayon", false, dessin);
  ca.surChange(dessin);
  var O = [380, 290], r = 210;
  function pt(deg, k) { var t = deg * R.DEG; return [O[0] + k * r * Math.cos(t), O[1] - k * r * Math.sin(t)]; }
  function dessin() {
    R.vider(g);
    var a = ca.v, t = a * R.DEG;
    R.fleche(g, [O[0] - r - 40, O[1]], [O[0] + r + 50, O[1]], { couleur: "#c3c8d2", epaisseur: 2.5 });
    R.fleche(g, [O[0], O[1] + r + 30], [O[0], O[1] - r - 50], { couleur: "#c3c8d2", epaisseur: 2.5 });
    R.el("circle", { cx: O[0], cy: O[1], r: r, fill: "none", stroke: "#e3e6ee", "stroke-width": 2.5 }, g);
    for (var d = 0; d < 360; d += 15) {
      var long = d % 90 === 0;
      R.ligne(g, pt(d, long ? 0.9 : 0.95), pt(d, 1), { couleur: long ? "#9aa0ad" : "#d3d7e0", epaisseur: long ? 3 : 2 });
      if (!rad.checked && d % 30 === 0) R.texte(g, (d > 180 ? d - 360 : d) + "°", pt(d, 1.15), { couleur: C.doux, taille: 18, italique: false });
    }
    if (rad.checked) [[0, "0"], [45, "π/4"], [90, "π/2"], [135, "3π/4"], [180, "π"], [-90, "−π/2"], [-45, "−π/4"], [-135, "−3π/4"]].forEach(function (l) {
      R.texte(g, l[1], pt(l[0], 1.16), { couleur: C.doux, taille: 19, italique: false });
    });
    // secteur et arc de l'angle
    var n = Math.max(2, Math.ceil(Math.abs(a) / 3)), pts = [O];
    for (var i = 0; i <= n; i++) pts.push(pt(a * i / n, 0.3));
    R.polygone(g, pts, { remplissage: PLATEFORME.teinte(0.16) });
    R.arc(g, O, 0.3 * r, 0, t, { couleur: C.acc, epaisseur: 3 });
    if (arcRayon.checked) {
      R.arc(g, O, r, 0, t, { couleur: C.acc, epaisseur: 9 });
      R.ligne(g, O, pt(0, 1), { couleur: C.z, epaisseur: 8 });
      R.texte(g, "rayon", [O[0] + r / 2, O[1] + 26], { couleur: C.z, taille: 20, italique: false, gras: true });
      if (Math.abs(a) > 10) R.texte(g, "arc", pt(a / 2, 1.1), { couleur: C.acc, taille: 20, italique: false, gras: true });
    }
    // sens trigonométrique
    R.arc(g, O, r + 32, 20 * R.DEG, 70 * R.DEG, { couleur: C.gris, epaisseur: 2 });
    R.fleche(g, pt(66, (r + 32) / r), pt(72, (r + 32) / r), { couleur: C.gris, epaisseur: 2, tete: 12 });
    R.texte(g, "+", pt(45, (r + 54) / r), { couleur: C.doux, taille: 22, italique: false, gras: true });
    R.ligne(g, O, pt(a, 1), { couleur: C.fonce, epaisseur: 7 });
    R.el("circle", { cx: O[0], cy: O[1], r: 9, fill: C.fonce }, g);
    var bout = pt(a, 1);
    R.el("circle", { cx: bout[0], cy: bout[1], r: 11, fill: C.acc, stroke: "#fff", "stroke-width": 3 }, g);
    var p = enPi(a);
    R.rendre(f.direct, "\\alpha = " + a + "° = " + (p ? p + " \\approx " : "") + R.tc(t, 3) + "\\ \\text{rad} \\qquad \\frac{\\text{arc}}{\\text{rayon}} = " + R.tc(Math.abs(t), 3));
  }
  dessin();
})();
