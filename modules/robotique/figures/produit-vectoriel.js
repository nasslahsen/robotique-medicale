(function () {
  "use strict";
  var R = RM, C = R.C, m = R.m;

  // Sol quadrillé dans le plan (x, y), pour donner la profondeur.
  function sol(g, V, L) {
    R.polygone(g, [V.p([-L, -L, 0]), V.p([L, -L, 0]), V.p([L, L, 0]), V.p([-L, L, 0])], { remplissage: "#f6f7fa", couleur: "#d9dde6", epaisseur: 1.5 });
    for (var k = -L; k <= L + 1e-9; k += L / 4) {
      R.ligne(g, V.p([k, -L, 0]), V.p([k, L, 0]), { couleur: "#e3e6ee", epaisseur: 1 });
      R.ligne(g, V.p([-L, k, 0]), V.p([L, k, 0]), { couleur: "#e3e6ee", epaisseur: 1 });
    }
  }

  function axesFixes(g, V, L) {
    R.fleche(g, V.p([0, 0, 0]), V.p([L, 0, 0]), { couleur: C.x, epaisseur: 2, opacite: 0.6 });
    R.fleche(g, V.p([0, 0, 0]), V.p([0, L, 0]), { couleur: C.y, epaisseur: 2, opacite: 0.6 });
    R.fleche(g, V.p([0, 0, 0]), V.p([0, 0, L]), { couleur: C.z, epaisseur: 2, opacite: 0.6 });
    R.texte(g, "x", V.p([L + 0.15, 0, 0]), { couleur: C.x, opacite: 0.8, taille: 20 });
    R.texte(g, "y", V.p([0, L + 0.15, 0]), { couleur: C.y, opacite: 0.8, taille: 20 });
    R.texte(g, "z", V.p([0, 0, L + 0.15]), { couleur: C.z, opacite: 0.8, taille: 20 });
  }

  /* ---------- Figure 1 : u ∧ v et parallélogramme ---------- */
  (function () {
    var f = R.figure("fig-pv", {
      hauteur: 520,
      titre: "Produit vectoriel et aire du parallélogramme",
      essai: "<strong>Essaie</strong> : fais varier l'angle \\(\\theta\\) entre \\(\\vec{u}\\) et \\(\\vec{v}\\), puis clique sur « Inverser l'ordre ». " +
        "<strong>Observe</strong> : la longueur de \\(\\vec{w}\\) (orange) suit l'aire du parallélogramme ; elle est maximale à 90° et nulle quand les vecteurs sont alignés. Inverser l'ordre retourne \\(\\vec{w}\\)."
    });
    var V = R.vue3D(300, 375, 138, -40 * R.DEG, 22 * R.DEG);
    var g = R.el("g", null, f.svg);
    var cu = R.curseur(f.reglages, { nom: "‖u‖", min: 0.5, max: 1.6, pas: 0.1, val: 1.5, surChange: dessiner });
    var cv = R.curseur(f.reglages, { nom: "‖v‖", min: 0.5, max: 1.6, pas: 0.1, val: 1.2, surChange: dessiner });
    var ct = R.curseur(f.reglages, { nom: "θ (u vers v)", min: -180, max: 180, pas: 1, val: 60, unite: "°", surChange: dessiner });
    var ce = R.curseur(f.reglages, { nom: "v hors du plan", min: -60, max: 60, pas: 1, val: 0, unite: "°", surChange: dessiner });
    var b = R.boutons(f.reglages), inverse = false;
    var bi = R.bouton(b, "Inverser l'ordre (v ∧ u)", function () { inverse = !inverse; bi.classList.toggle("actif", inverse); dessiner(); });
    var tourne = R.basculeOrbite(b);
    var zone = R.h("div", null, "", f.direct);

    function dessiner() {
      R.vider(g);
      var t = ct.v * R.DEG, e = ce.v * R.DEG;
      var u = [cu.v, 0, 0];
      var v = [cv.v * Math.cos(e) * Math.cos(t), cv.v * Math.cos(e) * Math.sin(t), cv.v * Math.sin(e)];
      var w = inverse ? m.cross(v, u) : m.cross(u, v);
      sol(g, V, 1.7);
      axesFixes(g, V, 2);
      var O = [0, 0, 0];
      R.polygone(g, [V.p(O), V.p(u), V.p(m.add(u, v)), V.p(v)], { remplissage: PLATEFORME.teinte(0.16), couleur: PLATEFORME.teinte(0.6), epaisseur: 1.5 });
      R.fleche(g, V.p(O), V.p(u), { couleur: C.v, epaisseur: 5 });
      R.fleche(g, V.p(O), V.p(v), { couleur: C.z, epaisseur: 5 });
      R.texte(g, "u", m.add(V.p(u), [16, 14]), { couleur: C.v, gras: true, taille: 24 });
      R.texte(g, "v", m.add(V.p(v), [16, -14]), { couleur: C.z, gras: true, taille: 24 });
      if (m.norme(w) > 0.02) R.fleche(g, V.p(O), V.p(w), { couleur: C.acc, epaisseur: 5.5 });
      R.texte(g, inverse ? "w = v ∧ u" : "w = u ∧ v", m.add(V.p(w), [16, 0]), { couleur: C.acc, gras: true, italique: false, taille: 20, ancre: "start" });
      var aire = m.norme(m.cross(u, v));
      var a = inverse ? v : u, bb = inverse ? u : v, na = inverse ? "\\vec{v}" : "\\vec{u}", nb = inverse ? "\\vec{u}" : "\\vec{v}";
      var th = Math.acos(Math.max(-1, Math.min(1, m.dot(u, v) / (m.norme(u) * m.norme(v)))));
      R.rendre(zone,
        na + " \\wedge " + nb + " = " + R.texMat([
          [R.tn(a[1], 2) + " \\times " + R.tc(bb[2], 2) + " - " + R.tc(a[2], 2) + " \\times " + R.tc(bb[1], 2)],
          [R.tn(a[2], 2) + " \\times " + R.tc(bb[0], 2) + " - " + R.tc(a[0], 2) + " \\times " + R.tc(bb[2], 2)],
          [R.tn(a[0], 2) + " \\times " + R.tc(bb[1], 2) + " - " + R.tc(a[1], 2) + " \\times " + R.tc(bb[0], 2)]
        ]) + " = " + R.texVec(w, 2, C.acc) +
        "\\\\[6pt] \\|\\vec{w}\\| = " + R.tn(m.norme(w), 3) + " \\qquad \\|\\vec{u}\\|\\,\\|\\vec{v}\\|\\sin\\theta = " + R.tc(cu.v, 1) + " \\times " + R.tc(cv.v, 1) + " \\times \\sin(" + R.tn(th / R.DEG, 1) + "°) = " + R.tn(aire, 3) + " = \\text{aire}" +
        "\\\\[6pt] \\vec{w} \\cdot \\vec{u} = " + R.tn(m.dot(w, u), 3) + ",\\ \\vec{w} \\cdot \\vec{v} = " + R.tn(m.dot(w, v), 3));
    }
    R.orbite(f.svg, V, dessiner, tourne);
    dessiner();
  })();

  /* ---------- Figure 2 : produits vectoriels entre R1 et R2 ---------- */
  (function () {
    var f = R.figure("fig-pv-reperes", {
      hauteur: 460,
      titre: "Produits vectoriels entre les axes de R1 et R2",
      essai: "<strong>Essaie</strong> : choisis un produit, puis fais varier \\(\\alpha\\). " +
        "<strong>Observe</strong> : quand les deux axes sont dans le plan horizontal, le résultat (orange) est vertical, porté par \\(\\vec{z}_1\\), de longueur égale au sinus de l'angle orienté. Avec \\(\\vec{z}\\), le résultat reste dans le plan."
    });
    var V = R.vue3D(300, 285, 185, -35 * R.DEG, 26 * R.DEG);
    var g = R.el("g", null, f.svg);
    var al = R.curseur(f.reglages, { nom: "α", min: -90, max: 120, pas: 1, val: 30, unite: "°", surChange: dessiner });
    var bb = R.boutons(f.reglages);
    var produits = [
      ["x1", "y1", "\\vec{z}_1"], ["x1", "x2", "\\sin\\alpha\\ \\vec{z}_1"], ["y1", "y2", "\\sin\\alpha\\ \\vec{z}_1"],
      ["z2", "y1", "-\\vec{x}_1"], ["z2", "x1", "\\vec{y}_1"], ["x1", "y2", "\\cos\\alpha\\ \\vec{z}_1"],
      ["y1", "x2", "-\\cos\\alpha\\ \\vec{z}_1"], ["y2", "x1", "-\\cos\\alpha\\ \\vec{z}_1"], ["y2", "y1", "-\\sin\\alpha\\ \\vec{z}_1"],
      ["x2", "z1", "-\\vec{y}_2"], ["x2", "x1", "-\\sin\\alpha\\ \\vec{z}_1"]
    ];
    var noms = { x1: "\\vec{x}_1", y1: "\\vec{y}_1", z1: "\\vec{z}_1", x2: "\\vec{x}_2", y2: "\\vec{y}_2", z2: "\\vec{z}_2" };
    var choisi = 1;
    var lab = { x1: "x₁", y1: "y₁", z1: "z₁", x2: "x₂", y2: "y₂", z2: "z₂" };
    var sel = R.choix(bb, produits.map(function (p, i) { return [i, lab[p[0]] + " ∧ " + lab[p[1]]]; }), function () { choisi = +sel.value; dessiner(); });
    sel.value = "1";
    var tourne = R.basculeOrbite(bb);
    var zone = R.h("div", null, "", f.direct);

    function dessiner() {
      R.vider(g);
      var a = al.v * R.DEG;
      var vecs = {
        x1: [1, 0, 0], y1: [0, 1, 0], z1: [0, 0, 1],
        x2: [Math.cos(a), Math.sin(a), 0], y2: [-Math.sin(a), Math.cos(a), 0], z2: [0, 0, 1]
      };
      var p = produits[choisi], u = vecs[p[0]], v = vecs[p[1]], w = m.cross(u, v);
      var O = [0, 0, 0];
      sol(g, V, 1.2);
      [["x1", C.z, "x", "1"], ["y1", C.z, "y", "1"], ["x2", C.v, "x", "2"], ["y2", C.v, "y", "2"], ["z1", C.fonce, "z₁ = z", "2"]].forEach(function (d) {
        var on = p[0] === d[0] || p[1] === d[0] || (d[0] === "z1" && (p[0] === "z2" || p[1] === "z1"));
        R.fleche(g, V.p(O), V.p(vecs[d[0]]), { couleur: d[1], epaisseur: on ? 5 : 2.5, opacite: on ? 1 : 0.35 });
        R.texte(g, d[2], V.p(m.scale(vecs[d[0]], 1.2)), { couleur: d[1], ind: d[3], opacite: on ? 1 : 0.5, gras: on, taille: 21 });
      });
      if (m.norme(w) > 0.02) R.fleche(g, V.p(O), V.p(w), { couleur: C.acc, epaisseur: 6 });
      R.texte(g, "résultat", m.add(V.p(w), [16, -4]), { couleur: C.acc, italique: false, taille: 18, gras: true, ancre: "start" });
      R.rendre(zone, noms[p[0]] + " \\wedge " + noms[p[1]] + " = " + p[2] + " = " + R.texVec(w, 3, C.acc) + "_{R_1}" +
        "\\qquad \\cos\\alpha = " + R.tn(Math.cos(a), 3) + ",\\ \\sin\\alpha = " + R.tn(Math.sin(a), 3));
    }
    R.orbite(f.svg, V, dessiner, tourne);
    dessiner();
  })();
})();
