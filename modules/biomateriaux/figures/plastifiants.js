(function () {
  "use strict";
  var R = RM, C = R.C;
  function T(g, s, p, o) { o = o || {}; if (o.italique === undefined) o.italique = false; return R.texte(g, s, p, o); }

  /* ---------- Figure 1 : le plastifiant écarte les chaînes ---------- */
  (function () {
    var f = R.figure("fig-plastifiant", {
      largeur: 960, hauteur: 460, titre: "Molécules de plastifiant entre les chaînes",
      essai: "<strong>Essaie</strong> : augmente la concentration en plastifiant. <strong>Observe</strong> : les petites molécules écartent les chaînes et coupent une partie des interactions (pointillés) ; la Tv et la rigidité baissent. Jauges illustratives : le cours donne le sens de variation, pas ces valeurs."
    });
    var g = R.el("g", null, f.svg);
    var cc = R.curseur(f.reglages, { nom: "Plastifiant [%]", min: 0, max: 50, pas: 5, val: 0, surChange: dessin });
    var zone = R.h("div", null, "", f.direct);
    function dessin() {
      R.vider(g);
      var c = cc.v, ec = 70 + 1.3 * c;
      for (var k = 0; k < 4; k++) {
        var y0 = 230 + (k - 1.5) * ec, pts = [];
        for (var x = 40; x <= 640; x += 16) pts.push([x, y0 + 12 * Math.sin(x / 30 + k)]);
        R.el("path", { d: BIO.cheminLisse(pts), fill: "none", stroke: C.fonce, "stroke-width": 3.5, "stroke-linecap": "round" }, g);
        if (k < 3) for (var x2 = 70; x2 < 630; x2 += 45) if ((x2 * 7 + k * 13) % 100 >= c * 2) R.ligne(g, [x2, y0 + 12 * Math.sin(x2 / 30 + k) + 7], [x2, y0 + ec + 12 * Math.sin(x2 / 30 + k + 1) - 7], { couleur: "#b8bfce", epaisseur: 2.5, tirets: "3 5" });
      }
      var r = BIO.hasard(5);
      for (var i = 0; i < Math.round(c * 0.9); i++) R.point(g, [50 + 580 * r(), 230 + (r() - 0.5) * 2.9 * ec], { r: 10, couleur: C.acc, contour: "#fff" });
      // jauges : Tv et rigidité (sens de variation)
      var Tv = 90 - 2.6 * c;
      [[720, "Tv", Tv, -50, 100, R.fmt(Tv, 0) + " °C"], [870, "rigidité", 1 - c / 60, 0, 1, ""]].forEach(function (j) {
        var h = 300 * (j[2] - j[3]) / (j[4] - j[3]);
        R.el("rect", { x: j[0], y: 80, width: 50, height: 300, rx: 10, fill: "#fff", stroke: C.fonce, "stroke-width": 2 }, g);
        R.el("rect", { x: j[0] + 4, y: 380 - h, width: 42, height: Math.max(0, h - 4), rx: 7, fill: PLATEFORME.teinte(0.7) }, g);
        T(g, j[1], [j[0] + 25, 60], { taille: 17, gras: true });
        if (j[5]) T(g, j[5], [j[0] + 25, 405], { taille: 15, gras: true, couleur: C.acc });
      });
      R.ligne(g, [712, 380 - 300 * 70 / 150], [778, 380 - 300 * 70 / 150], { couleur: C.z, epaisseur: 2.5, tirets: "5 4" });
      T(g, "20 °C", [790, 380 - 300 * 70 / 150], { taille: 14, couleur: C.z, ancre: "start" });
      zone.innerHTML = c === 0 ? "PVC sans plastifiant : Tv = 90 °C, rigide à l'ambiante." : c + " % de plastifiant : moins d'interactions entre chaînes, Tv " + (Tv < 20 ? "<strong>sous l'ambiante</strong> : le PVC est souple." : "en baisse, mais encore au-dessus de l'ambiante.");
    }
    dessin();
  })();

  /* ---------- Figure 2 : température de fragilité ---------- */
  (function () {
    var f = R.figure("fig-fragilite", {
      largeur: 960, hauteur: 360, titre: "Température de fragilité du PVC rigide et plastifié",
      essai: "<strong>Essaie</strong> : règle la température d'usage et la température de fragilité du PVC plastifié. <strong>Observe</strong> : une pièce casse quand on est sous sa température de fragilité ; le PVC rigide devient fragile dès 0 °C."
    });
    var g = R.el("g", null, f.svg);
    var cu = R.curseur(f.reglages, { nom: "Température d'usage [°C]", min: -80, max: 40, pas: 1, val: -18 });
    var cf = R.curseur(f.reglages, { nom: "Fragilité du PVC plastifié [°C]", min: -60, max: -5, pas: 1, val: -30 });
    cu.surChange(dessin); cf.surChange(dessin);
    var zone = R.h("div", null, "", f.direct);
    function xt(t) { return 100 + (t + 80) / 120 * 760; }
    function dessin() {
      R.vider(g);
      R.fleche(g, [70, 220], [890, 220], { couleur: C.fonce, epaisseur: 3 });
      for (var t = -80; t <= 40; t += 20) { R.ligne(g, [xt(t), 212], [xt(t), 228], { epaisseur: 2 }); T(g, String(t).replace("-", "−") + " °C", [xt(t), 250], { taille: 14 }); }
      R.el("rect", { x: xt(-60), y: 150, width: xt(-5) - xt(-60), height: 34, rx: 10, fill: PLATEFORME.teinte(0.18), stroke: C.acc, "stroke-width": 2 }, g);
      T(g, "plage du PVC plastifié : −5 à −60 °C", [(xt(-60) + xt(-5)) / 2, 130], { taille: 15, couleur: C.acc });
      R.point(g, [xt(cf.v), 167], { r: 11, couleur: C.acc, contour: "#fff" });
      R.point(g, [xt(0), 167], { r: 11, couleur: C.fonce, contour: "#fff" });
      T(g, "PVC rigide 0 °C", [xt(0) + 16, 130], { taille: 15, gras: true, ancre: "start" });
      R.ligne(g, [xt(cu.v), 90], [xt(cu.v), 300], { couleur: C.z, epaisseur: 3, tirets: "8 6" });
      T(g, "usage " + cu.v + " °C", [xt(cu.v), 318], { taille: 15, gras: true, couleur: C.z });
      var rig = cu.v < 0, pla = cu.v < cf.v;
      zone.innerHTML = "À " + cu.v + " °C : PVC rigide " + (rig ? "<strong>fragile</strong>" : "non fragile") + " ; PVC plastifié (fragilité " + cf.v + " °C) " + (pla ? "<strong>fragile</strong>" : "non fragile") + ".";
    }
    dessin();
  })();
})();
