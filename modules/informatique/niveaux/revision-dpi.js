/* Révision du chapitre 5 : dossiers, séjours, volets, plan de soins, DPP, urgences, dans des situations nouvelles. */
NIVEAU(SIS.rejouable({
  id: "revision-dpi",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    return { g: g };
  },
  etapes: [
    { nom: "Quel dossier ?", jouer: function (j, n) {
      var A = SIS;
      j.titre("Range chaque situation sous le bon type de dossier.");
      var cartes = [{ t: "Un médecin de Tanger ouvre le dossier constitué dans un hôpital d'Agadir", bac: 1 }, { t: "Le RIS dépose le compte rendu d'imagerie dans le DPI du service", bac: 0 }, { t: "Le carnet de vaccination de l'enfant est consultable partout dans le pays", bac: 2 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "Dossier communiquant" }, { t: "DPP" }, { t: "DSN" }],
        pos: function (i) { return { x: 14 + i * 222, y: 20, w: 208, h: 200 }; },
        bacsPos: function (k) { return { x: 14 + k * 222, y: 320, w: 208, h: 200 }; },
        taille: 16, tailleBac: 20,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Deux établissements partagent le même dossier.", "Deux systèmes d'un même hôpital échangent.", "Portée nationale, profil complet."][i]; },
        fin: function () { j.bravo("DPP, dossier communiquant, DSN."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Glycémie à 8 h", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["tube", "document"], titre: "Glycémie capillaire : 1,40 g/L à 8 h" });
      SIS.vider(n.g);
      j.titre("Une glycémie capillaire est relevée à 8 h : 1,40 g/L. Où l'infirmier la note-t-il dans le DPI ?");
      j.choix([{ html: "Sur la pancarte (feuille de surveillance)", juste: true }, { html: "Dans le plan de soins", aide: "Le plan de soins liste ce qu'il faut faire. Une valeur mesurée va ailleurs." }, { html: "Dans le volet administratif", aide: "Une constante n'est pas une donnée administrative." }], { colonnes: 1, ok: function () { j.bravo("Une constante relevée : la pancarte."); j.suite(); } });
    } },
    { nom: "Le scanner du 20 avril", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["radiation", "document"], titre: "Un scanner fait aux urgences le 20 avril", sous: "le patient revient en juin" });
      j.titre("M. Chraibi revient en juin. Le scanner fait aux urgences le 20 avril doit-il être rattaché à ce nouveau séjour ?");
      j.choix([{ html: "Non : il reste rattaché à l'identifiant du séjour des urgences du 20 avril", juste: true }, { html: "Oui : tout est rattaché au dernier séjour", aide: "Chaque prestation appartient au passage pendant lequel elle a été faite." }], { colonnes: 1, ok: function () { j.bravo("Chaque prestation garde l'identifiant de son séjour."); j.suite(); } });
    } },
    { nom: "L'antibiotique change", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["pilule", "horloge"], titre: "De 3 à 2 prises par jour" });
      j.titre("Le médecin passe l'antibiotique de 3 à 2 prises par jour. Que devient le plan de soins ?");
      j.choix([{ html: "Ajout de tâches", aide: "La prescription existe déjà : on ne la crée pas." }, { html: "Mise à jour", juste: true }, { html: "Suspension", aide: "Le traitement continue, il change." }, { html: "Retrait du plan", aide: "Le traitement n'est pas annulé." }], { colonnes: 2, ok: function () { j.bravo("Prescription modifiée : mise à jour du plan."); j.suite(); } });
    } },
    { nom: "Le triage", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["personne", "document"], titre: "Entre l'accueil et la consultation" });
      j.titre("Aux urgences, entre l'accueil et la consultation, quelle information le DPI reçoit-il ?");
      j.choix([{ html: "Le score de tri donné par l'IOA", juste: true }, { html: "Les résultats de biologie", aide: "La biologie vient après la consultation, avec les explorations." }, { html: "La décision de sortie", aide: "C'est la dernière étape." }], { colonnes: 1, ok: function () { j.bravo("Triage : score de tri (IOA)."); j.suite(); } });
    } }
  ]
}));
