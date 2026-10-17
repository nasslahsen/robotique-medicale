(function () {
  "use strict";
  var R = RM, C = R.C, m = R.m;

  var f = R.figure("fig-homog", {
    hauteur: 450,
    titre: "Matrice homogène du solide S et point M",
    essai: "<strong>Essaie</strong> : déplace \\(O_s\\) et fais tourner le solide. Puis coche « Vu depuis le solide ». " +
      "<strong>Observe</strong> : la quatrième colonne (orange) suit la position de \\(O_s\\), les trois premières (rouge, vert, bleu) suivent l'orientation. Vu depuis le solide, c'est \\(R_0\\) qui semble bouger, et la scène est décrite par l'inverse \\(T^{s,0}\\)."
  });
  var P = R.plan(300, 225, 70);
  var g = R.el("g", null, f.svg), gp = R.el("g", null, f.svg);
  var b0 = R.boutons(f.reglages);
  R.bouton(b0, "Exemple de la page", function () { Os = [1, 2]; ca.set(90); cmx.set(0.5); cmy.set(0); dessiner(); });
  var ca = R.curseur(f.reglages, { nom: "α (rotation de S)", min: -180, max: 180, pas: 1, val: 30, unite: "°", surChange: dessiner });
  var cmx = R.curseur(f.reglages, { nom: "OₛM sur xₛ", min: -1, max: 2, pas: 0.1, val: 1.2, surChange: dessiner });
  var cmy = R.curseur(f.reglages, { nom: "OₛM sur yₛ", min: -1, max: 1.5, pas: 0.1, val: 0.4, surChange: dessiner });
  var b1 = R.boutons(f.reglages);
  var vecteur = R.bascule(b1, "4ᵉ coordonnée 0 (vecteur)", false, dessiner);
  var depuisS = R.bascule(b1, "Vu depuis le solide (inverse)", false, dessiner);
  var Os = [1.5, 0.8];
  var zone = R.h("div", null, "", f.direct);

  function dessiner() {
    R.vider(g); R.vider(gp);
    var a = ca.v * R.DEG, T = m.homog(m.Rz(a), [Os[0], Os[1], 0]), Ti = m.homogInv(T);
    var Ms = [cmx.v, cmy.v, 0];
    var M = m.appliquer(T, Ms);
    // vue : depuis R0 (identité) ou depuis Rs (on applique T^{s,0} à tout)
    var vue = depuisS.checked ? Ti : m.identite(4);
    var W = function (p3) { var q = m.appliquer(vue, p3); return P.p([q[0], q[1]]); };
    var dirW = function (d3) { var q = m.matVec(m.blocR(vue), d3); return q; };
    for (var i = -4; i <= 4; i++) { R.ligne(g, P.p([i, -3]), P.p([i, 3]), { couleur: C.trait, epaisseur: 1 }); }
    for (i = -3; i <= 3; i++) { R.ligne(g, P.p([-4.2, i]), P.p([4.2, i]), { couleur: C.trait, epaisseur: 1 }); }
    // repère R0
    var o0 = W([0, 0, 0]), x0 = dirW([1, 0, 0]), y0 = dirW([0, 1, 0]);
    R.fleche(g, o0, m.add(o0, [x0[0] * 70, -x0[1] * 70]), { couleur: C.gris, epaisseur: 2.5 });
    R.fleche(g, o0, m.add(o0, [y0[0] * 70, -y0[1] * 70]), { couleur: C.gris, epaisseur: 2.5 });
    R.texte(g, "x", m.add(o0, [x0[0] * 84, -x0[1] * 84]), { couleur: C.gris, ind: "0" });
    R.texte(g, "y", m.add(o0, [y0[0] * 84, -y0[1] * 84]), { couleur: C.gris, ind: "0" });
    R.texte(g, "O₀", m.add(o0, [-14, 18]), { taille: 17 });
    // repère Rs
    var os = W([Os[0], Os[1], 0]), xs = dirW([Math.cos(a), Math.sin(a), 0]), ys = dirW([-Math.sin(a), Math.cos(a), 0]);
    R.fleche(g, os, m.add(os, [xs[0] * 64, -xs[1] * 64]), { couleur: C.x, epaisseur: 3 });
    R.fleche(g, os, m.add(os, [ys[0] * 64, -ys[1] * 64]), { couleur: C.y, epaisseur: 3 });
    R.texte(g, "x", m.add(os, [xs[0] * 78, -xs[1] * 78]), { couleur: C.x, ind: "s" });
    R.texte(g, "y", m.add(os, [ys[0] * 78, -ys[1] * 78]), { couleur: C.y, ind: "s" });
    R.texte(g, "Oₛ", m.add(os, [-14, 20]), { taille: 17 });
    R.fleche(g, o0, os, { couleur: C.acc, epaisseur: 3 });
    var mp = W(M);
    R.fleche(g, os, mp, { couleur: C.v, epaisseur: 3 });
    R.point(g, mp, { couleur: C.v, r: 6 });
    R.texte(g, "M", m.add(mp, [14, -14]), { couleur: C.v, gras: true });
    if (!depuisS.checked) R.poignee(f.svg, gp, os, function (q) { var w = P.inv(q); Os = [Math.max(-3.5, Math.min(3.5, Math.round(w[0] * 10) / 10)), Math.max(-2.5, Math.min(2.5, Math.round(w[1] * 10) / 10))]; dessiner(); });
    R.texte(g, depuisS.checked ? "Vue depuis Rₛ : Rₛ est fixe, R₀ semble bouger" : "Vue depuis R₀", [300, 432], { italique: false, taille: 15, couleur: C.doux });

    var cols = [C.x, C.y, C.z, C.acc];
    var cellT = function (i, j, t) { return i === 3 ? R.couleur(C.gris, t) : R.couleur(cols[j], t); };
    var w4 = vecteur.checked ? 0 : 1;
    var res = m.matVec(T, Ms.concat([w4]));
    var tex = "T^{0,s} = " + R.texMat(T, 3, { cellule: cellT }) +
      "\\qquad T^{0,s}" + R.texVec(Ms.concat([w4]), 2) + " = " + R.texVec(res, 3, C.v);
    tex += vecteur.checked ? "\\\\[4pt] \\text{avec un 0, seule la rotation agit : } R^{0,s}\\,O_sM^s" : "\\\\[4pt] \\text{ligne 1 : } " + T[0].map(function (r, j) { return "(" + R.tn(r, 3) + ")(" + R.tn(Ms.concat([1])[j], 2) + ")"; }).join(" + ") + " = " + R.tn(res[0], 3);
    if (depuisS.checked) tex += "\\\\[8pt] T^{s,0} = (T^{0,s})^{-1} = " + R.texMat(Ti, 3, { cellule: cellT }) + "\\qquad T^{s,0}" + R.texVec(M.concat([1]), 3) + " = " + R.texVec(m.appliquer(Ti, M).concat([1]), 3, C.v);
    R.rendre(zone, tex);
  }
  dessiner();
})();
