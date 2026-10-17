/* Niveau : contrainte σ = F/S0, déformation ε = Δl/l0, module E = σ/ε, sur une éprouvette de traction. */
NIVEAU({
  id: "contrainte-deformation",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { F: 0, S: 20, dl: 0, deux: false, libre: true, surDl: null };
    // éprouvette horizontale : longueur utile l0 dessinée sur 300 px, allongement exagéré (×600)
    function eprouvette(y, ep, F, dl, nom) {
      var x0 = 150, L = 300 + dl * 600, h = ep;
      // mors
      E.s("rect", { x: 40, y: y - 62, width: 80, height: 124, rx: 10, fill: "#c6cbd8", stroke: C.encre, "stroke-width": 2 }, g);
      E.s("rect", { x: x0 + L + 30, y: y - 62, width: 80, height: 124, rx: 10, fill: "#c6cbd8", stroke: C.encre, "stroke-width": 2 }, g);
      // têtes et partie utile
      E.s("rect", { x: 100, y: y - 48, width: 60, height: 96, rx: 6, fill: "#b9c0cc", stroke: C.encre, "stroke-width": 2 }, g);
      E.s("rect", { x: x0 + L + 20, y: y - 48, width: 60, height: 96, rx: 6, fill: "#b9c0cc", stroke: C.encre, "stroke-width": 2 }, g);
      E.s("rect", { x: x0, y: y - h / 2, width: L + 20, height: h, fill: "#d5dae3", stroke: C.encre, "stroke-width": 2 }, g);
      // repères de la longueur utile l0
      D.ligne(g, [x0 + 10, y - h / 2 - 14], [x0 + 10, y + h / 2 + 14], C.jeu, 3);
      D.ligne(g, [x0 + 10 + L, y - h / 2 - 14], [x0 + 10 + L, y + h / 2 + 14], C.jeu, 3);
      if (nom) D.texte(g, nom, [x0 + 10 + L / 2, y - h / 2 - 34], { taille: 20, coul: C.doux });
      if (F > 0) {
        D.fleche(g, [x0 + L + 110, y], [x0 + L + 180, y], "#3b5bdb", 7);
        D.fleche(g, [40, y], [6, y], "#3b5bdb", 7);
        D.texte(g, "F", [x0 + L + 150, y - 30], { coul: "#3b5bdb", taille: 26 });
      }
    }
    n.dessin = function () {
      E.vider(g);
      if (n.deux) {
        eprouvette(190, 36, 10, 0, "section S0");
        eprouvette(410, 72, 10, 0, "section 2 S0");
        fig.chip(null);
      } else {
        eprouvette(340, n.S * 2.6, n.F, n.dl / 100, null);
        var xF = 160 + 300 + n.dl / 100 * 600;
        D.ligne(g, [160, 432], [xF, 432], C.jeu, 3);
        D.ligne(g, [160, 422], [160, 442], C.jeu, 3); D.ligne(g, [xF, 422], [xF, 442], C.jeu, 3);
        D.texte(g, "l0 + Δl", [(160 + xF) / 2, 458], { taille: 20, coul: C.jeu });
        if (n.dl > 0) D.texte(g, "Δl = " + E.fmt(n.dl, 2) + " mm", [310, 505], { taille: 22, mono: true });
        // coupe de la section
        E.s("rect", { x: 310 - n.S * 2, y: 190 - n.S * 2, width: n.S * 4, height: n.S * 4, fill: PLATEFORME.teinte(0.25), stroke: C.encre, "stroke-width": 2.5 }, g);
        D.texte(g, "section S0 = " + n.S + " mm²", [310 + n.S * 2 + 16, 190], { taille: 19, ancre: "start" });
        D.ligne(g, [310, 190 + n.S * 2], [310, 340 - n.S * 1.3], C.gris, 1.5, "4 4");
        fig.chip("l0 = 100 mm");
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Même force, deux sections", jouer: function (j, n) {
      n.deux = true; n.dessin();
      j.fig.astuce("Deux éprouvettes du même alliage, tirées par la même force F.");
      j.titre("Laquelle est la plus sollicitée, la fine ou l'épaisse ?");
      j.choix([
        { html: "La fine (section S0)", juste: true },
        { html: "L'épaisse (section 2 S0)", aide: "La même force se répartit sur deux fois plus de matière : chaque millimètre carré en porte moitié moins." },
        { html: "Les deux pareil, la force est la même", aide: "Compare la force portée par chaque millimètre carré de section, pas la force totale." }
      ], { colonnes: 1, ok: function () {
        j.bravo("La fine : la force se répartit sur moins de matière.");
        j.expliquer("<p>Ce qui compte pour le matériau, c'est la force par unité de section : la <b>contrainte</b> \\(\\sigma = \\dfrac{F}{S_0}\\). Avec \\(F\\) en N et \\(S_0\\) en mm², \\(\\sigma\\) est en MPa (1 MPa = 1 N/mm²).</p>");
        j.suite();
      } });
    } },
    { nom: "Calculer σ", jouer: function (j, n) {
      n.deux = false; n.F = 10; n.dessin();
      j.fig.astuce("Exemple ajouté : éprouvette d'alliage de titane pour tige de hanche.");
      j.titre("On tire avec F = 4 400 N sur une section S0 = 20 mm². Quelle contrainte ?");
      j.nombre({ avant: "\\sigma =", apres: "\\text{MPa}", cases: [{ attendu: 220, tol: 0.5 }], ligne: true,
        aide: function () { return "Divise la force (N) par la section (mm²) : le résultat est directement en MPa."; },
        ok: function () {
          j.bravo("σ = 4 400 / 20 = 220 MPa.");
          j.suite();
        } });
    } },
    { nom: "Étirer", jouer: function (j, n) {
      j.fig.astuce("Longueur utile l0 = 100 mm. L'allongement est exagéré sur le dessin.");
      j.titre("Étire l'éprouvette jusqu'à une déformation ε = 0,2 %.");
      var c = j.curseur({ nom: "Δl", min: 0, max: 0.5, pas: 0.05, val: 0, unite: " mm", dec: 2, change: function (v) {
        if (!n.libre) { c.regler(0.2); return; }
        n.dl = v; n.dessin(); verif(v);
      } });
      function verif(v) {
        if (Math.abs(v - 0.2) > 1e-6) return;
        n.libre = false;
        j.bravo("Δl = 0,2 mm, soit 0,2 % de 100 mm.");
        j.expliquer("<p>La <b>déformation</b> est l'allongement rapporté à la longueur initiale : \\(\\varepsilon = \\dfrac{\\Delta l}{l_0}\\). Elle n'a pas d'unité ; on la donne souvent en %. Ici \\(\\varepsilon = 0{,}2/100 = 0{,}002\\).</p>");
        j.suite();
      }
      j.reponse(function () { c.regler(0.2); n.dl = 0.2; n.dessin(); verif(0.2); });
    } },
    { nom: "Le module", jouer: function (j, n) {
      n.libre = true;
      j.fig.astuce("Dans le domaine élastique, σ et ε sont proportionnels : droite de Hooke.");
      j.titre("σ = 220 MPa donne ε = 0,002. Quel est le module E, en GPa ?");
      j.nombre({ avant: "E =", apres: "\\text{GPa}", cases: [{ attendu: 110, tol: 0.5 }], ligne: true,
        aide: function () { return "E = σ / ε donne des MPa ; 1 GPa = 1 000 MPa."; },
        ok: function () {
          j.bravo("E = 220 / 0,002 = 110 000 MPa = 110 GPa.");
          j.expliquer("<p>Le <b>module d'Young</b> \\(E = \\sigma / \\varepsilon\\) est la pente de la droite de Hooke : la rigidité du matériau. 110 GPa est la valeur du Ti-6Al-4V dans le tableau du cours.</p>");
          j.suite();
        } });
    } },
    { nom: "Les trois formules", jouer: function (j, n) {
      j.titre("Complète les trois définitions.");
      var t = function (a) { return '<span class="trou" data-attendu="' + a + '"></span>'; };
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto auto auto auto auto;gap:10px;align-items:center;font-size:22px">' +
        "\\(\\sigma =\\)" + t("F") + "<span>/</span>" + t("S") + "<span></span>" +
        "\\(\\varepsilon =\\)" + t("dl") + "<span>/</span>" + t("l0") + "<span></span>" +
        "\\(E =\\)" + t("s") + "<span>/</span>" + t("e") + "<span></span></div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "e", tex: "\\varepsilon" }, { id: "S", tex: "S_0" }, { id: "dl", tex: "\\Delta l" }, { id: "F", tex: "F" }, { id: "s", tex: "\\sigma" }, { id: "l0", tex: "l_0" }],
        aide: "Une contrainte est une force par section, une déformation un allongement par longueur, un module une contrainte par déformation.",
        ok: function () {
          j.bravo("Contrainte, déformation, module.");
          j.suite();
        }
      });
    } }
  ]
});
