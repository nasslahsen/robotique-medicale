/* Boss du chapitre 4 : concevoir le joint du piston d'une seringue (choix du polymère, formulation, taux de soufre, cuisson, argument). */
NIVEAU({
  id: "boss-elastomeres",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { mode: "seringue", fiche: {} };
    n.courbe = function (T, s) { return s === 0 ? BIO.logModule(T, { Tg: -60, Tl: 30 }) : BIO.logModule(T, { Tg: -60 + 3.4 * s, caout: 6 + 0.025 * s, Tl: Infinity }); };
    var X0 = 100, X1 = 620, Y0 = 430, Y1 = 130;
    function px(T) { return X0 + (T + 120) / 270 * (X1 - X0); }
    function py(l) { return Y0 - (l - 3) / 7 * (Y0 - Y1); }
    var b = fig.bande("");
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "seringue") {
        // corps de seringue, piston et joint en élastomère
        E.s("rect", { x: 120, y: 230, width: 360, height: 110, rx: 10, fill: "#eef6fb", stroke: C.encre, "stroke-width": 3 }, g);
        E.s("path", { d: "M480 265 L560 275 L560 295 L480 305 Z", fill: "#eef6fb", stroke: C.encre, "stroke-width": 3 }, g);
        D.ligne(g, [560, 285], [640, 285], C.encre, 3);
        E.s("rect", { x: 300, y: 236, width: 44, height: 98, rx: 8, fill: C.jeu, stroke: C.encre, "stroke-width": 2.5 }, g);
        E.s("rect", { x: 60, y: 272, width: 240, height: 26, fill: "#d6dbe6", stroke: C.encre, "stroke-width": 2.5 }, g);
        E.s("rect", { x: 40, y: 220, width: 22, height: 130, rx: 6, fill: "#d6dbe6", stroke: C.encre, "stroke-width": 2.5 }, g);
        D.texte(g, "joint du piston", [322, 196], { taille: 18, coul: C.jeu });
        D.ligne(g, [322, 206], [322, 232], C.jeu, 2.5);
        for (var k = 1; k <= 5; k++) D.ligne(g, [140 + k * 55, 230], [140 + k * 55, 250], C.gris, 2);
      } else {
        D.fleche(g, [X0, Y0], [X1 + 20, Y0], C.encre, 3); D.fleche(g, [X0, Y0], [X0, Y1 - 30], C.encre, 3);
        D.texte(g, "T (°C)", [X1 + 4, Y0 + 34], { taille: 16 }); D.texte(g, "log G (Pa)", [X0 + 8, Y1 - 44], { taille: 16, ancre: "start" });
        [-100, -50, 0, 50, 100].forEach(function (t) { D.ligne(g, [px(t), Y0], [px(t), Y0 + 8], C.encre, 2); D.texte(g, String(t).replace("-", "−"), [px(t), Y0 + 24], { taille: 15, gras: false, mono: true }); });
        [0, 2, 10, 30].forEach(function (s) {
          var pts = []; for (var T = -120; T <= 140; T += 2) pts.push([px(T), py(n.courbe(T, s))]);
          var fort = n.fiche.s === s;
          E.s("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: fort ? C.jeu : PLATEFORME.teinte(0.5), "stroke-width": fort ? 6 : 3.5 }, g);
          var Tl = s === 0 ? 20 : Math.min(120, -60 + 3.4 * s + 70);
          D.texte(g, s + " %", [px(Tl), py(n.courbe(Tl, s)) - 18], { taille: 16, coul: C.jeu });
        });
        D.ligne(g, [px(20), Y1], [px(20), Y0], C.acc, 3, "8 6");
        D.texte(g, "20 °C", [px(20) + 8, Y1 + 6], { taille: 16, coul: C.acc, ancre: "start" });
      }
      var f = n.fiche, champ = function (k, v) { return "\\text{" + k + "} : " + (v || "\\,?\\,"); };
      E.k(b, champ("polymère", f.poly) + " \\quad " + champ("formule", f.formule) + " \\quad " + champ("soufre", f.s === undefined ? "" : f.s + "\\,\\%") + " \\quad " + champ("cuisson", f.cuisson));
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Le polymère", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Le joint du piston doit s'écraser contre le corps de la seringue puis reprendre sa forme, à 20 °C. Polymère A : Tv = 95 °C. Polymère B : Tv = −60 °C. Lequel ?");
      j.consigne("Boss : chaque erreur compte.");
      j.choix([{ html: "A", aide: "À 20 °C, A est sous sa Tv : vitreux, module de l'ordre du GPa, aucune grande déformation réversible." }, { html: "B", juste: true }], { ok: function () {
        n.fiche.poly = "B"; n.dessin();
        j.bravo("B : Tv sous l'ambiante, c'est un élastomère.");
        j.suite();
      } });
    } },
    { nom: "La formule", jouer: function (j, n) {
      j.titre("Formule le mélange de B. Associe chaque besoin à l'ingrédient qui y répond.");
      var L = [["Relier les chaînes (B est insaturé)", "s"], ["Vulcaniser plus vite", "a"], ["Rigidifier sans changer Tg", "n"], ["Résister au dioxygène et à l'ozone", "o"]];
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:8px 10px;align-items:center">' + L.map(function (l) { return "<span>" + l[0] + '</span><span class="trou" data-attendu="' + l[1] + '" style="min-width:170px"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "n", html: "noir de carbone" }, { id: "o", html: "antioxydant" }, { id: "p", html: "plastifiant" }, { id: "s", html: "soufre" }, { id: "a", html: "accélérateur" }],
        aide: "Le plastifiant assouplit : il ne répond à aucun de ces besoins. Le noir de carbone renforce sans toucher Tg.",
        ok: function () {
          n.fiche.formule = "\\checkmark"; n.dessin();
          j.bravo("Soufre, accélérateur, noir de carbone, antioxydant.");
          j.suite();
        }
      });
    } },
    { nom: "Le taux de soufre", jouer: function (j, n) {
      n.mode = "courbes"; n.dessin();
      j.titre("Le joint doit rester sur son plateau caoutchouteux à 20 °C, le plus rigide possible. Quel taux de soufre ?");
      j.choix([
        { html: "0 %", aide: "Sans pont, le joint coulera à chaud, et son module est le plus faible." },
        { html: "2 %", aide: "Possible, mais une autre courbe est encore caoutchouteuse à 20 °C avec un module plus haut." },
        { html: "10 %", juste: true },
        { html: "30 %", aide: "À 20 °C, la courbe 30 % n'a pas encore chuté : le joint serait vitreux." }
      ], { colonnes: 4, ok: function () {
        n.fiche.s = 10; n.dessin();
        j.bravo("10 % : plateau caoutchouteux à 20 °C, module plus haut qu'à 2 %.");
        j.expliquer("<p>Plus de soufre élève \\(T_g\\) et le module. Trop de soufre fait passer \\(T_g\\) au-dessus de l'ambiante : le caoutchouc devient dur.</p>");
        j.suite();
      } });
    } },
    { nom: "La cuisson", jouer: function (j, n) {
      j.titre("B est à base de caoutchouc naturel. Après le maximum du module, la cuisson continue beaucoup trop longtemps. Que risques-tu ?");
      j.choix([
        { html: "Une baisse du module : la réversion", juste: true },
        { html: "Une hausse continue du module", aide: "Après le temps de plateau, le module ne monte plus." },
        { html: "La fusion du joint", aide: "Un réseau réticulé ne fond pas. Le cours nomme une diminution du module, sensible avec le caoutchouc naturel." }
      ], { colonnes: 1, ok: function () {
        n.fiche.cuisson = "\\text{plateau}"; n.dessin();
        j.bravo("Réversion : on arrête la cuisson pendant le plateau.");
        j.suite();
      } });
    } },
    { nom: "L'argument", jouer: function (j, n) {
      n.mode = "seringue"; n.dessin();
      j.titre("Un collègue propose du polystyrène, « plus rigide, donc plus solide ». Pourquoi refuses-tu ?");
      j.choix([
        { html: "Tv ≈ 100 °C : à 20 °C il est vitreux, son module est mille fois trop élevé pour s'écraser et revenir", juste: true },
        { html: "Le polystyrène n'est pas un polymère", aide: "C'en est un : un plastomère. L'argument doit porter sur Tv et le module." },
        { html: "Le polystyrène coule à 20 °C", aide: "Il est au contraire vitreux et rigide à 20 °C." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Joint conçu.");
        j.expliquer("<p>Toute la chaîne du chapitre : élastomère car \\(T_v\\) sous l'ambiante, formulation pour l'application, vulcanisation au bon taux, cuisson arrêtée avant la réversion.</p>");
        j.suite();
      } });
    } }
  ]
});
