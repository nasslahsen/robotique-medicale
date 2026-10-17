(function () {
  "use strict";
  var R = RM, C = R.C, m = R.m;

  var f = R.figure("fig-homog", {
    largeur: 960, hauteur: 540,
    titre: "Matrice homogène du solide S et point M",
    essai: "<strong>Essaie</strong> : déplace \\(O_s\\) et fais tourner le solide. Puis coche « Vu depuis le solide ». " +
      "<strong>Observe</strong> : la quatrième colonne (orange) suit la position de \\(O_s\\), les trois premières (rouge, vert, bleu) suivent l'orientation. Vu depuis le solide, c'est \\(R_0\\) qui semble bouger, et la scène est décrite par l'inverse \\(T^{s,0}\\)."
  });
  var P = R.plan(400, 350, 125);
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
    R.grille(g, P, f.svg, { pas: 0.5, fort: 2, axes: false });
    // repère R0
    var o0 = W([0, 0, 0]), x0 = dirW([1, 0, 0]), y0 = dirW([0, 1, 0]);
    R.fleche(g, o0, m.add(o0, [x0[0] * 90, -x0[1] * 90]), { couleur: C.doux, epaisseur: 3 });
    R.fleche(g, o0, m.add(o0, [y0[0] * 90, -y0[1] * 90]), { couleur: C.doux, epaisseur: 3 });
    R.texte(g, "x", m.add(o0, [x0[0] * 108, -x0[1] * 108]), { couleur: C.doux, ind: "0" });
    R.texte(g, "y", m.add(o0, [y0[0] * 108, -y0[1] * 108]), { couleur: C.doux, ind: "0" });
    R.el("circle", { cx: o0[0], cy: o0[1], r: 7, fill: "#fff", stroke: C.fonce, "stroke-width": 2.5 }, g);
    R.texte(g, "O₀", m.add(o0, [-x0[0] * 24 - y0[0] * 24, x0[1] * 24 + y0[1] * 24]), { taille: 19 });
    // repère Rs
    var os = W([Os[0], Os[1], 0]), xs = dirW([Math.cos(a), Math.sin(a), 0]), ys = dirW([-Math.sin(a), Math.cos(a), 0]);
    R.fleche(g, o0, os, { couleur: C.acc, epaisseur: 4 });
    R.fleche(g, os, m.add(os, [xs[0] * 86, -xs[1] * 86]), { couleur: C.x, epaisseur: 3.5 });
    R.fleche(g, os, m.add(os, [ys[0] * 86, -ys[1] * 86]), { couleur: C.y, epaisseur: 3.5 });
    R.texte(g, "x", m.add(os, [xs[0] * 104, -xs[1] * 104]), { couleur: C.x, ind: "s" });
    R.texte(g, "y", m.add(os, [ys[0] * 104, -ys[1] * 104]), { couleur: C.y, ind: "s" });
    R.texte(g, "Oₛ", m.add(os, [-xs[0] * 26 - ys[0] * 26, xs[1] * 26 + ys[1] * 26]), { taille: 19 });
    var mp = W(M);
    R.fleche(g, os, mp, { couleur: C.v, epaisseur: 4 });
    R.point(g, mp, { couleur: C.v, r: 8, contour: "#fff" });
    R.texte(g, "M", m.add(mp, [18, -18]), { couleur: C.v, gras: true, taille: 22 });
    if (!depuisS.checked) R.poignee(f.svg, gp, os, function (q) { var w = P.inv(q); Os = [Math.max(-3.5, Math.min(3.5, Math.round(w[0] * 10) / 10)), Math.max(-2.5, Math.min(2.5, Math.round(w[1] * 10) / 10))]; dessiner(); });
    R.texte(g, depuisS.checked ? "Vue depuis Rₛ : Rₛ est fixe, R₀ semble bouger" : "Vue depuis R₀", [480, 520], { italique: false, taille: 17, couleur: C.doux });

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
