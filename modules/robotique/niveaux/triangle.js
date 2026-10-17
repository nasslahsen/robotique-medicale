/* Niveau : le triangle rectangle. Un segment de robot et ses deux projections. */
NIVEAU({
  id: "triangle",
  init: function (fig) {
    var C = D.C, pl = D.plan(fig.svg, [130, 470], 560);
    var n = { x: 0.433, y: 0.25, libre: false, valeurs: false, angle: true, cible: null, surBouge: null, surRelache: null };
    var b = fig.bande("");
    n.dessin = function () {
      pl.vider();
      pl.grille({ pas: 0.1, fort: 5 });
      D.fleche(pl.fond, pl.P([-0.1, 0]), pl.P([0.95, 0]), "#c3c8d2", 2.5);
      D.fleche(pl.fond, pl.P([0, -0.08]), pl.P([0, 0.82]), "#c3c8d2", 2.5);
      for (var k = 1; k <= 8; k++) D.texte(pl.fond, E.fmt(k / 10, 1), pl.P([k / 10, -0.04]), { coul: C.gris, taille: 14, gras: false, mono: true });
      for (k = 1; k <= 7; k++) D.texte(pl.fond, E.fmt(k / 10, 1), pl.P([-0.045, k / 10]), { coul: C.gris, taille: 14, gras: false, mono: true });
      D.texte(pl.fond, "m", pl.P([0.95, -0.045]), { coul: C.gris, taille: 14 });
      if (n.cible) {
        var q = pl.P(n.cible);
        D.rond(pl.fond, q, 22, { fill: PLATEFORME.teinte(.12), stroke: C.jeu, ep: 2.5, tirets: "5 5" }); D.rond(pl.fond, q, 5, { fill: C.jeu });
        D.texte(pl.fond, "cible", [q[0] + 30, q[1] - 22], { coul: C.jeu, taille: 17, ancre: "start" });
      }
      var x = n.x, y = n.y, L = Math.hypot(x, y), t = Math.atan2(y, x) / D.DEG;
      var A = pl.P([x, 0]), M = pl.P([x, y]);
      E.s("polygon", { points: [pl.P([0, 0]), A, M].map(function (p) { return p.join(","); }).join(" "), fill: "rgba(59,91,219,.07)" }, pl.fond);
      // angle droit
      if (x > 0.05 && y > 0.05) E.s("path", { d: "M" + (A[0] - 16) + " " + A[1] + " L" + (A[0] - 16) + " " + (A[1] - 16) + " L" + A[0] + " " + (A[1] - 16), fill: "none", stroke: C.doux, "stroke-width": 2 }, pl.fond);
      D.ligne(pl.fig, pl.P([0, 0]), A, C.x, 8); D.ligne(pl.fig, A, M, C.y, 8);
      D.ligne(pl.fig, pl.P([0, 0]), M, C.encre, 12);
      if (n.angle) pl.arc(pl.fig, [0, 0], 70, 0, t, C.jeu, "θ", { ep: 3 });
      D.rond(pl.fig, pl.P([0, 0]), 9, { fill: "#fff", stroke: C.encre, ep: 3 });
      var lAdj = n.valeurs ? "adjacent = " + E.fmt(x, 3) + " m" : "adjacent", lOpp = n.valeurs ? "opposé = " + E.fmt(y, 3) + " m" : "opposé";
      D.texte(pl.fig, lAdj, [(pl.P([0, 0])[0] + A[0]) / 2, A[1] + 50], { coul: C.x, taille: 18 });
      D.texte(pl.fig, lOpp, [A[0] + 16, (A[1] + M[1]) / 2], { coul: C.y, taille: 18, ancre: "start" });
      var mid = pl.P([x / 2, y / 2]), nrm = [-y / L, x / L];
      D.texte(pl.fig, n.valeurs ? "L = " + E.fmt(L, 3) + " m" : "hypoténuse L", [mid[0] - 14, mid[1] - 14], { coul: C.encre, taille: 18, ancre: "end" });
      if (n.libre) D.poignee(pl.haut, M, C.jeu); else D.rond(pl.haut, M, 10, { fill: C.jeu, stroke: "#fff", ep: 3 });
      fig.chip("θ = " + E.fmt(t, 1) + "°");
      if (n.bandeOn) E.k(b, "x = " + E.tn(x, 3) + "\\qquad y = " + E.tn(y, 3) + "\\qquad L = \\sqrt{x^2 + y^2} = " + E.tn(L, 3)); else b.innerHTML = "";
    };
    D.glisser(fig.svg, {
      debut: function (p) { if (!n.libre) return false; var M = pl.P([n.x, n.y]); return Math.hypot(p[0] - M[0], p[1] - M[1]) < 70; },
      bouge: function (p) { // le doigt peut encore bouger après la réussite : on ignore
        if (!n.libre) return;
        var u = pl.U(p);
        n.x = Math.max(0.02, Math.min(0.85, Math.round(u[0] * 100) / 100));
        n.y = Math.max(0.02, Math.min(0.75, Math.round(u[1] * 100) / 100));
        n.dessin(); if (n.surBouge) n.surBouge();
      },
      fin: function () { if (n.surRelache) n.surRelache(); }
    });
    n.aller = function (x, y, ms, fin) {
      var x0 = n.x, y0 = n.y;
      E.anime(ms || 600, function (e) { n.x = x0 + (x - x0) * e; n.y = y0 + (y - y0) * e; n.dessin(); }, function () { n.x = x; n.y = y; n.dessin(); if (fin) fin(); });
    };
    n.pl = pl;
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Avancer", jouer: function (j, n) {
      j.fig.astuce("Le segment noir est un bras de robot de 0,5 m.");
      j.titre("Le bras mesure 0,5 m et monte de 30°. De combien avance-t-il horizontalement ?");
      j.consigne("C'est la longueur du côté rouge, adjacent à l'angle θ.");
      j.choix([
        { html: "0,25 m", aide: "Ça, c'est la hauteur (le côté vert). Le côté rouge est plus long : le bras est plus près de l'horizontale." },
        { html: "0,433 m", juste: true },
        { html: "0,5 m", aide: "0,5 m, c'est la longueur du bras lui-même. Sa projection horizontale est plus courte." }
      ], { ok: function () {
        n.valeurs = true; n.dessin();
        j.bravo("\\(0{,}5 \\times \\cos 30° = 0{,}5 \\times 0{,}866 = 0{,}433\\) m.");
        j.expliquer("<p>Le côté adjacent à l'angle se calcule avec le cosinus, comme l'ombre sur le cercle, multipliée par la longueur :</p>\\[ \\text{adjacent} = L\\cos\\theta \\]");
        j.suite();
      } });
    } },
    { nom: "Monter", jouer: function (j, n) {
      j.titre("Et de combien monte-t-il ?");
      j.consigne("Le côté vert est opposé à l'angle θ. Tape sa longueur en mètres.");
      n.valeurs = false; n.dessin();
      j.nombre({ avant: "y =", apres: "\\text{m}", cases: [{ attendu: 0.25 }], ligne: true,
        aide: function () { return "Utilise le sinus : \\(0{,}5 \\times \\sin 30°\\), et \\(\\sin 30° = 0{,}5\\)."; },
        ok: function () {
          n.valeurs = true; n.dessin();
          j.bravo("\\(0{,}5 \\times \\sin 30° = 0{,}25\\) m.");
          j.expliquer("\\[ \\text{opposé} = L\\sin\\theta \\]<p>Moyen de s'en souvenir : le cosinus va avec le côté collé à l'angle, le sinus avec le côté d'en face.</p>");
          j.suite();
        } });
    } },
    { nom: "Viser", jouer: function (j, n) {
      n.valeurs = false; n.libre = true; n.cible = [0.4, 0.3]; n.bandeOn = true; n.aller(0.6, 0.15, 500);
      j.fig.astuce("Fais glisser le bout du bras.");
      j.titre("Amène le bout du bras sur la cible.");
      j.consigne("Ensuite, on lira la longueur du bras et son angle.");
      var fini = false;
      function gagne() {
        if (fini) return; fini = true; n.libre = false; n.aller(0.4, 0.3, 200);
        n.valeurs = true;
        j.bravo("Bras de 0,5 m, à 36,9°.", n.pl.P([0.4, 0.3]));
        j.expliquer("<p>On connaît les deux côtés, on retrouve le reste. La longueur avec Pythagore, l'angle avec la tangente (opposé sur adjacent) :</p>\\[ L = \\sqrt{x^2 + y^2} = \\sqrt{0{,}4^2 + 0{,}3^2} = 0{,}5 \\qquad \\tan\\theta = \\frac{y}{x} = 0{,}75 \\ \\Rightarrow\\ \\theta \\approx 36{,}9° \\]");
        j.suite();
      }
      n.surBouge = function () { if (Math.abs(n.x - 0.4) < 0.006 && Math.abs(n.y - 0.3) < 0.006) gagne(); };
      n.surRelache = function () { if (Math.hypot(n.x - 0.4, n.y - 0.3) < 0.02) gagne(); };
    } },
    { nom: "Pythagore", jouer: function (j, n) {
      n.cible = null; n.libre = false; n.valeurs = false; n.bandeOn = false; n.aller(0.6, 0.8, 500);
      j.fig.astuce("");
      j.titre("Le bout d'un autre bras est en \\((0{,}6 \\,;\\ 0{,}8)\\) m. Quelle est la longueur du bras ?");
      j.consigne("Le bras est l'hypoténuse du triangle. Calcule avec Pythagore.");
      j.nombre({ avant: "L =", apres: "\\text{m}", cases: [{ attendu: 1 }], ligne: true,
        aide: function () { return "\\(L = \\sqrt{0{,}6^2 + 0{,}8^2} = \\sqrt{0{,}36 + 0{,}64}\\)."; },
        ok: function () {
          j.bravo("\\(\\sqrt{0{,}36 + 0{,}64} = \\sqrt{1} = 1\\) m.");
          j.expliquer("<p>Et son angle : \\(\\tan\\theta = 0{,}8 / 0{,}6\\), soit \\(\\theta \\approx 53{,}1°\\).</p><p>Ces deux passages, de \\((L, \\theta)\\) vers \\((x, y)\\) et retour, reviennent tout le temps en robotique : un bras connaît ses angles, la tâche donne des positions.</p>");
          j.suite();
        } });
    } }
  ]
});
