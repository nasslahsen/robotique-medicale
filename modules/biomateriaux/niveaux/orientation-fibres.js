/* Niveau : coefficient d'orientation Ko = Σ an (cos θn)⁴ et ECL = Ko Ef φf + Em φm. */
NIVEAU({
  id: "orientation-fibres",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { theta: 20, libre: true, plis: [{ a: 1, theta: 20 }] };
    function carre(cx, cy, s, angles, titre) {
      E.s("rect", { x: cx - s / 2, y: cy - s / 2, width: s, height: s, rx: 8, fill: "#f6efe0", stroke: C.encre, "stroke-width": 2 }, g);
      var clip = "c" + Math.round(cx) + "_" + Math.round(cy);
      var defs = E.s("defs", null, g), cp = E.s("clipPath", { id: clip }, defs);
      E.s("rect", { x: cx - s / 2 + 3, y: cy - s / 2 + 3, width: s - 6, height: s - 6 }, cp);
      var gg = E.s("g", { "clip-path": "url(#" + clip + ")" }, g);
      angles.forEach(function (t) {
        var a = t * D.DEG, u = [Math.cos(a), -Math.sin(a)], v = [-u[1], u[0]];
        for (var k = -9; k <= 9; k++) {
          var c = [cx + v[0] * k * s / 13, cy + v[1] * k * s / 13];
          E.s("line", { x1: c[0] - u[0] * s, y1: c[1] - u[1] * s, x2: c[0] + u[0] * s, y2: c[1] + u[1] * s, stroke: C.jeu, "stroke-width": 3 }, gg);
        }
      });
      if (titre) D.texte(g, titre, [cx, cy + s / 2 + 24], { taille: 17 });
    }
    n.dessin = function () {
      E.vider(g);
      // charge horizontale
      D.fleche(g, [60, 145], [190, 145], "#3b5bdb", 7); D.texte(g, "direction de la charge", [204, 145], { taille: 19, coul: "#3b5bdb", ancre: "start" });
      var angs = n.plis.map(function (p) { return p.theta; });
      carre(230, 355, 340, angs, null);
      var Ko = BIO.coefOrientation(n.plis);
      D.texte(g, "Ko = " + E.fmt(Ko, 3), [530, 300], { taille: 28, mono: true });
      // détail des plis
      n.plis.forEach(function (p, i) {
        D.texte(g, Math.round(p.a * 100) + " % à " + Math.round(p.theta) + "°", [530, 350 + i * 32], { taille: 19, coul: C.doux });
      });
      fig.chip(null);
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Tourner un pli", jouer: function (j, n) {
      j.fig.astuce("Toutes les fibres font le même angle θ avec la charge : Ko = cos⁴θ.");
      j.titre("Tourne les fibres pour que Ko vaille 0,25.");
      var c = j.curseur({ nom: "θ", min: 0, max: 90, pas: 5, val: 20, unite: "°", change: function (v) {
        if (!n.libre) { c.regler(45); return; }
        n.plis = [{ a: 1, theta: v }]; n.dessin(); if (v === 45) gagne();
      } });
      function gagne() {
        n.libre = false; n.plis = [{ a: 1, theta: 45 }]; n.dessin();
        j.bravo("θ = 45° : cos⁴ 45° = 0,5² = 0,25.");
        j.expliquer("<p>Quand les fibres ne sont pas toutes alignées avec la charge, on corrige la loi des mélanges : \\(E_{CL} = K_o E_f \\phi_f + E_m \\phi_m\\), avec le <b>coefficient d'orientation</b> \\(K_o = \\sum a_n (\\cos\\theta_n)^4\\), où \\(a_n\\) est la part des fibres à l'angle \\(\\theta_n\\). Un pli ±45° vaut donc 0,25.</p>");
        j.suite();
      }
      j.reponse(function () { c.regler(45); gagne(); });
    } },
    { nom: "Un tissu croisé", jouer: function (j, n) {
      n.libre = true; n.plis = [{ a: 0.5, theta: 0 }, { a: 0.5, theta: 90 }]; n.dessin();
      j.fig.astuce("");
      j.titre("Moitié des fibres à 0°, moitié à 90°. Calcule Ko.");
      j.nombre({ avant: "K_o =", cases: [{ attendu: 0.5, tol: 0.001 }], ligne: true,
        aide: function () { return "0,5 × cos⁴ 0° + 0,5 × cos⁴ 90°, avec cos 0° = 1 et cos 90° = 0."; },
        ok: function () { j.bravo("0,5 × 1 + 0,5 × 0 = 0,5 : la valeur du cours."); j.suite(); } });
    } },
    { nom: "Quatre directions", jouer: function (j, n) {
      n.plis = [{ a: 0.25, theta: 0 }, { a: 0.25, theta: 90 }, { a: 0.25, theta: 45 }, { a: 0.25, theta: -45 }]; n.dessin();
      j.titre("Un quart des fibres à 0°, 90°, +45° et −45°. Calcule Ko.");
      j.nombre({ avant: "K_o =", cases: [{ attendu: 0.375, tol: 0.001 }], ligne: true,
        aide: function () { return "0,25 × (1 + 0 + 0,25 + 0,25)."; },
        ok: function () {
          j.bravo("0,25 × 1,5 = 0,375.");
          j.expliquer("<p>La diapo donne aussi 0,375 pour une orientation aléatoire dans le plan de la feuille : le même renfort dans toutes les directions du plan, comme ce stratifié à quatre directions.</p>");
          j.suite();
        } });
    } },
    { nom: "Le module corrigé", jouer: function (j, n) {
      j.fig.astuce("Verre et résine de l'exemple du cours : Ef = 70 GPa, Em = 3 GPa, φf = 0,4.");
      j.titre("Avec Ko = 0,375, que vaut ECL ?");
      j.nombre({ avant: "E_{CL} =", apres: "\\text{GPa}", cases: [{ attendu: 12.3, tol: 0.05 }], ligne: true,
        aide: function () { return "ECL = Ko Ef φf + Em φm = 0,375 × 70 × 0,4 + 3 × 0,6."; },
        ok: function () { j.bravo("10,5 + 1,8 = 12,3 GPa, contre 29,8 GPa si tout était aligné."); j.suite(); } });
    } },
    { nom: "Choisir l'orientation", jouer: function (j, n) {
      n.plis = [{ a: 1, theta: 0 }]; n.dessin();
      j.titre("Un implant n'est sollicité que dans une seule direction. Quelle orientation donne le plus grand module dans cette direction ?");
      j.choix([
        { html: "Toutes les fibres dans la direction de la charge", juste: true },
        { html: "Orientation aléatoire dans le plan", aide: "Ko = 0,375 seulement : une bonne partie des fibres ne travaille pas dans la direction utile." },
        { html: "Toutes les fibres à 90°", aide: "Ko = 0 : seule la matrice porte la charge." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Ko = 1. L'aléatoire et le croisé servent quand la charge vient de plusieurs directions.");
        j.suite();
      } });
    } }
  ]
});
