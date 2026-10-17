(function () {
  "use strict";
  var R = RM, C = R.C, m = R.m;

  // Boucle d'animation qui ne tourne que si la figure est visible.
  function boucle(el, pas) {
    var visible = false, actif = true, t0 = null;
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(el);
    else visible = true;
    function f(t) { if (t0 === null) t0 = t; if (visible && actif) pas((t - t0) / 1000); requestAnimationFrame(f); }
    pas(0); // première image, même hors de l'écran
    requestAnimationFrame(f);
    return { pause: function (p) { actif = !p; } };
  }

  /* ---------- Figure 1 : cible qui bouge avec la respiration ---------- */
  (function () {
    var f = R.figure("fig-respiration", {
      hauteur: 380,
      titre: "Aiguille robotisée et cible qui bouge avec la respiration",
      essai: "<strong>Essaie</strong> : passe de « pièce industrielle » à « patient », puis coche « Suivi des mouvements physiologiques ». " +
        "<strong>Observe</strong> : sans suivi, l'aiguille vise le point planifié et l'erreur oscille avec la respiration ; avec le suivi (imagerie, recalage), l'erreur reste presque nulle. Modèle simplifié, valeurs illustratives."
    });
    var g = R.el("g", null, f.svg);
    var b = R.boutons(f.reglages);
    var mode = R.choix(b, [["patient", "Patient (respiration)"], ["piece", "Pièce industrielle (immobile)"]]);
    var suivi = R.bascule(b, "Suivi des mouvements physiologiques", false);
    var pause = R.bascule(b, "Pause", false, function () { anim.pause(pause.checked); });
    var camp = R.curseur(f.reglages, { nom: "Amplitude [mm]", min: 0, max: 20, pas: 1, val: 12 });
    var zone = R.h("div", null, "", f.direct);
    var erreurMax = 0, tPrec = 0;
    var anim = boucle(f.svg, function (t) {
      R.vider(g);
      var patient = mode.value === "patient";
      var dep = patient ? camp.v * Math.sin(2 * Math.PI * t / 4) : 0; // période de 4 s
      var mm = 3.2; // pixels par mm
      var cible = [330, 250 - dep * mm * 0.6];
      var vise = suivi.checked ? cible : [330, 250];
      // patient ou pièce
      if (patient) {
        var gonfle = dep * 1.2;
        R.el("path", { d: "M60 320 L60 " + (230 - gonfle) + " Q330 " + (150 - gonfle * 2) + " 560 " + (230 - gonfle) + " L560 320 Z", fill: "#f6d9c4", stroke: "#d9a982", "stroke-width": 2 }, g);
        R.texte(g, "patient (vue en coupe)", [120, 345], { italique: false, couleur: C.doux, taille: 14 });
      } else {
        R.el("rect", { x: 200, y: 200, width: 260, height: 120, rx: 6, fill: "#d9dde3", stroke: "#9aa2ae" }, g);
        R.texte(g, "pièce fixe", [330, 345], { italique: false, couleur: C.doux, taille: 14 });
      }
      R.ligne(g, [30, 320], [590, 320], { couleur: "#9aa2ae", epaisseur: 3 });
      // cible et point planifié
      R.el("circle", { cx: 330, cy: 250, r: 7, fill: "none", stroke: C.z, "stroke-width": 2, "stroke-dasharray": "3 3" }, g);
      R.texte(g, "point planifié", [400, 254], { italique: false, couleur: C.z, taille: 13 });
      R.el("circle", { cx: cible[0], cy: cible[1], r: 9, fill: C.x }, g);
      R.texte(g, "cible", [cible[0] - 40, cible[1]], { italique: false, couleur: C.x, taille: 13, gras: true });
      // robot et aiguille (entrée oblique)
      var dir = m.scale([-0.55, 0.835], 1), entree = m.add(vise, m.scale(dir, -150)), queue = m.add(vise, m.scale(dir, -290));
      R.el("line", { x1: queue[0], y1: queue[1], x2: entree[0] - dir[0] * 10, y2: entree[1] - dir[1] * 10, stroke: "#b8c0cb", "stroke-width": 26, "stroke-linecap": "round" }, g);
      R.ligne(g, entree, vise, { couleur: "#5c6577", epaisseur: 3 });
      R.point(g, vise, { couleur: C.fonce, r: 3 });
      R.texte(g, "robot", m.add(m.add(vise, m.scale(dir, -230)), [44, 8]), { italique: false, couleur: C.doux, taille: 14 });
      var err = Math.abs(dep * 0.6) * (suivi.checked ? 0 : 1);
      if (t - tPrec > 4 || t < tPrec) { erreurMax = 0; tPrec = t; }
      erreurMax = Math.max(erreurMax, err);
      zone.innerHTML = "Erreur entre la pointe et la cible : <strong>" + R.fmt(err, 1) + " mm</strong> (maximum sur un cycle respiratoire : " + R.fmt(erreurMax, 1) + " mm)";
    });
  })();

  /* ---------- Figure 2 : téléopération, mise à l'échelle et tremblement ---------- */
  (function () {
    var f = R.figure("fig-teleop", {
      hauteur: 330,
      titre: "Téléopération maître-esclave",
      essai: "<strong>Essaie</strong> : déplace la poignée orange (côté console), puis active le tremblement, change le rapport et active le filtrage. " +
        "<strong>Observe</strong> : l'instrument reproduit le geste réduit par le rapport ; le tremblement est réduit d'autant, puis presque supprimé par le filtre. Valeurs illustratives."
    });
    var g = R.el("g", null, f.svg), gp = R.el("g", null, f.svg);
    var cr = R.curseur(f.reglages, { nom: "Rapport", min: 0.1, max: 1, pas: 0.05, val: 0.3, dec: 2 });
    var b = R.boutons(f.reglages);
    var trem = R.bascule(b, "Tremblement de la main", false);
    var filtre = R.bascule(b, "Filtrage des tremblements", false);
    R.bouton(b, "Effacer les traces", function () { traceM = []; traceE = []; });
    var zone = R.h("div", null, "", f.direct);
    // repère en cm côté console : boîte de 8 cm × 6 cm, 30 px/cm ; côté patient : 30 px/cm aussi
    var main = [4, 3], filtrees = [4, 3], traceM = [], traceE = [];
    var boxM = [20, 50], boxE = [320, 50], ech = 32;
    function vers(box, p) { return [box[0] + p[0] * ech, box[1] + (6 - p[1]) * ech]; }
    boucle(f.svg, function (t) {
      R.vider(g); R.vider(gp);
      var tr = trem.checked ? [0.18 * Math.sin(2 * Math.PI * 9 * t), 0.15 * Math.sin(2 * Math.PI * 8 * t + 1)] : [0, 0]; // 9 Hz, environ 2 mm
      var brut = m.add(main, tr);
      var a = filtre.checked ? 0.06 : 1;
      filtrees = [filtrees[0] + a * (brut[0] - filtrees[0]), filtrees[1] + a * (brut[1] - filtrees[1])];
      var k = cr.v, centre = [4, 3];
      var instr = m.add(centre, m.scale(m.sub(filtrees, centre), k));
      traceM.push(brut); traceE.push(instr);
      if (traceM.length > 400) { traceM.shift(); traceE.shift(); }
      [[boxM, "console (main du chirurgien)"], [boxE, "patient (instrument)"]].forEach(function (bx) {
        R.el("rect", { x: bx[0][0], y: bx[0][1], width: 8 * ech, height: 6 * ech, rx: 8, fill: "#fafbfc", stroke: "#c3c8d0" }, g);
        R.texte(g, bx[1], [bx[0][0] + 4 * ech, bx[0][1] - 18], { italique: false, couleur: C.doux, taille: 14 });
      });
      for (var i = 0; i <= 8; i++) { R.ligne(g, vers(boxM, [i, 0]), vers(boxM, [i, 6]), { couleur: "#eef0f3" }); R.ligne(g, vers(boxE, [i, 0]), vers(boxE, [i, 6]), { couleur: "#eef0f3" }); }
      for (i = 0; i <= 6; i++) { R.ligne(g, vers(boxM, [0, i]), vers(boxM, [8, i]), { couleur: "#eef0f3" }); R.ligne(g, vers(boxE, [0, i]), vers(boxE, [8, i]), { couleur: "#eef0f3" }); }
      R.texte(g, "quadrillage : 1 cm", [boxE[0] + 8 * ech - 64, boxE[1] + 6 * ech + 18], { italique: false, couleur: C.doux, taille: 12 });
      R.el("polyline", { points: traceM.map(function (p) { return vers(boxM, p).join(","); }).join(" "), fill: "none", stroke: "rgba(230,81,0,0.5)", "stroke-width": 1.5 }, g);
      R.el("polyline", { points: traceE.map(function (p) { return vers(boxE, p).join(","); }).join(" "), fill: "none", stroke: "rgba(21,101,192,0.6)", "stroke-width": 1.5 }, g);
      var pi = vers(boxE, instr);
      R.el("circle", { cx: pi[0], cy: pi[1], r: 7, fill: C.z }, g);
      R.ligne(g, [pi[0], pi[1]], [pi[0] + 30, pi[1] - 30], { couleur: C.z, epaisseur: 4 });
      R.poignee(f.svg, gp, vers(boxM, brut), function (q) {
        main = [Math.max(0.3, Math.min(7.7, (q[0] - boxM[0]) / ech)), Math.max(0.3, Math.min(5.7, 6 - (q[1] - boxM[1]) / ech))];
      });
      var dm = m.norme(m.sub(main, centre)), de = m.norme(m.sub(instr, centre));
      zone.innerHTML = "Main : " + R.fmt(dm * 10, 1) + " mm du centre → instrument : " + R.fmt(de * 10, 1) + " mm (rapport " + R.fmt(k, 2) + "). Tremblement à l'instrument : " +
        (trem.checked ? (filtre.checked ? "presque supprimé par le filtre" : "réduit au rapport, environ " + R.fmt(2 * k, 1) + " mm") : "aucun") + ".";
    });
  })();
})();
