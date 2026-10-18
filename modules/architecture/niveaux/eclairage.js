/* Niveau : éclairage (diapo 38) et scialytique (diapo 39). Deux catégories d'éclairage, ombre portée, coordination. */
NIVEAU(ARCHI.rejouable({
  id: "eclairage",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var G = { yS: 130, yO: 360, yF: 470, o1: 300, o2: 380 };
    var n = { mode: "categories", k: 1, e: 0, libre: true, G: G, g: g, pl: { P: function (v) { return v; } } };
    n.minPlaie = function () {
      var xs = A.calc.foyers(n.k, n.e, 340), m = 1;
      for (var x = 320; x <= 360; x += 2) m = Math.min(m, A.calc.lumiere(xs, x, G));
      return m;
    };
    n.dessin = function () {
      A.vider(g);
      fig.chip(null);
      if (n.mode === "scialytique") {
        var xs = A.calc.foyers(n.k, n.e, 340);
        // plafond et bras
        A.s("rect", { x: 20, y: 40, width: 640, height: 18, fill: "#d9e2ef" }, g);
        A.s("line", { x1: 340, y1: 58, x2: 340, y2: 100, stroke: C.encre, "stroke-width": 6 }, g);
        A.s("rect", { x: Math.min.apply(null, xs) - 30, y: 100, width: Math.max.apply(null, xs) - Math.min.apply(null, xs) + 60, height: 18, rx: 9, fill: C.doux }, g);
        // cônes de lumière vers le champ
        xs.forEach(function (x) { A.s("polygon", { points: [x, G.yS, 180, G.yF, 500, G.yF].join(" "), fill: "#ffd84d", opacity: 0.16 / Math.sqrt(n.k) + 0.05 }, g); });
        // champ : éclairement point par point
        for (var xf = 180; xf < 500; xf += 4) {
          var f = A.calc.lumiere(xs, xf, G);
          A.s("rect", { x: xf, y: G.yF, width: 4, height: 16, fill: "rgb(" + Math.round(40 + 215 * f) + "," + Math.round(40 + 200 * f) + "," + Math.round(40 + 120 * f) + ")" }, g);
        }
        A.s("rect", { x: 320, y: G.yF - 4, width: 40, height: 24, fill: "none", stroke: C.ko, "stroke-width": 3 }, g);
        A.texte(g, "plaie", [340, G.yF + 40], { taille: 15, coul: C.ko });
        A.s("rect", { x: 150, y: G.yF + 16, width: 380, height: 18, fill: C.doux }, g);
        // tête et mains de l'équipe : l'obstacle
        A.s("ellipse", { cx: 340, cy: G.yO, rx: 40, ry: 18, fill: "#3b5bdb", opacity: 0.85 }, g);
        A.texte(g, "tête et mains de l'équipe", [440, G.yO - 2], { taille: 14, coul: C.acc, ancre: "start" });
        xs.forEach(function (x) { A.s("circle", { cx: x, cy: G.yS, r: 13, fill: "#ffd84d", stroke: C.encre, "stroke-width": 2.5 }, g); });
        fig.chip("lumière sur la plaie : " + Math.round(n.minPlaie() * 100) + " %");
      } else {
        A.boite(g, 24, 70, 300, 470, { fond: "#eef6f6", bord: "#2a7f7f", ep: 3 });
        A.texte(g, "Catégorie 1", [174, 100], { taille: 20, gras: 800, halo: false, coul: "#2a7f7f" });
        A.texte(g, "Éclairage général", [174, 128], { taille: 16, halo: false });
        A.icone(g, "lampe", [174, 190], 70, "#2a7f7f");
        A.boite(g, 356, 70, 300, 470, { fond: C.koPale, bord: "#b4233c", ep: 3 });
        A.texte(g, "Catégorie 2", [506, 100], { taille: 20, gras: 800, halo: false, coul: "#b4233c" });
        A.texte(g, "Éclairage opératoire", [506, 128], { taille: 16, halo: false });
        A.icone(g, "lampe", [460, 190], 50, "#b4233c"); A.icone(g, "lampe", [550, 190], 50, "#b4233c");
        (n.rangs || []).forEach(function (r) {
          var x = r[1] ? 380 : 48, y = 260 + r[2] * 80;
          A.boite(g, x, y, 252, 64, { fond: "#fff", bord: r[1] ? "#b4233c" : "#2a7f7f", ep: 2, rx: 10, titre: r[0], taille: 15 });
        });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Deux catégories", jouer: function (j, n) {
      n.rangs = []; n.dessin();
      j.titre("Le cours distingue deux catégories d'éclairage. Range chaque besoin.");
      var S = [["Pour la circulation", "g"], ["Pour l'éclairage du champ opératoire", "o"], ["Pour le nettoyage", "g"], ["Sans ombres gênantes", "o"], ["Pour la préparation", "g"], ["Rendu correct des couleurs", "o"]];
      var res = j.zone("", "");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr 150px;gap:8px;align-items:center">' + S.map(function (x) { return '<span style="font-size:16px">' + x[0] + '</span><span class="trou" data-attendu="' + x[1] + '"></span>'; }).join("") + "</div>");
      j.jetons({
        reserve: res,
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "o", html: "Opératoire" }, { id: "g", html: "Général" }, { id: "g", html: "Général" }, { id: "o", html: "Opératoire" }, { id: "o", html: "Opératoire" }, { id: "g", html: "Général" }],
        aide: "L'éclairage général sert la pièce ; l'éclairage opératoire sert le geste sur le patient.",
        ok: function () {
          var a = 0, b = 0;
          n.rangs = S.map(function (x) { return [x[0], x[1] === "o", x[1] === "o" ? b++ : a++]; }); n.dessin();
          j.bravo("Général : circulation, préparation, nettoyage. Opératoire : champ opératoire, sans ombres gênantes, rendu correct des couleurs.");
          j.suite();
        }
      });
    } },
    { nom: "Chasser l'ombre", jouer: function (j, n) {
      n.mode = "scialytique"; n.k = 1; n.e = 0; n.libre = true; n.dessin();
      j.titre("Avec un seul foyer, la tête et les mains de l'équipe font de l'ombre sur la plaie. Règle le scialytique pour que la plaie reste éclairée à au moins 60 %.");
      j.consigne("Modèle simplifié, en coupe.");
      function verifier() { if (n.libre && n.minPlaie() >= 0.6) fini(); }
      var cK = j.curseur({ nom: "Foyers", min: 1, max: 5, pas: 1, val: 1, change: function (v) { if (!n.libre) return; n.k = v; n.dessin(); verifier(); } });
      var cE = j.curseur({ nom: "Écartement", min: 0, max: 280, pas: 10, val: 0, unite: "", change: function (v) { if (!n.libre) return; n.e = v; n.dessin(); verifier(); } });
      function fini() {
        n.libre = false;
        j.bravo("Plusieurs foyers écartés : quand une tête en masque un, les autres éclairent encore.");
        j.expliquer("<p>Le scialytique doit permettre un <b>éclairage intense</b>, une <b>faible production d'ombre</b>, un <b>réglage de position</b>, de la <b>stabilité</b> et un <b>nettoyage facile</b>. Les foyers multiples et écartés éclairent la plaie sous plusieurs angles : c'est ce qui limite l'ombre portée.</p>");
        j.suite();
      }
      j.reponse(function () { n.k = 3; n.e = 200; cK.regler(3); cE.regler(200); n.dessin(); fini(); });
    } },
    { nom: "Les couleurs", jouer: function (j, n) {
      j.titre("Pourquoi l'éclairage opératoire doit-il rendre correctement les couleurs ?");
      j.choix([
        { html: "Pour distinguer les tissus et le sang, et juger un saignement", juste: true },
        { html: "Pour que les photos de l'intervention soient jolies", aide: "Le cours parle d'hématologie : c'est le sang qui doit être vu tel qu'il est." },
        { html: "Pour économiser l'énergie", aide: "Le rendu des couleurs n'a rien à voir avec la consommation." }
      ], { colonnes: 1, ok: function () { j.bravo("Rendu correct des couleurs (hématologie) : voir le sang tel qu'il est."); j.suite(); } });
    } },
    { nom: "La lampe qui dérive", jouer: function (j, n) {
      j.titre("Pendant l'intervention, la coupole descend lentement toute seule et il faut sans cesse la remonter. Quelle exigence du scialytique n'est pas remplie ?");
      j.choix([
        { html: "La stabilité", juste: true },
        { html: "Le nettoyage facile", aide: "La lampe bouge : c'est sa tenue en position qui est en cause." },
        { html: "L'éclairage intense", aide: "Elle éclaire peut-être très bien ; le problème est qu'elle ne reste pas en place." }
      ], { colonnes: 3, ok: function () { j.bravo("Un scialytique stable reste là où on l'a réglé."); j.suite(); } });
    } },
    { nom: "Coordonner l'installation", jouer: function (j, n) {
      j.titre("L'installation du scialytique doit être étudiée en coordination avec plusieurs éléments. Lequel n'en fait pas partie ?");
      j.choix([
        { html: "Le plafond", aide: "Il le porte : il en fait partie." },
        { html: "La ventilation", aide: "La coupole est sous le soufflage : il faut coordonner." },
        { html: "Le parking du personnel", juste: true },
        { html: "Les bras plafonniers", aide: "Ils partagent le même espace au-dessus de la table." }
      ], { colonnes: 2, ok: function () {
        j.bravo("Plafond, ventilation, bras plafonniers, alimentation électrique, réseaux médicaux.");
        j.suite();
      } });
    } }
  ]
}));
