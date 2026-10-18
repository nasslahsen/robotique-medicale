/* Boss du chapitre 8 : un réseau de pompes et le PACS, à protéger avec les principes du chapitre. */
NIVEAU(SIS.rejouable({
  id: "boss-principes",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    return { g: g };
  },
  etapes: [
    { nom: "Trois couches pour les pompes", jouer: function (j, n) {
      var A = SIS, C = A.C;
      j.titre("Les pompes à perfusion connectées doivent être protégées. Touche, de l'extérieur vers les pompes, les trois couches dans l'ordre.");
      var nd = [
        { t: "Contrôle d'accès à la console des pompes (AAA)", x: 190, y: 420, w: 300, h: 110 },
        { t: "Pare-feu entre Internet et l'hôpital", x: 20, y: 60, w: 300, h: 110 },
        { t: "Réseau séparé réservé aux DM", x: 360, y: 240, w: 300, h: 110 }
      ];
      var tr = A.trace({ g: n.g, noeuds: nd, ordre: [1, 2, 0], coul: C.jeu, taille: 17, erreur: j.erreur,
        aide: function (i, att, k) { return ["On commence au bord : la frontière avec Internet.", "Puis on sépare le réseau des DM du reste.", "Enfin, au plus près des pompes : qui y accède."][k]; },
        fin: function () { j.bravo("Pare-feu → réseau des DM → contrôle d'accès : trois couches."); j.suite(); } });
      j.reponse(function () { tr.resoudre(); });
    } },
    { nom: "Le PACS chiffré", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["serveur", "cadenas"], titre: "PACS chiffré par un rançongiciel", sous: "images intactes mais illisibles" });
      SIS.vider(n.g);
      j.titre("Le PACS est chiffré par un rançongiciel. Les images existent encore, intactes, chiffrées sur le disque. Quel critère est d'abord touché ?");
      j.choix([{ html: "Disponibilité", juste: true }, { html: "Intégrité", aide: "Les images ne sont pas faussées : elles sont illisibles sans la clé." }, { html: "Confidentialité", aide: "Elle peut l'être aussi si les données ont été volées, mais le premier effet est autre." }], { colonnes: 3, ok: function () { j.bravo("Disponibilité : retard de prise en charge. Et en cas de double extorsion, la confidentialité aussi."); j.suite(); } });
    } },
    { nom: "Qui a ouvert ?", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["document", "ecran"], titre: "Une pièce jointe piégée", sous: "quel poste, et quand ?" });
      j.titre("L'enquête doit trouver quel poste a ouvert la pièce jointe piégée, et quand. Sans quel A serait-ce impossible ?");
      j.choix([{ html: "La traçabilité", juste: true }, { html: "L'autorisation", aide: "Savoir ce qui était permis ne dit pas ce qui a été fait." }, { html: "L'authentification", aide: "Elle identifie qui se connecte ; mais il faut aussi garder la trace des actions." }], { colonnes: 3, ok: function () { j.bravo("La traçabilité (accounting) permet l'enquête."); j.suite(); } });
    } },
    { nom: "Une seule faille", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["bouclier", "ouvert"], titre: "Pare-feu, antivirus, sauvegardes", sous: "et un compte de prestataire sans double authentification" });
      j.titre("L'hôpital avait un pare-feu, un antivirus et des sauvegardes. L'attaque est entrée par le compte d'un prestataire, sans double authentification. Quelle idée du cours cela illustre-t-il ?");
      j.choix([{ html: "Rien n'est sécurisé à 100 % : une seule faille suffit à un attaquant", juste: true }, { html: "Les pare-feu ne servent à rien", aide: "Le pare-feu a sans doute arrêté d'autres attaques. Une couche n'est jamais parfaite." }, { html: "Il fallait payer le prestataire plus cher", aide: "Le problème est l'authentification du compte, pas le prix." }], { colonnes: 1, ok: function () { j.bravo("Le mythe de la sécurité : chaque couche a sa faille."); j.suite(); } });
    } }
  ]
}));
