/* Figure : salle vue de dessus avec ses prises de fluides ; toucher un fluide pour voir où il sert et ce qu'il faut prévoir. */
(function () {
  "use strict";
  var R = RM, A = ARCHI, C = A.C;
  var f = R.figure("fig-fluides", {
    largeur: 960, hauteur: 540, titre: "Les fluides et leurs prises",
    essai: "<strong>Essaie</strong> : touche un fluide à gauche, puis bascule entre « prises sur le bras » et « prises au mur ». <strong>Observe</strong> : placées loin, les prises imposent des tuyaux au sol. Couleurs choisies pour le schéma, pas celles d'une norme."
  });
  var g = A.s("g", null, f.svg), sel = 0;
  var b = R.boutons(f.reglages);
  var bMur = R.bascule(b, "Prises au mur, loin de la machine", false, dessiner);
  var zone = R.h("div", null, "", f.direct);
  var F = [["O₂", "#12a26b", "oxygéner le patient, par la machine d'anesthésie."], ["Air médical", "#e8a317", "ventiler le patient, mélangé à l'oxygène."], ["Vide médical", "#5b6172", "aspiration chirurgicale, aspiration anesthésique, certains drainages ; prévoir réseau, vannes, alarmes, source de secours, maintenance."], ["N₂O, parfois", "#3b5bdb", "selon la politique d'anesthésie."], ["Évacuation des gaz anesthésiques", "#b4233c", "limiter l'exposition professionnelle ; système, raccordements, débit, alarmes, maintenance."], ["Air instrumental, éventuellement", "#0f8a9d", "faire fonctionner certains instruments."]];
  function dessiner() {
    A.vider(g);
    F.forEach(function (fl, i) {
      var y = 14 + i * 86, on = sel === i;
      A.boite(g, 14, y, 250, 76, { fond: on ? A.C.jeuPale : "#fff", bord: on ? C.jeu : fl[1], ep: on ? 3.5 : 2.5, titre: fl[0], taille: 17 });
      A.cible(g, 14, y, 250, 76, function () { sel = i; dessiner(); });
    });
    A.s("rect", { x: 300, y: 14, width: 640, height: 510, fill: "#fff", stroke: C.encre, "stroke-width": 5 }, g);
    A.s("rect", { x: 580, y: 200, width: 80, height: 260, rx: 10, fill: "#d9dde6", stroke: C.encre, "stroke-width": 2.5 }, g);
    A.texte(g, "Table opératoire", [620, 480], { taille: 15 });
    A.boite(g, 550, 60, 140, 70, { fond: C.vPale, bord: C.v, titre: "Machine d'anesthésie", taille: 14 });
    var prise = bMur.checked ? [330, 470] : [760, 170];
    if (!bMur.checked) { A.s("circle", { cx: 760, cy: 170, r: 44, fill: "none", stroke: C.doux, "stroke-width": 3, "stroke-dasharray": "6 5" }, g); A.texte(g, "bras plafonnier", [760, 232], { taille: 14, coul: C.doux }); }
    else A.s("rect", { x: 304, y: 420, width: 30, height: 100, fill: C.fond, stroke: C.encre, "stroke-width": 2 }, g);
    F.forEach(function (fl, i) { A.s("circle", { cx: prise[0] + (i % 3) * 14 - 14, cy: prise[1] + Math.floor(i / 3) * 14 - 7, r: 6, fill: fl[1] }, g); });
    var col = F[sel][1];
    if (bMur.checked) {
      A.s("path", { d: "M340 470 C450 520 520 300 610 132", fill: "none", stroke: col, "stroke-width": 5 }, g);
      A.texte(g, "tuyau au sol", [440, 440], { taille: 15, coul: C.ko });
    } else A.s("path", { d: "M740 160 Q700 120 692 110", fill: "none", stroke: col, "stroke-width": 5 }, g);
    zone.innerHTML = "<strong>" + F[sel][0] + "</strong> : " + F[sel][2] + " Prises positionnées selon la table opératoire, la machine d'anesthésie, le bras plafonnier et les équipements spécialisés." + (bMur.checked ? " <span class=\"alerte\">Ici, la prise est trop loin : obstacle et risque de débranchement.</span>" : "");
  }
  dessiner();
})();
