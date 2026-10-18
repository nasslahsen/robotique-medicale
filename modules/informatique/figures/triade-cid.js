/* Figure : le triangle d'or CID, exemples et conséquences pour le patient. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-cid", {
    largeur: 960, hauteur: 520, titre: "Triangle d'or (CIA / CID)",
    essai: "<strong>Essaie</strong> : touche chaque critère. <strong>Observe</strong> : les trois convergent vers la même chose, la sécurité du patient."
  });
  var it = [
    { x: 40, y: 150, w: 280, h: 160, t: "Confidentialité", sous: "DPI, imagerie, génétique...", coul: C.ko, pale: C.koPale, texte: "atteinte : la vie privée du patient. Exemple ajouté : une analyse génétique divulguée." },
    { x: 340, y: 20, w: 280, h: 160, t: "Intégrité", sous: "posologie, résultats de labos...", coul: C.ok, pale: C.okPale, texte: "atteinte : erreur de soins, souvent non détectable. Exemple ajouté : une posologie modifiée dans la base." },
    { x: 640, y: 150, w: 280, h: 160, t: "Disponibilité", sous: "monitorage, PACS...", coul: C.v, pale: C.vPale, texte: "atteinte : retard de prise en charge. Exemple ajouté : le PACS en panne avant une intervention." }
  ];
  it.forEach(function (x) { x.fond = x.pale; x.bord = x.coul; x.taille = 24; x.tailleSous = 16; });
  A.explorer(f, it, { fond: function (g) {
    A.s("circle", { cx: 480, cy: 410, r: 95, fill: C.acc }, g);
    A.texte(g, "Données des patients = sécurité du patient", [480, 410], { taille: 17, coul: "#fff", halo: false, gras: 800, largeur: 150 });
    A.fleche(g, [250, 312], [400, 360], { ep: 5, coul: C.ko }); A.fleche(g, [480, 182], [480, 312], { ep: 5, coul: C.ok }); A.fleche(g, [710, 312], [560, 360], { ep: 5, coul: C.v });
  } });
})();
