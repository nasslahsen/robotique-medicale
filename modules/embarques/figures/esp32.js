(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure 1 : lire une référence, champ par champ ---------- */
  (function () {
    var f = R.figure("fig-nomenclature", {
      largeur: 960, hauteur: 500,
      titre: "Nomenclature des puces ESP32",
      essai: "<strong>Essaie</strong> : choisis une référence du tableau. <strong>Observe</strong> : chaque morceau du nom répond à une question (cœurs, flash, radio, PSRAM, température, boîtier, révision) ; un champ absent prend la valeur par défaut, et la ligne du tableau confirme la lecture.",
      direct: false
    });
    var g = EMB.el("g", null, f.svg);
    // type de champ : couleur et question
    var TYPE = {
      serie: ["Série", C.acc], coeur: ["Cœur", "#2f6fdb"], flash: ["Flash intégrée", "#12a26b"], radio: ["Connexion", "#8b3fd9"],
      psram: ["PSRAM intégrée", "#d9730d"], temp: ["Température", "#c14c8a"], boitier: ["Boîtier", "#5b6172"], rev: ["Révision", "#15171f"]
    };
    var REF = [
      { nom: "ESP32-D0WD-V3", seg: [["ESP32", "serie"], ["D", "coeur", "dual core"], ["0", "flash", "pas de flash"], ["WD", "radio", "Wi-Fi + Bluetooth/BLE"], ["V3", "rev", "v3.0 ou plus"]], defaut: [["boitier", "rien : QFN 5*5"]], ligne: ["Dual core", "v3.0/v3.1", "aucune", "QFN 5*5", "1,8 V/3,3 V"] },
      { nom: "ESP32-D0WDRH2-V3", seg: [["ESP32", "serie"], ["D", "coeur", "dual core"], ["0", "flash", "pas de flash"], ["WD", "radio", "Wi-Fi + Bluetooth/BLE"], ["R", "psram", "R…2 : 2 MB de PSRAM"], ["H", "temp", "haute température"], ["2", "psram", ""], ["V3", "rev", "v3.0 ou plus"]], defaut: [["boitier", "rien : QFN 5*5"]], ligne: ["Dual core", "v3.0/v3.1", "2 MB PSRAM", "QFN 5*5", "3,3 V"], note: "Remplace l'ESP32-D0WDR2-V3, en fin de vie (EOL)." },
      { nom: "ESP32-U4WDH", seg: [["ESP32", "serie"], ["U", "coeur", "dual core"], ["4", "flash", "4 MB de flash"], ["WD", "radio", "Wi-Fi + Bluetooth/BLE"], ["H", "temp", "haute température"]], defaut: [["boitier", "rien : QFN 5*5"]], ligne: ["Dual core", "v3.0/v3.1", "4 MB flash", "QFN 5*5", "3,3 V"] },
      { nom: "ESP32-D0WDQ6-V3", seg: [["ESP32", "serie"], ["D", "coeur", "dual core"], ["0", "flash", "pas de flash"], ["WD", "radio", "Wi-Fi + Bluetooth/BLE"], ["Q6", "boitier", "QFN 6*6"], ["V3", "rev", "v3.0 ou plus"]], defaut: [], ligne: ["Dual core", "v3.0/v3.1", "aucune", "QFN 6*6", "1,8 V/3,3 V"], note: "NRND : déconseillée pour un nouveau produit." },
      { nom: "ESP32-D0WD", seg: [["ESP32", "serie"], ["D", "coeur", "dual core"], ["0", "flash", "pas de flash"], ["WD", "radio", "Wi-Fi + Bluetooth/BLE"]], defaut: [["boitier", "rien : QFN 5*5"], ["rev", "pas de V3 : v1.0/v1.1"]], ligne: ["Dual core", "v1.0/v1.1", "aucune", "QFN 5*5", "1,8 V/3,3 V"], note: "NRND : déconseillée pour un nouveau produit." },
      { nom: "ESP32-S0WD", seg: [["ESP32", "serie"], ["S", "coeur", "single core"], ["0", "flash", "pas de flash"], ["WD", "radio", "Wi-Fi + Bluetooth/BLE"]], defaut: [["boitier", "rien : QFN 5*5"], ["rev", "pas de V3 : v1.0/v1.1"]], ligne: ["Single core", "v1.0/v1.1", "aucune", "QFN 5*5", "1,8 V/3,3 V"], note: "NRND : déconseillée pour un nouveau produit." }
    ];
    var k = 0, b = R.boutons(f.reglages), btns = [];
    REF.forEach(function (r, i) { btns.push(R.bouton(b, r.nom, function () { k = i; dessiner(); })); });
    function dessiner() {
      EMB.vider(g);
      btns.forEach(function (x, i) { x.classList.toggle("actif", i === k); });
      var r = REF[k], larg = r.seg.map(function (s) { return s[0].length > 3 ? 120 : s[0].length > 1 ? 76 : 58; });
      var tot = larg.reduce(function (a, c) { return a + c; }, 0) + 10 * (larg.length - 1), x = 480 - tot / 2;
      var liste = [];
      r.seg.forEach(function (s, i) {
        var t = TYPE[s[1]];
        EMB.el("rect", { x: x, y: 40, width: larg[i], height: 74, rx: 10, fill: t[1] }, g);
        EMB.texte(g, s[0], [x + larg[i] / 2, 77], { taille: 30, mono: true, coul: "#fff", halo: false });
        if (s[2]) liste.push([t, s[2], x + larg[i] / 2]);
        x += larg[i] + 10;
      });
      liste.forEach(function (l, i) {
        var y = 160 + i * 42;
        EMB.el("rect", { x: 60, y: y, width: 16, height: 26, rx: 4, fill: l[0][1] }, g);
        EMB.texte(g, l[0][0], [90, y + 13], { taille: 18, ancre: "start" });
        EMB.texte(g, l[1], [260, y + 13], { taille: 18, ancre: "start", gras: false });
      });
      r.defaut.forEach(function (d, i) {
        var y = 160 + (liste.length + i) * 42;
        EMB.el("rect", { x: 60, y: y, width: 16, height: 26, rx: 4, fill: "#fff", stroke: TYPE[d[0]][1], "stroke-width": 2, "stroke-dasharray": "4 3" }, g);
        EMB.texte(g, TYPE[d[0]][0], [90, y + 13], { taille: 18, ancre: "start", coul: C.doux });
        EMB.texte(g, d[1], [260, y + 13], { taille: 18, ancre: "start", gras: false, coul: C.doux });
      });
      // la ligne du tableau
      EMB.el("rect", { x: 560, y: 150, width: 370, height: 300, rx: 16, fill: C.fond, stroke: C.pale, "stroke-width": 2 }, g);
      EMB.texte(g, "Ligne du tableau", [745, 178], { taille: 17, coul: C.doux });
      ["Core", "Chip Revision", "Flash/PSRAM", "Package", "VDD_SDIO"].forEach(function (h, i) {
        var y = 215 + i * 44;
        EMB.texte(g, h, [585, y], { taille: 16, ancre: "start", gras: false, coul: C.doux });
        EMB.texte(g, r.ligne[i], [905, y], { taille: 18, ancre: "end", mono: true });
      });
      if (r.note) EMB.texte(g, r.note, [480, 476], { taille: 16, coul: C.doux, gras: false });
    }
    dessiner();
  })();

  /* ---------- Figure 2 : la plage de température ---------- */
  (function () {
    var f = R.figure("fig-plage", {
      largeur: 960, hauteur: 280,
      titre: "Plage de fonctionnement de l'ESP32",
      essai: "<strong>Essaie</strong> : déplace la température ambiante, ou choisis un lieu. <strong>Observe</strong> : de −40 °C à +125 °C l'ESP32 fonctionne de façon fiable ; au-delà, on sort de la plage garantie.",
      direct: false
    });
    var g = EMB.el("g", null, f.svg);
    var ct = R.curseur(f.reglages, { nom: "Température", min: -60, max: 150, pas: 1, val: 22, unite: " °C", surChange: dessiner });
    var b = R.boutons(f.reglages);
    [["Chambre d'hôpital", 22], ["Congélateur de laboratoire", -30], ["Autoclave", 134], ["Ambulance en hiver", -15]].forEach(function (l) { R.bouton(b, l[0], function () { ct.set(l[1]); dessiner(); }); });
    var px = function (t) { return 80 + (t + 60) * 800 / 210; };
    function dessiner() {
      EMB.vider(g);
      var t = ct.v, ok = t >= -40 && t <= 125;
      EMB.el("rect", { x: 80, y: 120, width: 800, height: 40, rx: 20, fill: "#eef0f5" }, g);
      EMB.el("rect", { x: px(-40), y: 120, width: px(125) - px(-40), height: 40, fill: EMB.teinte(0.3), stroke: C.acc, "stroke-width": 2 }, g);
      for (var v = -60; v <= 150; v += 30) { EMB.el("line", { x1: px(v), y1: 160, x2: px(v), y2: 172, stroke: C.encre, "stroke-width": 2 }, g); EMB.texte(g, EMB.virgule(v) + " °C", [px(v), 192], { taille: 15, mono: true, gras: false }); }
      EMB.texte(g, "−40 °C", [px(-40), 100], { taille: 17, coul: C.acc }); EMB.texte(g, "+125 °C", [px(125), 100], { taille: 17, coul: C.acc });
      EMB.el("path", { d: "M" + px(t) + " 118 l-12 -24 h24 z", fill: ok ? C.ok : C.ko }, g);
      EMB.el("line", { x1: px(t), y1: 118, x2: px(t), y2: 162, stroke: ok ? C.ok : C.ko, "stroke-width": 4 }, g);
      EMB.texte(g, ok ? "dans la plage : fonctionnement fiable" : "hors de la plage garantie", [480, 240], { taille: 22, coul: ok ? C.ok : C.ko });
      EMB.texte(g, EMB.virgule(t) + " °C", [px(t), 50], { taille: 20, mono: true, coul: ok ? C.ok : C.ko });
    }
    dessiner();
  })();
})();
