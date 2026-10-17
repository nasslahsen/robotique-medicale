/* Niveau : choisir un type de roulement d'après le besoin (charges, vitesse, désalignement, encombrement). */
NIVEAU({
  id: "types-roulements",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    // fiches du cours : dessin (types MECA, deux rangées éventuelles) et ce que dit la fiche
    var FICHES = {
      rotule: { nom: "Deux rangées de billes, à rotule", dessin: [["rotule", 2]], lignes: ["charges radiales moyennes, axiales faibles", "grandes fréquences de rotation", "alignement précis des paliers difficile", "déversement admissible : 1,5° à 3°"] },
      cylindriques: { nom: "Rouleaux cylindriques", dessin: [["rouleaux", 1]], lignes: ["charges radiales élevées, aucune charge axiale", "grandes fréquences de rotation", "très bonne coaxialité des portées", "bague séparable ; déversement : 2'"] },
      aiguilles: { nom: "Roulement à aiguilles", dessin: [["aiguilles", 1]], lignes: ["charges radiales importantes, encombrement réduit", "aucune charge axiale ; résiste bien aux chocs", "très bonne coaxialité ; déversement ≈ 0", "bague intérieure séparable"] },
      coniques: { nom: "Rouleaux coniques", dessin: [["conique", 1]], lignes: ["charges radiales et axiales importantes", "pas pour les grandes fréquences de rotation", "montés par paire en opposition, réglage du jeu", "cuvette séparable ; déversement : 2'"] },
      combine: { nom: "Combiné aiguilles et billes", dessin: [["aiguilles", 1], ["butee", 1]], lignes: ["paliers fixes, charges radiales et axiales", "radiales : par les aiguilles", "axiales : par les billes", "encombrement très réduit"] }
    };
    var n = { mode: "besoin", besoin: null, fiche: null };
    function besoin(o) {
      var yc = 330, r = 40, tilt = o.desal || 0;
      D.texte(g, "le besoin", [340, 120], { taille: 22, coul: C.doux });
      var gg = E.s("g", { transform: "rotate(" + (-tilt * 3) + " 340 " + yc + ")" }, g);
      MECA.arbre(gg, 90, 590, yc, r);
      if (tilt) { MECA.traitAxe(g, [80, yc], [600, yc]); D.texte(g, tilt + "° de désalignement (dessin agrandi)", [340, 470], { taille: 19, coul: C.v }); }
      // logement du roulement à choisir
      var hb = o.place ? 30 : 74;
      [-1, 1].forEach(function (s) {
        E.s("rect", { x: 290, y: s < 0 ? yc - r - hb : yc + r, width: 100, height: hb, rx: 4, fill: "#fff", stroke: C.acc, "stroke-width": 3, "stroke-dasharray": "8 6" }, g);
      });
      D.texte(g, "?", [340, yc - r - hb / 2], { taille: 26, coul: C.acc });
      if (o.place) D.texte(g, "très peu de place", [340, yc - r - hb - 26], { taille: 19, coul: C.acc });
      // charges
      if (o.radial) { var L = 30 + o.radial * 40; D.fleche(g, [200, yc - r - 10 - L], [200, yc - r - 6], C.x, 4 + o.radial * 2); D.texte(g, "radiale", [190, yc - r - 26 - L], { coul: C.x, taille: 19 }); }
      if (o.axial) {
        var La = 20 + o.axial * 30;
        D.fleche(g, [40 - (o.alterne ? 0 : 0), yc], [40 + La, yc], C.x, 4 + o.axial * 2);
        if (o.alterne) D.fleche(g, [640, yc], [640 - La, yc], C.x, 4 + o.axial * 2);
        D.texte(g, o.alterne ? "axiales dans les deux sens" : "axiale", [40, yc + 64], { coul: C.x, taille: 19, ancre: "start" });
      }
      var y = tilt ? 510 : 480;
      (o.texte || []).forEach(function (t) { D.texte(g, t, [340, y], { taille: 20, gras: false }); y += 34; });
    }
    function fiche(f) {
      D.texte(g, f.nom, [340, 80], { taille: 26 });
      var nb = f.dessin.length, yb = 360;
      MECA.traitAxe(g, [110, yb + 40], [570, yb + 40]);
      E.s("rect", { x: 130, y: yb, width: 420, height: 40, fill: "#e8edf5", stroke: C.encre, "stroke-width": 1.5 }, g);
      f.dessin.forEach(function (d, i) {
        var x = 340 + (nb === 2 ? (i === 0 ? -50 : 90) : 0);
        if (d[1] === 2) { MECA.roulement(g, x - 44, yb, 88, 150, { type: d[0] }); MECA.roulement(g, x + 44, yb, 88, 150, { type: d[0] }); }
        else if (d[0] === "aiguilles") MECA.roulement(g, x, yb, nb === 2 ? 130 : 170, 120, { type: d[0] });
        else if (d[0] === "butee") MECA.roulement(g, x, yb, 110, 160, { type: d[0] });
        else MECA.roulement(g, x, yb, 140, 200, { type: d[0] });
      });
      var y = 445;
      f.lignes.forEach(function (t) { D.texte(g, t, [340, y], { taille: 20, gras: false }); y += 36; });
    }
    function deversements() {
      // échelle des désalignements admissibles, en degrés (1' = 1/60 °)
      var x0 = 60, s = 120;
      D.fleche(g, [x0, 480], [620, 480], C.gris, 3);
      [0, 1, 2, 3].forEach(function (d) { D.ligne(g, [x0 + d * s, 470], [x0 + d * s, 490], C.gris, 2); D.texte(g, d + "°", [x0 + d * s, 515], { taille: 18, coul: C.doux, mono: true }); });
      D.texte(g, "déversement admissible", [350, 560], { taille: 18, coul: C.doux });
      if (!n.revele) { D.texte(g, "Range les quatre roulements", [340, 250], { taille: 22, coul: C.doux }); D.texte(g, "du moins tolérant au plus tolérant.", [340, 285], { taille: 22, coul: C.doux }); return; }
      [["contact oblique, 1 rangée", 0, 0], ["rigide à billes", 2 / 60, 10 / 60], ["2 rangées de rouleaux, rotule", 1, 2.5], ["2 rangées de billes, rotule", 1.5, 3]].forEach(function (b, i) {
        var y = 160 + i * 74;
        E.s("rect", { x: x0 + b[1] * s - 4, y: y, width: Math.max(8, (b[2] - b[1]) * s + 8), height: 30, rx: 8, fill: PLATEFORME.teinte(0.35), stroke: C.jeu, "stroke-width": 2.5 }, g);
        D.texte(g, b[0], [x0 + b[2] * s + 16, y + 15], { taille: 17, ancre: "start" });
      });
    }
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "besoin") besoin(n.besoin);
      else if (n.mode === "fiche") fiche(FICHES[n.fiche]);
      else deversements();
    };
    n.montrer = function (id) { n.mode = "fiche"; n.fiche = id; n.dessin(); };
    return n;
  },
  etapes: [
    { nom: "Paliers mal alignés", jouer: function (j, n) {
      n.mode = "besoin"; n.besoin = { radial: 2, axial: 1, desal: 2, texte: ["grande vitesse de rotation", "paliers difficiles à aligner"] }; n.dessin();
      j.fig.astuce("Un arbre long porté par deux paliers éloignés.");
      j.titre("Charge radiale moyenne, charge axiale faible, grande vitesse, et les paliers sont désalignés de 2°. Quel roulement ?");
      j.choix([
        { html: "Rigide à billes, une rangée", aide: "Son déversement admissible n'est que de 2' à 10' (minutes d'angle) : 2° est bien au-delà." },
        { html: "Deux rangées de billes, à rotule", juste: true },
        { html: "Rouleaux cylindriques", aide: "Il exige une très bonne coaxialité (2') et ne prend aucune charge axiale." }
      ], { colonnes: 1, ok: function () {
        n.montrer("rotule");
        j.bravo("La rotule de la bague extérieure accepte 1,5° à 3°.");
        j.expliquer("<p>Le <b>déversement admissible</b> est le désalignement que le roulement accepte entre l'arbre et le logement. Les roulements à rotule sont faits pour les cas où l'alignement précis des paliers est difficile.</p>");
        j.suite();
      } });
    } },
    { nom: "Radial pur", jouer: function (j, n) {
      n.mode = "besoin"; n.besoin = { radial: 3, texte: ["aucune charge axiale, grande vitesse", "on veut séparer une bague au montage"] }; n.dessin();
      j.fig.astuce("");
      j.titre("Charge radiale élevée, aucune charge axiale, grande vitesse, et une bague doit se séparer pour le montage. Quel roulement ?");
      j.choix([
        { html: "Rouleaux cylindriques", juste: true },
        { html: "Rouleaux coniques", aide: "Ils ne conviennent pas pour les grandes fréquences de rotation." },
        { html: "Une rangée de billes, contact oblique", aide: "Il est fait pour les charges axiales, et il n'est en général pas démontable." }
      ], { colonnes: 1, ok: function () {
        n.montrer("cylindriques");
        j.bravo("Rouleaux cylindriques, à bague séparable.");
        j.suite();
      } });
    } },
    { nom: "Peu de place", jouer: function (j, n) {
      n.mode = "besoin"; n.besoin = { radial: 3, place: true, texte: ["l'articulation subit des chocs"] }; n.dessin();
      j.fig.astuce("Une petite articulation d'exosquelette.");
      j.titre("Charge radiale importante, chocs, et presque pas de place autour de l'arbre. Quel roulement ?");
      j.choix([
        { html: "Rigide à billes", aide: "Ses billes imposent une hauteur radiale plus grande : regarde la place disponible." },
        { html: "Roulement à aiguilles", juste: true },
        { html: "Butée à billes", aide: "La charge est radiale : une butée reprend les charges dans l'axe." }
      ], { colonnes: 1, ok: function () {
        n.montrer("aiguilles");
        j.bravo("Les aiguilles : radial important sous encombrement réduit.");
        j.expliquer("<p>Les roulements à aiguilles exigent des portées très coaxiales et, sans bague intérieure (douilles, cages à aiguilles), des surfaces de roulement assez dures et lisses : HRC min. = 57, Ra max. = 0,2.</p>");
        j.suite();
      } });
    } },
    { nom: "Radial et axial", jouer: function (j, n) {
      n.mode = "besoin"; n.besoin = { radial: 3, axial: 3, alterne: true, texte: ["vitesse modérée", "on veut pouvoir régler le jeu de fonctionnement"] }; n.dessin();
      j.fig.astuce("");
      j.titre("Charges radiales et axiales importantes, dans les deux sens, vitesse modérée, et on veut régler le jeu. Quel choix ?");
      j.choix([
        { html: "Deux roulements à rouleaux coniques montés en opposition", juste: true },
        { html: "Deux roulements à aiguilles", aide: "Les aiguilles ne supportent aucune charge axiale." },
        { html: "Une butée à billes simple effet", aide: "Simple effet : un seul sens de charge axiale, et pas de charge radiale." }
      ], { colonnes: 1, ok: function () {
        n.montrer("coniques");
        j.bravo("Par paire en opposition, avec réglage du jeu.");
        j.expliquer("<p>Les cônes formés par les chemins de roulement et les rouleaux ont le même sommet S, situé sur l'axe. On les monte par paire, en opposition, pour reprendre l'effort axial dans les deux sens et régler le jeu.</p>");
        j.suite();
      } });
    } },
    { nom: "Désalignement", jouer: function (j, n) {
      n.mode = "deversement"; n.revele = false; n.dessin();
      j.fig.astuce("");
      j.titre("Range ces roulements du plus petit au plus grand déversement admissible.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr;gap:6px">' + ["1", "2", "3", "4"].map(function (k, i) { return '<div style="display:flex;align-items:center;gap:10px"><span style="font:700 18px JetBrains Mono,monospace;width:28px">' + (i + 1) + '</span><span class="trou" data-attendu="' + k + '" style="flex:1"></span></div>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "3", html: "2 rangées de rouleaux, rotule" }, { id: "1", html: "contact oblique, 1 rangée" }, { id: "4", html: "2 rangées de billes, rotule" }, { id: "2", html: "rigide à billes" }],
        aide: "Contact oblique : ≈ 0. Rigide à billes : 2' à 10'. Les rotules se comptent en degrés : 1° à 2,5° pour les rouleaux, 1,5° à 3° pour les billes.",
        ok: function () {
          n.revele = true; n.dessin();
          j.bravo("De ≈ 0 jusqu'à 3°.");
          j.expliquer("<p>Attention aux unités : 1' (une minute d'angle) vaut 1/60 de degré. Les roulements à rotule acceptent des désalignements de l'ordre du degré ; le rigide à billes, quelques minutes ; le contact oblique, presque rien.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Qui porte quoi ?", jouer: function (j, n) {
      n.montrer("combine");
      j.fig.astuce("");
      j.titre("Ce roulement combiné à aiguilles et à billes tient un palier fixe compact. Qui reprend quelle charge ?");
      var z = j.zone("", '<div style="display:flex;flex-direction:column;gap:8px"><div style="display:flex;align-items:center;gap:12px"><span style="width:170px">charges radiales</span><span class="trou" data-attendu="aig" style="min-width:150px"></span></div><div style="display:flex;align-items:center;gap:12px"><span style="width:170px">charges axiales</span><span class="trou" data-attendu="bil" style="min-width:150px"></span></div></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "bil", html: "les billes" }, { id: "aig", html: "les aiguilles" }],
        aide: "L'aiguille, comme le rouleau cylindrique, ne prend aucune charge axiale.",
        ok: function () {
          j.bravo("Aiguilles pour le radial, billes pour l'axial.");
          j.expliquer("<p>Types NX et NKX (simple effet), NKIA (simple effet, avec bague intérieure), NKIB (double effet) : par rapport aux charges supportées, leur encombrement est très réduit.</p>");
          j.suite();
        }
      });
    } }
  ]
});
