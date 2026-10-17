/* Niveau : contraintes spécifiques au contexte biomédical. Trier les critères, pincement, lubrifiant, masse mobile. */
NIVEAU({
  id: "contraintes-biomedicales",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg), M = window.MECA;
    var n = { mode: "scene", plie: 70, libre: true, surPlie: null, choixAB: null };

    function scene() {
      // robot de rééducation : il guide l'avant-bras du patient posé dans une gouttière
      E.s("rect", { x: 40, y: 520, width: 600, height: 14, rx: 4, fill: "#d9dde6" }, g);
      E.s("rect", { x: 70, y: 430, width: 150, height: 90, rx: 12, fill: "#5b6172" }, g);
      D.ligne(g, [145, 430], [180, 260], "#9aa0ad", 34); D.ligne(g, [180, 260], [380, 300], "#9aa0ad", 28);
      [[145, 430], [180, 260], [380, 300]].forEach(function (p) { D.rond(g, p, 22, { fill: "#c6cbd8", stroke: C.encre, ep: 3 }); });
      E.s("path", { d: "M330 300 Q 400 350 560 330 L 572 300 Q 420 316 346 280 Z", fill: "#eef0f5", stroke: C.encre, "stroke-width": 3 }, g);
      // avant-bras et main du patient
      E.s("path", { d: "M300 250 Q 440 280 600 280 Q 640 282 646 298 Q 640 316 600 314 Q 430 318 300 296 Z", fill: "#f3d2bf", stroke: C.encre, "stroke-width": 2.5 }, g);
      E.s("rect", { x: 230, y: 200, width: 90, height: 120, rx: 30, fill: "#3b5bdb", opacity: 0.22 }, g);
      D.texte(g, "patient", [560, 250], { taille: 18, coul: C.doux, gras: false });
      D.texte(g, "robot", [145, 548], { taille: 18, coul: C.doux, gras: false });
    }
    function pince() {
      // coude d'une orthèse motorisée : le segment bas tourne autour du pivot O
      var O = [180, 300], a = n.plie * D.DEG;
      E.s("rect", { x: 150, y: 270, width: 480, height: 60, rx: 14, fill: "#c6cbd8", stroke: C.encre, "stroke-width": 3 }, g);
      // un doigt posé sur le segment fixe
      var ecrase = n.plie < 24;
      E.s("rect", { x: 340, y: 236, width: 130, height: 34, rx: 17, fill: ecrase ? C.ko : "#f3d2bf", stroke: C.encre, "stroke-width": 2.5 }, g);
      var u = [Math.cos(-a), Math.sin(-a)], v = [-u[1], u[0]], L = 400, w = 30;
      var bout = [O[0] + u[0] * L, O[1] + u[1] * L];
      E.s("polygon", { points: [[O[0] + v[0] * w, O[1] + v[1] * w], [bout[0] + v[0] * w, bout[1] + v[1] * w], [bout[0] - v[0] * w, bout[1] - v[1] * w], [O[0] - v[0] * w, O[1] - v[1] * w]].map(function (p) { return p.join(","); }).join(" "), fill: "#9aa0ad", stroke: C.encre, "stroke-width": 3, "stroke-linejoin": "round", opacity: 0.9 }, g);
      D.rond(g, O, 26, { fill: "#fff", stroke: C.encre, ep: 4 }); D.rond(g, O, 8, { fill: C.encre });
      if (ecrase) D.texte(g, "doigt pincé", [405, 380], { coul: C.ko, taille: 22 });
      D.texte(g, "pivot du coude", [180, 370], { taille: 17, coul: C.doux, gras: false });
      if (n.libre) D.poignee(g, [O[0] + u[0] * 270, O[1] + u[1] * 270], C.jeu);
      n.poignee = [O[0] + u[0] * 270, O[1] + u[1] * 270];
    }
    function fuite() {
      // réducteur graissé au-dessus du champ opératoire
      E.s("rect", { x: 60, y: 470, width: 560, height: 40, rx: 6, fill: "#a9c6ec", stroke: C.encre, "stroke-width": 2 }, g);
      D.texte(g, "champ stérile", [340, 490], { taille: 17, coul: C.encre, gras: false, fond: false });
      E.s("rect", { x: 220, y: 130, width: 240, height: 170, rx: 18, fill: "#eef0f5", stroke: C.encre, "stroke-width": 3 }, g);
      M.roue(g, [290, 200], { m: 5, Z: 12, fill: "#fff", repere: false, trou: 6 });
      M.roue(g, [290 + 5 * 36 / 2, 225], { m: 5, Z: 24, rot: Math.PI / 24, fill: "#fff", repere: false, trou: 8 });
      E.s("path", { d: "M440 300 q 8 30 0 44 q -8 -14 0 -44 Z", fill: "#c9a227", stroke: C.encre, "stroke-width": 1.5 }, g);
      E.s("path", { d: "M440 380 q 10 36 0 52 q -10 -16 0 -52 Z", fill: "#c9a227", stroke: C.encre, "stroke-width": 1.5 }, g);
      D.texte(g, "graisse", [500, 360], { taille: 18, coul: "#8a6d10" });
    }
    function deux() {
      // A : moteur au coude (porté par le bras) ; B : moteur sur la base, mouvement amené par une transmission
      [[170, "A"], [510, "B"]].forEach(function (c, k) {
        var x = c[0], base = [x, 470], coude = [x + 40, 290], bout = [x + 150, 330];
        E.s("rect", { x: x - 70, y: 470, width: 140, height: 60, rx: 10, fill: "#5b6172" }, g);
        D.ligne(g, base, coude, "#c6cbd8", 26); D.ligne(g, coude, bout, "#c6cbd8", 20);
        D.rond(g, base, 16, { fill: "#fff", stroke: C.encre, ep: 3 }); D.rond(g, coude, 16, { fill: "#fff", stroke: C.encre, ep: 3 });
        if (k === 0) E.s("rect", { x: coude[0] - 34, y: coude[1] - 76, width: 68, height: 56, rx: 8, fill: "#3b5bdb", stroke: C.encre, "stroke-width": 2.5 }, g);
        else {
          E.s("rect", { x: x - 30, y: 480, width: 60, height: 40, rx: 6, fill: "#3b5bdb", stroke: C.encre, "stroke-width": 2.5 }, g);
          D.ligne(g, [x + 8, 460], [coude[0] + 8, coude[1] + 10], C.encre, 4); D.ligne(g, [x - 8, 462], [coude[0] - 8, coude[1] + 6], C.encre, 4);
        }
        D.texte(g, c[1], [x - 80, 120], { taille: 32 });
        var choisi = n.choixAB === c[1];
        if (choisi) E.s("rect", { x: x - 100, y: 90, width: 260, height: 470, rx: 20, fill: "none", stroke: C.ok, "stroke-width": 4 }, g);
      });
      D.texte(g, "bleu : moteur", [340, 580], { taille: 17, coul: C.doux, gras: false });
    }

    n.dessin = function () {
      E.vider(g);
      ({ scene: scene, pince: pince, fuite: fuite, deux: deux })[n.mode]();
    };
    D.glisser(fig.svg, {
      debut: function (p) { return n.mode === "pince" && n.libre && n.poignee && Math.hypot(p[0] - n.poignee[0], p[1] - n.poignee[1]) < 70; },
      bouge: function (p) {
        if (!n.libre || n.mode !== "pince") return;
        var a = Math.atan2(300 - p[1], p[0] - 180) / D.DEG;
        n.plie = Math.max(10, Math.min(80, a));
        n.dessin();
      },
      fin: function () { if (n.libre && n.surPlie) n.surPlie(n.plie); }
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Trier", jouer: function (j, n) {
      j.fig.astuce("Un robot de rééducation au contact du patient.");
      j.titre("Range chaque critère de choix : classique pour toute machine, ou propre au biomédical.");
      var t = function (c) { return '<span class="trou" data-attendu="' + c + '" style="min-width:116px"></span>'; };
      var z = j.zone("", '<p class="consigne" style="margin:4px 0">Critères classiques</p><div style="display:flex;flex-wrap:wrap;gap:6px">' + [t("c"), t("c"), t("c")].join("") + '</div><p class="consigne" style="margin:10px 0 4px">Contexte biomédical</p><div style="display:flex;flex-wrap:wrap;gap:6px">' + [t("b"), t("b"), t("b")].join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "b", html: "Bruit" }, { id: "c", html: "Charge" }, { id: "b", html: "Pincement" }, { id: "c", html: "Coût" }, { id: "b", html: "Nettoyage" }, { id: "c", html: "Durée de vie" }],
        aide: "Les critères classiques valent pour n'importe quelle machine. Les autres viennent de la présence du patient et du soignant.",
        ok: function () {
          j.bravo("Trois critères classiques, trois liés au patient.");
          j.expliquer("<p>Un système biomédical doit respecter les critères classiques de charge, rigidité, durée de vie et coût. Il doit aussi limiter la masse mobile, le bruit, les vibrations et les points de pincement. Il doit être facile à nettoyer et à maintenir, et les lubrifiants doivent rester confinés.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Pincement", jouer: function (j, n) {
      n.mode = "pince"; n.plie = 70; n.libre = true; n.dessin();
      j.fig.astuce("Plie le coude de l'orthèse avec la poignée.");
      j.titre("Plie le coude de l'orthèse au maximum. Que se passe-t-il pour la main posée là ?");
      var fini = false;
      function valider() {
        if (fini) return;
        fini = true; n.libre = false; n.surPlie = null; n.plie = 12; n.dessin();
        j.consigne("Quel critère du cours ce défaut viole-t-il ?");
        j.choix([{ html: "Le bruit", aide: "Rien ne fait de bruit ici : regarde ce que deviennent les deux segments quand l'angle se ferme." }, { html: "Un point de pincement", juste: true }, { html: "La durée de vie", aide: "La machine ne s'use pas ici : c'est le doigt qui est en danger." }], { ok: function () {
          j.bravo("Un point de pincement : l'espace se referme sur le doigt.");
          j.expliquer("<p>Partout où deux pièces se rapprochent pendant le mouvement, un doigt ou un tissu peut être coincé. Dans un robot qui touche le patient, on supprime ces zones (carter, butée, écart minimal) dès la conception.</p>");
          j.suite();
        } });
      }
      n.surPlie = function (a) { if (a < 24) valider(); };
      j.reponse(function () { valider(); });
    } },
    { nom: "Lubrifiant", jouer: function (j, n) {
      n.mode = "fuite"; n.dessin();
      j.fig.astuce("Le réducteur graissé d'un bras, au-dessus du patient.");
      j.titre("Ce réducteur perd un peu de graisse. Quelle exigence du cours n'est pas tenue ?");
      j.choix([{ html: "Les lubrifiants doivent rester confinés", juste: true }, { html: "Le réducteur doit être plus rigide", aide: "La rigidité ne dit rien sur une fuite : regarde où tombe la goutte." }, { html: "Il faut un réducteur moins cher", aide: "Le coût n'est pas en cause ; ce qui gêne, c'est ce qui sort du carter." }], { colonnes: 1, ok: function () {
        j.bravo("La graisse doit rester dans le carter.");
        j.expliquer("<p>Un lubrifiant qui s'échappe salit et contamine la zone de soin. D'où des carters étanches, des joints, et des surfaces faciles à nettoyer et à maintenir.</p>");
        j.suite();
      } });
    } },
    { nom: "Comparer", jouer: function (j, n) {
      n.mode = "deux"; n.choixAB = null; n.dessin();
      j.fig.astuce("Deux façons de motoriser le même coude.");
      j.titre("Laquelle limite la masse mobile du bras ?");
      j.choix([{ html: "A", aide: "Dans A, le moteur bleu est porté par le bras : il bouge avec lui." }, { html: "B", juste: true }], { colonnes: 2, ok: function () {
        n.choixAB = "B"; n.dessin();
        j.bravo("B : le moteur reste sur la base.");
        j.consigne("Mais qu'ajoute la solution B ?");
        j.choix([{ html: "Une transmission plus longue : plus de jeu et de souplesse possibles", juste: true }, { html: "Plus de bruit, forcément", aide: "Rien ne l'impose. Regarde ce qui relie le moteur au coude." }], { colonnes: 1, ok: function () {
          j.bravo("Chaque solution a son prix.");
          j.expliquer("<p>Moins de masse mobile, mais une transmission de plus dans la chaîne, avec son jeu et sa rigidité. Le choix final dépend de l'importance de chaque critère dans l'application.</p>");
          j.suite();
        } });
      } });
    } }
  ]
});
