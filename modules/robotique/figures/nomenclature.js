(function () {
  "use strict";
  var R = RM, C = R.C, M = window.MECA;

  // Petites icônes dessinées, centrées en (x, y), environ 150 × 110
  function icone(g, nom, x, y) {
    var e = R.el, gris = "#dfe3ea", tr = C.fonce;
    function moteur() { e("rect", { x: x - 70, y: y - 40, width: 100, height: 80, rx: 12, fill: gris, stroke: tr, "stroke-width": 3 }, g); for (var k = 1; k < 5; k++) R.ligne(g, [x - 70 + k * 20, y - 40], [x - 70 + k * 20, y + 40], { couleur: "#9aa0ad", epaisseur: 2 }); e("rect", { x: x + 30, y: y - 9, width: 44, height: 18, fill: "#c6cbd8", stroke: tr, "stroke-width": 2.5 }, g); }
    function roulementFace() { [52, 38, 22, 12].forEach(function (r, i) { e("circle", { cx: x, cy: y, r: r, fill: i % 2 ? "#fff" : gris, stroke: tr, "stroke-width": 2.5 }, g); }); for (var k = 0; k < 9; k++) { var a = k * 2 * Math.PI / 9; e("circle", { cx: x + 30 * Math.cos(a), cy: y + 30 * Math.sin(a), r: 6.5, fill: "#9aa0ad", stroke: tr, "stroke-width": 1.2 }, g); } }
    function fleche(a, b, c) { R.fleche(g, a, b, { couleur: c || C.z, epaisseur: 4 }); }
    function cote(l) { R.ligne(g, [x - l / 2, y - 30], [x - l / 2, y + 30], { couleur: tr, epaisseur: 2 }); R.ligne(g, [x + l / 2, y - 30], [x + l / 2, y + 30], { couleur: tr, epaisseur: 2 }); fleche([x, y], [x - l / 2, y], tr); fleche([x, y], [x + l / 2, y], tr); }
    ({
      moteur: function () { moteur(); },
      charge: function () { roulementFace(); fleche([x, y - 100], [x, y - 56], C.v); },
      couple: function () { e("rect", { x: x - 80, y: y - 16, width: 160, height: 32, rx: 6, fill: gris, stroke: tr, "stroke-width": 3 }, g); e("path", { d: "M" + (x + 40) + " " + (y - 42) + " A 16 42 0 0 1 " + (x + 40) + " " + (y + 42), fill: "none", stroke: C.z, "stroke-width": 4 }, g); fleche([x + 44, y + 36], [x + 34, y + 44]); },
      capacite: function () { roulementFace(); },
      cote: function () { cote(150); R.texte(g, "C = A − B", [x, y + 52], { italique: false, taille: 17 }); },
      exposant: function () { roulementFace(); R.texte(g, "(C/P)", [x + 2, y + 76], { italique: true, taille: 18, exp: "p" }); },
      courroie: function () { e("circle", { cx: x - 50, cy: y, r: 28, fill: gris, stroke: tr, "stroke-width": 2.5 }, g); e("circle", { cx: x + 50, cy: y, r: 28, fill: gris, stroke: tr, "stroke-width": 2.5 }, g); R.ligne(g, [x - 50, y - 32], [x + 50, y - 32], { couleur: tr, epaisseur: 5 }); R.ligne(g, [x - 50, y + 32], [x + 50, y + 32], { couleur: tr, epaisseur: 5 }); for (var k = 0; k < 6; k++) R.ligne(g, [x - 38 + k * 15, y - 32], [x - 38 + k * 15, y - 24], { couleur: tr, epaisseur: 3 }); },
      vis: function () { e("rect", { x: x - 80, y: y - 12, width: 160, height: 24, fill: gris, stroke: tr, "stroke-width": 2.5 }, g); for (var k = 0; k < 11; k++) R.ligne(g, [x - 76 + k * 14, y - 12], [x - 69 + k * 14, y + 12], { couleur: tr, epaisseur: 1.5 }); e("rect", { x: x - 18, y: y - 30, width: 36, height: 60, rx: 6, fill: "#c6cbd8", stroke: tr, "stroke-width": 2.5 }, g); },
      engrenage: function () { M.roue(g, [x, y], { m: 6, Z: 17, rot: 0.1 }); },
      masse: function () { e("circle", { cx: x - 70, cy: y - 30, r: 10, fill: "#fff", stroke: tr, "stroke-width": 3 }, g); R.ligne(g, [x - 70, y - 30], [x + 40, y - 30], { couleur: "#c6cbd8", epaisseur: 14 }); e("rect", { x: x + 18, y: y - 6, width: 44, height: 40, rx: 6, fill: "#9aa0ad", stroke: tr, "stroke-width": 2.5 }, g); R.ligne(g, [x + 40, y - 30], [x + 40, y - 6], { couleur: tr, epaisseur: 2.5 }); fleche([x + 78, y - 6], [x + 78, y + 46], C.v); },
      arbre: function () { e("rect", { x: x - 80, y: y - 22, width: 160, height: 44, rx: 6, fill: gris, stroke: tr, "stroke-width": 3 }, g); R.ligne(g, [x + 100, y - 22], [x + 100, y + 22], { couleur: tr, epaisseur: 2 }); fleche([x + 100, y + 36], [x + 100, y + 24], tr); fleche([x + 100, y - 36], [x + 100, y - 24], tr); },
      bras: function () { e("circle", { cx: x - 70, cy: y, r: 14, fill: "#fff", stroke: tr, "stroke-width": 3 }, g); R.ligne(g, [x - 70, y], [x + 70, y], { couleur: "#c6cbd8", epaisseur: 16 }); cote(140); },
      clavette: function () { e("rect", { x: x - 70, y: y - 16, width: 140, height: 32, rx: 16, fill: "#c6cbd8", stroke: tr, "stroke-width": 3 }, g); },
      serrage: function () { M.vis(g, x, y - 50, 22, 80); e("path", { d: "M" + (x - 40) + " " + (y - 50) + " A 40 12 0 0 0 " + (x + 40) + " " + (y - 50), fill: "none", stroke: C.z, "stroke-width": 4 }, g); fleche([x + 34, y - 46], [x + 42, y - 52]); },
      tolerance: function () { cote(150); R.texte(g, "A ± T", [x, y + 52], { italique: true, taille: 18 }); },
      ressort: function () { M.ressort(g, [x - 80, y], [x + 80, y], { spires: 8, rayon: 22 }); },
      torsion: function () { e("rect", { x: x - 80, y: y - 22, width: 160, height: 44, fill: gris, stroke: tr, "stroke-width": 3 }, g); [-0.6, 0, 0.6].forEach(function (s) { R.ligne(g, [x - 80, y - 22 * s], [x + 80, y - 22 * s - 14], { couleur: C.acc, epaisseur: 2.5 }); }); },
      etages: function () { M.roue(g, [x - 50, y], { m: 4, Z: 12, repere: false, trou: 4 }); M.roue(g, [x - 50 + 4 * 30 / 2, y], { m: 4, Z: 18, rot: Math.PI / 18, repere: false, trou: 5 }); },
      codeur: function () { e("circle", { cx: x, cy: y, r: 48, fill: "#fff", stroke: tr, "stroke-width": 3 }, g); for (var k = 0; k < 24; k++) { var a = k * Math.PI / 12; R.ligne(g, [x + 36 * Math.cos(a), y + 36 * Math.sin(a)], [x + 46 * Math.cos(a), y + 46 * Math.sin(a)], { couleur: tr, epaisseur: 3 }); } },
      accel: function () { e("circle", { cx: x, cy: y, r: 40, fill: gris, stroke: tr, "stroke-width": 3 }, g); e("path", { d: "M" + (x + 52) + " " + y + " A 52 52 0 0 1 " + (x - 52) + " " + y, fill: "none", stroke: C.z, "stroke-width": 4 }, g); e("path", { d: "M" + (x + 62) + " " + y + " A 62 62 0 0 1 " + (x - 62) + " " + y, fill: "none", stroke: C.z, "stroke-width": 4 }, g); },
      pression: function () { M.roue(g, [x, y + 20], { m: 7, Z: 14, repere: false }); R.ligne(g, [x - 70, y - 50], [x + 70, y - 24], { couleur: C.acc, epaisseur: 3 }); },
      contact: function () { e("rect", { x: x - 50, y: y - 50, width: 100, height: 22, fill: gris, stroke: tr, "stroke-width": 2 }, g); e("rect", { x: x - 50, y: y + 28, width: 100, height: 22, fill: gris, stroke: tr, "stroke-width": 2 }, g); e("circle", { cx: x, cy: y, r: 26, fill: "#c6cbd8", stroke: tr, "stroke-width": 2 }, g); R.ligne(g, [x - 22, y - 40], [x + 22, y + 40], { couleur: C.acc, epaisseur: 3, tirets: "6 4" }); }
    })[nom]();
  }

  /* ---------- Figure 1 : une lettre, plusieurs sens ---------- */
  (function () {
    var f = R.figure("fig-lexique", {
      largeur: 960, hauteur: 400,
      titre: "Une lettre, plusieurs sens : l'unité tranche",
      essai: "<strong>Essaie</strong> : choisis une lettre. <strong>Observe</strong> : chaque sens a son unité ; sur une fiche technique, c'est l'unité qui dit de quelle grandeur on parle."
    });
    var SENS = {
      P: [["moteur", "puissance mécanique", "W"], ["charge", "charge dynamique équivalente", "N"]],
      C: [["couple", "couple mécanique", "N·m"], ["capacite", "capacité dynamique (roulement)", "N"], ["cote", "cote d'une chaîne de cotes", "mm"]],
      p: [["exposant", "exposant de durée (roulement)", "sans unité"], ["courroie", "pas de courroie synchrone", "mm"], ["vis", "avance par tour d'une vis", "mm/tr"]],
      m: [["engrenage", "module de la denture", "mm"], ["masse", "masse portée", "kg"]],
      d: [["arbre", "diamètre d'arbre ou de vis", "m ou mm"], ["engrenage", "diamètre primitif (engrenage)", "mm"], ["courroie", "petit diamètre primitif (poulie)", "mm"]],
      L: [["bras", "longueur du bras", "m"], ["clavette", "longueur utile de clavette", "mm"], ["courroie", "longueur primitive de courroie", "mm"]],
      T: [["serrage", "couple de serrage ou de vis-écrou", "N·m"], ["tolerance", "tolérance d'une cote (T_A…)", "mm"]],
      k: [["ressort", "raideur linéaire k", "N/m ou N/mm"], ["torsion", "rigidité torsionnelle kθ", "N·m/rad"]],
      N: [["etages", "nombre d'étages", "entier"], ["vis", "nombre de tours de la vis", "tour"], ["codeur", "incréments du codeur (Nₑ)", "incr./tour"]],
      "α": [["accel", "accélération angulaire", "rad/s²"], ["pression", "angle de pression (denture)", "°"], ["contact", "angle de contact (roulement)", "°"]]
    };
    var g = R.el("g", null, f.svg), b = R.boutons(f.reglages), btn = {}, choisie = "P";
    Object.keys(SENS).forEach(function (k) { btn[k] = R.bouton(b, k, function () { choisie = k; dessiner(); }); });
    var zone = R.h("p", null, "", f.direct);
    function dessiner() {
      R.vider(g);
      Object.keys(btn).forEach(function (k) { btn[k].classList.toggle("actif", k === choisie); });
      var l = SENS[choisie], w = 290, gap = 20, x0 = (960 - l.length * w - (l.length - 1) * gap) / 2;
      l.forEach(function (s, i) {
        var x = x0 + i * (w + gap);
        R.el("rect", { x: x, y: 24, width: w, height: 352, rx: 24, fill: "#fafbfd", stroke: C.trait, "stroke-width": 2 }, g);
        var gi = R.el("g", { transform: "translate(" + (x + w / 2) + " 140) scale(1.35) translate(" + (-(x + w / 2)) + " -140)" }, g);
        icone(gi, s[0], x + w / 2, 140);
        R.texte(g, s[1], [x + w / 2, 268], { italique: false, taille: 18, gras: true });
        R.texte(g, s[2], [x + w / 2, 318], { italique: false, taille: 26, couleur: C.acc, gras: true });
      });
      zone.textContent = "« " + choisie + " » a " + l.length + " sens dans le cours. Toujours écrire l'unité.";
    }
    dessiner();
  })();

  /* ---------- Figure 2 : les grandeurs le long d'un axe ---------- */
  (function () {
    var f = R.figure("fig-axe-symboles", {
      largeur: 960, hauteur: 360,
      titre: "Les grandeurs d'un axe, du moteur au bras",
      essai: "<strong>Essaie</strong> : touche le moteur, le réducteur, la sortie ou le bras. <strong>Observe</strong> : les indices disent où vit la grandeur : m moteur, e entrée, s sortie, k étage, g gravitaire."
    });
    var g = R.el("g", null, f.svg), choisi = "moteur", zone = R.h("div", null, "", f.direct);
    var TXT = {
      moteur: "\\text{Moteur : } n_m \\ (\\text{tr/min}),\\ \\omega_e \\ (\\text{rad/s}),\\ C_m = C_e \\ (\\text{N}\\cdot\\text{m}),\\ P = C\\omega \\ (\\text{W}),\\ N_e \\ (\\text{incr./tour})",
      reducteur: "\\text{Réducteur : } i_k,\\ \\eta_k \\text{ par étage},\\ i_{tot} = \\prod i_k,\\ \\eta_{tot} = \\prod \\eta_k,\\ \\text{jeu } \\Delta\\theta",
      sortie: "\\text{Sortie : } n_s,\\ \\omega_s,\\ C_s \\simeq \\eta\\, i\\, C_e,\\ k_\\theta = C/\\theta,\\ J_{L,m} = J_L / i^2",
      bras: "\\text{Bras : } L \\ (\\text{m}),\\ m \\ (\\text{kg}),\\ C_g = m g L,\\ \\Delta x \\simeq L\\,\\Delta\\theta"
    };
    var ZONES = { moteur: [60, 110, 190, 210], reducteur: [270, 90, 200, 250], sortie: [480, 120, 125, 200], bras: [612, 30, 330, 290] };
    function dessiner() {
      R.vider(g);
      var y = 200;
      Object.keys(ZONES).forEach(function (k) { var z = ZONES[k]; R.el("rect", { x: z[0], y: z[1], width: z[2], height: z[3], rx: 18, fill: k === choisi ? PLATEFORME.teinte(0.12) : "transparent", stroke: k === choisi ? C.acc : "none", "stroke-width": 2.5 }, g); });
      R.el("rect", { x: 80, y: y - 50, width: 130, height: 100, rx: 14, fill: "#dfe3ea", stroke: C.fonce, "stroke-width": 3 }, g);
      for (var k = 1; k < 6; k++) R.ligne(g, [80 + k * 21, y - 50], [80 + k * 21, y + 50], { couleur: "#9aa0ad", epaisseur: 2 });
      M.arbre(g, 210, 290, y, 12, { axe: false });
      R.el("rect", { x: 290, y: y - 75, width: 160, height: 150, rx: 18, fill: "#eef0f5", stroke: C.fonce, "stroke-width": 3 }, g);
      M.roue(g, [335, y - 25], { m: 3.4, Z: 12, fill: "#fff", repere: false, trou: 4 });
      M.roue(g, [335 + 3.4 * 36 / 2, y + 10], { m: 3.4, Z: 24, rot: Math.PI / 24, fill: "#fff", repere: false, trou: 6 });
      M.arbre(g, 450, 560, y, 16, { axe: false });
      R.el("circle", { cx: 580, cy: y, r: 30, fill: "#fff", stroke: C.fonce, "stroke-width": 4 }, g);
      R.ligne(g, [580, y], [860, y - 120], { couleur: "#c6cbd8", epaisseur: 26 });
      R.el("circle", { cx: 580, cy: y, r: 9, fill: C.fonce }, g);
      R.el("rect", { x: 838, y: y - 110, width: 56, height: 50, rx: 8, fill: "#9aa0ad", stroke: C.fonce, "stroke-width": 2.5 }, g);
      R.fleche(g, [866, y - 56], [866, y + 10], { couleur: C.v, epaisseur: 4 });
      R.texte(g, "m g", [890, y - 10], { couleur: C.v, taille: 20 });
      R.texte(g, "moteur", [145, y + 100], { italique: false, couleur: C.doux, taille: 17 });
      R.texte(g, "réducteur", [370, y + 118], { italique: false, couleur: C.doux, taille: 17 });
      R.texte(g, "sortie", [540, y + 100], { italique: false, couleur: C.doux, taille: 17 });
      R.texte(g, "bras", [700, y + 30], { italique: false, couleur: C.doux, taille: 17 });
      R.rendre(zone, TXT[choisi]);
    }
    f.svg.addEventListener("click", function (ev) {
      var p = R.coordSVG(f.svg, ev);
      Object.keys(ZONES).forEach(function (k) { var z = ZONES[k]; if (p[0] > z[0] && p[0] < z[0] + z[2] && p[1] > z[1] && p[1] < z[1] + z[3]) choisi = k; });
      dessiner();
    });
    f.svg.style.cursor = "pointer";
    dessiner();
  })();
})();
