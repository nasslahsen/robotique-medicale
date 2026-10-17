/* Niveau : norme (longueur) d'un vecteur, vecteur unitaire, norme en 3D. */
NIVEAU({
  id: "norme",
  init: function (fig) {
    var C = D.C, pl = D.plan(fig.svg, [150, 470], 92);
    var g3 = E.s("g", null, fig.svg), sc = D.scene(fig.svg, { centre: [330, 360], ech: 105, az: 28, el: 22 });
    var n = { mode: "plan", k: 1, triangle: true, valeurs: false, choix: null };
    var b = fig.bande("");
    n.dessin = function () {
      pl.vider(); E.vider(g3);
      if (n.mode === "plan") {
        pl.grille({ pas: 0.5, fort: 2 });
        D.fleche(pl.fond, pl.P([-0.8, 0]), pl.P([5.5, 0]), "#c3c8d2", 2.5);
        D.fleche(pl.fond, pl.P([0, -0.6]), pl.P([0, 4.8]), "#c3c8d2", 2.5);
        for (var k = 1; k <= 5; k++) D.texte(pl.fond, String(k), pl.P([k, -0.28]), { coul: C.gris, taille: 14, gras: false, mono: true });
        for (k = 1; k <= 4; k++) D.texte(pl.fond, String(k), pl.P([-0.28, k]), { coul: C.gris, taille: 14, gras: false, mono: true });
        var v = [3 * n.k, 4 * n.k, 0];
        if (n.triangle) {
          E.s("polygon", { points: [pl.P([0, 0]), pl.P([v[0], 0]), pl.P(v)].map(function (p) { return p.join(","); }).join(" "), fill: "rgba(59,91,219,.08)" }, pl.fond);
          D.ligne(pl.fig, pl.P([0, 0]), pl.P([v[0], 0]), C.x, 6); D.ligne(pl.fig, pl.P([v[0], 0]), pl.P(v), C.y, 6);
          D.texte(pl.fig, E.fmt(v[0], 2).replace(/,00$/, ""), pl.P([v[0] / 2, -0.32]), { coul: C.x, taille: 20 });
          D.texte(pl.fig, E.fmt(v[1], 2).replace(/,00$/, ""), pl.P([v[0] + 0.35, v[1] / 2]), { coul: C.y, taille: 20, ancre: "start" });
        }
        if (n.k !== 1) pl.vec(pl.fig, [0, 0], [3, 4, 0], "#c9cdd8", 3);
        pl.vec(pl.fig, [0, 0], v, C.acc, 6, "u");
        if (n.cercle) D.rond(pl.fond, pl.P([0, 0]), pl.u, { fill: "none", stroke: C.jeu, ep: 2.5, tirets: "6 6" });
        if (n.cercle) D.texte(pl.fond, "cercle de rayon 1", pl.P([0.72, -0.85]), { coul: C.jeu, taille: 16, ancre: "start" });
        if (n.valeurs) E.k(b, "\\|" + (n.k !== 1 ? E.tc(n.k, 2) + "\\,\\vec{u}" : "\\vec{u}") + "\\| = \\sqrt{" + E.tc(v[0], 2) + "^2 + " + E.tc(v[1], 2) + "^2} = " + E.tc(Math.hypot(v[0], v[1]), 2));
        else b.innerHTML = "";
      } else if (n.mode === "espace") {
        var l = sc.nouvelle(), V = [1, 2, 2];
        sc.sol(l, 3.2);
        sc.repere(l, [0, 0, 0], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], 2.6, ["x", "y", "z"], { pale: true, ep: 3 });
        var P = [[V[0], 0, 0], [V[0], V[1], 0], [0, V[1], 0]];
        sc.segment(l, [0, 0, 0], P[1], C.gris, 2, "6 6");
        P.forEach(function (p, i) { sc.segment(l, p, P[(i + 1) % 3], "#b8bfcc", 2, "4 5"); });
        sc.segment(l, P[1], V, "#b8bfcc", 2, "4 5");
        sc.fleche(l, [0, 0, 0], V, C.v, 6, "V");
        sc.texte(l, "1", [0.5, -0.25, 0], { coul: C.x, taille: 18 });
        sc.texte(l, "2", [1.25, 1, 0], { coul: C.y, taille: 18 });
        sc.texte(l, "2", [1.2, 2.15, 1], { coul: C.z, taille: 18 });
        sc.dessiner(g3, l);
        b.innerHTML = ""; E.k(b, "\\vec{V} = (1 \\,;\\ 2 \\,;\\ 2)");
      }
    };
    n.sc = sc; n.pl = pl;
    sc.orbite(function () { if (n.mode === "espace") n.dessin(); }, function () { return n.mode === "espace"; });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Longueur", jouer: function (j, n) {
      j.titre("Quelle est la longueur du vecteur \\(\\vec{u} = (3 \\,;\\ 4)\\) ?");
      j.consigne("Il est l'hypoténuse d'un triangle rectangle de côtés 3 et 4.");
      j.choix([
        { html: "7", aide: "3 + 4 serait la longueur d'un trajet qui suit le quadrillage. La flèche coupe en diagonale, c'est plus court." },
        { html: "5", juste: true },
        { html: "25", aide: "25, c'est \\(3^2 + 4^2\\). Il reste à prendre la racine carrée." }
      ], { ok: function () {
        n.valeurs = true; n.dessin();
        j.bravo("\\(\\sqrt{9 + 16} = \\sqrt{25} = 5\\).");
        j.expliquer("<p>La longueur d'un vecteur s'appelle sa <b>norme</b>, notée \\(\\|\\vec{u}\\|\\). C'est Pythagore :</p>\\[ \\|\\vec{u}\\| = \\sqrt{u_x^2 + u_y^2} \\]");
        j.suite();
      } });
    } },
    { nom: "Unitaire", jouer: function (j, n) {
      n.cercle = true; n.dessin();
      j.titre("Raccourcis \\(\\vec{u}\\) sans changer sa direction, jusqu'à ce qu'il mesure exactement 1.");
      j.consigne("On le multiplie par un nombre \\(k\\). Le cercle orange a un rayon de 1.");
      var fini = false;
      var c = j.curseur({ nom: "k", min: 0.05, max: 1.2, pas: 0.01, val: 1, dec: 2, change: function (v) {
        n.k = v; n.dessin();
        if (!fini && Math.abs(v - 0.2) < 0.001) {
          fini = true; c.input.disabled = true;
          j.bravo("\\(k = 0{,}2 = 1/5\\) : on a divisé par la longueur.", n.pl.P([0.6, 0.8]));
          j.expliquer("<p>Diviser un vecteur par sa norme donne un vecteur de longueur 1, dans la même direction : un <b>vecteur unitaire</b>.</p>\\[ \\frac{\\vec{u}}{\\|\\vec{u}\\|} = \\left(\\frac{3}{5} \\,;\\ \\frac{4}{5}\\right) = (0{,}6 \\,;\\ 0{,}8) \\]<p>Les axes d'un repère sont des vecteurs unitaires : ils donnent seulement une direction.</p>");
          j.suite();
        }
      } });
      j.reponse(function () { c.regler(0.2); c.input.dispatchEvent(new Event("input")); });
    } },
    { nom: "En 3D", jouer: function (j, n) {
      n.mode = "espace"; n.cercle = false; n.dessin();
      j.fig.astuce("Glisse un doigt sur la figure pour la tourner.");
      j.titre("Dans l'espace : quelle est la norme de \\(\\vec{V} = (1 \\,;\\ 2 \\,;\\ 2)\\) ?");
      j.consigne("On ajoute simplement le carré de la troisième composante.");
      j.nombre({ avant: "\\|\\vec{V}\\| =", cases: [{ attendu: 3 }], ligne: true,
        aide: function () { return "\\(\\sqrt{1^2 + 2^2 + 2^2} = \\sqrt{1 + 4 + 4}\\)."; },
        ok: function () {
          j.bravo("\\(\\sqrt{9} = 3\\).");
          j.expliquer("\\[ \\|\\vec{V}\\| = \\sqrt{V_x^2 + V_y^2 + V_z^2} \\]<p>On applique Pythagore deux fois : d'abord dans le plan du sol, puis dans le plan vertical qui contient \\(\\vec{V}\\).</p>");
          j.suite();
        } });
    } },
    { nom: "Lequel ?", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Lequel de ces vecteurs est unitaire ?");
      j.consigne("Calcule la somme des carrés : elle doit valoir 1.");
      j.choix([
        { tex: "(1 \\,;\\ 1)", aide: "\\(1^2 + 1^2 = 2\\) : sa norme est \\(\\sqrt{2} \\approx 1{,}41\\)." },
        { tex: "(0{,}5 \\,;\\ 0{,}5)", aide: "\\(0{,}25 + 0{,}25 = 0{,}5\\) : sa norme est environ 0,71." },
        { tex: "(0{,}8 \\,;\\ -0{,}6)", juste: true }
      ], { ok: function () {
        j.bravo("\\(0{,}64 + 0{,}36 = 1\\).");
        j.expliquer("<p>Le signe ne change rien à la longueur : on élève au carré. C'est aussi ce que dit \\(\\cos^2\\theta + \\sin^2\\theta = 1\\) : le vecteur \\((\\cos\\theta \\,;\\ \\sin\\theta)\\) est toujours unitaire.</p>");
        j.suite();
      } });
    } }
  ]
});
