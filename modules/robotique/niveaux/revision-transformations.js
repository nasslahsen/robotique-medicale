/* Révision du chapitre 4 : erreur dans T, point ou vecteur, règle des dominos, nouveau bras 2R, portée. */
NIVEAU({
  id: "revision-transformations",
  init: function (fig) {
    var C = D.C, pl = D.plan(fig.svg, [290, 450], 300);
    var n = { mode: "repere", L: [0.5, 0.3], q: [90, -90], resultat: null, anneau: false };
    n.dessin = function () {
      pl.vider();
      pl.grille({ pas: 0.1, fort: 5 });
      D.fleche(pl.fond, pl.P([-0.5, 0]), pl.P([1.5, 0]), "#c3c8d2", 2.5);
      D.fleche(pl.fond, pl.P([0, -0.3]), pl.P([0, 1.35]), "#c3c8d2", 2.5);
      if (n.mode === "repere") {
        var u = 0.25, Os = [1, 0.6], R = [[0, -1], [1, 0]];
        pl.vec(pl.fig, [0, 0], [u * 2, 0, 0], C.x, 4, "x₀", { decal: [0, 22] }); pl.vec(pl.fig, [0, 0], [0, u * 2, 0], C.y, 4, "y₀", { decal: [-22, 0] });
        D.ligne(pl.fond, pl.P([0, 0]), pl.P(Os), C.doux, 2, "6 5");
        pl.vec(pl.fig, Os, [Os[0] + R[0][0] * u, Os[1] + R[1][0] * u, 0], C.x, 4, "xₛ", { decal: [-20, -6] });
        pl.vec(pl.fig, Os, [Os[0] + R[0][1] * u, Os[1] + R[1][1] * u, 0], C.y, 4, "yₛ", { decal: [0, 22] });
        D.texte(pl.haut, "Oₛ", [pl.P(Os)[0] + 18, pl.P(Os)[1] + 18], { taille: 17 });
        if (n.resultat) pl.vec(pl.haut, [0, 0], [n.resultat[0] * 0.5, n.resultat[1] * 0.5, 0], C.v, 6, "vecteur", { decal: [40, 0] });
      } else {
        var L = n.L, a1 = n.q[0] * D.DEG, a2 = (n.q[0] + n.q[1]) * D.DEG;
        var p1 = [L[0] * Math.cos(a1), L[0] * Math.sin(a1)], p2 = [p1[0] + L[1] * Math.cos(a2), p1[1] + L[1] * Math.sin(a2)];
        if (n.anneau) [Math.abs(L[0] - L[1]), L[0] + L[1]].forEach(function (r) { E.s("circle", { cx: pl.O[0], cy: pl.O[1], r: r * pl.u, fill: "none", stroke: C.jeu, "stroke-width": 3, "stroke-dasharray": "8 6" }, pl.fond); });
        if (n.cibles) n.cibles.forEach(function (c) { D.rond(pl.fond, pl.P(c.p), 10, { fill: "none", stroke: C.encre, ep: 3 }); D.texte(pl.fond, c.nom, [pl.P(c.p)[0] + 18, pl.P(c.p)[1] - 14], { taille: 17, ancre: "start" }); });
        D.ligne(pl.fig, pl.P([0, 0]), pl.P(p1), C.encre, 14); D.ligne(pl.fig, pl.P(p1), pl.P(p2), C.v, 12);
        D.rond(pl.haut, pl.P([0, 0]), 11, { fill: "#fff", stroke: C.encre, ep: 3 }); D.rond(pl.haut, pl.P(p1), 10, { fill: "#fff", stroke: C.encre, ep: 3 });
        D.rond(pl.haut, pl.P(p2), 9, { fill: C.jeu, stroke: "#fff", ep: 3 });
        fig.chip("θ₁ = " + n.q[0] + "°   θ₂ = " + String(n.q[1]).replace("-", "−") + "°");
      }
    };
    n.pl = pl;
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Trouve l'erreur", jouer: function (j, n) {
      j.fig.astuce("Rₛ : origine en (1 ; 0,6 ; 0), tourné de 90° autour de z₀.");
      j.titre("Un camarade écrit la matrice homogène de \\(R_s\\) ainsi. Où est l'erreur ?");
      j.texte("\\[ T^{0,s} = \\begin{pmatrix} 0 & -1 & 0 & 0 \\\\ 1 & 0 & 0 & 0 \\\\ 0 & 0 & 1 & 0 \\\\ 1 & 0{,}6 & 0 & 1 \\end{pmatrix} \\]");
      j.choix([{ html: "La position doit être dans la 4\\(^\\text{e}\\) colonne, pas dans la 4\\(^\\text{e}\\) ligne", juste: true }, { html: "La rotation devrait être \\(R^T\\)", aide: "Les colonnes \\((0 ; 1 ; 0)\\) et \\((-1 ; 0 ; 0)\\) sont bien \\(\\vec{x}_s\\) et \\(\\vec{y}_s\\) dans \\(R_0\\) : la rotation est juste." }, { html: "Rien, c'est correct", aide: "Applique-la au point \\((0 ; 0 ; 0 ; 1)\\), l'origine de \\(R_s\\) : tu dois retrouver \\(O_s\\)." }], { colonnes: 1, ok: function () {
        j.bravo("Dernière ligne : toujours \\((0\\ \\ 0\\ \\ 0\\ \\ 1)\\).");
        j.expliquer("\\[ T^{0,s} = \\begin{pmatrix} R^{0,s} & O_0O_s^0 \\\\ 0\\ 0\\ 0 & 1 \\end{pmatrix} = \\begin{pmatrix} 0 & -1 & 0 & 1 \\\\ 1 & 0 & 0 & 0{,}6 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & 1 \\end{pmatrix} \\]<p>Test rapide : \\(T^{0,s}\\) appliquée à \\((0 ; 0 ; 0 ; 1)\\) donne sa 4\\(^\\text{e}\\) colonne, qui doit être \\(O_s\\).</p>");
        j.suite();
      } });
    } },
    { nom: "Point ou vecteur", jouer: function (j, n) {
      j.titre("Avec la bonne matrice, calcule \\(T^{0,s} (1 ; 0 ; 0 ; 0)^T\\). Prédis d'abord : la translation compte-t-elle ?");
      j.nombre({ avant: "(x \\,;\\ y \\,;\\ z) =", cases: [{ attendu: 0, tol: 0.001 }, { attendu: 1, tol: 0.001 }, { attendu: 0, tol: 0.001 }], ligne: true,
        aide: function () { return "Le 0 en 4\\(^\\text{e}\\) position éteint la 4\\(^\\text{e}\\) colonne : il reste la rotation seule, la 1\\(^\\text{re}\\) colonne."; },
        ok: function () {
          n.resultat = [0, 1]; n.dessin();
          j.bravo("\\((0 ; 1 ; 0)\\) : un vecteur tourne mais ne se translate pas.");
          j.expliquer("<p>Avec un 1, on transforme un <b>point</b> : rotation puis translation. Avec un 0, une <b>direction</b> (un axe, une vitesse) : seule la rotation agit. Ici on obtient \\(\\vec{x}_s\\) exprimé dans \\(R_0\\).</p>");
          j.suite();
        } });
    } },
    { nom: "Les dominos", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("On connaît \\(T^{0,1}\\) (la base vers le segment 1) et \\(T^{1,2}\\) (le segment 1 vers le segment 2). Quelle écriture donne \\(T^{0,2}\\) ?");
      j.choix([{ tex: "T^{0,1}\\, T^{1,2}", juste: true }, { tex: "T^{1,2}\\, T^{0,1}", aide: "Les indices doivent se toucher comme des dominos : \\(0,1\\) puis \\(1,2\\)." }, { tex: "T^{0,1} + T^{1,2}", aide: "Les transformations se composent par produit, pas par somme." }], { ok: function () {
        j.bravo("Les indices intérieurs se touchent et disparaissent : \\(T^{0,\\cancel{1}}\\, T^{\\cancel{1},2} = T^{0,2}\\).");
        j.suite();
      } });
    } },
    { nom: "Nouveau bras", jouer: function (j, n) {
      n.mode = "bras"; n.L = [0.5, 0.3]; n.q = [90, -90]; n.dessin();
      j.fig.astuce("Un bras 2R inconnu : ℓ₁ = 0,5 m, ℓ₂ = 0,3 m.");
      j.titre("Avec \\(\\theta_1 = 90°\\) et \\(\\theta_2 = -90°\\), où est l'effecteur ?");
      j.nombre({ avant: "(x \\,;\\ y) =", cases: [{ attendu: 0.3, tol: 0.006 }, { attendu: 0.5, tol: 0.006 }], ligne: true,
        aide: function (k) { return k === 0 ? "\\(x = \\ell_1\\cos\\theta_1 + \\ell_2\\cos(\\theta_1 + \\theta_2)\\), avec \\(\\theta_1 + \\theta_2 = 0°\\)." : "\\(y = \\ell_1\\sin\\theta_1 + \\ell_2\\sin(\\theta_1 + \\theta_2)\\)."; },
        ok: function () {
          j.bravo("\\((0 + 0{,}3 \\,;\\ 0{,}5 + 0) = (0{,}3 \\,;\\ 0{,}5)\\).", n.pl.P([0.3, 0.5]));
          j.expliquer("<p>Le second segment est orienté de \\(\\theta_1 + \\theta_2\\) par rapport à \\(\\vec{x}_0\\) : c'est la somme des angles qui compte, pas \\(\\theta_2\\) seul. C'est ce que fait le produit \\(T^{0,1} T^{1,2}\\).</p>");
          j.suite();
        } });
    } },
    { nom: "Portée", jouer: function (j, n) {
      n.cibles = [{ nom: "A", p: [0.85, 0] }, { nom: "B", p: [0.1, 0.1] }, { nom: "C", p: [0.4, 0.4] }]; n.dessin();
      j.fig.astuce("Trois cibles. Le bras peut tourner librement.");
      j.titre("Laquelle de ces cibles le bras peut-il atteindre ?");
      j.choix([{ html: "A, à 0,85 m", aide: "Bras tendu, il atteint au plus \\(0{,}5 + 0{,}3 = 0{,}8\\) m." }, { html: "B, à 0,14 m", aide: "Bras replié, il reste au moins à \\(0{,}5 - 0{,}3 = 0{,}2\\) m de la base." }, { html: "C, à 0,57 m", juste: true }], { ok: function () {
        n.anneau = true; n.dessin();
        j.bravo("Entre 0,2 m et 0,8 m : seule C est dans l'anneau.");
        j.suite();
      } });
    } }
  ]
});
