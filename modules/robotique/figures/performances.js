(function () {
  "use strict";
  var R = RM, C = R.C, m = R.m;

  /* ---------- Figure 1 : précision et répétabilité ---------- */
  (function () {
    var f = R.figure("fig-precision", {
      hauteur: 420,
      titre: "Cinq essais vers le point demandé P",
      essai: "<strong>Essaie</strong> : choisis les cas A à D, puis règle toi-même le décalage et la dispersion et clique sur « Relancer ». " +
        "<strong>Observe</strong> : le décalage déplace le groupe (précision) sans l'étaler ; la dispersion l'étale (répétabilité) sans le déplacer en moyenne. Les positions sont tirées au hasard, en unités arbitraires."
    });
    var P = R.plan(300, 210, 31);
    var g = R.el("g", null, f.svg);
    var b = R.boutons(f.reglages);
    var CAS = { A: [0.3, 0.4], B: [4.5, 0.4], C: [0.3, 2.4], D: [4.5, 2.4] };
    Object.keys(CAS).forEach(function (k) { R.bouton(b, "Cas " + k, function () { cd.set(CAS[k][0]); cs.set(CAS[k][1]); tirer(); }); });
    R.bouton(b, "Relancer", function () { tirer(); });
    var cd = R.curseur(f.reglages, { nom: "Décalage", min: 0, max: 5, pas: 0.1, val: 0.3, surChange: function () { dessiner(); } });
    var cs = R.curseur(f.reglages, { nom: "Dispersion", min: 0.1, max: 3, pas: 0.1, val: 0.4, surChange: function () { dessiner(); } });
    var zone = R.h("div", null, "", f.direct);
    var bruit = [];
    function gauss() { var u = 1 - Math.random(), v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
    function tirer() { bruit = []; for (var i = 0; i < 5; i++) bruit.push([gauss(), gauss()]); dessiner(); }
    function dessiner() {
      R.vider(g);
      var o = P.p([0, 0]);
      // cible : anneaux alternés, comme un jeu de fléchettes
      [[6, "#f6f7fa"], [4, "#fff"], [2, PLATEFORME.clair()]].forEach(function (r) { R.el("circle", { cx: o[0], cy: o[1], r: r[0] * P.s, fill: r[1], stroke: "#d9dde6", "stroke-width": 1.5 }, g); });
      R.ligne(g, P.p([-9.5, 0]), P.p([9.5, 0]), { couleur: "#d9dde6" }); R.ligne(g, P.p([0, -6.6]), P.p([0, 6.6]), { couleur: "#d9dde6" });
      var dir = [0.8, 0.6], pts = bruit.map(function (n) { return [cd.v * dir[0] + cs.v * n[0], cd.v * dir[1] + cs.v * n[1]]; });
      var moy = [0, 0]; pts.forEach(function (p) { moy[0] += p[0] / pts.length; moy[1] += p[1] / pts.length; });
      var disp = Math.max.apply(null, pts.map(function (p) { return Math.hypot(p[0] - moy[0], p[1] - moy[1]); }));
      R.el("circle", { cx: P.p(moy)[0], cy: P.p(moy)[1], r: Math.max(disp * P.s, 12), fill: "rgba(229,72,77,0.08)", stroke: C.x, "stroke-width": 2, "stroke-dasharray": "6 5" }, g);
      R.el("circle", { cx: o[0], cy: o[1], r: 11, fill: C.z, stroke: "#fff", "stroke-width": 3 }, g);
      if (Math.hypot(moy[0], moy[1]) * P.s > 18) R.fleche(g, o, P.p(moy), { couleur: C.acc, epaisseur: 3 });
      pts.forEach(function (p) { var q = P.p(p); R.el("circle", { cx: q[0], cy: q[1], r: 10, fill: C.x, stroke: "#fff", "stroke-width": 2.5 }, g); });
      var mm = P.p(moy);
      R.ligne(g, [mm[0] - 11, mm[1]], [mm[0] + 11, mm[1]], { couleur: C.fonce, epaisseur: 3 }); R.ligne(g, [mm[0], mm[1] - 11], [mm[0], mm[1] + 11], { couleur: C.fonce, epaisseur: 3 });
      R.texte(g, "P demandé", [o[0] - 22, o[1] + 30], { couleur: C.z, gras: true, italique: false, taille: 17, ancre: "end" });
      // légende
      R.el("circle", { cx: 22, cy: 24, r: 8, fill: C.x }, g); R.texte(g, "pièce posée", [38, 25], { italique: false, ancre: "start", taille: 15 });
      R.ligne(g, [14, 52], [30, 52], { couleur: C.fonce, epaisseur: 3 }); R.ligne(g, [22, 44], [22, 60], { couleur: C.fonce, epaisseur: 3 }); R.texte(g, "moyenne", [38, 53], { italique: false, ancre: "start", taille: 15 });
      var ec = Math.hypot(moy[0], moy[1]);
      R.rendre(zone, "\\text{écart de la moyenne à } P \\text{ (précision) : } " + R.tn(ec, 2) + "\\qquad \\text{dispersion (répétabilité) : } " + R.tn(disp, 2));
    }
    tirer();
  })();

  /* ---------- Figure 2 : temps de cycle ---------- */
  (function () {
    var f = R.figure("fig-cycle", {
      hauteur: 300,
      titre: "Chronogramme d'un cycle de pick and place",
      essai: "<strong>Essaie</strong> : fais varier le facteur de vitesse de 1 à 2, ou modifie une durée. " +
        "<strong>Observe</strong> : seules les barres bleues (mouvements) raccourcissent ; les barres grises (temps fixes) ne bougent pas, donc la cadence ne double pas quand la vitesse double."
    });
    var g = R.el("g", null, f.svg);
    var PH = [["Approche", 0.30, true, "Appr."], ["Prise", 0.20, false, "Prise"], ["Transfert", 0.55, true, "Transf."], ["Dépose", 0.15, false, "Dép."], ["Retour", 0.45, true, "Ret."], ["Synchronisation", 0.35, false, "Synchro"]];
    var ck = R.curseur(f.reglages, { nom: "Vitesse × k", min: 0.5, max: 3, pas: 0.1, val: 1, surChange: dessiner });
    var b = R.boutons(f.reglages);
    R.bouton(b, "Exemple du cours", function () { PH.forEach(function (p, i) { p[1] = [0.30, 0.20, 0.55, 0.15, 0.45, 0.35][i]; champs[i].value = R.fmt(p[1], 2); }); ck.set(1); dessiner(); });
    R.bouton(b, "Vitesse × 2", function () { ck.set(2); dessiner(); });
    var grille = R.h("div", { "class": "saisie-matrice", style: "grid-template-columns: repeat(3, 1fr); width: 100%" }, "", f.reglages);
    var champs = PH.map(function (p, i) {
      var lab = R.h("label", { style: "font-size:15px" }, p[0] + " [s] ", grille);
      var inp = R.h("input", { type: "text", inputmode: "decimal", value: R.fmt(p[1], 2), "aria-label": p[0] }, undefined, lab);
      inp.addEventListener("input", function () { var v = parseFloat(inp.value.replace(",", ".")); p[1] = isNaN(v) ? 0 : Math.max(0, v); dessiner(); });
      return inp;
    });
    var zone = R.h("div", null, "", f.direct);
    function dessiner() {
      R.vider(g);
      var k = ck.v, x0 = 24, ech = 230; // pixels par seconde
      var durees = PH.map(function (p) { return p[2] ? p[1] / k : p[1]; });
      var tot = durees.reduce(function (a, c) { return a + c; }, 0), tot1 = PH.reduce(function (a, p) { return a + p[1]; }, 0);
      ech = Math.min(230, 540 / Math.max(tot1, tot));
      // ligne de référence k = 1
      var x = x0;
      R.texte(g, "vitesse initiale", [x0, 30], { italique: false, ancre: "start", couleur: C.doux, taille: 16 });
      PH.forEach(function (p) { var w = p[1] * ech; R.el("rect", { x: x, y: 44, width: w, height: 34, rx: 4, fill: p[2] ? "#c5d2fb" : "#e3e6ee", stroke: "#fff", "stroke-width": 2 }, g); x += w; });
      R.texte(g, R.fmt(tot1, 2) + " s", [x + 8, 62], { italique: false, ancre: "start", taille: 16, couleur: C.doux });
      x = x0;
      R.texte(g, "vitesse × " + R.fmt(k, 1), [x0, 112], { italique: false, ancre: "start", couleur: C.fonce, taille: 17, gras: true });
      PH.forEach(function (p, i) {
        var w = durees[i] * ech;
        R.el("rect", { x: x, y: 126, width: w, height: 52, rx: 5, fill: p[2] ? C.z : "#9aa0ad", stroke: "#fff", "stroke-width": 2 }, g);
        var nomBarre = w > p[0].length * 8 + 10 ? p[0] : p[3];
        if (w > nomBarre.length * 8 + 6) R.texte(g, nomBarre, [x + w / 2, 152], { italique: false, couleur: "#fff", taille: 14, halo: false });
        x += w;
      });
      R.texte(g, R.fmt(tot, 2) + " s", [x + 8, 153], { italique: false, ancre: "start", taille: 18, gras: true, couleur: C.acc });
      R.el("rect", { x: x0, y: 212, width: 18, height: 18, rx: 4, fill: C.z }, g); R.texte(g, "mouvement (dépend de la vitesse)", [x0 + 28, 222], { italique: false, ancre: "start", taille: 16 });
      R.el("rect", { x: x0, y: 246, width: 18, height: 18, rx: 4, fill: "#9aa0ad" }, g); R.texte(g, "temps fixe (prise, dépose, synchronisation)", [x0 + 28, 256], { italique: false, ancre: "start", taille: 16 });
      R.rendre(zone, "T_{cycle} = " + durees.map(function (d) { return R.tn(d, 2); }).join(" + ") + " = " + R.tn(tot, 2) + "\\text{ s}" +
        "\\\\[6pt] N = \\frac{3600}{" + R.tn(tot, 2) + "} = " + R.tn(tot > 0 ? 3600 / tot : 0, 0) + "\\text{ cycles/h} = " + R.tn(tot > 0 ? 60 / tot : 0, 1) + "\\text{ cycles/min}");
    }
    dessiner();
  })();

  /* ---------- Figure 3 : vitesse moyenne et vitesse instantanée ---------- */
  (function () {
    var f = R.figure("fig-derivee", {
      hauteur: 330,
      titre: "Position d'un axe en fonction du temps",
      essai: "<strong>Essaie</strong> : déplace l'instant \\(t\\), puis réduis l'intervalle \\(\\Delta t\\). " +
        "<strong>Observe</strong> : la pente de la sécante (vitesse moyenne sur \\(\\Delta t\\)) se rapproche de la pente de la tangente (vitesse instantanée) quand \\(\\Delta t\\) devient petit."
    });
    var g = R.el("g", null, f.svg);
    // mouvement d'axe typique : démarrage et arrêt en douceur, x(t) = 0,5 (1 - cos(π t / 2)) m sur 2 s
    var X = function (t) { return 0.5 * (1 - Math.cos(Math.PI * t / 2)); }, Vt = function (t) { return 0.5 * Math.PI / 2 * Math.sin(Math.PI * t / 2); };
    var ct = R.curseur(f.reglages, { nom: "t [s]", min: 0.1, max: 1.7, pas: 0.05, val: 0.6, surChange: dessiner });
    var cdt = R.curseur(f.reglages, { nom: "Δt [s]", min: 0.02, max: 0.8, pas: 0.02, val: 0.5, surChange: dessiner });
    var zone = R.h("div", null, "", f.direct);
    var px = function (t) { return 70 + t * 250; }, py = function (x) { return 290 - x * 250; };
    function dessiner() {
      R.vider(g);
      [0.5, 1, 1.5, 2].forEach(function (t) { R.ligne(g, [px(t), 20], [px(t), 290], { couleur: "#eef0f5" }); R.texte(g, R.fmt(t, 1), [px(t), 310], { italique: false, couleur: C.doux, taille: 15 }); });
      [0.25, 0.5, 0.75, 1].forEach(function (x) { R.ligne(g, [70, py(x)], [580, py(x)], { couleur: "#eef0f5" }); R.texte(g, R.fmt(x, 2), [62, py(x)], { italique: false, couleur: C.doux, taille: 14, ancre: "end" }); });
      R.fleche(g, [60, 290], [585, 290], { couleur: C.gris, epaisseur: 2 }); R.fleche(g, [70, 300], [70, 14], { couleur: C.gris, epaisseur: 2 });
      R.texte(g, "t [s]", [572, 272], { italique: false, couleur: C.doux, taille: 16 });
      R.texte(g, "x [m]", [100, 18], { italique: false, couleur: C.doux, taille: 16 });
      var pts = []; for (var t = 0; t <= 2.001; t += 0.02) pts.push(px(t).toFixed(1) + "," + py(X(t)).toFixed(1));
      R.el("polyline", { points: pts.join(" "), fill: "none", stroke: C.z, "stroke-width": 3 }, g);
      var t0 = ct.v, t1 = Math.min(2, t0 + cdt.v), x0 = X(t0), x1 = X(t1), vm = (x1 - x0) / (t1 - t0), vi = Vt(t0);
      var ext = 0.45;
      R.ligne(g, [px(t0 - ext), py(x0 - vi * ext)], [px(t0 + ext), py(x0 + vi * ext)], { couleur: C.acc, epaisseur: 2.5 });
      R.ligne(g, [px(t0 - 0.2), py(x0 - vm * 0.2)], [px(t1 + 0.2), py(x1 + vm * 0.2)], { couleur: C.v, epaisseur: 2, tirets: "6 4" });
      R.point(g, [px(t0), py(x0)], { couleur: C.acc, r: 6 }); R.point(g, [px(t1), py(x1)], { couleur: C.v, r: 5 });
      R.texte(g, "tangente : v(t)", [px(t0 + ext) + 10, py(x0 + vi * ext) - 8], { couleur: C.acc, italique: false, taille: 16, ancre: "start", gras: true });
      R.texte(g, "sécante : v moyenne", [px(t1 + 0.2) + 10, py(x1 + vm * 0.2) + 14], { couleur: C.v, italique: false, taille: 16, ancre: "start" });
      R.rendre(zone, "v_{moy} = \\frac{x(t + \\Delta t) - x(t)}{\\Delta t} = \\frac{" + R.tn(x1, 3) + " - " + R.tn(x0, 3) + "}{" + R.tn(t1 - t0, 2) + "} = " + R.tn(vm, 3) + "\\text{ m/s}" +
        "\\qquad v(t) = \\dot{x}(t) = " + R.tn(vi, 3) + "\\text{ m/s}");
    }
    dessiner();
  })();
})();
