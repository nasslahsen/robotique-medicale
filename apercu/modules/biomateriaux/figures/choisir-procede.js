(function () {
  "use strict";
  var R = RM, C = R.C;
  var T = function (a) { return PLATEFORME.teinte(a); };
  function txt(g, s, p, o) { o = o || {}; o.italique = false; o.gras = o.gras === undefined ? true : o.gras; return R.texte(g, s, p, o); }

  /* ---------- Figure : sept pièces, sept indices ---------- */
  var f = R.figure("fig-indices", {
    largeur: 960, hauteur: 480, titre: "Reconnaître le procédé à partir de la pièce",
    essai: "<strong>Essaie</strong> : touche une pièce. <strong>Observe</strong> : l'indice (en couleur) découle directement du chemin de la matière pendant la fabrication."
  });
  var g = R.el("g", null, f.svg), choisi = -1;
  var P = [
    { nom: "tubulure", proc: "Extrusion", ind: "même section sur toute la longueur, produite en continu" },
    { nom: "corps de seringue", proc: "Injection", ind: "pièce prête à l'emploi, petit point par où la matière est arrivée" },
    { nom: "flacon A", proc: "Injection-soufflage", ind: "point d'injection au fond du contenant" },
    { nom: "flacon B", proc: "Extrusion-soufflage", ind: "ligne de soudure au fond du contenant" },
    { nom: "citerne", proc: "Rotomoulage", ind: "pièce creuse de toute dimension, sans soudure ni collage" },
    { nom: "blister", proc: "Thermoformage", ind: "pièce mince, coins arrondis, découpe au pourtour" },
    { nom: "botte", proc: "Compression", ind: "bavure autour de la pièce" },
    { nom: "sac", proc: "Extrusion-gonflage", ind: "film mince, issu d'une bulle aplatie et enroulée" }
  ];
  function icone(gi, k, x, y, on) {
    var acc = on ? C.acc : "#9aa0ad";
    if (k === 0) { R.el("rect", { x: x - 70, y: y - 14, width: 130, height: 28, rx: 4, fill: T(0.4), stroke: C.fonce, "stroke-width": 2.5 }, gi); R.el("ellipse", { cx: x + 60, cy: y, rx: 9, ry: 14, fill: acc, stroke: C.fonce, "stroke-width": 2.5 }, gi); R.el("ellipse", { cx: x + 60, cy: y, rx: 4, ry: 7, fill: "#fff" }, gi); }
    if (k === 1) { R.el("rect", { x: x - 56, y: y - 14, width: 96, height: 28, rx: 4, fill: "#f3f5fa", stroke: C.fonce, "stroke-width": 2.5 }, gi); R.el("rect", { x: x - 66, y: y - 24, width: 10, height: 48, rx: 3, fill: "#f3f5fa", stroke: C.fonce, "stroke-width": 2 }, gi); R.el("path", { d: "M" + (x + 40) + " " + (y - 7) + " L" + (x + 60) + " " + (y - 3) + " L" + (x + 60) + " " + (y + 3) + " L" + (x + 40) + " " + (y + 7) + " Z", fill: "#f3f5fa", stroke: C.fonce, "stroke-width": 2 }, gi); R.el("circle", { cx: x + 62, cy: y, r: 5, fill: acc }, gi); }
    if (k === 2 || k === 3) {
      R.el("path", { d: "M" + (x - 40) + " " + (y - 8) + " L" + (x - 40) + " " + (y + 36) + " L" + (x + 4) + " " + (y + 36) + " L" + (x + 4) + " " + (y - 8) + " Q" + (x + 4) + " " + (y - 22) + " " + (x - 10) + " " + (y - 28) + " L" + (x - 10) + " " + (y - 40) + " L" + (x - 26) + " " + (y - 40) + " L" + (x - 26) + " " + (y - 28) + " Q" + (x - 40) + " " + (y - 22) + " " + (x - 40) + " " + (y - 8) + " Z", fill: T(0.3), stroke: C.fonce, "stroke-width": 2.5 }, gi);
      R.el("circle", { cx: x + 48, cy: y + 6, r: 26, fill: "#f3f5fa", stroke: C.fonce, "stroke-width": 2 }, gi);
      if (k === 2) R.el("circle", { cx: x + 48, cy: y + 6, r: 5, fill: acc }, gi); else R.el("rect", { x: x + 30, y: y + 3, width: 36, height: 6, rx: 3, fill: acc }, gi);
      txt(gi, "fond", [x + 48, y - 30], { taille: 13, couleur: C.doux, gras: false });
    }
    if (k === 4) { R.el("rect", { x: x - 62, y: y - 34, width: 124, height: 68, rx: 30, fill: T(0.4), stroke: C.fonce, "stroke-width": 2.5 }, gi); R.el("rect", { x: x - 10, y: y - 46, width: 20, height: 13, rx: 3, fill: T(0.6), stroke: C.fonce, "stroke-width": 2 }, gi); }
    if (k === 5) { R.el("rect", { x: x - 66, y: y - 36, width: 132, height: 72, rx: 6, fill: "#f3f5fa", stroke: acc, "stroke-width": 3, "stroke-dasharray": "7 4" }, gi); for (var i = 0; i < 3; i++) for (var r = 0; r < 2; r++) R.el("rect", { x: x - 54 + i * 38, y: y - 28 + r * 30, width: 28, height: 24, rx: 10, fill: T(0.3), stroke: C.fonce, "stroke-width": 2 }, gi); }
    if (k === 6) { R.el("path", { d: "M" + (x - 30) + " " + (y - 46) + " L" + (x + 8) + " " + (y - 46) + " L" + (x + 8) + " " + (y + 8) + " L" + (x + 48) + " " + (y + 14) + " L" + (x + 48) + " " + (y + 32) + " L" + (x - 30) + " " + (y + 32) + " Z", fill: "#5b6172", stroke: C.fonce, "stroke-width": 2.5 }, gi); R.el("rect", { x: x - 40, y: y + 32, width: 98, height: 7, fill: acc }, gi); }
    if (k === 7) { R.el("path", { d: "M" + (x - 40) + " " + (y - 40) + " L" + (x + 40) + " " + (y - 40) + " L" + (x + 48) + " " + (y + 38) + " L" + (x - 48) + " " + (y + 38) + " Z", fill: T(0.18), stroke: C.fonce, "stroke-width": 2 }, gi); R.el("circle", { cx: x + 60, cy: y + 20, r: 18, fill: on ? T(0.5) : "#e3e6ee", stroke: C.fonce, "stroke-width": 2 }, gi); R.el("circle", { cx: x + 60, cy: y + 20, r: 5, fill: C.fonce }, gi); }
  }
  function dessiner() {
    R.vider(g);
    P.forEach(function (p, k) {
      var x = 120 + (k % 4) * 240, y = 140 + Math.floor(k / 4) * 230, on = k === choisi;
      var gb = R.el("g", { style: "cursor:pointer" }, g);
      R.el("rect", { x: x - 108, y: y - 100, width: 216, height: 206, rx: 18, fill: on ? T(0.12) : "#fff", stroke: on ? C.acc : "#d9dde6", "stroke-width": on ? 4 : 3 }, gb);
      txt(gb, p.nom, [x, y - 76], { taille: 17 });
      txt(gb, on ? p.proc : "?", [x, y + 78], { taille: on ? 17 : 22, couleur: on ? C.acc : C.doux });
      gb.addEventListener("click", function () { choisi = k; dessiner(); });
      icone(gb, k, x, y, on);
    });
    f.direct.innerHTML = choisi < 0 ? "Touche une pièce pour voir son procédé et l'indice qui le prouve." : "<strong>" + P[choisi].nom + "</strong> : " + P[choisi].proc.toLowerCase() + ". Indice : " + P[choisi].ind + ".";
  }
  dessiner();
})();
