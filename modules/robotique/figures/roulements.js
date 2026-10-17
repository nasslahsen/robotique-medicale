(function () {
  "use strict";
  var R = RM, C = R.C;

  /* ---------- Figure 1 : glisser ou rouler ---------- */
  (function () {
    var f = R.figure("fig-frottement", {
      largeur: 960, hauteur: 450,
      titre: "Même poussée, deux contacts",
      essai: "<strong>Essaie</strong> : appuie sur « Pousser ». " +
        "<strong>Observe</strong> : la même impulsion envoie la caisse sur rouleaux bien plus loin que la caisse qui glisse. Allure qualitative, pas un calcul."
    });
    var g = R.el("g", null, f.svg), x1 = 0, x2 = 0, a = 0;
    var b = R.boutons(f.reglages);
    R.bouton(b, "Pousser", function () {
      x1 = 0; x2 = 0; a = 0;
      R.animer(1800, function (u) { x1 = 120 * Math.min(1, u * 3) * (1 - Math.pow(1 - Math.min(1, u * 3), 2)); x2 = 560 * (1 - Math.pow(1 - u, 2)); a = x2 / 20; dessiner(); });
    });
    R.bouton(b, "Recommencer", function () { x1 = 0; x2 = 0; a = 0; dessiner(); });
    function ligneSol(y, txt) {
      R.el("rect", { x: 30, y: y, width: 900, height: 22, fill: MECA.hachures(g, "#9aa0ad", { fond: "#fff" }), stroke: C.fonce, "stroke-width": 2 }, g);
      R.texte(g, txt, [40, y - 160], { italique: false, ancre: "start", gras: true, taille: 19 });
    }
    function dessiner() {
      R.vider(g);
      ligneSol(200, "glissement : la caisse frotte sur le sol");
      R.el("rect", { x: 60 + x1, y: 120, width: 120, height: 80, rx: 6, fill: "#9aa0ad", stroke: C.fonce, "stroke-width": 2.5 }, g);
      ligneSol(410, "roulement : la caisse roule sur des rouleaux");
      [0, 1, 2].forEach(function (i) {
        var cx = 80 + i * 40 + x2 * 0.5, cy = 392;
        R.el("circle", { cx: cx, cy: cy, r: 18, fill: "#dfe3ea", stroke: C.fonce, "stroke-width": 2 }, g);
        R.ligne(g, [cx, cy], [cx + 16 * Math.cos(a + i), cy + 16 * Math.sin(a + i)], { couleur: C.fonce, epaisseur: 2 });
      });
      R.el("rect", { x: 60 + x2, y: 294, width: 120, height: 80, rx: 6, fill: "#9aa0ad", stroke: C.fonce, "stroke-width": 2.5 }, g);
    }
    dessiner();
  })();

  /* ---------- Figure 2 : constitution (vue de face et demi-coupe) ---------- */
  (function () {
    var f = R.figure("fig-constitution", {
      largeur: 960, hauteur: 540,
      titre: "Roulement à billes : vue de face et coupe",
      essai: "<strong>Essaie</strong> : touche un numéro de 1 à 6. " +
        "<strong>Observe</strong> : la pièce s'allume sur la vue de face et sur la coupe. Les deux chemins de roulement sont les gorges creusées dans les bagues."
    });
    var g = R.el("g", null, f.svg);
    var NOMS = ["", "bague extérieure", "chemin de roulement (bague extérieure)", "bille", "cage", "chemin de roulement (bague intérieure)", "bague intérieure"];
    var choisi = 1, b = R.boutons(f.reglages), bt = [];
    for (var k = 1; k <= 6; k++) (function (k) { bt[k] = R.bouton(b, k + " " + NOMS[k].split(" (")[0], function () { choisi = k; dessiner(); }); })(k);
    var info = R.h("p", null, "", f.direct);
    function anneau(c, r1, r2, fill) {
      var d = "M" + (c[0] + r1) + " " + c[1] + " A" + r1 + " " + r1 + " 0 1 0 " + (c[0] - r1) + " " + c[1] + " A" + r1 + " " + r1 + " 0 1 0 " + (c[0] + r1) + " " + c[1] + " Z M" + (c[0] + r2) + " " + c[1] + " A" + r2 + " " + r2 + " 0 1 1 " + (c[0] - r2) + " " + c[1] + " A" + r2 + " " + r2 + " 0 1 1 " + (c[0] + r2) + " " + c[1] + " Z";
      return R.el("path", { d: d, fill: fill, "fill-rule": "evenodd", stroke: C.fonce, "stroke-width": 2.5 }, g);
    }
    function dessiner() {
      R.vider(g);
      bt.forEach(function (x, k) { if (x) x.classList.toggle("actif", k === choisi); });
      var A = PLATEFORME.teinte(0.55), c = [250, 280], N = 10;
      // vue de face
      anneau(c, 220, 176, choisi === 1 ? A : "#e3e6ee");
      anneau(c, 116, 74, choisi === 6 ? A : "#e3e6ee");
      R.el("circle", { cx: c[0], cy: c[1], r: 182, fill: "none", stroke: choisi === 2 ? C.acc : C.doux, "stroke-width": choisi === 2 ? 6 : 1.5, "stroke-dasharray": choisi === 2 ? null : "4 4" }, g);
      R.el("circle", { cx: c[0], cy: c[1], r: 110, fill: "none", stroke: choisi === 5 ? C.acc : C.doux, "stroke-width": choisi === 5 ? 6 : 1.5, "stroke-dasharray": choisi === 5 ? null : "4 4" }, g);
      R.el("circle", { cx: c[0], cy: c[1], r: 146, fill: "none", stroke: choisi === 4 ? C.acc : "#c9a227", "stroke-width": 14 }, g);
      for (var i = 0; i < N; i++) { var a = Math.PI / 2 + i * 2 * Math.PI / N; R.el("circle", { cx: c[0] + 146 * Math.cos(a), cy: c[1] - 146 * Math.sin(a), r: 30, fill: choisi === 3 ? A : "#cfd5df", stroke: C.fonce, "stroke-width": 2 }, g); }
      R.texte(g, "vue de face", [c[0], 525], { italique: false, couleur: C.doux, taille: 17 });
      // demi-coupe agrandie : axe en bas, bague intérieure, bille, bague extérieure
      var x = 720, l = 200, yb = 470, h = 330, bg = 100, rb = 72, ym = yb - h / 2;
      var H = MECA.hachures(g, "#5b6172", { fond: "#fff" });
      MECA.traitAxe(g, [560, 505], [900, 505]);
      R.el("path", { d: "M" + (x - l / 2) + " " + yb + " L" + (x + l / 2) + " " + yb + " L" + (x + l / 2) + " " + (yb - bg) + " L" + (x + rb * 0.75) + " " + (yb - bg) + " A" + (rb + 2) + " " + (rb + 2) + " 0 0 1 " + (x - rb * 0.75) + " " + (yb - bg) + " L" + (x - l / 2) + " " + (yb - bg) + " Z", fill: choisi === 6 ? A : H, stroke: C.fonce, "stroke-width": 2.5 }, g);
      R.el("path", { d: "M" + (x - l / 2) + " " + (yb - h) + " L" + (x + l / 2) + " " + (yb - h) + " L" + (x + l / 2) + " " + (yb - h + bg) + " L" + (x + rb * 0.75) + " " + (yb - h + bg) + " A" + (rb + 2) + " " + (rb + 2) + " 0 0 0 " + (x - rb * 0.75) + " " + (yb - h + bg) + " L" + (x - l / 2) + " " + (yb - h + bg) + " Z", fill: choisi === 1 ? A : H, stroke: C.fonce, "stroke-width": 2.5 }, g);
      if (choisi === 2) R.arc(g, [x, ym], rb + 4, Math.PI * 0.22, Math.PI * 0.78, { couleur: C.acc, epaisseur: 8 });
      if (choisi === 5) R.arc(g, [x, ym], rb + 4, -Math.PI * 0.78, -Math.PI * 0.22, { couleur: C.acc, epaisseur: 8 });
      R.el("rect", { x: x - 16, y: ym - rb - 14, width: 32, height: 2 * rb + 28, rx: 6, fill: choisi === 4 ? C.acc : "#c9a227", opacity: 0.85 }, g);
      R.el("circle", { cx: x, cy: ym, r: rb, fill: choisi === 3 ? A : "#cfd5df", stroke: C.fonce, "stroke-width": 2.5 }, g);
      R.texte(g, "demi-coupe", [x, 525], { italique: false, couleur: C.doux, taille: 17 });
      R.texte(g, String(choisi), [x + l / 2 + 26, choisi === 1 ? yb - h + 50 : choisi === 2 ? yb - h + 100 : choisi === 6 ? yb - 50 : choisi === 5 ? yb - 100 : ym], { italique: false, gras: true, couleur: C.acc, taille: 26 });
      info.textContent = choisi + " : " + NOMS[choisi] + ".";
    }
    dessiner();
  })();

  /* ---------- Figure 3 : contact de la bille et du rouleau ---------- */
  (function () {
    var f = R.figure("fig-contact", {
      largeur: 960, hauteur: 460,
      titre: "Zone de contact sous charge, vue de dessus",
      essai: "<strong>Essaie</strong> : augmente la charge. " +
        "<strong>Observe</strong> : la bille touche son chemin sur une petite ellipse, le rouleau sur un rectangle qui couvre toute sa longueur. Tailles exagérées, allure qualitative."
    });
    var g = R.el("g", null, f.svg);
    var cQ = R.curseur(f.reglages, { nom: "Charge", min: 0, max: 100, pas: 1, val: 50, unite: " %", surChange: dessiner });
    function dessiner() {
      R.vider(g);
      var q = cQ.v / 100, H = MECA.hachures(g, "#5b6172", { fond: "#fff" });
      R.texte(g, "bille", [240, 40], { italique: false, gras: true, taille: 22 }); R.texte(g, "rouleau", [700, 40], { italique: false, gras: true, taille: 22 });
      R.el("path", { d: "M 80 250 Q 240 300 400 250 L 400 300 L 80 300 Z", fill: H, stroke: C.fonce, "stroke-width": 2 }, g);
      R.el("circle", { cx: 240, cy: 190, r: 80, fill: "#cfd5df", stroke: C.fonce, "stroke-width": 2.5 }, g);
      R.el("rect", { x: 560, y: 250, width: 300, height: 50, fill: H, stroke: C.fonce, "stroke-width": 2 }, g);
      R.el("rect", { x: 590, y: 110, width: 240, height: 140, rx: 8, fill: "#cfd5df", stroke: C.fonce, "stroke-width": 2.5 }, g);
      R.el("ellipse", { cx: 590, cy: 180, rx: 18, ry: 70, fill: "#e3e6ee", stroke: C.fonce, "stroke-width": 2 }, g);
      if (q > 0) { R.fleche(g, [240, 60], [240, 104], { couleur: C.x, epaisseur: 3 + 5 * q }); R.fleche(g, [710, 60], [710, 104], { couleur: C.x, epaisseur: 3 + 5 * q }); }
      R.texte(g, "empreinte de contact", [480, 345], { italique: false, couleur: C.doux, taille: 17 });
      var e = 4 + 40 * Math.sqrt(q);
      R.el("ellipse", { cx: 240, cy: 400, rx: e * 1.6, ry: e * 0.7, fill: PLATEFORME.teinte(0.3), stroke: C.acc, "stroke-width": 3 }, g);
      R.el("rect", { x: 590, y: 400 - e * 0.5, width: 240, height: e, fill: PLATEFORME.teinte(0.3), stroke: C.acc, "stroke-width": 3 }, g);
      R.texte(g, "elliptique", [240, 400 + e * 0.7 + 24], { italique: false, couleur: C.acc, taille: 18 });
      R.texte(g, "rectangulaire", [710, 400 + e * 0.5 + 24], { italique: false, couleur: C.acc, taille: 18 });
    }
    dessiner();
  })();
})();
