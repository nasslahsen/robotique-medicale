(function () {
  "use strict";
  var R = RM, C = R.C;
  function T(g, s, p, o) { o = o || {}; if (o.italique === undefined) o.italique = false; return R.texte(g, s, p, o); }
  function poly(g, pts, o) { return R.el("polyline", { points: pts.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" "), fill: "none", stroke: o.couleur, "stroke-width": o.ep || 5, "stroke-dasharray": o.tirets, "stroke-linejoin": "round" }, g); }

  // axes log(module)-T communs : T de −100 à 160 °C, log10 E de 2,5 à 10
  function axes(g, X0, X1, Y0, Y1) {
    var px = function (T) { return X0 + (T + 100) / 260 * (X1 - X0); }, py = function (l) { return Y0 - (l - 2.5) / 7.5 * (Y0 - Y1); };
    R.fleche(g, [X0, Y0], [X1 + 24, Y0], { couleur: C.fonce, epaisseur: 2.5 }); R.fleche(g, [X0, Y0], [X0, Y1 - 24], { couleur: C.fonce, epaisseur: 2.5 });
    T(g, "T (°C)", [X1 + 20, Y0 - 20], { taille: 16, ancre: "end" }); T(g, "log module (Pa)", [X0 + 10, Y1 - 30], { taille: 16, ancre: "start" });
    [-100, -50, 0, 50, 100, 150].forEach(function (t) { R.ligne(g, [px(t), Y0], [px(t), Y0 + 7], { epaisseur: 2 }); T(g, String(t).replace("-", "−"), [px(t), Y0 + 22], { taille: 14 }); });
    [[9, "1 GPa"], [6, "1 MPa"]].forEach(function (l) { R.ligne(g, [X0 - 7, py(l[0])], [X0, py(l[0])], { epaisseur: 2 }); T(g, l[1], [X0 - 12, py(l[0])], { taille: 14, ancre: "end" }); });
    return { px: px, py: py };
  }

  /* ---------- Figure 1 : position de Tv et classement ---------- */
  (function () {
    var f = R.figure("fig-tv", {
      largeur: 960, hauteur: 500, titre: "Courbe du module et température ambiante",
      essai: "<strong>Essaie</strong> : déplace Tv avec le curseur, de −100 à 150 °C, puis coche « état brut ». <strong>Observe</strong> : tant que Tv reste sous 20 °C, le point bleu est sur le plateau caoutchouteux (élastomère) ; au-dessus, il est sur le plateau vitreux (plastomère). Brut, le caoutchouc finit par s'écouler. Courbes illustratives."
    });
    var g = R.el("g", null, f.svg);
    var b = R.boutons(f.reglages);
    R.bouton(b, "Caoutchouc naturel (Tv ≈ −60 °C)", function () { ct.set(-60); dessin(); });
    R.bouton(b, "Polystyrène (Tv ≈ 100 °C)", function () { ct.set(100); dessin(); });
    var brut = R.bascule(b, "État brut (non vulcanisé)", false, dessin);
    var ct = R.curseur(f.reglages, { nom: "Tv [°C]", min: -100, max: 150, pas: 5, val: -60, surChange: dessin });
    var zone = R.h("div", null, "", f.direct);
    function dessin() {
      R.vider(g);
      var A = axes(g, 120, 860, 440, 60), Tv = ct.v, o = { Tg: Tv, Tl: brut.checked ? Tv + 110 : Infinity }, pts = [];
      for (var t = -100; t <= 160; t += 2) pts.push([A.px(t), A.py(BIO.logModule(t, o))]);
      R.el("rect", { x: A.px(-100), y: 60, width: A.px(20) - A.px(-100), height: 380, fill: "rgba(59,91,219,0.05)" }, g);
      poly(g, pts, { couleur: C.acc });
      R.ligne(g, [A.px(Tv), 440], [A.px(Tv), A.py(9.8)], { couleur: C.gris, epaisseur: 2, tirets: "6 5" });
      T(g, "Tv", [A.px(Tv), A.py(9.95)], { taille: 18, gras: true, couleur: C.doux });
      R.ligne(g, [A.px(20), 60], [A.px(20), 440], { couleur: C.z, epaisseur: 3, tirets: "8 6" });
      T(g, "ambiante 20 °C", [A.px(20) + 10, 80], { taille: 16, couleur: C.z, gras: true, ancre: "start" });
      var l20 = BIO.logModule(20, o);
      R.point(g, [A.px(20), A.py(l20)], { r: 10, couleur: C.z, contour: "#fff" });
      var elas = Tv < 20;
      zone.innerHTML = "Tv = " + R.fmt(Tv, 0) + " °C. À 20 °C, module ≈ " + (l20 > 7.5 ? "1 GPa : plateau vitreux" : "1 MPa : plateau caoutchouteux") + ". C'est un <strong>" + (elas ? "élastomère" : "plastomère") + "</strong>" + (elas ? " (Tv sous l'ambiante)." : " (Tv au-dessus de l'ambiante).");
    }
    dessin();
  })();

  /* ---------- Figure 2 : charge et décharge ---------- */
  (function () {
    var f = R.figure("fig-cycle", {
      largeur: 960, hauteur: 440, titre: "Charge puis décharge : élastomère et plastomère",
      essai: "<strong>Essaie</strong> : monte la charge, puis redescends-la à zéro, pour chaque matériau. <strong>Observe</strong> : l'élastomère revient à zéro (déformation seulement élastique, et très grande) ; le plastomère garde une déformation permanente εp dès qu'on a dépassé son seuil. Valeurs illustratives."
    });
    var g = R.el("g", null, f.svg);
    var b = R.boutons(f.reglages), mat = "e";
    var be = R.bouton(b, "Élastomère", function () { mat = "e"; maxi = 0; cc.set(0); dessin(); });
    var bp = R.bouton(b, "Plastomère", function () { mat = "p"; maxi = 0; cc.set(0); dessin(); });
    var maxi = 0;
    var cc = R.curseur(f.reglages, { nom: "Charge (part du maximum)", min: 0, max: 1, pas: 0.02, val: 0, surChange: dessin });
    var zone = R.h("div", null, "", f.direct);
    // élastomère : ε = 6 σ (grande déformation, réversible) ; plastomère : élastique jusqu'à 0,5 puis plastique
    function epsCharge(s) { if (mat === "e") return 3 * s + 3 * s * s; return s <= 0.5 ? 0.12 * s : 0.06 + 0.9 * (s - 0.5) * (s - 0.5) * 4; }
    function dessin() {
      be.classList.toggle("actif", mat === "e"); bp.classList.toggle("actif", mat === "p");
      R.vider(g);
      var s = cc.v; maxi = Math.max(maxi, s);
      var X0 = 120, Y0 = 380, W = 760, H = 300, kx = W / 6.2;
      R.fleche(g, [X0, Y0], [X0 + W + 20, Y0], { couleur: C.fonce, epaisseur: 2.5 }); R.fleche(g, [X0, Y0], [X0, Y0 - H - 20], { couleur: C.fonce, epaisseur: 2.5 });
      T(g, "σ", [X0 - 20, Y0 - H], { taille: 20, italique: true }); T(g, "ε", [X0 + W + 16, Y0 + 24], { taille: 20, italique: true });
      var fantome = [];
      for (var w = 0; w <= 1.0001; w += 0.02) fantome.push([X0 + epsCharge(w) * kx, Y0 - w * H]);
      poly(g, fantome, { couleur: "#e3e6ee", ep: 4 });
      var pts = [];
      for (var u = 0; u <= maxi + 1e-9; u += 0.02) pts.push([X0 + epsCharge(u) * kx, Y0 - u * H]);
      poly(g, pts, { couleur: C.z, ep: 4 });
      var eps;
      if (mat === "e" || maxi <= 0.5) { eps = epsCharge(s); if (s < maxi) { var p2 = []; for (var v = s; v <= maxi + 1e-9; v += 0.02) p2.push([X0 + epsCharge(v) * kx, Y0 - v * H]); poly(g, p2, { couleur: C.acc, ep: 4, tirets: "9 6" }); } }
      else {
        var ep = epsCharge(maxi) - 0.12 * maxi, pente = 0.12;
        eps = ep + pente * s;
        R.ligne(g, [X0 + (ep + pente * maxi) * kx, Y0 - maxi * H], [X0 + eps * kx, Y0 - s * H], { couleur: C.acc, epaisseur: 4, tirets: "9 6" });
        if (s < 0.02) T(g, "εp", [X0 + ep * kx, Y0 + 24], { taille: 18, couleur: C.acc, gras: true });
      }
      R.point(g, [X0 + eps * kx, Y0 - s * H], { r: 9, couleur: C.acc, contour: "#fff" });
      T(g, "gris : trajet de charge   bleu : charge   pointillé : décharge", [X0 + W, 40], { taille: 15, couleur: C.doux, ancre: "end" });
      var reste = mat === "p" && maxi > 0.5 ? epsCharge(maxi) - 0.12 * maxi : 0;
      zone.innerHTML = (mat === "e" ? "Élastomère" : "Plastomère") + " : déformation " + R.fmt(eps * 100 / 6 * 10, 0) + " % (échelle illustrative)." + (s < 0.02 && maxi > 0 ? (reste > 0 ? " Charge retirée : il reste une <strong>déformation plastique</strong> permanente." : " Charge retirée : retour à zéro, la déformation était <strong>élastique</strong>.") : "");
    }
    dessin();
  })();

  /* ---------- Figure 3 : élasticité caoutchoutique ---------- */
  (function () {
    var f = R.figure("fig-chauffe", {
      largeur: 960, hauteur: 420, titre: "Le phénomène de l'élasticité caoutchoutique",
      essai: "<strong>Essaie</strong> : accroche ou retire la masse, puis chauffe avec le curseur. <strong>Observe</strong> : sans masse, la bande chauffée s'allonge un peu ; sous contrainte constante, elle se contracte quand on la chauffe et soulève la masse (dessins du cours). Amplitudes exagérées pour être visibles."
    });
    var g = R.el("g", null, f.svg);
    var b = R.boutons(f.reglages);
    var masse = R.bascule(b, "Masse accrochée (contrainte constante)", true, dessin);
    var ct = R.curseur(f.reglages, { nom: "Température [°C]", min: 20, max: 80, pas: 1, val: 20, surChange: dessin });
    var zone = R.h("div", null, "", f.direct);
    function dessin() {
      R.vider(g);
      var dT = ct.v - 20, L0 = masse.checked ? 220 : 120, L = L0 + (masse.checked ? -1.1 * dT : 0.35 * dT);
      R.el("rect", { x: 300, y: 40, width: 360, height: 18, fill: "#9aa0ad" }, g);
      for (var x = 305; x < 660; x += 22) R.ligne(g, [x, 40], [x + 14, 26], { couleur: C.gris, epaisseur: 2 });
      R.el("rect", { x: 462, y: 58, width: 36, height: L, rx: 10, fill: PLATEFORME.teinte(0.75), stroke: C.fonce, "stroke-width": 2 }, g);
      if (masse.checked) { R.el("rect", { x: 430, y: 58 + L, width: 100, height: 70, rx: 8, fill: "#5b6172" }, g); T(g, "masse", [480, 93 + L], { taille: 16, couleur: "#fff", halo: false }); }
      R.ligne(g, [560, 58 + L0], [640, 58 + L0], { couleur: C.gris, epaisseur: 2, tirets: "6 5" });
      T(g, "à 20 °C", [650, 58 + L0], { taille: 15, couleur: C.doux, ancre: "start" });
      var chaud = Math.min(1, dT / 60);
      R.el("rect", { x: 140, y: 380 - 300 * chaud, width: 26, height: 300 * chaud, rx: 8, fill: "#ff8a5c" }, g);
      R.el("rect", { x: 140, y: 80, width: 26, height: 300, rx: 13, fill: "none", stroke: C.fonce, "stroke-width": 2 }, g);
      T(g, ct.v + " °C", [153, 400], { taille: 16, gras: true });
      var d = L - L0;
      zone.innerHTML = masse.checked ? "Sous contrainte constante, longueur " + (d < -0.5 ? "<strong>réduite</strong> de " + R.fmt(-d / 22, 1) + " cm : la bande se contracte en chauffant." : "inchangée (chauffe pour voir l'effet).") :
        "Sans masse, la bande " + (d > 0.5 ? "<strong>s'allonge</strong> de " + R.fmt(d / 22, 1) + " cm en chauffant." : "garde sa longueur (chauffe pour voir l'effet).");
    }
    dessin();
  })();
})();
