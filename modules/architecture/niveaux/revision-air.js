/* Révision du chapitre 4 : ventilation, pression, renouvellement, distribution, filtration, dans des situations nouvelles. */
NIVEAU({
  id: "revision-air",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { pl: { P: function (v) { return v; } } };
    n.dessin = function (t) {
      A.vider(g);
      fig.chip(null);
      if (t === "trois") {
        [["Salle hybride", "restreinte", 30], ["Sas", "semi", 250], ["Couloir du bloc", "semi", 470]].forEach(function (e) {
          var Z = A.ZONES[e[1]];
          A.boite(g, e[2], 180, 180, 220, { fond: Z.fond, bord: Z.bord, ep: 3, titre: e[0], taille: 18 });
        });
        A.texte(g, "Bloc d'exemple (exemple ajouté)", [340, 460], { taille: 15, coul: C.doux });
      } else if (t === "salle") {
        A.s("rect", { x: 140, y: 160, width: 400, height: 260, fill: "#f7f9fc", stroke: C.encre, "stroke-width": 4 }, g);
        A.texte(g, "8 m × 7 m × 3 m", [340, 290], { taille: 22, mono: true });
        A.texte(g, "soufflage : 3 360 m³/h", [340, 340], { taille: 18, coul: C.acc });
      } else if (t === "gouttes") {
        A.s("rect", { x: 80, y: 100, width: 520, height: 400, fill: "#fff", stroke: C.encre, "stroke-width": 5 }, g);
        for (var i = 0, gr = 5; i < 40; i++) { gr = (gr * 9301 + 49297) % 233280; var px = gr / 233280; gr = (gr * 9301 + 49297) % 233280; var cx = px < 0.5 ? 96 + px * 60 : 524 + (px - 0.5) * 120; A.s("ellipse", { cx: cx, cy: 120 + gr / 233280 * 360, rx: 4, ry: 7, fill: "#7fb2e5" }, g); }
        A.texte(g, "parois froides couvertes de gouttes", [340, 300], { taille: 18, coul: C.acc });
      } else if (t === "coupe") {
        A.s("rect", { x: 80, y: 100, width: 520, height: 400, fill: "#fff", stroke: C.encre, "stroke-width": 5 }, g);
        A.s("line", { x1: 220, y1: 106, x2: 460, y2: 106, stroke: C.acc, "stroke-width": 10 }, g);
        A.texte(g, "soufflage d'air filtré", [340, 140], { taille: 16, coul: C.acc });
        A.s("rect", { x: 280, y: 380, width: 120, height: 18, fill: C.doux }, g);
        [[100, 470], [580, 470], [340, 160]].forEach(function (q) { A.s("circle", { cx: q[0], cy: q[1], r: 20, fill: "#fff", stroke: C.gris, "stroke-width": 3, "stroke-dasharray": "5 4" }, g); A.texte(g, "?", q, { taille: 18, coul: C.gris, halo: false }); });
        A.texte(g, "extraction : où ?", [340, 540], { taille: 16, coul: C.doux });
      } else if (t === "gaine") {
        A.s("rect", { x: 30, y: 250, width: 620, height: 100, rx: 10, fill: C.fond, stroke: C.encre, "stroke-width": 3 }, g);
        [130, 290, 450].forEach(function (x, i) { A.s("rect", { x: x, y: 262, width: 100, height: 76, rx: 6, fill: "#fff", stroke: C.acc, "stroke-width": 3 }, g); for (var k = 0; k < 6; k++) A.s("line", { x1: x + 12 + k * 15, y1: 268, x2: x + 12 + k * 15, y2: 332, stroke: C.acc, "stroke-width": 1 + i }, g); });
        A.texte(g, "Quelle filtration prévoir ?", [340, 200], { taille: 18, gras: 800 });
      }
    };
    return n;
  },
  etapes: [
    { nom: "Une nouvelle cascade", jouer: function (j, n) {
      n.dessin("trois");
      j.titre("Range ces trois locaux de la pression la plus haute à la plus basse.");
      var res = j.zone("", "");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:center"><b>la plus haute</b><span class="trou" data-attendu="a"></span><b>moyenne</b><span class="trou" data-attendu="b"></span><b>la plus basse</b><span class="trou" data-attendu="c"></span></div>');
      j.jetons({
        reserve: res,
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "c", html: "Couloir du bloc" }, { id: "a", html: "Salle hybride" }, { id: "b", html: "Sas" }],
        aide: "L'air doit toujours aller du plus propre vers le moins propre : la salle en tête.",
        ok: function () { j.bravo("Salle, sas, couloir : l'air sort de la salle à chaque ouverture."); j.suite(); }
      });
    } },
    { nom: "Un autre calcul", jouer: function (j, n) {
      n.dessin("salle");
      j.titre("Cette salle de 8 m × 7 m × 3 m reçoit 3 360 m³/h. Combien de renouvellements par heure ?");
      j.nombre({ avant: "\\text{ACH} =", cases: [{ attendu: 20, tol: 0.01 }], ligne: true,
        aide: function () { return "Volume : 8 × 7 × 3 = 168 m³. Puis débit ÷ volume."; },
        ok: function () {
          j.consigne("Atteint-elle l'objectif de conception de la HIS 2026 ?");
          j.choix([
            { html: "Oui", aide: "La HIS 2026 demande plus de 22 ACH." },
            { html: "Non, il faudrait plus de 22 ACH", juste: true }
          ], { colonnes: 2, ok: function () { j.bravo("20 ACH : au-dessus de 15, mais pas au-dessus de 22."); j.suite(); } });
        } });
    } },
    { nom: "Trop humide", jouer: function (j, n) {
      n.dessin("gouttes");
      j.titre("Des gouttes apparaissent sur les parois froides d'une salle. Quel paramètre la ventilation contrôle-t-elle mal ?");
      j.choix([
        { html: "L'humidité", juste: true },
        { html: "La pression", aide: "La pression décide du sens de l'air, pas de la condensation." },
        { html: "L'éclairage", aide: "L'éclairage n'a rien à voir avec les gouttes." }
      ], { colonnes: 3, ok: function () { j.bravo("Condensation : humidité mal contrôlée."); j.suite(); } });
    } },
    { nom: "Distribution", jouer: function (j, n) {
      n.dessin("coupe");
      j.titre("Où place-t-on l'extraction dans une salle conventionnelle selon le principe classique du cours ?");
      j.choix([
        { html: "À proximité du sol", juste: true },
        { html: "Au plafond, au-dessus de la table", aide: "Au plafond, on souffle l'air filtré : on n'aspire pas au même endroit." },
        { html: "Dans le couloir", aide: "L'extraction se fait dans la salle, en partie basse." }
      ], { colonnes: 3, ok: function () { j.bravo("Soufflage au plafond, extraction près du sol."); j.suite(); } });
    } },
    { nom: "La bonne filtration", jouer: function (j, n) {
      n.dessin("gaine");
      j.titre("De quoi dépend la filtration à prévoir, d'après le cours ? Trouve l'intrus.");
      j.choix([
        { html: "Du système CVC", aide: "Il est dans la liste du cours." },
        { html: "Du niveau de risque", aide: "Il est dans la liste du cours." },
        { html: "De la couleur de la salle", juste: true },
        { html: "Du type de chirurgie", aide: "Il est dans la liste du cours, avec le référentiel." }
      ], { colonnes: 2, ok: function () { j.bravo("Système CVC, niveau de risque, référentiel, type de chirurgie."); j.suite(); } });
    } }
  ]
});
