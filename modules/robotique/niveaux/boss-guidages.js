/* Boss du chapitre 7 : le palier du poignet d'un robot chirurgical. Choix des roulements, raideur, capacité requise, fixe-libre, erreurs. */
NIVEAU({
  id: "boss-guidages",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { revele: 0 };
    n.dessin = function () {
      E.vider(g);
      var yc = 300, r = 34, h = 74, H = MECA.hachures(g, "#9aa0ad", { fond: "#fff" });
      // carter du poignet
      [-1, 1].forEach(function (s) { E.s("rect", { x: 160, y: s < 0 ? yc - r - h - 34 : yc + r + h, width: 400, height: 34, fill: H, stroke: C.encre, "stroke-width": 2 }, g); });
      // moteur à droite, instrument à gauche
      E.s("rect", { x: 580, y: yc - 80, width: 90, height: 160, rx: 12, fill: "#c6cbd8", stroke: C.encre, "stroke-width": 2.5 }, g);
      D.texte(g, "moteur", [625, yc + 108], { taille: 18, coul: C.doux });
      E.s("rect", { x: 40, y: yc - r, width: 540, height: 2 * r, fill: "#e8edf5", stroke: C.encre, "stroke-width": 2 }, g);
      D.ligne(g, [40, yc], [12, yc + 40], C.encre, 8);
      D.texte(g, "instrument", [24, yc + 74], { taille: 18, coul: C.doux, ancre: "start" });
      MECA.traitAxe(g, [30, yc], [600, yc]);
      if (n.revele < 1) {
        [[250, "A"], [500, "B"]].forEach(function (p) {
          [-1, 1].forEach(function (s) { E.s("rect", { x: p[0] - 60, y: s < 0 ? yc - r - h : yc + r, width: 120, height: h, rx: 6, fill: "#fff", stroke: C.acc, "stroke-width": 3, "stroke-dasharray": "8 6" }, g); });
          D.texte(g, p[1], [p[0], yc - r - h / 2], { taille: 28, coul: C.acc });
        });
      } else {
        // A : paire à contact oblique dos à dos ; B : rigide à billes
        [[218, -1], [282, 1]].forEach(function (b) {
          var gg = E.s("g", { transform: b[1] < 0 ? "translate(" + 2 * b[0] + " 0) scale(-1 1)" : null }, g);
          [1, -1].forEach(function (s) { MECA.roulement(gg, b[0], yc - s * r, 64, h, { type: "oblique", sens: s }); });
        });
        [1, -1].forEach(function (s) { MECA.roulement(g, 500, yc - s * r, 64, h, { type: "billes", sens: s }); });
        D.texte(g, "A", [250, 120], { taille: 26, coul: C.acc }); D.texte(g, "B", [500, 120], { taille: 26, coul: C.acc });
        if (n.revele >= 2) {
          D.texte(g, "palier fixe", [250, 520], { taille: 20, coul: C.jeu });
          D.texte(g, "palier libre", [500, 520], { taille: 20, coul: C.jeu });
        }
      }
      if (n.effort) {
        D.fleche(g, [14, yc - 120], [14, yc + 30], C.x, 6);
        D.texte(g, "50 N", [30, yc - 110], { coul: C.x, taille: 20, ancre: "start" });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Les roulements", jouer: function (j, n) {
      j.fig.astuce("Axe du poignet : instrument à gauche, moteur à droite.");
      j.titre("En A, il faut reprendre des charges radiales et axiales dans les deux sens, sans jeu, avec une grande rigidité. Que montes-tu ?");
      j.choix([
        { html: "Deux roulements à contact oblique, montés en opposition et préchargés", juste: true },
        { html: "Deux roulements à rouleaux cylindriques", aide: "Aucune charge axiale possible." },
        { html: "Une butée à billes simple effet", aide: "Un seul sens axial, et pas de radial." },
        { html: "Un roulement à aiguilles", aide: "Aucune charge axiale." }
      ], { colonnes: 1, ok: function () {
        n.revele = 1; n.dessin();
        j.bravo("Contact oblique en opposition, préchargé : ni jeu, ni souplesse.");
        j.suite();
      } });
    } },
    { nom: "Raideur", jouer: function (j, n) {
      n.effort = true; n.dessin();
      j.fig.astuce("");
      j.titre("Le chirurgien appuie de 50 N sur l'instrument. Le palier ne doit pas céder de plus de 0,02 mm. Raideur minimale ?");
      j.nombre({ avant: "k_{min} =", apres: "\\text{N/mm}", cases: [{ attendu: 2500, tol: 0.5 }], ligne: true,
        aide: function () { return "Regarde quelle grandeur divise laquelle dans la définition de la raideur."; },
        ok: function () { j.bravo("2500 N/mm au moins."); j.suite(); } });
    } },
    { nom: "Capacité", jouer: function (j, n) {
      n.effort = false; n.dessin();
      j.titre("Le roulement B (à billes) doit tenir 20 000 h à 100 tr/min sous P = 0,4 kN. Quelle capacité dynamique minimale ?");
      j.nombre({ avant: "C_{req} \\approx", apres: "\\text{kN}", cases: [{ attendu: 0.4 * Math.cbrt(120), tol: 0.01 }], ligne: true,
        aide: function () { return "Commence par le nombre de millions de tours sur 20 000 h, puis retourne \\(L_{10} = (C/P)^p\\)."; },
        ok: function () { j.bravo("Environ 1,97 kN (120 millions de tours)."); j.suite(); } });
    } },
    { nom: "Fixe ou libre", jouer: function (j, n) {
      j.titre("Le moteur chauffe l'arbre. Attribue à chaque palier son rôle.");
      var z = j.zone("", '<div style="display:flex;flex-direction:column;gap:8px"><div style="display:flex;align-items:center;gap:12px"><span style="width:120px">palier fixe</span><span class="trou" data-attendu="A" style="flex:1"></span></div><div style="display:flex;align-items:center;gap:12px"><span style="width:120px">palier libre</span><span class="trou" data-attendu="B" style="flex:1"></span></div></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "B", html: "B, bague extérieure coulissante" }, { id: "A", html: "A, la paire préchargée" }],
        aide: "Le palier fixe positionne l'arbre dans l'axe : il faut un palier qui reprend l'axial dans les deux sens.",
        ok: function () {
          n.revele = 2; n.dessin();
          j.bravo("A positionne l'arbre, B laisse la dilatation se faire.");
          j.suite();
        }
      });
    } },
    { nom: "Trouve les erreurs", jouer: function (j, n) {
      j.titre("Relis ce compte rendu : « Si la charge P double, L₁₀ est divisée par 2. Pour gagner encore en rigidité, on serre la précharge au maximum. » Combien d'erreurs ?");
      j.choix([
        { html: "Deux : L₁₀ est divisée par 8, et une précharge trop forte réduit la durée de vie", juste: true },
        { html: "Une seule : L₁₀ est divisée par 8", aide: "Relis la deuxième phrase : que fait une précharge trop forte ?" },
        { html: "Une seule : la précharge", aide: "Relis la première phrase : quel est l'exposant pour des billes ?" },
        { html: "Aucune", aide: "Relis chaque phrase en pensant à l'exposant p et aux effets de la précharge." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Palier du poignet validé.");
        j.suite();
      } });
    } }
  ]
});
