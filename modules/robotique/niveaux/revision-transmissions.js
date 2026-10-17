/* Révision du chapitre 8 : pousse-seringue, lit médical, module retrouvé, entraxe, sens dans un train, arbre plus résistant. */
NIVEAU({
  id: "revision-transmissions",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { mode: "pompe" };
    var PALE = PLATEFORME.teinte(0.22);
    function vis(x0, x1, y, r) {
      E.s("rect", { x: x0, y: y - r, width: x1 - x0, height: 2 * r, rx: 8, fill: "#dfe3ea", stroke: C.encre, "stroke-width": 2 }, g);
      for (var x = x0 + 10; x < x1 - 4; x += 16) D.ligne(g, [x, y - r + 2], [x + 10, y + r - 2], C.encre, 2);
    }
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "pompe") {
        // pousse-seringue : moteur, engrenage, vis, poussoir, seringue
        E.s("rect", { x: 40, y: 250, width: 130, height: 100, rx: 14, fill: "#5b6172", stroke: C.encre, "stroke-width": 2 }, g);
        D.texte(g, "moteur", [105, 300], { coul: "#fff", fondCoul: "#5b6172", taille: 17 });
        MECA.arbre(g, 170, 230, 300, 8, { axe: false });
        MECA.roue(g, [250, 300], { m: 5, Z: 12, fill: PALE, trou: 6 });
        MECA.roue(g, [250, 300 + 5 * 42 / 2], { m: 5, Z: 30, rot: -Math.PI / 2 + Math.PI / 30, fill: "#dfe3ea", trou: 8 });
        vis(250, 560, 405, 14);
        E.s("rect", { x: 380, y: 360, width: 40, height: 90, rx: 6, fill: "#9aa0ad", stroke: C.encre, "stroke-width": 2 }, g);
        E.s("rect", { x: 420, y: 395, width: 120, height: 20, fill: "#c6cbd8", stroke: C.encre, "stroke-width": 2 }, g);
        E.s("rect", { x: 540, y: 365, width: 110, height: 80, rx: 10, fill: "#e8f2ff", stroke: C.encre, "stroke-width": 2 }, g);
        D.texte(g, "seringue", [595, 470], { taille: 16, coul: C.doux, gras: false });
        D.texte(g, "P = 2 W    n = 600 tr/min", [340, 160], { taille: 22, mono: true });
      } else if (n.mode === "lit") {
        E.s("rect", { x: 70, y: 150, width: 540, height: 40, rx: 12, fill: "#e8f2ff", stroke: C.encre, "stroke-width": 2 }, g);
        D.texte(g, "plan de couchage", [340, 170], { taille: 16, fondCoul: "#e8f2ff" });
        D.ligne(g, [200, 190], [200, 300], C.encre, 8); D.ligne(g, [480, 190], [480, 300], C.encre, 8);
        D.fleche(g, [560, 260], [560, 205], "#3b5bdb", 4); D.fleche(g, [560, 215], [560, 270], "#9aa0ad", 3, { tirets: "6 5" });
        MECA.roue(g, [340, 370], { m: 4, Z: 30, fill: "#dfe3ea", trou: 10 });
        vis(220, 460, 452, 16);
        E.s("rect", { x: 110, y: 430, width: 110, height: 44, rx: 10, fill: "#5b6172", stroke: C.encre, "stroke-width": 2 }, g);
        D.texte(g, "moteur", [165, 452], { coul: "#fff", fondCoul: "#5b6172", taille: 16 });
        D.texte(g, "?", [340, 370], { taille: 34, coul: C.jeu });
      } else if (n.mode === "roue") {
        var c = [300, 300], m = 9, r = MECA.roue(g, c, { m: m, Z: 20, fill: "#dfe3ea", trou: 20 });
        var y = c[1] - r.ra - 30;
        D.ligne(g, [c[0] - r.ra, c[1] - 20], [c[0] - r.ra, y - 10], C.doux, 1.5, "4 4"); D.ligne(g, [c[0] + r.ra, c[1] - 20], [c[0] + r.ra, y - 10], C.doux, 1.5, "4 4");
        D.fleche(g, [c[0], y], [c[0] - r.ra, y], C.jeu, 2.5); D.fleche(g, [c[0], y], [c[0] + r.ra, y], C.jeu, 2.5);
        D.texte(g, "d_a = 44 mm (pied à coulisse)", [c[0], y - 22], { taille: 18, coul: C.jeu });
        D.texte(g, "Z = 20", [c[0], c[1] + r.ra + 34], { taille: 20, mono: true });
      } else if (n.mode === "paire") {
        var mm = 7, c1 = [150, 300], c2 = [150 + mm * 72 / 2, 300];
        MECA.roue(g, c1, { m: mm, Z: 18, fill: PALE });
        MECA.roue(g, c2, { m: mm, Z: 54, rot: Math.PI + Math.PI / 54, fill: "#dfe3ea" });
        D.texte(g, "Z1 = 18", [c1[0], 390], { taille: 18, mono: true }); D.texte(g, "Z2 = 54", [c2[0], 520], { taille: 18, mono: true });
        D.texte(g, "m = 1,5 mm", [340, 90], { taille: 22, mono: true });
      } else if (n.mode === "ligne") {
        var M2 = 9, cs = [[130, 300], [130 + M2 * 32 / 2, 300], [130 + M2 * 32 / 2 + M2 * 36 / 2, 300]], Z = [14, 18, 18];
        MECA.roue(g, cs[0], { m: M2, Z: 14, fill: "#cfe0ff" });
        MECA.roue(g, cs[1], { m: M2, Z: 18, rot: Math.PI + Math.PI / 18, fill: "#dfe3ea" });
        MECA.roue(g, cs[2], { m: M2, Z: 18, rot: 0, fill: PALE });
        cs.forEach(function (c, i) { D.texte(g, String(i + 1), [c[0], c[1] + M2 * Z[i] / 2 + 34], { taille: 24 }); });
        E.s("path", { d: "M" + (cs[0][0] - 40) + " " + (cs[0][1] - 70) + " A 80 80 0 0 1 " + (cs[0][0] + 40) + " " + (cs[0][1] - 70), fill: "none", stroke: "#3b5bdb", "stroke-width": 5 }, g);
        E.s("polygon", { points: [[cs[0][0] + 52, cs[0][1] - 62], [cs[0][0] + 30, cs[0][1] - 82], [cs[0][0] + 36, cs[0][1] - 56]].map(function (p) { return p.join(","); }).join(" "), fill: "#3b5bdb" }, g);
        D.texte(g, "?", [cs[2][0], cs[2][1] - 100], { taille: 34, coul: C.jeu });
      } else if (n.mode === "arbre") {
        MECA.arbre(g, 120, 560, 300, 40);
        E.s("rect", { x: 74, y: 220, width: 46, height: 160, fill: MECA.hachures(g, "#5b6172", { fond: "#fff" }), stroke: C.encre, "stroke-width": 2 }, g);
        D.texte(g, "acier A : R_pg", [340, 200], { taille: 20 });
        D.texte(g, "acier B : 2 × R_pg", [340, 420], { taille: 20, coul: C.jeu });
        D.texte(g, "même M_t", [560, 370], { taille: 18, coul: C.doux, ancre: "end", gras: false });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Pousse-seringue", jouer: function (j, n) {
      j.fig.astuce("Un pousse-seringue : le moteur entraîne une vis qui pousse le piston.");
      j.titre("Le moteur fournit 2 W à 600 tr/min. Quel couple sur son arbre ?");
      j.nombre({ avant: "C =", apres: "\\text{N}\\cdot\\text{m}", cases: [{ attendu: 0.0318, tol: 0.0005 }], ligne: true,
        aide: function () { return "Même formule que pour tout arbre : regarde la page Arbres : couple et puissance."; },
        ok: function () { j.bravo("0,0318 N·m : \\(C = 60P/(2\\pi n)\\)."); j.suite(); } });
    } },
    { nom: "Le lit médical", jouer: function (j, n) {
      n.mode = "lit"; n.dessin();
      j.fig.astuce("Le moteur lève le plan de couchage.");
      j.titre("Quand le moteur s'arrête, le lit ne doit pas redescendre seul sous le poids du patient. Quel engrenage ?");
      j.choix([
        { html: "Roue et vis sans fin", juste: true },
        { html: "Engrenage à denture hélicoïdale", aide: "Il est silencieux, mais réversible : le poids ferait tourner le moteur à l'envers." },
        { html: "Engrenage conique", aide: "Il renvoie le mouvement entre arbres qui se croisent ; il n'empêche rien de tourner à l'envers." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Souvent irréversible : la roue ne peut pas entraîner la vis.");
        j.suite();
      } });
    } },
    { nom: "Retrouver le module", jouer: function (j, n) {
      n.mode = "roue"; n.dessin();
      j.fig.astuce("Une roue sans marquage : on mesure son diamètre de tête.");
      j.titre("Diamètre de tête 44 mm, 20 dents. Quel est le module ?");
      j.nombre({ avant: "m =", apres: "\\text{mm}", cases: [{ attendu: 2, tol: 0.01 }], ligne: true,
        aide: function () { return "\\(d_a = d + 2m\\) et \\(d = mZ\\) : écris \\(d_a\\) avec m seulement."; },
        ok: function () {
          j.bravo("m = 2 mm, un module normalisé.");
          j.expliquer("\\[ d_a = mZ + 2m = m(Z + 2) \\Rightarrow m = \\frac{44}{22} = 2 \\text{ mm} \\]");
          j.suite();
        } });
    } },
    { nom: "Rapport et entraxe", jouer: function (j, n) {
      n.mode = "paire"; n.dessin();
      j.fig.astuce("");
      j.titre("Pignon de 18 dents, roue de 54 dents, module 1,5 mm. Rapport \\(i_{12}\\) et entraxe ?");
      j.nombre({ avant: "i_{12},\\ a :", cases: [{ attendu: 0.333, tol: 0.002 }, { attendu: 54, tol: 0.01 }], ligne: true,
        aide: function (k) { return k === 0 ? "\\(i_{12} = Z_1/Z_2\\)." : "\\(a = m(Z_1 + Z_2)/2\\)."; },
        ok: function () { j.bravo("\\(i_{12} = 1/3\\), \\(a = 54\\) mm."); j.suite(); } });
    } },
    { nom: "Trois roues", jouer: function (j, n) {
      n.mode = "ligne"; n.dessin();
      j.fig.astuce("La roue 1 tourne dans le sens de la flèche bleue.");
      j.titre("Trois roues extérieures en ligne. Dans quel sens tourne la roue 3 ?");
      j.choix([{ html: "Dans le même sens que la roue 1", juste: true }, { html: "En sens inverse de la roue 1", aide: "Compte les contacts : chaque contact extérieur inverse le sens, et il y en a deux." }], { colonnes: 1, ok: function () {
        j.bravo("Deux inversions : même sens. La roue 2 est une roue inverseuse.");
        j.expliquer("<p>Comme la roue 5 du train avec inverseur : elle change le sens, pas le rapport (\\(Z_2\\) se simplifie).</p>");
        j.suite();
      } });
    } },
    { nom: "Arbre plus résistant", jouer: function (j, n) {
      n.mode = "arbre"; n.dessin();
      j.fig.astuce("");
      j.titre("Même moment de torsion, mais un acier deux fois plus résistant au glissement. Le diamètre minimal est multiplié par :");
      j.choix([{ html: "0,5", aide: "\\(R_{pg}\\) est sous la racine cubique, au dénominateur." }, { html: "\\(1/\\sqrt[3]{2} \\approx 0{,}79\\)", juste: true }, { html: "2", aide: "Un matériau plus résistant permet un arbre plus fin, pas plus gros." }], { ok: function () {
        j.bravo("× 0,79 : un arbre plus fin suffit.");
        j.expliquer("\\[ d > \\sqrt[3]{\\frac{16\\,M_t}{\\pi\\,R_{pg}}} \\]");
        j.suite();
      } });
    } }
  ]
});
