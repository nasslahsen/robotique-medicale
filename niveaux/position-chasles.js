/* Niveau : position d'un solide, relation de Chasles O0M = O0Os + OsM, position et orientation. */
NIVEAU({
  id: "position-chasles",
  init: function (fig) {
    var C = D.C, pl = D.plan(fig.svg, [120, 480], 115);
    var n = { Os: [2, 1], a: 0, libre: null, cible: null, montreM: true, chasles: true, surBouge: null, surRelache: null };
    var b = fig.bande("");
    function M() { var t = n.a * D.DEG; return [n.Os[0] + 1.5 * Math.cos(t), n.Os[1] + 1.5 * Math.sin(t), 0]; }
    n.M = M;
    n.dessin = function () {
      pl.vider(); pl.grille({ pas: 0.5, fort: 2 });
      pl.axes({ lx: [-0.6, 4.6], ly: [-0.6, 3.9] });
      for (var k = 1; k <= 4; k++) D.texte(pl.fond, String(k), pl.P([k, -0.22]), { coul: C.gris, taille: 14, gras: false, mono: true });
      for (k = 1; k <= 3; k++) D.texte(pl.fond, String(k), pl.P([-0.22, k]), { coul: C.gris, taille: 14, gras: false, mono: true });
      pl.origine(pl.fig, "O₀");
      if (n.cible) { var q = pl.P(n.cible); D.rond(pl.fond, q, 22, { fill: "rgba(255,90,31,.12)", stroke: C.jeu, ep: 2.5, tirets: "5 5" }); D.texte(pl.fond, "cible", [q[0] + 28, q[1] - 20], { coul: C.jeu, taille: 17, ancre: "start" }); }
      var t = n.a * D.DEG, R = E.Rz(t), xs = E.col(R, 0), ys = E.col(R, 1), Os = [n.Os[0], n.Os[1], 0];
      // le solide : un plateau lié à Rs
      var coins = [[-0.35, -0.35], [1.85, -0.35], [1.85, 0.45], [-0.35, 0.45]].map(function (c) { return pl.P([Os[0] + c[0] * xs[0] + c[1] * ys[0], Os[1] + c[0] * xs[1] + c[1] * ys[1]]); });
      E.s("polygon", { points: coins.map(function (p) { return p.join(","); }).join(" "), fill: "rgba(139,63,217,.10)", stroke: "#8b3fd9", "stroke-width": 2.5, "stroke-linejoin": "round" }, pl.fond);
      D.texte(pl.fond, "solide S", pl.P([Os[0] + 0.75 * xs[0] + 0.62 * ys[0], Os[1] + 0.75 * xs[1] + 0.62 * ys[1]]), { coul: "#8b3fd9", taille: 16 });
      pl.vec(pl.fig, Os, [Os[0] + 0.9 * xs[0], Os[1] + 0.9 * xs[1]], C.x, 4, "xₛ");
      pl.vec(pl.fig, Os, [Os[0] + 0.9 * ys[0], Os[1] + 0.9 * ys[1]], C.y, 4, "yₛ");
      var m = M();
      if (n.chasles) {
        pl.vec(pl.haut, [0, 0], Os, C.acc, 4, null, { tirets: "8 6" });
        if (n.montreM) { pl.vec(pl.haut, Os, m, C.jeu, 4); pl.vec(pl.haut, [0, 0], m, C.v, 5); }
      }
      D.rond(pl.haut, pl.P(Os), 7, { fill: C.encre }); D.texte(pl.haut, "Oₛ", [pl.P(Os)[0] - 22, pl.P(Os)[1] + 20], { taille: 19 });
      if (n.montreM) { D.rond(pl.haut, pl.P(m), 8, { fill: C.jeu, stroke: "#fff", ep: 2.5 }); D.texte(pl.haut, "M", [pl.P(m)[0] + 18, pl.P(m)[1] - 16], { coul: C.jeu, taille: 21 }); }
      if (n.libre === "Os") D.poignee(pl.haut, pl.P(Os), C.acc);
      if (n.libre === "rot") D.poignee(pl.haut, pl.P(m), C.jeu);
      fig.chip("α = " + Math.round(n.a) + "°");
      if (n.bande) E.k(b, n.bande()); else b.innerHTML = "";
    };
    D.glisser(fig.svg, {
      debut: function (p) {
        if (n.libre === "Os") { var q = pl.P(n.Os); return Math.hypot(p[0] - q[0], p[1] - q[1]) < 60; }
        if (n.libre === "rot") return true;
        return false;
      },
      bouge: function (p) { // le doigt peut encore bouger après la réussite : on ignore
        if (!n.libre) return;
        var u = pl.U(p);
        if (n.libre === "Os") n.Os = [Math.round(u[0] * 2) / 2, Math.round(u[1] * 2) / 2];
        else if (n.libre === "rot") n.a = Math.round(Math.atan2(u[1] - n.Os[1], u[0] - n.Os[0]) / D.DEG);
        n.dessin(); if (n.surBouge) n.surBouge();
      },
      fin: function () { if (n.surRelache) n.surRelache(); }
    });
    n.animer = function (vers, ms, fin) { var de = n.a; E.anime(ms || 700, function (e) { n.a = de + (vers - de) * e; n.dessin(); }, function () { n.a = vers; n.dessin(); if (fin) fin(); }); };
    n.pl = pl;
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Chasles", jouer: function (j, n) {
      n.bande = function () { return "\\color{#3b5bdb}{\\overrightarrow{O_0O_s} = (2 \\,;\\ 1)} \\qquad \\color{#ff5a1f}{\\overrightarrow{O_sM} = 1{,}5\\,\\vec{x}_s}"; }; n.dessin();
      j.fig.astuce("Le solide S porte son repère Rₛ, d'origine Oₛ.");
      j.titre("Le point M du solide est à 1,5 sur l'axe \\(\\vec{x}_s\\). Où est-il dans \\(R_0\\) ?");
      j.consigne("Ici \\(R_s\\) a les mêmes directions que \\(R_0\\). Ajoute les deux flèches, bout à bout.");
      j.nombre({ avant: "\\overrightarrow{O_0M} =", cases: [{ attendu: 3.5, tol: 0.001 }, { attendu: 1, tol: 0.001 }],
        aide: function () { return "\\(\\vec{x}_s = \\vec{x}_0\\), donc \\(\\overrightarrow{O_sM} = (1{,}5 \\,;\\ 0)\\). Ajoute \\((2 \\,;\\ 1)\\)."; },
        ok: function () {
          j.bravo("\\((2 + 1{,}5 \\,;\\ 1) = (3{,}5 \\,;\\ 1)\\).", n.pl.P(n.M()));
          j.expliquer("<p>C'est la <b>relation de Chasles</b> du cours :</p>\\[ \\overrightarrow{O_0M} = \\overrightarrow{O_0O_s} + \\overrightarrow{O_sM} \\qquad (1.1) \\]<p>La position du solide, c'est le vecteur \\(\\vec{p} = \\overrightarrow{O_0O_s}\\) (flèche bleue en pointillés).</p>");
          j.suite();
        } });
    } },
    { nom: "Tourner", jouer: function (j, n) {
      j.titre("Le solide tourne de 90° autour de \\(O_s\\). Où arrive M ?");
      j.consigne("Le point M reste à 1,5 sur \\(\\vec{x}_s\\)… mais \\(\\vec{x}_s\\) a tourné.");
      j.choix([
        { tex: "(3{,}5 \\,;\\ 1)", aide: "Ça, c'est avant la rotation. M est attaché au solide : il tourne avec lui." },
        { tex: "(0 \\,;\\ 1{,}5)", aide: "Ça, c'est \\(\\overrightarrow{O_sM}\\) seul, exprimé dans \\(R_0\\). Il faut encore ajouter \\(\\overrightarrow{O_0O_s}\\)." },
        { tex: "(2 \\,;\\ 2{,}5)", juste: true }
      ], { ok: function () {
        n.bande = function () { return "\\overrightarrow{O_sM} = 1{,}5\\,\\vec{x}_s = (0 \\,;\\ 1{,}5) \\text{ dans } R_0 \\qquad \\overrightarrow{O_0M} = (2 \\,;\\ 2{,}5)"; };
        n.animer(90, 900, function () {
          j.bravo("Après la rotation, \\(\\vec{x}_s = \\vec{y}_0\\).", n.pl.P(n.M()));
          j.expliquer("<p>Dans les deux cas, \\(\\overrightarrow{O_sM}\\) vaut \\((1{,}5 \\,;\\ 0)\\) <b>dans \\(R_s\\)</b>. Ce qui change, c'est sa traduction dans \\(R_0\\) : il faut connaître l'orientation de \\(R_s\\). C'est le rôle de la matrice de rotation.</p>");
          j.suite();
        });
      } });
    } },
    { nom: "Position ou orientation", jouer: function (j, n) {
      n.libre = "rot"; n.bande = null; n.dessin();
      j.fig.astuce("Fais tourner le solide autour de Oₛ : glisse M.");
      j.titre("Tourne le solide sans déplacer \\(O_s\\). Qu'est-ce qui change ?");
      j.choix([
        { html: "La position \\(\\vec{p}\\) et le point M", aide: "Regarde la flèche bleue \\(\\overrightarrow{O_0O_s}\\) : elle ne bouge pas quand tu tournes." },
        { html: "Seulement le point M, pas \\(\\vec{p}\\)", juste: true },
        { html: "Rien du tout", aide: "M, lui, se déplace : il est attaché au solide qui tourne." }
      ], { colonnes: 1, ok: function () {
        j.bravo("La position est la même, l'orientation a changé.");
        j.expliquer("<p>Règle fondamentale du cours : la <b>position</b> d'un point se décrit par un vecteur \\(\\vec{P}\\) ; l'<b>orientation</b> d'un corps se décrit par un repère attaché \\(\\{B\\}\\). Une aiguille peut changer d'orientation en gardant la même position de pointe, et c'est l'orientation qui décide du trajet dans les tissus.</p>");
        j.suite();
      } });
    } },
    { nom: "Viser", jouer: function (j, n) {
      n.libre = "Os"; n.Os = [2, 1]; n.cible = [1, 3]; n.animer(90, 400);
      n.bande = function () { return "\\overrightarrow{O_0O_s} = (" + E.tc(n.Os[0], 1) + " \\,;\\ " + E.tc(n.Os[1], 1) + ") \\qquad \\overrightarrow{O_0M} = (" + E.tc(n.M()[0], 1) + " \\,;\\ " + E.tc(n.M()[1], 1) + ")"; };
      j.fig.astuce("Fais glisser Oₛ : le solide le suit sans tourner.");
      j.titre("Le solide est tourné de 90°. Déplace-le pour que M arrive sur la cible \\((1 \\,;\\ 3)\\).");
      j.consigne("Réfléchis avant : \\(\\overrightarrow{O_sM} = (0 \\,;\\ 1{,}5)\\) dans \\(R_0\\).");
      var fini = false;
      n.surBouge = function () {
        if (fini) return;
        var m = n.M();
        if (Math.abs(m[0] - 1) < 1e-6 && Math.abs(m[1] - 3) < 1e-6) {
          fini = true; n.libre = null; n.dessin();
          j.bravo("\\(O_s = (1 \\,;\\ 1{,}5)\\).", n.pl.P([1, 3]));
          j.expliquer("<p>On a lu Chasles à l'envers : \\(\\overrightarrow{O_0O_s} = \\overrightarrow{O_0M} - \\overrightarrow{O_sM} = (1 \\,;\\ 3) - (0 \\,;\\ 1{,}5)\\). Un robot fait ce calcul pour placer son poignet quand on lui donne la cible de l'outil.</p>");
          j.suite();
        }
      };
    } }
  ]
});
