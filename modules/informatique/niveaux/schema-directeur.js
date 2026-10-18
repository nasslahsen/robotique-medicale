/* Niveau : schéma directeur du SI (SDSI) et outils de modélisation (S1S2, diapos 19 à 22). */
NIVEAU(SIS.rejouable({
  id: "schema-directeur",
  init: function (fig) {
    var A = SIS, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g };
    n.PH = ["Initialisation et cadrage", "Analyse critique du SI existant", "Définition des axes stratégiques SI", "Élaboration du schéma directeur"];
    return n;
  },
  etapes: [
    { nom: "Qui écrit, qui valide ?", jouer: function (j, n) {
      var A = SIS, C = A.C;
      A.vider(n.g);
      A.boite(n.g, 240, 230, 200, 120, { titre: "SDSI", fond: C.jeuPale, bord: C.jeu, ep: 3, taille: 30 });
      [["DSI", 100, 140], ["Métier", 340, 80], ["Direction générale", 580, 140]].forEach(function (x) { A.boite(n.g, x[1] - 85, x[2] - 40, 170, 80, { titre: x[0], taille: 18 }); A.s("line", { x1: x[1], y1: x[2] + 40, x2: 340, y2: 230, stroke: C.trait, "stroke-width": 4 }, n.g); });
      A.texte(n.g, "valable 3 à 5 ans", [340, 420], { taille: 20, gras: 700, coul: C.doux });
      j.titre("Un hôpital lance son schéma directeur du SI. Qui l'établit, et qui le valide ?");
      j.choix([
        { html: "Établi par la direction SI (DSI), validé par la direction générale et métier", juste: true },
        { html: "Établi par la direction générale, validé par la DSI", aide: "C'est un document technique et stratégique : l'équipe qui connaît le SI le rédige." },
        { html: "Établi par l'éditeur du logiciel, validé par la DSI", aide: "Le schéma directeur appartient à l'organisation, pas à un fournisseur." }
      ], { colonnes: 1, ok: function () {
        j.bravo("La DSI l'établit ; la direction générale et le métier le valident.");
        j.expliquer("<p>Le <b>schéma directeur</b> est une étape majeure pour définir, formaliser, mettre en place ou actualiser un SI. Il englobe tout le SI : processus, architecture applicative, fonctionnelle et technique. Il est valable pour une période de <b>3 à 5 ans</b>.</p>");
        j.suite();
      } });
    } },
    { nom: "Quatre phases", jouer: function (j, n) {
      var A = SIS, C = A.C;
      j.titre("Remets les quatre phases d'un SDSI dans l'ordre.");
      var pl = [[20, 90], [350, 90], [20, 330], [350, 330]];
      var ord = [2, 0, 3, 1]; // noeud i porte la phase ord[i]
      var nd = pl.map(function (p, i) { return { t: n.PH[ord[i]], x: p[0], y: p[1], w: 310, h: 120 }; });
      var tr = A.trace({ g: n.g, noeuds: nd, ordre: [1, 3, 0, 2], coul: C.jeu, taille: 19,
        erreur: j.erreur,
        aide: function (i, att, k) { return k === 0 ? "On commence par démarrer et cadrer le projet." : "Avant de choisir où aller, il faut savoir d'où l'on part."; },
        fin: function () { j.bravo("Cadrage → analyse de l'existant → axes stratégiques → élaboration."); j.suite(); } });
      j.reponse(function () { tr.resoudre(); });
    } },
    { nom: "Chaque tâche dans sa phase", jouer: function (j, n) {
      var A = SIS;
      j.titre("Range chaque tâche dans sa phase.");
      var cartes = [{ t: "Obtenir une vue fidèle de l'existant", bac: 1 }, { t: "Définir une cible", bac: 2 }, { t: "Organiser la gestion de portefeuille projets", bac: 3 }, { t: "Définir le pilotage du projet", bac: 0 }, { t: "Analyser les risques et les faiblesses", bac: 1 }, { t: "Établir les besoins futurs", bac: 2 }];
      var t = A.trier({
        g: n.g, cartes: cartes, bacs: n.PH.map(function (x, k) { return { t: "Phase " + (k + 1), sous: x }; }),
        pos: A.grille(6, 2, 14, 14, 652, 76, 12),
        bacsPos: function (k) { return { x: 14 + (k % 2) * 334, y: 290 + Math.floor(k / 2) * 150, w: 318, h: 136 }; },
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Avant de proposer quoi que ce soit, on regarde ce qui existe.", "On décide où aller : c'est la stratégie.", "On organise les projets à lancer : c'est la dernière phase.", "On démarre et on organise le projet lui-même.", "On critique l'existant.", "On regarde l'avenir : besoins, opportunités, impact."][i]; },
        fin: function () { j.bravo("Cadrage, existant, stratégie, élaboration : chaque tâche à sa place."); j.suite(); }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Les trois branches", jouer: function (j, n) {
      var A = SIS;
      j.titre("Le schéma directeur se décline en trois branches. Range chaque élément au bout de sa branche.");
      var cartes = [{ t: "Infrastructures", bac: 0 }, { t: "Mission", bac: 2 }, { t: "Informations", bac: 1 }, { t: "Stratégie", bac: 2 }];
      var t = A.trier({
        g: n.g, cartes: cartes,
        bacs: [{ t: "Informatique", sous: "→ technologie" }, { t: "Système d'information", sous: "→ information" }, { t: "Stratégie SI", sous: "→ métier" }],
        pos: function (i) { return { x: 470, y: 60 + i * 130, w: 196, h: 90 }; },
        bacsPos: function (k) { return { x: 190, y: 60 + k * 175, w: 240, h: 120 }; },
        fond: function (g2) {
          A.boite(g2, 10, 250, 150, 90, { titre: "Schéma directeur", taille: 17, fond: A.C.jeuPale, bord: A.C.jeu, ep: 3 });
          [0, 1, 2].forEach(function (k) { A.fleche(g2, [162, 295], [186, 120 + k * 175], { ep: 3, coul: A.C.doux }); });
        },
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Les serveurs et réseaux relèvent de la technologie.", "La mission de l'hôpital est une question de métier.", "Les informations sont au bout de la branche information.", "La stratégie est une question de métier."][i]; },
        fin: function () {
          j.bravo("Technologie : infrastructures (et applications). Information : informations (et processus). Métier : stratégie, mission (et processus).");
          j.expliquer("<p>Sur le schéma du cours, les applications sont reliées à la fois à la technologie et à l'information, et les processus à la fois à l'information et au métier.</p>");
          j.suite();
        }
      });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Dessiner le processus", jouer: function (j, n) {
      SIS.scene(n.g, { icones: ["document", "engrenage"], titre: "Modéliser le processus d'admission" });
      SIS.vider(n.g);
      j.titre("Pour l'analyse de l'existant, tu dois dessiner le processus d'admission. Lequel de ces outils cite le cours pour modéliser un processus ?");
      j.choix([
        { html: "BIZAGI", juste: true },
        { html: "MySQL", aide: "MySQL est un SGBD : il stocke des données, il ne dessine pas de processus." },
        { html: "VMware", aide: "VMware est un hyperviseur, un logiciel système." }
      ], { colonnes: 3, ok: function () { j.bravo("BIZAGI, comme draw.io, ProcessMaker, Lucidchart ou SmartDraw."); j.suite(); } });
    } }
  ]
}));
