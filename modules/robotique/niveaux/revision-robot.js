/* Révision du chapitre 1 : nouveau robot cartésien, erreur sur les DDL, rotule, pourquoi la cadence et pourquoi le parallèle. */
NIVEAU({
  id: "revision-robot",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { mode: "portique", t: 0, vitesse: 1 };
    n.dessin = function () {
      E.vider(g);
      var t = n.t;
      if (n.mode === "portique") {
        // robot cartésien vu de face : deux montants, une poutre (X), un chariot (Y, en profondeur), un axe vertical (Z)
        var x = 340 + 150 * Math.sin(t * 0.8), z = 300 + 70 * Math.sin(t * 1.1), y = 0.5 + 0.5 * Math.sin(t * 0.6);
        E.s("rect", { x: 60, y: 500, width: 560, height: 12, fill: "#d9dde6" }, g);
        [[110, 140], [550, 140]].forEach(function (p) { E.s("rect", { x: p[0], y: p[1], width: 20, height: 360, fill: "#9aa0ad" }, g); });
        E.s("rect", { x: 100, y: 120, width: 480, height: 26, rx: 4, fill: "#c9cfdc", stroke: C.encre, "stroke-width": 2 }, g);
        E.s("rect", { x: x - 40, y: 108, width: 80, height: 50, rx: 6, fill: "#ff8a5c", stroke: C.encre, "stroke-width": 2, opacity: 0.6 + 0.4 * y }, g);
        D.ligne(g, [x, 158], [x, z], "#5b6172", 10);
        E.s("rect", { x: x - 12, y: z, width: 24, height: 40, rx: 4, fill: C.jeu }, g);
        for (var i = 0; i < 5; i++) E.s("rect", { x: 220 + i * 50, y: 455, width: 34, height: 44, rx: 6, fill: "#e8edff", stroke: C.encre, "stroke-width": 1.5 }, g);
        D.texte(g, "X", [520, 100], { coul: C.x, taille: 20 }); D.texte(g, "Z", [x + 34, (158 + z) / 2], { coul: C.z, taille: 20 });
        D.texte(g, "Y : le chariot avance vers toi", [340, 560], { coul: C.y, taille: 16, gras: false });
      } else if (n.mode === "plan") {
        var base = [170, 470], L = [110, 95, 80, 65, 50], a = 0, p = base;
        E.s("rect", { x: 130, y: 470, width: 80, height: 26, rx: 6, fill: "#9aa0ad" }, g);
        for (var i = 0; i < 5; i++) {
          a += [70, -30, -25, -30, -20][i] + 12 * Math.sin(t + i);
          var q = [p[0] + L[i] * Math.cos(a * D.DEG), p[1] - L[i] * Math.sin(a * D.DEG)];
          D.ligne(g, p, q, ["#ff8a5c", "#8b3fd9", "#3b5bdb", "#12a26b", "#ff8a5c"][i], 14);
          D.rond(g, p, 10, { fill: "#fff", stroke: C.encre, ep: 3 });
          p = q;
        }
        D.rond(g, p, 9, { fill: C.jeu, stroke: "#fff", ep: 3 });
        D.texte(g, "5 pivots, tous d'axe perpendiculaire au plan", [340, 540], { taille: 16, coul: C.doux, gras: false });
      } else if (n.mode === "rotule") {
        var c = [340, 330], ang = 30 * Math.sin(t), ang2 = 20 * Math.cos(t * 1.3);
        E.s("path", { d: "M220 420 L460 420 L430 360 A92 92 0 0 1 250 360 Z", fill: "#c9cfdc", stroke: C.encre, "stroke-width": 2 }, g);
        D.ligne(g, c, [c[0] + 220 * Math.sin(ang * D.DEG), c[1] - 220 * Math.cos(ang * D.DEG)], "#ff8a5c", 22);
        E.s("circle", { cx: c[0], cy: c[1], r: 58, fill: "#ffb38f", stroke: C.encre, "stroke-width": 2.5 }, g);
        E.s("ellipse", { cx: c[0], cy: c[1], rx: 58, ry: 18 + 10 * Math.sin(ang2 * D.DEG), fill: "none", stroke: C.encre, "stroke-width": 1.5, "stroke-dasharray": "5 4" }, g);
        D.texte(g, "le centre ne bouge pas", [340, 470], { taille: 17, coul: C.doux, gras: false });
      } else if (n.mode === "cycle") {
        var d = [0.30, 0.20, 0.55, 0.15, 0.45, 0.35], mouv = [1, 0, 1, 0, 1, 0], noms = ["approche", "prise", "transfert", "dépose", "retour", "synchro"], x0 = 170, s = 420;
        d.forEach(function (v, i) {
          var w = (mouv[i] ? v / n.vitesse : v) * s;
          D.texte(g, noms[i], [x0 - 14, 110 + i * 64 + 18], { ancre: "end", taille: 18, gras: false });
          E.s("rect", { x: x0, y: 110 + i * 64, width: w, height: 36, rx: 8, fill: mouv[i] ? "#3b5bdb" : "#c6cbd8" }, g);
        });
        D.texte(g, "vitesse × " + n.vitesse, [520, 520], { taille: 20, coul: C.jeu });
      } else {
        // sériel en porte-à-faux contre parallèle à plusieurs chaînes
        D.texte(g, "a", [80, 130], { taille: 24, coul: C.doux }); D.texte(g, "b", [390, 130], { taille: 24, coul: C.doux });
        var f = 6 * Math.sin(t * 3);
        E.s("rect", { x: 80, y: 480, width: 90, height: 26, rx: 6, fill: "#9aa0ad" }, g);
        D.ligne(g, [125, 480], [140, 330], "#ff8a5c", 16); D.ligne(g, [140, 330], [270, 290 + f], "#8b3fd9", 13); D.ligne(g, [270, 290 + f], [320, 330 + 2 * f], "#3b5bdb", 10);
        [[125, 480], [140, 330], [270, 290 + f]].forEach(function (p) { D.rond(g, p, 10, { fill: "#fff", stroke: C.encre, ep: 3 }); E.s("rect", { x: p[0] - 14, y: p[1] + 12, width: 28, height: 18, rx: 4, fill: "#5b6172" }, g); });
        E.s("rect", { x: 400, y: 150, width: 240, height: 26, rx: 6, fill: "#9aa0ad" }, g);
        [430, 520, 610].forEach(function (x) { E.s("rect", { x: x - 16, y: 128, width: 32, height: 22, rx: 4, fill: "#5b6172" }, g); D.ligne(g, [x, 176], [x + (520 - x) * 0.4, 330], "#ff8a5c", 10); D.ligne(g, [x + (520 - x) * 0.4, 330], [520 + (x - 520) * 0.25, 430], "#8b3fd9", 6); });
        E.s("rect", { x: 480, y: 424, width: 80, height: 14, rx: 5, fill: C.jeu }, g);
        D.texte(g, "moteurs gris", [340, 560], { taille: 16, coul: C.doux, gras: false });
      }
    };
    setInterval(function () { n.t += 0.05; n.dessin(); }, 50);
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Nouveau robot", jouer: function (j, n) {
      j.fig.astuce("Un robot de laboratoire qui déplace une pipette au-dessus de tubes.");
      j.titre("Ce robot se déplace selon X, Y et Z avec trois glissières. Écris son schéma, de la base vers l'outil.");
      var z = j.zone("", '<div style="display:flex;gap:8px">' + ["P", "P", "P"].map(function (c) { return '<span class="trou" data-attendu="' + c + '" style="min-width:64px"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "R", html: "R" }, { id: "P", html: "P" }, { id: "P", html: "P" }, { id: "R", html: "R" }, { id: "P", html: "P" }],
        aide: "Une glissière produit une translation : c'est une liaison prismatique, P.",
        ok: function () {
          j.consigne("Quelle forme a son espace de travail ?");
          j.choix([{ html: "Un parallélépipède", juste: true }, { html: "Un cylindre", aide: "Il n'y a aucune rotation : rien ne tourne autour d'un axe." }, { html: "Un anneau", aide: "L'anneau vient de deux rotations, comme sur le SCARA." }], { ok: function () {
            j.bravo("P-P-P, une boîte : chaque glissière donne une arête.");
            j.suite();
          } });
        }
      });
    } },
    { nom: "Trouve l'erreur", jouer: function (j, n) {
      n.mode = "plan"; n.dessin();
      j.fig.astuce("");
      j.titre("Un camarade affirme : « ce bras plan a 5 pivots, donc son effecteur a 5 DDL ». Où est l'erreur ?");
      j.choix([{ html: "Dans un plan, l'effecteur a au plus 3 DDL : x, y et son angle", juste: true }, { html: "Il faut compter 6 DDL, comme dans l'espace", aide: "Tous les axes sont perpendiculaires au plan : l'outil ne peut pas en sortir." }, { html: "Il n'y a pas d'erreur", aide: "Compte ce que l'outil peut faire : avancer en x, en y, tourner dans le plan. Rien d'autre." }], { colonnes: 1, ok: function () {
        j.bravo("5 DDL articulaires, 3 DDL d'effecteur, 2 de redondance.");
        j.expliquer("<p>Les DDL articulaires se comptent sur les articulations ; les DDL de l'effecteur sur ce que l'outil peut faire dans l'espace où il vit. Quand il y a plus d'articulations que nécessaire, le surplus est de la <b>redondance</b>.</p>");
        j.suite();
      } });
    } },
    { nom: "Rotule", jouer: function (j, n) {
      n.mode = "rotule"; n.dessin();
      j.fig.astuce("Une liaison rotule, comme l'épaule.");
      j.titre("Combien de contraintes impose une liaison rotule ?");
      j.nombre({ avant: "6 - \\text{contraintes} = 3, \\text{ donc contraintes} =", cases: [{ attendu: 3, tol: 0 }], ligne: true,
        aide: function () { return "Elle laisse les 3 rotations et bloque les 3 translations."; },
        ok: function () { j.bravo("3 : les trois translations sont bloquées."); j.suite(); } });
    } },
    { nom: "Pourquoi ?", jouer: function (j, n) {
      n.mode = "cycle"; n.vitesse = 1; n.dessin();
      j.fig.astuce("Bleu : mouvement. Gris : temps fixe.");
      j.titre("On achète un robot deux fois plus rapide. Pourquoi la cadence n'est-elle pas doublée ?");
      var bt = E.h("button", "btn clair", "Vitesse × 2", j.el); bt.type = "button";
      bt.addEventListener("click", function () { n.vitesse = n.vitesse === 1 ? 2 : 1; bt.textContent = n.vitesse === 1 ? "Vitesse × 2" : "Vitesse × 1"; });
      j.choix([{ html: "La vitesse ne raccourcit que les mouvements, pas la prise, la dépose ni l'attente", juste: true }, { html: "Le robot n'est pas assez précis à grande vitesse", aide: "La précision ne change pas la durée du cycle." }, { html: "La cadence se calcule en minutes, pas en secondes", aide: "L'unité ne change pas le rapport entre deux cadences." }], { colonnes: 1, ok: function () {
        bt.remove();
        j.bravo("Seuls les temps de mouvement sont divisés par deux.");
        j.suite();
      } });
    } },
    { nom: "Pourquoi le parallèle ?", jouer: function (j, n) {
      n.mode = "deux"; n.dessin();
      j.fig.astuce("a : chaque moteur est porté par le bras. b : tous les moteurs sont sur la base.");
      j.titre("Pourquoi le robot parallèle b peut-il aller plus vite que le sériel a ?");
      j.choix([{ html: "Ses moteurs sont fixés à la base : les masses en mouvement sont plus légères", juste: true }, { html: "Il a plus de moteurs, donc plus de puissance", aide: "Le nombre de moteurs n'est pas la raison : regarde ce qui bouge avec le bras." }, { html: "Son espace de travail est plus grand", aide: "C'est l'inverse : un parallèle a une zone de travail plus réduite." }], { colonnes: 1, ok: function () {
        j.bravo("Moins d'inertie mobile, et plusieurs chaînes pour la rigidité.");
        j.expliquer("<p>Sur le sériel, chaque moteur porte tous ceux qui suivent : il faut accélérer leur masse à chaque mouvement. Sur le parallèle, la plateforme est tenue par plusieurs chaînes à la fois : plus rigide, plus précise, plus rapide, mais avec une zone de travail plus petite.</p>");
        j.suite();
      } });
    } }
  ]
});
