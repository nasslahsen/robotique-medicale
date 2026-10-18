/* Révision du chapitre 3 : TD 1.4 (vrai ou faux), TD 1.3 (polyéthylène), masse moléculaire, taux de cristallinité, familles. */
NIVEAU({
  id: "revision-polymeres",
  init: function (fig) {
    var C = D.C, svg = fig.svg, g = E.s("g", null, svg);
    var n = { cas: "td14" };
    var O = [100, 450], W = 530, H = 310, TMIN = -140, TMAX = 220, LMIN = 2.5, LMAX = 10;
    function px(T) { return O[0] + (T - TMIN) / (TMAX - TMIN) * W; }
    function py(l) { return O[1] - (l - LMIN) / (LMAX - LMIN) * H; }
    n.dessin = function () {
      E.vider(g);
      var o = n.cas === "td14" ? { Tg: -10, Tf: 165, X: 0.9, Tl: Infinity, larg: 6 } : { Tg: -120, Tf: 130, X: 0.7, Tl: Infinity, larg: 6, verre: 9.4 };
      D.fleche(g, O, [O[0] + W + 20, O[1]], C.encre, 3); D.fleche(g, O, [O[0], O[1] - H - 30], C.encre, 3);
      D.texte(g, "log Er (Pa)", [O[0] + 10, O[1] - H - 34], { ancre: "start", taille: 17 });
      D.texte(g, "T (°C)", [O[0] + W + 4, O[1] + 34], { taille: 17 });
      [3, 6, 9].forEach(function (l) { D.ligne(g, [O[0] - 8, py(l)], [O[0], py(l)], C.encre, 2); D.texte(g, String(l), [O[0] - 22, py(l)], { taille: 15, mono: true, gras: false }); });
      [[o.Tg, "Tg"], [o.Tf, "Tf"]].forEach(function (t) { D.ligne(g, [px(t[0]), py(LMAX)], [px(t[0]), O[1]], C.gris, 2, "5 5"); D.texte(g, t[1] + " = " + String(t[0]).replace("-", "−") + " °C", [px(t[0]), O[1] + 26], { taille: 15 }); });
      if (n.cas === "pe") { D.ligne(g, [px(20), py(LMAX)], [px(20), O[1]], D.C.acc, 2.5, "6 5"); D.texte(g, "20 °C", [px(20) + 6, py(LMAX) + 6], { ancre: "start", taille: 15, coul: D.C.acc }); }
      var pts = [];
      for (var T = TMIN; T <= TMAX; T += 2) pts.push([px(T), py(BIO.logModule(T, o))]);
      E.s("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: C.jeu, "stroke-width": 5, "stroke-linejoin": "round" }, g);
      fig.chip(n.cas === "td14" ? "X = 0,9 à 25 °C" : "polyéthylène");
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Vrai ou faux", jouer: function (j, n) {
      j.fig.astuce("TD, application 1.4 : Tg = −10 °C, Tf = 165 °C, X = 0,9 à 25 °C.");
      j.titre("Vrai ou faux ?");
      var L = [["À −10 °C, le polymère devient transparent.", "f"], ["À 30 °C, il est transparent.", "f"], ["À 180 °C, il est transparent.", "v"], ["De −20 à 20 °C, son module baisse un peu parce que X a baissé.", "f"], ["De 20 à 180 °C, son module passe de 10⁹ à 10⁶ Pa parce que X est passé à 0.", "v"]];
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:6px 10px;align-items:center;font-size:16px">' + L.map(function (l) { return "<span>" + l[0] + '</span><span class="trou" data-attendu="' + l[1] + '" style="min-height:48px"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "v", html: "vrai" }, { id: "f", html: "faux" }, { id: "f", html: "faux" }, { id: "v", html: "vrai" }, { id: "f", html: "faux" }],
        aide: "Transparent seulement sans cristaux, donc au-dessus de Tf. À Tg, c'est la phase amorphe qui ramollit : X ne change pas.",
        ok: function () {
          j.bravo("Faux, faux, vrai, faux, vrai.");
          j.expliquer("<p>Passer Tg ramollit la phase amorphe sans toucher aux cristaux. La grande chute du module (10⁹ → 10⁶ Pa) n'arrive qu'à Tf, quand la phase cristalline fond.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Le polyéthylène", jouer: function (j, n) {
      n.cas = "pe"; n.dessin();
      j.fig.astuce("Courbe qualitative d'un polyéthylène semi-cristallin.");
      j.titre("TD 1.3 : le polyéthylène a un module de 0,1 à 1 GPa. Quelle caractéristique l'empêche d'être caoutchouteux (environ 1 MPa) à température ambiante ?");
      j.choix([
        { html: "Sa Tg de −120 °C", aide: "Au contraire : avec Tg = −120 °C, sa phase amorphe est déjà caoutchouteuse à 20 °C. Ce n'est pas ce qui le rend rigide." },
        { html: "Son taux de cristallinité élevé", juste: true },
        { html: "Sa masse moléculaire élevée", aide: "Une grande masse retarde l'écoulement, mais un amorphe de grande masse reste sur le plateau à 1 MPa." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Les cristaux maintiennent le module jusqu'à Tf.");
        j.suite();
      } });
    } },
    { nom: "La masse infinie", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Trois polymères amorphes identiques, sauf leur masse moléculaire : M₁ < M₂, et M₃ → ∞. Lequel n'atteint jamais l'état liquide ?");
      j.choix([{ html: "M₁", aide: "La plus petite masse coule le plus tôt." }, { html: "M₂", aide: "Plus grande masse : l'écoulement arrive plus tard, mais il arrive." }, { html: "M₃", juste: true }], { ok: function () {
        j.bravo("Masse infinie : jamais liquide.");
        j.suite();
      } });
    } },
    { nom: "Retrouver X", jouer: function (j, n) {
      j.titre("Le nylon du devoir : ρa = 1,07, ρc = 1,19 et ρ = 1,11 g/cm³. Retrouve son taux de cristallinité.");
      j.nombre({ avant: "X =", cases: [{ attendu: BIO.tauxCristallinite(1.11, 1.07, 1.19), tol: 0.01 }], ligne: true,
        aide: function () { return "X = (ρ − ρa) / (ρc − ρa)."; },
        ok: function () {
          j.bravo("X ≈ 0,33 : on retombe sur la donnée du devoir.");
          j.suite();
        } });
    } },
    { nom: "Recycler", jouer: function (j, n) {
      j.titre("Un hôpital veut refondre ses déchets plastiques pour mouler de nouvelles pièces. Lesquels se prêtent à la refonte ?");
      j.choix([
        { html: "Les thermoplastiques (PE, PS, PC)", juste: true },
        { html: "Les thermodurcissables (époxy, phénolique)", aide: "Une fois durcis, ils ne se reforment plus : ils se dégradent à la chauffe, comme un œuf cuit." },
        { html: "Tous les plastiques", aide: "Pense à la différence entre l'œuf en chocolat et l'œuf cuit." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Seuls les thermoplastiques se ramollissent à nouveau.");
        j.suite();
      } });
    } }
  ]
});
