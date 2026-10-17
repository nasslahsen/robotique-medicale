/* Niveau : critères d'un guidage, DDL utiles, raideur k = F/δ, raideur angulaire. */
NIVEAU({
  id: "criteres-guidage",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    // chariots : [nom, raideur k en N/mm] ; mag : pixels par mm de déformation (déformation exagérée)
    var n = { F: 200, chariots: [["", 4000]], mag: 600, ddl: false, graphe: true, cible: null };
    function chariot(x0, w, nom, k, coul) {
      var d = n.F / k, dy = d * n.mag, yRail = 320, hc = 100;
      // rail (coupe longitudinale) et billes de recirculation entre chariot et rail
      E.s("rect", { x: x0 - 20, y: yRail, width: w + 40, height: 44, rx: 4, fill: MECA.hachures(g, "#5b6172", { fond: "#fff" }), stroke: C.encre, "stroke-width": 2 }, g);
      for (var i = 0; i < 7; i++) D.rond(g, [x0 + 20 + i * (w - 40) / 6, yRail - 9 + dy * 0.5], 9, { fill: "#dfe3ea", stroke: C.encre, ep: 1.6 });
      // ligne de référence : position sans charge
      D.ligne(g, [x0 - 30, yRail - 18 - hc], [x0 + w + 30, yRail - 18 - hc], C.gris, 2, "6 5");
      E.s("rect", { x: x0, y: yRail - 18 - hc + dy, width: w, height: hc, rx: 10, fill: coul, stroke: C.encre, "stroke-width": 2.5 }, g);
      if (nom) D.texte(g, nom, [x0 + w / 2, yRail - 18 - hc / 2 + dy], { taille: 34, coul: C.encre });
      // effort F
      var Lf = 40 + n.F * 0.3, haut = yRail - 26 - hc;
      D.fleche(g, [x0 + w / 2, haut - Lf], [x0 + w / 2, haut + dy], C.x, 7);
      D.texte(g, "F = " + Math.round(n.F) + " N", [x0 + w / 2 + 18, haut - Lf * 0.55], { ancre: "start", coul: C.x, taille: 22 });
      // cote δ (à droite du chariot) et valeur sous le rail
      if (dy > 3) D.ligne(g, [x0 + w + 16, yRail - 18 - hc], [x0 + w + 16, yRail - 18 - hc + dy], C.v, 4);
      D.texte(g, "δ = " + E.fmt(d, 3) + " mm", [x0 + w / 2, yRail + 70], { coul: C.v, taille: 22 });
    }
    function rotation() {
      var c = [340, 300], a = -(n.theta || 6) * D.DEG;
      E.s("rect", { x: 250, y: 200, width: 180, height: 200, rx: 12, fill: MECA.hachures(g, "#5b6172", { fond: "#fff" }), stroke: C.encre, "stroke-width": 2.5 }, g);
      E.s("rect", { x: 270, y: 262, width: 140, height: 76, fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g);
      MECA.traitAxe(g, [60, 300], [620, 300]);
      var gg = E.s("g", { transform: "rotate(" + (a / D.DEG) + " " + c[0] + " " + c[1] + ")" }, g);
      E.s("rect", { x: 80, y: 272, width: 520, height: 56, rx: 6, fill: "#ffe9e2", stroke: C.encre, "stroke-width": 2.5 }, gg);
      D.texte(g, "axe théorique", [70, 272], { taille: 17, coul: C.doux, ancre: "start" });
      // couple qui fait pivoter et angle θ
      E.s("path", { d: "M 470 170 A 150 150 0 0 1 520 260", fill: "none", stroke: C.x, "stroke-width": 6 }, g);
      D.fleche(g, [512, 240], [522, 266], C.x, 6);
      D.texte(g, "C", [530, 178], { coul: C.x, taille: 28 });
      D.texte(g, "θ", [560, 335], { coul: C.v, taille: 28 });
      D.texte(g, "palier", [340, 440], { taille: 18, coul: C.doux });
    }
    n.dessin = function () {
      E.vider(g);
      if (n.ddl) {
        // chariot vu de dessus avec les six mouvements possibles : la translation le long du rail est libre
        E.s("rect", { x: 70, y: 250, width: 540, height: 44, rx: 4, fill: "#e3e6ee", stroke: C.encre, "stroke-width": 2 }, g);
        E.s("rect", { x: 250, y: 220, width: 180, height: 104, rx: 10, fill: "#ffe9e2", stroke: C.encre, "stroke-width": 2.5 }, g);
        D.texte(g, "rail", [110, 272], { taille: 18, coul: C.doux });
        var ok = n.ddlRevele;
        D.fleche(g, [340, 272], [540, 272], ok ? C.ok : C.acc, 6); D.texte(g, "x", [555, 250], { coul: ok ? C.ok : C.acc });
        D.fleche(g, [340, 272], [340, 120], ok ? C.ko : C.acc, 5); D.texte(g, "y", [360, 125], { coul: ok ? C.ko : C.acc });
        D.fleche(g, [340, 272], [250, 400], ok ? C.ko : C.acc, 5); D.texte(g, "z", [232, 410], { coul: ok ? C.ko : C.acc });
        if (ok) {
          D.texte(g, "translation x : libre", [340, 470], { coul: C.ok, taille: 20 });
          D.texte(g, "les 5 autres mouvements : bloqués", [340, 505], { coul: C.ko, taille: 20 });
        }
        return;
      }
      if (n.rotation) { rotation(); return; }
      var nb = n.chariots.length, w = nb === 1 ? 360 : 230;
      n.chariots.forEach(function (c, i) {
        var x0 = nb === 1 ? 160 : 70 + i * 310;
        chariot(x0, w, c[0], c[1], i === 1 ? "#e8edff" : "#ffe9e2");
      });
      if (!n.graphe) return;
      // graphe F(δ) : droite de pente k
      var ox = 110, oy = 575, sx = 6400, sy = 0.62; // px par mm, px par N
      D.fleche(g, [ox, oy], [620, oy], C.gris, 2.5); D.fleche(g, [ox, oy], [ox, 418], C.gris, 2.5);
      D.texte(g, "δ (mm)", [615, oy - 18], { taille: 17, coul: C.doux, ancre: "end" });
      D.texte(g, "F (N)", [ox + 14, 428], { taille: 17, coul: C.doux, ancre: "start" });
      n.chariots.forEach(function (c, i) {
        var coul = i === 1 ? C.acc : C.jeu, dmax = Math.min(0.075, 230 / c[1]);
        D.ligne(g, [ox, oy], [ox + dmax * sx, oy - dmax * c[1] * sy], coul, 3);
        var d = n.F / c[1];
        D.rond(g, [ox + d * sx, oy - n.F * sy], 8, { fill: coul, stroke: "#fff", ep: 2.5 });
        if (c[0]) D.texte(g, c[0], [ox + dmax * sx + 14, oy - dmax * c[1] * sy], { coul: coul, taille: 20 });
      });
      if (n.cible) { D.ligne(g, [ox + n.cible * sx, oy], [ox + n.cible * sx, 430], C.ko, 2.5, "6 5"); D.texte(g, "δ max", [ox + n.cible * sx + 8, 440], { coul: C.ko, taille: 16, ancre: "start" }); }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "DDL utiles", jouer: function (j, n) {
      n.ddl = true; n.dessin();
      j.fig.astuce("Un chariot sur rail : la table d'un appareil d'imagerie.");
      j.titre("Ce guidage linéaire porte la table. Quel mouvement doit-il laisser libre ?");
      j.choix([
        { html: "La translation le long du rail, x", juste: true },
        { html: "Les trois translations", aide: "Si la table pouvait monter ou partir sur le côté, le patient ne serait plus guidé. Regarde le rail : il impose une seule direction." },
        { html: "Aucun mouvement", aide: "Un guidage qui bloque tout est un encastrement : la table ne pourrait plus avancer." }
      ], { colonnes: 1, ok: function () {
        n.ddlRevele = true; n.dessin();
        j.bravo("Un seul DDL utile : la translation x.");
        j.expliquer("<p>Un <b>guidage</b> doit autoriser les degrés de liberté utiles et contraindre les autres. On le juge sur : charge radiale et axiale, moment, rigidité, jeu, frottement, vitesse, durée de vie, précision géométrique, lubrification, contamination et encombrement.</p>");
        j.suite();
      } });
    } },
    { nom: "La raideur", jouer: function (j, n) {
      n.ddl = false; n.F = 200; n.chariots = [["", 4000]]; n.dessin();
      j.fig.astuce("Déformation très agrandie pour la voir.");
      j.titre("Sous 200 N, le chariot s'enfonce de 0,05 mm. Quelle est la raideur du guidage ?");
      j.nombre({ avant: "k =", apres: "\\text{N/mm}", cases: [{ attendu: 4000, tol: 0.5 }], ligne: true,
        aide: function () { return "La raideur, c'est l'effort divisé par le déplacement : \\(200 / 0{,}05\\)."; },
        ok: function () {
          j.bravo("k = 4000 N/mm.");
          j.expliquer("\\[ k = \\frac{F}{\\delta} \\]<p>C'est une modélisation linéaire locale : \\(k\\) en N/m ou N/mm, \\(F\\) l'effort appliqué, \\(\\delta\\) le déplacement ou la déformation. Sur le graphe, \\(k\\) est la pente de la droite.</p>");
          j.suite();
        } });
    } },
    { nom: "Comparer", jouer: function (j, n) {
      n.F = 200; n.chariots = [["A", 5000], ["B", 20000]]; n.dessin();
      j.fig.astuce("Même charge sur deux guidages.");
      j.titre("Même charge de 200 N : A s'enfonce de 0,04 mm, B de 0,01 mm. Lequel est le plus raide ?");
      j.choix([
        { html: "A", aide: "A se déforme le plus. Regarde les pentes du graphe : la plus raide est celle qui monte le plus vite." },
        { html: "B", juste: true },
        { html: "Les deux, la charge est la même", aide: "La charge est la même, pas la déformation : \\(k = F/\\delta\\) change." }
      ], { ok: function () {
        j.bravo("B : 20 000 N/mm, quatre fois A.");
        j.expliquer("<p>Moins de déformation sous la même charge, c'est plus de raideur : \\(k_A = 200/0{,}04 = 5000\\) N/mm et \\(k_B = 200/0{,}01 = 20\\,000\\) N/mm. Pour un instrument, une faible déformation garde l'outil où on l'a placé.</p>");
        j.suite();
      } });
    } },
    { nom: "Charge maximale", jouer: function (j, n) {
      n.F = 50; n.chariots = [["", 4000]]; n.cible = 0.03; n.dessin();
      j.fig.astuce("Fais varier la charge pour voir le chariot descendre.");
      j.titre("Ce guidage (k = 4000 N/mm) ne doit pas s'enfoncer de plus de 0,03 mm. Quelle charge maximale ?");
      j.curseur({ nom: "F", min: 0, max: 300, pas: 10, val: 50, unite: " N", change: function (v) { n.F = v; n.dessin(); } });
      j.nombre({ avant: "F_{max} =", apres: "\\text{N}", cases: [{ attendu: 120, tol: 0.5 }], ligne: true,
        aide: function () { return "Retourne la formule : \\(F = k\\,\\delta\\)."; },
        ok: function () {
          n.F = 120; n.dessin();
          j.bravo("120 N : au-delà, la déformation dépasse 0,03 mm.");
          j.suite();
        } });
    } },
    { nom: "En rotation", jouer: function (j, n) {
      n.cible = null; n.rotation = true; n.dessin();
      j.fig.astuce("Inclinaison très agrandie.");
      j.titre("Pour un guidage en rotation, on parle de raideur angulaire. Quelle est son unité ?");
      j.choix([
        { html: "N/mm", aide: "C'est l'unité d'une raideur linéaire : un effort par déplacement. Ici on fait pivoter le guidage." },
        { html: "N·m/rad", juste: true },
        { html: "rad/N", aide: "C'est l'inverse : une souplesse. La raideur met l'effort au numérateur." }
      ], { ok: function () {
        j.bravo("Un couple par radian.");
        j.expliquer("<p>La raideur angulaire est le couple nécessaire pour faire pivoter le guidage d'un certain angle hors de son axe théorique, en N·m/rad. C'est la même idée que la rigidité torsionnelle \\(k_\\theta = C/\\theta\\) du chapitre 5.</p>");
        j.suite();
      } });
    } }
  ]
});
