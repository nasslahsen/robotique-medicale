/* Niveau : TD 1, partie II (QCU), questions 6 à 10. Questions et propositions du sujet ; aides et explications écrites à partir du cours. */
NIVEAU({
  id: "td-qcm-2",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { ok: {}, k: 0, ic: "boite", pl: { P: function (v) { return v; } } };
    n.dessin = function (k, ic) {
      n.k = k; n.ic = ic; A.vider(g); fig.chip(null);
      A.boite(g, 120, 110, 440, 380, { fond: "#fff", bord: C.trait, ep: 2 });
      A.icone(g, ic, [340, 260], 150, C.jeu);
      A.texte(g, "TD 1 · partie II · question " + (6 + k), [340, 440], { taille: 20, coul: C.doux });
    };
    n.fait = function (k) { n.ok[k] = true; n.dessin(n.k, n.ic); };
    n.dessin(0, "boite");
    return n;
  },
  etapes: [
    { nom: "Question 6", jouer: function (j, n) {
      n.dessin(0, "air");
      j.titre("Question 6. À propos des filtres HEPA :");
      j.choix([{ html: "ils sont obligatoires sans exception dans toute salle", aide: "Le cours en fait une erreur pédagogique fréquente." }, { html: "leur nécessité dépend du référentiel, de l'application et de la performance du système", juste: true }, { html: "ils remplacent le contrôle de pression", aide: "Filtration et pression sont deux exigences distinctes." }, { html: "ils remplacent les contrôles de maintenance", aide: "Un filtre s'encrasse : il se contrôle et se change." }], { colonnes: 1, ok: function () { n.fait(0); j.bravo("HEPA éventuellement, selon l'application (HIS 2026)."); j.suite(); } });
    } },
    { nom: "Question 7", jouer: function (j, n) {
      n.dessin(1, "radiation");
      j.titre("Question 7. Pour une salle hybride, il faut notamment étudier :");
      j.choix([{ html: "uniquement le revêtement du sol", aide: "Le sol compte, mais l'imagerie impose bien plus." }, { html: "l'espace, les dégagements, l'imagerie, la radioprotection et la maintenance", juste: true }, { html: "uniquement la couleur des murs", aide: "Ce n'est pas une question d'aspect." }, { html: "uniquement le réseau informatique", aide: "Le réseau compte, mais pas seul." }], { colonnes: 1, ok: function () { n.fait(1); j.bravo("Davantage d'espace, dégagements, protection radiologique calculée, maintenance."); j.suite(); } });
    } },
    { nom: "Question 8", jouer: function (j, n) {
      n.dessin(2, "ecran");
      j.titre("Question 8. La SSPI permet principalement :");
      j.choix([{ html: "le stockage des dispositifs stériles", aide: "C'est le rôle du stockage stérile." }, { html: "la surveillance post-anesthésique du patient", juste: true }, { html: "la décontamination des instruments", aide: "C'est le rôle du circuit sale et de la stérilisation." }, { html: "la maintenance des respirateurs", aide: "C'est le rôle de l'équipe biomédicale." }], { colonnes: 1, ok: function () { n.fait(2); j.bravo("Surveillance respiratoire, cardiovasculaire, neurologique, douleur, après anesthésie."); j.suite(); } });
    } },
    { nom: "Question 9", jouer: function (j, n) {
      n.dessin(3, "reseau");
      j.titre("Question 9. Un plafond technique doit être coordonné avec :");
      j.choix([{ html: "ventilation, électricité, gaz médicaux, informatique et supports", juste: true }, { html: "uniquement la peinture", aide: "Le plafond porte des réseaux, pas seulement une finition." }, { html: "uniquement les portes", aide: "Les portes ne passent pas dans le plafond." }, { html: "uniquement le mobilier administratif", aide: "Rien à voir avec le bloc." }], { colonnes: 1, ok: function () { n.fait(3); j.bravo("Architecture + CVC + électricité + fluides médicaux + biomédical."); j.suite(); } });
    } },
    { nom: "Question 10", jouer: function (j, n) {
      n.dessin(4, "bouclier");
      j.titre("Question 10. Avant l'ouverture du bloc, il faut :");
      j.choix([{ html: "se limiter à vérifier l'aspect des locaux", aide: "Un bloc n'est pas prêt parce que les travaux sont finis." }, { html: "valider les installations, alarmes, équipements, flux, procédures et formation", juste: true }, { html: "reporter les contrôles après la première intervention", aide: "La validation se fait avant la première utilisation." }, { html: "vérifier uniquement la table opératoire", aide: "Il faut vérifier CVC, électricité, gaz, biomédical, hygiène." }], { colonnes: 1, ok: function () { n.fait(4); j.bravo("CVC, électricité, gaz médicaux, biomédical, hygiène : tout est validé avant ouverture."); j.suite(); } });
    } }
  ]
});
