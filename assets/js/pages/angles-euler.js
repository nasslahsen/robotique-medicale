(function () {
  "use strict";
  var R = RM, C = R.C, m = R.m;

  var f = R.figure("fig-euler", {
    hauteur: 500,
    titre: "Angles d'Euler étape par étape sur un téléphone",
    essai: "<strong>Essaie</strong> : clique sur « Téléphone ZYX », puis sur « Étape suivante » trois fois. " +
      "<strong>Observe</strong> : chaque rotation se fait autour d'un axe du repère obtenu juste avant (surligné en orange), les repères précédents restent en pâle, et la matrice se construit un facteur à la fois. Passe ensuite en ordre XYZ avec les mêmes angles : l'orientation finale change."
  });
  var V = R.vue3D(300, 270, 180, -40 * R.DEG, 24 * R.DEG);
  var g = R.el("g", null, f.svg);

  var b0 = R.boutons(f.reglages);
  var ordre = R.choix(b0, [["zyx", "Ordre ZYX : Rz(α) Ry(β) Rx(γ)"], ["xyz", "Ordre XYZ : Rx(φ) Ry(θ) Rz(ψ)"]], function () { libelles(); et.aller(0); });
  R.bouton(b0, "Téléphone ZYX", function () { ordre.value = "zyx"; libelles(); c1.set(-90); c2.set(90); c3.set(0); et.aller(0); });
  R.bouton(b0, "Téléphone XYZ", function () { ordre.value = "xyz"; libelles(); c1.set(90); c2.set(90); c3.set(-90); et.aller(0); });
  var c1 = R.curseur(f.reglages, { nom: "α", min: -180, max: 180, pas: 1, val: 40, unite: "°", surChange: majDirecte });
  var c2 = R.curseur(f.reglages, { nom: "β", min: -90, max: 90, pas: 1, val: 30, unite: "°", surChange: majDirecte });
  var c3 = R.curseur(f.reglages, { nom: "γ", min: -180, max: 180, pas: 1, val: 20, unite: "°", surChange: majDirecte });
  var zone = R.h("div", null, "", f.direct), alerte = R.h("p", null, "", f.direct);
  var k = 0, frac = 1;

  var CONV = {
    zyx: { axes: ["z", "y", "x"], angles: ["α", "β", "γ"], tex: ["\\alpha", "\\beta", "\\gamma"], reperes: ["0", "1", "2", "s"],
      noms: ["", "lacet : rotation α autour de z₀", "tangage : rotation β autour du nouvel axe y₁", "roulis : rotation γ autour du nouvel axe x₂"],
      R: function (i) { return i === 3 ? "R^{(0,s)}" : "R^{(0," + i + ")}"; } },
    xyz: { axes: ["x", "y", "z"], angles: ["φ", "θ", "ψ"], tex: ["\\varphi", "\\theta", "\\psi"], reperes: ["0", "1", "2", "3"],
      noms: ["", "roulis : rotation φ autour de x₀", "tangage : rotation θ autour du nouvel axe y₁", "lacet : rotation ψ autour du nouvel axe z₂"],
      R: function (i) { return "{}^0R_" + i; } }
  };
  function libelles() {
    var cv = CONV[ordre.value];
    [c1, c2, c3].forEach(function (c, i) { c.input.parentNode.firstChild.textContent = cv.angles[i] + " (" + cv.axes[i] + ")"; });
  }

  var bt = R.boutons(f.reglages);
  var tourne = R.basculeOrbite(bt);
  var et = R.etapes(f.reglages, 3, CONV.zyx.noms, function (n) {
    var avant = k; k = n;
    var noms = CONV[ordre.value].noms;
    f.reglages.querySelector(".etape-texte").textContent = "Étape " + n + " sur 3" + (noms[n] ? " : " + noms[n] : " : position initiale");
    if (n === avant + 1) { R.animer(700, function (u) { frac = u; dessiner(); }); }
    else { frac = 1; dessiner(); }
  });
  function majDirecte() { frac = 1; dessiner(); }

  function dessiner() {
    if (!et) return;
    R.vider(g);
    var cv = CONV[ordre.value], vals = [c1.v, c2.v, c3.v].map(function (x) { return x * R.DEG; });
    var O = [0, 0, 0];
    // repères successifs
    var cumul = [m.identite(3)];
    for (var i = 0; i < 3; i++) {
      var t = i < k ? (i === k - 1 ? vals[i] * frac : vals[i]) : 0;
      cumul.push(m.matMul(cumul[i], m.Raxe(cv.axes[i], t)));
    }
    var Rc = cumul[k];
    // sol
    for (var q = -1; q <= 1.001; q += 0.25) {
      R.ligne(g, V.p([q, -1, -0.9]), V.p([q, 1, -0.9]), { couleur: "#e3e6ee", epaisseur: 1 });
      R.ligne(g, V.p([-1, q, -0.9]), V.p([1, q, -0.9]), { couleur: "#e3e6ee", epaisseur: 1 });
    }
    if (k > 0) R.repere3D(g, V, O, m.identite(3), { couleurs: [C.gris, C.gris, C.gris], indice: "0", tirets: "5 4", epaisseur: 1.5, longueur: 1.3, taille: 17 });
    for (i = 1; i < k; i++) R.repere3D(g, V, O, cumul[i], { indice: cv.reperes[i], epaisseur: 1.6, longueur: 1.05, opacite: 0.35, taille: 16 });
    // axe de la rotation en cours (ou de la suivante)
    var etapeAxe = k > 0 ? k - 1 : -1;
    if (etapeAxe >= 0) {
      var idx = { x: 0, y: 1, z: 2 }[cv.axes[etapeAxe]];
      var a = m.colonne(cumul[etapeAxe], idx);
      R.ligne(g, V.p(m.scale(a, -1.5)), V.p(m.scale(a, 1.5)), { couleur: C.acc, epaisseur: 7, opacite: 0.3 });
    }
    // le téléphone : boîtier sombre, écran sur la face +z, écouteur du côté +x
    R.pave(g, V, O, [0.8, 0.4, 0.06], Rc, { faces: ["#3a4258", "#3a4258", "#4a536b", "#4a536b", "#2b3245", "#2b3245"], opacite: 1 });
    var sur = function (l) { return V.p(m.matVec(Rc, l)); };
    var nz = m.colonne(Rc, 2);
    if (V.profondeur(nz) > 0) {
      R.polygone(g, [[-0.68, -0.33, 0.062], [0.62, -0.33, 0.062], [0.62, 0.33, 0.062], [-0.68, 0.33, 0.062]].map(sur), { remplissage: "#cfe0ff", couleur: "#8fb3ff", epaisseur: 1.5 });
      R.ligne(g, sur([0.71, -0.1, 0.062]), sur([0.71, 0.1, 0.062]), { couleur: "#9aa0ad", epaisseur: 3 });
    }
    R.repere3D(g, V, O, Rc, { indice: cv.reperes[k], longueur: 1.25, epaisseur: 4 });
    R.texte(g, "écran bleu : face +z ; écouteur côté +x", [20, 482], { italique: false, taille: 14, couleur: C.doux, ancre: "start" });

    // formule
    var facteurs = [], numeriques = [];
    for (i = 0; i < k; i++) {
      facteurs.push("R_" + cv.axes[i] + "(" + cv.tex[i] + ")");
      numeriques.push(R.texMat(m.Raxe(cv.axes[i], vals[i]), 3));
    }
    var tex;
    if (k === 0) tex = "\\text{départ : } I = " + R.texMat(m.identite(3), 0) + "\\\\[4pt] \\text{repère du téléphone} = R_0";
    else tex = cv.R(k) + " = " + facteurs.join("\\,") + (k > 1 ? " = " + numeriques.join("") : "") + "\\\\[6pt] \\phantom{R} = " + R.texMat(cumul[k], 3, { couleursCol: [C.x, C.y, C.z] });
    var vt = [c1.v, c2.v, c3.v];
    tex += "\\\\[4pt] " + cv.tex.map(function (s, j) { return s + " = " + R.tn(vt[j], 0) + "°"; }).join(",\\quad ");
    R.rendre(zone, tex);
    if (Math.abs(Math.cos(vals[1])) < 1e-6) {
      alerte.innerHTML = '<span class="alerte">' + (ordre.value === "zyx" ? "β" : "θ") + " = ±90° : le premier et le dernier axe de rotation sont alignés. Le " +
        (ordre.value === "zyx" ? "roulis γ produit le même mouvement que le lacet α" : "lacet ψ produit le même mouvement que le roulis φ") + " : c'est une singularité de la représentation.</span>";
    } else alerte.textContent = "";
  }
  libelles();
  R.orbite(f.svg, V, dessiner, tourne);
  et.aller(0);
})();
