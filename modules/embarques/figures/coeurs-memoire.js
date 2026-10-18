(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure 1 : les deux CPU et leurs accès ---------- */
  (function () {
    var f = R.figure("fig-coeurs", {
      largeur: 960, hauteur: 520,
      titre: "PRO_CPU, APP_CPU et leurs mémoires",
      essai: "<strong>Essaie</strong> : choisis un CPU, puis un accès. <strong>Observe</strong> : les deux CPU ont les mêmes chemins (ils sont interchangeables) ; la mémoire externe passe toujours par le cache puis la MMU ; le DMA n'atteint que la mémoire embarquée."
    });
    var g = EMB.el("g", null, f.svg), cpu = "pro", acces = "emb";
    var b = R.boutons(f.reglages), bc = {}, ba = {};
    [["pro", "PRO_CPU"], ["app", "APP_CPU"], ["dma", "DMA"]].forEach(function (x) { bc[x[0]] = R.bouton(b, x[1], function () { cpu = x[0]; if (cpu === "dma") acces = "emb"; dessiner(); }); });
    var b2 = R.boutons(f.reglages);
    [["emb", "Mémoire embarquée"], ["ext", "Mémoire externe"], ["per", "Périphérique"]].forEach(function (x) { ba[x[0]] = R.bouton(b2, x[1], function () { acces = x[0]; dessiner(); }); });
    var zone = R.h("p", null, "", f.direct);
    var M = { dma: [400, 20, 160, 50, "DMA"], emb: [370, 90, 220, 70, "Embedded\nMemory"], cache: [370, 190, 220, 46, "Cache"], mmu: [370, 266, 220, 46, "MMU"], ext: [370, 342, 220, 64, "External\nMemory"], per: [370, 436, 220, 60, "Peripheral"] };
    function dessiner() {
      EMB.vider(g);
      Object.keys(bc).forEach(function (k) { bc[k].classList.toggle("actif", k === cpu); });
      Object.keys(ba).forEach(function (k) { ba[k].classList.toggle("actif", k === acces); ba[k].disabled = cpu === "dma" && k !== "emb"; });
      var chemin = cpu === "dma" ? ["dma", "emb"] : acces === "emb" ? ["emb"] : acces === "ext" ? ["cache", "mmu", "ext"] : ["per"];
      var on = function (k) { return chemin.indexOf(k) >= 0; };
      EMB.bloc(g, 30, 30, 150, 460, "PRO_CPU", { taille: 20, actif: cpu === "pro" });
      EMB.bloc(g, 780, 30, 150, 460, "APP_CPU", { taille: 20, actif: cpu === "app" });
      ["dma", "emb", "cache", "mmu", "ext", "per"].forEach(function (k) { var m = M[k]; EMB.bloc(g, m[0], m[1], m[2], m[3], m[4], { taille: 18, actif: on(k) }); });
      var c = function (k) { return on(k) ? C.acc : C.encre; }, e = function (k) { return on(k) ? 4 : 2.2; };
      var actifCpu = function (s) { return cpu === s; };
      [["pro", 180, 1], ["app", 780, -1]].forEach(function (s) {
        var x0 = s[1], x1 = s[2] > 0 ? 370 : 590, act = actifCpu(s[0]);
        [[125, "emb"], [213, "ext"], [466, "per"]].forEach(function (l) { EMB.fleche(g, [x0, l[0]], [x1, l[0]], { coul: act && acces === l[1] ? C.acc : C.encre, ep: act && acces === l[1] ? 4 : 2.2 }); });
      });
      EMB.fleche(g, [480, 70], [480, 90], { coul: c("dma"), ep: e("dma") });
      EMB.fleche(g, [480, 236], [480, 266], { coul: c("mmu"), ep: e("mmu") });
      EMB.fleche(g, [480, 312], [480, 342], { coul: c("ext"), ep: e("ext") });
      zone.innerHTML = cpu === "dma" ? "Le DMA écrit et lit directement la mémoire embarquée, sans passer par un CPU."
        : (cpu === "pro" ? "PRO_CPU" : "APP_CPU") + (acces === "emb" ? " lit la mémoire embarquée directement." : acces === "ext" ? " lit la mémoire externe : Cache, puis MMU, puis External Memory." : " accède au périphérique par son bus.");
    }
    dessiner();
  })();

  /* ---------- Figure 2 : copier par le CPU ou par le DMA ---------- */
  (function () {
    var f = R.figure("fig-dma", {
      largeur: 960, hauteur: 420,
      titre: "Transfert ADC vers SRAM",
      essai: "<strong>Essaie</strong> : lance la copie par le CPU, puis par le DMA. <strong>Observe</strong> : par le CPU, la barre « temps libre » reste vide ; par le DMA, les mêmes données arrivent en SRAM et le CPU garde son temps pour calculer."
    });
    var g = EMB.el("g", null, f.svg), mode = "dma", t = 0, h = null;
    var b = R.boutons(f.reglages);
    var b1 = R.bouton(b, "Copie par le CPU", function () { lancer("cpu"); });
    var b2 = R.bouton(b, "Copie par le DMA", function () { lancer("dma"); });
    var zone = R.h("p", null, "", f.direct);
    function lancer(m) { mode = m; t = 0; if (h) clearInterval(h); h = setInterval(function () { t += 0.02; if (t >= 1) { t = 1; clearInterval(h); h = null; } dessiner(); }, 40); }
    function dessiner() {
      EMB.vider(g);
      b1.classList.toggle("actif", mode === "cpu"); b2.classList.toggle("actif", mode === "dma");
      var parCpu = mode === "cpu";
      EMB.bloc(g, 30, 160, 150, 100, "ADC", { taille: 20 });
      EMB.bloc(g, 330, 30, 240, 80, parCpu ? "CPU : copie" : "CPU : calcule", { taille: 20, actif: true });
      EMB.el("rect", { x: 280, y: 140, width: 220, height: 160, rx: 10, fill: parCpu ? "#f6f7fb" : C.clair, stroke: parCpu ? C.gris : C.acc, "stroke-width": parCpu ? 2 : 3.5 }, g);
      EMB.texte(g, "DMA_ENGINE", [390, 156], { taille: 17, coul: parCpu ? C.gris : C.encre });
      ["in_link0 … in_linkn", "out_link0 … out_linkn"].forEach(function (s, i) { EMB.bloc(g, 300, 196 + i * 52, 180, 40, s, { taille: 14, op: parCpu ? 0.4 : 1 }); });
      EMB.el("rect", { x: 560, y: 120, width: 50, height: 200, fill: "#eef0f5", stroke: C.encre, "stroke-width": 2 }, g);
      EMB.texte(g, "AHB_BUS", [585, 220], { taille: 15, halo: false }).setAttribute("transform", "rotate(90 585 220)");
      EMB.bloc(g, 680, 120, 160, 200, "", {});
      EMB.el("rect", { x: 692, y: 308 - 176 * t, width: 136, height: 176 * t, fill: EMB.teinte(0.35) }, g);
      EMB.texte(g, "SRAM", [760, 100], { taille: 20 });
      // chemin de la donnée
      var pts = parCpu ? [[180, 210], [450, 70], [585, 70], [585, 220], [680, 220]] : [[180, 178], [280, 178], [500, 178], [585, 178], [680, 178]];
      for (var i = 0; i + 1 < pts.length; i++) EMB.fleche(g, pts[i], pts[i + 1], { ep: 2.5, coul: C.acc, tete: i + 2 < pts.length ? 0.1 : null });
      if (t > 0 && t < 1) {
        var u = (t * 12) % 1 * (pts.length - 1), k = Math.floor(u), fr = u - k, p = [pts[k][0] + (pts[k + 1][0] - pts[k][0]) * fr, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * fr];
        EMB.el("circle", { cx: p[0], cy: p[1], r: 12, fill: C.acc, stroke: "#fff", "stroke-width": 3 }, g);
      }
      // temps libre du CPU
      EMB.texte(g, "temps libre du CPU pendant la copie", [250, 360], { taille: 17, ancre: "start" });
      EMB.el("rect", { x: 250, y: 378, width: 500, height: 26, rx: 13, fill: "#eef0f5" }, g);
      EMB.el("rect", { x: 250, y: 378, width: parCpu ? 0 : 500 * t, height: 26, rx: 13, fill: C.ok }, g);
      zone.innerHTML = parCpu ? "Chaque échantillon passe par le CPU : il ne fait rien d'autre pendant la copie." : "Le DMA copie par le bus AHB, sans intervention du CPU : il reste libre pour traiter les données.";
    }
    dessiner();
  })();

  /* ---------- Figure 3 : à quelle mémoire mène une adresse ---------- */
  (function () {
    var f = R.figure("fig-adresses", {
      largeur: 960, hauteur: 620,
      titre: "System Address Mapping",
      essai: "<strong>Essaie</strong> : tape une adresse en hexadécimal (par exemple 3FFB0000) ou choisis un exemple. <strong>Observe</strong> : la plage qui la contient s'allume, et la flèche montre la mémoire qui répond ; une adresse dans une plage grise ne mène à rien.",
      direct: false
    });
    var g = EMB.el("g", null, f.svg);
    var PLAN = [
      ["0x0000_0000", "0x3F3F_FFFF", null], ["0x3F40_0000", "0x3F7F_FFFF", "cache"], ["0x3F80_0000", "0x3FBF_FFFF", "cache"],
      ["0x3FC0_0000", "0x3FEF_FFFF", null], ["0x3FF0_0000", "0x3FF7_FFFF", "periph"], ["0x3FF8_0000", "0x3FF8_1FFF", "rtcfast"],
      ["0x3FF8_2000", "0x3FF8_FFFF", null], ["0x3FF9_0000", "0x3FF9_FFFF", "rom"], ["0x3FFA_0000", "0x3FFA_DFFF", null],
      ["0x3FFA_E000", "0x3FFF_FFFF", "sram"], ["0x4000_0000", "0x4005_FFFF", "rom"], ["0x4006_0000", "0x4006_FFFF", null],
      ["0x4007_0000", "0x400B_FFFF", "sram"], ["0x400C_0000", "0x400C_1FFF", "rtcfast"], ["0x400C_2000", "0x40BF_FFFF", "cache"],
      ["0x40C0_0000", "0x4FFF_FFFF", null], ["0x5000_0000", "0x5000_1FFF", "rtcslow"], ["0x5000_2000", "0xFFFF_FFFF", null]
    ];
    var DEST = { cache: [600, 30, 250, 80, "Cache, MMU\nExternal Flash / SRAM"], periph: [600, 130, 250, 64, "Peripheral"], rtcfast: [600, 214, 250, 64, "RTC FAST Memory"], rom: [600, 298, 250, 64, "Internal ROM"], sram: [600, 382, 250, 64, "Internal SRAM"], rtcslow: [600, 466, 250, 64, "RTC SLOW Memory"] };
    function val(h) { return parseInt(String(h).replace(/0x|_|\s/gi, ""), 16); }
    var lab = R.h("label", { "class": "curseur" }, "", f.reglages);
    R.h("span", null, "Adresse 0x", lab);
    var inp = R.h("input", { type: "text", value: "3FFB0000", "aria-label": "Adresse en hexadécimal", style: "font: 600 18px JetBrains Mono, monospace; width: 160px; padding: 8px; border: 2px solid #e3e6ee; border-radius: 10px" }, undefined, lab);
    inp.addEventListener("input", dessiner);
    var b = R.boutons(f.reglages);
    ["3FF44000", "40008000", "3FFB0000", "400C0100", "50000100", "3F400000", "3FC01000"].forEach(function (a) { R.bouton(b, "0x" + a.slice(0, 4) + "_" + a.slice(4), function () { inp.value = a; dessiner(); }); });
    function dessiner() {
      EMB.vider(g);
      var v = val(inp.value), ok = /^[0-9a-f_]{1,9}$/i.test(inp.value.trim()) && !isNaN(v) && v <= 0xFFFFFFFF, idx = -1;
      if (ok) PLAN.forEach(function (p, i) { if (v >= val(p[0]) && v <= val(p[1])) idx = i; });
      var y = 26, dest = idx >= 0 ? PLAN[idx][2] : null;
      PLAN.forEach(function (p, i) {
        var h = p[2] ? 34 : 12, m = i === idx;
        EMB.el("rect", { x: 140, y: y, width: 300, height: h, fill: p[2] ? (m ? C.clair : "#fff") : (m ? "#9aa0ad" : "#c6cbd8"), stroke: m ? C.acc : C.encre, "stroke-width": m ? 3.5 : 1.2 }, g);
        if (p[2]) EMB.texte(g, p[0] + " – " + p[1], [290, y + h / 2 + 1], { taille: 14, mono: true, halo: false, gras: false });
        if (m) {
          EMB.texte(g, "0x" + EMB.hexa(v, 8).slice(0, 4) + "_" + EMB.hexa(v, 8).slice(4), [125, y + h / 2], { taille: 16, mono: true, coul: C.acc, ancre: "end" });
          if (dest) { var d = DEST[dest]; EMB.fleche(g, [440, y + h / 2], [600, d[1] + d[3] / 2], { coul: C.acc, ep: 3.5 }); }
        }
        y += h + 2;
      });
      Object.keys(DEST).forEach(function (k) { var d = DEST[k]; EMB.bloc(g, d[0], d[1], d[2], d[3], d[4], { taille: 18, actif: k === dest }); });
      EMB.bloc(g, 872, 389, 78, 50, "DMA", { taille: 17, fill: C.fond });
      EMB.fleche(g, [872, 414], [850, 414], { ep: 2.2, coul: C.gris });
      EMB.texte(g, !ok ? "adresse illisible" : idx < 0 ? "" : dest ? "" : "plage grise : aucune mémoire reliée", [740, 588], { taille: 17, coul: C.ko, ancre: "end" });
    }
    dessiner();
  })();
})();
