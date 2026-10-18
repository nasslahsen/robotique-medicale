/* Figures : les quatre phases d'un schéma directeur ; ses trois branches. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-phases", {
    largeur: 960, hauteur: 460, titre: "Les quatre phases d'un SDSI",
    essai: "<strong>Essaie</strong> : avance phase par phase. <strong>Observe</strong> : on ne choisit la cible (phase 3) qu'après avoir regardé l'existant (phase 2)."
  });
  var P = [
    { t: "1. Initialisation et cadrage", sous: "démarrer et cadrer ; définir le pilotage", x: 20, y: 40, w: 420, h: 150 },
    { t: "2. Analyse critique du SI existant", sous: "vue fidèle de l'existant ; risques et faiblesses", x: 520, y: 40, w: 420, h: 150 },
    { t: "3. Axes stratégiques SI", sous: "besoins futurs ; opportunité et impact ; axes ; cible", x: 520, y: 270, w: 420, h: 150 },
    { t: "4. Élaboration du schéma directeur", sous: "portefeuille projets ; finaliser le SDSI", x: 20, y: 270, w: 420, h: 150 }
  ];
  A.etapesFig(f, P, [
    "On démarre et on cadre le projet, et on définit son pilotage (comité, calendrier).",
    "On obtient une vue fidèle de l'existant et on analyse ses risques et ses faiblesses.",
    "On établit les besoins futurs, on étudie l'opportunité et l'impact, on définit les axes stratégiques SI et une cible.",
    "On organise la gestion du portefeuille de projets et on finalise le schéma directeur, valable 3 à 5 ans."
  ], { taille: 19, depart: "Le SDSI est établi par la DSI et validé par la direction générale et métier. Avance pour voir ses phases." });

  var f2 = R.figure("fig-branches", {
    largeur: 960, hauteur: 500, titre: "Les trois branches du schéma directeur",
    essai: "<strong>Essaie</strong> : touche chaque branche. <strong>Observe</strong> : les applications et les processus sont au croisement de deux branches."
  });
  var g2 = A.s("g", null, f2.svg);
  var F = { inf: [790, 50], app: [790, 130], info: [790, 210], proc: [790, 290], strat: [790, 370], mis: [790, 450] };
  var BR = [
    { t: "Informatique", m: "Technologie", y: 100, f: ["inf", "app"], coul: C.brun, pale: C.brunPale, d: "l'informatique se traduit en technologie : infrastructures et applications." },
    { t: "Système d'information", m: "Information", y: 250, f: ["app", "info", "proc"], coul: C.acc, pale: C.accPale, d: "le système d'information se traduit en information : applications, informations, processus." },
    { t: "Stratégie SI", m: "Métier", y: 400, f: ["proc", "strat", "mis"], coul: C.v, pale: C.vPale, d: "la stratégie SI se traduit en métier : processus, stratégie, mission." }
  ];
  var NOMS = { inf: "Infrastructures", app: "Applications", info: "Informations", proc: "Processus", strat: "Stratégie", mis: "Mission" };
  var ch = -1;
  function dessiner() {
    A.vider(g2);
    A.boite(g2, 10, 210, 170, 80, { titre: "Schéma directeur", taille: 18, fond: C.jeuPale, bord: C.jeu, ep: 3 });
    BR.forEach(function (b, k) {
      var on = ch === k;
      A.fleche(g2, [182, 250], [228, b.y], { ep: 3, coul: on ? b.coul : C.gris });
      A.boite(g2, 232, b.y - 34, 200, 68, { titre: b.t, taille: 17, fond: on ? b.pale : "#fff", bord: on ? b.coul : C.encre, ep: on ? 4 : 2.5 });
      A.fleche(g2, [434, b.y], [476, b.y], { ep: 3, coul: on ? b.coul : C.gris });
      A.boite(g2, 480, b.y - 30, 170, 60, { titre: b.m, taille: 17, fond: on ? b.pale : "#fff", bord: on ? b.coul : C.encre, ep: on ? 4 : 2.5 });
      b.f.forEach(function (k2) { A.fleche(g2, [652, b.y], [716, F[k2][1]], { ep: 2.5, coul: on ? b.coul : C.trait }); });
      A.cible(g2, 232, b.y - 34, 420, 68, function () { ch = k; dessiner(); });
    });
    Object.keys(F).forEach(function (k2) { var on = ch >= 0 && BR[ch].f.indexOf(k2) >= 0; A.boite(g2, 720, F[k2][1] - 24, 200, 48, { titre: NOMS[k2], taille: 16, fond: on ? BR[ch].pale : "#fff", bord: on ? BR[ch].coul : C.encre, rx: 24 }); });
    f2.direct.innerHTML = ch >= 0 ? "<strong>" + BR[ch].t + "</strong> : " + BR[ch].d : "Touche une branche.";
  }
  dessiner();
})();
