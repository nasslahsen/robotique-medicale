/* Figure : la frise du scénario de 22 h 40, avec la correction proposée (module, processus, acteurs). */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-frise", {
    largeur: 960, hauteur: 460, titre: "La frise du patient de 22 h 40",
    essai: "<strong>Essaie</strong> : touche chaque étape. <strong>Observe</strong> : module, processus et acteurs changent à chaque étape ; l'identité, elle, suit le patient partout."
  });
  var S = [
    ["N1", "Accueil urgences", "Module : urgences / admission. Processus : accueil, motif, triage. Acteurs : agent d'accueil, IOA."],
    ["N2", "Guichet d'admission", "Module : admission (GIH). Processus : création / vérification de l'identité, ouverture du séjour, droits. Acteurs : agent d'admission, patient, proche."],
    ["N3", "Consultation des urgences", "Module : DPI (module médecin). Processus : examen initial, prescriptions. Acteurs : urgentiste, infirmier."],
    ["N4.1", "Laboratoire", "Module : LIS. Processus : pré-analytique, analytique, post-analytique. Acteurs : préleveur, technicien, biologiste."],
    ["N4.2", "Imagerie", "Module : RIS et PACS. Processus : demande, planification, réalisation, compte rendu. Acteurs : manipulateur, radiologue, secrétaire."],
    ["N5", "Zone d'observation", "Module : DPI (module infirmier, pancarte, plan de soins). Processus : surveillance, réévaluation. Acteurs : infirmier, médecin."],
    ["N6", "Guichet de sortie", "Module : admission et facturation. Processus : sortie, clôture du séjour, facturation. Acteurs : agent, médecin (compte rendu de sortie)."]
  ];
  var pos = [[20, 170], [150, 170], [280, 170], [450, 50], [450, 290], [620, 170], [790, 170]];
  var items = S.map(function (s, i) { return { x: pos[i][0], y: pos[i][1], w: 130, h: 110, t: s[1], sous: s[0], texte: s[2] + " (correction proposée)", taille: 16, tailleSous: 14, coul: C.jeu, pale: C.jeuPale }; });
  A.explorer(f, items, { fond: function (g) {
    A.s("line", { x1: 30, y1: 420, x2: 930, y2: 420, stroke: C.trait, "stroke-width": 6, "stroke-linecap": "round" }, g);
    A.texte(g, "22 h 40", [60, 445], { taille: 15, mono: true, coul: C.doux });
    A.texte(g, "Homme, 68 ans, douleur thoracique, sans pièce d'identité, avec un proche", [200, 30], { taille: 15, gras: 700, largeur: 360 });
    [[0, 1], [1, 2], [2, 3], [2, 4], [3, 5], [4, 5], [5, 6]].forEach(function (l) { A.relier(g, items[l[0]], items[l[1]], { ep: 3, coul: C.doux }); });
  } });
})();
