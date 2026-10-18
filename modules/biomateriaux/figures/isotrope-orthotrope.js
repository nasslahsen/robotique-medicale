(function () {
  "use strict";
  var R = RM, C = R.C, DEG = Math.PI / 180;
  // pli carbone-époxy illustratif (exemple ajouté) : EL = 140, ET = 10, GLT = 5 GPa, νLT = 0,3
  var EL = 140, ET = 10, G = 5, NU = 0.3;
  function Ephi(t) { var c = Math.cos(t * DEG), s = Math.sin(t * DEG); return 1 / (Math.pow(c, 4) / EL + (1 / G - 2 * NU / EL) * s * s * c * c + Math.pow(s, 4) / ET); }

  /* ---------- Figure 1 : rigidité d'un pli selon la direction ---------- */
  (function () {
    var f = R.figure("fig-pli", {
      largeur: 960, hauteur: 460,
      titre: "Rigidité d'un pli unidirectionnel et d'un métal selon la direction",
      essai: "<strong>Essaie</strong> : tourne la direction de la charge, puis coche « Comparer au titane ». " +
        "<strong>Observe</strong> : le pli passe de 140 GPa le long des fibres à 10 GPa en travers ; sa courbe polaire est très allongée. Le titane, isotrope, donne un cercle : 110 GPa dans toutes les directions. Pli : valeurs typiques ajoutées."
    });
    var g = R.el("g", null, f.svg);
    var c = R.curseur(f.reglages, { nom: "Direction de la charge", min: 0, max: 180, pas: 1, val: 30, unite: "°" });
    var ti = R.bascule(R.boutons(f.reglages), "Comparer au titane (isotrope)", false, dessin);
    c.surChange(dessin);
    function dessin() {
      R.vider(g);
      var t = c.v, cx = 230, cy = 230;
      // pli vu de dessus
      R.el("rect", { x: cx - 170, y: cy - 150, width: 340, height: 300, rx: 10, fill: "#f6efe0", stroke: C.fonce, "stroke-width": 2 }, g);
      for (var k = 0; k < 14; k++) R.ligne(g, [cx - 160, cy - 135 + k * 21], [cx + 160, cy - 135 + k * 21], { couleur: C.acc, epaisseur: 3.5 });
      R.texte(g, "fibres (direction L ou 1)", [cx, cy + 178], { italique: false, taille: 16, couleur: C.doux });
      var u = [Math.cos(t * DEG), -Math.sin(t * DEG)];
      R.fleche(g, [cx, cy], [cx + u[0] * 200, cy + u[1] * 200], { couleur: C.z, epaisseur: 5 });
      R.fleche(g, [cx, cy], [cx - u[0] * 200, cy - u[1] * 200], { couleur: C.z, epaisseur: 5 });
      R.texte(g, "F", [cx + u[0] * 222, cy + u[1] * 222], { couleur: C.z, gras: true, taille: 22 });
      // courbe polaire E(θ)
      var px = 700, py = 230, s = 1.55, pts = [];
      for (var a = 0; a <= 360; a += 2) { var e = Ephi(a); pts.push([px + s * e * Math.cos(a * DEG), py - s * e * Math.sin(a * DEG)]); }
      R.ligne(g, [px - 235, py], [px + 235, py], { couleur: "#d9dde6" }); R.ligne(g, [px, py - 200], [px, py + 200], { couleur: "#d9dde6" });
      R.el("polygon", { points: pts.map(function (p) { return p.join(","); }).join(" "), fill: PLATEFORME.teinte(0.15), stroke: C.acc, "stroke-width": 3.5 }, g);
      if (ti.checked) R.el("circle", { cx: px, cy: py, r: 110 * s, fill: "none", stroke: C.doux, "stroke-width": 3, "stroke-dasharray": "8 6" }, g);
      var e0 = Ephi(t), q = [px + s * e0 * Math.cos(t * DEG), py - s * e0 * Math.sin(t * DEG)];
      R.ligne(g, [px, py], q, { couleur: C.z, epaisseur: 3 });
      R.el("circle", { cx: q[0], cy: q[1], r: 8, fill: C.z, stroke: "#fff", "stroke-width": 2.5 }, g);
      R.texte(g, "E(θ) : distance au centre", [px, 30], { italique: false, taille: 16, couleur: C.doux });
      R.texte(g, "140 GPa à 0°", [px + 140 * s, py + 34], { italique: false, taille: 15, ancre: "end", couleur: C.acc });
      R.texte(g, "10 GPa à 90°", [px + 8, py - 10 * s - 22], { italique: false, taille: 15, ancre: "start", couleur: C.acc });
      if (ti.checked) R.texte(g, "titane 110 GPa", [px, py - 110 * s - 14], { italique: false, taille: 15, couleur: C.doux });
      f.direct.innerHTML = "Charge à " + Math.round(t) + "° des fibres : E = <strong>" + R.fmt(e0, 1) + " GPa</strong>" + (ti.checked ? " (titane : 110 GPa quelle que soit la direction)." : ".");
    }
    dessin();
  })();

  /* ---------- Figure 2 : un stratifié de plis orientés ---------- */
  (function () {
    var f = R.figure("fig-stratifie", {
      largeur: 960, hauteur: 380,
      titre: "Stratifié : plis à 90°, −θ, 0° et +θ",
      essai: "<strong>Essaie</strong> : touche un pli dans la liste, puis change θ. " +
        "<strong>Observe</strong> : chaque pli est la même monocouche unidirectionnelle, simplement tournée ; c'est l'empilement qui donne au stratifié sa rigidité dans plusieurs directions."
    });
    var g = R.el("g", null, f.svg);
    var b = R.boutons(f.reglages), choisi = 2, btn = [];
    var ct = R.curseur(f.reglages, { nom: "θ", min: 15, max: 75, pas: 5, val: 45, unite: "°" });
    ct.surChange(dessin);
    ["90°", "−θ", "0°", "+θ"].forEach(function (nom, i) { btn.push(R.bouton(b, "Pli " + nom, function () { choisi = i; dessin(); })); });
    function ang(i) { return [90, -ct.v, 0, ct.v][i]; }
    function dessin() {
      R.vider(g);
      btn.forEach(function (x, i) { x.classList.toggle("actif", i === choisi); });
      // empilement en perspective, décalé comme sur la diapo
      for (var i = 0; i < 4; i++) {
        var x0 = 150, y0 = 105 + i * 80, w = 460, d = 100, on = i === choisi;
        var P = function (x, y) { return [x0 + x + y * 0.9, y0 - y * 0.42]; };
        var poly = [P(0, 0), P(w, 0), P(w, d), P(0, d)];
        R.el("polygon", { points: poly.map(function (p) { return p.join(","); }).join(" "), fill: on ? "#f6efe0" : "#f3f5fa", stroke: C.fonce, "stroke-width": on ? 2.5 : 1.5, opacity: on ? 1 : 0.85 }, g);
        R.el("polygon", { points: [P(0, 0), P(w, 0), [P(w, 0)[0], P(w, 0)[1] + 16], [P(0, 0)[0], P(0, 0)[1] + 16]].map(function (p) { return p.join(","); }).join(" "), fill: on ? "#e8dcc2" : "#e3e6ee", stroke: C.fonce, "stroke-width": 1.5 }, g);
        // fibres du pli, découpées au parallélogramme (traits courts)
        var a = ang(i) * DEG, dir = [Math.cos(a), Math.sin(a)];
        for (var k = -10; k <= 10; k++) {
          var seg = [];
          for (var s = -400; s <= 400; s += 4) {
            var X = w / 2 + dir[0] * s - dir[1] * k * 20, Y = d / 2 + dir[1] * s + dir[0] * k * 20;
            if (X >= 4 && X <= w - 4 && Y >= 4 && Y <= d - 4) seg.push(P(X, Y));
          }
          if (seg.length > 1) R.ligne(g, seg[0], seg[seg.length - 1], { couleur: on ? C.acc : "#c9b8d8", epaisseur: on ? 2.5 : 1.5 });
        }
        R.texte(g, ["90°", "−θ", "0°", "+θ"][i], [P(w, d / 2)[0] + 30, P(w, d / 2)[1]], { italique: false, taille: 18, gras: true, couleur: on ? C.acc : C.doux, ancre: "start" });
      }
      f.direct.innerHTML = "Pli sélectionné : fibres à " + ang(choisi) + "° de la direction 0°.";
    }
    dessin();
  })();
})();
