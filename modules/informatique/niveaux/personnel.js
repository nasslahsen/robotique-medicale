/* Niveau : acteurs internes et externes, catégories du personnel d'un SI (S1S2, diapos 34 et 35). */
NIVEAU(SIS.rejouable({
  id: "personnel",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    return { g: g };
  },
  etapes: [
    { nom: "Dedans ou dehors ?", jouer: function (j, n) {
      var A = SIS, C = A.C;
      j.titre("Range chaque acteur du SI de l'hôpital : interne ou externe ?");
      var cartes = [{ t: "Le directeur de l'hôpital", bac: 0 }, { t: "L'éditeur du DPI", bac: 1 }, { t: "Les médecins utilisateurs", bac: 0 }, { t: "La CNSS, organisme payeur", bac: 1 }, { t: "L'administrateur réseau", bac: 0 }, { t: "Le ministère de la Santé", bac: 1 }];
      var t = A.trier({
        g: n.g, cartes: cartes,
        bacs: [{ t: "Acteurs internes", sous: "direction de gestion, direction métier, direction SI" }, { t: "Acteurs externes", sous: "partenaires, clients, fournisseurs, régulateurs" }],
        pos: A.grille(6, 2, 20, 20, 640, 80, 14), bacsPos: function (k) { return { x: 20 + k * 330, y: 320, w: 310, h: 230 }; },
        erreur: j.erreur, info: j.info,
        aide: function (i) { return cartes[i].bac === 0 ? "Cette personne travaille dans l'hôpital." : "Cet acteur est hors de l'hôpital : fournisseur, partenaire ou régulateur."; },
        fin: function () { j.bravo("Internes : direction, médecins, administrateur. Externes : éditeur, CNSS, ministère."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Trois catégories", jouer: function (j, n) {
      var A = SIS;
      j.titre("Le cours range le personnel d'un SI en trois catégories. Range chaque métier.");
      var cartes = [{ t: "Scrum master", bac: 0 }, { t: "DBA", bac: 1 }, { t: "Urbaniste", bac: 2 }, { t: "Chef de projet", bac: 0 }, { t: "RSSI", bac: 1 }, { t: "Architecte SI", bac: 2 }, { t: "PMO", bac: 0 }, { t: "Data scientist", bac: 1 }];
      var t = A.trier({
        g: n.g, cartes: cartes,
        bacs: [{ t: "Projet" }, { t: "Technique" }, { t: "Conception, organisation et évolution" }],
        pos: A.grille(8, 4, 10, 20, 660, 70, 12), bacsPos: function (k) { return { x: 14 + k * 222, y: 260, w: 208, h: 280 }; },
        taille: 17, tailleBac: 19,
        erreur: j.erreur, info: j.info,
        aide: function (i) { var b = cartes[i].bac; return b === 0 ? "Ce métier pilote un projet : délais, équipe, méthode." : b === 1 ? "Ce métier fait tourner ou protège la technique : bases, sécurité, données." : "Ce métier dessine le SI d'ensemble et son évolution."; },
        fin: function () { j.bravo("Projet : Scrum master, chef de projet, PMO. Technique : DBA, RSSI, data scientist. Conception : urbaniste, architecte SI."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Le bon interlocuteur", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["document", "alerte"], titre: "Un courriel demande le mot de passe du DPI" });
      SIS.vider(n.g);
      j.titre("Une infirmière reçoit un courriel suspect qui demande son mot de passe du DPI. Dans la direction SI, qui est responsable de la sécurité du SI ?");
      j.choix([
        { html: "Le RSSI", juste: true },
        { html: "Le DBA", aide: "Le DBA administre les bases de données." },
        { html: "Le PMO", aide: "Le PMO suit le portefeuille de projets." }
      ], { colonnes: 3, ok: function () { j.bravo("RSSI : responsable de la sécurité des systèmes d'information."); j.suite(); } });
    } }
  ]
}));
