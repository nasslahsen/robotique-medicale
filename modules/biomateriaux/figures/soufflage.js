(function () {
  "use strict";
  var R = RM, C = R.C;
  var T = function (a) { return PLATEFORME.teinte(a); };
  function txt(g, s, p, o) { o = o || {}; o.italique = false; o.gras = o.gras === undefined ? true : o.gras; return R.texte(g, s, p, o); }
  // contours gauches (haut vers bas) : même nombre de points pour passer de l'un à l'autre
  var PRE = [[18, 110], [18, 135], [14, 150], [14, 200], [14, 240], [14, 280], [12, 300], [5, 310], [0, 312]];
  var BOU = [[18, 110], [18, 135], [52, 175], [74, 205], [76, 260], [76, 350], [74, 372], [52, 384], [0, 386]];
  var TUB = [[18, 110], [18, 135], [18, 175], [18, 205], [18, 260], [18, 340], [18, 372], [7, 384], [0, 386]];
  function mix(A, B, u) { return A.map(function (p, i) { return [p[0] + (B[i][0] - p[0]) * u, p[1] + (B[i][1] - p[1]) * u]; }); }
  function forme(pts, cx) {
    var a = pts.map(function (p) { return [cx - p[0], p[1]]; }), b = pts.slice().reverse().map(function (p) { return [cx + p[0], p[1]]; });
    return "M" + a.concat(b).map(function (p) { return p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" L") + " Z";
  }

  /* ---------- Figure 1 : les deux soufflages côte à côte ---------- */
  (function () {
    var f = R.figure("fig-soufflage", {
      largeur: 960, hauteur: 500, titre: "Injection-soufflage (à gauche) et extrusion-soufflage (à droite)",
      essai: "<strong>Essaie</strong> : fais avancer le cycle avec le curseur. <strong>Observe</strong> : à gauche, la préforme injectée est étirée par la canne puis gonflée ; à droite, le moule se ferme sur un tube ouvert et le pince en bas avant le soufflage. Regarde le fond de chaque flacon à la fin."
    });
    var g = R.el("g", null, f.svg);
    var c = R.curseur(f.reglages, { nom: "Avancement du cycle", min: 0, max: 100, pas: 1, val: 0, unite: " %" });
    c.surChange(dessiner);
    function moule(cx, ecart, vide) {
      R.el("rect", { x: cx - 150 - ecart, y: 100, width: 150, height: 300, rx: 8, fill: "#c6cbd8", stroke: C.fonce, "stroke-width": 3 }, g);
      R.el("rect", { x: cx + ecart, y: 100, width: 150, height: 300, rx: 8, fill: "#c6cbd8", stroke: C.fonce, "stroke-width": 3 }, g);
      if (vide) R.el("path", { d: forme(BOU, cx), fill: "#fff", stroke: C.fonce, "stroke-width": 2 }, g);
    }
    function souffle(cx, u) { if (u > 0.02 && u < 1) [[-1, 210], [1, 260], [-1, 310]].forEach(function (a) { R.fleche(g, [cx + a[0] * 8, a[1]], [cx + a[0] * (12 + 46 * u), a[1] + 8], { couleur: "#3b5bdb", epaisseur: 3 }); }); }
    function dessiner() {
      R.vider(g);
      var t = c.v / 100;
      // gauche : injection-soufflage ; u = gonflage
      var cx = 240, u = Math.max(0, Math.min(1, (t - 0.25) / 0.6));
      txt(g, "injection-soufflage", [cx, 40], { taille: 20, couleur: C.fonce });
      moule(cx, 0, true);
      var canne = 260 + 110 * u;
      R.el("path", { d: forme(mix(PRE, BOU, u), cx), fill: T(t < 0.25 ? 0.65 : 0.35 + 0.2 * u), stroke: C.acc, "stroke-width": 3 }, g);
      R.el("rect", { x: cx - 6, y: 70, width: 12, height: canne - 70, fill: "#e8b931", stroke: C.fonce, "stroke-width": 2 }, g);
      R.el("circle", { cx: cx, cy: 312 + 74 * u, r: 5, fill: C.fonce }, g);
      souffle(cx, u);
      txt(g, "canne d'étirage", [cx - 170, 74], { taille: 15, couleur: "#a07c10", ancre: "start" });
      txt(g, t < 0.25 ? "préforme injectée, chauffée" : u < 1 ? "étirage et soufflage" : "flacon", [cx, 430], { taille: 16, couleur: C.acc });
      if (u >= 1) txt(g, "point d'injection au fond", [cx, 456], { taille: 15, couleur: C.fonce });
      // droite : extrusion-soufflage ; fermeture puis gonflage
      var dx = 720, fe = Math.max(0, Math.min(1, t / 0.25)), v = u;
      txt(g, "extrusion-soufflage", [dx, 40], { taille: 20, couleur: C.fonce });
      R.el("rect", { x: dx - 50, y: 58, width: 100, height: 36, rx: 6, fill: "#9aa0ad", stroke: C.fonce, "stroke-width": 2.5 }, g);
      txt(g, "tête d'extrusion", [dx + 62, 76], { taille: 14, couleur: C.doux, ancre: "start" });
      moule(dx, 80 * (1 - fe), fe >= 1);
      if (fe < 1) R.el("rect", { x: dx - 18, y: 94, width: 36, height: 300, fill: T(0.65), stroke: C.acc, "stroke-width": 3 }, g);
      else R.el("path", { d: forme(mix(TUB, BOU, v), dx), fill: T(0.35 + 0.2 * v), stroke: C.acc, "stroke-width": 3 }, g);
      if (fe >= 1) R.el("rect", { x: dx - 20, y: 382 + 2 * v, width: 40, height: 7, rx: 3, fill: C.fonce }, g);
      souffle(dx, fe >= 1 ? v : 0);
      txt(g, fe < 1 ? "tube chaud, le moule se ferme" : v < 1 ? "tube pincé, soufflage" : "flacon", [dx, 430], { taille: 16, couleur: C.acc });
      if (fe >= 1) txt(g, "ligne de soudure au fond", [dx, 456], { taille: 15, couleur: C.fonce });
      f.direct.innerHTML = t < 0.25 ? "Début : à gauche, la préforme sort de l'injection et est chauffée ; à droite, le tube sort de l'extrudeuse et le moule se ferme dessus."
        : u < 1 ? "Air comprimé : la matière est poussée contre les parois des deux moules. À gauche, la canne d'étirage allonge la préforme."
        : "Fin : deux flacons de même forme. Seul le fond les distingue : un point (préforme injectée) ou une ligne (tube pincé).";
    }
    dessiner();
  })();

  /* ---------- Figure 2 : lire le fond d'un contenant ---------- */
  (function () {
    var f = R.figure("fig-fonds", {
      largeur: 960, hauteur: 360, titre: "Fonds de trois contenants vus de dessous",
      essai: "<strong>Essaie</strong> : touche chaque fond. <strong>Observe</strong> : le point et la ligne trahissent l'ébauche ; le fond lisse d'une pièce creuse sans soudure renvoie au rotomoulage."
    });
    var g = R.el("g", null, f.svg), vu = {};
    var F = [
      { x: 170, type: "point", nom: "Injection-soufflage", pourquoi: "le point est la trace du seuil par lequel la préforme a été injectée." },
      { x: 480, type: "ligne", nom: "Extrusion-soufflage", pourquoi: "la ligne vient du tube ouvert, pincé et soudé par le moule en se fermant." },
      { x: 790, type: "lisse", nom: "Rotomoulage", pourquoi: "une pièce creuse sans soudure ni collage : la poudre s'est déposée sur la paroi d'un moule qui tourne." }
    ];
    function dessiner() {
      R.vider(g);
      F.forEach(function (c, k) {
        var gb = R.el("g", { style: "cursor:pointer" }, g);
        R.el("circle", { cx: c.x, cy: 160, r: 120, fill: vu[k] ? T(0.12) : "#f3f5fa", stroke: C.fonce, "stroke-width": 3 }, gb);
        R.el("circle", { cx: c.x, cy: 160, r: 92, fill: "none", stroke: "#c6cbd8", "stroke-width": 2 }, gb);
        if (c.type === "point") R.el("circle", { cx: c.x, cy: 160, r: 9, fill: C.acc }, gb);
        if (c.type === "ligne") R.el("rect", { x: c.x - 70, y: 156, width: 140, height: 8, rx: 4, fill: C.acc }, gb);
        txt(gb, vu[k] ? c.nom : "contenant " + (k + 1), [c.x, 320], { taille: 18, couleur: vu[k] ? C.acc : C.fonce });
        gb.addEventListener("click", function () { vu[k] = true; dessiner(); f.direct.innerHTML = "<strong>" + c.nom + "</strong> : " + c.pourquoi; });
      });
    }
    dessiner();
    f.direct.innerHTML = "Touche un fond pour lire son procédé.";
  })();
})();
