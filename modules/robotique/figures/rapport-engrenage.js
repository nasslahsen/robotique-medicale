(function () {
  "use strict";
  var R = RM, C = R.C, PI = Math.PI;

  /* ---------- Figure : deux roues extérieures qui engrènent ---------- */
  (function () {
    var f = R.figure("fig-engrenage", {
      largeur: 960, hauteur: 520,
      titre: "Engrenage extérieur : roue menante 1 et roue menée 2",
      essai: "<strong>Essaie</strong> : règle Z₁ et Z₂, puis fais faire un tour à la roue 1. " +
        "<strong>Observe</strong> : les repères tournent en sens inverses ; la roue 2 fait Z₁/Z₂ de tour ; l'entraxe change avec les nombres de dents, les cercles primitifs (tirets) restent tangents."
    });
    var g = R.el("g", null, f.svg), th = 0;
    var c1 = R.curseur(f.reglages, { nom: "Z₁", min: 10, max: 40, pas: 1, val: 17, surChange: dessiner });
    var c2 = R.curseur(f.reglages, { nom: "Z₂", min: 10, max: 60, pas: 1, val: 20, surChange: dessiner });
    var cm = R.curseur(f.reglages, { nom: "m [mm]", min: 1, max: 4, pas: 0.5, val: 2, dec: 1, surChange: dessiner });
    var b = R.boutons(f.reglages);
    var bt = R.bouton(b, "Un tour de la roue 1", function () {
      bt.disabled = true; var t0 = th;
      R.animer(2600, function (u) { th = t0 + u * 2 * PI; dessiner(); }, function () { bt.disabled = false; });
    });
    R.bouton(b, "Exemple du cours", function () { c1.set(17); c2.set(20); cm.set(2); th = 0; dessiner(); });
    var zone = R.h("div", null, "", f.direct);
    function fleche(c, r, sens, coul) {
      var a0 = 60 * PI / 180, a1 = 120 * PI / 180, Q = function (a) { return [c[0] + r * Math.cos(a), c[1] - r * Math.sin(a)]; };
      var dep = sens > 0 ? a0 : a1, arr = sens > 0 ? a1 : a0, p0 = Q(dep), p1 = Q(arr);
      R.el("path", { d: "M" + p0 + " A" + r + " " + r + " 0 0 " + (sens > 0 ? 0 : 1) + " " + p1, fill: "none", stroke: coul, "stroke-width": 4.5, "stroke-linecap": "round" }, g);
      var t = sens > 0 ? [-Math.sin(arr), -Math.cos(arr)] : [Math.sin(arr), Math.cos(arr)];
      R.el("polygon", { points: [p1[0] + t[0] * 14, p1[1] + t[1] * 14, p1[0] - t[1] * 8, p1[1] + t[0] * 8, p1[0] + t[1] * 8, p1[1] - t[0] * 8].join(","), fill: coul }, g);
    }
    function dessiner() {
      R.vider(g);
      var Z1 = c1.v, Z2 = c2.v, m = cm.v, k = Math.min(380 / (m * (Z2 + 2)), 820 / (m * (Z1 + Z2 + 4))), mp = m * k;
      var a = mp * (Z1 + Z2) / 2, x1 = 480 - (a + mp * (Z2 / 2 + 1) - mp * (Z1 / 2 + 1)) / 2, y = 290;
      var p1 = [x1, y], p2 = [x1 + a, y];
      var r1 = MECA.roue(g, p1, { m: mp, Z: Z1, rot: th, fill: PLATEFORME.teinte(0.22), primitif: C.z, repereCoul: C.acc });
      var r2 = MECA.roue(g, p2, { m: mp, Z: Z2, rot: PI + PI / Z2 - th * Z1 / Z2, fill: "#dfe3ea", primitif: C.z, repereCoul: C.z });
      fleche(p1, r1.ra + 16, 1, C.acc); fleche(p2, r2.ra + 16, -1, C.z);
      R.texte(g, "1", [p1[0], y + r1.ra + 28], { couleur: C.acc, gras: true, taille: 22 });
      R.texte(g, "2", [p2[0], y + r2.ra + 28], { couleur: C.z, gras: true, taille: 22 });
      var ya = y + Math.max(r1.ra, r2.ra) + 60;
      if (ya < 505) {
        R.ligne(g, [p1[0], y + 20], [p1[0], ya + 8], { couleur: C.doux, tirets: "4 4" }); R.ligne(g, [p2[0], y + 20], [p2[0], ya + 8], { couleur: C.doux, tirets: "4 4" });
        R.fleche(g, [(p1[0] + p2[0]) / 2, ya], p1, { couleur: C.fonce, epaisseur: 2.2, tete: 11 }); R.fleche(g, [(p1[0] + p2[0]) / 2, ya], p2, { couleur: C.fonce, epaisseur: 2.2, tete: 11 });
        R.texte(g, "a = " + R.fmt(m * (Z1 + Z2) / 2, 1) + " mm", [(p1[0] + p2[0]) / 2, ya - 16], { italique: false, gras: true, taille: 17 });
      }
      var t1 = th / (2 * PI);
      R.texte(g, "roue 1 : " + R.fmt(t1, 2) + " tour", [30, 30], { italique: false, ancre: "start", taille: 17, couleur: C.acc, gras: true });
      R.texte(g, "roue 2 : " + R.fmt(t1 * Z1 / Z2, 2) + " tour, sens inverse", [30, 56], { italique: false, ancre: "start", taille: 17, couleur: C.z, gras: true });
      R.rendre(zone, "i_{12} = \\frac{Z_1}{Z_2} = \\frac{" + Z1 + "}{" + Z2 + "} = " + R.tn(Z1 / Z2, 3) + " \\qquad d_1 = " + R.tc(m * Z1, 1) + "\\ \\text{mm} \\quad d_2 = " + R.tc(m * Z2, 1) + "\\ \\text{mm} \\qquad a = m\\,\\frac{Z_1 + Z_2}{2} = " + R.tc(m * (Z1 + Z2) / 2, 2) + "\\ \\text{mm}");
    }
    dessiner();
  })();
})();
