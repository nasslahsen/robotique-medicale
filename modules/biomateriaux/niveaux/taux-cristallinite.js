/* Niveau : taux de cristallinité. Formule de la densité, plaque du TD 1.1 (masse, chauffe à 150 °C et à 250 °C), nylon du devoir, coquille de la solution. */
NIVEAU({
  id: "taux-cristallinite",
  init: function (fig) {
    var C = D.C, svg = fig.svg, g = E.s("g", null, svg);
    var n = { X: 0.5, ep: 1, etat: "ambiante" };
    var RA = 1, RC = 1.2;
    n.dessin = function () {
      E.vider(g);
      // plaque en perspective : 10 cm × 10 cm, épaisseur exagérée
      var x0 = 90, y0 = 320, L = 380, P = 170, h = 56 * n.ep;
      var dessus = [[x0, y0], [x0 + L, y0], [x0 + L + P, y0 - P * 0.55], [x0 + P, y0 - P * 0.55]];
      E.s("polygon", { points: [[x0, y0], [x0 + L, y0], [x0 + L, y0 + h], [x0, y0 + h]].map(function (p) { return p.join(","); }).join(" "), fill: "#e9eaf0", stroke: C.encre, "stroke-width": 2.5 }, g);
      E.s("polygon", { points: [[x0 + L, y0], [x0 + L + P, y0 - P * 0.55], [x0 + L + P, y0 - P * 0.55 + h], [x0 + L, y0 + h]].map(function (p) { return p.join(","); }).join(" "), fill: "#d7d9e2", stroke: C.encre, "stroke-width": 2.5 }, g);
      E.s("polygon", { points: dessus.map(function (p) { return p.join(","); }).join(" "), fill: "#f6f6fa", stroke: C.encre, "stroke-width": 2.5 }, g);
      // cristallites sur le dessus : une proportion X des cases
      var r = BIO.hasard(5), N = 8;
      for (var i = 0; i < N; i++) for (var k = 0; k < 4; k++) {
        if (r() > n.X) continue;
        var u = (i + 0.2) / N, v = (k + 0.2) / 4, du = 0.6 / N, dv = 0.6 / 4;
        var f = function (a, b) { return [x0 + a * L + b * P, y0 - b * P * 0.55]; };
        E.s("polygon", { points: [f(u, v), f(u + du, v), f(u + du, v + dv), f(u, v + dv)].map(function (p) { return p.join(","); }).join(" "), fill: PLATEFORME.teinte(0.55) }, g);
      }
      D.texte(g, "10 cm", [x0 + L / 2, y0 + h + 24], { taille: 16 });
      D.texte(g, "10 cm", [x0 + L + P / 2 + 30, y0 - P * 0.3 + h / 2], { taille: 16, ancre: "start" });
      D.texte(g, "0,1 cm", [x0 + 6, y0 + h / 2], { taille: 15, ancre: "start" });
      D.texte(g, "V = " + (n.ep > 1 ? "11" : "10") + " cm³", [x0 + L / 2, y0 + h + 60], { taille: 22, coul: D.C.jeu });
      // légende
      E.s("rect", { x: 130, y: 500, width: 24, height: 24, rx: 4, fill: PLATEFORME.teinte(0.55) }, g);
      D.texte(g, "phase cristalline (ρc = 1,2 g/cm³)", [164, 512], { ancre: "start", taille: 16 });
      E.s("rect", { x: 130, y: 540, width: 24, height: 24, rx: 4, fill: "#f6f6fa", stroke: C.encre, "stroke-width": 1.5 }, g);
      D.texte(g, "phase amorphe (ρa = 1 g/cm³)", [164, 552], { ancre: "start", taille: 16 });
      fig.chip("X = " + E.fmt(n.X, 1) + " · " + n.etat);
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "La formule", jouer: function (j, n) {
      j.fig.astuce("Plaque du TD 1.1 : Tg = 100 °C, Tf = 200 °C, masse moléculaire extrêmement élevée.");
      j.titre("Chaque phase occupe sa part du volume. Construis la densité du polymère semi-cristallin.");
      var z = j.zone("", '<div style="display:flex;align-items:center;gap:6px;font-size:22px;flex-wrap:wrap">\\(\\rho =\\)<span class="trou" data-attendu="c"></span>\\(\\times X +\\)<span class="trou" data-attendu="a"></span>\\(\\times\\)<span class="trou" data-attendu="u" style="min-width:110px"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "a", tex: "\\rho_a" }, { id: "u", tex: "(1 - X)" }, { id: "c", tex: "\\rho_c" }, { id: "x", tex: "X" }],
        aide: "La fraction X est cristalline (densité ρc), le reste, 1 − X, est amorphe (densité ρa).",
        ok: function () {
          j.bravo("\\(\\rho = \\rho_c X + \\rho_a (1 - X)\\)");
          j.expliquer("<p>Le <b>taux de cristallinité</b> X est la fraction du polymère à l'état cristallin. On le mesure par la densité : \\(X = \\dfrac{\\rho - \\rho_a}{\\rho_c - \\rho_a}\\).</p>");
          j.suite();
        }
      });
    } },
    { nom: "La masse de la plaque", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("La plaque de 10 cm × 10 cm × 0,1 cm est moulée avec X = 50 %. Calcule sa densité, puis sa masse.");
      j.nombre({ avant: "\\rho,\\ m =", cases: [{ attendu: BIO.densiteSemiCristallin(1.2, 1, 0.5), tol: 0.001 }, { attendu: BIO.densiteSemiCristallin(1.2, 1, 0.5) * 10, tol: 0.01 }], ligne: true, apres: "\\text{g/cm}^3,\\ \\text{g}",
        aide: function (k) { return k === 0 ? "ρ = 1,2 × 0,5 + 1 × 0,5." : "m = ρ × V, avec V = 10 × 10 × 0,1 = 10 cm³."; },
        ok: function () {
          j.bravo("ρ = 1,1 g/cm³ et m = 11 g.");
          j.suite();
        } });
    } },
    { nom: "Chauffée à 150 °C", jouer: function (j, n) {
      n.etat = "après 150 °C"; n.dessin();
      j.titre("Prédis : on chauffe la plaque à 150 °C puis on la refroidit instantanément. Son volume ?");
      j.choix([
        { html: "Il reste 10 cm³", juste: true },
        { html: "Il passe à 11 cm³", aide: "150 °C est entre Tg et Tf : les cristaux n'ont pas fondu." },
        { html: "Il passe à 9 cm³", aide: "Rien ne cristallise de plus en refroidissant d'un coup." }
      ], { ok: function () {
        j.bravo("En dessous de Tf, l'état de phase ne change pas : 10 cm³.");
        j.suite();
      } });
    } },
    { nom: "Chauffée à 250 °C", jouer: function (j, n) {
      j.titre("Cette fois on chauffe à 250 °C, au-delà de Tf, puis on trempe d'un coup. La masse reste 11 g. Quel est le volume ?");
      j.nombre({ avant: "V =", apres: "\\text{cm}^3", cases: [{ attendu: 11 / 1, tol: 0.01 }], ligne: true,
        aide: function () { return "Les cristaux ont fondu et la trempe les empêche de se reformer : X = 0, donc ρ = ρa = 1 g/cm³. V = m / ρ."; },
        ok: function () {
          n.X = 0; n.ep = 1.1; n.etat = "après 250 °C, trempée"; n.dessin();
          j.bravo("X = 0, ρ = 1 g/cm³, V = 11 cm³.");
          j.expliquer("<p>Au-delà de Tf, le polymère cristallin fond. En refroidissant instantanément, on l'empêche de cristalliser : il devient amorphe, moins dense, et la plaque gonfle de 10 %.</p>");
          j.suite();
        } });
    } },
    { nom: "Le nylon", jouer: function (j, n) {
      j.titre("Devoir : un nylon de taux de cristallinité X = 0,33 a une densité de 1,11 g/cm³. Sa phase amorphe a ρa = 1,07 g/cm³. Densité du nylon 100 % cristallin ?");
      j.nombre({ avant: "\\rho_c =", apres: "\\text{g/cm}^3", cases: [{ attendu: Math.round(BIO.densiteCristalline(1.11, 1.07, 0.33) * 100) / 100, tol: 0.006 }], ligne: true,
        aide: function () { return "Isole ρc dans 1,11 = ρc × 0,33 + (1 − 0,33) × 1,07."; },
        ok: function () {
          j.bravo("ρc ≈ 1,19 g/cm³.");
          j.expliquer("<p>\\(\\rho_c = \\dfrac{1{,}11 - 0{,}67 \\times 1{,}07}{0{,}33} \\approx 1{,}19\\ \\text{g/cm}^3\\).</p>");
          j.suite();
        } });
    } },
    { nom: "Trouve l'erreur", jouer: function (j, n) {
      j.titre("Une copie écrit : \\(X = \\dfrac{\\rho - \\rho_a}{\\rho - \\rho_c}\\). Teste-la avec un polymère 100 % cristallin (ρ = ρc). Qu'est-ce qui cloche ?");
      j.choix([
        { html: "Le dénominateur doit être \\(\\rho_c - \\rho_a\\) : sinon X ne vaut pas 1 quand ρ = ρc", juste: true },
        { html: "Rien, la formule est juste", aide: "Teste ρ = ρc : le dénominateur s'annule. Une formule de fraction doit donner X = 1 dans ce cas." },
        { html: "Le numérateur doit être \\(\\rho_c - \\rho\\)", aide: "Avec ρ = ρa, il faut X = 0 : le numérateur ρ − ρa est bon." }
      ], { colonnes: 1, ok: function () {
        j.bravo("\\(X = \\dfrac{\\rho - \\rho_a}{\\rho_c - \\rho_a}\\).");
        j.expliquer("<p>La solution du TD contient cette coquille ; la formule du cours, \\(X = (\\rho - \\rho_a)/(\\rho_c - \\rho_a)\\), donne bien 0 pour ρ = ρa et 1 pour ρ = ρc.</p>");
        j.suite();
      } });
    } }
  ]
});
