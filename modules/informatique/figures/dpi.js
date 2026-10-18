/* Figure : portée des dossiers, de l'hôpital au pays. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-portees", {
    largeur: 960, hauteur: 540, titre: "De l'hôpital au pays",
    essai: "<strong>Essaie</strong> : touche chaque cadre, du plus petit au plus grand. <strong>Observe</strong> : chaque nom correspond à une portée plus large."
  });
  var items = [
    { x: 10, y: 10, w: 940, h: 520, t: "DSN", sous: "portée nationale, profil de santé complet", coul: C.v, pale: C.vPale, texte: "un DPI de portée nationale, avec un profil de santé complet : passages dans les structures hospitalières, médecins de ville, vaccination...", haut: true },
    { x: 40, y: 70, w: 700, h: 440, t: "DPP", coul: C.acc, pale: C.accPale, texte: "un dossier accessible par plusieurs acteurs, potentiellement dans plusieurs établissements.", haut: true },
    { x: 70, y: 130, w: 360, h: 360, t: "Dossier communiquant", coul: C.turq, pale: C.turqPale, texte: "un DPI capable d'échanger des données avec d'autres systèmes à l'intérieur d'un hôpital (ex. le LIS envoie un résultat vers le DPI).", haut: true, taille: 17 },
    { x: 100, y: 200, w: 220, h: 150, t: "DPI", sous: "dont DSI / DMI", coul: C.jeu, pale: C.jeuPale, texte: "le dossier informatique des données médicales du patient, et le logiciel pour y accéder. Le dossier de soins (DSI) et le dossier médical (DMI) en font partie.", taille: 24 },
    { x: 470, y: 200, w: 240, h: 150, t: "Clinique B", sous: "un autre établissement", texte: "un autre établissement, qui accède au même dossier partagé." },
    { x: 770, y: 200, w: 160, h: 150, t: "Ville", sous: "médecin de ville, vaccination", texte: "le reste du parcours de santé, hors des établissements : il entre dans le DSN." }
  ];
  A.explorer(f, items, { devant: function (g) {
    A.boite(g, 110, 400, 90, 60, { titre: "LIS", taille: 16 }); A.fleche(g, [160, 398], [190, 352], { ep: 3, coul: C.turq });
    A.fleche(g, [322, 275], [468, 275], { ep: 3, coul: C.acc, double: true });
  } });
})();
