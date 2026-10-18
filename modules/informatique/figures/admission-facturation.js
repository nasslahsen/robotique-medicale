/* Figure : le circuit admission → facturation, étape par étape, avec ses risques. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-circuit", {
    largeur: 960, hauteur: 500, titre: "Circuit admission → facturation",
    essai: "<strong>Essaie</strong> : avance étape par étape. <strong>Observe</strong> : chaque étape a son risque ; l'erreur d'identité, elle, les traverse toutes."
  });
  var E = [
    ["Ouverture du séjour et mouvements", "admission", "unité, lit, transferts, mutations", "lit erroné, mouvement non saisi, statistiques erronées (rotation des lits, durée des séjours)"],
    ["Couverture sociale et droits", "admission", "vérification de l'AMO ou de la couverture, organisme payeur", "droits erronés, rejet du dossier, statistiques erronées"],
    ["Production des actes et du séjour", "hospitalier", "saisie ou remontée automatique des actes, consommables, DM facturables", "actes oubliés, sous-valorisation, statistiques erronées"],
    ["Sortie et clôture", "hospitalier", "compte rendu de sortie, date de sortie médicale et administrative", "actes exécutés après la sortie déclarée, discordance entre acte et CR"],
    ["Facturation et recouvrement", "facturation", "tarification, tiers payant, suivi des rejets", "rejets, impayés, délais"]
  ];
  var N = E.map(function (e, i) { return { t: e[0], sous: "service : " + e[1], x: 10 + i * 190, y: 60, w: 175, h: 120, taille: 16, tailleSous: 13 }; });
  A.etapesFig(f, N, E.map(function (e) { return "<strong>" + e[0] + "</strong>. Données et actions : " + e[2] + ". Risque : " + e[3] + "."; }), {
    fond: function (g, k) {
      A.s("rect", { x: 10, y: 400, width: 940, height: 50, rx: 12, fill: C.koPale, stroke: C.ko, "stroke-width": 2 }, g);
      A.texte(g, "Transverse : une erreur d'identité au départ se paie durant toutes les étapes", [480, 425], { taille: 16, gras: 700, coul: C.ko });
      for (var i = 0; i < k; i++) A.boite(g, 10 + i * 190, 210, 175, 160, { titre: "Risque", sous: E[i][3], taille: 15, tailleSous: 13, fond: C.fond, bord: C.trait, gras: 700 });
    }, depart: "Avance pour suivre le séjour, de l'admission à la facture."
  });
})();
