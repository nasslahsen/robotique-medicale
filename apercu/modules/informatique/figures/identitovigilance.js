/* Figure : organisation de l'identitovigilance, des instances aux acteurs de terrain, et ses indicateurs. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-orga", {
    largeur: 960, hauteur: 540, titre: "Organisation de l'identitovigilance",
    essai: "<strong>Essaie</strong> : touche chaque acteur, puis chaque indicateur. <strong>Observe</strong> : la politique descend, les anomalies remontent."
  });
  var items = [
    { x: 20, y: 20, w: 400, h: 90, t: "Comité d'identitovigilance", sous: "gouvernance et politique", coul: C.v, pale: C.vPale, texte: "direction, représentant médical, qualité, DIM, soins, DSI. Il fixe la politique d'identification, valide procédures et moyens, examine le bilan annuel des incidents." },
    { x: 20, y: 145, w: 400, h: 90, t: "Cellule d'identitovigilance", sous: "référent et gestionnaires", coul: C.v, pale: C.vPale, texte: "référent, gestionnaires, médecin, cadre de santé, DSI, risques. Elle traite doublons et collisions, valide les fusions de dossiers, forme, audite, suit les indicateurs." },
    { x: 20, y: 290, w: 260, h: 100, t: "Accueil et admissions", sous: "premier point de contact", coul: C.ok, pale: C.okPale, texte: "demander et contrôler une pièce d'identité ; rechercher avant de créer un dossier ; attribuer le statut d'identité." },
    { x: 300, y: 290, w: 260, h: 100, t: "Services cliniques", sous: "soins, labo, imagerie, bloc", coul: C.ok, pale: C.okPale, texte: "faire dire son nom au patient ; bracelet et étiquetage des prélèvements ; signaler toute anomalie d'identité." },
    { x: 580, y: 290, w: 260, h: 100, t: "DIM, DSI, biomédical", sous: "appui technique et données", coul: C.ok, pale: C.okPale, texte: "paramétrer alertes et contrôles de saisie ; extraire les indicateurs de qualité ; associer les DM au bon patient." },
    { x: 560, y: 20, w: 380, h: 90, t: "Taux de doublons", coul: C.acc, pale: C.accPale, texte: "indicateur : doublons / dossiers. Exemple ajouté : 120 doublons sur 40 000 dossiers, 0,3 %." },
    { x: 560, y: 145, w: 380, h: 90, t: "Identités provisoires non régularisées à 48 h", coul: C.acc, pale: C.accPale, texte: "indicateur : les identités provisoires (urgence) qui n'ont pas retrouvé leur vraie identité deux jours après." }
  ];
  A.explorer(f, items, { taille: 18, fond: function (g) {
    A.fleche(g, [220, 112], [220, 143], { ep: 3 }); A.fleche(g, [220, 237], [220, 270], { ep: 3 });
    A.s("rect", { x: 10, y: 270, width: 840, height: 140, rx: 16, fill: "none", stroke: C.trait, "stroke-width": 2, "stroke-dasharray": "8 6" }, g);
    A.texte(g, "Acteurs de terrain et supports", [430, 430], { taille: 15, coul: C.doux, gras: 700 });
    A.texte(g, "Principaux indicateurs", [750, 255], { taille: 15, coul: C.acc, gras: 700 });
  } });
})();
