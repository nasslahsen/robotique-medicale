/* Figure : les huit familles de contraintes autour de l'hôpital ; toucher une famille montre ses contraintes et des risques du tableau de synthèse. */
(function () {
  "use strict";
  var R = RM, A = ARCHI, C = A.C;
  var f = R.figure("fig-familles", {
    largeur: 960, hauteur: 540, titre: "Les huit familles de contraintes",
    essai: "<strong>Essaie</strong> : touche une famille. <strong>Observe</strong> : ses principales contraintes, et ce que le tableau de synthèse dit du risque quand elles sont mal conçues."
  });
  var g = A.s("g", null, f.svg), sel = 2;
  // [famille, contraintes, lignes du tableau de synthèse qui s'y rattachent]
  var F = [
    ["Fonctionnel", "Organisation des activités", "Architecture : organisation fonctionnelle → dysfonctionnement"],
    ["Architectural", "Surfaces, volumes, circulations", "Ergonomie : circulation adaptée → fatigue / accidents"],
    ["Hygiène", "Séparation propre / sale", "Flux : séparation propre / sale → contamination ; sols / murs : surfaces lavables → contamination"],
    ["Technique", "Électricité, CVC, fluides médicaux", "Électricité : continuité + sécurité → arrêt équipement ; ventilation → infection ; gaz médicaux → risque patient"],
    ["Biomédical", "Installation et maintenance des équipements", "Biomédical : implantation adaptée → panne / maintenance difficile"],
    ["Sécurité", "Incendie, évacuation, risques techniques", "Incendie : compartimentage + évacuation → catastrophe"],
    ["Logistique", "Approvisionnement, déchets, linge", "Déchets : circuit maîtrisé → exposition"],
    ["Réglementaire", "Normes et prescriptions applicables", "Chaque domaine a ses normes : voir la page des normes, au chapitre 6"]
  ];
  var zone = R.h("div", null, "", f.direct);
  function dessiner() {
    A.vider(g);
    var c = [480, 270];
    A.s("circle", { cx: c[0], cy: c[1], r: 92, fill: A.C.jeuPale, stroke: C.jeu, "stroke-width": 4 }, g);
    A.texte(g, "Établissement hospitalier", c, { taille: 18, largeur: 150, halo: false, gras: 800 });
    F.forEach(function (fm, i) {
      var a = -Math.PI / 2 + i * Math.PI / 4, p = [c[0] + 330 * Math.cos(a), c[1] + 200 * Math.sin(a)], on = sel === i;
      A.s("line", { x1: c[0] + 92 * Math.cos(a), y1: c[1] + 92 * Math.sin(a), x2: p[0] - 60 * Math.cos(a), y2: p[1] - 30 * Math.sin(a), stroke: on ? C.jeu : C.trait, "stroke-width": on ? 4 : 2.5 }, g);
      A.boite(g, p[0] - 105, p[1] - 34, 210, 68, { fond: on ? C.jeu : "#fff", bord: on ? C.jeu : C.encre, ep: 2.5, titre: fm[0], taille: 19, coul: on ? "#fff" : C.encre });
      A.cible(g, p[0] - 105, p[1] - 34, 210, 68, function () { sel = i; dessiner(); });
    });
    zone.innerHTML = "<strong>" + F[sel][0] + "</strong> : " + F[sel][1] + ".<br>Tableau de synthèse : " + F[sel][2] + ".";
  }
  dessiner();
})();
