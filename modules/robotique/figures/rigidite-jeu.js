(function () {
  "use strict";
  var R = RM, C = R.C, M = window.MECA;

  /* ---------- Figure 1 : torsion d'un arbre d'axe ---------- */
  (function () {
    var f = R.figure("fig-torsion", {
      largeur: 960, hauteur: 420,
      titre: "Un arbre d'axe encastré, tordu par un couple",
      essai: "<strong>Essaie</strong> : augmente le couple, puis la rigidité. <strong>Observe</strong> : les génératrices s'inclinent d'autant plus que le couple est grand et que \\(k_\\theta\\) est petit ; l'angle est grossi 60 fois sur le dessin."
    });
    var g = R.el("g", null, f.svg);
    var cC = R.curseur(f.reglages, { nom: "C", min: 0, max: 40, pas: 1, val: 20, unite: " N·m", surChange: dessiner });
    var ck = R.curseur(f.reglages, { nom: "kθ", min: 500, max: 8000, pas: 100, val: 2000, unite: " N·m/rad", surChange: dessiner });
    var zone = R.h("div", null, "", f.direct);
    function dessiner() {
      R.vider(g);
      var x0 = 160, x1 = 700, yc = 210, r = 90, th = cC.v / ck.v, amp = 60;
      R.el("rect", { x: 90, y: yc - 150, width: 70, height: 300, fill: M.hachures(g, "#5b6172", { fond: "#fff" }), stroke: C.fonce, "stroke-width": 2 }, g);
      R.el("rect", { x: x0, y: yc - r, width: x1 - x0, height: 2 * r, fill: "#e8edf5", stroke: C.fonce, "stroke-width": 3 }, g);
      R.el("ellipse", { cx: x1, cy: yc, rx: 26, ry: r, fill: "#dfe3ea", stroke: C.fonce, "stroke-width": 3 }, g);
      [-0.8, -0.4, 0, 0.4, 0.8].forEach(function (s) {
        var a1 = Math.max(-1.5, Math.min(1.5, Math.asin(s) + th * amp));
        R.ligne(g, [x0, yc - r * s], [x1, yc - r * Math.sin(a1)], { couleur: C.acc, epaisseur: 3 });
      });
      if (cC.v > 0) {
        R.el("path", { d: "M" + (x1 + 80) + " " + (yc + 100) + " A 46 104 0 0 0 " + (x1 + 80) + " " + (yc - 100), fill: "none", stroke: C.z, "stroke-width": 5 }, g);
        R.fleche(g, [x1 + 82, yc - 92], [x1 + 72, yc - 104], { couleur: C.z, epaisseur: 5 });
      }
      R.texte(g, "C", [x1 + 150, yc], { couleur: C.z, taille: 28, gras: true });
      R.texte(g, "angle grossi 60 fois", [430, 385], { italique: false, couleur: C.doux, taille: 16 });
      R.rendre(zone, "\\theta = \\frac{C}{k_\\theta} = \\frac{" + cC.v + "}{" + ck.v + "} = " + R.tn(th * 1000, 2) + " \\times 10^{-3}\\ \\text{rad} = " + R.tn(th * 180 / Math.PI, 3) + "°");
    }
    dessiner();
  })();

  /* ---------- Figure 2 : jeu angulaire et déplacement en bout de bras ---------- */
  (function () {
    var f = R.figure("fig-jeu", {
      largeur: 960, hauteur: 300,
      titre: "Un petit jeu à l'axe, un grand écart au bout",
      essai: "<strong>Essaie</strong> : allonge le bras, puis augmente le jeu. <strong>Observe</strong> : \\(\\Delta x\\) est proportionnel à \\(L\\) et à \\(\\Delta\\theta\\) ; le jeu est grossi 40 fois sur le dessin. Le bouton « Exemple du cours » règle L = 0,40 m et Δθ = 0,20°."
    });
    var g = R.el("g", null, f.svg);
    var cL = R.curseur(f.reglages, { nom: "L", min: 0.1, max: 0.8, pas: 0.01, val: 0.4, unite: " m", surChange: dessiner });
    var cj = R.curseur(f.reglages, { nom: "Δθ", min: 0, max: 0.5, pas: 0.01, val: 0.2, unite: "°", dec: 2, surChange: dessiner });
    var b = R.boutons(f.reglages);
    R.bouton(b, "Exemple du cours", function () { cL.set(0.4); cj.set(0.2); dessiner(); });
    var zone = R.h("div", null, "", f.direct);
    function dessiner() {
      R.vider(g);
      var O = [90, 140], Lpx = cL.v * 900, a = cj.v * 40 * Math.PI / 180;
      R.el("circle", { cx: O[0], cy: O[1], r: 30, fill: "#fff", stroke: C.fonce, "stroke-width": 4 }, g);
      R.ligne(g, O, [O[0] + Lpx, O[1]], { couleur: "#c6cbd8", epaisseur: 24 });
      var b0 = [O[0] + Lpx * Math.cos(a / 2), O[1] - Lpx * Math.sin(a / 2)], b1 = [O[0] + Lpx * Math.cos(a / 2), O[1] + Lpx * Math.sin(a / 2)];
      R.ligne(g, O, b0, { couleur: C.fonce, epaisseur: 2.5, tirets: "10 8" }); R.ligne(g, O, b1, { couleur: C.fonce, epaisseur: 2.5, tirets: "10 8" });
      if (cj.v > 0) { R.ligne(g, [b0[0] + 24, b0[1]], [b1[0] + 24, b1[1]], { couleur: C.v, epaisseur: 4 }); R.texte(g, "Δx", [b0[0] + 50, O[1]], { couleur: C.v, taille: 24, ancre: "start" }); }
      R.el("circle", { cx: O[0], cy: O[1], r: 9, fill: C.fonce }, g);
      R.texte(g, "L", [O[0] + Lpx / 2, O[1] + 46], { couleur: C.doux, taille: 24 });
      var rad = cj.v * Math.PI / 180, dx = cL.v * rad * 1000;
      R.rendre(zone, "\\Delta\\theta = " + R.tn(cj.v, 2) + "\\,\\frac{\\pi}{180} = " + R.tn(rad * 1000, 2) + " \\times 10^{-3}\\ \\text{rad} \\qquad \\Delta x \\simeq L\\,\\Delta\\theta = " + R.tn(cL.v, 2) + " \\times " + R.tn(rad * 1000, 2) + " \\times 10^{-3} = " + R.tn(dx, 2) + "\\ \\text{mm}");
    }
    dessiner();
  })();

  /* ---------- Figure 3 : deux articulations, deux jeux ---------- */
  (function () {
    var f = R.figure("fig-deux-jeux", {
      largeur: 960, hauteur: 480,
      titre: "Bras à deux articulations : chaque jeu agit avec sa propre longueur",
      essai: "<strong>Essaie</strong> : donne un jeu à l'épaule, puis au coude. <strong>Observe</strong> : à jeu égal, celui de l'épaule déplace plus la pince, car la pince est plus loin de l'épaule. Les jeux sont grossis 15 fois."
    });
    var g = R.el("g", null, f.svg);
    var c1 = R.curseur(f.reglages, { nom: "Δθ₁ épaule", min: 0, max: 0.5, pas: 0.01, val: 0.2, unite: "°", dec: 2, surChange: dessiner });
    var c2 = R.curseur(f.reglages, { nom: "Δθ₂ coude", min: 0, max: 0.5, pas: 0.01, val: 0.2, unite: "°", dec: 2, surChange: dessiner });
    var zone = R.h("div", null, "", f.direct);
    function tourne(c, p, t) { var dx = p[0] - c[0], dy = p[1] - c[1]; return [c[0] + dx * Math.cos(t) + dy * Math.sin(t), c[1] - dx * Math.sin(t) + dy * Math.cos(t)]; }
    function dessiner() {
      R.vider(g);
      var O1 = [180, 420], O2 = [380, 160], P = [760, 160], px = 1000; // 1000 px par mètre
      var a1 = c1.v * 15 * Math.PI / 180, a2 = c2.v * 15 * Math.PI / 180;
      R.el("rect", { x: 120, y: 420, width: 120, height: 50, rx: 10, fill: "#5b6172" }, g);
      R.ligne(g, O1, O2, { couleur: "#c6cbd8", epaisseur: 30 }); R.ligne(g, O2, P, { couleur: "#c6cbd8", epaisseur: 24 });
      var O2b = tourne(O1, O2, a1), Pb = tourne(O1, P, a1), Pc = tourne(O2, P, -a2);
      if (a1 > 0) { R.ligne(g, O1, O2b, { couleur: C.v, epaisseur: 2.5, tirets: "8 6" }); R.ligne(g, O2b, Pb, { couleur: C.v, epaisseur: 2.5, tirets: "8 6" }); R.ligne(g, P, Pb, { couleur: C.v, epaisseur: 5 }); R.texte(g, "Δx₁", [P[0] + 40, Pb[1]], { couleur: C.v, taille: 22, ancre: "start" }); }
      if (a2 > 0) { R.ligne(g, O2, Pc, { couleur: C.z, epaisseur: 2.5, tirets: "8 6" }); R.ligne(g, P, Pc, { couleur: C.z, epaisseur: 5 }); R.texte(g, "Δx₂", [P[0] + 40, Pc[1]], { couleur: C.z, taille: 22, ancre: "start" }); }
      [O1, O2].forEach(function (p) { R.el("circle", { cx: p[0], cy: p[1], r: 20, fill: "#fff", stroke: C.fonce, "stroke-width": 4 }, g); });
      R.ligne(g, P, [P[0] + 30, P[1] - 18], { couleur: C.fonce, epaisseur: 7 }); R.ligne(g, P, [P[0] + 30, P[1] + 18], { couleur: C.fonce, epaisseur: 7 });
      R.ligne(g, O1, P, { couleur: C.v, epaisseur: 1.5, tirets: "3 6" });
      var L1 = Math.hypot(P[0] - O1[0], P[1] - O1[1]) / px, L2 = Math.hypot(P[0] - O2[0], P[1] - O2[1]) / px;
      R.texte(g, "L₁ = " + R.fmt(L1, 2) + " m", [470, 330], { couleur: C.v, taille: 18, italique: false });
      R.texte(g, "L₂ = " + R.fmt(L2, 2) + " m", [570, 130], { couleur: C.z, taille: 18, italique: false });
      var d1 = L1 * c1.v * Math.PI / 180 * 1000, d2 = L2 * c2.v * Math.PI / 180 * 1000;
      R.rendre(zone, "\\Delta x_1 \\simeq L_1\\,\\Delta\\theta_1 = " + R.tn(d1, 2) + "\\ \\text{mm} \\qquad \\Delta x_2 \\simeq L_2\\,\\Delta\\theta_2 = " + R.tn(d2, 2) + "\\ \\text{mm} \\qquad \\text{au pire : } " + R.tn(d1 + d2, 2) + "\\ \\text{mm}");
    }
    dessiner();
  })();
})();
