(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure 1 : la carte, composant par composant ---------- */
  (function () {
    var f = R.figure("fig-carte", {
      largeur: 960, hauteur: 520,
      titre: "Carte ESP32 DEV KIT V1",
      essai: "<strong>Essaie</strong> : touche un composant de la carte, ou « Brancher l'USB ». <strong>Observe</strong> : l'alimentation passe par le régulateur (LED rouge), le programme passe par le CP2102 avant d'atteindre l'ESP32 ; la LED bleue ne s'allume que si le programme le demande."
    });
    var g = EMB.el("g", null, f.svg), choisi = null, branche = false, bleue = false;
    var COMP = {
      usb: { r: [44, 206, 100, 96], nom: "USB INPUT", role: "Prise micro-USB : elle alimente la carte et transporte le programme." },
      en: { r: [178, 104, 62, 62], nom: "RESET/EN", role: "Bouton qui redémarre la puce (broche EN)." },
      boot: { r: [178, 346, 62, 62], nom: "BOOT", role: "Bouton BOOT de la carte." },
      reg: { r: [272, 110, 92, 56], nom: "Voltage Regulator 3.3V", role: "Régulateur : il fournit le 3,3 V à toute la carte." },
      cp: { r: [266, 216, 104, 104], nom: "CP2102 (USB to UART)", role: "Convertisseur : l'ordinateur parle USB, l'ESP32 reçoit par son UART." },
      ledr: { r: [400, 128, 38, 22], nom: "RED LED (Power ON)", role: "LED rouge : la carte est alimentée." },
      ledb: { r: [400, 362, 38, 22], nom: "Blue LED (PIN2)", role: "LED bleue, reliée à GPIO2 : c'est le programme qui l'allume." },
      wroom: { r: [470, 104, 300, 304], nom: "ESP-WROOM-32", role: "Le module qui contient la puce ESP32." },
      ant: { r: [778, 104, 92, 304], nom: "Antenna", role: "Antenne du Wi-Fi et du Bluetooth." }
    };
    var b = R.boutons(f.reglages);
    var bU = R.bouton(b, "Brancher l'USB", function () { branche = !branche; if (!branche) bleue = false; bU.textContent = branche ? "Débrancher l'USB" : "Brancher l'USB"; dessiner(); });
    var bL = R.bouton(b, "Programme : allumer la LED bleue", function () { if (branche) bleue = !bleue; dessiner(); });
    var zone = R.h("p", null, "", f.direct);
    function dessiner() {
      EMB.vider(g);
      EMB.el("rect", { x: 90, y: 74, width: 800, height: 364, rx: 24, fill: "#20242e" }, g);
      for (var k = 0; k < 15; k++) {
        EMB.el("circle", { cx: 160 + k * 50, cy: 90, r: 8, fill: "#c9a227" }, g);
        EMB.el("circle", { cx: 160 + k * 50, cy: 422, r: 8, fill: "#c9a227" }, g);
      }
      var q;
      q = COMP.usb.r; EMB.el("rect", { x: q[0], y: q[1] + 10, width: q[2], height: q[3] - 20, rx: 8, fill: "#c6cbd8", stroke: C.encre, "stroke-width": 2 }, g);
      ["en", "boot"].forEach(function (id) { q = COMP[id].r; EMB.el("rect", { x: q[0], y: q[1], width: q[2], height: q[3], rx: 8, fill: "#e8eaf0" }, g); EMB.el("circle", { cx: q[0] + 31, cy: q[1] + 31, r: 18, fill: "#2b2f3a" }, g); });
      q = COMP.reg.r; EMB.el("rect", { x: q[0], y: q[1], width: q[2], height: q[3], rx: 4, fill: "#3a3f4c", stroke: "#000", "stroke-width": 2 }, g);
      q = COMP.cp.r; EMB.el("rect", { x: q[0], y: q[1], width: q[2], height: q[3], rx: 6, fill: "#3a3f4c", stroke: "#000", "stroke-width": 2 }, g);
      q = COMP.ledr.r; EMB.el("rect", { x: q[0], y: q[1], width: q[2], height: q[3], rx: 4, fill: branche ? "#e5484d" : "#7a4a4c" }, g);
      if (branche) EMB.el("circle", { cx: q[0] + 19, cy: q[1] + 11, r: 26, fill: "rgba(229,72,77,0.3)" }, g);
      q = COMP.ledb.r; EMB.el("rect", { x: q[0], y: q[1], width: q[2], height: q[3], rx: 4, fill: bleue ? "#3b5bdb" : "#4a5578" }, g);
      if (bleue) EMB.el("circle", { cx: q[0] + 19, cy: q[1] + 11, r: 26, fill: "rgba(59,91,219,0.35)" }, g);
      q = COMP.wroom.r; EMB.el("rect", { x: q[0], y: q[1], width: q[2], height: q[3], rx: 10, fill: "#cfd3dc", stroke: "#7c8594", "stroke-width": 2 }, g);
      EMB.texte(g, "ESP-WROOM-32", [620, 256], { taille: 22, halo: false });
      q = COMP.ant.r; EMB.el("rect", { x: q[0], y: q[1], width: q[2], height: q[3], rx: 8, fill: "#2b2f3a" }, g);
      EMB.el("path", { d: "M792 130 h56 v34 h-46 v34 h46 v34 h-46 v34 h46 v34 h-46 v34 h46", fill: "none", stroke: "#c9a227", "stroke-width": 4 }, g);
      if (branche) {
        // chemins : alimentation (USB -> régulateur) et programme (USB -> CP2102 -> ESP32)
        EMB.fleche(g, [144, 230], [272, 140], { coul: "#e5484d", ep: 4 });
        EMB.fleche(g, [144, 268], [266, 268], { coul: C.acc, ep: 4 });
        EMB.fleche(g, [370, 268], [470, 268], { coul: C.acc, ep: 4 });
        EMB.texte(g, "5 V vers 3,3 V", [200, 470], { taille: 16, coul: "#e5484d" });
        EMB.texte(g, "USB puis UART", [420, 470], { taille: 16, coul: C.acc });
      }
      if (choisi) { q = COMP[choisi].r; EMB.el("rect", { x: q[0] - 6, y: q[1] - 6, width: q[2] + 12, height: q[3] + 12, rx: 10, fill: "none", stroke: C.acc, "stroke-width": 5 }, g); EMB.texte(g, COMP[choisi].nom, [480, 36], { taille: 22, coul: C.acc }); }
      zone.innerHTML = choisi ? "<strong>" + COMP[choisi].nom + "</strong> : " + COMP[choisi].role : "Touche un composant de la carte.";
      bL.disabled = !branche;
    }
    EMB.toucher(f.svg, function () { var z = {}; Object.keys(COMP).forEach(function (k) { z[k] = EMB.zoneMin(COMP[k].r, 56); }); return z; }, function (k) { choisi = k; dessiner(); });
    dessiner();
  })();

  /* ---------- Figure 2 : le brochage, filtré par fonction ---------- */
  (function () {
    var f = R.figure("fig-brochage", {
      largeur: 960, hauteur: 640,
      titre: "Brochage de la carte ESP32 DEV KIT V1",
      essai: "<strong>Essaie</strong> : choisis une fonction avec les boutons. <strong>Observe</strong> : les broches qui la portent s'allument ; une même broche apparaît sous plusieurs fonctions (GPIO25 : DAC1 et ADC2_8 ; GPIO4 : ADC2_0, Touch0 et HSPI_HD).",
      direct: false
    });
    var g = EMB.el("g", null, f.svg);
    var GAUCHE = [["EN", ["alim"]], ["GPIO36", ["entree", "adc1"], "ADC1_0"], ["GPIO39", ["entree", "adc1"], "ADC1_3"], ["GPIO34", ["entree", "adc1"], "ADC1_6"], ["GPIO35", ["entree", "adc1"], "ADC1_7"], ["GPIO32", ["adc1", "touch"], "ADC1_4 · Touch9"], ["GPIO33", ["adc1", "touch"], "ADC1_5 · Touch8"], ["GPIO25", ["dac", "adc2"], "DAC1 · ADC2_8"], ["GPIO26", ["dac", "adc2"], "DAC2 · ADC2_9"], ["GPIO27", ["adc2", "touch"], "ADC2_7 · Touch7"], ["GPIO14", ["adc2", "touch", "hspi"], "ADC2_6 · Touch6 · HSPI_CLK"], ["GPIO12", ["adc2", "touch", "hspi"], "ADC2_5 · Touch5 · HSPI_Q"], ["GPIO13", ["adc2", "touch", "hspi"], "ADC2_4 · Touch4 · HSPI_ID"], ["GND", ["alim"]], ["VIN", ["alim"]]];
    var DROITE = [["GPIO23", ["vspi"], "MOSI"], ["GPIO22", ["i2c"], "SCL"], ["GPIO1", ["uart"], "TXD0"], ["GPIO3", ["uart"], "RXD0"], ["GPIO21", ["i2c"], "SDA"], ["GPIO19", ["vspi"], "MISO"], ["GPIO18", ["vspi"], "SCK"], ["GPIO5", ["vspi"], "SS"], ["GPIO17", ["uart"], "TXD2"], ["GPIO16", ["uart"], "RXD2"], ["GPIO4", ["adc2", "touch", "hspi"], "ADC2_0 · Touch0 · HSPI_HD"], ["GPIO2", ["adc2", "touch", "hspi"], "ADC2_2 · Touch2 · HSPI_WP0"], ["GPIO15", ["adc2", "touch", "hspi"], "ADC2_3 · Touch3 · HSPI_CS0"], ["GND", ["alim"]], ["3.3V", ["alim"]]];
    var FILTRES = [["entree", "Entrée seule"], ["adc1", "ADC1"], ["adc2", "ADC2"], ["dac", "DAC"], ["touch", "Touch"], ["uart", "UART"], ["i2c", "I2C"], ["vspi", "VSPI"], ["hspi", "HSPI"], ["alim", "Alimentation"]];
    var filtre = "entree", b = R.boutons(f.reglages), btns = {};
    FILTRES.forEach(function (x) { btns[x[0]] = R.bouton(b, x[1], function () { filtre = x[0]; dessiner(); }); });
    function dessiner() {
      EMB.vider(g);
      Object.keys(btns).forEach(function (k) { btns[k].classList.toggle("actif", k === filtre); });
      EMB.el("rect", { x: 420, y: 16, width: 120, height: 610, rx: 16, fill: "#20242e" }, g);
      EMB.el("rect", { x: 436, y: 32, width: 88, height: 150, rx: 6, fill: "#cfd3dc" }, g);
      EMB.texte(g, "ESP32", [480, 107], { taille: 18, halo: false });
      var nb = 0;
      [[GAUCHE, -1], [DROITE, 1]].forEach(function (cote) {
        cote[0].forEach(function (p, k) {
          var y = 40 + k * 39.5, on = p[1].indexOf(filtre) >= 0, gch = cote[1] < 0;
          if (on) nb++;
          var xb = gch ? 420 : 540, xn = gch ? 330 : 550;
          EMB.el("circle", { cx: xb, cy: y, r: 7, fill: "#c9a227" }, g);
          EMB.el("rect", { x: xn, y: y - 15, width: 80, height: 30, rx: 7, fill: on ? C.acc : "#fff", stroke: on ? C.acc : C.pale, "stroke-width": 1.5 }, g);
          EMB.texte(g, p[0], [xn + 40, y + 1], { taille: 14, mono: true, halo: false, coul: on ? "#fff" : C.doux });
          if (p[2]) EMB.texte(g, p[2], [gch ? xn - 10 : xn + 90, y + 1], { taille: 14, ancre: gch ? "end" : "start", gras: on ? true : false, coul: on ? C.encre : C.gris });
        });
      });
      EMB.texte(g, nb + " broche" + (nb > 1 ? "s" : ""), [120, 620], { taille: 18, coul: C.acc });
    }
    dessiner();
  })();
})();
