(function () {
  "use strict";
  var R = RM, C = EMB.C;
  function F(g, a, b, o) { EMB.fleche(g, a, b, o || { ep: 2.2 }); }

  /* ---------- Figure 1 : émission pas à pas, bloc et chronogramme ---------- */
  (function () {
    var f = R.figure("fig-emission", {
      largeur: 960, hauteur: 600,
      titre: "Émission d'un octet par l'UART du PIC18F4520",
      essai: "<strong>Essaie</strong> : avance étape par étape. <strong>Observe</strong> : TXIF remonte dès que le mot quitte TXREG, alors que TRMT reste à 0 tant que le TSR n'a pas fini d'envoyer le stop bit."
    });
    var g = EMB.el("g", null, f.svg), k = 0;
    var ET = [
      { t: 0, txif: 1, trmt: 1, on: [], txt: "Repos : TXREG et TSR sont vides, TXIF = 1 et TRMT = 1." },
      { t: 0.4, txif: 0, trmt: 1, on: ["txreg"], txt: "Le programme écrit le mot dans TXREG : TXIF tombe à 0." },
      { t: 0.75, txif: 1, trmt: 0, on: ["txreg", "tsr"], txt: "Le mot passe dans le TSR : TXIF remonte (1 TCY plus tard), TRMT tombe à 0." },
      { t: 6, txif: 1, trmt: 0, on: ["tsr", "pin", "brg"], txt: "Le TSR décale les bits sur TX au rythme du générateur de baud. TXREG peut déjà recevoir le mot suivant." },
      { t: 11.2, txif: 1, trmt: 1, on: ["pin"], txt: "Le stop bit est parti : TRMT remonte à 1." }
    ];
    var et = R.etapes(f.reglages, 4, ET.map(function (e) { return ""; }), function (i) { k = i; dessiner(); });
    var zone = R.h("p", null, "", f.direct);
    var BL = { txreg: [330, 20, 240, 50, "TXREG Register"], tsr: [300, 110, 300, 56, "TSR Register"], pin: [660, 110, 200, 56, "Pin Buffer and Control"], brg: [40, 110, 210, 56, "SPBRGH | SPBRG"] };
    function dessiner() {
      EMB.vider(g);
      var e = ET[k];
      Object.keys(BL).forEach(function (id) { var b = BL[id]; EMB.bloc(g, b[0], b[1], b[2], b[3], b[4], { taille: 17, actif: e.on.indexOf(id) >= 0 }); });
      EMB.bloc(g, 40, 20, 110, 50, "TXIF = " + e.txif, { taille: 16, mono: true, actif: k === 1 || k === 2 });
      EMB.bloc(g, 360, 200, 180, 46, "TRMT = " + e.trmt, { taille: 16, mono: true, actif: k === 2 || k === 4 });
      EMB.bloc(g, 900, 118, 50, 40, "TX", { taille: 15 });
      F(g, [450, 70], [450, 110]); F(g, [330, 45], [150, 45]); F(g, [600, 138], [660, 138]); F(g, [860, 138], [900, 138]); F(g, [250, 138], [300, 138]); F(g, [450, 166], [450, 200]);
      // chronogramme
      var X0 = 200, P = 56, Y = [290, 370, 450, 530], noms = ["TX (pin)", "BRG Output", "TXIF bit", "TRMT bit"];
      noms.forEach(function (t, i) { EMB.texte(g, t, [30, Y[i] + 18], { taille: 16, ancre: "start" }); });
      EMB.onde(g, X0, Y[0], P, 36, [1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1], { ep: 3, fronts: true, coul: C.acc, etiquettes: ["", "start", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "stop", "", ""], taille: 13 });
      EMB.horloge(g, X0, Y[1], P, 36, 13, { ep: 2.5 });
      var q = P / 4, z1 = [], z2 = [];
      for (var i = 0; i < 52; i++) { z1.push(i === 2 ? 0 : 1); z2.push(i >= 3 && i < 44 ? 0 : 1); }
      EMB.onde(g, X0, Y[2], q, 36, z1, { ep: 3 });
      EMB.onde(g, X0, Y[3], q, 36, z2, { ep: 3 });
      var xc = X0 + e.t * P;
      EMB.el("line", { x1: xc, y1: Y[0] - 20, x2: xc, y2: Y[3] + 50, stroke: C.ko, "stroke-width": 2.5 }, g);
      zone.textContent = e.txt;
    }
    dessiner();
  })();

  /* ---------- Figure 2 : réception et erreurs ---------- */
  (function () {
    var f = R.figure("fig-reception", {
      largeur: 960, hauteur: 520,
      titre: "Bloc de réception de l'UART du PIC18F4520",
      essai: "<strong>Essaie</strong> : choisis un des trois cas. <strong>Observe</strong> : un octet bien reçu va du RSR à RCREG et lève RCIF ; un stop bit à 0 lève FERR ; une FIFO pleine lève OERR."
    });
    var g = EMB.el("g", null, f.svg), cas = 0, b = R.boutons(f.reglages), btns = [];
    ["Trame correcte", "Stop bit à 0", "FIFO pleine"].forEach(function (t, i) { btns.push(R.bouton(b, t, function () { cas = i; dessiner(); })); });
    var zone = R.h("p", null, "", f.direct);
    var TXT = ["L'octet traverse Data Recovery, le RSR, puis entre dans la FIFO RCREG : RCIF passe à 1 (interruption si RCIE = 1).", "Le RSR trouve un stop bit à 0 : FERR (framing error) passe à 1.", "La FIFO RCREG est pleine et un octet de plus arrive dans le RSR : OERR (overrun error) passe à 1."];
    function dessiner() {
      EMB.vider(g);
      btns.forEach(function (x, i) { x.classList.toggle("actif", i === cas); });
      var on = function (id) { return (cas === 0 && ["rec", "rsr", "rcreg", "rcif"].indexOf(id) >= 0) || (cas === 1 && (id === "ferr" || id === "rsr")) || (cas === 2 && (id === "oerr" || id === "rcreg")); };
      var B = { brg: [30, 40, 250, 64, "SPBRGH | SPBRG\nBaud Rate Generator"], div: [320, 30, 120, 90, "÷ 64\n÷ 16\n÷ 4"], cren: [560, 30, 100, 50, "CREN"], oerr: [690, 30, 100, 50, "OERR"], ferr: [820, 30, 100, 50, "FERR"],
        rx: [30, 300, 80, 56, "RX"], pin: [140, 300, 170, 56, "Pin Buffer\nand Control"], spen: [165, 400, 120, 46, "SPEN"], rec: [330, 300, 160, 56, "Data Recovery"],
        rcreg: [560, 260, 360, 64, "RX9D | RCREG Register (FIFO)"], rcif: [560, 400, 100, 46, "RCIF"], rcie: [560, 460, 100, 46, "RCIE"] };
      Object.keys(B).forEach(function (id) { var x = B[id], err = id === "oerr" || id === "ferr"; EMB.bloc(g, x[0], x[1], x[2], x[3], x[4], { taille: 16, actif: on(id), stroke: on(id) && err ? C.ko : undefined, fill: on(id) && err ? "#fdecec" : undefined, coul: on(id) && err ? C.ko : undefined }); });
      // RSR
      var cel = ["Stop", "(8)", "7", "• • •", "1", "0", "Start"], x0 = 560, w = 360 / 7;
      EMB.bloc(g, 550, 120, 380, 80, "", { actif: on("rsr") });
      cel.forEach(function (t, i) { EMB.el("rect", { x: x0 + i * w, y: 140, width: w, height: 44, fill: "#fff", stroke: C.encre, "stroke-width": 1.5 }, g); EMB.texte(g, t, [x0 + i * w + w / 2, 162], { taille: 14, mono: true, halo: false, coul: cas === 1 && i === 0 ? C.ko : C.encre }); });
      if (cas === 1) EMB.texte(g, "0", [x0 + w / 2, 216], { taille: 20, mono: true, coul: C.ko });
      EMB.texte(g, "RSR Register", [672, 214], { taille: 14, coul: C.doux });
      F(g, [280, 72], [320, 72]); F(g, [380, 120], [400, 300]);
      F(g, [110, 328], [140, 328]); F(g, [225, 400], [225, 356]); F(g, [310, 328], [330, 328]);
      F(g, [490, 320], [555, 180]); F(g, [610, 80], [610, 120]); F(g, [740, 120], [740, 80]); F(g, [870, 120], [870, 80]);
      F(g, [740, 200], [740, 260]); F(g, [880, 324], [880, 380]); EMB.texte(g, "Data Bus", [880, 400], { taille: 15, coul: C.doux });
      F(g, [560, 423], [500, 450]); F(g, [560, 483], [500, 456]); EMB.texte(g, "Interrupt", [430, 453], { taille: 15, coul: C.doux });
      zone.textContent = TXT[cas];
    }
    dessiner();
  })();

  /* ---------- Figure 3 : vote 2 sur 3 ---------- */
  (function () {
    var f = R.figure("fig-vote", {
      largeur: 960, hauteur: 380,
      titre: "Suréchantillonnage et vote 2 sur 3",
      essai: "<strong>Essaie</strong> : élargis le parasite, puis change sa position. <strong>Observe</strong> : tant qu'un seul des trois échantillons du milieu est faussé, le vote garde la bonne valeur."
    });
    var g = EMB.el("g", null, f.svg);
    var cl = R.curseur(f.reglages, { nom: "Largeur du parasite (échantillons)", min: 0, max: 4, pas: 1, val: 1, surChange: dessiner });
    var cp = R.curseur(f.reglages, { nom: "Position", min: 4, max: 11, pas: 1, val: 8, surChange: dessiner });
    var zone = R.h("p", null, "", f.direct);
    function dessiner() {
      EMB.vider(g);
      var x0 = 60, w = 840, y1 = 70, y0 = 170, l = cl.v, p = cp.v, s = w / 16;
      var bas = function (i) { return l > 0 && i >= p - Math.floor((l - 1) / 2) && i < p - Math.floor((l - 1) / 2) + l; };
      var d = "M" + x0 + " " + y1;
      for (var i = 0; i < 16; i++) { var y = bas(i) ? y0 : y1; d += " L" + (x0 + i * s) + " " + y + " L" + (x0 + (i + 1) * s) + " " + y; }
      EMB.el("path", { d: d, fill: "none", stroke: C.acc, "stroke-width": 4 }, g);
      EMB.texte(g, "bit à 1 sur la ligne, avec un parasite", [480, 40], { taille: 17, coul: C.doux, gras: false });
      var votes = [];
      for (i = 0; i < 16; i++) {
        var x = x0 + (i + 0.5) * s, mil = i >= 7 && i <= 9, v = bas(i) ? 0 : 1;
        EMB.el("line", { x1: x, y1: 200, x2: x, y2: mil ? 250 : 225, stroke: mil ? C.encre : C.gris, "stroke-width": mil ? 3 : 1.5 }, g);
        EMB.texte(g, String(i), [x, 278], { taille: 13, mono: true, coul: mil ? C.encre : C.gris });
        if (mil) { votes.push(v); EMB.bloc(g, x - 22, 296, 44, 44, String(v), { taille: 22, mono: true, actif: true, stroke: v ? C.acc : C.ko }); }
      }
      var res = votes.reduce(function (a, c) { return a + c; }, 0) >= 2 ? 1 : 0;
      zone.innerHTML = "Échantillons 7, 8, 9 : " + votes.join(", ") + ". Vote : le bit vaut <b>" + res + "</b>" + (res ? "." : " : le parasite est trop large, le bit est faussé.");
    }
    dessiner();
  })();
})();
