/* Révision du chapitre 5 : le TD 1.5 (PVC : densité 0,3, rigidité, Tg) et des cas nouveaux sur charges, renforts et adjuvants. */
NIVEAU({
  id: "revision-additifs",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { mode: "cube", V: 1, libre: true };
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "cube") {
        // un bloc de PVC de masse fixée, dont on fait gonfler le volume
        var m = 1.45, s = 150 * Math.cbrt(n.V), cx = 340, cy = 300;
        E.s("path", { d: "M" + (cx - s / 2) + " " + (cy - s / 2 + 30) + " l" + s + " 0 l0 " + s + " l" + (-s) + " 0 Z", fill: PLATEFORME.teinte(0.3), stroke: C.encre, "stroke-width": 3 }, g);
        E.s("path", { d: "M" + (cx - s / 2) + " " + (cy - s / 2 + 30) + " l" + (s * 0.3) + " " + (-s * 0.3) + " l" + s + " 0 l" + (-s * 0.3) + " " + (s * 0.3) + " Z", fill: PLATEFORME.teinte(0.18), stroke: C.encre, "stroke-width": 3 }, g);
        E.s("path", { d: "M" + (cx + s / 2) + " " + (cy - s / 2 + 30) + " l" + (s * 0.3) + " " + (-s * 0.3) + " l0 " + s + " l" + (-s * 0.3) + " " + (s * 0.3) + " Z", fill: PLATEFORME.teinte(0.45), stroke: C.encre, "stroke-width": 3 }, g);
        if (n.V > 1.05) { var r = BIO.hasard(4), nb = Math.round(30 * (1 - 1 / n.V)); for (var i = 0; i < nb; i++) D.rond(g, [cx - s / 2 + 10 + (s - 20) * r(), cy - s / 2 + 40 + (s - 20) * r()], 4 + 6 * r(), { fill: "#fff", stroke: C.jeu, ep: 1.5 }); }
        D.texte(g, "m = 1,45 g", [130, 520], { taille: 20, mono: true });
        D.texte(g, "V = " + E.fmt(n.V, 2) + " cm³", [340, 520], { taille: 20, mono: true });
        D.texte(g, "ρ = " + E.fmt(m / n.V, 2) + " g/cm³", [560, 520], { taille: 20, mono: true, coul: C.jeu });
      } else if (n.mode === "hdt") {
        // montage HDT : poutre sur deux appuis distants de 10 cm, poids, bain d'huile chauffé
        E.s("rect", { x: 120, y: 260, width: 440, height: 220, rx: 10, fill: "#fdf3d8", stroke: C.encre, "stroke-width": 3 }, g);
        D.texte(g, "bain d'huile chauffé", [340, 455], { taille: 16, coul: C.doux });
        E.s("rect", { x: 190, y: 380, width: 22, height: 40, fill: "#9aa0ad" }, g); E.s("rect", { x: 468, y: 380, width: 22, height: 40, fill: "#9aa0ad" }, g);
        var fl = n.flechi ? 26 : 4;
        E.s("path", { d: "M170 368 Q340 " + (368 + fl * 2) + " 510 368 L510 382 Q340 " + (382 + fl * 2) + " 170 382 Z", fill: PLATEFORME.teinte(0.6), stroke: C.encre, "stroke-width": 2.5 }, g);
        D.ligne(g, [340, 150], [340, 368 + fl], C.encre, 5);
        E.s("rect", { x: 300, y: 110, width: 80, height: 44, rx: 6, fill: "#5b6172" }, g);
        D.texte(g, "poids", [340, 132], { taille: 15, coul: "#fff", fond: false });
        D.ligne(g, [201, 510], [479, 510], C.encre, 2); D.texte(g, "10 cm", [340, 530], { taille: 16 });
        D.texte(g, "poutre en PP chargé", [560, 340], { taille: 15, ancre: "end", coul: C.jeu });
      } else if (n.mode === "dose") {
        // jauge de dose : la valeur de la fiche contre la règle du cours
        var X0 = 120, X1 = 600; function xp(v) { return X0 + v / 14 * (X1 - X0); }
        D.ligne(g, [X0, 320], [X1, 320], C.encre, 3);
        [0, 2, 4, 6, 8, 10, 12, 14].forEach(function (v) { D.ligne(g, [xp(v), 312], [xp(v), 328], C.encre, 2); D.texte(g, v + " %", [xp(v), 350], { taille: 15, mono: true, gras: false }); });
        E.s("rect", { x: xp(0), y: 250, width: xp(1) - xp(0), height: 40, fill: PLATEFORME.teinte(0.5) }, g);
        D.texte(g, "anti-oxygène : < 1 %", [xp(1) + 10, 270], { taille: 16, ancre: "start", coul: C.jeu });
        D.fleche(g, [xp(10), 200], [xp(10), 300], C.ko, 4); D.texte(g, "la fiche : 10 %", [xp(10), 185], { taille: 16, coul: C.ko });
      } else {
        // quatre formes du verre
        var F = ["billes", "fibres broyées", "stratifil", "mat"];
        F.forEach(function (f, i) {
          var x = 40 + (i % 2) * 310, y = 110 + Math.floor(i / 2) * 210, cx = x + 145, cy = y + 80;
          E.s("rect", { x: x, y: y, width: 290, height: 190, rx: 20, fill: "#fff", stroke: "#c6cbd8", "stroke-width": 2.5 }, g);
          var r = BIO.hasard(i + 20);
          if (i === 0) for (var k = 0; k < 16; k++) D.rond(g, [cx - 80 + 160 * r(), cy - 40 + 80 * r()], 10, { fill: "#eef6fb", stroke: C.encre, ep: 2 });
          if (i === 1) for (var k1 = 0; k1 < 40; k1++) { var a = r() * 3.14, px0 = cx - 90 + 180 * r(), py0 = cy - 45 + 90 * r(); D.ligne(g, [px0, py0], [px0 + 10 * Math.cos(a), py0 + 10 * Math.sin(a)], C.encre, 2); }
          if (i === 2) for (var k2 = 0; k2 < 6; k2++) D.ligne(g, [cx - 100, cy - 25 + k2 * 10], [cx + 100, cy - 25 + k2 * 10], C.encre, 3);
          if (i === 3) { E.s("rect", { x: cx - 100, y: cy - 35, width: 200, height: 70, fill: "#f4f6fa", stroke: C.encre, "stroke-width": 2 }, g); for (var k3 = 0; k3 < 30; k3++) { var b = r() * 3.14, qx = cx - 90 + 180 * r(), qy = cy - 28 + 56 * r(); D.ligne(g, [qx, qy], [qx + 22 * Math.cos(b), qy + 22 * Math.sin(b)], "#9aa0ad", 1.5); } }
          D.texte(g, f, [cx, y + 165], { taille: 17 });
        });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "PVC à 0,3", jouer: function (j, n) {
      j.fig.astuce("1 cm³ de PVC : 1,45 g. La masse ne change pas.");
      j.titre("TD 1.5 a : le PVC a une densité de 1,45 g/cm³. Règle le volume pour obtenir un produit à 0,3 g/cm³.");
      var fait = false;
      var c = j.curseur({ nom: "volume", min: 1, max: 6, pas: 0.05, val: 1, dec: 2, unite: " cm³", change: function (v) {
        if (fait) return; n.V = v; n.dessin();
        if (Math.abs(1.45 / v - 0.3) < 0.006) { fait = true; ok(); }
      } });
      function ok() {
        c.input.disabled = true;
        j.consigne("Quel adjuvant fait cela ?");
        j.choix([
          { html: "Un agent qui le fait gonfler (mousse)", juste: true },
          { html: "Une charge de CaCO₃", aide: "Une charge minérale est plus dense que le PVC : la densité monterait." },
          { html: "Un plastifiant", aide: "Il assouplit, il ne divise pas la densité par 5." }
        ], { colonnes: 1, ok: function () {
          j.bravo("On le gonfle : V ≈ 4,83 cm³.");
          j.expliquer("<p>Solution du TD : \\(\\rho = M/V\\). Passer de 1,45 à 0,3 g/cm³ veut dire que la masse diminue ou que le volume augmente ; la masse ne peut pas changer, donc on augmente le volume : on le <b>gonfle</b>. \\(V = 1{,}45 / 0{,}3 \\approx 4{,}83\\) cm³ pour 1,45 g.</p>");
          j.suite();
        } });
      }
      j.reponse(function () { var v = 4.85; c.regler(v); n.V = v; n.dessin(); if (!fait) { fait = true; ok(); } });
    } },
    { nom: "Rigidifier, assouplir", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("TD 1.5 b et c : associe chaque objectif pour le PVC à l'adjuvant.");
      var L = [["Augmenter la rigidité de façon substantielle", "r"], ["Diminuer sa Tg (90 °C)", "p"]];
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:8px 10px;align-items:center">' + L.map(function (l) { return "<span>" + l[0] + '</span><span class="trou" data-attendu="' + l[1] + '" style="min-width:190px"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "p", html: "plastifiant" }, { id: "a", html: "antistatique" }, { id: "r", html: "fibres ou charges" }],
        aide: "Ce qui rigidifie : un renfort. Ce qui abaisse Tg : ce qui écarte les chaînes.",
        ok: function () {
          j.bravo("Fibres ou charges ; plastifiant.");
          j.suite();
        }
      });
    } },
    { nom: "Choisir la charge", jouer: function (j, n) {
      n.mode = "hdt"; n.flechi = false; n.dessin();
      j.fig.astuce("Mesure de l'HDT : on chauffe jusqu'à ce que la poutre fléchisse.");
      j.titre("Une pièce en polypropylène doit garder sa forme dans un stérilisateur chaud. Quel ajout donne la plus haute HDT, d'après le tableau du cours ?");
      j.choix([
        { html: "40 % de CaCO₃", aide: "Seulement 75 °C : le carbonate agit peu à haute température." },
        { html: "40 % de talc", aide: "97 °C : mieux, mais un renfort de plus grand rapport de forme fait mieux." },
        { html: "30 % de fibres de verre", juste: true }
      ], { colonnes: 1, ok: function () {
        n.flechi = true; n.dessin();
        j.bravo("148 °C contre 65 °C pour le PP seul.");
        j.expliquer("<p>Exemple ajouté. L'HDT (température de fléchissement sous charge) suit le rapport de forme du renfort : granulaire, puis lamellaire, puis fibrillaire.</p>");
        j.suite();
      } });
    } },
    { nom: "Trouver l'erreur", jouer: function (j, n) {
      n.mode = "dose"; n.dessin(); j.fig.astuce("");
      j.titre("Une fiche dit : « Les anti-oxygènes s'ajoutent à 10 % dans le PE, ce qui change nettement sa couleur. » Où est l'erreur ?");
      j.choix([
        { html: "Ils s'utilisent à moins de 1 % et ne modifient pas sensiblement la couleur", juste: true },
        { html: "On ne met jamais d'anti-oxygène dans le PE", aide: "Le PE est justement cité, avec le PP et les caoutchoucs." },
        { html: "Il n'y a pas d'erreur", aide: "10 %, c'est l'ordre de grandeur des ignifugeants, pas des anti-oxygènes." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Moins de 1 %, sauf le noir de carbone.");
        j.suite();
      } });
    } },
    { nom: "Quelle forme de verre ?", jouer: function (j, n) {
      n.mode = "verre"; n.dessin();
      j.titre("Associe chaque forme de verre à son usage.");
      var L = [["Billes", "b"], ["Fibres broyées (< 300 µm)", "f"], ["Stratifils (roving)", "s"], ["Mat", "m"]];
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px 10px;align-items:center">' + L.map(function (l) { return "<span>" + l[0] + '</span><span class="trou" data-attendu="' + l[1] + '" style="min-width:240px"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "m", html: "nappe mince de fibres liées" }, { id: "s", html: "fils parallèles pour faire des tissus" }, { id: "b", html: "coulabilité, compression" }, { id: "f", html: "polymères injectables" }],
        aide: "Les billes roulent : elles aident la résine à couler. Les stratifils sont des fils assemblés, tissés ensuite. Le mat est une nappe de quelques dixièmes de millimètre.",
        ok: function () {
          j.bravo("Quatre formes, quatre usages.");
          j.expliquer("<p>Le verre se présente aussi en fibres coupées (3 à 30 mm) pour renforcer les thermoplastiques, et en tissus (entrecroisement de deux ensembles de fils sur métier à tisser). Applications : bateaux, planches à voile, cannes à pêche, pales d'hélicoptère.</p>");
          j.suite();
        }
      });
    } }
  ]
});
