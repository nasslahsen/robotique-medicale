/* Figure : les cinq composants autour du système d'information. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-composants", {
    largeur: 960, hauteur: 540, titre: "Les cinq composants d'un SI",
    essai: "<strong>Essaie</strong> : touche chaque composant. <strong>Observe</strong> : chacun renvoie à une page du chapitre."
  });
  var T = [
    ["Organisation", "processus, procédures, workflow, maturité, cartographie, schéma directeur. La façon dont le travail est organisé."],
    ["Logiciels", "logiciels système (OS, hyperviseurs) et applications métiers (ERP, CRM, développement spécifique)."],
    ["Données", "rassemblées dans des bases de données, gérées par un SGBD, modélisées avec UML ou Merise."],
    ["Matériel", "serveurs (locaux ou cloud), ordinateurs, imprimantes, équipements spécifiques, et le réseau."],
    ["Personnels", "acteurs internes (direction de gestion, métier, SI) et externes (partenaires, clients, fournisseurs, régulateurs)."]
  ];
  var items = T.map(function (t, k) {
    var a = -Math.PI / 2 + k * 2 * Math.PI / 5, c = [480 + 280 * Math.cos(a), 285 + 195 * Math.sin(a)], st = A.BACS[k];
    return { x: c[0] - 110, y: c[1] - 44, w: 220, h: 88, t: t[0], texte: t[1], coul: st.coul, pale: st.pale, taille: 22, rx: 44 };
  });
  A.explorer(f, items, { fond: function (g) {
    items.forEach(function (it) { A.s("line", { x1: 480, y1: 285, x2: it.x + it.w / 2, y2: it.y + it.h / 2, stroke: C.trait, "stroke-width": 4 }, g); });
    A.s("circle", { cx: 480, cy: 285, r: 82, fill: C.jeu }, g);
    A.texte(g, "Système d'information", [480, 285], { taille: 19, coul: "#fff", halo: false, gras: 800, largeur: 130 });
  } });
})();
