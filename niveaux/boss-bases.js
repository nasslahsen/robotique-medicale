/* Boss du chapitre 0 : viser, calculer le bout d'un bras, enchaîner deux segments, choisir la bonne matrice. */
NIVEAU({
  id: "boss-bases",
  init: function (fig) {
    var C = D.C, pl = D.plan(fig.svg, [330, 400], 600);
    var n = { segs: [[0.4, 20]], libre: false, cible: null, fantome: null, surAngle: null, surRelache: null, valeurs: false };
    var b = fig.bande(null);
    n.dessin = function () {
      pl.vider();
      pl.grille({ pas: 0.1, fort: 5 });
      D.fleche(pl.fond, pl.P([-0.52, 0]), pl.P([0.56, 0]), "#c3c8d2", 2.5);
      D.fleche(pl.fond, pl.P([0, -0.28]), pl.P([0, 0.64]), "#c3c8d2", 2.5);
      [-0.5, -0.4, -0.3, -0.2, -0.1, 0.1, 0.2, 0.3, 0.4, 0.5].forEach(function (k) { D.texte(pl.fond, E.fmt(k, 1), pl.P([k, -0.03]), { coul: C.gris, taille: 13, gras: false, mono: true }); });
      [0.1, 0.2, 0.3, 0.4, 0.5, 0.6].forEach(function (k) { D.texte(pl.fond, E.fmt(k, 1), pl.P([-0.035, k]), { coul: C.gris, taille: 13, gras: false, mono: true }); });
      if (n.cible) {
        var q = pl.P(n.cible);
        D.rond(pl.fond, q, 24, { fill: "rgba(255,90,31,.12)", stroke: C.jeu, ep: 2.5, tirets: "5 5" }); D.rond(pl.fond, q, 5, { fill: C.jeu });
        D.texte(pl.fond, "cible", [q[0] + 30, q[1] - 22], { coul: C.jeu, taille: 17, ancre: "start" });
      }
      if (n.fantome) n.fantome();
      var p = [0, 0], cumul = 0, cl = [C.encre, C.v];
      n.segs.forEach(function (s, i) {
        var a = s[2] === "abs" ? s[1] : cumul + s[1]; cumul = a;
        var q = [p[0] + s[0] * Math.cos(a * D.DEG), p[1] + s[0] * Math.sin(a * D.DEG)];
        D.ligne(pl.fig, pl.P(p), pl.P(q), cl[i % 2], 14);
        D.rond(pl.fig, pl.P(p), 10, { fill: "#fff", stroke: C.encre, ep: 3 });
        p = q;
      });
      n.bout = p;
      if (n.libre) D.poignee(pl.haut, pl.P(p), C.jeu); else D.rond(pl.haut, pl.P(p), 9, { fill: C.jeu, stroke: "#fff", ep: 3 });
      if (n.valeurs) D.texte(pl.haut, "(" + E.fmt(p[0], 3) + " ; " + E.fmt(p[1], 3) + ")", [pl.P(p)[0], pl.P(p)[1] - 30], { coul: C.jeu, taille: 18 });
      fig.chip(n.segs.length === 1 ? "θ = " + String(Math.round(n.segs[0][1])).replace("-", "−") + "°" : null);
    };
    D.glisser(fig.svg, {
      debut: function () { return n.libre; },
      bouge: function (p) { n.segs[0][1] = Math.round(Math.atan2(pl.O[1] - p[1], p[0] - pl.O[0]) / D.DEG); n.dessin(); if (n.surAngle) n.surAngle(n.segs[0][1]); },
      fin: function () { if (n.libre && n.surRelache) n.surRelache(n.segs[0][1]); }
    });
    n.animer = function (vers, ms, fin) {
      var de = n.segs[0][1]; E.anime(ms || 500, function (e) { n.segs[0][1] = de + (vers - de) * e; n.dessin(); }, function () { n.segs[0][1] = vers; n.dessin(); if (fin) fin(); });
    };
    n.pl = pl;
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Viser", jouer: function (j, n) {
      n.libre = true; n.cible = [0.2, 0.3464]; n.dessin();
      j.fig.astuce("Fais tourner le bras autour de sa base.");
      j.titre("Le bras mesure 0,4 m. Tourne-le pour que son bout touche la cible.");
      j.consigne("Boss : lâcher à plus de 8° de la cible compte comme une erreur.");
      var fini = false;
      function gagne() {
        if (fini) return; fini = true; n.libre = false; n.animer(60, 200);
        j.bravo("θ = 60° : \\((0{,}4\\cos 60° \\,;\\ 0{,}4\\sin 60°) = (0{,}2 \\,;\\ 0{,}346)\\).", n.pl.P([0.2, 0.346]));
        j.suite();
      }
      n.surAngle = function (a) { if (a === 60) gagne(); };
      n.surRelache = function (a) { if (Math.abs(a - 60) <= 2) gagne(); else if (Math.abs(a - 60) > 8) j.erreur("Raté : le bras est à " + a + "°."); };
    } },
    { nom: "Calculer", jouer: function (j, n) {
      n.libre = false; n.cible = null; n.animer(135, 600);
      j.fig.astuce("");
      j.titre("Le même bras est maintenant à 135°. Où est son bout ?");
      j.consigne("Trois décimales, en mètres.");
      j.nombre({ avant: "(x \\,;\\ y) =", cases: [{ attendu: -0.283, tol: 0.002 }, { attendu: 0.283, tol: 0.002 }],
        aide: function (k) { return k === 0 ? "\\(x = 0{,}4\\cos 135°\\) : le bras pointe vers la gauche, donc x est négatif." : "\\(y = 0{,}4\\sin 135°\\)."; },
        ok: function () {
          n.valeurs = true; n.dessin();
          j.bravo("\\(x = 0{,}4\\cos 135° = -0{,}283\\) et \\(y = 0{,}4\\sin 135° = 0{,}283\\).", n.pl.P([-0.283, 0.283]));
          j.suite();
        } });
    } },
    { nom: "Deux segments", jouer: function (j, n) {
      n.valeurs = false; n.segs = [[0.3, 30], [0.2, 90, "abs"]]; n.dessin();
      j.titre("Deux segments : 0,3 m à 30°, puis 0,2 m tout droit vers le haut. Où est le bout ?");
      j.consigne("Additionne les deux déplacements, composante par composante.");
      j.nombre({ avant: "(x \\,;\\ y) =", cases: [{ attendu: 0.260, tol: 0.002 }, { attendu: 0.350, tol: 0.002 }],
        aide: function (k) { return k === 0 ? "\\(x = 0{,}3\\cos 30° + 0{,}2\\cos 90°\\), et \\(\\cos 90° = 0\\)." : "\\(y = 0{,}3\\sin 30° + 0{,}2\\sin 90°\\)."; },
        ok: function () {
          n.valeurs = true; n.dessin();
          j.bravo("\\((0{,}260 \\,;\\ 0{,}350)\\).", n.pl.P([0.26, 0.35]));
          j.expliquer("<p>Bout à bout, les segments s'additionnent comme des vecteurs. C'est exactement le calcul du bras 2R, à la fin du parcours, où le second angle se compte depuis le premier segment.</p>");
          j.suite();
        } });
    } },
    { nom: "La bonne matrice", jouer: function (j, n) {
      n.valeurs = false; n.segs = [[0.4, 0]]; n.dessin();
      n.fantome = function () { var q = n.pl.P([0, 0.4]); D.ligne(n.pl.fond, n.pl.P([0, 0]), q, "#c9cdd8", 14, "2 14"); };
      n.dessin();
      j.titre("Quelle matrice fait tourner le bras d'un quart de tour, de l'horizontale vers la position en pointillés ?");
      j.consigne("Applique chaque matrice au vecteur \\((1 \\,;\\ 0)\\) : il doit devenir \\((0 \\,;\\ 1)\\).");
      j.choix([
        { tex: "\\begin{pmatrix} 0 & 1 \\\\ -1 & 0 \\end{pmatrix}", aide: "Elle envoie \\((1 \\,;\\ 0)\\) sur sa première colonne, \\((0 \\,;\\ -1)\\) : un quart de tour vers le bas." },
        { tex: "\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}", aide: "Celle-ci ne change rien : c'est la matrice identité." },
        { tex: "\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}", juste: true }
      ], { ok: function () {
        n.animer(90, 700);
        j.bravo("Sa première colonne est \\((0 \\,;\\ 1)\\) : l'image de l'horizontale.", n.pl.P([0, 0.4]));
        j.expliquer("<p>Boss vaincu. Tu as tout ce qu'il faut pour la suite : angles, cosinus et sinus d'un bras, vecteurs bout à bout, et la lecture d'une matrice par ses colonnes.</p>");
        j.suite();
      } });
    } }
  ]
});
