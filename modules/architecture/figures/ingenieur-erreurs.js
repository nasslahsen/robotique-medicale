/* Figure : frise d'un projet ; ce que fait l'ingénieur biomédical à chaque phase, et ce qu'on perd s'il arrive tard. */
(function () {
  "use strict";
  var R = RM, A = ARCHI, C = A.C;
  var f = R.figure("fig-role", {
    largeur: 960, hauteur: 540, titre: "L'ingénieur biomédical, de la conception à la fin de vie",
    essai: "<strong>Essaie</strong> : choisis le moment où l'ingénieur biomédical entre dans le projet. <strong>Observe</strong> : tout ce qui se décide avant son arrivée lui échappe, et les erreurs du cours apparaissent. Regroupement des responsabilités par phase ajouté."
  });
  var g = A.s("g", null, f.svg);
  var c = { v: 0 }, bts = [];
  var bb = R.boutons(f.reglages);
  ["Arrive à la conception", "Arrive au chantier", "Arrive à la réception", "Arrive en exploitation"].forEach(function (t, i) { bts.push(R.bouton(bb, t, function () { c.v = i; dessiner(); })); });
  var zone = R.h("div", null, "", f.direct);
  var PH = [["Conception", ["Besoins biomédicaux", "Spécifications techniques", "Implantation des équipements", "Interfaces", "Contraintes CVC", "Accès pour maintenance"]], ["Chantier", ["Vérification des alimentations", "Vérification des gaz médicaux"]], ["Réception", ["Réception technique", "Sécurité électrique", "Formation"]], ["Exploitation", ["Maintenance", "GMAO", "Gestion du cycle de vie"]]];
  var ERR = [[], ["1 : salle construite avant de connaître les équipements", "3 : accès de maintenance oubliés", "9 : fluides médicaux non intégrés dès la conception"], ["1, 3, 9, et 7 ou 8 : électricité sous-dimensionnée, secours oublié"], ["La plupart des dix erreurs ne se rattrapent plus"]];
  function dessiner() {
    A.vider(g);
    var k = c.v;
    bts.forEach(function (bt, i) { bt.classList.toggle("actif", i === k); });
    A.s("line", { x1: 40, y1: 90, x2: 920, y2: 90, stroke: C.encre, "stroke-width": 5 }, g);
    A.fleche(g, [880, 90], [940, 90], { coul: C.encre, ep: 5 });
    PH.forEach(function (p, i) {
      var x = 50 + i * 225, actif = i >= k;
      A.s("circle", { cx: x + 100, cy: 90, r: 20, fill: actif ? C.jeu : "#fff", stroke: actif ? "#fff" : C.gris, "stroke-width": 4 }, g);
      A.texte(g, p[0], [x + 100, 40], { taille: 19, gras: 800, coul: actif ? C.encre : C.gris });
      p[1].forEach(function (t, j) {
        A.boite(g, x, 130 + j * 56, 205, 46, { fond: actif ? A.C.jeuPale : C.fond, bord: actif ? C.jeu : C.trait, ep: 2, rx: 8, titre: t, taille: 14, coul: actif ? C.encre : C.gris, tirets: actif ? null : "6 5" });
      });
    });
    A.icone(g, "personne", [150 + k * 225, 90], 30, "#fff");
    zone.innerHTML = k === 0 ? "Arrivée à la conception : l'ingénieur biomédical pèse sur toutes les décisions. C'est ce que demande le cours : avant la construction, et non seulement à la réception." : "<span class=\"alerte\">Arrivée en phase « " + PH[k][0].toLowerCase() + " » :</span> les décisions grisées ont été prises sans lui. Erreurs fréquentes à craindre : " + ERR[k].join(" ; ") + ".";
  }
  dessiner();
})();
