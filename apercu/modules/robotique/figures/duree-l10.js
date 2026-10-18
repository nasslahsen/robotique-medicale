(function () {
  "use strict";
  var R = RM, C = R.C;

  /* ---------- Figure : L10 en fonction de la charge ---------- */
  var f = R.figure("fig-l10", {
    largeur: 960, hauteur: 520,
    titre: "Durée nominale L10 en fonction de la charge P",
    essai: "<strong>Essaie</strong> : déplace la charge P, puis change la capacité C, la vitesse n et le type d'élément roulant. " +
      "<strong>Observe</strong> : quand P double, L10 est divisée par 8 pour des billes ; la vitesse ne change pas L10 en tours, mais change la durée en heures."
  });
  var g = R.el("g", null, f.svg);
  var cP = R.curseur(f.reglages, { nom: "Charge P", min: 0.4, max: 3.2, pas: 0.1, val: 0.8, unite: " kN", surChange: dessiner });
  var cC = R.curseur(f.reglages, { nom: "Capacité C", min: 1, max: 6, pas: 0.1, val: 3.2, unite: " kN", surChange: dessiner });
  var cN = R.curseur(f.reglages, { nom: "Vitesse n", min: 50, max: 3000, pas: 50, val: 300, unite: " tr/min", surChange: dessiner });
  var b = R.boutons(f.reglages), p = 3;
  var bB = R.bouton(b, "Billes (p = 3)", function () { p = 3; dessiner(); });
  var bR = R.bouton(b, "Rouleaux (p = 10/3)", function () { p = 10 / 3; dessiner(); });
  R.bouton(b, "Exemple du cours", function () { cP.set(0.8); cC.set(3.2); cN.set(300); p = 3; dessiner(); });
  var zone = R.h("div", null, "", f.direct);
  var ox = 100, oy = 450, sx = 250, sy = 0.62;
  function L(P, pp) { return Math.pow(cC.v / P, pp || p); }
  function dessiner() {
    R.vider(g);
    bB.classList.toggle("actif", p === 3); bR.classList.toggle("actif", p !== 3);
    R.fleche(g, [ox, oy], [930, oy], { couleur: C.gris, epaisseur: 2 }); R.fleche(g, [ox, oy], [ox, 40], { couleur: C.gris, epaisseur: 2 });
    for (var x = 0.5; x <= 3.01; x += 0.5) { R.ligne(g, [ox + x * sx, oy], [ox + x * sx, oy + 8], { couleur: C.gris }); R.texte(g, R.fmt(x, 1), [ox + x * sx, oy + 26], { italique: false, couleur: C.doux, taille: 15 }); }
    [100, 200, 300, 400, 500, 600].forEach(function (y) { R.ligne(g, [ox, oy - y * sy], [930, oy - y * sy], { couleur: "#eef0f5" }); R.texte(g, String(y), [ox - 12, oy - y * sy], { italique: false, couleur: C.doux, taille: 14, ancre: "end" }); });
    R.texte(g, "P (kN)", [925, oy - 18], { italique: false, ancre: "end", couleur: C.doux, taille: 16 });
    R.texte(g, "L₁₀ (millions de tours)", [ox + 12, 44], { italique: false, ancre: "start", couleur: C.doux, taille: 16 });
    var pts = [];
    for (var P = 0.3; P <= 3.4; P += 0.01) { var y = L(P); if (y * sy <= 400) pts.push((ox + P * sx).toFixed(1) + "," + (oy - y * sy).toFixed(1)); }
    R.el("polyline", { points: pts.join(" "), fill: "none", stroke: C.acc, "stroke-width": 4 }, g);
    // point courant et point à charge double
    var P0 = cP.v, y0 = L(P0), q = [ox + P0 * sx, oy - Math.min(y0 * sy, 400)];
    R.ligne(g, [q[0], oy], q, { couleur: C.fonce, tirets: "5 5" });
    R.point(g, q, { couleur: C.acc, r: 9, contour: "#fff" });
    R.texte(g, R.fmt(y0, 1) + " Mtr" + (y0 * sy > 400 ? " (hors échelle)" : ""), [q[0] + 14, q[1] - 18], { italique: false, ancre: "start", gras: true, taille: 17 });
    if (2 * P0 <= 3.4) { var q2 = [ox + 2 * P0 * sx, oy - L(2 * P0) * sy]; R.point(g, q2, { couleur: C.v, r: 7 }); R.texte(g, "2P : " + R.fmt(L(2 * P0), 1) + " Mtr", [q2[0] + 12, q2[1] - 18], { italique: false, ancre: "start", couleur: C.v, taille: 16 }); }
    var h = y0 * 1e6 / (60 * cN.v);
    R.rendre(zone, "L_{10} = \\left(\\frac{" + R.tc(cC.v, 1) + "}{" + R.tc(P0, 1) + "}\\right)^{" + (p === 3 ? "3" : "10/3") + "} = " + R.tn(y0, 1) + "\\ \\text{millions de tours} \\qquad L_{10h} = \\frac{10^6 \\times " + R.tn(y0, 1) + "}{60 \\times " + cN.v + "} = " + R.tn(h, 0) + "\\ \\text{h}");
  }
  dessiner();
})();
