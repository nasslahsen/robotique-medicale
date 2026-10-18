/* Niveau : charges et renforts. Rapport de forme et quatre groupes, carbonate de calcium, effet sur E et HDT du polypropylène, chiffres du marché. */
NIVEAU({
  id: "charges-renforts",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { mode: "particule", L: 3, d: 1, plat: false, libre: true, revele: 0 };
    n.PP = [["PP", 1.7, 65], ["PP + 40 % CaCO₃", 2.8, 75], ["PP + 40 % talc", 4.2, 97], ["PP + 30 % FV", 6.5, 148]];
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "particule") {
        // une particule vue en 3D simplifiée : longueur L, épaisseur d, forme bâtonnet ou plaquette
        var cx = 340, cy = 290, u = 30, L = n.L * u, d = n.d * u;
        if (n.plat) {
          E.s("ellipse", { cx: cx, cy: cy + d / 2, rx: L / 2, ry: L / 5, fill: PLATEFORME.teinte(0.55), stroke: C.encre, "stroke-width": 2.5 }, g);
          E.s("ellipse", { cx: cx, cy: cy - d / 2, rx: L / 2, ry: L / 5, fill: PLATEFORME.teinte(0.3), stroke: C.encre, "stroke-width": 2.5 }, g);
          D.ligne(g, [cx - L / 2, cy - d / 2], [cx - L / 2, cy + d / 2], C.encre, 2.5); D.ligne(g, [cx + L / 2, cy - d / 2], [cx + L / 2, cy + d / 2], C.encre, 2.5);
          D.texte(g, "D", [cx, cy - d / 2 - L / 5 - 22], { taille: 20, coul: C.acc });
          D.texte(g, "e", [cx + L / 2 + 22, cy], { taille: 20, coul: C.acc });
        } else {
          E.s("rect", { x: cx - L / 2, y: cy - d / 2, width: L, height: d, rx: d / 2, fill: PLATEFORME.teinte(0.45), stroke: C.encre, "stroke-width": 2.5 }, g);
          D.texte(g, "L", [cx, cy - d / 2 - 24], { taille: 20, coul: C.acc });
          D.texte(g, "D", [cx + L / 2 + 22, cy], { taille: 20, coul: C.acc });
        }
        var r = BIO.rapportForme(n.L, n.d), grp = BIO.groupeRenfort(n.plat ? "plaquette" : (r < 1.5 ? "grain" : "batonnet"), r);
        D.texte(g, "rapport de forme = " + E.fmt(r, r < 10 ? 1 : 0), [340, 470], { taille: 22, mono: true });
        if (n.montreGroupe) D.texte(g, grp, [340, 510], { taille: 22, coul: C.jeu });
        fig.chip(null);
      } else if (n.mode === "groupes") {
        // les quatre géométries du cours, de la bille à la fibre longue
        var G = [["granulaire", "1"], ["lamellaire", "10 ; 30 à 40"], ["aciculaire", "10 à 20 ; 10 à 100"], ["fibrillaire", "100 à l'infini"]];
        G.forEach(function (gr, i) {
          var y = 120 + i * 105;
          E.s("rect", { x: 60, y: y - 42, width: 560, height: 88, rx: 18, fill: "#fff", stroke: "#c6cbd8", "stroke-width": 2.5 }, g);
          var cx = 170;
          if (i === 0) D.rond(g, [cx, y], 26, { fill: PLATEFORME.teinte(0.45), stroke: C.encre, ep: 2.5 });
          if (i === 1) { E.s("ellipse", { cx: cx, cy: y + 5, rx: 70, ry: 16, fill: PLATEFORME.teinte(0.55), stroke: C.encre, "stroke-width": 2.5 }, g); E.s("ellipse", { cx: cx, cy: y - 3, rx: 70, ry: 16, fill: PLATEFORME.teinte(0.3), stroke: C.encre, "stroke-width": 2.5 }, g); }
          if (i === 2) E.s("rect", { x: cx - 60, y: y - 8, width: 120, height: 16, rx: 8, fill: PLATEFORME.teinte(0.45), stroke: C.encre, "stroke-width": 2.5 }, g);
          if (i === 3) E.s("rect", { x: cx - 95, y: y - 4, width: 190, height: 8, rx: 4, fill: PLATEFORME.teinte(0.6), stroke: C.encre, "stroke-width": 2 }, g);
          D.texte(g, gr[0], [300, y - 12], { taille: 19, ancre: "start" });
          D.texte(g, "rapport de forme " + gr[1], [300, y + 16], { taille: 16, ancre: "start", coul: C.doux, gras: false });
        });
      } else {
        // diagramme : E (barres) et HDT (points) du polypropylène chargé
        var X0 = 110, Y0 = 470, H = 320;
        D.ligne(g, [X0, Y0], [640, Y0], C.encre, 3);
        D.texte(g, "E (GPa)", [X0 - 10, Y0 - H - 24], { taille: 16, ancre: "start", coul: C.jeu });
        D.texte(g, "HDT (°C)", [640, Y0 - H - 24], { taille: 16, ancre: "end", coul: C.acc });
        n.PP.forEach(function (p, i) {
          var x = X0 + 30 + i * 128, vis = i < n.revele || i === 0;
          var hE = p[1] / 7 * H, hT = p[2] / 160 * H;
          if (vis) {
            E.s("rect", { x: x, y: Y0 - hE, width: 46, height: hE, rx: 6, fill: PLATEFORME.teinte(0.75) }, g);
            D.texte(g, E.fmt(p[1], 1), [x + 23, Y0 - hE - 16], { taille: 16, coul: C.jeu });
            D.rond(g, [x + 76, Y0 - hT], 9, { fill: C.acc, stroke: "#fff", ep: 2 });
            D.texte(g, String(p[2]), [x + 76, Y0 - hT - 20], { taille: 16, coul: C.acc });
          } else { E.s("rect", { x: x, y: Y0 - 60, width: 46, height: 60, rx: 6, fill: "#fff", stroke: "#c6cbd8", "stroke-width": 2, "stroke-dasharray": "5 5" }, g); D.texte(g, "?", [x + 23, Y0 - 30], { taille: 20, coul: C.gris }); }
          var mots = p[0].split(" + ");
          D.texte(g, mots[0], [x + 45, Y0 + 24], { taille: 15 });
          if (mots[1]) D.texte(g, "+ " + mots[1], [x + 45, Y0 + 46], { taille: 15 });
        });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Rapport de forme", jouer: function (j, n) {
      j.fig.astuce("Une particule de renfort : longueur L, diamètre D.");
      j.titre("Règle la particule pour obtenir une aiguille de rapport de forme L/D = 15.");
      var fait = false;
      function test() { if (fait) return; n.dessin(); if (Math.abs(BIO.rapportForme(n.L, n.d) - 15) < 0.01) { fait = true; ok(); } }
      var cL = j.curseur({ nom: "L", min: 1, max: 18, pas: 1, val: n.L, change: function (v) { n.L = v; test(); } });
      var cD = j.curseur({ nom: "D", min: 0.4, max: 3, pas: 0.2, val: n.d, dec: 1, change: function (v) { n.d = v; test(); } });
      function ok() {
        cL.input.disabled = true; cD.input.disabled = true;
        n.montreGroupe = true; n.dessin();
        j.bravo("L/D = 15 : une aiguille, groupe aciculaire.");
        j.expliquer("<p>On désigne par <b>renfort</b> tout produit ni soluble ni miscible qui, mélangé à un polymère, améliore une ou plusieurs propriétés (électriques, mécaniques, chimiques, coûts de production). On les classe par leur nature chimique (organique, minérale) et par leur <b>rapport de forme</b> : quotient de la plus grande et de la plus petite dimension d'une particule.</p>");
        j.suite();
      }
      j.reponse(function () { cL.regler(15); cD.regler(1); n.L = 15; n.d = 1; test(); });
    } },
    { nom: "Quatre groupes", jouer: function (j, n) {
      n.mode = "groupes"; n.dessin();
      j.fig.astuce("");
      j.titre("Range chaque renfort dans son groupe.");
      var G = [["Granulaire (rapport 1)", "g"], ["Lamellaire (10 ; 30 à 40)", "l"], ["Aciculaire (10 à 100)", "a"], ["Fibrillaire (100 à l'infini)", "f"]];
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:8px 10px;align-items:center">' + G.map(function (l) { return "<span>" + l[0] + '</span><span class="trou" data-attendu="' + l[1] + '" style="min-width:170px"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "f", html: "fibres longues de verre" }, { id: "g", html: "billes de verre" }, { id: "a", html: "wollastonite" }, { id: "l", html: "talc" }],
        aide: "Une bille est aussi large que longue. Le talc est en plaquettes. La wollastonite est en aiguilles. Une fibre longue fait au moins 2 mm.",
        ok: function () {
          j.bravo("Billes, talc, wollastonite, fibres longues.");
          j.expliquer("<p>Granulaire ou sphérique (rapport 1) : billes de verre, CaCO₃, noir de carbone. Lamellaire (10 ; 30 à 40) : talc, mica. Aciculaire (10 à 20 ; 10 à 100) : wollastonite, fibres courtes (L &lt; 2 mm). Fibrillaire (100 à l'infini) : fibres longues (L ≥ 2 mm) de verre, de carbone.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Le carbonate de calcium", jouer: function (j, n) {
      j.titre("Le carbonate de calcium est la charge la plus utilisée. Une de ces affirmations est fausse : laquelle ?");
      j.choix([
        { html: "Ses particules sont irrégulières, de rapport de forme proche de 1", aide: "Vrai : c'est une charge granulaire." },
        { html: "Il augmente la rigidité à basse température", aide: "Vrai, d'après le cours." },
        { html: "Il augmente la résistance au choc", juste: true },
        { html: "On l'utilise surtout dans les thermodurcissables", aide: "Vrai, d'après le cours." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Au contraire, il diminue la résistance au choc.");
        j.expliquer("<p>CaCO₃ : charge la plus utilisée, particules de forme irrégulière (rapport de forme près de 1), surtout dans les thermodurcissables ; augmente la rigidité à basse température, peu d'influence à haute température, diminue la résistance au choc.</p>");
        j.suite();
      } });
    } },
    { nom: "Prédire l'effet", jouer: function (j, n) {
      n.mode = "pp"; n.revele = 1; n.dessin();
      j.fig.astuce("HDT : température de fléchissement sous charge.");
      j.titre("Polypropylène seul : E = 1,7 GPa, HDT = 65 °C. Prédis l'ordre, du moins au plus efficace : 40 % CaCO₃, 40 % talc, 30 % fibres de verre.");
      var z = j.zone("", '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">' + ["1", "2", "3"].map(function (c, k) { return (k ? "<span>&lt;</span>" : "") + '<span class="trou" data-attendu="' + c + '" style="min-width:120px"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "3", html: "30 % FV" }, { id: "1", html: "40 % CaCO₃" }, { id: "2", html: "40 % talc" }],
        aide: "Plus le rapport de forme est grand, plus le renfort est efficace : grain, puis plaquette, puis fibre.",
        ok: function () {
          E.anime(1200, function (u) { n.revele = 1 + Math.round(u * 3); n.dessin(); });
          j.bravo("Grain, plaquette, fibre : E et HDT montent ensemble.");
          j.expliquer("<p>Tableau du cours : PP 1,7 GPa et 65 °C ; PP + 40 % CaCO₃ 2,8 GPa et 75 °C ; PP + 40 % talc 4,2 GPa et 97 °C ; PP + 30 % FV 6,5 GPa et 148 °C. L'<b>HDT</b> se mesure sur une poutre de 10 cm, chargée par un poids, dans un bain d'huile qu'on chauffe : c'est la température à laquelle elle fléchit d'une valeur donnée.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Lire le tableau", jouer: function (j, n) {
      n.revele = 4; n.dessin();
      j.titre("Par combien le module du polypropylène est-il multiplié avec 30 % de fibres de verre ? (deux décimales)");
      j.nombre({ avant: "\\dfrac{6{,}5}{1{,}7} \\approx", cases: [{ attendu: 6.5 / 1.7, tol: 0.006 }], ligne: true,
        aide: function () { return "Divise le module du PP + 30 % FV par celui du PP seul."; },
        ok: function () {
          j.bravo("Environ 3,82 fois plus rigide, et 83 °C de plus en HDT.");
          j.expliquer("<p>D'où l'intérêt : un polypropylène renforcé peut remplacer un nylon ou un polyester. Mais l'incorporation de charges et de renforts est un processus coûteux. Environ 35 % des plastiques sont « chargés » ou « renforcés » : presque la moitié des grades de polypropylène, environ 75 % des grades de nylon.</p>");
          j.suite();
        } });
    } }
  ]
});
