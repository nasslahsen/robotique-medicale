(function () {
  "use strict";
  var R = RM, C = R.C;
  function T(g, s, p, o) { o = o || {}; o.italique = false; return R.texte(g, s, p, o); }

  /* ---------- Courbe log Er – T et état des chaînes ---------- */
  (function () {
    var f = R.figure("fig-courbe", {
      largeur: 960, hauteur: 480, titre: "Module de relaxation d'un polymère amorphe en fonction de la température (allure)",
      essai: "<strong>Essaie</strong> : déplace la température de −100 à 260 °C. <strong>Observe</strong> : le numéro de zone, le module, et à droite l'agitation des chaînes ; choisis aussi le polymère. Courbe qualitative."
    });
    var g = R.el("g", null, f.svg), b = R.boutons(f.reglages);
    var poly = R.choix(b, [["ps", "Tg = 100 °C (comme le polystyrène)"], ["nr", "Tg = −60 °C (comme le caoutchouc naturel)"]], dessin);
    var cT = R.curseur(f.reglages, { nom: "Température", min: -100, max: 260, pas: 5, val: 20, unite: " °C", surChange: dessin }), zone = R.h("div", null, "", f.direct);
    var O = [80, 410], W = 520, H = 330, NOMS = { "0-1": "état vitreux", "1-2": "transition vitreuse", "2-3": "plateau caoutchouteux", "3-4": "transition caoutchouc-liquide", "5": "état liquide" };
    function px(t) { return O[0] + (t + 100) / 360 * W; }
    function py(l) { return O[1] - (l - 2.5) / 7.5 * H; }
    function dessin() {
      R.vider(g);
      var P = poly.value === "ps" ? { Tg: 100, Tl: 190, larg: 6 } : { Tg: -60, Tl: 60, larg: 6 };
      R.fleche(g, O, [O[0] + W + 20, O[1]], { couleur: C.fonce, epaisseur: 2.5 }); R.fleche(g, O, [O[0], O[1] - H - 20], { couleur: C.fonce, epaisseur: 2.5 });
      T(g, "log Er (Pa)", [O[0] + 10, O[1] - H - 24], { taille: 15, gras: true, ancre: "start" });
      [3, 6, 9].forEach(function (l) { T(g, String(l), [O[0] - 20, py(l)], { taille: 14, couleur: C.doux }); });
      [-100, 0, 100, 200].forEach(function (t) { T(g, String(t).replace("-", "−"), [px(t), O[1] + 22], { taille: 14, couleur: C.doux }); });
      T(g, "T (°C)", [O[0] + W, O[1] + 46], { taille: 14, gras: true });
      var pts = []; for (var t = -100; t <= 260; t += 2) pts.push([px(t), py(BIO.logModule(t, P))]);
      R.el("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: C.acc, "stroke-width": 5, "stroke-linejoin": "round" }, g);
      var tc = cT.v, z = BIO.zoneAmorphe(tc, P.Tg, P.Tl, P.larg), l = BIO.logModule(tc, P);
      R.ligne(g, [px(tc), py(10)], [px(tc), O[1]], { couleur: C.z, epaisseur: 2.5, tirets: "6 5" });
      R.el("circle", { cx: px(tc), cy: py(l), r: 9, fill: C.z, stroke: "#fff", "stroke-width": 3 }, g);
      // chaînes à droite
      var cx = 790, cy = 230, agit = z === "0-1" ? 0 : z === "1-2" ? 0.4 : z === "2-3" ? 1 : z === "3-4" ? 1.6 : 2.4;
      R.el("rect", { x: 650, y: 60, width: 280, height: 320, rx: 20, fill: "#fff", stroke: "#c6cbd8", "stroke-width": 2 }, g);
      for (var k = 0; k < 6; k++) {
        var q = [], r = BIO.hasard(40 + k);
        for (var s = 0; s <= 30; s++) { var u = s / 30; q.push([680 + u * 220 + agit * 12 * Math.sin(u * 11 + k * 2 + r()), 95 + k * 48 + (6 + agit * 14) * Math.sin(u * 7 + k) + (z === "5" ? (u - 0.5) * 40 * (k % 2 ? 1 : -1) : 0)]); }
        R.el("path", { d: BIO.cheminLisse(q), fill: "none", stroke: C.fonce, "stroke-width": 3, "stroke-linecap": "round" }, g);
      }
      T(g, "zone " + z + " : " + NOMS[z], [790, 420], { taille: 18, gras: true, couleur: C.acc });
      zone.innerHTML = "À " + tc + " °C : <strong>" + NOMS[z] + "</strong>, log Er ≈ " + R.fmt(l, 1) + "." + (z === "0-1" ? " Une déformation ne fait qu'écarter un peu les atomes." : z === "2-3" ? " De longues sections de chaînes bougent ; l'enchevêtrement retient l'ensemble." : z === "5" ? " Les chaînes se sont désenchevêtrées : le polymère coule." : "");
    }
    dessin();
  })();

  /* ---------- Relaxation de contrainte ---------- */
  (function () {
    var f = R.figure("fig-relaxation", {
      largeur: 960, hauteur: 420, titre: "Relaxation : contrainte à déformation maintenue",
      essai: "<strong>Essaie</strong> : choisis une longueur de chaînes et lance l'essai. <strong>Observe</strong> : la contrainte décroît pendant que les chaînes se désenchevêtrent et se réenchevêtrent ; plus elles sont longues, plus la décroissance est lente. Courbes qualitatives."
    });
    var g = R.el("g", null, f.svg), cL = R.curseur(f.reglages, { nom: "Longueur des chaînes", min: 1, max: 5, pas: 1, val: 2, surChange: function () { t = 1; dessin(); } });
    var b = R.boutons(f.reglages), t = 1, zone = R.h("div", null, "", f.direct);
    R.bouton(b, "Étirer et maintenir", function () { R.animer(2200, function (u) { t = u; dessin(); }); });
    var O = [120, 360], W = 760, H = 280;
    function dessin() {
      R.vider(g);
      R.fleche(g, O, [O[0] + W + 20, O[1]], { couleur: C.fonce, epaisseur: 2.5 }); R.fleche(g, O, [O[0], O[1] - H - 20], { couleur: C.fonce, epaisseur: 2.5 });
      T(g, "σ", [O[0] - 22, O[1] - H], { taille: 22, gras: true }); T(g, "temps", [O[0] + W, O[1] + 26], { taille: 15, gras: true });
      var tau = 0.08 * cL.v;
      [1, 3, 5].forEach(function (L) { if (L === cL.v) return; var q = []; for (var s = 0; s <= 1; s += 0.01) q.push([O[0] + 10 + s * W, O[1] - 20 - (H - 30) * Math.exp(-s / (0.08 * L))]); R.el("polyline", { points: q.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: "#d9dde6", "stroke-width": 3 }, g); });
      var q = []; for (var s = 0; s <= t + 1e-9; s += 0.01) q.push([O[0] + 10 + s * W, O[1] - 20 - (H - 30) * Math.exp(-s / tau)]);
      if (q.length > 1) R.el("polyline", { points: q.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: C.acc, "stroke-width": 5 }, g);
      zone.innerHTML = "Chaînes de longueur " + cL.v + " : la contrainte a perdu la moitié de sa valeur au bout d'environ " + R.fmt(tau * Math.LN2 * 10, 1) + " unités de temps (échelle arbitraire).";
    }
    dessin();
  })();
})();
