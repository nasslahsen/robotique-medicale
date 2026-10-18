/* Niveau : l'extrusion. Pièces de l'extrudeuse, rôle de la vis, filière et profilé, extrusion-gonflage, matière préférée. */
NIVEAU({
  id: "extrusion",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg), gz = E.s("g", null, fig.svg);
    var n = { mode: "machine", numeros: false, filiere: null, sortie: 0, bulle: 0, libre: false, surFiliere: null };
    var Y = 330; // axe de la vis
    function matiere(a) { return PLATEFORME.teinte(a); }
    // forme de la section de chaque filière, dessinée dans un carré de côté 60 centré en c
    var FILIERES = [
      { id: "disque", nom: "disque plein" },
      { id: "anneau", nom: "anneau" },
      { id: "L", nom: "en L" },
      { id: "fente", nom: "fente" }
    ];
    function section(gr, id, c, coul, fond) {
      if (id === "disque") D.rond(gr, c, 20, { fill: coul });
      else if (id === "anneau") { D.rond(gr, c, 22, { fill: coul }); D.rond(gr, c, 11, { fill: fond || "#fff" }); }
      else if (id === "L") E.s("path", { d: "M" + (c[0] - 18) + " " + (c[1] - 22) + " h12 v32 h24 v12 h-36 Z", fill: coul }, gr);
      else E.s("rect", { x: c[0] - 26, y: c[1] - 6, width: 52, height: 12, rx: 3, fill: coul }, gr);
    }
    n.dessin = function () {
      E.vider(g); E.vider(gz);
      if (n.mode === "gonflage") { gonflage(); return; }
      // moteur
      E.s("rect", { x: 14, y: Y - 42, width: 52, height: 84, rx: 10, fill: "#9aa0ad", stroke: C.encre, "stroke-width": 2.5 }, g);
      D.texte(g, "moteur", [40, Y + 66], { taille: 15, coul: C.doux, gras: false });
      // trémie et granulés
      E.s("path", { d: "M100 175 L210 175 L175 " + (Y - 40) + " L135 " + (Y - 40) + " Z", fill: "#f3f5fa", stroke: C.encre, "stroke-width": 3, "stroke-linejoin": "round" }, g);
      for (var i = 0; i < 18; i++) D.rond(g, [118 + (i % 6) * 15 + (Math.floor(i / 6) % 2) * 7, 193 + Math.floor(i / 6) * 16], 6, { fill: matiere(0.55), stroke: C.encre, ep: 1 });
      // fourreau chauffant
      E.s("rect", { x: 66, y: Y - 40, width: 420, height: 80, rx: 6, fill: "#eef0f5", stroke: C.encre, "stroke-width": 3 }, g);
      [200, 280, 360, 440].forEach(function (x) { E.s("rect", { x: x - 22, y: Y - 52, width: 44, height: 104, rx: 6, fill: "rgba(229,72,77,0.22)", stroke: "#e5484d", "stroke-width": 2 }, g); });
      // matière : granulés au début, puis matière fondue de plus en plus homogène
      for (var x = 150; x < 486; x += 6) E.s("rect", { x: x, y: Y - 34, width: 6.5, height: 68, fill: matiere(0.12 + 0.6 * (x - 150) / 336) }, g);
      // vis sans fin : arbre et filets
      E.s("rect", { x: 66, y: Y - 9, width: 410, height: 18, fill: "#c6cbd8", stroke: C.encre, "stroke-width": 2 }, g);
      for (x = 96; x < 470; x += 28) D.ligne(g, [x, Y + 34], [x + 18, Y - 34], C.encre, 4);
      // tête d'extrusion et filière
      E.s("path", { d: "M486 " + (Y - 52) + " L536 " + (Y - 52) + " L536 " + (Y + 52) + " L486 " + (Y + 52) + " Z", fill: "#c6cbd8", stroke: C.encre, "stroke-width": 3 }, g);
      E.s("path", { d: "M536 " + (Y - 34) + " L566 " + (Y - 20) + " L566 " + (Y + 20) + " L536 " + (Y + 34) + " Z", fill: "#9aa0ad", stroke: C.encre, "stroke-width": 3, "stroke-linejoin": "round" }, g);
      // extrudat
      if (n.sortie > 0) {
        var L = 100 * n.sortie;
        if (n.filiere === "anneau") {
          E.s("rect", { x: 566, y: Y - 16, width: L, height: 32, rx: 4, fill: matiere(0.75), stroke: C.encre, "stroke-width": 2 }, g);
          E.s("rect", { x: 566, y: Y - 7, width: L, height: 14, fill: "#fff", opacity: 0.85 }, g);
        } else E.s("rect", { x: 566, y: Y - 14, width: L, height: 28, rx: 4, fill: matiere(0.75), stroke: C.encre, "stroke-width": 2 }, g);
        if (n.sortie > 0.95) { section(g, n.filiere || "disque", [616, Y + 76], matiere(0.8)); D.texte(g, "section", [616, Y + 112], { taille: 14, coul: C.doux, gras: false }); }
      }
      if (n.numeros) {
        [[1, [155, 150]], [2, [96, Y + 88]], [3, [240, Y - 82]], [4, [552, Y - 80]]].forEach(function (q) {
          D.rond(g, q[1], 18, { fill: C.encre }); D.texte(g, String(q[0]), q[1], { coul: "#fff", taille: 19, fond: false });
        });
        D.ligne(g, [96, Y + 70], [110, Y + 12], C.encre, 2); D.ligne(g, [552, Y - 62], [552, Y - 22], C.encre, 2); D.ligne(g, [240, Y - 64], [240, Y - 54], C.encre, 2);
      } else {
        D.texte(g, "trémie", [155, 156], { taille: 16, coul: C.doux });
        D.texte(g, "fourreau chauffant", [300, Y - 76], { taille: 16, coul: C.doux });
        D.texte(g, "vis sans fin", [190, Y + 70], { taille: 16, coul: C.doux });
        D.texte(g, "filière", [556, Y - 76], { taille: 16, coul: C.doux });
        if (n.sortie > 0) D.texte(g, "extrudat", [620, Y - 40], { taille: 16, coul: C.jeu });
      }
      // filières à choisir
      if (n.choixFilieres) {
        D.texte(g, "Filières disponibles (touche-en une)", [340, 450], { taille: 18 });
        FILIERES.forEach(function (f, k) {
          var c = [115 + k * 150, 520], choisie = n.filiere === f.id;
          var gb = E.s("g", { style: "cursor:pointer" }, gz);
          E.s("rect", { x: c[0] - 62, y: c[1] - 52, width: 124, height: 112, rx: 16, fill: choisie ? PLATEFORME.teinte(0.15) : "#fff", stroke: choisie ? C.jeu : "#c6cbd8", "stroke-width": 3 }, gb);
          E.s("rect", { x: c[0] - 32, y: c[1] - 42, width: 64, height: 64, rx: 8, fill: "#9aa0ad" }, gb);
          section(gb, f.id, [c[0], c[1] - 10], "#fff", "#9aa0ad");
          D.texte(gb, f.nom, [c[0], c[1] + 40], { taille: 15, coul: C.doux, gras: false, fond: false });
          gb.addEventListener("click", function () { if (n.libre && n.surFiliere) n.surFiliere(f.id); });
        });
      }
    };
    function gonflage() {
      // extrusion-gonflage : bulle verticale au-dessus de la filière, puis aplatie et enroulée
      var h = 330 * n.bulle, base = [220, 520];
      E.s("rect", { x: 60, y: 470, width: 200, height: 70, rx: 8, fill: "#eef0f5", stroke: C.encre, "stroke-width": 3 }, g);
      D.texte(g, "extrudeuse", [140, 505], { taille: 16, coul: C.doux });
      E.s("rect", { x: 190, y: 446, width: 60, height: 24, fill: "#9aa0ad", stroke: C.encre, "stroke-width": 2.5 }, g);
      D.texte(g, "filière annulaire", [184, 432], { taille: 15, coul: C.doux, ancre: "end" });
      if (n.bulle > 0) {
        var r = 22 + 58 * Math.min(1, n.bulle * 1.6);
        E.s("path", { d: "M" + (base[0] - 22) + " 446 C" + (base[0] - 22) + " 400 " + (base[0] - r) + " 400 " + (base[0] - r) + " " + (446 - h * 0.35) + " L" + (base[0] - r) + " " + (446 - h) + " L" + (base[0] + r) + " " + (446 - h) + " L" + (base[0] + r) + " " + (446 - h * 0.35) + " C" + (base[0] + r) + " 400 " + (base[0] + 22) + " 400 " + (base[0] + 22) + " 446 Z", fill: PLATEFORME.teinte(0.18), stroke: C.jeu, "stroke-width": 3 }, g);
        for (var k = 0; k < 4; k++) D.fleche(g, [base[0], 430 - k * 60 * n.bulle], [base[0] + (k % 2 ? 30 : -30), 400 - k * 60 * n.bulle], "#3b5bdb", 3);
        D.texte(g, "air", [base[0], 446 - h * 0.6], { taille: 17, coul: "#3b5bdb" });
        if (n.bulle > 0.95) {
          // aplatissement puis bobines
          E.s("path", { d: "M" + (base[0] - r) + " " + (446 - h) + " L" + (base[0] - 8) + " 100 L" + (base[0] + 8) + " 100 L" + (base[0] + r) + " " + (446 - h) + " Z", fill: PLATEFORME.teinte(0.12), stroke: C.jeu, "stroke-width": 2 }, g);
          E.s("rect", { x: base[0] - 40, y: 88, width: 80, height: 14, rx: 7, fill: "#9aa0ad" }, g);
          E.s("path", { d: "M" + base[0] + " 100 L540 100 L540 404", fill: "none", stroke: C.jeu, "stroke-width": 5 }, g);
          D.rond(g, [540, 450], 46, { fill: PLATEFORME.teinte(0.35), stroke: C.encre, ep: 2.5 }); D.rond(g, [540, 450], 10, { fill: C.encre });
          D.texte(g, "bulle de pellicule", [base[0] + r + 14, 300], { taille: 16, coul: C.jeu, ancre: "start" });
          D.texte(g, "film aplati", [400, 80], { taille: 15, coul: C.doux, ancre: "start" });
          D.texte(g, "bobine de film", [540, 520], { taille: 16, coul: C.doux });
        }
      }
    }
    n.pousser = function (fin) { n.sortie = 0; E.anime(1200, function (u) { n.sortie = u; n.dessin(); }, fin); };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Les pièces de l'extrudeuse", jouer: function (j, n) {
      n.numeros = true; n.dessin();
      j.fig.astuce("Les granulés tombent dans la machine, la matière ressort fondue à droite.");
      j.titre("Une usine fabrique des tubulures de perfusion. Nomme les pièces numérotées de l'extrudeuse.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px 12px;align-items:center">' +
        [["1", "t"], ["2", "v"], ["3", "f"], ["4", "l"]].map(function (q) { return "<b>" + q[0] + '</b><span class="trou" data-attendu="' + q[1] + '"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "f", html: "fourreau chauffant" }, { id: "l", html: "filière" }, { id: "t", html: "trémie" }, { id: "v", html: "vis sans fin" }],
        aide: "Suis la matière : elle entre par le haut, avance poussée par la pièce qui tourne, chauffe dans le cylindre, sort par l'orifice qui donne la forme.",
        ok: function () {
          n.numeros = false; n.dessin();
          j.bravo("Trémie, vis sans fin, fourreau chauffant, filière.");
          j.expliquer("<p>L'<b>extrudeuse</b>, parfois nommée boudineuse : la matière plastique entre par la trémie dans un cylindre chauffé, une vis sans fin la pousse jusqu'à la <b>filière</b>, qui lui donne sa forme.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Le travail de la vis", jouer: function (j, n) {
      j.fig.astuce("Regarde la couleur de la matière le long du fourreau.");
      j.titre("Au début de la vis, des granulés ; au bout, une matière fluide et homogène. Que fait la vis pendant le trajet ?");
      j.choix([
        { html: "Elle transporte seulement les granulés jusqu'à la filière", aide: "Si elle ne faisait que transporter, les granulés arriveraient encore séparés. Regarde comme la matière change d'aspect." },
        { html: "Elle malaxe, compresse, cisaille, échauffe et transporte en continu la matière", juste: true },
        { html: "Elle découpe le profilé à la bonne longueur", aide: "La découpe se fait après la sortie de la filière. La vis travaille à l'intérieur du fourreau." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Cinq actions à la fois, en continu.");
        j.expliquer("<p>La vis malaxe, compresse, cisaille, échauffe et transporte <b>en continu</b> la matière fluidifiée et homogène vers la filière. L'extrusion ne s'arrête pas : elle produit une longueur sans fin.</p>");
        j.suite();
      } });
    } },
    { nom: "La bonne filière", jouer: function (j, n) {
      n.choixFilieres = true; n.libre = true; n.dessin();
      j.fig.astuce("Une tubulure de perfusion est creuse : le liquide passe au centre.");
      j.titre("Touche la filière qui donne une tubulure de perfusion.");
      var aides = { disque: "Un disque plein donne un jonc plein, comme une gaine de câble sans trou. Le liquide doit pouvoir passer au centre.", L: "Une filière en L donne une cornière, un profilé ouvert.", fente: "Une fente donne une plaque ou un film plat." };
      function gagne() {
        n.libre = false; n.filiere = "anneau"; n.dessin();
        n.pousser(function () {
          j.bravo("Une filière annulaire : le profilé sort creux.", [610, 300]);
          j.expliquer("<p>La filière impose la section ; tout ce qui sort a la <b>même forme en continu</b> : c'est l'indice d'une pièce extrudée (tubes, câbles, profilés de fenêtres, stores, grillages). Exemple ajouté : les tubulures de perfusion et les cathéters sont fabriqués ainsi.</p>");
          j.suite();
        });
      }
      n.surFiliere = function (id) {
        if (id === "anneau") { n.surFiliere = null; gagne(); return; }
        n.filiere = id; n.dessin(); j.erreur(aides[id]);
      };
      j.reponse(function () { if (n.surFiliere) { n.surFiliere = null; gagne(); } });
    } },
    { nom: "Extrusion-gonflage", jouer: function (j, n) {
      n.choixFilieres = false; n.mode = "gonflage"; n.bulle = 0; n.dessin();
      j.fig.astuce("");
      j.titre("Prédis : à la sortie d'une filière annulaire, on gonfle d'air le tube produit. Qu'obtient-on ?");
      j.choix([
        { html: "Un tube plus épais", aide: "L'air pousse la paroi vers l'extérieur : elle s'étire et s'amincit." },
        { html: "Une longue bulle de pellicule, qu'on aplatit et enroule sur des bobines", juste: true },
        { html: "Une bouteille", aide: "Pour une bouteille, on souffle le tube enfermé dans un moule. Ici il n'y a pas de moule : la bulle est libre." }
      ], { colonnes: 1, ok: function () {
        E.anime(1500, function (u) { n.bulle = u; n.dessin(); }, function () {
          j.bravo("Une bulle de film, puis des bobines.");
          j.expliquer("<p><b>Extrusion-gonflage</b> : variante de l'extrusion où l'on gonfle d'air le tube à la sortie de la filière. Il devient une longue bulle de pellicule plastique ; refroidie, elle est aplatie et enroulée sur des bobines. Exemples : sacs poubelles, sacs de congélation.</p>");
          j.suite();
        });
      } });
    } },
    { nom: "La matière préférée", jouer: function (j, n) {
      n.mode = "machine"; n.filiere = "anneau"; n.sortie = 1; n.dessin();
      j.fig.astuce("À la sortie de la filière, l'extrudat est encore chaud et mou.");
      j.titre("Le cours préfère une masse molaire élevée et une structure amorphe pour l'extrusion. Pourquoi une masse molaire élevée ?");
      j.choix([
        { html: "Les longues chaînes enchevêtrées rendent la matière fondue visqueuse : le profilé garde sa forme en sortant", juste: true },
        { html: "Une masse molaire élevée fait fondre la matière plus vite", aide: "La masse molaire joue sur l'enchevêtrement et la viscosité, pas sur une fusion plus rapide. Pense au profilé encore mou à la sortie." },
        { html: "Elle rend la matière cristalline, donc plus rigide", aide: "Masse molaire et cristallinité sont deux choses différentes ; le cours demande justement une structure amorphe." }
      ], { colonnes: 1, ok: function () {
        j.bravo("La viscosité retient la forme donnée par la filière.");
        j.expliquer("<p>La viscosité augmente avec la masse moléculaire (degré d'enchevêtrement) : l'extrudat ne s'affaisse pas avant d'être refroidi. Autres variantes du cours : extrusion-gainage, -formage, -calandrage, en filière plate, -soufflage, filage et co-extrusion (deux PVC, l'un flexible, l'autre rigide, dans le même profilé).</p>");
        j.suite();
      } });
    } }
  ]
});
