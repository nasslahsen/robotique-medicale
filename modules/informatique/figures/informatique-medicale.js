/* Figures : dualité DM / logiciel, et les trois disciplines de l'informatique médicale. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-dualite", {
    largeur: 960, hauteur: 420, titre: "Dualité DM / logiciel",
    essai: "<strong>Essaie</strong> : touche chaque partie. <strong>Observe</strong> : le DM capte, le logiciel interprète, l'ingénieur biomédical relie les deux."
  });
  A.explorer(f, [
    { x: 20, y: 90, w: 290, h: 240, t: "Le DM (matériel)", sous: "le corps du système : capteurs, acquisition de la donnée brute", coul: C.turq, pale: C.turqPale, taille: 24, tailleSous: 16, texte: "la physique du système. Les capteurs (piézoélectriques, électrodes...) mesurent une grandeur sur le patient et l'acquisition la transforme en donnée brute." },
    { x: 370, y: 160, w: 220, h: 100, t: "L'ingénieur biomédical", sous: "le pont entre les deux", coul: C.jeu, pale: C.jeuPale, taille: 20, tailleSous: 15, texte: "le cours le place entre le matériel et le logiciel : il connaît l'appareil, ses réglages, sa maintenance, et la façon dont ses données sont traitées." },
    { x: 650, y: 90, w: 290, h: 240, t: "Le software", sous: "l'intelligence du système : traitement du signal, aide à la décision", coul: C.v, pale: C.vPale, taille: 24, tailleSous: 16, texte: "le logiciel filtre et analyse la donnée brute (traitement du signal), puis aide le médecin à décider (aide à la décision médicale)." }
  ], { fond: function (g) { A.fleche(g, [314, 210], [366, 210], { ep: 4, double: true }); A.fleche(g, [594, 210], [646, 210], { ep: 4, double: true }); A.texte(g, "Exemple : un électrocardiographe", [480, 380], { taille: 17, coul: C.doux }); } });

  var f2 = R.figure("fig-venn", {
    largeur: 960, hauteur: 540, titre: "Les trois disciplines",
    essai: "<strong>Essaie</strong> : touche chaque zone des cercles. <strong>Observe</strong> : seule la zone commune aux trois est l'informatique médicale."
  });
  var g = A.s("g", null, f2.svg), choisi = -1;
  var CE = [{ c: [480, 200], t: "La médecine / biologie", coul: C.turq, lab: [480, 30] }, { c: [390, 355], t: "L'informatique", coul: C.v, lab: [250, 470] }, { c: [570, 355], t: "Les mathématiques / statistiques", coul: C.acc, lab: [720, 470] }];
  var Z = [
    { p: [480, 305], t: "Informatique médicale", d: "le cœur commun aux trois disciplines. L'informatique transforme la médecine d'une science réactive à une science prédictive." },
    { p: [480, 120], t: "Médecine seule", d: "la question clinique, sans outil pour traiter la masse des données." },
    { p: [320, 410], t: "Informatique seule", d: "des outils, sans question médicale ni preuve statistique." },
    { p: [640, 410], t: "Mathématiques seules", d: "des méthodes, sans données de santé ni outil." },
    { p: [420, 255], t: "Médecine et informatique", d: "on sait programmer la question médicale, mais personne ne vérifie si le résultat est dû au hasard." },
    { p: [540, 255], t: "Médecine et statistiques", d: "on sait juger un résultat, mais sans outil pour traiter de gros volumes de données." },
    { p: [480, 395], t: "Informatique et statistiques", d: "on sait calculer, mais sans question médicale." }
  ];
  function dessiner() {
    A.vider(g);
    CE.forEach(function (c) { A.s("circle", { cx: c.c[0], cy: c.c[1], r: 150, fill: c.coul, "fill-opacity": 0.12, stroke: c.coul, "stroke-width": 3 }, g); A.texte(g, c.t, c.lab, { taille: 19, gras: 800, coul: c.coul }); });
    Z.forEach(function (z, i) {
      A.s("circle", { cx: z.p[0], cy: z.p[1], r: i === 0 ? 30 : 16, fill: i === choisi ? (i === 0 ? C.jeu : C.encre) : "#fff", stroke: i === 0 ? C.jeu : C.encre, "stroke-width": 3 }, g);
      A.cible(g, z.p[0] - 34, z.p[1] - 34, 68, 68, function () { choisi = i; dessiner(); });
    });
    f2.direct.innerHTML = choisi >= 0 ? "<strong>" + Z[choisi].t + "</strong> : " + Z[choisi].d : "Touche un des points blancs.";
  }
  dessiner();
})();
