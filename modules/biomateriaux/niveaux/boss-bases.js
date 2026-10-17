/* Boss du chapitre 0 : essai de traction sur une éprouvette de Ti-6Al-4V (exemple ajouté, valeurs du tableau du cours). */
NIVEAU({
  id: "boss-bases",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { fiche: {}, F: 0 };
    n.dessin = function () {
      E.vider(g);
      // machine de traction verticale (centrée en x = 200)
      var dx = -140;
      E.s("rect", { x: 150 + dx, y: 110, width: 380, height: 34, rx: 8, fill: "#9aa0ad" }, g);
      E.s("rect", { x: 150 + dx, y: 490, width: 380, height: 34, rx: 8, fill: "#9aa0ad" }, g);
      E.s("rect", { x: 170 + dx, y: 144, width: 22, height: 346, fill: "#c6cbd8" }, g);
      E.s("rect", { x: 488 + dx, y: 144, width: 22, height: 346, fill: "#c6cbd8" }, g);
      E.s("rect", { x: 300 + dx, y: 144, width: 80, height: 60, rx: 8, fill: "#b9c0cc", stroke: C.encre, "stroke-width": 2 }, g);
      E.s("rect", { x: 300 + dx, y: 430, width: 80, height: 60, rx: 8, fill: "#b9c0cc", stroke: C.encre, "stroke-width": 2 }, g);
      E.s("rect", { x: 318 + dx, y: 200, width: 44, height: 40, fill: "#d5dae3", stroke: C.encre, "stroke-width": 2 }, g);
      E.s("rect", { x: 318 + dx, y: 394, width: 44, height: 40, fill: "#d5dae3", stroke: C.encre, "stroke-width": 2 }, g);
      E.s("rect", { x: 330 + dx, y: 240, width: 20, height: 154, fill: "#d5dae3", stroke: C.encre, "stroke-width": 2 }, g);
      D.ligne(g, [312 + dx, 267], [368 + dx, 267], C.jeu, 3); D.ligne(g, [312 + dx, 367], [368 + dx, 367], C.jeu, 3);
      D.texte(g, "l0 = 50 mm", [258, 306], { taille: 17, ancre: "start", coul: C.jeu });
      D.texte(g, "S0 = 20 mm²", [258, 330], { taille: 17, ancre: "start", coul: C.jeu });
      if (n.F) { D.fleche(g, [200, 108], [200, 62], "#3b5bdb", 7); D.texte(g, n.F + " N", [216, 74], { taille: 19, coul: "#3b5bdb", ancre: "start" }); }
      // fiche d'essai
      E.s("rect", { x: 420, y: 130, width: 240, height: 360, rx: 18, fill: "#fff", stroke: "#d9dde6", "stroke-width": 2 }, g);
      D.texte(g, "Fiche d'essai", [540, 162], { taille: 20 });
      D.texte(g, "exemple ajouté", [540, 188], { taille: 14, coul: C.doux, gras: false });
      var f = n.fiche;
      [["σ", f.s], ["ε", f.e], ["E", f.E], ["Fmax", f.F], ["m", f.m], ["G", f.G]].forEach(function (l, i) {
        var y = 232 + i * 44;
        D.texte(g, l[0], [444, y], { taille: 19, ancre: "start", italique: true });
        D.texte(g, l[1] || "?", [640, y], { taille: 19, ancre: "end", mono: true, coul: l[1] ? C.ok : C.gris });
        if (i < 5) D.ligne(g, [440, y + 22], [644, y + 22], "#eef0f5", 1.5);
      });
      fig.chip(null);
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Contrainte", jouer: function (j, n) {
      n.F = 4400; n.dessin();
      j.fig.astuce("");
      j.titre("Une éprouvette de Ti-6Al-4V pour tige de hanche est tirée par 4 400 N. Quelle contrainte ?");
      j.consigne("Boss : chaque erreur compte.");
      j.nombre({ avant: "\\sigma =", apres: "\\text{MPa}", cases: [{ attendu: 220, tol: 0.5 }], ligne: true,
        aide: function () { return "σ = F / S0."; },
        ok: function () { n.fiche.s = "220 MPa"; n.dessin(); j.bravo("220 MPa."); j.suite(); } });
    } },
    { nom: "Déformation", jouer: function (j, n) {
      j.titre("L'extensomètre mesure Δl = 0,1 mm sur la longueur utile. Quelle déformation ε (sans unité) ?");
      j.nombre({ avant: "\\varepsilon =", cases: [{ attendu: 0.002, tol: 0.00001 }], ligne: true,
        aide: function () { return "ε = Δl / l0, avec les deux longueurs en mm."; },
        ok: function () { n.fiche.e = "0,002"; n.dessin(); j.bravo("0,1 / 50 = 0,002, soit 0,2 %."); j.suite(); } });
    } },
    { nom: "Module", jouer: function (j, n) {
      j.titre("Ce point est sur la droite de Hooke. Quel module E, en GPa ? Compare au tableau du cours.");
      j.nombre({ avant: "E =", apres: "\\text{GPa}", cases: [{ attendu: 110, tol: 0.5 }], ligne: true,
        aide: function () { return "E = σ / ε en MPa, puis divise par 1 000."; },
        ok: function () { n.fiche.E = "110 GPa"; n.dessin(); j.bravo("110 GPa, comme le Ti-6Al-4V du tableau."); j.suite(); } });
    } },
    { nom: "Force maximale", jouer: function (j, n) {
      j.titre("Le tableau du cours donne une résistance en traction de 1 171 MPa. Quelle force maximale l'éprouvette supporte-t-elle ?");
      j.nombre({ avant: "F_{max} =", apres: "\\text{N}", cases: [{ attendu: 23420, tol: 1 }], ligne: true,
        aide: function () { return "Retourne la formule de la contrainte : F = σ × S0."; },
        ok: function () { n.fiche.F = "23 420 N"; n.dessin(); j.bravo("F = 1 171 × 20 = 23 420 N."); j.suite(); } });
    } },
    { nom: "Masse", jouer: function (j, n) {
      j.titre("La partie utile mesure 50 mm de long pour 20 mm² de section. Quelle est sa masse (ρ = 4,43 g/cm³) ?");
      j.nombre({ avant: "m =", apres: "\\text{g}", cases: [{ attendu: 4.43, tol: 0.01 }], ligne: true,
        aide: function () { return "V = 50 × 20 mm³ ; 1 cm³ = 1 000 mm³."; },
        ok: function () { n.fiche.m = "4,43 g"; n.dessin(); j.bravo("V = 1 000 mm³ = 1 cm³, donc m = 4,43 g."); j.suite(); } });
    } },
    { nom: "Cisaillement", jouer: function (j, n) {
      j.titre("Le titane est isotrope. Avec ν = 0,34 (exemple ajouté), quel module de cisaillement G ?");
      j.nombre({ avant: "G = \\dfrac{E}{2(1+\\nu)} =", apres: "\\text{GPa}", cases: [{ attendu: 41.04, tol: 0.1 }], ligne: true,
        aide: function () { return "2 × (1 + 0,34) = 2,68 ; divise E = 110 GPa par ce nombre."; },
        ok: function () {
          n.fiche.G = "41 GPa"; n.dessin();
          j.bravo("G = 110 / 2,68 ≈ 41 GPa.");
          j.expliquer("<p>Pour un matériau isotrope, deux constantes suffisent parmi \\(E\\), \\(\\nu\\) et \\(G\\) : la troisième s'en déduit par \\(G = E / (2(1+\\nu))\\). Ce ne sera plus vrai pour un composite (chapitre 6).</p>");
          j.suite();
        } });
    } }
  ]
});
