/* Niveau : changement de repère V^i = R^{i,j} V^j et relation (1.3). Exemple de la page de cours. */
NIVEAU({
  id: "changement-repere",
  init: function (fig) {
    var C = D.C, pl = D.plan(fig.svg, [150, 470], 150);
    var n = { Os: [1, 2], a: 90, v: [0.5, 0, 0], montre: { chaine: false, V: true, M: false }, libre: false, surBouge: null };
    var b = fig.bande("");
    n.dessin = function () {
      pl.vider(); pl.grille({ pas: 0.5, fort: 2 });
      pl.axes({ lx: [-0.5, 3.2], ly: [-0.5, 2.9] });
      for (var k = 1; k <= 3; k++) D.texte(pl.fond, String(k), pl.P([k, -0.18]), { coul: C.gris, taille: 14, gras: false, mono: true });
      for (k = 1; k <= 2; k++) D.texte(pl.fond, String(k), pl.P([-0.18, k]), { coul: C.gris, taille: 14, gras: false, mono: true });
      pl.origine(pl.fig, "O₀");
      var R = E.Rz(n.a * D.DEG), xs = E.col(R, 0), ys = E.col(R, 1), Os = [n.Os[0], n.Os[1], 0];
      // l'instrument, solidaire de Rs
      D.ligne(pl.fond, pl.P([Os[0] - 0.15 * xs[0], Os[1] - 0.15 * xs[1]]), pl.P([Os[0] + 0.5 * xs[0], Os[1] + 0.5 * xs[1]]), "#d8c8f0", 22);
      pl.vec(pl.fig, Os, [Os[0] + 0.7 * xs[0], Os[1] + 0.7 * xs[1]], C.x, 4, "xₛ", { decal: [14, 0] });
      pl.vec(pl.fig, Os, [Os[0] + 0.7 * ys[0], Os[1] + 0.7 * ys[1]], C.y, 4, "yₛ");
      D.rond(pl.fig, pl.P(Os), 7, { fill: C.encre }); D.texte(pl.fig, "Oₛ", [pl.P(Os)[0] + 20, pl.P(Os)[1] + 18], { taille: 19 });
      var V0 = E.mv(R, n.v), M = [Os[0] + V0[0], Os[1] + V0[1], 0];
      if (n.montre.chaine) { pl.vec(pl.haut, [0, 0], Os, C.acc, 4, null, { tirets: "8 6" }); pl.vec(pl.haut, [0, 0], M, C.v, 5); }
      if (n.montre.V) pl.vec(pl.haut, Os, M, C.jeu, 5);
      if (n.montre.M) { D.rond(pl.haut, pl.P(M), 8, { fill: C.jeu, stroke: "#fff", ep: 2.5 }); D.texte(pl.haut, "M", [pl.P(M)[0] - 4, pl.P(M)[1] - 22], { coul: C.jeu }); }
      if (n.libre) D.poignee(pl.haut, pl.P(M), C.jeu);
      fig.chip("α = " + Math.round(n.a) + "°");
      if (n.bande) E.k(b, n.bande()); else b.innerHTML = "";
    };
    D.glisser(fig.svg, {
      debut: function () { return !!n.libre; },
      bouge: function (p) { if (!n.libre) return; var u = pl.U(p); n.a = Math.round(Math.atan2(u[1] - n.Os[1], u[0] - n.Os[0]) / D.DEG); n.dessin(); if (n.surBouge) n.surBouge(); }
    });
    n.animer = function (vers, ms, fin) { var de = n.a; E.anime(ms || 700, function (e) { n.a = de + (vers - de) * e; n.dessin(); }, function () { n.a = vers; n.dessin(); if (fin) fin(); }); };
    n.pl = pl;
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Traduire", jouer: function (j, n) {
      n.bande = function () { return "V^s = (0{,}5 \\,;\\ 0 \\,;\\ 0) \\qquad R^{0,s} = R_z(90°) = \\begin{pmatrix} 0 & -1 & 0 \\\\ 1 & 0 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}"; }; n.dessin();
      j.fig.astuce("La flèche orange est fixe dans l'instrument, le long de xₛ.");
      j.titre("Un vecteur fixe dans l'instrument vaut \\(V^s = (0{,}5 \\,;\\ 0 \\,;\\ 0)\\). Quelles sont ses coordonnées \\(V^0\\) dans \\(R_0\\) ?");
      j.consigne("Le repère de l'instrument est tourné de 90° autour de \\(\\vec{z}_0\\).");
      j.nombre({ avant: "V^0 =", cases: [{ attendu: 0, tol: 0.001 }, { attendu: 0.5, tol: 0.001 }, { attendu: 0, tol: 0.001 }],
        aide: function () { return "\\(V^0 = R^{0,s}\\,V^s\\) : c'est 0,5 fois la première colonne de \\(R^{0,s}\\)."; },
        ok: function () {
          j.bravo("\\(V^0 = (0 \\,;\\ 0{,}5 \\,;\\ 0)\\) : \\(\\vec{x}_s\\) pointe selon \\(\\vec{y}_0\\).");
          j.expliquer("<p>C'est la relation (1.2) du cours, déjà rencontrée avec la matrice de rotation :</p>\\[ V^i = R^{i,j} \\cdot V^j \\qquad (1.2) \\]<p>Un <b>vecteur</b> (une direction, une longueur) ne dépend que de l'orientation : on ne s'occupe pas de l'origine.</p>");
          j.suite();
        } });
    } },
    { nom: "Placer M", jouer: function (j, n) {
      n.montre = { chaine: true, V: true, M: true };
      n.bande = function () { return "O_0O_s^0 = (1 \\,;\\ 2 \\,;\\ 0) \\qquad O_sM^s = (0{,}5 \\,;\\ 0 \\,;\\ 0) \\qquad \\alpha = 90°"; }; n.dessin();
      j.fig.astuce("La pointe M de l'instrument est au bout de la flèche orange.");
      j.titre("Exemple du cours : où est la pointe M dans \\(R_0\\), en mètres ?");
      j.consigne("Un <b>point</b>, cette fois : il faut ajouter la position de l'origine \\(O_s\\).");
      j.nombre({ avant: "O_0M^0 =", cases: [{ attendu: 1, tol: 0.001 }, { attendu: 2.5, tol: 0.001 }, { attendu: 0, tol: 0.001 }],
        aide: function () { return "\\(O_0M^0 = O_0O_s^0 + R^{0,s}\\,O_sM^s = (1 \\,;\\ 2 \\,;\\ 0) + (0 \\,;\\ 0{,}5 \\,;\\ 0)\\)."; },
        ok: function () {
          j.bravo("\\((1 \\,;\\ 2{,}5 \\,;\\ 0)\\) m.", n.pl.P([1, 2.5]));
          j.expliquer("<p>On projette la relation de Chasles (1.1) dans \\(R_0\\) :</p>\\[ O_0M^0 = O_0O_s^0 + R^{0,s}\\,O_sM^s \\qquad (1.3) \\]<p>\\(O_sM^s\\) est constant (le solide est indéformable), \\(R^{0,s}\\) le traduit dans \\(R_0\\), puis on ajoute la position de \\(O_s\\).</p>");
          j.suite();
        } });
    } },
    { nom: "Dans l'autre sens", jouer: function (j, n) {
      n.montre = { chaine: false, V: false, M: false };
      n.bande = function () { return "V^0 = (0 \\,;\\ 1 \\,;\\ 0) = \\vec{y}_0 \\qquad R^{s,0} = (R^{0,s})^T"; }; n.dessin();
      j.fig.astuce("");
      j.titre("Le vecteur \\(\\vec{y}_0\\) vaut \\(V^0 = (0 \\,;\\ 1 \\,;\\ 0)\\). Combien vaut-il vu depuis l'instrument, \\(V^s\\) ?");
      j.consigne("Regarde la figure : \\(\\vec{y}_0\\) est le long d'un des axes de l'instrument.");
      j.choix([
        { tex: "(1 \\,;\\ 0 \\,;\\ 0)", juste: true },
        { tex: "(0 \\,;\\ 1 \\,;\\ 0)", aide: "Ce sont ses coordonnées dans \\(R_0\\). Vu depuis l'instrument, \\(\\vec{y}_0\\) est le long de \\(\\vec{x}_s\\)." },
        { tex: "(-1 \\,;\\ 0 \\,;\\ 0)", aide: "Le signe : \\(\\vec{x}_s\\) et \\(\\vec{y}_0\\) pointent dans le même sens." }
      ], { ok: function () {
        j.bravo("\\(\\vec{y}_0 = \\vec{x}_s\\), donc \\(V^s = (1 \\,;\\ 0 \\,;\\ 0)\\).");
        j.expliquer("<p>Pour revenir de \\(R_0\\) vers \\(R_s\\), on utilise l'inverse, qui est la transposée :</p>\\[ V^s = R^{s,0}\\,V^0 \\qquad R^{s,0} = (R^{0,s})^T \\]");
        j.suite();
      } });
    } },
    { nom: "Situation", jouer: function (j, n) {
      n.montre = { chaine: true, V: true, M: true }; n.libre = true; n.bande = function () { return "\\{R^{0,s},\\ O_0O_s^0\\} : \\text{ position et orientation}"; }; n.dessin();
      j.fig.astuce("Fais tourner l'instrument autour de Oₛ en glissant M.");
      j.titre("Position et orientation ensemble forment la situation du corps. Combien de paramètres indépendants ?");
      j.consigne("3 pour la position \\(O_0O_s^0\\)… et combien pour l'orientation ?");
      j.choix([{ html: "3", aide: "3, c'est seulement la position. L'orientation en demande aussi." }, { html: "6", juste: true }, { html: "12", aide: "9 nombres dans \\(R\\) plus 3 dans la position, mais les 9 nombres de \\(R\\) sont liés par 6 contraintes." }], { ok: function () {
        n.libre = false; n.dessin();
        j.bravo("6 : 3 pour la position, 3 pour l'orientation.");
        j.expliquer("<p>La situation (ou configuration) du corps rigide se note \\(\\{\\mathbf{R}, \\vec{p}\\}\\) : 3 coordonnées \\((P_x, P_y, P_z)\\) et 3 angles (par exemple les angles d'Euler). Le prochain niveau les range dans une seule matrice.</p>");
        j.suite();
      } });
    } }
  ]
});
