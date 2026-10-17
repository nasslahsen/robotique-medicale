/* Boss du chapitre 2 : distance, angle, produit vectoriel, cylindrique, Chasles. Pas d'indice avant la première réponse. */
NIVEAU({
  id: "boss-espace",
  init: function (fig) {
    var C = D.C, g = E.s("g", null, fig.svg);
    var sc = D.scene(fig.svg, { centre: [330, 390], ech: 85, az: 32, el: 26 });
    var n = { objets: [] };
    var b = fig.bande("");
    n.dessin = function () {
      E.vider(g);
      var l = sc.nouvelle();
      sc.sol(l, 3.6);
      sc.repere(l, [0, 0, 0], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], 3.2, ["x₀", "y₀", "z₀"], { pale: true, ep: 3 });
      var k = n.k || 1, K = function (v) { return v.map(function (x) { return x * k; }); };
      n.objets.forEach(function (o) {
        o = Object.assign({}, o); if (o.p) o.p = K(o.p); if (o.a) o.a = K(o.a); if (o.b) o.b = K(o.b);
        if (o.t === "pt") { sc.point(l, o.p, 9, o.c || C.jeu, o.nom); sc.segment(l, o.p, [o.p[0], o.p[1], 0], C.gris, 2, "4 5"); }
        else if (o.t === "vec") sc.fleche(l, o.a, o.b, o.c, o.ep || 5, o.nom);
        else if (o.t === "seg") sc.segment(l, o.a, o.b, o.c, o.ep || 3, o.tirets);
        else if (o.t === "pave") sc.pave(l, o.M, o.o, o.centre, o.h, o.c);
      });
      sc.dessiner(g, l);
      if (n.bande) E.k(b, n.bande); else b.innerHTML = "";
    };
    sc.orbite(function () { n.dessin(); }, function () { return true; });
    n.dessin();
    return n;
  },
  etapes: [
    { nom: "Distance", jouer: function (j, n) {
      n.objets = [{ t: "pt", p: [1, 2, 2], c: D.C.acc, nom: "P₁" }, { t: "pt", p: [4, 6, 2], nom: "P₂" }, { t: "seg", a: [1, 2, 2], b: [4, 6, 2], c: D.C.v, ep: 4 }];
      n.bande = "P_1 = (1 \\,;\\ 2 \\,;\\ 2) \\qquad P_2 = (4 \\,;\\ 6 \\,;\\ 2)"; n.k = 0.45; n.dessin();
      j.fig.astuce("Glisse un doigt pour tourner la vue.");
      j.titre("La pointe est en \\(P_1\\), la cible en \\(P_2\\). Distance ?");
      j.nombre({ avant: "d =", cases: [{ attendu: 5, tol: 0.001 }], ligne: true, aide: function () { return "\\(\\sqrt{3^2 + 4^2 + 0^2}\\)."; },
        ok: function () { j.bravo("5."); j.suite(); } });
    } },
    { nom: "Angle", jouer: function (j, n) {
      n.k = 1;
      n.objets = [{ t: "vec", a: [0, 0, 0], b: [1.6, 1.6, 0], c: D.C.v, nom: "a" }, { t: "vec", a: [0, 0, 0], b: [2.2, 0, 0], c: D.C.acc, nom: "b" }];
      n.bande = "\\vec{a} = (1 \\,;\\ 1 \\,;\\ 0) \\qquad \\vec{b} = (1 \\,;\\ 0 \\,;\\ 0)"; n.dessin();
      j.titre("Quel angle entre \\(\\vec{a}\\) et \\(\\vec{b}\\), en degrés ?");
      j.nombre({ avant: "\\theta =", apres: "°", cases: [{ attendu: 45, tol: 0.5 }], ligne: true, aide: function () { return "\\(\\cos\\theta = \\dfrac{\\vec{a} \\cdot \\vec{b}}{\\|\\vec{a}\\|\\,\\|\\vec{b}\\|} = \\dfrac{1}{\\sqrt{2}}\\)."; },
        ok: function () { j.bravo("\\(\\cos\\theta = 1/\\sqrt{2}\\), donc 45°."); j.suite(); } });
    } },
    { nom: "Perpendiculaire", jouer: function (j, n) {
      n.objets = [{ t: "vec", a: [0, 0, 0], b: [2, 0, 0], c: D.C.acc, nom: "u" }, { t: "vec", a: [0, 0, 0], b: [0, 3, 0], c: D.C.jeu, nom: "v" }];
      n.bande = "\\vec{u} = (2 \\,;\\ 0 \\,;\\ 0) \\qquad \\vec{v} = (0 \\,;\\ 3 \\,;\\ 0)"; n.dessin();
      j.titre("Calcule \\(\\vec{u} \\wedge \\vec{v}\\).");
      j.nombre({ avant: "\\vec{u} \\wedge \\vec{v} =", cases: [{ attendu: 0, tol: 0 }, { attendu: 0, tol: 0 }, { attendu: 6, tol: 0 }],
        aide: function () { return "Perpendiculaire au sol, vers le haut (main droite), de longueur \\(2 \\times 3 \\times \\sin 90°\\)."; },
        ok: function () { n.objets.push({ t: "vec", a: [0, 0, 0], b: [0, 0, 2.4], c: D.C.v, nom: "u ∧ v (÷2,5)" }); n.dessin(); j.bravo("\\((0 \\,;\\ 0 \\,;\\ 6)\\)."); j.suite(); } });
    } },
    { nom: "Cylindrique", jouer: function (j, n) {
      n.objets = [{ t: "pt", p: [0, -2, 1], nom: "P" }, { t: "seg", a: [0, 0, 0], b: [0, -2, 0], c: D.C.acc, ep: 3, tirets: "6 5" }];
      n.bande = "(r \\,;\\ \\theta \\,;\\ z) = (2 \\,;\\ -90° \\,;\\ 1)"; n.dessin();
      j.titre("Un point a pour coordonnées cylindriques \\((2 \\,;\\ -90° \\,;\\ 1)\\). Ses coordonnées cartésiennes ?");
      j.nombre({ avant: "(x \\,;\\ y \\,;\\ z) =", cases: [{ attendu: 0, tol: 0.001 }, { attendu: -2, tol: 0.001 }, { attendu: 1, tol: 0.001 }],
        aide: function () { return "\\(x = 2\\cos(-90°)\\), \\(y = 2\\sin(-90°)\\), et \\(z\\) ne change pas."; },
        ok: function () { j.bravo("\\((0 \\,;\\ -2 \\,;\\ 1)\\)."); j.suite(); } });
    } },
    { nom: "Chasles", jouer: function (j, n) {
      var R = E.Rz(90 * D.DEG);
      n.objets = [{ t: "pave", M: R, o: [1, 1, 0], centre: [0.9, 0, 0.1], h: [1.2, 0.3, 0.1], c: "#d8c8f0" },
        { t: "vec", a: [1, 1, 0.25], b: [1, 2.2, 0.25], c: D.C.x, ep: 4, nom: "xₛ" }, { t: "vec", a: [1, 1, 0.25], b: [-0.2, 1, 0.25], c: D.C.y, ep: 4, nom: "yₛ" },
        { t: "pt", p: [1, 1, 0], c: D.C.encre, nom: "Oₛ" }];
      n.bande = "\\overrightarrow{O_0O_s} = (1 \\,;\\ 1 \\,;\\ 0) \\qquad \\overrightarrow{O_sM} = 2\\,\\vec{x}_s"; n.dessin();
      j.titre("Le solide a tourné de 90° autour de \\(\\vec{z}_0\\). Le point M est à 2 sur \\(\\vec{x}_s\\). Où est-il dans \\(R_0\\) ?");
      j.nombre({ avant: "\\overrightarrow{O_0M} =", cases: [{ attendu: 1, tol: 0.001 }, { attendu: 3, tol: 0.001 }, { attendu: 0, tol: 0.001 }],
        aide: function () { return "Après 90°, \\(\\vec{x}_s = \\vec{y}_0\\) : \\(\\overrightarrow{O_sM} = (0 \\,;\\ 2 \\,;\\ 0)\\) dans \\(R_0\\). Ajoute \\(\\overrightarrow{O_0O_s}\\)."; },
        ok: function () {
          n.objets.push({ t: "pt", p: [1, 3, 0], c: D.C.jeu, nom: "M" }); n.dessin();
          j.bravo("\\((1 \\,;\\ 3 \\,;\\ 0)\\).");
          j.expliquer("<p>Boss vaincu. Pour la dernière question, il a fallu traduire \\(\\vec{x}_s\\) dans \\(R_0\\) : c'est exactement ce que fera la matrice de rotation au chapitre suivant.</p>");
          j.suite();
        } });
    } }
  ]
});
