(function () {
  "use strict";
  var R = RM, C = R.C;

  /* ---------- Croissance composée : barres et taux ---------- */
  (function () {
    var f = R.figure("fig-croissance", {
      largeur: 960, hauteur: 480, titre: "Évolution du marché mondial des biomatériaux",
      essai: "<strong>Essaie</strong> : règle le taux annuel, puis compare la projection depuis 2015 (trait bleu) aux valeurs du cours. <strong>Observe</strong> : environ 14 % par an suffit jusqu'en 2016, mais il faut environ 16 % par an pour atteindre 149,17 milliards en 2021."
    });
    var DON = [[2013, 48], [2014, 54.6], [2015, 62.07], [2016, 70.9], [2017, 88.4], [2018, null], [2019, 102.5], [2020, 130.57], [2021, 149.17]];
    var ct = R.curseur(f.reglages, { nom: "Taux annuel", min: 5, max: 25, pas: 0.5, val: 14, unite: " %", dec: 1, surChange: dessin });
    var g = R.el("g", null, f.svg);
    var X0 = 100, Y0 = 420, H = 340 / 160;
    function Y(v) { return Y0 - v * H; }
    function dessin() {
      R.vider(g);
      var t = ct.v / 100;
      for (var v = 0; v <= 160; v += 40) { R.ligne(g, [X0 - 8, Y(v)], [920, Y(v)], { couleur: v ? "#eef0f5" : C.fonce, epaisseur: v ? 1.5 : 3 }); R.texte(g, String(v), [X0 - 16, Y(v)], { italique: false, couleur: C.doux, taille: 15, ancre: "end" }); }
      R.texte(g, "milliards de $", [X0 - 10, 50], { italique: false, couleur: C.doux, taille: 15, ancre: "start" });
      var pts = [];
      DON.forEach(function (d, k) {
        var x = X0 + 20 + k * 90, proj = d[0] >= 2019;
        if (d[1] !== null) {
          R.el("rect", { x: x, y: Y(d[1]), width: 54, height: d[1] * H, rx: 6, fill: proj ? PLATEFORME.teinte(0.3) : C.acc, stroke: proj ? C.acc : "none", "stroke-width": 2, "stroke-dasharray": proj ? "5 4" : null }, g);
          R.texte(g, R.fmt(d[1], d[1] % 1 ? 2 : 0).replace(/,?0+$/, ""), [x + 27, Y(d[1]) - 16], { italique: false, taille: 15 });
        }
        R.texte(g, d[0] + (proj ? " p" : ""), [x + 27, Y0 + 24], { italique: false, couleur: C.doux, taille: 15 });
        if (d[0] >= 2015) pts.push([x + 27, Y(BIO.projection(62.07, t, d[0] - 2015))]);
      });
      R.el("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: C.z, "stroke-width": 4 }, g);
      pts.forEach(function (p) { R.el("circle", { cx: p[0], cy: p[1], r: 5, fill: C.z }, g); });
      var p21 = BIO.projection(62.07, t, 6);
      f.direct.innerHTML = "<p>Depuis 62,07 en 2015, à " + R.fmt(ct.v, 1) + " % par an : " + R.fmt(p21, 1) + " milliards de $ en 2021 (cours : 149,17). Formule : \\(V_{2021} = 62{,}07\\,(1+t)^6\\).</p>";
      if (window.renderMathInElement) window.renderMathInElement(f.direct, { delimiters: [{ left: "\\(", right: "\\)", display: false }], throwOnError: false });
    }
    dessin();
  })();

  /* ---------- Dépenses de santé par habitant (2018) ---------- */
  (function () {
    var f = R.figure("fig-depenses", {
      largeur: 960, hauteur: 460, titre: "Dépenses de santé par habitant en 2018",
      essai: "<strong>Essaie</strong> : touche une barre. <strong>Observe</strong> : un habitant des États-Unis dépense pour sa santé plus de quinze fois ce que dépense un habitant de la Chine ; les marchés les plus riches tirent les dispositifs innovants."
    });
    var P = [["États-Unis", 8971], ["Suisse", 6200], ["Allemagne", 5073], ["France", 4208], ["Belgique", 4190], ["Royaume-Uni", 3448], ["Espagne", 2815], ["Corée du Sud", 2705], ["Pologne", 1742], ["Brésil", 1085], ["Chine", 573]];
    var g = R.el("g", null, f.svg), choisi = 3;
    function dessin() {
      R.vider(g);
      P.forEach(function (p, k) {
        var y = 24 + k * 38, l = p[1] / 8971 * 640, a = k === choisi, grp = R.el("g", { style: "cursor:pointer" }, g);
        R.texte(grp, p[0], [180, y + 14], { italique: false, taille: 16, ancre: "end", gras: a });
        R.el("rect", { x: 196, y: y, width: l, height: 28, rx: 6, fill: a ? C.acc : PLATEFORME.teinte(0.35) }, grp);
        R.texte(grp, p[1].toLocaleString("fr-FR").replace(/ | /g, " ") + " €", [204 + l, y + 14], { italique: false, taille: 15, ancre: "start", gras: a });
        grp.addEventListener("click", function () { choisi = k; dessin(); });
      });
      var p = P[choisi];
      f.direct.innerHTML = "<p><strong>" + p[0] + "</strong> : " + p[1].toLocaleString("fr-FR") + " € par habitant, soit " + R.fmt(p[1] / 573, 1) + " fois la Chine et " + R.fmt(p[1] / 8971 * 100, 0) + " % des États-Unis.</p>";
    }
    dessin();
  })();
})();
