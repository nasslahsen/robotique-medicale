/* Révision du chapitre 0 : contrainte avec conversion d'unités, courbe de traction, échelle log, mélange. */
NIVEAU({
  id: "revision-bases",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { mode: "vis" };
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "vis") {
        // vis d'ostéosynthèse tirée hors de l'os
        E.s("rect", { x: 40, y: 220, width: 600, height: 180, rx: 40, fill: "#f4e9d8", stroke: "#c9b48f", "stroke-width": 3 }, g);
        D.texte(g, "os", [80, 430], { taille: 20, coul: "#9b8459" });
        E.s("rect", { x: 200, y: 288, width: 380, height: 44, fill: "#c9ced8", stroke: C.encre, "stroke-width": 2.5 }, g);
        for (var x = 210; x < 575; x += 22) D.ligne(g, [x, 288], [x + 12, 332], C.encre, 2.5);
        E.s("rect", { x: 156, y: 262, width: 48, height: 96, rx: 8, fill: "#b9c0cc", stroke: C.encre, "stroke-width": 2.5 }, g);
        D.fleche(g, [150, 310], [30, 310], "#3b5bdb", 8);
        D.texte(g, "F = 3 000 N", [96, 270], { taille: 22, coul: "#3b5bdb" });
        D.ligne(g, [400, 282], [400, 200], C.gris, 1.5, "4 4");
        D.texte(g, "section du noyau : 0,2 cm²", [400, 180], { taille: 21 });
        fig.chip("exemple ajouté");
      } else if (n.mode === "log") {
        var X0 = 300, Y = function (l) { return 520 - (l - 6) * 64; };
        D.fleche(g, [X0, Y(5.8)], [X0, Y(12.2)], C.encre, 4);
        for (var k = 6; k <= 12; k++) { D.ligne(g, [X0 - 14, Y(k)], [X0 + 14, Y(k)], C.encre, 3); D.texte(g, "log E = " + k, [X0 - 26, Y(k)], { taille: 17, ancre: "end", mono: true, gras: false });
          if (k < 12) for (var m = 2; m < 10; m++) D.ligne(g, [X0 - 6, Y(k + Math.log10(m))], [X0 + 6, Y(k + Math.log10(m))], C.gris, 1.5); }
        var l5 = Math.log10(5e8);
        D.rond(g, [X0, Y(l5)], 10, { fill: "#3b5bdb", stroke: "#fff", ep: 3 });
        D.texte(g, "0,5 GPa", [X0 + 30, Y(l5)], { taille: 19, coul: "#3b5bdb", ancre: "start" });
        if (n.vu) { D.rond(g, [X0, Y(8.5)], 10, { fill: C.jeu, stroke: "#fff", ep: 3 }); D.texte(g, "log E = 8,5", [X0 + 30, Y(8.5) + 6], { taille: 19, coul: C.jeu, ancre: "start" }); }
        fig.chip(null);
      } else if (n.mode === "pente") {
        var O2 = [110, 480];
        D.fleche(g, O2, [620, O2[1]], C.encre, 3); D.fleche(g, O2, [O2[0], 110], C.encre, 3);
        D.texte(g, "ε (%)", [610, O2[1] + 28], { taille: 18 }); D.texte(g, "σ (MPa)", [O2[0] + 16, 130], { taille: 18, ancre: "start" });
        var q = [O2[0] + 0.1 * 3200, O2[1] - 207 * 1.5];
        D.ligne(g, O2, [O2[0] + 0.12 * 3200, O2[1] - 207 * 1.2 * 1.5], C.jeu, 5);
        D.ligne(g, q, [q[0], O2[1]], C.gris, 1.5, "4 4"); D.ligne(g, q, [O2[0], q[1]], C.gris, 1.5, "4 4");
        D.rond(g, q, 9, { fill: "#3b5bdb", stroke: "#fff", ep: 3 });
        D.texte(g, "0,1", [q[0], O2[1] + 24], { taille: 17, mono: true });
        D.texte(g, "207", [O2[0] - 12, q[1]], { taille: 17, mono: true, ancre: "end" });
        D.texte(g, "acier", [q[0] + 34, q[1] + 40], { taille: 19, coul: C.jeu, ancre: "start" });
        fig.chip("droite de Hooke");
      } else if (n.mode === "courbe") {
        var O = [100, 480], P = function (e, s) { return [O[0] + e * 25, O[1] - s * 0.33]; };
        D.fleche(g, O, [640, O[1]], C.encre, 3); D.fleche(g, O, [O[0], 90], C.encre, 3);
        D.texte(g, "ε", [630, O[1] + 26], { taille: 20 }); D.texte(g, "σ (MPa)", [O[0] + 14, 80], { taille: 17, ancre: "start" });
        var pts = [];
        for (var e = 0; e <= 20; e += 0.2) { var s = e < 2 ? 450 * e : 900 + 120 * (1 - Math.pow((14 - Math.min(e, 14)) / 12, 2)) - (e > 14 ? 90 * Math.pow((e - 14) / 6, 2) : 0); pts.push(P(e, s)); }
        E.s("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: C.jeu, "stroke-width": 5 }, g);
        [["1", 1, 450], ["2", 9, 1000], ["3", 19.6, 940]].forEach(function (l) { var p = P(l[1], l[2]); D.rond(g, p, 15, { fill: "#fff", stroke: "#3b5bdb", ep: 3 }); D.texte(g, l[0], p, { taille: 17, coul: "#3b5bdb", fond: false }); });
        fig.chip(null);
      } else {
        var y = 260;
        E.s("rect", { x: 110, y: y, width: 460 * 0.6, height: 120, fill: "#f3f5fa", stroke: C.encre, "stroke-width": 2 }, g);
        E.s("rect", { x: 110 + 460 * 0.6, y: y, width: 460 * 0.4, height: 120, fill: PLATEFORME.teinte(0.35), stroke: C.encre, "stroke-width": 2 }, g);
        D.texte(g, "polypropylène 60 %", [110 + 138, y + 60], { taille: 17 });
        D.texte(g, "verre 40 %", [110 + 276 + 92, y + 60], { taille: 17 });
        D.texte(g, "ρ = 0,91", [248, y + 150], { taille: 16, mono: true, coul: C.doux });
        D.texte(g, "ρ = 2,55", [478, y + 150], { taille: 16, mono: true, coul: C.doux });
        fig.chip("fractions en volume");
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Attention aux unités", jouer: function (j, n) {
      j.fig.astuce("Une vis vissée dans l'os est tirée par 3 000 N.");
      j.titre("Le noyau de la vis a une section de 0,2 cm². Quelle contrainte en MPa ?");
      j.nombre({ avant: "\\sigma =", apres: "\\text{MPa}", cases: [{ attendu: 150, tol: 0.5 }], ligne: true,
        aide: function () { return "Convertis d'abord la section en mm² : 1 cm² = 100 mm²."; },
        ok: function () { j.bravo("0,2 cm² = 20 mm², donc σ = 3 000 / 20 = 150 MPa."); j.suite(); } });
    } },
    { nom: "Lire la courbe", jouer: function (j, n) {
      n.mode = "courbe"; n.dessin();
      j.fig.astuce("");
      j.titre("En quel point peut-on relâcher la charge sans garder d'allongement ?");
      j.choix([{ html: "1", juste: true }, { html: "2", aide: "Le point 2 est au-delà de la droite de Hooke : une déformation permanente reste." }, { html: "3", aide: "Le point 3 est tout près de la rupture." }], { ok: function () {
        j.bravo("Le point 1 est sur la droite de Hooke : domaine élastique.");
        j.suite();
      } });
    } },
    { nom: "Comparer des modules", jouer: function (j, n) {
      n.mode = "log"; n.vu = false; n.dessin();
      j.titre("Un polymère a log E = 8,5 (E en Pa). Est-il plus ou moins rigide qu'un autre à 0,5 GPa ?");
      j.choix([
        { html: "Moins rigide", juste: true },
        { html: "Plus rigide", aide: "Calcule 10^8,5 : c'est 10^8 × 10^0,5." },
        { html: "Aussi rigide", aide: "0,5 GPa = 5 × 10^8 Pa ; compare avec 10^8,5." }
      ], { ok: function () {
        n.vu = true; n.dessin();
        j.bravo("10^8,5 ≈ 3,2 × 10^8 Pa ≈ 0,32 GPa, moins que 0,5 GPa.");
        j.suite();
      } });
    } },
    { nom: "Un composite", jouer: function (j, n) {
      n.mode = "melange"; n.dessin();
      j.fig.astuce("Polypropylène et verre, les valeurs du TD 1.6.");
      j.titre("Quelle est la masse volumique de ce mélange ?");
      j.nombre({ avant: "\\rho =", apres: "\\text{g/cm}^3", cases: [{ attendu: 1.566, tol: 0.005 }], ligne: true,
        aide: function () { return "Pondère chaque masse volumique par sa fraction de volume, puis additionne."; },
        ok: function () { j.bravo("ρ = 0,6 × 0,91 + 0,4 × 2,55 = 1,566 g/cm³."); j.suite(); } });
    } },
    { nom: "Le module", jouer: function (j, n) {
      n.mode = "pente"; n.dessin();
      j.fig.astuce("");
      j.titre("Une éprouvette d'acier sous 207 MPa se déforme de 0,1 %. Quel module, en GPa ?");
      j.nombre({ avant: "E =", apres: "\\text{GPa}", cases: [{ attendu: 207, tol: 0.5 }], ligne: true,
        aide: function () { return "0,1 % = 0,001 ; E = σ / ε, puis 1 GPa = 1 000 MPa."; },
        ok: function () { j.bravo("E = 207 / 0,001 = 207 000 MPa = 207 GPa, la valeur de l'acier dans le tableau du cours."); j.suite(); } });
    } }
  ]
});
