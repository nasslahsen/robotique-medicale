/* Figures : la fiche d'un équipement et ce qu'elle impose à la salle ; accès de maintenance. */
(function () {
  "use strict";
  var R = RM, A = ARCHI, C = A.C;
  var f = R.figure("fig-equipement", {
    largeur: 960, hauteur: 540, titre: "Ce que la fiche d'un équipement impose à la salle",
    essai: "<strong>Essaie</strong> : touche chaque caractéristique de la fiche. <strong>Observe</strong> : chacune se traduit par une exigence pour la salle, le plafond, les réseaux ou la maintenance. Exemple ajouté : un robot chirurgical."
  });
  var g = A.s("g", null, f.svg), sel = 0;
  var F = [
    ["Dimensions", "la surface et les circulations autour de la table", "dim"], ["Poids", "le sol et parfois le plafond doivent le supporter", "poids"],
    ["Alimentation", "une prise et une puissance dédiées, secourues s'il est critique", "ali"], ["Dégagements", "un espace libre pour ses bras et pour l'équipe", "deg"],
    ["Besoins thermiques", "la chaleur qu'il rejette entre dans le calcul de la ventilation", "th"], ["Interfaces", "liaisons à la colonne vidéo, au réseau informatique", "int"],
    ["Contraintes de maintenance", "accès du technicien, démontage, passage des pièces de rechange", "mnt"]
  ];
  var zone = R.h("div", null, "", f.direct);
  function dessiner() {
    A.vider(g);
    A.boite(g, 14, 14, 300, 512, { fond: "#fff", bord: C.encre, ep: 3 });
    A.texte(g, "Fiche : robot chirurgical", [164, 44], { taille: 18, gras: 800, halo: false });
    F.forEach(function (fi, i) {
      var y = 72 + i * 64, on = sel === i;
      A.boite(g, 30, y, 268, 54, { fond: on ? A.C.jeuPale : C.fond, bord: on ? C.jeu : C.trait, ep: on ? 3 : 2, rx: 10, titre: fi[0], taille: 16 });
      A.cible(g, 30, y, 268, 54, function () { sel = i; dessiner(); });
    });
    // salle vue de dessus
    var k = F[sel][2];
    A.s("rect", { x: 340, y: 14, width: 606, height: 512, fill: k === "poids" ? "#eef2f7" : "#fff", stroke: k === "dim" ? C.jeu : C.encre, "stroke-width": k === "dim" ? 7 : 5 }, g);
    A.s("rect", { x: 610, y: 170, width: 70, height: 220, rx: 10, fill: "#d9dde6", stroke: C.encre, "stroke-width": 2.5 }, g);
    A.boite(g, 760, 230, 120, 110, { fond: C.vPale, bord: C.v, ep: 3, titre: "Robot", taille: 17 });
    if (k === "deg") A.s("circle", { cx: 760, cy: 285, r: 150, fill: "none", stroke: C.jeu, "stroke-width": 4, "stroke-dasharray": "10 7" }, g);
    if (k === "ali") { A.s("rect", { x: 930, y: 270, width: 14, height: 30, fill: C.ko }, g); A.s("path", { d: "M882 285 L930 285", stroke: C.ko, "stroke-width": 4 }, g); A.texte(g, "prise dédiée", [910, 320], { taille: 14, coul: C.ko, ancre: "end" }); }
    if (k === "th") for (var t = 0; t < 3; t++) A.s("path", { d: "M" + (790 + t * 30) + " 220 q-10 -20 0 -40 q10 -20 0 -40", fill: "none", stroke: "#e5484d", "stroke-width": 3 }, g);
    if (k === "int") { A.boite(g, 400, 40, 140, 70, { fond: "#fff", bord: C.acc, titre: "Colonne vidéo", taille: 15 }); A.s("path", { d: "M540 75 Q760 75 800 228", fill: "none", stroke: C.acc, "stroke-width": 4, "stroke-dasharray": "8 6" }, g); A.texte(g, "réseau", [700, 60], { taille: 14, coul: C.acc }); }
    if (k === "poids") A.texte(g, "sol et dalle dimensionnés pour la charge", [640, 470], { taille: 16, coul: C.encre });
    if (k === "mnt") { A.s("rect", { x: 896, y: 400, width: 44, height: 110, fill: "#fff", stroke: C.ok, "stroke-width": 3 }, g); A.texte(g, "porte technique assez large", [880, 380], { taille: 14, coul: C.ok, ancre: "end" }); A.icone(g, "cle", [840, 450], 40, C.ok); }
    if (k === "dim") A.texte(g, "surface et circulations", [640, 470], { taille: 16, coul: C.jeu });
    zone.innerHTML = "<strong>" + F[sel][0] + "</strong> : " + F[sel][1] + ". Toutes ces données forment le plan d'implantation biomédical.";
  }
  dessiner();
})();
