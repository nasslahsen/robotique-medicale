(function () {
  "use strict";
  var R = RM, C = R.C, m = R.m;

  /* ---------- Figure 1 : les six éléments d'un bras ---------- */
  (function () {
    var f = R.figure("fig-anatomie", {
      hauteur: 460,
      titre: "Bras robotique : cliquer sur une partie",
      essai: "<strong>Essaie</strong> : touche une partie du bras ou choisis-la avec les boutons, puis fais bouger l'épaule et le coude. " +
        "<strong>Observe</strong> : les segments restent rigides, seules les articulations changent d'angle, et le poignet sert à orienter la pince."
    });
    var g = R.el("g", null, f.svg);
    var PARTIES = [
      ["base", "Base", "Partie fixe qui supporte le robot."],
      ["segment", "Segment", "Élément mécanique rigide reliant deux articulations."],
      ["articulation", "Articulation", "Liaison mécanique mobile entre deux segments."],
      ["axe", "Axe", "Direction selon laquelle s'effectue le mouvement de l'articulation (ici, les axes des pivots sortent de l'écran)."],
      ["poignet", "Poignet", "Ensemble de plusieurs articulations terminales assurant principalement l'orientation de l'effecteur."],
      ["effecteur", "Effecteur", "Outil fixé à l'extrémité du robot pour réaliser la tâche (ici une pince)."]
    ];
    var choisi = "segment", btns = {};
    var b = R.boutons(f.reglages);
    PARTIES.forEach(function (p) {
      btns[p[0]] = R.bouton(b, p[1], function () { choisir(p[0]); });
    });
    var c1 = R.curseur(f.reglages, { nom: "Épaule", min: 20, max: 110, pas: 1, val: 60, unite: "°", surChange: dessiner });
    var c2 = R.curseur(f.reglages, { nom: "Coude", min: -120, max: 10, pas: 1, val: -70, unite: "°", surChange: dessiner });
    var c3 = R.curseur(f.reglages, { nom: "Poignet", min: -90, max: 90, pas: 1, val: -20, unite: "°", surChange: dessiner });
    var info = R.h("p", null, "", f.direct);
    function choisir(id) { choisi = id; Object.keys(btns).forEach(function (k) { btns[k].classList.toggle("actif", k === id); }); dessiner(); }

    function groupe(id) {
      var gg = R.el("g", { style: "cursor:pointer" }, g);
      gg.addEventListener("click", function () { choisir(id); });
      return gg;
    }
    function dessiner() {
      R.vider(g);
      var hl = function (id) { return choisi === id; };
      var A = C.acc;
      var b0 = [230, 400], j1 = [230, 330];
      var a1 = c1.v * R.DEG, a2 = a1 + c2.v * R.DEG, a3 = a2 + c3.v * R.DEG;
      var j2 = [j1[0] + 150 * Math.cos(a1), j1[1] - 150 * Math.sin(a1)];
      var j3 = [j2[0] + 140 * Math.cos(a2), j2[1] - 140 * Math.sin(a2)];
      var j4 = [j3[0] + 34 * Math.cos(a3), j3[1] - 34 * Math.sin(a3)];
      var tip = [j4[0] + 30 * Math.cos(a3), j4[1] - 30 * Math.sin(a3)];
      R.ligne(g, [40, 432], [560, 432], { couleur: "#c6cbd8", epaisseur: 3 });
      // base
      var gb = groupe("base");
      R.el("rect", { x: b0[0] - 55, y: b0[1], width: 110, height: 30, rx: 5, fill: hl("base") ? A : "#5b6172" }, gb);
      R.el("rect", { x: j1[0] - 22, y: j1[1], width: 44, height: 72, rx: 5, fill: hl("base") ? A : "#9aa0ad" }, gb);
      // segments
      var gs = groupe("segment");
      [[j1, j2, 22], [j2, j3, 18]].forEach(function (s) {
        R.el("line", { x1: s[0][0], y1: s[0][1], x2: s[1][0], y2: s[1][1], stroke: hl("segment") ? A : "#c6cbd8", "stroke-width": s[2] + 4, "stroke-linecap": "round" }, gs);
      });
      // poignet (deux articulations terminales)
      var gp = groupe("poignet");
      R.el("line", { x1: j3[0], y1: j3[1], x2: j4[0], y2: j4[1], stroke: hl("poignet") ? A : "#9aa0ad", "stroke-width": 16, "stroke-linecap": "round" }, gp);
      if (hl("poignet")) R.el("circle", { cx: (j3[0] + j4[0]) / 2, cy: (j3[1] + j4[1]) / 2, r: 38, fill: "none", stroke: A, "stroke-width": 2.5, "stroke-dasharray": "5 4" }, gp);
      // articulations et axes
      var ga = groupe("articulation"), gx = groupe("axe");
      [j1, j2, j3, j4].forEach(function (c) {
        R.el("circle", { cx: c[0], cy: c[1], r: 13, fill: hl("articulation") ? A : "#fff", stroke: C.fonce, "stroke-width": 2.5 }, ga);
        R.el("circle", { cx: c[0], cy: c[1], r: hl("axe") ? 6 : 3, fill: hl("axe") ? A : C.fonce }, gx);
        if (hl("axe")) R.el("circle", { cx: c[0], cy: c[1], r: 22, fill: "none", stroke: A, "stroke-width": 2 }, gx);
      });
      // effecteur : pince
      var ge = groupe("effecteur"), u = [Math.cos(a3), -Math.sin(a3)], n = [-u[1], u[0]], col = hl("effecteur") ? A : C.fonce;
      R.ligne(ge, j4, tip, { couleur: col, epaisseur: 6 });
      R.ligne(ge, m.add(tip, m.scale(n, 16)), m.add(tip, m.scale(n, -16)), { couleur: col, epaisseur: 6 });
      R.ligne(ge, m.add(tip, m.scale(n, 16)), m.add(m.add(tip, m.scale(n, 16)), m.scale(u, 26)), { couleur: col, epaisseur: 6 });
      R.ligne(ge, m.add(tip, m.scale(n, -16)), m.add(m.add(tip, m.scale(n, -16)), m.scale(u, 26)), { couleur: col, epaisseur: 6 });
      // étiquettes
      var p = PARTIES.filter(function (x) { return x[0] === choisi; })[0];
      R.texte(g, p[1], [300, 40], { italique: false, gras: true, couleur: A, taille: 24 });
      info.innerHTML = "<strong>" + p[1] + "</strong> : " + p[2];
    }
    choisir("segment");
  })();

  /* ---------- Figure 2 : articulation rotoïde ou prismatique ---------- */
  (function () {
    var f = R.figure("fig-rp", {
      hauteur: 380,
      titre: "Articulation rotoïde ou prismatique",
      essai: "<strong>Essaie</strong> : choisis R ou P, puis fais varier la variable articulaire. " +
        "<strong>Observe</strong> : en R, le segment 2 tourne autour de l'axe (angle \\(\\theta\\)) et son extrémité décrit un arc de cercle ; en P, il coulisse le long de l'axe (distance \\(d\\)) et son extrémité décrit une droite."
    });
    var g = R.el("g", null, f.svg);
    var type = "R";
    var b = R.boutons(f.reglages);
    var bR = R.bouton(b, "Rotoïde (R)", function () { type = "R"; bR.classList.add("actif"); bP.classList.remove("actif"); maj(); });
    var bP = R.bouton(b, "Prismatique (P)", function () { type = "P"; bP.classList.add("actif"); bR.classList.remove("actif"); maj(); });
    bR.classList.add("actif");
    var cq = R.curseur(f.reglages, { nom: "Variable", min: -60, max: 60, pas: 1, val: 30, surChange: dessiner });
    var zone = R.h("div", null, "", f.direct);
    function maj() {
      if (type === "R") { cq.input.min = -90; cq.input.max = 90; cq.input.step = 1; cq.set(30); cq.input.parentNode.firstChild.textContent = "θ (angle)"; }
      else { cq.input.min = 0; cq.input.max = 150; cq.input.step = 1; cq.set(60); cq.input.parentNode.firstChild.textContent = "d (distance)"; }
      dessiner();
    }
    function dessiner() {
      R.vider(g);
      var O = [230, 190], Lr = 170;
      R.el("line", { x1: 50, y1: O[1], x2: O[0], y2: O[1], stroke: "#9aa0ad", "stroke-width": 28, "stroke-linecap": "round" }, g);
      R.texte(g, "segment 1", [130, O[1] - 32], { italique: false, couleur: C.doux, taille: 16 });
      if (type === "R") {
        var t = cq.v * R.DEG, fin = [O[0] + Lr * Math.cos(t), O[1] - Lr * Math.sin(t)];
        var pts = []; for (var i = -90; i <= 90; i += 3) pts.push([O[0] + Lr * Math.cos(i * R.DEG), O[1] - Lr * Math.sin(i * R.DEG)].join(","));
        R.el("polyline", { points: pts.join(" "), fill: "none", stroke: C.acc, "stroke-width": 2, "stroke-dasharray": "4 5", opacity: 0.6 }, g);
        R.ligne(g, O, [O[0] + Lr + 20, O[1]], { couleur: C.gris, tirets: "5 5", epaisseur: 2 });
        R.el("line", { x1: O[0], y1: O[1], x2: fin[0], y2: fin[1], stroke: "#8b3fd9", "stroke-width": 24, "stroke-linecap": "round" }, g);
        R.el("circle", { cx: O[0], cy: O[1], r: 18, fill: "#fff", stroke: C.fonce, "stroke-width": 3 }, g);
        R.el("circle", { cx: O[0], cy: O[1], r: 4, fill: C.acc }, g);
        R.arc(g, O, 70, 0, t, { couleur: C.acc, epaisseur: 3 });
        R.texte(g, "θ", [O[0] + 90 * Math.cos(t / 2), O[1] - 90 * Math.sin(t / 2)], { couleur: C.acc, gras: true });
        R.texte(g, "axe de rotation (vers vous)", [O[0] - 6, O[1] + 46], { italique: false, couleur: C.acc, taille: 15, ancre: "end" });
        R.point(g, fin, { couleur: C.acc, r: 6 });
        R.rendre(zone, "\\text{Articulation rotoïde : } q = \\theta = " + R.tn(cq.v, 0) + "° \\quad \\text{(1 DDL angulaire)}");
      } else {
        var d = cq.v;
        R.el("rect", { x: O[0] - 10, y: O[1] - 24, width: 330, height: 48, rx: 6, fill: "none", stroke: "#9aa2ae", "stroke-width": 2 }, g);
        R.ligne(g, [O[0] - 10, O[1]], [O[0] + 340, O[1]], { couleur: C.acc, tirets: "6 5", epaisseur: 2 });
        R.texte(g, "axe de translation", [O[0] + 250, O[1] - 42], { italique: false, couleur: C.acc, taille: 15 });
        R.el("rect", { x: O[0] + d, y: O[1] - 16, width: 150, height: 32, rx: 6, fill: "#8b3fd9" }, g);
        R.fleche(g, [O[0], O[1] + 52], [O[0] + d, O[1] + 52], { couleur: C.acc, epaisseur: 2.5 });
        R.texte(g, "d", [O[0] + d / 2, O[1] + 70], { couleur: C.acc, gras: true });
        R.rendre(zone, "\\text{Articulation prismatique : } q = d = " + R.tn(d / 100, 2) + " \\text{ (unités arbitraires)} \\quad \\text{(1 DDL linéaire)}");
      }
    }
    maj();
  })();
})();
