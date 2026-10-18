/* Figures : calculer le taux de renouvellement d'air (ACH) ; comparer trois distributions de l'air. */
(function () {
  "use strict";
  var R = RM, A = ARCHI, C = A.C;

  /* ---------- Figure 1 : ACH = débit / volume ---------- */
  (function () {
    var f = R.figure("fig-ach", {
      largeur: 960, hauteur: 540, titre: "Renouvellements d'air par heure",
      essai: "<strong>Essaie</strong> : règle les dimensions de la salle et le débit soufflé. <strong>Observe</strong> : l'ACH se compare à un repère qui dépend du référentiel (environ 15 selon le CDC pour un système conventionnel, plus de 22 en conception selon la HIS 2026)."
    });
    var g = A.s("g", null, f.svg);
    var cL = R.curseur(f.reglages, { nom: "Longueur [m]", min: 5, max: 10, pas: 0.5, val: 7, dec: 1, surChange: dessiner });
    var cl = R.curseur(f.reglages, { nom: "Largeur [m]", min: 5, max: 9, pas: 0.5, val: 6, dec: 1, surChange: dessiner });
    var ch = R.curseur(f.reglages, { nom: "Hauteur [m]", min: 2.5, max: 4, pas: 0.1, val: 3, dec: 1, surChange: dessiner });
    var cQ = R.curseur(f.reglages, { nom: "Débit [m³/h]", min: 500, max: 5000, pas: 10, val: 1890, surChange: dessiner });
    var zone = R.h("div", null, "", f.direct);
    function dessiner() {
      A.vider(g);
      var V = A.calc.volume(cL.v, cl.v, ch.v), n = A.calc.ach(cQ.v, V);
      // boîte en perspective, proportionnelle
      var s = 34, w = cL.v * s, d = cl.v * s * 0.5, h = ch.v * s, x0 = 60, y0 = 400;
      A.s("path", { d: "M" + x0 + " " + (y0 - h) + " l" + d + " " + (-d * 0.8) + " h" + w + " l" + (-d) + " " + (d * 0.8) + " Z", fill: "#eef2f7", stroke: C.encre, "stroke-width": 3 }, g);
      A.s("path", { d: "M" + (x0 + w) + " " + (y0 - h) + " l" + d + " " + (-d * 0.8) + " v" + h + " l" + (-d) + " " + (d * 0.8) + " Z", fill: "#e3e8f0", stroke: C.encre, "stroke-width": 3 }, g);
      A.s("rect", { x: x0, y: y0 - h, width: w, height: h, fill: "#f7f9fc", stroke: C.encre, "stroke-width": 3 }, g);
      A.texte(g, "V = " + R.fmt(V, 1) + " m³", [x0 + w / 2, y0 + 30], { taille: 18, mono: true });
      // jauge ACH
      var gx = 560, gy = 470, gh = 400, max = 40, y = function (v) { return gy - Math.min(v, max) / max * gh; };
      A.s("rect", { x: gx, y: gy - gh, width: 60, height: gh, rx: 8, fill: C.pale }, g);
      A.s("rect", { x: gx, y: y(n), width: 60, height: gy - y(n), rx: 8, fill: n > 22 ? C.ok : n >= 15 ? "#e8a317" : C.ko }, g);
      [[15, "≈ 15 : CDC, système conventionnel"], [22, "> 22 : conception, HIS 2026"]].forEach(function (r) {
        A.s("line", { x1: gx - 10, y1: y(r[0]), x2: gx + 80, y2: y(r[0]), stroke: C.encre, "stroke-width": 2.5, "stroke-dasharray": "6 4" }, g);
        A.texte(g, r[1], [gx + 92, y(r[0])], { taille: 15, ancre: "start" });
      });
      A.texte(g, R.fmt(n, 1) + " ACH", [gx + 30, y(n) - 20], { taille: 20, mono: true, gras: 800 });
      R.rendre(zone, "\\text{ACH} = \\frac{Q}{V} = \\frac{" + R.tc(cQ.v, 0) + "}{" + R.tc(V, 2) + "} = " + R.tn(n, 1));
    }
    dessiner();
  })();

  /* ---------- Figure 2 : distribution de l'air ---------- */
  (function () {
    var f = R.figure("fig-distribution", {
      largeur: 960, hauteur: 540, titre: "Par où souffler, par où extraire ?",
      essai: "<strong>Essaie</strong> : choisis une configuration et lance l'air. <strong>Observe</strong> : avec un soufflage au plafond et une extraction basse, l'air propre descend sur la table et emporte les particules vers le sol."
    });
    var g = A.s("g", null, f.svg), ga = A.s("g", null, f.svg), cfg = 0, u = 1;
    var b = R.boutons(f.reglages), bts = [];
    ["Plafond → extraction basse", "Sol → extraction haute", "Mur → mur opposé"].forEach(function (t, i) { bts.push(R.bouton(b, t, function () { cfg = i; dessiner(); lancer(); })); });
    var zone = R.h("div", null, "", f.direct);
    function fleches() {
      A.vider(ga);
      var S = [[[300, 60], [300, 380]], [[480, 60], [480, 380]], [[660, 60], [660, 380]]];
      if (cfg === 1) S = [[[250, 470], [430, 90]], [[480, 470], [560, 90]], [[700, 470], [700, 90]]];
      if (cfg === 2) S = [[[130, 150], [820, 300]], [[130, 250], [820, 380]], [[130, 350], [820, 460]]];
      S.forEach(function (sg) { if (u >= 1) A.fleche(ga, sg[0], sg[1], { coul: cfg === 0 ? C.acc : C.ko, ep: 4 }); else A.souffle(ga, sg[0], sg[1], u, { nb: 2, coul: cfg === 0 ? C.acc : C.ko }); });
    }
    function lancer() { A.animer(2600, function (x) { u = x; fleches(); }); }
    function dessiner() {
      A.vider(g);
      bts.forEach(function (bt, i) { bt.classList.toggle("actif", i === cfg); });
      A.s("rect", { x: 100, y: 30, width: 760, height: 470, fill: "#fff", stroke: C.encre, "stroke-width": 5 }, g);
      A.s("rect", { x: 380, y: 380, width: 200, height: 18, fill: C.doux }, g); A.s("rect", { x: 470, y: 398, width: 20, height: 100, fill: C.doux }, g);
      A.s("circle", { cx: 400, cy: 370, r: 14, fill: "#f6c2b0" }, g);
      var souf = cfg === 0 ? [[200, 36, 760, 36]] : cfg === 1 ? [[200, 494, 420, 494]] : [[106, 120, 106, 380]];
      var ext = cfg === 0 ? [[106, 430, 106, 494], [854, 430, 854, 494]] : cfg === 1 ? [[540, 36, 760, 36]] : [[854, 260, 854, 494]];
      souf.forEach(function (q) { A.s("line", { x1: q[0], y1: q[1], x2: q[2], y2: q[3], stroke: C.acc, "stroke-width": 12 }, g); });
      ext.forEach(function (q) { A.s("line", { x1: q[0], y1: q[1], x2: q[2], y2: q[3], stroke: C.gris, "stroke-width": 12 }, g); });
      A.texte(g, "soufflage d'air filtré (bleu), extraction (gris)", [480, 525], { taille: 15, coul: C.doux });
      zone.innerHTML = ["Principe classique : air filtré introduit par le plafond, extraction à proximité du sol. Le CDC décrit notamment cette configuration pour les salles conventionnelles.", "L'air propre arrive par le bas et soulève les poussières du sol vers le champ opératoire avant de repartir au plafond.", "L'air balaie la salle de côté : il emporte vers la table ce qu'il ramasse en chemin."][cfg];
      fleches();
    }
    dessiner();
  })();
})();
