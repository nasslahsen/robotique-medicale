/* Niveau : TD 1, partie I (questions de connaissances), en défis courts. Réponses tirées du cours. */
NIVEAU({
  id: "td1",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { pris: {}, faux: -1, g: g, pl: { P: function (v) { return v; } } };
    n.T = [["Fonctionnel", true], ["Architectural", true], ["Esthétique", false], ["Hygiène", true], ["Technique", true], ["Biomédical", true], ["Marketing", false], ["Sécurité", true], ["Logistique", true], ["Réglementaire", true]];
    n.tuiles = function () {
      A.vider(g); fig.chip(null);
      n.T.forEach(function (t, i) {
        var x = 30 + (i % 2) * 320, y = 40 + Math.floor(i / 2) * 106, on = n.pris[i], f = n.faux === i;
        A.boite(g, x, y, 300, 90, { fond: on ? A.C.jeuPale : f ? C.koPale : "#fff", bord: on ? C.jeu : f ? C.ko : C.trait, ep: on ? 3 : 2, titre: t[0], taille: 20 });
        A.cible(g, x, y, 300, 90, function () { if (n.surT) n.surT(i); });
      });
    };
    n.tuiles();
    return n;
  },
  etapes: [
    { nom: "Question 2 : huit catégories", jouer: function (j, n) {
      j.titre("Question 2 du TD : cite au moins huit catégories de contraintes d'un projet de bloc. Touche-les.");
      var reste = 8;
      n.surT = function (i) {
        if (n.pris[i]) return;
        if (!n.T[i][1]) { n.faux = i; n.tuiles(); j.erreur("Ce n'est pas une des huit familles du cours."); return; }
        n.pris[i] = true; n.faux = -1; reste--; n.tuiles();
        if (reste) return;
        n.surT = null;
        j.bravo("Fonctionnel, architectural, hygiène, technique, biomédical, sécurité, logistique, réglementaire.");
        j.suite();
      };
      j.reponse(function () { n.T.forEach(function (t, i) { if (t[1] && n.surT) n.surT(i); }); });
    } },
    { nom: "Question 3 : les liens fonctionnels", jouer: function (j, n) {
      j.titre("Question 3 du TD : un polytraumatisé arrive. Touche les services dans l'ordre d'un parcours possible, des urgences à la réanimation.");
      var nd = [{ t: "SSPI", x: 380, y: 360, w: 240, h: 90 }, { t: "Urgences", x: 60, y: 60, w: 240, h: 90 }, { t: "Réanimation", x: 60, y: 460, w: 240, h: 90 }, { t: "Bloc opératoire", x: 380, y: 200, w: 240, h: 90 }, { t: "Imagerie", x: 380, y: 40, w: 240, h: 90 }];
      var t = ARCHI.trace({ g: n.g, noeuds: nd, ordre: [1, 4, 3, 0, 2], coul: ARCHI.C.patient, taille: 19,
        erreur: j.erreur,
        aide: function (i, att, k) { return k === 0 ? "Le patient arrive par les urgences." : k === 1 ? "Avant d'opérer un polytraumatisé, on fait le bilan des lésions." : "Après l'intervention, le réveil se surveille juste à côté du bloc, puis le patient instable part en réanimation."; },
        fin: function () {
          j.bravo("Urgences → imagerie → bloc → SSPI → réanimation.");
          j.expliquer("<p>Le bloc doit être facilement accessible depuis les urgences, la réanimation et l'imagerie, mais séparé des circulations générales. La relation bloc – imagerie compte particulièrement pour la traumatologie ; la SSPI est à proximité immédiate du bloc ; le transfert bloc → SSPI → réanimation, et réanimation → bloc, limite distance, obstacles, ascenseurs multiples et croisements avec le public.</p>");
          j.suite();
        } });
      j.reponse(function () { t.resoudre(); });
    } },
    { nom: "Question 14 : quatre airs", jouer: function (j, n) {
      ARCHI.vider(n.g);
      j.titre("Question 14 du TD : quelle différence entre air recyclé et air extrait ?");
      j.choix([
        { html: "L'air recyclé est repris dans les locaux et renvoyé dans le circuit ; l'air extrait est aspiré hors du local", juste: true },
        { html: "Ce sont deux noms du même air", aide: "Le cours les distingue : l'un revient, l'autre part." },
        { html: "L'air recyclé vient de l'extérieur", aide: "Celui qui vient de l'extérieur, c'est l'air neuf." }
      ], { colonnes: 1, ok: function () { j.bravo("Air neuf, recyclé, filtré, extrait : quatre airs distincts."); j.suite(); } });
    } },
    { nom: "Question 15 : le référentiel", jouer: function (j, n) {
      j.titre("Question 15 du TD : pourquoi citer le référentiel avant d'annoncer un nombre de renouvellements d'air par heure ?");
      j.choix([
        { html: "Parce que les valeurs diffèrent selon les références : environ 15 ACH (CDC, systèmes conventionnels), plus de 22 ACH en conception (HIS 2026)", juste: true },
        { html: "Pour faire plus sérieux", aide: "C'est une question de sens : le même chiffre n'a pas la même valeur selon le texte." },
        { html: "Parce que tous les référentiels donnent la même valeur", aide: "Justement non : le cours cite des valeurs différentes." }
      ], { colonnes: 1, ok: function () { j.bravo("Un chiffre isolé ne s'applique pas à toutes les salles."); j.suite(); } });
    } },
    { nom: "Question 24 : prête ?", jouer: function (j, n) {
      j.titre("Question 24 du TD : pourquoi une salle achevée n'est-elle pas nécessairement prête à accueillir des patients ?");
      j.choix([
        { html: "Parce qu'il faut d'abord valider CVC, électricité, gaz médicaux, biomédical et hygiène par des mesures et des essais", juste: true },
        { html: "Parce qu'il faut attendre que la peinture sèche", aide: "Le cours parle de validation technique, pas de finitions." },
        { html: "Elle est prête : les travaux sont finis", aide: "Le cours dit précisément le contraire." }
      ], { colonnes: 1, ok: function () { j.bravo("Fin des travaux ≠ bloc prêt : on valide avant la première utilisation."); j.suite(); } });
    } }
  ]
});
