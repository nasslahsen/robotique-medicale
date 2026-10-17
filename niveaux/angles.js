/* Niveau : degrés et radians. Une aiguille qui tourne autour d'un centre. */
NIVEAU({
  id: "angles",
  init: function (fig) {
    var C = D.C, pl = D.plan(fig.svg, [330, 310], 200);
    var n = { a: 0, libre: true, radians: false, arcLong: false, cible: null, surAngle: null, surRelache: null };
    n.dessin = function () {
      pl.vider();
      D.fleche(pl.fond, pl.P([-1.35, 0]), pl.P([1.42, 0]), "#c3c8d2", 2.5);
      D.fleche(pl.fond, pl.P([0, -1.3]), pl.P([0, 1.42]), "#c3c8d2", 2.5);
      // cercle, graduations tous les 30°
      D.rond(pl.fond, pl.P([0, 0]), pl.u, { fill: "none", stroke: "#e3e6ee", ep: 2 });
      for (var d = 0; d < 360; d += 15) {
        var t = d * D.DEG, long = d % 90 === 0, r0 = long ? 0.9 : 0.95;
        D.ligne(pl.fond, pl.P([r0 * Math.cos(t), r0 * Math.sin(t)]), pl.P([Math.cos(t), Math.sin(t)]), long ? "#9aa0ad" : "#d3d7e0", long ? 3 : 2);
        if (d % 30 === 0 && !n.radians) D.texte(pl.fond, (d > 180 ? d - 360 : d) + "°", pl.P([1.16 * Math.cos(t), 1.16 * Math.sin(t)]), { coul: C.gris, taille: 16, gras: false, mono: true });
      }
      if (n.radians) [[0, "0"], [90, "π/2"], [180, "π"], [-90, "−π/2"]].forEach(function (l) {
        var t = l[0] * D.DEG; D.texte(pl.fond, l[1], pl.P([1.17 * Math.cos(t), 1.17 * Math.sin(t)]), { coul: C.gris, taille: 18, mono: true });
      });
      // cible éventuelle (fantôme)
      if (n.cible !== null) {
        var tc = n.cible * D.DEG;
        D.ligne(pl.fond, pl.P([0, 0]), pl.P([Math.cos(tc), Math.sin(tc)]), "#c9cdd8", 6, "2 10");
      }
      // arc et secteur de l'angle
      var a = n.a, t1 = a * D.DEG;
      pl.secteur(pl.fig, [0, 0], 0.32 * pl.u, 0, a, "rgba(255,90,31,.14)");
      pl.arc(pl.fig, [0, 0], 0.32 * pl.u, 0, a, C.jeu, null, { ep: 3 });
      if (n.arcLong) {
        pl.arc(pl.fig, [0, 0], pl.u, 0, a, C.jeu, null, { ep: 9 });
        D.ligne(pl.fig, pl.P([0, 0]), pl.P([1, 0]), C.acc, 9);
        D.texte(pl.fig, "rayon", pl.P([0.5, -0.1]), { coul: C.acc, taille: 19 });
        if (Math.abs(a) > 8) D.texte(pl.fig, "arc", pl.P([1.12 * Math.cos(t1 / 2), 1.12 * Math.sin(t1 / 2)]), { coul: C.jeu, taille: 19 });
      }
      // aiguille
      var bout = pl.P([Math.cos(t1), Math.sin(t1)]);
      D.ligne(pl.fig, pl.P([0, 0]), bout, C.encre, 7);
      D.rond(pl.fig, pl.P([0, 0]), 9, { fill: C.encre });
      if (n.libre) D.poignee(pl.haut, bout, C.jeu); else D.rond(pl.haut, bout, 10, { fill: C.jeu, stroke: "#fff", ep: 3 });
      fig.chip("α = " + String(Math.round(a)).replace("-", "−") + "°");
      if (n.bande) n.bande();
    };
    D.glisser(fig.svg, {
      debut: function () { return n.libre; },
      bouge: function (p) { // le doigt peut encore bouger après la réussite : on ignore
        if (!n.libre) return;
        var a = Math.round(Math.atan2(pl.O[1] - p[1], p[0] - pl.O[0]) / D.DEG);
        n.a = a; n.dessin(); if (n.surAngle) n.surAngle(a);
      },
      fin: function () { if (n.libre && n.surRelache) n.surRelache(n.a); }
    });
    n.animer = function (vers, ms, fin) {
      var de = n.a;
      E.anime(ms || 600, function (e) { n.a = de + (vers - de) * e; n.dessin(); }, function () { n.a = vers; n.dessin(); if (fin) fin(); });
    };
    n.pl = pl;
    fig.astuce("Fais glisser ton doigt autour du centre.");
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Quart de tour", jouer: function (j, n) {
      j.titre("L'aiguille part de l'axe horizontal. Fais-lui faire un quart de tour.");
      j.consigne("Tourne dans le sens inverse des aiguilles d'une montre.");
      var fini = false;
      function gagne() {
        if (fini) return; fini = true; n.libre = false; n.animer(90, 250);
        j.bravo("Un quart de tour : 90°.", n.pl.P([0, 1]));
        j.expliquer("<p>Un tour complet fait 360°, un demi-tour 180°, un quart de tour 90°.</p><p>En maths comme en robotique, un angle positif tourne dans le sens inverse des aiguilles d'une montre : c'est le <b>sens trigonométrique</b>. Tous les angles du cours se mesurent ainsi.</p>");
        j.suite();
      }
      n.surAngle = function (a) { if (Math.abs(a - 90) < 2) gagne(); };
      n.surRelache = function (a) { if (Math.abs(a - 90) < 5) gagne(); else if (Math.abs(a + 90) < 8) j.info("C'est un quart de tour, mais dans le sens des aiguilles d'une montre. Repars dans l'autre sens."); };
    } },
    { nom: "Angle négatif", jouer: function (j, n) {
      n.libre = true; n.animer(0, 400);
      j.titre("Maintenant, amène l'aiguille à −45°.");
      j.consigne("Un signe moins change le sens de rotation.");
      var fini = false;
      function gagne() {
        if (fini) return; fini = true; n.libre = false; n.animer(-45, 250);
        j.bravo("−45°, la moitié d'un quart de tour, vers le bas.", n.pl.P([0.7, -0.7]));
        j.expliquer("<p>Un angle négatif tourne dans le sens des aiguilles d'une montre. La position de −45° est la même que celle de 315° : on a fait un tour moins 45°.</p><p>Le cours utilise des angles négatifs, par exemple \\(\\alpha = -90°\\) pour l'orientation du téléphone.</p>");
        j.suite();
      }
      n.surAngle = function (a) { if (Math.abs(a + 45) < 2) gagne(); };
      n.surRelache = function (a) { if (Math.abs(a + 45) < 5) gagne(); else if (Math.abs(a - 45) < 6) j.info("Ça, c'est +45°. Va de l'autre côté de l'axe horizontal."); };
    } },
    { nom: "Le radian", jouer: function (j, n) {
      n.libre = true; n.arcLong = true; n.animer(20, 400);
      var b = j.fig.bande("");
      n.bande = function () {
        var ratio = Math.abs(n.a) * D.DEG;
        E.k(b, "\\dfrac{\\text{longueur de l'arc}}{\\text{rayon}} = " + E.tn(ratio, 2));
      };
      n.dessin();
      j.titre("Ouvre l'angle jusqu'à ce que l'arc orange soit exactement aussi long que le rayon bleu.");
      j.consigne("Regarde le rapport sous la figure : il doit valoir 1.");
      var fini = false;
      function gagne() {
        if (fini) return; fini = true; n.libre = false; n.animer(57.3, 250);
        j.bravo("Tu viens de trouver 1 radian, environ 57,3°.", n.pl.P([0.54, 0.84]));
        j.expliquer("<p>Le radian mesure un angle par la longueur de l'arc qu'il découpe sur un cercle de rayon 1. Un demi-tour découpe la moitié du cercle, de longueur \\(\\pi\\) :</p>\\[ 180° = \\pi \\text{ rad} \\qquad 1 \\text{ rad} = \\frac{180°}{\\pi} \\approx 57{,}3° \\]");
        j.suite();
      }
      n.surAngle = function (a) { if (Math.abs(a * D.DEG - 1) < 0.012) gagne(); };
      n.surRelache = function (a) {
        var r = a * D.DEG;
        if (Math.abs(r - 1) < 0.03) gagne();
        else j.info(r < 1 ? "L'arc est encore plus court que le rayon : ouvre davantage." : "L'arc est déjà plus long que le rayon : referme un peu.");
      };
    } },
    { nom: "Convertir", jouer: function (j, n) {
      n.arcLong = false; n.radians = true; n.libre = false; n.bande = null; j.fig.bande(null); n.animer(90, 500);
      j.titre("Combien vaut \\(\\dfrac{\\pi}{2}\\) rad en degrés ?");
      j.consigne("Rappel : \\(\\pi\\) rad, c'est un demi-tour.");
      j.choix([
        { html: "45°", aide: "\\(\\pi\\) rad vaut 180°, donc \\(\\pi/2\\) vaut la moitié de 180°." },
        { html: "90°", juste: true },
        { html: "180°", aide: "180°, c'est \\(\\pi\\) rad tout entier. Ici on n'en prend que la moitié." }
      ], { ok: function () {
        j.bravo("Oui : la moitié de 180°.");
        var q = j.zone("", "<h2 style='margin-top:14px'>Et 30° en radians ?</h2>"); j.rendre(q);
        n.animer(30, 500);
        j.choix([
          { tex: "\\dfrac{\\pi}{3}", aide: "\\(\\pi/3\\) rad, c'est 180° divisé par 3, soit 60°." },
          { tex: "\\dfrac{\\pi}{4}", aide: "\\(\\pi/4\\) rad, c'est 45°." },
          { tex: "\\dfrac{\\pi}{6}", juste: true }
        ], { ok: function () {
          j.bravo("Oui : 180° divisé par 6.");
          j.expliquer("<p>Pour passer des degrés aux radians, on multiplie par \\(\\pi/180\\) ; dans l'autre sens, par \\(180/\\pi\\) :</p>\\[ \\alpha_{\\text{rad}} = \\alpha_{\\text{deg}} \\times \\frac{\\pi}{180} \\]<p>À connaître par cœur : 30° = \\(\\pi/6\\), 45° = \\(\\pi/4\\), 60° = \\(\\pi/3\\), 90° = \\(\\pi/2\\).</p>");
          j.suite();
        } });
      } });
    } },
    { nom: "Viser en radians", jouer: function (j, n) {
      n.libre = true; n.radians = true; n.cible = null; n.animer(0, 400);
      j.titre("Amène l'aiguille à \\(\\dfrac{3\\pi}{4}\\) rad.");
      j.consigne("Les repères du cercle sont maintenant en radians.");
      var fini = false;
      function gagne() {
        if (fini) return; fini = true; n.libre = false; n.animer(135, 250);
        j.bravo("135°, soit trois fois \\(\\pi/4\\).", n.pl.P([-0.7, 0.7]));
        j.expliquer("<p>\\(\\dfrac{3\\pi}{4} = 3 \\times \\dfrac{\\pi}{4} = 3 \\times 45° = 135°\\). Découper en multiples de \\(\\pi/4\\) ou de \\(\\pi/6\\) suffit presque toujours.</p><p>Dans la suite, les angles du cours sont en degrés, mais les calculatrices et les programmes de robot travaillent souvent en radians.</p>");
        j.suite();
      }
      n.surAngle = function (a) { if (Math.abs(a - 135) < 2) gagne(); };
      n.surRelache = function (a) { if (Math.abs(a - 135) < 5) gagne(); else j.info("Tu es à " + Math.round(a) + "°. Un quart de tour, \\(\\pi/2\\), fait 90° ; il en faut encore la moitié d'un en plus."); };
    } }
  ]
});
