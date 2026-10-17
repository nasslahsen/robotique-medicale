/* Révision du chapitre 5 : situations nouvelles. Puissance d'un axe de pipette, jeu en degrés, deux rigidités, rapport minimal, critères biomédicaux. */
NIVEAU({
  id: "revision-axe",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg), M = window.MECA;
    var n = { mode: "pipette", C1: 0, montrer: false };

    function moteur(c, l, h) {
      E.s("rect", { x: c[0] - l / 2, y: c[1] - h / 2, width: l, height: h, rx: 12, fill: "#dfe3ea", stroke: C.encre, "stroke-width": 3 }, g);
      for (var k = 1; k < 5; k++) D.ligne(g, [c[0] - l / 2 + k * l / 5, c[1] - h / 2], [c[0] - l / 2 + k * l / 5, c[1] + h / 2], "#9aa0ad", 2);
    }
    function arbreTordu(y, k, nom) {
      var x0 = 120, x1 = 470, r = 46, th = 8 / k * 120; // angle grossi
      E.s("rect", { x: 70, y: y - 70, width: 50, height: 140, fill: M.hachures(g, "#5b6172", { fond: "#fff" }), stroke: C.encre, "stroke-width": 2 }, g);
      E.s("rect", { x: x0, y: y - r, width: x1 - x0, height: 2 * r, fill: "#e8edf5", stroke: C.encre, "stroke-width": 3 }, g);
      E.s("ellipse", { cx: x1, cy: y, rx: 14, ry: r, fill: "#dfe3ea", stroke: C.encre, "stroke-width": 3 }, g);
      [-0.7, 0, 0.7].forEach(function (s) { var a0 = Math.asin(s); D.ligne(g, [x0, y - r * s], [x1, y - r * Math.sin(Math.max(-1.5, Math.min(1.5, a0 + th)))], D.C.jeu, 3); });
      D.texte(g, nom, [560, y - 20], { taille: 26 });
      D.texte(g, "k = " + k + " N·m/rad", [570, y + 20], { taille: 17, mono: true, coul: C.doux, gras: false });
    }

    n.dessin = function () {
      E.vider(g);
      if (n.mode === "pipette") {
        // robot cartésien de laboratoire : un axe vertical motorisé déplace une pipette au-dessus de tubes
        E.s("rect", { x: 60, y: 90, width: 560, height: 24, rx: 6, fill: "#c6cbd8", stroke: C.encre, "stroke-width": 2 }, g);
        E.s("rect", { x: 270, y: 70, width: 120, height: 64, rx: 10, fill: "#9aa0ad", stroke: C.encre, "stroke-width": 2 }, g);
        moteur([330, 190], 90, 90);
        D.ligne(g, [330, 235], [330, 390], "#5b6172", 14);
        E.s("polygon", { points: "318,390 342,390 334,450 326,450", fill: "#fff", stroke: C.encre, "stroke-width": 2.5 }, g);
        for (var i = 0; i < 7; i++) E.s("rect", { x: 140 + i * 60, y: 470, width: 36, height: 80, rx: 14, fill: "#e8edff", stroke: C.encre, "stroke-width": 2 }, g);
        D.texte(g, "n = 1500 tr/min", [470, 175], { taille: 20, mono: true, ancre: "start" });
        D.texte(g, "C = 0,5 N·m", [470, 210], { taille: 20, mono: true, ancre: "start" });
      } else if (n.mode === "bras") {
        var O = [100, 300], L = 480, a = n.montrer ? 0.1 * 40 * D.DEG : 0;
        D.rond(g, O, 28, { fill: "#fff", stroke: C.encre, ep: 4 });
        D.ligne(g, O, [O[0] + L, O[1]], "#c6cbd8", 22);
        if (n.montrer) { D.ligne(g, O, [O[0] + L * Math.cos(a), O[1] - L * Math.sin(a)], C.encre, 3, "10 8"); D.ligne(g, [O[0] + L + 24, O[1]], [O[0] + L + 24, O[1] - L * Math.sin(a)], C.v, 4); D.texte(g, "Δx", [O[0] + L + 50, O[1] - 16], { coul: C.v, taille: 22 }); }
        D.rond(g, O, 9, { fill: C.encre });
        D.texte(g, "L = 0,5 m", [O[0] + L / 2, O[1] + 44], { taille: 20, coul: C.doux });
        D.texte(g, "jeu Δθ = 0,1°" + (n.montrer ? " (grossi 40 fois)" : ""), [340, 470], { taille: 18, coul: C.doux, gras: false });
      } else if (n.mode === "deux") {
        arbreTordu(200, 1000, "A"); arbreTordu(430, 4000, "B");
        D.texte(g, "même couple : 8 N·m (angles grossis)", [300, 560], { taille: 16, coul: C.doux, gras: false });
      } else if (n.mode === "reducteur") {
        moteur([110, 300], 120, 100);
        M.arbre(g, 170, 230, 300, 12, { axe: false });
        E.s("rect", { x: 230, y: 220, width: 170, height: 160, rx: 18, fill: "#eef0f5", stroke: C.encre, "stroke-width": 3 }, g);
        D.texte(g, "i = ?", [315, 300], { taille: 32, mono: true });
        M.arbre(g, 400, 470, 300, 16, { axe: false });
        D.ligne(g, [490, 300], [630, 180], "#c6cbd8", 24); D.rond(g, [490, 300], 26, { fill: "#fff", stroke: C.encre, ep: 4 });
        D.texte(g, "Cm = 0,4 N·m", [110, 200], { taille: 18, mono: true, coul: C.z });
        D.texte(g, "η = 0,75", [315, 420], { taille: 18, mono: true });
        D.texte(g, "15 N·m nécessaires", [540, 380], { taille: 18, mono: true, coul: C.v });
      } else {
        // robot d'échographie au-dessus d'un patient allongé
        E.s("rect", { x: 40, y: 450, width: 600, height: 30, rx: 8, fill: "#d9dde6" }, g);
        E.s("ellipse", { cx: 330, cy: 432, rx: 220, ry: 34, fill: "#f3d2bf", stroke: C.encre, "stroke-width": 2.5 }, g);
        E.s("circle", { cx: 580, cy: 420, r: 34, fill: "#f3d2bf", stroke: C.encre, "stroke-width": 2.5 }, g);
        E.s("rect", { x: 60, y: 120, width: 70, height: 330, rx: 10, fill: "#5b6172" }, g);
        D.ligne(g, [95, 150], [300, 200], "#9aa0ad", 30); D.ligne(g, [300, 200], [360, 360], "#9aa0ad", 24);
        D.rond(g, [95, 150], 20, { fill: "#c6cbd8", stroke: C.encre, ep: 3 }); D.rond(g, [300, 200], 20, { fill: "#c6cbd8", stroke: C.encre, ep: 3 });
        E.s("rect", { x: 346, y: 350, width: 30, height: 50, rx: 8, fill: "#3b5bdb" }, g);
        D.texte(g, "sonde", [420, 330], { taille: 17, coul: C.doux, gras: false });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Axe de pipette", jouer: function (j, n) {
      j.fig.astuce("Un robot de laboratoire déplace une pipette au-dessus de tubes.");
      j.titre("Le moteur de l'axe vertical tourne à 1500 tr/min avec un couple de 0,5 N·m. Vitesse angulaire et puissance ?");
      j.nombre({ avant: "\\omega\\ (\\text{rad/s}),\\ P\\ (\\text{W}) :", cases: [{ attendu: 2 * Math.PI * 1500 / 60, tol: 0.05 }, { attendu: 0.5 * 2 * Math.PI * 1500 / 60, tol: 0.1 }], ligne: true,
        aide: function (k) { return k === 0 ? "\\(\\omega = 2\\pi n / 60\\)." : "\\(P = C\\,\\omega\\)."; },
        ok: function () { j.bravo("\\(\\omega \\approx 157{,}08\\) rad/s, \\(P \\approx 78{,}5\\) W."); j.suite(); } });
    } },
    { nom: "Trouve l'erreur", jouer: function (j, n) {
      n.mode = "bras"; n.montrer = false; n.dessin();
      j.fig.astuce("");
      j.titre("Bras de 0,5 m, jeu de 0,1°. Un camarade écrit : \\(\\Delta x = 0{,}5 \\times 0{,}1 = 0{,}05\\) m, soit 5 cm. Où est l'erreur ?");
      j.choix([{ html: "L'angle doit être en radians", juste: true }, { html: "Il faut diviser par L au lieu de multiplier", aide: "\\(\\Delta x \\simeq L\\,\\Delta\\theta\\) : la formule est bonne. Regarde l'unité de \\(\\Delta\\theta\\)." }, { html: "Il n'y en a pas", aide: "5 cm de déplacement pour 0,1° de jeu ? Vérifie l'unité de l'angle." }], { colonnes: 1, ok: function () {
        n.montrer = true; n.dessin();
        j.bravo("\\(0{,}1° = 1{,}75 \\times 10^{-3}\\) rad, donc \\(\\Delta x \\simeq 0{,}87\\) mm.");
        j.suite();
      } });
    } },
    { nom: "Deux rigidités", jouer: function (j, n) {
      n.mode = "deux"; n.dessin();
      j.fig.astuce("Deux axes soumis au même couple.");
      j.titre("Axe A : \\(k_\\theta = 1000\\) N·m/rad. Axe B : \\(k_\\theta = 4000\\) N·m/rad. Combien de fois B se tord-il moins que A ?");
      j.nombre({ avant: "\\theta_A / \\theta_B =", cases: [{ attendu: 4, tol: 0.001 }], ligne: true,
        aide: function () { return "\\(\\theta = C / k_\\theta\\) avec le même \\(C\\) pour les deux."; },
        ok: function () { j.bravo("4 fois : 8 mrad pour A, 2 mrad pour B."); j.suite(); } });
    } },
    { nom: "Rapport minimal", jouer: function (j, n) {
      n.mode = "reducteur"; n.dessin();
      j.fig.astuce("Un moteur trop faible pour le bras, seul.");
      j.titre("Le bras demande 15 N·m. Le moteur donne 0,4 N·m et le réducteur a un rendement de 0,75. Quel rapport \\(i\\) minimal ?");
      j.nombre({ avant: "i =", cases: [{ attendu: 15 / (0.75 * 0.4), tol: 0.01 }], ligne: true,
        aide: function () { return "Pars de \\(C_s \\simeq \\eta\\, i\\, C_e\\) et isole \\(i\\)."; },
        ok: function () { j.bravo("\\(i = 15 / (0{,}75 \\times 0{,}4) = 50\\)."); j.suite(); } });
    } },
    { nom: "Cas nouveau", jouer: function (j, n) {
      n.mode = "echo"; n.dessin();
      j.fig.astuce("Un bras d'échographie au-dessus d'un patient allongé.");
      j.titre("Ce bras pose la sonde sur le ventre et passe près du visage du patient. Quels critères passent avant les autres ?");
      j.choix([{ html: "Masse mobile limitée, pas de point de pincement, peu de bruit", juste: true }, { html: "La vitesse la plus grande possible", aide: "Le bras travaille au contact d'une personne : la vitesse n'est pas l'enjeu principal." }, { html: "Le coût le plus bas, avant tout", aide: "Le coût compte, mais le cours insiste sur ce qui protège le patient." }], { colonnes: 1, ok: function () {
        j.bravo("Le patient d'abord.");
        j.expliquer("<p>Les critères classiques restent (charge, rigidité, durée de vie, coût), mais au contact du patient la masse mobile, le bruit, les vibrations, les points de pincement, le nettoyage et le confinement des lubrifiants pèsent lourd. Le choix final dépend de l'importance de chaque critère.</p>");
        j.suite();
      } });
    } }
  ]
});
