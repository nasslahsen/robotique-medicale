/* Niveau : comparer les familles. Classer des pièces, frise historique, composites, choisir selon les propriétés, domaines médicaux. */
NIVEAU({
  id: "comparer-familles",
  init: function (fig) {
    var C = D.C, svg = fig.svg, g = E.s("g", null, svg);
    var n = { mode: "cartes", date: 0 };
    // frise : dates repères (espacées régulièrement comme sur la diapo) et importance relative, allure redessinée
    var DATES = ["−10000", "−5000", "0", "1000", "1500", "1800", "1900", "1940", "1960", "1980", "1990", "2000", "2010", "2020"];
    var FAM = [
      { nom: "métaux", coul: "#8e97a6", v: [0.05, 0.2, 0.45, 0.5, 0.55, 0.7, 0.8, 0.85, 0.88, 0.75, 0.65, 0.55, 0.5, 0.45] },
      { nom: "polymères et élastomères", coul: C.jeu, v: [0.4, 0.35, 0.3, 0.25, 0.2, 0.15, 0.1, 0.08, 0.06, 0.15, 0.22, 0.3, 0.38, 0.45] },
      { nom: "composites", coul: "#12a26b", v: [0.25, 0.25, 0.2, 0.18, 0.15, 0.12, 0.08, 0.05, 0.04, 0.08, 0.13, 0.18, 0.24, 0.3] },
      { nom: "céramiques et verres", coul: "#c9a96e", v: [0.3, 0.3, 0.25, 0.22, 0.2, 0.17, 0.12, 0.08, 0.06, 0.1, 0.15, 0.2, 0.25, 0.3] }
    ];
    n.DATES = DATES;
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "cartes") {
        var cartes = [["Métaux et alliages", "#8e97a6"], ["Céramiques et verres", "#c9a96e"], ["Polymères organiques", C.jeu], ["Composites", "#12a26b"]];
        cartes.forEach(function (c, i) {
          var x = 60 + (i % 2) * 290, y = 150 + Math.floor(i / 2) * 200;
          E.s("rect", { x: x, y: y, width: 270, height: 170, rx: 22, fill: "#fff", stroke: c[1], "stroke-width": 4 }, g);
          D.texte(g, c[0], [x + 135, y + 34], { taille: 19, coul: C.encre });
          // petit dessin de structure
          var cx = x + 135, cy = y + 105;
          if (i === 0) for (var a = 0; a < 4; a++) for (var b = 0; b < 2; b++) D.rond(g, [cx - 60 + a * 40, cy - 20 + b * 40], 13, { fill: "#d5d9e2", stroke: C.encre, ep: 2 });
          if (i === 1) for (a = 0; a < 5; a++) for (b = 0; b < 2; b++) D.rond(g, [cx - 80 + a * 40, cy - 20 + b * 40], (a + b) % 2 ? 9 : 15, { fill: (a + b) % 2 ? "#c9a96e" : "#efe3cc", stroke: C.encre, ep: 2 });
          if (i === 2) [0, 1, 2].forEach(function (k) { E.s("path", { d: BIO.cheminLisse(BIO.chaine(30 + k, 14, [cx - 100, cy - 36, 200, 72], 15, 1.05)), fill: "none", stroke: C.encre, "stroke-width": 2.5, "stroke-linecap": "round" }, g); });
          if (i === 3) { E.s("rect", { x: cx - 90, y: cy - 38, width: 180, height: 76, rx: 10, fill: PLATEFORME.teinte(0.25) }, g); for (a = 0; a < 4; a++) D.ligne(g, [cx - 80, cy - 26 + a * 17], [cx + 80, cy - 26 + a * 17], C.encre, 3); }
        });
      } else if (n.mode === "frise") {
        var X0 = 70, X1 = 630, Y0 = 480, H = 290, dx = (X1 - X0) / (DATES.length - 1);
        D.fleche(g, [X0, Y0], [X1 + 20, Y0], C.encre, 3); D.fleche(g, [X0, Y0], [X0, Y0 - H - 30], C.encre, 3);
        D.texte(g, "importance relative (allure)", [X0 + 14, Y0 - H - 24], { ancre: "start", taille: 16 });
        DATES.forEach(function (d, i) { D.ligne(g, [X0 + i * dx, Y0], [X0 + i * dx, Y0 + 7], C.encre, 2); if ([0, 2, 4, 6, 8, 10, 13].indexOf(i) >= 0) D.texte(g, d, [X0 + i * dx, Y0 + 24], { taille: 14, mono: true, gras: false }); });
        FAM.forEach(function (f) {
          E.s("polyline", { points: f.v.map(function (v, i) { return [X0 + i * dx, Y0 - v * H].join(","); }).join(" "), fill: "none", stroke: f.coul, "stroke-width": 5, "stroke-linejoin": "round" }, g);
        });
        FAM.forEach(function (f, k) {
          E.s("rect", { x: 80 + (k % 2) * 290, y: 538 + Math.floor(k / 2) * 30, width: 26, height: 8, rx: 3, fill: f.coul }, g);
          D.texte(g, f.nom, [114 + (k % 2) * 290, 542 + Math.floor(k / 2) * 30], { ancre: "start", taille: 16 });
        });
        var xd = X0 + n.date * dx;
        D.ligne(g, [xd, Y0 - H - 10], [xd, Y0], D.C.acc, 3, "6 5");
        fig.chip(DATES[n.date].replace("−", "−"));
      } else {
        fig.chip(null);
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Quatre familles", jouer: function (j, n) {
      j.fig.astuce("Les quatre familles de matériaux du cours.");
      j.titre("Range chaque pièce dans sa famille de matériaux.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;font-size:17px">' +
        '<span>Métaux et alliages</span><span class="trou" data-attendu="m" style="min-width:210px"></span>' +
        '<span>Céramiques et verres</span><span class="trou" data-attendu="c" style="min-width:210px"></span>' +
        '<span>Polymères organiques</span><span class="trou" data-attendu="p" style="min-width:210px"></span>' +
        '<span>Composites</span><span class="trou" data-attendu="k" style="min-width:210px"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "p", html: "seringue en PE" }, { id: "k", html: "lame carbone-époxy" }, { id: "m", html: "tige en titane" }, { id: "c", html: "tête en zircone" }],
        aide: "Titane : un métal. Zircone : un oxyde, donc une céramique. PE : un polymère. Carbone + époxy : deux matériaux associés.",
        ok: function () {
          j.bravo("Une pièce, une famille.");
          j.expliquer("<p>Les matériaux se rangent en <b>métaux et alliages</b>, <b>céramiques et verres</b>, <b>polymères organiques</b> et <b>composites</b>. Les trois grandes familles sont les métaux, les minéraux (dont les céramiques) et les organiques naturels et synthétiques (dont les polymères) ; les composites les associent.</p>");
          j.suite();
        }
      });
    } },
    { nom: "La frise", jouer: function (j, n) {
      n.mode = "frise"; n.dessin();
      j.fig.astuce("Allure redessinée de la frise du cours. Déplace la date.");
      j.titre("Vers quelle date l'importance relative des métaux est-elle la plus grande, avant que polymères et composites ne remontent ?");
      j.curseur({ nom: "date", min: 0, max: n.DATES.length - 1, pas: 1, val: 0, change: function (v) { n.date = v; n.dessin(); } });
      j.choix([
        { html: "1800", aide: "En 1800 les métaux montent encore (fonte, aciers). Avance la date." },
        { html: "1960", juste: true },
        { html: "2010", aide: "En 2010 la courbe des métaux est déjà redescendue : recule la date." }
      ], { ok: function () {
        n.date = 8; n.dessin();
        j.bravo("Vers 1960.");
        j.expliquer("<p>Avant, les métaux dominent (or, cuivre, bronze, fer, fonte, aciers, puis alliages légers et superalliages). Depuis 1960, polymères (nylon, PE, PMMA, PC, PS, PP, époxys) et composites (GFRP, CFRP, Kevlar) progressent ; les métaux évoluent surtout par la qualité et les procédés.</p>");
        j.suite();
      } });
    } },
    { nom: "Associations", jouer: function (j, n) {
      n.mode = "cartes"; j.fig.chip(null); n.dessin();
      j.fig.astuce("");
      j.titre("Un composite associe au moins deux matériaux qui ne se mélangent pas. Quelle association pour chaque exemple ?");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;font-size:17px">' +
        '<span>Plastique renforcé de fibres de verre</span><span class="trou" data-attendu="cp" style="min-width:200px"></span>' +
        '<span>Pneu (fils d\'acier + caoutchouc)</span><span class="trou" data-attendu="mp" style="min-width:200px"></span>' +
        '<span>Béton armé</span><span class="trou" data-attendu="cm" style="min-width:200px"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "cm", html: "céramique-métal" }, { id: "cp", html: "céramique-polymère" }, { id: "mp", html: "métal-polymère" }],
        aide: "Le verre est une céramique, l'acier un métal, le caoutchouc un polymère, le béton un minéral.",
        ok: function () {
          j.bravo("Céramique-polymère, métal-polymère, céramique-métal.");
          j.expliquer("<p>Fibre + matrice = composite. Le chapitre 6 en fait le calcul (loi des mélanges).</p>");
          j.suite();
        }
      });
    } },
    { nom: "Choisir la famille", jouer: function (j, n) {
      j.titre("Une pièce doit être isolante, très dure, résister à l'abrasion et garder ses dimensions à 1000 °C. Quelle famille ?");
      j.choix([
        { html: "Métal", aide: "Un métal conduit : il a des électrons libres." },
        { html: "Céramique", juste: true },
        { html: "Polymère", aide: "Aucun polymère ne garde de résistance intéressante au-delà de 200 °C." },
        { html: "Élastomère", aide: "Un élastomère est un polymère souple : ni dur ni tenu à haute température." }
      ], { colonnes: 2, ok: function () {
        j.bravo("Une céramique : dure, isolante, réfractaire, stable.");
        j.expliquer("<p>Pour choisir, on part des propriétés exigées puis on remonte à la famille : électrons libres (conduction) pour les métaux, liaisons ioniques et covalentes rigides (dureté, tenue en température, fragilité) pour les céramiques, chaînes covalentes liées faiblement (souplesse, légèreté, mise en forme facile) pour les polymères.</p>");
        j.suite();
      } });
    } },
    { nom: "Domaines médicaux", jouer: function (j, n) {
      j.titre("Des biomatériaux avancés pour les dispositifs médicaux de nouvelle génération : range chaque application dans son domaine.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;font-size:17px">' +
        '<span>Maladies cardiovasculaires</span><span class="trou" data-attendu="v" style="min-width:200px"></span>' +
        '<span>Chirurgie orthopédique</span><span class="trou" data-attendu="o" style="min-width:200px"></span>' +
        '<span>Ophtalmologie</span><span class="trou" data-attendu="y" style="min-width:200px"></span>' +
        '<span>Autres</span><span class="trou" data-attendu="a" style="min-width:200px"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "y", html: "lentille de contact" }, { id: "a", html: "biocapteur" }, { id: "v", html: "stent" }, { id: "o", html: "prothèse de hanche" }],
        aide: "Le stent va dans une artère, la prothèse de hanche dans l'os, la lentille sur l'œil ; il reste le capteur.",
        ok: function () {
          j.bravo("Bien rangé.");
          j.expliquer("<p>Cardiovasculaire : stimulateurs cardiaques, prothèses et endoprothèses vasculaires, cathéters, valves, stents. Orthopédie : orthèses, prothèses de hanche, tendons artificiels, comblement osseux, réparation de fracture. Ophtalmologie : implants, lentilles. Autres : biocapteurs, libération contrôlée de médicaments, pompes portables et implantables.</p>");
          j.suite();
        }
      });
    } }
  ]
});
