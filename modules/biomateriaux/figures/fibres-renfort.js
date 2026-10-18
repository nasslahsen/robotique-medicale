(function () {
  "use strict";
  var R = RM, C = R.C;
  function T(g, s, p, o) { o = o || {}; if (o.italique === undefined) o.italique = false; return R.texte(g, s, p, o); }

  /* ---------- Figure 1 : comparatif des renforts ---------- */
  (function () {
    var f = R.figure("fig-renforts", {
      largeur: 960, hauteur: 380, titre: "Les renforts du cours",
      essai: "<strong>Essaie</strong> : touche chaque renfort. <strong>Observe</strong> : chacun a un point fort et, souvent, une limite. Densités du cours quand elles sont données."
    });
    var g = R.el("g", null, f.svg), choisi = 0, zone = R.h("div", null, "", f.direct);
    var A = [
      ["verre", "#eef6fb", "Excellente résistance mécanique, inertie chimique, tenue thermique, isolation électrique. Le renfort de tous les jours (verre E : 90 % des applications)."],
      ["fibres de carbone", "#2f323a", "Module et résistance proches de l'acier pour une densité 4 fois inférieure (1,75 à 1,95) ; fatigue excellente, fluage réduit, conductrices. Limite : le prix."],
      ["noir de carbone", "#3a3d46", "Stabilisant contre le vieillissement UV, colorant, charge conductrice."],
      ["graphite", "#5b6172", "Bon frottement, usure limitée : pièces autolubrifiantes (paliers, coussinets)."],
      ["Kevlar (aramide)", "#f5d76e", "Excellente résistance en traction, utilisable à 180 °C, densité 1,49, bonne fatigue. Limites : allongement sous contrainte élevée, tenue en compression limitée."],
      ["mica", "#d9cfc0", "Lamellaire (renforcement bidirectionnel), très économique, inerte, isolant thermique, rigide, anti-UV."],
      ["wollastonite", "#e9e4da", "Minéral aciculaire, accroît la résistance thermique des polymères techniques."],
      ["PTFE (Téflon)", "#ffffff", "En poudre, pour sa tenue en température et ses qualités de frottement."]
    ];
    function dessin() {
      R.vider(g);
      A.forEach(function (a, i) {
        var x = 20 + (i % 4) * 232, y = 30 + Math.floor(i / 4) * 170, sel = i === choisi;
        R.el("rect", { x: x, y: y, width: 216, height: 150, rx: 18, fill: sel ? PLATEFORME.teinte(0.16) : "#fff", stroke: sel ? C.acc : "#c6cbd8", "stroke-width": sel ? 4 : 2.5, style: "cursor:pointer" }, g)
          .addEventListener("click", function () { choisi = i; dessin(); });
        var cx = x + 108, cy = y + 60, r = BIO.hasard(i + 3);
        if (i === 0 || i === 1 || i === 4) for (var k = 0; k < 6; k++) R.ligne(g, [cx - 70, cy - 25 + k * 10], [cx + 70, cy - 30 + k * 10], { couleur: i === 0 ? "#9aa0ad" : a[1], epaisseur: 4 });
        if (i === 2) for (var k2 = 0; k2 < 16; k2++) R.point(g, [cx - 50 + 100 * r(), cy - 30 + 60 * r()], { r: 7, couleur: a[1] });
        if (i === 3 || i === 5) for (var k3 = 0; k3 < 4; k3++) R.el("path", { d: "M" + (cx - 60) + " " + (cy - 30 + k3 * 16) + " l120 0 l-16 12 l-120 0 Z", fill: a[1], stroke: C.fonce, "stroke-width": 1.5 }, g);
        if (i === 6) for (var k4 = 0; k4 < 10; k4++) { var px = cx - 60 + 120 * r(), py = cy - 30 + 60 * r(); R.ligne(g, [px, py], [px + 26, py - 8], { couleur: "#8a8170", epaisseur: 4 }); }
        if (i === 7) for (var k5 = 0; k5 < 24; k5++) R.point(g, [cx - 50 + 100 * r(), cy - 30 + 60 * r()], { r: 4, couleur: "#fff", contour: C.gris });
        T(g, a[0], [cx, y + 125], { taille: 16, gras: true, couleur: sel ? C.acc : C.fonce });
      });
      zone.innerHTML = "<strong>" + A[choisi][0] + "</strong> : " + A[choisi][2];
    }
    dessin();
  })();

  /* ---------- Figure 2 : lire la désignation d'un fil de verre ---------- */
  (function () {
    var f = R.figure("fig-fil", {
      largeur: 960, hauteur: 300, titre: "Désignation d'un fil de verre",
      essai: "<strong>Essaie</strong> : change le type de verre, le fil, le diamètre, la masse linéique et la longueur de la bobine. <strong>Observe</strong> : la désignation se lit en quatre morceaux ; en tex, la masse linéique donne directement les grammes par kilomètre."
    });
    var g = R.el("g", null, f.svg);
    var TYPES = { E: "usage général, bonnes propriétés électriques (90 % des applications)", D: "hautes propriétés diélectriques", C: "bonne résistance chimique", S: "bonne résistance mécanique (S ou R)" };
    var b = R.boutons(f.reglages), type = "E", fil = "C";
    var bt = Object.keys(TYPES).map(function (k) { return [k, R.bouton(b, "Verre " + k, function () { type = k; dessin(); })]; });
    var b2 = R.boutons(f.reglages);
    var bfil = [["C", "Fil continu"], ["D", "Fil discontinu"]].map(function (x) { return [x[0], R.bouton(b2, x[1], function () { fil = x[0]; dessin(); })]; });
    var cd = R.curseur(f.reglages, { nom: "Diamètre [µm]", min: 5, max: 24, pas: 1, val: 9, surChange: dessin });
    var ct = R.curseur(f.reglages, { nom: "Masse linéique [tex]", min: 10, max: 2400, pas: 2, val: 68, surChange: dessin });
    var cl = R.curseur(f.reglages, { nom: "Longueur de la bobine [m]", min: 100, max: 5000, pas: 100, val: 1000, surChange: dessin });
    var zone = R.h("div", null, "", f.direct);
    function dessin() {
      bt.forEach(function (x) { x[1].classList.toggle("actif", x[0] === type); });
      bfil.forEach(function (x) { x[1].classList.toggle("actif", x[0] === fil); });
      R.vider(g);
      var morceaux = [[type, "type de verre"], [fil, fil === "C" ? "continu" : "discontinu (verranne)"], [String(cd.v), "diamètre en µm"], [String(ct.v), "masse linéique en tex"]];
      morceaux.forEach(function (m, i) {
        var x = 130 + i * 220;
        R.el("rect", { x: x - 80, y: 60, width: 160, height: 90, rx: 16, fill: "#fff", stroke: C.acc, "stroke-width": 3 }, g);
        T(g, m[0], [x, 105], { taille: 38, gras: true, couleur: C.acc });
        T(g, m[1], [x, 180], { taille: 15, couleur: C.doux });
      });
      var m = BIO.masseFil(ct.v, cl.v);
      T(g, "bobine de " + cl.v + " m : " + R.fmt(m, m < 100 ? 1 : 0) + " g", [480, 250], { taille: 20, gras: true });
      zone.innerHTML = "« " + type + " " + fil + " " + cd.v + " " + ct.v + " » : verre " + type + ", " + TYPES[type] + " ; fil " + (fil === "C" ? "continu" : "discontinu (verranne)") + " ; diamètre de référence " + cd.v + " µm ; " + ct.v + " tex = " + ct.v + " × 10⁻⁶ kg/m, soit " + ct.v + " g par kilomètre.";
    }
    dessin();
  })();

  /* ---------- Figure 3 : carbone contre acier ---------- */
  (function () {
    var f = R.figure("fig-acier", {
      largeur: 960, hauteur: 360, titre: "Fibre de carbone et acier à même volume",
      essai: "<strong>Essaie</strong> : change le volume de la pièce et la densité de la fibre de carbone (1,75 à 1,95). <strong>Observe</strong> : pour un module et une résistance voisins, la pièce en carbone pèse environ 4 fois moins que la pièce en acier. Comparaison simplifiée (fibre seule, densité de l'acier 7,87 du tableau du cours)."
    });
    var g = R.el("g", null, f.svg);
    var cv = R.curseur(f.reglages, { nom: "Volume [cm³]", min: 10, max: 200, pas: 5, val: 50, surChange: dessin });
    var cdn = R.curseur(f.reglages, { nom: "Densité du carbone", min: 1.75, max: 1.95, pas: 0.05, val: 1.8, dec: 2, surChange: dessin });
    var zone = R.h("div", null, "", f.direct);
    function dessin() {
      R.vider(g);
      var V = cv.v, ma = 7.87 * V, mc = cdn.v * V, k = 230 / ma;
      [[260, "acier", ma, "#9aa0ad"], [700, "fibre de carbone", mc, "#2f323a"]].forEach(function (x) {
        var h = x[2] * k;
        R.el("rect", { x: x[0] - 70, y: 320 - h, width: 140, height: h, rx: 8, fill: x[3] }, g);
        T(g, R.fmt(x[2], 0) + " g", [x[0], 300 - h], { taille: 20, gras: true });
        T(g, x[1], [x[0], 345], { taille: 17, gras: true });
      });
      R.ligne(g, [100, 320], [860, 320], { epaisseur: 2.5 });
      T(g, "masse à même volume", [480, 40], { taille: 16, couleur: C.doux });
      zone.innerHTML = V + " cm³ : acier " + R.fmt(ma, 0) + " g, fibre de carbone " + R.fmt(mc, 0) + " g, soit " + R.fmt(ma / mc, 1) + " fois plus léger.";
    }
    dessin();
  })();
})();
