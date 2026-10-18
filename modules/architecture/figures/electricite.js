/* Figure : trois alimentations ; couper le réseau et voir qui prend le relais, puis quels équipements restent alimentés. */
(function () {
  "use strict";
  var R = RM, A = ARCHI, C = A.C;
  var f = R.figure("fig-alim", {
    largeur: 960, hauteur: 540, titre: "Alimentation normale, de sécurité, de secours",
    essai: "<strong>Essaie</strong> : coupe le réseau, puis relance-le. <strong>Observe</strong> : l'onduleur alimente sans coupure les équipements critiques pendant le démarrage du groupe ; ensuite le groupe fournit l'alimentation de sécurité. Répartition des équipements : exemple ajouté."
  });
  var g = A.s("g", null, f.svg);
  var etat = "normal", minuterie = null; // normal, demarrage, groupe
  var b = R.boutons(f.reglages);
  var bc = R.bouton(b, "Couper le réseau", function () {
    if (etat === "normal") { etat = "demarrage"; dessiner(); clearTimeout(minuterie); minuterie = setTimeout(function () { etat = "groupe"; dessiner(); }, 2200); }
    else { clearTimeout(minuterie); etat = "normal"; dessiner(); }
  });
  var zone = R.h("div", null, "", f.direct);
  var EQ = [["Respirateur", "ups"], ["Moniteur multiparamétrique", "ups"], ["Équipements d'anesthésie", "ups"], ["Table et éclairage opératoire", "ups"], ["Systèmes informatiques", "ups"], ["Imagerie médicale", "secu"], ["Lit médicalisé", "normale"]];
  function dessiner() {
    A.vider(g);
    bc.textContent = etat === "normal" ? "Couper le réseau" : "Rétablir le réseau";
    var on = { normale: etat === "normal", secu: etat !== "demarrage", ups: true };
    A.boite(g, 20, 20, 240, 70, { fond: on.normale ? "#fff" : C.koPale, bord: on.normale ? C.encre : C.ko, titre: "Réseau électrique principal", taille: 17 });
    A.boite(g, 20, 110, 240, 70, { fond: etat === "groupe" ? C.okPale : "#fff", bord: etat === "groupe" ? C.ok : C.encre, titre: "Groupes électrogènes", sous: etat === "normal" ? "à l'arrêt" : etat === "demarrage" ? "en démarrage" : "en marche", taille: 17 });
    A.boite(g, 20, 200, 240, 70, { fond: C.okPale, bord: C.ok, titre: "Onduleur UPS", sous: etat === "normal" ? "en veille, chargé" : "alimente sans coupure", taille: 17 });
    [["Alimentation normale", on.normale, 20], ["Alimentation de sécurité", on.secu, 110], ["Alimentation de secours", on.ups, 200]].forEach(function (a) {
      A.fleche(g, [262, a[2] + 35], [320, a[2] + 35], { coul: a[1] ? C.acc : C.gris, ep: 4 });
      A.boite(g, 324, a[2], 250, 70, { fond: a[1] ? "#fff" : C.koPale, bord: a[1] ? C.acc : C.ko, ep: 3, titre: a[0], taille: 17 });
      A.fleche(g, [576, a[2] + 35], [690, 160], { coul: a[1] ? C.acc : C.gris, ep: 3 });
    });
    A.boite(g, 694, 130, 240, 60, { fond: C.fond, titre: "Tableau du bloc", taille: 17 });
    EQ.forEach(function (e, i) {
      var x = 20 + (i % 4) * 236, y = 300 + Math.floor(i / 4) * 120, ali = on[e[1]];
      A.boite(g, x, y, 220, 104, { fond: ali ? "#fff" : C.fond, bord: ali ? C.ok : C.gris, ep: 2.5, titre: e[0], sous: ali ? "alimenté" : "éteint", taille: 16, coul: ali ? C.encre : C.gris, coulSous: ali ? C.ok : C.ko });
    });
    zone.innerHTML = etat === "normal" ? "Fonctionnement normal : le réseau principal alimente tout ; le groupe est à l'arrêt, l'onduleur en veille." : etat === "demarrage" ? "Coupure : le groupe démarre. Seuls les équipements raccordés à l'onduleur restent alimentés, sans interruption." : "Le groupe est en marche : l'alimentation de sécurité reprend (ici l'imagerie). Le lit médicalisé, sur l'alimentation normale seule, attend le retour du réseau.";
  }
  dessiner();
})();
