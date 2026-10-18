(function () {
  "use strict";
  var R = RM, C = R.C;
  function ressort(g, x0, x1, y, h, coul, ep, n) {
    var pts = [[x0, y], [x0 + 24, y]];
    for (var i = 0; i < n * 2; i++) pts.push([x0 + 24 + (x1 - x0 - 48) * (i + 0.5) / (n * 2), y + (i % 2 ? h : -h)]);
    pts.push([x1 - 24, y], [x1, y]);
    R.el("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: coul, "stroke-width": ep, "stroke-linejoin": "round", "stroke-linecap": "round" }, g);
  }

  /* ---------- Figure 1 : deux ressorts en parallèle ---------- */
  (function () {
    var f = R.figure("fig-parallele", {
      largeur: 960, hauteur: 460,
      titre: "Charge parallèle aux fibres : deux ressorts côte à côte",
      essai: "<strong>Essaie</strong> : change le taux de fibres φf, puis les modules. " +
        "<strong>Observe</strong> : les deux ressorts ont toujours le même allongement ; la barre de partage montre que les fibres portent presque toute la charge, et ECL suit une droite entre Em et Ef. Valeurs de départ : exemple du cours."
    });
    var g = R.el("g", null, f.svg);
    var cp = R.curseur(f.reglages, { nom: "φf", min: 0, max: 1, pas: 0.01, val: 0.4, dec: 2 });
    var cf = R.curseur(f.reglages, { nom: "Ef (GPa)", min: 10, max: 250, pas: 1, val: 70 });
    var cm = R.curseur(f.reglages, { nom: "Em (GPa)", min: 1, max: 10, pas: 0.1, val: 3, dec: 1 });
    var ce = R.curseur(f.reglages, { nom: "ε (%)", min: 0, max: 2, pas: 0.05, val: 1, dec: 2 });
    [cp, cf, cm, ce].forEach(function (c) { c.surChange(dessin); });
    function dessin() {
      R.vider(g);
      var phi = cp.v, Ef = cf.v, Em = cm.v, eps = ce.v / 100;
      var r = BIO.contraintesLongitudinales(Ef * 1000, Em * 1000, phi, eps), E = BIO.moduleLongitudinal(Ef, Em, phi);
      var x0 = 80, x1 = 420 + eps * 6000;
      R.el("rect", { x: x0 - 30, y: 40, width: 30, height: 300, fill: "#c6cbd8", stroke: C.fonce, "stroke-width": 2 }, g);
      R.el("rect", { x: x1, y: 40, width: 24, height: 300, rx: 5, fill: "#b9c0cc", stroke: C.fonce, "stroke-width": 2 }, g);
      ressort(g, x0, x1, 120, 18 + 30 * phi, C.acc, 3 + 9 * phi, 7);
      ressort(g, x0, x1, 260, 18 + 30 * (1 - phi), C.gris, 3 + 9 * (1 - phi), 7);
      R.texte(g, "fibres : σf = " + R.fmt(r.sf, 0) + " MPa", [x0 + 30, 60], { italique: false, taille: 17, gras: true, couleur: C.acc, ancre: "start" });
      R.texte(g, "matrice : σm = " + R.fmt(r.sm, 0) + " MPa", [x0 + 30, 200], { italique: false, taille: 17, gras: true, couleur: C.doux, ancre: "start" });
      R.fleche(g, [x1 + 28, 190], [x1 + 90, 190], { couleur: C.z, epaisseur: 5 });
      // partage de la charge
      var y = 380, w = 500, pf = r.sc > 0 ? r.partFibres : phi;
      R.texte(g, "partage de la charge", [x0 - 30, y - 14], { italique: false, taille: 15, couleur: C.doux, ancre: "start" });
      R.el("rect", { x: x0 - 30, y: y, width: w * pf, height: 30, fill: C.acc }, g);
      R.el("rect", { x: x0 - 30 + w * pf, y: y, width: w * (1 - pf), height: 30, fill: "#c6cbd8" }, g);
      R.texte(g, "fibres " + Math.round(pf * 100) + " %", [x0 - 20, y + 52], { italique: false, taille: 15, couleur: C.acc, ancre: "start", gras: true });
      R.texte(g, "matrice " + Math.round((1 - pf) * 100) + " %", [x0 - 30 + w, y + 52], { italique: false, taille: 15, ancre: "end", couleur: C.doux });
      // droite ECL(φf)
      var O = [640, 400], W = 280, H = 330, emax = Ef * 1.1, P = function (p, e) { return [O[0] + p * W, O[1] - e / emax * H]; };
      R.fleche(g, O, [O[0] + W + 20, O[1]], { epaisseur: 2 }); R.fleche(g, O, [O[0], O[1] - H - 20], { epaisseur: 2 });
      R.texte(g, "φf", [O[0] + W + 10, O[1] + 20], { taille: 16 }); R.texte(g, "ECL (GPa)", [O[0] + 6, O[1] - H - 30], { italique: false, taille: 15, ancre: "start" });
      R.ligne(g, P(0, Em), P(1, Ef), { couleur: C.acc, epaisseur: 4 });
      R.el("circle", { cx: P(phi, E)[0], cy: P(phi, E)[1], r: 8, fill: C.z, stroke: "#fff", "stroke-width": 2.5 }, g);
      R.texte(g, "Ef", [O[0] + W + 8, P(1, Ef)[1]], { taille: 15, ancre: "start" }); R.texte(g, "Em", [O[0] - 8, P(0, Em)[1] - 12], { taille: 15, ancre: "end" });
      R.rendre(f.direct, "\\sigma_{CL} = " + R.tn(r.sf, 0) + " \\times " + R.tn(phi, 2) + " + " + R.tn(r.sm, 0) + " \\times " + R.tn(1 - phi, 2) + " = " + R.tn(r.sc, 0) + "\\ \\text{MPa} \\qquad E_{CL} = " + R.tn(E, 1) + "\\ \\text{GPa}", false);
    }
    dessin();
  })();

  /* ---------- Figure 2 : résistance longitudinale ---------- */
  (function () {
    var f = R.figure("fig-rupture", {
      largeur: 960, hauteur: 420,
      titre: "Courbes contrainte-déformation de la fibre, de la matrice et du composite",
      essai: "<strong>Essaie</strong> : augmente la déformation imposée jusqu'à la rupture, puis change φf. " +
        "<strong>Observe</strong> : les trois points avancent ensemble (même ε) ; la fibre casse la première à εfu, le composite atteint alors σLtu. Allure du cours, valeurs illustratives (fibre : rupture à 2,5 %, matrice à 4 %)."
    });
    var g = R.el("g", null, f.svg);
    var ce = R.curseur(f.reglages, { nom: "ε imposée (%)", min: 0, max: 3, pas: 0.05, val: 1.5, dec: 2 });
    var cp = R.curseur(f.reglages, { nom: "φf", min: 0.1, max: 0.7, pas: 0.05, val: 0.4, dec: 2 });
    [ce, cp].forEach(function (c) { c.surChange(dessin); });
    var Ef = 70000, Em = 3000, efu = 0.025, emu = 0.04;
    function dessin() {
      R.vider(g);
      var O = [120, 370], P = function (e, s) { return [O[0] + e * 17000, O[1] - s * 0.17]; }, phi = cp.v, e = ce.v / 100;
      R.fleche(g, O, [O[0] + 740, O[1]], { epaisseur: 2.5 }); R.fleche(g, O, [O[0], 40], { epaisseur: 2.5 });
      R.texte(g, "ε", [O[0] + 730, O[1] + 24], { taille: 20 }); R.texte(g, "σ (MPa)", [O[0] + 10, 46], { italique: false, taille: 16, ancre: "start" });
      var sfu = Ef * efu, sLtu = sfu * phi + Em * efu * (1 - phi), smu = Em * emu;
      R.ligne(g, O, P(efu, sfu), { couleur: C.acc, epaisseur: 4 });
      R.ligne(g, O, P(efu, sLtu), { couleur: C.fonce, epaisseur: 4 });
      R.ligne(g, O, P(emu, smu), { couleur: C.gris, epaisseur: 4 });
      R.texte(g, "fibre  σfu", [P(efu, sfu)[0] + 12, P(efu, sfu)[1]], { italique: false, taille: 16, ancre: "start", couleur: C.acc, gras: true });
      R.texte(g, "composite  σLtu", [P(efu, sLtu)[0] + 12, P(efu, sLtu)[1]], { italique: false, taille: 16, ancre: "start", gras: true });
      R.texte(g, "matrice  σmu", [P(emu, smu)[0] - 6, P(emu, smu)[1] - 18], { italique: false, taille: 16, ancre: "middle", couleur: C.doux, gras: true });
      R.ligne(g, P(efu, 0), P(efu, sfu), { couleur: C.x, tirets: "6 5" }); R.texte(g, "εfu", [P(efu, 0)[0], O[1] + 22], { taille: 16, couleur: C.x });
      R.ligne(g, P(emu, 0), P(emu, smu), { couleur: C.gris, tirets: "6 5" }); R.texte(g, "εmu", [P(emu, 0)[0], O[1] + 22], { taille: 16, couleur: C.doux });
      var casse = e >= efu, ee = Math.min(e, efu);
      R.ligne(g, P(e, 0), P(e, 1900), { couleur: C.z, epaisseur: 2, tirets: "3 4" });
      [[Ef, C.acc], [Ef * phi + Em * (1 - phi), C.fonce], [Em, C.gris]].forEach(function (l) { var p = P(ee, l[0] * ee); R.el("circle", { cx: p[0], cy: p[1], r: 7, fill: l[1], stroke: "#fff", "stroke-width": 2 }, g); });
      f.direct.innerHTML = casse ? "Les fibres ont atteint εfu : elles cassent. Le composite a atteint σLtu ≈ <strong>" + R.fmt(sLtu, 0) + " MPa</strong>, alors que la matrice n'est qu'à " + R.fmt(Em * efu, 0) + " MPa."
        : "ε = " + R.fmt(e * 100, 2) + " % : σf = " + R.fmt(Ef * e, 0) + " MPa, σm = " + R.fmt(Em * e, 0) + " MPa, σc = <strong>" + R.fmt((Ef * phi + Em * (1 - phi)) * e, 0) + " MPa</strong>.";
    }
    dessin();
  })();
})();
