(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure 1 : de la tension au code ---------- */
  (function () {
    var f = R.figure("fig-adc", {
      largeur: 960, hauteur: 440,
      titre: "Conversion d'une tension en code",
      essai: "<strong>Essaie</strong> : déplace la tension d'entrée, puis change la résolution. <strong>Observe</strong> : le code suit la tension proportionnellement ; avec moins de bits, le code maximal baisse et chaque marche couvre plus de millivolts.",
      direct: true
    });
    var cV = R.curseur(f.reglages, { nom: "ADC_IN [V]", min: 0, max: 3.3, pas: 0.01, val: 1.1, surChange: dessiner });
    var b = R.boutons(f.reglages), nb = 12, btns = [];
    [12, 11, 10, 9].forEach(function (k) { btns.push(R.bouton(b, k + " bits", function () { nb = k; dessiner(); })); });
    var g = EMB.el("g", null, f.svg);
    function dessiner() {
      EMB.vider(g);
      btns.forEach(function (x, i) { x.classList.toggle("actif", [12, 11, 10, 9][i] === nb); });
      var V = cV.v, max = Math.pow(2, nb) - 1, code = Math.round(max * V / 3.3), yb = 380, yh = 60;
      function yv(v) { return yb - v / 3.3 * (yb - yh); }
      EMB.el("line", { x1: 150, y1: yh, x2: 150, y2: yb, stroke: C.encre, "stroke-width": 3 }, g);
      [0, 1.1, 2.2, 3.3].forEach(function (v) { EMB.el("line", { x1: 142, y1: yv(v), x2: 158, y2: yv(v), stroke: C.encre, "stroke-width": 2 }, g); EMB.texte(g, EMB.virgule(v, 1) + " V", [132, yv(v)], { taille: 15, ancre: "end", mono: true, gras: false }); });
      EMB.texte(g, "ADC_IN", [150, 30], { taille: 18 });
      EMB.el("circle", { cx: 150, cy: yv(V), r: 11, fill: C.acc, stroke: "#fff", "stroke-width": 3 }, g);
      EMB.bloc(g, 330, 160, 220, 120, "SAR ADC\n" + nb + " bits", { taille: 22, actif: true });
      EMB.fleche(g, [170, yv(V)], [330, 220], { ep: 3, coul: C.acc });
      EMB.fleche(g, [550, 220], [700, 220], { ep: 3, coul: C.acc });
      EMB.el("line", { x1: 760, y1: yh, x2: 760, y2: yb, stroke: C.encre, "stroke-width": 3 }, g);
      [0, 0.5, 1].forEach(function (u) { var c = Math.round(u * max); EMB.el("line", { x1: 752, y1: yb - u * (yb - yh), x2: 768, y2: yb - u * (yb - yh), stroke: C.encre, "stroke-width": 2 }, g); EMB.texte(g, String(c), [780, yb - u * (yb - yh)], { taille: 15, ancre: "start", mono: true, gras: false }); });
      EMB.texte(g, "ADC_OUT", [760, 30], { taille: 18 });
      var yc = yb - code / max * (yb - yh);
      EMB.el("circle", { cx: 760, cy: yc, r: 11, fill: C.acc, stroke: "#fff", "stroke-width": 3 }, g);
      EMB.texte(g, String(code), [740, yc], { taille: 20, ancre: "end", mono: true, coul: C.acc });
      EMB.bits(g, 440 - nb * 15, 330, EMB.binaire(code, nb).split(""), { w: 30, h: 38, taille: 17 });
      EMB.texte(g, "marche : " + EMB.virgule(3300 / max, 2) + " mV", [440, 405], { taille: 15, coul: C.doux, gras: false });
      R.rendre(f.direct, "ADC\\_OUT = " + max + " \\times \\frac{" + R.tn(V, 2) + "}{3{,}3} = " + R.tn(max * V / 3.3, 1) + " \\approx " + code);
    }
    dessiner();
  })();

  /* ---------- Figure 2 : les canaux et le Wi-Fi ---------- */
  (function () {
    var f = R.figure("fig-canaux", {
      largeur: 960, hauteur: 510,
      titre: "Canaux ADC1 et ADC2",
      essai: "<strong>Essaie</strong> : active le Wi-Fi. <strong>Observe</strong> : les dix canaux de l'ADC2 deviennent inutilisables ; il reste les huit canaux de l'ADC1, sur GPIO 32 à 39.",
      direct: false
    });
    var wifi = R.bascule(R.boutons(f.reglages), "Wi-Fi utilisé", false, dessiner);
    var A1 = [36, 37, 38, 39, 32, 33, 34, 35], A2 = [4, 0, 2, 15, 13, 12, 14, 27, 25, 26];
    var g = EMB.el("g", null, f.svg);
    function dessiner() {
      EMB.vider(g);
      var off = wifi.checked;
      EMB.texte(g, "ADC1", [250, 30], { taille: 22 }); EMB.texte(g, "ADC2", [700, 30], { taille: 22, coul: off ? C.ko : C.encre });
      A1.forEach(function (p, i) { EMB.bloc(g, 90, 55 + i * 41, 320, 35, "ADC1_CH" + i + "  (GPIO " + p + ")", { taille: 16, mono: true, actif: off, rx: 8 }); });
      A2.forEach(function (p, i) {
        EMB.bloc(g, 540, 55 + i * 41, 320, 35, "ADC2_CH" + i + "  (GPIO " + p + ")", { taille: 16, mono: true, rx: 8, op: off ? 0.4 : 1 });
        if (off) EMB.el("line", { x1: 550, y1: 72 + i * 41, x2: 850, y2: 72 + i * 41, stroke: C.ko, "stroke-width": 3 }, g);
      });
      if (off) EMB.texte(g, "ADC2 pins cannot be used when Wi-Fi is used", [700, 492], { taille: 15, coul: C.ko });
    }
    dessiner();
  })();

  /* ---------- Figure 3 : approximations successives ---------- */
  (function () {
    var f = R.figure("fig-sar", {
      largeur: 960, hauteur: 500,
      titre: "Approximations successives (12 bits)",
      essai: "<strong>Essaie</strong> : choisis une tension, puis avance étape par étape. <strong>Observe</strong> : chaque comparaison au milieu de l'intervalle donne un bit et divise l'intervalle par deux ; après 12 étapes, on retrouve le code de la formule.",
      direct: true
    });
    var cV = R.curseur(f.reglages, { nom: "ADC_IN [V]", min: 0, max: 3.3, pas: 0.01, val: 1.1, surChange: function () { et.aller(et.k); } });
    var g = EMB.el("g", null, f.svg);
    var et = R.etapes(f.reglages, 12, [""], function (k) { dessiner(k); });
    function X(v) { return 160 + v / 3.3 * 760; }
    function dessiner(k) {
      EMB.vider(g);
      var V = cV.v, bas = 0, haut = 4096, bits = "";
      EMB.el("line", { x1: X(0), y1: 30, x2: X(3.3), y2: 30, stroke: C.encre, "stroke-width": 2.5 }, g);
      [0, 0.825, 1.65, 2.475, 3.3].forEach(function (v) { EMB.texte(g, EMB.virgule(v, 2) + " V", [X(v), 14], { taille: 13, mono: true, gras: false }); });
      EMB.el("line", { x1: X(V), y1: 26, x2: X(V), y2: 26 + 12 * 36 + 12, stroke: C.acc, "stroke-width": 2.5, "stroke-dasharray": "6 5" }, g);
      for (var i = 0; i < 12; i++) {
        var y = 52 + i * 36, milieu = (bas + haut) / 2, s = milieu * 3.3 / 4096, bit = V >= s ? 1 : 0;
        EMB.texte(g, "bit " + (11 - i), [20, y + 12], { taille: 14, ancre: "start", mono: true, coul: i < k ? C.encre : C.gris, gras: false });
        if (i < k) {
          EMB.el("rect", { x: X(bas * 3.3 / 4096), y: y, width: Math.max(2, X(haut * 3.3 / 4096) - X(bas * 3.3 / 4096)), height: 24, fill: EMB.teinte(0.18), stroke: C.acc, "stroke-width": 1.5 }, g);
          EMB.el("line", { x1: X(s), y1: y - 3, x2: X(s), y2: y + 27, stroke: C.v, "stroke-width": 3 }, g);
          EMB.texte(g, String(bit), [100, y + 12], { taille: 18, mono: true, coul: C.acc });
          bits += bit;
          if (bit) bas = milieu; else haut = milieu;
        }
      }
      var code = Math.min(4095, Math.floor(V / 3.3 * 4096));
      R.rendre(f.direct, k ? "\\text{bits trouvés : }\\texttt{" + bits + "}" + (k === 12 ? "_2 = " + parseInt(bits, 2) + "\\qquad \\text{formule : } 4095 \\times " + R.tn(V, 2) + " / 3{,}3 \\approx " + Math.round(4095 * V / 3.3) : "") : "\\text{Avance d'une étape pour la première comparaison, au milieu : } 1{,}65\\ \\text{V}");
    }
    et.aller(1);
  })();

  /* ---------- Figure 4 : domaines et contrôleurs (diapositives 22 et 23) ---------- */
  (function () {
    var f = R.figure("fig-domaines", {
      largeur: 960, hauteur: 500,
      titre: "SAR ADC Outline of Function",
      essai: "<strong>Essaie</strong> : bascule les trois sélecteurs. <strong>Observe</strong> : chaque convertisseur SAR est commandé soit par un contrôleur du domaine RTC, soit par un contrôleur numérique ; SAR ADC2 peut aussi servir au contrôleur PWDET. Les 0 et 1 des multiplexeurs sont placés comme sur le schéma du cours : pour SAR ADC2, l'entrée 1 mène au contrôleur RTC.",
      direct: false
    });
    var b = R.boutons(f.reglages);
    var s1 = R.bascule(b, "SENS_SAR1_DIG_FORCE = 1", false, dessiner);
    var s2 = R.bascule(b, "SENS_SAR2_DIG_FORCE = 1", false, dessiner);
    var s3 = R.bascule(b, "APB_SARADC_SAR2_MUX = 1", true, dessiner);
    var g = EMB.el("g", null, f.svg);
    function dessiner() {
      EMB.vider(g);
      [["Analog", 150], ["RTC", 470], ["Digital", 790]].forEach(function (d) { EMB.texte(g, d[0], [d[1], 26], { taille: 19 }); });
      [310, 630].forEach(function (x) { EMB.el("line", { x1: x, y1: 12, x2: x, y2: 490, stroke: C.gris, "stroke-width": 2, "stroke-dasharray": "5 6" }, g); });
      // SAR ADC1
      EMB.texte(g, "pad_in[7:0]", [20, 90], { taille: 15, ancre: "start", mono: true, gras: false });
      EMB.texte(g, "hall sensor", [20, 140], { taille: 15, ancre: "start", mono: true, gras: false });
      EMB.bloc(g, 130, 60, 70, 40, "LNA", { taille: 14, fill: C.fond });
      EMB.bloc(g, 210, 100, 90, 60, "SAR\nADC1", { taille: 16, actif: true });
      EMB.el("polyline", { points: "120,95 165,100 165,130 210,130", fill: "none", stroke: C.encre, "stroke-width": 2 }, g);
      EMB.el("line", { x1: 120, y1: 140, x2: 210, y2: 140, stroke: C.encre, "stroke-width": 2 }, g);
      var a = s1.checked;
      EMB.el("polygon", { points: "350,90 380,105 380,175 350,190", fill: "#eef0f5", stroke: C.encre, "stroke-width": 2 }, g);
      EMB.texte(g, "SENS_SAR1_DIG_FORCE", [365, 70], { taille: 13, mono: true, gras: false });
      EMB.fleche(g, [300, 130], [350, 130], { double: true, coul: C.acc, ep: 3 });
      EMB.bloc(g, 420, 100, 150, 50, "RTC ADC1 CTRL", { taille: 14, actif: !a });
      EMB.bloc(g, 760, 160, 160, 50, "DIG ADC1 CTRL", { taille: 14, actif: a });
      EMB.fleche(g, [380, 120], [420, 120], { double: true, coul: !a ? C.acc : C.gris, ep: !a ? 3.5 : 2 });
      EMB.fleche(g, [380, 180], [760, 185], { double: true, coul: a ? C.acc : C.gris, ep: a ? 3.5 : 2 });
      // SAR ADC2
      ["pa_pkdet1", "pa_pkdet2", "vdd33", "pad_in[9:0]"].forEach(function (t, i) { EMB.texte(g, t, [20, 300 + i * 40], { taille: 15, ancre: "start", mono: true, gras: false }); EMB.el("line", { x1: 130, y1: 300 + i * 40, x2: 160, y2: 300 + i * 40, stroke: C.encre, "stroke-width": 2 }, g); });
      EMB.el("line", { x1: 160, y1: 300, x2: 160, y2: 420, stroke: C.encre, "stroke-width": 2 }, g);
      EMB.el("line", { x1: 160, y1: 360, x2: 210, y2: 360, stroke: C.encre, "stroke-width": 2 }, g);
      EMB.bloc(g, 210, 330, 90, 60, "SAR\nADC2", { taille: 16, actif: true });
      var b2 = s2.checked, m3 = s3.checked;
      EMB.el("polygon", { points: "350,310 380,325 380,395 350,410", fill: "#eef0f5", stroke: C.encre, "stroke-width": 2 }, g);
      EMB.texte(g, "SENS_SAR2_DIG_FORCE", [365, 290], { taille: 13, mono: true, gras: false });
      EMB.fleche(g, [300, 360], [350, 360], { double: true, coul: C.acc, ep: 3 });
      EMB.bloc(g, 420, 400, 150, 50, "RTC ADC2 CTRL", { taille: 14, actif: b2 });
      EMB.fleche(g, [380, 395], [420, 420], { double: true, coul: b2 ? C.acc : C.gris, ep: b2 ? 3.5 : 2 });
      EMB.texte(g, "0", [392, 322], { taille: 13, mono: true }); EMB.texte(g, "1", [392, 400], { taille: 13, mono: true });
      EMB.texte(g, "0", [392, 112], { taille: 13, mono: true }); EMB.texte(g, "1", [392, 190], { taille: 13, mono: true });
      EMB.el("polygon", { points: "680,290 710,305 710,395 680,410", fill: "#eef0f5", stroke: C.encre, "stroke-width": 2 }, g);
      EMB.texte(g, "APB_SARADC_SAR2_MUX", [700, 270], { taille: 13, mono: true, gras: false });
      var d2 = !b2;
      EMB.fleche(g, [380, 330], [680, 330], { double: true, coul: d2 ? C.acc : C.gris, ep: d2 ? 3.5 : 2 });
      EMB.bloc(g, 760, 290, 160, 50, "DIG ADC2 CTRL", { taille: 14, actif: d2 && m3 });
      EMB.bloc(g, 760, 370, 160, 50, "PWDET CTRL", { taille: 14, actif: d2 && !m3 });
      EMB.texte(g, "1", [722, 302], { taille: 13, mono: true }); EMB.texte(g, "0", [722, 382], { taille: 13, mono: true });
      EMB.fleche(g, [710, 315], [760, 315], { double: true, coul: d2 && m3 ? C.acc : C.gris, ep: d2 && m3 ? 3.5 : 2 });
      EMB.fleche(g, [710, 395], [760, 395], { double: true, coul: d2 && !m3 ? C.acc : C.gris, ep: d2 && !m3 ? 3.5 : 2 });
      EMB.bloc(g, 790, 225, 100, 44, "DMA", { taille: 14, fill: C.fond });
    }
    dessiner();
  })();
})();
