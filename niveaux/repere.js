/* Niveau : repère, coordonnées cartésiennes, main droite, distance. Robot cartésien PPP en 3D. */
NIVEAU({
  id: "repere",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var sc = D.scene(fig.svg, { centre: [330, 380], ech: 95, az: 30, el: 24 });
    var n = { q: [0.5, 0.5, 0.5], cible: null, mode: "robot", points: null, indirect: false, montreZ: true, choixRepere: false };
    var b = fig.bande("");
    n.dessin = function () {
      E.vider(g);
      var l = sc.nouvelle(), I = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
      if (n.mode === "robot") {
        sc.sol(l, 3.4);
        sc.repere(l, [0, 0, 0], I, 3, ["x", "y", "z"], { pale: true, ep: 3 });
        var q = n.q;
        // portique : deux montants, une poutre selon y, un chariot, une colonne verticale
        sc.segment(l, [q[0], -0.4, 0], [q[0], -0.4, 2.6], "#9aa0ad", 5); sc.segment(l, [q[0], 3.2, 0], [q[0], 3.2, 2.6], "#9aa0ad", 5);
        sc.segment(l, [q[0], -0.4, 2.6], [q[0], 3.2, 2.6], "#9aa0ad", 6);
        sc.segment(l, [q[0], q[1], 2.6], [q[0], q[1], q[2]], "#5e3a99", 7);
        sc.pave(l, I, [q[0], q[1], 2.6], [0, 0, 0], [0.16, 0.16, 0.1], "#d8c8f0");
        // projections du point
        sc.segment(l, [q[0], q[1], q[2]], [q[0], q[1], 0], C.gris, 2, "5 5");
        sc.segment(l, [q[0], q[1], 0], [q[0], 0, 0], C.x, 2, "5 5"); sc.segment(l, [q[0], q[1], 0], [0, q[1], 0], C.y, 2, "5 5");
        if (n.cible) { sc.point(l, n.cible, 11, "rgba(255,90,31,.35)"); sc.segment(l, n.cible, [n.cible[0], n.cible[1], 0], C.jeu, 2, "3 6"); sc.texte(l, "cible", [n.cible[0], n.cible[1], n.cible[2] + 0.35], { coul: C.jeu, taille: 17 }); }
        sc.point(l, q, 9, C.jeu, "P");
        sc.dessiner(g, l);
        E.k(b, "P = (x \\,;\\ y \\,;\\ z) = (" + E.tn(q[0], 1) + "\\,;\\ " + E.tn(q[1], 1) + "\\,;\\ " + E.tn(q[2], 1) + ") \\qquad q_1 = x,\\ q_2 = y,\\ q_3 = z");
      } else if (n.mode === "mains") {
        // deux repères côte à côte : A direct, B indirect (ou l'inverse selon n.ordre)
        [[-1.6, n.ordre ? -1 : 1, "A"], [1.6, n.ordre ? 1 : -1, "B"]].forEach(function (r) {
          var o = [0, r[0], 0];
          sc.fleche(l, o, [1.3, r[0], 0], C.x, 4, "x"); sc.fleche(l, o, [0, r[0] + 1.3, 0], C.y, 4, "y");
          sc.fleche(l, o, [0, r[0], 1.3 * r[1]], C.z, 4, "z");
          sc.texte(l, "repère " + r[2], [0, r[0], -0.8], { coul: C.encre, taille: 20 });
        });
        sc.dessiner(g, l); b.innerHTML = "";
      } else if (n.mode === "points") {
        sc.sol(l, 3.4);
        sc.repere(l, [0, 0, 0], I, 3, ["x", "y", "z"], { pale: true, ep: 3 });
        var P1 = n.points[0], P2 = n.points[1];
        // dessin centré sur la zone utile : on décale de (9 ; 18 ; 4) mm et on met à l'échelle
        var a = P1.map(function (x, i) { return (x - [9, 18, 4][i]) * 0.45; }), c = P2.map(function (x, i) { return (x - [9, 18, 4][i]) * 0.45; });
        sc.segment(l, a, [c[0], a[1], a[2]], C.x, 4); sc.segment(l, [c[0], a[1], a[2]], [c[0], c[1], a[2]], C.y, 4);
        sc.segment(l, a, c, C.v, 5);
        sc.point(l, a, 9, C.acc, "P₁"); sc.point(l, c, 9, C.jeu, "P₂");
        sc.texte(l, "+3", [(a[0] + c[0]) / 2, a[1] - 0.25, a[2]], { coul: C.x, taille: 18 }); sc.texte(l, "+4", [c[0] + 0.25, (a[1] + c[1]) / 2, a[2]], { coul: C.y, taille: 18 });
        sc.dessiner(g, l);
        E.k(b, "P_1 = (10 \\,;\\ 20 \\,;\\ 5) \\qquad P_2 = (13 \\,;\\ 24 \\,;\\ 5) \\quad \\text{(mm)}");
      }
    };
    sc.orbite(function () { n.dessin(); }, function () { return true; });
    n.sc = sc;
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Placer", jouer: function (j, n) {
      n.cible = [1, 2, 1.5]; n.dessin();
      j.fig.astuce("Glisse un doigt sur la figure pour la tourner.");
      j.titre("Le robot cartésien doit amener sa pointe sur la cible \\(P = (1 \\,;\\ 2 \\,;\\ 1{,}5)\\).");
      j.consigne("Chaque glissière fait avancer la pointe le long d'un seul axe.");
      var fini = false, cs = [];
      function maj() {
        n.q = cs.map(function (c) { return c.v; }); n.dessin();
        if (!fini && Math.abs(n.q[0] - 1) < 1e-9 && Math.abs(n.q[1] - 2) < 1e-9 && Math.abs(n.q[2] - 1.5) < 1e-9) {
          fini = true; cs.forEach(function (c) { c.input.disabled = true; });
          j.bravo("Pointe sur la cible.");
          j.expliquer("<p>Un <b>repère</b> \\(R = \\{O, \\vec{x}, \\vec{y}, \\vec{z}\\}\\), c'est une origine et trois vecteurs unitaires perpendiculaires. Les coordonnées d'un point sont les projections de \\(\\overrightarrow{OP}\\) sur les trois axes :</p>\\[ \\overrightarrow{OP} = x\\,\\vec{x} + y\\,\\vec{y} + z\\,\\vec{z} \\qquad [\\overrightarrow{OP}]_R = \\begin{bmatrix} x \\\\ y \\\\ z \\end{bmatrix} \\]<p>Pour ce robot à trois glissières (PPP), les variables articulaires sont directement les coordonnées : \\(x = q_1\\), \\(y = q_2\\), \\(z = q_3\\).</p>");
          j.suite();
        }
      }
      cs.push(j.curseur({ nom: "q₁ = x", min: 0, max: 3, pas: 0.1, val: 0.5, dec: 1, change: maj }));
      cs.push(j.curseur({ nom: "q₂ = y", min: 0, max: 3, pas: 0.1, val: 0.5, dec: 1, change: maj }));
      cs.push(j.curseur({ nom: "q₃ = z", min: 0, max: 2.5, pas: 0.1, val: 0.5, dec: 1, change: maj }));
    } },
    { nom: "Main droite", jouer: function (j, n) {
      n.mode = "mains"; n.ordre = false; n.dessin();
      j.titre("Un seul de ces deux repères est <i>direct</i>. Lequel ?");
      j.consigne("Règle de la main droite : doigts selon \\(\\vec{x}\\), replie-les vers \\(\\vec{y}\\) ; le pouce donne \\(\\vec{z}\\). Tourne la figure si besoin.");
      j.choix([
        { html: "Le repère A", juste: true },
        { html: "Le repère B", aide: "Dans B, \\(\\vec{z}\\) pointe vers le bas alors que \\(\\vec{x}\\) et \\(\\vec{y}\\) sont placés comme dans A : c'est la main gauche." }
      ], { ok: function () {
        j.bravo("A est direct : \\(\\vec{z}\\) vers le haut.");
        j.expliquer("<p>Les trois axes forment une base orthonormée <b>directe</b> : l'ordre \\(\\vec{x} \\to \\vec{y}\\) fixe le sens de \\(\\vec{z}\\).</p>\\[ \\vec{z} = \\vec{x} \\times \\vec{y} \\]<p>Retourner \\(\\vec{z}\\) donne un repère indirect (main gauche). Tous les repères du cours sont directs.</p>");
        j.suite();
      } });
    } },
    { nom: "Distance", jouer: function (j, n) {
      n.mode = "points"; n.points = [[10, 20, 5], [13, 24, 5]]; n.dessin();
      j.titre("La pointe d'une aiguille est en \\(P_1\\), la cible en \\(P_2\\). Quelle distance les sépare ?");
      j.consigne("Les deux points sont exprimés dans le même repère patient, en millimètres.");
      j.nombre({ avant: "d(P_1, P_2) =", apres: "\\text{mm}", cases: [{ attendu: 5, tol: 0.01 }], ligne: true,
        aide: function () { return "Différences : \\(13 - 10 = 3\\), \\(24 - 20 = 4\\), \\(5 - 5 = 0\\). Puis Pythagore."; },
        ok: function () {
          j.bravo("\\(\\sqrt{3^2 + 4^2 + 0^2} = 5\\) mm.");
          j.expliquer("\\[ d(P_1, P_2) = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2} \\]<p>C'est la norme du vecteur \\(\\overrightarrow{P_1P_2}\\). Les deux points doivent être exprimés dans le même repère.</p>");
          j.suite();
        } });
    } },
    { nom: "Glissières", jouer: function (j, n) {
      j.titre("Un robot cartésien porte l'aiguille. De combien doit bouger chaque glissière pour aller de \\(P_1\\) à \\(P_2\\) ?");
      j.consigne("Variations de \\(q_1\\), \\(q_2\\), \\(q_3\\), en millimètres (avec leur signe).");
      j.nombre({ avant: "(\\Delta q_1 \\,;\\ \\Delta q_2 \\,;\\ \\Delta q_3) =", cases: [{ attendu: 3, tol: 0 }, { attendu: 4, tol: 0 }, { attendu: 0, tol: 0 }],
        aide: function (k) { return "Chaque glissière suit un axe : \\(\\Delta q_" + (k + 1) + "\\) est la différence des coordonnées " + ["x", "y", "z"][k] + "."; },
        ok: function () {
          j.bravo("+3 mm, +4 mm, et la verticale ne bouge pas.");
          j.expliquer("<p>Avec un robot cartésien, déplacer l'outil revient à faire varier chaque coordonnée indépendamment. C'est simple, mais les coordonnées seules ne disent rien de l'orientation de l'aiguille : il faudra un repère attaché à l'outil.</p>");
          j.suite();
        } });
    } }
  ]
});
