/* Niveau : exigences de conception (Section I, diapositive 5). Matériel, modélisation, logiciel, exigences. */
NIVEAU({
  id: "conception",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { mode: "quatre", montre: {}, allume: null, surTouche: null, etat: "repos", vus: {} };
    // organigramme de la boucle de la semelle (exemple ajouté)
    var BLOCS = {
      A: [190, 90, 300, 70, "Attendre l'interruption\ndu timer (toutes les 10 ms)"],
      B: [190, 205, 300, 70, "Lire les 16 capteurs\nsur les ports d'entrée"],
      C: [190, 320, 300, 70, "Calculer la pression\nmoyenne de chaque zone"],
      D: [190, 435, 300, 70, "Envoyer les valeurs\nau port de sortie (radio)"]
    };
    // machine à états du tensiomètre (exemple ajouté)
    var ETATS = {
      repos: [60, 110, 210, 80, "Repos"],
      gonfle: [410, 110, 210, 80, "Gonflage"],
      mesure: [410, 330, 210, 80, "Dégonflage\net mesure"],
      affiche: [60, 330, 210, 80, "Affichage"]
    };
    n.BLOCS = BLOCS; n.ETATS = ETATS;
    n.dessin = function () {
      EMB.vider(g);
      if (n.mode === "quatre") {
        var Q = [["hw", "Hardware", 20, 64], ["mod", "Modelling", 350, 64], ["sw", "Software", 20, 334], ["req", "Requirements", 350, 334]];
        var CONT = {
          hw: "Microcontrollers\nEmbedded Controllers\nDSP, …",
          mod: "flowcharts\nstate machines / diagrams\nRT UML, SysML, …",
          sw: "assembler, C/C++,\npython, …\n+ 4 fonctions",
          req: "Responsiveness (time)\nReliability, Safety\nVerification, Cost, …"
        };
        Q.forEach(function (q) {
          var vu = n.montre[q[0]], on = n.focus ? n.focus === q[0] : vu;
          EMB.el("rect", { x: q[2], y: q[3], width: 310, height: 256, rx: 20, fill: on ? EMB.teinte(0.1) : "#fafbfd", stroke: on ? C.acc : C.pale, "stroke-width": on ? 3 : 2 }, g);
          EMB.texte(g, q[1], [q[2] + 155, q[3] + 40], { taille: 24, coul: on ? C.acc : C.doux });
          if (vu) EMB.texte(g, CONT[q[0]], [q[2] + 155, q[3] + 145], { taille: 18, gras: false, coul: on ? C.encre : C.doux });
          else EMB.texte(g, "?", [q[2] + 155, q[3] + 145], { taille: 54, coul: C.pale, halo: false });
        });
      } else if (n.mode === "organigramme") {
        Object.keys(BLOCS).forEach(function (k, i) {
          var b = BLOCS[k], on = n.allume === k, vu = n.vus[k];
          EMB.bloc(g, b[0], b[1], b[2], b[3], b[4], { taille: 17, actif: on || vu, gras: false });
          EMB.texte(g, k, [b[0] - 34, b[1] + b[3] / 2], { taille: 26, coul: on ? C.acc : C.doux });
          if (i < 3) EMB.fleche(g, [340, b[1] + b[3]], [340, b[1] + 115], { ep: 3 });
        });
        // retour de boucle
        EMB.el("path", { d: "M490 470 H580 V125 H520", fill: "none", stroke: C.encre, "stroke-width": 3 }, g);
        EMB.fleche(g, [522, 125], [492, 125], { ep: 3 });
        EMB.texte(g, "boucle", [596, 298], { taille: 15, coul: C.doux, gras: false, ancre: "start" });
      } else {
        Object.keys(ETATS).forEach(function (k) {
          var e = ETATS[k], on = n.etat === k;
          EMB.bloc(g, e[0], e[1], e[2], e[3], e[4], { taille: 20, actif: on, rx: 40 });
        });
        var T = [
          [[270, 150], [410, 150], "appui sur Start", [340, 128]],
          [[515, 190], [515, 330], "pression max\natteinte", [600, 260]],
          [[410, 370], [270, 370], "mesure finie", [340, 350]],
          [[165, 330], [165, 190], "après 30 s", [95, 260]]
        ];
        T.forEach(function (t) { EMB.fleche(g, t[0], t[1], { ep: 3, coul: C.encre }); EMB.texte(g, t[2], t[3], { taille: 15, gras: false, coul: C.doux }); });
        EMB.texte(g, "brassard", [165, 470], { taille: 15, coul: C.doux, gras: false });
        var pr = { repos: 0, gonfle: 0.8, mesure: 0.45, affiche: 0 }[n.etat];
        EMB.el("rect", { x: 120, y: 490, width: 90, height: 70, rx: 18, fill: "#fff", stroke: C.encre, "stroke-width": 2.5 }, g);
        EMB.el("rect", { x: 128, y: 553 - 56 * pr, width: 74, height: Math.max(0, 56 * pr), rx: 10, fill: C.acc, opacity: 0.6 }, g);
        EMB.texte(g, "pression", [460, 470], { taille: 15, coul: C.doux, gras: false });
        EMB.el("rect", { x: 330, y: 500, width: 260, height: 26, rx: 13, fill: C.fond, stroke: C.pale, "stroke-width": 2 }, g);
        EMB.el("rect", { x: 330, y: 500, width: 260 * pr, height: 26, rx: 13, fill: C.acc }, g);
      }
    };
    EMB.toucher(fig.svg, function () {
      if (!n.surTouche) return {};
      var z = {}, src = n.mode === "organigramme" ? BLOCS : n.mode === "etats" ? ETATS : {};
      Object.keys(src).forEach(function (k) { z[k] = src[k].slice(0, 4); }); return z;
    }, function (k) { if (n.surTouche) n.surTouche(k); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Quatre familles", jouer: function (j, n) {
      j.fig.astuce("Les quatre familles de décisions de conception du cours.");
      j.titre("Tu conçois la semelle connectée. Range chaque décision dans sa famille.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:10px 14px;align-items:center;font-size:18px"><b>Hardware</b><span class="trou" data-attendu="dsp"></span><b>Modelling</b><span class="trou" data-attendu="sysml"></span><b>Software</b><span class="trou" data-attendu="c"></span><b>Requirements</b><span class="trou" data-attendu="safety"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "c", html: "écrire en C/C++" }, { id: "safety", html: "ne jamais blesser le patient" }, { id: "dsp", html: "prendre un DSP" }, { id: "sysml", html: "dessiner un diagramme SysML" }],
        aide: "Le matériel, c'est la puce. Un diagramme sert à modéliser. Un langage, c'est le logiciel. Une contrainte à respecter, c'est une exigence.",
        ok: function () {
          n.montre = { hw: true, mod: true, sw: true, req: true }; n.dessin();
          j.bravo("Matériel, modélisation, logiciel, exigences.");
          j.expliquer("<p>Concevoir un système embarqué, c'est choisir le <b>matériel</b> (<i>Hardware</i> : microcontrôleurs, contrôleurs embarqués, DSP), le <b>modéliser</b> (<i>Modelling</i> : organigrammes, machines à états, RT UML, SysML), écrire le <b>logiciel</b> (<i>Software</i>) et respecter des <b>exigences</b> (<i>Requirements</i>).</p>");
          j.suite();
        }
      });
    } },
    { nom: "Les fonctions du logiciel", jouer: function (j, n) {
      n.mode = "organigramme"; n.allume = null; n.vus = {}; n.dessin();
      j.fig.astuce("Exemple ajouté : la boucle du programme de la semelle.");
      j.titre("Le cours cite la fonction « timer interrupt facilities for timing the controller algorithm ». Touche le bloc qui la réalise.");
      var fini = false, AIDE = {
        B: "B lit les ports d'entrée : c'est « read data from input ports ».",
        C: "C calcule : c'est « internal data transfer and mathematical operations ».",
        D: "D envoie vers la radio : c'est « send data to output ports »."
      };
      n.surTouche = function (k) {
        if (fini) return;
        n.allume = k; n.dessin();
        if (k !== "A") { j.erreur(AIDE[k]); return; }
        fini = true; n.surTouche = null; n.vus = { A: true, B: true, C: true, D: true }; n.dessin();
        j.bravo("A : l'interruption du timer cadence l'algorithme.", [340, 125]);
        j.expliquer("<p>Le logiciel embarqué a quatre fonctions : <i>read data from input ports</i> (B), <i>internal data transfer and mathematical operations</i> (C), <i>send data to output ports</i> (D), <i>timer interrupt facilities for timing the controller algorithm</i> (A). Langages : assembleur, C/C++, python.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surTouche) n.surTouche("A"); });
    } },
    { nom: "Machine à états", jouer: function (j, n) {
      n.mode = "etats"; n.etat = "gonfle"; n.dessin();
      j.fig.astuce("Exemple ajouté : un tensiomètre modélisé par une machine à états.");
      j.titre("Le tensiomètre est en « Gonflage » et la pression maximale vient d'être atteinte. Touche l'état suivant.");
      var fini = false;
      n.surTouche = function (k) {
        if (fini) return;
        if (k !== "mesure") { j.erreur(k === "gonfle" ? "Il y est déjà. Suis la flèche « pression max atteinte »." : "Suis la flèche qui part de « Gonflage » : elle est marquée « pression max atteinte »."); return; }
        fini = true; n.surTouche = null; n.etat = "mesure"; n.dessin();
        j.bravo("Dégonflage et mesure.", [515, 370]);
        j.expliquer("<p>Une <b>machine à états</b> (<i>state machine</i>) décrit les situations possibles du système et les événements qui font passer de l'une à l'autre. C'est un outil de modélisation : on la dessine avant d'écrire le code, et chaque état devient un morceau du programme.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surTouche) n.surTouche("mesure"); });
    } },
    { nom: "Quelle exigence ?", jouer: function (j, n) {
      n.mode = "quatre"; n.montre = { hw: true, mod: true, sw: true, req: true }; n.focus = "req"; n.dessin();
      j.fig.astuce("Requirements : Responsiveness (time), Reliability, Safety, Verification, Cost.");
      j.titre("Associe chaque phrase d'un cahier des charges de pousse-seringue à l'exigence qu'elle exprime.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:10px 14px;align-items:center;font-size:17px">' +
        '<span>Arrêter le moteur moins de 50 ms après une occlusion.</span><span class="trou" data-attendu="t"></span>' +
        '<span>Fonctionner 5 ans sans panne.</span><span class="trou" data-attendu="r"></span>' +
        '<span>Ne pas dépasser 40 euros de composants.</span><span class="trou" data-attendu="c"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "r", html: "<i>Reliability</i>" }, { id: "c", html: "<i>Cost</i>" }, { id: "t", html: "<i>Responsiveness</i>" }],
        aide: "Un délai, c'est le temps de réponse. Durer sans panne, c'est la fiabilité. Un prix, c'est le coût.",
        ok: function () {
          j.bravo("Temps de réponse, fiabilité, coût.");
          j.expliquer("<p>Les exigences du cours : <i>Responsiveness (time), Reliability, Safety, Verification, Cost</i>. En médical, <i>Safety</i> (ne pas nuire au patient) et <i>Verification</i> (prouver que le système fait ce qu'il doit) pèsent lourd.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Trouve l'erreur", jouer: function (j, n) {
      j.titre("Un camarade résume : « En embarqué, le logiciel s'écrit uniquement en assembleur, et la modélisation se fait directement dans le code. » Qu'est-ce qui est faux ?");
      j.choix([
        { html: "Rien, c'est le cours", aide: "Relis la diapositive : plusieurs langages sont cités, et la modélisation a ses propres outils." },
        { html: "Les deux moitiés : le cours cite aussi C/C++ et python, et on modélise avec des organigrammes, machines à états, RT UML, SysML", juste: true },
        { html: "Seulement la fin : l'assembleur est bien le seul langage", aide: "Le cours cite « assembler, C/C++, python »." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Plusieurs langages, et une modélisation à part entière avant le code.");
        j.suite();
      } });
    } }
  ]
});
