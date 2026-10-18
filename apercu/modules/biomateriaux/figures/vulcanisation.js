(function () {
  "use strict";
  var R = RM, C = R.C;
  function T(g, s, p, o) { o = o || {}; if (o.italique === undefined) o.italique = false; return R.texte(g, s, p, o); }
  function poly(g, pts, o) { return R.el("polyline", { points: pts.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" "), fill: "none", stroke: o.couleur, "stroke-width": o.ep || 5, "stroke-dasharray": o.tirets, "stroke-linejoin": "round", opacity: o.op }, g); }

  /* ---------- Figure 1 : poser des ponts, tirer, relâcher ---------- */
  (function () {
    var f = R.figure("fig-ponts", {
      largeur: 960, hauteur: 460, titre: "Réticulation : des ponts entre les chaînes",
      essai: "<strong>Essaie</strong> : choisis un système, touche les cercles pour poser des ponts, puis tire et relâche. <strong>Observe</strong> : sans pont, les chaînes glissent et restent décalées (écoulement) ; avec trois ponts ou plus, le réseau revient à sa forme."
    });
    var g = R.el("g", null, f.svg), ponts = [], decal = 0, tire = 0, systeme = "s";
    var b = R.boutons(f.reglages);
    var S = { s: ["Soufre", "S–S", "ponts disulfure entre les chaînes d'un élastomère insaturé"], p: ["Peroxyde", "C–C", "ponts C–C entre les chaînes d'un élastomère"], o: ["MgO/ZnO", "C–O–C", "ponts éther entre les chaînes d'un élastomère halogéné"] };
    var bs = Object.keys(S).map(function (k) { return [k, R.bouton(b, S[k][0], function () { systeme = k; dessin(); })]; });
    R.bouton(b, "Enlever les ponts", function () { ponts = []; decal = 0; dessin(); });
    var ct = R.curseur(f.reglages, { nom: "Tirer", min: 0, max: 1, pas: 0.05, val: 0, surChange: function () { tire = ct.v; dessin(); } });
    var b2 = R.boutons(f.reglages);
    R.bouton(b2, "Relâcher", function () {
      if (ponts.length < 3) decal = Math.min(1, decal + tire * 0.9);
      ct.set(0); tire = 0; dessin();
    });
    var zone = R.h("div", null, "", f.direct);
    var sites = [[200, 0], [420, 0], [650, 0], [300, 1], [540, 1], [760, 1]];
    function yC(c, x) { return 130 + c * 120 + 22 * Math.sin(x / 50 + c * 2.1); }
    function dessin() {
      bs.forEach(function (x) { x[1].classList.toggle("actif", x[0] === systeme); });
      R.vider(g);
      var lie = ponts.length >= 3, glisse = lie ? 0 : (decal + tire);
      for (var c = 0; c < 3; c++) {
        var dx = lie ? 0 : (c - 1) * 120 * glisse, ext = lie ? 1 + 0.25 * tire : 1;
        var pts = []; for (var x = 80; x <= 880; x += 16) pts.push([480 + (x - 480) * ext + dx, yC(c, x)]);
        R.el("path", { d: BIO.cheminLisse(pts), fill: "none", stroke: C.fonce, "stroke-width": 3.5, "stroke-linecap": "round" }, g);
      }
      sites.forEach(function (s, i) {
        var ext = lie ? 1 + 0.25 * tire : 1, x = 480 + (s[0] - 480) * ext, y1 = yC(s[1], s[0]), y2 = yC(s[1] + 1, s[0]);
        if (ponts.indexOf(i) >= 0) {
          if (lie || glisse < 0.02) { R.ligne(g, [x, y1], [x, y2], { couleur: C.acc, epaisseur: 6 }); T(g, S[systeme][1], [x + 14, (y1 + y2) / 2], { taille: 15, gras: true, couleur: C.acc, ancre: "start" }); }
        } else {
          var cer = R.el("circle", { cx: x, cy: (y1 + y2) / 2, r: 16, fill: "#fff", stroke: C.z, "stroke-width": 3, style: "cursor:pointer" }, g);
          cer.addEventListener("click", function () { if (ponts.indexOf(i) < 0) { ponts.push(i); decal = 0; dessin(); } });
        }
      });
      T(g, "ponts : " + ponts.length, [880, 420], { taille: 18, gras: true, ancre: "end", couleur: lie ? C.acc : C.fonce });
      zone.innerHTML = S[systeme][0] + " : " + S[systeme][2] + ". " + (lie ? "Réseau formé : tiré, il s'étire ; relâché, il revient." : (decal > 0.02 ? "Les chaînes ont glissé et restent décalées : le caoutchouc brut s'écoule." : "Pas assez de ponts : les chaînes peuvent encore glisser."));
    }
    dessin();
  })();

  /* ---------- Figure 2 : effet du taux de soufre ---------- */
  (function () {
    var f = R.figure("fig-soufre", {
      largeur: 960, hauteur: 500, titre: "Module en fonction de la température pour 0 à 30 % de soufre",
      essai: "<strong>Essaie</strong> : fais varier le taux de soufre, puis ajoute du noir de carbone. <strong>Observe</strong> : le soufre décale Tg vers la droite et relève le plateau, sans le faire disparaître ; le noir de carbone relève le plateau sans déplacer Tg. Courbes illustratives, d'après l'allure des courbes 0, 2, 10 et 30 % du cours."
    });
    var g = R.el("g", null, f.svg);
    var b = R.boutons(f.reglages);
    var noir = R.bascule(b, "Noir de carbone", false, dessin);
    var cs = R.curseur(f.reglages, { nom: "Soufre [%]", min: 0, max: 30, pas: 1, val: 2, surChange: dessin });
    var zone = R.h("div", null, "", f.direct);
    function courbe(T, s, n) { var o = s === 0 ? { Tg: -60, Tl: 30 } : { Tg: -60 + 3.4 * s, caout: 6 + 0.025 * s + (n ? 0.6 : 0), Tl: Infinity }; if (s === 0 && n) o.caout = 6.6; return Math.max(3.1, BIO.logModule(T, o)); }
    function dessin() {
      R.vider(g);
      var X0 = 120, X1 = 860, Y0 = 440, Y1 = 60;
      var px = function (T) { return X0 + (T + 120) / 270 * (X1 - X0); }, py = function (l) { return Y0 - (l - 3) / 7 * (Y0 - Y1); };
      R.fleche(g, [X0, Y0], [X1 + 24, Y0], { couleur: C.fonce, epaisseur: 2.5 }); R.fleche(g, [X0, Y0], [X0, Y1 - 24], { couleur: C.fonce, epaisseur: 2.5 });
      T(g, "T (°C)", [X1 + 20, Y0 - 20], { taille: 16, ancre: "end" }); T(g, "log G (Pa)", [X0 + 10, Y1 - 30], { taille: 16, ancre: "start" });
      [-100, -50, 0, 50, 100, 150].forEach(function (t) { R.ligne(g, [px(t), Y0], [px(t), Y0 + 7], { epaisseur: 2 }); T(g, String(t).replace("-", "−"), [px(t), Y0 + 22], { taille: 14 }); });
      [6, 7, 8, 9].forEach(function (l) { R.ligne(g, [X0 - 7, py(l)], [X0, py(l)], { epaisseur: 2 }); T(g, String(l), [X0 - 14, py(l)], { taille: 14, ancre: "end" }); });
      [0, 2, 10, 30].forEach(function (s) {
        var pts = []; for (var t = -120; t <= 150; t += 2) pts.push([px(t), py(courbe(t, s, false))]);
        poly(g, pts, { couleur: "#d9dde6", ep: 3 });
      });
      var s = cs.v, pts2 = [];
      for (var t2 = -120; t2 <= 150; t2 += 2) pts2.push([px(t2), py(courbe(t2, s, noir.checked))]);
      poly(g, pts2, { couleur: C.acc, ep: 5 });
      var Tg = -60 + 3.4 * s;
      R.ligne(g, [px(Tg), Y0], [px(Tg), py(9.4)], { couleur: C.gris, epaisseur: 2, tirets: "6 5" });
      T(g, "Tg", [px(Tg), py(9.6)], { taille: 17, gras: true, couleur: C.doux });
      var l50 = courbe(50, s, noir.checked);
      R.ligne(g, [px(50), Y0], [px(50), Y1], { couleur: C.z, epaisseur: 2, tirets: "6 6" });
      R.point(g, [px(50), py(l50)], { r: 8, couleur: C.z, contour: "#fff" });
      zone.innerHTML = s + " % de soufre" + (noir.checked ? " + noir de carbone" : "") + " : Tg ≈ " + R.fmt(Tg, 0) + " °C ; à 50 °C, log G ≈ " + R.fmt(l50, 2) + (s === 0 && !noir.checked ? " et la courbe finit par chuter : sans pont, le caoutchouc s'écoule." : ". Les courbes grises : 0, 2, 10 et 30 %.");
    }
    dessin();
  })();

  /* ---------- Figure 3 : cuisson et réversion ---------- */
  (function () {
    var f = R.figure("fig-cuisson", {
      largeur: 960, hauteur: 400, titre: "Module pendant la cuisson",
      essai: "<strong>Essaie</strong> : fais avancer le temps de cuisson. <strong>Observe</strong> : le module monte (temps de vulcanisation), reste à son maximum (temps de plateau), puis peut baisser : la réversion, sensible avec le caoutchouc naturel. Allure illustrative."
    });
    var g = R.el("g", null, f.svg);
    var ct = R.curseur(f.reglages, { nom: "Temps de cuisson", min: 0, max: 1, pas: 0.01, val: 0.3, surChange: dessin });
    var zone = R.h("div", null, "", f.direct);
    function M(u) { if (u < 0.12) return 0.08; if (u < 0.42) { var v = (u - 0.12) / 0.3; return 0.08 + 0.87 * (v * v * (3 - 2 * v)); } if (u < 0.7) return 0.95; var w = (u - 0.7) / 0.3; return 0.95 - 0.35 * w * w; }
    function dessin() {
      R.vider(g);
      var X0 = 110, X1 = 880, Y0 = 340, H = 270, px = function (u) { return X0 + u * (X1 - X0); }, py = function (m) { return Y0 - m * H; };
      [[0.12, 0.42, "temps de vulcanisation"], [0.42, 0.7, "temps de plateau"], [0.7, 1, "réversion"]].forEach(function (z, i) {
        var dans = ct.v >= z[0] && ct.v < z[1] + (i === 2 ? 0.01 : 0);
        R.el("rect", { x: px(z[0]), y: 50, width: px(z[1]) - px(z[0]), height: Y0 - 50, fill: dans ? PLATEFORME.teinte(0.14) : "transparent" }, g);
        T(g, z[2], [(px(z[0]) + px(z[1])) / 2, Y0 + 26], { taille: 15, gras: dans, couleur: dans ? C.acc : C.doux });
      });
      R.fleche(g, [X0, Y0], [X1 + 20, Y0], { couleur: C.fonce, epaisseur: 2.5 }); R.fleche(g, [X0, Y0], [X0, 40], { couleur: C.fonce, epaisseur: 2.5 });
      T(g, "module", [X0 + 10, 44], { taille: 16, ancre: "start" }); T(g, "temps", [X1 + 16, Y0 - 18], { taille: 16, ancre: "end" });
      var pts = []; for (var u = 0; u <= 1.0001; u += 0.01) pts.push([px(u), py(M(u))]);
      poly(g, pts, { couleur: C.acc, ep: 5 });
      R.point(g, [px(ct.v), py(M(ct.v))], { r: 10, couleur: C.z, contour: "#fff" });
      var u0 = ct.v;
      zone.innerHTML = u0 < 0.12 ? "Début de cuisson : le module n'a pas encore commencé à monter." : u0 < 0.42 ? "Le module augmente : on est dans le <strong>temps de vulcanisation</strong>." : u0 < 0.7 ? "Le module reste à son maximum : <strong>temps de plateau</strong>, le bon moment pour arrêter." : "Le module diminue : c'est la <strong>réversion</strong>.";
    }
    dessin();
  })();
})();
