(function () {
  "use strict";
  var R = RM, C = R.C, m = R.m;

  /* ---------- Figure 1 : tourner puis avancer / avancer puis tourner ---------- */
  (function () {
    var f = R.figure("fig-ordre", {
      largeur: 960, hauteur: 440,
      titre: "Rot puis Trans comparé à Trans puis Rot",
      essai: "<strong>Essaie</strong> : mets \\(\\alpha = 90°\\) et \\(d = 1\\), puis fais varier \\(\\alpha\\). " +
        "<strong>Observe</strong> : les deux repères finaux ont la même orientation (même bloc 3 × 3) mais pas la même origine (quatrième colonne). Le bleu avance le long de son nouvel axe x ; le rouge avance le long de x₀ puis tourne sur place."
    });
    var P = R.plan(430, 320, 120);
    var g = R.el("g", null, f.svg);
    var ca = R.curseur(f.reglages, { nom: "α", min: -180, max: 180, pas: 5, val: 60, unite: "°", surChange: dessiner });
    var cd = R.curseur(f.reglages, { nom: "d", min: 0, max: 2.5, pas: 0.1, val: 1.5, surChange: dessiner });
    var zone = R.h("div", null, "", f.direct);

    function rep(T, coul, nom) {
      var o = [T[0][3], T[1][3]];
      R.fleche(g, P.p(o), P.p(m.add(o, [T[0][0] * 0.75, T[1][0] * 0.75])), { couleur: coul, epaisseur: 4 });
      R.fleche(g, P.p(o), P.p(m.add(o, [T[0][1] * 0.5, T[1][1] * 0.5])), { couleur: coul, epaisseur: 2.5 });
      R.point(g, P.p(o), { couleur: coul, r: 8, contour: "#fff" });
      // étiquette du côté opposé à l'axe x du repère, pour ne pas le couvrir
      R.texte(g, nom, m.add(P.p(o), [-T[0][0] * 34 - T[0][1] * 30, T[1][0] * 34 + T[1][1] * 30]), { couleur: coul, italique: false, gras: true, taille: 18 });
    }
    function dessiner() {
      R.vider(g);
      var a = ca.v * R.DEG, d = cd.v;
      var Rot = m.homog(m.Rz(a), [0, 0, 0]), Tr = m.homog(m.identite(3), [d, 0, 0]);
      var A = m.matMul(Rot, Tr), B = m.matMul(Tr, Rot);
      R.grille(g, P, f.svg, { pas: 0.5, fort: 2, axes: false });
      R.repere2D(g, P, [0, 0], [1, 0], [0, 1], { longueur: 0.8, indice: "0", couleurX: C.doux, couleurY: C.doux, epaisseur: 2.5 });
      // trajets
      R.ligne(g, P.p([0, 0]), P.p([A[0][3], A[1][3]]), { couleur: C.z, tirets: "8 6", epaisseur: 2.5 });
      R.ligne(g, P.p([0, 0]), P.p([d, 0]), { couleur: C.x, tirets: "8 6", epaisseur: 2.5 });
      rep(A, C.z, "Rot · Trans");
      rep(B, C.x, "Trans · Rot");
      var cell = function (i, j, t) { return j === 3 && i < 3 ? R.couleur(C.acc, "\\mathbf{" + t + "}") : t; };
      R.rendre(zone, R.couleur(C.z, "\\text{Rot}\\cdot\\text{Trans}") + " = " + R.texMat(A, 3, { cellule: cell }) + "\\\\[8pt] " +
        R.couleur(C.x, "\\text{Trans}\\cdot\\text{Rot}") + " = " + R.texMat(B, 3, { cellule: cell }));
    }
    dessiner();
  })();

  /* ---------- Figure 2 : chaîne de trois segments, étape par étape ---------- */
  (function () {
    var f = R.figure("fig-chaine", {
      largeur: 960, hauteur: 540,
      titre: "Chaîne plane de trois segments : produit des matrices étape par étape",
      essai: "<strong>Essaie</strong> : clique sur « Étape suivante » pour multiplier une matrice de plus, puis change un angle. " +
        "<strong>Observe</strong> : à l'étape k, le repère atteint (en couleur) est celui que décrit \\(T^{0,k}\\). Sa quatrième colonne donne la position de son origine dans \\(R_0\\). La dernière étape place l'organe terminal \\(M\\)."
    });
    var L = [1.4, 1.1, 0.8];
    var P = R.plan(400, 380, 115);
    var g = R.el("g", null, f.svg);
    var c1 = R.curseur(f.reglages, { nom: "θ₁", min: -180, max: 180, pas: 1, val: 30, unite: "°", surChange: dessiner });
    var c2 = R.curseur(f.reglages, { nom: "θ₂", min: -180, max: 180, pas: 1, val: 40, unite: "°", surChange: dessiner });
    var c3 = R.curseur(f.reglages, { nom: "θ₃", min: -180, max: 180, pas: 1, val: -50, unite: "°", surChange: dessiner });
    var zone = R.h("div", null, "", f.direct);
    var k = 0;
    var et = R.etapes(f.reglages, 4, ["repère de base R₀", "T(0,1)", "T(0,2) = T(0,1) T(1,2)", "T(0,3) = T(0,1) T(1,2) T(2,3)", "organe terminal M"], function (n) { k = n; dessiner(); });

    function dessiner() {
      if (!et) return;
      R.vider(g);
      var th = [c1.v, c2.v, c3.v].map(function (x) { return x * R.DEG; });
      var ch = m.chainePlane(th, L);
      var i;
      R.grille(g, P, f.svg, { pas: 0.5, fort: 2, axes: false });
      R.repere2D(g, P, [0, 0], [1, 0], [0, 1], { longueur: 0.7, indice: "0", couleurX: C.doux, couleurY: C.doux, epaisseur: 2.5, origine: false });
      // segments
      var pts = [[0, 0]].concat(ch.T.slice(1).map(function (t) { return [t.cumul[0][3], t.cumul[1][3]]; })).concat([[ch.bout[0], ch.bout[1]]]);
      // segments en barres arrondies, comme dans le jeu ; pâles pour laisser voir les repères
      var couleursSeg = ["#ff8a5c", "#8b3fd9", "#3b5bdb"], textesSeg = ["#e2683a", "#8b3fd9", "#3b5bdb"];
      for (i = 0; i < 3; i++) {
        var p0 = P.p(pts[i]), p1 = P.p(pts[i + 1]), dx = p1[0] - p0[0], dy = p1[1] - p0[1], n = Math.hypot(dx, dy) || 1;
        R.el("line", { x1: p0[0], y1: p0[1], x2: p1[0], y2: p1[1], stroke: couleursSeg[i], "stroke-width": 16, "stroke-linecap": "round", opacity: 0.45 }, g);
        R.texte(g, "l" + "₁₂₃"[i], [(p0[0] + p1[0]) / 2 + dy / n * 26, (p0[1] + p1[1]) / 2 - dx / n * 26], { couleur: textesSeg[i], taille: 19, gras: true });
      }
      for (i = 0; i < 3; i++) {
        var o = P.p(pts[i]);
        R.el("circle", { cx: o[0], cy: o[1], r: 10, fill: "#fff", stroke: C.fonce, "stroke-width": 2.5 }, g);
      }
      // repères atteints
      for (i = 1; i <= Math.min(k, 3); i++) {
        var T = ch.T[i - 1].cumul, cur = i === Math.min(k, 3);
        R.repere2D(g, P, [T[0][3], T[1][3]], [T[0][0], T[1][0]], [T[0][1], T[1][1]], { longueur: 0.6, indice: String(i), epaisseur: cur ? 3 : 1.6, opacite: cur ? 1 : 0.4, origine: false, ecartNom: 1.2 });
      }
      if (k >= 4) {
        R.point(g, P.p(ch.bout), { couleur: C.acc, r: 9, contour: "#fff" });
        R.texte(g, "M", m.add(P.p(ch.bout), [20, -18]), { couleur: C.acc, gras: true, taille: 22 });
      }
      var tex = "";
      if (k === 0) tex = "\\text{Repère de base } R_0 \\text{ (fixe).}\\quad \\text{Longueurs : } l_1 = 1{,}4,\\ l_2 = 1{,}1,\\ l_3 = 0{,}8";
      else if (k <= 3) {
        var noms = [], nums = [];
        for (i = 1; i <= k; i++) { noms.push("T^{" + (i - 1) + "," + i + "}"); }
        var loc = ch.T[k - 1].local;
        tex = "T^{" + (k - 1) + "," + k + "} = " + R.texMat(loc, 3) + "\\quad (\\text{rotation } \\theta_" + k + (k > 1 ? ",\\ \\text{origine à } l_" + (k - 1) + " \\text{ sur } x_" + (k - 1) : ",\\ O_0 = O_1") + ")" +
          "\\\\[8pt] T^{0," + k + "} = " + noms.join("\\,") + "\\\\[2pt] \\phantom{T} = " + R.texMat(ch.T[k - 1].cumul, 3, { cellule: function (r, c, t) { return c === 3 && r < 3 ? R.couleur(C.acc, "\\mathbf{" + t + "}") : t; } });
      } else {
        tex = "\\begin{pmatrix} O_0M^0 \\\\ 1 \\end{pmatrix} = T^{0,3}\\begin{pmatrix} l_3 \\\\ 0 \\\\ 0 \\\\ 1 \\end{pmatrix} = " + R.texMat(ch.T[2].cumul, 3) + R.texVec([L[2], 0, 0, 1], 1) + " = " + R.texVec(ch.bout.concat([1]), 3, C.acc);
      }
      R.rendre(zone, tex);
    }
    et.aller(0);
  })();
})();
