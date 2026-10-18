(function () {
  "use strict";
  var R = RM, C = R.C, m = R.m;

  var f = R.figure("fig-cyl", {
    dessins: [{ l: 600, h: 400, titre: "Vue de dessus : plan (X, Y)" }, { l: 600, h: 420, titre: "Vue 3D : cylindre de rayon r" }],
    essai: "<strong>Essaie</strong> : déplace le point orange dans la vue de dessus, puis règle la hauteur \\(z\\). " +
      "<strong>Observe</strong> : \\(r\\) et \\(\\theta\\) décrivent le même point que \\(x\\) et \\(y\\). Fais passer le point à gauche de l'axe Y : \\(\\arctan(y/x)\\) se trompe de direction, \\(\\operatorname{atan2}(y, x)\\) non."
  });
  var P = R.plan(300, 200, 72);
  var g = R.el("g", null, f.svgs[0]), gp = R.el("g", null, f.svgs[0]);
  var V = R.vue3D(290, 285, 78, 20 * R.DEG, 24 * R.DEG);
  var g3 = R.el("g", null, f.svgs[1]);
  var cz = R.curseur(f.reglages, { nom: "Hauteur z", min: -1, max: 2.5, pas: 0.1, val: 1.5, surChange: dessiner });
  var b = R.boutons(f.reglages);
  var tourne = R.basculeOrbite(b);
  var q = [1.8, 1.4];
  var zone = R.h("div", null, "", f.direct), alerte = R.h("p", null, "", f.direct);

  function dessiner() {
    R.vider(g); R.vider(gp); R.vider(g3);
    var c = m.versCylindrique(q[0], q[1], cz.v), o = P.p([0, 0]);
    // vue de dessus
    R.grille(g, P, f.svgs[0], { pas: 0.5, fort: 2, axes: false });
    R.fleche(g, P.p([-4, 0]), P.p([4, 0]), { couleur: C.x, epaisseur: 2 });
    R.fleche(g, P.p([0, -2.7]), P.p([0, 2.7]), { couleur: C.y, epaisseur: 2 });
    R.texte(g, "X", P.p([3.85, -0.25]), { couleur: C.x });
    R.texte(g, "Y", P.p([0.25, 2.55]), { couleur: C.y });
    R.el("circle", { cx: o[0], cy: o[1], r: c.r * P.s, fill: "none", stroke: C.z, "stroke-dasharray": "3 5", opacity: 0.6 }, g);
    R.ligne(g, P.p(q), P.p([q[0], 0]), { couleur: C.gris, tirets: "5 4" });
    R.ligne(g, P.p(q), P.p([0, q[1]]), { couleur: C.gris, tirets: "5 4" });
    R.texte(g, "x = " + R.fmt(q[0], 1), m.add(P.p([q[0], 0]), [0, q[1] >= 0 ? 18 : -18]), { couleur: C.x, italique: false, taille: 15 });
    R.texte(g, "y = " + R.fmt(q[1], 1), m.add(P.p([0, q[1]]), [q[0] >= 0 ? -40 : 40, 0]), { couleur: C.y, italique: false, taille: 15 });
    R.ligne(g, o, P.p(q), { couleur: C.z, epaisseur: 3 });
    R.arc(g, o, 34, 0, c.theta, { couleur: C.acc, epaisseur: 2.5 });
    R.texte(g, "θ", [o[0] + 50 * Math.cos(c.theta / 2), o[1] - 50 * Math.sin(c.theta / 2)], { couleur: C.acc, gras: true });
    R.texte(g, "r", m.add(P.p(m.scale(q, 0.5)), [-12 * Math.sin(c.theta) * -1, -14]), { couleur: C.z, gras: true });
    R.texte(g, "Q", m.add(P.p(q), [16, -14]), { couleur: C.v, gras: true });
    R.poignee(f.svgs[0], gp, P.p(q), function (s) {
      var w = P.inv(s);
      q = [Math.max(-3.8, Math.min(3.8, Math.round(w[0] * 10) / 10)), Math.max(-2.5, Math.min(2.5, Math.round(w[1] * 10) / 10))];
      dessiner();
    });

    // vue 3D
    // sol quadrillé (plan X, Y)
    for (var s0 = -3; s0 <= 3; s0++) {
      R.ligne(g3, V.p([s0, -3, 0]), V.p([s0, 3, 0]), { couleur: "#e3e6ee", epaisseur: 1 });
      R.ligne(g3, V.p([-3, s0, 0]), V.p([3, s0, 0]), { couleur: "#e3e6ee", epaisseur: 1 });
    }
    var n = 48, cercle = function (zz) { var pts = []; for (var i = 0; i <= n; i++) { var t = 2 * Math.PI * i / n; pts.push(V.p([c.r * Math.cos(t), c.r * Math.sin(t), zz])); } return pts; };
    // paroi du cylindre de rayon r, entre z = 0 et la hauteur du point
    var bas = cercle(0), haut = cercle(cz.v);
    R.el("polygon", { points: bas.concat(haut.slice().reverse()).map(String).join(" "), fill: C.z, opacity: 0.06 }, g3);
    var t0 = Math.atan2(-Math.sin(V.az), Math.cos(V.az));
    [t0, t0 + Math.PI].forEach(function (t) { R.ligne(g3, V.p([c.r * Math.cos(t), c.r * Math.sin(t), 0]), V.p([c.r * Math.cos(t), c.r * Math.sin(t), cz.v]), { couleur: C.z, epaisseur: 1, opacite: 0.35 }); });
    R.el("polyline", { points: bas.map(String).join(" "), fill: "none", stroke: C.z, "stroke-dasharray": "3 5", opacity: 0.6 }, g3);
    R.el("polyline", { points: cercle(cz.v).map(String).join(" "), fill: "none", stroke: C.z, "stroke-dasharray": "3 5", opacity: 0.6 }, g3);
    var O = [0, 0, 0], Pt = [q[0], q[1], cz.v], Q3 = [q[0], q[1], 0];
    R.fleche(g3, V.p(O), V.p([3.4, 0, 0]), { couleur: C.x, epaisseur: 2 });
    R.fleche(g3, V.p(O), V.p([0, 3.4, 0]), { couleur: C.y, epaisseur: 2 });
    R.fleche(g3, V.p(O), V.p([0, 0, 3]), { couleur: C.z, epaisseur: 2 });
    R.texte(g3, "X", V.p([3.7, 0, 0]), { couleur: C.x });
    R.texte(g3, "Y", V.p([0, 3.7, 0]), { couleur: C.y });
    R.texte(g3, "Z", V.p([0, 0, 3.3]), { couleur: C.z });
    R.ligne(g3, V.p(O), V.p(Q3), { couleur: C.z, epaisseur: 3 });
    R.ligne(g3, V.p(Q3), V.p(Pt), { couleur: C.gris, epaisseur: 2, tirets: "5 4" });
    R.ligne(g3, V.p([0, 0, cz.v]), V.p(Pt), { couleur: C.gris, epaisseur: 1, tirets: "2 4" });
    var arcPts = []; for (var i = 0; i <= 30; i++) { var t = c.theta * i / 30; arcPts.push(V.p([0.7 * Math.cos(t), 0.7 * Math.sin(t), 0])); }
    R.el("polyline", { points: arcPts.map(String).join(" "), fill: "none", stroke: C.acc, "stroke-width": 2.5 }, g3);
    R.point(g3, V.p(Q3), { couleur: C.v, r: 5 });
    R.point(g3, V.p(Pt), { couleur: C.acc, r: 7 });
    R.texte(g3, "P", m.add(V.p(Pt), [14, -12]), { couleur: C.acc, gras: true });
    R.texte(g3, "Q", m.add(V.p(Q3), [14, 10]), { couleur: C.v, gras: true });
    R.texte(g3, "z", m.add(V.p([q[0], q[1], cz.v / 2]), [16, 0]), { couleur: C.doux, gras: true });
    R.texte(g3, "r", m.add(V.p([q[0] / 2, q[1] / 2, 0]), [-8, 18]), { couleur: C.z, gras: true });
    R.texte(g3, "θ", V.p([1.05 * Math.cos(c.theta / 2), 1.05 * Math.sin(c.theta / 2), 0]), { couleur: C.acc, gras: true });

    var arct = q[0] !== 0 ? Math.atan(q[1] / q[0]) : NaN;
    R.rendre(zone,
      "\\text{cartésien : } (x, y, z) = (" + R.tn(q[0], 1) + ";\\ " + R.tn(q[1], 1) + ";\\ " + R.tn(cz.v, 1) + ")" +
      "\\\\[4pt] r = \\sqrt{x^2 + y^2} = " + R.tn(c.r, 3) + "\\qquad \\theta = \\operatorname{atan2}(y, x) = " + R.tn(c.theta / R.DEG, 1) + "° \\qquad z = " + R.tn(cz.v, 1) +
      "\\\\[4pt] \\text{retour : } r\\cos\\theta = " + R.tn(c.r * Math.cos(c.theta), 3) + ",\\quad r\\sin\\theta = " + R.tn(c.r * Math.sin(c.theta), 3));
    if (isNaN(arct)) alerte.innerHTML = '<span class="alerte">x = 0 : arctan(y/x) n\'est pas défini, atan2 donne ' + R.fmt(c.theta / R.DEG, 1) + "°.</span>";
    else if (Math.abs(arct - c.theta) > 1e-6) alerte.innerHTML = '<span class="alerte">arctan(y/x) = ' + R.fmt(arct / R.DEG, 1) + "° : mauvaise direction (décalage de 180°). atan2(y, x) = " + R.fmt(c.theta / R.DEG, 1) + "°.</span>";
    else alerte.textContent = "Ici arctan(y/x) = atan2(y, x) = " + R.fmt(c.theta / R.DEG, 1) + "° car x > 0.";
  }
  R.orbite(f.svgs[1], V, dessiner, tourne);
  dessiner();
})();
