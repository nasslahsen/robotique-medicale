/* Niveau : polymères semi-cristallins. Effet du taux de cristallinité sur la courbe, repli des chaînes, ramifications, transparence, vitesse de cristallisation. */
NIVEAU({
  id: "semi-cristallins",
  init: function (fig) {
    var C = D.C, svg = fig.svg, g = E.s("g", null, svg);
    var n = { mode: "courbe", X: 0, br: 5 };
    var O = [100, 460], W = 530, H = 320, TMIN = -60, TMAX = 220, LMIN = 2.5, LMAX = 10;
    var Tg = -10, Tf = 150;
    function px(T) { return O[0] + (T - TMIN) / (TMAX - TMIN) * W; }
    function py(l) { return O[1] - (l - LMIN) / (LMAX - LMIN) * H; }
    function courbe(X, coul, ep, op) {
      var o = { Tg: Tg, Tf: Tf, X: X, Tl: Tf + 25, larg: 6 }, pts = [];
      if (X > 0) o.Tl = Infinity;
      for (var T = TMIN; T <= TMAX; T += 2) pts.push([px(T), py(BIO.logModule(T, X > 0 ? o : { Tg: Tg, Tl: 60, larg: 6 }))]);
      E.s("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: coul, "stroke-width": ep, "stroke-linejoin": "round", opacity: op }, g);
    }
    // X d'après le nombre de ramifications pour 1000 C (allure de la diapo : ≈ 0,9 à 5, ≈ 0,05 à 70)
    n.Xbranches = function (b) { return Math.max(0.05, 0.9 - 0.85 * (b - 5) / 65); };
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "courbe") {
        fig.chip("X = " + E.fmt(n.X, 1));
        D.fleche(g, O, [O[0] + W + 20, O[1]], C.encre, 3); D.fleche(g, O, [O[0], O[1] - H - 30], C.encre, 3);
        D.texte(g, "log Er (Pa)", [O[0] + 10, O[1] - H - 34], { ancre: "start", taille: 17 });
        D.texte(g, "T (°C)", [O[0] + W + 4, O[1] + 34], { taille: 17 });
        [[Tg, "Tg"], [Tf, "Tf"]].forEach(function (t) { D.ligne(g, [px(t[0]), py(LMAX)], [px(t[0]), O[1]], C.gris, 2, "5 5"); D.texte(g, t[1] + " = " + String(t[0]).replace("-", "−") + " °C", [px(t[0]), O[1] + 26], { taille: 15 }); });
        [3, 6, 9].forEach(function (l) { D.ligne(g, [O[0] - 8, py(l)], [O[0], py(l)], C.encre, 2); D.texte(g, String(l), [O[0] - 22, py(l)], { taille: 15, mono: true, gras: false }); });
        courbe(0, C.gris, 3, 0.6);
        D.texte(g, "X = 0 (amorphe)", [px(40), py(4.3)], { taille: 15, coul: C.doux });
        courbe(n.X, C.jeu, 5, 1);
      } else if (n.mode === "ramif") {
        fig.chip("X ≈ " + E.fmt(n.Xbranches(n.br), 2));
        // une chaîne principale et ses ramifications, et un empilement plus ou moins régulier
        var nb = Math.round(n.br / 7);
        D.texte(g, Math.round(n.br) + " ramifications pour 1000 C", [340, 150], { taille: 19, coul: C.doux, gras: false });
        for (var k = 0; k < 5; k++) {
          var y = 220 + k * 50;
          D.ligne(g, [100, y], [580, y], C.encre, 4);
          for (var b = 0; b < nb; b++) { var x = 120 + ((b * 97 + k * 53) % 440); D.ligne(g, [x, y], [x + 14, y - 26], D.C.jeu, 4); }
        }
        // barre X
        E.s("rect", { x: 100, y: 500, width: 480, height: 26, rx: 13, fill: "#eef0f5" }, g);
        E.s("rect", { x: 100, y: 500, width: 480 * n.Xbranches(n.br), height: 26, rx: 13, fill: PLATEFORME.teinte(0.7) }, g);
        D.texte(g, "taux de cristallinité X", [100, 480], { ancre: "start", taille: 16 });
      } else {
        fig.chip(null);
        // une plaque devant un texte : opaque, translucide ou transparente selon la température
        D.texte(g, "Tg = −10 °C, Tf = 150 °C, X = 0,5 à 25 °C", [340, 150], { taille: 18, coul: C.doux, gras: false });
        [["50 °C", 0.9, 170], ["160 °C", 0.15, 490]].forEach(function (p) {
          D.texte(g, "BIOMATÉRIAUX", [p[2], 330], { taille: 30, coul: C.encre });
          E.s("rect", { x: p[2] - 130, y: 230, width: 260, height: 200, rx: 18, fill: "rgba(240,240,244," + p[1] + ")", stroke: C.encre, "stroke-width": 2.5 }, g);
          D.texte(g, p[0], [p[2], 470], { taille: 22 });
        });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Le taux de cristallinité", jouer: function (j, n) {
      j.fig.astuce("Polymère du TD : Tg = −10 °C, Tf = 150 °C. Courbes qualitatives.");
      j.titre("Augmente le taux de cristallinité X. Règle-le pour que le module ne chute presque plus à Tg.");
      var fini = false;
      var gagne = function () {
        if (fini) return; fini = true;
        j.bravo("Plus X est grand, plus la chute à Tg est petite.");
        j.expliquer("<p>Entre Tg et Tf, le module diminue lentement : la <b>phase cristalline est dispersée dans une matrice caoutchouteuse</b>. Après Tf, le polymère est entièrement liquide (ou caoutchouteux si la masse est très grande). Cristallinité forte : petite chute à Tg ; X = 0 : chute totale.</p>");
        j.suite();
      };
      var c = j.curseur({ nom: "X", min: 0, max: 0.9, pas: 0.1, val: 0, dec: 1, change: function (v) { if (fini) return; n.X = v; n.dessin(); if (v >= 0.8) gagne(); } });
      j.reponse(function () { n.X = 0.9; c.regler(0.9); n.dessin(); gagne(); });
    } },
    { nom: "Pas 100 %", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Pourquoi un polymère ne cristallise-t-il jamais à 100 % ?");
      j.choix([
        { html: "Les chaînes doivent se replier pour former un cristal, et des parties de chaînes n'y participent pas", juste: true },
        { html: "Les cristaux fondent à Tg", aide: "À Tg, c'est la phase amorphe qui change d'état ; les cristaux fondent à Tf." },
        { html: "Les liaisons covalentes l'empêchent", aide: "Les liaisons covalentes tiennent les chaînes, elles n'empêchent pas l'ordre. Pense au refroidissement de longues chaînes." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Il y a peu de chance que toutes les chaînes s'alignent au refroidissement.");
        j.expliquer("<p>Un polymère cristallin est donc toujours <b>semi-cristallin</b> : une fraction cristalline (ρc, Tf) dispersée dans un polymère amorphe (ρa, Tg).</p>");
        j.suite();
      } });
    } },
    { nom: "Les ramifications", jouer: function (j, n) {
      n.mode = "ramif"; n.br = 5; n.dessin();
      j.fig.astuce("Ajoute des ramifications.");
      j.titre("Un polyéthylène a environ 70 ramifications pour 1000 atomes de carbone. Que vaut à peu près son taux de cristallinité ?");
      j.curseur({ nom: "ramifications", min: 5, max: 70, pas: 5, val: 5, change: function (v) { n.br = v; n.dessin(); } });
      j.choix([
        { html: "≈ 0,9", aide: "C'est le cas avec très peu de ramifications : pousse le curseur à 70." },
        { html: "≈ 0,5", aide: "Va jusqu'à 70 sur le curseur et lis la barre." },
        { html: "≈ 0,05", juste: true }
      ], { ok: function () {
        n.br = 70; n.dessin();
        j.bravo("Presque plus de cristaux.");
        j.expliquer("<p>Les <b>ramifications nuisent à la cristallisation</b> : les chaînes ne peuvent plus s'empiler régulièrement. X passe d'environ 0,9 (≈ 5 ramifications pour 1000 C) à environ 0,05 (≈ 70).</p>");
        j.suite();
      } });
    } },
    { nom: "Transparent ou pas", jouer: function (j, n) {
      n.mode = "transparence"; n.dessin();
      j.fig.astuce("TD, application 1.2.");
      j.titre("Ce polymère a X = 0,5 à 25 °C. Vrai ou faux ?");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;font-size:17px">' +
        '<span>À 50 °C, il est translucide ou opaque.</span><span class="trou" data-attendu="v"></span>' +
        '<span>À 30 °C, il est transparent.</span><span class="trou" data-attendu="f"></span>' +
        '<span>À 160 °C, il est transparent.</span><span class="trou" data-attendu="v"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "v", html: "vrai" }, { id: "f", html: "faux" }, { id: "v", html: "vrai" }],
        aide: "Tant qu'il reste des cristaux (en dessous de Tf), la lumière est diffusée. Au-dessus de Tf, plus de cristaux.",
        ok: function () {
          j.bravo("Vrai, faux, vrai.");
          j.expliquer("<p>Les cristaux diffusent la lumière : un semi-cristallin est translucide ou opaque. Au-dessus de Tf, la phase cristalline a fondu : le polymère devient transparent. Pour la même raison, une baisse légère du module entre −20 et 20 °C ne vient pas d'une baisse de X ; le passage de 1 GPa à 1 MPa au-delà de 150 °C, si.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Cristalliser vite", jouer: function (j, n) {
      j.titre("On refroidit ce polymère depuis l'état fondu (Tg = −10 °C, Tf = 150 °C). Vers quelle température la vitesse de cristallisation est-elle la plus élevée ?");
      j.nombre({ avant: "T =", apres: "°\\text{C}", cases: [{ attendu: BIO.temperatureCristallisationMax(-10, 150), tol: 0 }], ligne: true,
        aide: function () { return "Trop chaud, les cristaux fondent ; trop froid, les chaînes ne bougent plus. Prends le milieu entre Tg et Tf."; },
        ok: function () {
          j.bravo("70 °C, à mi-chemin entre Tg et Tf.");
          j.expliquer("<p>Solution du TD : \\(T = \\dfrac{T_f + T_g}{2} = \\dfrac{150 - 10}{2} = 70\\ °\\text{C}\\).</p>");
          j.suite();
        } });
    } }
  ]
});
