/* Niveau : électricité du bloc opératoire (diapo 36) et sécurité électrique (diapo 37). */
NIVEAU(ARCHI.rejouable({
  id: "electricite",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { mode: "schema", reseau: true, groupe: false, t: 0, g: g, pl: { P: function (v) { return v; } } };
    // équipements raccordés au tableau du bloc (diapo 36) et leur alimentation dans ce schéma d'exemple
    n.EQ = [["Respirateur", "ups"], ["Moniteur multiparamétrique", "ups"], ["Équipements d'anesthésie", "ups"], ["Table opératoire, éclairage opératoire", "ups"], ["Systèmes informatiques", "ups"], ["Imagerie médicale", "secu"], ["Lit médicalisé", "normale"]];
    n.dessin = function () {
      A.vider(g);
      fig.chip(null);
      var normale = n.reseau, secu = n.reseau || n.groupe, ups = true;
      var on = { normale: normale, secu: secu, ups: ups };
      // sources
      A.boite(g, 20, 40, 190, 64, { fond: n.reseau ? "#fff" : C.koPale, bord: n.reseau ? C.encre : C.ko, titre: "Réseau électrique principal", taille: 15 });
      A.boite(g, 20, 130, 190, 64, { fond: n.groupe ? C.okPale : "#fff", bord: n.groupe ? C.ok : C.encre, titre: "Groupes électrogènes", sous: n.reseau ? "à l'arrêt" : n.groupe ? "démarrés" : "en démarrage…", taille: 15 });
      A.boite(g, 20, 220, 190, 64, { fond: C.okPale, bord: C.ok, titre: "Onduleur UPS", sous: n.reseau ? "en veille" : "prend le relais", taille: 15 });
      // alimentations
      [["Alimentation normale", normale, 40], ["Alimentation de sécurité", secu, 130], ["Alimentation de secours (UPS)", ups, 220]].forEach(function (a) {
        A.boite(g, 270, a[2], 200, 64, { fond: a[1] ? "#fff" : C.koPale, bord: a[1] ? C.acc : C.ko, ep: 3, titre: a[0], taille: 15 });
        A.fleche(g, [212, a[2] + 32], [266, a[2] + 32], { coul: a[1] ? C.acc : C.gris, ep: 4 });
      });
      A.fleche(g, [470, 72], [520, 300], { coul: normale ? C.acc : C.gris, ep: 3 });
      A.fleche(g, [470, 162], [520, 300], { coul: secu ? C.acc : C.gris, ep: 3 });
      A.fleche(g, [470, 252], [520, 300], { coul: C.acc, ep: 3 });
      A.boite(g, 500, 300, 160, 50, { fond: C.fond, bord: C.encre, titre: "Tableau du bloc", taille: 15 });
      n.EQ.forEach(function (e, i) {
        var x = 20 + (i % 4) * 162, y = 390 + Math.floor(i / 4) * 100, ali = on[e[1]], sel = n.choisi === i;
        A.boite(g, x, y, 150, 86, { fond: ali ? "#fff" : C.fond, bord: sel ? C.jeu : ali ? C.ok : C.gris, ep: sel ? 4 : 2.5, titre: e[0], sous: ali ? "alimenté" : "éteint", taille: 14, coul: ali ? C.encre : C.gris, coulSous: ali ? C.ok : C.ko });
        A.cible(g, x, y, 150, 86, function () { if (n.surEq) n.surEq(i); });
      });
    };
    n.couper = function (fin) {
      n.reseau = false; n.groupe = false; n.dessin();
      setTimeout(function () { n.groupe = true; n.dessin(); if (fin) fin(); }, 1800);
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Trois alimentations", jouer: function (j, n) {
      j.titre("Le bloc est une zone particulièrement exigeante du point de vue électrique. Coupe le réseau principal et observe qui prend le relais.");
      var bt = E.h("button", "btn bleu", "Couper le réseau", j.el); bt.type = "button";
      var fait = false;
      function poser() {
        if (fait) return; fait = true; bt.remove();
        j.consigne("Pendant les secondes où le groupe électrogène démarre, qui alimente le respirateur ?");
        j.choix([
          { html: "L'onduleur UPS", juste: true },
          { html: "Le groupe électrogène", aide: "Regarde la figure : pendant son démarrage, le groupe ne fournit rien encore." },
          { html: "Personne : le respirateur s'arrête quelques secondes", aide: "Pour un patient ventilé, c'est inacceptable : regarde ce qui reste allumé." }
        ], { colonnes: 1, ok: function () {
          j.bravo("L'onduleur assure la continuité sans coupure, puis le groupe alimente la sécurité.");
          j.expliquer("<p>Il faut prévoir une <b>alimentation normale</b> (réseau principal), une <b>alimentation de sécurité</b> (groupes électrogènes) et une <b>alimentation de secours</b> (onduleur UPS). Le cours insiste : <b>les équipements critiques doivent être identifiés</b>. Dans ce schéma d'exemple, le lit médicalisé reste sur l'alimentation normale.</p>");
          j.suite();
        } });
      }
      bt.addEventListener("click", function () { n.couper(poser); });
      j.reponse(function () { if (!fait) { n.reseau = false; n.groupe = true; n.dessin(); poser(); } });
    } },
    { nom: "L'équipement critique", jouer: function (j, n) {
      n.reseau = false; n.groupe = true; n.choisi = -1; n.dessin();
      j.titre("Le groupe a démarré. Dans ce schéma, un seul équipement reste éteint pendant la coupure. Est-ce un bon choix ? Touche l'équipement éteint.");
      n.surEq = function (i) {
        n.choisi = i; n.dessin();
        if (i !== 6) { j.erreur("Celui-ci est encore alimenté. Cherche la case grise « éteint »."); return; }
        n.surEq = null;
        j.consigne("Laisser le lit médicalisé sur l'alimentation normale est-il acceptable ici ?");
        j.choix([
          { html: "Oui : il n'entretient pas une fonction vitale pendant l'intervention", juste: true },
          { html: "Non : tout doit être sur onduleur", aide: "Tout mettre sur onduleur coûte cher et le surcharge : on identifie les équipements critiques." },
          { html: "Non : le respirateur devrait être éteint à sa place", aide: "Le respirateur maintient la respiration du patient anesthésié : c'est l'équipement critique par excellence." }
        ], { colonnes: 1, ok: function () { j.bravo("Identifier les équipements critiques, c'est choisir qui doit tenir sans coupure."); j.suite(); } });
      };
      j.reponse(function () { if (n.surEq) n.surEq(6); });
    } },
    { nom: "Sécurité électrique", jouer: function (j, n) {
      n.mode = "vide"; ARCHI.vider(n.g);
      j.titre("Le risque électrique est particulièrement important sur un patient anesthésié. Relie chaque danger à la mesure du cours qui y répond.");
      var D = ["Un fil dénudé sous tension reste accessible", "Deux appareils au contact du patient ne sont pas au même potentiel", "Un défaut d'isolement met la carcasse d'un appareil sous tension", "Une installation se dégrade sans que personne ne le voie"];
      var M = ["Contrôles périodiques", "Mise à la terre et dispositifs différentiels adaptés", "Protection contre les contacts directs", "Équipotentialité"];
      var pa = ARCHI.paires({ g: n.g, gauche: D, droite: M, bon: [2, 3, 1, 0], xg: 20, wg: 340, xd: 400, wd: 260, y0: 70, h: 100, pas: 124, taille: 15,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Toucher directement une partie sous tension : contact direct.", "Le mot clé est « même potentiel ».", "La carcasse n'aurait pas dû être sous tension : il faut écouler le courant de défaut et couper.", "Seul un contrôle régulier détecte une dérive."][i]; },
        fin: function () {
          j.bravo("Contacts directs, équipotentialité, terre et différentiels, contrôles.");
          j.expliquer("<p>Il faut intégrer : protection contre les contacts directs / indirects, équipotentialité, mise à la terre, dispositifs différentiels adaptés, surveillance des installations selon le schéma électrique retenu, contrôles périodiques. Les prescriptions exactes doivent être définies selon les <b>normes électriques applicables au pays et au type de local médical</b>.</p>");
          j.suite();
        } });
      j.reponse(function () { pa.resoudre(); });
    } },
    { nom: "Sous-dimensionner ?", jouer: function (j, n) {
      j.titre("Pour réduire le coût, on propose de dimensionner l'installation électrique « au plus juste », sans réserve, et de se passer d'onduleur. Que réponds-tu ?");
      j.choix([
        { html: "Bonne idée : le réseau suffit", aide: "Le réseau peut tomber : sans secours, tout s'arrête pendant l'intervention." },
        { html: "Ce sont deux des erreurs fréquentes du cours : sous-dimensionner l'électricité et oublier l'alimentation de secours", juste: true },
        { html: "Acceptable si le groupe électrogène est puissant", aide: "Le groupe ne démarre pas instantanément : l'onduleur couvre ce trou." }
      ], { colonnes: 1, ok: function () { j.bravo("Erreurs 7 et 8 de la liste du cours."); j.suite(); } });
    } }
  ]
}));
