/* Niveau : broches GPIO, entrées seulement, IO MUX, RTC IO MUX et GPIO matrix (Section III, diapositives 6, 14 et 15). */
NIVEAU({
  id: "gpio",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    // brochage de la carte ESP32 DEV KIT V1 (diapo 6), de haut en bas
    var GAUCHE = [["EN", ""], ["36", "ADC1_0"], ["39", "ADC1_3"], ["34", "ADC1_6"], ["35", "ADC1_7"], ["32", "ADC1_4"], ["33", "ADC1_5"], ["25", "DAC1"], ["26", "DAC2"], ["27", "ADC2_7"], ["14", "HSPI_CLK"], ["12", "HSPI_Q"], ["13", "HSPI_ID"], ["GND", ""], ["VIN", ""]];
    var DROITE = [["23", "MOSI"], ["22", "SCL"], ["1", "TXD0"], ["3", "RXD0"], ["21", "SDA"], ["19", "MISO"], ["18", "SCK"], ["5", "SS"], ["17", "TXD2"], ["16", "RXD2"], ["4", "ADC2_0"], ["2", "ADC2_2"], ["15", "ADC2_3"], ["GND", ""], ["3.3V", ""]];
    var n = { mode: "carte", marques: {}, surTouche: null, chemin: null };
    function y(i) { return 68 + i * 34.5; }
    n.zones = function () {
      var z = {};
      GAUCHE.forEach(function (p, i) { if (/^\d+$/.test(p[0])) z[p[0]] = [70, y(i) - 17, 190, 34]; });
      DROITE.forEach(function (p, i) { if (/^\d+$/.test(p[0])) z[p[0]] = [420, y(i) - 17, 190, 34]; });
      return z;
    };
    n.dessin = function () {
      EMB.vider(g);
      if (n.mode === "carte") {
        EMB.el("rect", { x: 262, y: 22, width: 156, height: 556, rx: 14, fill: "#2b2f3a" }, g);
        EMB.el("rect", { x: 280, y: 40, width: 120, height: 150, rx: 6, fill: "#c9ced8", stroke: "#8a91a0", "stroke-width": 2 }, g);
        EMB.texte(g, "ESP-WROOM-32", [340, 115], { taille: 12, coul: C.encre, halo: false });
        EMB.el("rect", { x: 318, y: 530, width: 44, height: 40, rx: 4, fill: "#9aa0ad" }, g);
        [[GAUCHE, 70, 262, "end"], [DROITE, 420, 418, "start"]].forEach(function (cote) {
          cote[0].forEach(function (p, i) {
            var yy = y(i), x0 = cote[1], m = n.marques[p[0]], num = /^\d+$/.test(p[0]);
            EMB.el("circle", { cx: cote[2], cy: yy, r: 7, fill: "#d9b44a", stroke: "#2b2f3a", "stroke-width": 2 }, g);
            var bx = cote[3] === "end" ? 180 : 420;
            EMB.el("rect", { x: bx, y: yy - 14, width: 80, height: 28, rx: 6, fill: m ? m : (num ? "#f3e8fb" : "#eef0f5"), stroke: m ? m : (num ? "#b88ad6" : C.gris), "stroke-width": m ? 3 : 1.5 }, g);
            EMB.texte(g, num ? "GPIO" + p[0] : p[0], [bx + 40, yy + 1], { taille: 15, mono: true, coul: m ? "#fff" : C.encre, halo: false });
            if (p[1]) EMB.texte(g, p[1], [cote[3] === "end" ? 172 : 508, yy + 1], { taille: 14, mono: true, coul: C.doux, gras: false, ancre: cote[3] });
          });
        });
      } else {
        // routage (diapo 15)
        var ch = n.chemin;
        function a(id) { return ch && ch.indexOf(id) >= 0; }
        EMB.bloc(g, 20, 40, 170, 90, "JTAG, SDIO,\nUART, SPI,\nEthernet", { taille: 15, fill: C.fond, actif: a("rapide") });
        EMB.bloc(g, 20, 230, 170, 120, "SPI, UART,\nI2C, I2S,\nPWM, LEDC\net plus", { taille: 15, fill: C.fond, actif: a("perif") });
        EMB.bloc(g, 250, 190, 100, 200, "GPIO\nmatrix", { taille: 17, fill: "#eef0f5", actif: a("matrice") });
        EMB.bloc(g, 400, 40, 110, 200, "IO_MUX", { taille: 17, actif: a("iomux") });
        EMB.bloc(g, 560, 80, 100, 110, "Digital\npads", { taille: 16, actif: a("pads") });
        EMB.bloc(g, 250, 470, 100, 80, "RTC\nGPIO", { taille: 16, fill: "#eef0f5", actif: a("rtc") });
        EMB.bloc(g, 380, 470, 120, 80, "RTC IO_MUX", { taille: 15, actif: a("rtc") });
        EMB.el("polygon", { points: "525,455 550,470 550,550 525,565", fill: "#eef0f5", stroke: C.encre, "stroke-width": 2 }, g);
        EMB.el("polyline", { points: "455,240 455,430 537,430 537,452", fill: "none", stroke: C.encre, "stroke-width": 2.5 }, g);
        EMB.bloc(g, 575, 455, 90, 110, "RTC\npads", { taille: 16, actif: a("rtc") });
        EMB.fleche(g, [190, 85], [400, 85], { double: true, coul: a("rapide") ? C.acc : C.encre, ep: a("rapide") ? 4 : 2.5 });
        EMB.texte(g, "Direct I/O", [295, 68], { taille: 14, coul: C.doux });
        EMB.fleche(g, [190, 290], [250, 290], { double: true, coul: a("perif") ? C.acc : C.encre, ep: a("perif") ? 4 : 2.5 });
        EMB.texte(g, "162 entrées / 176 sorties", [135, 380], { taille: 13, coul: C.doux, gras: false });
        EMB.fleche(g, [350, 215], [400, 215], { double: true, coul: a("matrice") ? C.acc : C.encre, ep: a("matrice") ? 4 : 2.5 });
        EMB.texte(g, "34\nGPIOs", [375, 250], { taille: 12, coul: C.doux });
        EMB.fleche(g, [510, 135], [560, 135], { double: true, coul: a("pads") ? C.acc : C.encre, ep: a("pads") ? 4 : 2.5 });
        EMB.texte(g, "FUN_SEL, IE, OE,\nWPU, PDU", [535, 290], { taille: 13, coul: C.doux, gras: false });
        EMB.fleche(g, [350, 510], [380, 510], { double: true, coul: a("rtc") ? C.acc : C.encre });
        EMB.fleche(g, [500, 510], [525, 510], { double: true, coul: a("rtc") ? C.acc : C.encre });
        EMB.fleche(g, [550, 510], [575, 510], { double: true, coul: a("rtc") ? C.acc : C.encre });
      }
    };
    EMB.toucher(fig.svg, function () { return n.mode === "carte" && n.surTouche ? n.zones() : {}; }, function (k) { if (n.surTouche) n.surTouche(k); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Combien ?", jouer: function (j, n) {
      j.fig.astuce("Brochage de la carte DEV KIT V1.");
      j.titre("Combien de broches GPIO physiques la puce ESP32 possède-t-elle ?");
      j.choix([{ html: "16", aide: "16, c'est le nombre de canaux PWM. Les GPIO sont bien plus nombreuses." }, { html: "34", juste: true }, { html: "48", aide: "Trop : la puce en a un peu plus de trente." }], { ok: function () {
        j.bravo("34 GPIO physiques.");
        j.expliquer("<p>Chaque broche peut servir d'<b>entrée/sortie d'usage général</b> (GPIO, <i>general-purpose I/O</i>) ou être reliée à un signal interne d'un périphérique (UART, SPI, PWM…). La carte n'en sort qu'une partie sur ses connecteurs.</p>");
        j.suite();
      } });
    } },
    { nom: "Entrées seulement", jouer: function (j, n) {
      j.fig.astuce("Touche une broche de la carte.");
      j.titre("Quatre broches ne peuvent être que des entrées. Touche-les toutes les quatre.");
      var C = EMB.C, restent = ["34", "35", "36", "39"], fini = false;
      n.surTouche = function (k) {
        if (fini) return;
        if (restent.indexOf(k) >= 0) {
          n.marques[k] = C.ok; restent = restent.filter(function (x) { return x !== k; }); n.dessin();
          if (restent.length) { j.info("Oui. Encore " + restent.length + "."); return; }
          fini = true; n.surTouche = null;
          j.bravo("GPIO 34, 35, 36 et 39 : entrées seulement.");
          j.expliquer("<p>Les GPIO 34 à 39 sont des <b>GPI</b>, des broches d'entrée seulement (<i>input only</i>). Elles n'ont pas de résistance de tirage interne (ni pull-up, ni pull-down) et ne peuvent pas servir de sorties. Sur la puce, ce sont GPIO 34, 35, 36 et 39.</p>");
          j.suite();
        } else if (!n.marques[k]) {
          n.marques[k] = C.ko; n.dessin();
          setTimeout(function () { if (n.marques[k] === C.ko) { delete n.marques[k]; n.dessin(); } }, 800);
          j.erreur("GPIO" + k + " peut être une sortie. Cherche en haut à gauche, sous EN.");
        }
      };
      j.reponse(function () { ["34", "35", "36", "39"].forEach(function (k) { if (n.surTouche) n.surTouche(k); }); });
    } },
    { nom: "Le bouton", jouer: function (j, n) {
      j.titre("Tu branches un bouton entre GPIO 35 et la masse, sans résistance. Bouton relâché, la lecture saute au hasard entre 0 et 1. Pourquoi ?");
      j.choix([
        { html: "GPIO 35 n'a pas de pull-up interne : relâchée, l'entrée flotte", juste: true },
        { html: "GPIO 35 est une sortie", aide: "C'est l'inverse : GPIO 35 est une entrée seulement." },
        { html: "GPIO 35 est réservée au Wi-Fi", aide: "Rien à voir avec le Wi-Fi. Regarde ce qui manque aux broches 34 à 39." }
      ], { colonnes: 1, ok: function () {
        j.bravo("Pas de tirage interne : il faut une résistance externe.");
        j.expliquer("<p>Sur une autre broche, on activerait la résistance de tirage interne. Sur GPIO 34 à 39, il faut une résistance de pull-up externe vers 3,3 V.</p>");
        j.suite();
      } });
    } },
    { nom: "Qui route quoi", jouer: function (j, n) {
      n.mode = "routage"; n.chemin = null; n.dessin();
      j.fig.astuce("");
      j.titre("Le cours nomme trois aiguillages. Place chacun sur son rôle.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:1fr auto;gap:10px 12px;align-items:center;font-size:17px">' +
        '<span>Mélange librement les 162 entrées et 176 sorties des périphériques</span><span class="trou" data-attendu="m"></span>' +
        '<span>Relie directement les signaux rapides aux pads numériques</span><span class="trou" data-attendu="i"></span>' +
        '<span>Gère les pads RTC</span><span class="trou" data-attendu="r"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "i", html: "IO MUX" }, { id: "r", html: "RTC IO MUX" }, { id: "m", html: "GPIO matrix" }],
        aide: "Suis les flèches : la matrice est à gauche, au contact des périphériques ; l'IO_MUX touche les pads numériques ; le RTC IO_MUX est en bas.",
        ok: function () {
          n.chemin = ["perif", "matrice", "iomux", "pads"]; n.dessin();
          j.bravo("IO MUX, RTC IO MUX et GPIO matrix routent les signaux vers les broches.");
          j.expliquer("<p>Ensemble, ces trois systèmes donnent des entrées/sorties très configurables : presque n'importe quel signal de périphérique peut sortir sur presque n'importe quelle broche.</p>");
          j.suite();
        }
      });
    } },
    { nom: "Le plus court", jouer: function (j, n) {
      n.chemin = null; n.dessin();
      j.titre("Un signal SPI très rapide vers une mémoire. Par où passe-t-il pour aller le plus vite ?");
      j.choix([
        { html: "Direct I/O : du périphérique à l'IO_MUX, sans la matrice", juste: true },
        { html: "Par la GPIO matrix puis l'IO_MUX", aide: "Ce chemin marche aussi, mais il ajoute un étage. Regarde la flèche « Direct I/O » en haut." },
        { html: "Par le RTC IO_MUX", aide: "Le RTC IO_MUX sert aux pads RTC, pas aux signaux rapides." }
      ], { colonnes: 1, ok: function () {
        n.chemin = ["rapide", "iomux", "pads"]; n.dessin();
        j.bravo("JTAG, SDIO, UART, SPI et Ethernet (signaux rapides) ont un accès direct.");
        j.expliquer("<p>L'IO_MUX envoie aussi aux pads les signaux de commande : FUN_SEL (choix de la fonction), IE (entrée), OE (sortie), WPU et PDU (tirages).</p>");
        j.suite();
      } });
    } }
  ]
});
