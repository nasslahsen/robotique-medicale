/* MODÈLE de niveau : une figure, trois étapes de formats différents (manipuler, choisir, calculer).
   Copier, renommer (le nom du fichier = l'id), garder ce squelette. Voir CLAUDE.md. */
NIVEAU({
  id: "exemple",
  init: function (fig) {
    var C = D.C, pl = D.plan(fig.svg, [340, 330], 220);
    var n = { a: 20, libre: true, surAngle: null };
    n.dessin = function () {
      pl.vider();
      pl.grille({ pas: 0.25, fort: 4 });
      var t = n.a * D.DEG, p = [Math.cos(t), Math.sin(t)];
      pl.arc(pl.fig, [0, 0], 0.3 * pl.u, 0, n.a, C.jeu, null, { ep: 3 });
      D.ligne(pl.fig, pl.P([0, 0]), pl.P(p), C.encre, 6);
      if (n.libre) D.poignee(pl.haut, pl.P(p), C.jeu); else D.rond(pl.haut, pl.P(p), 9, { fill: C.jeu, stroke: "#fff", ep: 3 });
      fig.chip("angle = " + Math.round(n.a) + "°");
    };
    D.glisser(fig.svg, {
      debut: function () { return n.libre; },
      bouge: function (p) { if (!n.libre) return; n.a = Math.round(Math.atan2(pl.O[1] - p[1], p[0] - pl.O[0]) / D.DEG); n.dessin(); if (n.surAngle) n.surAngle(n.a); }
    });
    n.dessin();
    return n;
  },
  etapes: [
    // 1. Situation d'abord : on fait, puis on explique en deux phrases.
    { nom: "Manipuler", jouer: function (j, n) {
      j.fig.astuce("Fais tourner le segment autour du centre.");
      j.titre("Amène le segment à 90°.");
      n.surAngle = function (a) {
        if (Math.abs(a - 90) > 2) return;
        n.surAngle = null; n.libre = false; n.a = 90; n.dessin();
        j.bravo("Exactement 90°.");
        j.expliquer("<p>Explication courte, après le défi : ce que la figure vient de montrer, avec la notation du cours.</p>");
        j.suite();
      };
      // « Voir la réponse » : une étape à geste dit comment la réussir (choix, nombres et jetons le font seuls)
      j.reponse(function () { if (n.surAngle) n.surAngle(90); });
    } },
    // 2. Choix : chaque mauvaise option a une aide qui dit où regarder.
    { nom: "Choisir", jouer: function (j, n) {
      j.titre("Prédis d'abord : à 180°, où est le bout du segment ?");
      j.choix([{ html: "À droite", aide: "180°, c'est un demi-tour : regarde le côté opposé." }, { html: "À gauche", juste: true }, { html: "En haut", aide: "En haut, c'est 90°." }], { ok: function () {
        j.bravo("Un demi-tour : à gauche.");
        j.suite();
      } });
    } },
    // 3. Calcul : clavier numérique, virgule décimale, aide ciblée.
    { nom: "Calculer", jouer: function (j, n) {
      j.titre("Combien de degrés font deux tours complets ?");
      j.nombre({ avant: "2 \\text{ tours} =", apres: "°", cases: [{ attendu: 720, tol: 0 }], ligne: true,
        aide: function () { return "Un tour fait 360°."; },
        ok: function () { j.bravo("720°."); j.suite(); } });
    } }
  ]
});
