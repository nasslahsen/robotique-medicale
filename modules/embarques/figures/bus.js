(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure 1 : le schéma du cours, bus par bus ---------- */
  (function () {
    var f = R.figure("fig-reseau", {
      largeur: 960, hauteur: 520,
      titre: "Problème de communication",
      essai: "<strong>Essaie</strong> : touche BUS 1, BUS 2 puis BUS 3. <strong>Observe</strong> : chaque bus est partagé ; le BUS 1 relie les deux microcontrôleurs et la mémoire, le BUS 2 distribue vers les périphériques, chaque BUS 3 descend vers un seul d'entre eux."
    });
    var g = EMB.el("g", null, f.svg), choix = 0, b = R.boutons(f.reglages), btns = [];
    ["BUS 1", "BUS 2", "BUS 3"].forEach(function (t, i) { btns.push(R.bouton(b, t, function () { choix = i + 1; dessiner(); })); });
    var zone = R.h("p", null, "", f.direct);
    var TXT = ["Touche un bus.", "BUS 1 : MCU1, MCU2 et la mémoire (RAM, EEPROM) échangent des données.", "BUS 2 : le bus qui distribue vers tous les périphériques (ADC, capteurs, actionneurs, afficheur).", "BUS 3 : la liaison qui descend du BUS 2 vers chaque périphérique."];
    function dessiner() {
      EMB.vider(g);
      btns.forEach(function (x, i) { x.classList.toggle("actif", choix === i + 1); });
      var c = function (k) { return choix === k ? C.acc : choix ? "#c5d2e6" : C.bleu; };
      EMB.bus(g, [280, 160], [680, 160], { coul: c(1), larg: 32 });
      EMB.bus(g, [480, 98], [480, 318], { coul: c(1), larg: 32 });
      EMB.bus(g, [30, 330], [930, 330], { coul: c(2), larg: 12 });
      [125, 360, 600, 835].forEach(function (x) { EMB.bus(g, [x, 342], [x, 418], { coul: c(3), larg: 14 }); });
      var B = { fill: "#eef5ea", coul: "#a3271f", taille: 19 };
      EMB.bloc(g, 375, 20, 210, 78, "Memory\n(RAM, EEPROM,…)", B);
      EMB.bloc(g, 30, 120, 240, 84, "Microcontrôleur\nMCU1", B);
      EMB.bloc(g, 690, 120, 240, 84, "Microcontrôleur\nMCU2", B);
      [["ADC", 30], ["Sensors", 265], ["Actuators", 505], ["Display\n(LCD, OLED,…)", 740]].forEach(function (d) { EMB.bloc(g, d[1], 420, 190, 80, d[0], B); });
      EMB.texte(g, "BUS 1", [610, 112], { taille: 19, coul: "#a3271f" });
      EMB.texte(g, "BUS 2", [800, 300], { taille: 19, coul: "#a3271f" });
      EMB.texte(g, "BUS 3", [900, 385], { taille: 19, coul: "#a3271f" });
      zone.textContent = TXT[choix];
    }
    dessiner();
  })();

  /* ---------- Figure 2 : les fils de chaque bus ---------- */
  (function () {
    var f = R.figure("fig-fils", {
      largeur: 960, hauteur: 460,
      titre: "Les fils de chaque bus",
      essai: "<strong>Essaie</strong> : passe d'UART à SPI puis à I2C. <strong>Observe</strong> : le SPI partage trois fils et ajoute une ligne de sélection par esclave ; l'I2C partage seulement deux fils, tirés à 1 par des résistances, et choisit l'esclave par son adresse."
    });
    var g = EMB.el("g", null, f.svg), choix = "SPI", b = R.boutons(f.reglages), btns = {};
    ["UART", "SPI", "I2C"].forEach(function (t) { btns[t] = R.bouton(b, t, function () { choix = t; dessiner(); }); });
    var zone = R.h("p", null, "", f.direct);
    function fil(x1, y1, x2, y2, coul, nom, fleche) {
      if (fleche) EMB.fleche(g, [x1, y1], [x2, y2], { coul: coul, ep: 3 });
      else EMB.el("line", { x1: x1, y1: y1, x2: x2, y2: y2, stroke: coul, "stroke-width": 3 }, g);
      if (nom) EMB.texte(g, nom, [x1 + 70, y1 - 14], { taille: 16, coul: coul });
    }
    function dessiner() {
      EMB.vider(g);
      Object.keys(btns).forEach(function (k) { btns[k].classList.toggle("actif", k === choix); });
      EMB.bloc(g, 40, 120, 200, 220, "MCU", { taille: 26, actif: true });
      var Y = [60, 190, 320], nb = 0;
      if (choix === "UART") {
        EMB.bloc(g, 700, 170, 220, 120, "Appareil\n(PC, module…)", { taille: 19 });
        fil(240, 200, 700, 200, C.acc, "TX → RX", true); fil(700, 260, 240, 260, C.v, "", true);
        EMB.texte(g, "RX ← TX", [310, 284], { taille: 16, coul: C.v });
        nb = 2;
        zone.innerHTML = "UART : 2 fils de données (plus la masse), pas d'horloge. Une liaison relie deux appareils.";
      } else {
        Y.forEach(function (y, k) { EMB.bloc(g, 740, y, 180, 90, (choix === "SPI" ? "Esclave " : "Circuit ") + (k + 1), { taille: 19 }); });
        var lignes = choix === "SPI" ? [["SCK", C.encre], ["MOSI", C.acc], ["MISO", C.v]] : [["SDA", C.acc], ["SCL", C.encre]];
        lignes.forEach(function (l, i) {
          var x = 380 + i * 50;
          fil(240, 150 + i * 30, x, 150 + i * 30, l[1], "");
          EMB.texte(g, l[0], [300, 138 + i * 30], { taille: 15, coul: l[1] });
          EMB.el("line", { x1: x, y1: 70, x2: x, y2: 410, stroke: l[1], "stroke-width": 3 }, g);
          Y.forEach(function (y) { EMB.el("line", { x1: x, y1: y + 20 + i * 18, x2: 740, y2: y + 20 + i * 18, stroke: l[1], "stroke-width": 2 }, g); EMB.el("circle", { cx: x, cy: y + 20 + i * 18, r: 4, fill: l[1] }, g); });
        });
        nb = lignes.length;
        if (choix === "SPI") {
          Y.forEach(function (y, k) {
            var yy = 250 + k * 30;
            EMB.el("polyline", { points: [[240, yy], [600 + k * 40, yy], [600 + k * 40, y + 76], [740, y + 76]].join(" "), fill: "none", stroke: C.ko, "stroke-width": 2.2, "stroke-dasharray": "6 4" }, g);
          });
          EMB.texte(g, "SS1, SS2, SS3", [300, 236], { taille: 15, coul: C.ko });
          nb += 3;
          zone.innerHTML = "SPI : 3 fils partagés (SCK, MOSI, MISO) + 3 lignes de sélection, soit " + nb + " fils pour 3 esclaves.";
        } else {
          EMB.el("line", { x1: 560, y1: 30, x2: 640, y2: 30, stroke: C.encre, "stroke-width": 2.5 }, g);
          EMB.texte(g, "+VDD", [600, 14], { taille: 14 });
          [380, 430].forEach(function (x, i) { EMB.el("polyline", { points: [[580 + i * 40, 30], [580 + i * 40, 50]].join(" "), stroke: C.encre, "stroke-width": 2.5 }, g); EMB.el("rect", { x: 572 + i * 40, y: 50, width: 16, height: 30, fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g); EMB.el("polyline", { points: [[580 + i * 40, 80], [580 + i * 40, 96], [x, 96]].join(" "), fill: "none", stroke: C.encre, "stroke-width": 2 }, g); });
          EMB.texte(g, "RP", [660, 66], { taille: 15 });
          zone.innerHTML = "I2C : 2 fils partagés par tous (SDA, SCL), tirés à 1 par les résistances RP. Chaque circuit a une adresse.";
        }
      }
      EMB.texte(g, nb + " fils", [140, 400], { taille: 24, coul: C.acc });
    }
    dessiner();
  })();
})();
