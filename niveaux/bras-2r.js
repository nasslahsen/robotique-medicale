/* Niveau : modèle géométrique direct du bras 2R du cours. l1 = 0,4 m, l2 = 0,3 m. */
NIVEAU({
  id: "bras-2r",
  init: function (fig) {
    var C = D.C, pl = D.plan(fig.svg, [300, 400], 480);
    var n = { t1: 30, t2: 45, l1: 0.4, l2: 0.3, reperes: true, anneau: false, cible: null, trace: [] };
    var b = fig.bande("");
    n.M = function () { var a = n.t1 * D.DEG, c = (n.t1 + n.t2) * D.DEG; return [n.l1 * Math.cos(a) + n.l2 * Math.cos(c), n.l1 * Math.sin(a) + n.l2 * Math.sin(c), 0]; };
    n.dessin = function () {
      pl.vider(); pl.grille({ pas: 0.1, fort: 5 });
      pl.axes({ lx: [-0.55, 0.72], ly: [-0.4, 0.78] });
      [-0.5, -0.4, -0.3, -0.2, -0.1, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6].forEach(function (k) { D.texte(pl.fond, E.fmt(k, 1), pl.P([k, -0.035]), { coul: C.gris, taille: 12, gras: false, mono: true }); });
      if (n.anneau) {
        D.rond(pl.fond, pl.P([0, 0]), (n.l1 + n.l2) * pl.u, { fill: "rgba(59,91,219,.08)", stroke: C.acc, ep: 2, tirets: "6 6" });
        D.rond(pl.fond, pl.P([0, 0]), Math.abs(n.l1 - n.l2) * pl.u, { fill: "#fff", stroke: C.acc, ep: 2, tirets: "6 6" });
        D.texte(pl.fond, "l₁ + l₂ = 0,7", pl.P([0.5, 0.52]), { coul: C.acc, taille: 15 });
      }
      if (n.cible) { var q = pl.P(n.cible); D.rond(pl.fond, q, 20, { fill: "rgba(255,90,31,.12)", stroke: C.jeu, ep: 2.5, tirets: "5 5" }); D.texte(pl.fond, "cible", [q[0] + 26, q[1] - 20], { coul: C.jeu, taille: 16, ancre: "start" }); }
      var a = n.t1 * D.DEG, c = (n.t1 + n.t2) * D.DEG, O2 = [n.l1 * Math.cos(a), n.l1 * Math.sin(a), 0], M = n.M();
      D.ligne(pl.fig, pl.P([0, 0]), pl.P(O2), C.encre, 14);
      D.ligne(pl.fig, pl.P(O2), pl.P(M), C.v, 12);
      pl.arc(pl.fig, [0, 0], 55, 0, n.t1, C.jeu, "θ₁");
      D.ligne(pl.fig, pl.P(O2), pl.P([O2[0] + 0.12 * Math.cos(a), O2[1] + 0.12 * Math.sin(a)]), C.gris, 2, "4 4");
      pl.arc(pl.fig, O2, 45, n.t1, n.t1 + n.t2, C.jeu, "θ₂");
      if (n.reperes) {
        pl.vec(pl.haut, [0, 0], [0.16 * Math.cos(a), 0.16 * Math.sin(a)], C.x, 3, "x₁");
        pl.vec(pl.haut, O2, [O2[0] + 0.14 * Math.cos(c), O2[1] + 0.14 * Math.sin(c)], C.x, 3, "x₂");
      }
      D.rond(pl.haut, pl.P([0, 0]), 10, { fill: "#fff", stroke: C.encre, ep: 3 });
      D.rond(pl.haut, pl.P(O2), 9, { fill: "#fff", stroke: C.encre, ep: 3 });
      D.texte(pl.haut, "O₀ = O₁", [pl.P([0, 0])[0] - 16, pl.P([0, 0])[1] + 26], { taille: 16, ancre: "end" });
      D.texte(pl.haut, "O₂", [pl.P(O2)[0] - 22, pl.P(O2)[1] - 16], { taille: 17 });
      D.rond(pl.haut, pl.P(M), 9, { fill: C.jeu, stroke: "#fff", ep: 3 }); D.texte(pl.haut, "M", [pl.P(M)[0] + 18, pl.P(M)[1] - 14], { coul: C.jeu });
      fig.chip("θ₁ = " + n.t1 + "°   θ₂ = " + n.t2 + "°");
      if (n.bande) E.k(b, n.bande()); else b.innerHTML = "";
    };
    n.pl = pl;
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Les repères", jouer: function (j, n) {
      n.bande = function () { return "l_1 = 0{,}4 \\text{ m} \\qquad l_2 = 0{,}3 \\text{ m}"; }; n.dessin();
      j.fig.astuce("Le bras 2R du cours, vu de dessus : deux pivots d'axes z parallèles.");
      j.titre("\\(R_2\\) a son origine \\(O_2\\) au bout du segment 1. Quelles sont les coordonnées de \\(O_2\\) dans \\(R_1\\) ?");
      j.consigne("L'axe \\(\\vec{x}_1\\) est porté par le segment 1, de longueur \\(l_1\\).");
      j.choix([{ tex: "(l_1\\cos\\theta_1 \\,;\\ l_1\\sin\\theta_1 \\,;\\ 0)", aide: "Ça, ce sont ses coordonnées dans \\(R_0\\). Dans \\(R_1\\), le segment est le long de l'axe x." }, { tex: "(l_1 \\,;\\ 0 \\,;\\ 0)", juste: true }, { tex: "(0 \\,;\\ l_1 \\,;\\ 0)", aide: "Le segment 1 porte l'axe \\(\\vec{x}_1\\), pas \\(\\vec{y}_1\\)." }], { colonnes: 1, ok: function () {
        j.bravo("\\(O_1O_2^1 = (l_1 \\,;\\ 0 \\,;\\ 0)\\) : c'est la 4e colonne de \\(T^{1,2}\\).");
        j.expliquer("\\[ T^{0,1} = \\begin{pmatrix} \\cos\\theta_1 & -\\sin\\theta_1 & 0 & 0 \\\\ \\sin\\theta_1 & \\cos\\theta_1 & 0 & 0 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & 1 \\end{pmatrix} \\]\\[ T^{1,2} = \\begin{pmatrix} \\cos\\theta_2 & -\\sin\\theta_2 & 0 & l_1 \\\\ \\sin\\theta_2 & \\cos\\theta_2 & 0 & 0 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & 1 \\end{pmatrix} \\]<p>\\(R_1\\) a la même origine que \\(R_0\\) (\\(O_0 = O_1\\)) ; \\(R_2\\) a tourné de \\(\\theta_2\\) par rapport à \\(R_1\\).</p>");
        j.suite();
      } });
    } },
    { nom: "Composer", jouer: function (j, n) {
      j.titre("\\(T^{0,2} = T^{0,1}\\,T^{1,2}\\). De quel angle \\(R_2\\) est-il tourné par rapport à \\(R_0\\) ?");
      j.consigne("Deux rotations successives autour d'axes parallèles.");
      j.choix([{ tex: "\\theta_2", aide: "\\(\\theta_2\\) se mesure depuis \\(\\vec{x}_1\\), pas depuis \\(\\vec{x}_0\\)." }, { tex: "\\theta_1\\,\\theta_2", aide: "Les angles de rotations autour d'un même axe s'additionnent." }, { tex: "\\theta_1 + \\theta_2", juste: true }], { ok: function () {
        j.bravo("\\(R_z(\\theta_1)\\,R_z(\\theta_2) = R_z(\\theta_1 + \\theta_2)\\).");
        j.expliquer("<p>Avec \\(c_{12} = \\cos(\\theta_1 + \\theta_2)\\) et \\(s_{12} = \\sin(\\theta_1 + \\theta_2)\\) (formules d'addition) :</p>\\[ T^{0,2} = \\begin{pmatrix} c_{12} & -s_{12} & 0 & l_1 c_1 \\\\ s_{12} & c_{12} & 0 & l_1 s_1 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & 1 \\end{pmatrix} \\]");
        j.suite();
      } });
    } },
    { nom: "Le modèle", jouer: function (j, n) {
      j.titre("M est à \\(l_2\\) sur \\(\\vec{x}_2\\). Complète l'abscisse de M.");
      j.consigne("Chasles : \\(\\overrightarrow{O_0M} = \\overrightarrow{O_0O_2} + \\overrightarrow{O_2M}\\), le premier dans la direction \\(\\theta_1\\), le second dans la direction \\(\\theta_1 + \\theta_2\\).");
      var z = j.zone("", '<div style="display:flex;align-items:center;gap:8px;font-size:21px;flex-wrap:wrap">\\(x_M = l_1\\)<span class="trou" data-attendu="a" style="min-width:110px"></span>\\(+\\ l_2\\)<span class="trou" data-attendu="b" style="min-width:150px"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "b", tex: "\\cos(\\theta_1 + \\theta_2)" }, { id: "x", tex: "\\cos\\theta_2" }, { id: "a", tex: "\\cos\\theta_1" }],
        aide: "Le segment 2 est orienté de \\(\\theta_1 + \\theta_2\\) par rapport à \\(\\vec{x}_0\\), pas de \\(\\theta_2\\).",
        ok: function () {
          j.bravo("Modèle géométrique direct du bras 2R.");
          j.expliquer("\\[ x_M = l_1\\cos\\theta_1 + l_2\\cos(\\theta_1 + \\theta_2) \\]\\[ y_M = l_1\\sin\\theta_1 + l_2\\sin(\\theta_1 + \\theta_2) \\]<p>On l'obtient aussi en une ligne : \\(\\begin{pmatrix} O_0M^0 \\\\ 1 \\end{pmatrix} = T^{0,2}\\,(l_2 \\,;\\ 0 \\,;\\ 0 \\,;\\ 1)\\). L'orientation de l'organe terminal est \\(\\theta_1 + \\theta_2\\).</p>");
          j.suite();
        }
      });
    } },
    { nom: "L'exemple", jouer: function (j, n) {
      n.bande = function () { return "l_1 = 0{,}4 \\qquad l_2 = 0{,}3 \\qquad \\theta_1 = 30° \\qquad \\theta_2 = 45°"; }; n.dessin();
      j.titre("Calcule la position de M pour l'exemple, en mètres (3 décimales).");
      j.nombre({ avant: "(x_M \\,;\\ y_M) =", cases: [{ attendu: 0.424, tol: 0.002 }, { attendu: 0.49, tol: 0.002 }],
        aide: function (k) { return k === 0 ? "\\(0{,}4 \\times 0{,}866 + 0{,}3 \\times \\cos 75°\\), avec \\(\\cos 75° \\approx 0{,}259\\)." : "\\(0{,}4 \\times 0{,}5 + 0{,}3 \\times \\sin 75°\\), avec \\(\\sin 75° \\approx 0{,}966\\)."; },
        ok: function () {
          j.bravo("\\((0{,}424 \\,;\\ 0{,}490)\\) m.", n.pl.P(n.M()));
          j.expliquer("\\[ x_M = 0{,}346 + 0{,}078 = 0{,}424 \\]\\[ y_M = 0{,}200 + 0{,}290 = 0{,}490 \\]<p>Vérification : \\(O_0M = \\sqrt{0{,}424^2 + 0{,}490^2} \\approx 0{,}648\\) m.</p>");
          j.suite();
        } });
    } },
    { nom: "Espace de travail", jouer: function (j, n) {
      n.anneau = true; n.dessin();
      j.fig.astuce("En bleu : tous les points que M peut atteindre.");
      j.titre("Le bras peut-il atteindre un point situé à 0,05 m de \\(O_0\\) ?");
      j.consigne("Replie le bras dans ta tête : \\(\\theta_2 = 180°\\).");
      j.choix([{ html: "Oui", aide: "Bras replié, M est à \\(|l_1 - l_2| = 0{,}1\\) m de \\(O_0\\) : il ne peut pas aller plus près." }, { html: "Non", juste: true }], { ok: function () {
        j.bravo("Non : la distance minimale est \\(|l_1 - l_2| = 0{,}1\\) m.");
        j.expliquer("<p>L'espace de travail est un anneau entre \\(|l_1 - l_2| = 0{,}1\\) m (bras replié) et \\(l_1 + l_2 = 0{,}7\\) m (bras tendu), si les deux pivots tournent librement.</p>");
        j.suite();
      } });
    } },
    { nom: "Atteindre", jouer: function (j, n) {
      n.anneau = false; n.cible = [0.05, 0.606];
      n.bande = function () { var M = n.M(); return "x_M = " + E.tn(M[0], 3) + " \\qquad y_M = " + E.tn(M[1], 3); }; n.dessin();
      j.fig.astuce("");
      j.titre("Règle \\(\\theta_1\\) et \\(\\theta_2\\) pour que M touche la cible \\((0{,}05 \\,;\\ 0{,}606)\\).");
      var fini = false, c1, c2;
      function maj() {
        n.t1 = c1.v; n.t2 = c2.v; n.dessin();
        var M = n.M();
        if (!fini && Math.hypot(M[0] - 0.05, M[1] - 0.606) < 0.012) {
          fini = true; c1.input.disabled = true; c2.input.disabled = true;
          j.bravo("Atteint avec θ₁ = " + n.t1 + "° et θ₂ = " + n.t2 + "°.", n.pl.P([0.05, 0.606]));
          j.expliquer("<p>Le modèle direct donne M à partir des angles. Chercher les angles à partir de M, c'est le modèle <b>inverse</b> : souvent plusieurs solutions (coude en haut, coude en bas), parfois aucune.</p>");
          j.suite();
        }
      }
      c1 = j.curseur({ nom: "θ₁", min: -180, max: 180, pas: 5, val: 30, unite: "°", change: maj });
      c2 = j.curseur({ nom: "θ₂", min: -180, max: 180, pas: 5, val: 45, unite: "°", change: maj });
    } }
  ]
});
