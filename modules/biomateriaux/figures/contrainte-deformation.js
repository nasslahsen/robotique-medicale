(function () {
  "use strict";
  var R = RM, C = R.C;

  /* ---------- Contrainte, déformation et module : une éprouvette de Ti-6Al-4V tirée par F ---------- */
  (function () {
    var f = R.figure("fig-contrainte", {
      largeur: 960, hauteur: 480,
      titre: "Éprouvette tirée par une force : contrainte, déformation et droite de Hooke",
      essai: "<strong>Essaie</strong> : garde la même force et passe d'une section de 40 mm² à 10 mm², puis règle F = 4 400 N et S0 = 20 mm². " +
        "<strong>Observe</strong> : à force égale, la section fine a une contrainte quatre fois plus grande. Le point sur la droite de Hooke ne dépend que de σ : sa pente est le module E du Ti-6Al-4V (110 GPa). L'allongement est très exagéré sur le dessin."
    });
    var g = R.el("g", null, f.svg);
    var cF = R.curseur(f.reglages, { nom: "Force F (N)", min: 0, max: 8000, pas: 100, val: 4400, dec: 0 });
    var cS = R.curseur(f.reglages, { nom: "Section S0 (mm²)", min: 5, max: 40, pas: 1, val: 20, dec: 0 });
    [cF, cS].forEach(function (c) { c.surChange(dessin); });
    var E = 110000, l0 = 100; // MPa, mm (valeurs du tableau du cours pour le module ; longueur ajoutée)
    // repère du graphe σ(ε)
    var O = [560, 410], ux = 320 / 0.004, uy = 340 / 440;
    function P(e, s) { return [O[0] + e * ux, O[1] - s * uy]; }
    function dessin() {
      R.vider(g);
      var F = cF.v, S0 = cS.v, sig = F / S0, eps = sig / E, dl = eps * l0;
      // éprouvette : largeur proportionnelle à la racine de la section, allongement exagéré
      var x = 210, larg = 12 * Math.sqrt(S0), L = 250 + dl * 900, y0 = 40;
      R.el("rect", { x: x - 70, y: y0, width: 140, height: 34, rx: 8, fill: "#c6cbd8", stroke: C.fonce, "stroke-width": 2 }, g);
      R.el("rect", { x: x - larg / 2, y: y0 + 34, width: larg, height: L, fill: "#d5dae3", stroke: C.fonce, "stroke-width": 2 }, g);
      R.el("rect", { x: x - 70, y: y0 + 34 + L, width: 140, height: 34, rx: 8, fill: "#c6cbd8", stroke: C.fonce, "stroke-width": 2 }, g);
      if (F > 0) {
        var lf = 20 + F / 8000 * 50;
        R.fleche(g, [x, y0 + 68 + L], [x, y0 + 68 + L + lf], { couleur: C.z, epaisseur: 5 });
        R.texte(g, "F", [x + 24, y0 + 68 + L + lf / 2], { couleur: C.z, gras: true, taille: 22 });
      }
      R.ligne(g, [x - 90, y0 + 34], [x - 90, y0 + 34 + L], { couleur: C.acc, epaisseur: 3 });
      R.texte(g, "l0 = 100 mm", [x - 100, y0 + 34 + L / 2 - 22], { couleur: C.acc, ancre: "end", taille: 15, italique: false });
      R.texte(g, "l0 + Δl", [x - 100, y0 + 34 + L / 2], { couleur: C.acc, ancre: "end", taille: 18, italique: false });
      R.ligne(g, [x - larg / 2, y0 + 34 + L / 2], [x + larg / 2, y0 + 34 + L / 2], { couleur: C.v, epaisseur: 3 });
      R.texte(g, "S0 = " + R.fmt(S0, 0) + " mm²", [x + larg / 2 + 12, y0 + 34 + L / 2], { couleur: C.v, ancre: "start", taille: 17, italique: false, gras: true });
      // graphe σ(ε)
      R.fleche(g, P(0, 0), P(0.0043, 0), { couleur: C.fonce, epaisseur: 2.5 });
      R.fleche(g, P(0, 0), P(0, 460), { couleur: C.fonce, epaisseur: 2.5 });
      R.texte(g, "σ (MPa)", [O[0] + 12, P(0, 460)[1] + 4], { italique: false, ancre: "start", taille: 17 });
      R.texte(g, "ε", [P(0.0043, 0)[0] + 2, O[1] + 24], { taille: 20 });
      [100, 200, 300, 400].forEach(function (v) { R.ligne(g, P(0, v), P(-0.00006, v), { epaisseur: 2 }); R.texte(g, String(v), [O[0] - 12, P(0, v)[1]], { italique: false, ancre: "end", taille: 14, couleur: C.doux }); });
      [0.001, 0.002, 0.003, 0.004].forEach(function (v) { R.ligne(g, P(v, 0), P(v, -6), { epaisseur: 2 }); R.texte(g, R.fmt(v, 3), [P(v, 0)[0], O[1] + 22], { italique: false, taille: 14, couleur: C.doux }); });
      R.ligne(g, P(0, 0), P(0.004, 440), { couleur: C.acc, epaisseur: 4 });
      R.texte(g, "pente E = 110 GPa", [P(0.0027, 300)[0] - 14, P(0.0027, 300)[1] - 14], { italique: false, couleur: C.acc, taille: 16, ancre: "end", gras: true });
      var s = Math.min(sig, 450), e = Math.min(eps, 0.0041), p = P(e, s);
      R.ligne(g, P(0, s), p, { couleur: C.gris, tirets: "5 4" });
      R.ligne(g, P(e, 0), p, { couleur: C.gris, tirets: "5 4" });
      R.el("circle", { cx: p[0], cy: p[1], r: 9, fill: C.z, stroke: "#fff", "stroke-width": 3 }, g);
      R.rendre(f.direct, "\\sigma = \\frac{F}{S_0} = \\frac{" + R.tc(F, 0) + "}{" + R.tc(S0, 0) + "} = " + R.tc(sig, 1) + "\\ \\text{MPa} \\qquad \\varepsilon = \\frac{\\sigma}{E} = " + R.tc(eps, 5) +
        " \\qquad \\Delta l = \\varepsilon\\, l_0 = " + R.tc(dl, 3) + "\\ \\text{mm}");
    }
    dessin();
  })();
})();
