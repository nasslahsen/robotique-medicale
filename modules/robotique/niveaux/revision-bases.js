/* Révision du chapitre 0 : signes, triangle, bout d'un bras, vecteur unitaire, matrice par colonnes. Questions mélangées. */
NIVEAU({
  id: "revision-bases",
  init: function (fig) {
    var C = D.C, pl = D.plan(fig.svg, [340, 320], 200);
    var n = { mode: "cercle", a: 210, bras: null, vec: null, M: null };
    n.dessin = function () {
      pl.vider();
      pl.grille({ pas: 0.25, fort: 4 });
      D.fleche(pl.fond, pl.P([-1.4, 0]), pl.P([1.45, 0]), "#c3c8d2", 2.5);
      D.fleche(pl.fond, pl.P([0, -1.3]), pl.P([0, 1.4]), "#c3c8d2", 2.5);
      if (n.mode === "cercle") {
        E.s("circle", { cx: pl.O[0], cy: pl.O[1], r: pl.u, fill: "none", stroke: C.encre, "stroke-width": 2.5 }, pl.fond);
        var t = n.a * D.DEG, p = [Math.cos(t), Math.sin(t)];
        pl.arc(pl.fig, [0, 0], 0.25, 0, n.a, C.jeu, "θ");
        D.ligne(pl.fig, pl.P([0, 0]), pl.P(p), C.encre, 4);
        D.ligne(pl.fig, pl.P(p), pl.P([p[0], 0]), C.x, 3, "6 5"); D.ligne(pl.fig, pl.P(p), pl.P([0, p[1]]), C.y, 3, "6 5");
        D.rond(pl.haut, pl.P(p), 10, { fill: C.jeu, stroke: "#fff", ep: 3 });
      } else if (n.mode === "triangle") {
        var A = [-0.8, -0.6], B = [0.6, -0.6], H = [0.6, 0.208];
        E.s("polygon", { points: [A, B, H].map(pl.P).join(" "), fill: "rgba(59,91,219,.08)", stroke: C.encre, "stroke-width": 3 }, pl.fig);
        pl.arc(pl.fig, A, 0.3, 0, 30, C.jeu, "α");
        D.texte(pl.haut, "adjacent", pl.P([-0.1, -0.72]), { taille: 18, coul: C.x });
        D.texte(pl.haut, "opposé", pl.P([0.78, -0.2]), { taille: 18, coul: C.y, ancre: "start" });
        D.texte(pl.haut, "hypoténuse", pl.P([-0.2, -0.05]), { taille: 18, coul: C.doux, ancre: "end" });
        E.s("rect", { x: pl.P(B)[0] - 18, y: pl.P(B)[1] - 18, width: 18, height: 18, fill: "none", stroke: C.encre, "stroke-width": 2 }, pl.fig);
      } else if (n.mode === "bras") {
        var b = n.bras, q = [Math.cos(b * D.DEG), Math.sin(b * D.DEG)]; // dessiné à l'échelle 2
        pl.arc(pl.fig, [0, 0], 0.3, 0, b, C.jeu, b + "°");
        D.ligne(pl.fig, pl.P([0, 0]), pl.P(q), C.encre, 14);
        D.rond(pl.haut, pl.P([0, 0]), 11, { fill: "#fff", stroke: C.encre, ep: 3 });
        D.rond(pl.haut, pl.P(q), 9, { fill: C.jeu, stroke: "#fff", ep: 3 });
        D.texte(pl.haut, "0,5 m", pl.P([q[0] / 2 + 0.1, q[1] / 2 + 0.06]), { taille: 17, coul: C.doux });
      } else if (n.mode === "vecteur") {
        var s = 0.2, v = n.vec;
        pl.vec(pl.fig, [0, 0], [v[0] * s, v[1] * s, 0], C.v, 5, "V = (3 ; 4)", { decal: [70, 0] });
        if (n.unitaire) { E.s("circle", { cx: pl.O[0], cy: pl.O[1], r: pl.u, fill: "none", stroke: C.pale, "stroke-width": 2.5, "stroke-dasharray": "6 6" }, pl.fond); pl.vec(pl.haut, [0, 0], [0.6, 0.8, 0], C.jeu, 6, "u", { decal: [-18, -10] }); }
      } else if (n.mode === "matrice") {
        var M = n.M;
        pl.vec(pl.fig, [0, 0], [M[0][0] * 0.4, M[1][0] * 0.4, 0], C.x, 5, "colonne 1", { decal: [0, 24] });
        pl.vec(pl.fig, [0, 0], [M[0][1] * 0.4, M[1][1] * 0.4, 0], C.y, 5, "colonne 2", { decal: [60, 0] });
        if (n.res) pl.vec(pl.haut, [0, 0], [n.res[0] * 0.4, n.res[1] * 0.4, 0], C.v, 6, "MV", { decal: [30, 10] });
      }
    };
    n.pl = pl;
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Signes", jouer: function (j, n) {
      j.fig.astuce("Le point est sur le cercle de rayon 1, à θ = 210°.");
      j.titre("Sans calculer : quels sont les signes de \\(\\cos 210°\\) et \\(\\sin 210°\\) ?");
      j.choix([{ tex: "(+,\\ +)", aide: "Le point est à gauche de l'axe vertical : son cosinus est négatif." }, { tex: "(-,\\ +)", aide: "Le point est sous l'axe horizontal : son sinus est négatif." }, { tex: "(-,\\ -)", juste: true }, { tex: "(+,\\ -)", aide: "Le point est à gauche : cosinus négatif." }], { colonnes: 4, ok: function () {
        j.bravo("3\\(^\\text{e}\\) quadrant : les deux sont négatifs.");
        j.expliquer("<p>Le cosinus est l'abscisse du point, le sinus son ordonnée. Il suffit de regarder où est le point : à gauche, cosinus négatif ; en bas, sinus négatif. Avec l'angle de référence 30° : \\(\\cos 210° = -\\cos 30° \\approx -0{,}866\\) et \\(\\sin 210° = -\\sin 30° = -0{,}5\\).</p>");
        j.suite();
      } });
    } },
    { nom: "Trouve l'erreur", jouer: function (j, n) {
      n.mode = "triangle"; n.dessin();
      j.fig.astuce("Un triangle rectangle, l'angle étudié en bas à gauche.");
      j.titre("Une camarade écrit : « adjacent = hypoténuse × sin α ». Qu'est-ce qui ne va pas ?");
      j.choix([{ html: "Elle a confondu sinus et cosinus", juste: true }, { html: "Il faut diviser par l'hypoténuse", aide: "On cherche un côté à partir de l'hypoténuse : on multiplie bien. C'est la fonction qui est fausse." }, { html: "Rien, c'est correct", aide: "Le sinus relie l'angle au côté opposé, pas au côté adjacent." }], { colonnes: 1, ok: function () {
        j.bravo("Adjacent = hypoténuse × cos, opposé = hypoténuse × sin.");
        j.expliquer("<p>Moyen de ne plus se tromper : sur le cercle, l'hypoténuse est le rayon, le côté adjacent est posé sur l'axe x (c'est l'abscisse, donc le cosinus), le côté opposé est vertical (l'ordonnée, donc le sinus).</p>");
        j.suite();
      } });
    } },
    { nom: "Nouveau bras", jouer: function (j, n) {
      n.mode = "bras"; n.bras = 120; n.dessin();
      j.fig.astuce("Un bras de 0,5 m, tourné de 120°.");
      j.titre("Où est le bout du bras ? Donne \\(x\\) et \\(y\\) en m, à 0,01 près.");
      j.nombre({ avant: "(x \\,;\\ y) =", cases: [{ attendu: -0.25, tol: 0.006 }, { attendu: 0.433, tol: 0.006 }], ligne: true,
        aide: function (k) { return k === 0 ? "\\(x = 0{,}5 \\cos 120°\\). Le bout est à gauche : \\(x\\) est négatif." : "\\(y = 0{,}5 \\sin 120°\\)."; },
        ok: function () {
          j.bravo("\\((0{,}5\\cos 120° \\,;\\ 0{,}5\\sin 120°) = (-0{,}25 \\,;\\ 0{,}433)\\).", n.pl.P([-0.5, 0.866]));
          j.suite();
        } });
    } },
    { nom: "Unitaire", jouer: function (j, n) {
      n.mode = "vecteur"; n.vec = [3, 4]; n.unitaire = false; n.dessin();
      j.fig.astuce("Le vecteur est dessiné à l'échelle 1/5.");
      j.titre("Trouve le vecteur unitaire \\(\\vec{u}\\) qui a la même direction que \\(\\vec{V} = (3 \\,;\\ 4)\\).");
      j.nombre({ avant: "\\vec{u} =", cases: [{ attendu: 0.6, tol: 0.001 }, { attendu: 0.8, tol: 0.001 }], ligne: true,
        aide: function () { return "Divise chaque composante par la norme \\(\\lVert \\vec{V} \\rVert = \\sqrt{3^2 + 4^2}\\)."; },
        ok: function () {
          n.unitaire = true; n.dessin();
          j.bravo("\\(\\lVert \\vec{V} \\rVert = 5\\), donc \\(\\vec{u} = (0{,}6 \\,;\\ 0{,}8)\\).");
          j.expliquer("<p>Un vecteur unitaire garde la direction et oublie la longueur. C'est pour cela que les axes d'un repère sont unitaires : les colonnes d'une matrice de rotation sont des vecteurs de norme 1.</p>");
          j.suite();
        } });
    } },
    { nom: "Lire une matrice", jouer: function (j, n) {
      n.mode = "matrice"; n.M = [[1, 0], [0, -1]]; n.res = null; n.dessin();
      j.fig.astuce("Les deux colonnes de M.");
      j.titre("Avec \\(M = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}\\), calcule \\(MV\\) pour \\(V = (2 \\,;\\ 1)\\). Puis dis ce que fait \\(M\\).");
      j.nombre({ avant: "MV =", cases: [{ attendu: 2, tol: 0 }, { attendu: -1, tol: 0 }], ligne: true,
        aide: function () { return "\\(MV = 2 \\times \\text{colonne 1} + 1 \\times \\text{colonne 2}\\)."; },
        ok: function () {
          n.res = [2, -1]; n.dessin();
          j.choix([{ html: "Une rotation", aide: "Une rotation garde l'orientation : ici l'axe y est retourné." }, { html: "Un miroir par rapport à l'axe x", juste: true }, { html: "Un étirement", aide: "Les longueurs ne changent pas." }], { ok: function () {
            j.bravo("Un miroir : \\(y\\) change de signe.");
            j.expliquer("<p>Ses colonnes sont unitaires et perpendiculaires, comme celles d'une rotation, mais son déterminant vaut \\(-1\\). C'est exactement ce qui la sépare des rotations dans le chapitre sur SO(3).</p>");
            j.suite();
          } });
        } });
    } }
  ]
});
