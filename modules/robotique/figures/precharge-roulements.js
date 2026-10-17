(function () {
  "use strict";
  var R = RM, C = R.C;

  /* ---------- Figure : serrer une paire de roulements à contact oblique ---------- */
  var f = R.figure("fig-precharge", {
    largeur: 960, hauteur: 540,
    titre: "Paire de roulements à contact oblique, serrée par un écrou",
    essai: "<strong>Essaie</strong> : serre l'écrou petit à petit. " +
      "<strong>Observe</strong> : l'écart entre les bagues intérieures (le décalage) se ferme, le jeu disparaît ; au-delà, la précharge monte : la rigidité augmente, mais le frottement et l'échauffement aussi, et une précharge trop forte fait chuter la durée de vie. Courbes d'allure qualitative."
  });
  var g = R.el("g", null, f.svg);
  var DEC = 15;
  var cS = R.curseur(f.reglages, { nom: "Serrage de l'écrou", min: 0, max: 40, pas: 1, val: 0, unite: " µm", surChange: dessiner });
  var b = R.boutons(f.reglages);
  R.bouton(b, "Sans précharge", function () { cS.set(0); dessiner(); });
  R.bouton(b, "Jeu supprimé", function () { cS.set(DEC); dessiner(); });
  R.bouton(b, "Précharge trop forte", function () { cS.set(40); dessiner(); });
  var info = R.h("p", null, "", f.direct);
  // allures : x = serrage (µm)
  function jeu(s) { return Math.max(0, DEC - s) / DEC; }
  function pre(s) { return Math.max(0, s - DEC) / 25; }
  function rig(s) { return 0.3 + 0.7 * Math.min(1, (Math.min(s, DEC) / DEC) * 0.45 + pre(s) * 0.7); }
  function frot(s) { return 0.12 + 0.85 * pre(s); }
  function duree(s) { var p = pre(s); return p < 0.45 ? 0.85 : 0.85 - (p - 0.45) * 1.45; }
  function dessiner() {
    R.vider(g);
    var s = cS.v, yc = 250, r = 40, h = 96, l = 90, gap = (DEC - Math.min(s, DEC)) * 2, H = MECA.hachures(g, "#9aa0ad", { fond: "#fff" });
    [-1, 1].forEach(function (k) { R.el("rect", { x: 70, y: k < 0 ? yc - r - h - 34 : yc + r + h, width: 300, height: 34, fill: H, stroke: C.fonce, "stroke-width": 2 }, g); });
    R.el("rect", { x: 20, y: yc - r, width: 470, height: 2 * r, fill: "#e8edf5", stroke: C.fonce, "stroke-width": 2 }, g);
    MECA.traitAxe(g, [10, yc], [500, yc]);
    var xG = 170, xD = xG + l + gap;
    [[xG, -1], [xD, 1]].forEach(function (q) {
      var gg = R.el("g", { transform: q[1] < 0 ? "translate(" + 2 * q[0] + " 0) scale(-1 1)" : null }, g);
      [1, -1].forEach(function (k) { MECA.roulement(gg, q[0], yc - k * r, l, h, { type: "oblique", sens: k }); });
    });
    [1, -1].forEach(function (k) {
      R.el("rect", { x: xG - l / 2 - 16, y: k > 0 ? yc - r - 28 : yc + r, width: 16, height: 28, fill: C.fonce }, g);
      R.el("rect", { x: xD + l / 2, y: k > 0 ? yc - r - 44 : yc + r, width: 44, height: 44, fill: "#9aa0ad", stroke: C.fonce, "stroke-width": 2 }, g);
    });
    R.texte(g, "écrou", [xD + l / 2 + 52, yc - r - 22], { italique: false, ancre: "start", taille: 17 });
    if (gap > 1) {
      R.ligne(g, [xG + l / 2, yc - r - 8], [xD - l / 2, yc - r - 8], { couleur: C.x, epaisseur: 3 });
      R.texte(g, "décalage : jeu", [(xG + xD) / 2, 52], { italique: false, couleur: C.x, gras: true, taille: 17 });
    } else if (pre(s) > 0) {
      R.fleche(g, [xD + l / 2 + 120, yc + r + 22], [xD + l / 2 + 48, yc + r + 22], { couleur: C.acc, epaisseur: 4 + 6 * pre(s) });
      R.texte(g, "précharge", [xD + l / 2 + 52, yc + r + 56], { italique: false, ancre: "start", couleur: C.acc, gras: true, taille: 17 });
    }
    // courbes qualitatives en fonction du serrage
    var ox = 560, oy = 470, w = 370, hh = 360, sx = w / 40;
    R.fleche(g, [ox, oy], [ox + w + 14, oy], { couleur: C.gris, epaisseur: 2 }); R.fleche(g, [ox, oy], [ox, oy - hh - 14], { couleur: C.gris, epaisseur: 2 });
    R.texte(g, "serrage", [ox + w, oy + 22], { italique: false, ancre: "end", couleur: C.doux, taille: 15 });
    R.ligne(g, [ox + DEC * sx, oy], [ox + DEC * sx, oy - hh], { couleur: C.gris, tirets: "4 5" });
    R.texte(g, "jeu supprimé", [ox + DEC * sx, oy + 22], { italique: false, couleur: C.doux, taille: 14 });
    [[jeu, C.x], [rig, C.z], [frot, C.v], [duree, C.y]].forEach(function (c) {
      var pts = [];
      for (var x = 0; x <= 40; x += 0.5) pts.push((ox + x * sx).toFixed(1) + "," + (oy - Math.max(0, c[0](x)) * hh).toFixed(1));
      R.el("polyline", { points: pts.join(" "), fill: "none", stroke: c[1], "stroke-width": 3.5 }, g);
      R.point(g, [ox + s * sx, oy - Math.max(0, c[0](s)) * hh], { couleur: c[1], r: 7 });
    });
    // légende en ligne, sous les courbes
    [["jeu", C.x], ["rigidité", C.z], ["frottement, échauffement", C.v], ["durée de vie", C.y]].forEach(function (c, i) {
      var x = 30 + (i % 2) * 270, y = 470 + Math.floor(i / 2) * 32;
      R.el("rect", { x: x, y: y - 8, width: 22, height: 16, rx: 4, fill: c[1] }, g);
      R.texte(g, c[0], [x + 32, y], { italique: false, ancre: "start", taille: 17 });
    });
    info.textContent = s < DEC ? "Il reste du jeu : la broche peut bouger légèrement, la rotation est moins précise." : s === DEC ? "Le jeu est supprimé, sans précharge forte." : "Roulements préchargés : rigidité accrue, mais efforts internes, frottement et échauffement en hausse" + (pre(s) > 0.6 ? " ; précharge trop forte, durée de vie réduite." : ".");
  }
  dessiner();
})();
