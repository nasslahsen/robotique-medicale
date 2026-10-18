/* Niveau : moulage par compression et compression-transfert. Pressage et bavure, étapes, cuisson, cavité d'attente, erreur à trouver. */
NIVEAU({
  id: "compression",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg), gz = E.s("g", null, fig.svg);
    var n = { mode: "comp", z: 0, t: 0, libre: false, surZone: null, choisie: null, noms: true };
    function mat(a) { return PLATEFORME.teinte(a); }
    var CAV = [[170, 290], [390, 510]];
    function comp() {
      var yp = 250 + 110 * n.z; // bas des poinçons
      // demi-moule inférieur avec deux empreintes et rainures de débordement
      var d = "M110 330 L160 330 L160 338 L170 338 L170 390 L290 390 L290 338 L300 338 L300 330 L380 330 L380 338 L390 338 L390 390 L510 390 L510 338 L520 338 L520 330 L570 330 L570 470 L110 470 Z";
      E.s("path", { d: d, fill: "#cfd5e1", stroke: C.encre, "stroke-width": 3, "stroke-linejoin": "round" }, g);
      CAV.forEach(function (c) {
        // charge écrasée : même volume (surface), elle s'étale puis déborde
        var h0 = 50, w0 = 80, A = h0 * w0, h = Math.min(h0, 390 - yp), w = Math.min(120, A / h), cx = (c[0] + c[1]) / 2;
        if (yp < 340) { h = h0; w = w0; }
        E.s("rect", { x: cx - w / 2, y: 390 - h, width: w, height: h, fill: mat(0.7), stroke: C.jeu, "stroke-width": 2 }, g);
        var exces = A - 120 * h;
        if (exces > 0 && n.z > 0.95) {
          E.s("rect", { x: c[0] - 12, y: 330, width: 12, height: 8, fill: C.jeu }, g);
          E.s("rect", { x: c[1], y: 330, width: 12, height: 8, fill: C.jeu }, g);
        }
        // éjecteurs
        E.s("rect", { x: cx - 36, y: 390, width: 12, height: 130, fill: "#9aa0ad", stroke: C.encre, "stroke-width": 2 }, g);
        E.s("rect", { x: cx + 24, y: 390, width: 12, height: 130, fill: "#9aa0ad", stroke: C.encre, "stroke-width": 2 }, g);
      });
      // demi-moule supérieur avec poinçons
      var up = "M110 " + (yp - 110) + " L570 " + (yp - 110) + " L570 " + (yp - 30) + " L500 " + (yp - 30) + " L500 " + yp + " L400 " + yp + " L400 " + (yp - 30) + " L280 " + (yp - 30) + " L280 " + yp + " L180 " + yp + " L180 " + (yp - 30) + " L110 " + (yp - 30) + " Z";
      E.s("path", { d: up, fill: "#dfe3ec", stroke: C.encre, "stroke-width": 3, "stroke-linejoin": "round" }, g);
      D.fleche(g, [340, yp - 190], [340, yp - 120], C.encre, 5);
      D.texte(g, "v, F", [370, yp - 160], { taille: 17, ancre: "start" });
      if (n.noms) {
        D.texte(g, "charge", [230, 300 + (n.z > 0.5 ? 140 : 0)], { taille: 15, coul: C.jeu });
        D.texte(g, "rainures de débordement", [340, 312 + (n.z > 0.5 ? 0 : 0)], { taille: 14, coul: C.doux });
        D.texte(g, "éjecteurs", [600, 500], { taille: 15, coul: C.doux });
        if (n.z > 0.95) D.texte(g, "bavure", [560, 300], { taille: 15, coul: C.jeu });
        if (n.z > 0.95) D.ligne(g, [540, 304], [524, 328], C.jeu, 1.5);
      }
    }
    function transfert() {
      var t = n.t, yp = 210;
      // moule bas avec empreintes, canaux et pot
      E.s("rect", { x: 110, y: 290, width: 460, height: 180, rx: 6, fill: "#cfd5e1", stroke: C.encre, "stroke-width": 3 }, g);
      E.s("rect", { x: 260, y: 200, width: 160, height: 90, rx: 4, fill: "#dfe3ec", stroke: C.encre, "stroke-width": 3 }, g);
      E.s("rect", { x: 285, y: 210, width: 110, height: 70, fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g);
      // canaux vers les empreintes
      [0, 1].forEach(function (i) {
        var x0 = i ? 380 : 300, x1 = i ? 450 : 230;
        E.s("path", { d: "M" + x0 + " 280 L" + x0 + " 330 L" + x1 + " 330", fill: "none", stroke: "#fff", "stroke-width": 12 }, g);
        if (t > 0.3) E.s("path", { d: "M" + x0 + " 280 L" + x0 + " 330 L" + x1 + " 330", fill: "none", stroke: mat(0.75), "stroke-width": 8 }, g);
      });
      [[150, 230], [450, 530]].forEach(function (c) {
        E.s("rect", { x: c[0], y: 320, width: c[1] - c[0], height: 60, fill: "#fff", stroke: C.encre, "stroke-width": 2.5 }, g);
        var f = Math.max(0, Math.min(1, (t - 0.4) / 0.6));
        if (f > 0) E.s("rect", { x: c[0] + 1, y: 380 - 59 * f, width: c[1] - c[0] - 2, height: 59 * f, fill: mat(0.75) }, g);
      });
      // charge dans le pot, poussée par le piston
      var h = 50 * (1 - 0.85 * t);
      E.s("rect", { x: 287, y: 280 - h, width: 106, height: h, fill: mat(0.75) }, g);
      E.s("rect", { x: 292, y: 280 - h - 2 - 120, width: 96, height: 120, fill: "#9aa0ad", stroke: C.encre, "stroke-width": 3 }, g);
      D.fleche(g, [340, 40], [340, 80], C.encre, 5);
      [[150, 520], [450, 520]].forEach(function (q) { E.s("rect", { x: q[0] + 20, y: 380, width: 12, height: 130, fill: "#9aa0ad", stroke: C.encre, "stroke-width": 2 }, g); });
      if (n.noms) {
        D.texte(g, "piston", [420, 120], { taille: 15, coul: C.doux, ancre: "start" });
        D.texte(g, "pot (cavité d'attente)", [430, 240], { taille: 15, coul: C.doux, ancre: "start" });
        D.texte(g, "canal", [260, 350], { taille: 15, coul: C.doux });
        D.texte(g, "empreinte", [190, 410], { taille: 15, coul: C.doux });
      }
      if (n.zones) {
        [["piston", [292, 90, 96, 110]], ["pot", [262, 205, 156, 80]], ["canal", [226, 316, 80, 30]], ["empreinte", [146, 316, 80, 70]], ["ejecteur", [160, 386, 50, 120]]].forEach(function (z) {
          var r = E.s("rect", { x: z[1][0], y: z[1][1], width: z[1][2], height: z[1][3], fill: n.choisie === z[0] ? "rgba(229,72,77,0.18)" : "transparent", style: "cursor:pointer" }, gz);
          r.addEventListener("click", function () { if (n.libre && n.surZone) n.surZone(z[0]); });
        });
      }
    }
    n.dessin = function () { E.vider(g); E.vider(gz); if (n.mode === "comp") comp(); else transfert(); };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Presser", jouer: function (j, n) {
      n.libre = true;
      j.fig.astuce("Une charge de résine thermodurcissable dans chaque empreinte du moule chaud.");
      j.titre("Moulage par compression d'un plateau. Presse jusqu'à fermer complètement le moule.");
      var fini = false;
      function gagne() {
        if (fini) return; fini = true; n.libre = false; n.z = 1; n.dessin(); c.regler(100);
        j.bravo("Le moule est plein ; le surplus est parti dans les rainures.", [340, 360]);
        j.expliquer("<p>Le pressage oblige la matière à remplir le moule ; l'excès de matière est évacué par des canalisations faites pour ce but, les <b>rainures de débordement</b>.</p>");
        j.suite();
      }
      var c = j.curseur({ nom: "pressage", min: 0, max: 100, pas: 5, val: 0, unite: " %", change: function (v) {
        if (!n.libre) return;
        n.z = v / 100; n.dessin();
        if (v >= 100) gagne();
      } });
      j.reponse(gagne);
    } },
    { nom: "Le surplus", jouer: function (j, n) {
      j.fig.astuce("Regarde les bords des empreintes, moule fermé.");
      j.titre("Les bottes en caoutchouc moulées par compression sortent avec une fine collerette de matière tout autour. Comment s'appelle-t-elle ?");
      j.choix([
        { html: "La carotte", aide: "La carotte est le conduit vertical d'un moule d'injection, sous la buse. Ici, pas d'injection." },
        { html: "La bavure", juste: true },
        { html: "La préforme", aide: "La préforme est la pièce injectée qu'on gonfle en injection-soufflage." }
      ], { ok: function () {
        j.bravo("La bavure, qu'on enlève ensuite.");
        j.expliquer("<p>La <b>bavure</b> est l'excès de matière chassé dans les rainures de débordement entre les deux demi-moules. Sur les bottes du cours, on la voit encore avant ébavurage.</p>");
        j.suite();
      } });
    } },
    { nom: "Les cinq étapes", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Remets dans l'ordre les étapes du moulage par compression.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px 12px;align-items:center">' +
        ["h", "m", "p", "c", "o"].map(function (id, k) { return "<b>" + (k + 1) + '</b><span class="trou" data-attendu="' + id + '" style="justify-content:flex-start"></span>'; }).join("") + "</div>");
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "p", html: "Presser, le surplus s'évacue" }, { id: "o", html: "Ouvrir, récupérer la pièce" }, { id: "h", html: "Chauffer le moule" }, { id: "c", html: "Maintenir chauffe et pression, refroidir" }, { id: "m", html: "Charger le moule ouvert, fermer" }],
        aide: "Le moule doit être chaud avant de recevoir la matière ; on presse une fois fermé ; la pièce ne sort qu'après la cuisson.",
        ok: function () {
          j.bravo("Chauffer, charger et fermer, presser, maintenir, ouvrir.");
          j.expliquer("<p>Les matières premières se présentent sous forme de poudres, de granulés, de semi-solides ou de préformés. 1. chauffage du moule ; 2. mise des matières dans le moule ouvert, fermeture ; 3. pressage ; 4. maintien de la chauffe et de la pression jusqu'à la fin de la cuisson (réticulation), refroidissement ; 5. ouverture et récupération de la pièce.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Pourquoi maintenir ?", jouer: function (j, n) {
      j.titre("Pour un thermodurcissable, pourquoi maintient-on la chauffe et la pression après le pressage ?");
      j.choix([
        { html: "Pour laisser la cuisson se finir : la réticulation durcit la pièce", juste: true },
        { html: "Pour refondre la pièce et la remouler", aide: "Un thermodurcissable durci ne peut plus être chauffé pour être formé à nouveau : il se dégrade." },
        { html: "Pour faire cristalliser la matière", aide: "Le cours parle ici de cuisson. Que se passe-t-il entre la résine et le catalyseur quand on chauffe ?" }
      ], { colonnes: 1, ok: function () {
        j.bravo("La cuisson, c'est la réticulation.");
        j.expliquer("<p>Le thermodurcissable arrive en résine + catalyseur ; la chaleur provoque la <b>réticulation</b> : un réseau tridimensionnel à mailles serrées se forme. Tant qu'elle n'est pas finie, la pièce n'est pas solide.</p>");
        j.suite();
      } });
    } },
    { nom: "Compression-transfert", jouer: function (j, n) {
      n.mode = "transfert"; n.t = 0; n.noms = false; n.zones = true; n.libre = true; n.dessin();
      j.fig.astuce("Moulage par compression-transfert, noms cachés.");
      j.titre("Touche l'endroit où la matière ramollie attend avant d'être transférée vers le moule.");
      var aides = { piston: "Le piston (poinçon) pousse la matière ; elle attend en dessous de lui.", canal: "Le canal conduit la matière vers le moule pendant le transfert.", empreinte: "C'est là qu'elle finit, pas là qu'elle attend.", ejecteur: "Les éjecteurs sortent la pièce à la fin." };
      function gagne() {
        n.libre = false; n.surZone = null; n.zones = false; n.noms = true; n.choisie = null;
        E.anime(1400, function (u) { n.t = u; n.dessin(); }, function () {
          j.bravo("Le pot, ou cavité d'attente.", [340, 245]);
          j.expliquer("<p><b>Compression-transfert</b> : 1. préchauffage du moule ; 2. préchauffage de la matière pour la ramollir ; 3. introduction de la matière ramollie dans une <b>cavité d'attente</b> ; 4. transfert, par pression, vers le moule préchauffé à l'aide d'un poinçon à travers un canal ; 5. maintien de la chauffe jusqu'à la fin de la cuisson (réticulation) ; 6. refroidissement ; 7. ouverture et récupération.</p>");
          j.suite();
        });
      }
      n.surZone = function (id) {
        if (id === "pot") { gagne(); return; }
        n.choisie = id; n.dessin(); j.erreur(aides[id]);
      };
      j.reponse(function () { if (n.surZone) gagne(); });
    } },
    { nom: "Trouver l'erreur", jouer: function (j, n) {
      j.titre("Une description de la compression-transfert contient une erreur. Touche la phrase fausse.");
      j.choix([
        { html: "On préchauffe le moule, puis la matière pour la ramollir.", aide: "Cette phrase est juste : ce sont les étapes 1 et 2." },
        { html: "La matière ramollie est introduite dans une cavité d'attente.", aide: "Juste : c'est l'étape 3, le pot." },
        { html: "Un jet d'air comprimé pousse la matière vers le moule.", juste: true },
        { html: "On maintient la chauffe jusqu'à la fin de la cuisson.", aide: "Juste pour les thermodurcissables : c'est la réticulation." }
      ], { colonnes: 1, ok: function () {
        j.bravo("C'est un poinçon qui pousse, à travers un canal.");
        j.expliquer("<p>L'air comprimé, c'est le soufflage. En compression-transfert, le transfert se fait par pression, à l'aide d'un poinçon, à travers un canal. Différence avec la compression simple : la matière est ramollie à part, puis transférée dans un moule déjà fermé.</p>");
        j.suite();
      } });
    } }
  ]
});
