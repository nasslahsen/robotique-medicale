/* Niveau : TD 1, partie II (QCU), questions 1 à 5. Questions et propositions du sujet ; aides et explications écrites à partir du cours. */
NIVEAU(ARCHI.rejouable({
  id: "td-qcm-1",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { ok: {}, k: 0, ic: "boite", pl: { P: function (v) { return v; } } };
    n.dessin = function (k, ic) {
      n.k = k; n.ic = ic; A.vider(g); fig.chip(null);
      A.boite(g, 120, 110, 440, 380, { fond: "#fff", bord: C.trait, ep: 2 });
      A.icone(g, ic, [340, 260], 150, C.jeu);
      A.texte(g, "TD 1 · partie II · question " + (1 + k), [340, 440], { taille: 20, coul: C.doux });
    };
    n.fait = function (k) { n.ok[k] = true; n.dessin(n.k, n.ic); };
    n.dessin(0, "boite");
    return n;
  },
  etapes: [
    { nom: "Question 1", jouer: function (j, n) {
      n.dessin(0, "boite");
      j.titre("Question 1. La conception d'un bloc opératoire doit intégrer :");
      j.choix([{ html: "uniquement les surfaces", aide: "Les surfaces ne sont qu'une partie : pense aux flux, aux réseaux, aux équipements." }, { html: "les flux, les installations techniques, les équipements et la maintenance", juste: true }, { html: "uniquement le mobilier", aide: "Le mobilier ne dit rien de l'air, de l'électricité ou des flux." }, { html: "uniquement les exigences esthétiques", aide: "Le cours limite même les éléments décoratifs inutiles." }], { colonnes: 1, ok: function () { n.fait(0); j.bravo("C'est l'idée centrale : un système intégré, pas une salle équipée."); j.suite(); } });
    } },
    { nom: "Question 2", jouer: function (j, n) {
      n.dessin(1, "poubelle");
      j.titre("Question 2. Le circuit sale :");
      j.choix([{ html: "peut traverser librement le stockage stérile", aide: "C'est précisément le croisement à éviter." }, { html: "doit être organisé pour limiter les croisements avec les circuits propres", juste: true }, { html: "est identique au circuit patient", aide: "Le patient et le sale ont des circuits distincts." }, { html: "ne concerne que les déchets ménagers", aide: "Il concerne aussi les instruments souillés et les DASRI." }], { colonnes: 1, ok: function () { n.fait(1); j.bravo("Le circuit sale ne doit pas traverser inutilement les zones propres."); j.suite(); } });
    } },
    { nom: "Question 3", jouer: function (j, n) {
      n.dessin(2, "air");
      j.titre("Question 3. La pression positive en salle d'opération vise notamment à :");
      j.choix([{ html: "favoriser l'entrée d'air des couloirs", aide: "C'est l'inverse : l'air va de la pression haute vers la basse." }, { html: "faire tendre l'air à sortir de la salle vers les espaces adjacents", juste: true }, { html: "remplacer le nettoyage", aide: "La pression ne nettoie rien : elle décide du sens de l'air." }, { html: "supprimer toute contamination", aide: "Elle limite l'entrée d'air moins propre ; elle ne supprime pas tout." }], { colonnes: 1, ok: function () { n.fait(2); j.bravo("Quand la porte s'ouvre, l'air sort de la salle plutôt qu'il n'y entre."); j.suite(); } });
    } },
    { nom: "Question 4", jouer: function (j, n) {
      n.dessin(3, "table");
      j.titre("Question 4. Le dimensionnement d'une salle dépend :");
      j.choix([{ html: "uniquement de la table", aide: "La surface ne se calcule pas sur la seule table." }, { html: "du type de chirurgie, des équipements, des circulations et des besoins de maintenance", juste: true }, { html: "uniquement du nombre de lits de l'hôpital", aide: "Le nombre de lits ne dit rien de ce qui se passe dans la salle." }, { html: "uniquement de la hauteur du plafond", aide: "La hauteur compte pour le volume, mais pas seule." }], { colonnes: 1, ok: function () { n.fait(3); j.bravo("Patient + équipe + équipements + circulation + maintenance + sécurité."); j.suite(); } });
    } },
    { nom: "Question 5", jouer: function (j, n) {
      n.dessin(4, "personne");
      j.titre("Question 5. Le rôle de l'ingénieur biomédical inclut :");
      j.choix([{ html: "l'implantation et les interfaces des équipements", juste: true }, { html: "seulement la réparation après panne", aide: "Il intervient bien avant : dès la conception." }, { html: "uniquement la commande de consommables", aide: "Ses responsabilités vont de la conception au cycle de vie." }, { html: "aucun rôle avant réception", aide: "Le cours dit l'inverse : avant la construction." }], { colonnes: 1, ok: function () { n.fait(4); j.bravo("Implantation des équipements et définition des interfaces font partie de ses responsabilités."); j.suite(); } });
    } }
  ]
}));
