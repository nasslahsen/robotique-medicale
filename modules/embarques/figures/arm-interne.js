(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure 1 : le système ARM et ses deux bus (diapositive 19) ---------- */
  (function () {
    var f = R.figure("fig-amba", {
      largeur: 960, hauteur: 520,
      titre: "Système ARM : bus système et bus périphérique",
      essai: "<strong>Essaie</strong> : choisis un bus, ou touche un bloc. <strong>Observe</strong> : l'ARM, la RAM et l'interface externe partagent le bus système (AHB ou ASB) ; le Timer, le Remap/Pause et l'Interrupt Controller sont sur le bus périphérique (APB), derrière le Bridge."
    });
    var g = EMB.el("g", null, f.svg), bus = null, choisi = null, b = R.boutons(f.reglages), zone = R.h("p", null, "Touche un bloc.", f.direct);
    var bS = R.bouton(b, "System Bus (AHB ou ASB)", function () { bus = "s"; dessiner(); });
    var bP = R.bouton(b, "Peripheral Bus (APB)", function () { bus = "p"; dessiner(); });
    var B = {
      arbiter: [250, 40, 140, 50, "Arbiter", "s", "décide quel maître utilise le bus système (complément)."],
      reset: [700, 40, 140, 50, "Reset", "", "remise à zéro du système."],
      arm: [430, 30, 180, 90, "ARM", "s", "le cœur ARM, relié au bus par son Bus Interface."],
      tic: [250, 125, 120, 36, "TIC", "s", "bloc relié à l'External Bus Interface sur la diapositive."],
      ebi: [250, 161, 120, 130, "External\nBus\nInterface", "s", "interface vers l'External ROM et l'External RAM."],
      rom: [30, 165, 140, 76, "External\nROM", "", "mémoire morte externe."],
      ram: [30, 265, 140, 76, "External\nRAM", "", "mémoire vive externe."],
      onchip: [450, 245, 150, 80, "On-chip\nRAM", "s", "mémoire vive dans la puce."],
      decoder: [330, 330, 130, 44, "Decoder", "s", "décode l'adresse pour sélectionner le bloc visé (complément)."],
      bridge: [630, 120, 40, 250, "", "", "le pont entre le System Bus et le Peripheral Bus."],
      timer: [700, 120, 130, 56, "Timer", "p", "périphérique de mesure du temps."],
      remap: [845, 120, 100, 70, "Remap/\nPause", "p", "périphérique Remap/Pause."],
      ic: [720, 240, 180, 70, "Interrupt\nController", "p", "contrôleur d'interruptions."]
    };
    function dessiner() {
      EMB.vider(g);
      bS.classList.toggle("actif", bus === "s"); bP.classList.toggle("actif", bus === "p");
      EMB.el("rect", { x: 200, y: 20, width: 755, height: 370, fill: "#a9d0e6", stroke: C.encre, "stroke-width": 1.5 }, g);
      EMB.el("rect", { x: 430, y: 120, width: 180, height: 30, fill: "#3fbf4f", stroke: C.encre, "stroke-width": 1.5 }, g);
      EMB.texte(g, "Bus Interface", [520, 135], { taille: 15, coul: "#fff", halo: false });
      var sc = bus === "s" ? C.acc : "#8a8f99";
      EMB.el("rect", { x: 370, y: 200, width: 260, height: 22, fill: sc }, g);
      EMB.el("rect", { x: 510, y: 150, width: 22, height: 95, fill: sc }, g);
      var pc = bus === "p" ? C.acc : C.encre, pe = bus === "p" ? 4 : 2;
      EMB.el("polyline", { points: "670,215 765,215 765,176", fill: "none", stroke: pc, "stroke-width": pe }, g);
      EMB.el("polyline", { points: "765,215 895,215 895,190", fill: "none", stroke: pc, "stroke-width": pe }, g);
      EMB.el("polyline", { points: "810,215 810,240", fill: "none", stroke: pc, "stroke-width": pe }, g);
      [["170,203 250,203"], ["170,303 210,303 210,203"], ["320,40 320,20"], ["390,65 430,65"], ["395,330 395,222"], ["460,352 525,352 525,325"], ["310,291 310,380 650,380 650,370"]].forEach(function (p) { EMB.el("polyline", { points: p[0], fill: "none", stroke: C.encre, "stroke-width": 2 }, g); });
      Object.keys(B).forEach(function (k) {
        var x = B[k], on = choisi === k || (bus && x[5] === bus);
        var fill = k === "arm" ? "#45505f" : /timer|remap|ic/.test(k) ? "#f1a35f" : /arbiter|reset|decoder|bridge/.test(k) ? "#a45d86" : "#4a74c8";
        EMB.el("rect", { x: x[0], y: x[1], width: x[2], height: x[3], rx: 5, fill: on ? C.clair : fill, stroke: on ? C.acc : C.encre, "stroke-width": on ? 4 : 1.5 }, g);
        if (x[4]) EMB.texte(g, x[4], [x[0] + x[2] / 2, x[1] + x[3] / 2], { taille: k === "arm" ? 28 : 16, coul: on ? C.encre : "#fff", halo: false });
      });
      EMB.texte(g, "Bridge", [650, 245], { taille: 14, coul: choisi === "bridge" ? C.encre : "#fff", halo: false });
      [[370, 650, "AHB or ASB", "System Bus", "s"], [650, 955, "APB", "Peripheral Bus", "p"]].forEach(function (d) {
        var on = bus === d[4], c = on ? C.acc : C.encre;
        EMB.el("line", { x1: d[0], y1: 400, x2: d[0], y2: 500, stroke: C.encre, "stroke-width": 2 }, g);
        EMB.el("line", { x1: d[1] - 1, y1: 400, x2: d[1] - 1, y2: 500, stroke: C.encre, "stroke-width": 2 }, g);
        EMB.fleche(g, [d[0] + 2, 440], [d[1] - 3, 440], { ep: on ? 3.5 : 2, double: true, coul: c });
        EMB.texte(g, d[2], [(d[0] + d[1]) / 2, 422], { taille: 19, coul: c });
        EMB.texte(g, d[3], [(d[0] + d[1]) / 2, 474], { taille: 19, gras: false, coul: c });
      });
    }
    EMB.toucher(f.svg, function () { var z = {}; Object.keys(B).forEach(function (k) { z[k] = B[k].slice(0, 4); }); return z; }, function (k) {
      choisi = k; bus = null; zone.textContent = (B[k][4] || "Bridge").replace(/\n/g, " ") + " : " + B[k][6]; dessiner();
    });
    dessiner();
  })();

  /* ---------- Figure 2 : une instruction traverse le cœur ARM (exemple ajouté) ---------- */
  (function () {
    var f = R.figure("fig-coeur", {
      largeur: 960, hauteur: 600,
      titre: "Cœur ARM : ADD R0, R1, R2, LSL #2",
      essai: "<strong>Essaie</strong> : avance étape par étape. <strong>Observe</strong> : le banc de registres sort deux valeurs à la fois (2 ports de lecture) ; R2 passe par le barrel shifter sur le B bus ; l'ALU additionne ; le résultat revient par l'ALU bus, l'unique port d'écriture."
    });
    var g = EMB.el("g", null, f.svg), zone = R.h("p", null, "", f.direct);
    var ETAPES = [
      { on: [], v: { R0: "?", R1: 10, R2: 3 }, t: "Départ : R1 = 10, R2 = 3. L'instruction ADD R0, R1, R2, LSL #2 a été décodée par l'instruction decode & control." },
      { on: ["bank", "abus", "bbus"], v: { R0: "?", R1: 10, R2: 3 }, t: "Lecture : R1 sort sur l'A bus et R2 sur le B bus, en même temps (2 ports de lecture)." },
      { on: ["shift", "bbus"], v: { R0: "?", R1: 10, R2: 3 }, sh: 12, t: "Barrel shifter : R2 = 3 décalé de 2 bits vers la gauche donne 12 (3 × 4)." },
      { on: ["alu", "abus"], v: { R0: "?", R1: 10, R2: 3 }, sh: 12, alu: 22, t: "ALU : 10 + 12 = 22." },
      { on: ["alubus", "bank"], v: { R0: 22, R1: 10, R2: 3 }, sh: 12, alu: 22, t: "Écriture : 22 revient par l'ALU bus dans R0, par le seul port d'écriture du banc." }
    ];
    var k = 0;
    R.etapes(f.reglages, 4, ["départ", "lecture", "décalage", "addition", "écriture"], function (i) { k = i; dessiner(); });
    function boite(x, y, w, h, t, on, o) { EMB.bloc(g, x, y, w, h, t, Object.assign({ taille: 17, actif: on }, o || {})); }
    function dessiner() {
      EMB.vider(g);
      var e = ETAPES[k], on = function (id) { return e.on.indexOf(id) >= 0; };
      var L = function (pts, id) { EMB.el("polyline", { points: pts, fill: "none", stroke: on(id) ? C.acc : C.encre, "stroke-width": on(id) ? 5 : 3 }, g); };
      EMB.fleche(g, [250, 70], [250, 22], { ep: 9, coul: "#c9ccd3" }); EMB.texte(g, "A[31:0]", [310, 26], { taille: 17, coul: C.ko, mono: true });
      L("110,500 110,92 150,92", "alubus"); L("110,240 150,240", "alubus");
      EMB.texte(g, "ALU\nbus", [80, 380], { taille: 15, gras: false, coul: on("alubus") ? C.acc : C.encre });
      EMB.fleche(g, [200, 290], [200, 450], { ep: on("abus") ? 5 : 3, coul: on("abus") ? C.acc : C.encre }); EMB.texte(g, "A bus", [172, 360], { taille: 15, gras: false });
      L("440,290 440,312", "bbus"); EMB.fleche(g, [400, 352], [400, 378], { ep: on("bbus") ? 5 : 3, coul: on("bbus") ? C.acc : C.encre });
      EMB.fleche(g, [400, 420], [400, 450], { ep: on("shift") ? 5 : 3, coul: on("shift") ? C.acc : C.encre });
      EMB.texte(g, "B bus", [510, 300], { taille: 15, gras: false });
      EMB.fleche(g, [300, 112], [300, 200], { ep: 3 }); EMB.fleche(g, [420, 112], [420, 140], { ep: 3 });
      EMB.el("polyline", { points: "480,155 520,155 520,92 480,92", fill: "none", stroke: C.encre, "stroke-width": 3 }, g);
      EMB.el("polyline", { points: "300,500 300,530", fill: "none", stroke: C.encre, "stroke-width": 3 }, g);
      boite(150, 70, 330, 42, "address register");
      boite(360, 140, 120, 34, "incrementer", false, { taille: 15 });
      boite(150, 200, 330, 90, "register bank", on("bank"));
      boite(345, 312, 150, 40, "multiply register", false, { taille: 14 });
      boite(340, 378, 140, 42, "barrel shifter" + (e.sh !== undefined && k >= 2 ? " : " + e.sh : ""), on("shift"), { taille: 15 });
      boite(150, 450, 330, 50, "ALU" + (e.alu !== undefined && k >= 3 ? " : 22" : ""), on("alu"), { taille: 19 });
      boite(150, 530, 250, 38, "data out register", false, { taille: 15 });
      boite(420, 530, 230, 38, "data in register", false, { taille: 15 });
      EMB.fleche(g, [275, 568], [275, 598], { ep: 7, coul: "#c9ccd3" }); EMB.fleche(g, [535, 598], [535, 568], { ep: 7, coul: "#c9ccd3" });
      EMB.texte(g, "D[31:0]", [410, 590], { taille: 16, mono: true });
      EMB.el("rect", { x: 560, y: 70, width: 140, height: 430, rx: 4, fill: "#7d838e", stroke: C.encre, "stroke-width": 1.5 }, g);
      EMB.texte(g, "instruction\ndecode\n&\ncontrol", [630, 285], { taille: 16, coul: "#fff", halo: false });
      EMB.fleche(g, [630, 70], [630, 25], { ep: 9, coul: "#c9ccd3", double: true }); EMB.texte(g, "control", [690, 30], { taille: 16, gras: false });
      EMB.texte(g, "Registres", [840, 90], { taille: 19 });
      ["R0", "R1", "R2"].forEach(function (r, i) {
        EMB.bloc(g, 760, 120 + i * 66, 60, 50, r, { taille: 18, fill: C.fond, mono: true });
        EMB.bloc(g, 826, 120 + i * 66, 110, 50, String(e.v[r]), { taille: 20, mono: true, actif: r === "R0" && k === 4 });
      });
      EMB.texte(g, "R15 = PC", [848, 350], { taille: 17, coul: C.doux, mono: true });
      zone.textContent = e.t;
    }
    dessiner();
  })();
})();
