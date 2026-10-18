(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure 1 : la trame d'un octet ---------- */
  (function () {
    var f = R.figure("fig-trame", {
      largeur: 960, hauteur: 420,
      titre: "Trame UART d'un octet sur la broche TX",
      essai: "<strong>Essaie</strong> : change l'octet avec le curseur, puis le débit. <strong>Observe</strong> : le start bit est toujours à 0 et le stop bit à 1 ; les bits de données sortent dans l'ordre bit 0, bit 1… ; le débit ne change pas la forme, seulement la durée."
    });
    var g = EMB.el("g", null, f.svg);
    var cv = R.curseur(f.reglages, { nom: "Octet", min: 0, max: 255, pas: 1, val: 75, surChange: dessiner });
    var debit = 9600, b = R.boutons(f.reglages), btns = {};
    [9600, 115200].forEach(function (d) { btns[d] = R.bouton(b, d + " bps", function () { debit = d; dessiner(); }); });
    var zone = R.h("div", null, "", f.direct);
    var X0 = 70, PAS = 68, NOMS = ["repos", "start", "bit 0", "bit 1", "bit 2", "bit 3", "bit 4", "bit 5", "bit 6", "bit 7", "stop", "repos"];
    function dessiner() {
      EMB.vider(g);
      Object.keys(btns).forEach(function (k) { btns[k].classList.toggle("actif", +k === debit); });
      var v = cv.v, bits = [1, 0], k;
      for (k = 0; k < 8; k++) bits.push((v >> k) & 1);
      bits.push(1, 1);
      bits.forEach(function (x, i) {
        var xx = X0 + i * PAS, fixe = i === 0 || i === 11, cadre = i === 1 || i === 10;
        EMB.el("rect", { x: xx + 4, y: 30, width: PAS - 8, height: 60, rx: 8, fill: fixe ? C.fond : cadre ? C.clair : "#fff", stroke: fixe ? C.pale : C.encre, "stroke-width": 2 }, g);
        EMB.texte(g, String(x), [xx + PAS / 2, 61], { taille: 26, mono: true, halo: false, coul: fixe ? C.gris : C.encre });
        EMB.texte(g, NOMS[i], [xx + PAS / 2, 300], { taille: 15, coul: cadre ? C.acc : C.doux, gras: cadre });
        if (i) EMB.el("line", { x1: xx, y1: 140, x2: xx, y2: 270, stroke: C.pale, "stroke-width": 1 }, g);
      });
      EMB.texte(g, "1", [X0 - 22, 150], { taille: 16, mono: true, coul: C.doux });
      EMB.texte(g, "0", [X0 - 22, 250], { taille: 16, mono: true, coul: C.doux });
      EMB.texte(g, "TX", [X0 - 50, 200], { taille: 16, coul: C.doux });
      EMB.onde(g, X0, 150, PAS, 100, bits, { coul: C.acc, ep: 4, fronts: true });
      var tb = 1 / debit, tt = 10 * tb;
      EMB.el("path", { d: "M" + (X0 + PAS) + " 330 v12 h" + 10 * PAS + " v-12", fill: "none", stroke: C.encre, "stroke-width": 2 }, g);
      EMB.texte(g, "une trame : 10 bits = " + (tt * 1000 >= 0.1 ? EMB.virgule(+(tt * 1000).toFixed(3)) + " ms" : EMB.virgule(+(tt * 1e6).toFixed(1)) + " µs"), [X0 + 6 * PAS, 372], { taille: 18 });
      R.rendre(zone, "\\text{octet} = " + v + " = " + EMB.binaire(v, 8) + "_2 \\qquad t_{bit} = \\frac{1}{" + debit + "} \\qquad t_{trame} = \\frac{10}{" + debit + "} = " + R.tn(tt * 1e6, 1) + "\\ \\mu\\text{s}");
    }
    dessiner();
  })();

  /* ---------- Figure 2 : half duplex et full duplex ---------- */
  (function () {
    var f = R.figure("fig-duplex", {
      largeur: 960, hauteur: 330,
      titre: "Half duplex et full duplex",
      essai: "<strong>Essaie</strong> : passe de « Full duplex » à « Half duplex », puis touche « Changer de sens ». <strong>Observe</strong> : en half duplex, un seul sens est actif à la fois ; en full duplex, les deux le sont ensemble."
    });
    var g = EMB.el("g", null, f.svg), mode = "full", sens = 0, b = R.boutons(f.reglages);
    var bf = R.bouton(b, "Full duplex", function () { mode = "full"; dessiner(); });
    var bh = R.bouton(b, "Half duplex", function () { mode = "half"; dessiner(); });
    var bs = R.bouton(b, "Changer de sens", function () { sens = 1 - sens; dessiner(); });
    function dessiner() {
      EMB.vider(g);
      bf.classList.toggle("actif", mode === "full"); bh.classList.toggle("actif", mode === "half"); bs.disabled = mode === "full";
      EMB.bloc(g, 40, 60, 220, 200, "Holter ECG", { taille: 24 });
      EMB.bloc(g, 700, 60, 220, 200, "PC", { taille: 24 });
      var a1 = mode === "full" || sens === 0, a2 = mode === "full" || sens === 1;
      EMB.fleche(g, [260, 120], [700, 120], { coul: a1 ? C.acc : C.pale, ep: 5 });
      EMB.fleche(g, [700, 200], [260, 200], { coul: a2 ? C.v : C.pale, ep: 5 });
      EMB.texte(g, "données ECG", [480, 96], { taille: 18, coul: a1 ? C.acc : C.gris });
      EMB.texte(g, "commandes", [480, 228], { taille: 18, coul: a2 ? C.v : C.gris });
      EMB.texte(g, mode === "full" ? "les deux sens en même temps" : "un seul sens à la fois", [480, 300], { taille: 20 });
    }
    dessiner();
  })();
})();
