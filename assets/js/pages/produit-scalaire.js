(function () {
  "use strict";
  var R = RM, C = R.C, m = R.m;

  /* ---------- Figure 1 : deux vecteurs déplaçables ---------- */
  (function () {
    var f = R.figure("fig-ps", {
      hauteur: 440,
      titre: "Produit scalaire de deux vecteurs déplaçables",
      essai: "<strong>Essaie</strong> : déplace les extrémités orange de \\(\\vec{a}\\) et de \\(\\vec{b}\\). " +
        "<strong>Observe</strong> : le segment vert est la projection de \\(\\vec{b}\\) sur la direction de \\(\\vec{a}\\). Quand les vecteurs deviennent perpendiculaires, la projection disparaît et le produit vaut 0 ; au-delà de 90°, il devient négatif."
    });
    var P = R.plan(230, 300, 62);
    var g = R.el("g", null, f.svg), gp = R.el("g", null, f.svg);
    var a = [3.5, 1], b = [1.5, 3];
    var zone = R.h("div", null, "", f.direct), verdict = R.h("p", null, "", f.direct);

    function borne(v) { return [Math.max(-3.4, Math.min(5.6, Math.round(v[0] * 10) / 10)), Math.max(-4.3, Math.min(2.6, Math.round(v[1] * 10) / 10))]; }

    function dessiner() {
      R.vider(g); R.vider(gp);
      for (var k = -3; k <= 5; k++) R.ligne(g, P.p([k, -4.4]), P.p([k, 2.8]), { couleur: C.trait, epaisseur: 1 });
      for (k = -4; k <= 2; k++) R.ligne(g, P.p([-3.5, k]), P.p([5.8, k]), { couleur: C.trait, epaisseur: 1 });
      R.fleche(g, P.p([-3.5, 0]), P.p([5.8, 0]), { couleur: C.gris, epaisseur: 1.2 });
      R.fleche(g, P.p([0, -4.4]), P.p([0, 2.9]), { couleur: C.gris, epaisseur: 1.2 });
      var na = m.norme(a), nb = m.norme(b), ps = m.dot(a, b);
      var ua = na > 1e-9 ? m.scale(a, 1 / na) : [1, 0];
      var t = ps / Math.max(na, 1e-9), pied = m.scale(ua, t);
      // droite support de a
      R.ligne(g, P.p(m.scale(ua, -6)), P.p(m.scale(ua, 7)), { couleur: C.gris, tirets: "2 5", epaisseur: 1 });
      R.ligne(g, P.p(b), P.p(pied), { couleur: C.gris, tirets: "5 4" });
      R.ligne(g, P.p([0, 0]), P.p(pied), { couleur: C.y, epaisseur: 8, opacite: 0.55 });
      var aa = Math.atan2(a[1], a[0]), ab = Math.atan2(b[1], b[0]), d = ab - aa;
      while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
      R.arc(g, P.p([0, 0]), 38, aa, aa + d, { couleur: C.fonce });
      R.texte(g, "θ", [P.p([0, 0])[0] + 56 * Math.cos(aa + d / 2), P.p([0, 0])[1] - 56 * Math.sin(aa + d / 2)], {});
      R.fleche(g, P.p([0, 0]), P.p(a), { couleur: C.v, epaisseur: 3 });
      R.fleche(g, P.p([0, 0]), P.p(b), { couleur: C.z, epaisseur: 3 });
      R.texte(g, "a", m.add(P.p(a), [16, -16]), { couleur: C.v, gras: true });
      R.texte(g, "b", m.add(P.p(b), [16, -16]), { couleur: C.z, gras: true });
      R.poignee(f.svg, gp, P.p(a), function (q) { a = borne(P.inv(q)); dessiner(); });
      R.poignee(f.svg, gp, P.p(b), function (q) { b = borne(P.inv(q)); dessiner(); });

      var th = Math.acos(Math.max(-1, Math.min(1, ps / Math.max(na * nb, 1e-9))));
      R.rendre(zone,
        "\\vec{a} = " + R.texVec(a, 1, C.v) + "\\quad \\vec{b} = " + R.texVec(b, 1, C.z) +
        "\\qquad \\vec{a} \\cdot \\vec{b} = " + R.tc(a[0], 1) + " \\times " + R.tc(b[0], 1) + " + (" + R.tc(a[1], 1) + ") \\times (" + R.tc(b[1], 1) + ") = \\mathbf{" + R.tn(ps, 2) + "}" +
        "\\\\[4pt] \\|\\vec{a}\\|\\,\\|\\vec{b}\\|\\cos\\theta = " + R.tn(na, 3) + " \\times " + R.tn(nb, 3) + " \\times \\cos(" + R.tn(th / R.DEG, 1) + "°) = " + R.tn(na * nb * Math.cos(th), 2) +
        "\\qquad \\text{projection de } \\vec{b} \\text{ sur } \\vec{a} : \\frac{\\vec{a} \\cdot \\vec{b}}{\\|\\vec{a}\\|} = " + R.tn(t, 2));
      var deg = th / R.DEG;
      verdict.innerHTML = Math.abs(deg - 90) < 0.5 ? '<span class="alerte">Angle droit : produit scalaire nul.</span>'
        : deg < 90 ? "Angle aigu (" + R.fmt(deg, 1) + "°) : produit scalaire positif." : "Angle obtus (" + R.fmt(deg, 1) + "°) : produit scalaire négatif.";
    }
    dessiner();
  })();

  /* ---------- Figure 2 : l'exercice des deux repères ---------- */
  (function () {
    var f = R.figure("fig-deux-reperes", {
      hauteur: 430,
      titre: "Deux repères R1 et R2 tournés d'un angle alpha",
      essai: "<strong>Essaie</strong> : choisis un produit avec les boutons, puis fais varier \\(\\alpha\\). " +
        "<strong>Observe</strong> : l'arc orange montre l'angle entre les deux axes choisis, et le produit vaut son cosinus. Compare \\(\\vec{y}_1 \\cdot \\vec{x}_2\\) et \\(\\vec{x}_1 \\cdot \\vec{y}_2\\) : même valeur absolue, signes opposés."
    });
    var P = R.plan(300, 250, 150);
    var g = R.el("g", null, f.svg);
    var al = R.curseur(f.reglages, { nom: "α", min: -90, max: 120, pas: 1, val: 30, unite: "°", surChange: dessiner });
    var bb = R.boutons(f.reglages);
    // [nom TeX, vecteur 1, vecteur 2, expression de l'angle, valeur symbolique]
    var produits = [
      ["\\vec{x}_1 \\cdot \\vec{x}_2", "x1", "x2", "\\alpha", "\\cos\\alpha"],
      ["\\vec{y}_1 \\cdot \\vec{y}_2", "y1", "y2", "\\alpha", "\\cos\\alpha"],
      ["\\vec{y}_1 \\cdot \\vec{x}_2", "y1", "x2", "\\tfrac{\\pi}{2} - \\alpha", "\\sin\\alpha"],
      ["\\vec{x}_1 \\cdot \\vec{y}_2", "x1", "y2", "\\tfrac{\\pi}{2} + \\alpha", "-\\sin\\alpha"],
      ["\\vec{x}_1 \\cdot \\vec{y}_1", "x1", "y1", "\\tfrac{\\pi}{2}", "0"],
      ["\\vec{z}_2 \\cdot \\vec{x}_1", "z", "x1", "\\tfrac{\\pi}{2}", "0"]
    ];
    var choisi = 0, btns = [];
    produits.forEach(function (pr, i) {
      var bt = R.bouton(bb, "", function () { choisi = i; btns.forEach(function (x, j) { x.classList.toggle("actif", j === i); }); dessiner(); });
      R.rendre(bt, pr[0], false);
      btns.push(bt);
    });
    btns[0].classList.add("actif");
    var zone = R.h("div", null, "", f.direct);

    function dessiner() {
      R.vider(g);
      var a = al.v * R.DEG;
      var dirs = { x1: 0, y1: Math.PI / 2, x2: a, y2: a + Math.PI / 2 };
      var vec = function (t) { return [Math.cos(t), Math.sin(t)]; };
      var pr = produits[choisi];
      var actif = function (n) { return n === pr[1] || n === pr[2]; };
      [["x1", C.z, "x", "1"], ["y1", C.z, "y", "1"], ["x2", C.v, "x", "2"], ["y2", C.v, "y", "2"]].forEach(function (d) {
        var on = actif(d[0]);
        R.fleche(g, P.p([0, 0]), P.p(vec(dirs[d[0]])), { couleur: d[1], epaisseur: on ? 4 : 2, opacite: on ? 1 : 0.35 });
        R.texte(g, d[2], P.p(m.scale(vec(dirs[d[0]]), 1.14)), { couleur: d[1], ind: d[3], opacite: on ? 1 : 0.45, gras: on });
      });
      var o = P.p([0, 0]);
      var zOn = actif("z");
      R.el("circle", { cx: o[0], cy: o[1], r: 9, fill: "#fff", stroke: zOn ? C.acc : C.fonce, "stroke-width": zOn ? 3 : 1.5 }, g);
      R.el("circle", { cx: o[0], cy: o[1], r: 2.5, fill: zOn ? C.acc : C.fonce }, g);
      R.texte(g, "z₁ = z₂ (vers vous)", [o[0] - 10, o[1] + 34], { italique: false, taille: 15, couleur: C.doux });
      var val, angle;
      if (pr[1] === "z") {
        angle = Math.PI / 2; val = 0;
        R.texte(g, "z₂ est perpendiculaire au plan : angle de 90°", [300, 405], { couleur: C.acc, italique: false, taille: 17 });
      } else {
        var t1 = dirs[pr[1]], t2 = dirs[pr[2]];
        R.arc(g, o, 62, t1, t2, { couleur: C.acc, epaisseur: 3 });
        var mid = (t1 + t2) / 2;
        angle = Math.abs(t2 - t1);
        val = Math.cos(t2 - t1);
        R.texte(g, R.fmt(angle / R.DEG, 0) + "°", [o[0] + 86 * Math.cos(mid), o[1] - 86 * Math.sin(mid)], { couleur: C.acc, italique: false, gras: true, taille: 17 });
      }
      R.rendre(zone, pr[0] + " = \\cos\\left(" + pr[3] + "\\right) = " + pr[4] + " = \\cos(" + R.tn(angle / R.DEG, 0) + "°) = \\mathbf{" + R.tn(val, 3) + "}" +
        "\\qquad \\cos\\alpha = " + R.tn(Math.cos(a), 3) + ",\\ \\sin\\alpha = " + R.tn(Math.sin(a), 3));
    }
    dessiner();
  })();

  /* ---------- Figure 3 : cercle trigonométrique ---------- */
  (function () {
    var f = R.figure("fig-cercle", {
      hauteur: 400,
      titre: "Cercle trigonométrique",
      essai: "<strong>Essaie</strong> : fais varier \\(\\alpha\\) de 0 à 180° puis vers les angles négatifs, et coche les angles associés. " +
        "<strong>Observe</strong> : le point violet (angle \\(\\tfrac{\\pi}{2} - \\alpha\\)) a pour abscisse \\(\\sin\\alpha\\), le point vert (angle \\(\\tfrac{\\pi}{2} + \\alpha\\)) a pour abscisse \\(-\\sin\\alpha\\)."
    });
    var P = R.plan(300, 205, 150);
    var g = R.el("g", null, f.svg);
    var al = R.curseur(f.reglages, { nom: "α", min: -180, max: 180, pas: 1, val: 30, unite: "°", surChange: dessiner });
    var bb = R.boutons(f.reglages);
    var assoc = R.bascule(bb, "Afficher π/2 − α et π/2 + α", false, dessiner);
    var zone = R.h("div", null, "", f.direct);

    function dessiner() {
      R.vider(g);
      var a = al.v * R.DEG, o = P.p([0, 0]);
      R.el("circle", { cx: o[0], cy: o[1], r: P.s, fill: "none", stroke: C.trait, "stroke-width": 2 }, g);
      R.fleche(g, P.p([-1.3, 0]), P.p([1.35, 0]), { couleur: C.gris, epaisseur: 1.2 });
      R.fleche(g, P.p([0, -1.3]), P.p([0, 1.3]), { couleur: C.gris, epaisseur: 1.2 });
      var q = [Math.cos(a), Math.sin(a)];
      R.ligne(g, P.p(q), P.p([q[0], 0]), { couleur: C.z, epaisseur: 3 });
      R.ligne(g, o, P.p([q[0], 0]), { couleur: C.x, epaisseur: 5, opacite: 0.7 });
      R.texte(g, "cos α", m.add(P.p([q[0] / 2, 0]), [0, q[1] >= 0 ? 18 : -18]), { couleur: C.x, italique: false, taille: 16 });
      R.texte(g, "sin α", m.add(P.p([q[0], q[1] / 2]), [q[0] >= 0 ? 34 : -34, 0]), { couleur: C.z, italique: false, taille: 16 });
      R.ligne(g, o, P.p(q), { couleur: C.fonce, epaisseur: 2 });
      R.arc(g, o, 30, 0, a, { couleur: C.fonce });
      R.point(g, P.p(q), { couleur: C.acc, r: 7 });
      var tex = "\\cos\\alpha = " + R.tn(q[0], 3) + "\\qquad \\sin\\alpha = " + R.tn(q[1], 3) + "\\qquad \\cos^2\\alpha + \\sin^2\\alpha = " + R.tn(q[0] * q[0] + q[1] * q[1], 3);
      if (assoc.checked) {
        var q1 = [Math.cos(Math.PI / 2 - a), Math.sin(Math.PI / 2 - a)], q2 = [Math.cos(Math.PI / 2 + a), Math.sin(Math.PI / 2 + a)];
        R.ligne(g, o, P.p(q1), { couleur: C.v, epaisseur: 2, tirets: "6 4" });
        R.point(g, P.p(q1), { couleur: C.v, r: 6 });
        R.ligne(g, P.p(q1), P.p([q1[0], 0]), { couleur: C.v, tirets: "3 3" });
        R.ligne(g, o, P.p(q2), { couleur: C.y, epaisseur: 2, tirets: "6 4" });
        R.point(g, P.p(q2), { couleur: C.y, r: 6 });
        R.ligne(g, P.p(q2), P.p([q2[0], 0]), { couleur: C.y, tirets: "3 3" });
        R.texte(g, "π/2 − α", m.add(P.p(q1), [0, -18]), { couleur: C.v, italique: false, taille: 15 });
        R.texte(g, "π/2 + α", m.add(P.p(q2), [0, -18]), { couleur: C.y, italique: false, taille: 15 });
        tex += "\\\\[4pt] \\cos\\left(\\tfrac{\\pi}{2} - \\alpha\\right) = " + R.tn(q1[0], 3) + " = \\sin\\alpha \\qquad \\cos\\left(\\tfrac{\\pi}{2} + \\alpha\\right) = " + R.tn(q2[0], 3) + " = -\\sin\\alpha";
      }
      R.rendre(zone, tex);
    }
    dessiner();
  })();
})();
