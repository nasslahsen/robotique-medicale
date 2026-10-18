/* Niveau : architecture AVR (Section I, diapositives 12 à 15). Schéma bloc, AVR 8 bits et AVR32, familles, tableau des ATmega. */
NIVEAU({
  id: "avr",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { mode: "bloc", choisi: null, bon: null, surTouche: null };
    // schéma bloc de la diapositive 12 : [x, y, w, h, texte]
    var B = {
      cpu: [270, 66, 190, 70, "AVR CPU"],
      sram: [520, 40, 140, 38, "SRAM"], flash: [520, 88, 140, 38, "FLASH"], eeprom: [520, 172, 140, 38, "EEPROM"],
      clock: [20, 92, 180, 118, "Clock generation\n8 MHz Crystal Osc\n1/2/4/8 MHz Calib RC\n12 MHz Ext. RC Osc\n32,768 kHz XOSC\nExt. clock, 1 MHz int"],
      pm: [212, 160, 128, 62, "Power manag.\nand clock\ncontrol"],
      wdt: [212, 238, 128, 46, "Watchdog\nTimer"],
      sup: [20, 232, 180, 66, "Power Supervision\nPOR/BOD & RESET"],
      ref: [212, 298, 128, 44, "Internal\nReference"],
      adc: [212, 356, 128, 46, "ADC"], ac: [212, 414, 128, 46, "AC"], usart: [212, 472, 128, 44, "USART"], twi: [212, 528, 128, 44, "TWI"],
      eepromif: [390, 172, 112, 38, "EEPROMIF"], nvm: [390, 222, 112, 50, "NVM\nprogramming"], parprog: [520, 228, 140, 38, "PARPROG"],
      spi: [390, 288, 112, 48, "SPI"], io: [390, 350, 112, 58, "I/O\nPORTS"], extint: [390, 422, 112, 40, "EXTINT"],
      tc0: [390, 474, 130, 34, "TC 0 (8-bit)"], tc1: [390, 516, 130, 34, "TC 1 (16-bit)"], tc2: [390, 558, 130, 34, "TC 2 (8-bit async)"]
    };
    var PINS = {
      adc: ["ADC[7:0], AREF", "g"], ac: ["AIN0, AIN1, ADCMUX", "g"], usart: ["RxD, TxD, XCK", "g"], twi: ["SDA, SCL", "g"],
      spi: ["MISO, MOSI,\nSCK, SS", "d"], io: ["PB[7:0], PC[6:0],\nPD[7:0]", "d"], extint: ["INT[1:0]", "d"], tc0: ["T0", "d"], tc1: ["OC1A/B, T1, ICP1", "d"], tc2: ["OC2", "d"]
    };
    var FAM = [
      { id: "tiny", nom: "tinyAVR", flash: [1, 16], br: [8, 32], x: 30, y: 480, c: "#4a90d9" },
      { id: "mega", nom: "megaAVR", flash: [4, 256], br: [28, 100], x: 170, y: 380, c: "#4a90d9" },
      { id: "xmega", nom: "AVR XMEGA", flash: [16, 384], br: [44, 100], x: 230, y: 250, c: "#b08455" },
      { id: "uc3", nom: "AVR32 UC3", flash: [16, 512], br: [48, 144], x: 390, y: 380, c: "#4caf63" },
      { id: "ap7", nom: "AVR32 AP7", flash: null, sram: 32, br: [196, 256], x: 470, y: 480, c: "#4caf63" }
    ];
    var COLS = [["Product", 108], ["Flash\n(KB)", 46], ["EEPROM\n(Bytes)", 52], ["RAM\n(Bytes)", 48], ["pico-\nPower", 46], ["I/O\npins", 40], ["UART/\nUSART", 48], ["TWI", 38], ["8-bit\nTimers", 40], ["16-bit\nTimers", 44], ["PWM", 46], ["A/D\n10 bits", 42], ["Vcc", 72]];
    var TAB = [
      ["ATmega6450", "64", "2K", "4K", "", "69", "1", "USI", "2", "1", "4", "8", "1.8-5.5V"],
      ["ATmega1284P", "128", "4K", "16K", "Y", "32", "2", "Y", "1", "2", "6", "8", "1.8-5.5V"],
      ["ATmega128", "128", "4K", "4K", "", "53", "2", "Y", "2", "2", "6+2", "8", "2.7-5.5V"],
      ["ATmega1280", "128", "4K", "8K", "", "86", "4", "Y", "2", "4", "12+4", "16", "1.8-5.5V"],
      ["ATmega1281", "128", "4K", "8K", "", "54", "2", "Y", "2", "4", "6+4", "8", "1.8-5.5V"],
      ["ATmega2560", "256", "4K", "8K", "", "86", "4", "Y", "2", "4", "12+4", "16", "1.8-5.5V"],
      ["ATmega2561", "256", "4K", "8K", "", "54", "2", "Y", "2", "4", "6+4", "8", "1.8-5.5V"]
    ];
    n.TAB = TAB;
    function rangee(i) { return [8, 150 + i * 56, 664, 50]; }
    n.zones = function () {
      var z = {};
      if (n.mode === "bloc") Object.keys(B).forEach(function (k) { z[k] = EMB.zoneMin(B[k].slice(0, 4), 40); });
      else if (n.mode === "familles") FAM.forEach(function (f) { z[f.id] = [f.x + 30, f.y - 130, 170, 96]; });
      else if (n.mode === "table") TAB.forEach(function (r, i) { z[r[0]] = rangee(i); });
      return z;
    };
    n.dessin = function () {
      EMB.vider(g);
      if (n.mode === "bloc") {
        EMB.el("line", { x1: 365, y1: 140, x2: 365, y2: 596, stroke: C.encre, "stroke-width": 3 }, g);
        EMB.el("rect", { x: 356, y: 140, width: 18, height: 456, fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g);
        EMB.texte(g, "D\nA\nT\nA\nB\nU\nS", [365, 300], { taille: 12, halo: false });
        [["sram", 52], ["flash", 107]].forEach(function (s) { EMB.fleche(g, [460, s[1] + 6], [520, s[1] + 6], { ep: 2, double: true }); });
        EMB.fleche(g, [374, 191], [390, 191], { ep: 2, double: true }); EMB.fleche(g, [502, 191], [520, 191], { ep: 2 });
        ["nvm", "spi", "io", "extint", "tc0", "tc1", "tc2"].forEach(function (k) { var b = B[k]; EMB.fleche(g, [374, b[1] + b[3] / 2], [390, b[1] + b[3] / 2], { ep: 2, double: true }); });
        ["pm", "wdt", "ref", "adc", "ac", "usart", "twi"].forEach(function (k) { var b = B[k]; EMB.fleche(g, [340, b[1] + b[3] / 2], [356, b[1] + b[3] / 2], { ep: 2, double: true }); });
        Object.keys(B).forEach(function (k) {
          var b = B[k], on = n.choisi === k, ok = on && k === n.bon;
          var fill = k === "clock" ? "#6b6f78" : (k === "sup" || k === "ref" || k === "adc" || k === "ac") ? "#a8d58a" : (k === "sram" || k === "flash" || k === "eeprom" || k === "parprog" || k === "cpu") ? "#3f7fbf" : "#9fd3ef";
          var blanc = k === "clock" || fill === "#3f7fbf";
          EMB.el("rect", { x: b[0], y: b[1], width: b[2], height: b[3], rx: 6, fill: on ? (ok ? C.ok : C.ko) : fill, stroke: C.encre, "stroke-width": on ? 3.5 : 1.5 }, g);
          EMB.texte(g, b[4], [b[0] + b[2] / 2, b[1] + b[3] / 2], { taille: k === "cpu" ? 20 : k === "clock" ? 11.5 : 13, coul: blanc || on ? "#fff" : C.encre, halo: false });
        });
        Object.keys(PINS).forEach(function (k) {
          var b = B[k], p = PINS[k];
          if (p[1] === "g") EMB.texte(g, p[0], [b[0] - 8, b[1] + b[3] / 2], { taille: 12.5, ancre: "end", gras: false, mono: true });
          else EMB.texte(g, p[0], [b[0] + b[2] + 10, b[1] + b[3] / 2], { taille: 12.5, ancre: "start", gras: false, mono: true });
        });
        EMB.texte(g, "VCC, RESET, GND", [110, 318], { taille: 12.5, gras: false, mono: true });
      } else if (n.mode === "familles") {
        EMB.fleche(g, [40, 580], [660, 580], { ep: 3, coul: C.gris });
        EMB.fleche(g, [40, 580], [40, 90], { ep: 3, coul: C.gris });
        EMB.texte(g, "MORE PERFORMANCE", [560, 560], { taille: 13, coul: C.doux });
        EMB.texte(g, "LESS POWER", [92, 106], { taille: 13, coul: C.doux, ancre: "start" });
        FAM.forEach(function (f) {
          var on = n.choisi === f.id, ok = on && f.id === n.bon;
          EMB.el("rect", { x: f.x + 30, y: f.y - 130, width: 170, height: 96, rx: 12, fill: on ? (ok ? "#e3f7ee" : "#fdecec") : "#fff", stroke: on ? (ok ? C.ok : C.ko) : f.c, "stroke-width": on ? 4 : 3 }, g);
          EMB.texte(g, f.nom, [f.x + 115, f.y - 106], { taille: 18, coul: f.c });
          EMB.texte(g, (f.flash ? "Flash " + f.flash[0] + "-" + f.flash[1] + " KB" : "SRAM jusqu'à " + f.sram + " KB") + "\n" + f.br[0] + "-" + f.br[1] + " broches", [f.x + 115, f.y - 70], { taille: 14, gras: false });
        });
        [["8-bit", "#4a90d9"], ["8/16-bit", "#b08455"], ["32-bit", "#4caf63"]].forEach(function (l, i) { EMB.el("rect", { x: 560, y: 28 + i * 30, width: 22, height: 20, rx: 4, fill: l[1] }, g); EMB.texte(g, l[0], [590, 38 + i * 30], { taille: 14, ancre: "start", gras: false }); });
      } else {
        var x = 8;
        COLS.forEach(function (c, k) {
          EMB.el("rect", { x: x, y: 86, width: c[1], height: 56, fill: "#2f78c4" }, g);
          EMB.texte(g, c[0], [x + c[1] / 2, 114], { taille: 11, coul: "#fff", halo: false });
          TAB.forEach(function (r, i) {
            var y = rangee(i)[1], on = n.choisi === r[0], ok = on && r[0] === n.bon;
            EMB.el("rect", { x: x, y: y, width: c[1], height: 50, fill: on ? (ok ? "#d6f2e4" : "#fbdcdc") : i % 2 ? "#fdf1dc" : "#fff", stroke: "#d9dde6", "stroke-width": 1 }, g);
            EMB.texte(g, r[k], [x + c[1] / 2, y + 26], { taille: k === 0 ? 12.5 : 13, gras: k === 0, halo: false, mono: k > 0 });
          });
          x += c[1];
        });
        TAB.forEach(function (r, i) { if (n.choisi === r[0]) { var z = rangee(i); EMB.el("rect", { x: z[0], y: z[1], width: z[2], height: z[3], fill: "none", stroke: r[0] === n.bon ? C.ok : C.ko, "stroke-width": 3.5 }, g); } });
        EMB.texte(g, "Vcc : première version de chaque puce (le tableau du cours en donne deux).", [340, 556], { taille: 13, coul: C.doux, gras: false });
      }
    };
    EMB.toucher(fig.svg, n.zones, function (k) { if (n.surTouche) n.surTouche(k); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Le convertisseur", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Un thermomètre médical fournit une tension analogique. Sur ce microcontrôleur AVR, touche le bloc qui la convertit en nombre.");
      var fini = false;
      n.surTouche = function (k) {
        if (fini) return;
        n.choisi = k; n.bon = "adc"; n.dessin();
        if (k !== "adc") { j.erreur(k === "ac" ? "AC est un comparateur analogique : il dit seulement laquelle de deux tensions est la plus grande." : "Cherche le bloc dont les broches s'appellent ADC[7:0], à gauche."); return; }
        fini = true; n.surTouche = null;
        j.bravo("L'ADC, avec ses entrées ADC[7:0] et sa référence AREF.", [276, 379]);
        j.expliquer("<p><b>AVR</b> : <i>Advanced Virtual RISC Architecture</i>, d'Atmel, aujourd'hui Microchip. Autour de l'AVR CPU et du DATABUS : mémoires (SRAM, FLASH, EEPROM), horloges, gestion de l'alimentation, Watchdog Timer, ADC, comparateur AC, USART, TWI, SPI, ports d'E/S, interruptions externes et trois timers.</p>");
        j.suite();
      };
      j.reponse(function () { if (n.surTouche) n.surTouche("adc"); });
    } },
    { nom: "L'EEPROM I2C", jouer: function (j, n) {
      n.choisi = null; n.dessin();
      j.titre("Une EEPROM série I2C se branche sur deux fils, SDA et SCL. Touche le bloc de l'AVR qui la pilote.");
      var fini = false;
      n.surTouche = function (k) {
        if (fini) return;
        n.choisi = k; n.bon = "twi"; n.dessin();
        if (k !== "twi") { j.erreur(k === "eeprom" ? "Ça, c'est l'EEPROM interne de la puce. L'EEPROM externe passe par un bus : cherche SDA, SCL." : "Lis les noms des broches à côté des blocs : où sont SDA et SCL ?"); return; }
        fini = true; n.surTouche = null;
        j.bravo("Le TWI : c'est le nom de l'I2C chez Atmel.", [276, 550]);
        j.suite();
      };
      j.reponse(function () { if (n.surTouche) n.surTouche("twi"); });
    } },
    { nom: "8 bits ou 32 bits", jouer: function (j, n) {
      n.choisi = null; n.dessin();
      j.titre("Un tensiomètre à piles, vendu bon marché, doit mesurer, afficher et garder 30 mesures. AVR 8 bits ou AVR32 ?");
      j.choix([
        { html: "AVR 8 bits", juste: true },
        { html: "AVR32", aide: "L'AVR32 vise les applications plus exigeantes : Ethernet, USB, réseau, multimédia. Ici, il faut d'abord peu consommer et coûter peu." }
      ], { colonnes: 2, ok: function () {
        j.bravo("Faible consommation et faible coût : l'AVR 8 bits.");
        j.expliquer("<p><b>AVR 8 bits</b> : idéal pour les applications à faible consommation et faible coût ; RISC simple avec <b>32 registres généraux</b> ; flash, EEPROM et SRAM intégrées ; USART, SPI, I2C, ADC, PWM ; utilisé dans Arduino. <b>AVR32</b> : cœur RISC 32 bits à exécution dans le désordre, flash et SRAM plus grandes, mémoire externe et cache, Ethernet, USB, PWM ; pour l'industriel, le réseau, le multimédia ; sécurité, timers avancés, temps réel.</p>");
        j.suite();
      } });
    } },
    { nom: "La famille", jouer: function (j, n) {
      n.mode = "familles"; n.choisi = null; n.dessin();
      j.titre("Le programme d'un moniteur occupe 450 KB de flash. Touche la seule famille qui peut le contenir.");
      var fini = false, AIDE = { tiny: "tinyAVR : 16 KB au plus.", mega: "megaAVR : 256 KB au plus.", xmega: "AVR XMEGA : 384 KB au plus, c'est trop peu.", ap7: "La diapositive donne pour l'AP7 une SRAM sur puce, pas une flash de 450 KB. Cherche une flash qui monte au-delà de 450." };
      n.surTouche = function (k) {
        if (fini) return;
        n.choisi = k; n.bon = "uc3"; n.dessin();
        if (k !== "uc3") { j.erreur(AIDE[k]); return; }
        fini = true; n.surTouche = null;
        j.bravo("AVR32 UC3 : de 16 à 512 KB de flash.");
        j.expliquer("<p>tinyAVR : 1–16 KB de flash, 8–32 broches. megaAVR : 4–256 KB, 28–100 broches. AVR XMEGA : 16–384 KB, 44–100 broches. AVR32 UC3 : 16–512 KB, 48–144 broches. AVR32 AP7 : jusqu'à 32 KB de SRAM sur puce, 196–256 broches. <i>Atmel offers both 8-bit and 32-bit AVR's : highest performance with no power penalty.</i></p>");
        j.suite();
      };
      j.reponse(function () { if (n.surTouche) n.surTouche("uc3"); });
    } },
    { nom: "Choisir la puce", jouer: function (j, n) {
      n.mode = "table"; n.choisi = null; n.dessin();
      j.titre("Un holter à 12 électrodes : il faut au moins 12 canaux A/D 10 bits, et le plus de flash possible. Touche la ligne de la puce.");
      var fini = false;
      n.surTouche = function (k) {
        if (fini) return;
        n.choisi = k; n.bon = "ATmega2560"; n.dessin();
        if (k === "ATmega2560") {
          fini = true; n.surTouche = null;
          j.bravo("ATmega2560 : 16 canaux A/D et 256 KB de flash.");
          j.expliquer("<p>Lis colonne par colonne : d'abord filtrer (A/D ≥ 12 : ATmega1280 et ATmega2560), puis comparer (Flash 128 contre 256 KB).</p>");
          j.suite(); return;
        }
        var r = n.TAB.filter(function (x) { return x[0] === k; })[0];
        j.erreur(+r[11] < 12 ? k + " n'a que " + r[11] + " canaux A/D : regarde l'avant-dernière colonne." : k + " a bien 16 canaux, mais seulement " + r[1] + " KB de flash.");
      };
      j.reponse(function () { if (n.surTouche) n.surTouche("ATmega2560"); });
    } },
    { nom: "picoPower", jouer: function (j, n) {
      n.choisi = null; n.dessin();
      j.titre("Une semelle sur accumulateur : il faut la technologie basse consommation picoPower et la plus grande RAM. Touche la puce.");
      var fini = false;
      n.surTouche = function (k) {
        if (fini) return;
        n.choisi = k; n.bon = "ATmega1284P"; n.dessin();
        if (k !== "ATmega1284P") { j.erreur("Regarde la colonne picoPower : une seule puce a un Y."); return; }
        fini = true; n.surTouche = null;
        j.bravo("ATmega1284P : picoPower et 16K de RAM.");
        j.suite();
      };
      j.reponse(function () { if (n.surTouche) n.surTouche("ATmega1284P"); });
    } }
  ]
});
