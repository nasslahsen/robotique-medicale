/* Niveau : nomenclature. Un même symbole a plusieurs sens, l'unité tranche ; unités des grandeurs d'un axe ; indices. */
NIVEAU({
  id: "nomenclature",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg), M = window.MECA;
    var n = { mode: "cartes", fiche: "", cartes: [], bon: -1 };

    // petits dessins, centrés en c
    var DESSIN = {
      moteur: function (c) {
        E.s("rect", { x: c[0] - 70, y: c[1] - 48, width: 110, height: 96, rx: 14, fill: "#dfe3ea", stroke: C.encre, "stroke-width": 3 }, g);
        for (var k = 0; k < 4; k++) D.ligne(g, [c[0] - 50 + k * 22, c[1] - 48], [c[0] - 50 + k * 22, c[1] + 48], "#9aa0ad", 2);
        E.s("rect", { x: c[0] + 40, y: c[1] - 10, width: 50, height: 20, fill: "#c6cbd8", stroke: C.encre, "stroke-width": 2.5 }, g);
        E.s("path", { d: "M" + (c[0] + 74) + " " + (c[1] - 34) + " A 30 30 0 0 1 " + (c[0] + 74) + " " + (c[1] + 34), fill: "none", stroke: C.z, "stroke-width": 4 }, g);
        D.fleche(g, [c[0] + 78, c[1] + 30], [c[0] + 70, c[1] + 36], C.z, 4);
      },
      roulement: function (c) {
        [62, 46, 26, 14].forEach(function (r, i) { D.rond(g, c, r, { fill: i % 2 ? "#fff" : "#dfe3ea", stroke: C.encre, ep: 3 }); });
        for (var k = 0; k < 9; k++) { var a = k * 2 * Math.PI / 9; D.rond(g, [c[0] + 36 * Math.cos(a), c[1] + 36 * Math.sin(a)], 8, { fill: "#9aa0ad", stroke: C.encre, ep: 1.5 }); }
      },
      arbre: function (c) {
        E.s("rect", { x: c[0] - 90, y: c[1] - 18, width: 180, height: 36, rx: 6, fill: "#dfe3ea", stroke: C.encre, "stroke-width": 3 }, g);
        E.s("ellipse", { cx: c[0] + 90, cy: c[1], rx: 8, ry: 18, fill: "#c6cbd8", stroke: C.encre, "stroke-width": 2.5 }, g);
        E.s("path", { d: "M" + (c[0] + 40) + " " + (c[1] - 44) + " A 18 44 0 0 1 " + (c[0] + 40) + " " + (c[1] + 44), fill: "none", stroke: C.z, "stroke-width": 4 }, g);
        D.fleche(g, [c[0] + 44, c[1] + 40], [c[0] + 36, c[1] + 46], C.z, 4);
      },
      engrenage: function (c) { M.roue(g, c, { m: 7, Z: 17, rot: 0.1 }); },
      masse: function (c) {
        D.rond(g, [c[0] - 80, c[1] - 30], 12, { fill: "#fff", stroke: C.encre, ep: 3 });
        D.ligne(g, [c[0] - 80, c[1] - 30], [c[0] + 60, c[1] - 30], "#c6cbd8", 16);
        E.s("rect", { x: c[0] + 34, y: c[1] - 6, width: 52, height: 46, rx: 6, fill: "#9aa0ad", stroke: C.encre, "stroke-width": 2.5 }, g);
        D.ligne(g, [c[0] + 60, c[1] - 30], [c[0] + 60, c[1] - 6], C.encre, 2.5);
        D.fleche(g, [c[0] + 104, c[1] - 6], [c[0] + 104, c[1] + 50], C.v, 4);
        D.texte(g, "g", [c[0] + 122, c[1] + 20], { coul: C.v, taille: 20 });
      },
      courroie: function (c) {
        D.rond(g, [c[0] - 55, c[1]], 30, { fill: "#dfe3ea", stroke: C.encre, ep: 3 }); D.rond(g, [c[0] + 55, c[1]], 30, { fill: "#dfe3ea", stroke: C.encre, ep: 3 });
        D.ligne(g, [c[0] - 55, c[1] - 34], [c[0] + 55, c[1] - 34], C.encre, 5); D.ligne(g, [c[0] - 55, c[1] + 34], [c[0] + 55, c[1] + 34], C.encre, 5);
        for (var k = 0; k < 6; k++) D.ligne(g, [c[0] - 40 + k * 16, c[1] - 34], [c[0] - 40 + k * 16, c[1] - 26], C.encre, 3);
      },
      vis: function (c) {
        E.s("rect", { x: c[0] - 90, y: c[1] - 14, width: 180, height: 28, fill: "#dfe3ea", stroke: C.encre, "stroke-width": 2.5 }, g);
        for (var k = 0; k < 12; k++) D.ligne(g, [c[0] - 86 + k * 15, c[1] - 14], [c[0] - 78 + k * 15, c[1] + 14], C.encre, 1.6);
        E.s("rect", { x: c[0] - 22, y: c[1] - 32, width: 44, height: 64, rx: 6, fill: "#c6cbd8", stroke: C.encre, "stroke-width": 2.5 }, g);
      }
    };

    n.dessin = function () {
      E.vider(g);
      if (n.mode === "cartes") {
        // la fiche technique, en haut
        E.s("rect", { x: 150, y: 34, width: 380, height: 104, rx: 18, fill: "#fff", stroke: C.encre, "stroke-width": 3 }, g);
        E.s("rect", { x: 150, y: 34, width: 380, height: 30, rx: 14, fill: "#eef0f5" }, g);
        D.texte(g, n.titreFiche || "fiche technique", [340, 50], { taille: 15, coul: C.doux, gras: false, fond: false });
        D.texte(g, n.fiche, [340, 102], { taille: 40, mono: true });
        var k = n.cartes.length, w = k === 2 ? 296 : 200, gap = k === 2 ? 28 : 20, x0 = (680 - k * w - (k - 1) * gap) / 2;
        n.cartes.forEach(function (ca, i) {
          var x = x0 + i * (w + gap), etat = n.bon >= 0 ? (i === n.bon ? "bon" : "non") : "";
          E.s("rect", { x: x, y: 176, width: w, height: 390, rx: 22, fill: etat === "bon" ? "#e3f7ee" : "#fafbfd", stroke: etat === "bon" ? C.ok : C.pale, "stroke-width": etat === "bon" ? 4 : 2, opacity: etat === "non" ? 0.45 : 1 }, g);
          var ech = k === 2 ? 1.55 : 1.05, cx = x + w / 2;
          var gg = E.s("g", { opacity: etat === "non" ? 0.4 : 1, transform: "translate(" + cx + " 300) scale(" + ech + ") translate(" + (-cx) + " -300)" }, g), ancien = g; g = gg;
          DESSIN[ca.d]([x + w / 2, 300]);
          g = ancien;
          D.texte(g, ca.sens[0], [x + w / 2, 430], { taille: k === 2 ? 21 : 18, op: etat === "non" ? 0.5 : 1 });
          if (ca.sens[1]) D.texte(g, ca.sens[1], [x + w / 2, 458], { taille: k === 2 ? 21 : 18, op: etat === "non" ? 0.5 : 1 });
          D.texte(g, ca.unite, [x + w / 2, 515], { taille: 26, mono: true, coul: C.jeu, op: etat === "non" ? 0.5 : 1 });
        });
      } else {
        // un axe : moteur, réducteur, bras ; chaque grandeur posée là où elle vit
        var y = 300, ancien2 = g;
        g = E.s("g", { transform: "translate(345 300) scale(1.12) translate(-345 -300)" }, g);
        DESSIN.moteur([130, y]);
        D.ligne(g, [218, y], [270, y], "#9aa0ad", 14);
        E.s("rect", { x: 270, y: y - 60, width: 120, height: 120, rx: 16, fill: "#eef0f5", stroke: C.encre, "stroke-width": 3 }, g);
        M.roue(g, [312, y - 18], { m: 3, Z: 12, fill: "#fff", repere: false, trou: 4 });
        M.roue(g, [312 + 3 * (12 + 24) / 2, y + 10], { m: 3, Z: 24, rot: Math.PI / 24, fill: "#fff", repere: false, trou: 5 });
        D.ligne(g, [390, y], [450, y], "#9aa0ad", 18);
        D.rond(g, [470, y], 24, { fill: "#fff", stroke: C.encre, ep: 4 });
        D.ligne(g, [470, y], [630, y - 120], "#c6cbd8", 24);
        D.rond(g, [470, y], 9, { fill: C.encre });
        var et = [["ω, n", [130, y - 90]], ["C", [244, y - 40]], ["P", [130, y + 82]], ["i, η", [330, y + 90]], ["k", [470, y + 70], "θ"]];
        et.forEach(function (e) { var t = D.texte(g, e[0], e[1], { taille: 26, coul: C.z, italique: true }); if (e[2]) { var s = E.s("tspan", { "baseline-shift": "sub", "font-size": "70%" }, t); s.textContent = e[2]; } });
        D.texte(g, "moteur", [130, y + 140], { taille: 17, coul: C.doux, gras: false });
        D.texte(g, "réducteur", [330, y + 140], { taille: 17, coul: C.doux, gras: false });
        D.texte(g, "bras", [560, y + 10], { taille: 17, coul: C.doux, gras: false });
        g = ancien2;
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "P en kN", jouer: function (j, n) {
      n.mode = "cartes"; n.bon = -1; n.titreFiche = "fiche technique d'un roulement"; n.fiche = "P = 0,8 kN";
      n.cartes = [{ d: "moteur", sens: ["puissance", "mécanique"], unite: "W" }, { d: "roulement", sens: ["charge dynamique", "équivalente"], unite: "N" }];
      n.dessin();
      j.fig.astuce("Deux sens possibles pour la même lettre.");
      j.titre("Sur cette fiche, P vaut 0,8 kN. De quel P s'agit-il ?");
      j.choix([{ html: "Une puissance mécanique", aide: "Une puissance s'exprime en watts (W). Ici l'unité est le kN : c'est une force." }, { html: "La charge dynamique équivalente du roulement", juste: true }], { colonnes: 1, ok: function () {
        n.bon = 1; n.dessin();
        j.bravo("Des kN : c'est une force, donc la charge sur le roulement.");
        j.expliquer("<p>Le cours utilise les unités du Système international. Certaines lettres ont plusieurs sens : P est une puissance (W) ou la charge dynamique équivalente d'un roulement (N). L'unité permet d'identifier le sens utilisé.</p>");
        j.suite();
      } });
    } },
    { nom: "C en N·m", jouer: function (j, n) {
      n.bon = -1; n.titreFiche = "fiche technique d'une clavette"; n.fiche = "C = 8 N·m";
      n.cartes = [{ d: "roulement", sens: ["capacité dynamique", "d'un roulement"], unite: "N" }, { d: "arbre", sens: ["couple", "mécanique"], unite: "N·m" }];
      n.dessin();
      j.fig.astuce("Lis l'unité avant de choisir.");
      j.titre("Une clavette doit transmettre C = 8 N·m. Que représente ce C ?");
      j.choix([{ html: "Une capacité de roulement", aide: "Une capacité de roulement est une force, en N. Ici l'unité est le N·m." }, { html: "Un couple", juste: true }], { colonnes: 2, ok: function () {
        n.bon = 1; n.dessin();
        j.bravo("Des N·m : un couple.");
        j.expliquer("<p>C désigne un couple (N·m) ou la capacité dynamique d'un roulement (N). Dans les tableaux de roulements, C et P sont des forces : ne pas les confondre avec le couple et la puissance.</p>");
        j.suite();
      } });
    } },
    { nom: "m en mm", jouer: function (j, n) {
      n.bon = -1; n.titreFiche = "fiche technique d'une roue dentée"; n.fiche = "m = 2 mm";
      n.cartes = [{ d: "masse", sens: ["masse", "portée"], unite: "kg" }, { d: "engrenage", sens: ["module", "de la denture"], unite: "mm" }];
      n.dessin();
      j.fig.astuce("");
      j.titre("Même question pour m = 2 mm.");
      j.choix([{ html: "Une masse", aide: "Une masse se mesure en kg. Le mm est une longueur." }, { html: "Le module de la denture", juste: true }], { colonnes: 2, ok: function () {
        n.bon = 1; n.dessin();
        j.bravo("Une longueur en mm : le module, celui de \\(d = mZ\\).");
        j.suite();
      } });
    } },
    { nom: "Unités", jouer: function (j, n) {
      n.mode = "axe"; n.dessin();
      j.fig.astuce("Chaque grandeur est posée sur l'axe là où elle agit.");
      j.titre("Donne à chaque grandeur de l'axe son unité.");
      var L = [["\\omega", "rads"], ["n", "trmin"], ["C", "nm"], ["P", "w"], ["k_\\theta", "nmrad"], ["\\eta", "sd"]];
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr auto 1fr;gap:8px 12px;align-items:center">' + L.map(function (l) { return '<span style="font-size:22px">\\(' + l[0] + '\\)</span><span class="trou" data-attendu="' + l[1] + '"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "nm", html: "N·m" }, { id: "sd", html: "sans unité" }, { id: "rads", html: "rad/s" }, { id: "w", html: "W" }, { id: "trmin", html: "tr/min" }, { id: "nmrad", html: "N·m/rad" }],
        aide: "La vitesse angulaire est en rad/s, la vitesse de rotation en tours par minute. \\(k_\\theta\\) est un couple par angle.",
        ok: function () {
          j.bravo("Toutes les unités sont à leur place.");
          j.expliquer("<p>\\(\\omega\\) en rad/s et \\(n\\) en tr/min décrivent la même rotation. \\(P = C\\omega\\) donne des watts quand \\(C\\) est en N·m et \\(\\omega\\) en rad/s. Le rendement \\(\\eta\\) est sans dimension, entre 0 et 1.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Indices", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Dans \\(C_s \\simeq \\eta\\, i\\, C_e\\), que veulent dire les indices \\(e\\) et \\(s\\) ?");
      j.choix([{ html: "équivalent et statique", aide: "« eq » veut dire équivalent et « 0 » statique. Ici, une seule lettre : regarde le tableau des indices." }, { html: "entrée et sortie", juste: true }, { html: "externe et serrage", aide: "Externe s'écrit « ext ». Pense au chemin du couple dans le réducteur." }], { colonnes: 1, ok: function () {
        j.bravo("Couple d'entrée, couple de sortie.");
        j.expliquer("<p>Indices du cours : e entrée, s sortie, m moteur, g gravitaire, d dimensionnement, f frottement, ext externe, eq équivalent, req requis, tot total, 0 initial ou statique, 1, 2, … organe ou étage numéroté.</p>");
        j.suite();
      } });
    } },
    { nom: "Trouve l'erreur", jouer: function (j, n) {
      n.mode = "cartes"; n.bon = -1; n.titreFiche = "note d'un camarade, roulement à billes"; n.fiche = "p = 3 mm";
      n.cartes = [{ d: "roulement", sens: ["exposant", "de durée"], unite: "sans unité" }, { d: "courroie", sens: ["pas de la", "courroie"], unite: "mm" }, { d: "vis", sens: ["avance", "par tour"], unite: "mm/tr" }];
      n.dessin();
      j.fig.astuce("p a trois sens dans le cours.");
      j.titre("Pour un roulement à billes, un camarade note p = 3 mm. Qu'est-ce qui cloche ?");
      j.choix([{ html: "Pour un roulement, p est l'exposant de durée : il n'a pas d'unité", juste: true }, { html: "Pour des billes, p vaut 10/3", aide: "10/3, c'est pour les roulements à rouleaux. Le nombre 3 est juste ; regarde l'unité." }, { html: "Rien : p est le pas, en mm", aide: "Le pas en mm, c'est pour une courroie synchrone. Ici on parle d'un roulement." }], { colonnes: 1, ok: function () {
        n.bon = 0; n.dessin();
        j.bravo("p = 3, sans unité, dans \\(L_{10} = (C/P)^p\\).");
        j.expliquer("<p>p désigne l'exposant de durée d'un roulement (3 pour les billes, 10/3 pour les rouleaux), le pas d'une courroie (mm) ou l'avance d'une vis par tour (mm/tr). Toujours écrire l'unité, c'est elle qui lève le doute.</p>");
        j.suite();
      } });
    } }
  ]
});
