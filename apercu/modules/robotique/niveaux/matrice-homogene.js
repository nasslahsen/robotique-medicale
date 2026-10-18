/* Niveau : matrice homogène T^{0,s}, construction par blocs, application, 1 ou 0, inverse. */
NIVEAU({
  id: "matrice-homogene",
  init: function (fig) {
    var C = D.C, pl = D.plan(fig.svg, [150, 470], 150);
    var n = { Os: [1, 2], a: 90, w: 1, montre: true };
    var b = fig.bande("");
    n.dessin = function () {
      pl.vider(); pl.grille({ pas: 0.5, fort: 2 });
      pl.axes({ lx: [-0.5, 3.2], ly: [-0.5, 2.9] });
      for (var k = 1; k <= 3; k++) D.texte(pl.fond, String(k), pl.P([k, -0.18]), { coul: C.gris, taille: 14, gras: false, mono: true });
      for (k = 1; k <= 2; k++) D.texte(pl.fond, String(k), pl.P([-0.18, k]), { coul: C.gris, taille: 14, gras: false, mono: true });
      pl.origine(pl.fig, "O₀");
      var R = E.Rz(n.a * D.DEG), xs = E.col(R, 0), ys = E.col(R, 1), Os = [n.Os[0], n.Os[1], 0];
      D.ligne(pl.fond, pl.P([Os[0] - 0.15 * xs[0], Os[1] - 0.15 * xs[1]]), pl.P([Os[0] + 0.5 * xs[0], Os[1] + 0.5 * xs[1]]), "#d8c8f0", 22);
      pl.vec(pl.fig, Os, [Os[0] + 0.7 * xs[0], Os[1] + 0.7 * xs[1]], C.x, 4, "xₛ", { decal: [14, 0] });
      pl.vec(pl.fig, Os, [Os[0] + 0.7 * ys[0], Os[1] + 0.7 * ys[1]], C.y, 4, "yₛ");
      D.rond(pl.fig, pl.P(Os), 7, { fill: C.encre }); D.texte(pl.fig, "Oₛ", [pl.P(Os)[0] + 20, pl.P(Os)[1] + 18], { taille: 19 });
      if (n.montre) {
        var r = E.mv(R, [0.5, 0, 0]), res = [n.w * Os[0] + r[0], n.w * Os[1] + r[1], 0];
        pl.vec(pl.haut, [0, 0], res, n.w ? C.v : C.jeu, 5, n.w ? "M" : "vecteur");
        if (n.w) pl.vec(pl.haut, [0, 0], Os, C.acc, 4, null, { tirets: "8 6" });
      }
      if (n.bande) E.k(b, n.bande()); else b.innerHTML = "";
    };
    n.pl = pl;
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Assembler", jouer: function (j, n) {
      n.montre = false; n.dessin();
      j.fig.astuce("Le même instrument qu'au niveau précédent.");
      j.titre("Range position et orientation dans une seule matrice 4 × 4.");
      j.consigne("Glisse chaque bloc à sa place : la rotation en haut à gauche, la position à droite, et une dernière ligne fixe.");
      var z = j.zone("", '<div style="display:flex;align-items:center;gap:10px;font-size:20px">\\(T^{0,s} =\\)<div style="display:grid;grid-template-columns:auto auto;gap:8px;padding:8px 12px;border-left:3px solid #15171f;border-right:3px solid #15171f;border-radius:10px">' +
        '<span class="trou" data-attendu="R" style="min-width:120px;min-height:80px"></span><span class="trou" data-attendu="P" style="min-height:80px"></span><span class="trou" data-attendu="0"></span><span class="trou" data-attendu="1"></span></div></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "1", tex: "1" }, { id: "P", tex: "O_0O_s^0" }, { id: "0", tex: "0\\ 0\\ 0" }, { id: "R", tex: "R^{0,s}" }],
        aide: "La rotation \\(R^{0,s}\\) est un bloc 3 × 3 ; la position \\(O_0O_s^0\\) est une colonne de 3 nombres ; la dernière ligne vaut \\((0\\ 0\\ 0\\ 1)\\).",
        ok: function () {
          j.bravo("C'est la matrice homogène du cours.");
          j.expliquer("\\[ T^{0,s} = \\begin{pmatrix} R^{0,S} & O_0O_s^0 \\\\ 0\\ 0\\ 0 & 1 \\end{pmatrix} = \\begin{pmatrix} a_x & b_x & c_x & X \\\\ a_y & b_y & c_y & Y \\\\ a_z & b_z & c_z & Z \\\\ 0 & 0 & 0 & 1 \\end{pmatrix} \\]<p>Les colonnes \\(a\\), \\(b\\), \\(c\\) sont les axes de \\(R_s\\) dans \\(R_0\\) ; la quatrième est la position de \\(O_s\\). Le cours l'écrit aussi \\(T_0^1\\), avec \\(\\mathbf{R}_0^1\\) et \\(\\mathbf{P}_0^1\\).</p>");
          j.suite();
        }
      });
    } },
    { nom: "Remplir", jouer: function (j, n) {
      n.bande = function () { return "O_0O_s^0 = (1 \\,;\\ 2 \\,;\\ 0) \\qquad R^{0,s} = R_z(90°)"; }; n.dessin();
      j.titre("Pour l'instrument de l'exemple, écris la quatrième colonne de \\(T^{0,s}\\).");
      j.consigne("Quatre nombres, du haut vers le bas.");
      j.nombre({ avant: "\\text{colonne 4} =", cases: [{ attendu: 1, tol: 0 }, { attendu: 2, tol: 0 }, { attendu: 0, tol: 0 }, { attendu: 1, tol: 0 }],
        aide: function (k) { return k < 3 ? "Les trois premiers nombres sont la position de \\(O_s\\) dans \\(R_0\\)." : "La dernière ligne de \\(T\\) est toujours \\((0\\ 0\\ 0\\ 1)\\)."; },
        ok: function () {
          j.bravo("\\((1 \\,;\\ 2 \\,;\\ 0 \\,;\\ 1)\\).");
          j.expliquer("\\[ T^{0,s} = \\begin{pmatrix} 0 & -1 & 0 & 1 \\\\ 1 & 0 & 0 & 2 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & 1 \\end{pmatrix} \\]");
          j.suite();
        } });
    } },
    { nom: "Appliquer", jouer: function (j, n) {
      n.bande = function () { return "T^{0,s}\\begin{pmatrix} 0{,}5 \\\\ 0 \\\\ 0 \\\\ 1 \\end{pmatrix} = \\ ?"; }; n.dessin();
      j.titre("Multiplie \\(T^{0,s}\\) par la pointe \\(O_sM^s\\), complétée par un 1 : \\((0{,}5 \\,;\\ 0 \\,;\\ 0 \\,;\\ 1)\\).");
      j.nombre({ avant: "T^{0,s}\\begin{pmatrix} O_sM^s \\\\ 1 \\end{pmatrix} =", cases: [{ attendu: 1, tol: 0.001 }, { attendu: 2.5, tol: 0.001 }, { attendu: 0, tol: 0.001 }, { attendu: 1, tol: 0.001 }],
        aide: function (k) { return ["Ligne 1 : \\(0 \\times 0{,}5 + (-1) \\times 0 + 0 \\times 0 + 1 \\times 1\\).", "Ligne 2 : \\(1 \\times 0{,}5 + 0 + 0 + 2 \\times 1\\).", "Ligne 3 : tout est nul sauf \\(0 \\times 1\\).", "Ligne 4 : \\(0 + 0 + 0 + 1 \\times 1\\)."][k]; },
        ok: function () {
          n.montre = true; n.w = 1; n.dessin();
          j.bravo("\\((1 \\,;\\ 2{,}5 \\,;\\ 0 \\,;\\ 1)\\) : la pointe M, en une seule multiplication.", n.pl.P([1, 2.5]));
          j.expliquer("<p>Le produit par blocs redonne exactement la relation (1.3) : \\(O_0M^0 = R^{0,s}\\,O_sM^s + O_0O_s^0\\). C'est le 1 en quatrième position qui « active » la colonne de translation.</p>");
          j.suite();
        } });
    } },
    { nom: "1 ou 0", jouer: function (j, n) {
      n.bande = function () { return "T^{0,s}\\begin{pmatrix} 0{,}5 \\\\ 0 \\\\ 0 \\\\ " + n.w + " \\end{pmatrix}"; }; n.dessin();
      j.fig.astuce("");
      j.titre("Et si l'on met un 0 au lieu du 1 en quatrième coordonnée ?");
      j.consigne("C'est ce qu'on fait pour un vecteur (une direction), et non un point.");
      j.choix([
        { tex: "(1 \\,;\\ 2{,}5 \\,;\\ 0 \\,;\\ 0)", aide: "La colonne de translation est multipliée par ce 0 : la position de \\(O_s\\) disparaît du résultat." },
        { tex: "(0 \\,;\\ 0{,}5 \\,;\\ 0 \\,;\\ 0)", juste: true },
        { tex: "(0{,}5 \\,;\\ 0 \\,;\\ 0 \\,;\\ 0)", aide: "La rotation s'applique toujours : seul le décalage d'origine disparaît." }
      ], { colonnes: 1, ok: function () {
        n.w = 0; n.dessin();
        j.bravo("Seule la rotation agit.");
        j.expliquer("<p>Avec un 1 : un <b>point</b>, qui dépend de l'origine. Avec un 0 : un <b>vecteur</b>, qui n'en dépend pas. La même matrice sert aux deux.</p>");
        j.suite();
      } });
    } },
    { nom: "Inverse", jouer: function (j, n) {
      n.w = 1; n.bande = function () { return "T^{s,0} = (T^{0,s})^{-1} = \\begin{pmatrix} (R^{0,s})^T & -(R^{0,s})^T\\,O_0O_s^0 \\\\ 0\\ 0\\ 0 & 1 \\end{pmatrix}"; }; n.dessin();
      j.titre("Calcule la colonne de position de l'inverse : \\(-(R^{0,s})^T\\,O_0O_s^0\\).");
      j.consigne("\\((R^{0,s})^T = \\begin{pmatrix} 0 & 1 & 0 \\\\ -1 & 0 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}\\) et \\(O_0O_s^0 = (1 \\,;\\ 2 \\,;\\ 0)\\).");
      j.nombre({ avant: "-(R^{0,s})^T\\,O_0O_s^0 =", cases: [{ attendu: -2, tol: 0.001 }, { attendu: 1, tol: 0.001 }, { attendu: 0, tol: 0.001 }],
        aide: function (k) { return ["\\((R^{0,s})^T(1 \\,;\\ 2 \\,;\\ 0) = (2 \\,;\\ -1 \\,;\\ 0)\\), puis on change le signe.", "Deuxième ligne de \\((R^{0,s})^T\\) : \\(-1 \\times 1 + 0 \\times 2\\), puis le signe moins.", "La troisième ligne ne fait intervenir que z, qui vaut 0."][k]; },
        ok: function () {
          j.bravo("\\((-2 \\,;\\ 1 \\,;\\ 0)\\).");
          j.expliquer("<p>Vérification : appliquée à \\((1 \\,;\\ 2{,}5 \\,;\\ 0)\\), l'inverse redonne \\((0 + 2{,}5 - 2 \\,;\\ -1 + 0 + 1 \\,;\\ 0) = (0{,}5 \\,;\\ 0 \\,;\\ 0)\\) : la pointe vue depuis l'instrument. Si \\(X^0 = R\\,X^s + P\\), alors \\(X^s = R^T X^0 - R^T P\\).</p>");
          j.suite();
        } });
    } }
  ]
});
