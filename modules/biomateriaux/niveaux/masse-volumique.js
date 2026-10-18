/* Niveau : masse volumique ρ = m/V, moyenne pondérée par les volumes (prépare ρ = ρc X + ρa (1 − X)). */
NIVEAU({
  id: "masse-volumique",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { mode: "plaque", x2: 0.5, libre: true, mousse: false };
    function boite(x, y, l, h, p, fill) {
      // parallélépipède en perspective cavalière : face avant l × h, profondeur p
      var d = p * 0.6;
      E.s("polygon", { points: [[x, y], [x + l, y], [x + l + d, y - d], [x + d, y - d]].join(" "), fill: fill, stroke: C.encre, "stroke-width": 2, opacity: 0.85 }, g);
      E.s("polygon", { points: [[x + l, y], [x + l + d, y - d], [x + l + d, y - d + h], [x + l, y + h]].join(" "), fill: fill, stroke: C.encre, "stroke-width": 2 }, g);
      E.s("rect", { x: x, y: y, width: l, height: h, fill: fill, stroke: C.encre, "stroke-width": 2 }, g);
    }
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "plaque") {
        boite(80, 400, 380, 18, 300, "#e8ebf2");
        D.texte(g, "10 cm", [270, 448], { taille: 20 });
        D.texte(g, "10 cm", [572, 300], { taille: 20, ancre: "start" });
        D.texte(g, "0,1 cm", [70, 410], { taille: 20, ancre: "end" });
        fig.chip("plaque moulée du TD 1.1");
      } else if (n.mode === "melange") {
        var x0 = 110, L = 460, y = 220, h = 150, l2 = L * n.x2;
        E.s("rect", { x: x0, y: y, width: L - l2, height: h, fill: "#f3f5fa", stroke: C.encre, "stroke-width": 2 }, g);
        E.s("rect", { x: x0 + L - l2, y: y, width: l2, height: h, fill: PLATEFORME.teinte(0.35), stroke: C.encre, "stroke-width": 2 }, g);
        if (L - l2 > 60) D.texte(g, "ρ = 1,0", [x0 + (L - l2) / 2, y + h / 2], { taille: 19 });
        if (l2 > 60) D.texte(g, "ρ = 1,2", [x0 + L - l2 / 2, y + h / 2], { taille: 19 });
        D.texte(g, "phase 1 : " + Math.round((1 - n.x2) * 100) + " % du volume", [x0, y - 30], { taille: 17, ancre: "start", coul: C.doux });
        D.texte(g, "phase 2 : " + Math.round(n.x2 * 100) + " %", [x0 + L, y - 30], { taille: 17, ancre: "end", coul: C.jeu });
        var rho = 1.0 * (1 - n.x2) + 1.2 * n.x2;
        D.texte(g, "ρ du mélange = " + E.fmt(rho, 3) + " g/cm³", [340, y + h + 60], { taille: 22, mono: true });
        // jauge
        var gx = function (r) { return x0 + (r - 1) / 0.2 * L; };
        D.ligne(g, [x0, 470], [x0 + L, 470], C.gris, 3);
        [1, 1.05, 1.1, 1.15, 1.2].forEach(function (r) { D.ligne(g, [gx(r), 462], [gx(r), 478], C.gris, 2); D.texte(g, E.fmt(r, 2), [gx(r), 498], { taille: 14, mono: true, gras: false, coul: C.doux }); });
        D.rond(g, [gx(rho), 470], 10, { fill: C.jeu, stroke: "#fff", ep: 3 });
        fig.chip(null);
      } else if (n.mode === "implant") {
        // tige fémorale stylisée
        E.s("path", { d: "M300 120 Q330 100 380 120 L410 160 Q400 200 370 230 L355 520 Q345 545 330 520 L320 240 Q290 200 300 120 Z", fill: "#c9ced8", stroke: C.encre, "stroke-width": 2.5 }, g);
        D.rond(g, [420, 110], 46, { fill: "#e3e6ee", stroke: C.encre, ep: 2.5 });
        D.texte(g, "tige en Ti-6Al-4V", [470, 300], { taille: 18, ancre: "start" });
        D.texte(g, "V = 12 cm³", [470, 330], { taille: 18, ancre: "start", mono: true });
        fig.chip("ρ = 4,43 g/cm³ (tableau du cours)");
      } else {
        boite(90, 330, 120, 120, 80, "#d5dae3");
        D.texte(g, "PVC compact", [150, 490], { taille: 17 });
        D.texte(g, "1,45 g/cm³", [150, 515], { taille: 16, mono: true, coul: C.doux });
        boite(330, 250, 200, 200, 140, "#f1f3f8");
        var r = BIO.hasard(7);
        for (var i = 0; i < 40; i++) D.rond(g, [345 + r() * 170, 265 + r() * 170], 6 + r() * 9, { fill: "#fff", stroke: C.gris, ep: 1.5 });
        D.texte(g, n.mousse ? "PVC gonflé : 0,3 g/cm³" : "PVC gonflé : ?", [430, 520], { taille: 17 });
        D.fleche(g, [225, 380], [315, 360], C.jeu, 4);
        D.texte(g, "même masse", [262, 336], { taille: 16, coul: C.jeu });
        fig.chip(null);
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Volume de la plaque", jouer: function (j, n) {
      j.fig.astuce("La plaque du TD 1.1 : 10 cm × 10 cm × 0,1 cm.");
      j.titre("Quel est son volume ?");
      j.nombre({ avant: "V =", apres: "\\text{cm}^3", cases: [{ attendu: 10, tol: 0.001 }], ligne: true,
        aide: function () { return "Multiplie les trois dimensions."; },
        ok: function () { j.bravo("V = 10 × 10 × 0,1 = 10 cm³."); j.suite(); } });
    } },
    { nom: "Masse volumique", jouer: function (j, n) {
      j.titre("La plaque pèse 11 g. Quelle est sa masse volumique ?");
      j.nombre({ avant: "\\rho =", apres: "\\text{g/cm}^3", cases: [{ attendu: 1.1, tol: 0.001 }], ligne: true,
        aide: function () { return "ρ = m / V : la masse divisée par le volume."; },
        ok: function () {
          j.bravo("ρ = 11 / 10 = 1,1 g/cm³.");
          j.expliquer("<p>La <b>masse volumique</b> \\(\\rho = m / V\\) se donne en g/cm³. Le cours dit souvent « densité » pour cette grandeur, en g/cm³ : on garde son vocabulaire.</p>");
          j.suite();
        } });
    } },
    { nom: "Mélanger deux phases", jouer: function (j, n) {
      n.mode = "melange"; n.x2 = 0.5; n.dessin();
      j.fig.astuce("Un matériau fait de deux phases de masses volumiques 1,0 et 1,2 g/cm³.");
      j.titre("Quelle part du volume doit occuper la phase 2 pour que le mélange ait ρ = 1,15 g/cm³ ?");
      var c = j.curseur({ nom: "phase 2", min: 0, max: 1, pas: 0.05, val: 0.5, unite: "", dec: 2, change: function (v) {
        if (!n.libre) { c.regler(0.75); return; }
        n.x2 = v; n.dessin(); verif(v);
      } });
      function verif(v) {
        if (Math.abs(v - 0.75) > 1e-6) return;
        n.libre = false;
        j.bravo("75 % de phase 2 : 0,25 × 1,0 + 0,75 × 1,2 = 1,15.");
        j.expliquer("<p>La masse volumique d'un mélange est la <b>moyenne des masses volumiques pondérée par les fractions de volume</b> : \\(\\rho = \\rho_1 v_1 + \\rho_2 v_2\\) avec \\(v_1 + v_2 = 1\\). Au chapitre 3, cela donne \\(\\rho = \\rho_c X + \\rho_a (1 - X)\\).</p>");
        j.suite();
      }
      j.reponse(function () { c.regler(0.75); n.x2 = 0.75; n.dessin(); verif(0.75); });
    } },
    { nom: "Trouver l'erreur", jouer: function (j, n) {
      n.libre = true;
      j.titre("Pour 25 % de phase à 1,0 et 75 % de phase à 1,2, un étudiant écrit : « ρ = (1,0 + 1,2) / 2 = 1,1 g/cm³ ». Où est l'erreur ?");
      j.choix([
        { html: "Il a oublié de pondérer par les fractions de volume", juste: true },
        { html: "Il fallait additionner : 1,0 + 1,2 = 2,2", aide: "Un mélange ne peut pas être plus dense que sa phase la plus dense." },
        { html: "Il n'y a pas d'erreur", aide: "Sa formule donne le même poids aux deux phases, alors que l'une occupe trois fois plus de volume." }
      ], { colonnes: 1, ok: function () {
        j.bravo("La bonne valeur est 0,25 × 1,0 + 0,75 × 1,2 = 1,15 g/cm³.");
        j.suite();
      } });
    } },
    { nom: "La tige de hanche", jouer: function (j, n) {
      n.mode = "implant"; n.dessin();
      j.fig.astuce("Exemple ajouté, avec la masse volumique du Ti-6Al-4V donnée dans le cours.");
      j.titre("Une tige fémorale en Ti-6Al-4V occupe 12 cm³. Quelle est sa masse ?");
      j.nombre({ avant: "m =", apres: "\\text{g}", cases: [{ attendu: 53.16, tol: 0.05 }], ligne: true,
        aide: function () { return "m = ρ × V."; },
        ok: function () { j.bravo("m = 4,43 × 12 ≈ 53,2 g."); j.suite(); } });
    } },
    { nom: "Gonfler", jouer: function (j, n) {
      n.mode = "mousse"; n.mousse = false; n.dessin();
      j.fig.astuce("TD 1.5 : on veut un PVC à 0,3 g/cm³ au lieu de 1,45.");
      j.titre("La masse du PVC ne change pas. Que faut-il faire pour passer de 1,45 à 0,3 g/cm³ ?");
      j.choix([
        { html: "Augmenter son volume : le gonfler", juste: true },
        { html: "Le chauffer au-dessus de Tg", aide: "Le volume ne serait pas multiplié par près de 5 : la masse volumique ne bougerait presque pas." },
        { html: "Lui ajouter une charge minérale", aide: "Une charge minérale comme le carbonate de calcium est plus dense que le PVC : ρ augmenterait." }
      ], { colonnes: 1, ok: function () {
        n.mousse = true; n.dessin();
        j.bravo("ρ = m / V : à masse fixe, il faut un volume environ 4,8 fois plus grand.");
        j.expliquer("<p>Le corrigé du TD 1.5 raisonne ainsi : \\(\\rho = M/V\\), la masse ne peut pas changer, donc on augmente le volume en gonflant le PVC (mousse).</p>");
        j.suite();
      } });
    } }
  ]
});
