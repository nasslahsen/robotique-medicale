(function () {
  "use strict";
  var R = RM, C = R.C;
  function T(g, s, p, o) { o = o || {}; o.italique = false; return R.texte(g, s, p, o); }
  // lamelle cristalline : chaîne repliée dans un rectangle
  function lamelle(g, x, y, w, h, coul) {
    var d = "M" + x + " " + y, n = Math.max(2, Math.floor(h / 10));
    for (var k = 0; k < n; k++) { var yy = y + k * h / n; d += (k % 2 === 0 ? " L" + (x + w) + " " + yy + " Q" + (x + w + 6) + " " + (yy + h / n / 2) + " " + (x + w) + " " + (yy + h / n) : " L" + x + " " + yy + " Q" + (x - 6) + " " + (yy + h / n / 2) + " " + x + " " + (yy + h / n)); }
    R.el("path", { d: d, fill: "none", stroke: coul, "stroke-width": 3, "stroke-linejoin": "round" }, g);
  }

  /* ---------- Taux de cristallinité, courbe et aspect ---------- */
  (function () {
    var f = R.figure("fig-x", {
      largeur: 960, hauteur: 480, titre: "Polymère semi-cristallin : module, structure et aspect (Tg = −10 °C, Tf = 150 °C, courbes qualitatives)",
      essai: "<strong>Essaie</strong> : fais varier le taux de cristallinité X, puis la température. <strong>Observe</strong> : plus X est grand, plus la chute à Tg est petite ; les cristaux (violet) rendent l'échantillon opaque jusqu'à Tf, puis il devient transparent."
    });
    var g = R.el("g", null, f.svg);
    var cX = R.curseur(f.reglages, { nom: "Taux de cristallinité X", min: 0, max: 0.9, pas: 0.1, val: 0.5, dec: 1, surChange: dessin });
    var cT = R.curseur(f.reglages, { nom: "Température", min: -60, max: 220, pas: 5, val: 25, unite: " °C", surChange: dessin }), zone = R.h("div", null, "", f.direct);
    var Tg = -10, Tf = 150, O = [80, 410], W = 520, H = 320;
    function px(t) { return O[0] + (t + 60) / 280 * W; }
    function py(l) { return O[1] - (l - 2.5) / 7.5 * H; }
    function o(X) { return X > 0 ? { Tg: Tg, Tf: Tf, X: X, Tl: Infinity, larg: 6 } : { Tg: Tg, Tl: 60, larg: 6 }; }
    function dessin() {
      R.vider(g);
      var X = cX.v, t = cT.v;
      R.fleche(g, O, [O[0] + W + 20, O[1]], { couleur: C.fonce, epaisseur: 2.5 }); R.fleche(g, O, [O[0], O[1] - H - 20], { couleur: C.fonce, epaisseur: 2.5 });
      T(g, "log Er (Pa)", [O[0] + 10, O[1] - H - 24], { taille: 15, gras: true, ancre: "start" });
      [3, 6, 9].forEach(function (l) { T(g, String(l), [O[0] - 20, py(l)], { taille: 14, couleur: C.doux }); });
      [[Tg, "Tg"], [Tf, "Tf"]].forEach(function (p) { R.ligne(g, [px(p[0]), py(10)], [px(p[0]), O[1]], { couleur: C.gris, epaisseur: 1.5, tirets: "5 5" }); T(g, p[1], [px(p[0]), O[1] + 22], { taille: 15, gras: true, couleur: C.doux }); });
      [0, 0.3, 0.6, 0.9].forEach(function (x) { if (Math.abs(x - X) < 0.01) return; var q = []; for (var s = -60; s <= 220; s += 2) q.push([px(s), py(BIO.logModule(s, o(x)))]); R.el("polyline", { points: q.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: "#e3e6ee", "stroke-width": 3 }, g); });
      var q = []; for (var s = -60; s <= 220; s += 2) q.push([px(s), py(BIO.logModule(s, o(X)))]);
      R.el("polyline", { points: q.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: C.acc, "stroke-width": 5, "stroke-linejoin": "round" }, g);
      R.ligne(g, [px(t), py(10)], [px(t), O[1]], { couleur: C.z, epaisseur: 2.5, tirets: "6 5" });
      R.el("circle", { cx: px(t), cy: py(BIO.logModule(t, o(X))), r: 8, fill: C.z, stroke: "#fff", "stroke-width": 3 }, g);
      // échantillon
      var fondu = t > Tf + 3, cristaux = fondu ? 0 : X;
      T(g, "BIOMATÉRIAUX", [790, 352], { taille: 26, gras: true });
      R.el("rect", { x: 660, y: 70, width: 260, height: 320, rx: 20, fill: "rgba(238,240,245," + (0.15 + 0.8 * Math.min(1, cristaux * 1.6)) + ")", stroke: C.fonce, "stroke-width": 2.5 }, g);
      var r = BIO.hasard(9);
      for (var k = 0; k < 16; k++) { var lx = 684 + (k % 4) * 58 + r() * 10, ly = 92 + Math.floor(k / 4) * 60 + r() * 10; if (r() < cristaux) lamelle(g, lx, ly, 38, 32, C.acc); }
      T(g, fondu ? "fondu : transparent" : cristaux > 0 ? "cristaux : translucide ou opaque" : "amorphe : transparent", [790, 420], { taille: 16, gras: true, couleur: C.acc });
      zone.innerHTML = "X = " + R.fmt(X, 1) + ", T = " + t + " °C : " + (t < Tg ? "vitreux." : fondu ? "au-dessus de Tf, la phase cristalline a fondu." : X > 0 ? "phase cristalline dispersée dans une matrice caoutchouteuse." : "plateau caoutchouteux ou écoulement.");
    }
    dessin();
  })();

  /* ---------- Ramifications et cristallinité ---------- */
  (function () {
    var f = R.figure("fig-ramif", {
      largeur: 960, hauteur: 420, titre: "Les ramifications empêchent les chaînes de s'empiler",
      essai: "<strong>Essaie</strong> : augmente le nombre de ramifications pour 1000 atomes de carbone. <strong>Observe</strong> : les chaînes ne s'alignent plus et le taux de cristallinité passe d'environ 0,9 à environ 0,05 (allure de la diapo)."
    });
    var g = R.el("g", null, f.svg), cB = R.curseur(f.reglages, { nom: "Ramifications / 1000 C", min: 5, max: 70, pas: 5, val: 5, surChange: dessin }), zone = R.h("div", null, "", f.direct);
    function X(b) { return Math.max(0.05, 0.9 - 0.85 * (b - 5) / 65); }
    function dessin() {
      R.vider(g);
      var b = cB.v, x = X(b), nb = Math.round(b / 6), r = BIO.hasard(2);
      for (var k = 0; k < 6; k++) {
        var y = 60 + k * 48, des = (1 - x) * 18;
        var q = []; for (var s = 0; s <= 30; s++) { var u = s / 30; q.push([60 + u * 520, y + des * Math.sin(u * 9 + k * 1.3)]); }
        R.el("path", { d: BIO.cheminLisse(q), fill: "none", stroke: C.fonce, "stroke-width": 4, "stroke-linecap": "round" }, g);
        for (var i = 0; i < nb; i++) { var u2 = (i + 0.5 + (r() - 0.5) * 0.6) / nb, p = [60 + u2 * 520, y + des * Math.sin(u2 * 9 + k * 1.3)]; R.ligne(g, p, [p[0] + 12, p[1] - 22], { couleur: C.acc, epaisseur: 4 }); }
      }
      // graphe X(b)
      var O = [660, 340], W = 260, H = 260;
      R.fleche(g, O, [O[0] + W + 10, O[1]], { couleur: C.fonce, epaisseur: 2 }); R.fleche(g, O, [O[0], O[1] - H - 10], { couleur: C.fonce, epaisseur: 2 });
      T(g, "X", [O[0] - 18, O[1] - H], { taille: 18, gras: true }); T(g, "ramifications / 1000 C", [O[0] + W / 2, O[1] + 40], { taille: 14 });
      [5, 70].forEach(function (v) { T(g, String(v), [O[0] + (v - 5) / 65 * W, O[1] + 18], { taille: 13, couleur: C.doux }); });
      ["0,9", "0,05"].forEach(function (v, i) { T(g, v, [O[0] - 26, O[1] - (i ? 0.05 : 0.9) * H], { taille: 13, couleur: C.doux }); });
      R.ligne(g, [O[0], O[1] - 0.9 * H], [O[0] + W, O[1] - 0.05 * H], { couleur: C.acc, epaisseur: 4 });
      R.el("circle", { cx: O[0] + (b - 5) / 65 * W, cy: O[1] - x * H, r: 9, fill: C.z, stroke: "#fff", "stroke-width": 3 }, g);
      zone.innerHTML = b + " ramifications pour 1000 C : X ≈ " + R.fmt(x, 2) + ". (Interpolation linéaire entre les deux valeurs citées.)";
    }
    dessin();
  })();
})();
