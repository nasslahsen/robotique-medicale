/* Révision du chapitre 9 : textes marocains et références internationales, dans des situations nouvelles. */
NIVEAU(SIS.rejouable({
  id: "revision-cadre",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    return { g: g };
  },
  etapes: [
    { nom: "L'hôpital public", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["lit", "document"], titre: "Centre hospitalier régional public", sous: "et la loi 05-20" });
      SIS.vider(n.g);
      j.titre("Un centre hospitalier régional public est-il concerné par la loi 05-20 ?");
      j.choix([{ html: "Oui : c'est un établissement public qui détient des SIS, et la santé figure parmi les secteurs d'importance vitale", juste: true }, { html: "Non : la loi ne vise que les banques", aide: "Le cours dit le contraire : hôpitaux publics, CHU et groupements sanitaires sont concernés." }], { colonnes: 1, ok: function () { j.bravo("Hôpitaux publics, CHU et groupements sanitaires : concernés."); j.suite(); } });
    } },
    { nom: "Les audits", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["document", "cle"], titre: "Audits de sécurité", sous: "prévus par la loi 05-20" });
      j.titre("D'après le tableau du cours, par qui la loi 05-20 fait-elle réaliser les audits de sécurité ?");
      j.choix([{ html: "Par des prestataires PASSI", juste: true }, { html: "Par la CNDP", aide: "La CNDP s'occupe des données personnelles." }, { html: "Par le fabricant du DPI", aide: "Un auditeur doit être qualifié et indépendant de ce qu'il audite." }], { colonnes: 1, ok: function () { j.bravo("Audits par PASSI (prestataires d'audit qualifiés)."); j.suite(); } });
    } },
    { nom: "DNSSI et ISO", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["bouclier", "document"], titre: "Plan de sécurité d'un hôpital public" });
      j.titre("Le plan de sécurité d'un hôpital public se construit sur la DNSSI. Avec quelle norme se recoupe-t-elle largement ?");
      j.choix([{ html: "ISO 27001", juste: true }, { html: "IEC 80001-1", aide: "IEC 80001-1 porte sur les réseaux qui incorporent des DM." }, { html: "Le MDR", aide: "Le MDR porte sur les dispositifs médicaux." }], { colonnes: 3, ok: function () { j.bravo("ISO 27001, référence de mise en œuvre de la DNSSI et de la loi 05-20."); j.suite(); } });
    } },
    { nom: "Le RGPD au Maroc ?", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["document", "nuage"], titre: "Un règlement européen", sous: "un hôpital marocain" });
      j.titre("Le RGPD est européen. Quand s'applique-t-il en plus à un hôpital marocain ?");
      j.choix([{ html: "S'il traite des données de résidents européens ou travaille avec un prestataire européen", juste: true }, { html: "Jamais", aide: "Le cours donne des cas où il s'applique en plus." }, { html: "Toujours, à la place de la loi 09-08", aide: "Il s'ajoute, il ne remplace pas la loi 09-08." }], { colonnes: 1, ok: function () { j.bravo("Échanges, télémaintenance, recherche avec l'Europe."); j.suite(); } });
    } }
  ]
}));
