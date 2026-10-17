(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure : structure interne d'un pad (diapositive 16) ---------- */
  (function () {
    var f = R.figure("fig-pad", {
      largeur: 700, hauteur: 600,
      titre: "Internal Structure of a Pad",
      essai: "<strong>Essaie</strong> : active IE, OE, WPU, WPD, puis branche le bouton et appuie dessus. <strong>Observe</strong> : sans OE ni tirage, la broche flotte ; avec WPU elle vaut 1 au repos mais un appui l'emporte ; avec OE c'est le périphérique qui impose le niveau ; IE à 0 bloque la lecture.",
      direct: true
    });
    var g = EMB.el("g", null, f.svg);
    var n = { IE: true, OE: false, WPU: false, WPD: false, sortie: 1, bouton: null };
    var b = R.boutons(f.reglages), bt = {};
    ["IE", "OE", "WPU", "WPD"].forEach(function (k) { bt[k] = R.bascule(b, k, n[k], function () { n[k] = bt[k].checked; dessiner(); }); });
    var b2 = R.boutons(f.reglages);
    var bB = R.bascule(b2, "Bouton vers GND branché", false, function () { n.bouton = bB.checked ? (bA.checked) : null; dessiner(); });
    var bA = R.bascule(b2, "Bouton appuyé", false, function () { if (n.bouton !== null) n.bouton = bA.checked; dessiner(); });
    var bS = R.bascule(b2, "Le périphérique envoie 1", true, function () { n.sortie = bS.checked ? 1 : 0; dessiner(); });
    function niveau() {
      if (n.OE) return n.sortie;
      if (n.bouton === true) return 0;
      if (n.WPU && n.WPD) return "?";
      if (n.WPU) return 1;
      if (n.WPD) return 0;
      return "flottant";
    }
    function fil(pts, on) { EMB.el("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: on ? C.acc : C.encre, "stroke-width": on ? 5 : 2.5, "stroke-linejoin": "round" }, g); }
    function resistance(x, y0, y1) {
      var d = "M" + x + " " + y0, h = (y1 - y0) / 8;
      for (var k = 1; k < 8; k++) d += " L" + (x + (k % 2 ? 12 : -12)) + " " + (y0 + k * h);
      EMB.el("path", { d: d + " L" + x + " " + y1, fill: "none", stroke: C.encre, "stroke-width": 2.5 }, g);
    }
    function inter(x, y, ferme) {
      EMB.el("circle", { cx: x, cy: y, r: 4, fill: C.encre }, g); EMB.el("circle", { cx: x, cy: y + 40, r: 4, fill: C.encre }, g);
      EMB.el("line", { x1: x, y1: y + 40, x2: ferme ? x : x + 22, y2: ferme ? y : y + 6, stroke: ferme ? C.acc : C.encre, "stroke-width": ferme ? 5 : 3, "stroke-linecap": "round" }, g);
    }
    function dessiner() {
      EMB.vider(g);
      var v = niveau(), y = 320, lu = n.IE ? v : 0;
      EMB.texte(g, "VDD3P3", [530, 40], { taille: 17 });
      EMB.el("line", { x1: 505, y1: 60, x2: 555, y2: 60, stroke: C.encre, "stroke-width": 3 }, g);
      fil([[530, 60], [530, 100]]); resistance(530, 100, 175); fil([[530, 175], [530, 195]], n.WPU);
      inter(530, 195, n.WPU); fil([[530, 235], [530, y]], n.WPU);
      EMB.texte(g, "WPU", [580, 140], { taille: 18, coul: n.WPU ? C.acc : C.encre });
      fil([[530, y], [530, 405]], n.WPD); inter(530, 405, n.WPD); fil([[530, 445], [530, 460]], n.WPD); resistance(530, 460, 530);
      fil([[530, 530], [530, 545]]);
      EMB.el("line", { x1: 505, y1: 545, x2: 555, y2: 545, stroke: C.encre, "stroke-width": 3 }, g);
      EMB.el("line", { x1: 515, y1: 553, x2: 545, y2: 553, stroke: C.encre, "stroke-width": 3 }, g);
      EMB.texte(g, "GND", [530, 578], { taille: 16 });
      EMB.texte(g, "WPD", [580, 495], { taille: 18, coul: n.WPD ? C.acc : C.encre });
      fil([[400, y], [600, y]], v === 1);
      EMB.el("circle", { cx: 400, cy: y, r: 5, fill: C.encre }, g); EMB.el("circle", { cx: 530, cy: y, r: 5, fill: C.encre }, g);
      EMB.bloc(g, 600, y - 34, 90, 68, "Bonding\npad", { taille: 15 });
      EMB.texte(g, "IE = " + (n.IE ? 1 : 0), [420, 40], { taille: 17, coul: n.IE ? C.acc : C.encre });
      fil([[400, 58], [400, 160], [300, 160]], n.IE);
      fil([[400, y], [400, 210], [300, 210]], v === 1);
      EMB.el("path", { d: "M260 140 L300 140 L300 230 L260 230 A45 45 0 0 1 260 140 Z", fill: "#fff", stroke: C.encre, "stroke-width": 3 }, g);
      EMB.fleche(g, [218, 185], [30, 185], { coul: lu === 1 ? C.acc : C.encre, ep: lu === 1 ? 5 : 2.5 });
      EMB.texte(g, "Routing to\na peripheral", [100, 228], { taille: 15, coul: C.doux, gras: false });
      EMB.texte(g, "lu : " + (lu === 1 || lu === 0 ? lu : lu === "?" ? "?" : "au hasard"), [100, 150], { taille: 19, coul: lu === 1 ? C.acc : C.encre });
      EMB.texte(g, "OE = " + (n.OE ? 1 : 0), [270, 378], { taille: 17, coul: n.OE ? C.acc : C.encre });
      fil([[270, 394], [270, 428]], n.OE);
      EMB.el("polygon", { points: "230,415 230,495 300,455", fill: "#fff", stroke: C.encre, "stroke-width": 3 }, g);
      EMB.texte(g, "Buf", [252, 455], { taille: 15, halo: false });
      fil([[30, 455], [230, 455]], n.sortie === 1);
      EMB.texte(g, "Routing from a peripheral : " + n.sortie, [120, 492], { taille: 15, coul: C.doux, gras: false });
      fil([[300, 455], [400, 455], [400, y]], n.OE && n.sortie === 1);
      if (!n.OE) EMB.el("line", { x1: 330, y1: 440, x2: 360, y2: 470, stroke: C.ko, "stroke-width": 4 }, g);
      if (n.bouton !== null) {
        fil([[690, y + 34], [690, 395]]);
        inter(665, 395, n.bouton);
        EMB.el("line", { x1: 665, y1: 395, x2: 690, y2: 395, stroke: C.encre, "stroke-width": 2.5 }, g);
        fil([[665, 435], [665, 465]]);
        EMB.el("line", { x1: 647, y1: 465, x2: 683, y2: 465, stroke: C.encre, "stroke-width": 3 }, g);
        EMB.texte(g, "bouton", [640, 412], { taille: 14, ancre: "end", coul: C.doux });
      }
      var t = v === 1 ? "1" : v === 0 ? "0" : v === "?" ? "conflit" : "flottante", ok = v === 1 || v === 0;
      EMB.el("rect", { x: 420, y: y - 78, width: 96, height: 40, rx: 10, fill: ok ? C.clair : "#fdecec", stroke: ok ? C.acc : C.ko, "stroke-width": 2 }, g);
      EMB.texte(g, t, [468, y - 58], { taille: ok ? 22 : 15, mono: true, halo: false, coul: ok ? C.encre : C.ko });
      var expl = n.OE ? "OE = 1 : le tampon Buf impose sur la broche le niveau venu du périphérique (" + n.sortie + ")."
        : n.bouton === true ? "Bouton appuyé : la broche est reliée directement à GND, plus fort que le tirage faible. Elle vaut 0."
        : v === "?" ? "WPU et WPD ensemble : la broche est tirée des deux côtés. Réglage sans intérêt."
        : v === 1 ? "WPU seul : la broche est tirée faiblement vers VDD3P3. Elle vaut 1."
        : v === 0 ? "WPD seul : la broche est tirée faiblement vers GND. Elle vaut 0."
        : "Ni OE, ni tirage : la broche flotte, sa lecture est imprévisible.";
      f.direct.innerHTML = "<p>" + expl + (n.IE ? "" : " IE = 0 : la porte ET bloque la lecture, le périphérique lit 0.") + "</p>";
    }
    dessiner();
  })();
})();
