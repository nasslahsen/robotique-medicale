(function () {
  "use strict";
  var R = RM, C = R.C, M = window.MECA;

  function disque(g, c, r, angle, balaye) {
    R.el("circle", { cx: c[0], cy: c[1], r: r, fill: "#eef0f5", stroke: C.fonce, "stroke-width": 4 }, g);
    if (balaye > 0.01) {
      var tours = Math.floor(balaye / (2 * Math.PI)), reste = balaye - tours * 2 * Math.PI, rr = r * 0.92;
      if (tours > 0) R.el("circle", { cx: c[0], cy: c[1], r: rr, fill: PLATEFORME.teinte(0.18) }, g);
      if (reste > 0.01) {
        var p1 = [c[0] + rr * Math.cos(reste), c[1] - rr * Math.sin(reste)];
        R.el("path", { d: "M" + c + " L" + (c[0] + rr) + "," + c[1] + " A" + rr + " " + rr + " 0 " + (reste > Math.PI ? 1 : 0) + " 0 " + p1 + " Z", fill: PLATEFORME.teinte(0.25) }, g);
      }
    }
    for (var k = 0; k < 12; k++) { var t = k * Math.PI / 6; R.ligne(g, [c[0] + r * 0.86 * Math.cos(t), c[1] - r * 0.86 * Math.sin(t)], [c[0] + r * Math.cos(t), c[1] - r * Math.sin(t)], { couleur: "#9aa0ad", epaisseur: 3 }); }
    var q = [c[0] + r * 0.9 * Math.cos(angle), c[1] - r * 0.9 * Math.sin(angle)];
    R.ligne(g, c, q, { couleur: C.acc, epaisseur: 7 });
    R.el("circle", { cx: q[0], cy: q[1], r: 11, fill: C.acc, stroke: C.fonce, "stroke-width": 3 }, g);
    R.el("circle", { cx: c[0], cy: c[1], r: 12, fill: C.fonce }, g);
  }

  /* ---------- Figure 1 : vitesse de rotation et vitesse angulaire ---------- */
  (function () {
    var f = R.figure("fig-vitesse", {
      largeur: 960, hauteur: 440,
      titre: "Angle balayé en une seconde",
      essai: "<strong>Essaie</strong> : choisis n, puis lance « Tourner pendant 1 s ». <strong>Observe</strong> : la zone colorée est l'angle balayé en une seconde, c'est-à-dire \\(\\omega\\) ; à 60 tr/min, un tour complet, \\(2\\pi\\) rad."
    });
    var g = R.el("g", null, f.svg), angle = 0, balaye = 0;
    var cn = R.curseur(f.reglages, { nom: "n", min: 5, max: 120, pas: 5, val: 60, unite: " tr/min", surChange: function () { angle = 0; balaye = 0; dessiner(); } });
    var b = R.boutons(f.reglages);
    R.bouton(b, "Tourner pendant 1 s", function () { var w = 2 * Math.PI * cn.v / 60; R.animer(1400, function (u) { angle = w * u; balaye = angle; dessiner(); }); });
    var zone = R.h("div", null, "", f.direct);
    function dessiner() {
      R.vider(g);
      disque(g, [330, 220], 190, angle, balaye);
      var w = 2 * Math.PI * cn.v / 60;
      R.texte(g, "n = " + cn.v + " tr/min", [600, 150], { italique: false, ancre: "start", taille: 26, gras: true });
      R.texte(g, "soit " + R.fmt(cn.v / 60, 2) + " tour par seconde", [600, 200], { italique: false, ancre: "start", taille: 20, couleur: C.doux });
      R.texte(g, "ω = " + R.fmt(w, 2) + " rad/s", [600, 260], { italique: false, ancre: "start", taille: 26, gras: true, couleur: C.acc });
      R.rendre(zone, "\\omega = \\frac{2\\pi n}{60} = \\frac{2\\pi \\times " + cn.v + "}{60} = " + R.tn(w, 2) + "\\ \\text{rad/s}");
    }
    dessiner();
  })();

  /* ---------- Figure 2 : moteur, réducteur, sortie ---------- */
  (function () {
    var f = R.figure("fig-reducteur", {
      largeur: 960, hauteur: 460,
      titre: "Ce que le réducteur fait de la vitesse, du couple et de la puissance",
      essai: "<strong>Essaie</strong> : augmente le rapport \\(i\\), puis baisse le rendement \\(\\eta\\). <strong>Observe</strong> : la vitesse de sortie est divisée par \\(i\\), le couple multiplié par \\(\\eta\\, i\\) ; la puissance de sortie ne dépasse jamais celle d'entrée, l'écart part en pertes."
    });
    var g = R.el("g", null, f.svg);
    var cn = R.curseur(f.reglages, { nom: "n moteur", min: 500, max: 6000, pas: 100, val: 3000, unite: " tr/min", surChange: dessiner });
    var cc = R.curseur(f.reglages, { nom: "C moteur", min: 0.05, max: 1, pas: 0.01, val: 0.32, unite: " N·m", surChange: dessiner });
    var ci = R.curseur(f.reglages, { nom: "i", min: 1, max: 160, pas: 1, val: 50, surChange: dessiner });
    var ce = R.curseur(f.reglages, { nom: "η", min: 0.3, max: 1, pas: 0.01, val: 0.8, surChange: dessiner });
    var zone = R.h("div", null, "", f.direct);
    function dessiner() {
      R.vider(g);
      var we = 2 * Math.PI * cn.v / 60, ws = we / ci.v, Cs = ce.v * ci.v * cc.v, Pe = cc.v * we, Ps = Cs * ws;
      R.el("rect", { x: 40, y: 80, width: 150, height: 120, rx: 16, fill: "#dfe3ea", stroke: C.fonce, "stroke-width": 3 }, g);
      for (var k = 1; k < 6; k++) R.ligne(g, [40 + k * 25, 80], [40 + k * 25, 200], { couleur: "#9aa0ad", epaisseur: 2 });
      M.arbre(g, 190, 280, 140, 12, { axe: false });
      R.el("rect", { x: 280, y: 60, width: 200, height: 160, rx: 18, fill: "#eef0f5", stroke: C.fonce, "stroke-width": 3 }, g);
      M.roue(g, [320, 110], { m: 3.4, Z: 12, fill: "#fff", repere: false, trou: 4 });
      M.roue(g, [320 + 3.4 * 42 / 2, 155], { m: 3.4, Z: 30, rot: Math.PI / 30, fill: "#fff", repere: false, trou: 6 });
      M.arbre(g, 480, 600, 140, 18, { axe: false });
      disque(g, [700, 140], 90, 1, 0);
      R.texte(g, "ωe = " + R.fmt(we, 1) + " rad/s", [115, 40], { italique: false, taille: 18, couleur: C.z, gras: true });
      R.texte(g, "Ce = " + R.fmt(cc.v, 2) + " N·m", [115, 236], { italique: false, taille: 18, couleur: C.z, gras: true });
      R.texte(g, "i = " + ci.v + ", η = " + R.fmt(ce.v, 2), [380, 250], { italique: false, taille: 18, gras: true });
      R.texte(g, "ωs = " + R.fmt(ws, 2) + " rad/s", [700, 30], { italique: false, taille: 18, couleur: C.v, gras: true });
      R.texte(g, "Cs = " + R.fmt(Cs, 2) + " N·m", [700, 256], { italique: false, taille: 18, couleur: C.v, gras: true });
      // puissances en barres, à la même échelle
      var ech = 560 / Math.max(Pe, 1);
      R.texte(g, "P entrée = " + R.fmt(Pe, 1) + " W", [40, 300], { italique: false, ancre: "start", taille: 17 });
      R.el("rect", { x: 40, y: 312, width: Pe * ech, height: 36, rx: 8, fill: C.z }, g);
      R.texte(g, "P sortie = " + R.fmt(Ps, 1) + " W", [40, 384], { italique: false, ancre: "start", taille: 17 });
      R.el("rect", { x: 40, y: 396, width: Ps * ech, height: 36, rx: 8, fill: C.v }, g);
      if (Pe - Ps > 0.01) { R.el("rect", { x: 40 + Ps * ech, y: 396, width: (Pe - Ps) * ech, height: 36, rx: 8, fill: "#f6c3c4" }, g); R.texte(g, "pertes", [40 + Ps * ech + (Pe - Ps) * ech / 2, 414], { italique: false, taille: 15, couleur: "#a3282c" }); }
      R.rendre(zone, "\\omega_s = \\frac{\\omega_e}{i} = " + R.tn(ws, 2) + "\\ \\text{rad/s} \\qquad C_s \\simeq \\eta\\, i\\, C_e = " + R.tn(Cs, 2) + "\\ \\text{N}\\cdot\\text{m} \\qquad P_s = \\eta\\, P_e = " + R.tn(Ps, 1) + "\\ \\text{W}");
    }
    dessiner();
  })();

  /* ---------- Figure 3 : rappel, couple = force × bras de levier ---------- */
  (function () {
    var f = R.figure("fig-couple", {
      largeur: 960, hauteur: 380,
      titre: "Une clé sur un écrou : force et bras de levier",
      essai: "<strong>Essaie</strong> : change la force et la distance à l'axe. <strong>Observe</strong> : le couple double si la force double, ou si on prend la clé deux fois plus loin."
    });
    var g = R.el("g", null, f.svg);
    var cF = R.curseur(f.reglages, { nom: "F", min: 10, max: 100, pas: 5, val: 40, unite: " N", surChange: dessiner });
    var cr = R.curseur(f.reglages, { nom: "r", min: 0.05, max: 0.30, pas: 0.01, val: 0.15, unite: " m", surChange: dessiner });
    var zone = R.h("div", null, "", f.direct);
    function dessiner() {
      R.vider(g);
      var O = [200, 200], px = 1800, x = O[0] + cr.v * px;
      R.el("polygon", { points: [0, 1, 2, 3, 4, 5].map(function (k) { var a = k * Math.PI / 3; return [O[0] + 40 * Math.cos(a), O[1] + 40 * Math.sin(a)].join(","); }).join(" "), fill: "#c6cbd8", stroke: C.fonce, "stroke-width": 3 }, g);
      R.el("rect", { x: O[0], y: O[1] - 16, width: 600, height: 32, rx: 14, fill: "#dfe3ea", stroke: C.fonce, "stroke-width": 3 }, g);
      R.el("circle", { cx: O[0], cy: O[1], r: 8, fill: C.fonce }, g);
      R.fleche(g, [x, O[1] - 20 - cF.v * 1.4], [x, O[1] - 20], { couleur: C.v, epaisseur: 5 });
      R.texte(g, "F = " + cF.v + " N", [x + 14, O[1] - 40 - cF.v * 0.7], { italique: false, ancre: "start", taille: 20, couleur: C.v, gras: true });
      R.ligne(g, [O[0], O[1] + 60], [x, O[1] + 60], { couleur: C.fonce, epaisseur: 2 });
      R.ligne(g, [x, O[1] + 20], [x, O[1] + 74], { couleur: C.fonce, epaisseur: 2, tirets: "4 4" });
      R.texte(g, "r = " + R.fmt(cr.v, 2) + " m", [(O[0] + x) / 2, O[1] + 86], { italique: false, taille: 20 });
      R.texte(g, "C = F × r = " + R.fmt(cF.v * cr.v, 2) + " N·m", [480, 340], { italique: false, taille: 26, gras: true, couleur: C.z });
    }
    R.rendre(zone, "C = F \\times r \\qquad [\\text{N}\\cdot\\text{m}] = [\\text{N}] \\times [\\text{m}]");
    dessiner();
  })();
})();
