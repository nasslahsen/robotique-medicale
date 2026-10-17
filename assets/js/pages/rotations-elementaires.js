(function () {
  "use strict";
  var R = RM, C = R.C, m = R.m;

  var f = R.figure("fig-elem", {
    hauteur: 470,
    titre: "Rotation élémentaire d'un bloc autour d'un axe",
    essai: "<strong>Essaie</strong> : choisis un axe, puis fais varier l'angle de 0 à 90°. " +
      "<strong>Observe</strong> : l'axe de rotation (surligné) ne bouge pas, et sa colonne dans la matrice reste un vecteur de base. Les deux autres colonnes tournent comme dans le cas plan. Avec l'axe y, regarde où apparaît le signe moins."
  });
  var V = R.vue3D(300, 270, 158, -40 * R.DEG, 22 * R.DEG);
  var g = R.el("g", null, f.svg);
  var b = R.boutons(f.reglages);
  var axe = "z", btns = {};
  var nomsAngle = { z: ["α", "lacet"], y: ["β", "tangage"], x: ["γ", "roulis"] };
  ["z", "y", "x"].forEach(function (a) {
    btns[a] = R.bouton(b, "Autour de " + a + " (" + nomsAngle[a][1] + ")", function () {
      axe = a; Object.keys(btns).forEach(function (k) { btns[k].classList.toggle("actif", k === a); });
      ang.set(0); dessiner();
    });
  });
  btns.z.classList.add("actif");
  var ang = R.curseur(f.reglages, { nom: "Angle", min: -180, max: 180, pas: 1, val: 35, unite: "°", surChange: dessiner });
  var b2 = R.boutons(f.reglages);
  var tourne = R.basculeOrbite(b2);
  var zone = R.h("div", null, "", f.direct);

  function dessiner() {
    R.vider(g);
    var t = ang.v * R.DEG, Rm = m.Raxe(axe, t), O = [0, 0, 0];
    var k = { x: 0, y: 1, z: 2 }[axe];
    var e = [0, 0, 0]; e[k] = 1;
    R.ligne(g, V.p(m.scale(e, -1.15)), V.p(m.scale(e, 1.15)), { couleur: C.acc, epaisseur: 6, opacite: 0.25 });
    var nomsFixes = ["x", "y", "z"]; nomsFixes[k] = null;
    R.repere3D(g, V, O, m.identite(3), { couleurs: [C.gris, C.gris, C.gris], noms: nomsFixes, indice: "0", tirets: "5 4", epaisseur: 1.6, longueur: 1.35 });
    R.pave(g, V, O, [0.62, 0.36, 0.14], Rm, { opacite: 0.8 });
    var nomsR = ["x", "y", "z"]; nomsR[k] = nomsR[k] + "₀ = " + nomsR[k];
    R.repere3D(g, V, O, Rm, { indice: "1", noms: nomsR, longueur: 1.35, epaisseur: 3 });
    // arc du sens positif autour de l'axe
    var u = [0, 0, 0], w = [0, 0, 0]; u[(k + 1) % 3] = 1; w[(k + 2) % 3] = 1;
    var pts = []; for (var i = 0; i <= 30; i++) { var s = t * i / 30; pts.push(V.p(m.add(m.scale(u, 0.55 * Math.cos(s)), m.scale(w, 0.55 * Math.sin(s))))); }
    R.el("polyline", { points: pts.map(String).join(" "), fill: "none", stroke: C.acc, "stroke-width": 3 }, g);
    R.texte(g, nomsAngle[axe][0], V.p(m.add(m.scale(u, 0.7 * Math.cos(t / 2)), m.scale(w, 0.7 * Math.sin(t / 2)))), { couleur: C.acc, gras: true });
    var nom = { z: "R_z(\\alpha)", y: "R_y(\\beta)", x: "R_x(\\gamma)" }[axe];
    var cols = [C.x, C.y, C.z];
    R.rendre(zone, nom + " = " + R.texMat(Rm, 3, { cellule: function (i, j, tt) { return (i === k || j === k) ? R.couleur(C.acc, "\\mathbf{" + tt + "}") : R.couleur(cols[j], tt); } }) +
      "\\qquad " + nomsAngle[axe][0] + " = " + R.tn(ang.v, 0) + "°,\\ \\cos = " + R.tn(Math.cos(t), 3) + ",\\ \\sin = " + R.tn(Math.sin(t), 3));
  }
  R.orbite(f.svg, V, dessiner, tourne);
  dessiner();
})();
