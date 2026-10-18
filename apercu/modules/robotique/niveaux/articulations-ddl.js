/* Niveau : articulations, degrés de liberté, configuration articulaire q et opérationnelle X. */
NIVEAU({
  id: "articulations-ddl",
  init: function (fig) {
    var C = D.C, pl = D.plan(fig.svg, [200, 430], 170);
    var n = { types: ["R", "R", "R"], q: [40, 30, -40], L: [0.9, 0.7, 0.4] };
    var b = fig.bande("");
    n.dessin = function () {
      pl.vider(); pl.grille({ pas: 0.25, fort: 4 });
      E.s("rect", { x: pl.P([0, 0])[0] - 40, y: pl.P([0, 0])[1] + 10, width: 80, height: 26, rx: 6, fill: "#9aa0ad" }, pl.fond);
      var p = [0, 0], a = 0, cl = ["#ff8a5c", "#8b3fd9", "#3b5bdb", "#12a26b"];
      for (var i = 0; i < n.types.length; i++) {
        var long = n.L[i] || 0.4, q;
        if (n.types[i] === "R") { a += n.q[i]; q = [p[0] + long * Math.cos(a * D.DEG), p[1] + long * Math.sin(a * D.DEG)]; }
        else { var d = long * (0.6 + 0.4 * n.q[i] / 60); q = [p[0] + d * Math.cos(a * D.DEG), p[1] + d * Math.sin(a * D.DEG)]; }
        D.ligne(pl.fig, pl.P(p), pl.P(q), cl[i % 4], 16);
        if (n.types[i] === "R") D.rond(pl.haut, pl.P(p), 13, { fill: "#fff", stroke: C.encre, ep: 3.5 });
        else { var P0 = pl.P(p); E.s("rect", { x: P0[0] - 14, y: P0[1] - 14, width: 28, height: 28, fill: "#fff", stroke: C.encre, "stroke-width": 3.5, transform: "rotate(" + (-a) + " " + P0[0] + " " + P0[1] + ")" }, pl.haut); }
        D.texte(pl.haut, "q" + "₁₂₃₄₅"[i], [pl.P(p)[0] - 26, pl.P(p)[1] - 20], { taille: 17, coul: cl[i % 4] });
        p = q;
      }
      var e = pl.P(p);
      D.rond(pl.haut, e, 10, { fill: C.jeu, stroke: "#fff", ep: 3 });
      var qs = n.types.map(function (t, i) { return t === "R" ? "\\theta_" + (i + 1) : "d_" + (i + 1); });
      E.k(b, "q = [\\," + qs.join(",\\ ") + "\\,]^T \\qquad X = [\\,x,\\ y,\\ \\varphi\\,]^T = [\\," + E.tn(p[0], 2) + ",\\ " + E.tn(p[1], 2) + ",\\ " + Math.round(a) + "°\\,]^T");
    };
    n.pl = pl;
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Compter", jouer: function (j, n) {
      j.fig.astuce("Un bras plan à trois pivots. Bouge les curseurs.");
      j.titre("Combien ce bras a-t-il de degrés de liberté articulaires ?");
      j.consigne("Un degré de liberté, c'est un mouvement indépendant.");
      var cs = [0, 1, 2].map(function (i) { return j.curseur({ nom: "θ" + "₁₂₃"[i], min: -120, max: 120, pas: 5, val: n.q[i], unite: "°", change: function (v) { n.q[i] = v; n.dessin(); } }); });
      j.nombre({ avant: "\\text{DDL articulaires} =", cases: [{ attendu: 3, tol: 0 }], ligne: true, aide: function () { return "Chaque articulation active apporte un mouvement indépendant."; },
        ok: function () {
          j.bravo("3 articulations actives, 3 DDL.");
          j.expliquer("<p>Articulation active → mouvement indépendant → 1 DDL. La <b>configuration articulaire</b> rassemble les variables :</p>\\[ q = [\\,q_1,\\ q_2,\\ \\dots,\\ q_n\\,]^T \\]<p>avec \\(q_i = \\theta_i\\) pour une rotoïde, \\(q_i = d_i\\) pour une prismatique.</p>");
          j.suite();
        } });
    } },
    { nom: "Configurations", jouer: function (j, n) {
      n.types = ["R", "P", "R"]; n.q = [50, 30, -50]; n.dessin();
      j.fig.astuce("Un robot R-P-R : pivot, glissière, pivot.");
      j.titre("Écris la configuration articulaire \\(q\\) de ce robot R-P-R.");
      var z = j.zone("", '<div style="display:flex;align-items:center;gap:8px;font-size:21px">\\(q = [\\)<span class="trou" data-attendu="1"></span>,<span class="trou" data-attendu="2"></span>,<span class="trou" data-attendu="3"></span>\\(]^T\\)</div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "2", tex: "d_2" }, { id: "x", tex: "\\theta_2" }, { id: "3", tex: "\\theta_3" }, { id: "1", tex: "\\theta_1" }, { id: "y", tex: "d_1" }],
        aide: "Un pivot a pour variable un angle \\(\\theta\\), une glissière une distance \\(d\\). L'indice est le numéro de l'articulation.",
        ok: function () {
          j.bravo("\\(q = [\\,\\theta_1,\\ d_2,\\ \\theta_3\\,]^T\\).");
          j.expliquer("<p>Sous la figure, la <b>configuration opérationnelle</b> \\(X\\) décrit l'effecteur lui-même (position et orientation par rapport à la base). Passer de \\(q\\) à \\(X\\), c'est le modèle géométrique direct, \\(p = f(q)\\), fait à la fin du parcours pour le bras 2R.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Effecteur", jouer: function (j, n) {
      n.types = ["R", "R", "R", "R"]; n.L = [0.8, 0.6, 0.5, 0.3]; n.q = [40, 20, -30, -20]; n.dessin();
      j.fig.astuce("Quatre pivots, mais dans un plan.");
      j.titre("Ce bras plan a 4 pivots. Combien de degrés de liberté a son effecteur ?");
      j.consigne("Dans le plan, l'effecteur a au plus 2 DDL de position (x, y) et 1 d'orientation.");
      j.choix([{ html: "4", aide: "Dans le plan, l'outil ne peut pas faire plus de 3 mouvements indépendants : x, y et son angle." }, { html: "3", juste: true }, { html: "2", aide: "Avec 4 pivots, l'outil peut aussi changer d'orientation, pas seulement de position." }], { ok: function () {
        j.bravo("3 DDL d'effecteur, et 1 DDL de redondance.");
        j.expliquer("<p>Dans l'espace, l'effecteur a au plus \\(6 = 3\\) de position + 3 d'orientation. Un bras à 7 axes (exemple du cours) a donc 6 DDL d'effecteur et 1 de <b>redondance</b> : il peut bouger le coude sans bouger la pince, utile pour contourner un obstacle ou le patient.</p>");
        j.suite();
      } });
    } }
  ]
});
