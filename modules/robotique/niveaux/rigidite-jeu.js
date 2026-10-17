/* Niveau : rigidité torsionnelle et jeu angulaire. Δx ≃ L Δθ (Δθ en radians), kθ = C/θ, épaule contre coude. */
NIVEAU({
  id: "rigidite-jeu",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg), M = window.MECA;
    var n = { mode: "bras", deux: false, montrer: false, C: 0, k: 2000, AMP: 40 };

    function bras(O, Lpx, coul, ghost, ep) {
      var a = n.AMP * 0.2 * D.DEG; // jeu de 0,20° grossi 40 fois
      if (ghost) {
        [-a / 2, a / 2].forEach(function (t) { D.ligne(g, O, [O[0] + Lpx * Math.cos(t), O[1] - Lpx * Math.sin(t)], coul, ep, "10 8"); });
        var b0 = [O[0] + Lpx * Math.cos(-a / 2), O[1] - Lpx * Math.sin(-a / 2)], b1 = [O[0] + Lpx * Math.cos(a / 2), O[1] - Lpx * Math.sin(a / 2)];
        D.ligne(g, [b0[0] + 26, b0[1]], [b1[0] + 26, b1[1]], C.v, 4);
        D.ligne(g, [b0[0] + 18, b0[1]], [b0[0] + 34, b0[1]], C.v, 4); D.ligne(g, [b1[0] + 18, b1[1]], [b1[0] + 34, b1[1]], C.v, 4);
        return Math.abs(b0[1] - b1[1]);
      }
      D.ligne(g, O, [O[0] + Lpx, O[1]], coul, ep);
      return 0;
    }
    function torsion() {
      var x0 = 110, x1 = 520, yc = 300, r = 70, th = n.C / n.k, ampl = 60; // angle grossi 60 fois
      E.s("rect", { x: 50, y: yc - 120, width: 60, height: 240, fill: M.hachures(g, "#5b6172", { fond: "#fff" }), stroke: C.encre, "stroke-width": 2 }, g);
      E.s("rect", { x: x0, y: yc - r, width: x1 - x0, height: 2 * r, fill: "#e8edf5", stroke: C.encre, "stroke-width": 3 }, g);
      E.s("ellipse", { cx: x1, cy: yc, rx: 22, ry: r, fill: "#dfe3ea", stroke: C.encre, "stroke-width": 3 }, g);
      // génératrices : droites au repos, inclinées sous le couple
      [-0.8, -0.4, 0, 0.4, 0.8].forEach(function (s) {
        var a0 = Math.asin(s), a1 = a0 + th * ampl;
        var y1 = yc - r * Math.sin(Math.max(-1.5, Math.min(1.5, a1)));
        D.ligne(g, [x0, yc - r * s], [x1, y1], D.C.jeu, 3);
      });
      // repère sur la face : un rayon qui tourne de θ
      var t = Math.PI / 2 + th * ampl;
      D.ligne(g, [x1, yc], [x1 + 22 * Math.cos(t) * 0.3, yc - r * Math.sin(t)], C.encre, 4);
      if (n.C > 0.5) {
        E.s("path", { d: "M" + (x1 + 70) + " " + (yc + 80) + " A 40 90 0 0 0 " + (x1 + 70) + " " + (yc - 80), fill: "none", stroke: C.z, "stroke-width": 5 }, g);
        D.fleche(g, [x1 + 72, yc - 74], [x1 + 64, yc - 86], C.z, 5);
        D.texte(g, "C = " + E.fmt(n.C, 0) + " N·m", [x1 + 40, yc + 140], { taille: 22, coul: C.z, mono: true });
      }
      D.texte(g, "θ = " + E.fmt(th * 1000, 1) + " × 10⁻³ rad", [300, 120], { taille: 24, mono: true });
      D.texte(g, "angle grossi 60 fois", [300, 520], { taille: 16, coul: C.doux, gras: false });
    }
    function deuxArticulations() {
      var O1 = [130, 480], O2 = [300, 250], P = [540, 250], a = 8 * D.DEG;
      // jeu sur l'épaule (violet) puis sur le coude (bleu), grossis
      E.s("rect", { x: 80, y: 480, width: 100, height: 50, rx: 10, fill: "#5b6172" }, g);
      D.ligne(g, O1, O2, "#c6cbd8", 26); D.ligne(g, O2, P, "#c6cbd8", 22);
      function tourne(c, p, t) { var dx = p[0] - c[0], dy = p[1] - c[1]; return [c[0] + dx * Math.cos(t) + dy * Math.sin(t), c[1] - dx * Math.sin(t) + dy * Math.cos(t)]; }
      if (n.montrer) {
        var O2b = tourne(O1, O2, a), Pb = tourne(O1, P, a);
        D.ligne(g, O1, O2b, C.v, 3, "8 6"); D.ligne(g, O2b, Pb, C.v, 3, "8 6");
        var Pc = tourne(O2, P, -a);
        D.ligne(g, O2, Pc, C.z, 3, "8 6");
        D.ligne(g, P, Pb, C.v, 5); D.ligne(g, P, Pc, C.z, 5);
        D.texte(g, "Δx₁", [P[0] + 52, Pb[1] - 6], { coul: C.v, taille: 22, ancre: "start" });
        D.texte(g, "Δx₂", [P[0] + 52, Pc[1] + 8], { coul: C.z, taille: 22, ancre: "start" });
        D.texte(g, "Δθ₁", [O1[0] + 70, O1[1] - 40], { coul: C.v, taille: 20 });
        D.texte(g, "Δθ₂", [O2[0] + 70, O2[1] + 34], { coul: C.z, taille: 20 });
      }
      [O1, O2].forEach(function (p) { D.rond(g, p, 18, { fill: "#fff", stroke: C.encre, ep: 4 }); });
      D.ligne(g, P, [P[0] + 30, P[1] - 18], C.encre, 7); D.ligne(g, P, [P[0] + 30, P[1] + 18], C.encre, 7);
      D.texte(g, "épaule", [130, 555], { taille: 17, coul: C.doux, gras: false }); D.texte(g, "coude", [300, 205], { taille: 17, coul: C.doux, gras: false });
      if (n.montrer) D.texte(g, "jeux grossis", [470, 555], { taille: 16, coul: C.doux, gras: false });
    }

    n.dessin = function () {
      E.vider(g);
      if (n.mode === "bras") {
        var O = [70, n.deux ? 210 : 300], L1 = n.deux ? 240 : 460;
        D.rond(g, O, 26, { fill: "#fff", stroke: C.encre, ep: 4 });
        bras(O, L1, "#c6cbd8", false, 22);
        D.texte(g, "L", [O[0] + L1 / 2, O[1] - 34], { taille: 24, coul: C.doux });
        if (n.montrer) { bras(O, L1, C.encre, true, 3); D.texte(g, "Δx", [O[0] + L1 + 58, O[1]], { coul: C.v, taille: 24, ancre: "start" }); }
        D.rond(g, O, 9, { fill: C.encre });
        if (n.deux) {
          var O2 = [70, 420];
          D.rond(g, O2, 26, { fill: "#fff", stroke: C.encre, ep: 4 });
          bras(O2, 480, "#c6cbd8", false, 22);
          D.texte(g, "2L", [O2[0] + 240, O2[1] - 34], { taille: 24, coul: C.doux });
          if (n.montrer) { bras(O2, 480, C.encre, true, 3); D.texte(g, "2Δx", [O2[0] + 480 + 52, O2[1] - 62], { coul: C.v, taille: 24, ancre: "middle" }); }
          D.rond(g, O2, 9, { fill: C.encre });
        }
        D.texte(g, n.deux ? "même jeu Δθ dans les deux articulations (grossi)" : "jeu Δθ = 0,20° (grossi 40 fois)", [340, 570], { taille: 16, coul: C.doux, gras: false });
      } else if (n.mode === "torsion") torsion();
      else deuxArticulations();
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Prédire", jouer: function (j, n) {
      n.mode = "bras"; n.deux = true; n.montrer = false; n.dessin();
      j.fig.astuce("Deux bras, même articulation, même jeu.");
      j.titre("Les deux articulations ont le même petit jeu. Au bout du bras deux fois plus long, le déplacement est…");
      j.choix([{ html: "le même", aide: "Le jeu est un angle : plus on s'éloigne de l'axe, plus cet angle donne un grand arc." }, { html: "deux fois plus grand", juste: true }, { html: "quatre fois plus grand", aide: "Pour un petit angle, l'arc est proportionnel au rayon, pas à son carré." }], { colonnes: 3, ok: function () {
        n.montrer = true; n.dessin();
        j.bravo("Deux fois plus long, deux fois plus de déplacement.");
        j.expliquer("<p>Un petit jeu angulaire \\(\\Delta\\theta\\) dans l'articulation devient, au bout d'un bras de longueur \\(L\\), un déplacement linéaire :</p>\\[ \\Delta x \\simeq L\\,\\Delta\\theta, \\qquad \\Delta\\theta \\text{ en radians} \\]");
        j.suite();
      } });
    } },
    { nom: "Ordre de grandeur", jouer: function (j, n) {
      n.deux = false; n.montrer = true; n.dessin();
      j.fig.astuce("Bras de 0,40 m, jeu total de 0,20°.");
      j.titre("Bras de longueur \\(L = 0{,}40\\) m, jeu total \\(\\Delta\\theta = 0{,}20°\\). Convertis le jeu en radians, puis calcule \\(\\Delta x\\).");
      j.nombre({ avant: "\\Delta\\theta\\ (10^{-3}\\,\\text{rad}),\\ \\Delta x\\ (\\text{mm}) :", cases: [{ attendu: 0.2 * Math.PI / 180 * 1000, tol: 0.01 }, { attendu: 0.4 * 0.2 * Math.PI / 180 * 1000, tol: 0.01 }], ligne: true,
        aide: function (k) { return k === 0 ? "\\(\\Delta\\theta = 0{,}20 \\times \\pi / 180\\), puis multiplie par 1000 pour l'avoir en \\(10^{-3}\\) rad." : "\\(\\Delta x \\simeq L\\,\\Delta\\theta\\) en mètres, puis en millimètres."; },
        ok: function () {
          j.bravo("\\(\\Delta\\theta = 3{,}49 \\times 10^{-3}\\) rad et \\(\\Delta x \\simeq 1{,}40\\) mm.");
          j.expliquer("\\[ \\Delta\\theta = 0{,}20\\,\\frac{\\pi}{180} = 3{,}49 \\times 10^{-3}\\ \\text{rad} \\]\\[ \\Delta x \\simeq 0{,}40 \\times 3{,}49 \\times 10^{-3} = 1{,}40\\ \\text{mm} \\]<p>Même un faible jeu angulaire crée un déplacement mesurable en bout de bras.</p>");
          j.suite();
        } });
    } },
    { nom: "Torsion", jouer: function (j, n) {
      n.mode = "torsion"; n.C = 0; n.k = 2000; n.dessin();
      j.fig.astuce("Un arbre d'axe, encastré à gauche. Applique un couple à droite.");
      j.titre("Applique 20 N·m avec le curseur et lis l'angle de torsion. Quelle est la rigidité torsionnelle de cet axe ?");
      j.curseur({ nom: "C", min: 0, max: 40, pas: 1, val: 0, unite: " N·m", change: function (v) { n.C = v; n.dessin(); } });
      j.nombre({ avant: "k_\\theta =", apres: "\\text{N}\\cdot\\text{m/rad}", cases: [{ attendu: 2000, tol: 1 }], ligne: true,
        aide: function () { return "À 20 N·m, la figure donne \\(\\theta = 10 \\times 10^{-3}\\) rad. \\(k_\\theta = C / \\theta\\)."; },
        ok: function () {
          n.C = 20; n.dessin();
          j.bravo("\\(k_\\theta = 20 / 0{,}010 = 2000\\) N·m/rad.");
          j.expliquer("<p>Dans un axe asservi, la <b>rigidité torsionnelle</b> compte aussi :</p>\\[ k_\\theta = \\frac{C}{\\theta} \\]<p>\\(C\\) le couple appliqué (N·m), \\(\\theta\\) l'angle de torsion (rad). Plus \\(k_\\theta\\) est grand, moins l'axe se tord.</p>");
          j.suite();
        } });
    } },
    { nom: "De la torsion au bout du bras", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Cet axe (\\(k_\\theta = 2000\\) N·m/rad) porte un bras de 0,40 m. La charge crée un couple de 10 N·m. De combien le bout du bras descend-il ?");
      j.nombre({ avant: "\\Delta x =", apres: "\\text{mm}", cases: [{ attendu: 0.4 * 10 / 2000 * 1000, tol: 0.01 }], ligne: true,
        aide: function () { return "D'abord \\(\\theta = C / k_\\theta\\) en radians, puis \\(\\Delta x \\simeq L\\,\\theta\\)."; },
        ok: function () {
          n.C = 10; n.dessin();
          j.bravo("\\(\\theta = 0{,}005\\) rad, donc \\(\\Delta x \\simeq 0{,}40 \\times 0{,}005 = 2\\) mm.");
          j.expliquer("<p>Jeu et souplesse se traitent de la même façon : un petit angle à l'axe, multiplié par la longueur du bras. Ici la torsion (2 mm) pèse plus que le jeu de 0,20° (1,40 mm).</p>");
          j.suite();
        } });
    } },
    { nom: "Épaule ou coude ?", jouer: function (j, n) {
      n.mode = "deux"; n.montrer = false; n.dessin();
      j.fig.astuce("Un bras à deux articulations, comme sur la figure 3 du cours.");
      j.titre("L'épaule et le coude ont le même jeu \\(\\Delta\\theta\\). Lequel déplace le plus la pince ?");
      j.choix([{ html: "Le jeu de l'épaule", juste: true }, { html: "Le jeu du coude", aide: "Mesure la distance entre chaque articulation et la pince." }, { html: "Les deux pareil", aide: "Même angle, mais pas même distance jusqu'à la pince." }], { colonnes: 3, ok: function () {
        n.montrer = true; n.dessin();
        j.bravo("L'épaule est la plus loin de la pince.");
        j.expliquer("<p>Chaque jeu agit avec la distance entre son axe et la pince : \\(\\Delta x_1 \\simeq L_1\\,\\Delta\\theta_1\\) pour l'épaule, \\(\\Delta x_2 \\simeq L_2\\,\\Delta\\theta_2\\) pour le coude. Les articulations proches de la base demandent donc le moins de jeu et le plus de rigidité.</p>");
        j.suite();
      } });
    } }
  ]
});
