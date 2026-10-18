/* Figure : un SI avec trois SPOF (matériel, logiciel, humain), et le même SI rendu redondant. */
(function () {
  "use strict";
  var R = RM, A = SIS, C = A.C;
  var f = R.figure("fig-spof", {
    largeur: 960, hauteur: 540, titre: "Points de défaillance unique",
    essai: "<strong>Essaie</strong> : touche les éléments, puis ajoute la redondance. <strong>Observe</strong> : un élément doublé n'est plus un SPOF."
  });
  var red = false, ex;
  var B = function () { return [
    { x: 30, y: 30, w: 190, h: 64, t: "Poste 1", texte: "un poste parmi d'autres : s'il tombe, les autres continuent. Pas un SPOF." },
    { x: 260, y: 30, w: 190, h: 64, t: "Poste 2", texte: "pas un SPOF." },
    { x: 490, y: 30, w: 190, h: 64, t: "Poste 3", texte: "pas un SPOF." },
    { x: 720, y: 30, w: 190, h: 64, t: "Poste 4", texte: "pas un SPOF." },
    { x: 330, y: 150, w: 280, h: 70, t: red ? "Deux switchs" : "Switch central unique", coul: red ? C.ok : C.ko, pale: red ? C.okPale : C.koPale, bord: red ? C.ok : C.ko, texte: red ? "doublé : si l'un tombe, l'autre prend le relais." : "SPOF matériel (hardware) : s'il tombe, plus aucun poste ne joint les serveurs." },
    { x: 130, y: 280, w: 260, h: 70, t: "Serveur DPI A", texte: "deux serveurs : l'un remplace l'autre. Pas un SPOF." },
    { x: 550, y: 280, w: 260, h: 70, t: "Serveur DPI B (secours)", texte: "le secours du serveur A. Pas un SPOF." },
    { x: 250, y: 400, w: 440, h: 64, t: red ? "Base de données répliquée" : "Base de données : une seule instance", coul: red ? C.ok : C.ko, pale: red ? C.okPale : C.koPale, bord: red ? C.ok : C.ko, texte: red ? "répliquée : une copie est prête à reprendre." : "SPOF logiciel : si l'instance du SGBD s'arrête, plus de DPI." },
    { x: 30, y: 480, w: 330, h: 50, t: "Deux onduleurs", texte: "redondants : pas un SPOF." },
    { x: 400, y: 480, w: 530, h: 50, t: red ? "Mot de passe administrateur connu de deux personnes, gardé en coffre" : "Karim, seul à connaître le mot de passe administrateur", coul: red ? C.ok : C.ko, pale: red ? C.okPale : C.koPale, bord: red ? C.ok : C.ko, texte: red ? "le savoir est partagé de façon sûre : plus de SPOF humain." : "SPOF humain : si Karim est absent, personne ne peut administrer le système." }
  ]; };
  function lancer() {
    if (ex) ex.g.remove();
    var it = B(); it.forEach(function (x) { x.taille = 16; });
    ex = A.explorer(f, it, { fond: function (g) {
      [125, 355, 585, 815].forEach(function (x) { A.s("line", { x1: x, y1: 96, x2: 470, y2: 148, stroke: C.doux, "stroke-width": 2.5 }, g); });
      [260, 680].forEach(function (x) { A.s("line", { x1: 470, y1: 222, x2: x, y2: 278, stroke: C.doux, "stroke-width": 2.5 }, g); A.s("line", { x1: x, y1: 352, x2: 470, y2: 398, stroke: C.doux, "stroke-width": 2.5 }, g); });
    } });
  }
  var b = R.boutons(f.reglages), bt = R.bouton(b, "Ajouter la redondance", function () { red = !red; bt.textContent = red ? "Revenir au SI d'origine" : "Ajouter la redondance"; bt.classList.toggle("actif", red); lancer(); });
  lancer();
})();
