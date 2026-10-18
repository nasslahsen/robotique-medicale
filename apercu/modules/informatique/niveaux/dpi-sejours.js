/* Niveau : utilité du DPI, DPI et séjours patient (S1S2, diapos 52 et 53). */
NIVEAU(SIS.rejouable({
  id: "dpi-sejours",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.SEJ = [
      { t: "Séjour S-0412", sous: "consultation cardiologie, 3 mars" },
      { t: "Séjour S-0587", sous: "urgences, 20 avril" },
      { t: "Séjour S-0611", sous: "hospitalisation, 2 au 6 mai" }
    ];
    n.arbre = function (g2) {
      A.boite(g2, 20, 30, 200, 120, { titre: "DPI", sous: "ID patient P-2231, nom et prénom, date de naissance", fond: C.jeuPale, bord: C.jeu, ep: 3, taille: 22, tailleSous: 13 });
      [0, 1, 2].forEach(function (k) { A.chemin(g2, [[60, 152], [60, 230 + k * 130], [76, 230 + k * 130]], { ep: 3, coul: C.doux }); });
    };
    return n;
  },
  etapes: [
    { nom: "À quoi sert le DPI ?", jouer: function (j, n) {
      var A = SIS;
      j.titre("Range chaque usage du DPI dans l'utilité que le cours lui donne.");
      var cartes = [{ t: "L'infirmière de nuit lit les consignes du médecin de jour", bac: 0 }, { t: "Retrouver les diabétiques de plus de 60 ans d'une commune", bac: 1 }, { t: "Un protocole AVC s'affiche dès que le diagnostic est saisi", bac: 2 }, { t: "Afficher les résultats de biologie par ordre chronologique", bac: 1 }, { t: "Sélectionner des patients pour une étude clinique", bac: 2 }];
      var t = A.trier({
        g: n.g, cartes: cartes,
        bacs: [{ t: "Coordination des soins" }, { t: "Exercice professionnel", sous: "classer, retrouver vite" }, { t: "Aide à la décision", sous: "évaluation, études cliniques" }],
        pos: function (i) { return { x: 10, y: 14 + i * 116, w: 380, h: 100 }; },
        bacsPos: function (k) { return { x: 420, y: 14 + k * 194, w: 250, h: 176 }; },
        taille: 16, tailleBac: 18,
        erreur: j.erreur, info: j.info,
        aide: function (i) { var b = cartes[i].bac; return ["Plusieurs professionnels se passent le relais autour du même patient.", "On retrouve l'information selon un critère : nature, ordre chronologique, nom, âge, domicile, affection.", "Un protocole de prise en charge prédéfini, établi à partir des référentiels de pratiques."][b]; },
        fin: function () {
          j.bravo("Coordination, exercice professionnel, aide à la décision.");
          j.expliquer("<p>Au total, le cours retient trois bénéfices : un précieux <b>gain de temps</b>, la <b>qualité des soins</b>, la <b>traçabilité</b> des données de santé du patient.</p>");
          j.suite();
        }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Chaque acte à son séjour", jouer: function (j, n) {
      var A = SIS;
      j.titre("Le DPI de M. Chraibi compte trois séjours. Rattache chaque prestation au bon séjour.");
      var cartes = [{ t: "ECG fait aux urgences le 20 avril", bac: 1 }, { t: "Coronarographie le 4 mai", bac: 2 }, { t: "Ordonnance de la consultation du 3 mars", bac: 0 }, { t: "Diagnostic de sortie le 6 mai", bac: 2 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: n.SEJ,
        pos: function (i) { return { x: 420, y: 30 + i * 140, w: 250, h: 116 }; },
        bacsPos: function (k) { return { x: 80, y: 180 + k * 130, w: 300, h: 110 }; },
        fond: n.arbre, taille: 16, tailleBac: 18,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return "Regarde la date et le lieu de la prestation, puis cherche le séjour qui les contient."; },
        fin: function () {
          j.bravo("Chaque prestation sous l'identifiant unique de son séjour.");
          j.expliquer("<p>Chaque passage du patient (consultation, urgences, hospitalisation, exploration) est enregistré sous un <b>séjour ayant un identifiant unique</b>. Toutes les prestations de soins, traitements, mouvements et décisions médicales de ce passage sont rattachés à cet identifiant.</p>");
          j.suite();
        }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Pourquoi le séjour ?", jouer: function (j, n) {
      j.titre("Pourquoi rattacher l'ECG au séjour S-0587, et pas seulement à l'identifiant du patient ?");
      j.choix([
        { html: "Pour savoir lors de quel passage il a été fait : facturer ce passage, suivre son déroulé, compter les séjours", juste: true },
        { html: "Parce que l'identifiant du patient change à chaque séjour", aide: "Non : l'ID patient reste le même. C'est le séjour qui a son propre identifiant." },
        { html: "Pour pouvoir supprimer le séjour une fois le patient sorti", aide: "Le DPI garde l'historique de tous les séjours." }
      ], { colonnes: 1, ok: function () { j.bravo("Un patient, plusieurs séjours : chaque acte appartient à un passage précis."); j.suite(); } });
    } }
  ]
}));
