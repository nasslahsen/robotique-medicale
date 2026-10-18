(function () {
  "use strict";
  var R = RM, C = R.C, m = R.m;

  var f = R.figure("fig-archi", {
    hauteur: 500,
    titre: "Architectures de robots et leur espace de travail",
    essai: "<strong>Essaie</strong> : choisis une architecture, bouge ses trois articulations, puis clique sur « Balayer l'espace de travail ». Réduis ensuite les limites articulaires et balaie de nouveau. " +
      "<strong>Observe</strong> : le nuage de points (positions atteintes) prend la forme d'une boîte, d'un cylindre, d'une sphère ou d'une forme complexe selon l'architecture, et rétrécit avec les limites."
  });
  var V = R.vue3D(300, 340, 165, -40 * R.DEG, 22 * R.DEG);
  var g = R.el("g", null, f.svg), gn = R.el("g", null, f.svg);
  // Chaque architecture : trois variables (nom, min, max, unité) et un modèle géométrique direct très simple.
  var ARCHI = {
    cartesien: { nom: "Cartésien (PPP)", q: [["q₁ = x", -0.8, 0.8], ["q₂ = y", -0.6, 0.6], ["q₃ = z", 0.1, 1.1]],
      mgd: function (q) { return { pts: [[q[0], -0.8, 1.3], [q[0], q[1], 1.3], [q[0], q[1], q[2]]], outil: [q[0], q[1], q[2]] }; } },
    cylindrique: { nom: "Cylindrique (RPP)", q: [["θ (rotation)", -180, 180, "°"], ["z (hauteur)", 0.2, 1.2], ["r (radial)", 0.3, 1.1]],
      mgd: function (q) { var t = q[0] * R.DEG; return { pts: [[0, 0, 0], [0, 0, q[1]], [q[2] * Math.cos(t), q[2] * Math.sin(t), q[1]]], outil: [q[2] * Math.cos(t), q[2] * Math.sin(t), q[1]] }; } },
    polaire: { nom: "Sphérique (RRP)", q: [["θ (base)", -180, 180, "°"], ["φ (élévation)", -40, 70, "°"], ["r (radial)", 0.4, 1.1]],
      mgd: function (q) { var t = q[0] * R.DEG, p = q[1] * R.DEG, s = [0, 0, 0.6]; var o = m.add(s, [q[2] * Math.cos(p) * Math.cos(t), q[2] * Math.cos(p) * Math.sin(t), q[2] * Math.sin(p)]); return { pts: [[0, 0, 0], s, o], outil: o }; } },
    scara: { nom: "SCARA (RRP)", q: [["θ₁", -150, 150, "°"], ["θ₂", -150, 150, "°"], ["d₃ (descente)", 0, 0.6]],
      mgd: function (q) { var a = q[0] * R.DEG, b = a + q[1] * R.DEG, h = 1; var j2 = [0.8 * Math.cos(a), 0.8 * Math.sin(a), h], j3 = m.add(j2, [0.6 * Math.cos(b), 0.6 * Math.sin(b), 0]); return { pts: [[0, 0, 0], [0, 0, h], j2, j3, m.add(j3, [0, 0, -q[2]])], outil: m.add(j3, [0, 0, -q[2]]) }; } },
    articule: { nom: "Articulé (RRR)", q: [["θ₁ (base)", -180, 180, "°"], ["θ₂ (épaule)", -30, 120, "°"], ["θ₃ (coude)", -150, 0, "°"]],
      mgd: function (q) { var t = q[0] * R.DEG, a = q[1] * R.DEG, b = a + q[2] * R.DEG, s = [0, 0, 0.6]; var u = [Math.cos(t), Math.sin(t)];
        var j = m.add(s, [0.8 * Math.cos(a) * u[0], 0.8 * Math.cos(a) * u[1], 0.8 * Math.sin(a)]), o = m.add(j, [0.7 * Math.cos(b) * u[0], 0.7 * Math.cos(b) * u[1], 0.7 * Math.sin(b)]); return { pts: [[0, 0, 0], s, j, o], outil: o }; } }
  };
  var b = R.boutons(f.reglages);
  var sel = R.choix(b, Object.keys(ARCHI).map(function (k) { return [k, ARCHI[k].nom]; }), function () { construire(); });
  R.bouton(b, "Balayer l'espace de travail", function () { balayer(); });
  var tourne = R.basculeOrbite(b);
  var lim = R.curseur(f.reglages, { nom: "Limites articulaires", min: 20, max: 100, pas: 5, val: 100, unite: " %", surChange: function () { nuage = []; construire(true); } });
  var zoneC = R.h("div", null, "", f.reglages);
  var zone = R.h("div", null, "", f.direct);
  var curs = [], nuage = [];

  function bornes(k, i) {
    var d = ARCHI[k].q[i], milieu = (d[1] + d[2]) / 2, demi = (d[2] - d[1]) / 2 * lim.v / 100;
    return [milieu - demi, milieu + demi];
  }
  function construire(garder) {
    var k = sel.value;
    var anciens = garder ? curs.map(function (c) { return c.v; }) : null;
    zoneC.innerHTML = ""; curs = []; if (!garder) nuage = [];
    ARCHI[k].q.forEach(function (d, i) {
      var bb = bornes(k, i), deg = d[3] === "°";
      var v = anciens ? Math.max(bb[0], Math.min(bb[1], anciens[i])) : (bb[0] + bb[1]) / 2 + (deg ? 20 : 0);
      curs.push(R.curseur(zoneC, { nom: d[0], min: bb[0], max: bb[1], pas: deg ? 1 : 0.01, val: Math.max(bb[0], Math.min(bb[1], v)), unite: deg ? "°" : "", dec: deg ? 0 : 2, surChange: dessiner }));
    });
    dessiner();
  }
  function balayer() {
    var k = sel.value; nuage = [];
    for (var n = 0; n < 2500; n++) {
      var q = ARCHI[k].q.map(function (d, i) { var bb = bornes(k, i); return bb[0] + Math.random() * (bb[1] - bb[0]); });
      nuage.push(ARCHI[k].mgd(q).outil);
    }
    dessiner();
  }
  function dessiner() {
    R.vider(g); R.vider(gn);
    var k = sel.value;
    R.polygone(g, [V.p([-1.5, -1.5, 0]), V.p([1.5, -1.5, 0]), V.p([1.5, 1.5, 0]), V.p([-1.5, 1.5, 0])], { remplissage: "#f6f7fa", couleur: "#d9dde6", epaisseur: 1.5 });
    for (var s = -1; s <= 1; s += 0.5) {
      R.ligne(g, V.p([s, -1.5, 0]), V.p([s, 1.5, 0]), { couleur: "#e3e6ee", epaisseur: 1 });
      R.ligne(g, V.p([-1.5, s, 0]), V.p([1.5, s, 0]), { couleur: "#e3e6ee", epaisseur: 1 });
    }
    R.fleche(g, V.p([0, 0, 0]), V.p([0.55, 0, 0]), { couleur: C.x, epaisseur: 3 });
    R.fleche(g, V.p([0, 0, 0]), V.p([0, 0.55, 0]), { couleur: C.y, epaisseur: 3 });
    R.fleche(g, V.p([0, 0, 0]), V.p([0, 0, 0.55]), { couleur: C.z, epaisseur: 3 });
    R.texte(g, "x", V.p([0.7, 0, 0]), { couleur: C.x, taille: 17 }); R.texte(g, "y", V.p([0, 0.7, 0]), { couleur: C.y, taille: 17 }); R.texte(g, "z", V.p([0, 0, 0.68]), { couleur: C.z, taille: 17 });
    if (nuage.length) {
      var d = nuage.map(function (q) { var s = V.p(q); return "M" + s[0].toFixed(1) + " " + s[1].toFixed(1) + "h0"; }).join("");
      R.el("path", { d: d, stroke: "rgba(59,91,219,0.35)", "stroke-width": 3.5, "stroke-linecap": "round", fill: "none" }, gn);
    }
    if (k === "cartesien") {
      // portique : quatre montants, deux rails selon x, une poutre selon y qui roule sur les rails
      var qx = curs.length ? curs[0].v : 0;
      [[-0.9, -0.8], [0.9, -0.8], [-0.9, 0.8], [0.9, 0.8]].forEach(function (p) { R.ligne(g, V.p([p[0], p[1], 0]), V.p([p[0], p[1], 1.3]), { couleur: "#9aa0ad", epaisseur: 7 }); });
      [-0.8, 0.8].forEach(function (y) { R.ligne(g, V.p([-0.9, y, 1.3]), V.p([0.9, y, 1.3]), { couleur: "#9aa0ad", epaisseur: 7 }); });
      R.ligne(g, V.p([qx, -0.8, 1.3]), V.p([qx, 0.8, 1.3]), { couleur: "#5b6172", epaisseur: 8 });
    }
    var q = curs.map(function (c) { return c.v; }), r = ARCHI[k].mgd(q);
    for (var i = 0; i < r.pts.length - 1; i++) {
      var a = V.p(r.pts[i]), z = V.p(r.pts[i + 1]);
      R.el("line", { x1: a[0], y1: a[1], x2: z[0], y2: z[1], stroke: i % 2 ? "#ff8a5c" : "#8b3fd9", "stroke-width": 13, "stroke-linecap": "round" }, g);
      if (i > 0) R.el("circle", { cx: a[0], cy: a[1], r: 9, fill: "#fff", stroke: C.fonce, "stroke-width": 2.5 }, g);
    }
    R.point(g, V.p(r.outil), { couleur: C.acc, r: 9, contour: "#fff" });
    R.rendre(zone, "\\text{position de l'outil : } (" + r.outil.map(function (x) { return R.tn(x, 2); }).join(";\\ ") + ")" +
      (nuage.length ? "\\qquad " + nuage.length + " \\text{ positions tirées au hasard dans les limites articulaires}" : ""));
  }
  R.orbite(f.svg, V, dessiner, tourne);
  construire();
})();
