(function () {
  "use strict";
  var R = RM, C = R.C, PI = Math.PI, RAD = PI / 180;
  function engr(rA, ZA, phi, ZB) { return phi + PI + PI / ZB + (phi - rA) * ZA / ZB; }
  function vers(c, d, a) { return [c[0] + d * Math.cos(a), c[1] - d * Math.sin(a)]; }

  /* ---------- Figure 1 : train à deux étages, avec ou sans inverseur ---------- */
  (function () {
    var f = R.figure("fig-train", {
      largeur: 960, hauteur: 540,
      titre: "Train d'engrenages à deux étages : vue de face et schéma",
      essai: "<strong>Essaie</strong> : fais faire un tour à la roue 1, change les nombres de dents, puis intercale la roue 5. " +
        "<strong>Observe</strong> : la roue 3 tourne avec la roue 2 ; R₄/₁ est le produit des deux rapports ; avec la roue 5, la roue 4 change de sens mais le rapport garde la même valeur."
    });
    var g = R.el("g", null, f.svg), th = 0;
    var Z = { 1: 15, 2: 45, 3: 12, 4: 36, 5: 14 };
    var cs = [["Z₁", 1, 12, 30], ["Z₂", 2, 30, 60], ["Z₃", 3, 12, 30], ["Z₄", 4, 24, 60]].map(function (c) {
      return R.curseur(f.reglages, { nom: c[0], min: c[2], max: c[3], pas: 1, val: Z[c[1]], surChange: function () { Z[c[1]] = this && this.v; lire(); } });
    });
    function lire() { Z[1] = cs[0].v; Z[2] = cs[1].v; Z[3] = cs[2].v; Z[4] = cs[3].v; dessiner(); }
    var b = R.boutons(f.reglages);
    var inv = R.bascule(b, "Roue inverseuse 5", false, dessiner);
    var bt = R.bouton(b, "Un tour de la roue 1", function () {
      bt.disabled = true; var t0 = th;
      R.animer(3000, function (u) { th = t0 + u * 2 * PI; dessiner(); }, function () { bt.disabled = false; });
    });
    R.bouton(b, "Exemple", function () { [15, 45, 12, 36].forEach(function (v, i) { cs[i].set(v); }); th = 0; lire(); });
    var zone = R.h("div", null, "", f.direct);
    function positions(M) {
      var P = { 2: [0, 0] }, phi = { 12: -45 * RAD };
      P[3] = P[2]; P[1] = vers(P[2], M * (Z[1] + Z[2]) / 2, 135 * RAD);
      if (!inv.checked) { phi[34] = -20 * RAD; P[4] = vers(P[2], M * (Z[3] + Z[4]) / 2, phi[34]); }
      else { phi[35] = 10 * RAD; phi[54] = -35 * RAD; P[5] = vers(P[2], M * (Z[3] + Z[5]) / 2, phi[35]); P[4] = vers(P[5], M * (Z[5] + Z[4]) / 2, phi[54]); }
      return { P: P, phi: phi };
    }
    function dessiner() {
      R.vider(g);
      // échelle : le train tient dans la zone gauche (0 à 620 × 30 à 520)
      var Q = positions(1), x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
      Object.keys(Q.P).forEach(function (k) { var r = Z[k] / 2 + 1, p = Q.P[k]; x0 = Math.min(x0, p[0] - r); x1 = Math.max(x1, p[0] + r); y0 = Math.min(y0, p[1] - r); y1 = Math.max(y1, p[1] + r); });
      var M = Math.min(8, 590 / (x1 - x0), 470 / (y1 - y0)), dx = 315 - M * (x0 + x1) / 2, dy = 275 - M * (y0 + y1) / 2;
      Q = positions(M);
      var P = {}; Object.keys(Q.P).forEach(function (k) { P[k] = [Q.P[k][0] + dx, Q.P[k][1] + dy]; });
      var rot = { 1: th }; rot[2] = engr(rot[1], Z[1], Q.phi[12], Z[2]); rot[3] = rot[2];
      if (!inv.checked) rot[4] = engr(rot[3], Z[3], Q.phi[34], Z[4]);
      else { rot[5] = engr(rot[3], Z[3], Q.phi[35], Z[5]); rot[4] = engr(rot[5], Z[5], Q.phi[54], Z[4]); }
      MECA.roue(g, P[2], { m: M, Z: Z[2], rot: rot[2], fill: "#d6f0e2", op: 0.75, trou: 0, repere: false });
      MECA.roue(g, P[1], { m: M, Z: Z[1], rot: rot[1], fill: "#cfe0ff", trou: M * 1.5 });
      MECA.roue(g, P[3], { m: M, Z: Z[3], rot: rot[3], fill: "#a8dcc0", trou: M * 1.5 });
      if (inv.checked) MECA.roue(g, P[5], { m: M, Z: Z[5], rot: rot[5], fill: "#cfe0ff", trou: M * 1.3 });
      MECA.roue(g, P[4], { m: M, Z: Z[4], rot: rot[4], fill: PLATEFORME.teinte(0.25), trou: M * 1.8 });
      var lab = { 1: 90, 2: 215, 3: 100, 4: -75, 5: 70 };
      Object.keys(P).forEach(function (k) { R.texte(g, k, vers(P[k], M * (Z[k] / 2 + 1) + (k === "3" ? 14 : 22), lab[k] * RAD), { gras: true, italique: false, taille: 22, couleur: k === "4" ? C.acc : C.fonce }); });
      // schéma cinématique à droite : arbres horizontaux, roues en traits verticaux
      var s = Math.min(4, 230 / (Z[1] + Z[2])), X = 730, yA = 90, yB = yA + s * (Z[1] + Z[2]) / 2, yC = yB + s * (Z[3] + (inv.checked ? 2 * Z[5] : 0) + Z[4]) / 2;
      R.texte(g, "schéma", [830, 30], { italique: false, couleur: C.doux, taille: 16 });
      function roueS(x, y, z, coul, nom) { var r = s * z / 2; R.ligne(g, [x, y - r], [x, y + r], { couleur: coul, epaisseur: 6 }); R.ligne(g, [x - 8, y - r], [x + 8, y - r], { couleur: coul, epaisseur: 3 }); R.ligne(g, [x - 8, y + r], [x + 8, y + r], { couleur: coul, epaisseur: 3 }); R.texte(g, nom, [x + 12, y - r - 2], { gras: true, italique: false, taille: 17, ancre: "start", couleur: coul }); }
      R.ligne(g, [X - 40, yA], [X + 20, yA], { couleur: C.fonce, epaisseur: 3 });
      R.ligne(g, [X - 10, yB], [X + 130, yB], { couleur: C.fonce, epaisseur: 3 });
      roueS(X, yA, Z[1], C.z, "1"); roueS(X, yB, Z[2], "#12a26b", "2"); roueS(X + 100, yB, Z[3], "#12a26b", "3");
      var yD = yC;
      if (inv.checked) { var y5 = yB + s * (Z[3] + Z[5]) / 2; R.ligne(g, [X + 80, y5], [X + 120, y5], { couleur: C.fonce, epaisseur: 3 }); roueS(X + 100, y5, Z[5], C.z, "5"); yD = y5 + s * (Z[5] + Z[4]) / 2; }
      R.ligne(g, [X + 80, yD], [X + 220, yD], { couleur: C.acc, epaisseur: 3 });
      roueS(X + 100, yD, Z[4], C.acc, "4");
      var r41 = (Z[1] * Z[3]) / (Z[2] * Z[4]) * (inv.checked ? -1 : 1);
      R.texte(g, "roue 1 : " + R.fmt(th / (2 * PI), 2) + " tour", [700, 470], { italique: false, ancre: "start", taille: 16, couleur: C.z, gras: true });
      R.texte(g, "roue 4 : " + R.fmt(th / (2 * PI) * r41, 3) + " tour", [700, 496], { italique: false, ancre: "start", taille: 16, couleur: C.acc, gras: true });
      R.rendre(zone, "R_{4/1} = \\frac{n_4}{n_1} = " + (inv.checked ? "-" : "") + "\\frac{Z_3 \\cdot Z_1}{Z_4 \\cdot Z_2} = " + (inv.checked ? "-" : "") + "\\frac{" + Z[3] + " \\times " + Z[1] + "}{" + Z[4] + " \\times " + Z[2] + "} = " + R.tn(r41, 4) +
        "\\qquad i_{tot} = \\frac{\\omega_e}{\\omega_s} = " + R.tn(1 / Math.abs(r41), 2));
    }
    dessiner();
  })();

  /* ---------- Figure 2 : étages en cascade, rapport, rendement, couple ---------- */
  (function () {
    var f = R.figure("fig-cascade", {
      largeur: 960, hauteur: 440,
      titre: "Réducteur à N étages : vitesse, couple et puissance d'un arbre à l'autre",
      essai: "<strong>Essaie</strong> : ajoute des étages, change le rapport et le rendement de chaque étage. " +
        "<strong>Observe</strong> : la vitesse est divisée par i_k à chaque étage, le couple multiplié par i_k η_k ; la puissance ne fait que diminuer. Avec 4 étages à 0,95, on perd déjà près de 19 %."
    });
    var g = R.el("g", null, f.svg);
    var cN = R.curseur(f.reglages, { nom: "N étages", min: 1, max: 4, pas: 1, val: 2, surChange: dessiner });
    var ci = R.curseur(f.reglages, { nom: "i_k = ω_e/ω_s", min: 1, max: 6, pas: 0.5, val: 3, dec: 1, surChange: dessiner });
    var ce = R.curseur(f.reglages, { nom: "η_k", min: 0.8, max: 1, pas: 0.01, val: 0.97, dec: 2, surChange: dessiner });
    var zone = R.h("div", null, "", f.direct);
    var nm = 3000, Cm = 0.5;
    function dessiner() {
      R.vider(g);
      var N = cN.v, ik = ci.v, ek = ce.v, w = 820 / (N + 1), base = 360;
      var arbres = [];
      for (var k = 0; k <= N; k++) arbres.push({ n: nm / Math.pow(ik, k), C: Cm * Math.pow(ik * ek, k), P: Cm * 2 * PI * nm / 60 * Math.pow(ek, k) });
      var Cmax = arbres[N].C, x0 = 70;
      R.texte(g, "vitesse", [30, 60], { italique: false, ancre: "start", taille: 15, couleur: C.z, gras: true });
      R.texte(g, "couple", [30, 84], { italique: false, ancre: "start", taille: 15, couleur: C.acc, gras: true });
      R.texte(g, "puissance", [30, 108], { italique: false, ancre: "start", taille: 15, couleur: "#12a26b", gras: true });
      arbres.forEach(function (a, k) {
        var x = x0 + k * w + w / 2;
        if (k < N) {
          R.el("rect", { x: x + w / 2 - 26, y: base - 40, width: 52, height: 80, rx: 10, fill: "#eef0f5", stroke: C.fonce, "stroke-width": 2 }, g);
          R.texte(g, "étage " + (k + 1), [x + w / 2, base + 58], { italique: false, taille: 14, couleur: C.doux });
          R.fleche(g, [x + 30, base], [x + w / 2 - 28, base], { couleur: C.fonce, epaisseur: 2.5 });
          R.ligne(g, [x + w / 2 + 28, base], [x + w - 30, base], { couleur: C.fonce, epaisseur: 2.5 });
        }
        var hv = 200 * a.n / nm, hc = 200 * a.C / Math.max(Cmax, Cm), hp = 200 * a.P / arbres[0].P;
        R.el("rect", { x: x - 30, y: base - 60 - hv, width: 18, height: hv, fill: C.z }, g);
        R.el("rect", { x: x - 9, y: base - 60 - hc, width: 18, height: hc, fill: C.acc }, g);
        R.el("rect", { x: x + 12, y: base - 60 - hp, width: 18, height: hp, fill: "#12a26b" }, g);
        R.texte(g, k === 0 ? "moteur" : k === N ? "sortie" : "arbre " + (k + 1), [x, base + 30], { italique: false, gras: true, taille: 15 });
        R.texte(g, R.fmt(a.n, 0) + " tr/min", [x, base - 60 - Math.max(hv, hc, hp) - 34], { italique: false, taille: 13, couleur: C.z });
        R.texte(g, R.fmt(a.C, 2) + " N·m", [x, base - 60 - Math.max(hv, hc, hp) - 16], { italique: false, taille: 13, couleur: C.acc });
      });
      var it = Math.pow(ik, N), et = Math.pow(ek, N);
      R.rendre(zone, "i_{tot} = " + R.tc(ik, 1) + "^{" + N + "} = " + R.tc(it, 2) + " \\qquad \\eta_{tot} = " + R.tc(ek, 2) + "^{" + N + "} = " + R.tn(et, 3) + " \\qquad C_s \\simeq C_m\\, i_{tot}\\, \\eta_{tot} = 0{,}5 \\times " + R.tc(it, 2) + " \\times " + R.tn(et, 3) + " = " + R.tn(Cm * it * et, 2) + "\\ \\text{N}\\cdot\\text{m}");
    }
    dessiner();
  })();
})();
