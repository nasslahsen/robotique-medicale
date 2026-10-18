/* Niveau : anneaux élastiques (extérieur, intérieur, en E) et goupilles (arrêt d ≈ D/3, positionnement). */
NIVEAU({
  id: "anneaux-goupilles",
  init: function (fig) {
    var C = D.C, M = MECA, g = E.s("g", null, fig.svg);
    var n = { mode: "arbre", anneau: false, fleche: true };
    var GR = "#5b6172";
    function coupe(x, y, w, h, angle) { return E.s("rect", { x: x, y: y, width: w, height: h, fill: M.hachures(g, GR, { fond: "#fff", angle: angle }), stroke: C.encre, "stroke-width": 2.5 }, g); }
    function anneauCoupe(x, y0, y1) { E.s("rect", { x: x, y: Math.min(y0, y1), width: 12, height: Math.abs(y1 - y0), rx: 2, fill: C.ok, stroke: C.encre, "stroke-width": 2 }, g); }
    n.dessin = function () {
      E.vider(g);
      var yc = 320, s;
      if (n.mode === "arbre") {
        // roulement sur un arbre, contre un épaulement ; gorge à droite
        M.arbre(g, 40, 250, yc, 96); M.arbre(g, 250, 640, yc, 70);
        [1, -1].forEach(function (s) {
          M.roulement(g, 292, yc - s * 70, 84, 92, { sens: s });
          E.s("rect", { x: 342, y: s > 0 ? yc - 70 : yc + 63, width: 12, height: 7, fill: "#fff", stroke: C.encre, "stroke-width": 1.6 }, g);
          if (n.anneau) anneauCoupe(342, yc - s * 63, yc - s * 104);
        });
        if (n.fleche && !n.anneau) { D.fleche(g, [262, 196], [372, 196], C.v, 6); D.texte(g, "effort axial", [262, 172], { coul: C.v, taille: 18, ancre: "start" }); }
        D.texte(g, "gorge", [400, yc - 96], { taille: 17, coul: C.doux, gras: false, ancre: "start" });
        D.ligne(g, [356, yc - 74], [396, yc - 92], C.doux, 1.5);
        D.texte(g, "épaulement", [236, yc + 135], { taille: 17, coul: C.doux, gras: false, ancre: "end" });
        D.texte(g, "arbre", [560, yc - 92], { taille: 17, coul: C.doux, gras: false });
      } else if (n.mode === "alesage") {
        // roulement dans l'alésage d'un logement, contre un épaulement ; gorge dans l'alésage
        [1, -1].forEach(function (s) {
          var yo = yc - s * 112;
          coupe(110, s > 0 ? yc - 220 : yc + 112, 470, 108, s > 0 ? 45 : -45);
          coupe(110, s > 0 ? yc - 112 : yc + 80, 110, 32, s > 0 ? 45 : -45);
          M.roulement(g, 262, yc - s * 50, 84, 62, { sens: s });
          E.s("rect", { x: 312, y: s > 0 ? yo - 7 : yo, width: 12, height: 7, fill: "#fff", stroke: C.encre, "stroke-width": 1.6 }, g);
          if (n.anneau) anneauCoupe(312, yo + s * 0 - s * 7, yo + s * 26);
        });
        M.arbre(g, 40, 640, yc, 50);
        if (n.fleche && !n.anneau) { D.fleche(g, [230, 190], [340, 190], C.v, 6); D.texte(g, "effort axial", [230, 168], { coul: C.v, taille: 18, ancre: "start" }); }
        D.texte(g, "logement (alésage)", [580, yc - 238], { taille: 17, coul: C.doux, gras: false, ancre: "end" });
        D.texte(g, "gorge", [400, yc - 138], { taille: 17, coul: C.doux, gras: false, ancre: "start" });
      } else if (n.mode === "E") {
        // vue de face : arbre et sa gorge, anneau en E poussé de côté
        var c = [300, 320];
        E.s("circle", { cx: c[0], cy: c[1], r: 90, fill: "#e8edf5", stroke: C.encre, "stroke-width": 2.5 }, g);
        E.s("circle", { cx: c[0], cy: c[1], r: 70, fill: "none", stroke: C.encre, "stroke-width": 2, "stroke-dasharray": "7 5" }, g);
        D.texte(g, "fond de gorge", [c[0], c[1]], { taille: 16, coul: C.doux, gras: false });
        var dx = n.anneau ? 0 : 190;
        function E1(x0, op) {
          var r = 108, a0 = 45, a1 = 315, d = "";
          for (var a = a0; a <= a1; a += 5) d += (a === a0 ? "M" : " L") + (x0 + r * Math.cos(a * D.DEG)).toFixed(1) + " " + (c[1] - r * Math.sin(a * D.DEG)).toFixed(1);
          var gg = E.s("g", { opacity: op }, g);
          E.s("path", { d: d, fill: "none", stroke: C.encre, "stroke-width": 34, "stroke-linecap": "round" }, gg);
          E.s("path", { d: d, fill: "none", stroke: n.anneau ? C.ok : "#9aa0ad", "stroke-width": 29, "stroke-linecap": "round" }, gg);
          [90, 180, 270].forEach(function (a) {
            var p0 = [x0 + 100 * Math.cos(a * D.DEG), c[1] - 100 * Math.sin(a * D.DEG)], p1 = [x0 + 72 * Math.cos(a * D.DEG), c[1] - 72 * Math.sin(a * D.DEG)];
            D.ligne(gg, p0, p1, C.encre, 22); D.ligne(gg, p0, p1, n.anneau ? C.ok : "#9aa0ad", 17);
          });
        }
        E1(c[0] + dx, 1);
        if (!n.anneau) { D.fleche(g, [c[0] + 330, 470], [c[0] + 190, 470], C.v, 6); D.texte(g, "montage", [c[0] + 260, 500], { coul: C.v, taille: 18 }); }
        D.texte(g, "arbre", [c[0], c[1] + 150], { taille: 17, coul: C.doux, gras: false });
      } else if (n.mode === "arret") {
        // goupille d'arrêt traversant un moyeu et l'arbre
        var R = 72;
        coupe(250, yc - 175, 190, 103, 45); coupe(250, yc + R, 190, 103, -45);
        M.arbre(g, 40, 640, yc, R);
        E.s("rect", { x: 345 - R / 3, y: yc - 175, width: 2 * R / 3, height: 350, rx: 10, fill: n.anneau ? "#d5f2e5" : "#dfe3ea", stroke: n.anneau ? C.ok : C.encre, "stroke-width": 2.5 }, g);
        // cotes D et d
        D.ligne(g, [120, yc - R], [120, yc + R], C.acc, 2.5); D.ligne(g, [108, yc - R], [132, yc - R], C.acc, 2.5); D.ligne(g, [108, yc + R], [132, yc + R], C.acc, 2.5);
        D.texte(g, "D", [96, yc], { coul: C.acc, taille: 24 });
        D.ligne(g, [345 - R / 3, yc + 205], [345 + R / 3, yc + 205], C.acc, 2.5);
        D.texte(g, "d", [345, yc + 232], { coul: C.acc, taille: 24 });
        D.texte(g, "goupille d'arrêt", [470, yc - 150], { taille: 17, coul: C.doux, gras: false, ancre: "start" });
        D.texte(g, "pièces immobilisées", [470, yc + 150], { taille: 17, coul: C.doux, gras: false, ancre: "start" });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Sur un arbre", jouer: function (j, n) {
      j.fig.astuce("Le roulement est contre un épaulement. Une gorge est usinée à sa droite.");
      j.titre("Un effort axial pousse le roulement vers la droite. Quel élément le retient, tout en restant démontable ?");
      j.choix([
        { html: "Un anneau élastique extérieur, pour arbre", juste: true },
        { html: "Un anneau élastique intérieur, pour alésage", aide: "La gorge est sur l'arbre : l'anneau doit serrer l'arbre de l'extérieur." },
        { html: "Une clavette", aide: "La clavette transmet un couple. Ici on veut empêcher un déplacement selon l'axe." }
      ], { colonnes: 1, ok: function () {
        n.anneau = true; n.dessin();
        j.bravo("Anneau extérieur dans la gorge de l'arbre.");
        j.expliquer("<p>Un <b>anneau élastique</b> (circlip) est un élément de retenue monté dans une gorge, sur un arbre ou dans un alésage. Il empêche le déplacement axial d'une pièce tout en restant facilement démontable. Pour arbre : anneau extérieur (NF E 22-163).</p>");
        j.suite();
      } });
    } },
    { nom: "Dans un alésage", jouer: function (j, n) {
      n.mode = "alesage"; n.anneau = false; n.dessin();
      j.fig.astuce("Cette fois, la gorge est dans l'alésage du logement.");
      j.titre("Et ici, quel anneau retient le roulement dans son logement ?");
      j.choix([
        { html: "Anneau extérieur", aide: "Regarde où est la gorge : dans le trou du logement, pas sur l'arbre." },
        { html: "Anneau intérieur", juste: true }
      ], { colonnes: 2, ok: function () {
        n.anneau = true; n.dessin();
        j.bravo("Anneau intérieur, pour alésage (NF E 22-165).");
        j.expliquer("<p>L'anneau intérieur s'écarte contre le fond de la gorge de l'alésage ; l'anneau extérieur se serre dans la gorge de l'arbre. Le nom dit où se trouve la gorge.</p>");
        j.suite();
      } });
    } },
    { nom: "Anneau en E", jouer: function (j, n) {
      n.mode = "E"; n.anneau = false; n.dessin();
      j.fig.astuce("Vue de face : l'arbre, sa gorge en tirets, et un anneau en forme de E (NF L 23-203).");
      j.titre("Cet anneau est ouvert sur un côté. Comment se monte-t-il dans la gorge ?");
      j.choix([
        { html: "Par le côté, en le poussant dans la gorge, sans passer par le bout de l'arbre", juste: true },
        { html: "Par le bout de l'arbre, en le faisant glisser le long de l'axe", aide: "Regarde l'ouverture du E et la flèche : il arrive de côté." }
      ], { colonnes: 1, ok: function () {
        n.anneau = true; n.dessin();
        j.bravo("Il se monte de côté, dans la gorge.");
        j.expliquer("<p>Les anneaux extérieurs et intérieurs s'écartent ou se serrent avec une pince ; l'anneau en E se pousse de côté. Tous servent à la même fonction : maintenir axialement.</p>");
        j.suite();
      } });
    } },
    { nom: "Goupille d'arrêt", jouer: function (j, n) {
      n.mode = "arret"; n.anneau = false; n.dessin();
      j.fig.astuce("Une goupille d'arrêt traverse le moyeu et l'arbre.");
      j.titre("L'arbre a un diamètre D = 24 mm. Quel diamètre d donner à la goupille d'arrêt ?");
      j.nombre({ avant: "d \\approx", apres: "\\text{mm}", cases: [{ attendu: 8, tol: 0.2 }], ligne: true,
        aide: function () { return "La règle du cours relie d au diamètre D de l'arbre : un tiers."; },
        ok: function () {
          n.anneau = true; n.dessin();
          j.bravo("d ≈ D/3 = 8 mm.");
          j.expliquer("<p>Une <b>goupille</b> est une pièce métallique, généralement cylindrique ou conique, qui immobilise deux pièces ou assure leur positionnement relatif avec précision. Pour la goupille d'arrêt, \\(d \\approx D/3\\), montée avec l'ajustement H7/m6.</p>");
          j.suite();
        } });
    } },
    { nom: "Trouve l'erreur", jouer: function (j, n) {
      n.mode = "arbre"; n.anneau = true; n.dessin();
      j.fig.astuce("Le roulement de l'étape 1, retenu par son anneau.");
      j.titre("Un camarade propose : « Pour que la roue ne tourne pas sur l'arbre, j'ajoute un anneau élastique. » Qu'en penses-tu ?");
      j.choix([
        { html: "Faux : l'anneau ne fait que maintenir axialement ; pour le couple, il faut une clavette, une goupille ou un serrage", juste: true },
        { html: "Juste : l'anneau serre l'arbre, donc il bloque la rotation", aide: "L'anneau est logé dans une gorge circulaire : rien n'empêche la pièce de tourner autour de l'arbre." },
        { html: "Juste, à condition de prendre un anneau intérieur", aide: "Intérieur ou extérieur, c'est la position de la gorge qui change, pas la fonction." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Chaque élément a sa fonction.");
        j.expliquer("<p>Anneau élastique : maintenir axialement. Goupille : immobiliser ou positionner. Clavette : transmettre le couple. Avec des goupilles de positionnement, on ajoute une vis de fixation : la vis serre, les goupilles positionnent.</p>");
        j.suite();
      } });
    } }
  ]
});
