/* Figure : un workflow de bilan sanguin, étape par étape, avec son déclencheur et ses acteurs. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-workflow", {
    largeur: 960, hauteur: 540, titre: "Workflow d'une demande de bilan sanguin",
    essai: "<strong>Essaie</strong> : avance étape par étape. <strong>Observe</strong> : chaque étape a un acteur (son couloir) et une place dans le temps : qui fait quoi et quand."
  });
  var L = ["Médecin", "Infirmier", "Laboratoire"];
  var N = [
    { t: "Prescrire le bilan", sous: "déclencheur", x: 150, y: 50, w: 190, h: 100 },
    { t: "Prélever le sang", x: 330, y: 220, w: 190, h: 100 },
    { t: "Analyser l'échantillon", x: 510, y: 390, w: 190, h: 100 },
    { t: "Publier le résultat", x: 740, y: 390, w: 190, h: 100 },
    { t: "Lire le résultat", x: 740, y: 50, w: 190, h: 100 }
  ];
  A.etapesFig(f, N, [
    "Le <strong>déclencheur</strong> : le médecin prescrit. Sans lui, rien ne démarre.",
    "L'infirmier prélève : le flux passe d'un acteur à un autre.",
    "Le laboratoire analyse l'échantillon reçu.",
    "Le laboratoire publie le résultat : un flux d'échange repart vers le service.",
    "Le médecin lit le résultat. Le workflow a dit, pour chaque étape, qui fait quoi et quand."
  ], { fond: function (g) {
    L.forEach(function (l, k) {
      A.s("rect", { x: 10, y: 30 + k * 170, width: 940, height: 150, rx: 12, fill: k % 2 ? "#fff" : C.fond, stroke: C.trait, "stroke-width": 2 }, g);
      A.texte(g, l, [70, 105 + k * 170], { taille: 17, gras: 700, coul: C.doux, halo: false });
    });
  }, depart: "Un workflow de trois acteurs. Avance pour le dérouler." });
})();
