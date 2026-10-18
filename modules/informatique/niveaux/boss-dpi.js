/* Boss du chapitre 5 : le dossier de Mme Benali, trois séjours, ses volets, son plan de soins, son partage. */
NIVEAU(SIS.rejouable({
  id: "boss-dpi",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.SEJ = [{ t: "S-1001", sous: "urgences, 12 janvier" }, { t: "S-1044", sous: "hospitalisation pneumologie, 12 au 19 janvier" }, { t: "S-1310", sous: "consultation de contrôle, 3 mars" }];
    return n;
  },
  etapes: [
    { nom: "Trois séjours", jouer: function (j, n) {
      var A = SIS, C = A.C;
      j.titre("Mme Benali arrive aux urgences, est hospitalisée en pneumologie, puis revient en consultation. Rattache chaque prestation à son séjour.");
      var cartes = [{ t: "Radio du thorax à 23 h le 12 janvier, aux urgences", bac: 0 }, { t: "Kinésithérapie respiratoire le 15 janvier", bac: 1 }, { t: "Radio de contrôle le 3 mars", bac: 2 }, { t: "Transfert du lit 4 au lit 9 le 16 janvier", bac: 1 }, { t: "Score de tri à l'arrivée", bac: 0 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: n.SEJ,
        pos: function (i) { return { x: 10, y: 14 + i * 116, w: 340, h: 100 }; },
        bacsPos: function (k) { return { x: 380, y: 30 + k * 190, w: 290, h: 160 }; },
        taille: 16, tailleBac: 19,
        erreur: j.erreur, info: j.info,
        aide: function () { return "Regarde la date et le lieu de chaque prestation."; },
        fin: function () { j.bravo("Urgences, hospitalisation, contrôle : chaque prestation sous son identifiant de séjour."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Le volet", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["personne", "lit"], titre: "Mme Benali vit seule", sous: "une aide à domicile à prévoir" });
      SIS.vider(n.g);
      j.titre("Pendant l'hospitalisation, l'assistante sociale note que Mme Benali vit seule et aura besoin d'une aide à domicile. Dans quel volet du DPI ?");
      j.choix([{ html: "Volet social", juste: true }, { html: "Volet paramédical", aide: "Ce n'est pas un soin infirmier : c'est sa situation de vie." }, { html: "Volet GED", aide: "La GED gère des documents numérisés." }], { colonnes: 3, ok: function () { j.bravo("Volet social."); j.suite(); } });
    } },
    { nom: "L'antibiotique annulé", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["pilule", "alerte"], titre: "Antibiotique annulé le 14 janvier", sous: "l'allergie était connue dans le volet médical" });
      j.titre("Le 14 janvier, le médecin annule l'antibiotique prescrit la veille : l'allergie était connue dans le volet médical. Que devient le plan de soins, et quel outil aurait pu l'éviter ?");
      j.choix([
        { html: "Ses tâches sont retirées du plan ; le moteur d'aide à la prescription aurait pu alerter sur l'allergie", juste: true },
        { html: "Ses tâches sont suspendues ; rien n'aurait pu l'éviter", aide: "Annulée, ce n'est pas interrompue. Et le DPI apporte une aide à la décision." },
        { html: "Le plan ne change pas ; seule la pharmacie est prévenue", aide: "Le plan de soins découle directement des prescriptions." }
      ], { colonnes: 1, ok: function () { j.bravo("Annulée : retrait du plan. Le DPI aide aussi à décider."); j.suite(); } });
    } },
    { nom: "La clinique privée", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["carte", "ecran"], titre: "Une clinique privée de Rabat", sous: "les radios de janvier s'affichent" });
      j.titre("En avril, Mme Benali consulte dans une clinique privée de Rabat. Le médecin voit ses radios de janvier. Grâce à quoi, et qu'est-ce qui garantit que c'est bien son dossier ?");
      j.choix([
        { html: "Le DPP, via la plateforme d'échange santé ; le serveur d'identification du patient garantit l'identité", juste: true },
        { html: "Le dossier communiquant de l'hôpital ; l'identité est vérifiée par le nom seul", aide: "Le dossier communiquant reste dans l'hôpital. Et un nom seul ne suffit pas à identifier quelqu'un." },
        { html: "Un export CSV envoyé par courriel", aide: "Le cours décrit un circuit national, pas un fichier envoyé à la main." }
      ], { colonnes: 1, ok: function () { j.bravo("DPP partagé, identité garantie par le serveur d'identification (carte d'identité électronique)."); j.suite(); } });
    } }
  ]
}));
