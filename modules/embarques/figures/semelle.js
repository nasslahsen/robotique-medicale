(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure 1 : les six stades ---------- */
  (function () {
    var f = R.figure("fig-stades", {
      largeur: 960, hauteur: 440,
      titre: "Évolution d'un ulcère pour un pied diabétique",
      essai: "<strong>Essaie</strong> : fais glisser le curseur du stade 0 au stade 5. <strong>Observe</strong> : la lésion s'étend en surface (stade 1), puis en profondeur (2), atteint l'os (3), puis la gangrène gagne une partie (4) puis tout le pied (5).",
      direct: false
    });
    var g = EMB.el("g", null, f.svg);
    var NOMS = ["no defect", "superficial ulcer", "deep ulcer", "osteitis", "partial gangrene of the foot", "gangrene of the whole foot"];
    var FR = ["pas de lésion", "ulcère superficiel", "ulcère profond", "ostéite : l'os est atteint", "gangrène d'une partie du pied", "gangrène de tout le pied"];
    var cs = R.curseur(f.reglages, { nom: "Stade", min: 0, max: 5, pas: 1, val: 1, surChange: dessiner });
    function dessiner() {
      EMB.vider(g);
      var k = Math.round(cs.v);
      EMB.pied(g, 170, 230, 1.85, k);
      EMB.texte(g, "Stage " + k, [430, 120], { taille: 34, ancre: "start", coul: C.acc });
      EMB.texte(g, NOMS[k], [430, 175], { taille: 24, ancre: "start", italique: true, gras: false });
      EMB.texte(g, FR[k], [430, 215], { taille: 20, ancre: "start", gras: false, coul: C.doux });
      for (var i = 0; i < 6; i++) {
        var x = 450 + i * 82;
        EMB.el("rect", { x: x - 36, y: 268, width: 72, height: 150, rx: 12, fill: i === k ? EMB.teinte(0.12) : "#fff", stroke: i === k ? C.acc : C.pale, "stroke-width": i === k ? 3 : 1.5 }, g);
        EMB.pied(g, x, 345, 0.52, i);
        EMB.texte(g, String(i), [x, 404], { taille: 15, mono: true, coul: C.doux, halo: false });
      }
    }
    dessiner();
  })();

  /* ---------- Figure 2 : charge par capteur ---------- */
  (function () {
    var f = R.figure("fig-charge", {
      largeur: 960, hauteur: 520,
      titre: "Charge portée par chaque capteur (exemple ajouté)",
      essai: "<strong>Essaie</strong> : règle le poids, puis compare les trois appuis. <strong>Observe</strong> : réparti sur 16 capteurs, le poids reste dans la plage ; concentré sur le talon, il dépasse 10 kg et les capteurs saturent (en rouge). Sous 500 g, un capteur ne réagit pas (en gris). Répartition simplifiée, à parts égales sur les capteurs chargés."
    });
    var g = EMB.el("g", null, f.svg);
    var cp = R.curseur(f.reglages, { nom: "Poids [kg]", min: 30, max: 120, pas: 1, val: 80, surChange: dessiner });
    var APP = { repart: { nom: "Debout, réparti", k: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] }, talon: { nom: "Attaque du talon", k: [13, 14] }, avant: { nom: "Poussée de l'avant-pied", k: [0, 1, 2, 3, 4, 5] } };
    var mode = "repart", b = R.boutons(f.reglages), btn = {};
    Object.keys(APP).forEach(function (m) { btn[m] = R.bouton(b, APP[m].nom, function () { mode = m; dessiner(); }); });
    var zone = R.h("div", null, "", f.direct);
    function dessiner() {
      EMB.vider(g);
      Object.keys(btn).forEach(function (m) { btn[m].classList.toggle("actif", m === mode); });
      var P = cp.v, ks = APP[mode].k, q = P / ks.length;
      var cx = 230, cy = 270, s = 2.5;
      EMB.semelle(g, cx, cy, s, null);
      EMB.CAPTEURS.forEach(function (c, i) {
        var ch = ks.indexOf(i) >= 0 ? q : 0, coul = ch === 0 || ch < 0.5 ? C.gris : ch > 10 ? C.ko : C.ok;
        var x = cx + c[0] * s, y = cy + c[1] * s;
        EMB.el("rect", { x: x - 9 * s, y: y - 4.2 * s, width: 18 * s, height: 8.4 * s, rx: 4.2 * s, fill: coul, transform: "rotate(-60 " + x + " " + y + ")" }, g);
      });
      EMB.texte(g, "pas d'appui ou < 500 g", [520, 120], { taille: 18, ancre: "start", gras: false });
      EMB.el("rect", { x: 490, y: 108, width: 20, height: 24, rx: 6, fill: C.gris }, g);
      EMB.texte(g, "dans la plage (500 g à 10 kg)", [520, 165], { taille: 18, ancre: "start", gras: false });
      EMB.el("rect", { x: 490, y: 153, width: 20, height: 24, rx: 6, fill: C.ok }, g);
      EMB.texte(g, "saturé (> 10 kg)", [520, 210], { taille: 18, ancre: "start", gras: false });
      EMB.el("rect", { x: 490, y: 198, width: 20, height: 24, rx: 6, fill: C.ko }, g);
      // jauge de la charge d'un capteur chargé
      var x0 = 490, w = 420, max = 60, xq = x0 + Math.min(q, max) / max * w;
      EMB.texte(g, "charge d'un capteur chargé", [x0, 300], { taille: 17, ancre: "start", coul: C.doux, gras: false });
      EMB.el("rect", { x: x0, y: 320, width: w, height: 30, rx: 6, fill: C.fond, stroke: C.pale, "stroke-width": 2 }, g);
      EMB.el("rect", { x: x0 + 0.5 / max * w, y: 320, width: 9.5 / max * w, height: 30, fill: "#d4f0e2" }, g);
      EMB.el("rect", { x: x0, y: 320, width: Math.max(0, xq - x0), height: 30, rx: 6, fill: q > 10 ? C.ko : C.ok, opacity: 0.85 }, g);
      [0, 10, 20, 40, 60].forEach(function (v) { var x = x0 + v / max * w; EMB.el("line", { x1: x, y1: 350, x2: x, y2: 360, stroke: C.doux, "stroke-width": 2 }, g); EMB.texte(g, v + " kg", [x, 378], { taille: 14, mono: true, coul: C.doux, gras: false }); });
      EMB.texte(g, EMB.virgule(Math.round(q * 10) / 10) + " kg", [x0, 430], { taille: 34, ancre: "start", mono: true, coul: q > 10 ? C.ko : C.encre });
      EMB.texte(g, ks.length + " capteur" + (ks.length > 1 ? "s" : "") + " chargé" + (ks.length > 1 ? "s" : ""), [x0, 470], { taille: 18, ancre: "start", gras: false, coul: C.doux });
      R.rendre(zone, "\\text{charge} = \\frac{" + R.tc(P, 0) + " \\text{ kg}}{" + ks.length + "} = " + R.tc(q, 2) + " \\text{ kg}" + (q > 10 ? " > 10 \\text{ kg : saturé}" : " \\le 10 \\text{ kg}"));
    }
    dessiner();
  })();

  /* ---------- Figure 3 : le schéma bloc, chemin par chemin ---------- */
  (function () {
    var f = R.figure("fig-schema", {
      largeur: 960, hauteur: 470,
      titre: "Schéma bloc de la semelle connectée",
      essai: "<strong>Essaie</strong> : touche un chemin. <strong>Observe</strong> : toutes les mesures passent par le µC ; seul le bloc TX Radio parle à l'extérieur ; la gestion de l'alimentation alimente tout le reste à partir de l'accumulateur."
    });
    var g = EMB.el("g", null, f.svg);
    var BL = {
      bioz: [300, 40, 220, 76, "Mesure BioZ\nMAX30009"], appui: [300, 190, 220, 76, "Gestion Capteurs\nAppui Plantaire"], temp: [300, 340, 220, 76, "Capteur T°C\n& Humidité"],
      uc: [600, 175, 120, 106, "µC"], radio: [770, 175, 130, 106, "TX Radio"], alim: [640, 350, 150, 80, "Gestion\nAlim."]
    };
    var CH = {
      bioz: { nom: "Bio-impédance", b: ["bioz", "uc"], t: "Le MAX30009 mesure la bio-impédance des tissus (BioZ) et l'échange avec le µC." },
      appui: { nom: "Appuis", b: ["appui", "uc"], t: "Les 16 capteurs de force sont lus par le bloc de gestion des capteurs d'appui plantaire, relié au µC." },
      temp: { nom: "Température et humidité", b: ["temp", "uc"], t: "Le capteur de température et d'humidité de la semelle échange avec le µC." },
      radio: { nom: "Envoi", b: ["uc", "radio"], t: "Le µC confie les données au bloc TX Radio, qui les émet par l'antenne." },
      alim: { nom: "Énergie", b: ["alim"], t: "La gestion de l'alimentation tire l'énergie de l'accumulateur pour toute la carte." }
    };
    var ch = null, b = R.boutons(f.reglages), btn = {}, zone = R.h("p", null, "Touche un chemin.", f.direct);
    Object.keys(CH).forEach(function (k) { btn[k] = R.bouton(b, CH[k].nom, function () { ch = k; zone.textContent = CH[k].t; dessiner(); }); });
    function dessiner() {
      EMB.vider(g);
      Object.keys(btn).forEach(function (k) { btn[k].classList.toggle("actif", k === ch); });
      var on = ch ? CH[ch].b : [];
      EMB.el("rect", { x: 270, y: 16, width: 680, height: 440, rx: 6, fill: "none", stroke: C.encre, "stroke-width": 2, "stroke-dasharray": "8 6" }, g);
      var d = "M130 60 C190 60 205 150 196 230 C188 300 190 360 178 410 C168 450 100 450 94 410 C86 350 80 290 84 220 C88 140 96 60 130 60Z";
      EMB.el("path", { d: d, fill: "#fff", stroke: C.encre, "stroke-width": 3 }, g);
      EMB.texte(g, "Semelle\ninstrumentée", [140, 250], { taille: 18, gras: false, halo: false });
      [78, 228, 378].forEach(function (y, i) { EMB.el("line", { x1: [178, 197, 186][i], y1: y, x2: 300, y2: y, stroke: C.encre, "stroke-width": 2.5 }, g); });
      Object.keys(BL).forEach(function (k) { var x = BL[k]; EMB.bloc(g, x[0], x[1], x[2], x[3], x[4], { taille: k === "uc" ? 30 : 19, actif: on.indexOf(k) >= 0 }); });
      var A = function (a, bb, k) { EMB.fleche(g, a, bb, { double: true, ep: 3, coul: ch === k ? C.acc : C.encre }); };
      A([520, 78], [640, 175], "bioz"); A([520, 228], [600, 228], "appui"); A([520, 378], [640, 281], "temp"); A([720, 228], [770, 228], "radio");
      EMB.el("path", { d: "M900 228 H930 V70 M916 50 L930 76 L944 50 Z", fill: "none", stroke: ch === "radio" ? C.acc : C.encre, "stroke-width": 3 }, g);
      EMB.el("line", { x1: 790, y1: 375, x2: 860, y2: 375, stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.el("line", { x1: 790, y1: 405, x2: 870, y2: 405, stroke: C.encre, "stroke-width": 2.5 }, g);
      EMB.el("line", { x1: 845, y1: 360, x2: 885, y2: 360, stroke: ch === "alim" ? C.acc : C.encre, "stroke-width": 4 }, g);
      EMB.el("line", { x1: 855, y1: 372, x2: 875, y2: 372, stroke: ch === "alim" ? C.acc : C.encre, "stroke-width": 7 }, g);
      EMB.texte(g, "Accu", [865, 335], { taille: 18, gras: false });
    }
    dessiner();
  })();
})();
