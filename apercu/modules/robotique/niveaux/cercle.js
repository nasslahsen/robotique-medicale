/* Niveau : cosinus et sinus comme ombres d'un point sur le cercle. */
NIVEAU({
  id: "cercle",
  init: function (fig) {
    var C = D.C, pl = D.plan(fig.svg, [330, 320], 200);
    var n = { t: 30, r: 1, libre: true, ombres: true, valeurs: true, triangle: false, pyth: false, surAngle: null, surRelache: null };
    var b = fig.bande("");
    n.dessin = function () {
      pl.vider();
      pl.grille({ pas: 0.25, fort: 4 });
      D.fleche(pl.fond, pl.P([-1.45 * Math.max(1, n.r * 0.75), 0]), pl.P([1.5 * Math.max(1, n.r * 0.75), 0]), "#c3c8d2", 2.5);
      D.fleche(pl.fond, pl.P([0, -1.3]), pl.P([0, 1.45 * Math.max(1, n.r * 0.75)]), "#c3c8d2", 2.5);
      D.texte(pl.fond, "x", pl.P([1.5 * Math.max(1, n.r * 0.75), -0.12]), { coul: C.doux });
      D.texte(pl.fond, "y", pl.P([-0.1, 1.45 * Math.max(1, n.r * 0.75)]), { coul: C.doux });
      D.rond(pl.fond, pl.P([0, 0]), n.r * pl.u, { fill: "none", stroke: "#d6dae3", ep: 2.5 });
      if (n.r === 1) { D.texte(pl.fond, "1", pl.P([-1.07, 0.08]), { coul: C.gris, taille: 16 }); D.texte(pl.fond, "1", pl.P([0.07, 1.07]), { coul: C.gris, taille: 16 }); }
      var t = n.t * D.DEG, c = n.r * Math.cos(t), s = n.r * Math.sin(t), M = pl.P([c, s]);
      pl.arc(pl.fig, [0, 0], 0.26 * pl.u, 0, n.t, C.jeu, "θ", { ep: 3 });
      if (n.ombres) {
        D.ligne(pl.fig, M, pl.P([c, 0]), C.x, 2, "6 6"); D.ligne(pl.fig, M, pl.P([0, s]), C.y, 2, "6 6");
        D.ligne(pl.fig, pl.P([0, 0]), pl.P([c, 0]), C.x, 10); D.ligne(pl.fig, pl.P([0, 0]), pl.P([0, s]), C.y, 10);
        var lc = (n.r !== 1 ? n.r + " cos θ" : "cos θ") + (n.valeurs ? " = " + E.fmt(c, 3) : ""), ls = (n.r !== 1 ? n.r + " sin θ" : "sin θ") + (n.valeurs ? " = " + E.fmt(s, 3) : "");
        D.texte(pl.fig, lc, [pl.P([c / 2, 0])[0], pl.P([0, 0])[1] + (s >= 0 ? 26 : -26)], { coul: C.x, taille: 18 });
        D.texte(pl.fig, ls, [pl.P([0, 0])[0] + (c >= 0 ? -12 : 12), pl.P([0, s / 2])[1]], { coul: C.y, taille: 18, ancre: c >= 0 ? "end" : "start" });
      }
      if (n.triangle) E.s("polygon", { points: [pl.P([0, 0]), pl.P([c, 0]), M].map(function (p) { return p.join(","); }).join(" "), fill: "rgba(59,91,219,.10)", stroke: C.acc, "stroke-width": 2 }, pl.fond);
      D.ligne(pl.fig, pl.P([0, 0]), M, C.encre, 5);
      D.rond(pl.fig, pl.P([0, 0]), 6, { fill: C.encre });
      if (n.libre) D.poignee(pl.haut, M, C.jeu); else D.rond(pl.haut, M, 11, { fill: C.jeu, stroke: "#fff", ep: 3 });
      D.texte(pl.haut, "M", [M[0] + (c >= 0 ? 24 : -24), M[1] - 22], { coul: C.jeu, taille: 24 });
      fig.chip("θ = " + String(Math.round(n.t)).replace("-", "−") + "°");
      if (n.valeurs) {
        var tx = "\\color{#e5484d}{\\cos\\theta = " + E.tn(Math.cos(t), 3) + "} \\qquad \\color{#12a26b}{\\sin\\theta = " + E.tn(Math.sin(t), 3) + "}";
        if (n.pyth) tx += " \\qquad \\cos^2\\theta + \\sin^2\\theta = " + E.tn(Math.cos(t) * Math.cos(t) + Math.sin(t) * Math.sin(t), 3);
        E.k(b, tx);
      } else b.innerHTML = "";
    };
    D.glisser(fig.svg, {
      debut: function () { return n.libre; },
      bouge: function (p) { if (!n.libre) return; n.t = Math.round(Math.atan2(pl.O[1] - p[1], p[0] - pl.O[0]) / D.DEG); n.dessin(); if (n.surAngle) n.surAngle(n.t); },
      fin: function () { if (n.libre && n.surRelache) n.surRelache(n.t); }
    });
    n.animer = function (vers, ms, fin) {
      var de = n.t; E.anime(ms || 600, function (e) { n.t = de + (vers - de) * e; n.dessin(); }, function () { n.t = vers; n.dessin(); if (fin) fin(); });
    };
    n.pl = pl;
    fig.astuce("M glisse sur le cercle de rayon 1.");
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Cosinus", jouer: function (j, n) {
      j.titre("L'ombre de M sur l'axe horizontal s'appelle \\(\\cos\\theta\\). Place M pour que \\(\\cos\\theta = 0{,}5\\).");
      j.consigne("La barre rouge est cette ombre. Regarde sa valeur sous la figure.");
      var fini = false;
      j.reponse(gagne);
      function gagne() {
        if (fini) return; fini = true; n.libre = false;
        var v = n.t >= 0 ? 60 : -60; n.animer(v, 250);
        j.bravo("\\(\\cos\\theta = 0{,}5\\) pour \\(\\theta = " + v + "°\\).", n.pl.P([0.5, v > 0 ? 0.87 : -0.87]));
        j.expliquer("<p>Sur le cercle de rayon 1, \\(\\cos\\theta\\) est tout simplement l'abscisse de M. Il y a deux positions qui conviennent, 60° et −60°, symétriques par rapport à l'axe horizontal.</p>");
        j.suite();
      }
      n.surAngle = function () { if (Math.abs(Math.cos(n.t * D.DEG) - 0.5) < 0.008) gagne(); };
      n.surRelache = function () {
        var c = Math.cos(n.t * D.DEG);
        if (Math.abs(c - 0.5) < 0.025) gagne();
        else j.info("Ici \\(\\cos\\theta = " + E.tn(c, 2) + "\\). " + (c > 0.5 ? "L'ombre est trop longue : éloigne M de l'axe horizontal." : "L'ombre est trop courte : rapproche M de l'axe horizontal, côté droit."));
      };
    } },
    { nom: "Sinus", jouer: function (j, n) {
      n.libre = true;
      j.titre("L'ombre sur l'axe vertical s'appelle \\(\\sin\\theta\\). Fais en sorte que \\(\\sin\\theta = 1\\).");
      j.consigne("La barre verte doit atteindre le haut du cercle.");
      var fini = false;
      j.reponse(gagne);
      function gagne() {
        if (fini) return; fini = true; n.libre = false; n.animer(90, 250);
        j.bravo("\\(\\sin 90° = 1\\) et \\(\\cos 90° = 0\\).", n.pl.P([0, 1]));
        j.expliquer("<p>\\(\\sin\\theta\\) est l'ordonnée de M. Les coordonnées de M sont donc :</p>\\[ M = (\\cos\\theta \\,;\\ \\sin\\theta) \\]<p>À 90°, M est tout en haut : l'ombre horizontale disparaît (\\(\\cos 90° = 0\\)) et l'ombre verticale vaut le rayon entier.</p>");
        j.suite();
      }
      n.surAngle = function (a) { if (a === 90) gagne(); };
      n.surRelache = function (a) { if (Math.abs(a - 90) < 4) gagne(); else j.info("Ici \\(\\sin\\theta = " + E.tn(Math.sin(a * D.DEG), 2) + "\\). Le maximum est en haut du cercle."); };
    } },
    { nom: "Prédire", jouer: function (j, n) {
      n.libre = false; n.valeurs = false; n.animer(120, 500);
      j.titre("Sans toucher : quand \\(\\theta = 180°\\), que valent \\(\\cos\\theta\\) et \\(\\sin\\theta\\) ?");
      j.consigne("Imagine M après un demi-tour, puis choisis.");
      j.choix([
        { tex: "(0 \\,;\\ -1)", aide: "Ça, c'est M tout en bas, à −90°. Un demi-tour amène M à gauche." },
        { tex: "(-1 \\,;\\ 0)", juste: true },
        { tex: "(1 \\,;\\ 0)", aide: "Ça, c'est le point de départ, à 0°." }
      ], { ok: function () {
        n.valeurs = true; n.animer(180, 700, function () {
          j.bravo("M est à gauche : \\(\\cos 180° = -1\\), \\(\\sin 180° = 0\\).", n.pl.P([-1, 0]));
          j.expliquer("<p>Le cosinus est négatif quand M est à gauche de l'axe vertical, le sinus est négatif quand M est sous l'axe horizontal. On n'a pas besoin de calculer : la figure donne les signes.</p>");
          j.suite();
        });
      } });
    } },
    { nom: "Pythagore", jouer: function (j, n) {
      n.libre = true; n.triangle = true; n.pyth = false; n.dessin();
      j.titre("Le triangle bleu a pour côtés \\(\\cos\\theta\\), \\(\\sin\\theta\\) et le rayon 1. Que vaut toujours \\(\\cos^2\\theta + \\sin^2\\theta\\) ?");
      j.consigne("Bouge M pour te faire une idée, puis choisis.");
      j.choix([
        { html: "Ça dépend de θ", aide: "Bouge M : le côté le plus long du triangle reste le rayon. Pense à Pythagore." },
        { tex: "1", juste: true },
        { tex: "2", aide: "Essaie avec θ = 0 : \\(\\cos 0 = 1\\) et \\(\\sin 0 = 0\\)." }
      ], { ok: function () {
        n.pyth = true; n.dessin();
        j.bravo("Toujours 1, quel que soit θ.");
        j.expliquer("<p>Le triangle est rectangle et son hypoténuse est le rayon, qui vaut 1. Le théorème de Pythagore donne :</p>\\[ \\cos^2\\theta + \\sin^2\\theta = 1 \\]<p>Bouge M encore : la somme affichée sous la figure ne change pas. On s'en servira pour vérifier qu'une matrice de rotation est correcte.</p>");
        j.suite();
      } });
    } },
    { nom: "Rayon r", jouer: function (j, n) {
      n.libre = false; n.triangle = false; n.pyth = false; n.ombres = false; n.valeurs = false;
      var de = n.pl.u;
      E.anime(600, function (e) { n.pl.u = de + (110 - de) * e; n.r = 1 + e; n.dessin(); }, function () { n.r = 2; n.animer(30, 500); });
      j.fig.astuce("Le bras mesure maintenant 2.");
      j.titre("Le bras d'un robot mesure 2 et fait un angle de 30°. Où est son bout ?");
      j.consigne("Sur le cercle de rayon 1, le bout serait en \\((\\cos 30° \\,;\\ \\sin 30°) = (0{,}866 \\,;\\ 0{,}5)\\).");
      j.choix([
        { tex: "(0{,}866 \\,;\\ 0{,}5)", aide: "Ça, c'est pour un bras de longueur 1. Ici le bras est deux fois plus long." },
        { tex: "(1 \\,;\\ 1{,}732)", aide: "Tu as échangé x et y : le bras est plus près de l'horizontale que de la verticale." },
        { tex: "(1{,}732 \\,;\\ 1)", juste: true }
      ], { ok: function () {
        n.ombres = true; n.valeurs = true; n.dessin();
        j.bravo("Tout est multiplié par la longueur du bras.", n.pl.P([1.732, 1]));
        j.expliquer("<p>Pour un point à distance \\(r\\) et à l'angle \\(\\theta\\) :</p>\\[ x = r\\cos\\theta \\qquad y = r\\sin\\theta \\]<p>C'est la formule qui place le bout de chaque segment d'un bras robotisé. Tu la retrouveras dans le bras 2R, à la fin du parcours.</p>");
        j.suite();
      } });
    } }
  ]
});
