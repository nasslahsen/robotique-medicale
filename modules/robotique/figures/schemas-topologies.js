(function () {
  "use strict";
  var R = RM, C = R.C, m = R.m;

  /* ---------- Figure 1 : bras à deux pivots, plan ou spatial ---------- */
  (function () {
    var f = R.figure("fig-plan-spatial", {
      hauteur: 480,
      titre: "Bras à deux pivots : axes parallèles ou perpendiculaires",
      essai: "<strong>Essaie</strong> : coche « Trace de P », fais varier \\(\\theta_1\\) et \\(\\theta_2\\), puis passe de « plan » à « spatial ». " +
        "<strong>Observe</strong> : avec des axes parallèles, P reste dans un plan horizontal (schéma plan suffisant) ; avec \\(\\vec{z}_0 \\perp \\vec{z}_1\\), P sort de ce plan et il faut un schéma spatial."
    });
    var V = R.vue3D(300, 360, 145, -40 * R.DEG, 24 * R.DEG);
    var g = R.el("g", null, f.svg);
    var b = R.boutons(f.reglages);
    var mode = R.choix(b, [["spatial", "Schéma spatial : z₀ ⊥ z₁"], ["plan", "Schéma plan : z₀ ∥ z₁"]], function () { trace = []; dessiner(); });
    var ctrace = R.bascule(b, "Trace de P", false, function () { trace = []; dessiner(); });
    var tourne = R.basculeOrbite(b);
    var c1 = R.curseur(f.reglages, { nom: "θ₁", min: -180, max: 180, pas: 1, val: 30, unite: "°", surChange: dessiner });
    var c2 = R.curseur(f.reglages, { nom: "θ₂", min: -120, max: 120, pas: 1, val: 40, unite: "°", surChange: dessiner });
    var zone = R.h("div", null, "", f.direct);
    var trace = [];
    var L1 = 1, L2 = 1.1, H = 0.6;

    // étiquette posée à côté du segment (côté haut à l'écran), pour ne pas le recouvrir
    function etiquetteSegment(txt, a, b, couleur) {
      var pa = V.p(a), pb = V.p(b), d = m.sub(pb, pa), l = Math.hypot(d[0], d[1]) || 1;
      var n = [d[1] / l, -d[0] / l];
      if (n[1] > 0 || (Math.abs(n[1]) < 1e-6 && n[0] > 0)) n = [-n[0], -n[1]];
      var dist = 14 + 32 * Math.abs(n[0]);
      R.texte(g, txt, m.add(m.scale(m.add(pa, pb), 0.5), m.scale(n, dist)), { couleur: couleur, italique: false, taille: 15, gras: true });
    }

    function dessiner() {
      R.vider(g);
      var t1 = c1.v * R.DEG, t2 = c2.v * R.DEG, spatial = mode.value === "spatial";
      var R1 = m.Rz(t1), O1 = [0, 0, H], O2, P, z1;
      if (spatial) {
        // solide 1 vertical puis pivot 2 d'axe horizontal (y du solide 1)
        O2 = m.add(O1, [0, 0, L1 * 0.6]);
        z1 = m.matVec(R1, [0, 1, 0]);
        var dir = m.matVec(R1, [Math.cos(t2), 0, Math.sin(t2)]);
        P = m.add(O2, m.scale(dir, L2));
      } else {
        O2 = m.add(O1, m.matVec(R1, [L1, 0, 0]));
        z1 = [0, 0, 1];
        P = m.add(O2, m.matVec(m.Rz(t1 + t2), [L2, 0, 0]));
      }
      // bâti et sol
      R.polygone(g, [V.p([-1.3, -1.3, 0]), V.p([1.3, -1.3, 0]), V.p([1.3, 1.3, 0]), V.p([-1.3, 1.3, 0])], { remplissage: "#f6f7fa", couleur: "#d9dde6", epaisseur: 1.5 });
      if (!spatial) R.polygone(g, [V.p([-1.6, -1.6, H]), V.p([1.6, -1.6, H]), V.p([1.6, 1.6, H]), V.p([-1.6, 1.6, H])], { remplissage: "rgba(18,162,107,0.07)", couleur: "rgba(18,162,107,0.4)", epaisseur: 1.5 });
      R.el("line", { x1: V.p([0, 0, 0])[0], y1: V.p([0, 0, 0])[1], x2: V.p(O1)[0], y2: V.p(O1)[1], stroke: "#5b6172", "stroke-width": 16, "stroke-linecap": "round" }, g);
      R.texte(g, "bâti 0", m.add(V.p([0, 0, 0]), [0, 26]), { italique: false, couleur: C.doux, taille: 15 });
      // trace
      if (ctrace.checked) { trace.push(P); if (trace.length > 800) trace.shift(); }
      if (ctrace.checked && trace.length > 1) R.el("polyline", { points: trace.map(function (q) { return V.p(q).join(","); }).join(" "), fill: "none", stroke: C.acc, "stroke-width": 2.5, opacity: 0.75 }, g);
      // solides
      R.el("line", { x1: V.p(O1)[0], y1: V.p(O1)[1], x2: V.p(O2)[0], y2: V.p(O2)[1], stroke: "#8b3fd9", "stroke-width": 14, "stroke-linecap": "round" }, g);
      R.el("line", { x1: V.p(O2)[0], y1: V.p(O2)[1], x2: V.p(P)[0], y2: V.p(P)[1], stroke: "#ff8a5c", "stroke-width": 12, "stroke-linecap": "round" }, g);
      [O1, O2].forEach(function (o) { var q = V.p(o); R.el("circle", { cx: q[0], cy: q[1], r: 11, fill: "#fff", stroke: C.fonce, "stroke-width": 3 }, g); });
      // axes des pivots : dessinés par-dessus les solides, étiquettes au bout des axes
      R.ligne(g, V.p(m.add(O1, [0, 0, -0.5])), V.p(m.add(O1, [0, 0, 1.9])), { couleur: C.z, tirets: "7 6", epaisseur: 3 });
      R.texte(g, "z₀", m.add(V.p(m.add(O1, [0, 0, 1.9])), [0, -16]), { couleur: C.z, gras: true });
      R.ligne(g, V.p(m.add(O2, m.scale(z1, -0.9))), V.p(m.add(O2, m.scale(z1, 0.9))), { couleur: C.x, tirets: "7 6", epaisseur: 3 });
      R.texte(g, "z₁", m.add(V.p(m.add(O2, m.scale(z1, 0.9))), [14, -14]), { couleur: C.x, gras: true });
      R.point(g, V.p(P), { couleur: C.acc, r: 9, contour: "#fff" });
      R.texte(g, "P", m.add(V.p(P), [14, -12]), { couleur: C.acc, gras: true });
      etiquetteSegment("solide 1", O1, O2, "#8b3fd9");
      etiquetteSegment("solide 2", O2, P, PLATEFORME.couleur());
      R.rendre(zone, (spatial ? "\\vec{z}_0 \\perp \\vec{z}_1 :\\ \\text{schéma spatial}" : "\\vec{z}_0 \\parallel \\vec{z}_1 \\parallel \\vec{Z} :\\ \\text{schéma plan}") +
        "\\qquad \\text{hauteur de } P : z_P = " + R.tn(P[2], 2));
    }
    R.orbite(f.svg, V, dessiner, tourne);
    dessiner();
  })();

  /* ---------- Figure 2 : graphes des liaisons ---------- */
  (function () {
    var f = R.figure("fig-graphes", {
      hauteur: 360,
      titre: "Graphe des liaisons : cercles = solides, traits = liaisons",
      essai: "<strong>Essaie</strong> : change de topologie, puis touche un solide. " +
        "<strong>Observe</strong> : le solide touché et ses voisins s'allument. En série, aucun solide n'a plus de deux voisins ; en arborescente, le tronc en a quatre ; en parallèle, les liaisons en orange forment une boucle."
    });
    var g = R.el("g", null, f.svg);
    var b = R.boutons(f.reglages);
    var TOPO = {
      serie: { nom: "Série (bras 6R)", n: [[40, 200, "0"], [125, 200, "1"], [210, 200, "2"], [295, 200, "3"], [380, 200, "4"], [465, 200, "5"], [550, 200, "6"]],
        e: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]] },
      parallele: { nom: "Parallèle (3 chaînes)", n: [[300, 320, "0"], [150, 220, "1"], [300, 220, "3"], [450, 220, "5"], [150, 120, "2"], [300, 120, "4"], [450, 120, "6"], [300, 40, "E"]],
        e: [[0, 1], [1, 4], [4, 7], [0, 2], [2, 5], [5, 7], [0, 3], [3, 6], [6, 7]] },
      arbre: { nom: "Arborescente (humanoïde)", n: [[300, 60, "0"], [90, 170, "1"], [230, 170, "3"], [370, 170, "5"], [510, 170, "7"], [90, 280, "2"], [230, 280, "4"], [370, 280, "6"], [510, 280, "8"]],
        e: [[0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [2, 6], [3, 7], [4, 8]] },
      hybride: { nom: "Hybride (parallèle + série)", n: [[120, 320, "0"], [50, 200, "1"], [190, 200, "2"], [120, 80, "E"], [270, 80, "3"], [400, 80, "4"], [530, 80, "5"]],
        e: [[0, 1], [1, 3], [0, 2], [2, 3], [3, 4], [4, 5], [5, 6]] }
    };
    var topo = "serie", choisi = 1, btns = {};
    Object.keys(TOPO).forEach(function (k) {
      btns[k] = R.bouton(b, TOPO[k].nom, function () { topo = k; choisi = -1; Object.keys(btns).forEach(function (x) { btns[x].classList.toggle("actif", x === k); }); dessiner(); });
    });
    btns.serie.classList.add("actif");
    var zone = R.h("div", null, "", f.direct);

    // Liaisons appartenant à une boucle : une liaison est dans une boucle si on peut relier ses extrémités sans l'utiliser.
    function dansBoucle(T, k) {
      var a = T.e[k][0], z = T.e[k][1], vu = {}, pile = [a]; vu[a] = 1;
      while (pile.length) {
        var u = pile.pop();
        T.e.forEach(function (e, j) {
          if (j === k) return;
          var w = e[0] === u ? e[1] : e[1] === u ? e[0] : -1;
          if (w >= 0 && !vu[w]) { vu[w] = 1; pile.push(w); }
        });
      }
      return !!vu[z];
    }
    function dessiner() {
      R.vider(g);
      var T = TOPO[topo];
      var voisins = function (i) { return T.e.filter(function (e) { return e[0] === i || e[1] === i; }).map(function (e) { return e[0] === i ? e[1] : e[0]; }); };
      var nbBoucles = T.e.length - T.n.length + 1;
      T.e.forEach(function (e, k) {
        var boucle = dansBoucle(T, k), actif = choisi >= 0 && (e[0] === choisi || e[1] === choisi);
        var a = T.n[e[0]], z = T.n[e[1]];
        R.ligne(g, a, z, { couleur: actif ? C.z : boucle ? C.acc : C.fonce, epaisseur: actif ? 6 : boucle ? 5 : 3 });
        var dx = z[0] - a[0], dy = z[1] - a[1], ll = Math.hypot(dx, dy) || 1;
        R.texte(g, "R", [(a[0] + z[0]) / 2 + dy / ll * 14, (a[1] + z[1]) / 2 - dx / ll * 14], { italique: false, couleur: C.doux, taille: 14 });
      });
      var vs = choisi >= 0 ? voisins(choisi) : [];
      T.n.forEach(function (n, i) {
        var on = i === choisi, voisin = vs.indexOf(i) >= 0;
        var cg = R.el("g", { style: "cursor:pointer" }, g);
        cg.addEventListener("click", function () { choisi = i; dessiner(); });
        R.el("circle", { cx: n[0], cy: n[1], r: 26, fill: on ? C.z : voisin ? "#e8edff" : "#fff", stroke: C.fonce, "stroke-width": 3 }, cg);
        R.texte(cg, n[2], [n[0], n[1] + 1], { italique: false, gras: true, couleur: on ? "#fff" : C.fonce, taille: 19, halo: false });
      });
      var txt = "\\text{solides } N = " + T.n.length + ",\\ \\text{liaisons } L = " + T.e.length + ",\\ \\text{boucles } L - N + 1 = " + nbBoucles;
      if (choisi >= 0) txt += "\\qquad \\text{le solide " + T.n[choisi][2] + " a " + vs.length + " voisin" + (vs.length > 1 ? "s" : "") + "}";
      R.rendre(zone, txt);
    }
    dessiner();
  })();
})();
