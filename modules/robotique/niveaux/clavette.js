/* Niveau : la clavette. Plan cisaillé, F_t = 2C/d, τ ≃ F_t/(bL), viser une contrainte, ce que le calcul simple ne dit pas, cas nouveau. */
NIVEAU({
  id: "clavette",
  init: function (fig) {
    var C = D.C, M = MECA, g = E.s("g", null, fig.svg);
    var n = { C: 8, d: 12, b: 4, L: 20, plans: false, ft: false, aire: false, choisi: null };
    var O = [190, 330], GR = "#5b6172";
    n.dessin = function () {
      E.vider(g);
      var rA = 90, rM = 155, kb = n.b / n.d * 2 * rA; // clavette carrée, côté b, à l'échelle de l'arbre
      // coupe perpendiculaire à l'axe : moyeu (anneau) puis arbre
      E.s("circle", { cx: O[0], cy: O[1], r: rM, fill: M.hachures(g, GR, { fond: "#fff", angle: -45 }), stroke: C.encre, "stroke-width": 2.5 }, g);
      E.s("circle", { cx: O[0], cy: O[1], r: rA, fill: M.hachures(g, GR, { fond: "#fff", angle: 45, pas: 12 }), stroke: C.encre, "stroke-width": 2.5 }, g);
      var yJ = O[1] - rA; // plan de joint arbre / moyeu, en haut
      E.s("rect", { x: O[0] - kb / 2, y: yJ - kb / 2, width: kb, height: kb, fill: n.choisi === "b" ? "#d5f2e5" : "#ffe9c7", stroke: C.encre, "stroke-width": 2.5 }, g);
      D.texte(g, "clavette", [O[0] + kb / 2 + 10, yJ - kb / 2 - 14], { taille: 16, coul: C.doux, gras: false, ancre: "start" });
      D.texte(g, "arbre", [O[0], O[1] + 30], { taille: 18, coul: C.doux, gras: false });
      D.texte(g, "moyeu", [O[0], O[1] + rM + 24], { taille: 18, coul: C.doux, gras: false });
      if (n.plans) {
        [["c", yJ - kb / 2], ["b", yJ], ["a", yJ + kb / 2]].forEach(function (p) {
          var coul = n.choisi === p[0] ? (p[0] === "b" ? C.ok : C.ko) : C.acc;
          D.ligne(g, [O[0] - kb / 2 - 34, p[1]], [O[0] + kb / 2 + 34, p[1]], coul, 4, "8 6");
          D.texte(g, p[0], [O[0] - kb / 2 - 50, p[1]], { coul: coul, taille: 22 });
        });
      }
      // couple : arc autour de l'arbre
      var r = rA + 32, a0 = 200 * Math.PI / 180, a1 = 330 * Math.PI / 180, pts = [];
      for (var t = a0; t <= a1; t += 0.05) pts.push([O[0] + r * Math.cos(t), O[1] - r * Math.sin(t)]);
      E.s("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: C.jeu, "stroke-width": 5 }, g);
      D.fleche(g, pts[pts.length - 2], [O[0] + r * Math.cos(a1 + 0.12), O[1] - r * Math.sin(a1 + 0.12)], C.jeu, 5);
      D.texte(g, "C", [O[0] + r * Math.cos(a1) + 26, O[1] - r * Math.sin(a1) + 18], { coul: C.jeu, taille: 24 });
      if (n.ft) {
        D.fleche(g, [O[0] - 110, yJ], [O[0] - kb / 2 - 2, yJ], C.v, 6);
        D.texte(g, "Ft", [O[0] - 120, yJ - 22], { coul: C.v, taille: 22 });
        D.ligne(g, [O[0] + 4, O[1]], [O[0] + 4, yJ], C.v, 2, "5 4");
        D.texte(g, "d/2", [O[0] + 30, O[1] - rA / 2], { coul: C.v, taille: 18 });
      }
      // vue de dessus de la clavette : b × L, aire cisaillée
      var s = 7, w = n.L * s, h = n.b * s * 2, cx = 500, cy = 330;
      D.texte(g, "clavette vue de dessus", [cx, 150], { taille: 17, coul: C.doux, gras: false });
      E.s("rect", { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: h / 2, fill: n.aire ? PLATEFORME.teinte(0.25) : "#ffe9c7", stroke: C.encre, "stroke-width": 2.5 }, g);
      D.ligne(g, [cx - w / 2, cy + h / 2 + 22], [cx + w / 2, cy + h / 2 + 22], C.encre, 2);
      D.texte(g, "L = " + E.fmt(n.L, 0) + " mm", [cx, cy + h / 2 + 46], { taille: 19 });
      D.texte(g, "b = " + E.fmt(n.b, 0) + " mm", [cx, cy], { taille: 17 });
      if (n.aire) D.texte(g, "aire cisaillée b × L", [cx, cy - h / 2 - 24], { taille: 17, coul: C.jeu });
      fig.chip("C = " + E.fmt(n.C, 0) + " N·m · d = " + E.fmt(n.d, 0) + " mm");
      if (n.tau) fig.bande("<b>τ</b> ≃ " + E.fmt(1000 * 2 * n.C / n.d / (n.b * n.L), 1) + " MPa"); else fig.bande(null);
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Où ça casse ?", jouer: function (j, n) {
      n.plans = true; n.dessin();
      j.fig.astuce("Coupe de l'arbre et du moyeu : la clavette est à cheval dans les deux rainures.");
      j.titre("La roue entraîne l'arbre par la clavette. Si la clavette cède, dans quel plan est-elle coupée ?");
      var opts = [["a", "a : au fond de la rainure de l'arbre", "Sous ce plan, la clavette et l'arbre bougent ensemble."], ["b", "b : au plan de joint arbre / moyeu", null], ["c", "c : au fond de la rainure du moyeu", "Au-dessus de ce plan, la clavette et le moyeu bougent ensemble."]];
      j.choix(opts.map(function (o) { return { html: o[1], juste: !o[2], aide: o[2] ? o[2] + " Cherche l'endroit où les deux pièces glissent l'une sur l'autre." : null }; }), { colonnes: 1, ok: function () {
        n.choisi = "b"; n.dessin();
        j.bravo("Au plan de joint : le moyeu y glisse sur l'arbre.");
        j.expliquer("<p>La clavette transmet un couple entre deux pièces mises en position par une liaison cylindre-cylindre. Elle loge dans une rainure de l'arbre et dans une rainure débouchante du moyeu. Elle est sollicitée en <b>cisaillement</b> dans le plan de joint.</p>");
        j.suite();
      } });
    } },
    { nom: "Force tangentielle", jouer: function (j, n) {
      n.plans = false; n.choisi = null; n.ft = true; n.dessin();
      j.fig.astuce("Le couple C devient une force Ft appliquée au rayon d/2.");
      j.titre("C = 8 N·m sur un arbre de d = 12 mm. Quelle force tangentielle \\(F_t\\) sur la clavette ?");
      j.nombre({ avant: "F_t =", apres: "\\text{N}", cases: [{ attendu: 1333.3, tol: 2 }], ligne: true,
        aide: function () { return "Le couple vaut \\(F_t \\times d/2\\). Mets \\(d\\) en mètres."; },
        ok: function () {
          j.bravo("Environ 1333 N, soit 1,33 kN.");
          j.expliquer("\\[ F_t = \\frac{2C}{d} = \\frac{2 \\times 8}{0{,}012} \\approx 1{,}33 \\text{ kN} \\]");
          j.suite();
        } });
    } },
    { nom: "Contrainte", jouer: function (j, n) {
      n.aire = true; n.dessin();
      j.fig.astuce("La force se répartit sur la section cisaillée, b × L.");
      j.titre("La clavette a b = 4 mm et L = 20 mm. Quelle contrainte moyenne de cisaillement τ ?");
      j.nombre({ avant: "\\tau \\simeq", apres: "\\text{MPa}", cases: [{ attendu: 16.67, tol: 0.1 }], ligne: true,
        aide: function () { return "\\(\\tau \\simeq F_t / (bL)\\). Avec \\(F_t\\) en N et \\(b, L\\) en mm, le résultat est en N/mm², c'est-à-dire en MPa."; },
        ok: function () {
          j.bravo("16,7 MPa.");
          j.expliquer("\\[ \\tau \\simeq \\frac{F_t}{bL} = \\frac{1333}{4 \\times 20} = 16{,}7 \\text{ MPa} \\]<p>Rappel : 1 MPa = 1 N/mm². Pour un acier de type C45, très utilisé pour les clavettes, la limite élastique en cisaillement est d'environ 200 MPa.</p>");
          j.suite();
        } });
    } },
    { nom: "Vise τ", jouer: function (j, n) {
      n.tau = true; n.dessin();
      j.fig.astuce("Bouge L et lis τ sous la figure.");
      j.titre("On veut deux fois moins de contrainte dans la clavette, sans toucher à b. Règle sa longueur.");
      var fini = false;
      function tester(v) {
        if (fini) return;
        n.L = v; n.dessin();
        if (v === 40) {
          fini = true; c.input.disabled = true;
          j.bravo("L = 40 mm : τ ≃ 8,3 MPa, la moitié.");
          j.expliquer("<p>\\(\\tau\\) est inversement proportionnelle à l'aire \\(bL\\) : doubler la longueur utile divise la contrainte par deux.</p>");
          j.suite();
        }
      }
      var c = j.curseur({ nom: "L", min: 10, max: 40, pas: 1, val: 20, unite: " mm", change: tester });
      j.reponse(function () { c.regler(40); tester(40); });
    } },
    { nom: "Pourquoi ?", jouer: function (j, n) {
      n.L = 20; n.dessin();
      j.titre("16,7 MPa contre environ 200 MPa pour un acier C45 : peut-on s'arrêter là ?");
      j.choix([
        { html: "Non : il faut aussi vérifier le matage, les dimensions normalisées, les concentrations de contraintes et le cycle de charge", juste: true },
        { html: "Oui : la contrainte est 12 fois plus faible que la limite", aide: "τ est une contrainte moyenne, estimée simplement. Le cours cite d'autres vérifications." },
        { html: "Non : il faut refaire le calcul avec le diamètre extérieur du moyeu", aide: "La force se calcule bien au rayon de l'arbre, d/2." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Le calcul simple n'est qu'une estimation.");
        j.expliquer("<p>Le matage, c'est l'écrasement des flancs de la clavette contre les rainures. Les dimensions de la clavette et des rainures sont normalisées selon le diamètre de l'arbre. Les bouts d'arbres normalisés ont aussi leurs tolérances : j6 pour \\(d \\le 30\\) mm, k6 pour \\(d \\ge 32\\) mm.</p>");
        j.suite();
      } });
    } },
    { nom: "Nouveau cas", jouer: function (j, n) {
      n.C = 15; n.d = 20; n.b = 6; n.L = 16; n.tau = false; n.dessin();
      j.fig.astuce("Exemple ajouté : l'articulation d'un robot de rééducation.");
      j.titre("C = 15 N·m, d = 20 mm, clavette b = 6 mm, L = 16 mm. Calcule \\(F_t\\) puis \\(\\tau\\).");
      j.nombre({ avant: "F_t,\\ \\tau :", cases: [{ attendu: 1500, tol: 2 }, { attendu: 15.625, tol: 0.1 }], ligne: true,
        aide: function (k) { return k === 0 ? "\\(F_t = 2C/d\\), \\(d\\) en mètres." : "\\(\\tau \\simeq F_t / (bL)\\), en MPa."; },
        ok: function () {
          n.tau = true; n.dessin();
          j.bravo("1500 N et environ 15,6 MPa.");
          j.suite();
        } });
    } }
  ]
});
