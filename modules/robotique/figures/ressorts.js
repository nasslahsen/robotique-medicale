(function () {
  "use strict";
  var R = RM, C = R.C, M = MECA, GR = "#5b6172";
  function txt(g, t, p, o) { o = o || {}; R.texte(g, t, p, { italique: false, taille: o.taille || 18, couleur: o.couleur || C.doux, ancre: o.ancre || "middle", gras: o.gras }); }

  /* ---------- Figure 1 : F = kx ---------- */
  (function () {
    var f = R.figure("fig-raideur", {
      largeur: 960, hauteur: 500,
      titre: "Ressort de compression : effort et raideur",
      essai: "<strong>Essaie</strong> : comprime le ressort, puis change sa raideur. " +
        "<strong>Observe</strong> : l'effort suit une droite qui passe par zéro ; sa pente est la raideur k. Un ressort deux fois plus raide pousse deux fois plus fort pour la même compression."
    });
    var g = R.el("g", null, f.svg);
    var cx = R.curseur(f.reglages, { nom: "x [mm]", min: 0, max: 25, pas: 0.5, val: 12, surChange: dessiner });
    var ck = R.curseur(f.reglages, { nom: "k [N/mm]", min: 0.5, max: 4, pas: 0.5, val: 1, surChange: dessiner });
    R.bouton(R.boutons(f.reglages), "Exemple du cours", function () { cx.set(12); ck.set(1); dessiner(); });
    var zone = R.h("div", null, "", f.direct);
    function dessiner() {
      R.vider(g);
      var x = cx.v, k = ck.v, F = k * x, Y0 = 110, BAS = 440, S = 7.5, yP = Y0 + x * S, xs = 220;
      R.el("rect", { x: xs - 120, y: BAS, width: 240, height: 26, fill: M.hachures(g, GR, { fond: "#fff" }), stroke: C.fonce, "stroke-width": 2.5 }, g);
      M.ressort(g, [xs, BAS], [xs, yP + 14], { spires: 9, rayon: 46, ep: 4 + k * 1.2 });
      R.el("rect", { x: xs - 90, y: yP - 12, width: 180, height: 26, rx: 6, fill: "#dfe3ea", stroke: C.fonce, "stroke-width": 2.5 }, g);
      R.ligne(g, [xs - 110, Y0], [xs + 110, Y0], { couleur: C.gris, tirets: "6 5" });
      txt(g, "longueur libre", [xs - 110, Y0 - 16], { ancre: "start", taille: 15 });
      if (x > 0.2) {
        R.ligne(g, [xs + 130, Y0], [xs + 130, yP], { couleur: C.v, epaisseur: 3 }); txt(g, "x", [xs + 146, (Y0 + yP) / 2], { couleur: C.v, ancre: "start", gras: true });
        R.fleche(g, [xs, yP - 70], [xs, yP - 16], { couleur: C.acc, epaisseur: 5 }); txt(g, "F", [xs - 24, yP - 46], { couleur: C.acc, gras: true });
      }
      // graphe F(x)
      var gx = 500, gy = 440, sx = 16, sy = 2.8;
      R.fleche(g, [gx, gy], [gx + 430, gy], { couleur: C.gris, epaisseur: 2 }); R.fleche(g, [gx, gy], [gx, gy - 320], { couleur: C.gris, epaisseur: 2 });
      txt(g, "x [mm]", [gx + 400, gy - 20], { taille: 15 }); txt(g, "F [N]", [gx + 10, gy - 330], { ancre: "start", taille: 15 });
      [5, 10, 15, 20, 25].forEach(function (v) { txt(g, String(v), [gx + v * sx, gy + 20], { taille: 14 }); });
      [25, 50, 75, 100].forEach(function (v) { R.ligne(g, [gx, gy - v * sy], [gx + 410, gy - v * sy], { couleur: "#eef0f5" }); txt(g, String(v), [gx - 10, gy - v * sy], { ancre: "end", taille: 14 }); });
      var xm = Math.min(25, 105 / k);
      R.ligne(g, [gx, gy], [gx + xm * sx, gy - xm * k * sy], { couleur: C.acc, epaisseur: 4 });
      R.ligne(g, [gx + x * sx, gy], [gx + x * sx, gy - F * sy], { couleur: C.v, epaisseur: 1.5, tirets: "5 4" });
      R.el("circle", { cx: gx + x * sx, cy: gy - F * sy, r: 9, fill: C.acc, stroke: "#fff", "stroke-width": 3 }, g);
      R.rendre(zone, "F = k x = " + R.tc(k, 1) + " \\times " + R.tc(x, 1) + " = " + R.tc(F, 1) + "\\ \\text{N}");
    }
    dessiner();
  })();

  /* ---------- Figure 2 : compression, traction, applications ---------- */
  (function () {
    var f = R.figure("fig-applications", {
      largeur: 960, hauteur: 460,
      titre: "Ressorts : deux formes, deux applications du cours",
      essai: "<strong>Essaie</strong> : choisis une vue ; pour le vérin, coupe et rétablis l'air ; pour la soupape, fais tourner la came. " +
        "<strong>Observe</strong> : le ressort ramène toujours la pièce ; dans la soupape, il la garde fermée sur son siège, avec un petit jeu quand la came ne pousse pas."
    });
    var g = R.el("g", null, f.svg), vue = "formes", air = true, piston = 1, bb = {}, b = R.boutons(f.reglages);
    [["formes", "Compression et traction"], ["verin", "Vérin à ressort de rappel"], ["soupape", "Ressort de soupape"]].forEach(function (t) { bb[t[0]] = R.bouton(b, t[1], function () { vue = t[0]; dessiner(); }); });
    var bAir = R.bouton(b, "Couper l'air", function () {
      air = !air; bAir.textContent = air ? "Couper l'air" : "Envoyer l'air";
      var p0 = piston, p1 = air ? 1 : 0;
      R.animer(700, function (e) { piston = p0 + (p1 - p0) * e; dessiner(); });
    });
    var cA = R.curseur(f.reglages, { nom: "Came [°]", min: 0, max: 360, pas: 5, val: 0, surChange: dessiner });
    var info = R.h("p", null, "", f.direct);
    function dessiner() {
      R.vider(g);
      Object.keys(bb).forEach(function (k) { bb[k].classList.toggle("actif", k === vue); });
      bAir.style.display = vue === "verin" ? "" : "none";
      cA.input.parentNode.style.display = vue === "soupape" ? "" : "none";
      if (vue === "formes") {
        M.ressort(g, [140, 260], [460, 260], { spires: 7, rayon: 70, ep: 6 });
        R.ligne(g, [140, 360], [460, 360], { couleur: C.z, epaisseur: 2 }); txt(g, "L", [300, 382], { couleur: C.z, gras: true });
        R.ligne(g, [490, 190], [490, 330], { couleur: C.z, epaisseur: 2 }); txt(g, "D", [508, 260], { couleur: C.z, gras: true, ancre: "start" });
        txt(g, "P : pas entre deux spires", [300, 162], { couleur: C.z, taille: 16 });
        txt(g, "Compression : spires écartées, bases dressées", [300, 420], { couleur: C.fonce, gras: true, taille: 17 });
        M.ressort(g, [640, 260], [860, 260], { spires: 16, rayon: 46, ep: 6 });
        [[640, -1], [860, 1]].forEach(function (q) { R.el("circle", { cx: q[0] + q[1] * 30, cy: 260, r: 28, fill: "none", stroke: GR, "stroke-width": 6 }, g); });
        txt(g, "Traction : spires jointives, crochets", [750, 420], { couleur: C.fonce, gras: true, taille: 17 });
        info.textContent = "Paramètres : P le pas, d le diamètre du fil, D le diamètre de l'enroulement, L la longueur.";
      } else if (vue === "verin") {
        var yc = 230, xP = 600 - 260 * (1 - piston);
        R.el("rect", { x: 120, y: yc - 120, width: 640, height: 240, rx: 12, fill: "#f6f7fa", stroke: C.fonce, "stroke-width": 3 }, g);
        R.el("rect", { x: 132, y: yc - 108, width: xP - 132, height: 216, fill: piston > 0.5 ? "#dbe4ff" : "#f6f7fa" }, g);
        M.ressort(g, [xP + 28, yc], [748, yc], { spires: 9, rayon: 86, ep: 6, coul: "#c25b22" });
        R.el("rect", { x: xP, y: yc - 108, width: 28, height: 216, rx: 4, fill: "#9aa0ad", stroke: C.fonce, "stroke-width": 2.5 }, g);
        R.el("rect", { x: xP + 28, y: yc - 16, width: 960 - xP, height: 32, fill: "#dfe3ea", stroke: C.fonce, "stroke-width": 2.5 }, g);
        txt(g, "piston", [xP + 14, yc - 140]); txt(g, "tige", [880, yc - 36]); txt(g, "ressort comprimé", [640, yc + 150], { couleur: "#c25b22" });
        if (air) { R.fleche(g, [30, yc], [128, yc], { couleur: C.z, epaisseur: 7 }); txt(g, "pression d'air", [70, yc - 34], { couleur: C.z }); }
        info.textContent = air ? "L'air pousse le piston et comprime le ressort." : "Air coupé : le ressort restitue son énergie et ramène le piston (rappel).";
      } else {
        // came, poussoir, soupape et ressort ; jeu de soupape quand la came ne pousse pas
        var a = cA.v * Math.PI / 180, c = [480, 100], jeu = 8, pts = [], bas = 0;
        for (var t = 0; t < 2 * Math.PI; t += 0.08) { var rr = 50 + 46 * Math.pow(Math.max(0, Math.cos(t)), 3); pts.push([c[0] + rr * Math.sin(t + a), c[1] + rr * Math.cos(t + a)]); }
        pts.forEach(function (p) { bas = Math.max(bas, p[1]); });
        var yTop = Math.max(c[1] + 50 + jeu, bas), tige = yTop + 36;
        R.polygone(g, pts, { remplissage: "#ffd9c4", couleur: C.fonce, epaisseur: 2.5 });
        R.el("circle", { cx: c[0], cy: c[1], r: 7, fill: C.fonce }, g);
        R.el("rect", { x: 430, y: yTop, width: 100, height: 36, rx: 6, fill: "#dfe3ea", stroke: C.fonce, "stroke-width": 2.5 }, g);
        R.el("rect", { x: 300, y: 320, width: 140, height: 40, fill: M.hachures(g, GR, { fond: "#fff" }), stroke: C.fonce, "stroke-width": 2.5 }, g);
        R.el("rect", { x: 520, y: 320, width: 140, height: 40, fill: M.hachures(g, GR, { fond: "#fff" }), stroke: C.fonce, "stroke-width": 2.5 }, g);
        R.el("rect", { x: 300, y: 388, width: 112, height: 40, fill: M.hachures(g, GR, { fond: "#fff", angle: -45 }), stroke: C.fonce, "stroke-width": 2.5 }, g);
        R.el("rect", { x: 548, y: 388, width: 112, height: 40, fill: M.hachures(g, GR, { fond: "#fff", angle: -45 }), stroke: C.fonce, "stroke-width": 2.5 }, g);
        R.el("rect", { x: 468, y: tige, width: 24, height: 388 - tige + (yTop - c[1] - 50 - jeu), fill: "#dfe3ea", stroke: C.fonce, "stroke-width": 2.5 }, g);
        M.ressort(g, [480, 320], [480, tige + 6], { spires: 5, rayon: 50, ep: 5, coul: "#c25b22" });
        var yS = 388 + (yTop - c[1] - 50 - jeu);
        R.el("polygon", { points: "412," + (yS + 20) + " 548," + (yS + 20) + " 492," + yS + " 468," + yS, fill: "#dfe3ea", stroke: C.fonce, "stroke-width": 2.5 }, g);
        if (bas < c[1] + 50 + jeu - 0.5) { R.ligne(g, [580, bas], [580, yTop], { couleur: C.acc, epaisseur: 3 }); txt(g, "jeu de soupape", [596, (bas + yTop) / 2], { couleur: C.acc, ancre: "start", taille: 16 }); }
        txt(g, "came", [c[0] - 110, c[1]], { ancre: "end" }); txt(g, "ressort", [560, 290], { ancre: "start", couleur: "#c25b22" }); txt(g, "soupape", [680, yS + 6], { ancre: "start" }); txt(g, "siège", [290, 408], { ancre: "end" });
        info.textContent = "La came pousse la soupape vers le bas pour l'ouvrir ; le ressort la ramène et la maintient fermée sur son siège. Quand la came ne pousse pas, il reste un petit jeu entre la came et le poussoir : le jeu de soupape.";
      }
    }
    dessiner();
  })();
})();
