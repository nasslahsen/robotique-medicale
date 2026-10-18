(function () {
  "use strict";
  var R = RM, C = R.C;
  var T = function (a) { return PLATEFORME.teinte(a); };
  function txt(g, s, p, o) { o = o || {}; o.italique = false; return R.texte(g, s, p, o); }

  /* ---------- Figure 0 : la carte du chapitre, huit procédés ---------- */
  (function () {
    var f = R.figure("fig-carte", {
      largeur: 960, hauteur: 400, titre: "Les huit procédés du cours",
      essai: "<strong>Essaie</strong> : touche un procédé. <strong>Observe</strong> : son principe en une phrase et la page où il est expliqué. Les procédés d'une même famille partagent la même couleur de bord."
    });
    var g = R.el("g", null, f.svg), choisi = 0;
    var P = [
      ["Extrusion", "extrusion", "Une vis pousse la matière fondue à travers une filière, en continu.", "L'extrusion et ses variantes"],
      ["Injection", "injection", "La matière ramollie est injectée dans un moule fermé, puis refroidie.", "Le moulage par injection"],
      ["Injection-soufflage", "injection", "Une préforme injectée est chauffée puis gonflée à l'air comprimé dans un moule.", "Injection-soufflage et extrusion-soufflage"],
      ["Thermoformage", "autre", "Une feuille chauffée est plaquée sur un moule en retirant l'air.", "Rotomoulage et thermoformage"],
      ["Compression", "autre", "La matière est pressée dans un moule chaud ; l'excès part en bavure.", "Compression et compression-transfert"],
      ["Compression-transfert", "autre", "La matière ramollie attend dans un pot, puis un poinçon la transfère dans le moule.", "Compression et compression-transfert"],
      ["Rotomoulage", "autre", "Une poudre dans un moule chauffé qui tourne donne une pièce creuse sans soudure.", "Rotomoulage et thermoformage"],
      ["Centrifugation", "autre", "Listé dans le cours sans être décrit.", "Compression et compression-transfert (remarque)"]
    ];
    var coul = { extrusion: C.acc, injection: "#3b5bdb", autre: "#9aa0ad" };
    function dessiner() {
      R.vider(g);
      P.forEach(function (p, k) {
        var x = 30 + (k % 4) * 232, y = 40 + Math.floor(k / 4) * 170, on = k === choisi;
        var gb = R.el("g", { style: "cursor:pointer" }, g);
        R.el("rect", { x: x, y: y, width: 208, height: 140, rx: 20, fill: on ? T(0.14) : "#fff", stroke: coul[p[1]], "stroke-width": on ? 5 : 3 }, gb);
        txt(gb, String(k + 1), [x + 30, y + 34], { taille: 24, gras: true, couleur: coul[p[1]] === "#9aa0ad" ? C.doux : coul[p[1]] });
        txt(gb, p[0], [x + 104, y + 82], { taille: p[0].length > 18 ? 16 : p[0].length > 14 ? 18 : 21, gras: true });
        gb.addEventListener("click", function () { choisi = k; dessiner(); });
      });
      f.direct.innerHTML = "<strong>" + P[choisi][0] + "</strong> : " + P[choisi][2] + " Page : « " + P[choisi][3] + " ».";
    }
    dessiner();
  })();

  /* ---------- Figure 1 : l'extrudeuse pas à pas, et le choix de la filière ---------- */
  (function () {
    var f = R.figure("fig-extrudeuse", {
      largeur: 960, hauteur: 420, titre: "Extrudeuse : trémie, vis sans fin, fourreau chauffant, filière",
      essai: "<strong>Essaie</strong> : avance étape par étape, puis change de filière. <strong>Observe</strong> : les granulés deviennent une matière fluide et homogène le long de la vis ; la section de l'extrudat est toujours celle de la filière."
    });
    var g = R.el("g", null, f.svg), k = 0, fil = "anneau";
    var b = R.boutons(f.reglages);
    var noms = { disque: "Disque plein", anneau: "Anneau", L: "En L", fente: "Fente" }, boutons = {};
    Object.keys(noms).forEach(function (id) { boutons[id] = R.bouton(b, noms[id], function () { fil = id; dessiner(); }); });
    var Y = 220;
    var et = R.etapes(f.reglages, 4, ["granulés dans la trémie", "la vis entraîne la matière", "la matière fond dans le fourreau chauffant", "la vis la pousse vers la filière", "l'extrudat sort, de section constante"], function (n) { k = n; dessiner(); });
    function section(id, c, coul, fond) {
      if (id === "disque") R.el("circle", { cx: c[0], cy: c[1], r: 22, fill: coul }, g);
      else if (id === "anneau") { R.el("circle", { cx: c[0], cy: c[1], r: 24, fill: coul }, g); R.el("circle", { cx: c[0], cy: c[1], r: 12, fill: fond }, g); }
      else if (id === "L") R.el("path", { d: "M" + (c[0] - 20) + " " + (c[1] - 24) + " h13 v34 h27 v13 h-40 Z", fill: coul }, g);
      else R.el("rect", { x: c[0] - 28, y: c[1] - 7, width: 56, height: 14, rx: 3, fill: coul }, g);
    }
    function dessiner() {
      R.vider(g);
      Object.keys(boutons).forEach(function (id) { boutons[id].classList.toggle("actif", id === fil); });
      R.el("rect", { x: 20, y: Y - 46, width: 60, height: 92, rx: 10, fill: "#9aa0ad", stroke: C.fonce, "stroke-width": 2.5 }, g);
      txt(g, "moteur", [50, Y + 70], { taille: 16, couleur: C.doux });
      R.el("path", { d: "M120 50 L250 50 L210 " + (Y - 44) + " L160 " + (Y - 44) + " Z", fill: "#f3f5fa", stroke: C.fonce, "stroke-width": 3, "stroke-linejoin": "round" }, g);
      var nG = k === 0 ? 21 : 12;
      for (var i = 0; i < nG; i++) R.el("circle", { cx: 142 + (i % 7) * 15 + (Math.floor(i / 7) % 2) * 7, cy: 70 + Math.floor(i / 7) * 16, r: 6, fill: T(0.55), stroke: C.fonce, "stroke-width": 1 }, g);
      txt(g, "trémie", [185, 36], { taille: 17, couleur: C.doux, gras: true });
      R.el("rect", { x: 80, y: Y - 44, width: 560, height: 88, rx: 6, fill: "#eef0f5", stroke: C.fonce, "stroke-width": 3 }, g);
      [280, 380, 480, 580].forEach(function (x) { R.el("rect", { x: x - 26, y: Y - 58, width: 52, height: 116, rx: 6, fill: k >= 2 ? "rgba(229,72,77,0.26)" : "rgba(229,72,77,0.12)", stroke: "#e5484d", "stroke-width": 2 }, g); });
      txt(g, "fourreau chauffant", [430, Y - 80], { taille: 17, couleur: k >= 2 ? "#c03a3e" : C.doux, gras: true });
      // matière le long de la vis
      if (k >= 1) {
        var fin = k === 1 ? 300 : 640;
        for (var x = 175; x < fin; x += 6) {
          var u = (x - 175) / 465, a = k >= 2 ? 0.12 + 0.65 * u : 0.15;
          R.el("rect", { x: x, y: Y - 38, width: 6.5, height: 76, fill: T(a) }, g);
        }
        if (k === 1) for (i = 0; i < 14; i++) R.el("circle", { cx: 185 + (i % 7) * 16, cy: Y - 26 + Math.floor(i / 7) * 52, r: 6, fill: T(0.55), stroke: C.fonce, "stroke-width": 1 }, g);
      }
      R.el("rect", { x: 80, y: Y - 10, width: 548, height: 20, fill: "#c6cbd8", stroke: C.fonce, "stroke-width": 2 }, g);
      for (x = 110; x < 622; x += 32) R.ligne(g, [x, Y + 38], [x + 20, Y - 38], { couleur: C.fonce, epaisseur: 4.5 });
      txt(g, "vis sans fin (1)", [250, Y + 76], { taille: 17, couleur: k >= 1 ? C.fonce : C.doux, gras: true });
      R.el("rect", { x: 640, y: Y - 58, width: 60, height: 116, fill: "#c6cbd8", stroke: C.fonce, "stroke-width": 3 }, g);
      R.el("path", { d: "M700 " + (Y - 38) + " L736 " + (Y - 24) + " L736 " + (Y + 24) + " L700 " + (Y + 38) + " Z", fill: "#9aa0ad", stroke: C.fonce, "stroke-width": 3, "stroke-linejoin": "round" }, g);
      txt(g, "tête d'extrusion (3)", [670, Y + 82], { taille: 16, couleur: C.doux, gras: true });
      txt(g, "filière", [718, Y - 76], { taille: 17, couleur: C.doux, gras: true });
      if (k >= 3) for (i = 0; i < 3; i++) R.fleche(g, [330 + i * 110, Y + 112], [400 + i * 110, Y + 112], { couleur: "#3b5bdb", epaisseur: 3 });
      if (k >= 3) txt(g, "transport continu vers la filière", [440, Y + 140], { taille: 15, couleur: "#3b5bdb" });
      if (k === 4) {
        R.el("rect", { x: 736, y: Y - 16, width: 190, height: 32, rx: 4, fill: T(0.75), stroke: C.fonce, "stroke-width": 2 }, g);
        if (fil === "anneau") R.el("rect", { x: 736, y: Y - 6, width: 190, height: 12, fill: "#fff", opacity: 0.85 }, g);
        txt(g, "extrudat (4)", [830, Y - 40], { taille: 17, couleur: C.acc, gras: true });
        R.el("rect", { x: 780, y: Y + 50, width: 100, height: 100, rx: 14, fill: "#fff", stroke: "#d9dde6", "stroke-width": 2 }, g);
        section(fil, [830, Y + 96], T(0.85), "#fff");
        txt(g, "section", [830, Y + 172], { taille: 15, couleur: C.doux });
      }
      var prod = { disque: "jonc plein, gaine de câble", anneau: "tube, tuyau, tubulure", L: "cornière, profilé de fenêtre", fente: "plaque, film, store" };
      f.direct.innerHTML = k < 4 ? "Étape " + k + " : " + ["les granulés attendent dans la trémie.", "la vis tourne et entraîne les granulés : elle transporte et commence à malaxer.", "le fourreau chauffe : la vis malaxe, compresse, cisaille et échauffe ; la matière devient fluide et homogène.", "la vis pousse en continu la matière fluide vers la tête d'extrusion."][k]
        : "Filière « " + noms[fil].toLowerCase() + " » : on obtient un " + prod[fil] + ". La section ne change jamais : c'est l'indice du profilé extrudé.";
    }
    et.aller(0);
  })();

  /* ---------- Figure 2 : extrusion-gonflage ---------- */
  (function () {
    var f = R.figure("fig-gonflage", {
      largeur: 960, hauteur: 520, titre: "Extrusion-gonflage : bulle de pellicule, aplatie et enroulée",
      essai: "<strong>Essaie</strong> : augmente l'air insufflé. <strong>Observe</strong> : le tube sorti de la filière annulaire gonfle en une bulle de plus en plus large et mince ; refroidie, elle est aplatie puis enroulée sur une bobine."
    });
    var g = R.el("g", null, f.svg);
    var c = R.curseur(f.reglages, { nom: "Air insufflé", min: 0, max: 100, pas: 1, val: 60, unite: " %" });
    c.surChange(dessiner);
    function dessiner() {
      R.vider(g);
      var u = c.v / 100, X = 330, base = 430;
      R.el("rect", { x: 120, y: 450, width: 300, height: 56, rx: 8, fill: "#eef0f5", stroke: C.fonce, "stroke-width": 3 }, g);
      txt(g, "extrudeuse", [230, 478], { taille: 17, couleur: C.doux, gras: true });
      R.el("rect", { x: X - 34, y: base, width: 68, height: 22, fill: "#9aa0ad", stroke: C.fonce, "stroke-width": 2.5 }, g);
      txt(g, "filière annulaire", [X - 50, base + 2], { taille: 16, couleur: C.doux, ancre: "end", gras: true });
      var r = 26 + 120 * u, h = 330;
      R.el("path", { d: "M" + (X - 26) + " " + base + " C" + (X - 26) + " " + (base - 40) + " " + (X - r) + " " + (base - 50) + " " + (X - r) + " " + (base - 110) + " L" + (X - r) + " " + (base - h) + " L" + (X - 10) + " 50 L" + (X + 10) + " 50 L" + (X + r) + " " + (base - h) + " L" + (X + r) + " " + (base - 110) + " C" + (X + r) + " " + (base - 50) + " " + (X + 26) + " " + (base - 40) + " " + (X + 26) + " " + base + " Z", fill: T(0.06 + 0.2 * (1 - u * 0.6)), stroke: C.acc, "stroke-width": 4 - 2 * u }, g);
      R.el("rect", { x: X - 60, y: 38, width: 120, height: 16, rx: 8, fill: "#9aa0ad" }, g);
      txt(g, "rouleaux : film aplati", [X + 180, 74], { taille: 16, couleur: C.doux, ancre: "start", gras: true });
      for (var k = 0; k < 4; k++) R.fleche(g, [X, base - 20 - k * 70], [X + (k % 2 ? 1 : -1) * (12 + 70 * u), base - 40 - k * 70], { couleur: "#3b5bdb", epaisseur: 3 });
      txt(g, "air", [X, base - 300], { taille: 18, couleur: "#3b5bdb", gras: true });
      txt(g, "bulle de pellicule", [X + r + 16, 250], { taille: 17, couleur: C.acc, ancre: "start", gras: true });
      R.el("path", { d: "M" + X + " 46 L760 46 L760 360", fill: "none", stroke: C.acc, "stroke-width": 5 }, g);
      var rb = 40 + 30 * u;
      R.el("circle", { cx: 760, cy: 420, r: rb, fill: T(0.35), stroke: C.fonce, "stroke-width": 2.5 }, g);
      R.el("circle", { cx: 760, cy: 420, r: 10, fill: C.fonce }, g);
      txt(g, "bobine", [760, 420 + rb + 24], { taille: 17, couleur: C.doux, gras: true });
      f.direct.innerHTML = "Diamètre de la bulle : environ " + R.fmt(r / 26, 1) + " fois celui de la filière. Plus on gonfle, plus la pellicule est large et mince (sacs poubelles, sacs de congélation).";
    }
    dessiner();
  })();
})();
