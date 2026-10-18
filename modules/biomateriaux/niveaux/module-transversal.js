/* Niveau : charge perpendiculaire aux fibres, même contrainte, 1/ECT = φf/Ef + φm/Em ; ECL et ECT selon le taux de fibres. */
NIVEAU({
  id: "module-transversal",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { phi: 0.4, Ef: 70, Em: 3, libre: true, courbes: false };
    function ressort(x0, x1, y, h, coul, ep) {
      var pts = [[x0, y], [x0 + 12, y]], sp = 10;
      for (var i = 0; i < sp; i++) pts.push([x0 + 12 + (x1 - x0 - 24) * (i + 0.5) / sp, y + (i % 2 ? h : -h)]);
      pts.push([x1 - 12, y], [x1, y]);
      E.s("polyline", { points: pts.join(" "), fill: "none", stroke: coul, "stroke-width": ep, "stroke-linejoin": "round", "stroke-linecap": "round" }, g);
    }
    n.dessin = function () {
      E.vider(g);
      var phi = n.phi, ECT = BIO.moduleTransversal(n.Ef, n.Em, phi), ECL = BIO.moduleLongitudinal(n.Ef, n.Em, phi);
      // ressorts en série : la fibre (raide) puis la matrice (souple) ; allongements dessinés proportionnels à φ/E
      var y = 215, x0 = 90, lf = 50 + 170 * phi, lm = 50 + 170 * (1 - phi), af = phi / n.Ef, am = (1 - phi) / n.Em, k = 150 * n.Em;
      var xf = x0 + lf + af * k, xm = xf + 16 + lm + am * k;
      E.s("rect", { x: x0 - 30, y: y - 60, width: 30, height: 120, fill: "#c6cbd8", stroke: C.encre, "stroke-width": 2 }, g);
      ressort(x0, xf, y, 30, C.jeu, 8);
      E.s("rect", { x: xf, y: y - 40, width: 16, height: 80, rx: 4, fill: "#b9c0cc", stroke: C.encre, "stroke-width": 2 }, g);
      ressort(xf + 16, xm, y, 30, C.gris, 4.5);
      E.s("rect", { x: xm, y: y - 50, width: 20, height: 100, rx: 4, fill: "#b9c0cc", stroke: C.encre, "stroke-width": 2 }, g);
      D.fleche(g, [xm + 24, y], [xm + 80, y], "#3b5bdb", 6);
      D.texte(g, "fibre", [(x0 + xf) / 2, y - 56], { taille: 19, coul: C.jeu });
      D.texte(g, "matrice", [(xf + 16 + xm) / 2, y - 56], { taille: 19, coul: C.doux });
      D.texte(g, "même force, les allongements s'ajoutent", [340, 300], { taille: 17, coul: C.doux });
      // courbes E(φf)
      var O = [110, 560], W = 480, H = 210, emax = n.Ef;
      var P = function (p, e) { return [O[0] + p * W, O[1] - e / emax * H]; };
      D.fleche(g, O, [O[0] + W + 30, O[1]], C.encre, 3); D.fleche(g, O, [O[0], O[1] - H - 30], C.encre, 3);
      D.texte(g, "φf", [O[0] + W + 26, O[1] + 22], { taille: 18 });
      D.texte(g, "Em", [O[0] - 14, P(0, n.Em)[1]], { taille: 15, ancre: "end" });
      D.texte(g, "Ef", [O[0] - 14, P(0, n.Ef)[1]], { taille: 15, ancre: "end" });
      D.ligne(g, P(0, n.Ef), P(1, n.Ef), C.pale, 1.5, "4 4");
      if (n.courbes) {
        var a = [], b = [];
        for (var p = 0; p <= 1.0001; p += 0.02) { a.push(P(p, BIO.moduleLongitudinal(n.Ef, n.Em, p))); b.push(P(p, BIO.moduleTransversal(n.Ef, n.Em, p))); }
        E.s("polyline", { points: a.join(" "), fill: "none", stroke: C.encre, "stroke-width": 3 }, g);
        E.s("polyline", { points: b.join(" "), fill: "none", stroke: C.jeu, "stroke-width": 4 }, g);
        D.texte(g, "ECL", P(0.5, BIO.moduleLongitudinal(n.Ef, n.Em, 0.5) + 9), { taille: 17 });
        D.texte(g, "ECT", P(0.7, BIO.moduleTransversal(n.Ef, n.Em, 0.7) + 6), { taille: 17, coul: C.jeu });
        D.rond(g, P(phi, ECL), 8, { fill: C.encre, stroke: "#fff", ep: 2 });
      }
      D.rond(g, P(phi, ECT), 9, { fill: C.jeu, stroke: "#fff", ep: 2.5 });
      fig.chip("φf = " + E.fmt(phi, 2) + " · ECT = " + E.fmt(ECT, 2) + " GPa");
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Ce qui est commun", jouer: function (j, n) {
      j.fig.astuce("On tire en travers des fibres : fibre et matrice travaillent en série.");
      j.titre("Quelle grandeur est la même dans la fibre et dans la matrice ?");
      j.choix([
        { html: "La contrainte σ", juste: true },
        { html: "La déformation ε", aide: "C'était le cas en parallèle. En série, la même force traverse les deux ressorts." },
        { html: "Le module E", aide: "Les modules restent ceux des constituants : 70 et 3 GPa." }
      ], { ok: function () {
        j.bravo("σCT = σf = σm, et les déformations s'additionnent.");
        j.expliquer("<p>\\(\\varepsilon_{CT} = \\varepsilon_f \\phi_f + \\varepsilon_m \\phi_m\\). En divisant par \\(\\sigma_{CT}\\) : \\(\\dfrac{1}{E_{CT}} = \\dfrac{\\phi_f}{E_f} + \\dfrac{\\phi_m}{E_m}\\). La diapo titre cette page « Module longitudinal » : il s'agit bien du module transversal.</p>");
        j.suite();
      } });
    } },
    { nom: "Calculer ECT", jouer: function (j, n) {
      j.fig.astuce("Exemple du cours : Ef = 70 GPa, Em = 3 GPa, φf = 0,4.");
      j.titre("Calcule le module transversal ECT.");
      j.nombre({ avant: "E_{CT} =", apres: "\\text{GPa}", cases: [{ attendu: 4.86, tol: 0.01 }], ligne: true,
        aide: function () { return "ECT = Ef Em / (φf Em + φm Ef) = 70 × 3 / (0,4 × 3 + 0,6 × 70)."; },
        ok: function () { j.bravo("210 / 43,2 ≈ 4,86 GPa."); j.suite(); } });
    } },
    { nom: "Qui commande ECT ?", jouer: function (j, n) {
      j.titre("Avec les mêmes données, ECL = 29,8 GPa mais ECT = 4,86 GPa, proche de Em/φm = 5. Qui commande le module transversal ?");
      j.choix([
        { html: "La matrice", juste: true },
        { html: "Les fibres", aide: "ECT reste près de Em / φm : la fibre, très raide, s'allonge à peine et ne compte presque pas." },
        { html: "Les deux à parts égales", aide: "Compare 4,86 à Em / φm = 3 / 0,6." }
      ], { ok: function () {
        n.courbes = true; n.dessin();
        j.bravo("La matrice : la contribution des fibres est presque négligeable.");
        j.expliquer("<p>Le module longitudinal est influencé par les fibres, le transversal par la matrice. Le module longitudinal est toujours plus grand que le module transversal.</p>");
        j.suite();
      } });
    } },
    { nom: "Doubler ECT", jouer: function (j, n) {
      j.fig.astuce("Courbe orange : ECT. Courbe noire : ECL.");
      j.titre("Règle φf pour que ECT atteigne 6 GPa, le double de Em.");
      var c = j.curseur({ nom: "φf", min: 0, max: 1, pas: 0.01, val: 0.4, dec: 2, change: function (v) {
        if (!n.libre) { c.regler(0.52); return; }
        n.phi = v; n.dessin();
        if (Math.abs(BIO.moduleTransversal(70, 3, v) - 6) < 0.1) gagne();
      } });
      function gagne() {
        n.libre = false; n.phi = 0.52; n.dessin();
        j.bravo("Il faut φf ≈ 0,52 rien que pour doubler ECT ; ECL vaut alors 38 GPa.");
        j.suite();
      }
      j.reponse(function () { c.regler(0.52); gagne(); });
    } },
    { nom: "Trouver l'erreur", jouer: function (j, n) {
      n.libre = true;
      j.titre("Un étudiant écrit : « En travers des fibres, ECT = Ef φf + Em φm = 29,8 GPa ». Quelle est l'erreur ?");
      j.choix([
        { html: "Il a pris la loi en parallèle : en série, ce sont les inverses qui s'ajoutent", juste: true },
        { html: "Il a inversé φf et φm", aide: "Même avec les fractions inversées, la formule resterait celle du chargement parallèle." },
        { html: "Aucune erreur", aide: "Regarde la courbe : en travers, le module reste près de celui de la matrice." }
      ], { colonnes: 1, ok: function () {
        j.bravo("1/ECT = φf/Ef + φm/Em.");
        j.suite();
      } });
    } }
  ]
});
