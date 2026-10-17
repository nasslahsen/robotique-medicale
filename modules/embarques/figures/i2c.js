(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure 1 : la ligne SDA partagée ---------- */
  (function () {
    var f = R.figure("fig-ligne", {
      largeur: 960, hauteur: 500,
      titre: "Sorties à drain ouvert et résistance de tirage",
      essai: "<strong>Essaie</strong> : coche et décoche « tire à 0 » pour chaque circuit. <strong>Observe</strong> : SDA passe à 0 dès qu'un seul circuit tire ; elle ne revient à 1 que quand les trois relâchent."
    });
    var g = EMB.el("g", null, f.svg), tire = [false, false, false], b = R.boutons(f.reglages);
    var NOMS = ["MCU", "Capteur de température", "EEPROM série"], XS = [40, 350, 660], W = 260;
    var cases = NOMS.map(function (t, k) { return R.bascule(b, t + " tire à 0", false, function () { tire[k] = cases[k].checked; dessiner(); }); });
    var zone = R.h("p", null, "", f.direct);
    function dessiner() {
      EMB.vider(g);
      var v = tire.some(function (t) { return t; }) ? 0 : 1, cl = v ? C.acc : C.ko;
      EMB.el("line", { x1: 700, y1: 40, x2: 900, y2: 40, stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.texte(g, "+VDD", [900, 20], { taille: 17, ancre: "end" });
      EMB.el("line", { x1: 800, y1: 40, x2: 800, y2: 64, stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.el("rect", { x: 790, y: 64, width: 20, height: 50, fill: "#fff", stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.texte(g, "RP", [840, 90], { taille: 17 });
      EMB.el("line", { x1: 800, y1: 114, x2: 800, y2: 150, stroke: cl, "stroke-width": 3 }, g);
      EMB.el("line", { x1: 20, y1: 150, x2: 940, y2: 150, stroke: cl, "stroke-width": 6 }, g);
      EMB.texte(g, "SDA = " + v, [30, 120], { taille: 24, ancre: "start", mono: true, coul: cl });
      XS.forEach(function (x, k) {
        var t = tire[k], xs = x + 180;
        EMB.bloc(g, x, 210, W, 270, "", { actif: t, tirets: "7 6" });
        EMB.texte(g, NOMS[k], [x + W / 2, 455], { taille: 18 });
        EMB.el("line", { x1: xs, y1: 150, x2: xs, y2: 290, stroke: cl, "stroke-width": 3 }, g);
        EMB.el("circle", { cx: xs, cy: 150, r: 6, fill: cl }, g);
        EMB.el("circle", { cx: xs, cy: 290, r: 6, fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g);
        EMB.el("circle", { cx: xs, cy: 360, r: 6, fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g);
        EMB.el("line", { x1: xs, y1: 366, x2: xs, y2: 396, stroke: C.encre, "stroke-width": 3 }, g);
        [[-18, 396], [-11, 404], [-4, 412]].forEach(function (m) { EMB.el("line", { x1: xs + m[0], y1: m[1], x2: xs - m[0], y2: m[1], stroke: C.encre, "stroke-width": 2.5 }, g); });
        if (t) EMB.el("line", { x1: xs, y1: 290, x2: xs, y2: 360, stroke: C.ko, "stroke-width": 5 }, g);
        else EMB.el("line", { x1: xs, y1: 290, x2: xs + 36, y2: 346, stroke: C.encre, "stroke-width": 3 }, g);
        EMB.texte(g, t ? "tire à 0" : "relâche", [xs - 20, 326], { taille: 16, ancre: "end", coul: t ? C.ko : C.doux });
        EMB.texte(g, "DATA OUT", [xs, 432], { taille: 12, coul: C.doux, halo: false });
        // entrée qui lit la ligne
        EMB.el("line", { x1: x + 60, y1: 150, x2: x + 60, y2: 300, stroke: cl, "stroke-width": 2 }, g);
        EMB.el("circle", { cx: x + 60, cy: 150, r: 4, fill: cl }, g);
        EMB.el("polygon", { points: [[x + 45, 300], [x + 75, 300], [x + 60, 330]].join(" "), fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g);
        EMB.texte(g, "DATA IN : " + v, [x + 60, 352], { taille: 13, coul: C.doux, halo: false });
      });
      var n = tire.filter(function (t) { return t; }).length;
      zone.textContent = n ? n + " circuit" + (n > 1 ? "s tirent" : " tire") + " la ligne à la masse : SDA = 0 (niveau dominant)." : "Tous les circuits relâchent : la résistance RP tire la ligne à +VDD, SDA = 1 (niveau récessif).";
    }
    dessiner();
  })();

  /* ---------- Figure 2 : une carte en I2C ---------- */
  (function () {
    var f = R.figure("fig-topologie", {
      largeur: 960, hauteur: 420,
      titre: "Circuits I2C sur une même carte",
      essai: "<strong>Essaie</strong> : touche chaque bouton. <strong>Observe</strong> : tous les circuits se branchent sur les deux mêmes fils, tirés à Vcc par deux résistances ; un pont relie le bus I2C à un autre bus (SPI, UART, USB)."
    });
    var g = EMB.el("g", null, f.svg), vue = 0, b = R.boutons(f.reglages), btns = [];
    ["Périphériques I2C", "Microcontrôleurs", "Ponts"].forEach(function (t, i) { btns.push(R.bouton(b, t, function () { vue = i + 1; dessiner(); })); });
    function dessiner() {
      EMB.vider(g);
      btns.forEach(function (x, i) { x.classList.toggle("actif", vue === i + 1); });
      var Y1 = 190, Y2 = 240;
      [Y1, Y2].forEach(function (y) { EMB.el("line", { x1: 200, y1: y, x2: 780, y2: y, stroke: C.encre, "stroke-width": 3 }, g); });
      EMB.texte(g, "SDA", [220, Y1 - 14], { taille: 14, coul: C.doux }); EMB.texte(g, "SCL", [220, Y2 + 18], { taille: 14, coul: C.doux });
      EMB.el("line", { x1: 640, y1: 30, x2: 720, y2: 30, stroke: C.encre, "stroke-width": 2.5 }, g); EMB.texte(g, "Vcc", [740, 30], { taille: 15, ancre: "start" });
      [[660, Y1], [700, Y2]].forEach(function (r) { EMB.el("line", { x1: r[0], y1: 30, x2: r[0], y2: 60, stroke: C.encre, "stroke-width": 2 }, g); EMB.el("rect", { x: r[0] - 9, y: 60, width: 18, height: 44, fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g); EMB.el("line", { x1: r[0], y1: 104, x2: r[0], y2: r[1], stroke: C.encre, "stroke-width": 2 }, g); EMB.el("circle", { cx: r[0], cy: r[1], r: 5, fill: C.encre }, g); });
      var P = [["I²C A/D or D/A\nConvertors", 300, 40], ["I²C LED\nControlers", 470, 40], ["I²C Temperature\nSensors", 300, 300], ["I²C Serial\nEEPROMs", 470, 300]];
      P.forEach(function (p) {
        EMB.bloc(g, p[1], p[2], 150, 80, p[0], { taille: 15, actif: vue === 1, fill: vue === 1 ? undefined : "#e6e8ee" });
        var x = p[1] + 75, yb = p[2] < Y1 ? p[2] + 80 : p[2];
        EMB.el("line", { x1: x - 18, y1: yb, x2: x - 18, y2: Y1, stroke: C.encre, "stroke-width": 2 }, g); EMB.el("circle", { cx: x - 18, cy: Y1, r: 4.5, fill: C.encre }, g);
        EMB.el("line", { x1: x + 18, y1: yb, x2: x + 18, y2: Y2, stroke: C.encre, "stroke-width": 2 }, g); EMB.el("circle", { cx: x + 18, cy: Y2, r: 4.5, fill: C.encre }, g);
      });
      EMB.bloc(g, 780, 165, 150, 100, "MCUs\n(with I²C)", { taille: 16, actif: vue === 2, fill: vue === 2 ? undefined : "#e6e8ee" });
      EMB.bloc(g, 60, 165, 140, 100, "Bridges\n(with I²C)", { taille: 16, actif: vue === 3, fill: vue === 3 ? undefined : "#e6e8ee" });
      EMB.fleche(g, [10, 215], [60, 215], { double: true, ep: 5, coul: vue === 3 ? C.acc : C.gris });
      EMB.texte(g, "SPI\nUART", [30, 160], { taille: 14 }); EMB.texte(g, "USB", [30, 262], { taille: 14 });
    }
    dessiner();
  })();
})();
