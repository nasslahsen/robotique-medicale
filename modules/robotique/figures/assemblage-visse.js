(function () {
  "use strict";
  var R = RM, C = R.C, M = MECA, GR = "#5b6172";
  function coupe(g, x, y, w, h, angle) { return R.el("rect", { x: x, y: y, width: w, height: h, fill: M.hachures(g, GR, { fond: "#fff", angle: angle }), stroke: C.fonce, "stroke-width": 2.5 }, g); }
  function plein(g, x, y, w, h, rx, on) { return R.el("rect", { x: x, y: y, width: w, height: h, rx: rx || 0, fill: on ? PLATEFORME.teinte(0.3) : "#dfe3ea", stroke: on ? C.acc : C.fonce, "stroke-width": on ? 3.5 : 2.5 }, g); }
  function filets(g, x, y0, y1, w) { for (var y = y0; y < y1; y += 8) R.ligne(g, [x, y], [x + w, y + 4], { epaisseur: 1.1 }); }
  function txt(g, t, p, o) { o = o || {}; R.texte(g, t, p, { italique: false, taille: o.taille || 18, couleur: o.couleur || C.doux, ancre: o.ancre || "middle", gras: o.gras }); }

  /* ---------- Figure 1 : précharge, couple de serrage et coefficient K ---------- */
  (function () {
    var f = R.figure("fig-precharge", {
      largeur: 960, hauteur: 540,
      titre: "Boulon préchargé : vis tendue, pièces comprimées",
      essai: "<strong>Essaie</strong> : règle le couple de serrage, puis change seulement K (lubrification, revêtement). " +
        "<strong>Observe</strong> : à couple égal, la précharge change avec K ; plus la précharge est grande, plus la vis est tendue et les pièces comprimées."
    });
    var g = R.el("g", null, f.svg);
    var cT = R.curseur(f.reglages, { nom: "T [N·m]", min: 0, max: 10, pas: 0.1, val: 4.8, surChange: dessiner });
    var cK = R.curseur(f.reglages, { nom: "K", min: 0.10, max: 0.30, pas: 0.01, val: 0.20, dec: 2, surChange: dessiner });
    var b = R.boutons(f.reglages), dmm = 6, bd = {};
    [4, 5, 6, 8].forEach(function (d) { bd[d] = R.bouton(b, "M" + d, function () { dmm = d; dessiner(); }); });
    R.bouton(b, "Exemple du cours", function () { dmm = 6; cT.set(4.8); cK.set(0.2); dessiner(); });
    var zone = R.h("div", null, "", f.direct);
    function dessiner() {
      R.vider(g);
      Object.keys(bd).forEach(function (k) { bd[k].classList.toggle("actif", +k === dmm); });
      var F0 = cT.v / (cK.v * dmm / 1000), k = Math.min(1.8, F0 / 4000), Lf = 16 + 70 * k, ep = 2 + 3 * k;
      var x0 = 300, w = 4 + dmm * 4.5;
      coupe(g, 120, 190, 360, 110, 45); coupe(g, 120, 300, 360, 110, -45);
      R.el("rect", { x: x0 - w / 2 - 6, y: 190, width: w + 12, height: 220, fill: "#fff" }, g);
      plein(g, x0 - w / 2, 180, w, 290); filets(g, x0 - w / 2, 380, 468, w);
      plein(g, x0 - w * 1.6, 140, w * 3.2, 40, 4); plein(g, x0 - w * 1.6, 410, w * 3.2, 40, 4);
      if (F0 > 1) {
        R.fleche(g, [x0, 132], [x0, 132 - Lf], { couleur: C.v, epaisseur: ep }); R.fleche(g, [x0, 458], [x0, 458 + Lf], { couleur: C.v, epaisseur: ep });
        [170, 430].forEach(function (x) { R.fleche(g, [x, 184 - Lf], [x, 186], { couleur: C.z, epaisseur: ep }); R.fleche(g, [x, 416 + Lf], [x, 414], { couleur: C.z, epaisseur: ep }); });
      }
      txt(g, "vis en traction", [x0 + 20, 70], { couleur: C.v, ancre: "start", gras: true });
      txt(g, "pièces en compression", [460, 512], { couleur: C.z, ancre: "end", gras: true });
      txt(g, "plan de joint", [488, 300], { ancre: "start" });
      // jauge de précharge
      var gx = 700, gy = 440, H = 320, F = Math.min(F0, 10000);
      R.el("rect", { x: gx, y: gy - H, width: 60, height: H, rx: 10, fill: "#f6f7fa", stroke: C.trait, "stroke-width": 2 }, g);
      R.el("rect", { x: gx, y: gy - H * F / 10000, width: 60, height: H * F / 10000, rx: 10, fill: C.acc }, g);
      [0, 2.5, 5, 7.5, 10].forEach(function (v) { txt(g, R.fmt(v, 1) + " kN", [gx + 72, gy - H * v / 10], { ancre: "start", taille: 15 }); });
      R.ligne(g, [gx - 8, gy - H * 0.4], [gx + 68, gy - H * 0.4], { couleur: C.fonce, epaisseur: 2, tirets: "6 4" });
      txt(g, "F₀ = " + R.fmt(F0 / 1000, 2) + " kN", [gx + 30, gy + 40], { couleur: C.fonce, gras: true, taille: 20 });
      txt(g, "4 kN", [gx - 14, gy - H * 0.4], { ancre: "end", taille: 15 });
      R.rendre(zone, "F_0 \\simeq \\frac{T}{K d} = \\frac{" + R.tc(cT.v, 2) + "}{" + R.tc(cK.v, 2) + " \\times " + R.tc(dmm / 1000, 3) + "} \\approx " + R.tn(F0 / 1000, 2) + "\\ \\text{kN} \\qquad (M" + dmm + ",\\ d = " + dmm + "\\ \\text{mm})");
    }
    dessiner();
  })();

  /* ---------- Figure 2 : quatre éléments d'assemblage vissé ---------- */
  (function () {
    var f = R.figure("fig-types", {
      largeur: 960, hauteur: 420,
      titre: "Vis d'assemblage, vis de pression, boulon, goujon",
      essai: "<strong>Essaie</strong> : choisis un élément. <strong>Observe</strong> : où il est vissé, s'il a un écrou, ce qui serre."
    });
    var g = R.el("g", null, f.svg);
    var T = [
      ["assemblage", "Vis d'assemblage", "Elle traverse la pièce du haut (trou lisse) et se visse dans la pièce du bas, taraudée. Sa tête serre la pièce du haut."],
      ["pression", "Vis de pression", "Elle se visse dans une pièce et appuie par son bout sur l'autre : c'est le principe de la vis sur méplat."],
      ["boulon", "Boulon", "Vis et écrou : les deux pièces sont seulement percées ; on serre l'épaisseur entre la tête et l'écrou."],
      ["goujon", "Goujon", "Tige filetée aux deux bouts, bloquée à fond de filet dans la pièce d'implantation ; un écrou serre la pièce du dessus."]
    ];
    var choisi = "assemblage", bb = {}, b = R.boutons(f.reglages);
    T.forEach(function (t) { bb[t[0]] = R.bouton(b, t[1], function () { choisi = t[0]; dessiner(); }); });
    var info = R.h("p", null, "", f.direct);
    function dessiner() {
      R.vider(g);
      T.forEach(function (t, i) {
        var x = 20 + i * 235, y = 30, on = choisi === t[0], cx = x + 108;
        R.el("rect", { x: x, y: y, width: 216, height: 360, rx: 18, fill: on ? PLATEFORME.teinte(0.08) : "#fafbfd", stroke: on ? C.acc : C.trait, "stroke-width": on ? 3 : 2 }, g);
        txt(g, t[1], [cx, y + 32], { couleur: on ? C.acc : C.fonce, gras: true });
        if (i === 0) {
          coupe(g, x + 20, 150, 176, 70, 45); coupe(g, x + 20, 220, 176, 120, -45);
          R.el("rect", { x: cx - 16, y: 150, width: 32, height: 70, fill: "#fff" }, g);
          plein(g, cx - 12, 140, 24, 150, 0, on); filets(g, cx - 12, 230, 288, 24); plein(g, cx - 30, 110, 60, 30, 6, on);
        } else if (i === 1) {
          coupe(g, x + 20, 140, 176, 80, 45); R.el("rect", { x: x + 20, y: 220, width: 176, height: 110, fill: "#e8edf5", stroke: C.fonce, "stroke-width": 2.5 }, g);
          R.el("rect", { x: cx - 13, y: 140, width: 26, height: 80, fill: "#fff" }, g);
          plein(g, cx - 12, 112, 24, 108, 0, on); filets(g, cx - 12, 140, 216, 24); R.ligne(g, [cx - 6, 112], [cx + 6, 112], { epaisseur: 4 });
          R.fleche(g, [cx + 44, 170], [cx + 44, 216], { couleur: C.v, epaisseur: 4 });
        } else if (i === 2) {
          coupe(g, x + 20, 150, 176, 70, 45); coupe(g, x + 20, 220, 176, 70, -45);
          R.el("rect", { x: cx - 16, y: 150, width: 32, height: 140, fill: "#fff" }, g);
          plein(g, cx - 12, 134, 24, 196, 0, on); filets(g, cx - 12, 290, 326, 24);
          plein(g, cx - 32, 106, 64, 44, 4, on); plein(g, cx - 32, 290, 64, 34, 4, on);
          txt(g, "écrou", [cx + 40, 340], { ancre: "start", taille: 15 });
        } else {
          coupe(g, x + 20, 180, 176, 60, 45); coupe(g, x + 20, 240, 176, 100, -45);
          R.el("rect", { x: cx - 16, y: 180, width: 32, height: 60, fill: "#fff" }, g);
          plein(g, cx - 12, 110, 24, 190, 0, on); filets(g, cx - 12, 110, 146, 24); filets(g, cx - 12, 246, 298, 24);
          plein(g, cx - 32, 146, 64, 34, 4, on);
          txt(g, "implantation", [cx, 362], { taille: 15 });
        }
      });
      Object.keys(bb).forEach(function (k) { bb[k].classList.toggle("actif", k === choisi); });
      var t = T.filter(function (x) { return x[0] === choisi; })[0];
      info.innerHTML = "<b>" + t[1] + "</b> : " + t[2];
    }
    dessiner();
  })();
})();
