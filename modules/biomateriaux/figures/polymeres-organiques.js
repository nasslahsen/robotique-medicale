(function () {
  "use strict";
  var R = RM, C = R.C;
  function T(g, s, p, o) { o = o || {}; o.italique = false; return R.texte(g, s, p, o); }

  /* ---------- Échelle des modules ---------- */
  (function () {
    var f = R.figure("fig-echelle", {
      largeur: 960, hauteur: 380, titre: "Modules d'Young sur une échelle logarithmique",
      essai: "<strong>Essaie</strong> : touche un matériau. <strong>Observe</strong> : les polymères occupent toute la partie basse de l'échelle (0,001 à 3 GPa), loin des métaux et des céramiques. Valeurs du cours."
    });
    var g = R.el("g", null, f.svg), zone = R.h("div", null, "", f.direct), sel = 0;
    var MAT = [
      { n: "polymères (valeurs typiques)", a: 0.001, b: 3, c: C.acc },
      { n: "Ti-6Al-4V", a: 110, c: "#8e97a6" },
      { n: "acier SAE 1010", a: 207, c: "#5b6172" },
      { n: "céramique (ordre de grandeur)", a: 200, c: "#b08d4f" },
      { n: "polymères (valeurs extrêmes)", a: 0.0001, b: 100, c: PLATEFORME.teinte(0.5) }
    ];
    function x(v) { return 80 + (Math.log10(v) + 4) / 7 * 800; }
    function dessin() {
      R.vider(g);
      R.ligne(g, [x(1e-4), 230], [x(1000), 230], { couleur: C.fonce, epaisseur: 3 });
      for (var l = -3; l <= 3; l++) { R.ligne(g, [x(Math.pow(10, l)), 220], [x(Math.pow(10, l)), 240], { couleur: C.fonce, epaisseur: 3 }); T(g, String(Math.pow(10, l)).replace(".", ","), [x(Math.pow(10, l)), 264], { taille: 15, couleur: C.doux }); }
      T(g, "E (GPa)", [x(1000), 296], { taille: 15, gras: true });
      MAT.forEach(function (m, i) {
        var y = i === 4 ? 180 : i === 0 ? 140 : 140;
        var b = R.el("g", { style: "cursor:pointer" }, g), on = i === sel;
        if (m.b) R.el("rect", { x: x(m.a), y: i === 4 ? 186 : 196, width: x(m.b) - x(m.a), height: i === 4 ? 10 : 22, rx: 6, fill: m.c, opacity: on ? 1 : 0.55 }, b);
        else R.el("circle", { cx: x(m.a), cy: 207, r: on ? 12 : 9, fill: m.c, stroke: "#fff", "stroke-width": 2 }, b);
        b.addEventListener("click", function () { sel = i; dessin(); });
      });
      var bt = R.el("g", null, g);
      MAT.forEach(function (m, i) {
        var bx = 40 + i * 180, b = R.el("g", { style: "cursor:pointer" }, bt);
        R.el("rect", { x: bx, y: 40, width: 170, height: 60, rx: 12, fill: i === sel ? PLATEFORME.teinte(0.15) : "#fff", stroke: i === sel ? C.acc : "#c6cbd8", "stroke-width": i === sel ? 3 : 2 }, b);
        var mots = m.n.split(" (");
        T(b, mots[0], [bx + 85, mots[1] ? 62 : 72], { taille: 15, gras: true });
        if (mots[1]) T(b, "(" + mots[1], [bx + 85, 84], { taille: 13, couleur: C.doux });
        b.addEventListener("click", function () { sel = i; dessin(); });
      });
      var m = MAT[sel];
      T(g, m.b ? (String(m.a).replace(".", ",") + " à " + m.b + " GPa") : ("E ≈ " + m.a + " GPa"), [480, 340], { taille: 22, gras: true, couleur: C.fonce });
      zone.innerHTML = "<strong>" + m.n + "</strong> : " + (m.b ? String(m.a).replace(".", ",") + " à " + m.b + " GPa." : m.a + " GPa, soit " + Math.round(m.a / 3) + " fois au moins le haut de la plage typique des polymères.");
    }
    dessin();
  })();

  /* ---------- Chaleur et déformation réversible ---------- */
  (function () {
    var f = R.figure("fig-chaleur", {
      largeur: 960, hauteur: 460, titre: "Un tube en polymère : étiré, chauffé",
      essai: "<strong>Essaie</strong> : étire le tube jusqu'à 100 % et relâche, puis chauffe-le. <strong>Observe</strong> : jusqu'à environ 100 %, il revient à sa longueur ; au-delà de 200 °C, plus aucun polymère n'a de résistance intéressante. Allure qualitative de la résistance."
    });
    var g = R.el("g", null, f.svg), cD = R.curseur(f.reglages, { nom: "Étirement", min: 0, max: 100, pas: 5, val: 0, unite: " %", surChange: dessin });
    var cT = R.curseur(f.reglages, { nom: "Température", min: 20, max: 300, pas: 5, val: 20, unite: " °C", surChange: dessin }), zone = R.h("div", null, "", f.direct);
    function res(T) { return 1 / (1 + Math.exp((T - 150) / 18)); }
    function dessin() {
      R.vider(g);
      var d = cD.v / 100, L = 220 * (1 + d), r = res(cT.v);
      T(g, "tube souple, 10 cm au repos", [230, 70], { taille: 17, gras: true });
      R.el("rect", { x: 230 - L / 2, y: 150 + (1 - r) * 40, width: L, height: 60 - (1 - r) * 30, rx: 28, fill: PLATEFORME.teinte(0.3 + 0.2 * r), stroke: C.acc, "stroke-width": 3 }, g);
      R.ligne(g, [120, 260], [340, 260], { couleur: C.fonce, epaisseur: 2.5 });
      T(g, "10 cm", [230, 284], { taille: 15 });
      T(g, "longueur : " + R.fmt(10 * (1 + d), 1) + " cm", [230, 330], { taille: 20, gras: true, couleur: C.acc });
      // courbe résistance-température
      var O = [520, 400], W = 400, H = 280;
      R.fleche(g, O, [O[0] + W + 20, O[1]], { couleur: C.fonce, epaisseur: 2.5 }); R.fleche(g, O, [O[0], O[1] - H - 20], { couleur: C.fonce, epaisseur: 2.5 });
      T(g, "résistance", [O[0] + 10, O[1] - H - 24], { taille: 15, gras: true, ancre: "start" });
      var pts = []; for (var t = 0; t <= 300; t += 5) pts.push([O[0] + t / 300 * W, O[1] - res(t) * H]);
      R.el("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: C.acc, "stroke-width": 5 }, g);
      [0, 100, 200, 300].forEach(function (t) { T(g, String(t), [O[0] + t / 300 * W, O[1] + 22], { taille: 14, couleur: C.doux }); });
      T(g, "T (°C)", [O[0] + W, O[1] + 44], { taille: 14, gras: true });
      R.ligne(g, [O[0] + 200 / 300 * W, O[1] - H], [O[0] + 200 / 300 * W, O[1]], { couleur: C.x, epaisseur: 2, tirets: "6 5" });
      var xt = O[0] + cT.v / 300 * W; R.el("circle", { cx: xt, cy: O[1] - r * H, r: 9, fill: C.z, stroke: "#fff", "stroke-width": 3 }, g);
      zone.innerHTML = "Étirement " + cD.v + " % : déformation réversible, le tube reviendra à 10 cm. À " + cT.v + " °C, " + (cT.v > 200 ? "le polymère n'a plus de résistance intéressante." : cT.v > 120 ? "sa résistance chute déjà." : "il tient bien.");
    }
    dessin();
  })();
})();
