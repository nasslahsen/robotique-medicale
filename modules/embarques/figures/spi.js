(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure 1 : l'anneau des deux registres à décalage ---------- */
  (function () {
    var f = R.figure("fig-anneau", {
      largeur: 960, hauteur: 560,
      titre: "Échange SPI entre un maître et un esclave",
      essai: "<strong>Essaie</strong> : avance coup d'horloge par coup d'horloge, ou choisis un autre octet pour le maître. <strong>Observe</strong> : les bits rouges (du maître) passent chez l'esclave pendant que les bleus (de l'esclave) passent chez le maître ; à T = 8 l'échange est complet. Les états à T = 1, 2 et 8 sont ceux des diapositives."
    });
    var g = EMB.el("g", null, f.svg), T = 0, m, s;
    var depM = "10101010", depS = "11000011";
    function init() { m = depM.split("").map(function (b) { return { v: b, o: "m" }; }); s = depS.split("").map(function (b) { return { v: b, o: "s" }; }); }
    function coup() { var a = m[0], b = s[7]; m = m.slice(1).concat([b]); s = [a].concat(s.slice(0, 7)); }
    var et = R.etapes(f.reglages, 8, ["départ", "T = 1", "T = 2", "T = 3", "T = 4", "T = 5", "T = 6", "T = 7", "T = 8, échange complet"], function (k) { init(); for (var i = 0; i < k; i++) coup(); T = k; dessiner(); });
    var b = R.boutons(f.reglages);
    R.bouton(b, "Maître 10101010 (cours)", function () { depM = "10101010"; depS = "11000011"; et.aller(0); });
    R.bouton(b, "Maître 11110000, esclave 00110011", function () { depM = "11110000"; depS = "00110011"; et.aller(0); });
    var zone = R.h("p", null, "", f.direct);
    var MX = 90, SX = 560, W = 40, MY = 330, SY = 100;
    function reg(x, y, bits) {
      bits.forEach(function (bt, k) {
        EMB.el("rect", { x: x + k * W, y: y, width: W, height: 56, fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g);
        EMB.texte(g, bt.v, [x + k * W + W / 2, y + 29], { taille: 28, mono: true, halo: false, coul: bt.o === "m" ? C.ko : C.acc });
      });
      EMB.el("rect", { x: x, y: y, width: 8 * W, height: 56, fill: "none", stroke: C.encre, "stroke-width": 3 }, g);
    }
    function dessiner() {
      EMB.vider(g);
      [470, 500].forEach(function (x) { EMB.el("line", { x1: x, y1: 70, x2: x, y2: 470, stroke: C.encre, "stroke-width": 4 }, g); });
      EMB.texte(g, "Maître SPI", [250, 290], { taille: 24 }); EMB.texte(g, "Esclave SPI", [720, 50], { taille: 24 });
      EMB.el("polyline", { points: [[MX, MY + 28], [50, MY + 28], [50, SY + 28], [SX - 14, SY + 28]].join(" "), fill: "none", stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.fleche(g, [SX - 40, SY + 28], [SX, SY + 28], { ep: 2.5 });
      EMB.el("polyline", { points: [[SX + 8 * W, SY + 28], [920, SY + 28], [920, MY + 28], [MX + 8 * W + 14, MY + 28]].join(" "), fill: "none", stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.fleche(g, [MX + 8 * W + 50, MY + 28], [MX + 8 * W, MY + 28], { ep: 2.5 });
      EMB.el("line", { x1: 50, y1: 440, x2: 720, y2: 440, stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.fleche(g, [250, 440], [250, MY + 56], { ep: 2.5 });
      EMB.el("line", { x1: 720, y1: 440, x2: 720, y2: SY + 80, stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.fleche(g, [720, SY + 100], [720, SY + 56], { ep: 2.5 });
      [["MOSI", SY + 28], ["MISO", MY + 28], ["SCK", 440]].forEach(function (l) {
        [470, 500].forEach(function (x) { EMB.el("rect", { x: x - 8, y: l[1] - 8, width: 16, height: 16, fill: "#fff", stroke: C.encre, "stroke-width": 2 }, g); });
        EMB.texte(g, l[0], [485, l[1] - 28], { taille: 17, coul: C.acc });
      });
      EMB.texte(g, "Sortie", [436, SY + 50], { taille: 14, coul: C.ko }); EMB.texte(g, "Entrée", [534, SY + 50], { taille: 14, coul: C.acc });
      EMB.texte(g, "Entrée", [438, MY + 50], { taille: 14, coul: C.ko }); EMB.texte(g, "Sortie", [534, MY + 50], { taille: 14, coul: C.acc });
      EMB.texte(g, "Registre à décalage", [MX + 160, MY - 22], { taille: 15, coul: C.doux, gras: false });
      reg(MX, MY, m); reg(SX, SY, s);
      EMB.texte(g, "MSB", [MX, MY + 76], { taille: 15, ancre: "start", coul: C.doux });
      EMB.texte(g, "MSB", [SX + 8 * W, SY - 16], { taille: 15, ancre: "end", coul: C.doux });
      for (var k = 0; k < 8; k++) EMB.el("path", { d: "M" + (60 + k * 44) + " 530 v-34 h22 v34 h22", fill: "none", stroke: k < T ? C.acc : C.pale, "stroke-width": 3 }, g);
      EMB.texte(g, "Horloge SPI    T = " + T, [440, 514], { taille: 22, mono: true, ancre: "start" });
      zone.innerHTML = "Maître : <span class='mono'>" + m.map(function (x) { return x.v; }).join("") + "</span> &nbsp; Esclave (dessiné MSB à droite) : <span class='mono'>" + s.map(function (x) { return x.v; }).join("") + "</span>";
    }
    init(); dessiner();
  })();

  /* ---------- Figure 2 : SPI du PIC18F4520 ---------- */
  (function () {
    var f = R.figure("fig-pic", {
      largeur: 960, hauteur: 400,
      titre: "SPI entre deux PIC18F4520",
      essai: "<strong>Essaie</strong> : touche chaque bouton. <strong>Observe</strong> : SDO du maître va sur SDI de l'esclave et inversement ; seul le maître fournit SCK ; l'octet reçu passe du registre à décalage SSPSR au tampon SSPBUF."
    });
    var g = EMB.el("g", null, f.svg), vue = 0, b = R.boutons(f.reglages), btns = [];
    ["Données", "Horloge", "Tampon"].forEach(function (t, i) { btns.push(R.bouton(b, t, function () { vue = i + 1; dessiner(); })); });
    function dessiner() {
      EMB.vider(g);
      btns.forEach(function (x, i) { x.classList.toggle("actif", vue === i + 1); });
      [[30, "SPI Master SSPM3:SSPM0 = 00xx", "PROCESSOR 1"], [530, "SPI Slave SSPM3:SSPM0 = 010x", "PROCESSOR 2"]].forEach(function (p) {
        EMB.bloc(g, p[0], 30, 400, 340, "", { tirets: "8 6", fill: "#fafbfd" });
        EMB.texte(g, p[1], [p[0] + 200, 56], { taille: 16, mono: true });
        EMB.texte(g, p[2], [p[0] + 200, 350], { taille: 16 });
        EMB.bloc(g, p[0] + 90, 90, 220, 66, "Serial Input Buffer\n(SSPBUF)", { taille: 16, actif: vue === 3 });
        EMB.bloc(g, p[0] + 90, 220, 220, 66, "Shift Register\n(SSPSR)", { taille: 16, actif: vue === 1 || vue === 3 });
        EMB.texte(g, "MSb", [p[0] + 100, 302], { taille: 13, coul: C.doux, ancre: "start" }); EMB.texte(g, "LSb", [p[0] + 300, 302], { taille: 13, coul: C.doux, ancre: "end" });
        EMB.fleche(g, [p[0] + 200, 220], [p[0] + 200, 156], { ep: vue === 3 ? 5 : 3, coul: vue === 3 ? C.acc : C.encre });
      });
      var cd = vue === 1 ? C.acc : C.encre, ck = vue === 2 ? C.acc : C.encre;
      EMB.el("polyline", { points: [[120, 253], [70, 253], [70, 80], [900, 80], [900, 253], [870, 253]].join(" "), fill: "none", stroke: cd, "stroke-width": vue === 1 ? 4 : 2.5 }, g);
      EMB.fleche(g, [875, 253], [840, 253], { coul: cd, ep: vue === 1 ? 4 : 2.5 });
      EMB.texte(g, "SDO", [400, 66], { taille: 15, coul: cd }); EMB.texte(g, "SDI", [560, 66], { taille: 15, coul: cd });
      EMB.el("line", { x1: 620, y1: 253, x2: 340, y2: 253, stroke: cd, "stroke-width": vue === 1 ? 4 : 2.5 }, g);
      EMB.fleche(g, [370, 253], [340, 253], { coul: cd, ep: vue === 1 ? 4 : 2.5 });
      EMB.texte(g, "SDI", [372, 236], { taille: 15, coul: cd }); EMB.texte(g, "SDO", [588, 236], { taille: 15, coul: cd });
      EMB.fleche(g, [380, 316], [620, 316], { coul: ck, ep: vue === 2 ? 4 : 2.5 });
      EMB.texte(g, "SCK", [372, 300], { taille: 15, coul: ck }); EMB.texte(g, "Serial Clock", [500, 300], { taille: 14, coul: ck, gras: false }); EMB.texte(g, "SCK", [640, 300], { taille: 15, coul: ck });
    }
    dessiner();
  })();
})();
