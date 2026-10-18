/* Niveau : contraintes incendie (diapo 50), sécurité du patient (diapo 61), sécurité du personnel (diapo 62). */
NIVEAU({
  id: "securite",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g, pl: { P: function (v) { return v; } } };
    n.dessin = function (t) {
      A.vider(g);
      fig.chip(null);
      if (t === "incendie") {
        // plan : deux compartiments, détecteurs, issue, accès pompiers
        A.s("rect", { x: 30, y: 70, width: 620, height: 400, fill: "#fff", stroke: C.encre, "stroke-width": 5 }, g);
        A.s("line", { x1: 340, y1: 70, x2: 340, y2: 470, stroke: C.ko, "stroke-width": 8 }, g);
        A.s("rect", { x: 330, y: 240, width: 20, height: 70, fill: "#fff", stroke: C.ko, "stroke-width": 3 }, g);
        A.texte(g, "porte coupe-feu", [340, 330], { taille: 13, coul: C.ko });
        [[150, 110], [520, 110]].forEach(function (q) { A.s("circle", { cx: q[0], cy: q[1], r: 14, fill: "#fff", stroke: C.encre, "stroke-width": 3 }, g); A.s("circle", { cx: q[0], cy: q[1], r: 4, fill: C.ko }, g); });
        A.texte(g, "détecteurs", [335, 110], { taille: 13, coul: C.doux });
        A.boite(g, 560, 430, 90, 40, { fond: C.ok, bord: C.ok, rx: 6, titre: "SORTIE", taille: 13, coul: "#fff" });
        A.fleche(g, [500, 380], [560, 440], { coul: C.ok, ep: 4 });
        A.texte(g, "accès pompiers", [138, 515], { taille: 14, coul: C.ko, ancre: "start" });
        A.fleche(g, [120, 540], [120, 474], { coul: C.ko, ep: 4 });
        A.icone(g, "feu", [180, 300], 60, C.ko);
        A.texte(g, "Compartiment A", [185, 420], { taille: 15, coul: C.doux }); A.texte(g, "Compartiment B", [430, 440], { taille: 15, coul: C.doux });
      } else if (t === "personnel") {
        [["eclair", "Risque électrique"], ["radiation", "Rayonnements ionisants"], ["goutte", "Gaz anesthésiques"], ["bouclier", "Agents biologiques"], ["boite", "Manutention manuelle"], ["bruit", "Exposition au bruit"], ["thermo", "Température excessive"]].forEach(function (e, i) {
          var x = 24 + (i % 4) * 160, y = 90 + Math.floor(i / 4) * 200;
          if (i >= 4) x += 80;
          A.boite(g, x, y, 150, 170, { fond: "#fff", bord: C.trait, ep: 2 });
          A.icone(g, e[0], [x + 75, y + 64], 56, "#c46a00");
          A.texte(g, e[1], [x + 75, y + 130], { taille: 15, largeur: 140, halo: false });
        });
        A.texte(g, "Risques professionnels cités au cours", [340, 52], { taille: 16, coul: C.doux });
      }
    };
    return n;
  },
  etapes: [
    { nom: "Ce que le bloc doit intégrer", jouer: function (j, n) {
      n.dessin("incendie");
      j.titre("Le bloc doit intégrer sept mesures contre l'incendie. Range chacune selon son rôle.");
      var res = j.zone("", "");
      var S = [["Détection incendie", "d"], ["Compartimentage", "c"], ["Matériaux adaptés", "c"], ["Évacuation", "s"], ["Signalisation", "s"], ["Accès pompiers", "i"], ["Alimentation de sécurité", "i"]];
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr 210px;gap:8px;align-items:center">' + S.map(function (x) { return '<span style="font-size:16px">' + x[0] + '</span><span class="trou" data-attendu="' + x[1] + '"></span>'; }).join("") + "</div>");
      j.jetons({
        reserve: res,
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "s", html: "Faire sortir" }, { id: "c", html: "Contenir le feu" }, { id: "i", html: "Intervenir" }, { id: "d", html: "Détecter tôt" }, { id: "s", html: "Faire sortir" }, { id: "c", html: "Contenir le feu" }, { id: "i", html: "Intervenir" }],
        aide: "Détecter, contenir (murs, portes, matériaux), faire sortir (chemins et panneaux), intervenir (pompiers, énergie qui tient).",
        ok: function () {
          j.bravo("Détection, compartimentage, évacuation, signalisation, matériaux adaptés, accès pompiers, alimentation de sécurité.");
          j.expliquer("<p>Le regroupement par rôle est ajouté pour mémoriser ; la liste est celle du cours. L'alimentation de sécurité sert aussi l'incendie : désenfumage, éclairage de secours, équipements qui doivent continuer.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Des risques propres au bloc", jouer: function (j, n) {
      n.dessin("incendie");
      j.titre("Le cours cite des risques incendie liés à l'oxygène. Pourquoi l'oxygène est-il dangereux ?");
      j.choix([
        { html: "Il ne brûle pas lui-même, mais il entretient et accélère la combustion", juste: true },
        { html: "Il explose spontanément au contact de l'air", aide: "Non : il faut une source d'inflammation et un combustible ; l'oxygène rend le feu plus violent." },
        { html: "Il n'y a aucun risque, c'est un gaz médical", aide: "Gaz médical ne veut pas dire sans danger : le cours le cite parmi les risques incendie." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Comburant : plus d'oxygène, feu plus rapide.");
        j.expliquer("<p>Il faut tenir compte des risques liés à l'<b>oxygène</b>, aux <b>équipements électriques</b>, aux <b>produits inflammables éventuels</b> et aux <b>équipements thermiques</b>. Au bloc, ces quatre éléments sont réunis autour du patient.</p>");
        j.suite();
      } });
    } },
    { nom: "La sécurité du patient", jouer: function (j, n) {
      ARCHI.vider(n.g); j.fig.chip(null);
      j.titre("La conception doit contribuer à prévenir plusieurs risques pour le patient. Relie chaque situation au risque.");
      var S = ["Un brancard sans barrière pendant le transfert", "Deux patients du même nom au programme du jour", "Le tuyau d'O₂ branché sur la prise d'air", "La salle n'est plus ventilée pendant l'intervention", "L'onduleur n'a jamais été raccordé"];
      var R = ["Mauvaise connexion des gaz médicaux", "Interruption de l'alimentation", "Chute", "Défaut de ventilation", "Erreur d'identification"];
      var pa = ARCHI.paires({ g: n.g, gauche: S, droite: R, bon: [2, 4, 0, 3, 1], xg: 20, wg: 340, xd: 400, wd: 260, y0: 60, h: 90, pas: 106, taille: 15,
        erreur: j.erreur, info: j.info,
        fin: function () {
          j.bravo("Chute, identification, gaz, ventilation, alimentation.");
          j.expliquer("<p>Le cours liste : chute, erreur d'identification, infection, brûlure électrique, incendie, interruption de l'alimentation, mauvaise connexion des gaz médicaux, défaut de ventilation. Presque chaque chapitre répond à l'un de ces risques.</p>");
          j.suite();
        } });
      j.reponse(function () { pa.resoudre(); });
    } },
    { nom: "La sécurité du personnel", jouer: function (j, n) {
      n.dessin("personnel");
      j.titre("Il faut aussi protéger les professionnels. Contre les rayonnements ionisants d'un arceau, quelle réponse architecturale le cours prévoit-il ?");
      j.choix([
        { html: "Une protection radiologique calculée par une étude radiophysique / radioprotection", juste: true },
        { html: "Une meilleure isolation acoustique", aide: "Elle répond au bruit, pas aux rayons X." },
        { html: "Un scialytique plus puissant", aide: "La lumière n'a rien à voir avec les rayonnements ionisants." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Et pour les gaz anesthésiques, l'évacuation des gaz ; pour le bruit, l'acoustique.");
        j.expliquer("<p>Risques professionnels cités : risque électrique, rayonnements ionisants, gaz anesthésiques, agents biologiques, manutention manuelle, exposition au bruit, température excessive. Chacun renvoie à une partie du cours : sécurité électrique, radioprotection, évacuation des gaz, flux et déchets, ergonomie, acoustique, ventilation.</p>");
        j.suite();
      } });
    } }
  ]
});
