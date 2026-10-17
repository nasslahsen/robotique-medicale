(function () {
  "use strict";
  var R = RM, C = EMB.C;

  /* ---------- Figure : une mémoire ou deux, cycle par cycle ---------- */
  var f = R.figure("fig-memoires", {
    largeur: 960, hauteur: 560,
    titre: "Von Neumann, Harvard et Super Harvard",
    essai: "<strong>Essaie</strong> : choisis une architecture, règle le nombre d'instructions, puis avance cycle par cycle. <strong>Observe</strong> : en Von Neumann, I (instruction) et D (donnée) se suivent sur le même bus ; en Harvard, l'instruction suivante arrive pendant que la donnée passe, d'où presque deux fois moins de cycles (modèle simple ajouté)."
  });
  var g = EMB.el("g", null, f.svg), mode = "vn", t = 0, timer = null;
  var b = R.boutons(f.reglages), bm = {};
  [["vn", "Von Neumann"], ["h", "Harvard"], ["sh", "Super Harvard"]].forEach(function (m) { bm[m[0]] = R.bouton(b, m[1], function () { mode = m[0]; arreter(); t = 0; dessiner(); }); });
  var cN = R.curseur(f.reglages, { nom: "Instructions N", min: 1, max: 10, pas: 1, val: 4, surChange: function () { arreter(); t = 0; dessiner(); } });
  var b2 = R.boutons(f.reglages);
  R.bouton(b2, "Cycle suivant", function () { arreter(); if (t < cycles().length) t++; dessiner(); });
  R.bouton(b2, "Tout dérouler", function () { arreter(); t = 0; timer = setInterval(function () { t++; dessiner(); if (t >= cycles().length) arreter(); }, 300); });
  R.bouton(b2, "Recommencer", function () { arreter(); t = 0; dessiner(); });
  var zone = R.h("div", null, "", f.direct);
  function arreter() { if (timer) clearInterval(timer); timer = null; }
  function cycles() {
    var N = cN.v, l = [], i;
    if (mode === "vn") { for (i = 1; i <= N; i++) l.push({ a: "I" + i }, { a: "D" + i }); }
    else for (i = 0; i <= N; i++) l.push({ pm: i < N ? "I" + (i + 1) : null, dm: i > 0 ? "D" + i : null });
    return l;
  }
  function bus(a, b0, on, dbl) { EMB.fleche(g, a, b0, { ep: on ? 6 : 3, coul: on ? C.acc : C.encre, double: dbl }); }
  function dessiner() {
    EMB.vider(g);
    Object.keys(bm).forEach(function (k) { bm[k].classList.toggle("actif", k === mode); });
    var cyc = cycles(), cur = t > 0 ? cyc[t - 1] : null;
    if (mode === "vn") {
      EMB.bloc(g, 150, 40, 210, 140, "CPU", { taille: 30, coul: C.ko });
      EMB.bloc(g, 600, 40, 210, 140, "Memory\nData and instructions", { taille: 19 });
      bus([360, 80], [600, 80], !!cur); bus([360, 140], [600, 140], !!cur, true);
      EMB.texte(g, "Address bus", [480, 62], { taille: 16, gras: false });
      EMB.texte(g, "Data bus", [480, 164], { taille: 16, gras: false });
      if (cur) EMB.texte(g, cur.a, [480, 111], { taille: 20, coul: C.acc, mono: true });
    } else {
      var sh = mode === "sh";
      EMB.bloc(g, 40, 40, 200, 140, "Program Memory\ninstructions", { taille: 18 });
      EMB.bloc(g, 380, 40, 200, 140, sh ? "" : "CPU", { taille: 30, coul: C.ko });
      if (sh) { EMB.texte(g, "CPU", [480, 72], { taille: 26, coul: C.ko, halo: false }); EMB.bloc(g, 405, 100, 150, 56, "Instruction\ncache", { taille: 16, fill: C.clair }); }
      EMB.bloc(g, 720, 40, 200, 140, "Data Memory\nData only", { taille: 18 });
      var onP = cur && cur.pm, onD = cur && cur.dm;
      bus([380, 80], [240, 80], onP); bus([380, 140], [240, 140], onP, true);
      bus([580, 80], [720, 80], onD); bus([580, 140], [720, 140], onD, true);
      EMB.texte(g, "PM Address bus", [310, 62], { taille: 14, gras: false }); EMB.texte(g, "PM Data bus", [310, 164], { taille: 14, gras: false });
      EMB.texte(g, "DM Address bus", [650, 62], { taille: 14, gras: false }); EMB.texte(g, "DM Data bus", [650, 164], { taille: 14, gras: false });
      if (onP) EMB.texte(g, cur.pm, [310, 111], { taille: 19, coul: C.acc, mono: true });
      if (onD) EMB.texte(g, cur.dm, [650, 111], { taille: 19, coul: C.acc, mono: true });
      if (sh) {
        EMB.bloc(g, 740, 230, 160, 64, "I/O Controller", { taille: 17, actif: true });
        EMB.fleche(g, [820, 180], [820, 230], { ep: 3, double: true });
        EMB.fleche(g, [820, 294], [820, 334], { ep: 3, double: true });
        EMB.texte(g, "Data", [860, 318], { taille: 17, coul: C.ko });
      }
    }
    // chronologie
    var x0 = 130, y0 = mode === "sh" ? 380 : 300, w = Math.min(72, 720 / cyc.length), h = 46;
    EMB.texte(g, "Cycles de bus", [x0, y0 - 28], { taille: 16, coul: C.doux, gras: false, ancre: "start" });
    function cell(x, y, txt, coul) {
      EMB.el("rect", { x: x, y: y, width: w - 5, height: h, rx: 7, fill: txt ? coul : "#fff", stroke: C.pale, "stroke-width": 1.5 }, g);
      if (txt) EMB.texte(g, txt, [x + (w - 5) / 2, y + h / 2], { taille: 16, coul: "#fff", halo: false, mono: true });
    }
    if (mode === "vn") {
      EMB.texte(g, "bus", [x0 - 14, y0 + h / 2], { taille: 16, ancre: "end", gras: false });
      cyc.forEach(function (c, i) { cell(x0 + i * w, y0, i < t ? c.a : null, c.a.charAt(0) === "I" ? C.bleu : C.acc); });
    } else {
      EMB.texte(g, "PM", [x0 - 14, y0 + h / 2], { taille: 16, ancre: "end", gras: false });
      EMB.texte(g, "DM", [x0 - 14, y0 + h + 10 + h / 2], { taille: 16, ancre: "end", gras: false });
      cyc.forEach(function (c, i) { cell(x0 + i * w, y0, i < t ? c.pm : null, C.bleu); cell(x0 + i * w, y0 + h + 10, i < t ? c.dm : null, C.acc); });
    }
    EMB.texte(g, "cycle " + t + " sur " + cyc.length, [480, mode === "sh" ? 520 : 470], { taille: 22, coul: C.acc });
    var N = cN.v;
    R.rendre(zone, "N = " + N + " \\qquad \\text{Von Neumann : } 2N = " + 2 * N + " \\qquad \\text{Harvard : } N + 1 = " + (N + 1));
  }
  dessiner();
})();
