/* Figure : trois onglets de sécurité (incendie, patient, personnel) sur le plan d'un bloc. */
(function () {
  "use strict";
  var R = RM, A = ARCHI, C = A.C;
  var f = R.figure("fig-securite", {
    largeur: 960, hauteur: 540, titre: "Trois sécurités à concevoir",
    essai: "<strong>Essaie</strong> : passe d'un onglet à l'autre et touche les points. <strong>Observe</strong> : chaque risque a sa réponse architecturale ou technique."
  });
  var g = A.s("g", null, f.svg), onglet = "incendie", sel = 0;
  var D = {
    incendie: [[[150, 90], "Détection incendie", "des détecteurs dans chaque local."], [[480, 270], "Compartimentage", "des murs et portes coupe-feu qui contiennent le feu."], [[770, 440], "Évacuation et signalisation", "des issues balisées."], [[100, 500], "Accès pompiers", "un accès extérieur prévu."], [[700, 150], "Risques propres au bloc", "oxygène, équipements électriques, produits inflammables éventuels, équipements thermiques."], [[300, 400], "Matériaux adaptés et alimentation de sécurité", "des matériaux qui ne propagent pas le feu ; une énergie qui tient pendant l'incendie."]],
    patient: [[[220, 250], "Chute", "brancard, transfert, table."], [[220, 130], "Erreur d'identification", "contrôles à l'entrée du bloc."], [[480, 320], "Infection", "zones, flux, air, surfaces."], [[620, 360], "Brûlure électrique", "sécurité électrique des appareils et de l'installation."], [[760, 120], "Interruption de l'alimentation", "équipements critiques sur alimentation secourue."], [[760, 220], "Mauvaise connexion des gaz médicaux", "prises identifiées, bien placées."], [[480, 120], "Incendie et défaut de ventilation", "voir l'onglet incendie et le chapitre 4."]],
    personnel: [[[620, 360], "Risque électrique", "installation et appareils sûrs."], [[760, 300], "Rayonnements ionisants", "protection radiologique calculée."], [[480, 120], "Gaz anesthésiques", "évacuation des gaz, ventilation."], [[300, 320], "Agents biologiques", "flux séparés, tri des déchets."], [[160, 440], "Manutention manuelle", "ergonomie, stockage proche."], [[840, 440], "Exposition au bruit", "acoustique."], [[160, 130], "Température excessive", "maîtrise de la température."]]
  };
  var b = R.boutons(f.reglages), bts = {};
  [["incendie", "Incendie"], ["patient", "Sécurité du patient"], ["personnel", "Sécurité du personnel"]].forEach(function (o) { bts[o[0]] = R.bouton(b, o[1], function () { onglet = o[0]; sel = 0; dessiner(); }); });
  var zone = R.h("div", null, "", f.direct);
  function dessiner() {
    A.vider(g);
    Object.keys(bts).forEach(function (k) { bts[k].classList.toggle("actif", k === onglet); });
    A.s("rect", { x: 40, y: 40, width: 880, height: 460, fill: "#fff", stroke: C.encre, "stroke-width": 5 }, g);
    if (onglet === "incendie") { A.s("line", { x1: 480, y1: 40, x2: 480, y2: 500, stroke: C.ko, "stroke-width": 8 }, g); A.icone(g, "feu", [300, 220], 60, C.ko); A.boite(g, 830, 450, 90, 40, { fond: C.ok, bord: C.ok, rx: 6, titre: "SORTIE", taille: 13, coul: "#fff" }); }
    else { A.s("rect", { x: 440, y: 180, width: 80, height: 240, rx: 10, fill: "#d9dde6", stroke: C.encre, "stroke-width": 2.5 }, g); A.s("circle", { cx: 480, cy: 210, r: 16, fill: "#f6c2b0" }, g); }
    D[onglet].forEach(function (p, i) {
      var on = sel === i;
      A.s("circle", { cx: p[0][0], cy: p[0][1], r: 22, fill: on ? C.jeu : "#fff", stroke: on ? "#fff" : C.jeu, "stroke-width": 3 }, g);
      A.texte(g, String(i + 1), p[0], { taille: 17, coul: on ? "#fff" : C.jeu, halo: false, gras: 800 });
      A.cible(g, p[0][0] - 32, p[0][1] - 32, 64, 64, function () { sel = i; dessiner(); });
    });
    var p = D[onglet][sel];
    zone.innerHTML = "<strong>" + (sel + 1) + ". " + p[1] + "</strong> : " + p[2];
  }
  dessiner();
})();
