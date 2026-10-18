(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Un chiffre hexadécimal pour quatre bits ; adresses des registres ---------- */
  (function () {
    var f = R.figure("fig-hexa", {
      largeur: 860, hauteur: 440,
      titre: "Octet en binaire et en hexadécimal, adresse du registre de la broche n",
      essai: "<strong>Essaie</strong> : touche les bits pour écrire 0xB2, puis 0x5E. Fais varier la broche n. " +
        "<strong>Observe</strong> : chaque groupe de quatre bits donne un seul chiffre, de 0 à F. D'une broche à la suivante, l'adresse avance de 0x4, car un registre 32 bits occupe 4 octets."
    });
    var g = EMB.el("g", null, f.svg);
    var bits = [0, 0, 0, 1, 0, 0, 0, 0];
    var cn = R.curseur(f.reglages, { nom: "Broche n", min: 0, max: 7, pas: 1, val: 1, dec: 0 });
    cn.surChange(dessin);
    function hx(v, n) { var s = v.toString(16).toUpperCase(); while (s.length < (n || 1)) s = "0" + s; return s; }
    function dessin() {
      EMB.vider(g);
      var W = 62, H = 76, Y = 80, XQ = [30, 30 + 4 * W + 34];
      [0, 1].forEach(function (q) {
        var bq = bits.slice(4 * q, 4 * q + 4), v = bq.reduce(function (s, x) { return s * 2 + x; }, 0);
        bq.forEach(function (b, i) {
          var k = 4 * q + i, x = XQ[q] + i * W;
          EMB.el("rect", { x: x, y: Y, width: W, height: H, fill: b ? EMB.teinte(0.3) : "#fff", stroke: C.encre, "stroke-width": 2 }, g);
          EMB.texte(g, String(b), [x + W / 2, Y + H / 2 + 2], { taille: 32, mono: true, halo: false });
          EMB.texte(g, String(7 - k), [x + W / 2, Y - 18], { taille: 16, mono: true, coul: C.doux, gras: false });
          var z = EMB.el("rect", { x: x, y: Y - 30, width: W, height: H + 34, fill: "transparent", style: "cursor:pointer" }, g);
          z.addEventListener("click", function () { bits[k] = 1 - bits[k]; dessin(); });
        });
        EMB.el("rect", { x: XQ[q], y: Y, width: 4 * W, height: H, fill: "none", stroke: C.encre, "stroke-width": 3 }, g);
        EMB.el("path", { d: "M" + (XQ[q] + 4) + " " + (Y + H + 12) + " q0 14 14 14 h" + (4 * W - 36) + " q14 0 14 -14", fill: "none", stroke: C.acc, "stroke-width": 3 }, g);
        EMB.texte(g, hx(v), [XQ[q] + 2 * W, Y + H + 56], { taille: 42, mono: true, coul: C.acc });
        EMB.texte(g, "= " + v, [XQ[q] + 2 * W, Y + H + 94], { taille: 18, mono: true, coul: C.doux, gras: false });
      });
      var val = bits.reduce(function (s, x) { return s * 2 + x; }, 0);
      EMB.texte(g, "0x" + hx(val, 2) + " = " + Math.floor(val / 16) + " × 16 + " + (val % 16) + " = " + val, [282, 300], { taille: 24, mono: true });
      // table des chiffres
      EMB.texte(g, "A = 10   B = 11   C = 12   D = 13   E = 14   F = 15", [282, 346], { taille: 17, mono: true, coul: C.doux, gras: false });
      // adresses : 0x88 + 0x4·n
      var xa = 680;
      EMB.texte(g, "registre de la broche n", [xa + 55, 40], { taille: 19 });
      for (var k = 0; k < 4; k++) {
        var n = Math.max(0, Math.min(4, cn.v - 1)) + k, y = 74 + k * 82, actif = n === cn.v;
        if (n > 7) break;
        EMB.bloc(g, xa - 50, y, 90, 60, "n = " + n, { taille: 19, mono: true, fill: C.fond });
        EMB.bloc(g, xa + 52, y, 118, 60, "0x" + hx(0x88 + 4 * n, 2), { taille: 25, mono: true, actif: actif });
      }
      R.rendre(f.direct, "\\texttt{0x" + hx(val, 2) + "} = " + bits.slice(0, 4).join("") + "\\ " + bits.slice(4).join("") + "_2 = " + val +
        " \\qquad \\texttt{0x88} + \\texttt{0x4} \\times " + cn.v + " = \\texttt{0x" + hx(0x88 + 4 * cn.v, 2) + "}");
    }
    dessin();
  })();
})();
