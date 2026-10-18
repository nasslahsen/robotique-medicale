/* Figure : trois locaux en enfilade ; régler leurs pressions et ouvrir les portes pour voir le sens de l'air. */
(function () {
  "use strict";
  var R = RM, A = ARCHI, C = A.C, Z = A.ZONES;
  var f = R.figure("fig-cascade", {
    largeur: 960, hauteur: 540, titre: "Cascade de pression",
    essai: "<strong>Essaie</strong> : change les niveaux de pression avec les boutons + et −, puis ouvre les portes. <strong>Observe</strong> : l'air va toujours du niveau le plus haut au plus bas ; la cascade du cours fait sortir l'air de la salle vers la circulation. Les niveaux ne sont pas des valeurs."
  });
  var g = A.s("g", null, f.svg), ga = A.s("g", null, f.svg);
  var p = [2, 1, 0], ouvert = false, u = 1;
  var PI = [["Salle opératoire", "restreinte"], ["Préparation / zone intermédiaire", "semi"], ["Circulation", "publique"]];
  var NIV = ["0", "+", "++", "+++"];
  var b = R.boutons(f.reglages);
  PI.forEach(function (pc, i) {
    var nom = ["Salle", "Préparation", "Circulation"][i];
    R.bouton(b, nom + " −", function () { p[i] = Math.max(0, p[i] - 1); dessiner(); });
    R.bouton(b, nom + " +", function () { p[i] = Math.min(3, p[i] + 1); dessiner(); });
  });
  var b2 = R.boutons(f.reglages);
  var bo = R.bouton(b2, "Ouvrir les portes", function () { ouvert = !ouvert; bo.textContent = ouvert ? "Fermer les portes" : "Ouvrir les portes"; dessiner(); if (ouvert) A.animer(2600, function (x) { u = x; fleches(); }); });
  R.bouton(b2, "Cascade du cours", function () { p = [2, 1, 0]; dessiner(); });
  var zone = R.h("div", null, "", f.direct);
  function fleches() {
    A.vider(ga);
    if (!ouvert) return;
    [[0, 1, 320], [1, 2, 640]].forEach(function (d) {
      var s = A.calc.sensAir(p[d[0]], p[d[1]]), x = d[2];
      if (u >= 1) { if (s) A.fleche(ga, [x - 50 * s, 290], [x + 50 * s, 290], { coul: s > 0 ? C.ok : C.ko, ep: 8 }); else A.texte(ga, "pas de sens net", [x, 250], { taille: 14, coul: C.doux }); return; }
      if (s) A.souffle(ga, [x - 60 * s, 290], [x + 60 * s, 290], u, { nb: 3, coul: s > 0 ? C.ok : C.ko, ecart: 30 });
    });
  }
  function dessiner() {
    A.vider(g);
    PI.forEach(function (pc, i) {
      var x = 20 + i * 320, st = Z[pc[1]];
      A.boite(g, x, 80, 280, 400, { fond: st.fond, bord: st.bord, ep: 3 });
      A.texte(g, pc[0], [x + 140, 120], { taille: 19, largeur: 250, halo: false });
      A.boite(g, x + 80, 240, 120, 90, { fond: "#fff", bord: C.encre, ep: 3, rx: 16, titre: NIV[p[i]], taille: 36 });
      A.texte(g, "pression", [x + 140, 350], { taille: 15, coul: C.doux, halo: false });
    });
    [300, 620].forEach(function (x) { A.s("rect", { x: x, y: 230, width: 40, height: 120, fill: ouvert ? "#fff" : "#c9d3e6", stroke: C.encre, "stroke-width": ouvert ? 0 : 2 }, g); });
    var ok = p[0] > p[1] && p[1] > p[2];
    zone.innerHTML = ok ? "Cascade correcte : salle > préparation > circulation. À chaque porte, l'air va du plus propre vers le moins propre." : "<span class=\"alerte\">Cascade cassée :</span> " + (p[0] <= p[1] ? "la salle n'est pas au-dessus de la préparation, l'air de la préparation peut entrer dans la salle." : "la préparation n'est pas au-dessus de la circulation.");
    fleches();
  }
  dessiner();
})();
