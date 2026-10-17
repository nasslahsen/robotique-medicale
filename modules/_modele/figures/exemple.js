/* MODÈLE de figure de page de cours : R.figure, une grille pleine, un curseur, une ligne de calcul en direct.
   Une figure par notion, nommée fig-<nom> dans la page. Voir CLAUDE.md. */
(function () {
  "use strict";
  var R = RM, C = R.C;
  var f = R.figure("fig-exemple", {
    largeur: 960, hauteur: 540,
    titre: "Un segment qui tourne",
    essai: "<strong>Essaie</strong> : fais varier l'angle. <strong>Observe</strong> : ce que la figure montre, en une phrase."
  });
  var P = R.plan(480, 300, 200);
  var g = R.el("g", null, f.svg);
  var ca = R.curseur(f.reglages, { nom: "angle", min: -180, max: 180, pas: 5, val: 30, unite: "°", surChange: dessiner });
  var zone = R.h("div", null, "", f.direct);

  function dessiner() {
    R.vider(g);
    R.grille(g, P, f.svg, { pas: 0.25, fort: 4 });
    var a = ca.v * R.DEG, p = [Math.cos(a), Math.sin(a)];
    R.arc(g, P.p([0, 0]), 50, 0, a, { couleur: C.acc, epaisseur: 3 });
    R.fleche(g, P.p([0, 0]), P.p(p), { couleur: C.v, epaisseur: 5 });
    R.texte(g, "u", R.m.add(P.p(p), [20, -16]), { couleur: C.v, gras: true, taille: 24 });
    R.rendre(zone, "\\vec{u} = (\\cos\\theta \\,;\\ \\sin\\theta) = (" + R.fmt(p[0], 3) + " \\,;\\ " + R.fmt(p[1], 3) + ")");
  }
  dessiner();
})();
