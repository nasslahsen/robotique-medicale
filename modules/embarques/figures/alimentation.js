(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure : le schéma d'alimentation (diapositive 11) ---------- */
  (function () {
    var f = R.figure("fig-alim", {
      largeur: 960, hauteur: 560,
      titre: "Power Scheme de l'ESP32",
      essai: "<strong>Essaie</strong> : choisis un domaine pour suivre son alimentation, puis bascule VDD_SDIO entre 3,3 V et 1,8 V. <strong>Observe</strong> : les trois LDO sont alimentés par VDD3P3_RTC ; VDD_SDIO prend soit la résistance de 6 Ω (3,3 V), soit le LDO 1,8 V."
    });
    var g = EMB.el("g", null, f.svg), dom = "cpu", sdio = "33";
    var b = R.boutons(f.reglages), bd = {};
    [["sdio", "SDIO Domain"], ["rtc", "RTC Domain"], ["cpu", "CPU Domain"]].forEach(function (x) { bd[x[0]] = R.bouton(b, x[1], function () { dom = x[0]; dessiner(); }); });
    var b2 = R.boutons(f.reglages), bs = {};
    [["33", "VDD_SDIO = 3,3 V"], ["18", "VDD_SDIO = 1,8 V"]].forEach(function (x) { bs[x[0]] = R.bouton(b2, x[1], function () { sdio = x[0]; dom = "sdio"; dessiner(); }); });
    var zone = R.h("p", null, "", f.direct);
    function L(pts, on) { EMB.el("polyline", { points: pts, fill: "none", stroke: on ? C.acc : C.encre, "stroke-width": on ? 5 : 2.5, "stroke-linejoin": "round" }, g); }
    function dessiner() {
      EMB.vider(g);
      Object.keys(bd).forEach(function (k) { bd[k].classList.toggle("actif", k === dom); });
      Object.keys(bs).forEach(function (k) { bs[k].classList.toggle("actif", k === sdio); });
      var rail = true, s = dom === "sdio", on18 = s && sdio === "18", on33 = s && sdio === "33";
      EMB.el("rect", { x: 70, y: 110, width: 860, height: 430, rx: 14, fill: "none", stroke: C.gris, "stroke-width": 2, "stroke-dasharray": "9 7" }, g);
      EMB.texte(g, "VDD3P3_RTC", [520, 28], { taille: 19, mono: true, coul: C.acc });
      EMB.texte(g, "VDD3P3_CPU", [800, 28], { taille: 19, mono: true });
      L("520,44 520,140", rail);
      L("800,44 800,140", false);
      L("200,180 200,140 800,140", rail);
      EMB.el("circle", { cx: 520, cy: 140, r: 7, fill: C.acc }, g);
      L("340,140 340,180", on33);
      L("520,140 520,180", dom === "rtc");
      L("800,140 800,180", dom === "cpu");
      // colonne SDIO
      EMB.bloc(g, 150, 180, 100, 54, "LDO", { taille: 18, actif: on18 });
      EMB.texte(g, "1,8 V", [140, 207], { taille: 17, mono: true, ancre: "end" });
      EMB.el("rect", { x: 326, y: 180, width: 28, height: 64, rx: 3, fill: on33 ? C.clair : "#fff", stroke: on33 ? C.acc : C.encre, "stroke-width": on33 ? 3.5 : 2.2 }, g);
      EMB.texte(g, "R = 6 Ω", [366, 212], { taille: 17, mono: true, ancre: "start" });
      L("200,234 200,280", on18);
      L("340,244 340,262 260,262 260,280", on33);
      EMB.el("polygon", { points: "170,280 290,280 262,318 198,318", fill: s ? C.clair : "#fff", stroke: s ? C.acc : C.encre, "stroke-width": 2.5 }, g);
      L("230,318 230,400", s);
      EMB.el("circle", { cx: 230, cy: 356, r: 6, fill: C.encre }, g);
      L("20,356 230,356", s);
      EMB.texte(g, "VDD_SDIO", [80, 334], { taille: 17, mono: true });
      EMB.texte(g, sdio === "18" ? "1,8 V" : "3,3 V", [80, 378], { taille: 17, mono: true, coul: C.acc });
      // colonnes RTC et CPU
      EMB.bloc(g, 470, 180, 100, 54, "LDO", { taille: 18, actif: dom === "rtc" });
      EMB.texte(g, "1,1 V", [580, 207], { taille: 17, mono: true, ancre: "start" });
      EMB.bloc(g, 750, 180, 100, 54, "LDO", { taille: 18, actif: dom === "cpu" });
      EMB.texte(g, "1,1 V", [860, 207], { taille: 17, mono: true, ancre: "start" });
      L("520,234 520,400", dom === "rtc");
      L("800,234 800,400", dom === "cpu");
      EMB.bloc(g, 140, 400, 180, 120, "SDIO\nDomain", { taille: 20, actif: s });
      EMB.bloc(g, 430, 400, 180, 120, "RTC\nDomain", { taille: 20, actif: dom === "rtc" });
      EMB.bloc(g, 710, 400, 180, 120, "CPU\nDomain", { taille: 20, actif: dom === "cpu" });
      zone.innerHTML = dom === "sdio" ? (sdio === "33" ? "VDD_SDIO = 3,3 V : il vient de VDD3P3_RTC à travers la résistance R = 6 Ω." : "VDD_SDIO = 1,8 V : il vient du LDO 1,8 V, lui-même alimenté par VDD3P3_RTC.")
        : dom === "rtc" ? "Domaine RTC : VDD3P3_RTC, puis un LDO qui sort 1,1 V." : "Domaine CPU : alimenté depuis VDD3P3_RTC par un LDO qui sort 1,1 V.";
    }
    dessiner();
  })();
})();
