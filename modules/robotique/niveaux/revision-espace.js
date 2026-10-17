/* Révision du chapitre 2 : signe du produit scalaire, main droite, piège de atan2, Chasles avec rotation, pourquoi changer de base. */
NIVEAU({
  id: "revision-espace",
  init: function (fig) {
    var C = D.C, pl = D.plan(fig.svg, [300, 360], 110), g = E.s("g", null, fig.svg);
    var sc = D.scene(fig.svg, { centre: [340, 340], ech: 150, az: 35, el: 24 });
    var n = { mode: "scalaire", b: 120, resultat: null, rot: 0, point: null };
    n.dessin = function () {
      pl.vider(); E.vider(g);
      if (n.mode === "chasles") { pl.u = 75; pl.O = [250, 500]; } else { pl.u = 110; pl.O = [300, 360]; }
      if (n.mode === "espace") {
        var l = sc.nouvelle(), I = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        sc.repere(l, [0, 0, 0], I, 1.3, ["x", "y", "z"], { ep: 4 });
        if (n.resultat) sc.fleche(l, [0, 0, 0], [0, 0, -1.1], C.v, 6, "y ∧ x");
        sc.dessiner(g, l);
        return;
      }
      pl.grille({ pas: 0.5, fort: 2 });
      D.fleche(pl.fond, pl.P([-2.4, 0]), pl.P([3.2, 0]), "#c3c8d2", 2.5);
      D.fleche(pl.fond, pl.P([0, -2.4]), pl.P([0, 2.9]), "#c3c8d2", 2.5);
      if (n.mode === "scalaire") {
        var t = n.b * D.DEG;
        pl.vec(pl.fig, [0, 0], [2, 0, 0], C.acc, 6, "a", { decal: [0, 22] });
        pl.vec(pl.fig, [0, 0], [1.6 * Math.cos(t), 1.6 * Math.sin(t), 0], C.jeu, 6, "b", { decal: [-16, -10] });
        pl.arc(pl.fig, [0, 0], 0.45, 0, n.b, C.doux, n.b + "°");
        if (n.resultat) { D.ligne(pl.haut, pl.P([1.6 * Math.cos(t), 1.6 * Math.sin(t)]), pl.P([1.6 * Math.cos(t), 0]), C.doux, 2, "5 5"); D.ligne(pl.haut, pl.P([0, 0]), pl.P([1.6 * Math.cos(t), 0]), C.ko, 7); D.texte(pl.haut, "ombre de b", pl.P([0.8 * Math.cos(t), -0.3]), { taille: 16, coul: C.ko }); }
      } else if (n.mode === "atan") {
        pl.vec(pl.fig, [0, 0], [-1, -1, 0], C.jeu, 6, "P", { decal: [-14, 16] });
        pl.vec(pl.fig, [0, 0], [1, 1, 0], "#c3c8d2", 4, "direction de 45°", { decal: [60, -8] });
        if (n.resultat) pl.arc(pl.fig, [0, 0], 0.5, 0, -135, C.jeu, "−135°");
      } else if (n.mode === "chasles") {
        var Os = [1, 2], a = n.rot * D.DEG, xs = [Math.cos(a), Math.sin(a)], ys = [-Math.sin(a), Math.cos(a)];
        pl.vec(pl.fig, [0, 0], [Os[0], Os[1], 0], C.doux, 4, "O₀Oₛ", { decal: [-40, 0] });
        pl.vec(pl.fig, Os, [Os[0] + 0.8 * xs[0], Os[1] + 0.8 * xs[1], 0], C.x, 4, "xₛ", { decal: [10, -10] });
        pl.vec(pl.fig, Os, [Os[0] + 0.8 * ys[0], Os[1] + 0.8 * ys[1], 0], C.y, 4, "yₛ", { decal: [10, -10] });
        var M = [Os[0] + 2 * xs[0], Os[1] + 2 * xs[1]];
        D.ligne(pl.fig, pl.P(Os), pl.P(M), "rgba(139,63,217,.4)", 18);
        D.rond(pl.haut, pl.P(M), 9, { fill: C.jeu, stroke: "#fff", ep: 3 }); D.texte(pl.haut, "M", [pl.P(M)[0] + 18, pl.P(M)[1] - 14], { coul: C.jeu });
        if (n.resultat) pl.vec(pl.haut, [0, 0], [M[0], M[1], 0], C.v, 5);
      }
    };
    sc.orbite(function () { n.dessin(); }, function () { return n.mode === "espace"; });
    n.pl = pl;
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Signe", jouer: function (j, n) {
      j.fig.astuce("Deux vecteurs qui font un angle de 120°.");
      j.titre("Sans calculer : quel est le signe de \\(\\vec{a} \\cdot \\vec{b}\\) ?");
      j.choix([{ html: "Positif", aide: "Projette b sur la direction de a : son ombre tombe du mauvais côté." }, { html: "Nul", aide: "Il serait nul à 90° exactement." }, { html: "Négatif", juste: true }], { ok: function () {
        n.resultat = true; n.dessin();
        j.bravo("Angle obtus : \\(\\cos 120° < 0\\).");
        j.expliquer("<p>\\(\\vec{a} \\cdot \\vec{b} = \\lVert \\vec{a} \\rVert \\lVert \\vec{b} \\rVert \\cos\\theta\\) : c'est la longueur de \\(\\vec{a}\\) fois l'ombre de \\(\\vec{b}\\) sur sa direction. Ombre du bon côté : positif ; à 90° : nul ; de l'autre côté : négatif.</p>");
        j.suite();
      } });
    } },
    { nom: "Main droite", jouer: function (j, n) {
      n.mode = "espace"; n.resultat = false; n.dessin();
      j.fig.astuce("Le repère direct (x, y, z). Tourne la vue si tu veux.");
      j.titre("Que vaut \\(\\vec{y} \\wedge \\vec{x}\\) ?");
      j.choix([{ tex: "\\vec{z}", aide: "\\(\\vec{x} \\wedge \\vec{y} = \\vec{z}\\). Ici l'ordre est inversé." }, { tex: "-\\vec{z}", juste: true }, { tex: "\\vec{0}", aide: "Le produit vectoriel est nul pour deux vecteurs alignés ; x et y sont perpendiculaires." }], { ok: function () {
        n.resultat = true; n.dessin();
        j.bravo("Inverser l'ordre change le sens : \\(\\vec{y} \\wedge \\vec{x} = -\\vec{z}\\).");
        j.suite();
      } });
    } },
    { nom: "Norme", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Deux vecteurs de normes 2 et 3 font un angle de 30°. Norme de leur produit vectoriel ?");
      j.nombre({ avant: "\\lVert \\vec{u} \\wedge \\vec{v} \\rVert =", cases: [{ attendu: 3, tol: 0.001 }], ligne: true,
        aide: function () { return "\\(\\lVert \\vec{u} \\rVert \\lVert \\vec{v} \\rVert \\sin\\theta\\), avec \\(\\sin 30° = 0{,}5\\)."; },
        ok: function () { j.bravo("\\(2 \\times 3 \\times 0{,}5 = 3\\) : l'aire du parallélogramme."); j.suite(); } });
    } },
    { nom: "Trouve l'erreur", jouer: function (j, n) {
      n.mode = "atan"; n.resultat = false; n.dessin();
      j.fig.astuce("Le point P = (−1 ; −1) vu de dessus.");
      j.titre("Pour \\(P = (-1 \\,;\\ -1 \\,;\\ 3)\\), un camarade trouve \\(r = \\sqrt{2}\\), \\(\\theta = \\arctan(1) = 45°\\), \\(z = 3\\). Quel est le bon \\(\\theta\\) ?");
      j.choix([{ tex: "45°", aide: "45° est la direction opposée : \\(\\arctan(y/x)\\) a perdu les signes de x et y." }, { tex: "135°", aide: "135° pointe vers \\((-1 \\,;\\ 1)\\) : y serait positif." }, { tex: "-135°", juste: true }], { ok: function () {
        n.resultat = true; n.dessin();
        j.bravo("\\(\\theta = \\operatorname{atan2}(-1, -1) = -135°\\).");
        j.expliquer("<p>\\((1, 1)\\) et \\((-1, -1)\\) donnent le même quotient \\(y/x = 1\\). La fonction \\(\\operatorname{atan2}(y, x)\\) regarde les signes de \\(x\\) et \\(y\\) séparément et rend l'angle dans le bon quadrant.</p>");
        j.suite();
      } });
    } },
    { nom: "Chasles", jouer: function (j, n) {
      n.mode = "chasles"; n.rot = 0; n.resultat = false; n.dessin();
      j.fig.astuce("Le solide a son origine en Oₛ = (1 ; 2). M est à 2 unités sur l'axe xₛ.");
      j.titre("Le solide tourne de 90° autour de \\(O_s\\). Où est \\(M\\) dans \\(R_0\\) ?");
      var bt = E.h("button", "btn clair", "Tourner de 90°", j.el); bt.type = "button";
      bt.addEventListener("click", function () { var de = n.rot, vers = de === 0 ? 90 : 0; E.anime(700, function (e) { n.rot = de + (vers - de) * e; n.dessin(); }); });
      j.nombre({ avant: "\\overrightarrow{O_0 M} =", cases: [{ attendu: 1, tol: 0.001 }, { attendu: 4, tol: 0.001 }], ligne: true,
        aide: function () { return "Après 90°, \\(\\vec{x}_s = \\vec{y}_0\\) : \\(\\overrightarrow{O_s M} = (0 \\,;\\ 2)\\) dans \\(R_0\\). Puis (1.1)."; },
        ok: function () {
          bt.remove(); n.rot = 90; n.resultat = true; n.dessin();
          j.bravo("\\((1 \\,;\\ 2) + (0 \\,;\\ 2) = (1 \\,;\\ 4)\\).", n.pl.P([1, 4]));
          j.consigne("Pourquoi ne pouvait-on pas ajouter directement \\((1 \\,;\\ 2)\\) et \\((2 \\,;\\ 0)\\), les composantes de \\(\\overrightarrow{O_s M}\\) dans \\(R_s\\) ?");
          j.choix([{ html: "Elles sont exprimées dans deux bases différentes", juste: true }, { html: "Parce que M n'est pas une origine", aide: "La relation (1.1) vaut pour tout point M. Le problème vient des axes utilisés pour chaque vecteur." }], { colonnes: 1, ok: function () {
            j.bravo("Il faut d'abord exprimer \\(\\overrightarrow{O_s M}\\) dans \\(R_0\\).");
            j.expliquer("<p>Ce passage de \\(R_s\\) à \\(R_0\\), c'est exactement le travail de la matrice de rotation \\(R^{0,s}\\) du chapitre suivant : \\(O_sM^0 = R^{0,s}\\,O_sM^s\\), la relation (1.2).</p>");
            j.suite();
          } });
        } });
    } }
  ]
});
