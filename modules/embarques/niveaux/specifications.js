/* Niveau : architecture en blocs et spécifications de l'ESP32 (Section III, diapositives 7, 8 et 9). */
NIVEAU({
  id: "specifications",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { actif: {}, faux: null, trouve: {}, surTouche: null, zones: {} };
    var PERIPH = ["SPI", "I2C", "I2S", "SDIO", "UART", "CAN", "ETH", "IR", "PWM", "Temperature\nSensor", "Touch Sensor", "DAC", "ADC"];
    n.dessin = function () {
      EMB.vider(g); n.zones = {};
      EMB.el("rect", { x: 20, y: 70, width: 640, height: 516, rx: 14, fill: "#fff", stroke: C.gris, "stroke-width": 2 }, g);
      function etat(id) { return n.faux === id ? { stroke: C.ko, ep: 4 } : n.trouve[id] || n.actif[id] ? { stroke: C.acc, ep: 4, fill: C.clair } : {}; }
      PERIPH.forEach(function (p, k) {
        var id = "p" + k, y = 80 + k * 38, e = etat(id);
        EMB.bloc(g, 30, y, 122, 34, p, { taille: p.indexOf("\n") > 0 ? 11 : 15, fill: e.fill || "#e4f1f6", stroke: e.stroke || "#7c8594", ep: e.ep || 1.5, rx: 6 });
        n.zones[id] = [30, y, 122, 34];
      });
      function groupe(id, r, titre, fond, contenu) {
        var e = etat(id);
        EMB.el("rect", { x: r[0], y: r[1], width: r[2], height: r[3], rx: 10, fill: e.fill || fond, stroke: e.stroke || "#7c8594", "stroke-width": e.ep || 1.5 }, g);
        if (titre) EMB.texte(g, titre, [r[0] + r[2] / 2, r[1] + 20], { taille: 15, halo: false });
        contenu.forEach(function (c) { EMB.bloc(g, c[0], c[1], c[2], c[3], c[4], { taille: c[5] || 13, fill: "#fff", ep: 1.5, rx: 6 }); });
        n.zones[id] = r;
      }
      groupe("bt", [164, 80, 262, 96], "", "#c9c8ea", [[170, 88, 122, 80, "Bluetooth\nlink\nController", 13], [298, 88, 122, 80, "Bluetooth\nbaseband", 13]]);
      groupe("wifi", [164, 184, 262, 92], "", "#cfe3c4", [[170, 192, 122, 76, "WiFi MAC", 14], [298, 192, 122, 76, "WiFi\nbaseband", 14]]);
      groupe("rf", [436, 80, 216, 196], "", "#4a4e57", [[446, 90, 118, 48, "RF receiver"], [446, 154, 118, 48, "Clock\ngenerator"], [446, 218, 118, 48, "RF\ntransmitter"], [574, 90, 32, 176, "", 12], [614, 90, 32, 176, "", 12]]);
      EMB.texte(g, "Switch", [590, 178], { taille: 14, halo: false }).setAttribute("transform", "rotate(90 590 178)");
      EMB.texte(g, "Balun", [630, 178], { taille: 14, halo: false }).setAttribute("transform", "rotate(90 630 178)");
      groupe("core", [164, 288, 262, 156], "Core and memory", "#b9bcc4", [[176, 318, 238, 56, "2 x Xtensa® 32bit LX6\nMicroprocessors", 14], [176, 384, 112, 48, "ROM", 15], [302, 384, 112, 48, "SRAM", 15]]);
      groupe("crypto", [436, 288, 216, 156], "Cryptographic hardware\nacceleration", "#d98e93", [[452, 336, 86, 40, "SHA", 15], [550, 336, 86, 40, "RSA", 15], [452, 388, 86, 40, "AES", 15], [550, 388, 86, 40, "RNG", 15]]);
      groupe("rtc", [164, 456, 488, 122], "RTC", "#d9c3b0", [[178, 494, 130, 64, "PMU", 15], [326, 494, 150, 64, "ULP\ncoprocessor", 15], [494, 494, 144, 64, "Recovery\nmemory", 15]]);
    };
    EMB.toucher(fig.svg, function () { return n.surTouche ? n.zones : {}; }, function (k) { if (n.surTouche) n.surTouche(k); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Les blocs", jouer: function (j, n) {
      j.fig.astuce("Touche un bloc de la puce.");
      j.titre("Un glucomètre connecté à ESP32. Quel bloc de la puce s'en charge ?");
      var NOMS = { bt: "le Bluetooth", wifi: "le Wi-Fi (MAC et baseband)", rf: "la radio (RF, horloge, switch, balun)", core: "les processeurs et la mémoire", crypto: "l'accélération cryptographique", rtc: "le RTC (PMU, coprocesseur ULP, mémoire de reprise)", p12: "l'ADC", p11: "le DAC" };
      var Q = [["crypto", "Chiffrer la glycémie avec AES avant de l'envoyer."], ["core", "Exécuter le programme principal."], ["rtc", "Surveiller le capteur en veille, avec un coprocesseur qui consomme très peu."], ["p12", "Convertir la tension de la bandelette en nombre."], ["wifi", "Gérer le protocole Wi-Fi (couche MAC)."]], k = 0;
      var cons = j.consigne("");
      function poser() { cons.innerHTML = (k + 1) + " / " + Q.length + " : " + Q[k][1]; }
      poser();
      n.surTouche = function (id) {
        if (k >= Q.length) return;
        if (id === Q[k][0]) {
          n.trouve[id] = true; n.faux = null; n.dessin(); k++;
          if (k < Q.length) { j.info("Oui. Suivant."); poser(); return; }
          n.surTouche = null; cons.innerHTML = "";
          j.bravo("Chaque besoin a son bloc.");
          j.expliquer("<p>La puce réunit des périphériques (SPI, I2C, I2S, SDIO, UART, CAN, ETH, IR, PWM, capteurs de température et tactile, DAC, ADC), le Bluetooth et le Wi-Fi, la radio, le cœur et sa mémoire (2 × Xtensa LX6, ROM, SRAM), l'accélération cryptographique (SHA, RSA, AES, RNG) et le RTC (PMU, coprocesseur ULP, mémoire de reprise).</p>");
          j.suite();
        } else {
          n.faux = id; n.dessin(); setTimeout(function () { n.faux = null; n.dessin(); }, 800);
          j.erreur("Ce bloc, c'est " + (NOMS[id] || "un autre périphérique") + ".");
        }
      };
      j.reponse(function () { for (var s = 0; s < 8 && n.surTouche; s++) n.surTouche(Q[k][0]); });
    } },
    { nom: "DMIPS", jouer: function (j, n) {
      n.trouve = {}; n.actif = { core: true }; n.dessin(); j.fig.astuce("");
      j.titre("Le CPU tourne à 240 MHz et fait jusqu'à 600 DMIPS. Combien de DMIPS par MHz ?");
      j.nombre({ avant: "\\dfrac{600}{240} =", apres: "\\text{ DMIPS/MHz}", cases: [{ attendu: 2.5, tol: 0.001 }], ligne: true,
        aide: function () { return "Divise les DMIPS par la fréquence en MHz."; },
        ok: function () {
          j.bravo("2,5 DMIPS par MHz.");
          j.expliquer("<p>CPU : Xtensa <i>dual-core</i> (ou <i>single-core</i>) 32 bits LX6, à 160 ou 240 MHz, jusqu'à 600 DMIPS (millions d'instructions par seconde, mesurées par le test Dhrystone). Il est épaulé par un coprocesseur ultra basse consommation (ULP).</p>");
          j.suite();
        } });
    } },
    { nom: "Mémoires", jouer: function (j, n) {
      j.titre("Range chaque taille de mémoire.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:10px 14px;align-items:center;font-size:18px"><span>SRAM</span><span class="trou" data-attendu="a"></span><span>ROM</span><span class="trou" data-attendu="b"></span><span>SRAM dans le RTC</span><span class="trou" data-attendu="c"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "c", html: "16 KB" }, { id: "x", html: "4 MB" }, { id: "a", html: "520 KiB" }, { id: "b", html: "448 KB" }],
        aide: "La SRAM principale est la plus grande des trois ; celle du RTC est la plus petite. Les 4 MB, c'est la flash de certains boîtiers.",
        ok: function () {
          n.actif = { core: true, rtc: true }; n.dessin();
          j.bravo("520 KiB de SRAM, 448 KB de ROM, 16 KB de SRAM dans le RTC.");
          j.suite();
        }
      });
    } },
    { nom: "Le bon quartz", jouer: function (j, n) {
      n.actif = { rf: true }; n.dessin();
      j.titre("Ton thermomètre envoie ses mesures en Wi-Fi. Quel quartz externe faut-il ?");
      j.choix([
        { html: "32 kHz", aide: "Le quartz 32 kHz sert au RTC." },
        { html: "8 MHz", aide: "8 MHz, c'est l'oscillateur interne." },
        { html: "40 MHz", juste: true },
        { html: "n'importe quelle valeur entre 2 et 60 MHz", aide: "C'est vrai sans radio. Le Wi-Fi et le Bluetooth imposent une seule valeur." }
      ], { colonnes: 2, ok: function () {
        j.bravo("40 MHz : la seule valeur pour le Wi-Fi et le Bluetooth.");
        j.expliquer("<p>Horloges : oscillateur interne 8 MHz, oscillateur RC interne calibré, quartz externe de 2 à 60 MHz (40 MHz seulement pour le Wi-Fi et le Bluetooth), quartz externe 32 kHz pour le RTC. Wi-Fi 802.11 b/g/n à 2,4 GHz jusqu'à 150 Mbps, Bluetooth v4.2 BR/EDR et BLE.</p>");
        j.suite();
      } });
    } },
    { nom: "Les timers", jouer: function (j, n) {
      n.actif = {}; n.dessin();
      j.titre("Deux groupes de timers, chacun avec 2 timers 64 bits et 1 watchdog principal. Combien en tout ?");
      j.nombre({ avant: "\\text{timers 64 bits, watchdogs principaux :}", cases: [{ attendu: 4, tol: 0 }, { attendu: 2, tol: 0 }], ligne: true,
        aide: function (k) { return k === 0 ? "2 groupes × 2 timers." : "2 groupes × 1 watchdog."; },
        ok: function () {
          j.bravo("4 timers 64 bits et 2 watchdogs principaux, plus un timer RTC et un watchdog RTC.");
          j.suite();
        } });
    } },
    { nom: "Assez de bus ?", jouer: function (j, n) {
      j.titre("Un moniteur de chevet utilise 3 liaisons UART et 2 capteurs I2C sur deux bus séparés. L'ESP32 suffit-il ?");
      j.choix([
        { html: "Oui : il a 3 UART et 2 I2C", juste: true },
        { html: "Non : il n'a que 2 UART", aide: "Relis la liste : 4 × SPI, 2 × I2S, 2 × I2C, 3 × UART." },
        { html: "Non : il n'a qu'un I2C", aide: "Relis la liste : il y a 2 interfaces I2C." }
      ], { colonnes: 1, ok: function () {
        n.actif = { p1: true, p4: true }; n.dessin();
        j.bravo("Juste assez.");
        j.expliquer("<p>Interfaces : 34 GPIO programmables, ADC SAR 12 bits jusqu'à 18 canaux, 2 DAC 8 bits, 10 capteurs tactiles, 4 SPI, 2 I2S, 2 I2C, 3 UART, Ethernet MAC avec DMA et IEEE 1588, CAN bus 2.0, télécommande infrarouge (jusqu'à 8 canaux), Motor PWM, LED PWM (jusqu'à 16 canaux), capteur à effet Hall.</p>");
        j.suite();
      } });
    } }
  ]
});
