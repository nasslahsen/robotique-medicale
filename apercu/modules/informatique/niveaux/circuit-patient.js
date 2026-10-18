/* Niveau : scénario 22 h 40 et frise des étapes, modules et acteurs (S3, diapos 3 à 5). Le cours laisse l'activité ouverte : correction proposée. */
NIVEAU(SIS.rejouable({
  id: "circuit-patient",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.ST = ["Accueil urgences", "Guichet d'admission", "Consultation des urgences", "Laboratoire et imagerie", "Zone d'observation", "Guichet de sortie"];
    return n;
  },
  etapes: [
    { nom: "La frise", jouer: function (j, n) {
      var A = SIS, C = A.C;
      j.titre("22 h 40 : un homme de 68 ans arrive aux urgences, douleur thoracique, sans pièce d'identité, accompagné d'un proche. Touche les étapes de son circuit, dans l'ordre.");
      var place = [2, 5, 0, 4, 1, 3];
      var nd = n.ST.map(function (t, i) { var c = place[i]; return { t: t, x: 20 + (c % 2) * 330, y: 40 + Math.floor(c / 2) * 180, w: 310, h: 110 }; });
      var tr = A.trace({ g: n.g, noeuds: nd, ordre: [0, 1, 2, 3, 4, 5], coul: C.jeu, taille: 19,
        erreur: j.erreur,
        aide: function (i, att, k) { return ["Il franchit d'abord la porte des urgences.", "On ouvre son dossier administratif.", "Le médecin l'examine.", "On lui fait des examens : prise de sang, radio.", "On le surveille en attendant les résultats.", "Il quitte les urgences."][k]; },
        fin: function () { j.bravo("Accueil → admission → consultation → laboratoire et imagerie → observation → sortie."); j.suite(); } });
      j.reponse(function () { tr.resoudre(); });
    } },
    { nom: "Les modules", jouer: function (j, n) {
      var A = SIS;
      j.titre("Relie chaque étape au module du SIH qui la porte.");
      j.consigne("Correction proposée : le cours pose la question sans donner la réponse.");
      var p = A.paires({
        g: n.g, gauche: ["Guichet d'admission", "Laboratoire", "Imagerie", "Zone d'observation", "Guichet de sortie"],
        droite: ["RIS (et PACS)", "DPI : module infirmier, pancarte", "Facturation", "Admission (GIH)", "LIS"],
        bon: [3, 4, 0, 1, 2],
        xg: 30, wg: 270, xd: 380, wd: 270, y0: 40, h: 90, pas: 110, taille: 18, tailleD: 17,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["On y crée ou retrouve l'identité et on ouvre le séjour.", "Le système d'information du laboratoire.", "Le système d'information de radiologie.", "On y relève les constantes et on suit le plan de soins.", "On y clôt le séjour et on facture."][i]; },
        fin: function () { j.bravo("Admission, LIS, RIS, DPI, facturation."); j.suite(); }
      });
      j.reponse(function () { p.resoudre(); });
    } },
    { nom: "Les acteurs", jouer: function (j, n) {
      var A = SIS;
      j.titre("Relie chaque acteur à l'étape où il intervient.");
      var p = A.paires({
        g: n.g, gauche: ["IOA", "Agent d'admission", "Urgentiste", "Biologiste", "Manipulateur radio"],
        droite: ["Imagerie", "Consultation des urgences", "Accueil urgences (triage)", "Laboratoire", "Guichet d'admission"],
        bon: [2, 4, 1, 3, 0],
        xg: 30, wg: 270, xd: 380, wd: 270, y0: 40, h: 90, pas: 110, taille: 18, tailleD: 17,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["L'infirmier organisateur de l'accueil attribue le score de tri.", "Il crée l'identité et ouvre le séjour.", "Il fait l'examen médical initial.", "Il valide les résultats d'analyses.", "Il réalise l'examen d'imagerie."][i]; },
        fin: function () { j.bravo("IOA au triage, agent à l'admission, urgentiste en consultation, biologiste au labo, manipulateur en imagerie."); j.suite(); }
      });
      j.reponse(function () { p.resoudre(); });
    } },
    { nom: "Sans pièce d'identité", jouer: function (j, n) {
      var A = SIS, C = A.C;
      A.vider(n.g);
      A.icone(n.g, "patient", [200, 260], 140); A.icone(n.g, "carte", [470, 260], 120, C.ko);
      A.s("line", { x1: 410, y1: 210, x2: 530, y2: 310, stroke: C.ko, "stroke-width": 8, "stroke-linecap": "round" }, n.g);
      A.texte(n.g, "22 h 40, pas de CIN", [340, 420], { taille: 22, gras: 800 });
      j.titre("Il n'a pas de pièce d'identité. À quelle étape cela pose-t-il problème en premier, et quel risque crée-t-il pour toute la suite ?");
      j.choix([
        { html: "Au guichet d'admission : créer un doublon ou se tromper de dossier, une erreur qui suivra le patient partout", juste: true },
        { html: "Au laboratoire : l'automate refusera le tube", aide: "Le labo n'arrive qu'après. Où l'identité est-elle créée ou retrouvée ?" },
        { html: "Nulle part : l'identité ne compte qu'à la facturation", aide: "Une identité fausse mène au mauvais dossier, donc à de mauvaises décisions médicales." }
      ], { colonnes: 1, ok: function () { j.bravo("L'identité se joue dès l'admission. C'est le sujet des niveaux suivants."); j.suite(); } });
    } }
  ]
}));
