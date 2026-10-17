(function () {
  "use strict";
  var R = RM, C = R.C;

  /* ---------- Figure 1 : mouvements autorisés et bloqués ---------- */
  (function () {
    var f = R.figure("fig-ddl", {
      largeur: 960, hauteur: 540,
      titre: "Six mouvements possibles, un seul autorisé",
      essai: "<strong>Essaie</strong> : choisis le guidage, puis touche un des six mouvements dans la liste. " +
        "<strong>Observe</strong> : seul le mouvement utile se fait ; les cinq autres sont bloqués par le guidage."
    });
    var g = R.el("g", null, f.svg);
    var b = R.boutons(f.reglages), type = "translation", essai = null, t = 0;
    var bT = R.bouton(b, "Guidage en translation (rail)", function () { type = "translation"; essai = null; maj(); });
    var bR = R.bouton(b, "Guidage en rotation (palier)", function () { type = "rotation"; essai = null; maj(); });
    var DDL = [["Tx", "translation selon x"], ["Ty", "translation selon y"], ["Tz", "translation selon z"], ["Rx", "rotation autour de x"], ["Ry", "rotation autour de y"], ["Rz", "rotation autour de z"]];
    function libre(k) { return type === "translation" ? k === "Tx" : k === "Rx"; }
    function maj() { bT.classList.toggle("actif", type === "translation"); bR.classList.toggle("actif", type === "rotation"); dessiner(); }
    function dessiner() {
      R.vider(g);
      var O = [300, 300], dx = 0, ang = 0, tremble = 0;
      if (essai) { if (libre(essai)) { if (essai[0] === "T") dx = 60 * Math.sin(t * Math.PI); else ang = t * 360; } else tremble = 4 * Math.sin(t * 40) * (1 - t); }
      // repère (x à droite, y en haut, z vers l'avant)
      R.fleche(g, [70, 470], [150, 470], { couleur: C.x, epaisseur: 3 }); R.texte(g, "x", [162, 470], { couleur: C.x });
      R.fleche(g, [70, 470], [70, 390], { couleur: C.y, epaisseur: 3 }); R.texte(g, "y", [70, 376], { couleur: C.y });
      R.fleche(g, [70, 470], [30, 510], { couleur: C.z, epaisseur: 3 }); R.texte(g, "z", [20, 522], { couleur: C.z });
      if (type === "translation") {
        R.el("rect", { x: 60, y: 330, width: 480, height: 40, fill: MECA.hachures(g, "#5b6172", { fond: "#fff" }), stroke: C.fonce, "stroke-width": 2 }, g);
        R.el("rect", { x: O[0] - 90 + dx + tremble, y: 240 + tremble, width: 180, height: 90, rx: 10, fill: PLATEFORME.teinte(0.25), stroke: C.fonce, "stroke-width": 2.5 }, g);
        R.texte(g, "chariot", [O[0] + dx, 285], { italique: false, taille: 20 });
        R.texte(g, "rail", [530, 395], { italique: false, ancre: "end", couleur: C.doux, taille: 17 });
      } else {
        R.el("rect", { x: O[0] - 70 + tremble, y: 200 + tremble, width: 140, height: 200, rx: 12, fill: MECA.hachures(g, "#5b6172", { fond: "#fff" }), stroke: C.fonce, "stroke-width": 2.5 }, g);
        R.el("rect", { x: 60, y: 270 + tremble, width: 480, height: 60, rx: 6, fill: PLATEFORME.teinte(0.25), stroke: C.fonce, "stroke-width": 2.5 }, g);
        // repère de rotation sur l'arbre (une bande qui tourne)
        var yb = 300 - 26 * Math.cos(ang * Math.PI / 180);
        if (Math.cos(ang * Math.PI / 180) > -0.2) R.ligne(g, [460, yb], [530, yb], { couleur: C.fonce, epaisseur: 5 });
        MECA.traitAxe(g, [40, 300], [560, 300]);
        R.texte(g, "palier", [O[0], 425], { italique: false, couleur: C.doux, taille: 17 });
        R.texte(g, "arbre", [100, 255], { italique: false, couleur: C.doux, taille: 17, ancre: "start" });
      }
      // liste des six mouvements
      DDL.forEach(function (d, i) {
        var y = 70 + i * 72, ok = libre(d[0]), x = 620;
        var gr = R.el("g", { style: "cursor:pointer" }, g);
        R.el("rect", { x: x, y: y, width: 310, height: 58, rx: 14, fill: essai === d[0] ? (ok ? "#e3f7ee" : "#fdecec") : "#fff", stroke: essai === d[0] ? (ok ? C.y : C.x) : "#d9dde6", "stroke-width": 2 }, gr);
        R.texte(g, d[1], [x + 18, y + 29], { italique: false, ancre: "start", taille: 18 });
        if (essai === d[0]) R.texte(g, ok ? "libre" : "bloqué", [x + 296, y + 29], { italique: false, ancre: "end", taille: 18, gras: true, couleur: ok ? C.y : C.x });
        gr.addEventListener("click", function () { essai = d[0]; R.animer(1100, function (u) { t = u; dessiner(); }); });
      });
    }
    maj();
  })();

  /* ---------- Figure 2 : raideur k = F / δ ---------- */
  (function () {
    var f = R.figure("fig-raideur", {
      largeur: 960, hauteur: 540,
      titre: "Un chariot chargé s'enfonce de δ",
      essai: "<strong>Essaie</strong> : augmente la charge, puis change la raideur. " +
        "<strong>Observe</strong> : δ grandit avec F, en ligne droite ; une raideur plus grande donne une droite plus pentue et un chariot qui s'enfonce moins. La déformation est très agrandie sur le dessin."
    });
    var g = R.el("g", null, f.svg);
    var cF = R.curseur(f.reglages, { nom: "Charge F", min: 0, max: 400, pas: 10, val: 200, unite: " N", surChange: dessiner });
    var cK = R.curseur(f.reglages, { nom: "Raideur k", min: 1000, max: 20000, pas: 500, val: 4000, unite: " N/mm", dec: 0, surChange: dessiner });
    var zone = R.h("div", null, "", f.direct);
    function dessiner() {
      R.vider(g);
      var F = cF.v, k = cK.v, d = F / k, dy = d * 500;
      // chariot sur rail
      R.el("rect", { x: 40, y: 380, width: 400, height: 50, fill: MECA.hachures(g, "#5b6172", { fond: "#fff" }), stroke: C.fonce, "stroke-width": 2 }, g);
      for (var i = 0; i < 7; i++) R.el("circle", { cx: 110 + i * 43, cy: 370 + dy * 0.5, r: 10, fill: "#dfe3ea", stroke: C.fonce, "stroke-width": 1.6 }, g);
      R.ligne(g, [70, 250], [410, 250], { couleur: C.gris, epaisseur: 2, tirets: "6 5" });
      R.el("rect", { x: 90, y: 250 + dy, width: 300, height: 110, rx: 12, fill: PLATEFORME.teinte(0.25), stroke: C.fonce, "stroke-width": 2.5 }, g);
      if (F > 0) { R.fleche(g, [240, 230 - 40 - F * 0.3], [240, 244 + dy], { couleur: C.x, epaisseur: 6, tete: 22 }); R.texte(g, "F", [262, 200 - F * 0.15], { couleur: C.x, taille: 26 }); }
      if (dy > 3) { R.ligne(g, [404, 250], [404, 250 + dy], { couleur: C.v, epaisseur: 4 }); R.texte(g, "δ", [422, 250 + dy / 2], { couleur: C.v, taille: 26 }); }
      // graphe F(δ)
      var ox = 520, oy = 470, sx = 3800, sy = 0.9;
      R.fleche(g, [ox, oy], [930, oy], { couleur: C.gris, epaisseur: 2 }); R.fleche(g, [ox, oy], [ox, 60], { couleur: C.gris, epaisseur: 2 });
      R.texte(g, "δ (mm)", [925, oy - 20], { italique: false, ancre: "end", couleur: C.doux, taille: 16 });
      R.texte(g, "F (N)", [ox + 12, 66], { italique: false, ancre: "start", couleur: C.doux, taille: 16 });
      [0.02, 0.04, 0.06, 0.08, 0.1].forEach(function (x) { R.ligne(g, [ox + x * sx, oy], [ox + x * sx, oy + 8], { couleur: C.gris }); R.texte(g, R.fmt(x, 2), [ox + x * sx, oy + 26], { italique: false, couleur: C.doux, taille: 14 }); });
      [100, 200, 300, 400].forEach(function (y) { R.ligne(g, [ox - 8, oy - y * sy], [ox, oy - y * sy], { couleur: C.gris }); R.texte(g, String(y), [ox - 12, oy - y * sy], { italique: false, couleur: C.doux, taille: 14, ancre: "end" }); });
      var dm = Math.min(0.105, 420 / k);
      R.ligne(g, [ox, oy], [ox + dm * sx, oy - dm * k * sy], { couleur: C.acc, epaisseur: 4 });
      R.point(g, [ox + d * sx, oy - F * sy], { couleur: C.acc, r: 9 });
      R.rendre(zone, "\\delta = \\frac{F}{k} = \\frac{" + R.tc(F, 0) + "}{" + R.tc(k, 0) + "} = " + R.tn(d, 3) + "\\ \\text{mm}");
    }
    dessiner();
  })();
})();
