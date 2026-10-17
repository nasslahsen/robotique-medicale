(function () {
  "use strict";
  var R = RM, C = R.C, m = R.m;

  var f = R.figure("fig-cr", {
    hauteur: 450,
    titre: "Calcul de O0M dans R0 en trois étapes",
    essai: "<strong>Essaie</strong> : clique sur « Exemple de la page », puis avance étape par étape. Fais ensuite varier \\(\\alpha\\) à l'étape 3. " +
      "<strong>Observe</strong> : l'étape 1 lit \\(M\\) dans \\(R_s\\) (pointillés verts), l'étape 2 relit le même vecteur dans \\(R_0\\) (pointillés bleus), l'étape 3 ajoute \\(O_0O_s\\). La ligne d'équation se complète à chaque étape."
  });
  var P = R.plan(80, 380, 95);
  var g = R.el("g", null, f.svg), gp = R.el("g", null, f.svg);
  var b0 = R.boutons(f.reglages);
  R.bouton(b0, "Exemple de la page", function () { Os = [1, 2]; ca.set(90); cmx.set(0.5); cmy.set(0); et.aller(0); });
  var ca = R.curseur(f.reglages, { nom: "α (R0 → Rs)", min: -180, max: 180, pas: 1, val: 35, unite: "°", surChange: dessiner });
  var cmx = R.curseur(f.reglages, { nom: "OₛM sur xₛ", min: -1, max: 2, pas: 0.1, val: 1.5, surChange: dessiner });
  var cmy = R.curseur(f.reglages, { nom: "OₛM sur yₛ", min: -1, max: 1.5, pas: 0.1, val: 0.5, surChange: dessiner });
  var b1 = R.boutons(f.reglages);
  var inverse = R.bascule(b1, "Sens inverse : Vˢ = (R⁰ˢ)ᵀ V⁰", false, dessiner);
  var Os = [2.2, 1.2], k = 0;
  var zone = R.h("div", null, "", f.direct), zoneI = R.h("div", null, "", f.direct);
  var et = R.etapes(f.reglages, 3, ["position de départ", "OₛM dans Rₛ", "traduction dans R₀ avec R⁰ˢ", "ajout de O₀Oₛ : relation (1.3)"], function (n) { k = n; dessiner(); });

  function dessiner() {
    if (!et) return;
    R.vider(g); R.vider(gp);
    var a = ca.v * R.DEG, Rz = m.Rz(a), Ms = [cmx.v, cmy.v, 0], Mr = m.matVec(Rz, Ms), M = m.add([Os[0], Os[1], 0], Mr);
    var ex = [Rz[0][0], Rz[1][0]], ey = [Rz[0][1], Rz[1][1]];
    for (var i = 0; i <= 5; i++) R.ligne(g, P.p([i, 0]), P.p([i, 3.8]), { couleur: C.trait, epaisseur: 1 });
    for (i = 0; i <= 3; i++) R.ligne(g, P.p([0, i]), P.p([5.4, i]), { couleur: C.trait, epaisseur: 1 });
    R.repere2D(g, P, [0, 0], [1, 0], [0, 1], { longueur: 0.9, indice: "0", couleurX: C.z, couleurY: C.z });
    R.texte(g, "O₀", m.add(P.p([0, 0]), [-6, 22]), { taille: 18 });
    R.repere2D(g, P, Os, ex, ey, { longueur: 0.8, indice: "s", epaisseur: 2.2 });
    R.texte(g, "Oₛ", m.add(P.p(Os), [-16, 20]), { taille: 18 });
    var Mp = [M[0], M[1]];
    if (k >= 1) {
      var a1 = m.add(Os, m.scale(ex, Ms[0]));
      R.ligne(g, P.p(Os), P.p(a1), { couleur: C.y, epaisseur: 5, opacite: 0.45 });
      R.ligne(g, P.p(a1), P.p(Mp), { couleur: C.y, epaisseur: 5, opacite: 0.45 });
      R.texte(g, R.fmt(Ms[0], 1) + " xₛ", m.add(P.p(m.add(Os, m.scale(ex, Ms[0] / 2))), [0, 22]), { couleur: C.y, italique: false, taille: 15, fond: true });
    }
    if (k >= 2) {
      var b1p = m.add(Os, [Mr[0], 0]);
      R.ligne(g, P.p(Os), P.p(b1p), { couleur: C.z, epaisseur: 2, tirets: "6 4" });
      R.ligne(g, P.p(b1p), P.p(Mp), { couleur: C.z, epaisseur: 2, tirets: "6 4" });
      R.texte(g, R.fmt(Mr[0], 2), m.add(P.p(m.add(Os, [Mr[0] / 2, 0])), [0, -14]), { couleur: C.z, italique: false, taille: 15, fond: true });
      R.texte(g, R.fmt(Mr[1], 2), m.add(P.p(m.add(b1p, [0, Mr[1] / 2])), [30, 0]), { couleur: C.z, italique: false, taille: 15, fond: true });
    }
    R.fleche(g, P.p(Os), P.p(Mp), { couleur: C.v, epaisseur: 3.5 });
    if (k >= 3) {
      R.fleche(g, P.p([0, 0]), P.p(Os), { couleur: C.acc, epaisseur: 3.5 });
      R.fleche(g, P.p([0, 0]), P.p(Mp), { couleur: C.fonce, epaisseur: 2.5, tirets: "8 5" });
    }
    R.point(g, P.p(Mp), { couleur: C.v, r: 6 });
    R.texte(g, "M", m.add(P.p(Mp), [14, -14]), { couleur: C.v, gras: true });
    R.poignee(f.svg, gp, P.p(Os), function (q) { var w = P.inv(q); Os = [Math.max(0.8, Math.min(4.2, Math.round(w[0] * 10) / 10)), Math.max(0.6, Math.min(2.8, Math.round(w[1] * 10) / 10))]; dessiner(); });

    var O0Os = [Os[0], Os[1], 0], Rs = R.texMat(Rz, 3, { couleursCol: [C.x, C.y, C.z] });
    var etapesTex = [
      "\\text{On connaît } O_sM^s,\\ R^{0,s} \\text{ et } O_0O_s^0. \\text{ On cherche } O_0M^0.",
      "O_sM^s = " + R.texVec(Ms, 2, C.y),
      "R^{0,s}\\,O_sM^s = " + Rs + R.texVec(Ms, 2, C.y) + " = " + R.texVec(Mr, 3, C.z),
      "O_0M^0 = O_0O_s^0 + R^{0,s}\\,O_sM^s = " + R.texVec(O0Os, 2, C.acc) + " + " + R.texVec(Mr, 3, C.z) + " = " + R.texVec(M, 3)
    ];
    R.rendre(zone, etapesTex.slice(0, k + 1).join("\\\\[8pt]"));
    if (inverse.checked) {
      var V0 = Mr, Vs = m.matVec(m.transpose(Rz), V0);
      R.rendre(zoneI, "V^s = (R^{0,s})^T\\,V^0 = " + R.texMat(m.transpose(Rz), 3) + R.texVec(V0, 3, C.z) + " = " + R.texVec(Vs, 3, C.y) + "\\quad \\text{(on retrouve } O_sM^s\\text{)}");
      zoneI.style.display = "";
    } else zoneI.style.display = "none";
  }
  et.aller(0);
})();
