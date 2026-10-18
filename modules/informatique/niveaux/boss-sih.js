/* Boss du chapitre 3 : suivre une demande de biologie à travers les composants du SIH et diagnostiquer une panne. */
NIVEAU(SIS.rejouable({
  id: "boss-sih",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    return { g: g };
  },
  etapes: [
    { nom: "Le trajet d'une troponine", jouer: function (j, n) {
      var A = SIS, C = A.C;
      j.titre("L'urgentiste demande une troponine. Touche, dans l'ordre, les étapes que traverse la demande puis le résultat.");
      var nd = [
        { t: "LIS", sous: "analyse et validation", x: 470, y: 250, w: 190, h: 100 },
        { t: "DPI", sous: "résultat affiché", x: 20, y: 440, w: 190, h: 100 },
        { t: "Plateforme d'intégration", sous: "message vers le labo", x: 245, y: 60, w: 190, h: 100 },
        { t: "DPI", sous: "prescription", x: 20, y: 60, w: 190, h: 100 },
        { t: "Plateforme d'intégration", sous: "message de retour", x: 245, y: 440, w: 190, h: 100 }
      ];
      var tr = A.trace({ g: n.g, noeuds: nd, ordre: [3, 2, 0, 4, 1], coul: C.jeu, taille: 18,
        erreur: j.erreur,
        aide: function (i, att, k) { return k === 0 ? "Tout part de la prescription du médecin." : "Entre deux applications, le message passe toujours par la plateforme."; },
        fin: function () { j.bravo("DPI → plateforme → LIS → plateforme → DPI."); j.suite(); } });
      j.reponse(function () { tr.resoudre(); });
    } },
    { nom: "La panne", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["reseau", "alerte"], titre: "Plateforme d'intégration arrêtée", sous: "le LIS et le DPI fonctionnent" });
      j.titre("Un matin, la plateforme d'intégration s'arrête. Le LIS et le DPI fonctionnent. Quel apport du SIH disparaît d'abord ?");
      j.choix([
        { html: "L'échange informatisé des données entre services", juste: true },
        { html: "Le stockage des données du DPI", aide: "Le DPI et sa base fonctionnent toujours. Qu'est-ce qui ne circule plus ?" },
        { html: "La facturation des séjours passés", aide: "Ce n'est pas le premier effet. Pense à ce que transporte la plateforme." }
      ], { colonnes: 1, ok: function () { j.bravo("Plus d'échange : chaque module redevient une île."); j.suite(); } });
    } },
    { nom: "Quelle interopérabilité ?", jouer: function (j, n) {
      var A = SIS;
      j.titre("Range chaque échange de cette prise en charge : interne ou externe ?");
      var cartes = [{ t: "LIS → DPI, en HL7 V2", bac: 0 }, { t: "Résultat envoyé au médecin traitant, en ville", bac: 1 }, { t: "Vérification des droits du patient à la CNSS", bac: 1 }, { t: "Prescription DPI → LIS", bac: 0 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "Interne" }, { t: "Externe" }],
        pos: A.grille(4, 2, 20, 20, 640, 110, 18), bacsPos: function (k) { return { x: 20 + k * 330, y: 330, w: 310, h: 210 }; },
        erreur: j.erreur, info: j.info,
        aide: function (i) { return cartes[i].bac === 0 ? "Deux modules du même hôpital." : "Un acteur hors de l'hôpital."; },
        fin: function () { j.bravo("Interne entre modules, externe vers la ville et la CNSS."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Facturer l'analyse", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["tube", "facture"], titre: "Facturer la troponine" });
      SIS.vider(n.g);
      j.titre("Il faut maintenant facturer la troponine. Quelle nomenclature, dans quel composant ?");
      j.choix([
        { html: "La NABM, dans la gestion médico-administrative", juste: true },
        { html: "La CIM-10, dans le DPI", aide: "La CIM-10 code les diagnostics, pas les actes de biologie à facturer." },
        { html: "HL7, dans la plateforme d'intégration", aide: "HL7 est un format de message, pas une nomenclature de facturation." }
      ], { colonnes: 1, ok: function () { j.bravo("NABM : cotation des actes de biologie, côté médico-administratif."); j.suite(); } });
    } }
  ]
}));
