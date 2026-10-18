/* Figure : les grands composants d'un SIH, du poste de travail au tableau de bord. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-composants-sih", {
    largeur: 960, hauteur: 540, titre: "Les grands composants d'un SIH",
    essai: "<strong>Essaie</strong> : touche chaque composant. <strong>Observe</strong> : les modules du haut ne se parlent qu'à travers la plateforme d'intégration."
  });
  var it = [
    { x: 20, y: 30, w: 290, h: 110, t: "DPI", sous: "dossier médical, infirmier, prescriptions, comptes rendus...", texte: "saisie des données hospitalières du patient : CIM-10, diagnostics, paramètres médicaux, évolution de la prise en charge, pièces jointes." },
    { x: 335, y: 30, w: 290, h: 110, t: "Gestion médico-administrative", sous: "RDV, admission, séjour, facturation", texte: "RDV, admission, mouvements de séjour, cotation des actes et facturation (NGAP, NABM, TNR)." },
    { x: 650, y: 30, w: 290, h: 110, t: "Plateaux médico-techniques", sous: "biologie, radiologie, pharmacie, transfusion", texte: "gestion des processus de réalisation des prescriptions multimodales." },
    { x: 20, y: 205, w: 920, h: 80, t: "Plateforme d'intégration", sous: "messages HL7", coul: C.jeu, pale: C.jeuPale, texte: "transport des messages entre applications (HL7). Tous les échanges entre modules passent par elle." },
    { x: 20, y: 350, w: 290, h: 110, t: "Bases de données, SGBD", texte: "stockage des données." },
    { x: 335, y: 350, w: 290, h: 110, t: "Entrepôt de données", sous: "DataWareHouse", texte: "consolidation des données pour l'analyse et le pilotage, sans ralentir les outils des soignants." },
    { x: 650, y: 350, w: 290, h: 110, t: "Portail / BI", texte: "tableaux de bord et indicateurs pour la direction." }
  ];
  A.explorer(f, it, { taille: 19, fond: function (g) {
    [165, 480, 795].forEach(function (x) { A.fleche(g, [x, 142], [x, 203], { ep: 3, double: true, coul: C.doux }); });
    A.fleche(g, [165, 287], [165, 348], { ep: 3, double: true, coul: C.doux });
    A.fleche(g, [312, 405], [333, 405], { ep: 3, coul: C.doux }); A.fleche(g, [627, 405], [648, 405], { ep: 3, coul: C.doux });
    A.texte(g, "du soin à l'analyse", [480, 505], { taille: 16, coul: C.doux });
  } });
})();
