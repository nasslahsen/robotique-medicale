/* Niveau : le roulement. Glissement ou roulement, constitution, contact de la bille et du rouleau, familles. */
NIVEAU({
  id: "roulements",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { mode: "frottement", choisis: {}, surTouche: null, cibles: {}, revele: false };
    var NOMS = { exterieure: "bague extérieure", interieure: "bague intérieure", bille: "bille", cage: "cage" };

    function frottement() {
      // deux caisses poussées : l'une glisse sur le sol, l'autre roule sur des rouleaux
      [[200, "glissement", 110, false], [500, "roulement", 40, true]].forEach(function (c) {
        var x = c[0], sol = 330, haut = c[3] ? sol - 40 : sol;
        E.s("rect", { x: x - 120, y: sol, width: 240, height: 26, fill: MECA.hachures(g, "#9aa0ad", { fond: "#fff" }), stroke: C.encre, "stroke-width": 2 }, g);
        if (c[3]) for (var i = 0; i < 4; i++) D.rond(g, [x - 63 + i * 42, sol - 20], 20, { fill: "#dfe3ea", stroke: C.encre, ep: 2 });
        E.s("rect", { x: x - 70, y: haut - 120, width: 140, height: 120, rx: 6, fill: "#9aa0ad", stroke: C.encre, "stroke-width": 2.5 }, g);
        // effort nécessaire pour pousser : flèche proportionnelle
        D.fleche(g, [x - 76 - c[2], haut - 60], [x - 74, haut - 60], C.x, 7);
        if (n.revele) D.texte(g, c[1], [x, 392], { taille: 22, coul: C.encre });
      });
      D.texte(g, "effort pour pousser", [340, 150], { taille: 20, coul: C.x });
      if (n.revele) roulementFace([340, 500], 0.4, {});
    }
    // roulement à billes vu de face : c centre, k échelle, hl partie surlignée
    function roulementFace(c, k, hl) {
      var Re = 220 * k, Re2 = 180 * k, Ri2 = 118 * k, Ri = 80 * k, rb = 31 * k, Rb = 149 * k, N = 11;
      var H = MECA.hachures(g, "#5b6172", { fond: "#fff" });
      function anneau(r1, r2, f, cl) { E.s("path", { d: "M" + (c[0] + r1) + " " + c[1] + " A" + r1 + " " + r1 + " 0 1 0 " + (c[0] - r1) + " " + c[1] + " A" + r1 + " " + r1 + " 0 1 0 " + (c[0] + r1) + " " + c[1] + " Z M" + (c[0] + r2) + " " + c[1] + " A" + r2 + " " + r2 + " 0 1 1 " + (c[0] - r2) + " " + c[1] + " A" + r2 + " " + r2 + " 0 1 1 " + (c[0] + r2) + " " + c[1] + " Z", fill: f, "fill-rule": "evenodd", stroke: cl || C.encre, "stroke-width": 2.5 }, g); }
      anneau(Re, Re2, hl.exterieure ? hl.exterieure : "#e3e6ee");
      anneau(Ri2, Ri, hl.interieure ? hl.interieure : "#e3e6ee");
      // chemins de roulement : traits fins sur les bagues
      E.s("circle", { cx: c[0], cy: c[1], r: Re2 + 6 * k, fill: "none", stroke: C.doux, "stroke-width": 1.5, "stroke-dasharray": "4 4" }, g);
      E.s("circle", { cx: c[0], cy: c[1], r: Ri2 - 6 * k, fill: "none", stroke: C.doux, "stroke-width": 1.5, "stroke-dasharray": "4 4" }, g);
      // cage : anneau mince entre les billes
      E.s("circle", { cx: c[0], cy: c[1], r: Rb, fill: "none", stroke: hl.cage || "#c9a227", "stroke-width": 12 * k + 4 }, g);
      for (var i = 0; i < N; i++) {
        var a = Math.PI / 2 + i * 2 * Math.PI / N;
        D.rond(g, [c[0] + Rb * Math.cos(a), c[1] - Rb * Math.sin(a)], rb, { fill: i === 0 && hl.bille ? hl.bille : "#cfd5df", stroke: C.encre, ep: 2 });
      }
      return { exterieure: [c[0] + (Re + Re2) / 2 * Math.cos(3.95), c[1] - (Re + Re2) / 2 * Math.sin(3.95)], interieure: [c[0], c[1] + (Ri + Ri2) / 2], bille: [c[0], c[1] - Rb], cage: [c[0] + Rb * Math.cos(Math.PI / 2 + Math.PI / N), c[1] - Rb * Math.sin(Math.PI / 2 + Math.PI / N)] };
    }
    function contact() {
      // bille sur son chemin (contact elliptique) et rouleau (contact rectangulaire)
      var y = 250;
      D.texte(g, "bille", [180, 110], { taille: 24 }); D.texte(g, "rouleau", [500, 110], { taille: 24 });
      E.s("path", { d: "M 60 " + (y + 60) + " Q 180 " + (y + 110) + " 300 " + (y + 60) + " L 300 " + (y + 110) + " L 60 " + (y + 110) + " Z", fill: MECA.hachures(g, "#5b6172", { fond: "#fff" }), stroke: C.encre, "stroke-width": 2 }, g);
      D.rond(g, [180, y], 82, { fill: "#cfd5df", stroke: C.encre, ep: 2.5 });
      E.s("rect", { x: 380, y: y + 60, width: 240, height: 50, fill: MECA.hachures(g, "#5b6172", { fond: "#fff" }), stroke: C.encre, "stroke-width": 2 }, g);
      E.s("rect", { x: 400, y: y - 30, width: 200, height: 90, rx: 6, fill: "#cfd5df", stroke: C.encre, "stroke-width": 2.5 }, g);
      E.s("ellipse", { cx: 400, cy: y + 15, rx: 14, ry: 45, fill: "#e3e6ee", stroke: C.encre, "stroke-width": 2 }, g);
      D.fleche(g, [180, y - 150], [180, y - 88], C.x, 6); D.fleche(g, [500, y - 150], [500, y - 36], C.x, 6);
      // empreintes de contact, vues de dessus
      D.texte(g, "zone de contact vue de dessus", [340, 420], { taille: 18, coul: C.doux });
      var coul = n.revele ? C.jeu : C.acc;
      E.s("ellipse", { cx: 180, cy: 490, rx: 46, ry: 24, fill: PLATEFORME.teinte(0.25), stroke: coul, "stroke-width": 3 }, g);
      E.s("rect", { x: 400, y: 474, width: 200, height: 32, fill: PLATEFORME.teinte(0.25), stroke: coul, "stroke-width": 3 }, g);
      if (n.revele) { D.texte(g, "ellipse", [180, 545], { taille: 20, coul: C.jeu }); D.texte(g, "rectangle", [500, 545], { taille: 20, coul: C.jeu }); }
    }
    function familles() {
      var L = [["billes", "rigide à billes", 120, 190], ["oblique", "contact oblique", 340, 190], ["rouleaux", "rouleaux cylindriques", 560, 190], ["aiguilles", "aiguilles", 230, 430], ["butee", "butée", 450, 430]];
      L.forEach(function (f) {
        MECA.traitAxe(g, [f[2] - 70, f[3] + 60], [f[2] + 70, f[3] + 60]);
        var h = f[0] === "aiguilles" ? 56 : 110;
        MECA.roulement(g, f[2], f[3] + 40, f[0] === "butee" ? 100 : 72, h, { type: f[0] });
        E.s("rect", { x: f[2] - 70, y: f[3] + 40, width: 140, height: 20, fill: "#e8edf5", stroke: C.encre, "stroke-width": 1.5 }, g);
        D.texte(g, f[1], [f[2], f[3] + 92], { taille: 18 });
      });
    }
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "frottement") frottement();
      else if (n.mode === "constitution") {
        var hl = {};
        Object.keys(n.choisis).forEach(function (k) { hl[k] = n.choisis[k] ? "#bfe9d5" : "#f8c9ca"; });
        n.cibles = roulementFace([340, 330], 1.05, hl);
        Object.keys(n.choisis).forEach(function (k) {
          if (!n.choisis[k]) return;
          var p = n.cibles[k], q = k === "interieure" ? [p[0] + 150, p[1] + 150] : k === "exterieure" ? [p[0] - 120, p[1] + 66] : k === "bille" ? [p[0] + 140, p[1] - 100] : [p[0] - 140, p[1] - 100];
          D.ligne(g, p, q, C.ok, 2.5);
          if (k === "exterieure") D.texte(g, NOMS[k], [q[0] - 10, q[1] + 18], { coul: C.ok, taille: 20, ancre: "start" });
          else D.texte(g, NOMS[k], q[0] > p[0] ? [q[0] - 4, q[1] - 14] : [q[0] + 4, q[1] - 14], { coul: C.ok, taille: 20, ancre: q[0] > p[0] ? "start" : "end" });
        });
      } else if (n.mode === "contact") contact();
      else familles();
    };
    D.glisser(fig.svg, {
      debut: function (p) {
        if (!n.surTouche || n.mode !== "constitution") return false;
        var c = [340, 330], r = Math.hypot(p[0] - c[0], p[1] - c[1]), k = 1.05, id = null;
        if (r > 180 * k && r < 225 * k) id = "exterieure";
        else if (r > 78 * k && r < 120 * k) id = "interieure";
        else if (r >= 120 * k && r <= 180 * k) {
          // bille ou cage selon la distance à la bille la plus proche
          var a = Math.atan2(c[1] - p[1], p[0] - c[0]) - Math.PI / 2, pas = 2 * Math.PI / 11, e = Math.abs(((a % pas) + pas * 1.5) % pas - pas / 2);
          id = e * r < 34 ? "bille" : "cage";
        }
        if (id) n.surTouche(id);
        return false;
      }
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Glisser ou rouler", jouer: function (j, n) {
      j.fig.astuce("Deux caisses identiques, poussées à vitesse constante.");
      j.titre("Une caisse glisse sur le sol, l'autre roule sur des rouleaux. Laquelle faut-il pousser le moins fort ?");
      j.choix([
        { html: "Celle qui glisse", aide: "Regarde les flèches rouges : l'effort nécessaire n'est pas le même." },
        { html: "Celle sur les rouleaux", juste: true },
        { html: "Le même effort", aide: "Le contact n'est pas le même : frottement de glissement d'un côté, de roulement de l'autre." }
      ], { ok: function () {
        n.revele = true; n.dessin();
        j.bravo("Le frottement de roulement est bien plus faible.");
        j.expliquer("<p>Les <b>roulements</b> soutiennent et guident, avec un frottement minimal, des éléments en rotation ou oscillants, et transfèrent les charges entre les composants. Ils permettent une précision élevée et des vitesses élevées en réduisant le bruit, l'échauffement, la consommation d'énergie et l'usure. Ils sont normalisés, donc produits en série.</p>");
        j.suite();
      } });
    } },
    { nom: "Constitution", jouer: function (j, n) {
      n.mode = "constitution"; n.choisis = {}; n.dessin();
      j.fig.astuce("Touche les pièces du roulement.");
      var ordre = ["exterieure", "interieure", "bille", "cage"], k = 0, NOMS = { exterieure: "la <b>bague extérieure</b>", interieure: "la <b>bague intérieure</b>", bille: "une <b>bille</b>", cage: "la <b>cage</b>, qui tient les billes à distance" };
      j.titre("Un roulement à billes vu de face. Touche ses pièces une à une.");
      var cons = j.consigne("");
      function poser() { cons.innerHTML = "Touche " + NOMS[ordre[k]] + "."; }
      poser();
      n.surTouche = function (id) {
        if (id === ordre[k]) {
          n.choisis[id] = true; n.dessin(); k++;
          if (k < ordre.length) { j.info("Oui."); poser(); return; }
          n.surTouche = null; cons.innerHTML = "";
          j.bravo("Bagues, billes et cage : tout est repéré.");
          j.expliquer("<p>De l'extérieur vers l'intérieur : 1 bague extérieure, 2 chemin de roulement, 3 bille, 4 cage, 5 chemin de roulement, 6 bague intérieure. Les chemins de roulement (pointillés) sont les pistes creusées dans chaque bague, sur lesquelles roulent les billes.</p>");
          j.suite();
        } else if (!n.choisis[id]) {
          n.choisis[id] = false; n.dessin();
          setTimeout(function () { if (n.choisis[id] === false) { delete n.choisis[id]; n.dessin(); } }, 900);
          j.erreur("Ça, c'est la " + ({ exterieure: "bague extérieure", interieure: "bague intérieure", bille: "bille", cage: "cage" })[id] + ".");
        }
      };
      j.reponse(function () { for (var i = 0; i < 6 && n.surTouche; i++) n.surTouche(ordre[k]); });
    } },
    { nom: "Bille ou rouleau", jouer: function (j, n) {
      n.mode = "contact"; n.revele = false; n.dessin();
      j.fig.astuce("");
      j.titre("À taille égale, le rouleau porte une charge radiale plus forte que la bille. Pourquoi ?");
      j.choix([
        { html: "Son contact avec le chemin est une ligne : la zone d'appui est un rectangle, plus étendu", juste: true },
        { html: "Il est plus lourd", aide: "La masse de l'élément roulant ne porte pas la charge : regarde la zone de contact sous chaque élément." },
        { html: "Il tourne moins vite", aide: "La vitesse n'est pas en cause. Compare les deux empreintes en bas de la figure." }
      ], { colonnes: 1, ok: function () {
        n.revele = true; n.dessin();
        j.bravo("Bille : contact elliptique. Rouleau : contact rectangulaire.");
        j.expliquer("<p>Deux types d'éléments roulants de base distinguent deux familles : la <b>bille</b>, pour les roulements à billes (contact elliptique), et le <b>rouleau</b>, pour les roulements à rouleaux (contact rectangulaire).</p>");
        j.suite();
      } });
    } },
    { nom: "Familles", jouer: function (j, n) {
      n.mode = "familles"; n.dessin();
      j.fig.astuce("");
      j.titre("Associe chaque besoin à la famille de roulement qui lui convient.");
      var besoins = [["Fortes charges radiales", "rouleaux"], ["Peu de place autour de l'arbre", "aiguilles"], ["Efforts axiaux seulement", "butee"], ["Efforts axiaux, montage préchargé", "oblique"]];
      var z = j.zone("", besoins.map(function (b) { return '<div style="display:flex;align-items:center;gap:12px;margin:6px 0"><span style="flex:1;font-size:17px">' + b[0] + '</span><span class="trou" data-attendu="' + b[1] + '" style="min-width:210px"></span></div>'; }).join(""));
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "oblique", html: "contact oblique" }, { id: "butee", html: "butée" }, { id: "billes", html: "rigide à billes" }, { id: "aiguilles", html: "aiguilles" }, { id: "rouleaux", html: "rouleaux cylindriques" }],
        aide: "Regarde les éléments roulants : le rouleau long porte le radial, l'aiguille est fine, la butée a ses bagues perpendiculaires à l'axe.",
        ok: function () {
          j.bravo("Chaque famille a son point fort.");
          j.expliquer("<p>Les roulements rigides à billes conviennent à de nombreuses applications. Les roulements à contact oblique reprennent bien les efforts axiaux et se prêtent aux montages préchargés. Les rouleaux cylindriques supportent de fortes charges radiales. Les roulements à aiguilles réduisent l'encombrement radial. Les butées reprennent les efforts axiaux.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Par où commencer ?", jouer: function (j, n) {
      j.titre("Tu ouvres le catalogue d'un fabricant pour le poignet d'un robot. Par quoi commences-tu ?");
      j.choix([
        { html: "Choisir la famille de roulement, puis la référence", juste: true },
        { html: "Choisir la référence la moins chère, puis vérifier", aide: "Une référence appartient à une famille : sans savoir quelles charges reprendre, impossible de comparer." },
        { html: "Choisir la plus petite référence qui rentre", aide: "L'encombrement compte, mais la nature des charges décide d'abord de la famille." }
      ], { colonnes: 1, ok: function () {
        j.bravo("D'abord la famille, ensuite la référence.");
        j.suite();
      } });
    } }
  ]
});
