/* Niveau : processus (ISO 9000:2000), procédure, workflow (S1S2, diapos 13, 14, 16). */
NIVEAU(SIS.rejouable({
  id: "processus",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.schema = function (g2) {
      A.boite(g2, 250, 330, 180, 100, { titre: "Consultation", sous: "processus", fond: C.jeuPale, bord: C.jeu, ep: 3, taille: 20 });
      A.fleche(g2, [212, 380], [246, 380], { ep: 5 }); A.fleche(g2, [434, 380], [468, 380], { ep: 5 });
      A.chemin(g2, [[113, 474], [113, 530], [567, 530], [567, 476]], { coul: C.ok, ep: 3 });
      A.texte(g2, "valeur ajoutée", [340, 530], { taille: 17, coul: C.ok, gras: 700 });
    };
    return n;
  },
  etapes: [
    { nom: "Entrées et sorties", jouer: function (j, n) {
      var A = SIS;
      j.titre("La consultation est un processus. Range chaque élément : entre-t-il dans le processus ou en sort-il ?");
      var t = A.trier({
        g: n.g,
        cartes: [{ t: "Patient qui arrive avec une toux", bac: 0 }, { t: "Ordonnance signée", bac: 1 }, { t: "Radio du thorax d'il y a un mois", bac: 0 }, { t: "Compte rendu de consultation", bac: 1 }],
        bacs: [{ t: "Éléments d'entrée" }, { t: "Éléments de sortie" }],
        pos: A.grille(4, 2, 20, 20, 640, 90, 16),
        bacsPos: function (k) { return { x: k ? 472 : 18, y: 290, w: 190, h: 180 }; },
        fond: n.schema,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return i % 2 === 0 ? "Cet élément existe avant la consultation : le processus le reçoit." : "Cet élément n'existait pas avant : la consultation le produit."; },
        fin: function () {
          j.bravo("Entrées : le patient et ses examens. Sorties : ordonnance et compte rendu.");
          j.expliquer("<p>Un <b>processus</b> est « un ensemble d'activités corrélées ou interactives qui transforme des éléments d'entrée en éléments de sortie » (ISO 9000:2000). Entre les deux, il apporte une <b>valeur ajoutée</b>.</p>");
          j.suite();
        }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Processus ou procédure ?", jouer: function (j, n) {
      var A = SIS;
      j.titre("Range chaque document : décrit-il un processus, ou une procédure ?");
      var t = A.trier({
        g: n.g,
        cartes: [{ t: "L'admission d'un patient, de l'accueil au lit", bac: 0 }, { t: "Fiche : vérifier l'identité en 4 points, dans cet ordre", bac: 1 }, { t: "Le circuit du médicament", bac: 0 }, { t: "Protocole écrit de désinfection d'un endoscope", bac: 1 }],
        bacs: [{ t: "Processus", sous: "activités qui transforment des entrées en sorties" }, { t: "Procédure", sous: "manière spécifiée d'effectuer une activité" }],
        pos: A.grille(4, 2, 20, 30, 640, 110, 20),
        bacsPos: function (k) { return { x: 20 + k * 330, y: 330, w: 310, h: 200 }; },
        erreur: j.erreur, info: j.info,
        aide: function (i) { return i % 2 === 0 ? "Ici on décrit tout un enchaînement d'activités, pas la façon précise de faire un geste." : "Ici on décrit pas à pas comment faire une activité : une manière spécifiée."; },
        fin: function () {
          j.bravo("Processus : admission, circuit du médicament. Procédures : fiche d'identité, protocole de désinfection.");
          j.expliquer("<p>Une <b>procédure</b> est une manière <b>spécifiée</b> d'effectuer une activité ou un processus. Le processus dit quoi transformer ; la procédure dit comment faire.</p>");
          j.suite();
        }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Qui fait quoi et quand", jouer: function (j, n) {
      var A = SIS, C = A.C;
      j.titre("Workflow d'une demande de bilan sanguin. Touche les étapes dans l'ordre, couloir par couloir.");
      var COUL = ["Médecin", "Infirmier", "Laboratoire"];
      var nd = [
        { t: "Analyser l'échantillon", x: 300, y: 450, w: 170, h: 74 }, { t: "Prescrire le bilan", x: 120, y: 70, w: 170, h: 74 },
        { t: "Lire le résultat", x: 490, y: 70, w: 170, h: 74 }, { t: "Prélever le sang", x: 210, y: 260, w: 170, h: 74 },
        { t: "Publier le résultat", x: 490, y: 450, w: 170, h: 74 }
      ];
      var tr = A.trace({
        g: n.g, noeuds: nd, ordre: [1, 3, 0, 4, 2], coul: C.acc, taille: 16,
        fond: function (g2) {
          COUL.forEach(function (c, k) {
            A.s("rect", { x: 10, y: 40 + k * 190, width: 660, height: 170, rx: 10, fill: k % 2 ? "#fff" : C.fond, stroke: C.trait, "stroke-width": 2 }, g2);
            A.texte(g2, c, [62, 125 + k * 190], { taille: 15, gras: 700, coul: C.doux, halo: false, largeur: 90 });
          });
        },
        erreur: j.erreur,
        aide: function (i, att, k) { return k === 0 ? "Tout commence par une décision du médecin." : "Suis le tube de sang : où va-t-il après cette étape ?"; },
        fin: function () {
          j.bravo("Prescrire → prélever → analyser → publier → lire.");
          j.expliquer("<p>Un <b>workflow</b> modélise les interactions entre les processus métier, les acteurs et les flux d'échanges à mettre en œuvre. Il identifie <b>qui fait quoi et quand</b>. Chaque couloir ici est un acteur.</p>");
          j.suite();
        }
      });
      j.reponse(function () { tr.resoudre(); });
    } },
    { nom: "Le déclencheur", jouer: function (j, n) {
      j.titre("Le cours précise qu'un workflow a un déclencheur. Dans ce workflow, quel est-il ?");
      j.choix([
        { html: "La prescription du bilan par le médecin", juste: true },
        { html: "La lecture du résultat", aide: "La lecture est la dernière étape : elle ne peut pas déclencher le reste." },
        { html: "L'analyse au laboratoire", aide: "Le labo n'analyse rien tant que personne n'a rien demandé." }
      ], { colonnes: 1, ok: function () { j.bravo("La prescription déclenche tout le workflow."); j.suite(); } });
    } }
  ]
}));
