/* Figure : matrice des risques, probabilité × impact, réglable (notes de 1 à 4 ajoutées). */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-matrice-risque", {
    largeur: 960, hauteur: 540, titre: "Risque = probabilité × impact",
    essai: "<strong>Essaie</strong> : règle la probabilité et l'impact. <strong>Observe</strong> : le risque monte vers le coin en haut à droite ; on le baisse en réduisant l'un ou l'autre."
  });
  var g = A.s("g", null, f.svg);
  var PROB = [["Très improbable", "exceptionnel"], ["Improbable", "rare"], ["Probable", "fréquent"], ["Très probable", "très fréquent"]];
  var IMP = [["Mineur", "faible, peu grave"], ["Modéré", "moyennement grave"], ["Important", "grave"], ["Majeur", "très grave, critique, vital"]];
  var cp = R.curseur(f.reglages, { nom: "Probabilité (1 à 4)", min: 1, max: 4, pas: 1, val: 3 });
  var ci = R.curseur(f.reglages, { nom: "Impact (1 à 4)", min: 1, max: 4, pas: 1, val: 4 });
  var X0 = 220, Y0 = 20, L = 140, H = 104;
  function teinte(r) { return r >= 9 ? "#b98ce6" : r >= 4 ? "#dcc6f3" : "#f3ebfb"; }
  function dessiner() {
    A.vider(g);
    var p = cp.v, im = ci.v, r = A.calc.risque(p, im);
    for (var a = 1; a <= 4; a++) for (var b = 1; b <= 4; b++) {
      var x = X0 + (b - 1) * L, y = Y0 + (4 - a) * H, on = a === p && b === im;
      A.s("rect", { x: x, y: y, width: L, height: H, fill: teinte(a * b), stroke: on ? C.encre : "#fff", "stroke-width": on ? 6 : 3 }, g);
      A.texte(g, String(a * b), [x + L / 2, y + H / 2], { taille: on ? 30 : 20, mono: true, gras: on ? 800 : 500, coul: C.encre, halo: false });
    }
    PROB.forEach(function (t, k) { A.texte(g, t[0], [110, Y0 + (3 - k) * H + 42], { taille: 15, gras: 700, halo: false }); A.texte(g, t[1] + " (" + (k + 1) + ")", [110, Y0 + (3 - k) * H + 64], { taille: 13, coul: C.doux, halo: false }); });
    IMP.forEach(function (t, k) { A.texte(g, t[0] + " (" + (k + 1) + ")", [X0 + k * L + L / 2, 450], { taille: 15, gras: 700, halo: false }); A.texte(g, t[1], [X0 + k * L + L / 2, 472], { taille: 12, coul: C.doux, halo: false, largeur: L - 8 }); });
    A.texte(g, "Probabilité", [110, 12], { taille: 15, gras: 800, coul: C.v }); A.texte(g, "Impact", [X0 + 2 * L, 510], { taille: 15, gras: 800, coul: C.v });
    var niv = A.calc.niveauRisque(r);
    R.rendre(f.direct, "R = P \\times I = " + p + " \\times " + im + " = " + r + "\\quad \\text{(risque " + niv + ")}");
  }
  cp.surChange(dessiner); ci.surChange(dessiner);
  dessiner();
})();
