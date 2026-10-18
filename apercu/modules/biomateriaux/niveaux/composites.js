/* Niveau : renfort et matrice, définition ASTM, matrices et renforts, GD et HP, propriétés spécifiques, formes du renfort. */
NIVEAU({
  id: "composites",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { mode: "coupe" };
    var BARRES = [
      { nom: "acier SAE 1010", E: 207, r: 7.87 },
      { nom: "Ti-6Al-4V", E: 110, r: 4.43 },
      { nom: "alu 6061-T6", E: 68.9, r: 2.70 },
      { nom: "carbone HM-époxy UD", E: 215, r: 1.63 }
    ];
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "coupe") {
        // plaque composite vue en coupe : fibres (cercles) dans la matrice
        E.s("rect", { x: 70, y: 150, width: 540, height: 300, rx: 16, fill: "#f6efe0", stroke: C.encre, "stroke-width": 2.5 }, g);
        var r = BIO.hasard(3);
        for (var i = 0; i < 9; i++) for (var k = 0; k < 5; k++) {
          var x = 110 + i * 58 + (r() - 0.5) * 12, y = 190 + k * 56 + (r() - 0.5) * 12;
          D.rond(g, [x, y], 20, { fill: PLATEFORME.teinte(0.75), stroke: C.encre, ep: 1.5 });
        }
        D.texte(g, "fibres : le renfort", [470, 110], { taille: 20, coul: C.jeu });
        D.ligne(g, [470, 124], [452, 178], C.jeu, 2);
        D.texte(g, "la matrice", [160, 490], { taille: 20, coul: "#9b8459" });
        D.ligne(g, [160, 474], [168, 444], "#9b8459", 2);
        fig.chip("plaque composite vue en coupe");
      } else if (n.mode === "barres") {
        var x0 = 240, u = 2.55;
        D.texte(g, "module spécifique E / ρ (GPa par g/cm³)", [340, 100], { taille: 18 });
        BARRES.forEach(function (b, i) {
          var y = 150 + i * 90, v = b.E / b.r, comp = i === 3;
          D.texte(g, b.nom, [x0 - 14, y + 22], { taille: 16, ancre: "end" });
          E.s("rect", { x: x0, y: y, width: (comp && !n.vu) ? 0 : v * u, height: 44, rx: 8, fill: comp ? C.jeu : "#9aa0ad" }, g);
          D.texte(g, comp && !n.vu ? "?" : E.fmt(v, 1), [x0 + ((comp && !n.vu) ? 0 : v * u) + 14, y + 22], { taille: 18, ancre: "start", mono: true });
        });
        fig.chip("valeurs du tableau du cours");
      } else {
        // formes du renfort : roving, mat, tissu
        D.texte(g, "roving", [150, 110], { taille: 20 });
        for (var j = 0; j < 9; j++) D.ligne(g, [60, 140 + j * 11], [240, 140 + j * 11], C.jeu, 5);
        D.texte(g, "mat (fibres coupées + liant)", [470, 110], { taille: 20 });
        var rr = BIO.hasard(11);
        for (j = 0; j < 55; j++) { var cx = 320 + rr() * 280, cy = 140 + rr() * 110, a = rr() * Math.PI; D.ligne(g, [cx, cy], [cx + 44 * Math.cos(a), cy + 44 * Math.sin(a)], C.jeu, 3.5); }
        D.texte(g, "tissu : fils de chaîne et de trame", [340, 310], { taille: 20 });
        for (j = 0; j < 10; j++) E.s("rect", { x: 150 + j * 40, y: 335, width: 22, height: 200, fill: "#9aa0ad" }, g);
        for (j = 0; j < 9; j++) E.s("rect", { x: 134, y: 348 + j * 21, width: 410, height: 12, fill: PLATEFORME.teinte(0.85) }, g);
        for (j = 0; j < 10; j++) for (var m = 0; m < 9; m++) if ((j + m) % 2 === 0) E.s("rect", { x: 150 + j * 40, y: 346 + m * 21, width: 22, height: 16, fill: "#9aa0ad" }, g);
        D.texte(g, "chaîne", [560, 380], { taille: 18, coul: C.doux, ancre: "start" });
        D.texte(g, "trame", [560, 420], { taille: 18, coul: C.jeu, ancre: "start" });
        fig.chip(null);
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Renfort ou matrice", jouer: function (j, n) {
      j.fig.astuce("La main prothétique du cours est en composite à fibres de carbone.");
      j.titre("Range chaque constituant : renfort ou matrice ?");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><b>Renfort</b><b>Matrice</b>' + [0, 1, 2].map(function () { return '<span class="trou" data-attendu="r"></span><span class="trou" data-attendu="m"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "m", html: "Résine époxy" }, { id: "r", html: "Fibres de carbone" }, { id: "m", html: "Polypropylène" }, { id: "r", html: "Aramide" }, { id: "r", html: "Fibres de verre" }, { id: "m", html: "Céramique" }],
        aide: "Le renfort porte les efforts (fibres) ; la matrice est le matériau de support qui les lie. Une céramique peut servir de matrice (matrices minérales).",
        ok: function () {
          j.bravo("Fibres d'un côté, matériaux de support de l'autre.");
          j.expliquer("<p>Un <b>composite</b> est la combinaison macroscopique de deux ou plusieurs matériaux ; le terme désigne surtout un <b>renfort</b> de fibres lié par un matériau de support, la <b>matrice</b>. Matrices organiques (thermodurcissables, thermoplastiques, élastomères) ou minérales (céramiques, métalliques).</p>");
          j.suite();
        }
      });
    } },
    { nom: "Définition ASTM", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("ASTM D3878 : deux matériaux ou plus, insolubles l'un dans l'autre, qui ont ensemble des propriétés qu'aucun n'a seul. Lequel est un composite ?");
      j.choix([
        { html: "L'alliage Ti-6Al-4V", aide: "Dans un alliage, les éléments sont dissous dans le même cristal : ils ne restent pas insolubles l'un dans l'autre." },
        { html: "Le béton armé", juste: true },
        { html: "Un polyéthylène pur", aide: "Un seul matériau : il n'y a rien à combiner." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Le béton armé : acier et béton gardent leur identité.");
        j.expliquer("<p>Le cours donne trois couples : céramique-polymère (plastique renforcé de fibres de verre), métal-polymère (pneu : fils d'acier et caoutchouc), céramique-métal (béton armé). Les constituants ne se mélangent pas.</p>");
        j.suite();
      } });
    } },
    { nom: "Grande diffusion ou hautes performances", jouer: function (j, n) {
      j.titre("Range chaque phrase : composite de grande diffusion (GD) ou à hautes performances (HP) ?");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><b>GD</b><b>HP</b>' + [0, 1].map(function () { return '<span class="trou" data-attendu="g"></span><span class="trou" data-attendu="h"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "h", html: "Carbone ou aramide" }, { id: "g", html: "95 % des composites" }, { id: "h", html: "Aéronautique, spatial" }, { id: "g", html: "Polyester et verre" }],
        aide: "GD : bon marché, grande série, résine polyester et fibre de verre. HP : propriétés spécifiques élevées, coût unitaire important.",
        ok: function () { j.bravo("GD pour la série, HP pour la performance."); j.suite(); }
      });
    } },
    { nom: "Rigidité par unité de masse", jouer: function (j, n) {
      n.mode = "barres"; n.vu = false; n.dessin();
      j.fig.astuce("Tableau du cours : carbone HM-époxy UD, 1,63 g/cm³ et 215 GPa.");
      j.titre("Calcule le module spécifique E / ρ du carbone-époxy haut module.");
      j.nombre({ avant: "E/\\rho =", cases: [{ attendu: 131.9, tol: 0.6 }], ligne: true,
        aide: function () { return "Divise 215 par 1,63."; },
        ok: function () {
          n.vu = true; n.dessin();
          j.bravo("215 / 1,63 ≈ 131,9 : cinq fois l'acier, à module presque égal.");
          j.expliquer("<p>À rigidité égale, la pièce composite est bien plus légère : c'est la raison des composites en aéronautique (50 % de la masse du Boeing 787) et d'une main prothétique en carbone.</p>");
          j.suite();
        } });
    } },
    { nom: "La bonne forme de fibre", jouer: function (j, n) {
      n.mode = "formes"; n.dessin();
      j.fig.astuce("Formes des fibres de verre ou de carbone.");
      j.titre("On injecte un thermoplastique chargé de fibres. Quelle forme de fibre ?");
      j.choix([
        { html: "Fibres broyées, moins de 1 mm", juste: true },
        { html: "Fibres coupées de 3 à 12 mm", aide: "Le cours associe ces fibres aux résines thermodurcissables." },
        { html: "Un tissu sergé", aide: "Un tissu se drape dans un moule ; il ne passe pas dans une vis d'injection avec la matière." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Broyées pour les thermoplastiques, coupées pour les thermodurcissables.");
        j.expliquer("<p>Le <b>roving</b> est un assemblage de plusieurs fibres, qu'on peut tisser. Un <b>mat</b> est une feuille de fibres coupées ou continues retenues par un liant. Un <b>tissu</b> entrecroise fils de chaîne et fils de trame (armure, satin, sergé, taffetas).</p>");
        j.suite();
      } });
    } }
  ]
});
