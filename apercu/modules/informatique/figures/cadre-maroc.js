/* Figure : l'hôpital public au centre du cadre marocain (loi 05-20, DGSSI, maCERT, DNSSI, loi 09-08, CNDP). */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-cadre", {
    largeur: 960, hauteur: 540, titre: "Le cadre réglementaire marocain",
    essai: "<strong>Essaie</strong> : touche chaque texte ou acteur. <strong>Observe</strong> : chacun répond à une question différente de l'hôpital."
  });
  var it = [
    { x: 330, y: 200, w: 300, h: 140, t: "Hôpital public (IIV)", sous: "son RSSI", coul: C.jeu, pale: C.jeuPale, texte: "infrastructure d'importance vitale. Le RSSI doit : déclarer ses SI sensibles auprès de la DGSSI, réaliser une cartographie des risques, procéder à des audits, homologuer ses SIS, faire accepter formellement les risques résiduels.", taille: 21 },
    { x: 20, y: 30, w: 280, h: 130, t: "Loi 05-20", sous: "cybersécurité, 2020 ; décret 2-21-406 (2021)", texte: "règles et mesures de sécurité pour les établissements publics (IIV) : désignation d'un RSSI, politique de sécurité, audits par PASSI, déclaration des incidents à l'autorité nationale." },
    { x: 660, y: 30, w: 280, h: 130, t: "DGSSI et maCERT", sous: "autorité nationale ; veille et réponse", texte: "la DGSSI, rattachée à l'Administration de la défense nationale, est l'autorité nationale de cybersécurité ; le maCERT est le centre national de veille et de réponse aux incidents. L'interlocuteur en cas d'incident grave ; guides techniques disponibles." },
    { x: 20, y: 380, w: 280, h: 130, t: "DNSSI", sous: "socle de mesures depuis 2014", texte: "gouvernance, gestion des actifs, contrôle d'accès, sécurité des réseaux, continuité, conformité. Le plan de sécurité d'un hôpital public se construit sur ce référentiel, qui se recoupe largement avec ISO 27001." },
    { x: 660, y: 380, w: 280, h: 130, t: "Loi 09-08 et CNDP", sous: "données personnelles ; décret 2-09-165", texte: "les données de santé sont sensibles : formalités auprès de la CNDP, information des patients, mesures de sécurité, encadrement du transfert hors du Maroc. Un export vers un fabricant, un télémainteneur ou un cloud étranger demande une qualification et une autorisation de la CNDP." }
  ];
  A.explorer(f, it, { taille: 20, fond: function (g) {
    [[300, 120, 380, 198], [660, 120, 580, 198], [300, 420, 380, 342], [660, 420, 580, 342]].forEach(function (l) { A.fleche(g, [l[0], l[1]], [l[2], l[3]], { ep: 3, coul: C.doux, double: true }); });
  } });
})();
