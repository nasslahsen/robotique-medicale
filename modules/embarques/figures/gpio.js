(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure 1 : le brochage de la carte ESP32 DEV KIT V1 (diapositive 6) ---------- */
  (function () {
    var f = R.figure("fig-brochage", {
      largeur: 960, hauteur: 600,
      titre: "Brochage de la carte ESP32 DEV KIT V1",
      essai: "<strong>Essaie</strong> : choisis une famille de fonctions avec les boutons. <strong>Observe</strong> : une même broche porte plusieurs fonctions (GPIO 4 est à la fois ADC2_0, HSPI_HD et Touch0) ; seules quatre broches sont des entrées seulement, toutes en haut à gauche.",
      direct: true
    });
    var G = [["EN"], ["36", "Input only", "RTC GPIO0", "SensVP", "ADC1_0"], ["39", "Input only", "RTC GPIO3", "SensVN", "ADC1_3"], ["34", "Input only", "RTC GPIO4", "ADC1_6"], ["35", "Input only", "RTC GPIO5", "ADC1_7"],
      ["32", "RTC GPIO9", "Xtal32P", "Touch9", "ADC1_4"], ["33", "RTC GPIO8", "Xtal32N", "Touch8", "ADC1_5"], ["25", "DAC1", "RTC GPIO6", "ADC2_8"], ["26", "DAC2", "RTC GPIO7", "ADC2_9"],
      ["27", "RTC GPIO17", "Touch7", "ADC2_7"], ["14", "RTC GPIO16", "Touch6", "HSPI_CLK", "ADC2_6"], ["12", "RTC GPIO15", "Touch5", "HSPI_Q", "ADC2_5"], ["13", "RTC GPIO14", "Touch4", "HSPI_ID", "ADC2_4"], ["GND"], ["VIN"]];
    var D = [["23", "V_SPI_D", "MOSI"], ["22", "V_SPI_WP", "SCL", "RTS0"], ["1", "TXD0", "CLK3"], ["3", "RXD0", "CLK2"], ["21", "VSPI_HD", "SDA"], ["19", "V_SPI_Q", "MISO", "CTS0"], ["18", "V_SPI_CLK", "SCK"], ["5", "V_SPI_CS0", "SS"],
      ["17", "TXD2"], ["16", "RXD2"], ["4", "ADC2_0", "HSPI_HD", "Touch0", "RTC GPIO10"], ["2", "ADC2_2", "HSPI_WP0", "Touch2", "RTC GPIO12"], ["15", "ADC2_3", "HSPI_CS0", "Touch3", "RTC GPIO13"], ["GND"], ["3.3V"]];
    var FILTRES = [
      ["Entrées seulement", /^Input only$/], ["ADC1", /^ADC1/], ["ADC2", /^ADC2/], ["DAC", /^DAC/], ["Touch", /^Touch/],
      ["SPI", /SPI|^MOSI$|^MISO$|^SCK$|^SS$/], ["UART", /^TXD|^RXD|^RTS|^CTS/], ["I2C", /^SDA$|^SCL$/], ["RTC GPIO", /^RTC GPIO/]
    ];
    var choix = 0, b = R.boutons(f.reglages), btns = [];
    FILTRES.forEach(function (x, i) { btns.push(R.bouton(b, x[0], function () { choix = i; dessiner(); })); });
    var g = EMB.el("g", null, f.svg);
    function y(i) { return 52 + i * 36; }
    function dessiner() {
      EMB.vider(g);
      btns.forEach(function (x, i) { x.classList.toggle("actif", i === choix); });
      var re = FILTRES[choix][1], liste = [];
      EMB.el("rect", { x: 400, y: 22, width: 160, height: 556, rx: 14, fill: "#2b2f3a" }, g);
      EMB.el("rect", { x: 418, y: 38, width: 124, height: 160, rx: 6, fill: "#c9ced8", stroke: "#8a91a0", "stroke-width": 2 }, g);
      EMB.texte(g, "ESP-WROOM-32", [480, 118], { taille: 13, halo: false });
      EMB.el("rect", { x: 458, y: 530, width: 44, height: 40, rx: 4, fill: "#9aa0ad" }, g);
      [[G, 400, -1], [D, 560, 1]].forEach(function (cote) {
        cote[0].forEach(function (p, i) {
          var yy = y(i), num = /^\d+$/.test(p[0]), fonctions = p.slice(1).filter(function (t) { return re.test(t); }), on = fonctions.length > 0;
          if (on) liste.push("GPIO " + p[0]);
          EMB.el("circle", { cx: cote[1], cy: yy, r: 7, fill: "#d9b44a", stroke: "#2b2f3a", "stroke-width": 2 }, g);
          var bx = cote[2] < 0 ? 300 : 570;
          EMB.el("rect", { x: bx, y: yy - 15, width: 90, height: 30, rx: 7, fill: on ? C.acc : (num ? "#fff" : "#eef0f5"), stroke: on ? C.acc : C.gris, "stroke-width": on ? 2.5 : 1.5 }, g);
          EMB.texte(g, num ? "GPIO" + p[0] : p[0], [bx + 45, yy + 1], { taille: 15, mono: true, coul: on ? "#fff" : C.encre, halo: false });
          var t = on ? fonctions.join(", ") : p.slice(1).join("  ");
          if (t) EMB.texte(g, t, [cote[2] < 0 ? 290 : 670, yy + 1], { taille: on ? 15 : 12, mono: true, coul: on ? C.acc : "#b5bac6", gras: on, ancre: cote[2] < 0 ? "end" : "start", halo: false });
        });
      });
      f.direct.innerHTML = "<p>" + FILTRES[choix][0] + " : " + liste.join(", ") + "." + (choix === 0 ? " Pas de pull-up ni de pull-down internes, jamais en sortie." : choix === 2 ? " Inutilisables quand le Wi-Fi est utilisé." : "") + "</p>";
    }
    dessiner();
  })();

  /* ---------- Figure 2 : IO MUX, RTC IO MUX et GPIO matrix (diapositive 15) ---------- */
  (function () {
    var f = R.figure("fig-routage", {
      largeur: 960, hauteur: 530,
      titre: "IO MUX and GPIO Matrix",
      essai: "<strong>Essaie</strong> : choisis un chemin avec les boutons. <strong>Observe</strong> : les signaux rapides vont directement à l'IO_MUX ; les autres signaux de périphériques passent d'abord par la GPIO matrix ; les pads RTC sont servis par le RTC IO_MUX, à travers un multiplexeur.",
      direct: false
    });
    var CH = [["Signal rapide (Direct I/O)", ["rapide", "iomux", "pads"]], ["Signal par la GPIO matrix", ["perif", "matrice", "iomux", "pads"]], ["Pad RTC", ["rtc", "mux"]], ["Pad RTC piloté par l'IO_MUX", ["iomux", "mux"]]];
    var k = 0, b = R.boutons(f.reglages), btns = [];
    CH.forEach(function (c, i) { btns.push(R.bouton(b, c[0], function () { k = i; dessiner(); })); });
    var g = EMB.el("g", null, f.svg);
    function dessiner() {
      EMB.vider(g);
      btns.forEach(function (x, i) { x.classList.toggle("actif", i === k); });
      var ch = CH[k][1];
      function a(id) { return ch.indexOf(id) >= 0; }
      function lien(p, q, id) { EMB.fleche(g, p, q, { double: true, coul: a(id) ? C.acc : C.encre, ep: a(id) ? 4.5 : 2.5 }); }
      EMB.bloc(g, 20, 30, 230, 100, "JTAG, SDIO, UART, SPI,\nEthernet (fast signal)", { taille: 16, fill: C.fond, actif: a("rapide") });
      EMB.bloc(g, 20, 210, 230, 130, "SPI, UART, I2C, I2S,\nPWM, LEDC and more", { taille: 16, fill: C.fond, actif: a("perif") });
      EMB.bloc(g, 340, 170, 130, 210, "GPIO\nmatrix", { taille: 19, fill: "#eef0f5", actif: a("matrice") });
      EMB.bloc(g, 560, 30, 140, 210, "IO_MUX", { taille: 19, actif: a("iomux") });
      EMB.bloc(g, 810, 70, 120, 120, "Digital\npads", { taille: 18, actif: a("pads") });
      EMB.bloc(g, 330, 430, 130, 70, "RTC GPIO", { taille: 16, fill: "#eef0f5", actif: a("rtc") });
      EMB.bloc(g, 530, 430, 160, 70, "RTC IO_MUX", { taille: 17, actif: a("rtc") });
      EMB.el("polygon", { points: "740,418 770,430 770,492 740,504", fill: a("mux") ? C.clair : "#eef0f5", stroke: a("mux") ? C.acc : C.encre, "stroke-width": a("mux") ? 3.5 : 2 }, g);
      EMB.bloc(g, 810, 420, 120, 90, "RTC\npads", { taille: 18, actif: a("mux") });
      lien([250, 80], [560, 80], "rapide"); EMB.texte(g, "Direct I/O", [405, 62], { taille: 15, coul: C.doux });
      lien([250, 275], [340, 275], "perif"); EMB.texte(g, "162 peripheral input /\n176 output signals", [135, 372], { taille: 13, coul: C.doux, gras: false });
      lien([470, 205], [560, 205], "matrice"); EMB.texte(g, "34 GPIOs", [515, 186], { taille: 14, coul: C.doux });
      lien([700, 130], [810, 130], "pads"); EMB.texte(g, "FUN_SEL / IE /\nOE / WPU / PDU", [755, 230], { taille: 13, coul: C.doux, gras: false });
      EMB.el("polyline", { points: "630,240 630,370 755,370 755,412", fill: "none", stroke: a("iomux") && a("mux") ? C.acc : C.encre, "stroke-width": a("iomux") && a("mux") ? 4.5 : 2.5 }, g);
      lien([460, 465], [530, 465], "rtc"); lien([690, 465], [740, 465], "rtc"); lien([770, 465], [810, 465], "mux");
    }
    dessiner();
  })();
})();
