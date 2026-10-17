/* Niveau : produit scalaire, perpendicularité, angle, exercice des deux repères du cours. */
NIVEAU({
  id: "produit-scalaire",
  init: function (fig) {
    var C = D.C, pl = D.plan(fig.svg, [300, 380], 180);
    var n = { mode: "angle", ta: 70, tb: 0, la: 1.4, lb: 1.1, libre: true, alpha: 30, surAngle: null };
    var b = fig.bande("");
    n.dessin = function () {
      pl.vider(); pl.grille({ pas: 0.25, fort: 4 });
      if (n.mode === "angle") {
        var a = [n.la * Math.cos(n.ta * D.DEG), n.la * Math.sin(n.ta * D.DEG), 0], bb = [n.lb, 0, 0];
        // projection de a sur b
        var proj = n.la * Math.cos(n.ta * D.DEG);
        D.ligne(pl.fig, pl.P(a), pl.P([proj, 0]), C.gris, 2, "5 6");
        D.ligne(pl.fig, pl.P([0, 0]), pl.P([proj, 0]), C.jeu, 10);
        D.texte(pl.fig, "projection de a", pl.P([proj / 2, -0.16]), { coul: C.jeu, taille: 16 });
        pl.arc(pl.fig, [0, 0], 0.32 * pl.u, 0, n.ta, C.encre, "θ");
        pl.vec(pl.fig, [0, 0], bb, C.acc, 5, "b");
        pl.vec(pl.fig, [0, 0], a, C.v, 5, "a");
        if (n.libre) D.poignee(pl.haut, pl.P(a), C.v);
        var ps = n.la * n.lb * Math.cos(n.ta * D.DEG);
        fig.chip("θ = " + Math.round(n.ta) + "°");
        E.k(b, "\\vec{a} \\cdot \\vec{b} = \\|\\vec{a}\\|\\,\\|\\vec{b}\\|\\cos\\theta = " + E.tn(n.la, 1) + " \\times " + E.tn(n.lb, 1) + " \\times " + E.tn(Math.cos(n.ta * D.DEG), 3) + " = " + E.tn(ps, 3));
      } else if (n.mode === "reperes") {
        var al = n.alpha * D.DEG, x1 = [1, 0], y1 = [0, 1], x2 = [Math.cos(al), Math.sin(al)], y2 = [-Math.sin(al), Math.cos(al)];
        pl.vec(pl.fig, [0, 0], x1, C.x, 4.5, "x₁", { decal: [8, 18] }); pl.vec(pl.fig, [0, 0], y1, C.y, 4.5, "y₁", { decal: [-16, 0] });
        pl.vec(pl.fig, [0, 0], x2, "#b8323a", 4.5, "x₂"); pl.vec(pl.fig, [0, 0], y2, "#0b7a50", 4.5, "y₂");
        pl.arc(pl.fig, [0, 0], 0.35 * pl.u, 0, n.alpha, C.acc, "α");
        pl.arc(pl.fig, [0, 0], 0.5 * pl.u, 90, 90 + n.alpha, C.acc, "α");
        pl.origine(pl.fig, "z₁ = z₂");
        fig.chip("α = " + n.alpha + "°"); b.innerHTML = "";
        E.k(b, "\\text{vecteurs unitaires : } \\vec{u} \\cdot \\vec{v} = \\cos(\\text{angle entre eux})");
      }
    };
    D.glisser(fig.svg, {
      debut: function () { return n.mode === "angle" && n.libre; },
      bouge: function (p) { if (!n.libre || n.mode !== "angle") return; var a = Math.round(Math.atan2(pl.O[1] - p[1], p[0] - pl.O[0]) / D.DEG); n.ta = Math.max(0, Math.min(180, a < -90 ? 180 : a)); n.dessin(); if (n.surAngle) n.surAngle(n.ta); },
      fin: function () { if (n.surRelache) n.surRelache(n.ta); }
    });
    n.pl = pl;
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Annuler", jouer: function (j, n) {
      j.fig.astuce("Fais tourner le vecteur violet a.");
      j.titre("Tourne \\(\\vec{a}\\) pour que le produit scalaire \\(\\vec{a} \\cdot \\vec{b}\\) devienne nul.");
      j.consigne("Le produit scalaire, c'est la longueur de b fois la projection de a sur b (en orange).");
      var fini = false;
      function gagne() {
        if (fini) return; fini = true; n.libre = false; n.ta = 90; n.dessin();
        j.bravo("θ = 90° : les vecteurs sont perpendiculaires.", n.pl.P([0, 1.4]));
        j.expliquer("<p>Le produit scalaire de deux vecteurs est un <b>nombre</b> :</p>\\[ \\vec{a} \\cdot \\vec{b} = \\|\\vec{a}\\|\\,\\|\\vec{b}\\|\\cos\\theta \\]<p>Il est nul quand les vecteurs sont perpendiculaires, positif quand ils vont dans le même sens, négatif sinon. Essaie de dépasser 90° pour voir le signe changer.</p>");
        j.suite();
      }
      n.surAngle = function (a) { if (a === 90) gagne(); };
      n.surRelache = function (a) { if (Math.abs(a - 90) <= 3) gagne(); };
    } },
    { nom: "Calculer", jouer: function (j, n) {
      n.libre = true; n.surAngle = null; n.surRelache = null;
      j.fig.astuce("");
      j.titre("Un instrument suit \\(\\vec{a} = (1 \\,;\\ 0 \\,;\\ 1)\\), l'axe d'un os suit \\(\\vec{b} = (0 \\,;\\ 0 \\,;\\ 1)\\). Calcule \\(\\vec{a} \\cdot \\vec{b}\\).");
      j.consigne("Formule algébrique : on multiplie composante par composante et on additionne.");
      j.nombre({ avant: "\\vec{a} \\cdot \\vec{b} =", cases: [{ attendu: 1, tol: 0 }], ligne: true,
        aide: function () { return "\\(1 \\times 0 + 0 \\times 0 + 1 \\times 1\\)."; },
        ok: function () {
          j.bravo("\\(1 \\times 0 + 0 \\times 0 + 1 \\times 1 = 1\\).");
          var q = j.zone("", "<h2 style='margin-top:14px'>Quel angle entre l'instrument et l'os ?</h2><p class='consigne'>\\(\\|\\vec{a}\\| = \\sqrt{2}\\) et \\(\\|\\vec{b}\\| = 1\\), donc \\(\\cos\\theta = 1/\\sqrt{2}\\).</p>"); j.rendre(q);
          j.choix([{ html: "30°", aide: "\\(\\cos 30° \\approx 0{,}866\\), et \\(1/\\sqrt{2} \\approx 0{,}707\\)." }, { html: "45°", juste: true }, { html: "60°", aide: "\\(\\cos 60° = 0{,}5\\), et \\(1/\\sqrt{2} \\approx 0{,}707\\)." }], { ok: function () {
            n.ta = 45; n.la = 1.41; n.lb = 1; n.libre = false; n.dessin();
            j.bravo("\\(\\cos\\theta \\approx 0{,}707\\), donc \\(\\theta = 45°\\).");
            j.expliquer("\\[ \\vec{a} \\cdot \\vec{b} = a_x b_x + a_y b_y + a_z b_z \\qquad \\cos\\theta = \\frac{\\vec{a} \\cdot \\vec{b}}{\\|\\vec{a}\\|\\,\\|\\vec{b}\\|} \\]<p>Deux écritures du même nombre : l'une se calcule, l'autre donne l'angle.</p>");
            j.suite();
          } });
        } });
    } },
    { nom: "Deux repères", jouer: function (j, n) {
      n.mode = "reperes"; n.dessin();
      j.fig.astuce("R₂ est tourné de α par rapport à R₁, autour de z₁ = z₂ (vers toi).");
      j.titre("L'exercice des deux repères du cours. Range chaque produit dans la bonne case.");
      j.consigne("Tous les vecteurs sont unitaires : chaque produit vaut le cosinus de l'angle entre les deux axes. Lis cet angle sur la figure.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto auto;gap:10px 14px;align-items:center;font-size:20px">' +
        [["0", "0"], ["1", "\\cos\\alpha"], ["2", "\\sin\\alpha"], ["3", "-\\sin\\alpha"]].map(function (c) { return '<span class="trou" data-attendu="' + c[0] + '" style="min-width:110px"></span><span>\\(= ' + c[1] + "\\)</span>"; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "2", tex: "\\vec{y}_1 \\cdot \\vec{x}_2" }, { id: "0", tex: "\\vec{x}_1 \\cdot \\vec{y}_1" }, { id: "3", tex: "\\vec{x}_1 \\cdot \\vec{y}_2" }, { id: "1", tex: "\\vec{x}_1 \\cdot \\vec{x}_2" }],
        aide: "Perpendiculaires : 0. Même type d'axe, écartés de α : \\(\\cos\\alpha\\). Croisés : \\(\\cos(90° - \\alpha) = \\sin\\alpha\\) ou \\(\\cos(90° + \\alpha) = -\\sin\\alpha\\).",
        ok: function () {
          j.bravo("Corrigé du cours retrouvé.");
          j.expliquer("<p>\\(\\vec{y}_1\\) et \\(\\vec{x}_2\\) sont séparés de \\(90° - \\alpha\\), d'où \\(\\sin\\alpha\\) ; \\(\\vec{x}_1\\) et \\(\\vec{y}_2\\) de \\(90° + \\alpha\\), d'où \\(-\\sin\\alpha\\). Ces deux signes opposés sont l'origine du \\(-\\sin\\alpha\\) de toutes les matrices de rotation.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Avec α = 30°", jouer: function (j, n) {
      j.titre("Avec \\(\\alpha = 30°\\), donne \\(\\vec{x}_1 \\cdot \\vec{x}_2\\), \\(\\vec{y}_1 \\cdot \\vec{x}_2\\) et \\(\\vec{x}_1 \\cdot \\vec{y}_2\\).");
      j.consigne("Trois décimales au plus.");
      j.nombre({ avant: "\\begin{gathered}\\vec{x}_1 \\cdot \\vec{x}_2 \\\\ \\vec{y}_1 \\cdot \\vec{x}_2 \\\\ \\vec{x}_1 \\cdot \\vec{y}_2\\end{gathered} \\;=", cases: [{ attendu: 0.866, tol: 0.002 }, { attendu: 0.5, tol: 0.002 }, { attendu: -0.5, tol: 0.002 }],
        aide: function (k) { return ["\\(\\cos 30°\\).", "\\(\\sin 30°\\).", "\\(-\\sin 30°\\) : n'oublie pas le signe."][k]; },
        ok: function () {
          j.bravo("\\(0{,}866\\), \\(0{,}5\\) et \\(-0{,}5\\).");
          j.expliquer("<p>Ces nombres reviendront tels quels : ce sont des cases de la matrice de rotation \\(R_z(30°)\\).</p>");
          j.suite();
        } });
    } }
  ]
});
