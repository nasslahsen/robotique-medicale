(function () {
  "use strict";
  var R = RM, C = R.C;
  function T(g, s, p, o) { o = o || {}; o.italique = false; return R.texte(g, s, p, o); }

  /* ---------- Densité d'un semi-cristallin ---------- */
  (function () {
    var f = R.figure("fig-densite", {
      largeur: 960, hauteur: 380, titre: "Densité d'un semi-cristallin : moyenne pondérée des deux phases",
      essai: "<strong>Essaie</strong> : fais varier X, ρa et ρc. <strong>Observe</strong> : la densité se place entre ρa et ρc, proportionnellement à X. Valeurs de départ : plaque du TD."
    });
    var g = R.el("g", null, f.svg);
    var cX = R.curseur(f.reglages, { nom: "X", min: 0, max: 1, pas: 0.05, val: 0.5, dec: 2, surChange: dessin });
    var cA = R.curseur(f.reglages, { nom: "ρa (g/cm³)", min: 0.8, max: 1.3, pas: 0.01, val: 1, dec: 2, surChange: dessin });
    var cC = R.curseur(f.reglages, { nom: "ρc (g/cm³)", min: 0.9, max: 1.5, pas: 0.01, val: 1.2, dec: 2, surChange: dessin });
    function dessin() {
      R.vider(g);
      var X = cX.v, ra = cA.v, rc = Math.max(cC.v, ra + 0.01), rho = BIO.densiteSemiCristallin(rc, ra, X);
      // bloc de 10 cm³ partagé entre les deux phases
      var x0 = 60, w = 380, y0 = 80, h = 200, wc = w * X;
      R.el("rect", { x: x0, y: y0, width: wc, height: h, fill: PLATEFORME.teinte(0.55) }, g);
      R.el("rect", { x: x0 + wc, y: y0, width: w - wc, height: h, fill: "#f3f4f8" }, g);
      R.el("rect", { x: x0, y: y0, width: w, height: h, fill: "none", stroke: C.fonce, "stroke-width": 3, rx: 6 }, g);
      if (X > 0.12) T(g, "cristallin", [x0 + wc / 2, y0 + h / 2], { taille: 16, gras: true });
      if (X < 0.88) T(g, "amorphe", [x0 + wc + (w - wc) / 2, y0 + h / 2], { taille: 16, gras: true });
      T(g, R.fmt(X * 10, 1) + " cm³", [x0 + wc / 2, y0 + h + 24], { taille: 14, couleur: C.doux });
      T(g, R.fmt((1 - X) * 10, 1) + " cm³", [x0 + wc + (w - wc) / 2, y0 + h + 24], { taille: 14, couleur: C.doux });
      // échelle des densités
      var a = 520, b = 900, y = 180, sc = function (r) { return a + (r - ra) / (rc - ra) * (b - a); };
      R.ligne(g, [a, y], [b, y], { couleur: C.fonce, epaisseur: 4 });
      R.point(g, [a, y], { r: 8, couleur: C.gris }); R.point(g, [b, y], { r: 8, couleur: C.acc });
      T(g, "ρa = " + R.fmt(ra, 2), [a, y + 32], { taille: 15, gras: true }); T(g, "ρc = " + R.fmt(rc, 2), [b, y + 32], { taille: 15, gras: true, couleur: C.acc });
      R.el("circle", { cx: sc(rho), cy: y, r: 11, fill: C.z, stroke: "#fff", "stroke-width": 3 }, g);
      T(g, "ρ = " + R.fmt(rho, 3), [sc(rho), y - 34], { taille: 18, gras: true, couleur: C.z });
      R.rendre(f.direct, "\\rho = " + R.tn(rc, 2) + " \\times " + R.tn(X, 2) + " + " + R.tn(ra, 2) + " \\times " + R.tn(1 - X, 2) + " = " + R.tn(rho, 3) + "\\ \\text{g/cm}^3 \\qquad m = \\rho \\times 10\\ \\text{cm}^3 = " + R.tn(rho * 10, 2) + "\\ \\text{g}");
    }
    dessin();
  })();

  /* ---------- La plaque du TD 1.1 ---------- */
  (function () {
    var f = R.figure("fig-plaque", {
      largeur: 960, hauteur: 400, titre: "Plaque du TD 1.1 : trois histoires thermiques",
      essai: "<strong>Essaie</strong> : choisis ce qu'on fait subir à la plaque. <strong>Observe</strong> : la masse ne change jamais (11 g) ; seul un passage au-dessus de Tf suivi d'une trempe supprime les cristaux, baisse la densité et fait gonfler la plaque à 11 cm³."
    });
    var g = R.el("g", null, f.svg), b = R.boutons(f.reglages), etat = 0, bts = [];
    var ETATS = [["Moulée, X = 50 %", 0.5], ["Chauffée à 150 °C puis trempée", 0.5], ["Chauffée à 250 °C puis trempée", 0]];
    ETATS.forEach(function (e, i) { bts.push(R.bouton(b, e[0], function () { etat = i; dessin(); })); });
    function dessin() {
      R.vider(g);
      bts.forEach(function (bt, i) { bt.classList.toggle("actif", i === etat); });
      var X = ETATS[etat][1], rho = BIO.densiteSemiCristallin(1.2, 1, X), V = 11 / rho, ep = 50 * V / 10;
      var x0 = 80, y0 = 200, L = 420, P = 160;
      R.polygone(g, [[x0, y0], [x0 + L, y0], [x0 + L, y0 + ep], [x0, y0 + ep]], { remplissage: "#e9eaf0", couleur: C.fonce, epaisseur: 2.5 });
      R.polygone(g, [[x0 + L, y0], [x0 + L + P, y0 - P * 0.5], [x0 + L + P, y0 - P * 0.5 + ep], [x0 + L, y0 + ep]], { remplissage: "#d7d9e2", couleur: C.fonce, epaisseur: 2.5 });
      R.polygone(g, [[x0, y0], [x0 + L, y0], [x0 + L + P, y0 - P * 0.5], [x0 + P, y0 - P * 0.5]], { remplissage: "#f6f6fa", couleur: C.fonce, epaisseur: 2.5 });
      var r = BIO.hasard(5);
      for (var i = 0; i < 10; i++) for (var k = 0; k < 4; k++) { if (r() > X) continue; var u = (i + 0.2) / 10, v = (k + 0.2) / 4, f2 = function (a, c) { return [x0 + a * L + c * P, y0 - c * P * 0.5]; }; R.polygone(g, [f2(u, v), f2(u + 0.06, v), f2(u + 0.06, v + 0.15), f2(u, v + 0.15)], { remplissage: PLATEFORME.teinte(0.55) }); }
      [["X", R.fmt(X, 1)], ["ρ", R.fmt(rho, 1) + " g/cm³"], ["m", "11 g"], ["V", R.fmt(V, 0) + " cm³"]].forEach(function (l, j) {
        T(g, l[0] + " = " + l[1], [790, 120 + j * 50], { taille: 22, gras: true, couleur: j === 3 ? C.acc : C.fonce });
      });
      T(g, etat === 0 ? "état de départ" : etat === 1 ? "150 °C < Tf : rien ne fond" : "250 °C > Tf : tout fond, la trempe fige l'amorphe", [330, 340], { taille: 17, gras: true, couleur: C.doux });
    }
    dessin();
  })();
})();
