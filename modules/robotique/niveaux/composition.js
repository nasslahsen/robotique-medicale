/* Niveau : composition des transformations, ordre, indices en dominos, chaîne à trois segments. */
NIVEAU({
  id: "composition",
  init: function (fig) {
    var C = D.C, pl = D.plan(fig.svg, [250, 430], 150);
    var n = { mode: "ordre", repere: { o: [0, 0], a: 0 }, fantome: null, th: [30, 30, 30], L: [1, 0.8, 0.5], cible: [0.4, 1.7] };
    var b = fig.bande("");
    function repere(g, o, a, coul, nom, op) {
      var x = [Math.cos(a * D.DEG), Math.sin(a * D.DEG)], y = [-x[1], x[0]];
      pl.vec(g, o, [o[0] + 0.8 * x[0], o[1] + 0.8 * x[1]], coul ? coul : C.x, 5, "x" + (nom || ""), { op: op });
      pl.vec(g, o, [o[0] + 0.8 * y[0], o[1] + 0.8 * y[1]], coul ? coul : C.y, 5, "y" + (nom || ""), { op: op });
      D.rond(g, pl.P(o), 6, { fill: coul || C.encre, op: op });
    }
    n.dessin = function () {
      pl.vider(); pl.grille({ pas: 0.5, fort: 2 });
      if (n.mode === "ordre") {
        pl.axes({ lx: [-1.4, 2.4], ly: [-0.8, 2.4] });
        pl.origine(pl.fig, "O₀");
        if (n.fantome) repere(pl.fig, n.fantome.o, n.fantome.a, "#b8bfcc", "", 0.6);
        repere(pl.haut, n.repere.o, n.repere.a, null, "₁");
        if (n.chemin) pl.vec(pl.fig, [0, 0], n.repere.o, C.jeu, 3, null, { tirets: "6 6" });
      } else {
        pl.axes({ lx: [-1.4, 2.4], ly: [-0.8, 2.4] });
        var q = pl.P(n.cible);
        D.rond(pl.fond, q, 24, { fill: PLATEFORME.teinte(.12), stroke: C.jeu, ep: 2.5, tirets: "5 5" }); D.texte(pl.fond, "cible", [q[0] + 30, q[1] - 22], { coul: C.jeu, taille: 17, ancre: "start" });
        var p = [0, 0], cum = 0, cl = [C.encre, C.v, C.acc];
        for (var i = 0; i < 3; i++) {
          cum += n.th[i]; var r = [p[0] + n.L[i] * Math.cos(cum * D.DEG), p[1] + n.L[i] * Math.sin(cum * D.DEG)];
          D.ligne(pl.fig, pl.P(p), pl.P(r), cl[i], 12);
          D.rond(pl.fig, pl.P(p), 9, { fill: "#fff", stroke: C.encre, ep: 3 });
          p = r;
        }
        n.bout = p;
        D.rond(pl.haut, pl.P(p), 9, { fill: C.jeu, stroke: "#fff", ep: 3 });
      }
      if (n.bande) E.k(b, n.bande()); else b.innerHTML = "";
    };
    n.anime = function (etapes, fin) {
      // etapes : liste de { o, a } successifs
      var k = 0;
      function suivante() {
        if (k >= etapes.length) { if (fin) fin(); return; }
        var de = { o: n.repere.o.slice(), a: n.repere.a }, vers = etapes[k++];
        E.anime(800, function (e) { n.repere = { o: [de.o[0] + (vers.o[0] - de.o[0]) * e, de.o[1] + (vers.o[1] - de.o[1]) * e], a: de.a + (vers.a - de.a) * e }; n.dessin(); }, suivante);
      }
      suivante();
    };
    n.pl = pl;
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Tourner puis avancer", jouer: function (j, n) {
      n.bande = function () { return "\\text{Rot}(z, 90°) \\cdot \\text{Trans}(x, 1)"; }; n.dessin();
      j.fig.astuce("Le repère R₁ part de R₀.");
      j.titre("On tourne de 90° autour de z, <i>puis</i> on avance de 1 le long du nouvel axe x. Où arrive l'origine ?");
      j.choix([{ tex: "(1 \\,;\\ 0)", aide: "Après la rotation, le nouvel axe x pointe selon \\(\\vec{y}_0\\) : on avance vers le haut." }, { tex: "(0 \\,;\\ 1)", juste: true }, { tex: "(1 \\,;\\ 1)", aide: "On ne se déplace qu'une fois, de 1, le long du nouvel axe x." }], { ok: function () {
        n.chemin = true;
        n.anime([{ o: [0, 0], a: 90 }, { o: [0, 1], a: 90 }], function () {
          n.bande = function () { return "\\text{Rot}\\cdot\\text{Trans} = \\begin{pmatrix} 0 & -1 & 0 & 0 \\\\ 1 & 0 & 0 & 1 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & 1 \\end{pmatrix}"; }; n.dessin();
          j.bravo("L'origine est en \\((0 \\,;\\ 1 \\,;\\ 0)\\).", n.pl.P([0, 1]));
          j.suite();
        });
      } });
    } },
    { nom: "Avancer puis tourner", jouer: function (j, n) {
      n.fantome = { o: [0, 1], a: 90 }; n.repere = { o: [0, 0], a: 0 }; n.chemin = true;
      n.bande = function () { return "\\text{Trans}(x, 1) \\cdot \\text{Rot}(z, 90°)"; }; n.dessin();
      j.fig.astuce("En gris : le résultat de l'étape précédente.");
      j.titre("Dans l'autre ordre : on avance de 1 le long de x, <i>puis</i> on tourne de 90°. Où arrive l'origine ?");
      j.choix([{ tex: "(1 \\,;\\ 0)", juste: true }, { tex: "(0 \\,;\\ 1)", aide: "Ça, c'était l'autre ordre. Ici on avance d'abord, le long de \\(\\vec{x}_0\\)." }], { ok: function () {
        n.anime([{ o: [1, 0], a: 0 }, { o: [1, 0], a: 90 }], function () {
          n.bande = function () { return "\\text{Trans}\\cdot\\text{Rot} = \\begin{pmatrix} 0 & -1 & 0 & 1 \\\\ 1 & 0 & 0 & 0 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & 1 \\end{pmatrix}"; }; n.dessin();
          j.bravo("\\((1 \\,;\\ 0 \\,;\\ 0)\\) : même orientation finale, position différente.", n.pl.P([1, 0]));
          j.expliquer("<p>Le produit de matrices n'est pas commutatif. Par blocs :</p>\\[ T^{0,1}\\,T^{1,2} = \\begin{pmatrix} R^{0,1}R^{1,2} & R^{0,1}P^{1,2} + P^{0,1} \\\\ 0 & 1 \\end{pmatrix} \\]<p>La position du repère 2 est d'abord tournée par \\(R^{0,1}\\) avant d'être ajoutée : c'est ce qui s'est passé à l'étape précédente.</p>");
          j.suite();
        });
      } });
    } },
    { nom: "Dominos", jouer: function (j, n) {
      n.fantome = null; n.chemin = false; n.repere = { o: [0, 0], a: 0 }; n.bande = null; n.dessin();
      j.fig.astuce("");
      j.titre("Une chaîne de solides \\(S_0, S_1, S_2, S_3\\). Range les matrices pour obtenir \\(T^{0,3}\\).");
      j.consigne("Les indices intérieurs doivent s'enchaîner comme des dominos.");
      var z = j.zone("", '<div style="display:flex;align-items:center;gap:8px;font-size:21px;flex-wrap:wrap">\\(T^{0,3} =\\)' + ["01", "12", "23"].map(function (k) { return '<span class="trou" data-attendu="' + k + '" style="min-width:90px"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "23", tex: "T^{2,3}" }, { id: "01", tex: "T^{0,1}" }, { id: "12", tex: "T^{1,2}" }],
        aide: "On part de la base : \\(T^{0,1}\\) d'abord, puis chaque matrice commence par l'indice où la précédente s'arrête.",
        ok: function () {
          j.bravo("\\(T^{0,\\mathbf{1}}\\,T^{\\mathbf{1},\\mathbf{2}}\\,T^{\\mathbf{2},3} = T^{0,3}\\).");
          j.expliquer("\\[ T^{0,n} = T^{0,1}\\,T^{1,2} \\cdots T^{n-1,n} \\]<p>Il ne reste que les indices extérieurs. Un produit comme \\(T^{0,1}\\,T^{2,3}\\) n'a pas de sens physique. Cette relation donne l'organe terminal par rapport à la base fixe.</p>");
          j.suite();
        }
      });
    } },
    { nom: "La chaîne", jouer: function (j, n) {
      n.mode = "chaine"; n.th = [30, 30, 30];
      n.bande = function () { return "T^{0,3} = T^{0,1}\\,T^{1,2}\\,T^{2,3} \\qquad \\text{bout : } (" + E.tn(n.bout ? n.bout[0] : 0, 2) + "\\,;\\ " + E.tn(n.bout ? n.bout[1] : 0, 2) + ")"; };
      n.dessin(); n.dessin();
      j.fig.astuce("Trois pivots en série : chaque angle se compte depuis le segment précédent.");
      j.titre("Amène le bout de la chaîne sur la cible.");
      j.consigne("Il y a plusieurs solutions : trouves-en une.");
      var fini = false, cs = [];
      function maj() {
        n.th = cs.map(function (c) { return c.v; }); n.dessin();
        if (!fini && Math.hypot(n.bout[0] - n.cible[0], n.bout[1] - n.cible[1]) < 0.07) {
          fini = true; cs.forEach(function (c) { c.input.disabled = true; });
          j.bravo("Cible atteinte avec θ = (" + n.th.join("° ; ") + "°).", n.pl.P(n.cible));
          j.expliquer("<p>Chaque pivot ajoute une matrice à la chaîne. Changer \\(\\theta_1\\) fait tourner tout ce qui suit : c'est le \\(R^{0,1}\\) qui multiplie les positions des segments suivants. Trois angles pour deux coordonnées : plusieurs postures atteignent la même cible (redondance).</p>");
          j.suite();
        }
      }
      ["θ₁", "θ₂", "θ₃"].forEach(function (nm, i) { cs.push(j.curseur({ nom: nm, min: -150, max: 150, pas: 5, val: 30, unite: "°", change: maj })); });
    } }
  ]
});
