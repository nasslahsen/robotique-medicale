/* Niveau : verre, carbone, aramide. Désignation des fils de verre et tex, formes du verre, trois formes du carbone, fibre de carbone contre acier, Kevlar, mica, PTFE. */
NIVEAU({
  id: "fibres-renfort",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { mode: "fil", libre: true, rouleau: 0 };
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "fil") {
        // étiquette d'une bobine de fil de verre
        E.s("rect", { x: 240, y: 110, width: 200, height: 250, rx: 24, fill: "#f4f6fa", stroke: C.encre, "stroke-width": 3 }, g);
        for (var y = 130; y < 350; y += 10) D.ligne(g, [252, y], [428, y + 4], "#d3d8e2", 2);
        E.s("ellipse", { cx: 340, cy: 110, rx: 100, ry: 22, fill: "#e3e6ee", stroke: C.encre, "stroke-width": 3 }, g);
        E.s("ellipse", { cx: 340, cy: 110, rx: 28, ry: 7, fill: "#9aa0ad" }, g);
        var lab = ["E", "C", "9", "68"];
        E.s("rect", { x: 150, y: 400, width: 380, height: 80, rx: 14, fill: "#fff", stroke: C.jeu, "stroke-width": 3 }, g);
        lab.forEach(function (t, i) { D.texte(g, t, [205 + i * 90, 440], { taille: 32, mono: true, coul: n.surligne === i ? C.jeu : C.encre }); });
        D.texte(g, "étiquette de la bobine", [340, 510], { taille: 16, coul: C.doux, gras: false });
      } else if (n.mode === "acier") {
        // deux barres de même rigidité : acier et carbone, leurs masses sur une balance
        var k = n.rouleau;
        D.texte(g, "deux tiges de même longueur et même section", [340, 110], { taille: 18 });
        E.s("rect", { x: 120, y: 170, width: 440, height: 34, rx: 8, fill: "#9aa0ad", stroke: C.encre, "stroke-width": 2.5 }, g);
        D.texte(g, "acier, densité 7,87", [340, 187], { taille: 16, coul: "#fff", fond: false });
        E.s("rect", { x: 120, y: 240, width: 440, height: 34, rx: 8, fill: "#2f323a", stroke: C.encre, "stroke-width": 2.5 }, g);
        D.texte(g, "fibre de carbone, densité 1,75 à 1,95", [340, 257], { taille: 16, coul: "#fff", fond: false });
        // balance
        var a = -0.18 * k;
        D.ligne(g, [340, 340], [340, 480], C.encre, 5);
        E.s("path", { d: "M300 490 L380 490 L340 470 Z", fill: C.encre }, g);
        var p1 = [340 - 160 * Math.cos(a), 340 - 160 * Math.sin(a)], p2 = [340 + 160 * Math.cos(a), 340 + 160 * Math.sin(a)];
        D.ligne(g, p1, p2, C.encre, 5);
        E.s("rect", { x: p1[0] - 50, y: p1[1] + 10, width: 100, height: 26, rx: 6, fill: "#9aa0ad" }, g);
        E.s("rect", { x: p2[0] - 50, y: p2[1] + 10, width: 100, height: 26, rx: 6, fill: "#2f323a" }, g);
      } else {
        // trois formes du carbone
        var F = [["fibres", 130], ["noir de carbone", 340], ["graphite", 550]];
        F.forEach(function (f, i) {
          E.s("rect", { x: f[1] - 95, y: 150, width: 190, height: 250, rx: 22, fill: n.touche === i ? PLATEFORME.teinte(0.16) : "#fff", stroke: n.touche === i ? C.jeu : "#c6cbd8", "stroke-width": n.touche === i ? 4 : 2.5 }, g);
          if (i === 0) for (var k2 = 0; k2 < 7; k2++) D.ligne(g, [f[1] - 70, 200 + k2 * 22], [f[1] + 70, 190 + k2 * 22], "#2f323a", 4);
          if (i === 1) { var r = BIO.hasard(2); for (var m = 0; m < 22; m++) D.rond(g, [f[1] - 50 + 100 * r(), 200 + 140 * r()], 9, { fill: "#2f323a" }); }
          if (i === 2) for (var c = 0; c < 5; c++) E.s("path", { d: "M" + (f[1] - 70) + " " + (205 + c * 30) + " l140 0 l-20 18 l-140 0 Z", fill: "#5b6172", stroke: C.encre, "stroke-width": 1.5 }, g);
          D.texte(g, f[0], [f[1], 375], { taille: 17 });
        });
        D.texte(g, "le carbone, trois formes très différentes", [340, 110], { taille: 18 });
      }
    };
    fig.svg.addEventListener("click", function (ev) {
      if (n.mode !== "carbone" || !n.libre) return;
      var p = E.point(fig.svg, ev);
      [130, 340, 550].forEach(function (x, i) { if (Math.abs(p[0] - x) < 95 && p[1] > 150 && p[1] < 400) { n.touche = i; n.dessin(); if (n.surTouche) n.surTouche(i); } });
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Lire une étiquette", jouer: function (j, n) {
      j.fig.astuce("Un fil de verre se désigne par 1 lettre, 1 lettre, 1 nombre, 1 nombre.");
      j.titre("L'étiquette dit « E C 9 68 ». Associe chaque morceau à son sens.");
      var L = [["E", "t"], ["C", "f"], ["9", "d"], ["68", "m"]];
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px 12px;align-items:center">' + L.map(function (l) { return '<b style="font-family:JetBrains Mono,monospace;font-size:22px">' + l[0] + '</b><span class="trou" data-attendu="' + l[1] + '" style="min-width:250px"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "m", html: "masse linéique en tex" }, { id: "d", html: "diamètre en µm" }, { id: "t", html: "verre à usage général" }, { id: "f", html: "fil continu" }],
        aide: "Première lettre : le type de verre. Deuxième lettre : le fil (continu ou discontinu). Puis le diamètre, puis la masse linéique.",
        ok: function () {
          j.bravo("Verre E, fil continu, 9 µm, 68 tex.");
          j.expliquer("<p>Type de verre : <b>E</b> usage général, bonnes propriétés électriques (90 % des applications) ; <b>D</b> hautes propriétés diélectriques ; <b>C</b> bonne résistance chimique ; <b>S</b> ou <b>R</b> bonne résistance mécanique. Fil : <b>C</b> continu, <b>D</b> discontinu (verranne). Puis le diamètre de référence en micromètres et la masse linéique en tex \\((10^{-6}\\ \\text{kg/m})\\).</p>");
          j.suite();
        }
      });
    } },
    { nom: "Le tex", jouer: function (j, n) {
      j.titre("Le fil fait 68 tex, soit 68 × 10⁻⁶ kg par mètre. Quelle masse pour 1 km de fil, en grammes ?");
      j.nombre({ avant: "m =", apres: "\\text{g}", cases: [{ attendu: BIO.masseFil(68, 1000), tol: 0.01 }], ligne: true,
        aide: function () { return "\\(68 \\times 10^{-6}\\) kg/m × 1000 m, puis convertis en grammes."; },
        ok: function () {
          j.bravo("68 g : 1 tex, c'est 1 gramme par kilomètre.");
          j.suite();
        } });
    } },
    { nom: "Trouver l'intrus", jouer: function (j, n) {
      j.titre("Une de ces propriétés n'est pas celle du verre E : laquelle ?");
      j.choix([
        { html: "Bonnes propriétés électriques", aide: "C'est même ce qui définit le verre E." },
        { html: "Hautes propriétés diélectriques", juste: true },
        { html: "Usage général, 90 % des applications", aide: "Vrai pour le verre E." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Hautes propriétés diélectriques : c'est le verre D.");
        j.expliquer("<p>Sous forme filée, le verre présente une excellente résistance mécanique, une remarquable inertie chimique, une bonne tenue thermique et une bonne isolation électrique.</p>");
        j.suite();
      } });
    } },
    { nom: "Carbone contre acier", jouer: function (j, n) {
      n.mode = "acier"; n.rouleau = 0; n.dessin();
      j.fig.astuce("");
      j.titre("Le module et la résistance en traction des fibres de carbone sont proches de ceux de l'acier, pour une densité environ 4 fois plus faible. À même volume, une tige d'acier de 400 g correspond à une tige de carbone d'environ… ?");
      j.nombre({ avant: "m \\approx", apres: "\\text{g}", cases: [{ attendu: 100, tol: 15 }], ligne: true,
        aide: function () { return "Même volume : la masse suit la densité. Divise par 4."; },
        ok: function () {
          E.anime(900, function (u) { n.rouleau = u; n.dessin(); });
          j.bravo("Environ 100 g pour la même rigidité.");
          j.expliquer("<p>Densité des fibres de carbone : 1,75 à 1,95. Fluage réduit, excellentes propriétés en fatigue, fibres conductrices, bonne conductibilité thermique. On les utilise broyées (30 µm à 3 mm), courtes (5 mm), longues (5 à 20 mm), en tissus pour le moulage ou en tissage tridimensionnel. Leur prix, bien qu'en baisse, les réserve aux techniques de pointe, avec des matrices d'excellente tenue.</p>");
          j.suite();
        } });
    } },
    { nom: "Trois formes du carbone", jouer: function (j, n) {
      n.mode = "carbone"; n.touche = null; n.libre = true; n.dessin();
      j.titre("Il faut un coussinet autolubrifiant : bon frottement, usure limitée. Touche la forme de carbone à ajouter au polymère.");
      n.surTouche = function (i) {
        if (i !== 2) { j.erreur(i === 0 ? "Les fibres servent aux pièces hautement sollicitées, pas au frottement." : "Le noir de carbone stabilise contre les UV, colore, rend conducteur."); return; }
        n.surTouche = null; n.libre = false;
        j.bravo("Le graphite.");
        j.expliquer("<p>Le carbone s'utilise sous trois formes : <b>fibres de carbone</b> (pièces hautement sollicitées), <b>noir de carbone</b> (historiquement contre le vieillissement UV du caoutchouc naturel, aujourd'hui stabilisant d'usage courant, colorant, charge conductrice), <b>graphite</b> (paliers, coussinets : pièces autolubrifiantes).</p>");
        j.suite();
      };
      j.reponse(function () { n.touche = 2; n.dessin(); if (n.surTouche) n.surTouche(2); });
    } },
    { nom: "Kevlar et autres", jouer: function (j, n) {
      j.titre("Associe chaque renfort à son point fort.");
      var L = [["Kevlar (aramide)", "k"], ["Mica", "m"], ["PTFE (Téflon), en poudre", "p"], ["Wollastonite", "w"]];
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px 10px;align-items:center">' + L.map(function (l) { return "<span>" + l[0] + '</span><span class="trou" data-attendu="' + l[1] + '" style="min-width:230px"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "p", html: "tenue en température, frottement" }, { id: "k", html: "traction, légèreté (densité 1,49)" }, { id: "w", html: "aiguilles, tenue thermique" }, { id: "m", html: "lamelles : renfort bidirectionnel" }],
        aide: "Le mica est lamellaire, la wollastonite aciculaire. Le Kevlar est une fibre très résistante en traction. Le Téflon est connu pour glisser.",
        ok: function () {
          j.bravo("Quatre renforts, quatre points forts.");
          j.expliquer("<p><b>Kevlar</b> (polyamide aromatique, Dupont de Nemours) : utilisable à 180 °C, excellente résistance en traction, bonnes propriétés en fatigue ; inconvénients : allongement sous contrainte élevée, tenue en compression limitée. <b>Mica</b> : renfort très économique, inerte chimiquement, isolant thermique, rigide, anti-UV. <b>Wollastonite</b> : minéral aciculaire qui accroît la résistance thermique. <b>PTFE</b> : tenue en température et qualités de frottement.</p>");
          j.suite();
        }
      });
    } }
  ]
});
