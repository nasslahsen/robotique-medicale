/* Figures : score d'appariement probabiliste réglable ; pipeline de qualité des données patient. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-score", {
    largeur: 960, hauteur: 470, titre: "Score d'appariement pondéré",
    essai: "<strong>Essaie</strong> : baisse le score du nom, puis celui de la CIN. <strong>Observe</strong> : un champ lourd (CIN) fait chuter le score plus qu'un champ léger. Poids ajoutés au cours."
  });
  var CH = [["Nom", "BENJELLOUN", "BENJELLOUNE", 8], ["Prénom", "Ahmed", "Ahmed", 3], ["Naissance", "01/01/1975", "01/01/1975", 4], ["Sexe", "M", "M", 1], ["Téléphone", "06 66 66 44 44", "06 66 66 44 44", 2], ["CIN", "A111111", "A111111", 6]];
  var g = A.s("g", null, f.svg);
  var cn = R.curseur(f.reglages, { nom: "Score partiel du nom", min: 0, max: 1, pas: 0.05, val: 0.85, dec: 2 });
  var cc = R.curseur(f.reglages, { nom: "Score partiel de la CIN", min: 0, max: 1, pas: 0.05, val: 1, dec: 2 });
  function fr(x, d) { return x.toFixed(d).replace(".", ","); }
  function dessiner() {
    A.vider(g);
    var sc = [cn.v, 1, 1, 1, 1, cc.v], P = CH.map(function (c) { return c[3]; }), S = A.calc.scorePondere(sc, P), dec = A.calc.decision(S);
    var L = [["Champ", "Valeur A", "Valeur B", "Score", "Poids"]].concat(CH.map(function (c, i) { return [c[0], c[1], c[2], fr(sc[i], 2), String(c[3])]; }));
    A.tableau(g, 20, 20, [120, 170, 170, 100, 80], 44, L, { taille: 15, tailleTete: 14, style: function (i, k) { return i > 0 && k === 3 && sc[i - 1] < 1 ? { fond: C.koPale, bord: C.ko, ep: 2.5, mono: true, gras: 700 } : i > 0 && k > 2 ? { mono: true } : null; } });
    var x0 = 700, x1 = 930, Y = function (v) { return 330 - 280 * v; };
    [[0, 0.70, C.ko, C.koPale, "pas de match"], [0.70, 0.90, "#b07d14", "#fbf1d9", "revue manuelle"], [0.90, 1, C.ok, C.okPale, "match"]].forEach(function (z) {
      A.s("rect", { x: x0, y: Y(z[1]), width: 70, height: Y(z[0]) - Y(z[1]), fill: z[3], stroke: z[2], "stroke-width": 2 }, g);
      A.texte(g, z[4], [x0 + 82, (Y(z[0]) + Y(z[1])) / 2], { taille: 14, coul: z[2], gras: 700, ancre: "start", largeur: 80 });
    });
    A.s("line", { x1: x0 - 12, y1: Y(S), x2: x0 + 82, y2: Y(S), stroke: C.encre, "stroke-width": 5 }, g);
    A.texte(g, fr(S, 3), [x0 - 20, Y(S)], { taille: 18, mono: true, gras: 800, ancre: "end" });
    A.texte(g, "Score global", [x0 + 35, 30], { taille: 15, gras: 700 });
    var nomD = { match: "MATCH automatique", revue: "REVUE MANUELLE : l'agent d'admission vérifie", non: "PAS DE MATCH" };
    A.texte(g, "Décision : " + nomD[dec], [330, 380], { taille: 20, gras: 800, coul: dec === "match" ? C.ok : dec === "revue" ? "#b07d14" : C.ko });
    A.texte(g, "S = Σ (poids × score) / Σ poids", [330, 425], { taille: 16, mono: true, coul: C.doux });
    R.rendre(f.direct, "S = \\frac{8 \\times " + fr(sc[0], 2).replace(",", "{,}") + " + 3 + 4 + 1 + 2 + 6 \\times " + fr(sc[5], 2).replace(",", "{,}") + "}{24} \\approx " + fr(S, 3).replace(",", "{,}"));
  }
  cn.surChange(dessiner); cc.surChange(dessiner);
  dessiner();

  var f2 = R.figure("fig-pipeline", {
    largeur: 960, hauteur: 460, titre: "Pipeline de qualité des données patient",
    essai: "<strong>Essaie</strong> : avance étape par étape. <strong>Observe</strong> : la donnée est nettoyée avant d'être comparée ; l'appariement mène à trois issues."
  });
  var N = [
    { t: "1. Capture", sous: "saisie libre à l'admission", x: 20, y: 30, w: 210, h: 110 },
    { t: "2. Normalisation", sous: "majuscules, sans accents, format du numéro", x: 255, y: 30, w: 210, h: 110 },
    { t: "3. Contrôle", sous: "date cohérente ? téléphone valide ? CIN valide (clé) ?", x: 490, y: 30, w: 210, h: 110 },
    { t: "4. Appariement (MPI)", sous: "comparaison, score probabiliste, décision", x: 725, y: 30, w: 215, h: 110 }
  ];
  A.etapesFig(f2, N, [
    "« Benjelloun  éva », « +212 6 66 66 44 44 » : saisie libre, telle que tapée au guichet.",
    "Normalisation : « BENJELLOUN EVA », « 06 66 66 44 44 ».",
    "Contrôle : la date de naissance est-elle cohérente ? Le téléphone valide ? La clé de la CIN correcte ?",
    "Appariement dans le MPI : comparaison avec la base, score, décision automatique ou manuelle. Trois issues en bas."
  ], { taille: 18, fond: function (g2, k) {
    if (k < 4) return;
    [["Doublon détecté", "Fusion", "Golden Record", 130], ["Nouveau patient", "Création", "Golden Record", 480], ["Revue manuelle", "Opérateur", "décide", 830]].forEach(function (x) {
      A.fleche(g2, [832, 142], [x[3], 200], { ep: 3, coul: C.doux });
      A.boite(g2, x[3] - 110, 204, 220, 70, { titre: x[0], taille: 17 });
      A.fleche(g2, [x[3], 276], [x[3], 316], { ep: 3, coul: C.doux });
      A.boite(g2, x[3] - 110, 320, 220, 80, { titre: x[1], sous: x[2], taille: 18, fond: C.jeuPale, bord: C.jeu });
    });
  }, depart: "Avance pour suivre une identité saisie au guichet." });
})();
