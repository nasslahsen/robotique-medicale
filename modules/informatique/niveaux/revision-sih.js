/* Révision du chapitre 3 : définition, apports, composants, couches, panorama, dans des situations nouvelles. */
NIVEAU(SIS.rejouable({
  id: "revision-sih",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    return { g: g };
  },
  etapes: [
    { nom: "Trois verbes", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["engrenage", "serveur"], titre: "L'architecture logicielle d'un SIH" });
      SIS.vider(n.g);
      j.titre("Complète l'objectif de l'architecture logicielle d'un SIH, d'après le cours.");
      var z = j.zone("", '<p style="font-size:19px;line-height:2.4">Un ensemble de modules et solutions en interaction ayant pour objectif de <span class="trou" data-attendu="r"></span>, <span class="trou" data-attendu="t"></span> et <span class="trou" data-attendu="f"></span> les informations nécessaires à son activité.</p>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "f", html: "fournir" }, { id: "x", html: "facturer" }, { id: "r", html: "rassembler" }, { id: "t", html: "traiter" }],
        aide: "Trois verbes : réunir l'information, la travailler, la mettre à disposition. Facturer n'est qu'une activité parmi d'autres.",
        ok: function () { j.bravo("Rassembler, traiter, fournir."); j.suite(); }
      });
    } },
    { nom: "Couches, nouveaux cas", jouer: function (j, n) {
      var A = SIS;
      j.titre("Range ces nouveaux éléments dans les couches du SIH.");
      var cartes = [{ t: "Module biologie", bac: 0 }, { t: "Hémovigilance", bac: 1 }, { t: "Documents scannés", bac: 2 }, { t: "Gestion des protocoles de soins", bac: 1 }, { t: "Identité nationale du patient", bac: 4 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "Présentation" }, { t: "Métiers" }, { t: "Données" }, { t: "Interop. interne" }, { t: "Interop. externe" }],
        pos: A.grille(5, 3, 14, 14, 652, 76, 12), bacsPos: function (k) { return { x: 8 + k * 134, y: 300, w: 128, h: 260 }; },
        taille: 16, tailleBac: 16,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Un écran que l'utilisateur ouvre.", "Une vigilance, c'est de la logique médicale.", "Ce sont des données stockées.", "Ce sont des règles du métier de soignant.", "L'identité vient de l'extérieur de l'hôpital."][i]; },
        fin: function () { j.bravo("Présentation, métiers, données, métiers, interopérabilité externe."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "L'inspection", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["document", "horloge"], titre: "Traçabilité des transfusions de l'année", sous: "sortie en deux minutes" });
      SIS.vider(n.g);
      j.titre("Lors d'une inspection, l'hôpital sort en deux minutes la traçabilité de toutes les transfusions de l'année. Quel apport du SIH est-ce ?");
      j.choix([
        { html: "Qualité et sécurité des soins, respect des réglementations", juste: true },
        { html: "Satisfaction des patients", aide: "Le patient ne voit pas cette traçabilité. Qui la demande, et pourquoi ?" },
        { html: "Optimisation des coûts", aide: "On ne parle pas d'argent ici, mais de règles à respecter." }
      ], { colonnes: 1, ok: function () { j.bravo("Respect des réglementations, avec la qualité et la sécurité des soins."); j.suite(); } });
    } },
    { nom: "Le tableau de bord", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["ecran", "horloge"], titre: "La durée moyenne de séjour", sous: "chaque lundi, sur un écran simple" });
      j.titre("Le directeur veut voir chaque lundi la durée moyenne de séjour par service, sur un écran simple. Quel composant affiche cela ?");
      j.choix([
        { html: "Le portail / BI, qui s'appuie sur l'entrepôt de données", juste: true },
        { html: "La plateforme d'intégration", aide: "Elle transporte des messages, elle n'affiche pas d'indicateurs." },
        { html: "Le module infirmier", aide: "C'est un outil de soins, pas de pilotage." }
      ], { colonnes: 1, ok: function () { j.bravo("Portail / BI : tableaux de bord et indicateurs."); j.suite(); } });
    } },
    { nom: "Marrakech", jouer: function (j, n) {
      SIS.vider(n.g); SIS.carteMaroc(n.g, { legende: true });
      j.titre("D'après la carte du cours, quel éditeur équipe les hôpitaux publics de Marrakech-Safi ?");
      j.choix([{ html: "Enova", aide: "Regarde la couleur de la tuile Marrakech-Safi." }, { html: "Sivsa", juste: true }, { html: "Belmed", aide: "Belmed est au sud-est et au sud : Drâa-Tafilalet, Guelmim." }, { html: "Dedalus", aide: "Dedalus n'a qu'une région, autour de la capitale." }], { colonnes: 2, ok: function () { j.bravo("Sivsa, comme Casablanca-Settat, Fès-Meknès et l'Oriental."); j.suite(); } });
    } }
  ]
}));
