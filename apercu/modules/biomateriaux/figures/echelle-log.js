(function () {
  "use strict";
  var R = RM, C = R.C;

  /* ---------- Figure 2 : échelle logarithmique des modules ---------- */
  (function () {
    var f = R.figure("fig-log", {
      largeur: 960, hauteur: 300,
      titre: "Modules des matériaux du cours sur une échelle logarithmique",
      essai: "<strong>Essaie</strong> : déplace le curseur log E d'une unité, puis de trois. " +
        "<strong>Observe</strong> : chaque unité multiplie le module par 10 ; de 6 à 9, on passe d'un caoutchouc (1 MPa) à un plastique rigide (1 GPa), mille fois plus rigide."
    });
    var g = R.el("g", null, f.svg);
    var c = R.curseur(f.reglages, { nom: "log E", min: 5, max: 12, pas: 0.05, val: 9, dec: 2 });
    c.surChange(dessin);
    var x0 = 70, u = 120, y = 190;
    function X(l) { return x0 + (l - 5) * u; }
    var MAT = [
      { nom: "élastomère ≈ 1 MPa", l: 6, c: C.v, d: -1 },
      { nom: "polymère typique 1 GPa", l: 9, c: C.z, d: -1 },
      { nom: "Ti-6Al-4V 110 GPa", l: Math.log10(110e9), c: C.doux, d: -1.7 },
      { nom: "acier 207 GPa", l: Math.log10(207e9), c: C.fonce, d: -1 }
    ];
    function dessin() {
      R.vider(g);
      // bande des polymères : 0,001 à 3 GPa
      R.el("rect", { x: X(6), y: y - 14, width: X(Math.log10(3e9)) - X(6), height: 28, rx: 8, fill: "rgba(59,91,219,0.12)" }, g);
      R.texte(g, "polymères : 0,001 à 3 GPa", [(X(6) + X(9.48)) / 2, y + 74], { italique: false, couleur: C.z, taille: 16 });
      R.fleche(g, [x0 - 20, y], [X(12) + 30, y], { couleur: C.fonce, epaisseur: 3 });
      for (var k = 5; k <= 12; k++) {
        R.ligne(g, [X(k), y - 12], [X(k), y + 12], { epaisseur: 3 });
        R.texte(g, "10", [X(k) - 4, y + 38], { italique: false, taille: 18, ancre: "end" });
        R.texte(g, String(k), [X(k) - 2, y + 28], { italique: false, taille: 13, ancre: "start" });
        if (k < 12) for (var m = 2; m < 10; m++) R.ligne(g, [X(k + Math.log10(m)), y - 6], [X(k + Math.log10(m)), y + 6], { couleur: C.gris, epaisseur: 1.5 });
      }
      R.texte(g, "Pa", [X(12) + 40, y + 34], { italique: false, taille: 16, couleur: C.doux });
      MAT.forEach(function (M) {
        var yy = y + M.d * 60;
        R.ligne(g, [X(M.l), y], [X(M.l), yy + (M.d < 0 ? 12 : -12)], { couleur: M.c, epaisseur: 2, tirets: "4 3" });
        R.el("circle", { cx: X(M.l), cy: y, r: 7, fill: M.c, stroke: "#fff", "stroke-width": 2 }, g);
        R.texte(g, M.nom, [X(M.l), yy], { italique: false, couleur: M.c, taille: 16, gras: true, ancre: M.l > 11.2 ? "start" : M.l > 11 ? "end" : "middle" });
      });
      var xc = X(c.v);
      R.el("polygon", { points: [[xc, y - 18], [xc - 10, y - 34], [xc + 10, y - 34]].join(" "), fill: C.acc }, g);
      var Ev = Math.pow(10, c.v);
      var txt = Ev >= 1e9 ? R.fmt(Ev / 1e9, Ev >= 1e10 ? 0 : 2) + " GPa" : Ev >= 1e6 ? R.fmt(Ev / 1e6, Ev >= 1e7 ? 0 : 2) + " MPa" : R.fmt(Ev / 1e3, 0) + " kPa";
      f.direct.innerHTML = "log E = " + R.fmt(c.v, 2) + " → E = 10<sup>" + R.fmt(c.v, 2) + "</sup> Pa ≈ <strong>" + txt + "</strong>";
    }
    dessin();
  })();
})();
