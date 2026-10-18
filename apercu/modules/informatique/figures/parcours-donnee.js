/* Figures : le parcours d'une donnée de santé ; la probabilité qu'elle traverse la chaîne intacte. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-parcours", {
    largeur: 960, hauteur: 400, titre: "Le parcours d'une donnée de santé",
    essai: "<strong>Essaie</strong> : avance étape par étape. <strong>Observe</strong> : à chaque flèche, la donnée change de système."
  });
  var E = [["Mesure", "lit du patient"], ["Saisie DPI", ""], ["HL7", "message"], ["Base de données", "production"], ["ETL", "entrepôt"], ["Analyse", "interprétation"], ["Décision", "comité médical"]];
  var N = E.map(function (e, i) { return { t: e[0], sous: e[1] || null, x: 10 + i * 136, y: i % 2 ? 230 : 70, w: 122, h: 100, taille: 16 }; });
  A.etapesFig(f, N, [
    "La tension est mesurée au lit du patient.",
    "Elle est saisie dans le DPI : première occasion d'erreur de frappe.",
    "Elle part dans un message HL7 vers les autres systèmes.",
    "Elle est enregistrée dans la base de données de production.",
    "L'ETL l'extrait, la transforme et la charge dans l'entrepôt : formats de date, virgules décimales, champs vides...",
    "On l'analyse et on l'interprète.",
    "Elle sert à une décision du comité médical. Six passages : six risques d'erreur. D'où le doute scientifique de l'analyste."
  ], { depart: "Avance pour suivre la donnée, de la mesure à la décision." });

  var f2 = R.figure("fig-chaine", {
    largeur: 960, hauteur: 170, titre: "Chaque passage est un risque",
    essai: "<strong>Essaie</strong> : change la fiabilité d'un passage et leur nombre. <strong>Observe</strong> : même à 99 %, une longue chaîne perd des valeurs. (Calcul ajouté au cours.)"
  });
  var g = A.s("g", null, f2.svg);
  var cp = R.curseur(f2.reglages, { nom: "Fiabilité d'un passage", min: 0.9, max: 1, pas: 0.005, val: 0.99, dec: 3 });
  var cn = R.curseur(f2.reglages, { nom: "Nombre de passages", min: 1, max: 10, pas: 1, val: 6 });
  function dessiner() {
    A.vider(g);
    var p = cp.v, nb = cn.v, P = A.calc.chaine(p, nb), bonnes = Math.round(P * 100);
    for (var i = 0; i < 100; i++) A.s("rect", { x: 40 + (i % 25) * 22, y: 30 + Math.floor(i / 25) * 22, width: 18, height: 18, rx: 4, fill: i < bonnes ? C.ok : C.ko }, g);
    A.texte(g, "sur 100 valeurs", [315, 135], { taille: 14, coul: C.doux });
    A.texte(g, (P * 100).toFixed(1).replace(".", ",") + " %", [770, 80], { taille: 46, mono: true, gras: 800, coul: P > 0.95 ? C.ok : P > 0.85 ? "#b07d14" : C.ko });
    A.texte(g, "arrivent intactes", [770, 130], { taille: 17, coul: C.doux });
    R.rendre(f2.direct, String(p).replace(".", "{,}") + "^{" + nb + "} \\approx " + P.toFixed(3).replace(".", "{,}"));
  }
  cp.surChange(dessiner); cn.surChange(dessiner);
  dessiner();
})();
