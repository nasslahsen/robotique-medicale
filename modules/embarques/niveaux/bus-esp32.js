/* Niveau : interfaces I2C et SPI de l'ESP32 (Section III, diapositives 29 et 30). */
NIVEAU({
  id: "bus-esp32",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    // brochage de la carte ESP32 DEV KIT V1 (diapo 6), de haut en bas
    var GAUCHE = [["EN", ""], ["36", "ADC1_0"], ["39", "ADC1_3"], ["34", "ADC1_6"], ["35", "ADC1_7"], ["32", "ADC1_4"], ["33", "ADC1_5"], ["25", "DAC1"], ["26", "DAC2"], ["27", "ADC2_7"], ["14", "HSPI_CLK"], ["12", "HSPI_Q"], ["13", "HSPI_ID"], ["GND", ""], ["VIN", ""]];
    var DROITE = [["23", "MOSI"], ["22", "SCL"], ["1", "TXD0"], ["3", "RXD0"], ["21", "SDA"], ["19", "MISO"], ["18", "SCK"], ["5", "SS"], ["17", "TXD2"], ["16", "RXD2"], ["4", "ADC2_0"], ["2", "ADC2_2"], ["15", "HSPI_CS0"], ["GND", ""], ["3.3V", ""]];
    var n = { marques: {}, notes: {}, surTouche: null, etiquettes: false };
    function y(i) { return 68 + i * 34.5; }
    n.zones = function () {
      var z = {};
      GAUCHE.forEach(function (p, i) { if (/^\d+$/.test(p[0])) z[p[0]] = [70, y(i) - 17, 190, 34]; });
      DROITE.forEach(function (p, i) { if (/^\d+$/.test(p[0])) z[p[0]] = [420, y(i) - 17, 190, 34]; });
      return z;
    };
    n.dessin = function () {
      EMB.vider(g);
      EMB.el("rect", { x: 262, y: 22, width: 156, height: 556, rx: 14, fill: "#2b2f3a" }, g);
      EMB.el("rect", { x: 280, y: 40, width: 120, height: 150, rx: 6, fill: "#c9ced8", stroke: "#8a91a0", "stroke-width": 2 }, g);
      EMB.texte(g, "ESP-WROOM-32", [340, 115], { taille: 12, coul: C.encre, halo: false });
      EMB.el("rect", { x: 318, y: 530, width: 44, height: 40, rx: 4, fill: "#9aa0ad" }, g);
      [[GAUCHE, 262, "end"], [DROITE, 418, "start"]].forEach(function (cote) {
        cote[0].forEach(function (p, i) {
          var yy = y(i), m = n.marques[p[0]], num = /^\d+$/.test(p[0]), note = n.notes[p[0]];
          EMB.el("circle", { cx: cote[1], cy: yy, r: 7, fill: "#d9b44a", stroke: "#2b2f3a", "stroke-width": 2 }, g);
          var bx = cote[2] === "end" ? 180 : 420;
          EMB.el("rect", { x: bx, y: yy - 14, width: 80, height: 28, rx: 6, fill: m ? m : (num ? "#f3e8fb" : "#eef0f5"), stroke: m ? m : (num ? "#b88ad6" : C.gris), "stroke-width": m ? 3 : 1.5 }, g);
          EMB.texte(g, num ? "GPIO" + p[0] : p[0], [bx + 40, yy + 1], { taille: 15, mono: true, coul: m ? "#fff" : C.encre, halo: false });
          var t = note || (n.etiquettes ? p[1] : "");
          if (t) EMB.texte(g, t, [cote[2] === "end" ? 172 : 508, yy + 1], { taille: note ? 16 : 14, mono: true, coul: note ? C.acc : C.doux, gras: !!note, ancre: cote[2] });
        });
      });
    };
    // toucher des broches dans un ordre donné : [[gpio, nom], ...]
    n.suite = function (j, ordre, fin) {
      var k = 0, fini = false;
      n.surTouche = function (p) {
        if (fini) return;
        if (p === ordre[k][0]) {
          n.marques[p] = C.ok; n.notes[p] = ordre[k][1]; n.dessin(); k++;
          if (k === ordre.length) { fini = true; n.surTouche = null; fin(); }
          else j.info("Oui. Maintenant " + ordre[k][1] + ".");
        } else {
          n.marques[p] = C.ko; n.dessin();
          setTimeout(function () { if (n.marques[p] === C.ko) { delete n.marques[p]; n.dessin(); } }, 800);
          j.erreur("Ce n'est pas la broche " + ordre[k][1] + " par défaut. Elles sont toutes du côté droit de la carte.");
        }
      };
      j.reponse(function () { ordre.forEach(function (o) { if (n.surTouche) n.surTouche(o[0]); }); });
    };
    EMB.toucher(fig.svg, function () { return n.surTouche ? n.zones() : {}; }, function (k) { if (n.surTouche) n.surTouche(k); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "I2C par défaut", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Un capteur de température I2C, programmé avec l'IDE Arduino, broches par défaut. Touche SDA, puis SCL.");
      n.suite(j, [["21", "SDA"], ["22", "SCL"]], function () {
        j.bravo("GPIO 21 pour SDA, GPIO 22 pour SCL.");
        j.expliquer("<p>L'ESP32 a <b>deux canaux I2C</b>, et n'importe quelle broche peut servir de SDA ou de SCL. Avec l'IDE Arduino, les broches par défaut sont GPIO 21 (SDA) et GPIO 22 (SCL).</p>");
        j.suite();
      });
    } },
    { nom: "Autres broches", jouer: function (j, n) {
      j.titre("GPIO 21 et 22 sont déjà prises. Tu mets SDA sur GPIO 16 et SCL sur GPIO 17. Complète l'appel de la bibliothèque Wire.");
      var z = j.zone("", '<p style="font-family:JetBrains Mono, monospace;font-size:20px">Wire.begin(<span class="trou" data-attendu="16"></span>, <span class="trou" data-attendu="17"></span>);</p>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "17", html: "17" }, { id: "22", html: "22" }, { id: "16", html: "16" }],
        aide: "L'ordre est Wire.begin(SDA, SCL) : SDA d'abord.",
        ok: function () {
          n.notes = { "16": "SDA", "17": "SCL" }; n.marques = { "16": EMB.C.ok, "17": EMB.C.ok }; n.dessin();
          j.bravo("Wire.begin(16, 17);");
          j.suite();
        }
      });
    } },
    { nom: "VSPI", jouer: function (j, n) {
      n.notes = {}; n.marques = {}; n.dessin();
      j.titre("Une carte mémoire SD sur le bus VSPI. Touche dans l'ordre MOSI, MISO, CLK, puis CS.");
      n.suite(j, [["23", "MOSI"], ["19", "MISO"], ["18", "CLK"], ["5", "CS"]], function () {
        j.bravo("VSPI : MOSI 23, MISO 19, CLK 18, CS 5.");
        j.expliquer("<p>L'ESP32 offre deux bus SPI accessibles : <b>HSPI</b> (SPI2, <i>High-Speed</i>) et <b>VSPI</b> (SPI3, <i>Variable and Configurable</i>). Broches par défaut : VSPI MOSI 23, MISO 19, CLK 18, CS 5 ; HSPI MOSI 13, MISO 12, CLK 14, CS 15.</p>");
        j.suite();
      });
    } },
    { nom: "MISO", jouer: function (j, n) {
      n.etiquettes = true; n.dessin();
      j.titre("Que veut dire MISO ?");
      j.choix([
        { html: "Master In, Slave Out", juste: true },
        { html: "Master Out, Slave In", aide: "Ça, c'est MOSI. Sur MISO, la donnée va de l'esclave vers le maître." },
        { html: "Multiple Input, Single Output", aide: "Le M et le S sont ceux de maître et esclave (Master, Slave)." }
      ], { colonnes: 1, ok: function () {
        j.bravo("MISO : l'esclave parle, le maître écoute.");
        j.expliquer("<p>Attention, le tableau de la diapositive écrit « MISO (Master Out, Slave In) » : c'est une coquille. MISO signifie <i>Master In, Slave Out</i>.</p>");
        j.suite();
      } });
    } },
    { nom: "Combien d'esclaves", jouer: function (j, n) {
      j.titre("Chaque bus a trois lignes CS. Combien d'esclaves SPI au plus sur VSPI et HSPI ensemble ?");
      j.nombre({ cases: [{ attendu: 3 * 2, tol: 0 }], ligne: true,
        aide: function () { return "Trois esclaves par bus, deux bus."; },
        ok: function () {
          j.bravo("3 + 3 = 6 esclaves.");
          j.expliquer("<p>SPI2 et SPI3 ont des bus de signaux indépendants, chacun avec ses propres MOSI, MISO, CLK et trois lignes CS (<i>Chip Select</i>) pour piloter jusqu'à trois esclaves.</p>");
          j.suite();
        } });
    } },
    { nom: "Le bon nom", jouer: function (j, n) {
      j.titre("Ton code utilise SPI2. De quel bus s'agit-il ?");
      j.choix([{ html: "HSPI", juste: true }, { html: "VSPI", aide: "VSPI, c'est SPI3." }], { colonnes: 2, ok: function () {
        j.bravo("SPI2 = HSPI, SPI3 = VSPI.");
        j.suite();
      } });
    } }
  ]
});
