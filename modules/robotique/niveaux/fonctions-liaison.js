/* Niveau : les cinq fonctions d'une liaison, puis trois liaisons complètes du cours (écrou à encoches, vis sur méplat, goupille transversale). */
NIVEAU({
  id: "fonctions-liaison",
  init: function (fig) {
    var C = D.C, M = MECA, g = E.s("g", null, fig.svg);
    var n = { mode: "bride", trouves: {}, faux: null, cisaille: false, surTouche: null, cibles: {} };
    var GR = "#5b6172";
    function coupe(x, y, w, h, angle, cle) {
      var hl = n.trouves[cle], ko = n.faux === cle;
      return E.s("rect", { x: x, y: y, width: w, height: h, fill: M.hachures(g, hl ? C.ok : ko ? C.ko : GR, { fond: "#fff", angle: angle }), stroke: C.encre, "stroke-width": 2.5 }, g);
    }
    function vue(x, y, w, h, cle, rx) {
      var hl = n.trouves[cle], ko = n.faux === cle;
      return E.s("rect", { x: x, y: y, width: w, height: h, rx: rx || 0, fill: hl ? "#d5f2e5" : ko ? "#fcdcdd" : "#dfe3ea", stroke: hl ? C.ok : ko ? C.ko : C.encre, "stroke-width": hl || ko ? 3.5 : 2.5 }, g);
    }
    function etiquette(cle, t, p, ancre) { if (n.trouves[cle]) D.texte(g, t, p, { coul: C.ok, taille: 19, ancre: ancre || "middle" }); }
    n.dessin = function () {
      E.vider(g);
      var yc;
      if (n.mode === "bride") {
        // deux pièces assemblées : une vis serre, deux goupilles positionnent
        coupe(60, 340, 560, 150, 45, "socle");
        coupe(150, 230, 380, 110, -45, "piece");
        E.s("rect", { x: 323, y: 230, width: 34, height: 110, fill: "#fff" }, g); // trou de passage
        E.s("rect", { x: 326, y: 340, width: 28, height: 112, fill: "#fff" }, g); // taraudage
        [205, 475].forEach(function (x) { E.s("rect", { x: x - 11, y: 262, width: 22, height: 150, fill: "#fff" }, g); });
        vue(326, 230, 28, 214, "vis");
        for (var y = 352; y < 440; y += 9) D.ligne(g, [326, y], [354, y + 4], C.encre, 1.2);
        vue(298, 186, 84, 44, "vis", 4);
        [205, 475].forEach(function (x) { vue(x - 11, 262, 22, 150, "goupille", 9); });
        n.cibles = { vis: [340, 210], goupille: [205, 336], goupille2: [475, 336], piece: [420, 270], socle: [560, 440] };
        etiquette("vis", "vis", [410, 196], "start"); etiquette("goupille", "goupilles", [205, 236]);
        D.texte(g, "pièce", [585, 260], { taille: 17, coul: C.doux, gras: false, ancre: "end" });
        D.texte(g, "socle", [600, 516], { taille: 17, coul: C.doux, gras: false, ancre: "end" });
      } else if (n.mode === "ecrou") {
        yc = 300;
        M.arbre(g, 30, 300, yc, 92, { fill: "#e8edf5" });
        M.arbre(g, 300, 640, yc, 62, { fill: "#e8edf5" });
        for (var x = 470; x < 600; x += 10) { D.ligne(g, [x, yc - 62], [x + 5, yc - 52], C.encre, 1.2); D.ligne(g, [x, yc + 62], [x + 5, yc + 52], C.encre, 1.2); }
        E.s("rect", { x: 384, y: yc - 62, width: 70, height: 12, fill: "#fff", stroke: C.encre, "stroke-width": 1.6 }, g); // rainure de l'arbre
        [1, -1].forEach(function (s) {
          M.roulement(g, 340, yc - s * 62, 80, 92, { sens: s, type: "billes", surligne: n.trouves.roulement ? "exterieure" : null, surligneCoul: C.ok });
          // rondelle frein
          var rf = n.trouves.rondelle ? C.ok : n.faux === "rondelle" ? C.ko : "#5b6172";
          E.s("rect", { x: 383, y: s > 0 ? yc - 132 : yc + 62, width: 12, height: 70, fill: rf, stroke: C.encre, "stroke-width": 1.5 }, g);
          // écrou à encoches
          var he = 80, ye = s > 0 ? yc - 62 - he : yc + 62;
          coupe(398, ye, 72, he, 45, "ecrou");
        });
        // languette intérieure dans la rainure, languette extérieure rabattue dans une encoche
        var lc = n.trouves.rondelle ? C.ok : "#5b6172";
        E.s("rect", { x: 383, y: yc - 62, width: 12, height: 10, fill: lc, stroke: C.encre, "stroke-width": 1.2 }, g);
        E.s("rect", { x: 420, y: yc - 142, width: 22, height: 14, fill: "#fff", stroke: C.encre, "stroke-width": 1.6 }, g); // encoche
        E.s("polyline", { points: "389,166 389,152 431,152 431,166", fill: "none", stroke: lc, "stroke-width": 7, "stroke-linejoin": "round" }, g);
        D.texte(g, "épaulement", [292, 186], { taille: 16, coul: C.doux, gras: false, ancre: "end" });
        D.texte(g, "arbre fileté", [600, 400], { taille: 16, coul: C.doux, gras: false });
        n.cibles = { roulement: [340, 192], rondelle: [389, 400], rondelle2: [389, 200], ecrou: [440, 405], ecrou2: [440, 195], arbre: [150, 300] };
        etiquette("roulement", "roulement", [340, 112]);
        etiquette("rondelle", "rondelle frein", [300, 500], "end");
        etiquette("ecrou", "écrou à encoches", [480, 520], "start");
      } else {
        // arbre dans le moyeu d'une roue dentée (coupe longitudinale)
        yc = 330;
        var meplat = n.mode === "meplat";
        coupe(250, yc - 205, 200, 140, 45, "moyeu"); coupe(250, yc + 65, 200, 140, 45, "moyeu");
        [yc - 205, yc + 195].forEach(function (y0) { for (var x = 256; x < 446; x += 22) E.s("rect", { x: x, y: y0 - (y0 < yc ? 14 : 0) + (y0 < yc ? 0 : 10), width: 12, height: 14, fill: "#dfe3ea", stroke: C.encre, "stroke-width": 1.5 }, g); });
        if (meplat) {
          // l'arbre est plaqué en bas : jeu visible en haut, méplat sous la vis
          E.s("path", { d: "M30 " + (yc - 60) + " L265 " + (yc - 60) + " L285 " + (yc - 46) + " L415 " + (yc - 46) + " L435 " + (yc - 60) + " L650 " + (yc - 60) + " L650 " + (yc + 65) + " L30 " + (yc + 65) + " Z", fill: n.trouves.arbre ? "#d5f2e5" : "#e8edf5", stroke: C.encre, "stroke-width": 2.5 }, g);
          M.traitAxe(g, [10, yc + 2], [670, yc + 2]);
          vue(337, yc - 205, 26, 159, "vis");
          for (var yy = yc - 190; yy < yc - 52; yy += 9) D.ligne(g, [337, yy], [363, yy + 4], C.encre, 1.1);
          D.ligne(g, [343, yc - 205], [357, yc - 205], C.encre, 5);
          if (n.fleche) { D.fleche(g, [395, yc - 120], [395, yc - 52], C.v, 5); D.fleche(g, [395, yc + 140], [395, yc + 70], C.v, 5); }
          D.texte(g, "vis", [372, yc - 240], { taille: 18, coul: C.doux, gras: false, ancre: "start" });
          D.texte(g, "méplat", [470, yc - 30], { taille: 17, coul: C.doux, gras: false, ancre: "start" });
        } else {
          M.arbre(g, 30, 650, yc, 65, { fill: "#e8edf5" });
          vue(340, yc - 205, 22, 410, "goupille", 10);
          if (n.cisaille) [yc - 65, yc + 65].forEach(function (y) { D.ligne(g, [318, y], [384, y], C.ko, 6); });
          D.texte(g, "goupille", [372, yc - 240], { taille: 18, coul: C.doux, gras: false, ancre: "start" });
        }
        D.texte(g, "roue (moyeu)", [462, yc - 150], { taille: 17, coul: C.doux, gras: false, ancre: "start" });
        D.texte(g, "arbre", [80, yc - 80], { taille: 17, coul: C.doux, gras: false });
      }
    };
    D.glisser(fig.svg, {
      debut: function (p) {
        if (!n.surTouche) return false;
        var best = null, dmin = 80;
        Object.keys(n.cibles).forEach(function (k) { var c = n.cibles[k], d = Math.hypot(p[0] - c[0], p[1] - c[1]); if (d < dmin) { dmin = d; best = k; } });
        if (best) n.surTouche(best.replace(/2$/, ""));
        return false;
      }
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Cinq fonctions", jouer: function (j, n) {
      j.fig.astuce("Une pièce fixée sur un socle : une vis et deux goupilles.");
      j.titre("Pour fixer cette pièce sur son socle, la liaison doit remplir cinq fonctions. Place chaque fonction devant ce qu'elle fait.");
      var defs = [["SERRER", "créer une précharge et maintenir les surfaces en contact"], ["POSITIONNER", "définir de façon répétable la géométrie relative"], ["TRANSMETTRE", "faire passer un effort ou un couple"], ["AXIAL", "empêcher le déplacement selon l'axe"], ["DESSERRAGE", "conserver la fonction sous vibration et cycles"]];
      var z = j.zone("", defs.map(function (d) { return '<div style="display:flex;align-items:center;gap:10px;margin:6px 0"><span class="trou" data-attendu="' + d[0] + '" style="min-width:200px;min-height:52px"></span><span style="font-size:16px;line-height:1.3">' + d[1] + "</span></div>"; }).join(""));
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "TRANSMETTRE", html: "TRANSMETTRE" }, { id: "DESSERRAGE", html: "PRÉVENIR LE DESSERRAGE" }, { id: "SERRER", html: "SERRER" }, { id: "AXIAL", html: "MAINTENIR AXIALEMENT" }, { id: "POSITIONNER", html: "POSITIONNER" }],
        aide: "Lis le verbe de chaque ligne : contact, géométrie, effort, axe, vibrations.",
        ok: function () {
          j.bravo("Les cinq fonctions sont à leur place.");
          j.expliquer("<p>Une bonne liaison ne demande pas tout à une seule pièce : chaque fonction a son élément. Les vis serrent ; goupilles, épaulements et centrages positionnent ; clavette, cannelures ou moyeu de serrage transmettent le couple.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Qui positionne ?", jouer: function (j, n) {
      j.fig.astuce("Touche les éléments sur la figure.");
      var ordre = [["goupille", "Après chaque démontage, la pièce doit revenir exactement au même endroit. Touche ce qui la positionne."], ["vis", "Touche maintenant ce qui serre la pièce contre le socle."]], k = 0;
      j.titre("La pièce est démontée souvent pour être nettoyée.");
      var c = j.consigne(ordre[0][1]);
      var NOMS = { piece: "la pièce à fixer", socle: "le socle", vis: "la vis : elle serre", goupille: "une goupille : elle positionne" };
      n.surTouche = function (id) {
        if (id === ordre[k][0]) {
          n.trouves[id] = true; n.faux = null; n.dessin(); k++;
          if (k < ordre.length) { j.info("Oui : les goupilles. Suivant."); c.innerHTML = ordre[k][1]; return; }
          n.surTouche = null; c.innerHTML = "";
          j.bravo("Les goupilles positionnent, la vis serre.");
          j.expliquer("<p>La vis passe dans un trou plus large qu'elle : seule, elle laisse la pièce se décaler un peu à chaque montage. Les <b>goupilles</b> ajustées dans les deux pièces fixent la géométrie relative de façon répétable. La vis, elle, crée la précharge.</p>");
          j.suite();
        } else { n.faux = id; n.dessin(); setTimeout(function () { n.faux = null; n.dessin(); }, 800); j.erreur("Ça, c'est " + NOMS[id] + ". Regarde ce qui traverse les deux pièces avec ajustement."); }
      };
      j.reponse(function () { for (var s = 0; s < 4 && n.surTouche; s++) n.surTouche(ordre[k][0]); });
    } },
    { nom: "Écrou à encoches", jouer: function (j, n) {
      n.mode = "ecrou"; n.trouves = {}; n.dessin();
      j.fig.astuce("Un roulement fixé en bout d'arbre par un écrou à encoches.");
      j.titre("Les vibrations du robot pourraient dévisser l'écrou. Touche la pièce qui l'en empêche.");
      var NOMS = { roulement: "le roulement : c'est la pièce serrée", ecrou: "l'écrou à encoches : il serre", arbre: "l'arbre" };
      n.surTouche = function (id) {
        if (id !== "rondelle") { n.faux = id; n.dessin(); setTimeout(function () { n.faux = null; n.dessin(); }, 800); j.erreur("Ça, c'est " + NOMS[id] + ". Cherche la pièce mince entre l'écrou et le roulement."); return; }
        n.surTouche = null; n.trouves.rondelle = true; n.trouves.ecrou = true; n.trouves.roulement = true; n.dessin();
        j.info("Oui : la rondelle frein à languette.");
        j.consigne("Comment bloque-t-elle l'écrou ?");
        j.choix([
          { html: "Sa languette intérieure entre dans la rainure de l'arbre ; une languette extérieure est rabattue dans une encoche de l'écrou", juste: true },
          { html: "Elle colle l'écrou au roulement par frottement", aide: "Regarde les deux languettes : l'une dans l'arbre, l'autre dans l'écrou. C'est un obstacle, pas du frottement." },
          { html: "Elle se visse en sens inverse de l'écrou", aide: "La rondelle n'est pas filetée : regarde où vont ses languettes." }
        ], { colonnes: 1, ok: function () {
          j.bravo("La rondelle ne peut pas tourner sur l'arbre, et l'écrou ne peut pas tourner par rapport à elle.");
          j.expliquer("<p>Le montage est démontable : on serre et desserre l'écrou avec une clé à ergots ; la languette extérieure est déformée avec un outil de frappe et un marteau pour s'engager dans l'encoche. L'écrou serre, la rondelle frein prévient le desserrage.</p>");
          j.suite();
        } });
      };
      j.reponse(function () { if (n.surTouche) n.surTouche("rondelle"); });
    } },
    { nom: "Trouve l'erreur", jouer: function (j, n) {
      n.mode = "meplat"; n.trouves = {}; n.fleche = true; n.dessin();
      j.fig.astuce("Une vis vissée dans le moyeu appuie sur un méplat de l'arbre.");
      j.titre("Un camarade décrit ce montage en trois phrases. Laquelle est fausse ?");
      j.choix([
        { html: "« La vis plaque l'arbre contre la paroi opposée de l'alésage. »", aide: "C'est juste : regarde les flèches violettes et le jeu qui reste en haut." },
        { html: "« Le méplat donne une surface d'appui à la vis et limite le glissement en rotation. »", aide: "C'est juste : sur un arbre rond, la vis pourrait glisser ; le plat l'en empêche." },
        { html: "« La vis garantit un positionnement axial précis de la roue. »", juste: true }
      ], { colonnes: 1, ok: function () {
        j.bravo("La vis retient la roue axialement par frottement, sans positionnement axial précis.");
        j.expliquer("<p>Ce serrage immobilise la roue en rotation et permet de transmettre un couple. La vis aide aussi au maintien axial, mais seulement par frottement : rien ne fixe exactement où la roue s'arrête le long de l'arbre.</p>");
        j.suite();
      } });
    } },
    { nom: "Goupille transversale", jouer: function (j, n) {
      n.mode = "goupille"; n.fleche = false; n.dessin();
      j.fig.astuce("La goupille traverse le moyeu et l'arbre, dans des trous alignés.");
      j.titre("La roue entraîne l'arbre par la goupille. Comment la goupille travaille-t-elle ?");
      j.choix([
        { html: "En cisaillement, aux deux endroits où l'arbre et le moyeu se touchent", juste: true },
        { html: "En traction, le long de son axe", aide: "Le couple fait glisser le moyeu par rapport à l'arbre, en travers de la goupille." },
        { html: "En compression entre ses deux bouts", aide: "Ses bouts ne sont pas serrés : imagine le moyeu qui tourne et l'arbre qui résiste." }
      ], { colonnes: 1, ok: function () {
        n.cisaille = true; n.dessin();
        j.info("Oui : deux sections cisaillées, en rouge.");
        j.consigne("Et qui centre la roue sur l'arbre ?");
        j.choix([
          { html: "Les surfaces cylindriques de l'arbre et de l'alésage", juste: true },
          { html: "La goupille", aide: "La goupille immobilise en rotation et retient axialement. Le centrage vient d'un contact sur tout le tour." }
        ], { colonnes: 1, ok: function () {
          j.bravo("Centrage par les cylindres, rotation et maintien axial par la goupille.");
          j.expliquer("<p>La goupille immobilise la roue en rotation et transmet le couple par cisaillement. Elle contribue aussi au maintien axial. Le centrage, lui, est assuré par l'arbre dans l'alésage.</p>");
          j.suite();
        } });
      } });
    } }
  ]
});
