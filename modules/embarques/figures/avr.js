(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure 1 : le schéma bloc de l'AVR, bloc par bloc ---------- */
  (function () {
    var f = R.figure("fig-avr", {
      largeur: 680, hauteur: 610,
      titre: "Schéma bloc d'un microcontrôleur AVR",
      essai: "<strong>Essaie</strong> : touche un bloc. <strong>Observe</strong> : tout est relié au DATABUS vertical ; les mémoires sont à droite du CPU, les horloges et l'alimentation à gauche, les périphériques de part et d'autre avec le nom de leurs broches."
    });
    var g = EMB.el("g", null, f.svg), choisi = null, zone = R.h("p", null, "Touche un bloc pour lire son rôle.", f.direct);
    var B = {
      cpu: [270, 66, 190, 70, "AVR CPU", "le cœur RISC qui exécute le programme (32 registres généraux sur les AVR 8 bits)"],
      sram: [520, 40, 140, 38, "SRAM", "mémoire vive : les variables, perdues à la coupure"],
      flash: [520, 88, 140, 38, "FLASH", "mémoire non volatile du programme"],
      eeprom: [520, 172, 140, 38, "EEPROM", "mémoire non volatile pour des données à garder hors tension (réglages, étalonnage)"],
      clock: [20, 92, 180, 118, "Clock generation\n8 MHz Crystal Osc\n1/2/4/8 MHz Calib RC\n12 MHz Ext. RC Osc\n32,768 kHz XOSC\nExt. clock, 1 MHz int", "les sources d'horloge : quartz 8 MHz, RC calibré 1/2/4/8 MHz, RC externe 12 MHz, quartz 32,768 kHz, horloge externe, oscillateur interne 1 MHz"],
      pm: [212, 160, 128, 62, "Power manag.\nand clock\ncontrol", "gestion de l'alimentation et des horloges"],
      wdt: [212, 238, 128, 46, "Watchdog\nTimer", "chien de garde : relance la puce si le programme ne se manifeste plus"],
      sup: [20, 232, 180, 66, "Power Supervision\nPOR/BOD & RESET", "surveillance de l'alimentation : remise à zéro à la mise sous tension (POR) et en cas de baisse de tension (BOD), broche RESET"],
      ref: [212, 298, 128, 44, "Internal\nReference", "tension de référence interne"],
      adc: [212, 356, 128, 46, "ADC", "convertisseur analogique-numérique, entrées ADC[7:0], référence AREF"],
      ac: [212, 414, 128, 46, "AC", "comparateur analogique : entrées AIN0, AIN1, ADCMUX"],
      usart: [212, 472, 128, 44, "USART", "liaison série : RxD (réception), TxD (émission), XCK (horloge)"],
      twi: [212, 528, 128, 44, "TWI", "Two-Wire Interface, l'I2C d'Atmel : SDA, SCL"],
      eepromif: [390, 172, 112, 38, "EEPROMIF", "interface entre le bus et l'EEPROM"],
      nvm: [390, 222, 112, 50, "NVM\nprogramming", "programmation de la mémoire non volatile (programmation série)"],
      parprog: [520, 228, 140, 38, "PARPROG", "programmation parallèle"],
      spi: [390, 288, 112, 48, "SPI", "bus SPI : MISO, MOSI, SCK, SS"],
      io: [390, 350, 112, 58, "I/O\nPORTS", "ports d'entrées-sorties PB[7:0], PC[6:0], PD[7:0]"],
      extint: [390, 422, 112, 40, "EXTINT", "interruptions externes INT[1:0]"],
      tc0: [390, 474, 130, 34, "TC 0 (8-bit)", "timer/compteur 8 bits, entrée T0"],
      tc1: [390, 516, 130, 34, "TC 1 (16-bit)", "timer/compteur 16 bits : OC1A/B, T1, ICP1"],
      tc2: [390, 558, 130, 34, "TC 2 (8-bit async)", "timer/compteur 8 bits asynchrone : OC2"]
    };
    var PINS = { adc: ["ADC[7:0], AREF", "g"], ac: ["AIN0, AIN1, ADCMUX", "g"], usart: ["RxD, TxD, XCK", "g"], twi: ["SDA, SCL", "g"], spi: ["MISO, MOSI,\nSCK, SS", "d"], io: ["PB[7:0], PC[6:0],\nPD[7:0]", "d"], extint: ["INT[1:0]", "d"], tc0: ["T0", "d"], tc1: ["OC1A/B, T1, ICP1", "d"], tc2: ["OC2", "d"] };
    function dessiner() {
      EMB.vider(g);
      EMB.el("rect", { x: 356, y: 140, width: 18, height: 460, fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g);
      EMB.texte(g, "D\nA\nT\nA\nB\nU\nS", [365, 300], { taille: 12, halo: false });
      [52, 107].forEach(function (y) { EMB.fleche(g, [460, y + 6], [520, y + 6], { ep: 2, double: true }); });
      EMB.fleche(g, [374, 191], [390, 191], { ep: 2, double: true }); EMB.fleche(g, [502, 191], [520, 191], { ep: 2 });
      ["nvm", "spi", "io", "extint", "tc0", "tc1", "tc2"].forEach(function (k) { var b = B[k]; EMB.fleche(g, [374, b[1] + b[3] / 2], [390, b[1] + b[3] / 2], { ep: 2, double: true }); });
      ["pm", "wdt", "ref", "adc", "ac", "usart", "twi"].forEach(function (k) { var b = B[k]; EMB.fleche(g, [340, b[1] + b[3] / 2], [356, b[1] + b[3] / 2], { ep: 2, double: true }); });
      Object.keys(B).forEach(function (k) {
        var b = B[k], on = choisi === k;
        var fill = k === "clock" ? "#6b6f78" : /^(sup|ref|adc|ac)$/.test(k) ? "#a8d58a" : /^(sram|flash|eeprom|parprog|cpu)$/.test(k) ? "#3f7fbf" : "#9fd3ef";
        var blanc = k === "clock" || fill === "#3f7fbf";
        EMB.el("rect", { x: b[0], y: b[1], width: b[2], height: b[3], rx: 6, fill: on ? C.acc : fill, stroke: C.encre, "stroke-width": on ? 3.5 : 1.5 }, g);
        EMB.texte(g, b[4], [b[0] + b[2] / 2, b[1] + b[3] / 2], { taille: k === "cpu" ? 20 : k === "clock" ? 11.5 : 13, coul: blanc || on ? "#fff" : C.encre, halo: false });
      });
      Object.keys(PINS).forEach(function (k) {
        var b = B[k], p = PINS[k];
        if (p[1] === "g") EMB.texte(g, p[0], [b[0] - 8, b[1] + b[3] / 2], { taille: 12.5, ancre: "end", gras: false, mono: true });
        else EMB.texte(g, p[0], [b[0] + b[2] + 10, b[1] + b[3] / 2], { taille: 12.5, ancre: "start", gras: false, mono: true });
      });
      EMB.texte(g, "VCC, RESET, GND", [110, 318], { taille: 12.5, gras: false, mono: true });
    }
    EMB.toucher(f.svg, function () { var z = {}; Object.keys(B).forEach(function (k) { z[k] = B[k].slice(0, 4); }); return z; }, function (k) {
      choisi = k; zone.textContent = B[k][4].split("\n")[0] + " : " + B[k][5] + "."; dessiner();
    });
    dessiner();
  })();

  /* ---------- Figure 2 : les familles et la flash nécessaire ---------- */
  (function () {
    var f = R.figure("fig-familles", {
      largeur: 960, hauteur: 440,
      titre: "Familles AVR d'Atmel",
      essai: "<strong>Essaie</strong> : règle la taille de flash dont ton programme a besoin. <strong>Observe</strong> : les familles qui peuvent la contenir restent en couleur ; au-delà de 384 KB, seule l'AVR32 UC3 convient. L'AP7 est donnée en SRAM sur puce, pas en flash.",
      direct: false
    });
    var g = EMB.el("g", null, f.svg);
    var FAM = [
      ["tinyAVR", [1, 16], "8-32 broches", 70, 290, "#4a90d9"], ["megaAVR", [4, 256], "28-100 broches", 250, 210, "#4a90d9"],
      ["AVR XMEGA", [16, 384], "44-100 broches", 330, 70, "#b08455"], ["AVR32 UC3", [16, 512], "48-144 broches", 520, 210, "#4caf63"],
      ["AVR32 AP7", null, "196-256 broches", 700, 290, "#4caf63"]
    ];
    var c = R.curseur(f.reglages, { nom: "Flash nécessaire (KB)", min: 1, max: 512, pas: 1, val: 100, surChange: dessiner });
    function dessiner() {
      EMB.vider(g);
      EMB.fleche(g, [40, 420], [940, 420], { ep: 3, coul: C.gris }); EMB.fleche(g, [40, 420], [40, 20], { ep: 3, coul: C.gris });
      EMB.texte(g, "MORE PERFORMANCE", [840, 400], { taille: 14, coul: C.doux });
      EMB.texte(g, "LESS POWER", [60, 34], { taille: 14, coul: C.doux, ancre: "start" });
      FAM.forEach(function (fm) {
        var ok = fm[1] && c.v >= fm[1][0] && c.v <= fm[1][1];
        EMB.el("rect", { x: fm[3], y: fm[4], width: 200, height: 96, rx: 12, fill: ok ? fm[5] : "#fff", stroke: fm[5], "stroke-width": 3, opacity: fm[1] ? 1 : 0.7 }, g);
        EMB.texte(g, fm[0], [fm[3] + 100, fm[4] + 26], { taille: 19, coul: ok ? "#fff" : fm[5], halo: false });
        EMB.texte(g, (fm[1] ? "Flash " + fm[1][0] + "-" + fm[1][1] + " KB" : "SRAM jusqu'à 32 KB") + "\n" + fm[2], [fm[3] + 100, fm[4] + 64], { taille: 15, gras: false, coul: ok ? "#fff" : C.encre, halo: false });
      });
      [["8-bit", "#4a90d9"], ["8/16-bit", "#b08455"], ["32-bit", "#4caf63"]].forEach(function (l, i) { EMB.el("rect", { x: 800, y: 30 + i * 32, width: 24, height: 22, rx: 4, fill: l[1] }, g); EMB.texte(g, l[0], [834, 41 + i * 32], { taille: 15, ancre: "start", gras: false }); });
    }
    dessiner();
  })();

  /* ---------- Figure 3 : choisir une puce dans le tableau Microchip ---------- */
  (function () {
    var f = R.figure("fig-choix", {
      largeur: 960, hauteur: 470,
      titre: "Choisir un ATmega",
      essai: "<strong>Essaie</strong> : règle le minimum de canaux A/D, d'UART et de flash, et coche picoPower si l'appareil vit sur accumulateur. <strong>Observe</strong> : les lignes qui restent vertes conviennent ; il reste à comparer ce qui compte le plus (flash, RAM, broches)."
    });
    var g = EMB.el("g", null, f.svg);
    var COLS = [["Product", 170], ["Flash (KB)", 90], ["RAM (Bytes)", 100], ["picoPower", 100], ["I/O pins", 80], ["UART", 80], ["8/16-bit Timers", 130], ["PWM", 80], ["10-bit A/D", 90]];
    var TAB = [
      ["ATmega6450", 64, "4K", "", 69, 1, "2 / 1", "4", 8], ["ATmega1284P", 128, "16K", "Y", 32, 2, "1 / 2", "6", 8], ["ATmega128", 128, "4K", "", 53, 2, "2 / 2", "6+2", 8],
      ["ATmega1280", 128, "8K", "", 86, 4, "2 / 4", "12+4", 16], ["ATmega1281", 128, "8K", "", 54, 2, "2 / 4", "6+4", 8], ["ATmega2560", 256, "8K", "", 86, 4, "2 / 4", "12+4", 16], ["ATmega2561", 256, "8K", "", 54, 2, "2 / 4", "6+4", 8]
    ];
    var ca = R.curseur(f.reglages, { nom: "A/D au moins", min: 0, max: 16, pas: 1, val: 0, surChange: dessiner });
    var cu = R.curseur(f.reglages, { nom: "UART au moins", min: 1, max: 4, pas: 1, val: 1, surChange: dessiner });
    var cf = R.curseur(f.reglages, { nom: "Flash au moins (KB)", min: 0, max: 256, pas: 32, val: 0, surChange: dessiner });
    var bp = R.bascule(R.boutons(f.reglages), "picoPower obligatoire", false, dessiner);
    var zone = R.h("p", null, "", f.direct);
    function dessiner() {
      EMB.vider(g);
      var x = 0, bons = [];
      TAB.forEach(function (r) { if (r[8] >= ca.v && r[5] >= cu.v && r[1] >= cf.v && (!bp.checked || r[3] === "Y")) bons.push(r[0]); });
      COLS.forEach(function (c, k) {
        EMB.el("rect", { x: x, y: 10, width: c[1], height: 46, fill: "#2f78c4" }, g);
        EMB.texte(g, c[0], [x + c[1] / 2, 33], { taille: 15, coul: "#fff", halo: false });
        TAB.forEach(function (r, i) {
          var y = 60 + i * 56, ok = bons.indexOf(r[0]) >= 0;
          EMB.el("rect", { x: x, y: y, width: c[1], height: 52, fill: ok ? "#d6f2e4" : "#f3f4f7", stroke: "#fff", "stroke-width": 2 }, g);
          EMB.texte(g, String(r[k]), [x + c[1] / 2, y + 27], { taille: 17, gras: k === 0, halo: false, mono: k > 0, coul: ok ? C.encre : C.gris });
        });
        x += c[1];
      });
      zone.textContent = bons.length ? "Puces qui conviennent : " + bons.join(", ") + "." : "Aucune puce du tableau ne convient : relâche une exigence.";
    }
    dessiner();
  })();
})();
