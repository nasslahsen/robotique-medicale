/* Figure : coupe d'une salle ; toucher le sol, un mur, le plafond ou la porte pour voir ses exigences et un défaut à éviter. */
(function () {
  "use strict";
  var R = RM, A = ARCHI, C = A.C;
  var f = R.figure("fig-surfaces", {
    largeur: 960, hauteur: 540, titre: "Les surfaces de la salle",
    essai: "<strong>Essaie</strong> : touche le plafond, un mur, le sol ou la porte, puis active « Montrer les défauts ». <strong>Observe</strong> : chaque défaut est un endroit où la saleté peut se cacher ou que l'on ne peut pas nettoyer."
  });
  var g = A.s("g", null, f.svg), sel = "sol";
  var b = R.boutons(f.reglages);
  var bD = R.bascule(b, "Montrer les défauts", false, dessiner);
  var zone = R.h("div", null, "", f.direct);
  var T = {
    plafond: ["Plafond", "étanche, nettoyable, résistant aux produits de désinfection, conçu pour éviter l'accumulation de poussières, compatible avec les équipements plafonniers ; ouvertures techniques intégrées et étanchées.", "défaut : une ouverture technique non étanchée au-dessus de la table."],
    mur: ["Murs", "lisses, lavables, résistants aux désinfectants, non poreux, sans fissures, faciles à entretenir.", "défauts : joint ouvert, surface poreuse, élément décoratif inutile, angle difficile à nettoyer."],
    sol: ["Sol", "résistant, antidérapant, imperméable, facilement nettoyable, compatible avec les désinfectants, résistant aux chocs, adapté au déplacement des équipements ; plinthes intégrées (FGI).", "défaut : un joint ouvert où les contaminants s'accumulent, un angle vif au pied du mur."],
    porte: ["Porte", "passage du brancard et des équipements, ouverture suffisamment large, nettoyage facile ; souvent automatique, coulissante, à commande sans contact ; fermeture automatique pour préserver la cascade de pression.", "défaut : une porte à poignée, calée ouverte."]
  };
  function dessiner() {
    A.vider(g);
    var d = bD.checked;
    // plafond, murs, sol
    A.s("rect", { x: 60, y: 40, width: 840, height: 46, fill: sel === "plafond" ? C.jeuPale : "#eef2f7", stroke: sel === "plafond" ? C.jeu : C.encre, "stroke-width": 3 }, g);
    A.texte(g, "Plafond", [140, 63], { taille: 17, halo: false });
    A.s("rect", { x: 60, y: 86, width: 40, height: 384, fill: sel === "mur" ? C.jeuPale : "#f4f6fa", stroke: sel === "mur" ? C.jeu : C.encre, "stroke-width": 3 }, g);
    A.s("rect", { x: 860, y: 86, width: 40, height: 384, fill: sel === "mur" ? C.jeuPale : "#f4f6fa", stroke: sel === "mur" ? C.jeu : C.encre, "stroke-width": 3 }, g);
    A.texte(g, "Mur", [80, 140], { taille: 15, halo: false }).setAttribute("transform", "rotate(-90 80 140)");
    A.s("rect", { x: 60, y: 470, width: 840, height: 40, fill: sel === "sol" ? C.jeuPale : "#dfe8f2", stroke: sel === "sol" ? C.jeu : C.encre, "stroke-width": 3 }, g);
    A.texte(g, "Sol", [140, 490], { taille: 17, halo: false });
    // plinthe intégrée en gorge
    A.s("path", { d: "M100 430 Q100 470 140 470", fill: "none", stroke: "#9fb4cc", "stroke-width": 9 }, g);
    // porte coulissante
    A.s("rect", { x: 860, y: 260, width: 40, height: 210, fill: sel === "porte" ? C.jeuPale : "#c9d3e6", stroke: sel === "porte" ? C.jeu : C.encre, "stroke-width": 3 }, g);
    A.texte(g, "Porte", [880, 240], { taille: 15 });
    // table et scialytique
    A.s("rect", { x: 380, y: 380, width: 200, height: 16, fill: C.doux }, g); A.s("rect", { x: 470, y: 396, width: 20, height: 74, fill: C.doux }, g);
    A.s("line", { x1: 480, y1: 86, x2: 480, y2: 170, stroke: C.encre, "stroke-width": 6 }, g);
    A.s("path", { d: "M430 192 A50 26 0 0 1 530 192 Z", fill: "#ffe9a8", stroke: C.encre, "stroke-width": 2.5 }, g);
    if (d) {
      A.s("rect", { x: 620, y: 40, width: 60, height: 46, fill: "#fff", stroke: C.ko, "stroke-width": 3, "stroke-dasharray": "5 4" }, g);
      for (var k = 0; k < 6; k++) A.s("circle", { cx: 635 + (k % 3) * 15, cy: 100 + Math.floor(k / 3) * 14, r: 3, fill: C.gris }, g);
      A.texte(g, "ouverture non étanchée", [650, 140], { taille: 14, coul: C.ko });
      A.s("rect", { x: 96, y: 200, width: 10, height: 60, fill: C.encre }, g); A.texte(g, "joint ouvert", [120, 230], { taille: 14, coul: C.ko, ancre: "start" });
      A.s("rect", { x: 240, y: 466, width: 12, height: 10, fill: C.encre }, g); A.texte(g, "joint de sol", [246, 450], { taille: 14, coul: C.ko });
      A.s("path", { d: "M860 470 L820 470 L860 430 Z", fill: "#c9ced8" }, g); A.texte(g, "angle vif", [800, 420], { taille: 14, coul: C.ko });
      A.s("circle", { cx: 852, cy: 360, r: 8, fill: C.encre }, g); A.texte(g, "poignée", [800, 360], { taille: 14, coul: C.ko, ancre: "end" });
    }
    [["plafond", 60, 40, 840, 46], ["mur", 60, 86, 40, 384], ["mur", 860, 86, 40, 170], ["sol", 60, 470, 840, 40], ["porte", 850, 256, 60, 214]].forEach(function (z) {
      A.cible(g, z[1], z[2], z[3], z[4], function () { sel = z[0]; dessiner(); });
    });
    zone.innerHTML = "<strong>" + T[sel][0] + "</strong> : " + T[sel][1] + (d ? " <span class=\"alerte\">" + T[sel][2] + "</span>" : "");
  }
  dessiner();
})();
