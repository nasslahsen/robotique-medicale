/* Niveau : durée nominale de base L10 = (C/P)^p, en heures L10h = 10^6/(60n) (C/P)^p, effet de la charge, capacité requise. */
NIVEAU({
  id: "duree-l10",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { C: 3.2, P: 0.8, p: 3, n: 300, rouleaux: false, montrerH: false };
    var ox = 110, oy = 500, sx = 175, sy = 0.62; // px par kN, px par million de tours
    function L(Ck, Pk, p) { return Math.pow(Ck / Pk, p); }
    n.dessin = function () {
      E.vider(g);
      // axes
      D.fleche(g, [ox, oy], [640, oy], C.gris, 2.5); D.fleche(g, [ox, oy], [ox, 120], C.gris, 2.5);
      for (var x = 0.5; x <= 3; x += 0.5) { D.ligne(g, [ox + x * sx, oy], [ox + x * sx, oy + 8], C.gris, 2); D.texte(g, E.fmt(x, 1), [ox + x * sx, oy + 26], { taille: 15, coul: C.doux, mono: true, gras: false }); }
      [100, 200, 300, 400, 500, 600].forEach(function (y) { D.ligne(g, [ox, oy - y * sy], [640, oy - y * sy], "#eef0f5", 1.5); D.texte(g, String(y), [ox - 10, oy - y * sy], { taille: 15, coul: C.doux, mono: true, gras: false, ancre: "end" }); });
      D.texte(g, "P (kN)", [636, oy - 18], { taille: 16, coul: C.doux, ancre: "end" });
      D.texte(g, "L₁₀ (millions de tours)", [ox + 8, 104], { taille: 16, coul: C.doux, ancre: "start" });
      // courbes : billes (p = 3), rouleaux (p = 10/3) si demandé
      [[3, C.jeu, "billes"], [10 / 3, C.acc, "rouleaux"]].forEach(function (c) {
        if (c[0] !== 3 && !n.rouleaux) return;
        var pts = [];
        for (var P = 0.4; P <= 3.2; P += 0.02) { var y = L(n.C, P, c[0]); if (y * sy < 390) pts.push((ox + P * sx).toFixed(1) + "," + (oy - y * sy).toFixed(1)); }
        E.s("polyline", { points: pts.join(" "), fill: "none", stroke: c[1], "stroke-width": 4 }, g);
        if (c[0] === 3) D.texte(g, c[2], [ox + 0.6 * sx - 14, oy - L(n.C, 0.6, 3) * sy], { coul: c[1], taille: 19, ancre: "end" });
        else D.texte(g, c[2], [ox + 1.05 * sx + 14, oy - L(n.C, 1.05, c[0]) * sy - 16], { coul: c[1], taille: 19, ancre: "start" });
      });
      // point courant
      var y = L(n.C, n.P, n.p), q = [ox + n.P * sx, oy - Math.min(y, 640) * sy];
      D.ligne(g, [q[0], oy], q, C.encre, 2, "5 5");
      D.rond(g, q, 10, { fill: n.p === 3 ? C.jeu : C.acc, stroke: "#fff", ep: 3 });
      D.texte(g, "P = " + E.fmt(n.P, 2) + " kN", [q[0] + 14, q[1] - 24], { ancre: "start", taille: 18 });
      D.texte(g, "C = " + E.fmt(n.C, 1) + " kN, n = " + n.n + " tr/min", [640, 60], { ancre: "end", taille: 18, coul: C.doux });
      var t = "L_{10} = \\left(\\dfrac{" + E.tc(n.C) + "}{" + E.tc(n.P) + "}\\right)^{" + (n.p === 3 ? "3" : "10/3") + "} = " + E.tc(y, 1) + "\\ \\text{Mtr}";
      if (n.montrerH) t += "\\qquad L_{10h} = \\dfrac{10^6}{60 \\times " + n.n + "}\\,L_{10} = " + E.tc(y * 1e6 / (60 * n.n), 0) + "\\ \\text{h}";
      E.k(fig.bande(""), t);
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "En tours", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Roulement à billes : C = 3,2 kN, P = 0,8 kN. Combien de millions de tours tient-il ?");
      j.nombre({ avant: "L_{10} =", apres: "\\text{millions de tours}", cases: [{ attendu: 64, tol: 0.05 }], ligne: true,
        aide: function () { return "\\(L_{10} = (C/P)^p\\) avec \\(p = 3\\) pour les billes : \\(C/P = 4\\)."; },
        ok: function () {
          j.bravo("64 millions de tours.");
          j.expliquer("\\[ L_{10} = \\left(\\frac{C}{P}\\right)^p \\]<p>\\(L_{10}\\) : durée nominale de base, en millions de tours ; \\(C\\) : capacité dynamique de base (N) ; \\(P\\) : charge dynamique équivalente (N) ; \\(p\\) : exposant de durée, \\(p = 3\\) pour les roulements à billes et \\(p = 10/3\\) pour les roulements à rouleaux.</p>");
          j.suite();
        } });
    } },
    { nom: "En heures", jouer: function (j, n) {
      j.titre("Il tourne à n = 300 tr/min. Combien d'heures cela fait-il ?");
      j.nombre({ avant: "L_{10h} \\approx", apres: "\\text{h}", cases: [{ attendu: 64e6 / (60 * 300), tol: 1 }], ligne: true,
        aide: function () { return "Passe en tours (\\(\\times 10^6\\)), puis divise par le nombre de tours en une heure : \\(60 \\times n\\)."; },
        ok: function () {
          n.montrerH = true; n.dessin();
          j.bravo("Environ 3556 h.");
          j.expliquer("\\[ L_{10h} = \\frac{10^6}{60\\,n}\\left(\\frac{C}{P}\\right)^p \\]<p>\\(10^6\\) convertit les millions de tours en tours, et 60 convertit les minutes en heures (\\(n\\) en tr/min).</p>");
          j.suite();
        } });
    } },
    { nom: "Charge doublée", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Prédis : la charge P double (1,6 kN). Par combien la durée L₁₀ est-elle divisée ?");
      j.choix([{ html: "par 2", aide: "La durée ne suit pas la charge proportionnellement : regarde l'exposant." }, { html: "par 4", aide: "Ce serait un carré. Pour les billes, \\(p = 3\\)." }, { html: "par 8", juste: true }], { ok: function () {
        var P0 = 0.8;
        E.anime(900, function (e) { n.P = P0 + 0.8 * e; n.dessin(); });
        j.bravo("\\(2^3 = 8\\) : de 64 à 8 millions de tours.");
        j.expliquer("<p>La durée chute très vite quand la charge augmente : c'est la puissance \\(p\\). Inversement, diviser la charge par deux multiplie la durée par 8.</p>");
        j.suite();
      } });
    } },
    { nom: "À rouleaux", jouer: function (j, n) {
      n.P = 0.8; n.p = 10 / 3; n.rouleaux = true; n.montrerH = false; n.dessin();
      j.fig.astuce("Même rapport C/P = 4, mais un roulement à rouleaux.");
      j.titre("Même C/P = 4 pour un roulement à rouleaux. Combien de millions de tours ?");
      j.nombre({ avant: "L_{10} \\approx", apres: "\\text{millions de tours}", cases: [{ attendu: Math.pow(4, 10 / 3), tol: 0.2 }], ligne: true,
        aide: function () { return "Pour les rouleaux, \\(p = 10/3\\) : calcule \\(4^{10/3}\\)."; },
        ok: function () {
          j.bravo("Environ 101,6 millions de tours.");
          j.suite();
        } });
    } },
    { nom: "Capacité requise", jouer: function (j, n) {
      n.p = 3; n.rouleaux = false; n.P = 0.8; n.montrerH = true; n.dessin();
      j.fig.astuce("");
      j.titre("Exemple ajouté. On veut 10 000 h à 300 tr/min sous P = 0,8 kN, avec des billes. Quelle capacité dynamique minimale \\(C_{req}\\) ?");
      j.nombre({ avant: "C_{req} \\approx", apres: "\\text{kN}", cases: [{ attendu: 0.8 * Math.cbrt(180), tol: 0.01 }], ligne: true,
        aide: function () { return "D'abord le nombre de tours requis : \\(L_{10} = 10\\,000 \\times 60 \\times 300 / 10^6 = 180\\) millions. Puis \\(C = P \\, L_{10}^{1/3}\\)."; },
        ok: function () {
          n.C = 0.8 * Math.cbrt(180); n.dessin();
          j.bravo("Environ 4,52 kN : le roulement de 3,2 kN ne suffit pas.");
          j.expliquer("\\[ L_{10} = \\frac{60\\,n\\,t}{10^6} \\qquad C_{req} = P\\,L_{10}^{1/p} \\]<p>On pré-sélectionne ensuite sur catalogue un roulement de capacité \\(C \\ge C_{req}\\).</p>");
          j.suite();
        } });
    } },
    { nom: "Trouve l'erreur", jouer: function (j, n) {
      j.titre("Un camarade écrit : « mon roulement durera exactement 3556 h dans le robot ». Qu'est-ce qui ne va pas ?");
      j.choix([
        { html: "L₁₀ est une base statistique à 90 % de fiabilité, en conditions de laboratoire parfaites", juste: true },
        { html: "Il faut multiplier par 60, pas diviser", aide: "Le calcul en heures est juste : 64 millions de tours divisés par 18 000 tours par heure." },
        { html: "Rien, la formule est exacte", aide: "La formule donne une durée nominale de base, pas une durée garantie pour chaque roulement." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Une durée nominale, pas une promesse.");
        j.expliquer("<p>\\(L_{10}\\) correspond à une base statistique de 90 % de fiabilité pour les hypothèses du modèle de base, fonctionnant dans des conditions de laboratoire parfaites. Les modèles industriels avancés introduisent l'effet de la lubrification et de la contamination par des facteurs de modification.</p>");
        j.suite();
      } });
    } }
  ]
});
