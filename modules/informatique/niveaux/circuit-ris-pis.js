/* Niveau : RIS (circuit de l'imagerie) et PIS (circuit du médicament) : étapes, acteurs, risques, indicateurs, côté biomédical (S3, diapos 15 et 16). */
NIVEAU(SIS.rejouable({
  id: "circuit-ris-pis",
  init: function (fig) {
    var A = SIS, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.cinq = function (noms, place) { return noms.map(function (e, i) { var c = place[i]; return { t: e[0], sous: e[1], x: c === 4 ? 185 : 20 + (c % 2) * 330, y: 40 + Math.floor(c / 2) * 180, w: 310, h: 110 }; }); };
    return n;
  },
  etapes: [
    { nom: "Le circuit de l'imagerie", jouer: function (j, n) {
      var A = SIS, C = A.C;
      j.titre("RIS : touche les cinq étapes du circuit d'un scanner, dans l'ordre.");
      var nd = n.cinq([["Demande", "prescription informatisée"], ["Planification", "créneau et salle"], ["Accueil et réalisation", "vérification d'identité, examen"], ["Compte rendu", "dictée et validation"], ["Archivage", "consultation des images"]], [2, 4, 1, 3, 0]);
      var tr = A.trace({ g: n.g, noeuds: nd, ordre: [0, 1, 2, 3, 4], coul: C.jeu, taille: 19, erreur: j.erreur,
        aide: function (i, att, k) { return ["D'abord le médecin demande l'examen.", "On lui trouve un créneau et une salle.", "Le patient arrive : on vérifie son identité, on fait l'examen.", "Le radiologue dicte et valide.", "Les images sont archivées et consultables."][k]; },
        fin: function () { j.bravo("Demande → planification → accueil et réalisation → compte rendu → archivage."); j.suite(); } });
      j.reponse(function () { tr.resoudre(); });
    } },
    { nom: "Le circuit du médicament", jouer: function (j, n) {
      var A = SIS, C = A.C;
      j.titre("PIS : touche les cinq étapes du circuit du médicament, dans l'ordre.");
      var nd = n.cinq([["Prescription", "aides : interactions, allergies, doses"], ["Analyse pharmaceutique", "validation par le pharmacien"], ["Dispensation", "stocks et dotations de service"], ["Administration", "geste infirmier au lit"], ["Traçabilité", "dossier patient à jour"]], [3, 0, 4, 2, 1]);
      var tr = A.trace({ g: n.g, noeuds: nd, ordre: [0, 1, 2, 3, 4], coul: C.jeu, taille: 19, erreur: j.erreur,
        aide: function (i, att, k) { return ["Le médecin prescrit.", "Le pharmacien vérifie la prescription.", "La pharmacie délivre le médicament au service.", "L'infirmier le donne au patient.", "On trace l'administration dans le dossier."][k]; },
        fin: function () { j.bravo("Prescription → analyse pharmaceutique → dispensation → administration → traçabilité."); j.suite(); } });
      j.reponse(function () { tr.resoudre(); });
    } },
    { nom: "Risques et indicateurs", jouer: function (j, n) {
      var A = SIS;
      j.titre("Range chaque risque ou indicateur dans son circuit.");
      var cartes = [
        { t: "Mauvaise identité sur l'examen", bac: 0 }, { t: "Fatigue d'alerte", bac: 1 }, { t: "Suivi de dose", bac: 0 }, { t: "Interventions pharmaceutiques", bac: 1 },
        { t: "Délai demande – compte rendu", bac: 0 }, { t: "Interaction non détectée", bac: 1 }, { t: "Radiovigilance", bac: 0 }, { t: "Administrations tracées", bac: 1 }
      ];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: [{ t: "RIS", sous: "imagerie" }, { t: "PIS", sous: "médicament" }],
        pos: A.grille(8, 2, 20, 14, 640, 60, 10), bacsPos: function (k) { return { x: 20 + k * 330, y: 310, w: 310, h: 250 }; },
        taille: 16, tailleBac: 24,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return cartes[i].bac === 0 ? "Cela concerne un examen d'imagerie et ses rayons." : "Cela concerne une prescription de médicament et ses alertes."; },
        fin: function () { j.bravo("Imagerie : identité, dose, délai, radiovigilance. Médicament : alertes, interactions, pharmaciens, traçabilité."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Côté biomédical", jouer: function (j, n) {
      var A = SIS, C = A.C;
      A.vider(n.g);
      A.icone(n.g, "pompe", [170, 250], 120); A.fleche(n.g, [250, 250], [420, 250], { ep: 5, tirets: "10 7", coul: C.acc }); A.boite(n.g, 430, 200, 200, 100, { titre: "Dossier patient", taille: 22, fond: C.jeuPale, bord: C.jeu });
      j.titre("Le service s'équipe de pompes à perfusion et d'armoires sécurisées. Quelle question le cours demande-t-il au biomédical de se poser ?");
      j.choix([
        { html: "Les données de l'appareil remontent-elles au dossier patient ?", juste: true },
        { html: "Le pharmacien a-t-il validé chaque prescription ?", aide: "C'est la question du pharmacien, pas du biomédical." },
        { html: "La pompe est-elle de la même couleur que les autres ?", aide: "Pense à la place de l'appareil dans le SIH." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Les données de l'appareil doivent remonter au dossier patient.");
        j.expliquer("<p>Côté imagerie, même logique : radio et scanner sont des DM qui alimentent le RIS. Le cours demande : <b>qui les paramètre, les maintient, répond à la panne ?</b></p>");
        j.suite();
      } });
    } }
  ]
}));
