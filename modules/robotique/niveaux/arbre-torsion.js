/* Niveau : arbre plein en torsion. Ce qui se déforme, où la contrainte est maximale, d > ∛(16 M_t / (π R_pg)). */
NIVEAU({
  id: "arbre-torsion",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { tors: 0, tau: false, choisi: null, surTouche: null };
    var X0 = 120, X1 = 560, YC = 180, R = 72, SC = [340, 445], RS = 105;
    n.SC = SC; n.RS = RS;
    n.dessin = function () {
      E.vider(g);
      // encastrement à gauche
      E.s("rect", { x: X0 - 46, y: YC - R - 40, width: 46, height: 2 * R + 80, fill: MECA.hachures(g, "#5b6172", { fond: "#fff" }), stroke: C.encre, "stroke-width": 2 }, g);
      // cylindre : contour, puis lignes longitudinales vues (moitié avant) qui se vrillent avec la torsion
      E.s("rect", { x: X0, y: YC - R, width: X1 - X0, height: 2 * R, fill: "#e8edf5", stroke: C.encre, "stroke-width": 2.5 }, g);
      E.s("ellipse", { cx: X1, cy: YC, rx: 18, ry: R, fill: "#dfe3ea", stroke: C.encre, "stroke-width": 2.5 }, g);
      var tw = n.tors * 1.6; // rotation de l'extrémité libre (rad)
      for (var k = 0; k < 12; k++) {
        var phi0 = k * Math.PI / 6, l = [];
        for (var i = 0; i <= 40; i++) {
          var x = X0 + (X1 - X0) * i / 40, phi = phi0 + tw * i / 40;
          if (Math.sin(phi) < -0.02) { if (l.length > 1) E.s("polyline", { points: l.join(" "), fill: "none", stroke: "#3b5bdb", "stroke-width": 2.5 }, g); l = []; continue; }
          l.push(x.toFixed(1) + "," + (YC - R * Math.cos(phi)).toFixed(1));
        }
        if (l.length > 1) E.s("polyline", { points: l.join(" "), fill: "none", stroke: "#3b5bdb", "stroke-width": 2.5 }, g);
      }
      // cercles : restent circulaires (ellipses vues de biais)
      for (var c = 1; c < 6; c++) E.s("ellipse", { cx: X0 + (X1 - X0) * c / 6, cy: YC, rx: 14, ry: R, fill: "none", stroke: C.encre, "stroke-width": 1.6, "stroke-dasharray": "0" }, g);
      // moment de torsion
      if (n.tors > 0.05) {
        var ep = 3 + 6 * n.tors;
        E.s("path", { d: "M" + (X1 + 34) + " " + (YC + R + 10) + " A 30 " + (R + 14) + " 0 1 1 " + (X1 + 34) + " " + (YC - R - 10), fill: "none", stroke: C.jeu, "stroke-width": ep, "stroke-linecap": "round" }, g);
        E.s("polygon", { points: [[X1 + 30, YC - R - 24], [X1 + 54, YC - R - 10], [X1 + 30, YC - R + 4]].map(function (p) { return p.join(","); }).join(" "), fill: C.jeu }, g);
        D.texte(g, "Mt", [X1 + 84, YC - R - 22], { coul: C.jeu, taille: 22 });
      }
      // section droite de l'arbre
      D.texte(g, "section de l'arbre", [SC[0], SC[1] - RS - 26], { taille: 16, coul: C.doux, gras: false });
      E.s("circle", { cx: SC[0], cy: SC[1], r: RS, fill: "#f3f5fa", stroke: C.encre, "stroke-width": 2.5 }, g);
      for (var r2 = 0; r2 < 8; r2++) { var a = r2 * Math.PI / 4 + n.tors * 0.25; D.ligne(g, SC, [SC[0] + RS * Math.cos(a), SC[1] - RS * Math.sin(a)], "#9aa0ad", 2); }
      D.rond(g, SC, 5, { fill: C.encre });
      if (n.tau) {
        // contrainte tangentielle : nulle au centre, maximale à la surface
        [1, -1].forEach(function (sg) {
          var bout = [SC[0] + sg * RS, SC[1] - sg * 70];
          E.s("polygon", { points: [SC, [SC[0] + sg * RS, SC[1]], bout].map(function (p) { return p.join(","); }).join(" "), fill: PLATEFORME.teinte(0.12) }, g);
          D.ligne(g, SC, bout, C.jeu, 2, "6 4");
          [0.25, 0.5, 0.75, 1].forEach(function (f) {
            var p = [SC[0] + sg * RS * f, SC[1]];
            D.fleche(g, p, [p[0], p[1] - sg * 70 * f], C.jeu, 3.5);
          });
        });
        D.texte(g, "τmax", [SC[0] + RS + 44, SC[1] - 76], { coul: C.jeu, taille: 22 });
      }
      if (n.choisi) {
        var rr = { centre: 0, milieu: RS * 0.5, surface: RS }[n.choisi];
        if (rr === 0) D.rond(g, SC, 22, { fill: "none", stroke: n.choisi === "surface" ? C.ok : C.ko, ep: 4 });
        else E.s("circle", { cx: SC[0], cy: SC[1], r: rr, fill: "none", stroke: n.choisi === "surface" ? C.ok : C.ko, "stroke-width": 5 }, g);
      }
    };
    D.glisser(fig.svg, {
      debut: function (p) {
        if (!n.surTouche) return false;
        var d = Math.hypot(p[0] - SC[0], p[1] - SC[1]);
        if (d > RS + 30) return false;
        n.surTouche(d < RS * 0.28 ? "centre" : d < RS * 0.78 ? "milieu" : "surface");
        return false;
      }
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Tordre", jouer: function (j, n) {
      j.fig.astuce("Un bout est encastré, on tord l'autre.");
      j.titre("L'arbre de sortie d'un réducteur est bloqué d'un côté et tordu de l'autre. Applique le moment de torsion avec le curseur : qu'est-ce qui se déforme ?");
      j.curseur({ nom: "M_t", min: 0, max: 1, pas: 0.05, val: 0, dec: 2, change: function (v) { n.tors = v; n.dessin(); } });
      j.choix([
        { html: "Les lignes longitudinales se tordent ; les cercles restent circulaires et les rayons restent droits", juste: true },
        { html: "Les cercles deviennent des ellipses", aide: "Tords davantage et suis un cercle noir : il garde sa forme, il tourne seulement." },
        { html: "Les rayons de la section se courbent", aide: "Regarde la section du bas : ses rayons gris tournent, mais restent des segments droits." }
      ], { colonnes: 1, ok: function () {
        n.tors = 1; n.dessin();
        j.bravo("Seules les lignes longitudinales se vrillent.");
        j.expliquer("<p>Chaque section tourne d'un petit angle par rapport à la voisine. C'est ce glissement entre sections qui crée une <b>contrainte tangentielle</b> \\(\\tau\\) dans le matériau.</p>");
        j.suite();
      } });
    } },
    { nom: "Où est τ max ?", jouer: function (j, n) {
      n.tors = 1; n.dessin();
      j.fig.astuce("Touche la section de l'arbre.");
      j.titre("Dans la section, où la contrainte tangentielle est-elle la plus grande ? Touche l'endroit.");
      var fini = false;
      function gagne() {
        fini = true; n.surTouche = null; n.choisi = "surface"; n.tau = true; n.dessin();
        j.bravo("À la surface : \\(\\tau_{max}\\).", [n.SC[0] + n.RS, n.SC[1]]);
        j.expliquer("<p>La contrainte tangentielle est nulle sur l'axe et croît jusqu'à la surface. La condition de résistance porte donc sur \\(\\tau_{max}\\) : elle ne doit pas dépasser la résistance pratique au glissement \\(R_{pg}\\) du matériau.</p>\\[ \\tau_{max} \\le R_{pg} \\]");
        j.suite();
      }
      n.surTouche = function (z) {
        if (fini) return;
        n.choisi = z; n.dessin();
        if (z === "surface") { gagne(); return; }
        setTimeout(function () { if (!fini) { n.choisi = null; n.dessin(); } }, 900);
        j.erreur(z === "centre" ? "Sur l'axe, la matière ne glisse presque pas : la torsion ne la sollicite pas." : "Plus on s'éloigne de l'axe, plus le glissement entre deux sections est grand. Va plus loin.");
      };
      j.reponse(function () { if (!fini) gagne(); });
      j.nettoyer(function () { n.surTouche = null; });
    } },
    { nom: "Diamètre minimal", jouer: function (j, n) {
      n.choisi = null; n.dessin();
      j.fig.astuce("Exemple ajouté : R_pg = 40 N/mm² est une valeur supposée.");
      j.titre("Arbre plein, \\(M_t = 20\\,000\\) N·mm, \\(R_{pg} = 40\\) N/mm². Diamètre minimal ?");
      j.nombre({ avant: "d >", apres: "\\text{mm}", cases: [{ attendu: 13.66, tol: 0.05 }], ligne: true,
        aide: function () { return "\\(d > \\sqrt[3]{\\dfrac{16 \\times 20\\,000}{\\pi \\times 40}}\\) : calcule la fraction, puis sa racine cubique."; },
        ok: function () {
          j.bravo("13,66 mm : on prendra un diamètre au-dessus.");
          j.expliquer("\\[ d > \\sqrt[3]{\\frac{16\\,M_t}{\\pi\\,R_{pg}}} = \\sqrt[3]{\\frac{16 \\times 20\\,000}{\\pi \\times 40}} = \\sqrt[3]{2546} \\approx 13{,}66 \\text{ mm} \\]<p>\\(d\\) en mm, \\(M_t\\) en N·mm, \\(R_{pg}\\) en N/mm².</p>");
          j.suite();
        } });
    } },
    { nom: "Comparer", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Le moment de torsion double. Le diamètre minimal est multiplié par :");
      j.choix([{ html: "2", aide: "Le moment est sous une racine cubique." }, { html: "\\(\\sqrt[3]{2} \\approx 1{,}26\\)", juste: true }, { html: "8", aide: "C'est l'inverse : il faudrait multiplier \\(M_t\\) par 8 pour doubler d." }], { ok: function () {
        j.bravo("× 1,26 : 13,66 mm devient 17,2 mm.");
        j.expliquer("<p>La résistance d'un arbre en torsion croît comme \\(d^3\\) : un diamètre un peu plus grand suffit pour un couple bien plus grand.</p>");
        j.suite();
      } });
    } },
    { nom: "Trouve l'erreur", jouer: function (j, n) {
      j.titre("Pour \\(M_t = 20\\) N·m, un camarade trouve \\(d > \\sqrt[3]{16 \\times 20 / (\\pi \\times 40)} = 1{,}37\\) mm. Où est l'erreur ?");
      j.choix([
        { html: "\\(M_t\\) doit être en N·mm : 20 N·m = 20 000 N·mm", juste: true },
        { html: "Il faut une racine carrée, pas cubique", aide: "La formule du cours a bien une racine cubique. Regarde les unités de \\(M_t\\)." },
        { html: "\\(R_{pg}\\) doit être en Pa", aide: "Avec d en mm, \\(R_{pg}\\) est bien en N/mm². C'est l'autre grandeur." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Avec 20 000 N·mm, on retrouve 13,66 mm.");
        j.expliquer("<p>Un arbre de 1,4 mm pour transmettre 20 N·m, c'est une aiguille : un ordre de grandeur absurde doit faire vérifier les unités.</p>");
        j.suite();
      } });
    } }
  ]
});
