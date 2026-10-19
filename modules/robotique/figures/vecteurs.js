(function () {
  "use strict";
  var R = RM, C = R.C;

  /* ---------- Vecteurs : composantes, somme bout à bout, multiplication par un nombre ---------- */
  var f = R.figure("fig-vecteurs", {
    largeur: 760, hauteur: 560,
    titre: "Vecteurs u et v dans le plan, leur somme et k fois u",
    essai: "<strong>Essaie</strong> : déplace les bouts de \\(\\vec{u}\\) et de \\(\\vec{v}\\) sur le quadrillage. Coche « Somme », puis change k. " +
      "<strong>Observe</strong> : \\(\\vec{v}\\) est posé au bout de \\(\\vec{u}\\) ; la somme va du départ de l'un à l'arrivée de l'autre, composante par composante. Un k négatif retourne le vecteur."
  });
  var g = R.el("g", null, f.svg);
  var b = R.boutons(f.reglages);
  var somme = R.bascule(b, "Somme u + v", true, dessin);
  var ck = R.curseur(f.reglages, { nom: "k, pour k u", min: -3, max: 3, pas: 0.5, val: 1, dec: 1 });
  ck.surChange(dessin);
  var P = R.plan(300, 340, 74), u = [1, 2], v = [3, -1];
  function arrondir(w) { return [Math.max(-5, Math.min(6, Math.round(w[0]))), Math.max(-4, Math.min(4, Math.round(w[1])))]; }
  function nom(t, p, coul) { R.texte(g, t, p, { couleur: coul, taille: 22, gras: true }); }
  function dessin() {
    R.vider(g);
    R.grille(g, P, f.svg, { pas: 1 });
    var k = ck.v, ku = [k * u[0], k * u[1]], s = [u[0] + v[0], u[1] + v[1]];
    if (k !== 1) {
      R.fleche(g, P.p([0, 0]), P.p(ku), { couleur: C.v, epaisseur: 5, tete: 18 });
      nom("k u", R.m.add(P.p([ku[0] / 2, ku[1] / 2]), [-24, 18]), C.v);
    }
    if (somme.checked) {
      R.fleche(g, P.p([0, 0]), P.p(s), { couleur: C.y, epaisseur: 5, tete: 18, tirets: "10 6" });
      nom("u + v", R.m.add(P.p([s[0] / 2, s[1] / 2]), [26 * s[1] / Math.max(1, Math.hypot(s[0], s[1])) * 1.6, 26 * s[0] / Math.max(1, Math.hypot(s[0], s[1])) * 1.6]), C.y);
    }
    R.fleche(g, P.p([0, 0]), P.p(u), { couleur: C.z, epaisseur: 6, tete: 20 });
    R.fleche(g, P.p(u), P.p(s), { couleur: C.acc, epaisseur: 6, tete: 20 });
    nom("u", R.m.add(P.p([u[0] / 2, u[1] / 2]), [-20 * u[1] / Math.max(1, Math.hypot(u[0], u[1])) * 1.4, -20 * u[0] / Math.max(1, Math.hypot(u[0], u[1])) * 1.4]), C.z);
    nom("v", R.m.add(P.p([u[0] + v[0] / 2, u[1] + v[1] / 2]), [20, 4]), C.acc);
    R.texte(g, "O", R.m.add(P.p([0, 0]), [-16, 18]), { taille: 20 });
    R.poignee(f.svg, g, P.p(u), function (q) { u = arrondir(P.inv(q)); dessin(); }, { couleur: C.z, r: 10 });
    R.poignee(f.svg, g, P.p(s), function (q) { var w = arrondir(P.inv(q)); v = [w[0] - u[0], w[1] - u[1]]; dessin(); }, { couleur: C.acc, r: 10 });
    function t(w) { return "(" + R.tc(w[0], 1) + " \\,;\\ " + R.tc(w[1], 1) + ")"; }
    R.rendre(f.direct, "\\vec{u} = " + t(u) + " \\quad \\vec{v} = " + t(v) + " \\quad \\vec{u} + \\vec{v} = " + t(s) + " \\quad " + R.tc(k, 1) + "\\,\\vec{u} = " + t(ku));
  }
  dessin();
})();
