(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure : composer GPIO_PINn_REG (diapositive 18) ---------- */
  (function () {
    var f = R.figure("fig-registre", {
      largeur: 960, hauteur: 400,
      titre: "Registre GPIO_PINn_REG",
      essai: "<strong>Essaie</strong> : choisis la broche n, coche les bits de INT_ENA, choisis INT_TYPE et PAD_DRIVER. <strong>Observe</strong> : chaque champ remplit ses propres bits ; la valeur du mot est la somme des champs décalés ; le décalage du registre avance de 4 à chaque broche.",
      direct: true
    });
    var NS = []; [[0, 19], [21, 23], [25, 27], [32, 39]].forEach(function (p) { for (var i = p[0]; i <= p[1]; i++) NS.push(i); });
    var CH = [["réservé", 31, 18], ["INT_ENA", 17, 13], ["réservé", 12, 11], ["WAKEUP_ENABLE", 10, 10], ["INT_TYPE", 9, 7], ["réservé", 6, 3], ["PAD_DRIVER", 2, 2], ["réservé", 1, 0]];
    var v = { n: 4, ena: [false, false, true, false], wake: false, type: 2, pad: 0 };
    var b = R.boutons(f.reglages);
    var sN = R.choix(b, NS.map(function (k) { return [k, "n = " + k]; }), function () { v.n = +sN.value; dessiner(); }); sN.value = "4";
    var sT = R.choix(b, [0, 1, 2, 3, 4, 5].map(function (k) { return [k, "INT_TYPE = " + k]; }), function () { v.type = +sT.value; dessiner(); }); sT.value = "2";
    var sP = R.choix(b, [[0, "PAD_DRIVER = 0 (normale)"], [1, "PAD_DRIVER = 1 (drain ouvert)"]], function () { v.pad = +sP.value; dessiner(); });
    var b2 = R.boutons(f.reglages), cases = [];
    ["bit0 APP", "bit1 APP NMI", "bit2 PRO", "bit3 PRO NMI"].forEach(function (t, i) { cases.push(R.bascule(b2, "INT_ENA " + t, v.ena[i], function () { v.ena[i] = cases[i].checked; dessiner(); })); });
    var cW = R.bascule(b2, "WAKEUP_ENABLE", false, function () { v.wake = cW.checked; dessiner(); });
    var g = EMB.el("g", null, f.svg), X0 = 64, W = 26, Y = 120, H = 56;
    function xb(k) { return X0 + (31 - k) * W; }
    function dessiner() {
      EMB.vider(g);
      var ena = v.ena.reduce(function (s, x, i) { return s + (x ? 1 << i : 0); }, 0);
      var bits = []; for (var k = 0; k < 32; k++) bits.push(0);
      function poser(val, bas, nb) { for (var i = 0; i < nb; i++) bits[bas + i] = (val >> i) & 1; }
      poser(ena, 13, 5); poser(v.wake ? 1 : 0, 10, 1); poser(v.type, 7, 3); poser(v.pad, 2, 1);
      var val = ena * 8192 + (v.wake ? 1024 : 0) + v.type * 128 + v.pad * 4;
      EMB.texte(g, "GPIO_PIN" + v.n + "_REG", [480, 40], { taille: 24, mono: true });
      EMB.texte(g, "décalage 0x88 + 0x4 × " + v.n + " = 0x" + EMB.hexa(0x88 + 4 * v.n, 2), [480, 76], { taille: 18, mono: true, coul: C.doux, gras: false });
      CH.forEach(function (c, ci) {
        var mod = c[0] !== "réservé";
        for (var k = c[1]; k >= c[2]; k--) {
          EMB.el("rect", { x: xb(k), y: Y, width: W, height: H, fill: mod ? (bits[k] ? C.clair : "#fff") : "#eef0f5", stroke: C.encre, "stroke-width": 1.2 }, g);
          EMB.texte(g, String(bits[k]), [xb(k) + W / 2, Y + H / 2 + 1], { taille: 19, mono: true, coul: mod ? (bits[k] ? C.acc : C.encre) : C.gris, halo: false });
        }
        EMB.el("rect", { x: xb(c[1]), y: Y, width: (c[1] - c[2] + 1) * W, height: H, fill: "none", stroke: mod ? C.acc : C.encre, "stroke-width": mod ? 3 : 2 }, g);
        EMB.texte(g, String(c[1]), [xb(c[1]) + W / 2, Y - 14], { taille: 13, mono: true, coul: C.doux, gras: false, halo: false });
        if (c[2] !== c[1]) EMB.texte(g, String(c[2]), [xb(c[2]) + W / 2, Y - 14], { taille: 13, mono: true, coul: C.doux, gras: false, halo: false });
      });
      [["INT_ENA", 17, 13, ena, 230], ["WAKEUP_ENABLE", 10, 10, v.wake ? 1 : 0, 262], ["INT_TYPE", 9, 7, v.type, 294], ["PAD_DRIVER", 2, 2, v.pad, 326]].forEach(function (e) {
        var cx = xb(e[1]) + (e[1] - e[2] + 1) * W / 2;
        EMB.el("polyline", { points: cx + "," + (Y + H) + " " + cx + "," + e[4] + " 330," + e[4], fill: "none", stroke: C.gris, "stroke-width": 1.8 }, g);
        EMB.texte(g, "GPIO_PINn_" + e[0] + " = " + e[3], [320, e[4]], { taille: 16, mono: true, ancre: "end" });
      });
      EMB.texte(g, "valeur = 0x" + EMB.hexa(val, 8), [940, 370], { taille: 22, mono: true, coul: C.acc, ancre: "end" });
      R.rendre(f.direct, "\\text{valeur} = " + ena + " \\times 2^{13} + " + (v.wake ? 1 : 0) + " \\times 2^{10} + " + v.type + " \\times 2^{7} + " + v.pad + " \\times 2^{2} = " + val + " = \\texttt{0x" + EMB.hexa(val, 8) + "}");
    }
    dessiner();
  })();
})();
