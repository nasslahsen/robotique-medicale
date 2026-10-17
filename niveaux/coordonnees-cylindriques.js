/* Niveau : coordonnées polaires et cylindriques, piège de arctan, robot cylindrique RPP. */
NIVEAU({
  id: "coordonnees-cylindriques",
  init: function (fig) {
    var C = D.C, pl = D.plan(fig.svg, [340, 330], 50), g3 = E.s("g", null, fig.svg);
    var sc = D.scene(fig.svg, { centre: [330, 400], ech: 105, az: 35, el: 24 });
    var n = { mode: "plan", P: [5 * Math.cos(45 * D.DEG), 5 * Math.sin(45 * D.DEG)], montre: { r: true, t: true, xy: false }, q: [60, 0.6, 0.8], cible: null };
    var b = fig.bande("");
    n.dessin = function () {
      pl.vider(); E.vider(g3);
      if (n.mode === "plan") {
        pl.grille({ pas: 1, fort: 5 });
        var lim = 6.3;
        D.fleche(pl.fond, pl.P([-lim, 0]), pl.P([lim, 0]), "#c3c8d2", 2.5); D.fleche(pl.fond, pl.P([0, -5.5]), pl.P([0, 5.8]), "#c3c8d2", 2.5);
        D.texte(pl.fond, "X", pl.P([lim, -0.4]), { coul: C.doux }); D.texte(pl.fond, "Y", pl.P([-0.4, 5.8]), { coul: C.doux });
        var P = n.P, r = Math.hypot(P[0], P[1]), t = Math.atan2(P[1], P[0]) / D.DEG;
        if (n.montre.xy) { D.ligne(pl.fig, pl.P(P), pl.P([P[0], 0]), C.x, 2, "5 6"); D.ligne(pl.fig, pl.P(P), pl.P([0, P[1]]), C.y, 2, "5 6"); }
        if (n.montre.t) pl.arc(pl.fig, [0, 0], 46, 0, t, C.jeu, "θ", { ep: 3 });
        if (n.montre.r) { D.ligne(pl.fig, pl.P([0, 0]), pl.P(P), C.acc, 5); D.texte(pl.fig, "r", pl.P([P[0] / 2 - 0.35, P[1] / 2 + 0.35]), { coul: C.acc }); }
        if (n.fantome) { D.ligne(pl.fig, pl.P([0, 0]), pl.P(n.fantome), C.ko, 3, "8 6"); D.texte(pl.fig, "arctan(y/x)", pl.P([n.fantome[0] + 0.2, n.fantome[1] + 0.4]), { coul: C.ko, taille: 17, ancre: "start" }); }
        D.rond(pl.haut, pl.P(P), 10, { fill: C.jeu, stroke: "#fff", ep: 3 });
        D.texte(pl.haut, n.nomP || "P", [pl.P(P)[0] + 20, pl.P(P)[1] - 18], { coul: C.jeu });
        if (n.bande) E.k(b, n.bande()); else b.innerHTML = "";
      } else {
        var l = sc.nouvelle(), th = n.q[0] * D.DEG, R = n.q[1], Z = n.q[2], E3 = [R * Math.cos(th), R * Math.sin(th), Z];
        sc.sol(l, 2.6, true);
        sc.repere(l, [0, 0, 0], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], 2.6, ["X", "Y", "Z"], { pale: true, ep: 3 });
        sc.cylindre(l, [0, 0, 0], 0.22, 2.7, "#d6dbe7");
        sc.pave(l, E.Rz(th), [0, 0, Z], [0, 0, 0], [0.3, 0.3, 0.12], "#cfc1ee");
        sc.segment(l, [0, 0, Z], E3, "#5e3a99", 9);
        sc.segment(l, E3, [E3[0], E3[1], 0], C.gris, 2, "5 5"); sc.segment(l, [0, 0, 0], [E3[0], E3[1], 0], C.acc, 3, "6 5");
        if (n.cible) { sc.point(l, n.cible, 12, "rgba(255,90,31,.35)"); sc.texte(l, "cible", [n.cible[0], n.cible[1], n.cible[2] + 0.35], { coul: C.jeu, taille: 17 }); sc.segment(l, n.cible, [n.cible[0], n.cible[1], 0], C.jeu, 2, "3 6"); }
        sc.point(l, E3, 9, C.jeu);
        sc.dessiner(g3, l);
        E.k(b, "(r, \\theta, z) = (" + E.tn(R, 2) + "\\,;\\ " + n.q[0] + "°\\,;\\ " + E.tn(Z, 1) + ") \\quad\\rightarrow\\quad (x \\,;\\ y \\,;\\ z) = (" + E.tn(E3[0], 2) + "\\,;\\ " + E.tn(E3[1], 2) + "\\,;\\ " + E.tn(Z, 1) + ")");
      }
    };
    sc.orbite(function () { if (n.mode === "robot") n.dessin(); }, function () { return n.mode === "robot"; });
    n.pl = pl;
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Polaire", jouer: function (j, n) {
      n.bande = function () { return "r = 5 \\text{ cm} \\qquad \\theta = 45°"; }; n.dessin();
      j.fig.astuce("1 carreau = 1 cm.");
      j.titre("« La cible est à 5 cm dans la direction de 45°. » Quelles sont ses coordonnées \\(x\\) et \\(y\\) ?");
      j.consigne("L'angle est mesuré depuis l'axe X. Deux décimales.");
      j.nombre({ avant: "(x \\,;\\ y) =", apres: "\\text{cm}", cases: [{ attendu: 3.54, tol: 0.01 }, { attendu: 3.54, tol: 0.01 }],
        aide: function () { return "\\(x = r\\cos\\theta = 5\\cos 45°\\) et \\(y = r\\sin\\theta\\), avec \\(\\cos 45° = \\sin 45° \\approx 0{,}707\\)."; },
        ok: function () {
          n.montre.xy = true; n.dessin();
          j.bravo("\\(5 \\times 0{,}707 \\approx 3{,}54\\) cm pour chacune.");
          j.expliquer("<p>En <b>coordonnées polaires</b>, un point du plan est donné par sa distance \\(r\\) à l'origine et son angle \\(\\theta\\). On revient en cartésien avec le cercle du chapitre 0 :</p>\\[ x = r\\cos\\theta \\qquad y = r\\sin\\theta \\]");
          j.suite();
        } });
    } },
    { nom: "Retour", jouer: function (j, n) {
      n.pl.u = 120; n.P = [-1, 1]; n.montre = { r: false, t: false, xy: true }; n.bande = function () { return "P = (-1 \\,;\\ 1 \\,;\\ 2) \\quad \\text{vu de dessus : } Q = (-1 \\,;\\ 1)"; }; n.nomP = "Q"; n.dessin();
      j.fig.astuce("Vue de dessus : Q est la projection de P sur le sol.");
      j.titre("Le point \\(P = (-1 \\,;\\ 1 \\,;\\ 2)\\). Trouve sa distance \\(r\\) à l'axe Z et son angle \\(\\theta\\).");
      j.consigne("Pythagore pour \\(r\\) (3 décimales). Pour \\(\\theta\\), regarde où est Q.");
      j.nombre({ avant: "(r \\,;\\ \\theta) =", cases: [{ attendu: 1.414, tol: 0.002 }, { attendu: 135, tol: 0.5 }],
        aide: function (k) { return k === 0 ? "\\(r = \\sqrt{(-1)^2 + 1^2} = \\sqrt{2}\\)." : "Q est en haut à gauche, sur la diagonale : entre 90° et 180°, exactement au milieu."; },
        ok: function () {
          n.montre = { r: true, t: true, xy: true }; n.dessin();
          j.bravo("\\(r = \\sqrt{2} \\approx 1{,}414\\), \\(\\theta = 135°\\), et \\(z = 2\\) ne change pas.");
          j.expliquer("<p>En <b>coordonnées cylindriques</b> \\((r, \\theta, z)\\) : \\(r\\) est la distance horizontale à l'axe Z, \\(\\theta\\) l'angle autour de cet axe, \\(z\\) la hauteur.</p>\\[ r = \\sqrt{x^2 + y^2} \\qquad \\theta = \\operatorname{atan2}(y, x) \\qquad z = z \\]");
          j.suite();
        } });
    } },
    { nom: "Le piège", jouer: function (j, n) {
      n.P = [-1, -1]; n.nomP = "Q"; n.montre = { r: true, t: false, xy: true }; n.fantome = [0.9, 0.9];
      n.bande = function () { return "Q = (-1 \\,;\\ -1) \\qquad \\arctan\\!\\left(\\frac{y}{x}\\right) = \\arctan(1) = 45°"; }; n.dessin();
      j.fig.astuce("La flèche rouge montre l'angle donné par arctan(y/x).");
      j.titre("Pour \\(Q = (-1 \\,;\\ -1)\\), la calculatrice donne \\(\\arctan(y/x) = 45°\\). Quel est le vrai angle de Q ?");
      j.choix([
        { html: "45°", aide: "45° pointe en haut à droite, vers \\((1 \\,;\\ 1)\\) : la direction opposée à Q." },
        { html: "135°", aide: "135° pointe en haut à gauche. Q est en bas à gauche." },
        { html: "−135°", juste: true }
      ], { ok: function () {
        n.montre.t = true; n.dessin();
        j.bravo("Q est en bas à gauche : −135°.");
        j.expliquer("<p>\\((1 \\,;\\ 1)\\) et \\((-1 \\,;\\ -1)\\) donnent le même quotient \\(y/x = 1\\) : \\(\\arctan\\) ne peut pas les distinguer. La fonction \\(\\operatorname{atan2}(y, x)\\) regarde les signes de \\(x\\) et de \\(y\\) séparément et rend l'angle dans le bon quadrant, entre −180° et 180°. Attention à l'ordre : \\(y\\) d'abord.</p>");
        j.suite();
      } });
    } },
    { nom: "Robot cylindrique", jouer: function (j, n) {
      n.mode = "robot"; n.fantome = null; n.cible = [-1, 1, 2]; n.q = [60, 0.6, 0.8]; n.dessin();
      j.fig.astuce("Robot RPP : une rotation θ, deux translations z et r. Glisse un doigt pour tourner la vue.");
      j.titre("Amène la pointe du robot cylindrique sur \\(P = (-1 \\,;\\ 1 \\,;\\ 2)\\).");
      j.consigne("Tu as déjà ses coordonnées cylindriques à l'étape 2.");
      var fini = false, cs = [];
      function maj() {
        n.q = cs.map(function (c) { return c.v; }); n.dessin();
        var th = n.q[0] * D.DEG, p = [n.q[1] * Math.cos(th), n.q[1] * Math.sin(th), n.q[2]];
        if (!fini && Math.hypot(p[0] + 1, p[1] - 1, p[2] - 2) < 0.03) {
          fini = true; cs.forEach(function (c) { c.input.disabled = true; });
          j.bravo("θ = 135°, r ≈ 1,41, z = 2.");
          j.expliquer("<p>Pour un robot cylindrique, les variables articulaires sont exactement \\((\\theta, z, r)\\) : ses coordonnées naturelles sont cylindriques, et son espace de travail est un cylindre creux.</p>");
          j.suite();
        }
      }
      cs.push(j.curseur({ nom: "θ", min: -180, max: 180, pas: 5, val: 60, unite: "°", change: maj }));
      cs.push(j.curseur({ nom: "r", min: 0.3, max: 2, pas: 0.01, val: 0.6, dec: 2, change: maj }));
      cs.push(j.curseur({ nom: "z", min: 0.2, max: 2.5, pas: 0.1, val: 0.8, dec: 1, change: maj }));
    } }
  ]
});
