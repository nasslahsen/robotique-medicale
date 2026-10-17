/* Boss du chapitre 5 : l'axe d'un bras chirurgical, du moteur à l'instrument. Vitesses, couple de sortie, jeu, torsion, décision. */
NIVEAU({
  id: "boss-axe",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg), M = window.MECA;
    var n = { trouve: {}, jeu: false, torsion: false, graisse: false };

    n.dessin = function () {
      E.vider(g);
      // fiche de l'axe, en haut
      E.s("rect", { x: 30, y: 24, width: 620, height: 128, rx: 18, fill: "#fafbfd", stroke: C.pale, "stroke-width": 2 }, g);
      var L1 = "moteur : 3000 tr/min, 0,25 N·m", L2 = "réducteur : i = 100, η = 0,7, jeu 0,05°", L3 = "axe : kθ = 5000 N·m/rad, bras L = 0,30 m";
      [L1, L2, L3].forEach(function (t, k) { D.texte(g, t, [52, 58 + k * 34], { taille: 18, mono: true, ancre: "start", gras: false }); });
      // patient, colonne, axe et bras porte-instrument
      E.s("rect", { x: 40, y: 520, width: 600, height: 26, rx: 8, fill: "#d9dde6" }, g);
      E.s("ellipse", { cx: 420, cy: 505, rx: 190, ry: 22, fill: "#f3d2bf", stroke: C.encre, "stroke-width": 2 }, g);
      E.s("rect", { x: 70, y: 260, width: 70, height: 260, rx: 10, fill: "#5b6172" }, g);
      E.s("rect", { x: 50, y: 200, width: 110, height: 80, rx: 14, fill: "#dfe3ea", stroke: C.encre, "stroke-width": 3 }, g);
      D.texte(g, "moteur", [105, 240], { taille: 15, gras: false });
      E.s("rect", { x: 160, y: 205, width: 90, height: 70, rx: 12, fill: n.jeu ? PLATEFORME.teinte(0.25) : "#eef0f5", stroke: C.encre, "stroke-width": 3 }, g);
      M.roue(g, [190, 230], { m: 2.2, Z: 10, fill: "#fff", repere: false, trou: 3 });
      M.roue(g, [190 + 2.2 * 26 / 2, 246], { m: 2.2, Z: 16, rot: Math.PI / 16, fill: "#fff", repere: false, trou: 4 });
      var O = [270, 240], L = 340, a = n.torsion ? 4 * D.DEG : 0;
      D.ligne(g, O, [O[0] + L, O[1]], n.torsion ? "#e3e6ee" : "#c6cbd8", 22);
      if (n.torsion) D.ligne(g, O, [O[0] + L * Math.cos(a), O[1] + L * Math.sin(a)], "#c6cbd8", 22);
      var bout = n.torsion ? [O[0] + L * Math.cos(a), O[1] + L * Math.sin(a)] : [O[0] + L, O[1]];
      D.ligne(g, bout, [bout[0], bout[1] + 170], C.encre, 7);
      D.rond(g, O, 22, { fill: "#fff", stroke: C.encre, ep: 4 }); D.rond(g, O, 7, { fill: C.encre });
      if (n.graisse) E.s("path", { d: "M215 280 q 7 26 0 38 q -7 -12 0 -38 Z", fill: "#c9a227", stroke: C.encre, "stroke-width": 1.5 }, g);
      // résultats trouvés, sous le bras
      var y = 330;
      Object.keys(n.trouve).forEach(function (k) { D.texte(g, n.trouve[k], [300, y], { taille: 19, mono: true, ancre: "start", coul: C.ok }); y += 32; });
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Vitesses", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Un axe de bras porte-instrument, au-dessus du patient. Vitesse angulaire du moteur, puis de la sortie du réducteur ?");
      j.nombre({ avant: "\\omega_m,\\ \\omega_s\\ (\\text{rad/s}) :", cases: [{ attendu: 2 * Math.PI * 3000 / 60, tol: 0.1 }, { attendu: 2 * Math.PI * 3000 / 60 / 100, tol: 0.01 }], ligne: true,
        aide: function (k) { return k === 0 ? "Regarde la ligne moteur de la fiche." : "Regarde le rapport du réducteur."; },
        ok: function () { n.trouve.w = "ωs ≈ 3,14 rad/s"; n.dessin(); j.bravo("314,16 rad/s au moteur, 3,14 rad/s en sortie."); j.suite(); } });
    } },
    { nom: "Couple de sortie", jouer: function (j, n) {
      j.titre("Quel couple maximal l'axe peut-il donner en sortie ?");
      j.nombre({ avant: "C_s \\simeq", apres: "\\text{N}\\cdot\\text{m}", cases: [{ attendu: 0.7 * 100 * 0.25, tol: 0.05 }], ligne: true,
        aide: function () { return "Trois données de la fiche entrent dans ce calcul."; },
        ok: function () { n.trouve.c = "Cs ≈ 17,5 N·m"; n.dessin(); j.bravo("\\(C_s \\simeq 0{,}7 \\times 100 \\times 0{,}25 = 17{,}5\\) N·m."); j.suite(); } });
    } },
    { nom: "Le jeu", jouer: function (j, n) {
      n.jeu = true; n.dessin();
      j.titre("Le jeu du réducteur se retrouve en sortie. De combien bouge le bout de l'instrument, en mm ?");
      j.nombre({ avant: "\\Delta x \\simeq", apres: "\\text{mm}", cases: [{ attendu: 0.3 * 0.05 * Math.PI / 180 * 1000, tol: 0.01 }], ligne: true,
        aide: function () { return "Attention à l'unité de l'angle."; },
        ok: function () { n.trouve.j = "jeu : Δx ≈ 0,26 mm"; n.dessin(); j.bravo("\\(0{,}05° = 8{,}73 \\times 10^{-4}\\) rad, donc \\(\\Delta x \\simeq 0{,}30 \\times 8{,}73 \\times 10^{-4} = 0{,}26\\) mm."); j.suite(); } });
    } },
    { nom: "La torsion", jouer: function (j, n) {
      n.jeu = false; n.torsion = true; n.dessin();
      j.titre("L'instrument appuie sur un tissu et l'axe donne ses 17,5 N·m. La torsion de l'axe déplace le bout de combien, en mm ?");
      j.nombre({ avant: "\\Delta x \\simeq", apres: "\\text{mm}", cases: [{ attendu: 0.3 * 17.5 / 5000 * 1000, tol: 0.01 }], ligne: true,
        aide: function () { return "D'abord l'angle de torsion, puis le déplacement au bout du bras."; },
        ok: function () { n.trouve.t = "torsion : Δx ≈ 1,05 mm"; n.dessin(); j.bravo("\\(\\theta = 17{,}5 / 5000 = 3{,}5 \\times 10^{-3}\\) rad, donc \\(\\Delta x \\simeq 1{,}05\\) mm."); j.suite(); } });
    } },
    { nom: "Décider", jouer: function (j, n) {
      j.titre("Le chirurgien veut moins d'écart au bout de l'instrument. Que faut-il améliorer en premier ?");
      j.choix([{ html: "La rigidité torsionnelle de l'axe", juste: true }, { html: "Le jeu du réducteur", aide: "Compare les deux écarts que tu viens de calculer." }, { html: "La vitesse du moteur", aide: "La vitesse ne change ni le jeu ni la torsion." }], { colonnes: 1, ok: function () {
        j.bravo("1,05 mm de torsion contre 0,26 mm de jeu : la rigidité d'abord.");
        j.suite();
      } });
    } },
    { nom: "Au-dessus du patient", jouer: function (j, n) {
      n.graisse = true; n.dessin();
      j.titre("Le réducteur, graissé, est juste au-dessus du champ opératoire. Quelle exigence du cours vérifier ?");
      j.choix([{ html: "Le rendement du réducteur", aide: "Regarde ce qui pourrait tomber sur le patient." }, { html: "Le confinement du lubrifiant", juste: true }, { html: "La durée de vie du moteur", aide: "Le risque ici concerne le patient, pas l'usure." }], { colonnes: 1, ok: function () {
        j.bravo("La graisse doit rester dans le carter, et l'axe se nettoyer facilement.");
        j.suite();
      } });
    } }
  ]
});
