(function () {
  "use strict";
  var R = RM, C = R.C, m = R.m;

  var f = R.figure("fig-repere", {
    hauteur: 480,
    titre: "Repère 3D et coordonnées d'un point P",
    essai: "<strong>Essaie</strong> : déplace les curseurs x, y, z et regarde les pointillés : chaque coordonnée est la longueur de la projection de OP sur un axe. " +
      "<strong>Observe</strong> : la colonne \\([\\overrightarrow{OP}]_R\\) se remplit avec ces trois longueurs. Coche « Repère indirect » : l'axe z' pointe à l'opposé de \\(\\vec{x} \\times \\vec{y}\\)."
  });
  var V = R.vue3D(300, 300, 120, -50 * R.DEG, 24 * R.DEG);
  var g = R.el("g", null, f.svg);

  var cx = R.curseur(f.reglages, { nom: "x = q₁", min: -2, max: 2, pas: 0.1, val: 1.5, surChange: dessiner });
  var cy = R.curseur(f.reglages, { nom: "y = q₂", min: -2, max: 2, pas: 0.1, val: 1, surChange: dessiner });
  var cz = R.curseur(f.reglages, { nom: "z = q₃", min: -1.5, max: 2, pas: 0.1, val: 1.2, surChange: dessiner });
  var b = R.boutons(f.reglages);
  var indirect = R.bascule(b, "Repère indirect", false, dessiner);
  var second = R.bascule(b, "Second point P₂ et distance", false, dessiner);
  var tourne = R.basculeOrbite(b);
  var P2 = [-1, -1.5, 0.5];

  var zone = R.h("div", null, "", f.direct);
  var zoneD = R.h("div", null, "", f.direct);

  function dessiner() {
    R.vider(g);
    var p = [cx.v, cy.v, cz.v];
    // sol quadrillé
    R.polygone(g, [V.p([-2, -2, 0]), V.p([2, -2, 0]), V.p([2, 2, 0]), V.p([-2, 2, 0])], { remplissage: "#f6f7fa", couleur: "#d9dde6", epaisseur: 1.5 });
    for (var k = -2; k <= 2; k += 0.5) {
      R.ligne(g, V.p([k, -2, 0]), V.p([k, 2, 0]), { couleur: k % 1 === 0 ? "#d9dde6" : "#e9ecf2", epaisseur: 1 });
      R.ligne(g, V.p([-2, k, 0]), V.p([2, k, 0]), { couleur: k % 1 === 0 ? "#d9dde6" : "#e9ecf2", epaisseur: 1 });
    }
    var O = [0, 0, 0], L = 2.4;
    R.fleche(g, V.p(O), V.p([L, 0, 0]), { couleur: C.x, epaisseur: 3.5 });
    R.fleche(g, V.p(O), V.p([0, L, 0]), { couleur: C.y, epaisseur: 3.5 });
    if (indirect.checked) {
      R.fleche(g, V.p(O), V.p([0, 0, -1.6]), { couleur: C.z, tirets: "6 5" });
      R.texte(g, "z'", V.p([0.18, 0, -1.75]), { couleur: C.z });
      R.fleche(g, V.p(O), V.p([0, 0, L]), { couleur: C.gris, epaisseur: 1.5, opacite: 0.6 });
      R.texte(g, "x × y", V.p([0.35, 0, L + 0.15]), { couleur: C.gris, italique: false, taille: 16 });
    } else {
      R.fleche(g, V.p(O), V.p([0, 0, L]), { couleur: C.z, epaisseur: 3.5 });
      R.texte(g, "z", V.p([0.15, 0, L + 0.15]), { couleur: C.z, taille: 22 });
    }
    R.texte(g, "x", V.p([L + 0.2, 0, 0]), { couleur: C.x, taille: 22 });
    R.texte(g, "y", V.p([0, L + 0.2, 0]), { couleur: C.y, taille: 22 });
    R.texte(g, "O", R.m.add(V.p(O), [-14, 12]), { italique: true });

    // projections
    var q = [p[0], p[1], 0];
    R.ligne(g, V.p(p), V.p(q), { couleur: C.gris, tirets: "5 4" });
    R.ligne(g, V.p(q), V.p([p[0], 0, 0]), { couleur: C.gris, tirets: "5 4" });
    R.ligne(g, V.p(q), V.p([0, p[1], 0]), { couleur: C.gris, tirets: "5 4" });
    R.ligne(g, V.p(p), V.p([0, 0, p[2]]), { couleur: C.gris, tirets: "5 4" });
    R.ligne(g, V.p(O), V.p([p[0], 0, 0]), { couleur: C.x, epaisseur: 6, opacite: 0.45 });
    R.ligne(g, V.p(O), V.p([0, p[1], 0]), { couleur: C.y, epaisseur: 6, opacite: 0.45 });
    R.ligne(g, V.p(O), V.p([0, 0, p[2]]), { couleur: C.z, epaisseur: 6, opacite: 0.45 });
    R.texte(g, R.fmt(p[0], 1), R.m.add(V.p([p[0], 0, 0]), [0, 18]), { couleur: C.x, italique: false, taille: 16 });
    R.texte(g, R.fmt(p[1], 1), R.m.add(V.p([0, p[1], 0]), [14, 16]), { couleur: C.y, italique: false, taille: 16 });
    R.texte(g, R.fmt(p[2], 1), R.m.add(V.p([0, 0, p[2]]), [-26, 0]), { couleur: C.z, italique: false, taille: 16 });

    R.point(g, V.p(q), { couleur: C.gris, r: 4 });
    R.fleche(g, V.p(O), V.p(p), { couleur: C.v, epaisseur: 4 });
    R.point(g, V.p(p), { couleur: C.v, r: 8, contour: "#fff" });
    R.texte(g, "P", R.m.add(V.p(p), [16, -14]), { couleur: C.v, gras: true, taille: 22 });

    var tex = "\\left[\\overrightarrow{OP}\\right]_R = " + R.texVec(p, 1) +
      "\\qquad \\overrightarrow{OP} = " + R.couleur(C.x, R.tn(p[0], 1)) + "\\,\\vec{x} + " + R.couleur(C.y, R.tn(p[1], 1)) + "\\,\\vec{y} + " + R.couleur(C.z, R.tn(p[2], 1)) + "\\,\\vec{z}";
    tex += "\\qquad \\|\\overrightarrow{OP}\\| = " + R.tn(m.norme(p), 3);
    R.rendre(zone, tex);

    if (second.checked) {
      R.ligne(g, V.p(p), V.p(P2), { couleur: C.acc, epaisseur: 2.5 });
      R.point(g, V.p(P2), { couleur: C.acc, r: 6 });
      R.texte(g, "P₂", R.m.add(V.p(P2), [16, 12]), { couleur: C.acc, italique: true, gras: true });
      var d = m.norme(m.sub(P2, p));
      R.rendre(zoneD, "d(P, P_2) = \\sqrt{(" + R.tc(P2[0], 1) + " - " + "(" + R.tc(p[0], 1) + "))^2 + (" + R.tc(P2[1], 1) + " - (" + R.tc(p[1], 1) + "))^2 + (" + R.tc(P2[2], 1) + " - (" + R.tc(p[2], 1) + "))^2} = " + R.tn(d, 3));
      zoneD.style.display = "";
    } else {
      zoneD.style.display = "none";
    }
  }
  R.orbite(f.svg, V, dessiner, tourne);
  dessiner();
})();
