/* Niveau : la carte ESP32 DEV KIT V1 (Section III, diapositives 5 et 6). Composants de la carte, LED, brochage. */
NIVEAU({
  id: "devkit",
  init: function (fig) {
    var C = EMB.C, g = E.s("g", null, fig.svg);
    var n = { mode: "carte", trouve: {}, faux: null, surTouche: null, zones: {}, marque: {} };
    // composants : rectangle de dessin, étiquette, position de l'étiquette
    var COMP = {
      usb: { r: [34, 266, 70, 68], nom: "USB INPUT", lab: [66, 455] },
      en: { r: [118, 192, 44, 44], nom: "RESET/EN", lab: [110, 130] },
      boot: { r: [118, 364, 44, 44], nom: "BOOT", lab: [104, 522] },
      reg: { r: [186, 196, 64, 40], nom: "Régulateur 3,3 V", lab: [235, 80] },
      cp2102: { r: [182, 290, 72, 72], nom: "CP2102 (USB to UART)", lab: [240, 478] },
      ledr: { r: [276, 210, 26, 16], nom: "LED rouge (Power ON)", lab: [380, 130] },
      ledb: { r: [276, 378, 26, 16], nom: "LED bleue (PIN2)", lab: [430, 524] },
      wroom: { r: [326, 196, 216, 214], nom: "ESP-WROOM-32", lab: [434, 303] },
      antenne: { r: [548, 196, 62, 214], nom: "Antenne", lab: [590, 80] }
    };
    n.COMP = COMP;
    var GAUCHE = [["EN", ""], ["GPIO36", "entrée seule · ADC1_0"], ["GPIO39", "entrée seule · ADC1_3"], ["GPIO34", "entrée seule · ADC1_6"], ["GPIO35", "entrée seule · ADC1_7"], ["GPIO32", "ADC1_4 · Touch9"], ["GPIO33", "ADC1_5 · Touch8"], ["GPIO25", "DAC1 · ADC2_8"], ["GPIO26", "DAC2 · ADC2_9"], ["GPIO27", "ADC2_7 · Touch7"], ["GPIO14", "ADC2_6 · HSPI_CLK"], ["GPIO12", "ADC2_5 · HSPI_Q"], ["GPIO13", "ADC2_4 · HSPI_ID"], ["GND", ""], ["VIN", ""]];
    var DROITE = [["GPIO23", "MOSI (VSPI)"], ["GPIO22", "SCL"], ["GPIO1", "TXD0"], ["GPIO3", "RXD0"], ["GPIO21", "SDA"], ["GPIO19", "MISO (VSPI)"], ["GPIO18", "SCK (VSPI)"], ["GPIO5", "SS (VSPI)"], ["GPIO17", "TXD2"], ["GPIO16", "RXD2"], ["GPIO4", "ADC2_0 · Touch0"], ["GPIO2", "ADC2_2 · Touch2"], ["GPIO15", "ADC2_3 · Touch3"], ["GND", ""], ["3.3V", ""]];
    function carte() {
      EMB.el("rect", { x: 60, y: 170, width: 560, height: 260, rx: 18, fill: "#20242e", stroke: C.encre, "stroke-width": 3 }, g);
      for (var k = 0; k < 15; k++) {
        EMB.el("circle", { cx: 110 + k * 32, cy: 184, r: 6, fill: "#c9a227", stroke: "#8a6d12", "stroke-width": 1.5 }, g);
        EMB.el("circle", { cx: 110 + k * 32, cy: 416, r: 6, fill: "#c9a227", stroke: "#8a6d12", "stroke-width": 1.5 }, g);
      }
      var r = COMP;
      EMB.el("rect", { x: r.usb.r[0], y: r.usb.r[1] + 8, width: r.usb.r[2], height: r.usb.r[3] - 16, rx: 6, fill: "#c6cbd8", stroke: C.encre, "stroke-width": 2 }, g);
      ["en", "boot"].forEach(function (b) { var q = r[b].r; EMB.el("rect", { x: q[0], y: q[1], width: q[2], height: q[3], rx: 6, fill: "#e8eaf0", stroke: C.encre, "stroke-width": 2 }, g); EMB.el("circle", { cx: q[0] + 22, cy: q[1] + 22, r: 12, fill: "#2b2f3a" }, g); });
      EMB.el("rect", { x: r.reg.r[0], y: r.reg.r[1], width: r.reg.r[2], height: r.reg.r[3], rx: 3, fill: "#3a3f4c", stroke: "#000", "stroke-width": 2 }, g);
      EMB.el("rect", { x: r.cp2102.r[0], y: r.cp2102.r[1], width: r.cp2102.r[2], height: r.cp2102.r[3], rx: 4, fill: "#3a3f4c", stroke: "#000", "stroke-width": 2 }, g);
      EMB.el("rect", { x: r.ledr.r[0], y: r.ledr.r[1], width: r.ledr.r[2], height: r.ledr.r[3], rx: 3, fill: "#e5484d" }, g);
      EMB.el("rect", { x: r.ledb.r[0], y: r.ledb.r[1], width: r.ledb.r[2], height: r.ledb.r[3], rx: 3, fill: n.bleueOn ? "#3b5bdb" : "#9aa8d8" }, g);
      EMB.el("rect", { x: r.wroom.r[0], y: r.wroom.r[1], width: r.wroom.r[2], height: r.wroom.r[3], rx: 8, fill: "#cfd3dc", stroke: "#7c8594", "stroke-width": 2 }, g);
      EMB.el("rect", { x: r.antenne.r[0], y: r.antenne.r[1], width: r.antenne.r[2], height: r.antenne.r[3], rx: 6, fill: "#2b2f3a" }, g);
      EMB.el("path", { d: "M560 220 h36 v24 h-30 v24 h30 v24 h-30 v24 h30 v24 h-30 v24 h30", fill: "none", stroke: "#c9a227", "stroke-width": 3 }, g);
      Object.keys(COMP).forEach(function (k) {
        var c = COMP[k], q = c.r;
        n.zones[k] = EMB.zoneMin(q, 54);
        if (n.faux === k) EMB.el("rect", { x: q[0] - 5, y: q[1] - 5, width: q[2] + 10, height: q[3] + 10, rx: 8, fill: "none", stroke: C.ko, "stroke-width": 4 }, g);
        if (!n.trouve[k]) return;
        EMB.el("rect", { x: q[0] - 5, y: q[1] - 5, width: q[2] + 10, height: q[3] + 10, rx: 8, fill: "none", stroke: C.ok, "stroke-width": 4 }, g);
        var dedans = k === "wroom";
        if (!dedans) EMB.el("line", { x1: q[0] + q[2] / 2, y1: c.lab[1] < 300 ? q[1] - 5 : q[1] + q[3] + 5, x2: c.lab[0], y2: c.lab[1] + (c.lab[1] < 300 ? 14 : -14), stroke: C.ok, "stroke-width": 2.5 }, g);
        EMB.texte(g, c.nom, c.lab, { taille: 17, coul: dedans ? C.encre : C.ok, halo: true });
      });
    }
    function brochage() {
      var y0 = 46, pas = 36.5;
      EMB.el("rect", { x: 280, y: 20, width: 120, height: 570, rx: 14, fill: "#20242e" }, g);
      EMB.el("rect", { x: 296, y: 34, width: 88, height: 130, rx: 6, fill: "#cfd3dc" }, g);
      EMB.texte(g, "ESP32", [340, 99], { taille: 16, halo: false });
      [[GAUCHE, -1], [DROITE, 1]].forEach(function (cote) {
        cote[0].forEach(function (p, k) {
          var y = y0 + k * pas, id = (cote[1] < 0 ? "g" : "d") + k, m = n.marque[id];
          var xBord = cote[1] < 0 ? 280 : 400, xNom = cote[1] < 0 ? 272 : 408;
          EMB.el("circle", { cx: xBord, cy: y, r: 6, fill: "#c9a227" }, g);
          var fond = m === "ok" ? C.ok : m === "ko" ? C.ko : p[0].indexOf("GPIO") === 0 ? "#fff" : "#eef0f5";
          var wn = 74;
          EMB.el("rect", { x: cote[1] < 0 ? xNom - wn : xNom, y: y - 14, width: wn, height: 28, rx: 6, fill: fond, stroke: C.encre, "stroke-width": 1.5 }, g);
          EMB.texte(g, p[0], [cote[1] < 0 ? xNom - wn / 2 : xNom + wn / 2, y + 1], { taille: 14, mono: true, halo: false, coul: m ? "#fff" : C.encre });
          if (p[1]) EMB.texte(g, p[1], [cote[1] < 0 ? xNom - wn - 8 : xNom + wn + 8, y + 1], { taille: 13, ancre: cote[1] < 0 ? "end" : "start", gras: false, coul: C.doux });
          n.zones[id] = cote[1] < 0 ? [0, y - pas / 2, 280, pas] : [400, y - pas / 2, 280, pas];
        });
      });
    }
    n.broche = function (id) { var c = id.charAt(0) === "g" ? GAUCHE : DROITE; return c[+id.slice(1)][0]; };
    n.dessin = function () {
      EMB.vider(g); n.zones = {};
      if (n.mode === "carte") carte(); else brochage();
    };
    EMB.toucher(fig.svg, function () { return n.surTouche ? n.zones : {}; }, function (k) { if (n.surTouche) n.surTouche(k); });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "La carte", jouer: function (j, n) {
      j.fig.astuce("Touche un composant de la carte.");
      j.titre("Repère les composants de la carte, un à un.");
      var Q = [["cp2102", "le circuit qui convertit l'USB de l'ordinateur en UART pour l'ESP32"], ["reg", "le régulateur qui fournit le 3,3 V"], ["wroom", "le module qui contient la puce ESP32"], ["antenne", "l'antenne du Wi-Fi et du Bluetooth"], ["ledb", "la LED que ton programme peut allumer"]], k = 0;
      var cons = j.consigne("");
      function poser() { cons.innerHTML = "Touche " + Q[k][1] + "."; }
      poser();
      n.surTouche = function (id) {
        if (k >= Q.length) return;
        if (id === Q[k][0]) {
          n.trouve[id] = true; n.faux = null; n.dessin(); k++;
          if (k < Q.length) { j.info("Oui. Suivant."); poser(); return; }
          n.surTouche = null; cons.innerHTML = "";
          Object.keys(n.COMP).forEach(function (c) { n.trouve[c] = true; }); n.dessin();
          j.bravo("Toute la carte est repérée.");
          j.expliquer("<p>La carte <b>ESP32 DEV KIT V1</b> porte le module ESP-WROOM-32 et tout ce qu'il faut autour : régulateur 3,3 V, convertisseur CP2102 (USB to UART), boutons RESET/EN et BOOT, LED rouge (Power ON), LED bleue (PIN2), antenne.</p>");
          j.suite();
        } else {
          n.faux = id; n.dessin(); setTimeout(function () { n.faux = null; n.dessin(); }, 800);
          j.erreur("Ça, c'est : " + n.COMP[id].nom + ".");
        }
      };
      j.reponse(function () { for (var s = 0; s < 8 && n.surTouche; s++) n.surTouche(Q[k][0]); });
    } },
    { nom: "Pourquoi le CP2102", jouer: function (j, n) {
      j.fig.astuce("");
      j.titre("Ton ordinateur envoie le programme par le câble USB. Pourquoi la carte a-t-elle un CP2102 ?");
      j.choix([
        { html: "L'ordinateur parle USB, l'ESP32 reçoit le programme par son UART : le CP2102 traduit", juste: true },
        { html: "Il fournit le 3,3 V à la puce", aide: "Le 3,3 V vient du régulateur, à côté du bouton EN." },
        { html: "Il remplace l'antenne quand le Wi-Fi est coupé", aide: "Regarde l'étiquette de la diapositive : USB to UART." }
      ], { colonnes: 1, ok: function () {
        j.bravo("CP2102 : USB to UART.");
        j.expliquer("<p>Le CP2102 fait le pont entre le port USB de l'ordinateur et l'UART de l'ESP32. L'UART est le bus série asynchrone du chapitre 3.</p>");
        j.suite();
      } });
    } },
    { nom: "Les deux LED", jouer: function (j, n) {
      j.titre("Tu branches la carte : la LED rouge s'allume, la bleue reste éteinte. Que peux-tu en conclure ?");
      j.choix([
        { html: "La carte est en panne", aide: "La rouge indique « Power ON ». La bleue, elle, attend un ordre." },
        { html: "La carte est alimentée ; la bleue dépend du programme (PIN2)", juste: true },
        { html: "Le Wi-Fi est connecté", aide: "Aucune des deux LED n'indique le Wi-Fi sur la diapositive." }
      ], { colonnes: 1, ok: function () {
        n.bleueOn = true; n.dessin();
        j.bravo("Rouge : alimentée. Bleue : branchée sur la broche 2.");
        j.expliquer("<p>Le premier programme d'essai d'une carte est souvent de faire clignoter la LED bleue : il suffit de mettre la broche GPIO2 en sortie et de la basculer.</p>");
        j.suite();
      } });
    } },
    { nom: "Le brochage", jouer: function (j, n) {
      n.mode = "brochage"; n.marque = {}; n.dessin();
      j.fig.astuce("");
      j.titre("Brancher un thermomètre médical sur la carte.");
      var Q = [
        [["GPIO34", "GPIO35", "GPIO36", "GPIO39"], "La thermistance donne une tension : touche une broche qui ne sert qu'en entrée."],
        [["GPIO25"], "On veut sortir une tension analogique sur le DAC1 : touche sa broche."],
        [["GPIO21"], "L'afficheur I2C se branche sur SDA : touche sa broche."]
      ], k = 0;
      var cons = j.consigne("");
      function poser() { cons.innerHTML = Q[k][1]; }
      poser();
      n.surTouche = function (id) {
        if (k >= Q.length) return;
        var nom = n.broche(id);
        if (Q[k][0].indexOf(nom) >= 0) {
          n.marque[id] = "ok"; n.dessin(); k++;
          if (k < Q.length) { j.info("Oui : " + nom + "."); poser(); return; }
          n.surTouche = null; cons.innerHTML = "";
          j.bravo("Entrée seule, DAC1 sur GPIO25, SDA sur GPIO21.");
          j.expliquer("<p>Chaque broche a plusieurs fonctions possibles (ADC, DAC, Touch, UART, SPI, I2C). Les GPIO 34, 35, 36 et 39 sont en entrée seule (<i>input only</i>).</p>");
          j.suite();
        } else {
          n.marque[id] = "ko"; n.dessin(); setTimeout(function () { delete n.marque[id]; n.dessin(); }, 800);
          j.erreur(nom + " ne convient pas : lis les fonctions écrites à côté des broches.");
        }
      };
      var IDS = { GPIO34: "g3", GPIO25: "g7", GPIO21: "d4" };
      j.reponse(function () { for (var s = 0; s < 4 && n.surTouche; s++) n.surTouche(IDS[Q[k][0][0]]); });
    } },
    { nom: "Compter", jouer: function (j, n) {
      n.surTouche = null;
      j.titre("Combien de broches de cette carte sont en entrée seule ?");
      j.nombre({ cases: [{ attendu: 4, tol: 0 }], ligne: true, aide: function () { return "Cherche « entrée seule » sur le côté gauche."; }, ok: function () {
        j.bravo("Quatre : GPIO36, 39, 34 et 35.");
        j.suite();
      } });
    } }
  ]
});
