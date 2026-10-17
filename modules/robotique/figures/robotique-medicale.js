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
        R.el("path", { d: "M40 320 L40 " + (230 - gonfle) + " Q330 " + (150 - gonfle * 2) + " 580 " + (230 - gonfle) + " L580 320 Z", fill: "#ffe6da", stroke: "#e7a98e", "stroke-width": 2.5 }, g);
        R.el("ellipse", { cx: 330, cy: 262 - dep * mm * 0.6, rx: 120, ry: 44, fill: "#f6c2b0", stroke: "#d98c74", "stroke-width": 2 }, g);
        R.texte(g, "patient (vue en coupe)", [40, 350], { italique: false, couleur: C.doux, taille: 16, ancre: "start" });
      } else {
        R.el("rect", { x: 190, y: 200, width: 280, height: 120, rx: 8, fill: "#e3e6ee", stroke: "#9aa0ad", "stroke-width": 2 }, g);
        R.texte(g, "pièce fixe", [40, 350], { italique: false, couleur: C.doux, taille: 16, ancre: "start" });
      }
      R.ligne(g, [20, 320], [600, 320], { couleur: "#9aa0ad", epaisseur: 4 });
      // cible et point planifié
      R.ligne(g, [312, 250], [348, 250], { couleur: C.z, epaisseur: 2.5, tirets: "4 3" }); R.ligne(g, [330, 232], [330, 268], { couleur: C.z, epaisseur: 2.5, tirets: "4 3" });
      R.texte(g, "point planifié", [360, 252], { italique: false, couleur: C.z, taille: 16, ancre: "start", gras: true });
      R.el("circle", { cx: cible[0], cy: cible[1], r: 12, fill: C.acc, stroke: "#fff", "stroke-width": 3 }, g);
      R.texte(g, "cible", [cible[0] - 24, cible[1]], { italique: false, couleur: C.acc, taille: 16, gras: true, ancre: "end" });
      // robot et aiguille (entrée oblique)
      var dir = m.scale([-0.55, 0.835], 1), entree = m.add(vise, m.scale(dir, -150)), queue = m.add(vise, m.scale(dir, -290));
      R.el("line", { x1: queue[0], y1: queue[1], x2: entree[0] - dir[0] * 10, y2: entree[1] - dir[1] * 10, stroke: "#9aa0ad", "stroke-width": 30, "stroke-linecap": "round" }, g);
      R.ligne(g, entree, vise, { couleur: C.fonce, epaisseur: 4 });
      R.point(g, vise, { couleur: C.fonce, r: 4 });
      R.texte(g, "robot", m.add(m.add(vise, m.scale(dir, -230)), [48, 8]), { italique: false, couleur: C.doux, taille: 16, ancre: "start" });
      var err = Math.abs(dep * 0.6) * (suivi.checked ? 0 : 1);
      if (t - tPrec > 4 || t < tPrec) { erreurMax = 0; tPrec = t; }
      erreurMax = Math.max(erreurMax, err);
      zone.innerHTML = "Erreur entre la pointe et la cible : <strong>" + R.fmt(err, 1) + " mm</strong> (maximum sur un cycle respiratoire : " + R.fmt(erreurMax, 1) + " mm)";
    });
  })();

  /* ---------- Figure 2 : téléopération, mise à l'échelle et tremblement ---------- */
  (function () {
    var f = R.figure("fig-teleop", {
      hauteur: 310,
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
    var main = [6.5, 4.5], filtrees = [6.5, 4.5], traceM = [], traceE = [];
    var boxM = [14, 54], boxE = [314, 54], ech = 34;
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
        R.el("rect", { x: bx[0][0], y: bx[0][1], width: 8 * ech, height: 6 * ech, rx: 14, fill: "#fff", stroke: "#d9dde6", "stroke-width": 2 }, g);
        R.texte(g, bx[1], [bx[0][0] + 4 * ech, bx[0][1] - 22], { italique: false, couleur: C.fonce, taille: 17, gras: true });
      });
      for (var i = 1; i < 8; i++) { R.ligne(g, vers(boxM, [i, 0]), vers(boxM, [i, 6]), { couleur: "#eef0f5" }); R.ligne(g, vers(boxE, [i, 0]), vers(boxE, [i, 6]), { couleur: "#eef0f5" }); }
      for (i = 1; i < 6; i++) { R.ligne(g, vers(boxM, [0, i]), vers(boxM, [8, i]), { couleur: "#eef0f5" }); R.ligne(g, vers(boxE, [0, i]), vers(boxE, [8, i]), { couleur: "#eef0f5" }); }
      // centre de chaque boîte : point de départ commun
      [boxM, boxE].forEach(function (bx) { var c = vers(bx, centre); R.ligne(g, [c[0] - 8, c[1]], [c[0] + 8, c[1]], { couleur: C.gris, epaisseur: 2 }); R.ligne(g, [c[0], c[1] - 8], [c[0], c[1] + 8], { couleur: C.gris, epaisseur: 2 }); });
      R.texte(g, "quadrillage : 1 cm", [boxE[0] + 8 * ech, boxE[1] + 6 * ech + 20], { italique: false, couleur: C.doux, taille: 14, ancre: "end" });
      R.el("polyline", { points: traceM.map(function (p) { return vers(boxM, p).join(","); }).join(" "), fill: "none", stroke: PLATEFORME.teinte(0.45), "stroke-width": 2.5, "stroke-linejoin": "round" }, g);
      R.el("polyline", { points: traceE.map(function (p) { return vers(boxE, p).join(","); }).join(" "), fill: "none", stroke: "rgba(59,91,219,0.55)", "stroke-width": 2.5, "stroke-linejoin": "round" }, g);
      // déplacement depuis le centre : main (orange) et instrument (bleu)
      if (m.norme(m.sub(brut, centre)) > 0.15) R.fleche(g, vers(boxM, centre), vers(boxM, brut), { couleur: C.acc, epaisseur: 3 });
      if (m.norme(m.sub(instr, centre)) > 0.15) R.fleche(g, vers(boxE, centre), vers(boxE, instr), { couleur: C.z, epaisseur: 3 });
      var pi = vers(boxE, instr);
      R.ligne(g, [pi[0], pi[1]], [pi[0] + 34, pi[1] - 34], { couleur: C.z, epaisseur: 6 });
      R.el("circle", { cx: pi[0], cy: pi[1], r: 10, fill: C.z, stroke: "#fff", "stroke-width": 3 }, g);
      R.poignee(f.svg, gp, vers(boxM, brut), function (q) {
        main = [Math.max(0.3, Math.min(7.7, (q[0] - boxM[0]) / ech)), Math.max(0.3, Math.min(5.7, 6 - (q[1] - boxM[1]) / ech))];
      });
      var dm = m.norme(m.sub(main, centre)), de = m.norme(m.sub(instr, centre));
      zone.innerHTML = "Main : " + R.fmt(dm * 10, 1) + " mm du centre → instrument : " + R.fmt(de * 10, 1) + " mm (rapport " + R.fmt(k, 2) + "). Tremblement à l'instrument : " +
        (trem.checked ? (filtre.checked ? "presque supprimé par le filtre" : "réduit au rapport, environ " + R.fmt(2 * k, 1) + " mm") : "aucun") + ".";
    });
  })();
})();
