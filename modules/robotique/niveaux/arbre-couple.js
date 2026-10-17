/* Niveau : un arbre transmet un couple en tournant. C = 60P/(2πn), lecture sur la courbe C(n) à puissance fixée. */
NIVEAU({
  id: "arbre-couple",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { P: 100, n: 3000, graphe: true, photo: false, libre: true, surN: null };
    function couple(P, nn) { return 60 * P / (2 * Math.PI * nn); }
    n.couple = couple;
    // courbe C(n) : n de 0 à 6000 tr/min, C de 0 à 2 N·m
    var X0 = 110, X1 = 630, Y0 = 545, Y1 = 330, NMAX = 6000, CMAX = 2;
    function px(nn) { return X0 + (X1 - X0) * nn / NMAX; }
    function py(c) { return Y0 - (Y0 - Y1) * Math.min(c, CMAX * 1.05) / CMAX; }
    n.dessin = function () {
      E.vider(g);
      var c = couple(n.P, n.n);
      // moteur, arbre, palier
      var ya = 170;
      E.s("rect", { x: 40, y: 85, width: 200, height: 170, rx: 18, fill: "#5b6172", stroke: C.encre, "stroke-width": 2.5 }, g);
      for (var k = 0; k < 6; k++) E.s("rect", { x: 60 + k * 28, y: 75, width: 14, height: 190, rx: 4, fill: "#7c8394" }, g);
      E.s("rect", { x: 236, y: 120, width: 26, height: 100, rx: 4, fill: "#9aa0ad", stroke: C.encre, "stroke-width": 2 }, g);
      D.texte(g, "moteur", [140, 170], { coul: "#fff", taille: 20, fondCoul: "#5b6172" });
      MECA.arbre(g, 262, 610, ya, 15, { fill: "#e8edf5" });
      E.s("rect", { x: 500, y: 128, width: 64, height: 120, rx: 6, fill: "#c6cbd8", stroke: C.encre, "stroke-width": 2 }, g);
      E.s("rect", { x: 488, y: 236, width: 88, height: 18, rx: 4, fill: "#9aa0ad", stroke: C.encre, "stroke-width": 2 }, g);
      D.texte(g, "palier", [532, 275], { taille: 15, coul: C.doux, gras: false });
      // flèche de couple : trait d'autant plus épais que C est grand
      var ep = n.photo ? 7 : Math.max(2.5, Math.min(11, 2 + 4.5 * c)), xc = 390, ry = 46;
      E.s("path", { d: "M" + (xc + 2) + " " + (ya + ry) + " A 16 " + ry + " 0 1 1 " + (xc + 2) + " " + (ya - ry), fill: "none", stroke: C.jeu, "stroke-width": ep, "stroke-linecap": "round" }, g);
      E.s("polygon", { points: [[xc + 2, ya - ry - 11], [xc + 22, ya - ry], [xc + 2, ya - ry + 11]].map(function (p) { return p.join(","); }).join(" "), fill: C.jeu }, g);
      D.texte(g, "C", [xc + 40, ya - ry - 4], { coul: C.jeu, taille: 24 });
      if (n.photo) {
        D.texte(g, "P = 15 HP", [140, 50], { taille: 24, mono: true });
        D.texte(g, "n = 1450 tr/min", [420, 60], { taille: 24, mono: true });
        D.texte(g, "C = ?", [420, 300], { taille: 34, coul: C.jeu });
        D.texte(g, "1 HP ≈ 745,7 W", [340, 420], { taille: 20, coul: C.doux, gras: false });
        return;
      }
      if (!n.graphe) return;
      // courbe C(n) à P fixée et rectangle dont l'aire vaut la puissance (à un facteur 2π/60 près)
      D.ligne(g, [X0, Y0], [X1 + 12, Y0], C.gris, 2); D.ligne(g, [X0, Y0], [X0, Y1 - 20], C.gris, 2);
      [0, 1, 2].forEach(function (v) { D.texte(g, String(v), [X0 - 16, py(v)], { taille: 15, coul: C.doux, gras: false, mono: true }); });
      [0, 2000, 4000, 6000].forEach(function (v) { D.texte(g, String(v), [px(v), Y0 + 20], { taille: 15, coul: C.doux, gras: false, mono: true }); });
      D.texte(g, "C [N·m]", [X0 + 6, Y1 - 34], { taille: 16, coul: C.doux, ancre: "start" });
      D.texte(g, "n [tr/min]", [X1 + 10, Y0 + 44], { taille: 16, coul: C.doux, ancre: "end" });
      var q = [px(n.n), py(c)];
      E.s("rect", { x: X0, y: q[1], width: q[0] - X0, height: Y0 - q[1], fill: PLATEFORME.teinte(0.16) }, g);
      var l = [];
      for (var nn = 500; nn <= NMAX; nn += 50) l.push(px(nn).toFixed(1) + "," + py(couple(n.P, nn)).toFixed(1));
      E.s("polyline", { points: l.join(" "), fill: "none", stroke: "#3b5bdb", "stroke-width": 3.5 }, g);
      D.ligne(g, [q[0], Y0], q, C.jeu, 2, "5 4"); D.ligne(g, [X0, q[1]], q, C.jeu, 2, "5 4");
      if (n.libre && n.surN) D.poignee(g, q, C.jeu); else D.rond(g, q, 9, { fill: C.jeu, stroke: "#fff", ep: 3 });
      D.texte(g, "P = " + n.P + " W", [X1 - 10, Y1 - 4], { taille: 17, coul: "#3b5bdb", ancre: "end" });
      fig.chip("n = " + Math.round(n.n) + " tr/min   C = " + E.fmt(c, 3) + " N·m");
    };
    // glisser le point le long de la courbe : on règle n
    D.glisser(fig.svg, {
      debut: function (p) { return n.libre && n.surN && n.graphe && p[1] > Y1 - 40; },
      bouge: function (p) {
        if (!n.libre || !n.surN) return;
        n.n = Math.max(500, Math.min(NMAX, Math.round((p[0] - X0) / (X1 - X0) * NMAX / 50) * 50));
        n.dessin(); n.surN(n.n);
      }
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Prédire", jouer: function (j, n) {
      n.n = 3000; n.dessin();
      j.fig.astuce("La courbe donne le couple sur l'arbre quand la puissance reste 100 W.");
      j.titre("Le moteur fournit toujours 100 W, mais tourne deux fois plus vite. Le couple sur l'arbre :");
      j.choix([{ html: "double", aide: "La puissance ne change pas : si l'arbre tourne plus vite, il faut moins de couple pour la même puissance." }, { html: "est divisé par deux", juste: true }, { html: "ne change pas", aide: "Regarde la courbe : quand n augmente, C descend." }], { ok: function () {
        n.n = 6000; n.dessin();
        j.bravo("Divisé par deux : à puissance fixée, C et n varient en sens inverse.");
        j.expliquer("<p>Un <b>arbre</b> transmet un couple en tournant. Pour une puissance \\(P\\) et une vitesse de rotation \\(n\\), le couple vaut</p>\\[ C = \\frac{60P}{2\\pi n} \\]<p>avec \\(C\\) en N·m, \\(P\\) en W et \\(n\\) en tr/min. C'est \\(P = C\\omega\\) avec \\(\\omega = 2\\pi n / 60\\).</p>");
        j.suite();
      } });
    } },
    { nom: "Exemple du cours", jouer: function (j, n) {
      n.n = 3000; n.dessin();
      j.fig.astuce("");
      j.titre("\\(P = 100\\) W à \\(n = 3000\\) tr/min. Quel couple transmet l'arbre ?");
      j.nombre({ avant: "C =", apres: "\\text{N}\\cdot\\text{m}", cases: [{ attendu: 0.318, tol: 0.002 }], ligne: true,
        aide: function () { return "\\(C = \\dfrac{60 \\times 100}{2\\pi \\times 3000}\\) : garde n en tr/min, le 60 fait la conversion."; },
        ok: function () {
          j.bravo("0,318 N·m.");
          j.expliquer("\\[ C = \\frac{60 \\times 100}{2\\pi \\times 3000} = 0{,}318 \\ \\text{N}\\cdot\\text{m} \\]");
          j.suite();
        } });
    } },
    { nom: "Viser", jouer: function (j, n) {
      n.n = 4000; n.libre = true; n.dessin();
      j.fig.astuce("Fais glisser le point sur la courbe.");
      j.titre("L'outil a besoin de 0,955 N·m. À quelle vitesse doit tourner l'arbre, toujours avec 100 W ?");
      var fini = false;
      function gagne() {
        fini = true; n.surN = null; n.libre = false; n.n = 1000; n.dessin();
        j.bravo("1000 tr/min : 0,955 N·m.", [110 + 520 * 1000 / 6000, 330]);
        j.expliquer("<p>Pour obtenir plus de couple avec la même puissance, il faut tourner plus lentement. C'est le rôle d'un réducteur, au chapitre suivant de ce sous-module.</p>");
        j.suite();
      }
      n.surN = function (v) { if (!fini && v === 1000) gagne(); };
      n.dessin();
      j.reponse(function () { if (!fini) gagne(); });
      j.nettoyer(function () { n.surN = null; n.libre = true; });
    } },
    { nom: "La photo du cours", jouer: function (j, n) {
      n.photo = true; n.dessin(); j.fig.chip(null);
      j.fig.astuce("Exemple ajouté : la photo du cours pose la question sans la résoudre.");
      j.titre("Le moteur de la photo : 15 HP à 1450 tr/min. Quel couple sur son arbre ?");
      j.nombre({ avant: "C \\approx", apres: "\\text{N}\\cdot\\text{m}", cases: [{ attendu: 73.7, tol: 0.2 }], ligne: true,
        aide: function () { return "Convertis d'abord : \\(P = 15 \\times 745{,}7\\) W, puis \\(C = 60P/(2\\pi n)\\)."; },
        ok: function () {
          j.bravo("Environ 73,7 N·m.");
          j.expliquer("\\[ P = 15 \\times 745{,}7 \\approx 11\\,186 \\text{ W} \\qquad C = \\frac{60 \\times 11\\,186}{2\\pi \\times 1450} \\approx 73{,}7 \\ \\text{N}\\cdot\\text{m} \\]<p>Exemple ajouté : 1 HP (horse-power) vaut environ 745,7 W.</p>");
          j.suite();
        } });
    } },
    { nom: "Trouve l'erreur", jouer: function (j, n) {
      n.photo = false; n.n = 3000; n.dessin();
      j.fig.astuce("");
      j.titre("Un camarade écrit : « C = P / n = 100 / 3000 = 0,033 N·m ». Où est l'erreur ?");
      j.choix([
        { html: "n est en tr/min : il faut la vitesse angulaire \\(\\omega = 2\\pi n/60\\) en rad/s", juste: true },
        { html: "Il fallait multiplier : \\(C = P \\times n\\)", aide: "À puissance fixée, plus n est grand, plus C est petit : on divise bien." },
        { html: "La puissance doit être en kW", aide: "Le couple en N·m demande P en W. C'est l'autre grandeur qui n'est pas dans la bonne unité." }
      ], { colonnes: 1, ok: function () {
        j.bravo("\\(P = C\\omega\\) demande ω en rad/s.");
        j.expliquer("<p>Son résultat est 2π/60 ≈ 0,105 fois trop petit. Avec ω = 314 rad/s on retrouve 0,318 N·m.</p>");
        j.suite();
      } });
    } }
  ]
});
