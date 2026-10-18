(function () {
  "use strict";
  var R = RM, C = R.C;

  /* ---------- Escalier du risque : les critères donnent la classe ---------- */
  (function () {
    var f = R.figure("fig-classes", {
      largeur: 960, hauteur: 460, titre: "Escalier des classes de risque",
      essai: "<strong>Essaie</strong> : change les réponses aux trois critères, puis coche la dernière question. <strong>Observe</strong> : le dispositif monte d'une marche quand il entre dans le corps, quand il y reste longtemps, et saute en classe III dès qu'il touche le cœur ou les systèmes centraux, a un effet biologique ou se dégrade."
    });
    var CL = ["I", "IIa", "IIb", "III"], RISQ = ["faible", "moyen", "élevé", "le plus élevé"];
    var EX = ["fauteuil roulant, bas de contention, pansement réutilisable, scalpel", "lentille de contact, échographe, agrafes cutanées, couronne dentaire, poche de sang", "implant chirurgical, matériel d'hémodialyse, pompe à perfusion", "stent, prothèse de hanche, administrateur de médicaments, dispositif biodégradable"];
    var b = R.boutons(f.reglages);
    var inv = R.choix(b, [["non", "Non invasif"], ["peau", "Au contact de la peau, courte durée"], ["oui", "Invasif"]], dessin);
    var duree = R.choix(b, [["courte", "Courte durée"], ["longue", "Usage prolongé"]], dessin);
    var b2 = R.boutons(f.reglages);
    var cent = R.bascule(b2, "Cœur, SCC ou SNC", false, dessin);
    var bio = R.bascule(b2, "Effet biologique ou biodégradable", false, dessin);
    var g = R.el("g", null, f.svg);
    function classe() {
      if (cent.checked || bio.checked) return 3;
      if (inv.value !== "oui") return 0;
      return duree.value === "courte" ? 1 : 2;
    }
    function dessin() {
      R.vider(g);
      duree.disabled = inv.value !== "oui";
      var k0 = classe();
      R.fleche(g, [60, 430], [900, 70], { couleur: "#e3e6ee", epaisseur: 6 });
      R.texte(g, "risque pour le patient, nombre de tests", [70, 50], { italique: false, couleur: C.doux, taille: 17, ancre: "start" });
      for (var k = 0; k < 4; k++) {
        var x = 90 + k * 200, h = 90 + k * 80, y = 430 - h, a = k === k0;
        R.el("rect", { x: x, y: y, width: 190, height: h, rx: 14, fill: a ? PLATEFORME.teinte(0.4) : PLATEFORME.teinte(0.06 + k * 0.06), stroke: a ? C.acc : "#c6cbd8", "stroke-width": a ? 4 : 2 }, g);
        R.texte(g, CL[k], [x + 95, y + 36], { italique: false, gras: true, taille: 32, halo: false });
        R.texte(g, RISQ[k], [x + 95, y + 70], { italique: false, couleur: C.doux, taille: 16, halo: false });
        for (var t = 0; t <= k; t++) R.el("circle", { cx: x + 26 + t * 26, cy: 410, r: 8, fill: C.y }, g);
        if (a) { R.el("circle", { cx: x + 95, cy: y - 34, r: 20, fill: C.acc, stroke: "#fff", "stroke-width": 4 }, g); R.texte(g, "DM", [x + 95, y - 33], { italique: false, gras: true, couleur: "#fff", taille: 13, halo: false }); }
      }
      f.direct.innerHTML = "<p>Classe <strong>" + CL[k0] + "</strong> (risque " + RISQ[k0] + ") : par exemple " + EX[k0] + "." + (k0 === 3 ? " Approbation préalable, évaluations précliniques et cliniques." : "") + " Pastilles vertes : plus de tests à chaque marche.</p>";
    }
    dessin();
  })();
})();
