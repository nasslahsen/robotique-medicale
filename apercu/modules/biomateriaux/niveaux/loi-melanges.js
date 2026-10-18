/* Niveau : charge parallèle aux fibres, même déformation, loi des mélanges σCL = σf φf + σm φm et ECL = Ef φf + Em φm. */
NIVEAU({
  id: "loi-melanges",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { phi: 0.4, Ef: 70, Em: 3, eps: 0.01, libre: true, rupture: false };
    function ressort(x0, x1, y, h, coul, ep, spires) {
      var pts = [[x0, y]], l = x1 - x0, a = 30, b = l - 30;
      pts.push([x0 + a, y]);
      for (var i = 0; i < spires * 2; i++) pts.push([x0 + a + (b - a) * (i + 0.5) / (spires * 2), y + (i % 2 ? h : -h)]);
      pts.push([x0 + b, y]); pts.push([x1, y]);
      E.s("polyline", { points: pts.join(" "), fill: "none", stroke: coul, "stroke-width": ep, "stroke-linejoin": "round", "stroke-linecap": "round" }, g);
    }
    n.dessin = function () {
      E.vider(g);
      if (n.rupture) {
        var O = [110, 480], P = function (e, s) { return [O[0] + e * 160, O[1] - s * 0.18]; };
        D.fleche(g, O, [640, O[1]], C.encre, 3); D.fleche(g, O, [O[0], 70], C.encre, 3);
        D.texte(g, "ε (%)", [626, O[1] + 26], { taille: 18 }); D.texte(g, "σ (MPa)", [O[0] + 14, 80], { taille: 18, ancre: "start" });
        // fibre de verre : εfu ≈ 2,5 % ; matrice : εmu ≈ 3 % (valeurs illustratives)
        D.ligne(g, O, P(2.5, 1750), C.jeu, 5); D.texte(g, "fibre", P(1.7, 1500), { taille: 18, coul: C.jeu, ancre: "end" });
        var sl = 0.4 * 1750 + 0.6 * 75;
        D.ligne(g, O, P(2.5, sl), C.encre, 5); D.texte(g, "composite", P(1.9, sl * 1.9 / 2.5 - 170), { taille: 18, ancre: "start" });
        D.ligne(g, O, P(3, 90), C.gris, 5); D.texte(g, "matrice", P(2.3, 210), { taille: 18, coul: C.doux });
        D.ligne(g, P(2.5, 0), P(2.5, 1750), C.ko, 2, "6 5");
        D.texte(g, "εfu", [P(2.5, 0)[0], O[1] + 26], { taille: 18, coul: C.ko });
        D.texte(g, "σfu", P(2.62, 1750), { taille: 17, ancre: "start", coul: C.jeu });
        D.texte(g, "σLtu", P(2.62, sl), { taille: 17, ancre: "start" });
        fig.chip("valeurs illustratives");
        return;
      }
      var x0 = 110, x1 = 470 + n.eps * 4000, yF = 220, yM = 380, hF = 30 + 60 * n.phi, hM = 30 + 60 * (1 - n.phi);
      E.s("rect", { x: x0 - 40, y: 110, width: 40, height: 380, fill: "#c6cbd8", stroke: C.encre, "stroke-width": 2 }, g);
      for (var k = 0; k < 9; k++) D.ligne(g, [x0 - 40, 120 + k * 42], [x0 - 60, 140 + k * 42], C.encre, 2);
      E.s("rect", { x: x1, y: 110, width: 30, height: 380, rx: 6, fill: "#b9c0cc", stroke: C.encre, "stroke-width": 2 }, g);
      ressort(x0, x1, yF, hF / 2, C.jeu, 4 + 8 * n.phi, 7);
      ressort(x0, x1, yM, hM / 2, C.gris, 4 + 8 * (1 - n.phi), 7);
      D.texte(g, "fibres : φf = " + E.fmt(n.phi, 2), [x0 + 20, yF - hF / 2 - 26], { taille: 18, coul: C.jeu, ancre: "start" });
      D.texte(g, "matrice : φm = " + E.fmt(1 - n.phi, 2), [x0 + 20, yM - hM / 2 - 26], { taille: 18, coul: C.doux, ancre: "start" });
      D.fleche(g, [x1 + 34, 300], [x1 + 110, 300], "#3b5bdb", 7);
      D.texte(g, "F", [x1 + 80, 274], { taille: 24, coul: "#3b5bdb" });
      D.texte(g, "même allongement pour les deux", [330, 530], { taille: 17, coul: C.doux });
      var E0 = n.Ef * n.phi + n.Em * (1 - n.phi);
      fig.chip("ECL = " + E.fmt(E0, 1) + " GPa");
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Qui porte la charge ?", jouer: function (j, n) {
      j.fig.astuce("Composite tiré dans le sens des fibres : fibres et matrice s'allongent ensemble, comme deux ressorts côte à côte.");
      j.titre("Fibre de verre (70 GPa) et résine (3 GPa) ont la même déformation. Laquelle porte la plus grande contrainte ?");
      j.choix([
        { html: "La fibre", juste: true },
        { html: "La matrice", aide: "À déformation égale, σ = E ε : regarde quel module est le plus grand." },
        { html: "Autant l'une que l'autre", aide: "La déformation est la même, pas la contrainte : σ = E ε dépend du module." }
      ], { ok: function () {
        j.bravo("La fibre, 23 fois plus rigide, porte 23 fois plus de contrainte.");
        j.expliquer("<p>Charge parallèle aux fibres : \\(\\varepsilon_{CL} = \\varepsilon_f = \\varepsilon_m\\). Chaque constituant suit sa loi de Hooke : \\(\\sigma_f = E_f\\,\\varepsilon\\) et \\(\\sigma_m = E_m\\,\\varepsilon\\).</p>");
        j.suite();
      } });
    } },
    { nom: "Les deux contraintes", jouer: function (j, n) {
      j.fig.astuce("Exemple du cours : Ef = 70 GPa, Em = 3 GPa, φf = 0,4, ε = 0,01.");
      j.titre("Calcule σf et σm en MPa.");
      j.nombre({ avant: "\\sigma_f,\\ \\sigma_m =", apres: "\\text{MPa}", cases: [{ attendu: 700, tol: 0.5 }, { attendu: 30, tol: 0.5 }], ligne: true,
        aide: function () { return "σ = E ε avec E en MPa : 70 GPa = 70 000 MPa."; },
        ok: function () { j.bravo("σf = 70 000 × 0,01 = 700 MPa ; σm = 3 000 × 0,01 = 30 MPa."); j.suite(); } });
    } },
    { nom: "La contrainte du composite", jouer: function (j, n) {
      j.titre("Les forces s'ajoutent : FCL = Ff + Fm. Quelle contrainte σCL dans le composite ?");
      j.nombre({ avant: "\\sigma_{CL} =", apres: "\\text{MPa}", cases: [{ attendu: 298, tol: 0.5 }], ligne: true,
        aide: function () { return "σCL = σf φf + σm φm, avec φm = 1 − φf = 0,6."; },
        ok: function () {
          j.bravo("700 × 0,4 + 30 × 0,6 = 280 + 18 = 298 MPa.");
          j.expliquer("<p>De \\(F_{CL} = \\sigma_f A_f + \\sigma_m A_m = \\sigma_{CL} A_c\\) on tire la <b>loi des mélanges</b> \\(\\sigma_{CL} = \\sigma_f \\phi_f + \\sigma_m \\phi_m\\). Les fibres portent 280 MPa sur 298, soit 94 %. La diapo écrit « 8 » pour la part de la matrice : c'est \\(30 \\times 0{,}6 = 18\\) MPa (6 %).</p>");
          j.suite();
        } });
    } },
    { nom: "Viser un module", jouer: function (j, n) {
      j.fig.astuce("Même verre et même résine.");
      j.titre("Règle le taux de fibres pour obtenir ECL = 43,2 GPa.");
      var c = j.curseur({ nom: "φf", min: 0, max: 1, pas: 0.05, val: 0.4, dec: 2, change: function (v) {
        if (!n.libre) { c.regler(0.6); return; }
        n.phi = v; n.dessin(); if (Math.abs(v - 0.6) < 1e-6) gagne();
      } });
      function gagne() {
        n.libre = false; n.phi = 0.6; n.dessin();
        j.bravo("φf = 0,6 : 70 × 0,6 + 3 × 0,4 = 43,2 GPa.");
        j.expliquer("<p>Divise la loi des contraintes par \\(\\varepsilon\\) : \\(E_{CL} = E_f \\phi_f + E_m \\phi_m\\). Le module longitudinal varie en ligne droite de \\(E_m\\) à \\(E_f\\) avec le taux de fibres.</p>");
        j.suite();
      }
      j.reponse(function () { c.regler(0.6); gagne(); });
    } },
    { nom: "Écrire la loi", jouer: function (j, n) {
      n.libre = true;
      j.titre("Construis la loi des mélanges du module longitudinal.");
      var t = function (a) { return '<span class="trou" data-attendu="' + a + '" style="min-width:64px"></span>'; };
      var z = j.zone("", '<div style="display:flex;align-items:center;gap:6px;font-size:22px;flex-wrap:wrap">\\(E_{CL} =\\)' + t("Ef") + t("pf") + "<span>+</span>" + t("Em") + t("pm") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "pm", tex: "\\phi_m" }, { id: "Ef", tex: "E_f" }, { id: "x", tex: "\\sigma_f" }, { id: "Em", tex: "E_m" }, { id: "pf", tex: "\\phi_f" }],
        aide: "Chaque module est pondéré par la fraction volumique de son propre constituant.",
        ok: function () { j.bravo("ECL = Ef φf + Em φm."); j.suite(); }
      });
    } },
    { nom: "Qui casse en premier ?", jouer: function (j, n) {
      n.rupture = true; n.dessin();
      j.fig.astuce("Courbes de traction de la fibre, de la matrice et du composite (allure du cours).");
      j.titre("La fibre rompt à une déformation εfu plus petite que la matrice. Que se passe-t-il en premier quand on tire ?");
      j.choix([
        { html: "Les fibres cassent, à εfu", juste: true },
        { html: "La matrice casse, à εmu", aide: "Tous s'allongent ensemble : lequel atteint en premier sa déformation de rupture ?" },
        { html: "Rien ne casse avant σmu", aide: "σmu est petite : le composite la dépasse bien avant de rompre. Compare plutôt les déformations." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Les fibres atteignent εfu les premières : le composite atteint alors σLtu.");
        j.expliquer("<p>En pratique, il est difficile de prévoir le mode de rupture ; les équations de rupture servent d'approximation.</p>");
        j.suite();
      } });
    } }
  ]
});
