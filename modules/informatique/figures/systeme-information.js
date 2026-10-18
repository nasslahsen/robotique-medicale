/* Figure : le schéma d'un système d'information en vues (métier, fonctionnelle, application, technique, information). */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-vues", {
    largeur: 960, hauteur: 540, titre: "Schéma d'un système d'information",
    essai: "<strong>Essaie</strong> : touche chaque vue. <strong>Observe</strong> : les deux couches du bas forment la vue système informatique ; la vue information traverse tout."
  });
  var V = [
    { t: "Vue métier", sous: "processus", y: 70, coul: C.v, pale: C.vPale, texte: "les processus de l'organisation. À l'hôpital : admettre un patient, prescrire, soigner, facturer." },
    { t: "Vue fonctionnelle", sous: "organisation", y: 175, coul: C.acc, pale: C.accPale, texte: "l'organisation : qui fait quoi, dans quel service, avec quelles fonctions du SI." },
    { t: "Vue application", sous: "composants", y: 280, coul: C.turq, pale: C.turqPale, texte: "les composants logiciels : module RDV, DPI, LIS, RIS... Elle fait partie de la vue système informatique." },
    { t: "Vue technique", sous: "infrastructure", y: 385, coul: C.brun, pale: C.brunPale, texte: "l'infrastructure : serveurs, réseau, postes. Elle fait partie de la vue système informatique." }
  ];
  var items = V.map(function (v) { return { x: 300, y: v.y, w: 380, h: 88, t: v.t, sous: v.sous, coul: v.coul, pale: v.pale, texte: v.texte, taille: 21 }; });
  items.push({ x: 150, y: 70, w: 120, h: 403, t: "Vue information", sous: "les données", coul: C.ok, pale: C.okPale, texte: "les données, qui traversent toutes les couches : chaque processus, chaque composant les produit ou les utilise.", taille: 17 });
  items.push({ x: 20, y: 70, w: 110, h: 403, t: "Référentiels", sous: "standards et normes, charte d'urbanisme", coul: C.gris, pale: C.fond, texte: "les standards et normes, et la charte d'urbanisme, qui encadrent toutes les vues.", taille: 15, tailleSous: 12 });
  A.explorer(f, items, { fond: function (g) {
    A.texte(g, "Stratégie", [490, 28], { taille: 18, gras: 800, coul: C.doux }); A.fleche(g, [490, 40], [490, 66], { ep: 3 });
    A.texte(g, "Technologie", [490, 520], { taille: 18, gras: 800, coul: C.doux }); A.fleche(g, [490, 500], [490, 476], { ep: 3 });
    A.s("path", { d: "M700 286 H720 V470 H700", fill: "none", stroke: C.encre, "stroke-width": 3 }, g);
    A.boite(g, 740, 330, 200, 90, { titre: "Vue système informatique", taille: 18, fond: C.accPale, bord: C.acc });
  } });
})();
