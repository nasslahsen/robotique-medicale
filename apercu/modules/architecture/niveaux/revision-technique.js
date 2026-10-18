/* Révision du chapitre 5 : électricité, éclairage, fluides médicaux, réseaux, plafond technique, dans des situations nouvelles. */
NIVEAU(ARCHI.rejouable({
  id: "revision-technique",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { g: g, pl: { P: function (v) { return v; } } };
    n.icones = function (liste) {
      A.vider(g); fig.chip(null);
      liste.forEach(function (e, i) {
        var x = 40 + (i % 2) * 320, y = 90 + Math.floor(i / 2) * 230;
        A.boite(g, x, y, 280, 200, { fond: "#fff", bord: C.trait, ep: 2 });
        A.icone(g, e[0], [x + 140, y + 80], 70, e[2] || C.doux);
        A.texte(g, e[1], [x + 140, y + 160], { taille: 17, largeur: 250, halo: false });
      });
    };
    return n;
  },
  etapes: [
    { nom: "Qui prend le relais ?", jouer: function (j, n) {
      n.icones([["eclair", "Réseau principal", "#e5484d"], ["eclair", "Groupes électrogènes"], ["eclair", "Onduleur UPS", "#12a26b"], ["ecran", "Moniteur multiparamétrique"]]);
      j.titre("Associe chaque source à l'alimentation qu'elle fournit, d'après le schéma du cours.");
      var res = j.zone("", "");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:center"><b>Réseau principal</b><span class="trou" data-attendu="n"></span><b>Groupes électrogènes</b><span class="trou" data-attendu="s"></span><b>Onduleur UPS</b><span class="trou" data-attendu="u"></span></div>');
      j.jetons({
        reserve: res,
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "u", html: "Alimentation de secours" }, { id: "n", html: "Alimentation normale" }, { id: "s", html: "Alimentation de sécurité" }],
        aide: "Le réseau donne l'alimentation de tous les jours ; les groupes, celle de sécurité ; l'onduleur, celle de secours.",
        ok: function () { j.bravo("Normale, sécurité, secours."); j.suite(); }
      });
    } },
    { nom: "Le scialytique", jouer: function (j, n) {
      n.icones([["lampe", "Coupole à un seul foyer"], ["lampe", "Coupole à plusieurs foyers", "#e8a317"]]);
      j.titre("Une équipe se plaint d'avoir de l'ombre dans la plaie dès qu'elle se penche. Que proposes-tu ?");
      j.choix([
        { html: "Un scialytique à plusieurs foyers, qui éclaire sous plusieurs angles", juste: true },
        { html: "Augmenter l'éclairage général de la salle", aide: "L'éclairage général sert la circulation et le nettoyage, pas le champ opératoire." },
        { html: "Demander à l'équipe de ne plus se pencher", aide: "L'architecture doit suivre les mouvements réels de l'équipe, pas l'inverse." }
      ], { colonnes: 1, ok: function () { j.bravo("Faible production d'ombre : c'est une exigence du scialytique."); j.suite(); } });
    } },
    { nom: "La bonne prise", jouer: function (j, n) {
      n.icones([["goutte", "O₂", "#12a26b"], ["goutte", "Vide médical"], ["air", "Air médical", "#e8a317"], ["goutte", "Évacuation des gaz", "#b4233c"]]);
      j.titre("Une aspiration de sang pendant l'intervention s'arrête. Quel fluide est en cause, et qu'aurait-il fallu prévoir ?");
      j.choix([
        { html: "Le vide médical : il fallait une source de secours et des alarmes", juste: true },
        { html: "L'O₂ : il fallait plus de prises", aide: "L'O₂ oxygène le patient ; l'aspiration utilise un autre réseau." },
        { html: "L'air médical : il fallait un filtre HEPA", aide: "L'aspiration n'utilise pas l'air médical." }
      ], { colonnes: 1, ok: function () { j.bravo("Vide médical : réseau, vannes, alarmes, source de secours, maintenance."); j.suite(); } });
    } },
    { nom: "Le patient anesthésié", jouer: function (j, n) {
      n.icones([["patient", "Patient anesthésié"], ["eclair", "Bistouri électrique", "#e5484d"]]);
      j.titre("Pourquoi le risque électrique est-il particulièrement important au bloc ?");
      j.choix([
        { html: "Parce que des équipements électriques sont utilisés sur un patient anesthésié", juste: true },
        { html: "Parce que l'électricité y est plus chère", aide: "Le coût n'est pas un risque pour le patient." },
        { html: "Parce que les salles sont plus grandes", aide: "La taille ne change rien au risque électrique." }
      ], { colonnes: 1, ok: function () { j.bravo("Le patient anesthésié ne peut ni sentir ni réagir."); j.suite(); } });
    } },
    { nom: "Plafond technique", jouer: function (j, n) {
      n.icones([["air", "Ventilation", "#3b5bdb"], ["reseau", "Réseaux informatiques", "#8b3fd9"], ["goutte", "Gaz médicaux", "#12a26b"], ["lampe", "Éclairage", "#e8a317"]]);
      j.titre("Un bras plafonnier ne peut pas être posé : une gaine de ventilation passe exactement à son emplacement. Quelle étape a manqué ?");
      j.choix([
        { html: "La coordination architecture + CVC + électricité + fluides médicaux + biomédical", juste: true },
        { html: "Le choix de la couleur du plafond", aide: "Ce n'est pas une question d'aspect." },
        { html: "Le contrôle de l'éclairage général", aide: "Le problème est un conflit d'emplacement entre deux réseaux." }
      ], { colonnes: 1, ok: function () { j.bravo("Sans coordination, les réseaux se disputent le plafond."); j.suite(); } });
    } }
  ]
}));
