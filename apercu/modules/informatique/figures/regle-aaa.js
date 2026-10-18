/* Figure : la règle AAA, sur la connexion d'une infirmière au DPI. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-aaa", {
    largeur: 960, hauteur: 420, titre: "La règle AAA",
    essai: "<strong>Essaie</strong> : avance étape par étape. <strong>Observe</strong> : chaque A répond à une question différente, dans cet ordre."
  });
  var N = [
    { t: "Authentification", sous: "qui es-tu ? Badge et code", x: 20, y: 60, w: 280, h: 140 },
    { t: "Autorisation", sous: "qu'as-tu le droit de faire ? Les patients de son service", x: 340, y: 60, w: 280, h: 140 },
    { t: "Traçabilité (accounting)", sous: "qu'as-tu fait ? Le journal des accès", x: 660, y: 60, w: 280, h: 140 }
  ];
  A.etapesFig(f, N, [
    "L'infirmière passe son badge et tape son code : le DPI sait qui elle est.",
    "Son profil ne lui montre que les patients de son service, et ne lui permet pas de prescrire.",
    "Le journal note : « Inf. Saadi a consulté le dossier 4471 à 07:12 ». Sans cette trace, un abus resterait invisible."
  ], { taille: 22, fond: function (g, k) {
    A.icone(g, "personne", [100, 300], 60, C.doux);
    if (k >= 1) A.icone(g, "cadenas", [480, 300], 60, k >= 2 ? C.ok : C.acc);
    if (k >= 3) A.icone(g, "document", [800, 300], 60, C.v);
    A.texte(g, "Il faut aussi savoir agir comme un hacker (sécurité offensive) : une seule faille suffit à l'attaquant.", [480, 390], { taille: 15, coul: C.doux });
  }, depart: "Une infirmière ouvre le DPI à 7 h. Avance pour voir les trois A." });
})();
