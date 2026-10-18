(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure 1 : le schéma en blocs, bloc par bloc ---------- */
  (function () {
    var f = R.figure("fig-blocs", {
      largeur: 960, hauteur: 600,
      titre: "Architecture de l'ESP32 en blocs",
      essai: "<strong>Essaie</strong> : touche un bloc ou un périphérique. <strong>Observe</strong> : chaque bloc a une seule mission ; pour un appareil sur batterie, le RTC et son coprocesseur ULP restent éveillés quand le reste dort."
    });
    var g = EMB.el("g", null, f.svg), choisi = "core", zones = {};
    var PERIPH = [["SPI", "Bus série synchrone (chapitre 3). 4 SPI sur l'ESP32."], ["I2C", "Bus série à deux fils (chapitre 3). 2 interfaces I2C."], ["I2S", "Interface série pour le son numérique. 2 interfaces I2S."], ["SDIO", "Interface de carte mémoire et de mémoire externe."], ["UART", "Liaison série asynchrone (chapitre 3). 3 UART."], ["CAN", "CAN bus 2.0."], ["ETH", "Ethernet MAC avec DMA dédié et IEEE 1588."], ["IR", "Télécommande infrarouge, TX/RX, jusqu'à 8 canaux."], ["PWM", "Motor PWM et LED PWM (jusqu'à 16 canaux)."], ["Temperature\nSensor", "Capteur de température intégré."], ["Touch Sensor", "10 GPIO à détection capacitive."], ["DAC", "2 DAC 8 bits : du nombre vers la tension."], ["ADC", "ADC SAR 12 bits, jusqu'à 18 canaux : de la tension vers le nombre."]];
    var GR = {
      bt: [[230, 70, 330, 120], "", "#c9c8ea", [[240, 80, 150, 100, "Bluetooth\nlink\nController"], [400, 80, 150, 100, "Bluetooth\nbaseband"]], "Bluetooth : link controller et baseband. Bluetooth v4.2 BR/EDR et BLE."],
      wifi: [[230, 200, 330, 110], "", "#cfe3c4", [[240, 210, 150, 90, "WiFi MAC"], [400, 210, 150, 90, "WiFi\nbaseband"]], "Wi-Fi : MAC et baseband. 802.11 b/g/n à 2,4 GHz, jusqu'à 150 Mbps."],
      rf: [[575, 70, 365, 240], "", "#4a4e57", [[590, 82, 190, 62, "RF receiver"], [590, 158, 190, 62, "Clock\ngenerator"], [590, 234, 190, 62, "RF\ntransmitter"]], "Radio : réception, émission, génération d'horloge, switch et balun vers l'antenne."],
      core: [[230, 325, 330, 160], "Core and memory", "#b9bcc4", [[245, 360, 300, 56, "2 x Xtensa® 32bit LX6\nMicroprocessors"], [245, 424, 140, 50, "ROM"], [405, 424, 140, 50, "SRAM"]], "Cœur et mémoire : deux microprocesseurs Xtensa LX6 32 bits (160 ou 240 MHz, jusqu'à 600 DMIPS), 448 KB de ROM, 520 KiB de SRAM."],
      crypto: [[575, 325, 365, 160], "Cryptographic hardware acceleration", "#d98e93", [[600, 365, 150, 46, "SHA"], [770, 365, 150, 46, "RSA"], [600, 421, 150, 46, "AES"], [770, 421, 150, 46, "RNG"]], "Accélération cryptographique matérielle : SHA, RSA, AES et générateur de nombres aléatoires (RNG)."],
      rtc: [[230, 498, 710, 92], "RTC", "#d9c3b0", [[250, 524, 200, 56, "PMU"], [480, 524, 220, 56, "ULP\ncoprocessor"], [730, 524, 190, 56, "Recovery\nmemory"]], "RTC : gestion de l'énergie (PMU), coprocesseur ultra basse consommation (ULP), mémoire de reprise ; 16 KB de SRAM dans le RTC."]
    };
    var zone = R.h("p", null, "", f.direct);
    function dessiner() {
      EMB.vider(g); zones = {};
      EMB.el("rect", { x: 10, y: 60, width: 940, height: 536, rx: 14, fill: "#fff", stroke: C.gris, "stroke-width": 2 }, g);
      PERIPH.forEach(function (p, k) {
        var id = "p" + k, y = 70 + k * 40, on = choisi === id;
        EMB.bloc(g, 20, y, 196, 36, p[0].replace("\n", " "), { taille: 15, fill: on ? C.clair : "#e4f1f6", stroke: on ? C.acc : "#7c8594", ep: on ? 3.5 : 1.5, rx: 6 });
        zones[id] = [20, y, 196, 38];
      });
      Object.keys(GR).forEach(function (id) {
        var d = GR[id], r = d[0], on = choisi === id;
        EMB.el("rect", { x: r[0], y: r[1], width: r[2], height: r[3], rx: 10, fill: on ? C.clair : d[2], stroke: on ? C.acc : "#7c8594", "stroke-width": on ? 4 : 1.5 }, g);
        if (d[1]) EMB.texte(g, d[1], [r[0] + r[2] / 2, r[1] + 18], { taille: 16, halo: false });
        d[3].forEach(function (c) { EMB.bloc(g, c[0], c[1], c[2], c[3], c[4], { taille: 15, fill: "#fff", ep: 1.5, rx: 6 }); });
        zones[id] = r;
      });
      EMB.el("rect", { x: 795, y: 82, width: 60, height: 214, rx: 6, fill: "#fff", stroke: "#7c8594" }, g);
      EMB.el("rect", { x: 868, y: 82, width: 60, height: 214, rx: 6, fill: "#fff", stroke: "#7c8594" }, g);
      EMB.texte(g, "Switch", [825, 189], { taille: 15, halo: false }).setAttribute("transform", "rotate(90 825 189)");
      EMB.texte(g, "Balun", [898, 189], { taille: 15, halo: false }).setAttribute("transform", "rotate(90 898 189)");
      var nom = choisi.charAt(0) === "p" ? PERIPH[+choisi.slice(1)] : null;
      EMB.texte(g, nom ? nom[0].replace("\n", " ") : { bt: "Bluetooth", wifi: "Wi-Fi", rf: "Radio", core: "Core and memory", crypto: "Cryptographie", rtc: "RTC" }[choisi], [480, 30], { taille: 22, coul: C.acc });
      zone.innerHTML = nom ? nom[1] : GR[choisi][4];
    }
    EMB.toucher(f.svg, function () { return zones; }, function (k) { choisi = k; dessiner(); });
    dessiner();
  })();

  /* ---------- Figure 2 : quel quartz pour quelle horloge ---------- */
  (function () {
    var f = R.figure("fig-horloges", {
      largeur: 960, hauteur: 340,
      titre: "Sources d'horloge de l'ESP32",
      essai: "<strong>Essaie</strong> : règle la fréquence du quartz externe, puis active le Wi-Fi ou le Bluetooth. <strong>Observe</strong> : sans radio, toute valeur de 2 à 60 MHz convient ; avec la radio, seul 40 MHz est accepté. Le RTC a sa propre horloge à 32 kHz."
    });
    var g = EMB.el("g", null, f.svg);
    var cf = R.curseur(f.reglages, { nom: "Quartz externe", min: 1, max: 64, pas: 1, val: 26, unite: " MHz", surChange: dessiner });
    var radio = R.bascule(f.reglages, "Wi-Fi ou Bluetooth actif", false, dessiner);
    var zone = R.h("p", null, "", f.direct);
    function dessiner() {
      EMB.vider(g);
      var v = cf.v, plage = v >= 2 && v <= 60, ok = plage && (!radio.checked || v === 40);
      EMB.el("rect", { x: 40, y: 60, width: 220, height: 96, rx: 44, fill: "#e8eaf0", stroke: ok ? C.ok : C.ko, "stroke-width": 4 }, g);
      EMB.texte(g, "quartz " + v + " MHz", [150, 108], { taille: 20, halo: false });
      EMB.fleche(g, [260, 108], [380, 108], { ep: 3, coul: ok ? C.ok : C.ko });
      EMB.bloc(g, 380, 60, 220, 96, "Horloge principale\nCPU, radio", { taille: 18, actif: ok });
      EMB.bloc(g, 660, 60, 260, 96, radio.checked ? "Wi-Fi / Bluetooth\nactifs" : "radio éteinte", { taille: 18, actif: radio.checked });
      EMB.bloc(g, 40, 200, 220, 80, "oscillateur interne\n8 MHz", { taille: 17, fill: C.fond });
      EMB.bloc(g, 290, 200, 260, 80, "oscillateur RC interne\navec calibration", { taille: 17, fill: C.fond });
      EMB.bloc(g, 580, 200, 340, 80, "quartz 32 kHz : horloge du RTC\navec calibration", { taille: 17, fill: C.fond });
      zone.innerHTML = !plage ? "Hors de la plage du quartz externe : 2 MHz à 60 MHz." : radio.checked && v !== 40 ? "Dans la plage, mais le Wi-Fi et le Bluetooth demandent exactement 40 MHz." : "Fréquence acceptée.";
    }
    dessiner();
  })();
})();
