/* Niveau : assemblage vissé préchargé. Traction et compression, quatre éléments filetés, T ≃ K F0 d, influence de K, matériaux tendres. */
NIVEAU({
  id: "assemblage-visse",
  init: function (fig) {
    var C = D.C, M = MECA, g = E.s("g", null, fig.svg);
    var n = { mode: "joint", F0: 0, fleches: false, K: 0.2, insert: false };
    var GR = "#5b6172";
    function coupe(x, y, w, h, angle, coul) { return E.s("rect", { x: x, y: y, width: w, height: h, fill: M.hachures(g, coul || GR, { fond: "#fff", angle: angle }), stroke: C.encre, "stroke-width": 2.5 }, g); }
    function plein(x, y, w, h, rx) { return E.s("rect", { x: x, y: y, width: w, height: h, rx: rx || 0, fill: "#dfe3ea", stroke: C.encre, "stroke-width": 2.5 }, g); }
    function filets(x, y0, y1, w) { for (var y = y0; y < y1; y += 8) D.ligne(g, [x, y], [x + w, y + 4], C.encre, 1.1); }
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "joint") {
        // boulon : vis, deux pièces serrées, écrou
        coupe(120, 210, 440, 110, 45); coupe(120, 320, 440, 110, -45);
        if (n.mode2) D.texte(g, "carter en aluminium", [560, 452], { taille: 17, coul: C.doux, gras: false, ancre: "end" });
        E.s("rect", { x: 316, y: 210, width: 48, height: 220, fill: "#fff" }, g);
        plein(322, 200, 36, 290); filets(322, 400, 488, 36);
        plein(285, 160, 110, 50, 4); plein(285, 430, 110, 46, 4);
        D.ligne(g, [321, 160], [321, 210], C.encre, 1.2); D.ligne(g, [359, 160], [359, 210], C.encre, 1.2);
        D.ligne(g, [321, 430], [321, 476], C.encre, 1.2); D.ligne(g, [359, 430], [359, 476], C.encre, 1.2);
        if (n.fleches) {
          var k = Math.min(1.6, n.F0 / 4000), Lf = 30 + 50 * k, ep = 3 + 3 * k;
          // vis tendue : tirée vers le haut à la tête, vers le bas à l'écrou
          D.fleche(g, [340, 150], [340, 150 - Lf], C.v, ep); D.fleche(g, [340, 486], [340, 486 + Lf], C.v, ep);
          // pièces comprimées : poussées vers le plan de joint
          [210, 470].forEach(function (x) { D.fleche(g, [x, 210 - Lf - 6], [x, 204], C.z, ep); D.fleche(g, [x, 430 + Lf + 6], [x, 436], C.z, ep); });
          D.texte(g, "vis tendue", [410, 120], { coul: C.v, taille: 18, ancre: "start" });
          D.texte(g, "pièces comprimées", [500, 548], { coul: C.z, taille: 18 });
        }
        D.texte(g, "vis", [278, 185], { taille: 17, coul: C.doux, gras: false, ancre: "end" });
        D.texte(g, "écrou", [278, 455], { taille: 17, coul: C.doux, gras: false, ancre: "end" });
        D.texte(g, "plan de joint", [568, 320], { taille: 16, coul: C.doux, gras: false, ancre: "start" });
        if (n.insert) { E.s("rect", { x: 314, y: 330, width: 52, height: 90, fill: "none", stroke: C.jeu, "stroke-width": 4, rx: 4 }, g); D.texte(g, "insert fileté", [372, 405], { coul: C.jeu, taille: 18, ancre: "start" }); }
      } else {
        // quatre éléments filetés, en coupe
        var cases = { A: [30, 40], B: [360, 40], C: [30, 320], D: [360, 320] };
        Object.keys(cases).forEach(function (k) {
          var o = cases[k], x = o[0], y = o[1];
          E.s("rect", { x: x, y: y, width: 300, height: 260, rx: 16, fill: "#fafbfd", stroke: C.pale, "stroke-width": 2 }, g);
          D.texte(g, k, [x + 24, y + 26], { taille: 24, coul: C.doux });
          var cx = x + 160;
          if (k === "A") { // vis d'assemblage : traverse la pièce du haut, vissée dans celle du bas
            coupe(x + 50, y + 90, 220, 60, 45); coupe(x + 50, y + 150, 220, 90, -45);
            E.s("rect", { x: cx - 16, y: y + 90, width: 32, height: 60, fill: "#fff" }, g);
            plein(cx - 12, y + 80, 24, 130); filets(cx - 12, y + 160, y + 208, 24); plein(cx - 28, y + 56, 56, 26, 6);
          } else if (k === "B") { // vis de pression : son bout appuie sur la pièce
            coupe(x + 50, y + 70, 220, 70, 45); E.s("rect", { x: x + 50, y: y + 140, width: 220, height: 90, rx: 0, fill: "#e8edf5", stroke: C.encre, "stroke-width": 2.5 }, g);
            E.s("rect", { x: cx - 13, y: y + 70, width: 26, height: 70, fill: "#fff" }, g);
            plein(cx - 12, y + 48, 24, 92); filets(cx - 12, y + 70, y + 136, 24); D.ligne(g, [cx - 6, y + 48], [cx + 6, y + 48], C.encre, 4);
            D.fleche(g, [cx + 40, y + 100], [cx + 40, y + 138], C.v, 4);
          } else if (k === "C") { // boulon : vis + écrou, deux pièces percées
            coupe(x + 50, y + 80, 220, 60, 45); coupe(x + 50, y + 140, 220, 60, -45);
            E.s("rect", { x: cx - 16, y: y + 80, width: 32, height: 120, fill: "#fff" }, g);
            plein(cx - 12, y + 66, 24, 168); filets(cx - 12, y + 200, y + 232, 24);
            plein(cx - 30, y + 46, 60, 34, 4); plein(cx - 30, y + 200, 60, 28, 4);
          } else { // goujon : implanté à fond dans la pièce du bas, écrou en haut
            coupe(x + 50, y + 110, 220, 50, 45); coupe(x + 50, y + 160, 220, 80, -45);
            E.s("rect", { x: cx - 16, y: y + 110, width: 32, height: 50, fill: "#fff" }, g);
            plein(cx - 12, y + 50, 24, 160); filets(cx - 12, y + 50, y + 82, 24); filets(cx - 12, y + 166, y + 208, 24);
            plein(cx - 30, y + 80, 60, 30, 4);
          }
        });
      }
      fig.chip(n.mode === "joint" && n.chip ? n.chip : null);
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Traction ou compression", jouer: function (j, n) {
      j.fig.astuce("Un boulon serre deux pièces.");
      j.titre("On serre l'écrou. Prédis : comment travaillent la vis et les pièces serrées ?");
      j.choix([
        { html: "Vis tendue, pièces comprimées", juste: true },
        { html: "Vis comprimée, pièces tendues", aide: "L'écrou se rapproche de la tête : la vis est étirée entre les deux, et les pièces sont pincées entre elles." },
        { html: "Vis et pièces cisaillées", aide: "Le serrage agit selon l'axe de la vis, pas en travers." }
      ], { colonnes: 1, ok: function () {
        n.F0 = 4000; n.fleches = true; n.dessin();
        j.bravo("La vis travaille en traction, les pièces en compression.");
        j.expliquer("<p>Dans un assemblage vissé préchargé, cette force de serrage initiale est la <b>précharge</b> \\(F_0\\). Si elle est suffisante, les surfaces restent en contact, et le frottement au plan de joint reprend une partie des efforts transversaux.</p>");
        j.suite();
      } });
    } },
    { nom: "Quatre éléments", jouer: function (j, n) {
      n.mode = "types"; n.dessin();
      j.fig.astuce("Quatre éléments d'assemblage vissé, en coupe.");
      j.titre("Nomme chaque élément fileté.");
      var z = j.zone("", ["A", "B", "C", "D"].map(function (k, i) { return '<div style="display:flex;align-items:center;gap:12px;margin:6px 0"><b style="width:22px;font-size:20px">' + k + '</b><span class="trou" data-attendu="' + ["assemblage", "pression", "boulon", "goujon"][i] + '" style="min-width:220px;min-height:54px"></span></div>'; }).join(""));
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "goujon", html: "goujon" }, { id: "boulon", html: "boulon" }, { id: "assemblage", html: "vis d'assemblage" }, { id: "pression", html: "vis de pression" }],
        aide: "Regarde s'il y a un écrou, et où la vis est vissée : dans une pièce, ou en appui par son bout.",
        ok: function () {
          j.bravo("A vis d'assemblage, B vis de pression, C boulon, D goujon.");
          j.expliquer("<p>Vis, boulons et écrous assemblent plusieurs pièces par serrage tout en permettant en général le démontage. La vis d'assemblage se visse dans une pièce taraudée ; la vis de pression appuie par son bout ; le boulon associe une vis et un écrou ; le goujon est bloqué à fond de filet dans la pièce d'implantation et reçoit un écrou.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Couple de serrage", jouer: function (j, n) {
      n.mode = "joint"; n.F0 = 4000; n.fleches = true; n.chip = "M6 · F₀ = 4 kN · K = 0,20"; n.dessin();
      j.fig.astuce("Vis M6 : diamètre nominal d = 6 mm.");
      j.titre("On veut une précharge de 4 kN sur une vis M6, avec K = 0,20. Quel couple de serrage T ?");
      j.nombre({ avant: "T \\simeq", apres: "\\text{N}\\cdot\\text{m}", cases: [{ attendu: 4.8, tol: 0.01 }], ligne: true,
        aide: function () { return "\\(T \\simeq K F_0 d\\), avec \\(F_0\\) en N et \\(d\\) en m."; },
        ok: function () {
          j.bravo("4,8 N·m.");
          j.expliquer("\\[ T \\simeq K F_0 d = 0{,}20 \\times 4000 \\times 0{,}006 = 4{,}8 \\text{ N}\\cdot\\text{m} \\]<p>\\(K\\) est un coefficient empirique : il dépend du frottement, du revêtement et de la lubrification. Ce n'est pas une constante universelle.</p>");
          j.suite();
        } });
    } },
    { nom: "Même couple, autre K", jouer: function (j, n) {
      n.chip = "M6 · T = 4,8 N·m"; n.dessin();
      j.fig.astuce("Bouge K : la longueur des flèches suit la précharge.");
      j.titre("Même couple de 4,8 N·m, mais la vis est lubrifiée : K = 0,15. Quelle précharge F₀ ?");
      j.curseur({ nom: "K", min: 0.10, max: 0.30, pas: 0.01, val: 0.20, dec: 2, change: function (v) { n.F0 = 4.8 / (v * 0.006); n.dessin(); } });
      j.nombre({ avant: "F_0 \\simeq", apres: "\\text{kN}", cases: [{ attendu: 5.333, tol: 0.02 }], ligne: true,
        aide: function () { return "Isole \\(F_0\\) : \\(F_0 = T / (K d)\\), puis passe en kN."; },
        ok: function () {
          n.F0 = 5333; n.dessin();
          j.bravo("Environ 5,33 kN : un tiers de plus pour le même couple.");
          j.expliquer("<p>La relation \\(T \\simeq K F_0 d\\) est une approximation. Un même couple peut donner des précharges différentes si l'état de surface change. Pour une liaison critique, on utilise une méthode de serrage validée et les valeurs de la documentation technique.</p>");
          j.suite();
        } });
    } },
    { nom: "Matériau tendre", jouer: function (j, n) {
      n.mode2 = true; n.fleches = false; n.chip = null; n.dessin();
      j.fig.astuce("La pièce du bas est maintenant un carter en aluminium.");
      j.titre("Le capot d'un robot de laboratoire est vissé dans un carter en aluminium et démonté chaque semaine. Quel est le risque, et que faire ?");
      j.choix([
        { html: "Le taraudage du carter s'use : on pose un insert fileté métallique", juste: true },
        { html: "La vis casse : on prend une vis plus grosse", aide: "Le point faible n'est pas la vis en acier : regarde la pièce dans laquelle elle est vissée." },
        { html: "Aucun risque : on serre plus fort", aide: "Serrer plus fort charge encore plus le filetage de la pièce tendre." }
      ], { colonnes: 1, ok: function () {
        n.insert = true; n.dessin();
        j.bravo("Insert fileté : meilleure tenue et montage répétable.");
        j.expliquer("<p>La résistance d'un assemblage fileté dépend aussi de la pièce taraudée. Dans un carter en aluminium, en polymère ou imprimé en 3D, le taraudage peut être le point faible. En cas de démontages fréquents, un insert fileté métallique améliore la tenue et la répétabilité du montage.</p>");
        j.suite();
      } });
    } }
  ]
});
