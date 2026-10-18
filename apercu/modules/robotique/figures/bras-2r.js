(function () {
  "use strict";
  var R = RM, C = R.C, m = R.m;

  var f = R.figure("fig-2r", {
    largeur: 960, hauteur: 540,
    titre: "Bras plan à deux segments et ses repères",
    essai: "<strong>Essaie</strong> : fais varier \\(\\theta_1\\) puis \\(\\theta_2\\), coche « Trace de M », puis avance dans les quatre étapes du calcul. " +
      "<strong>Observe</strong> : \\(\\theta_1\\) entraîne tout le bras, \\(\\theta_2\\) ne fait tourner que le segment 2. La quatrième colonne de \\(T^{0,2}\\) suit \\(O_2\\), et \\(x_M\\), \\(y_M\\) donnés par la matrice sont égaux à ceux de la formule directe."
  });
  var P = R.plan(480, 285, 300);
  var g = R.el("g", null, f.svg), gt = R.el("g", null, f.svg);
  var b0 = R.boutons(f.reglages);
  R.bouton(b0, "Exemple de la page", function () { c1.set(30); c2.set(45); l1.set(0.4); l2.set(0.3); trace = []; et.aller(4); });
  var c1 = R.curseur(f.reglages, { nom: "θ₁", min: -180, max: 180, pas: 1, val: 30, unite: "°", surChange: dessiner });
  var c2 = R.curseur(f.reglages, { nom: "θ₂", min: -180, max: 180, pas: 1, val: 45, unite: "°", surChange: dessiner });
  var l1 = R.curseur(f.reglages, { nom: "l₁ [m]", min: 0.1, max: 0.5, pas: 0.05, val: 0.4, surChange: function () { trace = []; dessiner(); } });
  var l2 = R.curseur(f.reglages, { nom: "l₂ [m]", min: 0.1, max: 0.5, pas: 0.05, val: 0.3, surChange: function () { trace = []; dessiner(); } });
  var b1 = R.boutons(f.reglages);
  var reperes = R.bascule(b1, "Repères", true, dessiner);
  var ctrace = R.bascule(b1, "Trace de M", false, function () { trace = []; dessiner(); });
  var ws = R.bascule(b1, "Espace de travail", false, dessiner);
  var trace = [], k = 4;
  var zone = R.h("div", null, "", f.direct);
  var et = R.etapes(f.reglages, 4, ["position", "T(0,1)", "T(1,2)", "T(0,2) = T(0,1) T(1,2)", "position de M"], function (n) { k = n; dessiner(); });

  function dessiner() {
    if (!et) return;
    R.vider(g);
    var t1 = c1.v * R.DEG, t2 = c2.v * R.DEG, L1 = l1.v, L2 = l2.v;
    // échelle adaptée à la portée l1 + l2, pour que le bras remplisse la figure
    var portee = L1 + L2, ech = 320 / portee;
    P = R.plan(480, 370, ech);
    var r = m.bras2R(t1, t2, L1, L2), o = P.p([0, 0]);
    R.grille(g, P, f.svg, { pas: 0.1, fort: 5, axes: false });
    if (ws.checked) {
      R.el("path", { d: "M " + (o[0] + P.s * (L1 + L2)) + " " + o[1] + " A " + P.s * (L1 + L2) + " " + P.s * (L1 + L2) + " 0 1 0 " + (o[0] - P.s * (L1 + L2)) + " " + o[1] +
        " A " + P.s * (L1 + L2) + " " + P.s * (L1 + L2) + " 0 1 0 " + (o[0] + P.s * (L1 + L2)) + " " + o[1] +
        " M " + (o[0] + P.s * Math.abs(L1 - L2)) + " " + o[1] + " A " + P.s * Math.abs(L1 - L2) + " " + P.s * Math.abs(L1 - L2) + " 0 1 1 " + (o[0] - P.s * Math.abs(L1 - L2)) + " " + o[1] +
        " A " + P.s * Math.abs(L1 - L2) + " " + P.s * Math.abs(L1 - L2) + " 0 1 1 " + (o[0] + P.s * Math.abs(L1 - L2)) + " " + o[1] + " Z",
        fill: "rgba(59,91,219,0.08)", "fill-rule": "evenodd", stroke: "rgba(59,91,219,0.55)", "stroke-width": 2, "stroke-dasharray": "6 6" }, g);
    }
    R.fleche(g, [20, o[1]], [944, o[1]], { couleur: "#b9bfcc", epaisseur: 2 });
    R.fleche(g, [o[0], 532], [o[0], 12], { couleur: "#b9bfcc", epaisseur: 2 });
    R.texte(g, "x", [930, o[1] + 22], { couleur: C.doux, ind: "0" });
    R.texte(g, "y", [o[0] + 22, 22], { couleur: C.doux, ind: "0" });
    R.texte(g, "quadrillage : 0,1 m", [940, 524], { couleur: C.doux, italique: false, taille: 15, ancre: "end" });
    if (ctrace.checked) {
      trace.push(P.p([r.M[0], r.M[1]]));
      if (trace.length > 600) trace.shift();
    }
    R.vider(gt);
    if (ctrace.checked && trace.length > 1) R.el("polyline", { points: trace.map(String).join(" "), fill: "none", stroke: C.acc, "stroke-width": 2, opacity: 0.7 }, g);
    // prolongement du segment 1 et angles
    var O2 = [r.O2[0], r.O2[1]], M = [r.M[0], r.M[1]];
    R.ligne(g, P.p(O2), P.p(m.add(O2, [0.35 * portee * Math.cos(t1), 0.35 * portee * Math.sin(t1)])), { couleur: C.gris, tirets: "4 4" });
    R.arc(g, o, 64, 0, t1, { couleur: C.acc, epaisseur: 2.5 });
    R.texte(g, "θ₁", [o[0] + 88 * Math.cos(t1 / 2), o[1] - 88 * Math.sin(t1 / 2)], { taille: 20, couleur: C.acc });
    var o2 = P.p(O2);
    R.arc(g, o2, 58, t1, t1 + t2, { couleur: C.acc, epaisseur: 2.5 });
    R.texte(g, "θ₂", [o2[0] + 82 * Math.cos(t1 + t2 / 2), o2[1] - 82 * Math.sin(t1 + t2 / 2)], { taille: 20, couleur: C.acc });
    // segments
    R.el("line", { x1: o[0], y1: o[1], x2: o2[0], y2: o2[1], stroke: "#ff8a5c", "stroke-width": 18, "stroke-linecap": "round" }, g);
    var mm = P.p(M);
    R.el("line", { x1: o2[0], y1: o2[1], x2: mm[0], y2: mm[1], stroke: "#8b3fd9", "stroke-width": 15, "stroke-linecap": "round" }, g);
    [o, o2].forEach(function (c) {
      R.el("circle", { cx: c[0], cy: c[1], r: 12, fill: "#fff", stroke: C.fonce, "stroke-width": 3 }, g);
      R.el("circle", { cx: c[0], cy: c[1], r: 3, fill: C.fonce }, g);
    });
    R.point(g, mm, { couleur: C.acc, r: 9, contour: "#fff" });
    R.texte(g, "M", m.add(mm, [20 * Math.cos(t1 + t2) + 6, -20 * Math.sin(t1 + t2) - 10]), { couleur: C.acc, gras: true, taille: 22 });
    R.texte(g, "O₀ = O₁", m.add(o, [-44, 32]), { taille: 17 });
    R.texte(g, "O₂", m.add(o2, [26 * Math.sin(t1) + 4, 26 * Math.cos(t1) + 6]), { taille: 17 });
    var a12 = t1 + t2;
    R.texte(g, "l₁", m.add(P.p(m.scale(O2, 0.5)), [-30 * Math.sin(t1), -30 * Math.cos(t1)]), { couleur: "#e2683a", taille: 20, gras: true });
    R.texte(g, "l₂", m.add(P.p(m.scale(m.add(O2, M), 0.5)), [-28 * Math.sin(a12), -28 * Math.cos(a12)]), { couleur: C.v, taille: 20, gras: true });
    if (reperes.checked) {
      var e = 0.25 * portee;
      var hl = function (n) { return k === 0 || k === n || (k === 3 && n === 2) || k === 4; };
      R.repere2D(g, P, [0, 0], [Math.cos(t1), Math.sin(t1)], [-Math.sin(t1), Math.cos(t1)], { longueur: e, indice: "1", epaisseur: 2.4, origine: false, opacite: hl(1) ? 1 : 0.35, ecartNom: 0.5 });
      var a2 = a12;
      R.repere2D(g, P, O2, [Math.cos(a2), Math.sin(a2)], [-Math.sin(a2), Math.cos(a2)], { longueur: e, indice: "2", epaisseur: 2.4, origine: false, opacite: hl(2) ? 1 : 0.35, ecartNom: 0.5 });
    }

    var col4 = function (i, j, t) { return j === 3 && i < 3 ? R.couleur(C.acc, "\\mathbf{" + t + "}") : t; };
    var xm = L1 * Math.cos(t1) + L2 * Math.cos(t1 + t2), ym = L1 * Math.sin(t1) + L2 * Math.sin(t1 + t2);
    var lignes = [];
    if (k === 0) lignes.push("q = (\\theta_1, \\theta_2) = (" + R.tn(c1.v, 0) + "°,\\ " + R.tn(c2.v, 0) + "°)\\qquad l_1 = " + R.tc(L1, 2) + "\\text{ m},\\ l_2 = " + R.tc(L2, 2) + "\\text{ m}");
    // une étape à la fois dans la bande, pour que la figure tienne sur l'écran
    if (k === 1) lignes.push("T^{0,1} = " + R.texMat(r.T01, 3, { cellule: col4 }) + "\\quad \\text{rotation } \\theta_1,\\ O_0 = O_1");
    if (k === 2) lignes.push("T^{1,2} = " + R.texMat(r.T12, 3, { cellule: col4 }) + "\\quad \\text{rotation } \\theta_2,\\ O_2 \\text{ à } l_1 \\text{ sur } x_1");
    if (k === 3) lignes.push("T^{0,2} = T^{0,1}\\,T^{1,2} = " + R.texMat(r.T02, 3, { cellule: col4 }) + "\\quad \\theta_1 + \\theta_2 = " + R.tn(c1.v + c2.v, 0) + "°");
    if (k === 4) lignes.push("T^{0,2}" + R.texVec([L2, 0, 0, 1], 2) + " = " + R.texVec(r.M.concat([1]), 3, C.acc) +
      "\\qquad O_0M = " + R.tn(Math.hypot(xm, ym), 3) + "\\text{ m}\\\\[6pt] x_M = " + R.tc(L1, 2) + "\\cos " + R.tc(c1.v, 0) + "° + " + R.tc(L2, 2) + "\\cos " + R.tc(c1.v + c2.v, 0) + "° = " + R.tn(xm, 3) +
      ",\\quad y_M = " + R.tn(ym, 3));
    R.rendre(zone, lignes.join("\\\\[8pt]"));
  }
  et.aller(4);
})();
