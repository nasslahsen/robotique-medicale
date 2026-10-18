(function () {
  "use strict";
  var R = RM, C = R.C;
  function T(g, s, p, o) { o = o || {}; o.italique = false; return R.texte(g, s, p, o); }

  /* ---------- Réseau d'ions et électrons libres ---------- */
  (function () {
    var f = R.figure("fig-reseau", {
      largeur: 960, hauteur: 460, titre: "Liaison métallique : ions positifs et électrons libres",
      essai: "<strong>Essaie</strong> : applique une tension, puis fais tourner la direction de traction. <strong>Observe</strong> : seuls les électrons se déplacent (conduction) ; la liaison tient de la même façon dans toutes les directions (isotrope)."
    });
    var g = R.el("g", null, f.svg), b = R.boutons(f.reglages);
    var tension = R.bascule(b, "Appliquer une tension", false, function () { if (tension.checked) lancer(); else { dec = 0; dessin(); } });
    var cA = R.curseur(f.reglages, { nom: "Direction", min: 0, max: 360, pas: 5, val: 0, unite: "°", surChange: dessin });
    var zone = R.h("div", null, "", f.direct), dec = 0, r = BIO.hasard(3), el = [];
    for (var k = 0; k < 3; k++) for (var q = 0; q < 7; q++) el.push([150 + q * 90 + r() * 60, 175 + k * 90 + (r() - 0.5) * 20]);
    for (k = 0; k < 4; k++) for (q = 0; q < 6; q++) if (r() < 0.6) el.push([195 + q * 90 + (r() - 0.5) * 20, 130 + k * 90 + (r() - 0.5) * 16]);
    function lancer() { var t0 = null; function pas(t) { if (!tension.checked) return; if (t0 === null) t0 = t; dec = (t - t0) / 1000 * 80; dessin(); if (t - t0 < 6000) requestAnimationFrame(pas); } requestAnimationFrame(pas); }
    function dessin() {
      R.vider(g);
      R.el("rect", { x: 100, y: 84, width: 680, height: 362, rx: 24, fill: "#eef0f5", stroke: "#c6cbd8", "stroke-width": 2 }, g);
      for (var i = 0; i < 7; i++) for (var j = 0; j < 4; j++) { var c = [150 + i * 93, 130 + j * 90]; R.el("circle", { cx: c[0], cy: c[1], r: 26, fill: "#c9ced9", stroke: C.fonce, "stroke-width": 2.5 }, g); T(g, "+", [c[0], c[1] + 1], { taille: 26, gras: true, halo: false }); }
      el.forEach(function (e) { var x = 100 + ((e[0] - 100 + dec) % 660 + 660) % 660; R.el("circle", { cx: x, cy: e[1], r: 7.5, fill: C.z }, g); });
      if (tension.checked) { T(g, "−", [70, 250], { taille: 40, gras: true, couleur: C.x }); T(g, "+", [790, 250], { taille: 40, gras: true, couleur: C.y }); }
      // rose des directions
      var o = [880, 250], a = cA.v * Math.PI / 180;
      R.el("circle", { cx: o[0], cy: o[1], r: 60, fill: PLATEFORME.teinte(0.12), stroke: C.acc, "stroke-width": 3 }, g);
      R.fleche(g, o, [o[0] + 60 * Math.cos(a), o[1] - 60 * Math.sin(a)], { couleur: C.acc, epaisseur: 4 });
      T(g, "force de liaison", [o[0], o[1] + 86], { taille: 14, couleur: C.doux });
      T(g, "même valeur", [o[0], o[1] + 104], { taille: 14, couleur: C.doux });
      zone.innerHTML = (tension.checked ? "Les électrons libres (bleus) se déplacent : le métal conduit. Les ions positifs restent en place. " : "Sans tension, les électrons libres sont répartis entre les ions. ") + "Direction " + Math.round(cA.v) + "° : la liaison métallique agit pareil dans toutes les directions.";
    }
    dessin();
  })();

  /* ---------- Courbe de traction d'un métal ductile ---------- */
  (function () {
    var f = R.figure("fig-traction", {
      largeur: 960, hauteur: 480, titre: "Courbe de traction d'un métal ductile (allure du cours)",
      essai: "<strong>Essaie</strong> : augmente l'allongement, puis relâche la charge. <strong>Observe</strong> : avant A, tout revient (droite de Hooke) ; après, une déformation permanente reste. Les points A, C, D donnent Re, Rmax et Rr."
    });
    var g = R.el("g", null, f.svg), cE = R.curseur(f.reglages, { nom: "Allongement", min: 0, max: 100, pas: 1, val: 0, surChange: dessin, unite: " %" });
    var b = R.boutons(f.reglages), relache = R.bascule(b, "Relâcher la charge", false, dessin), zone = R.h("div", null, "", f.direct);
    var O = [110, 420], W = 760, H = 330;
    // ε de 0 à 1 (échelle relative) -> σ relatif
    function sig(e) { if (e <= 0.08) return e / 0.08 * 0.62; if (e <= 0.82) { var u = (e - 0.08) / 0.74; return 0.62 + 0.38 * Math.sin(u * Math.PI / 2 * 1.0); } return 1 - (e - 0.82) / 0.18 * 0.22; }
    function P(e, s) { return [O[0] + e * W, O[1] - s * H]; }
    function dessin() {
      R.vider(g);
      R.fleche(g, O, [O[0] + W + 40, O[1]], { couleur: C.fonce, epaisseur: 2.5 }); R.fleche(g, O, [O[0], O[1] - H - 40], { couleur: C.fonce, epaisseur: 2.5 });
      T(g, "σ = F / S₀ (MPa)", [O[0] + 10, O[1] - H - 50], { taille: 16, ancre: "start", gras: true });
      T(g, "ε = Δl / l₀", [O[0] + W + 30, O[1] + 30], { taille: 16, gras: true });
      var pts = []; for (var e = 0; e <= 1.0001; e += 0.01) pts.push(P(e, sig(e)));
      R.el("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: "#c6cbd8", "stroke-width": 4 }, g);
      var ec = cE.v / 100, cur = []; for (e = 0; e <= ec + 1e-9; e += 0.01) cur.push(P(e, sig(e)));
      if (cur.length > 1) R.el("polyline", { points: cur.map(function (p) { return p.join(","); }).join(" "), fill: "none", stroke: C.acc, "stroke-width": 5 }, g);
      R.el("rect", { x: O[0], y: O[1] - H - 20, width: 0.08 * W, height: H + 20, fill: "rgba(18,162,107,0.07)" }, g);
      T(g, "élastique", [O[0] + 0.04 * W, O[1] + 26], { taille: 13, couleur: C.y });
      T(g, "déformation permanente", [O[0] + 0.45 * W, O[1] + 26], { taille: 14, couleur: C.doux });
      [["A (Re)", 0.08], ["C (Rmax)", 0.82], ["D (Rr)", 1]].forEach(function (p) { var q = P(p[1], sig(p[1])); R.point(g, q, { r: 6, couleur: C.fonce }); T(g, p[0], [q[0], q[1] - 22], { taille: 15, gras: true }); });
      var casse = ec >= 1, perm = Math.max(0, ec - sig(Math.min(ec, 1)) * 0.08 / 0.62);
      if (relache.checked && ec > 0 && !casse) {
        var q0 = P(ec, sig(ec)), q1 = P(ec > 0.08 ? perm : 0, 0);
        R.ligne(g, q0, q1, { couleur: C.z, epaisseur: 3, tirets: "7 5" });
      }
      var s = sig(Math.min(ec, 1)), q = P(Math.min(ec, 1), s); R.el("circle", { cx: q[0], cy: q[1], r: 9, fill: C.acc, stroke: "#fff", "stroke-width": 3 }, g);
      zone.innerHTML = casse ? "Rupture au point D." : ec <= 0.08 ? "Domaine élastique : en relâchant, l'éprouvette revient à sa longueur (droite de Hooke)." : "Au-delà de A : en relâchant, on redescend parallèlement à la droite de Hooke et il reste une déformation permanente" + (relache.checked ? " (tirets bleus)" : "") + ".";
    }
    dessin();
  })();
})();
