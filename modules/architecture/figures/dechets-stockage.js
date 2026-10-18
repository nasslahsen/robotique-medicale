/* Figure : cinq filières de tri ; toucher un objet puis voir son bac. */
(function () {
  "use strict";
  var R = RM, A = ARCHI, C = A.C;
  var f = R.figure("fig-dechets", {
    largeur: 960, hauteur: 540, titre: "Le tri à la source",
    essai: "<strong>Essaie</strong> : touche un objet en haut. <strong>Observe</strong> : son bac s'allume et la raison s'affiche. Les objets sont des exemples ajoutés ; les filières sont celles du cours."
  });
  var g = A.s("g", null, f.svg), sel = 0;
  var FIL = [["DASRI", "#e8a317"], ["Assimilables aux déchets ménagers", "#5b6172"], ["Objets piquants / coupants", "#8b3fd9"], ["Déchets anatomiques (selon réglementation)", "#e5484d"], ["Déchets chimiques éventuels", "#0f8a9d"]];
  var OBJ = [["Compresse imbibée de sang", 0, "contaminée par un liquide biologique : risque infectieux."], ["Emballage papier non souillé", 1, "aucun risque particulier : filière des déchets ordinaires."], ["Aiguille usagée", 2, "peut piquer et transmettre une infection : collecteur rigide."], ["Lame de bistouri", 2, "coupante : collecteur rigide."], ["Pièce opératoire d'amputation", 3, "partie du corps : filière anatomique, selon la réglementation."], ["Reste de fixateur chimique", 4, "produit chimique : filière dédiée."]];
  var zone = R.h("div", null, "", f.direct);
  function dessiner() {
    A.vider(g);
    OBJ.forEach(function (o, i) {
      var x = 20 + (i % 3) * 310, y = 16 + Math.floor(i / 3) * 76, on = sel === i;
      A.boite(g, x, y, 296, 64, { fond: on ? A.C.jeuPale : "#fff", bord: on ? C.jeu : C.encre, ep: on ? 3.5 : 2, rx: 12, titre: o[0], taille: 17 });
      A.cible(g, x, y, 296, 64, function () { sel = i; dessiner(); });
    });
    FIL.forEach(function (fl, k) {
      var x = 20 + k * 186, y = 210, w = 170, h = 230, on = OBJ[sel][1] === k;
      A.s("path", { d: "M" + (x + 14) + " " + (y + 40) + " H" + (x + w - 14) + " L" + (x + w - 26) + " " + (y + h) + " H" + (x + 26) + " Z", fill: on ? "#fff" : "#fafbfd", stroke: fl[1], "stroke-width": on ? 6 : 3, "stroke-linejoin": "round", opacity: on ? 1 : 0.6 }, g);
      A.s("rect", { x: x + 4, y: y + 18, width: w - 8, height: 22, rx: 7, fill: fl[1], opacity: on ? 1 : 0.6 }, g);
      A.texte(g, fl[0], [x + w / 2, y + 140], { taille: 16, largeur: w - 40, halo: false, coul: on ? C.encre : C.doux });
    });
    var bac = OBJ[sel][1];
    A.fleche(g, [20 + (sel % 3) * 310 + 148, 16 + Math.floor(sel / 3) * 76 + 66], [20 + bac * 186 + 85, 226], { coul: C.jeu, ep: 4 });
    A.texte(g, "Circuit : les déchets contaminés ne croisent pas les flux propres", [480, 500], { taille: 17, coul: C.sale });
    zone.innerHTML = "<strong>" + OBJ[sel][0] + "</strong> → " + FIL[bac][0] + " : " + OBJ[sel][2];
  }
  dessiner();
})();
