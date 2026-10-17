/* Niveau : produit d'une matrice par un vecteur, ligne par ligne puis colonne par colonne. */
NIVEAU({
  id: "matrice-vecteur",
  init: function (fig) {
    var C = D.C, svg = fig.svg;
    var g = E.s("g", null, svg), pl = D.plan(svg, [400, 380], 95);
    var n = { mode: "calcul", ligne: 0, montre: [false, false], M: [[2, 1], [1, 3]], V: [3, 4], pin: null, chemin: 0, surTape: null };
    function caseTxt(t, p, o) { return D.texte(g, t, p, Object.assign({ taille: 34, mono: true, gras: true }, o || {})); }
    function crochets(x, y, w, h) {
      E.s("path", { d: "M" + (x + 14) + " " + y + " L" + x + " " + y + " L" + x + " " + (y + h) + " L" + (x + 14) + " " + (y + h), fill: "none", stroke: C.encre, "stroke-width": 3.5 }, g);
      E.s("path", { d: "M" + (x + w - 14) + " " + y + " L" + (x + w) + " " + y + " L" + (x + w) + " " + (y + h) + " L" + (x + w - 14) + " " + (y + h), fill: "none", stroke: C.encre, "stroke-width": 3.5 }, g);
    }
    n.dessin = function () {
      E.vider(g); pl.vider();
      if (n.mode === "calcul") {
        var M = n.M, V = n.V, y0 = 190, h = 170;
        // surlignage de la ligne en cours et de la colonne du vecteur
        E.s("rect", { x: 70, y: y0 + 12 + n.ligne * 80, width: 200, height: 62, rx: 14, fill: "rgba(255,90,31,.14)" }, g);
        E.s("rect", { x: 330, y: y0 + 8, width: 76, height: h - 16, rx: 14, fill: "rgba(59,91,219,.12)" }, g);
        crochets(60, y0, 220, h); crochets(320, y0, 96, h); crochets(510, y0, 120, h);
        for (var i = 0; i < 2; i++) {
          caseTxt(String(M[i][0]), [125, y0 + 44 + i * 80], { coul: i === n.ligne ? C.jeu : C.encre });
          caseTxt(String(M[i][1]), [215, y0 + 44 + i * 80], { coul: i === n.ligne ? C.jeu : C.encre });
          caseTxt(String(V[i]), [368, y0 + 44 + i * 80], { coul: C.acc });
          caseTxt(n.montre[i] ? String(M[i][0] * V[0] + M[i][1] * V[1]) : "?", [570, y0 + 44 + i * 80], { coul: n.montre[i] ? C.ok : C.gris });
        }
        caseTxt("×", [298, y0 + h / 2], { taille: 30, coul: C.doux });
        caseTxt("=", [462, y0 + h / 2], { taille: 34, coul: C.doux });
        var l = n.ligne, txt = M[l][0] + " × " + V[0] + " + " + M[l][1] + " × " + V[1];
        D.texte(g, "ligne " + (l + 1) + " : " + txt + (n.montre[l] ? " = " + (M[l][0] * V[0] + M[l][1] * V[1]) : " = ?"), [340, y0 + h + 70], { taille: 24, coul: C.jeu, mono: true });
        D.texte(g, "M", [170, y0 - 30], { taille: 26 }); D.texte(g, "V", [368, y0 - 30], { taille: 26, coul: C.acc }); D.texte(g, "M V", [570, y0 - 30], { taille: 26, coul: C.ok });
      } else {
        pl.grille({ pas: 1 });
        D.fleche(pl.fond, pl.P([-4, 0]), pl.P([2.9, 0]), "#c3c8d2", 2.5);
        D.fleche(pl.fond, pl.P([0, -2.2]), pl.P([0, 3.8]), "#c3c8d2", 2.5);
        for (var k = -3; k <= 2; k++) if (k) D.texte(pl.fond, String(k).replace("-", "−"), pl.P([k, -0.3]), { coul: C.gris, taille: 14, gras: false, mono: true });
        for (k = -2; k <= 3; k++) if (k) D.texte(pl.fond, String(k).replace("-", "−"), pl.P([-0.3, k]), { coul: C.gris, taille: 14, gras: false, mono: true });
        pl.vec(pl.fig, [0, 0], [0, 1, 0], C.x, 5, "colonne 1", { decal: [64, 0] });
        pl.vec(pl.fig, [0, 0], [-1, 0, 0], C.y, 5, "colonne 2", { decal: [0, -22] });
        if (n.chemin > 0) {
          var t1 = Math.min(1, n.chemin), t2 = Math.max(0, Math.min(1, n.chemin - 1)), A = [0, 2 * t1, 0];
          pl.vec(pl.haut, [0, 0], A, C.x, 6);
          if (t2 > 0) pl.vec(pl.haut, [0, 2, 0], [-t2, 2, 0], C.y, 6);
          if (t2 >= 1) { pl.vec(pl.haut, [0, 0], [-1, 2, 0], C.v, 6); D.texte(pl.haut, "M V", pl.P([-1.45, 2.3]), { coul: C.v }); }
        }
        if (n.pin) {
          var q = pl.P(n.pin);
          D.ligne(pl.haut, [q[0] - 10, q[1] - 10], [q[0] + 10, q[1] + 10], C.encre, 4); D.ligne(pl.haut, [q[0] + 10, q[1] - 10], [q[0] - 10, q[1] + 10], C.encre, 4);
          D.texte(pl.haut, "ta prédiction", [q[0], q[1] + 28], { taille: 15, coul: C.doux });
        }
      }
    };
    D.glisser(svg, {
      debut: function () { return !!n.surTape; },
      bouge: function (p) { var u = pl.U(p); n.pin = [Math.round(u[0]), Math.round(u[1]), 0]; n.dessin(); if (n.surTape) n.surTape(); }
    });
    n.pl = pl;
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Ligne 1", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Calcule la première case du résultat.");
      j.consigne("On prend la ligne 1 de la matrice et la colonne du vecteur, on multiplie terme à terme et on additionne.");
      j.nombre({ avant: "\\text{case 1} =", cases: [{ attendu: 10, tol: 0 }], ligne: true,
        aide: function () { return "Ligne 1 : \\(2 \\times 3 + 1 \\times 4\\)."; },
        ok: function () {
          n.montre[0] = true; n.dessin();
          j.bravo("\\(2 \\times 3 + 1 \\times 4 = 10\\).");
          j.suite();
        } });
    } },
    { nom: "Ligne 2", jouer: function (j, n) {
      n.ligne = 1; n.dessin();
      j.titre("Même chose avec la ligne 2.");
      j.nombre({ avant: "\\text{case 2} =", cases: [{ attendu: 15, tol: 0 }], ligne: true,
        aide: function () { return "Ligne 2 : \\(1 \\times 3 + 3 \\times 4\\)."; },
        ok: function () {
          n.montre[1] = true; n.dessin();
          j.bravo("\\(1 \\times 3 + 3 \\times 4 = 15\\).");
          j.expliquer("\\[ \\begin{pmatrix} 2 & 1 \\\\ 1 & 3 \\end{pmatrix} \\begin{pmatrix} 3 \\\\ 4 \\end{pmatrix} = \\begin{pmatrix} 2 \\times 3 + 1 \\times 4 \\\\ 1 \\times 3 + 3 \\times 4 \\end{pmatrix} = \\begin{pmatrix} 10 \\\\ 15 \\end{pmatrix} \\]<p>Chaque case du résultat, c'est une ligne de la matrice « fois » le vecteur.</p>");
          j.suite();
        } });
    } },
    { nom: "Colonnes", jouer: function (j, n) {
      n.mode = "plan"; n.dessin();
      j.fig.astuce("Touche la figure pour placer ta prédiction.");
      j.titre("Autre lecture. Avec \\(M = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}\\) et \\(V = (2 \\,;\\ 1)\\), où arrive \\(MV\\) ?");
      j.consigne("Les deux colonnes de M sont dessinées. Indice : \\(MV = 2 \\times \\text{colonne 1} + 1 \\times \\text{colonne 2}\\).");
      var b = j.zone("", ""); var verif = E.h("button", "btn bleu", "Vérifier", b); verif.type = "button"; verif.disabled = true;
      n.surTape = function () { verif.disabled = false; };
      verif.addEventListener("click", function () {
        verif.remove(); n.surTape = null;
        E.anime(1600, function (e) { n.chemin = 2 * e; n.dessin(); }, function () {
          var bon = n.pin[0] === -1 && n.pin[1] === 2;
          if (bon) j.bravo("Exactement : \\((-1 \\,;\\ 2)\\).", n.pl.P([-1, 2]));
          else j.erreur("La bonne case est \\((-1 \\,;\\ 2)\\) : 2 pas selon la colonne 1, puis 1 pas selon la colonne 2.");
          j.expliquer("<p>Multiplier une matrice par un vecteur, c'est combiner ses colonnes avec les composantes du vecteur :</p>\\[ \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix} \\begin{pmatrix} 2 \\\\ 1 \\end{pmatrix} = 2 \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix} + 1 \\begin{pmatrix} -1 \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} -1 \\\\ 2 \\end{pmatrix} \\]<p>Cette lecture par colonnes est la clé des matrices de rotation : leurs colonnes sont les axes d'un repère tourné.</p>");
          j.suite();
        });
      });
    } },
    { nom: "En 3 × 3", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("En dimension 3, rien ne change. Calcule \\(MV\\).");
      j.texte("\\[ M = \\begin{pmatrix} 0 & -1 & 0 \\\\ 1 & 0 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} \\qquad V = \\begin{pmatrix} 1 \\\\ 2 \\\\ 3 \\end{pmatrix} \\]");
      j.nombre({ avant: "MV =", cases: [{ attendu: -2, tol: 0 }, { attendu: 1, tol: 0 }, { attendu: 3, tol: 0 }],
        aide: function (k) { return ["Ligne 1 : \\(0 \\times 1 + (-1) \\times 2 + 0 \\times 3\\).", "Ligne 2 : \\(1 \\times 1 + 0 \\times 2 + 0 \\times 3\\).", "Ligne 3 : \\(0 \\times 1 + 0 \\times 2 + 1 \\times 3\\)."][k]; },
        ok: function () {
          j.bravo("\\(MV = (-2 \\,;\\ 1 \\,;\\ 3)\\).");
          j.expliquer("<p>Cette matrice fait tourner tout vecteur d'un quart de tour autour du troisième axe : x et y tournent, z ne bouge pas. C'est \\(R_z(90°)\\), que tu retrouveras dans le chapitre sur les orientations.</p>");
          j.suite();
        } });
    } }
  ]
});
