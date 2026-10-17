(function () {
  "use strict";
  var R = RM, C = R.C, m = R.m;

  var f = R.figure("fig-chaine", {
    hauteur: 460,
    titre: "Construire une chaîne plane d'articulations R et P",
    essai: "<strong>Essaie</strong> : ajoute des articulations R ou P, fais-les varier, puis clique sur « Bras redondant » et bouge q₂ et q₃ en sens opposés. " +
      "<strong>Observe</strong> : le vecteur \\(q\\) a une ligne par articulation, mais l'outil n'a jamais plus de 3 DDL dans le plan. Avec un robot PP, l'outil ne peut plus tourner."
  });
  var P = R.plan(300, 300, 72);
  var TEINTES = ["#ff8a5c", "#8b3fd9", "#3b5bdb", "#12a26b", "#ff8a5c", "#8b3fd9"];
  var g = R.el("g", null, f.svg);
  var b = R.boutons(f.reglages);
  var joints = [];
  R.bouton(b, "Ajouter R", function () { ajouter("R"); });
  R.bouton(b, "Ajouter P", function () { ajouter("P"); });
  R.bouton(b, "Retirer la dernière", function () { if (joints.length > 1) { joints.pop(); construire(); } });
  R.bouton(b, "Bras redondant (RRRR)", function () { joints = [{ t: "R", v: 40 }, { t: "R", v: 30 }, { t: "R", v: -40 }, { t: "R", v: -20 }]; construire(); });
  R.bouton(b, "Robot PP", function () { joints = [{ t: "P", v: 1.2 }, { t: "P", v: 1.0 }]; construire(); });
  var zoneC = R.h("div", null, "", f.reglages);
  var zone = R.h("div", null, "", f.direct), bilan = R.h("p", null, "", f.direct);

  function ajouter(t) { if (joints.length < 6) { joints.push(t === "R" ? { t: "R", v: 20 } : { t: "P", v: 0.9 }); construire(); } }

  // Pose de l'effecteur dans le plan pour un vecteur q.
  // R : rotation de q puis segment de longueur L ; P : segment de longueur q le long de l'axe courant,
  // suivi d'un coude fixe de 90° (comme les glissières orthogonales d'un robot cartésien).
  var L = 1.1;
  function pose(js, vals) {
    var x = 0, y = 0, phi = 0, pts = [[0, 0]], types = [];
    js.forEach(function (j, i) {
      if (j.t === "R") { phi += vals[i] * R.DEG; x += L * Math.cos(phi); y += L * Math.sin(phi); }
      else { x += vals[i] * Math.cos(phi); y += vals[i] * Math.sin(phi); phi += Math.PI / 2; }
      pts.push([x, y]);
    });
    return { x: x, y: y, phi: phi, pts: pts };
  }
  // Rang de la matrice des dérivées de (x, y, φ) par rapport à q, en une configuration quelconque.
  function ddlEffecteur(js) {
    var vals = js.map(function (j, i) { return j.t === "R" ? 17 + 23 * i : 0.7 + 0.13 * i; }), h = 1e-5, M = [];
    var p0 = pose(js, vals);
    js.forEach(function (j, i) {
      var v2 = vals.slice(); v2[i] += j.t === "R" ? h / R.DEG : h;
      var p1 = pose(js, v2);
      M.push([(p1.x - p0.x) / h, (p1.y - p0.y) / h, (p1.phi - p0.phi) / h]);
    });
    // élimination de Gauss pour le rang
    var A = M.map(function (l) { return l.slice(); }), rang = 0;
    for (var c = 0; c < 3 && rang < A.length; c++) {
      var piv = -1, best = 1e-7;
      for (var r = rang; r < A.length; r++) if (Math.abs(A[r][c]) > best) { best = Math.abs(A[r][c]); piv = r; }
      if (piv < 0) continue;
      var tmp = A[rang]; A[rang] = A[piv]; A[piv] = tmp;
      for (r = 0; r < A.length; r++) if (r !== rang) { var k = A[r][c] / A[rang][c]; for (var cc = 0; cc < 3; cc++) A[r][cc] -= k * A[rang][cc]; }
      rang++;
    }
    return rang;
  }

  function construire() {
    zoneC.innerHTML = "";
    joints.forEach(function (j, i) {
      var c = j.t === "R"
        ? R.curseur(zoneC, { nom: "q" + (i + 1) + " = θ" + (i + 1), min: -150, max: 150, pas: 1, val: j.v, unite: "°" })
        : R.curseur(zoneC, { nom: "q" + (i + 1) + " = d" + (i + 1), min: 0.3, max: 1.6, pas: 0.05, val: j.v });
      c.surChange(function () { j.v = c.v; dessiner(); });
    });
    dessiner();
  }

  function dessiner() {
    R.vider(g);
    var vals = joints.map(function (j) { return j.v; }), ps = pose(joints, vals), pts = ps.pts;
    // échelle adaptée à la portée maximale de la chaîne, pour que le bras remplisse la figure
    var portee = joints.reduce(function (a, j) { return a + (j.t === "R" ? L : 1.6); }, 0) + 0.6;
    P = R.plan(300, 250, Math.max(80, Math.min(150, 210 / portee)));
    R.grille(g, P, f.svg, { pas: 0.5, fort: 2 });
    R.el("rect", { x: P.p([0, 0])[0] - 34, y: P.p([0, 0])[1] + 12, width: 68, height: 22, rx: 5, fill: "#5b6172" }, g);
    var phi = 0;
    joints.forEach(function (j, k) {
      var a = P.p(pts[k]), bb = P.p(pts[k + 1]);
      if (j.t === "R") {
        phi += j.v * R.DEG;
        R.el("line", { x1: a[0], y1: a[1], x2: bb[0], y2: bb[1], stroke: TEINTES[k], "stroke-width": 16, "stroke-linecap": "round" }, g);
        R.el("circle", { cx: a[0], cy: a[1], r: 12, fill: "#fff", stroke: C.fonce, "stroke-width": 3 }, g);
        R.el("circle", { cx: a[0], cy: a[1], r: 3, fill: C.fonce }, g);
      } else {
        var u = [Math.cos(phi), -Math.sin(phi)], n = [-u[1], u[0]];
        // fourreau fixe puis tige coulissante
        var fe = m.add(a, m.scale(u, 44));
        R.el("line", { x1: a[0], y1: a[1], x2: bb[0], y2: bb[1], stroke: TEINTES[k], "stroke-width": 10, "stroke-linecap": "round" }, g);
        R.polygone(g, [m.add(a, m.scale(n, 11)), m.add(fe, m.scale(n, 11)), m.add(fe, m.scale(n, -11)), m.add(a, m.scale(n, -11))], { remplissage: "#fff", couleur: C.fonce, epaisseur: 3 });
        phi += Math.PI / 2;
      }
      // étiquette décalée perpendiculairement au segment, pour ne pas le recouvrir
      var pa = P.p(pts[k]), pb = P.p(pts[k + 1]), dd = m.sub(pb, pa), ll = Math.hypot(dd[0], dd[1]) || 1, nn = [dd[1] / ll, -dd[0] / ll];
      if (nn[1] > 0) nn = [-nn[0], -nn[1]];
      R.texte(g, "q", m.add(m.scale(m.add(pa, pb), 0.5), m.scale(nn, 24)), { couleur: TEINTES[k], taille: 18, gras: true, ind: String(k + 1) });
    });
    // repère de l'effecteur
    var tip = [ps.x, ps.y];
    R.repere2D(g, P, tip, [Math.cos(ps.phi), Math.sin(ps.phi)], [-Math.sin(ps.phi), Math.cos(ps.phi)], { longueur: 50 / P.s, ecartNom: 18 / P.s / 0.16, indice: "T", epaisseur: 3, origine: false });
    R.point(g, P.p(tip), { couleur: C.acc, r: 8, contour: "#fff" });

    var n = joints.length, d = ddlEffecteur(joints);
    var qTex = joints.map(function (j, k) { return (j.t === "R" ? "\\theta_{" + (k + 1) + "}" : "d_{" + (k + 1) + "}"); });
    var qNum = joints.map(function (j) { return j.t === "R" ? R.tc(j.v, 0) + "°" : R.tn(j.v, 2); });
    R.rendre(zone, "q = [" + qTex.join(",\\ ") + "]^T = [" + qNum.join(";\\ ") + "]^T" +
      "\\\\[6pt] X_{\\text{plan}} = [x,\\ y,\\ \\varphi]^T = [" + R.tn(ps.x, 2) + ";\\ " + R.tn(ps.y, 2) + ";\\ " + R.tn(ps.phi / R.DEG, 0) + "°]^T");
    var structure = joints.map(function (j) { return j.t; }).join("");
    bilan.innerHTML = "Structure <strong>" + structure + "</strong> : " + n + " axe" + (n > 1 ? "s" : "") + ", " + n + " DDL articulaire" + (n > 1 ? "s" : "") +
      ", <strong>" + d + " DDL de l'effecteur</strong> dans le plan (maximum 3)" +
      (n > d ? ', <span class="alerte">' + (n - d) + " DDL de redondance</span>" : "") + ".";
  }
  joints = [{ t: "R", v: 30 }, { t: "R", v: 45 }];
  construire();
})();
