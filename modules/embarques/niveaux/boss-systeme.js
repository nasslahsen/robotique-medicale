/* Boss du chapitre 1 : concevoir un pilulier connecté (exemple ajouté). Schéma bloc, machine à états, exigences, fonctions du logiciel, couches, autonomie. */
NIVEAU({
  id: "boss-systeme",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { mode: "schema", rempli: false, etat: "ouvert", surTouche: null, allume: {} };
    var ETATS = {
      attente: [40, 90, 200, 76, "Attente"], heure: [440, 90, 200, 76, "Heure\nde la prise"],
      ouvert: [440, 300, 200, 76, "Compartiment\nouvert"], alerte: [40, 300, 200, 76, "Alerte\nau soignant"]
    };
    n.ETATS = ETATS;
    n.dessin = function () {
      EMB.vider(g);
      if (n.mode === "schema") {
        EMB.el("rect", { x: 150, y: 60, width: 520, height: 470, rx: 6, fill: "none", stroke: C.encre, "stroke-width": 2, "stroke-dasharray": "8 6" }, g);
        EMB.texte(g, "Pilulier connecté", [410, 86], { taille: 18, coul: C.doux });
        EMB.bloc(g, 10, 140, 120, 70, "Capteur de\nprésence", { taille: 15, fill: "#d9dce3" });
        EMB.bloc(g, 10, 330, 120, 70, "Moteur du\ncompartiment", { taille: 15, fill: "#d9dce3" });
        EMB.bloc(g, 330, 220, 120, 100, "µC", { taille: 26 });
        var T = [[170, 330, "Driver\nmoteur", "a"], [500, 220, "TX Radio", "b"], [500, 410, "Gestion\nAlim.", "c"]];
        T.forEach(function (t) {
          EMB.bloc(g, t[0], t[1], 130, 80, n.rempli ? t[2] : t[3].toUpperCase(), { taille: n.rempli ? 16 : 28, actif: n.rempli, tirets: n.rempli ? null : "6 5", coul: n.rempli ? C.encre : C.acc });
        });
        EMB.fleche(g, [130, 175], [330, 250], { ep: 2.5 });
        EMB.fleche(g, [330, 300], [300, 340], { ep: 2.5 });
        EMB.fleche(g, [170, 370], [130, 365], { ep: 2.5 });
        EMB.fleche(g, [450, 260], [500, 260], { double: true, ep: 2.5 });
        EMB.fleche(g, [500, 440], [440, 320], { ep: 2.5 });
        EMB.el("path", { d: "M630 260 H650 V140 M638 124 L650 144 L662 124 Z", fill: "none", stroke: C.encre, "stroke-width": 2.5 }, g);
        EMB.texte(g, "Accu", [600, 560], { taille: 16, gras: false });
        EMB.el("line", { x1: 565, y1: 490, x2: 565, y2: 540, stroke: C.encre, "stroke-width": 2.5 }, g);
      } else if (n.mode === "etats") {
        Object.keys(ETATS).forEach(function (k) {
          var e = ETATS[k];
          EMB.bloc(g, e[0], e[1], e[2], e[3], e[4], { taille: 19, actif: n.etat === k || n.allume[k], rx: 38 });
        });
        var F = [
          [[240, 128], [440, 128], "il est 8 h", [340, 106]],
          [[540, 166], [540, 300], "moteur\nouvert", [600, 233]],
          [[440, 315], [240, 128], "pilule prise", [300, 196]],
          [[440, 355], [240, 355], "30 min\nsans prise", [340, 390]],
          [[140, 300], [140, 166], "acquittée", [80, 233]]
        ];
        F.forEach(function (f) { EMB.fleche(g, f[0], f[1], { ep: 3 }); EMB.texte(g, f[2], f[3], { taille: 15, gras: false, coul: C.doux }); });
      } else {
        // autonomie : accumulateur et consommation moyenne
        EMB.el("rect", { x: 140, y: 150, width: 300, height: 150, rx: 16, fill: "#fff", stroke: C.encre, "stroke-width": 4 }, g);
        EMB.el("rect", { x: 440, y: 195, width: 22, height: 60, rx: 4, fill: C.encre }, g);
        EMB.el("rect", { x: 152, y: 162, width: 220, height: 126, rx: 8, fill: C.ok, opacity: 0.75 }, g);
        EMB.texte(g, "2000 mAh", [290, 225], { taille: 34, mono: true, halo: false });
        EMB.texte(g, "consommation moyenne", [300, 380], { taille: 18, coul: C.doux, gras: false });
        EMB.texte(g, "5 mA", [300, 425], { taille: 40, mono: true });
      }
    };
    EMB.toucher(fig.svg, function () {
      if (n.mode !== "etats" || !n.surTouche) return {};
      var z = {}; Object.keys(ETATS).forEach(function (k) { z[k] = ETATS[k].slice(0, 4); }); return z;
    }, function (k) { if (n.surTouche) n.surTouche(k); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Le schéma bloc", jouer: function (j, n) {
      j.titre("Exemple ajouté : un pilulier ouvre le bon compartiment à l'heure de la prise, détecte si la pilule est prise et prévient le soignant. Complète les blocs A, B et C.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:10px 14px;align-items:center;font-size:18px"><b>A</b><span class="trou" data-attendu="drv"></span><b>B</b><span class="trou" data-attendu="radio"></span><b>C</b><span class="trou" data-attendu="alim"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "alim", html: "Gestion Alim." }, { id: "adc", html: "ADC" }, { id: "radio", html: "TX Radio" }, { id: "drv", html: "Driver moteur" }],
        aide: "Un µC ne peut pas alimenter un moteur directement ; l'antenne est reliée à un bloc d'émission ; l'accumulateur passe par un bloc qui gère l'énergie.",
        ok: function () {
          n.rempli = true; n.dessin();
          j.bravo("Driver moteur, TX Radio, gestion de l'alimentation.");
          j.suite();
        }
      });
    } },
    { nom: "Machine à états", jouer: function (j, n) {
      n.mode = "etats"; n.etat = "ouvert"; n.allume = {}; n.dessin();
      j.titre("Le compartiment est ouvert depuis 30 minutes et la pilule n'a pas été prise. Touche l'état suivant.");
      var fini = false;
      n.surTouche = function (k) {
        if (fini) return;
        if (k !== "alerte") { j.erreur(k === "attente" ? "Vers « Attente », la flèche dit « pilule prise ». Ce n'est pas le cas." : "Cherche la flèche qui part de « Compartiment ouvert » avec la bonne condition."); return; }
        fini = true; n.surTouche = null; n.etat = "alerte"; n.dessin();
        j.bravo("Alerte au soignant.", [140, 338]);
        j.suite();
      };
      j.reponse(function () { if (n.surTouche) n.surTouche("alerte"); });
    } },
    { nom: "Exigences", jouer: function (j, n) {
      n.mode = "schema"; n.dessin();
      j.titre("Associe chaque ligne du cahier des charges à son exigence.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:10px 14px;align-items:center;font-size:17px">' +
        '<span>Ne jamais ouvrir deux compartiments à la fois.</span><span class="trou" data-attendu="s"></span>' +
        '<span>L\'alerte part moins d\'une seconde après les 30 minutes.</span><span class="trou" data-attendu="t"></span>' +
        '<span>Chaque version du logiciel passe 200 scénarios de test.</span><span class="trou" data-attendu="v"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "v", html: "<i>Verification</i>" }, { id: "t", html: "<i>Responsiveness</i>" }, { id: "r", html: "<i>Cost</i>" }, { id: "s", html: "<i>Safety</i>" }],
        aide: "Deux pilules à la fois mettent le patient en danger. Un délai est un temps de réponse. Des tests qui prouvent le bon fonctionnement, c'est la vérification.",
        ok: function () { j.bravo("Sécurité, temps de réponse, vérification."); j.suite(); }
      });
    } },
    { nom: "Fonction du logiciel", jouer: function (j, n) {
      j.titre("Pour savoir qu'il est 8 h et que 30 minutes sont passées, quelle fonction du logiciel embarqué le programme utilise-t-il ?");
      j.choix([
        { html: "<i>read data from input ports</i>", aide: "Lire un port donne l'état d'un capteur, pas l'heure." },
        { html: "<i>timer interrupt facilities for timing the controller algorithm</i>", juste: true },
        { html: "<i>send data to output ports</i>", aide: "Envoyer sur un port sert à commander, pas à mesurer le temps." }
      ], { colonnes: 1, ok: function () { j.bravo("Les interruptions du timer cadencent l'algorithme."); j.suite(); } });
    } },
    { nom: "Pourquoi un RTOS ?", jouer: function (j, n) {
      j.titre("Le pilulier surveille le capteur, gère la radio et compte le temps, chaque tâche avec son délai. Quelle couche les ordonne ?");
      j.choix([
        { html: "La HAL", aide: "La HAL cache le matériel ; elle n'ordonne pas les tâches." },
        { html: "Le RTOS (<i>Real-Time Operating System</i>)", juste: true },
        { html: "Le Boot", aide: "Le Boot ne s'exécute qu'au démarrage." }
      ], { colonnes: 1, ok: function () { j.bravo("Le RTOS, système d'exploitation temps réel."); j.suite(); } });
    } },
    { nom: "Autonomie", jouer: function (j, n) {
      n.mode = "accu"; n.dessin();
      j.titre("Ressources limitées : avec un accumulateur de 2000 mAh et une consommation moyenne de 5 mA, combien de jours tient le pilulier ?");
      j.nombre({ avant: "\\text{autonomie} =", apres: "\\text{jours}", cases: [{ attendu: 2000 / 5 / 24, tol: 0.05 }], ligne: true,
        aide: function () { return "Capacité divisée par courant donne des heures ; divise ensuite par 24."; },
        ok: function () {
          j.bravo("2000 / 5 = 400 h, soit environ 16,7 jours.");
          j.expliquer("\\[ t = \\frac{Q}{I} = \\frac{2000 \\text{ mAh}}{5 \\text{ mA}} = 400 \\text{ h} \\approx 16{,}7 \\text{ jours} \\]<p>C'est la contrainte de consommation électrique du cours, chiffrée.</p>");
          j.suite();
        } });
    } }
  ]
});
