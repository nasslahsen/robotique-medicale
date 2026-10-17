/* Niveau : produit de deux matrices (colonne par colonne), l'ordre compte, transposée, erreur classique. */
NIVEAU({
  id: "produit-matrices",
  init: function (fig) {
    var C = D.C, pl = D.plan(fig.svg, [340, 330], 105);
    var n = { M: [[1, 0], [0, 1]], fantome: null, colonnes: true, etiquette: null };
    var F = [[[0, 0], [0, 1.2]], [[0, 1.2], [0.7, 1.2]], [[0, 0.6], [0.5, 0.6]]];
    function mv(M, p) { return [M[0][0] * p[0] + M[0][1] * p[1], M[1][0] * p[0] + M[1][1] * p[1]]; }
    function lettre(g, M, coul, ep) { F.forEach(function (s) { D.ligne(g, pl.P(mv(M, s[0])), pl.P(mv(M, s[1])), coul, ep); }); }
    n.dessin = function () {
      pl.vider();
      pl.grille({ pas: 0.5, fort: 2 });
      D.fleche(pl.fond, pl.P([-3, 0]), pl.P([3, 0]), "#c3c8d2", 2.5);
      D.fleche(pl.fond, pl.P([0, -2.6]), pl.P([0, 2.7]), "#c3c8d2", 2.5);
      lettre(pl.fond, [[1, 0], [0, 1]], "#d9dde6", 10);
      if (n.fantome) lettre(pl.fond, n.fantome, "rgba(139,63,217,.35)", 10);
      lettre(pl.fig, n.M, C.jeu, 12);
      if (n.colonnes) {
        pl.vec(pl.haut, [0, 0], [n.M[0][0], n.M[1][0], 0], C.x, 5, "colonne 1", { decal: [0, 24] });
        pl.vec(pl.haut, [0, 0], [n.M[0][1], n.M[1][1], 0], C.y, 5, "colonne 2", { decal: [0, -22] });
      }
      fig.chip(n.etiquette);
    };
    n.vers = function (M, ms, fin) {
      var de = n.M.map(function (l) { return l.slice(); });
      E.anime(ms || 900, function (e) { n.M = [0, 1].map(function (i) { return [0, 1].map(function (k) { return de[i][k] + (M[i][k] - de[i][k]) * e; }); }); n.dessin(); }, function () { n.M = M; n.dessin(); if (fin) fin(); });
    };
    n.pl = pl;
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Une matrice déforme", jouer: function (j, n) {
      n.etiquette = "I";
      j.fig.astuce("La lettre F grise est l'original. Les flèches sont les colonnes de la matrice appliquée.");
      j.titre("Applique \\(A = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}\\), puis \\(B = \\begin{pmatrix} 2 & 0 \\\\ 0 & 1 \\end{pmatrix}\\). Que fait chacune ?");
      var z = j.zone("", ""); z.style.cssText = "display:flex;gap:10px;margin-bottom:12px";
      [["Voir A", [[0, -1], [1, 0]], "A"], ["Voir B", [[2, 0], [0, 1]], "B"]].forEach(function (x) {
        var b = E.h("button", "btn clair", x[0], z); b.type = "button";
        b.addEventListener("click", function () { n.etiquette = x[2]; n.vers(x[1], 700); });
      });
      j.choix([{ html: "A tourne d'un quart de tour, B étire selon x", juste: true }, { html: "A étire selon x, B tourne d'un quart de tour", aide: "Regarde où va la colonne 1 avec A : \\((1 \\,;\\ 0)\\) devient \\((0 \\,;\\ 1)\\)." }, { html: "Les deux tournent", aide: "Avec B, la lettre garde sa direction mais devient deux fois plus large." }], { colonnes: 1, ok: function () {
        j.bravo("A : rotation de 90°. B : étirement ×2 selon x.");
        j.suite();
      } });
    } },
    { nom: "Colonne par colonne", jouer: function (j, n) {
      n.etiquette = "B"; n.vers([[2, 0], [0, 1]], 500);
      j.fig.astuce("Les flèches : les colonnes de B, (2 ; 0) et (0 ; 1).");
      j.titre("Calcule \\(AB\\). Chaque colonne de \\(AB\\) est \\(A\\) fois la colonne de \\(B\\).");
      j.texte("\\[ AB = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix} \\begin{pmatrix} 2 & 0 \\\\ 0 & 1 \\end{pmatrix} \\]");
      j.nombre({ avant: "AB =", colonnes: 2, cases: [{ attendu: 0, tol: 0 }, { attendu: -1, tol: 0 }, { attendu: 2, tol: 0 }, { attendu: 0, tol: 0 }],
        aide: function (k) { return k === 0 || k === 2 ? "Colonne 1 : \\(A \\times (2 \\,;\\ 0) = 2 \\times (0 \\,;\\ 1) = (0 \\,;\\ 2)\\)." : "Colonne 2 : \\(A \\times (0 \\,;\\ 1)\\), c'est la colonne 2 de A."; },
        ok: function () {
          n.etiquette = "AB"; n.vers([[0, -1], [2, 0]], 900);
          j.bravo("\\(AB = \\begin{pmatrix} 0 & -1 \\\\ 2 & 0 \\end{pmatrix}\\) : étirer, puis tourner.");
          j.expliquer("\\[ (AB)_{ij} = \\sum_k a_{ik}\\, b_{kj} \\]<p>Case \\((i, j)\\) : ligne \\(i\\) de \\(A\\) fois colonne \\(j\\) de \\(B\\). Et appliquer \\(AB\\) à un vecteur, c'est \\(A(BV)\\) : on applique d'abord \\(B\\), celle de droite, puis \\(A\\).</p>");
          j.suite();
        } });
    } },
    { nom: "L'ordre compte", jouer: function (j, n) {
      n.fantome = [[0, -1], [2, 0]]; n.etiquette = "AB"; n.dessin();
      j.fig.astuce("En violet pâle : le résultat de AB.");
      j.titre("Prédis d'abord : \\(BA\\) (tourner, puis étirer) donne-t-il la même lettre que \\(AB\\) ?");
      j.choix([{ html: "Oui, c'est le même produit", aide: "Essaie : tourne la lettre d'abord, puis étire-la selon x. La partie étirée n'est plus la même." }, { html: "Non", juste: true }], { colonnes: 2, ok: function () {
        n.etiquette = "BA"; n.vers([[0, -2], [1, 0]], 900);
        j.bravo("\\(BA = \\begin{pmatrix} 0 & -2 \\\\ 1 & 0 \\end{pmatrix} \\neq AB\\).");
        j.expliquer("<p>En général \\(AB \\neq BA\\) : le produit de matrices n'est pas commutatif. Tu le retrouveras partout : l'ordre des rotations d'Euler, et \\(\\text{Rot} \\cdot \\text{Trans} \\neq \\text{Trans} \\cdot \\text{Rot}\\) pour les matrices homogènes.</p>");
        j.suite();
      } });
    } },
    { nom: "Transposée", jouer: function (j, n) {
      n.fantome = null; n.etiquette = "A"; n.vers([[0, -1], [1, 0]], 600);
      j.fig.astuce("");
      j.titre("La transposée \\(A^T\\) échange lignes et colonnes. Écris \\(A^T\\).");
      j.texte("\\[ A = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix} \\]");
      j.nombre({ avant: "A^T =", colonnes: 2, cases: [{ attendu: 0, tol: 0 }, { attendu: 1, tol: 0 }, { attendu: -1, tol: 0 }, { attendu: 0, tol: 0 }],
        aide: function () { return "La ligne 1 de \\(A^T\\) est la colonne 1 de \\(A\\) : \\((0 \\,;\\ 1)\\)."; },
        ok: function () {
          n.etiquette = "AᵀA"; n.vers([[1, 0], [0, 1]], 1100);
          j.bravo("\\(A^T = \\begin{pmatrix} 0 & 1 \\\\ -1 & 0 \\end{pmatrix}\\) : un quart de tour dans l'autre sens.");
          j.expliquer("<p>Appliquer \\(A\\) puis \\(A^T\\) ramène la lettre à sa place : \\(A^T A = I\\). Pour une matrice de rotation, la transposée est l'inverse. C'est la propriété \\(R^{-1} = R^T\\) du chapitre sur les orientations.</p>");
          j.suite();
        } });
    } },
    { nom: "Trouve l'erreur", jouer: function (j, n) {
      j.titre("Un camarade a écrit ce calcul. Où est l'erreur ?");
      j.texte("\\[ \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix} \\begin{pmatrix} 5 & 6 \\\\ 7 & 8 \\end{pmatrix} = \\begin{pmatrix} 5 & 12 \\\\ 21 & 32 \\end{pmatrix} \\]");
      j.choix([{ html: "Il a multiplié case par case", juste: true }, { html: "Il a inversé l'ordre des matrices", aide: "Calcule \\(BA\\) : sa première case est \\(5 \\times 1 + 6 \\times 3 = 23\\), pas 5." }, { html: "Il n'y a pas d'erreur", aide: "Case \\((1,1)\\) : ligne 1 fois colonne 1, \\(1 \\times 5 + 2 \\times 7\\)." }], { colonnes: 1, ok: function () {
        j.info("Oui : \\(1 \\times 5 = 5\\), \\(2 \\times 6 = 12\\)… Corrige la première ligne.");
        j.nombre({ avant: "\\text{ligne 1} :", cases: [{ attendu: 19, tol: 0 }, { attendu: 22, tol: 0 }], ligne: true,
          aide: function (k) { return k === 0 ? "\\(1 \\times 5 + 2 \\times 7\\)." : "\\(1 \\times 6 + 2 \\times 8\\)."; },
          ok: function () {
            j.bravo("\\((19 \\,;\\ 22)\\) : ligne 1 fois chaque colonne.");
            j.suite();
          } });
      } });
    } }
  ]
});
