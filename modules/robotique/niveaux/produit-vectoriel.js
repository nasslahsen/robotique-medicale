/* Niveau : produit vectoriel, main droite, aire du parallélogramme, calcul, deux repères. */
NIVEAU({
  id: "produit-vectoriel",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var sc = D.scene(fig.svg, { centre: [330, 380], ech: 120, az: 35, el: 26 });
    var n = { mode: "axes", montreW: false, theta: 60, U: null, V: null, inverse: false };
    var b = fig.bande("");
    n.dessin = function () {
      E.vider(g);
      var l = sc.nouvelle(), I = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
      sc.sol(l, 2.6);
      if (n.mode === "axes") {
        sc.fleche(l, [0, 0, 0], [1.6, 0, 0], C.x, 5, "x"); sc.fleche(l, [0, 0, 0], [0, 1.6, 0], C.y, 5, "y");
        if (n.montreW) sc.fleche(l, [0, 0, 0], [0, 0, 1.6], C.z, 5, "x ∧ y = z");
        sc.dessiner(g, l); b.innerHTML = "";
      } else if (n.mode === "aire") {
        var t = n.theta * D.DEG, u = [1.6, 0, 0], v = [1.3 * Math.cos(t), 1.3 * Math.sin(t), 0], w = 1.6 * 1.3 * Math.sin(t);
        sc.polygone(l, [[0, 0, 0], u, [u[0] + v[0], v[1], 0], v], "rgba(59,91,219,.18)", "rgba(59,91,219,.5)");
        sc.fleche(l, [0, 0, 0], u, C.x, 5, "u"); sc.fleche(l, [0, 0, 0], v, C.y, 5, "v");
        if (Math.abs(w) > 0.02) sc.fleche(l, [0, 0, 0], [0, 0, (n.inverse ? -1 : 1) * w * 0.6], C.v, 6, n.inverse ? "v ∧ u" : "u ∧ v");
        sc.dessiner(g, l);
        E.k(b, "\\|\\vec{u} \\wedge \\vec{v}\\| = \\|\\vec{u}\\|\\,\\|\\vec{v}\\|\\sin\\theta = 1{,}6 \\times 1{,}3 \\times " + E.tn(Math.sin(t), 3) + " = " + E.tn(w, 3) + " \\quad \\text{(aire bleue)}");
        fig.chip("θ = " + n.theta + "°");
      } else if (n.mode === "calcul") {
        sc.repere(l, [0, 0, 0], I, 2.2, ["x", "y", "z"], { pale: true, ep: 3 });
        var k = 0.32;
        sc.fleche(l, [0, 0, 0], n.U.map(function (x) { return x * k; }), C.acc, 5, "u");
        sc.fleche(l, [0, 0, 0], n.V.map(function (x) { return x * k; }), C.jeu, 5, "v");
        if (n.montreW) sc.fleche(l, [0, 0, 0], [6 * k * 0.5, -3 * k * 0.5, 1 * k * 0.5], C.v, 6, "w (÷2)");
        sc.dessiner(g, l);
        E.k(b, "\\vec{u} = (1 \\,;\\ 2 \\,;\\ 0) \\qquad \\vec{v} = (0 \\,;\\ 1 \\,;\\ 3)");
        fig.chip(null);
      } else if (n.mode === "reperes") {
        var al = 30 * D.DEG;
        sc.fleche(l, [0, 0, 0], [1.4, 0, 0], C.x, 4, "x₁"); sc.fleche(l, [0, 0, 0], [0, 1.4, 0], C.y, 4, "y₁");
        sc.fleche(l, [0, 0, 0], [1.4 * Math.cos(al), 1.4 * Math.sin(al), 0], "#b8323a", 4, "x₂"); sc.fleche(l, [0, 0, 0], [-1.4 * Math.sin(al), 1.4 * Math.cos(al), 0], "#0b7a50", 4, "y₂");
        sc.fleche(l, [0, 0, 0], [0, 0, 1.4], C.z, 4, "z₁ = z₂");
        sc.dessiner(g, l);
        E.k(b, "R_2 \\text{ tourné de } \\alpha \\text{ autour de } \\vec{z}_1 = \\vec{z}_2");
        fig.chip("α = 30°");
      }
    };
    sc.orbite(function () { n.dessin(); }, function () { return true; });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Main droite", jouer: function (j, n) {
      j.fig.astuce("Glisse un doigt sur la figure pour la tourner.");
      j.titre("Le produit vectoriel \\(\\vec{x} \\wedge \\vec{y}\\) est perpendiculaire aux deux. Dans quel sens pointe-t-il ?");
      j.consigne("Main droite : doigts selon \\(\\vec{x}\\), replie-les vers \\(\\vec{y}\\) ; le pouce donne le résultat.");
      j.choix([
        { html: "Vers le haut", juste: true },
        { html: "Vers le bas", aide: "Ça, ce serait \\(\\vec{y} \\wedge \\vec{x}\\) : l'ordre compte." },
        { html: "Dans le plan du sol", aide: "Le résultat est perpendiculaire à \\(\\vec{x}\\) et à \\(\\vec{y}\\), donc il sort du plan du sol." }
      ], { ok: function () {
        n.montreW = true; n.dessin();
        j.bravo("\\(\\vec{x} \\wedge \\vec{y} = \\vec{z}\\).");
        j.expliquer("<p>Le produit vectoriel de deux vecteurs est un <b>vecteur</b> perpendiculaire aux deux, orienté par la main droite. Dans l'ordre cyclique \\(x \\to y \\to z \\to x\\) :</p>\\[ \\vec{x} \\wedge \\vec{y} = \\vec{z} \\qquad \\vec{y} \\wedge \\vec{z} = \\vec{x} \\qquad \\vec{z} \\wedge \\vec{x} = \\vec{y} \\]\\[ \\vec{y} \\wedge \\vec{x} = -\\vec{z} \\quad \\text{(ordre inverse : signe moins)} \\]<p>Le module de rappel écrit \\(\\wedge\\), le chapitre 2 écrit la même opération \\(\\times\\).</p>");
        j.suite();
      } });
    } },
    { nom: "Aire", jouer: function (j, n) {
      n.mode = "aire"; n.theta = 30; n.dessin();
      j.titre("Ouvre l'angle entre \\(\\vec{u}\\) et \\(\\vec{v}\\) pour rendre \\(\\vec{u} \\wedge \\vec{v}\\) le plus long possible.");
      j.consigne("Sa longueur est l'aire du parallélogramme bleu.");
      var fini = false;
      var c = j.curseur({ nom: "θ", min: 0, max: 180, pas: 5, val: 30, unite: "°", change: function (v) {
        n.theta = v; n.dessin();
        if (!fini && v === 90) {
          fini = true; c.input.disabled = true;
          j.bravo("Maximum à 90° : \\(\\sin 90° = 1\\).");
          j.expliquer("\\[ \\|\\vec{u} \\wedge \\vec{v}\\| = \\|\\vec{u}\\|\\,\\|\\vec{v}\\|\\sin\\theta \\]<p>Il est nul quand les vecteurs sont parallèles (θ = 0° ou 180°) : \\(\\vec{u} \\wedge \\vec{v} = \\vec{0}\\). Et inverser l'ordre inverse le sens : \\(\\vec{v} \\wedge \\vec{u} = -(\\vec{u} \\wedge \\vec{v})\\).</p>");
          var inv = E.h("button", "btn clair", "Inverser l'ordre", j.el); inv.type = "button"; inv.style.marginRight = "12px";
          inv.addEventListener("click", function () { n.inverse = !n.inverse; n.dessin(); });
          j.suite();
        }
      } });
    } },
    { nom: "Calculer", jouer: function (j, n) {
      n.mode = "calcul"; n.inverse = false; n.U = [1, 2, 0]; n.V = [0, 1, 3]; n.montreW = false; n.dessin();
      j.titre("Calcule \\(\\vec{w} = \\vec{u} \\wedge \\vec{v}\\).");
      j.texte("\\[ \\vec{u} \\wedge \\vec{v} = \\begin{pmatrix} u_y v_z - u_z v_y \\\\ u_z v_x - u_x v_z \\\\ u_x v_y - u_y v_x \\end{pmatrix} \\]");
      j.nombre({ avant: "\\vec{w} =", cases: [{ attendu: 6, tol: 0 }, { attendu: -3, tol: 0 }, { attendu: 1, tol: 0 }],
        aide: function (k) { return ["\\(2 \\times 3 - 0 \\times 1\\).", "\\(0 \\times 0 - 1 \\times 3\\).", "\\(1 \\times 1 - 2 \\times 0\\)."][k]; },
        ok: function () {
          n.montreW = true; n.dessin();
          j.bravo("\\(\\vec{w} = (6 \\,;\\ -3 \\,;\\ 1)\\).");
          j.expliquer("<p>Vérification avec le produit scalaire : \\(\\vec{w} \\cdot \\vec{u} = 6 - 6 + 0 = 0\\) et \\(\\vec{w} \\cdot \\vec{v} = 0 - 3 + 3 = 0\\). \\(\\vec{w}\\) est bien perpendiculaire aux deux.</p>");
          j.suite();
        } });
    } },
    { nom: "Deux repères", jouer: function (j, n) {
      n.mode = "reperes"; n.dessin();
      j.titre("Dans l'exercice des deux repères, que vaut \\(\\vec{x}_1 \\wedge \\vec{x}_2\\) ?");
      j.consigne("Le résultat est perpendiculaire au sol ; sa longueur est le sinus de l'angle orienté du premier vers le second.");
      j.choix([
        { tex: "\\cos\\alpha\\ \\vec{z}_1", aide: "La longueur d'un produit vectoriel fait intervenir le sinus de l'angle, pas le cosinus." },
        { tex: "\\sin\\alpha\\ \\vec{z}_1", juste: true },
        { tex: "-\\sin\\alpha\\ \\vec{z}_1", aide: "De \\(\\vec{x}_1\\) vers \\(\\vec{x}_2\\), on tourne dans le sens positif : le résultat va vers \\(+\\vec{z}_1\\)." }
      ], { ok: function () {
        j.bravo("Corrigé du cours : \\(\\vec{x}_1 \\wedge \\vec{x}_2 = \\sin\\alpha\\ \\vec{z}_1\\).");
        j.expliquer("<p>Et dans l'autre ordre, \\(\\vec{x}_2 \\wedge \\vec{x}_1 = -\\sin\\alpha\\ \\vec{z}_1\\). Les autres produits du corrigé se trouvent de la même façon, par exemple \\(\\vec{z}_2 \\wedge \\vec{x}_1 = \\vec{y}_1\\) (ordre cyclique, car \\(\\vec{z}_2 = \\vec{z}_1\\)).</p>");
        j.suite();
      } });
    } }
  ]
});
