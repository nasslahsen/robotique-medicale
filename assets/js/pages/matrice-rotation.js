(function () {
  "use strict";
  var R = RM, C = R.C, m = R.m;

  var f = R.figure("fig-rot", {
    hauteur: 430,
    titre: "Rotation du repère R1 par rapport à R0 autour de z",
    essai: "<strong>Essaie</strong> : fais varier \\(\\alpha\\) de 0 à 90°. " +
      "<strong>Observe</strong> : la colonne 1 de la matrice (rouge) contient les longueurs des projections de \\(\\vec{x}_1\\) sur \\(\\vec{x}_0\\) et \\(\\vec{y}_0\\), la colonne 2 (verte) celles de \\(\\vec{y}_1\\). Le vecteur \\(\\vec{V}\\) tourne avec \\(R_1\\) : ses composantes \\(V^1\\) restent fixes, \\(V^0\\) change."
  });
  var P = R.plan(300, 250, 135);
  var g = R.el("g", null, f.svg);
  var ca = R.curseur(f.reglages, { nom: "α", min: -180, max: 180, pas: 1, val: 30, unite: "°", surChange: dessiner });
  var cvx = R.curseur(f.reglages, { nom: "V¹ sur x₁", min: -2, max: 2, pas: 0.1, val: 1.2, surChange: dessiner });
  var cvy = R.curseur(f.reglages, { nom: "V¹ sur y₁", min: -2, max: 2, pas: 0.1, val: 0.6, surChange: dessiner });
  var b = R.boutons(f.reglages);
  var proj = R.bascule(b, "Projections des axes", true, dessiner);
  var zone = R.h("div", null, "", f.direct), zoneP = R.h("div", null, "", f.direct);
  var ligne = 0;
  var et = R.etapes(f.reglages, 3, ["", "ligne 1 : composante sur x₀", "ligne 2 : composante sur y₀", "ligne 3 : composante sur z₀"], function (k) { ligne = k; dessiner(); });
  et.aller(0);
  var et0 = f.reglages.lastChild; et0.insertBefore(R.h("span", { "class": "etape-texte" }, "Détailler le produit :"), et0.firstChild);

  function dessiner() {
    if (!g) return;
    R.vider(g);
    var a = ca.v * R.DEG, Rz = m.Rz(a), x1 = [Rz[0][0], Rz[1][0]], y1 = [Rz[0][1], Rz[1][1]];
    var V1 = [cvx.v, cvy.v, 0], V0 = m.matVec(Rz, V1), s = 1.2;
    for (var k = -2; k <= 2; k++) {
      R.ligne(g, P.p([k / 1.5, -1.65]), P.p([k / 1.5, 1.6]), { couleur: C.trait, epaisseur: 1 });
      R.ligne(g, P.p([-2.1, k / 1.5]), P.p([2.1, k / 1.5]), { couleur: C.trait, epaisseur: 1 });
    }
    R.repere2D(g, P, [0, 0], [1, 0], [0, 1], { longueur: s, indice: "0", couleurX: C.gris, couleurY: C.gris, epaisseur: 1.8 });
    if (proj.checked) {
      var px = m.scale(x1, s), py = m.scale(y1, s);
      R.ligne(g, P.p(px), P.p([px[0], 0]), { couleur: C.x, tirets: "4 4" });
      R.ligne(g, P.p(px), P.p([0, px[1]]), { couleur: C.x, tirets: "4 4" });
      R.ligne(g, P.p([0, 0]), P.p([px[0], 0]), { couleur: C.x, epaisseur: 7, opacite: 0.35 });
      R.ligne(g, P.p([0, 0]), P.p([0, px[1]]), { couleur: C.x, epaisseur: 7, opacite: 0.35 });
      R.ligne(g, P.p(py), P.p([py[0], 0]), { couleur: C.y, tirets: "4 4" });
      R.ligne(g, P.p(py), P.p([0, py[1]]), { couleur: C.y, tirets: "4 4" });
      R.texte(g, "cos α", m.add(P.p([px[0] / 2, 0]), [0, 20]), { couleur: C.x, italique: false, taille: 15 });
      R.texte(g, "sin α", m.add(P.p([0, px[1] / 2]), [px[0] >= 0 ? -38 : 38, 0]), { couleur: C.x, italique: false, taille: 15 });
    }
    R.repere2D(g, P, [0, 0], x1, y1, { longueur: s, indice: "1", epaisseur: 3 });
    R.arc(g, P.p([0, 0]), 44, 0, a, { couleur: C.fonce });
    R.texte(g, "α", [P.p([0, 0])[0] + 58 * Math.cos(a / 2), P.p([0, 0])[1] - 58 * Math.sin(a / 2)], { gras: true });
    var v0s = m.scale([V0[0], V0[1]], 0.7);
    R.fleche(g, P.p([0, 0]), P.p(v0s), { couleur: C.v, epaisseur: 3.5 });
    R.texte(g, "V", m.add(P.p(v0s), [14, -14]), { couleur: C.v, gras: true });
    R.texte(g, "z₀ = z₁ vers vous", [92, 412], { italique: false, taille: 15, couleur: C.doux });

    var cols = [C.x, C.y, C.z];
    var cell = function (i, j, t) { return (ligne > 0 && i === ligne - 1) ? R.couleur(C.acc, "\\mathbf{" + t + "}") : R.couleur(cols[j], t); };
    R.rendre(zone, "R^{0,1} = R_z(\\alpha) = " + R.texMat(Rz, 3, { cellule: cell }) +
      "\\\\[8pt] V^0 = R^{0,1}\\,V^1 = " + R.texMat(Rz, 3, { cellule: cell }) + R.texVec(V1, 1) + " = " +
      R.texMat(V0.map(function (x) { return [x]; }), 3, { cellule: function (i, j, t) { return (ligne > 0 && i === ligne - 1) ? R.couleur(C.acc, "\\mathbf{" + t + "}") : R.couleur(C.v, t); } }));
    if (ligne > 0) {
      var i = ligne - 1, nm = ["x", "y", "z"][i];
      R.rendre(zoneP, "V^0_" + nm + " = " + Rz[i].map(function (r, j) { return "(" + R.tn(r, 3) + ") \\times (" + R.tn(V1[j], 1) + ")"; }).join(" + ") + " = " + R.tn(V0[i], 3));
      zoneP.style.display = "";
    } else zoneP.style.display = "none";
  }
  dessiner();
})();
