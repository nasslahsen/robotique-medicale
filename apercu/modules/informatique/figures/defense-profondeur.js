/* Figure : la défense en profondeur, une à trois couches autour des données, chacune avec sa faille. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-couches-def", {
    largeur: 960, hauteur: 540, titre: "La défense en profondeur",
    essai: "<strong>Essaie</strong> : ajoute des couches. <strong>Observe</strong> : chaque couche a sa faille, mais l'attaquant doit toutes les trouver, à des endroits différents."
  });
  var g = A.s("g", null, f.svg), nb = 1, c = [560, 270];
  var R0 = [240, 175, 110], FA = [180, 60, 300], NOMS = ["Pare-feu périmétrique", "Réseau séparé pour les DM", "Contrôle d'accès (AAA)"];
  function pol(r, a) { var t = a * Math.PI / 180; return [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)]; }
  function dessiner() {
    A.vider(g);
    for (var k = 0; k < nb; k++) {
      var r = R0[k], a = FA[k], d = 12, p1 = pol(r, a + d), p2 = pol(r, a - d + 360);
      A.s("path", { d: "M" + p1[0] + " " + p1[1] + " A" + r + " " + r + " 0 1 1 " + p2[0] + " " + p2[1], fill: "none", stroke: A.BACS[k].coul, "stroke-width": 18, "stroke-linecap": "round", opacity: 0.85 }, g);
      A.texte(g, NOMS[k], [40, 60 + k * 36], { taille: 16, ancre: "start", coul: A.BACS[k].coul, gras: 700 });
    }
    A.s("circle", { cx: c[0], cy: c[1], r: 50, fill: C.ko }, g);
    A.texte(g, "Données des patients", c, { taille: 13, coul: "#fff", halo: false, gras: 800, largeur: 84 });
    var pts = [[30, c[1]], pol(R0[0] + 30, 180)], ri;
    for (k = 0; k < nb; k++) {
      ri = R0[k] - 32;
      pts.push(pol(R0[k] + 30, FA[k])); pts.push(pol(ri, FA[k]));
      if (k + 1 < nb) { var a1 = FA[k], a2 = FA[k + 1]; if (a2 < a1) a2 += 360; for (var t = a1 + 10; t < a2; t += 10) pts.push(pol(ri, t)); pts.push(pol(ri, a2)); }
    }
    pts.push(pol(56, FA[nb - 1]));
    A.chemin(g, pts, { coul: "#b07d14", ep: 4, tirets: "12 6" });
    A.icone(g, "pirate", [40, c[1] - 40], 46);
    f.direct.innerHTML = "<strong>" + nb + (nb > 1 ? " couches" : " couche") + "</strong> : l'attaquant doit trouver et exploiter " + nb + (nb > 1 ? " failles" : " faille") + ", une par couche." + (nb === 1 ? " Une seule faille suffit." : "");
  }
  var b = R.boutons(f.reglages);
  [1, 2, 3].forEach(function (k) { var bt = R.bouton(b, k + (k > 1 ? " couches" : " couche"), function () { nb = k; [].forEach.call(b.children, function (x, i) { x.classList.toggle("actif", i === k - 1); }); dessiner(); }); if (k === 1) bt.classList.add("actif"); });
  dessiner();
})();
