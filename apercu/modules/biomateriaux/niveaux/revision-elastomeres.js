/* Révision du chapitre 4 : courbes brut et vulcanisé, Tv et ambiante, systèmes de vulcanisation, latex, module d'un élastomère. */
NIVEAU({
  id: "revision-elastomeres",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { mode: "courbes", T: 80, montre: false };
    var X0 = 100, X1 = 620, Y0 = 460, Y1 = 150;
    function px(T) { return X0 + (T + 100) / 240 * (X1 - X0); }
    function py(l) { return Y0 - (l - 3) / 7 * (Y0 - Y1); }
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "courbes") {
        D.fleche(g, [X0, Y0], [X1 + 20, Y0], C.encre, 3); D.fleche(g, [X0, Y0], [X0, Y1 - 30], C.encre, 3);
        D.texte(g, "T (°C)", [X1 + 4, Y0 + 34], { taille: 16 }); D.texte(g, "log module (Pa)", [X0 + 8, Y1 - 44], { taille: 16, ancre: "start" });
        [-100, -50, 0, 50, 100].forEach(function (t) { D.ligne(g, [px(t), Y0], [px(t), Y0 + 8], C.encre, 2); D.texte(g, String(t).replace("-", "−"), [px(t), Y0 + 24], { taille: 15, gras: false, mono: true }); });
        [["A", { Tg: -60, Tl: Infinity }], ["B", { Tg: -60, Tl: 45 }]].forEach(function (c, k) {
          var pts = []; for (var T = -100; T <= 140; T += 2) pts.push([px(T), py(BIO.logModule(T, c[1]))]);
          E.s("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: k ? PLATEFORME.teinte(0.55) : C.jeu, "stroke-width": 5, "stroke-dasharray": k ? "12 7" : null }, g);
          var T0 = k ? 70 : 115; D.texte(g, c[0], [px(T0), py(BIO.logModule(T0, c[1])) - 22], { taille: 22, coul: C.jeu });
        });
        D.ligne(g, [px(n.T), Y1], [px(n.T), Y0], C.acc, 3, "8 6");
        D.texte(g, n.T + " °C", [px(n.T) + 8, Y1 + 6], { taille: 17, coul: C.acc, ancre: "start" });
        if (n.montre) { D.texte(g, "A : vulcanisé", [430, 520], { taille: 17, ancre: "start" }); D.texte(g, "B : brut", [210, 520], { taille: 17, ancre: "start" }); }
      } else if (n.mode === "tv") {
        // échelle de température avec l'ambiante
        D.fleche(g, [60, 330], [640, 330], C.encre, 4);
        for (var t = -100; t <= 150; t += 50) { var x = 80 + (t + 100) / 250 * 520; D.ligne(g, [x, 322], [x, 338], C.encre, 2); D.texte(g, String(t).replace("-", "−") + " °C", [x, 362], { taille: 15, mono: true, gras: false }); }
        var xa = 80 + 120 / 250 * 520;
        D.ligne(g, [xa, 200], [xa, 420], C.acc, 3, "8 6"); D.texte(g, "ambiante 20 °C", [xa, 186], { taille: 17, coul: C.acc });
        if (n.places) {
          D.texte(g, "élastomères", [(80 + xa) / 2, 250], { taille: 19, coul: C.jeu });
          D.texte(g, "plastomères", [(xa + 600) / 2, 250], { taille: 19, coul: C.jeu });
          [-70, -45, 60, 100].forEach(function (t) { var x = 80 + (t + 100) / 250 * 520; D.rond(g, [x, 330], 11, { fill: C.jeu, stroke: "#fff", ep: 3 }); D.texte(g, "Tv", [x, 300], { taille: 16, coul: C.jeu }); });
        } else D.texte(g, "où tombe chaque Tv ?", [340, 460], { taille: 17, coul: C.doux, gras: false });
      } else {
        // godet de latex qui brunit
        var g0 = g; g = E.s("g", { transform: "translate(340 320) scale(1.6) translate(-340 -340)" }, g0);
        E.s("path", { d: "M250 260 L430 260 L410 420 L270 420 Z", fill: "#8b9bb3", stroke: C.encre, "stroke-width": 3 }, g);
        E.s("ellipse", { cx: 340, cy: 268, rx: 86, ry: 16, fill: "#c9a46a", stroke: C.encre, "stroke-width": 2 }, g);
        D.texte(g, "latex brut", [340, 450], { taille: 15 });
        g = g0;
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Brut ou vulcanisé", jouer: function (j, n) {
      j.fig.astuce("Deux caoutchoucs naturels, de même Tv.");
      j.titre("À 80 °C, l'un des deux caoutchoucs se met à couler. Lequel, et pourquoi ?");
      j.choix([
        { html: "A, car sa courbe reste haute", aide: "Une courbe qui reste sur le plateau ne coule pas. Cherche celle qui chute." },
        { html: "B, il n'est pas réticulé : ses chaînes glissent", juste: true },
        { html: "Aucun, ils ont la même Tv", aide: "La même Tv ne dit rien de l'écoulement. Regarde la droite de la figure." }
      ], { colonnes: 1, ok: function () {
        n.montre = true; n.dessin();
        j.bravo("B est brut : sans pont, il s'écoule.");
        j.expliquer("<p>Pour un caoutchouc non réticulé, le plateau caoutchouteux n'est dû qu'à l'enchevêtrement physique des chaînes. À chaud, elles se désenchevêtrent et le matériau coule. La vulcanisation empêche cet écoulement.</p>");
        j.suite();
      } });
    } },
    { nom: "Placer les Tv", jouer: function (j, n) {
      n.mode = "tv"; n.dessin();
      j.fig.astuce("");
      j.titre("Range ces quatre polymères : élastomère ou plastomère à 20 °C ?");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><b>Élastomère</b><b>Plastomère</b><span class="trou" data-attendu="e"></span><span class="trou" data-attendu="p"></span><span class="trou" data-attendu="e"></span><span class="trou" data-attendu="p"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "p", html: "Tv = 100 °C" }, { id: "e", html: "Tv = −70 °C" }, { id: "p", html: "Tv = 60 °C" }, { id: "e", html: "Tv = −45 °C" }],
        aide: "Compare chaque Tv à 20 °C : en dessous, élastomère ; au-dessus, plastomère.",
        ok: function () {
          n.places = true; n.dessin();
          j.bravo("Tout se joue par rapport à l'ambiante.");
          j.suite();
        }
      });
    } },
    { nom: "Un élastomère halogéné", jouer: function (j, n) {
      j.titre("Tu dois vulcaniser un élastomère halogéné. Quel système choisis-tu ?");
      j.choix([
        { html: "Le soufre", aide: "Le soufre ponte les élastomères insaturés." },
        { html: "Les oxydes métalliques MgO/ZnO", juste: true },
        { html: "Un plastifiant", aide: "Un plastifiant ne crée aucun pont : il fait l'inverse, il écarte les chaînes." }
      ], { colonnes: 1, ok: function () {
        j.bravo("MgO/ZnO : ponts éther.");
        j.suite();
      } });
    } },
    { nom: "L'erreur", jouer: function (j, n) {
      n.mode = "latex"; n.dessin();
      j.fig.astuce("Ce latex est resté une journée à l'air.");
      j.titre("Une étudiante écrit : « Le latex brut fait un bon matériau tel quel : il garde sa souplesse du froid au chaud. » Où est l'erreur ?");
      j.choix([
        { html: "Le latex devient cassant à basse température et fond à température élevée", juste: true },
        { html: "Le latex est un métal", aide: "Il vient d'un arbre : c'est un polymère organique. L'erreur porte sur le comportement en température." },
        { html: "Il n'y a pas d'erreur", aide: "Relis le comportement du latex brut au froid et au chaud." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Brut, il n'est pas prêt à l'emploi.");
        j.expliquer("<p>Le latex est collant au soleil, fond à température élevée, devient cassant à basse température, brunit et coagule à l'air. D'où la formulation et la vulcanisation.</p>");
        j.suite();
      } });
    } },
    { nom: "Le module", jouer: function (j, n) {
      j.titre("Un élastomère a un module de 1 MPa. On lui applique 0,5 MPa. En supposant un comportement linéaire, quelle déformation en % ?");
      j.nombre({ avant: "\\varepsilon =", apres: "\\%", cases: [{ attendu: 50, tol: 0.01 }], ligne: true,
        aide: function () { return "\\(\\varepsilon = \\sigma / E\\), puis multiplie par 100 pour avoir des %."; },
        ok: function () {
          j.bravo("50 % : un plastique de 1 GPa ne bougerait que de 0,05 %.");
          j.expliquer("<p>Même contrainte, mille fois plus de déformation : c'est le faible module \\(E \\approx 1\\) MPa des élastomères qui rend possibles les joints, les pistons de seringue ou les gants.</p>");
          j.suite();
        } });
    } }
  ]
});
