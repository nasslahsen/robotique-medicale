/* Niveau : propriétés des matrices de rotation, le groupe SO(3). */
NIVEAU({
  id: "so3",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var sc = D.scene(fig.svg, { centre: [340, 360], ech: 100, az: 32, el: 22 });
    var n = { mats: [{ M: E.Rz(30 * D.DEG), nom: "" }], choisi: null };
    var b = fig.bande(null);
    n.dessin = function () {
      E.vider(g);
      var l = sc.nouvelle(), k = n.mats.length, pas = k > 1 ? 2.6 : 0;
      n.mats.forEach(function (m, i) {
        var o = [0, (i - (k - 1) / 2) * pas, 0];
        sc.repere(l, o, [[1, 0, 0], [0, 1, 0], [0, 0, 1]], 1.1, null, { pale: true, ep: 2, op: 0.5 });
        sc.repere(l, o, m.M, 1.3, ["x", "y", "z"], { ep: n.choisi === i ? 6 : 4 });
        if (m.nom) sc.texte(l, m.nom, [o[0], o[1], -0.7], { coul: n.choisi === i ? D.C.jeu : D.C.encre, taille: 22 });
      });
      sc.dessiner(g, l);
      if (n.bande) E.k(fig.bande(""), n.bande); else fig.bande(null);
    };
    sc.orbite(function () { n.dessin(); }, function () { return true; });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Colonnes", jouer: function (j, n) {
      n.bande = "R = R_z(30°) = \\begin{pmatrix} 0{,}866 & -0{,}5 & 0 \\\\ 0{,}5 & 0{,}866 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}"; n.dessin();
      j.fig.astuce("En couleur : les axes du repère tourné, colonnes de R. En pâle : R₀.");
      j.titre("Les colonnes de R sont des axes : elles doivent être unitaires et perpendiculaires. Vérifie-le avec deux produits scalaires.");
      j.consigne("Colonne 1 · colonne 1, puis colonne 1 · colonne 2.");
      j.nombre({ avant: "\\begin{gathered} c_1 \\cdot c_1 \\\\ c_1 \\cdot c_2 \\end{gathered} =", cases: [{ attendu: 1, tol: 0.002 }, { attendu: 0, tol: 0.002 }],
        aide: function (k) { return k === 0 ? "\\(0{,}866^2 + 0{,}5^2 + 0^2 = 0{,}75 + 0{,}25\\)." : "\\(0{,}866 \\times (-0{,}5) + 0{,}5 \\times 0{,}866 + 0 \\times 0\\)."; },
        ok: function () {
          j.bravo("Longueur 1 et angle droit.");
          j.expliquer("<p>L'élément \\((i, j)\\) de \\(R^TR\\) est le produit scalaire de la colonne \\(i\\) par la colonne \\(j\\) : 1 sur la diagonale, 0 ailleurs.</p>\\[ R^T R = I \\]<p>C'est l'<b>orthogonalité</b> : les colonnes forment un repère orthonormé.</p>");
          j.suite();
        } });
    } },
    { nom: "L'intrus", jouer: function (j, n) {
      n.mats = [{ M: E.Rz(90 * D.DEG), nom: "A" }, { M: [[1, 0, 0], [0, 1, 0], [0, 0, -1]], nom: "B" }, { M: E.Rx(90 * D.DEG), nom: "C" }];
      n.bande = "A = \\begin{pmatrix} 0 & -1 & 0 \\\\ 1 & 0 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} \\quad B = \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & -1 \\end{pmatrix} \\quad C = \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 0 & -1 \\\\ 0 & 1 & 0 \\end{pmatrix}";
      n.dessin();
      j.fig.astuce("Trois repères, construits avec les colonnes de A, B et C. Tourne la vue.");
      j.titre("Les trois matrices ont des colonnes orthonormées. Laquelle n'est pourtant pas une rotation ?");
      j.consigne("Utilise la main droite sur chaque repère.");
      j.choix([
        { html: "A", aide: "A fait tourner de 90° autour de z : ses axes forment un repère direct." },
        { html: "B", juste: true },
        { html: "C", aide: "C fait tourner de 90° autour de x : repère direct." }
      ], { ok: function () {
        n.choisi = 1; n.dessin();
        j.bravo("B retourne l'axe z : c'est un miroir.");
        j.expliquer("<p>Le repère de B est indirect (main gauche). On le détecte avec le déterminant :</p>\\[ \\det(R) = +1 \\text{ pour une rotation} \\qquad \\det(B) = -1 \\]<p>Les matrices de rotation forment le groupe \\(SO(3)\\) : \\(R^TR = I\\) <b>et</b> \\(\\det R = +1\\).</p>");
        j.suite();
      } });
    } },
    { nom: "Inverse", jouer: function (j, n) {
      n.choisi = null; n.mats = [{ M: E.Rz(30 * D.DEG), nom: "" }];
      n.bande = "R = R_z(30°) = \\begin{pmatrix} 0{,}866 & -0{,}5 & 0 \\\\ 0{,}5 & 0{,}866 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}"; n.dessin();
      j.fig.astuce("");
      j.titre("Pour une rotation, l'inverse se calcule sans effort. Écris la première ligne de \\(R^{-1}\\).");
      j.consigne("Comme \\(R^TR = I\\), l'inverse est la transposée : on échange lignes et colonnes.");
      j.nombre({ avant: "\\text{ligne 1 de } R^{-1} =", cases: [{ attendu: 0.866, tol: 0.002 }, { attendu: 0.5, tol: 0.002 }, { attendu: 0, tol: 0.002 }], ligne: true,
        aide: function () { return "La ligne 1 de \\(R^T\\) est la colonne 1 de \\(R\\)."; },
        ok: function () {
          j.bravo("\\((0{,}866 \\,;\\ 0{,}5 \\,;\\ 0)\\) : la colonne 1 de R couchée.");
          j.expliquer("\\[ R^{-1} = R^T = \\begin{pmatrix} 0{,}866 & 0{,}5 & 0 \\\\ -0{,}5 & 0{,}866 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} = R_z(-30°) \\]<p>Défaire une rotation de 30°, c'est tourner de −30°. Et le calcul est gratuit : pas d'inversion de matrice coûteuse.</p>");
          j.suite();
        } });
    } },
    { nom: "Compter", jouer: function (j, n) {
      j.titre("Une matrice de rotation a 9 nombres. Combien sont vraiment libres ?");
      j.consigne("Compte les contraintes : chaque colonne a une norme 1, et les colonnes sont perpendiculaires deux à deux.");
      j.choix([{ html: "9", aide: "Les 9 nombres ne sont pas libres : les colonnes doivent rester unitaires et perpendiculaires." }, { html: "6", aide: "6, c'est le nombre de contraintes : 3 normes et 3 produits scalaires nuls." }, { html: "3", juste: true }], { ok: function () {
        j.bravo("\\(9 - 6 = 3\\) paramètres.");
        j.expliquer("<p>3 normes égales à 1 et 3 produits scalaires nuls : 6 contraintes. Il reste 3 nombres pour décrire une orientation dans l'espace. On les choisira sous forme de trois angles : les angles d'Euler.</p>");
        j.suite();
      } });
    } }
  ]
});
