/* Figure : le schéma fonctionnel de la partie V du TD, construit couche par couche. */
(function () {
  "use strict";
  var R = RM, A = ARCHI, C = A.C, Z = A.ZONES;
  var f = R.figure("fig-td", {
    largeur: 960, hauteur: 540, titre: "Schéma fonctionnel d'un bloc de taille moyenne",
    essai: "<strong>Essaie</strong> : avance couche par couche. <strong>Observe</strong> : zones, puis flux, puis équipements de la salle, puis besoins techniques : c'est le contenu demandé par la partie V. Plan d'exemple ajouté."
  });
  var g = A.s("g", null, f.svg);
  var noms = ["", "zones", "flux", "salle équipée", "besoins techniques", "validation"];
  function dessiner(k) {
    A.vider(g);
    var P = [["Accueil", 20, 20, 180, 90, "publique"], ["Vestiaires", 220, 20, 160, 90, null], ["Préparation", 400, 20, 180, 90, "semi"], ["Réception / stockage", 600, 20, 160, 90, "semi"], ["Stérilisation", 780, 20, 160, 90, null],
      ["Couloir du bloc", 20, 130, 920, 60, "semi"], ["Salle d'opération 1", 20, 210, 300, 210, "restreinte"], ["Salle d'opération 2", 340, 210, 300, 210, "restreinte"], ["SSPI", 660, 210, 140, 210, "semi"], ["Réanimation", 820, 210, 120, 210, null], ["Circuit sale", 20, 440, 920, 60, "sale"]];
    P.forEach(function (p) {
      var st = k >= 1 && p[5] && p[5] !== "sale" ? Z[p[5]] : null, sale = p[5] === "sale";
      A.boite(g, p[1], p[2], p[3], p[4], { fond: sale && k >= 1 ? "#fbeee6" : st ? st.fond : "#fff", bord: sale && k >= 1 ? C.sale : st ? st.bord : C.encre, ep: 2.5, rx: 6, titre: p[0], taille: 16 });
    });
    if (k >= 2) {
      A.chemin(g, [[490, 112], [490, 140], [170, 140], [170, 208]], { coul: C.patient, ep: 4 });
      A.chemin(g, [[320, 340], [660, 340]], { coul: C.patient, ep: 4 });
      A.fleche(g, [800, 300], [820, 300], { coul: C.patient, ep: 4 });
      A.chemin(g, [[300, 112], [300, 160], [500, 160], [500, 208]], { coul: C.personnel, ep: 4 });
      A.chemin(g, [[680, 112], [680, 172], [600, 172], [600, 208]], { coul: C.propre, ep: 4 });
      A.chemin(g, [[170, 422], [170, 438]], { coul: C.sale, ep: 4 }); A.chemin(g, [[490, 422], [490, 438]], { coul: C.sale, ep: 4 });
      A.chemin(g, [[900, 440], [900, 112]], { coul: C.dm, ep: 4, tirets: "8 6" });
    }
    if (k >= 3) {
      A.s("rect", { x: 140, y: 270, width: 50, height: 120, rx: 6, fill: "#d9dde6", stroke: C.encre, "stroke-width": 2 }, g);
      A.boite(g, 40, 236, 80, 40, { fond: C.vPale, bord: C.v, rx: 6, ep: 2, titre: "Anesth.", taille: 12 });
      A.s("circle", { cx: 250, cy: 260, r: 22, fill: "none", stroke: C.doux, "stroke-width": 2.5, "stroke-dasharray": "5 4" }, g);
      A.icone(g, "lampe", [165, 245], 30, C.doux);
    }
    if (k >= 4) {
      [["air", 470, 250, C.acc], ["eclair", 520, 250, C.ko], ["goutte", 570, 250, C.ok], ["reseau", 470, 300, C.v], ["feu", 520, 300, "#d9730d"], ["bouclier", 570, 300, C.encre]].forEach(function (i) { A.icone(g, i[0], [i[1], i[2]], 34, i[3]); });
      A.texte(g, "ventilation, électricité secourue, fluides, informatique, incendie, équipotentialité", [490, 380], { taille: 13, largeur: 280, coul: C.doux });
    }
    if (k >= 5) A.boite(g, 660, 380, 280, 50, { fond: C.okPale, bord: C.ok, rx: 8, titre: "Check-list de validation et maintenance préventive", taille: 13 });
  }
  var e = R.etapes(f.reglages, 5, noms, dessiner);
  e.aller(5);
})();
