/* Niveau : liaisons et propriétés. Le maillon faible, énergies de liaison, électrons libres, éléments métalliques. */
NIVEAU({
  id: "liaisons",
  init: function (fig) {
    var C = D.C, svg = fig.svg, g = E.s("g", null, svg);
    var n = { mode: "chaines", tire: 0, casse: null, libre: true, surTouche: null, choisi: null };
    // deux chaînes horizontales, liées entre elles par des liaisons faibles (pointillés)
    var Y1 = 270, Y2 = 410, X0 = 90, PAS = 62, NB = 9;
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "chaines") {
        var ec = n.tire;
        D.texte(g, "deux molécules d'une chaîne de polymère", [340, 140], { taille: 19, coul: C.doux, gras: false });
        // liaisons intermoléculaires
        for (var k = 1; k < NB - 1; k += 2) {
          var x = X0 + k * PAS, cassee = n.casse === "inter";
          var y1 = Y1 + 16 - ec * 0.5, y2 = Y2 - 16 + ec * 0.5;
          if (cassee) { D.ligne(g, [x, y1], [x, y1 + 14], C.ko, 3, "3 5"); D.ligne(g, [x, y2 - 14], [x, y2], C.ko, 3, "3 5"); }
          else D.ligne(g, [x, y1], [x, y2], n.choisi === "inter" ? D.C.acc : C.jeu, 3.5, "4 7");
        }
        [Y1 - ec * 0.5, Y2 + ec * 0.5].forEach(function (y, i) {
          for (var k = 0; k < NB - 1; k++) {
            var a = [X0 + k * PAS, y], b = [X0 + (k + 1) * PAS, y];
            D.ligne(g, a, b, n.choisi === "intra" ? D.C.acc : C.encre, 6);
          }
          for (k = 0; k < NB; k++) D.rond(g, [X0 + k * PAS, y], 14, { fill: "#fff", stroke: C.encre, ep: 3 });
          for (k = 0; k < NB; k++) D.texte(g, "C", [X0 + k * PAS, y + 1], { taille: 15, fond: false });
        });
        D.texte(g, "liaison covalente C–C (intramoléculaire)", [340, Y1 - 42 - ec * 0.5], { taille: 17, coul: C.encre });
        D.texte(g, "liaison entre molécules (intermoléculaire)", [340, (Y1 + Y2) / 2 + 2], { taille: 17, coul: C.jeu });
        if (n.tire > 0) {
          D.fleche(g, [620, Y1 - 20 - ec * 0.5], [620, Y1 - 75 - ec * 0.5], C.ko, 5);
          D.fleche(g, [620, Y2 + 20 + ec * 0.5], [620, Y2 + 75 + ec * 0.5], C.ko, 5);
        }
      } else {
        // énergies de liaison en kJ/mol (tableau du cours), barres horizontales
        var L = [["C–F", 485], ["O–H", 459], ["C–H", 411], ["C–O", 357], ["C–C", 349], ["hydrogène", 29.3], ["dipolaires", 12.6], ["Van der Waals", 8.4]];
        var x0 = 190, ech = 0.85;
        D.texte(g, "énergie de liaison (kJ/mol), valeur haute", [400, 130], { taille: 18, coul: C.doux, gras: false });
        D.texte(g, "liaisons covalentes : fortes", [x0, 168], { ancre: "start", taille: 17, coul: C.encre });
        D.texte(g, "liaisons entre molécules : faibles", [x0, 436], { ancre: "start", taille: 17, coul: C.jeu });
        L.forEach(function (l, i) {
          var y = 204 + i * 48 + (i >= 5 ? 30 : 0), faible = i >= 5;
          E.s("rect", { x: x0, y: y - 14, width: Math.max(4, l[1] * ech), height: 28, rx: 6, fill: faible ? C.jeu : "#c6cbd8" }, g);
          D.texte(g, l[0], [x0 - 14, y], { ancre: "end", taille: 17 });
          D.texte(g, String(l[1]).replace(".", ","), [x0 + Math.max(4, l[1] * ech) + 12, y], { ancre: "start", taille: 16, mono: true, gras: false });
        });
      }
    };
    svg.addEventListener("click", function (ev) {
      if (!n.libre || !n.surTouche) return;
      var p = E.point(svg, ev);
      if (p[1] > Y1 + 18 && p[1] < Y2 - 18) n.surTouche("inter");
      else if (Math.abs(p[1] - Y1) < 30 || Math.abs(p[1] - Y2) < 30) n.surTouche("intra");
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Le maillon faible", jouer: function (j, n) {
      j.fig.astuce("Touche la liaison qui cédera en premier.");
      j.titre("On tire sur ce polymère. Quelle liaison cède en premier ? Touche-la sur la figure.");
      n.surTouche = function (z) {
        if (z === "intra") { n.choisi = "intra"; n.dessin(); j.erreur("Compare l'énergie : la liaison covalente C–C est forte. Regarde ce qui tient les deux molécules ensemble."); return; }
        n.surTouche = null; n.libre = false; n.choisi = null; n.casse = "inter";
        E.anime(700, function (u) { n.tire = 40 * u; n.dessin(); });
        j.bravo("Les liaisons entre molécules lâchent : les molécules s'écartent.", [340, 280]);
        j.expliquer("<p>Lors d'une sollicitation mécanique ou thermique, ce sont les liaisons les plus faibles, les <b>liaisons intermoléculaires</b>, qui cèdent les premières : <b>c'est le maillon le plus faible qui cède en premier</b>.</p>");
        j.suite();
      };
      j.reponse(function () { n.libre = true; if (n.surTouche) n.surTouche("inter"); });
    } },
    { nom: "Classer les énergies", jouer: function (j, n) {
      n.mode = "energies"; n.dessin();
      j.fig.astuce("Les barres viennent du tableau du cours.");
      j.titre("Range ces liaisons de la plus faible à la plus forte.");
      var z = j.zone("", '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">faible ' + ["v", "h", "c"].map(function (c) { return '<span class="trou" data-attendu="' + c + '" style="min-width:120px"></span>'; }).join(" < ") + " forte</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "c", html: "C–C" }, { id: "v", html: "Van der Waals" }, { id: "h", html: "hydrogène" }],
        aide: "Regarde la longueur des barres : Van der Waals 2,1 à 8,4 ; hydrogène 12,6 à 29,3 ; C–C 349 kJ/mol.",
        ok: function () {
          j.bravo("Van der Waals < hydrogène < C–C.");
          j.expliquer("<p>Les liaisons intramoléculaires des polymères sont presque exclusivement <b>covalentes</b>, fortes, comparables aux liaisons métalliques et ioniques. Les molécules sont liées entre elles par des forces relativement faibles (interactions électrostatiques) : Van der Waals, dipolaires, hydrogène.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Combien de fois ?", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Une liaison C–C (349 kJ/mol) est environ combien de fois plus forte que la liaison hydrogène la plus forte (29,3 kJ/mol) ?");
      j.nombre({ avant: "\\dfrac{349}{29{,}3} \\approx", cases: [{ attendu: 349 / 29.3, tol: 0.5 }], ligne: true,
        aide: function () { return "Divise 349 par 29,3, puis arrondis à l'unité."; },
        ok: function () {
          j.bravo("Environ 12 fois.");
          j.expliquer("<p>Même la plus forte des liaisons entre molécules reste une dizaine de fois plus faible qu'une liaison covalente. Les propriétés d'un matériau sont en grande partie déterminées par la <b>nature des liaisons chimiques</b> entre ses atomes.</p>");
          j.suite();
        } });
    } },
    { nom: "Électrons libres", jouer: function (j, n) {
      j.titre("Le fil d'une sonde est en métal, l'isolant autour est en céramique. Pourquoi le métal conduit-il et pas la céramique ?");
      j.choix([
        { html: "Le métal a des électrons mobiles dans sa structure ; la céramique n'a pas d'électrons libres", juste: true },
        { html: "La céramique est plus dense", aide: "La conductivité ne vient pas de la densité : cherche ce qui se déplace dans le matériau." },
        { html: "Le métal a des liaisons plus faibles", aide: "La liaison métallique est forte. C'est la présence d'électrons mobiles qui compte." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Conductivité = présence d'électrons mobiles.");
        j.expliquer("<p>Liaison métallique : ions positifs baignés d'électrons libres. Céramiques : liaisons <b>ioniques</b> ou <b>covalentes</b>, électrons partagés ou cédés, pas d'électrons libres, donc mauvais conducteurs.</p>");
        j.suite();
      } });
    } },
    { nom: "Les éléments métalliques", jouer: function (j, n) {
      j.titre("Complète : les éléments métalliques représentent … des éléments connus, et leur point commun est …");
      var z = j.zone("", '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;font-size:19px">part : <span class="trou" data-attendu="q"></span> point commun : <span class="trou" data-attendu="i" style="min-width:230px"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "x", html: "1/4" }, { id: "q", html: "3/4" }, { id: "i", html: "une faible énergie d'ionisation" }, { id: "y", html: "une forte énergie d'ionisation" }],
        aide: "La grande majorité des éléments sont des métaux, et ils cèdent facilement leurs électrons.",
        ok: function () {
          j.bravo("3/4 des éléments, faible énergie d'ionisation.");
          j.expliquer("<p>Céder facilement ses électrons (faible énergie d'ionisation) donne la <b>liaison métallique</b> : forte, uniforme et isotrope, d'où une structure cristalline compacte et symétrique.</p>");
          j.suite();
        }
      });
    } }
  ]
});
