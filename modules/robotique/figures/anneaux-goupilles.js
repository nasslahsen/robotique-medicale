(function () {
  "use strict";
  var R = RM, C = R.C, M = MECA, GR = "#5b6172";
  function txt(g, t, p, o) { o = o || {}; R.texte(g, t, p, { italique: false, taille: o.taille || 18, couleur: o.couleur || C.doux, ancre: o.ancre || "middle", gras: o.gras }); }
  function coupe(g, x, y, w, h, angle) { return R.el("rect", { x: x, y: y, width: w, height: h, fill: M.hachures(g, GR, { fond: "#fff", angle: angle }), stroke: C.fonce, "stroke-width": 2.5 }, g); }
  function arcPath(c, r, a0, a1) { var d = ""; for (var a = a0; a <= a1 + 0.01; a += 4) d += (d ? " L" : "M") + (c[0] + r * Math.cos(a * Math.PI / 180)).toFixed(1) + " " + (c[1] - r * Math.sin(a * Math.PI / 180)).toFixed(1); return d; }

  /* ---------- Figure 1 : trois anneaux élastiques et leur montage ---------- */
  (function () {
    var f = R.figure("fig-anneaux", {
      largeur: 960, hauteur: 460,
      titre: "Anneaux élastiques : vue de face et montage en coupe",
      essai: "<strong>Essaie</strong> : passe d'un anneau à l'autre. <strong>Observe</strong> : la gorge est sur l'arbre pour l'anneau extérieur et pour l'anneau en E, dans l'alésage pour l'anneau intérieur ; dans les trois cas, l'anneau fait obstacle au déplacement axial de la pièce (flèche violette)."
    });
    var g = R.el("g", null, f.svg), type = "ext", bb = {}, b = R.boutons(f.reglages);
    [["ext", "Extérieur (pour arbre)"], ["int", "Intérieur (pour alésage)"], ["E", "En E"]].forEach(function (t) { bb[t[0]] = R.bouton(b, t[1], function () { type = t[0]; dessiner(); }); });
    var info = R.h("p", null, "", f.direct);
    var TXT = {
      ext: "Anneau extérieur, pour arbre (NF E 22-163) : il se serre dans une gorge de l'arbre. Ses oreilles percées, côté extérieur, servent à l'ouvrir avec une pince.",
      int: "Anneau intérieur, pour alésage (NF E 22-165) : il s'écarte dans une gorge de l'alésage. Ses oreilles sont côté intérieur, pour laisser l'autre bord dans la gorge.",
      E: "Anneau en E (NF L 23-203) : ouvert sur un côté, il se pousse de côté dans la gorge de l'arbre."
    };
    function dessiner() {
      R.vider(g);
      Object.keys(bb).forEach(function (k) { bb[k].classList.toggle("actif", k === type); });
      var c = [210, 230], acc = C.acc;
      // vue de face
      if (type === "E") {
        R.el("circle", { cx: c[0], cy: c[1], r: 80, fill: "#e8edf5", stroke: C.fonce, "stroke-width": 2.5 }, g);
        R.el("circle", { cx: c[0], cy: c[1], r: 62, fill: "none", stroke: C.fonce, "stroke-width": 1.6, "stroke-dasharray": "6 5" }, g);
        R.el("path", { d: arcPath(c, 98, 45, 315), fill: "none", stroke: C.fonce, "stroke-width": 32, "stroke-linecap": "round" }, g);
        R.el("path", { d: arcPath(c, 98, 45, 315), fill: "none", stroke: acc, "stroke-width": 27, "stroke-linecap": "round" }, g);
        [90, 180, 270].forEach(function (a) { var t = a * Math.PI / 180; R.ligne(g, [c[0] + 92 * Math.cos(t), c[1] - 92 * Math.sin(t)], [c[0] + 64 * Math.cos(t), c[1] - 64 * Math.sin(t)], { couleur: acc, epaisseur: 18 }); });
        R.fleche(g, [c[0] + 190, c[1] + 140], [c[0] + 90, c[1] + 140], { couleur: C.v, epaisseur: 4 });
        txt(g, "montage par le côté", [c[0] + 150, c[1] + 170], { couleur: C.v, taille: 16 });
      } else {
        var r = type === "ext" ? 92 : 110, e = 16, s = type === "ext" ? 1 : -1;
        if (type === "ext") R.el("circle", { cx: c[0], cy: c[1], r: 84, fill: "#e8edf5", stroke: C.fonce, "stroke-width": 2, "stroke-dasharray": "6 5" }, g);
        else R.el("circle", { cx: c[0], cy: c[1], r: 120, fill: "none", stroke: C.fonce, "stroke-width": 2, "stroke-dasharray": "6 5" }, g);
        R.el("path", { d: arcPath(c, r, -62, 242), fill: "none", stroke: C.fonce, "stroke-width": e + 5 }, g);
        R.el("path", { d: arcPath(c, r, -62, 242), fill: "none", stroke: acc, "stroke-width": e }, g);
        [-62, 242].forEach(function (a) {
          var t = a * Math.PI / 180, q = [c[0] + (r + s * 14) * Math.cos(t), c[1] - (r + s * 14) * Math.sin(t)];
          R.el("circle", { cx: q[0], cy: q[1], r: 17, fill: acc, stroke: C.fonce, "stroke-width": 2.5 }, g);
          R.el("circle", { cx: q[0], cy: q[1], r: 6, fill: "#fff", stroke: C.fonce, "stroke-width": 2 }, g);
        });
        txt(g, type === "ext" ? "arbre" : "alésage", [c[0], type === "ext" ? c[1] : c[1] - 150], { taille: 16 });
      }
      txt(g, "vue de face", [c[0], 446], { couleur: C.fonce, gras: true });
      // coupe du montage
      var x0 = 470, yc = 230;
      if (type === "int") {
        coupe(g, x0, yc - 190, 440, 90, 45); coupe(g, x0, yc + 100, 440, 90, -45);
        R.el("rect", { x: x0, y: yc - 100, width: 440, height: 200, fill: "#fff" }, g);
        R.el("rect", { x: x0, y: yc - 100, width: 440, height: 200, fill: "none" }, g);
        coupe(g, x0 + 80, yc - 100, 140, 200, -45);
        txt(g, "pièce", [x0 + 150, yc], { couleur: C.fonce });
        [[yc - 108, 8], [yc + 100, 8]].forEach(function (q) { R.el("rect", { x: x0 + 226, y: q[0], width: 12, height: q[1], fill: "#fff", stroke: C.fonce, "stroke-width": 1.5 }, g); });
        R.el("rect", { x: x0 + 226, y: yc - 108, width: 12, height: 34, rx: 2, fill: acc, stroke: C.fonce, "stroke-width": 2 }, g);
        R.el("rect", { x: x0 + 226, y: yc + 74, width: 12, height: 34, rx: 2, fill: acc, stroke: C.fonce, "stroke-width": 2 }, g);
        txt(g, "logement", [x0 + 330, yc - 210], { taille: 16 });
      } else {
        M.arbre(g, x0, x0 + 440, yc, 60);
        coupe(g, x0 + 80, yc - 150, 140, 90, 45); coupe(g, x0 + 80, yc + 60, 140, 90, -45);
        txt(g, "pièce", [x0 + 150, yc - 170], { couleur: C.fonce });
        [[yc - 60, 1], [yc + 60, -1]].forEach(function (q) {
          R.el("rect", { x: x0 + 226, y: q[1] > 0 ? q[0] : q[0] - 8, width: 12, height: 8, fill: "#fff", stroke: C.fonce, "stroke-width": 1.5 }, g);
          R.el("rect", { x: x0 + 226, y: q[1] > 0 ? q[0] - 30 : q[0] - 8, width: 12, height: 38, rx: 2, fill: acc, stroke: C.fonce, "stroke-width": 2 }, g);
        });
        txt(g, "arbre", [x0 + 380, yc - 80], { taille: 16 });
      }
      var yf = type === "int" ? yc + 40 : yc - 105;
      R.fleche(g, [x0 + 96, yf], [x0 + 214, yf], { couleur: C.v, epaisseur: 6 });
      txt(g, "montage en coupe", [x0 + 220, 446], { couleur: C.fonce, gras: true });
      info.textContent = TXT[type];
    }
    dessiner();
  })();

  /* ---------- Figure 2 : goupilles ---------- */
  (function () {
    var f = R.figure("fig-goupilles", {
      largeur: 960, hauteur: 460,
      titre: "Goupilles : formes, goupille d'arrêt, goupilles de positionnement",
      essai: "<strong>Essaie</strong> : choisis une vue ; pour la goupille d'arrêt, change le diamètre D de l'arbre. " +
        "<strong>Observe</strong> : d suit D/3 ; avec des goupilles de positionnement, c'est une vis séparée qui serre."
    });
    var g = R.el("g", null, f.svg), vue = "arret", bb = {}, b = R.boutons(f.reglages);
    [["formes", "Formes"], ["arret", "Goupille d'arrêt"], ["position", "Goupilles de positionnement"]].forEach(function (t) { bb[t[0]] = R.bouton(b, t[1], function () { vue = t[0]; dessiner(); }); });
    var cD = R.curseur(f.reglages, { nom: "D [mm]", min: 12, max: 36, pas: 3, val: 24, surChange: dessiner });
    var zone = R.h("div", null, "", f.direct);
    function dessiner() {
      R.vider(g);
      Object.keys(bb).forEach(function (k) { bb[k].classList.toggle("actif", k === vue); });
      cD.input.parentNode.style.display = vue === "arret" ? "" : "none";
      var yc = 230;
      if (vue === "formes") {
        R.el("rect", { x: 100, y: 200, width: 200, height: 44, rx: 18, fill: "#dfe3ea", stroke: C.fonce, "stroke-width": 2.5 }, g);
        txt(g, "cylindrique", [200, 290], { couleur: C.fonce });
        R.el("polygon", { points: "390,200 590,208 590,236 390,244", fill: "#dfe3ea", stroke: C.fonce, "stroke-width": 2.5 }, g);
        txt(g, "conique", [490, 290], { couleur: C.fonce });
        R.el("rect", { x: 680, y: 200, width: 200, height: 44, rx: 10, fill: "#dfe3ea", stroke: C.fonce, "stroke-width": 2.5 }, g);
        R.ligne(g, [690, 222], [870, 222], { epaisseur: 3 });
        txt(g, "élastique (fendue)", [780, 290], { couleur: C.fonce });
        zone.textContent = "Une goupille est une pièce métallique, généralement cylindrique ou conique. Le cours montre aussi des goupilles élastiques, fendues sur leur longueur.";
      } else if (vue === "arret") {
        var D = cD.v, s = 6.5, rD = D * s / 2, dpx = rD * 2 / 3;
        coupe(g, 330, yc - rD - 110, 200, 110, 45); coupe(g, 330, yc + rD, 200, 110, -45);
        M.arbre(g, 190, 900, yc, rD);
        R.el("rect", { x: 430 - dpx / 2, y: yc - rD - 110, width: dpx, height: 2 * rD + 220, rx: Math.min(10, dpx / 3), fill: PLATEFORME.teinte(0.3), stroke: C.fonce, "stroke-width": 2.5 }, g);
        R.ligne(g, [150, yc - rD], [150, yc + rD], { couleur: C.z, epaisseur: 2.5 }); txt(g, "D = " + D + " mm", [138, yc], { couleur: C.z, ancre: "end", gras: true });
        txt(g, "goupille d'arrêt", [560, yc - rD - 80], { ancre: "start" });
        txt(g, "pièces immobilisées", [560, yc + rD + 80], { ancre: "start" });
        R.rendre(zone, "d \\approx \\frac{D}{3} = \\frac{" + D + "}{3} = " + R.tc(D / 3, 1) + "\\ \\text{mm} \\qquad \\text{ajustement H7/m6}");
      } else {
        coupe(g, 120, 260, 720, 110, 45); coupe(g, 240, 150, 480, 110, -45);
        [300, 660].forEach(function (x) { R.el("rect", { x: x - 11, y: 180, width: 22, height: 150, rx: 8, fill: PLATEFORME.teinte(0.3), stroke: C.fonce, "stroke-width": 2.5 }, g); });
        R.el("rect", { x: 462, y: 150, width: 36, height: 110, fill: "#fff" }, g); R.el("rect", { x: 466, y: 260, width: 28, height: 70, fill: "#fff" }, g);
        R.el("rect", { x: 466, y: 140, width: 28, height: 184, fill: "#dfe3ea", stroke: C.fonce, "stroke-width": 2.5 }, g);
        R.el("rect", { x: 450, y: 118, width: 60, height: 24, rx: 4, fill: "#dfe3ea", stroke: C.fonce, "stroke-width": 2.5 }, g);
        txt(g, "goupilles de positionnement (H7/m6)", [300, 110], { couleur: C.fonce }); txt(g, "vis de fixation", [530, 100], { ancre: "start" });
        txt(g, "pièces immobilisées", [480, 410]);
        zone.textContent = "Les goupilles, ajustées dans les deux pièces, assurent leur position relative avec précision ; la vis de fixation serre.";
      }
    }
    dessiner();
  })();
})();
