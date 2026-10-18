(function () {
  "use strict";
  var R = RM, C = R.C;
  function T(g, s, p, o) { o = o || {}; o.italique = false; return R.texte(g, s, p, o); }

  /* ---------- Composer une céramique ---------- */
  (function () {
    var f = R.figure("fig-familles", {
      largeur: 960, hauteur: 440, titre: "Composer une céramique : un métal et un métalloïde",
      essai: "<strong>Essaie</strong> : touche un métal (rose) puis un élément métalloïde ou non métallique (vert ou bleu). <strong>Observe</strong> : la famille de céramique obtenue et un exemple."
    });
    var g = R.el("g", null, f.svg), zone = R.h("div", null, "", f.direct), metal = "Al", autre = "O";
    var M = ["Be", "Al", "Ti", "Zr", "Hf", "Si", "U"], A = [["O", "oxyde"], ["N", "nitrure"], ["C", "carbure"], ["B", "borure"], ["S", "sulfure"]];
    var EX = { "Al-O": "Al₂O₃ (alumine)", "Be-O": "BeO", "Si-O": "SiO₂ (silice)", "Zr-O": "ZrO₂ (zircone)", "B-N": "BN", "Al-N": "AlN", "U-C": "UC", "Ti-C": "TiC", "Hf-C": "HfC (tient jusqu'à 3950 °C)", "Ti-B": "TiB₂ (exemple ajouté)" };
    function dessin() {
      R.vider(g);
      T(g, "métal", [230, 40], { taille: 18, gras: true }); T(g, "métalloïde / non-métal", [700, 40], { taille: 18, gras: true });
      M.forEach(function (s, i) {
        var x = 80 + (i % 4) * 100, y = 90 + Math.floor(i / 4) * 100, sel = s === metal;
        var b = R.el("g", { style: "cursor:pointer" }, g);
        R.el("rect", { x: x, y: y, width: 80, height: 80, rx: 14, fill: s === "Si" ? "#d6f0c9" : "#ffd9e6", stroke: sel ? C.acc : C.fonce, "stroke-width": sel ? 6 : 2 }, b);
        T(b, s, [x + 40, y + 42], { taille: 28, gras: true, halo: false });
        b.addEventListener("click", function () { metal = s; dessin(); });
      });
      A.forEach(function (a, i) {
        var x = 560 + (i % 3) * 110, y = 90 + Math.floor(i / 3) * 100, sel = a[0] === autre;
        var b = R.el("g", { style: "cursor:pointer" }, g);
        R.el("rect", { x: x, y: y, width: 80, height: 80, rx: 14, fill: a[0] === "B" ? "#d6f0c9" : "#d3e5ff", stroke: sel ? C.acc : C.fonce, "stroke-width": sel ? 6 : 2 }, b);
        T(b, a[0], [x + 40, y + 42], { taille: 28, gras: true, halo: false });
        b.addEventListener("click", function () { autre = a[0]; dessin(); });
      });
      var fam = A.filter(function (a) { return a[0] === autre; })[0][1], cle = (metal === "B" ? "B" : metal) + "-" + autre;
      if (metal === "Si" && autre === "B") cle = "x";
      var ex = EX[cle] || (metal === "Al" && autre === "N" ? "AlN" : null);
      R.el("rect", { x: 220, y: 320, width: 520, height: 90, rx: 20, fill: PLATEFORME.teinte(0.12), stroke: C.acc, "stroke-width": 3 }, g);
      T(g, metal + " + " + autre + " → " + fam, [480, 352], { taille: 24, gras: true });
      T(g, ex ? "exemple : " + ex : "un " + fam + " (combinaison non citée au cours)", [480, 386], { taille: 17, couleur: C.doux });
      zone.innerHTML = "<strong>" + fam.charAt(0).toUpperCase() + fam.slice(1) + "</strong> : liaisons ioniques et covalentes, pas d'électrons libres, donc isolant.";
    }
    dessin();
  })();

  /* ---------- Céramique fragile, métal ductile ---------- */
  (function () {
    var f = R.figure("fig-fragile", {
      largeur: 960, hauteur: 460, titre: "Traction d'une céramique et d'un métal (allures)",
      essai: "<strong>Essaie</strong> : augmente la charge. <strong>Observe</strong> : la céramique monte très raide (module élevé) puis casse sans déformation permanente ; le métal se déforme longtemps avant de rompre. Allures qualitatives."
    });
    var g = R.el("g", null, f.svg), cE = R.curseur(f.reglages, { nom: "Déformation", min: 0, max: 100, pas: 1, val: 30, unite: " %", surChange: dessin }), zone = R.h("div", null, "", f.direct);
    var O = [100, 400], W = 780, H = 320;
    function dessin() {
      R.vider(g);
      R.fleche(g, O, [O[0] + W + 30, O[1]], { couleur: C.fonce, epaisseur: 2.5 }); R.fleche(g, O, [O[0], O[1] - H - 30], { couleur: C.fonce, epaisseur: 2.5 });
      T(g, "σ", [O[0] - 20, O[1] - H - 20], { taille: 22, gras: true }); T(g, "ε", [O[0] + W + 30, O[1] + 26], { taille: 22, gras: true });
      var e = cE.v / 100;
      // céramique : droite raide jusqu'à ε = 0,12
      var ec = Math.min(e, 0.12);
      R.ligne(g, O, [O[0] + ec * W, O[1] - ec / 0.12 * 0.95 * H], { couleur: "#b08d4f", epaisseur: 6 });
      if (e >= 0.12) { var q = [O[0] + 0.12 * W, O[1] - 0.95 * H]; R.ligne(g, [q[0] - 12, q[1] - 12], [q[0] + 12, q[1] + 12], { couleur: C.x, epaisseur: 4 }); R.ligne(g, [q[0] + 12, q[1] - 12], [q[0] - 12, q[1] + 12], { couleur: C.x, epaisseur: 4 }); T(g, "céramique : rupture", [q[0] + 24, q[1]], { taille: 17, gras: true, couleur: C.x, ancre: "start" }); }
      else T(g, "céramique", [O[0] + ec * W + 16, O[1] - ec / 0.12 * 0.95 * H], { taille: 16, gras: true, couleur: "#b08d4f", ancre: "start" });
      // métal
      var pts = [O];
      for (var u = 0; u <= e + 1e-9; u += 0.01) { var s = u < 0.1 ? u / 0.1 * 0.45 : 0.45 + 0.25 * Math.sin(Math.min(1, (u - 0.1) / 0.76) * Math.PI / 2); if (u > 0.86) s -= (u - 0.86) * 1.2; pts.push([O[0] + u * W, O[1] - s * H]); }
      R.el("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: "#5b6172", "stroke-width": 6, "stroke-linejoin": "round" }, g);
      if (e > 0.3) T(g, "métal ductile", [O[0] + 0.5 * W, O[1] - 0.78 * H], { taille: 16, gras: true, couleur: "#5b6172" });
      zone.innerHTML = e < 0.12 ? "Les deux matériaux sont dans leur domaine élastique ; la céramique est bien plus raide." : "La céramique a cassé dans son domaine élastique : elle est <strong>fragile</strong>. Le métal, lui, continue à s'allonger.";
    }
    dessin();
  })();
})();
