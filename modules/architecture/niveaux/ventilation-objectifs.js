/* Niveau : objectifs de la ventilation du bloc (diapo 27), température et humidité (diapo 35). */
NIVEAU(ARCHI.rejouable({
  id: "ventilation-objectifs",
  init: function (fig) {
    var A = ARCHI, C = A.C, g = A.s("g", null, fig.svg);
    var n = { mode: "salle", hum: 15, libre: true, g: g, pl: { P: function (v) { return v; } } };
    n.salle = function () {
      A.s("rect", { x: 60, y: 80, width: 560, height: 420, fill: "#fff", stroke: C.encre, "stroke-width": 5 }, g);
      A.s("rect", { x: 280, y: 360, width: 120, height: 20, fill: C.doux }, g); A.s("rect", { x: 330, y: 380, width: 20, height: 110, fill: C.doux }, g);
      A.s("rect", { x: 290, y: 340, width: 100, height: 22, rx: 10, fill: "#cfe0f7" }, g); A.s("circle", { cx: 300, cy: 340, r: 13, fill: "#f6c2b0" }, g);
    };
    n.dessin = function () {
      A.vider(g);
      fig.chip(null);
      if (n.mode === "salle") {
        n.salle();
        A.icone(g, "air", [340, 120], 46, C.acc);
        A.texte(g, "Ventilation du bloc", [340, 50], { taille: 18, gras: 800 });
      } else if (n.mode === "clim") {
        n.salle();
        A.boite(g, 470, 100, 130, 50, { fond: "#fff", bord: C.encre, rx: 8, titre: "Climatiseur", taille: 15 });
        for (var k = 0; k < 3; k++) A.s("path", { d: "M" + (480 + k * 40) + " 160 q-20 40 -60 60", fill: "none", stroke: C.acc, "stroke-width": 3, "stroke-dasharray": "6 5" }, g);
        A.texte(g, "Climatiseur mural de bureau (exemple ajouté)", [340, 540], { taille: 15, coul: C.doux });
      } else {
        // humidité : jauge et conséquences
        n.salle();
        var h = n.hum, trop = h > 70, sec = h < 30, ok = !trop && !sec;
        A.s("rect", { x: 90, y: 40, width: 500, height: 22, rx: 11, fill: C.pale }, g);
        A.s("rect", { x: 90 + 500 * 0.3, y: 40, width: 500 * 0.4, height: 22, fill: C.okPale, stroke: C.ok, "stroke-width": 2 }, g);
        A.s("circle", { cx: 90 + 5 * h, cy: 51, r: 14, fill: ok ? C.ok : C.ko, stroke: "#fff", "stroke-width": 3 }, g);
        A.texte(g, "sec", [90, 20], { taille: 14, coul: C.doux, ancre: "start" }); A.texte(g, "humide", [590, 20], { taille: 14, coul: C.doux, ancre: "end" });
        A.texte(g, "plage du référentiel", [340, 20], { taille: 14, coul: C.ok });
        if (trop) {
          for (var i = 0, gr = 3; i < 22; i++) { gr = (gr * 9301 + 49297) % 233280; var px = gr / 233280; gr = (gr * 9301 + 49297) % 233280; A.s("ellipse", { cx: 80 + px * 520, cy: 96 + gr / 233280 * 110, rx: 4, ry: 6, fill: "#7fb2e5" }, g); }
          for (var m = 0; m < 9; m++) A.s("circle", { cx: 70 + m * 8, cy: 470 - (m % 3) * 10, r: 7, fill: "#5d7a46", opacity: 0.55 }, g);
          A.texte(g, "condensation", [340, 230], { taille: 17, coul: C.acc });
          A.texte(g, "développement microbiologique", [200, 440], { taille: 15, coul: "#5d7a46" });
          A.boite(g, 470, 380, 120, 80, { fond: C.koPale, bord: C.ko, rx: 8, titre: "équipement dégradé", taille: 13 });
        }
        if (sec || trop) A.texte(g, "inconfort", [500, 300], { taille: 17, coul: C.ko });
        if (ok) A.texte(g, "Humidité maîtrisée", [340, 230], { taille: 20, coul: C.ok, gras: 800 });
        fig.chip(null);
      }
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Ce que la ventilation évite", jouer: function (j, n) {
      j.titre("La ventilation est l'une des contraintes les plus importantes du bloc. Relie chaque objectif à ce qu'il évite.");
      var O = ["Contrôler la contamination particulaire", "Évacuer les gaz anesthésiques", "Maintenir les gradients de pression", "Contrôler l'humidité", "Maintenir la température"];
      var R = ["L'air du couloir qui entre dans la salle", "La condensation sur les surfaces", "Des particules et des germes au-dessus de la plaie", "Un patient qui se refroidit", "L'exposition de l'équipe aux agents anesthésiques"];
      var pa = ARCHI.paires({ g: n.g, gauche: O, droite: R, bon: [2, 4, 0, 1, 3], xg: 20, wg: 270, xd: 330, wd: 330, y0: 60, h: 88, pas: 106, taille: 16, tailleD: 15,
        erreur: j.erreur, info: j.info,
        aide: function (i) { return ["Les particules flottent dans l'air, et les germes avec elles.", "Ces gaz s'échappent du circuit d'anesthésie.", "Un gradient de pression décide du sens de l'air entre deux pièces.", "Trop d'eau dans l'air se dépose sur les surfaces froides.", "Le patient anesthésié règle mal sa température."][i]; },
        fin: function () {
          j.bravo("Cinq objectifs, cinq risques évités.");
          j.expliquer("<p>Les objectifs de la ventilation du bloc : contrôler la contamination particulaire, évacuer les gaz anesthésiques, maintenir la température, contrôler l'humidité, maintenir les gradients de pression, assurer le confort du personnel, contribuer à la prévention des infections. L'OMS indique qu'elle contribue notamment au maintien de la qualité de l'air et au contrôle des exigences de pression.</p>");
          j.suite();
        } });
      j.reponse(function () { pa.resoudre(); });
    } },
    { nom: "Un climatiseur suffit ?", jouer: function (j, n) {
      n.mode = "clim"; n.dessin();
      j.titre("Pour économiser, quelqu'un propose un climatiseur mural de bureau dans la salle d'opération. Ton avis ?");
      j.choix([
        { html: "Il suffit : il refroidit la salle", aide: "Refroidir n'est qu'un des objectifs. Que fait-il pour les particules, la pression, les gaz anesthésiques ?" },
        { html: "Non : la ventilation du bloc n'est pas un simple problème de climatisation", juste: true },
        { html: "Il suffit s'il est assez puissant", aide: "La puissance ne crée ni filtration, ni pression positive, ni évacuation des gaz." }
      ], { colonnes: 1, ok: function () {
        j.bravo("C'est même l'erreur n° 10 du cours.");
        j.expliquer("<p>Un climatiseur recycle l'air de la pièce sans le filtrer pour le bloc, sans créer de pression positive et sans évacuer les gaz. Considérer la ventilation comme un simple problème de climatisation fait partie des erreurs fréquentes à éviter.</p>");
        j.suite();
      } });
    } },
    { nom: "L'humidité", jouer: function (j, n) {
      n.mode = "hum"; n.hum = 85; n.libre = true; n.dessin();
      j.titre("L'air de la salle est trop humide. Observe ce qui se passe, puis ramène l'humidité dans la plage du référentiel.");
      j.consigne("La plage exacte est donnée par le référentiel du projet ; ici, elle est seulement figurée.");
      var c = j.curseur({ nom: "Humidité", min: 0, max: 100, pas: 1, val: 85, unite: "", change: function (v) {
        if (!n.libre) return;
        n.hum = v; n.dessin();
        if (v >= 30 && v <= 70) fini();
      } });
      function fini() {
        n.libre = false;
        j.bravo("Humidité maîtrisée.");
        j.expliquer("<p>L'humidité doit être contrôlée pour éviter la <b>condensation</b>, le <b>développement microbiologique</b>, la <b>dégradation des équipements</b> et l'<b>inconfort</b>. Le CDC souligne l'importance du contrôle de l'humidité et de la température dans les salles d'opération.</p>");
        j.suite();
      }
      j.reponse(function () { c.regler(50); n.hum = 50; n.dessin(); fini(); });
    } },
    { nom: "La température", jouer: function (j, n) {
      n.mode = "salle"; n.dessin();
      j.titre("Un étudiant écrit : « La température du bloc est fixée une fois pour toutes à la construction. » Trouve ce qui ne va pas.");
      j.choix([
        { html: "Rien : une température fixe est plus sûre", aide: "Une chirurgie de nouveau-né et une chirurgie longue de l'adulte n'ont pas les mêmes besoins." },
        { html: "Elle doit être contrôlable et adaptée au type d'intervention, au confort du patient et aux équipements", juste: true },
        { html: "La température ne concerne que le confort du personnel", aide: "Le cours cite aussi le patient et les équipements." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Contrôlable, adaptée au type d'intervention, compatible avec le patient et les équipements.");
        j.suite();
      } });
    } }
  ]
}));
