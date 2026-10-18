/* Niveau : lire une courbe de traction (droite de Hooke, Re, Rmax, Rr), décharge, fragile ou ductile, ténacité. */
NIVEAU({
  id: "courbe-traction",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg), gh = E.s("g", null, fig.svg);
    // repère : ε en unités du dessin (0 à 20, sans valeurs), σ en MPa
    var O = [90, 500], ux = 26, uy = 0.36;
    var pl = { P: function (v) { return [O[0] + v[0] * ux, O[1] - v[1] * uy]; }, U: function (p) { return [(p[0] - O[0]) / ux, (O[1] - p[1]) / uy]; } };
    var A = [1.5, 880], B = [2.1, 850], Cm = [13, 1000], Dr = [20, 820];
    function sig(e) {
      if (e <= A[0]) return A[1] * e / A[0];
      if (e <= B[0]) return A[1] + (B[1] - A[1]) * (e - A[0]) / (B[0] - A[0]);
      if (e <= Cm[0]) { var u = (Cm[0] - e) / (Cm[0] - B[0]); return B[1] + (Cm[1] - B[1]) * (1 - u * u); }
      var w = (e - Cm[0]) / (Dr[0] - Cm[0]); return Cm[1] - (Cm[1] - Dr[1]) * w * w;
    }
    var n = { pl: pl, sig: sig, A: A, Cm: Cm, Dr: Dr, e: 6, libre: true, surE: null, poignee: true, lettres: false, decharge: null, fragile: false, aires: false };
    n.dessin = function () {
      E.vider(g); E.vider(gh);
      // axes
      D.fleche(g, pl.P([0, 0]), pl.P([21.5, 0]), C.encre, 3);
      D.fleche(g, pl.P([0, 0]), pl.P([0, 1180]), C.encre, 3);
      D.texte(g, "ε = Δl / l0", pl.P([20.2, -90]), { taille: 18 });
      D.texte(g, "σ = F / S0 (MPa)", [650, 50], { taille: 18, ancre: "end" });
      [250, 500, 750, 1000].forEach(function (s) { D.ligne(g, pl.P([0, s]), pl.P([-0.4, s]), C.encre, 2); D.texte(g, String(s), [O[0] - 16, pl.P([0, s])[1]], { taille: 15, ancre: "end", mono: true, gras: false }); });
      // aires (ténacité)
      var pts = [], e;
      if (n.aires) {
        for (e = 0; e <= Dr[0]; e += 0.25) pts.push(pl.P([e, sig(e)]));
        E.s("polygon", { points: [pl.P([0, 0])].concat(pts, [pl.P([Dr[0], 0])]).map(function (p) { return p.join(","); }).join(" "), fill: PLATEFORME.teinte(0.18) }, g);
        E.s("polygon", { points: [pl.P([0, 0]), pl.P([1.6, 940]), pl.P([1.6, 0])].map(function (p) { return p.join(","); }).join(" "), fill: "rgba(229,72,77,0.25)" }, g);
      }
      // courbe ductile
      pts = []; for (e = 0; e <= Dr[0] + 1e-9; e += 0.1) pts.push(pl.P([e, sig(e)]));
      E.s("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: C.jeu, "stroke-width": 5, "stroke-linejoin": "round" }, g);
      D.texte(g, "×", pl.P(Dr), { taille: 30, coul: C.encre });
      if (n.fragile) {
        D.ligne(g, pl.P([0, 0]), pl.P([1.6, 940]), C.ko, 5);
        D.texte(g, "×", pl.P([1.6, 940]), { taille: 30, coul: C.ko });
        D.texte(g, "fragile", [pl.P([1.6, 940])[0] + 20, pl.P([1.6, 940])[1] - 30], { taille: 18, coul: C.ko, ancre: "start" });
        D.texte(g, "ductile", pl.P([16, 1040]), { taille: 18, coul: C.jeu });
      }
      if (n.lettres) {
        [["A", A, [-18, -22]], ["C", Cm, [0, -28]], ["D", Dr, [18, -26]]].forEach(function (l) { var p = pl.P(l[1]); D.rond(g, p, 7, { fill: C.encre }); D.texte(g, l[0], [p[0] + l[2][0], p[1] + l[2][1]], { taille: 22 }); });
      }
      if (n.decharge) {
        var d = n.decharge, p0 = pl.P([d, sig(d)]), e0 = d - sig(d) * A[0] / A[1];
        D.ligne(g, p0, pl.P([e0, 0]), "#3b5bdb", 4, "8 6");
        D.ligne(g, pl.P([0, -40]), pl.P([e0, -40]), "#8b3fd9", 4);
        D.texte(g, "déformation permanente", [pl.P([e0, -40])[0] + 10, pl.P([0, -40])[1] + 2], { taille: 16, coul: "#8b3fd9", ancre: "start" });
      }
      // point courant
      if (n.poignee) {
        var p = pl.P([n.e, sig(n.e)]);
        D.ligne(g, p, [p[0], O[1]], C.gris, 1.5, "4 4");
        D.ligne(g, p, [O[0], p[1]], C.gris, 1.5, "4 4");
        if (n.libre) D.poignee(gh, p, "#3b5bdb"); else D.rond(gh, p, 10, { fill: "#3b5bdb", stroke: "#fff", ep: 3 });
        fig.chip("σ = " + Math.round(sig(n.e)) + " MPa");
      } else fig.chip(null);
    };
    D.glisser(fig.svg, {
      debut: function () { return n.libre && n.poignee; },
      bouge: function (p) { if (!n.libre) return; n.e = Math.max(0, Math.min(Dr[0], pl.U(p)[0])); n.dessin(); },
      fin: function () { if (n.libre && n.surE) n.surE(n.e); }
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Fin de la droite de Hooke", jouer: function (j, n) {
      j.fig.astuce("Courbe de traction d'un métal ductile (allure du cours). Glisse le point bleu le long de la courbe.");
      j.titre("Amène le point à la fin de la partie droite : là où le métal cesse d'être élastique.");
      n.surE = function (e) {
        if (Math.abs(e - n.A[0]) > 0.35) { j.erreur("Pas encore : cherche l'endroit où la courbe quitte la ligne droite issue de l'origine."); return; }
        n.surE = null; n.libre = false; n.e = n.A[0]; n.dessin();
        j.bravo("Ici, σ = 880 MPa : c'est la résistance élastique Re.");
        j.expliquer("<p>De O à A, la courbe est la <b>droite de Hooke</b> : \\(\\sigma = E\\,\\varepsilon\\), domaine de déformation élastique (on relâche, l'éprouvette revient). Le point A donne la <b>résistance élastique</b> \\(R_e = F_e / S_0\\).</p>");
        j.suite();
      };
      j.reponse(function () { n.e = n.A[0]; if (n.surE) n.surE(n.A[0]); });
    } },
    { nom: "Le maximum", jouer: function (j, n) {
      n.poignee = false; n.lettres = true; n.libre = true; n.dessin();
      j.fig.astuce("");
      j.titre("Quel point donne la contrainte la plus haute que le métal supporte, Rmax ?");
      j.choix([{ html: "A", aide: "A marque la fin du domaine élastique, pas le sommet de la courbe." }, { html: "C", juste: true }, { html: "D", aide: "D est la rupture : la contrainte y est déjà redescendue." }], { ok: function () {
        j.bravo("C, le sommet : Rmax = 1 000 MPa.");
        j.expliquer("<p>Après A, le métal se déforme de façon permanente mais la contrainte monte encore jusqu'à \\(R_{max}\\) (point C). Puis elle baisse jusqu'à la rupture en D, où l'on lit la <b>résistance à la rupture</b> \\(R_r\\).</p>");
        j.suite();
      } });
    } },
    { nom: "Relâcher", jouer: function (j, n) {
      j.titre("On tire jusqu'à ε = 8 (entre A et C), puis on relâche complètement. L'éprouvette revient-elle à sa longueur initiale ?");
      j.choix([
        { html: "Oui, comme dans la zone élastique", aide: "Au-delà de A, on est dans le domaine de déformation permanente." },
        { html: "Non, il reste un allongement permanent", juste: true },
        { html: "Elle casse dès qu'on relâche", aide: "La rupture n'arrive qu'en D, à la fin de la courbe." }
      ], { colonnes: 1, ok: function () {
        n.decharge = 8; n.dessin();
        j.bravo("Il reste un allongement : la décharge suit une droite parallèle à celle de Hooke.");
        j.expliquer("<p>Un matériau <b>ductile</b> peut être allongé, étendu, étiré sans se rompre : il a un grand domaine de déformation permanente. Un matériau <b>dur</b> résiste à la pression (pénétration).</p>");
        j.suite();
      } });
    } },
    { nom: "Fragile ou ductile", jouer: function (j, n) {
      n.decharge = null; n.lettres = false; n.fragile = true; n.dessin();
      j.titre("La courbe rouge casse presque sans se déformer. Lequel absorbe le plus d'énergie avant de rompre ?");
      j.choix([
        { html: "Le fragile, il monte plus haut", aide: "Compare l'aire sous chaque courbe, pas seulement la hauteur." },
        { html: "Le ductile", juste: true },
        { html: "Les deux autant", aide: "Regarde jusqu'où chaque courbe s'étend vers la droite avant la croix de rupture." }
      ], { colonnes: 1, ok: function () {
        n.aires = true; n.dessin();
        j.bravo("Le ductile : son aire est bien plus grande.");
        j.expliquer("<p>L'aire sous la courbe est l'énergie absorbée. La <b>ténacité</b> est la capacité d'un matériau à absorber de l'énergie et à se déformer plastiquement sans se fracturer. Sur la courbe force-allongement, cette aire est l'énergie notée \\(W\\) dans le cours.</p>");
        j.suite();
      } });
    } },
    { nom: "Re à partir de Fe", jouer: function (j, n) {
      n.fragile = false; n.aires = false; n.dessin();
      j.fig.astuce("Exemple ajouté.");
      j.titre("Une éprouvette de section 12 mm² quitte la droite de Hooke sous Fe = 10 560 N. Que vaut Re ?");
      j.nombre({ avant: "R_e =", apres: "\\text{MPa}", cases: [{ attendu: 880, tol: 0.5 }], ligne: true,
        aide: function () { return "Re = Fe / S0, avec la force en N et la section en mm²."; },
        ok: function () { j.bravo("Re = 10 560 / 12 = 880 MPa, le point A de la courbe."); j.suite(); } });
    } }
  ]
});
