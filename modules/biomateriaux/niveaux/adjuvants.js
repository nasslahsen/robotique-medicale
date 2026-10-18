/* Niveau : les adjuvants. Un granulé de polymère et ses additifs : stabilisants, colorants et pigments, anti-chocs, antistatiques, ignifugeants, lubrifiants, anti-retrait, germination, réticulation. */
NIVEAU({
  id: "adjuvants",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { mode: "probleme", probleme: 0, transp: null, libre: true };
    // quatre pièces avec un défaut : chacune appelle un adjuvant
    n.cas = [
      { nom: "cathéter jauni, oxydé à la mise en œuvre", dessin: function (g, x, y) { E.s("path", { d: "M" + (x - 90) + " " + y + " q60 -60 120 0 t60 0", fill: "none", stroke: "#d9b44a", "stroke-width": 12, "stroke-linecap": "round" }, g); } },
      { nom: "boîtier qui attire la poussière", dessin: function (g, x, y) { E.s("rect", { x: x - 70, y: y - 45, width: 140, height: 90, rx: 14, fill: "#e3e6ee", stroke: C.encre, "stroke-width": 3 }, g); var r = BIO.hasard(3); for (var i = 0; i < 18; i++) D.rond(g, [x - 65 + 130 * r(), y - 40 + 80 * r()], 3, { fill: "#8a8f99" }); } },
      { nom: "coque qui casse au moindre choc", dessin: function (g, x, y) { E.s("path", { d: "M" + (x - 70) + " " + (y + 40) + " L" + (x - 70) + " " + (y - 40) + " L" + (x + 70) + " " + (y - 40) + " L" + (x + 70) + " " + (y + 40) + " Z", fill: "#eef6fb", stroke: C.encre, "stroke-width": 3 }, g); E.s("path", { d: "M" + (x - 10) + " " + (y - 40) + " l15 30 l-20 15 l18 35", fill: "none", stroke: C.ko, "stroke-width": 3 }, g); } },
      { nom: "gaine qui s'enflamme trop vite", dessin: function (g, x, y) { E.s("rect", { x: x - 80, y: y + 10, width: 160, height: 24, rx: 12, fill: "#c6cbd8", stroke: C.encre, "stroke-width": 2.5 }, g); E.s("path", { d: "M" + x + " " + (y + 10) + " q-30 -40 0 -80 q30 40 0 80 Z", fill: "#ff9f6b", stroke: C.ko, "stroke-width": 2 }, g); } }
    ];
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "probleme") {
        n.cas.forEach(function (c, i) {
          var x = 40 + (i % 2) * 310, y = 100 + Math.floor(i / 2) * 235;
          E.s("rect", { x: x, y: y, width: 290, height: 205, rx: 22, fill: "#fff", stroke: "#c6cbd8", "stroke-width": 2.5 }, g);
          c.dessin(g, x + 145, y + 80);
          var mots = c.nom.split(" "), l1 = mots.slice(0, 3).join(" "), l2 = mots.slice(3).join(" ");
          D.texte(g, l1, [x + 145, y + 160], { taille: 16 }); D.texte(g, l2, [x + 145, y + 182], { taille: 16 });
        });
      } else if (n.mode === "couleur") {
        // deux flacons : colorant soluble (transparent) et pigment dispersé (opaque)
        [[200, "A"], [480, "B"]].forEach(function (f, i) {
          E.s("path", { d: "M" + (f[0] - 40) + " 150 l0 50 q-50 20 -50 70 l0 200 q0 20 20 20 l140 0 q20 0 20 -20 l0 -200 q0 -50 -50 -70 l0 -50 Z", fill: i ? PLATEFORME.teinte(0.95) : PLATEFORME.teinte(0.35), stroke: C.encre, "stroke-width": 3 }, g);
          if (!i) { D.ligne(g, [f[0] - 45, 380], [f[0] + 45, 380], C.encre, 3); D.texte(g, "graduation visible", [f[0], 410], { taille: 15 }); }
          else D.texte(g, "graduation cachée", [f[0], 520], { taille: 15, coul: C.doux });
          D.texte(g, f[1], [f[0], 120], { taille: 26, coul: C.jeu });
          if (i) { var r = BIO.hasard(11); for (var k = 0; k < 40; k++) D.rond(g, [f[0] - 70 + 140 * r(), 280 + 190 * r()], 4, { fill: "#6e4b8a" }); }
        });
        
      } else if (n.mode === "germes") {
        // sans et avec agent de germination : peu de gros cristaux contre beaucoup de petits
        [[40, "sans agent de germination", 5, 70], [360, "avec agent de germination", 26, 30]].forEach(function (c) {
          E.s("rect", { x: c[0], y: 140, width: 280, height: 300, rx: 18, fill: "#fff", stroke: C.encre, "stroke-width": 2.5 }, g);
          var r = BIO.hasard(c[2]);
          for (var k = 0; k < c[2]; k++) {
            var cx = c[0] + 20 + (240) * r(), cy = 160 + 260 * r(), R = c[3] * (0.7 + 0.5 * r());
            E.s("circle", { cx: cx, cy: cy, r: Math.min(R, cx - c[0] - 4, c[0] + 276 - cx, cy - 144, 436 - cy), fill: PLATEFORME.teinte(0.18), stroke: C.jeu, "stroke-width": 2 }, g);
          }
          D.texte(g, c[1], [c[0] + 140, 470], { taille: 16 });
        });
        D.texte(g, "cristaux d'un polymère semi-cristallin", [340, 110], { taille: 18 });
      } else {
        // dosage : barres horizontales sur une échelle log en %
        var A = [["lubrifiant", 0.1], ["anti-oxygène", 0.8], ["anti-choc", 4], ["ignifugeant", 12]];
        var X0 = 200, X1 = 620;
        function px(v) { return X0 + (Math.log10(v) + 2) / 4 * (X1 - X0); }
        [0.01, 0.1, 1, 10, 100].forEach(function (v) { D.ligne(g, [px(v), 120], [px(v), 470], C.pale, 2); D.texte(g, String(v).replace(".", ",") + " %", [px(v), 495], { taille: 15, mono: true, gras: false }); });
        A.forEach(function (a, i) {
          var y = 160 + i * 80, on = n.montre;
          D.texte(g, a[0], [X0 - 16, y], { taille: 18, ancre: "end" });
          if (on) { E.s("rect", { x: X0, y: y - 16, width: px(a[1]) - X0, height: 32, rx: 8, fill: PLATEFORME.teinte(0.7) }, g); D.texte(g, "≈ " + String(a[1]).replace(".", ",") + " %", [px(a[1]) + 10, y], { taille: 16, ancre: "start" }); }
          else D.ligne(g, [X0, y], [X1, y], "#c6cbd8", 2, "5 6");
        });
        D.texte(g, "concentration en masse (échelle log)", [410, 530], { taille: 16, coul: C.doux, gras: false });
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Un défaut, un adjuvant", jouer: function (j, n) {
      j.fig.astuce("Quatre pièces en polymère, quatre défauts.");
      j.titre("Associe chaque défaut à l'adjuvant qui le corrige.");
      var L = [["Cathéter oxydé à la mise en œuvre", "s"], ["Boîtier qui attire la poussière", "a"], ["Coque qui casse au choc", "c"], ["Gaine qui s'enflamme", "i"]];
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:8px 10px;align-items:center">' + L.map(function (l) { return "<span>" + l[0] + '</span><span class="trou" data-attendu="' + l[1] + '" style="min-width:170px"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "i", html: "ignifugeant" }, { id: "c", html: "anti-choc" }, { id: "s", html: "stabilisant" }, { id: "a", html: "antistatique" }],
        aide: "La poussière est attirée par des charges électriques en surface. L'oxydation pendant la transformation, c'est l'altération de la structure.",
        ok: function () {
          j.bravo("Stabilisant, antistatique, anti-choc, ignifugeant.");
          j.expliquer("<p>Les <b>stabilisants</b> retardent, ralentissent ou inhibent les processus d'altération de la structure pendant la mise en œuvre (souvent en mélange : systèmes de stabilisation). Les <b>antistatiques</b> limitent l'accumulation de charges en surface : pas de poussières fixées, pas d'étincelles. Les <b>anti-chocs</b> sont des copolymères de type ABS ou MBS. Les <b>ignifugeants</b> rendent la combustion plus difficile.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Colorant ou pigment", jouer: function (j, n) {
      n.mode = "couleur"; n.dessin();
      j.fig.astuce("");
      j.titre("On veut une poche colorée dont on voit encore la graduation à travers. Colorant soluble (A) ou pigment dispersé (B) ?");
      j.choix([
        { html: "A : colorant soluble dans la matrice", juste: true },
        { html: "B : pigment insoluble dispersé", aide: "Regarde B : les grains dispersés arrêtent la lumière, on ne voit plus la graduation." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Le colorant soluble garde la transparence.");
        j.expliquer("<p>Les <b>colorants</b> sont solubles dans la matrice polymère : ils permettent des formules colorées transparentes. Les <b>pigments</b> sont insolubles, mis en œuvre sous forme de dispersion : ils sont opaques, et ont une bonne tenue à long terme, ce qui n'est pas toujours le cas des colorants organiques.</p>");
        j.suite();
      } });
    } },
    { nom: "Comment rendre antistatique", jouer: function (j, n) {
      j.titre("Le cours donne deux façons d'obtenir un polymère antistatique. Laquelle de ces méthodes n'en fait pas partie ?");
      j.choix([
        { html: "Un film d'additif en surface, par aérosol ou par exsudation", aide: "C'est la première façon du cours." },
        { html: "Un additif qui augmente la conductivité et facilite l'écoulement des charges", aide: "C'est la deuxième façon du cours." },
        { html: "Un plastifiant qui assouplit la pièce", juste: true }
      ], { colonnes: 1, ok: function () {
        j.bravo("Un plastifiant n'évacue pas les charges.");
        j.suite();
      } });
    } },
    { nom: "Les doses", jouer: function (j, n) {
      n.mode = "dose"; n.montre = false; n.dessin();
      j.titre("Range ces adjuvants de la dose la plus faible à la plus forte.");
      var z = j.zone("", '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">' + ["1", "2", "3", "4"].map(function (c, k) { return (k ? "<span>&lt;</span>" : "") + '<span class="trou" data-attendu="' + c + '" style="min-width:96px"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "3", html: "anti-choc" }, { id: "1", html: "lubrifiant" }, { id: "4", html: "ignifugeant" }, { id: "2", html: "anti-oxygène" }],
        aide: "Lubrifiant : environ 0,1 %. Anti-oxygène : moins de 1 %. Anti-choc : quelques %. Ignifugeant : jusqu'à 10 % et plus.",
        ok: function () {
          n.montre = true; n.dessin();
          j.bravo("Du dixième de pourcent à plus de 10 %.");
          j.expliquer("<p>Lubrifiants : environ 0,1 % en masse. Anti-oxygènes (dans la plupart des polymères hydrocarbonés : PE, PP, caoutchoucs) : en général moins de 1 % (sauf le noir de carbone), sans changer sensiblement la couleur ni les propriétés. Anti-chocs : quelques %, surtout dans le PVC. Ignifugeants : leur concentration peut atteindre et dépasser 10 %.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Les ignifugeants", jouer: function (j, n) {
      j.titre("Comment un ignifugeant rend-il la combustion plus difficile ? Choisis l'effet décrit au cours.");
      j.choix([
        { html: "Il donne lieu à des processus qui absorbent la chaleur (« effet refroidisseur »)", juste: true },
        { html: "Il apporte de l'oxygène au polymère", aide: "L'oxygène nourrit la flamme. Le cours parle au contraire de défavoriser l'échange gazeux avec l'atmosphère." },
        { html: "Il augmente la conductivité électrique", aide: "C'est le rôle d'un antistatique." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Effet refroidisseur.");
        j.expliquer("<p>Les ignifugeants agissent sur l'<b>amorçage</b> ou la <b>propagation</b> de la combustion (feu, fumée, toxicité). Exemples d'effets : absorber de la chaleur, défavoriser l'échange gazeux entre le polymère et l'atmosphère. On cherche plusieurs effets avec un seul ignifugeant.</p>");
        j.suite();
      } });
    } },
    { nom: "Autres adjuvants", jouer: function (j, n) {
      n.mode = "germes"; n.dessin();
      j.fig.astuce("");
      j.titre("Associe chaque adjuvant à ce qu'il fait.");
      var L = [["Lubrifiant externe", "l"], ["Anti-retrait (PVAC)", "r"], ["Agent de germination", "g"], ["Agent de réticulation", "t"]];
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px 10px;align-items:center">' + L.map(function (l) { return "<span>" + l[0] + '</span><span class="trou" data-attendu="' + l[1] + '" style="min-width:230px"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "t", html: "durcit une résine liquide (UP)" }, { id: "g", html: "accélère la cristallisation" }, { id: "l", html: "moins de frottement polymère-métal" }, { id: "r", html: "compense le retrait des BMC, SMC" }],
        aide: "Germination : des germes pour les cristaux. Réticulation : une structure tridimensionnelle. Anti-retrait : pour les compositions à base de polyester insaturé.",
        ok: function () {
          j.bravo("Quatre adjuvants de plus.");
          j.expliquer("<p>Lubrifiants <b>internes</b> : moins de frottement du polymère sur lui-même ; <b>externes</b> : moins de frottement polymère-métal (insolubles, ils exsudent pour former une couche en surface). <b>Agents de germination</b> : ils facilitent et accélèrent la cristallisation des semi-cristallins, abaissent la température de cristallisation (cadence plus haute) et donnent des cristaux plus petits (meilleures propriétés mécaniques et optiques). <b>Agents de réticulation</b> : structure tridimensionnelle, par exemple pour durcir le polyester insaturé (UP).</p>");
          j.suite();
        }
      });
    } }
  ]
});
