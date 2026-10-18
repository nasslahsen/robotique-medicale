(function () {
  "use strict";
  var R = RM, C = R.C;
  function T(g, s, p, o) { o = o || {}; if (o.italique === undefined) o.italique = false; return R.texte(g, s, p, o); }

  /* ---------- Figure 1 : rapport de forme et groupe ---------- */
  (function () {
    var f = R.figure("fig-forme", {
      largeur: 960, hauteur: 420, titre: "Rapport de forme d'une particule de renfort",
      essai: "<strong>Essaie</strong> : choisis la forme, puis règle la grande et la petite dimension. <strong>Observe</strong> : le rapport de forme (grande / petite dimension) classe la particule dans l'un des quatre groupes du cours. Une aiguille de rapport 100 ou plus devient une fibre."
    });
    var g = R.el("g", null, f.svg);
    var b = R.boutons(f.reglages), forme = "batonnet";
    var bf = [["grain", "Grain"], ["plaquette", "Plaquette"], ["batonnet", "Bâtonnet"]].map(function (x) { return [x[0], R.bouton(b, x[1], function () { forme = x[0]; if (forme === "grain") cg.set(cp.v); dessin(); })]; });
    var cg = R.curseur(f.reglages, { nom: "Grande dimension", min: 1, max: 200, pas: 1, val: 15, surChange: dessin });
    var cp = R.curseur(f.reglages, { nom: "Petite dimension", min: 1, max: 5, pas: 0.5, val: 1, surChange: dessin });
    var zone = R.h("div", null, "", f.direct);
    var EX = { granulaire: "billes de verre, CaCO₃, noir de carbone", lamellaire: "talc (≈ 10), mica (30 à 40)", aciculaire: "wollastonite (10 à 20), fibres courtes L < 2 mm (10 à 100)", fibrillaire: "fibres longues L ≥ 2 mm : verre, carbone" };
    function dessin() {
      bf.forEach(function (x) { x[1].classList.toggle("actif", x[0] === forme); });
      R.vider(g);
      var G = forme === "grain" ? cp.v : cg.v, p = cp.v, rap = BIO.rapportForme(G, p), grp = BIO.groupeRenfort(forme, rap);
      // dessin à l'échelle, limité au cadre : au-delà, la particule est coupée et prolongée par des pointillés
      var u = 24, L = Math.min(G * u, 800), d = p * u, cx = 480, cy = 150;
      if (forme === "grain") R.el("circle", { cx: cx, cy: cy, r: d * 1.5, fill: PLATEFORME.teinte(0.45), stroke: C.fonce, "stroke-width": 2.5 }, g);
      else if (forme === "plaquette") {
        R.el("ellipse", { cx: cx, cy: cy + d / 2, rx: L / 2, ry: Math.min(L / 5, 70), fill: PLATEFORME.teinte(0.55), stroke: C.fonce, "stroke-width": 2.5 }, g);
        R.el("ellipse", { cx: cx, cy: cy - d / 2, rx: L / 2, ry: Math.min(L / 5, 70), fill: PLATEFORME.teinte(0.3), stroke: C.fonce, "stroke-width": 2.5 }, g);
      } else {
        R.el("rect", { x: cx - L / 2, y: cy - d / 2, width: L, height: d, rx: d / 2, fill: PLATEFORME.teinte(0.5), stroke: C.fonce, "stroke-width": 2.5 }, g);
        if (G * u > 800) [-1, 1].forEach(function (s) { R.ligne(g, [cx + s * 405, cy], [cx + s * 450, cy], { couleur: C.acc, epaisseur: 3, tirets: "4 6" }); });
      }
      // échelle des groupes
      var X0 = 120, X1 = 840, xr = function (v) { return X0 + Math.log10(Math.max(1, v)) / 3 * (X1 - X0); };
      [["granulaire", 1, 2], ["lamellaire", 10, 40], ["aciculaire", 10, 100], ["fibrillaire", 100, 1000]].forEach(function (z, i) {
        var y = 300 + (i % 2) * 34, on = z[0] === grp;
        R.el("rect", { x: xr(z[1]), y: y, width: Math.max(14, xr(z[2]) - xr(z[1])), height: 24, rx: 8, fill: on ? C.acc : "#e3e6ee" }, g);
        T(g, z[0], [xr(z[1]) + 6, y + 12], { taille: 14, gras: true, ancre: "start", couleur: on ? "#fff" : C.doux, halo: false });
      });
      [1, 10, 100, 1000].forEach(function (v) { T(g, String(v), [xr(v), 386], { taille: 14 }); });
      R.point(g, [xr(rap), 292], { r: 9, couleur: C.z, contour: "#fff" });
      T(g, "rapport de forme (échelle log)", [480, 408], { taille: 14, couleur: C.doux });
      zone.innerHTML = "Rapport de forme = " + R.fmt(G, 0) + " / " + R.fmt(p, 1) + " = <strong>" + R.fmt(rap, rap < 10 ? 1 : 0) + "</strong> : groupe <strong>" + grp + "</strong>. Exemples du cours : " + EX[grp] + ".";
    }
    dessin();
  })();

  /* ---------- Figure 2 : polypropylène chargé et renforcé ---------- */
  (function () {
    var f = R.figure("fig-pp", {
      largeur: 960, hauteur: 440, titre: "Module E et HDT du polypropylène chargé",
      essai: "<strong>Essaie</strong> : choisis une charge ou un renfort. <strong>Observe</strong> : de la charge granulaire (CaCO₃) à la lamellaire (talc) puis aux fibres de verre, le module et la température de fléchissement sous charge montent ensemble. Valeurs du tableau du cours."
    });
    var g = R.el("g", null, f.svg), choix = 3, zone = R.h("div", null, "", f.direct);
    var PP = [["PP seul", 1.7, 65], ["PP + 40 % CaCO₃", 2.8, 75], ["PP + 40 % talc", 4.2, 97], ["PP + 30 % FV", 6.5, 148]];
    var b = R.boutons(f.reglages);
    var bt = PP.map(function (p, i) { return R.bouton(b, p[0], function () { choix = i; dessin(); }); });
    function dessin() {
      bt.forEach(function (x, i) { x.classList.toggle("actif", i === choix); });
      R.vider(g);
      var Y0 = 380, H = 300;
      R.ligne(g, [80, Y0], [900, Y0], { epaisseur: 2.5 });
      T(g, "E (GPa)", [80, 40], { taille: 16, gras: true, couleur: C.acc, ancre: "start" });
      T(g, "HDT (°C)", [900, 40], { taille: 16, gras: true, couleur: C.z, ancre: "end" });
      PP.forEach(function (p, i) {
        var x = 130 + i * 200, sel = i === choix, hE = p[1] / 7 * H, hT = p[2] / 160 * H;
        R.el("rect", { x: x, y: Y0 - hE, width: 60, height: hE, rx: 6, fill: sel ? C.acc : PLATEFORME.teinte(0.35) }, g);
        T(g, R.fmt(p[1], 1), [x + 30, Y0 - hE - 16], { taille: 16, gras: true, couleur: C.acc });
        R.el("rect", { x: x + 72, y: Y0 - hT, width: 60, height: hT, rx: 6, fill: sel ? C.z : "rgba(59,91,219,0.3)" }, g);
        T(g, String(p[2]), [x + 102, Y0 - hT - 16], { taille: 16, gras: true, couleur: C.z });
        T(g, p[0], [x + 66, Y0 + 26], { taille: 15, gras: sel });
      });
      var p = PP[choix];
      zone.innerHTML = p[0] + " : E = " + R.fmt(p[1], 1) + " GPa (× " + R.fmt(p[1] / 1.7, 2) + " par rapport au PP seul), HDT = " + p[2] + " °C (+" + (p[2] - 65) + " °C).";
    }
    dessin();
  })();
})();
