(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure : broches I2C et SPI sur la carte DEV KIT V1 ---------- */
  (function () {
    var f = R.figure("fig-bus", {
      largeur: 960, hauteur: 600,
      titre: "Broches I2C et SPI de l'ESP32",
      essai: "<strong>Essaie</strong> : affiche l'I2C par défaut, VSPI, HSPI, puis choisis toi-même SDA et SCL. <strong>Observe</strong> : les broches par défaut sont fixées, mais l'I2C accepte d'autres broches ; l'appel Wire.begin(SDA, SCL) suit ton choix. Une broche 34 à 39 ne convient pas : SDA et SCL doivent pouvoir tirer la ligne à 0.",
      direct: true
    });
    var G = ["EN", "36", "39", "34", "35", "32", "33", "25", "26", "27", "14", "12", "13", "GND", "VIN"];
    var D = ["23", "22", "1", "3", "21", "19", "18", "5", "17", "16", "4", "2", "15", "GND", "3.3V"];
    var MODES = {
      "I2C par défaut": { "21": "SDA", "22": "SCL" },
      "VSPI (SPI3)": { "23": "MOSI", "19": "MISO", "18": "CLK", "5": "CS" },
      "HSPI (SPI2)": { "13": "MOSI", "12": "MISO", "14": "CLK", "15": "CS" }
    };
    var mode = "I2C par défaut", b = R.boutons(f.reglages), btns = {};
    Object.keys(MODES).concat(["I2C au choix"]).forEach(function (m) { btns[m] = R.bouton(b, m, function () { mode = m; dessiner(); }); });
    var b2 = R.boutons(f.reglages);
    var nums = G.concat(D).filter(function (p) { return /^\d+$/.test(p); }).sort(function (x, y) { return x - y; });
    R.h("span", { "class": "etape-texte" }, "SDA :", b2);
    var sSda = R.choix(b2, nums.map(function (p) { return [p, "GPIO " + p]; }), function () { mode = "I2C au choix"; dessiner(); }); sSda.value = "16";
    R.h("span", { "class": "etape-texte" }, "SCL :", b2);
    var sScl = R.choix(b2, nums.map(function (p) { return [p, "GPIO " + p]; }), function () { mode = "I2C au choix"; dessiner(); }); sScl.value = "17";
    var g = EMB.el("g", null, f.svg);
    function y(i) { return 52 + i * 36; }
    function dessiner() {
      EMB.vider(g);
      Object.keys(btns).forEach(function (m) { btns[m].classList.toggle("actif", m === mode); });
      var marques = {};
      if (mode === "I2C au choix") { marques[sSda.value] = "SDA"; marques[sScl.value] = (marques[sScl.value] ? marques[sScl.value] + " + " : "") + "SCL"; }
      else marques = MODES[mode];
      EMB.el("rect", { x: 400, y: 22, width: 160, height: 556, rx: 14, fill: "#2b2f3a" }, g);
      EMB.el("rect", { x: 418, y: 38, width: 124, height: 160, rx: 6, fill: "#c9ced8", stroke: "#8a91a0", "stroke-width": 2 }, g);
      EMB.texte(g, "ESP-WROOM-32", [480, 118], { taille: 13, halo: false });
      [[G, 400, -1], [D, 560, 1]].forEach(function (cote) {
        cote[0].forEach(function (p, i) {
          var yy = y(i), num = /^\d+$/.test(p), m = marques[p], gpi = ["34", "35", "36", "39"].indexOf(p) >= 0;
          EMB.el("circle", { cx: cote[1], cy: yy, r: 7, fill: "#d9b44a", stroke: "#2b2f3a", "stroke-width": 2 }, g);
          var bx = cote[2] < 0 ? 300 : 570, mauvais = m && gpi;
          EMB.el("rect", { x: bx, y: yy - 15, width: 90, height: 30, rx: 7, fill: m ? (mauvais ? C.ko : C.acc) : (num ? "#fff" : "#eef0f5"), stroke: m ? (mauvais ? C.ko : C.acc) : C.gris, "stroke-width": m ? 2.5 : 1.5 }, g);
          EMB.texte(g, num ? "GPIO" + p : p, [bx + 45, yy + 1], { taille: 15, mono: true, coul: m ? "#fff" : C.encre, halo: false });
          if (m) {
            var xa = cote[2] < 0 ? 290 : 670, xb = cote[2] < 0 ? 170 : 790;
            EMB.el("line", { x1: xa, y1: yy, x2: xb, y2: yy, stroke: mauvais ? C.ko : C.acc, "stroke-width": 3 }, g);
            EMB.bloc(g, cote[2] < 0 ? 40 : 790, yy - 17, 130, 34, m, { taille: 16, mono: true, actif: !mauvais, stroke: mauvais ? C.ko : null, rx: 8 });
          }
        });
      });
      var txt;
      if (mode === "I2C au choix") {
        var a = sSda.value, c = sScl.value, pb = ["34", "35", "36", "39"].filter(function (p) { return p === a || p === c; });
        txt = "<p><code>Wire.begin(" + a + ", " + c + ");</code> " + (a === c ? "SDA et SCL ne peuvent pas partager la même broche." : pb.length ? "GPIO " + pb.join(" et ") + " : entrée seulement, elle ne peut pas tirer la ligne à 0. Choisis une autre broche." : "SDA sur GPIO " + a + ", SCL sur GPIO " + c + ".") + "</p>";
      } else if (mode === "I2C par défaut") txt = "<p>Avec l'IDE Arduino : SDA sur GPIO 21, SCL sur GPIO 22. Deux canaux I2C au total.</p>";
      else txt = "<p>" + mode + " : MOSI, MISO, CLK et une des trois lignes CS du bus. Jusqu'à trois esclaves par bus.</p>";
      f.direct.innerHTML = txt;
    }
    dessiner();
  })();
})();
