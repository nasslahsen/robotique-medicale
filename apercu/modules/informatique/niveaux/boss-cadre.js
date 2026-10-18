/* Boss du chapitre 9 : la télémaintenance d'un scanner par son fabricant européen, vue par chaque texte du cours. */
NIVEAU(SIS.rejouable({
  id: "boss-cadre",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    return { g: g };
  },
  etapes: [
    { nom: "Quel texte pour quel problème ?", jouer: function (j, n) {
      var A = SIS;
      j.titre("Le scanner du CHU est télémaintenu depuis l'Europe par son fabricant. Range chaque question sous le texte qui y répond.");
      var cartes = [{ t: "Les journaux envoyés au fabricant contiennent des noms de patients", bac: 0 }, { t: "Qui répond de la sécurité du réseau du scanner, l'hôpital ou le fabricant ?", bac: 1 }, { t: "Le fabricant doit fournir la documentation de sécurité du scanner", bac: 2 }, { t: "Le prestataire est piraté : il faut déclarer l'incident", bac: 3 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "Loi 09-08, CNDP" }, { t: "IEC 80001-1" }, { t: "Marquage CE (MDR)" }, { t: "Loi 05-20, DGSSI" }],
        pos: function (i) { return { x: 10, y: 14 + i * 146, w: 340, h: 130 }; },
        bacsPos: function (k) { return { x: 380, y: 14 + k * 146, w: 290, h: 130 }; },
        taille: 16, tailleBac: 19,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Des données personnelles de santé qui sortent du Maroc.", "Un réseau qui incorpore un DM : la répartition des responsabilités.", "Les exigences de sécurité du dispositif lui-même.", "La déclaration des incidents à l'autorité nationale."][i]; },
        fin: function () { j.bravo("Données : 09-08. Réseau : IEC 80001-1. Dispositif : MDR. Incident : 05-20."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "La surface d'attaque", jouer: function (j, n) {
      SIS.vider(n.g);
      SIS.scene(n.g, { icones: ["serveur", "nuage", "cle"], titre: "Télémaintenance du scanner depuis l'Europe", sous: "un accès de plus depuis l'extérieur" });
      j.titre("Cette télémaintenance ajoute un accès depuis l'extérieur. Que fait-elle à la surface d'attaque du CHU ?");
      j.choix([{ html: "Elle l'agrandit au-delà du périmètre de l'établissement", juste: true }, { html: "Elle la réduit, puisque le fabricant connaît son scanner", aide: "Chaque tiers connecté est un point d'entrée de plus." }], { colonnes: 1, ok: function () { j.bravo("Nombreux tiers connectés : la surface dépasse l'établissement."); j.suite(); } });
    } },
    { nom: "Le risque qui reste", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["cadenas", "alerte"], titre: "Accès chiffré et surveillé", sous: "mais un risque demeure" });
      j.titre("Même avec un accès chiffré et surveillé, un risque demeure. Que demande la loi 05-20 au RSSI ?");
      j.choix([{ html: "Faire accepter formellement les risques résiduels, pour assurer la continuité du service", juste: true }, { html: "Couper la télémaintenance pour toujours", aide: "Sans maintenance, le scanner tombera en panne : la continuité en souffre." }, { html: "Ne rien dire : le risque est faible", aide: "La loi demande que ces risques soient formellement acceptés." }], { colonnes: 1, ok: function () { j.bravo("Les risques résiduels sont formellement acceptés, en connaissance de cause."); j.suite(); } });
    } },
    { nom: "Avant de signer", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["document", "cle"], titre: "Contrat de télémaintenance à renouveler" });
      j.titre("Avant de renouveler le contrat de télémaintenance, quelle démarche du cours le RSSI doit-il avoir menée sur ce scanner ?");
      j.choix([{ html: "Une cartographie des risques et un audit de sécurité", juste: true }, { html: "Un simple devis", aide: "Le prix ne dit rien des risques." }, { html: "Une déclaration à la CNDP seulement", aide: "Utile pour les données, mais la loi 05-20 demande aussi d'évaluer les risques." }], { colonnes: 1, ok: function () { j.bravo("Cartographie des risques, audit, puis homologation."); j.suite(); } });
    } }
  ]
}));
