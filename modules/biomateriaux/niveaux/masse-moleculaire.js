/* Niveau : masse moléculaire et enchevêtrement. Rupture selon la longueur des chaînes, décalage de l'état liquide, paraffine, ténacité. */
NIVEAU({
  id: "masse-moleculaire",
  init: function (fig) {
    var C = D.C, svg = fig.svg, g = E.s("g", null, svg);
    var n = { mode: "rupture", longueur: 1, tire: false, M: 1, libre: true };
    // courbe log E – T : axes, courbe, échelle
    var O = [100, 470], W = 520, H = 330, TMIN = -40, TMAX = 260, LMIN = 2.5, LMAX = 10;
    function px(T) { return O[0] + (T - TMIN) / (TMAX - TMIN) * W; }
    function py(l) { return O[1] - (l - LMIN) / (LMAX - LMIN) * H; }
    n.Tl = function () { return n.M >= 5 ? Infinity : 70 + 32 * n.M; };
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "rupture") {
        fig.chip(n.longueur === 1 ? "chaînes courtes" : "chaînes longues");
        // éprouvette avec chaînes de longueur réglable (traits horizontaux décalés)
        var x0 = 110, x1 = 570, y0 = 170, lignes = 12, Lc = n.longueur === 1 ? 70 : 300, ouvre = n.tire ? 26 : 0;
        E.s("rect", { x: x0 - 20, y: y0 - 30, width: x1 - x0 + 40, height: lignes * 26 + 40, rx: 16, fill: "#fbfbfd", stroke: "#c6cbd8", "stroke-width": 2 }, g);
        var r = BIO.hasard(n.longueur * 11);
        var fente = 340; // position de la fissure
        for (var k = 0; k < lignes; k++) {
          var y = y0 + k * 26, x = x0 - r() * Lc;
          while (x < x1) {
            var a = Math.max(x0, x), b = Math.min(x1, x + Lc - 10);
            if (b > a) {
              var coupe = n.tire && a < fente && b > fente;
              if (coupe && n.longueur === 2) {
                D.ligne(g, [a - ouvre, y], [fente - 4 - ouvre, y], C.encre, 3.5); D.ligne(g, [fente + 4 + ouvre, y], [b + ouvre, y], C.encre, 3.5);
                D.rond(g, [fente - 4 - ouvre, y], 4, { fill: C.ko }); D.rond(g, [fente + 4 + ouvre, y], 4, { fill: C.ko });
              } else {
                var dec = n.tire ? ((a + b) / 2 < fente ? -ouvre : ouvre) : 0;
                if (coupe) dec = (fente - a > b - fente) ? -ouvre : ouvre;
                D.ligne(g, [a + dec, y], [b + dec, y], C.encre, 3.5);
              }
            }
            x += Lc;
          }
        }
        if (n.tire) {
          D.fleche(g, [x0 - 30, y0 + 140], [x0 - 70, y0 + 140], C.ko, 5); D.fleche(g, [x1 + 30, y0 + 140], [x1 + 70, y0 + 140], C.ko, 5);
          D.texte(g, n.longueur === 1 ? "la fissure contourne les chaînes" : "des chaînes sont rompues (points rouges)", [340, 520], { taille: 18, coul: C.ko });
        }
      } else if (n.mode === "courbe") {
        fig.chip(n.M >= 5 ? "masse infinie" : "masse " + ["", "M₁", "M₂", "M₃", "M₄"][Math.round(n.M)]);
        D.fleche(g, O, [O[0] + W + 20, O[1]], C.encre, 3); D.fleche(g, O, [O[0], O[1] - H - 20], C.encre, 3);
        D.texte(g, "log E (Pa)", [O[0] + 8, O[1] - H - 30], { ancre: "start", taille: 17 });
        D.texte(g, "T (°C)", [O[0] + W + 10, O[1] + 34], { taille: 17 });
        [0, 100, 200].forEach(function (T) { D.ligne(g, [px(T), O[1]], [px(T), O[1] + 8], C.encre, 2); D.texte(g, String(T), [px(T), O[1] + 26], { taille: 15, mono: true, gras: false }); });
        [3, 6, 9].forEach(function (l) { D.ligne(g, [O[0] - 8, py(l)], [O[0], py(l)], C.encre, 2); D.texte(g, String(l), [O[0] - 22, py(l)], { taille: 15, mono: true, gras: false }); });
        var o = { Tg: 40, Tl: n.Tl(), larg: 7 }, pts = [];
        for (var T = TMIN; T <= TMAX; T += 2) pts.push([px(T), py(BIO.logModule(T, o))]);
        E.s("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: C.jeu, "stroke-width": 5, "stroke-linejoin": "round" }, g);
        D.ligne(g, [px(150), py(LMAX)], [px(150), O[1]], D.C.acc, 3, "6 5");
        D.texte(g, "150 °C", [px(150) + 8, py(LMAX) + 4], { ancre: "start", taille: 16, coul: D.C.acc });
        var l150 = BIO.logModule(150, o);
        D.rond(g, [px(150), py(l150)], 9, { fill: D.C.acc, stroke: "#fff", ep: 3 });
      } else {
        fig.chip(null);
        // deux courbes contrainte-déformation : fragile et ductile, aire sous la courbe
        var Q = [110, 470];
        D.fleche(g, Q, [630, 470], C.encre, 3); D.fleche(g, Q, [110, 130], C.encre, 3);
        D.texte(g, "σ", [92, 140], { taille: 22 }); D.texte(g, "ε", [625, 495], { taille: 22 });
        var f = [Q, [210, 230]], d = [Q, [160, 300]];
        for (var u = 0; u <= 1; u += 0.05) d.push([160 + u * 420, 300 - 30 * Math.sin(u * 3)]);
        d.push([580, 470]);
        E.s("polygon", { points: d.map(function (p) { return p.join(","); }).join(" "), fill: n.zone === "d" ? PLATEFORME.teinte(0.3) : "rgba(59,91,219,0.08)" }, g);
        E.s("polygon", { points: f.concat([[210, 470]]).map(function (p) { return p.join(","); }).join(" "), fill: n.zone === "f" ? PLATEFORME.teinte(0.3) : "rgba(201,169,110,0.25)" }, g);
        E.s("polyline", { points: f.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: "#a8874a", "stroke-width": 5 }, g);
        E.s("polyline", { points: d.slice(0, -1).map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: C.encre, "stroke-width": 5, "stroke-linejoin": "round" }, g);
        D.texte(g, "matériau 1", [215, 205], { taille: 18, coul: "#a8874a" });
        D.texte(g, "matériau 2", [470, 250], { taille: 18 });
      }
    };
    svg.addEventListener("click", function (ev) {
      if (!n.libre || !n.surZone) return;
      var p = E.point(svg, ev);
      if (p[1] > 300 && p[1] < 470 && p[0] > 110 && p[0] < 210) n.surZone("f"); else if (p[1] > 290 && p[1] < 470 && p[0] > 230 && p[0] < 580) n.surZone("d");
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Chaînes courtes", jouer: function (j, n) {
      j.fig.astuce("Chaque trait est une macromolécule. Tire sur l'éprouvette.");
      j.titre("Une éprouvette faite de chaînes courtes. Tire dessus et regarde par où passe la fissure.");
      var b = E.h("button", "btn bleu", "Tirer", j.el); b.type = "button";
      var tirer = function () {
        if (n.tire) return;
        n.tire = true; b.remove(); n.dessin();
        j.consigne("Quelles liaisons la fissure a-t-elle rompues ?");
        j.choix([
          { html: "Les liaisons intermoléculaires, entre les chaînes", juste: true },
          { html: "Les liaisons covalentes des chaînes", aide: "Regarde la figure : aucune chaîne n'est coupée, la fissure passe entre elles." }
        ], { colonnes: 1, ok: function () {
          j.bravo("Avec des chaînes courtes, la rupture contourne les chaînes.");
          j.suite();
        } });
      };
      b.addEventListener("click", tirer);
      j.reponse(function () { tirer(); });
    } },
    { nom: "Chaînes longues", jouer: function (j, n) {
      n.tire = false; n.longueur = 2; n.dessin();
      j.titre("Prédis : avec des chaînes longues et enchevêtrées, que doit faire la fissure ?");
      j.choix([
        { html: "Rompre un certain nombre de chaînes", juste: true },
        { html: "Passer entre les chaînes, comme avant", aide: "Une chaîne longue traverse la fissure de part et d'autre : on ne peut plus la contourner." }
      ], { colonnes: 1, ok: function () {
        n.tire = true; n.dessin();
        j.bravo("Des liaisons intramoléculaires (covalentes) sont rompues.");
        j.expliquer("<p>Les propriétés mécaniques et la viscosité augmentent avec la <b>masse moléculaire</b>, en fonction du <b>degré d'enchevêtrement</b>. Chaînes courtes : la rupture passe par les liaisons intermoléculaires. Chaînes longues : il faut rompre des liaisons intramoléculaires, bien plus fortes.</p>");
        j.suite();
      } });
    } },
    { nom: "Jamais liquide", jouer: function (j, n) {
      n.mode = "courbe"; n.M = 1; n.libre = true; n.dessin();
      j.fig.astuce("Allure de la courbe du cours. Augmente la masse moléculaire.");
      j.titre("Une sonde doit rester solide (plateau caoutchouteux) à 150 °C. Règle la masse moléculaire pour qu'elle ne soit pas encore liquide à 150 °C.");
      var fini = false;
      var gagne = function () {
        if (fini) return; fini = true; n.libre = false;
        j.bravo("Plus la masse est grande, plus l'état liquide apparaît tard.");
        j.expliquer("<p>Une augmentation de la masse moléculaire <b>décale l'apparition de l'état liquide</b> vers les températures plus élevées (M₂ > M₁). Avec une masse moléculaire infinie (M₃ → ∞), le polymère n'atteint jamais l'état liquide : il reste sur le plateau caoutchouteux.</p>");
        j.suite();
      };
      var c = j.curseur({ nom: "masse", min: 1, max: 5, pas: 1, val: 1, change: function (v) {
        if (!n.libre) return;
        n.M = v; n.dessin();
        if (BIO.logModule(150, { Tg: 40, Tl: n.Tl(), larg: 7 }) > 5.5) gagne();
      } });
      j.reponse(function () { n.M = 4; c.regler(4); n.dessin(); gagne(); });
    } },
    { nom: "La paraffine", jouer: function (j, n) {
      n.mode = "rupture"; n.longueur = 1; n.tire = false; n.dessin();
      j.fig.astuce("");
      j.titre("La paraffine (la cire) a une faible ténacité et fond à basse température. Pourquoi ?");
      j.choix([
        { html: "Ses propriétés viennent des liaisons intermoléculaires de ses chaînes courtes", juste: true },
        { html: "Ses liaisons covalentes sont faibles", aide: "Une liaison C–C reste forte (349 kJ/mol), même dans la cire." },
        { html: "Elle est très réticulée", aide: "La paraffine n'a pas de réseau : ce sont des chaînes courtes." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Chaînes courtes : tout repose sur les liaisons faibles.");
        j.suite();
      } });
    } },
    { nom: "La ténacité", jouer: function (j, n) {
      n.mode = "tenacite"; n.zone = null; n.libre = true; n.dessin();
      j.titre("La ténacité est la capacité à absorber de l'énergie en se déformant plastiquement sans se fracturer. Touche l'aire du matériau le plus tenace.");
      n.surZone = function (z) {
        n.zone = z; n.dessin();
        if (z === "f") { j.erreur("Cette aire est petite : le matériau 1 casse tôt. L'énergie absorbée, c'est toute l'aire sous la courbe jusqu'à la rupture."); return; }
        n.surZone = null; n.libre = false;
        j.bravo("L'aire sous la courbe du matériau 2 est bien plus grande.");
        j.expliquer("<p><b>Ténacité</b> : capacité d'un matériau à absorber de l'énergie et à se déformer plastiquement sans se fracturer. L'aire sous la courbe contrainte-déformation est l'énergie absorbée : petite pour un matériau fragile, grande pour un matériau ductile.</p>");
        j.suite();
      };
      j.reponse(function () { n.libre = true; if (n.surZone) n.surZone("d"); });
    } }
  ]
});
