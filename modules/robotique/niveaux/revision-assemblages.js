/* Révision du chapitre 6 : un robot de rééducation du poignet (exemple ajouté). Positionner, serrer, clavette, trouver l'erreur, ressort. */
NIVEAU({
  id: "revision-assemblages",
  init: function (fig) {
    var C = D.C, M = MECA, g = E.s("g", null, fig.svg);
    var n = { mode: "bride", goupilles: false, F: false };
    var GR = "#5b6172";
    function coupe(x, y, w, h, angle) { return E.s("rect", { x: x, y: y, width: w, height: h, fill: M.hachures(g, GR, { fond: "#fff", angle: angle }), stroke: C.encre, "stroke-width": 2.5 }, g); }
    function plein(x, y, w, h, rx, f) { return E.s("rect", { x: x, y: y, width: w, height: h, rx: rx || 0, fill: f || "#dfe3ea", stroke: C.encre, "stroke-width": 2.5 }, g); }
    function filets(x, y0, y1, w) { for (var y = y0; y < y1; y += 8) D.ligne(g, [x, y], [x + w, y + 4], C.encre, 1.1); }
    function txt(t, p, a) { D.texte(g, t, p, { taille: 17, coul: C.doux, gras: false, ancre: a || "middle" }); }
    n.dessin = function () {
      E.vider(g);
      var yc = 320;
      if (n.mode === "bride") {
        // moteur bridé sur le bâti, aligné avec le réducteur
        coupe(330, 100, 50, 440, 45); // bâti (paroi)
        plein(90, 210, 200, 220, 14); txt("moteur", [190, 270]);
        coupe(290, 170, 40, 300, -45); // bride du moteur
        plein(380, 250, 200, 140, 10, "#f1e3ff"); txt("réducteur", [480, 285]);
        D.ligne(g, [330, yc], [380, yc], C.encre, 10); M.traitAxe(g, [60, yc], [620, yc]);
        [205, 435].forEach(function (y) { E.s("rect", { x: 290, y: y - 12, width: 90, height: 24, fill: "#fff" }, g); plein(250, y - 18, 40, 36, 4); plein(290, y - 10, 82, 20); filets(340, y - 10, y + 8, 30); });
        if (n.goupilles) [255, 385].forEach(function (y) { E.s("rect", { x: 295, y: y - 9, width: 70, height: 18, rx: 8, fill: "#d5f2e5", stroke: C.ok, "stroke-width": 3 }, g); });
        txt("bâti du robot", [355, 80]); txt("vis", [240, 190], "end");
        if (n.goupilles) D.texte(g, "goupilles", [400, 225], { coul: C.ok, taille: 18, ancre: "start" });
      } else if (n.mode === "visse") {
        coupe(140, 200, 400, 90, 45); coupe(140, 290, 400, 150, -45);
        E.s("rect", { x: 320, y: 200, width: 40, height: 90, fill: "#fff" }, g);
        E.s("rect", { x: 325, y: 290, width: 30, height: 110, fill: "#fff" }, g);
        plein(325, 190, 30, 205); filets(325, 300, 392, 30); plein(296, 150, 88, 42, 6);
        D.texte(g, "M5", [400, 170], { taille: 22, coul: C.jeu, ancre: "start" });
        txt("support d'attelle", [150, 182], "start"); txt("bras du robot", [150, 462], "start");
      } else if (n.mode === "clavette") {
        var O = [340, 320];
        E.s("circle", { cx: O[0], cy: O[1], r: 180, fill: M.hachures(g, GR, { fond: "#fff", angle: -45 }), stroke: C.encre, "stroke-width": 2.5 }, g);
        E.s("circle", { cx: O[0], cy: O[1], r: 100, fill: M.hachures(g, GR, { fond: "#fff", angle: 45, pas: 12 }), stroke: C.encre, "stroke-width": 2.5 }, g);
        plein(O[0] - 30, O[1] - 130, 60, 60, 0, "#ffe9c7");
        D.fleche(g, [O[0] - 150, O[1] - 100], [O[0] - 32, O[1] - 100], C.v, 6); D.texte(g, "Ft", [O[0] - 160, O[1] - 126], { coul: C.v, taille: 22 });
        txt("arbre d = 10 mm", [O[0], O[1] + 20]); txt("moyeu de la poulie", [O[0], O[1] + 205]);
      } else if (n.mode === "montage") {
        // arbre, roue clavetée, épaulement, anneau élastique, vis sur méplat
        M.arbre(g, 40, 230, yc, 80); M.arbre(g, 230, 640, yc, 58);
        coupe(230, yc - 200, 170, 142, 45); coupe(230, yc + 58, 170, 142, -45);
        plein(250, yc - 70, 130, 24, 0, "#ffe9c7"); txt("clavette", [315, yc - 120]);
        E.s("rect", { x: 410, y: yc - 74, width: 12, height: 36, rx: 2, fill: "#9aa0ad", stroke: C.encre, "stroke-width": 2 }, g);
        E.s("rect", { x: 410, y: yc + 38, width: 12, height: 36, rx: 2, fill: "#9aa0ad", stroke: C.encre, "stroke-width": 2 }, g);
        txt("anneau élastique", [432, yc - 104], "start");
        E.s("rect", { x: 282, y: yc + 50, width: 68, height: 10, fill: "#fff" }, g); D.ligne(g, [282, yc + 50], [350, yc + 50], C.encre, 2.5); plein(305, yc + 50, 22, 150); txt("vis sur méplat", [340, yc + 228]);
        txt("épaulement", [222, yc + 118], "end");
      } else {
        // pince de laboratoire : un ressort pousse la mâchoire mobile sur le tube
        plein(160, 120, 300, 30, 4); plein(160, 120, 24, 300, 4); // bâti
        plein(184, 385, 256, 30, 6); // mâchoire fixe
        E.s("circle", { cx: 320, cy: 330, r: 55, fill: "#e8f4ff", stroke: C.encre, "stroke-width": 2.5 }, g); txt("tube", [320, 330]);
        M.ressort(g, [320, 150], [320, 245], { spires: 5, rayon: 30, ep: 5 });
        plein(184, 245, 256, 30, 6, "#e8edff"); // mâchoire mobile
        if (n.F) { D.fleche(g, [500, 190], [500, 258], C.jeu, 6); D.texte(g, "6 N", [516, 220], { coul: C.jeu, taille: 22, ancre: "start" }); }
        txt("ressort comprimé de 4 mm", [310, 92]);
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Remontage", jouer: function (j, n) {
      j.fig.astuce("Exemple ajouté : le moteur d'un robot de rééducation du poignet, bridé sur le bâti.");
      j.titre("Après chaque nettoyage, le moteur doit retrouver exactement son alignement avec le réducteur. Que faut-il ajouter aux deux vis ?");
      j.choix([
        { html: "Deux goupilles de positionnement", juste: true },
        { html: "Deux vis de plus", aide: "Les vis serrent ; elles passent avec du jeu dans leurs trous. Il faut un élément ajusté qui positionne." },
        { html: "Une clavette", aide: "La clavette transmet un couple entre un arbre et un moyeu, elle ne positionne pas une bride." }
      ], { colonnes: 1, ok: function () {
        n.goupilles = true; n.dessin();
        j.bravo("Les goupilles positionnent, les vis serrent.");
        j.suite();
      } });
    } },
    { nom: "Couple de serrage", jouer: function (j, n) {
      n.mode = "visse"; n.dessin();
      j.fig.astuce("Une vis M5 fixe le support d'attelle sur le bras.");
      j.titre("On vise une précharge de 3 kN, avec K = 0,20. Quel couple de serrage ?");
      j.nombre({ avant: "T \\simeq", apres: "\\text{N}\\cdot\\text{m}", cases: [{ attendu: 3, tol: 0.01 }], ligne: true,
        aide: function () { return "M5 : \\(d = 5\\) mm. Unités SI dans \\(T \\simeq K F_0 d\\)."; },
        ok: function () { j.bravo("T ≃ 0,20 × 3000 × 0,005 = 3 N·m."); j.suite(); } });
    } },
    { nom: "Clavette", jouer: function (j, n) {
      n.mode = "clavette"; n.dessin();
      j.fig.astuce("La poulie du câble est clavetée sur l'arbre.");
      j.titre("C = 5 N·m sur un arbre de 10 mm, clavette b = 3 mm, L = 12 mm. Calcule \\(F_t\\) puis \\(\\tau\\).");
      j.nombre({ avant: "F_t,\\ \\tau :", cases: [{ attendu: 1000, tol: 2 }, { attendu: 27.78, tol: 0.1 }], ligne: true,
        aide: function (k) { return k === 0 ? "\\(F_t = 2C/d\\)." : "\\(\\tau \\simeq F_t / (bL)\\), en MPa avec des mm."; },
        ok: function () { j.bravo("1000 N et environ 27,8 MPa."); j.suite(); } });
    } },
    { nom: "Trouve l'erreur", jouer: function (j, n) {
      n.mode = "montage"; n.dessin();
      j.fig.astuce("Une roue montée sur un arbre.");
      j.titre("Voici la justification d'un camarade. Quelle phrase est fausse ?");
      j.choix([
        { html: "« La clavette transmet le couple de l'arbre à la roue. »", aide: "Juste : c'est le rôle de la clavette." },
        { html: "« L'anneau élastique empêche la roue de glisser le long de l'arbre. »", aide: "Juste : il maintient axialement." },
        { html: "« La vis sur méplat garantit la position axiale précise de la roue. »", juste: true }
      ], { colonnes: 1, ok: function () {
        j.bravo("La vis sur méplat ne retient que par frottement : c'est l'épaulement qui positionne.");
        j.suite();
      } });
    } },
    { nom: "Ressort", jouer: function (j, n) {
      n.mode = "pince"; n.F = true; n.dessin();
      j.fig.astuce("Une pince de laboratoire serre un tube grâce à un ressort.");
      j.titre("La mâchoire doit serrer le tube avec 6 N quand le ressort est comprimé de 4 mm. Quelle raideur choisir ?");
      j.nombre({ avant: "k =", apres: "\\text{N/mm}", cases: [{ attendu: 1.5, tol: 0.01 }], ligne: true,
        aide: function () { return "Dans le domaine linéaire, \\(F = kx\\)."; },
        ok: function () { j.bravo("k = 6 / 4 = 1,5 N/mm."); j.suite(); } });
    } }
  ]
});
