(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure 1 : les quatre familles de décisions ---------- */
  (function () {
    var f = R.figure("fig-familles", {
      largeur: 960, hauteur: 480,
      titre: "Quatre familles de décisions de conception",
      essai: "<strong>Essaie</strong> : touche une famille avec les boutons. <strong>Observe</strong> : chaque famille répond à une question différente, et les exigences (en bas à droite) contraignent les trois autres.",
      direct: false
    });
    var g = EMB.el("g", null, f.svg);
    var F = [
      { id: "hw", nom: "Hardware", q: "Sur quoi tourne-t-il ?", c: "Microcontrollers\nEmbedded Controllers\nDSP, …", x: 30, y: 20 },
      { id: "mod", nom: "Modelling", q: "Comment se comporte-t-il ?", c: "flowcharts\nstate machines / diagrams\nRT UML, SysML, …", x: 495, y: 20 },
      { id: "sw", nom: "Software", q: "Comment le programme-t-on ?", c: "assembler, C/C++, python, …\n4 fonctions : lire, écrire,\ncalculer, cadencer", x: 30, y: 250 },
      { id: "req", nom: "Requirements", q: "Que doit-il garantir ?", c: "Responsiveness (time)\nReliability, Safety\nVerification, Cost, …", x: 495, y: 250 }
    ];
    var choix = "tout", b = R.boutons(f.reglages), btns = {};
    F.forEach(function (x) { btns[x.id] = R.bouton(b, x.nom, function () { choix = x.id; dessiner(); }); });
    R.bouton(b, "Tout voir", function () { choix = "tout"; dessiner(); });
    function dessiner() {
      EMB.vider(g);
      F.forEach(function (x) {
        btns[x.id].classList.toggle("actif", choix === x.id);
        var on = choix === x.id || choix === "tout";
        EMB.el("rect", { x: x.x, y: x.y, width: 435, height: 210, rx: 20, fill: on ? EMB.teinte(0.1) : "#fafbfd", stroke: on ? C.acc : C.pale, "stroke-width": on ? 3 : 2 }, g);
        EMB.texte(g, x.nom, [x.x + 217, x.y + 36], { taille: 26, coul: on ? C.acc : C.doux, italique: true });
        EMB.texte(g, x.q, [x.x + 217, x.y + 72], { taille: 17, coul: C.doux, gras: false });
        if (on) EMB.texte(g, x.c, [x.x + 217, x.y + 142], { taille: 19, gras: false });
      });
      // les exigences contraignent le reste
      if (choix === "req" || choix === "tout") {
        EMB.fleche(g, [495, 300], [465, 300], { ep: 3, coul: C.acc });
        EMB.fleche(g, [712, 250], [712, 230], { ep: 3, coul: C.acc });
        EMB.fleche(g, [520, 255], [440, 215], { ep: 3, coul: C.acc });
      }
    }
    dessiner();
  })();

  /* ---------- Figure 2 : la boucle d'un programme embarqué, fonction par fonction ---------- */
  (function () {
    var f = R.figure("fig-boucle", {
      largeur: 960, hauteur: 440,
      titre: "Organigramme de la boucle de la semelle (exemple ajouté)",
      essai: "<strong>Essaie</strong> : avance étape par étape. <strong>Observe</strong> : chaque bloc de l'organigramme réalise une des quatre fonctions du logiciel embarqué ; l'interruption du timer relance la boucle à intervalle régulier."
    });
    var g = EMB.el("g", null, f.svg);
    var BL = [
      ["Attendre l'interruption\ndu timer (toutes les 10 ms)", "timer interrupt facilities for timing the controller algorithm"],
      ["Lire les 16 capteurs\nsur les ports d'entrée", "read data from input ports"],
      ["Calculer la pression\nmoyenne de chaque zone", "internal data transfer and mathematical operations"],
      ["Envoyer les valeurs\nau port de sortie (radio)", "send data to output ports"]
    ];
    var zone = R.h("p", null, "", f.direct);
    var et = R.etapes(f.reglages, 4, ["départ", "attendre le timer", "lire", "calculer", "envoyer"], dessiner);
    function dessiner(k) {
      EMB.vider(g);
      BL.forEach(function (b, i) {
        var y = 20 + i * 104, on = k === i + 1;
        EMB.bloc(g, 60, y, 330, 76, b[0], { taille: 18, actif: on, gras: false });
        if (i < 3) EMB.fleche(g, [225, y + 76], [225, y + 104], { ep: 3 });
        EMB.texte(g, b[1], [430, y + 38], { taille: 18, ancre: "start", italique: true, gras: false, coul: on ? C.acc : C.gris });
      });
      EMB.el("path", { d: "M60 370 H30 V58 H52", fill: "none", stroke: C.encre, "stroke-width": 3 }, g);
      EMB.fleche(g, [40, 58], [58, 58], { ep: 3 });
      zone.innerHTML = k ? "Fonction du logiciel : <i>" + BL[k - 1][1] + "</i>." : "La boucle tourne sans fin : à chaque tic du timer, elle lit, calcule et envoie.";
    }
    et.aller(0);
  })();

  /* ---------- Figure 3 : une machine à états ---------- */
  (function () {
    var f = R.figure("fig-etats", {
      largeur: 960, hauteur: 430,
      titre: "Machine à états d'un tensiomètre (exemple ajouté)",
      essai: "<strong>Essaie</strong> : déclenche les événements avec les boutons. <strong>Observe</strong> : un événement ne fait changer d'état que s'il existe une flèche à son nom qui part de l'état courant ; sinon il est ignoré.",
    });
    var g = EMB.el("g", null, f.svg);
    var E_ = { repos: [70, 40, 240, 90, "Repos"], gonfle: [650, 40, 240, 90, "Gonflage"], mesure: [650, 290, 240, 90, "Dégonflage\net mesure"], affiche: [70, 290, 240, 90, "Affichage"] };
    var T = { start: ["repos", "gonfle"], max: ["gonfle", "mesure"], fin: ["mesure", "affiche"], delai: ["affiche", "repos"] };
    var etat = "repos", zone = R.h("p", null, "État courant : « Repos ». Déclenche un événement.", f.direct), b = R.boutons(f.reglages);
    [["start", "Appui sur Start"], ["max", "Pression max atteinte"], ["fin", "Mesure finie"], ["delai", "30 s écoulées"]].forEach(function (x) {
      R.bouton(b, x[1], function () {
        if (T[x[0]][0] === etat) { etat = T[x[0]][1]; zone.textContent = "Transition : on passe à « " + E_[etat][4].replace("\n", " ") + " »."; }
        else zone.textContent = "« " + x[1] + " » n'a pas de flèche qui part de « " + E_[etat][4].replace("\n", " ") + " » : rien ne se passe.";
        dessiner();
      });
    });
    R.bouton(b, "Recommencer", function () { etat = "repos"; zone.textContent = "État courant : « Repos ». Déclenche un événement."; dessiner(); });
    function dessiner() {
      EMB.vider(g);
      Object.keys(E_).forEach(function (k) { var e = E_[k]; EMB.bloc(g, e[0], e[1], e[2], e[3], e[4], { taille: 22, actif: etat === k, rx: 45 }); });
      var F = [[[310, 85], [650, 85], "appui sur Start", [480, 62]], [[770, 130], [770, 290], "pression max\natteinte", [790, 210]], [[650, 335], [310, 335], "mesure finie", [480, 312]], [[190, 290], [190, 130], "30 s écoulées", [170, 210]]];
      F.forEach(function (x, i) { EMB.fleche(g, x[0], x[1], { ep: 3 }); EMB.texte(g, x[2], x[3], { taille: 17, gras: false, coul: C.doux, ancre: i === 1 ? "start" : i === 3 ? "end" : "middle" }); });
    }
    dessiner();
  })();
})();
