(function () {
  "use strict";
  var R = RM, C = R.C;
  function T(g, s, p, o) { o = o || {}; if (o.italique === undefined) o.italique = false; return R.texte(g, s, p, o); }

  /* ---------- Figure 1 : carte du chapitre 5 ---------- */
  (function () {
    var f = R.figure("fig-chapitre", {
      largeur: 960, hauteur: 300, titre: "Ce qu'on ajoute à un polymère",
      essai: "<strong>Essaie</strong> : touche chaque famille autour du polymère. <strong>Observe</strong> : les adjuvants corrigent un défaut précis ; les plastifiants assouplissent ; charges et renforts rigidifient et augmentent la tenue en température."
    });
    var g = R.el("g", null, f.svg), choisi = -1, zone = R.h("div", null, "", f.direct);
    var F = [
      [150, 80, "adjuvants", "Stabilisants, colorants et pigments, anti-chocs, antistatiques, ignifugeants, lubrifiants, anti-retrait, agents de germination et de réticulation : chacun corrige un défaut (cette page)."],
      [810, 80, "plastifiants", "Petites molécules qui écartent les chaînes : le polymère rigide devient souple, sa Tv baisse (page « Les plastifiants »)."],
      [150, 230, "charges et renforts", "Particules ni solubles ni miscibles, classées par rapport de forme : E et HDT augmentent (page « Charges et renforts »)."],
      [810, 230, "verre, carbone, aramide", "Les grands renforts fibreux et minéraux, leurs formes et leurs propriétés (page « Verre, carbone, aramide »)."]
    ];
    function dessin() {
      R.vider(g);
      R.el("circle", { cx: 480, cy: 155, r: 78, fill: PLATEFORME.teinte(0.18), stroke: C.acc, "stroke-width": 3 }, g);
      T(g, "polymère", [480, 155], { taille: 20, gras: true, couleur: C.acc });
      F.forEach(function (x, i) {
        var sel = i === choisi;
        R.ligne(g, [x[0] < 480 ? x[0] + 115 : x[0] - 115, x[1]], [480 + (x[0] < 480 ? -78 : 78) * 0.8, 155 + (x[1] < 155 ? -40 : 40)], { couleur: "#c6cbd8", epaisseur: 2.5 });
        R.el("rect", { x: x[0] - 115, y: x[1] - 34, width: 230, height: 68, rx: 18, fill: sel ? PLATEFORME.teinte(0.16) : "#fff", stroke: sel ? C.acc : "#c6cbd8", "stroke-width": sel ? 4 : 2.5, style: "cursor:pointer" }, g)
          .addEventListener("click", function () { choisi = i; dessin(); });
        T(g, x[2], [x[0], x[1]], { taille: 17, gras: true, couleur: sel ? C.acc : C.fonce });
      });
      zone.innerHTML = choisi < 0 ? "Touche une famille." : "<strong>" + F[choisi][2] + "</strong> : " + F[choisi][3];
    }
    dessin();
  })();

  /* ---------- Figure 2 : les doses ---------- */
  (function () {
    var f = R.figure("fig-doses", {
      largeur: 960, hauteur: 420, titre: "Ordre de grandeur des doses d'adjuvants",
      essai: "<strong>Essaie</strong> : touche une barre. <strong>Observe</strong> : l'échelle est logarithmique ; du lubrifiant à l'ignifugeant, la dose est multipliée par plus de cent. Valeurs du cours (environ, moins de, quelques, au moins)."
    });
    var g = R.el("g", null, f.svg), choisi = 3, zone = R.h("div", null, "", f.direct);
    var A = [
      ["lubrifiant", 0.1, "environ 0,1 % en masse", "internes (frottement du polymère sur lui-même) ou externes (frottement polymère-métal)"],
      ["anti-oxygène", 0.9, "en général moins de 1 % (sauf noir de carbone)", "retarde l'oxydation thermique pendant la transformation, sans changer sensiblement la couleur"],
      ["anti-choc", 4, "quelques %", "copolymères ABS ou MBS, surtout dans le PVC"],
      ["ignifugeant", 12, "peut atteindre et dépasser 10 %", "rend l'amorçage et la propagation de la combustion plus difficiles"]
    ];
    var X0 = 220, X1 = 900; function xp(v) { return X0 + (Math.log10(v) + 2) / 4 * (X1 - X0); }
    function dessin() {
      R.vider(g);
      [0.01, 0.1, 1, 10, 100].forEach(function (v) { R.ligne(g, [xp(v), 40], [xp(v), 350], { couleur: "#e3e6ee", epaisseur: 2 }); T(g, String(v).replace(".", ",") + " %", [xp(v), 375], { taille: 15 }); });
      A.forEach(function (a, i) {
        var y = 80 + i * 75, sel = i === choisi;
        T(g, a[0], [X0 - 16, y], { taille: 18, gras: true, ancre: "end", couleur: sel ? C.acc : C.fonce });
        R.el("rect", { x: X0, y: y - 18, width: xp(a[1]) - X0, height: 36, rx: 8, fill: sel ? C.acc : PLATEFORME.teinte(0.45), style: "cursor:pointer" }, g)
          .addEventListener("click", function () { choisi = i; dessin(); });
      });
      T(g, "concentration en masse, échelle logarithmique", [560, 404], { taille: 15, couleur: C.doux });
      zone.innerHTML = "<strong>" + A[choisi][0] + "</strong> : " + A[choisi][2] + ". " + A[choisi][3] + ".";
    }
    dessin();
  })();

  /* ---------- Figure 3 : agents de germination ---------- */
  (function () {
    var f = R.figure("fig-germes", {
      largeur: 960, hauteur: 420, titre: "Cristallisation avec et sans agent de germination",
      essai: "<strong>Essaie</strong> : fais avancer le refroidissement, avec puis sans agent de germination. <strong>Observe</strong> : avec des germes, la cristallisation démarre plus tôt et va plus vite, et les cristaux sont plus nombreux et plus petits. Schéma illustratif."
    });
    var g = R.el("g", null, f.svg);
    var b = R.boutons(f.reglages);
    var germ = R.bascule(b, "Agent de germination", true, dessin);
    var ct = R.curseur(f.reglages, { nom: "Refroidissement", min: 0, max: 1, pas: 0.02, val: 0.5, surChange: dessin });
    var zone = R.h("div", null, "", f.direct);
    function dessin() {
      R.vider(g);
      var n = germ.checked ? 40 : 6, rmax = germ.checked ? 42 : 120, debut = germ.checked ? 0.1 : 0.35, r0 = BIO.hasard(germ.checked ? 31 : 8);
      R.el("rect", { x: 200, y: 30, width: 560, height: 340, rx: 18, fill: "#fff", stroke: C.fonce, "stroke-width": 2.5 }, g);
      var clip = R.el("clipPath", { id: "clip-germes" }, g); R.el("rect", { x: 202, y: 32, width: 556, height: 336, rx: 16 }, clip);
      var gc = R.el("g", { "clip-path": "url(#clip-germes)" }, g), couvert = 0;
      for (var k = 0; k < n; k++) {
        var cx = 210 + 540 * r0(), cy = 40 + 320 * r0(), t0 = debut + 0.25 * r0(), rr = Math.max(0, (ct.v - t0) / (1 - debut)) * rmax * (germ.checked ? 1.6 : 1.4);
        if (rr > 0) { R.el("circle", { cx: cx, cy: cy, r: rr, fill: PLATEFORME.teinte(0.2), stroke: C.acc, "stroke-width": 2 }, gc); couvert += rr; }
        if (germ.checked || rr > 0) R.point(gc, [cx, cy], { r: 3, couleur: C.fonce });
      }
      var reste = ct.v < debut ? "pas encore de cristal : il faut refroidir davantage" : (germ.checked ? "de nombreux petits cristaux" : "quelques gros cristaux");
      zone.innerHTML = (germ.checked ? "Avec" : "Sans") + " agent de germination : " + reste + ". Les agents de germination facilitent et accélèrent la cristallisation des semi-cristallins, permettent de cristalliser à plus haute température en refroidissant (cadence plus haute) et donnent des cristaux plus petits.";
    }
    dessin();
  })();
})();
