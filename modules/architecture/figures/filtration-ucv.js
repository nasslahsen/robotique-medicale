/* Figure : la centrale et ses étages de filtration, puis la salle conventionnelle ou avec flux unidirectionnel (UCV). */
(function () {
  "use strict";
  var R = RM, A = ARCHI, C = A.C;
  var f = R.figure("fig-filtration", {
    largeur: 960, hauteur: 540, titre: "Filtration et flux unidirectionnel",
    essai: "<strong>Essaie</strong> : active ou retire le filtre HEPA, puis passe en flux unidirectionnel. <strong>Observe</strong> : HEPA et UCV sont des options selon le risque, le type de chirurgie et le référentiel, pas une obligation pour toute salle."
  });
  var g = A.s("g", null, f.svg), ga = A.s("g", null, f.svg), u = 1;
  var b = R.boutons(f.reglages);
  var bH = R.bascule(b, "Filtre HEPA (selon l'application)", false, dessiner);
  var bU = R.bascule(b, "Flux unidirectionnel (UCV)", false, function () { dessiner(); A.animer(2400, function (x) { u = x; fleches(); }); });
  var zone = R.h("div", null, "", f.direct);
  function fleches() {
    A.vider(ga);
    var xs = bU.checked ? [520, 600, 680] : [420, 600, 780];
    xs.forEach(function (x) {
      var fin = bU.checked ? [x, 420] : [x + (x - 600) * 0.3, 380];
      if (u >= 1) A.fleche(ga, [x, 260], fin, { coul: C.acc, ep: 4 }); else A.souffle(ga, [x, 250], fin, u, { nb: 1, vitesse: bU.checked ? 3 : 2 });
    });
  }
  function dessiner() {
    A.vider(g);
    // gaine : air neuf → préfiltration → filtration fine → (HEPA) → salle
    A.s("rect", { x: 20, y: 40, width: 920, height: 110, rx: 10, fill: C.fond, stroke: C.encre, "stroke-width": 3 }, g);
    A.texte(g, "air neuf", [50, 25], { taille: 15, coul: C.doux, ancre: "start" });
    A.fleche(g, [30, 95], [100, 95], { coul: C.ok, ep: 5 });
    [["Préfiltration", true, 1], ["Filtration fine", true, 2], ["HEPA", bH.checked, 3]].forEach(function (e, i) {
      var x = 120 + i * 230;
      A.s("rect", { x: x, y: 52, width: 170, height: 86, rx: 8, fill: "#fff", stroke: e[1] ? C.acc : C.gris, "stroke-width": 3, "stroke-dasharray": e[1] ? null : "7 6" }, g);
      for (var k = 0; k < 9; k++) A.s("line", { x1: x + 14 + k * 18, y1: 58, x2: x + 14 + k * 18, y2: 132, stroke: e[1] ? C.acc : C.pale, "stroke-width": e[2] }, g);
      A.texte(g, e[0] + (e[1] ? "" : " (absent)"), [x + 85, 172], { taille: 16, coul: e[1] ? C.encre : C.gris });
    });
    A.fleche(g, [820, 95], [930, 95], { coul: C.acc, ep: 5 });
    A.chemin(g, [[900, 150], [900, 210], [800, 210]], { coul: C.acc, ep: 5 });
    // salle
    A.s("rect", { x: 340, y: 210, width: 520, height: 310, fill: "#fff", stroke: C.encre, "stroke-width": 4 }, g);
    if (bU.checked) A.s("rect", { x: 490, y: 230, width: 220, height: 220, fill: "#eaf1ff", stroke: C.acc, "stroke-width": 2, "stroke-dasharray": "6 5" }, g);
    A.s("rect", { x: 520, y: 440, width: 160, height: 16, fill: C.doux }, g); A.s("rect", { x: 590, y: 456, width: 20, height: 62, fill: C.doux }, g);
    A.texte(g, bU.checked ? "air très propre sur la zone opératoire" : "salle conventionnelle", [600, 494], { taille: 15, coul: C.doux });
    A.texte(g, "Dépend : du système CVC, du niveau de risque, du référentiel, du type de chirurgie", [170, 300], { taille: 15, largeur: 280, coul: C.doux });
    zone.innerHTML = (bH.checked ? "Avec HEPA : utile selon l'application. " : "Sans HEPA : possible pour une salle conventionnelle si la qualité d'air requise est obtenue avec une filtration appropriée (HIS 2026). ") + (bU.checked ? "UCV : pour certaines interventions à haut risque, comme certaines chirurgies orthopédiques avec implants ; pas une solution universelle." : "");
    fleches();
  }
  dessiner();
})();
