/* Niveau : exemple 1, la semelle connectée (Section I, diapositives 22 à 24). Pied diabétique, capteurs de force, schéma bloc. */
NIVEAU({
  id: "semelle",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { mode: "pieds", montreStades: false, talon: false, allume: {}, surTouche: null };
    var STADES = ["no defect", "superficial ulcer", "deep ulcer", "osteitis", "partial gangrene\nof the foot", "gangrene\nof the whole foot"];
    var BLOCS = {
      bioz: [190, 70, 170, 64, "Mesure BioZ\nMAX30009"],
      appui: [190, 220, 170, 64, "Gestion Capteurs\nAppui Plantaire"],
      temp: [190, 370, 170, 64, "Capteur T°C\n& Humidité"],
      uc: [400, 210, 100, 84, "µC"],
      radio: [530, 210, 104, 84, "TX Radio"],
      alim: [420, 430, 130, 84, "Gestion\nAlim."]
    };
    n.BLOCS = BLOCS;
    n.dessin = function () {
      EMB.vider(g);
      if (n.mode === "pieds") {
        for (var k = 0; k < 6; k++) {
          var cx = 116 + (k % 3) * 224, cy = 178 + Math.floor(k / 3) * 282;
          EMB.texte(g, "Stage " + k, [cx, cy - 130], { taille: 19, coul: C.doux });
          EMB.pied(g, cx, cy, 1.12, k);
          if (n.montreStades) EMB.texte(g, STADES[k], [cx, cy + 117], { taille: 15, gras: false });
        }
      } else if (n.mode === "capteur") {
        EMB.semelle(g, 160, 320, 2.35, n.talon ? [13, 14] : null);
        // un capteur agrandi, avec ses cotes
        var x0 = 380, y0 = 120, mm = 9;
        EMB.el("rect", { x: x0, y: y0, width: 26 * mm, height: 11 * mm, rx: 5.5 * mm, fill: "#7d838f" }, g);
        [x0 + 5.5 * mm, x0 + 20.5 * mm].forEach(function (x) { EMB.el("circle", { cx: x, cy: y0 + 5.5 * mm, r: 5.5 * mm, fill: "none", stroke: "#fff", "stroke-width": 2, "stroke-dasharray": "5 4" }, g); });
        EMB.fleche(g, [x0 - 16, y0], [x0 - 16, y0 + 11 * mm], { double: true, ep: 2 });
        EMB.texte(g, "D = 11 mm", [x0 - 16, y0 - 22], { taille: 15, mono: true, gras: false });
        EMB.fleche(g, [x0 + 5.5 * mm, y0 + 11 * mm + 16], [x0 + 20.5 * mm, y0 + 11 * mm + 16], { double: true, ep: 2 });
        EMB.texte(g, "L = 15 mm", [x0 + 13 * mm, y0 + 11 * mm + 34], { taille: 15, mono: true, gras: false });
        EMB.fleche(g, [x0, y0 + 11 * mm + 54], [x0 + 26 * mm, y0 + 11 * mm + 54], { double: true, ep: 2 });
        EMB.texte(g, "LT = 26 mm", [x0 + 13 * mm, y0 + 11 * mm + 72], { taille: 15, mono: true, gras: false });
        var FICHE = [["Actuation force", "500 g"], ["Sensitivity range", "500 g – 10 kg"], ["Response time", "< 10 µs"], ["Repeatability", "± 10 % @ 2 kg"], ["Dust/Waterproof", "IP67"]];
        FICHE.forEach(function (l, i) {
          var y = 330 + i * 46;
          EMB.el("rect", { x: 330, y: y, width: 340, height: 40, fill: i % 2 ? "#fff" : C.clair }, g);
          EMB.texte(g, l[0], [340, y + 20], { taille: 15, ancre: "start", gras: false, halo: false });
          EMB.texte(g, l[1], [660, y + 20], { taille: 15, ancre: "end", mono: true, halo: false });
        });
        EMB.texte(g, "16 capteurs résistifs de force", [160, 588], { taille: 16, coul: C.doux, gras: false });
      } else {
        EMB.el("rect", { x: 170, y: 40, width: 506, height: 520, rx: 6, fill: "none", stroke: C.encre, "stroke-width": 2, "stroke-dasharray": "8 6" }, g);
        // semelle instrumentée à gauche
        var d = "M80 120 C130 120 140 200 130 280 C122 340 124 420 112 480 C100 530 40 530 34 480 C26 410 20 340 24 260 C28 180 36 120 80 120Z";
        EMB.el("path", { d: d, fill: "#fff", stroke: C.encre, "stroke-width": 3 }, g);
        EMB.texte(g, "Semelle\ninstrumentée", [80, 310], { taille: 16, gras: false, halo: false });
        [102, 252, 402].forEach(function (y) { EMB.el("line", { x1: 128, y1: y, x2: 190, y2: y, stroke: C.encre, "stroke-width": 2.5 }, g); });
        Object.keys(BLOCS).forEach(function (k) {
          var b = BLOCS[k];
          EMB.bloc(g, b[0], b[1], b[2], b[3], b[4], { taille: k === "uc" ? 24 : 15, actif: n.allume[k], gras: k === "uc" || k === "radio" });
        });
        EMB.fleche(g, [360, 102], [450, 210], { double: true, ep: 2.5 });
        EMB.fleche(g, [360, 252], [400, 252], { double: true, ep: 2.5 });
        EMB.fleche(g, [360, 402], [450, 294], { double: true, ep: 2.5 });
        EMB.fleche(g, [500, 252], [530, 252], { double: true, ep: 2.5 });
        // antenne et accumulateur
        EMB.el("path", { d: "M634 252 H656 V120 M644 104 L656 124 L668 104 Z", fill: "none", stroke: C.encre, "stroke-width": 2.5 }, g);
        EMB.el("line", { x1: 550, y1: 460, x2: 600, y2: 460, stroke: C.encre, "stroke-width": 2.5 }, g);
        EMB.el("line", { x1: 550, y1: 490, x2: 610, y2: 490, stroke: C.encre, "stroke-width": 2.5 }, g);
        EMB.el("line", { x1: 584, y1: 446, x2: 616, y2: 446, stroke: C.encre, "stroke-width": 3 }, g);
        EMB.el("line", { x1: 592, y1: 456, x2: 608, y2: 456, stroke: C.encre, "stroke-width": 5 }, g);
        EMB.texte(g, "Accu", [600, 420], { taille: 16, gras: false });
      }
    };
    EMB.toucher(fig.svg, function () {
      if (n.mode !== "schema" || !n.surTouche) return {};
      var z = {}; Object.keys(BLOCS).forEach(function (k) { z[k] = BLOCS[k].slice(0, 4); }); return z;
    }, function (k) { if (n.surTouche) n.surTouche(k); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Les stades", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Figure 1 du cours : l'évolution d'un ulcère du pied diabétique. Place chaque lésion sur son stade.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:10px 14px;align-items:center;font-size:18px"><b>Stage 1</b><span class="trou" data-attendu="s1"></span><b>Stage 3</b><span class="trou" data-attendu="s3"></span><b>Stage 5</b><span class="trou" data-attendu="s5"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "s3", html: "<i>osteitis</i>" }, { id: "s5", html: "<i>gangrene of the whole foot</i>" }, { id: "s1", html: "<i>superficial ulcer</i>" }],
        aide: "La lésion s'aggrave d'un stade à l'autre : d'abord en surface, puis en profondeur jusqu'à l'os, puis la gangrène gagne le pied.",
        ok: function () {
          n.montreStades = true; n.dessin();
          j.bravo("Ulcère superficiel, ostéite, gangrène de tout le pied.");
          j.expliquer("<p>Six stades : 0 pas de lésion, 1 ulcère superficiel, 2 ulcère profond, 3 ostéite (atteinte de l'os), 4 gangrène partielle du pied, 5 gangrène de tout le pied. Les principales pathologies du pied diabétique : les ulcères, les infections, les déformations et les blessures.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Pourquoi une semelle ?", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Pourquoi équiper la semelle d'un patient diabétique de capteurs d'appui ?");
      j.choix([
        { html: "Pour repérer tôt les zones du pied trop chargées, où un ulcère peut se former", juste: true },
        { html: "Pour soigner l'ulcère une fois qu'il est au stade 4", aide: "Une semelle mesure, elle ne soigne pas. Regarde le stade 0 : on veut agir avant." },
        { html: "Pour remplacer le médecin", aide: "Le système transmet des mesures au soignant, il ne décide pas à sa place." }
      ], { colonnes: 1, ok: function () {
        j.bravo("On veut prévenir : agir au stade 0, pas au stade 4.");
        j.expliquer("<p>Chez le diabétique, la sensibilité du pied baisse : le patient ne sent plus qu'une zone est trop chargée. Une semelle qui mesure les appuis, la température et l'humidité donne l'alerte avant la plaie.</p>");
        j.suite();
      } });
    } },
    { nom: "Charge par capteur", jouer: function (j, n) {
      n.mode = "capteur"; n.talon = false; n.dessin();
      j.fig.astuce("Exemple ajouté : un patient de 80 kg en appui sur un pied.");
      j.titre("Si son poids se répartissait également sur les 16 capteurs, quelle charge porterait chacun ?");
      j.nombre({ avant: "\\text{charge} =", apres: "\\text{kg}", cases: [{ attendu: 5, tol: 0.01 }], ligne: true,
        aide: function () { return "Divise 80 kg par le nombre de capteurs."; },
        ok: function () {
          j.bravo("5 kg par capteur : dans la plage de sensibilité (500 g à 10 kg).");
          j.expliquer("<p>La semelle porte <b>16 capteurs résistifs de force</b> : leur résistance baisse quand on appuie (plus de 1 MΩ sans appui). Chaque capteur mesure de 500 g à 10 kg, avec une résolution continue.</p>");
          j.suite();
        } });
    } },
    { nom: "Le talon", jouer: function (j, n) {
      n.talon = true; n.dessin();
      j.fig.astuce("Exemple ajouté : à l'attaque du pas, le talon prend tout.");
      j.titre("Au moment où le talon touche le sol, les 80 kg passent par les 2 capteurs du talon (en rouge). Que lit chacun ?");
      j.choix([
        { html: "40 kg chacun, mesuré exactement", aide: "40 kg, oui, mais regarde la ligne « Sensitivity range » de la fiche." },
        { html: "Il sature : 40 kg dépasse les 10 kg de la plage", juste: true },
        { html: "5 kg, comme avant", aide: "La charge n'est plus répartie sur 16 capteurs mais sur 2." }
      ], { colonnes: 1, ok: function () {
        j.bravo("80 / 2 = 40 kg, bien au-delà de 10 kg : le capteur sature.");
        j.expliquer("<p>Lire la fiche d'un capteur, c'est vérifier qu'il convient au cas réel, pas au cas moyen. Ici, il faudrait plus de capteurs au talon ou une plage plus large.</p>");
        j.suite();
      } });
    } },
    { nom: "Le schéma bloc", jouer: function (j, n) {
      n.mode = "schema"; n.allume = {}; n.dessin();
      j.fig.astuce("");
      j.titre("Les mesures doivent partir vers le téléphone du soignant. Touche le bloc qui les émet.");
      var fini = false;
      n.surTouche = function (k) {
        if (fini) return;
        if (k !== "radio") { j.erreur(k === "uc" ? "Le µC prépare les données, mais il n'a pas d'antenne. Suis la flèche vers la droite." : "Ce bloc mesure ou alimente. Cherche le bloc relié à l'antenne."); return; }
        fini = true; n.surTouche = null; n.allume = { radio: true, uc: true }; n.dessin();
        j.bravo("Le bloc TX Radio, relié à l'antenne.", [582, 252]);
        j.expliquer("<p>Trois blocs de mesure (bio-impédance, appuis plantaires, température et humidité) échangent avec le <b>µC</b>, qui transmet par le bloc <b>TX Radio</b>. La <b>gestion de l'alimentation</b> tire son énergie d'un accumulateur.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surTouche) n.surTouche("radio"); });
    } },
    { nom: "BioZ", jouer: function (j, n) {
      n.allume = { bioz: true }; n.dessin();
      j.titre("Le bloc « Mesure BioZ » utilise le circuit MAX30009. Que mesure-t-il ?");
      j.choix([
        { html: "La bio-impédance : la résistance électrique des tissus au passage d'un petit courant", juste: true },
        { html: "La force d'appui du pied", aide: "Les appuis ont leur propre bloc, « Gestion Capteurs Appui Plantaire »." },
        { html: "La température de la peau", aide: "La température a son propre bloc, « Capteur T°C & Humidité »." }
      ], { colonnes: 1, ok: function () {
        j.bravo("BioZ = bio-impédance.");
        j.expliquer("<p>La bio-impédance renseigne sur l'état des tissus, par exemple un œdème ou une inflammation. Avec la pression, la température et l'humidité, elle donne une image plus complète du risque de plaie.</p>");
        j.suite();
      } });
    } }
  ]
});
