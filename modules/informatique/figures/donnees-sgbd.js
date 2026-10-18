/* Figure : ce que doit assurer un SGBD, autour de la base de données. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-sgbd", {
    largeur: 960, hauteur: 520, titre: "Ce qu'assure un SGBD",
    essai: "<strong>Essaie</strong> : touche chaque mission. <strong>Observe</strong> : trois langages (LDD, LMD, LCD) et deux garanties (intégrité, disponibilité)."
  });
  var M = [
    { t: "Définition (LDD)", sous: "CREATE, ALTER", texte: "définir les bases et les objets contenus. Exemple : CREATE TABLE patient, ALTER TABLE patient." },
    { t: "Manipulation (LMD)", sous: "INSERT, UPDATE", texte: "manipuler les données. Exemple : INSERT un nouveau séjour, UPDATE une adresse." },
    { t: "Contrôle d'accès (LCD)", sous: "GRANT, DENY", texte: "contrôler qui accède aux données. Exemple : GRANT lecture à l'infirmière, DENY au stagiaire." },
    { t: "Intégrité", sous: "contraintes, verrous", texte: "garder des données justes. Exemple : refuser une date de sortie avant la date d'entrée ; verrouiller une prescription modifiée par deux personnes." },
    { t: "Disponibilité", sous: "réplication, backup", texte: "garder les données accessibles. Exemple : basculer sur la copie répliquée quand le disque lâche ; restaurer la sauvegarde." }
  ];
  var items = M.map(function (m, k) { var a = -Math.PI / 2 + k * 2 * Math.PI / 5, c = [480 + 300 * Math.cos(a), 270 + 190 * Math.sin(a)], st = A.BACS[k]; return { x: c[0] - 125, y: c[1] - 45, w: 250, h: 90, t: m.t, sous: m.sous, texte: m.texte, coul: st.coul, pale: st.pale, taille: 19, tailleSous: 15 }; });
  A.explorer(f, items, { fond: function (g) {
    items.forEach(function (it) { A.s("line", { x1: 480, y1: 270, x2: it.x + it.w / 2, y2: it.y + it.h / 2, stroke: C.trait, "stroke-width": 4 }, g); });
    A.s("rect", { x: 405, y: 215, width: 150, height: 110, rx: 18, fill: C.jeuPale, stroke: C.jeu, "stroke-width": 3 }, g);
    A.icone(g, "base", [480, 255], 50, C.encre); A.texte(g, "SGBD", [480, 305], { taille: 20, gras: 800, halo: false });
  } });
})();
