(function () {
  "use strict";
  var R = RM, C = R.C;
  function T(g, s, p, o) { o = o || {}; o.italique = false; return R.texte(g, s, p, o); }

  /* ---------- Longueur des chaînes et rupture ---------- */
  (function () {
    var f = R.figure("fig-rupture", {
      largeur: 960, hauteur: 460, titre: "Une éprouvette tirée : chaînes courtes ou longues",
      essai: "<strong>Essaie</strong> : règle la longueur des chaînes, puis tire. <strong>Observe</strong> : avec des chaînes courtes, la fissure passe entre elles ; avec des chaînes longues, elle doit en couper (points rouges)."
    });
    var g = R.el("g", null, f.svg), cL = R.curseur(f.reglages, { nom: "Longueur des chaînes", min: 1, max: 10, pas: 1, val: 2, surChange: function () { tire.checked = false; dessin(); } });
    var b = R.boutons(f.reglages), tire = R.bascule(b, "Tirer", false, dessin), zone = R.h("div", null, "", f.direct);
    function dessin() {
      R.vider(g);
      var Lc = 40 + cL.v * 50, ouvre = tire.checked ? 30 : 0, x0 = 140, x1 = 820, fente = 480, coupees = 0, r = BIO.hasard(cL.v * 7 + 1);
      R.el("rect", { x: x0 - 24, y: 50, width: x1 - x0 + 48, height: 360, rx: 18, fill: "#fbfbfd", stroke: "#c6cbd8", "stroke-width": 2 }, g);
      for (var k = 0; k < 13; k++) {
        var y = 80 + k * 25, x = x0 - r() * Lc;
        while (x < x1) {
          var a = Math.max(x0, x), bb = Math.min(x1, x + Lc - 12);
          if (bb > a) {
            var coupe = tire.checked && a < fente - 2 && bb > fente + 2, longue = cL.v >= 4;
            if (coupe && longue) {
              coupees++;
              R.ligne(g, [a - ouvre, y], [fente - 4 - ouvre, y], { couleur: C.fonce, epaisseur: 3.5 }); R.ligne(g, [fente + 4 + ouvre, y], [bb + ouvre, y], { couleur: C.fonce, epaisseur: 3.5 });
              R.point(g, [fente - 4 - ouvre, y], { r: 4.5, couleur: C.x }); R.point(g, [fente + 4 + ouvre, y], { r: 4.5, couleur: C.x });
            } else {
              var d = tire.checked ? ((a + bb) / 2 < fente ? -ouvre : ouvre) : 0;
              R.ligne(g, [a + d, y], [bb + d, y], { couleur: C.fonce, epaisseur: 3.5 });
            }
          }
          x += Lc;
        }
      }
      if (tire.checked) { R.fleche(g, [100, 230], [40, 230], { couleur: C.x, epaisseur: 4 }); R.fleche(g, [860, 230], [920, 230], { couleur: C.x, epaisseur: 4 }); }
      T(g, cL.v < 4 ? "chaînes courtes" : "chaînes longues, enchevêtrées", [480, 440], { taille: 18, gras: true });
      zone.innerHTML = !tire.checked ? "Coche « Tirer » pour ouvrir une fissure au milieu." : cL.v < 4 ? "La fissure contourne les chaînes : seules des liaisons intermoléculaires (faibles) ont cédé." : coupees + " chaînes coupées : il a fallu rompre des liaisons covalentes. Le matériau est bien plus résistant.";
    }
    dessin();
  })();

  /* ---------- Masse moléculaire et état liquide ---------- */
  (function () {
    var f = R.figure("fig-masse", {
      largeur: 960, hauteur: 480, titre: "Module de relaxation d'un polymère amorphe selon sa masse moléculaire (allure)",
      essai: "<strong>Essaie</strong> : passe de M₁ à M₂ (M₂ > M₁), puis à M₃ → ∞. <strong>Observe</strong> : le plateau caoutchouteux s'allonge et l'état liquide recule vers les hautes températures ; avec une masse infinie, il n'arrive jamais. Courbes qualitatives."
    });
    var g = R.el("g", null, f.svg), cM = R.curseur(f.reglages, { nom: "Masse", min: 1, max: 3, pas: 1, val: 1, surChange: dessin }), zone = R.h("div", null, "", f.direct);
    var O = [110, 410], W = 780, H = 340;
    function px(T) { return O[0] + T / 300 * W; }
    function py(l) { return O[1] - (l - 2.5) / 7.5 * H; }
    function Tl(m) { return m >= 3 ? Infinity : 70 + 80 * m; }
    function courbe(m, coul, ep) {
      var pts = []; for (var T = 0; T <= 300; T += 2) pts.push([px(T), py(BIO.logModule(T, { Tg: 50, Tl: Tl(m), larg: 7 }))]);
      R.el("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: coul, "stroke-width": ep, "stroke-linejoin": "round" }, g);
    }
    function dessin() {
      R.vider(g);
      R.fleche(g, O, [O[0] + W + 30, O[1]], { couleur: C.fonce, epaisseur: 2.5 }); R.fleche(g, O, [O[0], O[1] - H - 30], { couleur: C.fonce, epaisseur: 2.5 });
      T(g, "log E (Pa)", [O[0] + 10, O[1] - H - 30], { taille: 15, gras: true, ancre: "start" }); T(g, "T (°C)", [O[0] + W + 20, O[1] + 48], { taille: 15, gras: true });
      [3, 6, 9].forEach(function (l) { T(g, String(l), [O[0] - 22, py(l)], { taille: 14, couleur: C.doux }); });
      [0, 100, 200, 300].forEach(function (t) { T(g, String(t), [px(t), O[1] + 22], { taille: 14, couleur: C.doux }); });
      for (var m = 1; m <= 3; m++) if (m !== cM.v) courbe(m, "#d9dde6", 3);
      courbe(cM.v, C.acc, 5);
      var nom = cM.v >= 3 ? "M₃ → ∞" : ["", "M₁", "M₂"][cM.v];
      T(g, nom, [px(cM.v >= 3 ? 270 : Tl(cM.v) + 12), py(cM.v >= 3 ? 6.6 : 4.6)], { taille: 20, gras: true, couleur: C.acc, ancre: "start" });
      zone.innerHTML = cM.v >= 3 ? "Masse infinie : le polymère reste sur le plateau caoutchouteux, il n'atteint jamais l'état liquide." : "État liquide vers " + Tl(cM.v) + " °C sur cette courbe : plus la masse est grande, plus il apparaît tard.";
    }
    dessin();
  })();
})();
