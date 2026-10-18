/* Niveau : céramiques. Familles de composés, pas d'électrons libres, fragilité, légèreté, zircone Y-TZP. */
NIVEAU({
  id: "ceramiques",
  init: function (fig) {
    var C = D.C, svg = fig.svg, g = E.s("g", null, svg);
    var n = { mode: "tableau", metal: null, partenaire: null, libre: true, charge: 0 };
    // un morceau du tableau périodique : métaux (rose), métalloïdes et non-métaux (bleu)
    var CASES = [
      { s: "B", x: 1, y: 0, t: "m" }, { s: "C", x: 2, y: 0, t: "n" }, { s: "N", x: 3, y: 0, t: "n" }, { s: "O", x: 4, y: 0, t: "n" },
      { s: "Al", x: 1, y: 1, t: "M" }, { s: "Si", x: 2, y: 1, t: "m" }, { s: "S", x: 4, y: 1, t: "n" },
      { s: "Ti", x: -3, y: 2, t: "M" }, { s: "Zr", x: -3, y: 3, t: "M" }, { s: "Hf", x: -3, y: 4, t: "M" }, { s: "Be", x: -2, y: 0, t: "M" }
    ];
    n.cases = CASES;
    function pos(c) { return [300 + c.x * 80, 190 + c.y * 84]; }
    n.pos = function (sym) { var c = CASES.filter(function (k) { return k.s === sym; })[0]; return pos(c); };
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "tableau") {
        D.texte(g, "un coin du tableau périodique", [420, 120], { taille: 18, coul: C.doux, gras: false });
        CASES.forEach(function (c) {
          var p = pos(c), choisi = c.s === n.metal || c.s === n.partenaire;
          E.s("rect", { x: p[0] - 37, y: p[1] - 37, width: 74, height: 74, rx: 12, fill: c.t === "M" ? "#ffd9e6" : c.t === "m" ? "#d6f0c9" : "#d3e5ff", stroke: choisi ? D.C.acc : C.encre, "stroke-width": choisi ? 5 : 2 }, g);
          D.texte(g, c.s, p, { taille: 27, fond: false });
        });
        [["#ffd9e6", "métaux"], ["#d6f0c9", "métalloïdes"], ["#d3e5ff", "non-métaux"]].forEach(function (l, i) {
          E.s("rect", { x: 120 + i * 160, y: 579, width: 22, height: 22, rx: 5, fill: l[0], stroke: C.encre, "stroke-width": 1.5 }, g);
          D.texte(g, l[1], [150 + i * 160, 590], { ancre: "start", taille: 16 });
        });
        if (n.metal && n.partenaire) D.texte(g, n.formule || "", [500, 440], { taille: 40, coul: C.jeu });
      } else {
        // deux courbes de traction : métal ductile et céramique fragile
        var O = [110, 470], sx = 1, sy = 1;
        D.fleche(g, O, [620, 470], C.encre, 3); D.fleche(g, O, [110, 110], C.encre, 3);
        D.texte(g, "σ", [90, 120], { taille: 22, italique: true }); D.texte(g, "ε", [620, 495], { taille: 22, italique: true });
        var ce = Math.min(1, n.charge);
        // céramique : droite raide, rupture brutale
        E.s("polyline", { points: [O, [O[0] + 70 * ce, O[1] - 300 * ce]].map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: "#c9a96e", "stroke-width": 6, "stroke-linecap": "round" }, g);
        if (n.charge >= 1) { D.texte(g, "rupture", [200, 150], { taille: 18, coul: C.ko }); D.ligne(g, [172, 160], [188, 180], C.ko, 4); D.ligne(g, [188, 160], [172, 180], C.ko, 4); }
        // métal : droite puis domaine plastique
        var pts = [O], m = Math.min(1, n.charge * 1.1);
        for (var k = 0; k <= 40 * m; k++) { var u = k / 40; pts.push([O[0] + 40 + u * 440, O[1] - 210 - 60 * Math.sin(u * 2.4)]); }
        E.s("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: "#8e97a6", "stroke-width": 6, "stroke-linejoin": "round" }, g);
        D.texte(g, "céramique", [230, 200], { taille: 18, coul: "#a8874a" });
        D.texte(g, "métal ductile", [480, 220], { taille: 18, coul: "#5b6172" });
      }
    };
    svg.addEventListener("click", function (ev) {
      if (!n.libre || !n.surCase) return;
      var p = E.point(svg, ev);
      CASES.forEach(function (c) { var q = pos(c); if (Math.abs(p[0] - q[0]) < 38 && Math.abs(p[1] - q[1]) < 38) n.surCase(c.s); });
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Fabriquer un oxyde", jouer: function (j, n) {
      j.fig.astuce("Une céramique : des atomes métalliques et un élément métalloïde ou non métallique.");
      j.titre("La tête fémorale d'une prothèse est en alumine, un oxyde d'aluminium. Touche les deux éléments qui la composent.");
      n.metal = null; n.partenaire = null;
      var verifier = function () {
        if (!(n.metal && n.partenaire)) return;
        if (n.metal === "Al" && n.partenaire === "O") {
          n.libre = false; n.formule = "Al₂O₃"; n.dessin();
          j.bravo("Al₂O₃ : l'alumine.");
          j.expliquer("<p>Les <b>céramiques</b> sont des matériaux <b>inorganiques</b> (ni organiques ni métalliques), de nature chimique très variée : des composés d'atomes métalliques et d'un élément métalloïde.</p>");
          j.suite();
        } else { j.erreur("Oxyde = composé avec l'oxygène. Prends le métal de « alumine » et l'élément O."); n.metal = null; n.partenaire = null; n.dessin(); }
      };
      n.surCase = function (s) {
        if (["Al", "Ti", "Zr", "Hf", "Be"].indexOf(s) >= 0) n.metal = s; else n.partenaire = s;
        n.dessin(); verifier();
      };
      j.reponse(function () { n.libre = true; n.metal = null; n.partenaire = null; n.surCase("Al"); n.surCase("O"); });
    } },
    { nom: "Les familles", jouer: function (j, n) {
      n.surCase = null;
      j.fig.astuce("");
      j.titre("Range chaque céramique dans sa famille.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center;font-size:17px"><b>oxyde</b><b>nitrure</b><b>carbure</b><b>borure</b>' +
        '<span class="trou" data-attendu="o"></span><span class="trou" data-attendu="n"></span><span class="trou" data-attendu="c"></span><span class="trou" data-attendu="b"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "c", html: "TiC" }, { id: "o", html: "ZrO₂" }, { id: "b", html: "TiB₂" }, { id: "n", html: "AlN" }],
        aide: "Regarde le second élément : O pour un oxyde, N (azote) pour un nitrure, C pour un carbure, B (bore) pour un borure.",
        ok: function () {
          j.bravo("Oxyde, nitrure, carbure, borure.");
          j.expliquer("<p>Familles du cours : <b>oxydes</b> (Al₂O₃, BeO, SiO₂), <b>nitrures</b> (BN, AlN : azote au nombre d'oxydation −III), <b>carbures</b> (UC, TiC : carbone avec un élément autre que l'oxygène), <b>borures</b> (bore avec un corps simple), <b>sulfures</b> (soufre au degré d'oxydation −II). TiB₂ est un exemple ajouté.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Isolante", jouer: function (j, n) {
      j.titre("Les céramiques sont utilisées comme isolants électriques. Pourquoi ?");
      j.choix([
        { html: "Leurs liaisons ioniques ou covalentes ne laissent pas d'électrons libres", juste: true },
        { html: "Leurs liaisons sont faibles", aide: "Les liaisons des céramiques sont fortes : c'est d'ailleurs pour ça qu'elles sont dures." },
        { html: "Elles sont légères", aide: "La légèreté ne dit rien de la conduction : pense à ce qui transporte le courant dans un métal." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Pas d'électrons libres : mauvais conducteurs.");
        j.expliquer("<p>Les propriétés des céramiques proviennent de leurs liaisons fortes : <b>ioniques</b> (A cède des électrons à B) et <b>covalentes</b> (A et B partagent leurs électrons).</p>");
        j.suite();
      } });
    } },
    { nom: "Le choc", jouer: function (j, n) {
      n.mode = "courbes"; n.charge = 0; n.dessin();
      j.titre("Prédis d'abord : on tire de plus en plus fort sur une éprouvette de céramique et une de métal. Laquelle casse sans se déformer ?");
      j.choix([
        { html: "La céramique", juste: true },
        { html: "Le métal", aide: "Un métal ductile peut s'allonger avant de rompre : il a un domaine de déformation permanente." },
        { html: "Les deux pareil", aide: "Leurs liaisons diffèrent : électrons libres d'un côté, liaisons ioniques et covalentes rigides de l'autre." }
      ], { ok: function () {
        E.anime(1500, function (u) { n.charge = u * 1.05; n.dessin(); });
        j.bravo("La céramique est fragile : rupture dans le domaine élastique.");
        j.expliquer("<p>Caractéristiques des céramiques : <b>modules élevés, dures, fragiles</b>, résistantes à l'abrasion, température d'utilisation élevée (SiO₂ 1700 °C, HfC 3950 °C), stabilité dimensionnelle, légèreté. Ordres de grandeur du cours : E = 200 GPa, limite élastique 1200 MPa.</p>");
        j.suite();
      } });
    } },
    { nom: "Une couronne en zircone", jouer: function (j, n) {
      j.titre("Une couronne dentaire contient 0,5 cm³ de zircone ZrO₂ (5,8 g/cm³). Quelle est sa masse ? Et en silice SiO₂ (2 g/cm³) ?");
      j.nombre({ avant: "m_{ZrO_2},\\ m_{SiO_2} =", apres: "\\text{g}", cases: [{ attendu: 2.9, tol: 0.01 }, { attendu: 1, tol: 0.01 }], ligne: true,
        aide: function () { return "m = ρ × V avec V = 0,5 cm³."; },
        ok: function () {
          j.bravo("2,9 g et 1 g.");
          j.expliquer("<p>La <b>zircone Y-TZP</b> (Yttria Tetragonal Zirconia Polycrystal) est une céramique technique faite à 100 % de polycristaux tétragonaux métastables d'oxyde de zirconium, stabilisés par environ 2 à 3 % molaire d'oxyde d'yttrium Y₂O₃. Volume de la couronne : exemple ajouté.</p>");
          j.suite();
        } });
    } }
  ]
});
