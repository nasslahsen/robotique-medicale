(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure 1 : l'escalier du DAC 8 bits ---------- */
  (function () {
    var f = R.figure("fig-dac", {
      largeur: 960, hauteur: 460,
      titre: "Tension de sortie d'un canal DAC",
      essai: "<strong>Essaie</strong> : déplace PDACn_DAC, change la référence, puis active le zoom. <strong>Observe</strong> : la sortie est proportionnelle au nombre écrit ; vue de près, elle avance par marches de VDD3P3_RTC / 255 ; baisser la référence abaisse tout l'escalier.",
      direct: true
    });
    var cP = R.curseur(f.reglages, { nom: "PDACn_DAC", min: 0, max: 255, pas: 1, val: 200, surChange: dessiner });
    var cR = R.curseur(f.reglages, { nom: "VDD3P3_RTC [V]", min: 3, max: 3.3, pas: 0.05, val: 3.3, dec: 2, surChange: dessiner });
    var zoom = R.bascule(R.boutons(f.reglages), "Zoom sur 8 marches", false, dessiner);
    var g = EMB.el("g", null, f.svg);
    function dessiner() {
      EMB.vider(g);
      var P = cP.v, V = cR.v, out = V * P / 255, z = zoom.checked;
      var c0 = z ? Math.max(0, Math.min(247, P - 4)) : 0, c1 = z ? c0 + 8 : 255;
      var v0 = z ? V * c0 / 255 : 0, v1 = z ? V * c1 / 255 : 3.3;
      function X(c) { return 120 + (c - c0) / (c1 - c0) * 500; }
      function Y(v) { return 400 - (v - v0) / (v1 - v0) * 340; }
      EMB.el("line", { x1: 120, y1: 400, x2: 640, y2: 400, stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.el("line", { x1: 120, y1: 400, x2: 120, y2: 40, stroke: C.encre, "stroke-width": 2.5 }, g);
      [0, 0.25, 0.5, 0.75, 1].forEach(function (u) {
        var c = c0 + u * (c1 - c0), v = v0 + u * (v1 - v0);
        EMB.texte(g, z ? String(c) : String(Math.round(c)), [X(c), 422], { taille: 14, mono: true, gras: false });
        EMB.texte(g, EMB.virgule(v, z ? 3 : 2), [110, Y(v)], { taille: 14, mono: true, gras: false, ancre: "end" });
      });
      EMB.texte(g, "PDACn_DAC", [600, 450], { taille: 15, coul: C.doux });
      EMB.texte(g, "DACn_OUT [V]", [130, 26], { taille: 15, coul: C.doux, ancre: "start" });
      var d = "";
      for (var c = c0; c <= c1; c++) {
        var v = V * c / 255, xa = X(c), xb = X(Math.min(c + 1, c1));
        d += (c === c0 ? "M" : " L") + xa + " " + Y(v) + " L" + xb + " " + Y(v);
      }
      EMB.el("path", { d: d, fill: "none", stroke: C.acc, "stroke-width": 3 }, g);
      EMB.el("circle", { cx: X(P), cy: Y(out), r: 10, fill: C.acc, stroke: "#fff", "stroke-width": 3 }, g);
      EMB.texte(g, EMB.virgule(out, 3) + " V", [X(P) + (P > (c0 + c1) / 2 ? -16 : 16), Y(out) - 22], { taille: 18, coul: C.acc, ancre: P > (c0 + c1) / 2 ? "end" : "start" });
      EMB.texte(g, "PDACn_DAC", [800, 120], { taille: 16, coul: C.doux });
      EMB.bits(g, 680, 140, EMB.binaire(P, 8).split(""), { w: 30, h: 40, taille: 18 });
      EMB.texte(g, "marche : " + EMB.virgule(V / 255 * 1000, 1) + " mV", [800, 230], { taille: 16, coul: C.doux, gras: false });
      R.rendre(f.direct, "DACn\\_OUT = \\frac{" + R.tn(V, 2) + " \\times " + P + "}{255} = " + R.tn(out, 3) + "\\ \\text{V}");
    }
    dessiner();
  })();

  /* ---------- Figure 2 : le schéma d'un canal (diapositive 25) ---------- */
  (function () {
    var f = R.figure("fig-dac-schema", {
      largeur: 960, hauteur: 470,
      titre: "Schéma d'un canal DACn",
      essai: "<strong>Essaie</strong> : bascule SENS_DACn_CW_EN, SENS_DAC_DIG_FORCE et RTCIO_PAD_PDACn_DAC_XPD_FORCE. <strong>Observe</strong> : le chemin coloré montre d'où viennent les 8 bits envoyés au DAC (registre, générateur CW ou DMA) et qui le met en marche.",
      direct: false
    });
    var b = R.boutons(f.reglages);
    var sCW = R.bascule(b, "SENS_DACn_CW_EN = 1", false, dessiner);
    var sDig = R.bascule(b, "SENS_DAC_DIG_FORCE = 1", false, dessiner);
    var sX = R.bascule(b, "RTCIO_PAD_PDACn_DAC_XPD_FORCE = 1", true, dessiner);
    var g = EMB.el("g", null, f.svg);
    function mux(x, y, h, haut) {
      EMB.el("polygon", { points: x + "," + y + " " + (x + 34) + "," + (y + 16) + " " + (x + 34) + "," + (y + h - 16) + " " + x + "," + (y + h), fill: "#eef0f5", stroke: C.encre, "stroke-width": 2 }, g);
      EMB.texte(g, "1", [x + 12, y + 22], { taille: 13, mono: true }); EMB.texte(g, "0", [x + 12, y + h - 22], { taille: 13, mono: true });
    }
    function fil(pts, on) { EMB.el("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: on ? C.acc : C.encre, "stroke-width": on ? 4.5 : 2 }, g); }
    function dessiner() {
      EMB.vider(g);
      var cw = sCW.checked, dig = sDig.checked, xp = sX.checked;
      EMB.bloc(g, 40, 70, 150, 50, "CW generator", { taille: 15, actif: !dig && cw });
      EMB.texte(g, "RTCIO_PAD_PDACn_DAC[7:0]", [40, 158], { taille: 13, mono: true, ancre: "start", coul: !dig && !cw ? C.acc : C.encre });
      fil([[190, 95], [290, 95]], !dig && cw); fil([[250, 165], [290, 165]], !dig && !cw);
      mux(290, 70, 120);
      EMB.texte(g, "SENS_DACn_CW_EN", [307, 40], { taille: 13, mono: true }); fil([[307, 52], [307, 78]], false);
      EMB.bloc(g, 380, 40, 90, 44, "DMA", { taille: 15, actif: dig });
      fil([[324, 130], [480, 130]], !dig); fil([[470, 62], [480, 62], [480, 70]], dig);
      mux(480, 40, 120);
      EMB.texte(g, "SENS_DAC_DIG_FORCE", [497, 14], { taille: 13, mono: true }); fil([[497, 24], [497, 48]], false);
      fil([[514, 100], [580, 100], [580, 190], [700, 190]], true);
      EMB.texte(g, "pdacn_dac[7:0]", [640, 176], { taille: 13, mono: true });
      // mise en marche
      EMB.texte(g, "RTCIO_PAD_PDACn_XPD_DAC", [40, 268], { taille: 13, mono: true, ancre: "start", coul: xp ? C.acc : C.encre });
      fil([[260, 280], [480, 280]], xp);
      EMB.bloc(g, 290, 330, 150, 50, "SAR ADC FSM", { taille: 15, actif: !xp });
      fil([[440, 355], [480, 355]], !xp);
      mux(480, 255, 130);
      EMB.texte(g, "RTCIO_PAD_PDACn_DAC_XPD_FORCE", [497, 430], { taille: 13, mono: true }); fil([[497, 372], [497, 418]], false);
      fil([[514, 320], [700, 320]], true);
      EMB.texte(g, "pdacn_xpd_dac", [610, 306], { taille: 13, mono: true });
      EMB.texte(g, "pdac_clk", [610, 366], { taille: 13, mono: true }); fil([[570, 380], [700, 380]], false);
      EMB.bloc(g, 700, 160, 120, 250, "DACn", { taille: 20, actif: true });
      EMB.fleche(g, [820, 285], [940, 285], { ep: 3.5, coul: C.acc });
      EMB.texte(g, "dacn_out", [880, 266], { taille: 14, mono: true });
      // aperçu de la sortie
      EMB.el("rect", { x: 835, y: 320, width: 115, height: 80, rx: 8, fill: "#fff", stroke: C.pale, "stroke-width": 2 }, g);
      var p = "";
      for (var x = 0; x <= 100; x += 3) p += (x ? " L" : "M") + (842 + x) + " " + (!dig && cw ? 360 - 25 * Math.cos(x / 100 * 4 * Math.PI) : 350);
      EMB.el("path", { d: p, fill: "none", stroke: C.acc, "stroke-width": 3 }, g);
      EMB.texte(g, dig ? "données du DMA" : cw ? "cosinus" : "valeur du registre", [892, 420], { taille: 13, coul: C.doux, gras: false });
    }
    dessiner();
  })();
})();
