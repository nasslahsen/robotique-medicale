/* Niveau : qu'est-ce qu'un élastomère ? Latex de l'hévéa, définition, propriétés, applications. */
NIVEAU({
  id: "elastomeres",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var n = { mode: "arbre", etat: null, libre: true, touche: null };
    n.dessin = function () {
      E.vider(g);
      if (n.mode === "arbre") {
        var g0 = g; g = E.s("g", { transform: "translate(0,70)" }, g0);
        // tronc d'hévéa, saignée en spirale, godet de récolte
        E.s("rect", { x: 0, y: 470, width: 680, height: 60, fill: "#eef3e6" }, g);
        E.s("path", { d: "M250 60 Q240 300 232 520 L392 520 Q384 300 374 60 Z", fill: "#b48a64", stroke: "#7a5a3c", "stroke-width": 3 }, g);
        for (var k = 0; k < 4; k++) D.ligne(g, [262, 110 + k * 55], [362, 150 + k * 55], "#7a5a3c", 2, "2 9");
        E.s("path", { d: "M244 250 L380 330", stroke: "#f6f1e4", "stroke-width": 9, fill: "none", "stroke-linecap": "round" }, g);
        E.s("path", { d: "M244 250 L380 330", stroke: "#e2d6b8", "stroke-width": 3, fill: "none" }, g);
        D.texte(g, "saignée", [452, 300], { taille: 18, ancre: "start" });
        D.ligne(g, [446, 300], [372, 322], C.doux, 2);
        // gouttes de latex qui coulent vers le godet
        E.s("path", { d: "M380 330 Q392 360 388 400", stroke: "#fbfaf5", "stroke-width": 6, fill: "none", "stroke-linecap": "round" }, g);
        var lat = n.etat === "air" ? "#c9a46a" : "#fbfaf5";
        E.s("path", { d: "M352 410 L428 410 L420 470 L360 470 Z", fill: "#8b9bb3", stroke: C.encre, "stroke-width": 2.5 }, g);
        E.s("ellipse", { cx: 390, cy: 414, rx: 34, ry: 8, fill: lat, stroke: C.encre, "stroke-width": 1.5 }, g);
        D.texte(g, "latex", [450, 440], { taille: 18, ancre: "start" });
        // feuilles trifoliées
        [[200, 70], [430, 60], [310, 30]].forEach(function (p, i) {
          [-40, 0, 40].forEach(function (a) {
            var t = (a - 90 + i * 15) * D.DEG;
            E.s("ellipse", { cx: p[0] + 34 * Math.cos(t), cy: p[1] + 34 * Math.sin(t), rx: 32, ry: 12, transform: "rotate(" + ((a - 90 + i * 15)) + " " + (p[0] + 34 * Math.cos(t)) + " " + (p[1] + 34 * Math.sin(t)) + ")", fill: "#5f9e5a", stroke: "#3d6b3a", "stroke-width": 1.5 }, g);
          });
        });
        D.texte(g, "l'hévéa", [120, 200], { taille: 22 });
        D.texte(g, "cahutchu : « bois qui pleure »", [120, 232], { taille: 16, coul: C.doux, gras: false });
        if (n.etat) {
          var lab = { soleil: "collant", chaud: "fond", froid: "cassant", air: "brunit, coagule" }[n.etat];
          D.texte(g, lab, [140, 400], { taille: 22, coul: C.jeu });
        }
        g = g0;
      } else if (n.mode === "molecule") {
        // chaînes de polyisoprène, puis ponts de réticulation
        D.texte(g, "caoutchouc naturel (NR) : polyisoprène", [340, 70], { taille: 21 });
        for (var c = 0; c < 4; c++) {
          var pts = []; for (var x = 60; x <= 620; x += 20) pts.push([x, 170 + c * 95 + 22 * Math.sin(x / 38 + c * 1.7)]);
          E.s("path", { d: BIO.cheminLisse(pts), fill: "none", stroke: C.encre, "stroke-width": 3, "stroke-linecap": "round" }, g);
        }
        if (n.reticule) [[150, 0], [300, 1], [470, 0], [220, 2], [540, 2], [380, 1]].forEach(function (p) {
          var y1 = 170 + p[1] * 95 + 22 * Math.sin(p[0] / 38 + p[1] * 1.7), y2 = 170 + (p[1] + 1) * 95 + 22 * Math.sin(p[0] / 38 + (p[1] + 1) * 1.7);
          D.ligne(g, [p[0], y1], [p[0], y2], C.jeu, 6);
        });
        D.texte(g, n.reticule ? "après réticulation : propriétés élastiques" : "gomme collante, chaînes libres", [340, 520], { taille: 19, coul: n.reticule ? C.jeu : C.doux });
      } else {
        // quatre applications à toucher
        var A = n.apps;
        A.forEach(function (a, i) {
          var x = 40 + (i % 2) * 310, y = 110 + Math.floor(i / 2) * 235, sel = n.touche === i;
          E.s("rect", { x: x, y: y, width: 290, height: 205, rx: 22, fill: sel ? PLATEFORME.teinte(0.16) : "#fff", stroke: sel ? C.jeu : "#c6cbd8", "stroke-width": sel ? 4 : 2.5 }, g);
          a.dessin(g, x + 145, y + 90);
          D.texte(g, a.nom, [x + 145, y + 182], { taille: 18 });
        });
      }
    };
    n.apps = [
      { nom: "corde de bungee", dessin: function (g, x, y) { E.s("path", { d: "M" + (x - 80) + " " + (y - 60) + " q40 50 0 60 q-40 10 0 60", fill: "none", stroke: "#8b3fd9", "stroke-width": 7 }, g); D.rond(g, [x - 80, y + 64], 13, { fill: "#ffe6da", stroke: C.encre, ep: 2 }); } },
      { nom: "verre de laboratoire", dessin: function (g, x, y) { E.s("path", { d: "M" + (x - 30) + " " + (y - 60) + " l0 50 l-35 70 l130 0 l-35 -70 l0 -50 Z", fill: "#e6f2fb", stroke: C.encre, "stroke-width": 3 }, g); } },
      { nom: "pied prothétique en silicone", dessin: function (g, x, y) { E.s("path", { d: "M" + (x - 30) + " " + (y - 70) + " l50 0 l4 90 q60 10 50 40 l-120 0 q-8 -60 16 -130 Z", fill: "#f3c9b0", stroke: "#c8906f", "stroke-width": 3 }, g); } },
      { nom: "poutre en acier", dessin: function (g, x, y) { E.s("path", { d: "M" + (x - 90) + " " + (y - 40) + " h180 v16 h-80 v48 h80 v16 h-180 v-16 h80 v-48 h-80 Z", fill: "#9aa0ad", stroke: C.encre, "stroke-width": 3 }, g); } }
    ];
    // toucher une application
    fig.svg.addEventListener("click", function (ev) {
      if (n.mode !== "apps" || !n.libre) return;
      var p = E.point(fig.svg, ev);
      for (var i = 0; i < 4; i++) { var x = 40 + (i % 2) * 310, y = 110 + Math.floor(i / 2) * 235; if (p[0] > x && p[0] < x + 290 && p[1] > y && p[1] < y + 205) { n.touche = i; n.dessin(); if (n.surTouche) n.surTouche(i); } }
    });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "La saignée", jouer: function (j, n) {
      j.fig.astuce("L'hévéa, un arbre tropical.");
      j.titre("Comment récolte-t-on le latex de l'hévéa ?");
      j.choix([
        { html: "On coupe l'arbre et on presse le bois", aide: "Regarde le tronc : l'arbre reste debout, seule l'écorce est entaillée." },
        { html: "On incise l'écorce pour sectionner les vaisseaux laticifères", juste: true },
        { html: "On récolte les graines", aide: "Les graines ne coulent pas. Suis le trait blanc jusqu'au godet." }
      ], { colonnes: 1, ok: function () {
        j.bravo("La saignée.");
        j.expliquer("<p>Le <b>latex</b> se récolte en faisant une « saignée » : une incision de l'écorce du tronc qui sectionne les vaisseaux laticifères. Le mot caoutchouc vient du mot indien cahutchu, « bois qui pleure ».</p>");
        j.suite();
      } });
    } },
    { nom: "Latex brut", jouer: function (j, n) {
      j.titre("Le latex brut est capricieux. Associe chaque situation à son effet.");
      var L = [["Exposé au soleil", "s"], ["Température élevée", "c"], ["Basse température", "f"], ["Laissé à l'air", "a"]];
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:8px 10px;align-items:center">' + L.map(function (l) { return "<span>" + l[0] + '</span><span class="trou" data-attendu="' + l[1] + '" style="min-width:190px"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "a", html: "brunit et coagule" }, { id: "f", html: "devient cassant" }, { id: "s", html: "devient collant" }, { id: "c", html: "fond" }],
        aide: "Le froid rigidifie, la chaleur ramollit jusqu'à faire fondre, l'air le transforme lentement.",
        ok: function () {
          n.etat = "air"; n.dessin();
          j.bravo("Collant au soleil, fond à chaud, cassant à froid, coagule à l'air.");
          j.expliquer("<p>Brut, le caoutchouc naturel n'est pas un matériau prêt à l'emploi : ses propriétés changent trop avec la température. Il faudra le réticuler : c'est la vulcanisation, plus loin dans ce chapitre.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Définition", jouer: function (j, n) {
      n.mode = "molecule"; n.reticule = false; n.dessin();
      j.fig.astuce("Chaînes de polyisoprène, le constituant du caoutchouc naturel.");
      j.titre("Complète la définition du cours : un élastomère est un polymère à base de gomme collante, ayant des propriétés élastiques après…");
      j.choix([
        { html: "cristallisation", aide: "Un élastomère est amorphe. Regarde ce qui manque entre les chaînes de la figure." },
        { html: "réticulation", juste: true },
        { html: "fusion", aide: "Fondu, il coule. Il faut au contraire lier les chaînes entre elles." }
      ], { ok: function () {
        n.reticule = true; n.dessin();
        j.bravo("Réticulation : des ponts entre les chaînes.");
        j.expliquer("<p><b>Élastomère</b> : polymère organique ou minéral (silicone) à base de gomme collante, ayant des propriétés élastiques après réticulation. Le terme caoutchouc naturel en est un synonyme usuel. En toute rigueur, les élastomères ne font pas partie des matières plastiques.</p>");
        j.suite();
      } });
    } },
    { nom: "L'intrus", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Une de ces propriétés du caoutchouc naturel est fausse. Laquelle ?");
      j.choix([
        { html: "Flexible à basse température", aide: "Celle-ci est dans le cours. Pense plutôt aux huiles." },
        { html: "Résilience élevée", aide: "Vrai : il rend l'énergie, d'où le rebond." },
        { html: "Excellente résistance aux huiles et à l'oxydation", juste: true },
        { html: "Très sensible à l'ozone et au dioxygène", aide: "Vrai : c'est même pour cela qu'on ajoute des antioxydants." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Au contraire : faible résistance aux huiles et à l'oxydation.");
        j.expliquer("<p>Le cours liste : flexible à basse température, résilience élevée, faible résistance aux huiles et à l'oxydation, excellent combustible, très sensible à l'action de l'ozone et du dioxygène.</p>");
        j.suite();
      } });
    } },
    { nom: "Où est le caoutchouc ?", jouer: function (j, n) {
      n.mode = "apps"; n.touche = null; n.libre = true; n.dessin();
      j.fig.astuce("Touche une carte.");
      j.titre("Laquelle de ces pièces est faite d'un élastomère ? Touche-la.");
      var juste = [0, 2];
      n.surTouche = function (i) {
        if (juste.indexOf(i) < 0) { j.erreur(i === 1 ? "Le verre est une céramique : rigide et fragile." : "L'acier est un métal : module élevé, presque pas de déformation."); return; }
        n.libre = false; n.surTouche = null;
        j.bravo(i === 0 ? "La corde de bungee, et aussi le pied en silicone." : "Le pied en silicone, et aussi la corde de bungee.");
        j.expliquer("<p>Deux bonnes réponses : la corde de bungee (elle remonte de 85 %) et le pied prothétique en silicone, élastomère minéral. Autres usages du cours : catapultes des porte-avions, appuis de bâtiments et de ponts, coussins de montage et amortisseurs, accouplements flexibles, courroies, pneus d'avions.</p>");
        j.suite();
      };
      j.reponse(function () { n.touche = 2; n.dessin(); if (n.surTouche) n.surTouche(2); });
    } }
  ]
});
