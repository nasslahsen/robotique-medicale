(function () {
  "use strict";
  var R = RM, C = R.C, m = R.m;

  var f = R.figure("fig-liaisons", {
    hauteur: 500,
    titre: "Solide B relié au solide fixe A par une liaison",
    essai: "<strong>Essaie</strong> : choisis « Solide libre », bouge les six curseurs, puis choisis une liaison. " +
      "<strong>Observe</strong> : seuls les mouvements permis gardent un curseur actif (cases vertes) ; les autres sont bloqués (cases rouges). Le nombre de cases vertes est le nombre de DDL restants, 6 moins les contraintes. Avec l'hélicoïdale, un seul curseur fait avancer et tourner B."
  });
  var V = R.vue3D(300, 270, 150, -40 * R.DEG, 22 * R.DEG);
  var g = R.el("g", null, f.svg);
  var MOUV = ["Tx", "Ty", "Tz", "Rx", "Ry", "Rz"];
  var LIAISONS = [
    ["Solide libre", [1, 1, 1, 1, 1, 1]],
    ["Encastrement", [0, 0, 0, 0, 0, 0]],
    ["Glissière", [1, 0, 0, 0, 0, 0]],
    ["Pivot", [0, 0, 0, 1, 0, 0]],
    ["Pivot glissant", [1, 0, 0, 1, 0, 0]],
    ["Hélicoïdale", "h"],
    ["Plane", [1, 1, 0, 0, 0, 1]],
    ["Rotule", [0, 0, 0, 1, 1, 1]],
    ["Linéaire annulaire", [1, 0, 0, 1, 1, 1]],
    ["Ponctuelle", [1, 1, 0, 1, 1, 1]]
  ];
  var b = R.boutons(f.reglages);
  var sel = R.choix(b, LIAISONS.map(function (l, i) { return [i, l[0]]; }), function () { appliquer(); });
  R.bouton(b, "Remettre à zéro", function () { curs.forEach(function (c) { c.set(0); }); helice.set(0); dessiner(); });
  var tourne = R.basculeOrbite(b);
  var curs = MOUV.map(function (nm, i) {
    return R.curseur(f.reglages, i < 3 ? { nom: nm.replace("T", "T "), min: -0.8, max: 0.8, pas: 0.05, val: 0, surChange: dessiner }
      : { nom: nm.replace("R", "R "), min: -90, max: 90, pas: 1, val: 0, unite: "°", surChange: dessiner });
  });
  var helice = R.curseur(f.reglages, { nom: "Hélice q", min: -360, max: 360, pas: 5, val: 0, unite: "°", surChange: dessiner });
  var zone = R.h("div", null, "", f.direct);

  function permis() { var l = LIAISONS[+sel.value][1]; return l === "h" ? [1, 0, 0, 1, 0, 0] : l; }
  function appliquer() {
    var l = LIAISONS[+sel.value][1];
    curs.forEach(function (c, i) {
      var on = l !== "h" && l[i] === 1;
      c.input.disabled = !on; c.input.parentNode.style.opacity = on ? 1 : 0.35;
      if (!on) c.set(0);
    });
    helice.input.parentNode.style.display = l === "h" ? "" : "none";
    if (l !== "h") helice.set(0);
    dessiner();
  }

  function dessiner() {
    R.vider(g);
    var l = LIAISONS[+sel.value][1], h = l === "h";
    var v = curs.map(function (c) { return c.v; });
    if (h) { v[3] = helice.v; v[0] = helice.v / 360 * 0.4; } // pas de l'hélice : 0,4 par tour
    var Rb = m.matMul(m.matMul(m.Rz(v[5] * R.DEG), m.Ry(v[4] * R.DEG)), m.Rx(v[3] * R.DEG));
    var t = [v[0], v[1], 0.42 + v[2]];
    // solide A fixe
    R.pave(g, V, [0, 0, -0.12], [1.15, 0.85, 0.1], m.identite(3), { faces: ["#d9dde3", "#d9dde3", "#cfd4db", "#cfd4db", "#c4cad2", "#e6e9ed"], opacite: 1 });
    R.texte(g, "A (fixe)", m.add(V.p([0, -0.85, -0.22]), [0, 24]), { italique: false, couleur: C.doux, taille: 16 });
    // axe de la liaison (x)
    R.ligne(g, V.p([-1.5, 0, 0.42]), V.p([1.5, 0, 0.42]), { couleur: C.acc, tirets: "8 6", epaisseur: 2.5 });
    R.texte(g, "axe x de la liaison", m.add(V.p([1.5, 0, 0.42]), [0, -18]), { italique: false, couleur: C.acc, taille: 15 });
    // solide B
    R.pave(g, V, t, [0.45, 0.3, 0.22], Rb, { faces: ["#b39ddb", "#b39ddb", "#9575cd", "#9575cd", "#d1c4e9", "#ede7f6"] });
    R.repere3D(g, V, t, Rb, { longueur: 0.75, epaisseur: 3.2, indice: "B", taille: 18 });
    // grille des mobilités
    var p = permis(), nb = 0;
    MOUV.forEach(function (nm, i) {
      var x = 75 + i * 90, y = 440, on = p[i] === 1;
      if (on) nb++;
      R.el("rect", { x: x - 38, y: y, width: 76, height: 42, rx: 12, fill: on ? "#e3f7ee" : "#fdecec", stroke: on ? C.y : C.x, "stroke-width": 2.5 }, g);
      R.texte(g, nm.charAt(0), [x - 6, y + 21], { couleur: on ? C.y : C.x, gras: true, taille: 20, ind: nm.charAt(1), halo: false });
    });
    var mob = h ? 1 : nb;
    R.texte(g, LIAISONS[+sel.value][0], [300, 32], { italique: false, gras: true, taille: 22 });
    R.rendre(zone, "\\text{DDL restants} = 6 - " + (6 - mob) + " \\text{ contraintes} = " + mob +
      (h ? "\\qquad T_x = \\text{pas} \\times \\tfrac{q}{360°} \\text{ : translation et rotation couplées}" : ""));
  }
  R.orbite(f.svg, V, dessiner, tourne);
  appliquer();
})();
