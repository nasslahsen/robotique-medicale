/* Boss final : modèle direct, orientation, atteindre une cible, accessibilité, matrice homogène. */
NIVEAU({
  id: "boss-transformations",
  init: function (fig) {
    var C = D.C, pl = D.plan(fig.svg, [300, 400], 400);
    var n = { t1: 0, t2: 0, l1: 0.5, l2: 0.5, cible: null, anneau: false };
    var b = fig.bande("");
    n.M = function () { var a = n.t1 * D.DEG, c = (n.t1 + n.t2) * D.DEG; return [n.l1 * Math.cos(a) + n.l2 * Math.cos(c), n.l1 * Math.sin(a) + n.l2 * Math.sin(c), 0]; };
    n.dessin = function () {
      pl.vider(); pl.grille({ pas: 0.1, fort: 5 });
      pl.axes({ lx: [-0.7, 0.8], ly: [-0.5, 0.95] });
      if (n.anneau) {
        D.rond(pl.fond, pl.P([0, 0]), (n.l1 + n.l2) * pl.u, { fill: "rgba(59,91,219,.08)", stroke: C.acc, ep: 2, tirets: "6 6" });
        if (Math.abs(n.l1 - n.l2) > 1e-6) D.rond(pl.fond, pl.P([0, 0]), Math.abs(n.l1 - n.l2) * pl.u, { fill: "#fff", stroke: C.acc, ep: 2, tirets: "6 6" });
      }
      if (n.cible) { var q = pl.P(n.cible); D.rond(pl.fond, q, 20, { fill: PLATEFORME.teinte(.12), stroke: C.jeu, ep: 2.5, tirets: "5 5" }); D.texte(pl.fond, "cible", [q[0] + 26, q[1] - 20], { coul: C.jeu, taille: 16, ancre: "start" }); }
      var a = n.t1 * D.DEG, c = (n.t1 + n.t2) * D.DEG, O2 = [n.l1 * Math.cos(a), n.l1 * Math.sin(a), 0], M = n.M();
      D.ligne(pl.fig, pl.P([0, 0]), pl.P(O2), C.encre, 14); D.ligne(pl.fig, pl.P(O2), pl.P(M), C.v, 12);
      pl.vec(pl.haut, M, [M[0] + 0.15 * Math.cos(c), M[1] + 0.15 * Math.sin(c)], C.x, 3, "x₂");
      D.rond(pl.haut, pl.P([0, 0]), 10, { fill: "#fff", stroke: C.encre, ep: 3 }); D.rond(pl.haut, pl.P(O2), 9, { fill: "#fff", stroke: C.encre, ep: 3 });
      D.rond(pl.haut, pl.P(M), 9, { fill: C.jeu, stroke: "#fff", ep: 3 });
      fig.chip("θ₁ = " + n.t1 + "°   θ₂ = " + n.t2 + "°");
      if (n.bande) E.k(b, n.bande()); else b.innerHTML = "";
    };
    n.pl = pl;
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Modèle direct", jouer: function (j, n) {
      n.t1 = 90; n.t2 = -90; n.bande = function () { return "l_1 = l_2 = 0{,}5 \\text{ m} \\qquad \\theta_1 = 90° \\qquad \\theta_2 = -90°"; }; n.dessin();
      j.titre("Où est l'organe terminal M ?");
      j.nombre({ avant: "(x_M \\,;\\ y_M) =", cases: [{ attendu: 0.5, tol: 0.002 }, { attendu: 0.5, tol: 0.002 }],
        aide: function () { return "\\(\\theta_1 + \\theta_2 = 0°\\) : le second segment est horizontal."; },
        ok: function () { j.bravo("\\((0{,}5 \\,;\\ 0{,}5)\\) m.", n.pl.P([0.5, 0.5])); j.suite(); } });
    } },
    { nom: "Orientation", jouer: function (j, n) {
      j.titre("Dans cette posture, comment est orienté \\(\\vec{x}_2\\), l'axe de l'outil ?");
      j.choix([{ tex: "\\vec{x}_2 = \\vec{x}_0", juste: true }, { tex: "\\vec{x}_2 = \\vec{y}_0", aide: "L'orientation est \\(\\theta_1 + \\theta_2\\), pas \\(\\theta_1\\)." }, { tex: "\\vec{x}_2 = -\\vec{x}_0", aide: "\\(\\theta_1 + \\theta_2 = 0°\\), pas 180°." }], { ok: function () {
        j.bravo("\\(\\theta_1 + \\theta_2 = 0\\) : l'outil est parallèle à \\(\\vec{x}_0\\)."); j.suite();
      } });
    } },
    { nom: "Atteindre", jouer: function (j, n) {
      n.l1 = 0.4; n.l2 = 0.3; n.t1 = 0; n.t2 = 0; n.cible = [0.36, 0.573];
      n.bande = function () { var M = n.M(); return "l_1 = 0{,}4 \\qquad l_2 = 0{,}3 \\qquad M = (" + E.tn(M[0], 3) + "\\,;\\ " + E.tn(M[1], 3) + ")"; }; n.dessin();
      j.titre("Le bras du cours (0,4 m et 0,3 m). Atteins la cible \\((0{,}360 \\,;\\ 0{,}573)\\).");
      var fini = false, c1, c2;
      function maj() {
        n.t1 = c1.v; n.t2 = c2.v; n.dessin();
        var M = n.M();
        if (!fini && Math.hypot(M[0] - 0.36, M[1] - 0.573) < 0.012) { fini = true; c1.input.disabled = true; c2.input.disabled = true; j.bravo("Cible atteinte.", n.pl.P(n.cible)); j.suite(); }
      }
      c1 = j.curseur({ nom: "θ₁", min: -180, max: 180, pas: 5, val: 0, unite: "°", change: maj });
      c2 = j.curseur({ nom: "θ₂", min: -180, max: 180, pas: 5, val: 0, unite: "°", change: maj });
      j.reponse(function () { c1.regler(45); c2.regler(30); maj(); });
    } },
    { nom: "Accessible ?", jouer: function (j, n) {
      n.cible = [0.8 * Math.cos(50 * D.DEG), 0.8 * Math.sin(50 * D.DEG)]; n.anneau = false;
      n.bande = function () { return "\\text{cible à } 0{,}8 \\text{ m de } O_0"; }; n.dessin();
      j.titre("Une nouvelle cible est à 0,8 m de la base. Le même bras peut-il l'atteindre ?");
      j.choix([{ html: "Oui, en tendant le bras", aide: "Bras tendu, M est à \\(l_1 + l_2 = 0{,}7\\) m : c'est le maximum." }, { html: "Non", juste: true }], { ok: function () {
        n.anneau = true; n.t2 = 0; n.t1 = 50; n.dessin();
        j.bravo("Non : 0,8 m dépasse \\(l_1 + l_2 = 0{,}7\\) m."); j.suite();
      } });
    } },
    { nom: "Matrice", jouer: function (j, n) {
      n.cible = null; n.anneau = false; n.t1 = 30; n.t2 = 45;
      n.bande = function () { return "\\theta_1 = 30° \\qquad \\theta_2 = 45° \\qquad T^{0,2} = \\begin{pmatrix} c_{12} & -s_{12} & 0 & l_1 c_1 \\\\ s_{12} & c_{12} & 0 & l_1 s_1 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & 1 \\end{pmatrix}"; }; n.dessin();
      j.titre("Pour l'exemple du cours, donne la 4e colonne de \\(T^{0,2}\\) (position de \\(O_2\\)).");
      j.nombre({ avant: "\\text{colonne 4} =", cases: [{ attendu: 0.346, tol: 0.002 }, { attendu: 0.2, tol: 0.002 }, { attendu: 0, tol: 0 }, { attendu: 1, tol: 0 }],
        aide: function (k) { return ["\\(l_1\\cos\\theta_1 = 0{,}4 \\times 0{,}866\\).", "\\(l_1\\sin\\theta_1 = 0{,}4 \\times 0{,}5\\).", "Le bras est plan : pas de hauteur.", "Toujours 1 en bas."][k]; },
        ok: function () {
          j.bravo("\\((0{,}346 \\,;\\ 0{,}200 \\,;\\ 0 \\,;\\ 1)\\).");
          j.expliquer("<p>Boss final vaincu. De l'angle et du cosinus du chapitre 0 jusqu'au modèle géométrique direct : tout le chemin du cours est fait.</p>");
          j.suite();
        } });
    } }
  ]
});
