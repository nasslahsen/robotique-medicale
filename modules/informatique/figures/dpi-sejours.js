/* Figure : un DPI, ses séjours et leurs prestations. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-sejours", {
    largeur: 960, hauteur: 540, titre: "DPI et séjours patient",
    essai: "<strong>Essaie</strong> : touche chaque séjour. <strong>Observe</strong> : chaque prestation est rattachée à l'identifiant de son séjour, pas seulement au patient."
  });
  var S = [
    { t: "Séjour S-0412", sous: "consultation cardiologie, 3 mars ; diagnostic : palpitations", p: ["Ordonnance", "ECG de repos"] },
    { t: "Séjour S-0587", sous: "urgences, 20 avril ; diagnostic : douleur thoracique", p: ["ECG", "Troponine", "Score de tri"] },
    { t: "Séjour S-0611", sous: "hospitalisation, 2 au 6 mai ; diagnostic de sortie : angor", p: ["Coronarographie", "Transfert de lit", "Compte rendu de sortie"] }
  ];
  var items = S.map(function (s, k) { return { x: 290, y: 30 + k * 170, w: 300, h: 140, t: s.t, sous: s.sous, coul: C.acc, pale: C.accPale, taille: 20, tailleSous: 14, texte: "toutes ces prestations (" + s.p.join(", ").toLowerCase() + ") sont rattachées à l'identifiant unique de ce séjour." }; });
  A.explorer(f, items, {
    fond: function (g) {
      A.boite(g, 20, 30, 220, 150, { titre: "DPI", sous: "ID patient P-2231 ; nom et prénom ; date de naissance", fond: C.jeuPale, bord: C.jeu, ep: 3, taille: 26, tailleSous: 14 });
      A.chemin(g, [[242, 100], [286, 100]], { ep: 3, coul: C.doux }); [1, 2].forEach(function (k) { A.chemin(g, [[130, 182], [130, 100 + k * 170], [286, 100 + k * 170]], { ep: 3, coul: C.doux }); });
    },
    devant: function (g, ch) {
      S.forEach(function (s, k) { s.p.forEach(function (p, i) { var on = k === ch; A.boite(g, 630 + (i % 2) * 165, 38 + k * 170 + Math.floor(i / 2) * 66, 155, 56, { titre: p, taille: 14, fond: on ? C.accPale : "#fff", bord: on ? C.acc : C.trait, ep: on ? 2.5 : 1.5, rx: 8 }); }); A.fleche(g, [592, 100 + k * 170], [626, 100 + k * 170], { ep: 2.5, coul: k === ch ? C.acc : C.trait }); });
    }
  });
})();
