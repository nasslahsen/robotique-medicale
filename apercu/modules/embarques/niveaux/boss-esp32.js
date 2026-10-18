/* Boss du chapitre 4 : lire la fiche d'une puce ESP32 pour un holter ECG (nomenclature, tableau des références, adresses, horloge, broches, alimentation). */
NIVEAU({
  id: "boss-esp32",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { ligne: null, vue: "fiche", texte: "" };
    var T = [
      ["ESP32-D0WD-V3", "Dual", "v3.0/v3.1", "aucune", "QFN 5*5", "1.8/3.3 V"],
      ["ESP32-D0WDRH2-V3", "Dual", "v3.0/v3.1", "2 MB PSRAM", "QFN 5*5", "3.3 V"],
      ["ESP32-U4WDH", "Dual", "v3.0/v3.1", "4 MB flash", "QFN 5*5", "3.3 V"],
      ["ESP32-D0WDQ6-V3", "Dual", "v3.0/v3.1", "aucune", "QFN 6*6", "1.8/3.3 V"],
      ["ESP32-D0WD", "Dual", "v1.0/v1.1", "aucune", "QFN 5*5", "1.8/3.3 V"],
      ["ESP32-S0WD", "Single", "v1.0/v1.1", "aucune", "QFN 5*5", "1.8/3.3 V"]
    ];
    var COL = [[20, 200, "Part Number"], [220, 70, "Core"], [290, 100, "Revision"], [390, 120, "Flash/PSRAM"], [510, 80, "Package"], [590, 80, "VDD_SDIO"]];
    n.dessin = function () {
      EMB.vider(g);
      EMB.el("rect", { x: 230, y: 80, width: 220, height: 110, rx: 10, fill: "#2b2f3a" }, g);
      for (var k = 0; k < 8; k++) {
        EMB.el("rect", { x: 244 + k * 25, y: 70, width: 12, height: 10, fill: C.gris }, g);
        EMB.el("rect", { x: 244 + k * 25, y: 190, width: 12, height: 10, fill: C.gris }, g);
      }
      EMB.texte(g, "ESP32-D0WDRH2-V3", [340, 122], { taille: 18, mono: true, coul: "#fff", halo: false });
      EMB.texte(g, "holter ECG", [340, 156], { taille: 15, coul: "#c6cbd8", halo: false, gras: false });
      var y0 = 230;
      COL.forEach(function (c) { EMB.el("rect", { x: c[0], y: y0, width: c[1], height: 36, fill: "#eef0f5", stroke: C.gris, "stroke-width": 1 }, g); EMB.texte(g, c[2], [c[0] + c[1] / 2, y0 + 18], { taille: 13, halo: false }); });
      T.forEach(function (l, i) {
        var y = y0 + 36 + i * 50, on = n.ligne === i;
        COL.forEach(function (c, j) {
          EMB.el("rect", { x: c[0], y: y, width: c[1], height: 50, fill: on ? C.clair : "#fff", stroke: on ? C.acc : C.gris, "stroke-width": on ? 2.5 : 1 }, g);
          EMB.texte(g, l[j], [c[0] + c[1] / 2, y + 25], { taille: j === 0 ? 14 : 13, mono: j === 0, halo: false, gras: j === 0 ? true : false });
        });
      });
      if (n.texte) EMB.texte(g, n.texte, [340, 585], { taille: 16, coul: C.acc });
    };
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Le nom", jouer: function (j, n) {
      j.titre("La puce du holter est une ESP32-D0WDRH2-V3. Combien de cœurs, combien de MB de PSRAM et combien de MB de flash dans le boîtier ?");
      j.nombre({ avant: "\\text{cœurs, PSRAM, flash :}", cases: [{ attendu: 2, tol: 0 }, { attendu: 2, tol: 0 }, { attendu: 0, tol: 0 }], ligne: true,
        aide: function (k) { return k === 0 ? "D, comme dans la nomenclature." : k === 1 ? "R2 : PSRAM intégrée." : "Le chiffre juste après la lettre du cœur."; },
        ok: function () { n.ligne = 1; n.dessin(); j.bravo("2 cœurs, 2 MB de PSRAM, pas de flash intégrée."); j.suite(); } });
    } },
    { nom: "Une autre version", jouer: function (j, n) {
      j.titre("La version suivante du holter doit garder son programme dans le boîtier : 4 MB de flash intégrée, deux cœurs. Quelle puce ?");
      j.choix([
        { html: "ESP32-D0WDQ6-V3", aide: "Q6 parle du boîtier. Regarde la colonne Flash/PSRAM." },
        { html: "ESP32-U4WDH", juste: true },
        { html: "ESP32-S0WD", aide: "S : un seul cœur." },
        { html: "ESP32-D0WD-V3", aide: "0 : pas de flash intégrée." }
      ], { colonnes: 2, ok: function () { n.ligne = 2; n.dessin(); j.bravo("ESP32-U4WDH : U dual core, 4 MB de flash."); j.suite(); } });
    } },
    { nom: "L'adresse de la ROM", jouer: function (j, n) {
      n.ligne = null; n.dessin();
      j.titre("Une routine de démarrage est lue dans la ROM interne. Laquelle de ces adresses y mène ?");
      j.choix([
        { html: "0x3FF8_0800", aide: "0x3FF8_0000 à 0x3FF8_1FFF : RTC FAST Memory." },
        { html: "0x3FF9_8000", juste: true },
        { html: "0x3FFC_0000", aide: "0x3FFA_E000 à 0x3FFF_FFFF : SRAM interne." },
        { html: "0x3FC0_0000", aide: "0x3FC0_0000 à 0x3FEF_FFFF : plage grise, rien n'y est relié." }
      ], { colonnes: 2, ok: function () { n.texte = "0x3FF9_0000 à 0x3FF9_FFFF : Internal ROM"; n.dessin(); j.bravo("0x3FF9_8000 est dans 0x3FF9_0000 à 0x3FF9_FFFF."); j.suite(); } });
    } },
    { nom: "L'horloge", jouer: function (j, n) {
      n.texte = ""; n.dessin();
      j.titre("Le CPU peut tourner à 160 ou à 240 MHz. Combien dure une période d'horloge dans chaque cas, en nanosecondes ?");
      j.nombre({ avant: "T_{160},\\ T_{240} :", apres: "\\text{ ns}", cases: [{ attendu: 6.25, tol: 0.01 }, { attendu: 4.17, tol: 0.01 }], ligne: true,
        aide: function () { return "\\(T = 1/f\\) : \\(1/(160 \\times 10^{6})\\) s, à écrire en ns (\\(10^{-9}\\) s)."; },
        ok: function () { j.bravo("6,25 ns à 160 MHz, environ 4,17 ns à 240 MHz."); j.suite(); } });
    } },
    { nom: "Les broches", jouer: function (j, n) {
      j.titre("Sur la carte DEV KIT V1, un capteur I2C et une mémoire SPI (VSPI). Place chaque signal sur sa broche.");
      var z = j.zone("", '<div style="display:grid;grid-template-columns:auto 1fr;gap:10px 14px;align-items:center;font-size:18px"><span>SDA</span><span class="trou" data-attendu="21"></span><span>SCL</span><span class="trou" data-attendu="22"></span><span>MOSI</span><span class="trou" data-attendu="23"></span><span>SCK</span><span class="trou" data-attendu="18"></span></div>');
      j.jetons({
        trous: [].slice.call(z.querySelectorAll(".trou")),
        jetons: [{ id: "18", html: "GPIO18" }, { id: "34", html: "GPIO34" }, { id: "22", html: "GPIO22" }, { id: "21", html: "GPIO21" }, { id: "23", html: "GPIO23" }, { id: "19", html: "GPIO19" }],
        aide: "Sur le brochage : SDA et SCL sur GPIO21 et 22, MOSI et SCK du VSPI sur GPIO23 et 18. GPIO19 est MISO.",
        ok: function () { j.bravo("SDA 21, SCL 22, MOSI 23, SCK 18."); j.suite(); }
      });
    } },
    { nom: "L'alimentation", jouer: function (j, n) {
      n.ligne = 1; n.dessin();
      j.titre("Le tableau donne VDD_SDIO = 3,3 V pour cette puce à PSRAM. D'où vient alors VDD_SDIO dans le schéma d'alimentation ?");
      j.choix([
        { html: "Du LDO 1,8 V", aide: "Le LDO de la colonne SDIO sort 1,8 V." },
        { html: "De VDD3P3_RTC, à travers la résistance de 6 Ω", juste: true },
        { html: "Du LDO 1,1 V du domaine CPU", aide: "Le domaine CPU a son propre LDO, il ne fournit pas VDD_SDIO." }
      ], { colonnes: 1, ok: function () {
        j.bravo("3,3 V : VDD3P3_RTC à travers R = 6 Ω.");
        j.expliquer("<p>Lire une fiche, c'est croiser les pages : le nom donne les options, le tableau la révision et la tension VDD_SDIO, le schéma d'alimentation d'où vient cette tension.</p>");
        j.suite();
      } });
    } }
  ]
});
