(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure : la pile, au démarrage puis pour une requête ---------- */
  var f = R.figure("fig-pile", {
    largeur: 960, hauteur: 560,
    titre: "Architecture générale d'un système embarqué",
    essai: "<strong>Essaie</strong> : choisis « Mise sous tension » puis avance étape par étape ; recommence avec « Une requête ». <strong>Observe</strong> : au démarrage, l'activité monte depuis le Boot ; une demande de l'application descend jusqu'au matériel sans passer par le Boot."
  });
  var g = EMB.el("g", null, f.svg);
  var COUCHES = [
    ["app", "Embedded Application Code", C.encre],
    ["drv", "Device Drivers (API)", C.encre],
    ["rtos", "A Real-Time Operating System (RTOS)\nEmbedded OS", C.encre],
    ["hal", "Hardware abstraction layer(s)", C.ok],
    ["boot", "System initialization routines\n(Boot)", C.ko]
  ];
  var X = 300, W = 470, Y0 = 30, H = 78;
  var SCEN = {
    demarrage: { noms: ["", "mise sous tension", "Boot", "HAL", "RTOS", "pilotes", "application"], suite: ["hw", "boot", "hal", "rtos", "drv", "app"],
      txt: ["Choisis un scénario.", "Le courant arrive : le matériel est sous tension, mais rien n'est configuré.", "Boot : horloges et mémoire sont initialisées.", "La couche d'abstraction prépare l'accès aux périphériques de cette puce.", "Le système d'exploitation temps réel démarre et crée les tâches.", "Les pilotes des périphériques sont prêts : l'API est disponible.", "L'application démarre : la semelle mesure."] },
    requete: { noms: ["", "application", "pilote", "RTOS", "HAL", "matériel", "réponse"], suite: ["app", "drv", "rtos", "hal", "hw", "app"],
      txt: ["Choisis un scénario.", "L'application demande : « lis le capteur 7 ».", "Le pilote traduit la demande en opérations sur le périphérique (API).", "Le RTOS ordonne cette tâche parmi les autres, pour tenir les délais.", "La HAL écrit dans les registres de l'ADC de cette puce.", "Le matériel convertit la tension du capteur.", "La valeur remonte jusqu'à l'application. Le Boot n'a pas servi."] }
  };
  var noms = SCEN.demarrage.noms.slice(), scen = "demarrage", k = 0, zone = R.h("p", null, "", f.direct), b = R.boutons(f.reglages);
  function choisir(s) { scen = s; noms.length = 0; SCEN[s].noms.forEach(function (x) { noms.push(x); }); et.aller(1); }
  var bD = R.bouton(b, "Mise sous tension", function () { choisir("demarrage"); });
  var bR = R.bouton(b, "Une requête", function () { choisir("requete"); });
  var et = R.etapes(f.reglages, 6, noms, function (i) { k = i; dessiner(); });
  function dessiner() {
    EMB.vider(g);
    bD.classList.toggle("actif", scen === "demarrage" && k > 0); bR.classList.toggle("actif", scen === "requete" && k > 0);
    var S = SCEN[scen], actifs = S.suite.slice(0, k), courant = k ? S.suite[k - 1] : null;
    COUCHES.forEach(function (c, i) {
      var y = Y0 + i * H, on = courant === c[0], vu = actifs.indexOf(c[0]) >= 0;
      EMB.el("rect", { x: X, y: y, width: W, height: H, fill: on ? C.clair : vu && scen === "demarrage" ? "#f4f9f1" : "#eef6ea", stroke: on ? C.acc : C.encre, "stroke-width": on ? 4 : 2 }, g);
      EMB.texte(g, c[1], [X + W / 2, y + H / 2], { taille: 19, coul: c[2], halo: false });
      if (vu && scen === "demarrage" && !on) EMB.texte(g, "prêt", [X + W + 16, y + H / 2], { taille: 15, coul: C.ok, ancre: "start", gras: false });
    });
    var yh = Y0 + 5 * H + 8, onH = courant === "hw";
    EMB.el("rect", { x: X - 60, y: yh, width: W + 120, height: 62, rx: 4, fill: onH ? C.acc : "#4f7fc8" }, g);
    EMB.texte(g, "Hardware", [X + W / 2, yh + 31], { taille: 24, coul: "#fff", halo: false });
    EMB.fleche(g, [150, yh + 31], [X - 64, yh + 31], { ep: 9, coul: "#4f7fc8", tete: 24 });
    EMB.texte(g, "Inputs", [170, yh - 18], { taille: 20, coul: C.ko });
    EMB.fleche(g, [X + W + 60, yh + 31], [950, yh + 31], { ep: 9, coul: "#4f7fc8", tete: 24 });
    EMB.texte(g, "Outputs", [900, yh - 18], { taille: 20, coul: C.ko });
    EMB.bloc(g, 20, Y0 + 60, 180, 64, "Software\nPlatform", { taille: 18, fill: "#4f7fc8", stroke: "#4f7fc8", coul: "#fff" });
    EMB.bloc(g, 20, Y0 + 3 * H + 14, 180, 64, "Hardware\nPlatform", { taille: 18, fill: "#4f7fc8", stroke: "#4f7fc8", coul: "#fff" });
    // sens du parcours
    if (k) {
      var montee = scen === "demarrage";
      EMB.fleche(g, [X - 30, montee ? yh - 10 : Y0 + 20], [X - 30, montee ? Y0 + 20 : yh - 10], { ep: 4, coul: C.acc, tirets: "10 7" });
      EMB.texte(g, montee ? "on monte" : "on descend", [X - 40, Y0 + 2.5 * H], { taille: 16, coul: C.acc, ancre: "end", gras: false });
    }
    zone.textContent = S.txt[k];
  }
  et.aller(0);
})();
