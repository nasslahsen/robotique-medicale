/* Niveau : polymères organiques. Modules faibles, effet de la température, liste des caractéristiques, déformation réversible, deux liaisons. */
NIVEAU({
  id: "polymeres-organiques",
  init: function (fig) {
    var C = D.C, svg = fig.svg, g = E.s("g", null, svg);
    var n = { mode: "echelle", logE: 2, T: 20, etire: 0 };
    n.pl = D.plan(svg, [0, 0], 1); // coordonnées du dessin pour les gestes des tests (y vers le bas : [x, −y])
    var X0 = 80, X1 = 610, LMIN = -3, LMAX = 3; // log10 du module en GPa, de 0,001 à 1000 GPa
    function x(l) { return X0 + (l - LMIN) / (LMAX - LMIN) * (X1 - X0); }
    n.x = x;
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "echelle") {
        var y = 350;
        D.texte(g, "module d'Young E (GPa), échelle logarithmique", [345, 150], { taille: 18, coul: C.doux, gras: false });
        var xp = x(Math.log10(3));
        E.s("rect", { x: x(-3), y: y - 90, width: xp - x(-3), height: 40, rx: 10, fill: PLATEFORME.teinte(0.25), stroke: C.jeu, "stroke-width": 2 }, g);
        D.texte(g, "polymères : 0,001 à 3", [(x(-3) + xp) / 2, y - 112], { taille: 17, coul: C.jeu });
        var xm = (x(Math.log10(110)) + x(Math.log10(207))) / 2;
        E.s("rect", { x: xm - 40, y: y - 90, width: 80, height: 40, rx: 10, fill: "#d5d9e2", stroke: C.encre, "stroke-width": 1.5 }, g);
        D.texte(g, "métaux : 110 à 207", [xm - 20, y - 112], { taille: 17 });
        D.ligne(g, [X0, y], [X1, y], C.encre, 3);
        for (var l = LMIN; l <= LMAX; l++) {
          D.ligne(g, [x(l), y - 10], [x(l), y + 10], C.encre, 3);
          D.texte(g, String(Math.pow(10, l)).replace(".", ","), [x(l), y - 28], { taille: 15, mono: true, gras: false });
        }
        var px = x(n.logE);
        D.ligne(g, [px, y], [px, y + 80], D.C.acc, 4);
        if (n.libre) D.poignee(g, [px, y + 80], D.C.acc); else D.rond(g, [px, y + 80], 10, { fill: D.C.acc, stroke: "#fff", ep: 3 });
        D.texte(g, "seringue en PE", [px, y + 125], { taille: 18, coul: D.C.acc });
        fig.chip("E ≈ " + E.fmt(Math.pow(10, n.logE), n.logE < 0 ? 3 : n.logE < 1 ? 2 : 0) + " GPa");
      } else if (n.mode === "temp") {
        fig.chip("T = " + Math.round(n.T) + " °C");
        // résistance relative d'un polymère qui chute avant 200 °C (allure qualitative)
        var O = [110, 470], W = 480, H = 300;
        D.fleche(g, O, [O[0] + W + 40, O[1]], C.encre, 3); D.fleche(g, O, [O[0], O[1] - H - 40], C.encre, 3);
        D.texte(g, "T (°C)", [O[0] + W + 30, O[1] + 30], { taille: 17 });
        D.texte(g, "résistance d'un polymère", [O[0] + 10, O[1] - H - 50], { ancre: "start", taille: 17 });
        var pts = [];
        for (var t = 0; t <= 300; t += 5) { var r = 1 / (1 + Math.exp((t - 150) / 18)); pts.push([O[0] + t / 300 * W, O[1] - r * H]); }
        E.s("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: C.jeu, "stroke-width": 5 }, g);
        [0, 100, 200, 300].forEach(function (t) { D.ligne(g, [O[0] + t / 300 * W, O[1]], [O[0] + t / 300 * W, O[1] + 10], C.encre, 2); D.texte(g, String(t), [O[0] + t / 300 * W, O[1] + 28], { taille: 15, mono: true, gras: false }); });
        D.ligne(g, [O[0] + 200 / 300 * W, O[1] - H], [O[0] + 200 / 300 * W, O[1]], C.ko, 2, "6 5");
        var xt = O[0] + n.T / 300 * W;
        D.ligne(g, [xt, O[1] - H - 20], [xt, O[1]], D.C.acc, 3);
      } else {
        fig.chip(null);
        // tube qu'on étire de 100 % puis relâche
        var L = 280 * (1 + n.etire);
        D.texte(g, "tube souple en polymère", [340, 190], { taille: 19, coul: C.doux, gras: false });
        E.s("rect", { x: 340 - L / 2, y: 270, width: L, height: 70, rx: 35, fill: PLATEFORME.teinte(0.3), stroke: C.jeu, "stroke-width": 3 }, g);
        if (n.etire > 0.05) { D.fleche(g, [340 - L / 2 + 10, 305], [340 - L / 2 - 50, 305], C.ko, 5); D.fleche(g, [340 + L / 2 - 10, 305], [340 + L / 2 + 50, 305], C.ko, 5); }
        D.ligne(g, [200, 390], [480, 390], C.encre, 3); D.ligne(g, [200, 380], [200, 400], C.encre, 3); D.ligne(g, [480, 380], [480, 400], C.encre, 3);
        D.texte(g, "10 cm au repos", [340, 420], { taille: 17 });
      }
    };
    D.glisser(svg, {
      debut: function () { return n.mode === "echelle" && n.libre; },
      bouge: function (p) {
        if (!n.libre) return;
        n.logE = Math.max(LMIN, Math.min(LMAX, LMIN + (p[0] - X0) / (X1 - X0) * (LMAX - LMIN)));
        n.dessin();
      },
      fin: function () { if (n.surLache) n.surLache(n.logE); }
    });
    n.libre = true;
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Placer un module", jouer: function (j, n) {
      j.fig.astuce("Glisse le repère bleu le long de l'échelle.");
      j.titre("Le corps d'une seringue est en polyéthylène. Place son module sur l'échelle, dans la zone qui convient.");
      n.surLache = function (l) {
        if (l < -3 + 1e-6 || l > Math.log10(3)) { j.erreur("Un polymère n'est pas aussi rigide qu'un métal : cherche la zone des valeurs typiques des polymères, à gauche."); return; }
        n.surLache = null; n.libre = false; n.dessin();
        j.bravo("Dans la zone 0,001 à 3 GPa.");
        j.expliquer("<p>Les <b>polymères organiques</b> ont des <b>modules faibles</b> : valeurs typiques 0,001 à 3 GPa, valeurs extrêmes 0 à 100 GPa. Bien moins qu'un métal : 110 GPa pour le Ti-6Al-4V, 207 GPa pour un acier (tableau du cours).</p>");
        j.suite();
      };
      j.reponse(function () { n.libre = true; n.logE = 0; n.dessin(); if (n.surLache) n.surLache(0); });
    } },
    { nom: "Quand ça chauffe", jouer: function (j, n) {
      n.mode = "temp"; n.dessin();
      j.fig.astuce("Fais varier la température et regarde la résistance.");
      j.titre("Au-delà de quelle température aucun polymère ne présente de résistance intéressante ?");
      j.curseur({ nom: "T", min: 0, max: 300, pas: 5, val: 20, unite: " °C", change: function (v) { n.T = v; n.dessin(); } });
      j.nombre({ avant: "T >", apres: "°\\text{C}", cases: [{ attendu: 200, tol: 0 }], ligne: true,
        aide: function () { return "Regarde la ligne rouge en tirets sur la figure : c'est la limite donnée par le cours."; },
        ok: function () {
          j.bravo("Aucun polymère n'est intéressant au-dessus de 200 °C.");
          j.expliquer("<p>Les <b>modules des polymères varient avec la température</b>. Courbe qualitative : chaque polymère a sa propre chute, mais le cours retient qu'aucun ne présente de résistance intéressante à T > 200 °C.</p>");
          j.suite();
        } });
    } },
    { nom: "Trouve l'erreur", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("« Les polymères ont une conductivité thermique faible, une conductivité électrique élevée, résistent à la corrosion et sont faciles à mettre en forme. » Quel morceau est faux ?");
      j.choix([
        { html: "conductivité thermique faible", aide: "Juste : un manche en plastique ne brûle pas les doigts." },
        { html: "conductivité électrique élevée", juste: true },
        { html: "résistent à la corrosion", aide: "C'est dans la liste du cours." },
        { html: "faciles à mettre en forme", aide: "C'est même un de leurs gros avantages (chapitre 7)." }
      ], { colonnes: 2, ok: function () {
        j.bravo("Conductivité électrique presque nulle.");
        j.expliquer("<p>Pas d'électrons libres dans les liaisons covalentes : les polymères sont des isolants électriques. C'est pourquoi on gaine les câbles et les sondes avec des polymères.</p>");
        j.suite();
      } });
    } },
    { nom: "Réversible", jouer: function (j, n) {
      n.mode = "tube"; n.etire = 0; n.dessin();
      j.titre("Ce tube de 10 cm supporte une déformation réversible d'environ 100 %. Jusqu'à quelle longueur peut-on l'étirer et le voir revenir ?");
      j.nombre({ avant: "L =", apres: "\\text{cm}", cases: [{ attendu: 20, tol: 0 }], ligne: true,
        aide: function () { return "100 % de 10 cm, c'est 10 cm de plus."; },
        ok: function () {
          E.anime(900, function (u) { n.etire = Math.sin(u * Math.PI); n.dessin(); });
          j.bravo("20 cm, puis il revient à 10 cm.");
          j.expliquer("<p>Les polymères supportent de <b>grandes déformations réversibles (environ 100 %)</b>. Un métal ou une céramique casse ou se déforme pour toujours bien avant.</p>");
          j.suite();
        } });
    } },
    { nom: "Deux liaisons", jouer: function (j, n) {
      j.titre("Les polymères organiques sont faits de molécules contenant surtout du carbone et de l'hydrogène. Complète.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;font-size:18px">' +
        '<span>Liaisons entre atomes dans une molécule</span><span class="trou" data-attendu="c" style="min-width:150px"></span>' +
        '<span>Liaisons entre les molécules</span><span class="trou" data-attendu="f" style="min-width:150px"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "f", html: "faibles" }, { id: "m", html: "métalliques" }, { id: "c", html: "covalentes" }],
        aide: "Dans la molécule : des électrons partagés. Entre molécules : des interactions électrostatiques.",
        ok: function () {
          j.bravo("Intramoléculaires covalentes, intermoléculaires faibles.");
          j.expliquer("<p>On distingue les <b>liaisons intramoléculaires</b> (entre atomes dans les molécules : covalentes) et les <b>liaisons intermoléculaires</b> (entre les molécules : Van der Waals, dipolaires, hydrogène).</p>");
          j.suite();
        }
      });
    } }
  ]
});
