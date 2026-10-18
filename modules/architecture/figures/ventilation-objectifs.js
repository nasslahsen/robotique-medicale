/* Figure : la salle et les objectifs de la ventilation ; curseur d'humidité et ses conséquences. */
(function () {
  "use strict";
  var R = RM, A = ARCHI, C = A.C;
  var f = R.figure("fig-objectifs", {
    largeur: 960, hauteur: 540, titre: "Ce que la ventilation doit obtenir",
    essai: "<strong>Essaie</strong> : touche un objectif, puis fais varier l'humidité. <strong>Observe</strong> : hors de la plage du référentiel (figurée, sans valeur), condensation, développement microbiologique, dégradation des équipements et inconfort apparaissent."
  });
  var g = A.s("g", null, f.svg), sel = 0;
  var hum = R.curseur(f.reglages, { nom: "Humidité", min: 0, max: 100, pas: 1, val: 50, surChange: dessiner });
  var zone = R.h("div", null, "", f.direct);
  var O = [["Contrôler la contamination particulaire", "particules et germes émis dans la salle, emportés loin de la plaie"], ["Évacuer les gaz anesthésiques", "limiter ce que respire l'équipe"], ["Maintenir la température", "adaptée à l'intervention, au patient, aux équipements"], ["Contrôler l'humidité", "ni condensation, ni développement microbiologique, ni dégradation, ni inconfort"], ["Maintenir les gradients de pression", "l'air sort de la salle quand la porte s'ouvre"], ["Assurer le confort du personnel", "une équipe qui travaille des heures"], ["Contribuer à la prévention des infections", "le but commun des six autres"]];
  function dessiner() {
    A.vider(g);
    O.forEach(function (o, i) {
      var y = 14 + i * 74, on = sel === i;
      A.boite(g, 14, y, 340, 64, { fond: on ? A.C.jeuPale : "#fff", bord: on ? C.jeu : C.trait, ep: on ? 3 : 2, titre: o[0], taille: 16 });
      A.cible(g, 14, y, 340, 64, function () { sel = i; dessiner(); });
    });
    var h = hum.v, trop = h > 70, sec = h < 30;
    A.s("rect", { x: 390, y: 120, width: 550, height: 400, fill: "#fff", stroke: C.encre, "stroke-width": 5 }, g);
    A.s("rect", { x: 420, y: 50, width: 490, height: 20, rx: 10, fill: C.pale }, g);
    A.s("rect", { x: 420 + 490 * 0.3, y: 50, width: 490 * 0.4, height: 20, fill: C.okPale, stroke: C.ok, "stroke-width": 2 }, g);
    A.texte(g, "plage du référentiel", [665, 30], { taille: 14, coul: C.ok });
    A.s("circle", { cx: 420 + 4.9 * h, cy: 60, r: 13, fill: trop || sec ? C.ko : C.ok, stroke: "#fff", "stroke-width": 3 }, g);
    A.s("rect", { x: 590, y: 420, width: 150, height: 16, fill: C.doux }, g); A.s("rect", { x: 655, y: 436, width: 20, height: 80, fill: C.doux }, g);
    A.s("line", { x1: 480, y1: 126, x2: 850, y2: 126, stroke: C.acc, "stroke-width": 10 }, g);
    if (sel === 0 || sel === 6) for (var k = 0; k < 4; k++) A.fleche(g, [520 + k * 90, 140], [520 + k * 90, 360], { coul: C.acc, ep: 4 });
    if (sel === 4) A.fleche(g, [900, 300], [960, 300], { coul: C.ok, ep: 6 });
    if (sel === 1) A.fleche(g, [700, 400], [920, 480], { coul: "#b4233c", ep: 4, tirets: "8 6" });
    if (trop) {
      for (var i = 0, gr = 3; i < 26; i++) { gr = (gr * 9301 + 49297) % 233280; var px = gr / 233280; gr = (gr * 9301 + 49297) % 233280; A.s("ellipse", { cx: 400 + px * 530, cy: 140 + gr / 233280 * 120, rx: 4, ry: 6, fill: "#7fb2e5" }, g); }
      A.texte(g, "condensation", [665, 280], { taille: 18, coul: C.acc });
      A.texte(g, "développement microbiologique", [560, 490], { taille: 15, coul: "#5d7a46" });
      A.boite(g, 790, 380, 130, 70, { fond: C.koPale, bord: C.ko, rx: 8, titre: "équipement dégradé", taille: 14 });
    }
    if (trop || sec) A.texte(g, "inconfort", [850, 220], { taille: 18, coul: C.ko });
    zone.innerHTML = "<strong>" + O[sel][0] + "</strong> : " + O[sel][1] + ". " + (trop ? "<span class=\"alerte\">Air trop humide.</span>" : sec ? "<span class=\"alerte\">Air trop sec.</span>" : "Humidité dans la plage.");
  }
  dessiner();
})();
